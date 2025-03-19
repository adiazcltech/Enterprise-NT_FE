import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportzipComponent } from './reportzip.component';

describe('ReportzipComponent', () => {
  let component: ReportzipComponent;
  let fixture: ComponentFixture<ReportzipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportzipComponent]
    });
    fixture = TestBed.createComponent(ReportzipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
