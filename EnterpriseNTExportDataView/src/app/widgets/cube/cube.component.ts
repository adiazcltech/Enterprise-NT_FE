import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DemographicsService } from 'src/app/services/configuration/demographics/demographics.service';
import { CubeService } from 'src/app/services/statistics/cube.service';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit {
  id: string;

  form: FormGroup;
  maxDate: NgbDateStruct;
  dates = [];
  countdate = 0;
  templates = [];
  template = null;
  demosH = [];
  demosO = [];
  demosR = [];
  demosM = [];
  dataInitial = [];
  dataForExcel = [];
  headersForExcel = [];
  selectAllH = false;
  selectAllO = false;
  selectAllR = false;
  selectAllM = false;

  disabledNew = true;
  disabledSave = true;
  disabledDelete = true;
  disabledCancel = true;
  disabledExecute = true;
  filterAreaTest = null;
  filterAreaTestJSON = null;
  filterDemographicsJSON = null;

  get getDemosH() {
    return this.form.get('demosH') as FormArray;
  }

  get getDemosO() {
    return this.form.get('demosO') as FormArray;
  }

  get getDemosR() {
    return this.form.get('demosR') as FormArray;
  }

  get getDemosM() {
    return this.form.get('demosM') as FormArray;
  }
  listDemos = [];
  info: string;
  token: string;
  listTests = [];
  listAreas = [];
  demographics = [];
  typeAreaTest = null;
  jsonFilterAreaTest = null;
  jsonFilterDemographics = null;



  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private DemoDS: DemographicsService,
    private CubeDS: CubeService,
    public ete: ExportExcelService,
    private titleService: Title
  ) {
    this.statusButtons('init');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.initializeComponent();
    }
  }
  initializeComponent() {
    this.info = this.id;
    const auth = atob(this.id);
    this.titleService.setTitle('Cubo Estadístico');
    if (auth) {
      try {
        this.token = JSON.parse(auth).authToken;
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
      this.loadForm();
      this.getTemplates();
    } else {
      this.token = null;
    }
  }
  getTemplates() {
    this.CubeDS.get().subscribe((resp: any) => {
      this.templates = resp;
    }, error => {
      this.generateMessage('Error!', 'error', 'Ha ocurrido un error, comuníquese con el administrador');
    });
  }

  loadForm() {
    const today = new Date();
    this.maxDate = { 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() };
    this.form = this.formBuilder.group({
      name: [''],
      init: [{ 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }, Validators.required],
      end: [{ 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }, Validators.required],
      demosH: this.formBuilder.array([]),
      demosO: this.formBuilder.array([]),
      demosR: this.formBuilder.array([]),
      demosM: this.formBuilder.array([]),
      profiles: [true]
    }, { validators: this.validateDates });

    this.form.get('name').disable();

    const handleDateChange = (init, end, isInitChange) => {
      const now = new Date();
      let nowLimit = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      let startDate = `${init.year}-${init.month.toString().padStart(2, '0')}-${init.day.toString().padStart(2, '0')}`;
      let endDate = `${end.year}-${end.month.toString().padStart(2, '0')}-${end.day.toString().padStart(2, '0')}`;
      let limitDate = isInitChange ? moment(startDate).add(6, 'M').format('YYYY-MM-DD') : moment(endDate).subtract(6, 'M').format('YYYY-MM-DD');

      if (isInitChange) {
        if (startDate > endDate || (limitDate < nowLimit && (endDate > limitDate || endDate < startDate))) {
          this.form.get('end').setValue(this.fromModel(limitDate));
        } else if (limitDate >= nowLimit) {
          this.form.get('end').setValue(this.fromModel(nowLimit));
        }
      } else {
        if (endDate < startDate || limitDate > startDate) {
          this.form.get('init').setValue(this.fromModel(limitDate));
        }
      }
    };

    this.form.get('init').valueChanges.subscribe((data) => {
      handleDateChange(data, this.form.get('end').value, true);
    });

    this.form.get('end').valueChanges.subscribe((data) => {
      handleDateChange(this.form.get('init').value, data, false);
    });

    this.getListDemos();
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split("-");
      return {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10),
      };
    }
    return null;
  }

  validateDates: ValidatorFn = (formG: FormGroup) => {
    let startDate = formG.get('init').value;
    let endDate = formG.get('end').value;
    const now = new Date();
    let dateLimit: string;

    if (startDate && endDate) {
      startDate = startDate.year + '-' + (startDate.month < 10 ? '0' + startDate.month : startDate.month) + '-' +
        (startDate.day < 10 ? '0' + startDate.day : startDate.day);
      endDate = endDate.year + '-' + (endDate.month < 10 ? '0' + endDate.month : endDate.month) + '-' +
        (endDate.day < 10 ? '0' + endDate.day : endDate.day);

      dateLimit = now.getFullYear() + '-' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '-' +
        (now.getDate() + 1 < 10 ? '0' + now.getDate() + 1 : now.getDate() + 1);
    }
    return startDate !== null && endDate !== null && startDate <= endDate ?
      startDate >= dateLimit ? { errorStartDate: true } : endDate >= dateLimit ? { errorEndDate: true } : null : { dates: true };
  }

  getListDemos() {
    this.DemoDS.getListCube().subscribe((resp: any) => {
      this.demosH = resp.demosHAll;
      this.demosO = resp.demosOAll;
      this.demosR = resp.demosRAll;
      this.demosM = resp.demosMAll;
      this.demosH.sort((a, b) => a['name'] > b['name'] ? 1 : -1);
      this.demosO.sort((a, b) => a['name'] > b['name'] ? 1 : -1);
      this.demosR.sort((a, b) => a['name'] > b['name'] ? 1 : -1);
      this.demosM.sort((a, b) => a['name'] > b['name'] ? 1 : -1);
      this.loadDemosH();
      this.loadDemosR();
      this.loadDemosO();
      this.loadDemosM();
    });
  }
  createDemo(demo: any): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(demo.id),
      name: new FormControl(demo.name),
      encoded: new FormControl(demo.encoded),
      isChecked: new FormControl(false)
      //order: new FormControl(demo.order === undefined || demo.order === null ? 100 : demo.order)
    })
  }
  loadDemos(demos: any[], getDemos: any, listDemos: any[]) {
    getDemos.clear();
    demos.forEach(demo => {
      const newDemo = this.createDemo(demo);
      let index = getDemos.length;
      getDemos.push(newDemo);
      newDemo.get('isChecked').valueChanges.subscribe(value => {
        const item = getDemos.at(index);
        if (item) {
          const itemIndex = listDemos.findIndex(i => i.id === item.get('id').value);
          if (itemIndex !== -1 && !value) {
            listDemos.splice(itemIndex, 1);
          } else if (itemIndex === -1 && value) {
            listDemos.push(item.value);
          }
        }
      });
    });
  }

  loadDemosH() {
    this.loadDemos(this.demosH, this.getDemosH, this.listDemos);
  }

  loadDemosO() {
    this.loadDemos(this.demosO, this.getDemosO, this.listDemos);
  }

  loadDemosR() {
    this.loadDemos(this.demosR, this.getDemosR, this.listDemos);
  }

  loadDemosM() {
    this.loadDemos(this.demosM, this.getDemosM, this.listDemos);
  }
  selectAll(type: number, value: any) {
    switch (type) {
      case 1:
        this.getDemosH.controls.forEach(demo => {
          demo.get('isChecked').setValue(value);
        });
        this.selectAllH = value;
        break;
      case 2:
        this.getDemosO.controls.forEach(demo => {
          demo.get('isChecked').setValue(value);
        });
        this.selectAllO = value;
        break;
      case 3:
        this.getDemosR.controls.forEach(demo => {
          demo.get('isChecked').setValue(value);
        });
        this.selectAllR = value;
        break;
      case 4:
        this.getDemosM.controls.forEach(demo => {
          demo.get('isChecked').setValue(value);
        });
        this.selectAllM = value;
        break;
    }
  }

  save() {
    Swal.fire({
      icon: 'info',
      text: 'Generando Archivo Excel...',
      allowOutsideClick: () => !Swal.isLoading()
    });

    Swal.showLoading();

    const demosH = this.getDemosH.controls.filter(control => control.value.isChecked);
    const demosO = this.getDemosO.controls.filter(control => control.value.isChecked);
    const demosR = this.getDemosR.controls.filter(control => control.value.isChecked);
    const demosM = this.getDemosM.controls.filter(control => control.value.isChecked);

    if (demosH.length === 0 && demosO.length === 0 && demosR.length === 0 && demosM.length === 0) {
      this.generateMessage('Advertencia!', 'warning', 'Por favor seleccione mínimo un campo');
      return false;
    }

    const listDemosH = demosH.map(control => control.value.id);
    const listDemosO = demosO.map(control => control.value.id);
    const listDemosR = demosR.map(control => control.value.id);
    const listDemosM = demosM.map(control => control.value.id);
    const ordering = this.listDemos.map(demo => demo.id);

    const init = this.form.value.init;
    const end = this.form.value.end;

    let startDate = init.year + '-' + (init.month < 10 ? '0' + init.month : init.month) + '-' + (init.day < 10 ? '0' + init.day : init.day);
    let endDate = end.year + '-' + (end.month < 10 ? '0' + end.month : end.month) + '-' + (end.day < 10 ? '0' + end.day : end.day);
    let initD = moment(startDate).format('YYYY-MM-DD');
    let endD = moment(endDate).format('YYYY-MM-DD');

    const json = {
      name: this.form.get('name').value,
      idsDemosH: listDemosH.join(),
      idsDemosO: listDemosO.join(),
      idsDemosR: listDemosR.join(),
      idsDemosM: listDemosM.join(),
      init: initD,
      end: endD,
      ordering                : ordering.join(),
      profiles: this.form.get('profiles').value,
      typeAreaTest            : this.typeAreaTest,
      jsonFilterAreaTest      : this.jsonFilterAreaTest === null ? '' : this.jsonFilterAreaTest,
      jsonFilterDemographics  : this.jsonFilterDemographics === null ? '' : this.jsonFilterDemographics
    }

    this.CubeDS.insert(json).subscribe((resp: any) => {
      Swal.close();
      if (resp === 1) {
        this.generateMessage('Proceso Exitoso!', 'success', 'Se guardo la plantilla satisfactoriamente');
        this.cancel();
      }
    }, error => {
      Swal.close();
      this.generateMessage('Error!', 'error', 'Ha ocurrido un error, comuníquese con el administrador');
    });
    this.disabledNew = false
  }

  submit() {

    Swal.fire({
      icon: 'info',
      text: 'Generando Archivo Excel...',
      allowOutsideClick: () => !Swal.isLoading()
    });

    Swal.showLoading();

    const demosH = this.getDemosH.controls.filter(control => control.value.isChecked);
    const demosO = this.getDemosO.controls.filter(control => control.value.isChecked);
    const demosR = this.getDemosR.controls.filter(control => control.value.isChecked);
    const demosM = this.getDemosM.controls.filter(control => control.value.isChecked);

    if (demosH.length === 0 && demosO.length === 0 && demosR.length === 0 && demosM.length === 0) {
      this.generateMessage('Advertencia!', 'warning', 'Por favor seleccione mínimo un campo');
      return false;
    }

    const listDemosH = demosH.map(control => control.value);
    const listDemosO = demosO.map(control => control.value);
    const listDemosR = demosR.map(control => control.value);
    const listDemosM = demosM.map(control => control.value);

    const init = this.form.value.init;
    const end = this.form.value.end;

    let startDate = init.year + '-' + (init.month < 10 ? '0' + init.month : init.month) + '-' + (init.day < 10 ? '0' + init.day : init.day);

    let endDate = end.year + '-' + (end.month < 10 ? '0' + end.month : end.month) + '-' +
      (end.day < 10 ? '0' + end.day : end.day);

    this.dates = this.arrayDatesRange(startDate, endDate, 5);

    const json = {
      listDemosH,
      listDemosO,
      listDemosR,
      listDemosM,
      init: null,
      end: null,
      profiles: this.form.get('profiles').value,
      listTests: this.listTests,
      demographics: this.demographics
    }

    if (this.dates.length > 0) {
      this.dataForExcel = [];
      this.dataInitial = [];
      this.countdate = 0;
      this.getData(this.dates[this.countdate].start, this.dates[this.countdate].end, json);
    }
  }

  getData(init, end, json) {
    return new Promise(resolve => {
      let dateInitial = init.replace(/-/g, '');
      let dateFinal = end.replace(/-/g, '');
      json.init = dateInitial;
      json.end = dateFinal;
      this.CubeDS.execute(json, this.token).subscribe((resp: any) => {
        if (resp !== null) {
          this.dataInitial = this.dataInitial.concat(resp);
          this.countdate = this.countdate + 1;
          if (this.countdate < this.dates.length) {
            this.getData(this.dates[this.countdate].start, this.dates[this.countdate].end, json);
          } else {
            this.buildExcel();
          }
        }
      }, error => {
        Swal.close();
        this.generateMessage('Error!', 'error', 'Ha ocurrido un error, comuníquese con el administrador');
      });
    })
  }

  buildExcel() {
    if (this.dataInitial.length > 0) {
      this.dataInitial.sort((a, b) => {
        return a.orderNumber - b.orderNumber;
      });

      this.headersForExcel = [];

      const demosR = this.getDemosR.controls.filter(control => control.value.isChecked);
      const demosM = this.getDemosM.controls.filter(control => control.value.isChecked);
      this.headersForExcel = this.listDemos.map(d => d.name);

      this.dataInitial.forEach((order: any) => {
        if (demosR.length > 0 || demosM.length > 0) {
          let tests = [];
          let filterTests = order.tests.filter(t => t.idProfile === null);
          filterTests.sort((a, b) => {
            return a.idTest - b.idTest;
          });
          filterTests.forEach((test: any) => {
            tests.push(test);
            const analites = order.tests.filter(t => t.idProfile === test.idTest);
            if (analites) {
              analites.sort((a, b) => {
                return a.orderPrint - b.orderPrint;
              });
              analites.forEach((analite) => {
                tests.push(analite);
              });
            }
          });
          tests.forEach((test: any) => {
            let row = [];
            this.listDemos.forEach((o) => {
              let valueColumn = '';
              if (+o.id < 0) {
                valueColumn = this.getValueRow(o.id, order, test);
              } else {
                valueColumn = this.getValueDemoFixed(o.id, order);
              }
              row.push(valueColumn);
            });
            this.dataForExcel.push(row);
          });
        } else {
          let row = [];
          this.listDemos.forEach((o) => {
            let valueColumn = '';
            if (+o.id < 0) {
              valueColumn = this.getValueRow(o.id, order, null);
            } else {
              valueColumn = this.getValueDemoFixed(o.id, order);
            }
            row.push(valueColumn);
          });
          this.dataForExcel.push(row);
        }
      });
      let reportData = {
        title: 'Reporte',
        data: this.dataForExcel,
        headers: this.headersForExcel
      }
      this.ete.exportExcel(reportData).then((resp: any) => {
        this.countdate = 0;
        this.dataForExcel = [];
        this.headersForExcel = [];
        this.dataInitial = [];
        Swal.close();
      }).catch(err => {
        Swal.close();
      });
    } else {
      Swal.close();
      this.generateMessage('Advertencia!', 'warning', 'No existen datos para generar el archivo');
    }
  }

  getValueDemoFixed(id: number, order: any) {
    let valueColumn = "";
    let findDemo = null;

    if (order.demosOrder) {
      findDemo = order.demosOrder.find((d: any) => d.idDemographic === id);
      if (findDemo) {
        if (findDemo.encoded) {
          valueColumn = findDemo.codifiedName;
        } else {
          valueColumn = findDemo.notCodifiedValue;
        }
      }
    }

    if (!findDemo && order.patient.demosPatient) {
      findDemo = order.patient.demosPatient.find((d: any) => d.idDemographic === id);
      if (findDemo) {
        if (findDemo.encoded) {
          valueColumn = findDemo.codifiedName;
        } else {
          valueColumn = findDemo.notCodifiedValue;
        }
      }
    }

    return valueColumn;
  }

  getValueRow(id: number, order: any, test: any) {
    let valueColumn = "";
    switch (id) {
      case -1:
        valueColumn = order.patient.name1;
        break;
      case -2:
        valueColumn = order.patient.name2;
        break;
      case -3:
        valueColumn = order.patient.lastName;
        break;
      case -4:
        valueColumn = order.patient.surName;
        break;
      case -5:
        valueColumn = order.patient.creationDate;
        break;
      case -6:
        valueColumn = order.patient.updateDate;
        break;
      case -7:
        valueColumn = order.patient.birthday;
        break;
      case -8:
        valueColumn = order.patient.sex;
        break;
      case -9:
        valueColumn = order.patient.patientId;
        break;
      case -10:
        valueColumn = order.patient.patientIdBD;
        break;
      case -11:
        valueColumn = order.patient.userCreation;
        break;
      case -12:
        valueColumn = order.patient.userUpdate;
        break;
      case -13:
        valueColumn = order.patient.email;
        break;
      case -14:
        valueColumn = order.patient.documentType;
        break;
      case -15:
        valueColumn = order.patient.phone;
        break;
      case -16:
        valueColumn = order.patient.address;
        break;
      case -17:
        valueColumn = order.patient.idDocumentType;
        break;
      case -18:
        valueColumn = order.patient.abbrDocumentType;
        break;
      case -19:
        valueColumn = order.patient.age;
        break;
      case -20:
        valueColumn = order.patient.sexCode;
        break;
      case -101:
        valueColumn = order.orderNumber;
        break;
      case -102:
        valueColumn = order.date;
        break;
      case -103:
        valueColumn = order.creationDate;
        break;
      case -104:
        valueColumn = order.updateDate;
        break;
      case -105:
        valueColumn = order.branch;
        break;
      case -106:
        valueColumn = order.client;
        break;
      case -107:
        valueColumn = order.year;
        break;
      case -108:
        valueColumn = order.month;
        break;
      case -109:
        valueColumn = order.day;
        break;
      case -110:
        valueColumn = order.userCreation;
        break;
      case -111:
        valueColumn = order.userUpdate;
        break;
      case -112:
        valueColumn = order.orderType;
        break;
      case -113:
        valueColumn = order.statusOrder;
        break;
      case -114:
        valueColumn = order.orderHis;
        break;
      case -115:
        valueColumn = order.service;
        break;
      case -116:
        valueColumn = order.physician;
        break;
      case -117:
        valueColumn = order.rate;
        break;
      case -118:
        valueColumn = order.entity;
        break;
      case -119:
        valueColumn = order.nit;
        break;

      // DEMOS R
      case -201:
        valueColumn = test.codeTest;
        break;
      case -202:
        valueColumn = test.abbrTest;
        break;
      case -203:
        valueColumn = test.nameTest;
        break;
      case -204:
        valueColumn = test.codeArea;
        break;
      case -205:
        valueColumn = test.nameArea;
        break;
      case -206:
        valueColumn = test.result;
        break;
      case -207:
        valueColumn = test.dateResult;
        break;
      case -208:
        valueColumn = test.userResult;
        break;
      case -209:
        valueColumn = test.dateEntry;
        break;
      case -210:
        valueColumn = test.userEntry;
        break;
      case -213:
        valueColumn = test.statusResult;
        break;
      case -214:
        valueColumn = test.pathology;
        break;
      case -215:
        valueColumn = test.blocking;
        break;
      case -216:
        valueColumn = test.dateBlocking;
        break;
      case -217:
        valueColumn = test.userBlocking;
        break;
      case -218:
        valueColumn = test.codeProfile;
        break;
      case -219:
        valueColumn = test.abbrProfile;
        break;
      case -220:
        valueColumn = test.nameProfile;
        break;
      case -221:
        valueColumn = test.codePackage;
        break;
      case -222:
        valueColumn = test.abbrPackage;
        break;
      case -223:
        valueColumn = test.namePackage;
        break;
      case -224:
        valueColumn = test.cups;
        break;
      case -225:
        valueColumn = test.statusSample;
        break;
      case -226:
        valueColumn = test.dateValidation;
        break;
      case -227:
        valueColumn = test.userValidation;
        break;
      case -228:
        valueColumn = test.datePrevalidation;
        break;
      case -229:
        valueColumn = test.userPrevalidation;
        break;
      case -230:
        valueColumn = test.datePrint;
        break;
      case -231:
        valueColumn = test.userPrint;
        break;
      case -232:
        valueColumn = test.unit;
        break;
      case -233:
        valueColumn = test.method;
        break;
      case -234:
        valueColumn = test.print;
        break;
      case -235:
        valueColumn = test.minimumDelta;
        break;
      case -236:
        valueColumn = test.maximumDelta;
        break;
      case -237:
        valueColumn = test.laboratory;
        break;
      case -238:
        valueColumn = test.minimalPanic;
        break;
      case -239:
        valueColumn = test.maximumPanic;
        break;
      case -240:
        valueColumn = test.minimalNormal;
        break;
      case -241:
        valueColumn = test.maximumNormal;
        break;
      case -242:
        valueColumn = test.minimumReportable;
        break;
      case -243:
        valueColumn = test.maximumReportable;
        break;
      case -244:
        valueColumn = test.typeEntry;
        break;
      case -245:
        valueColumn = test.dateVerification;
        break;
      case -246:
        valueColumn = test.userVerification;
        break;
      case -247:
        valueColumn = test.dateTake;
        break;
      case -248:
        valueColumn = test.userTake;
        break;
      case -249:
        valueColumn = test.sample;
        break;
      case -250:
        valueColumn = test.codeSample;
        break;
      case -251:
        valueColumn = test.subsample;
        break;
      case -252:
        valueColumn = test.codeSubsample;
        break;
      case -253:
        valueColumn = test.anatomicalSite;
        break;
      case -254:
        valueColumn = test.collectionMethod;
        break;
      case -255:
        valueColumn = test.dateRetake;
        break;
      case -256:
        valueColumn = test.userRetake;
        break;
      case -257:
        valueColumn = test.dateRepetition;
        break;
      case -258:
        valueColumn = test.userRepetition;
        break;
      case -259:
        valueColumn = test.dilution;
        break;
      case -260:
        valueColumn = test.remission;
        break;
      case -261:
        valueColumn = test.comment;
        break;
      case -262:
        valueColumn = test.servicePrice;
        break;
      case -263:
        valueColumn = test.patientPrice;
        break;
      case -264:
        valueColumn = test.insurancePrice;
        break;
      case -265:
        valueColumn = test.invoiceClient;
        break;

      // Microbiología
      case -301:
        valueColumn = test.nameMic
        break;
      case -302:
        valueColumn = test.Result
        break;
      case -303:
        valueColumn = test.ABName
        break;
      case -304:
        valueColumn = test.Comment
        break;
      case -305:
        valueColumn = test.recount;
        break;
      case -306:
        valueColumn = test.complement;
        break;
      case -307:
        valueColumn = test.CMI;
        break;
      case -308:
        valueColumn = test.antiotic;
        break;
    }

    return valueColumn;
  }

  arrayDatesRange(start: any, end: any, days: number) {
    const dates: any[] = [];
    let initDate = moment(start);
    let endDate = moment(end);
    while (initDate <= endDate) {
      if (initDate.isSame(endDate)) {
        dates.push({
          'start': moment(initDate).format('YYYY-MM-DD'),
          'end': moment(endDate).format('YYYY-MM-DD')
        });
      } else {
        let finalEnd = moment(initDate).add(days, 'days');
        if (finalEnd >= endDate) {
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
      initDate = moment(initDate).add((days + 1), 'days');
    }
    return dates;
  }

  selectTemplate(template: any) {
    this.newTemplate();
    this.form.get('name').setValue(template.name);
    this.form.get('profiles').setValue(template.profiles === 1 ? true : false);
    template.select = true;
    this.template = template;


  

    const templateIdsH = template.idstemplatesH.split(',').map(Number);
    // Filtramos los controles donde el id esté en el array de templateIds
    const demosHAll = this.getDemosH.controls.filter((control: any) => templateIdsH.includes(control.value.id));
    
    demosHAll.forEach(demo => {
      demo.get('isChecked').setValue(true);
    });

    const templateIdsO = template.idstemplatesO.split(',').map(Number);
    const demosOAll = this.getDemosO.controls.filter((control: any) => templateIdsO.includes(control.value.id));
    demosOAll.forEach(demo => {
      demo.get('isChecked').setValue(true);
    });

    const templateIdsR = template.idstemplatesR.split(',').map(Number);
    const demosRAll = this.getDemosR.controls.filter((control: any) => templateIdsR.includes(control.value.id));
    demosRAll.forEach(demo => {
      demo.get('isChecked').setValue(true);
    });

    const demosMAll = this.getDemosM.controls.filter((control: any) => template.idstemplatesM.includes(control.value.id));
    demosMAll.forEach(demo => {
      demo.get('isChecked').setValue(true);
    });

    const init = moment(template.init.split("T")[0]).format('YYYY-MM-DD');
    const end = moment(template.end.split("T")[0]).format('YYYY-MM-DD');
    this.form.get('init').setValue(this.fromModel(init));
    this.form.get('end').setValue(this.fromModel(end));
    
 //Ordenamiento
 const idsOrdering = template.ordering.split(',').map(id => parseInt(id));
 this.listDemos.sort((a, b) => {
   const idA = idsOrdering.indexOf(a.id);
   const idB = idsOrdering.indexOf(b.id);
   return idA - idB;
 });

 //Filtros
 this.filterAreaTest = template.typeAreaTest;
 console.log(template.jsonFilterAreaTest);
 this.filterAreaTestJSON = JSON.parse(template.jsonFilterAreaTest);
 this.filterDemographicsJSON = JSON.parse(template.jsonFilterDemographics);

    this.statusButtons('select');
  }

  cancel() {
    this.form.get('name').disable();
    this.form.get('name').setValidators([]);
    this.form.get('profiles').setValue(true);
    this.filterAreaTest = null;
    this.filterAreaTestJSON = null;
    this.filterDemographicsJSON = null;
    this.statusButtons('init');
    this.clearForm();
    this.getTemplates();
  }

  newTemplate() {
    this.form.get('name').enable();
    this.form.get('name').setValidators(Validators.required);
    this.statusButtons('new');
    this.clearForm();
  }

  clearForm() {
    this.form.get('name').setValue('');
    this.selectAll(1, false);
    this.selectAll(2, false);
    this.selectAll(3, false);
    this.selectAll(4, false);
    this.template = null;
    if (this.templates.length > 0) {
      this.templates.forEach(template => {
        template.select = false;
      });
    }
  }

  async deleteTemplate() {
    if (this.template && this.template.id) {
      const resp = await Swal.fire({
        title: '¿Está seguro?',
        text: '¿Esta seguro de eliminar la plantilla?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      });

      if (resp.isConfirmed) {
        this.CubeDS.delete(this.template.id).subscribe((data: any) => {
          if (data === 1) {
            this.generateMessage('Proceso Exitoso!', 'success', 'Se elimino la plantilla satisfactoriamente');
            this.cancel();
          }
        }, error => {
          this.generateMessage('Error!', 'error', 'Ha ocurrido un error, comuníquese con el administrador');
        });
      }
    }
  }


  generateMessage(title, type, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }

  statusButtons(type: string) {
    switch (type) {
      case 'init':
        this.disabledNew = false;
        this.disabledSave = true;
        this.disabledDelete = true;
        this.disabledExecute = false;
        this.disabledCancel = true;
        break;
      case 'new':
        this.disabledNew = true;
        this.disabledSave = false;
        this.disabledDelete = true;
        this.disabledExecute = true;
        this.disabledCancel = false;
        break;
      case 'select':
        this.disabledNew = true;
        this.disabledSave = true;
        this.disabledDelete = false;
        this.disabledExecute = false;
        this.disabledCancel = false;
        break;
    }

  }

  getAreaTestFilter(jsonFinal: any) {
    this.listTests = jsonFinal.finalTests;
    this.listAreas = jsonFinal.finalAreas;
    this.typeAreaTest = jsonFinal.filter;
    this.jsonFilterAreaTest = jsonFinal.filterAreaTest;
  }

  getDemographicsFilter(jsonFinal: any) {
    this.demographics = jsonFinal.demographics;
    this.jsonFilterDemographics = jsonFinal.demographicsBD;
  }

}
