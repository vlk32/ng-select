import {InjectionToken} from "@angular/core";

import {TextsLocatorOptions} from "./textsLocator.interface";

/**
 * Constant used for accessing texts locator plugin in NgSelect
 */
export const TEXTS_LOCATOR = "TEXTS_LOCATOR";

/**
 * Token for injecting options for texts locator plugin
 */
export const TEXTS_LOCATOR_OPTIONS: InjectionToken<TextsLocatorOptions> = new InjectionToken<TextsLocatorOptions>('TEXTS_LOCATOR_OPTIONS');