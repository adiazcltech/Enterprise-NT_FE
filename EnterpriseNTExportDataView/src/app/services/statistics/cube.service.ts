import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../headers.service';

@Injectable({
  providedIn: 'root'
})
export class CubeService {
  urlQueries: string = environment.urlQueries;

  constructor(private headers: HeadersService) { }
  // obtener token de usuario
  

  execute( data:any , token:string) {
    return this.headers.patch(token, `${this.urlQueries}/api/cube/execute`, {...data});
  }

  insert( data:any ) {
    return this.headers.post('', `${this.urlQueries}/api/cube`, {...data});
  }

  get() {
    return this.headers.get(`${this.urlQueries}/api/cube`);
  }

  delete(id:any) {
    return this.headers.delete(`${this.urlQueries}/api/cube/${id}`);
  }

}
