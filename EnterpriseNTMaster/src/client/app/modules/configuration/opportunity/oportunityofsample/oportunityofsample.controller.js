(function () {
  'use strict';

  angular
    .module('app.oportunityofsample')
    .controller('OportunityofsampleController', OportunityofsampleController)
    .controller('oportunitydependenceController', oportunitydependenceController)
    .controller('Controllerinformat', Controllerinformat)
    .controller('Confirmreplace', Confirmreplace);

  OportunityofsampleController.$inject = ['destinationDS', 'configurationDS', 'branchDS', 'ordertypeDS', 'sampleDS', 'oportunityofsampleDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function OportunityofsampleController(destinationDS, configurationDS, branchDS, ordertypeDS, sampleDS, oportunityofsampleDS,
    localStorageService, logger, $filter, $state, moment, $rootScope, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'OportunityofSample';
    vm.sortReverse = false;
    vm.sortType = 'code';
    vm.sortReverse1 = false;
    vm.sortType1 = 'code';
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getId = getId;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.listuser = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataoportunidate = removeDataoportunidate;
    vm.getBranch = getBranch;
    vm.getOrderType = getOrderType;
    vm.getSample = getSample;
    vm.getDestinationAssignment = getDestinationAssignment;
    vm.changeassig = changeassig;
    vm.changemin = changemin;
    vm.ordertype = [];
    vm.Branch = [];
    vm.changemax = changemax;
    vm.requerid = ($filter('translate')('0016'));
    vm.expectedTime = null;
    vm.maximumTime = null;
    vm.changeminfile = changeminfile;
    vm.changemaxfile = changemaxfile;
    vm.isDisabledSave = true;
    vm.getdetination = getdetination;
    vm.isDisabledCancel = true;
    vm.cancel = cancel;
    vm.keyselectmin = keyselectmin
    vm.keyselectmax = keyselectmax
    vm.selectService = selectService;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;

    //** Metodo que evalua cuando selecciona un servicio**//
    function selectService(element) {
      if (element !== undefined) {
        vm.expectedTime = JSON.parse(JSON.stringify(element.expectedTime === null ? 0 : element.expectedTime))
        vm.maximumTime = JSON.parse(JSON.stringify(element.maximumTime === null ? 0 : element.maximumTime))

        if (vm.selected !== -1 && vm.selected !== 0) {
          if (vm.selected.expectedTime >= vm.selected.maximumTime && vm.selected.expectedTime !== 0 && vm.selected.maximumTime !== 0) {
            setTimeout(function () {
              document.getElementById('maximumTime').focus()
            }, 100);
          } else {

            if (vm.selected.id !== element.id && ((vm.selected.expectedTime === 0 || vm.selected.expectedTime === null) || (vm.selected.maximumTime === 0 || vm.selected.maximumTime === null))) {
              vm.selected.expectedTime = null;
              vm.selected.maximumTime = null;
            }
            if (vm.selected.id !== element.id) {
              setTimeout(function () {
                document.getElementById('expectedTime').focus()
              }, 100);
              vm.selected = element;
            }
          }
        } else {
          setTimeout(function () {
            document.getElementById('expectedTime').focus()
          }, 100);
          vm.selected = element;
        }
      }
    }
    //** Metodo que guarda cuando se le da enter en el dato mínimo**//
    function keyselectmin($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        setTimeout(function () {
          document.getElementById('maximumTime').focus()
        }, 500);
      }
    }
    //** Metodo que guarda cuando se le da enter en el dato máximo**//
    function keyselectmax($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        vm.expectedTime = vm.expectedTime === null ? 0 : vm.expectedTime;
        vm.maximumTime = vm.maximumTime === null ? 0 : vm.maximumTime;
        if (parseInt(vm.expectedTime) !== vm.selected.expectedTime || parseInt(vm.maximumTime) !== vm.selected.maximumTime) {
          if (vm.selected.expectedTime < vm.selected.maximumTime && vm.selected.expectedTime !== 0 && vm.selected.maximumTime !== 0) {
            vm.selected.selected = true;
            vm.update(true);
          } else if (parseInt(vm.expectedTime) !== vm.selected.expectedTime || parseInt(vm.maximumTime) !== vm.selected.maximumTime && vm.selected.expectedTime === 0 && vm.selected.maximumTime === 0) {
            vm.selected.selected = false;
            vm.selected.expectedTime = null;
            vm.selected.maximumTime = null;
            vm.update(true);
          }
        } else {
          vm.selected.expectedTime = vm.selected.expectedTime === 0 ? null : vm.selected.expectedTime;
          vm.selected.maximumTime = vm.selected.maximumTime === 0 ? null : vm.selected.maximumTime;
          vm.selected = vm.filtered1[_.findIndex(vm.filtered1, function (o) {
            return o.id == vm.selected.id
          }) + 1];
          vm.selected = vm.selected === undefined ? vm.filtered1[0] : vm.selected
          vm.expectedTime = JSON.parse(JSON.stringify(vm.selected.expectedTime))
          vm.maximumTime = JSON.parse(JSON.stringify(vm.selected.maximumTime))
          setTimeout(function () {
            document.getElementById('expectedTime').focus()
          }, 100);
        }
      }

    }

    function changeassig() {
      vm.expectedTime = null;
      vm.maximumTime = null;
      if (vm.Any === true) {
        ModalService.showModal({
          templateUrl: 'Confirmreplace.html',
          controller: 'Confirmreplace',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              for (var i = 0; i < vm.Detail.length; i++) {
                vm.Detail[i].selected = true;
                vm.Detail[i].expectedTime = null;
                vm.Detail[i].maximumTime = null;
                vm.Detail[i].required = false;
              }
            }
            if (result === 'No') {
              vm.Any = false;
            }
          });
        });
      }
      if (vm.Any === false) {
        for (var i = 0; i < vm.Detail.length; i++) {
          vm.Detail[i].selected = false;
          vm.Detail[i].required = false;
        }
      }
    }
    // cuando se sale del foco de todos minimo
    function changemin() {
      if (vm.maximumTime !== null) {
        if (vm.maximumTime <= vm.expectedTime) {
          vm.expectedTime = null;
          ModalService.showModal({
            templateUrl: "Informat.html",
            controller: "Controllerinformat"
          }).then(function (modal) {
            modal.element.modal();
          });

        }
      }
      for (var i = 0; i < vm.Detail.length; i++) {
        vm.Detail[i].expectedTime = vm.expectedTime;
      }
    }
    // cuando se sale del foco de todos minimo
    function changemax() {
      if (vm.maximumTime <= vm.expectedTime) {
        vm.maximumTime = null;
        ModalService.showModal({
          templateUrl: "Informat.html",
          controller: "Controllerinformat"
        }).then(function (modal) {
          modal.element.modal();
        });
      }
      for (var i = 0; i < vm.Detail.length; i++) {
        vm.Detail[i].maximumTime = vm.maximumTime;
      }
    }
    // cuando se sale del foco de todos minimo
    function changeminfile() {
      if (parseInt(vm.expectedTime) !== vm.selected.expectedTime || parseInt(vm.maximumTime) !== vm.selected.maximumTime) {
        if (vm.selected.expectedTime < vm.selected.maximumTime && (vm.selected.expectedTime !== 0 && vm.selected.expectedTime !== null) && (vm.selected.maximumTime !== 0 && vm.selected.maximumTime !== null)) {
          vm.selected.selected = true;
          vm.update();
        }
      }
    }
    // cuando se sale del foco de todos minimo
    function changemaxfile() {
      if (vm.selected.expectedTime < vm.selected.maximumTime && (vm.selected.expectedTime !== 0 && vm.selected.expectedTime !== null) && (vm.selected.maximumTime !== 0 && vm.selected.maximumTime !== null)) {
        vm.update();
      }
    }
    //** Metodo para obtener una lista destinos**//
    function getdetination() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationDS.getDestinationActive(auth.authToken).then(function (data) {
        vm.destination = data.data;
        vm.getBranch()
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista sedes**//
    function getBranch() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        if (data.data.length === 0) {
          vm.listBranch = data.data;
        } else {
          vm.listBranch = $filter('orderBy')(data.data, 'name');
          vm.Branch.id = 0;
        }
        vm.getOrderType()
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista tipos de orden **//
    function getOrderType() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        if (data.data.length === 0) {
          vm.listordertype = data.data;
        } else {
          data.data.push({
            'id': 0,
            'name': $filter('translate')('0209')
          })
          vm.listordertype = $filter('orderBy')(data.data, 'name');
          vm.ordertype.id = 0;
        }
        vm.getSample();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de muestras **//
    function getSample() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.getSampleActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.listsample = $filter('orderBy')(data.data, 'name');
        vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }

    function getDestinationAssignment() {
      vm.Detail = [];
      vm.data = [];
      vm.selected = -1;
      vm.selected1 = -1;
      vm.isDisabledSave = true;
      vm.isDisabledPrint = true;
      vm.isDisabledCancel = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.Branch !== undefined && vm.sample !== undefined && vm.ordertype !== undefined) {
        vm.loadingdata = true;
        return oportunityofsampleDS.getoportunityofsample(auth.authToken, vm.Branch.id, vm.sample.id, vm.ordertype.id).then(function (data) {
          vm.data = data.data.destinationRoutes.length === 0 ? data.data.destinationRoutes : removeData(data);
          vm.loadingdata = false;
        }, function (error) {
          vm.modalError(error);
        });
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.destinationRoutes.forEach(function (value, key) {
        delete value.sampleOportunitys;
        delete value.tests;
        value.code = value.destination.code;
        value.name = value.destination.name;
        if (($filter('translate')('0000')) === 'esCo') {
          value.typename = value.destination.type.esCo;
        } else {
          value.typename = value.destination.type.enUsa;
        }
        delete value.destination;
        delete value.order;
        value.username = auth.userName;
      });
      return data.data.destinationRoutes;
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
        vm.getdetination();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update(key) {
      if (parseInt(vm.expectedTime) !== vm.selected.expectedTime || parseInt(vm.maximumTime) !== vm.selected.maximumTime) {
        vm.loadingdata = true;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.sampleOportunitysave = $filter('filter')(vm.Detail, {
          selected: true
        });
        var save = [];
        var object = {
          'id': vm.idrute,
          'order': vm.orderrute,
          'sampleOportunitys': vm.sampleOportunitysave,
          'branch': {
            'name': vm.Branch.name
          },
          'typeOrder': {
            'name': vm.ordertype.id === 0 ? $filter('translate')('0209') : vm.ordertype.name
          },
          'sample': {
            'name': vm.sample.name
          },
          'destination': {
            'name': vm.namedestinantion
          }
        };
        save.push(object);
        return oportunityofsampleDS.updateoportunityofsample(auth.authToken, save).then(function (data) {
          if (data.status === 200) {
            if (key !== undefined) {

              vm.selected = vm.filtered1[_.findIndex(vm.filtered1, function (o) {
                return o.id == vm.selected.id
              }) + 1];
              vm.selected = vm.selected === undefined ? vm.filtered1[0] : vm.selected;
              vm.expectedTime = JSON.parse(JSON.stringify(vm.selected.expectedTime));
              vm.maximumTime = JSON.parse(JSON.stringify(vm.selected.maximumTime));
              setTimeout(function () {
                document.getElementById('expectedTime').focus()
              }, 100);
            }
            vm.loadingdata = false;
            logger.success($filter('translate')('0042'));

          }
        }, function (error) {
          vm.modalError(error);
        });
      }

    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.selectedcancel = vm.selected;
      vm.getDestinationAssignment();
      vm.selected = vm.selectedcancel;
      vm.getId(vm.idrute, vm.selected);
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.listsample.length === 0 || vm.destination.length === 0 || vm.listBranch.length === 0 || vm.listordertype.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'oportunitydependenceController',
          inputs: {
            hidedestination: vm.destination.length,
            hidebranch: vm.listBranch.length,
            hideordertype: vm.listordertype.length,
            hidesample: vm.listsample.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected1 = index;
      vm.selected = -1;
      vm.Detail = [];
      vm.username = auth.userName;
      vm.Any = false;
      vm.expectedTime = null;
      vm.maximumTime = null;
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.loadingdata = true;
      return oportunityofsampleDS.getoportunityofsample(auth.authToken, vm.Branch.id, vm.sample.id, vm.ordertype.id).then(function (data) {
        vm.loadingdata = false;
        vm.opotunidate = $filter('filter')(data.data.destinationRoutes, {
          id: id
        }, true);
        vm.namedestinantion = vm.opotunidate[0].destination.name;
        vm.idrute = vm.opotunidate[0].id;
        vm.orderrute = vm.opotunidate[0].order;
        vm.isDisabledPrint = false;
        vm.Detail = vm.opotunidate[0].sampleOportunitys;
        vm.Detail = vm.Detail.length === 0 ? vm.Detail : removeDataoportunidate(vm.Detail);
        vm.usuario = $filter('translate')('0017') + ' ';
        vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
        vm.usuario = vm.usuario + vm.username;
        return vm.Detail;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataoportunidate(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.forEach(function (value, key) {
        data[key].id = value.service.id;
        data[key].code = value.service.code;
        data[key].name = value.service.name;
        data[key].required = false;
        data[key].username = auth.userName;
      });
      return data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.reportsdetination = $filter('filter')(vm.Detail, {
        selected: true
      });
      if (vm.reportsdetination.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'branch': vm.Branch.name,
          'ordertype': vm.ordertype.id === 0 ? $filter('translate')('0133') : vm.ordertype.name,
          'sample': vm.sample.name,
          'namedestinantion': vm.namedestinantion
        };
        vm.datareport = vm.reportsdetination;
        vm.pathreport = '/report/configuration/opportunity/oportunityofsample/oportunityofsample.mrt';
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
  //** Método para cargar la ventana modal de requeridos*//
  function oportunitydependenceController($scope, hidedestination, hidebranch, hideordertype, hidesample, close) {
    $scope.hidedestination = hidedestination;
    $scope.hidebranch = hidebranch;
    $scope.hideordertype = hideordertype;
    $scope.hidesample = hidesample;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método para cargar la ventana modal para innformar un cambio*//
  function Controllerinformat($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Método para cargar la ventana modal para confirmar el cambio*//
  function Confirmreplace($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
