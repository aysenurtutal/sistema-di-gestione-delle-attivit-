import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router, RouterLink} from "@angular/router";
import {AuthorizationService} from "../../core-file/services/authorization.service";
import {CommonModule, NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {AvatarModule} from "primeng/avatar";
import {ToolbarModule} from "primeng/toolbar";
import {Button} from "primeng/button";
import {Store} from "@ngrx/store";
import {MenubarModule} from "primeng/menubar";
import {BadgeModule} from "primeng/badge";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {MenuModule} from "primeng/menu";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        NgIf,
        AvatarModule,
        ToolbarModule,
        MenuModule,
        Button,
        MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule, NgOptimizedImage
    ],
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit{
    items: MenuItem[] | undefined;
    userName: string | undefined;
    constructor(private store: Store,
                private router: Router,
                private authService: AuthorizationService) {
    }

        ngOnInit() {
          const userNameStorage = localStorage.getItem('userName');
          const userName = userNameStorage ? JSON.parse(userNameStorage) : [];
            if(userName && userName !== '' ){
              this.userName =  userName.toUpperCase();
            }else{
              this.userName = 'Welcome'
            }

          this.items = [
            {
              label: 'Dashboard',
              icon: 'pi pi-home',
              command: () => this.router.navigate(['/dashboard'])
            },
            {
              label: 'Task List Kanban',
              icon: 'pi pi-star',
              command: () => this.router.navigate(['/task-management'])
            },
            {
              label: 'Task List Table',
              icon: 'pi pi-star',
              command: () => this.router.navigate(['/task-list-table'])
            },
            {
              label: 'Profile',
              icon: 'pi pi-envelope',
              command: () => this.router.navigate(['/'])
            }
          ];
        }

  logout(): void {
    return this.authService.removeAuthentication();
  }
}
