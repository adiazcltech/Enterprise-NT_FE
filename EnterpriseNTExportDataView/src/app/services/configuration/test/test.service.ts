import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  url: string = environment.url;

  constructor(private headers: HeadersService) { }

  getTestArea( token, type, state, area ) {
    return this.headers.getToken(`${this.url}/api/tests/filter/type/${type}/state/${state}/area/${area}`, token);
  }

  getgroups(token:string) {
    return this.headers.getToken(`${this.url}/api/groups/tests`, token);
  }

  getTestConfidential(token:string) {
    return this.headers.getToken(`${this.url}/api/tests/filter/confidentials`, token);
  }
}
