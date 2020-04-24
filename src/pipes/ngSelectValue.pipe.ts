import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {NgSelectOption} from '../components/option';
import {DisplayTextFunc} from '../plugins/normalState';

/**
 * Pipe to transform ng select selected option into
 */
@Pipe({name: 'ngSelectValue'})
export class NgSelectValuePipe<TValue = any> implements PipeTransform
{
    //######################### public methods #########################
    
    /**
     * Transforms selected option into string
     * @param options - Selected options to be transformed into text
     * @param nothingSelectedText - Text displayed if nothing is selected
     * @param optionDisplayText - Function used for transformation of option into display text, defaults to text property of option
     */   
    public transform(options: NgSelectOption<TValue>|Array<NgSelectOption<TValue>>, nothingSelectedText: string, optionDisplayText: DisplayTextFunc<TValue> = option => option.text): string
    {
        if(isBlank(options) || (Array.isArray(options) && !options.length))
        {
            return nothingSelectedText;
        }

        if(Array.isArray(options))
        {
            return options.map(optionDisplayText).join(', ');
        }

        return optionDisplayText(options);
    }
}

