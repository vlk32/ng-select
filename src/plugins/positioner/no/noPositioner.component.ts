import {NoPositioner, NoPositionerOptions} from "./noPositioner.interface";
import {ChangeDetectionStrategy, Component, ElementRef, Inject, Optional} from "@angular/core";
import {extend} from "@jscrpt/common";

import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {POSITIONER_OPTIONS} from '../types';

/**
 * Default options for positioner
 * @internal
 */
const defaultOptions: NoPositionerOptions =
{
};

/**
 * Component used for not positioning popup
 */
@Component(
{
    selector: "ng-no-positioner",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoPositionerComponent implements NoPositioner, NgSelectPluginGeneric<NoPositionerOptions>
{
    //######################### private properties #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: NoPositionerOptions;

    //######################### public properties - implementation of NoPositioner #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): NoPositionerOptions
    {
        return this._options;
    }
    public set options(options: NoPositionerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;


    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                @Inject(POSITIONER_OPTIONS) @Optional() options?: NoPositionerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of NoPositioner #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}