/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('modalreport', modalreport);

      modalreport.$inject = ['ModalService'];

    /* @ngInject */
    function modalreport(ModalService) {
        var directive = {
            templateUrl: 'app/widgets/modalreport-directive.html',
            restrict: 'EA',
            scope: {
              openmodal: '='
            },

            controller: ['$scope', function ($scope) {
                
                var vm = this;
              
                $scope.$watch('openmodal', function () { 
                    if ($scope.openmodal) {
                        ModalService.showModal({
                            templateUrl: 'validationmodalreport.html',
                            controller: 'modalreportController',
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {                               
                            });
                        });
                    }
                    $scope.openmodal = false;                 
                });

                
            }],
            controllerAs: 'report'
        };
        return directive;
    }
     angular 
    .module('app.widgets')
    .controller('modalreportController', modalreportController);
        function modalreportController($scope, close) {
            $scope.close = function (result) {
                close(result, 500);
            };
        }

})();
/* jshint ignore:end */