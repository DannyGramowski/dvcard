import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'testimonials', component: TestimonialsComponent},
    {path: 'login', component: LoginComponent}
];
