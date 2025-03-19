import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-tableondemand',
  templateUrl: './tableondemand.component.html',
  styleUrls: ['./tableondemand.component.css']
})
export class TableondemandComponent implements OnInit, OnChanges {
  @Input() data: { Tipo: string; Results: any[]; };
  @Output() facturasSelected = new EventEmitter<any[]>(); // Salida para emitir las facturas seleccionadas al padre

  facturas: any[] = [];
  expandedRows: Set<number> = new Set<number>();
  listProcessFactura: any[] = [];
  allSelected: boolean = false; // Bandera para controlar la selección total


  constructor() { }

  // Detectar cambios en @Input data
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.facturas = this.data?.Results || [];
      console.log('Data received in child component:', this.data);
      this.listProcessFactura = [];
      this.allSelected = false; // Reiniciar el estado de "seleccionar todas"

    }

  }
  ngOnInit(): void {
    this.facturas = this.data?.Results || [];
    console.log("data", this.data);
  }
  // funcion para formatear la fecha
  formatFecha(fecha: string): string {
    return fecha ? moment(fecha).format('DD/MM/YYYY') : 'N/A';
  }

  // Formatear el valor numérico separando por comas y puntos, manejar valores vacíos
  formatNumber(value: string | number): string {
    if (!value && value !== 0) {
      return 'N/A';
    }

    // Asegurarse de que value es un número, o convertir la cadena a número
    const numValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]+/g, ""));

    // Si no es un número válido
    if (isNaN(numValue)) {
      return 'N/A';
    }

    // Convertir el número a cadena formateada con comas
    return numValue.toLocaleString('en-CO');
  }
  // Función para alternar la expansión de una fila
  toggleExamenes(index: number): void {
    console.log('index', index);
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }



  processFactura(estado: boolean, factura: any) {

    if (estado) {
      this.listProcessFactura.push(factura);
    }
    else {
      this.listProcessFactura = this.listProcessFactura.filter((facturaItem) => facturaItem !== factura);
    }
    console.log('facturas seleccionadas', this.listProcessFactura);
    this.facturasSelected.emit(this.listProcessFactura);
    this.checkAllSelected();

  }


  // Seleccionar o deseleccionar todas las facturas
  processFacturaAll(estado: boolean) {
    this.allSelected = estado;
    if (estado) {
      this.listProcessFactura = [...this.facturas];
    } else {
      this.listProcessFactura = [];
    }
    this.facturasSelected.emit(this.listProcessFactura);
  }

  // Actualiza la bandera `allSelected` si todos los checkboxes individuales están marcados
  checkAllSelected() {
    this.allSelected = this.listProcessFactura.length === this.facturas.length;
  }
}
