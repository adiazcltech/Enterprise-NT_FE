(function () {
  'use strict';

  angular
  .module('app.schedule')
  .controller('scheduleController', scheduleController)
  .controller('scheduleControllerTemplate', scheduleControllerTemplate)
  .controller('modalinsertschedulecontroller', modalinsertschedulecontroller);
  scheduleController.$inject = ['pathologistDS', 'scheduleDS', 'eventPathologyDS', 'configurationDS', 'localStorageService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'ModalService'];

  function scheduleController(pathologistDS, scheduleDS, eventPathologyDS, configurationDS, localStorageService, $filter, $state, moment, $rootScope, LZString, $translate, ModalService) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Schedule';
    vm.isAuthenticate = isAuthenticate;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.modalError = modalError;
    vm.loadingdata = true;
    vm.thisyear = new Date().getFullYear();
    vm.user = ['user', 'name'];
    vm.name = ['name', 'user'];
    vm.sortType = vm.user;
    vm.sortReverse = false;
    vm.listPathologist = [];
    vm.selected = -1
    vm.getPathologist = getPathologist;
    vm.removeData = removeData;
    vm.getPathologistById = getPathologistById;
    vm.generateSchedule = generateSchedule;
    vm.dates = {
      daysShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      daysMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      months: [
        $filter('translate')('0152'),
        $filter('translate')('0153'),
        $filter('translate')('0154'),
        $filter('translate')('0155'),
        $filter('translate')('0156'),
        $filter('translate')('0157'),
        $filter('translate')('0158'),
        $filter('translate')('0159'),
        $filter('translate')('0160'),
        $filter('translate')('0161'),
        $filter('translate')('0162'),
        $filter('translate')('0163')
      ],
      weekShort: 'S',
      weekStart: 0
    };
    vm.month = [];
    vm.next = next;
    vm.previous = previous;
    vm.todaySchedule = todaySchedule;
    vm.initSelect = initSelect;
    vm.moveSelect = moveSelect;
    vm.endSelect = endSelect;
    vm.mouseHoverList = [];
    vm.mouseIsDown = false;
    vm.rangeDates = [];
    vm.styleFn = styleFn;
    vm.addEvent = addEvent;
    vm.schedule = [];
    vm.cancel = cancel;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.getConfigurationWorkDays = getConfigurationWorkDays;
    vm.workDays = [];
    vm.getEvents = getEvents;
    vm.events = [];
    vm.eventsTemplate = [];
    vm.loadEventsTemplate = loadEventsTemplate;
    vm.getEventsForm = getEventsForm;

    function getEventsForm(events) {
      var form = [];
      _.forEach(events, function (value) {
        var template = JSON.parse(JSON.stringify(vm.eventsTemplate));
        _.find(template, function (o) { return o.name === "id" }).value = value.id;
        _.find(template, function (o) { return o.name === "event" }).value = value.activity;
        _.find(template, function (o) { return o.name === "init" }).value = new Date(value.init);
        _.find(template, function (o) { return o.name === "end" }).value = new Date(value.end);
        form.push(template);
      });
      return form;
    }

    function loadEventsTemplate() {
      vm.eventsTemplate = [
        {
          'type': 'selectize',
          'name': 'event',
          'label': $filter('translate')('1130'),
          'placeholder': $filter('translate')('0463'),
          'code': true,
          'data': vm.events,
          'required': false,
          'value': ''
        },
        {
          'type': 'text',
          'label': $filter('translate')('3089'),
          'name': 'init',
          'required': false,
          'value': '',
          'class': 'pl-0'
        },
        {
          'type': 'text',
          'label': $filter('translate')('3090'),
          'name': 'end',
          'required': false,
          'value': '',
          'class': 'pr-0'
        },
        {
          'type': 'hidden',
          'name': 'id',
          'value': ''
        },
      ];
    }



    //** Metodo configuración dias laborales**/
    function getConfigurationWorkDays() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'DiasLaborales').then(function (data) {
        if (data.status === 200) {
          vm.workDays = data.data.value.split(",");
          vm.getPathologist();
          vm.year = (new Date()).getFullYear();
          vm.month = vm.generateSchedule(vm.year, (new Date()).getMonth());
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo configuración formato**/
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
          vm.getConfigurationWorkDays();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para obtener una lista de patologos*/
    function getPathologist() {
      vm.namePathologist = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return pathologistDS.getPathologist(auth.authToken).then(function (data) {
        vm.listPathologist = data.data === '' ? [] : _.filter(data.data, function (o) { return o.pathologist.state; });
        vm.listPathologist = vm.listPathologist.length === 0 ? [] : removeData(vm.listPathologist);
        vm.getEvents();
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }

    function getEvents() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return eventPathologyDS.getEvents(auth.authToken).then(function (data) {
        _.filter(data.data, function (o) { return o.status === 1; });
        vm.events = data.data === '' ? [] : _.filter(data.data, function (o) { return o.status === 1; });
        if (vm.listPathologist.length === 0 || vm.events.length === 0) {
          vm.modalrequired();
        } else {
          vm.loadEventsTemplate();
        }

      }, function (error) {
        vm.modalError(error);
      });
    }

    vm.modalrequired = modalrequired;
    //** para sacar la ventana modal de requeridos**//
    function modalrequired() {
      if (vm.listPathologist.length === 0 || vm.events.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requeridschedule.html',
          controller: 'scheduleControllerTemplate',
          inputs: {
            Pathologist: vm.listPathologist.length,
            events: vm.events.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }

    //** Método que agrega item a la lista de patologos**//
    function removeData(data) {
      data.forEach(function (value, key) {
        data[key].id = value.pathologist.id;
        data[key].userName = value.pathologist.userName;
        data[key].nameuserall = value.pathologist.name + ' ' + value.pathologist.lastName;
      });
      return data;
    }

    /**Metodo para obtener la agenda de un patologo*/
    function getPathologistById(pathologist, index, This) {
      vm.cancel();
      vm.loadingdata = true;
      vm.namePathologist = pathologist.nameuserall;
      vm.username = pathologist.userName;
      vm.idPathologist = pathologist.id === undefined ? -1 : pathologist.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var json = {
        pathologist: pathologist.pathologist.id
      }
      return scheduleDS.getScheduleByPathologist(auth.authToken, json).then(function (data) {
        if (data.status === 200 && data.data.length > 0) {
          vm.selected = pathologist.pathologist.id;
          data.data.forEach(function (value, key) {
            data.data[key].yearinit = parseInt(moment(value.init).format('YYYY'));
            data.data[key].monthinit = parseInt(moment(value.init).format('MM')) - 1;
            data.data[key].dayinit = parseInt(moment(value.init).format('DD'));
            data.data[key].hourinit = moment(value.init).format('LTS').replace(/:\d{2}\s/, ' ');
            data.data[key].yearend = parseInt(moment(value.end).format('YYYY'));
            data.data[key].monthend = parseInt(moment(value.end).format('MM')) - 1;
            data.data[key].dayend = parseInt(moment(value.end).format('DD'));
            data.data[key].hourend = moment(value.end).format('LTS').replace(/:\d{2}\s/, ' ');
          });
          vm.schedule = data.data;
          vm.year = (new Date()).getFullYear();
          vm.month = vm.generateSchedule(vm.year, (new Date()).getMonth());
          vm.usuario = $filter('translate')('0017') + ' ';
          data.data.sort(function (a, b) {
            return a.id - b.id;
          });
          if (data.data[data.data.length - 1].updatedAt) {
            vm.usuario = vm.usuario + moment(data.data[data.data.length - 1].updatedAt).format(vm.formatDate) + ' - ';
            vm.usuario = vm.usuario + data.data[data.data.length - 1].userUpdated.userName;
          } else {
            vm.usuario = vm.usuario + moment(data.data[data.data.length - 1].createdAt).format(vm.formatDate) + ' - ';
            vm.usuario = vm.usuario + data.data[data.data.length - 1].userCreated.userName;
          }
          vm.loadingdata = false;
        } else if (data.status === 204 || data.data.length === 0) {
          vm.selected = pathologist.pathologist.id;
          vm.year = (new Date()).getFullYear();
          vm.month = vm.generateSchedule(vm.year, (new Date()).getMonth());
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function cancel() {
      vm.schedule = [];
      vm.selected = -1;
      vm.namePathologist = '';
      vm.username = '';
      vm.idPathologist = -1;
      vm.year = (new Date()).getFullYear();
      vm.month = vm.generateSchedule(vm.year, (new Date()).getMonth());
    }

    //Método para pintar la agenda
    function generateSchedule(year, month) {
      var firstDate;
      var currentDate;
      var lastDate;
      var monthDays;
      var oclass;
      var oeclass;
      var evento;
      var id;
      var showevento;
      var pinterlist;
      var today = new Date();
      var init;
      var end;
      var type;
      var events;
      var valid;

      pinterlist = $filter('filter')(vm.schedule, {
        yearinit: year,
        monthinit: month
      }, true);

      if (pinterlist.length === 0) {
        pinterlist = [{
          'dayinit': '',
          'dayend': ''
        }]
      } else {
        pinterlist = $filter('orderBy')(pinterlist, ['dayinit']);
      }

      monthDays = {
        y: year,
        m: month,
        w: []
      };

      firstDate = new Date(year, month, 1);
      currentDate = new Date(firstDate.getTime());
      lastDate = new Date(year, month + 1, 0);

      while (currentDate.getDay() !== vm.dates.weekStart) {
        currentDate.setDate(currentDate.getDate() - 1);
      }

      while (currentDate <= lastDate) {
        var weekDays = [];
        do {
          if (currentDate < firstDate) {
            weekDays.push({
              class: 'day old'
            });
          } else if (currentDate > lastDate) {
            weekDays.push({
              class: 'day new'
            });
          } else {
            oclass = '';
            evento = '';
            showevento = false;
            init = '';
            end = '';
            type = '';
            id = '';
            oeclass = '';
            valid = true;
            events = new Array();
            if (currentDate.getFullYear() === today.getFullYear() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getDate() === today.getDate()) {
              oclass = 'today';
              evento = $filter('translate')('3085') + " ";
              showevento = true;
            }
            var init = _.filter(pinterlist, function (o) { return currentDate.getDate() === o.dayinit });

            if (init.length > 0) {

              init.sort(function (a, b) {
                return new Date(a.init) - new Date(b.init);
              });

              init.forEach(function (value, key) {
                events.push({
                  init: value.init,
                  end: value.end,
                  id: value.id,
                  event: value.hourinit + " - " + value.hourend + " ",
                  type: value.status,
                  quantity: value.quantity,
                  activity: value.event
                });
              });
            }

            var validate = _.find(vm.workDays, function (o) { return o === String(currentDate.getDay()); });

            if (validate) {
              oeclass = '';
              valid = true;
            } else {
              oeclass = 'day-invalid';
              valid = false;
            }

            weekDays.push({
              dd: currentDate.getDate(),
              class: 'day',
              oclass: oclass,
              oeclass: oeclass,
              event: evento,
              showevent: showevento,
              valid: valid,
              events: JSON.parse(JSON.stringify(events))
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        while (currentDate.getDay() !== vm.dates.weekStart);
        monthDays.w.push(weekDays);
      }
      return monthDays;
    }

    //Método que muestra la ventana modal para asignar la agenda
    function addEvent(day) {
      vm.name = day.event;
      vm.initmicroscopy = '';
      vm.endmicroscopy = '';
      vm.idmicroscopy = '';
      vm.initmacroscopy = '';
      vm.endmacroscopy = '';
      vm.idmacroscopy = '';
      vm.allEvents = '';
      vm.quantityMic = 1;
      vm.loadEventsTemplate();

      if (day.events.length > 0) {

        var macro = _.find(day.events, function (o) { return o.type === 1; });
        if (macro) {
          vm.initmacroscopy = new Date(macro.init);
          vm.endmacroscopy = new Date(macro.end);
          vm.idmacroscopy = macro.id;
        }
        var micro = _.find(day.events, function (o) { return o.type === 2; });
        if (micro) {
          vm.initmicroscopy = new Date(micro.init);
          vm.endmicroscopy = new Date(micro.end);
          vm.idmicroscopy = micro.id;
          vm.quantityMic = micro.quantity;
        }

        vm.allEvents = _.filter(day.events, function (o) { return o.activity.id !== 0; });
      }

      if (vm.allEvents.length > 0) {
        vm.allEvents = vm.getEventsForm(vm.allEvents);
      } else {
        vm.allEvents = [JSON.parse(JSON.stringify(vm.eventsTemplate))];
      }

      ModalService.showModal({
        templateUrl: 'modalinsertschedule.html',
        controller: 'modalinsertschedulecontroller',
        inputs: {
          rangeDatesinicial: vm.rangeDates[0],
          rangeDatesfinal: vm.rangeDates[1],
          month: vm.month,
          name: vm.name,
          pathologist: vm.selected,
          initmicroscopy: vm.initmicroscopy,
          endmicroscopy: vm.endmicroscopy,
          idmicroscopy: vm.idmicroscopy,
          initmacroscopy: vm.initmacroscopy,
          endmacroscopy: vm.endmacroscopy,
          idmacroscopy: vm.idmacroscopy,
          workdays: vm.workDays,
          eventsTemplate: vm.eventsTemplate,
          allEvents: vm.allEvents,
          quantityMic: vm.quantityMic
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          vm.getPathologistById({
            id: vm.selected,
            nameuserall: vm.namePathologist,
            userName: vm.username,
            pathologist: {
              id: vm.selected
            }
          });
        });
      });
    }

    function next() {
      if (vm.selected !== -1) {
        var nextMonth = 0;
        var nextYear = 0;
        if (vm.month.m == 11) {
          nextYear = vm.month.y + 1;
        } else {
          nextMonth = vm.month.m + 1;
          nextYear = vm.month.y;
        }
        vm.year = nextYear;
        vm.month = vm.generateSchedule(nextYear, nextMonth);
      }
    }

    function previous() {
      if (vm.selected !== -1) {
        var currentYear = (new Date()).getFullYear();
        var currentMonth = (new Date()).getMonth();
        var previousMonth = 11;
        var previousYear = 0;
        if (vm.month.m == 0) {
          previousYear = vm.month.y - 1;
        } else {
          previousMonth = vm.month.m - 1;
          previousYear = vm.month.y;
        }
        if (previousYear >= currentYear && previousMonth >= currentMonth) {
          vm.year = previousYear;
          vm.month = vm.generateSchedule(previousYear, previousMonth);
        }
      }
    }

    function todaySchedule() {
      if (vm.selected !== -1) {
        vm.month = vm.generateSchedule((new Date()).getFullYear(), (new Date()).getMonth());
      }
    }

    //Método para inicializar los días al dar click
    function initSelect(evt, day, y, m, d, valid) {
      if (vm.selected !== -1 && valid) {
        if (evt.which === 1) {
          vm.rangeDates = [];
          vm.mouseHoverList = [];
          if (d) {
            var dt = new Date(vm.year, m, d);
            vm.rangeDates.push(dt);
            vm.mouseHoverList[0] = {
              year: vm.year,
              month: m,
              day: d
            };
            vm.mouseHoverList[1] = {
              year: vm.year,
              month: m,
              day: d
            };
          }
          vm.mouseIsDown = true;
        }
      }
    }

    //Método que evalua cuando se mueve el mouse
    function moveSelect(evt, y, m, d, valid) {
      if (vm.selected !== -1 && valid) {
        if (vm.mouseIsDown && d) {
          var dt = new Date(vm.year, m, d);
          if (vm.rangeDates[0] == null) {
            vm.rangeDates[0] = dt;
            vm.mouseHoverList[0] = {
              year: vm.year,
              month: m,
              day: d
            };
            vm.mouseHoverList[1] = {
              year: vm.year,
              month: m,
              day: d
            };
          }
          if (dt < vm.rangeDates[0]) {
            vm.mouseHoverList[0] = {
              year: vm.year,
              month: m,
              day: d
            };
            vm.mouseHoverList[1] = {
              year: vm.rangeDates[0].getFullYear(),
              month: vm.rangeDates[0].getMonth(),
              day: vm.rangeDates[0].getDate()
            };
          } else {
            if (dt > vm.rangeDates[0]) {
              vm.mouseHoverList[1] = {
                year: vm.year,
                month: m,
                day: d
              };
              vm.mouseHoverList[0] = {
                year: vm.rangeDates[0].getFullYear(),
                month: vm.rangeDates[0].getMonth(),
                day: vm.rangeDates[0].getDate()
              };
            } else {
              if (dt > new Date(vm.mouseHoverList[0].year, vm.mouseHoverList[0].month, vm.mouseHoverList[0].day)) {
                vm.mouseHoverList[1] = {
                  year: vm.year,
                  month: m,
                  day: d
                };
              } else {
                vm.mouseHoverList[0] = {
                  year: vm.year,
                  month: m,
                  day: d
                };
              }
            }
          }
        }
      }
    }

    //Método que evalua cuando el mouse se deja de mover
    function endSelect(evt, day) {
      if (vm.selected !== -1 && day.valid) {
        if (evt.which === 1) {
          if (vm.mouseHoverList[0] && vm.mouseHoverList[1]) {
            var initday = vm.mouseHoverList[0].day;
            var endday = vm.mouseHoverList[1].day;
            if (initday != endday) {
              var pinterlist = $filter('filter')(vm.schedule, {
                yearinit: vm.month.y,
                monthinit: vm.month.m
              }, true);
              var ss = _.filter(pinterlist, function (o) { return o.dayinit >= initday && o.dayinit <= endday; });
              if (ss.length === 0) {
                vm.rangeDates[0] = new Date(vm.year, vm.mouseHoverList[0].month, vm.mouseHoverList[0].day);
                vm.rangeDates[1] = new Date(vm.year, vm.mouseHoverList[1].month, vm.mouseHoverList[1].day);
                vm.mouseHoverList = [];
                var today = new Date(moment().format()).getTime();
                vm.date1 = new Date(moment(vm.rangeDates[0]).format()).getTime();
                vm.date2 = new Date(moment(vm.rangeDates[1]).format()).getTime();
                if (vm.date1 > today) {
                  vm.addEvent(day);
                }
              }
            } else {
              vm.rangeDates[0] = new Date(vm.year, vm.mouseHoverList[0].month, vm.mouseHoverList[0].day);
              vm.rangeDates[1] = new Date(vm.year, vm.mouseHoverList[1].month, vm.mouseHoverList[1].day);
              vm.mouseHoverList = [];
              var today = new Date(moment().format()).getTime();
              vm.date1 = new Date(moment(vm.rangeDates[0]).format()).getTime();
              vm.date2 = new Date(moment(vm.rangeDates[1]).format()).getTime();
              if (vm.date1 > today) {
                vm.addEvent(day);
              }
            }
          }
          vm.mouseIsDown = false;
        }
      }
    }

    //Método que pinta cuando se selecciona varios dias
    function styleFn(range, y, m, d, valid) {
      if (vm.selected !== -1) {
        if (range.length > 1) {
          if (valid == true) {
            var today = new Date(moment().format()).getTime();
            var rangeIni = new Date(vm.year, range[0].month, range[0].day);
            var rangeEnd = new Date(vm.year, range[1].month, range[1].day);
            var dt = new Date(vm.year, m, d);
            if (dt >= rangeIni && dt <= rangeEnd) {
              if (vm.mouseHoverList[0] && vm.mouseHoverList[1]) {
                var initday = vm.mouseHoverList[0].day;
                var endday = vm.mouseHoverList[1].day;
                if (initday !== endday) {
                  var pinterlist = $filter('filter')(vm.schedule, {
                    yearinit: vm.month.y,
                    monthinit: vm.month.m
                  }, true);
                  var ss = _.filter(pinterlist, function (o) { return o.dayinit >= initday && o.dayinit <= endday; });
                  if (ss.length === 0 && valid) {
                    if (rangeIni > today) {
                      return {
                        'background-color': 'rgba(0,0,0,.2)'
                      };
                    }
                  }
                } else {
                  if (rangeIni > today) {
                    return {
                      'background-color': 'rgba(0,0,0,.2)'
                    };
                  }
                }
              }
            }
          }
        }
      }
      return;
    }

    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.selected === -1) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = [];
        var pinterlist = $filter('filter')(vm.schedule, {
          yearinit: vm.month.y,
          monthinit: vm.month.m
        }, true);
        if (pinterlist.length > 0) {
          pinterlist = $filter('orderBy')(pinterlist, ['dayinit']);
        }
        pinterlist.forEach(function (value) {
          vm.datareport.push(
            {
              id: vm.selected,
              day: moment(value.init).format(vm.formatDate),
              init: value.hourinit,
              end: value.hourend,
              area: value.status,
              event: value.event,
              namepathologist: vm.namePathologist,
              username: vm.username
            }
          )
        });

        if (vm.datareport.length > 0) {
          vm.pathreport = '/report/configuration/pathology/schedule/schedule.mrt';
          vm.openreport = false;
          vm.report = false;
          vm.windowOpenReport();
        }
      }
    }

    // función para ver el reporte en otra pestaña del navegador.
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

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'specimen') {
              vm.specimenRepeat = true;
            }
          });
          vm.loadingdata = false;
        }
      }
      if (vm.specimenRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }

    /** funcion inicial que se ejecuta cuando se carga el modulo */
    function init() {
      vm.getConfigurationFormatDate();
    }

    vm.isAuthenticate();
  }
  //** Método que muestra la ventana modal para modificar la agenda*//
  function modalinsertschedulecontroller(
    $scope,
    localStorageService,
    logger,
    close,
    rangeDatesinicial,
    rangeDatesfinal,
    month,
    $filter,
    name,
    scheduleDS,
    pathologist,
    initmicroscopy,
    endmicroscopy,
    idmicroscopy,
    initmacroscopy,
    endmacroscopy,
    idmacroscopy,
    workdays,
    eventsTemplate,
    allEvents,
    quantityMic,
    $element
  ) {

    $scope.rangeDatesinicial = rangeDatesinicial;
    $scope.rangeDatesfinal = rangeDatesfinal;
    $scope.month = month;
    $scope.pathologist = pathologist;
    $scope.date1 = new Date(moment($scope.rangeDatesinicial).format()).getTime();
    $scope.date2 = new Date(moment($scope.rangeDatesfinal).format()).getTime();
    $scope.initmicroscopy = initmicroscopy;
    $scope.endmicroscopy = endmicroscopy;
    $scope.idmicroscopy = idmicroscopy
    $scope.invalidMicroscopy = false;
    $scope.initmacroscopy = initmacroscopy;
    $scope.endmacroscopy = endmacroscopy;
    $scope.idmacroscopy = idmacroscopy;
    $scope.invalidMacroscopy = false;
    $scope.invalidDates = false;
    $scope.idEvent = '';
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.save = save;
    $scope.deleteSchedule = deleteSchedule;
    $scope.update = update;
    $scope.service = service;
    $scope.auth = localStorageService.get('Enterprise_NT.authorizationData');
    $scope.name = name;
    $scope.deleteMacroscopy = deleteMacroscopy;
    $scope.deleteMicroscopy = deleteMicroscopy;
    $scope.modalError = modalError;
    $scope.required = false;
    $scope.workdays = workdays;
    $scope.eventsTemplate = eventsTemplate;
    $scope.events = allEvents;
    $scope.quantityMic = quantityMic;
    $scope.cloneSection = cloneSection;
    $scope.deleteSection = deleteSection;
    $scope.getDataEvents = getDataEvents;
    $scope.invalidDate = false;
    $scope.invalidEvent = false;
    $scope.repeatedEvent = false;
    $scope.clearEvent = clearEvent;
    $scope.validateEvents = validateEvents;

    function validateEvents() {
      $scope.invalidEvent = false;
      $scope.repeatedEvent = false;

      var lastEvent = $scope.events[$scope.events.length - 1];
      var event = '';
      var init = '';
      var end = '';
      lastEvent.forEach(function (value) {
        if (value.name === 'event') {
          event = value.value;
        }
        if (value.name === 'init') {
          init = value.value;
        }
        if (value.name === 'end') {
          end = value.value;
        }
      });
      if (event === '' || init === '' || end === '') {
        $scope.invalidEvent = true;
        return true;
      } else {
        var repeat = _.filter($scope.events, function (o) { return o[0].value.id === event.id; });
        if (repeat.length > 1) {
          $scope.repeatedEvent = true;
          return true;
        } else {
          return false;
        }
      }
    }

    function clearEvent(section) {
      section.forEach(function (value) {
        if (value.name === 'event' || value.name === 'init' || value.name === 'end') {
          value.value = '';
        }
      });
    }

    function deleteSection($event, $index) {
      $event.preventDefault();
      $scope.invalidEvent = false;
      $scope.repeatedEvent = false;
      $scope.events.splice($index, 1);
    }

    function cloneSection() {
      var validation = $scope.validateEvents();
      if (!validation) {
        $scope.events.push(JSON.parse(JSON.stringify($scope.eventsTemplate)));
      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      logger.success(error);
    }

    function getDataEvents() {
      $scope.invalidDate = false;
      var events = [];
      $scope.events.forEach(function (value) {
        var event = '';
        var init = '';
        var end = '';
        var id = '';
        value.forEach(function (form) {
          if (form.name == "id") {
            id = form.value;
          }
          if (form.name == "event") {
            event = form.value;
          }
          if (form.name == "init") {
            init = form.value;
          }
          if (form.name == "end") {
            end = form.value;
          }
        });
        if (event !== '' && init !== '' && end !== '') {
          var compareInit = new Date(
            init.getFullYear(),
            init.getMonth(),
            init.getDate(),
            end.getHours(),
            end.getMinutes(),
            end.getSeconds()
          );
          if (compareInit <= init) {
            $scope.invalidDate = true;
          }
          init = new Date(
            $scope.rangeDatesinicial.getFullYear(),
            $scope.rangeDatesinicial.getMonth(),
            $scope.rangeDatesinicial.getDate(),
            init.getHours(),
            init.getMinutes(),
            init.getSeconds()
          );
          end = new Date(
            $scope.rangeDatesfinal.getFullYear(),
            $scope.rangeDatesfinal.getMonth(),
            $scope.rangeDatesfinal.getDate(),
            end.getHours(),
            end.getMinutes(),
            end.getSeconds()
          );
          events.push({ id: id, event: event, init: init, end: end });
        } else {
          if (id !== '') {
            $scope.deleteSchedule(id);
          }
        }
      });
      return events;
    }

    //Método para guardar el Festivo evalua si es actualizar o nuevo
    function save(Form) {
      Form.$setUntouched();
      var schedules = [];
      $scope.invalidMicroscopy = false;
      $scope.invalidMacroscopy = false;
      $scope.invalidDates = false;
      $scope.required = false;
      var events = $scope.getDataEvents();
      if ($scope.initmicroscopy === '' && $scope.endmicroscopy === '' && $scope.initmacroscopy === '' && $scope.endmacroscopy === '' && events.length === 0) {
        $scope.required = true;
        return false;
      }

      if (events.length > 0) {
        var validation = $scope.validateEvents();
        if (validation) {
          $scope.repeatedEvent = true;
          return false;
        }
      }

      if ($scope.initmacroscopy == '' && $scope.endmacroscopy == '' && $scope.idmacroscopy != '') {
        $scope.deleteSchedule($scope.idmacroscopy);
      }
      if ($scope.initmicroscopy == '' && $scope.endmicroscopy == '' && $scope.idmicroscopy != '') {
        $scope.deleteSchedule($scope.idmicroscopy);
      }
      if ($scope.initmacroscopy != '' && $scope.endmacroscopy != '') {
        var compareEnd = new Date(
          $scope.initmacroscopy.getFullYear(),
          $scope.initmacroscopy.getMonth(),
          $scope.initmacroscopy.getDate(),
          $scope.endmacroscopy.getHours(),
          $scope.endmacroscopy.getMinutes(),
          $scope.endmacroscopy.getSeconds()
        );
        if (compareEnd <= $scope.initmacroscopy) {
          $scope.invalidMacroscopy = true;
          return false;
        }
        $scope.initmacroscopy = new Date(
          rangeDatesinicial.getFullYear(),
          rangeDatesinicial.getMonth(),
          rangeDatesinicial.getDate(),
          $scope.initmacroscopy.getHours(),
          $scope.initmacroscopy.getMinutes(),
          $scope.initmacroscopy.getSeconds()
        );
        $scope.endmacroscopy = new Date(
          rangeDatesfinal.getFullYear(),
          rangeDatesfinal.getMonth(),
          rangeDatesfinal.getDate(),
          $scope.endmacroscopy.getHours(),
          $scope.endmacroscopy.getMinutes(),
          $scope.endmacroscopy.getSeconds()
        );
        var macroscopy = {
          id: $scope.idmacroscopy,
          init: $scope.initmacroscopy,
          end: $scope.endmacroscopy,
          status: 1,
          quantity: 0
        }
        schedules.push(macroscopy);
      }
      if ($scope.initmicroscopy != '' && $scope.endmicroscopy != '') {
        var compareInit = new Date(
          $scope.initmicroscopy.getFullYear(),
          $scope.initmicroscopy.getMonth(),
          $scope.initmicroscopy.getDate(),
          $scope.endmicroscopy.getHours(),
          $scope.endmicroscopy.getMinutes(),
          $scope.endmicroscopy.getSeconds()
        );
        if (compareInit <= $scope.initmicroscopy) {
          $scope.invalidMicroscopy = true;
          return false;
        }
        $scope.initmicroscopy = new Date(
          rangeDatesinicial.getFullYear(),
          rangeDatesinicial.getMonth(),
          rangeDatesinicial.getDate(),
          $scope.initmicroscopy.getHours(),
          $scope.initmicroscopy.getMinutes(),
          $scope.initmicroscopy.getSeconds()
        );
        $scope.endmicroscopy = new Date(
          rangeDatesfinal.getFullYear(),
          rangeDatesfinal.getMonth(),
          rangeDatesfinal.getDate(),
          $scope.endmicroscopy.getHours(),
          $scope.endmicroscopy.getMinutes(),
          $scope.endmicroscopy.getSeconds()
        );
        var microscopy = {
          id: $scope.idmicroscopy,
          init: $scope.initmicroscopy,
          end: $scope.endmicroscopy,
          status: 2,
          quantity: $scope.quantityMic
        }
        schedules.push(microscopy);
      }

      if (events.length > 0) {
        events.forEach(function (value) {
          schedules.push(value);
        });
      }
      schedules.sort(function (a, b) {
        return new Date(a.init) - new Date(b.init);
      });
      if (schedules.length >= 2) {
        for (var i = 0; i < schedules.length - 1; i++) {
          if (typeof schedules[i + 1] !== 'undefined') {
            var compareDate = new Date(
              schedules[i].end.getFullYear(),
              schedules[i].end.getMonth(),
              schedules[i].end.getDate(),
              schedules[i + 1].init.getHours(),
              schedules[i + 1].init.getMinutes(),
              schedules[i + 1].init.getSeconds()
            );
            if (schedules[i].end >= compareDate) {
              $scope.invalidDates = true;
              return false;
            }
          }
        }
      }
      schedules.forEach(function (value, key) {
        var dateInitial = new Date(value.init);
        while (dateInitial <= value.end) {
          var validate = _.find($scope.workdays, function (o) { return o === String(dateInitial.getDay()); });
          if (validate) {
            var initDate = new Date(
              dateInitial.getFullYear(),
              dateInitial.getMonth(),
              dateInitial.getDate(),
              value.init.getHours(),
              value.init.getMinutes(),
              value.init.getSeconds()
            );
            var endDate = new Date(
              dateInitial.getFullYear(),
              dateInitial.getMonth(),
              dateInitial.getDate(),
              value.end.getHours(),
              value.end.getMinutes(),
              value.end.getSeconds()
            );
            var newSchedule = {
              id: value.id,
              pathologist: $scope.pathologist,
              init: initDate,
              end: endDate,
              status: value.status,
              event: value.event,
              quantity: value.quantity > 0 ? value.quantity : 0,
              userCreated: $scope.auth,
              userUpdated: $scope.auth
            }
            if (newSchedule.id !== undefined && newSchedule.id !== null && newSchedule.id !== '') {
              update(newSchedule);
            } else {
              service(newSchedule);
            }
          }
          dateInitial.setDate(dateInitial.getDate() + 1);
        }
      });
      $element.modal("hide");
      logger.success($filter('translate')('0042'));
      setTimeout(function () {
        close();
      }, 2000);
    }

    function deleteMacroscopy() {
      $scope.initmacroscopy = '';
      $scope.endmacroscopy = '';
    }

    function deleteMicroscopy() {
      $scope.initmicroscopy = '';
      $scope.endmicroscopy = '';
    }

    //Método para cambiar de estado al festivo
    function deleteSchedule(id) {
      return scheduleDS.deleteSchedule($scope.auth.authToken, id).then(function (data) {
        if (data.status === 200) { }
      }, function (error) {
        modalError(error);
      });
    }

    //Método para actulizar un festivo
    function update(schedule) {
      return scheduleDS.updateSchedule($scope.auth.authToken, schedule).then(function (data) {
        if (data.status === 200) {
          $scope.idEvent = data.data.id;
        }
      }, function (error) {
        modalError(error);
      });
    }

    //Método para guardar un nuevo festivo
    function service(schedule) {
      scheduleDS.insertSchedule($scope.auth.authToken, schedule).then(function (data) {
        if (data.status === 200) {
          $scope.idEvent = data.data.id;
        }
      }, function (error) {
        modalError(error);
      });
    }

    //Método para para cerrar la ventana modal
    $scope.close = function () {
      close({
        listresult: $scope.listresult
      }, 500);
    };
  }
  function scheduleControllerTemplate($scope, Pathologist, events, close) {
    $scope.Pathologist = Pathologist;
    $scope.events = events;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();
