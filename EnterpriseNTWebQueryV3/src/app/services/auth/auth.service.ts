import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = atob(environment.serviceUrl);
  }

  autoLogin() {
    const authData = {
      user: "lismanager",
      password: "cltechmanager",
      type: 4,
      historyType: 0
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.url}/authentication/web`, authData, { headers }).pipe(map((resp: any) => {
      this.saveAutoToken(resp);
      return resp;
    }));
  }

  login(user: any) {
    const authData = {
      ...user
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.url}/authentication/web`, authData, { headers }).pipe(map((resp: any) => {
      this.saveToken(resp);
      return resp;
    }));
  }

  saveToken(data:any) {
    sessionStorage.setItem('Enterprise_NT.authorizationData', JSON.stringify({
      authToken: data.token,
      userName: data.user.userName,
      id: data.user.id,
      photo: data.user.photo,
      confidential: data.user.confidential,
      type: data.user.type,
      administrator: data.user.administrator
    }));
    sessionStorage.setItem('lang', 'es');
  }

  saveAutoToken(data:any) {
    sessionStorage.setItem('auto', JSON.stringify({
      authToken: data.token
    }));
  }

  get isLoggedIn(): boolean {
    const token = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    if(token !== undefined && token !== null) {
      if(token.authToken !== null || token.authToken !== undefined || token.authToken !== '') {
        return true;
      }
    }
    return false;
  }

}
