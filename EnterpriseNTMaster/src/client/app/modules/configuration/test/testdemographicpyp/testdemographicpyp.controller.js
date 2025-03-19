(function () {
  'use strict';

  angular
    .module('app.testdemographicpyp')
    .controller('TestDemographicPyPController', TestDemographicPyPController)
    .controller('testdemographicpypdependenceController', testdemographicpypdependenceController);


  TestDemographicPyPController.$inject = ['testdemographicpypDS', 'demographicDS', 'demographicsItemDS', 'listDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function TestDemographicPyPController(testdemographicpypDS, demographicDS, demographicsItemDS, listDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'testdemographicpyp';
    vm.name = ['demographicItem.name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.codetest = ['code', 'abbr', 'name', 'selected'];
    vm.abbrtest = ['abbr', 'code', 'name', 'selected'];
    vm.nametest = ['name', 'code', 'abbr', 'selected'];
    vm.selectedtest = ['-selected', '+code', '+abbr', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
    vm.sortReverseTest = true;
    vm.selected = -1;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getDemographicsALL = getDemographicsALL;
    vm.getDemographicPyP = getDemographicPyP;
    vm.getDemographicsItemsAll = getDemographicsItemsAll;
    vm.getTest = getTest;
    vm.save = save;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.getListGender = getListGender;
    vm.getListunitAge = getListunitAge;
    vm.changeRange = changeRange;
    vm.changeSearch = changeSearch;
    vm.listest = [];
    var auth;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    /**Método para eliminar una columna de una tabla a partir de un objeto area */
    function removeData(data) {
      var listdata = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.tests.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.state;
        data.data.tests[key].seletedOrder = !value.selected;
        data.data.tests[key].username = auth.userName;
      });
      data.data.user.userName = auth.userName;
      listdata.push(data.data);
      return listdata;
    }
    /**Método cuando cambia el control dde buscar */
    function changeSearch() {
      vm.demograficoitem = null;
      vm.selected = -1;
      vm.listest = [];
      vm.gender = null;
      vm.unitAge = null;
      vm.minAge = 0;
      vm.maxAge = 0;
      vm.searchtest = '';
    }
    //** Metodo para consultar la llave de configuración del formato de fecha**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getListGender();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener todos los demograficos**//
    function getDemographicsALL() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
        data.data.forEach(function (value, key) {
          if (vm.configurationDemographicPyP == value.id) {
            switch (value.id) {
              case -1:
                vm.DemographicPyPname = $filter('translate')('0248');
                break;
              case -2:
                vm.DemographicPyPname = $filter('translate')('0225');
                break;
              case -3:
                vm.DemographicPyPname = $filter('translate')('0307');
                break;
              case -4:
                vm.DemographicPyPname = $filter('translate')('0133');
                break;
              case -5:
                vm.DemographicPyPname = $filter('translate')('0075');
                break;
              case -6:
                vm.DemographicPyPname = $filter('translate')('0175');
                break;
              case -7:
                vm.DemographicPyPname = $filter('translate')('0174');
                break;
              default:
                vm.DemographicPyPname = value.name;
            }

          }
        });
        vm.getDemographicsItemsAll();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para consultar la llave de configuración del demográfico PYP**//
    function getDemographicPyP() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'DemograficoPyP').then(function (data) {
        if (data.status === 200) {
          if (data.data.value === "0" || data.data.value === undefined || data.data.value === "") {
            vm.configurationDemographicPyP = -8;
          } else {
            vm.configurationDemographicPyP = data.data.value;
          }
          vm.getDemographicsALL();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener todos los item demograficos**//
    function getDemographicsItemsAll() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.configurationDemographicPyP).then(function (data) {
        vm.dataItemDemographics = data.data;
        vm.getTest(-1);
        vm.listest = [];
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para consultar una lista de exámenes por el id de item demográfico**//
    function getTest(id, name, index) {
      vm.loadingdata = true;
      vm.demograficoitem = id;
      vm.sortTypeTest = '';
      vm.demograficoitemname = name;
      vm.configurationDemographicPyP = vm.configurationDemographicPyP === undefined ? -8 : vm.configurationDemographicPyP;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testdemographicpypDS.getTestdemographicpyp(auth.authToken, id).then(function (data) {
        vm.listest = [];
        if (data.status === 200 && id > -1) {
          vm.selected = id;
          vm.gender = data.data.gender === 0 ? 42 : data.data.gender;
          if (data.data.unit === 0) {
            vm.unitAge = 1;
            vm.changeRange();
          } else {
            vm.unitAge = data.data.unit;
            vm.changeRange();
            vm.minAge = data.data.minAge;
            vm.maxAge = data.data.maxAge;
          }
          vm.listest = data.data.tests.length === 0 ? data.data : vm.removeData(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtest;
        }
        var numTest = data.data.tests === undefined ? 0 : data.data.tests.length;
        vm.modalrequired(numTest);
      }, function (error) {
        vm.modalError(error);
      });
    }
    /*Funcion que llena un combobox donde está la lista de géneros del examen o prueba.*/
    function getListGender() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 6).then(function (data) {
        vm.getListunitAge();
        if (data.status === 200) {
          vm.ListGender = data.data;
          vm.ListGender.splice(2, 1);
          vm.ListGender = $filter('orderBy')(vm.ListGender, 'esCo');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /**Funcion que llena un combobox donde está la unidad de tiempo: 1- Años, 2-Días.*/
    function getListunitAge() {
      vm.getDemographicPyP();
      var data = [{
          'value': 1,
          'text': $filter('translate')('0111')
        },
        {
          'value': 2,
          'text': $filter('translate')('0115')
        }
      ];
      vm.ListUnitAge = data;
      return data;
    }
    //** Método que cambia el rango cuando se selecciona una unidad de tiempo.**//
    function changeRange() {
      vm.valueMaxInit = vm.unitAge === 1 ? 70 : 300;
      vm.valueMinInit = 0; // vm.listest.tests.unitAge === 1 ? 1 : 0;
      vm.valueStartInit = 0; // vm.listest.tests.unitAge === 1 ? 1 : 0;
      vm.minAge = 0; // 2 - vm.listest.tests.unitAge;

      vm.valueMaxEnd = vm.unitAge === 1 ? 200 : 365;
      vm.valueMinEnd = vm.unitAge === 1 ? 2 : 1;
      vm.valueStartEnd = vm.unitAge === 1 ? 2 : 1;
      vm.maxAge = vm.unitAge === 1 ? 200 : 365;
      vm.loadingdata = false;
    }
    //** Método que actualiza los códigos de homologación de cada examen o prueba**//
    function save() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var listest = $filter('filter')(vm.listest[0].tests, {
        selected: true
      });
      var gender = $filter('filter')(vm.ListGender, {
        id: vm.gender
      })[0];
      if ($filter('translate')('0000') === 'esCo') {
        gender = gender.esCo;
      } else {
        gender = gender.enUsa;
      }

      var testDemographicPyP = {
        'id': vm.demograficoitem,
        'demographicItemName': vm.demograficoitemname,
        'gender': vm.gender,
        'unit': vm.unitAge,
        'nameGender': gender,
        'nameUnit': $filter('filter')(vm.ListUnitAge, {
          value: vm.unitAge
        })[0].text,
        'minAge': vm.minAge,
        'maxAge': vm.maxAge,
        'tests': listest,
        'user': {
          'id': auth.id
        }
      };
      return testdemographicpypDS.updateTestdemographicpyp(auth.authToken, testDemographicPyP).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = [];
      datareport = $filter('filter')(vm.listest[0].tests, {
        selected: true
      });
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'demographic': vm.DemographicPyPname,
          'demograficoitem': vm.demograficoitemname
        };
        vm.datareport = datareport;
        vm.pathreport = '/Report/configuration/test/testdemographicpyp/testdemographicpyp.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
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
    //** Método que valida la autenticación**//
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
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que valida la modal de los requeridos**//
    function modalrequired(numTests) {
      vm.loadingdata = false;
      if ((vm.dataItemDemographics.length === 0) || vm.configurationDemographicPyP === -8 || numTests === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "testdemographicpypdependenceController",
          inputs: {
            hideitemdemographics: vm.dataItemDemographics.length,
            configurationDemographicPyP: vm.configurationDemographicPyP,
            hidetest: numTests
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    /** funcion inicial que se ejecuta cuando se carga el modulo */
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function testdemographicpypdependenceController($scope, hideitemdemographics, configurationDemographicPyP, hidetest, close) {
    $scope.configurationDemographicPyP = parseInt(configurationDemographicPyP);
    $scope.hideitemdemographics = hideitemdemographics;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
