/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   order @descripción
                state @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('interviewdestiny', interviewdestiny);

  interviewdestiny.$inject = ['$filter', 'localStorageService', 'sampletrackingsDS'];

  /* @ngInject */
  //state = esta propiedad cuando es true es modo informativo, y no se pone la propiedad queda el control en modo edición
  function interviewdestiny($filter, localStorageService, sampletrackingsDS) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/interviewdestiny.html',
      scope: {
        order: '=?order',
        sample: '=?sample',
        destination: '=?destination',
        updateview: '=?updateview'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.loadinterview = loadinterview;
        vm.orderlistinterview = orderlistinterview;
        vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
        vm.ListInterview = [];
        vm.viewzero = false;

        $scope.$watch('updateview', function () {
          if ($scope.updateview) {
            vm.viewzero = false;
            if ($scope.order && $scope.destination && $scope.sample) {
              vm.loading = true;
              vm.ListInterview = [];
              vm.order = $scope.order;
              vm.sample = $scope.sample;
              vm.destination = $scope.destination;
              vm.loadinterview();
              $scope.updateview = false;
            }
          }
        });
        //Metodo que consulta las entrevista asociada a la orden
        function loadinterview() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.ListInterview = [];
          return sampletrackingsDS.trackingstakeinterview(auth.authToken, vm.order, vm.sample, vm.destination, auth.branch).then(function (data) {
            vm.ListInterview = data.data;
            if (vm.ListInterview.length > 0) {
              vm.ListInterview.forEach(function (value, key) {
                if (value.control === 5 || value.control === 6) {
                  value.answers.selected = $filter('filter')(value.answers, {
                    selected: true
                  }, true);
                  if (value.answers.selected.length !== 0) {
                    value.interviewAnswer = _.map(value.answers.selected, 'name');
                    value.interviewAnswer = _.replace(value.interviewAnswer, '[', '');
                    value.interviewAnswer = JSON.stringify(value.interviewAnswer).replace(/"/g, " ");
                  }
                } else if (value.control === 4) {
                  if (vm.state === false) {
                    value.interviewAnswer = moment(value.interviewAnswer).format();
                  } else {
                    value.interviewAnswer = moment(value.interviewAnswer).format(vm.formatDateHours);
                  }
                }
              });
              vm.loading = false;
              return vm.ListInterview.sort(vm.orderlistinterview);
            } else {
              vm.loading = false;
              vm.viewzero = true;
            }
          }, function (error) {
            vm.loading = false;
          });
        }
        //Metodo que ordena las preguntas
        function orderlistinterview(a, b) {
          if (a.order < b.order) {
            return -1;
          } else if (a.order > b.order) {
            return 1;
          } else {
            if (a.name > b.name) {
              return -1;
            } else if (a.name < b.name) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }],
      controllerAs: 'interviewdestiny'
    };
    return directive;
  }
})();
/* jshint ignore:end */
