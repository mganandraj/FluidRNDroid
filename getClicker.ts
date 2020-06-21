import { ContainerRuntimeFactoryWithDefaultComponent } from "@fluidframework/aqueduct";
import { BaseHost, IBaseHostConfig } from "@fluidframework/base-host";

import {
    IFluidModule,
    IFluidPackage,
    IFluidCodeDetails,
    IFluidCodeResolver,
    IResolvedFluidCodeDetails,
    isFluidPackage,
} from "@fluidframework/container-definitions";

import { Container } from "@fluidframework/container-loader";
import { Deferred } from "@fluidframework/common-utils";
import { IComponentReactViewable } from "@fluidframework/view-interfaces";
import { extractPackageIdentifierDetails } from "@fluidframework/web-code-loader";
import { IComponent } from "@fluidframework/component-core-interfaces";
import { RequestParser } from "@fluidframework/container-runtime";

import { TestDocumentServiceFactory } from "@fluidframework/local-driver";
import { ILocalDeltaConnectionServer, LocalDeltaConnectionServer } from "@fluidframework/server-local-server";
import { SessionStorageDbFactory } from "@fluidframework/local-test-utils";
import { MultiDocumentServiceFactory } from "@fluidframework/driver-utils";
import { RouterliciousDocumentServiceFactory, DefaultErrorTracking } from "@fluidframework/routerlicious-driver";

import { MultiUrlResolver } from "./multiResolver";

import { fluidExport } from "./clicker"

const documentId = "abcdef";
const appServerUrl = "http://172.23.176.1";
const appPort = 8081;
const appUrl = `${appServerUrl}:${appPort}/${documentId}`;

export const getClicker = async function (): Promise<IComponent | undefined> {

    try {

        interface IBaseRouteOptions {
            port: number;
            npm?: string;
        }

        interface ITinyliciousRouteOptions extends IBaseRouteOptions {
            mode: "tinylicious";
            bearerSecret?: string;
        }

        class WebpackCodeResolver implements IFluidCodeResolver {
            constructor(private readonly options: IBaseRouteOptions) { }

            async resolveCodeDetails(details: IFluidCodeDetails): Promise<IResolvedFluidCodeDetails> {
                const baseUrl = details.config.cdn ?? `${appServerUrl}:${this.options.port}`;
                let pkg = details.package;
                if (typeof pkg === "string") {
                    const resp = await fetch(`${baseUrl}/package.json`);
                    pkg = await resp.json() as IFluidPackage;
                }
                if (!isFluidPackage(pkg)) {
                    throw new Error("Not a fluid package");
                }
                const files = pkg.fluid.browser.umd.files;
                for (let i = 0; i < pkg.fluid.browser.umd.files.length; i++) {
                    if (!files[i].startsWith("http")) {
                        files[i] = `${baseUrl}/${files[i]}`;
                    }
                }
                const parse = extractPackageIdentifierDetails(details.package);
                return {
                    config: details.config,
                    package: details.package,
                    resolvedPackage: pkg,
                    resolvedPackageCacheId: parse.fullId,
                };
            }
        }

        const deltaConns = new Map<string, ILocalDeltaConnectionServer>();

        function getDocumentServiceFactory(documentId: string) {
            const deltaConn = deltaConns.get(documentId) ??
                LocalDeltaConnectionServer.create(new SessionStorageDbFactory(documentId));
            deltaConns.set(documentId, deltaConn);

            return MultiDocumentServiceFactory.create([
                //TODO :: Test driver on top of Asyncstorage ?
                new TestDocumentServiceFactory(deltaConn),
                // tinylicious for now
                new RouterliciousDocumentServiceFactory(
                    false,
                    new DefaultErrorTracking(),
                    false,
                    true,
                    undefined,
                ),
            ]);
        }

        function wrapIfComponentPackage(packageJson: IFluidPackage, fluidModule: IFluidModule): IFluidModule {
            if (fluidModule.fluidExport.IRuntimeFactory === undefined) {
                const componentFactory = fluidModule.fluidExport.IComponentFactory;

                const runtimeFactory = new ContainerRuntimeFactoryWithDefaultComponent(
                    packageJson.name,
                    new Map([
                        [packageJson.name, Promise.resolve(componentFactory)],
                    ]),
                );
                return {
                    fluidExport: {
                        IRuntimeFactory: runtimeFactory,
                        IComponentFactory: componentFactory,
                    },
                };
            }
            return fluidModule;
        }



        const documentServiceFactory = getDocumentServiceFactory(documentId);
        const urlResolver = new MultiUrlResolver(appUrl, documentId);

        let packageJson: IFluidPackage = require('./package.json');
        let fluidModule: IFluidModule = { fluidExport: fluidExport };

        const codeDetails: IFluidCodeDetails = {
            package: packageJson,
            config: {},
        };

        const packageSeed: [IFluidCodeDetails, IFluidModule] =
            [codeDetails, wrapIfComponentPackage(packageJson, fluidModule)];


        const routeOptions: ITinyliciousRouteOptions = { mode: "tinylicious", port: appPort };
        const hostConf: IBaseHostConfig =
            { codeResolver: new WebpackCodeResolver(routeOptions), documentServiceFactory, urlResolver };

        const baseHost = new BaseHost(
            hostConf,
            [packageSeed],
        );

        let container: Container = await baseHost.initializeContainer(
            appUrl,
            codeDetails,
        );
        
        const reqParser = new RequestParser({ url: appUrl });
        const component_url = `/${reqParser.createSubRequest(3).url}`;

        const response = await container.request({
            headers: {
                mountableView: true,
            },
            url: component_url,
        });

        if (response.status !== 200 ||
            !(
                response.mimeType === "fluid/component" ||
                response.mimeType === "prague/component"
            )) {
            throw "Unknow mimetype in response !"
        }

        const component = response.value as IComponent;
        if (component === undefined) {
            throw "Component request failed."
        }

        return component;

        // We should be retaining a reference to mountableView long-term, so we can call unmount() on it to correctly
        // remove it from the DOM if needed.
        //const mountableView: IComponentMountableView = component.IComponentMountableView;
        //if (mountableView !== undefined) {
        ///    mountableView.mount(div);
        //    return;
        //}

        // If we don't get a mountable view back, we can still try to use a view adapter.  This won't always work (e.g.
        // if the response is a React-based component using hooks) and is not the preferred path, but sometimes it
        // can work.
        //console.warn(`Container returned a non-IComponentMountableView.  This can cause errors when mounting components `
        //    + `with React hooks across bundle boundaries.  URL: ${url}`);
        //const view = new HTMLViewAdapter(component);
        //view.render(div, { display: "block" });

    } catch (error) {
        console.log(error);
    }

}