import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {TaskDialogComponent} from "../modals/task-dialog(edit-create)/task-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        private dialog: MatDialog,
        private ngZone: NgZone
    ) {
    }

    openTaskDialog(title: string, visible: boolean): MatDialogRef<TaskDialogComponent> {
        return this.ngZone.run(() => {
            return this.dialog.open<TaskDialogComponent>(TaskDialogComponent, {
                restoreFocus: false,
                autoFocus: true,
                panelClass: 'custom-dialog-container',
                data: {
                    title: title,
                    visible: visible
                }
            });
        });
    }


}

