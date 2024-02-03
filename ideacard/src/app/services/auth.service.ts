import { Injectable } from '@angular/core';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = "http://127.0.0.1:8000";

  private token: string | undefined | null;
  private profile: Profile | undefined;

  constructor() { }

  async getToken() {
    if (! this.token) {
      this.token = await firebase.auth().currentUser?.getIdToken();
    }
    return this.token;
  }

  async getProfile() {
    if (! this.token) {
      await this.getToken();
    } 
    this.profile = await (await fetch(`${this.url}/profile`)).json();
    return this.profile;
  }

  
}
