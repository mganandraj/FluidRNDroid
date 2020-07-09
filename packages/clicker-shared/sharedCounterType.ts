/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * @deprecated - See IComponentSharedCounter
 */
export const IComponentSharedCounter: keyof IComponentProvideSharedCounter = "IComponentSharedCounter";

/**
 * @deprecated - See IComponentSharedCounter
 */
export interface IComponentProvideSharedCounter {
    readonly IComponentSharedCounter: IComponentSharedCounter;
}
/**
 * Interface describing components that can produce React elements when requested.
 * @deprecated - To support multiview scenarios, consider split view/model patterns like those demonstrated in
 * the multiview sample.
 */
export interface IComponentSharedCounter extends IComponentProvideSharedCounter {
    getCurrentVaue() : number;
    increment() : void;
    setOnIncrementedCallback(callback: (newValue: number, currentValue: number)=>void) : void;
}

declare module "@fluidframework/component-core-interfaces" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IComponent extends Readonly<Partial<IComponentProvideSharedCounter>> { }
}
