import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableondemandComponent } from './tableondemand.component';

describe('TableondemandComponent', () => {
  let component: TableondemandComponent;
  let fixture: ComponentFixture<TableondemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableondemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableondemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
