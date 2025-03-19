/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('multiselect', multiselect);

    multiselect.$inject = ['$q'];

    /* @ngInject */
    function multiselect($q) {
        var directive = {
            templateUrl: 'app/widgets/multiselect.html',
            restrict: 'EA',
            scope: {
                disable: '=?disable',
                model: '=ngModel',
                list: '=list',
                unique:'=unique'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.disabled = $scope.disable;
                vm.unique = $scope.unique;
                vm.availability = { services: $scope.list };

                vm.selecteditem = selecteditem;
                vm.changemodel = changemodel;
                selecteditem();

                $scope.$watch('disable', function () {
                    vm.disabled = $scope.disable;
                });

                $scope.$watch('model', function () {
                    if ($scope.model !== undefined && $scope.model !== null ) {
                        $scope.model = Number($scope.model) === NaN ? $scope.model : $scope.model.toString();
                        vm.selecteditem();
                    }
                });

                function changemodel(item) {
                    vm.checkResults = [];
                    
                    for (var i = 0; i < vm.availability.services.length; i++) {
                        if (vm.unique === true) {
                            vm.availability.services[i].selected = false   
                        }
                        if (vm.availability.services[i].selected) {
                            vm.checkResults.push(vm.availability.services[i].id);
                        }
                    }    
                    
                    

                    if (vm.checkResults.length === 0) {
                        item.selected = true;
                        vm.checkResults.push(item.id);
                    }

                    $scope.model = vm.checkResults.toString();
                }

                function selecteditem() {
                    if ($scope.model !== undefined && $scope.model !== null ) {
                        vm.checkResults = [];
                         $scope.model = $scope.model.toString();
                        var array = $scope.model.split(',');
                        for (var i = 0; i < vm.availability.services.length; i++) {
                            if (array.indexOf((vm.availability.services[i].id).toString()) !== -1) {
                                vm.availability.services[i].selected = true;
                                vm.checkResults.push(vm.availability.services[i].id);
                            }
                            else {
                                vm.availability.services[i].selected = false;
                            }
                        }
                    }
                }
            }],
            controllerAs: 'multiselect'
        };
        return directive;
    }
})();
/* jshint ignore:end */
