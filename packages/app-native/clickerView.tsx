/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {IComponentCounterModel} from "@anandrag/counter-shared/counterModel"
import { NativeModules } from 'react-native';

import { Button,View, Text } from "react-native";

import {getAppCounter} from "@anandrag/app-shared/getAppCounterCollection"

import React from "react";

interface ClickerViewProps {
    clickerName: string;
}

interface ClickerViewState {
    value: number;
    counterModel: IComponentCounterModel;
}

export class ClickerReactView extends React.Component<ClickerViewProps, ClickerViewState> {
    
    constructor(props: ClickerViewProps) {
        super(props);
    }

    async componentDidMount() {
        let counterModel = await getAppCounter(this.props.clickerName);

        this.setState({value: counterModel.getCurrentVaue(), counterModel: counterModel});

        counterModel.setOnIncrementedCallback((incrementValue: number, currentValue: number) => {
            this.setState({ value: currentValue });
        });
    }

    render() {

        if(this.state && this.state.counterModel) {
            return <View>
                    <Text>
                        { String(this.props.clickerName) }
                    </Text>
                    <Button
                        onPress={() => { this.state.counterModel.increment(); }}
                        title={String(this.state.value)}
                    />
                </View>
        } else {
            return <View>
                        <Text>
                            { this.props.clickerName} is not yet initialized.
                        </Text>
                    </View>
        }
    }
}

export function showClicker(clickerName: string) {
    NativeModules.ClickerNativeModule.showClicker(clickerName);
}