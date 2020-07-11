/**
 * @format
 */

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponentMountableView } from "@fluidframework/view-interfaces";
import { IComponent } from '@fluidframework/component-core-interfaces';

import { Container } from "@fluidframework/container-loader";

import { fluidExport } from "./fluidExport"

import {IComponentClickerCollection} from "@anandrag/clicker-shared/clickerCollectionModel"

import React from "react";
import ReactDOM, { unstable_renderSubtreeIntoContainer } from "react-dom";

import Dashboard from "./Dashboard"
import {CounterReactView} from "@anandrag/clicker-web/clickerView"

import { IComponentSharedCounter} from "@anandrag/clicker-shared/sharedCounterType"

const documentId = "abcd";
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

    // We know the default component is a clicker collection
    const clickerCollection = response.value as IComponent;
    if (clickerCollection === undefined) {
        throw "Component request failed."
    }

    let clickerCollectionModel = clickerCollection.IComponentClickerCollection;
    if(clickerCollectionModel === undefined) {
        throw "Component is not a clicker collection."
    }

    const uiContainer: HTMLElement | undefined | null = document.getElementById("example");
    if (uiContainer == undefined || uiContainer == null)
        return;
    
    ReactDOM.render(<Dashboard clickerCollection={clickerCollectionModel}/>, uiContainer);

    let clickerNames = Array.from(clickerCollectionModel.getClickerNames());
    clickerNames.forEach((element) => {
        // Add childs .. 
    })

    let divcounter=0;
    clickerCollectionModel.setOnNewClickerCallback( (name: string ) => {
        var div = document.createElement("div" + divcounter++);
        uiContainer.parentNode?.append(div);

        const clickerPromise = clickerCollectionModel?.getClicker(name);
        clickerPromise?.then((clicker: IComponent | undefined) => {
            if(clicker != undefined) {
                let sharedCounter = clicker.IComponentSharedCounter;
                if(sharedCounter == undefined) {
                    ReactDOM.render(<h1> Clicker don't provide the expected interface </h1>, div);    
                } else {
                    ReactDOM.render(<CounterReactView counter={sharedCounter} />, div);
                }
            } else {
                ReactDOM.render(<h1> Clicker can't be retrieved </h1>, div);
            }
        })
    })


    //const mountableView: IComponentMountableView | undefined = clicker.IComponentMountableView;
    //if(mountableView === undefined)
    //   return;
    
    //  mountableView.mount(uiContainer)

    // var div1 = document.createElement("div1");

    // uiContainer.parentNode?.append(div1);

    // ReactDOM.render(<Dashboard />, div1);

    // mountableView.mount(div1)

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