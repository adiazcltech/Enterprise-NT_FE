/*Se encontaron directivas en:

*/
/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
     
********************************************************************************/


(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('requirement', requirement);
    requirement.$inject = ['testDS', 'orderDS', 'localStorageService', '$translate', 'LZString','logger', '$filter'];
    /* @ngInject */
    function requirement(testDS, orderDS, localStorageService, $translate, LZString, logger, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/requirement.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.patient = '';
                vm.selectedTests = [];
                vm.tests = [];
                vm.selectTest = selectTest;
                vm.generate = generate;
                vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
                vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.patient = '';
                        loadTests();
                        UIkit.modal('#requirement').show();
                    }
                    $scope.openmodal = false;
                });

                /**
                * Carga en el autocomplete los examenes configurados
                */
                function loadTests() {
                    orderDS.getTestToOrderEntry(auth.authToken).then(function (response) {
                        if (response.data.length > 0) {
                            var tests = [];
                            response.data.forEach(function (test, index) {
                                tests.push({
                                    'id': test.id,
                                    'area': {
                                        'id': test.area.id,
                                        'abbreviation': test.area.abbreviation,
                                        'name': test.area.name
                                    },
                                    'code': test.code,
                                    'abbr': test.abbr.toUpperCase(),
                                    'name': test.name.toUpperCase(),
                                    'colorType': (test.testType === 0 ? 'images/test.png' : (test.testType === 1 ? 'images/profile.png' : 'images/package.png')),
                                    'type': test.testType,
                                    'confidential': test.confidential,
                                    'sample': {
                                        'id': test.sample.id,
                                        'code': test.sample.code,
                                        'name': test.sample.name
                                    },
                                    'showValue': test.code + '. ' + test.name.toUpperCase()
                                });
                            });
                            tests = tests.sort(function (a, b) {
                                if (a.code.trim().length > b.code.trim().length) {
                                    return 1;
                                } else if (a.code.trim().length < b.code.trim().length) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            vm.tests = tests;

                        }
                    }, function (error) {
                        vm.Error = error;
                        vm.ShowPopupError = true;
                    });
                }

                function generate() {
                    var tests = [];
                    vm.selectedTests.forEach(function (test, index) {
                        tests.push({
                            'id': test.id
                        });
                    });
                    testDS.getRequirements(auth.authToken, tests).then(
                        function (response) {
                            if (response.status === 200) {
                                var variables = [{
                                    'patient': vm.patient.toUpperCase(),
                                    'username': auth.userName,
                                    'date': moment().format(vm.dateFormat)
                                }];
                                var reportData = [];
                                response.data.forEach(function (requirement, index) {
                                    reportData.push({
                                        'id': requirement.id,
                                        'requirement': requirement.requirement
                                    });
                                });
                                var report = {};
                                report.variables = variables;
                                report.pathreport = '/Report/pre-analitic/requirement/requirement.mrt';
                                report.labelsreport = JSON.stringify($translate.getTranslationTable());
                                var compressReportData = LZString.compressToUTF16(JSON.stringify(reportData));
                                localStorageService.set('parameterReport', report);
                                localStorageService.set('dataReport', compressReportData);
                                window.open('/viewreport/viewreport.html');
                            }
                            else {
                                logger.warning($filter('translate')('3238'));                                

                            }
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    );
                }

                function selectTest(selected) {
                    var object = null;
                    var toDelete = false;
                    if (selected.hasOwnProperty('originalObject')) {
                        object = selected.originalObject;
                        if (typeof object !== 'object') {
                            toDelete = true;
                        }
                    } else {
                        object = select;
                    }
                    if (!toDelete) {
                        var exists = vm.selectedTests.find(function (test) {
                            return object.id === test.id;
                        });
                        if (exists === undefined) {
                            vm.selectedTests.push({
                                'id': object.id,
                                'code': object.code,
                                'name': object.name,
                            });
                        }
                    } else {
                        if (object.startsWith('-')) {
                            var code = object.substring(1);
                            var indexF = -1;
                            vm.selectedTests.forEach(function (test, index) {
                                if (test.code === code) {
                                    indexF = index;
                                }
                            });
                            if (indexF > -1) {
                                vm.selectedTests.splice(indexF, 1);
                            }
                        }
                    }
                }

                /** 
                 * Funcion inicial de la directiva
                */
                function init() {
                }
                vm.init();
            }],
            controllerAs: 'requirement'
        };
        return directive;
    }
})();
