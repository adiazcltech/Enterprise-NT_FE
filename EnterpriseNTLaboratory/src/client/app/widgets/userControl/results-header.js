/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   selectedorder @descripcion
                orderdetail   @descripcion
                ordercolor    @descripcion 
    
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultsheader', resultsheader);

    resultsheader.$inject = ['$filter', 'localStorageService', '$rootScope', 'logger',
        'patientDS', 'orderDS', 'resultsentryDS'];

    /* @ngInject */
    function resultsheader($filter, localStorageService, $rootScope, logger,
        patientDS, orderDS, resultsentryDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-header.html',
            scope: {
                selectedorder: '=?selectedorder',
                orderdetail: '=?orderdetail',
                ordercolor: '=?ordercolor',
                datebirth: '=?datebirth',
                datecreateorder: '=?datecreateorder'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.birthday = '';
                vm.loadphotopatient = loadphotopatient;
                vm.getRecallOrder = getRecallOrder;
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.numerOrder = localStorageService.get('OrdencompletaRegistroResultados') === 'True' ? 0 : 3;
                vm.loadOrder = loadOrder;

                $scope.$watch('selectedorder', function () {
                    vm.photopatient = '';
                    vm.selectedorder = $scope.selectedorder;
                    vm.datebirth = $scope.datebirth === undefined ? '' : $scope.datebirth;
                   
                    if (vm.selectedorder !== undefined) {
                        vm.selectedorder.idtype = vm.selectedorder.idtype == '1' ? '' : vm.selectedorder.idtype;
                        if (vm.selectedorder.patientId !== undefined) {
                            vm.loadphotopatient();
                            vm.getRecallOrder();
                        }
                    }
                });

                $scope.$watch('orderdetail', function () {
                    vm.orderdetail = $scope.orderdetail;
                });

                
                $scope.$watch('datecreateorder', function () {
                    vm.datecreateorder = $scope.datecreateorder === undefined ? '' : $scope.datecreateorder;
                });

                $scope.$watch('ordercolor', function () {
                    vm.ordercolor = $scope.ordercolor;
                });

                function loadOrder(order) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var data = {
                        'filterRange': '1',
                        'firstOrder': order - 1,
                        'lastOrder': order + 1,
                        'firstDate': -1,
                        'lastDate': 1,
                        'areaList': [],
                        'testList': [],
                        'numFilterAreaTest': 0,
                        'filterByDemo': [],
                        'userId': auth.id
                    };
                    return resultsentryDS.getOrdersByFilter(auth.authToken, data).then(function (data) {
                        if (data.status === 200) {
                            $rootScope.orderalarm = order;
                        }
                        else if (data.status === 204) {
                            logger.warning($filter('translate')('1149'));
                        }
                    });


                }
                // función para consultar foto del paciente
                function loadphotopatient() {
                    vm.photopatient = '';
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    patientDS.getPhotoPatient(auth.authToken, vm.selectedorder.patientId).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.photopatient = response.data.photoInBase64;
                            }
                        },
                        function (error) {
                            vm.modalError(error);
                        });
                }

                function getRecallOrder() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    orderDS.getDetailRecall(auth.authToken, vm.selectedorder.order).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.selectedorder.fatherOrder = response.data.fatherOrder;
                                vm.selectedorder.daughterOrder = response.data.daughterOrder;
                            }
                        },
                        function (error) {
                            vm.modalError(error);
                        });
                }

            }],
            controllerAs: 'vma'
        };
        return directive;
    }
})();
/* jshint ignore:end */


