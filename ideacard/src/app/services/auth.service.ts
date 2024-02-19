import { Injectable } from '@angular/core';
import { firebase } from 'firebaseui-angular';
import { Profile } from '../interfaces/profile';
import environment from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string;

  private token: string | undefined | null;
  private profile: Profile = {name: '', exists: null, disabilities: [], testimonials: [], language: '', location: '', uuid: '', publicprofile: false};

  constructor(
    private api: ApiService
    //private http: HttpClient
  ) { this.url = api.url; }

  async getToken() {
    if (! this.token) {
      this.token = await firebase.auth().currentUser?.getIdToken();
    }
    return this.token;
  }

  getTokenSync() {
    return this.token ? this.token : null;
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
      //this.profile = await lastValueFrom(this.http.get<Profile>(`${this.url}/profile`, {headers: headers}));
      this.profile = await (await fetch(`${this.url}/profile`, {headers: headers})).json();
      this.profile.exists = true;
    }
    return this.profile;
  }

  getProfileSync() {
    return this.profile.exists ? this.profile : null;
  }
  
}
