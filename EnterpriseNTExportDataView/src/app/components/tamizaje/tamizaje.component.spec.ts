import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamizajeComponent } from './tamizaje.component';

describe('TamizajeComponent', () => {
  let component: TamizajeComponent;
  let fixture: ComponentFixture<TamizajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamizajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TamizajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
