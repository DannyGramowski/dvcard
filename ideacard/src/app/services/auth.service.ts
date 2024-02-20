import { Injectable } from '@angular/core';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import environment from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = "http://127.0.0.1:8000";

  private token: string | undefined | null;
  private profile: Profile = {name: '', exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};

  constructor(
    //private http: HttpClient
  ) { }

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
    if (! this.token) {
      return this.profile;
    }
    if (this.profile.exists != true) {
      let headers = new Headers();
      headers.set('Id-Token', this.token);
      console.log(this.token);
      //this.profile = await lastValueFrom(this.http.get<Profile>(`${this.url}/profile`, {headers: headers}));
      this.profile = await (await fetch(`${this.url}/profile`, {headers: headers})).json();
      console.log('getProfile')
      console.log(this.profile);
      this.profile.exists = true;
    }
    return this.profile;
  }

  getProfileSync() {
    console.log('getprofile sync')
    console.log(this.profile)
    return this.profile.exists ? this.profile : null;
  }
  
}
