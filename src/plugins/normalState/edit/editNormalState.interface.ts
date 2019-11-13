import {NormalState, NormalStateOptions} from "../normalState.interface";

/**
 * Css classes for edit normal state
 */
export interface CssClassesEditNormalState
{
    /**
     * Applied to currently selected value, which is visible to user (default template)
     */
    selectedValue?: string;

    /**
     * Applied to "carret", indicating that it is select and there is more options available
     */
    selectedCarret?: string;

    /**
     * Applied to "carret" wrapper element
     */
    selectedCarretWrapper?: string;

    /**
     * Applied to HTML element that represents normal default state visible to user
     */
    normalStateElement?: string;
}

/**
 * Edit normal state options
 */
export interface EditNormalStateOptions extends NormalStateOptions<CssClassesEditNormalState>
{
}

/**
 * Public API for 'EditNormalStateComponent'
 */
export interface EditNormalState extends NormalState
{
}