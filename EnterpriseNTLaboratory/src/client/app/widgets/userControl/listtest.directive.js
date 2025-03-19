/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id
                disabled
                ratedefault
                getdatatests
                setdatatests
                cleantests
                infopatient
                viewsamples
                viewhead
                viewrate

  AUTOR:        @lbueno
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/reviewofresults/reviewofresults.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/deletespecial/deletespecial.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyreassignment/historyreassignment.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/patientconsultation/patientconsultation.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  15.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('listtest', listtest);

  listtest.$inject = ['testDS', 'demographicDS', 'localStorageService', 'orderDS', 'common', 'cashboxDS', '$translate', 'LZString',
    'logger', '$filter', 'moment', 'diagnosticDS', 'rateDS', '$rootScope'
  ];

  /* @ngInject */
  function listtest(testDS, demographicDS, localStorageService, orderDS, common, cashboxDS, $translate, LZString,
    logger, $filter, moment, diagnosticDS, rateDS, $rootScope) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/listtest.html',
      scope: {
        id: '=id',
        disabled: '=?disabled',
        ratedefault: '=ratedefault',
        clientdefault: '=clientdefault',
        blockbilling: '=blockbilling',
        blockservice: '=blockservice',
        getdatatests: '=getdatatests', //Retorna una lista de exámenes agregados a una orden
        setdatatests: '=setdatatests', //Recibe una lista de exámenes cargados de una orden
        setsamples: '=setsamples', //Recibe la lista de muestras con sus recipientes.
        cleantests: '=cleantests',
        infopatient: '=infopatient',
        viewsamples: '=?viewsamples',
        viewhead: '=?viewhead',
        viewrate: '=?viewrate',
        save: '=?save',
        usepatient: '=?usepatient',
        birthday: '=birthday',
        sex: '=sex',
        listdiagnosticstest: '=?listdiagnosticstest',
        order: '=order',
        listtestsbydemographics: '=listtestsbydemographics',
        testlist: '=?testlist',
        cash: '=?cash',
        returncash: '=?returncash',
        //resize: '=resize'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.loadTests = loadTests;
        vm.getListRate = getListRate;
        vm.removeTestAll = removeTestAll;
        vm.selectedTest = [];
        vm.selectedRow = [];
        vm.getTestData = getTestData;
        vm.listRate = new Array();
        vm.modelRate = new Array();
        vm.getPriceTestOrder = getPriceTestOrder;
        vm.symbolCurrency = localStorageService.get('SimboloMonetario');
        vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
        vm.subtracttax = localStorageService.get('RestarImpuesto') === 'True';
        vm.subtractCopay = localStorageService.get('RestarCopago') === 'True';
        vm.penny = vm.isPenny ? 2 : 0;
        vm.pennycontroller = vm.penny === 2 ? 1 : 0
        vm.manageRate = localStorageService.get('ManejoTarifa') === 'True';
        vm.managecustomer = localStorageService.get('ManejoCliente') === 'True';
        vm.manageDiagnostics = localStorageService.get('Diagnostics') === 'True';
        vm.trialdiscount = localStorageService.get('DescuentoPorPrueba') === 'True';
        vm.viewcustomerPercentage = localStorageService.get('VerClienteConDescuento') === 'True';
        vm.copayPercentage = localStorageService.get('CopagoPorcentaje') === 'True';
        vm.generaldiscountmanagement = localStorageService.get('ManejoDescuentoGeneral') === 'True';
        vm.isAddressCharge = localStorageService.get('CargoDomicilio') === 'True';

        vm.ordersWithCashbox = localStorageService.get('EditarOrdenCaja') === 'True';

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.maxDiscountUser = auth.maxDiscount;

        var user = localStorageService.get('user');
        vm.editOrderCash = user.editOrderCash;

        vm.getTestInfo = getTestInfo;
        vm.changeRate = changeRate;
        $scope.getdatatests = [];
        vm.normalizeNumberFormat = normalizeNumberFormat;

        vm.insurancePrice = 0;
        vm.totalpatientPrice = 0;
        //vm.total = $filter('currency')(0, vm.symbolCurrency, vm.penny);
        vm.rates = [];
        vm.viewSamples = $scope.viewsamples === undefined ? false : $scope.viewsamples;
        vm.rateDefault = $scope.ratedefault == undefined ? 0 : $scope.ratedefault;
        vm.clientdefault = $scope.clientdefault == undefined ? 0 : $scope.clientdefault;
        vm.viewRate = $scope.viewrate === undefined ? true : $scope.viewrate;
        vm.viewHead = $scope.viewhead === undefined ? true : $scope.viewhead;
        vm.height = vm.viewHead ? 'calc(100% - 52px)' : 'calc(100% - 29px)';
        vm.heighttable = vm.manageDiagnostics ? 'calc(100% - 60px)' : 'calc(100% - 28px)';
        var heightFoot = vm.manageRate && vm.viewRate ? ' - 0px' : ' + 22px';
        var heghtDiagnostic = vm.manageDiagnostics ? ' - 196px' : vm.manageRate && vm.viewRate ? ' - 158px' : ' - 140px';
        vm.heighttbody = vm.viewHead ? 'calc(100%' + heghtDiagnostic + heightFoot + ')' : 'calc(100% - 85px' + heightFoot + ')';
        // vm.heighttbody = vm.heighttbody === 'calc(100% - 168px - 0px)' ? 'calc(100% - 178px)' : vm.heighttbody;
        //Combo Examenes
        vm.tests = [];
        vm.getSelectTest = getSelectTest;
        vm.disabledTests = $scope.disabled;
        vm.deleteTests = [];
        vm.setDataTests = $scope.setdatatests === undefined ? [] : $scope.setdatatests;
        vm.cleanrates = false;

        //Diagnosticos
        vm.getdiagnostics = getdiagnostics;
        vm.getdiagnosticstest = getdiagnosticstest;
        vm.validremovediagnostics = validremovediagnostics;
        vm.removediagnostics = removediagnostics;
        vm.adddiagnostics = adddiagnostics;
        vm.getRequirements = getRequirements;
        vm.getSelectTestRequirement = getSelectTestRequirement;
        vm.treeRequirement = treeRequirement;
        vm.getReport = getReport;
        vm.windowOpenReport = windowOpenReport;
        vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
        vm.getallrate = getallrate;
        if (vm.manageRate) {
          vm.getallrate();
        }
        //vm.manageDiagnostics = localStorageService.get('Diagnostics') === 'True';
        if (vm.manageDiagnostics) {
          vm.getdiagnostics();
        }
        vm.invoice = {
          'subtotal': 0,
          'discounttest': 0,
          'taxValue': 0,
          'total': 0,
          'discountValue': 0,
          'copay': 0,
          'fee': 0,
          'otherpayments': 0,
          'balance': 0,
          'totalPaid': 0,
          'charge': 0
        }

        //Muestras y recipientes
        vm.samples = [];
        vm.title = $filter('translate')('0654').replace('Agregar / ', '').replace('Add / ', '');
        vm.modalValid = UIkit.modal('#modalConfirmTest', {
          modal: false,
          keyboard: false,
          bgclose: false,
          center: true
        });
        vm.modalValidTest = UIkit.modal('#modalErrorTest', {
          modal: false,
          keyboard: false,
          bgclose: false,
          center: true
        });
        vm.modalRequirement = UIkit.modal('#modalRequirement', {
          modal: false,
          keyboard: false,
          bgclose: false,
          center: true
        });
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.focusOutListTest = focusOutListTest;

        vm.loadTests();
        //  vm.getListRate();
        vm.stateTest = 0;

        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.isCashbox = false;
        vm.eventResize = eventResize;
        vm.eventValidityResult = eventValidityResult;

        $scope.$on('selection-changed', function (e, node) {
          if (node.path === undefined) {
            vm.options5 == {
              expandOnClick: false,
              filter: {}
            };
            return;
          }

        });
        vm.options5 == {
          expandOnClick: true,
          filter: {}
        };

        $scope.$watch('disabled', function () {
          vm.disabledTests = $scope.disabled;
        });

        function eventResize(e) {
          vm.maxWidth = e.currentTarget.clientWidth - 380;
        }


        $scope.$watch('ratedefault', function () {
          vm.rateDefault = $scope.ratedefault == undefined ? 0 : $scope.ratedefault;
          if ($scope.ratedefault !== undefined) {
            if (vm.managecustomer) {
              vm.getListRate($scope.clientdefault);
            }
            //if (vm.cleanrates) {
            //vm.cleanrates = false;
            var filterate = $filter("filter")(JSON.parse(JSON.stringify(vm.rates)), function (e) {
              return e.id === vm.rateDefault;
            })
            vm.selectedTest.forEach(function (value) {
              if (value.rate.id !== filterate[0].id) {
                var object = {
                  'showValue': filterate[0].code + '. ' + filterate[0].name,
                  'id': filterate[0].id,
                  'code': filterate[0].code,
                  'name': filterate[0].name
                };
                value.rate = object;
                $scope.$broadcast('angucomplete-alt:changeInput', 'orderentry_test_' + value.id, object);
                vm.getPriceTestOrder(value, filterate[0].id);
              }
            });

            //}
          }
        });

        $scope.$watch('blockbilling', function () {
          vm.blockbilling = $scope.blockbilling == undefined ? false : $scope.blockbilling;
          if (vm.blockbilling) {
            vm.messageCashbox = $filter('translate')('1637').replace('@@@@', $scope.order);
          }
        });

        $scope.$watch('blockservice', function () {
          vm.blockservice = $scope.blockservice == undefined ? false : $scope.blockservice;
          if (vm.blockservice) {
            vm.messageCashbox = $filter('translate')('2084').replace('@@@@', $scope.order);
          }
        });

        $scope.$watch('clientdefault', function () {
          if (vm.managecustomer) {
            vm.clientdefault = $scope.clientdefault == undefined ? 0 : $scope.clientdefault;
            if ($scope.clientdefault !== undefined) {
              if (vm.changueclientdefault === undefined && vm.selectedTest.length === 0) {
                vm.changueclientdefault = $scope.clientdefault;
                vm.getListRate($scope.clientdefault)
              } else if (vm.changueclientdefault === $scope.clientdefault) {
                vm.changueclientdefault = $scope.clientdefault;
              } else if (vm.selectedTest.length === 0) {
                vm.changueclientdefault = $scope.clientdefault;
                vm.getListRate($scope.clientdefault);
              } else if (vm.selectedTest.length !== 0) {
                vm.cleanrates = true;
                vm.changueclientdefault = $scope.clientdefault;
                vm.getcalRate($scope.clientdefault);
              }
            } else if (vm.selectedTest.length !== 0) {
              vm.cleanrates = true;
              vm.changueclientdefault = $scope.clientdefault;
              var totalpatientPrice = 0;
              var taxValue = 0;
              var totaldiscounttestpo = 0;
              var discounttestvalue = 0;
              vm.selectedTest.forEach(function (value) {
                value.rate = {};
                $scope.$broadcast("angucomplete-alt:clearInput", 'orderentry_test_' + value.id);
                value.price = 0;
                value.insurancePrice = 0;
                value.patientPrice = 0;
                value.tax = 0;
                value.taxValue = 0;
                value.discount = 0;
                totalpatientPrice = totalpatientPrice + value.patientPrice;
                if (value.billing !== undefined) {
                  var valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                  var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                  discounttestvalue = calculatediscounttest;
                  totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                } else if (value.discount !== 0) {
                  var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                  discounttestvalue = calculatediscounttest;
                  totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                } else {
                  discounttestvalue = 0;
                  totaldiscounttestpo = totaldiscounttestpo + 0;
                }
                if (value.tax !== undefined) {
                  var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                  taxValue = taxValue + calculatediscount;
                }
              });
              vm.invoice.subtotal = totalpatientPrice;
              vm.invoice.discounttest = totaldiscounttestpo;
              vm.invoice.taxValue = taxValue;
              var totaltest = totalpatientPrice - totaldiscounttestpo;
              if (vm.subtracttax) {
                totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
                totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
              } else {
                totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
                totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
              }
              vm.invoice.total = totaltest;
              vm.invoice.totalPaid = totaltest;

            }
          }
        });

        $scope.$watch('infopatient', function () {
          if ($scope.birthday !== undefined || $scope.sex !== undefined) undefined;
          vm.infoPatient = {};
          if ($scope.usepatient === undefined || $scope.usepatient) {
            var name2 = $scope.infopatient[-109] === undefined ? '' : ' ' + $scope.infopatient[-109];
            var surName = $scope.infopatient[-102] === undefined ? '' : ' ' + $scope.infopatient[-102];
            vm.infoPatient = {
              'id': $scope.infopatient[-99],
              'type': $scope.infopatient[-10],
              'history': $scope.infopatient[-100],
              'birthday': $scope.infopatient[-105],
              'sex': $scope.infopatient[-104].code,
              'namefull': $scope.infopatient[-103] + name2.toUpperCase() + ' ' + $scope.infopatient[-101] + surName.toUpperCase()
            };
          }
        });
        $rootScope.$watch('changueTest', function () {
          if ($rootScope.changueTest !== undefined) {
            if ($rootScope.changueTest === 0) {
              vm.loadTests();
            } else {
              vm.loadingdiagnostics = true;
              var demoexcluir = localStorageService.get('DemograficoExcluirPrueba');
              orderDS.gettestInexclude(auth.authToken, parseInt(demoexcluir), $rootScope.changueTest).then(function (response) {
                if (response.data.length > 0) {
                  var tests = [];
                  response.data.forEach(function (test, index) {
                    tests.push({
                      'id': test.test.id,
                      'area': {
                        'id': test.test.area.id,
                        'abbreviation': test.test.area.id === 0 ? 'N/A' : test.test.area.abbreviation,
                        'name': test.test.area.id === 0 ? 'N/A' : test.test.area.name
                      },
                      'code': test.test.code,
                      'codeCups': test.test.codeCups,
                      'abbr': test.test.abbr.toUpperCase(),
                      'name': test.test.name.toUpperCase(),
                      'namesearch': _.deburr(test.test.name) + test.test.name,
                      'colorType': (test.test.testType === 0 ? 'images/test.png' : (test.test.testType === 1 ? 'images/profile.png' : 'images/package.png')),
                      'type': test.test.testType,
                      'confidential': test.test.confidential,
                      'sample': {
                        'id': test.test.sample.id,
                        'code': test.test.sample.code,
                        'name': test.test.sample.name
                      },
                      'gender': test.test.gender,
                      'minAge': test.test.minAge,
                      'maxAge': test.test.maxAge,
                      'unitAge': test.test.unitAge,
                      'testType': test.test.testType,
                      'showValue': test.test.code + '. ' + test.test.name.toUpperCase()
                    });
                  });
                  tests = tests.sort(function (a, b) {
                    if (a.code.trim().length > b.code.trim().length) {
                      return 1;
                    } else if (a.code.trim().length < b.code.trim().length) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                  $scope.testlist = tests;
                  vm.tests = tests;
                  if (vm.selectedTest.length) {
                    vm.selectedTest.forEach(function (data) {
                      var comparated = _.filter(_.clone(vm.tests), function (o) { return o.id === data.id; });
                      if (comparated.length === 0) {
                        var datadeletetest = {
                          'description': 'PRUEBAS',
                          'id': 0,
                          'image': "images/test.png",
                          'originalObject': data,
                          'title': data.code + '. ' + data.name.toUpperCase()
                        }
                        vm.searchtest = '-' + data.code
                        vm.getSelectTest(datadeletetest);
                      }
                    });
                  }
                  vm.loadingdiagnostics = false;
                }
              }, function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
              });
            }
          }
        });

        $rootScope.$watch('editTestExclude', function () {
          if ($rootScope.editTestExclude !== undefined) {
            if ($rootScope.editTestExclude === 0) {
              vm.loadTests();
            } else {
              vm.loadingdiagnostics = true;
              var demoexcluir = localStorageService.get('DemograficoExcluirPrueba');
              orderDS.gettestInexclude(auth.authToken, parseInt(demoexcluir), $rootScope.editTestExclude).then(function (response) {
                if (response.data.length > 0) {
                  var tests = [];
                  response.data.forEach(function (test, index) {
                    tests.push({
                      'id': test.test.id,
                      'area': {
                        'id': test.test.area.id,
                        'abbreviation': test.test.area.id === 0 ? 'N/A' : test.test.area.abbreviation,
                        'name': test.test.area.id === 0 ? 'N/A' : test.test.area.name
                      },
                      'code': test.test.code,
                      'codeCups': test.test.codeCups,
                      'abbr': test.test.abbr.toUpperCase(),
                      'name': test.test.name.toUpperCase(),
                      'namesearch': _.deburr(test.test.name) + test.test.name,
                      'colorType': (test.test.testType === 0 ? 'images/test.png' : (test.test.testType === 1 ? 'images/profile.png' : 'images/package.png')),
                      'type': test.test.testType,
                      'confidential': test.test.confidential,
                      'sample': {
                        'id': test.test.sample.id,
                        'code': test.test.sample.code,
                        'name': test.test.sample.name
                      },
                      'gender': test.test.gender,
                      'minAge': test.test.minAge,
                      'maxAge': test.test.maxAge,
                      'unitAge': test.test.unitAge,
                      'testType': test.test.testType,
                      'showValue': test.test.code + '. ' + test.test.name.toUpperCase()
                    });
                  });
                  tests = tests.sort(function (a, b) {
                    if (a.code.trim().length > b.code.trim().length) {
                      return 1;
                    } else if (a.code.trim().length < b.code.trim().length) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                  $scope.testlist = tests;
                  vm.tests = tests;              
                  vm.loadingdiagnostics = false;
                }
              }, function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
              });
            }
          }
        });


        $scope.$watch('birthday', function () {
          vm.infoPatient = {};
          if ($scope.usepatient === undefined || $scope.usepatient) {
            var name2 = $scope.infopatient[-109] === undefined ? '' : ' ' + $scope.infopatient[-109];
            var surName = $scope.infopatient[-102] === undefined ? '' : ' ' + $scope.infopatient[-102];
            vm.infoPatient = {
              'id': $scope.infopatient[-99],
              'type': $scope.infopatient[-10],
              'history': $scope.infopatient[-100],
              'birthday': $scope.birthday,
              'sex': $scope.sex,
              'namefull': $scope.infopatient[-103] + name2.toUpperCase() + ' ' + $scope.infopatient[-101] + surName.toUpperCase()
            };
          }
        });

        $scope.$watch('sex', function () {
          vm.infoPatient = {};
          if ($scope.usepatient === undefined || $scope.usepatient) {
            var name2 = $scope.infopatient[-109] === undefined ? '' : ' ' + $scope.infopatient[-109];
            var surName = $scope.infopatient[-102] === undefined ? '' : ' ' + $scope.infopatient[-102];
            vm.infoPatient = {
              'id': $scope.infopatient[-99],
              'type': $scope.infopatient[-10],
              'history': $scope.infopatient[-100],
              'birthday': $scope.birthday,
              'sex': $scope.sex,
              'namefull': $scope.infopatient[-103] + name2.toUpperCase() + ' ' + $scope.infopatient[-101] + surName.toUpperCase()
            };
          }
        });

        function getallrate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return rateDS.getRates(auth.authToken).then(function (data) {
            vm.rates = [];
            if (data.status === 200) {
              data.data.forEach(function (value) {
                value.showValue = (value.code + '. ' + value.name).toUpperCase();
              });
              vm.rates = data.data;
            }
          });
        }

        $scope.$watch('listtestsbydemographics', function () {
          if ($scope.listtestsbydemographics !== undefined) {
            var tests = $scope.listtestsbydemographics === undefined ? [] : $scope.listtestsbydemographics;
            if (tests.length > 0) {
              tests.forEach(function (value, key) {
                vm.getSelectTest(value);
              });
            }
          }
        });

        $scope.$watch('setdatatests', function () {
          vm.isCashbox = false;
          if (document.getElementById('tableTest') !== null) {
            var dim = angular.element(document.getElementById('tableTest'));
            vm.maxWidth = dim.width() - 320;
          }
          if ($scope.setdatatests !== undefined) {
            vm.stateTest = 0;
            vm.validChilds = 0;
            vm.messagevalidchilds = '';
            vm.selectedTest = [];
            vm.calculate = false;
            vm.setDataTests = $scope.setdatatests === undefined ? [] : $scope.setdatatests;
            vm.samples = $scope.setsamples === undefined ? [] : $scope.setsamples;
            if ($scope.setdatatests.length === 0) {
              vm.removeTestAll();
            } else {
              vm.invoice = {
                'subtotal': 0,
                'discounttest': 0,
                'taxValue': 0,
                'total': 0,
                'discountValue': 0,
                'copay': 0,
                'fee': 0,
                'otherpayments': 0,
                'balance': 0,
                'totalPaid': 0,
                'discountType': 0,
                'copayType': 0,
                'charge': 0
              }

              var totalinsurancePrice = 0;
              var totaldiscounttest = 0;
              var totaldiscounttestpo = 0;
              var taxValue = 0;
              var discounttestvalue = 0;
              vm.totalinsurancePrice = 0;
              var totalpatientPrice = 0;
              vm.totalpatientPrice = 0;
              $scope.setdatatests.forEach(function (value, key) {
                vm.setDataTests[key].areaName = vm.setDataTests[key].areaName === undefined || vm.setDataTests[key].areaName === null ? 'N/A' : vm.setDataTests[key].areaName;
                vm.selectedTest.push(vm.setDataTests[key]);
                //Tarifa
                if (vm.manageRate && value.rate !== '') {
                  if (vm.rates.length > 0) {
                    vm.rateShowValue.push(false);
                    vm.listRate.push(vm.rates);
                    if (value.rate.id > 0) {
                      totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
                      totalpatientPrice = totalpatientPrice + value.patientPrice;
                      totaldiscounttest = totaldiscounttest + value.discount;
                      if (value.discount !== 0 && value.discount !== undefined && value.discount !== null) {
                        /* var calculatediscounttest = $filter('currency')((value.billing.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.pennycontroller) */
                        var calculatediscounttest = $filter('currency')((value.billing.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                        calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                        discounttestvalue = calculatediscounttest;
                        totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                      } else {
                        discounttestvalue = 0;
                        totaldiscounttestpo = totaldiscounttestpo + 0;
                      }
                      if (value.billing.tax !== undefined) {
                        /* var calculatediscount = $filter('currency')(((value.billing.patientPrice - discounttestvalue) * value.billing.tax) / 100, vm.symbolCurrency, vm.pennycontroller) */
                        var calculatediscount = $filter('currency')(((value.billing.patientPrice - discounttestvalue) * value.billing.tax) / 100, vm.symbolCurrency, vm.penny)
                        calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                        taxValue = taxValue + calculatediscount;
                      }
                    } else {
                      totaldiscounttest = 0;
                      totaldiscounttestpo = 0;
                      totalinsurancePrice = 0;
                      totalpatientPrice = 0;
                      taxValue = 0;
                      vm.priceDefault = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                    }
                  }



                  vm.messageCashbox = $filter('translate')('0880').replace('@@@@', $scope.order);
                }
              });
              vm.taxValue = taxValue;
              vm.totalpatientPrice = totalpatientPrice;
              vm.totaldiscounttestpo = totaldiscounttestpo;
              vm.totalinsurancePrice = totalinsurancePrice;
              if ($scope.order !== undefined) {
                cashboxDS.getCashbox(auth.authToken, $scope.order).then(
                  function (response) {
                    if (response.data.hasOwnProperty('header') || response.data.payments.length !== 0) {
                      if (response.data.hasOwnProperty('header')) {
                        var otherpayments = 0;
                        otherpayments = response.data.header.copay + response.data.header.fee;
                        var copay = 0;
                        copay = response.data.header.copay;
                        var fee = 0;
                        fee = response.data.header.fee;
                        var charge = 0;
                        charge = response.data.header.charge === null || response.data.header.charge === undefined ? 0 : response.data.header.charge;
                      }
                      var payments = 0;
                      if (response.data.payments.length !== 0) {

                        if (!vm.ordersWithCashbox || !vm.editOrderCash) {
                          vm.isCashbox = true;
                        }

                        response.data.payments.forEach(function (pay) {
                          pay.payment = $filter('currency')(pay.payment, vm.symbolCurrency, vm.penny ? 2 : 0);
                          payments += (pay.payment !== null && pay.payment != undefined ? vm.normalizeNumberFormat(pay.payment, vm.symbolCurrency) : 0);
                        });
                      }

                      var sumdiscount = vm.totalpatientPrice - vm.totaldiscounttestpo;
                      if (vm.subtracttax) {
                        var totaltest = $filter('currency')(sumdiscount - vm.taxValue, vm.symbolCurrency, vm.penny);
                        totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                      } else {
                        var totaltest = $filter('currency')(sumdiscount + vm.taxValue, vm.symbolCurrency, vm.penny);
                        totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                      }

                      if (response.data.header.discountPercent !== 0) {
                        response.data.header.discountValue = (totaltest * response.data.header.discountPercent) / 100;
                        /*  var discountValue = $filter('currency')((totaltest * response.data.header.discountPercent) / 100, vm.symbolCurrency, vm.penny);
                         response.data.header.discountValue = vm.normalizeNumberFormat(discountValue, vm.symbolCurrency); */
                      }
                      if (vm.subtractCopay) {
                        var totalPaid = $filter('currency')((totaltest - response.data.header.discountValue - payments) + fee + charge - copay, vm.symbolCurrency, vm.penny);
                      } else {
                        var totalPaid = $filter('currency')((totaltest - response.data.header.discountValue - payments) + fee + charge + copay, vm.symbolCurrency, vm.penny);
                      }
                      totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
                      vm.invoice = {
                        'subtotal': vm.totalpatientPrice,
                        'discounttest': vm.totaldiscounttestpo,
                        'taxValue': vm.taxValue,
                        'total': totaltest,
                        'discountValue': response.data.header.discountValue,
                        'copay': response.data.header.copay,
                        'fee': response.data.header.fee,
                        'balance': payments,
                        'otherpayments': 0,
                        'totalPaid': totalPaid,
                        'discountType': response.data.header.discountPercent !== 0 || response.data.header.discountPercent === undefined ? 1 : 0,
                        'copayType': response.data.header.copayType,
                        'charge': response.data.header.charge === null || response.data.header.charge === undefined ? 0 : response.data.header.charge
                      }
                    } else {
                      var totaltest = vm.totalpatientPrice - vm.totaldiscounttestpo;
                      if (vm.subtracttax) {
                        totaltest = $filter('currency')(totaltest - vm.taxValue, vm.symbolCurrency, vm.penny);
                        totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                      } else {
                        totaltest = $filter('currency')(totaltest + vm.taxValue, vm.symbolCurrency, vm.penny);
                        totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                      }
                      vm.invoice = {
                        'subtotal': vm.totalpatientPrice,
                        'discounttest': vm.totaldiscounttestpo,
                        'taxValue': vm.taxValue,
                        'total': totaltest,
                        'discountValue': 0,
                        'copay': 0,
                        'fee': 0,
                        'balance': 0,
                        'otherpayments': 0,
                        'totalPaid': totaltest,
                        'discountType': 0,
                        'copayType': 0,
                        'charge': 0
                      }
                    }
                  });
              }
              vm.diagnosticsselect = $scope.listdiagnosticstest;
            }
          }
          $scope.setdatatests = undefined;
          $scope.$apply();
        });


        $scope.$watch('cleantests', function () {

          if ($scope.cleantests === 1) {
            vm.removeTestAll();
          }
          $scope.cleantests = 0;
        });


        $scope.$watch('save', function () {
          if ($scope.save) {
            //Envía el arreglo de exámenes agregados y/o eliminados
            $scope.getdatatests = new Array();
            $scope.getdatatests.push(vm.getTestData($scope.save));
            $scope.getdatatests.push(vm.deleteTests);
            $scope.cash = {};
            $scope.cash = vm.invoice;
          }
          $scope.save = false;
        });

        $scope.$watch('returncash', function () {
          if ($scope.returncash) {
            $scope.cash = {};
            $scope.cash = vm.invoice;
          }
          $scope.returncash = false;
        });

        function getdiagnostics() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');

          diagnosticDS.getstateactive(auth.authToken).then(function (data) {
            if (data.status === 200) {
              vm.listdiagnostics = data.data
            }
          }, function (error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          });
        }

        vm.getcalRate = getcalRate;
        function getcalRate(id) {
          if (id !== undefined) {
            vm.loadingdiagnostics = true;
            auth = localStorageService.get('Enterprise_NT.authorizationData');
            return demographicDS.getsoonaccount(auth.authToken, id).then(function (data) {
              vm.rates = [];
              if (data.status === 200) {
                data.data.forEach(function (value) {
                  value.showValue = (value.code + '. ' + value.name).toUpperCase();
                });
                vm.rates = data.data;
                var totalinsurancePrice = 0;
                var totalpatientPrice = 0;
                var taxValue = 0;
                var discounttestvalue = 0;
                var totaldiscounttestpo = 0;
                var totaldiscounttest = 0;
                vm.selectedTest.forEach(function (value) {
                  value.rate = {};
                  $scope.$broadcast("angucomplete-alt:clearInput", 'orderentry_test_' + value.id);
                  value.price = 0;
                  value.insurancePrice = 0;
                  value.patientPrice = 0;
                  value.tax = 0;
                  value.taxValue = 0;
                  value.Valuediscount = 0;
                  if (value.patientPrice === 0) {
                    value.discount = 0;
                  }
                  totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
                  totalpatientPrice = totalpatientPrice + value.patientPrice;
                  totaldiscounttest = totaldiscounttest + value.discount;

                  if (value.billing !== undefined) {
                    var valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                    var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else if (value.discount !== 0) {
                    var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else {
                    discounttestvalue = 0;
                    totaldiscounttestpo = totaldiscounttestpo + 0;
                  }
                  if (value.tax !== undefined) {
                    var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                    taxValue = taxValue + calculatediscount;
                  }
                });
                vm.totalinsurancePrice = totalinsurancePrice;
                vm.invoice.subtotal = totalpatientPrice;
                vm.invoice.discounttest = totaldiscounttestpo;
                vm.invoice.taxValue = taxValue;
                var totaltest = totalpatientPrice - totaldiscounttestpo;
                if (vm.subtracttax) {
                  totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                } else {
                  totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                }
                vm.invoice.total = totaltest;
                var totalPaid = 0;
                if (vm.subtractCopay) {
                  totalPaid = $filter('currency')(totaltest - vm.invoice.copay + vm.invoice.fee + vm.invoice.charge - vm.invoice.balance, vm.symbolCurrency, vm.penny);
                } else {
                  totalPaid = $filter('currency')(totaltest + vm.invoice.copay + vm.invoice.fee + vm.invoice.charge - vm.invoice.balance, vm.symbolCurrency, vm.penny);
                }
                vm.invoice.totalPaid = totalPaid;

                vm.loadingdiagnostics = false;
              } else {
                var totalinsurancePrice = 0;
                var totalpatientPrice = 0;
                var taxValue = 0;
                var totaldiscounttestpo = 0;
                var discounttestvalue = 0;
                vm.selectedTest.forEach(function (value) {
                  value.rate = {};
                  $scope.$broadcast("angucomplete-alt:clearInput", 'orderentry_test_' + value.id);
                  value.price = 0;
                  value.insurancePrice = 0;
                  value.patientPrice = 0;
                  value.discount = 0;
                  value.tax = 0;
                  value.taxValue = 0;
                  totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
                  totalpatientPrice = totalpatientPrice + value.patientPrice;
                  if (value.billing !== undefined) {
                    var valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                    var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else if (value.discount !== 0) {
                    var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else {
                    discounttestvalue = 0;
                    totaldiscounttestpo = totaldiscounttestpo + 0;
                  }
                  if (value.tax !== undefined) {
                    var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                    taxValue = taxValue + calculatediscount;
                  }
                });
                vm.totalinsurancePrice = totalinsurancePrice;
                vm.invoice.subtotal = totalpatientPrice;
                vm.invoice.discounttest = totaldiscounttestpo;
                vm.invoice.taxValue = taxValue;
                var totaltest = totalpatientPrice - totaldiscounttestpo;
                if (vm.subtracttax) {
                  totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                } else {
                  totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                }
                vm.invoice.total = totaltest;

                vm.invoice.totalPaid = totaltest;
                vm.loadingdiagnostics = false;
              }
            });
          }
        }

        function removeTestAll() {
          vm.diagnosticsselect = [];
          vm.selectedTest = [];
          vm.deleteTests = [];
          vm.listRate = [];
          vm.modelRate = [];
          vm.samples = [];
          vm.rateShowValue = [];
          $scope.getdatatests = new Array();
          $scope.getdatatests.push([]);
          $scope.getdatatests.push([]);
          if (vm.manageRate) {
            vm.totalinsurancePrice = 0;
            vm.totalpatientPrice = 0;
            vm.invoice = {
              'subtotal': 0,
              'discounttest': 0,
              'taxValue': 0,
              'total': 0,
              'discountValue': 0,
              'copay': 0,
              'fee': 0,
              'otherpayments': 0,
              'balance': 0,
              'totalPaid': 0,
              'discountType': 0,
              'copayType': 0,
              'charge': 0
            }
          }
        }

        vm.filterListrates = filterListrates;

        function filterListrates(search, listrates) {
          var listratesfilter = [];

          listrates = _.filter(listrates, function (e) {
            return e.code !== 'C'
          })
          if (search.length === 1 && search.substring(0, 1) === '?') {
            listratesfilter = $filter('orderBy')(listrates, 'code');
          } else {
            listratesfilter = _.filter(listrates, function (color) {
              return color.code.toUpperCase().indexOf(search.toUpperCase()) !== -1 ||
                color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1 ||
                (color.code + '. ' + color.name).toUpperCase().indexOf(search.toUpperCase()) !== -1;
            });
          }

          vm.listratesfilter = listratesfilter

          return listratesfilter;
        }

        vm.focusInListRates = focusInListRates

        function focusInListRates(test, listrates) {

          vm.calculate = true;
          vm.idtestrate = test;
          vm.totalLoad = '0';

          var listratesfilter = [];
          var text = document.getElementById('orderentry_test_' + test.id + '_value').value;


          listratesfilter = _.filter(listrates, function (color) {
            return (color.code + '. ' + color.name).toUpperCase().indexOf(text.toUpperCase()) !== -1;
          });
          vm.listratesfilter = listratesfilter;
        }

        vm.focusOutListRates = focusOutListRates

        function focusOutListRates(test, listrates) {
          vm.idtestrate = null;
          if (vm.listratesfilter.length === 0) {
            $scope.$broadcast('angucomplete-alt:clearInput', 'orderentry_test_' + test.id);
            test.rate = null;
          } else {
            var listratesfilter = [];
            var text = document.getElementById('orderentry_test_' + test.id + '_value').value;
            listratesfilter = _.filter(listrates, function (color) {
              return (color.code + '. ' + color.name).toUpperCase().indexOf(text.toUpperCase()) !== -1;
            });

            if (listratesfilter.length !== 0) {
              var object = {
                'showValue': listratesfilter[0].code + '. ' + listratesfilter[0].name,
                'id': listratesfilter[0].id,
                'code': listratesfilter[0].code,
                'name': listratesfilter[0].name
              };
              test.rate = object;
              $scope.$broadcast('angucomplete-alt:changeInput', 'orderentry_test_' + test.id, object);
              vm.getPriceTestOrder(test, listratesfilter[0].id);
            } else {
              var object = {
                'showValue': vm.listratesfilter[0].code + '. ' + vm.listratesfilter[0].name,
                'id': vm.listratesfilter[0].id,
                'code': vm.listratesfilter[0].code,
                'name': vm.listratesfilter[0].name
              };
              test.rate = object;
              $scope.$broadcast('angucomplete-alt:changeInput', 'orderentry_test_' + test.id, object);
              vm.getPriceTestOrder(test, vm.listratesfilter[0].id);
            }
          }
        }

        function getListRate(id) {
          if (id !== undefined) {
            vm.loadingdiagnostics = true;
            auth = localStorageService.get('Enterprise_NT.authorizationData');
            return demographicDS.getsoonaccount(auth.authToken, id).then(function (data) {
              vm.rates = [];
              if (data.status === 200) {
                data.data.forEach(function (value) {
                  value.showValue = (value.code + '. ' + value.name).toUpperCase();
                });
                vm.rates = data.data;
                vm.loadingdiagnostics = false;
              }
              vm.loadingdiagnostics = false;
            });
          }
        }

        vm.filterListRate = function (search, listtest) {
          var listratefilter = [];
          if (search.length === 1 && search.substring(0, 1) === '?') {
            listratefilter = $filter('orderBy')(listtest, 'code');
          } else {
            listratefilter = _.filter(listtest, function (color) {
              return color.code.toUpperCase().indexOf(search.toUpperCase()) !== -1 || color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1;
            });
          }
          return listratefilter;
        };
        vm.removetest = removetest;
        function removetest(selected) {
          var data = {
            id: selected.id,
            code: selected.code,
            testType: selected.testType,
          }
          vm.deleteTests.push(data);
          vm.selectedTest = $filter("filter")(vm.selectedTest, function (e) {
            return e.id !== selected.id;
          });
        }
        /**
         * Cuando se selecciona un examen se invoca esta funcion
         * @param {*} selected Objeto del examen seleccionado
         */
        function getSelectTest(selected) {
          vm.loadingdiagnostics = selected === undefined ? false : true;
          var object = null;
          var toDelete = false;
          vm.totalLoad = '0';
          //vm.selected = selected !== undefined ? selected : vm.selected;
          vm.index = undefined;
          if (selected.hasOwnProperty('originalObject') && selected.hasOwnProperty('title')) {
            //object = $filter('filter')(vm.selectedTest, { 'id': selected.originalObject.id }, true)[0] ;
            object = _.filter(vm.selectedTest, function (sel) {
              return sel.id == selected.originalObject.id
            })[0];

            if (vm.searchtest) {
              if (object !== undefined && vm.searchtest.substring(0, 1) === '-') {
                toDelete = true;
                vm.selected = selected;
              } else if (object === undefined && vm.searchtest.substring(0, 1) === '-') {
                toDelete = null;
              } else {
                object = selected.originalObject;
              }
            } else {
              object = selected.originalObject;
            }

          } else if (!selected.hasOwnProperty('title')) {
            toDelete = null;
          } else {
            object = select;
          }
          if (!toDelete) {
            var exists = vm.selectedTest.find(function (test) {
              try {
                return object.id === test.id;
              } catch (e) {
                return true;
              }
            });
            if (exists === undefined) {
              var patientDBId = vm.infoPatient.id;

              var sex = vm.infoPatient.sex;
              var tempo = object.unitAge === 1 ? 'years' : 'days';
              var birthday = moment(vm.infoPatient.birthday, vm.formatDate.toUpperCase()).format();
              var age = common.getAgeTime(birthday, tempo);
              if (patientDBId === undefined || patientDBId === '') {
                patientDBId = '-1';
              }
              var rateSelected = vm.manageRate ? (vm.rateDefault !== 0 ? vm.rateDefault : '-2') : '-1';
              if (rateSelected === '-2') {
                setTimeout(function () {
                  vm.loadingdiagnostics = false;
                }, 1000);
                vm.messageNotSave = $filter('translate')('0816');
                vm.numError = '0';
                vm.modalValidTest.show();
                return;
              }

              //Validación de la edad y género del paciente
              vm.stateTest = selected.originalObject.testType;
              if (vm.stateTest > 0) {
                age = 0;
              }
              //-----------------------------------------------------------------------------------------
              if ($scope.usepatient) {
                if (age === 'NaN' || sex === undefined) {
                  vm.messageNotSave = $filter('translate')('0815');
                  vm.numError = '0';
                  vm.modalValidTest.show();
                  setTimeout(function () {
                    vm.loadingdiagnostics = false;
                  }, 1000);
                  return;
                } else {
                  if ((age < selected.originalObject.minAge || age > selected.originalObject.maxAge) &&
                    (sex === '1' && selected.originalObject.gender.code === '2') || (sex === '2' && selected.originalObject.gender.code === '1')) {
                    vm.messageNotSave = $filter('translate')('0675') + '\n' + '\n' + $filter('translate')('0674');
                    vm.numError = '2';
                    setTimeout(function () {
                      vm.loadingdiagnostics = false;
                    }, 1000);
                    vm.modalValidTest.show();
                    return;
                  } else if (age < selected.originalObject.minAge || age > selected.originalObject.maxAge) {
                    vm.messageNotSave = $filter('translate')('0675');
                    vm.numError = '3';
                    setTimeout(function () {
                      vm.loadingdiagnostics = false;
                    }, 1000);
                    vm.modalValidTest.show();
                    return;
                  } else if ((sex === '1' && selected.originalObject.gender.code === '2') || (sex === '2' && selected.originalObject.gender.code === '1')) {
                    vm.messageNotSave = $filter('translate')('0674');
                    vm.numError = '4';
                    setTimeout(function () {
                      vm.loadingdiagnostics = false;
                    }, 1000);
                    vm.modalValidTest.show();

                    return;
                  } else {
                    vm.numError = '0';
                    vm.loadingdiagnostics = false;
                  }
                }
              }
              if (vm.manageDiagnostics) {
                vm.getdiagnosticstest(selected.originalObject.id, patientDBId, object, rateSelected);
              } else {
                vm.getTestInfo(selected.originalObject.id, patientDBId, object, rateSelected)
              }
            }
          } else if (toDelete) {

            if (vm.selectedTest.length > 0) {
              // vm.stateTest = $filter('filter')(vm.selectedTest, { code: object.code }, true)[0].state;
              // vm.validChilds = $filter('filter')(vm.selectedTest, { code: object.code }, true)[0].validatedChilds;
              vm.stateTest = _.filter(vm.selectedTest, function (t) {
                return t.code == object.code
              }, true)[0].state;
              vm.validChilds = _.filter(vm.selectedTest, function (t) {
                return t.code == object.code
              }, true)[0].validatedChilds;
              vm.validChilds = vm.validChilds === undefined ? 0 : vm.validChilds;
              if (vm.stateTest > 1 || vm.validChilds > 0) {
                vm.messagevalidchilds = $filter('translate')('0930').replace('@@', vm.validChilds.toString());
                vm.modalValid.show();
                if (!vm.accept) return false;
                vm.accept = false;
              }
            }
            var code = object.code;
            var indexF = -1;
            var testId = -1;
            var testType = -1;
            var sample = null;
            vm.selectedTest.forEach(function (test, index) {
              if (test.code === code) {
                testId = test.id;
                testType = test.type;
                indexF = index;
                sample = test.sample;
              }
            });
            if (indexF > -1) {
              vm.deleteTests.push({
                'id': testId,
                'code': code,
                'testType': testType,
                'sample': sample
              });
              vm.selectedTest.splice(indexF, 1);
              if (vm.manageRate) {
                vm.listRate.splice(indexF, 1);
                vm.modelRate.splice(indexF, 1);
                vm.rateShowValue.splice(indexF, 1);
              }
              //Resta el valor de la tarifa recalculando el total.
              /*  var total = 0; */
              var totalinsurancePrice = 0;
              var totalpatientPrice = 0;
              var taxValue = 0;
              var totaldiscounttestpo = 0;
              var discounttestvalue = 0;
              vm.selectedTest.forEach(function (value, key) {
                totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
                totalpatientPrice = totalpatientPrice + value.patientPrice;

                var valueDiscount = 0;
                if (value.billing !== undefined) {
                  valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                  var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                  discounttestvalue = calculatediscounttest;
                  totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                } else if (value.discount !== 0) {
                  var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                  discounttestvalue = calculatediscounttest;
                  totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                } else {
                  discounttestvalue = 0;
                  totaldiscounttestpo = totaldiscounttestpo + 0;
                }
                if (value.tax !== undefined) {
                  var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                  calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                  taxValue = taxValue + calculatediscount;
                }
              });
              vm.totalinsurancePrice = totalinsurancePrice;
              vm.invoice.subtotal = totalpatientPrice;
              vm.invoice.discounttest = totaldiscounttestpo;
              vm.invoice.taxValue = taxValue;
              var totaltest = totalpatientPrice - totaldiscounttestpo;
              if (vm.subtracttax) {
                totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
                totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
              } else {
                totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
                totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
              }
              vm.invoice.total = totaltest;
              vm.invoice.totalPaid = totaltest;
              //Busca en el listado de muestras para eliminar el examen asociado
              var temSamples = vm.samples;
              var newSamples = [];
              var indexTest = -1;
              temSamples.forEach(function (sample, index) {
                //Si el examen eliminado esta asociado a la muestra
                if (_.filter(sample.tests, function (sam) {
                  return sam.code == code
                }).length > 0) {
                  indexTest = -1;
                  //Busca el examen por codigo
                  sample.tests.forEach(function (sampleTest, index2) {
                    if (sampleTest.code === code) {
                      indexTest = index2;
                    }
                  });
                  //Elimina el examen encontrado
                  sample.tests.splice(indexTest, 1);
                }
              });
              //Busca si alguna muestra no tiene examenes asociados para eliminarlas
              var samplesWithTests = [];
              temSamples.forEach(function (sample, index) {
                if (sample.tests.length > 0) {
                  samplesWithTests.push(sample);
                }
              });
              vm.samples = samplesWithTests;
            }
            vm.selected = undefined;
            vm.loadingdiagnostics = false;
          }
          setTimeout(function () {
            vm.loadingdiagnostics = false;
          }, 1000)

          //Envía el arreglo de exámenes agregados y/o eliminados
          $scope.getdatatests = new Array();
          $scope.getdatatests.push(vm.getTestData($scope.save));
          $scope.getdatatests.push(vm.deleteTests);
        }

        function getdiagnosticstest(idtest, patientDBId, object, rateSelected) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          diagnosticDS.getIdtest(auth.authToken, idtest).then(function (data) {
            if (data.status === 200) {

              var validdiagnostics = _.filter(data.data, {
                'selected': true
              });
              var countdiagnostics = 0;
              if (validdiagnostics.length > 0) {
                vm.diagnosticsselect.forEach(function (value, index) {
                  var finddiagnostics = _.filter(validdiagnostics, function (o) {
                    return o.id === value.id;
                  });
                  if (finddiagnostics.length > 0) {
                    countdiagnostics = countdiagnostics + 1;
                  }
                });
              }
              if (countdiagnostics === 0) {
                setTimeout(function () {
                  vm.loadingdiagnostics = false;
                }, 1000);
                vm.messageNotSave = $filter('translate')('0838');
                vm.numError = '4';
                vm.modalValidTest.show();
                return;
              } else {
                vm.getTestInfo(idtest, patientDBId, object, rateSelected)
              }
            }
          }, function (error) {
            if (error.data === null) {
              vm.errorservice = vm.errorservice + 1;
              vm.Error = error;
              vm.ShowPopupError = true;
            }
          });
        }

        function validremovediagnostics(item) {
          vm.loadingdiagnostics = true;
          vm.diagnosticremove = item;
          vm.listtestdiagnostics = [];
          if (vm.selectedTest.length > 0) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');

            var data = {
              'tests': [],
              'diagnostics': []
            }

            vm.diagnosticsselect.forEach(function (diagnostic, index) {
              var item = {
                id: diagnostic.id
              }
              data.diagnostics.push(item)
            });
            vm.selectedTest.forEach(function (test, index) {
              var item = {
                id: test.id
              }
              data.tests.push(item)
            });

            diagnosticDS.getTestDiagnostics(auth.authToken, data).then(function (data) {
              if (data.status === 200) {
                data.data.forEach(function (test, index) {
                  if (test.diagnostics.length === 1 && test.diagnostics[0].id === vm.diagnosticremove.id) {
                    vm.listtestdiagnostics.push(test.idTest)
                  }
                })
                if (vm.listtestdiagnostics.length > 0) {
                  vm.diagnosticsselect.push(vm.diagnosticremove)
                  setTimeout(function () {
                    vm.loadingdiagnostics = false;
                  }, 1000)
                  UIkit.modal('#modalConfirmDiagnostics', {
                    modal: false,
                    keyboard: false,
                    bgclose: false,
                    center: true
                  }).show();
                } else {
                  $scope.listdiagnosticstest = vm.diagnosticsselect;
                }
              } else {
                vm.loadingdiagnostics = false;
                $scope.listdiagnosticstest = vm.diagnosticsselect;
              }

            }, function (error) {
              if (error.data === null) {
                vm.errorservice = vm.errorservice + 1;
                vm.Error = error;
                vm.ShowPopupError = true;
                vm.loadingdiagnostics = false;
              }
            });
          } else {
            vm.loadingdiagnostics = false;
          }
        }

        function removediagnostics(valid) {
          vm.listError = [];

          var listvalidtest = [];
          var listresulttest = [];

          for (var i = 0; i < vm.listtestdiagnostics.length; i++) {
            var test = $filter('filter')(vm.selectedTest, {
              id: vm.listtestdiagnostics[i]
            }, true)[0]

            if (test.state > 1 && valid !== true) {
              var item = {
                test: test.code + ' ' + test.name
              }
              if (test.state === 4) {
                listvalidtest.push(item)
              } else {
                listresulttest.push(item)
              }
            } else {
              var code = vm.listtestdiagnostics[i].code;
              var indexF = -1;
              var testId = -1;
              var testType = -1;
              vm.selectedTest.forEach(function (test, index) {
                if (test.id === vm.listtestdiagnostics[i]) {
                  testId = test.id;
                  testType = test.type;
                  indexF = index;
                }
              });

              if (indexF > -1) {
                vm.deleteTests.push({
                  'id': testId,
                  'code': code,
                  'testType': testType
                });
                vm.selectedTest.splice(indexF, 1);
                if (vm.manageRate) {
                  vm.listRate.splice(indexF, 1);
                  vm.modelRate.splice(indexF, 1);
                  vm.rateShowValue.splice(indexF, 1);
                }
                //Resta el valor de la tarifa recalculando el total.
                var totalinsurancePrice = 0;
                var totalpatientPrice = 0;
                var taxValue = 0;
                var totaldiscounttestpo = 0;
                var discounttestvalue = 0;
                vm.selectedTest.forEach(function (value, key) {
                  totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
                  totalpatientPrice = totalpatientPrice + value.patientPrice;

                  var valueDiscount = 0;

                  if (value.billing !== undefined) {
                    valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                    var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else if (value.discount !== 0) {
                    var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                    discounttestvalue = calculatediscounttest;
                    totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
                  } else {
                    discounttestvalue = 0;
                    totaldiscounttestpo = totaldiscounttestpo + 0;
                  }
                  if (value.tax !== undefined) {
                    var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                    calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                    taxValue = taxValue + calculatediscount;
                  }
                });
                vm.totalinsurancePrice = totalinsurancePrice;
                vm.invoice.subtotal = totalpatientPrice;
                vm.invoice.discounttest = totaldiscounttestpo;
                vm.invoice.taxValue = taxValue;
                var totaltest = totalpatientPrice - totaldiscounttestpo;
                if (vm.subtracttax) {
                  totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                } else {
                  totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
                  totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                }
                vm.invoice.total = totaltest;
                vm.invoice.totalPaid = totaltest;
                //Busca en el listado de muestras para eliminar el examen asociado
                var temSamples = vm.samples;
                var newSamples = [];
                var indexTest = -1;
                temSamples.forEach(function (sample, index) {
                  //Si el examen eliminado esta asociado a la muestra
                  if ($filter('filter')(sample.tests, {
                    'code': code
                  }, true).length > 0) {
                    indexTest = -1;
                    //Busca el examen por codigo
                    sample.tests.forEach(function (sampleTest, index2) {
                      if (sampleTest.code === code) {
                        indexTest = index2;
                      }
                    });
                    //Elimina el examen encontrado
                    sample.tests.splice(indexTest, 1);
                  }
                });
                //Busca si alguna muestra no tiene examenes asociados para eliminarlas
                var samplesWithTests = [];
                temSamples.forEach(function (sample, index) {
                  if (sample.tests.length > 0) {
                    samplesWithTests.push(sample);
                  }
                });
                vm.samples = samplesWithTests;
              }
              vm.selected = undefined;
            }
          }

          if (listvalidtest.length > 0 || listresulttest.length > 0) {

            UIkit.modal('#modalConfirmDiagnostics').hide();
            vm.numError = listvalidtest.length > 0 ? '7' : '8';
            vm.listError = listvalidtest.length > 0 ? listvalidtest : listresulttest;
            vm.modalValidTest.show();
            if (!vm.accept) return false;
            vm.accept = false;
          } else {
            $scope.getdatatests = new Array();
            $scope.getdatatests.push(vm.getTestData($scope.save));
            $scope.getdatatests.push(vm.deleteTests);
          }

          vm.diagnosticsselect = _.filter(vm.diagnosticsselect, function (o) {
            return o.id !== vm.diagnosticremove.id
          })
          UIkit.modal('#modalConfirmDiagnostics').hide();
        }

        function adddiagnostics() {
          $scope.listdiagnosticstest = vm.diagnosticsselect;
        }

        function getTestInfo(testid, patientDBId, object, rateSelected) {
          orderDS.getTestInfo(auth.authToken, patientDBId, object.id, object.type, rateSelected).then(
            function (response) {
              if (response.status === 200) {
                var data = response.data;
                //Busca si el examen esta en eliminados
                if (_.filter(vm.deleteTests, function (pru) {
                  return pru.id == object.id
                }).length > 0) {
                  //Si lo contiene lo elimina de la lista
                  var indexDel = -1;
                  vm.deleteTests.forEach(function (test, index) {
                    if (testid === object.id) {
                      indexDel = index;
                    }
                  });
                  vm.deleteTests.splice(indexDel, 1);
                }
                vm.selectedTest.push({
                  'id': object.id,
                  'code': object.code,
                  'name': object.name,
                  'area': object.area,
                  'areaName': object.area.name,
                  'areaId': object.area.id,
                  'rate': vm.manageRate ? (vm.rateDefault !== undefined ? {
                    'id': vm.rateDefault
                  } : {
                    'id': 0
                  }) : {
                    'id': 0
                  },
                  'price': data.price !== undefined && data.price !== null ? data.price : 0,
                  'insurancePrice': data.insurancePrice !== undefined && data.insurancePrice !== null ? data.insurancePrice : 0,
                  'patientPrice': data.patientPrice !== undefined && data.patientPrice !== null ? data.patientPrice : 0,
                  'discount': data.discount !== undefined && data.discount !== null ? data.discount : 0,
                  'discountvaluetest': data.discount !== undefined && data.discount !== null ? data.discount : 0,
                  'state': 0,
                  'type': object.type,
                  'testType': object.type,
                  'sample': object.sample,
                  'resultValidity': (data.resultValidity !== undefined ? data.resultValidity : null),
                  'account': vm.managecustomer ? (vm.clientdefault !== undefined ? {
                    'id': vm.clientdefault
                  } : {
                    'id': 0
                  }) : {
                    'id': 0
                  }
                });

                //Tarifa
                if (vm.manageRate) {
                  var add = vm.selectedTest.length - 1;
                  if (vm.rates.length > 0) {
                    vm.showValue = _.filter(JSON.parse(JSON.stringify(vm.rates)), function (r) {
                      return r.id == vm.rateDefault
                    })[0].showValue;
                    vm.rateShowValue.push(true);
                    // vm.listRate.push(vm.rates);
                    // vm.modelRate.push({rate: vm.rates, id: 0});
                    if (vm.rateDefault > 0) {
                      // vm.modelRate[add].id = vm.rateDefault;
                      vm.selectedTest[add].rate.showValue = vm.showValue;
                      vm.getPriceTestOrder(vm.selectedTest[add], vm.rateDefault);

                    } else {
                      vm.priceDefault = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                    }
                    vm.calculate = true;
                  }
                }

                var samples = data.samples;
                var temSamples = vm.samples;
                samples.forEach(function (sample, index) {
                  if (_.filter(temSamples, function (s) {
                    return s.id == parseInt(sample.id)
                  }).length === 0) {
                    //La muestra no esta en la lista y la agrega
                    temSamples.push({
                      'id': sample.id,
                      'name': sample.name,
                      'container': {
                        'name': sample.container.name,
                        'image': sample.container.image === '' ? 'images/empty-container.png' : 'data:image/png;base64,' + sample.container.image
                      },
                      'tests': [{
                        'id': object.id,
                        'code': object.code
                      }]
                    });
                  } else {
                    $filter('filter')(temSamples, {
                      id: parseInt(sample.id)
                    }, true)[0].tests.push({
                      'id': object.id,
                      'code': object.code
                    });
                  }
                });
                temSamples.forEach(function (sample, index) {
                  sample.index = (index + 1);
                });
                vm.samples = temSamples;

              }
              vm.loadingdiagnostics = false
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }

        /**
         * Carga en el autocomplete los examenes configurados
         */
        function loadTests() {
          vm.loadingdiagnostics = true;
          $scope.testlist = [];
          vm.filterListTest = function (search, listtest) {
            var listtestfilter = [];
            if (search.length > 1 && search.substring(0, 1) === '-') {
              search = search.substring(1, search.length)
            }

            if (search.length === 1 && search.substring(0, 1) === '?') {
              listtestfilter = $filter('orderBy')(listtest, 'code');
            } else {
              listtestfilter = _.filter(listtest, function (color) {
                return color.code.toUpperCase().indexOf(search.toUpperCase()) !== -1 || color.namesearch.toUpperCase().indexOf(search.toUpperCase()) !== -1;
              });
            }
            listtestfilter = listtestfilter.splice(0, 100)
            return listtestfilter;
          };
          vm.inputChangedTest = function (text) {
            vm.searchtest = text
          }
          orderDS.getTestToOrderEntry(auth.authToken).then(function (response) {
            if (response.data.length > 0) {
              var tests = [];
              response.data.forEach(function (test, index) {
                tests.push({
                  'id': test.id,
                  'area': {
                    'id': test.area.id,
                    'abbreviation': test.area.id === 0 ? 'N/A' : test.area.abbreviation,
                    'name': test.area.id === 0 ? 'N/A' : test.area.name
                  },
                  'code': test.code,
                  'codeCups': test.codeCups,
                  'abbr': test.abbr.toUpperCase(),
                  'name': test.name.toUpperCase(),
                  'namesearch': _.deburr(test.name) + test.name,
                  'colorType': (test.testType === 0 ? 'images/test.png' : (test.testType === 1 ? 'images/profile.png' : 'images/package.png')),
                  'type': test.testType,
                  'confidential': test.confidential,
                  'sample': {
                    'id': test.sample.id,
                    'code': test.sample.code,
                    'name': test.sample.name
                  },
                  'gender': test.gender,
                  'minAge': test.minAge,
                  'maxAge': test.maxAge,
                  'unitAge': test.unitAge,
                  'testType': test.testType,
                  'showValue': test.code + '. ' + test.name.toUpperCase()
                });
              });
              tests = tests.sort(function (a, b) {
                if (a.code.trim().length > b.code.trim().length) {
                  return 1;
                } else if (a.code.trim().length < b.code.trim().length) {
                  return -1;
                } else {
                  return 0;
                }
              });
              $scope.testlist = tests;
              vm.tests = tests;
              vm.loadingdiagnostics = false;
            }
          }, function (error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          });

        }


        function focusOutListTest() {
          $scope.$broadcast('angucomplete-alt:clearInput', 'orderentry_tests');
        }

        /**
         * Obtiene los datos de los examenes
         */
        function getTestData(save) {
          var tests = [];
          if (save) {
            var r = 0;
            vm.selectedTest.forEach(function (test, index) {
              var notRateSelected = (test.rate.id === undefined) && vm.manageRate; // ? vm.rateDefault : test.rate.id;
              if (!notRateSelected) {
                tests.push({
                  'id': test.id,
                  'code': test.code,
                  'name': test.name,
                  'testType': test.type,
                  'rate': {
                    'id': test.rate.id
                  },
                  'codeCups': test.codeCups,
                  'price': test.price,
                  'insurancePrice': test.insurancePrice,
                  'patientPrice': test.patientPrice,
                  'discount': test.discount,
                  'areaId': test.areaId,
                  'areaName': test.areaName
                });
              } else {
                r++;
              }
            });
            if (r > 0) {
              vm.messageNotSave = r > 1 ? $filter('translate')('0817').replace('##', r.toString()) : $filter('translate')('0818');
              vm.numError = '5';
              vm.modalValidTest.show();
              return -1;
            }
          } else {
            vm.selectedTest.forEach(function (test, index) {
              tests.push({
                'id': test.id,
                'code': test.code,
                'name': test.name,
                'testType': test.type,
                'rate': {
                  'id': test.rate
                },
                'codeCups': test.codeCups,
                'price': test.price,
                'insurancePrice': test.insurancePrice,
                'patientPrice': test.patientPrice,
                'discount': test.discount
              });
            });
          }

          return tests;
        }

        vm.focusdiscount = focusdiscount;
        function focusdiscount(test) {
          document.getElementById('rate_' + test.id).focus();
          $scope.$apply();
        }

        vm.changeDiscount = changeDiscount;
        function changeDiscount(test) {
          if (test.discount === 0) {
            test.Valuediscount = 0
          } else {
            /* var calculatediscount = $filter('currency')((test.patientPrice * test.discount) / 100, vm.symbolCurrency, vm.pennycontroller); */
            var calculatediscount = $filter('currency')((test.patientPrice * test.discount) / 100, vm.symbolCurrency, vm.penny);
            test.Valuediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
          }
          var totalpatientPrice = 0;
          var taxValue = 0;
          var totaldiscounttestpo = 0;
          var discounttestvalue = 0;
          var totalinsurancePrice = 0;
          vm.selectedTest.forEach(function (value, key) {
            totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
            totalpatientPrice = totalpatientPrice + value.patientPrice;
            if (value.billing !== undefined) {
              var valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
              var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
              calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
              discounttestvalue = calculatediscounttest;
              totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
            } else if (value.discount !== 0) {
              var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
              calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
              discounttestvalue = calculatediscounttest;
              totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
            } else {
              discounttestvalue = 0;
              totaldiscounttestpo = totaldiscounttestpo + 0;
            }
            if (value.tax !== undefined) {
              var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
              calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
              taxValue = taxValue + calculatediscount;
            }
          });
          vm.totalinsurancePrice = totalinsurancePrice;
          vm.invoice.subtotal = totalpatientPrice;
          vm.invoice.discounttest = totaldiscounttestpo;
          vm.invoice.taxValue = taxValue;
          var totaltest = totalpatientPrice - totaldiscounttestpo;
          if (vm.subtracttax) {
            totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
            totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
          } else {
            totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
            totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
          }
          vm.invoice.total = totaltest;
          vm.invoice.totalPaid = totaltest;
        }

        function getPriceTestOrder(test, rate) {
          auth = localStorageService.get('Enterprise_NT.authorizationData');
          return orderDS.getPriceTestOrder(auth.authToken, test.id, rate).then(function (data) {
            if (data.status === 200) {
              test.price = data.data.servicePrice;
              test.insurancePrice = data.data.insurancePrice;
              test.patientPrice = data.data.patientPrice;
              test.discount = 0;
              test.tax = 0;
              test.taxValue = 0;
              test.Valuediscount = 0;
              if (data.data.tax !== undefined) {
                var calculatediscount = $filter('currency')((data.data.patientPrice * data.data.tax) / 100, vm.symbolCurrency, vm.penny)
                calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                test.tax = data.data.tax;
                test.taxValue = calculatediscount;
              }
            } else {
              test.discount = 0;
              test.price = 0;
              test.insurancePrice = 0;
              test.patientPrice = 0;
              test.tax = 0;
              test.taxValue = 0;
              test.Valuediscount = 0;
            }
            var totaldiscounttest = 0;
            var totalinsurancePrice = 0;
            var totalpatientPrice = 0;
            var taxValue = 0;
            var totaldiscounttestpo = 0;
            var discounttestvalue = 0;
            vm.selectedTest.forEach(function (value, key) {
              totaldiscounttest = totaldiscounttest + value.discount;
              totalinsurancePrice = totalinsurancePrice + value.insurancePrice;
              totalpatientPrice = totalpatientPrice + value.patientPrice;
              if (value.billing !== undefined) {
                var valueDiscount = value.billing.discount === null || value.billing.discount === undefined ? 0 : value.billing.discount;
                var calculatediscounttest = $filter('currency')((value.patientPrice * valueDiscount) / 100, vm.symbolCurrency, vm.penny)
                calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                discounttestvalue = calculatediscounttest;
                totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
              } else if (value.discount !== 0) {
                var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
                calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
                discounttestvalue = calculatediscounttest;
                totaldiscounttestpo = totaldiscounttestpo + calculatediscounttest;
              } else {
                discounttestvalue = 0;
                totaldiscounttestpo = totaldiscounttestpo + 0;
              }
              if (value.tax !== undefined) {
                var calculatediscount = $filter('currency')(((value.patientPrice - discounttestvalue) * value.tax) / 100, vm.symbolCurrency, vm.penny)
                calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
                taxValue = taxValue + calculatediscount;
              }
            });
            vm.totalinsurancePrice = totalinsurancePrice;
            vm.invoice.subtotal = totalpatientPrice;
            vm.invoice.discounttest = totaldiscounttestpo;
            vm.invoice.taxValue = taxValue;
            var totaltest = totalpatientPrice - totaldiscounttestpo;
            if (vm.subtracttax) {
              totaltest = $filter('currency')(totaltest - taxValue, vm.symbolCurrency, vm.penny);
              totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
            } else {
              totaltest = $filter('currency')(totaltest + taxValue, vm.symbolCurrency, vm.penny);
              totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
            }
            vm.invoice.total = totaltest;
            var totalPaid = 0;
            if (vm.subtractCopay) {
              totalPaid = $filter('currency')(totaltest - vm.invoice.copay + vm.invoice.fee + vm.invoice.charge - vm.invoice.balance, vm.symbolCurrency, vm.penny);
            } else {
              totalPaid = $filter('currency')(totaltest + vm.invoice.copay + vm.invoice.fee + vm.invoice.charge - vm.invoice.balance, vm.symbolCurrency, vm.penny);
            }
            totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
            vm.invoice.totalPaid = totalPaid;
          });
        }

        function changeRate(selected) {
          if (selected !== undefined) {
            if (selected.originalObject.hasOwnProperty('id')) {
              if (vm.select === undefined) {
                vm.idtestrate.rate = selected.originalObject;
                vm.select = selected
                vm.getPriceTestOrder(vm.idtestrate, vm.idtestrate.rate.id);
              } else if (vm.select === '' || vm.select.originalObject.id !== selected.originalObject.id) {
                vm.idtestrate.rate = selected.originalObject;
                vm.select = selected
                vm.getPriceTestOrder(vm.idtestrate, vm.idtestrate.rate.id);
              }
            }
          }
        }


        //Función que devuelve la normalización de un valor monetario en formato numérico estandar
        function normalizeNumberFormat(valueCurrency, symbol) {
          try {
            return parseFloat(valueCurrency.replace(/\,/g, '').replace(symbol, ''));
          } catch (e) {
            return valueCurrency;
          }
        }

        function eventValidityResult(test) {
          vm.resultValidity = {
            'photo': 'data:image/png;base64,' + test.resultValidity.userLastResult.photo,
            'lastName': test.resultValidity.userLastResult.lastName,
            'name': test.resultValidity.userLastResult.name,
            'dateLastResult': moment(test.resultValidity.dateLastResult).format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
            'daysFromLastResult': test.resultValidity.daysFromLastResult + ' ' + $filter('translate')('0476')
          }
        }

        function getRequirements() {
          vm.modalRequirement.show();
          var testunique = [];
          vm.treeRequirements = [];
          vm.namePatient = vm.infoPatient !== undefined ? vm.infoPatient.namefull.trim() : '';
          vm.selectedTestReq = new Array();
          vm.selectedTest.forEach(function (test, index) {
            vm.selectedTestReq.push({
              'id': test.id,
              'code': test.code,
              'name': test.name,
              'quantity': '(0)'
            });
            var imgType = (test.testType === 0 ? 'images/test.png' : (test.testType === 1 ? 'images/profile.png' : 'images/package.png'));
            vm.treeRequirements.push({
              'listRequirements': [],
              'idtest': test.id,
              'code': test.code,
              'name': test.name,
              'codename': test.code + ' - ' + test.name,
              'imgType': imgType
            });
            testunique = [{
              'id': test.id
            }];
            testDS.getRequirements(auth.authToken, testunique).then(function (response) {
              if (response.status === 200) {
                response.data.forEach(function (value) {
                  vm.treeRequirements[index].listRequirements.push({
                    'idrequirement': value.id,
                    'name': value.requirement,
                    'image': 'images/microbiology/oval.png'
                  });
                });
                vm.selectedTestReq[index].quantity = '(' + response.data.length.toString() + ')';
              }
              vm.treeRequirement(vm.treeRequirements);
            }, function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
            });
          });
          return vm.treeRequirements;

        }
        /**
         * Cuando se selecciona un examen para consultar requisitos se invoca esta funcion
         * @param {*} selected Objeto del examen seleccionado
         */
        function getSelectTestRequirement(selected) {
          var object = null;
          var toDelete = false;
          if (selected.hasOwnProperty('originalObject') && selected.hasOwnProperty('title')) {
            object = _.filter(vm.selectedTestReq, function (sel) {
              return sel.id == selected.originalObject.id
            })[0];
            if (object !== undefined && vm.searchtest.substring(0, 1) === '-') {
              toDelete = true;
              //vm.selected = selected;
            } else if (object === undefined && vm.searchtest.substring(0, 1) === '-') {
              toDelete = null;
            } else {
              object = selected.originalObject;
            }
          } else if (!selected.hasOwnProperty('title')) {
            toDelete = null;
          } else {
            object = select;
          }
          if (!toDelete) {
            var exists = vm.selectedTestReq.find(function (test) {
              try {

                return object.id === test.id;
              } catch (e) {
                return true;
              }
            });
            if (!exists) {
              var inx = vm.treeRequirements.length;
              vm.selectedTestReq.push({
                'id': object.id,
                'code': object.code,
                'name': object.name,
                'quantity': '(0)'
              });
              var imgType = (object.testType === 0 ? 'images/test.png' : (object.testType === 1 ? 'images/profile.png' : 'images/package.png'));
              vm.treeRequirements.push({
                'listRequirements': [],
                'idtest': object.id,
                'codename': object.code + ' - ' + object.name,
                'imgType': imgType
              });
              var testunique = [{
                'id': object.id
              }];
              testDS.getRequirements(auth.authToken, testunique).then(
                function (response) {
                  if (response.status === 200) {
                    response.data.forEach(function (value) {
                      vm.treeRequirements[inx].listRequirements.push({
                        'name': value.requirement,
                        'image': 'images/microbiology/oval.png'
                      });
                    })
                  }
                  vm.selectedTestReq[inx].quantity = '(' + response.data.length.toString() + ')';
                  vm.treeRequirement(vm.treeRequirements);
                },
                function (error) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                }
              );
            }

          } else if (toDelete) {
            if (vm.selectedTestReq.length > 0) {
              var code = object.code;
              var indexF = -1;
              var testId = -1;
              var testType = -1;
              vm.selectedTestReq.forEach(function (test, index) {
                if (test.code === code) {
                  testId = test.id;
                  testType = test.type;
                  indexF = index;
                }
              });

              if (indexF > -1) {
                vm.selectedTestReq.splice(indexF, 1);
                var treeReq = _.filter(vm.treeRequirements, function (r) {
                  return r.idtest !== testId
                });
                vm.treeRequirements = treeReq;
                vm.basicTree = [];
                vm.treeRequirement(vm.treeRequirements);
              }
            }
            //vm.loadingdiagnostics = false;
          }
        }

        //** Método para tratar el arreglo de busqueda para los padres del arbol**//
        function treeRequirement(data) {
          vm.basicTree = [];
          data.forEach(function (value, key) {
            var object1 = {
              name: value.codename,
              image: value.imgType,
              children: value.listRequirements
            }
            vm.basicTree.push(object1);
          });
        }

        function getReport() {
          vm.loadingdiagnostics = true;
          vm.windowOpenReport();
        }

        function windowOpenReport() {
          if (vm.treeRequirements.length > 0) {

            var tests = [];
            vm.selectedTestReq.forEach(function (test) {
              tests.push({
                'id': test.id
              });
            });
            testDS.getRequirements(auth.authToken, tests).then(function (response) {
              if (response.status === 200) {
                var parameterReport = {};
                var variables = [{
                  'patient': vm.namePatient.toUpperCase(),
                  'username': auth.userName,
                  'date': moment().format(vm.dateFormat),
                  'datehour': moment().format(vm.dateFormat + ' HH:mm:ss'),
                  'type': vm.infoPatient.type,
                  'history': vm.infoPatient.history
                }];
                response.data.forEach(function (value) {
                  value.test = _.filter(JSON.parse(JSON.stringify(vm.treeRequirements)), function (o) {
                    o.itemsdefault = _.filter(o.listRequirements, function (p) {
                      return p.idrequirement === value.id
                    });
                    return o.itemsdefault.length > 0
                  })
                });
                var reportData = response.data;
                parameterReport.variables = variables;
                parameterReport.pathreport = '/Report/pre-analitic/requirement/requirement.mrt';;
                parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
                var compressReportData = LZString.compressToUTF16(JSON.stringify(reportData));
                localStorageService.set('parameterReport', parameterReport);
                localStorageService.set('dataReport', compressReportData);
                window.open('/viewreport/viewreport.html');
                vm.loadingdiagnostics = false;
              } else {
                vm.loadingdiagnostics = false;
              }
            },
              function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
                vm.loadingdiagnostics = false;
              });

          } else {
            vm.loadingdiagnostics = false;
          }
        }


      }],
      controllerAs: 'listtest'
    };
    return directive;
  }
})();
/* jshint ignore:end */
