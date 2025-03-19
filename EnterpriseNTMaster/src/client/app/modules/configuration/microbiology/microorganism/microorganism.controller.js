(function () {
  'use strict';
  angular.module('app.microorganism').controller('microorganismController', microorganismController)
  .controller('ControllerSensitivitie', ControllerSensitivitie);
  microorganismController.$inject = ['microorganismDS', 'sensitivitieDS', 'configurationDS', 'testDS' ,'localStorageService', 'ModalService', '$timeout', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'];

  function microorganismController(microorganismDS, sensitivitieDS, configurationDS, testDS, localStorageService, ModalService, $timeout, logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Microorganism';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.quantitydata = -1;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    vm.importMicroorganism = importMicroorganism;
    var auth;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.active = true;
    vm.windowOpenReport = windowOpenReport;
    vm.getSensitivity = getSensitivity;
    vm.listSensitivity = [];
    vm.modalrequired = modalrequired;
    vm.Newrelation = Newrelation;
    vm.sensitivities = [];
    vm.getTest = getTest;
    vm.destroy = destroy;
    vm.updatemicroorganism = updatemicroorganism;
    vm.getIdsensitivitymicroorganisms = getIdsensitivitymicroorganisms;
    vm.datamicroorganism = datamicroorganism;
    vm.validateRelationship = validateRelationship;

    //Valida que la relacion sea valida
    function validateRelationship() {
      var latestsensitivity = vm.sensitivities[vm.sensitivities.length - 1];
      latestsensitivity.relationduplicate = false;
      if (latestsensitivity.sensitivity.selected.id !== 0 && latestsensitivity.testcombo.selected.id !== 0) {
        for (var i = 0; i < vm.sensitivities.length - 1; i++) {
          if (latestsensitivity.id === vm.sensitivities[i].id && latestsensitivity.test === vm.sensitivities[i].test) {
            latestsensitivity.relationduplicate = true;
            vm.nameduplicate = $filter('translate')('1264');
            break;
          }
        }
      } else {
        latestsensitivity.relationduplicate = true;
        vm.nameduplicate =  $filter('translate')('0016');
      }
      return latestsensitivity;
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function datamicroorganism(data) {
      data.data.forEach(function (value, key) {
        data.data[key].sensitivity.selected = $filter('filter')(vm.listSensitivity, {
          id: value.sensitivity.id
        }, true)[0];
        data.data[key].testcombo = [];
        data.data[key].test = value.test === undefined ? 0 : value.test;
        var filtertest = $filter('filter')(vm.datatest, {
          id: value.test
        }, true)[0];
        data.data[key].testcombo.selected = filtertest === undefined ? {} : filtertest;
        data.data[key].test = value.test === undefined ? 0 : value.test;
      });
      return data.data;
    }

    //** Método que obtiene una lista de microorganismos**//
    function getIdsensitivitymicroorganisms(id) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.getIdsensitivitymicroorganisms(auth.authToken, id).then(function (data) {
        vm.sensitivities = data.data.length === 0 ? data.data : datamicroorganism(data);
        if(vm.sensitivities.length === 0) {
          vm.sensitivities = [
            {
              'sensitivity': {
                'selected': {
                  'id': 0
                }
              },
              'testcombo': {
                'selected': {
                  'id': 0
                }
              },
              'hide': true,
              'id': 0,
              'test': 0
            }
          ]
        }
        setTimeout(function () {
          var p = document.getElementById('bodysensitivity')
          p.scrollTop = 0;
        }, 100);
      }, function (error) {
        vm.modalError(error);
      });
    }

    function updatemicroorganism(microorganism) {
      var body = [];
      body.push({
        'id': microorganism.id,
        'sensitivity': vm.Detail.sensitivity,
        'test': null
      });
      var list = _.filter(vm.sensitivities, function(o) { return o.sensitivity.selected.id !== 0 && o.testcombo.selected !== 0 });
      if(list.length > 0) {
        list.forEach(function (val) {
          body.push({
            'id': microorganism.id,
            'sensitivity': val.sensitivity.selected,
            'test': val.testcombo.selected.id
          });
        });
      } else {
        vm.sensitivities = [];
      }
      if(body.length > 0) {
        return microorganismDS.updatemicroorganism(auth.authToken, body).then(function (data) {
          if (data.status === 200) {
            vm.active = false;
            vm.get();
            logger.success($filter('translate')('0042'));
            return body;
          }
        }, function (error) {
          vm.active = false;
          vm.modalError(error);
          vm.ShowPopupError = true;
        });
      }
    }

    function destroy($index) {
      var latestsensitivity = vm.sensitivities[vm.sensitivities.length - 1];
      latestsensitivity.relationduplicate = false;
      vm.sensitivities.splice($index, 1);
    }

    function Newrelation() {
      var latestsensitivity =  vm.validateRelationship();
      if(latestsensitivity.relationduplicate === false || latestsensitivity.relationduplicate === undefined) {
        var object = {
          'sensitivity': {
            'selected': {
              'id': 0
            }
          },
          'testcombo': {
            'selected': {
              'id': 0
            }
          },
          'hide': true,
          'id':0,
          'test': 0
        };
        var record = angular.copy(object);
        vm.sensitivities.push(record);
        setTimeout(function () {
          var p = document.getElementById('bodysensitivity');
          p.style.height += 100;
          p.scrollTop += 100;
        }, 100);
      }
    }

    function modalrequired() {
      if (vm.listSensitivity.length === 0) {
        ModalService.showModal({
          templateUrl: 'sensitivity.html',
          controller: 'ControllerSensitivitie',
          inputs: {
            sensitivityhide: vm.listSensitivity.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      } else {
        vm.get();
        vm.getTest();
      }
    }

    //** Metodo consulta los examenes**//
    function getTest() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestmicrobiology(auth.authToken).then(function (data) {
        vm.datatest = data.data.length === 0 ? data.data : removeData(data);
        vm.datatest = data.data;
        return vm.datatest;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que obtiene la lista de antibiogramas*//
    function getSensitivity() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sensitivitieDS.get(auth.authToken).then(function (data) {
        vm.listSensitivity = $filter('orderBy')(data.data, 'name');
        vm.active = false;
        vm.modalrequired();
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
        if (value.area !== undefined) {
          data.data[key].areaname = value.area.name;
        }
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
        vm.getSensitivity();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('name').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('name').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'sensitivity': null,
        'state': true
      };
      vm.sensitivities = [
        {
          'sensitivity': {
            'selected': {
              'id': 0
            }
          },
          'testcombo': {
            'selected': {
              'id': 0
            }
          },
          'hide': true,
          'id': 0,
          'test': 0
        }
      ]
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeat = false;
      vm.relationduplicate = false;
      vm.sensitivities = [];
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
      var latestsensitivity =  vm.validateRelationship();
      if(vm.sensitivities.length > 1) {
        if(latestsensitivity.relationduplicate === false || latestsensitivity.relationduplicate === undefined) {
          if (vm.Detail.id === null) {
            vm.insert();
          } else {
            vm.update();
          }
        }
      } else {
        vm.nameduplicate = '';
        if (vm.Detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.active = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.updatemicroorganism(data.data);
          vm.Detail = data.data;
          vm.stateButton('insert');
        }
      }, function (error) {
        vm.active = false;
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return microorganismDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.updatemicroorganism(data.data);
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }
      }, function (error) {
        vm.active = false;
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      vm.active = true;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.active = false;
        return data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.active = true;
      vm.Repeat = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.sensitivities = [];
      Form.$setUntouched();
      return microorganismDS.getId(auth.authToken, id).then(function (data) {
        vm.active = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.stateButton('update');
          vm.getIdsensitivitymicroorganisms(id);
        }
      }, function (error) {
        vm.modalError(error);
        vm.active = false;
      });
    }
    //** Método para importar microorganismos**//
    function importMicroorganism() {
      vm.active = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.importdata(auth.authToken, vm.listmicroorganismos).then(function (data) {
        if (data.status === 200) {
          vm.quantitydata = data.data;
          vm.get();
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.active = false;
        }
      }, function (error) {
        vm.modalError(error);
        vm.active = false;
      });
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/microorganis/microorganism.mrt';
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
  function ControllerSensitivitie($scope, sensitivityhide, close) {
    $scope.sensitivityhide = sensitivityhide;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();
