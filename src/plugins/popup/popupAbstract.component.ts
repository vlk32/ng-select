import {AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList, ViewChildren, Directive} from '@angular/core';
import {StringLocalization} from '@anglr/common';
import {extend, isDescendant} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {ɵNgSelectOption} from '../../components/option';
import {NgSelectPluginInstances} from '../../components/select';
import {NgSelectPlugin, OptionsGatherer} from '../../misc';
import {PluginBus} from '../../misc/pluginBus/pluginBus';
import {Popup, PopupOptions, PopupTexts} from './popup.interface';
import {ValueHandler} from '../valueHandler';
import {VALUE_HANDLER} from '../valueHandler/types';


/**
 * Base abstract class for popup with options
 */
@Directive()
export class PopupAbstractComponent<TCssClasses = any, TOptions extends PopupOptions<TCssClasses> = any> implements Popup, NgSelectPlugin<TOptions>, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: TOptions;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Subscription for toggle popup event
     */
    protected _popupToggleSubscription: Subscription;

    /**
     * Subscription for popup visibility change request
     */
    protected _visibilityRequestSubscription: Subscription;

    /**
     * Subscription for changes of selected value
     */
    protected _valueChangedSubscription: Subscription;

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Indication whether is popup visible
     */
    protected _popupVisible: boolean = false;

    /**
     * Value handler plugin used within `NgSelect`
     */
    protected _valueHandler: ValueHandler;

    //######################### protected properties #########################

    /**
     * Gets indication whether keep open popup after value change
     */
    protected get keepOpen(): boolean
    {
        return this.pluginBus.selectOptions.multiple;
    }

    //######################### public properties - implementation of Popup #########################

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

    /**
     * Occurs when visibility of popup has changed
     */
    public visibilityChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Html element that represents popup itself
     */
    public get popupElement(): HTMLElement
    {
        let ref = this.popupElementChildren.first;

        if(!ref)
        {
            return null;
        }

        return ref.nativeElement;
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption[];

    /**
     * Object containing available texts
     * @internal
     */
    public texts: PopupTexts = {};
    
    //######################### public properties - children #########################

    /**
     * Watch for visibility of popup div element
     * @internal
     */
    @ViewChildren('popupDiv')
    public popupElementChildren: QueryList<ElementRef<HTMLElement>>;

    //######################### constructor #########################
    constructor(public ngSelectPlugins: NgSelectPluginInstances,
                public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                protected _document: HTMLDocument,
                protected _stringLocalization: StringLocalization)
    {
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this.popupElementChildren.changes.subscribe(() =>
        {
            if(!!this.popupElementChildren.first == this._popupVisible)
            {
                return;
            }

            //handle click outside
            if(this.popupElementChildren.first)
            {
                this._document.addEventListener('mouseup', this._handleClickOutside);
            }
            //unregister handle click outside
            else
            {
                this._document.removeEventListener('mouseup', this._handleClickOutside);
            }

            this._popupVisible = !!this.popupElementChildren.first;
            this.visibilityChange.emit()
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._optionsChangeSubscription?.unsubscribe();
        this._optionsChangeSubscription = null;

        this._popupToggleSubscription?.unsubscribe();
        this._popupToggleSubscription = null;

        this._valueChangedSubscription?.unsubscribe();
        this._valueChangedSubscription = null;

        this._visibilityRequestSubscription?.unsubscribe();
        this._visibilityRequestSubscription = null;

        this._textsChangedSubscription?.unsubscribe();
        this._textsChangedSubscription = null;

        this._document.removeEventListener('mouseup', this._handleClickOutside);
    }

    //######################### public methods - implementation of Popup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._textsChangedSubscription = this._stringLocalization.textsChange.subscribe(() => this._initTexts());

        if(this._optionsGatherer && this._optionsGatherer != this.pluginBus.selectOptions.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.pluginBus.selectOptions.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() => this.loadOptions());
        }

        if(!this._popupToggleSubscription)
        {
            this._popupToggleSubscription = this.pluginBus.togglePopup.subscribe(() => this.togglePopup());
        }

        if(!this._visibilityRequestSubscription)
        {
            this._visibilityRequestSubscription = this.pluginBus.showHidePopup.subscribe(this._handleVisibilityChange);
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
                if(!this.keepOpen)
                {
                    this._handleVisibilityChange(false);
                }
            });
        }

        this.loadOptions();
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
     * Loads options
     */
    protected loadOptions()
    {
        this.selectOptions = this._optionsGatherer.availableOptions;
        this._changeDetector.detectChanges();
    }

    /**
     * Toggles popup visibility
     */
    protected togglePopup()
    {
        this.options.visible = !this.options.visible;
        this._changeDetector.detectChanges();
    }

    /**
     * Handles click outside of select element
     * @param event - Mouse event object
     */
    protected _handleClickOutside = (event: MouseEvent) =>
    {
        if(this.pluginBus.selectElement.nativeElement != event.target &&
           !isDescendant(this.pluginBus.selectElement.nativeElement, event.target as HTMLElement) &&
           this.pluginElement.nativeElement != event.target &&
           !isDescendant(this.pluginElement.nativeElement, event.target as HTMLElement))
        {
            this.togglePopup();
        }
    }

    /**
     * Handles visibility change
     */
    protected _handleVisibilityChange = (visible: boolean) =>
    {
        if(this.options.visible != visible)
        {
            this.options.visible = visible;
            this._changeDetector.detectChanges();
        }
    };
}