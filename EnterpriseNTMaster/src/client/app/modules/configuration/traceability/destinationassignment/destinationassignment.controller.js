(function () {
  'use strict';
  angular.module('app.destinationassignment')
    .controller('destinationassignmentController', destinationassignmentController)
    .controller('changedestinationInitialController', changedestinationInitialController)
    .controller('changedestinationEndController', changedestinationEndController)
    .controller('validSaveController', validSaveController)
    .controller('modalErrorAssingController', modalErrorAssingController)
    .controller('destinationassignmentdependenceController', destinationassignmentdependenceController)
    .controller('assignmentTestController', assignmentTestController);
  destinationassignmentController.$inject = ['branchDS', 'ordertypeDS', 'sampleDS',
    'testDS', 'destinationDS', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function destinationassignmentController(branchDS, ordertypeDS, sampleDS,
    testDS, destinationDS, configurationDS, localStorageService, logger, $filter, $state, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'destinationassignment';
    vm.sortReverse = true;
    vm.sortType = 'name';
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = false;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getBranch = getBranch;
    vm.getSample = getSample;
    vm.getTest = getTest;
    vm.getOrderType = getOrderType;
    vm.getDestinationAssignment = getDestinationAssignment;
    vm.changedestinationInitial = changedestinationInitial;
    vm.changedestinationEnd = changedestinationEnd;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    vm.errorservice = 0;
    var auth;
    vm.Repeat = false;
    vm.Repeatcode = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.OrderListDestination = OrderListDestination;
    vm.assignmentTest = assignmentTest;
    vm.modalrequired = modalrequired;
    vm.ordertype = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.asiggnedblclick = asiggnedblclick;
    vm.getTestpass = getTestpass;
    vm.changedInitial = changedInitial;
    vm.changeEnd = changeEnd;
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      vm.data2 = [];
      vm.data3 = [];
      vm.data4 = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationDS.getDestinationActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          vm.data.sort(vm.OrderListDestination);
          vm.sortableOptions1 = {
            placeholder: "app",
            connectWith: ".containerDestinationassing",
            update: function (event, ui) {
              if (!ui.item.sortable.received) {
                var originNgModel = ui.item.sortable.sourceModel;
                var itemModel = originNgModel[ui.item.sortable.index];
                if ((ui.item.sortable.droptarget.hasClass('listprocess') && itemModel.destination.type.id !== 45 && itemModel.destination.type.id !== 46 && itemModel.destination.type.id !== 47) || (ui.item.sortable.droptarget.hasClass('listinitial') && itemModel.destination.type.id !== 44) || (ui.item.sortable.droptarget.hasClass('listfinal') && itemModel.destination.type.id !== 48)) {
                  ui.item.sortable.cancel();
                  ModalService.showModal({
                    templateUrl: 'modalErrorAssing.html',
                    controller: 'modalErrorAssingController'
                  }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {});
                  });
                } else if (ui.item.sortable.droptarget.hasClass('listinitial') && itemModel.destination.type.id === 44 && vm.data2.length === 1) {
                  vm.itemModel = itemModel;
                  vm.changedestinationInitial();
                } else if (ui.item.sortable.droptarget.hasClass('listfinal') && itemModel.destination.type.id === 48 && vm.data4.length === 2) {
                  vm.itemModel = itemModel;
                  vm.changedestinationEnd();
                } else {
                  if (itemModel.destination.type.id === 45 || itemModel.destination.type.id === 46) {
                    itemModel.assignmentTest = [];
                    vm.getTest(itemModel);
                  }
                }
              }
            },
            items: "div:not(.not-sortable)"
          };
          vm.sortableOptions2 = {
            placeholder: "app",
            scroll: true,
            connectWith: ".containerDestination",
            stop: function () {
              vm.data.sort(vm.OrderListDestination);
            }
          };
        } else {
          vm.data = [];
        }
        vm.modalrequired();
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que ordena los destinos por tipo y nombre**//
    function OrderListDestination(a, b) {
      if (a.destination.type.id < b.destination.type.id) {
        return -1;
      } else if (a.destination.type.id > b.destination.type.id) {
        return 1;
      } else {
        if (a.destination.name > b.destination.name) {
          return -1;
        } else if (a.destination.name < b.destination.name) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    //** Método para asignar los destinos dando click**//
    function asiggnedblclick(Destination) {
      if (vm.Branch !== undefined && vm.sample !== undefined) {
        //Inicial
        if (Destination.destination.type.id === 44) {
          if (vm.data2.length >= 1) {
            vm.changedInitial(Destination);
          } else {
            vm.data = _.filter(vm.data, function (o) {
              return o.id !== Destination.id;
            });
            vm.data2.push(Destination)
          }
        }
        //interno
        if (Destination.destination.type.id === 45) {
          vm.getTestpass(Destination);
          vm.data = _.filter(vm.data, function (o) {
            return o.id !== Destination.id;
          });
          vm.data3.push(Destination)
        }
        //externo
        if (Destination.destination.type.id === 46) {
          vm.getTestpass(Destination);
          vm.data = _.filter(vm.data, function (o) {
            return o.id !== Destination.id;
          });
          vm.data3.push(Destination)
        }
        //control
        if (Destination.destination.type.id === 47) {
          vm.data = _.filter(vm.data, function (o) {
            return o.id !== Destination.id;
          });
          vm.data3.push(Destination)
        }
        //final
        if (Destination.destination.type.id === 48) {
          if (vm.data4.length >= 2) {
            vm.changeEnd(Destination);
          } else {
            vm.data = _.filter(vm.data, function (o) {
              return o.id !== Destination.id;
            });
            vm.data4.push(Destination)
          }
        }

      }
    }
    //** Método para consultar los examenes**//
    function getTestpass(Destination) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        Destination.tests = $filter('filter')(data.data, {
          sample: {
            id: vm.sample.id
          }
        });
        Destination.assignmentTest = [];
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que valida si desea cambiar el destino inicial**//
    function changedInitial(Destination) {
      ModalService.showModal({
        templateUrl: 'changedestinationInitial.html',
        controller: 'changedestinationInitialController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.action === 'Yes') {
            vm.data.push(vm.data2[0])
            vm.data = _.filter(vm.data, function (o) {
              return o.id !== Destination.id;
            });
            vm.data2 = [];
            vm.data2.push(Destination)
          }
          vm.data.sort(vm.OrderListDestination);
        });
      });
    }
    //** Método que valida si desea cambiar el destino final**//
    function changeEnd(Destination) {
      ModalService.showModal({
        templateUrl: 'changedestinationEnd.html',
        controller: 'changedestinationEndController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.action === 'Yes') {
            vm.data.push(vm.data4[1])
            vm.data4 = _.filter(vm.data4, function (o) {
              return o.id !== vm.data4[1].id;
            });
            vm.data = _.filter(vm.data, function (o) {
              return o.id !== Destination.id;
            });
            vm.data4.push(Destination)
          }
          vm.data.sort(vm.OrderListDestination);
        });
      });
    }
    //** Método que obtiene una lista de sedes activas**//
    function getBranch() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.listBranch = $filter('orderBy')(data.data, 'name');
        vm.getOrderType()
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una lista de tipos de orden activas**//
    function getOrderType() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        data.data.push({
          'id': 0,
          'name': $filter('translate')('0209')
        })
        vm.ordertype.id = 0;
        vm.listordertype = data.data.reverse();
        vm.listordertype = $filter('orderBy')(vm.listordertype, 'name');
        vm.getSample();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una lista de muestras activas**//
    function getSample() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.getSampleActive(auth.authToken).then(function (data) {
        vm.listsample = $filter('orderBy')(data.data, 'name');
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una lista de examenes**//
    function getTest(itemModel) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        itemModel.tests = $filter('filter')(data.data, {
          sample: {
            id: vm.sample.id
          }
        });
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene los destinos asignados**//
    function getDestinationAssignment(id, index, Form) {
      vm.loadingdata = true;
      vm.data2 = [];
      vm.data3 = [];
      vm.data4 = [];
      vm.get();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.Branch !== undefined && vm.sample !== undefined && vm.ordertype !== undefined) {
        return destinationDS.getDestinationAssignment(auth.authToken, vm.Branch.id, vm.sample.id, vm.ordertype.id).then(function (data) {
          if (data.status === 200) {
            if (data.data.destinationRoutes.length > 0) {
              data.data.destinationRoutes.forEach(function (value, key) {
                switch (value.destination.type.id) {
                  case 44:
                    vm.data2.push(value);
                    break;
                  case 48:
                    vm.data4.push(value);
                    break;
                  default:
                    if (value.destination.type.id === 45 || value.destination.type.id === 46) {
                      value.assignmentTest = $filter('filter')(value.tests, {
                        selected: true
                      });
                    }
                    vm.data3.push(value);
                }
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.destination.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              });
            }
          }
          vm.loadingdata = false;
        }, function (error) {
          vm.modalError(error);
        });
      } else {
        vm.loadingdata = false;
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listDestination = [];
      data.data.forEach(function (value, key) {
        var destination = {
          "id": data.data[key].id,
          "order": null,
          "destination": data.data[key],
          "tests": data.data[key].type.id === 45 || data.data[key].type.id === 46 ? vm.listtest : []
        }
        listDestination.push(destination);
      });
      return listDestination;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getBranch();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.isDisabledSave = true;
      var validDestinationProcess = 0;
      for (var i = 0; i < vm.data3.length; i++) {
        if ((vm.data3[i].destination.type.id === 45 || vm.data3[i].destination.type.id === 46) && vm.data3[i].assignmentTest.length === 0) {
          validDestinationProcess = validDestinationProcess + 1;
          break;
        }
      }
      if (validDestinationProcess === 0) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var listEnd = [];
        //vm.data3.forEach(function (value, key) {
        // if(vm.data3[key].destination.type.id ===  45 || vm.data3[key].destination.type.id === 46) {
        //  vm.data3[key].tests =  $filter('filter')(vm.data3[key].tests, {selected : true});
        //}
        //});
        listEnd = listEnd.concat(vm.data2, vm.data3, vm.data4);
        vm.Detail = {
          "id": null,
          "orderType": {
            "id": vm.ordertype.id,
            "name": vm.ordertype.id === 0 ? 'Todos' : vm.ordertype.name,
          },
          "branch": {
            "id": vm.Branch.id,
            "name": vm.Branch.name,
          },
          "sample": {
            "id": vm.sample.id,
            "name": vm.sample.name,
          },
          "destinationRoutes": listEnd,
          "lastTransaction": null,
          "user": {
            "id": 1
          }
        }
        return destinationDS.NewDestinationAssignment(auth.authToken, vm.Detail).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0042'));
            vm.isDisabledSave = false;
          }
        }, function (error) {
          vm.isDisabledSave = false;
          vm.modalError(error);
        });
      } else {
        vm.isDisabledSave = false;
        ModalService.showModal({
          templateUrl: 'validSave.html',
          controller: 'validSaveController'
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {});
        });
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para cambiar el destino inicial**//
    function changedestinationInitial() {
      ModalService.showModal({
        templateUrl: 'changedestinationInitial.html',
        controller: 'changedestinationInitialController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.action === 'Yes') {
            for (var i = 0; i <= vm.data2.length; i++) {
              if (vm.itemModel.id !== vm.data2[i].id) {
                vm.data.push(vm.data2[i]);
                break;
              }
            }
            vm.data2 = [];
            vm.data2.push(vm.itemModel);
          } else {
            for (var i = 0; i < vm.data2.length; i++) {
              if (vm.itemModel.id === vm.data2[i].id) {
                vm.data2.splice(i, 1);
                break;
              }
            }
            vm.data.push(vm.itemModel);
          }
          vm.data.sort(vm.OrderListDestination);
        });
      });
    }
    //** Método para cambiar el destino final**//
    function changedestinationEnd() {
      ModalService.showModal({
        templateUrl: 'changedestinationEnd.html',
        controller: 'changedestinationEndController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.action === 'Yes') {
            for (var i = vm.data4.length - 1; i > 0; i--) {
              if (vm.itemModel.id !== vm.data4[i].id) {
                vm.data.push(vm.data4[i]);
                vm.data4.splice(i, 1);
                break;
              }
            }
          } else {
            for (var i = 0; i < vm.data4.length; i++) {
              if (vm.itemModel.id === vm.data4[i].id) {
                vm.data4.splice(i, 1);
                break;
              }
            }
            vm.data.push(vm.itemModel);
          }
          vm.data.sort(vm.OrderListDestination);
        });
      });
    }
    //** Método para asignar examenes a un destino**//
    function assignmentTest(id, type, tests) {
      if (type === 45 || type === 46) {
        var assignmentTest = [];
        var listTest = [];
        vm.data3.forEach(function (value, key) {
          if ((vm.data3[key].destination.type.id === 45 || vm.data3[key].destination.type.id === 46) && vm.data3[key].destination.id !== id) {
            assignmentTest = assignmentTest.concat(vm.data3[key].assignmentTest);
          }
        });
        assignmentTest.forEach(function (value, key) {
          var objectTest = {
            'id': assignmentTest[key].id,
            'code': assignmentTest[key].code,
            'abbr': assignmentTest[key].abbr,
            'name': assignmentTest[key].name,
            'area': {
              'id': assignmentTest[key].area.id
            },
            'selected': '',
            'sample': assignmentTest[key].sample,
          }
          listTest.push(objectTest);
        });
        listTest = listTest.concat(tests);
        listTest = $filter('filter')(listTest, function (e) {
          return e.sample.id === vm.sample.id
        });
        ModalService.showModal({
          templateUrl: 'assignmentTest.html',
          controller: 'assignmentTestController',
          inputs: {
            listTest: listTest
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.action === 'Yes') {
              vm.data3.forEach(function (value, key) {
                if (vm.data3[key].destination.id === id) {
                  vm.data3[key].tests = result.test
                  vm.data3[key].assignmentTest = $filter('filter')(result.test, {
                    selected: true
                  });
                  var blockselect = $filter('filter')(result.test, {
                    selected: '!' + true
                  });
                  blockselect.forEach(function (value, key) {
                    blockselect[key].selected = false;
                  });
                }
              });
            }
          });
        });
      }
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.listBranch.length === 0 || vm.listsample.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "destinationassignmentdependenceController",
          inputs: {
            hideBranch: vm.listBranch.length,
            hideSample: vm.listsample.length,
            hideDestination: vm.data.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var listEnd = [];
        var objectInitial = {
          'orderType': vm.ordertype.name,
          'branch': vm.Branch.name,
          'sample': vm.sample.name,
          'name': vm.data2[0].destination.code + '  ' + vm.data2[0].destination.name,
          'type': $filter('translate')('0000') === 'esCo' ? vm.data2[0].destination.type.esCo : vm.data2[0].destination.type.enUsa,
          'username': auth.userName
        }
        listEnd.push(objectInitial);
        vm.data3.forEach(function (value, key) {
          var objectProcess = {
            'orderType': vm.ordertype.name,
            'branch': vm.Branch.name,
            'sample': vm.sample.name,
            'name': vm.data3[key].destination.code + '  ' + vm.data3[key].destination.name,
            'type': $filter('translate')('0000') === 'esCo' ? vm.data3[key].destination.type.esCo : vm.data3[key].destination.type.enUsa,
            'username': auth.userName
          }
          listEnd.push(objectProcess);
        });
        vm.data4.forEach(function (value, key) {
          var objectEnd = {
            'orderType': vm.ordertype.name,
            'branch': vm.Branch.name,
            'sample': vm.sample.name,
            'name': vm.data4[key].destination.code + '  ' + vm.data4[key].destination.name,
            'type': $filter('translate')('0000') === 'esCo' ? vm.data4[key].destination.type.esCo : vm.data4[key].destination.type.enUsa,
            'username': auth.userName
          }
          listEnd.push(objectEnd);
        });
        vm.variables = {};
        vm.datareport = listEnd;
        vm.pathreport = '/report/configuration/traceability/destinationassignment/destinationassignment.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método para mostrar ventana modal confirmando si desea cambiar el destino inicial*//
  function changedestinationInitialController($scope, close) {
    $scope.close = function (action) {
      close({
        action: action
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método para mostrar ventana modal confirmando si desea cambiar el destino final*//
  function changedestinationEndController($scope, close) {
    $scope.close = function (action) {
      close({
        action: action
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método para mostrar una ventana modal confirmacion si quiere guardar*//
  function validSaveController($scope, close) {
    $scope.close = function () {
      close({}, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método para mostrar una ventana modal que el destino no se puede asignar a tipo*//
  function modalErrorAssingController($scope, close) {
    $scope.close = function () {
      close({}, 500);
    };
  }
  //** Método para mostrar una ventana modal con los datos requeridos*//
  function destinationassignmentdependenceController($scope, hideBranch, hideSample, hideDestination, close) {
    $scope.hideBranch = hideBranch;
    $scope.hideSample = hideSample;
    $scope.hideDestination = hideDestination;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método para mostrar la ventana modal y seleccionar los examanes en un destino*//
  function assignmentTestController($scope, localStorageService, $filter, areaDS, listTest, close) {
    listTest = removeDuplicates(listTest, "id");
    $scope.listTest = listTest;
    getArea();
    $scope.code = ['code', 'abbr', 'name', 'selected'];
    $scope.abbr = ['abbr', 'code', 'name', 'selected'];
    $scope.name = ['name', 'code', 'abbr', 'selected'];
    $scope.selected = ['-selected', '+code', '+abbr', '+name'];
    $scope.sortReverse = false;
    $scope.sortType = $scope.selected;
    $scope.valid = valid;
    $scope.selecttest = false;


    //** Método para calidar el campo de urgencia**//
    function valid() {
      if (listTest.length > 0) {
        if ($scope.lisArea.id === 0) {
          listTest.forEach(function (value, key) {
            if (value.selected === false || value.selected === true) {
              value.selected = $scope.selecttest;
            }
          });
        } else if ($scope.filteredtest.length > 0) {
          var hola = $filter('filter')($scope.filteredtest, function (e) {
            if (e.selected === false && e.area.id === $scope.lisArea.id || e.selected === true && e.area.id === $scope.lisArea.id) {
              e.selected = $scope.selecttest;
            }
            return e.area.id === $scope.lisArea.id
          });
        }
      }
    }

    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data[0] = {
            "id": 0,
            "name": $filter('translate')('0209')
          }
          $scope.lisArea = data.data.length === 0 ? data.data : removearea(data);
          $scope.lisArea = $filter('orderBy')($scope.lisArea, 'name');
          $scope.lisArea.id = 0;
          $scope.id = '';
          /*  $scope.id = $scope.lisArea[1].id;
           $scope.lisArea.id = $scope.lisArea[1].id; */
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de las areas**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }
      });
      return area;
    }
    //** Metodo eliminar los elementos duplicados**//
    function removeDuplicates(arr, prop) {
      var obj = {};
      for (var i = 0, len = arr.length; i < len; i++) {
        if (!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
      }
      var newArr = [];
      for (var key in obj) newArr.push(obj[key]);
      return newArr;
    }
    $scope.close = function (action) {
      close({
        action: action,
        test: $scope.listTest
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
