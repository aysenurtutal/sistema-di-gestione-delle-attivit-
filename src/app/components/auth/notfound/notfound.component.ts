import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {CardModule} from "primeng/card";

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.css'],
    standalone: true,
  imports: [
    RouterLink,
    CardModule
  ],
})
export class NotfoundComponent { }
