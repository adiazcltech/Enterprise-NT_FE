import { TestBed } from '@angular/core/testing';

import { ReportzipService } from './reportzip.service';

describe('ReportzipService', () => {
  let service: ReportzipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportzipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
