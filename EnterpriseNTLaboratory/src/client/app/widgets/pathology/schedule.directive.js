/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal:          @descripción
                order:              @descripción
                idtest:             @descripción
                testcode:           @descripción
                testname:           @descripción
                patientinformation: @descripción
                photopatient:       @descripción
                commetorderkey:     @descripción

  AUTOR:        @autor
  FECHA:        2021-04-30
  IMPLEMENTADA EN:

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function() {
  'use strict';

  angular
      .module('app.widgets')
      .directive('schedule', schedule)
      .config(function($compileProvider) {
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
      });
      schedule.$inject = ['$filter', 'localStorageService', 'pathologistDS', 'scheduleDS', 'organDS'
  ];

  /* @ngInject */
  function schedule($filter, localStorageService, pathologistDS, scheduleDS, organDS) {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/widgets/pathology/schedule.html',
          scope: {
              openmodal: '=openmodal',
              case: '=case',
              init: '=init',
              end: '=end',
              days: '=days',
              functionexecute: '=functionexecute',
              listener: '=?listener',
          },

          controller: ['$scope', '$timeout', function($scope, $timeout) {
              var vm = this;
              var auth = localStorageService.get('Enterprise_NT.authorizationData');
              vm.formatDate = localStorageService.get('FormatoFecha');
              vm.loading = false;

              vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
              vm.getPathologists = getPathologists;
              vm.removeData = removeData;
              vm.getOrgans = getOrgans;
              vm.loadModal = loadModal;
              vm.load = load;
              vm.filterScheduleByOrgan = filterScheduleByOrgan;
              vm.organ = null;
              vm.filterScheduleByPathologist = filterScheduleByPathologist;
              vm.pathologist = null;
              vm.selectPathologist = selectPathologist;
              vm.getEvents = getEvents;
              vm.close = close;
              vm.modalError = modalError;
              vm.loadSchedule = loadSchedule;

              $scope.$watch('openmodal', function() {
                if ($scope.openmodal) {
                  vm.case = $scope.case;
                  vm.init = $scope.init;
                  vm.end = $scope.end;
                  vm.days  = $scope.days;
                  vm.getOrgans();
                  vm.getPathologists();
                }
              });

              function getEvents() {
                scheduleDS.getEvents(auth.authToken).then(function(response) {
                  vm.events = _.orderBy(response.data, ['name'], ['asc']);
                  vm.loading = false;
                  vm.loadModal();
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
              }

              function selectPathologist(pathologist, day, date) {
                var total = day.quantity - day.quantityCases;
                if(day.status === 2 && pathologist.openSchedule && total > 0) {
                  $scope.listener({
                    pathologist: pathologist,
                    day: day,
                    date: date
                  });
                  UIkit.modal('#modal-modal_pathologist_assignment').hide();
                }
              }

              function filterScheduleByPathologist() {
                vm.organ = null;
                vm.listPathologistsFiltered = [];
                if(vm.pathologist.id === 0) {
                  vm.listPathologistsFiltered = vm.listPathologists;
                } else {
                  vm.listPathologistsFiltered = _.filter(vm.listPathologists, function(o) { return o.pathologist.id === vm.pathologist.id; });
                }
              }

              function filterScheduleByOrgan() {
                vm.listPathologistsFiltered = [];
                vm.pathologist = null;
                if(vm.organ.id === 0) {
                  vm.listPathologistsFiltered = vm.listPathologists;
                } else {
                  vm.listPathologists.forEach( function(value) {
                    var filter = _.filter(value.organs, function(o) { return o.id === vm.organ.id });
                    if(filter.length > 0) {
                      vm.listPathologistsFiltered.push(value);
                    }
                  });
                }
              }

              function load() {
                vm.organ = null;
                vm.pathologist = null;
                UIkit.modal('#modal_pathologist_assignment').show();
              }

              function loadModal() {
                $scope.openmodal = false;
                vm.load();
              }

              function getOrgans() {
                organDS.getByStatus(auth.authToken).then(function(response) {
                    vm.organs = _.orderBy(response.data, ['name'], ['asc']);
                    var all = {
                      "id": 0,
                      "name": $filter('translate')('0353')
                    }
                    vm.organs.unshift(all);
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
              }

              function removeData() {
                vm.listPathologists.forEach( function (pathologist) {
                  var schedule = [];
                  var openSchedule = false;
                  vm.days.forEach( function (value) {
                    pathologist.schedule.sort(function(a, b) {
                      return new Date(a.init) - new Date(b.init);
                    });
                    var date = _.filter(pathologist.schedule, function(o) { return moment(o.init).format(vm.formatDateAge) === value.date });
                    if(date.length > 0 && !openSchedule) {
                      openSchedule = true;
                    }
                    schedule.push({
                      date: value.date,
                      schedules: date
                    })
                  });
                  pathologist.schedule = schedule;
                  pathologist.openSchedule = openSchedule;
                });
                vm.listPathologistsFiltered = vm.listPathologists;
                vm.getEvents();
              }

              function loadSchedule() {
                var filter = {
                  initDate: vm.init,
                  endDate: vm.end
                }
                scheduleDS.get(auth.authToken, filter).then(function(data) {
                  if(data.status === 200) {
                    vm.pathologists.forEach(function (value, key) {
                      if(value.id > 0) {
                        value.schedule = _.filter(data.data, function(o) { return o.pathologist === value.id });
                      }
                    });
                  } else {
                    vm.loading = false;
                  }
                  vm.removeData();
                },
                function(error) {
                  vm.modalError(error);
                });
              }

              function getPathologists() {
                vm.loading = true;
                pathologistDS.getPathologistsAll(auth.authToken).then(function(response) {
                  vm.listPathologists = _.orderBy(response.data, ['pathologist.name'], ['asc']);
                  vm.pathologists = _.orderBy(response.data, ['pathologist.name'], ['asc']);
                  vm.pathologists.forEach(function (value, key) {
                    vm.pathologists[key].id  =  value.pathologist.id;
                    vm.pathologists[key].fullname  =  value.pathologist.name.split(" ")[0] + " " + value.pathologist.lastName.split(" ")[0];
                  });
                  var all = {
                    "id": 0,
                    "fullname": $filter('translate')('0353')
                  }
                  vm.pathologists.unshift(all);
                  vm.loadSchedule();
                },
                function(error) {
                  vm.modalError(error);
                });
              }

              function close() {
                  vm.caseFiles = [];
                  $scope.functionexecute();
                  UIkit.modal('#modal-modal_pathologist_assignment').hide();
              }

              function modalError(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
              }

          }],
          controllerAs: 'schedule'
      };
      return directive;
  }
})();
