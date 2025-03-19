(function () {
  'use strict';

  angular
    .module('app.macroscopytemplate')
    .controller('macroscopytemplateController', macroscopytemplateController)
    .controller('subSampleDependenceController', subSampleDependenceController)
    .controller('validateorderController', validateorderController);

  macroscopytemplateController.$inject = ['specimenDS', 'fieldDS', 'macroscopytemplateDS', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'ModalService'
  ];

  function macroscopytemplateController(specimenDS, fieldDS, macroscopytemplateDS, configurationDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate, ModalService) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Template';

    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.isAuthenticate = isAuthenticate;
    vm.modalError = modalError;
    vm.loadingdata = true;

    vm.codesample = ['codesample', 'name'];
    vm.name = ['name', 'codesample'];
    vm.sortType = vm.codesample;
    vm.sortReverse = false;
    vm.selected = -1;

    vm.nameField = ['name', '-seletedOrder'];
    vm.seletedField = ['-seletedOrder', '-name'];

    vm.listFieldsBySpecimen = [];
    vm.listFieldsOrder = [];

    vm.modalRequired = false;
    vm.modalrequired = modalrequired;
    vm.getSpecimens = getSpecimens;
    vm.filterView = filterView;
    vm.getFieldsBySpecimen = getFieldsBySpecimen;
    vm.save = save;
    vm.changeSearch = changeSearch;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.getfields = getfields;

    vm.sortableOptions = {
      items: "li:not(.not-sortable)",
      cancel: ".not-sortable",
      update: function (e, ui) {
      }
    }

    /*Metodo para limpiar cuando se busca*/
    function changeSearch() {
      vm.selected = -1;
      vm.listFieldsBySpecimen = [];
      vm.listFieldsOrder = [];
      vm.searchFields = '';
      vm.view = 'R';
    }

    //** Metodo configuración formato**/
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getSpecimens();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function save() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listFieldsBySpecimen = [];
      var i = 1;
      vm.listFieldsBySpecimen.forEach(function (value) {
        if (value.selected === true) {
          var order = _.find(vm.listFieldsOrder, function (o) { return o.id === value.id });
          listFieldsBySpecimen.push({
            id: value.id,
            name: value.name,
            order: order ? order.order : value.order ? value.order : i
          });
          !order ? !value.order ? i++ : '' : '';
        }
      });
      if (listFieldsBySpecimen.length === 0) return false;
      vm.loadingdata = true;
      var template = {
        id: vm.selected,
        specimen: {
          id: vm.selected,
        },
        fields: listFieldsBySpecimen,
        userCreated: auth
      };
      return macroscopytemplateDS.insertFields(auth.authToken, template).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getFieldsBySpecimen(template, vm.selected);
          vm.sortTypeTest = vm.seletedField;
          vm.sortReversetest = true;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });

    }

    /**Metodo para obtener los campos por especimen*/
    function getFieldsBySpecimen(specimen, index, This) {
      vm.loadingdata = true;
      vm.view = 'R';
      vm.listFieldsOrder = [];
      vm.nameSpecimen = specimen.name;
      vm.idSpecimen = specimen.id === undefined ? -1 : specimen.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return macroscopytemplateDS.getFieldsBySpecimen(auth.authToken, specimen.id).then(function (data) {
        if (data.status === 200) {
          vm.listFieldsBySpecimen = data.data;
          vm.sortTypeTest = vm.seletedField;
          vm.sortReversetest = true;
          var activeFields = _.filter(data.data, function (o) { return o.selected; });
          var date = activeFields[0] !== undefined ? moment(activeFields[0].createdAt).format(vm.formatDate) : '';
          var user = activeFields[0] !== undefined ? activeFields[0].userCreated.userName : ''
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + date + ' - ';
          vm.usuario = vm.usuario + user;
          vm.selected = specimen.id;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /** Método que válida el cambio de vista**/
    function filterView(view) {
      vm.view = view;
      if (view === 'O') {
        vm.listFieldsOrder = [];
        vm.listFieldsBySpecimen = $filter('orderBy')(vm.listFieldsBySpecimen, 'order');
        vm.listFieldsBySpecimen.forEach(function (value) {
          if (value.selected === true) {
            vm.listFieldsOrder.push(value);
          }
        });
      }
    }

    /**Metodo para obtener una lista de especimenes*/
    function getSpecimens() {
      vm.nameSample = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return specimenDS.getSpecimens(auth.authToken).then(function (data) {
        vm.listSpecimens = data.data === '' ? [] : _.filter(data.data, function (o) { return o.state; });
        vm.getfields();
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }


    function getfields() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return fieldDS.getFields(auth.authToken).then(function (data) {
        vm.lislengthfield = data.data === '' ? [] : _.filter(data.data, function (o) { return o.status === 1; });
        if (vm.lislengthfield.length === 0 || vm.listSpecimens.length === 0) {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** para sacar la ventana modal de requeridos**//
    function modalrequired() {
      if (vm.lislengthfield.length === 0 || vm.listSpecimens.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requeridtemplatemacrocopy.html',
          controller: 'subSampleDependenceController',
          inputs: {
            Specimens: vm.listSpecimens.length,
            field: vm.lislengthfield.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

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

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
          });
          vm.loadingdata = false;
        }
      }
      if (vm.nameRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }

    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var name = vm.nameSpecimen;
      var id = vm.selected;
      var i = 1;
      vm.listFieldsBySpecimen.forEach(function (value) {
        var order = _.find(vm.listFieldsOrder, function (o) { return o.id === value.id });
        if (value.selected) {
          datareport.push({
            'id': id,
            'name': value.name,
            'type': value.type,
            'order': order ? order.order : value.order ? value.order : i,
            'selected': value.selected,
            'specimen': name.toUpperCase(),
            'username': auth.userName
          });
          !order ? !value.order ? i++ : '' : '';
        }
      });
      datareport = $filter('orderBy')(datareport, 'order');
      if (vm.listFieldsBySpecimen.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/pathology/template/template.mrt';
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

    /** funcion inicial que se ejecuta cuando se carga el modulo */
    function init() {
      vm.view = 'R';
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

  //**modal para confirmar si se guarda el orden de los demograficos*//
  function validateorderController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }

  /** funcion inicial la modal para mostrar la modal de requridos*/
  function subSampleDependenceController($scope, Specimens, field, close) {
    $scope.Specimens = Specimens;
    $scope.field = field;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();

