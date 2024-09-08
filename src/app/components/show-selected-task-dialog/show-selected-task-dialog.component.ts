import {
  Component,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef, OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../api.service";
import {DatePipe, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {TaskManagementDto} from "../task-management/task-management-dto";
import {DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef} from "primeng/dynamicdialog";
import {TaskStorageService} from "../../core/services/task-storage.service";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {ProgressBarModule} from "primeng/progressbar";
import {EditorModule} from "primeng/editor";

@Component({
  selector: 'app-task-dialog',
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
  data!: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private taskStorageService: TaskStorageService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    console.log(this.config.data);
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

    // this.route.queryParams.subscribe(params => {
    //   const taskId = params['taskId'];
    // });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.cdr.detectChanges();
  }


  closeDialog() {
    this.ref.close();
  }
}
