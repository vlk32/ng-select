import {FlipCallback} from '@anglr/common/positions';

import {Positioner, PositionerOptions} from "../positioner.interface";

/**
 * Basic positioner options
 */
export interface BasicPositionerOptions extends PositionerOptions
{
    /**
     * Callback that is called when flip occurs during positioning
     */
    flipCallback?: FlipCallback;

    /**
     * Target element that is used for handling scroll event
     */
    scrollTarget?: EventTarget;
}

/**
 * Public API for 'BasicPositionerComponent'
 */
export interface BasicPositioner extends Positioner
{
}