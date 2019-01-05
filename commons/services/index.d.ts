// Datastore
interface DatastoreModule {
    get(key: string): Promise<any>;
    isUrlBeingTracked(url: URL): Promise<boolean>;
    configureDomain(domain: URL, isTracked: boolean): Promise<void>;
}

interface Domains {
    [key: string]: any;
}

interface CookiesModule {
    getCookiesByOrigin(origin: string): Promise<chrome.cookies.Cookie[]>;
    getTrackedOrigins(): Promise<string[]>;
    getDerivedOrigins(url: URL): string[];
    setCookie(cookieSetDetails: chrome.cookies.SetDetails): Promise<void>;
    writeCookiesToStore(cookieStoreId: string, cookies: CookiesByOrigins): Promise<void>;
    getCookiesFromTrackedOrigins(): Promise<CookiesByOrigins>;

    getCookiesByUrl(url: URL): Promise<chrome.cookies.Cookie[]>;
    getCookiesByDomain(domain: string): Promise<chrome.cookies.Cookie[]>;
    getCookiesByDomains(domains: string[]): Promise<chrome.cookies.Cookie[]>;
    isDomainBeingTracked(...domains: string[]): {[domain: string]: boolean};
    configureDomain(domain: string, isTracked: boolean): Promise<void>;
}

interface CookiesByOrigins {
    [domain: string]: {
        [name: string]: chrome.cookies.Cookie
    };
}
