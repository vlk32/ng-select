import {Directive, ValueProvider} from "@angular/core";

import {NORMAL_STATE_TYPE, LIVE_SEARCH_TYPE, POPUP_TYPE, KEYBOARD_HANDLER_TYPE} from "../../misc/types";
import {EditNormalStateComponent} from "../../plugins/normalState/edit/editNormalState.component";
import {EditLiveSearchComponent} from "../../plugins/liveSearch/edit/editLiveSearch.component";
import {EditPopupComponent} from "../../plugins/popup/edit/editPopup.component";
import {EditKeyboardHandlerComponent} from '../../plugins/keyboardHandler/components';

/**
 * Directive that applies options for NgSelect which enable usage of NgSelect edit (jira like) style
 */
@Directive(
{
    selector: 'ng-select[editStyle]',
    providers:
    [
        <ValueProvider>
        {
            provide: NORMAL_STATE_TYPE,
            useValue: EditNormalStateComponent
        },
        <ValueProvider>
        {
            provide: LIVE_SEARCH_TYPE,
            useValue: EditLiveSearchComponent
        },
        <ValueProvider>
        {
            provide: POPUP_TYPE,
            useValue: EditPopupComponent
        },
        <ValueProvider>
        {
            provide: KEYBOARD_HANDLER_TYPE,
            useValue: EditKeyboardHandlerComponent
        }
    ]
})
export class NgSelectEditDirective
{
}