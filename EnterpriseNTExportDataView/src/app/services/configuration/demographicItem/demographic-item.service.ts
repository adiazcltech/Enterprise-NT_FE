import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../../headers.service';

@Injectable({
  providedIn: 'root'
})
export class DemographicItemService {

  url: string = environment.url;

  constructor(private headers: HeadersService) { }
  
  getDemographicsItemsAll(token:string, system, demographic) {
    if (demographic == -5)  {
      demographic = -166;
    }
    return this.headers.getToken(`${this.url}/api/centralsystems/standardization/demographics/system/${system}/demographic/${demographic}`, token);
  }
}
