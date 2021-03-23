import {VisualPluginOptions} from '@arborai/select';

/**
 * Css classes for basic dialog popup
 */
export interface CssClassesBasicDialogPopup
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
}

/**
 * Basic dialog popup options
 */
export interface BasicDialogPopupOptions extends VisualPluginOptions<CssClassesBasicDialogPopup>
{
}
