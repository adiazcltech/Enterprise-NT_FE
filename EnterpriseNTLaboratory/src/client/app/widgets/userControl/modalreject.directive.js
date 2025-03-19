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
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('modalreject', modalreject);

    modalreject.$inject = ['motiveDS', 'sampletrackingsDS', 'localStorageService', '$filter'];
    /* @ngInject */
    function modalreject(motiveDS, sampletrackingsDS, localStorageService, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-reject.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=order',
                sample: '=sample',
                dataordesample: '=dataordesample',
                functionexecute: '=functionexecute'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.getmotive = getmotive;
                vm.init = init;
                vm.Save = Save;
                vm.closerejectmodal = closerejectmodal;


                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        if (vm.typemotive !== undefined) {
                            vm.motive.id = -1;
                        }
                        vm.Comment = '';

                        if (vm.Listmotive.length > 0) {
                            UIkit.modal('#rejectmodal').show();
                        }
                        else {
                            UIkit.modal('#rejectmodalerror').show();
                        }

                    }
                    $scope.openmodal = false;
                });

                function getmotive() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return motiveDS.getmotive(auth.authToken).then(function (data) {
                        if (data.status === 200) {
                            vm.typemotive = data.data;
                            if (data.data.length !== 0) {
                                vm.motive = { id: -1 };
                                vm.Listmotive = $filter('filter')(vm.typemotive, { type: { id: 19 }, state: true });
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

                function Save() {
                    var reject = {
                        'comment': vm.Comment,
                        'motive': {
                            'id': vm.motive.id,
                            'name': vm.motive.name
                        }
                    };
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return sampletrackingsDS.samplerejection(auth.authToken, $scope.order, $scope.sample, reject).then(function (data) {
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

                function closerejectmodal() {
                    UIkit.modal('#rejectmodal').hide();
                }


                function init() {
                    vm.getmotive();

                }

                vm.init();

            }],
            controllerAs: 'modalreject'
        };
        return directive;

    }

})();
