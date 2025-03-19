import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { UsertypeService } from 'src/app/services/configuration/usertype.service';
import { InterceptorService } from 'src/app/services/interceptor/interceptor.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/configuration/user.service';
import { NotifierService } from 'angular-notifier';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  tokenRecovery = this.route.snapshot.paramMap.get('token');
  @ViewChild('contentEmail') private contentEmail: ElementRef<HTMLElement>;
  private readonly notifier: NotifierService;

  patternPassword = new RegExp("");

  keySecurityPolitics = false;
  viewdemografhip = false;
  viewdemogra = false;
  viewtype = false;
  backgroundlogin = '';
  listDocumentype: any = [];
  documentTypeSelect = 0;
  demoname: any = {};
  listconfiguration = [{
    "key": "CuerpoEmail",//0
    "value": ""
  },
  {
    "key": "Captcha",//1
    "value": false
  },
  {
    "key": "CambioContraseña",//2
    "value": false
  },
  {
    "key": "TerminosCondiciones",//3
    "value": ""
  }, {
    "key": "URL",//4
    "value": ""
  },
  {
    "key": "Color",//5
    "value": ""
  },
  {
    "key": "Entidad",//6
    "value": ""
  },
  {
    "key": "Logo",//7
    "value": ""
  },
  {
    "key": "Banner",//8
    "value": ""
  },
  {
    "key": "Informacion",//9
    "value": ""
  },
  {
    "key": "Informacion2",//10
    "value": ""
  },
  {
    "key": "Titulo",//11
    "value": ""
  },
  {
    "key": "ManejoTipoDocumento",//12
    "value": ""
  },
  {
    "key": "SessionExpirationTime",//13
    "value": ""
  },
  {
    "key": "URL",//14
    "value": ""
  }];
  PHYSICIAN: any = {};
  RATE: any = {};
  PATIENT: any = {};
  ACCOUNT: any = {};
  USERLIS: any = {};
  USERDEMO: any = {};
  usertype = 1;
  user: any = {};
  userchangepassword: any = {};
  administrator = false;

  viewupdatepassword = false;
  // vm.viewupdatepassword = $location.$$search.token === undefined || $location.$$search.token === null ? false : true; PREGUNAR A JENNI

  menssageInvalid = '';
  formLoggin: FormGroup;
  submittedLoggin = false;
  displayConditions = "none";
  displayPasswordWarning = "none";
  displayForgetPassword = "none";
  displayChangePassword = "none";

  formForget: FormGroup;
  submittedForget = false;

  messagerecoverpassword = "";
  messagerecoverpasswordok = "";
  htmlContentEmail: any = "";
  attachmentimageemail: any = [];
  bodyEmail: any = "";

  formRecovery: FormGroup;
  submitteRecovery = false;
  messageupdatepassword = '';

  formChange: FormGroup;
  submitteChange = false;
  userchangePasswordId = 0;
  viewvalited = false;
  errorcaptchan=false;

  constructor(
    private configurationDS: ConfigurationService,
    private interceptorDS: InterceptorService,
    private userTypeDS: UsertypeService,
    private authDS: AuthService,
    private translate: TranslateService,
    private userDS: UserService,
    private notifierService: NotifierService,
    private loaderDS: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loaderDS.loading(false);
    sessionStorage.clear();
    this.notifier = notifierService;
    this.getconfiguration();
    this.initFormLoggin();
    this.initFormForget();
    this.initFormRecovery();

    if(this.tokenRecovery !== undefined && this.tokenRecovery !== null && this.tokenRecovery !== '') {
      this.viewupdatepassword = true;
    }
  }

  loadKeys() {
    this.keySecurityPolitics = sessionStorage.getItem('SecurityPolitics') === "True" ? true : false;
    if(this.keySecurityPolitics) {
      this.patternPassword = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,20}$");
    }
  }

  initFormLoggin() {
    this.formLoggin = new FormGroup({
      documentType: new FormControl(null, [Validators.required]),
      user: new FormControl('', [Validators.required,Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required]),
      recaptcha: new FormControl('')
    });
  }

  initFormForget() {
    this.formForget = new FormGroup({
      history: new FormControl('', [Validators.required]),
      emailrecovery: new FormControl('', [Validators.required, Validators.email])
    });
  }

  initFormRecovery() {
    this.formRecovery = new FormGroup({
      newPassword: new FormControl('', [Validators.required]),
      reNewPassword: new FormControl('', [Validators.required, Validators.pattern(this.patternPassword)])
    }, { validators: this.checkPasswords });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('reNewPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }
  validatedcapchat(mensaje) {
    this.errorcaptchan = mensaje;
  }

  forgetpassword() {
    this.formForget.reset();
    this.displayForgetPassword = 'block';
  }

  login() {
    this.submittedLoggin = true;
    if (!this.formLoggin.valid) { return false; }
    this.loaderDS.loading(true);
    this.menssageInvalid = ''
    this.user = this.formLoggin.value;
    this.user.type = this.usertype;
    if (this.usertype === 2) {
      this.user.historyType = this.listconfiguration[12].value === 'True' ? this.user.documentType : -1;
    }
    this.authDS.login(this.user).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        if (response.user.changePassword && response.user.type === 2) {
          this.menssageInvalid = '';
          this.userchangepassword = {
            'password1': '',
            'password2': ''
          }
          this.administrator = response.user.administrator === 'true';
          this.changepasswordview(response.user.id);
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        if (error.error.errorFields !== null) {
          if (error.error.errorFields[0] === 'La licencia registrada ha expirado.') {
            this.menssageInvalid = this.translate.instant('0180');
          } else {
            error.error.errorFields.map((value: any) => {
              var item = value.split('|');
              if (item[0] === '1' && item[1] === 'LDAP The authentication is not supported by the server') {
                this.menssageInvalid = this.translate.instant('0175');
              }
              if (item[0] === '2' && item[1] === 'Incorrect password or username LDAP') {
                this.menssageInvalid = this.translate.instant('0176');
              }
              if (item[0] === '3' && item[1] === 'LDAP fail conection') {
                this.menssageInvalid = this.translate.instant('0177');
              }
              if (item[0] === '4') {
                if (item[1] === 'inactive user') {
                  this.menssageInvalid = this.translate.instant('0164');
                } else {
                  this.menssageInvalid = this.translate.instant('0017');
                }
              }
              if (item[0] === '5') {
                if (item[2] !== undefined) {
                  if (item[2] === '1') {
                    this.menssageInvalid = this.translate.instant('0242') + " 2 " + this.translate.instant('0245');
                  } else if (item[2] === '2') {
                    this.menssageInvalid = this.translate.instant('0242') + " 1 " + this.translate.instant('0243');
                  } else if (item[2] === '3') {
                    this.menssageInvalid = this.translate.instant('0247');
                  } else {
                    this.menssageInvalid = this.translate.instant('0242') + item[2] + this.translate.instant('0245');
                  }
                } else {
                  this.menssageInvalid = this.translate.instant('0244');
                }
                this.displayPasswordWarning = "block";
              }
              if (item[0] === '3') {
                this.menssageInvalid = this.translate.instant('0247');
                this.displayPasswordWarning = "block";
              }
              if (item[0] === '6') {
                this.menssageInvalid = this.translate.instant('0019');
                if (item[1] === 'password expiration date') {
                  this.menssageInvalid = '';
                  this.userchangepassword = {
                    'password1': '',
                    'password2': ''
                  }
                  this.administrator = item[3] === 'true';
                  this.changepasswordview(item[2]);
                } else {
                  this.menssageInvalid = this.translate.instant('0165');
                }
              }
              if (item[0] === '7') {
                if (item[1] === 'change password') {
                  this.menssageInvalid = '';
                  this.userchangepassword = {
                    'password1': '',
                    'password2': ''
                  }
                  this.administrator = item[3] === 'true';
                  this.changepasswordview(item[2]);
                }
              }
              if (item[0] === '8') {
                this.menssageInvalid = this.translate.instant('0188');
              }
            })
            this.loaderDS.loading(false);
          }
        } else {
          this.loaderDS.loading(false);
          this.menssageInvalid = this.translate.instant('0017');
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  submitRecovery() {
    this.submitteRecovery = true;
    if (!this.formRecovery.valid) { return false; }
    this.loaderDS.loading(true);
    this.messageupdatepassword = '';
    let recovery = this.formRecovery.value;
    this.userDS.passwordReset(this.tokenRecovery, { "password": recovery.newPassword }).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        this.notifier.notify('info', this.translate.instant('0098'));
        setTimeout( () => {
          this.tokenRecovery = undefined;
          this.viewupdatepassword = false;
          this.router.navigateByUrl('/login');
        }, 1000);
      },
      error: (error: any) => {
        if(error.error !== null) {
          this.loaderDS.loading(false);
          if (error.error.message === '3|password not set') {
            this.notifier.notify('info', this.translate.instant('0099'));
            setTimeout( () => {
              this.tokenRecovery = undefined;
              this.viewupdatepassword = false;
            }, 2000);
          } else {
            this.notifier.notify('info', this.translate.instant('0251'));
            setTimeout( () => {
              this.tokenRecovery = undefined;
              this.viewupdatepassword = false;
            }, 2000);
          }
        } else {
          this.loaderDS.loading(false);
          this.menssageInvalid = this.translate.instant('0029');
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  submitFogetPassword() {
    this.submittedForget = true;
    if (!this.formForget.valid) { return false; }
    this.loaderDS.loading(true);
    this.messagerecoverpassword = "";
    this.messagerecoverpasswordok = "";
    let recovery = this.formForget.value;
    this.userDS.passwordRecovery(recovery.emailrecovery, this.usertype, recovery.history).subscribe({
      next: (response: any) => {
        this.loaderDS.loading(false);
        if (response[0].success) {
          let images = this.contentEmail.nativeElement.getElementsByTagName("img");
          this.attachmentimageemail = [];
          for (var i = 0; i < images.length; i++) {
            let pathimage = JSON.parse(JSON.stringify(images[i].src)).split(",");
            let image = {
              filename: 'image' + i + '.png',
              path: pathimage[1],
              cid: 'image' + i + '.png'
            }
            this.attachmentimageemail.push(image);
          }
          let contentemail: any = this.contentEmail.nativeElement.innerHTML;
          this.bodyEmail = JSON.parse(JSON.stringify(String(this.listconfiguration[0].value)));
          while (contentemail.indexOf('||USER||') !== -1) {
            contentemail = contentemail.replace('||USER||', response[0].user.userName);
          }
          contentemail = contentemail.replace('||LINK||', location.origin + '/login/' + response[0].token);
          while (contentemail.indexOf('||DATE||') !== -1) {
            contentemail = contentemail.replace('||DATE||', moment().format('YYYY/MM/DD h:mm:ss'));
          }
          while (contentemail.indexOf('||LAB||') !== -1) {
            contentemail = contentemail.replace('||LAB||', this.listconfiguration[11].value);
          }
          var email = {
            subject: this.translate.instant('0094'),
            body: contentemail,
            recipients: [response[0].user.email],
            attachment: this.attachmentimageemail
          }
          this.sendEmailRecoveryPassword(response[0].token, email);
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        if (error.error.code === 0) {
          if (error.error.message === '3|mail not found') {
            this.messagerecoverpassword = this.translate.instant('0095');
          } else if (error.error.message === '2|user not found') {
            this.messagerecoverpassword = this.translate.instant('0250');
          } else {
            this.messagerecoverpassword = this.translate.instant('0096');
          }
        } else {
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  submitChangePassword() {
    this.submitteRecovery = true;
    if (!this.formRecovery.valid) { return false; }
    this.loaderDS.loading(true);
    let recovery = this.formRecovery.value;
    this.viewvalited = false;
    var user = {
      idUser: this.userchangePasswordId,
      userName: this.user.user,
      passwordOld: this.user.password,
      passwordNew: recovery.newPassword,
      type: this.usertype
    }
    this.userDS.changePasswordExpirit(user).subscribe({
      next: (response) => {
        this.loaderDS.loading(false);
        this.viewvalited = false;
        this.displayChangePassword = 'none';
        this.notifier.notify('info', this.translate.instant('0098'));
      },
      error: (error: any) => {
        if(error.error !== null) {
          this.loaderDS.loading(false);
          error.error.errorFields.map( (value:any) => {
            var item = value.split('|');
            if (item[0] === '1') {
              this.viewvalited = true;
            }
          });
        } else {
          this.loaderDS.loading(false);
          this.menssageInvalid = this.translate.instant('0029');
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  sendEmailRecoveryPassword(token:any, email:any) {
    this.loaderDS.loading(true);
    this.userDS.passwordRecoveryEmail(token, email).subscribe({
      next: (response: any) => {
        this.loaderDS.loading(false);
        if (response === 'Se a generado un error a la hora de hacer el envio') {
          this.messagerecoverpassword = this.translate.instant('0204');
        } else {
          this.htmlContentEmail = this.bodyEmail;
          this.closeForgetPassword();
          this.notifier.notify('info', this.translate.instant('0102'));
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        if (error.statusText === "Internal Server Error") {
          if (error.error.message === "2|user not found") {
            this.messagerecoverpassword = 'Usuario no encontrado';
          } else {
            this.messagerecoverpassword = 'Internal Server Error';
          }
        } else {
          this.closeForgetPassword();
          this.notifier.notify('error', this.translate.instant('0029'));
          this.interceptorDS.hasError(true, error.message, error.url);
        }
      }
    });
  }

  changepasswordview(id: any) {
    this.displayChangePassword = 'block';
    this.userchangePasswordId = id;
  }

  viewtermsandConditions() {
    this.displayConditions = "block";
  }

  getconfiguration() {
    this.viewdemografhip = false;
    this.viewdemogra = false;
    this.viewtype = false;
    this.authDS.autoLogin().subscribe({
      next: (resp) => {
        if(resp !== null && resp !== undefined && resp.success === true) {
          this.configurationDS.getConfiguration(resp.token).subscribe({
            next: (response) => {
              this.arrayslist(response);
              this.getusertype();
            },
            error: (error: any) => {
              this.interceptorDS.hasError(true, error.message, error.url);
            }
          });
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.menssageInvalid = this.translate.instant('0017');
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  arrayslist(data: any) {
    let config = JSON.parse(atob(unescape(encodeURIComponent(data[0].value))));
    config.map((value: any) => {
      value.key = atob(unescape(encodeURIComponent(value.key)));
      value.value = atob(unescape(encodeURIComponent(value.value)));
      if (value.key === 'FondoLogin') {
        this.backgroundlogin = value.value;
      }
      if (value.key === 'ManejoTipoDocumento' && value.value === 'True') {
        this.viewtype = true;
        this.getDocumenttype();
      }
      if (value.key === 'ManejoDemograficoConsultaWeb' && value.value === 'True') {
        this.viewdemogra = true;
        this.getDemoConsultaWeb();
      }

      if (value.key === 'CuerpoEmail') {
        this.listconfiguration[0].value = value.value;
        this.htmlContentEmail = this.listconfiguration[0].value;
      }

      if (value.key === 'Captcha') {
        this.listconfiguration[1].value = value.value.toLowerCase() === 'false' ? false : true;
        this.errorcaptchan = value.value.toLowerCase() === 'false' ? true : false;
      }

      if (value.key === 'CambioContraseña') {
        this.listconfiguration[2].value = value.value.toLowerCase() === 'false' ? false : true;
      }

      if (value.key === 'TerminosCondiciones') {
        this.listconfiguration[3].value = value.value;
      }

      if (value.key === 'URL') {
        this.listconfiguration[4].value = value.value;
      }

      if (value.key === 'Color') {
        this.listconfiguration[5].value = value.value === '' ? 'rgb(112, 150, 222)' : value.value;
      }

      if (value.key === 'Entidad') {
        this.listconfiguration[6].value = value.value;
      }

      if (value.key === 'Logo') {
        this.listconfiguration[7].value = value.value;
      }

      if (value.key === 'Banner') {
        this.listconfiguration[8].value = value.value;
      }

      if (value.key === 'Informacion') {
        this.listconfiguration[9].value = value.value;
      }

      if (value.key === 'Informacion2') {
        this.listconfiguration[10].value = value.value;
      }

      if (value.key === 'Titulo') {
        this.listconfiguration[11].value = value.value;
      }

      if (value.key === 'ManejoTipoDocumento') {
        this.listconfiguration[12].value = value.value;
      }

      if (value.key === 'SessionExpirationTime') {
        this.listconfiguration[13].value = value.value;
      }

      if (value.key === 'URL') {
        this.listconfiguration[14].value = value.value;
      }

      if (value.key === 'ServiciosLISUrl' ||
        value.key === 'SessionExpirationTime' ||
        value.key === 'SecurityPolitics' ||
        value.key === 'Color' ||
        value.key === 'TerminosCondiciones' ||
        value.key === 'Informacion' ||
        value.key === 'Informacion2' ||
        value.key === 'Logo' ||
        value.key === 'Banner' ||
        value.key === 'Entidad' ||
        value.key === 'Titulo' ||
        value.key === 'FormatoFecha' ||
        value.key === 'BusquedaOrden' ||
        value.key === 'Historico' ||
        value.key === 'HistoricoGrafica' ||
        value.key === 'HistoricoCombinado' ||
        value.key === 'DigitosOrden' ||
        value.key === 'HistoriaAutomatica' ||
        value.key === 'ManejoTipoDocumento' ||
        value.key === 'BloqueaPanicos' ||
        value.key === 'PathFE' ||
        value.key === 'directReportPrint' ||
        value.key === 'ManejoDemograficoConsultaWeb' ||
        value.key === 'EmpaquetarOrdenesCliente' ||
        value.key === 'FiltroRangoFecha'
      ) {
        sessionStorage.setItem(value.key, value.value);
      }
    });
    this.loadKeys();
  }

  getDocumenttype() {
    this.listDocumentype = [];
    this.configurationDS.getDocumentype().subscribe({
      next: (response: any) => {
        this.listDocumentype = response;
        if (this.listDocumentype.length > 0) {
          this.formLoggin.get('documentType').setValue(this.listDocumentype[0].id);
        }
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

  getusertype() {
    this.userTypeDS.getUserType().subscribe({
      next: (response: any) => {
        this.PHYSICIAN = response.find((data: any) => data.type === 1);
        this.PHYSICIAN.image = this.PHYSICIAN.image === '' ? 'assets/images/physician.png' : 'data:image/jpeg;base64,' + this.PHYSICIAN.image;

        this.RATE = response.find((data: any) => data.type === 6);
        this.RATE.image = this.RATE.image === '' ? 'assets/images/physician.png' : 'data:image/jpeg;base64,' + this.RATE.image;

        this.PATIENT = response.find((data: any) => data.type === 2);
        this.PATIENT.image = this.PATIENT.image === '' ? 'assets/images/patient.png' : 'data:image/jpeg;base64,' + this.PATIENT.image;

        this.ACCOUNT = response.find((data: any) => data.type === 3);
        this.ACCOUNT.image = this.ACCOUNT.image === '' ? 'assets/images/patient.png' : 'data:image/jpeg;base64,' + this.ACCOUNT.image;

        this.USERLIS = response.find((data: any) => data.type === 4);
        this.USERLIS.image = this.USERLIS.image === '' ? 'assets/images/physician.png' : 'data:image/jpeg;base64,' + this.USERLIS.image;
        this.USERLIS.message = this.USERLIS.message === '' ? 'Acceso a los usuarios del laboratorio' : this.USERLIS.message;

        this.USERDEMO = response.find((data: any) => data.type === 5);
        this.USERDEMO.image = this.USERDEMO.image === '' ? 'assets/images/patient.png' : 'data:image/jpeg;base64,' + this.USERDEMO.image;

        if (this.PHYSICIAN.visible === true) {
          this.usertype = 1;
        } if (this.RATE.visible === true) {
          this.usertype = 6;
        } else if (this.PATIENT.visible === true) {
          this.usertype = 2;
        } else if (this.ACCOUNT.visible === true) {
          this.usertype = 3;
        } else if (this.USERLIS.visible === true) {
          this.usertype = 4;
        } else if (this.USERDEMO.visible === true) {
          this.usertype = 5;
        } else if (this.RATE.visible === true) {
          this.usertype = 6;
        } else {
          this.usertype = 4;
        }
      },
      error: (error: any) => {
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  closeConditions() {
    this.displayConditions = "none";
  }

  closeWarningPassword() {
    this.displayPasswordWarning = "none";
  }

  closeForgetPassword() {
    this.displayForgetPassword = "none";
  }

  closeChangePassword() {
    this.displayChangePassword = "none";
  }

}
