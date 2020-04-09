import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {StringLocalization, STRING_LOCALIZATION} from '@anglr/common';
import {Subscription} from 'rxjs';

import {EditNormalStateOptions, EditNormalState} from './editNormalState.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {NormalStateTexts} from '../normalState.interface';
import {NORMAL_STATE_OPTIONS} from '../types';
import {ValueHandler} from '../../valueHandler';
import {VALUE_HANDLER} from '../../valueHandler/types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: EditNormalStateOptions =
{
    cssClasses:
    {
        normalStateElement: 'btn btn-select',
        selectedCarretWrapper: 'selected-caret',
        selectedCarret: 'fa fa-caret-down',
        selectedValue: 'selected-value',
    },
    texts:
    {
        nothingSelected: 'Nothing selected'
    }
};

/**
 * Component used for rendering edit normal state of select
 */
@Component(
{
    selector: "div.edit-normal-state",
    templateUrl: 'editNormalState.component.html',
    styleUrls: ['editNormalState.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNormalStateComponent implements EditNormalState, NgSelectPlugin<EditNormalStateOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: EditNormalStateOptions;

    /**
     * Indication whether was component destroyed
     */
    protected _destroyed: boolean = false;

    //######################### public properties - implementation of EditNormalState #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): EditNormalStateOptions
    {
        return this._options;
    }
    public set options(options: EditNormalStateOptions)
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
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(STRING_LOCALIZATION) protected _stringLocalization: StringLocalization,
                @Inject(NORMAL_STATE_OPTIONS) @Optional() options?: EditNormalStateOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
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

    //######################### public methods - implementation of EditNormalState #########################

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