import {EventEmitter} from "@angular/core";
import {Popup, PopupOptions, OptionsGatherer, TemplateGatherer, NgSelectOption, NgSelectPluginInstances} from "@anglr/select";

/**
 * Css classes for dialog popup
 */
export interface CssClassesDialogPopup
{
    /**
     * Css class applied to each option div
     */
    optionItemDiv?: string;

    /**
     * Css class applied to each option text div
     */
    optionItemTextDiv?: string;

    /**
     * Css class used as icons indicating that option is selected (only when multiple)
     */
    optionChecked?: string;

    /**
     * Css class applied directly to dialog
     */
    dialogDiv?: string;
}

/**
 * Dialog popup options
 */
export interface DialogPopupOptions<T = any> extends PopupOptions<CssClassesDialogPopup>
{
    /**
     * Component that is used to show in dialog
     */
    dialogComponent: any;

    /**
     * Dialog options
     */
    dialogOptions?: T;
}

/**
 * Public API for 'DialogPopupComponent'
 */
export interface DialogPopup extends Popup
{
}

/**
 * Data that are passed to component that handles metadata
 */
export interface DialogPopupComponentData<TValue = any, TOptions = any>
{
    /**
     * NgSelect plugins instances
     */
    ngSelectPlugins: NgSelectPluginInstances,

    /**
     * Gatherer used for obtaining custom templates
     */
    templateGatherer: TemplateGatherer;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    optionClick: EventEmitter<NgSelectOption<TValue>>;

    /**
     * Dialogs popup options
     */
    options: DialogPopupOptions<TOptions>;
}

/**
 * Component that is rendered within dialog
 */
export interface DialogPopupContentComponent<TValue = any, TOptions = any>
{
    /**
     * Data that are used for communication with Popup
     */
    data: DialogPopupComponentData<TValue, TOptions>;
}