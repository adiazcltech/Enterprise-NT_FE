(function () {
  'use strict';
  angular
    .module('app.standarization')
    .controller('DependenceController', DependenceController)
    .controller('StandarizationController', StandarizationController);
  StandarizationController.$inject = ['centralsystemDS', 'standarizationDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function StandarizationController(centralsystemDS, standarizationDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Standarization';
    vm.sortReverse = false;
    vm.sortType = 'name';
    vm.sortReverseTest = false;
    vm.sortTypeTest = 'code';
    vm.selected = -1;
    vm.isDisabled = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCentralSystem = getCentralSystem;
    vm.getStandarizationId = getStandarizationId;
    vm.validAddTag = validAddTag;
    vm.save = save;
    vm.changeSearch = changeSearch;
    vm.changeData = changeData;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.dataTestCodes = [];
    vm.updateStandarization = [];
    vm.modalRequired = false;
    vm.generateFile = generateFile;
    var auth;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo para eliminar una columna de una tabla a partir de un objeto area**//
    function removeData(data) {
      var dataCentralSystem = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        // delete value.user;
        delete value.lastTransaction;
        delete value.state;
        data.data[key].username = data.data[key].user.userName === undefined ? auth.userName : data.data[key].user.userName;
        dataCentralSystem.push(data.data[key]);
      });
      return dataCentralSystem;
    }
    //** Metodo para validar cuando cambia la busqueda**//
    function changeSearch() {
      vm.idCentralSystem = null;
      vm.selected = -1;
      vm.dataTestCodes = [];
      vm.stateButton('init');
      vm.isChangeData = false;
    }
    //** Metodo para validar el cambio en la lista**//
    function changeData() {
      vm.isChangeData = false;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getCentralSystem();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //**Método que devuelve la lista de sistemas centrales activos**//
    function getCentralSystem() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.dataCentralSystem = data.data.length === 0 ? data.data : removeData(data);
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'DependenceController',
          }).then(function (modal) {
            modal.element.modal();
            vm.modalRequired = true;
            modal.close.then(function (result) {
              if (result === 'centralsystem') {
                $state.go('centralsystem');
              }
            });
          });
        }
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene un sistema central por id*//
    function getStandarizationId(id, index, StandarizationForm, This) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.dataTestCodes = [];
      vm.centralSystemSelected = [];
      vm.isChangeData = false;
      vm.idCentralSystem = vm.dataCentralSystem === undefined ? 0 : id;
      StandarizationForm.$setUntouched();
      vm.loadingdata = true;
      return standarizationDS.getStandarizationId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + _.filter(vm.dataCentralSystem, function (idUser) {
            return idUser.id === id
          })[0].username; // data.data[0].user.userName;
          vm.stateButton('update');
          vm.repeatCodes = This.CentralSystem.repeatCode;
          vm.dataTestCodes = data.data;
          vm.centralSystemSelected = This.CentralSystem;
          vm.dataTestCodes = $filter('orderBy')(vm.dataTestCodes, '-codes');
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError();
        vm.loadingdata = false;
      });
    }
    //** Método validar la adición de tag*//
    function validAddTag(tag, id, codes) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return standarizationDS.getStandarizationExists(auth.authToken, vm.idCentralSystem, id, tag.text).then(function (data) {
        if (data.data && !vm.repeatCodes) {
          ModalService.showModal({
            templateUrl: 'Informat.html',
            controller: 'DependenceController',
          }).then(function (modal) {
            modal.element.modal();
            vm.modalRequired = true;
            modal.close.then(function (result) {
              $state.go('standarization');
            });
          })
          var can = codes.length;
          codes.splice(can - 1, 1);
          vm.invalid = true;
          vm.isChangeData = false;
          vm.loadingdata = false;

        } else {
          vm.stateButton('update');
          vm.invalid = false;
          vm.isChangeData = true;
        }
      }, function (error) {
        vm.modalError();
        vm.loadingdata = false;
      });
    }
    //** Método que actualiza los códigos de homologación de cada examen o prueba**//
    function save(id, name, codes) {
      if (vm.isChangeData) {
        vm.loadingdata = true;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.updateStandarization = {};
        var arrayCodes = [];
        codes.forEach(function (value) {
          arrayCodes.push(value.text);
        });
        vm.updateStandarization = {
          'centralSystem': {
            'id': vm.idCentralSystem,
            'name': vm.centralSystemSelected.name
          },
          'id': id,
          'name': name,
          'codes': arrayCodes,
          'user': {
            'id': auth.id
          }
        };
        return standarizationDS.updateStandarization(auth.authToken, vm.updateStandarization).then(function (data) {
          if (data.status === 200 && !vm.invalid && vm.isChangeData) {
            vm.stateButton('update');
            logger.success($filter('translate')('0042'));
            vm.isChangeData = false;
            vm.loadingdata = false;
            return data;
          }
        }, function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        });
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.loadingdata = true;
      var dataStandarization = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var name = vm.centralSystemSelected.name;
      var id = vm.centralSystemSelected.id;
      var repeatCode = vm.centralSystemSelected.repeatCode;
      var ehr = vm.centralSystemSelected.ehr;
      return standarizationDS.getStandarizationId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            var codes = '';
            value.codes.forEach(function (val) {
              codes = codes + ', ' + val;
            });
            if (codes !== '') {
              codes = codes.replace(', ', '');
              dataStandarization.push({
                'id': id,
                'name': name,
                'repeatCode': repeatCode,
                'ehr': ehr,
                'code': value.code,
                'abbr': value.abbr,
                'test': value.name,
                'codes': codes,
                'username': auth.userName
              });
            }

          });
          vm.loadingdata = false;
          if (dataStandarization.length === 0) {
            vm.open = true;
          } else {
            vm.variables = {};
            vm.datareport = dataStandarization;
            vm.pathreport = '/Report/configuration/integration/standarization/standarization.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport();
          }
        }
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
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
    //** Metodo que válida el estado de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledPrint = true;
        vm.isDisabledCancel = true;
      }
      if (state === 'update') {
        vm.isDisabledPrint = false;
        vm.isDisabledCancel = false;
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    /**funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  /**funcion inicializar la ventana modal*/
  function DependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
