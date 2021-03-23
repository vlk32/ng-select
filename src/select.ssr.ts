/**
 * Allows Server Side Rendering for @arborai/select to work, call it as soon as possible
 */
(function(global: any)
{
    if(!global.HTMLDocument)
    {
        global.HTMLDocument = function(){};
    }
})(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global);
