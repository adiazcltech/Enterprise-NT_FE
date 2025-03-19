
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('modalstate', modalstate);

    modalstate.$inject = ['ModalService'];

    /* @ngInject */
    function modalstate(ModalService) {
        var directive = {
            templateUrl: 'app/widgets/modal-state.html',
            restrict: 'EA',
            scope: {
                openstatemodal: '=',
                detailstate: '='

            },
        
            controller: ['$scope', function ($scope) {
                var vm = this;

                $scope.$watch('openstatemodal', function () {
                    vm.ShowPopupState = $scope.openstatemodal;
                    vm.detailStatedato = $scope.detailstate;


                    if ($scope.openstatemodal) {
                        ModalService.showModal({
                            templateUrl: 'validationState.html',
                            controller: 'validationStateController',
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {
                                if (result === 'No') {
                                    $scope.detailstate = $scope.detailstate ? false : true;
                                }
                            });
                        });
                    }
                    $scope.openstatemodal = false;
                });
                vm.ShowPopupState = $scope.ShowPopupState;
                vm.detailstate = $scope.detailstate;

            }],
            controllerAs: 'PopupState'
        };
        return directive;
        
    }

    angular 
    .module('app.widgets')
    .controller('validationStateController', validationStateController);
        function validationStateController($scope, close) {
            $scope.close = function (result) {
                close(result, 500);
            };
        }
})();
