import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header/header.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url: string;
  urlSocket: string;
  token: string;

  constructor(
    private headers: HeaderService,
    private http: HttpClient
    ) {
    this.url = atob(environment.serviceUrl);
    this.urlSocket = atob(environment.serviceUrlSocketIO);
  }

  getfilterorders(filter: any) {
    this.readToken();
    return this.headers.patch(this.token, `${this.url}/orders/filter`, filter);
  }

  getordersresult(order:any, area:any) {
    this.readToken();
    return this.headers.get(this.token, `${this.url}/orders/results/order/${order}/${area}`);
  }

  getOrderHeader(filter: any) {
    this.readToken();
    return this.headers.post(this.token, `${sessionStorage.getItem('ServiciosLISUrl')}/api/reports/orderheader`, filter);
  }

  printreport(filter: any) {
    this.readToken();
    return this.headers.post(this.token, `${sessionStorage.getItem('ServiciosLISUrl')}/api/reports/printingreport`, filter);
  }

  getUserValidate(order: any) {
    this.readToken();
    return this.headers.get(this.token, `${sessionStorage.getItem('ServiciosLISUrl')}/api/orders/getUserValidate/idOrder/${order}`);
  }

  mergepdf(json: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.urlSocket}/api/mergepdf`, json, {headers});
  }

  changeStateTest(filter: any) {
    this.readToken();
    return this.headers.post(this.token, `${sessionStorage.getItem('ServiciosLISUrl')}/api/reports/changestatetest`, filter);
  }

  getOrderPreliminaryend(filter: any) {
    this.readToken();
    return this.headers.post(this.token, `${sessionStorage.getItem('ServiciosLISUrl')}/api/reports/finalReport`, filter);
  }

  getResultsHistory(filter: any) {
    this.readToken();
    return this.headers.patch(this.token, `${this.url}/orders/results/history`, filter);
  }

  readToken() {
    const user = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    if(user !== undefined && user !== null) {
      if(user.authToken !== null || user.authToken !== undefined || user.authToken !== '') {
        this.token = user.authToken;
      }
    }
  }

}
