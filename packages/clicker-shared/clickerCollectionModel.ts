/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IComponent } from "@fluidframework/component-core-interfaces";

export const IComponentClickerCollection: keyof IComponentProvideClickerCollection = "IComponentClickerCollection";

export interface IComponentProvideClickerCollection {
    readonly IComponentClickerCollection: IComponentClickerCollection;
}
/**
 * Interface describing components that can produce React elements when requested.
 * @deprecated - To support multiview scenarios, consider split view/model patterns like those demonstrated in
 * the multiview sample.
 */
export interface IComponentClickerCollection extends IComponentProvideClickerCollection {
    // getCurrentVaue() : number;
    // increment() : void;
    // setOnIncrementedCallback(callback: (newValue: number, currentValue: number)=>void) : void;
    addNewClicker(name: string): void;

    setOnNewClickerCallback( callback: (name: string) => void ) : void;

    getClickerNames() : IterableIterator<string>;

    getClicker(name: string): Promise<IComponent | undefined>;
}

declare module "@fluidframework/component-core-interfaces" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IComponent extends Readonly<Partial<IComponentProvideClickerCollection>> { }
}
