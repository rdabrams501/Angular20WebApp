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
  private parsedUsername: string = "";

  constructor(private authService: authService, private router: Router, private cookieService: CookieService) {}

  checkAuth() {
    return this.authService.isAuthenticatedUser();
  }

  getUser(): string{
    //Used to call cookie here but changed to session state
    if(sessionStorage.getItem("User") === "viewerlogin")
    {
      this.parsedUsername = "Viewer";
    }
    else if(sessionStorage.getItem("User") === "adminlogin")
    {
      this.parsedUsername = "Admin";
    }
    return this.parsedUsername
  }

  public logoutModal()
    {
      const modelElement = document.getElementById('logoutModal');
      if(modelElement != null)
      {
        modelElement.style.display = "block";
      }
    }

    public closeLogoutModal()
    {
      const modelElement = document.getElementById('logoutModal');
      if(modelElement != null)
      {
        modelElement.style.display = "none";
      }
    }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
    this.closeLogoutModal();
  }

}
