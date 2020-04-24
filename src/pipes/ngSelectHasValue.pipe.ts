import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {NgSelectOption} from '../components/option';

/**
 * Pipe that checks whether select has currently any option
 */
@Pipe({name: 'ngSelectHasValue'})
export class NgSelectHasValuePipe<TValue = any> implements PipeTransform
{
    //######################### public methods #########################
    
    /**
     * Transforms selected option into boolean indication if there is option selected
     * @param options - Selected options to be transformed into boolean
     */   
    public transform(options: NgSelectOption<TValue>|Array<NgSelectOption<TValue>>): boolean
    {
        return !(isBlank(options) || (Array.isArray(options) && !options.length));
    }
}

