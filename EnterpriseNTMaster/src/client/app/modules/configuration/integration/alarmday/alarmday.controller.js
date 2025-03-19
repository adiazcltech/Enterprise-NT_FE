(function () {
  'use strict';

  angular
    .module('app.alarmday')
    .controller('AlarmdayController', AlarmdayController)
    .controller('alamadaysrequidController', alamadaysrequidController);
  AlarmdayController.$inject = ['alarmdayDS', 'demographicDS', 'demographicsItemDS', 'areaDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function AlarmdayController(alarmdayDS, demographicDS, demographicsItemDS, areaDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Alarmday';
    vm.name = ['demographicItem.name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.code = ['code', 'name', 'deltacheckDays'];
    vm.nametest = ['name', 'code', 'deltacheckDays'];
    vm.selectedtest = ['deltacheckDays', 'code', 'name'];
    vm.sortReverseTest = false;
    vm.sortTypeTest = vm.code;
    vm.selected = -1;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getDemographicsItemsAll = getDemographicsItemsAll;
    vm.getTest = getTest;
    vm.save = save;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.getArea = getArea;
    vm.removearea = removearea;
    vm.getdemograficchange = getdemograficchange;
    vm.removeDatademografic = removeDatademografic;
    vm.itemdemografic = itemdemografic;
    vm.getdemografic = getdemografic;
    vm.demograficoitem = 0;
    vm.saveenable = false;
    vm.cancel = cancel;
    var auth;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    // funcion para sacar la ventana modal de requeridos
    function modalrequired() {
      if ((vm.lisdemografic.length === 0) || vm.listest.length === 0) {
        ModalService.showModal({
          templateUrl: "alamdays.html",
          controller: "alamadaysrequidController",
          inputs: {
            hidedemographics: vm.lisdemografic.length,
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
    //** Metodo para obtener todos los demograficos**//
    function getdemograficchange() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
        vm.lisdemografic = data.data.length === 0 ? data.data : removeDatademografic(data);
        vm.getdemografic();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener la pruebas activas**//
    function getdemografic() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return alarmdayDS.getId(auth.authToken, 0, 0).then(function (data) {
        vm.listest = data.data.length === 0 ? data.data : vm.removeData(data);
        vm.itemdemografic();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener los item demograficos**//
    function itemdemografic() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.getState(auth.authToken).then(function (data) {
        vm.demograficitem = data.data;
        vm.loadingdata = false;
        vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla de pruebas**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.abbr;
        delete value.conversionFactor;
        delete value.decimal;
        delete value.deltacheckMax;
        delete value.deltacheckMin;
        delete value.lastTransaction;
        delete value.printOrder;
        delete value.processingBy;
        delete value.processingDays;
        delete value.resultType;
        delete value.sample;
        delete value.unit;
        delete value.selected;
        delete value.state;
        delete value.testType;
        delete value.user;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.getdemograficchange();
        if (data.status === 200) {
          data.data[0] = {
            "id": 0,
            "name": $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
          vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
          vm.lisArea.id = 0;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de las areas**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }
      });
      return area;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getArea();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.listest = [];
      vm.selected1 = -1;
      vm.saveenable = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return alarmdayDS.getId(auth.authToken, vm.demografic.id, vm.demograficoitem).then(function (data) {
        if (data.status === 200) {
          vm.listest = data.data.length === 0 ? data.data : vm.removeData(data);
          vm.sortReverseTest = false;
          vm.sortTypeTest = vm.selectedtest;
        }
      }, function (error) {
        vm.modalError(error);
      });

    }
    //metodo que se consultra los itme demograficos a cambiarlo en el combo
    function getDemographicsItemsAll() {
      vm.listest = [];
      vm.dataItemDemographics = [];
      vm.selected = -1;
      vm.selected1 = -1;
      vm.saveenable = false;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.demografic.id === 0) {
        vm.demograficoitem = 0;
        return alarmdayDS.getId(auth.authToken, 0, 0).then(function (data) {
          vm.listest = data.data.length === 0 ? data.data : vm.removeData(data);
          vm.sortReverseTest = false;
          vm.sortTypeTest = vm.selectedtest;
        }, function (error) {
          vm.modalError(error);
        });
      } else {
        return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.demografic.id).then(function (data) {
          vm.dataItemDemographics = data.data;
        }, function (error) {
          vm.modalError();
        });
      }
    }
    //** Metodo que construlle el arreglo para el combo demograficos**//
    function removeDatademografic(data) {
      vm.demografic = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.demografic[0] = {
        "id": 0,
        "name": $filter('translate')('0209')
      }
      data.data.forEach(function (value, key) {
        switch (value.id) {
          case -1:
            value.name = $filter('translate')('0248');
            break;
          case -2:
            value.name = $filter('translate')('0225');
            break;
          case -3:
            value.name = $filter('translate')('0307');
            break;
          case -4:
            value.name = $filter('translate')('0133');
            break;
          case -5:
            value.name = $filter('translate')('0075');
            break;
          case -6:
            value.name = $filter('translate')('0175');
            break;
          case -7:
            value.name = $filter('translate')('0174');
            break;
          default:
            value.name = value.name;
        }
        if (value.encoded === true) {
          var object = {
            id: value.id,
            name: value.name
          }
          vm.demografic.push(object);
        }
        data.data[key].username = auth.userName;
      });
      vm.demografic = $filter('orderBy')(vm.demografic, 'name');
      vm.demografic.id = 0;
      vm.demografic.name = $filter('translate')('0209');
      return vm.demografic;
    }
    //metodo que consulta las pruebas asociadas al item demografico
    function getTest(demographicItem, index) {
      vm.saveenable = false;
      vm.selected = index;
      vm.demograficoitem = demographicItem.demographicItem.id;
      vm.sortTypeTest = '';
      vm.demograficoitemname = demographicItem.demographicItem.name;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return alarmdayDS.getId(auth.authToken, vm.demografic.id, vm.demograficoitem).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.listest = data.data.length === 0 ? data.data : vm.removeData(data);
          vm.sortReverseTest = false;
          vm.sortTypeTest = vm.selectedtest;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que  guarda los dias de alama asociados all demografico y a la prueba**//
    function save() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listest = [];
      vm.listest.forEach(function (value, key) {
        var Test = {
          "id": value.id,
          "name": value.name,
          "deltacheckDays": value.deltacheckDays
        }
        listest.push(Test);
      });
      var associationmediocultive = {
        'user': {
          'id': auth.id
        },
        'demographic': {
          'id': vm.demografic.id,
          'demographicItem': vm.demograficoitem,
          'name': vm.demograficoitemname
        },
        'test': listest
      };

      return alarmdayDS.update(auth.authToken, associationmediocultive).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.loadingdata = false;
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Método para preparar el JSON para imprimir el reporte**//
    function generateFile() {
      if (vm.listest.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          "demografico": vm.demografic.name,
          "item": vm.demografic.name === $filter('translate')('0209') ? '' : vm.demograficoitemname
        };
        vm.datareport = vm.listest;
        vm.pathreport = '/report/configuration/integration/alarmday/alarmday.mrt';
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
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function alamadaysrequidController($scope, hidedemographics, hidetest, close) {
    $scope.hidedemographics = hidedemographics;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
