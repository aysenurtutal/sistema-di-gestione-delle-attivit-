import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import {AuthorizationService} from "./core/services/authorization.service";
import {PrimeNGConfig} from "primeng/api";
import {DynamicDialogModule} from "primeng/dynamicdialog";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, MessagesModule, ToastModule,
    DynamicDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'task-management';

  constructor(private router: Router, private authService: AuthorizationService, private primeNGConfig: PrimeNGConfig){}
  ngOnInit() {
  }
}
