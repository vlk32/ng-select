import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, Optional} from '@angular/core';
import {StringLocalization, STRING_LOCALIZATION} from '@anglr/common';
import {extend} from '@jscrpt/common';

import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {NgSelectPlugin} from '../../../misc';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {NormalStateAbstractComponent} from '../normalStateAbstract.component';
import {NORMAL_STATE_OPTIONS} from '../types';
import {CssClassesEditNormalState, EditNormalState, EditNormalStateOptions} from './editNormalState.interface';
import {NgSelectOption} from '../../../components/option';

//TODO - think of templating how to do it for edit select

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: EditNormalStateOptions =
{
    cssClasses:
    {
        normalStateElement: 'btn btn-select',
        selectedCarretWrapper: 'selected-caret',
        selectedCarret: 'fa fa-caret-down',
        selectedValue: 'selected-value',
        selectedMultiValueContainer: 'selected-multi-value',
        selectedMultiValueCancel: 'selected-multi-value-cancel',
        cancelSelectedElement: 'fa cancel-selected'
    },
    texts:
    {
        nothingSelected: 'Nothing selected'
    },
    cancelButton: false
};

/**
 * Component used for rendering edit normal state of select
 */
@Component(
{
    selector: "div.edit-normal-state",
    templateUrl: 'editNormalState.component.html',
    styleUrls: ['editNormalState.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNormalStateComponent extends NormalStateAbstractComponent<CssClassesEditNormalState, EditNormalStateOptions> implements EditNormalState, NgSelectPlugin<EditNormalStateOptions>, OnDestroy
{
    //######################### public properties - template bindings #########################

    /**
     * Gets currently selected options
     */
    public get selectedOptions(): NgSelectOption[]
    {
        return this.valueHandler?.selectedOptions as NgSelectOption[];
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                @Optional() pluginBus: PluginBus,
                pluginElement: ElementRef,
                changeDetector: ChangeDetectorRef,
                @Inject(STRING_LOCALIZATION) stringLocalization: StringLocalization,
                @Inject(NORMAL_STATE_OPTIONS) @Optional() options?: EditNormalStateOptions)
    {
        super(ngSelectPlugins, pluginBus, pluginElement, changeDetector, stringLocalization);

        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - template bindings #########################

    /**
     * Cancel selected options
     */
    public cancelSelected(): void
    {
        if(Array.isArray(this.selectedOptions))
        {
            let options = [...this.selectedOptions];

            options.forEach(opt => this.pluginBus.optionCancel.emit(opt));
        }
        else
        {
            this.pluginBus.optionCancel.emit(this.selectedOptions);
        }
    }
}