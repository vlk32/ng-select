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

    /**
     * Indication whether positioner should be sensitive/activated also to scroll of scrollTarget
     */
    activateOnScroll?: boolean;

    /**
     * Indication whether positioner should be sensitive/activated also on resize of window
     */
    activateOnResize?: boolean;
}

/**
 * Public API for 'BasicPositionerComponent'
 */
export interface BasicPositioner extends Positioner
{
}