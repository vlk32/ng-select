import {NgSelectFunction} from "../components/select";
import {ValueHandler} from "../plugins/valueHandler";
import {VALUE_HANDLER} from "../plugins/valueHandler/types";

/**
 * Gets current value of NgSelect
 */
export function getValue<TValue>(): NgSelectFunction<TValue|TValue[], TValue>
{
    return ngSelect =>
    {
        let valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        return valueHandler.value;
    };
}