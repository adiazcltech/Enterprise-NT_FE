import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  url: string = environment.url;

  constructor(private headers: HeadersService) { }
  
  getList(token:string, id) {
    return this.headers.getToken(`${this.url}/api/lists/${id}`, token);
  }
}
