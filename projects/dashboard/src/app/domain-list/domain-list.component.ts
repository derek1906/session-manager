import { DetailsLoadDetail } from './domain-list-item/domain-list-item.component';
import { BackgroundModulesService } from "./../background-modules.service";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "domain-list",
    templateUrl: "./domain-list.component.html",
    styleUrls: ["./domain-list.component.css"]
})
export class DomainListComponent implements OnInit {
    domains: string[] = [];
    domainDetails: { [key: string]: DetailsLoadDetail } = {};
    domainDetailsResolver = null;

    constructor(private backgroundModulesService: BackgroundModulesService) {}

    async ngOnInit() {
        const datastore: DatastoreModule = await this.backgroundModulesService.getModule(
            "datastore"
        );
        const cookiesModule: CookiesModule = await this.backgroundModulesService.getModule(
            "cookies"
        );

        // this.domains = Object.keys(await datastore.get("domains"));
        const domains = await datastore.get("domains");
        this.loadDomains(Object.keys(domains));
        // console.log(this.domains);
    }

    async loadDomains(domains: string[]) {
        console.log(domains);
        for (const domain of domains) {
            this.domains.push(domain);
            await new Promise(res => this.domainDetailsResolver = res);
        }
    }

    onDomainListItemDetailsLoad(details: DetailsLoadDetail) {
        this.domainDetails[details.domain] = details;

        if (this.domainDetailsResolver) {
            this.domainDetailsResolver();
        }
    }
}
