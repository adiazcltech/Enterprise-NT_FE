(function () {
  'use strict';

  angular
    .module('app.meansofcultivationfortest')
    .controller('MeansfortestController', MeansfortestController)
    .controller('meansofcultivationfortestController', meansofcultivationfortestController)
    .controller('ValidateTestController', ValidateTestController);

  MeansfortestController.$inject = ['mediaCulturesDS', 'testDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope',
    'ModalService', 'LZString', '$translate'
  ];

  function MeansfortestController(mediaCulturesDS, testDS, configurationDS,
    localStorageService, logger, $filter, $state, moment, $rootScope,
    ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Meansofcultivationfortest';
    vm.code = ['code', 'name', 'namesample'];
    vm.nametest = ['name', 'code', 'namesample'];
    vm.namesample = ['namesample', 'name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.mediocultivecode = ['code', 'name', 'select', 'defectValue'];
    vm.mediocultivename = ['name', 'code', 'select', 'defectValue'];
    vm.mediocultiveselect = ['-select', '-defectValue', '+code', '+name'];
    vm.mediocultivedefectValue = ['-defectValue', '-select', '+code', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.mediocultivecode;
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
    vm.getmedio = getmedio;
    vm.Listmediaculture = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.idaccount = 0;
    vm.updateacountrate = updateacountrate;
    vm.sampleselect = '';
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;

    //** Método que obtiene la lista de medios de cultivos**//
    function getmedio() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return mediaCulturesDS.getmediaCulturesActive(auth.authToken).then(function (data) {
        vm.Listmediaculture = data.data;
        vm.get();
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.abbr;
        delete value.area;
        delete value.conversionFactor;
        delete value.decimal;
        delete value.deltacheckDays;
        delete value.deltacheckMax;
        delete value.deltacheckMin;
        delete value.lastTransaction;
        delete value.printOrder;
        delete value.processingBy;
        delete value.processingDays;
        delete value.resultType;
        data.data[key].namesample = value.sample.name;
        delete value.sample;
        delete value.unit;
        delete value.selected;
        delete value.state;
        delete value.testType;
        delete value.lastTransaction;
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
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var literalresul = vm.updateacountrate();
      return mediaCulturesDS.updatetestofmediacultures(auth.authToken, literalresul).then(function (data) {
        if (data.status === 200) {
          vm.sortReverse1 = false;
          vm.sortType1 = vm.mediocultiveselect;
          vm.get();
          logger.success($filter('translate')('0042'));
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          var label = $filter('translate')('0860');
          vm.labelmodal = label.replace("@@@", vm.sampleselect);
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'media culture already test') {
              vm.Detail.forEach(function (value, key) {
                value.select = false;
                value.defectValue = false;
              });
              ModalService.showModal({
                templateUrl: 'validationItems.html',
                controller: 'ValidateTestController',
                inputs: {
                  labelmodal: vm.labelmodal
                }
              }).then(function (modal) {
                modal.element.modal();
              });
            }
          });
        } else {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      } else {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    // metodo para ordenar el json
    function updateacountrate() {
      var mediocultive = [];
      vm.Detail.forEach(function (value, key) {
        if (value.select === true) {
          var object = {
            'user': {
              'id': auth.id
            },
            'id': value.id,
            'name': value.name,
            'select': value.select,
            'defectValue': value.defectValue

          };
          mediocultive.push(object);
        }
      });
      var associationmediocultive = {
        'testId': vm.idtest,
        'testName': vm.name,
        'mediaCultures': mediocultive
      };
      return associationmediocultive;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestmicrobiology(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.modalrequired();
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.Listmediaculture.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'meansofcultivationfortestController',
          inputs: {
            hidemediocultive: vm.Listmediaculture.length,
            hidetest: vm.data.length
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
    function getId(test, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = test.id;
      vm.Detail = [];
      vm.idtest = test.id;
      vm.name = test.name;
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.loadingdata = true;
      vm.username = test.user.userName;
      vm.sampleselect = test.namesample;
      return mediaCulturesDS.getmediaculturestestId(auth.authToken, test.id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.mediaCultures === 0 ? data.data.mediaCultures : removeDataresult(data.data.mediaCultures);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.mediocultiveselect;
          vm.loadingdata = false;
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      return mediaCulturesDS.getmediaculturestestId(auth.authToken, vm.idtest).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.mediaCultures === 0 ? data.data.mediaCultures : removeDataresult(data.data.mediaCultures);
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.forEach(function (value, key) {
        delete value.lastTransaction;
        delete value.user;
        data[key].username = auth.userName;
        data[key].testname = vm.name;
      });
      return data;
    }
    //** Metodo para preparar el JSON para enviarlo al reporteador**//
    function generateFile() {
      if (vm.filtered1.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered1;
        vm.pathreport = '/report/configuration/microbiology/meansofcultivationfortest/meansofcultivationfortest.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver el reporte en otra pestaña del navegador.
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
      vm.getmedio();
    }
    vm.isAuthenticate();
  }
  //** Método de la ventana modal para validar los requeridos*//
  function meansofcultivationfortestController($scope, hidemediocultive, hidetest, close) {
    $scope.hidemediocultive = hidemediocultive;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método de la ventana modal para validar los requeridos*//
  function ValidateTestController($scope, labelmodal, close) {
    $scope.labelmodal = labelmodal;
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
