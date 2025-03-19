/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.indicator')
    .controller('IndicatorsController', IndicatorsController);
  IndicatorsController.$inject = ['localStorageService', 'listDS', 'indicatorsDS', 'ordertypeDS',
    '$filter', '$state', 'moment', '$rootScope', '$translate', 'reportadicional'];
  function IndicatorsController(localStorageService, listDS, indicatorsDS, ordertypeDS,
    $filter, $state, moment, $rootScope, $translate, reportadicional) {
    var vm = this;
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    var language = $filter('translate')('0000');
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'Indicators';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0037').toUpperCase();
    $rootScope.blockView = true;
    vm.clickFlange = clickFlange;
    vm.getOrderType = getOrderType;
    vm.jsonPrint = jsonPrint;
    vm.generateDataReport = generateDataReport;
    vm.variablesReport = variablesReport;
    vm.groupProfiles = true;
    vm.all = '-- ' + $filter('translate')('0353') + ' --';
    vm.generateFile = generateFile;
    vm.levelGroupReport = levelGroupReport;
    vm.typeGrouping = typeGrouping;
    vm.getLevel = getLevel;
    vm.getUser = getUser;
    vm.returnNameUser = returnNameUser;
    vm.returnNameReport = returnNameReport;
    vm.windowOpenReport = windowOpenReport;
    vm.flasheaTexto = flasheaTexto;
    vm.numFilterAreaTest = '1';
    $rootScope.helpReference = '05.Stadistics/indicators.htm';
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.abbrCustomer = localStorageService.get('Abreviatura')
    vm.nameCustomer = localStorageService.get('Entidad');
    $rootScope.pageview = 3;

    vm.modernBrowsers = [
      { id: 2, name: $filter('translate')('0289'), ticked: true },//Resultado
      { id: 4, name: $filter('translate')('0416'), ticked: true },//Preliminar
      { id: 5, name: $filter('translate')('0379'), ticked: true },//Validación
    ];


    vm.demosmask = "-110||-101||-102||-103||-109"
    // vm.saveExcel = saveExcel;
    $rootScope.$watch('ipUser', function () {
      vm.ipUser = $rootScope.ipUser;
    });
    function clickFlange(id) {
      vm.flange = id;
      vm.isOpenReport = false;
      vm.filterRange = id === 3 ? '0' : '1';
      vm.rangeInit = '';
      vm.rangeEnd = '';
      vm.numFilterAreaTest = 0;
      vm.listAreas = [];
      vm.listTests = [];
      vm.demographics = [];
      vm.demographicsOrderType = [];
      vm.isIndicator = 'true';
      vm.dataReport = [];
      vm.orientation = 'vertical';
      vm.progressPrint = false;
      vm.timeMinutes = 1;
      vm.formatDateTime = '';
      vm.modelOrderType.id = 0;
      vm.modelTypeGrouping.id = 0;
      vm.modelLevel.id = 0;
      vm.testState = '0';
      vm.groupProfiles = true;
      if (id === 2) {
        //vm.getUser();
      }
    }
    function getOrderType() {
      vm.listOrderType = [{ 'id': 0, 'name': vm.all }];
      vm.modelOrderType = [{ 'id': 0, 'name': vm.all }];
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listOrderType.push({ 'id': value.id, 'name': value.name });
            vm.modelOrderType.push({ 'id': value.id, 'name': value.name });
          });
        }
        return vm.listOrderType;
      });
    }
    function typeGrouping() {
      vm.listTypeGrouping = [{ 'id': 0, 'name': vm.all },
      { 'id': 1, 'name': $filter('translate')('0459') },
      { 'id': 3, 'name': $filter('translate')('0408') },
      { 'id': 4, 'name': $filter('translate')('0090') },
      { 'id': 5, 'name': $filter('translate')('0529') },
      { 'id': 6, 'name': $filter('translate')('0529') + '/' + $filter('translate')('0459') },
      { 'id': 8, 'name': $filter('translate')('0529') + '/' + $filter('translate')('0408') }];
      vm.modelTypeGrouping = [{ 'id': 0, 'name': vm.all }];
      vm.listTypeGrouping.forEach(function (value) {
        vm.modelTypeGrouping.push({ 'id': value.id, 'name': value.name });
      });
    }
    function getLevel() {
      vm.listLevel = [{ 'id': 0, 'name': vm.all }];
      vm.modelLevel = [{ 'id': 0, 'name': vm.all }];
      return listDS.getList(auth.authToken, 32).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listLevel.push({ 'id': value.id, 'name': $filter('translate')('0000') === 'esCo' ? value.esCo : value.enUSA });
            vm.modelLevel.push({ 'id': value.id, 'name': $filter('translate')('0000') === 'esCo' ? value.esCo : value.enUSA });
          });
        }
        return vm.listLevel;
      });
    }
    function getUser() {
      vm.listUsers = [];
      return listDS.getListUsers(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listUsers = data.data;
        }
      });
    }
    function returnNameUser(idUser) {
      if (idUser === undefined || idUser === 0 || vm.listUsers.length === 0) {
        return $filter('translate')('0314');
      } else {
        var user = _.filter(JSON.parse(JSON.stringify(vm.listUsers)), function (o) { return o.id === parseInt(idUser); });
        if (user) {
          return user.name + ' ' + user.lastName
        } else {
          return $filter('translate')('0314');
        }
      }
    }
    function jsonPrint() {
      var json = {};
      var filteredTestState = []

      var filteredTestState = [];
      if (Array.isArray(vm.listTestState) && vm.listTestState.length > 0) {
          for (var i = 0; i < vm.listTestState.length; i++) {
              filteredTestState.push(vm.listTestState[i].id);
          }
      }
      //json.listTestState = filteredTestState.length > 0 ? filteredTestState : null; // Enviar null si está vacío


      if (vm.isIndicator.toString() === 'true' && vm.flange === 1) {
        if (vm.modelOrderType.id == 0) {
          vm.demographicsOrderType = [];
          vm.demographics.forEach(function (value, key) {
            vm.demographicsOrderType.push(vm.demographics[key]);
          })
        } else {
          vm.demographicsOrderType = [];
          vm.demographics.forEach(function (value, key) {
            vm.demographicsOrderType.push(vm.demographics[key]);
          })
          vm.demographicsOrderType.push({ 'demographic': -4, 'demographicItems': [vm.modelOrderType.id] });
        }
        json = {
          'rangeType': vm.filterRange === '0' ? '3' : vm.filterRange === '1' ? '2' : vm.filterRange,
          'init': vm.rangeInit,
          'end': vm.rangeEnd,
          'tests': vm.listTests,
          'areas': vm.listAreas,
          'demographics': vm.demographicsOrderType
        };
      } else if (vm.isIndicator.toString() === 'false' && vm.flange === 1) {
        json = {
          'rangeType': vm.filterRange === '0' ? '3' : vm.filterRange,
          'init': vm.rangeInit,
          'end': vm.rangeEnd
        };
      } else if (vm.flange === 2) {

        var state = vm.outputBrowsers.length === 0 || vm.outputBrowsers.length === 3 ? null : vm.outputBrowsers;
        var filteredTestState = [];
        if (Array.isArray(state) && state.length > 0) {
            for (var i = 0; i < state.length; i++) {
                filteredTestState.push(state[i].id);
            }
        }
        json = {
          'rangeType': vm.filterRange === '0' ? '3' : vm.filterRange === '1' ? '2' : vm.filterRange,
          'init': vm.rangeInit,
          'listTestState': filteredTestState,
          'end': vm.rangeEnd,
          'tests': vm.listTests,
          'areas': vm.listAreas,
          'levels': vm.modelLevel.id === 0 ? [] : [vm.modelLevel.id],
          'demographics': vm.demographics
        };
      } else if (vm.flange === 3) {
        json = {
          'rangeType': vm.filterRange,
          'init': vm.rangeInit,
          'end': vm.rangeEnd,
          'demographics': vm.demographics,
          'opportunityTime': vm.timeMinutes,
          'testFilterType': vm.numFilterAreaTest,
          'tests': vm.numFilterAreaTest === 1 ? vm.listAreas : vm.listTests
        };
      }
      json.groupProfiles = vm.groupProfiles;
      var str_json = JSON.stringify(json);
      return json;
    }

    function levelGroupReport(level, value) {
      if (vm.demographics.length === 0) {
        if (level === 1) {
          return { 'id': value.service, 'code': value.serviceCode, 'name': value.serviceName, 'label': $filter('translate')('0090') }
        } else {
          return { 'id': null, 'code': null, 'name': null, 'label': '' }
        }
      }

      if (vm.demographics[level - 1] === undefined) {
        return { 'id': null, 'code': null, 'name': null, 'label': '' }
      }

      var filterDemographic = $filter('filter')(value.allDemographics, { idDemographic: parseInt(vm.demographics[level - 1].demographic) }, true)[0];
      switch (vm.demographics[level - 1].demographic) {
        case -1: return { 'id': value.account, 'code': value.accountCode, 'name': value.accountName, 'label': $filter('translate')('0085') }; break;//Cliente
        case -2: return { 'id': value.physician, 'code': value.physicianCode, 'name': value.physicianName, 'label': $filter('translate')('0086') }; break; //Médico
        case -3: return { 'id': value.rate, 'code': value.rateCode, 'name': value.rateName, 'label': $filter('translate')('0087') }; break; //Tarifa
        case -4: return { 'id': value.orderType, 'code': value.orderTypeCode, 'name': value.orderTypeName, 'label': $filter('translate')('0088') }; break; //Tipo de orden
        case -5: return { 'id': value.branch, 'code': value.branchCode, 'name': value.branchName, 'label': $filter('translate')('0003') }; break; //Sede
        case -6: return { 'id': value.service, 'code': value.serviceCode, 'name': value.serviceName, 'label': $filter('translate')('0090') }; break; //Servicio
        case -7: return { 'id': value.patient.race, 'code': value.patient.raceCode, 'name': value.patient.raceName, 'label': $filter('translate')('0091') }; break; //Raza
        case -10: return { 'id': value.patient.documentType, 'code': value.patient.documentTypeCode, 'name': value.patient.documentTypeName, 'label': $filter('translate')('0233') }; break; //Tipo de documento
        default: return {
          'id': filterDemographic === undefined ? null : filterDemographic.codifiedId,
          'code': filterDemographic === undefined ? null : filterDemographic.codifiedCode,
          'name': filterDemographic === undefined ? null : filterDemographic.codifiedName,
          'label': filterDemographic === undefined ? '' : filterDemographic.demographic
        };
      }

    }

    function generateDataReport(data) {
      var dataReport = [];

      vm.numOrders = vm.flange === 2 ? 0 : data.length.toString();
      vm.formatDateTime = vm.formatDate + ' HH:mm:ss';
      if (vm.flange !== 2) {
        if (vm.numOrders > 0) {
          data.forEach(function (value, key) {
            if (vm.flange === 3) {
              vm.formatDateTime = vm.formatDate + ' HH:mm:ss ';
              value.dateTime = moment(value.dateTime).format(vm.formatDateTime);
              if (data[key].allDemographics.length > 0) {
                data[key].allDemographics.forEach(function (value2) {
                  data[key]["demo_" + value2.idDemographic + "_name"] =
                    value2.demographic;
                  value["demo_" + value2.idDemographic + "_codifiedCode"] =
                    value2.codifiedCode;
                  data[key]["demo_" + value2.idDemographic + "_value"] =
                    value2.encoded === false
                      ? value2.notCodifiedValue
                      : value2.codifiedName;
                });
              }
              for (var i = 0; i < value.results.length; i++) {
                if (value.results[i].opportunityTimes.verifyDate !== null && value.results[i].opportunityTimes.verifyDate !== undefined) {
                  value.results[i].opportunityTimes.currentDate = moment(value.results[i].opportunityTimes.currentDate).format(vm.formatDateTime);
                  value.results[i].opportunityTimes.entryDate = moment(value.results[i].opportunityTimes.entryDate).format(vm.formatDateTime);


                  if (value.results[i].opportunityTimes.printDate !== undefined) {
                    value.results[i].opportunityTimes.printDate = moment(value.results[i].opportunityTimes.printDate).format(vm.formatDateTime);
                    value.results[i].opportunityTimes.printElapsedTime = value.results[i].opportunityTimes.printElapsedTime === undefined ? 0 : parseInt(value.results[i].opportunityTimes.printElapsedTime) < 0 ? "N/A" : "" + value.results[i].opportunityTimes.printElapsedTime;
                    value.results[i].opportunityTimes.timeVerificPrint = moment(value.results[i].opportunityTimes.printDate).diff(moment(value.results[i].opportunityTimes.verifyDate), 'minutes');
                  }
                  else {
                    value.results[i].opportunityTimes.printDate = "N/A"
                    value.results[i].opportunityTimes.timeVerificPrint = "N/A";
                  }

                  value.results[i].opportunityTimes.takeDate = moment(value.results[i].opportunityTimes.takeDate).format(vm.formatDateTime);


                  value.results[i].opportunityTimes.timeEntryTake = moment(value.results[i].opportunityTimes.takeDate).diff(moment(value.results[i].opportunityTimes.entryDate), 'minutes');
                  if (value.results[i].opportunityTimes.transportDate !== undefined) {
                    value.results[i].opportunityTimes.timeTakeTransport = moment(value.results[i].opportunityTimes.transportDate).diff(moment(value.results[i].opportunityTimes.takeDate), 'minutes');
                    value.results[i].opportunityTimes.timeTransportVerific = moment(value.results[i].opportunityTimes.verifyDate).diff(moment(value.results[i].opportunityTimes.transportDate), 'minutes');
                    value.results[i].opportunityTimes.transportDate = moment(value.results[i].opportunityTimes.transportDate).format(vm.formatDateTime);
                  }
                  else {
                    value.results[i].opportunityTimes.timeTakeTransport = "N/A";
                    value.results[i].opportunityTimes.timeTransportVerific = "N/A";
                    value.results[i].opportunityTimes.transportDate = "N/A";
                  }

                  if (value.results[i].opportunityTimes.printSampleDate !== undefined) {
                    value.results[i].opportunityTimes.timeEntryPrintSample = moment(value.results[i].opportunityTimes.printSampleDate).diff(moment(value.results[i].opportunityTimes.entryDate), 'minutes');
                    value.results[i].opportunityTimes.timePrintSampleVerifyDate = moment(value.results[i].opportunityTimes.verifyDate).diff(moment(value.results[i].opportunityTimes.printSampleDate), 'minutes');
                    value.results[i].opportunityTimes.printSampleDate = moment(value.results[i].opportunityTimes.printSampleDate).format(vm.formatDateTime);
                  }
                  else {
                    value.results[i].opportunityTimes.timeEntryPrintSample = "N/A";
                    value.results[i].opportunityTimes.timePrintSampleVerifyDate = "N/A";
                    value.results[i].opportunityTimes.printSampleDate = "N/A";
                  }

                  value.results[i].opportunityTimes.resultDate = moment(value.results[i].opportunityTimes.resultDate).format(vm.formatDateTime)
                  value.results[i].opportunityTimes.resultElapsedTime = value.results[i].opportunityTimes.resultElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.resultElapsedTime;
                  value.results[i].opportunityTimes.validDate = moment(value.results[i].opportunityTimes.validDate).format(vm.formatDateTime);
                  value.results[i].opportunityTimes.validElapsedTime = value.results[i].opportunityTimes.validElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.validElapsedTime;
                  value.results[i].opportunityTimes.verifyDate = moment(value.results[i].opportunityTimes.verifyDate).format(vm.formatDateTime);
                  value.results[i].opportunityTimes.verifyElapsedTime = value.results[i].opportunityTimes.verifyElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.verifyElapsedTime;
                  value.results[i].opportunityTimes.expiredTime = Math.abs(value.results[i].opportunityTimes.maxTime - value.results[i].opportunityTimes.elapsedTime);
                  value.results[i].opportunityTimes.isExpired = value.results[i].opportunityTimes.maxTime - value.results[i].opportunityTimes.elapsedTime <= 0 ? 1 : 0;
                  value.results[i].opportunityTimes.totalTime = moment(value.results[i].opportunityTimes.printDate).diff(moment(value.results[i].opportunityTimes.entryDate), 'minutes');

                  value.results[i].opportunityTimes.timeVerifyDateValidDate = moment(value.results[i].opportunityTimes.validDate).diff(moment(value.results[i].opportunityTimes.verifyDate), 'minutes');


                }
              }
              dataReport.push(value)
            } else {
              for (var i = 0; i < value.results.length; i++) {
                if (value.results[i].opportunityTimes.verifyDate !== null && value.results[i].opportunityTimes.verifyDate !== undefined) {
                  if (vm.flange !== 2) {
                    dataReport.push({
                      'orderNumber': value.orderNumber,
                      'orderTypeCode': value.orderTypeCode,
                      'orderTypeName': value.orderTypeName,
                      'branchCode': value.branchCode,
                      'branchName': value.branchName,
                      'serviceCode': value.serviceCode,
                      'serviceName': value.serviceName,
                      'rateCode': value.rateCode,
                      'rateName': value.rateName,
                      'dateTime': moment(value.dateTime).format(vm.formatDateTime),
                      'patientId': vm.isIndicator.toString() === 'true' && vm.flange === 1 ? value.results[i].opportunityTimes.patientId : value.patient.patientId,
                      'name1': value.patient.name1 !== undefined ? value.patient.name1 : null,
                      'name2': value.patient.name2 !== undefined ? value.patient.name2 : null,
                      'lastName': value.patient.lastName !== undefined ? value.patient.lastName : null,
                      'surName': value.patient.surName !== undefined ? value.patient.surName : null,
                      'codeArea': value.results[i].sectionCode,
                      'nameArea': value.results[i].sectionName,
                      'codeTest': value.results[i].code,
                      'nameTest': value.results[i].name,
                      'testState': value.results[i].testState,
                      'currentDate': moment(value.results[i].opportunityTimes.currentDate).format(vm.formatDateTime),
                      'entryDate': moment(value.results[i].opportunityTimes.entryDate).format(vm.formatDateTime),
                      'printDate': moment(value.results[i].opportunityTimes.printDate).format(vm.formatDateTime),
                      'printElapsedTime': value.results[i].opportunityTimes.printElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.printElapsedTime,
                      'resultDate': moment(value.results[i].opportunityTimes.resultDate).format(vm.formatDateTime),
                      'resultElapsedTime': value.results[i].opportunityTimes.resultElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.resultElapsedTime,
                      'validDate': moment(value.results[i].opportunityTimes.validDate).format(vm.formatDateTime),
                      'validElapsedTime': value.results[i].opportunityTimes.validElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.validElapsedTime,
                      'verifyDate': moment(value.results[i].opportunityTimes.verifyDate).format(vm.formatDateTime),
                      'verifyElapsedTime': value.results[i].opportunityTimes.verifyElapsedTime === undefined ? 0 : value.results[i].opportunityTimes.verifyElapsedTime,
                      'elapsedTime': value.results[i].opportunityTimes.elapsedTime,
                      'entryElapsedTime': value.results[i].opportunityTimes.entryElapsedTime,
                      'expectedTime': value.results[i].opportunityTimes.expectedTime,
                      'maxTime': value.results[i].opportunityTimes.maxTime,
                      'expiredTime': Math.abs(value.results[i].opportunityTimes.maxTime - value.results[i].opportunityTimes.elapsedTime),
                      'isExpired': value.results[i].opportunityTimes.maxTime - value.results[i].opportunityTimes.elapsedTime <= 0 ? 1 : 0,
                      'totalTime': moment(value.results[i].opportunityTimes.validDate).diff(moment(value.results[i].opportunityTimes.verifyDate), 'minutes'),

                      'levelGroupId1': vm.levelGroupReport(1, value).id,
                      'levelGroupCode1': vm.levelGroupReport(1, value).code,
                      'levelGroupName1': vm.levelGroupReport(1, value).name,
                      'levelGroupLabel1': vm.levelGroupReport(1, value).label,

                      'levelGroupId2': vm.levelGroupReport(2, value).id,
                      'levelGroupCode2': vm.levelGroupReport(2, value).code,
                      'levelGroupName2': vm.levelGroupReport(2, value).name,
                      'levelGroupLabel2': vm.levelGroupReport(2, value).label,

                      'levelGroupId3': vm.levelGroupReport(3, value).id,
                      'levelGroupCode3': vm.levelGroupReport(3, value).code,
                      'levelGroupName3': vm.levelGroupReport(3, value).name,
                      'levelGroupLabel3': vm.levelGroupReport(3, value).label,

                      'levelGroupId4': vm.levelGroupReport(4, value).id,
                      'levelGroupCode4': vm.levelGroupReport(4, value).code,
                      'levelGroupName4': vm.levelGroupReport(4, value).name,
                      'levelGroupLabel4': vm.levelGroupReport(4, value).label,
                    });

                  } else {
                    if (value.results[i].opportunityTimes.resultDate !== null && value.results[i].opportunityTimes.resultDate !== undefined) {
                      dataReport.push({
                        'orderNumber': value.orderNumber,
                        'orderTypeCode': value.orderTypeCode,
                        'orderTypeName': value.orderTypeName,
                        'branch': value.branch,
                        'branchCode': value.branchCode,
                        'branchName': value.branchName,
                        'service': value.service,
                        'serviceCode': value.serviceCode,
                        'serviceName': value.serviceName,
                        'physician': value.physician,
                        'physicianCode': value.physicianCode,
                        'physicianName': value.physicianName,
                        'account': value.account,
                        'accountCode': value.accountCode,
                        'accountName': value.accountName,
                        'rate': value.rate,
                        'rateCode': value.rateCode,
                        'rateName': value.rateName,
                        'dateTime': moment(value.dateTime).format(vm.formatDateTime),
                        'codeArea': value.results[i].sectionCode,
                        'nameArea': value.results[i].sectionName,
                        'codeTest': value.results[i].code,
                        'nameTest': value.results[i].name,
                        'testState': value.results[i].testState,
                        'levelComplex': value.results[i].levelComplex,
                        'currentDate': moment(value.results[i].opportunityTimes.currentDate).format(vm.formatDateTime),
                        'entryDate': value.results[i].opportunityTimes.entryDate,
                        'entryElapsedTime': value.results[i].opportunityTimes.entryElapsedTime !== undefined ? value.results[i].opportunityTimes.entryElapsedTime : 0,
                        'entryUser': value.results[i].opportunityTimes.entryUser,
                        'entryUserName': vm.returnNameUser(value.results[i].opportunityTimes.entryUser),
                        'printDate': value.results[i].opportunityTimes.printDate,
                        'printElapsedTime': value.results[i].opportunityTimes.printElapsedTime !== undefined ? value.results[i].opportunityTimes.printElapsedTime : 0,
                        'printUser': value.results[i].opportunityTimes.printUser,
                        'printUserName': vm.returnNameUser(value.results[i].opportunityTimes.printUser),
                        'resultDate': value.results[i].opportunityTimes.resultDate,
                        'resultElapsedTime': value.results[i].opportunityTimes.resultElapsedTime !== undefined ? value.results[i].opportunityTimes.resultElapsedTime : 0,
                        'resultUser': value.results[i].opportunityTimes.resultUser,
                        'resultUserName': vm.returnNameUser(value.results[i].opportunityTimes.resultUser),
                        'validDate': value.results[i].opportunityTimes.validDate,
                        'validElapsedTime': value.results[i].opportunityTimes.validElapsedTime !== undefined ? value.results[i].opportunityTimes.validElapsedTime : 0,
                        'validUser': value.results[i].opportunityTimes.validUser,
                        'validUserName': vm.returnNameUser(value.results[i].opportunityTimes.validUser),
                        'verifyDate': value.results[i].opportunityTimes.verifyDate,
                        'verifyElapsedTime': value.results[i].opportunityTimes.verifyElapsedTime !== undefined ? value.results[i].opportunityTimes.verifyElapsedTime : 0,
                        'verifyUser': value.results[i].opportunityTimes.verifyUser,
                        'verifyUserName': vm.returnNameUser(value.results[i].opportunityTimes.verifyUser),
                        'elapsedTime': value.results[i].opportunityTimes.elapsedTime,
                        'expectedTime': value.results[i].opportunityTimes.expectedTime,
                        'maxTime': value.results[i].opportunityTimes.maxTime
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
      else {
        var dataReport = {
          "generalOpportunityArea": data.generalOpportunityArea,
          "generalOpportunityServices": data.generalOpportunityServices,
          "generalOpportunityTest": data.generalOpportunityTest,
          "generalOpportunityUser": data.generalOpportunityUser,
          "generalOpportunityUserArea": [],
          "generalOpportunityUserTest": [],
        }
        /* dataReport.generalOpportunityArea = _.map(dataReport.generalOpportunityArea, function square(n) {
          n.totalTestTransportValid = n.totalTestTransport === 0;
          n.totalTestPrintValid = n.totalTestPrintValid === 0;
          n.totalTestPrintValid = n.totalTestPrint === 0;
          n.totalTestTransport = n.totalTestTransport === 0 ? 1 : n.totalTestTransport;
          n.totalTestPrint = n.totalTestPrint === 0 ? 1 : n.totalTestPrint;
          return n;
        })
        dataReport.generalOpportunityServices = _.map(dataReport.generalOpportunityServices, function square(n) {
          n.totalTestTransportValid = n.totalTestTransport === 0;
          n.totalTestPrintValid = n.totalTestPrint === 0;
          n.totalTestTransport = n.totalTestTransport === 0 ? 1 : n.totalTestTransport;
          n.totalTestPrint = n.totalTestPrint === 0 ? 1 : n.totalTestPrint;
          return n;
        })
        dataReport.generalOpportunityTest = _.map(dataReport.generalOpportunityTest, function square(n) {
          n.totalTestTransportValid = n.totalTestTransport === 0;
          n.totalTestPrintValid = n.totalTestPrint === 0;
          n.totalTestTransport = n.totalTestTransport === 0 ? 1 : n.totalTestTransport;
          n.totalTestPrint = n.totalTestPrint === 0 ? 1 : n.totalTestPrint;
          return n;
        }) */

        dataReport.generalOpportunityUser.forEach(function (value) {
          var user = _.filter(JSON.parse(JSON.stringify(vm.listUsers)), function (o) {
            return o.id === parseInt(value.nameUser)
          })[0]
         /*  value.totalTestTransportValid = value.totalTestTransport === 0;
          value.totalTestPrintValid = value.totalTestPrint === 0;
          value.totalTestPrint = value.totalTestPrint === 0 ? 1 : value.totalTestPrint;
          value.totalTestTransport = value.totalTestTransport === 0 ? 1 : value.totalTestTransport; */
          value.nameUser = user.name + ' ' + user.lastName
        })

        for (var property in data.generalOpportunityUserArea) {
          data.generalOpportunityUserArea[property].forEach(function (value) {
            var user = _.filter(JSON.parse(JSON.stringify(vm.listUsers)), function (o) {
              return o.id === parseInt(property)
            })[0]
           /*  value.totalTestPrintValid = value.totalTestPrint === 0;
            value.totalTestTransportValid = value.totalTestTransport === 0;
            value.totalTestPrint = value.totalTestPrint === 0 ? 1 : value.totalTestPrint;
            value.totalTestTransport = value.totalTestTransport === 0 ? 1 : value.totalTestTransport; */
            value.nameUser = user.name + ' ' + user.lastName
            dataReport.generalOpportunityUserArea.push(value);
          })
        }

        for (var property in data.generalOpportunityUserTest) {
          data.generalOpportunityUserTest[property].forEach(function (value) {
            var user = _.filter(JSON.parse(JSON.stringify(vm.listUsers)), function (o) {
              return o.id === parseInt(property)
            })[0]
            /* value.totalTestPrintValid = value.totalTestPrint === 0;
            value.totalTestTransportValid = value.totalTestTransport === 0;
            value.totalTestPrint = value.totalTestPrint === 0 ? 1 : value.totalTestPrint;
            value.totalTestTransport = value.totalTestTransport === 0 ? 1 : value.totalTestTransport; */
            value.nameUser = user.name + ' ' + user.lastName
            dataReport.generalOpportunityUserTest.push(value);
          })
        }
      }

      return dataReport;
    }

    function variablesReport() {
      var customer = vm.abbrCustomer + ' (' + vm.nameCustomer + ')'
      var rangeInit = vm.filterRange.toString() === '1' ? $filter('translate')('0073') + ': ' + vm.rangeInit : $filter('translate')('0075') + ': ' + moment(vm.rangeInit).format(vm.formatDate);
      var rangeEnd = vm.filterRange.toString() === '1' ? $filter('translate')('0074') + ': ' + vm.rangeEnd : $filter('translate')('0076') + ': ' + moment(vm.rangeEnd).format(vm.formatDate);

      vm.variables = {
        'customer': customer,
        'rangeInit': rangeInit,
        'rangeEnd': rangeEnd,
        'username': auth.userName,
        'now': moment().format(vm.formatDateTime),
        'countOrders': $filter('translate')('0100') + ': ' + vm.numOrders,
        'countTests': $filter('translate')('0101') + ': ' + vm.numTests
      }
      return vm.variables;
    }

    function returnNameReport() {
      switch (vm.modelTypeGrouping.id) {
        case 0: return 'averagetimeall.mrt'; break;
        case 1: return 'averagetimetest.mrt'; break;
        case 3: return 'averagetimearea.mrt'; break;
        case 4: return 'averagetimeservice.mrt'; break;
        case 5: return 'averagetimevaliduser.mrt'; break;
        case 6: return 'averagetimevalidusertest.mrt'; break;
        case 8: return 'averagetimevaliduserarea.mrt'; break
      }
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0 || (typeof (vm.datareport) === 'object' && vm.datareport !== null)) {
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
        vm.progressPrint = false;
      } else {
        vm.progressPrint = false;
        UIkit.modal("#modalReportError").show();
      }
    }

    function flasheaTexto() {
      vm.ind = vm.ind + 1;
      if (vm.ind === vm.total) {
        vm.total = vm.total + 10;
      }
      vm.porcent = Math.round((vm.ind * 100) / vm.total);
    }

    function generateFile(type) {
      vm.type = type;
      if (!vm.isOpenReport) { return }
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      var json = vm.jsonPrint();

      switch (vm.flange) {
        case 1: if (vm.isIndicator.toString() === 'true') {
          return indicatorsDS.getIndicators(auth.authToken, json).then(
            function (data) {
              vm.pathreport = '/Report/stadistics/indicators/indicators.mrt';
              vm.orientation = 'vertical';
              vm.datareport = vm.generateDataReport(data.data);
              vm.variables = vm.variablesReport();
              vm.openreport = false;
              vm.windowOpenReport();
            },
            function (error) {
              vm.modalError(error);
            }
          );
          break;

        } else {
          return indicatorsDS.getTracking(auth.authToken, json).then(function (data) {
            vm.pathreport = '/Report/stadistics/indicators/tracking.mrt';
            vm.orientation = 'vertical';
            vm.datareport = vm.generateDataReport(data.data);
            vm.variables = vm.variablesReport();
            vm.openreport = false;
            vm.windowOpenReport();
          }); break;
        }
        case 2:
          json.typeGrouping = vm.modelTypeGrouping.id;
          return indicatorsDS.getAverageTime(auth.authToken, json).then(function (data) {
            if (data.status === 200) {
              if (data.data.generalOpportunityUser.length === 0) {
                vm.message = $filter("translate")("0152");
                UIkit.modal("#logNoData").show();
                vm.progressPrint = false;
              }
              else {
                vm.pathreport = '/Report/stadistics/indicators/averagetime/averagetimeall.mrt'
                vm.orientation = 'horizontal';
                vm.datareport = vm.generateDataReport(data.data);
                vm.variables = vm.variablesReport();
                vm.windowOpenReport();
              }
            } else {
              vm.message = $filter("translate")("0152");
              UIkit.modal("#logNoData").show();
              vm.progressPrint = false;
            }
          },
            function (error) {
              vm.loading = false;
            }
          );


          break;
        case 3: return indicatorsDS.getOpportunityTime(auth.authToken, json).then(function (data) {
          if(data.status === 200) {
            vm.pathreport = '/Report/stadistics/indicators/opportunitytime.mrt';
            vm.orientation = 'horizontal';
            vm.datareport = vm.generateDataReport(data.data);
            vm.variables = vm.variablesReport();
            vm.openreport = false;
            vm.windowOpenReport();
          } else {
            vm.message = $filter("translate")("0152");
            UIkit.modal("#logNoData").show();
            vm.progressPrint = false;
          }
        }); break;
      }

    }

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      }
      else {
        vm.init();
      }
    }

    function init() {
      vm.getUser();
      vm.getOrderType();
      vm.typeGrouping();
      vm.getLevel();

      vm.clickFlange(1);
      vm.filterRange = '1';
      if (($filter('translate')('0000')) === 'esCo') {
        moment.locale('es');
      } else {
        moment.locale('en');
      }
    }
    vm.isAuthenticate();
  }

})();
/* jshint ignore:end */
