import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Courses } from './courses/courses';
import { Staff } from './staff/staff';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'staff', component: Staff },
  { path: 'about', component: About},
  { path: 'courses', component: Courses}
];
