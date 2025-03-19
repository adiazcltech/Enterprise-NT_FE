(function () {
  'use strict';

  angular
    .module('app.rate')
    .controller('RateController', RateController)
    .controller('ItemController', ItemController);

  RateController.$inject = ['rateDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', 'ModalService', '$rootScope', 'LZString', '$translate'
  ];

  function RateController(rateDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, ModalService, $rootScope, LZString, $translate) {


    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Rate';
    vm.code = ['code', 'name', 'state'];
    vm.name = ['name', 'code', 'state'];
    vm.state = ['-state', '+code', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    var auth;
    vm.Repeatcode = false;
    vm.Repeatname = false;
    vm.errorservice = 0;
    vm.getConfiguration = getConfiguration;
    vm.getConfigurationmask = getConfigurationmask;
    vm.maskphone = '';
    vm.haspKey = true;
    vm.requeridKey = true;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.generateFile = generateFile;
    vm.changeItems = changeItems;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;

    vm.TypePayer = [{
        id: 1,
        name: $filter('translate')('0394')
      },
      {
        id: 2,
        name: $filter('translate')('0395')
      },
      {
        id: 3,
        name: $filter('translate')('0396')
      },
      {
        id: 4,
        name: $filter('translate')('0397')
      },
      {
        id: 5,
        name: $filter('translate')('0398')
      }
    ];
    vm.claimType = [{
        id: 1,
        name: $filter('translate')('0399')
      },
      {
        id: 2,
        name: $filter('translate')('0400')
      },
      {
        id: 3,
        name: $filter('translate')('0401')
      }
    ];
    vm.transactionType = [{
        id: 1,
        name: $filter('translate')('0402')
      },
      {
        id: 2,
        name: $filter('translate')('0403')
      }
    ];
    // función que consulta la llave de configuración
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'Facturacion').then(function (data) {
        vm.getConfigurationmask();
        if (data.data.value === '2') {
          vm.haspKey = false;
          vm.requeridKey = true;
        } else {
          vm.haspKey = true;
          vm.requeridKey = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    // función que consulta la llave de configuración
    function getConfigurationmask() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoTelefono').then(function (data) {
        vm.getConfigurationFormatDate();
        if (data.data.value !== '') {
          vm.maskphone = data.data.value;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      vm.itemdefault = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.address;
        delete value.addAddress;
        delete value.city;
        delete value.department;
        delete value.phone;
        delete value.email;
        delete value.postalCode;
        delete value.webPage;
        delete value.showPriceInEntry;
        delete value.checkPaid;
        delete value.typePayer;
        delete value.assingAllAccounts;
        delete value.applyDiagnostics;
        delete value.checkCPTRelation;
        delete value.homebound;
        delete value.venipunture;
        delete value.applyTypePayer;
        delete value.claimCode;
        delete value.eligibility;
        delete value.interchangeSender;
        delete value.interchangeQualifier;
        delete value.applicationSendCode;
        delete value.labSubmitter;
        delete value.identificationPayer;
        delete value.formatMemberId;
        delete value.receiver;
        delete value.consecutive;
        delete value.outputFileName;
        delete value.claimType;
        delete value.transactionType;
        delete value.supplierSignature;
        delete value.assingBenefits;
        delete value.electronicClaim;
        if (value.defaultItem === true) {
          vm.itemdefault = true;
        }
        delete value.defaultItem;
        data.data[key].username = auth.userName;
      });
      return data.data;
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
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
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
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'code': '',
        'name': '',
        'address': '',
        'addAddress': '',
        'city': '',
        'department': '',
        'phone': '',
        'email': '',
        'postalCode': '',
        'webPage': '',
        'checkPaid': false,
        'showPriceInEntry': false,
        'typePayer': 0,
        'assingAllAccounts': false,
        'applyDiagnostics': false,
        'checkCPTRelation': false,
        'homebound': false,
        'venipunture': false,
        'applyTypePayer': false,
        'claimCode': '',
        'eligibility': false,
        'interchangeSender': '',
        'interchangeQualifier': '',
        'applicationSendCode': '',
        'labSubmitter': '',
        'identificationPayer': '',
        'formatMemberId': '',
        'receiver': '',
        'consecutive': '0',
        'outputFileName': '',
        'claimType': 0,
        'transactionType': 0,
        'supplierSignature': false,
        'assingBenefits': false,
        'electronicClaim': false,
        'defaultItem': false,
        'state': true,
      };
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeatcode = false;
      vm.Repeatname = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
      Form.name.$touched = true;
      Form.code.$touched = true;
      if (!Form.code.$invalid && !Form.name.$invalid) {
        vm.loadingdata = true;
        if (vm.Detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);

      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return rateDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
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
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeatcode = true;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeatname = true;
            }
          });
        }
      }
      if (vm.Repeatcode === false &&
        vm.Repeatname === false) {
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
    //** Método muestra un popup de confirmación para el cambio de item por defecto**//
    function changeItems() {
      if (vm.itemdefault && vm.Detail.defaultItem) {
        ModalService.showModal({
          templateUrl: 'validationItems.html',
          controller: 'ItemController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'No') {
              vm.Detail.defaultItem = false;
            }
          });
        });
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);

      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.Repeatcode = false;
      vm.Repeatname = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      return rateDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.loadingdata = false;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/billing/rate/rate.mrt';
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
      vm.getConfiguration();
    }
    vm.isAuthenticate();
  }
  //** Controller de la ventana modal de items por default*//
  function ItemController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
