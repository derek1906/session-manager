/* Nice and quick Promise-based dependency loader */

(function() {
    const LOADED = "loaded", PENDING = "pending";
    let modules = {};

    window._export = async function _export(moduleName, moduleLoader) {
        if (moduleName in modules && modules[moduleName].status === LOADED) {
            throw `Module name "${moduleName}" already exists.`;
        }

        let exports = await moduleLoader() || {};
        if (moduleName in modules) {
            // clear timeout timers
            modules[moduleName].pendingTimeoutTimers.forEach(clearTimeout);
            // resolve promises
            modules[moduleName].resolvers.forEach(res => res(exports));
        }
        modules[moduleName] = {
            status: LOADED,
            exports
        };
    };

    window._require = function _require(moduleName, timeout=1000) {
        if (Array.isArray(moduleName)) {
            return Promise.all(moduleName.map(name => _require(name, timeout)));
        }

        return new Promise((res, rej) => {
            let module = modules[moduleName] || {
                status: PENDING,
                resolvers: [res],
                pendingTimeoutTimers: []
            };

            if (module.status === LOADED) {
                res(module.exports);
            } else {
                module.pendingTimeoutTimers.push(setTimeout(() => {
                    rej(`Timeout waiting for module "${moduleName}"`);
                }, timeout));
            }

            modules[moduleName] = module;
        });
    };
})();