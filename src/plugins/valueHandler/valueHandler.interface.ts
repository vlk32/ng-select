import {EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin, OptionsGatherer, CompareValueFunc, LiveSearchFilter, NormalizeFunc} from "../../misc";
import {NgSelectOption} from "../../components/option";

//TODO - think how to clean usage of optionsGatherer, valueComparerer, liveSearchFilter, normalizerFunc, templateGatherer, move them into base plugin ?
//TODO - think of passing select options to each plugin (may solve also upper problem, but also multiple and readonly)

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions extends PluginOptions
{
    /**
     * Indication that multiple values can be selected
     */
    multiple?: boolean;
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler<TValue> extends NgSelectPlugin
{
    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Function of value comparer that is used for comparison of values
     */
    valueComparer: CompareValueFunc<TValue>;

    /**
     * Function for filtering options
     */
    liveSearchFilter: LiveSearchFilter<TValue>;

    /**
     * Normalizer used for normalizing values, usually when filtering
     */
    normalizer: NormalizeFunc<TValue>;

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
     * Occurs when there is requested for change of visibility of popup using keyboard
     */
    readonly popupVisibilityRequest: EventEmitter<boolean>;

    /**
     * Sets value for NgSelect
     * @param value Value to be set
     */
    setValue(value:TValue|TValue[]): void;

    /**
     * Returns first found options or null
     * @param text Text of option that is being searched
     * @param exact Indication whether return only option which is exact match
     */
    findAvailableOption(text: string, exact?: boolean): NgSelectOption<TValue>;
}