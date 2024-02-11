import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'testimonials', component: TestimonialsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'contact', component: ContactComponent},
];
