/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   order @descripción
                state @descripción
 
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
 
  MODIFICACIONES:
 
  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
    'use strict';
 
    angular
        .module('app.widgets')
        .directive('interview', interview);
 
    interview.$inject = ['$filter', 'localStorageService', 'orderinterviewDS', 'logger'];
 
    /* @ngInject */
    //state = esta propiedad cuando es true es modo informativo, y no se pone la propiedad queda el control en modo edición
    function interview($filter, localStorageService, orderinterviewDS, logger) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/interview.html',
            scope: {
                order: '=?order',
                state: '=?state',
                dateorder: '=?dateorder',
            },
 
            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.loadinterview = loadinterview;
                vm.orderlistinterview = orderlistinterview;
                vm.loadItems = loadItems;
                vm.validRemoveTag = validRemoveTag;
                vm.validAddTag = validAddTag;
                vm.changeSelect = changeSelect;
                vm.Saveinterview = Saveinterview;
                vm.modalError = modalError;
                vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
 
                $scope.$watch('order', function () {
                    if ($scope.order) {
                        vm.order = $scope.order;
                        vm.state = $scope.state === undefined ? false : $scope.state;
                        vm.loadinterview();
                    }
                });

                //Metodo que consulta las entrevista asociada a la orden
                function loadinterview() {
                    auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.ListInterview = [];
                    return orderinterviewDS.getInterviewOrder(auth.authToken, vm.order).then(function (data) {
                        vm.ListInterview = data.data;
                        vm.dateorder = moment(data.data[0].lastTransaction).format(vm.formatDateHours)
                        if (vm.ListInterview.length > 0) {

                            vm.dateorder = (vm.ListInterview[0].lastTransaction === null || vm.ListInterview[0].lastTransaction === undefined)
                            ? undefined : moment(vm.ListInterview[0].lastTransaction).format(vm.formatDateHours);

                            vm.ListInterview.forEach(function (value, key) {
                                if (value.control === 5) {
                                    value.answers.selected = $filter('filter')(value.answers, { selected: true }, true);
 
                                    value.answertotal = value.answers.selected.length === 0 ? { name: 'null' } : value.answers.selected;
 
                                    value.answers.selected = value.answers.selected[0];
                                }
                                else if (value.control === 6) {
                                    value.answers.selected = $filter('filter')(value.answers, { selected: true }, true);
                                    value.answertotal = value.answers.selected.length === 0 ? { name: 'null' } : value.answers.selected;
                                }
                                else if (value.control === 4) {
                                    if (vm.state === false) {
                                        value.interviewAnswer = moment(value.interviewAnswer).format();
                                    } else {
                                        value.interviewAnswer = moment(value.interviewAnswer).format(vm.formatDateHours);
                                    }
                                }
                            });
                            return vm.ListInterview.sort(vm.orderlistinterview);
 
                        }
 
                    }, function (error) {
                        vm.modalError(error);
                    });
                }
                //Metodo que ordena las preguntas
                function orderlistinterview(a, b) {
                    if (a.order < b.order) {
                        return -1;
                    }
                    else if (a.order > b.order) {
                        return 1;
                    }
                    else {
                        if (a.name > b.name) {
                            return -1;
                        }
                        else if (a.name < b.name) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                }
                function loadItems(tag, items) {
                    return $filter('filter')(items, { name: tag });
                }
                //Metodo que valida y elimina los tags
                function validRemoveTag(tag, listgeneral) {
                    listgeneral.forEach(function (value, key) {
                        value.selected = value.id === parseInt(tag.id) ? false : value.selected;
                    });
                }
                //Metodo que adiciona los tags
                function validAddTag(tag, listgeneral) {
                    listgeneral.forEach(function (value, key) {
                        value.selected = value.id === parseInt(tag.id) ? true : value.selected;
                    });
                }
 
                function changeSelect(object, listgeneral) {
                    listgeneral.forEach(function (value, key) {
                        value.selected = value.id === object.id ? true : false;
                    });
                }
                //Metodo que guarda la entrevista
                function Saveinterview() {
                    var answerdate = $filter('filter')(vm.ListInterview, { control: 4 }, true);
                    answerdate.forEach(function (value, key) {
                        if (value.interviewAnswer !== undefined) {
                            value.interviewAnswer = moment(value.interviewAnswer).format();
                        }
                    });
                    auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return orderinterviewDS.updateInterviewOrder(auth.authToken, vm.order, vm.ListInterview).then(function (data) {
                        logger.success($filter('translate')('0149'));
                        vm.loadinterview();
                    }, function (error) {
                        vm.modalError();
                    });
                }
                //Metodo que lalama el modal error
                function modalError(error) {
                    vm.Errorinterview = error;
                    vm.ShowPopupErrorinterview = true;
                }
            }],
            controllerAs: 'interview'
        };
        return directive;
    }
})();
/* jshint ignore:end */
