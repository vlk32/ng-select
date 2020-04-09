import {EventEmitter} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions} from "../../misc";
import {NgSelectOption} from "../../components/option";

/**
 * Options for popup plugin
 */
export interface PopupOptions<TCssClasses = any> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Indication whether are popup options visible, or not
     */
    visible?: boolean;
}

/**
 * Popup plugin interface
 */
export interface Popup extends NgSelectPlugin
{
    /**
     * Occurs when visibility of popup has changed
     */
    readonly visibilityChange: EventEmitter<void>;

    /**
     * Html element that represents popup itself
     */
    readonly popupElement: HTMLElement;
}

/**
 * Context for template that is used within popup plugin
 */
export interface PopupContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: NgSelectOption;

    /**
     * Instance of plugin itself
     */
    popup: Popup;
}