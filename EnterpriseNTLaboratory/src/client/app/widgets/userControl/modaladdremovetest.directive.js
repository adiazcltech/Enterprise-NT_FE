/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS  	openmodal 			@descripción
        order 				@descripción
        patientinformation  @descripción
        notes				@descripción
        photopatient		@descripción
        getaddtests			@descripción
        functionexecute 	@descripción

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
    .directive('modaladdremovetest', modaladdremovetest);

  modaladdremovetest.$inject = ['resultsentryDS', 'orderDS', 'localStorageService', '$filter', 'logger'];
  /* @ngInject */
  function modaladdremovetest(resultsentryDS, orderDS, localStorageService, $filter, logger) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modal-addremovetest.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        order: '=?order',
        patientinformation: '=patientinformation',
        validpatientest: '=validpatientest',
        notes: '=notes',
        photopatient: '=photopatient',
        getaddtests: '=getaddtests', // Retorna la lista de exámenes agregados.
        orderdemo: '=?orderdemo',
        functionexecute: '=functionexecute'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        //vm.getest = getest;
        vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
        vm.manageRate = localStorageService.get('ManejoTarifa') === 'True';
        vm.addtesservice = localStorageService.get('AgregarExamenesServicios') === 'True';
        vm.loadOrder = loadOrder;
        vm.saveTestAddRemove = saveTestAddRemove;
        vm.symbolCurrency = localStorageService.get('SimboloMonetario');
        vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
        vm.currencyLoad = currencyLoad;
        vm.save = false;
        vm.viewcomment = false;
        vm.numberTests = 0;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.modal = UIkit.modal('#addremovetestmodal', {
          modal: false,
          keyboard: false,
          bgclose: false,
          center: true
        });

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.orderB = [];
            //vm.getest();
            vm.viewcomment = true;
            vm.listDataTest = [];
            vm.listDataTest.push([]); //Arreglo para exámenes agregados.
            vm.listDataTest.push([]); //Arreglo para exámenes eliminados.
            vm.order = $scope.order;
            vm.orderdemo = $scope.orderdemo;
            vm.loadOrder(vm.order);
            vm.patient = $scope.patientinformation;
            vm.validPatienTest = $scope.validpatientest;
            vm.photopatient = $scope.photopatient;
            vm.notes = $scope.notes === undefined ? [] : $scope.notes;
            vm.openmodal = $scope.openmodal;
            vm.cleanTests = 0;
            vm.modal.show();
          }
          $scope.openmodal = false;
        });

        function loadOrder(order) {
          vm.selectedTest = [];
          vm.samples = [];
          vm.deleteTests = [];
          vm.loading = true;
          orderDS.getOrderTestEdit(auth.authToken, order).then(
            function (response) {
              if (response.status === 200) {
                vm.servicehospitalary = response.data.service !== undefined ? response.data.service.hospitalSampling : '';
                var teststateprint = $filter("filter")(response.data.resultTest, function (e) {
                  return e.printsample  === false;
                })
                vm.teststateprint = teststateprint.length > 0 ? true : false;
               /*  if (vm.addtesservice && !vm.servicehospitalary) {
                  vm.blockservice = true;
                } */
                if (vm.addtesservice && vm.teststateprint && vm.servicehospitalary) {
                  vm.blockservice = true;
                }
                vm.orderB = response.data;
                var patientDemosValues = {};
                //Carga los datos del paciente
                var patientId = vm.orderB.patient.id;
                var orderType = vm.orderB.type.id;
                var orderBranch = vm.orderB.branch.id;
                //Carga los examenes
                var selectedTest = [];
                vm.orderB.resultTest.forEach(function (test, index) {
                  selectedTest.push({
                    'id': test.testId,
                    'code': test.testCode,
                    'name': test.testName.toUpperCase(),
                    'deletedtest':  vm.addtesservice && test.printsample && vm.servicehospitalary,
                    'rate': vm.manageRate && test.billing !== undefined ? {
                      'id': test.billing.rate.id,
                      'code': test.billing.rate.code,
                      'name': test.billing.rate.name,
                      'showValue': test.billing.rate.code + '. ' + test.billing.rate.name
                    } : '',
                    'price': test.billing !== undefined ? (test.billing.servicePrice !== undefined && test.billing.servicePrice !== null ? test.billing.servicePrice : 0) : 0,
                    'insurancePrice': test.billing !== undefined ? (test.billing.insurancePrice !== undefined && test.billing.insurancePrice !== null ? test.billing.insurancePrice : 0) : 0,
                    'patientPrice': test.billing !== undefined ? (test.billing.patientPrice !== undefined && test.billing.patientPrice !== null ? test.billing.patientPrice : 0) : 0,
                    'state': test.state,
                    'billing': test.billing,
                    'type': test.testType,
                    'resultValidity': null,
                    'areaName': test.areaName
                  });
                });
                //Carga los recipientes y muestras
                var samples = [];
                var testsS = null;
                vm.orderB.samples.forEach(function (sample, index) {
                  testsS = [];
                  sample.tests.forEach(function (testToSample, index2) {
                    testsS.push({
                      'id': testToSample.id,
                      'code': testToSample.code
                    });
                  });
                  samples.push({
                    'id': sample.id,
                    'name': sample.name,
                    'container': {
                      'name': sample.container.name,
                      'image': sample.container.image === '' ? 'images/empty-container.png' : 'data:image/png;base64,' + sample.container.image
                    },
                    'tests': testsS
                  });
                });
                //Carga las variables de la vista
                vm.patientDemosValues = patientDemosValues;
                //vm.orderDemosValues = orderDemosValues;
                vm.selectedTest = selectedTest;
                vm.numberTests = selectedTest.length;
                vm.rateId = vm.orderB.rate.id;
                vm.account = vm.orderB.account.id
                vm.orderTypeId = orderType;
                vm.orderBranchId = orderBranch;
                vm.samples = samples;
                //Habilita botones
                //Logica de Botones
                vm.loading = false;
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }


        function saveTestAddRemove() {
          if (vm.listDataTest[0].length === 0) {
            vm.dimensions = ' width: 350px; height: 185px;';
            vm.messageNotTittle = $filter('translate')('0013')
            vm.numError = '0';
            vm.messageNotSave = $filter('translate')('0662');
            UIkit.modal('#logErrorTest1').show();
            return;
          }
          vm.loading = true;
          var json = {
            'orderNumber': vm.order,
            'type': {
              'id': vm.orderTypeId,
              'code': vm.patient.typeordercode
            },
            'rate': {
              'id': vm.rateId
            },
            'branch': {
              'id': vm.orderBranchId
            },
            'tests': vm.listDataTest[0],
            'deleteTests': vm.listDataTest[1],
            'patient': vm.patient
          };
          $scope.getaddtests = vm.listDataTest[0];
          resultsentryDS.getAddRemove(auth.authToken, json, 4).then(function (data) {
            if (data.status === 200) {
              var message = $filter('translate')('0657').replace('@@@@', vm.order);
              message = message.replace('A##', vm.listDataTest[0].length).replace('E##', vm.listDataTest[1].length);
              logger.success(message);
              vm.modal.hide();
              // $scope.openmodal = false;
              vm.cleanTests = 1;
              if ($scope.functionexecute !== undefined) {
                $scope.functionexecute();
              }
              vm.loading = false;
            }
          }, function (error) {
            /* 	var message = $filter('translate')('0657').replace('@@@@', vm.order);
              message = message.replace('A##', vm.listDataTest[0].length).replace('E##', vm.listDataTest[1].length);
                logger.success(message);
                vm.modal.hide(); */
            vm.listError = [];
            if (error.data !== null && error.data !== undefined) {
              if (error.data.errorFields === undefined) {
                vm.messageNotSave = error.data.message;
              } else {
                vm.numError = error.data.errorFields[0].split('|')[0].toString();
                vm.messageNotSave = vm.numError === '1' ? $filter('translate')('0800') : $filter('translate')('0331');
                vm.messageNotTittle = $filter('translate')('0013');
                if (vm.numError === '6') {
                  if (error.data.errorFields[0].split('|').length === 3) {
                    vm.dimensions = ' width: 512px; height: 350px;';
                    error.data.errorFields.forEach(function (value) {
                      var test = _.filter(vm.listDataTest[0], function (v) {
                        return v.id === parseInt(value.split('|')[2]);
                      });
                      if (test.length > 0) {
                        var cod = test[0].code;
                        var name = test[0].name;
                        vm.listError.push({
                          test: cod + '. ' + name
                        });
                      }
                    });

                    if (vm.listError.length === 0) {
                      vm.numError = '06';
                      vm.messageNotTittle = 'Laboratorio de referencia';
                      vm.messageNotSave = 'Ha adicionado paquetes que no tienen laboratorio asignado';
                    }
                  } else {
                    vm.numError = '06';
                    vm.messageNotTittle = $filter('translate')('0061');
                    vm.messageNotSave = $filter('translate')('1443');
                  }
                } else if (vm.numError === '5') {
                  vm.messageNotTittle = $filter('translate')('0061');
                  vm.messageNotSave = $filter('translate')('1142');
                } else if (vm.numError === '4') {
                  vm.messageNotTittle = $filter('translate')('0061');
                  vm.messageNotSave = $filter('translate')('1442');
                }

              }
              UIkit.modal('#logErrorTest1').show();
              vm.loading = false;
            }
          });
        }


        //Función que le da formato de moneda a un valor numérico cuando es cargado en un control.
        function currencyLoad(valueData, symbol, penny) {
          try {
            var num = valueData.replace(/\,/g, penny ? '' : '.');
            num = num.replace(symbol, '');
            num = num.replace(' ', '');
            if (num.lastIndexOf('-') !== -1) {
              num = num.slice(0, -1);
            }
            if ((num.substr(-2, 1) === '.' || num.substr(-3, 1) === '.' || num.substr(-4, 1) === '.')) {
              num = num.slice(0, -1);
            }
            if (num === '' || num === ' ') {
              num = penny ? '0.00' : '0';
            }
            if (penny) {
              num = parseFloat(num).toFixed(2);
            }
            num = num.split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g, '$1,');
            num = num.split('').reverse().join('').replace(/^[\,]/, '');
            valueData = symbol.trim() + ' ' + num.replace('.,', ',');
          } catch (ex) {
            valueData = symbol.trim() + (penny ? '0.00' : '0');
          }
          return valueData;
        }


      }],
      controllerAs: 'modaladdremovetest'
    };
    return directive;

  }

})();
