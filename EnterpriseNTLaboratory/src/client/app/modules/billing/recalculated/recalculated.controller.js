/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.recalculated')
    .controller('recalculatedController', recalculatedController);


  recalculatedController.$inject = ['localStorageService', 'customerDS',
    '$filter', '$state', 'moment', '$rootScope', 'rateDS', 'cashboxDS','testDS', 'logger'];

  function recalculatedController(localStorageService, customerDS,
    $filter, $state, moment, $rootScope, rateDS, cashboxDS,testDS, logger) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'recalculated';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1598');
    vm.simbolmoney = localStorageService.get('SimboloMonetario') === "" || localStorageService.get('SimboloMonetario') === null ? "$" : localStorageService.get('SimboloMonetario');
    vm.decimal = localStorageService.get('ManejoCentavos') === 'True'? 2:0;
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    $rootScope.helpReference = '08.billing/recalculated.htm';
    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");
    vm.modalError = modalError;
    vm.getaccounts = getaccounts;
    vm.getrate = getrate;
    vm.print = print;
    vm.getTest = getTest;
    vm.datasearch = [];
    $rootScope.pageview = 3;

    function getaccounts() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.customer = [];
      return customerDS.getCustomerstate(auth.authToken).then(function (data) {
        vm.getTest();
        if (data.status === 200) {
          vm.customer = $filter('orderBy')(data.data, 'name');
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function getrate() {
      vm.rate = [];
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomerate(auth.authToken, vm.datacustomer).then(function (data) {
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
        vm.loadingdata = false;
      },
      function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }

    function print() {
      var data = {
        "customerId": vm.datacustomer,
        "rateId": vm.datarate,
        "startDate": vm.rangeInit,
        "endDate": vm.rangeEnd
      }
      vm.datasearch = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return cashboxDS.recalculateRates(auth.authToken, data).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          if (data.data.details.length === 0) {
            UIkit.modal('#nofoundfilter').show();
          } else {
            logger.success($filter('translate')('1909'));
            data.data.details.forEach(function (value) {
              value.name = _.find(vm.dataTest, function(e) { return e.id === value.testId; }).name;
            });
            vm.datasearch = data.data.details;
          }
        } else {
          UIkit.modal('#nofoundfilter').show();
        }
      },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        });
    }

    function getTest() {
      vm.dataTest = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        if (data.status === 200) {
          vm.dataTest = data.data;
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
    function init() {
      vm.getaccounts();
    }

    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
