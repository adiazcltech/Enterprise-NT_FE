
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultstestedit', resultstestedit);

    resultstestedit.$inject = ['$filter', 'motiveDS', 'localStorageService'];

    /* @ngInject */
    function resultstestedit($filter, motiveDS, localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testedit.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                functionexecute: '=functionexecute',
                functionexecutecancel: '=functionexecutecancel',
                motive: '=?motive',
                comment: '=?comment',
                functioncancel: '=functioncancel'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');

                vm.save = save;
                vm.closemodaltestEdit = closemodaltestEdit;
                vm.getEditMotives = getEditMotives;

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.loadingdata = true;
                        vm.selectedMotive = null;
                        vm.reasonComment = '';
                        vm.order = $scope.order;
                        vm.testId = $scope.idtest;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.getEditMotives();

                        $scope.openmodal = false;
                    }
                });

                /**
                  Funcion  Obtiene la lista de motivos para la repetición del resultado de los exámenes
                  @author  jblanco
                  @return  Lista de motivos
                  @version 0.0.1
                */
                function getEditMotives() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return motiveDS.getMotiveByState(auth.authToken, true).then(function (data) {
                        if (data.status === 200) {
                            vm.editMotives = $filter('filter')(data.data, { type: { id: '17' } });
                            if (vm.editMotives.length === 0) {
                                UIkit.modal('#rs-modal-advertencia-resultedit').show();
                                setTimeout(function () { $scope.functioncancel(); }, 1000);
                                vm.loadingdata = false;

                            } else {
                                vm.loadingdata = false;
                                UIkit.modal('#rs-modal-testedit').show();
                            }

                        } else {
                            UIkit.modal('#rs-modal-advertencia-resultedit').show();
                            vm.loadingdata = false;
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }


                function save() {
                    $scope.motive = vm.selectedMotive;
                    $scope.comment = vm.reasonComment;
                    setTimeout(function () {
                        $scope.functionexecute();
                    }, 1000);

                }

                function closemodaltestEdit() {
                    vm.loadingdata=true;
                    UIkit.modal('#rs-modal-testedit').hide();
                    setTimeout(function () {
                        $scope.functionexecutecancel();
                        vm.loadingdata=false;
                    }, 1000);
                }

            }],
            controllerAs: 'resultstestedit'
        };
        return directive;
    }
})();
/* jshint ignore:end */


