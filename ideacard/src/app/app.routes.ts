import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SelectionComponent } from './selection/selection.component';
import { TestimonialSubmissionComponent } from './testimonialsubmission/testimonialsubmission.component';
import { TestSubmitSuccessComponent } from './test-submit-success/test-submit-success.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'testimonials', component: TestimonialsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'selection', component: SelectionComponent},
    {path: 'submittestimonial/:uuid', component: TestimonialSubmissionComponent},
    {path: 'submitsuccess', component: TestSubmitSuccessComponent},
    {path: 'profile/:uuid', component: PublicProfileComponent}
];
