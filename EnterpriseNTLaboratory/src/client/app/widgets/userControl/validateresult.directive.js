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
    .directive('validateresult', validateresult);
  validateresult.$inject = ['resultsentryDS', 'localStorageService', '$filter', 'logger'];
  /* @ngInject */
  function validateresult(resultsentryDS, localStorageService, $filter, logger) {
    var directive = {
      templateUrl: 'app/widgets/userControl/validateresult.html',
      restrict: 'EA',
      scope: {
        openmodal: '=?openmodal',
        resulttest: '=?resulttest',
        order: '=?order'

      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.init = init;
        $scope.date = moment().toDate();
        vm.save = save;
        vm.searchByDate = searchByDate;
        vm.decimaltest = 0;
        vm.format = 'n0';
        vm.loading = true;
        vm.saveresult = saveresult;
        vm.getLiteralResult = getLiteralResult;
        vm.getLiteralData = getLiteralData;
        vm.listresult = [];
        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.literalsrequired = localStorageService.get("Literalesobligatorio") === 'True';
            vm.entryvalidation = localStorageService.get("Validacioningreso") === 'True';
            vm.order = $scope.order;
            vm.listresult = $scope.resulttest;
            vm.searchByDate();
          }
          $scope.openmodal = false;
        });

        function getLiteralResult() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return resultsentryDS.getLiterals(auth.authToken).then(function (data) {
            if (data.status === 200) {
              vm.literalResult = data.data;
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        function getLiteralData(p_testId) {
          //TODO: Filtrar la lista de literales por el id del examen
          var literalFilter = $filter('filter')(vm.literalResult, {
            testId: p_testId
          }, true);
          return literalFilter;
        }
        /**
         * Evento cuando se busca ordenes por fecha
         */
        function searchByDate(callback) {
          vm.loading = true;
          var listtest = [];
          vm.listresult.forEach(function (value, key) {
            if (value.result === undefined || value.result === null || value.result === ' ' || value.result === '') {
              value.result = null;
              if (value.resultType === 1) {
                value.result = 0;
                value.decimaltest = value.digits;
                value.format = 'n' + value.digits;
              }
              if (value.resultType === 2) {
                value.literalResultsLiteral = vm.getLiteralData(value.testId);
              }
              listtest.push(value);
            }
          });
          if (listtest.length !== 0) {
            vm.listresult = listtest;
            UIkit.modal('#validateresult').show();
          }
          vm.loading = false;
        }
        /**
         * Evento cuando se selecciona una orden
         * @param {*} orderS
         */
        function save() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          for (var i = 0; i < vm.listresult.length; i++) {
            if (vm.listresult[i].resultType === 1 && vm.listresult[i].result.indexOf(',') !== -1) {
              vm.listresult[i].result = vm.listresult[i].result.replace(',', '.');
            }
            if (vm.listresult[i].resultType === 2 && vm.listresult[i].literalResultsLiteral.length !== 0) {
              vm.listresult[i].result = vm.listresult[i].result.name;
            }
            vm.listresult[i].newState = 2;
            vm.listresult[i].idUser = auth.id;
            vm.listresult[i].resultChanged = true;
            vm.saveresult(vm.listresult[i]);
          }
          logger.success($filter('translate')('0149'));
          UIkit.modal('#validateresult').hide();
        }

        function saveresult(result) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return resultsentryDS.updateTest(auth.authToken, result).then(function (data) {
            if (data.status === 200) {
              if (vm.entryvalidation) {
                result.state = 2;
                result.newState = 4;
                result.grantValidate = true;
                var obj = {};
                obj.finalValidate = true;
                obj.orderId = vm.order.orderNumber;
                obj.sex = vm.order.patient.sex;
                obj.race = vm.order.patient.race;
                obj.size = vm.order.patient.size === undefined ? 0 : vm.order.patient.size;
                obj.weight = vm.order.patient.weight === undefined ? 0 : vm.order.patient.weight;
                obj.tests = [result];
                obj.questions = [];
                obj.alarms = [];
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return resultsentryDS.validateTests(auth.authToken, obj).then(function (data) {
                  if (data.status === 200) {
                  }
                }, function (error) {
                  vm.modalError(error);
                });
              }
            }
          }, function (error) {
            vm.modalError(error);
          });
        }
        /**
         * Funcion inicial de la directiva
         */
        function init() {
          vm.getLiteralResult();
        }
        vm.init();
      }],
      controllerAs: 'validateresult'
    };
    return directive;
  }
})();
