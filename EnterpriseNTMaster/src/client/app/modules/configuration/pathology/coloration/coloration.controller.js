(function() {
  'use strict';

  angular
      .module('app.coloration')
      .controller('colorationController', colorationController);

  colorationController.$inject = ['colorationDS', 'configurationDS', 'localStorageService', 'logger',
      '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function colorationController(colorationDS, configurationDS, localStorageService,
      logger, $filter, $state, moment, $rootScope, LZString, $translate) {

      var vm = this;
      $rootScope.menu = true;
      vm.init = init;
      vm.title = 'Coloration';
      vm.code = ['code', 'name', 'state'];
      vm.name = ['name', 'code', 'state'];
      vm.state = ['-state', '+code', '+name'];
      vm.sortReverse = false;
      vm.sortType = vm.code;
      vm.selected = -1;
      vm.getColorations = getColorations;
      vm.getColorationById = getColorationById;
      vm.colorationDetail = [];
      vm.addColoration = addColoration;
      vm.editColoration = editColoration;
      vm.saveColoration = saveColoration;
      vm.insertColoration = insertColoration;
      vm.updateColoration = updateColoration;
      vm.cancelColoration = cancelColoration;
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
              vm.getColorations();
              if (data.status === 200) {
                  vm.formatDate = data.data.value.toUpperCase();
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para consultar el listado de coloraciones de patologia existentes en el sistema */
      function getColorations() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return colorationDS.getColorations(auth.authToken).then(function(data) {
              if (data.status === 200) {
                  vm.dataColorations = data.data;
              }
              vm.loadingdata = false;
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion consultar el detalle de una coloracion por id.*/
      function getColorationById(id, index, form) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.selected = id;
          vm.colorationDetail = [];
          vm.nameRepeat = false;
          vm.codeRepeat = false;
          vm.loadingdata = true;
          form.$setUntouched();
          return colorationDS.getColorationById(auth.authToken, id).then(function(data) {
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
                  vm.oldcolorationDetail = data.data;
                  vm.colorationDetail = data.data;
                  vm.stateButton('update');
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para evaluar si una coloracion se va a actualizar o a insertar */
      function saveColoration(form) {
          form.$setUntouched();
          vm.colorationDetail.status = vm.colorationDetail.status ? 1 : 0;
          if (vm.colorationDetail.id === null) {
              vm.insertColoration();
          } else {
              vm.updateColoration();
          }
      }

      /** Funcion ejecutar el servicio que actualiza los datos de una coloracion */
      function updateColoration() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.colorationDetail.userUpdated = auth;
          return colorationDS.updateColoration(auth.authToken, vm.colorationDetail).then(function(data) {
              if (data.status === 200) {
                  vm.getColorations();
                  logger.success($filter('translate')('0042'));
                  vm.stateButton('update');
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /**Funcion ejecutar el servicio que inserta los datos de una coloracion.*/
      function insertColoration() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return colorationDS.insertColoration(auth.authToken, vm.colorationDetail).then(function(data) {
              if (data.status === 200) {
                  vm.colorationDetail = data.data;
                  vm.getColorations();
                  vm.selected = data.data.id;
                  vm.stateButton('insert');
                  logger.success($filter('translate')('0042'));
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion ejecutar el servicio que inserta los datos de una coloracion.*/
      function editColoration() {
          vm.stateButton('edit');
      }

      /**Funcion para habilitar los controles del form */
      function addColoration(form) {
          form.$setUntouched();
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.usuario = '';
          vm.selected = -1;
          vm.colorationDetail = {
              id: null,
              name: '',
              code: '',
              status: true,
              userCreated: auth
          };
          vm.stateButton('add');
      }

      /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de una coloracion.*/
      function cancelColoration(form) {
          form.$setUntouched();
          vm.nameRepeat = false;
          vm.codeRepeat = false;
          vm.code = false;
          vm.loadingdata = false;
          if (vm.colorationDetail.id === null || vm.colorationDetail.id === undefined) {
              vm.colorationDetail = [];
          } else {
              vm.getColorationById(vm.colorationDetail.id, vm.selected, form);
          }
          vm.stateButton('init');
      }

      /** funcion para confirmar el cambio del estado que se realice sobre una coloracion.*/
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
              vm.pathreport = '/report/configuration/pathology/coloration/coloration.mrt';
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
              vm.isDisabledEdit = vm.colorationDetail.id === null || vm.colorationDetail.id === undefined ? true : false;
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
                  document.getElementById('codeColoration').focus()
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
                  document.getElementById('codeColoration').focus()
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
