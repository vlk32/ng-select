import {Directive, ValueProvider} from "@angular/core";

import {NORMAL_STATE_TYPE, LIVE_SEARCH_TYPE} from "../../misc/types";
import {EditNormalStateComponent} from "../../plugins/normalState/edit/editNormalState.component";
import {EditLiveSearchComponent} from "../../plugins/liveSearch/edit/editLiveSearch.component";

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
        }
    ]
})
export class NgSelectEditDirective
{
}