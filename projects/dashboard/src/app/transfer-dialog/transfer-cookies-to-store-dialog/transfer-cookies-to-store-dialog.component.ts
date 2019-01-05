import { BackgroundModulesService } from './../../../../../../commons/services/background-modules.service';
import { DialogTab, Action } from './../transfer-dialog.component';
import { Component, OnInit, NgZone, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
    selector: "transfer-cookies-to-store-dialog",
    templateUrl: "./transfer-cookies-to-store-dialog.component.html",
    styleUrls: ["./transfer-cookies-to-store-dialog.component.css"],
    providers: [
        {
            provide: DialogTab,
            useExisting: TransferCookiesToStoreDialogComponent
        }
    ]
})
export class TransferCookiesToStoreDialogComponent extends DialogTab
    implements OnInit {
    @Output() actionsChanged = new EventEmitter<Action[]>();

    @ViewChild("transferForm") transferForm: NgForm;
    actions = [
        {
            name: "Transfer",
            primary: true,
            disabled: true,
            callback: () => {
                console.log(
                    "Hello world from TransferCookiesToStoreDialogComponent!"
                );
                this.transferForm.ngSubmit.emit();
            }
        }
    ];
    transferOptions: FormGroup;
    availableCookieStoreIds: string[];
    cookiesModulePromise: Promise<CookiesModule>;

    constructor(
        private ngZone: NgZone,
        formBuilder: FormBuilder,
        backgroundModulesService: BackgroundModulesService
    ) {
        super();
        this.transferOptions = formBuilder.group({
            cookieStoreId: [undefined, Validators.required]
        });
        this.transferOptions.statusChanges.subscribe(status =>
            this.onFormStatusChange(status)
        );
        this.cookiesModulePromise = backgroundModulesService.getModule(
            "cookies"
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
        const cookieStoreId = this.transferOptions.value.cookieStoreId;
        const cookiesModule = await this.cookiesModulePromise;
        const cookies = await cookiesModule.getCookiesFromTrackedOrigins();

        try {
            await cookiesModule.writeCookiesToStore(cookieStoreId, cookies);
        } catch (err) {
            console.error(err);
        }
    }

    onFormStatusChange(status: string) {
        this.actions[0].disabled = !(status === "VALID");
        this.actionsChanged.emit(this.actions);
    }
}
