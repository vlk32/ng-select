import {Component, ChangeDetectionStrategy, Inject, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {OptionsGatherer, ɵNgSelectOption} from "@anglr/select";
import {extend} from '@jscrpt/common';
import {Subscription} from "rxjs";

import {DialogPopupComponentData, DialogPopupContentComponent} from "../../plugins/popup/dialog/dialogPopup.interface";
import {BasicDialogPopupOptions, CssClassesBasicDialogPopup} from './basicDialogPopup.interface';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: BasicDialogPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text'
    }
};

/**
 * Basic dialog popup
 */
@Component(
{
    selector: 'ng-select-basic-dialog-popup',
    templateUrl: 'basicDialogPopup.component.html',
    styleUrls: ['basicDialogPopup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogPopupComponent<TValue = any> implements DialogPopupContentComponent<BasicDialogPopupOptions, TValue, CssClassesBasicDialogPopup>, OnInit, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Subscription for available options change
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<TValue>;

    //######################### public properties - template bindings #########################

    /**
     * Options for NgSelect plugin
     */
    public options: BasicDialogPopupOptions;

    /**
     * Array of provided options for select
     */
    public selectOptions: ɵNgSelectOption<TValue>[];

    //######################### constructor #########################
    constructor(public dialog: MatDialogRef<BasicDialogPopupComponent<TValue>>,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA) public data: DialogPopupComponentData<BasicDialogPopupOptions, TValue, CssClassesBasicDialogPopup>)
    {
        this.options = extend(true, {}, defaultOptions, data.options);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.data.pluginBus.selectOptions.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.data.pluginBus.selectOptions.optionsGatherer;
            this.selectOptions = this._optionsGatherer.availableOptions;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() =>
            {
                this.selectOptions = this._optionsGatherer.availableOptions;
                this._changeDetector.detectChanges()
            });
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._optionsChangeSubscription?.unsubscribe();
        this._optionsChangeSubscription = null;
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }
}