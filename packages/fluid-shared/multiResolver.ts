/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { IRequest } from "@fluidframework/component-core-interfaces";
// import { InsecureUrlResolver } from "@fluidframework/test-runtime-utils";
// eslint-disable-next-line import/no-internal-modules
import uuid from "uuid/v4";
import { getRandomName } from "@fluidframework/server-services-client";

import jwt from "jsonwebtoken";

import {
    ITokenClaims,
} from "@fluidframework/protocol-definitions";


import assert from "assert";
import { parse } from "url";
import {
    IFluidResolvedUrl,
    CreateNewHeader,
} from "@fluidframework/driver-definitions";


const tinyliciousUrl = "http://172.23.80.1";
const tinyliciousPort = 3000;

const tenantId = "tinylicious";
const tenantKey = "12345"; // random

export interface IUser {
    id: string;
}

interface IDevServerUser extends IUser {
    name: string;
}

const getUser = (): IDevServerUser => ({
    id: uuid(),
    name: getRandomName(),
});


export class MyUrlResolver implements IUrlResolver {
    private readonly cache = new Map<string, Promise<IResolvedUrl>>();

    constructor(
        private readonly hostUrl: string,
        private readonly ordererUrl: string,
        private readonly storageUrl: string,
        private readonly tenantId: string,
        private readonly tenantKey: string,
        private readonly user: IUser,
        private readonly bearer: string,
    ) { }

    public async resolve(request: IRequest): Promise<IResolvedUrl> {
        if (request.headers?.[CreateNewHeader.createNew]) {
            const [, queryString] = request.url.split("?");

            const searchParams = new URLSearchParams(queryString);
            const fileName = searchParams.get("fileName");
            if (!fileName) {
                throw new Error("FileName should be there!!");
            }
            return this.resolveHelper(fileName);
        }
        const parsedUrl = new URL(request.url);

        const documentId = parsedUrl.pathname.substr(1).split("/")[0];
        return this.resolveHelper(documentId);
    }

    private resolveHelper(documentId: string) {
        const encodedTenantId = encodeURIComponent(this.tenantId);
        const encodedDocId = encodeURIComponent(documentId);

        const documentUrl = `fluid://${new URL(this.ordererUrl).host}/${encodedTenantId}/${encodedDocId}`;
        const deltaStorageUrl = `${this.ordererUrl}/deltas/${encodedTenantId}/${encodedDocId}`;
        const storageUrl = `${this.storageUrl}/repos/${encodedTenantId}`;

        const response: IFluidResolvedUrl = {
            endpoints: {
                deltaStorageUrl,
                ordererUrl: this.ordererUrl,
                storageUrl,
            },
            tokens: { jwt: this.auth(this.tenantId, documentId) },
            type: "fluid",
            url: documentUrl,
        };
        return response;
    }

    public async getAbsoluteUrl(resolvedUrl: IResolvedUrl, relativeUrl: string): Promise<string> {
        const fluidResolvedUrl = resolvedUrl as IFluidResolvedUrl;

        const parsedUrl = parse(fluidResolvedUrl.url);
        if(!parsedUrl.pathname)
            throw "";

        const [, , documentId] = parsedUrl.pathname?.split("/");
        assert(documentId);

        let url = relativeUrl;
        if (url.startsWith("/")) {
            url = url.substr(1);
        }

        return `${this.hostUrl}/${encodeURIComponent(
            this.tenantId)}/${encodeURIComponent(documentId)}/${url}`;
    }

    public createCreateNewRequest(fileName: string): IRequest {
        const createNewRequest: IRequest = {
            url: `${this.hostUrl}?fileName=${fileName}`,
            headers: {
                [CreateNewHeader.createNew]: true,
            },
        };
        return createNewRequest;
    }

    private auth(tenantId: string, documentId: string) {
        const claims: ITokenClaims = {
            documentId,
            scopes: ["doc:read", "doc:write", "summary:write"],
            tenantId,
            user: this.user,
        };

        return jwt.sign(claims, this.tenantKey);

    }
}


function getUrlResolver(
    documentId: string
): IUrlResolver {
    return new MyUrlResolver(
                `${tinyliciousUrl}:${tinyliciousPort}`,
                `${tinyliciousUrl}:${tinyliciousPort}`,
                `${tinyliciousUrl}:${tinyliciousPort}`,
                tenantId,
                tenantKey,
                getUser(),
                "bearer");
}

export class MultiUrlResolver implements IUrlResolver {
    public readonly isExperimentalUrlResolver = true;
    private readonly urlResolver: IUrlResolver;
    constructor(
        private readonly rawUrl: string,
        private readonly documentId: string) {
        this.urlResolver = getUrlResolver(documentId);
    }

    async getAbsoluteUrl(resolvedUrl: IResolvedUrl, relativeUrl: string): Promise<string> {
        let url = relativeUrl;
        if (url.startsWith("/")) {
            url = url.substr(1);
        }
        return `${this.rawUrl}/${this.documentId}/${url}`;
    }

    async resolve(request: IRequest): Promise<IResolvedUrl | undefined> {
        return this.urlResolver.resolve(request);
    }

    public createRequestForCreateNew(
        fileName: string,
    ): IRequest {
            return (this.urlResolver as MyUrlResolver).createCreateNewRequest(fileName);
    }
}
