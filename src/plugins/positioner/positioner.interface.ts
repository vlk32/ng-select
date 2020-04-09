import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
    /**
     * Coordinates of options popup relative to select
     */
    optionsCoordinates?: Positions.PositionsCoordinates;

    /**
     * Coordinates of select relative to options
     */
    selectCoordinates?: Positions.PositionsCoordinates;
}

/**
 * Positioner plugin interface
 */
export interface Positioner extends NgSelectPlugin
{
}