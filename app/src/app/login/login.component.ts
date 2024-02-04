import { Component } from '@angular/core';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    
  }
    
  errorCallback(errorData: FirebaseUISignInFailure) {
    
  }
    
  uiShownCallback() {
    
  }
}
