import { Routes } from '@angular/router';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuard} from "./core-file/guard/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {AccessComponent} from "./auth-file/access/access.component";
import {ErrorComponent} from "./auth-file/error/error.component";
import {NotfoundComponent} from "./auth-file/notfound/notfound.component";
import {TaskManagementComponent} from "./components/task-management/task-management.component";
import {TaskListTableComponent} from "./components/task-list-table/task-list-table.component";

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'task-management', component: TaskManagementComponent, canActivate: [AuthGuard]},
      {path: 'task-list-table', component: TaskListTableComponent, canActivate: [AuthGuard]},
      ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'access', component: AccessComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'notFound', component: NotfoundComponent},

  // { path: '**', redirectTo: '/notfound'},
  {path: '**', redirectTo: 'login'},
];
