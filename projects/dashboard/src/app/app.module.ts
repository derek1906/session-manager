import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { DomainListComponent } from './domain-list/domain-list.component';
import { DomainListItemComponent } from './domain-list/domain-list-item/domain-list-item.component';

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
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
