import {
  Component,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef, OnInit
} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import {ApiService} from "../../../api.service";
import {DatePipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef} from "primeng/dynamicdialog";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {ProgressBarModule} from "primeng/progressbar";
import {EditorModule} from "primeng/editor";

@Component({
  selector: 'app-task-dialog(edit-create)',
  templateUrl: './show-selected-task-dialog.component.html',
  styleUrls: ['./show-selected-task-dialog.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    DynamicDialogModule,
    CalendarModule,
    DialogModule,
    TableModule,
    ProgressBarModule,
    EditorModule,
    DatePipe,
  ],
  encapsulation: ViewEncapsulation.None,

})
export class ShowSelectedTaskDialogComponent implements OnInit, OnChanges{

  task!: any;
  title: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {

  }

  ngOnInit() {
    if (this.config && this.config.data) {
      this.title = this.config.data.title || 'No Title';
      if (this.config.data.task) {
        this.task = this.config.data.task;
      } else {
        console.error('Task data is missing');
      }
    } else {
      console.error('Dialog config data is missing');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdr.detectChanges();
  }

  closeDialog() {
    this.ref.close();
  }
}
