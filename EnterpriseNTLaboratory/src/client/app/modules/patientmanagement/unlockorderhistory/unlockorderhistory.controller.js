
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.unlockorderhistory')
    .controller('UnlockOrderHistoryController', UnlockOrderHistoryController);


  UnlockOrderHistoryController.$inject = ['unlockorderhistoryDS', 'documenttypesDS', 'orderDS', 'patientDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope','common'];

  function UnlockOrderHistoryController(unlockorderhistoryDS, documenttypesDS, orderDS, patientDS,
    localStorageService, logger, $filter, $state, moment, $rootScope,common) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.loadingdata = false;
    vm.title = 'UnlockOrderHistory';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0055');
    $rootScope.helpReference = '01. LaboratoryOrders/unlockorderhistory.htm';
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.listYear = [];
    vm.getListYear = getListYear;
    vm.digitsorder = localStorageService.get('DigitosOrden');
    vm.digitsyear = 4;
    vm.byOrder = '1';
    vm.orderNotFound = false;
    vm.historyNotFound = false;
    vm.orderTotal = 0;
    vm.getDocumentType = getDocumentType;
    vm.accept = accept;
    vm.keySelectOrder = keySelectOrder;
    vm.keySelectHistory = keySelectHistory;
    vm.orderNumber = '';
    vm.historyNumber = '';
    vm.maxLenght = parseInt(vm.digitsorder) + 4;
    vm.changeYear = changeYear;
    vm.changeDocument = changeDocument;
    vm.documentType = localStorageService.get('ManejoTipoDocumento');
    vm.documentType = vm.documentType === 'True' || vm.documentType === true ? true : false;
    vm.modelDocumentType = { id: 1 };
    $rootScope.pageview = 3;
    
    function getListYear() {
      vm.listYear = common.getListYear(vm.yearquery);
      vm.listYear.id = moment().year();
    }



    function changeYear() {
      vm.historyNumber = '';
      vm.orderNumber = '';
      vm.orderNotFound = false;
      vm.historyNotFound = false;
    }

    function getDocumentType() {
      vm.listDocumentType = []; vm.modelDocumentType = {};


      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return documenttypesDS.getDocumentType(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listDocumentType.push({ 'id': value.id, 'name': value.name, 'abbr': value.abbr });
          });
          vm.modelDocumentType = vm.listDocumentType[0];

        }

      });
    }

    function changeDocument() {
      vm.historyNumber = '';
      vm.orderNumber = '';
      vm.orderNotFound = false;
      vm.historyNotFound = false;
    }

    function keySelectOrder($event) {
      var mmddNow = moment().format('MMDD');
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        try {
          vm.ValorOrden = vm.orderNumber.replace(vm.listYear.id.toString(), '');
        } catch (e) {
          return true;
        }

        if (vm.ValorOrden.length === vm.maxLenght) {
          vm.orderNumber = vm.ValorOrden;
        } else {
          if (vm.ValorOrden.length <= parseInt(vm.digitsorder)) {
            vm.ConsecutiveOrder = vm.ValorOrden;
            var repeticiones = vm.maxLenght - (4 + vm.ConsecutiveOrder.length);
            var ceros = '';
            for (var i = 0; i < repeticiones; i++) {
              ceros = ceros + '0';
            }
            vm.ConsecutiveOrder = mmddNow + ceros + vm.ConsecutiveOrder.toString();

            if (repeticiones >= 0) {
              vm.orderNumber = vm.ConsecutiveOrder;
            }
          } else {
            vm.ConsecutiveOrder = vm.ValorOrden;
            var dif = vm.maxLenght - vm.ConsecutiveOrder.length;
            vm.ConsecutiveOrder = mmddNow.substring(0, dif) + vm.ConsecutiveOrder.toString();

            if (dif >= 0) {
              vm.orderNumber = vm.ConsecutiveOrder;
            }
          }
        }
        vm.orderTotal = vm.listYear.id.toString() + vm.orderNumber;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return orderDS.getOrderbyOrder(auth.authToken, vm.orderTotal).then(function (data) {
          vm.orderNotFound = data.statusText !== 'OK' && vm.byOrder === '1';
        });


      } else {
        var expreg = new RegExp(/^[0-9]+$/);
        if (!expreg.test(String.fromCharCode(keyCode))) {
          //detener toda accion en la caja de texto   
          $event.preventDefault();
        }
      }

    }

    function keySelectHistory($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var historyNum = vm.historyNumber === '' ? null : vm.historyNumber;
        return patientDS.getPatientIdDocumentType(auth.authToken, historyNum, vm.modelDocumentType.id).then(function (data) {
          vm.historyNotFound = data.statusText !== 'OK' && vm.byOrder === '2';
        });
      } else {
        var expreg = new RegExp(/^[0-9]+$/);
        if (!expreg.test(String.fromCharCode(keyCode))) {
          //detener toda accion en la caja de texto 
          $event.preventDefault();
        }
      }
    }


    function accept() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.byOrder === '1') {
        return unlockorderhistoryDS.getUnlockOrder(auth.authToken, vm.orderTotal).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            var message = $filter('translate')('0248').replace('@@@@', vm.orderTotal);
            logger.success(message);
            vm.orderNumber = '';
            vm.orderTotal = '';
            vm.orderNotFound = false;
          } else {
            var message = $filter('translate')('0250').replace('@@@@', vm.orderTotal);
            logger.warning(message);
          }

        }, function (error) {
          if (error.data === null) {
            vm.errorservice = vm.errorservice + 1;
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        });
      } else if (vm.byOrder === '2') {
        return unlockorderhistoryDS.getUnlockHistory(auth.authToken, vm.modelDocumentType.id, vm.historyNumber).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            if (vm.documentType) {
              var message = $filter('translate')('0249').replace('@@@@', vm.modelDocumentType.abbr + '. ' + vm.historyNumber);
              logger.success(message);
            }
            else {
              var message = $filter('translate')('1455').replace('@@@@', vm.historyNumber);
              logger.success(message);
            }

            vm.historyNumber = '';
            vm.historyNotFound = false;
          } else {
            var message = $filter('translate')('0251').replace('@@@@', vm.modelDocumentType.abbr + '. ' + vm.historyNumber);
            logger.warning(message);
          }

        }, function (error) {
          if (error.data === null) {
            vm.errorservice = vm.errorservice + 1;
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        });
      } else {
        return unlockorderhistoryDS.getUnlockAll(auth.authToken).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            var message = $filter('translate')('0744')
            logger.success(message);
            vm.historyNumber = '';
            vm.historyNotFound = false;
          } else {
            var message = $filter('translate')('0745')
            logger.warning(message);
          }

        }, function (error) {
          if (error.data === null) {
            vm.errorservice = vm.errorservice + 1;
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        });
      }

    }

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      }
      else {
        vm.init();
      }
    }

    function init() {
      vm.getListYear();
      if (vm.documentType) {
        vm.getDocumentType();
      }
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */