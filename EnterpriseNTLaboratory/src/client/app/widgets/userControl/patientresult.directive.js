/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ... 
  PARAMETROS:   iddb        @descripción
                order       @descripción
                datapatient @descripción
                heightline  @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN: 
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/account/userprofile/userprofile.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/activationorder/activationorder.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/deletespecial/deletespecial.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyreassignment/historyreassignment.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/inconsistency/inconsistency.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html
  15.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/simpleverification/simpleverification.html
  16.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  17.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  18.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  19.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/destinationsample/destinationsample.html
  20.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('patientresult', patientresult);
    patientresult.$inject = ['common', 'localStorageService', '$filter'];
    /* @ngInject */
    function patientresult(common, localStorageService, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/patientresult.html',
            restrict: 'EA',
            scope: {
                iddb: '=?iddb',
                order: '=?order',
                datapatient: '=?datapatient',
                heightline: '=heightline',
                orderdemo: '=?orderdemo',
                patientdata: '=?patientdata',
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                //Metodos de la directiva
                vm.init = init;

                $scope.$watch('order', function () {
                    if ($scope.order !== undefined && $scope.order !== null) {
                        var orderdemo = $scope.orderdemo;
                        vm.orderdemo = [];
                        vm.order = $scope.order;
                        vm.patientdata = {};
                        var data = $scope.patientdata;
                        vm.patientdata.documentType = (vm.showDocumentType && data.documentType !== undefined && data.documentType !== null ? data.documentType.id === 1 ? 'HC ' : data.documentType.abbr : data.documentType.id === 1 ? 'HC ' : data.documentType.abbr);
                        vm.patientdata.Id = data.id;
                        vm.patientdata.patientId = data.patientId;
                        vm.patientdata.lastName = (data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName : '')).toUpperCase();
                        vm.patientdata.patientName = (data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '')).toUpperCase();
                        vm.patientdata.completeName = data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName + ' ' : ' ') + data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '');
                        vm.patientdata.photo = data.photo !== undefined && data.photo !== null && data.photo !== '' ? data.photo : '';


                        orderdemo.forEach(function (value) {
                            if (value.id > 0) {
                                var demolits = _.filter(data.demographics, function (o) { return o.idDemographic === value.id; });
                                if (demolits.length == 0) {
                                    value.value = '';
                                } else {
                                    value.value = demolits[0].value === '.' ? $filter('translate')('0681') : demolits[0].value;
                                }
                                vm.orderdemo.push(value);
                            } else {
                                if (value.id !== -10 && value.id !== -100 && value.id !== -101 && value.id !== -102 && value.id !== -103 && value.id !== -109) {
                                    //genero
                                    if (value.id === -104) {
                                        value.value = data.sex.esCo;
                                        vm.orderdemo.push(value);
                                    }
                                    //fecha de nacimiento
                                    if (value.id === -105) {
                                        value.value = moment(data.birthday).format(vm.formatDate);
                                        vm.orderdemo.push(value);
                                    }
                                    //edad
                                    if (value.id === -110) {
                                        value.value = common.getAgeAsString(moment(data.birthday).format(vm.formatDate), vm.formatDate);
                                        vm.orderdemo.push(value);
                                    }
                                    //email
                                    if (value.id === -106) {
                                        value.value = data.email === undefined || data.email === '' ? $filter('translate')('0571') : data.email;
                                        vm.orderdemo.push(value);
                                    }
                                    //telefono
                                    if (value.id === -111) {
                                        value.value = data.phone === undefined || data.phone === '' ? $filter('translate')('0681') : data.phone;
                                        vm.orderdemo.push(value);
                                    }
                                    //dirrecion
                                    if (value.id === -112) {
                                        value.value = data.address === undefined || data.address === '' ? $filter('translate')('0681') : data.address;
                                        vm.orderdemo.push(value);
                                    }
                                    //weight
                                    if (value.id === -8 && vm.manageweight) {
                                        value.value = data.weight === undefined || data.weight === '' ? $filter('translate')('0681') : data.weight;
                                        vm.orderdemo.push(value);
                                    }
                                    //size
                                    if (value.id === -9 && vm.managesize) {
                                        value.value = data.size === undefined || data.size === '' ? $filter('translate')('0681') : data.size;
                                        vm.orderdemo.push(value);
                                    }
                                    //race
                                    if (value.id === -7 && vm.managerace) {
                                        value.value = (data.race === undefined || data.race === null ? $filter('translate')('0681') : data.race.name);
                                        vm.orderdemo.push(value);
                                    }
                                }

                            }

                        });
                    }
                });
                /** 
                 * Funcion inicial de la directiva
                */
                function init() {
                    //Variables de la directiva                
                    vm.iddb = $scope.iddb;
                    vm.order = $scope.order;
                    vm.patient = {};
                    vm.manageweight = localStorageService.get('ManejoPeso') === 'True';
                    vm.managerace = localStorageService.get('ManejoRaza') === 'True';
                    vm.managesize = localStorageService.get('ManejoTalla') === 'True';
                    vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True';
                    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                    vm.height_line = $scope.heightline === undefined ? '0px !important' : $scope.heightline.toString() + 'px !important';
                    vm.labeldocument = vm.showDocumentType ? ". " : "";
                }
                vm.init();
            }],
            controllerAs: 'patientresult'
        };
        return directive;
    }
})();
