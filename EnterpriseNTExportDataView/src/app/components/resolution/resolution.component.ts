import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { BillingService } from 'src/app/services/billing.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DemographicsService } from 'src/app/services/configuration/demographics/demographics.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-resolution',
  templateUrl: './resolution.component.html',
  styleUrls: ['./resolution.component.css']
})
export class ResolutionComponent implements OnInit {

  info:string;
  title = 'Resolución';
  active = 1;
  initDate: NgbDateStruct;
  endDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  initOrder: String;
  endOrder: String;
  date: { year: number, month: number, day: number };
  customer: string = environment.customer;
  dataForExcel = [];
  headersForExcel = [];
  profiles = true;
  progress = 0;
  dates = [];
  countdate = 0;
  dataInitial = [];
  demosmask = "-110"
  allDemographicsOrder = [];
  allDemographicsHistory = [];
  listTests = [];
  demographics = [];
  token: string;
  jsonAuth: any
  listDemos =  [
    { id: -99, name: 'Orden' },
    { id: -121, name: 'Tipo de documento' },
    { id: -100, name: 'Historia' },
    { id: -103, name: 'Primer nombre' },
    { id: -109, name: 'Segundo nombre' },
    { id: -101, name: 'Primer apellido' },
    { id: -102, name: 'Segundo apellido' },
    { id: -108, name: 'Código' + " " + 'Sexo' },
    { id: -104, name: 'Sexo' },
    { id: -110, name: 'Edad' },
    { id: -107, name: 'Unidad' + " " + 'Edad' },
    { id: -112, name: 'Dirección' },
    { id: -106, name: 'Correo' },
    { id: -105, name: 'Fecha de nacimiento' },
    { id: -111, name: 'Teléfono' },
    { id: -80, name: 'Estado' + " " + 'Orden' },
    { id: -70, name: 'Código' + " " + 'Area' },
    { id: -71, name: 'Area' },
    { id: -60, name: 'Código' + " " + 'Tarifa' },
    { id: -61, name: 'Tarifa' },
    { id: -62, name: 'Precio empresa' },
    { id: -20, name: 'Código' + " " + 'Prueba' },
    { id: -21, name: 'Fecha de ingreso del exámen' },
    { id: -22, name: 'Hora de ingreso del exámen' },
    { id: -23, name: 'Prueba' },
    { id: -2, name: 'Médico' },
    { id: -24, name: 'Estado de la prueba' },
    { id: -25, name: 'Resultado' },
    { id: -26, name: 'Comentario' },
    { id: -27, name: 'Código central' },
    { id: -28, name: 'Fecha' + " " + 'Validación' },
    { id: -29, name: 'Hora' + " " + 'Validación' },
    { id: -30, name: 'Fecha' + " " + 'Resultado' },
    { id: -31, name: 'Hora' + " " + 'Resultado' },
    { id: -50, name: 'Fecha de verificación' },
    { id: -40, name: 'Usuario que validó' }
  ];

  constructor(
    private calendar: NgbCalendar,
    public ete: ExportExcelService,
    public billingService: BillingService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private route: ActivatedRoute,
    private demographicDS: DemographicsService,
    private authDS: AuthService
  ) {
    this.titleService.setTitle('Resolución');
    const today = new Date();
    this.initDate = { 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }
    this.endDate = { 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }
    this.maxDate = {'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate()};
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.info = params['id'];
    });
    this.login();
  }

  login() {
    const auth = atob(this.info);
    this.jsonAuth = JSON.parse(auth);
    if(auth) {
      this.token = this.jsonAuth.authToken;
      this.getDemographics();
    } else {
      this.token = null;
    }
    // if (auth) {
    //   this.jsonAuth = JSON.parse(auth);
    //   this.authDS.auth(this.jsonAuth).subscribe((resp: any) => {
    //     if (resp.success) {
    //       this.token = resp.token;
    //       this.getDemographics();
    //     } else {
    //       this.token = null;
    //     }
    //   }, error => {
    //     this.generateMessage('Error!', 'error', 'Autenticación fallida');
    //   });
    // }
  }

  getDemographics() {
    this.demographicDS.getDemographicsALL(this.token).subscribe((resp: any) => {
      this.allDemographicsOrder = resp.filter( (o:any) => o.origin === 'O');
      this.allDemographicsHistory = resp.filter( (o:any) => o.origin === 'H');
    }, error => {
      this.generateMessage('Error!', 'error', 'Error obteniendo los demográficos');
    });
  }

  selectDemo(demo:any, event:any) {
    if(demo) {
      const index = this.listDemos.findIndex( d => d.id === demo.id);
      if(index !== -1 && !event.target.checked) {
        this.listDemos.splice(index, 1);
      } else if(index === -1 && event.target.checked) {
        this.listDemos.push({
          id: demo.id,
          name: demo.name
        })
      }
    }
  }

  generateFileDates() {
    const now = new Date();
    if (this.initDate && this.endDate) {
      let startDate = this.initDate.year + '-' + (this.initDate.month < 10 ? '0' + this.initDate.month : this.initDate.month) + '-' +
        (this.initDate.day < 10 ? '0' + this.initDate.day : this.initDate.day);
      let endDate = this.endDate.year + '-' + (this.endDate.month < 10 ? '0' + this.endDate.month : this.endDate.month) + '-' +
        (this.endDate.day < 10 ? '0' + this.endDate.day : this.endDate.day);

      let dateLimit = now.getFullYear() + '-' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '-' +
        (now.getDate() + 1 < 10 ? '0' + now.getDate() + 1 : now.getDate() + 1);

      if (startDate !== null && endDate !== null && startDate <= endDate) {
        if (startDate >= dateLimit) {
          this.generateMessage('Error!', 'error', 'La fecha inicial no puede ser mayor a la fecha actual');
        } else if (endDate >= dateLimit) {
          this.generateMessage('Error!', 'error', 'La fecha final no puede ser mayor a la fecha actual');
        } else {
          this.getResolution();
        }
      } else {
        this.generateMessage('Error!', 'error', 'La fecha final no puede ser mayor a la fecha inicial');
      }
    } else {
      this.generateMessage('Error!', 'error', 'Por favor seleccione una fecha inicial y una fecha final');
    }
  }

  getAreaTestFilter(jsonFinal:any) {
    this.listTests = jsonFinal.finalTests;
  }

  getDemographicsFilter(jsonFinal:any) {
    this.demographics = jsonFinal.demographics;
  }

  buildExcel() {
    if (this.customer === '2') {
      this.aida();
    }

    if (this.customer === '3') {
      this.mesa();
    }
    if (this.customer === '4') {
      this.homelab();
    }
  }

  aida() {

    this.headersForExcel = this.listDemos.map( d => d.name );

    if (this.dataInitial.length > 0) {
      this.dataInitial.sort(function(a, b) {
        return a.order - b.order;
      });
      this.dataInitial.forEach(order => {
        order.tests.forEach((test:any) => {
          let row = [];
          this.listDemos.forEach((o) => {
            let valueColumn = '';
            if(+o.id < 0) {
              switch (o.id) {
                case -99:
                  valueColumn = order.order;
                  break;
                case -120:
                  valueColumn = order.documentType.id;
                  break;
                case -121:
                  valueColumn = order.documentType.abbr;
                  break;
                case -100:
                  valueColumn = order.patientId;
                  break;
                case -103:
                  valueColumn = order.name1;
                  break;
                case -109:
                  valueColumn = order.name2;
                  break;
                case -101:
                  valueColumn = order.lastName;
                  break;
                case -102:
                  valueColumn = order.surName;
                  break;
                case -108:
                  valueColumn = order.sex.code;
                  break;
                case -104:
                  valueColumn = order.sex.esCo;
                  break;
                case -110:
                  valueColumn = order.age;
                  break;
                case -107:
                  valueColumn = order.unityYears;
                  break;
                case -112:
                  valueColumn = order.address === null ? '' : order.address;
                  break;
                case -106:
                  valueColumn = order.email === null ? '' : order.email;
                  break;
                case -105:
                  valueColumn = order.birthday;
                  break;
                case -111:
                  valueColumn = order.phone === null ? '' : order.phone;
                  break;
                case -80:
                  valueColumn = order.orderStatus;
                  break;
                case -70:
                  valueColumn = test.codeArea;
                  break;
                case -71:
                  valueColumn = test.nameArea;
                  break;
                case -60:
                  valueColumn = order.rate.code === null ? '' : order.rate.code;
                  break;
                case -61:
                  valueColumn = order.rate.name === null ? '' : order.rate.name;
                  break;
                case -62:
                  valueColumn = test.insurancePrice === null ? '0' : test.insurancePrice;
                  break;
                case -20:
                  valueColumn = test.codeTest;
                  break;
                case -21:
                  valueColumn = test.entryDate;
                  break;
                case -22:
                  valueColumn = test.entryTime;
                  break;
                case -23:
                  valueColumn = test.nameTest;
                  break;
                case -2:
                  valueColumn = order.physician.name;
                  break;
                case -24:
                  valueColumn = test.testStatus;
                  break;
                case -25:
                  valueColumn = test.result;
                  break;
                case -26:
                  valueColumn = test.testComment
                  break;
                case -27:
                  valueColumn = test.cups;
                  break;
                case -28:
                  valueColumn = test.validationDate;
                  break;
                case -29:
                  valueColumn = test.validationTime;
                  break;
                case -30:
                  valueColumn = test.resultDate;
                  break;
                case -31:
                  valueColumn = test.resultTime;
                  break;
                case -50:
                  valueColumn = test.verificationDate;
                  break;
                case -40:
                  valueColumn = test.userValidation;
                  break;
              }
            } else {
              let valueDemo = order.allDemographics.find( (d:any) => d.idDemographic === +o.id);
              if(valueDemo) {
                if(valueDemo.encoded) {
                  valueColumn = valueDemo.codifiedName;
                } else {
                  valueColumn = valueDemo.notCodifiedValue;
                }
              }
            }
            row.push(valueColumn);
          });
          this.dataForExcel.push(row);
        });
      });

      let reportData = {
        title: 'Resolución 4505',
        data: this.dataForExcel,
        headers: this.headersForExcel
      }
      this.ete.exportExcel(reportData).then((resp: any) => {
        this.progress = 0;
        this.countdate = 0;
        this.dataForExcel = [];
        this.headersForExcel = [];
        this.dataInitial = [];
        Swal.close();
      }).catch(err => {
        Swal.close();
        this.progress = 0;
      });
    } else {
      Swal.close();
      this.generateMessage('Advertencia!', 'warning', 'No existen datos para generar el archivo');
      this.progress = 0;
    }
  }

  homelab() {
      this.listDemos.push({ id: -67, name: 'Costo' });
      this.listDemos.push({ id: -63, name: 'Descuento' });
      this.listDemos.push({ id: -64, name: 'Impuesto' });
      this.listDemos.push({ id: -65, name: 'Saldo' });
      this.listDemos.push({ id: -66, name: 'Abonos' });
      this.listDemos.push({ id: -69, name: 'Total' });
      

      this.headersForExcel = this.listDemos.map( d => d.name );
    
  
      if (this.dataInitial.length > 0) {
        this.dataInitial.sort(function(a, b) {
          return a.order - b.order;
        });
        this.dataInitial.forEach(order => {
          order.tests.forEach((test:any) => {
            let row = [];
            this.listDemos.forEach((o) => {
              let valueColumn = '';
              if(+o.id < 0) {
                switch (o.id) {
                  case -99:
                    valueColumn = order.order;
                    break;
                  case -120:
                    valueColumn = order.documentType.id;
                    break;
                  case -121:
                    valueColumn = order.documentType.abbr;
                    break;
                  case -100:
                    valueColumn = order.patientId;
                    break;
                  case -103:
                    valueColumn = order.name1;
                    break;
                  case -109:
                    valueColumn = order.name2;
                    break;
                  case -101:
                    valueColumn = order.lastName;
                    break;
                  case -102:
                    valueColumn = order.surName;
                    break;
                  case -108:
                    valueColumn = order.sex.code;
                    break;
                  case -104:
                    valueColumn = order.sex.esCo;
                    break;
                  case -110:
                    valueColumn = order.age;
                    break;
                  case -107:
                    valueColumn = order.unityYears;
                    break;
                  case -112:
                    valueColumn = order.address === null ? '' : order.address;
                    break;
                  case -106:
                    valueColumn = order.email === null ? '' : order.email;
                    break;
                  case -105:
                    valueColumn = order.birthday;
                    break;
                  case -111:
                    valueColumn = order.phone === null ? '' : order.phone;
                    break;
                  case -80:
                    valueColumn = order.orderStatus;
                    break;
                  case -70:
                    valueColumn = test.codeArea;
                    break;
                  case -71:
                    valueColumn = test.nameArea;
                    break;
                  case -60:
                    valueColumn = order.rate.code === null ? '' : order.rate.code;
                    break;
                  case -61:
                    valueColumn = order.rate.name === null ? '' : order.rate.name;
                    break;
                  case -62:
                    valueColumn = test.insurancePrice === null ? '0' : test.insurancePrice;
                    break;
                  case -20:
                    valueColumn = test.codeTest;
                    break;
                  case -21:
                    valueColumn = test.entryDate;
                    break;
                  case -22:
                    valueColumn = test.entryTime;
                    break;
                  case -23:
                    valueColumn = test.nameTest;
                    break;
                  case -2:
                    valueColumn = order.physician.name;
                    break;
                  case -24:
                    valueColumn = test.testStatus;
                    break;
                  case -25:
                    valueColumn = test.result;
                    break;
                  case -26:
                    valueColumn = test.testComment
                    break;
                  case -27:
                    valueColumn = test.cups;
                    break;
                  case -28:
                    valueColumn = test.validationDate;
                    break;
                  case -29:
                    valueColumn = test.validationTime;
                    break;
                  case -30:
                    valueColumn = test.resultDate;
                    break;
                  case -31:
                    valueColumn = test.resultTime;
                    break;
                  case -50:
                    valueColumn = test.verificationDate;
                    break;
                  case -40:
                    valueColumn = test.userValidation;
                    break;
                  case -67:
                    valueColumn = test.testPrice === null ? '0' : test.testPrice;
                    break;
                  case -63:
                    valueColumn = order.discount === null ? '0' : order.discount;
                    break;
                  case -64:
                    valueColumn = test.testTax === null ? '0' : test.testTax;
                    break;
                  case -65:
                    valueColumn = order.balance === null ? '0' : order.balance;
                    break;
                  case -66:
                    valueColumn = order.payments === null ? '0' : order.payments;
                    break;
                  case -69:
                    valueColumn =(((order.balance?parseInt( order.balance) : 0)  + (order.payments?parseInt(order.payments): 0) + (test.testTax?parseInt(test.testTax): 0)) - (order.discount?parseInt(order.discount): 0)).toString();
                    break;
                }
              } else {
                let valueDemo = order.allDemographics.find( (d:any) => d.idDemographic === +o.id);
                if(valueDemo) {
                  if(valueDemo.encoded) {
                    valueColumn = valueDemo.codifiedName;
                  } else {
                    valueColumn = valueDemo.notCodifiedValue;
                  }
                }
              }
              row.push(valueColumn);
            });
            this.dataForExcel.push(row);
          });
        });
  
        let reportData = {
          title: 'Resolución 4505',
          data: this.dataForExcel,
          headers: this.headersForExcel
        }
        this.ete.exportExcel(reportData).then((resp: any) => {
          this.progress = 0;
          this.countdate = 0;
          this.dataForExcel = [];
          this.headersForExcel = [];
          this.dataInitial = [];
          Swal.close();
        }).catch(err => {
          Swal.close();
          this.progress = 0;
        });
      } else {
        Swal.close();
        this.generateMessage('Advertencia!', 'warning', 'No existen datos para generar el archivo');
        this.progress = 0;
      }
    }

  mesa() {

    this.headersForExcel = [
      'SOLICITUD',
      'FECHA DE INGRESO',
      'SEDE',
      'EMPRESA O SEGURIDAD SOCIAL',
      'TIPO DE DOCUMENTO',
      'N. DE IDENTIFICACION',
      'NOMBRE COMPLETO DEL PACIENTE',
      'SEXO',
      'EDAD',
      'FECHA. DE NACIMIENTO',
      'CUPS',
      'EXAMEN',
      'NOMBRE COMPLETO DEL ANALITO',
      'COD DEL ANALITO',
      'RESULTADO',
      'COMENTARIO',
      'SERVICIO',
      'MEDICO',
      'FECHA DE VALIDACION',
      'CODIGO DEL EXAMEN'
    ];

    if (this.dataInitial.length > 0) {
      this.dataInitial.sort(function(a, b) {
        return a.order - b.order;
      });
      this.dataInitial.forEach(order => {
        order.tests.forEach(test => {
          let testName = test.nameTest;
          let analiteName = '';
          let codeTest = test.codeTest;
          let codeAnalite = '';
          if(test.testType === 0 && test.profile) {
            let profile = order.tests.find( (p:any) => p.idTest === test.profile);
            if(profile) {
              testName = profile.nameTest;
              codeTest = profile.codeTest;
            }
            analiteName = test.nameTest;
            codeAnalite = test.codeTest;
          }
          let row = [
            order.order,
            order.orderCreation,
            order.nameBranch,
            order.account.name,
            order.documentType.name,
            order.patientId,
            `${ order.name1 } ${ order.name2 } ${ order.lastName } ${ order.surName}`,
            order.sex.esCo,
            order.age,
            order.birthday,
            test.cups,
            testName,
            analiteName,
            codeAnalite,
            test.result,
            test.comment,
            order.service.name,
            order.physician.name,
            `${ test.validationDate[0] } ${ test.validationTime }`,
            codeTest
          ];
          this.dataForExcel.push(row);
        });
      });

      let reportData = {
        title: 'Resolución 4505',
        data: this.dataForExcel,
        headers: this.headersForExcel
      }
      this.ete.exportExcel(reportData).then((resp: any) => {
        this.progress = 0;
        this.countdate = 0;
        this.dataForExcel = [];
        this.headersForExcel = [];
        this.dataInitial = [];
        Swal.close();
      }).catch(err => {
        Swal.close();
        this.progress = 0;
      });
    } else {
      Swal.close();
      this.generateMessage('Advertencia!', 'warning', 'No existen datos para generar el archivo');
      this.progress = 0;
    }
  }

  getResolution() {

    Swal.fire({
      icon: 'info',
      text: 'Generando Resolución...',
      allowOutsideClick: () => !Swal.isLoading()
    });

    Swal.showLoading();

    let startDate = this.initDate.year + '-' + (this.initDate.month < 10 ? '0' + this.initDate.month : this.initDate.month) + '-' +
      (this.initDate.day < 10 ? '0' + this.initDate.day : this.initDate.day);

    let endDate = this.endDate.year + '-' + (this.endDate.month < 10 ? '0' + this.endDate.month : this.endDate.month) + '-' +
      (this.endDate.day < 10 ? '0' + this.endDate.day : this.endDate.day);

    this.dates = this.arrayDatesRange(startDate, endDate, 5);

    if (this.dates.length > 0) {
      this.dataForExcel = [];
      this.dataInitial = [];

      this.countdate = 0;
      this.getResolutionByDate(this.dates[this.countdate].start, this.dates[this.countdate].end, startDate, endDate);
    }
  }

  getResolutionByDate(init, end, startDate, endDate) {
    return new Promise(resolve => {
      let dateInitial = init.replace(/-/g, '');
      let dateFinal = end.replace(/-/g, '');

      let body = {
        init: dateInitial,
        end: dateFinal,
        initDate: startDate,
        endDate: endDate,
        listTests: this.listTests,
        demographics: this.demographics,
        profiles: this.profiles,
        authToken: this.token
      };

      this.billingService.getResolution4505(body).subscribe((resp: any) => {
        if (resp !== null) {
          this.dataInitial = this.dataInitial.concat(resp);
          this.countdate = this.countdate + 1;
          if (this.countdate < this.dates.length) {
            this.getResolutionByDate(this.dates[this.countdate].start, this.dates[this.countdate].end, startDate, endDate);
          } else {
            this.buildExcel();
          }
        }
      }, error => {
        Swal.close();
        if(error.error.message) {
          this.generateMessage('Error!', 'error', error.error.message);
        } else {
          this.generateMessage('Error!', 'error', 'Ha ocurrido un error, comuniquese con el administrador');
        }
        this.progress = 0;
      });
    })
  }

  arrayDatesRange(start: any, end: any, days: number) {
    const dates: any[] = [];
    let initDate = moment(start);
    let endDate = moment(end);
    while( initDate <= endDate ) {
      if(initDate.isSame(endDate)) {
        dates.push({
          'start': moment(initDate).format('YYYY-MM-DD'),
          'end': moment(endDate).format('YYYY-MM-DD')
        });
      } else {
        let finalEnd = moment(initDate).add(days, 'days');
        if(finalEnd >= endDate) {
          dates.push({
            'start': moment(initDate).format('YYYY-MM-DD'),
            'end': moment(endDate).format('YYYY-MM-DD')
          });
        } else {
          dates.push({
            'start': moment(initDate).format('YYYY-MM-DD'),
            'end': finalEnd.format('YYYY-MM-DD')
          });
        }
      }
      initDate = moment(initDate).add((days+1), 'days');
    }
    return dates;
  }

  generateMessage(title, type, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }

}
