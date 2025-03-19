
(function () {
  'use strict';

  angular
      .module('app.shiftsbybranch')
      .controller('dshiftsbybranchController', dshiftsbybranchController)
      .controller('shiftsbybranchController', shiftsbybranchController);


  shiftsbybranchController.$inject = ['localStorageService', 'logger', '$filter', '$state', '$rootScope', 'shiftsDS', 'LZString', '$translate', 'branchDS', 'ModalService'];

  function shiftsbybranchController(localStorageService, logger, $filter, $state, $rootScope, shiftsDS, LZString, $translate, branchDS, ModalService) {

      var vm = this;
      vm.init = init;
      vm.title = 'shiftsbybranch';
      $rootScope.menu = true;
      $rootScope.NamePage = $filter('translate')('1384');
      $rootScope.helpReference = 'configurate/shiftsbybranch/shiftsbybranch.htm';
      vm.getBranch = getBranch;
      vm.modalrequired = modalrequired;
      vm.removeData = removeData;
      vm.code = ['code', 'name'];
      vm.name = ['name', 'code'];
      vm.sortReverse = false;
      vm.sortType = vm.code;
      vm.selected = -1;
      vm.getId = getId;
      vm.getShifts = getShifts;
      vm.shiftname = ['name', 'init', 'end', 'quantity', 'select'];
      vm.shiftinit = ['init', 'name', 'end', 'quantity', 'select'];
      vm.shiftend = ['end', 'name', 'init', 'quantity', 'select'];
      vm.selectname = ['-select', '+name', '+init', '+end', '+quantity'];
      vm.sortReverse1 = false;
      vm.sortType1 = vm.shiftname;
      vm.selectShift = selectShift;
      vm.update = update;
      vm.Detail = [];
      vm.modalError = modalError;
      vm.loadingdata = true;
      vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.changeState = changeState;
      vm.generateFile = generateFile;
      vm.cancel = cancel;
      vm.windowOpenReport = windowOpenReport;
      vm.validate = validate;

      //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
      function cancel() {
        vm.loadingdata = true;
        vm.getId(vm.selected)
      }

      //** Método para validar si las horas estan solapadas**//
      function validate(init, end, comparateinit, comparateend) {
        if (init === comparateinit && end === comparateend) {
            return true;
        }
        else if (end === comparateend) {
            return true;
        }
        else if (init >= comparateend && end > comparateinit) {
            return false;
        }
        else if (init < comparateinit && end <= comparateinit) {
            return false;
        }
        else if ((init < comparateinit && end > comparateend) || comparateinit === end) {
            return true;
        }
        else if (init > comparateinit && end < comparateend) {
            return true;
        }
        else if (init < comparateinit && end < comparateend && end > comparateinit) {
            return true;
        }
        else if (init > comparateinit && end > comparateend && init < comparateend) {
            return true;
        } else {
            return false;
        }
      }

      function selectShift(shift) {
        shift.quantity = 0;
        vm.comparate = $filter('filter')(vm.filtered1, {
          selected: true
        });
        var show = false;
        for (var i = 0; i < vm.comparate.length; i++) {
          if (vm.comparate[i].id !== shift.id) {
            vm.comparate[i].init = parseInt(vm.comparate[i].init);
            vm.comparate[i].end = parseInt(vm.comparate[i].end);
            shift.end = parseInt(shift.end);
            shift.init = parseInt(shift.init);
            if (vm.comparate[i].Monday === true && shift.Monday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].Tuesday === true && shift.Tuesday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].Wednesday === true && shift.Wednesday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].Thursday === true && shift.Thursday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].Friday === true && shift.Friday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].saturday === true && shift.saturday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
            if (vm.comparate[i].Sunday === true && shift.Sunday === true) {
              vm.validateiftrue = vm.validate(shift.init, shift.end, vm.comparate[i].init, vm.comparate[i].end);
              if (vm.validateiftrue === true) {
                vm.nameshift = vm.comparate[i].name;
                shift.quantity = 0;
                shift.selected = false;
                show = true;
                break;
              }
            }
          }
          shift.quantity = 1;
        }

        if(show) {
          logger.error($filter('translate')('1387') + vm.comparate[i].name);
        }
      }

      //** Método se comunica con el dataservice y actualiza**//
      function update() {
        vm.loadingdata = true;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var json = {
          "id": vm.idTest,
          "shifts": _.map(vm.Detail, function(obj) { return { id: obj.id, quantity: obj.quantity, selected: obj.selected } })
        }
        return shiftsDS.updatebranch(auth.authToken, json).then(function (data) {
          if (data.status === 200) {
            vm.getId(vm.selected)
            logger.success($filter('translate')('0042'));
          }
        }, function (error) {
          vm.modalError(error);
        });
      }

      //** Método se comunica con el dataservice y trae los datos por el id de la sede**//
      function getId(branch) {
        vm.search2 = '';
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.selected = branch;
        vm.Detail = [];
        vm.idTest = branch.id;
        vm.nameTest = branch.name;
        vm.sortReverse1 = true;
        vm.sortType1 = '';
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = false;
        vm.username = branch.username;
        vm.loadingdata = true;
        return shiftsDS.bybranch(auth.authToken, branch.id).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.usuario = $filter('translate')('0017') + ' ';
            vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
            vm.usuario = vm.usuario + vm.username;
            data.data.forEach(function (value) {

              value.Monday = value.days.indexOf(1) >= 0 ? true : false;
              value.Tuesday = value.days.indexOf(2) >= 0 ? true : false;
              value.Wednesday = value.days.indexOf(3) >= 0 ? true : false;
              value.Thursday = value.days.indexOf(4) >= 0 ? true : false;
              value.Friday = value.days.indexOf(5) >= 0 ? true : false;
              value.saturday = value.days.indexOf(6) >= 0 ? true : false;
              value.Sunday = value.days.indexOf(7) >= 0 ? true : false;

              var cero = '0';
              var timeInit = cero.repeat(4 - value.init.toString().length) + value.init.toString();
              var timeEnd = cero.repeat(4 - value.end.toString().length) + value.end.toString();
              value.initT = timeInit.substr(0, 2) + ':' + timeInit.substr(2, 2);
              value.endT = timeEnd.substr(0, 2) + ':' + timeEnd.substr(2, 2);
              delete value.days;
              value.nameinitend = value.name + value.init + value.end;
            });
            vm.Detail = data.data;
            vm.sortReverse1 = false;
          }
        }, function (error) {
          vm.modalError(error);
        });
      }

      function getShifts() {
        vm.listShifts = [];
        return shiftsDS.getshift(vm.auth.authToken).then(function (data) {
          if (data.status === 200) {
            vm.listShifts = data.data;
            vm.listShifts.forEach(function (value) {
              var cero = '0';
              var timeInit = cero.repeat(4 - value.init.toString().length) + value.init.toString();
              var timeEnd = cero.repeat(4 - value.end.toString().length) + value.end.toString();
              value.init = timeInit.substr(0, 2) + ':' + timeInit.substr(2, 2);
              value.end = timeEnd.substr(0, 2) + ':' + timeEnd.substr(2, 2);
              delete value.days;
              value.nameinitend = value.name + value.init + value.end;
            });
            vm.modalrequired();
          }
        }, function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        });
      }

      //** Método que obtiene la lista para llenar las sedes**//
      function getBranch() {
        return branchDS.getBranchActive(vm.auth.authToken).then(function (data) {
          vm.listBranch = data.data.length === 0 ? data.data : removeData(data);
          vm.loadingdata = false;
          vm.getShifts();
          return vm.data;
        }, function (error) {
          vm.modalError(error);
        });
      }

      //** Metodo que elimina los elementos sobrantes en la lista**//
      function removeData(data) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        data.data.forEach(function (value, key) {
          delete value.user;
          delete value.lastTransaction;
          data.data[key].search = data.data[key].code + data.data[key].name;
          data.data[key].username = auth.userName;
        });
        return data.data;
      }

      //** Método que evalua los requeridos**//
      function modalrequired() {
        if (vm.listShifts.length === 0 || vm.listBranch.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'dshiftsbybranchController',
            inputs: {
              hideshifts: vm.listShifts.length,
              hidebranch: vm.listBranch.length
            }
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              $state.go(result.page);
            });
          });
        }
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
        var datareport = [];
        var datareport = $filter('filter')(vm.filtered1, {
          selected: true
        });
        if (datareport.length === 0) {
          vm.open = true;
        } else {
          vm.variables = {
            'name': vm.nameTest
          };
          vm.datareport = datareport;
          vm.pathreport = '/report/configuration/appointment/shiftsbybranch/shiftsbybranch.mrt';
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
          vm.getBranch();
      }
  }

  function dshiftsbybranchController($scope, hideshifts, hidebranch, close) {
    $scope.hideshifts = hideshifts;
    $scope.hidebranch = hidebranch;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }

})();

