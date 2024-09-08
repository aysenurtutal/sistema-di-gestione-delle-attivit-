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
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {TaskManagementDto} from "../task-management/task-management-dto";
import {DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef} from "primeng/dynamicdialog";
import {TaskStorageService} from "../../core/services/task-storage.service";
import {CalendarModule} from "primeng/calendar";
import {EditorModule} from "primeng/editor";

@Component({
  selector: 'app-task-dialog',
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
  data!: any;
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
      // dueDate: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.title = this.config.data.title;
    this.task = this.config.data.task;
    this.lastUserId = this.config.data.lastUserId;
    this.route.queryParams.subscribe(params => {
      const taskId = params['taskId'];
      // Burada taskId ile ilgili işlemleri yapın (örneğin, API'den görevi çekmek)
    });
  // Get task data if available
    if (this.task) {
      this.taskForm.patchValue(this.task); // Populate the form if editing
    }else {
      this.taskForm.reset(); // Reset the form if no task data is available (for create scenario)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.task) {
      this.taskForm.patchValue(this.task); // Populate form for editing
    } else {
      this.taskForm.reset(); // Reset form for creating
    }
    this.cdr.detectChanges();
  }


  saveTask = () => {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value; // Get the form values

      // Check if the task is new or being updated
      if (this.title === 'Create Task') {

        taskData.id = ++this.lastUserId;
        // Generate a random ID for new tasks
        // taskData.id = this.generateRandomId(); // Add the random ID to the task data
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
