import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUserData } from './user-data';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})

export class authService {

    private isAuthenticated = false;
    private readonly authSecretKey = 'authToken';
    private baseUrl: string;
    private userData$: Observable<IUserData> = new Observable();

    constructor(private readonly httpClient: HttpClient, private cookieService: CookieService) {
      this.baseUrl = environment.serviceURL;
      if(this.cookieService.get("loginCookie") === "LoggedIn=True")
      {
        this.isAuthenticated = true;
      }
      else
      {
        this.isAuthenticated = false;
      }
    }

    /*login(username: string, password: string): boolean {
      if (username === 'Jaydeep Patil' && password === 'Pass@123') {
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpheWRlZXAgUGF0aWwiLCJpYXQiOjE1MTYyMzkwMjJ9.yt3EOXf60R62Mef2oFpbFh2ihkP5qZ4fM8bjVnF8YhA'; // Generate or receive the token from your server
        localStorage.setItem(this.authSecretKey, authToken);
        this.isAuthenticated = true;
        return true;
      } else {
        return false;
      }
    }*/

    /*handleLogin(user: IUserData): boolean{
      try{
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 24);
        this.cookieService.set("loginCookie", "LoggedIn=True", expireDate);
        this.isAuthenticated = true;
        return this.isAuthenticated;
      }
      catch(error){
        console.log("Error logging in: " + error);
        return false;
      }
    }*/

    public postUserCheckWX(user: IUserData ): Observable<string>{
        const fullUrl = "https://webappapitest3.azurewebsites.net/User";
        const body = JSON.stringify(user);
        console.log(body);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
          });
            return this.httpClient.post(fullUrl, body,  {
                headers,
              'observe': 'body',
              'responseType': 'text'
          });
      }

    updateAuthtication()
    {
      if(this.cookieService.get("loginCookie") === "LoggedIn=True")
      {
        this.isAuthenticated = true;
      }
      else
      {
        this.isAuthenticated = false;
      }
    }

    isAuthenticatedUser(): boolean {
      return this.isAuthenticated;
    }

    logout(): void {
      //localStorage.removeItem(this.authSecretKey);
      this.cookieService.delete("loginCookie")
      this.isAuthenticated = false;
    }

}
