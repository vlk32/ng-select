import {InjectionToken} from "@angular/core";

import {PositionerOptions} from "./positioner.interface";

/**
 * Constant used for accessing positioner plugin in NgSelect
 */
export const POSITIONER = "POSITIONER";

/**
 * Token for injecting options for positioner plugin
 */
export const POSITIONER_OPTIONS: InjectionToken<PositionerOptions> = new InjectionToken<PositionerOptions>('POSITIONER_OPTIONS');