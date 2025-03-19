import { TestBed } from '@angular/core/testing';

import { DemographicsService } from './demographics.service';

describe('DemographicsService', () => {
  let service: DemographicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemographicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
