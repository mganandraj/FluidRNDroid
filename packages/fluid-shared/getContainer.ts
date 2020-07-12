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
import { extractPackageIdentifierDetails } from "@fluidframework/web-code-loader";
import { IComponent } from "@fluidframework/component-core-interfaces";

import { TestDocumentServiceFactory } from "@fluidframework/local-driver";
import { ILocalDeltaConnectionServer, LocalDeltaConnectionServer } from "@fluidframework/server-local-server";
import { SessionStorageDbFactory } from "@fluidframework/local-test-utils";
import { MultiDocumentServiceFactory } from "@fluidframework/driver-utils";
import { RouterliciousDocumentServiceFactory, DefaultErrorTracking } from "@fluidframework/routerlicious-driver";

import { MultiUrlResolver } from "./multiResolver";

const tinyliciousPort = 3000;

export const getContainer = async function (fluidExport: IComponent, packageJson: IFluidPackage, documentId: string, appServerUrl: string, appPort: number): Promise<Container | undefined> {

    const appUrl = `${appServerUrl}:${appPort}/${documentId}`;

    try {

        interface IBaseRouteOptions {
            port: number;
            npm?: string;
        }

        interface ITinyliciousRouteOptions extends IBaseRouteOptions {
            mode: "tinylicious";
            bearerSecret?: string;
        }

        // We are currently bundling the code together with the loader hence no need to resolve any URLs.
        class NoOpResolver implements IFluidCodeResolver {
            constructor(private readonly options: IBaseRouteOptions) { }

            async resolveCodeDetails(details: IFluidCodeDetails): Promise<IResolvedFluidCodeDetails> {
                const parse = extractPackageIdentifierDetails(details.package);
                return {
                    config: details.config,
                    package: details.package,
                    resolvedPackage: details.package as IFluidPackage,
                    resolvedPackageCacheId: parse.fullId,
                };
            }
        }

        const deltaConns = new Map<string, ILocalDeltaConnectionServer>();

        function getDocumentServiceFactory(documentId: string) {
            const deltaConn = deltaConns.get(documentId) ? deltaConns.get(documentId) :
                LocalDeltaConnectionServer.create(new SessionStorageDbFactory(documentId));
            
            if(deltaConn === undefined)
                throw "Unable to create connection to delta server."

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

                if (componentFactory !== undefined) {
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
            }
            
            return fluidModule;
        }

        const documentServiceFactory = getDocumentServiceFactory(documentId);
        const urlResolver = new MultiUrlResolver(appUrl, documentId, appServerUrl, tinyliciousPort);

        let fluidModule: IFluidModule = { fluidExport: fluidExport };

        const codeDetails: IFluidCodeDetails = {
            package: packageJson,
            config: {},
        };

        const packageSeed: [IFluidCodeDetails, IFluidModule] =
            [codeDetails, wrapIfComponentPackage(packageJson, fluidModule)];


        const routeOptions: ITinyliciousRouteOptions = { mode: "tinylicious", port: appPort };
        const hostConf: IBaseHostConfig =
            { codeResolver: new NoOpResolver(routeOptions), documentServiceFactory, urlResolver };

        const baseHost = new BaseHost(
            hostConf,
            [packageSeed],
        );

        let container: Container = await baseHost.initializeContainer(
            appUrl,
            codeDetails,
        );

        if(container === undefined)
            throw "Container is undefined !!"

        return container;

    } catch (error) {
        console.log(error);
    }

}