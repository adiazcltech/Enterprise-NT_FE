import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string;

  constructor(
    private http: HttpClient,
    private headers: HeaderService
    ) {
    this.url = atob(environment.serviceUrl);
  }

  passwordRecovery(user: any, type: any, historyNumber: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http.get(`${this.url}/authentication/passwordrecovery/${user}/${type}/${historyNumber}`, { headers });
  }

  passwordRecoveryEmail(token: any, detail: any) {
    return this.headers.post(token, `${ this.url}/authentication/email`, detail, 'text');
  }

  passwordReset(token: any, password: any) {
    return this.headers.put(token, `${ this.url}/authentication/passwordreset`, password);
  }

  changePasswordExpirit(password: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http.put(`${this.url}/authentication/updatepassword`, password, { headers });
  }

}
