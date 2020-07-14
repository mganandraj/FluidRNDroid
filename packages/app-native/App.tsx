import React, { Component } from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';

import { IComponent } from '@fluidframework/component-core-interfaces';

import {getAppCounterCollection} from "@anandrag/app-shared/getAppCounterCollection"

import { ClickerReactView } from "./clickerView"

import { showAppClickers } from "@anandrag/app-shared/app"

import { showDashboard } from "./dashboardView"
import {showClicker} from "./clickerView"

import { showAppDashboard } from "@anandrag/app-shared/app"

import { IComponentCounterCollection } from "@anandrag/counter-shared/counterCollectionModel"

interface AppProps {
}

interface FluidComponentStateEntryType {
  name: string,
  component: IComponent;
}

class App extends React.Component<AppProps> {
  
  private counterCollectionModel: IComponentCounterCollection|null = null;
  async componentDidMount() {

    await showAppDashboard(showDashboard);

    this.counterCollectionModel = await getAppCounterCollection();

    let clickerNames = Array.from(this.counterCollectionModel.getCounterNames());
    clickerNames.forEach((name) => {
      showClicker(name);
    });

    this.counterCollectionModel.setOnNewCounterCallback( (name: string ) => {
      showClicker(name);
    })


    // if (this.clickerNameProp) {
    //   let clicker = await counterCollectionModel.getCounter(this.clickerNameProp);
    //   if (clicker !== undefined) {
    //     this.addFluidComponent(this.clickerNameProp, clicker);
    //   } else {
    //     console.error("Cannot get the fluid component.");
    //   }
    // }
  }

  state = { fluidComponents: [] };

  // addFluidComponent = (clickerName:string, component: IComponent) => {
  //   this.setState({ fluidComponents: [...this.state.fluidComponents, {name: clickerName, component: component}] });
  // }

  render() {
    let Arr = this.state.fluidComponents.map(( component: FluidComponentStateEntryType, index) => {
      let sharedCounter = component.component.IComponentCounterModel;
      
      if (sharedCounter == undefined) {
        return <Text> Clicker don't provide the expected interface </Text>;
      } else {
        return <ClickerReactView name={component.name} counter={sharedCounter} />;
      }
      //const reactViewable = component.IComponentReactViewable;
      //if (reactViewable !== undefined) {
      //  const element: JSX.Element = reactViewable.createJSXElement();
      //  return element;
      //}
    })

    return (
      // <View>
      //   <Text>Fluid !!!</Text>
      //   <View>
      //     {Arr}
      //   </View>
      // </View>
      <Text>Fluid !!!</Text>
    );
  }
}

export default App;
