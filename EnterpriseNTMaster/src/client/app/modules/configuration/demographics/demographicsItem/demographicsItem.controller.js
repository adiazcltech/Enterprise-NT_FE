(function () {
  'use strict';
  angular.module('app.demographicsItem')
    .controller('DemographicsItemsController', DemographicsItemsController)
    .controller('RequeridoController', RequeridoController);
  DemographicsItemsController.$inject = ['demographicsItemDS', 'configurationDS', 'ModalService', 'demographicDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function DemographicsItemsController(demographicsItemDS, configurationDS, ModalService, demographicDS,
    localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'DemographicsItems';
    vm.name = ['name', 'origin'];
    vm.originorder = ['origin', 'name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.selectedPather = -1;
    vm.demographicsItemsDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getListDemoDecodeds = getListDemoDecodeds;
    vm.getSelectedDemo = getSelectedDemo;
    vm.getDemographicsItems = getDemographicsItems;
    vm.getDemographicsItemsId = getDemographicsItemsId;
    vm.NewDemographicsItems = NewDemographicsItems;
    vm.EditDemographicsItems = EditDemographicsItems;
    vm.changeState = changeState;
    vm.cancelDemographicsItems = cancelDemographicsItems;
    vm.insertDemographicsItems = insertDemographicsItems;
    vm.updateDemographicsItems = updateDemographicsItems;
    vm.saveDemographicsItems = saveDemographicsItems;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.stateButton = stateButton;
    var auth;
    vm.codeRepeat = false;
    vm.nameRepeat = false;
    vm.errorservice = 0;
    vm.generateFile = generateFile;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.origin = '';
    vm.changeFormDemo = false;
    vm.getChangeDemo = getChangeDemo;
    vm.editdemographics = editdemographics;
    vm.resultNotByDemo = localStorageService.get("ManejoNotificacionResultados") === 'True' ? true : false;


    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo para habilitar los controles para editar**//
    function editdemographics(item, origin) {
      $rootScope.demographic = {
        id: item,
        origin: origin
      }
      $state.go('demographic');
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
        vm.getListDemoDecodeds();
      }, function (error) {
        vm.modalError(error);
      });
    }
    /**Método que actualiza cualquier cambiuo en demográficos padres*/
    function getChangeDemo() {
      if (vm.changeFormDemo) {
        vm.getListDemoDecodeds();
      }
    }
    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto demographicItems*/
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].username = auth.userName;
        value.displayNameItem = value.code + ' - ' + value.name;

      });
      return data.data;
    }
    /** Funcion consultar el listado de los demográficos codificados en el sistema*/
    function getListDemoDecodeds() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemoEncodeds(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.totalDemoDecodeds = data.data;
          vm.getDemographicsItems();
          if (vm.changeFormDemo) {
            var selectDemo = _.filter(vm.totalDemoDecodeds, function (d) {
              return d.id === vm.selectedPather
            })
            if (selectDemo.length > 0) {
              vm.nameDemo = selectDemo[0].name.toUpperCase();
              vm.origin = selectDemo[0].origin === 'O' ? $filter('translate')('0061').toUpperCase() : $filter('translate')('0070').toUpperCase();
              vm.originDemo = selectDemo[0].origin;
            } else {
              vm.nameDemo = '';
              vm.origin = '';
              vm.selectedPather = -1;
            }
          }
          vm.changeFormDemo = false;
        }
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'RequeridoController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              $state.go(result);
            });
          });
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo ítem demográfico**//
    function NewDemographicsItems(DemographicsItemsForm) {
      DemographicsItemsForm.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.demographicsItemsDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'code': '',
        'name': '',
        'state': true,
        'description': '',
        'demographic1': null,
        'defaultItem': false
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar un ítem demográfico**//
    function cancelDemographicsItems(DemographicsItemsForm) {
      DemographicsItemsForm.$setUntouched();
      if (vm.demographicsItemsDetail.id === null) {
        vm.demographicsItemsDetail = [];
      } else {
        vm.getDemographicsItemsId(vm.demographicsItemsDetail.id, vm.selected, DemographicsItemsForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo ítem demográfico**//
    function EditDemographicsItems() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo ítem demográfico o se va actualizar**//
    function saveDemographicsItems(DemographicsItemsForm) {
      DemographicsItemsForm.$setUntouched();
      if (vm.demographicsItemsDetail.id === null) {
        vm.insertDemographicsItems();
      } else {
        vm.updateDemographicsItems();
      }
    }
    //** Método que inserta un nuevo ítem demográfico**//
    function insertDemographicsItems() {
      var demographic1 = _.filter(vm.totalDemoDecodeds, function (o) {
        return o.id === vm.selectedPather
      })[0];
      if (demographic1 !== undefined) {
        vm.demographicsItemsDetail.demographic1 = demographic1;
      }
      vm.demographicsItemsDetail.demographic = vm.demographicsItemsDetail.demographic1.id;
      vm.demographicsItemsDetail.demographicName = vm.demographicsItemsDetail.demographic1.name;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.NewDemographicsItems(auth.authToken, vm.demographicsItemsDetail).then(function (data) {
        if (data.status === 200) {
          vm.getDemographicsItems();
          vm.selected = data.data.id;
          vm.demographicsItemsDetail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un ítem demográfico**//
    function updateDemographicsItems() {
      if (vm.demographicsItemsDetail.demographic1 !== undefined) {
        vm.demographicsItemsDetail.demographic = vm.demographicsItemsDetail.demographic1.id;
        vm.demographicsItemsDetail.demographicName = vm.demographicsItemsDetail.demographic1.code;
        vm.demographicsItemsDetail.demographicName = vm.demographicsItemsDetail.demographic1.name;
      } else {
        vm.demographicsItemsDetail.demographicName = vm.demographicsItemsDetail.code;
        vm.demographicsItemsDetail.demographicName = vm.demographicsItemsDetail.name;
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.updateDemographicsItems(auth.authToken, vm.demographicsItemsDetail).then(function (data) {
        if (data.status === 200) {
          vm.getDemographicsItems();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'Code') {
              vm.codeRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'Name') {
              vm.nameRepeat = true;
            }
          });
        }
      }
      if (vm.codeRepeat === false && vm.nameRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que valida cuando se selecciona un ademográfico**//
    function getSelectedDemo(id, name, origin) {
      vm.selectedPather = id;
      vm.demographicsItemsDetail = [];
      vm.selected = -1;
      vm.origin = origin === 'O' ? $filter('translate')('0061').toUpperCase() : $filter('translate')('0070').toUpperCase();
      vm.originDemo = origin;
      vm.nameDemo = name.toUpperCase()
    }
    //** Método que obtiene una lista de ítems demográficos **//
    function getDemographicsItems() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.getDemographicsItems(auth.authToken).then(function (data) {
        vm.dataDemographicsItems = data.data.length === 0 ? data.data : removeData(data);
        vm.totalDemoDecodeds.forEach(function (value) {
          value.items = _.filter(vm.dataDemographicsItems, function (it) {
            return it.demographic === value.id
          });
          value.open = 0;
          value.searchDemo = value.code + ' - ' + value.name;
        })
        vm.loadingdata = false;
        return vm.dataDemographicsItems;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene un ítem demográfico por id*//
    function getDemographicsItemsId(id, index, DemographicsItemsForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.demographicsItemsDetail = [];
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      vm.loadingdata = true;
      if (DemographicsItemsForm !== undefined) DemographicsItemsForm.$setUntouched();
      return demographicsItemDS.getDemographicsItemsId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.loadingdata = false;
          vm.selectedPather = data.data.demographic;
          vm.demographicsItemsDetail = data.data;
          var demographic1 = _.filter(vm.totalDemoDecodeds, function (o) {
            return o.id === data.data.demographic
          })[0];
          if (demographic1 !== undefined) {
            vm.demographicsItemsDetail.demographic1 = demographic1;
            vm.origin = demographic1.origin === 'O' ? $filter('translate')('0061').toUpperCase() : $filter('translate')('0070').toUpperCase();
            vm.nameDemo = demographic1.name.toUpperCase();
            vm.originDemo = demographic1.origin;
          } else {
            vm.demographicsItemsDetail = [];
            //Mensaje de advertencia de la edición del formulario
            ModalService.showModal({
              templateUrl: 'Advertence.html',
              controller: 'RequeridoController',
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === 'demographicsItem') {
                  $state.go('demographicsItem');
                }

              });
            });
          }

          //vm.demographicsItemsDetail.demographic1= $filter('filter')(vm.ListDemoDecodeds, { id: data.data.demographic })[0];
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.demographicsItemsDetail.id === null || vm.demographicsItemsDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/demographics/demographicsItem/demographicsItem.mrt';
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
      vm.stateButton('init');
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método muestra una modal con los requeridos*//
  function RequeridoController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
