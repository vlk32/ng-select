import {Injectable} from '@angular/core';

/**
 * Scroll target selector that is used for obtaining scroll target
 */
@Injectable({providedIn: 'root'})
export class ScrollTargetSelector
{
    //######################### private fields #########################

    /**
     * Callback used for getting scroll target for scrolling
     */
    private _scrollTargetCallback: () => EventTarget = () => window;

    //######################### public properties #########################

    /**
     * Gets scroll target that is used for scrolling
     */
    public get scrollTarget(): EventTarget
    {
        return this._scrollTargetCallback();
    }

    //######################### public methods #########################

    /**
     * Sets callback used for obtaining scroll target
     * @param callback - Callback that is used for obtaining scroll target element
     */
    public setScrollTarget(callback: () => EventTarget)
    {
        this._scrollTargetCallback = callback;
    }
}