/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";

import { IComponentHandle, IComponent } from "@fluidframework/component-core-interfaces";

import {CounterFluidComponent} from "./counter"
import {IComponentCounterCollection} from "./counterCollectionModel"

import { IValueChanged } from "@fluidframework/map";

export const CounterCollectionFluidComponentName = "CounterCollectionFluidComponent";

export class CounterCollectionFluidComponent extends PrimedComponent implements IComponentCounterCollection {
    async addNewCounter(name: string): Promise<void> {
        const clickerComponent = await CounterFluidComponent.getFactory().createComponent(this.context);
        this.root.set(name, clickerComponent.handle);
    }

    getCounterNames() : IterableIterator<string> {
        return this.root.keys();
    }

    async getCounter(name: string): Promise<IComponent | undefined> {
        const result = await this.root.wait<IComponentHandle>(name);
        return await result.get();
    }

    setOnNewCounterCallback( callback: (name: string) => void ) : void {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            callback(changed.key);
        })
    }
    
    public get IComponentCounterCollection() { return this; }
    
    public static getFactory() { return CounterCollectionFluidComponent.factory; }

    private static readonly factory = new PrimedComponentFactory(
        CounterCollectionFluidComponentName,
        CounterCollectionFluidComponent,
        [],
        {},
        new Map([
            CounterFluidComponent.getFactory().registryEntry
        ]),
    );
}