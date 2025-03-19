/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                order               @descripción
                test                @descripción
                patientinformation  @descripción
                notes               @descripción
                photopatient        @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalresultsdelayed', modalresultsdelayed);

  modalresultsdelayed.$inject = ['moment','$filter'];
  /* @ngInject */
  function modalresultsdelayed(moment,$filter) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modalresultsdelayed.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        test: '=test',
        functionexecute: '=functionexecute',
        order: '=?order'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.selectOrder = selectOrder;


        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.TestSelect = $filter("filter")($scope.test, function (e) {
              if (e.validatedDate === undefined || e.validatedDate === null || e.validatedDate === '') {
                var a = moment();
                var b = moment(e.createDate);
                var minutes = a.diff(b, 'minutes');
                e.timetotal = minutes;
              } else {
                var a = moment(e.validatedDate);
                var b = moment(e.createDate);
                var minutes = a.diff(b, 'minutes');
                e.timetotal = minutes
              }
              return e.stateOportunity === 1;
            })
            if (vm.TestSelect.length === 0) {
              UIkit.modal('#nofound').show();
            } else {
              UIkit.modal('#resultsdelayed').show();
            }
          }
          $scope.openmodal = false;
        });

        function selectOrder(order) {
          $scope.order = order;
          setTimeout(function () {
            UIkit.modal('#resultsdelayed').hide();
            $scope.functionexecute();
          }, 100);
        }

      }],
      controllerAs: 'modalresultsdelayed'
    };
    return directive;

  }

})();
