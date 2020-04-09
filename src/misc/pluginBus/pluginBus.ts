import {Injectable, EventEmitter, ElementRef} from '@angular/core';

import {PluginBusOptions} from '../ngSelectOptions.interface';
import {NgSelectOption} from '../../components/option';
import {PluginBusEvents} from './pluginBus.interface';

/**
 * Class represents centralized bus for plugin communications
 */
@Injectable()
export class PluginBus<TValue = any> implements PluginBusEvents
{
    //######################### public properties #########################

    /**
     * Options passed to select
     */
    public selectOptions: PluginBusOptions<TValue>;

    /**
     * HTML element that represents select itself
     */
    public selectElement: ElementRef<HTMLElement>;

    //######################### public properties - events #########################

    /**
     * Occurs when popup visibility should be toggled
     */
    public togglePopup: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Occurs when popup visibility should be changed
     */
    public showHidePopup: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Occurs when popup visibility should be changed
     */
    public popupVisibilityChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Occurs when option should be selected
     */
    public optionSelect: EventEmitter<NgSelectOption> = new EventEmitter<NgSelectOption>();

    /**
     * Occurs when option should be canceled
     */
    public optionCancel: EventEmitter<NgSelectOption> = new EventEmitter<NgSelectOption>();

    /**
     * Occurs when any part of select gains focus
     */
    public focus: EventEmitter<void> = new EventEmitter<void>();
}