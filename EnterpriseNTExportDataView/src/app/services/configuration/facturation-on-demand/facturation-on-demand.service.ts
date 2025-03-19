import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class FacturationOnDemandService {
  urlFacturacion: string = environment.urlFacturacion;

  constructor(private headers: HeadersService) { }
  // obtener token de usuario
  

  getFacturationSiga( data:any ) {
    return this.headers.post('', `${this.urlFacturacion}/facturacion/data`, {...data});
  }


  sendExternalFacturation(data: any) {
    return this.headers.post('', `${this.urlFacturacion}/external-facturacion`, {...data});
  }
}
