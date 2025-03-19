import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDemographicComponent } from './filter-demographic.component';

describe('FilterDemographicComponent', () => {
  let component: FilterDemographicComponent;
  let fixture: ComponentFixture<FilterDemographicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDemographicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDemographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
