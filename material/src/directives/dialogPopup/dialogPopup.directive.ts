import {Directive, ValueProvider, Input, SimpleChanges, OnChanges} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';
import {POPUP_TYPE, NgSelectComponent, VisualPluginOptions} from '@arborai/select';
import {patchOptions} from '@arborai/select/extensions';
import {nameof} from '@jscrpt/common';

import {DialogPopupComponent} from '../../plugins/popup/components';
import {DialogPopupContentComponent, DialogPopupOptions} from '../../plugins/popup';

/**
 * Directive that changes ng select popup to DialogPopup
 */
@Directive(
{
    selector: 'ng-select[dialogPopup]',
    providers:
    [
        <ValueProvider>
        {
            provide: POPUP_TYPE,
            useValue: DialogPopupComponent
        }
    ]
})
export class DialogPopupDirective implements OnChanges
{
    //######################### public properties - inputs #########################

    /**
     * Popup type that will be used
     */
    @Input('dialogPopup')
    public popupType: ComponentType<DialogPopupContentComponent> = null;

    /**
     * Dialog popup options
     */
    @Input()
    public dialogPopupOptions: VisualPluginOptions = null;

    //######################### constructor #########################
    constructor(protected _select: NgSelectComponent)
    {
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        let options: DialogPopupOptions = {};
        let changed = false;

        if(nameof<DialogPopupDirective>('popupType') in changes && this.popupType)
        {
            changed = true;

            options.dialogComponent = this.popupType;
        }

        if(nameof<DialogPopupDirective>('dialogPopupOptions') in changes)
        {
            changed = true;

            options.dialogOptions = this.dialogPopupOptions;
        }

        if(changed)
        {
            this._select.execute(patchOptions(
            {
                plugins:
                {
                    popup:
                    {
                        options: options
                    }
                }
            }))
        }
    }
}
