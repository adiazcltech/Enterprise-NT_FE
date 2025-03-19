/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                 
  AUTOR:        @autor
  FECHA:        2018-10-10
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderentry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('entryinformationtest', entryinformationtest);

  entryinformationtest.$inject = ['$filter', 'localStorageService', 'orderDS', 'testDS'];

  /* @ngInject */
  function entryinformationtest($filter, localStorageService, orderDS, testDS) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/entry-informationtest.html',
      scope: {
        openmodal: '=?openmodal'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.formatDate = localStorageService.get('FormatoFecha');
        $scope.openmodal = false;

        vm.getTest = getTest;
        vm.testChanged = testChanged;

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.testselected = null;
            vm.getTest();
          }
          $scope.openmodal = false;
        });

        function getTest() {
          orderDS.getTestToOrderEntry(auth.authToken).then(function (response) {
            vm.listtest = response.data;
            vm.listtest = vm.listtest.sort(function (a, b) {
              if (a.code.trim().length > b.code.trim().length) {
                return 1;
              } else if (a.code.trim().length < b.code.trim().length) {
                return -1;
              } else {
                return 0;
              }
            });
            UIkit.modal('#modalinformationtest').show();
          });
        }

        function testChanged(selected) {
          vm.detailtest = null;

          if (selected.hasOwnProperty('originalObject') && selected.hasOwnProperty('title')) {

            testDS.getTestByIdType(auth.authToken, selected.originalObject.id, selected.originalObject.testType).then(function (response) {
              vm.detailtest = response.data;
              vm.detailtest.typeTest = selected.originalObject.testType;
              vm.detailtest.techniquename = vm.detailtest.technique === undefined ? 'N/A' : vm.detailtest.technique.id === 0 ? 'N/A' : vm.detailtest.technique.name;
              vm.detailtest.unitname = vm.detailtest.unit === undefined ? 'N/A' : vm.detailtest.unit.name;
              vm.detailtest.namegender = $filter('translate')('0000') === 'enUsa' ? vm.detailtest.gender.enUsa : vm.detailtest.gender.esCo;
              vm.detailtest.unitAgename = vm.detailtest.unitAge === 1 ? $filter('translate')('0103') : $filter('translate')('0476');
              vm.detailtest.automaticResult = vm.detailtest.automaticResult === '' ? 'N/A' : vm.detailtest.automaticResult;
              vm.detailtest.rangeage = vm.detailtest.minAge + ' - ' + vm.detailtest.maxAge + ' ' + vm.detailtest.unitAgename;
              vm.detailtest.resultTypeName = vm.detailtest.unitAge === 1 ? $filter('translate')('0496') : $filter('translate')('0648');
              vm.detailtest.requirements = _.filter(vm.detailtest.requirements, function (item) { return item.selected === true; });
              vm.detailtest.processingDaysMonday = vm.detailtest.processingDays.indexOf('1') > -1;
              vm.detailtest.processingDaysTuesday = vm.detailtest.processingDays.indexOf('2') > -1;
              vm.detailtest.processingDaysWednesday = vm.detailtest.processingDays.indexOf('3') > -1;
              vm.detailtest.processingDaysThursday = vm.detailtest.processingDays.indexOf('4') > -1;
              vm.detailtest.processingDaysFriday = vm.detailtest.processingDays.indexOf('5') > -1;
              vm.detailtest.processingDaysSaturday = vm.detailtest.processingDays.indexOf('6') > -1;
              vm.detailtest.processingDaysSunday = vm.detailtest.processingDays.indexOf('7') > -1;
              if (selected.originalObject.testType !== 0) {
                vm.detailtest.listSample = [];
                vm.detailtest.tests = _.uniqBy(vm.detailtest.tests, 'id');
                vm.detailtest.tests.forEach(function (value) {
                  if (value.listSample !== undefined) {
                    vm.detailtest.listSample.push({ 'id': value.listSample[0].id, 'name': value.listSample[0].name });
                  }
                });
                vm.detailtest.listSample = _.uniqBy(vm.detailtest.listSample, 'id');
              }
            });
          }

        }

      }],
      controllerAs: 'entryinformationtest'
    };
    return directive;
  }
})();
/* jshint ignore:end */
