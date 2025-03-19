/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('checkboxnt', checkboxnt);

    checkboxnt.$inject = ['$q'];

    /* @ngInject */
    function checkboxnt($q) {
        var directive = {
            templateUrl: 'app/widgets/checkboxnt.html',
            restrict: 'EA',
            scope: {
                disable: '=disable',
                value: '=value',
                model:'=model'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.disabled = $scope.disable;
                vm.value = $scope.value;
                vm.model = $scope.model; 
                                
                $scope.$watch('disable', function () {
                    vm.disabled = $scope.disable;    
                });
                
                $scope.$watch('model', function () {                    
                    vm.value = $scope.value;
                    vm.model = $scope.model;
                });

            }],
            controllerAs: 'checkboxnt'
        };
        return directive;
    }
})();
/* jshint ignore:end */
