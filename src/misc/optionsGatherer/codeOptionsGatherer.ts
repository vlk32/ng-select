import {EventEmitter} from "@angular/core";
import {isBlank} from "@jscrpt/common";
import {Subscription} from "rxjs";

import {OptionsGatherer, LiveSearchFilter} from "./optionsGatherer.interface";
import {NgSelectOption} from "../../components/option";
import {NgSelectPluginInstances} from "../../components/select";
import {LiveSearch} from "../../plugins/liveSearch";
import {LIVE_SEARCH} from "../../plugins/liveSearch/types";

/**
 * Options gatherer used for static options gathering from code
 */
export class CodeOptionsGatherer<TValue> implements OptionsGatherer<TValue>
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
    public set options(value: NgSelectOption<TValue>[])
    {
        this._options = value;
        this._availableOptions = value;
    }
    public get options(): NgSelectOption<TValue>[]
    {
        return this._options;
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

    //######################### constructor #########################
    constructor(private _liveSearchFilter?: LiveSearchFilter<TValue>)
    {
        if(isBlank(this._liveSearchFilter))
        {
            this._liveSearchFilter = (query: string) =>
            {
                return itm => itm.text.indexOf(query) >= 0;
            };
        }
    }

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

                this._availableOptions = this.options.filter(this._liveSearchFilter(this._liveSearch.searchValue));
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