import {NgSelectAction} from "../../components/select";
import {ValueHandler} from "../../plugins/valueHandler";
import {VALUE_HANDLER} from "../../plugins/valueHandler/types";

/**
 * Sets value of NgSelect
 * @param value Value to be set into select
 */
export function ɵSetValue<TValue>(value: TValue|TValue[]): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        let valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        valueHandler.setValue(value);
    };
}