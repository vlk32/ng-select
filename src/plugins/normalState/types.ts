import {InjectionToken} from "@angular/core";

import {NormalStateOptions} from "./normalState.interface";

/**
 * Constant used for accessing normal state plugin in NgSelect
 */
export const NORMAL_STATE = "NORMAL_STATE";

/**
 * Token for injecting options for normal state plugin
 */
export const NORMAL_STATE_OPTIONS: InjectionToken<NormalStateOptions<any>> = new InjectionToken<NormalStateOptions<any>>('NORMAL_STATE_OPTIONS');