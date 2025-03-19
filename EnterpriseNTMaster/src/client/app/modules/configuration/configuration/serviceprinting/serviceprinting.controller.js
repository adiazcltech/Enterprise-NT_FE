(function () {
  'use strict';
  angular
    .module('app.serviceprinting')
    .controller('serviceprintingController', serviceprintingController)
    .controller('DeleteController', DeleteController)
    .controller('Controllerprinting', Controllerprinting);
  serviceprintingController.$inject = ['serviceprintDS', 'ModalService', 'branchDS', 'serviceDS',
    'configurationDS', 'localStorageService', 'logger', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function serviceprintingController(serviceprintDS, ModalService, branchDS, serviceDS,
    configurationDS, localStorageService, logger, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.blockView = true;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'ServicePrinting';

    vm.nameservice = ['nameservice', 'namebranch', 'serial'];
    vm.namebranch = ['namebranch', 'nameservice', 'serial'];
    vm.serial = ['serial', 'nameservice', 'namebranch'];
    vm.sortReverse = false;
    vm.sortType = vm.nameservice;

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
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.getbranch = getbranch;
    vm.getseervice = getseervice;
    vm.deleteserviceprint = deleteserviceprint;
    vm.getserial = getserial;
    vm.modalrequired = modalrequired;
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var list = [];
      data.data.forEach(function (value, key) {
        var branch = _.filter(vm.listbranch, {
          'id': value.branch.id
        });
        value.namebranch = branch.length === 0 ? '' : branch[0].name;
        var service = _.filter(vm.listservice, {
          'id': value.service.id
        });
        value.nameservice = service.length === 0 ? '' : service[0].name;
        if (branch.length !== 0 && service.length !== 0) {
          var data = {
            'id': key,
            'namebranch': branch[0].name,
            'nameservice': service[0].name,
            'search': value.serial + value.namebranch + value.nameservice,
            'serial': value.serial,
            'username': auth.userName,
            'branch': {
              'id': value.branch.id
            },
            'service': {
              'id': value.service.id
            }
          }
          list.add(data);
        }
      });

      return list;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getbranch();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
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
          document.getElementById('service').focus()
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
          document.getElementById('service').focus()
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
        'id': null
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
        var repeat2 = _.filter(vm.data, {
          'id': vm.selected
        })[0];
        vm.getId(repeat2, Form);
      }
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.repeat = false;
      Form.$setUntouched();
      var repeat = _.filter(vm.data, {
        'serial': vm.Detail.serial,
        'branch': {
          'id': vm.Detail.branch.id
        },
        'service': {
          'id': vm.Detail.service.id
        }
      });
      if (vm.Detail.id === null) {
        if (repeat.length === 0) {
          vm.insert();
        } else {
          vm.Repeat = true;
        }
      } else {
        var repeat1 = _.filter(vm.data, function (e) {
          return e.id !== vm.selected
        });
        if (repeat1.length === 0) {
          vm.update();
        } else {
          var repeat2 = _.filter(repeat1, {
            'serial': vm.Detail.serial,
            'branch': {
              'id': vm.Detail.branch.id
            },
            'service': {
              'id': vm.Detail.service.id
            }
          });
          if (repeat2.length === 0) {
            vm.update();
          } else {
            vm.Repeat = true;
          }
        }

      }

    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceprintDS.updateserviceprint(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.selected = -1;
          vm.Detail = {};
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceprintDS.updateserviceprint(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          var repeat2 = _.filter(vm.data, {
            'id': vm.Detail.id
          });
          return serviceprintDS.deleteprint(auth.authToken, repeat2[0]).then(function (data) {
            if (data.status === 200) {
              vm.loadingdata = false;
              vm.get();
              vm.selected = -1;
              vm.Detail = {};
              vm.stateButton('insert');
              logger.success($filter('translate')('0042'));
            }
          }, function (error) {
            vm.modalError(error);
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function deleteserviceprint(serviceprinting) {
      ModalService.showModal({
        templateUrl: 'deleteditem.html',
        controller: 'DeleteController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.action === 'Yes') {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return serviceprintDS.deleteprint(auth.authToken, serviceprinting).then(function (data) {
              if (data.status === 200) {
                vm.get();
                vm.selected = -1;
                vm.Detail = {};
                vm.loadingdata = false;
                vm.stateButton('init');
                logger.success($filter('translate')('0042'));
              }
            }, function (error) {
              vm.modalError(error);
            });
          }
        });
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceprintDS.getserviceprint(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data.length === 0 ? [] : removeData(data);
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de sedes activas**//
    function getbranch() {
      vm.listbranch = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.getseervice();
        vm.listbranch = $filter('orderBy')(data.data, 'name');
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de servicios activas**//
    function getseervice() {
      vm.listservice = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getServiceActive(auth.authToken).then(function (data) {
        vm.getserial();
        vm.listservice = $filter('orderBy')(data.data, 'name');
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de seriales configurados**//
    function getserial() {
      vm.listserial = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceprintDS.getserial(auth.authToken).then(function (data) {
        if (data.data.length !== 0) {
          for (var i = 0; i < data.data.length; i++) {
            var serial = {
              'id': data.data[i],
              'name': data.data[i]
            }
            vm.listserial.add(serial);
          }
          vm.listserial = $filter('orderBy')(vm.listserial, 'name');
        }
        vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que muestra una ventana modal con los requeridos**//
    function modalrequired() {
      if (vm.listserial.length === 0 || vm.listservice.length === 0 || vm.listbranch.length === 0) {
        ModalService.showModal({
          templateUrl: 'requeridserviceprinting.html',
          controller: 'Controllerprinting',
          inputs: {
            listserial: vm.listserial.length,
            listservice: vm.listservice.length,
            listbranch: vm.listbranch.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      } else {
        vm.get();
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(serviceprinting, Form) {
      vm.Repeat = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = serviceprinting.id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.Detail = {
        "id": serviceprinting.id,
        "serial": serviceprinting.serial,
        "branch": {
          "id": serviceprinting.branch.id,
          "name": serviceprinting.namebranch
        },
        "service": {
          "id": serviceprinting.service.id,
          "name": serviceprinting.nameservice
        }
      }
      vm.loadingdata = false;
      vm.stateButton('update');
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/configuration/serviceprinting/serviceprinting.mrt';
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
  //** Método de ventana modal con la confirmación de la eliminación*//
  function DeleteController($scope, close) {
    $scope.close = function (page) {
      close({
        action: page,
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método de ventana modal que muestra los requeridos de la pagina*//
  function Controllerprinting($scope, listserial, listservice, listbranch, close) {
    $scope.listserial = listserial;
    $scope.listservice = listservice;
    $scope.listbranch = listbranch;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
