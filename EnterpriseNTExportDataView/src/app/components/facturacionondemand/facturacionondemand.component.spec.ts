import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionOndemandComponent } from './facturacionondemand.component';

describe('FacturacioOndemandComponent', () => {
  let component: FacturacionOndemandComponent;
  let fixture: ComponentFixture<FacturacionOndemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturacionOndemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionOndemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
