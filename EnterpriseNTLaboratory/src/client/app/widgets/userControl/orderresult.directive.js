
(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('orderresult', orderresult);
    orderresult.$inject = ['localStorageService'];
    /* @ngInject */
    function orderresult(localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/userControl/orderresult.html',
            restrict: 'EA',
            scope: {
                openmodal: '=?openmodal',
                order: '=?order'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                $scope.order = 0;
                vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
                vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
                vm.dateFormatToSearch = '{format:"' + vm.dateFormat + '"}';
                vm.dateToSearch = moment().format(vm.dateFormat);
                vm.results = [];
                vm.selectOrder = selectOrder;

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        searchByDate(function () {
                            UIkit.modal('#orderdailysearch').show();
                        });
                    }
                    $scope.openmodal = false;
                });

                $scope.$watch('order', function () {
                    if ($scope.date !== null && $scope.date !== '') {
                        vm.dateToSearch = moment($scope.date, vm.dateFormat).toDate();
                    } else {
                        vm.dateToSearch = new Date();
                    }
                    searchByDate();
                });

                /** 
                 * Funcion inicial de la directiva
                */
                function init() {

                }
                vm.init();
            }],
            controllerAs: 'orderresult'
        };
        return directive;
    }
})();
