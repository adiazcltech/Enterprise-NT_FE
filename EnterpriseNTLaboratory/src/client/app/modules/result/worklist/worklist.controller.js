/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.worklist')
    .controller('WorkListController', WorkListController);


  WorkListController.$inject = ['localStorageService', 'worklistDS', 'worksheetsDS', 'branchDS', 'ordertypeDS',
    '$filter', '$state', 'moment', '$rootScope', '$translate', 'LZString'
  ];

  function WorkListController(localStorageService, worklistDS, worksheetsDS, branchDS, ordertypeDS,
    $filter, $state, moment, $rootScope, $translate, LZString) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'WorkList';
    $rootScope.menu = true;
    $rootScope.helpReference = '03.Result/worklist.htm';
    $rootScope.NamePage = $filter('translate')('0018').toUpperCase();
    $rootScope.blockView = true;
    vm.getPreviusWorkList = getPreviusWorkList;
    vm.getIdWorkSheet = getIdWorkSheet;
    vm.getWorkSheet = getWorkSheet;
    vm.getOrderType = getOrderType;
    vm.getWorkListDelete = getWorkListDelete;
    vm.openResetSequence = openResetSequence;

    vm.clickGenerateWorkList = clickGenerateWorkList;
    vm.getAge = getAge;
    $rootScope.pageview = 3;
    vm.jsonPrint = jsonPrint;
    vm.generateDataReport = generateDataReport;
    vm.variablesReport = variablesReport;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.isOpenReport = false;
    vm.progressPrint = false;
    vm.resultPending = 'true';
    vm.filterRange = '1';
    var auth = undefined;
    var language = $filter('translate')('0000');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.abbrCustomer = localStorageService.get('Abreviatura');
    vm.nameCustomer = localStorageService.get('Entidad');
    vm.generateType = 1;
    vm.getbranch = getbranch;

    $rootScope.$watch('ipUser', function () {
      vm.ipUser = $rootScope.ipUser;
    });


    function getbranch() {
      vm.branch = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchstate(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var all = {
            "id": -1,
            "name": $filter('translate')('0215')
          }
          vm.branch = $filter('orderBy')(data.data, 'name');
          vm.branch.unshift(all);
          vm.databranch = -1;
        }
      },
      function (error) {
        vm.modalError(error);
      });
    }


    function getAge(birthday) {
      var birthdate = moment(birthday);
      var today = moment();
      return today.diff(birthdate, 'years');
    }

    function clickGenerateWorkList(id) {
      if (vm.modelWorkSheet.id !== undefined) {
        if (id === 4) {
          var typeWorkSheet = vm.modelWorkSheet.type === 2 ? $filter('translate')('0018') : (vm.modelWorkSheet.microbiology ? $filter('translate')('0225') : $filter('translate')('0015'));
          vm.orientation = vm.modelWorkSheet.orientation === 2 || vm.modelWorkSheet.type == 1 || vm.modelWorkSheet.microbiology ? $filter('translate')('0222') : $filter('translate')('0223');

          var microbiology = vm.modelWorkSheet.microbiology ? $filter('translate')('0219') : $filter('translate')('0220');

          vm.infoWorkSheet1 = $filter('translate')('0161') + ': ' + typeWorkSheet + '.';
          vm.infoWorkSheet2 = $filter('translate')('0224') + ': ' + vm.orientation + '.';
          vm.orientation = vm.orientation.toLowerCase();

        }
        document.getElementById('new').checked = id === 1 || id === 4;
        document.getElementById('previous').checked = id === 2;
        document.getElementById('restart').checked = id === 3;
        vm.generateType = id === 4 ? 1 : id;
        vm.listSequence = [];
        vm.modelSequence = [];

        if (id === 1 || id === 4) {
          vm.datareport = [];
        }
        if (id === 2) {
          vm.getPreviusWorkList();
        } else if (id === 3) {
          UIkit.modal('#modalConfirmation').show();
        }
      }
    }

    // Méstodo que devuelve la lista de hojas de trabajo.
    function getWorkSheet() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worksheetsDS.getWorkSheet(auth.authToken).then(function (data) {
        vm.listWorkSheet = [];
        vm.modelWorkSheet = [];
        if (data.status === 200) {
          vm.listWorkSheet = data.data;
          vm.modelWorkSheet = data.data;
          vm.getbranch();
        }
      });

    }

    //Método que devuelve información de la hoja de trabajo seleccionada
    function getIdWorkSheet(id) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worksheetsDS.getIdWorkSheet(auth.authToken, id).then(function (data) {
        vm.dataWorkSheet = data.data;
      });
    }


    function getPreviusWorkList() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worklistDS.getWorkListSequence(auth.authToken, vm.modelWorkSheet.id).then(function (data) {
        if (data.status === 200 && vm.listSequence.length === 0) {
          data.data.forEach(function (value, key) {
            vm.listSequence.push({
              'id': value.number,
              'date': $filter('translate')('0226').substr(0, 3) + ' ' + value.number.toString() + ':  ' + moment(value.date).format(vm.formatDate + ' HH:mm:ss'),
              'dateShort': moment(value.date).format(vm.formatDate + ' HH:mm:ss')
            });
            vm.modelSequence.push({
              'id': value.number,
              'date': $filter('translate')('0226').substr(0, 3) + ' ' + value.number.toString() + ':  ' + moment(value.date).format(vm.formatDate + ' HH:mm:ss'),
              'dateShort': moment(value.date).format(vm.formatDate + ' HH:mm:ss')
            });

          })
        }
      });

    }


    //** Método que obtiene la lista de tipos de órdenes**//
    function getOrderType() {
      vm.listOrderType = [];
      vm.modelOrderType = [];
      vm.listOrderType.push({
        'id': 0,
        'name': '-- ' + $filter('translate')('0215') + ' --'
      });
      vm.modelOrderType.push({
        'id': 0,
        'name': '-- ' + $filter('translate')('0215') + ' --'
      });
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listOrderType.push({
              'id': value.id,
              'name': value.name
            });
            vm.modelOrderType.push({
              'id': value.id,
              'name': value.name
            });
          })
        }
        vm.modelOrderType.id = 0;
      });
    }


    function getWorkListDelete() {
      vm.clickGenerateWorkList(3);
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worklistDS.getWorkListDelete(auth.authToken, vm.modelWorkSheet.id).then(function (data) {
        if (data.length > 0) {
          vm.listOrderType = [];
          vm.modelOrderType = [];
        }
      });
    }

    function openResetSequence() {
      vm.clickGenerateWorkList(3);
      if (vm.generateType === 3) {
        ModalService.showModal({
          templateUrl: 'Confirmation.html',
          controller: 'ConfirmController'
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.execute === 'yes') {
              vm.getWorkListDelete();
            }

          });
        });
      }
    }

    function jsonPrint() {
      var json = {
        'rangeType': vm.filterRange,
        'resultPending': vm.resultPending === 'false',
        'init': vm.rangeInit,
        'workLists': [vm.modelWorkSheet.id],
        'end': vm.rangeEnd,
        'orderType': vm.modelOrderType.id === undefined ? 0 : vm.modelOrderType.id,
        'branch': vm.databranch
      };
      return json;
    }


    function generateDataReport(data) {
      var dataReport = [];
      vm.arrayOrders = [];
      if (data === '') return dataReport;
      if (data.orders.length > 0) {
        var sequence = data.group;
        data.orders.forEach(function (value, key) {
          var test = [];
          var positionStore = [];
          var rackStore = [];
          var testsNamesAbbr = [];
          var testsNamesAbbrOrder = [];
          var positionStoreOrder = [];
          var rackStoreOrder = [];

          var testsOrder = _.filter(value.tests, function(o) { return !o.worksheet; });

          if(testsOrder.length > 0 ) {
            testsNamesAbbrOrder = _.map(testsOrder, 'abbr');
            positionStoreOrder = _.map(testsOrder, 'positionStore');
            rackStoreOrder = _.map(testsOrder, 'rackStore');
          }

          for (var j = 0; j < 14; j++) {
            value.tests = _.orderBy(value.tests, ['abbr'], ['asc']);
            var valueposition = value.tests[j] === undefined ? '' : value.tests[j].positionStore === undefined ? '' : value.tests[j].positionStore;
            positionStore.push(valueposition);
            var valuerackStore = value.tests[j] === undefined ? '' : value.tests[j].rackStore === undefined ? '' : value.tests[j].rackStore;
            rackStore.push(valuerackStore);
            var element = {
              'abbr': value.tests[j] === undefined ? '' : value.tests[j].abbr,
              'selected':  value.tests[j] === undefined ? '' : (value.tests[j].selected === true  ? '____' : '')
            }
            var testAbbre = value.tests[j] === undefined ? '' : value.tests[j].abbr;
            testsNamesAbbr.push(testAbbre);
            test.push(element);
          }

          vm.arrayOrders.push(value.orderNumber);
          var countTest = vm.modelWorkSheet.type == 1 ? value.tests.length : 1;
          for (var i = 0; i < countTest; i++) {

            var allPositions = _.reject(positionStore, _.isEmpty);
            allPositions = allPositions.length > 0 ? allPositions.join() : '';

            var allRacks = _.reject(rackStore, _.isEmpty);
            allRacks = allRacks.length > 0 ? allRacks.join() : '';

            var alltestAbbr = _.reject(testsNamesAbbr, _.isEmpty);
            alltestAbbr = alltestAbbr.length > 0 ? alltestAbbr.join() : '';

            var alltestAbbrOrder = _.reject(testsNamesAbbrOrder, _.isEmpty);
            alltestAbbrOrder = alltestAbbrOrder.length > 0 ? alltestAbbrOrder.join() : '';

            var allPositionsOrder = _.reject(positionStoreOrder, _.isEmpty);
            allPositionsOrder = allPositionsOrder.length > 0 ? allPositionsOrder.join() : '';

            var allRacksOrder = _.reject(rackStoreOrder, _.isEmpty);
            allRacksOrder = allRacksOrder.length > 0 ? allRacksOrder.join() : '';

            dataReport.push({
              'group': sequence,
              'orderNumber': value.orderNumber,
              'testconcatabbr': value.testconcatabbr,
              'createdDate': moment(value.createdDate).format(vm.formatDate + ' HH:mm:ss'),
              'codeType': value.type.code,
              'nameType': value.type.name,
              'patientId': value.patient.patientId,
              'name1': value.patient.name1.toUpperCase(),
              'name2': value.patient.name2.toUpperCase(),
              'lastName': value.patient.lastName.toUpperCase(),
              'surName': value.patient.surName.toUpperCase(),
              'sex': language === 'esCo' ? value.patient.sex.esCo : value.patient.sex.enUsa,
              'birthday': moment(value.patient.birthday).format(vm.formatDate),
              'years': vm.getAge(value.patient.birthday).toString() + ' ' + $filter('translate')('0103'),
              'email': value.patient.email,
              'address': value.patient.address,
              'phone': value.patient.phone,
              'size': value.patient.size,
              'weight': value.patient.weight,
              'abbrDoc': value.patient.documentType.abbr,
              'nameDoc': value.patient.documentType.name,
              'miles': value.miles,
              'active': value.active,
              'codeTest': value.tests[i].code,
              'abbrTest': value.tests[i].abbr,
              'nameTest': value.tests[i].name,
              'testOrder': value.tests[i].selected ? '____' : '',
              'confidential': value.tests[i].confidential,
              'abbr0': test[0].abbr,
              'abbr1': test[1].abbr,
              'abbr2': test[2].abbr,
              'abbr3': test[3].abbr,
              'abbr4': test[4].abbr,
              'abbr5': test[5].abbr,
              'abbr6': test[6].abbr,
              'abbr7': test[7].abbr,
              'abbr8': test[8].abbr,
              'abbr9': test[9].abbr,
              'abbr10': test[10].abbr,
              'abbr11': test[11].abbr,
              'abbr12': test[12].abbr,
              'abbr13': test[13].abbr,
              'testOrder0': test[0].selected,
              'testOrder1': test[1].selected,
              'testOrder2': test[2].selected,
              'testOrder3': test[3].selected,
              'testOrder4': test[4].selected,
              'testOrder5': test[5].selected,
              'testOrder6': test[6].selected,
              'testOrder7': test[7].selected,
              'testOrder8': test[8].selected,
              'testOrder9': test[9].selected,
              'testOrder10': test[10].selected,
              'testOrder11': test[11].selected,
              'testOrder12': test[12].selected,
              'testOrder13': test[13].selected,
              'positionStore0': positionStore[0],
              'positionStore1': positionStore[1],
              'positionStore2': positionStore[2],
              'positionStore3': positionStore[3],
              'positionStore4': positionStore[4],
              'positionStore5': positionStore[5],
              'positionStore6': positionStore[6],
              'positionStore7': positionStore[7],
              'positionStore8': positionStore[8],
              'positionStore9': positionStore[9],
              'positionStore10': positionStore[10],
              'positionStore11': positionStore[11],
              'positionStore12': positionStore[12],
              'positionStore13': positionStore[13],
              'rackStore0': rackStore[0],
              'rackStore1': rackStore[1],
              'rackStore2': rackStore[2],
              'rackStore3': rackStore[3],
              'rackStore4': rackStore[4],
              'rackStore5': rackStore[5],
              'rackStore6': rackStore[6],
              'rackStore7': rackStore[7],
              'rackStore8': rackStore[8],
              'rackStore9': rackStore[9],
              'rackStore10': rackStore[10],
              'rackStore11': rackStore[11],
              'rackStore12': rackStore[12],
              'rackStore13': rackStore[13],
              'branch': value.branch,
              'service': value.service,
              'physician': value.physician,
              'account': value.account,
              'rate': value.rate,
              'allpositions': allPositions,
              'allRacks': allRacks,
              'alltestAbbr': alltestAbbr,
              'alltestAbbrOrder': alltestAbbrOrder,
              'allPositionsOrder': allPositionsOrder,
              'allRacksOrder': allRacksOrder,
              'externalId': value.externalId
            })

            if (value.allDemographics.length > 0) {
              value.allDemographics.forEach(function (value2) {
                dataReport[dataReport.length - 1]['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                dataReport[dataReport.length - 1]['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
              });
            }
          }

        });

      }
      return dataReport;
    }

    function variablesReport() {
      var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')'
      var rangeInit = vm.filterRange === '1' ? $filter('translate')('0073') + ': ' + vm.rangeInit : $filter('translate')('0075') + ': ' + moment(vm.rangeInit).format(vm.formatDate);
      var rangeEnd = vm.filterRange === '1' ? $filter('translate')('0074') + ': ' + vm.rangeEnd : $filter('translate')('0076') + ': ' + moment(vm.rangeEnd).format(vm.formatDate);
      if (vm.generateType === 2) {
        rangeInit = $filter('translate')('0073') + ': ' + Math.min.apply(null, vm.arrayOrders);
        rangeEnd = $filter('translate')('0074') + ': ' + Math.max.apply(null, vm.arrayOrders);
      }
      var Variables = [{
        'ACCOUNT': customer,
        'RANGE_INI': rangeInit, //Orden inicial o Fecha Inicial
        'RANGE_END': rangeEnd, //Orden final o Fecha final
        'TODAY': $filter('translate')('0325') + ': ' + (!document.getElementById('previous').checked ? moment().format(vm.formatDate + ' HH:mm:ss') : vm.modelSequence.dateShort),
        'SHEET': vm.modelWorkSheet.name, // Nombre de la hoja de trabajo seleccionada
        'ORDERTYPE': vm.modelOrderType.name, // Nombre de tipo de orden
        'USERNAME': localStorageService.get('Enterprise_NT.authorizationData').userName
      }];
      return Variables;
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variablesReport();
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
        var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
        localStorageService.set('parameterReport', parameterReport);
        localStorageService.set('dataReport', datareport);
        window.open('/viewreport/viewreport.html');
        vm.progressPrint = false;
      } else {
        UIkit.modal('#modalReportError').show();
        vm.progressPrint = false;
      }
    }

    function generateFile() {
      if ((!vm.isOpenReport && vm.generateType === 1) || (vm.modelSequence.id === undefined && vm.generateType === 2)) {
        return
      }
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      var json = vm.jsonPrint();
      vm.fileReport = '';
      switch (vm.generateType) {
        case 1:
          return worklistDS.getWorkListGenerate(auth.authToken, json).then(function (data) {
            if (data.status === 200) {
              if (vm.modelWorkSheet.type === 2) {
                if (vm.modelWorkSheet.orientation === 2) {
                  vm.fileReport = '/Report/post-analitic/worklist/worklistvertical.mrt';
                } else {
                  vm.fileReport = '/Report/post-analitic/worklist/worklisthorizontal.mrt';
                }
              } else {
                vm.fileReport = '/Report/post-analitic/worklist/worklisted.mrt';
              }
            }
            var datareport = vm.datareport === undefined ? 0 : vm.datareport.length;
            if (datareport === 0) {
              vm.pathreport = vm.fileReport;
              vm.datareport = vm.generateDataReport(data.data);
              vm.variablesreport = vm.variablesReport();
              vm.windowOpenReport();
            }
          });
          break;

        case 2:
          return worklistDS.getIdWorkList(auth.authToken, vm.modelSequence.id, vm.modelWorkSheet.id).then(function (data) {
            if (data.status === 200) {
              if (vm.modelWorkSheet.type === 2) {
                if (vm.modelWorkSheet.orientation === 2) {
                  vm.fileReport = '/Report/post-analitic/worklist/worklistvertical.mrt';
                } else {
                  vm.fileReport = '/Report/post-analitic/worklist/worklisthorizontal.mrt';
                }
              } else {
                vm.fileReport = '/Report/post-analitic/worklist/worklisted.mrt';
              }
            }
            vm.pathreport = vm.fileReport;
            vm.datareport = vm.generateDataReport(data.data);
            vm.variablesreport = vm.variablesReport();
            vm.windowOpenReport();
          });
          break;

      }

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
      vm.getWorkSheet();
      vm.getOrderType();
    }
    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */
