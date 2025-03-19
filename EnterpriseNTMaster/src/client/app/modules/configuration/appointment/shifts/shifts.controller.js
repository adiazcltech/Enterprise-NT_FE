
(function () {
  'use strict';

  angular
      .module('app.shifts')
      .controller('shiftsController', shiftsController);


  shiftsController.$inject = ['localStorageService', 'logger', '$filter', '$state', '$rootScope', 'shiftsDS', 'LZString', '$translate'];

  function shiftsController(localStorageService, logger, $filter, $state, $rootScope, shiftsDS, LZString, $translate) {

      var vm = this;
      vm.init = init;
      vm.title = 'shifts';
      $rootScope.menu = true;
      $rootScope.NamePage = $filter('translate')('0065');
      $rootScope.helpReference = 'configurate/shifts/shifts.htm';
      $rootScope.appointmentreservation = null;
      vm.get = get;
      vm.save = save;
      vm.Detail = [];
      vm.modalError = modalError;
      vm.loadingdata = true;
      vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.getId = getId;
      vm.cancel = cancel;
      vm.Edit = Edit;
      vm.insert = insert;
      vm.update = update;
      vm.New = New;
      vm.stateButton = stateButton;
      vm.Repeat = false;
      vm.RepeatInit = false;
      vm.RepeatEnd = false;
      vm.invalidTimeInit = false;
      vm.invalidTimeEnd = false;
      vm.invalidRangeInit = false;
      vm.invalidRangeEndt = false;
      vm.keyPressTime = keyPressTime;
      vm.onBlur = onBlur;
      vm.onFocus = onFocus;
      vm.value = '';
      vm.placeholder = '##:##';
      vm.requiredDays = false;
      vm.activeDays = activeDays;
      vm.daysActives = 0;
      vm.hstep = 1;
      vm.mstep = 30;
      vm.changeState = changeState;
      vm.generateFile = generateFile;
      vm.isDisabledstate = true;
      vm.requiredInit = false;
      vm.requiredEnd = false;
      vm.invalidDate = false;
      vm.windowOpenReport = windowOpenReport;

      //** Método se comunica con el dataservice y trae los datos por el id**//
      function getId(id, index, Form) {
          if (Form !== undefined) Form.$setUntouched();
          vm.loadingdata = true;
          vm.Repeat = false;
          vm.RepeatInit = false;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.selected = id;
          vm.Detail = {};
          return shiftsDS.getshiftid(auth.authToken, id).then(function (data) {
              if (data.status === 200) {
                  var cero = '0';
                  var timeInit = cero.repeat(4 - data.data.init.toString().length) + data.data.init.toString();
                  var timeEnd = cero.repeat(4 - data.data.end.toString().length) + data.data.end.toString();
                  vm.Detail = data.data;
                  var dayBool = [];
                  for (var i = 1; i <= 7; i++) {
                    dayBool.push(vm.Detail.days.indexOf(i) !== -1);
                  }
                  vm.Detail.daybool = dayBool;

                  var initDate = new Date();
                  var initH = parseInt(timeInit.substring(0, 2), 10);
                  var initM = parseInt(timeInit.substring(2), 10);
                  initDate.setHours(initH);
                  initDate.setMinutes(initM);

                  var endDate = new Date();
                  var endH = parseInt(timeEnd.substring(0, 2), 10);
                  var endM = parseInt(timeEnd.substring(2), 10);
                  endDate.setHours(endH);
                  endDate.setMinutes(endM);

                  vm.Detail.init = initDate;
                  vm.Detail.end = endDate;

                  vm.requiredDays = false;
                  vm.stateButton('update');
                  vm.loadingdata = false;
              }
          }, function (error) {
              vm.modalError(error);
          });
      }

      //** Metodo que habilita y desabilita los botones**//
      function stateButton(state) {
          if (state === 'init') {
              vm.isDisabledAdd = false;
              vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
              vm.isDisabledSave = true;
              vm.isDisabledCancel = true;
              vm.isDisabled = true;
              vm.isDisabledstate = true;
              vm.placeholder = '##:##';
          }
          if (state === 'add') {
              vm.isDisabledAdd = true;
              vm.isDisabledEdit = true;
              vm.isDisabledSave = false;
              vm.isDisabledCancel = false;
              vm.isDisabled = false;
              vm.isDisabledstate = true;
              vm.placeholder = '';
          }
          if (state === 'edit') {
              vm.isDisabledAdd = true;
              vm.isDisabledEdit = true;
              vm.isDisabledSave = false;
              vm.isDisabledCancel = false;
              vm.isDisabled = false;
              vm.isDisabledstate = false;
              vm.placeholder = '';
          }
          if (state === 'insert') {
              vm.isDisabledAdd = false;
              vm.isDisabledEdit = false;
              vm.isDisabledSave = true;
              vm.isDisabledCancel = true;
              vm.isDisabled = true;
              vm.isDisabledstate = true;
              vm.placeholder = '##:##';
          }
          if (state === 'update') {
              vm.isDisabledAdd = false;
              vm.isDisabledEdit = false;
              vm.isDisabledSave = true;
              vm.isDisabledCancel = true;
              vm.isDisabled = true;
              vm.isDisabledstate = true;
              vm.placeholder = '';
          }
      }
      //** Método que evalua si se  va crear o actualizar**//
      function save(Form) {
          Form.$setUntouched();
          vm.requiredInit = false;
          vm.requiredEnd = false;
          vm.invalidDate = false;

          if(vm.Detail.init === "") {
            vm.requiredInit = true;
            return false;
          }

          if(vm.Detail.end === "") {
            vm.requiredEnd = true;
            return false;
          }

          if(vm.Detail.init != '' && vm.Detail.end != '') {
            var compareEnd = new Date(
              vm.Detail.init.getFullYear(),
              vm.Detail.init.getMonth(),
              vm.Detail.init.getDate(),
              vm.Detail.end.getHours(),
              vm.Detail.end.getMinutes(),
              vm.Detail.end.getSeconds()
            );
            if(compareEnd <= vm.Detail.init) {
              vm.invalidDate = true;
              return false;
            }
          }
          if (vm.Detail.id === 0) {
              vm.insert();
          }
          else {
              vm.update();
          }
      }


      function keyPressTime($event, idControl) {
          var expreg = new RegExp(/^[0-9]+$/);
          var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
          //document.getElementById(idControl).focus();
          var selectionStart = document.getElementById(idControl).selectionStart;
          var selectionEnd = document.getElementById(idControl).selectionEnd;
          var len = (selectionStart === 0 && selectionEnd === 4) ? 5 : 4;
          if (!expreg.test(String.fromCharCode(keyCode)) || document.getElementById(idControl).value.length === len) {
              //detener toda accion en la caja de texto   $event === undefined &&
              event.preventDefault();
          } else {
              if (idControl === 'init') vm.invalidTimeInit = false;
              if (idControl === 'end') vm.invalidTimeEnd = false;
              vm.invalidRangeInit = false;
              vm.invalidRangeEnd = false;
          }
      }


      function onBlur(number, idControl) {
          if (number === undefined || number === '') { return; }
          var cero = '0';
          if (number.toString().length < 5) {
              number = cero.repeat(4 - number.toString().length) + number.toString().replace(':', '');
          } else {
              number = number.toString().replace(':', '');
          }
          if (number.toString().substr(0, 2) > '23' || number.toString().substr(2, 2) > '59' || number.toString().length < 4) {
              document.getElementById(idControl).focus();
              if (idControl === 'init' && number.toString().length > 0) vm.invalidTimeInit = true;
              if (idControl === 'end' && number.toString().length > 0) vm.invalidTimeEnd = true;
          } else {
              if (idControl === 'init') vm.invalidTimeInit = false;
              if (idControl === 'end') vm.invalidTimeEnd = false;
              if (number !== '' && parseInt(document.getElementById('init').value.replace(':', '')) >= parseInt(document.getElementById('end').value.replace(':', ''))) {
                  document.getElementById(idControl).focus();
                  if (idControl === 'init') vm.invalidTimeInit = false;
                  if (idControl === 'end') vm.invalidTimeEnd = false;
                  if (idControl === 'init') vm.invalidRangeInit = true;
                  if (idControl === 'end') vm.invalidRangeEnd = true;

              } else {
                  var time = number.toString().substr(0, 2) + ':' + number.toString().substr(2, 2);
                  document.getElementById(idControl).value = time;
                  vm.invalidRangeInit = false;
                  vm.invalidRangeEnd = false;
              }
          }
      }

      function onFocus(number, idControl) {
          if (number === undefined) return;
          var time = number.toString().length === 3 ? '0' + number.toString() : number.toString();
          document.getElementById(idControl).value = time.replace(':', '');
      }


      function modalError(error) {
          if (error.data === undefined) {
              vm.Error = error;
              vm.ShowPopupError = true;
          }
          else if (error.data !== null) {
              if (error.data.code === 2) {
                  error.data.errorFields.forEach(function (value) {
                      var item = value.split('|');
                      if (item[0] === '1' && item[1] === 'name') {
                          vm.Repeat = true;
                      }
                      if (item[0] === '1' && item[1] === 'code') {
                          vm.RepeatInit = true;
                      }
                  });
              }
          }
          if (vm.Repeat === false && vm.RepeatInit === false) {
              vm.Error = error;
              vm.ShowPopupError = true;
          }
      }
      function Edit() {
          vm.stateButton('edit');
      }

      //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
      function New(form) {
          form.$setUntouched();
          vm.requiredDays = false;
          vm.selected = -1;
          vm.Detail = {
              'user': {
                  'id': vm.auth.id
              },
              'id': 0,
              'name': '',
              'init': '',
              'end': '',
              'daybool': [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
              'days': [],
              'state': true
          };
          vm.daysActives = 0;
          vm.stateButton('add');
      }

      function cancel(Form) {
          vm.Repeat = false;
          vm.RepeatInit = false;
          vm.requiredDays = false;
          vm.requiredInit = false;
          vm.requiredEnd = false;
          vm.invalidDate = false;
          Form.$setUntouched();
          if (vm.Detail.id === null || vm.Detail.id === undefined || vm.Detail.id === 0) {
              vm.Detail = [];
          } else {
              vm.getId(vm.Detail.id, vm.selected, Form);
          }
          vm.stateButton('init');
      }

      function get() {
          vm.loadingdata = true;
          vm.List = [];
          return shiftsDS.getshift(vm.auth.authToken).then(function (data) {
              vm.loadingdata = false;
              vm.stateButton('init');
              if (data.status === 200) {
                  vm.List = data.data;
                  vm.List.forEach(function (value) {
                      var cero = '0';
                      var timeInit = cero.repeat(4 - value.init.toString().length) + value.init.toString();
                      var timeEnd = cero.repeat(4 - value.end.toString().length) + value.end.toString();
                      value.init = timeInit.substr(0, 2) + ':' + timeInit.substr(2, 2);
                      value.end = timeEnd.substr(0, 2) + ':' + timeEnd.substr(2, 2);
                      delete value.days;
                      value.nameinitend = value.name + value.init + value.end;
                  })
              }
          }, function (error) {
              vm.loadingdata = false;
              vm.modalError(error);
          });
      }

      //** Método se comunica con el dataservice e inserta**//
      function insert() {
          vm.loadingdata = true;
          var days = [];
          vm.Detail.daybool.forEach(function (value, key) {
              if (value) {
                  days.push(key + 1);
              }
          });
          vm.Detail.days = days;
          vm.requiredDays = vm.Detail.days.length === 0;
          if (vm.requiredDays) {
            vm.loadingdata = false;
            return;
          }

          vm.Detail.init = (vm.Detail.init.getHours() < 10 ? '0' + vm.Detail.init.getHours() : vm.Detail.init.getHours() ) + "" + (vm.Detail.init.getMinutes() < 10 ? '0' + vm.Detail.init.getMinutes() : vm.Detail.init.getMinutes());
          vm.Detail.end = (vm.Detail.end.getHours() < 10 ? '0' + vm.Detail.end.getHours() : vm.Detail.end.getHours() ) + "" + (vm.Detail.end.getMinutes() < 10 ? '0' + vm.Detail.end.getMinutes() : vm.Detail.end.getMinutes());

          vm.Detail.init = parseInt(vm.Detail.init);
          vm.Detail.end = parseInt(vm.Detail.end);

          return shiftsDS.newshift(vm.auth.authToken, vm.Detail).then(function (data) {
              if (data.status === 200) {
                  vm.Repeat = false;
                  vm.RepeatInit = false;
                  vm.get();
                  vm.getId(data.data.id, -1);
                  vm.stateButton('insert');
                  logger.success($filter('translate')('0056'));
                  vm.loadingdata = false;

              }
          }, function (error) {
              vm.modalError(error);
              vm.loadingdata = false;
          });
      }

      //** Método se comunica con el dataservice y actualiza**//
      function update() {
          vm.loadingdata = true;
          var days = [];
          vm.Detail.daybool.forEach(function (value, key) {
              if (value) {
                  days.push(key + 1);
              }
          });
          vm.Detail.days = days;
          vm.requiredDays = vm.Detail.days.length === 0;
          if (vm.requiredDays) {
            vm.loadingdata = false;
            return;
          }

          vm.Detail.init = (vm.Detail.init.getHours() < 10 ? '0' + vm.Detail.init.getHours() : vm.Detail.init.getHours() ) + "" + (vm.Detail.init.getMinutes() < 10 ? '0' + vm.Detail.init.getMinutes() : vm.Detail.init.getMinutes());
          vm.Detail.end = (vm.Detail.end.getHours() < 10 ? '0' + vm.Detail.end.getHours() : vm.Detail.end.getHours() ) + "" + (vm.Detail.end.getMinutes() < 10 ? '0' + vm.Detail.end.getMinutes() : vm.Detail.end.getMinutes());

          vm.Detail.init = parseInt(vm.Detail.init);
          vm.Detail.end = parseInt(vm.Detail.end);


          vm.Detail.user.id = vm.auth.id;
          return shiftsDS.updateshift(vm.auth.authToken, vm.Detail).then(function (data) {
              if (data.status === 200) {
                vm.Repeat = false;
                vm.RepeatInit = false;
                vm.get();
                var cero = '0';
                var timeInit = cero.repeat(4 - vm.Detail.init.toString().length) + vm.Detail.init.toString();
                var timeEnd = cero.repeat(4 - vm.Detail.end.toString().length) + vm.Detail.end.toString();

                var initDate = new Date();
                var initH = parseInt(timeInit.substring(0, 2), 10);
                var initM = parseInt(timeInit.substring(2), 10);
                initDate.setHours(initH);
                initDate.setMinutes(initM);

                var endDate = new Date();
                var endH = parseInt(timeEnd.substring(0, 2), 10);
                var endM = parseInt(timeEnd.substring(2), 10);
                endDate.setHours(endH);
                endDate.setMinutes(endM);

                vm.Detail.init = initDate;
                vm.Detail.end = endDate;

                logger.success($filter('translate')('0056'));
                vm.stateButton('update');
                vm.loadingdata = false;
              }
          }, function (error) {
              vm.modalError(error);
          });
      }

      function activeDays(active) {
          if (active === undefined) return;
          if (active) {
              vm.requiredDays = false;
              vm.daysActives = 1;
              return;
          } else {
              try {
                  vm.daysActives = 0;
                  vm.Detail.daybool.forEach(function (value) {
                      if (value) vm.daysActives++;
                  });
                  vm.requiredDays = vm.daysActives === 0;
              } catch (e) {

              }

          }
      }
      vm.isAuthenticate = isAuthenticate;
      //Método para evaluar la autenticación
      function isAuthenticate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (auth === null || auth.token) {
              $state.go('login');
          }
          else {
              vm.init();
          }
      }

      //** Método  para imprimir el reporte**//
      function generateFile() {
        if (vm.filtered.length === 0) {
          vm.open = true;
        } else {
          vm.variables = {};
          vm.datareport = vm.filtered;
          vm.pathreport = '/report/configuration/appointment/shifts/shifts.mrt';
          vm.openreport = false;
          vm.report = false;
          vm.windowOpenReport();
        }
      }

      function changeState() {
        if (!vm.isDisabledstate) {
          vm.ShowPopupState = true;
        }
      }

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

      vm.isAuthenticate();

      function init() {
          vm.stateButton('init');
          vm.get();
      }
  }

})();

