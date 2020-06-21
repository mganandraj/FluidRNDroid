/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';

// import 'react-native-url-polyfill/auto';

import { getClicker } from "./getClicker"
import { IComponentHTMLView, IComponentMountableView } from "@fluidframework/view-interfaces";
import { IComponent } from '@fluidframework/component-core-interfaces';


// AppRegistry.registerComponent(appName, () => App);

import { fluidExport } from "./clicker"

//const element = <App/>;
//ReactDOM.render(
//    element,
//    document.getElementById("example")
//);

let fluidInit = async () => {
    const clicker: IComponent | undefined = await getClicker(fluidExport);

    if(clicker == undefined)
        return;

    const container: HTMLElement | undefined | null = document.getElementById("example");
    if (container == undefined || container == null)
        return;
    
    const mountableView: IComponentMountableView | undefined = clicker.IComponentMountableView;
    if(mountableView === undefined)
        return;
    
    mountableView.mount(container)
};

fluidInit();