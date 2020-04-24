import {NgSelectPlugin, VisualPluginOptions} from "../../misc";
import {NgSelectOption} from '../../components/option';

//TODO - version 10, change order of TValue and TCssClasses

/**
 * Function used for transformation of ng select option into display text
 */
export interface DisplayTextFunc<TValue = any>
{
    /**
     * Transforms option into display text
     * @param option - Option that is being transformed
     */
    (option: NgSelectOption<TValue>): string;
}

/**
 * Texts that are used within NormalState
 */
export interface NormalStateTexts
{
    /**
     * Displayed when there is no value selected, represents empty value, used if value is null or empty array
     */
    nothingSelected?: string;
}

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses = any, TValue = any> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Texts that are used within any NormalState
     */
    texts?: NormalStateTexts;

    /**
     * Function used for transformation of option into display text
     */
    optionDisplayText?: DisplayTextFunc<TValue>;
}

/**
 * Normal state plugin interface
 */
export interface NormalState extends NgSelectPlugin
{
}

/**
 * Context for template that is used within normal state plugin
 */
export interface NormalStateContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: NormalState;
}