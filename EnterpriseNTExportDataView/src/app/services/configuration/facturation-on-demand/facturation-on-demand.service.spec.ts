import { TestBed } from '@angular/core/testing';

import { FacturationOnDemandService } from './facturation-on-demand.service';

describe('FacturationOnDemandService', () => {
  let service: FacturationOnDemandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturationOnDemandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
