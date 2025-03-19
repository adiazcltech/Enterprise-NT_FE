
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultssort', resultssort);

    resultssort.$inject = [];

    /* @ngInject */
    function resultssort() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-sort.html',
            scope: {
                sortvalue: '=?sortvalue',
                sorttype: '=?sorttype',
                sortreverse: '=?sortreverse'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                $scope.$watch('sortvalue', function () {
                    vm.sortvalue = $scope.sortvalue;
                });

                $scope.$watch('sorttype', function () {
                    vm.sorttype = $scope.sorttype;
                });
                $scope.$watch('sortreverse', function () {
                    vm.sortreverse = $scope.sortreverse;
                });
            }],
            controllerAs: 'vmd'
        };
        return directive;
    }
})();
/* jshint ignore:end */