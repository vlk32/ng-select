import {EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Options for text locator plugin
 */
export interface TextsLocatorOptions extends PluginOptions
{
}

/**
 * Public API for texts locator
 */
export interface TextsLocator extends NgSelectPlugin
{
    /**
     * Indication that texts should be obtained again, because they have changed
     */
    textsChange: EventEmitter<void>;

    /**
     * Gets text for specified key
     */
    getText(key: string): string;
}