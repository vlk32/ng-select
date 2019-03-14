import {InjectionToken} from "@angular/core";

import {NgSelectPluginInstances} from './select.interface';

/**
 * Token used for obtaining 'NgSelectPluginInstances'
 */
export const NG_SELECT_PLUGIN_INSTANCES: InjectionToken<NgSelectPluginInstances> = new InjectionToken<NgSelectPluginInstances>('NG_SELECT_PLUGIN_INSTANCES');