import {EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin, OptionsGatherer} from "../../misc";
import {NgSelectOption} from "../../components/option";

/**
 * Options for keyboard handler plugin
 */
export interface KeyboardHandlerOptions extends PluginOptions
{
}

/**
 * Keyboard handler plugin interface
 */
export interface KeyboardHandler extends NgSelectPlugin
{
    /**
     * HTML element that represents select itself
     */
    selectElement: HTMLElement;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<any>;

    /**
     * Occurs when there is requested for change of visibility of popup using keyboard
     */
    readonly popupVisibilityRequest: EventEmitter<boolean>;

    /**
     * Occurs when option was selected using keyboard
     */
    readonly optionSelect: EventEmitter<NgSelectOption<any>>;
}