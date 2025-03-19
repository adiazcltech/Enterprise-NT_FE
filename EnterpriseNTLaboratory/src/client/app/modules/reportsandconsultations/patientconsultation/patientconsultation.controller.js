/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.patientconsultation')
    .controller('patientconsultationController', patientconsultationController);


  patientconsultationController.$inject = ['common', 'listedOrderDS', 'localStorageService', 'LZString', '$translate',
    '$filter', '$state', 'moment', '$rootScope', 'demographicDS', 'patientDS', 'reportadicional'
  ];

  function patientconsultationController(common, listedOrderDS, localStorageService, LZString, $translate,
    $filter, $state, moment, $rootScope, demographicDS, patientDS, reportadicional) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'patientconsultation';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0322');
    vm.generateFile = generateFile;
    vm.isOpenReport = true;
    $rootScope.helpReference = '04.reportsandconsultations/patientconsultation.htm';
    vm.ShowPopupError = false;
    vm.modalError = modalError;
    vm.pruebareport = false;
    vm.pruebareport1 = false;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
    vm.windowOpenReport = windowOpenReport;
    vm.ListOrder = [];
    vm.filterRange = '1';
    vm.rangeInit = '';
    vm.rangeEnd = '';
    vm.button = false;
    $rootScope.pageview = 3;
    vm.demographics = [];

    vm.getDemographicsHistory = getDemographicsHistory;
    vm.getPatientbydemographics = getPatientbydemographics;
    vm.loadingdata = false;

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
        var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
        localStorageService.set('parameterReport', parameterReport);
        localStorageService.set('dataReport', datareport);
        window.open('/viewreport/viewreport.html');
      } else {
        UIkit.modal('#modalReportError').show();
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var consult = {
        'rangeType': vm.filterRange,
        'init': vm.rangeInit,
        'end': vm.rangeEnd,
        'testFilterType': vm.numFilterAreaTest,
        'tests': vm.numFilterAreaTest === 1 ? vm.listAreas : vm.listTests
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listedOrderDS.getListedOrder(auth.authToken, consult).then(function (data) {
          if (data.status === 200) {
            vm.pruebareport1 = false
            vm.ListOrder = data.data.length === 0 ? [] : removeData(data);
          } else {
            vm.openreport = false;
            vm.datareport = [];
            vm.pruebareport1 = false;
            vm.windowOpenReport();
          }
        },
        function (error) {
          vm.modalError(error);
        });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.createdDate = moment(value.createdDate).format(vm.formatDate);
        value.patient.birthday = common.getAgeAsString(moment(value.patient.birthday).format(vm.formatDateAge), vm.formatDateAge);
        if (value.dateOfDeath !== undefined) {
          value.dateOfDeath = moment(value.dateOfDeath).format(vm.formatDate);
        }
        data.data[key].username = auth.userName;
        data.data[key].patient.orderNumber = value.orderNumber;
        data.data[key].patient.name2 = data.data[key].patient.name2 === undefined ? '' : data.data[key].patient.name2;
      });
      vm.datareport = data.data;
      vm.variables = {
        'rangeInit': vm.rangeInit,
        'rangeEnd': vm.rangeEnd,
        'rangeType': vm.filterRange,
        'username': auth.userName,
        'date': moment().format(vm.formatDateAge)
      }
      vm.pathreport = '/Report/reportsandconsultations/patientconsultation/patientconsultation.mrt';
      vm.openreport = false;
      vm.windowOpenReport();
    }

    function getDemographicsHistory() {
      var ListDemographics = [{
          'id': -1,
          'name': 'Telefono',
          'selected': false
        },
        {
          'id': -2,
          'name': 'Direccion',
          'selected': false
        }
      ]

      if (vm.manageweight = localStorageService.get('ManejoPeso') === 'True') {
        ListDemographics.push({
          'id': -3,
          'name': 'Peso',
          'selected': false
        })
      }

      if (vm.managesize = localStorageService.get('ManejoTalla') === 'True') {
        ListDemographics.push({
          'id': -4,
          'name': 'Talla',
          'selected': false
        })
      }

      if (vm.managerace = localStorageService.get('ManejoRaza') === 'True') {
        ListDemographics.push({
          'id': -5,
          'name': 'Raza',
          'selected': false
        })
      }

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsOrigin(auth.authToken, 'H').then(function (data) {
          if (data.status === 200) {
            vm.ListDemographicsHistory = ListDemographics.concat(data.data);
            vm.ListDemographicsHistory = _.orderBy(vm.ListDemographicsHistory, ['name'], ['asc']);
          } else {
            UIkit.modal('#logNoData').show();
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.modalError(error);
        });
    }

    function getPatientbydemographics(type) {
      vm.loadingdata = true;

      var selectsize = ($filter('filter')(vm.ListDemographicsHistory, {
        id: -4,
        selected: true
      })).length > 0;
      var selectweight = ($filter('filter')(vm.ListDemographicsHistory, {
        id: -3,
        selected: true
      })).length > 0;
      var selectrace = ($filter('filter')(vm.ListDemographicsHistory, {
        id: -5,
        selected: true
      })).length > 0;
      var selectphone = ($filter('filter')(vm.ListDemographicsHistory, {
        id: -1,
        selected: true
      })).length > 0;
      var selectaddress = ($filter('filter')(vm.ListDemographicsHistory, {
        id: -2,
        selected: true
      })).length > 0;

      var data = {
        'page': 100,
        'sizePage': 100,
        'demographics': vm.demographics,
        'email': true,
        'size': selectsize,
        'weight': selectweight,
        'race': selectrace,
        'phone': selectphone,
        'address': selectaddress,
        'demographicsQuery': []
      }
      data.demographicsQuery = vm.ListDemographicsHistory.filter(function (x) {
        return x.id > 0 && x.selected === true
      })

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return patientDS.getPatientbydemographics(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            data.data.forEach(function (valuedemographic, key) {
              if (selectsize) {
                valuedemographic.demographics.push({
                  'value': valuedemographic.size,
                  'demographic': ($filter('translate')('0239')).toUpperCase()
                })
              }
              if (selectweight) {
                valuedemographic.demographics.push({
                  'value': valuedemographic.weight,
                  'demographic': ($filter('translate')('0238')).toUpperCase()
                })
              }
              if (selectrace) {
                valuedemographic.demographics.push({
                  'value': valuedemographic.race.name,
                  'demographic': ($filter('translate')('0091')).toUpperCase()
                })
              }
              if (selectphone) {
                valuedemographic.demographics.push({
                  'value': valuedemographic.phone,
                  'demographic': ($filter('translate')('0188')).toUpperCase()
                })
              }
              if (selectaddress) {
                valuedemographic.demographics.push({
                  'value': valuedemographic.address,
                  'demographic': ($filter('translate')('0187')).toUpperCase()
                })
              }

              valuedemographic.lastUpdateDate = moment(valuedemographic.lastUpdateDate).format(vm.formatDateAge);
              valuedemographic.firstDate = moment(valuedemographic.firstDate).format(vm.formatDateAge);

              valuedemographic.birthday = moment(valuedemographic.birthday).format(vm.formatDateAge);

              var diagnosticvalue = '';
              if (valuedemographic.diagnostic.length !== 0) {
                valuedemographic.diagnostic.forEach(function (data, index) {
                  if (data.comment !== '') {
                    var comment = JSON.parse(data.comment).content;
                    comment.slice(1, comment.length - 1),
                      diagnosticvalue = comment + '</br>'
                  }
                });
                valuedemographic.diagnosticvalue = diagnosticvalue;
              }

            });
            var datareport = {};

            datareport.datareport = _.orderBy(data.data, ['lastName'], ['asc']);
            datareport.variables = {
              'username': auth.userName,
              'managedocumenttype': localStorageService.get('ManejoTipoDocumento') === 'True',
              'date': moment().format(vm.formatDateAge)
            }
            datareport.pathreport = '/Report/reportsandconsultations/patientconsultationbydemographics/patientconsultationbydemographics.mrt';
            vm.openreport = false;

            if (type === 'pdf') {
              reportadicional.exportReportPdf(datareport, 'Areas.xls')
            } else {
              reportadicional.exportReportExcel(datareport, 'Areas.xls')
            }
            vm.loadingdata = false;


          } else {
            UIkit.modal('#logNoData').show();
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.modalError(error);
        });

    }

    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function init() {
      vm.getDemographicsHistory()
    }

    vm.init();
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
