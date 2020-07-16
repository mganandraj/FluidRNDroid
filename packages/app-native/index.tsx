/**
 * @format
 */

import {AppRegistry} from 'react-native';

import App from './App';
import {Dashboard} from './dashboardView'
import {ClickerReactView} from './clickerView'

import 'react-native-url-polyfill/auto';

if(!global.performance) {
    global.performance = {
        now: () => { return Date.now(); },
        mark: (name:string) => {
            console.log(`mark:${name}`);
        },
        measure: (name:string) => {
            console.log(`measure:${name}`);
        },
    }
}

AppRegistry.registerComponent("App", () => App);
AppRegistry.registerComponent("Clicker", () => ClickerReactView);
AppRegistry.registerComponent("Dashboard", () => Dashboard);