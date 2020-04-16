import {EventEmitter} from "@angular/core";
import {isPresent} from "@jscrpt/common";
import {Subscription, Observable} from "rxjs";
import {debounceTime} from "rxjs/operators";

import {OptionsGatherer} from "./optionsGatherer.interface";
import {NgSelectPluginInstances, NgSelect} from "../../components/select";
import {NgSelectOption} from "../../components/option";
import {DynamicOptionsGathererOptions} from "./dynamicOptionsGatherer.interface";
import {LiveSearch} from "../../plugins/liveSearch";
import {LIVE_SEARCH} from "../../plugins/liveSearch/types";
import {PluginBus} from '../pluginBus/pluginBus';
import {Popup} from '../../plugins/popup';
import {POPUP} from '../../plugins/popup/types';

/**
 * Class that is used as for options gathering in dynamic way, for example from external source when writing
 */
export class DynamicOptionsGatherer<TValue = any> implements OptionsGatherer<TValue>
{
    //######################### protected fields #########################

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    /**
     * Subscription for changes of live search value
     */
    protected _searchValueChangeSubscription: Subscription;

    /**
     * Subscription for visibility change of popup
     */
    protected _visibilitySubscription: Subscription;

    /**
     * Minimal number of characters required for searching
     */
    protected _minLength: number = 1;

    /**
     * Popup that is displayed
     */
    protected _popup: Popup;

    /**
     * Indication that first initial call was performed
     */
    protected _initialized: boolean = false;

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of provided options for select
     */
    public options: NgSelectOption<TValue>[] = [];

    /**
     * Occurs when array of provided options has changed
     */
    public optionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Array of visible, displayed options for select
     */
    public get availableOptions(): NgSelectOption<TValue>[]
    {
        return this.options;
    }

    /**
     * Occurs when array of visible, displayed options has changed
     */
    public get availableOptionsChange(): EventEmitter<void>
    {
        return this.optionsChange;
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

    //######################### constructor #########################
    constructor(protected _options: DynamicOptionsGathererOptions<TValue>)
    {
        if(!this._options)
        {
            throw new Error("Options can not be null!");
        }

        if(this._options && isPresent(this._options.minLength))
        {
            this._minLength = this._options.minLength;
        }
    }

    //######################### public methods - implementation of OptionsGatherer #########################

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

        let popup: Popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._visibilitySubscription.unsubscribe();
            this._visibilitySubscription = null;

            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;

            this._visibilitySubscription = this._popup.visibilityChange.subscribe(async () =>
            {
                if(this._initialized)
                {
                    return;
                }

                await this._processOptionsChange();
            });
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;

            let searchValueChange: Observable<void> = this._liveSearch.searchValueChange;

            if(this._options.delay)
            {
                searchValueChange = searchValueChange.pipe(debounceTime(this._options.delay));
            }

            this._searchValueChangeSubscription = searchValueChange.subscribe(async () => await this._processOptionsChange());
        }
    }

    /**
     * Called when gatherer needs to be destroyed
     */
    public destroyGatherer(): void
    {
        this._searchValueChangeSubscription?.unsubscribe();
        this._searchValueChangeSubscription = null;

        this._visibilitySubscription?.unsubscribe();
        this._visibilitySubscription = null;
    }

    //######################### protected methods #########################

    /**
     * Process options change request
     */
    protected async _processOptionsChange()
    {
        this._initialized = true;

        if((this._liveSearch.searchValue?.length ?? 0) < this._minLength)
        {
            this.options = [];
            this.optionsChange.emit();

            return;
        }

        this.options = await this._options.dynamicOptionsCallback(this._liveSearch.searchValue ?? '');
        this.optionsChange.emit();
    }
}