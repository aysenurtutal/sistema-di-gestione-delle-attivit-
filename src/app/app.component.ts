import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessagesModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'task-management';

  constructor(){}
  ngOnInit() {
  }
}
