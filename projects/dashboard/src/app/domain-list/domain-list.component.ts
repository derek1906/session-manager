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

    constructor(private backgroundModulesService: BackgroundModulesService) {}

    async ngOnInit() {
        const datastore: DatastoreModule = await this.backgroundModulesService.getModule(
            "datastore"
        );
        const cookiesModule: CookiesModule = await this.backgroundModulesService.getModule(
            "cookies"
        );

        this.domains = Object.keys(await datastore.get("domains"));
    }

    handleDetailsLoadStatusChange(details: DetailsLoadDetail) {
        this.domainDetails[details.domain] = details;
    }
}
