import React from 'react';
import { Button, Alert, View, Text } from "react-native"
import { NativeModules } from 'react-native';

import { IComponentCounterCollection } from "@anandrag/counter-shared/counterCollectionModel"

import { ID } from "@anandrag/utils/utils"

import { getAppCounterCollection } from "@anandrag/app-shared/getAppCounterCollection"

interface DashboardViewProps { }

interface DashboardViewState {
    counterCollection: IComponentCounterCollection | null;
    counterCount: number;
}

export class Dashboard extends React.Component<DashboardViewProps, DashboardViewState> {

    async componentDidMount() {
        let counterCollectionModel = await getAppCounterCollection();
        let clickerCount = Array.from(counterCollectionModel.getCounterNames()).length;

        this.setState({ counterCollection: counterCollectionModel, counterCount: clickerCount });

        counterCollectionModel.setOnNewCounterCallback((name: string) => {
            this.setState({ counterCount: this.state.counterCount + 1 });
        })
    }

    render() {
        if (this.state && this.state.counterCollection) {
            let clickerCount = Array.from(this.state.counterCollection.getCounterNames()).length
            
            return (
                <Button
                    title={String(clickerCount) + " clickers found. Tap to add a new one"}
                    onPress={() => this.state.counterCollection?.addNewCounter(ID())}
                />
            );
        } else {
            return <Text>
                CounterCollection is not yet initialized.
            </Text>
        }
    }
}

export function showDashboard() {
    NativeModules.ClickerNativeModule.showDashboard();
}
