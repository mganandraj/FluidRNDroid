/**
 * @format
 */

import { IComponent } from '@fluidframework/component-core-interfaces';

import { IComponentCounterCollection } from "@anandrag/counter-shared/counterCollectionModel"
import { getCounterCollection } from "@anandrag/counter-shared/getCounterCollection"

// import Dashboard, {showDashboard} from "./dashboardView"
// import { ClickerReactView, showClicker } from "./clickerView"

import { IComponentCounterModel } from "@anandrag/counter-shared/counterModel";

import {getAppCounterCollection} from "@anandrag/app-shared/getAppCounterCollection"

type ShowDashboardFuncType = (counterCollectionModel: IComponentCounterCollection) => void;
type ShowClickerFuncType = (clickerName: string) => void;

export async function showAppDashboard(showDashboard: ShowDashboardFuncType) {
    let counterCollectionModel = await getAppCounterCollection();
    showDashboard(counterCollectionModel);
}

export async function showAppClickers(showClicker: ShowClickerFuncType) {
    let counterCollectionModel = await getAppCounterCollection();

    // let showClickerHelper = async function (clickerName: string) {
    //     let clicker = await counterCollectionModel?.getCounter(clickerName);
        
    //     if (clicker != undefined) {
    //         let sharedCounter = clicker.IComponentCounterModel;
    //         if(sharedCounter !== undefined)
    //             showClicker(clickerName, sharedCounter);
    //         else 
    //             console.error("Clicker components doesn't expose the required IComponentCounterModel interface.");
    //     } else {
    //         console.error("Error fetching clicker component.");
    //     }
    // };

    let clickerNames = Array.from(counterCollectionModel.getCounterNames());
    clickerNames.forEach((name) => {
        showClicker(name);
    })
    
    counterCollectionModel.setOnNewCounterCallback((name: string) => {
        showClicker(name);
    })
}

export async function showApp(showClickerFunc: ShowClickerFuncType, showDashboardFunc: ShowDashboardFuncType) {
    await showAppDashboard(showDashboardFunc);
    await showAppClickers(showClickerFunc);
};