import {InjectionToken} from "@angular/core";

import {ValueHandlerOptions} from "./valueHandler.interface";

/**
 * Constant used for accessing value handler plugin in NgSelect
 */
export const VALUE_HANDLER = "VALUE_HANDLER";

/**
 * Token for injecting options for value handler plugin
 */
export const VALUE_HANDLER_OPTIONS: InjectionToken<ValueHandlerOptions> = new InjectionToken<ValueHandlerOptions>('VALUE_HANDLER_OPTIONS');