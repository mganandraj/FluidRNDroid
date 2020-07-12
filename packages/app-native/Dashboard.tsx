import React from 'react';
import { Button, Alert } from "react-native"
import { NativeModules } from 'react-native';

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponent } from '@fluidframework/component-core-interfaces';

import { fluidExport } from "./fluidExport"

import {DocumentName, HostAddress} from '@anandrag/clicker-shared/meta.json';

import {IComponentClickerCollection} from "@anandrag/clicker-shared/clickerCollectionModel"

const documentId = DocumentName;

// Use it when under chrome debugger
const appServerUrl = HostAddress;

// When running on device with revere port forwarding to host machine.
// const appServerUrl = "http://localhost";

const appPort = 8081;
const appUrl = `${appServerUrl}:${appPort}/${documentId}`;



export class Dashboard extends React.Component {

    private clickerCollectionModel: IComponentClickerCollection | undefined = undefined;

    async componentDidMount() {

        let clickerCollectionModel = null;

        const container = await getContainer(fluidExport, require('../../package.json'), documentId, appServerUrl, appPort);

        if (container == undefined)
            return;

        

        const component_url = "/";

        const response = await container.request({
            //headers: {
            //    mountableView: true,
            //},
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

        this.clickerCollectionModel = clickerCollection.IComponentClickerCollection;
        if (this.clickerCollectionModel === undefined) {
            throw "Component is not a clicker collection."
        }

        let clickerNames = Array.from(this.clickerCollectionModel.getClickerNames());
        clickerNames.forEach((element) => {
            NativeModules.ClickerNativeModule.showClicker(element);
        })

        this.clickerCollectionModel?.setOnNewClickerCallback( (name: string ) => {
            NativeModules.ClickerNativeModule.showClicker(name);
        })

        // let clickerName: string = "";
        // //if(this.clickerNameProp) {
        // //  clickerName = this.clickerNameProp;
        // //} else {
        //   let clickerNames: string[] = Array.from(clickerCollectionModel.getClickerNames());
        //   clickerName = clickerNames[0];
        //   //clickerNames.forEach((element) => {
        //       // Add childs .. 
        //   //})
        // ///}

        // if(!ClickerName) {
        //   throw "ClickerName not available !!"
        // }


        // let clicker = await clickerCollectionModel.getClicker(clickerName);
        // if(clicker !== undefined) {
        //   this.addFluidComponent(clicker);
        // } else {
        //   console.error("Cannot get the fluid component.");
        // }
    }

    addClicker = () => {
        this.clickerCollectionModel?.addNewClicker("test" + Math.random());
        // clickerCollection.addNewClicker("test" + Math.random());
        // Alert.alert('')
        // NativeModules.ClickerNativeModule.showClicker("test");
    }


    render() {
        // let clickerNames = Array.from(clickerCollectionModel.getClickerNames());
        // clickerNames.forEach((element) => {
        //     // Add childs .. 
        //     showClickerFunc(element);
        // })

        return (
            <Button
                title="Add Clicker"
                onPress={() => this.addClicker()}
            />
        );
    }
}