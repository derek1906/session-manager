import { Component, OnInit, NgZone } from '@angular/core';
import { BackgroundModulesService } from 'commons/services/background-modules.service';
import { KeyValue } from '@angular/common';

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styles: []
})
export class AppComponent implements OnInit {
    datastoreModulePromise: Promise<DatastoreModule>;
    cookiesModulePromise: Promise<CookiesModule>;
    tabDetails: chrome.tabs.Tab;
    cookiesDetails: chrome.cookies.Cookie[];

    url: URL;
    derivedDomainsInfo: { [domain: string]: boolean };
    isDomainBeingTracked: boolean;

    constructor(
        backgroundModulesService: BackgroundModulesService,
        private ngZone: NgZone
    ) {
        this.datastoreModulePromise = backgroundModulesService.getModule(
            "datastore"
        );
        this.cookiesModulePromise = backgroundModulesService.getModule(
            "cookies"
        );
    }

    ngOnInit(): void {
        chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
            this.ngZone.run(async () => {
                if (tabs.length !== 1) {
                    return;
                }

                const tab = tabs[0];
                this.tabDetails = tab;
                const url = new URL(tab.url);

                const datastoreModule = await this.datastoreModulePromise;
                const cookiesModule = await this.cookiesModulePromise;
                const isDomainBeingTracked = await datastoreModule.isUrlBeingTracked(
                    url
                );

                console.log(url);
                console.log(isDomainBeingTracked);

                this.url = url;
                this.isDomainBeingTracked = isDomainBeingTracked;

                const derivedDomains = await cookiesModule.getDerivedOrigins(
                    url
                );
                this.derivedDomainsInfo = await cookiesModule.isDomainBeingTracked(
                    ...derivedDomains
                );

                const cookies = await cookiesModule.getCookiesByUrl(url);
                this.cookiesDetails = cookies;

                console.log(cookies);
            });
        });
    }

    async onIsDomainBeingTrackedChanged(domain: string, isTracked: boolean) {
        this.derivedDomainsInfo[domain] = null;

        const cookiesModule = await this.cookiesModulePromise;

        await cookiesModule.configureDomain(domain, isTracked);
        this.derivedDomainsInfo[domain] = isTracked;
    }

    orderByDomainLengthDesc(
        a: KeyValue<string, boolean>,
        b: KeyValue<string, boolean>
    ) {
        return b.key.length - a.key.length;
    }
}
