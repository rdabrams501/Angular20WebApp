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
    public usernameShort: string = "";

    constructor(private readonly httpClient: HttpClient, private cookieService: CookieService) {
      this.baseUrl = environment.serviceURL;
      //Originally used to login back in the user will revisit later when possible
      /*if(this.cookieService.get("loginCookie").includes("LoggedIn=True"))
      {
        this.isAuthenticated = true;
      }
      else
      {
        this.isAuthenticated = false;
      }*/
    }

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
      //Cookie was here previously
      if(sessionStorage.getItem("LoginStatus") === "true")
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

      //original cookie code
      //this.cookieService.delete("loginCookie")

      sessionStorage.clear();
      this.isAuthenticated = false;
    }

}
