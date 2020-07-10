/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";
import { Counter, CounterValueType } from "@fluidframework/map";
import { ITask } from "@fluidframework/runtime-definitions";

import { ClickerAgent } from "./agent";

import { IComponentSharedCounter} from "./sharedCounterType"

/**
 * Basic Clicker example using new interfaces and stock component classes.
 */
export class Clicker extends PrimedComponent implements IComponentSharedCounter {
    
    // *****  IComponentSharedCounter *********

    getCurrentVaue(): number {
        const counter: Counter = this.root.get("clicks");
        return counter.value;
    }

    increment(): void {
        const counter: Counter = this.root.get("clicks");
        counter.increment(1);
    }
    
    setOnIncrementedCallback(callback: (newValue: number, currentValue: number) => void): void {
        const counter: Counter = this.root.get("clicks");
        counter.on("incremented", (incrementValue: number, currentValue: number) => {
            callback(incrementValue, currentValue);
        });
    }

    public get IComponentSharedCounter() { return this; }
    
    
    // *****  IComponentSharedCounter END *********


    public static readonly ComponentName = 'Clicker';
    
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

       // ----- COMPONENT SETUP STUFF -----

    public static getFactory() { return Clicker.factory; }

    private static readonly factory = new PrimedComponentFactory(
        Clicker.ComponentName,
        Clicker,
        [],
        {});
}