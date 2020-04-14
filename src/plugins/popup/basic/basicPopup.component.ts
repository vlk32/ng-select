import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, Optional} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend} from '@jscrpt/common';

import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {NgSelectPlugin} from '../../../misc';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {POPUP_OPTIONS} from '../types';
import {BasicPopup, BasicPopupOptions, CssClassesBasicPopup} from './basicPopup.interface';
import {PopupAbstractComponent} from '../popupAbstract.component';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: BasicPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-popup",
    templateUrl: 'basicPopup.component.html',
    styleUrls: ['basicPopup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicPopupComponent extends PopupAbstractComponent<CssClassesBasicPopup, BasicPopupOptions> implements BasicPopup, NgSelectPlugin<BasicPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                @Optional() pluginBus: PluginBus,
                pluginElement: ElementRef,
                changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: BasicPopupOptions,
                @Inject(DOCUMENT) document?: HTMLDocument)
    {
        super(ngSelectPlugins, pluginBus, pluginElement, changeDetector, document);

        this._options = extend(true, {}, defaultOptions, options);
    }
}