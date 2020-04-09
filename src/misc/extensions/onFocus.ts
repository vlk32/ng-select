import {Subscription} from "rxjs";

import {NgSelectFunction} from "../../components/select";

/**
 * Adds callback that is called each time when NgSelect gains focus
 */
export function ɵOnFocus<TValue>(callback: () => void): NgSelectFunction<Subscription, TValue>
{
    return ngSelect =>
    {
        return ngSelect.listenTo("focus", callback);
    };
}