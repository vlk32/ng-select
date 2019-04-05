import {Component, ChangeDetectionStrategy} from "@angular/core";

import {NgSelectComponent} from "../components/select/select.component";

@Component(
{
    selector: 'ng-select-elements',
    templateUrl: 'ngSelect.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgSelectElementsComponent<TValue> extends NgSelectComponent<TValue>
{
}