/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ... 
  PARAMETROS:   order      @descripción
                openmodal  @descripción
                state      @descripción
 
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
 
  MODIFICACIONES:
 
  1. aaaa-mm-dd. Autor
     Comentario...
 
********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('orderinterview', orderinterview);

    orderinterview.$inject = ['$hotkey', '$filter', 'localStorageService', 'orderinterviewDS', 'logger', '$mdSelect', '$window'];

    /* @ngInject */
    function orderinterview($hotkey, $filter, localStorageService, orderinterviewDS, logger, $mdSelect, $window) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/order-interview.html',
            scope: {
                order: '=?order',
                openmodal: '=openmodal',
                state: '=?state',
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.loadinterview = loadinterview;
                vm.orderlistinterview = orderlistinterview;
                vm.Saveinterview = Saveinterview;
                vm.modalError = modalError;
                vm.change = change;
                vm.datequestion = datequestion;
                vm.changelist = changelist;
                vm.searchTerm;
                vm.validatekey = false;
                vm.changeSelect = changeSelect;
                vm.clearSearchTerm = clearSearchTerm;
                vm.keydownsearch = keydownsearch;
                $hotkey.bind('enter', function (event) {
                    if (vm.validatekey) {
                        vm.Saveinterview(vm.Forminterview)
                    }
                });
                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.state = $scope.state === undefined ? false : $scope.state;
                        vm.loadinterview();
                        $scope.openmodal = false;
                    }
                });
                $scope.$watch('order', function () {
                    vm.order = $scope.order
                });
                function changelist(one, dos) {
                    dos.forEach(function (value, key) {
                        var answerlist = $filter('filter')(one, { id: value.id }, true)
                        if (answerlist.length === 0) {
                            value.selected = false;
                        } else {
                            value.selected = true;
                        }
                    })
                }
                function Saveinterview(Forminterview) {
                    if (Forminterview.$valid) {
                        var answerdate = $filter('filter')(vm.ListInterview, { control: 4 }, true);
                        answerdate.forEach(function (value, key) {
                            if (value.interviewAnswer !== undefined) {
                                value.interviewAnswer = moment(value.interviewAnswer).format();
                            }
                        })
                        auth = localStorageService.get('Enterprise_NT.authorizationData');
                        return orderinterviewDS.updateInterviewOrder(auth.authToken, vm.order, vm.ListInterview).then(function (data) {
                            logger.success($filter('translate')('0149'));
                            vm.validatekey = false;
                            UIkit.modal("#modalinterview").hide();
                        }, function (error) {
                        });
                    } else {
                        vm.ListInterview.forEach(function (value, key) {
                            if (value.control !== 4 && value.control !== 2) {
                                Forminterview["question" + value.id].$touched = true;
                            }
                        })
                    }
                }
                function change(data) {
                    if (data.required === true && data.interviewAnswer === null) {
                        data.interviewAnswer = 0;
                    }
                }
                function clearSearchTerm() {
                    vm.searchTerm = '';
                }
                function keydownsearch(ev) {
                    ev.stopPropagation();
                }
                function changeSelect(object, listgeneral) {
                    listgeneral.forEach(function (value, key) {
                        value.selected = value.id === object.id ? true : false;
                    })
                }
                function datequestion(startDate) {
                    if (startDate.interviewAnswer === null && startDate.required) {
                        startDate.interviewAnswer = moment().format();
                    } else if (startDate.interviewAnswer === null && !startDate.required) {
                        startDate.interviewAnswer = null;
                    }
                }
                function loadinterview() {
                    auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.ListInterview = [];
                    return orderinterviewDS.getInterviewOrder(auth.authToken, vm.order).then(function (data) {
                        if (data.status === 200) {
                            vm.ListInterview = data.data;
                            if (vm.ListInterview.length > 0) {
                                vm.ListInterview.forEach(function (value) {
                                    value.orderInterview = value.typeInterview.orderInterview;
                                    value.idInterview = value.typeInterview.id;
                                    value.nameInterview = value.typeInterview.name;
                                    if (value.control === 2) {
                                        value.interviewAnswer = value.interviewAnswer === undefined ? 0 : parseInt(value.interviewAnswer);
                                    } else if (value.control === 5) {
                                        value.answerSelected = $filter('filter')(value.answers, { selected: true }, true)[0];
                                        value.answerSelected = value.answerSelected;
                                    }
                                    else if (value.control === 6) {
                                        value.answerSelected = $filter('filter')(value.answers, { selected: true }, true)
                                    }
                                    else if (value.control === 4) {
                                        value.interviewAnswer = moment(value.interviewAnswer).format();
                                    }
                                })
                                //_.orderBy(vm.ListInterview, ['orderInterview', 'idInterview','order'], ['asc', 'asc', 'asc'])
                                vm.validatekey = true;
                                UIkit.modal("#modalinterview", {                                 
                                     modal: false
                                }).show();
                                setTimeout(function () { document.getElementById('question' + vm.ListInterview[0].id).select(); }, 500);
                            } else {
                                UIkit.modal("#advertencia-modalinterview").show();
                                vm.loadingdata = false;
                            }
                        } else {
                            UIkit.modal("#advertencia-modalinterview").show();
                            vm.loadingdata = false;
                        }

                    }, function (error) {
                        vm.modalError(error);
                    });
                }
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
                function modalError(error) {
                    vm.Errorinterview = error;
                    vm.ShowPopupErrorinterview = true;
                }
            }],
            controllerAs: 'orderinterview'
        };
        return directive;
    }
})();
/* jshint ignore:end */
