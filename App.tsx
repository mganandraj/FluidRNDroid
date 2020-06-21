import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';

import { getClicker } from "./getClicker"
import { IComponent } from '@fluidframework/component-core-interfaces';

class App extends React.Component {
  async componentDidMount() {
    const clicker = await getClicker();
    if (clicker != undefined) {
      this.addFluidComponent(clicker);
    }
  }

  state = { fluidComponents: [] };

  addFluidComponent = (component: IComponent) => {
    this.setState({ fluidComponents: [...this.state.fluidComponents, component] });
  }

  render() {
    let Arr = this.state.fluidComponents.map((component, index) => {
      const reactViewable = component.viewProvider.IComponentReactViewable;
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
