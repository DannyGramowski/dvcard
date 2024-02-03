import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AuthService } from './services/auth.service';
import { firebase } from 'firebaseui-angular';
import environment from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FirebaseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'ideacard';

  constructor (
    private authService: AuthService
  ) { };

  ngOnInit() {
    console.log("init");
    firebase.initializeApp(environment.firebaseConfig);
    firebase.auth().onAuthStateChanged(() => {
      this.authService.getProfile();
    }); 
  }
}
