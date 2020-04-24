import {Directive} from '@angular/core';

import {NgSelectComponent} from '../../components/select/select.component';

/**
 * Directive used for setting absolute option for ng-select
 */
@Directive(
{
    selector: 'ng-select[absolute]'
})
export class NgSelectAbsoluteDirective
{
    //######################### constructor #########################
    constructor(select: NgSelectComponent)
    {
        select.selectOptions =
        {
            absolute: true
        };
    }
}