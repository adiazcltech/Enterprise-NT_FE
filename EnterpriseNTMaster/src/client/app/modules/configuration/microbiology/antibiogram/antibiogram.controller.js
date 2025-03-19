(function () {
  'use strict';
  angular
    .module('app.antibiogram')
    .filter("trust", ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('AntibiogramController', AntibiogramController)
    .controller('ItemController', ItemController)
    .controller('Controllermicroorganism', Controllermicroorganism)
    .controller('GeneralController', GeneralController);
  AntibiogramController.$inject = ['sensitivitieDS', 'ModalService', 'antibioticDS',
    'configurationDS', 'unitDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function AntibiogramController(sensitivitieDS, ModalService, antibioticDS,
    configurationDS, unitDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Antibiogram';
    vm.code = ['code', 'abbr', 'name', 'state'];
    vm.abbr = ['abbr', 'code', 'name', 'state'];
    vm.name = ['name', 'code', 'abbr', 'state'];
    vm.state = ['-state', '+code', '+abbr', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.nameantibiotic = ['name', 'line', 'unit', 'selected'];
    vm.unit = ['unit', 'name', 'line', 'selected'];
    vm.lineantibiotic = ['line', 'name', 'unit', 'selected'];
    vm.selected = ['-selected', '+name', '+line', '+unit'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.nameantibiotic;
    vm.Detail = [];
    vm.antibiotic = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
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
    var auth;
    vm.Repeatcode = false;
    vm.Repeatabre = false;
    vm.Repeat = false;
    vm.updateantibiotic = updateantibiotic;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getunit = getunit;
    vm.getantibioticid = getantibioticid;
    vm.changeassig = changeassig;
    vm.updateantibioticarray = updateantibioticarray;
    vm.iddelele = 0;
    vm.deleteantibiotic = deleteantibiotic;
    vm.modalrequired = modalrequired;
    vm.OderAssing = OderAssing;
    vm.OrdenarPorId = OrdenarPorId;
    vm.limit = 0;
    vm.list = [];
    vm.Line = [{
      id: 1,
      name: $filter('translate')('0417') + ' 1'
    }, {
      id: 2,
      name: $filter('translate')('0417') + ' 2'
    }, {
      id: 3,
      name: $filter('translate')('0417') + ' 3'
    }];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.generalSensitivity = generalSensitivity;
    vm.generalAssignment = generalAssignment;

    function generalAssignment(sensitivity) {
      vm.loadingdata = true;
      return sensitivitieDS.generalSensitivity(auth.authToken, sensitivity).then(function (data) {
        if(data.status === 200) {
          logger.success($filter('translate')('1262'));
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }

    function generalSensitivity(sensitivity) {
      if(sensitivity) {
        ModalService.showModal({
          templateUrl: 'generalSensitivity.html',
          controller: 'GeneralController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              vm.generalAssignment(sensitivity);
            }
          });
        });
      }
    }

    //** Método cambia el estado cuando se selecciona la fila**//
    function changeassig(id) {
      if (id.selected === false) {
        ModalService.showModal({
          templateUrl: 'validationItems.html',
          controller: 'ItemController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              id.line = null;
              id.unit = null;
              id.referenceValue = null;
            }
            if (result === 'No') {
              id.selected = true;
            }
          });
        });
      } else {
        id.line = 1;
      }
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
        if (data.status === 200) {
          vm.get();
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
          document.getElementById('code').focus()
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
          document.getElementById('code').focus()
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
      vm.iddelele = 0;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      form.$setUntouched();
      vm.usuario = '';
      vm.selectedp = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'abbr': '',
        'code': '',
        'qc': false,
        'suppressionRule': false,
        'state': true
      };
      vm.sortReverse1 = false;
      vm.sortType1 = 'name';
      vm.stateButton('add');
      vm.getantibioticid(0, auth);
    }

    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.erroresult = false;
      vm.Repeatcode = false;
      vm.Repeatabre = false;
      vm.Repeat = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selectedp, Form);
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
      var antibiotics = vm.updateantibioticarray();
      if(antibiotics.length === 0) {
        logger.error($filter('translate')('1260'));
        return;
      }
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }

    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sensitivitieDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.iddelele = data.data.id;
          var antibiotics = vm.updateantibioticarray();
          if (antibiotics.length > 0) {
            vm.updateantibiotic();
          }
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.antibiotic.sort(vm.OderAssing);
          return data;
        }
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return sensitivitieDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          var antibiotics = vm.updateantibioticarray();
          if (antibiotics.length > 0) {
            vm.updateantibiotic();
          }
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          vm.antibiotic.sort(vm.OderAssing);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y actualiza el antibiotico**//
    function updateantibiotic() {
      var antibiotics = vm.updateantibioticarray();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return antibioticDS.updateantibiotic(auth.authToken, antibiotics).then(function (data) {
        if (data.status === 200) {
          return vm.antibiotic;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeatcode = true;
            }
            if (item[0] === '1' && item[1] === 'abbr') {
              vm.Repeatabre = true;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeatcode === false && vm.Repeatabre === false && vm.Repeat === false) {
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
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sensitivitieDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.antibigramid = vm.data;
        if(vm.data.length) {
          vm.antibigramid.sort(vm.OrdenarPorId);
          var i = vm.antibigramid.length - 1;
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método para ordenar por id**//
    function OrdenarPorId(x, y) {
      return x.id - y.id;
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function updateantibioticarray() {
      var antibiotic = [];
      vm.antibiotic.forEach(function (value, key) {
        if (value.selected === true) {
          var object = {
            id: vm.iddelele,
            selected: true,
            line: value.line,
            referenceValue: value.referenceValue === null ? 0 : value.referenceValue,
            unit: value.unit,
            'antibiotic': {
              'user': {
                'id': auth.id
              },
              id: value.antibiotic.id,
              name: value.antibiotic.name
            }
          };
          antibiotic.push(object);
        }
      });
      if (antibiotic.length === 0) {
        vm.deleteantibiotic();
      }
      return antibiotic;
    }

    //** Método eliminar una relacion con el antibiotico**//
    function deleteantibiotic() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return antibioticDS.deletesensitivity(auth.authToken, vm.iddelele).then(function (data) {}, function (error) {});
    }

    //** Método que obtiene una lista de unidades**//
    function getunit() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return unitDS.getUnitState(auth.authToken, true).then(function (data) {
        vm.dataunit = data.data;
        vm.getConfigurationFormatDate();
        return vm.dataunit;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.erroresult = false;
      vm.Repeatcode = false;
      vm.Repeatabre = false;
      vm.Repeat = false;
      vm.sortType1 = '';
      vm.sortReverse1 = true;
      vm.sortType2 = '';
      vm.sortReverse2 = true;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selectedp = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.iddelele = id;
      vm.getantibioticid(id, auth);
      return sensitivitieDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.loadingdata = false;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que ordena los antibioticos **//
    function OderAssing(a, b) {
      if (a.selected < b.selected) {
        return -1;
      } else if (a.selected > b.selected) {
        return 1;
      } else {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        } else {
          return 0;
        }
      }
    }

    //** Metodo que obtiene los antibioticos de un antibiograma**//
    function getantibioticid(id) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return antibioticDS.getIdsensitivity(auth.authToken, id).then(function (data) {
        vm.antibiotic = data.data.length === 0 ? data.data : adddataunit(data);
        vm.sortReverse1 = false;
        vm.sortType1 = vm.selected;
        vm.modalrequired();
        return vm.antibiotic;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function adddataunit(data) {
      data.data.forEach(function (value, key) {
        if (value.unit === null) {
          data.data[key].unitcomplete = {
            'id': '',
            'name': ''
          };
        } else {
          data.data[key].unitcomplete = $filter('filter')(vm.dataunit, {
            id: value.unit
          }, true)[0]

        }
      });
      return data.data;
    }

    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.antibiotic.length === 0) {
        ModalService.showModal({
          templateUrl: 'microorganism.html',
          controller: 'Controllermicroorganism',
          inputs: {
            antibiotichide: vm.antibiotic.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      } else {
        vm.getunit();
      }
    }

    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/antibiogram/antibiogram.mrt';
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
      vm.getantibioticid(0);
    }
    vm.isAuthenticate();
  }

  //** Controller de la ventana modal de items por default*//
  function ItemController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }

  //** Controller de la vetana modal de requerido*//
  function Controllermicroorganism($scope, antibiotichide, close) {
    $scope.antibiotichide = antibiotichide;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }

  //** Controller de la ventana modal de asignacion masiva de antibiograma*//
  function GeneralController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }


})();
