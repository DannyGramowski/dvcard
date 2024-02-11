import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import { FirebaseModule } from '../firebase/firebase.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirebaseModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', user_id: '', publicprofile: false};

  constructor (private authService: AuthService) {};

  ngAfterContentInit(): void {
    firebase.auth().onAuthStateChanged(() => {
      this.authService.getProfile().then(
        profile => {this.currentUser = profile; console.log(this.currentUser);}
      );
    });
  }
}
