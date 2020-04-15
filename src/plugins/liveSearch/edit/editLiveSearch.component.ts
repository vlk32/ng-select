import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {STRING_LOCALIZATION, StringLocalization} from '@anglr/common';
import {Subscription} from 'rxjs';

import {EditLiveSearchOptions, EditLiveSearch} from './editLiveSearch.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {LIVE_SEARCH_OPTIONS} from '../types';
import {ValueHandler} from '../../valueHandler';
import {VALUE_HANDLER} from '../../valueHandler/types';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {ɵNgSelectOption} from '../../../components/option';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {LiveSearchTexts} from '../liveSearch.interface';

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
        inputPlaceholder: 'Select item'

    },
    keepSearchValue: false,
    nonExistingCancel: false,
    useNonExistingAsValue: false
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
     * Subscription for live search focus request
     */
    protected _liveSearchFocusSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: EditLiveSearchOptions;

    //######################### protected properties #########################

    /**
     * Gets currently available options
     */
    protected get availableOptions(): ɵNgSelectOption[]
    {
        return this.pluginBus.selectOptions.optionsGatherer.availableOptions;
    }

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

    //######################### public properties - children #########################

    /**
     * View child that represents live search element
     * @internal
     */
    @ViewChild('liveSearchElement')
    public liveSearchElementChild: ElementRef<HTMLElement>;

    /**
     * View child that represents input element
     * @internal
     */
    @ViewChild('inputElement')
    public inputElementChild: ElementRef<HTMLInputElement>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
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
        this._textsChangedSubscription?.unsubscribe();
        this._textsChangedSubscription = null;

        this._valueChangedSubscription?.unsubscribe();
        this._valueChangedSubscription = null;

        this._liveSearchFocusSubscription?.unsubscribe();
        this._liveSearchFocusSubscription = null;
    }

    //######################### public methods - implementation of EditLiveSearch #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._textsChangedSubscription = this._stringLocalization.textsChange.subscribe(() => this._initTexts());

        let popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;
        }

        if(!this._liveSearchFocusSubscription)
        {
            this._liveSearchFocusSubscription = this.pluginBus.liveSearchFocus.subscribe(() =>
            {
                this.inputElementChild?.nativeElement.focus();
            });
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
                    //reset filtering of available options
                    this.handleInput(null);
                    //set selected into live search
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

            //single value select
            if(!this.pluginBus.selectOptions.multiple)
            {
                //cancel value
                if(this._options.nonExistingCancel)
                {
                    this._valueHandler.setValue(null);
                }
                //otherwise keep last value
            }

            //do not change active if active is visible
            if(!this.pluginBus.selectOptions.optionsGatherer.availableOptions.find((option: ɵNgSelectOption) => option.active))
            {
                let option: ɵNgSelectOption = this.pluginBus.selectOptions.optionsGatherer.availableOptions.find(itm => this.pluginBus.selectOptions.liveSearchFilter(value, this.pluginBus.selectOptions.normalizer)(itm));

                if(option)
                {
                    this.pluginBus.selectOptions.optionsGatherer.options.forEach((option: ɵNgSelectOption) => option.active = false);
                    option.active = true;
                    this._popup.invalidateVisuals();
                }
            }
        }
    }

    /**
     * Handles focus event
     * @param element - Element that got focus
     * @param show - Indication whether show popup
     * @internal
     */
    public handleFocus(element: HTMLInputElement, show: boolean = false)
    {
        element.select();

        this._activateSelectedOrFirst();

        if(show)
        {
            this.pluginBus.showHidePopup.emit(true);
        }

        this.pluginBus.focus.emit();
    }

    /**
     * Handles blur of live search
     */
    public handleBlur()
    {
        //not multiple and selected value
        if(!this.pluginBus.selectOptions.multiple)
        {
            //use selected text
            if(this._valueHandler.selectedOptions && !Array.isArray(this._valueHandler.selectedOptions))
            {
                this.searchValueDisplayed = this._valueHandler.selectedOptions.text;
            }
            //reset text
            else
            {
                this.searchValueDisplayed = '';
            }
        }

        //reset available options
        this.searchValue = null;
        this.searchValueChange.emit();
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

    /**
     * Activates first available option or selected option
     */
    protected _activateSelectedOrFirst()
    {
        let activeOption = this.availableOptions.find(itm => itm.active);
        let selectedOptions = this.availableOptions.filter(itm => itm.selected);

        //nothing active, nothing selected
        if(!activeOption && !selectedOptions.length)
        {
            let first = this.availableOptions[0];

            if(first)
            {
                first.active = true;
            }
        }
        //nothing active
        else if(!activeOption)
        {
            //last selected as sactive
            selectedOptions[selectedOptions.length - 1].active = true;
        }
    }
}