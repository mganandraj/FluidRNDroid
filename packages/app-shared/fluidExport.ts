import { ContainerRuntimeFactoryWithDefaultComponent } from "@fluidframework/aqueduct";

import {CounterCollectionFluidComponent} from "@anandrag/counter-shared/counterCollection"
import {CounterFluidComponent} from "@anandrag/counter-shared/counter"

export const fluidExport = new ContainerRuntimeFactoryWithDefaultComponent(
    CounterCollectionFluidComponent.getFactory().type,
    new Map([
        CounterCollectionFluidComponent.getFactory().registryEntry,
        CounterFluidComponent.getFactory().registryEntry,
    ]));