/*Se encontaron directivas en:
    
*/
/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   statevalue @descripcion
                teststate  @descripcion 
    
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultsorderstate', resultsorderstate);

    resultsorderstate.$inject = [];

    /* @ngInject */
    function resultsorderstate() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-orderstate.html',
            scope: {
                statevalue: '=?statevalue',
                teststate: '=?teststate'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                $scope.$watch('statevalue', function () {
                    vm.progress = 50;
                    vm.statevalue = $scope.statevalue;
                    vm.teststate = $scope.teststate;
                });
            }],
            controllerAs: 'vmd'
        };
        return directive;
    }
})();
/* jshint ignore:end */