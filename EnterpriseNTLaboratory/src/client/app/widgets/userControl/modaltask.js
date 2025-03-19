/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                order               @descripción
                test                @descripción
                testcode            @descripción
                testname            @descripción
                typetaask           @descripción
                closed              @descripción
                idcontrol           @descripción
                idtask              @descripción 
                functionexecute     @descripción
                patientinformation  @descripción
                photopatient        @descripción

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
        .directive('modaltask', modaltask);

    //typetaask === 1 Medios de cultivo
    //typetaask === 2 procedimientos

    modaltask.$inject = ['microbiologyDS', 'localStorageService', '$filter', 'logger'];
    /* @ngInject */
    function modaltask(microbiologyDS, localStorageService, $filter, logger) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-task.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=order',
                test: '=test',
                testcode: '=testcode',
                testname: '=testname',
                typetaask: '=typetaask',
                closed: '=closed',
                idcontrol: '=?idcontrol',
                idtask: '=?idtask',
                functionexecute: '=functionexecute',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.getprocedure = getprocedure;
                vm.getmediacultures = getmediacultures;
                vm.modalError = modalError;
                vm.keyselect = keyselect;
                vm.closemodal = closemodal;
                vm.Savetaskmediaculture = Savetaskmediaculture;
                vm.Savetaskprocedure = Savetaskprocedure;
                vm.getlisttask = getlisttask;
                vm.getdestinations = getdestinations;
                vm.mediacultures = [];
                vm.procedure = [];
                vm.destinations = [];
                vm.comment = '';
                vm.idcontrol = '1';

                $scope.$watch('idcontrol', function () {
                    if ($scope.idcontrol !== undefined) {
                        vm.idcontrol = $scope.idcontrol;
                    }
                });

                $scope.$watch('idtask', function () {
                    vm.idtask = $scope.idtask;
                });


                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.comment = '';
                        vm.type = $scope.typetaask;
                        vm.order = $scope.order;
                        vm.test = $scope.test;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.namewindows = $scope.closed;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.getlisttask();
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
                    if (vm.idtask === undefined) {
                        UIkit.modal('#taskmodal' + vm.idcontrol).hide();
                    } else {
                        UIkit.modal(vm.namewindows).show();
                    }

                }
                // función para seleccionar los elementos de la lista de tareas
                function keyselect($event) {

                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        var list = ($filter('filter')(vm.task, vm.search));
                        list.forEach(function (value, key) {
                            value.selected = !value.selected;
                        });

                    }
                }
                // función para  lista de medios de cultivo
                function getmediacultures() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.gettestmediaculturesid(auth.authToken, vm.test).then(function (data) {
                        vm.getdestinations();
                        if (data.status === 200) {
                            vm.mediacultures = $filter('filter')(data.data.mediaCultures, { select: true });
                            vm.mediacultures.selected = 0;
                            if (vm.idtask !== undefined && vm.type === 1) {
                                vm.mediacultures.selected = $filter('filter')(data.data.mediaCultures, { id: vm.idtask }, true)[0];
                            } else if (vm.mediacultures.length === 1) {
                                vm.mediacultures.selected = vm.mediacultures[0];
                            }
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }

                // función para  lista de procedimientos
                function getprocedure() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.gettestprocedureid(auth.authToken, vm.test).then(function (data) {
                        vm.getmediacultures();
                        if (data.status === 200) {
                            vm.procedure = $filter('filter')(data.data, { procedure: { selected: true } });
                            vm.procedure.selected = 0;
                            if (vm.idtask !== undefined && vm.type === 2) {
                                vm.procedure.selected = $filter('filter')(data.data, { procedure: { id: vm.idtask } }, true)[0];
                            } else if (vm.procedure.length === 1) {
                                vm.procedure.selected = vm.mediacultures[0];
                            }

                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                // función para  lista de destinos
                function getdestinations() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getdetinationsmicrobiology(auth.authToken).then(function (data) {
                        UIkit.modal('#taskmodal' + vm.idcontrol).show();
                        if (data.status === 200) {
                            vm.destinations = data.data;
                            vm.destinations.selected = 0;
                            if (vm.destinations.length === 1) {
                                vm.destinations.selected = vm.destinations[0];
                            }
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                // función para  lista de tareas
                function getlisttask() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return microbiologyDS.getasks(auth.authToken).then(function (data) {
                        vm.getprocedure();
                        if (data.status === 200) {
                            vm.task = data.data;
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                // función para  salvar tareas medios de cultivo
                function Savetaskmediaculture() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var object = {
                        'id': null,
                        'order': vm.order,
                        'idTest': vm.test,
                        'idRecord': vm.type === 1 ? vm.mediacultures.selected.id : vm.procedure.selected.procedure.id,
                        'destination': vm.destinations.selected,
                        'comment': vm.comment,
                        'type': vm.type,
                        'tasks': $filter('filter')(vm.task, { selected: true }),
                        'user': {
                            'id': auth.id
                        }
                    };

                    return microbiologyDS.Newtasksmediaculture(auth.authToken, object).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0149'));
                            if (vm.idtask === undefined) {
                                vm.mediacultures.selected = 0;
                                vm.procedure.selected = 0;
                                vm.destinations.selected = 0;
                                vm.comment = '';
                                vm.getlisttask();
                            } else {
                                setTimeout(function () {
                                    UIkit.modal(vm.namewindows).show();
                                }, 100);

                            }
                            $scope.functionexecute();

                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                // función para  salvar tareas procedimiento
                function Savetaskprocedure() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var object = {
                        'id': null,
                        'order': vm.order,
                        'idTest': vm.test,
                        'idRecord': vm.type === 1 ? vm.mediacultures.selected.id : vm.procedure.selected.procedure.id,
                        'destination': vm.destinations.selected,
                        'comment': vm.comment,
                        'type': vm.type,
                        'tasks': $filter('filter')(vm.task, { selected: true }),
                        'user': {
                            'id': auth.id
                        }
                    };
                    return microbiologyDS.Newtasksprocedure(auth.authToken, object).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0149'));
                            if (vm.idtask === undefined) {
                                vm.procedure.selected = 0;
                                vm.destinations.selected = 0;
                                vm.comment = '';
                                vm.getlisttask();
                            } else {
                                setTimeout(function () {

                                    UIkit.modal(vm.namewindows).show();
                                }, 100);


                            }
                            $scope.functionexecute();
                        }
                    }, function (error) {
                        vm.modalError(error);

                    });
                }
                function init() {
                }
                vm.init();

            }],
            controllerAs: 'modaltask'
        };
        return directive;

    }

})();
