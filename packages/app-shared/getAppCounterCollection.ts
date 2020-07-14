/**
 * @format
 */

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponentMountableView } from "@fluidframework/view-interfaces";
import { IComponent } from '@fluidframework/component-core-interfaces';

import { Container } from "@fluidframework/container-loader";

import { fluidExport } from "./fluidExport"

import { IComponentCounterCollection } from "@anandrag/counter-shared/counterCollectionModel"
import { getCounterCollection } from "@anandrag/counter-shared/getCounterCollection"

import React from "react";
import ReactDOM from "react-dom";

import { DocumentName, HostAddress } from './meta.json';
import { IComponentCounterModel } from "@anandrag/counter-shared/counterModel";
import { IFluidPackage } from "@fluidframework/container-definitions";

const documentId = DocumentName;
const appServerUrl = HostAddress;
const appPort = 8081;

const fluidPackage: IFluidPackage = require('../../package.json');

let counterCollection_g: IComponentCounterCollection|null = null;

export async function getAppCounterCollection(): Promise<IComponentCounterCollection> {

    // A crude way to remember the object across calls .. It is a prototype anyways !

    if(counterCollection_g !== null) {
        console.debug("Re-using the counterCollection instance !");
        return counterCollection_g;
    }

    const container: Container | undefined = await getContainer(fluidExport, fluidPackage, documentId, appServerUrl, appPort);

    if (container == undefined)
        throw "container is undefined !";

    counterCollection_g = await getCounterCollection(container, {
        headers: {
            mountableView: true,
        },
        url: "/",
    });

    return counterCollection_g;
}

export async function getAppCounter(counterName: string): Promise<IComponentCounterModel> {
    let counterCollectionModel = await getAppCounterCollection();
    let counter = await counterCollectionModel.getCounter(counterName);
        
    if (!counter)
        throw "Error fetching counter component";

    let counterModel = counter.IComponentCounterModel;
    if(!counterModel)
        throw "Error fetching counter model interface from counter component";

    return counterModel;
}