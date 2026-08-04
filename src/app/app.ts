import { Component, signal, Injectable, NgModule  } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Form, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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
}
