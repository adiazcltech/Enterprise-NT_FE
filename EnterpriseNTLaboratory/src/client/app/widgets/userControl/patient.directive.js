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
        .directive('patient', patient);
    patient.$inject = ['common', 'patientDS', 'localStorageService', '$filter'];
    /* @ngInject */
    function patient(common, patientDS, localStorageService, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/patient.html',
            restrict: 'EA',
            scope: {
                iddb: '=?iddb',
                order: '=?order',
                datapatient: '=?datapatient',
                heightline: '=heightline',
                orderdemo: '=?orderdemo',
            },
            controller: ['$scope', function ($scope) {
                var vm = this;

                //Variables de la directiva                
                vm.iddb = $scope.iddb;
                vm.order = $scope.order;
                vm.patient = {};
                vm.managerace = localStorageService.get('ManejoRaza') === 'True';
                vm.manageweight = localStorageService.get('ManejoPeso') === 'True';
                vm.managesize = localStorageService.get('ManejoTalla') === 'True';
                vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True';
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.height_line = $scope.heightline === undefined ? '0px !important' : $scope.heightline.toString() + 'px !important';
                vm.labeldocument = vm.showDocumentType ? ". " : "";
                //Variables de la directiva que no se muestran en la vista
                var auth = localStorageService.get('Enterprise_NT.authorizationData');

                //Metodos de la directiva
                vm.init = init;

                //Eventos de cambio
                $scope.$watch('iddb', function () {
                    if ($scope.iddb !== undefined && $scope.iddb !== null) {
                        vm.validadorderdemo = $scope.orderdemo === undefined;
                        vm.iddb = $scope.iddb;
                        loadPatient(false);
                    }
                });

                $scope.$watch('order', function () {
                    if ($scope.order !== undefined && $scope.order !== null) {
                        vm.validadorderdemo = $scope.orderdemo === undefined;
                        vm.order = $scope.order;
                        loadPatient(true);
                    }
                });

                /** Carga la informacion de un paciente tomando la variable vm.patientIdDB*/
                function loadPatient(searchByOrder) {
                    vm.patientdata = {};
                    $scope.datapatient = {};
                    if (!searchByOrder) {
                        if (vm.iddb !== undefined && vm.iddb !== null) {
                            patientDS.getPatientOnlyId(auth.authToken, vm.iddb).then(
                                function (response) {
                                    if (response.status === 200) {
                                        var data = response.data;
                                        if (!vm.validadorderdemo) {
                                            var orderdemo = $scope.orderdemo;
                                            vm.orderdemo = [];
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
                                        vm.patientdata.documentType = (vm.showDocumentType && data.documentType !== undefined && data.documentType !== null ? data.documentType.abbr : data.documentType.id === 1 ? 'HC ' : data.documentType.abbr);
                                        vm.patientdata.Id = data.id;
                                        vm.patientdata.patientId = data.patientId;
                                        vm.patientdata.lastName = (data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName : '')).toUpperCase();
                                        vm.patientdata.patientName = (data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '')).toUpperCase();
                                        vm.patientdata.completeName = data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName + ' ' : ' ') + data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '');
                                        vm.patientdata.photo = data.photo !== undefined && data.photo !== null && data.photo !== '' ? data.photo : '';
                                        vm.patientdata.sex = data.sex.esCo;
                                        vm.patientdata.birthday = moment(data.birthday).format(vm.formatDate);
                                        vm.patientdata.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate), vm.formatDate);
                                        vm.patientdata.email = data.email === undefined || data.email === '' ? $filter('translate')('0571') : data.email;
                                        vm.patientdata.size = data.size;
                                        vm.patientdata.address = data.address === undefined || data.address === '' ? $filter('translate')('0681') : data.address;
                                        vm.patientdata.phone = data.phone === undefined || data.phone === '' ? $filter('translate')('0681') : data.phone;
                                        vm.patientdata.weight = data.weight;
                                        vm.patientdata.race = (data.race === undefined || data.race === null ? $filter('translate')('0681') : data.race.name);
                                        vm.patientdata.demographics = data.demographics;
                                        $scope.datapatient = vm.patientdata;
                                    }
                                }, function (error) {
                                    vm.Error = error;
                                    vm.ShowPopupError = true;
                                }
                            );
                        }
                    } else {
                        if (vm.order !== undefined && vm.order !== null) {
                            patientDS.getPatientObjectByOrder(auth.authToken, vm.order).then(
                                function (response) {
                                    if (response.status === 200) {
                                        var data = response.data;
                                        if (!vm.validadorderdemo) {
                                            var orderdemo = $scope.orderdemo;
                                            vm.orderdemo = [];
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
                                        vm.patientdata.documentType = (vm.showDocumentType && data.documentType !== undefined && data.documentType !== null ? data.documentType.abbr : data.documentType.id === 1 ? 'HC ' : data.documentType.abbr);
                                        vm.patientdata.Id = data.id;
                                        vm.patientdata.patientId = data.patientId;
                                        vm.patientdata.lastName = (data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName : '')).toUpperCase();
                                        vm.patientdata.patientName = (data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '')).toUpperCase();
                                        vm.patientdata.completeName = data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName + ' ' : ' ') + data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '');
                                        vm.patientdata.photo = data.photo !== undefined && data.photo !== null && data.photo !== '' ? data.photo : '';
                                        vm.patientdata.sex = data.sex.esCo;
                                        vm.patientdata.birthday = moment(data.birthday).format(vm.formatDate);
                                        vm.patientdata.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate), vm.formatDate, data.createdDateOrder);
                                        vm.patientdata.email = data.email === undefined || data.email === '' ? $filter('translate')('0571') : data.email;
                                        vm.patientdata.size = data.size;
                                        vm.patientdata.address = data.address === undefined || data.address === '' ? $filter('translate')('0681') : data.address;
                                        vm.patientdata.phone = data.phone === undefined || data.phone === '' ? $filter('translate')('0681') : data.phone;
                                        vm.patientdata.weight = data.weight;
                                        vm.patientdata.race = (data.race === undefined || data.race === null ? $filter('translate')('0681') : data.race.name);
                                        vm.patientdata.demographics = data.demographics;
                                        $scope.datapatient = vm.patientdata;
                                    }
                                },
                                function (error) {
                                    vm.Error = error;
                                    vm.ShowPopupError = true;
                                }
                            );
                        }
                    }
                }

                /** 
                 * Funcion inicial de la directiva
                */
                function init() {
                    loadPatient();
                }
                vm.init();
            }],
            controllerAs: 'patient'
        };
        return directive;
    }
})();
