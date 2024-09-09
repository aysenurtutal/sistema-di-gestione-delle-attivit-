import {Component, OnInit, Optional, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {ApiService} from "../../api.service";
import {TaskManagementDto} from "../../core-file/models/task-management-dto";
import {FormsModule} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DropdownModule} from "primeng/dropdown";
import {ToolbarModule} from "primeng/toolbar";
import {ProgressBarModule} from "primeng/progressbar";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";

@Component({
  selector: 'task-list-table',
  templateUrl: './task-list-table.component.html',
  styleUrls: ['./task-list-table.component.scss'],
  standalone: true,
  imports: [TableModule, InputTextModule, CommonModule, FormsModule, DropdownModule, ToolbarModule, ProgressBarModule, NgxSkeletonLoaderModule],
  providers: [],
})
export class TaskListTableComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  task: TaskManagementDto = {};
  tasks: TaskManagementDto[] = [];
  tasksList: TaskManagementDto[] = [];
  taskLocalStorageList: TaskManagementDto[] = [];
  isLoading: boolean = true;
  rowsPerPage: number = 10;

  constructor(private apiService: ApiService,
              @Optional() public ref: DynamicDialogRef,
              @Optional() public config: DynamicDialogConfig,) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;

    setTimeout(() => {
      const tasksFromStorage = localStorage.getItem('tasks');
      this.tasksList = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];

      if(this.config?.data?.task){
        this.tasks = this.config?.data?.task;
        this.isLoading = false;
      }else{
        if (!localStorage.getItem('tasks')) {
          this.apiService.getTasks().subscribe(
            tasks => {
              this.tasks = tasks.sort((a, b) => b?.id - a?.id);
              localStorage.setItem('tasks', JSON.stringify(this.tasks));
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
      }
    },1000)
  }

  filterGlobal(event: Event, matchMode: string) {
    const inputElement = event.target as HTMLInputElement;

    if (this.dt) {
      this.dt.filterGlobal(inputElement.value, matchMode);
    }
  }

  // Method to update a task
  updateTask(updatedTask: TaskManagementDto) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask; // Update the task in the tasks array
      this.tasks = this.tasks.filter(x => x.id != updatedTask.id);
      this.tasks.push(updatedTask);
      this.taskLocalStorageList = this.tasksList.filter(x => x.id != updatedTask.id);
      this.taskLocalStorageList.push(updatedTask);
      localStorage.setItem('tasks', JSON.stringify(this.taskLocalStorageList)); // Sync with local storage
    }
  }

  updateRowsPerPage() {
    if (this.dt) {
      this.dt.rows = this.rowsPerPage;
    }
  }

}
