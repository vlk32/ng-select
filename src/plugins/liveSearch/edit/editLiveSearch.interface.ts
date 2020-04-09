import {LiveSearch, LiveSearchOptions, LiveSearchTexts} from "../liveSearch.interface";

/**
 * Css classes for edit live search
 */
export interface CssClassesEditLiveSearch
{
    /**
     * Applied to wrapper div around input
     */
    wrapperDiv?: string;

    /**
     * Applied to input that represents live search
     */
    input?: string;
}

/**
 * Texts that are used within EditLiveSearch
 */
export interface EditLiveSearchTexts extends LiveSearchTexts
{
    /**
     * Displayed as placeholder when nothing was selected
     */
    placeholderNothingSelected?: string;
}

/**
 * Edit live search options
 */
export interface EditLiveSearchOptions extends LiveSearchOptions<CssClassesEditLiveSearch>
{
    /**
     * Texts that are used within any EditLiveSearch
     */
    texts?: EditLiveSearchTexts;

    /**
     * Indication whether keep search value after popup close
     */
    keepSearchValue?: boolean;
}

/**
 * Public API for 'EditLiveSearchComponent'
 */
export interface EditLiveSearch extends LiveSearch
{
}