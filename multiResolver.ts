/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { IRequest } from "@fluidframework/component-core-interfaces";
import { InsecureUrlResolver } from "@fluidframework/test-runtime-utils";
// eslint-disable-next-line import/no-internal-modules
import uuid from "uuid/v4";
import { getRandomName } from "@fluidframework/server-services-client";
import { IDevServerUser } from "./loader";

const tinyliciousUrl = "http://172.23.176.1";
const tinyliciousPort = 3000;

const tenantId = "tinylicious";
const tenantKey = "12345"; // random

function getUrlResolver(
    documentId: string
): IUrlResolver {
    return new InsecureUrlResolver(
                `${tinyliciousUrl}:${tinyliciousPort}`,
                `${tinyliciousUrl}:${tinyliciousPort}`,
                `${tinyliciousUrl}:${tinyliciousPort}`,
                tenantId,
                tenantKey,
                getUser(),
                "bearer");
}

const getUser = (): IDevServerUser => ({
    id: uuid(),
    name: getRandomName(),
});

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
            return (this.urlResolver as InsecureUrlResolver).createCreateNewRequest(fileName);
    }
}
