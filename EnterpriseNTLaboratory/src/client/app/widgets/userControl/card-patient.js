
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('cardpatient', cardpatient);

    cardpatient.$inject = ['localStorageService'];

    /* @ngInject */
    function cardpatient(localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/card-patient.html',
            scope: {
                patientname: '=?patientname',
                patientdocument: '=?patientdocument',
                patientage: '=?patientage',
                patientgender: '=?patientgender',
                patientid: '=?patientid',
                photopatient: '=?photopatient',
                orderpatient: '=?orderpatient',
                patientagedate: '=?patientagedate',
                orderdemo: '=?orderdemo',
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.loaddata = false;


                $scope.$watch('patientname', function () {
                    if ($scope.patientname) {
                        vm.orderpatient = $scope.orderpatient;
                        vm.patientname = $scope.patientname;
                        vm.patientdocument = $scope.patientdocument.replace('undefined', '');
                        vm.patientage = $scope.patientage;
                        vm.patientagedate = $scope.patientagedate !== undefined ? moment($scope.patientagedate).format(vm.formatDate) : '';
                        vm.patientgender = $scope.patientgender;
                        vm.patientid = $scope.patientid;
                        vm.orderdemo = $scope.orderdemo;
                        vm.photopatient = $scope.photopatient;
                        vm.loaddata = true;
                    }
                });
            }],
            controllerAs: 'cardpatient'
        };
        return directive;
    }
})();
/* jshint ignore:end */

