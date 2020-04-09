import {NgSelectPlugin, VisualPluginOptions} from "../../misc";

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
export interface NormalStateOptions<TCssClasses = any> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Texts that are used within any NormalState
     */
    texts?: NormalStateTexts;
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