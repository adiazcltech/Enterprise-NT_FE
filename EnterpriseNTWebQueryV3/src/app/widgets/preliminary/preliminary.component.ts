import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { InterceptorService } from 'src/app/services/interceptor/interceptor.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PreliminaryService } from 'src/app/services/preliminary/preliminary.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { PDFDocument } from 'pdf-lib';
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.viewer';

@Component({
  selector: 'app-preliminary',
  templateUrl: './preliminary.component.html',
  styleUrls: ['./preliminary.component.css']
})
export class PreliminaryComponent implements OnInit, OnDestroy {
  private readonly notifier: NotifierService;
  subscription: Subscription;

  type = 0;
  formatDate = "";
  listreports = "";
  order = "";
  listTest: any = [];
  demographicTemplate: any = [];
  referenceDemographic: any = [];
  nameDemographic: any = [];
  idiome: any = [];
  download = "";
  testaidafilter: any = [];
  keyStimulsoft: string;
  datareport: any;
  urlReports = "";

  constructor(
    private preliminaryDS: PreliminaryService,
    private orderDS: OrderService,
    private interceptorDS: InterceptorService,
    private notifierService: NotifierService,
    private loaderDS: LoaderService,
    private translate: TranslateService
    ) {
    this.loaderDS.loading(false);
    this.notifier = notifierService;
    this.keyStimulsoft = environment.keyStimulsoft;
    this.urlReports = atob(environment.urlReports);
  }

  ngOnInit() {
    this.subscription = this.preliminaryDS.open$.subscribe(data => {
      if(data !== null && data !== undefined) {
        this.init(data);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  init(data:any) {
    this.type = data.type;
    this.formatDate = sessionStorage.getItem('FormatoFecha').toUpperCase();
    this.formatDate = this.formatDate === '' ? 'DD/MM/YYYY' : this.formatDate;
    this.listreports = data.listreports;
    this.order = data.order;
    this.listTest = data.tests;
    this.demographicTemplate = data.demographictemplate;
    this.referenceDemographic = data.referencedemographic;
    this.nameDemographic = data.namedemographic;
    this.idiome = data.idiome;
    this.download = data.download;
    this.keyConfiguration();
  }

  keyConfiguration() {
    if (this.listreports !== undefined) {
      if (this.type === 1) {
        this.getOrder();
      } else {
        this.getOrderend();
      }
    }
  }

  getOrder() {
    this.loaderDS.loading(true);
    var json = {
      rangeType: 1,
      init: this.order,
      end: this.order
    };

    this.orderDS.getOrderHeader(json).subscribe({
      next: (response: any) => {
        if(response.length > 0) {
          var data = {
            printOrder: [{
            physician: null,
            listOrders: [{
              order: response[0]
            }]
          }],
            typeReport: 2,
            isAttached: true
          };

          this.orderDS.printreport(data).subscribe({
            next: (resp: any) => {
              if (resp !== '' && resp !== null && resp !== undefined) {
                if (resp.resultTest.length !== 0) {
                  let listechnique = [];
                  resp.resultTest.map((value:any) => {
                    value.technique = value.technique === undefined ? '' : value.technique;
                    if (value.profileId === 0) {
                      value.viewvalidationUser = true;
                      value.viewtechnique = true;
                      value.techniqueprofile = value.technique
                    } else {
                      let filtertecnique = JSON.parse(JSON.stringify(listechnique)).find( (e:any) => e.profileId === value.profileId);
                      if (filtertecnique) {
                        if (value.technique === filtertecnique.technique) {
                          value.viewtechnique = false;
                        } else {
                          value.viewtechnique = true;
                        }
                        value.techniqueprofile = filtertecnique.technique;
                      } else {
                        let dataperfil = resp.resultTest.filter( (e:any) => e.profileId === value.profileId);
                        dataperfil = _.orderBy(dataperfil, 'printSort', 'asc');
                        if (dataperfil.length !== 0) {
                          dataperfil.forEach((value:any, key:any) => {
                            if (dataperfil[key].validationUserId != undefined) {
                              if (key === dataperfil.length - 1) {
                                value.viewvalidationUser = true;
                              } else if (dataperfil[key].validationUserId !== dataperfil[key + 1].validationUserId) {
                                value.viewvalidationUser = true;
                              } else {
                                value.viewvalidationUser = false;
                              }
                            } else {
                              value.viewvalidationUser = false;
                            }
                          });
                        }
                        let find = _.map(dataperfil, 'technique').reduce((acc, curr) => {
                          if (typeof acc[curr] == 'undefined') {
                            acc[curr] = 1;
                          } else {
                            acc[curr] += 1;
                          } return acc;
                        }, {});
                        let find2 = []
                        for (let propiedad in find) {
                          let object = {
                            technique: [propiedad][0],
                            occurrence: find[propiedad]
                          };
                          find2.push(object);
                        }
                        find = _.orderBy(find2, 'occurrence', 'desc');
                        if (find[0].technique === value.technique) {
                          value.viewtechnique = false;
                        } else {
                          value.viewtechnique = true;
                        }
                        value.techniqueprofile = find[0].technique;
                        let resulttechnique = {
                          profileId: value.profileId,
                          technique: value.techniqueprofile,
                        }
                        listechnique.push(resulttechnique);
                      }
                    }
                    value.result = this.type === 1 ? this.translate.instant('0233') : value.result;
                    value.refMin = value.refMin === null || value.refMin === '' || value.refMin === undefined ? 0 : value.refMin;
                    value.refMax = value.refMax === null || value.refMax === '' || value.refMax === undefined ? 0 : value.refMax;
                    value.panicMin = value.panicMin === null || value.panicMin === '' || value.panicMin === undefined ? 0 : value.panicMin;
                    value.panicMax = value.panicMax === null || value.panicMax === '' || value.panicMax === undefined ? 0 : value.panicMax;
                    value.reportedMin = value.reportedMin === null || value.reportedMin === '' || value.reportedMin === undefined ? 0 : value.reportedMin;
                    value.reportedMax = value.reportedMax === null || value.reportedMax === '' || value.reportedMax === undefined ? 0 : value.reportedMax;
                    value.digits = value.digits === null || value.digits === '' || value.digits === undefined ? 0 : value.digits;
                    value.refMinview = parseFloat(value.refMin).toFixed(value.digits);
                    value.refMaxview = parseFloat(value.refMax).toFixed(value.digits);
                    value.panicMinview = parseFloat(value.panicMin).toFixed(value.digits);
                    value.panicMaxview = parseFloat(value.panicMax).toFixed(value.digits);
                    value.reportedMinview = parseFloat(value.reportedMin).toFixed(value.digits);
                    value.reportedMaxview = parseFloat(value.reportedMax).toFixed(value.digits);
                  });
                }
                var dataOrder = resp;
                if (dataOrder.allDemographics.length > 0) {
                  dataOrder.allDemographics.forEach((value2: any) => {
                    dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                    dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                  });
                }
                if (dataOrder.comments.length > 0) {
                  dataOrder.comments.forEach((value:any) => {
                    try {
                      var comment = JSON.parse(value.comment);
                      comment = comment.content;
                      value.comment = comment.substring(1, comment.length - 1)
                    }
                    catch (e) {
                      value.comment = value.comment;
                    }
                  });
                }
                dataOrder.createdDate = moment(dataOrder.createdDate).format(this.formatDate + ' hh:mm:ss a.');
                dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(this.formatDate);
                dataOrder.patient.age = this.getAgeAsString(dataOrder.patient.birthday, this.formatDate);
                this.orderDS.getUserValidate(this.order).subscribe({
                  next: (datafirm: any) => {
                    dataOrder.listfirm = [];
                    for (let i = 0; i < dataOrder.resultTest.length; i++) {
                      dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(this.formatDate + ' hh:mm:ss a.');
                      if (dataOrder.resultTest[i].microbiologyGrowth !== undefined) {
                        dataOrder.resultTest[i].microbiologyGrowth.lastTransaction = moment(dataOrder.resultTest[i].microbiologyGrowth.lastTransaction).format(this.formatDate + ' hh:mm:ss a.');
                      }
                      if (dataOrder.resultTest[i].hasAntibiogram) {
                        dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
                      }
                      if (dataOrder.resultTest[i].validationUserId !== undefined) {
                        let findfirm = _.filter(dataOrder.listfirm, (o) => {
                          return o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId;
                        })[0];
                        let user = _.filter(datafirm.data, (o) => { return o.id === dataOrder.resultTest[i].validationUserId });
                        if (findfirm === undefined) {
                          let firm = {
                            areaId: dataOrder.resultTest[i].areaId,
                            areaName: dataOrder.resultTest[i].areaName,
                            validationUserId: dataOrder.resultTest[i].validationUserId,
                            validationUserIdentification: dataOrder.resultTest[i].validationUserIdentification,
                            validationUserName: dataOrder.resultTest[i].validationUserName,
                            validationUserLastName: dataOrder.resultTest[i].validationUserLastName,
                            firm: user.length === 0 ? '' : user[0].photo
                          };
                          dataOrder.listfirm.push(firm);
                        }
                      }
                    }

                    this.testaidafilter = _.filter(dataOrder.resultTest, (o) => {
                      return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                    }).length > 0;

                    dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                    this.openReport(dataOrder);

                  },
                  error: (error: any) => {
                    this.loaderDS.loading(false);
                    this.interceptorDS.hasError(true, error.message, error.url);
                  }
                });
              } else {
                this.notifier.notify('info', this.translate.instant('0278'));
                this.loaderDS.loading(false);
              }
            },
            error: (error: any) => {
              this.loaderDS.loading(false);
              this.interceptorDS.hasError(true, error.message, error.url);
            }
          });
        } else {
          this.notifier.notify('info', this.translate.instant('0278'));
          this.loaderDS.loading(false);
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getOrderend() {
    var json = {
      rangeType: 1,
      init: this.order,
      end: this.order
    };
    this.loaderDS.loading(true);
    this.orderDS.getOrderHeader(json).subscribe({
      next: (response: any) => {
        if (response.length > 0) {
          let data = {
            printOrder: [
              {
                physician: null,
                listOrders: [
                  {
                    order: response[0]
                  }
                ]
              }
            ],
            typeReport: 0,
            isAttached: true
          };

          this.orderDS.getOrderPreliminaryend(data).subscribe({
            next: (resp: any) => {
              if (resp !== '' && resp !== null && resp !== undefined) {
                this.datareport = resp.listOrders[0];
                let dataOrder = resp.listOrders[0].order;
                if (dataOrder.resultTest.length > 0) {
                  let listechnique = [];
                  dataOrder.resultTest.map((value:any) => {
                    value.technique = value.technique === undefined ? '' : value.technique;
                    if (value.profileId === 0) {
                      value.viewvalidationUser = true;
                      value.viewtechnique = true;
                      value.techniqueprofile = value.technique
                    } else {
                      let filtertecnique = JSON.parse(JSON.stringify(listechnique)).find((e: any) => e.profileId === value.profileId);
                      if (filtertecnique) {
                        if (value.technique === filtertecnique.technique) {
                          value.viewtechnique = false;
                        } else {
                          value.viewtechnique = true;
                        }
                        value.techniqueprofile = filtertecnique.technique;
                      } else {
                        let dataperfil = dataOrder.resultTest.filter((e:any) => e.profileId === value.profileId);
                        dataperfil = _.orderBy(dataperfil, 'printSort', 'asc');
                        if (dataperfil.length !== 0) {
                          dataperfil.forEach((value:any, key:any) => {
                            if (dataperfil[key].validationUserId != undefined) {
                              if (key === dataperfil.length - 1) {
                                value.viewvalidationUser = true;
                              } else if (dataperfil[key].validationUserId !== dataperfil[key + 1].validationUserId) {
                                value.viewvalidationUser = true;
                              } else {
                                value.viewvalidationUser = false;
                              }
                            } else {
                              value.viewvalidationUser = false;
                            }
                          });
                        }
                        let find = _.map(dataperfil, 'technique').reduce((acc, curr) => {
                          if (typeof acc[curr] == 'undefined') {
                            acc[curr] = 1;
                          } else {
                            acc[curr] += 1;
                          } return acc;
                        }, {});
                        let find2 = []
                        for (let propiedad in find) {
                          let object = {
                            technique: [propiedad][0],
                            occurrence: find[propiedad]
                          };
                          find2.push(object);
                        }
                        find = _.orderBy(find2, 'occurrence', 'desc');
                        if (find[0].technique === value.technique) {
                          value.viewtechnique = false;
                        } else {
                          value.viewtechnique = true;
                        }
                        value.techniqueprofile = find[0].technique;
                        let resulttechnique = {
                          profileId: value.profileId,
                          technique: value.techniqueprofile,
                        }
                        listechnique.push(resulttechnique);
                      }
                    }
                    value.refMin = value.refMin === null || value.refMin === '' || value.refMin === undefined ? 0 : value.refMin;
                    value.refMax = value.refMax === null || value.refMax === '' || value.refMax === undefined ? 0 : value.refMax;
                    value.panicMin = value.panicMin === null || value.panicMin === '' || value.panicMin === undefined ? 0 : value.panicMin;
                    value.panicMax = value.panicMax === null || value.panicMax === '' || value.panicMax === undefined ? 0 : value.panicMax;
                    value.reportedMin = value.reportedMin === null || value.reportedMin === '' || value.reportedMin === undefined ? 0 : value.reportedMin;
                    value.reportedMax = value.reportedMax === null || value.reportedMax === '' || value.reportedMax === undefined ? 0 : value.reportedMax;
                    value.digits = value.digits === null || value.digits === '' || value.digits === undefined ? 0 : value.digits;
                    value.refMinview = parseFloat(value.refMin).toFixed(value.digits);
                    value.refMaxview = parseFloat(value.refMax).toFixed(value.digits);
                    value.panicMinview = parseFloat(value.panicMin).toFixed(value.digits);
                    value.panicMaxview = parseFloat(value.panicMax).toFixed(value.digits);
                    value.reportedMinview = parseFloat(value.reportedMin).toFixed(value.digits);
                    value.reportedMaxview = parseFloat(value.reportedMax).toFixed(value.digits);
                  });
                }
                if (dataOrder.allDemographics.length > 0) {
                  dataOrder.allDemographics.forEach((value2:any) => {
                    dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                    dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                  });
                }
                if (dataOrder.comments.length > 0) {
                  dataOrder.comments.forEach((value:any) => {
                    try {
                      let comment = JSON.parse(value.comment);
                      comment = comment.content;
                      value.comment = comment.substring(1, comment.length - 1)
                    }
                    catch (e) {
                      value.comment = value.comment;
                    }
                  });
                }
                dataOrder.createdDate = moment(dataOrder.createdDate).format(this.formatDate + ' hh:mm:ss a.');
                dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(this.formatDate);
                dataOrder.patient.age = this.getAgeAsString(dataOrder.patient.birthday, this.formatDate);
                dataOrder.attachments = this.datareport.attachments === undefined ? [] : this.datareport.attachments;

                this.orderDS.getUserValidate(this.order).subscribe({
                  next: (datafirm: any) => {
                    dataOrder.listfirm = [];
                    for (let i = 0; i < dataOrder.resultTest.length; i++) {
                      dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(this.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(this.formatDate + ' hh:mm:ss a.');
                      if (dataOrder.resultTest[i].microbiologyGrowth !== undefined) {
                        dataOrder.resultTest[i].microbiologyGrowth.lastTransaction = moment(dataOrder.resultTest[i].microbiologyGrowth.lastTransaction).format(this.formatDate + ' hh:mm:ss a.');
                      }
                      if (dataOrder.resultTest[i].hasAntibiogram) {
                        dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
                      }
                      if (dataOrder.resultTest[i].validationUserId !== undefined) {
                        var findfirm = _.filter(dataOrder.listfirm, (o) => o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId)[0];
                        var user = _.filter(datafirm.data, (o) => o.id === dataOrder.resultTest[i].validationUserId );
                        if (findfirm === undefined) {
                          var firm = {
                            areaId: dataOrder.resultTest[i].areaId,
                            areaName: dataOrder.resultTest[i].areaName,
                            validationUserId: dataOrder.resultTest[i].validationUserId,
                            validationUserIdentification: dataOrder.resultTest[i].validationUserIdentification,
                            validationUserName: dataOrder.resultTest[i].validationUserName,
                            validationUserLastName: dataOrder.resultTest[i].validationUserLastName,
                            firm: user.length === 0 ? '' : user[0].photo
                          };
                          dataOrder.listfirm.push(firm);
                        }
                      }
                    }

                    this.testaidafilter = _.filter(dataOrder.resultTest, (o) => {
                      return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                    }).length > 0;

                    dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                    this.printOrder(dataOrder);
                  },
                  error: (error: any) => {
                    this.loaderDS.loading(false);
                    this.interceptorDS.hasError(true, error.message, error.url);
                  }
                });
              } else {
                this.notifier.notify('info', this.translate.instant('0278'));
                this.loaderDS.loading(false);
              }
            },
            error: (error: any) => {
              this.loaderDS.loading(false);
              this.interceptorDS.hasError(true, error.message, error.url);
            }
          });
        } else {
          this.notifier.notify('info', this.translate.instant('0278'));
          this.loaderDS.loading(false);
        }
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  printOrder(order:any) {
    order.resultTest = this.listTest.filter(e => order.resultTest.some(t => t.testId === e.testId));
    const auth = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    var parameterReport:any = {};
    parameterReport.variables = {
      username: auth.userName,
      titleReport: 'Informe final',
      date: moment().format(this.formatDate + ' hh:mm:ss a.'),
      formatDate: this.formatDate,
      codeorder: "/orqrm:" + btoa(this.order),
      destination: "2",
      typeprint: "1",
      testfilterview: this.testaidafilter
    };
    parameterReport.pathreport = this.urlReports + '/reports/' + this.getTemplateReport(order);
    parameterReport.labelsreport = this.idiome;
    this.setReport(parameterReport, order);
  }

  openReport(order:any) {
    order.resultTest = this.listTest.filter(e => order.resultTest.some(t => t.testId === e.testId));
    const auth = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));
    let parameterReport:any = {};
    parameterReport.variables = {
      username: auth.userName,
      titleReport: 'Informe preliminar',
      date: moment().format(this.formatDate + ' hh:mm:ss a.'),
      formatDate: this.formatDate,
      reportOrder: true,
      codeorder: "/orqrm:" + btoa(this.order),
      destination: "2",
      typeprint: "4",
      testfilterview: this.testaidafilter
    };
    parameterReport.pathreport = this.urlReports + '/reports/' + this.getTemplateReport(order);
    parameterReport.labelsreport = this.idiome;
    this.setReport(parameterReport, order);
  }

  getTemplateReport(order:any) {
    let template = '';
    if (this.demographicTemplate !== null) {
      if (this.demographicTemplate.encoded && this.demographicTemplate.id > 0) {
        order.demographicItemTemplate = _.filter(order.allDemographics, (o) => {
          return o.idDemographic === this.demographicTemplate.id;
        })[0];
        template = this.nameDemographic + '_' + order.demographicItemTemplate.codifiedCode + '.mrt';
      } else if (this.demographicTemplate.encoded && this.demographicTemplate.id === -7 || this.demographicTemplate.encoded && this.demographicTemplate.id === -10) {
        if (this.demographicTemplate.id === -7) {
          order.demographicItemTemplate = order.patient.race;
          template = this.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
        } else {
          order.demographicItemTemplate = order.patient.documentType;
          template = this.nameDemographic + '_' + order.demographicItemTemplate.abbr + '.mrt';
        }
      } else if (this.demographicTemplate.encoded && this.demographicTemplate.id < 0) {
        order.demographicItemTemplate = order[this.referenceDemographic];
        template = this.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
      } else {
        template = this.nameDemographic + '.mrt';
      }
      if (_.filter(this.listreports, (o:any) => {
        return o.name === template
      }).length > 0) {
        return template;
      } else {
        return 'reports.mrt';
      }
    } else {
      return 'reports.mrt';
    }
  }

  setReport(parameterReport:any, datareport:any) {
    setTimeout(() => {
      Stimulsoft.Base.StiLicense.Key = this.keyStimulsoft;
      let report = new Stimulsoft.Report.StiReport();
      report.loadFile(parameterReport.pathreport);
      let jsonData = {
        order: datareport,
        Labels: [parameterReport.labelsreport],
        variables: [parameterReport.variables]
      };
      var dataSet = new Stimulsoft.System.Data.DataSet();
      dataSet.readJson(jsonData);
      report.dictionary.databases.clear();
      report.regData('Demo', 'Demo', dataSet);
      report.renderAsync(() => {
        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
        var service = new Stimulsoft.Report.Export.StiPdfExportService();
        var stream = new Stimulsoft.System.IO.MemoryStream();
        service.exportToAsync(() => {
          var data = stream.toArray();
          var buffer = new Uint8Array(data);
          this.copyPages(buffer, datareport.attachments);
        }, report, stream, settings);
      });
    }, 50);
  }

  copyPages(reportpreview:any, attachments:any) {
    const pdfDocRes = PDFDocument.create();
    pdfDocRes.then((pdfDoc:any) => {
      let firstDonorPdfDoc = PDFDocument.load(reportpreview, {
        ignoreEncryption: true
      });
      firstDonorPdfDoc.then((greeting) => {
        let firstDonorPageRes = pdfDoc.copyPages(greeting, greeting.getPageIndices());
        firstDonorPageRes.then( (firstDonorPage:any) => {
          firstDonorPage.forEach((page: any) => {
            pdfDoc.addPage(page);
          });
          if (attachments.length > 0) {
            let mergepdfs: Promise<PDFDocument>;
            let calcula = 0;
            let pdfs = _.filter(attachments, (o) => { return o.extension === 'pdf'; });
            let images = _.filter(attachments, (o) => { return o.extension !== 'pdf'; });
            if (pdfs.length > 0) {
              this.orderDS.mergepdf(pdfs).subscribe({
                next: (response: any) => {
                  let reportbasee64 = this._base64ToArrayBuffer(response);
                  mergepdfs = PDFDocument.load(reportbasee64, {
                    ignoreEncryption: true
                  });
                  mergepdfs.then((listbufferelement: any) => {
                    let copiedPagesRes = pdfDoc.copyPages(listbufferelement, listbufferelement.getPageIndices());
                    copiedPagesRes.then((copiedPages: any) => {
                      copiedPages.forEach((page: any) => {
                        pdfDoc.addPage(page);
                      });
                      if (pdfs.length === 1) {
                        let totalpages = pdfDoc.getPages().length;
                        pdfDoc.removePage(totalpages - 1);
                      }
                      if (images.length > 0) {
                        this.loadImages(images, calcula, pdfDoc);
                      } else {
                        pdfDoc.save().then((pdf:any) => {
                          let pdfUrl = URL.createObjectURL(new Blob([pdf], {
                            type: 'application/pdf'
                          }));
                          if (this.download === '1') {
                            let a = document.createElement("a");
                            a.setAttribute("download", this.order + ".pdf");
                            a.setAttribute("href", pdfUrl);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          } else {
                            window.open(pdfUrl, '_blank');
                          }
                          if (this.type === 2) {
                            this.sendbuffer();
                          }
                        });
                      }
                    });
                  });
                  this.loaderDS.loading(false);
                },
                error: (error: any) => {
                  this.loaderDS.loading(false);
                  this.interceptorDS.hasError(true, error.message, error.url);
                }
              });

            } else if (images.length > 0) {
              this.loadImages(images, calcula, pdfDoc);
            }
          } else {
            this.loaderDS.loading(false);
            pdfDoc.save().then((pdf:any) => {
              var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                type: 'application/pdf'
              }));
              if (this.download === '1') {
                var a = document.createElement("a");
                a.setAttribute("download", this.order + ".pdf");
                a.setAttribute("href", pdfUrl);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                window.open(pdfUrl, '_blank');
              }
              if (this.type === 2) {
                this.sendbuffer();
              }
            });
          }

        });
      }, (reason) => {
        alert('Failed: ' + reason);
      });
    });
  }

  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  loadImages(images:any, calcula:any, pdfDoc:any) {
    for (let i = 0; i < images.length; i++) {
      let reportbasee64 = this._base64ToArrayBuffer(images[i].file);
      if (images[i].extension === 'jpg' || images[i].extension === 'jpeg') {
        let jpgImageRes = pdfDoc.embedJpg(reportbasee64);
        jpgImageRes.then((jpgImage:any) => {
          let jpgDims;
          let xwidth = false;
          if (jpgImage.scale(0.5).width <= 576) {
            jpgDims = jpgImage.scale(0.5);
          } else if (jpgImage.scale(0.4).width <= 576) {
            jpgDims = jpgImage.scale(0.4);
          } else if (jpgImage.scale(0.3).width <= 576) {
            jpgDims = jpgImage.scale(0.3);
            xwidth = true;
          } else {
            jpgDims = jpgImage.scale(0.2);
            xwidth = true;
          }
          let page = pdfDoc.addPage();
          page.drawImage(jpgImage, {
            x: xwidth ? 10 : page.getWidth() / 2 - jpgDims.width / 2,
            y: page.getHeight() / 2 - jpgDims.height / 2,
            width: jpgDims.width,
            height: jpgDims.height,
          });
          calcula++;
          if (calcula === images.length) {
            pdfDoc.save().then((pdf:any) => {
              let pdfUrl = URL.createObjectURL(new Blob([pdf], {
                type: 'application/pdf'
              }));
              if (this.download === '1') {
                let a = document.createElement("a");
                a.setAttribute("download", this.order + ".pdf");
                a.setAttribute("href", pdfUrl);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                window.open(pdfUrl, '_blank');
              }
              if (this.type === 2) {
                this.sendbuffer();
              }
            });
          }
        });
      } else {
        let pngImageRes = pdfDoc.embedPng(reportbasee64);
        pngImageRes.then((pngImage:any) => {
          let pngDims:any;
          let xwidth = false;
          if (pngImage.scale(0.5).width <= 576) {
            pngDims = pngImage.scale(0.5);
          } else if (pngImage.scale(0.4).width <= 576) {
            pngDims = pngImage.scale(0.4);
          } else if (pngImage.scale(0.3).width <= 576) {
            pngDims = pngImage.scale(0.3);
            xwidth = true;
          } else {
            pngDims = pngImage.scale(0.2);
            xwidth = true;
          }
          let page = pdfDoc.addPage();
          // Draw the PNG image near the lower right corner of the JPG image
          page.drawImage(pngImage, {
            x: xwidth ? 10 : page.getWidth() / 2 - pngDims.width / 2,
            y: page.getHeight() / 2 - pngDims.height / 2,
            width: pngDims.width,
            height: pngDims.height,
          });
          calcula++;
          if (calcula === images.length) {
            pdfDoc.save().then((pdf:any) => {
              let pdfUrl = URL.createObjectURL(new Blob([pdf], {
                type: 'application/pdf'
              }));
              if (this.download === '1') {
                let a = document.createElement("a");
                a.setAttribute("download", this.order + ".pdf");
                a.setAttribute("href", pdfUrl);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                window.open(pdfUrl, '_blank');
              }
              if (this.type === 2) {
                this.sendbuffer();
              }
            });
          }
        });
      }
    }
  }

  sendbuffer() {

    const auth = JSON.parse(sessionStorage.getItem('Enterprise_NT.authorizationData'));

    this.datareport.order.createdDate = null;
    this.datareport.order.patient.birthday = null;
    for (var i = 0; i < this.datareport.order.resultTest.length; i++) {
      this.datareport.order.resultTest[i].resultDate = '';
      this.datareport.order.resultTest[i].validationDate = '';
      this.datareport.order.resultTest[i].entryDate = '';
      this.datareport.order.resultTest[i].takenDate = '';
      this.datareport.order.resultTest[i].verificationDate = '';
      this.datareport.order.resultTest[i].printDate = '';
      if(this.datareport.order.resultTest[i].microbiologyGrowth !== undefined) {
        this.datareport.order.resultTest[i].microbiologyGrowth.lastTransaction = null;
      }
    }
    var personRecive = auth.userName;

    var datachange = {
      filterOrderHeader: { printingMedium: 4, typeReport: 1, personReceive: personRecive },
      order: this.datareport.order,
      user: auth.id
    }
    this.orderDS.changeStateTest(datachange).subscribe({
      next: (response: any) => {
        this.loaderDS.loading(false);
      },
      error: (error: any) => {
        this.loaderDS.loading(false);
        this.interceptorDS.hasError(true, error.message, error.url);
      }
    });
  }

  getAge(date:any, format:any) {
    if (!moment(date, format, true).isValid()) {
      return "";
    }
    let birthday = moment(date, format).toDate();
    let current = new Date();
    let diaActual = current.getDate();
    let mesActual = current.getMonth() + 1;
    let anioActual = current.getFullYear();
    let diaInicio = birthday.getDate();
    let mesInicio = birthday.getMonth() + 1;
    let anioInicio = birthday.getFullYear();
    let b = 0;
    let mes = mesInicio;
    if (mes === 2) {
      if ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) {
        b = 29;
      } else {
        b = 28;
      }
    } else if (mes <= 7) {
      if (mes === 0) {
        b = 31;
      } else if (mes % 2 === 0) {
        b = 30;
      } else {
        b = 31;
      }
    } else if (mes > 7) {
      if (mes % 2 === 0) {
        b = 31;
      } else {
        b = 30;
      }
    }
    let anios = -1;
    let meses = -1;
    let dies = -1;
    if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual)
      || (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
      return "";
    } else if (mesInicio <= mesActual) {
      anios = anioActual - anioInicio;
      if (diaInicio <= diaActual) {
        meses = mesActual - mesInicio;
        dies = diaActual - diaInicio;
      } else {
        if (mesActual === mesInicio) {
          anios = anios - 1;
        }
        meses = (mesActual - mesInicio - 1 + 12) % 12;
        dies = b - (diaInicio - diaActual);
      }
    } else {
      anios = anioActual - anioInicio - 1;
      if (diaInicio > diaActual) {
        meses = mesActual - mesInicio - 1 + 12;
        dies = b - (diaInicio - diaActual);
      } else {
        meses = mesActual - mesInicio + 12;
        dies = diaActual - diaInicio;
      }
    }
    return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
  }

  getAgeAsString(date: any, format:any) {
    var age = this.getAge(date, format);
    if (age !== '') {
      var ageFields = age.split(".");
      if (Number(ageFields[0]) !== 0) {
        if (Number(ageFields[0]) === 1) {
          //Año
          return ageFields[0] + " " + this.translate.instant('0181');
        } else {
          //Años
          return ageFields[0] + " " + this.translate.instant('0182');
        }
      } else if (Number(ageFields[1]) !== 0) {
        if (Number(ageFields[1]) === 1) {
          //Mes
          return ageFields[1] + " " + this.translate.instant('0183');
        } else {
          //Meses
          return ageFields[1] + " " + this.translate.instant('0184');
        }
      } else {
        if (Number(ageFields[2]) === 1) {
          //Dia
          return ageFields[2] + " " + this.translate.instant('0185');
        } else {
          //Dias
          return ageFields[2] + " " + this.translate.instant('0186');
        }
      }
    } else {
      return this.translate.instant('0187');
    }
  }
}
