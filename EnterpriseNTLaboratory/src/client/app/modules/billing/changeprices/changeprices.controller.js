/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.changeprices')
    .controller('changepricesController', changepricesController);


  changepricesController.$inject = ['localStorageService', '$filter', '$state', 'moment', '$rootScope', 'cashboxDS', 'common', 'orderDS', 'logger'];

  function changepricesController(localStorageService, $filter, $state, moment, $rootScope, cashboxDS, common, orderDS, logger) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'changeprices';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1872');
    vm.simbolmoney = localStorageService.get('SimboloMonetario') === "" || localStorageService.get('SimboloMonetario') === null ? "$" : localStorageService.get('SimboloMonetario');
    vm.decimal = localStorageService.get('ManejoCentavos') === 'True' ? 2 : 0;
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    $rootScope.helpReference = '08.billing/changeprices.htm';
    vm.modalError = modalError;
    vm.searchorder = '';
    vm.autocomplenumberorder = autocomplenumberorder;
    var orderdigit = localStorageService.get('DigitosOrden');
    vm.maxcantdigit = parseInt(orderdigit) + 8;
    vm.findOrder = findOrder;
    vm.tests = [];
    vm.calculate = calculate;
    vm.getCashbox = getCashbox;
    vm.normalizeNumberFormat = normalizeNumberFormat;
    vm.save = save;
    vm.symbolCurrency = localStorageService.get('SimboloMonetario');
    vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
    vm.subtracttax = localStorageService.get('RestarImpuesto') === 'True';
    vm.penny = vm.isPenny ? 2 : 0;
    $rootScope.pageview = 3;

    //Función que devuelve la normalización de un valor monetario en formato numérico estandar
    function normalizeNumberFormat(valueCurrency, symbol) {
      try {
        return parseFloat(valueCurrency.replace(/\,/g, '').replace(symbol, ''));
      } catch (e) {
        return valueCurrency;
      }
    }

    function calculate() {

      vm.totalpatientPrice = _.sumBy(vm.tests, function(o) { return parseInt(o.billing.patientPrice); });
      vm.totaldiscounttestpo = 0;
      vm.taxValue = 0;

      if (vm.cashbox.hasOwnProperty('header') || vm.cashbox.payments.length !== 0) {
        if (vm.cashbox.hasOwnProperty('header')) {
          var otherpayments = 0;
          otherpayments = vm.cashbox.header.copay + vm.cashbox.header.fee;
        }
        var payments = 0;
        if (vm.cashbox.payments.length !== 0) {
          vm.cashbox.payments.forEach(function (pay) {
            payments += (pay.payment !== null && pay.payment != undefined ? vm.normalizeNumberFormat(pay.payment, vm.symbolCurrency) : 0);
          });
        }

        var discounttestvalue = 0;
        vm.tests.forEach(function(value){
          if (value.billing.discount !== 0) {
            var calculatediscounttest = $filter('currency')((value.billing.patientPrice * value.billing.discount) / 100, vm.symbolCurrency, vm.penny)
            calculatediscounttest = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
            discounttestvalue = calculatediscounttest;
            vm.totaldiscounttestpo = vm.totaldiscounttestpo + calculatediscounttest;
          } else {
            discounttestvalue = 0;
            vm.totaldiscounttestpo = vm.totaldiscounttestpo + 0;
          }

          if (value.billing.tax !== undefined) {
            var calculatediscount = $filter('currency')(((value.billing.patientPrice - discounttestvalue) * value.billing.tax) / 100, vm.symbolCurrency, vm.penny)
            calculatediscount = vm.normalizeNumberFormat(calculatediscount, vm.symbolCurrency);
            vm.taxValue = vm.taxValue + calculatediscount;
          }
        });

        var sumdiscount = vm.totalpatientPrice - vm.totaldiscounttestpo;
        if (vm.subtracttax) {
          var totaltest = $filter('currency')(sumdiscount - vm.taxValue, vm.symbolCurrency, vm.penny);
          totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
        } else {
          var totaltest = $filter('currency')(sumdiscount + vm.taxValue, vm.symbolCurrency, vm.penny);
          totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
        }

        if (vm.cashbox.header.discountPercent !== 0) {
          var discountValue = $filter('currency')((totaltest * vm.cashbox.header.discountPercent) / 100, vm.symbolCurrency, vm.penny);
          vm.cashbox.header.discountValue = vm.normalizeNumberFormat(discountValue, vm.symbolCurrency);
        }

        var totalPaid = $filter('currency')((totaltest + otherpayments - vm.cashbox.header.discountValue) - payments, vm.symbolCurrency, vm.penny);
        totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);

        vm.cashbox.header.subTotal = vm.totalpatientPrice;
        vm.cashbox.header.balance = totalPaid;
        vm.cashbox.header.taxValue = vm.taxValue;

        vm.invoice = {
          'subtotal': vm.totalpatientPrice,
          'discounttest': vm.totaldiscounttestpo,
          'taxValue': vm.taxValue,
          'total': totaltest,
          'discountValue': vm.cashbox.header.discountValue,
          'copay': vm.cashbox.header.copay,
          'fee': vm.cashbox.header.fee,
          'balance': payments,
          'otherpayments': otherpayments,
          'totalPaid': totalPaid
        }
      } else {
        logger.error($filter('translate')('1874'));
        vm.order = undefined;
        vm.tests = [];
        vm.cashbox = null;
      }
    }

    function autocomplenumberorder($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        var orderdigit = localStorageService.get('DigitosOrden');
        var cantdigit = parseInt(orderdigit) + 4;
        if (vm.searchorder.length < cantdigit) {
          if (vm.searchorder.length === cantdigit - 1) {
            vm.searchorder = '0' + vm.searchorder;
            vm.searchorder = moment().year() + vm.searchorder;
          } else if (parseInt(orderdigit) === vm.searchorder.length - 1) {
            vm.searchorder = '0' + vm.searchorder;
            vm.searchorder = moment().year() + (common.getOrderComplete(vm.searchorder, orderdigit)).substring(4);
          } else {
            vm.searchorder = vm.searchorder === '' ? 0 : vm.searchorder;
            vm.searchorder = moment().year() + (common.getOrderComplete(vm.searchorder, orderdigit)).substring(4);
          }
        } else if (vm.searchorder.length > cantdigit) {
          if (vm.searchorder.length === cantdigit + 1) {
            vm.searchorder = (moment().format('YYYY')).substring(0, 3) + vm.searchorder;
          } else if (vm.searchorder.length === cantdigit + 2) {
            vm.searchorder = (moment().format('YYYY')).substring(0, 2) + vm.searchorder;
          } else if (vm.searchorder.length === cantdigit + 3) {
            vm.searchorder = (moment().format('YYYY')).substring(0, 1) + vm.searchorder;
          } else {
            vm.searchorder = vm.searchorder;
          }
        } else if (vm.searchorder.length === cantdigit) {
          vm.searchorder = moment().year() + vm.searchorder;
        }
        vm.findOrder();
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }

    function getCashbox() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.getCashbox(auth.authToken, vm.searchorder).then(function (data) {
        if (data.status === 200) {
          vm.cashbox = data.data;
          vm.calculate();
          vm.loading = false;
        } else {
          UIkit.modal('#nofoundfilter').show();
        }
      },
        function (error) {
          vm.modalError(error);
        });

    }

    function findOrder() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return orderDS.getOrder(auth.authToken, vm.searchorder).then(function (data) {
        if (data.status === 200) {
          vm.order = data.data;
          vm.tests = data.data.resultTest;
          vm.getCashbox();
        } else {
          vm.loading = false;
          UIkit.modal('#nofoundfilter').show();
        }
      },
      function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }

    function save() {
      var listtest = [];
      vm.tests.forEach(function(value) {
        listtest.push({
          'id': value.testId,
          'patientPrice': value.billing.patientPrice,
          'insurancePrice': value.billing.insurancePrice
        });
      });
      var data = {
        'order': vm.order.orderNumber,
        'tests': listtest,
        'cashbox': vm.cashbox
      }
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return cashboxDS.changePrices(auth.authToken, data).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('1875'));
          vm.order = undefined;
          vm.tests = [];
          vm.cashbox = null;
        }
        vm.loading = false;
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

    function init() {}

    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
