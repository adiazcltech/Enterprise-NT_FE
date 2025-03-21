(function() {
  'use strict';

  angular
      .module('app.event')
      .controller('eventController', eventController);

  eventController.$inject = ['eventPathologyDS', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'];

  function eventController(eventPathologyDS, configurationDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {

      var vm = this;
      $rootScope.menu = true;
      vm.init = init;
      vm.title = 'Event';
      vm.code = ['code', 'name', 'state'];
      vm.name = ['name', 'code', 'state'];
      vm.state = ['-state', '+code', '+name'];
      vm.sortReverse = false;
      vm.sortType = vm.code;
      vm.selected = -1;
      vm.getEvents = getEvents;
      vm.getEventById = getEventById;
      vm.eventDetail = [];
      vm.addEvent = addEvent;
      vm.editEvent = editEvent;
      vm.saveEvent = saveEvent;
      vm.insertEvent = insertEvent;
      vm.updateEvent = updateEvent;
      vm.cancelEvent = cancelEvent;
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
      vm.getConfigurationFormatDate = getConfigurationFormatDate;
      vm.windowOpenReport = windowOpenReport;
      vm.loadingdata = true;

      //** Metodo configuración formato**/
      function getConfigurationFormatDate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function(data) {
              vm.getEvents();
              if (data.status === 200) {
                  vm.formatDate = data.data.value.toUpperCase();
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para consultar el listado de eventos de patologia existentes en el sistema */
      function getEvents() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return eventPathologyDS.getEvents(auth.authToken).then(function(data) {
              if (data.status === 200) {
                  vm.dataEvents = data.data;
              }
              vm.loadingdata = false;
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion consultar el detalle de un evento por id.*/
      function getEventById(id, index, form) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.selected = id;
          vm.eventDetail = [];
          vm.codeRepeat = false;
          vm.loadingdata = true;
          form.$setUntouched();
          return eventPathologyDS.getEventById(auth.authToken, id).then(function(data) {
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
                  vm.oldeventDetail = data.data;
                  vm.eventDetail = data.data;
                  vm.stateButton('update');
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para evaluar si un evento se va a actualizar o a insertar */
      function saveEvent(form) {
          form.$setUntouched();
          vm.eventDetail.status = vm.eventDetail.status ? 1 : 0;
          if (vm.eventDetail.id === null) {
              vm.insertEvent();
          } else {
              vm.updateEvent();
          }
      }

      /** Funcion ejecutar el servicio que actualiza los datos de un evento */
      function updateEvent() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.eventDetail.userUpdated = auth;
          return eventPathologyDS.updateEvent(auth.authToken, vm.eventDetail).then(function(data) {
              if (data.status === 200) {
                  vm.getEvents();
                  logger.success($filter('translate')('0042'));
                  vm.stateButton('update');
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /**Funcion ejecutar el servicio que inserta los datos de un evento.*/
      function insertEvent() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return eventPathologyDS.insertEvent(auth.authToken, vm.eventDetail).then(function(data) {
              if (data.status === 200) {
                  vm.eventDetail = data.data;
                  vm.getEvents();
                  vm.selected = data.data.id;
                  vm.stateButton('insert');
                  logger.success($filter('translate')('0042'));
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion ejecutar el servicio que inserta los datos de un evento.*/
      function editEvent() {
          vm.stateButton('edit');
      }

      /**Funcion para habilitar los controles del form */
      function addEvent(form) {
          form.$setUntouched();
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.usuario = '';
          vm.selected = -1;
          vm.eventDetail = {
              id: null,
              name: '',
              code: '',
              status: true,
              colour: '#FFFFFF',
              userCreated: auth
          };
          vm.stateButton('add');
      }

      /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un evento.*/
      function cancelEvent(form) {
          form.$setUntouched();
          vm.codeRepeat = false;
          vm.code = false;
          vm.loadingdata = false;
          if (vm.eventDetail.id === null || vm.eventDetail.id === undefined) {
              vm.eventDetail = [];
          } else {
              vm.getEventById(vm.eventDetail.id, vm.selected, form);
          }
          vm.stateButton('init');
      }

      /** funcion para confirmar el cambio del estado que se realice sobre un evento.*/
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
              vm.pathreport = '/report/configuration/pathology/event/event.mrt';
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
              vm.isDisabledEdit = vm.eventDetail.id === null || vm.eventDetail.id === undefined ? true : false;
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
                  document.getElementById('codeEvent').focus()
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
                  document.getElementById('codeEvent').focus()
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
                  });
                  vm.loadingdata = false;
              }
          }
          if (vm.codeRepeat === false) {
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
