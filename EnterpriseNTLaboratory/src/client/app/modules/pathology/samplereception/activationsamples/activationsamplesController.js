/* jshint ignore:start */
(function() {
  'use strict';

  angular
      .module('app.activationsamples')
      .controller('activationsamplesController', activationsamplesController);

  activationsamplesController.$inject = [
      'localStorageService',
      'logger',
      'caseDS',
      '$filter',
      '$state',
      '$rootScope',
      'LZString',
      '$translate'
  ];

  function activationsamplesController(
      localStorageService,
      logger,
      caseDS,
      $filter,
      $state,
      $rootScope,
      LZString,
      $translate
  ) {

      //Variables generales
      var vm = this;
      $rootScope.menu = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      $rootScope.helpReference = '08.Pathology/activationsamples.htm';
      $rootScope.NamePage = $filter('translate')('3142');
      vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
      vm.format = localStorageService.get('FormatoFecha').toUpperCase();
      vm.filterRange = '1';
      vm.rangeInit = '';
      vm.rangeEnd = '';
      vm.button = false;
      vm.search = search;
      vm.listSamples = [];
      vm.isOpenReport = true;
      vm.selectallcheck = selectallcheck;
      vm.changecheck = changecheck;
      vm.save = save;
      vm.generateFile = generateFile;
      vm.windowOpenReport = windowOpenReport;
      vm.cleanlist = cleanlist;
      vm.modalError = modalError;
      vm.isAuthenticate = isAuthenticate;
      vm.init = init;

      //Limpia la lista cuando cambia de número de orden a fecha de la muestra
        function cleanlist() {
          vm.listSamples = [];
      }

      //Método para activar las muestras seleccionadas
      function save() {
        vm.loadingdata = true;
        vm.Allcheck = false;
        vm.rejectList = $filter('filter')(vm.listSamples, { check: true });
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return caseDS.activeSamples(auth.authToken, vm.rejectList).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
                vm.listSamples = [];
                logger.success($filter('translate')('3150'));
            }
            vm.search();
        },
        function (error) {
            if (error.data === null) {
                vm.modalError(error);
            }
        });
      }

      // Funcion que busca las ordenes que cumplan con el filtro
      function search() {
        var consult = {
            "rangeType": vm.filterRange === '0' ? '3' : vm.filterRange,
            "init": vm.rangeInit,
            "end": vm.rangeEnd,
            "basic": true
        }
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.loadingdata = true;
        return caseDS.getRejectSamples(auth.authToken, consult).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
                vm.listSamples = data.data.length === 0 ? data.data : removeData(data);
                vm.isOpenReport = false;
                console.log('vm.listSamples', vm.listSamples);
            } else {
                vm.isOpenReport = true;
                vm.listSamples = [];
                logger.success($filter('translate')('3149'));
            }
        },
        function (error) {
            if (error.data === null) {
                vm.modalError(error);
            }
        });
      }

      //** Método  para imprimir el reporte**//
      function generateFile() {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.variables = {
            'date': moment().format(vm.formatDate),
            'rangeInit': vm.filterRange.toString() === '1' ? $filter('translate')('0073') + ': ' + vm.rangeInit : $filter('translate')('0075') + ': ' + moment(vm.rangeInit).format(vm.format),
            'rangeEnd': vm.filterRange.toString() === '1' ? $filter('translate')('0074') + ': ' + vm.rangeEnd : $filter('translate')('0076') + ': ' + moment(vm.rangeEnd).format(vm.format),
            'total': vm.listSamples.length
        }
        vm.datareport = vm.listSamples;
        vm.pathreport = '/Report/pathology/pre-analitic/activatesamples/activatesamples.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
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

      //Método que muestra un popup para la confirmación de la activación
      function changecheck() {
        UIkit.modal("#confirmation").show();
      }

      // Cambia el valor de los ckecks
      function selectallcheck() {
        if (vm.listSamples.length > 0) {
            vm.listSamples.forEach(function (value, key) {
                vm.listSamples[key].check = vm.Allcheck;
            });
        }
      }

      //** Metodo que elimina los elementos sobrantes en la grilla**//
      function removeData(data) {
        data.data.forEach(function (value, key) {
          data.data[key].study = value.studyType.name;
          data.data[key].orderNumber = value.orderNumber;
          data.data[key].patientId = value.patientId
          data.data[key].name = value.name1 + " " + value.name2 == undefined ? "" : value.name2;
          data.data[key].lastName = value.lastName;
          data.data[key].username = value.userCreated.name + " " + value.userCreated.lastName;
          data.data[key].datedeleted = moment(value.createdAt).format(vm.formatDate);
          data.data[key].reasondeleted = value.motive.name === null ? '' : value.motive.name;
        });
        return data.data;
      }

      //** Método para sacar el popup de error**//
      function modalError(error) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }

      function isAuthenticate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (auth === null || auth.token) {
              $state.go('login');
          } else {
              vm.init();
          }
      }

      function init() {
      }

      vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
