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

import { AppComponent } from './app.component';
import { DomainListComponent } from './domain-list/domain-list.component';
import { DomainListItemComponent } from './domain-list/domain-list-item/domain-list-item.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    declarations: [
        AppComponent,
        DomainListComponent,
        DomainListItemComponent
    ],
    imports: [
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
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
