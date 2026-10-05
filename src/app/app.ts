import { Component, signal, Injectable, NgModule  } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Form, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { authService } from './serviceSchool/authService';



import { Home } from './home/home';
import { About } from './about/about';
import { Courses } from './courses/courses';
import { Staff } from './staff/staff';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('webspa7');
  isLoggedIn: boolean = false;

  constructor(private authService: authService, private router: Router) {}

  checkAuth() {
    return this.authService.isAuthenticatedUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
