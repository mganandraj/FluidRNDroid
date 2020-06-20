/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


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
import { IDocumentServiceFactory } from "@fluidframework/driver-definitions";
import { IUser } from "@fluidframework/protocol-definitions";
import { Deferred } from "@fluidframework/common-utils";
import { HTMLViewAdapter } from "@fluidframework/view-adapters";
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

import {fluidExport} from "./clicker"

declare const global: { HermesInternal: null | {} };

const tinyliciousServer = "http://172.19.224.1";

const documentId = "abcde";
const appPort = 8081;
const appUrl = `${tinyliciousServer}:${appPort}/${documentId}`;

class App extends React.Component {


  fluid = async function () {

    try {

      class MyCodeResolver implements IFluidCodeResolver {
        async resolveCodeDetails(details: IFluidCodeDetails): Promise<IResolvedFluidCodeDetails> {
          return {
            config: details.config,
            package: details.package,
            resolvedPackage: null,
            resolvedPackageCacheId: "",
          };
        }
      }
  
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
          const baseUrl = details.config.cdn ?? `${tinyliciousServer}:${this.options.port}`;
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
      let fluidModule: IFluidModule = {fluidExport: fluidExport};
  
      const codeDetails: IFluidCodeDetails = {
        package: packageJson,
        config: {},
      };
  
      const packageSeed: [IFluidCodeDetails, IFluidModule] =
        [codeDetails, wrapIfComponentPackage(packageJson, fluidModule)];
  
  
      const routeOptions: ITinyliciousRouteOptions = {mode: "tinylicious", port: appPort};
      const host1Conf: IBaseHostConfig =
        { codeResolver: new WebpackCodeResolver(routeOptions), documentServiceFactory, urlResolver };
  
      const baseHost1 = new BaseHost(
        host1Conf,
        [packageSeed],
      );
  
      let container1: Container;
      const container1Attached = new Deferred();
  
      container1 = await baseHost1.initializeContainer(
        appUrl,
        codeDetails,
      );
      container1Attached.resolve();
  
      const reqParser = new RequestParser({ url: appUrl });
      const component_url = `/${reqParser.createSubRequest(3).url}`;
  
      const response = await container1.request({
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
        throw ""
      }
  
      const component = response.value as IComponent;
      if (component === undefined) {
        throw ""
      }
  
      const reactViewable = component.viewProvider.IComponentReactViewable;
      if (reactViewable !== undefined) {
        const element:JSX.Element = reactViewable.createJSXElement();

        this.setState({ child: [...this.state.child, element] });

          console.log(reactViewable);
      }
  
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


  async componentDidMount() {
    await this.fluid();
  }


  state = { isHungry: true, child: [] };

  getFluid = function() { 
    this.setState({ isHungry: false }); 
    // await this.fluid();
  }

  render() {

    let Arr = this.state.child.map((a, i) => {
      return a;                            
    })   

    return (
      <View>
        <View>
          <Text>Nothing yet</Text>
        </View>
        <Button
          onPress={() => {
            this.getFluid();
          }}
          disabled={!this.state.isHungry}
          title={
            this.state.isHungry ? "Get Fluiddd" : "Got it !"
          }
        />
        <View>
          {Arr}
        </View>
      </View>
    );
  }
}


const App2 = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
