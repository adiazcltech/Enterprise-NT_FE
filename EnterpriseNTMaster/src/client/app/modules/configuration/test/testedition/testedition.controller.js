(function () {
  'use strict';

  angular
    .module('app.testedition')
    .controller('TestEditionController', TestEditionController)
    .controller('DependenceController', DependenceController)
    .controller('ConfirmController', ConfirmController);


  TestEditionController.$inject = ['testDS', 'areaDS', 'configurationDS', 'localStorageService', 'logger',
    'sampleDS', 'unitDS', 'ModalService', '$filter', '$state', 'moment', '$rootScope'
  ];

  function TestEditionController(testDS, areaDS, configurationDS, localStorageService, logger,
    sampleDS, unitDS, ModalService, $filter, $state, moment, $rootScope) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'TestEdition';
    vm.selected = -1;
    vm.isDisabled = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getAreaActive = getAreaActive;
    vm.getTestArea = getTestArea;
    vm.getTestEdition = getTestEdition;
    vm.getListSamples = getListSamples;
    vm.getListUnits = getListUnits;
    vm.changeSearch = changeSearch;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.dataTestEdit = [];
    vm.updateTestEdition = [];
    vm.codeRepeat = false;
    vm.nameRepeat = false;
    vm.abbrRepeat = false;
    vm.regAbbr = /^[0-9a-zA-Z]+$/;
    var auth;
    vm.saveinput = saveinput;
    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto area*/
    function removeData(data) {
      var dataArea = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.abbreviation;
        delete value.color;
        delete value.partialValidation;
        delete value.lastTransaction;
        delete value.state;
        delete value.type;

        if (value.id === 1) {
          delete data.data[key];
        } else {
          data.data[key].username = auth.userName;
          dataArea.push(data.data[key]);
        }
      });
      return dataArea;
    }
    //** Metodo para guardar los cambios**//
    function saveinput(TestEdit, TestEditionForm) {
      vm.loadingdata = true;
      if (TestEditionForm.$valid) {
        if (TestEdit.abbr.toUpperCase() !== 'GENDER' && TestEdit.abbr.toUpperCase() !== 'RACE' && TestEdit.abbr.toUpperCase() !== 'WEIGHT' &&
          TestEdit.abbr.toUpperCase() !== 'SIZE') {
          ModalService.showModal({
            templateUrl: 'Confirmation.html',
            controller: 'ConfirmController'
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.execute === 'yes') {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return testDS.updateTestEdition(auth.authToken, TestEdit).then(function (data) {
                  vm.loadingdata = false;
                  if (data.status === 200) {
                    logger.success($filter('translate')('0042'));
                    vm.getTestArea(vm.selected, TestEditionForm);
                  }
                }, function (error) {
                  vm.loadingdata = false;
                  if (error.data !== null) {
                    if (error.data.code === 2) {
                      error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        if (item[0] === '1' && item[1] === 'code') {
                          TestEdit.errorcode = true;
                        }
                        if (item[0] === '1' && item[1] === 'abbreviation') {
                          TestEdit.errorabbreviation = true;
                        }
                        if (item[0] === '1' && item[1] === 'name') {
                          TestEdit.errorname = true;
                        }
                      });
                    }
                  }
                  if (!vm.codeRepeat && !vm.abbrRepeat && !vm.nameRepeat) {
                    vm.Error = error;
                  }
                });
              } else {
                vm.getTestArea(vm.selected, TestEditionForm);
              }
            });
          });
        } else {
          logger.warning($filter('translate')('1209'));
          vm.getTestArea(vm.selected, TestEditionForm);
        }
      } else {
        vm.loadingdata = false;
      }
    }

    vm.validatedinput = validatedinput;
    function validatedinput(data, item, TestEditionForm) {
      if (item === 'code') {
        if (data.code !== data.codebefore) {
          vm.saveinput(data, TestEditionForm)
        }
      } else if (item === 'abbr') {
        if (data.abbr !== data.abbrbefore) {
          vm.saveinput(data, TestEditionForm)
        }
      } else if (item === 'name') {
        if (data.name !== data.namebefore) {
          vm.saveinput(data, TestEditionForm)
        }
      }
    }
    //** Metodo para adicionar campos para validar datos repetidos**//
    function adddatatest(data) {
      data.data.forEach(function (value) {
        value.codebefore = value.code;
        value.abbrbefore = value.abbr;
        value.namebefore = value.name;
        value.errorcode = false;
        value.errorabbreviation = false;
        value.errorname = false;
      });
      return data.data;
    }
    //** Metodo cuando cambia el control de busqueda**//
    function changeSearch() {
      vm.idArea = null;
      vm.selected = -1;
      vm.dataTestEdit = [];
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getAreaActive();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //Método que devuelve la lista de áreas activas
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.dataAreas = vm.removeData(data);
        vm.dataAreas = $filter('orderBy')(vm.dataAreas, 'name');
        vm.NumAreas = vm.dataAreas.length.toString();
        if (vm.dataAreas.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'DependenceController',
          }).then(function (modal) {
            modal.element.modal();
            vm.modalRequired = true;
            modal.close.then(function (result) {
              if (result === 'area') {
                $state.go('area');
              }

            });
          });
        } else {
          vm.getListSamples();
          //Mensaje de advertencia de la edición del formulario
          ModalService.showModal({
            templateUrl: 'Advertence.html',
            controller: 'DependenceController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'testedition') {
                $state.go('testedition');
              }

            });
          });
        }
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea(id, TestEditionForm) {
      vm.loadingdata = true;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.idArea = vm.dataAreas === undefined ? 0 : id;
      vm.selected = id;
      vm.selectedTest = -1;
      vm.isChangeData = false;
      vm.isFocus = false;
      vm.dataTestEdit = [];
      TestEditionForm.$setUntouched();
      return testDS.getTestArea(auth.authToken, 0, 1, vm.idArea).then(function (data) {
        vm.loadingdata = false;
        vm.idTest = undefined;
        if (data.data.length > 0) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data[0].user.userName;
          vm.dataTestEdit = data.data.length === 0 ? data.data : adddatatest(data);
        }
        return vm.dataTestEdit;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    //Método para validar cuando se selecciona un examen
    function getTestEdition(id) {
      if (id !== undefined) {
        if (!vm.isFocus) {
          vm.selectedTest = id;
        }
      }
    }

    vm.viewcontrol = viewcontrol;
    function viewcontrol(test, control) {
      if (control === 'code') {
        setTimeout(function () {
          document.getElementById('Testcode' + test.id).focus()
        }, 100);
      }
      if (control === 'abbr') {
        setTimeout(function () {
          document.getElementById('Testabbr' + test.id).focus()
        }, 100);
      }
      if (control === 'name') {
        setTimeout(function () {
          document.getElementById('Testname' + test.id).focus()
        }, 100);
      }
    }
    /** Funcion consultar el listado de las muestras activas en el sistema*/
    function getListSamples() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.getSampleActive(auth.authToken).then(function (data) {
        vm.getListUnits();
        if (data.status === 200) {
          vm.ListSamples = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion que consulta el listado de las unidades activas en el sistema.*/
    function getListUnits() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return unitDS.getUnitActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.ListUnits = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);
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
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'abbreviation') {
              vm.abbrRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }

          });
        }
      }
      if (!vm.codeRepeat && !vm.abbrRepeat && !vm.nameRepeat) {
        vm.Error = error;
      }
    }
    /** funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la vetana modal para la confirmación de los cambios al examen*//
  function ConfirmController($scope, close) {
    $scope.close = function (execute) {
      close({
        execute: execute
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
