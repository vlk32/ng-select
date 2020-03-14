import {ChangeDetectionStrategy, OnDestroy, Component, EventEmitter, Inject, Optional, ElementRef, ChangeDetectorRef, Type, resolveForwardRef, forwardRef} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgSelectPluginGeneric, NormalState, KeyboardHandler, ValueHandler, OptionsGatherer, TemplateGatherer, ɵNgSelectOption, NgSelectOption, NgSelectPluginInstances, NG_SELECT_PLUGIN_INSTANCES, POPUP_OPTIONS, NORMAL_STATE, KEYBOARD_HANDLER, VALUE_HANDLER} from "@anglr/select";
import {extend} from "@jscrpt/common";
import {Subscription} from "rxjs";

import {DialogPopupOptions, DialogPopup, DialogPopupContentComponent, DialogPopupComponentData} from "./dialogPopup.interface";
import {BasicDialogPopupComponent} from "../../../components/basicDialogPopup/basicDialogPopup.component";

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: DialogPopupOptions<any> =
{
    dialogComponent: forwardRef(() => BasicDialogPopupComponent),
    dialogOptions: {},
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
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
export class DialogPopupComponent<TValue, TDialogOptions> implements DialogPopup, NgSelectPluginGeneric<DialogPopupOptions<TDialogOptions>>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: DialogPopupOptions<TDialogOptions>;

    /**
     * Subscription for click event on normal state
     */
    protected _clickSubscription: Subscription;

    /**
     * Subscription for popup visibility request from keyboard handler
     */
    protected _khPopupVisibilityRequestSubscription: Subscription;

    /**
     * Subscription for popup visibility request from value handler
     */
    protected _vhPopupVisibilityRequestSubscription: Subscription;

    /**
     * Normal state that is displayed
     */
    protected _normalState: NormalState;

    /**
     * Keyboard handler that is used
     */
    protected _keyboardHandler: KeyboardHandler;

    /**
     * Value handler that is used
     */
    protected _valueHandler: ValueHandler<TValue>;

    /**
     * Component that is used for handling metadata selection itself
     */
    protected _dialogComponent?: Type<DialogPopupContentComponent<TValue, TDialogOptions>>;

    /**
     * Popup dialog reference
     */
    protected _dialogRef?: MatDialogRef<any>;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): DialogPopupOptions<TDialogOptions>
    {
        return this._options;
    }
    public set options(options: DialogPopupOptions<TDialogOptions>)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    public optionClick: EventEmitter<NgSelectOption<TValue>> = new EventEmitter<NgSelectOption<TValue>>();

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
    public selectOptions: ɵNgSelectOption<any>[];

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _dialog: MatDialog,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: DialogPopupOptions<TDialogOptions>)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._clickSubscription?.unsubscribe();
        this._clickSubscription = null;

        this._khPopupVisibilityRequestSubscription?.unsubscribe();
        this._khPopupVisibilityRequestSubscription = null;

        this._vhPopupVisibilityRequestSubscription?.unsubscribe();
        this._vhPopupVisibilityRequestSubscription = null;
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._dialogComponent = resolveForwardRef(this.options.dialogComponent);

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(this._normalState && this._normalState != normalState)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;

            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;

            this._clickSubscription = this._normalState.click.subscribe(() => this.toggleDialog());
        }

        let keyboardHandler = this.ngSelectPlugins[KEYBOARD_HANDLER] as KeyboardHandler;

        if(this._keyboardHandler && this._keyboardHandler != keyboardHandler)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;

            this._keyboardHandler = null;
        }

        if(!this._keyboardHandler)
        {
            this._keyboardHandler = keyboardHandler;

            this._khPopupVisibilityRequestSubscription = this._keyboardHandler.popupVisibilityRequest.subscribe(this._handleDialog);
        }

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler<any>;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;

            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;

            this._vhPopupVisibilityRequestSubscription = this._valueHandler.popupVisibilityRequest.subscribe(this._handleDialog);
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
            this._dialogRef = this._dialog.open(this._dialogComponent,
                {
                    data: <DialogPopupComponentData<TValue, TDialogOptions>>
                    {
                        optionsGatherer: this.optionsGatherer,
                        templateGatherer: this.templateGatherer,
                        optionClick: this.optionClick,
                        options: this.options
                    },
                    panelClass: this.options?.cssClasses?.dialogDiv
                });
        }
        else
        {
            this._dialogRef?.close();
            this._dialogRef = null;
        }
    };
}