/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal       @descripcion  
                patientid       @descripcion
                patientname     @descripcion
                photopatient    @descripcion
                tests           @descripcion
    
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
        .directive('resultstesthistory', resultstesthistory);

    resultstesthistory.$inject = ['$filter', 'localStorageService', 'resultsentryDS'];

    /* @ngInject */
    function resultstesthistory($filter, localStorageService, resultsentryDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testhistory.html',
            scope: {
                openmodal: '=openmodal',
                patientid: '=?patientid',
                patientname: '=?patientname',
                photopatient: '=?photopatient',
                tests: '=?tests',
                order: '=?order',
                patientinformation: '=patientinformation',
                notes: '=notes',
                orderdemo: '=?orderdemo',
            },

            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.historyData = [];
                vm.detailtest = [];
                vm.load = load;
                vm.close = close;
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
                vm.typedocumentkey = localStorageService.get('ManejoTipoDocumento');
                vm.label = vm.typedocumentkey === 'True' ? $filter('translate')('0132') : $filter('translate')('0117')
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
                        data: [$filter('translate')('0289'), $filter('translate')('0499'), $filter('translate')('0500')]
                    },
                    xAxis: {
                        name: $filter('translate')('0656'),
                        nameLocation: 'middle',
                        nameGap: '30',
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        name: $filter('translate')('0289'),
                        type: 'value',
                        nameGap: '10',
                    }
                };

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
                        name: $filter('translate')('0656'),
                        nameLocation: 'middle',
                        nameGap: '30',
                        type: 'value',
                        boundaryGap: false,
                        inverse: true,
                        axisLine: { onZero: false }


                    },
                    yAxis: {
                        name: $filter('translate')('0289'),
                        type: 'value',
                        axisLine: { onZero: false }

                    }
                };

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.patientid = $scope.patientid;
                        vm.photopatient = $scope.photopatient === undefined || $scope.photopatient === null ? '' : $scope.photopatient;
                        vm.patientname = $scope.patientname;
                        vm.graphgroup = false;
                        vm.orderdemo = $scope.orderdemo;
                        vm.notes = $scope.notes === undefined ? [] : $scope.notes;
                        vm.patient = $scope.patientinformation;
                        vm.order = $scope.order;
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
                        if (item.testId !== null && item.testId !== undefined) {
                            listtest.push(item.testId)
                        }

                    });

                    var patient = {
                        "id": $scope.patientid,
                        "testId": listtest
                    }

                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.loading = true;
                    return resultsentryDS.getResultsHistory(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {
                            var validlist = $filter('filter')(data.data, { testCode: '!!' });
                            if (validlist.length > 0) {
                                data.data.forEach(function (item) {
                                    if (item.history.length > 0) {
                                        item.history = $filter('orderBy')(item.history, 'validateDate', false);
                                        var test = {};
                                        test.name = item.testCode + ' ' + item.testName;
                                        test.type = item.resultType;
                                        test.testdetail = [];

                                        if (item.resultType === 1) {
                                            test.options = _.clone(vm.options);
                                            test.datagraphics = [
                                                {
                                                    name: $filter('translate')('0289'),
                                                    type: 'line',
                                                    data: []
                                                },
                                                {
                                                    name: $filter('translate')('0499'),
                                                    type: 'line',
                                                    data: []
                                                },
                                                {
                                                    name: $filter('translate')('0500'),
                                                    type: 'line',
                                                    data: []
                                                }];

                                            var testgroup = {
                                                name: item.testCode + ' ' + item.testName,
                                                type: 'line',
                                                data: []
                                            };
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
                                                    patology: itemhistory.pathology === 0 ? $filter('translate')('0652') : '*',
                                                    comment: itemhistory.comment
                                                };
                                                test.testdetail.push(detail);
                                            });
                                            vm.graphnumbergroup.push(testgroup);
                                        } else {
                                            item.history.forEach(function (itemhistory, key) {
                                                var detail = {
                                                    datevalid: moment(itemhistory.validateDate).format(vm.formatDate),
                                                    order: itemhistory.order,
                                                    result: itemhistory.result,
                                                    referencevalues: itemhistory.refLiteral !== null ? itemhistory.refLiteral : '',
                                                    patology: itemhistory.pathology === 0 ? $filter('translate')('0652') : '*',
                                                    comment: itemhistory.comment
                                                }

                                                test.testdetail.push(detail);
                                            })
                                        }
                                        test.testdetail = test.testdetail.reverse();
                                        vm.listgraphics.push(test);
                                    }
                                });
                                vm.listgraphicsALL = vm.listgraphics;
                                vm.viewtext = _.filter(_.clone(vm.listgraphicsALL), function (o) { return o.type == 2; }).length !== 0;
                                vm.viewgraph = _.filter(_.clone(vm.listgraphicsALL), function (o) { return o.type == 1; }).length !== 0;

                                UIkit.modal("#rs-modal-testhistory").show();
                            }
                            else {
                                UIkit.modal("#rs-modal-testhistoryerror").show();
                            }


                        }
                        else {
                            $scope.openmodal = false;
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
                            vm.listgraphics = _.filter(_.clone(vm.listgraphicsALL), function (o) { return o.type == 2; })

                            vm.graphgroup = false;
                            break;
                        case 2:
                            vm.tabactive = 3;
                            vm.listgraphics = _.filter(_.clone(vm.listgraphicsALL), function (o) { return o.type == 1; })
                            vm.graphgroup = false;
                            break;
                        case 3:
                            vm.tabactive = 4;
                            vm.listgraphics = _.filter(_.clone(vm.listgraphicsALL), function (o) { return o.type == 1; })
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
