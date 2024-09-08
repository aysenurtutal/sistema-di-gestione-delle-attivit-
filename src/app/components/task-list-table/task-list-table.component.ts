import {Component, OnInit, Optional, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {ApiService} from "../../api.service";
import {TaskManagementDto} from "../task-management/task-management-dto";
import {FormsModule} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DropdownModule} from "primeng/dropdown";
import {ToolbarModule} from "primeng/toolbar";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'task-list-table',
  templateUrl: './task-list-table.component.html',
  styleUrls: ['./task-list-table.component.scss'],
  standalone: true,
  imports: [TableModule, InputTextModule, CommonModule, FormsModule, DropdownModule, ToolbarModule, ProgressBarModule],
  providers: [],
})
export class TaskListTableComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  task: TaskManagementDto = {};
  tasks: TaskManagementDto[] = [];

  constructor(private apiService: ApiService,
              @Optional() public ref: DynamicDialogRef,
              @Optional() public config: DynamicDialogConfig,) {}

  ngOnInit() {
    this.loadTasks();
  }
  loadTasks() {
    if(this.config?.data?.task){
      this.tasks = this.config?.data?.task;
    }else{
      if (!localStorage.getItem('tasks')) {
        this.apiService.getTasks().subscribe(
          tasks => {
            this.tasks = tasks.sort((a, b) => b?.id - a?.id);
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
          },
          error => {
            console.error('Error loading tasks:', error);
          }
        );
      } else {
        const tasksFromStorage = localStorage.getItem('tasks');
        this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
      }
    }
  }
  filterGlobal(event: Event, matchMode: string) {
    const inputElement = event.target as HTMLInputElement;

    // dt tanımlıysa filterGlobal çağrısını yap
    if (this.dt) {
      this.dt.filterGlobal(inputElement.value, matchMode);
    }
  }
  // Method to update a task
  updateTask(updatedTask: TaskManagementDto) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask; // Update the task in the tasks array
      localStorage.setItem('tasks', JSON.stringify(this.tasks)); // Sync with local storage
    }
  }
  // onEdit(event) {
  //   if (!this.isPositiveInteger(event.target.value)) {
  //     event.stopPropagation();
  //   }
  // }

  // isPositiveInteger(val) {
  //   let str = String(val);
  //
  //   str = str.trim();
  //
  //   if (!str) {
  //     return false;
  //   }
  //
  //   str = str.replace(/^0+/, '') || '0';
  //   var n = Math.floor(Number(str));
  //
  //   return n !== Infinity && String(n) === str && n >= 0;
  // }
}
