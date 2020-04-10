import {NgSelectPlugin, NgSelectPluginInstances, NG_SELECT_PLUGIN_INSTANCES, PluginBus, POPUP_OPTIONS, ɵNgSelectOption} from "@anglr/select";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, OnDestroy, Optional, resolveForwardRef} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {extend} from "@jscrpt/common";
import {Subscription} from "rxjs";

import {BasicDialogPopupComponent} from "../../../components/basicDialogPopup/basicDialogPopup.component";
import {DialogPopup, DialogPopupContentComponent, DialogPopupOptions, DialogPopupComponentData} from "./dialogPopup.interface";

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: DialogPopupOptions =
{
    dialogComponent: forwardRef(() => BasicDialogPopupComponent),
    dialogOptions: {},
    cssClasses:
    {
        dialogDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-dialog-popup",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogPopupComponent<TComponent extends DialogPopupContentComponent<TDialogOptions, TValue, TCssClasses> = any, TValue = any, TDialogOptions = any, TCssClasses = any> implements DialogPopup, NgSelectPlugin<DialogPopupOptions<TComponent, TDialogOptions, TValue, TCssClasses>, TValue>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: DialogPopupOptions<TComponent, TDialogOptions, TValue, TCssClasses>;

    /**
     * Subscription for toggle popup event
     */
    protected _popupToggleSubscription: Subscription;

    /**
     * Subscription for popup visibility change request
     */
    protected _visibilityRequestSubscription: Subscription;

    /**
     * Component that is used for handling metadata selection itself
     */
    protected _dialogComponent?: TComponent;

    /**
     * Popup dialog reference
     */
    protected _dialogRef?: MatDialogRef<TComponent>;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): DialogPopupOptions<TComponent, TDialogOptions, TValue, TCssClasses>
    {
        return this._options;
    }
    public set options(options: DialogPopupOptions<TComponent, TDialogOptions, TValue, TCssClasses>)
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
        return null;
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption[];

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus<TValue>,
                public pluginElement: ElementRef,
                protected _dialog: MatDialog,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: DialogPopupOptions<TComponent, TDialogOptions, TValue, TCssClasses>)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._popupToggleSubscription?.unsubscribe();
        this._popupToggleSubscription = null;

        this._visibilityRequestSubscription?.unsubscribe();
        this._visibilityRequestSubscription = null;
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._dialogComponent = resolveForwardRef(this.options.dialogComponent);

        if(!this._popupToggleSubscription)
        {
            this._popupToggleSubscription = this.pluginBus.togglePopup.subscribe(() => this.toggleDialog());
        }

        if(!this._visibilityRequestSubscription)
        {
            this._visibilityRequestSubscription = this.pluginBus.showHidePopup.subscribe(this._handleDialog);
        }

        if (this.options.visible)
        {
            this._handleDialog(true);
        }
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
        this._dialogRef?.componentInstance?.invalidateVisuals();
    }

    /**
     * Toggles dialog visibility
     */
    protected toggleDialog()
    {
        this._handleDialog(true);
    }

    /**
     * Handles dialog visibility change
     */
    protected _handleDialog = (visible: boolean) =>
    {
        if (visible)
        {
            this._dialogRef = this._dialog.open<TComponent, DialogPopupComponentData<TDialogOptions, TValue, TCssClasses>>(this._dialogComponent as any,
            {
                panelClass: this.options?.cssClasses?.dialogDiv,
                data:
                {
                    ngSelectPlugins: this.ngSelectPlugins,
                    options: this.options.dialogOptions,
                    pluginBus: this.pluginBus
                }
            });
        }
        else
        {
            this._dialogRef?.close();
            this._dialogRef = null;
        }
    };
}