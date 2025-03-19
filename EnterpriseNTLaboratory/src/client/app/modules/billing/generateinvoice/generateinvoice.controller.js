/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.generateinvoice')
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
    .controller('generateinvoiceController', generateinvoiceController);
  generateinvoiceController.$inject = ['LZString', '$translate', 'localStorageService', 'customerDS',
    '$filter', '$state', 'moment', '$rootScope', 'branchDS', 'rateDS', 'cashboxDS', 'logger', 'reportadicional'];

  function generateinvoiceController(LZString, $translate, localStorageService, customerDS,
    $filter, $state, moment, $rootScope, branchDS, rateDS, cashboxDS, logger, reportadicional) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.pageview = 3;
    vm.title = 'generateinvoice';
    vm.symbolCurrency = localStorageService.get('SimboloMonetario');
    vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
    vm.penny = vm.isPenny ? 2 : 0;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1564');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
    $rootScope.helpReference = '08.billing/generateinvoice.htm';
    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");
    vm.modalError = modalError;
    vm.getbranch = getbranch;
    vm.getaccounts = getaccounts;
    vm.dateToSearch = moment().format();
    vm.maxDate = new Date();
    vm.print = print;
    vm.getprovider = getprovider;
    vm.numberqutomatic = localStorageService.get('facturacionAutomatica') === 'True';
    vm.multipleBilling = localStorageService.get('FacturacionMultiple') === 'True';
    vm.rangedays = localStorageService.get('FacturacionMultiple') === 'True' ? undefined : 30;
    vm.valuername = localStorageService.get('Moneda');
    vm.bill = '';
    vm.generateFile = generateFile;
    vm.generateFileinvoice = generateFileinvoice;
    vm.calculate = true;
    vm.comment = '';
    vm.searchByDate = searchByDate;
    vm.windowOpenReport = windowOpenReport;
    vm.clickFiltersample = clickFiltersample;
    vm.getratecustomer = getratecustomer;
    vm.filtersample = 1;
    vm.numFilterAreaTest = 0;
    vm.listCustomers = [];
    vm.clickFilterType = clickFilterType;
    vm.filterTpye = 1;
    vm.abbrCustomer = localStorageService.get('Abreviatura');
    vm.nameCustomer = localStorageService.get('Entidad');
    vm.dueDate = moment().format();
    vm.searchByDueDate = searchByDueDate;
    vm.typefilter = 1;

    vm.customMenu = {
      menubar: false,
      language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      plugins: [
        'link',
        'lists',
        'autolink',
        'anchor',
        'textcolor',
        'charmap'
      ],
      toolbar: [
        'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
      ],
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean'
    };
    vm.demosmask = "-110||-104||-100||-101||-102||-103||-109"

    vm.paymentType = [
      { 'id': 1, 'name': $filter('translate')('2006')},
      { 'id': 2, 'name': $filter('translate')('2007')}
    ];

    vm.datapayment = vm.paymentType[0];
    vm.changePreInvoice = changePreInvoice;

    function changePreInvoice() {
      vm.bill = vm.calculate === false ? '': vm.bill;
      if(!vm.multipleBilling) {
        vm.clickFilterType(2);
      } else if(vm.calculate === false) {
        vm.clickFilterType(2);
      } else {
        vm.clickFilterType(1);
      }
    }

    function searchByDueDate() {
      if (vm.dueDate !== null) {
        vm.dueDate = new Date(vm.dueDate);
      } else {
        vm.dueDate = null;
      }
    }

    function getbranch() {
      vm.branch = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchstate(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var all = {
            "id": -1,
            "name": $filter('translate')('0215')
          }
          data.data.push(all);
          vm.branch = $filter('orderBy')(data.data, 'name');
          vm.databranch = -1;
          vm.getaccounts();
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function getaccounts() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.customer = [];
      return customerDS.getCustomer(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.customer = $filter('orderBy')(data.data, 'name');
          vm.getprovider();
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }


    function getratecustomer() {
      vm.rate = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomerate(auth.authToken, vm.datacustomer.id).then(function (data) {
        if (data.status === 200) {
          if (data.data.length !== 0) {
            angular.forEach(data.data, function (dataitem) {
              if (dataitem.apply) {
                var data = {
                  id: dataitem.rate.id,
                  name: dataitem.rate.name,
                  ticked: true
                }
                vm.rate.push(data);
              }
            });
            vm.rate = $filter('orderBy')(vm.rate, 'name');
            if(vm.rate.length === 0) {
              logger.error($filter('translate')('1869'));
            }
          }
        }
      },
      function (error) {
        vm.modalError(error);
      });

    }

    function searchByDate() {
      if (vm.dateToSearch !== null) {
        vm.dateToSearch = new Date(vm.dateToSearch);
      } else {
        vm.dateToSearch = null;
      }
    }

    function getprovider() {
      vm.provider = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.getprovider(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.provider = $filter("filter")(data.data, function (e) {
            return e.applyParticular === false;
          })
          vm.provider = $filter('orderBy')(vm.provider, 'name');
          vm.datapprovider = vm.provider[0].id;
          if(!vm.multipleBilling) {
            vm.filterTpye = 2;
          } else {
            vm.filterTpye = 1;
          }
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function clickFiltersample(filter) {
      vm.filtersample = filter;
      if(filter === 4) {
        vm.clickFilterType(2);
      }
    }

    function clickFilterType(filter) {
      vm.filterTpye = filter;
    }

    function print(type) {
      vm.loading = true;
      vm.type = type;
      var preinvoice = {
        "branchId": vm.databranch,
        "customers": [],
        "rates": [],
        "startDate": vm.rangeInit,
        "endDate": vm.rangeEnd,
        "testFilterType": vm.numFilterAreaTest,
        "tests": vm.listAreas,
        'demographics': vm.demographics,
        "dateOfInvoice": new Date(moment(vm.dateToSearch).format()).getTime(),
        "payerId": vm.datapprovider,
        "comment": vm.comment,
        "filterTpye": vm.filterTpye,
        'dueDate': new Date(moment(vm.dueDate).format()).getTime(),
        'formOfPayment': vm.datapayment.id,
        "invoiceNumber":vm.bill,
        "reportTpye": vm.filtersample
      }

      if(vm.filterTpye === 1) {
        preinvoice.customers = _.map(vm.outputCustomers, 'id');
      } else if (vm.filterTpye === 2) {
        preinvoice.customers.push(vm.datacustomer.id);
        preinvoice.rates = _.map(vm.outputRates, 'id');;
      }

      if (vm.calculate === true) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        if(vm.filtersample === 4 ) {
          return cashboxDS.preinvoiceByOrder(auth.authToken, preinvoice).then(function (data) {
            if (data.status === 200) {
              vm.loading = false;
              vm.total = 0;
              vm.tax = 0;
              vm.taxs = [];
              vm.discount = 0;
              data.data.invoiceHeader.forEach( function(value) {
                value.dateOfInvoice = moment(value.dateOfInvoice).format(vm.formatDate);
                value.orders.forEach(function (val) {
                  val.orderCreationDate = moment(val.orderCreationDate).format(vm.formatDateHours);
                  if (val.allDemographics.length > 0) {
                    val.allDemographics.forEach(function (value2) {
                      val["demo_" + value2.idDemographic + "_name"] =
                        value2.demographic;
                      val["demo_" + value2.idDemographic + "_value"] =
                        value2.encoded === false
                          ? value2.notCodifiedValue
                          : value2.codifiedName;
                    });
                  }
                  if(vm.filtersample === 2) {
                    for(var i = 0; i < val.tests.length; i++) {
                      if(i === 0) {
                        val.tests[i].copayment = val.copayment;
                      } else {
                        val.tests[i].copayment = 0;
                      }
                    }
                  }
                });
              });
              vm.datareport = data.data.invoiceHeader;
              vm.generateFile();
            } else {
              vm.loading = false;
              UIkit.modal('#nofoundfilter').show();
            }
          },
            function (error) {
              vm.loading = false;
              vm.dataerror = '';
              vm.modalError(error);
            });
        } else {
          return cashboxDS.preinvoice(auth.authToken, preinvoice).then(function (data) {
            if (data.status === 200) {
              vm.loading = false;

              vm.total = 0;
              vm.tax = 0;
              vm.taxs = [];
              vm.discount = 0;

              data.data.invoiceHeader.forEach( function(value) {
                vm.capitated = value.capitated !== 0;
                vm.total += value.total;
                vm.tax += value.tax;
                if(value.taxs.length > 0) {
                  vm.taxs.push(value.taxs);
                }
                vm.discount += value.discount;

                value.dateOfInvoice = moment(value.dateOfInvoice).format(vm.formatDate);

                value.orders.forEach(function (val) {
                  val.orderCreationDate = moment(val.orderCreationDate).format(vm.formatDateHours);
                  if (val.allDemographics.length > 0) {
                    val.allDemographics.forEach(function (value2) {
                      val["demo_" + value2.idDemographic + "_name"] =
                        value2.demographic;
                      val["demo_" + value2.idDemographic + "_value"] =
                        value2.encoded === false
                          ? value2.notCodifiedValue
                          : value2.codifiedName;
                    });
                  }

                  if(vm.filtersample === 2) {
                    for(var i = 0; i < val.tests.length; i++) {
                      if(i === 0) {
                        val.tests[i].copayment = val.copayment;
                      } else {
                        val.tests[i].copayment = 0;
                      }
                    }
                  }
                });
              });

              vm.datareport = data.data.invoiceHeader;
              vm.generateFile();
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
                    if (item[0] === '1' && item[1].search("No sequence found to generate the invoice number with the resolution") !== -1) {
                      vm.dataerror = $filter('translate')('1566');
                    }
                    if (item[0] === '1' && item[1] === 'The associated entity does not have an assigned resolution') {
                      vm.dataerror = $filter('translate')('1567');
                    }
                    if (item[0] === '1' && item[1] === 'Invoice numbering has been exceeded') {
                      vm.dataerror = $filter('translate')('1568');
                    }
                    if (item[0] === '1' && item[1] === 'Duplicate invoice number') {
                      vm.dataerror = $filter('translate')('1569');
                    }
                    if (item[0] === '1' && item[1] === 'Invoice creation without invoice number') {
                      vm.dataerror = $filter('translate')('1570');
                    }
                    if (item[0] === '1' && item[1] === 'The current amount exceeds the maximum amount') {
                      vm.dataerror = $filter('translate')('1571') + ": " + item[2];
                    }
                    if (item[0] === '1' && item[1] === 'The current amount could not be assigned to the client') {
                      vm.dataerror = $filter('translate')('1572');
                    }
                    if (item[0] === '1' && item[1] === 'Limit per capita') {
                      vm.dataerror = $filter('translate')('1573');
                    }
                    if (item[0] === '1' && item[1] === 'Resolution not fount.') {
                      vm.dataerror = $filter('translate')('1597');
                    }
                    if (item[0] === '1' && item[1] === 'no valid contracts') {
                      vm.dataerror = $filter('translate')('2003');
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
      }
      else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        if(vm.filtersample === 4 ) {
          return cashboxDS.invoiceByOrder(auth.authToken, preinvoice).then(function (data) {
            if (data.status === 200) {
              vm.loading = false;
              vm.formOfPayment = data.data.formOfPayment === 1 ? $filter('translate')('1574') : $filter('translate')('1575');
              vm.dateexpirationinvoice = moment(data.data.dueDate).format(vm.formatDate);
              data.data.invoiceHeader.forEach( function(value) {
                value.orders.forEach(function (val) {
                  val.orderCreationDate = moment(val.orderCreationDate).format(vm.formatDateHours);
                });
              });
              vm.datareport = data.data.invoiceHeader;
              vm.generateFileinvoice();
            } else {
              vm.loading = false;
              UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.loading = false;
            vm.dataerror = '';
            vm.modalError(error);
          });
        }
        else {
          return cashboxDS.invoice(auth.authToken, preinvoice).then(function (data) {
            if (data.status === 200) {
              vm.loading = false;
              vm.invoiceNumber = data.data.invoiceNumber;
              vm.formOfPayment = data.data.formOfPayment === 1 ? $filter('translate')('1574') : $filter('translate')('1575');
              vm.dateexpirationinvoice = moment(data.data.dueDate).format(vm.formatDate);

              vm.total = 0;
              vm.tax = 0;
              vm.taxs = [];
              vm.discount = 0;
              data.data.invoiceHeader.forEach( function(value) {
                vm.capitated = value.capitated !== 0;
                vm.total += value.total;
                vm.tax += value.tax;
                if(value.hasOwnProperty("taxs")) {
                  if(value.taxs.length > 0) {
                    vm.taxs.push(value.taxs);
                  }
                }
                vm.discount += value.discount;
                value.orders.forEach(function (val) {
                  val.orderCreationDate = moment(val.orderCreationDate).format(vm.formatDateHours);
                });
              });
              vm.datareport = data.data.invoiceHeader;
              vm.generateFileinvoice();
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
                  if (item[0] === '1' && item[1].search("No sequence found to generate the invoice number with the resolution") !== -1) {
                    vm.dataerror = $filter('translate')('1566');
                  }
                  if (item[0] === '1' && item[1] === 'The associated entity does not have an assigned resolution') {
                    vm.dataerror = $filter('translate')('1567');
                  }
                  if (item[0] === '1' && item[1] === 'Invoice numbering has been exceeded') {
                    vm.dataerror = $filter('translate')('1568');
                  }
                  if (item[0] === '1' && item[1] === 'Duplicate invoice number') {
                    vm.dataerror = $filter('translate')('1569');
                  }
                  if (item[0] === '1' && item[1] === 'Invoice creation without invoice number') {
                    vm.dataerror = $filter('translate')('1570');
                  }
                  if (item[0] === '1' && item[1] === 'The current amount exceeds the maximum amount') {
                    vm.dataerror = $filter('translate')('1571');
                  }
                  if (item[0] === '1' && item[1] === 'The current amount could not be assigned to the client') {
                    vm.dataerror = $filter('translate')('1572');
                  }
                  if (item[0] === '1' && item[1] === 'Limit per capita') {
                    vm.dataerror = $filter('translate')('1573');
                  }
                  if (item[0] === '1' && item[1] === 'Resolution not fount.') {
                    vm.dataerror = $filter('translate')('1597');
                  }
                  if (item[0] === '1' && item[1] === 'no valid contracts') {
                    vm.dataerror = $filter('translate')('2003');
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
      }
    }

    //Si es 1 es pago en efectivo y si es 2 es crédito
    function generateFileinvoice() {

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var provider = $filter("filter")(JSON.parse(JSON.stringify(vm.provider)), function (e) {
        return e.id === vm.datapprovider;
      });
      var branch = $filter("filter")(JSON.parse(JSON.stringify(vm.branch)), function (e) {
        return e.id === vm.databranch;
      });

      var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')';
      vm.variables = {
        "ACCOUNT": customer,
        "period": moment(vm.rangeInit).format(vm.formatDate) + ' al ' + moment(vm.rangeEnd).format(vm.formatDate),
        "dateOfInvoice": moment(vm.dateToSearch).format(vm.formatDate),
        "dayOfInvoice": moment(vm.dateToSearch).format('DD'),
        "monthOfInvoice": moment(vm.dateToSearch).format('MM'),
        "yearOfInvoice": moment(vm.dateToSearch).format('YYYY'),
        "formOfPayment": vm.formOfPayment,
        "branch": branch[0].name,
        "provider": provider[0].name,
        "total": vm.total,
        "tax": vm.tax,
        "taxs": vm.taxs,
        "comment": vm.comment,
        "totalLiteral": "",
        "USERNAME": auth.userName,
        "billnumber": vm.invoiceNumber,
        "valuername": vm.valuername === '' ? $filter('translate')('1612') : vm.valuername,
        "dateexpirationinvoice": vm.dateexpirationinvoice
      };

      if(vm.filtersample === 1) {
        vm.pathreport = '/Report/billing/invoice/invoice1.mrt';
      } else if(vm.filtersample === 2) {
        vm.pathreport = '/Report/billing/invoice/invoice2.mrt';
      } else if(vm.filtersample === 3) {
        vm.pathreport = '/Report/billing/invoice/invoice3.mrt';
      } else if(vm.filtersample === 4) {
        vm.pathreport = '/Report/billing/invoice/invoicebyorder.mrt';
      }

      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport();

    }

    //Si es 1 es pago en efectivo y si es 2 es crédito
    function generateFile() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var provider = $filter("filter")(JSON.parse(JSON.stringify(vm.provider)), function (e) {
        return e.id === vm.datapprovider;
      })
      var branch = $filter("filter")(JSON.parse(JSON.stringify(vm.branch)), function (e) {
        return e.id === vm.databranch;
      });

      var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')';
      vm.variables = {
        "ACCOUNT": customer,
        "period": moment(vm.rangeInit).format(vm.formatDate) + ' al ' + moment(vm.rangeEnd).format(vm.formatDate),
        "dateOfInvoice": moment(vm.dateToSearch).format(vm.formatDate),
        "dayOfInvoice": moment(vm.dateToSearch).format('DD'),
        "monthOfInvoice": moment(vm.dateToSearch).format('MM'),
        "yearOfInvoice": moment(vm.dateToSearch).format('YYYY'),
        "totaldsicount": vm.discount,
        "branch": branch[0].name,
        "provider": provider[0].name,
        "total": vm.total,
        "tax": vm.tax,
        "taxs": vm.taxs,
        "comment": vm.comment,
        "totalLiteral": "",
        "USERNAME": auth.userName,
        "billnumber": "",
        "valuername": vm.valuername === '' ? $filter('translate')('1612') : vm.valuername
      };

      if(vm.filtersample === 1) {
        vm.pathreport = '/Report/billing/preinvoice/preinvoicereport1.mrt';
      } else if(vm.filtersample === 2) {
        vm.pathreport = '/Report/billing/preinvoice/preinvoicereport2.mrt';
      } else if(vm.filtersample === 3) {
        vm.pathreport = '/Report/billing/preinvoice/preinvoicereport3.mrt';
      } else if(vm.filtersample === 4) {
        vm.pathreport = '/Report/billing/preinvoice/preinvoicereportbyorder.mrt';
      }

      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport();
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var labelsreport = JSON.stringify($translate.getTranslationTable());
        labelsreport = JSON.parse(labelsreport);
        var parameterReport = {};
        parameterReport.datareport = vm.datareport;
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = labelsreport;
        parameterReport.type = vm.type;
        vm.ind = 1;
        vm.total = vm.datareport.length / 3;
        vm.porcent = 0;
        UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).show();
        var nIntervId;
        nIntervId = setInterval(vm.flasheaTexto, 200);
        reportadicional.reportRender(parameterReport).then(function (data) {
          UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).hide();
          vm.porcent = 0;
          clearInterval(nIntervId);
        });
        vm.report = false;

      } else {
        UIkit.modal('#modalReportError').show();
      }
    }

    function init() {
      vm.getbranch();
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
