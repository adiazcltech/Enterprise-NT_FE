import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';

@Injectable({
  providedIn: 'root'
})
export class UsertypeService {

  url: string;
  token: string;
  autoToken: string;

  constructor(private http: HttpClient, private headers: HeaderService) {
    this.url = atob(environment.serviceUrl);
  }

  getUserType() {
    this.readAutoToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.autoToken
    });
    return this.http.get(`${this.url}/usertypes`, { headers });
  }

  updateusertype(datakey: any) {
    this.readToken();
    return this.headers.put(this.token, `${ this.url}/usertypes`, datakey);
  }

  readToken() {
    const user = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    if(user !== undefined && user !== null) {
      if(user.authToken !== null || user.authToken !== undefined || user.authToken !== '') {
        this.token = user.authToken;
      }
    }
  }

  readAutoToken() {
    const user = JSON.parse(sessionStorage.getItem('auto'));
    if(user !== undefined && user !== null) {
      if(user.authToken !== null || user.authToken !== undefined || user.authToken !== '') {
        this.autoToken = user.authToken;
      }
    }
  }
}
