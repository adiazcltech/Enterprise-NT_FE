/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                listener  @descripción
                order     @descripción
                date      @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('orderinconsistencysearch', orderinconsistencysearch);
  orderinconsistencysearch.$inject = ['orderDS', 'localStorageService', '$filter'];
  /* @ngInject */
  function orderinconsistencysearch(orderDS, localStorageService, $filter) {
    var directive = {
      templateUrl: 'app/widgets/userControl/orderinconsistencysearch.directive.html',
      restrict: 'EA',
      scope: {
        openmodal: '=?openmodal',
        listener: '=?listener',
        order: '=?order',
        date: '=?date'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.init = init;
        $scope.date = moment().toDate();
        vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
        vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
        vm.dateFormatToSearch = '{format:"' + vm.dateFormat + '"}';
        vm.dateToSearch = moment().format(vm.dateFormat);
        vm.orders = [];
        vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True' ? true : false;
        vm.selectOrder = selectOrder;
        vm.dateToSearch = new Date();

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.sortType = 'order';
            vm.sortReverse = false;
            vm.loading = true;
            searchByDate(function () {
              UIkit.modal('#orderinconsistencysearch').show();
              vm.loading = false;
            });
          }
          $scope.openmodal = false;
        });



        /**
         * Evento cuando se busca ordenes por fecha
         */
        function searchByDate(callback) {
          if (vm.dateToSearch !== undefined && vm.dateToSearch !== '') {
            var date = moment(vm.dateToSearch).format('YYYYMMDD');
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            orderDS.getInconsistency(auth.authToken, auth.branch)
              .then(
                function (data) {
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.forEach(function (element, index) {
                      element.sex = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                      element.patient.birthday = moment(element.birthday).format('DD/MM/YYYY');
                      dataOrders.push(element);
                    });
                    vm.orders = _.orderBy(dataOrders, 'order', 'desc');
                  } else {
                    vm.orders = [];
                  }
                  if (callback !== undefined) {
                    callback();
                  }
                },
                function (error) {
                  if (error.data === null) {
                    vm.errorservice = vm.errorservice + 1;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  }
                  if (callback !== undefined) {
                    callback();
                  }
                });
          } else {
            vm.orders = [];
            if (callback !== undefined) {
              callback();
            }
          }
        }

        /**
         * Evento cuando se selecciona una orden
         * @param {*} orderS
         */
        function selectOrder(orderS) {
          $scope.order = orderS;
          setTimeout(function () {
            $scope.listener(orderS);
            UIkit.modal('#orderinconsistencysearch').hide();
          }, 100);
        }

        /**
         * Funcion inicial de la directiva
         */
        function init() {

        }
        vm.init();
      }],
      controllerAs: 'orderinconsistencysearch'
    };
    return directive;
  }
})();
