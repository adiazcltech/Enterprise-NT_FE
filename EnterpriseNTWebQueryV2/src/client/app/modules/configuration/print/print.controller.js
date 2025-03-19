(function () {
  'use strict';

  angular
    .module('app.print')
    .controller('PrintController', PrintController);

  PrintController.$inject = ['logger', 'localStorageService', 'authService', '$location',
    'configurationDS', '$filter', 'orderDS', 'common', '$scope'];
  /* @ngInject */
  function PrintController(logger, localStorageService, authService, $location,
    configurationDS, $filter, orderDS, common, $scope) {
    var vm = this;
    $scope.pdf = {};
    vm.messageCount = 0;
    vm.datatribunal = [];
    vm.title = 'print';
    vm.getuser = getuser;
    vm.gettoken = gettoken;
    vm.getdata = getdata;
    vm.dataorder = [];
    vm.viewdata = false;
    vm.menssageInvalid = "";
    vm.getlistidiome = getlistidiome;
    vm.getlistReportFile = getlistReportFile;
    vm.Demographicskey = Demographicskey;
    vm.getconfiguration = getconfiguration;
    vm.getDemographicsALL = getDemographicsALL;
    vm.getselectorder = getselectorder;
    vm.getOrderend = getOrderend;
    vm.printOrder = printOrder;
    vm.setReport = setReport;
    vm.copyPages = copyPages;
    vm.getTemplateReport = getTemplateReport;
    vm.loadImages = loadImages;

    vm.getconfiguration();
    function getuser() {
      return configurationDS.getuser().then(function (data) {
        if (data.status === 200) {
          if (data.data == '' || data.data == null) {
            vm.menssageInvalid = "No hay usuario creado comuniquese con el administrador"
          } else {
            var user = atob(unescape(encodeURIComponent(data.data)));
            vm.user = JSON.parse(user);
            vm.gettoken();
          }
        }
      });
    }
    function gettoken() {
      vm.menssageInvalid = "";
      vm.viewdata = false;
      return authService.login(vm.user).then(
        function (data) {
          if (data.status === 200) {
            vm.getdata();
          }
        },
        function (error) {
          if (error.data !== null) {
            if (error.data.message === "timeout") {
              vm.menssageInvalid = "No hay conexión con la llave de seguridad";
            } else if (
              error.data.errorFields === null &&
              error.data.message !== "timeout"
            ) {
              vm.Error = error;
              vm.PopupError = true;
            } else {
              if (
                error.data.errorFields[0] === "La licencia registrada ha expirado.") {
                vm.menssageInvalid = "La licencia registrada ha expirado";
              } else {
                error.data.errorFields.forEach(function (value) {
                  var item = value.split("|");
                  if (item[0] === "4") {
                    if (item[1] === "inactive user") {
                      vm.menssageInvalid = "Usuario inactivo";
                    } else {
                      vm.menssageInvalid = "Usuario inválido";
                    }
                  }
                  if (item[0] === "5") {
                    vm.menssageInvalid = "Contraseña incorrecta";
                  }
                  if (item[0] === "3") {
                    vm.menssageInvalid = "Ha excedido el número máximo de intentos de inicio de sesión, el usuario se ha desactivado";
                  }
                  if (item[0] === "6") {
                    if (item[1] === "password expiration date") {
                      vm.menssageInvalid = "La contraseña ha expiradoo";
                    } else {
                      vm.menssageInvalid = "El usuario no se encuentra activo";
                    }
                  }
                  if (item[0] === "7") {
                    if (item[1] === "change password") {
                      vm.menssageInvalid = "La contraseña ha expirado";
                    }
                  }
                });
              }
            }
          }
        }
      );
    }
    function getdata() {
      vm.menssageInvalid = "";
      vm.dataorder = [];
      vm.image = "";
      /*  vm.orderHis = $location.search().orqrm; */
      vm.orderHis = $location.$$url.replace("/orqrm:", "")
      if (vm.orderHis !== undefined) {
        try {
          vm.orderHis = atob(unescape(encodeURIComponent(vm.orderHis)));
          vm.getpathReport = localStorageService.get('PathFE');
          vm.urlLIS = localStorageService.get('ServiciosLISUrl');
          vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
          vm.formatDate = vm.formatDate === '' ? 'DD/MM/YYYY' : vm.formatDate;
          vm.viewdata = false;
          vm.Demographicskey();
        } catch (error) {
          vm.menssageInvalid = "La url no corresponde";
        }
      } else {
        vm.menssageInvalid = "La url no corresponde";
      }
    }
    function getconfiguration() {
      localStorageService.clearAll();
      return configurationDS.getConfiguration().then(function (data) {
        if (data.status === 200) {
          vm.getuser();
          var config = JSON.parse(atob(unescape(encodeURIComponent(data.data[0].value))));
          config.forEach(function (value, key) {
            value.key = atob(unescape(encodeURIComponent(value.key)));
            value.value = atob(unescape(encodeURIComponent(value.value)));
    
            if (value.key === 'PathFE' ||
              value.key === 'ServiciosLISUrl' ||
              value.key === 'FormatoFecha') {
              localStorageService.set(value.key, value.value);
            }
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /* function getlistReportFile() {
      vm.listreports = [{ "name": "reportprintedorders.mrt" }, { "name": "reportprintedorders1.mrt" }, { "name": "reports - copia (2).mrt" }, { "name": "reports - copia.mrt" }, { "name": "reports.mrt" }, { "name": "reports1.mrt" }, { "name": "reports11.mrt" }, { "name": "reports15.mrt" }, { "name": "reports2.mrt" }, { "name": "reports55.mrt" }, { "name": "reports9.mrt" }, { "name": "reportsACT.mrt" }, { "name": "reportsOLD.mrt" }, { "name": "reportsP.mrt" }, { "name": "reportspru.mrt" }, { "name": "reports_.mrt" }, { "name": "reports_backup.mrt" }, { "name": "reports_old.mrt" }, { "name": "reports_OLD2.mrt" }, { "name": "reports_Sede_01.mrt" }, { "name": "reports_Sede_02.mrt" }, { "name": "reports_Sede_03.mrt" }, { "name": "reports_Sede_06.mrt" }, { "name": "reports_Sede_12.mrt" }, { "name": "reports__.mrt" }]
    } */
    function getlistidiome() {
      if (vm.getpathReport !== '' && vm.getpathReport !== null) {
        var pathReport;

        if ($filter('translate')('0000') === 'es') {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-es.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-es.json';
          }
        } else {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-en.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-en.json';
          }
        }
        var parameters = {
          pathReport: pathReport,
        };
        vm.getlistReportFile();
        configurationDS.getlistidiome(parameters).then(function (response) {
          if (response.status === 200) {
            if (response.data == '2') {
              vm.lisIdiome = [];
              logger.info("EL path para los reportes esta mal configurado consulte con el administrador");
            } else {
              vm.lisIdiome = response.data;
            }
          } else {
            vm.lisIdiome = [];
          }
        }, function (error) {
          return false;
        });
      } else {
        logger.info($filter('translate')('0195'));
        /*  UIkit.modal('#modalvalidatedpath', { modal: false }).show() */
      }
    }    
    function getlistReportFile() {
      if (location.href.search('http://localhost:3000') !== -1) {
        //Local
        var parameters = {
          pathReport: vm.getpathReport + '/src/client/Report/reportsandconsultations/reports',
          report: './src/client/reports'
        };
      } else {
        //publicación
        var parameters = {
          pathReport: vm.getpathReport + '/public/Report/reportsandconsultations/reports',
          report: './public/reports'
        };
      }
      configurationDS.getlistReportFile(parameters).then(function (response) {
        if (response.status === 200) {
          if (response.data == '2') {
            vm.listreports = [];
            logger.info("EL path para los reportes esta mal configurado consulte con el administrador");
          } else {
            vm.listreports = response.data;
          }
        } else {
          vm.listreports = [];
        }
      }, function (error) {
        return false;
      });
    }
    function Demographicskey() {
      if (vm.urlLIS !== '' && vm.urlLIS !== null) {
        vm.getlistidiome();
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return configurationDS.getDemographicskey(auth.authToken, vm.urlLIS, 'DemograficoTituloInforme').then(function (data) {
          if (data.status === 200) {
            vm.demographicTitle = data.data.value;
            vm.getDemographicsALL();
          }
        }, function (error) {
          logger.error(error);
        });
      } else {
        logger.info('debe configurar la URL del LIS');
      }
    }
    function getDemographicsALL() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.getselectorder();
      if (parseInt(vm.demographicTitle) !== 0) {
        return configurationDS.getDemographicsALL(auth.authToken, vm.urlLIS).then(function (data) {
          vm.demographicTemplate = _.filter(data.data, function (v) {
            return v.id === parseInt(vm.demographicTitle);
          })[0];
          vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          vm.referenceDemographic = vm.demographicTemplate.name;
          if (parseInt(vm.demographicTitle) < 0) {
            switch (parseInt(vm.demographicTitle)) {
              case -1:
                vm.demographicTemplate.name = $filter('translate')('0198');
                vm.referenceDemographic = 'account';
                break; //Cliente
              case -2:
                vm.demographicTemplate.name = $filter('translate')('0199');
                vm.referenceDemographic = 'physician';
                break; //Médico
              case -3:
                vm.demographicTemplate.name = $filter('translate')('0200');
                vm.referenceDemographic = 'rate';
                break; //Tarifa
              case -4:
                vm.demographicTemplate.name = $filter('translate')('0201');
                vm.referenceDemographic = 'type';
                break; //Tipo de orden
              case -5:
                vm.demographicTemplate.name = $filter('translate')('0003');
                vm.referenceDemographic = 'branch';
                break; //Sede
              case -6:
                vm.demographicTemplate.name = $filter('translate')('0202');
                vm.referenceDemographic = 'service';
                break; //Servicio
              case -7:
                vm.demographicTemplate.name = $filter('translate')('0203');
                vm.referenceDemographic = 'race';
                break; //Raza
            }
            vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          }
        }, function (error) {
          logger.error(error);
        });
      } else {
        vm.demographicTemplate = null;
        vm.nameDemographic = 'reports';
      }
    }
    function getselectorder() {
      vm.loading = true;
      vm.listTest = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return orderDS.getordersresult(auth.authToken, vm.orderHis,0).then(function (data) {
        if (data.status === 200) {
          vm.listTest = data.data;
          if (vm.getpathReport !== '' && vm.getpathReport !== null) {
            vm.order = parseInt(vm.orderHis);
            vm.getOrderend();
          } else {
            logger.info($filter('translate')('0195'));
          }
          vm.loading = false;
        }
      }, function (error) {
        vm.loading = false;
        logger.error(error);
      });
    }
    function getOrderend() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var json = {
        'rangeType': 1,
        'init': vm.order,
        'end': vm.order
      };
      return orderDS.getOrderHeader(auth.authToken, json).then(function (data) {
        if (data.data.length > 0) {
          var data = {
            "printOrder": [
              {
                "physician": null,
                "listOrders": [
                  {
                    "order": data.data[0]
                  }
                ]
              }
            ],
            "typeReport": 0,
            "isAttached": true
          };
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return orderDS.getOrderPreliminaryend(auth.authToken, data).then(function (data) {
            if (data.data !== '') {
              vm.datareport = data.data.listOrders[0];
              var dataOrder = data.data.listOrders[0].order;
              if (dataOrder.resultTest.length !== 0) {
                dataOrder.resultTest.forEach(function (value) {
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
                dataOrder.allDemographics.forEach(function (value2) {
                  dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                  dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                });
              }
              dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' hh:mm:ss a.');
              dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
              dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
              dataOrder.attachments = vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;

              return orderDS.getUserValidate(vm.order).then(function (datafirm) {

                dataOrder.listfirm = [];
                for (var i = 0; i < dataOrder.resultTest.length; i++) {
                  dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' hh:mm:ss a.');

                  if (dataOrder.resultTest[i].hasAntibiogram) {
                    dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
                  }
                  if (dataOrder.resultTest[i].validationUserId !== undefined) {
                    var findfirm = _.filter(dataOrder.listfirm, function (o) {
                      return o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId;
                    })[0];

                    var user = _.filter(datafirm.data, function (o) { return o.id === dataOrder.resultTest[i].validationUserId });

                    if (findfirm === undefined) {
                      var firm = {
                        'areaId': dataOrder.resultTest[i].areaId,
                        'areaName': dataOrder.resultTest[i].areaName,
                        'validationUserId': dataOrder.resultTest[i].validationUserId,
                        'validationUserIdentification': dataOrder.resultTest[i].validationUserIdentification,
                        'validationUserName': dataOrder.resultTest[i].validationUserName,
                        'validationUserLastName': dataOrder.resultTest[i].validationUserLastName,
                        'firm': user.length === 0 ? '' : user[0].photo
                      };
                      dataOrder.listfirm.push(firm);
                    }
                  }
                }
                dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                vm.printOrder(dataOrder);
              })
            } else {
              logger.warning("No existe datos para generar el reporte");
              vm.loading = false;
            }
          });
        } else {
          logger.warning("No existe datos para generar el reporte");
          vm.loading = false;
        }
      });
    }
    function printOrder(order) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var parameterReport = {};
      parameterReport.variables = {
        'username': auth.userName,
        'titleReport': 'Informe final',
        'date': moment().format(vm.formatDate + ' hh:mm:ss a.'),
        'formatDate': vm.formatDate,
        'codeorder': "/orqrm:" + btoa(vm.order),
        'destination': "2",
        'typeprint': "1"
      };
      localStorageService.set('Enterprise_NT.authorizationData', null);
      parameterReport.pathreport = '/reports/' + vm.getTemplateReport(order);
      parameterReport.labelsreport = vm.idiome;
      vm.dataorder = order;
      vm.setReport(parameterReport, order);
    }
    function setReport(parameterReport, datareport) {
      setTimeout(function () {
        Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmi1+A2EZ9zb8Cp0WbC0Q+eBLvK6rTKzvDhnH1zVHS3ylMnUl" +
          "AtX6dHzjEekruj9gmsLFvIKulyE3C3uBe+uG4cI04/SEEhDHE0ztmhTdTnEFdImPyIX5Lxjcfy+KQ3geG1zLyTPftv" +
          "JZDI7EFE7oxupw6zohAj6d4YFHQagDcUq+cG09zEnLaWgMGJp0tkrpEBOzgtjfvHAth2Jwa7qDm3sySiHxZqDF1lSi" +
          "97C8ThN3K3IlrOjKmbHEe/UNR5QWIJywhTtFke6wUN6Tt2KISuwe/2KoA1EIQoYLbG3f8llGJHljzTNLlwGGM6e2/5" +
          "kHoIo/HrTAWk+DAeoMdXb8I/d0Xtu3GhoT9NTUa9JMF+3mMR23G+amasdVEu1Eb0oT8pwkvZYl/zs0ByOLlPRcKiYF" +
          "DC/NA33nTRR56dFn2Z78ycvYwrJMxIh06TWP/dcE5fDtADp7I73ow+m25XZnhpjxqWkJ54PA6YqTqaZVSidoHImBlz" +
          "FjNbTwZ3af9jO6IBoyOoQK7IAvQLBpLx0ZsZ4UbOnxMd8ZrHIUnpn9UmeQ==";
        var report = new Stimulsoft.Report.StiReport();

        report.loadFile(parameterReport.pathreport);

        var jsonData = {
          'order': datareport,
          'Labels': [parameterReport.labelsreport],
          'variables': [parameterReport.variables]
        };

        var dataSet = new Stimulsoft.System.Data.DataSet();
        dataSet.readJson(jsonData);

        report.dictionary.databases.clear();
        report.regData('Demo', 'Demo', dataSet);
        report.renderAsync(function () {
          var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
          var service = new Stimulsoft.Report.Export.StiPdfExportService();
          var stream = new Stimulsoft.System.IO.MemoryStream();
          service.exportToAsync(function () {
            // Export to PDF (#1)
            var data = stream.toArray();
            var buffer = new Uint8Array(data);

            vm.copyPages(buffer, datareport.attachments);

            // Export to PDF (#2)


          }, report, stream, settings);

          //  service.exportTo(report, stream, settings);
        });
      }, 50);
    }
    function copyPages(reportpreview, attachments) {

      var PDFDocument = PDFLib.PDFDocument;
      var pdfDocRes = PDFDocument.create();

      pdfDocRes.then(function (pdfDoc) {
        var firstDonorPdfDoc = PDFDocument.load(reportpreview, {
          ignoreEncryption: true
        });
        firstDonorPdfDoc.then(function (greeting) {
          var firstDonorPageRes = pdfDoc.copyPages(greeting, greeting.getPageIndices());

          firstDonorPageRes.then(function (firstDonorPage) {

            firstDonorPage.forEach(function (page) {
              pdfDoc.addPage(page);
            });
            if (attachments.length > 0) {

              var mergepdfs = '';
              var calcula = 0;

              var pdfs = _.filter(attachments, function(o) { return o.extension === 'pdf'; });
              var images = _.filter(attachments, function(o) { return o.extension !== 'pdf'; });

              if(pdfs.length > 0) {
                orderDS.mergepdf(pdfs).then(function (response) {
                  if(response.status === 200) {
                    var reportbasee64 = _base64ToArrayBuffer(response.data);
                    mergepdfs = PDFDocument.load(reportbasee64, {
                      ignoreEncryption: true
                    });
                    mergepdfs.then(function (listbufferelement) {
                      var copiedPagesRes = pdfDoc.copyPages(listbufferelement, listbufferelement.getPageIndices());
                      copiedPagesRes.then(function (copiedPages) {
                        copiedPages.forEach(function (page) {
                          pdfDoc.addPage(page);
                        });
                        if(pdfs.length === 1 ) {
                          var totalpages = pdfDoc.getPages().length;
                          pdfDoc.removePage(totalpages-1);
                        }
                        if(images.length > 0) {
                          vm.loadImages(images, calcula, pdfDoc);
                        } else {
                          pdfDoc.save().then(function (pdf) {
                            $scope.$apply(function () {
                              vm.loading = false;
                            });
                            $scope.pdf.data = pdf;
                          });
                        }
                      });
                    });
                  }
                });
              } else if(images.length > 0) {
                vm.loadImages(images, calcula, pdfDoc);
              }
            } else {
              pdfDoc.save().then(function (pdf) {
                $scope.$apply(function () {
                  vm.loading = false;
                });
                $scope.pdf.data = pdf;
              });
            }

          });
        }, function (reason) {
          alert('Failed: ' + reason);
        });
      });
    }
    function _base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    function loadImages(images, calcula, pdfDoc) {
      for (var i = 0; i < images.length; i++) {
        var reportbasee64 = _base64ToArrayBuffer(images[i].file);
        if (images[i].extension === 'jpg' || images[i].extension === 'jpeg') {
          var jpgImageRes = pdfDoc.embedJpg(reportbasee64);
          jpgImageRes.then(function (jpgImage) {
            var jpgDims;
            var xwidth = false;
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
            var page = pdfDoc.addPage();
            page.drawImage(jpgImage, {
              x: xwidth ? 10 : page.getWidth() / 2 - jpgDims.width / 2,
              y: page.getHeight() / 2 - jpgDims.height / 2,
              width: jpgDims.width,
              height: jpgDims.height,
            });
            calcula++;
            if (calcula === images.length) {
              pdfDoc.save().then(function (pdf) {
                $scope.$apply(function () {
                  vm.loading = false;
                });
                $scope.pdf.data = pdf;
              });
            }
          });
        } else {
          var pngImageRes = pdfDoc.embedPng(reportbasee64);
          pngImageRes.then(function (pngImage) {
            var pngDims;
            var xwidth = false;
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
            var page = pdfDoc.addPage();
            // Draw the PNG image near the lower right corner of the JPG image
            page.drawImage(pngImage, {
              x: xwidth ? 10 : page.getWidth() / 2 - pngDims.width / 2,
              y: page.getHeight() / 2 - pngDims.height / 2,
              width: pngDims.width,
              height: pngDims.height,
            });
            calcula++;
            if (calcula === images.length) {
              pdfDoc.save().then(function (pdf) {
                $scope.$apply(function () {
                  vm.loading = false;
                });
                $scope.pdf.data = pdf;
              });
            }
          });
        }
      }
    }

    function _base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    function getTemplateReport(order) {
      var template = '';
      if (vm.demographicTemplate !== null) {
        if (vm.demographicTemplate.encoded && vm.demographicTemplate.id > 0) {
          order.demographicItemTemplate = _.filter(order.allDemographics, function (o) {
            return o.idDemographic === vm.demographicTemplate.id;
          })[0];
          template = vm.nameDemographic + '_' + order.demographicItemTemplate.codifiedCode + '.mrt';
        } else if (vm.demographicTemplate.encoded && vm.demographicTemplate.id === -7 || vm.demographicTemplate.encoded && vm.demographicTemplate.id === -10) {
          if (vm.demographicTemplate.id === -7) {
            order.demographicItemTemplate = order.patient.race;
            template = vm.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
          } else {
            order.demographicItemTemplate = order.patient.documentType;
            template = vm.nameDemographic + '_' + order.demographicItemTemplate.abbr + '.mrt';

          }
        } else if (vm.demographicTemplate.encoded && vm.demographicTemplate.id < 0) {
          order.demographicItemTemplate = order[vm.referenceDemographic];
          template = vm.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
        } else {
          template = vm.nameDemographic + '.mrt';
        }

        if (_.filter(vm.listreports, function (o) {
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
  }
})();


