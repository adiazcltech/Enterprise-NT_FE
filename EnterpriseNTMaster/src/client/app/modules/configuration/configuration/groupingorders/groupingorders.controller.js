(function () {
  'use strict';
  angular.module('app.groupingorders')
    .controller('groupingordersController', groupingordersController)
    .controller('validSaveController', validSaveController)
    .controller('groupingordersdependenceController', groupingordersdependenceController);
  groupingordersController.$inject = ['serviceDS', 'ordertypeDS', 'configurationDS', 'localStorageService',
    'logger', '$filter', '$state', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function groupingordersController(serviceDS, ordertypeDS, configurationDS, localStorageService,
    logger, $filter, $state, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'groupingorders';
    vm.sortReverse = true;
    vm.sortType = 'name';
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = false;
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getService = getService;
    vm.getOrderType = getOrderType;
    vm.getGroupingOrders = getGroupingOrders;
    vm.save = save;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.errorservice = 0;
    var auth;
    vm.Repeat = false;
    vm.Repeatcode = false;
    vm.getConfigurationKey = getConfigurationKey;
    vm.OrderListItems = OrderListItems;
    vm.modalrequired = modalrequired;
    vm.ordertype = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = false;
    vm.keyGroupingOrders = '1';
    vm.list = [];
    vm.changeTitle = changeTitle;
    vm.subTitle = $filter('translate')('0133');

    //** Función que devuelve la llave de configuración de agrupación de órdenes**//
    function getConfigurationKey() {
      vm.data1 = [];
      vm.data2 = [];
      vm.data3 = [];
      vm.data4 = [];
      vm.data5 = [];
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'AgrupacionOrdenes').then(function (data) {
        if (data.status === 200) {
          if (vm.keyGroupingOrders == '1') {
            vm.getOrderType();
          } else {
            vm.getService();
          }
          vm.isDisabledSave = true;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de servicios para llenar la grilla**//
    function getService() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getService(auth.authToken).then(function (data) {
        vm.data = data.data;
        vm.list = data.data;
        vm.data.sort(vm.OrderListItems);
        vm.sortableOptions1 = {
          placeholder: "app",
          connectWith: ".containerGroupingOrdersAssing",
          update: function (event, ui) {
            if (!ui.item.sortable.received) {
              var originNgModel = ui.item.sortable.sourceModel;
              var itemModel = originNgModel[ui.item.sortable.index];
              vm.itemModel = itemModel;
            }
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          },
          stop: function () {
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          },
          items: "div:not(.not-sortable)"
        };
        vm.sortableOptions2 = {
          placeholder: "app",
          scroll: true,
          connectWith: ".containerGroupingOrders",
          stop: function () {
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          }
        };
        vm.modalrequired()
        vm.loadingdata = false;
        vm.getGroupingOrders();
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de tipos de orden para llenar la grilla**//
    function getOrderType() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        vm.data = data.data;
        vm.list = data.data;
        vm.data.sort(vm.OrderListItems);
        vm.sortableOptions1 = {
          placeholder: "app",
          connectWith: ".containerGroupingOrdersAssing",
          update: function (event, ui) {
            if (!ui.item.sortable.received) {
              var originNgModel = ui.item.sortable.sourceModel;
              var itemModel = originNgModel[ui.item.sortable.index];
              vm.itemModel = itemModel;
            }
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          },
          stop: function () {
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          },
          items: "div:not(.not-sortable)"
        };
        vm.sortableOptions2 = {
          placeholder: "app",
          scroll: true,
          connectWith: ".containerGroupingOrders",
          stop: function () {
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
          }
        };
        vm.modalrequired()
        vm.loadingdata = false;
        vm.getGroupingOrders();
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Método ordenar los items de la lista**//
    function OrderListItems(a, b) {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    //** Método que consulta las agrupaciones**//
    function getGroupingOrders() {
      vm.loadingdata = true;
      vm.data1 = [];
      vm.data2 = [];
      vm.data3 = [];
      vm.data4 = [];
      vm.data5 = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getGroupingOrders(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var data1 = $filter('filter')(data.data, {
            column: 1
          });
          var data2 = $filter('filter')(data.data, {
            column: 2
          });
          var data3 = $filter('filter')(data.data, {
            column: 3
          });
          var data4 = $filter('filter')(data.data, {
            column: 4
          });
          var data5 = $filter('filter')(data.data, {
            column: 5
          });
          // Carga tipos de orden o servicios en el grupo 1
          if (data1.length > 0) {
            data1.forEach(function (value, key) {
              if (vm.keyGroupingOrders == '1') {
                vm.data1.push({
                  'id': value.orderType.id,
                  'code': value.orderType.code,
                  'name': value.orderType.name,
                  'color': value.orderType.color,
                  'columnName': ''
                });
                vm.columnName1 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.orderType.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              } else {
                vm.data1.push({
                  'id': value.service.id,
                  'code': value.service.code,
                  'name': value.service.name,
                  'external': value.service.external,
                  'columnName': ''
                });
                vm.columnName1 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.service.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              }

            });
          }
          // Carga tipos de orden o servicios en el grupo 2
          if (data2.length > 0) {
            data2.forEach(function (value, key) {
              if (vm.keyGroupingOrders == '1') {
                vm.data2.push({
                  'id': value.orderType.id,
                  'code': value.orderType.code,
                  'name': value.orderType.name,
                  'color': value.orderType.color,
                  'columnName': ''
                });
                vm.columnName2 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.orderType.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              } else {
                vm.data2.push({
                  'id': value.service.id,
                  'code': value.service.code,
                  'name': value.service.name,
                  'external': value.service.external,
                  'columnName': ''
                });
                vm.columnName2 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.service.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              }

            });
          }
          // Carga tipos de orden o servicios en el grupo 3
          if (data3.length > 0) {
            data3.forEach(function (value, key) {
              if (vm.keyGroupingOrders == '1') {
                vm.data3.push({
                  'id': value.orderType.id,
                  'code': value.orderType.code,
                  'name': value.orderType.name,
                  'color': value.orderType.color,
                  'columnName': ''
                });
                vm.columnName3 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.orderType.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              } else {
                vm.data3.push({
                  'id': value.service.id,
                  'code': value.service.code,
                  'name': value.service.name,
                  'external': value.service.external,
                  'columnName': ''
                });
                vm.columnName3 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.service.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              }

            });
          }
          // Carga tipos de orden o servicios en el grupo 4
          if (data4.length > 0) {
            data4.forEach(function (value, key) {
              if (vm.keyGroupingOrders == '1') {
                vm.data4.push({
                  'id': value.orderType.id,
                  'code': value.orderType.code,
                  'name': value.orderType.name,
                  'color': value.orderType.color,
                  'columnName': ''
                });
                vm.columnName4 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.orderType.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              } else {
                vm.data4.push({
                  'id': value.service.id,
                  'code': value.service.code,
                  'name': value.service.name,
                  'external': value.service.external,
                  'columnName': ''
                });
                vm.columnName4 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.service.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              }

            });
          }
          // Carga tipos de orden o servicios en el grupo 5
          if (data5.length > 0) {
            data5.forEach(function (value, key) {
              if (vm.keyGroupingOrders == '1') {
                vm.data5.push({
                  'id': value.orderType.id,
                  'code': value.orderType.code,
                  'name': value.orderType.name,
                  'color': value.orderType.color,
                  'columnName': ''
                });
                vm.columnName5 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.orderType.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              } else {
                vm.data5.push({
                  'id': value.service.id,
                  'code': value.service.code,
                  'name': value.service.name,
                  'external': value.service.external,
                  'columnName': ''
                });
                vm.columnName5 = value.columnName;
                for (var i = 0; i < vm.data.length; i++) {
                  if (vm.data[i].id === value.service.id) {
                    vm.data.splice(i, 1);
                    break;
                  }
                }
              }

            });
          }
        } else if (data.status === 204) {}
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
        vm.loadingdata = false;
      });
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
    //** Método que evalua si se va crear o actualizar**//
    function save(Form) {
      vm.isDisabledSave = true;
      vm.isDisabledCancel = true;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var saveData = [];
      // Grupo 1 ------------------------------------------------
      vm.columnName1 = vm.columnName1 === undefined || vm.columnName1 === '' ? $filter('translate')('0802') + ' 1' : vm.columnName1;
      for (var i = 0; i < vm.data1.length; i++) {
        if (vm.keyGroupingOrders === '1') {
          saveData.push({
            'column': 1,
            'columnName': vm.columnName1,
            'orderType': {
              'id': vm.data1[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        } else {
          saveData.push({
            'column': 1,
            'columnName': vm.columnName1,
            'service': {
              'id': vm.data1[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        }
      }
      if (vm.data1.length === 0) vm.columnName1 = $filter('translate')('0802') + ' 1';
      // Grupo 2 -----------------------------------------------------
      vm.columnName2 = vm.columnName2 === undefined || vm.columnName2 === '' ? $filter('translate')('0802') + ' 2' : vm.columnName2;
      for (var i = 0; i < vm.data2.length; i++) {
        if (vm.keyGroupingOrders === '1') {
          saveData.push({
            'column': 2,
            'columnName': vm.columnName2,
            'orderType': {
              'id': vm.data2[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        } else {
          saveData.push({
            'column': 2,
            'columnName': vm.columnName2,
            'service': {
              'id': vm.data2[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        }
      }
      if (vm.data2.length === 0) vm.columnName2 = $filter('translate')('0802') + ' 2';
      // Grupo 3 -----------------------------------------------------
      vm.columnName3 = vm.columnName3 === undefined || vm.columnName3 === '' ? $filter('translate')('0802') + ' 3' : vm.columnName3;
      for (var i = 0; i < vm.data3.length; i++) {
        if (vm.keyGroupingOrders === '1') {
          saveData.push({
            'column': 3,
            'columnName': vm.columnName3,
            'orderType': {
              'id': vm.data3[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        } else {
          saveData.push({
            'column': 3,
            'columnName': vm.columnName3,
            'service': {
              'id': vm.data3[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        }
      }
      if (vm.data3.length === 0) vm.columnName3 = $filter('translate')('0802') + ' 3';
      // Grupo 4 -----------------------------------------------------
      vm.columnName4 = vm.columnName4 === undefined || vm.columnName4 === '' ? $filter('translate')('0802') + ' 4' : vm.columnName4;
      for (var i = 0; i < vm.data4.length; i++) {
        if (vm.keyGroupingOrders === '1') {
          saveData.push({
            'column': 4,
            'columnName': vm.columnName4,
            'orderType': {
              'id': vm.data4[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        } else {
          saveData.push({
            'column': 4,
            'columnName': vm.columnName4,
            'service': {
              'id': vm.data4[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        }
      }
      if (vm.data4.length === 0) vm.columnName4 = $filter('translate')('0802') + ' 4';
      // Grupo 5 -----------------------------------------------------
      vm.columnName5 = vm.columnName5 === undefined || vm.columnName5 === '' ? $filter('translate')('0802') + ' 5' : vm.columnName5;
      for (var i = 0; i < vm.data5.length; i++) {
        if (vm.keyGroupingOrders === '1') {
          saveData.push({
            'column': 5,
            'columnName': vm.columnName5,
            'orderType': {
              'id': vm.data5[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        } else {
          saveData.push({
            'column': 5,
            'columnName': vm.columnName5,
            'service': {
              'id': vm.data5[i].id
            },
            'user': {
              'id': auth.id
            }
          })
        }
      }
      if (vm.data5.length === 0) vm.columnName5 = $filter('translate')('0802') + ' 5';
      return configurationDS.saveGroupingOrders(auth.authToken, saveData).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.isDisabledSave = true;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.isDisabledSave = false;
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    //** Método que evalua el cambio de titulo**//
    function changeTitle() {
      vm.isDisabledSave = false;
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.list.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "groupingordersdependenceController",
          inputs: {
            hidelist: vm.list.length,
            keygroupingorders: vm.keyGroupingOrders
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
          'name': vm.data1[0].destination.code + '  ' + vm.data1[0].destination.name,
          'type': $filter('translate')('0000') === 'esCo' ? vm.data1[0].destination.type.esCo : vm.data1[0].destination.type.enUsa,
          'username': auth.userName
        }
        listEnd.push(objectInitial);
        vm.data2.forEach(function (value, key) {
          var objectProcess = {
            'orderType': vm.ordertype.name,
            'branch': vm.Branch.name,
            'sample': vm.sample.name,
            'name': vm.data2[key].destination.code + '  ' + vm.data2[key].destination.name,
            'type': $filter('translate')('0000') === 'esCo' ? vm.data2[key].destination.type.esCo : vm.data2[key].destination.type.enUsa,
            'username': auth.userName
          }
          listEnd.push(objectProcess);
        });
        vm.data3.forEach(function (value, key) {
          var objectEnd = {
            'orderType': vm.ordertype.name,
            'branch': vm.Branch.name,
            'sample': vm.sample.name,
            'name': vm.data3[key].destination.code + '  ' + vm.data3[key].destination.name,
            'type': $filter('translate')('0000') === 'esCo' ? vm.data3[key].destination.type.esCo : vm.data3[key].destination.type.enUsa,
            'username': auth.userName
          }
          listEnd.push(objectEnd);
        });
        vm.variables = {};
        vm.datareport = listEnd;
        vm.pathreport = '/report/configuration/traceability/groupingorders/groupingorders.mrt';
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
      vm.getOrderType();
      vm.isDisabledSave = true;
    }
    vm.isAuthenticate();
  }
  //** Método que valida cuando se guardar**//
  function validSaveController($scope, close) {
    $scope.close = function () {
      close({}, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método que valida la dependencia del agrupamiento**//
  function groupingordersdependenceController($scope, hidelist, keygroupingorders, close) {
    $scope.hidelist = hidelist;
    $scope.keygroupingorders = keygroupingorders;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
