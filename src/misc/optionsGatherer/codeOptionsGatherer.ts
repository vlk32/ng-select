import {EventEmitter} from "@angular/core";
import {Subscription} from "rxjs";

import {OptionsGatherer} from "./optionsGatherer.interface";
import {NgSelectOption} from "../../components/option";
import {NgSelectPluginInstances, NgSelect} from "../../components/select";
import {LiveSearch} from "../../plugins/liveSearch";
import {LIVE_SEARCH} from "../../plugins/liveSearch/types";
import {PluginBus} from '../pluginBus/pluginBus';

/**
 * Options gatherer used for static options gathering from code
 */
export class CodeOptionsGatherer<TValue = any> implements OptionsGatherer<TValue>
{
    //######################### private fields #########################

    /**
     * Array of visible, displayed options for select
     */
    private _availableOptions: NgSelectOption<TValue>[] = [];

    /**
     * Array of provided options for select
     */
    private _options: NgSelectOption<TValue>[] = [];

    /**
     * Occurs when array of visible, displayed options has changed
     */
    private _availableOptionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    /**
     * Subscription for changes of live search value
     */
    protected _searchValueChangeSubscription: Subscription;

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of provided options for select
     */
    public get options(): NgSelectOption<TValue>[]
    {
        return this._options;
    }
    public set options(value: NgSelectOption<TValue>[])
    {
        this._options = value;
        this._availableOptions = value;
    }

    /**
     * Occurs when array of provided options has changed
     */
    public optionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Array of visible, displayed options for select
     */
    public get availableOptions(): NgSelectOption<TValue>[]
    {
        return this._availableOptions;
    };

    /**
     * Occurs when array of visible, displayed options has changed
     */
    public get availableOptionsChange(): EventEmitter<void>
    {
        return this._availableOptionsChange;
    }

    /**
     * NgSelect plugin instances available for gatherer
     */
    public ngSelectPlugins: NgSelectPluginInstances;

    /**
     * Plugin bus used for inter plugin shared events
     */
    public pluginBus: PluginBus<TValue>;

    /**
     * Select element that implements default gatherers
     */
    public select: NgSelect<TValue>;

    //######################### public methods - implmentation of OptionsGatherer #########################

    /**
     * Initialize gatherer during initialization phase
     */
    public initializeGatherer(): void
    {
        let liveSearch = this.ngSelectPlugins[LIVE_SEARCH] as LiveSearch;

        if(this._liveSearch && this._liveSearch != liveSearch)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;

            this._liveSearch = null;
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;

            this._searchValueChangeSubscription = this._liveSearch.searchValueChange.subscribe(() =>
            {
                if(!this._liveSearch.searchValue)
                {
                    this._availableOptions = this.options;
                    this._availableOptionsChange.emit();

                    return;
                }

                this._availableOptions = this.options.filter(this.pluginBus.selectOptions.liveSearchFilter(this._liveSearch.searchValue, this.pluginBus.selectOptions.normalizer));
                this._availableOptionsChange.emit();
            });
        }
    }

    /**
     * Called when gatherer needs to be destroyed
     */
    public destroyGatherer(): void
    {
        if(this._searchValueChangeSubscription)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;
        }
    }
}