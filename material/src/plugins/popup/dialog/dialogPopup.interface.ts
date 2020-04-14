import {Popup, PopupOptions, NgSelectPluginInstances, PluginBus, VisualPluginOptions} from "@anglr/select";
import {ComponentType} from '@angular/cdk/portal';

/**
 * Css classes for dialog popup
 */
export interface CssClassesDialogPopup
{
    /**
     * Css class applied directly to dialog
     */
    dialogDiv?: string;
}

/**
 * Dialog popup options
 */
export interface DialogPopupOptions<TComponent extends DialogPopupContentComponent<TOptions, TValue, TCssClasses> = any, TOptions = any, TValue = any, TCssClasses = any> extends PopupOptions<CssClassesDialogPopup>
{
    /**
     * Component that is used to show popup content in dialog
     */
    dialogComponent?: ComponentType<TComponent>;

    /**
     * Options passed to dialog component
     */
    dialogOptions?: TOptions;
}

/**
 * Public API for 'DialogPopupComponent'
 */
export interface DialogPopup extends Popup
{
}

/**
 * Data that are passed to component that displays popup
 */
export interface DialogPopupComponentData<TOptions extends VisualPluginOptions<TCssClasses> = any, TValue = any, TCssClasses = any>
{
    /**
     * NgSelect plugin instances available for this plugin
     */
    ngSelectPlugins: NgSelectPluginInstances;

    /**
     * Plugin bus used in select
     */
    pluginBus: PluginBus<TValue>;

    /**
     * Dialogs popup options
     */
    options: TOptions;
}

/**
 * Component that is rendered within dialog and represents popup
 */
export interface DialogPopupContentComponent<TOptions = any, TValue = any, TCssClasses = any>
{
    /**
     * Data that are used for communication with Popup
     */
    data: DialogPopupComponentData<TOptions, TValue, TCssClasses>;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}