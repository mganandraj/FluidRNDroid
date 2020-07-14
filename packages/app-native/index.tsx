/**
 * @format
 */

import {AppRegistry} from 'react-native';

import App from './App';
import {Dashboard} from './dashboardView'
import {ClickerReactView} from './clickerView'

import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent("App", () => App);
AppRegistry.registerComponent("Clicker", () => ClickerReactView);
AppRegistry.registerComponent("Dashboard", () => Dashboard);

// AppRegistry.registerComponent("Dashboard", () => Dashboard);