import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ["app.component.css"]
})
export class AppComponent {
    title = 'dashboard';

    constructor(private dialog: MatDialog) {}

    openTransferDialog() {
        this.dialog.open(TransferDialogComponent);
    }
}
