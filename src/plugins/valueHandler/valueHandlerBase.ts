import {ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgSelectPlugin, OptionsGatherer, CompareValueFunc, LiveSearchFilter, NormalizeFunc} from '../../misc';
import {NgSelectPluginInstances} from '../../components/select';
import {ɵNgSelectOption, NgSelectOption} from '../../components/option';
import {NormalState} from '../normalState';
import {NORMAL_STATE} from '../normalState/types';
import {ValueHandler, ValueHandlerOptions} from './valueHandler.interface';
import {PluginBus} from '../../misc/pluginBus/pluginBus';

/**
 * Base class for value handlers
 */
export abstract class ValueHandlerBase<TValue = any, TOptions extends ValueHandlerOptions = any> implements ValueHandler<TValue>, NgSelectPlugin<TOptions, TValue>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: TOptions;

    /**
     * Normal state that is used
     */
    protected _normalState: NormalState;

    /**
     * Subscription for option selection
     */
    protected _optionSelectSubscription: Subscription;

    /**
     * Subscription for option cancelation
     */
    protected _optionCancelSubscription: Subscription;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<TValue>;

    //######################### public properties - implementation of DynamicValueHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public abstract options: TOptions;

    /**
     * Occurs when value of NgSelect changes
     */
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Current value of NgSelect
     */
    public selectedOptions: NgSelectOption<TValue>|NgSelectOption<TValue>[];

    /**
     * Current selected value of NgSelect
     */
    public get value(): TValue|TValue[]
    {
        if(this.selectedOptions)
        {
            if(Array.isArray(this.selectedOptions))
            {
                return this.selectedOptions.map(opt => opt.value);
            }
            else
            {
                return this.selectedOptions.value;
            }
        }

        return null;
    }

    //######################### protected properties #########################

    /**
     * Function of value comparer that is used for comparison of values
     */
    protected get valueComparer(): CompareValueFunc<TValue>
    {
        return this.pluginBus?.selectOptions?.valueComparer;
    }

    /**
     * Method that is used for filtering when live search is running on static data
     */
    protected get liveSearchFilter(): LiveSearchFilter<TValue>
    {
        return this.pluginBus?.selectOptions?.liveSearchFilter;
    }

    /**
     * Normalizer used for normalizing values
     */
    protected get normalizer(): NormalizeFunc<TValue>
    {
        return this.pluginBus?.selectOptions?.normalizer;
    }

    //######################### constructor #########################
    constructor(public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                public pluginBus: PluginBus<TValue>)
    {
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._optionSelectSubscription?.unsubscribe();
        this._optionSelectSubscription = null;

        this._optionsChangeSubscription?.unsubscribe();
        this._optionsChangeSubscription = null;

        this._optionCancelSubscription?.unsubscribe();
        this._optionCancelSubscription = null;
    }

    //######################### public methods - implementation of DynamicValueHandler #########################

    /**
     * Sets value for NgSelect
     * @param value - Value to be set
     */
    public abstract setValue(value:TValue|TValue[]): void;

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.pluginBus?.selectOptions?.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.pluginBus?.selectOptions?.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.optionsChange.subscribe(() => this._loadOptions());
        }

        if(!this._optionSelectSubscription)
        {
            this._optionSelectSubscription = this.pluginBus.optionSelect.subscribe(this._setValue);
        }

        if(!this._optionCancelSubscription)
        {
            this._optionCancelSubscription = this.pluginBus.optionCancel.subscribe(this._cancelValue);
        }

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;
        this._normalState = normalState;

        this._loadOptions();
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

    //######################### protected methods #########################

    /**
     * Sets value 
     */
    protected abstract _setValue: (option: ɵNgSelectOption<TValue>) => void;

    /**
     * Cancels, removes option from selected options
     * @param option - Option to be canceled
     */
    protected _cancelValue = (option: ɵNgSelectOption<TValue>): void =>
    {
        if(Array.isArray(this.selectedOptions))
        {
            let index = this.selectedOptions.indexOf(option);

            if(index >= 0)
            {
                this.selectedOptions.splice(index, 1);
                this.selectedOptions = [...this.selectedOptions];
            }
        }
        else
        {
            if(this.selectedOptions == option)
            {
                this.selectedOptions = null;
            }
        }

        this._clearSelected();
        this._markValueAsSelected();

        this._normalState.invalidateVisuals();
        this.valueChange.emit();
    }

    /**
     * Clears all selected values
     */
    protected _clearSelected()
    {
        this._optionsGatherer.options.forEach((option: ɵNgSelectOption<TValue>) => option.selected = false);
    }

    /**
     * Marks current value as selected
     */
    protected _markValueAsSelected()
    {
        if(this.selectedOptions)
        {
            if(Array.isArray(this.selectedOptions))
            {
                this.selectedOptions.forEach((option: ɵNgSelectOption<TValue>) => option.selected = true);
            }
            else
            {
                (this.selectedOptions as ɵNgSelectOption<TValue>).selected = true;
            }
        }
    }

    /**
     * Loads options
     */
    protected abstract _loadOptions(): void;
}