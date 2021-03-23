import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy, PLATFORM_ID, ChangeDetectorRef} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {NgSelectPlugin, NgSelectPluginInstances, NG_SELECT_PLUGIN_INSTANCES, OptionsGatherer, PluginBus, POPUP, Popup, POSITIONER_OPTIONS} from '@arborai/select';
import {extend} from '@jscrpt/common';
import {createPopper} from '@popperjs/core';
import type {Instance} from '@popperjs/core';
import {Subscription} from 'rxjs';

import {PopperJsPositioner, PopperJsPositionerOptions} from './popperjsPositioner.interface';

/**
 * Default options for positioner
 * @internal
 */
const defaultOptions: PopperJsPositionerOptions =
{
};

/**
 * Component used for positioning popup element, using popper js
 */
@Component(
{
    selector: "ng-popperjs-positioner",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopperJsPositionerComponent implements PopperJsPositioner, NgSelectPlugin<PopperJsPositionerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer;

    /**
     * Options for NgSelect plugin
     */
    protected _options: PopperJsPositionerOptions;

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
     * Instance of popper js
     */
    protected _popperJsInstance: Instance;

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
    public get options(): PopperJsPositionerOptions
    {
        return this._options;
    }
    public set options(options: PopperJsPositionerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POSITIONER_OPTIONS) @Optional() options?: PopperJsPositionerOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument,
                @Inject(PLATFORM_ID) protected _platformId?: Object)
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

        this._popperJsInstance?.destroy();
        this._popperJsInstance = null;
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
     * Handles position of popup
     */
    protected _handlePosition()
    {
        this._popupElement = this._popup.popupElement;

        // //this has meaning only when popup is outside of ng-element
        // this._changeDetector.markForCheck();

        if(this._isBrowser)
        {
            //register events and handle position of opened popup
            if(this._popupElement)
            {
                if(this._popperJsInstance)
                {
                    // this._popperJsInstance.update();

                    return;
                }

                this._popperJsInstance = createPopper(this.pluginBus.selectElement.nativeElement,
                                                      this._popupElement,
                                                      {
                                                          placement: 'bottom-start'
                                                      });
            }
            //unregister events
            else
            {
                this._popperJsInstance?.destroy();
                this._popperJsInstance = null;
            }
        }
    }

    // /**
    //  * Updates min width of popup
    //  */
    // protected _updateMinWidth()
    // {
    //     if(!this._popupElement)
    //     {
    //         return;
    //     }

    //     let minWidth = this.pluginBus.selectElement.nativeElement.clientWidth;

    //     if(isNaN(minWidth) || !isNumber(minWidth))
    //     {
    //         return;
    //     }

    //     this._popupElement.style.minWidth = `${minWidth}px`;
    // }
}
