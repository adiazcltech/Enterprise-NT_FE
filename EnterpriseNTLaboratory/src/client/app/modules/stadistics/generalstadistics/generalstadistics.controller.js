/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.generalstadistics')
    .controller('generalstadisticsController', generalstadisticsController);


  generalstadisticsController.$inject = ['LZString', '$translate', 'localStorageService',
    '$filter', '$state', 'moment', '$rootScope', 'ordertypeDS', 'stadisticsDS', 'reportadicional'
  ];

  function generalstadisticsController(LZString, $translate, localStorageService,
    $filter, $state, moment, $rootScope, ordertypeDS, stadisticsDS, reportadicional) {

    var vm = this;
    vm.init = init;
    vm.isAuthenticate = isAuthenticate;
    vm.title = 'Stadistics';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0029');
    $rootScope.helpReference = '05.Stadistics/generalstadistics.htm';
    vm.getOrderType = getOrderType;
    vm.getlists = getlists;
    vm.changetypereport = changetypereport;
    vm.printReport = printReport;
    vm.modalError = modalError;
    vm.changeDatePicker = changeDatePicker;
    vm.loaddata = loaddata;
    vm.getmonthrange = getmonthrange;
    vm.getnameMonth = getnameMonth;
    vm.formatDate = localStorageService.get('FormatoFecha')
    vm.report = false;
    vm.listgroup = [];
    $rootScope.pageview = 3;
    vm.isopenreport = false;
    vm.enddate = moment().format(vm.formatDate.toUpperCase());
    vm.initdate = moment().format(vm.formatDate.toUpperCase());
    vm.numbergroup = 4;
    vm.loadingdata = true;
    vm.enabledgroupfirt = false;
    vm.removetest = false;
    vm.isopenreport = true;
    vm.groupProfiles = true;
    vm.abbrCustomer = localStorageService.get("Abreviatura");
    vm.nameCustomer = localStorageService.get("Entidad");
    vm.windowOpenReport = windowOpenReport;

    function changeDatePicker(control) {
      if (control === 1 && vm.typereport === 3) {
        vm.maxDate2 = moment(vm.dateInit).add(11, 'months').format();
        vm.minDate2 = moment(vm.dateInit).format();
      } else if (control === 1 && vm.typereport !== 3) {
        vm.maxDate2 = moment(vm.dateInit).add(730, 'days').format();
        vm.minDate2 = moment(vm.dateInit).format();
      } else if (control === 2 && vm.typereport === 3) {
        vm.maxDate1 = moment(vm.dateEnd).format();
        vm.minDate1 = moment(vm.dateEnd).subtract(11, 'months').format();
      } else if (control === 2 && vm.typereport !== 3) {
        vm.maxDate1 = moment(vm.dateEnd).format();
        vm.minDate1 = moment(vm.dateEnd).subtract(730, 'days').format();
      }

      var rangeinit = moment(vm.dateInit).format('YYYYMMDD');
      var rangeend = moment(vm.dateEnd).format('YYYYMMDD');

      if (rangeinit === 'Invalid date' || vm.initdate === null || rangeend === 'Invalid date' || vm.enddate === null) {
        vm.isopenreport = false;
      } else {
        vm.isopenreport = true;
      }
    }

    function getOrderType() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getOrderTypeActive(auth.authToken).then(function (data) {
        vm.getlists();
        var all = [{
          'id': null,
          'name': $filter('translate')('0215')
        }];

        if (data.data.length > 0) {
          vm.listordertype = all.concat(data.data);
          vm.itemordertype = {
            id: null
          };
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function changetypereport() {
      vm.enabledgroupfirt = false;
      vm.removetest = false;
      // if (vm.typereport === 4) {
      //   vm.enabledgroupfirt = true;
      // }
      if (vm.typereport === 2) {
        vm.removetest = true;
      }
      if (vm.typereport === 3) {
        vm.minDate1 = moment().subtract(11, 'months').format();
        vm.maxDate1 = moment().format();
        vm.maxDate2 = moment().format();
        vm.minDate2 = moment().subtract(11, 'months').format()
      } else if (vm.typereport !== 3) {
        vm.maxDate2 = moment(vm.dateInit).add(730, 'days').format();
        vm.minDate2 = moment(vm.dateInit).format();
        vm.maxDate1 = moment(vm.dateEnd).format();
        vm.minDate1 = moment(vm.dateEnd).subtract(730, 'days').format();
      }

      var rangeinit = moment(vm.dateInit).format('YYYYMMDD');
      var rangeend = moment(vm.dateEnd).format('YYYYMMDD');

      if (rangeinit === 'Invalid date' || vm.initdate === null || rangeend === 'Invalid date' || vm.enddate === null) {
        vm.isopenreport = false;
      } else {
        vm.isopenreport = true;
      }
    }

    function getlists() {
      vm.listtypereport = [{
        'id': 1,
        'name': $filter('translate')('0432')
      },
      {
        'id': 2,
        'name': $filter('translate')('0321')
      },
      {
        'id': 3,
        'name': $filter('translate')('0473')
      },
      {
        'id': 4,
        'name': $filter('translate')('0415')
      }
      ]

      vm.typereport = 1;

      vm.listsearchby = [{
        'id': 0,
        'name': $filter('translate')('0189')
      },
      {
        'id': 3,
        'name': $filter('translate')('0119')
      },
      {
        'id': 1,
        'name': $filter('translate')('0434')
      }

      ]

      vm.searchby = 0;

      vm.liststatetest = [{
        'id': 1,
        'name': $filter('translate')('0435')
      },
      {
        'id': 2,
        'name': $filter('translate')('0436')
      },
      {
        'id': 3,
        'name': $filter('translate')('0437')
      }
      ]

      vm.statetest = 1;
      vm.loadingdata = false;
    }

    function loaddata(type) {
      vm.loadingdata = true;
      vm.type = type;
      vm.report = true;
      var data = {
        'rangeType': vm.searchby,
        'init': moment(vm.dateInit).format('YYYYMMDD'),
        'end': moment(vm.dateEnd).format('YYYYMMDD'),
        'testState': vm.statetest,
        'demographics': [],
        'areas': [],
        'levels': [],
        'laboratories': [],
        'tests': [],
        'filterType': vm.typereport
      }
      for (var i = 0; i < vm.listgroup.length; i++) {
        if (vm.listgroup[i].filter1 === null || vm.listgroup[i].filter1 === undefined) {
          break;
        } else {
          switch (vm.listgroup[i].filter1) {
            case '2':
              if (vm.listgroup[i].filter2 === 1) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.areas.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 2) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.levels.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 3) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.laboratories.push(itemvalue.id)
                })
              } else if (vm.listgroup[i].filter2 === 5) {
                var item = {
                  'demographic': -11,
                  'demographicItems': [],
                  'origin': vm.listgroup[i].origin
                }

                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })
                data.demographics.push(item)
              } else {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.tests.push(itemvalue.id)
                })
              }
              break;
            case '1':
              if (vm.listgroup[i].filter2 !== null) {
                var item = {
                  'demographic': vm.listgroup[i].filter2,
                  'demographicItems': [],
                  'origin': vm.listgroup[i].origin
                }

                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })
                data.demographics.push(item)
              }
              break;
          }
        }
      }
      if (vm.itemordertype.id !== null) {
        var item = {
          'demographic': -4,
          'demographicItems': [vm.itemordertype.id],
        }
        data.demographics.push(item)
      }

      var canttest = ($filter('filter')(vm.listgroup, { filter1: '2', filter2: '!!' })).length;
      var cantdynamicdemographics = ($filter('filter')(vm.listgroup, {
        filter1: '1',
        filter2: '!!',
        field: 'codifiedId'
      })).length;
      var cantfixeddemographics = ($filter('filter')(vm.listgroup, {
        filter1: '1',
        filter2: '!!',
        field: '!codifiedId'
      })).length;

      var typeGroup = 0;

      if ((canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics === 0) ||
        (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
        (canttest === 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0)) {
          typeGroup = 1;
      } else if ((canttest > 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
        (canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0) ||
        (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics > 0)) {
        typeGroup = 2;
      } else {
        typeGroup = 3;
      }

      data.typeGroup = typeGroup;
      data.typeReport = vm.typereport;
      data.canttests = canttest;
      data.dynamicdemographics = cantdynamicdemographics;
      data.cantfixeddemographics = cantfixeddemographics;
      data.listgroup = vm.listgroup;

      return stadisticsDS.getgeneralStadisticsV2(data).then(function (resp) {
        if(Object.keys(resp.data).length > 0) {
          vm.dataall = resp.data.dataall;
          vm.printReport(resp.data.datareport);
        } else {
          vm.printReport([]);
        }
      },
      function (error) {
        vm.modalError(error);
      });
    }

    function getmonthrange(variables) {
      var initialmonth = moment(vm.dateInit);
      var finalmonth = moment(vm.dateEnd);
      if (moment(initialmonth).format('DD') > moment(finalmonth).format('DD')) {
        var cantday = moment(initialmonth).format('DD') - moment(finalmonth).format('DD');
        finalmonth = finalmonth.add(cantday, 'days');
        finalmonth._i = finalmonth._d;
      }
      var totalmonth = finalmonth.diff(initialmonth, 'months')
      variables.idmonth0 = moment(vm.dateInit).month();
      variables.nameidmonth0 = vm.getnameMonth(moment(vm.dateInit).month())
      for (var i = 1; i <= totalmonth; i++) {
        var idmonth = moment(vm.dateInit).add(i, 'months').month()
        variables['idmonth' + i] = idmonth;
        variables['nameidmonth' + i] = vm.getnameMonth(idmonth);
      }
    }

    function getnameMonth(month) {
      switch (month) {
        case 0:
          return $filter('translate')('0447')
          break;
        case 1:
          return 'Feb'
          break;
        case 2:
          return 'Mar'
          break;
        case 3:
          return $filter('translate')('0448')
          break;
        case 4:
          return 'May'
          break;
        case 5:
          return 'Jun'
          break;
        case 6:
          return 'Jul'
          break;
        case 7:
          return $filter('translate')('0449')
          break;
        case 8:
          return 'Sep'
          break;
        case 9:
          return 'Oct'
          break;
        case 10:
          return 'Nov'
          break;
        case 11:
          return $filter('translate')('0450')
          break;

      }
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var labelsreport = JSON.stringify($translate.getTranslationTable());
        labelsreport = JSON.parse(labelsreport);
        var parameterReport = {};
        parameterReport.datareport = vm.datareport;
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = labelsreport;
        parameterReport.type = vm.type;
        vm.ind = 1;
        vm.total = vm.datareport.length / 3;
        vm.porcent = 0;
        UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).show();
        var nIntervId;
        nIntervId = setInterval(vm.flasheaTexto, 200);
        reportadicional.reportRender(parameterReport).then(function (data) {
          UIkit.modal('#modalprogress', { bgclose: false, escclose: false, modal: false }).hide();
          vm.porcent = 0;
          clearInterval(nIntervId);
        });
        vm.report = false;
        vm.loadingdata = false;
      } else {
        UIkit.modal("#modalReportError").show();
        vm.pruebareport = false;
      }
    }

    function printReport(data) {
      if (data.length === 0) {
        vm.loadingdata = false;
        UIkit.modal('#modalReportError').show();
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var parameterReport = {};
        var datareport = '';
        if (data !== '') {
          datareport = data;
          var namegroups = [];
          for (var i = 0; i < vm.listgroup.length; i++) {
            if (vm.listgroup[i].filter1 !== null && vm.listgroup[i].filter2 !== null &&
              vm.listgroup[i].listvalues.length > 0) {
              namegroups.push(' ' + vm.listgroup[i].filter1name)
            }
          }

          vm.variables = {
            'group1name': vm.listgroup[0].filter1name,
            'group2name': vm.listgroup[1].field === null ? "-1" : vm.listgroup[1].filter1name,
            'group3name': vm.listgroup[2].field === null ? "-1" : vm.listgroup[2].filter1name,
            'group4name': vm.listgroup[3].field === null ? "-1" : vm.listgroup[3].filter1name,
            'typereport': vm.typereport,
            'entity': vm.nameCustomer,
            'abbreviation': vm.abbrCustomer,
            'rangeInit': moment(vm.dateInit).format(vm.formatDate.toUpperCase()),
            'rangeEnd': moment(vm.dateEnd).format(vm.formatDate.toUpperCase()),
            'rangeType': 0,
            'typeFilter': namegroups.toString(),
            'username': auth.userName,
            'date': moment().format(vm.formatDate.toUpperCase() + ', HH:mm:ss'),
            'allH': vm.dataall.allH,
            'allI': vm.dataall.allI,
            'allM': vm.dataall.allM,
            'allhitory': vm.dataall.allhitory,
            'allorder': vm.dataall.allorder,
            'allpatology': vm.dataall.allpatology,
            'allrepeat': vm.dataall.allrepeat,
            'alltest': vm.dataall.alltest
          }

          if (vm.typereport === 1) {
            vm.pathreport = '/Report/stadistics/generalStadistics/groupedStatistics.mrt';
          } else if(vm.typereport === 2) {
            vm.pathreport = '/Report/stadistics/generalStadistics/groupedStatisticsDetailed.mrt';
          } else if (vm.typereport === 3) {
            vm.getmonthrange(vm.variables);
            vm.pathreport = '/Report/stadistics/generalStadistics/yearStadistics.mrt'
          } else {
            vm.pathreport = '/Report/stadistics/generalStadistics/graphStatistics.mrt';
          }
        }
        vm.report = false;

        if (vm.typereport === 4) {
          datareport.forEach(function (value) {
            value.group2name = value.group2name === undefined ? " " : " - " + value.group2name;
            value.group3name = value.group3name === undefined ? " " : " - " + value.group3name;
            value.group4name = value.group4name === undefined ? " " : " - " + value.group4name;
          })
        }

        vm.datareport = datareport;

        vm.windowOpenReport();

        // parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
        // datareport = LZString.compressToUTF16(JSON.stringify(datareport));
        // localStorageService.set('parameterReport', parameterReport);
        // localStorageService.set('dataReport', datareport);
        // vm.loadingdata = false;
        // window.open('/viewreport/viewreport.html');
      }
      vm.report = false;
    }

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
      vm.getOrderType();
      vm.minDate1 = moment().subtract(730, 'days').format();
      vm.maxDate1 = moment().format();
      vm.maxDate2 = moment().add(730, 'days').format();
      vm.minDate2 = moment().format();
    }

    vm.isAuthenticate();
  }

})();
/* jshint ignore:end */
