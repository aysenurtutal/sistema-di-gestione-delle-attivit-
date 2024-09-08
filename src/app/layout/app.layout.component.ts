import {Component, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {async, filter, Observable, Subscription} from 'rxjs';
import {AppSidebarComponent} from "./sidebar/app.sidebar.component";
import {AppTopBarComponent} from "./topbar/app.topbar.component";
import {LayoutService} from "./app.layout.service";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {select, Store} from "@ngrx/store";
import {AppState} from "../store/app.state";
import {selectSidebarVisible} from "../store/sidebarVisible/sidebar-visible.selector";
import {hideSidebar, showSidebar} from "../store/sidebarVisible/sidebar-visible.action";

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    standalone: true,
  imports: [
    AppSidebarComponent,
    AppTopBarComponent,
    RouterOutlet,
  ]
})
export class AppLayoutComponent {

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(public layoutService: LayoutService, public router: Router, private store: Store<AppState>) {
    }

}

