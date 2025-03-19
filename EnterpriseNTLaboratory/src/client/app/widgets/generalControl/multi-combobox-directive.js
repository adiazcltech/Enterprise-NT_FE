/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('multicombobox', multicombobox);

    multicombobox.$inject = ['$filter', 'localStorageService', 'logger'];

    /* @ngInject */
    function multicombobox($filter, localStorageService, logger) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/generalControl/multi-combobox-directive.html',
            scope: {
                change: '&',
                removeitem: '&',
                listorigin: '=?listorigin',
                cleanselect: '=?cleanselect',
                placeholder: '=placeholder',
                ngModel: '=?ngModel',
                ngDisabled: '=?ngDisabled',
                fieldCode: '=?fieldCode',
                fieldName: '=?fieldName',
                removeElement: '=?removeElement'

            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                vm.changelist = changelist;
                vm.removed = removed;
                vm.fetch = fetch;
                vm.list = [];
                vm.item = {};

                $scope.$watch('listorigin', function () {

                    var removeElement = $scope.removeElement === undefined || $scope.removeElement === true ? true : false

                    vm.listorigin = $scope.listorigin;
                    vm.placeholder = $filter('translate')($scope.placeholder);
                    vm.fieldCode = $scope.fieldCode === undefined ? 'code' : $scope.fieldCode;
                    vm.fieldName = $scope.fieldName === undefined ? 'name' : $scope.fieldName;
                    vm.fieldBank = 'bank';
                    vm.fieldCard = 'card';

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
                            element[vm.fieldCode] = value[vm.fieldCode];
                            element[vm.fieldName] = value[vm.fieldName];
                            element[vm.fieldBank] = value[vm.fieldBank];
                            element[vm.fieldCard] = value[vm.fieldCard];
                            element['number'] = value['number'];
                            element['adjustment'] = value['adjustment'];
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

                $scope.$watch('ngDisabled', function () {
                    vm.disabled = $scope.ngDisabled;
                });



                function removed($item) {
                    $scope.ngModel = vm.item.selected;
                    $scope.removeitem({ item: $item })
                }

                function changelist($item) {
                    $scope.ngModel = vm.item.selected;
                    setTimeout(function () {

                        $scope.change({ item: $item })
                        if ($scope.cleanselect) {
                            vm.item = undefined;
                        }
                    }, 200);
                }

                function fetch($select, $event, id) {


                    if (vm.listorigin !== undefined) {


                        if ($event) {
                            vm.limit = vm.limit + 50;
                            var prueba = JSON.parse(JSON.stringify(vm.listorigin));
                            vm.list = prueba.splice(0, vm.limit);
                            $event.stopPropagation();
                            $event.preventDefault();

                        } else {

                            if ($select.search !== '') {
                                var prueba = JSON.parse(JSON.stringify(vm.listorigin));
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
                                    var prueba = JSON.parse(JSON.stringify(vm.listorigin));
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
            controllerAs: 'multicombobox'
        };
        return directive;
    }
})();
/* jshint ignore:end */

