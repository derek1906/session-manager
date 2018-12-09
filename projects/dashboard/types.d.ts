// Datastore
interface DatastoreModule {
    get(key: string): Promise<any>;
    isUrlBeingTracked(url: URL): Promise<boolean>;
}

interface Domains {
    [key: string]: any;
}

interface CookiesModule {
    getCookiesByDomain(domains: string): Promise<chrome.cookies.Cookie[]>;
    getCookiesByDomains(domains: string[]): Promise<chrome.cookies.Cookie[]>;
}
