import {InjectionToken} from "@angular/core";

import {PopupOptions} from "./popup.interface";

/**
 * Constant used for accessing popup plugin in NgSelect
 */
export const POPUP = "POPUP";

/**
 * Token for injecting options for popup plugin
 */
export const POPUP_OPTIONS: InjectionToken<PopupOptions> = new InjectionToken<PopupOptions>('POPUP_OPTIONS');