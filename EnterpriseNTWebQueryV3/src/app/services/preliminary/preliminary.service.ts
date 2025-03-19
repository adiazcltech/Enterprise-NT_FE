import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreliminaryService {

  private open = new Subject<any>();
  open$ = this.open.asObservable();

  constructor() { }

  openReport(data: any) {
    this.open.next(data);
  }
}
