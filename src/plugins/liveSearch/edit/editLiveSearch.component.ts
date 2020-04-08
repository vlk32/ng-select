import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {STRING_LOCALIZATION, StringLocalization} from '@anglr/common';
import {Subscription} from 'rxjs';

import {EditLiveSearchOptions, EditLiveSearch} from './editLiveSearch.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {LiveSearchTexts} from '../liveSearch.interface';
import {LIVE_SEARCH_OPTIONS} from '../types';
import {NormalState, NormalStateOptions} from '../../normalState';
import {NORMAL_STATE} from '../../normalState/types';
import {ValueHandler} from '../../valueHandler';
import {VALUE_HANDLER} from '../../valueHandler/types';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {ɵNgSelectOption} from '../../../components/option';

/**
 * Default options for live search
 * @internal
 */
const defaultOptions: EditLiveSearchOptions =
{
    cssClasses:
    {
        wrapperDiv: 'edit-wrapper-div',
        input: 'edit-control'
    },
    texts:
    {
        inputPlaceholder: 'Filter options'
    },
    keepSearchValue: false
};

/**
 * Component used for obtaining edit live search html element
 */
@Component(
{
    selector: "ng-edit-live-search",
    templateUrl: 'editLiveSearch.component.html',
    styleUrls: ['editLiveSearch.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLiveSearchComponent implements EditLiveSearch, NgSelectPlugin<EditLiveSearchOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Normal state plugin used within `NgSelect`
     */
    protected _normalState: NormalState;

    /**
     * Popup plugin used within `NgSelect`
     */
    protected _popup: Popup;

    /**
     * Value handler plugin used within `NgSelect`
     */
    protected _valueHandler: ValueHandler;

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Subscription for changes of selected value
     */
    protected _valueChangedSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: EditLiveSearchOptions;

    //######################### public properties - implementation of EditLiveSearch #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): EditLiveSearchOptions
    {
        return this._options;
    }
    public set options(options: EditLiveSearchOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * HTML element that represents live search
     */
    public get liveSearchElement(): HTMLElement
    {
        return this.liveSearchElementChild.nativeElement;
    }

    /**
     * Current value of live search
     */
    public searchValue: string = null;

    /**
     * Occurs when current value of live search changes
     */
    public searchValueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - template bindings #########################

    /**
     * Current value that is displayed
     * @internal
     */
    public searchValueDisplayed: string = null;

    /**
     * Object containing available texts
     * @internal
     */
    public texts: LiveSearchTexts = {};

    /**
     * Options that are passed to normalState
     * @internal
     */
    public get normalStateOptions(): NormalStateOptions
    {
        if(!this._normalState)
        {
            return null;
        }

        return this._normalState.options as NormalStateOptions;
    }

    //######################### public properties - children #########################

    /**
     * View child that represents live search element
     * @internal
     */
    @ViewChild('liveSearchElement')
    public liveSearchElementChild: ElementRef<HTMLElement>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(STRING_LOCALIZATION) protected _stringLocalization: StringLocalization,
                @Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: EditLiveSearchOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._textsChangedSubscription)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;
        }

        if(this._valueChangedSubscription)
        {
            this._valueChangedSubscription.unsubscribe();
            this._valueChangedSubscription = null;
        }
    }

    //######################### public methods - implementation of EditLiveSearch #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._textsChangedSubscription = this._stringLocalization.textsChange.subscribe(() => this._initTexts());

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(this._normalState && this._normalState != normalState)
        {
            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;
        }

        let popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;
        }

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

            this._valueChangedSubscription = this._valueHandler.valueChange.subscribe(() =>
            {
                let selected = this._valueHandler.selectedOptions;

                if(!selected || (Array.isArray(selected) && !selected.length))
                {
                    return;
                }

                if(Array.isArray(selected))
                {

                }
                else
                {
                    this.handleInput(null);
                    this.searchValueDisplayed = selected.text;
                    this._changeDetector.detectChanges();
                }
            });
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
        this._changeDetector.detectChanges();
    }

    //######################### public methods - template bindings #########################

    /**
     * Handle input value
     * @param value - Value of input
     * @param inputChange - Indication that change was by input event of input
     * @internal
     */
    public handleInput(value: string, inputChange: boolean = false)
    {
        this.searchValue = value;
        this.searchValueChange.emit();

        if(inputChange)
        {
            this.searchValueDisplayed = value;

            this._valueHandler.setValue(null);

            //do not change active if active is visible
            if(!this._valueHandler.optionsGatherer.availableOptions.find((option: ɵNgSelectOption) => option.active))
            {
                let option: ɵNgSelectOption = this._valueHandler.findAvailableOption(value);

                if(option)
                {
                    this._valueHandler.optionsGatherer.options.forEach((option: ɵNgSelectOption) => option.active = false);
                    option.active = true;
                    this._popup.invalidateVisuals();
                }
            }
        }
    }

    /**
     * Handles focus event
     * @param element - Element that got focus
     * @internal
     */
    public handleFocus(element: HTMLInputElement)
    {
        element.select();

        if(this._normalState)
        {
            this._normalState.click.emit();
            this._normalState.focus.emit();
        }
    }

    //######################### protected methods #########################

    /**
     * Initialize texts
     */
    protected _initTexts()
    {
        if(!this.normalStateOptions)
        {
            return;
        }

        this.texts.inputPlaceholder = this._stringLocalization.get(this.normalStateOptions.texts.nothingSelected);

        this._changeDetector.detectChanges();
    }
}