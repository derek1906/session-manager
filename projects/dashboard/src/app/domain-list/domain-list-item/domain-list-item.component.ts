import { BackgroundModulesService } from './../../background-modules.service';
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

export interface DetailsLoadDetail {
    domain: string;
    cookies: chrome.cookies.Cookie[];
}

@Component({
    selector: "domain-list-item",
    templateUrl: "./domain-list-item.component.html",
    styleUrls: ["./domain-list-item.component.css"]
})
export class DomainListItemComponent implements OnInit {
    cookiesModule: Promise<CookiesModule>;
    _domain: string;
    cookies: chrome.cookies.Cookie[];
    displayedColumns: string[] = ["domain", "name", "value"];

    get domain(): string {
        return this._domain;
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
        this.loadByDomain(domain);
    }

    @Output() detailsLoad: EventEmitter<DetailsLoadDetail> = new EventEmitter();

    constructor(backgroundModulesService: BackgroundModulesService) {
        this.cookiesModule = backgroundModulesService.getModule("cookies");
    }

    ngOnInit() {}

    async loadByDomain(domain: string) {
        const cookiesModule = await this.cookiesModule;
        const cookies = await cookiesModule.getCookiesByDomain(domain);

        const details: DetailsLoadDetail = { domain, cookies };

        this.cookies = cookies;
        this.detailsLoad.emit(details);
    }
}
