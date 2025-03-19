import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportExcel(excelData) {
    return new Promise((resolve, reject) => {
      const title = excelData.title;
      const headers = excelData.headers.filter(header => isNaN(header)); // Filtra los números de las cabeceras
      const data = excelData.data;

      if (data.length === 0) {
        reject('No data to export');
        return;
      }

      // Transformar los datos a objetos clave-valor
      const formattedData = data.map(row => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] !== undefined ? row[index] : ''; // Asigna valores según el índice del array de datos
        });
        return rowData;
      });

      // Crear una nueva hoja de trabajo
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });

      // Crear un nuevo libro de trabajo
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Generar el archivo Excel
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Guardar el archivo
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${title}.xlsx`);
      resolve(true);
    });
  }
}
