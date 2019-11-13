import {Directive, ValueProvider} from "@angular/core";

import {NORMAL_STATE_TYPE, LIVE_SEARCH_TYPE, POPUP_TYPE} from "../../misc/types";
import {EditNormalStateComponent} from "../../plugins/normalState/edit/editNormalState.component";
import {EditLiveSearchComponent} from "../../plugins/liveSearch/edit/editLiveSearch.component";
import {EditPopupComponent} from "../../plugins/popup/edit/editPopup.component";

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
    ]
})
export class NgSelectEditDirective
{
}