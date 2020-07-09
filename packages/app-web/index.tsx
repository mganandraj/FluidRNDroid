/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';

// import 'react-native-url-polyfill/auto';

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponentMountableView } from "@fluidframework/view-interfaces";
import { IComponent } from '@fluidframework/component-core-interfaces';

import { Container } from "@fluidframework/container-loader";

// import { RequestParser } from "@fluidframework/container-runtime";


// AppRegistry.registerComponent(appName, () => App);

import { fluidExport } from "@anandrag/clicker-web/clickerView"

//const element = <App/>;
//ReactDOM.render(
//    element,
//    document.getElementById("example")
//);


const documentId = "ddd";
const appServerUrl = "http://172.23.80.1";
const appPort = 8081;
const appUrl = `${appServerUrl}:${appPort}/${documentId}`;

let fluidInit = async () => {
    const container: Container | undefined = await getContainer(fluidExport, require('../../package.json'), documentId, appServerUrl, appPort);

    if(container == undefined)
        return;

    // const reqParser = new RequestParser({ url: appUrl });
    // const component_url = `/${reqParser.createSubRequest(3).url}`;
    const component_url = "/";

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

    const clicker = response.value as IComponent;
    if (clicker === undefined) {
        throw "Component request failed."
    }

    const uiContainer: HTMLElement | undefined | null = document.getElementById("example");
    if (uiContainer == undefined || uiContainer == null)
        return;
    
    const mountableView: IComponentMountableView | undefined = clicker.IComponentMountableView;
    if(mountableView === undefined)
        return;
    
    mountableView.mount(uiContainer)


    
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
};

fluidInit();