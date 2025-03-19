/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                order     @descripción
                sample    @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('modalbarcode', modalbarcode);

    modalbarcode.$inject = ['reportsDS', 'sampletrackingsDS', 'localStorageService', '$filter',
        'barcodeDS', '$rootScope', 'logger', 'reportadicional'];
    /* @ngInject */
    function modalbarcode(reportsDS, sampletrackingsDS, localStorageService, $filter,
        barcodeDS, $rootScope, logger, reportadicional) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-barcode.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                order: '=?order',
                sample: '=?sample',
                defaultaditional: '=?defaultaditional'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.getsample = getsample;
                vm.printlabels = printlabels;
                vm.selectall = selectall;
                vm.closemodal = closemodal;
                vm.getBarcode = getBarcode;
                vm.printStickerAditional = localStorageService.get('ImprimirEtiquetaAdicional') === 'True';
                vm.prepotition = $filter('translate')('0000') === 'esCo' ? 'de' : 'of';
                vm.directImpression = directImpression;
                vm.UrlNodeJs = localStorageService.get('UrlNodeJs');

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.loading = true;
                        if ($rootScope.serialprint === '') {
                            vm.message = $filter('translate')('1067');
                            UIkit.modal('#logNoData').show();
                            $scope.openmodal = false;
                            vm.loading = false;
                        } else {
                            return reportadicional.testServerPrint(vm.UrlNodeJs).then(function (data) {
                                if (data.status === 200) {
                                    $scope.openmodal = false;
                                    vm.getsample();

                                }
                            }, function (error) {
                                vm.message = $filter('translate')('1085');
                                UIkit.modal('#logNoData').show();
                                $scope.openmodal = false;
                                vm.loading = false;
                            });
                        }
                    }
                    // $scope.openmodal = false;
                });

                $rootScope.$watch('ipUser', function () {
                    vm.ipuser = $rootScope.ipUser;
                });

                vm.keyselect = keyselect;
                function keyselect($event, value) {
                  var keyCode = $event.which || $event.keyCode;
                  var expreg1 = new RegExp('^[1-9][0-9]?$|^20$');
                  if (!expreg1.test(value + String.fromCharCode(keyCode))) {
                    $event.preventDefault();
                  }
                }

                function getsample() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.getBarcode();
                    if ($scope.order !== undefined) {
                        return sampletrackingsDS.sampleorder(auth.authToken, $scope.order).then(function (data) {
                            if (data.status === 200) {
                                if (data.data.length > 0) {
                                    if ($scope.sample !== undefined) {
                                        data.data = $filter('filter')(data.data, { id: $scope.sample });
                                    }
                                    data.data.forEach(function (value, key) {
                                        value.idsample = value.id;
                                    });
                                }

                                vm.Detail = data.data;
                            }
                        }, function (error) {
                            if (error.data === null) {
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                        });
                    }
                }

                function printlabels() {
                    vm.assignadetest = $filter('filter')(vm.Detail, { select: true });
                    vm.totalorder = 0;
                    vm.porcent = 0;
                    var samples = [];
                    for (var i = 0; i < vm.assignadetest.length; i++) {
                        if(vm.assignadetest[i].canstiker > 0)
                        {
                            var detail = {
                                'idSample': vm.assignadetest[i].idsample,
                                'quantity': vm.assignadetest[i].canstiker
                            };
                            samples.push(detail);
                        }
                    }

                    vm.printbarcode = {
                        'order': {},
                        'rangeType': 1,
                        'init': $scope.order,
                        'end': $scope.order,
                        'samples': samples,
                        'printAddLabel': vm.printAddLabel !== undefined && vm.printAddLabel === true,
                        'serial': $rootScope.serialprint,
                        'printingType': 2,
                        'test': [],
                        'demographics': []
                    };
                    vm.samplesBarcode = samples;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportsDS.getOrderHeaderBarcode(auth.authToken, vm.printbarcode).then(function (data) {
                        if (data.status === 200) {
                            vm.listOrderHead = data.data;
                            vm.ind = 1;
                            var stickerAditionals = vm.printAddLabel ? vm.stickerAditionals : 0;
                            vm.totalCanStickers = 0;
                            data.data[0].samples.forEach(function (valuesample) {
                                var canstickers = valuesample.canstiker;
                                vm.totalCanStickers += canstickers;
                            });
                            vm.printbarcode.ordersprint = [{}];
                            vm.totalCanStickers += stickerAditionals;
                            vm.progressPrint = false;
                            vm.directImpression();
                        }
                    }, function (error) {
                        vm.progressPrint = false;
                        if (error.data !== undefined && error.data !== null) {
                            logger.error($filter('translate')('0787'));
                        } else {
                            vm.PopupError = true;
                            vm.Error = error;
                        }
                    });

                }
                

                function directImpression() {
                    vm.printbarcode.ordersprint[0] = vm.listOrderHead[vm.totalorder];
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportsDS.printOrderBodyBarcode(auth.authToken, vm.printbarcode).then(function (data) {
                        if (data.status === 200) {
                            UIkit.modal('#modalprogressprint', { bgclose: false, escclose: false, modal: false }).show();
                            vm.listOrderHead[vm.totalorder].printing = data.data[0].printing;
                            setTimeout(function () {
                                for (vm.ind; vm.ind <= vm.totalCanStickers; vm.ind++) {
                                    vm.porcent = Math.round((vm.ind * 100) / vm.totalCanStickers);
                                }
                                vm.ind--;
                                vm.totalorder = vm.totalorder + 1;
                                setTimeout(function () {
                                    logger.success($filter('translate')('0211') + ': ' + $scope.order);
                                    UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                                    vm.listOrderPrint = [];
                                }, 2000);
                            }, 30);
                        }
                    }, function (error) {
                        vm.loading = false;
                        if (error.data.code === 2) {
                            vm.message = $filter('translate')('1074');
                            setTimeout(function () {
                                UIkit.modal('#logNoData', { modal: false, keyboard: false, bgclose: false, center: true }).show();
                            }, 1000);
                        }
                        else {
                            vm.modalError(error);
                            vm.message = $filter('translate')('1074');
                            setTimeout(function () {
                                UIkit.modal('#logNoData').show();
                            }, 1000);
                        }

                    });
                }

                function getBarcode() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return barcodeDS.getBarcode(auth.authToken).then(function (data) {
                        if (data.status === 200) {
                            vm.loading = false;
                            UIkit.modal('#barcodemodalsample', { modal: false, keyboard: false, bgclose: false, center: true }).show();
                            vm.listbarcodeadicional = $filter('filter')(data.data, { type: '2' });
                            vm.stickerAditionals = $filter('filter')(vm.listbarcodeadicional, { active: true }).length;
                            vm.printAddLabel = ($scope.defaultaditional !== undefined && $scope.defaultaditional === true && vm.stickerAditionals > 0);
                        }
                    },
                        function (error) {
                            vm.modalError(error);
                        });
                }

                // return printBarcodeDS.getprintBarcode(auth.authToken,printbarcode).then(function (data) {
                //     if (data.status === 200) {  
                //         if (data.data.length > 0) {
                //             var parameters = {
                //                 'ip': vm.ipuser,
                //                 'barcodes': data.data
                //             }
                //             return printBarcodeDS.printBarcode(auth.authToken, parameters).then(function (data) {
                //                 if (data.status === 200) {  
                //                   if (data.data.code === 1) {
                //                     logger.success('Archivo mandado a la cola de impresión');
                //                     UIkit.modal('#barcodemodalsample').hide();
                //                   }
                //                   else if (data.data.code === 2) {
                //                     logger.error('Verifique la conexion con el cliente de impresión')
                //                   }

                //                 }
                //             });
                //         }
                //     }
                // }, function (error) {
                //     if (error.data === null) {
                //        if (error.data.code === 0) {
                //             error.data.errorFields.forEach(function (value) {
                //                 var item = value.split('|');
                //                 if (item[0] === '0') {
                //                      logger.error($filter('translate')('0196'));
                //                 }
                //             });
                //         } 
                //     }
                // });
                //}

                function selectall() {
                    if (vm.Detail.length > 0) {
                        vm.Detail.forEach(function (value, key) {
                            vm.Detail[key].select = vm.selectAllcheck;

                        });
                    }
                }

                function closemodal() {
                    UIkit.modal('#barcodemodalsample').hide();
                }

                function init() {
                }

                vm.init();

            }],
            controllerAs: 'modalbarcode'
        };
        return directive;

    }

})();
