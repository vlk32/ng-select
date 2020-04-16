import {EventEmitter} from "@angular/core";
import {Subscription} from 'rxjs';

import {OptionsGatherer} from "./optionsGatherer.interface";
import {NgSelectOption} from "../../components/option";
import {NgSelectPluginInstances, NgSelect} from "../../components/select";
import {PluginBus} from '../pluginBus/pluginBus';
import {ValueHandler} from '../../plugins/valueHandler';
import {VALUE_HANDLER} from '../../plugins/valueHandler/types';

/**
 * Options gatherer using default build in gatherer extended with exclusion of selected options
 */
export class ExcludingOptionsGatherer<TValue = any> implements OptionsGatherer<TValue>
{
    //######################### protected fields #########################

    /**
     * Array of visible, displayed options for select
     */
    protected _availableOptions: NgSelectOption<TValue>[] = [];

    /**
     * Occurs when array of visible, displayed options has changed
     */
    protected _availableOptionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Subscription for change of available options
     */
    protected _availableOptionsChangeSubscription: Subscription;

    /**
     * Subscription for change of value in value handler
     */
    protected _valueChangedSubscription: Subscription;

    /**
     * Value handler plugin used within `NgSelect`
     */
    protected _valueHandler: ValueHandler;

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of provided options for select
     */
    public get options(): NgSelectOption<TValue>[]
    {
        return this.select.options;
    }

    /**
     * Occurs when array of provided options has changed
     */
    public get optionsChange(): EventEmitter<void>
    {
        return this.select.optionsChange;
    }

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
        this.select.initializeGatherer();

        this._availableOptionsChangeSubscription = this.select.availableOptionsChange.subscribe(() => this._excludeSelected());

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._valueChangedSubscription.unsubscribe();
            this._valueChangedSubscription = null;

            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;

            this._valueChangedSubscription = this._valueHandler.valueChange.subscribe(() => this._excludeSelected());
        }

        this._excludeSelected();
    }

    /**
     * Called when gatherer needs to be destroyed
     */
    public destroyGatherer(): void
    {
        this._availableOptionsChangeSubscription?.unsubscribe();
        this._availableOptionsChangeSubscription = null;

        this._valueChangedSubscription?.unsubscribe();
        this._valueChangedSubscription = null;
    }

    //######################### protected methods #########################

    /**
     * Exclude selected options
     */
    protected _excludeSelected()
    {
        //nothing selected
        if(!this._valueHandler.value)
        {
            this._availableOptions = this.select.availableOptions;
            this._availableOptionsChange.emit();

            return;
        }

        let compare = this.pluginBus.selectOptions.valueComparer;
        let normalize = this.pluginBus.selectOptions.normalizer;

        //multi selected
        if(this.pluginBus.selectOptions.multiple && Array.isArray(this._valueHandler.value))
        {
            //filter out value
            if(this._valueHandler.value.length)
            {
                let value = this._valueHandler.value;
    
                this._availableOptions = this.select.availableOptions.filter(opt => !value.find(itm => compare(normalize(itm), normalize(opt.value))));
            }
            //nothing selected
            else
            {
                this._availableOptions = this.select.availableOptions;
            }
        }
        //single selected
        else if(!this.pluginBus.selectOptions.multiple)
        {
            this._availableOptions = this.select.availableOptions.filter(opt => !compare(normalize(opt.value), normalize(this._valueHandler.value)));
        }

        this._availableOptionsChange.emit();
    }
}