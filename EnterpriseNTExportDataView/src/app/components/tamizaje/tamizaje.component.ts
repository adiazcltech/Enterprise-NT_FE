import { Component, ChangeDetectorRef } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tamizaje',
  templateUrl: './tamizaje.component.html',
  styleUrls: ['./tamizaje.component.css']
})
export class TamizajeComponent {
  initDate: NgbDateStruct;
  endDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(private cdr: ChangeDetectorRef) {
    const today = new Date();
    this.initDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.endDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.maxDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  changeInit(newValue: NgbDateStruct): void {
    console.log('Fecha inicial seleccionada:', newValue);
  }

  changeEnd(newValue: NgbDateStruct): void {
    console.log('Fecha final seleccionada:', newValue);
  }

  exportDates(): void {
    console.log('Fechas seleccionadas:');
    console.log('Fecha inicial:', this.initDate);
    console.log('Fecha final:', this.endDate);
  }
}
