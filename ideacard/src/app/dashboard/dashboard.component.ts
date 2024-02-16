import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import { FirebaseModule } from '../firebase/firebase.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirebaseModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', user_id: '', publicprofile: false};

  constructor (private authService: AuthService, private router: Router) {};

  ngAfterContentInit(): void {
    let result = this.authService.getProfileSync();
    if (result) {
      this.currentUser = result;
    }
    else {
      firebase.auth().onAuthStateChanged(() => {
        this.authService.getProfile().then(
          profile => {this.currentUser = profile;}
        );
      });
    }
  }

  goToSelection() {
    this.router.navigate(['/selection']);
  }
  
  goToEdit() {
    this.router.navigate(['/info-form']);
  }

  exportPopup() {

  }

  deleteDisability(i: number) {
    this.currentUser.disabilities.splice(i, 1);
  }
}
