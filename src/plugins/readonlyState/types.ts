import {InjectionToken} from "@angular/core";

import {ReadonlyStateOptions} from "./readonlyState.interface";

/**
 * Constant used for accessing readonly state plugin in NgSelect
 */
export const READONLY_STATE = "READONLY_STATE";

/**
 * Token for injecting options for readonly state plugin
 */
export const READONLY_STATE_OPTIONS: InjectionToken<ReadonlyStateOptions<any>> = new InjectionToken<ReadonlyStateOptions<any>>('READONLY_STATE_OPTIONS');