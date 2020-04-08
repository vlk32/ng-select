import {Injectable, EventEmitter} from '@angular/core';

import {PluginBusOptions} from '../ngSelectOptions.interface';

/**
 * Class represents centralized bus for plugin communications
 */
@Injectable()
export class PluginBus<TValue = any>
{
    //######################### public properties #########################

    /**
     * Options passed to select
     */
    public selectOptions: PluginBusOptions<TValue>;

    //######################### public properties - events #########################

    /**
     * Occurs when popup visibility should be toggled
     */
    public togglePopup: EventEmitter<void>;

    /**
     * Occurs when popup visibility should be changed
     */
    public showHidePopup: EventEmitter<boolean>;

    /**
     * Occurs when popup visibility should be changed
     */
    public popupVisibilityChange: EventEmitter<void>;

    //######################### public properties - state #########################
}