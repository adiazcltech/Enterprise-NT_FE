(function () {
  'use strict';

  angular
    .module('app.container')
    .controller('ContainerController', ContainerController)
    .controller('priorityController', priorityController);

  ContainerController.$inject = ['containerDS', 'unitDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'ModalService'
  ];

  function ContainerController(containerDS, unitDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate, ModalService) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    var auth;
    vm.init = init;
    vm.title = 'Container';
    vm.selected = -1;
    vm.Detail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.updatepriority = updatepriority;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.stateButton = stateButton;
    vm.save = save;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.nameRepeat = false;
    vm.generateFile = generateFile;
    vm.priorityRepeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getListUnits = getListUnits;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.updatepriorityordering = updatepriorityordering;
    vm.getnewpriori = getnewpriori;
    vm.Orderpriority = Orderpriority;

    vm.sortableOptions = {
      items: "li:not(.not-sortable)",
      cancel: ".not-sortable",
      update: function (e, ui) {
        ModalService.showModal({
          templateUrl: 'validatepriority.html',
          controller: 'priorityController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              vm.updatepriority();
            }
            if (result === 'No') {
              vm.get();
            }
          });
        });

      }

    }
    //** Metodo que guarda la prioridad de la muestras**//
    function updatepriority() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      for (var i = 0; i < vm.data.length; i++) {
        vm.data.priority = i + 1;
      }
      vm.updatepriorityordering();
    }
    //** Metodo que ordena la prioridad de la muestras**//
    function updatepriorityordering() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return containerDS.updatepriority(auth.authToken, vm.data).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          // vm.Detail={};
          // vm.selected=-1;
          logger.success($filter('translate')('0042'));
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que crea una nueva prioridad de la muestras**//
    function getnewpriori() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return containerDS.get(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.getListUnits();
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.data = $filter('orderBy')(vm.data, 'priority');
        vm.data.sort(vm.Orderpriority);
        vm.updatepriority();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que ordena la prioridad**//
    function Orderpriority(a, b) {
      if (a.state > b.state) {
        return -1;
      } else if (a.state < b.state) {
        return 1;
      } else {
        if (a.priority < b.priority) {
          return -1;
        } else if (a.priority > b.priority) {
          return 1;
        } else {
          return 0;
        }
      }
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
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta la lista de unidades activas**//
    function getListUnits() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return unitDS.getUnitActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.ListUnits = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para acicionar o eliminar elementos de JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.image;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo para crear un nuevo recipiente**//
    function New(form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      form.$setUntouched();
      vm.selected = -1;
      vm.isDisabledState = true;
      var datapriorit = $filter('filter')(vm.data, {
        state: true
      }, true);
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'unit': {
          'id': null
        },
        'id': null,
        'name': '',
        'image': '',
        'priority': datapriorit.length + 1,
        'state': true
      };

      vm.stateButton('add');
    }
    //** Metodo para cancelar un recipiente**//
    function cancel(Form) {
      Form.$setUntouched();
      vm.nameRepeat = false;
      vm.priorityRepeat = false;

      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Metodo para editar un recipiente**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Metodo que evalua sie el recipiente se crea o se actualiza**//
    function save(Form) {
      Form.$setUntouched();
      vm.priorityRepeat = false;
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }
    //** Metodo para insertar un nuevo recipiente**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return containerDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.getnewpriori();
          vm.Detail.id = data.data.id;
          // vm.Detail = data.data;
          vm.stateButton('insert');
          // logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para actualizar un recipiente**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return containerDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.getnewpriori();
          vm.stateButton('update');

          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que muestra una ventana modal para la confirmación de cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Metodo que obtiene una lista de recipientes**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return containerDS.get(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.getListUnits();
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.data = $filter('orderBy')(vm.data, 'priority');
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta el detalle del recipiente seleccionado**//
    function getId(id, index, Form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      return containerDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.Detail = data.data;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que válida los estado de los botones**//
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
    //** Metodo que muestra una ventana modal se hay un error en el servicio**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'Name') {
              vm.nameRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '1' && item[1] === 'Priority') {
              vm.priorityRepeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.priorityRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.data.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.data;
        vm.pathreport = '/report/configuration/test/container/container.mrt';
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
    //** Método  para inicializar la página**//
    function init() {
      vm.stateButton("init");
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de requerido*//
  function priorityController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
