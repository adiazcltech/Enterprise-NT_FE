/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal   @descripcion
                currenttest @descripcion

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
        .directive('resultstestgraph', resultstestgraph);

    resultstestgraph.$inject = ['$filter', 'localStorageService'];

    /* @ngInject */
    function resultstestgraph($filter, localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testgraph.html',
            scope: {
                openmodal: '=openmodal',
                currenttest: '=currenttest'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;

                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ' HH:mm:ss';
                vm.tendencyGraph = tendencyGraph;
                vm.closemodaltestgraph = closemodaltestgraph;

                vm.tendency_char_options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a}: <br/>{c} ml',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        y: 'top',
                        data: [$filter('translate')('0499'), $filter('translate')('0289'), $filter('translate')('0500')]
                    },
                    grid: {
                        top: 40,
                        bottom: 40,
                        borderWidth: 1,
                        borderColor: '#ccc'
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: { onZero: true },
                        axisLabel: {
                            formatter: '{value}'
                        },
                        boundaryGap: false,
                        name: '',
                        data: ['', '', '', '', '']
                    },
                    yAxis: {
                        type: 'value',
                        scale: true,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        name: 'ml'
                    }
                };

                vm.tendency_char_data = [
                    {
                        name: $filter('translate')('0500'),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            normal: {
                                color: '#B71C1C',
                                width: 2,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 5,
                                shadowOffsetY: 5
                            }
                        },
                        data: ['', '0', '0', '0', '']
                    },
                    {
                        name: $filter('translate')('0289'),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            normal: {
                                color: '#5EBF71',
                                width: 2,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 5,
                                shadowOffsetY: 5
                            }
                        },
                        data: ['', '0', '0', '0', '']
                    },
                    {
                        name: $filter('translate')('0499'),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            normal: {
                                color: '#E85252',
                                width: 2,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 5,
                                shadowOffsetY: 5
                            }
                        },
                        data: ['', '0', '0', '0', '']
                    }
                ];

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.currenttest = $scope.currenttest;
                        vm.tendencyGraph();
                        UIkit.modal('#rs-modal-testgraph').show();
                        $scope.openmodal = false;
                    }
                });

                function tendencyGraph() {

                    vm.listgraphics = [];
                    var test = {};
                    test.options = JSON.parse(JSON.stringify(vm.tendency_char_options));
                    test.options.yAxis.name = vm.currenttest.unit.replace(/<[^>]*>?/g, '');
                    test.options.tooltip.formatter = '{a}: <br/>{c} ' + vm.currenttest.unit.replace(/<[^>]*>?/g, '');

                    var secondLastResultDate = vm.currenttest.secondLastResultDate === undefined ? '' : moment(vm.currenttest.secondLastResultDate).format(vm.formatDate);
                    var lastResultDate = vm.currenttest.lastResultDate === undefined ? '' : moment(vm.currenttest.lastResultDate).format(vm.formatDate);
                    var validationDate = vm.currenttest.state < 2 ? '' : moment(vm.currenttest.state >= 4 ? vm.currenttest.validationDate : vm.currenttest.resultDate).format(vm.formatDate);
                    test.options.xAxis.data = ['', secondLastResultDate, lastResultDate, validationDate, ''];

                    test.datagraphics = [
                        {
                            name: $filter('translate')('0500'),
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    color: '#B71C1C',
                                    width: 2,
                                    shadowColor: 'rgba(0,0,0,0.4)',
                                    shadowBlur: 5,
                                    shadowOffsetY: 5
                                }
                            },
                            data: ['', vm.currenttest.refMax, vm.currenttest.refMax, vm.currenttest.refMax, '']
                        },
                        {
                            name: $filter('translate')('0289'),
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    color: '#5EBF71',
                                    width: 2,
                                    shadowColor: 'rgba(0,0,0,0.4)',
                                    shadowBlur: 5,
                                    shadowOffsetY: 5
                                }
                            },
                            data: ['', vm.currenttest.secondLastResult, vm.currenttest.lastResult, vm.currenttest.result, '']
                        },
                        {
                            name: $filter('translate')('0499'),
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    color: '#E85252',
                                    width: 2,
                                    shadowColor: 'rgba(0,0,0,0.4)',
                                    shadowBlur: 5,
                                    shadowOffsetY: 5
                                }
                            },
                            data: ['', vm.currenttest.refMin, vm.currenttest.refMin, vm.currenttest.refMin, '']
                        }
                    ];

                    vm.listgraphics.push(test);
                }

                function closemodaltestgraph() {
                    UIkit.modal('#rs-modal-testgraph').hide();
                }

            }],
            controllerAs: 'resultstestgraph'
        };

        return directive;
    }
})();
/* jshint ignore:end */

