/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerRuntimeFactoryWithDefaultComponent,PrimedComponent, PrimedComponentFactory } from "@fluidframework/aqueduct";

import { IComponentHandle, IComponent } from "@fluidframework/component-core-interfaces";

import {Clicker} from "./clicker"
import {IComponentClickerCollection} from "./clickerCollectionModel"

import { IValueChanged } from "@fluidframework/map";

export const ClickerCollectionName = "ClickerCollection";

export class ClickerCollection extends PrimedComponent implements IComponentClickerCollection {
    async addNewClicker(name: string): Promise<void> {
        const clickerComponent = await Clicker.getFactory().createComponent(this.context);
        this.root.set(name, clickerComponent.handle);
        // this.root.set(name, name);
    }

    getClickerNames() : IterableIterator<string> {
        return this.root.keys();
    }

    async getClicker(name: string): Promise<IComponent | undefined> {
        const result = this.root.get<IComponentHandle>(name);
        return await result.get();
    }

    setOnNewClickerCallback( callback: (name: string) => void ) : void {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            callback(changed.key);
        })
    }
    
    public get IComponentClickerCollection() { return this; }
    // public get IComponentClickerCollection() {return this;}
    // public get IComponentReactViewable() { return this; }
    
    protected async componentInitializingFirstTime() {
        //const clickerComponent = await ClickerShared.getFactory().createComponent(this.context);
        //this.root.set(ClickerShared.ComponentName, clickerComponent.handle);
    }

    //private clickerComponent: IComponent | undefined = undefined;
    protected async componentHasInitialized() {
        //this.clickerComponent = await this.root.get<IComponentHandle>(ClickerShared.ComponentName).get();
    }

    /*
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
    }*/

    public static getFactory() { return ClickerCollection.factory; }

    private static readonly factory = new PrimedComponentFactory(
        ClickerCollectionName,
        ClickerCollection,
        [],
        {},
        new Map([
            Clicker.getFactory().registryEntry
        ]),
    );
}

/*

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
        return <div>
                <i>Clicker: </i>
                <button onClick={() => { this.props.counter.increment(); }}> {String(this.state.value)}</button>
            </div>
    }  
} */