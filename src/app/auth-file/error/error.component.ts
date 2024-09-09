import { Component } from '@angular/core';
import { NgOptimizedImage} from "@angular/common";
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
