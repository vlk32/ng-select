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

    /**
     * Applied to container displaying single multi value
     */
    selectedMultiValueContainer?: string;

    /**
     * Applied to element used for canceling selected value
     */
    selectedMultiValueCancel?: string;

    /**
     * Applied to element that is used as cancel selected button
     */
    cancelSelectedElement?: string;
}

/**
 * Edit normal state options
 */
export interface EditNormalStateOptions<TValue = any> extends NormalStateOptions<CssClassesEditNormalState, TValue>
{
    /**
     * Indication whether display cancel button
     */
    cancelButton?: boolean;

    /**
     * Indication whether display button for displaying options
     */
    showOptionsButton?: boolean;
}

/**
 * Public API for 'EditNormalStateComponent'
 */
export interface EditNormalState extends NormalState
{
}