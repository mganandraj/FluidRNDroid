/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerRuntimeFactoryWithDefaultComponent,PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";
import { IComponentHandle, IComponent } from "@fluidframework/component-core-interfaces";
import { IComponentReactViewable } from "@fluidframework/view-interfaces";

import {ClickerShared} from "@anandrag/clicker-shared/clickerShared"
import {IComponentSharedCounter} from "@anandrag/clicker-shared/sharedCounterType"

import { Text, Button } from "react-native";

import React from "react";

export const ClickerName = "clicker";

/**
 * Basic Clicker example using new interfaces and stock component classes.
 */
export class Clicker extends PrimedComponent implements IComponentReactViewable/*, IComponentReactNativeViewable*/ {
    public get IComponentReactViewable() { return this; }

    /**
     * Do setup work here
     */
    protected async componentInitializingFirstTime() {
        const clickerComponent = await ClickerShared.getFactory().createComponent(this.context);
        this.root.set(ClickerShared.ComponentName, clickerComponent.handle);
    }

    private clickerComponent: IComponent | undefined = undefined;
    protected async componentHasInitialized() {
        this.clickerComponent = await this.root.get<IComponentHandle>(ClickerShared.ComponentName).get();
    }

    public createJSXElement(): JSX.Element {
        if(this.clickerComponent != undefined) {
            let sharedCounter: IComponentSharedCounter | undefined = this.clickerComponent.IComponentSharedCounter;
            if(sharedCounter != undefined) {
                return ( <CounterReactView counter={sharedCounter} /> );
            } else {
                throw "unable to get the shared counter !!";
            }
        } else {
            throw "unable to get the ClickerShared !!";
        }       
    }

    public static getFactory() { return Clicker.factory; }

    private static readonly factory = new PrimedComponentFactory(
        ClickerName,
        Clicker,
        [],
        {},
        new Map([
            ClickerShared.getFactory().registryEntry,
        ]),
    );
}

export const fluidExport = new ContainerRuntimeFactoryWithDefaultComponent(
    Clicker.getFactory().type,
    new Map([
        Clicker.getFactory().registryEntry,
    ]));

// ----- REACT STUFF -----

interface CounterProps {
    counter: IComponentSharedCounter;
}


interface CounterState {
    value: number;
}

class CounterReactView extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
        super(props);

        this.state = {
            value: this.props.counter.getCurrentVaue(),
        };
    }

    componentDidMount() {
        this.props.counter.setOnIncrementedCallback((incrementValue: number, currentValue: number) => {
            this.setState({ value: currentValue });
        });
    }

    render() {
        return <Button
          onPress={() => { this.props.counter.increment(); }}
          title={String(this.state.value)}
        />
    }
}