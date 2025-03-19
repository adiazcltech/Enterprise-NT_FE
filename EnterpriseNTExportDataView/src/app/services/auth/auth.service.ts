import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../headers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string = environment.url;

  constructor(private headers: HeadersService) { }

  auth(json:any) {
    return this.headers.post('', `${this.url}/api/authentication`, { ...json });
  }
}
