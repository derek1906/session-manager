import { DialogTab, Action } from './../transfer-dialog.component';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BackgroundModulesService } from 'commons/services/background-modules.service';

@Component({
    selector: "export-cookies-to-file-dialog",
    templateUrl: "./export-cookies-to-file-dialog.component.html",
    styleUrls: ["./export-cookies-to-file-dialog.component.css"],
    providers: [{
        provide: DialogTab,
        useExisting: ExportCookiesToFileDialogComponent
    }]
})
export class ExportCookiesToFileDialogComponent extends DialogTab implements OnInit {
    @Output() actionsChanged = new EventEmitter<Action[]>();

    actions = [{
        name: "Export",
        primary: true,
        callback: this.generateFile.bind(this)
    }];
    cookiesModulePromise: Promise<CookiesModule>;

    constructor(backgroundModulesService: BackgroundModulesService) {
        super();
        this.cookiesModulePromise = backgroundModulesService.getModule(
            "cookies"
        );
    }

    ngOnInit() {}

    async generateFile() {
        const cookiesModule = await this.cookiesModulePromise;
        const cookies: {
            [domain: string]: { [name: string]: chrome.cookies.Cookie };
        } = {};

        const trackedOrigins = await cookiesModule.getTrackedOrigins();

        const cookiesByOrigin = await Promise.all(
            trackedOrigins.map(origin =>
                cookiesModule.getCookiesByOrigin(origin)
            )
        );

        cookiesByOrigin.forEach(cookiesForOrigin => {
            cookiesForOrigin.forEach(cookie => {
                if (!(cookie.domain in cookies)) {
                    cookies[cookie.domain] = {};
                }
                cookies[cookie.domain][cookie.name] = cookie;
            });
        });

        const fileBlob = new Blob([JSON.stringify(cookies)], {
            type: "text/json"
        });
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = URL.createObjectURL(fileBlob);
        downloadAnchor.download = "cookies_export.json";
        downloadAnchor.click();
    }
}
