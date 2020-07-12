import { Container } from "@fluidframework/container-loader";
import { IComponent, IRequest, IResponse } from "@fluidframework/component-core-interfaces";

import {IComponentClickerCollection} from "@anandrag/clicker-shared/clickerCollectionModel"

export async function getClickerCollection(container: Container, request: IRequest) : Promise<IComponentClickerCollection>{
    const response = await container.request(request);

    if (response.status !== 200 ||
        !(
            response.mimeType === "fluid/component" ||
            response.mimeType === "prague/component"
        )) {
        throw "Unknow mimetype in response !"
    }

    // We know the default component is a clicker collection
    const clickerCollection = response.value as IComponent;
    if (clickerCollection === undefined) {
        throw "Component request failed."
    }

    let clickerCollectionModel = clickerCollection.IComponentClickerCollection;
    if(clickerCollectionModel === undefined) {
        throw "Component is not a clicker collection."
    }
    
    return clickerCollectionModel;
}