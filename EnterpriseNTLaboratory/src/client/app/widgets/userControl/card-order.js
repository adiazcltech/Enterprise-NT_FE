/*  Se encontro la directiva en: 
    simpleverification.html:
*/

/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   order           @descripción
                typeordercolor  @descripción
                typeordercode   @descripción
                testcode        @descripción
                testname        @descripción        

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/

(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('cardorder', cardorder);

    cardorder.$inject = ['localStorageService'];

    /* @ngInject */
    function cardorder(localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/card-order.html',
            scope: {
                order: '=?order',
                typeordercolor: '=?typeordercolor',
                typeordercode: '=?typeordercode',
                testcode: '=?testcode',
                testname: '=?testname'
            },

            controller: ['$scope', function($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.numerOrder = localStorageService.get('OrdencompletaRegistroResultados') === 'True' ? 0 : 3;    

                $scope.$watch('order', function() {
                    if ($scope.order) {
                        vm.order = $scope.order.toString().substring(vm.numerOrder);
                        vm.typeordercolor = $scope.typeordercolor;
                        vm.typeordercode = $scope.typeordercode;
                        vm.testname = $scope.testname;
                        vm.testcode = $scope.testcode;
                    }
                });

                $scope.$watch('testcode', function() {
                    if ($scope.testcode) {
                        vm.order = $scope.order.toString().substring(vm.numerOrder);
                        vm.typeordercolor = $scope.typeordercolor;
                        vm.typeordercode = $scope.typeordercode;
                        vm.testname = $scope.testname;
                        vm.testcode = $scope.testcode;
                    }
                });
            }],
            controllerAs: 'cardorder'
        };
        return directive;
    }
})();