import { ContainerRuntimeFactoryWithDefaultComponent } from "@fluidframework/aqueduct";

import {ClickerCollection} from "@anandrag/clicker-shared/clickerCollection"
import {Clicker} from "@anandrag/clicker-shared/clicker"

export const fluidExport = new ContainerRuntimeFactoryWithDefaultComponent(
    ClickerCollection.getFactory().type,
    new Map([
        ClickerCollection.getFactory().registryEntry,
        Clicker.getFactory().registryEntry,
    ]));