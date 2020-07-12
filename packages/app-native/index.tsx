/**
 * @format
 */

import {AppRegistry} from 'react-native';

import App from './App';
import {Dashboard} from './Dashboard'

import {name as appName} from './app.json';

import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent("Dashboard", () => Dashboard);