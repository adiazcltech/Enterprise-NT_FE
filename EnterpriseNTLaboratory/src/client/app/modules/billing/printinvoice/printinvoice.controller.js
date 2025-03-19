/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.printinvoice')
    .config(function ($mdDateLocaleProvider) {
      var format;
      if (localStorage.getItem('ls.FormatoFecha') !== null) {
        var formatDate = ((localStorage.getItem('ls.FormatoFecha')).toUpperCase()).slice(1, 11);
        if (formatDate === 'DD/MM/YYYY') {
          format = 'DD/MM/YYYY';
        } else if (formatDate === 'DD-MM-YYYY') {
          format = 'DD-MM-YYYY';
        } else if (formatDate === 'DD.MM.YYYY') {
          format = 'DD.MM.YYYY';
        } else if (formatDate === 'MM/DD/YYYY') {
          format = 'MM/DD/YYYY';
        } else if (formatDate === 'MM-DD-YYYY') {
          format = 'MM-DD-YYYY';
        } else if (formatDate === 'MM.DD.YYYY') {
          format = 'MM.DD.YYYY';
        } else if (formatDate === 'YYYY/MM/DD') {
          format = 'YYYY/MM/DD';
        } else if (formatDate === 'YYYY-MM-DD') {
          format = 'YYYY-MM-DD';
        } else if (formatDate === 'YYYY.MM.DD') {
          format = 'YYYY.MM.DD';
        }
      } else {
        format = 'DD/MM/YYYY';
      }

      $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format(format) : '';
      };
      $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };


    })
    .controller('printinvoiceController', printinvoiceController);
  printinvoiceController.$inject = ['LZString', '$translate', 'localStorageService',
    '$filter', '$state', 'moment', '$rootScope', 'cashboxDS', 'logger', 'reportadicional', 'customerDS', 'branchDS'];
  function printinvoiceController(LZString, $translate, localStorageService,
    $filter, $state, moment, $rootScope, cashboxDS, logger, reportadicional, customerDS, branchDS) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.pageview = 3;
    vm.title = 'printinvoice';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1600');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    $rootScope.helpReference = '08.billing/printinvoice.htm';
    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");
    vm.modalError = modalError;
    vm.valuername = localStorageService.get('Moneda');
    vm.symbolCurrency = localStorageService.get('SimboloMonetario') === "" || localStorageService.get('SimboloMonetario') === null ? "$" : localStorageService.get('SimboloMonetario');
    vm.decimal = localStorageService.get('ManejoCentavos') === 'True' ? 2 : 0;
    vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
    vm.penny = vm.isPenny ? 2 : 0;
    vm.maxDate = new Date();
    vm.print = print;
    vm.numberqutomatic = localStorageService.get('facturacionAutomatica') === 'True';
    vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
    vm.abbrCustomer = localStorageService.get('Abreviatura');
    vm.nameCustomer = localStorageService.get('Entidad');
    vm.bill = '';
    vm.calculate = true;
    vm.comment = '';
    vm.searchByDate = searchByDate;
    vm.windowOpenReport = windowOpenReport;
    vm.keyselect = keyselect;
    vm.filterinvoice = filterinvoice;
    vm.datasearch = [];
    vm.initialInvoice = '';
    vm.finalInvoice = '';
    vm.creditNoteId = '';
    vm.buttonpaymentDate = true;
    vm.getaccounts = getaccounts;
    vm.typeresport = [{
      id: 1,
      name: "Facturas vencidas",
    }, //historia
    {
      id: 2,
      name: "Facturas global",
    }, // Orden
    ];
    vm.typeresport.id = 1;

    function searchByDate() {
      if (vm.dateToSearch !== undefined && vm.dateToSearch !== '') {
        vm.filterinvoice();
      }
    }

    function keyselect($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.datasearch = [];
        vm.select = null;
        if (vm.initialInvoice !== '' && vm.finalInvoice !== '') {
          vm.filterinvoice();
        } else if (vm.initialInvoice === '' && vm.finalInvoice !== '') {
          logger.success($filter('translate')('1607'));
        } else if (vm.initialInvoice !== '' && vm.finalInvoice === '') {
          logger.success($filter('translate')('1608'));
        } else if (vm.creditNoteId !== '') {
          vm.filterinvoice();
        }
      }
    }
    vm.printnote = printnote;

    function printnote() {
      vm.loading = true;
      vm.creditNote = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.getCreditNoteinvoiceNumber(auth.authToken, vm.select.invoiceNumber).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            value.dateOfNote = moment(value.dateOfNote).format(vm.formatDateHours);
          });
          vm.creditNote = data.data;
          vm.variables = vm.select;
          vm.datareport = vm.creditNote;
          vm.pathreport = '/Report/billing/creditnote/creditnote.mrt';
          var parameterReport = {};
          parameterReport.variables = vm.variables;
          parameterReport.pathreport = vm.pathreport;
          parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
          var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
          localStorageService.set('parameterReport', parameterReport);
          localStorageService.set('dataReport', datareport);
          window.open('/viewreport/viewreport.html');
        } else {
          logger.info($filter('translate')('2015'));
        }
        vm.loading = false;
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function filterinvoice() {
      vm.loading = true;
      vm.buttonpaymentDate = true;
      var searchconsult = {
        "initialInvoice": vm.initialInvoice,
        "finalInvoice": vm.finalInvoice,
        "invoiceDate": vm.dateToSearch === null || vm.dateToSearch === undefined ? null : moment(vm.dateToSearch).format("YYYYMMDD"),
        "creditNoteId": vm.creditNoteId,
        "customer": vm.datacustomer === '' ? -1 : vm.datacustomer
      }
      vm.datasearch = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.getSimpleInvoiceDetail(auth.authToken, searchconsult).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            value.date = moment(value.date).format(vm.formatDateHours);
            value.expirationDate = moment(value.expirationDate).format(vm.formatDateHours);
            value.paymentDate = value.paymentDate ? moment(value.paymentDate).format(vm.formatDateHours) : '';
          });
          vm.datasearch = _.orderBy(data.data, 'invoiceNumber', 'asc');
        } else {
          logger.success($filter('translate')('0392'));
        }
        vm.loading = false;
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function print(view) {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.getdetailinvoice(auth.authToken, vm.select.invoiceNumber).then(function (data) {
        if (data.status === 200) {
          if (vm.select.particular === 1) {

            vm.datareport = data.data.invoiceHeader[0].orders.length === 0 ? [] : data.data.invoiceHeader[0].orders[0].tests;

            vm.variables = {
              "accountNit": data.data.history,
              "initialOrder": data.data.invoiceHeader[0].initialOrder,
              "accountName": data.data.name1 + " " + data.data.name2 + " " + data.data.lastName + " " + data.data.surName,
              "accountPhone": data.data.phone,
              "accountAddress": data.data.address,
              "dateOfInvoice": moment(data.data.dateOfInvoice).format('DD/MM/YYYY'),
              "comment": data.data.comment,
              "invoiceNumber": data.data.invoiceNumber,
              "moderatorFee": data.data.invoiceHeader[0].totalModeratingFee,
              "copayment": data.data.invoiceHeader[0].totalCopayment,
              "discountValue": data.data.discount,
              "taxValue": data.data.tax,
              "total": data.data.total
            };

            vm.pathreport = '/Report/pre-analitic/invoiceorder/invoiceorder.mrt';
            var parameterReport = {};
            parameterReport.variables = vm.variables;
            parameterReport.pathreport = vm.pathreport;
            parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
            var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
            localStorageService.set('parameterReport', parameterReport);
            localStorageService.set('dataReport', datareport);
            vm.loading = false;
            window.open('/viewreport/viewreport.html');
          } else {

            vm.loading = false;
            vm.invoiceNumber = data.data.invoiceNumber;
            vm.formOfPayment = data.data.formOfPayment === 1 ? $filter('translate')('1574') : $filter('translate')('1575');
            vm.dateexpirationinvoice = moment(data.data.dueDate).format(vm.formatDate);

            vm.total = 0;
            vm.tax = 0;
            vm.taxs = [];
            vm.discount = 0;
            data.data.invoiceHeader.forEach(function (value) {
              vm.capitated = value.capitated !== 0;
              vm.total += value.total;
              vm.tax += value.tax;
              if (value.hasOwnProperty("taxs")) {
                if (value.taxs.length > 0) {
                  vm.taxs.push(value.taxs);
                }
              }
              vm.discount += value.discount;
              value.orders.forEach(function (val) {
                val.orderCreationDate = moment(val.orderCreationDate).format(vm.formatDateHours);
              });
            });
            vm.datareport = data.data.invoiceHeader;

            var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')';

            var datebillin = data.data.billingPeriod.split(' - ')
            var init = datebillin[0];
            var end = datebillin[1];

            vm.variables = {
              "ACCOUNT": customer,
              "period": moment(init).format(vm.formatDate) + ' al ' + moment(end).format(vm.formatDate),
              "dateOfInvoice": moment(data.data.dateOfInvoice).format(vm.formatDate),
              "dayOfInvoice": moment(data.data.dateOfInvoice).format('DD'),
              "monthOfInvoice": moment(data.data.dateOfInvoice).format('MM'),
              "yearOfInvoice": moment(data.data.dateOfInvoice).format('YYYY'),
              "formOfPayment": vm.formOfPayment,
              "branch": '',
              "provider": '',
              "total": vm.total,
              "tax": vm.tax,
              "taxs": vm.taxs,
              "comment": data.data.comment,
              "totalLiteral": "",
              "USERNAME": auth.userName,
              "billnumber": vm.invoiceNumber,
              "valuername": vm.valuername === '' ? $filter('translate')('1612') : vm.valuername,
              "dateexpirationinvoice": moment(data.data.dateexpirationinvoice).format(vm.formatDate),
              "accountAddress": data.data.accountAddress,
              "accountName": data.data.accountName,
              "accountNit": data.data.accountNit,
              "accountPhone": data.data.accountPhone,
              "customerId": data.data.customerId
            };

            if (view === 1) {
              var datareport = {};
              datareport.datareport = vm.datareport;
              datareport.variables = vm.variables;
              datareport.pathreport = '/Report/billing/reprintinvoice/reprintinvoice2.mrt';
              reportadicional.exportReportExcel(datareport, 'Factura.xls');
              vm.loading = false;
            } else {
              if(vm.select.typeOfInvoice === 4) {
                vm.pathreport = '/Report/billing/reprintinvoice/invoicebyorder.mrt';
              } else {
                vm.pathreport = '/Report/billing/reprintinvoice/reprintinvoice1.mrt';
              }
              vm.openreport = false;
              vm.report = false;
              vm.windowOpenReport();
            }
          }
        } else {
          vm.loading = false;
          UIkit.modal('#nofoundfilter').show();
        }
      },
        function (error) {
          vm.loading = false;
          vm.dataerror = '';
          if (error.data !== null) {
            if (error.data.code === 2) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split('|');
                if (item[0] === '1' && item[1] === 'The associated entity does not have an assigned resolution') {
                  vm.dataerror = $filter('translate')('1567');
                }
                if (item[0] === '1' && item[1] === 'The current amount exceeds the maximum amount') {
                  vm.dataerror = $filter('translate')('1571');
                }
                if (item[0] === '1' && item[1] === 'Limit per capita') {
                  vm.dataerror = $filter('translate')('1573');
                }
              });
              UIkit.modal("#modal-error").show();
            }
          }
          if (vm.dataerror === '') {
            vm.modalError(error);
          }
        });
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
        var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
        localStorageService.set('parameterReport', parameterReport);
        localStorageService.set('dataReport', datareport);
        window.open('/viewreport/viewreport.html');
        vm.loading = false;
      } else {
        UIkit.modal('#nofoundfilter').show();
        vm.loading = false;
      }
    }

    function init() {
      vm.getaccounts();
    }

    function getaccounts() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.customer = [];
      return customerDS.getCustomerstate(auth.authToken).then(function (data) {
        if (data.status === 200) {
          if (data.data.length !== 0) {
            vm.customereport = $filter('orderBy')(data.data, 'name');
            var all = {
              "id": '',
              "name": "-- " + $filter('translate')('0162') + " --"
            }
            data.data.push(all);
            vm.customer = $filter('orderBy')(data.data, 'name');
            vm.datacustomer = '';
          }
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }
    vm.printrepot = printrepot;
    function printrepot() {
      if (vm.typeresport.id === 1) {
        var data = {
          "startDate": new Date(moment(vm.rangeInit).format()).getTime(),
          "endDate": new Date(moment(vm.rangeEnd).format()).getTime(),
          "customerId": vm.datacustomerreport.id
        }
        vm.variables = {};
        vm.datareport = [];
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return cashboxDS.getExpiredInvoicesByCustomer(auth.authToken, data).then(function (data) {

          if (data.data.details.length !== 0) {
            data.data.details.forEach(function (value) {
              var today = [parseInt(moment().format('YYYY')), parseInt(moment().format('MM')), parseInt(moment().format('DD'))]
              var expirationDate = [parseInt(moment(value.expirationDate).format('YYYY')), parseInt(moment(value.expirationDate).format('MM')), parseInt(moment(value.expirationDate).format('DD'))]
              value.daysoverdue = moment(today).diff(moment(expirationDate), 'days');
              value.expirationDate = moment(value.expirationDate).format(vm.formatDateHours);
              value.invoiceDate = moment(value.invoiceDate).format(vm.formatDateHours);
            });
            vm.datareport = data.data.details;
            vm.pathreport = '/Report/billing/expiredinvoices/expiredinvoices.mrt';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')';
            vm.variables = {
              "dateOfPrinting": moment().format(vm.formatDate),
              "ACCOUNT": customer,
              "period": moment(vm.rangeInit).format(vm.formatDate) + ' al ' + moment(vm.rangeEnd).format(vm.formatDate),
              "username": auth.userName,
              'customer': vm.datacustomerreport.name
            };
          }
          vm.windowOpenReport();
        },
          function (error) {
            vm.modalError(error);
          });
      } else {
        var data = {
          "startDate": new Date(moment(vm.rangeInit).format()).getTime(),
          "endDate": new Date(moment(vm.rangeEnd).format()).getTime(),
          "customerId": vm.datacustomerreport.id
        }
        vm.variables = {};
        vm.datareport = [];
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return cashboxDS.getCustomerInvoices(auth.authToken, data).then(function (data) {
          if (data.data.details.length !== 0) {
            data.data.details.forEach(function (value) {
              value.expirationDate = moment(value.expirationDate).format(vm.formatDateHours);
              value.invoiceDate = moment(value.invoiceDate).format(vm.formatDateHours);
            });
          }
          if (data.data.details.length === 0 && data.data.unbilledOrders.length === 0) {
            vm.datareport = []
          } else {
            vm.datareport = [{
              'invoice': data.data.details,
              'ininvoice': data.data.unbilledOrders
            }];
          }
          vm.pathreport = '/Report/billing/globalbills/globalbills.mrt';
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')';
          vm.variables = {
            "dateOfPrinting": moment().format(vm.formatDate),
            "ACCOUNT": customer,
            "period": moment(vm.rangeInit).format(vm.formatDate) + ' al ' + moment(vm.rangeEnd).format(vm.formatDate),
            "username": auth.userName,
            'customer': vm.datacustomerreport.name
          };
          vm.windowOpenReport();
        },
          function (error) {
            vm.modalError(error);
          });

      }
    }
    vm.openmodaldate = openmodaldate;
    function openmodaldate() {
      vm.dateinvoice = moment().format();
      UIkit.modal('#dateinvoice', { modal: false }).show()
    }

    vm.savedate = savedate;
    function savedate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var invoice = {
        "invoiceNumber": vm.select.invoiceNumber,
        "paymentDate": new Date(moment(vm.dateinvoice).format()).getTime()
      }
      return cashboxDS.paymentOfInvoice(auth.authToken, invoice).then(function (data) {
        if (data.status === 200) {
          UIkit.modal('#dateinvoice').hide();
          vm.filterinvoice();
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
