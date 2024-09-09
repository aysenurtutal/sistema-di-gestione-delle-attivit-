import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ApiService} from "../../api.service";
import {TaskManagementDto} from "../../core-file/models/task-management-dto";
import {TaskDialogComponent} from "../../core-file/modals/task-dialog(edit-create)/task-dialog.component";
import {CardModule} from "primeng/card";
import {ProgressBarModule} from "primeng/progressbar";
import {TagModule} from "primeng/tag";
import {InputNumberModule} from "primeng/inputnumber";
import {ConfirmationService, Footer, MessageService} from "primeng/api";
import {DialogService, DynamicDialogModule, DynamicDialogRef} from "primeng/dynamicdialog";
import {SpinnerModule} from "primeng/spinner";
import {TaskStorageService} from "../../core-file/services/task-storage.service";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {DragDropModule} from "primeng/dragdrop";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {ShowSelectedTaskDialogComponent} from "../../core-file/modals/show-selected-task-dialog/show-selected-task-dialog.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    TaskDialogComponent,
    ButtonModule,
    CardModule,
    CommonModule,
    DynamicDialogModule,
    ProgressBarModule,
    TagModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    SpinnerModule,
    NgClass,
    ScrollPanelModule,
    DragDropModule,
    CdkDropList,
    NgxSkeletonLoaderModule
  ],
  encapsulation: ViewEncapsulation.None,

})

export class TaskManagementComponent implements OnInit, OnDestroy{

  task: TaskManagementDto = { id: 0, title: '', description: '', status: '', tag: '', project:'',  progress: 0 }; // Initialize task object
  tasks: TaskManagementDto[] = [];
  ref!: DynamicDialogRef;
  isLoading: boolean = true;
  draggedTask: any = null;
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private taskStorageService: TaskStorageService,
    private confirmationService: ConfirmationService
  ) {

  }


  ngOnInit(): void {

    this.isLoading = true;
    setTimeout(() => {
      if(!localStorage.getItem('tasks')){
        this.apiService.getTasks().subscribe(
          tasks => {
            this.tasks = tasks.sort((a, b) => b?.id - a?.id);
            !localStorage.getItem('tasks') ? localStorage.setItem('tasks', JSON.stringify(this.tasks)) : [];
            this.isLoading = false;
          },
          error => {
            console.error('Error loading tasks:', error);
            this.isLoading = false;
          }
        );
      }else{
        const tasksFromStorage = localStorage.getItem('tasks');
        this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
        this.isLoading = false;
      }
    }, 1000);

  }

  filterTasks(status: string, searchTerm: string) {
    return this.tasks.filter(task =>
      task.status === status &&
      (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.tag && task.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.project && task.project.toLowerCase().includes(searchTerm.toLowerCase())))
    ));
  }

  openCreatePopup(title: string) {
    const lastUserId = this.tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0);
    this.ref = this.dialogService.open(TaskDialogComponent, {
      header: title,
      width: '45%',
      contentStyle: { overflow: 'auto' },
      breakpoints: { '999px': '75vw', '575px': '90vw' },
      templates: {
        footer: Footer
      },
      data: { title: title, lastUserId: lastUserId},
    });
    this.ref.onClose.subscribe((result) => {
      const tasksFromStorage = localStorage.getItem('tasks');
      this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
      // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Created', life: 3000 });
    });
  }

  openEditPopup(task: TaskManagementDto, title: string) {
    this.task = { ...task }; // Cloning task object to prevent direct modifications
    const lastUserId = this.tasks[this.tasks.length - 1]?.id
    this.ref = this.dialogService.open(TaskDialogComponent, {
      header: title,
      width: '37%',
      contentStyle: { overflow: 'auto' },
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      templates: {
        footer: Footer
      },
      data: { title: title, task: task , lastUserId: lastUserId},
    });
    this.ref.onClose.subscribe((result) => {
        const tasksFromStorage = localStorage.getItem('tasks');
        this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
    });
  }

  openShowPopup(task: TaskManagementDto, title: string) {
    this.task = { ...task };
    this.ref = this.dialogService.open(ShowSelectedTaskDialogComponent, {
      header: title,
      width: '37%',
      contentStyle: { overflow: 'auto' },
      breakpoints: { '1199px': '55vw', '575px': '90vw' },
      templates: {
        footer: Footer
      },
      data: { title: title, task: task },
    });
    this.ref.onClose.subscribe((result) => {
      // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
    });
  }

  deleteTask(taskId: number) {
    if(taskId){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the task?',
        header: 'Warning',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.apiService.deleteTask(taskId).subscribe(() => {
              this.tasks = this.tasks.filter(task => task.id !== taskId);
              this.taskStorageService.deleteTask(taskId);
              // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
              const storedTasks = localStorage.getItem('tasks');
              if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
              }
            },
            (error) => {
              // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, life: 3000 });
            });
        }
      });
    }
  }

  onTaskDrop(newStatus: string) {
    if (this.draggedTask) {
      this.draggedTask.status = newStatus;
      this.saveTasksToLocalStorage();
      this.draggedTask = null;
    }
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  dragStart(task: any) {
    this.draggedTask = task;
  }

  dragEnd() {
    this.draggedTask = null;
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

}
