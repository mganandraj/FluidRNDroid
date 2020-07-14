/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IComponent } from "@fluidframework/component-core-interfaces";

export const IComponentCounterCollection: keyof IComponentProvideCounterCollection = "IComponentCounterCollection";

export interface IComponentProvideCounterCollection {
    readonly IComponentCounterCollection: IComponentCounterCollection;
}

export interface IComponentCounterCollection extends IComponentProvideCounterCollection {
    addNewCounter(name: string): void;

    setOnNewCounterCallback( callback: (name: string) => void ) : void;

    getCounterNames() : IterableIterator<string>;

    getCounter(name: string): Promise<IComponent | undefined>;
}

declare module "@fluidframework/component-core-interfaces" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IComponent extends Readonly<Partial<IComponentProvideCounterCollection>> { }
}
