import { Component, Inject, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Action {
    name: string;
    primary?: boolean;
    disabled?: boolean;
    callback: () => any;
}

export abstract class DialogTab {
    abstract actions: Action[];
    @Output() abstract actionsChanged: EventEmitter<Action[]>;
}

@Component({
    selector: "transfer-dialog",
    templateUrl: "./transfer-dialog.component.html",
    styleUrls: ["./transfer-dialog.component.css"]
})
export class TransferDialogComponent implements AfterViewInit {
    @ViewChildren(DialogTab) dialogTabs: QueryList<DialogTab>;
    selectedTabIndex = 0;
    actions: Action[] = [];

    constructor(
        private dialogRef: MatDialogRef<TransferDialogComponent>,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngAfterViewInit(): void {
        this.onSelectedIndexChange(this.selectedTabIndex);
        this.cdr.detectChanges();
    }

    onSelectedIndexChange(index: number) {
        const tabs = this.dialogTabs.toArray();
        this.selectedTabIndex = index;
        this.actions = tabs[index].actions;
    }

    onActionsChange(index: number, actions: Action[]) {
        console.log(index, actions);
        if (this.selectedTabIndex === index) {
            this.actions = actions;
        }
    }
}
