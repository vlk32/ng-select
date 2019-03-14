import {Subscription} from "rxjs";

import {NgSelectFunction} from "../components/select";
import {NormalState} from "../plugins/normalState";
import {NORMAL_STATE} from "../plugins/normalState/types";

/**
 * Adds callback that is called each time when NgSelect gains focus
 */
export function onFocus<TValue>(callback: () => void): NgSelectFunction<Subscription, TValue>
{
    return ngSelect =>
    {
        let normalState = ngSelect.getPlugin(NORMAL_STATE) as NormalState;

        return normalState.focus.subscribe(() => callback());
    };
}