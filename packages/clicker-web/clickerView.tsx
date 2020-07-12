/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {IComponentSharedCounter} from "@anandrag/clicker-shared/sharedCounterType"
import React from "react";

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