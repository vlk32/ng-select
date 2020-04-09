import {Observable, Subscription} from "rxjs";

import {NgSelectPlugin, NgSelectOptions} from "../../misc";
import {PluginBusEvents} from '../../misc/pluginBus/pluginBus.interface';

/**
 * Interface describing object storing all existing plugin instances for NgSelect
 */
export interface NgSelectPluginInstances
{
    [pluginName: string]: NgSelectPlugin;
}

/**
 * Public API for NgSelect
 */
export interface NgSelect<TValue = any>
{
    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    readonly initialized: Observable<boolean>;

    /**
     * Gets current state of initialization
     */
    readonly isInitialized: boolean;

    /**
     * Gets or sets NgSelect options
     */
    selectOptions: NgSelectOptions<TValue>;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initialize(): void;

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    initOptions(): void;

    /**
     * Initialize external plugin instance
     * @param plugin - External select plugin instance to be initialized with internal properties
     */
    initializePluginInstance(plugin: NgSelectPlugin): void;

    /**
     * Gets instance of plugin by its id
     * @param pluginId - Id of plugin, use constants
     */
    getPlugin<PluginType extends NgSelectPlugin>(pluginId: string): PluginType;

    /**
     * Subscribes for event
     * @param eventName - Name of event that should be listened to
     * @param handler - Function used for handling event
     */
    listenTo<TParam = void>(eventName: keyof PluginBusEvents, handler: (data: TParam) => void): Subscription;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;

    /**
     * Executes actions on NgSelect
     * @param actions - Array of actions that are executed over NgSelect
     */
    execute(...actions: NgSelectAction<TValue>[]): void;

    /**
     * Executes function on NgSelect and returns result
     * @param func - Function that is executed and its result is returned
     */
    executeAndReturn<TResult>(func: NgSelectFunction<TResult, TValue>): TResult;
}

/**
 * Defintion of action that can be executed on NgSelect
 */
export type NgSelectAction<TValue = any> = (ngSelect: NgSelect<TValue>) => void;

/**
 * Definition of function that can be executed on NgSelect and returns some data
 */
export type NgSelectFunction<TResult = any, TValue = any> = (ngSelect: NgSelect<TValue>) => TResult;