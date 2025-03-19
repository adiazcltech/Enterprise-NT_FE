(function () {
  'use strict';
  angular
    .module('app.pathologist')
    .controller('pathologistController', pathologistController)
    .controller('pathologistemplateController', pathologistemplateController);
  pathologistController.$inject = ['pathologistDS', 'organDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function pathologistController(pathologistDS, organDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'pathologist';
    vm.getPathologist = getPathologist;
    vm.getOrgans = getOrgans;
    vm.listPathologist = [];
    vm.listOrgans = [];
    vm.listOrgansByPathologist = [];
    vm.getPathologistById = getPathologistById;
    vm.modalrequired = modalrequired;
    vm.changeSearch = changeSearch;
    vm.removeData = removeData;
    vm.save = save;
    vm.generateFile = generateFile;
    vm.modalError = modalError;
    vm.windowOpenReport = windowOpenReport;
    vm.user = ['user', 'name'];
    vm.name = ['name', 'user'];
    vm.sortType = vm.user;
    vm.codeOrgan = ['code', 'name', '-seletedOrder'];
    vm.nameOrgan = ['name', 'code', '-seletedOrder'];
    vm.seletedOrgan = ['-seletedOrder', '-code', '-name'];
    vm.selected = -1;
    vm.sortReverse = false;
    vm.isAuthenticate = isAuthenticate;
    vm.loadingdata = true;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;

    //** Metodo configuración formato**/
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getPathologist();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /*Metodo para limpiar cuando se busca*/
    function changeSearch() {
      vm.selected = -1;
      vm.listOrgansByPathologist = [];
      vm.searchOrgans = '';
    }

    /**Metodo para obtener una lista de patologos*/
    function getPathologist() {
      vm.namePathologist = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return pathologistDS.getPathologist(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listPathologist = data.data === '' ? [] : _.filter(data.data, function (o) { return o.pathologist.state; });
          vm.listPathologist = vm.listPathologist.length === 0 ? [] : removeData(vm.listPathologist);
        } else {
          vm.listPathologist = [];
        }
        vm.getOrgans();
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para obtener una lista de organos*/
    function getOrgans() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return organDS.getOrgan(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listOrgans = data.data === '' ? [] : _.filter(data.data, function (o) { return o.status === 1; });
        } else {
          vm.listOrgans = [];
        }
        vm.loadingdata = false;
        if (vm.listPathologist.length === 0 || vm.listOrgans.length === 0) {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para obtener los organos por patologo*/
    function getPathologistById(pathologist, index, This) {
      vm.loadingdata = true;
      vm.namePathologist = pathologist.nameuserall;
      vm.idPathologist = pathologist.id === undefined ? -1 : pathologist.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return pathologistDS.getPathologistById(auth.authToken, pathologist.pathologist.id).then(function (data) {
        if (data.status === 200) {
          vm.selected = pathologist.pathologist.id;
          vm.listOrgansByPathologist = data.data.organs;
          vm.sortTypeTest = vm.seletedOrgan;
          vm.sortReversetest = true;
          var activeOrgans = _.filter(data.data.organs, function (o) { return o.selected; });
          var date = activeOrgans[0] !== undefined ? moment(activeOrgans[0].createdAt).format(vm.formatDate) : '';
          var user = activeOrgans[0] !== undefined ? activeOrgans[0].userCreated.userName : ''
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + date + ' - ';
          vm.usuario = vm.usuario + user;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que agrega item a la lista de patologos**//
    function removeData(data) {
      data.forEach(function (value, key) {
        data[key].id = value.pathologist.id;
        data[key].userName = value.pathologist.userName;
        data[key].nameuserall = value.pathologist.name + ' ' + value.pathologist.lastName;
      });
      return data;
    }

    //** Método que actualiza los datos**//
    function save() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listOrgansByPathologist = [];
      vm.listOrgansByPathologist.forEach(function (value) {
        if (value.selected === true) {
          listOrgansByPathologist.push({
            id: value.id,
            name: value.name
          });
        }
      });
      if (listOrgansByPathologist.length === 0) return false;
      vm.loadingdata = true;
      var pathologist = {
        id: vm.selected,
        nameuserall: vm.namePathologist,
        pathologist: {
          id: vm.selected
        },
        organs: listOrgansByPathologist,
        userCreated: auth
      };
      return pathologistDS.insertOrgans(auth.authToken, pathologist).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getPathologistById(pathologist, vm.selected);
          vm.sortTypeTest = vm.seletedOrgan;
          vm.sortReversetest = true;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var name = vm.namePathologist;
      var id = vm.idPathologist;
      vm.filteredOrgans.forEach(function (value) {
        if (value.selected) {
          datareport.push({
            'id': id,
            'codeorgan': value.code,
            'organ': value.name,
            'selected': value.selected,
            'namepathologist': name.toUpperCase(),
            'username': auth.userName
          });
        }
      });
      if (vm.filteredOrgans.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/pathology/pathologist/pathologist.mrt';
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
    function modalrequired() {     
        ModalService.showModal({
          templateUrl: 'pathologistemplate.html',
          controller: 'pathologistemplateController',
          inputs: {
            listOrgans: vm.listOrgans.length,
            listPathologist: vm.listPathologist.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });      
    }

    //** Metodo que válida la autenticación**//
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
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }

    /** funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

  /** funcion inicial la modal para mostrar la modal de requridos*/
  function pathologistemplateController($scope,listOrgans,listPathologist, close) {
    $scope.listOrgans = listOrgans;
    $scope.listPathologist = listPathologist;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }

})();
