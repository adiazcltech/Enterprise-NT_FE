import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FacturationOnDemandService } from 'src/app/services/configuration/facturation-on-demand/facturation-on-demand.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-facturacionondemand',
  templateUrl: './facturacionondemand.component.html',
  styleUrls: ['./facturacionondemand.component.css']
})
export class FacturacionOndemandComponent implements OnInit {
  facturacionForm: FormGroup;
  data: {
    Tipo: string;
    Results: any[];
  };
  listProcessFactura: any[] = []; // Almacena las facturas seleccionadas del hijo

  constructor(
    private fb: FormBuilder,
    private FacturationOnDemandService: FacturationOnDemandService,

  ) { }

  ngOnInit(): void {
    this.facturacionForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      cod: [''],
      tipo: ['']
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const filtros = this.facturacionForm.value;
    //validar que ninfuno de los campos este vacio
    if (filtros.fechaInicio === '' || filtros.fechaFin === '' || filtros.tipo === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes llenar todos los campos',
      });
      return;
    }

    //llamar al servicio para obtener la informacion
    console.log(filtros);
    this.FacturationOnDemandService.getFacturationSiga(filtros).subscribe((resp: any) => {
      // asignar la respuesta a una variable para luego pasarla al componente de la tabla
      console.log(resp);
      this.data = resp;
    }, (error) => {
      console.log(error);
    }

    );
    this.listProcessFactura = []; // Limpiar las facturas seleccionadas al cambiar de datos
  }

  onFacturasSelected(facturas: any[]): void {
    this.listProcessFactura = facturas; // Almacenar las facturas seleccionadas
  }

  sendExternalFacturation(): void {
    if (this.listProcessFactura.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay datos para enviar',
      });
      return;
    }
    this.FacturationOnDemandService.sendExternalFacturation(this.listProcessFactura).subscribe((resp: any) => {
      console.log(resp);
      // recorrer la respuesta y asociar facturainterna con facturaexterna la respuesta me tre el facturaInterna y el facturaExterna
      // si la facturaInterna es igual a la factura interna de la tabla entonces asignar el valor de facturaExterna a la tabla
      this.data.Results.forEach((factura: any) => {
        const facturaExterna = resp.find((facturaResp: any) => facturaResp.facturaInterna === factura.IdFacturaInterna);
        if (facturaExterna) {
          factura.IdFacturaExterna = facturaExterna.id;
        }
      });
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Datos enviados correctamente',
      });
    }, (error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al enviar los datos',
      });
    })

  }

  exportToExcel(): void {
    if (!this.data || !this.data.Results || this.data.Results.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay datos para exportar',
      });
      return;
    }

    // Preparar datos para exportar
    const formattedData = this.data.Results.map((factura: any) => {
      // Concatenar los detalles de los exámenes en una sola celda
      const examDetails = factura.Examen.map((examen: any) => {
        return `CodExamen: ${examen.CodExamen}, NomExamen: ${examen.NomExamen || 'N/A'}, PrecioExamen: ${examen.PrecioExamen}`;
      }).join('\n----------\n');

      const formattedFactura: any = {
        "Id factura externa": factura.IdFacturaExterna,
        "Orden": factura.CodOrden,
        "Nombre": factura.Nombre,
        "Fecha Ingreso": factura.FechaIngreso,
        "Tipo Documento": factura.TipoDoc,
        "N Documento": factura.DiPaciente || factura.Nit || 'N/A',
        "Valor Total": factura.ValorTotal,
        "Saldo": factura.Saldo,
        "Fecha vencimiento": factura.Fvencimiento || 'N/A',
        "Descuento Valor": factura.DescuentoValor,
        "Descuento Porcentaje": factura.DescuentoPorcent,
        "Examen": examDetails,  // Colocar los detalles concatenados en una sola celda

      };

      switch (this.data.Tipo) {

        case 'P':
          formattedFactura["Codigo Paciente"] = factura.CodPaciente;
          formattedFactura["Sede"] = factura.Sede;
          formattedFactura["Ciudad"] = factura.Ciudad || 'N/A';
          formattedFactura["Telefono"] = factura.Telefono || 'N/A';
          formattedFactura["Email"] = factura.Email;
          formattedFactura["Direccion"] = factura.Direccion;
          formattedFactura["Apellido"] = factura.Apellido;
        case 'C':

          formattedFactura["Plazo"] = factura.Plazo;
          formattedFactura["Copago"] = factura.Copago;

      }


      return formattedFactura;
    });

    // Logic to export formattedData to Excel goes here


    // Convertir los datos formateados en una hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    // Crear un nuevo libro de trabajo y agregar la hoja
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturacion');

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'facturacion.xlsx');
  }


}
