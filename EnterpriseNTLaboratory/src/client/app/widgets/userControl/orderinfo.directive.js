/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   ordernumber @descripción
                heightline  @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('orderinfo', orderinfo);
    orderinfo.$inject = ['orderDS', 'localStorageService'];
    /* @ngInject */
    function orderinfo(orderDS, localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/userControl/orderinfo.html',
            restrict: 'EA',
            scope: {
                ordernumber: '=?ordernumber',
                heightline: '=heightline',
                dataorder: '=?dataorder',
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.staticDemoIds = {
                    'patientDB': -99,
                    'patientComment': -997,
                    'documentType': -10,
                    'patientId': -100,
                    'lastName': -101,
                    'surName': -102,
                    'name1': -103,
                    'name2': -109,
                    'sex': -104,
                    'birthday': -105,
                    'age': -110,
                    'email': -106,
                    'weight': -8,
                    'size': -9,
                    'race': -7,
                    'orderDB': -998,
                    'orderComment': -996,
                    'order': -107,
                    'orderDate': -108,
                    'orderType': -4,
                    'rate': -3,
                    'branch': -5,
                    'service': -6,
                    'account': -1,
                    'physician': -2
                };

                vm.manageService = localStorageService.get('ManejoServicio') === 'True';
                vm.manageAccount = localStorageService.get('ManejoCliente') === 'True';
                vm.managePhysician = localStorageService.get('ManejoMedico') === 'True';
                vm.manageRate = localStorageService.get('ManejoTarifa') === 'True';

                //Variables de la directiva
                vm.order = $scope.ordernumber;
                vm.order = {};
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.height_line = $scope.heightline === undefined ? '0px !important' : $scope.heightline.toString() + 'px !important';

                //Variables de la directiva que no se muestran en la vista
                var auth = localStorageService.get('Enterprise_NT.authorizationData');

                //Metodos de la directiva
                vm.init = init;

                $scope.$watch('ordernumber', function () {
                    if ($scope.ordernumber !== undefined && $scope.ordernumber !== null) {
                        vm.order = $scope.ordernumber;
                        loadOrder(vm.order);
                    }
                });

                /** Carga la informacion de un paciente tomando la variable vm.patientIdDB*/
                function loadOrder(order) {
                    vm.order = {};
                    if (order !== undefined && order !== null) {
                        orderDS.getOrderbyOrder(auth.authToken, order).then(
                            function (response) {

                                if (response.status === 200) {
                                    var data = response.data;

                                    var orderTem = {
                                        demographics: []
                                    };
                                    data.forEach(function (demo, index) {
                                        if (demo.idDemographic === vm.staticDemoIds['order']) {
                                            //Orden
                                            orderTem.order = demo.notCodifiedValue;
                                        } else if (demo.idDemographic === vm.staticDemoIds['orderDate']) {
                                            //Fecha de Registro
                                            orderTem.registerDate = demo.notCodifiedValue;
                                        } else if (demo.idDemographic === vm.staticDemoIds['orderType']) {
                                            //Tipo de Orden
                                            orderTem.type = demo.codifiedName;
                                        } else if (demo.idDemographic === vm.staticDemoIds['branch']) {
                                            //Sede
                                            orderTem.branch = demo.codifiedName;
                                        } else if (demo.idDemographic === vm.staticDemoIds['service']) {
                                            //Service
                                            localStorageService.set("sevicecodifiedId", demo.codifiedId);
                                            orderTem.service = demo.codifiedName;
                                        } else if (demo.idDemographic === vm.staticDemoIds['account']) {
                                            //Cliente
                                            orderTem.account = demo.codifiedName;
                                        } else if (demo.idDemographic === vm.staticDemoIds['rate']) {
                                            //Tarifa
                                            orderTem.rate = demo.codifiedName;
                                        } else if (demo.idDemographic === vm.staticDemoIds['physician']) {
                                            //Medico
                                            orderTem.physician = demo.codifiedName;
                                        } else {
                                            //Demograficos variables
                                            orderTem.demographics.push({ 'idDemographic': demo.idDemographic, 'demographic': demo.demographic, 'codifiedId': demo.codifiedId, 'value': demo.encoded === true ? demo.codifiedName : demo.value });
                                        }
                                    });
                                    $scope.dataorder = orderTem;
                                    vm.order = orderTem;
                                }
                            },
                            function (error) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                        );
                    }
                }

                /**
                 * Funcion inicial de la directiva
                */
                function init() {
                    loadOrder();
                }
                vm.init();
            }],
            controllerAs: 'orderinfo'
        };
        return directive;
    }
})();
