import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {WarningComponentModalComponent} from "../modals/warning-component-modal/warning-component-modal.component";
import {TaskDialogComponent} from "../../components/task-dialog/task-dialog.component";
import {TaskManagementDto} from "../../components/task-management/task-management-dto";

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
// export class DialogTemplate {
//     icon: string;
//     headerClass: string;
//     contentClass: string;
// }
// export class GenericDialogData {
//     title: string;
//     message: string;
//     errorCode: string;
//     type: GenericDialogType;
// }
// export enum GenericDialogType {
//     Error,
//     Warning,
//     Info
// }
