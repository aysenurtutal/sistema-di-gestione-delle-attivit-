import {Component} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    standalone: true,
  imports: [
    NgOptimizedImage
  ],
})
export class AppFooterComponent {

    constructor() {
    }


}
