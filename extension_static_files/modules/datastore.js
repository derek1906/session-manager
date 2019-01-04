_export("datastore", async () => {
    function initializeStorage() {
        // chrome.cookies.getAll({}, cookies => {
        //     let domains = {};
        //     new Set(cookies.map(c => c.domain)).forEach(domain => {
        //         domains[domain] = null;
        //     });

        //     chrome.storage.local.set({domains});
        // })
        // chrome.storage.local.set({
        //     "domains": {
        //         ".google.com": null,
        //         ".bestbuy.com": null,
        //         ".com": null
        //     }
        // });
        chrome.storage.local.set({
            "domains": {}
        });
    }

    chrome.runtime.onInstalled.addListener(initializeStorage);

    return {
        get(key) {
            return new Promise((res, rej) => {
                chrome.storage.local.get(key, items => {
                    if (chrome.runtime.lastError) {
                        rej(chrome.runtime.lastError);
                    } else {
                        res(items[key]);
                    }
                });
            });
        },
        set(key, value) {
            return new Promise((res, rej) => {
                chrome.storage.local.set({
                    [key]: value
                }, res);
            });
        },
        async isUrlBeingTracked(url) {
            let domains = await this.get("domains");

            return domains.hasOwnProperty(url.hostname);
        },
        async configureDomain(url, isTracked) {
            let domains = await this.get("domains");

            if (isTracked) {
                domains[url.hostname] = true;
            } else {
                delete domains[url.hostname];
            }

            await this.set("domains", domains);
        }
    };
});
