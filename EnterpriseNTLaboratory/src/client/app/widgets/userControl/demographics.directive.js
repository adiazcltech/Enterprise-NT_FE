/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   disabled         @descripción
                type             @descripción
                order            @descripción
                patientid        @descripción
                log              @descripción
                datademographic  @descripción
                cleanform        @descripción
                functionexecute  @descripción
                formvalid        @descripción
                labelalign       @descripción
                title:           @descripción
                photopatient     @descripción
                vieworder        @descripción
                viewtakephoto    @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/reviewofresults/reviewofresults.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

/* jshint ignore:start */

/* state
1: Deshabilitar todos los controles de tipo 'H' menos patientId
2: Deshabilitar todos los controles de tipo 'H'
3: Habilitar todos los controles de tipo 'H'
4: Habilitar todos los controles de tipo 'O' menos order
5: Habilitar todos los controles de tipo 'H' y 'O' para crear una nueva historia y orden.
6. Habilita todos los demográficos dinámicos de tipo 'H' y todos los de orden.
7: Habilitar todos los controles de tipo 'H' y 'O' y valida la existencia de una historia u orden.
*/

/* log
0: El dato mandado como parametro existe en BD;
1: El dato mandado como parametro no existe en BD;
*/

/* cleanform
1: Limpia todos los campos del form tipo H o O;
2: Limpia todos los campos del form tipo H menos patien id;
3: Limpia todos los campos del form tipo O menos order;
4: Conserva todos los valores de todos los campos.
*/


(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('demographics', demographics);

    demographics.$inject = ['localStorageService', 'orderentryDS', 'patientDS',
        'orderDS', '$filter', 'calculatorage', 'logger'];

    function demographics(localStorageService, orderentryDS, patientDS,
        orderDS, $filter, calculatorage, logger) {
        var directive = {
            templateUrl: 'app/widgets/userControl/demographics.html',
            restrict: 'EA',
            scope: {
                disabled: '=?disabled',
                type: '=type',
                order: '=?order',
                patientid: '=?patientid',
                state: '=?state',
                log: '=?log',
                datademographics: '=?datademographics',
                cleanform: '=?cleanform',
                functionexecute: '=?functionexecute',
                formvalid: '=?formvalid',
                labelalign: '=labelalign',
                title: '=?title',
                photopatient: '=?photopatient',
                vieworder: '=?vieworder',
                viewtakephoto: '=?viewtakephoto'

            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.getpatientbypatiendid = getpatientbypatiendid;
                vm.getpatientbyorder = getpatientbyorder;
                vm.getpatientbypatiendiddocument = getpatientbypatiendiddocument;
                vm.getorderbyorder = getorderbyorder;
                vm.statecontrol = statecontrol;
                vm.keyselect = keyselect;
                vm.cleanform = cleanform;
                vm.makeSnapshot = makeSnapshot;
                vm.onError = onError;
                vm.onSuccess = onSuccess;
                vm.getVideoData = getVideoData;
                vm.savephoto = savephoto;
                vm.loadphotopatient = loadphotopatient;
                vm.keyselectorder = keyselectorder;


                $scope.photopatient = '';
                vm.viewtakephoto = $scope.viewtakephoto;

                $scope.state = $scope.state === undefined ? 1 : $scope.state;

                $scope.demos = [];
                $scope.typeTitle = 'Paciente';
                $scope.log = -1;
                vm.labelAlign = $scope.labelalign === undefined ? 'left' : $scope.labelalign;
                vm.viewOrder = $scope.vieworder === undefined ? true : $scope.vieworder;
                vm.photopatient = '';
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.typedocument = localStorageService.get('ManejoTipoDocumento').toUpperCase();
                vm.isOrderAutomatic = localStorageService.get('NumeroOrdenAutomatico') === 'True';
                vm.digitsorder = localStorageService.get('DigitosOrden');
                vm.maxLenght = localStorageService.get('DigitosOrden') + 8;

                vm.myChannel = {
                    // the fields below are all optional
                    videoHeight: 800,
                    videoWidth: 600,
                    video: null // Will reference the video element on success
                };

                $scope.$watch('viewtakephoto', function () {
                    vm.viewtakephoto = $scope.viewtakephoto;
                });

                $scope.$watch('title', function () {
                    if ($scope.title !== undefined) {
                        $scope.typeTitle = $scope.title;
                    }
                    else {
                        if ($scope.type === 'H') {
                            $scope.typeTitle = 'Paciente';
                        } else {
                            $scope.typeTitle = 'Orden';
                        }
                    }
                });

                $scope.$watch('Form.$valid', function (newVal) {
                    $scope.formvalid = newVal;
                });


                $scope.$watch('type', function () {

                    load();
                });

                $scope.$watch('vieworder', function () {
                    vm.viewOrder = $scope.vieworder === undefined ? true : $scope.vieworder;
                });

                $scope.$watch('order', function () {

                    if ($scope.type === 'H' && ($scope.order !== '' && $scope.order !== undefined)) {
                        vm.getpatientbyorder();
                    }
                    else if ($scope.type === 'O' && ($scope.order !== '' && $scope.order !== undefined)) {
                        vm.getorderbyorder();
                    }
                });

                $scope.$watch('patientid', function () {
                    if ($scope.type === 'H' && $scope.patientid !== '' && $scope.patientid !== undefined) {
                        vm.getpatientbypatiendid($scope.patientid);
                    }
                });


                $scope.$watch('state', function () {
                    vm.statecontrol();
                });

                $scope.$watch('cleanform', function () {
                    vm.cleanform();

                });


                function load() {
                    //$scope.demos = [];
                    //Token de autenticación
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Carga los demograficos configurados
                    orderentryDS.getDemographics(auth.authToken, $scope.type).then(
                        function (response) {
                            response.data.forEach(function (value, key) {
                                value.name = $filter('translate')(value.name);
                                value.format = value.format === undefined ? '' : value.format;
                            })
                            $scope.demos = response.data;

                            vm.statecontrol();
                            vm.cantitems = $scope.type === 'O' ? 3 : vm.typedocument ? 9 : 8;

                            var patientid = {
                                'id': -99,
                                'value': '',
                                'notCodifiedValue': ''
                            }

                            $scope.demos.push(patientid);
                            if ($scope.type === 'O') {
                                $scope.demos.forEach(function (value, key) {
                                    if (value.id === -108) {
                                        value.value = moment().format(vm.formatDate + ' HH:mm:ss');
                                    } else {
                                        value.value = '';
                                    }
                                })
                            }

                            $scope.datademographics = $scope.demos;
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        });
                }

                function getpatientbyorder() {

                    //Token de autenticación
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Carga los datos del paciente relacionado a la orden

                    patientDS.getPatientbyOrder(auth.authToken, $scope.order).then(
                        function (response) {
                            if (response.data.length > 0) {
                                $scope.log = 0;
                                $scope.demos.forEach(function (value, key) {
                                    if (value.encoded) {
                                        var demographiccodified = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0]
                                        value.value = {
                                            'id': demographiccodified.codifiedId,
                                            'name': demographiccodified.codifiedCode + '. ' + demographiccodified.codifiedName
                                        };
                                    }

                                    else {
                                        if (value.id !== -110) {
                                            value.value = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0].notCodifiedValue;
                                        }
                                        else {
                                            var dateage = ($filter('filter')(response.data, { idDemographic: -105 }, true))[0].notCodifiedValue;
                                            value.value = calculatorage.getAge(dateage, vm.formatDate);
                                        }
                                    }

                                });

                                vm.loadphotopatient($filter('filter')(response.data, { idDemographic: -99 }, true)[0].value);
                                vm.patiendid = $filter('filter')(response.data, { idDemographic: -99 }, true)[0].value;
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                            }
                        },
                        function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }

                            $scope.log = 1;
                            $scope.photopatient = '';
                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }
                            if ($scope.cleanform) {
                                vm.cleanform();
                            }
                        });
                }

                function getpatientbypatiendid(idpatiend) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Carga los datos del paciente relacionado al id del paciente
                    patientDS.getPatientbyId(auth.authToken, idpatiend).then(
                        function (response) {
                            if (response.data.length > 0) {
                                $scope.log = 0;

                                $scope.demos.forEach(function (value, key) {
                                    if (value.encoded) {
                                        var demographiccodified = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0]
                                        value.value = {
                                            'id': demographiccodified.codifiedId,
                                            'name': demographiccodified.codifiedCode + '. ' + demographiccodified.codifiedName
                                        };
                                    }
                                    else {
                                        if (value.id !== -110) {
                                            value.value = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0].notCodifiedValue;
                                        }
                                        else {
                                            var dateage = ($filter('filter')(response.data, { idDemographic: -105 }, true))[0].notCodifiedValue;
                                            value.value = calculatorage.getAge(dateage, vm.formatDate);
                                        }

                                    }


                                })
                                vm.patiendid = $filter('filter')(response.data, { idDemographic: -99 }, true)[0].value;
                                vm.loadphotopatient($filter('filter')(response.data, { idDemographic: -99 }, true)[0].value);
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                            }
                            else {

                                $scope.log = 1;
                                $scope.photopatient = '';
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                                if ($scope.cleanform) {

                                    vm.cleanform();
                                }

                            }
                        },
                        function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }

                            $scope.log = 1;
                            $scope.photopatient = '';
                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }
                            if ($scope.cleanform) {
                                vm.cleanform();
                            }

                        });
                }

                function getpatientbypatiendiddocument(idpatiend, documentype) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Carga los datos del paciente relacionado al id del paciente
                    patientDS.getPatientbyIddocument(auth.authToken, idpatiend, documentype).then(
                        function (response) {
                            if (response.data.length > 0) {
                                $scope.log = 0;

                                $scope.demos.forEach(function (value, key) {
                                    if (value.encoded) {
                                        var demographiccodified = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0]
                                        value.value = {
                                            'id': demographiccodified.codifiedId,
                                            'name': demographiccodified.codifiedCode + '. ' + demographiccodified.codifiedName
                                        };
                                    }
                                    else {
                                        if (value.id !== -110) {
                                            value.value = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0].notCodifiedValue;
                                        }
                                        else {
                                            var dateage = ($filter('filter')(response.data, { idDemographic: -105 }, true))[0].notCodifiedValue;
                                            value.value = calculatorage.getAge(dateage, vm.formatDate);
                                        }

                                    }

                                })
                                vm.patiendid = $filter('filter')(response.data, { idDemographic: -99 }, true)[0].value;
                                vm.loadphotopatient($filter('filter')(response.data, { idDemographic: -99 }, true)[0].value);
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                            }
                            else {

                                $scope.log = 1;
                                $scope.photopatient = '';
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                                if ($scope.cleanform) {

                                    vm.cleanform();
                                }

                            }
                        },
                        function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                            $scope.photopatient = '';
                            $scope.log = 1;
                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }
                            if ($scope.cleanform) {
                                vm.cleanform();
                            }

                        });
                }

                function getorderbyorder() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Carga los datos del paciente relacionado al id del paciente
                    orderDS.getOrderbyOrder(auth.authToken, $scope.order).then(
                        function (response) {
                            if (response.data.length > 0) {
                                $scope.log = 0;
                                $scope.demos.forEach(function (value, key) {
                                    if (value.id === -107) {
                                        value.value = ('' + $scope.order).substring(0, 8) + ('' + $scope.order).substring(8);
                                        value.dateorder = ('' + $scope.order).substring(0, 8) + ('' + $scope.order).substring(8);
                                        value.state = true;
                                    }
                                    else if (value.encoded) {
                                        var demographiccodified = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0]
                                        value.value = {
                                            'id': demographiccodified.codifiedId,
                                            'name': demographiccodified.codifiedCode + '. ' + demographiccodified.codifiedName
                                        };
                                    }
                                    else {
                                        if (value.id !== -99) {
                                            value.value = ($filter('filter')(response.data, { idDemographic: value.id }, true))[0].notCodifiedValue;
                                        }
                                    }
                                })
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                            }
                            else {
                                $scope.log = 1;
                                if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                }
                                if ($scope.cleanform) {
                                    vm.cleanform();
                                }
                            }
                        },
                        function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }

                            $scope.log = 1;
                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }
                            if ($scope.cleanform) {
                                vm.cleanform();
                            }
                        });
                }

                function keyselect($event, demo) {

                    var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
                    var id = ($filter('filter')($scope.demos, { id: -99 }))[0].value
                    if ((keyCode === 13 || keyCode === undefined) && demo.value !== undefined) {


                        if (demo.id === -100) {
                            if ($scope.state === 1 || $scope.state > 5) {
                                if (vm.typedocument) {
                                    var documenttype = ($filter('filter')($scope.demos, { id: -10 }))[0].value.id
                                    vm.getpatientbypatiendiddocument(demo.value, documenttype);
                                }
                                else {
                                    vm.getpatientbypatiendid(demo.value);
                                }
                            }
                        }
                        else if (demo.id === -105 && demo.value !== '') {
                            var age = calculatorage.getAge(demo.value, vm.formatDate);
                            if (age === '') {
                                logger.error('Fecha invalida');
                                angular.element('#demo_' + demo.id).focus();
                            }
                            else {
                                ($filter('filter')($scope.demos, { id: -110 }))[0].value = age;
                            }
                        }
                        else if (demo.id === -110 && demo.value !== '') {
                            var DBO = calculatorage.getDOB(demo.value, vm.formatDate);
                            if (DBO === '') {
                                logger.error('Años invalidos');
                                angular.element('#demo_' + demo.id).focus();
                            }
                            else {
                                ($filter('filter')($scope.demos, { id: -105 }))[0].value = DBO;
                            }
                        }
                        else {
                            setTimeout(function () {
                                var element = angular.element('#demo_' + demo.id)[0];
                                if (element !== undefined) {
                                    element.value = element.value.replace(/_/g, '');
                                    if (element.value.substr(-1, 1) === '.') {
                                        element.value = element.value + '0';
                                    }
                                }

                            }, 100);
                        }


                    }
                }


                function keyselectorder($event, demo) {
                    if (demo.value === '' || demo.value === undefined) return;
                    var dateOrder = moment().format('YYYYMMDD');
                    var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
                    if ((keyCode === 13 || keyCode === undefined) && demo.value !== undefined) {

                        vm.orderValue = demo.value;
                        vm.maxLenght = parseInt(vm.digitsorder) + 8;
                        if (vm.orderValue.length === parseInt(vm.digitsorder)) {
                            demo.value = dateOrder + vm.orderValue;

                        } else if (vm.orderValue.length < vm.digitsorder) {
                            var repeat = parseInt(vm.digitsorder) - vm.orderValue.length;
                            var ceros = '';
                            for (var i = 0; i < repeat; i++) {
                                ceros = ceros + '0';
                            }
                            vm.orderValue = dateOrder + ceros + vm.orderValue.toString();

                            if (repeat > 0) {
                                vm.orderValue = ceros === '0000' ? parseInt(vm.orderValue) + 1 : vm.orderValue;
                                demo.value = vm.orderValue;
                            }
                        } else if (vm.orderValue.length > vm.digitsorder && vm.orderValue.length !== 8 + parseInt(vm.digitsorder)) {
                            var repeat = parseInt(vm.digitsorder) - 1;
                            var ceros = '';
                            for (var i = 0; i < repeat; i++) {
                                ceros = ceros + '0';
                            }
                            if (repeat > 0) {
                                demo.value = dateOrder + ceros + '1';
                            }
                        }

                        if (demo.id === -107) {
                            if ($scope.state === 1 || $scope.state > 5) {
                                $scope.order = demo.value;
                                // vm.getorderbyorder();
                                // vm.getpatientbyorder();

                            }
                        }

                    } else {
                        vm.maxLenght = parseInt(vm.digitsorder);
                        var expreg = new RegExp(/^[0-9]+$/);
                        if (!expreg.test(String.fromCharCode(keyCode))) {
                            //detener toda accion en la caja de texto   $event === undefined &&
                            $event.preventDefault();
                        }
                    }
                }


                function statecontrol(id, modify) {
                    $scope.demos.forEach(function (value, key) {
                        //vm.statecontrol(value.id, value.modify);
                        if (value.id === -100 && $scope.state === 1) {
                            value.state = false;
                        }
                        else if (value.id === -10 && $scope.state === 1) {
                            value.state = false;
                        }
                        else if (value.id === -107 && $scope.state === 4) {
                            value.state = true;
                        }
                        else if ($scope.log === 1) {
                            value.state = false;
                        }
                        else if (($scope.state === 3 || $scope.state === 4) && value.modify) {
                            value.state = false;
                        }
                        else if ($scope.state === 5 || $scope.state === 7) {
                            value.state = false;
                        }
                        else if ($scope.state === 6) {
                            value.state = (value.id < 0 && $scope.type === 'H') || (value.id === -107 && value.value.length > 0);
                            if (value.id === -7 || value.id === -8 || value.id === -9 || value.id === -106) {
                                value.state = false;
                            }
                        }
                        else {
                            value.state = true;
                        }
                    })

                }



                function savephoto(id, modify) {
                    var patCanvas = document.querySelector('#snapshot');
                    $scope.photopatient = patCanvas.toDataURL();
                }

                function loadphotopatient(idpatient) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    patientDS.getPhotoPatient(auth.authToken, idpatient).then(
                        function (response) {
                            $scope.photopatient = response.data.photoInBase64;
                        },
                        function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }

                        });
                }

                function cleanform() {
                    var form = $scope.$eval('Form');
                    // if ($scope.cleanform !== 4){
                    if (form) {
                        form.$setUntouched();
                    }

                    if ($scope.cleanform === 1) {
                        $scope.demos.forEach(function (value, key) {
                            if (value.id === -108) {
                                value.value = moment().format(vm.formatDate + ' HH:mm:ss');
                            } else {
                                value.value = '';
                            }
                        })
                    }
                    else if ($scope.cleanform === 2) {
                        $scope.demos.forEach(function (value, key) {
                            if (value.id !== -100 && value.id !== -10) {
                                value.value = '';
                            }


                        })
                    }
                    else if ($scope.cleanform === 3) {
                        $scope.demos.forEach(function (value, key) {
                            if (value.id !== -107) {
                                value.value = '';
                            }

                        })
                    }
                    // }
                    $scope.cleanform = 0;
                    $scope.log = -1;
                }

                function onError(err) {
                    $scope.$apply(
                        function () {
                            $scope.webcamError = err;
                        }
                    );
                }

                function onSuccess(err) {
                    vm.video = vm.myChannel.video;
                }

                function makeSnapshot() {
                    if (vm.video) {
                        var patCanvas = document.querySelector('#snapshot');
                        if (!patCanvas) return;

                        patCanvas.width = vm.video.width;
                        patCanvas.height = vm.video.height;
                        var ctxPat = patCanvas.getContext('2d');

                        var idata = vm.getVideoData(0, 0, 800, 500);
                        ctxPat.putImageData(idata, 0, 0);

                        //sendSnapshotToServer(patCanvas.toDataURL());

                        //patData = idata;
                    }
                };

                function getVideoData(x, y, w, h) {
                    var hiddenCanvas = document.createElement('canvas');
                    hiddenCanvas.width = vm.video.width;
                    hiddenCanvas.height = vm.video.height;
                    var ctx = hiddenCanvas.getContext('2d');
                    ctx.drawImage(vm.video, 0, 0, vm.video.width, vm.video.height);
                    return ctx.getImageData(x, y, w, h);
                };


            }],
            controllerAs: 'demographics'
        };
        return directive;
    }
})();
