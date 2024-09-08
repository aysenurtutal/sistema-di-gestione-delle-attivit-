import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {CardModule} from "primeng/card";
import {ButtonDirective} from "primeng/button";
import {ChartModule} from "primeng/chart";
import {MessagesModule} from "primeng/messages";
import {Table, TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ToolbarModule} from "primeng/toolbar";
import {TaskManagementDto} from "../task-management/task-management-dto";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {Footer} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Router} from "@angular/router";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {TaskListTableComponent} from "../task-list-table/task-list-table.component";
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
  imports: [
    NgForOf,
    CardModule,
    ButtonDirective,
    ChartModule,
    MessagesModule,
    TableModule,
    FileUploadModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    ToolbarModule,
    ScrollPanelModule

  ]
})
export class DashboardComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  tasks: any[] = [];
  totalTasks: number = 0;

  completedTaskList: any = [];
  updatedTaskList: any = [];
  newTaskList: any = [];
  dueTaskList: any = [];
  inProgressTaskList: any = [];
  toDoTaskList: any = [];

  inProgressTasks: number = 0;
  toDoTasks: number = 0;
  completedTasks: number = 0;

  newTasks: number = 0;
  updatedTasks: number = 0;
  dueTasks: number = 0;

  workload: any[] = [];
  data: any;

  options: any;

  priorityTasks: any[] = [];
  selectedTask: any;
  ref!: DynamicDialogRef;
  // options: any = {completed: this.completedTasks, inProgres: this.inProgressTasks, toDo: this.toDoTasks}
  constructor(private dialogService: DialogService,
              private router: Router) {}

  ngOnInit() {
    // Görevleri localStorage'dan al
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }

    this.priorityTasks = this.tasks.filter(x => x.tag == 'Urgent' && (x.status == 'unstarted' || x.status == 'in-progress'));
    this.calculateDashboardData();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.data = {
      labels: ['ToDo', 'OnGoing', 'Completed'],
      datasets: [
        {
          data: [this.toDoTasks, this.inProgressTasks, this.completedTasks],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      },
      onClick: (event: MouseEvent, chartElement: any[]) => {
        if (chartElement.length) {
          const index = chartElement[0].index; // Get the index of the clicked segment
          this.handleSegmentClick(index); // Call the handler function
        }
      }

    };
  }
  handleSegmentClick(index: number) {
    switch (index) {
      case 0:
        this.handleToDoClick();
        break;
      case 1:
        this.handleInProgressClick();
        break;
      case 2:
        this.handleCompletedClick();
        break;
      default:
        break;
    }
  }

  handleToDoClick() {
    this.openTaskDialog(this.toDoTaskList);
  }

  handleInProgressClick() {
    this.openTaskDialog(this.inProgressTaskList);
  }

  handleCompletedClick() {
    this.openTaskDialog(this.completedTaskList);
  }
  // Dashboard verilerini hesapla
  calculateDashboardData() {
    this.totalTasks = this.tasks.length;
    this.completedTaskList = this.tasks.filter(x => x.status == 'completed');
    this.completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    this.inProgressTaskList = this.tasks.filter(task => task.status === 'in-progress');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'in-progress').length;
    this.toDoTaskList = this.tasks.filter(task => task.status === 'unstarted');
    this.toDoTasks = this.tasks.filter(task => task.status === 'unstarted').length;

    // Yeni, Güncellenmiş ve Vadesi Yaklaşan Görevleri Hesapla
    this.newTaskList = this.tasks.filter(task => this.isNew(task));
    this.newTasks = this.tasks.filter(task => this.isNew(task)).length;
    this.updatedTaskList = this.tasks.filter(task => this.isUpdated(task));
    this.updatedTasks = this.tasks.filter(task => this.isUpdated(task)).length;
    this.dueTaskList = this.tasks.filter(task => this.isDue(task));
    this.dueTasks = this.tasks.filter(task => this.isDue(task)).length;
  }

  // Yeni görevlerin hesaplanması
  isNew(task: any): boolean {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(task.createdAt) > oneWeekAgo;
  }

  // Güncellenmiş görevlerin hesaplanması
  isUpdated(task: any): boolean {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(task.startDate) > oneWeekAgo;
  }

  // Bitmek üzere olan görevlerin hesaplanması
  isDue(task: any): boolean {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return new Date(task.dueDate) <= nextWeek;
  }

  filterGlobal(event: Event, matchMode: string) {
    const inputElement = event.target as HTMLInputElement;

    // dt tanımlıysa filterGlobal çağrısını yap
    if (this.dt) {
      this.dt.filterGlobal(inputElement.value, matchMode);
    }
  }

  openTaskDialog(taskList: any) {
    if(taskList.length > 0){
      this.tasks = taskList;
      this.ref = this.dialogService.open(TaskListTableComponent, {
        header: 'Detail',
        style: { 'max-height': '100%' },
        contentStyle: { overflow: 'auto' },
        breakpoints: { '1199px': '55vw', '575px': '90vw' },
        templates: {
          footer: Footer
        },
        data: { task: this.tasks },
      });
      this.ref.onClose.subscribe((result) => {
        window.location.reload();
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
      });
    }
  }
  // openTaskDialog(task: TaskManagementDto, title: string) {
  //   // this.task = { ...task };
  //   this.ref = this.dialogService.open(ShowSelectedTaskDialogComponent, {
  //     header: title,
  //     width: '37%',
  //     contentStyle: { overflow: 'auto' },
  //     breakpoints: { '1199px': '55vw', '575px': '90vw' },
  //     templates: {
  //       footer: Footer
  //     },
  //     data: { title: title, task: task },
  //   });
  //   this.ref.onClose.subscribe((result) => {
  //     // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
  //   });
  // }
  openEditPopup(task: TaskManagementDto, title: string) {
    this.selectedTask = { ...task }; // Cloning task object to prevent direct modifications
    this.ref = this.dialogService.open(TaskDialogComponent, {
      header: title,
      width: '37%',
      contentStyle: { overflow: 'auto' },
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      templates: {
        footer: Footer
      },
      data: { title: title, task: task },
    });
    this.ref.onClose.subscribe((result) => {
      const tasksFromStorage = localStorage.getItem('tasks');
      this.tasks = tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
      // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
    });
  }
}
