import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  private error = new BehaviorSubject<any>([]);

  error$ = this.error.asObservable();

  constructor() { }

  errorHandler(error: HttpErrorResponse) {
    throw throwError(error || 'Server Error');
  }

  hasError(data: boolean, mgsError: string, urlError: any) {
    const errorData = {
      error: data,
      message: mgsError,
      url: urlError
    };
    this.error.next(errorData);
  }
}
