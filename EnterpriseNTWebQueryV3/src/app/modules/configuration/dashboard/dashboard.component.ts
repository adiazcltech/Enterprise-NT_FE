import { Component, Inject, ViewEncapsulation, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { LoaderService } from 'src/app/services/loader/loader.service';
import * as moment from 'moment';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { InterceptorService } from 'src/app/services/interceptor/interceptor.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from 'src/app/services/order/order.service';
import { UsertypeService } from 'src/app/services/configuration/usertype.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, FormArray } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { PreliminaryService } from 'src/app/services/preliminary/preliminary.service';
import { UserService } from 'src/app/services/configuration/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import * as _ from 'lodash';
import type { EChartsOption } from 'echarts';
import * as JSLZString from 'lz-string';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  private readonly notifier: NotifierService;
  patternPassword = new RegExp("");
  Object = Object;

  get getUserTypes() {
    return this.formData.get('userTypes') as FormArray;
  }

  //Llaves de configuración
  typeDocument = false;
  urlLIS = '';
  Bannerview = '';
  color = ''
  logoview = '';
  Title = '';
  administrator = false;
  Doctor = '';
  Patient = '';
  Customer = '';
  Laboratory = '';
  Rate = '';
  All = '';
  logo = "";
  Banner = "";
  Information = "";
  Information2 = "";
  URL = "";
  BusquedaOrden = false;
  FiltroRangoFecha = false;
  orderdigit = '';
  cantdigit = 0;
  TermsConditions = '';
  branch = '';
  panicblock = '';
  ImpresionDirectaReportes = false;
  EmpaquetarOrdenesCliente = false;
  keySecurityPolitics = false;

  viewpatient = false;
  search = {};
  listYear: any = [];
  documentType: any = [];
  demographicTemplate: any = {};
  demographicTitle = '';
  nameDemographic = '';
  referenceDemographic = '';
  listArea: any = [];
  getPathReport = '';
  listIdiome: any = [];
  listReports: any = [];
  order: any = [];
  orderTests: any = {};
  viewdemogra = false;
  demoname: any = {};
  datauser: any = [];
  dataorder: any = [];
  viewpdf = false;
  viewsmall = 1;
  searchorder = '';
  selectedOrder: any = {};
  typeuser = 0;
  viewpreliminar = false;
  minDate: Date;
  maxDate: Date;
  download = "";
  HistoricoGrafica = false;
  Historico = false;
  HistoricoCombinado = false;

  form: FormGroup;
  formData: FormGroup;
  submittedData = false;

  formChange: FormGroup;
  submittedChange = false;

  displayConfiguration = "none";
  displayImageProfile = "none";
  displayChangePassword = "none";
  displayComment = "none";
  displayAntibiogram = "none";
  displayConditions = "none";
  displayCharts = "none";
  displayChartData = "none";
  displayIdle = "none";

  exts = ['.jpg', '.jpeg', '.png'];
  extsToPrint = this.exts.toString().replace(new RegExp('\\.', 'g'), ' -');
  validTemoral = false;
  imageprofil = "";

  user: any = {};
  errorpasword = false;
  viewvalited = false;
  typeFilter = 0;
  patient = '';
  patientname = '';
  test = "";
  comment = "";
  sensitive:any = [];
  testgraphig: any = [];
  testgraphigdata: any = [];
  testgraphigdatadcodence: any = [];
  listgraphics: any = [];
  graphnumbergroup: any = [];
  optionsgraphgroup: any = {};
  listgraphicsALL: any = [];
  options: EChartsOption;
  formatDate = "DD/MM/YYYY";
  formatDategraphip = 'DD/MM/YYYY , h:mm:ss a';
  variables: any = {};
  pathreport = '';

  dataconfig = [
    {
      "key": "URL",//0
      "value": ""
    },
    {
      "key": "Color",//1
      "value": ""
    },
    {
      "key": "Titulo",//2
      "value": ""
    },
    {
      "key": "Logo",//3
      "value": ""
    },
    {
      "key": "Banner",//4
      "value": ""
    },
    {
      "key": "Informacion",//5
      "value": ""
    },
    {
      "key": "Informacion2",//6
      "value": ""
    },
    {
      "key": 'Historico',//7
      "value": false
    },
    {
      "key": "HistoricoGrafica",//8
      "value": false
    },
    {
      "key": "HistoricoCombinado",//9
      "value": false
    },
    {
      "key": "Captcha",//10
      "value": false
    },
    {
      "key": "CambioContraseña",//11
      "value": false
    },
    {
      "key": "ValidaSaldoPendiente",//12
      "value": false
    },
    {
      "key": "BusquedaOrden",//13
      "value": false
    },
    {
      "key": "MostrarConfidenciales",//14
      "value": false
    },
    {
      "key": "BloqueaPanicos",//15
      "value": ""
    },
    {
      "key": "MostrarResultado",//16
      "value": ""
    },
    {
      "key": "LlaveCaptcha",//17
      "value": ""
    },
    {
      "key": "ServiciosLISUrl",//18
      "value": ""
    },
    {
      "key": "PathFE",//19
      "value": ""
    },
    {
      "key": "ServidorCorreo",//20
      "value": ""
    },
    {
      "key": "TerminosCondiciones",//21
      "value": ""
    },
    {
      "key": "CuerpoEmail",//22
      "value": ""
    },
    {
      "key": "SmtpAuthUser",//23
      "value": ""
    },
    {
      "key": "SmtpHostName",//24
      "value": ""
    },
    {
      "key": "SmtpPasswordUser",//25
      "value": ""
    },
    {
      "key": "SmtpPort",//26
      "value": ""
    },
    {
      "key": "SmtpSSL",//27
      "value": ""
    },
    {
      "key": "SmtpProtocol",//28
      "value": ""
    },
    {
      "key": "directReportPrint",//29
      "value": false
    },
    {
      "key": "UrlSecurity",//30
      "value": ""
    },
    {
      "key": "FiltroRangoFecha",//31
      "value": false
    },
    {
      "key": "EmpaquetarOrdenesCliente",//32
      "value": false
    }
  ];

  editorOptions = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
      ]
    }
  };

  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;

  constructor(
    private loaderDS: LoaderService,
    private notifierService: NotifierService,
    private configurationDS: ConfigurationService,
    private interceptorDS: InterceptorService,
    private translate: TranslateService,
    private orderDS: OrderService,
    private userTypeDS: UsertypeService,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private formBuilder: FormBuilder,
    private userDS: UserService,
    private preliminaryDS: PreliminaryService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private idle: Idle,
    keepalive: Keepalive,
    private authDS: AuthService
  ) {
    this.loaderDS.loading(false);
    this.notifier = notifierService;
    this.initForm();
    this.initFormData();
    this.initFormChange();
    this.init();

    // set idle parameters
    idle.setIdle(900);
    idle.setTimeout(30);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleStart.subscribe(() => {
      this.displayIdle = "block";
    });

    idle.onIdleEnd.subscribe(() => {
      this.displayIdle = "none";
      this.countdown = null;
      changeDetectorRef.detectChanges();
    });

    idle.onTimeout.subscribe(() => this.closed());
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  ngOnInit(): void {
    this.reset();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  reset() {
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  initFormChange() {
    this.formChange = new FormGroup({
      oldpassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      reNewPassword: new FormControl('', [Validators.required, Validators.pattern(this.patternPassword)])
    }, { validators: this.checkPasswords });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('reNewPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  initFormData() {
    this.formData = new FormGroup({
      name: new FormControl(''),
      logo: new FormControl(''),
      temporal: new FormControl(''),
      imagelogo: new FormControl(''),
      banner: new FormControl(''),
      temporal1: new FormControl(''),
      imagebanner: new FormControl(''),
      color: new FormControl(''),
      information: new FormControl(''),
      informationAditional: new FormControl(''),
      url: new FormControl(''),
      urlLis: new FormControl(''),
      urlSecurity: new FormControl(''),
      urlReports: new FormControl(''),
      history: new FormControl(''),
      graphicHistory: new FormControl(''),
      historicalCondensed: new FormControl(''),
      loginCaptcha: new FormControl(''),
      changePassword: new FormControl(''),
      outstandingBalance: new FormControl(''),
      orderSearch: new FormControl(''),
      showConfidencials: new FormControl(''),
      resultsAuto: new FormControl(''),
      pacic: new FormControl(''),
      showResults: new FormControl(''),
      filterByDates: new FormControl(''),
      sendCustomer: new FormControl(''),
      userTypes: this.formBuilder.array([]),
      termsConditions: new FormControl(''),
      server: new FormControl(''),
      protocol: new FormControl(''),
      port: new FormControl(''),
      encryption: new FormControl(''),
      securityProtocol: new FormControl(''),
      email: new FormControl(''),
      passwordEmail: new FormControl(''),
      body: new FormControl(''),
    });
  }

  selectVisible(data: any) {
    if (data.value.visible) {
      data.get('quantityOrder').setValue('*');
    }
  }

  onPhotoSelected(user: any, event: any) {
    const file = event.target.files[0];
    if (file !== null && file !== undefined && file !== '') {
      this.validTemoral = true;
      if (!(new RegExp('(' + this.exts.join('|').replace(/\./g, '\\.') + ')$')).test(file.name)) {
        this.validTemoral = false;
        this.notifier.notify('warning', this.translate.instant('0258'));
        user.get('imagelogo').setValue(undefined);
        user.get('image').setValue('');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64 = String(reader.result);
          user.get('image').setValue(base64.split("base64,")[1]);
        };
      }
    }
  }

  onTemporal1Selected(event: any) {
    const file = event.target.files[0];
    if (file !== null && file !== undefined && file !== '') {
      this.validTemoral = true;
      if (!(new RegExp('(' + this.exts.join('|').replace(/\./g, '\\.') + ')$')).test(file.name)) {
        this.validTemoral = false;
        this.notifier.notify('warning', this.translate.instant('0258'));
        this.formData.get('temporal1').setValue(undefined);
        this.formData.get('banner').setValue('');
        this.formData.get('imagebanner').setValue('');
        this.dataconfig[4].value = '';
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64 = String(reader.result);
          this.formData.get('imagebanner').setValue(base64.split("base64,")[1]);
          this.formData.get('banner').setValue(file.name);
          this.Banner = file.name;
        };
      }
    }
  }

  onTemporalSelected(event: any) {
    const file = event.target.files[0];
    if (file !== null && file !== undefined && file !== '') {
      this.validTemoral = true;
      if (!(new RegExp('(' + this.exts.join('|').replace(/\./g, '\\.') + ')$')).test(file.name)) {
        this.validTemoral = false;
        this.notifier.notify('warning', this.translate.instant('0258'));
        this.formData.get('temporal').setValue(undefined);
        this.formData.get('logo').setValue('');
        this.formData.get('imagelogo').setValue('');
        this.dataconfig[3].value = '';
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64 = String(reader.result);
          this.formData.get('imagelogo').setValue(base64.split("base64,")[1]);
          this.formData.get('logo').setValue(file.name);
          this.logo = file.name;
        };
      }
    }
  }

  removeTemporal1() {
    this.Banner = '';
    this.dataconfig[4].value = '';
    this.formData.get('temporal1').setValue(undefined);
    this.formData.get('banner').setValue('');
    this.formData.get('imagebanner').setValue('');
  }

  removeTemporal() {
    this.logo = '';
    this.formData.get('temporal').setValue(undefined);
    this.formData.get('logo').setValue('');
    this.formData.get('imagelogo').setValue('');
    this.dataconfig[3].value = '';
  }

  initForm() {
    this.form = new FormGroup({
      dateseach: new FormControl(''),
      dateseachinit: new FormControl(''),
      dateseachend: new FormControl(''),
      area: new FormControl(''),
      documentType: new FormControl(''),
      record: new FormControl(''),
      year: new FormControl(''),
      lastname: new FormControl(''),
      surname: new FormControl(''),
      name1: new FormControl(''),
      name2: new FormControl(''),
      order: new FormControl('')
    });
    //Cambios filtro por fecha
    this.form.get('dateseach').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        this.getseachdate();
      }, 100);
    });
    this.form.get('dateseachinit').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        this.getseachdate();
      }, 100);
    });
    this.form.get('dateseachend').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        this.getseachdate();
      }, 100);
    });
    this.form.get('area').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        if (this.typeFilter === 0) {
          this.getseachdate();
        }
        if (this.typeFilter === 1) {
          this.keyselectpatientid();
        }
        if (this.typeFilter === 3) {
          this.getOrderComplete();
        }
      }, 100);
    });
    //Cambios filtro por historia
    this.form.get('documentType').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        this.keyselectpatientid();
      }, 100);
    });
    this.form.get('year').valueChanges.subscribe((change: any) => {
      setTimeout(() => {
        if (this.typeFilter === 1) {
          this.keyselectpatientid();
        }
        if (this.typeFilter === 2) {
          this.keyselectname();
        }
        if (this.typeFilter === 3) {
          this.getOrderComplete();
        }
      }, 100);
    });
  }

  removePhotoUser(data: any) {
    data.get('imagelogo').setValue(undefined);
    data.get('image').setValue('');
  }

  viewphoto(data: any) {
    if (data.value.image === '') {
      this.notifier.notify('info', this.translate.instant('0262'));
    } else {
      this.imageprofil = data.value.image;
      this.displayImageProfile = "block";
    }
  }

  updateUserTypes(data: any) {
    this.loaderDS.loading(true);
    data.map((user: any) => {
      if (user.quantityOrder === '*') {
        user.quantityOrder = 0;
      }
    });
    this.userTypeDS.updateusertype(data).subscribe({
      next: (response: any) => {
        this.loaderDS.loading(false);
        this.getConfiguration('none');
        this.notifier.notify('success', this.translate.instant('0022'));
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  submitChange() {
    this.submittedChange = true;
    if (!this.formChange.valid) { return false; }
    const valuePasswords = this.formChange.value;
    this.loaderDS.loading(true);
    this.viewvalited = false;
    this.errorpasword = false;
    var user = {
      "idUser": this.user.id,
      "userName": this.user.userName,
      "passwordOld": valuePasswords.oldpassword,
      "passwordNew": valuePasswords.newPassword,
      "type": this.user.type
    }

    this.userDS.changePasswordExpirit(user).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        this.viewvalited = false;
        this.errorpasword = false;
        this.displayChangePassword = 'none';
        this.notifier.notify('info', this.translate.instant('0098'));
      },
      error: (error: any) => {
        if (error.error !== null) {
          this.loaderDS.loading(false);
          this.viewvalited = false
          this.errorpasword = false;
          error.error.errorFields.map((value: any) => {
            var item = value.split('|');
            if (item[0] === '1') {
              this.viewvalited = true;
            }
            if (item[0] === '2') {
              this.errorpasword = true;
            }
          });
        } else {
          this.loaderDS.loading(false);
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  submitData() {
    this.submittedData = true;
    if (!this.formData.valid) { return false; }
    this.loaderDS.loading(true);
    const data = this.formData.value;
    this.dataconfig[2].value = data.name;
    this.dataconfig[1].value = data.color;
    this.dataconfig[5].value = data.information;
    this.dataconfig[6].value = data.informationAditional;
    this.dataconfig[0].value = data.url;
    this.dataconfig[18].value = data.urlLis;
    this.dataconfig[30].value = data.urlSecurity;
    this.dataconfig[19].value = data.urlReports;
    this.dataconfig[7].value = data.history;
    this.dataconfig[8].value = data.graphicHistory;
    this.dataconfig[9].value = data.historicalCondensed;
    this.dataconfig[10].value = data.loginCaptcha;
    this.dataconfig[11].value = data.changePassword;
    this.dataconfig[12].value = data.outstandingBalance;
    this.dataconfig[13].value = data.orderSearch;
    this.dataconfig[14].value = data.showConfidencials;
    this.dataconfig[29].value = data.resultsAuto;
    this.dataconfig[15].value = data.pacic;
    this.dataconfig[16].value = data.showResults;
    this.dataconfig[31].value = data.filterByDates;
    this.dataconfig[32].value = data.sendCustomer;
    this.dataconfig[21].value = data.termsConditions;
    this.dataconfig[20].value = data.server;
    this.dataconfig[24].value = data.protocol;
    this.dataconfig[26].value = data.port;
    this.dataconfig[27].value = data.encryption;
    this.dataconfig[28].value = data.securityProtocol;
    this.dataconfig[23].value = data.email;
    this.dataconfig[25].value = data.passwordEmail;
    this.dataconfig[22].value = data.body;
    this.configurationDS.updateConfiguration(this.dataconfig).subscribe({
      next: (response: any) => {
        this.loaderDS.loading(false);
        this.updateUserTypes(data.userTypes);
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  GraphicHistorycodense() {
    if (this.dataorder.length !== 0) {
      this.testgraphigdatadcodence = [];
      for (var key in this.orderTests) {
        let values = this.orderTests[key].filter( (e:any) => e.printc === true);
        if (values.length !== 0) {
          this.testgraphigdatadcodence = _.concat(this.testgraphigdatadcodence, values);
        }
      }
      if (this.testgraphigdatadcodence.length === 0) {
        this.notifier.notify('info', this.translate.instant('0282'));
      } else {
        this.getResultsHistory(3);
      }
    } else {
      this.notifier.notify('info', this.translate.instant('0212'));
    }
  }

  GraphicHistorydata() {
    if (this.dataorder.length !== 0) {
      this.testgraphigdata = [];
      for (var key in this.orderTests) {
        let values = this.orderTests[key].filter( (e:any) => e.printd === true);
        if (values.length !== 0) {
          this.testgraphigdata = _.concat(this.testgraphigdata, values);
        }
      }
      if (this.testgraphigdata.length === 0) {
        this.notifier.notify('info', this.translate.instant('0281'));
      } else {
        this.getResultsHistory(2);
      }
    } else {
      this.notifier.notify('info', this.translate.instant('0212'));
    }
  }

  GraphicHistory() {
    if (this.dataorder.length !== 0) {
      this.testgraphig = [];
      for (var propiedad in this.orderTests) {
        let values = this.orderTests[propiedad].filter((e:any) => e.printg === true);
        if (values.length !== 0) {
          this.testgraphig = _.concat(this.testgraphig, values);
        }
      }
      if (this.testgraphig.length === 0) {
        this.notifier.notify('info', this.translate.instant('0279'));
      } else {
        this.getResultsHistory(1);
      }
    } else {
      this.notifier.notify('info', this.translate.instant('0212'));
    }
  }

  loadOptions() {
    //Opciones graficas
    this.options = {
      tooltip: {
        trigger: 'axis'
      },
      calculable: true,
      legend: {
        data: [
          this.translate.instant('0115'),
          this.translate.instant('0129'),
          this.translate.instant('0130')
        ],
        align: 'left',
      },
      xAxis: {
        name: this.translate.instant('0131'),
        nameLocation: 'middle',
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          margin: 40
        },
        data: []
      },
      yAxis: {
        name: this.translate.instant('0115'),
        type: 'value'
      },
      series: []
    }

    this.optionsgraphgroup ={
      tooltip: {
        trigger: 'axis'
      },
      calculable: true,
      legend: {
        data: [],
        orient: 'vertical',
        x: 'left',
        y: 'bottom',
        z: 10,
        zlevel: 10,
        itemHeight: 10,
        itemMarginTop: 2,
        itemMarginBottom: 2
      },
      grid: {
        y: 45,
        x: 45,
        y2: 100
      },
      xAxis: {
        name: this.translate.instant('0131'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        boundaryGap: false,
        inverse: true,
        axisLine: { onZero: false }
      },
      yAxis: {
        name: this.translate.instant('0115'),
        type: 'value',
        axisLine: { onZero: false }
      }
    }
  }

  getResultsHistory(type: number) {
    let listtest = [];
    this.listgraphics = [];
    this.graphnumbergroup = [];
    if (type === 1) {
      listtest = _.map(this.testgraphig, 'testId');
    } else if (type === 2) {
      listtest = _.map(this.testgraphigdata, 'testId');
    } else {
      listtest = _.map(this.testgraphigdatadcodence, 'testId');
    }

    let patient = {
      id: this.patient,
      testId: listtest
    }

    this.loaderDS.loading(true);
    const auth = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));

    this.orderDS.getResultsHistory(patient).subscribe({
      next: (response: any) => {
        let validlist = response.filter((e:any) => e.testCode !== '' && e.testCode !== null && e.testCode !== undefined);
        if (validlist.length > 0) {
          this.loadOptions();
          response.map((item:any) => {
            if (item.history.length > 0) {
              item.history = _.orderBy(item.history, 'validateDate');
              let test:any = {};
              test.name = item.testCode + ' ' + item.testName;
              test.type = item.resultType;
              test.testdetail = [];
              if (item.resultType === 1) {
                test.options = JSON.parse(JSON.stringify(this.options));
                const series = [
                  {
                    name: this.translate.instant('0115'),
                    type: 'line',
                    data: []
                  },
                  {
                    name: this.translate.instant('0129'),
                    type: 'line',
                    data: []
                  },
                  {
                    name: this.translate.instant('0130'),
                    type: 'line',
                    data: []
                  }];

                let testgroup = {
                  name: item.testCode + ' ' + item.testName,
                  type: 'line',
                  data: []
                };

                this.optionsgraphgroup.legend.data.push(item.testCode + ' ' + item.testName)
                let index = item.history.length + 1;

                item.history.map((itemhistory:any) => {
                  index = index - 1;
                  series[0].data.push(itemhistory.resultNumber === null ? '' : itemhistory.resultNumber);
                  series[1].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMin);
                  series[2].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMax);
                  test.options.series = series;
                  test.options.xAxis.data.push(moment(itemhistory.validateDate).format(this.formatDategraphip));
                  testgroup.data.push(itemhistory.resultNumber === null ? '' : [index, itemhistory.resultNumber]);
                  let detail = {
                    datevalid: moment(itemhistory.validateDate).format(this.formatDategraphip),
                    order: itemhistory.order,
                    result: itemhistory.result,
                    referencevalues: itemhistory.refMin !== null ? (itemhistory.refMin + ' - ' + itemhistory.refMax) : '',
                    patology: itemhistory.pathology === 0 ? this.translate.instant('0132') : '*',
                    min: itemhistory.refMin,
                    max: itemhistory.refMax,
                    comment: itemhistory.resultComment.comment
                  }
                  test.testdetail.push(detail);
                });
                this.graphnumbergroup.push(testgroup);
              }
              else {
                if (type === 2) {
                  item.history.map((itemhistory: any) => {
                    let detail = {
                      datevalid: moment(itemhistory.validateDate).format(this.formatDategraphip),
                      order: itemhistory.order,
                      result: itemhistory.result,
                      referencevalues: itemhistory.refLiteral !== null ? itemhistory.refLiteral : '',
                      patology: itemhistory.pathology === 0 ? this.translate.instant('0132') : '*',
                      comment: itemhistory.resultComment.comment
                    }
                    test.testdetail.push(detail);
                  });
                }
              }
              test.testdetail = test.testdetail.reverse();
              this.listgraphics.push(test);
            }
          });
          this.loaderDS.loading(false);
          this.listgraphicsALL = this.listgraphics;
          if (type === 1) {
            if (this.listgraphicsALL.length === 0) {
              this.notifier.notify('info', this.translate.instant('0280'));
            } else {
              this.displayCharts = "block";
            }
          } else if (type === 2) {
            if (this.listgraphicsALL.length === 0) {
              this.notifier.notify('info', this.translate.instant('0280'));
            } else {
              this.displayChartData = "block";
            }
          } else {
            if (this.listgraphicsALL.length === 0) {
              this.notifier.notify('info', this.translate.instant('0280'));
            } else {
              this.variables = {
                entity: this.branch,
                abbreviation: "",
                paciente: this.patientname,
                username: auth.userName,
                date: moment().format(this.formatDate)
              }
              this.pathreport = '/Report/Historycondense/specialStatisticsGraph.mrt';
              this.windowOpenReport();
            }
          }
        }
        else {
          this.loaderDS.loading(false);
          this.notifier.notify('info', this.translate.instant('0280'));
        }
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  windowOpenReport() {
    this.translate.getTranslation(sessionStorage.getItem('lang')).subscribe(transAsJson => {
      if (this.listgraphicsALL.length > 0) {
        var parameterReport:any = {};
        parameterReport.variables = this.variables;
        parameterReport.pathreport = this.pathreport;
        parameterReport.labelsreport = JSON.stringify(transAsJson);
        let datareport = JSLZString.compressToUTF16(JSON.stringify(this.listgraphicsALL));
        sessionStorage.setItem('parameterReport', JSON.stringify(parameterReport));
        sessionStorage.setItem('dataReport', datareport);
        window.open('/viewreport');
      } else {
        this.notifier.notify('info', this.translate.instant('0280'));
      }
    });
  }

  end() {
    if (this.listReports.length === 0) {
      this.notifier.notify('info', this.translate.instant('0276'));
    } else if (this.listIdiome.length === 0) {
      this.notifier.notify('info', this.translate.instant('0277'));
    } else if (this.dataorder.length === 0) {
      this.notifier.notify('info', this.translate.instant('0212'));
    } else if (this.getPathReport !== '' && this.getPathReport !== null) {
      const selectedTests = this.dataorder.filter( (t:any) => t.select );
      let finalListTests = this.dataorder;
      if(selectedTests.length > 0) {
        finalListTests = selectedTests;
      }
      this.preliminaryDS.openReport({
        type: 2,
        open: true,
        order: this.selectedOrder,
        tests: finalListTests,
        listreports: this.listReports,
        demographictemplate: this.demographicTemplate,
        download: this.download,
        referencedemographic: this.referenceDemographic,
        namedemographic: this.nameDemographic,
        idiome: this.listIdiome
      });
    } else {
      this.notifier.notify('info', this.translate.instant('0195'));
    }
  }

  preliminary() {
    this.download = "";
    if (this.listReports.length === 0) {
      this.notifier.notify('info', this.translate.instant('0276'));
    } else if (this.listIdiome.length === 0) {
      this.notifier.notify('info', this.translate.instant('0277'));
    } else if (this.dataorder.length === 0) {
      this.notifier.notify('info', this.translate.instant('0212'));
    } else if (this.getPathReport !== '' && this.getPathReport !== null) {
      const selectedTests = this.dataorder.filter( (t:any) => t.select );
      let finalListTests = this.dataorder;
      if(selectedTests.length > 0) {
        finalListTests = selectedTests;
      }
      this.preliminaryDS.openReport({
        type: 1,
        open: true,
        order: this.selectedOrder,
        tests: finalListTests,
        listreports: this.listReports,
        demographictemplate: this.demographicTemplate,
        download: this.download,
        referencedemographic: this.referenceDemographic,
        namedemographic: this.nameDemographic,
        idiome: this.listIdiome
      });
    } else {
      this.notifier.notify('info', this.translate.instant('0195'));
    }
  }

  getOrderComplete() {
    if (this.form.get('order').pristine) {
      return false;
    }
    const data = this.form.value;
    let numberordensearch = '';
    if (data.order.length < this.cantdigit) {
      data.order = data.order === '' ? 0 : data.order;
      numberordensearch = data.year + (this.getOrderNumber(data.order, this.orderdigit)).substring(4);
      this.form.get('order').setValue(numberordensearch.substring(4));
    } else if (data.order.length === this.cantdigit) {
      numberordensearch = data.year + data.order;
    }
    this.search = {
      order: numberordensearch,
      area: data.area
    }
    this.getSearch();
  }

  keyselectname() {
    if (this.form.get('name1').pristine && this.form.get('name2').pristine && this.form.get('lastname').pristine && this.form.get('surname').pristine) {
      return false;
    }
    const data = this.form.value;
    const name1 = data.name1 === undefined || data.name1 === null || data.name1 === '' ? '' : data.name1.toUpperCase();
    const name2 = data.name2 === undefined || data.name2 === null || data.name2 === '' ? '' : data.name2.toUpperCase();
    const lastname = data.lastname === undefined || data.lastname === null || data.lastname === '' ? '' : data.lastname.toUpperCase();
    const surname = data.surname === undefined || data.surname === null || data.surname === '' ? '' : data.surname.toUpperCase();
    if (name1 === '' && name2 === '' && lastname === '' && surname === '') {
      this.notifier.notify('warning', this.translate.instant('0197'));
    } else {
      this.search = {
        name1: name1,
        name2: name2,
        lastName: lastname,
        surName: surname,
        year: data.year,
        area: 0
      }
      this.getSearch();
    }
  }

  keyselectpatientid() {
    if (this.form.get('record').pristine) {
      return false;
    }
    const data = this.form.value;
    if (data.record !== '' && data.record !== undefined && data.record !== null) {
      this.search = {
        documentType: data.documentType,
        patientId: data.record,
        year: data.year,
        area: data.area
      }
      this.getSearch();
    } else {
      this.notifier.notify('warning', this.translate.instant('0196'));
      return false;
    }
  }

  getseachdate() {

    if(this.FiltroRangoFecha) {
      if (this.form.get('dateseachinit').pristine || this.form.get('dateseachend').pristine) {
        return false;
      }
    } else {
      if (this.form.get('dateseach').pristine) {
        return false;
      }
    }
    const data = this.form.value;
    if (this.FiltroRangoFecha) {
      if (data.dateseachinit === "" || data.dateseachinit === undefined || data.dateseachinit === null) {
        this.notifier.notify('warning', this.translate.instant('0268'));
        return false;
      }
      if (data.dateseachend === "" || data.dateseachend === undefined || data.dateseachend === null) {
        this.notifier.notify('warning', this.translate.instant('0269'));
        return false;
      }
      const init = moment(data.dateseachinit).format('YYYYMMDD');
      const end = moment(data.dateseachend).format('YYYYMMDD');
      if (+end < +init) {
        this.notifier.notify('warning', this.translate.instant('0270'));
        return false;
      }
      this.search = {
        dateNumberInit: init,
        dateNumberEnd: end,
        area: data.area
      }
      this.getSearch();
    } else {
      if (data.dateseach === "" || data.dateseach === undefined || data.dateseach === null) {
        this.notifier.notify('warning', this.translate.instant('0208'));
        return false;
      }
      this.search = {
        'dateNumber': moment(data.dateseach).format('YYYYMMDD'),
        'area': data.area
      }
      this.getSearch();
    }
  }

  refreshpatient() {
    const data = this.form.value;
    this.search = {
      dateNumber: null,
      area: data.area
    }
    this.getSearch();
  }

  getselectordermini(order:any) {
    this.selectedOrder = order.order;
  }

  selectTest(test:any, event:any) {
    if(test) {
      let findTest = this.dataorder.find( (t:any) => t.testId === test.testId);
      if(findTest) {
        findTest.select = event.target.checked
      }
    }
  }

  selectProfile(profile:any, key:any, event:any) {
    this.orderTests[key].forEach( (t:any) => {
      if(t.profileId === profile.profileId) {
        t.select = event.target.checked;
        let findTest = this.dataorder.find( (test:any) => t.testId === test.testId);
        if(findTest) {
          findTest.select = event.target.checked;
        }
      }
    });
  }

  selectArea(key:any, event:any) {
    if(key && this.orderTests[key] !== undefined && this.orderTests[key].length > 0) {
      this.orderTests[key].forEach( (t:any) => {
        t.select = event.target.checked;
        let findTest = this.dataorder.find( (test:any) => t.testId === test.testId);
        if(findTest) {
          findTest.select = event.target.checked;
        }
      });
    }
  }

  getselectorder(order:any, download?) {
    this.download = "";
    this.loaderDS.loading(true);
    this.download = download;
    this.selectedOrder = order.order;
    this.dataorder = [];
    this.patient = order.patientIdDB;
    this.patientname = order.name1 + ' ' + order.name2 + ' ' + order.lastName + ' ' + order.surName;
    this.orderTests = [];
    const area = this.form.get('area').value;
    this.orderDS.getordersresult(order.order, area).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        if(response !== null && response !== undefined && response !== '') {
          response.forEach( (t) => {
            t.select = false;
          });
          this.dataorder = response;
          if (this.panicblock === '2') {
            const validorder = response.filter(value => value.pathology === '!0').length;
            if (validorder === 0) {
              this.orderTests = _.groupBy(response, 'areaName');
              for (let propiedad in this.orderTests) {
                if (this.orderTests.hasOwnProperty(propiedad)) {
                  let completedata = [];
                  if (this.orderTests[propiedad].length !== 0) {
                    const tests = JSON.parse(JSON.stringify(this.orderTests[propiedad]));
                    let orderprofil = _.groupBy(tests, 'profileId');
                    for (let key in orderprofil) {
                      orderprofil[key] = _.orderBy(orderprofil[key], 'profileId');
                      orderprofil[key].map((itemi:any) => {
                        itemi.viewprofil = false;
                        completedata.push(itemi);
                      });
                      if (orderprofil[key][0].profileId !== 0) {
                        let profile = {
                          profileId: orderprofil[key][0].profileId,
                          profileName: orderprofil[key][0].profileName,
                          grantAccess: orderprofil[key][0].grantAccess,
                          grantValidate: orderprofil[key][0].grantValidate,
                          printSort: -1,
                          viewprofil: true,
                          selecprofil: false
                        };
                        completedata.unshift(profile);
                      }
                    }
                  }
                  this.orderTests[propiedad] = _.orderBy(completedata, ['profileId', 'printSort'], ['asc', 'asc']);
                  if (this.ImpresionDirectaReportes) {
                    this.end();
                  }
                }
              }
            }
          }
          else {
            this.orderTests = _.groupBy(response, 'areaName');
            for (let propiedad in this.orderTests) {
              if (this.orderTests.hasOwnProperty(propiedad)) {
                let completedata = [];
                if (this.orderTests[propiedad].length !== 0) {
                  const tests = JSON.parse(JSON.stringify(this.orderTests[propiedad]));
                  let orderprofil = _.groupBy(tests, 'profileId');
                  for (let key in orderprofil) {
                    orderprofil[key] = _.orderBy(orderprofil[key], 'profileId');
                    orderprofil[key].map((itemi:any) => {
                      itemi.viewprofil = false;
                      completedata.push(itemi);
                    });
                    if (orderprofil[key][0].profileId !== 0) {
                      var perfil = {
                        profileId: orderprofil[key][0].profileId,
                        profileName: orderprofil[key][0].profileName,
                        printSort: -1,
                        viewprofil: true,
                        selecprofil: false
                      };
                      completedata.unshift(perfil);
                    }
                  }
                }
                this.orderTests[propiedad] = _.orderBy(completedata, ['profileId', 'printSort'], ['asc', 'asc']);
                if (this.ImpresionDirectaReportes) {
                  this.end();
                }
              }
            }
          }
        } else {
          this.notifier.notify('info', this.translate.instant('0212'));
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  selectallarea(obj:any, data:any, test:any, type:any) {
    if(type === 1) {
      test.map((value:any) => {
        if(value.viewprofil) {
          value.printgall = test.printgallarea;
        } else {
          if (value.resultType === 1) {
            value.printg = test.printgallarea;
          }
        }
      });
    } else if(type === 2) {
      test.map((value:any) => {
        if(value.viewprofil) {
          value.printdall = test.printdallarea;
        } else {
          value.printd = test.printdallarea;
        }
      });
    } else {
      test.map((value:any) => {
        if(value.viewprofil) {
          value.printcall = test.printcallarea;
        } else {
          if (value.resultType === 1) {
            value.printc = test.printcallarea;
          }
        }
      });
    }
  }

  changeTabResponsive(type:number) {
    this.viewpdf=false;
    this.viewsmall=type;
    this.form.reset();
    this.form.get('year').setValue(this.listYear[0].id);
    this.form.get('documentType').setValue(this.documentType[0].id);
    this.form.get('area').setValue(this.listArea[0].id);
  }

  searchsmall() {
    this.dataorder = [];
    if (this.viewsmall === 1) {
      this.getseachdate();
    } else if (this.viewsmall === 2) {
      this.keyselectpatientid();
    } else if (this.viewsmall === 3) {
      this.keyselectname();
    } else if (this.viewsmall === 4) {
      this.getOrderComplete();
    }
  }

  getListYear() {
    const dateMin = moment().year() - 4;
    const dateMax = moment().year();
    this.listYear = [];
    for (var i = dateMax; i >= dateMin; i--) {
      this.listYear.push({
        id: i,
        name: i
      });
    }
    this.form.get('year').setValue(this.listYear[0].id);
    if (this.typeDocument) {
      this.getTypeDocument();
    } else {
      this.documentType = [{
        id: 0,
        name: 'Sin filtro'
      }];
      this.form.get('documentType').setValue(this.documentType[0].id);
    }
    return this.listYear;
  }

  getListIdiome() {
    if (this.getPathReport !== '' && this.getPathReport !== null) {
      let pathReport = '';
      if (this.translate.instant('0000') === 'es') {
        pathReport = this.getPathReport + '/public/languages/locale-es.json';
      } else {
        pathReport = this.getPathReport + '/public/languages/locale-en.json';
      }
      var parameters = {
        pathReport: pathReport,
      };
      this.listIdiome = [];
      this.getlistReportFile();
      this.configurationDS.getListIdiome(parameters).subscribe({
        next: (response: any) => {
          if (response == '2') {
            this.listIdiome = [];
            this.notifier.notify('info', this.translate.instant('0254'));
          } else {
            this.listIdiome = response;
          }
        },
        error: (error: any) => {
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      });
    } else {
      this.notifier.notify('info', this.translate.instant('0195'));
    }
  }

  getlistReportFile() {
    var parameters = {
      pathReport: this.getPathReport + '/public/Report/reportsandconsultations/reports',
      report: './public/reports'
    };
    this.listReports = [];
    this.configurationDS.getlistReportFile(parameters).subscribe({
      next: (response: any) => {
        if (response == '2') {
          this.listReports = [];
          this.notifier.notify('info', this.translate.instant('0254'));
        } else {
          this.listReports = response;
        }
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getArea() {
    this.configurationDS.getAreasActive(this.urlLIS).subscribe({
      next: (response) => {
        this.getListIdiome();
        response[0] = {
          id: 0,
          name: this.translate.instant('0079')
        };
        this.listArea = response;
        this.form.get('area').setValue(this.listArea[0].id);
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getTypeDocument() {
    this.documentType = [{
      id: 0,
      name: 'Sin filtro'
    }];
    this.configurationDS.getDocumentype().subscribe({
      next: (response: any) => {
        this.documentType = this.removedocumentType(response);
        this.form.get('documentType').setValue(this.documentType[0].id);
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  removedocumentType(data: any) {
    var documentType = [{
      id: 0,
      name: 'Sin filtro'
    }];
    data.map((value: any) => {
      var object = {
        id: value.id,
        name: value.name
      };
      documentType.push(object);
    });
    return documentType;
  }

  demographicsKey() {
    if (this.urlLIS !== '' && this.urlLIS !== null) {
      this.configurationDS.getDemographicsKey(this.urlLIS, 'DemograficoTituloInforme').subscribe({
        next: (response) => {
          this.demographicTitle = response.value;
          this.getDemographicsAll();
        },
        error: (error: any) => {
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      });
    } else {
      this.notifier.notify('info', this.translate.instant('0253'));
    }
  }

  getDemographicsAll() {
    if (parseInt(this.demographicTitle) !== 0) {
      this.configurationDS.getDemographicsAll(this.urlLIS).subscribe({
        next: (response) => {
          this.demographicTemplate = response.find((demo: any) => demo.id === parseInt(this.demographicTitle));
          if (this.demographicTemplate) {
            this.nameDemographic = 'reports_' + this.demographicTemplate.name;
            this.referenceDemographic = this.demographicTemplate.name;
            if (parseInt(this.demographicTitle) < 0) {
              switch (parseInt(this.demographicTitle)) {
                case -1:
                  this.demographicTemplate.name = this.translate.instant('0198');
                  this.referenceDemographic = 'account';
                  break; //Cliente
                case -2:
                  this.demographicTemplate.name = this.translate.instant('0199');
                  this.referenceDemographic = 'physician';
                  break; //Médico
                case -3:
                  this.demographicTemplate.name = this.translate.instant('0200');
                  this.referenceDemographic = 'rate';
                  break; //Tarifa
                case -4:
                  this.demographicTemplate.name = this.translate.instant('0201');
                  this.referenceDemographic = 'type';
                  break; //Tipo de orden
                case -5:
                  this.demographicTemplate.name = this.translate.instant('0003');
                  this.referenceDemographic = 'branch';
                  break; //Sede
                case -6:
                  this.demographicTemplate.name = this.translate.instant('0202');
                  this.referenceDemographic = 'service';
                  break; //Servicio
                case -7:
                  this.demographicTemplate.name = this.translate.instant('0203');
                  this.referenceDemographic = 'race';
                  break; //Raza
              }
              this.nameDemographic = 'reports_' + this.demographicTemplate.name;
            }
          }
        },
        error: (error: any) => {
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      });
    } else {
      this.demographicTemplate = null;
      this.nameDemographic = 'reports';
    }
  }

  viewantibiogramt(obj:any) {
    this.loaderDS.loading(true);
    this.configurationDS.getsensitive(obj.order, obj.testId).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        this.sensitive = _.filter(response.microorganisms, ['selected', true]);
        this.displayAntibiogram = "block";
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  viewcoment(obj:any) {
    this.displayComment = "block";
    this.test = obj.abbreviation;
    this.comment = obj.resultComment.comment;
  }

  selectall(obj:any, data:any, test:any, type:any) {
    if(type === 1) {
      test.map((value:any) => {
        if(value.profileId === obj.profileId && !value.viewprofil) {
          if(value.resultType === 1) {
            value.printg = data;
          }
        }
      });
    } else if(type === 2) {
      test.map((value:any) => {
        if(value.profileId === obj.profileId && !value.viewprofil) {
          value.printd = data;
        }
      });
    } else {
      test.map((value:any) => {
        if(value.profileId === obj.profileId && !value.viewprofil) {
          if(value.resultType === 1) {
            value.printc = data;
          }
        }
      });
    }
  }

  getSearch() {
    this.order = [];
    this.orderTests = [];
    this.loaderDS.loading(true);
    this.orderDS.getfilterorders(this.search).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        if (response !== null && response.length > 0) {
          this.order = response;
        } else {
          this.notifier.notify('info', this.translate.instant('0212'));
          this.order = [];
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getuser() {
    this.userTypeDS.getUserType().subscribe({
      next: (response: any) => {
        response.map((value: any) => {
          if (value.quantityOrder === 0) {
            value.quantityOrder = "*";
          }
        });
        this.datauser = response;
        this.loadValuesConfiguration();
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getDemoConsultaWeb() {
    this.configurationDS.getwebquery().subscribe({
      next: (response: any) => {
        this.demoname = response;
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getprofiluser() {
    this.user = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    this.formChange.reset();
    this.errorpasword = false;
    this.viewvalited = false;
    this.displayChangePassword = 'block';
  }

  getConfiguration(display: string) {
    this.loaderDS.loading(true);

    this.authDS.autoLogin().subscribe({
      next: (resp) => {
        if(resp !== null && resp !== undefined && resp.success === true) {
          this.configurationDS.getConfiguration(resp.token).subscribe({
            next: (response) => {
              this.loaderDS.loading(false);
              this.arrayslist(response, display);
              this.setVariables(response);
            },
            error: (error: any) => {
              this.loaderDS.loading(false);
              this.interceptorDS.hasError(true, error.message, error.url);
            }
          });
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  arrayslist(data: any, display: string) {
    this.loaderDS.loading(true);
    this.Doctor = this.translate.instant('0075');
    this.Patient = this.translate.instant('0076');
    this.Customer = this.translate.instant('0077');
    this.Laboratory = this.translate.instant('0078');
    this.Rate = this.translate.instant('0200');
    this.All = this.translate.instant('0079');
    if (sessionStorage.getItem('ManejoDemograficoConsultaWeb') === 'True') {
      this.viewdemogra = true;
      this.getDemoConsultaWeb();
    }
    this.getuser();
    this.logo = "";
    this.Banner = "";
    var config = JSON.parse(atob(unescape(encodeURIComponent(data[0].value))));

    config.map((value: any) => {
      value.key = atob(unescape(encodeURIComponent(value.key)));
      value.value = atob(unescape(encodeURIComponent(value.value)));
      if (value.key === 'URL' && value.origin === 1) {
        this.dataconfig[0].value = value.value;
      }
      if (value.key === 'Color' && value.origin === 1) {
        this.dataconfig[1].value = value.value;
      }
      if (value.key === 'Titulo' && value.origin === 1) {
        this.dataconfig[2].value = value.value;
      }
      if (value.key === 'logo' && value.origin === 1) {
        this.dataconfig[3].value = value.value;
        if (value.value !== '') {
          this.Banner = 'corporateBanner.png';
        }
      }
      if (value.key === 'Banner' && value.origin === 1) {
        this.dataconfig[4].value = value.value;
        if (value.value !== '') {
          this.logo = 'corporateLogo.png';
        }
      }
      if (value.key === 'Informacion' && value.origin === 1) {
        this.dataconfig[5].value = value.value;
      }
      if (value.key === 'Informacion2' && value.origin === 1) {
        this.dataconfig[6].value = value.value;
      }
      if (value.key === 'Historico' && value.origin === 1) {
        this.dataconfig[7].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'HistoricoGrafica' && value.origin === 1) {
        this.dataconfig[8].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'HistoricoCombinado' && value.origin === 1) {
        this.dataconfig[9].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'Captcha' && value.origin === 1) {
        this.dataconfig[10].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'CambioContraseña' && value.origin === 1) {
        this.dataconfig[11].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'ValidaSaldoPendiente' && value.origin === 1) {
        this.dataconfig[12].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'BusquedaOrden' && value.origin === 1) {
        this.dataconfig[13].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'MostrarConfidenciales' && value.origin === 1) {
        this.dataconfig[14].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'BloqueaPanicos' && value.origin === 1) {
        this.dataconfig[15].value = value.value;
      }
      if (value.key === 'MostrarResultado' && value.origin === 1) {
        this.dataconfig[16].value = value.value;
      }
      if (value.key === 'LlaveCaptcha' && value.origin === 1) {
        this.dataconfig[17].value = value.value;
      }
      if (value.key === 'ServiciosLISUrl' && value.origin === 1) {
        this.dataconfig[18].value = value.value;
      }
      if (value.key === 'PathFE' && value.origin === 1) {
        this.dataconfig[19].value = value.value;
      }
      if (value.key === 'ServidorCorreo' && value.origin === 1) {
        this.dataconfig[20].value = value.value;
      }
      if (value.key === 'TerminosCondiciones' && value.origin === 1) {
        this.dataconfig[21].value = value.value;
      }
      if (value.key === 'CuerpoEmail' && value.origin === 1) {
        this.dataconfig[22].value = value.value;
      }
      if (value.key === 'SmtpAuthUser' && value.origin === 1) {
        this.dataconfig[23].value = value.value;
      }
      if (value.key === 'SmtpHostName' && value.origin === 1) {
        this.dataconfig[24].value = value.value;
      }
      if (value.key === 'SmtpPasswordUser' && value.origin === 1) {
        this.dataconfig[25].value = value.value;
      }
      if (value.key === 'SmtpPort' && value.origin === 1) {
        this.dataconfig[26].value = value.value;
      }
      if (value.key === 'SmtpSSL' && value.origin === 1) {
        this.dataconfig[27].value = value.value;
      }
      if (value.key === 'SmtpProtocol' && value.origin === 1) {
        this.dataconfig[28].value = value.value;
      }
      if (value.key === 'directReportPrint' && value.origin === 1) {
        this.dataconfig[29].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'UrlSecurity' && value.origin === 1) {
        this.dataconfig[30].value = value.value;
      }
      if (value.key === 'FiltroRangoFecha' && value.origin === 1) {
        this.dataconfig[31].value = value.value.toLowerCase() === 'false' ? false : true;
      }
      if (value.key === 'EmpaquetarOrdenesCliente' && value.origin === 1) {
        this.dataconfig[32].value = value.value.toLowerCase() === 'false' ? false : true;
      }
    });
    this.displayConfiguration = display;
    this.loaderDS.loading(false);
  }

  //Refresca los valores de los editores para que tome el html correctamente
  selectedTabsConfiguration(event: any) {
    if (event.index === 4) {
      this.formData.get('body').setValue(this.formData.get('body').value);
    }
    if (event.index === 3) {
      this.formData.get('termsConditions').setValue(this.dataconfig[21].value);
    }
  }

  //Conocer en que tab se encuentra el usuario para detectar el cambio de los campos y conocer el tipo de busqueda
  selectedTabsFilter(event: any) {
    this.typeFilter = event.index;
  }

  loadValuesConfiguration() {
    this.formData.get('name').setValue(this.dataconfig[2].value);
    this.formData.get('logo').setValue(this.logo);
    this.formData.get('banner').setValue(this.Banner);
    this.formData.get('color').setValue(this.dataconfig[1].value);
    this.formData.get('information').setValue(this.dataconfig[5].value);
    this.formData.get('informationAditional').setValue(this.dataconfig[6].value);
    this.formData.get('url').setValue(this.dataconfig[0].value);
    this.formData.get('urlLis').setValue(this.dataconfig[18].value);
    this.formData.get('urlSecurity').setValue(this.dataconfig[30].value);
    this.formData.get('urlReports').setValue(this.dataconfig[19].value);
    this.formData.get('history').setValue(this.dataconfig[7].value);
    this.formData.get('graphicHistory').setValue(this.dataconfig[8].value);
    this.formData.get('historicalCondensed').setValue(this.dataconfig[9].value);
    this.formData.get('loginCaptcha').setValue(this.dataconfig[10].value);
    this.formData.get('changePassword').setValue(this.dataconfig[11].value);
    this.formData.get('outstandingBalance').setValue(this.dataconfig[12].value);
    this.formData.get('orderSearch').setValue(this.dataconfig[13].value);
    this.formData.get('showConfidencials').setValue(this.dataconfig[14].value);
    this.formData.get('resultsAuto').setValue(this.dataconfig[29].value);
    this.formData.get('pacic').setValue(this.dataconfig[15].value);
    this.formData.get('showResults').setValue(this.dataconfig[16].value);
    this.formData.get('filterByDates').setValue(this.dataconfig[31].value);
    this.formData.get('sendCustomer').setValue(this.dataconfig[32].value);
    this.formData.get('termsConditions').setValue(this.dataconfig[21].value);
    this.formData.get('server').setValue(this.dataconfig[20].value);
    this.formData.get('protocol').setValue(this.dataconfig[24].value);
    this.formData.get('port').setValue(this.dataconfig[26].value);
    this.formData.get('encryption').setValue(this.dataconfig[27].value);
    this.formData.get('securityProtocol').setValue(this.dataconfig[28].value);
    this.formData.get('email').setValue(this.dataconfig[23].value);
    this.formData.get('passwordEmail').setValue(this.dataconfig[25].value);
    this.formData.get('body').setValue(this.dataconfig[22].value);
    this.getUserTypes.reset();
    while (this.getUserTypes.length !== 0) {
      this.getUserTypes.removeAt(0);
    }
    this.datauser.map((user: any) => {
      this.getUserTypes.push(
        this.formBuilder.group({
          index: new FormControl(this.getUserTypes.controls.length),
          type: new FormControl(user.type),
          message: new FormControl(user.message),
          quantityOrder: new FormControl(user.quantityOrder),
          image: new FormControl(user.image),
          imagelogo: new FormControl(null),
          visible: new FormControl({ value: user.visible, disabled: user.type === 4 }),
          confidential: new FormControl(user.confidential)
        }));
    });
  }

  setVariables(data: any) {
    var config = JSON.parse(atob(unescape(encodeURIComponent(data[0].value))));
    config.map((value: any) => {
      value.key = atob(unescape(encodeURIComponent(value.key)));
      value.value = atob(unescape(encodeURIComponent(value.value)));
    });
    this.TermsConditions = config.find((value: any) => value.key === 'TerminosCondiciones').value;
    this.Information = config.find((value: any) => value.key === 'Informacion').value;
    this.Information2 = config.find((value: any) => value.key === 'Informacion2').value;
    this.logoview = config.find((value: any) => value.key === 'Logo').value;
    this.Bannerview = config.find((value: any) => value.key === 'Banner').value;
    this.color = config.find((value: any) => value.key === 'Color').value;
    this.color = this.color === '' ? 'rgb(112, 150, 222)' : this.color;
    this.branch = config.find((value: any) => value.key === 'Entidad').value;
    const Historico = config.find((value: any) => value.key === 'Historico').value;
    this.Historico = Historico === 'True' || Historico === 'true' ? true : false;
    const HistoricoGrafica = config.find((value: any) => value.key === 'HistoricoGrafica').value;
    this.HistoricoGrafica = HistoricoGrafica === 'True' || HistoricoGrafica === 'true' ? true : false;
    const HistoricoCombinado = config.find((value: any) => value.key === 'HistoricoCombinado').value;
    this.HistoricoCombinado = HistoricoCombinado === 'True' || HistoricoCombinado === 'true' ? true : false;
    this.urlLIS = config.find((value: any) => value.key === 'ServiciosLISUrl').value;
    this.getPathReport = config.find((value: any) => value.key === 'PathFE').value;
    this.panicblock = config.find((value: any) => value.key === 'BloqueaPanicos').value;
    const BusquedaOrden = config.find((value: any) => value.key === 'BusquedaOrden').value;
    this.BusquedaOrden = BusquedaOrden === 'True' || BusquedaOrden === 'true' ? true : false;
    this.ImpresionDirectaReportes = config.find((value: any) => value.key === 'directReportPrint').value === 'true' ? true : false;
    this.FiltroRangoFecha = config.find((value: any) => value.key === 'FiltroRangoFecha').value === 'true' ? true : false;
    this.EmpaquetarOrdenesCliente = config.find((value: any) => value.key === 'EmpaquetarOrdenesCliente').value === 'true' ? true : false;
  }

  loadKeys() {
    const typeDocument = sessionStorage.getItem('ManejoTipoDocumento');
    this.typeDocument = typeDocument === 'True' || typeDocument === 'true' ? true : false;
    this.urlLIS = sessionStorage.getItem('ServiciosLISUrl');
    this.Bannerview = sessionStorage.getItem('Banner');
    this.color = sessionStorage.getItem('Color') === '' ? 'rgb(112, 150, 222)' : sessionStorage.getItem('Color');
    this.logoview = sessionStorage.getItem('Logo');
    this.Title = sessionStorage.getItem('Titulo');
    this.Information = sessionStorage.getItem('Informacion');
    this.Information2 = sessionStorage.getItem('Informacion2');
    this.URL = sessionStorage.getItem('URL');
    const user = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    if (user !== null && user !== undefined) {
      this.administrator = user.administrator;
      this.typeuser = user.type;
      this.viewpreliminar = this.typeuser === 4 ? true : false;
      this.viewpatient = this.typeuser === 2 ? false : true;
    }
    const BusquedaOrden = sessionStorage.getItem('BusquedaOrden');
    this.BusquedaOrden = BusquedaOrden === 'True' || BusquedaOrden === 'true' ? true : false;
    this.FiltroRangoFecha = sessionStorage.getItem('FiltroRangoFecha') == 'true' ? true : false;
    this.orderdigit = sessionStorage.getItem('DigitosOrden');
    this.cantdigit = parseInt(this.orderdigit) + 4;
    const HistoricoGrafica = sessionStorage.getItem('HistoricoGrafica');
    this.HistoricoGrafica = HistoricoGrafica === 'True' || HistoricoGrafica === 'true' ? true : false;
    const Historico = sessionStorage.getItem('Historico');
    this.Historico = Historico === 'True' || Historico === 'true' ? true : false;
    const HistoricoCombinado = sessionStorage.getItem('HistoricoCombinado');
    this.HistoricoCombinado = HistoricoCombinado === 'True' || HistoricoCombinado === 'true' ? true : false;
    this.keySecurityPolitics = sessionStorage.getItem('SecurityPolitics') === "True" ? true : false;
    if (this.keySecurityPolitics) {
      this.patternPassword = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,20}$");
    }
    this.TermsConditions = sessionStorage.getItem('TerminosCondiciones');
    this.getPathReport = sessionStorage.getItem('PathFE');
    this.formatDate = sessionStorage.getItem('FormatoFecha');
    this.formatDategraphip = this.formatDate === '' ? 'DD/MM/YYYY , h:mm:ss a' : this.formatDate.toUpperCase() + ', h:mm:ss a';
    this.EmpaquetarOrdenesCliente = sessionStorage.getItem('EmpaquetarOrdenesCliente') == 'true' && this.typeuser === 3 ? true : false;
  }

  closed() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  closeCofiguration() {
    this.displayConfiguration = "none";
  }

  closeImageProfile() {
    this.displayImageProfile = "none";
    this.imageprofil = "";
  }

  closeChangePassword() {
    this.displayChangePassword = "none";
  }

  closeComment() {
    this.displayComment = "none";
  }

  closeAntibiogram() {
    this.displayAntibiogram = "none";
  }

  closeCharts() {
    this.displayCharts = "none";
  }

  closeChartsData() {
    this.displayChartData = "none";
  }

  viewtermsandConditions() {
    this.displayConditions = "block";
  }

  closeConditions() {
    this.displayConditions = "none";
  }

  closeIdle() {
    this.displayIdle = "none";
  }

  addToBody(type: String) {
    const body = this.formData.get('body').value === null || this.formData.get('body').value === undefined ? '' : this.formData.get('body').value;
    switch (type) {
      case 'user':
        this.formData.get('body').setValue(`${body} ||USER||`);
        break;
      case 'link':
        this.formData.get('body').setValue(`${body} <p><a href=\"||LINK||\" rel=\"noopener noreferrer\" target=\"_blank\">Link para Cambiar contraseña</a></p>`);
        break;
      case 'date':
        this.formData.get('body').setValue(`${body} ||DATE||`);
        break;
      case 'lab':
        this.formData.get('body').setValue(`${body} ||LAB||`);
        break;
      default:
        break;
    }
  }

  init() {
    //Configuraciones
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
    this.maxDate = new Date();
    this.dataorder = [];
    this.selectedOrder = {};
    this.order
    this.loadKeys();
    this.getArea();
    this.getListYear();
    this.demographicsKey();
    if (!this.viewpatient) {
      this.search = {
        dateNumber: null,
        area: 0
      }
      this.getSearch();
    }
  }

  getOrderNumber(order: any, orderDigits: any) {
    order = "" + order;
    if (order.length > (orderDigits + 8)) {
      //La orden no es valida
      return null;
    } else if (order.length <= orderDigits) {
      //Solo envia el numero de la orden
      order = "0".repeat(orderDigits - order.length) + order;
      order = "" + moment().format("YYYYMMDD") + order;
      return order;
    } else if (order.length <= (orderDigits + 2)) {
      //Llega la orden solo con dia
      if (order.length === ((orderDigits + 1))) {
        //dia con un digito
        order = "" + moment().format("YYYYMM") + "0" + order;
      } else {
        //dia con dos digitos
        order = "" + moment().format("YYYYMM") + order;
      }
      return order;
    } else if (order.length <= (orderDigits + 4)) {
      //Llega la orden con mes y dia
      if (order.length === ((orderDigits + 3))) {
        //mes con un digito
        order = "" + moment().format("YYYY") + "0" + order;
      } else {
        //mes con dos digitos
        order = "" + moment().format("YYYY") + order;
      }
      return order;
    } else {
      //Llega la orden con mes y dia
      var year = "" + new Date().getFullYear();
      if (order.length === ((orderDigits + 5))) {
        //año con un digito
        order = year.substring(0, 3) + order;
      } else if (order.length === ((orderDigits + 6))) {
        //año con dos digitos
        order = year.substring(0, 2) + order;
      } else if (order.length === ((orderDigits + 7))) {
        //año con tres digitos
        order = year.substring(0, 1) + order;
      }
      return order;
    }
  }
}
