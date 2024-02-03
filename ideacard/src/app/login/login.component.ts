import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { FirebaseModule } from '../firebase/firebase.module';
import { firebase } from 'firebaseui-angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {};

  ngOnInit(): void {
    //this.authService.getProfile();
  }
  
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log('success!', signInSuccessData);
    let uid = signInSuccessData.authResult.user?.uid;
    if (!uid) {
      return;
    }
    console.log(firebase.auth().currentUser?.displayName);
    const url = "http://127.0.0.1:8000";
    firebase.auth().currentUser?.getIdToken().then(
      result => fetch(`${url}/login?id_token=${result}`)
    ).then (res => res.json()).then (res2 => console.log(res2));
    this.router.navigate(['/dashboard']);
  }

  randomFunction() {
    firebase.auth().currentUser?.getIdToken().then(
      result => console.log(result));
  }
    
  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('error!', errorData);
  }
    
  uiShownCallback() {
    console.log('showing!');
  }
}
