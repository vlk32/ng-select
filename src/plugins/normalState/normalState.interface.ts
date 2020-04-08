import {EventEmitter} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions, TemplateGatherer} from "../../misc";
import {NgSelectOption} from "../../components/option";

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

    /**
     * Indication whether NgSelect should be in readonly state
     */
    readonly?: boolean;
}

/**
 * Normal state plugin interface
 */
export interface NormalState extends NgSelectPlugin
{
    /**
     * Gatherer used for obtaining custom templates
     */
    templateGatherer: TemplateGatherer;

    /**
     * Occurs when user clicks on normal state
     */
    readonly click: EventEmitter<void>;

    /**
     * Occurs when normal state gains focus
     */
    readonly focus: EventEmitter<void>;

    /**
     * Occurs when user tries to cancel one of selected values
     */
    readonly cancelOption: EventEmitter<NgSelectOption>;
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