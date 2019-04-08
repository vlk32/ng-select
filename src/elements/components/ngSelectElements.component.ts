import {Component, ChangeDetectionStrategy} from "@angular/core";
import {NgSelectComponent} from "@anglr/select";

/**
 * Component that represents WebComponent implementation of NgSelect
 */
@Component(
{
    selector: 'ng-select-web-component',
    templateUrl: 'ngSelectElements.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgSelectElementsComponent<TValue> extends NgSelectComponent<TValue>
{
}