(function () {
  'use strict';
  angular
    .module('app.automatictest')
    .controller('AutomaticTestController', AutomaticTestController)
    .controller('RequeridtestController', RequeridtestController)
    .controller('deleteautomaticController', deleteautomaticController)
    .controller('newController', newController);

  AutomaticTestController.$inject = ['areaDS', 'testDS', 'automatictestsDS', 'configurationDS', 'listDS',
    'localStorageService', 'logger', '$filter', '$state',
    'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function AutomaticTestController(areaDS, testDS, automatictestsDS, configurationDS, listDS,
    localStorageService, logger, $filter, $state,
    moment, $rootScope, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'AutomaticTest';
    vm.code = ['code', 'abbr', 'name'];
    vm.abbr = ['abbr', 'code', 'name'];
    vm.nametest = ['name', 'code', 'abbr'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getArea = getArea;
    vm.changearea = changearea;
    vm.getTestchange = getTestchange;
    vm.New = New;
    vm.destroy = destroy;
    vm.getListType = getListType;
    vm.removeDataid = removeDataid;
    vm.deleteaccordion = [];
    vm.listTest = [];
    vm.cancelarautomatic = [];
    vm.errorsing = false;
    vm.errortest = false;
    vm.requeridresul1 = false;
    vm.requeridresul2 = false;
    vm.errorresul2 = false;
    vm.openaccordionff = openaccordionff;
    vm.updateacoordion = updateacoordion;
    vm.isDisabledSave = true;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getListType();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene la lista de signos
    function getListType() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 49).then(function (data) {
        vm.getArea();
        var typesign = [];
        if (($filter('translate')('0000')) === 'esCo') {
          data.data.forEach(function (value, key) {
            if (value.id !== 57) {
              var object = {
                id: value.id,
                name: value.esCo
              };
              typesign.push(object);
            }
          });
        } else {
          data.data.forEach(function (value, key) {
            if (value.id !== 57) {
              var object = {
                id: value.id,
                name: value.enUsa
              };
              typesign.push(object);
            }
          });
        }
        vm.sign = typesign;
        vm.signtext = [{
          "id": 50,
          "name": "="
        }, {
          "id": 55,
          "name": "<>"
        }]


      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.getTestchange();
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
    //** Metodo que elimina los elementos sobrantes en la grilla**//
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
    //** Metodo para obtener las pruebaas númericas activas **//
    function getTestchange() {
      vm.lisArea = vm.lisArea === undefined ? {
        'id': 0
      } : vm.lisArea;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, vm.lisArea.id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          if (vm.lisArea.id === 0) {
            vm.listest2 = data.data;
            vm.listest = data.data.length === 0 ? data.data : removeData(data);
          } else {
            vm.listest = data.data.length === 0 ? data.data : removeData(data);
          }
          vm.isDisabledPrint = true;
        } else {
          ModalService.showModal({
            templateUrl: 'Requeridodeltacheck.html',
            controller: 'RequeridtestController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'test') {
                $state.go(result);
              }
            });
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].search = data.data[key].code + data.data[key].abbr + data.data[key].name;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(automatic, index) {
      vm.loadingdata = true;
      vm.name = automatic.name;
      vm.errorsing = false;
      vm.errortest = false;
      vm.requeridresul1 = false;
      vm.requeridresul2 = false;
      vm.errorresul2 = false;
      vm.cancelarautomatic = automatic;
      vm.deleteaccordion = [];
      vm.selected = automatic.id;
      vm.decimal = automatic.decimal;
      if (vm.decimal > 0) {
        vm.stepdecimal = '0.'
        for (var i = 0; i < vm.decimal - 1; i++) {
          vm.stepdecimal = vm.stepdecimal + '0';
        }
        vm.stepdecimal = vm.stepdecimal + '1';
      } else {
        vm.stepdecimal = '0'
      }
      vm.stepdecimal = Number(vm.stepdecimal);
      vm.testtype = automatic.resultType;
      vm.listTest = [];
      vm.test1 = automatic.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return automatictestsDS.getautomatictestId(auth.authToken, vm.test1).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + automatic.username;
          vm.listTest = data.data.length === 0 ? data.data : removeDataid(data);
          vm.updateaccordion = vm.listTest.length - 1;
          vm.openaccordionff();
          return vm.listTest;
        }
        vm.isDisabledAdd = true;
        vm.isDisabledSave = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataid(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        if (($filter('translate')('0000')) === 'esCo') {
          data.data[key].sign.name = value.sign.esCo;
        } else {
          data.data[key].sign.name = value.sign.enUsa;
        }
        data.data[key].signreport = data.data[key].sign.name;
        data.data[key].Testreport = data.data[key].automaticTest.name;
        data.data[key].hideacordion = false;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //* Metodo configuración formato**//
    function changearea() {
      vm.listest = [];
      vm.selected = -1;
      vm.Detail = [];
      vm.listTest = [];
      vm.isDisabledCancel = true;
      vm.getTestchange();

    }
    //* Metodo para eliminar un acordion**//
    function destroy(uno) {
      ModalService.showModal({
        templateUrl: 'delete.html',
        controller: 'deleteautomaticController',
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result === 'Yes') {
            vm.listTest.splice(uno, 1);
            vm.update();
          }
        });
      });
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New() {
      var objectresult = {
        'id': vm.test1,
        'result1': null,
        'result2': null,
        'hideacontrols': 'false',
        'sign': {
          'id': null,
        },
        'automaticTest': {
          'id': null,
        }
      };
      ModalService.showModal({
        templateUrl: 'new.html',
        controller: 'newController',
        inputs: {
          listsign: vm.sign,
          listresult: objectresult,
          test1: vm.test1,
          testtype: vm.testtype,
          listest2: vm.listest2,
          stepdecimal: vm.stepdecimal,
          decimal: vm.decimal
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          var record = angular.copy(result.listresult);
          vm.listTest.push(record);
          vm.update(vm.listTest.length - 1);
          vm.isDisabledCancel = false;

        });
      });
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
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledCancel = true;
      }
      if (state === 'add') {
        vm.isDisabledCancel = false;
      }
      if (state === 'update') {
        vm.isDisabledCancel = true;
      }
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.errorsing = false;
      vm.errortest = false;
      vm.requeridresul1 = false;
      vm.requeridresul2 = false;
      vm.errorresul2 = false;
      vm.getId(vm.cancelarautomatic, vm.selected);
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function updateacoordion(id) {
      if (vm.testtype === 1 && vm.listTest[vm.updateaccordion].result1 == '' || vm.testtype === 2 && vm.listTest[vm.updateaccordion].result1 == undefined || vm.listTest[vm.updateaccordion].sign.id === 56 && vm.listTest[vm.updateaccordion].result2 == '' || vm.listTest[vm.updateaccordion].sign.id === 56 && vm.listTest[vm.updateaccordion].result1 >= vm.listTest[vm.updateaccordion].result2) {
        vm.isDisabledSave = true;
        vm.openaccordionff();
      } else {
        if (id !== vm.updateaccordion) {
          var comparate = _.filter(vm.listTest, function (o) {
            return o.automaticTest.id === vm.listTest[vm.updateaccordion].automaticTest.id && o.sign.id === vm.listTest[vm.updateaccordion].sign.id && o.result1 === vm.listTest[vm.updateaccordion].result1 && o.result2 === vm.listTest[vm.updateaccordion].result2
          })
          if (comparate.length === 1) {
            vm.updateaccordion = id;
            vm.openaccordionff();
          } else {
            logger.success("Ya existe la relación");
            vm.listTest.splice(vm.updateaccordion, 1);
            vm.update();
          }
        }
      }
    }
    //** Método que válida cuando se abren y se cierra el acordion**//
    function openaccordionff() {
      vm.status = {};
      vm.status['isOpen'] = {};
      for (var i = 0; i <= vm.listTest.length; i++) {
        var num = i.toString();
        if (i === vm.updateaccordion) {
          vm.status['isOpen'][num] = true;
        } else {
          vm.status['isOpen'][num] = false;
        }
      }
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.listTest.forEach(function (value, key) {
        delete value.automaticTest.selected
      });
      return automatictestsDS.Newautomatictest(auth.authToken, vm.listTest, vm.test1).then(function (data) {
        if (data.status === 200) {
          vm.getTestchange();
          vm.getId(vm.cancelarautomatic, vm.selected);
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }

      }, function (error) {
        vm.modalError(error);

      });

    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.report = vm.listTest;
        vm.report.forEach(function (value, key) {
          delete value.automaticTest.selected
        });
        vm.variables = {
          "test": vm.name
        };
        vm.datareport = vm.report;
        vm.pathreport = '/report/configuration/test/automatictest/automatictest.mrt';
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
  //** Controller de la vetana modal de requerido*//
  function RequeridtestController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la vetana modal para eliminar una nueva prueba automatica*//
  function deleteautomaticController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la vetana modal para crear una nueva prueba automatica*//
  function newController($scope, close, listsign, listresult, test1, listest2, testtype, stepdecimal, decimal) {
    $scope.listresult = listresult;
    $scope.test1 = test1;
    $scope.listest2 = listest2;
    $scope.disablecontrols = disablecontrols;
    $scope.stepdecimal = stepdecimal;
    $scope.decimal = decimal;
    $scope.testtype = testtype;
    $scope.listsign = testtype === 1 ? listsign : [{
      'id': 50,
      'name': '='
    }, {
      'id': 55,
      'name': '<>'
    }];



    function disablecontrols(validate) {
      if (testtype === 2) {
        if ($scope.listresult.sign.id === null || $scope.listresult.automaticTest.id === null || validate) {
          return true;
        } else {
          return false;
        }
      } else {

        if ($scope.listresult.sign.id === 56) {
          if ($scope.listresult.sign.id === null || $scope.listresult.automaticTest.id === null || $scope.listresult.result1 === null || $scope.listresult.result1 === '' || $scope.listresult.result2 === null || $scope.listresult.result2 === '' || $scope.listresult.result1 >= $scope.listresult.result2) {
            return true;
          } else {
            return false;
          }

        } else {
          if ($scope.listresult.sign.id === null || $scope.listresult.automaticTest.id === null || $scope.listresult.result1 === '' || $scope.listresult.result1 === null) {
            return true;
          } else {
            return false;
          }
        }

      }
    }



    $scope.close = function () {
      close({
        listresult: $scope.listresult
      }, 500);
    };
  }
})();
