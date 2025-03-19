/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                order     @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('cashbox', cashbox);
  cashbox.$inject = ['cashboxDS', 'localStorageService', '$filter', 'logger'];
  /* @ngInject */
  function cashbox(cashboxDS, localStorageService, $filter, logger) {
    var directive = {
      templateUrl: 'app/widgets/userControl/cashbox.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        order: '=order',
        listener: '=?listener',
        resulttests: '=resulttests',
        returnresulttests: '=returnresulttests',
        havecashbox: '=?havecashbox'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.init = init;
        vm.order = 0;
        vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
        vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
        vm.dateFormatToSearch = '{format:"' + vm.dateFormat + '"}';
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.maxDiscountUser = auth.maxDiscount;
        vm.generaldiscountmanagement = localStorageService.get('ManejoDescuentoGeneral') === 'True';
        vm.copaybypercentage = localStorageService.get('CopagoPorcentaje') === 'True';
        vm.isAddressCharge = localStorageService.get('CargoDomicilio') === 'True';

        //Variables de vista
        vm.paymentTypes = [];
        vm.cards = [];
        vm.banks = [];
        vm.payers = [];
        vm.payments = [];
        vm.addPayDisabled = false;
        //Funciones
        vm.selectPaymentType = selectPaymentType;
        vm.loadCards = loadCards;
        vm.loadprovider = loadprovider;
        vm.loadBanks = loadBanks;
        vm.load = load;
        vm.maxDiscountValue = maxDiscountValue;
        vm.recalculate = recalculate;
        vm.changeDiscountType = changeDiscountType;
        vm.addPayment = addPayment;
        vm.eventChangePayment = eventChangePayment;
        vm.eventClickDeletePayment = eventClickDeletePayment;
        vm.eventClickSave = eventClickSave;
        vm.eventClickDeleteAll = eventClickDeleteAll;
        vm.eventFocusValue = eventFocusValue;
        vm.subtracttax = localStorageService.get('RestarImpuesto') === 'True';
        //Variables internas de configuración
        vm.symbolCurrency = localStorageService.get('SimboloMonetario');
        vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
        vm.penny = vm.isPenny ? 2 : 0;
        vm.pennycontroller = vm.penny === 2 ? 1 : 0
        vm.taxConfig = Number(localStorageService.get('Impuesto'));
        vm.closemodal = closemodal;
        vm.tests = [];
        vm.modalConfirm = UIkit.modal('#modalConfirm', { modal: false, keyboard: false, bgclose: false, center: true });
        vm.modalTest = UIkit.modal('#modalTest', { modal: false, keyboard: false, bgclose: false, center: true });
        vm.modalBalance = UIkit.modal('#modalBalance', { modal: false, keyboard: false, bgclose: false, center: true });
        vm.save = save;
        vm.deleteCashbox = deleteCashbox;
        vm.keyOnlyNumber = keyOnlyNumber;
        vm.normalizeNumberFormat = normalizeNumberFormat;
        vm.openTests = openTests;
        vm.subtractCopay = localStorageService.get('RestarCopago') === 'True';
        vm.permissionuser = localStorageService.get('user');
        vm.changeCopayType = changeCopayType;
        vm.disabledcopayType = false;

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.discount = 0;
            vm.copay = 0;
            vm.viewprovider = localStorageService.get('Facturacion') !== '0';
            loadPaymentTypes(function (load) {
              if (load) {
                vm.addPayDisabled = false;
                vm.loadCards();
                vm.loadBanks();
                vm.loadprovider();
                vm.load();
                UIkit.modal('#cashbox').show();
              } else {
                UIkit.modal('#cashbox').show();
              }
            });
          }
          $scope.openmodal = false;
        });

        $scope.$watch('resulttests', function () {
          if ($scope.resulttests !== undefined) {
            vm.tests = $scope.resulttests;
          }
        });

        $scope.$watch('order', function () {
          vm.order = $scope.order;
        });

        /**
         * Carga los tipos de pago en la variable local
         */
        function loadPaymentTypes(callback) {
          vm.paymentTypes = [];
          cashboxDS.getActivePaymentTypes(auth.authToken).then(
            function (response) {
              if (response.status === 200) {
                //Se tienen tipos de pago activos
                vm.paymentTypes = response.data;
                callback(true);
              } else {
                //No se tienen tipos de pagos, se muestra mensaje y se cierra la ventana
                callback(false);
              }
            },
            function (error) {
              vm.modalError(error);
              callback(false);
            }
          );
        }

        /**
         * Se realiza el carge de las tarjetas
         */
        function loadCards() {
          vm.cards = [];
          cashboxDS.getActiveCards(auth.authToken).then(
            function (response) {
              if (response.status === 200) {
                //Se tienen tarjetas activas
                vm.cards = response.data;
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }

        /**
     * Se realiza el carge de las tarjetas
     */
        function loadprovider() {
          vm.cards = [];
          cashboxDS.getprovider(auth.authToken).then(
            function (response) {
              if (response.status === 200) {
                //Se tienen tarjetas activas
                vm.provider = response.data;
                if (vm.viewprovider) {
                  vm.providerid = vm.provider[0].id;
                } else {
                  vm.providerid = 0;
                }
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }

        /**
         * Se realiza la carga de bancos
         */
        function loadBanks() {
          vm.banks = [];
          cashboxDS.getActiveBanks(auth.authToken).then(
            function (response) {
              if (response.status === 200) {
                //Se tienen bancos activos
                vm.banks = response.data;
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }

        function load() {
          vm.payers = [];
          vm.payments = [];
          vm.paymentFocus = 0;
          var indx = 0;
          vm.paymentsExists = false;
          if (vm.order !== undefined && vm.order !== null) {
            cashboxDS.getCashbox(auth.authToken, vm.order).then(function (response) {

              $scope.havecashbox = response.data.hasOwnProperty('header') || response.data.payments.length !== 0;
              vm.haveCashBox = response.data.hasOwnProperty('header') || response.data.payments.length !== 0;
              var tests = vm.tests;
              var payers = [];
              var billing = null;
              var billingPerRate = null;
              var payersRate = [];
              var taxRate = [];
              vm.totalToPaid = 0;
              vm.balance = 0;
              vm.allpayments = 0;
              vm.copay = 0;
              vm.fee = 0;
              vm.costtest = 0;
              vm.symbol = '(' + vm.symbolCurrency + ')';
              vm.charge = 0;

              tests.forEach(function (test, index) {
                if (test.billing) {
                  vm.costtest = vm.costtest + test.patientPrice;
                  test.billing.tax = test.billing.tax === undefined ? vm.taxConfig : test.billing.tax;

                  billing = payers.find(function (a) {
                    return a.rate.id === test.billing.rate.id && a.tax === test.billing.tax;
                  });

                  if (billing !== undefined) {
                    //Se encuentra entonces suma el valor
                    billing.subTotal = billing.subTotal + test.billing.patientPrice;
                    billing.dicountvaluetest = billing.dicountvaluetest + test.Valuediscount;

                    var restdiscount = test.billing.patientPrice - test.Valuediscount;
                    var taxValue = $filter('currency')(restdiscount * (test.billing.tax / 100), vm.symbolCurrency, vm.penny);
                    test.taxValue = vm.normalizeNumberFormat(taxValue, vm.symbolCurrency);

                    if (vm.subtracttax) {
                      var totaltest = $filter('currency')(restdiscount - test.taxValue, vm.symbolCurrency, vm.penny);
                      totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                    } else {
                      var totaltest = $filter('currency')(restdiscount + test.taxValue, vm.symbolCurrency, vm.penny);
                      totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                    }
                    billing.taxValue = billing.taxValue + test.taxValue;
                    billing.totalWithTax = billing.totalWithTax + totaltest;
                  } else {
                    //No se encuentra entonces lo agregar al arreglo
                    var numTest = _.filter(vm.tests, function (v) {
                      return v.rate.id === test.billing.rate.id;
                    }).length.toString();
                    var restdiscount = test.billing.patientPrice - test.Valuediscount;

                    var taxValue = $filter('currency')(restdiscount * (test.billing.tax / 100), vm.symbolCurrency, vm.penny);
                    test.taxValue = vm.normalizeNumberFormat(taxValue, vm.symbolCurrency);

                    if (vm.subtracttax) {
                      var totaltest = $filter('currency')(restdiscount - test.taxValue, vm.symbolCurrency, vm.penny);
                      totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                    } else {
                      var totaltest = $filter('currency')(restdiscount + test.taxValue, vm.symbolCurrency, vm.penny);
                      totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                    }
                    payers.push({
                      'order': vm.order,
                      'rate': {
                        'id': test.billing.rate.id,
                        'name': test.billing.rate.name
                      },
                      'subTotal': test.billing.patientPrice,
                      'discountType': '0',
                      'discountValueRate': test.Valuediscount,
                      'discountPercentRate': test.discount,
                      'dicountvaluetest': test.Valuediscount,
                      'discountValue': 0,
                      'discountPercent': 0,
                      'discount': $filter('currency')(0, vm.symbolCurrency, vm.penny),
                      'totalWithDiscount': 0,
                      'tax': test.billing.tax,
                      'taxValue': test.taxValue,
                      'copay': 0,
                      'fee': 0,
                      'totalToPaid': 0,
                      'totalPaid': 0,
                      'balance': 0,
                      'totalWithTax': totaltest,
                      'numtest': 'filter_' + (numTest > 9 ? '9_plus' : numTest),
                      'toolnumtest': numTest > 9 ? numTest + ' ' + $filter('translate')('0013') : '',
                      'copayType': '0',
                      'charge': 0
                    });
                  }
                }
              });

              payers.forEach(function (payer, index) {
                taxRate.push({ 'idRate': payer.rate.id, 'tax': payer.tax });
                //Se agrupan solo por tarifa
                billingPerRate = payersRate.find(function (b) {
                  return b.rate.id === payer.rate.id;
                });
                if (billingPerRate !== undefined) {
                  //Se encuentra entonces suma el valor
                  billingPerRate.subTotal = billingPerRate.subTotal + payer.subTotal;
                  billingPerRate.taxValue += payer.taxValue;
                  billingPerRate.dicountvaluetest += payer.dicountvaluetest;
                  billingPerRate.discountValueRate += payer.discountValueRate;
                  billingPerRate.discountPercentRate += payer.discountPercentRate;
                  billingPerRate.totalWithTax += payer.totalWithTax;
                } else {
                  var restdiscount = payer.subTotal - payer.dicountvaluetest;
                  if (vm.subtracttax) {
                    var totaltest = $filter('currency')(restdiscount - payer.taxValue, vm.symbolCurrency, vm.penny);
                    totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                  } else {
                    var totaltest = $filter('currency')(restdiscount + payer.taxValue, vm.symbolCurrency, vm.penny);
                    totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
                  }
                  //No se encuentra entonces lo agregar al arreglo
                  payersRate.push({
                    'order': vm.order,
                    'rate': {
                      'id': payer.rate.id,
                      'name': payer.rate.name
                    },
                    'subTotal': payer.subTotal,
                    'discountType': '0',
                    'discountValue': 0,
                    'discountPercent': 0,
                    'discount': 0,
                    'taxs': $filter('filter')(taxRate, { idRate: payer.rate.id }, true),
                    'totalWithDiscount': payer.totalWithDiscount,
                    'taxValue': payer.taxValue,
                    'totalWithTax': totaltest,
                    'dicountvaluetest': payer.dicountvaluetest,
                    'discountValueRate': payer.discountValueRate,
                    'discountPercentRate': payer.discountPercentRate,
                    'copay': 0,
                    'fee': 0,
                    'totalToPaid': payer.totalToPaid,
                    'totalPaid': 0,
                    'balance': payer.balance,
                    'numtest': payer.numtest,
                    'toolnumtest': payer.toolnumtest,
                    'copayType': '0',
                    'charge': 0
                  });
                }
              });
              payersRate.forEach(function (value) {
                vm.totalToPaid += value.totalWithTax;
              });
              vm.payers = payersRate;

              if (response.data.hasOwnProperty('header') || response.data.payments.length !== 0) {
                vm.discountType = '0';
                vm.copayType = response.data.header.copayType == 1 ? '1' : '0';
                vm.discount = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.totalWithDiscount = 0;
                vm.valueDiscount = 0;
                vm.balance = 0;
                vm.discount = 0;
                vm.copay = 0;
                vm.fee = 0;
                vm.charge = 0;
                vm.allpayments = 0;
                vm.disabledcopayType = true;
                //Carga los pagos
                if (response.data.payments.length !== 0) {
                  response.data.payments.forEach(function (value) {
                    value.disabledBank = !value.paymentType.bank;
                    value.disabledCard = !value.paymentType.card;
                    value.disabledNumber = !value.paymentType.number;
                    value.index = indx;
                    indx++;
                  });
                  if (response.data.payments[response.data.payments.length - 1].payment === 0 && response.data.payments.length === 1) {
                    vm.payments = [];
                  } else {
                    vm.payments = response.data.payments;
                    vm.payments.forEach(function (pay) {
                      pay.payment = $filter('currency')(pay.payment, vm.symbolCurrency, vm.penny);
                    });
                  }
                  //Carga los totales de caja.
                  cashboxDS.getCashboxTotals(auth.authToken, vm.order).then(function (response2) {
                    vm.paymentsExists = response2.status === 200;
                    if (response2.status === 200) {
                      vm.allpayments = response2.data[0].allpayments;
                      vm.balance = response2.data[0].totalbalance;
                      vm.discount = 0;
                      vm.discountType = '0';
                      vm.symbol = '(' + vm.symbolCurrency + ')';
                      vm.discount = $filter('currency')(vm.discount, vm.symbolCurrency, vm.penny);
                      if (response2.data[0].discountPercent !== 0 || response2.data[0].discountPercent === undefined) {
                        //Si el descuento es por porcentaje
                        vm.discount = response2.data[0].discountPercent === undefined ? 0 : response2.data[0].discountPercent;
                        var discounttotal = $filter('currency')((vm.totalToPaid * vm.discount / 100), vm.symbolCurrency, vm.penny);
                        discounttotal = vm.normalizeNumberFormat(discounttotal, vm.symbolCurrency);
                        vm.totalWithDiscount = $filter('currency')(vm.totalToPaid - discounttotal, vm.symbolCurrency, vm.penny);
                        vm.totalWithDiscount = vm.normalizeNumberFormat(vm.totalWithDiscount, vm.symbolCurrency);
                        vm.valueDiscount = vm.totalToPaid * (vm.discount / 100);
                        vm.discountType = '1';
                        vm.symbol = '(%)';
                        vm.discount = $filter('number')(vm.discount, vm.penny);
                      } else {
                        //Si el descuento es por valor
                        vm.discount = response2.data[0].discountValue;
                        vm.totalWithDiscount = $filter('currency')(vm.totalToPaid - vm.discount, vm.symbolCurrency, vm.penny);
                        vm.totalWithDiscount = vm.normalizeNumberFormat(vm.totalWithDiscount, vm.symbolCurrency);
                        vm.valueDiscount = 0;
                        vm.discountType = '0';
                        vm.symbol = '(' + vm.symbolCurrency + ')';
                        vm.discount = $filter('currency')(vm.discount, vm.symbolCurrency, vm.penny);
                      }

                      // vm.copaytotal = $filter('currency')(response2.data[0].copay, vm.symbolCurrency, vm.penny);
                      vm.copaytotal = response2.data[0].copay;
                      vm.fee = $filter('currency')(response2.data[0].fee, vm.symbolCurrency, vm.penny);

                      var totalCharge = response2.data[0].charge === null || response2.data[0].charge === undefined ? 0 : response2.data[0].charge;
                      vm.charge = $filter('currency')(totalCharge, vm.symbolCurrency, vm.penny);

                      var copay = response2.data[0].copay;

                      if (vm.generaldiscountmanagement) {
                        var totalCopay = vm.totalWithDiscount;
                      } else {
                        var totalCopay = vm.totalToPaid;
                      }

                      if (vm.copayType == '1') {
                        //Si el descuento es por porcentaje
                        vm.copay = copay / totalCopay * 100;
                        vm.valueCopay = vm.copaytotal;
                        vm.copayAux = vm.copay;
                        vm.symbol = '(%)';
                        vm.copay = $filter('number')(vm.copay, vm.penny);
                      } else {
                        //Si el descuento es por valor
                        vm.valueCopay = copay;
                        vm.copayAux = copay;
                        vm.symbol = '(' + vm.symbolCurrency + ')';
                        vm.copay = $filter('currency')(copay, vm.symbolCurrency, vm.penny);
                      }
                      vm.recalculate();
                    }
                  });
                } else {
                  vm.discountType = '0';
                  vm.copayType = '0';
                  vm.discount = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                  vm.copay = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                  vm.fee = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                  vm.charge = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                  vm.totalWithDiscount = vm.totalToPaid;
                  vm.balance = vm.totalToPaid;
                  vm.disabledcopayType = false;
                }
              } else {
                //Carga los pagadores que tenga la orden con su debido dato
                vm.discountType = '0';
                vm.copayType = '0';
                vm.discount = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.copay = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.fee = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.charge = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.totalWithDiscount = vm.totalToPaid;
                vm.balance = vm.totalToPaid;
                vm.disabledcopayType = false;
              }
            },
              function (error) {
                vm.modalError(error);
              }
            );
          }
        }

        /**
         * Evento de cuando se selecciona el tipo de pago
         * @param {*} paymentType Tipo de Pago seleccionado
         */
        function selectPaymentType(payment, index) {
          var payments = vm.payments;
          var paymentObj = payments.find(function (a) { return a.index === payment.index; });
          if (paymentObj !== undefined) {
            paymentObj.bank = { 'id': -1 };
            paymentObj.card = { 'id': -1 };
            paymentObj.number = '';
            paymentObj.disabledBank = !paymentObj.paymentType.bank;
            paymentObj.disabledCard = !paymentObj.paymentType.card;
            paymentObj.disabledNumber = !paymentObj.paymentType.number;
          }
          vm.payments = payments;
        }

        /**
         * Evento de cuando se cambia el descuento
         */
        function changeDiscountType() {
          vm.discount = 0;
          vm.recalculate();
        }

        /**
         * Evento de cuando se cambia el copago
         */
        function changeCopayType() {
          vm.copay = 0;
          vm.copayAux = 0;
          vm.recalculate();
        }

        /**
         * Evento cuando ocurre un cambio en un pago
         * @param {*} payment Registro de pago modificado
         * @param {*} e Objeto que dispara el evento
         */
        function eventChangePayment(payment, e) {
          var comparated = $filter('currency')(vm.balance + vm.paymentFocus, vm.symbolCurrency, vm.penny);
          comparated = vm.normalizeNumberFormat(comparated, vm.symbolCurrency);
          payment.payment = vm.normalizeNumberFormat(payment.payment, vm.symbolCurrency);
          if (payment.payment <= comparated) {
            vm.recalculate();
          } else {
            vm.modalBalance.show();
            payment.payment = vm.paymentFocus;
            vm.recalculate();

          }
          payment.payment = $filter('currency')(payment.payment, vm.symbolCurrency, vm.penny);
        }

        /**
         * Evento cuando se elimina un pago
         * @param {*} payment Registro del pago
         */
        function eventClickDeletePayment(payment, index) {
          vm.paymentTypeslist = $filter("filter")(JSON.parse(JSON.stringify(vm.paymentTypes)), function (e) {
            return parseInt(payment.paymentType.id) !== e.id
          });
          vm.payments[index].payment = 0;
          vm.eventChangePayment(payment, index);
          if (vm.paymentsExists) {
            vm.payments[index].active = false;
          } else {
            vm.payments.splice(index, 1);
            if (!vm.paymentsExists) {
              vm.payments.forEach(function (pay, key) {
                pay.index = key;
              });
            }
          }
        }

        /**
         * Valida el valor maximo que puede tener el descuento
         * @param {*} rateId Id Tarifa
         * @param {*} discountValue Valor del descuento
         * @param {*} discountType Tipo de descuento
         * @param {*} subTotal Subtotal
         * @param {*} e Evento
         */
        function maxDiscountValue(discount, discountType, e) {
          vm.keyOnlyNumber(e);

          if (discount !== null) {
            if (discountType === '0') {
              var maxDiscountUser = (vm.maxDiscountUser / 100) * vm.totalToPaid;
              if (vm.normalizeNumberFormat(discount, vm.symbolCurrency) > maxDiscountUser) {
                vm.discount = maxDiscountUser;
                e.target.value = maxDiscountUser;
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            } else {
              if (vm.normalizeNumberFormat(discount, vm.symbolCurrency) > vm.maxDiscountUser) {
                vm.discount = vm.maxDiscountUser;
                vm.valueDiscount = (vm.totalToPaid * (vm.discount / 100));
                e.target.value = vm.maxDiscountUser;
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }
          }
        }

        vm.controldinner = controldinner;
        function controldinner(e) {
          vm.keyOnlyNumber(e);
          e.preventDefault();
          e.stopPropagation();
        }

        function keyOnlyNumber(e) {
          var expreg = new RegExp(/^[0-9]*\.?[0-9]*$/);
          if (!vm.isPenny) {
            expreg = new RegExp(/^[0-9]+$/);
          }
          var keyCode = e !== undefined ? (e.which || e.keyCode) : undefined;
          if (!expreg.test(String.fromCharCode(keyCode)) || (e.target.value.indexOf('.') !== -1 && String.fromCharCode(e.keyCode) === '.')) {
            //Detiene toda accion en la caja de texto
            event.preventDefault();
            return;
          }
        }

        /**
         * Evento que se realiza para guardar la orden
         */
        function eventClickSave(transaction) {
          vm.transaction = transaction;
          //Valida si tiene algun pago
          if ($filter('filter')(vm.payments, { active: true }, true).length > 0) {
            //Si tiene pagos valida que el balance no este en 0
            if (vm.balance > 0) {
              vm.message = $filter('translate')('0881');
              //Muestra mensaje si se esta seguro de guardar con saldo pendiente
              vm.modalConfirm.show();
            } else {
              //Guardar la caja normalmente
              vm.save(vm.transaction);
            }
          } else {
            //Si no tiene pagos muestra un mensaje indicando si esta seguro de guardar sin pagos
            vm.message = $filter('translate')('0882');
            vm.modalConfirm.show();
          }
        }

        /**
         * Guarda los registros de caja
         */
        function save(transaction) {
          if (transaction !== 'save') return;

          vm.openTests(vm.payers[0].rate.id, vm.payers[0].rate.name, true);
          var header = {
            'id': vm.payers[0].id !== null && vm.payers[0].id !== undefined ? vm.payers[0].id : -1,
            'order': vm.order,
            'rate': vm.payers[0].rate,
            'subTotal': vm.costtest,
            'discountValue': vm.discountType === '0' ? vm.normalizeNumberFormat(vm.discount, vm.symbolCurrency) : '0',
            'discountPercent': vm.discountType === '1' ? vm.normalizeNumberFormat(vm.discount, vm.symbolCurrency) : '0',
            'taxValue': vm.totalTaxValue,
            'discountValueRate': vm.payers[0].discountValueRate,
            'discountPercentRate': vm.payers[0].discountPercentRate,
            'copay': vm.normalizeNumberFormat(vm.valueCopay, vm.symbolCurrency),
            'fee': vm.normalizeNumberFormat(vm.fee, vm.symbolCurrency),
            'totalPaid': vm.allpayments,
            'balance': vm.balance,
            'copayType': vm.copayType,
            'charge': vm.normalizeNumberFormat(vm.charge, vm.symbolCurrency)
          }

          var payments = [];
          vm.payments.forEach(function (value, key) {
            var bank = {
              'id': value.bank !== undefined ? value.bank.id : null,
              'name': value.bank !== undefined ? value.bank.name : null,
              'state': true
            };
            var card = {
              'id': value.card !== undefined ? value.card.id : null,
              'name': value.card !== undefined ? value.card.name : null,
              'state': true
            };
            payments.push({
              'id': value.id === undefined ? null : value.id,
              'order': vm.order,
              'bank': value.bank === undefined ? null : bank,
              'card': value.card === undefined ? null : card,
              'paymentType': value.paymentType,
              'active': value.active,
              'number': value.number,
              'payment': vm.normalizeNumberFormat(value.payment, vm.symbolCurrency)
            });
          });

          var json = {
            'order': vm.order,
            'header': header,
            'payments': payments,
            'provider': { id: vm.providerid }
          };

          cashboxDS.saveCashbox(auth.authToken, json).then(function (response) {
            if (response.status === 200) {
              vm.recalculate();
              var jsonTotals = {
                'order': vm.order,
                'payment': vm.totalToPaid,
                'allpayments': vm.allpayments,
                'totalbalance': vm.balance,
                'discountValue': vm.discountType === '0' ? vm.normalizeNumberFormat(vm.discount, vm.symbolCurrency) : '0',
                'discountPercent': vm.discountType === '1' ? vm.normalizeNumberFormat(vm.discount, vm.symbolCurrency) : '0',
                'copay': vm.normalizeNumberFormat(vm.valueCopay, vm.symbolCurrency),
                'fee': vm.normalizeNumberFormat(vm.fee, vm.symbolCurrency),
                'charge': vm.normalizeNumberFormat(vm.charge, vm.symbolCurrency),
              };
              var method = vm.paymentsExists ? 'PUT' : 'POST';
              cashboxDS.saveCashboxTotals(auth.authToken, jsonTotals, method).then(function (response2) {
                if (response2.status === 200) {
                  logger.success($filter('translate')('0149'));
                  $scope.havecashbox = true;
                  vm.haveCashBox = true;
                  vm.closemodal();
                }
              },
                function (error) {
                  vm.modalError(error);
                });
            }
          },
            function (error) {
              vm.modalError(error);
            });
        }

        function eventClickDeleteAll(transaction) {
          vm.transaction = transaction;
          //Si no tiene pagos muestra un mensaje indicando si esta seguro de guardar sin pagos
          vm.message = $filter('translate')('0932').replace('@@@@', vm.order);
          vm.modalConfirm.show();

        }

        function deleteCashbox(transaction) {
          if (transaction !== 'delete') return;
          cashboxDS.deleteCashbox(auth.authToken, vm.order).then(function (response) {
            if (response.status === 200) {
              logger.success($filter('translate')('0149'));
              $scope.havecashbox = false;
              vm.haveCashBox = false;
              vm.closemodal();
            }
          });
        }
        function addPayment() {
          vm.paymentTypeslist = [];
          vm.idpaymen = vm.idpaymen === undefined ? [] : vm.idpaymen;
          if (vm.payments.length === 0) {
            vm.paymentTypeslist = JSON.parse(JSON.stringify(vm.paymentTypes));
            vm.idpaymen.push(1);
            vm.payments.push({
              'id': null,
              'index': vm.payments.length + 1,
              'paymentType': {
                'id': '1'
              },
              'bank': {
                'id': '-1'
              },
              'disabledBank': true,
              'card': {
                'id': '-1'
              },
              'disabledCard': true,
              'number': '',
              'disabledNumber': true,
              'payment': $filter('currency')(0, vm.symbolCurrency, vm.penny),
              'active': true
            });
          } else {
            var paymentTypeslist = vm.payments.length < vm.paymentTypes.length ? vm.payments.length : vm.paymentTypes.length - 1
            var comparated = $filter("filter")(JSON.parse(JSON.stringify(vm.payments)), function (e) {
              return vm.normalizeNumberFormat(e.payment, vm.symbolCurrency) === 0 && e.active === true;
            })
            if (comparated.length === 0) {
              vm.payments.push({
                'id': null,
                'index': vm.payments.length + 1,
                'paymentType': {
                  'id': vm.paymentTypes[paymentTypeslist].id
                },
                'bank': {
                  'id': '-1'
                },
                'disabledBank': true,
                'card': {
                  'id': '-1'
                },
                'disabledCard': true,
                'number': '',
                'disabledNumber': true,
                'payment': $filter('currency')(0, vm.symbolCurrency, vm.penny),
                'active': true
              });
            }
            else {
              logger.warning($filter('translate')('1615'));
            }
          }
        }

        /**
         * Recalcula los headers
         */
        function recalculate(copay) {
          vm.discount = vm.normalizeNumberFormat(vm.discount, vm.symbolCurrency);

          vm.copay = vm.copay === "" ? 0 : vm.normalizeNumberFormat(vm.copay, vm.symbolCurrency);
          vm.fee = vm.normalizeNumberFormat(vm.fee, vm.symbolCurrency);
          vm.charge = vm.normalizeNumberFormat(vm.charge, vm.symbolCurrency);

          vm.feeAux = vm.fee;
          vm.chargeAux = 0;
          if (vm.isAddressCharge) {
            vm.chargeAux = vm.charge
          }

          vm.fee = $filter('currency')(vm.fee, vm.symbolCurrency, vm.penny);
          vm.charge = $filter('currency')(vm.charge, vm.symbolCurrency, vm.penny);

          vm.totalToPaid = $filter('currency')(vm.totalToPaid, vm.symbolCurrency, vm.penny);
          vm.totalToPaid = vm.normalizeNumberFormat(vm.totalToPaid, vm.symbolCurrency);

          if (vm.discountType === '0') {
            //Si el descuento es por valor
            var totalWithDiscount = $filter('currency')(vm.totalToPaid - vm.discount, vm.symbolCurrency, vm.penny);
            totalWithDiscount = vm.normalizeNumberFormat(totalWithDiscount, vm.symbolCurrency);
            vm.totalWithDiscount = totalWithDiscount;
            vm.valueDiscount = 0;
            vm.discount = $filter('currency')(vm.discount, vm.symbolCurrency, vm.penny);
            vm.symbol = '(' + vm.symbolCurrency + ')';
          } else {
            //Si el descuento es por porcentaje
            if (vm.discount > vm.maxDiscountUser) vm.discount = vm.maxDiscountUser;
            var discounttotal = $filter('currency')((vm.totalToPaid * vm.discount / 100), vm.symbolCurrency, vm.penny);
            discounttotal = vm.normalizeNumberFormat(discounttotal, vm.symbolCurrency);
            var totalWithDiscount = $filter('currency')(vm.totalToPaid - discounttotal, vm.symbolCurrency, vm.penny);
            totalWithDiscount = vm.normalizeNumberFormat(totalWithDiscount, vm.symbolCurrency);

            var valueDiscount = vm.totalToPaid * vm.discount / 100;
            //  valueDiscount = vm.normalizeNumberFormat(valueDiscount, vm.symbolCurrency);

            vm.totalWithDiscount = totalWithDiscount;
            vm.valueDiscount = valueDiscount;
            vm.discount = $filter('number')(vm.discount, vm.penny);
            vm.symbol = '(%)';
          }

          if (vm.copayType === '0') {
            vm.valueCopay = 0;
            vm.copay = $filter('currency')(vm.copay, vm.symbolCurrency, vm.penny);
            vm.valueCopay = vm.normalizeNumberFormat(vm.copay, vm.symbolCurrency);
            vm.symbol = '(' + vm.symbolCurrency + ')';
          } else {
            //Si el copago es por porcentaje
            if (vm.copay > 100) vm.copay = 100;
            var totalValueCopay = 0;
            if (vm.generaldiscountmanagement) {
              totalValueCopay = vm.totalWithDiscount;
            } else {
              totalValueCopay = vm.totalToPaid;
            }
            //var copaytotal = $filter('currency')((totalValueCopay * vm.copay / 100), vm.symbolCurrency, vm.penny);
            // copaytotal = vm.normalizeNumberFormat(copaytotal, vm.symbolCurrency);
            vm.valueCopay = totalValueCopay * vm.copay / 100;
            vm.copay = $filter('number')(vm.copay, vm.penny);
            vm.symbol = '(%)';
          }

          //Calcula los abonos realizados
          var payments = 0;
          vm.payments.forEach(function (pay, key) {
            payments += (pay.payment !== null && pay.payment != undefined ? vm.normalizeNumberFormat(pay.payment, vm.symbolCurrency) : 0);
          });
          vm.allpayments = payments;

          var balance = $filter('currency')((vm.totalWithDiscount - vm.allpayments) + (vm.feeAux + vm.chargeAux + vm.valueCopay), vm.symbolCurrency, vm.penny);
          if (vm.subtractCopay) {
            balance = $filter('currency')((vm.totalWithDiscount - vm.allpayments) + vm.feeAux + vm.chargeAux - vm.valueCopay, vm.symbolCurrency, vm.penny);
          }

          balance = vm.normalizeNumberFormat(balance, vm.symbolCurrency);
          vm.balance = balance;

          if (vm.balance < 0) {

            vm.totalWithDiscount = vm.totalToPaid;
            if (vm.discountType === '0') {
              vm.discount = $filter('currency')(0, vm.symbolCurrency, vm.penny);
            } else {
              vm.discount = $filter('number')(0, 2);
            }

            if (vm.copayAux !== 0) {
              if (vm.copayType === '0') {
                vm.copay = $filter('currency')(vm.copayAux, vm.symbolCurrency, vm.penny);
                var copaytotal = vm.normalizeNumberFormat(vm.copay, vm.symbolCurrency);
                vm.valueCopay = copaytotal;
              } else {
                var totalCopay = 0;
                if (vm.generaldiscountmanagement) {
                  totalCopay = vm.totalWithDiscount;
                } else {
                  totalCopay = vm.totalToPaid;
                }
                // var copaytotal = $filter('currency')((totalCopay * vm.copayAux / 100), vm.symbolCurrency, vm.penny);
                //copaytotal = vm.normalizeNumberFormat(copaytotal, vm.symbolCurrency);
                vm.valueCopay = totalCopay * vm.copayAux / 100;
                vm.copay = $filter('number')(vm.copayAux, 2);
              }
            }

            var balance = $filter('currency')((vm.totalWithDiscount - vm.allpayments) + (vm.feeAux + vm.chargeAux + vm.valueCopay), vm.symbolCurrency, vm.penny);
            if (vm.subtractCopay) {
              balance = $filter('currency')((vm.totalWithDiscount - vm.allpayments) + vm.feeAux + vm.chargeAux - vm.valueCopay, vm.symbolCurrency, vm.penny);
            }

            balance = vm.normalizeNumberFormat(balance, vm.symbolCurrency);

            vm.balance = balance;
            vm.valueDiscount = 0;
            vm.modalBalance.show();
          } else {
            vm.addPayDisabled = vm.balance === 0;
          }
        }

        function openTests(idRate, nameRate, save) {
          vm.testsPerRate = $filter('filter')(vm.tests, { rate: { id: idRate } }, true);
          vm.nameRate = nameRate;
          vm.totalTaxValue = 0;
          vm.subTotal = 0;
          vm.totalWithTax = 0;
          vm.testsPerRate.forEach(function (value) {
            value.discountValueRate = value.Valuediscount;
            value.discountPercentRate = value.discount;
            value.taxs = value.billing.tax === undefined ? vm.taxConfig : value.billing.tax;
            value.taxsStr = $filter('number')(value.taxs, 2) + ' %';
            if (value.discount !== 0) {
              var calculatediscounttest = $filter('currency')((value.patientPrice * value.discount) / 100, vm.symbolCurrency, vm.penny)
              value.valuediscount = vm.normalizeNumberFormat(calculatediscounttest, vm.symbolCurrency);
            } else {
              value.valuediscount = 0;
            }
            value.codeName = value.code + ' - ' + value.name;
            var totaltest = value.patientPrice - value.valuediscount;
            value.taxValueCalculate = $filter('currency')(totaltest * ((value.taxs / 100)), vm.symbolCurrency, vm.penny);
            value.taxValueCalculate = vm.normalizeNumberFormat(value.taxValueCalculate, vm.symbolCurrency);
            if (vm.subtracttax) {
              totaltest = $filter('currency')(totaltest - value.taxValueCalculate, vm.symbolCurrency, vm.penny);
              totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
            } else {
              totaltest = $filter('currency')(totaltest + value.taxValueCalculate, vm.symbolCurrency, vm.penny);
              totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
            }
            value.total = totaltest;
            vm.totalTaxValue += value.taxValueCalculate;
            vm.subTotal += value.patientPrice;
            vm.totalWithTax += value.total;
          });
          if (!save) {
            vm.modalTest.show();
          }
        }

        //Función que devuelve la normalización de un valor monetario en formato numérico estandar
        function normalizeNumberFormat(valueCurrency, symbol) {
          try {
            return parseFloat(valueCurrency.replace(/\,/g, '').replace(symbol, ''));
          } catch (e) {
            return valueCurrency;
          }
        }

        function eventFocusValue(value, nameCtrl) {
          value = vm.normalizeNumberFormat(value, vm.symbolCurrency);
          if (nameCtrl !== 'discount') vm.paymentFocus = value;
          document.getElementById(nameCtrl).select();
        }

        function closemodal() {
          setTimeout(function () {
            $scope.listener(vm.order);
            $scope.returnresulttests = vm.tests;
            UIkit.modal('#cashbox').hide();
          }, 100);
        }
        /**
         * Funcion inicial de la directiva
        */
        function init() {
        }
        vm.init();
      }],
      controllerAs: 'cashbox'
    };
    return directive;
  }
})();
/* jshint ignore:end */
