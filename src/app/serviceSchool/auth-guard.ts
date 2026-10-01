import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { authService } from './authService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

   constructor(private authService: authService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticatedUser())
    {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
