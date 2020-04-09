import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, OnDestroy, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend, isDescendant} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {BasicPopupOptions, BasicPopup} from './basicPopup.interface';
import {NgSelectPlugin, OptionsGatherer} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {POPUP_OPTIONS} from '../types';
import {ɵNgSelectOption} from '../../../components/option';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: BasicPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-popup",
    templateUrl: 'basicPopup.component.html',
    styleUrls: ['basicPopup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicPopupComponent implements BasicPopup, NgSelectPlugin<BasicPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPopupOptions;

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
     * Indication whether is popup visible
     */
    protected _popupVisible: boolean = false;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicPopupOptions
    {
        return this._options;
    }
    public set options(options: BasicPopupOptions)
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
    
    //######################### public properties - children #########################

    /**
     * Watch for visibility of popup div element
     * @internal
     */
    @ViewChildren('popupDiv')
    public popupElementChildren: QueryList<ElementRef<HTMLElement>>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: BasicPopupOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument)
    {
        this._options = extend(true, {}, defaultOptions, options);
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

        this._visibilityRequestSubscription?.unsubscribe();
        this._visibilityRequestSubscription = null;

        this._document.removeEventListener('mouseup', this._handleClickOutside);
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
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

        this.loadOptions();
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