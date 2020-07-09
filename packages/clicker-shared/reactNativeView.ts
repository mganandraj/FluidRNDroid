/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * @deprecated - See IComponentReactNativeViewable
 */
export const IComponentReactNativeViewable: keyof IProvideComponentReactNativeViewable = "IComponentReactNativeViewable";

/**
 * @deprecated - See IComponentReactNativeViewable
 */
export interface IProvideComponentReactNativeViewable {
    readonly IComponentReactNativeViewable: IComponentReactNativeViewable;
}
/**
 * Interface describing components that can produce React elements when requested.
 * @deprecated - To support multiview scenarios, consider split view/model patterns like those demonstrated in
 * the multiview sample.
 */
export interface IComponentReactNativeViewable extends IProvideComponentReactNativeViewable {
    /**
     * Create a React element.
     */
    createNativeJSXElement(): JSX.Element;
}

declare module "@fluidframework/component-core-interfaces" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IComponent extends Readonly<Partial<IProvideComponentReactNativeViewable>> { }
}
