import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';

import { getContainer } from "@anandrag/fluid-shared/getContainer"
import { IComponent } from '@fluidframework/component-core-interfaces';
import {getClickerCollection} from "@anandrag/clicker-shared/getClickerCollection"

import { CounterReactView } from "@anandrag/clicker-native/clickerView"

import { fluidExport } from "./fluidExport"

import { DocumentName, HostAddress } from '@anandrag/clicker-shared/meta.json';

const documentId = DocumentName;

// Use it when under chrome debugger
const appServerUrl = HostAddress;

// When running on device with revere port forwarding to host machine.
// const appServerUrl = "http://localhost";

const appPort = 8081;
const appUrl = `${appServerUrl}:${appPort}/${documentId}`;

//declare module "@fluidframework/component-core-interfaces" {
//  // eslint-disable-next-line @typescript-eslint/no-empty-interface
//  export interface IComponent extends Readonly<Partial<IProvideComponentReactViewable & IProvideComponentReactNativeViewable>> { }
//}

console.log('starting');

interface AppProps {
  clickerName: string;
}

class App extends React.Component {

  private clickerNameProp: string = "";
  constructor(props: AppProps) {
    super(props);
    if (props.clickerName)
      this.clickerNameProp = props.clickerName;
  }

  async componentDidMount() {

    const container = await getContainer(fluidExport, require('../../package.json'), documentId, appServerUrl, appPort);

    if (container == undefined)
      return;

    let clickerCollectionModel = await getClickerCollection(container, {
      headers: {
        mountableView: true,
      },
      url: "/",
    });

    if (this.clickerNameProp) {
      let clicker = await clickerCollectionModel.getClicker(this.clickerNameProp);
      if (clicker !== undefined) {
        this.addFluidComponent(clicker);
      } else {
        console.error("Cannot get the fluid component.");
      }
    }
  }

  state = { fluidComponents: [] };

  addFluidComponent = (component: IComponent) => {
    this.setState({ fluidComponents: [...this.state.fluidComponents, component] });
  }

  render() {
    let Arr = this.state.fluidComponents.map((component: IComponent, index) => {
      let sharedCounter = component.IComponentSharedCounter;
      if (sharedCounter == undefined) {
        return <Text> Clicker don't provide the expected interface </Text>;
      } else {
        return <CounterReactView counter={sharedCounter} />;
      }
      //const reactViewable = component.IComponentReactViewable;
      //if (reactViewable !== undefined) {
      //  const element: JSX.Element = reactViewable.createJSXElement();
      //  return element;
      //}
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
