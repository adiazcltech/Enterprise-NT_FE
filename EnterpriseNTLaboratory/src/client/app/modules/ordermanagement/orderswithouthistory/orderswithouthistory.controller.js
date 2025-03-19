/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.orderswithouthistory')
    .controller('OrdersWithoutHistoryController', OrdersWithoutHistoryController);


  OrdersWithoutHistoryController.$inject = ['orderDS', 'orderentryDS', 'branchDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope'
  ];

  function OrdersWithoutHistoryController(orderDS, orderentryDS, branchDS,
    localStorageService, logger, $filter, $state, moment, $rootScope) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'OrdersWithoutHistory';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0252');
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.isOrderAutomatic = localStorageService.get('NumeroOrdenAutomatico') === 'True';
    vm.typeSave = vm.isOrderAutomatic ? 2 : 1;
    vm.digitsorder = localStorageService.get('DigitosOrden');
    vm.maxLength = localStorageService.get('DigitosOrden') + 8;
    vm.maxNumberOrder = Array(parseInt(vm.digitsorder) + 1).join('9');
    vm.byOrder = 'true';
    $rootScope.pageview = 3;
    vm.symbolCurrency = localStorageService.get('SimboloMonetario');
    vm.penny = localStorageService.get('ManejoCentavos') === 'True';
    vm.isAuxPhysicians = localStorageService.get('MedicosAuxiliares') === 'True';
    vm.totalAuxPhysicians = localStorageService.get('TotalMedicosAuxiliares') === null || localStorageService.get('TotalMedicosAuxiliares') === '' ? 0 : parseInt(localStorageService.get('TotalMedicosAuxiliares'));
    vm.orderTotal = 0;
    vm.stateControl = 5;
    vm.keyselectOrder = keyselectOrder;
    vm.days = 1;
    vm.quantity = 1;
    vm.entryInit = '';
    vm.entryEnd = '';
    vm.saveOrders = saveOrders;
    vm.newOrders = newOrders;
    vm.rate = rate;
    vm.listSuccess = [];
    vm.loadDemographicControls = loadDemographicControls;
    //Variables con directivas
    vm.selectedDate = new Date();
    vm.eventSelectDate = eventSelectDate;
    vm.orderDemosDisabled = {};
    vm.disabledDemo = disabledDemo;
    vm.disabledAllDemo = disabledAllDemo;
    vm.cleanAllDemos = cleanAllDemos;
    vm.disabledSave = true;
    vm.validateForm = validateForm;
    vm.listDataTest = new Array();
    vm.listDataTest.push([]);
    vm.listDataTest.push([]);
    vm.saveTest = false;
    vm.eventOrder = eventOrder;

    vm.staticDemoIds = {
      'patientDB': -99,
      'documentType': -10,
      'patientId': -100,
      'lastName': -101,
      'surName': -102,
      'name1': -103,
      'name2': -109,
      'sex': -104,
      'birthday': -105,
      'age': -110,
      'email': -106,
      'weight': -8,
      'size': -9,
      'race': -7,
      'orderDB': -998,
      'order': -107,
      'orderDate': -108,
      'orderType': -4,
      'rate': -3,
      'branch': -5,
      'service': -6,
      'account': -1,
      'physician': -2
    };
    vm.dataOrder = [];
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.init();

    $rootScope.helpReference = '01. LaboratoryOrders/orderswithouthistory.htm';

    function eventOrder(order) {
      vm.entryInit = order;
    }

    function keyselectOrder($event) {
      var dateNow = moment().format('YYYYMMDD');
      var dateOrder = dateNow;
      vm.entryInit = vm.entryInit === undefined ? document.getElementById('orderInit').value : vm.entryInit;
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {

        vm.orderValue = vm.entryInit;
        vm.maxLength = parseInt(vm.digitsorder) + 8;
        if (vm.orderValue.length === parseInt(vm.digitsorder)) {
          vm.entryInit = dateOrder + vm.orderValue;

        } else if (vm.orderValue.length < vm.digitsorder) {
          var repeat = parseInt(vm.digitsorder) - vm.orderValue.length;
          var ceros = '';
          for (var i = 0; i < repeat; i++) {
            ceros = ceros + '0';
          }
          vm.orderValue = dateOrder + ceros + vm.orderValue.toString();

          if (repeat > 0) {
            vm.orderValue = ceros === '0000' ? parseInt(vm.orderValue) + 1 : vm.orderValue;
            vm.entryInit = vm.orderValue;
          }
        } else if (vm.orderValue.length > vm.digitsorder && vm.orderValue.length !== 8 + parseInt(vm.digitsorder)) {
          var repeat = parseInt(vm.digitsorder) - 1;
          var ceros = '';
          for (var i = 0; i < repeat; i++) {
            ceros = ceros + '0';
          }
          if (repeat > 0) {
            // if (numObj === 1) {
            vm.entryInit = dateOrder + ceros + '1';
            // }
          }
        }

      } else {
        vm.maxLength = parseInt(vm.digitsorder);
        var expreg = new RegExp(/^[0-9]+$/);
        if (!expreg.test(String.fromCharCode(keyCode))) {
          //detener toda accion en la caja de texto   $event === undefined &&
          $event.preventDefault();
        }
      }
      vm.orderDemosValues[-107] = vm.entryInit.toString().substr(4);
      vm.disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds["order"], true);
    }

    function eventSelectDate(date) {
      vm.selectedDate = date;
    }

    function rate() {
      if (vm.dataOrder === undefined) {
        return 0;
      } else {
        if (($filter('filter')(vm.dataOrder, {
          id: -3
        }, true))[0] !== undefined) {
          var id = ($filter('filter')(vm.dataOrder, {
            id: -3
          }, true))[0].value.id;
          if (id === undefined) {
            return 0
          } else {
            return id;
          }
        } else {
          return 0
        }

      }
    }

    /**
    * Carga en los controles de paciente y ordenes los demograficos configurados
    */
    function loadDemographicControls() {
      //Carga la orden
      var orderDemosValues = {};
      var orderDemosDisabled = {};
      var index = 1;
      orderentryDS.getDemographics(auth.authToken, 'O').then(
        function (response) {
          response.data.forEach(function (value, key) {
            if (value.id === vm.staticDemoIds['orderDate']) {
              index--;
            }
            value.tabIndex = index;
            value.name = ($filter('translate')(value.name)).toLowerCase();
            value.format = value.format === undefined || value.format === '' ? '' : value.format;
            if (value.format !== undefined && value.format !== '') {
              if (value.format.search("DATE") === -1) {
                value.date = false;
              } else {
                value.date = true;
                value.format = value.format.slice(5);
              }
            }
            value.showRequired = false;
            value.idOrigin = '|' + value.id + 'O';
            orderDemosValues[value.id] = '';
            orderDemosDisabled[value.id] = true;
            if (value.encoded) {
              var itemsdefault = '';
              var viewdefault = false;
              value.items.forEach(function (item, indexItem) {
                item.idDemo = value.id;
                item.showValue = item.code === undefined ? '' : (item.code + '. ' + item.name).toUpperCase();
                if (item.defaultItem) {
                  itemsdefault = item;
                  viewdefault = true;
                }
              });
              value.itemsdefault = itemsdefault;
              value.viewdefault = viewdefault;
            }
            if (value.id === vm.staticDemoIds['rate']) {
              vm.rates = value.items;
            }
            index++;
          });

          vm.dataOrder = response.data;

          if(vm.isAuxPhysicians) {
            var indexPhysician = _.findIndex(vm.dataOrder, function(o) { return o.id === -2; });
            var physician = indexPhysician > -1 ? vm.dataOrder[indexPhysician] : null;

            var items = physician !== null && physician !== undefined ? JSON.parse(JSON.stringify(physician.items)) : [];

            for( var i = 1 ; i <= vm.totalAuxPhysicians ; i++) {

              var idAuxPhysician = parseInt("" + -20 + i);

              items.forEach( function (value) {
                value.idDemo = idAuxPhysician
              });

              vm.dataOrder.splice(indexPhysician + i, 0, {
                id: idAuxPhysician,
                name: $filter('translate')('1900') + " " + i,
                items: JSON.parse(JSON.stringify(items)),
                encoded: true,
                idOrigin: '|' + idAuxPhysician + 'O'
              });

              orderDemosDisabled[idAuxPhysician] = true;
              orderDemosValues[idAuxPhysician] = '';
            }
          }

          vm.orderDemosValues = orderDemosValues;
          vm.orderDemosDisabled = orderDemosDisabled;
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
    }

    /**
     * Valida que el ingreso esta correcto para guardar la orden
     */
    function validateForm() {
      var fieldsComplete = true;
      vm.dataOrder.forEach(function (demo, index) {
        demo.showRequired = false;
        if (demo.obligatory === 1) {
          if (vm.orderDemosValues.hasOwnProperty(demo.id)) {
            if (demo.encoded) {
              if (typeof vm.orderDemosValues[demo.id] !== 'object') {
                demo.showRequired = true;
                fieldsComplete = false;
              } else {
                if (!vm.orderDemosValues[demo.id].hasOwnProperty("id")) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                } else if (vm.orderDemosValues[demo.id].id === undefined) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              }
            } else {
              if (demo.id === -107) {
                if (vm.orderDemosValues[-4].id === 4) { } else if (vm.orderDemosValues[demo.id] === undefined || vm.orderDemosValues[demo.id].toString().trim() === '') {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              } else if (demo.date === true && vm.orderDemosValues[demo.id] !== null && demo.date === true && vm.orderDemosValues[demo.id] !== '') { } else if (demo.date === true && vm.orderDemosValues[demo.id] === null || demo.date === true && vm.orderDemosValues[demo.id] === '' || demo.date === true && vm.orderDemosValues[demo.id] === 'Invalid date') {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (vm.orderDemosValues[demo.id] === undefined || vm.orderDemosValues[demo.id].toString().trim() === '') {
                demo.showRequired = true;
                fieldsComplete = false;
              }
            }
          }
        }
      });
      if (fieldsComplete) {
        vm.orderDemosDisabled = vm.disabledAllDemo(vm.orderDemosDisabled, true);
        vm.disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds['orderDate'], true);
      }
      return fieldsComplete;
    }


    function saveOrders() {
      if (validateForm()) {
        if (vm.listDataTest[0].length === 0) {
          logger.warning($filter('translate')('0662'));
          vm.disabledSave = false;
          return false;
        }

        if (vm.byOrder === 'false' && !vm.isOrderAutomatic && !vm.entryInit) {
          return false;
        }

        vm.loadingdata = true;
        var init = vm.entryInit === '' || vm.entryInit === Infinity ? 0 : vm.entryInit;
        var quantity = vm.quantity;
        if (vm.byOrder === 'true') {
          init = vm.typeSave === 1 ? moment().format('YYYY') + vm.orderDemosValues[-107] : 0;
          quantity = 1;
        }
        vm.demographics = [];
        vm.dataOrder.forEach(function (value) {
          if (vm.orderDemosValues.hasOwnProperty(value.id) && value.id > 0 || ( value.id === -201 || value.id === -202 || value.id === -203 ||value.id === -204 || value.id === -205)) {
            if (value.encoded) {
              if (typeof vm.orderDemosValues[value.id] === 'object' && vm.orderDemosValues[value.id].hasOwnProperty('id')) {
                vm.demographics.push({
                  'idDemographic': value.id,
                  'encoded': value.encoded,
                  'codifiedId': vm.orderDemosValues[value.id].id
                });
              }
            } else {
              if (value.date === true) {
                if (vm.orderDemosValues[value.id] !== '') {
                  var format = value.format === '' ? vm.formatDate.toUpperCase() : value.format.toUpperCase();
                  vm.orderDemosValues[value.id] = moment(vm.orderDemosValues[value.id]).format(format);
                }
              }
              if (value.id === vm.staticDemoIds['order']) {
                order.orderNumber = (vm.orderDemosValues[value.id] !== undefined && vm.orderDemosValues[value.id] !== '' ? vm.orderDemosValues[value.id] : null);
              } else if (value.id === vm.staticDemoIds['orderDate']) {
                order.date = '';
              } else {
                if (vm.orderDemosValues[value.id] !== undefined && vm.orderDemosValues[value.id].trim() !== '') {
                  vm.demographics.push({
                    'idDemographic': value.id,
                    'encoded': false,
                    'notCodifiedValue': vm.orderDemosValues[value.id],
                    'codifiedId': ''
                  });
                } else {
                  vm.demographics.push({
                    'idDemographic': value.id,
                    'encoded': false,
                    'notCodifiedValue': '',
                    'codifiedId': ''
                  });
                }
              }
            }
          }

        });

        var auxiliaryPhysicians = [];
        //Médicos Auxiliares
        if(vm.isAuxPhysicians) {
          var indexes = [-201, -202, -203, -204, -205];
          var listPhysicians = _.chain(vm.demographics).keyBy('idDemographic').at(indexes).value();
          listPhysicians.forEach(function(value) {
            if(value !== undefined && value.codifiedId !== null && value.codifiedId !== undefined && value.codifiedId !== '') {
              auxiliaryPhysicians.push({
                id: value.codifiedId
              });
            }
          });
          indexes.forEach(function(value) {
            var indexDemo = _.findIndex(vm.demographics, function(o) { return o.idDemographic === value; });
            if(indexDemo > -1)  vm.demographics.splice(indexDemo, 1);
          });
        }


        var json = {
          'orderNumber': init,
          'createdDateShort': moment().format('YYYYMMDD'),
          'type': {
            'id': vm.orderDemosValues[-4].id,
            'code': vm.orderDemosValues[-4].code
          },
          'patient': {
            'id': 0,
            'patientId': '0',
            'demographics': []
          },
          'homebound': false,
          'miles': 0,
          'active': true,
          'branch': {
            'id': vm.orderDemosValues[-5] !== undefined ? vm.orderDemosValues[-5].id : null
          },
          'account': {
            'id': vm.orderDemosValues[-1] !== undefined ? vm.orderDemosValues[-1].id : null
          },
          'physician': {
            'id': vm.orderDemosValues[-2] !== undefined ? vm.orderDemosValues[-2].id : null
          },
          'rate': {
            'id': vm.orderDemosValues[-3] !== undefined ? vm.orderDemosValues[-3].id : null
          },
          'service': {
            'id': vm.orderDemosValues[-6] !== undefined ? vm.orderDemosValues[-6].id : null
          },
          'demographics': vm.demographics,
          'tests': vm.listDataTest[0],
          'messageCode': 0
        }

        if(vm.isAuxPhysicians) {
          json.auxiliaryPhysicians = auxiliaryPhysicians;
        }

        vm.numOrder = init;
        auth = localStorageService.get('Enterprise_NT.authorizationData');
        return orderDS.insertOrderBlock(auth.authToken, json, init, quantity, vm.typeSave).then(function (data) {
          vm.disabledSave = data.status === 200;
          if (data.status === 200) {
            vm.stateControl = 1;
            vm.messageSave = '';
            vm.messageNotSave = '';
            vm.listSuccess = [];
            vm.listError = [];
            data.data.forEach(function (value) {
              var order = value.split('|')[0];
              if (value.split('|')[1] === 'Successfully Registered') {
                vm.listSuccess.push(order);
              } else {
                vm.listError.push(order);
              }
            });
            vm.disabledSave = vm.listSuccess.length > 0;
            if (Math.min.apply(null, vm.listSuccess).toString() !== init && Math.min.apply(null, vm.listError) !== Infinity && Math.min.apply(null, vm.listError) !== 0) {
              vm.messageNotSave = $filter('translate')('0324')
                .replace('@@@1', Math.min.apply(null, vm.listError))
                .replace('@@@2', Math.max.apply(null, vm.listError));
            }

            if (vm.listSuccess.length > 1) {
              vm.messageSave = $filter('translate')('0294')
                .replace('###', vm.quantity)
                .replace('@@@1', Math.min.apply(null, vm.listSuccess))
                .replace('@@@2', Math.max.apply(null, vm.listSuccess));
              UIkit.modal('#logSaveOrders').show();
              vm.orderDemosValues[vm.staticDemoIds["orderDate"]] = moment().format("" + vm.formatDate.toUpperCase() + " " + "HH:mm:ss");
            } else if (vm.listSuccess.length === 1) {
              vm.messageSave = 'La orden ' + Math.min.apply(null, vm.listSuccess) + ' fue ingresada con éxito!';
              UIkit.modal('#logSaveOrders').show();
              vm.orderDemosValues[vm.staticDemoIds["orderDate"]] = moment().format("" + vm.formatDate.toUpperCase() + " " + "HH:mm:ss");
            } else if (vm.listSuccess.length === 0) {
              vm.messageNotSave = $filter('translate')('0331');
              UIkit.modal('#logErrorTest2').show();
            }

            if (vm.byOrder === 'true' || vm.listSuccess.length === 1) {
              vm.orderDemosValues[-107] = Math.min.apply(null, vm.listSuccess);

            } else {
              vm.entryInit = Math.min.apply(null, vm.listSuccess);
              vm.orderDemosValues[-107] = Math.max.apply(null, vm.listSuccess);
            }
            vm.loadingdata = false;
          }
        }, function (error) {
          if (error.data !== null && error.data !== undefined) {
            if (error.data.errorFields === undefined) {
              vm.messageNotSave = error.data.message
            } else {
              var numError = error.data.errorFields[0].split('|')[0];
              vm.messageNotSave = numError.toString() === '1' ? $filter('translate')('0800') : $filter('translate')('0331');
            }
            vm.loadingdata = false;
            UIkit.modal('#logErrorTest2').show();
          }
        });
      } else {
        logger.warning($filter('translate')('0663'));
      }
    }

    function newOrders() {
      vm.orderDemosValues = vm.cleanAllDemos(vm.orderDemosValues);
      vm.orderDemosDisabled = vm.disabledAllDemo(vm.orderDemosDisabled, false);
      vm.disabledSave = false;
      vm.disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds['orderDate'], true);
      if (vm.isOrderAutomatic) {
        vm.disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds["order"], true);
        setTimeout(function () {
          document.getElementById("demo_" + vm.staticDemoIds["orderType"] + "_value").focus();
        }, 100);
      } else {
        setTimeout(function () {
          vm.disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds["order"], false);
          document.getElementById("demo_" + vm.staticDemoIds["order"]).focus();
        }, 100);
      }
      vm.dataOrder.forEach(function (demo, index) {
        if (demo.encoded && demo.viewdefault) {
          vm.orderDemosValues[demo.id] = demo.itemsdefault;
        }
      });
      var variable = vm.listDataTest;
      vm.days = 1;
      vm.quantity = 1;
      vm.entryInit = '';
      vm.entryEnd = '';
      vm.cleanform = 1;
      vm.cleanTests = 1;
      vm.statepatient = 1;
      vm.stateControl = 5;
      vm.orderDemosValues[-5] = vm.branch;

    }

    /**
     * Habilita o deshabilita todos los demograficos de un control
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledAllDemo(demos, disabled) {
      var disabledDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          disabledDemos[property] = disabled;
        }
      }
      return disabledDemos;
    }

    /**
     * Habilita o deshabilita un demografico
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     * @param {*} id Id demografico para deshabilitar
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledDemo(demos, id, disabled) {
      for (var property in demos) {
        if (property == id) {
          if (demos.hasOwnProperty(property)) {
            demos[property] = disabled;
          }
        }
      }
      return demos;
    }


    /**
     * Limpia el valor de todos los demograficos
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     */
    function cleanAllDemos(demos) {
      var cleanDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          cleanDemos[property] = "";
        }
      }
      return cleanDemos;
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
      vm.loadDemographicControls();

      vm.byOrder = 'false';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      branchDS.getBranchId(auth.authToken, auth.branch).then(function (data) {
        vm.branch = {};
        if (data.status === 200) {
          vm.branch = {
            'id': auth.branch,
            'code': data.data.code,
            'name': data.data.name,
            'showValue': data.data.code + '. ' + data.data.name
          };
        }
      });
      //vm.orderDemosDisabled = vm.disabledAllDemo(vm.orderDemosDisabled, false);
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */
