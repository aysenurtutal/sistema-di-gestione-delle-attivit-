import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Router, RouterLink} from "@angular/router";
import {AuthorizationService} from "../../core-file/services/authorization.service";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../api.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
    username: string = '';
    password: string = '';

    apiRoot = environment.apiRoot;
    constructor(private router: Router,
                private authService: AuthorizationService) {
    }

    ngOnDestroy(): void {
        localStorage.setItem('userName', JSON.stringify(this.username));
    }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    login() {
        localStorage.setItem('userName', JSON.stringify(this.username));
        if (this.username && this.password) {
            const mockToken = 'dummy-token';
            localStorage.setItem('token', mockToken);
            this.router.navigate(['/task-management']);
        }else {
            console.error('Username and password are required');
        }
    }
}
