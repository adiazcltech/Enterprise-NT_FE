/* jshint ignore:start */
(function() {
  'use strict';

  angular
      .module('app.cut')
      .controller('cutController', cutController)

  cutController.$inject = ['localStorageService', 'logger', 'caseteDS', '$filter', '$state', 'moment', '$scope', '$rootScope', 'common', 'protocolDS'];

  function cutController (localStorageService, logger, caseteDS, $filter, $state, moment, $scope, $rootScope, common, protocolDS)
  {

  //Variables generales
  var vm = this;
  $rootScope.menu = true;
  $rootScope.NamePage = $filter('translate')('3306');
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
  vm.filter = {};
  vm.setFilter = setFilter;
  vm.searchcase = '';
  vm.autocomplenumbercase = autocomplenumbercase;
  vm.loadQuantDigit = loadQuantDigit;
  vm.casedigit = localStorageService.get('DigitosCaso');
  vm.typeCaseNumber = localStorageService.get('TipoNumeroCaso');
  vm.searchFilter = '';
  vm.modalfilter = modalfilter;
  vm.removeData = removeData;
  $scope.collapsed = false;
  vm.dataCases = [];
  vm.selectCase = selectCase;
  vm.casePat = null;
  vm.selectBlock = selectBlock;
  vm.blockSelected = null;
  vm.loadFormTemplate = loadFormTemplate;
  vm.colorations = [];
  vm.formTemplate = [];
  vm.getColorations = getColorations;
  vm.loadDataBlock = loadDataBlock;
  vm.loadProtocol = loadProtocol;

  function getColorations() {
    return caseteDS.getColorationByStatus(auth.authToken).then(function (data) {
      if (data.status === 200) {
        vm.colorations = data.data;
        vm.loadFormTemplate();
      }
      vm.loading = false;
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

  function loadFormTemplate() {
    vm.formTemplate = [
      {
        'type': 'text',
        'name': 'quantity',
        'label': $filter('translate')('3121'),
        'required': true,
        'value': ''
      },
      {
          'type': 'selectize',
          'name': 'fixative',
          'label': $filter('translate')('3057'),
          'placeholder': $filter('translate')('3058'),
          'code': true,
          'data': vm.colorations,
          'required': true,
          'value': ''
      }
    ];
  }

  function selectBlock(block) {
    vm.dataBlocks.forEach(function(value) {
      if( (value.id !== block.id && value.completeConsecutive !== block.completeConsecutive) || ( value.id === block.id && value.completeConsecutive !== block.completeConsecutive )) {
        value.active = false;
      }
    });
    block.active = !block.active;
    if(block.active) {
      vm.loadDataBlock(block);
    } else {
      vm.blockSelected = null;
    }
  }

  function loadDataBlock(block) {
    block.form = [_.cloneDeep(vm.formTemplate)];
    vm.blockSelected = block;
    vm.loadProtocol();
  }

  function loadProtocol() {
    var id = 0;
    if(vm.blockSelected.subSampleId > 0) {
      id = vm.blockSelected.subSampleId;
    } else {
      id = vm.blockSelected.specimenId;
    }

    if(vm.blockSelected.organ.id > 0 ) {
      protocolDS.getBySpecimen(auth.authToken, id, vm.blockSelected.organ.id).then( function (response) {
        if(response.status === 200) {
          vm.protocol = response.data;
        }
        vm.loading = false;
      }, function(error) {
        vm.modalError(error);
      });
    }
  }

  function selectCase(casePat) {
    vm.loading = true;
    vm.casePat = casePat;
    vm.blockSelected = null;
    var filter = {
      areas: [4],
      end: 0,
      init: 0,
      filterRange: '1',
      firstCase: parseInt(casePat.idCase) - 1,
      lastCase: parseInt(casePat.idCase) + 1,
      status: [7]
    };
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.dataBlocks = [];
    return caseteDS.getByFilterCases(auth.authToken, filter).then(function (data) {
      if (data.status === 200) {
        data.data.forEach( function (value) {
          value.initialsPatient = value.name1.charAt(0) + value.name2.charAt(0) + value.lastName.charAt(0) + value.surName.charAt(0);
          value.number = value.idCase.toString().substring(3);
          value.detail.forEach( function (val) {
            value.casete.consecutive = val.consecutive;
            value.completeConsecutive = val.consecutive;
            value.status = val.status;
            vm.dataBlocks.push(_.cloneDeep(value));
          });
        });
      }
      vm.loading = false;
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

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

  /** Funcion configura el filtro principal para la consulta de los casos */
  function setFilter() {
    UIkit.modal('#modalfilter-date').hide();
    vm.showModalFilter = false;
    vm.loading = true;
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
    vm.filter.status = [7];

    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    return caseteDS.getByFilterCases(auth.authToken, vm.filter).then(function (data) {
      if (data.status === 200) {
        vm.dataCases = data.data.length > 0 ? vm.removeData(data.data) : '';
        vm.loading = false;
      } else {
        vm.loading = false;
        UIkit.modal('#nofoundfilter').show();
        vm.dataCases = [];
      }
      // vm.getCharts();
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
      vm.stateFilters = 3;
    });
  }

  function removeData(data) {
    var listCases = [];
    data = _.groupBy(data, 'idCase');
    Object.keys(data).forEach( function(key) {
      listCases.push({
        'idCase': data[key][0].idCase,
        'idOrder': data[key][0].idOrder,
        'lastName': data[key][0].lastName,
        'name1': data[key][0].name1,
        'name2': data[key][0].name2,
        'patientId': data[key][0].patientId,
        'surName': data[key][0].surName,
        'studyType': data[key][0].studyType
      });
    });
    return _.orderBy(listCases, ['idCase'], ['desc']);
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
    vm.loadQuantDigit();
    vm.getColorations();
  }
  vm.isAuthenticate();
}

})();
/* jshint ignore:end */
