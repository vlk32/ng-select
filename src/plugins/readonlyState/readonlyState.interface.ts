
import {NormalStateOptions, NormalState} from "../normalState";

/**
 * Options for readonly state plugin
 */
export interface ReadonlyStateOptions<TCssClasses> extends NormalStateOptions<TCssClasses>
{
}

/**
 * Readonly state plugin interface
 */
export interface ReadonlyState extends NormalState
{
}