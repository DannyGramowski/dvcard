import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AuthService } from './services/auth.service';
import { firebase } from 'firebaseui-angular';
import { PopupComponent } from './popup/popup.component';
import environment from '../environments/environment';
import { Profile } from './interfaces/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PopupComponent, RouterLink, RouterLinkActive, FirebaseModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  public currentUser: Profile = {name: "", exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};

  title = 'ideacard';

  constructor (
    private authService: AuthService
  ) { };

  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);
    firebase.auth().onAuthStateChanged(() => {
      this.authService.getProfile().then(profile => 
        this.currentUser = profile
      )
    });
  }
}
