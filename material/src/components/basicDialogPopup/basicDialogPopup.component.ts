import {Component, ChangeDetectionStrategy, Inject, OnDestroy, OnInit, ChangeDetectorRef, EventEmitter} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {OptionsGatherer, TemplateGatherer, NgSelectOption} from "@anglr/select";
import {Subscription} from "rxjs";

import {DialogPopupComponentData, DialogPopupContentComponent, DialogPopupOptions} from "../../plugins/popup/dialog/dialogPopup.interface";

@Component(
{
    selector: 'ng-select-basic-dialog-popup',
    templateUrl: 'basicDialogPopup.component.html',
    styleUrls: ['basicDialogPopup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogPopupComponent<TValue, TDialogOptions> implements DialogPopupContentComponent<TValue, TDialogOptions>, OnInit, OnDestroy
{
    //######################### private properties #########################

    /**
     * Subscription for available options change
     */
    private _availableOptionsSubscription: Subscription;

    //######################### public properties - template bindings #########################

    /**
     * Array of provided options for select
     */
    public selectOptions: NgSelectOption<TValue>[];

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    /**
     * Dialogs popup options
     */
    options: DialogPopupOptions<TDialogOptions>;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    optionClick: EventEmitter<NgSelectOption<TValue>>;

    //######################### constructor #########################
    constructor(public dialog: MatDialogRef<BasicDialogPopupComponent<TValue, TDialogOptions>, DialogPopupComponentData<TValue, TDialogOptions>>,
                private _changeDetector: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA) public data: DialogPopupComponentData<TValue, TDialogOptions>)
    {
        if (data)
        {
            this.templateGatherer = data.templateGatherer;
            this.optionsGatherer = data.optionsGatherer;
            this.optionClick = data.optionClick;
            this.options = data.options;
        }
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if (this.optionsGatherer)
        {
            this.selectOptions = this.optionsGatherer.availableOptions;
            this._availableOptionsSubscription = this.optionsGatherer.availableOptionsChange.subscribe(() => 
            {
                this.selectOptions = this.optionsGatherer.availableOptions;
                this._changeDetector.detectChanges();
            });
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._availableOptionsSubscription?.unsubscribe();
        this._availableOptionsSubscription = null;
    }
}