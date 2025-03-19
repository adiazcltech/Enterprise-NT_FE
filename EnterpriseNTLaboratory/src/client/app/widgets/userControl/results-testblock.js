/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                patientinformation  @descripción
                photopatient        @descripción
                order               @descripción
                testcode            @descripción
                testname            @descripción
                functionexecute     @descripción
                motive              @descripción
                comment:            @descripción
    
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
        .directive('resultstestblock', resultstestblock);

    resultstestblock.$inject = ['$filter', 'motiveDS', 'localStorageService', '$timeout'];

    /* @ngInject */
    function resultstestblock($filter, motiveDS, localStorageService, $timeout) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testblock.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                functionexecute: '=functionexecute',
                motive: '=?motive',
                comment: '=?comment',
                orderdemo: '=?orderdemo',
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');

                vm.save = save;
                vm.closemodaltestblock = closemodaltestblock;
                vm.getBlockMotives = getBlockMotives;

                vm.getBlockMotives();

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.selectedMotive = null;
                        vm.reasonComment = '';
                        vm.order = $scope.order;
                        vm.testId = $scope.idtest;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.orderdemo = $scope.orderdemo;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        UIkit.modal('#rs-modal-testblock').show();
                        $scope.openmodal = false;
                    }
                });

                $scope.$watch('motive', function () {
                });

                $scope.$watch('comment', function () {
                });

                /**
                  Funcion  Obtiene la lista de motivos para el bloqueo de la prueba
                  @author  jblanco
                  @return  Lista de motivos
                  @version 0.0.1
                */
                function getBlockMotives() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');

                    return motiveDS.getMotiveByState(auth.authToken, true).then(function (data) {
                        if (data.status === 200) {
                            vm.blockMotives = $filter('filter')(data.data, { type: { id: '23' } });
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }

                function save() {
                    $scope.motive = vm.selectedMotive;
                    $scope.comment = vm.reasonComment;
                    $timeout(function () {
                        $scope.functionexecute();
                    });
                }

                function closemodaltestblock() {
                    UIkit.modal('#rs-modal-testblock').hide();
                }

            }],
            controllerAs: 'resultstestblock'
        };
        return directive;
    }
})();
/* jshint ignore:end */
