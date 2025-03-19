
/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('loadcombobox', loadcombobox);

    loadcombobox.$inject = ['$filter'];

    /* @ngInject */
    function loadcombobox($filter) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/generalControl/loadcombobox-directive.html',
            scope: {
                change: '&',
                identifier: '=?identifier',
                listorigin: '=?listorigin',
                cleanselect: '=?cleanselect',
                placeholder: '=placeholder',
                ngModel: '=?ngModel',
                ngDisabled: '=?ngDisabled',
                fieldCode: '=?fieldCode',
                fieldName: '=?fieldName',
                requerid: '=?requerid',
                removeElement: '=?removeElement',
                focus: '=?focus',
            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                vm.changelist = changelist;
                vm.fetch = fetch;
                vm.list = [];
                vm.item = {};
                vm.requerid = false;
                vm.tabindex = $scope.tabindex;
                vm.identification = $scope.identifier === undefined ? 'loadcombobox' : $scope.identifier;


                $scope.$watch('requerid', function () {
                    if ($scope.requerid !== undefined) {
                        vm.requerid = $scope.requerid;
                    }
                });

                $scope.$watch('focus', function () {
                    if ($scope.focus !== undefined) {
                        if ($scope.focus) {
                            setTimeout(function () {
                                var uiSelectEl = angular.element(document.querySelector('#' + vm.identification + ' .ui-select-focusser'));
                                if (uiSelectEl.length) {
                                    uiSelectEl[0].focus();
                                }
                                $scope.focus = false;
                            }, 100);
                        }
                    }
                });



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
                            element['resultType'] = value['resultType'];
                            element['signature'] = value['signature'];
                            element['identification'] = value['identification'];
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
            controllerAs: 'loadcombobox'
        };
        return directive;
    }
})();
/* jshint ignore:end */

