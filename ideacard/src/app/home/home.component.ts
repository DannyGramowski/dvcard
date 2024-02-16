import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../interfaces/profile';
import { firebase } from 'firebaseui-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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

  getStarted() {
    if (this.currentUser.exists == true) {
      this.router.navigate(['/dashboard'])
    }
    else {
      this.router.navigate(['/register'])
    }
  }
}
