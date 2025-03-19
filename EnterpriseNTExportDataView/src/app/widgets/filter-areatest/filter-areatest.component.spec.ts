import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAreatestComponent } from './filter-areatest.component';

describe('FilterAreatestComponent', () => {
  let component: FilterAreatestComponent;
  let fixture: ComponentFixture<FilterAreatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterAreatestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAreatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
