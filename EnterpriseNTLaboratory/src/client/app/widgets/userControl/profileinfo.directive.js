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
        .directive('profileinfo', profileinfo);
    profileinfo.$inject = ['testDS', 'orderDS', 'localStorageService'];
    /* @ngInject */
    function profileinfo(testDS, orderDS, localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/userControl/profileinfo.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.selectedTests = [];
                vm.selectTest = selectTest;
                vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
                vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        loadTests();
                        UIkit.modal('#profileinfo').show();
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
                                if (test.testType !== 0) {
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
                                }
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

                function selectTest(selected) {
                    var object = null;
                    vm.selectedTests = [];
                    if (selected.hasOwnProperty('originalObject')) {
                        object = selected.originalObject;
                        var profileId = object.id;
                        testDS.getProfileChilds(auth.authToken, object.id).then(
                            function (response) {
                                if (response.status === 200) {
                                    var childs = response.data;
                                    var selectedTests = [];
                                    childs.forEach(function (child, index) {
                                        selectedTests.push({
                                            'id': child.id,
                                            'code': child.code,
                                            'name': child.name
                                        });
                                    });
                                    vm.selectedTests = selectedTests;
                                } else {
                                    vm.selectedTests = [];
                                }
                            },
                            function (error) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                        );
                    }
                }

                /** 
                 * Funcion inicial de la directiva
                */
                function init() {
                }
                vm.init();
            }],
            controllerAs: 'profileinfo'
        };
        return directive;
    }
})();
