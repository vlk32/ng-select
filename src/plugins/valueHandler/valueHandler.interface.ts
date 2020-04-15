import {EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";
import {NgSelectOption} from "../../components/option";

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions extends PluginOptions
{
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler<TValue = any> extends NgSelectPlugin
{
    /**
     * Current selected options of NgSelect
     */
    readonly selectedOptions: NgSelectOption<TValue>|NgSelectOption<TValue>[];

    /**
     * Current selected value of NgSelect
     */
    readonly value: TValue|TValue[];

    /**
     * Occurs when value of NgSelect changes
     */
    readonly valueChange: EventEmitter<void>;

    /**
     * Sets value for NgSelect
     * @param value - Value to be set
     */
    setValue(value:TValue|TValue[]): void;
}