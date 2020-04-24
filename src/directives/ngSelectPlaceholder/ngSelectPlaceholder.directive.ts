import {Directive, OnInit, Input} from '@angular/core';

import {NgSelectComponent} from '../../components/select/select.component';
import {LiveSearchOptions} from '../../plugins/liveSearch';

/**
 * Directive used for setting live search placeholder text
 */
@Directive(
{
    selector: 'ng-select[placeholder]'
})
export class NgSelectPlaceholderDirective implements OnInit
{
    //######################### public properties - inputs #########################

    /**
     * Placeholder text used for live search plugin
     */
    @Input()
    public placeholder: string;

    //######################### constructor #########################
    constructor(private _select: NgSelectComponent)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._select.selectOptions = 
        {
            plugins:
            {
                liveSearch:
                {
                    options: <LiveSearchOptions>
                    {
                        texts:
                        {
                            inputPlaceholder: this.placeholder
                        }
                    }
                }
            }
        };
    }
}