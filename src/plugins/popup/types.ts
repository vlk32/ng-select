import {InjectionToken} from "@angular/core";

import {PopupOptions} from "./popup.interface";

/**
 * Constant used for accessing popup plugin in NgSelect
 */
export const POPUP = "POPUP";

/**
 * Token for injecting options for popup plugin
 */
export const POPUP_OPTIONS: InjectionToken<PopupOptions<any>> = new InjectionToken<PopupOptions<any>>('POPUP_OPTIONS');