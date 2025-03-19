/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                listener  @descripción
                order     @descripción
                date      @descripción

  AUTOR:        @autor
  FECHA:        2021-03-01
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pathology/samplereception/sampleentry/sampleentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';
  angular
      .module('app.widgets')
      .directive('casedailysearch', casedailysearch);
  casedailysearch.$inject = ['caseDS', 'localStorageService', '$filter'];
  /* @ngInject */
  function casedailysearch(caseDS, localStorageService, $filter) {
      var directive = {
          templateUrl: 'app/widgets/pathology/casedailysearch.html',
          restrict: 'EA',
          scope: {
              openmodal: '=?openmodal',
              listener: '=?listener',
              date: '=?date'
          },
          controller: ['$scope', function ($scope) {
              var vm = this;
              vm.init = init;
              $scope.date = moment().toDate();
              vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
              vm.dateFormatToSearch = '{format:"' + vm.dateFormat + '"}';
              vm.dateToSearch = moment().format(vm.dateFormat);
              vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True' ? true : false;
              vm.cases = [];
              vm.selectCase = selectCase;
              vm.dateToSearch = new Date();

              $scope.$watch('openmodal', function () {
                  if ($scope.openmodal) {
                      vm.sortType = 'studyType.code';
                      vm.sortReverse = false;
                      searchByDate(function () {
                          UIkit.modal('#casedailysearch').show();
                      });
                  }
                  $scope.openmodal = false;
              });

              $scope.$watch('date', function () {
                  if ($scope.date !== null && $scope.date !== '') {
                      vm.dateToSearch = $scope.date;
                  } else {
                      vm.dateToSearch = new Date();
                  }
                  searchByDate();
              });

              /**
               * Evento cuando se busca casos por fecha
              */
              function searchByDate(callback) {
                  vm.loadingsearch=true;
                  if (vm.dateToSearch !== undefined && vm.dateToSearch !== '') {
                      var date = moment(vm.dateToSearch).format('YYYYMMDD');
                      var auth = localStorageService.get('Enterprise_NT.authorizationData');
                      //Invoca el metodo del servicio
                      caseDS.getByEntryDate(auth.authToken, date, auth.branch)
                          .then(
                              function (data) {
                                  vm.loadingsearch=false;
                                  if (data.status === 200) {
                                      var dataCases = [];
                                      data.data.forEach(function (element, index) {
                                          element.sex = ((element.sex === 1 ? $filter('translate')('0363') : (element.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))));
                                          element.birthday = moment(element.birthday).format('DD/MM/YYYY');
                                          dataCases.push(element);
                                      });
                                      vm.cases = _.orderBy(dataCases, 'id', 'desc');
                                  } else {
                                      vm.cases = [];
                                    }
                                    if (callback !== undefined) {
                                        callback();
                                    }
                              }, function (error) {
                                      vm.Error = error;
                                      vm.ShowPopupError = true;
                                      vm.loadingsearch=false;
                                  if (callback !== undefined) {
                                      callback();
                                  }
                              });
                  } else {
                      vm.loadingsearch=false;
                      vm.cases = [];
                      if (callback !== undefined) {
                          callback();
                      }
                  }
              }

              /**
               * Evento cuando se selecciona un caso
               * @param {*} caseS
               */
              function selectCase(caseS) {
                  setTimeout(function () {
                      $scope.listener(caseS);
                      UIkit.modal('#casedailysearch').hide();
                  }, 100);
              }

              /**
               * Funcion inicial de la directiva
              */
              function init() {

              }
              vm.init();
          }],
          controllerAs: 'casedailysearch'
      };
      return directive;
  }
})();
