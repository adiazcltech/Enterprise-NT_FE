import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class WorksheetService {

  url: string = environment.url;

  constructor(private headers: HeadersService) { }

  getWorkSheet( token: string ) {
    return this.headers.getToken(`${this.url}/api/worksheets`, token);
  }
}
