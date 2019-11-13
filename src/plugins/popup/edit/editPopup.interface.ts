import {Popup, PopupOptions} from "../popup.interface";

/**
 * Css classes for edit popup
 */
export interface CssClassesEditPopup
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
     * Css class applied directly to css popup
     */
    popupDiv?: string;
}

/**
 * Edit popup options
 */
export interface EditPopupOptions extends PopupOptions<CssClassesEditPopup>
{
}

/**
 * Public API for 'EditPopupComponent'
 */
export interface EditPopup extends Popup
{
}