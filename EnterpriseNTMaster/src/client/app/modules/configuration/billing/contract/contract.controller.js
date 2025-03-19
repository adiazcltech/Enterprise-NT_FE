(function () {
  'use strict';

  angular
    .module('app.contract')
    .controller('validationController', validationController)
    .controller('contractController', contractController);

  contractController.$inject = ['customerDS', 'localStorageService', 'logger', '$rootScope',
    'configurationDS', '$filter', '$state', 'ModalService', '$translate', 'discountsDS', 'demographicsItemDS', 'contractDS'
  ];

  function contractController(customerDS, localStorageService, logger, $rootScope,
    configurationDS, $filter, $state, ModalService, $translate, discountsDS, demographicsItemDS, contractDS) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'contract';
    vm.code = ['code', 'name', 'state'];
    vm.name = ['name', 'code', 'state'];
    vm.state = ['-state', '+name', '+code'];
    vm.coderate = ['rateCode', 'nameRate'];
    vm.namerate = ['nameRate', 'rateCode'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.customerDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isRequiredPassword = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCustomer = getCustomer;
    vm.getCustomerId = getCustomerId;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getConfigurationCurrencySymbol = getConfigurationCurrencySymbol;
    vm.getConfigurationDecimal = getConfigurationDecimal;
    vm.NewCustomer = NewCustomer;
    vm.EditCustomer = EditCustomer;
    vm.changeState = changeState;
    vm.currencyKeyUp = currencyKeyUp;
    vm.currencyLoad = currencyLoad;
    vm.numericKeyPress = numericKeyPress;
    vm.normalizeNumberFormat = normalizeNumberFormat;
    vm.cancelCustomer = cancelCustomer;
    vm.insertCustomer = insertCustomer;
    vm.updateCustomer = updateCustomer;
    vm.saveCustomer = saveCustomer;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.maskphone = '';
    vm.numberCurrency = /^(\d|-)?(\d|,)*\.?\d*$/;
    vm.symbol = '';
    vm.penny = true;
    vm.disablecapitado = false;
    var auth;
    vm.requeridKey = true;
    vm.loadingdata = true;
    vm.focusSelect = focusSelect;
    vm.requeridKey = localStorageService.get("Facturacion") !== '2';
    vm.getdiscont = getdiscont;
    vm.getStates = getStates;
    vm.changecustomer = changecustomer;
    vm.getMunicipalities = getMunicipalities;
    vm.pendingfees = pendingfees;
    vm.ratesnamecalidated = "";
    function getdiscont() {
      vm.discountsall = [];
      vm.datadiscounts = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return discountsDS.get(auth.authToken).then(function (data) {
        vm.getStates();
        vm.discountsall = $filter("filter")(data.data, function (e) {
          return e.state === true;
        });
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    function changecustomer(CustomerForm) {
      vm.loadingdata = true;
      vm.datadiscounts = [];
      vm.stateButton('init');
      CustomerForm.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.listcontract = [];
      vm.selected = -1;
      vm.maxAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.currentAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.alertAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.customerDetail = {
        'user': {
          'id': auth.id
        },
        'idclient': vm.customer.id,
        'id': null,
        'code': '',
        'name': '',
        'rates': [],
        'taxs': [],
        'maxAmount': 0,
        'currentAmount': 0,
        'alertAmount': 0,
        'monthlyValue': 0,
        'discount': 0,
        'capitated': 0,
        'additionalAddress': '',
        'postalCode': '',
        'city': '',
        'state': true,
      };
      return contractDS.getCustomerid(auth.authToken, vm.customer.id).then(function (data) {
        vm.pendingfees();
        vm.listcontract = data.data;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    function pendingfees() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return contractDS.getRatesByCustomerId(auth.authToken, vm.customer.id).then(function (data) {
        vm.datarate = data.data.length === 0 ? data.data : removeData(data.data);
        vm.rates = JSON.parse(JSON.stringify(vm.datarate));
        vm.ratesnamecalidated = data.data.length === 0 ? "" : vm.ratesnamecalidated;
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }

    function removeData(data) {
      var pendingfees = [];
      vm.ratesnamecalidated = [];
      data.forEach(function (value, key) {
        var savediscount = {
          clientId: vm.customer.id,
          contractId: 0,
          contractName: null,
          nameRate: value.rate.name,
          rateCode: value.rate.code,
          rateId: value.rate.id,
          statusType: 2,
          selected: false
        }
        vm.ratesnamecalidated.push(value.rate.name);
        pendingfees.push(savediscount);
      });
      vm.ratesnamecalidated = vm.ratesnamecalidated.toString();
      return pendingfees;
    }

    function getStates() {
      vm.states = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var id = localStorageService.get("ItemDemograficoFacturacionEstado") === '' ? '' : parseInt(localStorageService.get("ItemDemograficoFacturacionEstado"));
      if (id === '') {
        vm.Municipalities = [];
        vm.getCustomer();
      } else {
        return demographicsItemDS.getDemographicsItemsIddata(auth.authToken, id).then(
          function (data) {
            vm.getMunicipalities();
            if (data.status === 200) {
              vm.listStates = data.data;
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }
    }

    function getMunicipalities() {
      vm.Municipalities = [];
      var id = localStorageService.get("ItemDemograficoFacturacionMunicipio") === '' ? '' : parseInt(localStorageService.get("ItemDemograficoFacturacionMunicipio"));
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicsItemDS.getDemographicsItemsIddata(auth.authToken, id).then(
        function (data) {
          vm.getCustomer();
          if (data.status === 200) {
            vm.listMunicipalities = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
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

    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo usuario**//
    function NewCustomer(Customerform) {
      Customerform.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.maxAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.currentAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.alertAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
      vm.rates = JSON.parse(JSON.stringify(vm.datarate));
      vm.datadiscounts = [];
      vm.disablecapitado = true;
      vm.customerDetail = {
        'user': {
          'id': auth.id
        },
        'idclient': vm.customer.id,
        'id': null,
        'code': '',
        'name': '',
        'rates': [],
        'taxs': [],
        'maxAmount': 0,
        'currentAmount': 0,
        'alertAmount': 0,
        'monthlyValue': 0,
        'discount': 0,
        'capitated': 0,
        'capitatedContract': false,
        'additionalAddress': '',
        'postalCode': '',
        'city': '',
        'state': true,
      };
      vm.stateButton('add');
    }

    vm.changecapitado = changecapitado;
    function changecapitado() {
      if (vm.customerDetail.capitatedContract === false) {
        vm.customerDetail.capitated = 0;
        vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
        vm.disablecapitado = true;
      } else {
        vm.disablecapitado = false;
      }
    }

    //** Metodo para consultar el formato de la aplicación**//
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
    //** Metodo para consultar el simbolo monetario de la aplicación**//
    function getConfigurationCurrencySymbol() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'SimboloMonetario').then(function (data) {
        vm.getConfigurationDecimal();
        if (data.status === 200) {
          vm.symbol = data.data.value;
          vm.maxAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.currentAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.alertAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para consultar el amnejo de los centavos**//
    function getConfigurationDecimal() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'ManejoCentavos').then(function (data) {
        vm.getdiscont();
        if (data.status === 200) {
          vm.penny = data.data.value === 'True';
          vm.maxAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.currentAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.alertAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
          vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que deshabilitar los controles y botones para cancelar un usuario**//
    function cancelCustomer(ContractForm) {
      ContractForm.$setUntouched();
      if (vm.customerDetail.id === null || vm.customerDetail.id === undefined) {
        vm.customerDetail = [];
        vm.maxAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
        vm.currentAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
        vm.alertAmount = vm.currencyLoad('0', vm.symbol, vm.penny);
        vm.monthlyValue = vm.currencyLoad('0', vm.symbol, vm.penny);
      } else {
        vm.changecustomer(ContractForm);
      }
      vm.stateButton('init');
      vm.nameRepeat = false;
      vm.nitRepeat = false;
      vm.usersNameRepeat = false;
      vm.admonCodeRepeat = false;
      vm.epsCodeRepeat = false;
      vm.emailInvalid = false
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo usuario**//
    function EditCustomer() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo usuario o se va actualizar **//
    function saveCustomer(CustomerForm) {
      CustomerForm.$setUntouched();
      CustomerForm.name.$touched = true;
      CustomerForm.code.$touched = true;
      vm.customerDetail.maxAmount = vm.normalizeNumberFormat(vm.maxAmount, vm.symbol);
      vm.customerDetail.currentAmount = vm.normalizeNumberFormat(vm.currentAmount, vm.symbol);
      vm.customerDetail.alertAmount = vm.normalizeNumberFormat(vm.alertAmount, vm.symbol);
      vm.customerDetail.monthlyValue = vm.normalizeNumberFormat(vm.monthlyValue, vm.symbol);
      vm.customerDetail.rates = $filter("filter")(JSON.parse(JSON.stringify(vm.rates)), function (e) {
        e.statusType = e.selected === true ? 1 : e.statusType;
        return e.selected === true;
      })
      if (vm.customerDetail.rates.length === 0) {
        logger.warning($filter('translate')('1225'));
      } else if (vm.customerDetail.capitatedContract === true && JSON.parse(vm.customerDetail.monthlyValue) === 0 ||
        vm.customerDetail.capitatedContract === true && vm.customerDetail.capitated === 0) {
        logger.warning($filter('translate')('1259'));
      } else if (vm.validatedratesave && vm.customerDetail.state) {
        vm.loadingdata = true;
        var rates = $filter("filter")(JSON.parse(JSON.stringify(vm.rates)), function (e) {
          return e.selected === true;
        })
        var rates = _.map(rates, 'rateId');
        var data = {
          "customerId": vm.customer.id,
          "contractId": vm.selected,
          "rates": rates.toString()
        }
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return contractDS.validatesContractActivation(auth.authToken, data).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.customerDetail.state = false;
            vm.ratesasociates = data.data;
            ModalService.showModal({
              templateUrl: 'validation.html',
              controller: 'validationStateController',
              inputs: {
                ratesasociates: vm.ratesasociates,
              }
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
              });
            });
          } else {
            if (!CustomerForm.name.$invalid && !CustomerForm.code.$invalid) {
              vm.datadiscounts = vm.datadiscounts === undefined ? [] : vm.datadiscounts;
              vm.customerDetail.taxs = vm.datadiscounts.length === 0 ? [] : savediscount();
              if (vm.customerDetail.id === null) {
                vm.loadingdata = true;
                vm.insertCustomer(CustomerForm);
              } else {
                vm.updateCustomer(CustomerForm);
              }
            }
          }
        }, function (error) {
          vm.customerDetail.state = false;
          vm.loadingdata = false;
          vm.modalError(error);
        });
      } else if (!CustomerForm.name.$invalid && !CustomerForm.code.$invalid) {
        vm.datadiscounts = vm.datadiscounts === undefined ? [] : vm.datadiscounts;
        vm.customerDetail.taxs = vm.datadiscounts.length === 0 ? [] : savediscount();
        if (vm.customerDetail.id === null) {
          vm.loadingdata = true;
          vm.insertCustomer(CustomerForm);
        } else {
          vm.updateCustomer(CustomerForm);
        }
      }
    }
    function savediscount() {
      var discount = [];
      vm.datadiscounts.forEach(function (value, key) {
        var savediscount = {
          'id': value.id,
          'code': value.code,
          'name': value.name,
          'percentage': value.percentage,
          'state': true,
          'customerId': vm.customer.id
        }
        discount.push(savediscount);
      });
      return discount;
    }
    //** Método que inserta un nuevo usuario**//
    function insertCustomer(ContractForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return contractDS.New(auth.authToken, vm.customerDetail).then(function (data) {
        if (data.status === 200) {
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.selected = data.data.id;
          vm.changecustomersave(data.data.id, ContractForm)
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un usuario**//
    function updateCustomer(ContractForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return contractDS.update(auth.authToken, vm.customerDetail).then(function (data) {
        if (data.status === 200) {
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          vm.selected = data.data.id;
          vm.changecustomersave(data.data.id, ContractForm)
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
            }
          });
        }
      }
      if (!vm.nameRepeat && !vm.codeRepeat) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState(state) {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        if (state === true) {
          vm.loadingdata = true;
          var rates = $filter("filter")(JSON.parse(JSON.stringify(vm.rates)), function (e) {
            return e.selected === true;
          })
          var rates = _.map(rates, 'rateId');
          var data = {
            "customerId": vm.customer.id,
            "contractId": vm.selected,
            "rates": rates.toString()
          }
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return contractDS.validatesContractActivation(auth.authToken, data).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.customerDetail.state = false;
              vm.ratesasociates = data.data;
              ModalService.showModal({
                templateUrl: 'validation.html',
                controller: 'validationController',
                inputs: {
                  ratesasociates: vm.ratesasociates,
                }
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });
              });
            } else {
              vm.ShowPopupState = true;
            }
          }, function (error) {
            vm.customerDetail.state = false;
            vm.loadingdata = false;
            vm.modalError(error);
          });
        } else {
          vm.ShowPopupState = true;
        }
      }
    }
    //** Método que obtiene una lista de usuarios**//
    function getCustomer() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return customerDS.getCustomer(auth.authToken).then(function (data) {
        vm.dataCustomer = $filter('orderBy')(data.data, 'name');
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    vm.changecustomersave = changecustomersave;
    function changecustomersave(id, CustomerForm) {
      vm.loadingdata = true;
      vm.datadiscounts = [];
      vm.stateButton('init');
      CustomerForm.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return contractDS.getCustomerid(auth.authToken, vm.customer.id).then(function (data) {
        vm.pendingfees();
        vm.getCustomerId(id, CustomerForm)
        vm.listcontract = data.data;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    //** Método que obtiene un usuario por id*//
    function getCustomerId(id, ContractForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.customerDetail = [];
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      ContractForm.$setUntouched();
      vm.loadingdata = true;
      vm.validatedratesave = false;
      return contractDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.rates = data.data.rates.length === 0 ? data.data.rates : removeDatarate(data.data.rates);
          vm.stateButton('update');
          vm.disablecapitado = data.data.capitatedContract === undefined ? true : data.data.capitatedContract === false ? true : false;
          vm.customerDetail = data.data;
          vm.validatedratesave = data.data.state === false
          vm.maxAmount = vm.currencyLoad(vm.customerDetail.maxAmount.toString(), vm.symbol, vm.penny);
          vm.currentAmount = vm.currencyLoad(vm.customerDetail.currentAmount.toString(), vm.symbol, vm.penny);
          vm.alertAmount = vm.currencyLoad(vm.customerDetail.alertAmount.toString(), vm.symbol, vm.penny);
          vm.monthlyValue = vm.currencyLoad(vm.customerDetail.monthlyValue.toString(), vm.symbol, vm.penny);
          vm.datadiscounts = data.data.taxs;
          vm.customerDetail.city = vm.customerDetail.city === '' ? 0 : parseInt(vm.customerDetail.city);
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function removeDatarate(data) {
      var pendingfees = [];
      var rates = [];
      data = $filter("filter")(data, function (e) {
        var isDuplicate = rates.includes(e.rateId);
        if (!isDuplicate) {
          rates.push(e.rateId);
          return true;
        }
        return false;
      });
      data.forEach(function (value, key) {
        var savediscount = {
          clientId: value.clientId,
          contractId: value.contractId,
          contractName: value.contractName,
          nameRate: value.nameRate,
          rateCode: value.rateCode,
          rateId: value.rateId,
          statusType: value.statusType,
          selected: value.statusType === 1 ? true : false
        }
        pendingfees.push(savediscount);
      });
      return pendingfees;
    }
    //Función que le da formato de moneda a un valor numérico cuando es cargado en un control.
    function currencyLoad(valueData, symbol, penny) {
      try {
        var num = valueData.replace(/\,/g, penny ? '' : '.');
        num = num.replace(symbol, '');
        num = num.replace(' ', '');
        if (num.lastIndexOf('-') !== -1) {
          num = num.slice(0, -1);
        }
        if ((num.substr(-2, 1) === '.' || num.substr(-3, 1) === '.' || num.substr(-4, 1) === '.')) {
          num = num.slice(0, -1);
        }
        if (num === '' || num === ' ') {
          num = penny ? '0.00' : '0';
        }
        if (penny) {
          num = parseFloat(num).toFixed(2);
        }
        num = num.split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        valueData = symbol.trim() + ' ' + num.replace('.,', ',');
      } catch (ex) {
        valueData = symbol.trim() + (penny ? '0.00' : '0');
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
        inputCtrl.$setViewValue(symbol.trim() + (penny ? '0.00' : '0'));
        inputCtrl.$render();
      }
    }
    //Función que solo permite la digitación de números y punto decimal en una caja de texto. (Evento KeyPress).
    function numericKeyPress(e, inputCtrl) {
      var caracter = String.fromCharCode(e.keyCode);
      var reg = /[^0-9.]/g;
      if (reg.test(caracter)) {
        //inputCtrl.$rollbackViewValue();
        var num = inputCtrl.$modelValue.replace(/[^0-9.]/g, '');
        //vm.maxAmount = num;
        if (num.lastIndexOf(caracter) !== -1) {
          num = num.replace(caracter, '');
        }
        $('#' + inputCtrl.$name)[0].value = vm.symbol.trim() + ' ' + num;
        inputCtrl.$setViewValue($('#' + inputCtrl.$name)[0].value);
        inputCtrl.$render();
        //vm.maxAmount = inputCtrl.$modelValue;
      } else {
        var num = inputCtrl.$modelValue.replace(/[^0-9.]/g, '');
        //vm.maxAmount = num;
        $('#' + inputCtrl.$name)[0].value = vm.symbol.trim() + ' ' + num.replace(caracter, '');
        inputCtrl.$setViewValue($('#' + inputCtrl.$name)[0].value);
        inputCtrl.$render();
      }

      if (inputCtrl.$modelValue === undefined) {
        return '';
      }
    }
    //Función que devuelve la normalización de un valor monetario en formato numérico estandar
    function normalizeNumberFormat(valueCurrency, symbol) {
      return valueCurrency.replace(/\,/g, '').replace(symbol, '');
    }
    //** Método para el focus del control**//
    function focusSelect(nameCtrl) {
      document.getElementById(nameCtrl).select();
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.customerDetail.id === null || vm.customerDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isRequiredPassword = true;
        setTimeout(function () {
          document.getElementById('code').focus()
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
        vm.isRequiredPassword = false;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isRequiredPassword = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  function validationController($scope, ratesasociates, close) {
    $scope.rates = ratesasociates;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();



