(function() {
  'use strict';

  angular
      .module('app.processingtime')
      .controller('processingtimeController', processingtimeController);

  processingtimeController.$inject = ['processingtimeDS', 'configurationDS', 'localStorageService', 'logger',
      '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function processingtimeController(processingtimeDS, configurationDS, localStorageService,
      logger, $filter, $state, moment, $rootScope, LZString, $translate) {

      var vm = this;
      $rootScope.menu = true;
      vm.init = init;
      vm.title = 'ProcessingTime';
      vm.time = ['time', 'state'];
      vm.state = ['-state', '+time'];
      vm.sortReverse = false;
      vm.sortType = vm.time;
      vm.selected = -1;
      vm.getProcessingTime = getProcessingTime;
      vm.getProcessingTimeById = getProcessingTimeById;
      vm.processingTimeDetail = [];
      vm.addProcessingTime = addProcessingTime;
      vm.editProcessingTime = editProcessingTime;
      vm.saveProcessingTime = saveProcessingTime;
      vm.insertProcessingTime = insertProcessingTime;
      vm.updateProcessingTime = updateProcessingTime;
      vm.cancelProcessingTime = cancelProcessingTime;
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
      vm.timeRepeat = false;
      vm.getConfigurationFormatDate = getConfigurationFormatDate;
      vm.windowOpenReport = windowOpenReport;
      vm.loadingdata = true;
      vm.hstep = 1;
      vm.mstep = 15;
      vm.timeformat = timeformat;
      vm.parseDaytime = parseDaytime;

      //** Metodo configuración formato**/
      function getConfigurationFormatDate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function(data) {
              vm.getProcessingTime();
              if (data.status === 200) {
                  vm.formatDate = data.data.value.toUpperCase();
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para consultar el listado de horarios de programacion de muestras de patologia existentes en el sistema */
      function getProcessingTime() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return processingtimeDS.getProcessingTime(auth.authToken).then(function(data) {
              if (data.status === 200) {
                  vm.dataProcessingTime = data.data;
              }
              vm.loadingdata = false;
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion consultar el detalle de una horario de programacion por id.*/
      function getProcessingTimeById(id, index, form) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.selected = id;
          vm.processingTimeDetail = [];
          vm.timeRepeat = false;
          vm.loadingdata = true;
          form.$setUntouched();
          return processingtimeDS.getProcessingTimeById(auth.authToken, id).then(function(data) {
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
                  vm.oldprocessingTimeDetail = data.data;
                  vm.processingTimeDetail = data.data;
                  var now = new Date();
                  now.setHours(0,0,0,0);
                  vm.processingTimeDetail.date = new Date(+now + vm.parseDaytime(vm.processingTimeDetail.time));
                  vm.stateButton('update');
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion para evaluar si una hora de procesamiento se va a actualizar o a insertar */
      function saveProcessingTime(form) {
          form.$setUntouched();
          vm.processingTimeDetail.status = vm.processingTimeDetail.status ? 1 : 0;
          vm.processingTimeDetail.time = vm.timeformat(vm.processingTimeDetail.date)
          if (vm.processingTimeDetail.id === null) {
              vm.insertProcessingTime();
          } else {
              vm.updateProcessingTime();
          }
      }

      function parseDaytime(time) {
        var hour = time.substr(0, time.length  -2).split(":").map(Number);
        if (time.includes("pm") && hour[0] !== 12) hour[0] += 12;
        return 1000*60*(hour[0] * 60 + hour[1]);
      }

      function timeformat(date) {
        var h = date.getHours();
        var m = date.getMinutes();
        var x = h >= 12 ? 'pm' : 'am';
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? '0'+m: m;
        h = h < 10 ? '0'+h : h;
        var mytime= h + ':' + m + ' ' + x;
        return mytime;
      }

      /** Funcion ejecutar el servicio que actualiza los datos de una hora de procesamiento */
      function updateProcessingTime() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.processingTimeDetail.userUpdated = auth;
          return processingtimeDS.updateProcessingTime(auth.authToken, vm.processingTimeDetail).then(function(data) {
              if (data.status === 200) {
                  vm.getProcessingTime();
                  logger.success($filter('translate')('0042'));
                  vm.stateButton('update');
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /**Funcion ejecutar el servicio que inserta los datos de una hora de procesamiento*/
      function insertProcessingTime() {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return processingtimeDS.insertProcessingTime(auth.authToken, vm.processingTimeDetail).then(function(data) {
              if (data.status === 200) {
                  vm.processingTimeDetail = data.data;
                  vm.getProcessingTime();
                  vm.selected = data.data.id;
                  vm.stateButton('insert');
                  logger.success($filter('translate')('0042'));
                  return data;
              }
          }, function(error) {
              vm.modalError(error);
          });
      }

      /** Funcion ejecutar el servicio que inserta los datos de un horario de procesamiento*/
      function editProcessingTime() {
          vm.stateButton('edit');
      }

      /**Funcion para habilitar los controles del form */
      function addProcessingTime(form) {
          form.$setUntouched();
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.usuario = '';
          vm.selected = -1;
          vm.processingTimeDetail = {
            id: null,
            time: '',
            date: new Date(),
            status: true,
            userCreated: auth
          };
          vm.stateButton('add');
      }

      /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de una hora de procesamiento.*/
      function cancelProcessingTime(form) {
          form.$setUntouched();
          vm.timeRepeat = false;
          vm.code = false;
          vm.loadingdata = false;
          if (vm.processingTimeDetail.id === null || vm.processingTimeDetail.id === undefined) {
              vm.processingTimeDetail = [];
          } else {
              vm.getProcessingTimeById(vm.processingTimeDetail.id, vm.selected, form);
          }
          vm.stateButton('init');
      }

      /** funcion para confirmar el cambio del estado que se realice sobre una hora de procesamiento.*/
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
              vm.pathreport = '/report/configuration/pathology/processingtime/processingtime.mrt';
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
              vm.isDisabledEdit = vm.processingTimeDetail.id === null || vm.processingTimeDetail.id === undefined ? true : false;
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
          }
          if (state === 'edit') {
              vm.isDisabledState = false;
              vm.isDisabledAdd = true;
              vm.isDisabledEdit = true;
              vm.isDisabledSave = false;
              vm.isDisabledCancel = false;
              vm.isDisabledPrint = true;
              vm.isDisabled = false;
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
                      if (item[0] === '1' && item[1] === 'time') {
                          vm.timeRepeat = true;
                      }
                  });
                  vm.loadingdata = false;
              }
          }
          if (vm.timeRepeat === false) {
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
