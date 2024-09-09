import {Component, ViewChild} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AppSidebarComponent} from "./sidebar/app.sidebar.component";
import {AppTopBarComponent} from "./topbar/app.topbar.component";
import {LayoutService} from "./app.layout.service";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.state";
import {AppFooterComponent} from "./footer/app.footer.component";

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    standalone: true,
  imports: [
    AppSidebarComponent,
    AppTopBarComponent,
    RouterOutlet,
    AppFooterComponent,
  ]
})
export class AppLayoutComponent {

    // @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(public router: Router, private store: Store<AppState>) {
    }

}

