import React from "react";
import ReactDOM from "react-dom";

import { IComponentCounterCollection } from "@anandrag/counter-shared/counterCollectionModel"
import { ID } from "@anandrag/utils/utils"

import { getAppCounterCollection } from "@anandrag/app-shared/getAppCounterCollection"

interface DashboardViewProps {}

interface DashboardViewState {
  counterCollection: IComponentCounterCollection | null;
  counterCount: number;
}

export default class Dashboard extends React.Component<DashboardViewProps, DashboardViewState> {

  // private counterCollectionModel: IComponentCounterCollection | undefined = undefined;

  async componentDidMount() {
    let counterCollectionModel = await getAppCounterCollection();
    let clickerCount = Array.from(counterCollectionModel.getCounterNames()).length;

    this.setState({ counterCollection: counterCollectionModel, counterCount: clickerCount });

    counterCollectionModel.setOnNewCounterCallback( (name: string ) => {
      this.setState({ counterCount: this.state.counterCount + 1 });
    })
  }
  
  render() {
    if (this.state && this.state.counterCollection) {
      return (
        <>
          <button onClick={() => this.state.counterCollection?.addNewCounter(ID())}> {this.state.counterCount} clickers found .. Tap to add a new clicker</button>
        </>
      );
    } else {
      return (
        <>
          <h1>CounterCollection not initialized yet.</h1>
        </>
      );
    }
  }
}

export function showDashboard() {
  var dashboardContainer = document.createElement("dashboardContainer");
  document.body.append(dashboardContainer);

  ReactDOM.render(<Dashboard />, dashboardContainer);
}
