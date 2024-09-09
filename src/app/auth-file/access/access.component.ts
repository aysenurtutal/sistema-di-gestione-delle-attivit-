import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    styles: [],
    standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
})
export class AccessComponent { }
