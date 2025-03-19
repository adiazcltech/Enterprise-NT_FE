import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  url: string;
  urlReports: string;
  token: string;
  autoToken: string;

  constructor(
    private http: HttpClient,
    private headers: HeaderService
    ) {
    this.url = atob(environment.serviceUrl);
    this.urlReports = atob(environment.urlReports);
  }

  getConfiguration(token:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token
    });
    return this.http.get(`${this.url}/configuration/encrypted`, { headers });
  }

  getDocumentype() {
    this.readAutoToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.autoToken
    });
    return this.http.get(`${this.url}/configuration/documenttypes`, { headers });
  }

  getwebquery() {
    this.readAutoToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.autoToken
    });
    return this.http.get(`${this.url}/demographic/webquery`, { headers });
  }

  getDemographicsKey(url:any, key:any) {
    this.readToken();
    return this.headers.get(this.token, `${url}/api/configuration/${key}`);
  }

  getDemographicsAll(url:any) {
    this.readToken();
    return this.headers.get(this.token, `${url}/api/demographics/all`);
  }

  getAreasActive(url:any) {
    this.readToken();
    return this.headers.get(this.token, `${url}/api/areas/filter/state/true`);
  }

  getListIdiome(parameters: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http.post(`${this.urlReports}/api/getlistidiome`, parameters, {headers});
  }

  getlistReportFile(parameters: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http.post(`${this.urlReports}/api/getlistReportFile`, parameters, {headers});
  }

  updateConfiguration(datakey: any) {
    this.readToken();
    return this.headers.put(this.token, `${ this.url}/configuration`, datakey);
  }

  getsensitive(order:any, test:any) {
    this.readToken();
    let serviceUrl = sessionStorage.getItem('ServiciosLISUrl') + '/api'
    return this.headers.get(this.token, `${serviceUrl}/microbiology/microbialdetection/order/${order}/test/${test}`);
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
