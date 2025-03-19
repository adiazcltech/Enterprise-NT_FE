
/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('loadcomboboxrecepcion', loadcomboboxrecepcion);

    loadcomboboxrecepcion.$inject = ['$filter'];

    /* @ngInject */
    function loadcomboboxrecepcion($filter) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/generalControl/loadcomboboxrecepcion.html',
            scope: {
                change: '&',
                identifier: '=?identifier',
                listorigin: '=?listorigin',
                cleanselect: '=?cleanselect',
                placeholder: '=placeholder',
                ngModel: '=?ngModel',
                requerid: '=?requerid',
                ngDisabled: '=?ngDisabled',
                removeElement: '=?removeElement'

            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                vm.changelist = changelist;
                vm.fetch = fetch;
                vm.list = [];
                vm.requerid = false;
                vm.item = {};
                vm.identification = $scope.identifier === undefined ? 'loadcomboboxrecepcion' : $scope.identifier;

                $scope.$watch('listorigin', function () {

                    var removeElement = $scope.removeElement === undefined || $scope.removeElement === true ? true : false

                    vm.listorigin = $scope.listorigin;
                    vm.placeholder = $filter('translate')($scope.placeholder);

                    if ($scope.ngModel !== undefined && $scope.ngModel !== null) {
                        if ($scope.ngModel.selected !== undefined) {
                            $scope.ngModel.selected = $scope.ngModel
                        }
                    }
                    if (vm.listorigin.length > 0 && removeElement === true) {
                        var listresume = []

                        _.forEach($scope.listorigin, function (value) {
                            var element = {};
                            element.id = value.id;
                            element['patientId'] = value['patientId'];
                            element['name'] = value['name'];
                            element['idDonor'] = value['idDonor'];
                            listresume.push(element)
                        });
                        vm.listorigin = listresume;
                    }

                });

                $scope.$watch('ngModel', function () {
                    if (vm.item !== undefined) {
                        vm.item.selected = $scope.ngModel
                    }
                });


                $scope.$watch('requerid', function () {
                    if ($scope.requerid !== undefined) {
                        vm.requerid = $scope.requerid;
                    }
                });


                $scope.$watch('ngDisabled', function () {
                    vm.disabled = $scope.ngDisabled;
                });



                function changelist($item) {
                    $scope.ngModel = vm.item.selected;
                    setTimeout(function () {
                        $scope.change({ item: $item })
                        if ($scope.cleanselect) {
                            vm.item = undefined;
                        }
                    }, 100);
                }

                function fetch($select, $event, id) {
                    if (vm.listorigin !== undefined) {
                        if ($event) {
                            vm.limit = vm.limit + 50;
                            var prueba = _.clone(vm.listorigin);
                            vm.list = prueba.splice(0, vm.limit);
                            $event.stopPropagation();
                            $event.preventDefault();

                        } else {

                            if ($select.search !== '') {
                                var prueba = _.clone(vm.listorigin);
                                vm.list = $filter('filter')(vm.listorigin, $select.search);
                                if (vm.list.length > 50) {
                                    vm.limit = 50;
                                    vm.list = vm.list.splice(0, vm.limit);
                                }
                            }
                            else {
                                if (vm.listorigin.length > 50) {
                                    vm.list = [];
                                    vm.limit = 50;
                                    var prueba = _.clone(vm.listorigin);
                                    vm.list = vm.listorigin === undefined ? [] : prueba.splice(0, vm.limit);
                                }
                                else {
                                    vm.list = vm.listorigin;
                                }

                            }
                        }
                    }
                }
            }],
            controllerAs: 'loadcomboboxrecepcion'
        };
        return directive;
    }
})();
/* jshint ignore:end */

