declare var global: any

/**
 * Allows Server Side Rendering for @anglr/select to work, call it as soon as possible
 */
export function allowNgSelectSsr()
{
    (function(global: any) 
    {
        if(!global.HTMLDocument)
        {
            global.HTMLDocument = function(){};
        }
    })(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global);
}