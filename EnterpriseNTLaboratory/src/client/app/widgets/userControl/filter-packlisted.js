/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   id                    @descripción
                disabled              @descripción
                filterlisted          @descripción
                ispackage             @descripción
                viewpackage           @descripción
                viewlistednormal      @descripción
                viewlistedareas       @descripción
                viewlistedtests       @descripción
                viewlistedsamples     @descripción
                viewlistedcontainers  @descripción
                viewlistednotgroup    @descripción
 
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('filterpacklisted', filterpacklisted);

  filterpacklisted.$inject = ['$q', '$filter', 'localStorageService'];

  /* @ngInject */
  function filterpacklisted($q, $filter, localStorageService) {
    var directive = {
      restrict: 'EA',

      templateUrl: 'app/widgets/userControl/filter-packlisted.html',

      scope: {
        id: '=id',
        disabled: '=?disabled',
        filterlisted: '=filterlisted',
        ispackage: '=?ispackage',
        viewpackage: '=?viewpackage',
        viewlistednormal: '=?viewlistednormal',
        viewlistedareas: '=?viewlistedareas',
        viewlistedtests: '=?viewlistedtests',
        viewlistedsamples: '=?viewlistedsamples',
        viewlistedcontainers: '=?viewlistedcontainers',
        viewlistednotgroup: '=?viewlistednotgroup'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.clickFilterListed = clickFilterListed;
        $scope.filterlisted = 0;
        vm.checkPackage = checkPackage;
        $scope.ispackage = false;
        vm.id = $scope.id === undefined ? '' : $scope.id;
        vm.viewPackage = $scope.viewpackage === undefined ? true : $scope.viewpackage;
        vm.viewListedNormal = $scope.viewlistednormal === undefined ? true : $scope.viewlistednormal;
        vm.viewListedAreas = $scope.viewlistedareas === undefined ? true : $scope.viewlistedareas;
        vm.viewListedTests = $scope.viewlistedtests === undefined ? true : $scope.viewlistedtests;
        vm.viewListedSamples = $scope.viewlistedsamples === undefined ? true : $scope.viewlistedsamples;
        vm.viewListedContainers = $scope.viewlistedcontainers === undefined ? true : $scope.viewlistedcontainers;
        vm.viewListedNotGroup = $scope.viewlistednotgroup === undefined ? true : $scope.viewlistednotgroup;

        $scope.$watch('disabled', function () {
          vm.disabled = $scope.disabled;
          if (vm.disabled) {
            $scope.filterlisted = 1;
            document.getElementById('filterListeds_1' + vm.id).checked = true;
          }
          $scope.disabled = false;
        });

        //$scope.$watch('')

        function checkPackage() {
          $scope.ispackage = vm.isPackage;
        }

        function clickFilterListed(filter) {
          $scope.filterlisted = filter;
        }

      }],
      controllerAs: 'filterpacklisted'
    };
    return directive;
  }
})();
/* jshint ignore:end */


