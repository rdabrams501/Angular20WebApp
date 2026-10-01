import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { authService } from '../serviceSchool/authService';
import { IUserData } from '../serviceSchool/user-data';
import { CookieService } from 'ngx-cookie-service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup;
  userData: IUserData = <IUserData>{};
  isLoading: boolean = false;
  isLoginFail: boolean = false;

  constructor(private authenticationService : authService, private router: Router, private cookieService: CookieService)
  {
    this.loginForm = new FormGroup({
      username: new FormControl<string>('', [Validators.required]),
      password: new FormControl<string>('', [Validators.required])
    });
  }

  /*ngOnInit(): void {

  }*/
  onSubmit(): void {
    if (this.loginForm.valid) {

      const username = this.loginForm.get('username')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';

      this.userData.username = username;
      this.userData.password = password;

      this.isLoginFail = false;
      this.isLoading = true;

      this.authenticationService.postUserCheckWX(this.userData).subscribe
      ({
        next: (data) => {this.processUser(data)},
        error: (err) => {this.processError(err)}
      });

       /*// Call the authentication service's login method
       if (this.authenticationService.handleLogin(this.userData)) {
        // Navigate to the ProductListComponent upon successful login
        this.router.navigate(['']);
      } else {
        // Handle authentication error (show error message, etc.)
      }*/
    }
  }

  private processUser(data: string | null) {
          this.isLoading = false;
          const expireDate = new Date();
          expireDate.setHours(expireDate.getHours() + 24);
          this.cookieService.set("loginCookie", "LoggedIn=True", expireDate);
          this.authenticationService.updateAuthtication();
          this.router.navigate(['']);
      }

  private processError(err: any) {
    this.isLoading = false;
    if( err.message.includes("0 Unknown Error") )
    {
      alert('Failure to connect to API! Azure web app may not be running please contact website admin.');
      console.log('Failure to connect to API! Azure web app may not be running please contact website admin.');
    }
    else if (String(err.error).includes("Login failed"))
    {
      this.isLoginFail = true;
      console.log(err);
    }
    else
    {
      alert('Failed to load database info! Likely timeout please try again.');
      console.log(err);
    }
  }


}
