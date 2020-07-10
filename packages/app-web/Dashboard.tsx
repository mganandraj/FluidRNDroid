import React, { useState } from "react";
import {IComponentClickerCollection} from "@anandrag/clicker-shared/clickerCollectionModel"
import { IComponent } from "@fluidframework/component-core-interfaces";

function addNewClicker(clickerCollection: IComponentClickerCollection) {
    clickerCollection.addNewClicker("test" + Math.random());
  }
 
interface DashboardProps {
    clickerCollection: IComponentClickerCollection;
}

export default function Dashboard(props: DashboardProps) {

    return (
      <>
        <button onClick={ () => addNewClicker(props.clickerCollection) }>Add a clicker</button>;
      </>
    );
  
}