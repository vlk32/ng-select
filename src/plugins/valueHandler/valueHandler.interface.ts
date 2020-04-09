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

    /**
     * Returns first found options or null
     * @param text - Text of option that is being searched
     * @param exact - Indication whether return only option which is exact match
     */
    findAvailableOption(text: string, exact?: boolean): NgSelectOption<TValue>;
}