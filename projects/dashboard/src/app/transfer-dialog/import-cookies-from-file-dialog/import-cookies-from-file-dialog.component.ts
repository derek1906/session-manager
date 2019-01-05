import { BackgroundModulesService } from './../../../../../../commons/services/background-modules.service';
import { NgZone, ViewChild } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DialogTab, Action } from '../transfer-dialog.component';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';

@Component({
    selector: "import-cookies-from-file-dialog",
    templateUrl: "./import-cookies-from-file-dialog.component.html",
    styleUrls: ["./import-cookies-from-file-dialog.component.css"],
    providers: [
        {
            provide: DialogTab,
            useExisting: ImportCookiesFromFileDialogComponent
        }
    ]
})
export class ImportCookiesFromFileDialogComponent extends DialogTab
    implements OnInit {
    @ViewChild("importForm") importForm: NgForm;
    actions = [
        {
            name: "Import",
            primary: true,
            disabled: true,
            callback: () => {
                this.importForm.ngSubmit.emit();
            }
        }
    ];
    @Output() actionsChanged = new EventEmitter<Action[]>();

    cookiesModulePromise: Promise<CookiesModule>;
    importOptions: FormGroup;
    availableCookieStoreIds: string[];

    constructor(formBuilder: FormBuilder, private ngZone: NgZone, backgroundModulesService: BackgroundModulesService) {
        super();
        this.cookiesModulePromise = backgroundModulesService.getModule("cookies");
        this.importOptions = formBuilder.group({
            cookieStoreId: [undefined, Validators.required],
            importCookies: [undefined, Validators.required]
        });
        this.importOptions.statusChanges.subscribe(status =>
            this.onFormStatusChange(status)
        );
    }

    ngOnInit() {
        chrome.cookies.getAllCookieStores(cookieStores => {
            this.ngZone.run(() => {
                this.availableCookieStoreIds = cookieStores.map(
                    cookieStore => cookieStore.id
                );
            });
        });
    }

    async onFormSubmit() {
        const cookiesModule = await this.cookiesModulePromise;
        const cookieStoreId = this.importOptions.value.cookieStoreId;
        const cookies = this.importOptions.value.importCookies;

        try {
            await cookiesModule.writeCookiesToStore(cookieStoreId, cookies);
        } catch (err) {
            console.error(err);
        }
    }

    onFormStatusChange(status: string) {
        console.log(status);
        this.actions[0].disabled = status !== "VALID";
    }

    onFileChange(event: Event) {
        console.log(event);
        const reader = new FileReader();
        const target = event.target as HTMLInputElement;

        if (target.files && target.files.length) {
            const file = target.files[0];
            reader.readAsText(file);

            reader.addEventListener("load", () => {
                let jsonResult: CookiesByOrigins;

                try {
                    jsonResult = JSON.parse(reader.result as string);
                } catch (err) {
                    alert("Cannot parse selected file.");
                    target.value = "";
                    return;
                }

                this.ngZone.run(() => {
                    this.importOptions.patchValue({
                        importCookies: jsonResult
                    });
                });
            });
        }
    }
}
