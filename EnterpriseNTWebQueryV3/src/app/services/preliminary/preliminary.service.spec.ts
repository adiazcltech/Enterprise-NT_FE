import { TestBed } from '@angular/core/testing';

import { PreliminaryService } from './preliminary.service';

describe('PreliminaryService', () => {
  let service: PreliminaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreliminaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
