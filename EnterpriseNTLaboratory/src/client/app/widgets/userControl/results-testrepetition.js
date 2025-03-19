
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultstestrepetition', resultstestrepetition);

    resultstestrepetition.$inject = ['$filter', 'motiveDS', 'localStorageService'];

    /* @ngInject */
    function resultstestrepetition($filter, motiveDS, localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testrepetition.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                functionexecute: '=functionexecute',
                motive: '=?motive',
                orderdemo: '=?orderdemo',
                comment: '=?comment'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.save = save;
                vm.viewcomment = false;
                vm.closemodaltestrepetition = closemodaltestrepetition;
                vm.getRepetitionMotives = getRepetitionMotives;



                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.loadingdata = true;
                        vm.selectedMotive = null;
                        vm.reasonComment = '';
                        vm.order = $scope.order;
                        vm.testId = $scope.idtest;
                        vm.orderdemo = $scope.orderdemo;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.getRepetitionMotives();

                        $scope.openmodal = false;
                    }
                });

                /**
                  Funcion  Obtiene la lista de motivos para la repetición del resultado de los exámenes
                  @author  jblanco
                  @return  Lista de motivos
                  @version 0.0.1
                */
                function getRepetitionMotives() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return motiveDS.getMotiveByState(auth.authToken, true).then(function (data) {
                        if (data.status === 200) {
                            vm.repetitionMotives = $filter('filter')(data.data, { type: { id: '18' } });
                            if (vm.repetitionMotives.length === 0) {
                                UIkit.modal('#rs-modal-advertencia').show();
                                vm.loadingdata = false;

                            } else {
                                vm.viewcomment = true;
                                vm.loadingdata = false;
                                UIkit.modal('#rs-modal-testrepetition').show();
                            }

                        } else {
                            UIkit.modal('#rs-modal-advertencia').show();
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
                function closemodaltestrepetition() {
                    UIkit.modal('#rs-modal-testrepetition').hide();
                }
            }],
            controllerAs: 'resultstestrepetition'
        };
        return directive;
    }
})();
/* jshint ignore:end */


