/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('quote', quote);
    quote.$inject = ['testDS', 'orderDS', 'rateDS', 'userDS', 'localStorageService',
        '$filter', '$translate', 'LZString', 'logger'];
    /* @ngInject */
    function quote(testDS, orderDS, rateDS, userDS, localStorageService,
        $filter, $translate, LZString, logger) {
        var directive = {
            templateUrl: 'app/widgets/userControl/quote.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.patient = '';
                vm.discount = 0;
                vm.selectRate = selectRate;
                vm.selectedTests = [];
                vm.tests = [];
                vm.rates = [];
                vm.selectTest = selectTest;
                vm.generate = generate;
                vm.changeRate = changeRate;
                vm.changeDiscount = changeDiscount;
                vm.saveQuote = saveQuote;
                vm.searchQuote = searchQuote;
                vm.searchQuoteByPatient = searchQuoteByPatient;
                vm.loadQuote = loadQuote;
                vm.rate = null;
                vm.typefilter = '1';
                vm.totaldiscount = 0;
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.maxDate = moment().format();
                vm.maxend = moment().format();
                vm.min = moment().format();
                vm.startDate = moment().format();
                vm.endDate = moment().format();
                vm.tomorrow = new Date();
                vm.tomorrow.setDate(vm.tomorrow.getDate() - 90);
                vm.normalizeNumberFormat = normalizeNumberFormat;
                vm.max = 100;
                vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
                vm.taxgeneral = localStorageService.get('Impuesto') === '' || localStorageService.get('Impuesto') === null ? 0 : parseInt(localStorageService.get('Impuesto'));
                vm.taxquotegeneral = 0;
                vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.startChange = startChange;
                vm.endChange = endChange;
                vm.searchQuoteByDate = searchQuoteByDate;
                vm.cleanQuote = cleanQuote;
                vm.symbolCurrency = localStorageService.get('SimboloMonetario');
                vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
                vm.subtracttax = localStorageService.get('RestarImpuesto') === 'True';
                vm.penny = vm.isPenny ? 2 : 0;
                vm.pennycontroller = vm.penny === 2 ? 1 : 0
                vm.generaldiscountmanagement = localStorageService.get('ManejoDescuentoGeneral') === 'True';
                vm.priceexam = 0;
                vm.valuediscount = 0;
                vm.totaldiscount = 0;
                vm.totaltax = 0;
                vm.totaltaxvalue = 0;
                vm.isAddressCharge = localStorageService.get('CargoDomicilio') === 'True';
                vm.keyOnlyNumber = keyOnlyNumber;
                vm.eventFocusValue = eventFocusValue;
                vm.normalizeNumberFormat = normalizeNumberFormat;
                vm.addressCharge = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                vm.modalBalance = UIkit.modal('#modalBalance', { modal: false, keyboard: false, bgclose: false, center: true });
                vm.changeRateTests = changeRateTests;
                vm.loadRateTests = loadRateTests;
                vm.Quoteradio = Quoteradio;

                function loadRateTests(tests) {
                    vm.selectedTests.forEach(function (test) {
                        test.rate = vm.rate;
                        test.testRate = vm.rate;
                        var findTest = _.find(tests, function (o) { return o.testId === test.test.id; });
                        if (findTest) {
                            test.price = findTest.patientPrice;
                        } else {
                            test.price = 0;
                        }
                    });
                    vm.calculated();
                }

                function changeRateTests() {
                    if (vm.rate !== null && vm.rate !== undefined) {
                        if (vm.selectedTests.length > 0) {
                            var idsTests = [];
                            vm.selectedTests.forEach(function (test) {
                                idsTests.push(test.test.id);
                            });
                            var filter = {
                                'rateId': vm.rate.id,
                                'tests': idsTests
                            }
                            orderDS.getPriceTests(auth.authToken, filter).then(function (response) {
                                if (response.status === 200) {
                                    vm.loadRateTests(response.data);


                                }
                            },
                                function (error) {
                                    vm.Error = error;
                                    vm.ShowPopupError = true;
                                }
                            );
                        }
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
                    document.getElementById(nameCtrl).select();
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

                if ($filter('translate')('0000') === 'esCo') {
                    kendo.culture('es-ES');
                } else {
                    kendo.culture('en-US');
                }

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        $scope.totaltestquote = 0;
                        $scope.$broadcast('angucomplete-alt:clearInput', 'quote_rates');
                        vm.patient = '';
                        vm.priceexam = 0;
                        vm.taxquotegeneral = 0;
                        vm.valuediscount = 0;
                        vm.totaldiscount = 0;
                        vm.totaltax = 0;
                        vm.totaltaxvalue = 0;
                        vm.selectedTests = [];
                        vm.rate = null;
                        loadMaxDiscount();
                        loadTests();
                        loadRates();
                        UIkit.modal('#quote').show();
                    }
                    $scope.openmodal = false;
                });

                function startChange() {
                    if (vm.startDate) {
                        vm.startDate = new Date(vm.startDate);
                        vm.startDate.setDate(vm.startDate.getDate());
                        vm.min = vm.startDate;
                    } else if (vm.endDate) {
                        vm.maxDate = new Date(vm.endDate);
                        vm.startDate = new Date(vm.endDate);
                    } else {
                        vm.endDate = new Date();
                        vm.startDate = new Date();
                        vm.maxDate = vm.endDate;
                        vm.min = vm.endDate;
                    }
                    vm.searchQuoteByDate();
                }
                function endChange() {
                    if (vm.endDate) {
                        vm.endDate = new Date(vm.endDate);
                        vm.endDate.setDate(vm.endDate.getDate());
                        vm.maxDate = vm.endDate;
                    } else if (vm.startDate) {
                        vm.min = new Date(vm.startDate);
                        vm.endDate = new Date(vm.startDate);

                    } else {
                        vm.endDate = new Date();
                        vm.startDate = new Date();
                        vm.maxDate = vm.endDate;
                        vm.min = vm.endDate;
                    }
                    vm.searchQuoteByDate();
                }

                /**
                * Carga en el autocomplete los examenes configurados
                */
                function loadTests() {
                    orderDS.getTestToOrderEntry(auth.authToken).then(function (response) {
                        if (response.data.length > 0) {
                            var tests = [];
                            response.data.forEach(function (test, index) {
                                tests.push({
                                    'id': test.id,
                                    'area': {
                                        'id': test.area.id,
                                        'abbreviation': test.area.abbreviation,
                                        'name': test.area.name
                                    },
                                    'code': test.code,
                                    'abbr': test.abbr.toUpperCase(),
                                    'name': test.name.toUpperCase(),
                                    'colorType': (test.testType === 0 ? 'images/test.png' : (test.testType === 1 ? 'images/profile.png' : 'images/package.png')),
                                    'type': test.testType,
                                    'confidential': test.confidential,
                                    'sample': {
                                        'id': test.sample.id,
                                        'code': test.sample.code,
                                        'name': test.sample.name
                                    },
                                    'showValue': test.code + '. ' + test.name.toUpperCase()
                                });
                            });
                            tests = tests.sort(function (a, b) {
                                if (a.code.trim().length > b.code.trim().length) {
                                    return 1;
                                } else if (a.code.trim().length < b.code.trim().length) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            vm.tests = tests;

                        }
                    }, function (error) {
                        vm.Error = error;
                        vm.ShowPopupError = true;
                    });
                }

                function loadRates() {
                    vm.rates = [];
                    var rates = [];
                    rateDS.getState(auth.authToken).then(
                        function (response) {
                            var data = response.data;
                            data.forEach(function (rate, index) {
                                rates.push({
                                    'id': rate.id,
                                    'code': rate.code,
                                    'name': rate.name,
                                    'showValue': rate.code + '. ' + rate.name
                                });
                            });
                            vm.rates = rates;
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    );
                }

                function loadMaxDiscount() {
                    userDS.getUsersId(auth.authToken, auth.id).then(
                        function (response) {
                            vm.max = parseInt(response.data.maxDiscount);
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    );
                }

                function generate() {
                    var totalAddressCharge = 0
                    if (vm.isAddressCharge) {
                        totalAddressCharge = vm.normalizeNumberFormat(vm.addressCharge, vm.symbolCurrency);
                    }
                    var variables = [{
                        'patient': vm.patient.toUpperCase(),
                        'username': auth.userName,
                        'date': moment().format(vm.dateFormat),
                        'priceexam': vm.priceexam,
                        'valuediscount': vm.valuediscount,
                        'totaldiscount': vm.totaldiscount,
                        'totaltax': vm.totaltax,
                        'totaltaxvalue': vm.totaltaxvalue,
                        'viewdiscountgeneral': vm.max > 0 && vm.generaldiscountmanagement,
                        'addressCharge': totalAddressCharge
                    }];
                    var reportData = vm.selectedTests;
                    var report = {};
                    report.variables = variables;
                    if (vm.isPenny) {
                        report.pathreport = '/Report/pre-analitic/quote/quotepennies.mrt';
                    } else {
                        report.pathreport = '/Report/pre-analitic/quote/quoteinpennies.mrt';
                    }
                    report.labelsreport = JSON.stringify($translate.getTranslationTable());
                    var compressReportData = LZString.compressToUTF16(JSON.stringify(reportData));
                    localStorageService.set('parameterReport', report);
                    localStorageService.set('dataReport', compressReportData);
                    window.open('/viewreport/viewreport.html');
                }

                function changeRate(test) {
                    vm.totaldiscount = 0;
                    orderDS.getPriceTestOrder(auth.authToken, test.test.id, test.testRate.id).then(
                        function (response) {
                            test.price = response.data.patientPrice;
                            vm.calculated();
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    );
                }

                vm.calculated = calculated;
                function calculated() {
                    vm.totaltax = 0;
                    vm.priceexam = 0;
                    vm.insurancePriceexam = 0;
                    vm.selectedTests.forEach(function (value) {
                        value.insurancePricecant=$filter('currency')((value.insurancePricecant * parseInt(value.count)), vm.symbolCurrency, vm.penny);
                        value.insurancePricecant=vm.normalizeNumberFormat(value.insurancePricecant, vm.symbolCurrency);
                        vm.insurancePriceexam = vm.insurancePriceexam + value.insurancePricecant;

                        value.pricecant = $filter('currency')((value.price * parseInt(value.count)), vm.symbolCurrency, vm.penny);
                        value.pricecant = vm.normalizeNumberFormat(value.pricecant, vm.symbolCurrency);
                        vm.priceexam = vm.priceexam + value.pricecant;
                    });
                    vm.totaldiscount = 0;
                    var discountvalue = 0;
                    if (vm.discount !== 0) {
                        discountvalue = $filter('currency')((vm.priceexam * vm.discount) / 100, vm.symbolCurrency, vm.penny)
                        discountvalue = vm.normalizeNumberFormat(discountvalue, vm.symbolCurrency);
                    }
                    vm.valuediscount = discountvalue;
                    vm.totaldiscount = vm.priceexam - discountvalue;
                    vm.totaltax = $filter('currency')((vm.totaldiscount * vm.taxquotegeneral) / 100, vm.symbolCurrency, vm.penny);
                    vm.totaltax = vm.normalizeNumberFormat(vm.totaltax, vm.symbolCurrency);
                    if (vm.subtracttax) {
                        vm.totaltaxvalue = vm.totaldiscount - vm.totaltax;
                    } else {
                        vm.totaltaxvalue = vm.totaldiscount + vm.totaltax;
                    }
                    if (vm.isAddressCharge) {
                        vm.totalAddressCharge = vm.normalizeNumberFormat(vm.addressCharge, vm.symbolCurrency);
                        if (vm.totalAddressCharge >= 0) {
                            vm.addressCharge = $filter('currency')(vm.totalAddressCharge, vm.symbolCurrency, vm.penny);
                        }
                        vm.totaltaxvalue += vm.totalAddressCharge
                    }
                }

                vm.calculatedsearch = calculatedsearch;
                function calculatedsearch() {
                    vm.priceexam = 0;
                    vm.insurancePriceexam = 0;
                    vm.totaltax = 0;
                    vm.selectedTests.forEach(function (value) {
                        value.insurancePricecant=$filter('currency')((value.insurancePricecant * parseInt(value.count)), vm.symbolCurrency, vm.penny);
                        value.insurancePricecant=vm.normalizeNumberFormat(value.insurancePricecant, vm.symbolCurrency);
                        vm.insurancePriceexam = vm.insurancePriceexam + value.insurancePricecant;
                     
                        value.pricecant = $filter('currency')((value.price * parseInt(value.count)), vm.symbolCurrency, vm.penny);
                        value.pricecant = vm.normalizeNumberFormat(value.pricecant, vm.symbolCurrency);
                        vm.priceexam = vm.priceexam + value.pricecant;
                    });
                    vm.totaldiscount = 0;
                    var discountvalue = 0;
                    if (vm.discount !== 0) {
                        discountvalue = $filter('currency')((vm.priceexam * vm.discount) / 100, vm.symbolCurrency, vm.penny)
                        discountvalue = vm.normalizeNumberFormat(discountvalue, vm.symbolCurrency);
                    }
                    vm.valuediscount = discountvalue;
                    vm.totaldiscount = vm.priceexam - discountvalue;
                    vm.totaltax = $filter('currency')((vm.totaldiscount * vm.taxquotegeneral) / 100, vm.symbolCurrency, vm.penny);
                    vm.totaltax = vm.normalizeNumberFormat(vm.totaltax, vm.symbolCurrency);
                 
                    if (vm.subtracttax) {
                        vm.totaltaxvalue = vm.totaldiscount - vm.totaltax;
                    } else {
                        vm.totaltaxvalue = vm.totaldiscount + vm.totaltax;
                    }

                    if (vm.isAddressCharge) {
                        vm.totalAddressCharge = vm.normalizeNumberFormat(vm.addressCharge, vm.symbolCurrency);
                        if (vm.totalAddressCharge >= 0) {
                            vm.addressCharge = $filter('currency')(vm.totalAddressCharge, vm.symbolCurrency, vm.penny);
                        }
                        vm.totaltaxvalue += vm.totalAddressCharge
                    }
                }


                function changeDiscount() {
                    vm.calculated();
                }

                function selectRate(selected) {
                    var object = null;
                    var toDelete = false;
                    if (selected !== undefined && selected.hasOwnProperty('originalObject')) {
                        object = selected.originalObject;
                        if (typeof object === 'object') {
                            vm.rate = {
                                'id': object.id,
                                'code': object.code,
                                'name': object.name,
                                'showValue': object.code + '. ' + object.name
                            };
                            document.getElementById('quote_tests_value').focus();
                        } else {
                            vm.rate = null;
                        }
                    } else {
                        vm.rate = null;
                    }
                    vm.calculatedsearch();
                    vm.changeRateTests();
                }

                vm.focustax = focustax;
                function focustax(test) {
                    document.getElementById('rate_' + test.test.id).focus();
                    $scope.$apply();
                }

                function selectTest(selected) {
                    if (vm.rate.hasOwnProperty('id')) {
                        if (selected !== undefined) {
                            var object = null;
                            var toDelete = false;
                            if (selected.hasOwnProperty('originalObject') && selected.hasOwnProperty('title')) {
                                object = $filter('filter')(vm.selectedTests, { 'test': { 'id': selected.originalObject.id } }, true)[0];
                                if (object !== undefined && vm.searchtest.substring(0, 1) === '-') {
                                    toDelete = true;
                                }
                                else if (object === undefined && vm.searchtest.substring(0, 1) === '-') {
                                    toDelete = null;
                                }
                                else {
                                    object = selected.originalObject;
                                }
                            } else if (!selected.hasOwnProperty('title')) {
                                toDelete = null;
                            }
                            else {
                                object = select;
                            }

                            if (toDelete === false) {
                                var exists = $filter('filter')(vm.selectedTests, { 'test': { 'id': selected.originalObject.id } }, true)[0];
                                if (exists === undefined) {
                                    orderDS.getPriceTestOrder(auth.authToken, object.id, vm.rate.id).then(
                                        function (response) {

                                            var tests = [{
                                                'id': object.id
                                            }];
                                            testDS.getRequirements(auth.authToken, tests).then(function (response1) {
                                                if (response1.status === 200) {
                                                    var reportData = [];
                                                    var requeriment = '<ul>';
                                                    response1.data.forEach(function (requirement, index) {
                                                        requeriment = requeriment + '<li>' + requirement.code + '</li>';
                                                        reportData.push({
                                                            'id': requirement.id,
                                                            'requirement': requirement.code,
                                                        });
                                                    });
                                                    vm.selectedTests.push({
                                                        'test': {
                                                            'id': object.id,
                                                            'code': object.code,
                                                            'name': object.name,
                                                        },
                                                        'testRate': vm.rate,
                                                        'price': response.data.patientPrice,
                                                        'insurancePrice': response.data.insurancePrice,
                                                        'count': 1,
                                                        'pricecant': response.data.patientPrice,
                                                        'insurancePricecant':response.data.insurancePrice,
                                                        'requeriment': reportData,
                                                        'requerimenthml': requeriment + '</ul>'
                                                    });
                                                    vm.calculated();

                                                } else {
                                                    vm.selectedTests.push({
                                                        'test': {
                                                            'id': object.id,
                                                            'code': object.code,
                                                            'name': object.name,
                                                        },
                                                        'testRate': vm.rate,
                                                        'price': response.data.patientPrice,
                                                        'insurancePrice': response.data.insurancePrice,
                                                        'count': 1,
                                                        'pricecant': response.data.patientPrice,
                                                        'insurancePricecant':response.data.insurancePrice,
                                                        'requeriment': [],
                                                        'requerimenthml': ''
                                                    });
                                                    vm.calculated();
                                                    vm.loadingdiagnostics = false;
                                                }
                                            },
                                                function (error) {
                                                    vm.Error = error;
                                                    vm.ShowPopupError = true;

                                                });


                                        },
                                        function (error) {
                                            vm.Error = error;
                                            vm.ShowPopupError = true;
                                        }
                                    );
                                }
                            }
                            else if (toDelete === true) {

                                var indexF = -1;

                                vm.selectedTests.forEach(function (test, index) {
                                    if (test.test.code === object.test.code) {
                                        indexF = index;
                                    }
                                });

                                if (indexF > -1) {
                                    vm.selectedTests.splice(indexF, 1);
                                }

                                if (vm.selectedTests.length !== 0) {
                                    vm.calculated()
                                } else {
                                    vm.priceexam = 0;
                                    vm.valuediscount = 0;
                                    vm.totaldiscount = 0;
                                    vm.totaltax = 0;
                                    vm.totaltaxvalue = 0;
                                }
                            }

                        }
                    }
                }

                vm.inputChangedTest = function (text) {
                    vm.searchtest = text;
                };

                vm.filterListTest = function (search, listtest) {
                    var listtestfilter = [];
                    if (search.length > 1 && search.substring(0, 1) === '-') {
                        search = search.substring(1, search.length);
                    }
                    if (search.length === 1 && search.substring(0, 1) === '?') {
                        listtestfilter = $filter('orderBy')(listtest, 'code');
                    }
                    else {
                        listtestfilter = _.filter(listtest, function (color) {
                            return color.code.toUpperCase().indexOf(search.toUpperCase()) !== -1 || color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1;
                        });
                    }
                    return listtestfilter;
                };

                function saveQuote() {
                    var totalAddressCharge = 0
                    if (vm.isAddressCharge) {
                        totalAddressCharge = vm.normalizeNumberFormat(vm.addressCharge, vm.symbolCurrency);
                    }
                    var quote =
                    {
                        'name': vm.patient.toUpperCase(),
                        'rate': vm.rate,
                        'discount': vm.discount,
                        'tax': vm.taxquotegeneral,
                        'priceTotal': $scope.totaltestquote,
                        'quotationDetail': vm.selectedTests,
                        'addressCharge': totalAddressCharge
                    };

                    testDS.insertquote(auth.authToken, quote).then(
                        function (response) {
                            logger.success($filter('translate')('0149'));
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        }
                    );
                }

                function cleanQuote() {
                    $scope.$broadcast('angucomplete-alt:clearInput', 'quote_rates');
                    vm.patient = '';
                    vm.discount = 0;
                    vm.selectedTests = [];
                    vm.rate = null;
                    vm.addressCharge = $filter('currency')(0, vm.symbolCurrency, vm.penny);
                }

                //Función que devuelve la normalización de un valor monetario en formato numérico estandar
                function normalizeNumberFormat(valueCurrency, symbol) {
                    try {
                        return parseFloat(valueCurrency.replace(/\,/g, '').replace(symbol, ''));
                    } catch (e) {
                        return valueCurrency;
                    }
                }

                function searchQuote() {
                    vm.patientsearch = '';
                    vm.listQuote = [];
                    vm.typefilter = '1';
                    vm.maxDate = moment().format();
                    vm.maxend = moment().format();
                    vm.min = moment().format();
                    vm.startDate = moment().format();
                    vm.endDate = moment().format();
                    UIkit.modal('#modalsearchquote', { modal: false }).show();
                }

                
                function Quoteradio(radio) {
                    if (radio === '1') {
                        vm.listQuote = [];
                        if (vm.patientsearch !== undefined && vm.patientsearch !== ''){
                            vm.searchQuoteByPatient();
                        }
                    } else {
                        vm.listQuote = [];
                        vm.searchQuoteByDate();
                    }
                }


                function searchQuoteByPatient() {
                    vm.listQuote = [];
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return testDS.getquotebyname(auth.authToken, vm.patientsearch.toUpperCase()).then(function (data) {
                        if (data.status === 200) {
                            vm.listQuote = data.data;
                        }
                        else {
                            vm.listQuote = [];
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }

                function searchQuoteByDate() {
                    vm.loadingdata = true;
                    vm.listQuote = [{ 'id': 0 }];
                    var initialdate = new Date(moment(vm.startDate).format()).getTime();
                    var finaldate = new Date(moment(vm.endDate).format()).getTime();
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return testDS.getquotebydate(auth.authToken, initialdate, finaldate).then(function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                            vm.listQuote = data.data;
                        }
                        else {
                            vm.listQuote = [];
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }

                function loadQuote(quote) {
                    vm.taxquotegeneral = quote.tax;
                    $scope.totaltestquote = 0;
                    quote.rate.showValue = quote.rate.code + '. ' + quote.rate.name;
                    $scope.$broadcast('angucomplete-alt:changeInput', 'quote_rates', quote.rate)
                    vm.patient = quote.name;
                    vm.discount = quote.discount;
                    vm.selectedTests = quote.quotationDetail;
                    vm.addressCharge = vm.isAddressCharge ? quote.addressCharge : 0;
                    vm.calculatedsearch();
                    vm.rate = quote.rate;
                    UIkit.modal('#modalsearchquote', { modal: false }).hide();
                }

                /**
                 * Funcion inicial de la directiva
                */
                function init() {
                }
                vm.init();
            }],
            controllerAs: 'quote'
        };
        return directive;
    }
})();