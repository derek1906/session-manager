import { DetailsLoadDetail } from './domain-list-item/domain-list-item.component';
import { BackgroundModulesService } from "commons/services/background-modules.service";
import { Component, OnInit, NgZone } from "@angular/core";

@Component({
    selector: "domain-list",
    templateUrl: "./domain-list.component.html",
    styleUrls: ["./domain-list.component.css"]
})
export class DomainListComponent implements OnInit {
    domains: string[] = [];
    domainDetails: { [key: string]: DetailsLoadDetail } = {};

    constructor(
        private backgroundModulesService: BackgroundModulesService,
        private ngZone: NgZone
    ) {}

    async ngOnInit() {
        const cookiesModule: CookiesModule = await this.backgroundModulesService.getModule(
            "cookies"
        );

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== "local" || !("domains" in changes)) {
                return;
            }
            this.ngZone.run(() => {
                this.domains = Object.keys(changes.domains.newValue);
            });
        });

        this.domains = await cookiesModule.getTrackedOrigins();
    }

    handleDetailsLoadStatusChange(details: DetailsLoadDetail) {
        this.domainDetails[details.origin] = details;
    }
}
