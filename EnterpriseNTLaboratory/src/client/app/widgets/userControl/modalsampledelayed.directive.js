(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('modalsamplereject', modalsamplereject);

    modalsamplereject.$inject = ['sampletrackingsDS', 'localStorageService'];
    /* @ngInject */
    function modalsamplereject(sampletrackingsDS, localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-samplereject.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=?order'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.getsample = getsample;


                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.getsample();
                        UIkit.modal('#samplerejectmodal').show();
                    }
                    $scope.openmodal = false;
                });


                function getsample() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    if ($scope.order !== undefined) {
                        return sampletrackingsDS.sampleorder(auth.authToken, $scope.order).then(function (data) {
                            if (data.status === 200) {
                                vm.Detail = data.data;
                            }
                        }, function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        });
                    }
                }
                function init() {
                }

                vm.init();

            }],
            controllerAs: 'modalsamplereject'
        };
        return directive;

    }

})();
