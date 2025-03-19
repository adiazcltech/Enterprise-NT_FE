(function () {
  'use strict';
  angular
    .module('app.holidays')
    .controller('holidaysController', holidaysController)
    .controller('modalinsertholidaycontroller', modalinsertholidaycontroller);
  holidaysController.$inject = ['holidaysDS', 'localStorageService',
    '$filter', '$state', 'moment', '$rootScope', '$scope', '$window', 'ModalService'
  ];

  function holidaysController(holidaysDS, localStorageService,
    $filter, $state, moment, $rootScope, $scope, $window, ModalService) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.thisyear = new Date().getFullYear();
    vm.title = 'holidays';
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.modalError = modalError;
    vm.Repeatname = false;
    vm.setGrid = setGrid;
    vm.setYear = setYear;
    vm.generateCal = generateCal;
    vm.radioModel = 'Left';
    vm.endSelect = endSelect;
    vm.mouseHoverList = [];
    vm.mouseIsDown = false;
    vm.rangeDates = [];
    vm.setGrid = setGrid;
    vm.styleFn = styleFn;
    vm.initSelect = initSelect;
    vm.moveSelect = moveSelect;
    vm.addEvent = addEvent;
    angular.element($window).bind('resize', function () {
      vm.setGrid();
    });
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
    }
    //Método que muestra la ventana modal para asignar el festivo
    function addEvent(day) {
      vm.bottondelete = '';
      vm.bottondelete = day.event;
      vm.name = day.event;
      ModalService.showModal({
        templateUrl: 'modalinsertholiday.html',
        controller: 'modalinsertholidaycontroller',
        inputs: {
          bottondelete: vm.bottondelete,
          rangeDatesinicial: vm.rangeDates[0],
          rangeDatesfinal: vm.rangeDates[1],
          calendar: vm.calendar,
          name: vm.name
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {});
      });

    }
    //Método que se activa ciuando se da click sobre el año
    function setYear(year) {
      vm.calendar = [];
      vm.get(year);
    }
    //Método para inicializar los días al dar click
    function initSelect(evt, day, y, m, d) {
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
    //Método que evalua cuando se mueve el mouse
    function moveSelect(evt, y, m, d) {
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
    //Método que pinta cuando se selecciona varios dias
    function styleFn(range, y, m, d) {
      var today = new Date(moment().format()).getTime();
      if (range.length > 1) {
        var rangeIni = new Date(vm.year, range[0].month, range[0].day);
        var rangeEnd = new Date(vm.year, range[1].month, range[1].day);
        var dt = new Date(vm.year, m, d);
        if (dt >= rangeIni && dt <= rangeEnd) {
          if (rangeIni > today) {
            return {
              'background-color': 'rgba(0,0,0,.2)'
            };
          }
        }
      }
      return;
    }
    //Método que evalua cuando el mouse se deja de mover
    function endSelect(evt, day) {
      if (evt.which === 1) {
        if (vm.mouseHoverList[0] && vm.mouseHoverList[1]) {
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
        vm.mouseIsDown = false;
      }
    }
    //Método agregar los nuevos datos a la grilla
    function setGrid(mw) {
      var calWidth = angular.element(document.getElementById('persCal')).context.clientWidth;
      var monthWidth;
      if (mw) {
        monthWidth = 188;
      } else {
        monthWidth = document.querySelectorAll(".month")[0].clientWidth;
      }
      if (monthWidth * 6 < calWidth) {
        $scope.monthContainerClass = ' col-xs-2';
      } else if (monthWidth * 4 < calWidth) {
        $scope.monthContainerClass = ' col-xs-3';
      } else if (monthWidth * 3 < calWidth) {
        $scope.monthContainerClass = ' col-xs-4';
      } else if (monthWidth * 2 < calWidth) {
        $scope.monthContainerClass = ' col-xs-6';
      } else {
        $scope.monthContainerClass = ' col-xs-12';
      }
      // manuall $digest required as resize event
      // is outside of angular
      if (!mw) {
        $scope.$digest();
      }
    }
    //Método para pintar el calendario
    function generateCal(year) {
      var firstDate;
      var currentDate;
      var lastDate;
      var calendar = [];
      var monthDays;
      var oclass;
      var oeclass;
      var evento;
      var id;
      var S = 0;
      var state;
      var showevento;
      var pinterlist;
      var today = new Date();

      pinterlist = $filter('filter')(vm.listholiday, {
        yearholiday: year
      }, true);

      if (pinterlist.length === 0) {
        pinterlist = [{
          'monthholiday': '',
          'dayholiday': ''
        }]
      } else {

        pinterlist = $filter('orderBy')(pinterlist, ['monthholiday', 'dayholiday']);
      }

      for (var month = 0; month < 12; month++) {

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
              id = null;
              state = '';
              showevento = false;
              oeclass = '';

              if (currentDate.getMonth() === pinterlist[S].monthholiday &&
                currentDate.getDate() === pinterlist[S].dayholiday) {

                if (pinterlist[S].state === true) {

                  oclass = 'bg-light-blue-active';
                  oeclass = 'unico-color';
                  showevento = true;
                  evento = pinterlist[S].name;
                  id = pinterlist[S].id;
                  state = pinterlist[S].state;


                  var one = new Date(moment(currentDate).format()).getTime();
                  var two = new Date(moment(today).format()).getTime();


                  if (one < two) {
                    oclass = 'bg-pridisable';
                    oeclass = 'unico-color';
                    showevento = true;
                    evento = pinterlist[S].name;
                    id = pinterlist[S].id;
                    state = pinterlist[S].state;
                  }



                  if (currentDate.getFullYear() === today.getFullYear() &&
                    currentDate.getMonth() === today.getMonth() &&
                    currentDate.getDate() === today.getDate()) {
                    oclass = 'unico-today';
                    evento = 'Hoy' + '-' + pinterlist[S].name;
                    id = pinterlist[S].id;
                    state = pinterlist[S].state;
                    showevento = true;
                  }

                  if (S !== pinterlist.length - 1) {
                    S = S + 1;
                  }
                } else {
                  id = pinterlist[S].id;
                  state = pinterlist[S].state;
                  if (S !== pinterlist.length - 1) {
                    S = S + 1;
                  }
                }
              } else if (currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getDate() === today.getDate()) {
                oclass = 'unico-today';
                evento = "Hoy";
                showevento = true;
              }


              weekDays.push({
                dd: currentDate.getDate(),
                class: 'day',
                oclass: oclass,
                oeclass: oeclass,
                event: evento,
                showevent: showevento,
                id: id,
                state: state
              });
            }

            currentDate.setDate(currentDate.getDate() + 1);
          }
          while (currentDate.getDay() !== vm.dates.weekStart);
          monthDays.w.push(weekDays);
        }

        calendar.push(monthDays);
      }
      vm.loadingdata = false;
      return calendar;
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
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'date') {
              vm.Repeatdate = true;
            } else if (item[0] === '1' && item[1] === 'name') {
              vm.Repeatname = true;
            }
          });
        }
      }
      if (vm.Repeatdate === false && vm.Repeatname === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get(year) {
      vm.loadingdata = true;
      vm.listholiday = [];
      vm.year = year;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return holidaysDS.get(auth.authToken).then(function (data) {
        if (data.statusText === 'OK') {
          data.data.forEach(function (value, key) {
            data.data[key].yearholiday = parseInt(moment(value.date).format('YYYY'));
            data.data[key].monthholiday = parseInt(moment(value.date).format('MM')) - 1;
            data.data[key].dayholiday = parseInt(moment(value.date).format('DD'));
          });
          vm.listholiday = data.data;
        }
        vm.calendar = vm.generateCal(year);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.get(vm.thisyear);
      vm.setGrid(188);
    }
    vm.isAuthenticate();
  }
  //** Método que muestra la ventana modal para crear un nuevo festivo*//
  function modalinsertholidaycontroller($scope, localStorageService, logger, close, bottondelete, rangeDatesinicial, rangeDatesfinal, calendar, holidaysDS, $filter, name) {
    $scope.bottondelete = bottondelete;
    $scope.rangeDatesinicial = rangeDatesinicial;
    $scope.rangeDatesfinal = rangeDatesfinal;
    $scope.calendar = calendar;
    $scope.date1 = new Date(moment($scope.rangeDatesinicial).format()).getTime();
    $scope.date2 = new Date(moment($scope.rangeDatesfinal).format()).getTime();
    $scope.save = save;
    $scope.deleteholiday = deleteholiday;
    $scope.updateholiday = updateholiday;
    $scope.service = service;
    $scope.auth = localStorageService.get('Enterprise_NT.authorizationData');
    $scope.name = name;
    $scope.modalError = modalError;
    //** Método para sacar el popup de error**//
    function modalError(error) {
      logger.success(error);
    }
    //Método para guardar el Festivo evalua si es actualizar o nuevo
    function save(Form) {
      Form.$setUntouched();
      var currentDate = rangeDatesinicial;
      var lastDate = rangeDatesfinal;
      var cal = $scope.calendar;
      while (currentDate <= lastDate) {
        for (var month = 0; month < 12; month++) {
          if (cal[month].y === currentDate.getFullYear() && cal[month].m === currentDate.getMonth()) {
            for (var week = 0; week < cal[month].w.length; week++) {
              for (var day = 0; day < cal[month].w[week].length; day++) {
                if (cal[month].w[week][day].dd === currentDate.getDate()) {
                  $scope.Detail = {
                    'user': {
                      'id': localStorageService.get('Enterprise_NT.authorizationData').id
                    },
                    'id': cal[month].w[week][day].id,
                    'date': new Date(moment(currentDate).format()).getTime(),
                    'name': $scope.name,
                    'state': true
                  };

                  if ($scope.Detail.id === null) {
                    service(cal, month, week, day);
                  } else {
                    updateholiday()

                  }
                  cal[month].w[week][day].oclass = 'bg-light-blue-active';
                  cal[month].w[week][day].oeclass = 'unico-color';
                  cal[month].w[week][day].event = $scope.name;
                  cal[month].w[week][day].showevent = true;
                }
              }
            }
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      logger.success($filter('translate')('0042'));
    }
    //Método para cambiar de estado al festivo
    function deleteholiday(Form) {
      Form.$setUntouched();
      var currentDate = rangeDatesinicial;
      var lastDate = rangeDatesfinal;
      var cal = $scope.calendar;
      while (currentDate <= lastDate) {
        for (var month = 0; month < 12; month++) {
          if (cal[month].y === currentDate.getFullYear() && cal[month].m === currentDate.getMonth()) {
            for (var week = 0; week < cal[month].w.length; week++) {
              for (var day = 0; day < cal[month].w[week].length; day++) {
                if (cal[month].w[week][day].dd === currentDate.getDate()) {
                  $scope.Detail = {
                    'user': {
                      'id': localStorageService.get('Enterprise_NT.authorizationData').id
                    },
                    'id': cal[month].w[week][day].id,
                    'date': new Date(moment(currentDate).format()).getTime(),
                    'name': $scope.name,
                    'state': false
                  };

                  if ($scope.Detail.id === null) {
                    service(cal, month, week, day);
                  } else {
                    updateholiday()

                  }
                  cal[month].w[week][day].oeclass = '';
                  cal[month].w[week][day].event = '';
                  cal[month].w[week][day].state = false;
                  cal[month].w[week][day].oclass = '';
                  cal[month].w[week][day].showevent = false;
                }
              }
            }
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      logger.success($filter('translate')('0042'));
    }
    //Método para actulizar un festivo
    function updateholiday() {
      return holidaysDS.update($scope.auth.authToken, $scope.Detail).then(function (data) {
        if (data.status === 200) {}
      }, function (error) {
        modalError(error);
      });
    }
    //Método para guardar un nuevo festivo
    function service(cal, month, week, day) {
      return holidaysDS.New($scope.auth.authToken, $scope.Detail).then(function (data) {
        if (data.status === 200) {
          cal[month].w[week][day].id = data.data.id;
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
})();
