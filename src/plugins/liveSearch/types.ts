import {InjectionToken} from "@angular/core";

import {LiveSearchOptions} from "./liveSearch.interface";

/**
 * Constant used for accessing live search plugin in NgSelect
 */
export const LIVE_SEARCH = "LIVE_SEARCH";

/**
 * Token for injecting options for live search plugin
 */
export const LIVE_SEARCH_OPTIONS: InjectionToken<LiveSearchOptions> = new InjectionToken<LiveSearchOptions>('LIVE_SEARCH_OPTIONS');