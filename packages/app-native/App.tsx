import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponent } from '@fluidframework/component-core-interfaces';

import { IProvideComponentReactViewable } from "@fluidframework/view-interfaces";

import {IProvideComponentReactNativeViewable} from "@anandrag/fluid-shared/reactNativeView"

import { fluidExport } from "@anandrag/clicker-native/clickerView"

const documentId = "eee";

// Use it when under chrome debugger
// const appServerUrl = "http://172.23.80.1";

// When running on device with revere port forwarding to host machine.
const appServerUrl = "http://localhost";

const appPort = 8081;
const appUrl = `${appServerUrl}:${appPort}/${documentId}`;

//declare module "@fluidframework/component-core-interfaces" {
//  // eslint-disable-next-line @typescript-eslint/no-empty-interface
//  export interface IComponent extends Readonly<Partial<IProvideComponentReactViewable & IProvideComponentReactNativeViewable>> { }
//}

console.log('starting');

class App extends React.Component {
  async componentDidMount() {
    const container = await getContainer(fluidExport, require('../../package.json'), documentId, appServerUrl, appPort);
    
    if(container == undefined)
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

    const clicker = response.value as IComponent;
    if (clicker === undefined) {
        throw "Component request failed."
    }

    this.addFluidComponent(clicker);
  }

  state = { fluidComponents: [] };

  addFluidComponent = (component: IComponent) => {
    this.setState({ fluidComponents: [...this.state.fluidComponents, component] });
  }

  render() {
    let Arr = this.state.fluidComponents.map((component: IComponent, index) => {
      const reactViewable = component.IComponentReactViewable;
      if (reactViewable !== undefined) {
        const element: JSX.Element = reactViewable.createJSXElement();
        return element;
      }
    })

    return (
      <View>
        <View>
          <Text>Please wait .. The component wil be shown here soon .. </Text>
        </View>
        <View>
          {Arr}
        </View>
      </View>
    );
  }
}

export default App;
