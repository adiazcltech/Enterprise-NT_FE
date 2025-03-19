
(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultstesthistory', resultstesthistory);

    resultstesthistory.$inject = ['$q', '$filter', 'localStorageService', '$timeout', 'logger', 'orderDS'];

    /* @ngInject */
    function resultstesthistory($q, $filter, localStorageService, $timeout, logger, orderDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/results-testhistory.html',
            scope: {
                openmodal: '=openmodal',
                patientid: '=?patientid',
                patientname: '=?patientname',
                photopatient: '=?photopatient',
                tests: '=?tests'
            },

            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.historyData = [];
                vm.detailtest = [];
                vm.load = load;
                vm.close = close;
                vm.getResultsHistory = getResultsHistory;
                vm.loaddetailtest = loaddetailtest;
                vm.closedetailtest = closedetailtest;
                vm.filterlist = filterlist;
                vm.modalError = modalError;
                vm.loading = false;
                vm.graphgroup = false;
                vm.tabactive = 1;


                $scope.openmodal = false;

                vm.options = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    legend: {
                        data: [$filter('translate')('0115'), $filter('translate')('0129'), $filter('translate')('0130')]
                    },
                    xAxis: {
                        name: $filter('translate')('0131'),
                        nameLocation: 'middle',
                        nameGap: '30',
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        name: $filter('translate')('0115'),
                        type: 'value',
                        nameGap: '10',
                    }
                }

                vm.optionsgraphgroup = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    legend: {
                        data: [],
                        orient: 'vertical',
                        x: 'left',
                        y: 'bottom',
                        z: 10,
                        zlevel: 10,
                        itemHeight: 10,
                        itemMarginTop: 2,
                        itemMarginBottom: 2
                    },
                    grid: {
                        y: 45,
                        x: 45,
                        y2: 100
                    },
                    xAxis: {
                        name: $filter('translate')('0131'),
                        nameLocation: 'middle',
                        nameGap: '30',
                        type: 'value',
                        boundaryGap: false,
                        inverse: true,
                        axisLine: { onZero: false }


                    },
                    yAxis: {
                        name: $filter('translate')('0115'),
                        type: 'value',
                        axisLine: { onZero: false }

                    }
                }

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', h:mm:ss a';
                        vm.Historico = localStorageService.get('Historico');
                        vm.Historico = vm.Historico === 'True' || vm.Historico === 'true' ? true : false;
                        vm.HistoricoGrafica = localStorageService.get('HistoricoGrafica');
                        vm.HistoricoGrafica = vm.HistoricoGrafica === 'True' || vm.HistoricoGrafica === 'true' ? true : false;
                        vm.HistoricoCombinado = localStorageService.get('HistoricoCombinado');
                        vm.HistoricoCombinado = vm.HistoricoCombinado === 'True' || vm.HistoricoCombinado === 'true' ? true : false;
                        vm.patientid = $scope.patientid;
                        vm.photopatient = $scope.photopatient === undefined || $scope.photopatient === null ? '' : $scope.photopatient;
                        vm.patientname = $scope.patientname;
                        vm.graphgroup = false;
                        vm.tabactive = 1;
                        vm.load();
                        $scope.openmodal = false;
                    }
                });


                function load() {
                    vm.getResultsHistory();
                }

                function close() {
                    UIkit.modal('#rs-modal-testhistory').hide();
                }

                function getResultsHistory() {
                    var listtest = [];
                    vm.listgraphics = [];
                    vm.graphnumbergroup = [];

                    $scope.tests.forEach(function (item) {
                        listtest.push(item.testId)
                    });

                    var patient = {
                        "id": $scope.patientid,
                        "testId": listtest
                    }

                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.loading = true;
                    return orderDS.getResultsHistory(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {

                            var validlist = $filter('filter')(data.data, { testCode: '!!' });

                            if (validlist.length > 0) {
                                data.data.forEach(function (item) {

                                    if (item.history.length > 0) {
                                        item.history = $filter('orderBy')(item.history, 'validateDate', true);

                                        var test = {};
                                        test.name = item.testCode + ' ' + item.testName;
                                        test.type = item.resultType;
                                        test.testdetail = [];

                                        if (item.resultType === 1) {
                                            test.options = JSON.parse(JSON.stringify(vm.options));
                                            test.datagraphics = [
                                                {
                                                    name: $filter('translate')('0115'),
                                                    type: 'line',
                                                    data: []
                                                },
                                                {
                                                    name: $filter('translate')('0129'),
                                                    type: 'line',
                                                    data: []
                                                },
                                                {
                                                    name: $filter('translate')('0130'),
                                                    type: 'line',
                                                    data: []
                                                }];

                                            var testgroup = {
                                                name: item.testCode + ' ' + item.testName,
                                                type: 'line',
                                                data: []
                                            }
                                            vm.optionsgraphgroup.legend.data.push(item.testCode + ' ' + item.testName)

                                            var index = item.history.length + 1;
                                            item.history.forEach(function (itemhistory, key) {
                                                index = index - 1;
                                                test.datagraphics[0].data.push(itemhistory.resultNumber === null ? '' : itemhistory.resultNumber);
                                                test.datagraphics[1].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMin);
                                                test.datagraphics[2].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMax);
                                                test.options.xAxis.data.push(index.toString());


                                                testgroup.data.push(itemhistory.resultNumber === null ? '' : [index, itemhistory.resultNumber]);


                                                var detail = {
                                                    datevalid: moment(itemhistory.validateDate).format(vm.formatDate),
                                                    order: itemhistory.order,
                                                    result: itemhistory.result,
                                                    referencevalues: itemhistory.refMin !== null ? (itemhistory.refMin + ' - ' + itemhistory.refMax) : '',
                                                    patology: itemhistory.pathology === 0 ? $filter('translate')('0132') : '*'
                                                }

                                                test.testdetail.push(detail);



                                            });

                                            vm.graphnumbergroup.push(testgroup)
                                        }

                                        else {
                                            item.history.forEach(function (itemhistory, key) {
                                                var detail = {
                                                    datevalid: moment(itemhistory.validateDate).format(vm.formatDate),
                                                    order: itemhistory.order,
                                                    result: itemhistory.result,
                                                    referencevalues: itemhistory.refLiteral !== null ? itemhistory.refLiteral : '',
                                                    patology: itemhistory.pathology === 0 ? $filter('translate')('0132') : '*'
                                                }

                                                test.testdetail.push(detail);
                                            })
                                        }
                                        test.testdetail = test.testdetail.reverse();
                                        vm.listgraphics.push(test);

                                    }
                                });

                                vm.listgraphicsALL = vm.listgraphics;
                                UIkit.modal("#rs-modal-testhistory").show();
                            }
                            else {
                                UIkit.modal("#rs-modal-testhistoryerror").show();
                            }


                        }
                        else {
                            UIkit.modal("#rs-modal-testhistoryerror").show();
                        }

                        vm.loading = false;
                    }, function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                    });
                }

                function filterlist(type) {
                    vm.listgraphics = [];
                    vm.graphgroup = '';
                    switch (type) {
                        case 1:
                            vm.tabactive = 2;
                            vm.listgraphics = $filter('filter')(vm.listgraphicsALL, { type: 2 });
                            vm.graphgroup = false;
                            break;
                        case 2:
                            vm.tabactive = 3;
                            vm.listgraphics = $filter('filter')(vm.listgraphicsALL, { type: 1 });
                            vm.graphgroup = false;
                            break;
                        case 3:
                            vm.tabactive = 4;
                            vm.listgraphics = $filter('filter')(vm.listgraphicsALL, { type: 1 });
                            if (vm.listgraphics.length > 0) {
                                vm.graphgroup = true;
                            }

                            break;
                        default:
                            vm.tabactive = 1;
                            vm.listgraphics = vm.listgraphicsALL;
                            vm.graphgroup = false;
                    }

                }

                function loaddetailtest(detailtest) {
                    vm.detailtest = detailtest;
                    UIkit.modal("#rs-modal-testhistorydetail").show();
                }

                function closedetailtest(detailtest) {
                    vm.detailtest = detailtest;
                    UIkit.modal("#rs-modal-testhistory").show();
                }

                function modalError(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                }
            }],
            controllerAs: 'vmd'
        };
        return directive;
    }
})();

/* jshint ignore:end */
