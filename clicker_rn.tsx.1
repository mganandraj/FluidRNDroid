/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";
import { Counter, CounterValueType } from "@fluidframework/map";
import { ITask } from "@fluidframework/runtime-definitions";
import { IComponentHTMLView, IComponentReactViewable } from "@fluidframework/view-interfaces";
import React from "react";
import { Text, Button } from "react-native";
import { ClickerAgent } from "./agent";

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
// const pkg = require("../package.json");
export const ClickerName = "clicker";

/**
 * Basic Clicker example using new interfaces and stock component classes.
 */
export class Clicker extends PrimedComponent implements IComponentReactViewable /*IComponentHTMLView*/ {
    // public get IComponentHTMLView() { return this; }
    public get IComponentReactViewable() { return this; }

    /**
     * Do setup work here
     */
    protected async componentInitializingFirstTime() {
        this.root.createValueType("clicks", CounterValueType.Name, 0);
        if (!this.runtime.connected) {
            await new Promise<void>((resolve) => this.runtime.on("connected", () => resolve()));
        }
        this.setupAgent();
    }

    protected async componentInitializingFromExisting() {
        this.setupAgent();
    }

    public createJSXElement(): JSX.Element {
        const counter = this.root.get("clicks");
        return (<CounterReactView counter={counter} /> );
        // return ( <li><CounterReactView counter={counter} /></li> );
        // return ( <li><h1>Hello from clicker</h1></li> );
    }

    public setupAgent() {
        const counter: Counter = this.root.get("clicks");
        const agentTask: ITask = {
            id: "agent",
            instance: new ClickerAgent(counter),
        };
        this.taskManager.register(agentTask);
        this.taskManager.pick(this.url, "agent", true).then(() => {
            console.log(`Picked`);
        }, (err) => {
            console.log(err);
        });
    }
}

// ----- REACT STUFF -----

interface CounterProps {
    counter: Counter;
}

interface CounterState {
    value: number;
}

class CounterReactView extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
        super(props);

        this.state = {
            value: this.props.counter.value,
        };
    }

    componentDidMount() {
        this.props.counter.on("incremented", (incrementValue: number, currentValue: number) => {
            this.setState({ value: currentValue });
        });
    }

    render() {
        return <Button
          onPress={() => { this.props.counter.increment(1); }}
          title={String(this.state.value)}
        />
    }
}
// ----- FACTORY SETUP -----

export const ClickerInstantiationFactory = new PrimedComponentFactory(
    ClickerName,
    Clicker,
    [],
    {},
);

export const fluidExport = ClickerInstantiationFactory;
