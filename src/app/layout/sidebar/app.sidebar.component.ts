import {Component, OnInit} from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {Button} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {RouterLink} from "@angular/router";
import {StyleClassModule} from "primeng/styleclass";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MenuItem} from "primeng/api";
import {BadgeModule} from "primeng/badge";
import {MenuModule} from "primeng/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-sidebar',
    standalone: true,
  imports: [
    SidebarModule,
    Button,
    AvatarModule,
    RouterLink,
    StyleClassModule,
    NgIf,
    BadgeModule,
    MenuModule,
    NgOptimizedImage,
  ],
    templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent implements OnInit{

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        separator: true
      },

      {
        label: 'Task Management System',
        items: [
          {
            label: 'Overview',
            icon: 'pi pi-plus',
            routerLink: ['/dashboard']
          },
          {
            separator: true
          },
          {
            label: 'Task List Kanban',
            icon: 'pi pi-inbox',
            routerLink: ['/task-management']
          },
          {
            separator: true
          },

          {
            label: 'Task List Table',
            icon: 'pi pi-plus',
            routerLink: ['/task-list-table']
          },
          {
            separator: true
          },
          {
            label: 'Projects',
            icon: 'pi pi-plus',
            routerLink: ['/projects']
          },
          {
            separator: true
          },
          {
            label: 'Notes',
            icon: 'pi pi-plus',
            routerLink: ['/dashboard']
          },
          {
            separator: true
          },
          {
            label: 'Schedule',
            icon: 'pi pi-inbox',
            routerLink: ['/task-management']
          },
        ]
      }
    ];
  }

}
