(function() {
  'use strict';

  angular
      .module('app.fixative')
      .controller('fixativeController', fixativeController);

  fixativeController.$inject = ['fixativeDS', 'configurationDS', 'localStorageService', 'logger',
      '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function fixativeController(fixativeDS, configurationDS, localStorageService,
      logger, $filter, $state, moment, $rootScope, LZString, $translate) {

      var vm = this;
      $rootScope.menu = true;
      vm.init = init;
      vm.title = 'Fixative';
      vm.code = ['code', 'name', 'state'];
      vm.name = ['name', 'code', 'state'];
      vm.state = ['-state', '+code', '+name'];
      vm.sortReverse = false;
      vm.sortType = vm.code;
      vm.selected = -1;
      vm.getFixatives = getFixatives;
      vm.getFixativeById = getFixativeById;
      vm.fixativeDetail = [];
      vm.addFixative = addFixative;
      vm.editFixative = editFixative;
      vm.saveFixative = saveFixative;
      vm.insertFixative = insertFixative;
      vm.updateFixative = updateFixative;
      vm.cancelFixative = cancelFixative;
      vm.isDisabled = true;
      vm.isDisabledAdd = false;
      vm.isDisabledEdit = true;
      vm.isDisabledSave = true;
      vm.isDisabledCancel = true;
      vm.isDisabledPrint = false;
      vm.isDisabledState = true;
      vm.isAuthenticate = isAuthenticate;
      vm.stateButton = stateButton;
      vm.changeState = changeState;
      vm.modalError = modalError;
      vm.generateFile = generateFile;
      vm.codeRepeat = false;
      vm.nameRepeat = false;
      vm.getConfigurationFormatDate = getConfigurationFormatDate;
      vm.windowOpenReport = windowOpenReport;
      vm.loadingdata = true;

      //** Metodo configuración formato**/
      function getConfigurationFormatDate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function(data) {
              vm.getFixatives();
              if (data.status === 200) {
                  vm.formatDate = data.data.value.toUpperCase();
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para consultar el listado de fijadores de patologia existentes en el sistema */
      function getFixatives() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return fixativeDS.getFixatives(auth.authToken).then(function(data) {
              if (data.status === 200) {
                  vm.dataFixatives = data.data;
              }
              vm.loadingdata = false;
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion consultar el detalle de un fijador por id.*/
      function getFixativeById(id, index, form) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.selected = id;
          vm.fixativeDetail = [];
          vm.nameRepeat = false;
          vm.codeRepeat = false;
          vm.loadingdata = true;
          form.$setUntouched();
          return fixativeDS.getFixativeById(auth.authToken, id).then(function(data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                  vm.usuario = $filter('translate')('0017') + ' ';
                  if (data.data.updatedAt) {
                      vm.usuario = vm.usuario + moment(data.data.updatedAt).format(vm.formatDate) + ' - ';
                      vm.usuario = vm.usuario + data.data.userUpdated.userName;
                  } else {
                      vm.usuario = vm.usuario + moment(data.data.createdAt).format(vm.formatDate) + ' - ';
                      vm.usuario = vm.usuario + data.data.userCreated.userName;
                  }
                  vm.oldFixativeDetail = data.data;
                  vm.fixativeDetail = data.data;
                  vm.stateButton('update');
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para evaluar si un fijador se va a actualizar o a insertar */
      function saveFixative(form) {
          form.$setUntouched();
          vm.fixativeDetail.status = vm.fixativeDetail.status ? 1 : 0;
          if (vm.fixativeDetail.id === null) {
              vm.insertFixative();
          } else {
              vm.updateFixative();
          }
      }

      /** Funcion ejecutar el servicio que actualiza los datos de un fijador */
      function updateFixative() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.fixativeDetail.userUpdated = auth;
          return fixativeDS.updateFixative(auth.authToken, vm.fixativeDetail).then(function(data) {
              if (data.status === 200) {
                  vm.getFixatives();
                  logger.success($filter('translate')('0042'));
                  vm.stateButton('update');
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /**Funcion ejecutar el servicio que inserta los datos de un fijador.*/
      function insertFixative() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return fixativeDS.insertFixative(auth.authToken, vm.fixativeDetail).then(function(data) {
              if (data.status === 200) {
                  vm.fixativeDetail = data.data;
                  vm.getFixatives();
                  vm.selected = data.data.id;
                  vm.stateButton('insert');
                  logger.success($filter('translate')('0042'));
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion ejecutar el servicio que inserta los datos de un fijador.*/
      function editFixative() {
          vm.stateButton('edit');
      }

      /**Funcion para habilitar los controles del form */
      function addFixative(form) {
          form.$setUntouched();
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.usuario = '';
          vm.selected = -1;
          vm.fixativeDetail = {
              id: null,
              name: '',
              code: '',
              status: true,
              userCreated: auth
          };
          vm.stateButton('add');
      }

      /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un fijador.*/
      function cancelFixative(form) {
          form.$setUntouched();
          vm.nameRepeat = false;
          vm.codeRepeat = false;
          vm.code = false;
          vm.loadingdata = false;
          if (vm.fixativeDetail.id === null || vm.fixativeDetail.id === undefined) {
              vm.fixativeDetail = [];
          } else {
              vm.getFixativeById(vm.fixativeDetail.id, vm.selected, form);
          }
          vm.stateButton('init');
      }

      /** funcion para confirmar el cambio del estado que se realice sobre un fijador.*/
      function changeState() {
          if (!vm.isDisabledState) {
              vm.ShowPopupState = true;
          }
      }

      //** Método  para imprimir el reporte**//
      function generateFile() {
          if (vm.filtered.length === 0) {
              vm.open = true;
          } else {
              vm.variables = {};
              vm.datareport = vm.filtered;
              vm.pathreport = '/report/configuration/pathology/fixative/fixative.mrt';
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
      //** Metodo que valida la autenticación**//
      function isAuthenticate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (auth === null || auth.token) {
              $state.go('login');
          } else {
              vm.init();
          }
      }
      //** Metodo que evalua los estados de los botones**//
      function stateButton(state) {
          if (state === 'init') {
              vm.isDisabledAdd = false;
              vm.isDisabledEdit = vm.fixativeDetail.id === null || vm.fixativeDetail.id === undefined ? true : false;
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
              setTimeout(function() {
                  document.getElementById('codeFixative').focus()
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
              setTimeout(function() {
                  document.getElementById('codeFixative').focus()
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

      //** Método para sacar el popup de error**//
      function modalError(error) {
          vm.loadingdata = false;
          if (error.data !== null) {
              if (error.data.code === 2) {
                  error.data.errorFields.forEach(function(value) {
                      var item = value.split('|');
                      if (item[0] === '1' && item[1] === 'code') {
                          vm.codeRepeat = true;
                      }
                      if (item[0] === '1' && item[1] === 'name') {
                          vm.nameRepeat = true;
                      }
                  });
                  vm.loadingdata = false;
              }
          }
          if (vm.codeRepeat === false && vm.nameRepeat === false) {
              vm.Error = error;
              vm.ShowPopupError = true;
              vm.loadingdata = false;
          }
      }
      /** funcion inicial que se ejecuta cuando se carga el modulo */
      function init() {
          vm.getConfigurationFormatDate();
          vm.stateButton('init');
      }
      vm.isAuthenticate();
  }
})();
