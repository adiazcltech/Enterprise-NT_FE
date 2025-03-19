
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('loadpage', loadpage);

    loadpage.$inject = ['$filter', 'localStorageService', 'logger'];

    /* @ngInject */
    function loadpage($filter, localStorageService, logger) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/loadpage-directive.html',
            scope: {
                view: '=?view'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
           
                $scope.$watch('view', function () {
                    vm.view = $scope.view;
                });

            }],
            controllerAs: 'loadpage'
        };
        return directive;
    }
})();
/* jshint ignore:end */

