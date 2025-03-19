/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   idcase @descripción

  AUTOR:        @autor
  FECHA:        2021-06-02
  IMPLEMENTADA EN:
  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
(function () {
  'use strict';
  angular
      .module('app.widgets')
      .directive('caseinfo', caseinfo);
  caseinfo.$inject = ['common', 'caseDS', 'localStorageService', '$filter'];
  /* @ngInject */
  function caseinfo(common, caseDS, localStorageService, $filter) {
      var directive = {
          templateUrl: 'app/widgets/pathology/caseinfo.html',
          restrict: 'EA',
          scope: {
              idcase: '=?idcase',
          },
          controller: ['$scope', function ($scope) {
              var vm = this;

              //Variables de la directiva
              vm.case = $scope.idcase;
              vm.case = null;
              vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();

              //Variables de la directiva que no se muestran en la vista
              var auth = localStorageService.get('Enterprise_NT.authorizationData');

              //Metodos de la directiva
              vm.init = init;

              $scope.$watch('idcase', function () {
                  if ($scope.idcase !== undefined && $scope.idcase !== null) {
                      vm.case = $scope.idcase;
                      loadCase(vm.case);
                  }
              });

              /** Carga la informacion de un caso*/
              function loadCase(caseInfo) {
                  vm.case = null;
                  if (caseInfo !== undefined && caseInfo !== null) {
                    caseDS.getCaseById(auth.authToken, caseInfo.id, caseInfo.orderNumber).then(
                          function (response) {
                              if (response.status === 200) {
                                  vm.case = response.data;
                                  vm.case.registerDate = moment(vm.case.createdAt).format(vm.formatDate);
                              }
                          },
                          function (error) {
                              vm.Error = error;
                              vm.ShowPopupError = true;
                          }
                      );
                  }
              }
              /**
               * Funcion inicial de la directiva
              */
              function init() {
                  loadCase();
              }
              vm.init();
          }],
          controllerAs: 'caseinfo'
      };
      return directive;
  }
})();
