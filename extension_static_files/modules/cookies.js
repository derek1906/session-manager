_export("cookies", async () => {
    function normalizeCookie(cookie, storeId = "0") {
        let newCookie = { ...cookie };

        newCookie.url = getUrl(cookie);

        if (cookie.hostOnly) {
            delete newCookie.domain;
        }

        if (cookie.session) {
            delete newCookie.expirationDate;
        }

        delete newCookie.hostOnly;
        delete newCookie.session;

        newCookie.storeId = storeId;

        return newCookie;
    }

    function getUrl(cookie) {
        var url = '';
        url += cookie.secure ? 'https://' : 'http://';
        url += cookie.domain.charAt(0) == '.' ? 'www' : '';

        url += cookie.domain;
        url += cookie.path;

        return url;
    }

    const datastore = await _require("datastore");

    return {
        getCookiesByOrigin(origin) {
            return new Promise(res => chrome.cookies.getAll({ url: origin }, res));
        },
        async getTrackedOrigins() {
            return Object.keys(await datastore.get("domains"));
        },
        getDerivedOrigins(url) {
            let hostname = url.hostname;
            let parts = hostname.split(".");

            let out = [];
            for (let i = 0; i < parts.length; i++) {
                let domain = parts
                    .slice(i, parts.length)
                    .join(".");
                out.push(`${url.protocol}//${domain}`);
            }

            return out;
        },
        setCookie(cookieSetDetails) {
            return new Promise((res, rej) => {
                chrome.cookies.set(cookieSetDetails, cookie => {
                    if (cookie) {
                        res();
                    } else {
                        rej(chrome.runtime.lastError);
                    }
                });
            })
        },
        async writeCookiesToStore(cookieStoreId, cookiesByOrigin) {
            const cookies = [];

            for (const cookiesPerOrigin of Object.values(cookiesByOrigin)) {
                for (const cookie of Object.values(cookiesPerOrigin)) {
                    cookies.push(normalizeCookie(cookie, cookieStoreId));
                }
            }

            await Promise.all(cookies.map(cookie => this.setCookie(cookie)));
        },
        async getCookiesFromTrackedOrigins() {
            const cookies = {};
            const trackedOrigins = await this.getTrackedOrigins();
            const cookiesByOrigin = await Promise.all(trackedOrigins.map(
                origin => this.getCookiesByOrigin(origin)
            ));

            cookiesByOrigin.forEach(cookiesForOrigin => {
                cookiesForOrigin.forEach(cookie => {
                    if (!(cookie.domain in cookies)) {
                        cookies[cookie.domain] = {};
                    }
                    cookies[cookie.domain][cookie.name] = cookie;
                });
            });

            return cookies;
        },

        getCookiesByUrl(url) {
            return new Promise(res => chrome.cookies.getAll({ url: url.origin }, res));
        },
        getCookiesByDomain(domain) {
            return new Promise(res => chrome.cookies.getAll({ domain }, res));
        },
        async getCookiesByDomains(domains) {
            let results = {};

            let cookiesLists = await Promise.all(domains.map(this.getCookiesByDomain));
            cookiesLists.forEach((cookies, i) => results[domains[i]] = cookies);

            return results;
        },
        async isDomainBeingTracked(...domainsToCheck) {
            const domains = await datastore.get("domains");
            return domainsToCheck.reduce((acc, cur) => {
                acc[cur] = domains.hasOwnProperty(cur);
                return acc;
            }, {});
        },
        async configureDomain(domain, isTracked) {
            const domains = await datastore.get("domains");

            if (isTracked) {
                domains[domain] = true;
            } else {
                delete domains[domain];
            }

            await datastore.set("domains", domains);
        }
    };
});
