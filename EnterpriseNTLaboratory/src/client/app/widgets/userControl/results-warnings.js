/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal     @descripción
                currentwarnings @descripción

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
        .directive('resultswarnings', resultswarnings);

    resultswarnings.$inject = ['$filter'];

    /* @ngInject */
    function resultswarnings($filter) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-warnings.html',
            scope: {
                openmodal: '=openmodal',
                currentwarnings: '=currentwarnings',
                questions: '=questions',
                panictest: '=panictest',
                reporteddoctor: '=reporteddoctor',
                functionexecute: '=functionexecute',
                order: '=order',
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.closemodalwarnings = closemodalwarnings;
                vm.savevalidate = savevalidate;
                vm.getpathologyicon = getpathologyicon;
                vm.changelist = changelist;
                vm.searchTerm;
                vm.datequestion = datequestion;
                vm.change = change;
                vm.keydownsearch = keydownsearch;
                vm.clearSearchTerm = clearSearchTerm;

                vm.reportedDoctor = moment().format();;
                vm.formatDate = 'dd/MM/yyyy, HH:mm:ss';
                vm.max = moment().format();
                vm.startChange = startChange;

                function startChange() {
                    if (!vm.reportedDoctor) {
                        vm.reportedDoctor = null;
                    }
                }

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.order = $scope.order === undefined ? '' : $scope.order;
                        vm.currentwarnings = $scope.currentwarnings;
                        vm.warningsbytest = $filter('filter')(vm.currentwarnings, { type: '1' });
                        vm.warningsbysurvey = $filter('filter')(vm.currentwarnings, { type: '2' });
                        vm.questions = $scope.questions;
                        vm.panictest = $scope.panictest;
                        if ($scope.questions.length === 0 && $scope.currentwarnings.length > 0) {
                            setTimeout(function () { $scope.functionexecute(); }, 100);
                            UIkit.modal('#advertencia-modalwarnings').show();
                        }
                        else {
                            vm.questions.forEach(function (value) {
                                if (value.control === 4) {
                                    value.interviewAnswer = moment(value.interviewAnswer).format();
                                } else if (value.control === 2) {
                                    value.interviewAnswer = value.interviewAnswer === undefined ? 0 : parseInt(value.interviewAnswer);
                                }
                            });
                            UIkit.modal('#rs-modal-warnings', { modal: false }).show();
                        }
                        $scope.openmodal = false;
                    }
                });

                function change(data) {
                    if (data.required === true && data.interviewAnswer === null) {
                        data.interviewAnswer = 0;
                    }
                }

                vm.closed=closed;
                function closed() {
                    UIkit.modal('#rs-modal-warnings').hide();
                }

                function changelist(one, dos) {
                    dos.forEach(function (value, key) {
                        if (value.id === one.id) {
                            value.selected = true;
                        } else {
                            value.selected = false;
                        }
                    });
                }
                function datequestion(startDate) {
                    if (startDate.interviewAnswer === null && startDate.required) {
                        startDate.interviewAnswer = moment().format();
                    } else if (startDate.interviewAnswer === null && !startDate.required) {
                        startDate.interviewAnswer = null;
                    }
                }

                function clearSearchTerm() {
                    vm.searchTerm = '';
                }

                function keydownsearch(ev) {
                    ev.stopPropagation();
                }

                function closemodalwarnings() {
                    UIkit.modal('#rs-modal-warnings').hide();
                }

                function savevalidate(Forminterview) {
                    //TODO: las dos lineas siguientes son para pruebas, cambiar condiciones en html de patologia.
                    //vm.questions[0].open = true;
                    //vm.questions[0].interviewAnswer = 'respuesta abierta';
                    if (Forminterview.$valid && vm.reportedDoctor) {
                        $scope.questions = vm.questions;
                        $scope.reporteddoctor = vm.reportedDoctor;
                        setTimeout(function () { $scope.functionexecute(); }, 100);
                        UIkit.modal('#rs-modal-warnings').hide();
                    } else {
                        vm.questions.forEach(function (value) {
                            if (value.control !== 4 && value.control !== 2) {
                                Forminterview['question' + value.id].$touched = true;
                            }
                        });
                    }

                }

                function getpathologyicon(pathology) {
                    switch (pathology) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return '';
                        case 4:
                        case 7:
                            return 'uk-icon-exclamation-triangle uk-text-danger';
                        case 5:
                        case 8:
                            return 'uk-icon-angle-double-down uk-text-danger uk-icon-small';
                        case 6:
                        case 9:
                            return 'uk-icon-angle-double-up uk-text-danger uk-icon-small';
                        default:
                            return '';
                    }
                }


            }],
            controllerAs: 'resultswarnings'
        };

        return directive;
    }
})();
/* jshint ignore:end */

