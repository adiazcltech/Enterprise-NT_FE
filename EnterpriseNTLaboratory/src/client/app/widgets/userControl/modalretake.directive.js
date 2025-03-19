/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal       @descripción
                order           @descripción
                sample          @descripción    
                dataordesample  @descripción
                functionexecute @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('modalretake', modalretake);

    modalretake.$inject = ['motiveDS', 'sampletrackingsDS', 'localStorageService', '$filter'];
    /* @ngInject */
    function modalretake(motiveDS, sampletrackingsDS, localStorageService, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-retake.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=?order',
                sample: '=sample',
                dataordesample: '=dataordesample',
                functionexecute: '=functionexecute'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.getmotivepostponement = getmotivepostponement;
                vm.selectall = selectall;
                vm.init = init;
                vm.getest = getest;
                vm.Savepostponement = Savepostponement;

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        if (vm.typemotive !== undefined) {
                            vm.motive.id = -1;
                        }
                        vm.Comment = '';
                        vm.selectAllcheck = false;
                        vm.getest();
                        UIkit.modal('#postponementmodal').show();
                    }
                    $scope.openmodal = false;
                });

                function getmotivepostponement() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return motiveDS.getmotive(auth.authToken).then(function (data) {
                        if (data.status === 200) {
                            vm.typemotive = data.data;
                            if (data.data.length !== 0) {
                                vm.motive = { id: -1 };
                                vm.Listmotive = $filter('filter')(vm.typemotive, { type: { id: 21 } });
                            }

                        }

                    }, function (error) {
                        if (error.data === null) {
                            vm.errorservice = vm.errorservice + 1;
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    });
                }

                function selectall() {
                    if (vm.Detail.tests.length > 0) {
                        vm.Detail.tests.forEach(function (value, key) {
                            vm.Detail.tests[key].select = vm.selectAllcheck;

                        });
                    }
                }

                function getest() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    if ($scope.order !== undefined) {
                        return sampletrackingsDS.sampleorder(auth.authToken, $scope.order).then(function (data) {
                            if (data.status === 200) {
                                vm.Detail = ($filter('filter')(data.data, { codesample: $scope.sample }, true))[0];
                                vm.Detail.tests.forEach(function (value, key) {
                                    vm.Detail.tests[key].select = value.result.sampleState === 1 ? false : true;
                                });
                            }
                        }, function (error) {
                            if (error.data === null) {
                                vm.errorservice = vm.errorservice + 1;
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                        });
                    }
                }

                function Savepostponement() {
                    vm.assignadetest = $filter('filter')(vm.Detail.tests, { select: true });

                    var postponement = {
                        'comment': vm.Comment,
                        'test': vm.assignadetest,
                        'motive': {
                            'id': vm.motive.id,
                            'name': vm.motive.name
                        }
                    };

                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return sampletrackingsDS.sampleretake(auth.authToken, $scope.order, $scope.sample, postponement).then(function (data) {
                        if (data.status === 200) {
                            $scope.dataordesample = data.data;
                            setTimeout(function () {
                                $scope.functionexecute();
                            }, 100);

                        }
                    }, function (error) {
                        if (error.data === null) {
                            vm.errorservice = vm.errorservice + 1;
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    });
                }

                function init() {
                    vm.getmotivepostponement();

                }

                vm.init();

            }],
            controllerAs: 'modalpostponement'
        };
        return directive;

    }

})();
