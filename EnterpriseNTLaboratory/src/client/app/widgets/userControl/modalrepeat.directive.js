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
    .directive('modalrepeat', modalrepeat);

  modalrepeat.$inject = ['repeatsDS', 'testDS', 'localStorageService'];
  /* @ngInject */
  function modalrepeat(repeatsDS, testDS, localStorageService) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modal-repeat.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        order: '=?order',
        test: '=test',
        patientinformation: '=patientinformation',
        notes: '=notes',
        orderdemo: '=?orderdemo',
        photopatient: '=photopatient'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getest = getest;
        vm.getrepeats = getrepeats;
        vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
        vm.viewcomment = false;


        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.getest();
            vm.getrepeats();
            vm.order = $scope.order;
            vm.orderdemo = $scope.orderdemo;
            vm.testId = $scope.test;
            vm.patient = $scope.patientinformation;
            vm.photopatient = $scope.photopatient;
            vm.notes = $scope.notes === undefined ? [] : $scope.notes;
            vm.viewcomment = true;
            UIkit.modal('#repeatmodal').show();
          }
          $scope.openmodal = false;
        });

        function getrepeats() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return repeatsDS.getrepeats(auth.authToken, $scope.order, $scope.test).then(function (data) {
            if (data.status === 200) {
              vm.repeats = data.data;
            } else {
              vm.repeats = [];
            }

          }, function (error) {

          });
        }

        function getest() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return testDS.getTestById(auth.authToken, $scope.test).then(function (data) {
            if (data.status === 200) {
              vm.TestSelect = data.data;
            }
          }, function (error) {

          });
        }

      }],
      controllerAs: 'modalrepeat'
    };
    return directive;

  }

})();
