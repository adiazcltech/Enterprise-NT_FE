import { TestBed } from '@angular/core/testing';

import { DemographicItemService } from './demographic-item.service';

describe('DemographicItemService', () => {
  let service: DemographicItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemographicItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
