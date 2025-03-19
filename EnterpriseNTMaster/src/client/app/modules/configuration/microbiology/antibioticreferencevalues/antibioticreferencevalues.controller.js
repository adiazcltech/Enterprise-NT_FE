(function () {
  'use strict';
  angular
    .module('app.antibioticreferencevalues')
    .controller('AntibioticreferencevaluesController', AntibioticreferencevaluesController)
    .controller('deletereferenceController', deletereferenceController)
    .controller('duplicateController', duplicateController)
    .controller('ControllerRAVM', ControllerRAVM);;
  AntibioticreferencevaluesController.$inject = ['antibioticDS', 'listDS', 'configurationDS', 'microorganismDS', 'LZString', '$translate',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'referencemicrobiologyDS', 'ModalService'
  ];

  function AntibioticreferencevaluesController(antibioticDS, listDS, configurationDS, microorganismDS, LZString, $translate,
    localStorageService, logger, $filter, $state, moment, $rootScope, referencemicrobiologyDS, ModalService) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Antibioticreferencevalues';
    vm.namemethod = ['namemethod', 'namemicroorganism', 'nameantibiotic'];
    vm.namemicroorganism = ['namemicroorganism', 'namemethod', 'nameantibiotic'];
    vm.nameantibiotic = ['nameantibiotic', 'namemethod', 'namemicroorganism'];
    vm.sortReverse = false;
    vm.sortType = vm.namemethod;
    vm.selected = -1;
    vm.Detail = [];
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
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getListoperation = getListoperation;
    vm.fetch = fetch;
    vm.fetchantibiotic = fetchantibiotic;
    vm.getantibiotic = getantibiotic;
    vm.getmicroorganism = getmicroorganism;
    vm.limit = 0;
    vm.list = [];
    vm.limit1 = 0;
    vm.list1 = [];
    vm.getmicroorganismdata = getmicroorganismdata;
    vm.getantibioticdata = getantibioticdata;
    vm.delet = delet;
    vm.destroy = destroy;
    vm.modalrequired = modalrequired;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.method = [{
        id: 2,
        name: $filter('translate')('0874')
      }, {
        id: 1,
        name: $filter('translate')('0416')
      }

    ];
    vm.interpretation = [{
        id: 2,
        name: $filter('translate')('0876')
      },
      {
        id: 3,
        name: $filter('translate')('0877')
      }, {
        id: 1,
        name: $filter('translate')('0875')
      }
    ];
    //función que obtiene la lista de operador**//
    function getListoperation() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.getConfigurationFormatDate();
      return listDS.getList(auth.authToken, 49).then(function (data) {
        var operation = [];
        if (($filter('translate')('0000')) === 'esCo') {
          data.data.forEach(function (value, key) {
            var object = {
              id: value.id,
              name: value.esCo,
              esCo: value.esCo,
              enUsa: value.enUsa
            };
            operation.push(object);
          });
        } else {
          data.data.forEach(function (value, key) {
            var object = {
              id: value.id,
              name: value.enUsa,
              esCo: value.esCo,
              enUsa: value.enUsa
            };
            operation.push(object);
          });
        }

        vm.Listoperation = operation;
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
          document.getElementById('method').focus()
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
          document.getElementById('operation').focus()
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
      vm.Repeat = false;
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'valueMin': null,
        'valueMax': null,
        'operation': {},
        'microorganism': {
          'selected': {
            'id': 0
          }
        },
        'antibiotic': {
          'selected': {
            'id': 0
          }
        }
      };
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeat = false;
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
      vm.Detail.id = undefined;
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
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
      var save = {
        'antibiotic': vm.Detail.antibiotic.selected,
        'microorganism': vm.Detail.microorganism.selected,
        'method': vm.Detail.method.id,
        'interpretation': vm.Detail.interpretation.id,
        'valueMin': parseInt(vm.Detail.valueMin),
        'valueMax': vm.Detail.valueMax === null ? 0 : parseInt(vm.Detail.valueMax),
        'operation': vm.Detail.operation,
        'user': {
          'id': auth.id
        }
      }
      return referencemicrobiologyDS.New(auth.authToken, save).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail.id = 9;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var save = {
        'antibiotic': vm.Detail.antibiotic.selected,
        'microorganism': vm.Detail.microorganism.selected,
        'method': vm.Detail.method.id,
        'interpretation': vm.Detail.interpretation.id,
        'valueMin': parseInt(vm.Detail.valueMin),
        'valueMax': vm.Detail.valueMax === null ? 0 : parseInt(vm.Detail.valueMax),
        'operation': vm.Detail.operation,
        'user': {
          'id': auth.id
        }
      }
      return referencemicrobiologyDS.update(auth.authToken, save).then(function (data) {
        if (data.status === 200) {
          vm.get();
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
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'record already exists') {
              vm.Repeat = true;
              vm.Detail = [];
              vm.stateButton('init');
              ModalService.showModal({
                templateUrl: 'duplicate.html',
                controller: 'duplicateController',
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                  if (result === 'Yes') {}
                });
              });
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
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return referencemicrobiologyDS.getreferencevalues(auth.authToken).then(function (data) {
        vm.getmicroorganismdata();
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getantibiotic() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return antibioticDS.getState(auth.authToken, true).then(function (data) {
        if (data.data.length === 0 && vm.list.length === 0) {
          vm.modalrequired();
        } else {
          vm.list1 = $filter('orderBy')(data.data, 'name');
          vm.list1length = vm.list1.length;
          vm.getListoperation();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** para sacar la ventana modal de requeridos**//
    function modalrequired() {
      if (vm.list.length === 0 || vm.list1.length === 0) {
        ModalService.showModal({
          templateUrl: 'requeridvaluereferencie.html',
          controller: 'ControllerRAVM',
          inputs: {
            microorganismhide: vm.list.length,
            antibiotichide: vm.list1.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getantibioticdata() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return antibioticDS.getState(auth.authToken, true).then(function (data) {
        vm.antibioticdata = $filter('orderBy')(data.data, 'name');;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getmicroorganism() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.getState(auth.authToken, true).then(function (data) {
        vm.list = $filter('orderBy')(data.data, 'name');
        vm.listlength = vm.list.length;
        vm.getantibiotic();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getmicroorganismdata() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return microorganismDS.getState(auth.authToken, true).then(function (data) {
        vm.microorganismdata = $filter('orderBy')(data.data, 'name');
        vm.getantibioticdata();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método del combobox que recarga el combo microorganismos**//
    function fetch($select, $event) {
      if (vm.listlength > 49) {
        vm.getmicroorganism();
      }
      if ($event) {
        vm.limit = vm.limit + 50;
        if (vm.limit > vm.listlength) {
          vm.limit1 = vm.listlength;
        }
        if (vm.limit === vm.listlength) {
          vm.limit = vm.limit;
        }
        vm.datamicroorganism = vm.list.splice.apply(vm.list, [0, vm.limit].concat(vm.list));
        $event.stopPropagation();
        $event.preventDefault();

      } else {

        if ($select.search !== '') {
          vm.datamicroorganism = $filter('filter')(vm.microorganismdata, {
            name: $select.search
          });
          if (vm.datamicroorganism.length > 50) {
            vm.limit = 50;
            vm.datamicroorganism = vm.datamicroorganism.splice.apply(vm.datamicroorganism, [0, vm.limit].concat(vm.datamicroorganism));
          }

        } else {
          vm.datamicroorganism = [];
          vm.limit = 50;
          vm.datamicroorganism = vm.list.splice.apply(vm.list, [0, vm.limit].concat(vm.list));
        }
      }
    }
    //** Método del combobox que recarga el combo antibiotico**//
    function fetchantibiotic($select1, $event1) {
      if (vm.list1length > 49) {
        vm.getantibiotic();
      }
      if ($event1) {
        vm.limit1 = vm.limit1 + 50;
        if (vm.limit1 > vm.list1length) {
          vm.limit1 = vm.list1length;
        }
        if (vm.limit1 === vm.list1length) {
          vm.limit1 = vm.limit1;
        }
        vm.dataantibiotic = vm.list1.splice.apply(vm.list1, [0, vm.limit1].concat(vm.list1));
        $event1.stopPropagation();
        $event1.preventDefault();
      } else {
        if ($select1.search !== '') {
          vm.dataantibiotic = $filter('filter')(vm.antibioticdata, {
            name: $select1.search
          });
          if (vm.dataantibiotic.length > 50) {
            vm.limit1 = 50;
            vm.dataantibiotic = vm.dataantibiotic.splice.apply(vm.dataantibiotic, [0, vm.limit1].concat(vm.dataantibiotic));
          }

        } else {
          vm.dataantibiotic = [];
          vm.limit1 = 50;
          vm.dataantibiotic = vm.list1.splice.apply(vm.list1, [0, vm.limit1].concat(vm.list1));
        }
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(index, Form, microorganism) {
      vm.Repeat = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.Detail = [];
      Form.$setUntouched();
      return referencemicrobiologyDS.getId(auth.authToken, microorganism.idmicroorganism, microorganism.idantibiotic, microorganism.method, microorganism.interpretation).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = {
            'method': {
              id: data.data.method
            },
            'microorganism': {
              'selected': data.data.microorganism
            },
            'antibiotic': {
              'selected': data.data.antibiotic
            },
            'interpretation': {
              'id': data.data.interpretation
            },
            'operation': {
              'id': data.data.operation.id
            },
            'valueMin': data.data.valueMin,
            'valueMax': data.data.valueMax
          }
          vm.loadingdata = false;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //* Metodo para eliminar un item**//
    function destroy(Form, microorganism) {
      ModalService.showModal({
        templateUrl: 'delete.html',
        controller: 'deletereferenceController',
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result === 'Yes') {
            vm.delet(Form, microorganism);
          }
        });
      });
    }
    //** Método se comunica con el dataservice para eliminar un item**//
    function delet(Form, microorganism) {
      Form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = -1;
      vm.Detail = [];
      return referencemicrobiologyDS.deleterelation(auth.authToken, microorganism.idmicroorganism, microorganism.idantibiotic, microorganism.method, microorganism.interpretation).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].namemethod = value.method === 1 ? $filter('translate')('0416') : $filter('translate')('0874');
        data.data[key].namemicroorganism = value.microorganism.name;
        data.data[key].nameantibiotic = value.antibiotic.name;
        data.data[key].idmicroorganism = value.microorganism.id;
        data.data[key].idantibiotic = value.antibiotic.id;
        if ($filter('translate')('0000') === 'esCo') {
          var max = value.valueMax === '0' ? '' : ' ' + $filter('translate')('0878') + ' ' + value.valueMax;
          data.data[key].valuereferencia = value.operation.esCo + ' ' + value.valueMin + max;
        } else {
          var max = value.valueMax === '0' ? '' : ' ' + $filter('translate')('0878') + ' ' + value.valueMax;
          data.data[key].valuereferencia = value.operation.enUsa + ' ' + value.valueMin + max;
        }
        delete value.user;
        delete value.lastTransaction
        delete value.microorganism;
        delete value.antibiotic;
        delete value.valueMin;
        delete value.valueMax;
        delete value.operation;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/antibioticreferencevalues/antibioticreferencevalues.mrt';
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
      vm.getmicroorganism();
    }
    vm.isAuthenticate();
  }
  //** Ventana modal de confirmación a eliminar un elemento*//
  function deletereferenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Ventana modal de un elemento duplicado*//
  function duplicateController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Ventana modal de un elementos requeridos*//
  function ControllerRAVM($scope, antibiotichide, microorganismhide, close) {
    $scope.antibiotichide = antibiotichide;
    $scope.microorganismhide = microorganismhide;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
