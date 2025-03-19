import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }

  get(token: string, url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json'
    });
    return this.http.get(url, { headers });
  }

  post(token: string, url: string, data: any, typeContent?): Observable<any>  {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this.http.post(url, data, {headers, responseType: typeContent});
  }

  patch(token: string, url: string, data: any ): Observable<any>  {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this.http.patch(url, data, {headers});

  }

  put(token: string, url: string, data: any, typeContent? ): Observable<any>  {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this.http.put(url, data, {headers, responseType: typeContent});

  }

  delete(token: string, url: string): Observable<any>  {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this.http.delete(url, {headers});

  }
}
