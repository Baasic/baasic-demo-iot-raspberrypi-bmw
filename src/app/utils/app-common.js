(function (_) {
    // copied from http://stackoverflow.com/questions/12356642/is-there-an-indexof-in-javascript-to-search-an-array-with-custom-compare-functio
    // save a reference to the core implementation
    var indexOfValue = _.indexOf;

    _.mixin({ deepExtend: underscoreDeepExtend(_) });

    // using .mixin allows both wrapped and unwrapped calls:
    // _(array).indexOf(...) and _.indexOf(array, ...)
    _.mixin({
        // return the index of the first array element passing a test
        indexOf: function (array, test) {
            // delegate to standard indexOf if the test isn't a function
            if (!_.isFunction(test)) return indexOfValue(array, test);
            // otherwise, look for the index
            for (var x = 0; x < array.length; x++) {
                if (test(array[x])) return x;
            }
            // not found, return fail value
            return -1;
        }
    });
})(_);