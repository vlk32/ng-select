import {ChangeDetectorRef, ElementRef, OnDestroy, Directive} from '@angular/core';
import {StringLocalization} from '@anglr/common';
import {extend} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {NgSelectPluginInstances} from '../../components/select';
import {NgSelectPlugin} from '../../misc';
import {PluginBus} from '../../misc/pluginBus/pluginBus';
import {NormalState, NormalStateOptions, NormalStateTexts} from './normalState.interface';
import {ValueHandler} from '../valueHandler/valueHandler.interface';
import {VALUE_HANDLER} from '../valueHandler/types';

/**
 * Base abstract class for normal state of select
 */
@Directive()
export abstract class NormalStateAbstractComponent<TCssClasses = any, TOptions extends NormalStateOptions<TCssClasses> = any> implements NormalState, NgSelectPlugin<TOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: TOptions;

    /**
     * Indication whether was component destroyed
     */
    protected _destroyed: boolean = false;

    //######################### public properties - implementation of NormalState #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): TOptions
    {
        return this._options;
    }
    public set options(options: TOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### public properties - template bindings #########################

    /**
     * Object containing available texts
     * @internal
     */
    public texts: NormalStateTexts = {};

    /**
     * Value handler used in NgSelect
     * @internal
     */
    public valueHandler: ValueHandler;

    //######################### constructor #########################
    constructor(public ngSelectPlugins: NgSelectPluginInstances,
                public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                protected _stringLocalization: StringLocalization)
    {
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._destroyed = true;

        this._textsChangedSubscription?.unsubscribe();
        this._textsChangedSubscription = null;
    }

    //######################### public methods - implementation of NormalState #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._textsChangedSubscription = this._stringLocalization.textsChange.subscribe(() => this._initTexts());

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler;

        if(this.valueHandler && this.valueHandler != valueHandler)
        {
            this.valueHandler = null;
        }

        if(!this.valueHandler)
        {
            this.valueHandler = valueHandler;
        }

        this._initTexts();
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
        if(!this._destroyed)
        {
            this._changeDetector.detectChanges();
        }
    }

    //######################### protected methods #########################

    /**
     * Initialize texts
     */
    protected _initTexts()
    {
        Object.keys(this.options.texts).forEach(key =>
        {
            this.texts[key] = this._stringLocalization.get(this.options.texts[key]);
        });

        this._changeDetector.detectChanges();
    }
}