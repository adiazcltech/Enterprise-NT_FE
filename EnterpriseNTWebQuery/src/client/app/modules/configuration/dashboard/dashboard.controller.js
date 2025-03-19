(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .filter("trust", ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('dashboardController', dashboardController);
  dashboardController.$inject = ['userDS', 'localStorageService',
    '$filter', 'moment', '$rootScope', 'orderDS', 'common', '$state', 'configurationDS', 'logger'
  ];

  function dashboardController(userDS, localStorageService,
    $filter, moment, $rootScope, orderDS, common, $state, configurationDS, logger) {

    var vm = this;
    vm.init = init;
    vm.title = 'Dashboard';
    $rootScope.NamePage = 'Dashboard';
    $rootScope.menu = true;
    vm.max = moment().format();
    vm.getseach = getseach;
    vm.getseachdate = getseachdate;
    vm.order = [];
    vm.documentType = [];
    vm.gettypedocument = gettypedocument;
    vm.keyselectpatientid = keyselectpatientid;
    vm.getseachtype = getseachtype;
    vm.loading = false;
    vm.keyselectname = keyselectname;
    vm.record = '';
    vm.isAuthenticate = isAuthenticate;
    vm.name1 = '';
    vm.name2 = '';
    vm.lastname = '';
    vm.surName = '';
    vm.listYear = [];
    vm.getListYear = getListYear;
    vm.searchOrderComplete = searchOrderComplete;
    vm.entryInit = '';
    vm.getOrderComplete = getOrderComplete;
    vm.clearcontrol = clearcontrol;
    vm.modalError = modalError;
    vm.message = false;
    vm.listselectTest = [];
    vm.getselectorder = getselectorder;
    vm.selectTest = selectTest;
    vm.currentTestTmp = [];
    vm.validorder = 0;
    vm.Orderorder = Orderorder;
    vm.getpathReport = localStorageService.get('PathFE');
    $rootScope.helpReference = '02.appointment/appointment.htm';
    vm.orderTests = [];
    vm.getDemographicsALL = getDemographicsALL;
    vm.Demographicskey = Demographicskey;
    vm.urlLIS = localStorageService.get('ServiciosLISUrl');
    vm.getlistReportFile = getlistReportFile;
    vm.getlistidiome = getlistidiome;
    vm.getlistidiome();
    vm.selectedOrder = '';
    vm.viewsmall = 1;
    vm.data = null;
    vm.currentNavItem = 'page1';
    function getlistReportFile() {
      if (location.href.search('http://localhost:3000') !== -1) {
        //Local
        var parameters = {
          pathReport: vm.getpathReport + '/src/client/Report/reportsandconsultations/reports',
          report: './src/client/Report'
        };
      } else {
        //publicación
        var parameters = {
          pathReport: vm.getpathReport + '/public/Report/reportsandconsultations/reports',
          report: './public/reports'
        };
      }
      configurationDS.getlistReportFile(parameters).then(function (response) {
        if (response.status === 200) {
          vm.listreports = response.data;
        } else {
          vm.listreports = [];
        }
      }, function (error) {
        return false;
      });
    }

    function getlistidiome() {
      if (vm.getpathReport !== '' && vm.getpathReport !== null) {
        var pathReport;
        if ($filter('translate')('0000') === 'es') {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-es.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-es.json';
          }
        } else {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-en.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-en.json';
          }
        }
        var parameters = {
          pathReport: pathReport,
        };
        vm.getlistReportFile();
        configurationDS.getlistidiome(parameters).then(function (response) {
          if (response.status === 200) {
            vm.lisIdiome = response.data;
          } else {
            vm.lisIdiome = [];
          }
        }, function (error) {
          return false;
        });
      } else {
        UIkit.modal('#modalvalidatedpath', { modal: false }).show()
      }
    }

    function Orderorder(a, b) {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      } else {
        if (a.name1 > b.name1) {
          return -1;
        } else if (a.name1 < b.name1) {
          return 1;
        } else {
          return 0;
        }
      }
    }

    function modalError(error) {
      vm.message = false;
      if (error.data !== null) {

        if (error.config.data.dateNumber === "Invalid date") {
          vm.message = true;
        } else {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      }

    }

    function clearcontrol() {
      vm.listYearorder.id = moment().year();
      vm.listYearname.id = moment().year();
      vm.listYearhistory.id = moment().year();
      vm.documentType.id = 0;
      vm.record = '';
      vm.name1 = '';
      vm.name2 = '';
      vm.lastname = '';
      vm.surName = '';
      vm.numberorden = '';
      vm.numberordensearch = '';
      vm.orderTests = [];
      vm.message = false;
      vm.currentTestTmp = [];
      vm.dateseach = null;
      vm.order = [];
      $("#pdf").contents().find("body").html('');
    }

    function getOrderComplete($event, control) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.numberorden.length < vm.cantdigit) {
          vm.numberorden = vm.numberorden === '' ? 0 : vm.numberorden;
          vm.numberordensearch = vm.listYearorder.id + (common.getOrderComplete(vm.numberorden, vm.orderdigit)).substring(4);
          vm.numberorden = vm.numberordensearch.substring(4);
          vm.searchOrderComplete();

        } else if (vm.numberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYearorder.id + vm.numberorden;
          vm.searchOrderComplete();
        }

      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }

    function searchOrderComplete() {
      vm.search = {
        'order': vm.numberordensearch
      }
      vm.getseach();
    }

    vm.searchsmall = searchsmall;
    function searchsmall() {
      if (vm.viewsmall === 1) {
        vm.getseachdate();
      } else if (vm.viewsmall === 2) {
        vm.getseachtype();
      } else if (vm.viewsmall === 3) {
        vm.keyselectname(1);
      } else if (vm.viewsmall === 4) {
        vm.getOrderComplete();
      }
    }

    function getListYear() {
      var dateMin = moment().year() - 4;
      var dateMax = moment().year();
      vm.listYear = [];
      vm.listYearorder = [];
      vm.listYearname = [];
      vm.listYearhistory = [];
      for (var i = dateMax; i >= dateMin; i--) {
        vm.listYear.push({
          'id': i,
          'name': i
        });
      }
      vm.listYearorder.id = moment().year();
      vm.listYearname.id = moment().year();
      vm.listYearhistory.id = moment().year();
      vm.gettypedocument();
      return vm.listYear;
    }

    function gettypedocument() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getdocumenttypes(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.documentType = removedocumentType(data);
          vm.documentType.id = 0;
        } else {
          vm.documentType = [{
            'id': 0,
            'name': 'Sin filtro'
          }]
          vm.documentType.id = 0;
        }
      },
        function (error) {
          vm.modalError(error);
        });

    }

    function removedocumentType(data) {
      var area = [{
        "id": 0,
        "name": 'Sin filtro'
      }]
      data.data.forEach(function (value, key) {
        if (value.id !== 0) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }

      });
      return area;
    }

    function keyselectpatientid($event) {
      vm.loading = true;
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        if (vm.record !== '' && vm.record !== undefined) {
          vm.search = {
            'documentType': vm.documentType.id,
            'patientId': vm.record,
            'year': vm.listYearhistory.id
          }
          vm.getseach();
        } else {
          vm.loading = false;
          logger.success($filter('translate')('0196'));
        }
      }
    }




    function keyselectname($event) {
      vm.loading = true;
      if ($event === 1) {
        var keyCode = 13;
      } else {
        var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      }

      if (keyCode === 13) {
        vm.loading = false;
        vm.name1 = vm.name1 === undefined ? '' : vm.name1.toUpperCase();
        vm.name2 = vm.name2 === undefined ? '' : vm.name2.toUpperCase();
        vm.lastname = vm.lastname === undefined ? '' : vm.lastname.toUpperCase();
        vm.surName = vm.surName === undefined ? '' : vm.surName.toUpperCase();
        if (vm.name1 === '' && vm.name2 === '' && vm.lastname === '' && vm.surName === '') {
          logger.success($filter('translate')('0197'));
        } else {
          vm.search = {
            'name1': vm.name1,
            'name2': vm.name2,
            'lastName': vm.lastname,
            'surName': vm.surName,
            'year': vm.listYearname.id
          }
          vm.getseach();
        }
      }
    }

    function getseachtype() {
      vm.loading = true;
      if (vm.record !== '' && vm.record !== undefined) {
        vm.search = {
          'documentType': vm.documentType.id,
          'patientId': vm.record,
          'year': vm.listYearhistory.id
        }
        vm.getseach();
      } else {
        vm.loading = false;
        logger.success($filter('translate')('0196'));
      }
    }

    function getseachdate() {
      vm.loading = true;
      if (vm.dateseach !== null) {
        vm.search = {
          'dateNumber': moment(vm.dateseach).format('YYYYMMDD')
        }
        vm.getseach();
      } else {
        logger.info($filter('translate')('0208'));
      }

    }

    function getseach() {
      vm.orderTests = [];
      vm.selectedOrder = '';
      vm.validorder = 0;
      vm.view = false;
      vm.order = [];
      vm.data = null;
      $("#pdf").contents().find("body").html('');
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return orderDS.getfilterorders(auth.authToken, vm.search).then(function (data) {
        vm.loading = false;
        if (data.status === 200) {
          vm.view = true;
          vm.order = data.data;
          vm.order.sort(vm.Orderorder);
        } else {
          logger.info($filter('translate')('0212'));
          vm.order = [];
          vm.view = true;
        }
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }

    vm.getselectordermini = getselectordermini;
    function getselectordermini(order) {
      vm.selectedOrder = order.order;
    }


    function getselectorder(order, type) {
      vm.typeprint = type;
      if (vm.typeprint === 1) {
        vm.data = null;
      } else {
        $("#pdf").contents().find("body").html('');
      }
      vm.selectedOrder = order.order;
      vm.currentTestTmp = [];
      vm.patient = order.patientIdDB;
      vm.patientname = order.name1 + ' ' + order.name2 + ' ' + order.lastName + ' ' + order.surName;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return orderDS.getordersresult(auth.authToken, order.order).then(function (data) {
        if (data.status === 200) {
          vm.dataorder = $filter("filter")(data.data, function (e) {
            return e.confidential !== true;
          })
          vm.currentTestTmp = vm.dataorder;
          vm.openreportpreliminary = true;
        }
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }

    function selectTest(test) {
      if (test.confidential == false) {
        if (test.isSelected) {
          vm.currentTestTmp.push(test);
        } else {
          vm.currentTestTmp = $filter('filter')(vm.currentTestTmp, {
            testId: '!' + test.testId
          });
        }
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

    //Método que devuelve la lista de demofgráficos
    function getDemographicsALL() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (parseInt(vm.demographicTitle) !== 0) {
        return configurationDS.getDemographicsALL(auth.authToken, vm.urlLIS).then(function (data) {
          vm.demographicTemplate = _.filter(data.data, function (v) {
            return v.id === parseInt(vm.demographicTitle);
          })[0];
          vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          vm.referenceDemographic = vm.demographicTemplate.name;

          if (parseInt(vm.demographicTitle) < 0) {
            switch (parseInt(vm.demographicTitle)) {
              case -1:
                vm.demographicTemplate.name = $filter('translate')('0198');
                vm.referenceDemographic = 'account';
                break; //Cliente
              case -2:
                vm.demographicTemplate.name = $filter('translate')('0199');
                vm.referenceDemographic = 'physician';
                break; //Médico
              case -3:
                vm.demographicTemplate.name = $filter('translate')('0200');
                vm.referenceDemographic = 'rate';
                break; //Tarifa
              case -4:
                vm.demographicTemplate.name = $filter('translate')('0201');
                vm.referenceDemographic = 'type';
                break; //Tipo de orden
              case -5:
                vm.demographicTemplate.name = $filter('translate')('0003');
                vm.referenceDemographic = 'branch';
                break; //Sede
              case -6:
                vm.demographicTemplate.name = $filter('translate')('0202');
                vm.referenceDemographic = 'service';
                break; //Servicio
              case -7:
                vm.demographicTemplate.name = $filter('translate')('0203');
                vm.referenceDemographic = 'race';
                break; //Raza
            }
            vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          }

        }, function (error) {
          vm.modalError();
        });
      } else {
        vm.demographicTemplate = null;
        vm.nameDemographic = 'reports';
      }
    }
    //Método que devuelve la lista de demofgráficos
    function Demographicskey() {
      if (vm.urlLIS !== '' && vm.urlLIS !== null) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return configurationDS.getDemographicskey(auth.authToken, vm.urlLIS, 'DemograficoTituloInforme').then(function (data) {
          if (data.status === 200) {
            vm.demographicTitle = data.data.value;
            vm.getDemographicsALL();
          }
        }, function (error) {
          vm.modalError();
        });
      } else {
        logger.success('debe configurar la URL del LIS');
      }
    }
    function init() {
      if (localStorageService.get('Enterprise_NT.authorizationData') !== null) {
        vm.Demographicskey();
        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.BusquedaOrden = localStorageService.get('BusquedaOrden');
        vm.BusquedaOrden = vm.BusquedaOrden === 'True' || vm.BusquedaOrden === 'true' ? true : false;
        vm.viewpatient = localStorageService.get('Enterprise_NT.authorizationData')
        vm.viewpatient = vm.viewpatient.type === 2 ? false : true;
        vm.Color = localStorageService.get('Color');
        vm.Historico = localStorageService.get('Historico');
        vm.Historico = vm.Historico === 'True' || vm.Historico === 'true' ? true : false;
        vm.HistoricoGrafica = localStorageService.get('HistoricoGrafica');
        vm.HistoricoGrafica = vm.HistoricoGrafica === 'True' || vm.HistoricoGrafica === 'true' ? true : false;
        vm.HistoricoCombinado = localStorageService.get('HistoricoCombinado');
        vm.HistoricoCombinado = vm.HistoricoCombinado === 'True' || vm.HistoricoCombinado === 'true' ? true : false;
        vm.orderdigit = localStorageService.get('DigitosOrden');
        vm.cantdigit = parseInt(vm.orderdigit) + 4;
        vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
        vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;
        vm.typedocument = localStorageService.get('ManejoTipoDocumento');
        vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
        vm.panicblock = localStorageService.get('BloqueaPanicos');
        if (!vm.viewpatient) {
          vm.search = {
            'dateNumber': null
          }
          vm.getseach();
        }
      }
      if ($filter('translate')('0000') === 'es') {
        kendo.culture("es-ES");
      } else {
        kendo.culture("en-US");
      }
      vm.getListYear();
    }
    vm.isAuthenticate();
  }
})();
