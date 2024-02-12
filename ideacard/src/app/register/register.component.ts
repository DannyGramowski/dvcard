import { Component } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  url:string = "http://127.0.0.1:8000";


  loginUser(authToken: string) : void{
    console.log(authToken);
    let headers = new Headers();
    headers.set('Id-Token', authToken);

  }

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
      console.log("passwords not equal");
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(credentials => {
      credentials.user.getIdToken()
      .then(result => {
        this.loginUser(result) 
        let headers = new Headers();
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
          )
        })
      })
    })
    .catch(error => console.log(error));
    //fetch(`${url}/testauth?email=${this.email}&password=${this.password}`)
    
  }
}
