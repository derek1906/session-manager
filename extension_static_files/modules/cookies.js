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

    return {
        getCookiesByDomain(domain) {
            return new Promise(res => chrome.cookies.getAll({ domain }, res));
        },
        async getCookiesByDomains(domains) {
            let results = {};

            let cookiesLists = await Promise.all(domains.map(this.getCookiesByDomain));
            cookiesLists.forEach((cookies, i) => results[domains[i]] = cookies);

            return results;
        }
    };
});
