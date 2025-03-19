(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('cardordersample', cardordersample);
    cardordersample.$inject = ['localStorageService', '$filter'];
    /* @ngInject */
    function cardordersample(localStorageService, $filter) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/card-ordersample.html',
            scope: {
                order: '=?order',
                typeordercolor: '=?typeordercolor',
                typeordercode: '=?typeordercode',
                samplename: '=samplename',
                listsamples: '=listsamples',
                active: '=?active',
                multiple: '=?multiple',
                functionexecute: '=functionexecute',
                sample: '=sample',
                changuemodel: '=changuemodel',
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.numerOrder = localStorageService.get('OrdencompletaRegistroResultados') === 'True' ? 0 : 3;    
                vm.getSelectSample = getSelectSample;

                $scope.$watch('active', function () {
                    vm.order = $scope.order !== undefined ? $scope.order.toString().substring(vm.numerOrder) : null;
                    vm.typeordercolor = $scope.typeordercolor;
                    vm.typeordercode = $scope.typeordercode;
                    if ($scope.active) {
                        vm.typeordercolor = $scope.typeordercolor;
                        vm.typeordercode = $scope.typeordercode;
                        vm.samplename = $scope.samplename;
                        vm.multiple = $scope.multiple === undefined ? false : $scope.multiple;
                        vm.listsamples = $scope.listsamples === undefined ? [] : $scope.listsamples;
                        if (vm.listsamples.length > 0) {
                            vm.sampleId = vm.listsamples[0];
                        }
                    }
                    $scope.active = false;
                });
                function getSelectSample(sample) {
                    if (sample !== undefined) {
                        $scope.sample = sample.id;
                    }
                    return $scope.sample;
                }
                $scope.$watch('sample', function () {
                    if ($scope.changuemodel === true) {
                        if ($scope.sample !== undefined) {
                            if (vm.listsamples.length !== 0) {
                                vm.sampleId = $filter('filter')(vm.listsamples, {
                                    id: parseInt($scope.sample)
                                }, true)[0];
                            }
                            $scope.changuemodel = false;
                        }
                    } else {
                        $scope.functionexecute();
                    }
                });
            }],
            controllerAs: 'cardordersample'
        };
        return directive;
    }
})();
/* jshint ignore:end */

