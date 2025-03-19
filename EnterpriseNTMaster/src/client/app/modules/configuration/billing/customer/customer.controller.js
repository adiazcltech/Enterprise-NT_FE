(function () {
  'use strict';

  angular
    .module('app.customer')
    .controller('CustomerController', CustomerController);

  CustomerController.$inject = ['customerDS', 'localStorageService', 'logger', '$rootScope',
    'configurationDS', '$filter', '$state', 'moment', 'LZString', '$translate', 'centralsystemDS'
  ];

  function CustomerController(customerDS, localStorageService, logger, $rootScope,
    configurationDS, $filter, $state, moment, LZString, $translate, centralsystemDS) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Customer';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.customerDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isRequiredPassword = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCustomer = getCustomer;
    vm.getCustomerId = getCustomerId;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getConfigurationmask = getConfigurationmask;
    vm.getConfiguration = getConfiguration;
    vm.generateFile = generateFile;
    vm.NewCustomer = NewCustomer;
    vm.EditCustomer = EditCustomer;
    vm.changeState = changeState;
    vm.changeEmail = changeEmail;
    vm.changeFax = changeFax;
    vm.cancelCustomer = cancelCustomer;
    vm.insertCustomer = insertCustomer;
    vm.updateCustomer = updateCustomer;
    vm.saveCustomer = saveCustomer;
    vm.stateButton = stateButton;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.validMail = /^[a-z]+[a-z0-9._]+@[a-z0-9._-]+\.[a-z.]{2,5}$/;
    vm.maskphone = '';
    var auth;
    vm.haspKey = true;
    vm.requeridKey = true;
    vm.windowOpenReport = windowOpenReport;
    vm.changue = changue;
    vm.getsystemcentral = getsystemcentral;
    vm.loadingdata = true;
    vm.cfdi = [
      { "id": "G01", "name": $filter('translate')('1231') },
      { "id": "G02", "name": $filter('translate')('1232') },
      { "id": "G03", "name": $filter('translate')('1233') },
      { "id": "I01", "name": $filter('translate')('1234') },
      { "id": "I02", "name": $filter('translate')('1235') },
      { "id": "I03", "name": $filter('translate')('1236') },
      { "id": "I04", "name": $filter('translate')('1237') },
      { "id": "I05", "name": $filter('translate')('1238') },
      { "id": "I06", "name": $filter('translate')('1239') },
      { "id": "I07", "name": $filter('translate')('1240') },
      { "id": "I08", "name": $filter('translate')('1241') },
      { "id": "D01", "name": $filter('translate')('1242') },
      { "id": "D02", "name": $filter('translate')('1243') },
      { "id": "D03", "name": $filter('translate')('1244') },
      { "id": "D04", "name": $filter('translate')('1245') },
      { "id": "D05", "name": $filter('translate')('1246') },
      { "id": "D06", "name": $filter('translate')('1247') },
      { "id": "D07", "name": $filter('translate')('1248') },
      { "id": "D08", "name": $filter('translate')('1249') },
      { "id": "D09", "name": $filter('translate')('1250') },
      { "id": "D10", "name": $filter('translate')('1251') },
      { "id": "P01", "name": $filter('translate')('1252') }
    ]
    //RegimenFiscal
    vm.regimenFiscal = [
      { "id": "601", "name": $filter('translate')('3143') },
      { "id": "603", "name": $filter('translate')('3144') },
      { "id": "605", "name": $filter('translate')('3145') },
      { "id": "606", "name": $filter('translate')('3146') },
      { "id": "607", "name": $filter('translate')('3147') },
      { "id": "608", "name": $filter('translate')('3148') },
      { "id": "610", "name": $filter('translate')('3149') },
      { "id": "611", "name": $filter('translate')('3150') },
      { "id": "612", "name": $filter('translate')('3151') },
      { "id": "614", "name": $filter('translate')('3152') },
      { "id": "615", "name": $filter('translate')('3153') },
      { "id": "616", "name": $filter('translate')('3154') },
      { "id": "620", "name": $filter('translate')('3155') },
      { "id": "621", "name": $filter('translate')('3156') },
      { "id": "622", "name": $filter('translate')('3157') },
      { "id": "623", "name": $filter('translate')('3158') },
      { "id": "624", "name": $filter('translate')('3159') },
      { "id": "625", "name": $filter('translate')('3160') },
      { "id": "626", "name": $filter('translate')('3161') }
    ]




    // función que consulta la llave de configuración
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'Facturacion').then(function (data) {
        vm.getsystemcentral();
        vm.haspKey = data.data.value === '2';
        vm.requeridKey = data.data.value !== '2';
      }, function (error) {
        vm.modalError(error);
      });
    }

    function getsystemcentral() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        vm.listcentralsytem = data.data;
        vm.getCustomer();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que valida la autenticación**//
    function changue() {
      if (vm.customerDetail.agreement === true) {
        vm.customerDetail.invoice = false;
      }
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
    //** Metodo para adicionar o eliminar datos de JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.nit;
        delete value.phone;
        delete value.fax;
        delete value.responsable;
        delete value.maxAmount;
        delete value.currentAmount;
        delete value.alertAmount;
        delete value.discount;
        delete value.observation;
        delete value.institutional;
        delete value.admonCode;
        delete value.colony;
        delete value.epsCode;
        delete value.address;
        delete value.additionalAddress;
        delete value.postalCode;
        delete value.city;
        delete value.faxSend;
        delete value.print;
        delete value.connectivityEMR;
        delete value.email;
        delete value.automaticEmail;
        delete value.selfPay;
        delete value.sendEnd;
        delete value.username;
        delete value.password;
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });

      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo usuario**//
    function NewCustomer(Customerform) {
      Customerform.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.customerDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'nit': '',
        'name': '',
        'phone': '',
        'fax': '',
        'responsable': '',
        'maxAmount': 0,
        'currentAmount': 0,
        'alertAmount': 0,
        'discount': 0,
        'capitated': 0,
        'observation': '',
        //'institutional': false,
        'epsCode': '',
        'address': '',
        'additionalAddress': '',
        'postalCode': '',
        'city': '',
        'faxSend': false,
        'print': true,
        'connectivityEMR': false,
        'email': '',
        'automaticEmail': false,
        'selfPay': false,
        'username': '',
        'password': '',
        'state': false,
        'admonCode': '',
        'colony': '',
        'namePrint': '',
        'encryptionReportResult': false,
        'notificationResults': false,
        'notificationRetake': false
        //'sendEnd': false,
      };
      vm.stateButton('add');
    }
    //** Metodo para consultar el formato de la aplicación**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getConfigurationmask();
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
        vm.getConfiguration();
        if (data.data.value !== '') {
          vm.maskphone = data.data.value;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que deshabilitar los controles y botones para cancelar un usuario**//
    function cancelCustomer(CustomerForm) {
      CustomerForm.$setUntouched();
      if (vm.customerDetail.id === null || vm.customerDetail.id === undefined) {
        vm.customerDetail = [];
        vm.validMail = /^[a-z]+[a-z0-9._]+@[a-z0-9._-]+\.[a-z.]{2,5}$/;
      } else {
        vm.getCustomerId(vm.customerDetail.id, vm.selected, CustomerForm);
        vm.customerDetail.email = '';
      }
      vm.stateButton('init');
      vm.nameRepeat = false;
      vm.nitRepeat = false;
      vm.usersNameRepeat = false;
      vm.admonCodeRepeat = false;
      vm.epsCodeRepeat = false;
      vm.emailInvalid = false
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo usuario**//
    function EditCustomer() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo usuario o se va actualizar **//
    function saveCustomer(CustomerForm) {
      CustomerForm.$setUntouched();
      CustomerForm.namePrint.$touched = true;
      CustomerForm.name.$touched = true;
      CustomerForm.nit.$touched = true;
      CustomerForm.email.$touched = true;
      /*  CustomerForm.postalCode.$touched = true; */
      if (CustomerForm.$error.email === undefined && CustomerForm.$error.required === undefined) {
        if (vm.customerDetail.id === null) {
          vm.loadingdata = true;
          vm.insertCustomer();
        } else {
          vm.updateCustomer();
        }
      }

    }
    //** Método que inserta un nuevo usuario**//
    function insertCustomer() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.newCustomer(auth.authToken, vm.customerDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCustomer();
          vm.customerDetail.id = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un usuario**//
    function updateCustomer() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.customerDetail.user.id = auth.id;
      return customerDS.updateCustomer(auth.authToken, vm.customerDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCustomer();
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
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'nit') {
              vm.nitRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'username') {
              vm.usersNameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'admonCode') {
              vm.admonCodeRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'eps code') {
              vm.epsCodeRepeat = item[0] === '1' && item[1] === 'eps code';
            }
            if (item[0] === '1' && item[1] === 'email') {
              vm.emailInvalid = true;
            }
          });
        }
      }
      if (!vm.nameRepeat && !vm.usersNameRepeat && !vm.nitRepeat && !vm.admonCodeRepeat && !vm.epsCodeRepeat && !vm.emailInvalid) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método para validar el cambio de email**//
    function changeEmail() {
      if (vm.customerDetail.automaticEmail) {
        vm.customerDetail.automaticEmail = vm.customerDetail.email !== '' &&
          vm.customerDetail.email !== undefined;
      }
    }
    //** Método para validar el cambio de fax**//
    function changeFax() {
      if (vm.customerDetail.faxSend) {
        vm.customerDetail.faxSend = vm.customerDetail.fax !== '' &&
          vm.customerDetail.fax !== undefined;
      }
    }
    //** Método que obtiene una lista de usuarios**//
    function getCustomer() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomer(auth.authToken).then(function (data) {
        vm.dataCustomer = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene un usuario por id*//
    function getCustomerId(id, index, CustomerForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.customerDetail = [];
      vm.nameRepeat = false;
      vm.nitRepeat = false;
      vm.usersNameRepeat = false;
      vm.admonCodeRepeat = false;
      vm.epsCodeRepeat = false;
      vm.emailInvalid = false;
      CustomerForm.$setUntouched();
      vm.loadingdata = true;
      return customerDS.getCustomerId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ' + moment(data.data.lastTransaction).format(vm.formatDate) + '-' + data.data.user.userName;
          vm.stateButton('update');
          vm.customerDetail = data.data;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /**funcion para generar informe en PDF O EXEL de areas*/
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/billing/customer/customer.mrt';
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
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.customerDetail.id === null || vm.customerDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isRequiredPassword = true;
        setTimeout(function () {
          document.getElementById('nit').focus()
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
        vm.isRequiredPassword = false;
        setTimeout(function () {
          document.getElementById('nit').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isRequiredPassword = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
