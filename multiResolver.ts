/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { IRequest } from "@fluidframework/component-core-interfaces";
import { TestResolver } from "@fluidframework/local-driver";
import { InsecureUrlResolver } from "@fluidframework/test-runtime-utils";
// eslint-disable-next-line import/no-internal-modules
import uuid from "uuid/v4";
import { getRandomName } from "@fluidframework/server-services-client";
import { RouteOptions, IDevServerUser } from "./loader";
import { OdspUrlResolver } from "./odspUrlResolver";

function getUrlResolver(
    documentId: string
): IUrlResolver {
    
// Tinylicious
    return new InsecureUrlResolver(
                "http://localhost:3000",
                "http://localhost:3000",
                "http://localhost:3000",
                "tinylicious",
                "12345",
                getUser(),
                "secret");

//            return new TestResolver();
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
            // Tinylicious
            return (this.urlResolver as InsecureUrlResolver).createCreateNewRequest(fileName);
            //default: // Local
            //    return (this.urlResolver as TestResolver).createCreateNewRequest(fileName);
    }
}
