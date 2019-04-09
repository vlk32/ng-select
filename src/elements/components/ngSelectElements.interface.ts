import {NgSelectOptions, NgSelectPlugin, NgSelectAction, NgSelectFunction} from "@anglr/select";
import {Observable} from "rxjs";

/**
 * Public API for NgSelect WebComponent
 */
export interface NgSelectWebComponent<TValue>
{
    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    readonly initializedWC: Observable<boolean>;

    /**
     * Gets current state of initialization
     */
    readonly isInitializedWC: boolean;

    /**
     * Gets or sets NgSelect options
     */
    selectOptionsWC: NgSelectOptions<TValue>;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initializeWC();

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    initOptionsWC();

    /**
     * Gets instance of plugin by its id
     * @param pluginId Id of plugin, use constants
     */
    getPluginWC<PluginType extends NgSelectPlugin>(pluginId: string): PluginType;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisualsWC(): void;

    /**
     * Executes actions on NgSelect
     * @param actions Array of actions that are executed over NgSelect
     */
    executeWC(...actions: NgSelectAction<TValue>[]);

    /**
     * Executes function on NgSelect and returns result
     * @param func Function that is executed and its result is returned
     */
    executeAndReturnWC<TResult>(func: NgSelectFunction<TResult, TValue>): TResult;
}