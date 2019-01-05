import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { DomainListComponent } from './domain-list/domain-list.component';
import { DomainListItemComponent } from './domain-list/domain-list-item/domain-list-item.component';
import { MatSortModule } from '@angular/material/sort';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { ExportCookiesToFileDialogComponent } from './transfer-dialog/export-cookies-to-file-dialog/export-cookies-to-file-dialog.component';
import { TransferCookiesToStoreDialogComponent } from './transfer-dialog/transfer-cookies-to-store-dialog/transfer-cookies-to-store-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportCookiesFromFileDialogComponent } from './transfer-dialog/import-cookies-from-file-dialog/import-cookies-from-file-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        DomainListComponent,
        DomainListItemComponent,
        TransferDialogComponent,
        ExportCookiesToFileDialogComponent,
        TransferCookiesToStoreDialogComponent,
        ImportCookiesFromFileDialogComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatCardModule,
        MatListModule,
        MatExpansionModule,
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule
    ],
    entryComponents: [TransferDialogComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
