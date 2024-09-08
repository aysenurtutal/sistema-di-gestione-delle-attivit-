import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../environments/environment";
import {TaskManagementDto} from "./components/task-management/task-management-dto";
import {isPlatformBrowser} from "@angular/common";
import {formatDateToLocal} from "./core/utils/custom-date-format";
import {TaskStorageService} from "./core/services/task-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _portalApiRoot = `${environment.apiRoot}`;
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient,
              private taskStorageService: TaskStorageService,) { }


  // getTasks(): Observable<ProjectsDto[]> {
  //   if (isPlatformBrowser(this.platformId)) {
  //     return this.http.get<ProjectsDto[]>('this.apiUrl');
  //   } else {
  //     return of([]);
  //   }
  // }
  getTasks(): Observable<TaskManagementDto[]> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<TaskManagementDto[]>('assets/db.json');
    } else {
      return of([]);
    }
  }
  getTask(id: number): Observable<TaskManagementDto> {
    return this.http.get<TaskManagementDto>(`${this.apiUrl}/${id}`);
  }

// Create a new task
  createTask(task: TaskManagementDto): Observable<TaskManagementDto> {
    // localStorage'dan mevcut görevleri al
    const tasksFromStorage = localStorage.getItem('tasks'); // 'string | null' döner
    const tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : []; // Eğer varsa, JSON formatına çevir

    // Yeni görevi oluştur
    const newTask = new TaskManagementDto();
    newTask.title = task.title;
    newTask.description = task.description;
    newTask.id = task.id;
    newTask.tag = task.tag;
    newTask.project = task.project;
    newTask.status = task.status;
    newTask.progress = task.progress;
    newTask.startDate = formatDateToLocal(task.startDate);
    newTask.dueDate = formatDateToLocal(task.dueDate);
    newTask.createdAt = task.createdAt;
    newTask.notes = task.notes;
    // Yeni görevi mevcut görevler listesine ekle
    tasks.push(newTask);

    // Güncellenmiş görevler listesini JSON formatına çevirip localStorage'a kaydet
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Burada JSON.stringify kullanıyoruz

    return of(task); // Yeni oluşturulan görevi döndür
  }


  // Update an existing task
  updateTask(task: TaskManagementDto): Observable<TaskManagementDto> {
    const tasksFromStorage = localStorage.getItem('tasks');
    const tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : []; // Eğer varsa, JSON formatına çevir

    const index = tasks.findIndex((t: any) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task; // Update the task in the array
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    return of(task); // Return the updated task
  }

  // deleteTask(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
  deleteTask(id: number): Observable<void> {
    const tasksFromStorage = localStorage.getItem('tasks');
    const tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
    const newTaskList = tasks.filter((res: any) => res.id !== id);
    localStorage.setItem('tasks', JSON.stringify(newTaskList));
    window.location.reload();
    return newTaskList;
  }
}
