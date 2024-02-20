import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ApiService } from '../services/api.service';
//import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  url:string;

  constructor(private router: Router, private api: ApiService) { this.url = api.url; }

  register() {
    let name:string = (<HTMLInputElement>document.getElementById("nameInput"))?.value
    let email:string = (<HTMLInputElement>document.getElementById("emailInput"))?.value
    let password:string = (<HTMLInputElement>document.getElementById("passwordInput"))?.value
    let reenterpassword:string = (<HTMLInputElement>document.getElementById("reenterPasswordInput"))?.value
    let country:string = (<HTMLInputElement>document.getElementById("countryInput"))?.value
    let selection = <HTMLSelectElement>document.getElementById("languageSelector")
    let language:string = selection.options[selection.selectedIndex]?.value
    const auth = getAuth()

    if(password !== reenterpassword) {
      //openSnackBar()
      console.log("passwords not equal");
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(credentials => {
      credentials.user.getIdToken()
      .then(result => {
        let headers = new Headers();
        console.log(result)
        headers.set('Id-Token', result)
        headers.set("Content-Type", 'application/json')
        fetch(`${this.url}/login`, {headers: headers})
        .then( () => {
          fetch(`${this.url}/user`, 
            {method: 'PUT', headers: headers, 
              body: JSON.stringify({
                name: name,
                location: country,
                language: language
              })
            }
          ).then(() => {this.router.navigateByUrl('dashboard')})
        })
      })
    })
    .catch(error => console.log(error));
    //fetch(`${url}/testauth?email=${this.email}&password=${this.password}`)
    
  }
}
