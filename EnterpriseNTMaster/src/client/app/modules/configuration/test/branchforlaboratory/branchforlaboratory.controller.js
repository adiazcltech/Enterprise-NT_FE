(function () {
  'use strict';

  angular
    .module('app.branchforlaboratory')
    .controller('dlaboratoriesbybranchController', dlaboratoriesbybranchController)
    .controller('branchforlaboratoryController', branchforlaboratoryController);

  branchforlaboratoryController.$inject = ['laboratoryDS', 'branchDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function branchforlaboratoryController(laboratoryDS, branchDS, configurationDS,
    localStorageService, logger, $filter, $state, moment, $rootScope, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'branchforlaboratory';
    vm.code = ['code', 'name'];
    vm.name = ['name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.Laboratoryname = ['name', 'select'];
    vm.selectname = ['-select', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.Laboratoryname;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getlaboratory = getlaboratory;
    vm.listlaboratories = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.idTest = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    var auth;
    //** Método que obtiene los laboratorios**//
    function getlaboratory() {
      vm.listlaboratories = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratoryActive(auth.authToken).then(function (data) {
        vm.listlaboratories = data.data;
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar las sedes**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        vm.modalrequired();
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la lista**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].search = data.data[key].code + data.data[key].name;
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
        vm.getlaboratory();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.loadingdata = true;
      var data = {
        'id': vm.selected,
        'name': vm.nameTest
      }
      vm.getId(data)
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datareport = $filter('filter')(vm.Detail, {
        select: true
      });
      var laboratories = {
        "branch_id": vm.idTest,
        "laboratories": _.map(datareport, 'laboratory_id')
      }
      return laboratoryDS.updatelaboratoriesbybranches(auth.authToken, laboratories).then(function (data) {
        if (data.status === 200) {
          var data = {
            'id': vm.selected,
            'name': vm.nameTest
          }
          vm.getId(data)
          logger.success($filter('translate')('0042'));
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
    //** Método que evalua los requeridos**//
    function modalrequired() {
      if (vm.listlaboratories.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'dlaboratoriesbybranchController',
          inputs: {
            hidelaboratory: vm.listlaboratories.length,
            hidebranch: vm.data.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id de la sede**//
    function getId(Testre) {
      vm.search2 = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = Testre.id;
      vm.Detail = [];
      vm.idTest = Testre.id;
      vm.nameTest = Testre.name;
      vm.sortReverse1 = true;
      vm.sortType1 = '';
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.username = Testre.username;
      vm.loadingdata = true;
      return laboratoryDS.getlaboratoriesbybranches(auth.authToken, Testre.id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data;
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectname;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = [];
      var datareport = $filter('filter')(vm.filtered1, {
        select: true
      });
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'name': vm.nameTest
        };
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/test/branchforlaboratory/branchforlaboratory.mrt';
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
  // ventana modal requeridos
  function dlaboratoriesbybranchController($scope, hidelaboratory, hidebranch, close) {
    $scope.hidelaboratory = hidelaboratory;
    $scope.hidebranch = hidebranch;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
