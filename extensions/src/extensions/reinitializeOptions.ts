import {NgSelectAction, NgSelectOptions} from "@anglr/select";

/**
 * Method reinitialize options for NgSelect
 * @param options - Options to be used for reinitialization
 */
export function reinitializeOptions<TValue = any>(options?: NgSelectOptions<TValue>): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        if(options)
        {
            ngSelect.selectOptions = options;
        }

        ngSelect.initOptions();
        ngSelect.invalidateVisuals();
        ngSelect.initialize();
    };
}