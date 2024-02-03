import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { FirebaseModule } from '../firebase/firebase.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private router: Router
  ) {};
  
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log('success!', signInSuccessData);
    this.router.navigate(['/dashboard']);
  }
    
  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('error!', errorData);
  }
    
  uiShownCallback() {
    console.log('showing!');
  }
}
