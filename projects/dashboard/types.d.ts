// Datastore
interface Datastore {
    get(key: string): Promise<any>;
    isUrlBeingTracked(url: URL): Promise<boolean>;
}

interface Domains {
    [key: string]: any;
}