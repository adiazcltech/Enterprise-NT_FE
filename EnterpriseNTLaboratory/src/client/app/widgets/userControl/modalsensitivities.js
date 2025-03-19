/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
    PROPOSITO:    ...
PARAMETROS:   openmodal           @descripción
order               @descripción
testid              @descripción
testcode            @descripción
testname            @descripción
microbiolog         @descripción
sampleid            @descripción
patientinformation  @descripción
photopatient        @descripción

AUTOR:        @autor
FECHA:        2018-06-21
IMPLEMENTADA EN:
    1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

MODIFICACIONES:

    1. aaaa-mm-dd. Autor
Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .filter('trust', ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }])
        .directive('modalsensitivities', modalsensitivities);

    modalsensitivities.$inject = ['microbiologyDS', 'localStorageService', '$filter', 'logger', '$location', '$anchorScroll'];
    /* @ngInject */
    function modalsensitivities(microbiologyDS, localStorageService, $filter, logger, $location, $anchorScroll) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-sensitivities.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=order',
                testid: '=testid',
                testcode: '=testcode',
                testname: '=testname',
                microbiology: '=microbiology',
                sampleid: '=sampleid',
                prevalidationuser: '=prevalidationuser',
                prevalidationdate: '=prevalidationdate',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                orderdemo: '=?orderdemo',
                functionexecute: '=functionexecute'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.getsitesanatomical = getsitesanatomical;
                vm.methodgetcollection = methodgetcollection;
                vm.subSampleid = [];
                vm.anatomicalsitesid = [];
                vm.getcollectionmethodid = [];
                vm.microbialdetectione = microbialdetectione;
                vm.getDetailSample = getDetailSample;
                vm.Savemicrobialdetection = Savemicrobialdetection;
                vm.modalError = modalError;
                vm.keyselect = keyselect;
                vm.closemodal = closemodal;
                vm.getantibiotic = getantibiotic;
                vm.selected = -1;
                vm.Saveantiobiotics = Saveantiobiotics;
                vm.Savedatamicroorganism = Savedatamicroorganism;
                vm.savedetectionmicroobiana = savedetectionmicroobiana;
                vm.detailantibiotic = [];
                vm.valuereference = valuereference;
                vm.cal = cal;
                vm.currentPage = 1;
                vm.pageSize = 5;
                vm.selectedantibiotic = -1;
                vm.getsubsample = getsubsample;
                vm.selectall = selectall;
                vm.selectalldiskPrint = selectalldiskPrint;
                vm.changecontrol = changecontrol;
                vm.focusIn = focusIn;
                vm.keyselectgrilla = keyselectgrilla;
                vm.downAC = downAC;
                vm.viewCMI = localStorageService.get('RegistroCMIM');
                vm.viewCMI = vm.viewCMI === 'True' || vm.viewCMI === true ? true : false;
                vm.keyselectAI = keyselectAI;

                vm.inter = [
                    { 'id': 1, 'name': '1|' + $filter('translate')('0562'), 'save': $filter('translate')('0562') },
                    { 'id': 2, 'name': '2|' + $filter('translate')('0563'), 'save': $filter('translate')('0563') },
                    { 'id': 3, 'name': '3|' + $filter('translate')('0564'), 'save': $filter('translate')('0564') }
                ];

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.selected = 0;
                        vm.loadingdata = true;
                        vm.prevalidationuser = $scope.prevalidationuser === undefined ? '' : $scope.prevalidationuser;
                        vm.prevalidationdate = $scope.prevalidationdate === undefined ? '' : $scope.prevalidationdate;
                        vm.comment = '';
                        vm.detailantibiotic = [];
                        vm.order = $scope.order;
                        vm.testId = $scope.testid;
                        vm.microbiology = $scope.microbiology;
                        vm.testCode = $scope.testcode;
                        vm.testName = $scope.testname;
                        vm.samplemicrobiology = $scope.sampleid;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.orderdemo = $scope.orderdemo;
                        vm.microbialdetectione();
                        vm.view2 = true;
                    }
                    $scope.openmodal = false;
                });

                function keyselectgrilla($event, antibiotic) {
                    var keyCode = $event.which || $event.keyCode;

                    if (keyCode === 9) {
                        var indexselect = $('.div-conttable').children('.selected').index();
                        var nextelement = $('.div-conttable').children()[indexselect + 1].id;
                        $location.hash($('.div-conttable').children('.selected')[0].id);
                        $anchorScroll();
                        vm.changecontrol(nextelement);
                    }
                }
                function keyselectAI($event, antibiotic) {
                    if (vm.viewCMI === false) {
                        var keyCode = $event.which || $event.keyCode;
                        if (keyCode === 9) {
                            var indexselect = $('.div-conttable').children('.selected').index();
                            var nextelement = $('.div-conttable').children()[indexselect + 1].id;
                            if (nextelement !== '') {
                                if (antibiotic.interpretationCMI === '1') {
                                    antibiotic.interpretationCMI = '1|' + $filter('translate')('0562');
                                }
                                if (antibiotic.interpretationCMI === '2') {
                                    antibiotic.interpretationCMI = '2|' + $filter('translate')('0563');
                                }
                                if (antibiotic.interpretationCMI === '3') {
                                    antibiotic.interpretationCMI = '3|' + $filter('translate')('0564');
                                }
                            }
                            $location.hash($('.div-conttable').children('.selected')[0].id);
                            $anchorScroll();
                            vm.changecontrol(nextelement);
                        }
                    }
                }
                // función para mostrar la ventana de error
                function downAC($event) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 40) {
                        $location.hash($('.div-conttable').children('.selected')[0].id);
                        $anchorScroll();
                        var indexselect = $('.div-conttable').children('.selected').index();
                        var nextelement = $('.div-conttable').children()[indexselect + 1].id;
                        vm.changecontrol(nextelement);
                    }

                    if (keyCode === 16) {
                        var indexselect = $('.div-conttable').children('.selected').index();
                        var nextelement = $('.div-conttable').children()[indexselect - 1].id;
                        if (nextelement !== '') {
                            vm.changecontrol(nextelement);
                        }
                    }
                }
                // función para mostrar la ventana de error
                function changecontrol(antibiotic) {
                    vm.selected1 = antibiotic;
                    setTimeout(function () {
                        angular.element('#AC' + vm.selected1).select();
                    }, 100);

                    // $scope.$broadcast('angucomplete-alt:changeInput',antibiotic.idAntibiotic,vm.inter[0]);


                    // if(vm.selectICMI==! undefined){
                    // if(vm.selectICMI.originalObject.name===undefined){
                    //     antibiotic.interpretationCMI=vm.selectICMI.originalObject;

                    //  }else{
                    //     antibiotic.interpretationCMI=vm.selectICMI.originalObject.name;
                    //  }
                    // }
                }
                function focusIn(str) {
                    vm.selectantibio.interpretationCMI = str;


                    // if( vm.selectantibio..selectICMI.originalObject.name===undefined){
                    //     vm.selectantibio.interpretationCMI= vm.selectantibio.selectICMI.originalObject;

                    //  }else{
                    //     vm.selectantibio.interpretationCMI= vm.selectantibio.selectICMI.originalObject.name;
                    //  }
                }
                function modalError(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                }
                // selecciona todos los antibioticos
                function selectall() {
                    vm.cmiMPrint = vm.cmiMPrint === true ? false : true;
                    if (vm.detailantibiotic.length > 0) {
                        vm.detailantibiotic.forEach(function (value, key) {
                            vm.detailantibiotic[key].cmiMPrint = vm.cmiMPrint;
                        });
                    }
                }
                // selecciona todos los antibioticos
                function selectalldiskPrint() {
                    vm.diskPrint = vm.diskPrint === true ? false : true;
                    if (vm.detailantibiotic.length > 0) {
                        vm.detailantibiotic.forEach(function (value, key) {
                            vm.detailantibiotic[key].diskPrint = vm.diskPrint;
                        });
                    }
                }
                // función para cerrar modal
                function closemodal() {
                    UIkit.modal('#sensitivitiesmodal').hide();
                }
                // función para calcular segun el maestro de valores de referencia de antibiotico
                function cal(antibiotic, id) {

                    if (id === 1) {
                        var valuesreferencie = $filter('filter')(vm.valuereferencedata, function (e) { return e.antibiotic.id === antibiotic.idAntibiotic && e.method === id; })
                        for (var i = 0; i < valuesreferencie.length; i++) {
                            if (valuesreferencie[i].operation.id === 50) {
                                if (parseInt(antibiotic.cmiM) === parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;

                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 51) {
                                if (parseInt(antibiotic.cmiM) >= parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 52) {
                                if (parseInt(antibiotic.cmiM) <= parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 53) {
                                if (parseInt(antibiotic.cmiM) < parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 54) {
                                if (parseInt(antibiotic.cmiM) > parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 55) {
                                if (parseInt(antibiotic.cmiM) !== parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 56) {
                                if (parseInt(antibiotic.cmiM) > parseInt(valuesreferencie[i].valueMin) && parseInt(antibiotic.cmiM) < parseInt(valuesreferencie[i].valueMax)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationCMIM = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                        }
                    }
                    if (id === 2) {
                        var valuesreferencie = $filter('filter')(vm.valuereferencedata, function (e) { return e.antibiotic.id === antibiotic.idAntibiotic && e.method === id; })
                        for (var i = 0; i < valuesreferencie.length; i++) {
                            if (valuesreferencie[i].operation.id === 50) {
                                if (parseInt(antibiotic.disk) === parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }
                                }

                            }
                            if (valuesreferencie[i].operation.id === 51) {
                                if (parseInt(antibiotic.disk) >= parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 52) {
                                if (parseInt(antibiotic.disk) <= parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 53) {
                                if (parseInt(antibiotic.disk) < parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 54) {
                                if (parseInt(antibiotic.disk) > parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 55) {
                                if (parseInt(antibiotic.disk) !== parseInt(valuesreferencie[i].valueMin)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                            if (valuesreferencie[i].operation.id === 56) {
                                if (parseInt(antibiotic.disk) > parseInt(valuesreferencie[i].valueMin) && parseInt(antibiotic.disk) < parseInt(valuesreferencie[i].valueMax)) {
                                    if (valuesreferencie[i].interpretation === 1) {
                                        antibiotic.interpretationDisk = $filter('translate')('0562');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 2) {
                                        antibiotic.interpretationDisk = $filter('translate')('0563');
                                        break;
                                    }
                                    if (valuesreferencie[i].interpretation === 3) {
                                        antibiotic.interpretationDisk = $filter('translate')('0564');
                                        break;
                                    }

                                }

                            }
                        }
                    }
                }
                // función para buscar y seleccionar un microrganismo en la lista de microorganismo
                function keyselect($event) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        var list = ($filter('filter')(vm.datamicroorganismo, vm.search));
                        list.forEach(function (value, key) {
                            value.selected = !value.selected;
                        });

                    }
                }
                // Función que trae una lista de sitios anatomicos
                function getsitesanatomical() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getanatomicalsites(auth.authToken).then(function (data) {
                        vm.methodgetcollection();
                        if (data.status === 200) {
                            vm.anatomicalsites = data.data;
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }

                //Función que trae una lista de metodos de recolección
                function methodgetcollection() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getcollectionmethod(auth.authToken).then(function (data) {
                        vm.getsubsample();
                        if (data.status === 200) {
                            vm.getcollectionmethod = data.data;
                        }
                        else {
                            vm.menssageinformative = $filter('translate')('0179');
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                //Función que trae una lista de submuestras
                function getsubsample() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getsubsamplesid(auth.authToken, vm.samplemicrobiology).then(function (data) {
                        vm.getDetailSample();
                        if (data.status === 200) {
                            vm.subSample = $filter('filter')(data.data, { selected: true });
                        }
                        else {
                            vm.menssageinformative = $filter('translate')('0179');
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                //Función que consulta la detección microobiana
                function microbialdetectione() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getmicrobialdetectione(auth.authToken, vm.order, vm.testId).then(function (data) {
                        if (data.status === 200) {
                            vm.datamicroorganismo = data.data.microorganisms;
                            if (vm.datamicroorganismo.length === 0) {
                                UIkit.modal('#ms-advertencia').show();
                                vm.loadingdata = false;
                            } else {
                                vm.getsitesanatomical();
                                vm.microorganismo = _.filter(vm.datamicroorganismo, ['selected', true]);
                                if (vm.microorganismo.length === 0) {
                                    vm.view2 = false;
                                }
                                UIkit.modal('#sensitivitiesmodal').show();
                                vm.loadingdata = false;
                            }
                        } else {
                            UIkit.modal('#ms-modal-advertencia').show();
                            vm.loadingdata = false;
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }
                vm.Savecomment = Savecomment;
                function Savecomment() {
                    if (vm.typecomment === 1) {
                        vm.comment = vm.comment1;
                    } else if (vm.typecomment === 2) {
                        vm.recount = vm.comment1;
                    } else if (vm.typecomment === 4) {
                        vm.complementations = vm.comment1;
                    }
                }

                //Función que guardar los antibioticos de la detección microobiana
                function Saveantiobiotics() {
                    vm.loadingdata = true;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var comment = vm.comment === undefined || vm.comment === '' ? '' : vm.comment.replace(/span/g, 'font');
                    comment = comment === undefined || comment === '' ? '' : comment.replace(new RegExp("<p>", 'g'), "<div>");
                    comment = comment === undefined || comment === '' ? '' : comment.replace(new RegExp("</p>", 'g'), "</div>");


                    var recount = vm.recount === undefined || vm.recount === '' ? '' : vm.recount.replace(/span/g, 'font');
                    recount = recount === undefined || recount === '' ? '' : recount.replace(new RegExp("<p>", 'g'), "<div>");
                    recount = recount === undefined || recount === '' ? '' : recount.replace(new RegExp("</p>", 'g'), "</div>");

                    var complementations = vm.complementations === undefined || vm.complementations === '' ? '' : vm.complementations.replace(/span/g, 'font');
                    complementations = complementations === undefined || complementations === '' ? '' : complementations.replace(new RegExp("<p>", 'g'), "<div>");
                    complementations = complementations === undefined || complementations === '' ? '' : complementations.replace(new RegExp("</p>", 'g'), "</div>");

                    var object = {
                        'id': vm.id,
                        'idMicrobialDetection': vm.idMicrobialDetection,
                        'test': vm.testId,
                        'comment': comment,
                        'recount': recount,
                        'complementations': complementations,
                        'resultsMicrobiology': vm.detailantibiotic

                    };
                    vm.Savedatamicroorganism();
                    return microbiologyDS.savemicrobiologyantiobiotics(auth.authToken, object, vm.order).then(function (data) {
                        vm.microbialdetectione();
                        vm.selected = 0;
                        vm.comment = '';
                        vm.detailantibiotic = [];
                        logger.success($filter('translate')('0149'));
                        if ($scope.functionexecute !== undefined) {
                            $scope.functionexecute();
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                //Función para guardar los datos microorganismo
                function Savedatamicroorganism() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var datainsert = {
                        'user': vm.detail.user,
                        'order': vm.detail.order,
                        'test': vm.detail.test,
                        'sample': vm.detail.sample,
                        'commentMicrobiology': vm.detail.commentMicrobiology
                    };

                    if (vm.getcollectionmethodid.selected !== undefined) {
                        if (vm.getcollectionmethodid.selected.length !== 0) {
                            datainsert.collectionMethod = vm.getcollectionmethodid.selected;
                        }
                    }

                    if (vm.anatomicalsitesid.selected !== undefined) {
                        if (vm.anatomicalsitesid.selected.length !== 0) {
                            datainsert.anatomicalSite = vm.anatomicalsitesid.selected;
                        }
                    }

                    if (vm.subSampleid.selected !== undefined) {
                        if (vm.subSampleid.selected.length !== 0) {
                            datainsert.subSample = vm.subSampleid.selected;
                        }
                    }


                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.insertantibiogram(auth.authToken, datainsert).then(function (data) {
                        if (data.status === 200) {

                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                //Función que guardar la detección microobiana
                function savedetectionmicroobiana() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var microbialdetection = {
                        'order': vm.order,
                        'test': vm.testId,
                        'microorganisms': $filter('filter')(vm.datamicroorganismo, { selected: true }),
                        'user': {
                            'id': auth.id
                        }
                    };
                    return microbiologyDS.insertmicrobialdetectione(auth.authToken, microbialdetection).then(function (data) {
                        if (data.status === 200) {
                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }
                            vm.microbialdetectione();
                            logger.success($filter('translate')('0149'));
                            vm.view2 = true;
                        }
                    }, function (error) {
                        if ($scope.functionexecute !== undefined) {
                            $scope.functionexecute();
                        }
                        UIkit.modal('#sensitivitiesmodal').hide();
                    });
                }
                //Función que evalua para guardar los datos
                function Savemicrobialdetection() {
                    vm.loadingdata = true;
                    vm.microorganismo = $filter('filter')(vm.datamicroorganismo, { selected: true });
                    vm.Savemicroorganism();
                }
                vm.Savemicroorganism = Savemicroorganism;
                //Función para guardar los datos microorganismo
                function Savemicroorganism() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var datainsert = {
                        'user': vm.detail.user,
                        'order': vm.detail.order,
                        'test': vm.detail.test,
                        'sample': vm.detail.sample,
                        'commentMicrobiology': vm.detail.commentMicrobiology
                    };
                    if (vm.getcollectionmethodid.selected !== undefined) {
                        if (vm.getcollectionmethodid.selected.length !== 0) {
                            datainsert.collectionMethod = vm.getcollectionmethodid.selected;
                        }
                    }
                    if (vm.anatomicalsitesid.selected !== undefined) {
                        if (vm.anatomicalsitesid.selected.length !== 0) {
                            datainsert.anatomicalSite = vm.anatomicalsitesid.selected;
                        }
                    }
                    if (vm.subSampleid.selected !== undefined) {
                        if (vm.subSampleid.selected.length !== 0) {
                            datainsert.subSample = vm.subSampleid.selected;
                        }
                    }
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.insertantibiogram(auth.authToken, datainsert).then(function (data) {
                        vm.savedetectionmicroobiana();
                        if (data.status === 200) {
                        }
                    }, function (error) {
                        if ($scope.functionexecute !== undefined) {
                            $scope.functionexecute();
                        }
                        UIkit.modal('#sensitivitiesmodal').hide();
                    });
                }
                //Funcion que obtiene los datos de los antibioticos
                function getantibiotic(id, idMicrobialDetection, comment, comments) {
                    vm.comment = '';
                    vm.comment1 = '';

                    var commentview = comment === undefined || comment === '' ? '' : comment.replace(/span/g, 'font');
                    commentview = commentview === undefined || commentview === '' ? '' : commentview.replace(new RegExp("<p>", 'g'), "<div>");
                    commentview = commentview === undefined || commentview === '' ? '' : commentview.replace(new RegExp("</p>", 'g'), "</div>");
                    vm.comment = commentview;

                    vm.recount = '';
                    var recount = comments.recount === undefined || comments.recount === '' ? '' : comments.recount.replace(/span/g, 'font');
                    recount = recount === undefined || recount === '' ? '' : recount.replace(new RegExp("<p>", 'g'), "<div>");
                    recount = recount === undefined || recount === '' ? '' : recount.replace(new RegExp("</p>", 'g'), "</div>");
                    vm.recount = recount;

                    vm.complementations = '';
                    var complementations = comments.complementations === undefined || comments.complementations === '' ? '' : comments.complementations.replace(/span/g, 'font');
                    complementations = complementations === undefined || complementations === '' ? '' : complementations.replace(new RegExp("<p>", 'g'), "<div>");
                    complementations = complementations === undefined || complementations === '' ? '' : complementations.replace(new RegExp("</p>", 'g'), "</div>");
                    vm.complementations = complementations;

                    vm.selected = id;
                    vm.id = id;
                    vm.detailantibiotic = [];
                    vm.idMicrobialDetection = idMicrobialDetection;
                    vm.cmiMPrint = false;
                    vm.diskPrint = false;
                    vm.loadingdata = true;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getidmicrobialdetection(auth.authToken, idMicrobialDetection, vm.order).then(function (data) {
                        if (data.status === 200) {
                            vm.detailantibiotic = data.data.length === 0 ? [] : removeDatasensitive(data);
                            vm.valuereference();
                        }
                        if (data.status === 204) {
                            logger.error($filter('translate')('1711'));
                        }
                        vm.loadingdata = false;
                    }, function (error) {
                        vm.modalError(error);
                    });
                }
                //Función que obtiene los valores de referencia de antibiotico
                function valuereference() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getreferenciemicroorganisms(auth.authToken, vm.id).then(function (data) {
                        if (data.status === 200) {
                            vm.valuereferencedata = data.data;
                        } else { vm.valuereferencedata = []; }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }
                //Función que recorre el arreglo de antibiticos y pone en true el valor de imprensión
                function removeDatasensitive(data) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    data.data.forEach(function (value, key) {
                        value.selected = true;
                    });
                    return data.data;
                }
                //Función que segun el id de la muestra selecciona los combos de microbiologia
                function getDetailSample() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getantibiogram(auth.authToken, vm.order, vm.testId).then(function (data) {
                        if (data.status === 200) {
                            //  vm.subSample = data.data.sample.subSamples;

                            if (data.data.anatomicalSite === undefined) {
                                vm.anatomicalsitesid.selected = [];
                            } else {
                                vm.edit = data.data.anatomicalSite.id === undefined ? true : false;
                                vm.anatomicalsitesid.selected = data.data.anatomicalSite.id === undefined ? [] : data.data.anatomicalSite;
                            }

                            if (data.data.collectionMethod === undefined) {
                                vm.getcollectionmethodid.selected = [];
                            } else {
                                vm.getcollectionmethodid.selected = data.data.collectionMethod.id === undefined ? [] : data.data.collectionMethod;
                            }

                            vm.filtersubSample = $filter('filter')(data.data.sample.subSamples, { selected: true });
                            vm.subSampleid.selected = vm.filtersubSample.length === 0 || vm.filtersubSample.length > 1 ? [] : vm.filtersubSample[0];
                            vm.subSampleid.selected = vm.filtersubSample.length === 1 ? vm.filtersubSample[0] : [];
                            vm.detail = data.data;

                        }
                        else {
                            vm.menssageinformative = $filter('translate')('0179');
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }

            }],
            controllerAs: 'modalsensitivities'
        };
        return directive;

    }

})();
