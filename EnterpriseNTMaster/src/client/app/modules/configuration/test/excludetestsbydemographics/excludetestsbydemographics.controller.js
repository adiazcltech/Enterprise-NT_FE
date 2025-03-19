(function () {
  'use strict';

  angular
    .module('app.excludetestsbydemographics')
    .controller('excludetestsbydemographicsController', excludetestsbydemographicsController)
    .controller('excludetestsbydemographicsdependenceController', excludetestsbydemographicsdependenceController);


  excludetestsbydemographicsController.$inject = ['excludedemographicsDS', 'demographicDS', 'demographicsItemDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function excludetestsbydemographicsController(excludedemographicsDS, demographicDS, demographicsItemDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'excludetestsbydemographics';
    vm.name = ['demographicItem.name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.codeTest = ['test.code', 'test.name', 'test.selected'];
    vm.nameTest = ['test.name', 'test.code', 'test.selected'];
    vm.selectedTest = ['-test.selected', '+test.code', '+test.name', ];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codeTest;
    vm.selected = -1;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getDemographicsALL = getDemographicsALL;
    vm.getDemograficoExcluirPrueba = getDemograficoExcluirPrueba;
    vm.getDemographicsItemsAll = getDemographicsItemsAll;
    vm.getTest = getTest;
    vm.save = save;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.modalRequired = false;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.cancel = cancel;
    vm.windowOpenReport = windowOpenReport;
    vm.listest = [];
    var auth;

    /** Acción que sirve para eliminar una columna de una tabla a partir de un objeto area*/
    function removeData(data) {
      var listdata = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.state;
        data.data[key].username = auth.userName;
        listdata.push(data.data[key]);
      });
      return listdata;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getDemograficoExcluirPrueba();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener Todos los demográficos**//
    function getDemographicsALL() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
        vm.demograficoexcluirpruebaid = vm.configurationdemograficoexcluirprueba;
        data.data.forEach(function (value, key) {
          if (vm.configurationdemograficoexcluirprueba == value.id) {

            switch (value.id) {
              case -1:
                vm.demograficoexcluirpruebaname = $filter('translate')('0248');
                break;
              case -2:
                vm.demograficoexcluirpruebaname = $filter('translate')('0225');
                break;
              case -3:
                vm.demograficoexcluirpruebaname = $filter('translate')('0307');
                break;
              case -4:
                vm.demograficoexcluirpruebaname = $filter('translate')('0133');
                break;
              case -5:
                vm.demograficoexcluirpruebaname = $filter('translate')('0075');
                break;
              case -6:
                vm.demograficoexcluirpruebaname = $filter('translate')('0175');
                break;
              case -7:
                vm.demograficoexcluirpruebaname = $filter('translate')('0174');
                break;
              default:
                vm.demograficoexcluirpruebaname = value.name;
            }

          }
        });
        vm.getDemographicsItemsAll();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo configuración formato**//
    function getDemograficoExcluirPrueba() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'DemograficoExcluirPrueba').then(function (data) {
        if (data.data.value === "0" || data.data.value === undefined || data.data.value === "") {
          vm.configurationdemograficoexcluirprueba = -8;
          vm.getDemographicsALL();
        } else {
          vm.configurationdemograficoexcluirprueba = parseInt(data.data.value);
          vm.getDemographicsALL();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para cancelar los exámenes seleccionados **//
    function cancel() {
      vm.getTest(vm.demograficoitem, vm.demograficoitemname, vm.selected);
    }
    //** Metodo para consultar los items del demografico configurado**//
    function getDemographicsItemsAll() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.demograficoexcluirpruebaid).then(function (data) {
        vm.dataItemDemographics = data.data;
        vm.getTest(-1);
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para consultar los examenes del item seleccionado**//
    function getTest(id, name, index, Form) {
      vm.selected = id;
      vm.demograficoitem = id;
      vm.sortTypeTest = '';
      vm.demograficoitemname = name;
      vm.configurationdemograficoexcluirprueba = vm.configurationdemograficoexcluirprueba === undefined ? -8 : vm.configurationdemograficoexcluirprueba;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return excludedemographicsDS.getTestExcludeDemographics(auth.authToken, vm.demograficoexcluirpruebaid, id).then(function (data) {
        if (data.status === 200) {
          vm.listest = data.data.length === 0 ? data.data : vm.removeData(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedTest;
          vm.modalrequired();
        } else {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que actualiza los examenes del item seleccionado**//
    function save() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listest = [];
      vm.listest.forEach(function (value, key) {
        if (value.test.selected === true) {
          var Test = {
            "lastTransaction": null,
            "user": {
              "id": auth.id
            },
            "id": value.id,
            "demographicItem": value.demographicItem,
            "name": vm.demograficoitemname,
            "test": {
              "id": value.test.id,
              "code": value.test.code,
              "name": value.test.name,
              "selected": true,
            }
          }
          listest.push(Test);
        }
      });


      if (listest.length > 0) {
        return excludedemographicsDS.updateExcludeDemographics(auth.authToken, listest).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0042'));
            return data;
          }
        }, function (error) {
          vm.modalError(error);
        });
      } else {
        return excludedemographicsDS.deleteExcludeDemographics(auth.authToken, vm.demograficoexcluirpruebaid, vm.demograficoitem).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0042'));
            return data;
          }
        }, function (error) {
          vm.modalError(error);
        });
      }
    }
    /**funcion para generar informe en PDF O EXEL de areas*/
    function generateFile() {
      vm.listest.forEach(function (value, key) {
        if (value.test.selected === true) {
          var Test = {
            "username": auth.userName,
            "itemdemographic": vm.demograficoitemname,
            "demographic": vm.demograficoexcluirpruebaname,
            "test": value.test.code + ' ' + value.test.name,
            "selected": value.test.selected
          }
          datareport.push(Test);
        }
      });
      if (vm.filtered.length === 0 || vm.listest.length) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.pathreport = '/Report/configuration/test/excludetestbydemographics/excludetestbydemographics.mrt';
        vm.openreport = false;
        vm.report = false;
        var datareport = [];
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.datareport = datareport;
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
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para válidar los requridos de la página**//
    function modalrequired() {
      if ((vm.dataItemDemographics.length === 0) || vm.configurationdemograficoexcluirprueba === -8 || vm.listest.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "excludetestsbydemographicsdependenceController",
          inputs: {
            hideitemdemographics: vm.dataItemDemographics.length,
            configurationdemograficoexcluirprueba: vm.configurationdemograficoexcluirprueba,
            hidetest: vm.listest.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    /**funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function excludetestsbydemographicsdependenceController($scope, hideitemdemographics, configurationdemograficoexcluirprueba, hidetest, close) {
    $scope.configurationdemograficoexcluirprueba = parseInt(configurationdemograficoexcluirprueba);
    $scope.hideitemdemographics = hideitemdemographics;
    $scope.hidetest = hidetest;

    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
