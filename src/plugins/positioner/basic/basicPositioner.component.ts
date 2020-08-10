import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy, PLATFORM_ID, ChangeDetectorRef} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {positionsWithFlip} from '@anglr/common/positions';
import {extend, isNumber} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {BasicPositionerOptions, BasicPositioner} from './basicPositioner.interface';
import {NgSelectPlugin, OptionsGatherer} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {POSITIONER_OPTIONS} from '../types';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {ScrollTargetSelector} from './types';

/**
 * Default options for positioner
 * @internal
 */
const defaultOptions: BasicPositionerOptions =
{
    optionsCoordinates: 'top left',
    selectCoordinates: 'bottom left',
    flipCallback: () => {},
    scrollTarget: null,
    activateOnResize: true,
    activateOnScroll: true
};

/**
 * Component used for positioning popup element, handles resize, scroll and collision with viewport
 */
@Component(
{
    selector: "ng-basic-positioner",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicPositionerComponent implements BasicPositioner, NgSelectPlugin<BasicPositionerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer;

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPositionerOptions;

    /**
     * Subscription for visibility change of popup
     */
    protected _visibilitySubscription: Subscription;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Popup that is displayed
     */
    protected _popup: Popup;

    /**
     * Html element of popup plugin
     */
    protected _popupElement: HTMLElement;

    /**
     * Indication whether is code running in browser
     */
    protected _isBrowser: boolean = isPlatformBrowser(this._platformId);

    //######################### public properties - implementation of BasicPositioner #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicPositionerOptions
    {
        return this._options;
    }
    public set options(options: BasicPositionerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### protected properties #########################

    /**
     * Gets scroll target
     */
    public get scrollTarget(): EventTarget
    {
        return this._options.scrollTarget || this._scrollTargetSelector.scrollTarget;
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POSITIONER_OPTIONS) @Optional() options?: BasicPositionerOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument,
                @Inject(PLATFORM_ID) protected _platformId?: Object,
                protected _scrollTargetSelector?: ScrollTargetSelector)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._visibilitySubscription?.unsubscribe();
        this._visibilitySubscription = null;

        this._optionsChangeSubscription?.unsubscribe();
        this._optionsChangeSubscription = null;

        if(this._isBrowser)
        {
            window.removeEventListener('resize', this._handleResizeAndScroll);
            this.scrollTarget?.removeEventListener('scroll', this._handleResizeAndScroll);
        }
    }

    //######################### public methods - implementation of BasicPositioner #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.pluginBus?.selectOptions.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.pluginBus?.selectOptions.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() =>
            {
                if(this._popup.popupElement && this._optionsGatherer.availableOptions)
                {
                    this._handlePosition();
                }
            });
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

            this._visibilitySubscription = this._popup.visibilityChange.subscribe(() => this._handlePosition());
        }

        this._handlePosition();
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
     * Handles resize and scroll event
     */
    protected _handleResizeAndScroll = () =>
    {
        this._updateMinWidth();
        positionsWithFlip(this._popupElement, this.options.optionsCoordinates, this.pluginBus.selectElement.nativeElement, this.options.selectCoordinates, this._document, this.options.flipCallback);
    };

    /**
     * Handles position of popup
     */
    protected _handlePosition()
    {
        this._popupElement = this._popup.popupElement;

        //this has meaning only when popup is outside of ng-element
        this._changeDetector.markForCheck();

        if(this._isBrowser)
        {
            //register events and handle position of opened popup
            if(this._popupElement)
            {
                if(this._options.activateOnResize)
                {
                    window.addEventListener('resize', this._handleResizeAndScroll);
                }

                if(this._options.activateOnScroll)
                {
                    this.scrollTarget?.addEventListener('scroll', this._handleResizeAndScroll);
                }
    
                this._handleResizeAndScroll();
            }
            //unregister events
            else
            {
                window.removeEventListener('resize', this._handleResizeAndScroll);
                this.scrollTarget?.removeEventListener('scroll', this._handleResizeAndScroll);
            }
        }
    }

    /**
     * Updates min width of popup
     */
    protected _updateMinWidth()
    {
        if(!this._popupElement)
        {
            return;
        }

        let minWidth = this.pluginBus.selectElement.nativeElement.clientWidth;

        if(isNaN(minWidth) || !isNumber(minWidth))
        {
            return;
        }

        this._popupElement.style.minWidth = `${minWidth}px`;
    }
}