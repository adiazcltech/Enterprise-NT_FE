(function () {
  'use strict';
  angular.module('app.demographic')
    .controller('DemographicsController', DemographicsController)
    .controller('validateorderController', validateorderController);
  DemographicsController.$inject = ['demographicDS', 'configurationDS', 'localStorageService',
    '$stateParams', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'ModalService'
  ];

  function DemographicsController(demographicDS, configurationDS, localStorageService,
    $stateParams, logger, $filter, $state, moment, $rootScope, LZString, $translate, ModalService) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.iddemo = $stateParams.id;
    vm.origin = $stateParams.origin;
    vm.init = init;
    vm.title = 'Demographics';
    vm.selected = -1;
    vm.demographicsDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isDisabledChangeEncoded = true;
    vm.isDisableOrigin = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getDemographics = getDemographics;
    vm.getDemographicsId = getDemographicsId;
    vm.NewDemographics = NewDemographics;
    vm.EditDemographics = EditDemographics;
    vm.changeState = changeState;
    vm.changeEncoded = changeEncoded;
    vm.cancelDemographics = cancelDemographics;
    vm.insertDemographics = insertDemographics;
    vm.updateDemographics = updateDemographics;
    vm.getDemographicsupdate = getDemographicsupdate;
    vm.saveDemographics = saveDemographics;
    vm.getListOrigin = getListOrigin;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    var auth;
    vm.sortRepeat = false;
    vm.nameRepeat = false;
    vm.generateFile = generateFile;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.filterOrigin = filterOrigin;
    vm.Orderdemo = Orderdemo;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.updateDemographicsorder = updateDemographicsorder;
    vm.updateDemographicsordering = updateDemographicsordering;
    vm.sortableOptions = {
      items: "li:not(.not-sortable)",
      cancel: ".not-sortable",
      update: function (e, ui) {
        ModalService.showModal({
          templateUrl: 'validateorder.html',
          controller: 'validateorderController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              vm.updateDemographicsorder();
            }
            if (result === 'No') {
              vm.getDemographics();
            }
          });
        });

      }

    }
    //** Método para válidar que el usuario se encuentra logueado**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método que consulta la llave de configuración de fecha del formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
        vm.getDemographics();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que adiciona o elimina elementos en el JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
        data.data[key].encodedDescription = value.encoded ? $filter('translate')('0060').toUpperCase() : $filter('translate')('0081').toUpperCase();
        data.data[key].nameType = value.name + '-' + data.data[key].encodedDescription
      });
      return data.data;
    }
    //** Método que válida el cambio de tipo demográfico**//
    function filterOrigin(origin) {
      vm.selected = -1;
      if (!vm.isDisabled) return;
      vm.demographicsDetail = {};
      vm.origin = origin;
      vm.getDemographics();
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo demográfico**//
    function NewDemographics(DemographicsForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      DemographicsForm.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.demographicsDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'origin': vm.origin,
        'encoded': true,
        'obligatory': 0,
        'ordering': vm.dataDemographics.length + 1,
        'format': '',
        'defaultValue': '',
        'statistics': true,
        'lastOrder': true,
        'canCreateItemInOrder': true,
        'modify': true,
        'state': true,
        'demographicItem': 0
      };
      vm.stateButton('add');
    }
    /** Funcion que llena un combobox domde está el origen de un demográfico. H: Historia, O: Orden.*/
    function getListOrigin() {
      var data = [{
        'value': 'H',
        'text': $filter('translate')('0070')
      }, {
        'value': 'O',
        'text': $filter('translate')('0061')
      }];
      vm.listOrigin = data;
      vm.loadingdata = false;
      return data;
    }
    //** Método que deshabilitar los controles y botones para cancelar un demográfico**//
    function cancelDemographics(DemographicsForm) {
      DemographicsForm.$setUntouched();
      if (vm.demographicsDetail.id === null) {
        vm.demographicsDetail = [];
      } else {
        vm.getDemographicsId(vm.demographicsDetail.id, DemographicsForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo demográfico**//
    function EditDemographics() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo demográfico o se va actualizar**//
    function saveDemographics(DemographicsForm) {
      vm.demographicsDetail.obligatory = vm.demographicsDetail.obligatory ? 1 : 0;
      DemographicsForm.$setUntouched();
      if (vm.demographicsDetail.id === null) {
        vm.insertDemographics();
      } else {
        vm.updateDemographics();
      }
    }
    //** Método que inserta un nuevo demográfico**//
    function insertDemographics() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.NewDemographics(auth.authToken, vm.demographicsDetail).then(function (data) {
        if (data.status === 200) {
          vm.getDemographicsupdate();
          vm.demographicsDetail = data.data;
          vm.nameRepeat = false;
          logger.success($filter('translate')('0042'));
          vm.stateButton('insert');
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
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
          });
        }
      }
      if (vm.sortRepeat === false && vm.nameRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método que guarda el orden de los demográficos**//
    function updateDemographicsorder() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      vm.data = []
      for (var i = 0; i < vm.dataDemographics.length; i++) {
        vm.demographicsDetail = {
          'user': {
            'id': auth.id
          },
          'id': vm.dataDemographics[i].id,
          'name': vm.dataDemographics[i].name,
          'origin': vm.dataDemographics[i].origin,
          'encoded': vm.dataDemographics[i].encoded,
          'obligatory': vm.dataDemographics[i].obligatory,
          'ordering': i + 1,
          'format': vm.dataDemographics[i].format,
          'defaultValue': vm.dataDemographics[i].defaultValue,
          'statistics': vm.dataDemographics[i].statistics,
          'lastOrder': vm.dataDemographics[i].lastOrder,
          'canCreateItemInOrder': vm.dataDemographics[i].canCreateItemInOrder,
          'modify': vm.dataDemographics[i].modify,
          'state': vm.dataDemographics[i].state,
          'demographicItem': vm.dataDemographics[i].demographicItem
        };
        vm.data.add(vm.demographicsDetail);
      }
      vm.updateDemographicsordering();
      vm.loadingdata = false;
      vm.demographicsDetail = {};
      vm.selected = -1;
      logger.success($filter('translate')('0042'));
    }
    //** Método que Actualiza un demográfico**//
    function updateDemographicsordering() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      var pru = {
        'user': {
          'id': auth.id
        },
        'id': -101,
        'name': "0234",
        'origin': "H",
        'encoded': false,
        'obligatory': 1,
        'ordering': 10
      };
      vm.data.add(pru);


      return demographicDS.demographicsordering(auth.authToken, vm.data).then(function (data) {
        if (data.status === 200) { }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un demográfico**//
    function updateDemographics() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.updateDemographics(auth.authToken, vm.demographicsDetail).then(function (data) {
        if (data.status === 200) {
          vm.getDemographicsupdate();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una lista de demográficos**//
    function getDemographicsupdate() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographics(auth.authToken).then(function (data) {
        vm.demographicsAll = data.data.length === 0 ? data.data : removeData(data);
        vm.dataDemographics = $filter('filter')(vm.demographicsAll, {
          origin: vm.origin
        }, true);
        vm.getListOrigin();
        vm.dataDemographics = $filter('orderBy')(vm.dataDemographics, 'ordering');
        vm.dataDemographics.sort(vm.Orderdemo);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que ordena la lista de demográficos**//
    function Orderdemo(a, b) {
      if (a.state > b.state) {
        return -1;
      } else if (a.state < b.state) {
        return 1;
      } else {
        if (a.ordering < b.ordering) {
          return -1;
        } else if (a.ordering > b.ordering) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que cambia los estados de los switchs Agragar items, **//
    function changeEncoded() {
      if (!vm.isDisabled) {
        vm.isDisabledChangeEncoded = vm.demographicsDetail.encoded;
        vm.demographicsDetail.format = vm.demographicsDetail.encoded ? '' : vm.demographicsDetail.format;
        vm.demographicsDetail.canCreateItemInOrder = !vm.demographicsDetail.encoded ? false : true;
        vm.demographicsDetail.statistics = !vm.demographicsDetail.encoded ? false : true;
      }
    }
    //** Método que obtiene una lista de demográficos**//
    function getDemographics() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographics(auth.authToken).then(function (data) {
        vm.demographicsAll = data.data.length === 0 ? data.data : removeData(data);
        vm.dataDemographics = $filter('filter')(vm.demographicsAll, {
          origin: vm.origin
        }, true);
        vm.getListOrigin();
        vm.dataDemographics = $filter('orderBy')(vm.dataDemographics, 'ordering');
        return vm.dataDemographics;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene un demográfico por id*//
    function getDemographicsId(id, DemographicsForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.demographicsDetail = [];
      vm.nameRepeat = false;
      vm.sortRepeat = false;
      vm.loadingdata = true;
      if (DemographicsForm !== undefined) DemographicsForm.$setUntouched();
      return demographicDS.getDemographicsId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.demographicsDetail = data.data;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      vm.nameRepeat = false;
      vm.sortRepeat = false;
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.demographicsDetail.id === null || vm.demographicsDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isDisableOrigin = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisableOrigin = false;
        vm.demographicsDetail.origin = vm.origin;
        setTimeout(function () {
          document.getElementById('name').focus()
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
        vm.isDisableOrigin = true;
        setTimeout(function () {
          document.getElementById('name').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisableOrigin = false;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isDisableOrigin = false;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.dataDemographics.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.dataDemographics;
        vm.pathreport = '/report/configuration/demographics/demographic/demographic.mrt';
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
      vm.origin = 'H';
      if ($rootScope.demographic !== undefined) {
        vm.origin = $rootScope.demographic.origin;
        vm.getDemographicsId($rootScope.demographic.id);
        $rootScope.demographic = undefined
      }
    }
    vm.isAuthenticate();
  }
  //**modal para confirmar si se guarda el orden de los demograficos*//
  function validateorderController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
