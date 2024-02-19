import { Component } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { FirebaseModule } from '../firebase/firebase.module';
import { firebase } from 'firebaseui-angular';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FirebaseModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: ApiService
  ) {};

  ngOnInit(): void {
    //this.authService.getProfile();
  }

  loginUser(authToken: string) : void{
    const url = this.api.url;
    console.log(authToken);
    let headers = new Headers();
    headers.set('Id-Token', authToken);
    fetch(`${url}/login`, {headers: headers})
  }

  submit() {
    let email:string = (<HTMLInputElement>document.getElementById("emailInput"))?.value
    let password:string = (<HTMLInputElement>document.getElementById("passwordInput"))?.value
    const auth = getAuth()

    signInWithEmailAndPassword(auth, email, password)
    .then(credentials => {credentials.user.getIdToken()
      .then(result => {
        this.loginUser(result)
        this.router.navigateByUrl('dashboard')
      })
    })
    .catch(error => {
        console.log(error);
    })
    //fetch(`${url}/testauth?email=${this.email}&password=${this.password}`)
  }

  register() {

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
