import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class DemographicsService {

  urlQueries: string = environment.urlQueries;
  url: string = environment.url;

  constructor(private headers: HeadersService) { }

  getByState( state:number ) {
    return this.headers.get(`${this.urlQueries}/api/demographics/state/${state}`);
  }

  getListCube() {
    return this.headers.get(`${this.urlQueries}/api/demographics/cube`);
  }

  getDemographicsALL(token:string) {
    return this.headers.getToken(`${this.url}/api/demographics/all`, token);
  }

  getDemographicstrue(token:string) {
    return this.headers.getToken(`${this.url}/api/demographics/filter/state/true`, token);
  }
}
