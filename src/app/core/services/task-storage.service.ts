// src/app/services/task-storage.service.ts
import { Injectable } from '@angular/core';
import {TaskManagementDto} from "../../components/task-management/task-management-dto";


@Injectable({
  providedIn: 'root',
})
export class TaskStorageService {
  private tasks: TaskManagementDto[] = [];

  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
    return this.tasks;
  }

  setTasks(tasks: TaskManagementDto[]): void {
    this.tasks = tasks;
  }

  getTasks(): TaskManagementDto[] {
    return this.tasks;
  }

  addTask(task: TaskManagementDto): void {
    this.tasks.push(task);
    this.saveTasks();
  }

  updateTask(task: TaskManagementDto) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      this.saveTasks();
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
