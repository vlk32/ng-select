import {EventEmitter} from '@angular/core';

import {NgSelectOption} from '../../components/option';

/**
 * Represents all events implemented by plugin bus
 */
export interface PluginBusEvents
{
    //######################### public properties - events #########################

    /**
     * Occurs when popup visibility should be toggled
     */
    readonly togglePopup: EventEmitter<void>;

    /**
     * Occurs when popup visibility should be changed
     */
    readonly showHidePopup: EventEmitter<boolean>;

    /**
     * Occurs when option should be selected
     */
    readonly optionSelect: EventEmitter<NgSelectOption>;

    /**
     * Occurs when option should be canceled
     */
    readonly optionCancel: EventEmitter<NgSelectOption>;

    /**
     * Occurs when any part of select gains focus
     */
    readonly focus: EventEmitter<void>;
}