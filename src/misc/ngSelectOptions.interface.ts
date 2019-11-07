
import {NgSelectPluginTypes} from "./plugin.interface";
import {OptionsGatherer, LiveSearchFilter} from "./optionsGatherer/optionsGatherer.interface";
import {TemplateGatherer} from "./templateGatherer.interface";

/**
 * Function used for comparing two values
 */
export interface CompareValueFunc<TValue>
{
    /**
     * Compares two values and returns true if objects are equal, otherwise false
     * @param source First value to be compared
     * @param target Second value to be compared
     */
    (source: TValue, target: TValue): boolean;
}

/**
 * Describes select options used for NgSelect
 */
export interface NgSelectOptions<TValue>
{
    /**
     * Indication whether NgSelect should be initialized automaticaly during 'NgOnInit' phase
     */
    autoInitialize?: boolean;

    /**
     * Css classes applied to ng select component, possible to override only part of classes
     */
    cssClasses?: {};

    /**
     * Object defining overrides for default plugins, default plugins can be also specified using DI
     */
    plugins?: NgSelectPluginTypes;

    /**
     * Instance of options gatherer that is used for obtaining options
     */
    optionsGatherer?: OptionsGatherer<TValue>;

    /**
     * Instance of template gatherer used for obtaining custom templates
     */
    templateGatherer?: TemplateGatherer;

    /**
     * Indication whether is NgSelect readonly or not
     */
    readonly?: boolean;

    /**
     * Indication whether is 'Popup' plugin displayd inside of NgSelect (false) or directly in Body (true)
     */
    absolute?: boolean;

    /**
     * Indication whether force value check on initialization of select, this allows to change value of form control to value of valueHandler
     */
    forceValueCheckOnInit?: boolean;

    /**
     * Function of value comparer that is used for comparison of values
     */
    valueComparer?: CompareValueFunc<TValue>;

    /**
     * Method that is used for filtering when live search is running on static data
     */
    liveSearchFilter?: LiveSearchFilter<TValue>;
}