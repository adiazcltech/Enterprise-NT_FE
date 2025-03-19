/* jshint ignore:start */
(function() {
  'use strict';

  angular
      .module('app.tissueprocessor')
      .controller('tissueprocessorController', tissueprocessorController)

  tissueprocessorController.$inject = ['localStorageService', 'logger', 'caseteDS', 'processingtimeDS', '$filter', '$state', 'moment', '$scope', '$rootScope', 'dragulaService', 'common', 'chartpathologyDS'];

  function tissueprocessorController (localStorageService, logger, caseteDS, processingtimeDS, $filter, $state, moment, $scope, $rootScope, dragulaService, common,chartpathologyDS)
  {

  //Variables generales
  var vm = this;
  $rootScope.menu = true;
  $rootScope.NamePage = $filter('translate')('3010');
  $rootScope.helpReference = '08.Pathology/macroscopy.htm';
  var auth = localStorageService.get('Enterprise_NT.authorizationData');
  vm.isAuthenticate = isAuthenticate;
  vm.init = init;
  vm.modalError = modalError;
  vm.filterRange = '0';
  vm.rangeInit = moment().format('YYYYMMDD');
  vm.rangeEnd = moment().format('YYYYMMDD');
  vm.formatDate = localStorageService.get('FormatoFecha');
  vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
  vm.stateFilters = 3;
  vm.dataCases = [];
  vm.filter = {};
  vm.setFilter = setFilter;
  vm.stateButton = stateButton;
  vm.changeStatus = changeStatus;
  vm.groups = [
    {
      id: 1,
      name: $filter('translate')('0317'),
      class: 'span-pending',
      select: false
    },
    {
      id: 2,
      name: $filter('translate')('3211'),
      class: 'span-process',
      select: false
    },
    {
      id: 3,
      name: $filter('translate')('3212'),
      class: 'span-done',
      select: false
    }
  ];
  vm.getProcessingTime = getProcessingTime;
  vm.removeData = removeData;
  vm.massiveActions = false;
  vm.unde = unde;
  vm.selectAll = selectAll;
  vm.processingHours = null;
  vm.processingTime = null;
  vm.listCasetes = [];
  vm.status = null;
  vm.save = save;
  vm.changeStatusList = changeStatusList;
  vm.validationDragula = validationDragula;
  vm.actualElement = null;
  vm.actualSource = null;
  vm.cancel = cancel;
  vm.autocomplenumbercase = autocomplenumbercase;
  vm.loadQuantDigit = loadQuantDigit;
  vm.casedigit = localStorageService.get('DigitosCaso');
  vm.typeCaseNumber = localStorageService.get('TipoNumeroCaso');
  vm.searchcase = '';
  vm.searchFilter = '';
  vm.getCharts = getCharts;
  vm.loadCharts = loadCharts;
  vm.pendingActual = null;
  vm.pendingTotal = null;
  vm.widgets = null;
  vm.processActual = null;
  vm.processTotal = null;
  vm.monthly = null;
  vm.daily = null;
  vm. loadChartStudies = loadChartStudies;
  vm.loadChartTimes = loadChartTimes;
  vm.sendCentral = sendCentral;
  vm.chartSchedule = null;
  vm.chartStudies = null;
  vm.modalfilter = modalfilter;
  vm.requiredHours = true;

  function modalfilter() {
    vm.showModalFilter = true;
    setTimeout(function () {
      UIkit.modal("#modalfilter-date", {
        keyboard: false,
        bgclose: false,
        center: true,
      }).show();
    }, 30);
  }

  function sendCentral(casete) {
    casete.select = true;
    vm.changeStatus(4);
  }

  function loadChartTimes() {

    var list = _.filter(vm.dataCasetes, function(o) { return o.status === 2 });

    var times = _.uniqBy(_.map(list, function(value) {
      return value.casete.time.time;
    }), _.identity);

    var result = [];
    times.forEach(function(value) {
      var quantity = _.filter(list, function(o) { return o.casete.time.time === value }).length;
      result.push({
        'label': value,
        'value': quantity
      });
    });

    var labels = [];
    var data = [];

    result.forEach(function(value) {
      labels.push(value.label);
      data.push(value.value);
    });

    var configshcedule = {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [
          {
            label: $filter('translate')('3219'),
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: data
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: false,
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }
    var schedule = document.getElementById('schedule').getContext('2d');
    vm.chartSchedule = new Chart(schedule, configshcedule);
  }

  function loadChartStudies() {
    var list = _.filter(vm.dataCasetes, function(o) { return o.status === 2 });

    var studies = _.uniqBy(_.map(list, function (value) {
      return value.studyType.name;
    }), _.identity);

    var result = [];
    studies.forEach(function(value) {
      var quantity = _.filter(list, function(o) { return o.studyType.name === value }).length;
      result.push({
        'label': value,
        'value': quantity
      });
    });

    var data = [];
    var labels = [];
    result.forEach(function(value) {
      labels.push(value.label);
      data.push(value.value);
    });

    var configChartStudies = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#33b35a',
              "#ffce56",
              "#4bc0c0",
              "#CDDC39",
              "#9C27B0",
              "#fb7145",
              "#5971f9"
            ],
          }
        ],
        labels: labels
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        legendCallback: function (chart) {
            var text = [];
            var data = chart.data;
            var datasets = data.datasets;
            var labels = data.labels;
            if(datasets.length) {
              for (var i = 0; i < datasets[0].data.length; i++) {
                text.push('<div style="display: flex;margin-bottom: 5px;">');
                if(labels[i]) {
                  text.push('<div style="background:' + datasets[0].backgroundColor[i] + ';width: 15px;height: 15px;margin-right: 4px;"></div><span style="font-weight: bold;font-size: 11px;">' + labels[i] +  ' - ' +  datasets[0].data[i] + '</span>')
                }
                text.push('</div>');
              }
            }
            return text.join('');
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    };
    var chart = document.getElementById('chartStudies').getContext('2d');
    vm.chartStudies = new Chart(chart, configChartStudies);
    $("#legendStudies").html(vm.chartStudies.generateLegend());
  }

  function loadCharts(data) {
    vm.widgets = true;
    vm.pendingActual = _.filter(vm.dataCasetes, function(o) { return o.status === 1 }).length;
    vm.processActual = _.filter(vm.dataCasetes, function(o) { return o.status === 2 }).length;
    vm.monthly = _.find(data, function(o) { return o.key === 'monthly' }).value;
    vm.daily = _.find(data, function(o) { return o.key === 'daily' }).value;
    vm.pendingTotal  = _.find(data, function(o) { return o.key === 'pending' }).value;
    vm.processTotal = _.find(data, function(o) { return o.key === 'process' }).value;
    if(vm.chartSchedule && vm.chartStudies) {
      vm.chartSchedule.destroy();
      vm.chartStudies.destroy();
    }
    setTimeout(function(){
      vm.loadChartStudies();
      vm.loadChartTimes();
    }, 500);
  }

  function getCharts() {
    return chartpathologyDS.getTissueProcess(auth.authToken).then(function (data) {
      vm.loadCharts(data.data);
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

  function cancel() {
    if(vm.actualElement && vm.actualSource) {
      $(vm.actualElement).remove();
      $(vm.actualSource).append(vm.actualElement);
    }
    vm.unde();
  }

  $scope.$on('casetes.drop', function (e, el, target, source) {
    vm.actualElement = el;
    vm.actualSource = source;
    var consecutive = el[0].attributes.consecutive.nodeValue;
    var casete = _.find(vm.dataCasetes, function(o) { return +o.id === +el[0].id && o.completeConsecutive === consecutive });
    if(casete && +target[0].id > +casete.status) {
      casete.select = true;
      vm.changeStatus(+target[0].id, e);
    }
  });

  function changeStatusList() {
    UIkit.modal('#modal_settings').hide();
    var casetes = [];
    vm.listCasetes.forEach( function(value) {
      casetes.push({
        idCasete: value.id,
        consecutive: value.casete.consecutive,
        status: vm.status
      });
    });
    return caseteDS.changeStatus(auth.authToken, casetes).then(function (data) {
      vm.loading = false;
      logger.success($filter("translate")("3300"));
      vm.unde();
      vm.setFilter();
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

  function save() {
    if(vm.processingTime) {
      var validateHours = _.filter(vm.listCasetes, function(o) { return o.hours === 0 });
      if(validateHours.length > 0 && (vm.processingHours === 0 || vm.processingHours === null || vm.processingHours === undefined)) {
        return false;
      }
      UIkit.modal('#modal_settings').hide();
      var casetes = [];
      vm.loading = true;
      vm.listCasetes.forEach( function(value) {
        casetes.push({
          idCasete: value.id,
          consecutive: value.casete.consecutive,
          time: vm.processingTime,
          hours: value.hours === 0 || value.hours === undefined || value.hours === null ? vm.processingHours : value.hours,
          status: vm.status
        });
      });
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return caseteDS.saveTissueProcessor(auth.authToken, casetes).then(function (data) {
        vm.loading = false;
        logger.success($filter("translate")("3300"));
        vm.unde();
        vm.setFilter();
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }
  }

  function selectAll(group) {
    _.filter(vm.dataCasetes, function(o) { return o.status === group.id; }).forEach( function (val) {
      val.select = group.select;
    });
  }

  function unde() {
    vm.massiveActions = false;
    vm.status = null;
    vm.actualElement = null;
    vm.actualSource = null;
    vm.processingHours = null;
    vm.processingTime = null;
    vm.groups.forEach( function (val) {
      val.select = false;
    });
    if(vm.dataCasetes) {
      vm.dataCasetes.forEach( function (val) {
        val.select = false;
      });
    }
    vm.listCasetes = [];
    UIkit.modal('#modal_settings').hide();
    vm.isOpen = false;
  }

  function removeData(data) {
    var list = [];
    data.forEach( function (value) {
      value.initialsPatient = value.name1.charAt(0) + value.name2.charAt(0) + value.lastName.charAt(0) + value.surName.charAt(0);
      value.number = value.idCase.toString().substring(3);
      value.detail.forEach( function (val) {
        value.casete.consecutive = val.consecutive;
        value.completeConsecutive = val.consecutive;
        var time = _.find(vm.times, function(o) { return o.id === val.time.id });
        if(time) {
          value.casete.time = time;
        } else {
          value.casete.time = val.time;
        }
        value.casete.hours = val.hours;
        value.status = val.status;
        list.push(_.cloneDeep(value));
      });
    });
    return list;
  }

  function getProcessingTime() {
    return processingtimeDS.getByStatus(auth.authToken).then(function (data) {
      if (data.status === 200) {
        vm.times = data.data;
        vm.loading = false;
      }
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

  function changeStatus(status, event) {
    var previousStatus = status - 1;
    vm.listCasetes = _.filter(vm.dataCasetes, function(o) { return o.select });
    var validate = _.filter(vm.listCasetes, function(o) { return o.status !== previousStatus });
    if(validate.length > 0) {
      logger.error($filter("translate")("3226"));
      return false;
    }
    if(vm.listCasetes.length > 0) {
      vm.status = status;
      vm.isOpen = true;
      vm.requiredHours = true;
      if(status === 2) {
        if(vm.listCasetes.length === 1) {
          vm.processingHours = vm.listCasetes[0].hours;
        } else {
          var validateHours = _.filter(vm.listCasetes, function(o) { return o.hours === 0 });
          if(validateHours.length === 0) {
            vm.requiredHours = false;
          }
        }
      }
      if(event) {
        event.stopPropagation();
        $scope.$apply();
      }
      setTimeout(function () {
        UIkit.modal('#modal_settings', {
          keyboard: false,
          bgclose: false,
          center: true,
        }).show();
      }, 50);
    }
  }

  /** Funcion configura el filtro principal para la consulta de los casos */
  function setFilter() {
    UIkit.modal('#modalfilter-date').hide();
    vm.showModalFilter = false;
    vm.loading = true;
    vm.cancel();
    vm.stateFilters = 1;

    //Rango de casos
    if (vm.searchcase === '') {
      vm.filter.filterRange = vm.filterRange;
      vm.filter.firstCase = vm.filterRange === '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye el primer caso
      vm.filter.lastCase = vm.filterRange === '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye el ultimo caso
      //Rango de fecha de ingreso
      vm.filter.init = vm.filterRange !== '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera fecha
      vm.filter.end = vm.filterRange !== '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  fecha
      vm.filterinfo.textinit = vm.filterRange === '0' ? $filter('translate')('0075') : $filter('translate')('0073'),
      vm.filterinfo.valueinit = vm.filterRange === '0' ? moment(vm.rangeInit).format(vm.formatDateAge) : vm.rangeInit.substring(3),
      vm.filterinfo.textend = vm.filterRange === '0' ? $filter('translate')('0076') : $filter('translate')('0074'),
      vm.filterinfo.valueend = vm.filterRange === '0' ? moment(vm.rangeEnd).format(vm.formatDateAge) : vm.rangeEnd.substring(3),
      vm.filterinfo.valuefilterstudies = vm.numfilter === undefined || vm.numfilter === 0 ? 'N/A' : vm.filterinfo.valuefilterstudies,
      //Lista de areas
      vm.filter.studyTypeList = [];
      vm.filter.numfilter = vm.numfilter;
    } else {
      vm.filter.filterRange = '1';
      vm.filter.firstCase = parseInt(vm.searchcase) - 1;
      vm.filter.lastCase = parseInt(vm.searchcase) + 1;
      vm.filterinfo.valueinit = 'N/A';
      vm.filterinfo.valueend = 'N/A';
      vm.filter.numfilter  = null;
    }

    switch (vm.numfilter) {
      case 1:
        vm.filterinfo.valuefilterstudies = vm.liststudies.length;
        vm.filter.studyTypeList = vm.liststudies;
        break;
      default:
        vm.filterinfo.valuefilterstudies = 'N/A'
    }

    vm.filter.areas = [4];
    vm.filter.status = [1,2,3];

    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    return caseteDS.getByFilterCases(auth.authToken, vm.filter).then(function (data) {
      if (data.status === 200) {
        vm.dataCasetes = data.data.length > 0 ? vm.removeData(data.data) : '';
        vm.dataCasetes = _.orderBy(vm.dataCasetes, ['id'], ['asc']);
        vm.loading = false;
      } else {
        vm.loading = false;
        UIkit.modal('#nofoundfilter').show();
        vm.dataCasetes = [];
      }
      vm.getCharts();
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
      vm.stateFilters = 3;
    });
  }

  function autocomplenumbercase($event) {
    var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
    if (keyCode === 13 || keyCode === undefined) {
      if (vm.searchcase.length < vm.maxcantdigit) {
        if (vm.searchcase.length === vm.maxcantdigit - 1) {
          vm.searchcase = '0' + vm.searchcase;
          vm.searchcase = moment().year() + vm.searchcase;
        }
        else if (parseInt(vm.maxcantdigit) === vm.searchcase.length - 1) {
          vm.searchcase = '0' + vm.searchcase;
          vm.searchcase = moment().year() + (common.getCaseComplete(vm.searchcase, vm.casedigit)).substring(4);
        }
        else {
          vm.searchcase = vm.searchcase === '' ? 0 : vm.searchcase;
          if (vm.searchcase.length === parseInt(vm.maxcantdigit) + 1) {
            vm.searchcase = moment().year() + moment().format('MM') + '0' + vm.searchcase;
          } else if (vm.searchcase.length === parseInt(vm.maxcantdigit) + 2) {
            vm.searchcase = moment().year() + moment().format('MM') + vm.searchcase;
          } else if (vm.searchcase.length === parseInt(vm.maxcantdigit) + 3) {
            vm.searchcase = moment().year() + '0' + vm.searchcase;
          } else {
            vm.searchcase = moment().year() + (common.getCaseComplete(vm.searchcase, vm.casedigit)).substring(4);
          }
        }
      } else if (vm.searchcase.length > vm.maxcantdigit) {
        if (vm.searchcase.length === vm.maxcantdigit + 1) {
          vm.searchcase = (moment().format('YYYY')).substring(0, 3) + vm.searchcase;
        } else if (vm.searchcase.length === vm.maxcantdigit + 2) {
            vm.searchcase = (moment().format('YYYY')).substring(0, 2) + vm.searchcase;
        } else if (vm.searchcase.length === vm.maxcantdigit + 3) {
            vm.searchcase = (moment().format('YYYY')).substring(0, 1) + vm.searchcase;
        } else {
          vm.searchcase = vm.searchcase;
        }
      } else if (vm.searchcase.length === vm.maxcantdigit) {
        vm.searchcase = moment().year() + vm.searchcase
      }
      vm.setFilter();
    } else {
      if (!(keyCode >= 48 && keyCode <= 57)) {
        $event.preventDefault();
      }
    }
  }

  function loadQuantDigit() {
    if(vm.typeCaseNumber === "Diario") {
      vm.maxcantdigit = parseInt(vm.casedigit) + 4;
    } else if(vm.typeCaseNumber === "Mensual") {
      vm.maxcantdigit = parseInt(vm.casedigit) + 2;
    } else if(vm.typeCaseNumber === "Anual") {
      vm.maxcantdigit = parseInt(vm.casedigit);
    }
  }

  //** Metodo que evalua los estados de los botones**//
  function stateButton(state) {
    if (state === 'new') {
      vm.disabled = false;
      vm.disabledSave = false;
      vm.disabledEdit = true;
      vm.disabledCancel = true;
    }
    if (state === 'edit') {
      vm.disabled = true;
      vm.disabledSave = true;
      vm.disabledEdit = false;
      vm.disabledCancel = true;
    }
    if (state === 'update') {
      vm.disabled = false;
      vm.disabledSave = false;
      vm.disabledEdit = true;
      vm.disabledCancel = false;
    }
  }

  //** Método para sacar el popup de error**//
  function modalError(error) {
    vm.Error = error;
    vm.ShowPopupError = true;
  }

  function isAuthenticate() {
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    if (auth === null || auth.token) {
        $state.go('login');
    } else {
        vm.init();
    }
  }

  function init() {
    vm.filterinfo = {
      'textinit': $filter('translate')('0075'),
      'textend': $filter('translate')('0076'),
      'valueinit': 'N/A',
      'valueend': 'N/A',
      'valuefilterstudies': 'N/A'
    }
    vm.validationDragula();
    vm.getProcessingTime();
    vm.loadQuantDigit();
  }
  vm.isAuthenticate();

  function validationDragula() {
    dragulaService.options($scope, 'casetes', {
      accepts: function (el, container, handle) {
        var consecutive = el.attributes.consecutive.nodeValue;
        var casete = _.find(vm.dataCasetes, function(o) { return +o.id === +el.id && o.completeConsecutive === consecutive });
        return casete ? +casete.status === 1 && +container.id === 2 ? true : +casete.status === 2 && +container.id === 3 ? true : false : false;
      }
    });
  }
}

})();
/* jshint ignore:end */
