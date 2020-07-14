import React from "react";
import ReactDOM from "react-dom";

import {IComponentCounterModel} from "@anandrag/counter-shared/counterModel"
import {getAppCounter} from "@anandrag/app-shared/getAppCounterCollection"

interface ClickerViewProps {
    counterName: string;
}

interface ClickerViewState {
    value: number;
    counterModel: IComponentCounterModel;
}

class ClickerReactView extends React.Component<ClickerViewProps, ClickerViewState> {
    constructor(props: ClickerViewProps) {
        super(props);
    }

    async componentDidMount() {
        console.error('here');
        let counterModel = await getAppCounter(this.props.counterName);

        this.setState({value: counterModel.getCurrentVaue(), counterModel: counterModel});

        counterModel.setOnIncrementedCallback((incrementValue: number, currentValue: number) => {
            this.setState({ value: currentValue });
        });
    }

    render() {
        if(this.state && this.state.counterModel)
            return <div>
                        <tr>
                            <td width="100"> {this.props.counterName} : </td> 
                            <td width="200"> 
                                <button onClick={() => { this.state.counterModel.increment(); }}> {String(this.state.value)}</button>
                            </td>
                        </tr>
                    </div>
        else
            return <div>
                        <h1>clicker is not yet ready</h1>
                    </div>
    }  
}

export function showClicker(clickerName: string) {
    var div = document.createElement("div_" + clickerName);
    document.body.append(div);
    
    ReactDOM.render(<ClickerReactView counterName={clickerName} />, div);
}