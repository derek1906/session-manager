_export("utils", async () => {
    return {
        debounceFunction(minTime, fn) {
            let timer = null;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(null, args);
                    timer = null;
                }, fn);
            };
        },
        parseUrl(url) {
            return new URL(url);
        }
    };
});