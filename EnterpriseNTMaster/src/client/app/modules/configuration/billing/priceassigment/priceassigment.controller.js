(function () {
  'use strict';

  angular
    .module('app.priceassigment')
    .controller('PriceAssigmentController', PriceAssigmentController)
    .controller('assignmennoaddController', assignmennoaddController)
    .controller('ValidityApplyController', ValidityApplyController)
    .controller('PriceAssigmentDependenceController', PriceAssigmentDependenceController);

  PriceAssigmentController.$inject = ['priceassigmentDS', 'feescheduleDS', 'rateDS', 'areaDS', 'centralsystemDS',
    'localStorageService', 'logger', 'ModalService', 'configurationDS', '$rootScope', '$filter', '$state', 'moment', 'LZString', '$translate'
  ];

  function PriceAssigmentController(priceassigmentDS, feescheduleDS, rateDS, areaDS, centralsystemDS,
    localStorageService, logger, ModalService, configurationDS, $rootScope, $filter, $state, moment, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'PriceAssigment';
    vm.ordering = ['ordering', 'name'];
    vm.name = ['name', 'ordering'];
    vm.sortReverse = false;
    vm.sortType = vm.ordering;
    vm.code = ['code', 'name', 'currency', 'patientPercentage'];
    vm.nametest = ['name', 'code', 'currency', 'patientPercentage'];
    vm.currency = ['currency', 'code', 'name', 'patientPercentage'];
    vm.patientPercentage = ['patientPercentage', 'code', 'name', 'currency'];
    vm.sortReversetest = false;
    vm.sortTypeTest = vm.code;
    vm.selected = -1;
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.modalrequired = modalrequired;
    vm.isAuthenticate = isAuthenticate;
    vm.getValidity = getValidity;
    vm.getRate = getRate;
    vm.getAreaActive = getAreaActive;
    vm.getTestBilling = getTestBilling;
    vm.getPriceAssigmentTest = getPriceAssigmentTest;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getConfigurationCurrencySymbol = getConfigurationCurrencySymbol;
    vm.getConfigurationDecimal = getConfigurationDecimal;
    vm.generateFile = generateFile;
    vm.getRateDestination = getRateDestination;
    vm.getCentralSystem = getCentralSystem;
    vm.getConfigurationSeparatorList = getConfigurationSeparatorList;
    vm.cancel = cancel;
    vm.changeValidity = changeValidity;
    vm.changeRate = changeRate;
    vm.changeSearch = changeSearch;
    vm.changeData = changeData;
    vm.changeSign = changeSign;
    vm.onBlur = onBlur;
    vm.updatePriceAssigment = updatePriceAssigment;
    vm.updateFeescheduleApply = updateFeescheduleApply;
    vm.updatePriceFormula = updatePriceFormula;
    vm.updateImportPriceTest = updateImportPriceTest;
    vm.exportdata = exportdata;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getTestId = getTestId;
    vm.getListSigns = getListSigns;
    vm.clickPopup = clickPopup;
    vm.blurValue = blurValue;
    vm.currencyKeyUp = currencyKeyUp;
    vm.currencyLoad = currencyLoad;
    vm.normalizeNumberFormat = normalizeNumberFormat;
    vm.modalApplyValid = modalApplyValid;
    vm.symbol = '';
    vm.penny = false;
    vm.penny2 = false;
    vm.idValidity = 0;
    vm.idRate = 0;
    vm.dataAreas = [];
    vm.isChangeData = false;
    vm.isChangeData2 = false;
    vm.listCentralSystem = [];
    vm.dataTestPrice = [];
    vm.filteredtest = [];
    vm.saveCalculator = false;
    var auth;
    vm.loadingdata = true;
    vm.windowOpenReport = windowOpenReport;
    vm.focusSelect = focusSelect;
    vm.save = save;
    vm.blurexit = blurexit;


    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que adiciona o elimina elementos del JSON**//
    function removeData(data) {
      var dataArea = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.abbreviation;
        delete value.color;
        delete value.partialValidation;
        delete value.lastTransaction;
        delete value.state;
        delete value.type;

        if (value.id === 1) {
          delete data.data[key];
        } else {
          data.data[key].username = auth.userName;
          dataArea.push(data.data[key]);
        }

      });

      return dataArea;
    }
    //** Método que obtiene la lista para vigencias**//
    function getValidity() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return feescheduleDS.get(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.sort(function (a, b) {
            return moment(a.initialDate).format('YYYYMMDD') < moment(a.initialDate).format('YYYYMMDD') ? 1 : -1
          });
        }
        vm.listValidity = $filter('orderBy')(data.data, 'name');
        vm.numValidity = vm.listValidity.length;
        vm.getRate();
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista de tarifas activas**//
    function getRate() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.getstate(auth.authToken).then(function (data) {
        vm.listRate = $filter('orderBy')(data.data, 'name');
        if (vm.listRate.length !== 0) {
          var label = 'Code;Name';
          vm.dataempy = '';
          vm.coderateimport = [];
          var rate = JSON.parse(JSON.stringify(vm.listRate));
          rate = $filter('orderBy')(rate, 'id');
          rate.forEach(function (value, key) {
            var namerate = value.name.replace(/ /g, "");
            var namerate = namerate.replace(/[^a-zA-Z0-9]/g, '');
            vm.coderateimport[namerate + '_' + value.id] = [{ id: value.id }];
            vm.dataempy = vm.dataempy + '0;0'
            if (rate.length - 1 !== key) {
              vm.dataempy = vm.dataempy + vm.SeparatorList;
            }
            label = label + ';' + namerate + '_Patientporcent_' + value.id + ';' + namerate + '_Price_' + value.id
          });
          vm.allratecvs = [label];
        }
        vm.numRate = vm.listRate.length;
        vm.getAreaActive();
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que obtiene la lista de tarifas activas**//
    vm.getRateImport = getRateImport;
    function getRateImport() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.getstate(auth.authToken).then(function (data) {
        vm.listRate = $filter('orderBy')(data.data, 'name');
        if (vm.listRate.length !== 0) {
          var label = 'Code;Name';
          vm.dataempy = '';
          vm.coderateimport = [];
          var rate = JSON.parse(JSON.stringify(vm.listRate));
          rate = $filter('orderBy')(rate, 'id');
          rate.forEach(function (value, key) {
            var namerate = value.name.replace(/ /g, "");
            var namerate = namerate.replace(/[^a-zA-Z0-9]/g, '');
            vm.coderateimport[namerate + '_' + value.id] = [{ id: value.id }];
            vm.dataempy = vm.dataempy + '0;0'
            if (rate.length - 1 !== key) {
              vm.dataempy = vm.dataempy + vm.SeparatorList;
            }
            label = label + ';' + namerate + '_Patientporcent_' + value.id + ';' + namerate + '_Price_' + value.id
          });
          vm.allratecvs = [label];
        }
        vm.numRate = vm.listRate.length;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que obtiene la lista de areas activas**//
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.listArea = data.data.length === 0 ? data.data : vm.removeData(data);
        vm.numArea = vm.listArea.length;
        vm.listArea.push({
          'id': 0,
          'ordering': 'PQ',
          'name': $filter('translate')('0473').toUpperCase() + 'S'
        })
        vm.getTestBilling();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método para obtener lista de examenes por vigencia**//
    function getTestBilling() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return priceassigmentDS.getPriceAssigmentId(auth.authToken, -1, -1, -1).then(function (data) {
        vm.listtestprice = data.data;
        vm.numTest = data.data.length;
        vm.loadingdata = false;
        vm.modalrequired();
      })
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getPriceAssigmentTest(idArea, index, This) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      vm.idArea = vm.dataAreas === undefined ? -1 : idArea;
      if (This !== undefined) {
        vm.nameArea = This.Area.name === undefined ? '' : This.Area.name;
      }
      vm.selected = index;
      vm.selectedTest = -1;
      vm.isChangeData = false;
      vm.isFocus = false;
      return priceassigmentDS.getPriceAssigmentId(auth.authToken, vm.idValidity, vm.idRate, vm.idArea).then(function (data) {
        var i = 1;
        vm.dataTestPrice = [];
        vm.idTest = undefined;
        if (data.data.length > 0) {
          vm.usuario = $filter('translate')('0017') + ' ';

          var listTransactions = $filter('filter')(data.data, function (e) {
            return e.lastTransaction !== null
          });

          var lastTransaction = null;
          var date = moment(new Date()).format(vm.formatDate);
          var user = auth.userName;

          if (listTransactions) {
            lastTransaction = $filter('orderBy')(listTransactions, 'lastTransaction', 'desc')[0];
          }

          if (lastTransaction !== null && lastTransaction !== undefined) {
            date = lastTransaction.lastTransaction !== null ? moment(lastTransaction.lastTransaction).format(vm.formatDate) : moment(new Date()).format(vm.formatDate);
            user = lastTransaction.user.userName == null ? auth.userName : lastTransaction.user.userName;
          }

          vm.usuario = vm.usuario + date + ' - ';
          vm.usuario = vm.usuario + user;

          data.data.forEach(function (value, key) {
            var curr = currencyLoad(value.price.toString(), vm.symbol, vm.penny);
            data.data[key].IpatientPercentage = value.patientPercentage;
            data.data[key].currency = curr;
            data.data[key].validatedprice = false;

          });
          vm.dataTestPrice = data.data;
        }
        document.location.hash = '';
        vm.documentHash = '';
        vm.loadingdata = false;
        return vm.dataTestPrice;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que evalua los focos de los controles de examanes**/
    function getTestId(id, index) {
      if (id !== undefined) {
        vm.isChangeData = false;
        vm.isFocus = false;
        vm.selectedTest = index;
      }
    }
    //** Método que evalua Los requeridos al inicializar la pagina**/
    function modalrequired() {
      var columnNum = 0;
      if ((vm.numValidity === 0) || vm.numRate === 0 || vm.numArea === 0 || vm.numTest === 0) {
        columnNum = columnNum + (vm.numValidity === 0 ? 1 : 0) +
          (vm.numRate === 0 ? 1 : 0) +
          (vm.numArea === 0 ? 1 : 0) +
          (vm.numTest === 0 ? 1 : 0)
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'PriceAssigmentDependenceController',
          inputs: {
            hideValidity: vm.numValidity,
            hideRate: vm.numRate,
            hideArea: vm.numArea,
            hideTest: vm.numTest,
            columnNum: columnNum
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método que consulta la llave de configuración del formato de fecha**/
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getConfigurationCurrencySymbol();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que consulta la llave de configuración de simbolo monetario**/
    function getConfigurationCurrencySymbol() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'SimboloMonetario').then(function (data) {
        vm.getConfigurationDecimal();
        if (data.status === 200) {
          vm.symbol = data.data.value;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que consulta la llave de configuración de Manejo de centavos**/
    function getConfigurationDecimal() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'ManejoCentavos').then(function (data) {
        vm.getListSigns();
        if (data.status === 200) {
          vm.penny = data.data.value === 'True';
          vm.penny2 = data.data.value === 'True';
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que valida si esta seleccionado un tarifas para exportarla**/
    function changeValidity(id, name) {
      vm.idValidity = id;
      vm.nameValidity = name;
      vm.isChangeData2 = false;
      vm.exportdata();
      if (vm.idRate !== 0) {
        vm.dataAreas = []
        vm.dataAreas = vm.listArea;
        if (vm.selected !== -1) {
          vm.getPriceAssigmentTest(vm.idArea, vm.selected);
        }
      }
    }
    //** Método que valida vuando cambia la tarifa**/
    function changeRate(id, name) {
      vm.idRate = id;
      vm.nameRate = name;
      if (vm.idValidity !== 0) {
        vm.exportdata();
        vm.dataAreas = []
        vm.dataAreas = vm.listArea;
        if (vm.selected !== -1) {
          vm.getPriceAssigmentTest(vm.idArea, vm.selected);
        }
      }
    }
    //Función que le da formato de moneda a un valor numérico cuando es cargado en un control.
    function currencyLoad(valueData, symbol, penny) {
      try {
        var num = valueData.replace(/\,/g, penny ? '' : '.');
        //var num = valueData;
        num = num.replace(symbol, '');
        num = num.replace(' ', '');
        if (num.lastIndexOf('-') !== -1) {
          num = num.slice(0, -1);
        }
        if (num === '' || num === ' ') {
          num = penny ? '0.00' : '0';
        }
        if (penny) {
          num = parseFloat(num).toFixed(2);
        } else {
          num = parseFloat(num).toFixed(0);
        }
        num = num.split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        valueData = symbol.trim() + ' ' + num.replace('.,', ',');
      } catch (ex) {
        valueData = symbol.trim() + (penny ? ' 0.00' : '0');
      }
      return valueData;
    }
    //Función que le va dando formato de moneda a un valor numérico en el momento de estar digitándose.
    function currencyKeyUp(e, inputCtrl, symbol, penny) {
      try {
        var star = $('#' + inputCtrl.$name)[0].selectionStart;
        if (star <= 2) {
          star = 3;
        }
        var reg = penny ? /[^0-9.]/g : /[^0-9]/g;
        var num = inputCtrl.$modelValue.replace(reg, '');
        num = num.replace(symbol, '');
        num = num.replace(' ', '');
        if (e.keyCode !== 37 && e.keyCode !== 39) {
          if (num.lastIndexOf('-') !== -1 && e.keyCode === 109) {
            num = num.slice(0, -1);
          }
          if ((num.substr(-2, 1) === '.' || num.substr(-3, 1) === '.' ||
            num.substr(-4, 1) === '.') && e.keyCode === 110) {
            num = num.replace('.', '');
          }

          if (num.indexOf('0') === 0 && num.indexOf('.') !== 1) {
            num = num.replace('0', '');
          }

          if (num === '' || num === ' ') {
            num = penny ? '0.00' : '0';
          }

          num = num.toString().split('').reverse().join('').
            replace(/(?=\d*\,?)(\d{3})/g, '$1,');
          var isComma = num.substr(-2, 1) === ',';
          num = num.split('').reverse().join('').replace(/^[\,]/, '');
          $('#' + inputCtrl.$name)[0].value = symbol.trim() + ' ' + num.replace('.,', ',');
          $('#' + inputCtrl.$name)[0].selectionStart = star + (isComma ? 1 : 0);
          $('#' + inputCtrl.$name)[0].selectionEnd = star + (isComma ? 1 : 0);
          inputCtrl.$setViewValue($('#' + inputCtrl.$name)[0].value);
          inputCtrl.$render();
        }
      } catch (ex) {
        inputCtrl.$setViewValue(symbol.trim() + (penny ? ' 0.00' : ' 0'));
        inputCtrl.$render();
      }
    }
    //Función que devuelve la normalización de un valor monetario en formato numérico estandar
    function normalizeNumberFormat(valueCurrency, symbol) {
      try {
        return valueCurrency.replace(/\,/g, '').replace(symbol, '');
      } catch (e) {
        return valueCurrency.replace(symbol, '');
      }
    }
    //** Método que buscar un área**//
    function changeSearch() {
      vm.selected = -1;
      vm.selectedTest = -1;
      vm.dataTestPrice = [];
      vm.searchtest = '';
      vm.filteredtest = [];
    }
    //** Método que actualiza el orden de impresión de los exámenes o pruebas**//
    function changeData() {
      vm.isChangeData = true;
      vm.isChangeData2 = true;
    }
    //** Método que valida cuando se cambia de signo**//
    function changeSign() {
      vm.penny2 = (vm.listSign.name === '*' || vm.listSign.name === '/') ? true : vm.penny;
      vm.value = vm.value === '' || vm.value === undefined ? vm.currencyLoad(0, vm.symbol, vm.penny2) : vm.value;
      if (vm.listSign.name === '/') {

        if (vm.normalizeNumberFormat(vm.value, vm.symbol) === ' 0.00' || vm.value === '0' || vm.value === '0.00') {
          vm.value = vm.symbol + ' 0.01';
        }
      } else {
        if (vm.normalizeNumberFormat(vm.value, vm.symbol) === ' 0.00' || vm.value === '0' || vm.value === '0.00') {
          vm.value = vm.currencyLoad(0, vm.symbol, vm.penny2);
        }
      }
    }
    //** Método para evaluar el foco del control**//
    function focusSelect(objname) {
      document.getElementById(objname).select();
    }
    //** Método para evaluar el blur del control**//
    function blurValue() {
      vm.changeSign();
    }
    //** Método para evaluar el onBlur del control**//
    function onBlur(onBlur) {
      vm.isFocus = false;
      if (vm.isChangeData) {
        //vm.updatePriceAssigment(onBlur);
        vm.isChangeData = false;
      } else {
        vm.isFocus = true;
      }
    }

    function blurexit(Test) {
      Test.validatedporcentage = Test.patientPercentage === 0 ? true : false;
    }

    function save() {
      vm.loadingdata = true;
      var validatepriceporce = [];
      var datasave = [];

      vm.dataTestPrice.forEach(function (e) {
        var price = parseFloat(vm.normalizeNumberFormat(e.currency, vm.symbol));
        if (e.IpatientPercentage !== e.patientPercentage || e.price !== price) {
          datasave.push(e)
        }
        if ((e.patientPercentage !== 0 && price === 0)) {
          e.validatedprice = true;
          validatepriceporce.push(e)
        }
      });

      if (validatepriceporce.length === 0) {
        vm.datasave = datasave;
        if (datasave.length === 0) {
          vm.loadingdata = false;
        } else {
          vm.countPrice = 0;
          vm.updatePriceAssigment(vm.datasave[vm.countPrice]);
        }
      } else {
        logger.error($filter('translate')('1326'));
        vm.loadingdata = false;
      }
    }
    //** Método que Actualiza los precios de un examen o prueba**//
    function updatePriceAssigment(obj) {
      try {
        if (vm.countPrice < vm.datasave.length) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var price = parseFloat(vm.normalizeNumberFormat(obj.currency, vm.symbol));
          var testPrice = {
            'id': vm.idRate,
            'idValid': vm.idValidity,
            'nameRate': vm.rate.name,
            'nameValid': vm.validity.name,
            'test': {
              'id': obj.id,
              'name': obj.name,
              'code': obj.code,
              'price': price,
              'patientPercentage': obj.patientPercentage

            },
            'user': auth
          };
          return priceassigmentDS.updatePriceAssigment(auth.authToken, testPrice).then(function (data) {
            if (data.status === 200) {
              vm.countPrice = vm.countPrice + 1;
              vm.updatePriceAssigment(vm.datasave[vm.countPrice]);
            }
          }, function (error) {
            vm.modalError(error);
          });

        } else if (vm.countPrice === vm.datasave.length) {
          logger.success($filter('translate')('0042'));
          // vm.getPriceAssigmentTest(vm.idArea, vm.selected)
          vm.loadingdata = false;
        }
      } catch (error) {
      }
    }
    //** Método para mostrar un popup para importar**//
    function clickPopup(c) {
      vm.clean = true;
      vm.listimport = undefined;
      if (c === 'F') {
        $('#modalFormula').css({
          'visibility': 'initial',
          'height': '244px'
        });
        $('#modalImport').css({
          'visibility': 'hidden',
          'height': '0px'
        });
      } else {
        $('#modalImport').css({
          'visibility': 'initial',
          'height': '244px'
        });;
        $('#modalFormula').css({
          'visibility': 'hidden',
          'height': '0px'
        });
      }
    }
    //Método que devuelve la lista de sistemas centrales activos
    function getCentralSystem() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        vm.getConfigurationSeparatorList();
        vm.listCentralSystem = data.data.length === 0 ? data.data : removeData(data);
        vm.listCentralSystem = $filter('orderBy')(vm.listCentralSystem, 'name');
      }, function (error) {
        vm.modalError();
      });
    }

    //** Método para aplicar las vigencias**//
    function updateFeescheduleApply() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var feescheduleApply = vm.idValidity.toString();
      return priceassigmentDS.updateFeescheduleApply(auth.authToken, feescheduleApply).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    //** Método que Actualiza los precios de todaso algunas pruebas**//
    function updatePriceFormula() {
      vm.saveCalculator = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var value = parseFloat(vm.normalizeNumberFormat(vm.value, vm.symbol));
      var testPrice = {
        'from': vm.idRate,
        'to': vm.rateDestin.id,
        'operator': vm.listSign.name,
        'value': value < 0 ? 0 : value,
        'roundMode': vm.math ? 0 : 1,
        'writeType': vm.writeType ? 1 : 0,
        'feeSchedule': vm.idValidity,
        'operators': ['+', '-', '*', '/'],
        'user': auth
      };
      return priceassigmentDS.updatePriceFormula(auth.authToken, testPrice).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.idRate = vm.rateDestin.id;
          vm.rate.id = vm.rateDestin.id;
          vm.rate.name = vm.rateDestin.name;
          vm.getPriceAssigmentTest(vm.idArea, vm.selected);
          vm.saveCalculator = false;
          return data;
        }

      }, function (error) {
        vm.modalError(error);
        vm.saveCalculator = false;
      });
    }
    //*Método que actualiza los precios de los exámenes por medio de un archivo d importación
    function updateImportPriceTest() {
      if (vm.listimport.length > 0) {
        if (vm.idRate !== 0) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var array = JSON.parse(vm.listimport);
          var arrayImport = [];
          var formatInvalid = 0;
          array.forEach(function (value, key) {
            if (array[key].Code !== undefined && array[key].Price !== undefined) {
              var price = vm.normalizeNumberFormat(array[key].Price, vm.symbol);
              var code = array[key].Code.replace("'", "");
              if (!isNaN(price)) {
                arrayImport.push({
                  'code': code,
                  'patientPercentage': array[key].Patientporcent,
                  'price': price
                })
              } else {
                formatInvalid++;
              }
            }
          }, function (error) {
            vm.dataerror = error.data.errorFields;
            vm.active = false;
          });
          if (formatInvalid === 0) {
            var importTestPrice = {
              'id': vm.idRate,
              'idValid': vm.idValidity,
              'centralSystem': vm.listCentralSystem.id === undefined ? 0 : vm.listCentralSystem.id,
              'importTests': arrayImport,
              'user': auth
            }
            vm.importTestPrice = arrayImport;
            return priceassigmentDS.updateImportPriceTest(auth.authToken, importTestPrice).then(function (data) {
              if (data.status === 200) {
                vm.getPriceAssigmentTest(vm.idArea, vm.selected);
                //vm.stateButton('insert');
                logger.success($filter('translate')('0042'));
                //vm.active = false;
              }
            }, function (error) {
              vm.modalError(error);
            });
          }
        } else {
          vm.loadingdata = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var array = JSON.parse(vm.listimport);
          var arrayImport = [];
          var formatInvalid = 0;
          var daasave = [];
          for (var index = 0; index < array.length; index++) {
            for (var propiedad in vm.coderateimport) {
              if (vm.coderateimport.hasOwnProperty(propiedad)) {
                var idRate = vm.coderateimport[propiedad][0].id;
                var item = propiedad.split('_');
                if (array[index].Code !== '') {
                  daasave.push(
                    {
                      'code': array[index].Code,
                      'patientPercentage': array[index][item[0] + '_Patientporcent_' + item[1]],
                      'price': array[index][item[0] + '_Price_' + item[1]],
                      'idRate': idRate,
                      'idValid': vm.idValidity,
                      'centralSystem': vm.listCentralSystem.id === undefined ? 0 : vm.listCentralSystem.id,
                      'user': auth
                    }
                  );
                }
              }
            }
          }
          vm.size = daasave.length;
          vm.datadevalidated = daasave;
          vm.saveallrate();
        }
      }
    }

    vm.saveallrate = saveallrate;
    function saveallrate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.datadevalidated.length === 1) {
        return priceassigmentDS.updateImportPriceTest(auth.authToken, vm.datadevalidated).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0042'));
            vm.loadingdata = false;
          }
        }, function (error) {
          vm.modalError(error);
        });
      } else {
        return priceassigmentDS.updateImportBatchPriceTest(auth.authToken, vm.datadevalidated).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0042'));
            vm.loadingdata = false;
          }
        }, function (error) {
          vm.modalError(error);
        });
      }
    }

    //** Método para consultar el separador lista**//
    function getConfigurationSeparatorList() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'SeparadorLista').then(function (data) {
        vm.getValidity();
        if (data.status === 200) {
          vm.SeparatorList = data.data.value;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para exportar la data**//
    function exportdata() {
      if (vm.idRate !== 0) {
        vm.headercsv = ['Code;Name;Patientporcent;Price'];
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return priceassigmentDS.getPriceAssigmentId(auth.authToken, vm.idValidity, vm.idRate, -1).then(function (data) {
          vm.exportTestPrice = [];
          if (data.data.length > 0) {
            data.data.forEach(function (value, key) {
              var curr = value.price.toString();
              var code = "'" + value.code;
              vm.exportTestPrice.push({
                'reg': code + vm.SeparatorList +
                  value.name.replace(/\,/g, ' ') + vm.SeparatorList +
                  value.patientPercentage + vm.SeparatorList +
                  curr.replace(/\,/g, '')
              });
            });
          }
          return vm.exportTestPrice;
        });
      } else {
        vm.headercsv = vm.allratecvs;
        vm.exportTestPrice = [];
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return priceassigmentDS.getPriceAssigmentId(auth.authToken, vm.idValidity, 0, -1).then(function (data) {
          vm.exportTestPrice = [];
          if (data.data.length > 0) {
            vm.dataempyall = '';
            var idtest = 0;
            data.data = $filter('orderBy')(data.data, ['id', 'rate']);
            var dataall = JSON.parse(JSON.stringify(data.data));
            data.data.forEach(function (value, key) {
              if (key === 0) {
                idtest = value.id;
              }
              var number = dataall.length - 1 === key ? key : key + 1;
              if (idtest === dataall[key].id) {
                vm.dataempyall = vm.dataempyall+vm.SeparatorList + value.patientPercentage + vm.SeparatorList + value.price;
                idtest=value.id;
              } else {
                var code = "'" + dataall[key-1].code;
                vm.exportTestPrice.push({
                  'reg': code + vm.SeparatorList +
                  dataall[key-1].name.replace(/\,/g, ' ') + vm.dataempyall
                });
                vm.dataempyall='';
                vm.dataempyall = vm.dataempyall+vm.SeparatorList + value.patientPercentage + vm.SeparatorList + value.price;
                idtest=value.id;
              }
            });
          } else {
            if (vm.listtestprice.length > 0) {
              vm.listtestprice.forEach(function (value, key) {
                var code = value.code;
                vm.exportTestPrice.push({
                  'reg': code + vm.SeparatorList +
                    value.name.replace(/\,/g, ' ') + vm.SeparatorList +
                    vm.dataempy
                });
              });
            }

          }
          return vm.exportTestPrice;
        });
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.codeRepeat = false;
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          vm.examnotadd = [];

          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }

            if (item[0] === '3' && item[1] === 'code') {
              vm.codeRepeat = true;
              vm.examnotadd.add(vm.importTestPrice[parseInt(item[2])])
            }
          });
        }
      }
      if (vm.codeRepeat) {
        ModalService.showModal({
          templateUrl: "assignmennoadd.html",
          controller: "assignmennoaddController",
          inputs: {
            listTest: vm.examnotadd
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function () {
          });
        });
      }
      if (!vm.nameRepeat && !vm.codeRepeat) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método para consultar una lista de signos**//
    function getListSigns() {
      var data = [{
        'id': '+',
        'name': '+'
      },
      {
        'id': '-',
        'name': '-'
      },
      {
        'id': '*',
        'name': '*'
      },
      {
        'id': '/',
        'name': '/'
      }
      ];
      vm.listSign = data;
      vm.getRateDestination();
      return data;
    }
    //** Método para las tarifas activas**//
    function getRateDestination() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rateDS.getstate(auth.authToken).then(function (data) {
        vm.getCentralSystem();
        vm.listRateDestin = $filter('orderBy')(data.data, 'name');
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function cancel() {
      if (vm.selected == -1) {
        vm.symbol = '';
        vm.penny = false;
        vm.idValidity = 0;
        vm.idRate = 0;
        vm.validity.id = 0;
        vm.rate.id = 0;
        vm.dataAreas = [];
        vm.dataTestPrice = [];
        vm.search = '';
        vm.searchtest = '';
      } else {
        vm.selected = -1;
        vm.dataTestPrice = [];
        vm.search = '';
        vm.searchtest = '';
      }
    }
    /** funcion para generar informe en PDF O EXEL de areas*/
    function generateFile() {
      if (vm.filteredtest.length === 0) {
        vm.open = true;
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.filteredtest.forEach(function (value, key) {
          vm.filteredtest[key].username = auth.userName
        });
        vm.variables = {
          'area': vm.nameArea,
          'rate': vm.nameRate,
          'Validity': vm.nameValidity
        };
        vm.datareport = vm.filteredtest;
        vm.pathreport = '/report/configuration/billing/priceassigment/priceassigment.mrt';
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
    //** Método para mostrar ventana modal de la advertencia**//
    function modalApplyValid() {
      if (vm.selected !== -1) {
        ModalService.showModal({
          templateUrl: 'AdvertenceApply.html',
          controller: 'ValidityApplyController'
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.execute === 'yes') {
              vm.updateFeescheduleApply();
            }
          });
        });
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la ventana modal que pregunta si se desea aplicar la vigencia o no*//
  function ValidityApplyController($scope, close) {
    $scope.close = function (execute) {
      close({
        execute: execute
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  function assignmennoaddController($scope, listTest, close) {
    $scope.listTest = listTest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function PriceAssigmentDependenceController($scope, hideValidity, hideRate, hideArea, hideTest, columnNum, close) {
    $scope.hideRate = hideRate;
    $scope.hideValidity = hideValidity;
    $scope.hideArea = hideArea;
    $scope.hideTest = hideTest;
    $scope.columnNum = columnNum;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
