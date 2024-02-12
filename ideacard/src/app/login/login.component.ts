import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { FirebaseModule } from '../firebase/firebase.module';
import { firebase } from 'firebaseui-angular';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) {};

  ngOnInit(): void {
    //this.authService.getProfile();
  }

  loginUser(authToken: string) : void{
    const url = "http://127.0.0.1:8000";
    console.log(authToken);
    let headers = new Headers();
    headers.set('Id-Token', authToken);
    fetch(`${url}/login`, {headers: headers})
  }

  submit() {
    const auth = getAuth()

    createUserWithEmailAndPassword(auth, this.email, this.password)
    .then(credentials => {credentials.user.getIdToken().then(result => this.loginUser(result))})
    .catch(error => {
      if(error.code == "auth/email-already-in-use") { //stfu brandon it works
        signInWithEmailAndPassword(auth, this.email, this.password)
        .then(credentials => {credentials.user.getIdToken().then(result => this.loginUser(result))});
      } else {
        console.log(error);
      }
    })
    //fetch(`${url}/testauth?email=${this.email}&password=${this.password}`)
  }
}
  

//   successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
//     console.log('success!', signInSuccessData);
//     let uid = signInSuccessData.authResult.user?.uid;
//     if (!uid) {
//       return;
//     }
//     console.log(firebase.auth().currentUser?.displayName);
//     const url = "http://127.0.0.1:8000";
//     firebase.auth().currentUser?.getIdToken().then(
//       result => fetch(`${url}/authcheck?=${result}`)
//     ).then (res => res.json()).then (res2 => console.log(res2));
//     this.router.navigate(['/dashboard']);
//   }

//   randomFunction() {
//     firebase.auth().currentUser?.getIdToken().then(
//       result => console.log(result));
//   }
    
//   errorCallback(errorData: FirebaseUISignInFailure) {
//     console.log('error!', errorData);
//   }
    
//   uiShownCallback() {
//     console.log('showing!');
//   }
// }
