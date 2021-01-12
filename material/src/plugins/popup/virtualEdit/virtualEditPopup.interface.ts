import {Popup, PopupOptions} from "@anglr/select";

/**
 * Css classes for virtual edit popup
 */
export interface CssClassesVirtualEditPopup
{
}

/**
 * Virtual edit popup options
 */
export interface VirtualEditPopupOptions extends PopupOptions<CssClassesVirtualEditPopup>
{
}

/**
 * Public API for 'VirtualEditPopupComponent'
 */
export interface VirtualEditPopup extends Popup
{
}