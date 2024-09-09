import {
  Component,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef, OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../api.service";
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {TaskManagementDto} from "../../models/task-management-dto";
import {DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef} from "primeng/dynamicdialog";
import {TaskStorageService} from "../../services/task-storage.service";
import {CalendarModule} from "primeng/calendar";
import {EditorModule} from "primeng/editor";
import {formatDateToLocal} from "../../utils/custom-date-format";

@Component({
  selector: 'app-task-dialog(edit-create)',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
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
    EditorModule,
  ],
  encapsulation: ViewEncapsulation.None,

})
export class TaskDialogComponent implements OnInit, OnChanges{

  taskForm: FormGroup;
  statuses: any[] = [{ label: 'Unstarted', value: 'unstarted' }, { label: 'In Progress', value: 'in-progress' }, { label: 'Completed', value: 'completed' }];
  task: TaskManagementDto = { id: 0, title: '', description: '', status: '', tag: '', project:'', progress: 0, startDate: undefined, dueDate: undefined, createdAt: undefined, notes: ''};
  tags: any[] = [{ label: 'Updates', value: 'Updates' }, { label: 'Urgent', value: 'Urgent' }];
  projects: any[] = [
    { label: 'Job', value: 'Job' },
    { label: 'Home', value: 'Home' },
    { label: 'Personal', value: 'Personal' },
    { label: 'Free', value: 'Free' },
  ];
  title: string = 'Create Task';
  lastUserId: number = 0;

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
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      notes: [''],
      status: [''],
      tag: [''],
      project: [''],
      progress: [''],
      dueDate: [''],
      startDate: [''],
    });

  }

  ngOnInit() {
    this.title = this.config.data.title;
    this.task = this.config.data.task;
    this.lastUserId = this.config.data.lastUserId;
  // Get task data if available
    this.patchFormWithTaskValues();

    this.taskForm.get('startDate')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedDate = formatDateToLocal(value);
        if (formattedDate !== value) {
          this.taskForm.controls['startDate'].setValue(formattedDate, { emitEvent: false });
        }
      } else {
        this.taskForm.controls['startDate'].setValue('', { emitEvent: false });
      }
    });
    this.taskForm.get('dueDate')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedDate = formatDateToLocal(value);
        if (formattedDate !== value) {
          this.taskForm.controls['dueDate'].setValue(formattedDate, { emitEvent: false });
        }
      } else {
        this.taskForm.controls['dueDate'].setValue('', { emitEvent: false });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdr.detectChanges();
  }

  patchFormWithTaskValues() {
    if (this.task) {
      this.taskForm.controls['title'].setValue(this.task.title || '');
      this.taskForm.controls['description'].setValue(this.task.description || '');
      this.taskForm.controls['notes'].setValue(this.task.notes || '');
      this.taskForm.controls['status'].setValue(this.task.status || '');
      this.taskForm.controls['tag'].setValue(this.task.tag || '');
      this.taskForm.controls['project'].setValue(this.task.project || '');
      this.taskForm.controls['progress'].setValue(this.task.progress || '');
      this.taskForm.controls['dueDate'].setValue(this.task.dueDate || '');
      this.taskForm.controls['startDate'].setValue(this.task.startDate || '');
    }else{
      this.taskForm.reset();
    }
  }

  saveTask = () => {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value; // Get the form values

      // Check if the task is new or being updated
      if (this.title === 'Create Task') {
        // Generate a ID for new tasks
        taskData.id = ++this.lastUserId;
        taskData.createdAt = new Date();
        this.apiService.createTask(taskData).subscribe(res => {
          console.log('Task created:', res);
        });
      } else {
        // For updating, ensure the task has an ID
        taskData.id = this.task.id;
        this.apiService.updateTask(taskData).subscribe(res => {
          console.log('Task updated:', res);
        });
      }
      this.closeDialog(); // Close the dialog after saving
    }
  }

  closeDialog() {
    this.ref.close();
  }
}
