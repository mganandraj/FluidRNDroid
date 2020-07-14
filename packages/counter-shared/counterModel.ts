/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const IComponentCounterModel: keyof IComponentProvideCounterModel = "IComponentCounterModel";

export interface IComponentProvideCounterModel {
    readonly IComponentCounterModel: IComponentCounterModel;
}

export interface IComponentCounterModel extends IComponentProvideCounterModel {
    getCurrentVaue() : number;
    increment() : void;
    setOnIncrementedCallback(callback: (newValue: number, currentValue: number)=>void) : void;
}

declare module "@fluidframework/component-core-interfaces" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IComponent extends Readonly<Partial<IComponentProvideCounterModel>> { }
}
