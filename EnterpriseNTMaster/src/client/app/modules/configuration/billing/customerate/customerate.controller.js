(function () {
  'use strict';

  angular
    .module('app.customerate')
    .controller('CustomerateController', CustomerateController)
    .controller('customeraterequeridController', customeraterequeridController)
    .controller('SeleccionController', SeleccionController);

  CustomerateController.$inject = ['rateDS', 'customerDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope',
    'ModalService', 'LZString', '$translate'
  ];

  function CustomerateController(rateDS, customerDS, configurationDS,
    localStorageService, logger, $filter, $state, moment, $rootScope,
    ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'CustomerRate';
    vm.nit = ['nit', 'name'];
    vm.namecustomer = ['name', 'nit'];
    vm.sortReverse = false;
    vm.sortType = vm.nit;
    vm.code = ['code', 'name', 'typePayer', 'apply'];
    vm.namerate = ['name', 'code', 'typePayer', 'apply'];
    vm.typePayer = ['-typePayer', '-apply', '+code', '+name'];
    vm.apply = ['-apply', '-typePayer', '+code', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.code;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getrate = getrate;
    vm.Listrate = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.idaccount = 0;
    vm.updateacountrate = updateacountrate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Método que obtiene la lista para llenar la grilla**//
    function getrate() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.getstate(auth.authToken).then(function (data) {
        vm.Listrate = data.data;
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.additionalAddress;
        delete value.address;
        delete value.alertAmount;
        delete value.city;
        delete value.colony;
        delete value.connectivityEMR;
        delete value.currentAmount;
        delete value.department;
        delete value.discount;
        delete value.email;
        delete value.epsCode;
        delete value.fax;
        delete value.faxSend;
        delete value.institutional;
        delete value.maxAmount;
        delete value.namePrint;
        delete value.observation;
        delete value.password;
        delete value.phone;
        delete value.postalCode;
        delete value.print;
        delete value.responsable;
        delete value.selfPay;
        delete value.sendEnd;
        delete value.state;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getrate();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomerate(auth.authToken, vm.idaccount).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.apply;
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var literalresul = vm.updateacountrate();
      if (literalresul.length === 0) {
        ModalService.showModal({
          templateUrl: 'seleccion.html',
          controller: 'SeleccionController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'No') {
              $state.go('container');
            }
          });
        });
      } else {
        return customerDS.newCustomerate(auth.authToken, literalresul).then(function (data) {
          if (data.status === 200) {
            vm.get();
            vm.sortReverse1 = false;
            vm.sortType1 = vm.apply;
            logger.success($filter('translate')('0042'));
            return data;
          }
        }, function (error) {
          vm.modalError(error);

        });
      }

    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    // metodo para ordenar el json
    function updateacountrate() {
      var rate = [];
      vm.Detail.forEach(function (value, key) {
        if (value.apply === true) {
          var object = {
            'user': {
              'id': auth.id
            },
            'account': {
              'id': vm.idaccount,
              'name': vm.name
            },
            'rate': {
              'id': value.id,
              'name': value.name
            },
            'apply': value.apply

          };
          rate.push(object);
        }
      });
      return rate;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomerstate(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        vm.modalrequired();
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.Listrate.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'customeraterequeridController',
          inputs: {
            hiderate: vm.Listrate.length,
            hidecustomer: vm.data.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(customer, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = customer.id;
      vm.Detail = [];
      vm.idaccount = customer.id;
      vm.name = customer.name;
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.username = customer.username;
      vm.loadingdata = true;
      return customerDS.getCustomerate(auth.authToken, vm.idaccount).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].rate.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.apply;
          vm.loadingdata = false;
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.account;
        delete value.lastTransaction;
        data.data[key].code = value.rate.code;
        data.data[key].name = value.rate.name;
        data.data[key].typePayer = value.rate.typePayer;
        data.data[key].id = value.rate.id;
        data.data[key].username = auth.userName;
        delete value.rate;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered1.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          "rate": vm.name
        };
        vm.datareport = vm.filtered1;
        vm.pathreport = '/report/configuration/billing/customerate/customerate.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método de la ventana modal de los requeridos*//
  function customeraterequeridController($scope, hiderate, hidecustomer, close) {
    $scope.hiderate = hiderate;
    $scope.hidecustomer = hidecustomer;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método de la ventana modal para que seleccione por lo menos un elemento*//
  function SeleccionController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
