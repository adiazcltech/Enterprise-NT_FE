/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal   @descripción
                detailerror @descripción
                idcontrol   @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/account/login/login.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/worklist/worklist.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/activationorder/activationorder.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/deletespecial/deletespecial.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyreassignment/historyreassignment.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/inconsistency/inconsistency.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  15.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
  16.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html
  17.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html
  18.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/takesample/takesample.html
  19.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/unlockorderhistory/unlockorderhistory.html
  20.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  21.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/patientconsultation/patientconsultation.html
  22.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  23.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  24.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/destinationsample/destinationsample.html
  25.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/earlywarning/earlywarning.html
  26.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/generalstadistics/generalstadistics.html
  27.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  28.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  29.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/planoWhonet/planoWhonet.html
  30.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html
  31.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/exception/exception.html
  32.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/traceability/traceability.html
  33.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalexceptions', modalexceptions);

  modalexceptions.$inject = ['$filter'];
  /* @ngInject */
  function modalexceptions($filter) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modal-exceptions.html',
      restrict: 'EA',
      scope: {
        openmodal: '=?openmodal',
        detailerror: '=?detailerror',
        idcontrol: '=?idcontrol'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.validated = validated;
        vm.modaldetail = modaldetail;
        vm.closemodaldatail = closemodaldatail;
        vm.idcontrol = '1';

        $scope.$watch('idcontrol', function () {
          if ($scope.idcontrol !== undefined) {
            vm.idcontrol = $scope.idcontrol;
          }
        });

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.validated();
          }
          $scope.openmodal = false;
        });

        function modaldetail() {
          UIkit.modal('#modal_full' + vm.idcontrol).show();
        }

        function closemodaldatail() {
          UIkit.modal('#errormodal' + vm.idcontrol).show();
        }

        function validated() {
          if ($scope.detailerror.status === 401 && $scope.detailerror.statusText === 'Token not valid') {
            UIkit.modal('#seccioncaducado').show();
          } 
          else if ($scope.detailerror.status === 401) {
            vm.detail = {
              'code': $scope.detailerror.status,
              'message': $scope.detailerror.statusText,
              'url': $scope.detailerror.config.url,
            };

            UIkit.modal('#errormodal' + vm.idcontrol).show();
          }
          else if ($scope.detailerror.code !== undefined) {
            vm.detail = {
              'code': $scope.detailerror.code,
              'message': $scope.detailerror.message,
              'url': $scope.detailerror.url,
              'detail': $scope.detailerror.detail
            };
            UIkit.modal('#errormodal' + vm.idcontrol).show();
          }
          else if (($scope.detailerror.data === undefined || $scope.detailerror.data === null) && $scope.detailerror.session !== true) {
            vm.detail = {
              'code': '404',
              'message': 'XMLHttpRequest no se puede cargar, la respuesta a la solicitud de preflight' +
                'no pasa la comprobación de control de acceso: No hay encabezado Access-Control-Allow-Origin ' +
                'presente en el recurso solicitado. Por lo tanto no se permite el acceso',
              'url': $scope.detailerror.config.url,
            };
            UIkit.modal('#errormodal' + vm.idcontrol).show();
          }
          else if ($scope.detailerror.data !== null) {
            vm.detail = {
              'code': $scope.detailerror.data.code,
              'message': $scope.detailerror.data.message,
              'url': $scope.detailerror.data.host + ' ' + $scope.detailerror.data.url,
              'detail': $scope.detailerror.data.detail
            };
            UIkit.modal('#errormodal' + vm.idcontrol).show();
          }
        }

      }],
      controllerAs: 'modalexceptions'
    };
    return directive;

  }

})();
