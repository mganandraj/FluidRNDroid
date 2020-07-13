/**
 * @format
 */

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponentMountableView } from "@fluidframework/view-interfaces";
import { IComponent } from '@fluidframework/component-core-interfaces';

import { Container } from "@fluidframework/container-loader";

import { fluidExport } from "./fluidExport"

import { IComponentClickerCollection } from "@anandrag/clicker-shared/clickerCollectionModel"
import { getClickerCollection } from "@anandrag/clicker-shared/getClickerCollection"

import React from "react";
import ReactDOM from "react-dom";

import Dashboard from "./Dashboard"
import { CounterReactView } from "@anandrag/clicker-web/clickerView"

import { DocumentName, HostAddress } from '@anandrag/clicker-shared/meta.json';
import { IComponentSharedCounter } from "@anandrag/clicker-shared/sharedCounterType";

const documentId = DocumentName;
const appServerUrl = HostAddress;
const appPort = 8081;

export async function showClicker(renderClickerFunc: (clicker: IComponent | undefined) => void) {

    const container: Container | undefined = await getContainer(fluidExport, require('../../package.json'), documentId, appServerUrl, appPort);

    if (container == undefined)
        throw "container is undefined !";

    let clickerCollectionModel = await getClickerCollection(container, {
        headers: {
            mountableView: true,
        },
        url: "/",
    });

    var dashboardContainer = document.createElement("dashboardContainer");
    document.body.append(dashboardContainer);

    ReactDOM.render(<Dashboard clickerCollection={clickerCollectionModel} />, dashboardContainer);

    let showClickerFunc = async function (clickerName: string) {
        let clicker = await clickerCollectionModel?.getClicker(clickerName);
        renderClickerFunc(clicker);
    };


    let clickerNames = Array.from(clickerCollectionModel.getClickerNames());
    clickerNames.forEach((element) => {
        showClickerFunc(element);
    })
    
    clickerCollectionModel.setOnNewClickerCallback((name: string) => {
        showClickerFunc(name);
    })
};

let divcounter = 0; // TODO
let renderClickerFuncDOMInline = function (clicker: IComponent | undefined) {
    var div = document.createElement("div" + divcounter++);
    document.body.append(div);
    
    if (clicker != undefined) {
        let sharedCounter = clicker.IComponentSharedCounter;

        if (sharedCounter == undefined) {
            ReactDOM.render(<h1> Clicker don't provide the expected interface </h1>, div);
        } else {
            ReactDOM.render(<CounterReactView counter={sharedCounter} />, div);
        }
    } else {
        ReactDOM.render(<h1> Clicker can't be retrieved </h1>, div);
    }
}

export async function showClickerDOMInline() {
    showClicker(renderClickerFuncDOMInline);
}

showClickerDOMInline();