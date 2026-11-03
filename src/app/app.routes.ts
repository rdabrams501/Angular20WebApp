import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Courses } from './courses/courses';
import { Staff } from './staff/staff';
import { Login } from './login/login';
import { AuthGuard } from './serviceSchool/auth-guard';
import { Reports } from './reports/reports';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'staff', component: Staff, canActivate: [AuthGuard] },
  { path: 'about', component: About},
  { path: 'courses', component: Courses, canActivate: [AuthGuard]},
  { path: 'reports', component: Reports, canActivate: [AuthGuard]},
  { path: 'login', component: Login}
];
