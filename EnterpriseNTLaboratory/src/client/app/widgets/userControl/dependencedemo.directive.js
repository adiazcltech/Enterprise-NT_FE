/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ... 
  PARAMETROS:   iddb        @descripción
                order       @descripción
                datadependencedemo @descripción
                heightline  @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN: 
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/account/userprofile/userprofile.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/activationorder/activationorder.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/deletespecial/deletespecial.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historydependencedemo/historydependencedemo.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyreassignment/historyreassignment.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/inconsistency/inconsistency.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html
  15.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html
  16.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  17.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  18.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  19.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/destinationsample/destinationsample.html
  20.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('dependencedemo', dependencedemo);
  dependencedemo.$inject = ['localStorageService', '$filter', '$state'];
  /* @ngInject */
  function dependencedemo(localStorageService, $filter, $state) {
    var directive = {
      templateUrl: 'app/widgets/userControl/dependencedemo.html',
      restrict: 'EA',
      scope: {
        listdemographics: '=listdemographics',
        listdemographics2: '=listdemographics2',
        demographictotal: '=demographictotal'

      },
      controller: ['$scope', function ($scope) {
        var vm = this;

        //Variables de la directiva que no se muestran en la vista
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.dependences = [];
        vm.modal = UIkit.modal('#dependencemodal', { modal: false, keyboard: false, bgclose: false, center: true });

        //Metodos de la directiva
        vm.imageDemographics = imageDemographics;
        vm.cancel = cancel;
        vm.demographicTotal = $scope.demographictotal === undefined ? false : $scope.demographictotal;


        $scope.$watch('listdemographics', function () {
          vm.dependences = [];
          if ($scope.listdemographics.length > 0) {
            $scope.listdemographics.forEach(function (value) {
              if (value.encoded && value.items.length === 0 && value.obligatory === 1) {
                var image = vm.imageDemographics(value.id, value.origin);
                vm.dependences.push({
                  'image': image,
                  'name': value.name.toUpperCase(),
                  'origin': value.origin === 'H' ? $filter('translate')('0117') : $filter('translate')('0110')
                });
              }
            });
            if (vm.dependences.length > 0 && !vm.demographicTotal) {
              vm.modal.show();
            }
          }
        });

        $scope.$watch('listdemographics2', function () {
          // var listDemographics = [];
          // if ($scope.listdemographics2.length !== undefined){
          //     listDemographics = Object.assign($scope.listdemographics, $scope.listdemographics2);
          // }else{
          //    listDemographics = $scope.listdemographics;
          // }

          if ($scope.listdemographics2.length > 0) {
            $scope.listdemographics2.forEach(function (value) {
              if (value.encoded && value.items.length === 0 && value.obligatory === 1) {
                var image = vm.imageDemographics(value.id, value.origin);
                vm.dependences.push({
                  'image': image,
                  'name': value.name.toUpperCase(),
                  'origin': value.origin === 'H' ? $filter('translate')('0117') : $filter('translate')('0110')
                });
              }
            });
            if (vm.dependences.length > 0) {
              vm.modal.show();
            }
          }
        });
        /** 
         * Funcion para devolver las imágenes de cada demográfico
        */
        function imageDemographics(id, origin) {
          var image = origin === 'H' ? 'images/patient/demo.png' : 'images/order/demo.png';
          switch (id) {
            case -1: return 'images/order/customer.png'; break; //Cliente
            case -2: return 'images/order/physician.png'; break; //Médico
            case -3: return 'images/order/rate.png'; break; //Tarifa
            case -4: return 'images/order/totalorder.png'; break; //Tipo de orden
            case -5: return 'images/order/branch.png'; break; //Sede
            case -6: return 'images/order/service.png'; break; //Servicio
            case -7: return 'images/patient/race.png'; break; //Raza
            case -10: return 'images/patient/documenttype.png'; break; //Tipo de documento
            case -104: return 'images/patient/genders.png'; break; //Género
            default: return image;
          }
        }

        function cancel() {
          vm.modal.hide();
          $state.go('dashboard');
        }



      }],
      controllerAs: 'dependencedemo'
    };
    return directive;
  }
})();
/* jshint ignore:end */