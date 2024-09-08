import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styles: [],
    standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
})
export class ErrorComponent { }
