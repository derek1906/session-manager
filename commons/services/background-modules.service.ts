import { BackgroundService, BackgroundPage } from './background.service';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class BackgroundModulesService {
    backgroundPagePromise: Promise<BackgroundPage>;

    constructor(backgroundService: BackgroundService) {
        this.backgroundPagePromise = backgroundService.getBackgroundPage();
    }

    async getModule(moduleName: string) {
        const backgroundPage = await this.backgroundPagePromise;
        return await backgroundPage._require(moduleName);
    }
}
