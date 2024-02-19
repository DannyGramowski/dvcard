import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  public url: string = "http://34.69.37.0";
  private token: string = "";

  constructor() { }

  setToken(token: string) {
    this.token = token;
  }

  async getDownload(type: string) {
    if (!this.token) { return null; }

    let headers = new Headers();
    headers.set('Id-Token', this.token);
    let blob = await (await fetch(`${this.url}/export?ftype=${type}`, {headers: headers})).blob();
    if (!blob) {
      return null;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IDEA-Card-${type}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return null;
  }

  downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
  }
}
