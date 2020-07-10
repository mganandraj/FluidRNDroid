/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";

import { IComponentHandle, IComponent } from "@fluidframework/component-core-interfaces";

import { IComponentReactViewable } from "@fluidframework/view-interfaces";


import {Clicker} from "@anandrag/clicker-shared/clicker"
import {IComponentSharedCounter} from "@anandrag/clicker-shared/sharedCounterType"

import React from "react";

export const ClickerName = "clicker";

/*
export class ClickerView extends PrimedComponent implements IComponentReactViewable {
    public get IComponentReactViewable() { return this; }
    
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
                return ( <CounterReactView counter={sharedCounter} />);
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
*/

// ----- REACT STUFF -----

interface CounterProps {
    counter: IComponentSharedCounter;
}

interface CounterState {
    value: number;
}

export class CounterReactView extends React.Component<CounterProps, CounterState> {
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
        return <div>
                <i>Clicker: </i>
                <button onClick={() => { this.props.counter.increment(); }}> {String(this.state.value)}</button>
            </div>
    }  
}