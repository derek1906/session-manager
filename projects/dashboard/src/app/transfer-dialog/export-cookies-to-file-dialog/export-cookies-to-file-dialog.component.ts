import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { DataSerializerService, SerializationMethod } from '../../../../../../commons/services/serializer.service';
import { DialogTab, Action } from './../transfer-dialog.component';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { BackgroundModulesService } from 'commons/services/background-modules.service';

@Component({
    selector: "export-cookies-to-file-dialog",
    templateUrl: "./export-cookies-to-file-dialog.component.html",
    styleUrls: ["./export-cookies-to-file-dialog.component.css"],
    providers: [
        {
            provide: DialogTab,
            useExisting: ExportCookiesToFileDialogComponent
        }
    ]
})
export class ExportCookiesToFileDialogComponent extends DialogTab
    implements OnInit {
    @ViewChild("exportForm") exportForm: NgForm;
    @Output() actionsChanged = new EventEmitter<Action[]>();

    actions = [
        {
            name: "Export",
            primary: true,
            disabled: true,
            callback: () => this.exportForm.ngSubmit.emit()
        }
    ];
    cookiesModulePromise: Promise<CookiesModule>;

    exportOptions: FormGroup;
    serializationMethods: Array<[string, SerializationMethod]> = [
        ["Plain", SerializationMethod.PLAIN],
        ["AES", SerializationMethod.AES]
    ];

    get _isPassphraseRequired(): boolean {
        const serializationMethod: SerializationMethod = this.exportOptions
            .controls.serializationMethod.value;

        switch (serializationMethod) {
            case SerializationMethod.AES:
                return true;
            default:
                return false;
        }
    }

    constructor(
        backgroundModulesService: BackgroundModulesService,
        private serializerService: DataSerializerService,
        formBuilder: FormBuilder
    ) {
        super();
        this.cookiesModulePromise = backgroundModulesService.getModule(
            "cookies"
        );
        this.exportOptions = formBuilder.group({
            serializationMethod: [
                undefined as SerializationMethod,
                Validators.required
            ],
            passphrase: [{ value: undefined as string, disabled: true }]
        });
        this.exportOptions.statusChanges.subscribe(status =>
            this.onFormStatusChange(status)
        );
        this.exportOptions.controls.serializationMethod.valueChanges.subscribe(
            () => {
                const passphraseField = this.exportOptions.controls.passphrase;
                const isPassphraseRequired = this._isPassphraseRequired;

                if (isPassphraseRequired) {
                    passphraseField.setValidators(Validators.required);
                    passphraseField.enable();
                } else {
                    passphraseField.setValidators(null);
                    passphraseField.disable();
                }

                passphraseField.updateValueAndValidity();
            }
        );

        window["serializer"] = serializerService;
    }

    ngOnInit() {}

    onFormStatusChange(status: string): void {
        this.actions[0].disabled = status !== "VALID";
        this.actionsChanged.emit(this.actions);
    }

    async generateFile(
        contentGenerator: (cookiesByOrigins: CookiesByOrigins) => string
    ) {
        const cookiesModule = await this.cookiesModulePromise;
        const cookies: CookiesByOrigins = {};

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

        const fileBlob = new Blob(
            [ contentGenerator(cookies) ],
            { type: "text/json" }
        );
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = URL.createObjectURL(fileBlob);
        downloadAnchor.download = "cookies_export.json";
        downloadAnchor.click();
    }

    onFormSubmit() {
        const method: SerializationMethod = this.exportOptions.controls.serializationMethod.value;
        const parameters: SerializerParameters = {};

        this.generateFile(cookiesByOrigins => {
            switch (method) {
                case SerializationMethod.PLAIN:
                    break;
                case SerializationMethod.AES:
                    parameters["key"] = this.exportOptions.controls.passphrase.value;
                    break;
            }

            return this.serializerService.serialize(cookiesByOrigins, method, parameters);
        });
    }
}
