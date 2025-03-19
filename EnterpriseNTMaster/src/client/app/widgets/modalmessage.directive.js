
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('modalmessage', modalmessage);

    modalmessage.$inject = ['ModalService'];

    /* @ngInject */
    function modalmessage(ModalService) {
        var directive = {
            templateUrl: 'app/widgets/modal-message.html',
            restrict: 'EA',
            scope: {
                openstatemodal: '=',
                message: '='

            },
        
            controller: ['$scope', function ($scope) {
                var vm = this;

                $scope.$watch('openstatemodal', function () {
                    vm.ShowPopupState = $scope.openstatemodal;
                    vm.message = $scope.message;


                    if ($scope.openstatemodal) {
                        ModalService.showModal({
                            templateUrl: 'validationMessage.html',
                            controller: 'validationMessageController',
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {
                                // if (result === 'Close') {
                                //     $scope.detailstate = !$scope.detailstate;
                                // }
                            });
                        });
                    }
                    $scope.openstatemodal = false;
                });
                vm.ShowPopupState = $scope.ShowPopupState;
                //vm.detailstate = $scope.detailstate;

            }],
            controllerAs: 'modalmessage'
        };
        return directive;
        
    }

    angular 
    .module('app.widgets')
    .controller('validationMessageController', validationMessageController);
        function validationMessageController($scope, close) {
            $scope.close = function (result) {
                close(result, 500);
            };
        }
})();
