/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal
                order
                sample
                functionexecute
                patientinformation
                photopatient
                idtest
                notes

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        // Filtro para pintar el texto enriquecido
        .filter('trust', ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }])
        .directive('modaltaskmicrobiology', modaltaskmicrobiology);

    modaltaskmicrobiology.$inject = ['microbiologyDS', 'patientDS', 'moment', 'localStorageService', '$filter', 'logger', 'userDS'];
    /* @ngInject */
    function modaltaskmicrobiology(microbiologyDS, patientDS, moment, localStorageService, $filter, logger, userDS) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-taskmicrobiology.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=order',
                sample: '=sample',
                functionexecute: '=functionexecute',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                idtest: '=idtest',
                notes: '=notes'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.getdetailtask = getdetailtask;
                vm.listuser = listuser;
                vm.loadphotopatient = loadphotopatient;
                vm.modalError = modalError;
                vm.closemodal = closemodal;
                vm.detailtask = [];
                vm.photopatient = '';
                vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
                vm.viewtask = viewtask;
                vm.newdisabled = true;
                vm.taskdetail = [];
                vm.updatecommenttask = updatecommenttask;
                vm.trackingcomment = trackingcomment;
                vm.removeData = removeData;
                vm.namewindows = '#taskmodalmicrobiology';
                vm.notes = [];
                vm.viewcomment = false;

                $scope.$on('selection-changed', function (e, node) {
                    vm.idtask = undefined;
                    vm.taskdetail = [];
                    vm.newdisabled = true;
                    if (node.image === 'images/microbiology/clipboard.png') {
                        vm.idtask = node.id;
                        vm.tasktype = node.type;
                        vm.newdisabled = false;
                    }
                    if (node.image === 'images/microbiology/oval.png') {
                        vm.newdisabled = true;
                        vm.type = node.type;
                        if (node.type === 1) {
                            var taskdetail = $filter('filter')(vm.mediaCulturestask, { id: node.id }, true);
                            vm.taskdetail = $filter('filter')(taskdetail[0].tasks, { lastTransaction: node.lastTransaction }, true)[0];
                            vm.datemodificationcomment = moment(vm.taskdetail.lastTransaction).format(vm.formatDateHours);
                            vm.trackingcomment();
                        }
                        if (node.type === 2) {
                            var taskdetail = $filter('filter')(vm.mediaProceduretask, { id: node.id }, true);
                            vm.taskdetail = $filter('filter')(taskdetail[0].tasks, { lastTransaction: node.lastTransaction }, true)[0];
                            vm.datemodificationcomment = moment(vm.taskdetail.lastTransaction).format(vm.formatDateHours);
                            vm.trackingcomment();
                        }

                    }
                });

                vm.options = { expandOnClick: true };

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.order = $scope.order;
                        vm.sample = $scope.sample;
                        vm.testId = $scope.idtest;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;                        
                        vm.getdetailtask();
                        vm.taskdetail = [];
                        vm.notes = $scope.notes;
                        UIkit.modal('#taskmodalmicrobiology').show();
                    }
                    $scope.openmodal = false;
                });
                // función para la ventana de error
                function modalError(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                }
                // función para cerrar la ventana 
                function closemodal() {
                    UIkit.modal('#taskmodalmicrobiology').hide();
                    vm.open = false;
                }
                // función para consultar los usuario
                function listuser() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    userDS.getUsers(auth.authToken).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.user = response.data;
                            }                           
                        },
                        function (error) {
                            vm.modalError(error);
                        });
                }
                // función para consultar foto del paciente
                function loadphotopatient(idpatient) {
                    vm.viewcomment = true;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    patientDS.getPhotoPatient(auth.authToken, idpatient).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.photopatient = response.data.photoInBase64;
                            }                        
                        },
                        function (error) {
                            vm.modalError(error);
                        });
                }
                // función para actualizar el commentario de tareas
                function updatecommenttask() {
                    vm.taskdetail.comment = vm.comment1;
                    vm.taskdetail.type = vm.type;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    microbiologyDS.updatetaskmicrobiology(auth.authToken, vm.taskdetail).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.trackingcomment();
                                logger.success($filter('translate')('0149'));
                            }
                        },
                        function (error) {
                            vm.modalError(error);

                        });
                }

           

                function removeData(data) {
                    data.data.forEach(function (value, key) {
                        data.data[key].datemoment = moment(value.date).format(vm.formatDateHours);
                        data.data[key].photo = $filter('filter')(vm.user, { id: value.user.id }, true)[0].photo;

                    });
                    return data.data;
                }
                // función para consultar el commentario de las tareas
                function trackingcomment() {
                    vm.commenttracking = [];
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    microbiologyDS.getaskstrackingmicrobiology(auth.authToken, vm.taskdetail.id, vm.detailtask.order.orderNumber, vm.detailtask.test.id).then(
                        function (data) {
                            if (data.status === 200) {
                                if (data.data.length === 1) { vm.commenttracking = []; } else {
                                    vm.commenttracking = data.data.length === 0 ? data.data : removeData(data);
                                }
                            }
                        },
                        function (error) {
                            vm.modalError(error);

                        });
                }           
                // Función para contruir el json para la lista 
                function viewtask() {
                    vm.listuser();
                    var children = [];

                    for (var i = 0; i < vm.mediaCulturestask.length; i++) {
                        if (vm.mediaCulturestask[i].tasks.length === 0) {
                            var object = {
                                id: vm.mediaCulturestask[i].id,
                                name: vm.mediaCulturestask[i].name,
                                type: 1,
                                image: 'images/microbiology/clipboard.png'
                            };
                            children.push(object);

                        } else {
                            var childrendate = [];

                            for (var j = 0; j < vm.mediaCulturestask[i].tasks.length; j++) {

                                var object = {
                                    id: vm.mediaCulturestask[i].id,
                                    type: 1,
                                    lastTransaction: vm.mediaCulturestask[i].tasks[j].lastTransaction,
                                    name: moment(vm.mediaCulturestask[i].tasks[j].lastTransaction).format(vm.formatDateHours),
                                    image: 'images/microbiology/oval.png'
                                };
                                childrendate.push(object);

                            }
                            var objectdata = {
                                id: vm.mediaCulturestask[i].id,
                                name: vm.mediaCulturestask[i].name,
                                type: 1,
                                image: 'images/microbiology/clipboard.png',
                                children: childrendate
                            };
                            children.push(objectdata);

                        }
                    }

                    var childrenProcedure = [];
                    for (var i = 0; i < vm.mediaProceduretask.length; i++) {
                        if (vm.mediaProceduretask[i].tasks.length === 0) {
                            var object = {
                                id: vm.mediaProceduretask[i].id,
                                name: vm.mediaProceduretask[i].name,
                                type: 2,
                                image: 'images/microbiology/clipboard.png'
                            };
                            childrenProcedure.push(object);

                        } else {
                            var childrendateprocedure = [];

                            for (var j = 0; j < vm.mediaProceduretask[i].tasks.length; j++) {

                                var object = {
                                    id: vm.mediaProceduretask[i].id,
                                    type: 2,
                                    lastTransaction: vm.mediaProceduretask[i].tasks[j].lastTransaction,
                                    name: moment(vm.mediaProceduretask[i].tasks[j].lastTransaction).format(vm.formatDateHours),
                                    image: 'images/microbiology/oval.png'
                                };
                                childrendateprocedure.push(object);

                            }
                            var objectdata = {
                                id: vm.mediaProceduretask[i].id,
                                name: vm.mediaProceduretask[i].name,
                                type: 2,
                                image: 'images/microbiology/clipboard.png',
                                children: childrendateprocedure
                            };
                            childrenProcedure.push(objectdata);

                        }
                    }

                    var mediaCultures = {
                        'image': 'images/microbiology/cell.png',
                        'name': $filter('translate')('0486'),
                        'children': children
                    };


                    var procedure = {
                        'image': 'images/microbiology/test-tube.png',
                        'name': $filter('translate')('0487'),
                        'children': childrenProcedure
                    };

                    if (vm.mediaCulturestask.length === 0) {
                        vm.basicTree = [procedure];
                    }
                    else if (vm.mediaCulturestask.length === 0) {
                        vm.basicTree = [mediaCultures];
                    } else {
                        vm.basicTree = [procedure, mediaCultures];
                    }
                }
                // función para que consulta las tareas y todo los datos de la ventana modal
                function getdetailtask() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getasksorder(auth.authToken, vm.order, vm.sample).then(function (data) {
                        if (data.status === 200) {
                            vm.detailtask = data.data;
                            vm.testdata = $filter('filter')(vm.detailtask.sample.tests, { id: vm.testId }, true);
                            vm.datevericationmicro = moment(vm.detailtask.lastTransaction).format(vm.formatDateHours);
                            vm.uservericationmicro = vm.detailtask.user.name + ' ' + vm.detailtask.user.lastName;
                            vm.dateGrowth = moment(vm.detailtask.dateGrowth).format(vm.formatDateHours);
                            vm.userGrowth = vm.detailtask.userGrowth.name + ' ' + vm.detailtask.userGrowth.lastName;
                            vm.dateresult = vm.testdata[0].result.dateResult === undefined ? '.' : moment(vm.testdata[0].result.dateResult).format(vm.formatDateHours);
                            vm.userresult = vm.testdata[0].result.userResult.id === undefined ? '.' : vm.testdata[0].result.userResult.name + ' ' + vm.testdata[0].result.userResult.lastName;
                            vm.anatomicalSitecard = vm.detailtask.collectionMethod === undefined ? '.' : vm.detailtask.collectionMethod.name;
                            vm.collectionMethodcard = vm.detailtask.anatomicalSite === undefined ? '.' : vm.detailtask.anatomicalSite.name;

                            vm.mediaCulturestask = vm.detailtask.mediaCultures;
                            vm.mediaProceduretask = vm.detailtask.procedures;
                            vm.viewtask();
                            vm.loadphotopatient(vm.detailtask.order.patient.id);

                            if ($scope.functionexecute !== undefined) {
                                $scope.functionexecute();
                            }

                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                function init() {
                }
                vm.init();

            }],
            controllerAs: 'modaltaskmicrobiology'
        };
        return directive;
    }
})();
