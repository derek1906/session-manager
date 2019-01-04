import { BackgroundModulesService } from 'commons/services/background-modules.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

export interface DetailsLoadDetail {
    origin: string;
    cookies?: chrome.cookies.Cookie[];
    status: "LOADING" | "LOADED";
}

@Component({
    selector: "domain-list-item",
    templateUrl: "./domain-list-item.component.html",
    styleUrls: ["./domain-list-item.component.css"]
})
export class DomainListItemComponent implements OnInit {
    cookiesModule: Promise<CookiesModule>;
    _origin: string;
    _domain: string;
    cookies: chrome.cookies.Cookie[];
    displayedColumns: string[] = ["domain", "name", "value"];

    get domain(): string {
        return this._domain;
    }

    @Input()
    set domain(origin: string) {
        this._domain = new URL(origin).hostname;
        this._origin = origin;
        this.loadByOrigin(origin);
    }

    @Output() detailsLoad: EventEmitter<DetailsLoadDetail> = new EventEmitter();
    @Output() detailsLoadStart: EventEmitter<
        DetailsLoadDetail
    > = new EventEmitter();

    @ViewChild("domainsTable") domainsTable: MatTable<chrome.cookies.Cookie>;

    constructor(backgroundModulesService: BackgroundModulesService) {
        this.cookiesModule = backgroundModulesService.getModule("cookies");
    }

    ngOnInit() {}

    isInherited(domain: string) {
        return domain.replace(/^\./, "") !== this._domain;
    }

    async loadByOrigin(origin: string) {
        const cookiesModule = await this.cookiesModule;
        this.detailsLoad.emit({ origin: origin, status: "LOADING" });

        const cookies = await cookiesModule.getCookiesByOrigin(origin);

        const details: DetailsLoadDetail = {
            origin: origin,
            cookies,
            status: "LOADED"
        };

        this.cookies = cookies;
        this.detailsLoad.emit(details);
        this.sortDomainsTable({
            active: "name",
            direction: "asc"
        });
    }

    sortDomainsTable(sortEvent: Sort) {
        this.cookies.sort((cookieA, cookieB) => {
            switch (sortEvent.direction) {
                case "asc":
                    return cookieA[sortEvent.active].localeCompare(
                        cookieB[sortEvent.active]
                    );
                case "desc":
                    return cookieB[sortEvent.active].localeCompare(
                        cookieA[sortEvent.active]
                    );
                default:
                    return cookieA.name.localeCompare(cookieB.name);
            }
        });
    }

    onMatSortChange(sortEvent: Sort) {
        this.sortDomainsTable(sortEvent);
        this.domainsTable.renderRows();
    }
}
