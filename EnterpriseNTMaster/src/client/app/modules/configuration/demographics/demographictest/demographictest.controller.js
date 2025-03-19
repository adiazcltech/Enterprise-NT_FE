(function () {
  'use strict';

  angular
    .module('app.demographictest')
    .controller('DemographicTestController', DemographicTestController)
    .controller('DependenceTestController1', DependenceTestController1)
  DemographicTestController.$inject = ['testDS', 'customerDS', 'physicianDS', 'ordertypeDS', 'branchDS', 'serviceDS', 'demographicDS', 'demographicsItemDS', 'demographicTestDS', 'configurationDS', '$stateParams', 'localStorageService', 'logger', 'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate', 'rateDS'
  ];

  function DemographicTestController(testDS, customerDS, physicianDS, ordertypeDS, branchDS, serviceDS, demographicDS, demographicsItemDS, demographicTestDS, configurationDS, $stateParams, localStorageService, logger, ModalService, $filter, $state, $rootScope, LZString, $translate, rateDS) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.area = $stateParams.area;
    vm.codeTest = $stateParams.codetest;
    vm.init = init;
    vm.title = 'Demographic Test';
    vm.sortReverse = false;
    vm.sortType = '';
    vm.selected = -1;
    vm.changeSearch = changeSearch;
    vm.getItemsDemographics = getItemsDemographics;
    vm.removeTest = removeTest;
    vm.getTests = getTests;
    vm.modalrequired = modalrequired;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.isAuthenticate = isAuthenticate;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.stateButton = stateButton;
    var auth;
    vm.loadingdata = true;
    vm.demographicdetail = [];
    vm.demographics = [];
    vm.requiredTests = false;
    vm.codeTest = ["code", "name", "selected"];
    vm.nameTest = ["name", "code", "selected"];
    vm.selectedTest = ["-selected", "+code", "+name"];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codeTest;
    vm.getCustomers = getCustomers;
    vm.removeCustomers = removeCustomers;
    vm.getPhysician = getPhysician;
    vm.removePhysician = removePhysician;
    vm.getRates = getRates;
    vm.removeRates = removeRates;
    vm.getOrderTypes = getOrderTypes;
    vm.removeOrderTypes = removeOrderTypes;
    vm.getBranches = getBranches;
    vm.removeBranches = removeBranches;
    vm.getServices = getServices;
    vm.removeServices = removeServices;
    vm.getDemographicById = getDemographicById;
    vm.getDemographicsItems = getDemographicsItems;
    vm.add = add;
    vm.save = save;
    vm.cancel = cancel;
    vm.listTestSelected = listTestSelected;
    vm.insert = insert;
    vm.get = get;
    vm.sortRelation = sortRelation;
    vm.validateItems = validateItems;
    vm.getById = getById;
    vm.orderTests = orderTests;
    vm.edit = edit;
    vm.update = update;

    //** Método que buscar una relación**//
    function changeSearch() {
      vm.selected = -1;
      vm.searchTests = '';
      if (vm.demographicdetail.id) {
        vm.demographicdetail = [];
        vm.demographics[0].value = null;
        vm.demographics[1].value = null;
        vm.demographics[2].value = null;
        vm.orderTests(null);
      }
      vm.stateButton('init');
    }

    function edit() {
      vm.stateButton('edit');
    }

    //** Metodo que obtiene la lista de pruebas seleccionadas de un grupo de demograficos**//
    function orderTests(data) {
      vm.listTests.forEach(function (value, key) {
        value.selected = false;
      });
      if (data) {
        data.forEach(function (value, key) {
          var test = _.find(vm.listTests, function (o) { return o.id === value; });
          if (test) {
            test.selected = true;
          }
        });
      }
    }

    /** Funcion consultar el detalle de una relacion.*/
    function getById(id, index, form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.demographicdetail = {};
      vm.loadingdata = true;
      form.$setUntouched();
      return demographicTestDS.getById(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.demographicdetail.id = data.data.id;

          if (data.data.idDemographic1 === parseInt(vm.demographics[0].id)) {
            vm.demographics[0].value = data.data.valueDemographic1;
          } else {
            vm.demographics[0].value = vm.demographics[0].items[0].id;
          }

          if(vm.demographics[1].id !== null) {
            if (data.data.idDemographic2 === parseInt(vm.demographics[1].id)) {
              vm.demographics[1].value = data.data.valueDemographic2;
            } else {
              vm.demographics[1].value = vm.demographics[1].items[0].id;
            }
          }

          if(vm.demographics[2].id !== null) {
            if (data.data.idDemographic3 === parseInt(vm.demographics[2].id)) {
              vm.demographics[2].value = data.data.valueDemographic3;
            } else {
              vm.demographics[2].value = vm.demographics[2].items[0].id;
            }
          }

          vm.orderTests(data.data.tests);
          vm.stateButton('update');
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedTest
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /** Funcion que valida si todos los demograficos ya tienen items para poder organizar las relaciones ya guardadas.*/
    function validateItems() {
      var validate = _.filter(vm.demographics, function(o) { return o.id !== null && o.items.length === 0; });
      if(validate.length === 0) {
        vm.get();
      }
    }

    /** Funcion que ordena los datos.*/
    function sortRelation(data) {
      data.data.forEach(function (value, key) {
        if (value.idDemographic1 !== parseInt(vm.demographics[0].id)) {
          value.idDemographic1 = vm.demographics[0].id;
          value.valueDemographic1 = vm.demographics[0].items[0].id;
        }
        value.demo1 = _.find(vm.demographics[0].items, function (o) { return o.id === value.valueDemographic1; });

        if(vm.demographics[1].id !== null) {
          if (value.idDemographic2 !== parseInt(vm.demographics[1].id)) {
            value.idDemographic2 = vm.demographics[1].id;
            value.valueDemographic2 = vm.demographics[1].items[0].id;
          }
          value.demo2 = _.find(vm.demographics[1].items, function (o) { return o.id === value.valueDemographic2; });
        }

        if(vm.demographics[2].id !== null) {
          if (value.idDemographic3 !== parseInt(vm.demographics[2].id)) {
            value.idDemographic3 = vm.demographics[2].id;
            value.valueDemographic3 = vm.demographics[2].items[0].id;
          }
          value.demo3 = _.find(vm.demographics[2].items, function (o) { return o.id === value.valueDemographic3; });
        }
      });
      return data.data;
    }

    /** Funcion que obtiene todos los datos.*/
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicTestDS.get(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.list = data.data.length === 0 ? data.data : vm.sortRelation(data);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /** Funcion para insertar los datos.*/
    function insert() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicTestDS.save(auth.authToken, vm.demographicdetail).then(function (data) {
        if (data.status === 200) {
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.get();
          vm.loadingdata = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.demographicdetail.user = auth;
      return demographicTestDS.update(auth.authToken, vm.demographicdetail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          vm.loadingdata = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /** Funcion que consulta que las pruebas que fueron seleccionadas.*/
    function listTestSelected() {
      var tests = [];
      vm.listTests.forEach(function (value, key) {
        if (value.selected === true) {
          tests.push(value.id);
        }
      });
      return tests;
    }

    function cancel(form) {
      form.$setUntouched();
      vm.loadingdata = false;
      vm.searchTests = '';
      if (vm.demographicdetail.id === null || vm.demographicdetail.id === undefined) {
        vm.demographicdetail = [];
        vm.demographics[0].value = null;
        vm.demographics[1].value = null;
        vm.demographics[2].value = null;
        vm.orderTests(null);
      } else {
        vm.getById(vm.demographicdetail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }

    /** Funcion que valida si el formulario es valido y si se debe crear o modificar .*/
    function save(form) {
      form.$setUntouched();
      vm.requiredTests = false;
      vm.demographicdetail.tests = vm.listTests.length === 0 ? [] : vm.listTestSelected();
      vm.demographicdetail.idDemographic1 = vm.demographics[0].id;
      vm.demographicdetail.valueDemographic1 = vm.demographics[0].value;
      vm.demographicdetail.idDemographic2 = vm.demographics[1].id;
      vm.demographicdetail.valueDemographic2 = vm.demographics[1].value;
      vm.demographicdetail.idDemographic3 = vm.demographics[2].id;
      vm.demographicdetail.valueDemographic3 = vm.demographics[2].value;
      if (!vm.demographicdetail.idDemographic1 || !vm.demographicdetail.valueDemographic1) {
        return false;
      }
      if (vm.demographicdetail.tests.length !== 0) {
        vm.searchTests = '';
        if (vm.demographicdetail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      } else {
        vm.requiredTests = true;
      }
    }

    function add(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.demographicdetail = {
        id: null,
        idDemographic1: '',
        idDemographic2: '',
        idDemographic3: '',
        tests: [],
        user: auth
      };
      vm.demographics[0].value = null;
      vm.demographics[1].value = null;
      vm.demographics[2].value = null;
      vm.orderTests(null);
      vm.sortReverse1 = false;
      vm.sortType1 = vm.codeTest;
      vm.stateButton('add');
      vm.searchTests = '';
    }

    function getDemographicsItems(demographic) {
      if(demographic.id) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return demographicsItemDS.getDemographicsItemsIddata(auth.authToken, demographic.id).then(function (data) {
          demographic.items = data.data;
          vm.validateItems();
        }, function (error) {
          vm.modalError(error);
        });
      }
    }

    function getDemographicById(demographic) {
      if(demographic.id) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return demographicDS.getDemographicsId(auth.authToken, demographic.id).then(function (data) {
          demographic.name = data.data.name;
        }, function (error) {
          vm.modalError(error);
        });
      }
    }

    function removeServices(data) {
      var service = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name
        };
        service.push(object);
      });
      return service;
    }

    function getServices(demographic) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getService(auth.authToken).then(function (data) {
        vm.dataServices = data.data.length === 0 ? data.data : removeServices(data);
        demographic.items = vm.dataServices;
        vm.validateItems();
      }, function (error) {
        vm.modalError(error);
      });
    }

    function removeBranches(data) {
      var branch = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name
        };
        branch.push(object);
      });
      return branch;
    }

    function getBranches(demographic) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranch(auth.authToken).then(function (data) {
        vm.dataBranches = data.data.length === 0 ? data.data : removeBranches(data);
        demographic.items = vm.dataBranches;
        vm.validateItems();
      }, function (error) {
        vm.modalError(error);
      });
    }

    function removeOrderTypes(data) {
      var orderType = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name
        };
        orderType.push(object);
      });
      return orderType;
    }

    function getOrderTypes(demographic) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.get(auth.authToken).then(function (data) {
        vm.dataOrderType = data.data.length === 0 ? data.data : removeOrderTypes(data);
        demographic.items = vm.dataOrderType;
        vm.validateItems();
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo para adicionar o eliminar datos de JSON**//
    function removeRates(data) {
      var rate = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name
        };
        rate.push(object);
      });
      return rate;
    }

    //** Metodo que consulta las tarifas**//
    function getRates(demographic) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.get(auth.authToken).then(function (data) {
        vm.dataRates = data.data.length === 0 ? data.data : removeRates(data);
        demographic.items = vm.dataRates;
        vm.validateItems();
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo para adicionar o eliminar datos de JSON**//
    function removePhysician(data) {
      var physician = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.lastName + " " + value.name
        };
        physician.push(object);
      });
      return physician;
    }

    //** Metodo que consulta los medicos**//
    function getPhysician(demographic) {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return physicianDS.get(auth.authToken).then(
        function (data) {
          vm.dataPhysician = data.data.length === 0 ? data.data : removePhysician(data);
          demographic.items = vm.dataPhysician;
          vm.validateItems();
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    //** Metodo para adicionar o eliminar datos de JSON**//
    function removeCustomers(data) {
      var customer = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name,
        };
        customer.push(object);
      });
      return customer;
    }

    //** Metodo que consulta los clientes**//
    function getCustomers(demographic) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomer(auth.authToken).then(function (data) {
        vm.dataCustomer = data.data.length === 0 ? data.data : removeCustomers(data);
        demographic.items = vm.dataCustomer;
        vm.validateItems();
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo que consulta los valores de los demograficos configurados**//
    function getItemsDemographics() {

      var demographics = localStorageService.get('ExamenesDemograficos');
      var demo1 = null;
      var demo2 = null;
      var demo3 = null;

      if(demographics !== null) {
        demographics = demographics.split(",");
        if(demographics[0]) {
          demo1 = demographics[0];
        }
        if(demographics[1]) {
          demo2 = demographics[1];
        }
        if(demographics[2]) {
          demo3 = demographics[2];
        }
      }

      vm.demographics = [
        {
          "id": demo1,
          "name": "",
          "items": [],
          "value": null
        },
        {
          "id": demo2,
          "name": "",
          "items": [],
          "value": null
        },
        {
          "id": demo3,
          "name": "",
          "items": [],
          "value": null
        }
      ];

      vm.demographics.forEach(function (value, key) {
        switch (value.id) {
          case "-1":
            value.name = $filter('translate')('0248');
            vm.getCustomers(value);
            break;
          case "-2":
            value.name = $filter('translate')('0225');
            vm.getPhysician(value);
            break;
          case "-3":
            value.name = $filter('translate')('0307');
            vm.getRates(value);
            break;
          case "-4":
            value.name = $filter('translate')('0133');
            vm.getOrderTypes(value);
            break;
          case "-5":
            value.name = $filter('translate')('0075');
            vm.getBranches(value);
            break;
          case "-6":
            value.name = $filter('translate')('0175');
            vm.getServices(value);
            break;
          default:
            vm.getDemographicById(value);
            vm.getDemographicsItems(value);
        }
      });
      vm.sortType = '0';
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeTest(data) {
      var test = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name,
          sample: value.sample.name,
          state: value.state
        };
        test.push(object);
      });
      return test;
    }

    //** Metodo que consulta la lista de examenes activos**//
    function getTests() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.listTests = [];
      return testDS.getTestArea(auth.authToken, 5, 1, 0).then(function (data) {
        vm.listTests = data.data.length === 0 ? data.data : removeTest(data);
        vm.listTests = $filter('orderBy')(vm.listTests, 'name');
        vm.loadingdata = false;
        if (vm.listTests.length === 0) {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError();
      });
    }

    //** Metodo que evalua los estados de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.demographicdetail.id === null || vm.demographicdetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.acoodionTests = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.acoodionTests = false;
        setTimeout(function () {
          document.getElementById(vm.demographics[0].name).focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.acoodionTests = true;
        setTimeout(function () {
          document.getElementById(vm.demographics[0].name).focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.acoodionTests = false;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.acoodionTests = true;
      }
    }

    //** Método para contruir el JSON para imprimir**//
    function generateFile() {
      var datareport = [];
      vm.filtered.forEach(function (value) {
        datareport.push({
          'id': value.id,
          'demo1value': value.demo1.name,
          'demo2value': value.demo2 === undefined ? '' : value.demo2.name,
          'demo3value': value.demo3 === undefined ? '' : value.demo3.name,
        });
      });
      if (vm.filtered.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          "demo1name": vm.demographics[0].name,
          "demo2name": vm.demographics[1].name,
          "demo3name": vm.demographics[2].name
        };
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/demographics/demographictest/demographictest.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
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

    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getTests();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que comprueba la existencia de áreas y examenes**//
    function modalrequired() {
      vm.loadingdata = false;
      if (vm.listTests.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'DependenceTestController1',
          inputs: {
            hideTest: vm.listTests.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }

    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
      vm.stateButton('init');
      vm.getItemsDemographics();
    }
    vm.isAuthenticate();
  }

  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceTestController1($scope, hideTest, close) {
    $scope.hideTest = hideTest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();
