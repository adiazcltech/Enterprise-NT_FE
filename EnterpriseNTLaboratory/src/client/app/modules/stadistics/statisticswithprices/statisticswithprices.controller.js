(function () {
  'use strict';

  angular
    .module('app.statisticswithprices')
    .controller('statisticswithpricesController', statisticswithpricesController);
  statisticswithpricesController.$inject = ['localStorageService', 'LZString', '$translate',
    '$filter', '$state', 'moment', '$rootScope', 'ordertypeDS', 'stadisticsDS', 'reportadicional'];
  function statisticswithpricesController(localStorageService, LZString, $translate,
    $filter, $state, moment, $rootScope, ordertypeDS, stadisticsDS, reportadicional) {
    var vm = this;
    vm.init = init;
    vm.isAuthenticate = isAuthenticate;
    vm.title = 'statistics with prices';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0035');
    $rootScope.helpReference = '05.Stadistics/statisticswithprices.htm';
    vm.getOrderType = getOrderType;
    vm.getlists = getlists;
    vm.numbergroup = 4;
    vm.changegraph = changegraph;
    vm.symbolCurrency = localStorageService.get('SimboloMonetario');
    vm.isPenny = localStorageService.get('ManejoCentavos') === 'True';
    vm.penny = vm.isPenny ? 2 : 0;
    vm.printReport = printReport;
    vm.statetypereport = false;
    vm.listgroup = [];
    vm.report = false;
    vm.openreport = false;
    vm.loaddata = loaddata;
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.year = '';
    vm.checkyears = false;
    vm.typereport = '';
    vm.changecheckstadistics = changecheckstadistics;
    vm.windowOpenReport = windowOpenReport;
    vm.enabledtest = false;
    vm.enabledgroupfirt = false;
    vm.removetest = false;
    $rootScope.pageview = 3;
    vm.orderdata = orderdata;
    vm.subtractTax = localStorageService.get('RestarImpuesto') === 'True';
    vm.orderresults = orderresults;
    vm.abbrCustomer = localStorageService.get("Abreviatura");
    vm.nameCustomer = localStorageService.get("Entidad");
    vm.modalError = modalError;

    function orderresults(value) {
      var tests = [];
      value.results.forEach(function (result, key) {
        vm.resultValue              = result.pricePatient === null ? 0 : result.pricePatient;
        vm.resultDiscount           = 0;
        vm.resultTax                = 0;
        vm.resultTotal              = 0;
        vm.resultTotalDiscount      = 0;

        if(result.hasOwnProperty('cashbox') && result.cashbox.length !== 0 ) {
          result.cashbox.forEach(function (resultcashBox, key) {
            if(resultcashBox.discountPercent != 0) {
              vm.resultDiscount += resultcashBox.discountPercent
            }
            vm.resultTax += resultcashBox.taxValue;
          });
        }

        vm.resultTotalDiscount = (vm.resultValue * vm.resultDiscount) / 100;
        vm.resultTotalTax = ((vm.resultValue - vm.resultTotalDiscount) * vm.resultTax ) / 100;
        if(vm.subtractTax) {
          vm.resultTotal = $filter('currency')(( vm.resultValue - vm.resultTotalDiscount - vm.resultTotalTax), vm.symbolCurrency, vm.penny);
        } else {
          vm.resultTotal = $filter('currency')(( vm.resultValue - vm.resultTotalDiscount + vm.resultTotalTax), vm.symbolCurrency, vm.penny);
        }
        vm.resultTotal = vm.normalizeNumberFormat(vm.resultTotal, vm.symbolCurrency);

        vm.dataall.allvalue = $filter('currency')(vm.dataall.allvalue + vm.resultValue, vm.symbolCurrency, vm.penny);
        vm.dataall.allvalue = vm.normalizeNumberFormat(vm.dataall.allvalue, vm.symbolCurrency);

        vm.dataall.alldiscount = $filter('currency')(vm.dataall.alldiscount + vm.resultTotalDiscount, vm.symbolCurrency, vm.penny);
        vm.dataall.alldiscount = vm.normalizeNumberFormat(vm.dataall.alldiscount, vm.symbolCurrency);

        vm.dataall.alltax = $filter('currency')(vm.dataall.alltax + vm.resultTotalTax, vm.symbolCurrency, vm.penny);
        vm.dataall.alltax = vm.normalizeNumberFormat(vm.dataall.alltax, vm.symbolCurrency);

        vm.dataall.alltotal = $filter('currency')(vm.dataall.alltotal + vm.resultTotal, vm.symbolCurrency, vm.penny);
        vm.dataall.alltotal = vm.normalizeNumberFormat(vm.dataall.alltotal, vm.symbolCurrency);

        vm.resultValue   = $filter('currency')( vm.resultValue, vm.symbolCurrency, vm.penny);
        vm.resultValue = vm.normalizeNumberFormat(vm.resultValue, vm.symbolCurrency);

        vm.resultTotalTax   = $filter('currency')( vm.resultTotalTax, vm.symbolCurrency, vm.penny);
        vm.resultTotalTax = vm.normalizeNumberFormat(vm.resultTotalTax, vm.symbolCurrency);

        vm.resultTotalDiscount   = $filter('currency')( vm.resultTotalDiscount, vm.symbolCurrency, vm.penny);
        vm.resultTotalDiscount = vm.normalizeNumberFormat(vm.resultTotalDiscount, vm.symbolCurrency);

        tests.push({
          'id':result.id,
          'name': result.name,
          'code': result.code,
          'value':    vm.resultValue,
          'discount': vm.resultTotalDiscount,
          'tax':      vm.resultTotalTax,
          'total':    vm.resultTotal
        });
      });

      return tests;
    }

    function orderdata(data) {

      //REPORTE LABOPAT DETALLADO
      if(vm.typereport === 5 || vm.typereport === 1 ) {
        var listOrders = [];
        if(vm.searchby === 0 || vm.searchby === 1) {
          data.data.forEach(function (value) {
            var validate = [];
            if(vm.searchby === 0) {
              validate = _.filter(value.results, function (o) { return o.pricePatient > 0 && o.priceAccount === 0 });
            }
            if(vm.searchby === 1) {
              validate = _.filter(value.results, function (o) { return o.pricePatient === 0 && o.priceAccount > 0 });
            }
            if(validate.length > 0) {
              value.results = validate;
              listOrders.push(value);
            }
          });
          data.data = listOrders;
        }
      }

      var canttest = ($filter('filter')(vm.listgroup, { filter1: '2', filter2: '!!' })).length;
      var cantdynamicdemographics = ($filter('filter')(vm.listgroup, { filter1: '1', filter2: '!!', field: 'codifiedId' })).length;
      var cantfixeddemographics = ($filter('filter')(vm.listgroup, { filter1: '1', filter2: '!!', field: '!codifiedId' })).length;

      if(vm.typereport === 4) {
        if ((canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics === 0) ||
          (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
          (canttest === 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0)) {
          vm.relationsimplebox(data.data, canttest, cantdynamicdemographics, cantfixeddemographics);
        }
        else if ((canttest > 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
          (canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0) ||
          (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics > 0)) {
          vm.doublerelationbox(data.data, canttest, cantdynamicdemographics, cantfixeddemographics);
        }
        else {
          vm.multiplerelationbox(data.data)
        }
      }
    }

    function getOrderType() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getOrderTypeActive(auth.authToken).then(function (data) {
        var all = [
          {
            'id': null,
            'name': $filter('translate')('0215')
          }
        ];

        if (data.data.length > 0) {
          vm.listordertype = all.concat(data.data);
          vm.itemordertype = { id: null };
        }
      });
    }


    function changegraph() {
      if (vm.graph) {
        vm.typereport = '';
        vm.statetypereport = true;
      }
      else {
        vm.numbergroup = 4;
        vm.statetypereport = false;
      }
    }



    function changecheckstadistics() {
      if (vm.checkyears) {
        vm.graph = false;
        vm.numbergroup = 4;
        vm.typereport = '';
        vm.statetypereport = true;
      }

    }



    function getlists() {
      vm.listtypereport = [
        { 'id': 1, 'name': $filter('translate')('0432') },
        { 'id': 2, 'name': $filter('translate')('1709') },
        { 'id': 3, 'name': $filter('translate')('0415') },
        { 'id': 4, 'name': $filter('translate')('1710') },
        { 'id': 5, 'name': $filter('translate')('0321') }
      ]
      vm.typereport = 1;

      vm.listsearchby = [
        { 'id': 0, 'name': $filter('translate')('0455') },
        { 'id': 1, 'name': $filter('translate')('0456') },
        { 'id': 2, 'name': $filter('translate')('1707') }]

      vm.searchby = 0;

      vm.liststatetest = [
        { 'id': 1, 'name': $filter('translate')('0435') },
        { 'id': 2, 'name': $filter('translate')('0436') },
        { 'id': 3, 'name': $filter('translate')('0437') }]

      vm.statetest = 1;
      var dateMin = moment().year() - 4;
      var dateMax = moment().year();
      vm.listYear = [];
      for (var i = dateMax; i >= dateMin; i--) {
        vm.listYear.push({ 'id': i, 'name': i });
      }
    }

    function loaddata(type) {
      vm.type = type;
      var data = {
        'rangeType': 0,
        'init': vm.rangeInit,
        'end': vm.rangeEnd,
        'testState': vm.statetest,
        'demographics': [],
        'areas': [],
        'levels': [],
        'laboratories': [],
        'tests': [],
        'filterType': vm.typereport,
        'prices': true
      }

      for (var i = 0; i < vm.listgroup.length; i++) {
        if (vm.listgroup[i].filter1 === null || vm.listgroup[i].filter1 === undefined) {
          break;
        }
        else {
          switch (vm.listgroup[i].filter1) {
            case '2':
              if (vm.listgroup[i].filter2 === 1) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.areas.push(itemvalue.id)
                })
              }
              else if (vm.listgroup[i].filter2 === 2) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.levels.push(itemvalue.id)
                })
              }
              else if (vm.listgroup[i].filter2 === 3) {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.laboratories.push(itemvalue.id)
                })
              }
              else if (vm.listgroup[i].filter2 === 5) {
                var item = {
                  'demographic': -11,
                  'demographicItems': [],
                  'origin': vm.listgroup[i].origin
                }
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })
                data.demographics.push(item)
              }
              else {
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  data.tests.push(itemvalue.id)
                })
              }
              break;
            case '1':
              if (vm.listgroup[i].filter2 !== null) {
                var item = {
                  'demographic': vm.listgroup[i].filter2,
                  'demographicItems': [],
                  'origin': vm.listgroup[i].origin
                }
                vm.listgroup[i].listvalues.forEach(function (itemvalue, key) {
                  item.demographicItems.push(itemvalue.id)
                })
                data.demographics.push(item)
              }
              break;
          }
        }
      }
      if (vm.itemordertype.id !== null) {
        var item = {
          'demographic': -4,
          'demographicItems': [vm.itemordertype.id],
        }
        data.demographics.push(item)
      }

      var canttest = ($filter('filter')(vm.listgroup, { filter1: '2', filter2: '!!' })).length;
      var cantdynamicdemographics = ($filter('filter')(vm.listgroup, {
        filter1: '1',
        filter2: '!!',
        field: 'codifiedId'
      })).length;
      var cantfixeddemographics = ($filter('filter')(vm.listgroup, {
        filter1: '1',
        filter2: '!!',
        field: '!codifiedId'
      })).length;

      var typeGroup = 0;

      if ((canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics === 0) ||
        (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
        (canttest === 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0)) {
          typeGroup = 1;
      } else if ((canttest > 0 && cantdynamicdemographics > 0 && cantfixeddemographics === 0) ||
        (canttest > 0 && cantdynamicdemographics === 0 && cantfixeddemographics > 0) ||
        (canttest === 0 && cantdynamicdemographics > 0 && cantfixeddemographics > 0)) {
        typeGroup = 2;
      } else {
        typeGroup = 3;
      }

      data.typeGroup = typeGroup;
      data.typeReport = vm.typereport;
      data.canttests = canttest;
      data.dynamicdemographics = cantdynamicdemographics;
      data.cantfixeddemographics = cantfixeddemographics;
      data.listgroup = vm.listgroup;
      data.prices = true;
      data.searchby = vm.searchby;

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;

      if(vm.typereport === 4) {
        return stadisticsDS.getpriceBox(auth.authToken, data).then(function (data) {
          if (data.data === '') {
            vm.printReport(data.data)
          }
          else {
            vm.orderdata(data);
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        });
      } else {
        return stadisticsDS.getgeneralStadisticsV2(data).then(function (data) {
          if(Object.keys(data.data).length > 0) {
            vm.dataall = data.data.dataall;
            vm.printReport(data.data.datareport);
          } else {
            vm.printReport([]);
          }
        },
        function (error) {
          vm.modalError(error);
        });
      }
    }

    vm.validateddetail = validateddetail;
    function validateddetail() {
      vm.enabledtest = false;
      vm.enabledgroupfirt = false;
      vm.removetest = false;
      vm.statesearchby = false;
      if (vm.typereport === 4) {
        vm.searchby = 0;
        vm.enabledtest = true;
        vm.statesearchby = true;
      }
      if (vm.typereport === 3) {
        vm.enabledgroupfirt = true;
      }
    }

    vm.relationsimplebox = relationsimplebox;
    function relationsimplebox(data, test, dynamicdemographics, fixeddemographics) {
      var datareport = [];
      vm.dataall = {
        'allorder': 0,
        'allpriceorder': 0,
        'allcopago': 0,
        'alldiscountorder': 0,
        'allbalanceorder': 0,
        'allpayorder': 0,
        'alltest': 0,
        'cantallhitory': 0,
        'allhitory': [],
        'allpriceService': 0,
        'allpricePatient': 0,
        'allpriceAccount': 0,
        'allvalue': 0,
        'alldiscount': 0,
        'alltax': 0,
        'alltotal': 0
      }
      data.forEach(function (value, key) {
        if (dynamicdemographics > 0) {
          var item1 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[0].filter2 })[0]
          var item2 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[1].filter2 })[0]
          var item3 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[2].filter2 })[0]
          var item4 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[3].filter2 })[0]
          var item = {
            'orderNumber': value.orderNumber,
            'group1': item1[vm.listgroup[0].field],
            'group1name': item1[vm.listgroup[0].fieldcode] + ' ' + item1[vm.listgroup[0].fieldname],
            'group2': item2 === undefined ? null : item2[vm.listgroup[1].field],
            'group2name': item2 === undefined ? null : item2[vm.listgroup[1].fieldcode] + ' ' + item2[vm.listgroup[1].fieldname],
            'group3': item3 === undefined ? null : item3[vm.listgroup[2].field],
            'group3name': item3 === undefined ? null : item3[vm.listgroup[2].fieldcode] + ' ' + item3[vm.listgroup[2].fieldname],
            'group4': item4 === undefined ? null : item4[vm.listgroup[3].field],
            'group4name': item4 === undefined ? null : item4[vm.listgroup[3].fieldcode] + ' ' + item4[vm.listgroup[3].fieldname],
            'group5': null,
            'group5name': null,
            'history': value.patient.patientId,
            'patientname': value.patient.name1 + ' ' + value.patient.name2 + ' ' + value.patient.lastName + ' ' + value.patient.surName,
            'tests': []
          }
          item.group2 = item.group2 === undefined ? null : item.group2;
          item.group3 = item.group3 === undefined ? null : item.group3;
          item.group4 = item.group4 === undefined ? null : item.group4;
          vm.subtotal = 0;
          vm.taxValue = 0;

          if(value.hasOwnProperty('cashBox')) {
            if (value.cashBox.length !== 0) {
              if (value.cashBox.length === 1) {
                vm.subtotal = value.cashBox[0].subTotal
                vm.taxValue = value.cashBox[0].taxValue
              } else {
                value.cashBox.forEach(function (valuecashBox, key) {
                  vm.subtotal = valuecashBox.subTotal + vm.subtotal
                  vm.taxValue = valuecashBox.taxValue + vm.taxValue
                })
              }
              if (value.cashBox[0].discountPercent !== 0) {
                value.cashBox[0].discountValue = $filter('currency')(((vm.subtotal + vm.taxValue) * value.cashBox[0].discountPercent) / 100, vm.symbolCurrency, vm.penny);
                var discountValue = vm.normalizeNumberFormat(value.cashBox[0].discountValue, vm.symbolCurrency);
                value.cashBox[0].discountValue = discountValue;
              }
              var priceorder = $filter('currency')(vm.subtotal + vm.taxValue, vm.symbolCurrency, vm.penny);
              priceorder = vm.normalizeNumberFormat(priceorder, vm.symbolCurrency);
              item.priceorder = priceorder;

              vm.dataall.allpriceorder = $filter('currency')(vm.dataall.allpriceorder + item.priceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpriceorder = vm.normalizeNumberFormat(vm.dataall.allpriceorder, vm.symbolCurrency);

              var copago = $filter('currency')(value.cashBox[0].copay + value.cashBox[0].fee, vm.symbolCurrency, vm.penny);
              copago = vm.normalizeNumberFormat(copago, vm.symbolCurrency);
              item.copago = copago;

              vm.dataall.allcopago = $filter('currency')(vm.dataall.allcopago + item.copago, vm.symbolCurrency, vm.penny);
              vm.dataall.allcopago = vm.normalizeNumberFormat(vm.dataall.allcopago, vm.symbolCurrency);

              item.discountorder = value.cashBox[0].discountValue;
              vm.dataall.alldiscountorder = $filter('currency')(vm.dataall.alldiscountorder + item.discountorder, vm.symbolCurrency, vm.penny);
              vm.dataall.alldiscountorder = vm.normalizeNumberFormat(vm.dataall.alldiscountorder, vm.symbolCurrency);

              item.balanceorder = value.cashBox[0].balance;
              vm.dataall.allbalanceorder = $filter('currency')(vm.dataall.allbalanceorder + item.balanceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allbalanceorder = vm.normalizeNumberFormat(vm.dataall.allbalanceorder, vm.symbolCurrency);

              var totalPaid = $filter('currency')((((item.priceorder + item.copago) - item.discountorder)) - item.balanceorder, vm.symbolCurrency, vm.penny);
              totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
              item.payorder = totalPaid;
              vm.dataall.allpayorder = $filter('currency')(vm.dataall.allpayorder + item.payorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpayorder = vm.normalizeNumberFormat(vm.dataall.allpayorder, vm.symbolCurrency);
            }
          }

          if(value.results.length > 0) {
            var test = vm.orderresults(value);
            if(test) {
              item.tests = test;
            }
          }

          datareport.push(item);

        } else {

          var item = {
            'orderNumber': value.orderNumber,
            'group1': vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].field] : value[vm.listgroup[0].field],
            'group1name': vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].fieldname] : value[vm.listgroup[0].fieldname],
            'group2': vm.listgroup[1] === undefined ? null : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].field] : value[vm.listgroup[1].field],
            'group2name': vm.listgroup[1] === undefined ? null : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].fieldname] : value[vm.listgroup[1].fieldname],
            'group3': vm.listgroup[2] === undefined ? null : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].field] : value[vm.listgroup[2].field],
            'group3name': vm.listgroup[2] === undefined ? null : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].fieldname] : value[vm.listgroup[2].fieldname],
            'group4': vm.listgroup[3] === undefined ? null : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].field] : value[vm.listgroup[3].field],
            'group4name': vm.listgroup[3] === undefined ? null : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].fieldname] : value[vm.listgroup[3].fieldname],
            'group5': null,
            'group5name': null,
            'history': value.patient.patientId,
            'patientname': value.patient.name1 + ' ' + value.patient.name2 + ' ' + value.patient.lastName + ' ' + value.patient.surName,
            'tests': [],
            'taxValue': 0,
            'priceorder': 0,
            'copago': 0,
            'discountorder': 0,
            'balanceorder': 0,
            'payorder': 0
          }

          item.group2 = item.group2 === undefined ? null : item.group2;
          item.group3 = item.group3 === undefined ? null : item.group3;
          item.group4 = item.group4 === undefined ? null : item.group4;
          vm.subtotal = 0;
          vm.taxValue = 0;

          if(value.hasOwnProperty('cashBox')) {

            if (value.cashBox.length !== 0) {

              if (value.cashBox.length === 1) {
                vm.subtotal = value.cashBox[0].subTotal
                vm.taxValue = value.cashBox[0].taxValue
              } else {
                value.cashBox.forEach(function (valuecashBox, key) {
                  vm.subtotal = valuecashBox.subTotal + vm.subtotal
                  vm.taxValue = valuecashBox.taxValue + vm.taxValue
                });
              }

              if (value.cashBox[0].discountPercent !== 0) {
                value.cashBox[0].discountValue = $filter('currency')(((vm.subtotal + vm.taxValue) * value.cashBox[0].discountPercent) / 100, vm.symbolCurrency, vm.penny);
                var discountValue = vm.normalizeNumberFormat(value.cashBox[0].discountValue, vm.symbolCurrency);
                value.cashBox[0].discountValue = discountValue;
              }

              item.taxValue = vm.taxValue;

              var priceorder = $filter('currency')(vm.subtotal + vm.taxValue, vm.symbolCurrency, vm.penny);
              priceorder = vm.normalizeNumberFormat(priceorder, vm.symbolCurrency);
              item.priceorder = priceorder;

              vm.dataall.allpriceorder = $filter('currency')(vm.dataall.allpriceorder + item.priceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpriceorder = vm.normalizeNumberFormat(vm.dataall.allpriceorder, vm.symbolCurrency);

              var copago = $filter('currency')(value.cashBox[0].copay + value.cashBox[0].fee, vm.symbolCurrency, vm.penny);
              copago = vm.normalizeNumberFormat(copago, vm.symbolCurrency);
              item.copago = copago;

              vm.dataall.allcopago = $filter('currency')(vm.dataall.allcopago + item.copago, vm.symbolCurrency, vm.penny);
              vm.dataall.allcopago = vm.normalizeNumberFormat(vm.dataall.allcopago, vm.symbolCurrency);

              item.discountorder = value.cashBox[0].discountValue;
              vm.dataall.alldiscountorder = $filter('currency')(vm.dataall.alldiscountorder + item.discountorder, vm.symbolCurrency, vm.penny);
              vm.dataall.alldiscountorder = vm.normalizeNumberFormat(vm.dataall.alldiscountorder, vm.symbolCurrency);

              item.balanceorder = value.cashBox[0].balance;
              vm.dataall.allbalanceorder = $filter('currency')(vm.dataall.allbalanceorder + item.balanceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allbalanceorder = vm.normalizeNumberFormat(vm.dataall.allbalanceorder, vm.symbolCurrency);

              var totalPaid = $filter('currency')((((item.priceorder + item.copago) - item.discountorder)) - item.balanceorder, vm.symbolCurrency, vm.penny);
              totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
              item.payorder = totalPaid;
              vm.dataall.allpayorder = $filter('currency')(vm.dataall.allpayorder + item.payorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpayorder = vm.normalizeNumberFormat(vm.dataall.allpayorder, vm.symbolCurrency);
            }
          }

          if(value.results.length > 0) {

            var test = vm.orderresults(value);
            if(test) {
              item.tests = test;
            }
          }
          datareport.push(item);
        }
      })
      vm.dataall.allorder = datareport.length;
      vm.printReport(datareport);
    }

    vm.normalizeNumberFormat = normalizeNumberFormat;
    function normalizeNumberFormat(valueCurrency, symbol) {
      try {
          return parseFloat(valueCurrency.replace(/\,/g, '').replace(symbol, ''));
      } catch (e) {
          return valueCurrency;
      }
  }

    vm.doublerelationbox = doublerelationbox;
    function doublerelationbox(data, test, dynamicdemographics, fixeddemographics) {
      var datareport = [];
      vm.dataall = {
        'allorder': 0,
        'allpriceorder': 0,
        'allcopago': 0,
        'alldiscountorder': 0,
        'allbalanceorder': 0,
        'allpayorder': 0,
        'alltest': 0,
        'cantallhitory': 0,
        'allhitory': [],
        'allpriceService': 0,
        'allpricePatient': 0,
        'allpriceAccount': 0,
        'allvalue': 0,
        'alldiscount': 0,
        'alltax': 0,
        'alltotal': 0

      }
      data.forEach(function (value, key) {
        if (test > 0 && dynamicdemographics === 0 && fixeddemographics > 0) {
          var item = {
            'orderNumber': value.orderNumber,
            'group1': vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].field] : value[vm.listgroup[0].field],
            'group1name': vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].fieldcode] + ' ' + value.patient[vm.listgroup[0].fieldname] : value[vm.listgroup[0].fieldcode] + ' ' + value[vm.listgroup[0].fieldname],
            'group2': vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].field] : value[vm.listgroup[1].field],
            'group2name': vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].fieldcode] + ' ' + value.patient[vm.listgroup[1].fieldname] : value[vm.listgroup[1].fieldcode] + ' ' + value[vm.listgroup[1].fieldname],
            'group3': vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].field] : value[vm.listgroup[2].field],
            'group3name': vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].fieldcode] + ' ' + value.patient[vm.listgroup[2].fieldname] : value[vm.listgroup[2].fieldcode] + ' ' + value[vm.listgroup[2].fieldname],
            'group4': vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].field] : value[vm.listgroup[3].field],
            'group4name': vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].fieldcode] + ' ' + value.patient[vm.listgroup[3].fieldname] : value[vm.listgroup[3].fieldcode] + ' ' + value[vm.listgroup[3].fieldname],
            'group5': null,
            'group5name': null,
            'history': value.patient.patientId,
            'patientname': value.patient.name1 + ' ' + value.patient.name2 + ' ' + value.patient.lastName + ' ' + value.patient.surName,
            'tests': []
          }
          item.group2 = item.group2 === undefined ? null : item.group2;
          item.group3 = item.group3 === undefined ? null : item.group3;
          item.group4 = item.group4 === undefined ? null : item.group4;
          vm.subtotal = 0;
          vm.taxValue = 0;

          if(value.hasOwnProperty('cashBox')) {
            if (value.cashBox.length !== 0) {
              if (value.cashBox.length === 1) {
                vm.subtotal = value.cashBox[0].subTotal
                vm.taxValue = value.cashBox[0].taxValue
              } else {
                value.cashBox.forEach(function (valuecashBox, key) {
                  vm.subtotal = valuecashBox.subTotal + vm.subtotal
                  vm.taxValue = valuecashBox.taxValue + vm.taxValue
                })
              }
              if (value.cashBox[0].discountPercent !== 0) {
                value.cashBox[0].discountValue = $filter('currency')(((vm.subtotal + vm.taxValue) * value.cashBox[0].discountPercent) / 100, vm.symbolCurrency, vm.penny);
                var discountValue = vm.normalizeNumberFormat(value.cashBox[0].discountValue, vm.symbolCurrency);
                value.cashBox[0].discountValue = discountValue;
              }
              var priceorder = $filter('currency')(vm.subtotal + vm.taxValue, vm.symbolCurrency, vm.penny);
              priceorder = vm.normalizeNumberFormat(priceorder, vm.symbolCurrency);
              item.priceorder = priceorder;

              vm.dataall.allpriceorder = $filter('currency')(vm.dataall.allpriceorder + item.priceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpriceorder = vm.normalizeNumberFormat(vm.dataall.allpriceorder, vm.symbolCurrency);

              var copago = $filter('currency')(value.cashBox[0].copay + value.cashBox[0].fee, vm.symbolCurrency, vm.penny);
              copago = vm.normalizeNumberFormat(copago, vm.symbolCurrency);
              item.copago = copago;

              vm.dataall.allcopago = $filter('currency')(vm.dataall.allcopago + item.copago, vm.symbolCurrency, vm.penny);
              vm.dataall.allcopago = vm.normalizeNumberFormat(vm.dataall.allcopago, vm.symbolCurrency);

              item.discountorder = value.cashBox[0].discountValue;
              vm.dataall.alldiscountorder = $filter('currency')(vm.dataall.alldiscountorder + item.discountorder, vm.symbolCurrency, vm.penny);
              vm.dataall.alldiscountorder = vm.normalizeNumberFormat(vm.dataall.alldiscountorder, vm.symbolCurrency);

              item.balanceorder = value.cashBox[0].balance;
              vm.dataall.allbalanceorder = $filter('currency')(vm.dataall.allbalanceorder + item.balanceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allbalanceorder = vm.normalizeNumberFormat(vm.dataall.allbalanceorder, vm.symbolCurrency);

              var totalPaid = $filter('currency')((((item.priceorder + item.copago) - item.discountorder)) - item.balanceorder, vm.symbolCurrency, vm.penny);
              totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
              item.payorder = totalPaid;
              vm.dataall.allpayorder = $filter('currency')(vm.dataall.allpayorder + item.payorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpayorder = vm.normalizeNumberFormat(vm.dataall.allpayorder, vm.symbolCurrency);
            }
          }

          if(value.results.length > 0) {

            var test = vm.orderresults(value);
            if(test) {
              item.tests = test;
            }
          }
          datareport.push(item);
        }
        else {
          var item1 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[0].filter2 })[0]
          var item2 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[1].filter2 })[0]
          var item3 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[2].filter2 })[0]
          var item4 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[3].filter2 })[0]
          var item = {
            'orderNumber': value.orderNumber,
            'group1': vm.listgroup[0].filter2 > 0 ? item1[vm.listgroup[0].field] : vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].field] : value[vm.listgroup[0].field],
            'group1name': vm.listgroup[0].filter2 > 0 ? item1[vm.listgroup[0].fieldcode] + ' ' + item1[vm.listgroup[0].fieldname] : vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].fieldcode] + ' ' + value.patient[vm.listgroup[0].fieldname] : value[vm.listgroup[0].fieldcode] + ' ' + value[vm.listgroup[0].fieldname],
            'group2': vm.listgroup[1].filter2 > 0 ? item2[vm.listgroup[1].field] : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].field] : value[vm.listgroup[1].field],
            'group2name': vm.listgroup[1].filter2 > 0 ? item2[vm.listgroup[1].fieldcode] + ' ' + item2[vm.listgroup[1].fieldname] : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].fieldcode] + ' ' + value.patient[vm.listgroup[1].fieldname] : value[vm.listgroup[1].fieldcode] + ' ' + value[vm.listgroup[1].fieldname],
            'group3': vm.listgroup[2].filter2 > 0 ? item3[vm.listgroup[2].field] : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].field] : value[vm.listgroup[2].field],
            'group3name': vm.listgroup[2].filter2 > 0 ? item3[vm.listgroup[2].fieldcode] + ' ' + item3[vm.listgroup[2].fieldname] : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].fieldcode] + ' ' + value.patient[vm.listgroup[2].fieldname] : value[vm.listgroup[2].fieldcode] + ' ' + value[vm.listgroup[2].fieldname],
            'group4': vm.listgroup[3].filter2 > 0 ? item4[vm.listgroup[3].field] : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].field] : value[vm.listgroup[3].field],
            'group4name': vm.listgroup[3].filter2 > 0 ? item4[vm.listgroup[3].fieldcode] + ' ' + item4[vm.listgroup[3].fieldname] : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].fieldcode] + ' ' + value.patient[vm.listgroup[3].fieldname] : value[vm.listgroup[3].fieldcode] + ' ' + value[vm.listgroup[3].fieldname],
            'group5': null,
            'group5name': null,
            'history': value.patient.patientId,
            'patientname': value.patient.name1 + ' ' + value.patient.name2 + ' ' + value.patient.lastName + ' ' + value.patient.surName,
            'tests': []
          }
          item.group2 = item.group2 === undefined ? null : item.group2;
          item.group3 = item.group3 === undefined ? null : item.group3;
          item.group4 = item.group4 === undefined ? null : item.group4;
          vm.subtotal = 0;
          vm.taxValue = 0;

          if(value.hasOwnProperty('cashBox')) {
            if (value.cashBox.length !== 0) {
              if (value.cashBox.length === 1) {
                vm.subtotal = value.cashBox[0].subTotal
                vm.taxValue = value.cashBox[0].taxValue
              } else {
                value.cashBox.forEach(function (valuecashBox, key) {
                  vm.subtotal = valuecashBox.subTotal + vm.subtotal
                  vm.taxValue = valuecashBox.taxValue + vm.taxValue
                })
              }
              if (value.cashBox[0].discountPercent !== 0) {
                value.cashBox[0].discountValue = $filter('currency')(((vm.subtotal + vm.taxValue) * value.cashBox[0].discountPercent) / 100, vm.symbolCurrency, vm.penny);
                var discountValue = vm.normalizeNumberFormat(value.cashBox[0].discountValue, vm.symbolCurrency);
                value.cashBox[0].discountValue = discountValue;
              }
              var priceorder = $filter('currency')(vm.subtotal + vm.taxValue, vm.symbolCurrency, vm.penny);
              priceorder = vm.normalizeNumberFormat(priceorder, vm.symbolCurrency);
              item.priceorder = priceorder;

              vm.dataall.allpriceorder = $filter('currency')(vm.dataall.allpriceorder + item.priceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpriceorder = vm.normalizeNumberFormat(vm.dataall.allpriceorder, vm.symbolCurrency);

              var copago = $filter('currency')(value.cashBox[0].copay + value.cashBox[0].fee, vm.symbolCurrency, vm.penny);
              copago = vm.normalizeNumberFormat(copago, vm.symbolCurrency);
              item.copago = copago;

              vm.dataall.allcopago = $filter('currency')(vm.dataall.allcopago + item.copago, vm.symbolCurrency, vm.penny);
              vm.dataall.allcopago = vm.normalizeNumberFormat(vm.dataall.allcopago, vm.symbolCurrency);

              item.discountorder = value.cashBox[0].discountValue;
              vm.dataall.alldiscountorder = $filter('currency')(vm.dataall.alldiscountorder + item.discountorder, vm.symbolCurrency, vm.penny);
              vm.dataall.alldiscountorder = vm.normalizeNumberFormat(vm.dataall.alldiscountorder, vm.symbolCurrency);

              item.balanceorder = value.cashBox[0].balance;
              vm.dataall.allbalanceorder = $filter('currency')(vm.dataall.allbalanceorder + item.balanceorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allbalanceorder = vm.normalizeNumberFormat(vm.dataall.allbalanceorder, vm.symbolCurrency);

              var totalPaid = $filter('currency')((((item.priceorder + item.copago) - item.discountorder)) - item.balanceorder, vm.symbolCurrency, vm.penny);
              totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
              item.payorder = totalPaid;
              vm.dataall.allpayorder = $filter('currency')(vm.dataall.allpayorder + item.payorder, vm.symbolCurrency, vm.penny);
              vm.dataall.allpayorder = vm.normalizeNumberFormat(vm.dataall.allpayorder, vm.symbolCurrency);
            }
          }

          if(value.results.length > 0) {
            var test = vm.orderresults(value);
            if(test) {
              item.tests = test;
            }
          }
          datareport.push(item);
        }
      });
      vm.dataall.allorder = datareport.length;
      vm.printReport(datareport);
    }

    vm.multiplerelationbox = multiplerelationbox;
    function multiplerelationbox(data) {
      var datareport = [];
      vm.dataall = {
        'allorder': 0,
        'allpriceorder': 0,
        'allcopago': 0,
        'alldiscountorder': 0,
        'allbalanceorder': 0,
        'allpayorder': 0,
        'alltest': 0,
        'cantallhitory': 0,
        'allhitory': [],
        'allpriceService': 0,
        'allpricePatient': 0,
        'allpriceAccount': 0,
        'allvalue': 0,
        'alldiscount': 0,
        'alltax': 0,
        'alltotal': 0

      }
      data.forEach(function (value, key) {
        var item1 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[0].filter2 })[0]
        var item2 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[1].filter2 })[0]
        var item3 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[2].filter2 })[0]
        var item4 = $filter('filter')(value.allDemographics, { idDemographic: vm.listgroup[3].filter2 })[0]
        var item = {
          'orderNumber': value.orderNumber,
          'group1': vm.listgroup[0].filter2 > 0 ? item1[vm.listgroup[0].field] : vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].field] : value[vm.listgroup[0].field],
          'group1name': vm.listgroup[0].filter2 > 0 ? item1[vm.listgroup[0].fieldcode] + ' ' + item1[vm.listgroup[0].fieldname] : vm.listgroup[0].filter2 === -7 || vm.listgroup[0].filter2 === -10 ? value.patient[vm.listgroup[0].fieldcode] + ' ' + value.patient[vm.listgroup[0].fieldname] : value[vm.listgroup[0].fieldcode] + ' ' + value[vm.listgroup[0].fieldname],
          'group2': vm.listgroup[1].filter2 > 0 ? item2[vm.listgroup[1].field] : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].field] : value[vm.listgroup[1].field],
          'group2name': vm.listgroup[1].filter2 > 0 ? item2[vm.listgroup[1].fieldcode] + ' ' + item2[vm.listgroup[1].fieldname] : vm.listgroup[1].filter2 === -7 || vm.listgroup[1].filter2 === -10 ? value.patient[vm.listgroup[1].fieldcode] + ' ' + value.patient[vm.listgroup[1].fieldname] : value[vm.listgroup[1].fieldcode] + ' ' + value[vm.listgroup[1].fieldname],
          'group3': vm.listgroup[2].filter2 > 0 ? item3[vm.listgroup[2].field] : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].field] : value[vm.listgroup[2].field],
          'group3name': vm.listgroup[2].filter2 > 0 ? item3[vm.listgroup[2].fieldcode] + ' ' + item3[vm.listgroup[2].fieldname] : vm.listgroup[2].filter2 === -7 || vm.listgroup[2].filter2 === -10 ? value.patient[vm.listgroup[2].fieldcode] + ' ' + value.patient[vm.listgroup[2].fieldname] : value[vm.listgroup[2].fieldcode] + ' ' + value[vm.listgroup[2].fieldname],
          'group4': vm.listgroup[3].filter2 > 0 ? item4[vm.listgroup[3].field] : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].field] : value[vm.listgroup[3].field],
          'group4name': vm.listgroup[3].filter2 > 0 ? item4[vm.listgroup[3].fieldcode] + ' ' + item4[vm.listgroup[3].fieldname] : vm.listgroup[3].filter2 === -7 || vm.listgroup[3].filter2 === -10 ? value.patient[vm.listgroup[3].fieldcode] + ' ' + value.patient[vm.listgroup[3].fieldname] : value[vm.listgroup[3].fieldcode] + ' ' + value[vm.listgroup[3].fieldname],
          'group5': null,
          'group5name': null,
          'history': value.patient.patientId,
          'patientname': value.patient.name1 + ' ' + value.patient.name2 + ' ' + value.patient.lastName + ' ' + value.patient.surName,
          'tests': []
        }
        item.group2 = item.group2 === undefined ? null : item.group2;
        item.group3 = item.group3 === undefined ? null : item.group3;
        item.group4 = item.group4 === undefined ? null : item.group4;
        vm.subtotal = 0;
        vm.taxValue = 0;

        if(value.hasOwnProperty('cashBox')) {
          if (value.cashBox.length !== 0) {
            if (value.cashBox.length === 1) {
              vm.subtotal = value.cashBox[0].subTotal
              vm.taxValue = value.cashBox[0].taxValue
            } else {
              value.cashBox.forEach(function (valuecashBox, key) {
                vm.subtotal = valuecashBox.subTotal + vm.subtotal
                vm.taxValue = valuecashBox.taxValue + vm.taxValue
              })
            }
            if (value.cashBox[0].discountPercent !== 0) {
              value.cashBox[0].discountValue = $filter('currency')(((vm.subtotal + vm.taxValue) * value.cashBox[0].discountPercent) / 100, vm.symbolCurrency, vm.penny);
              var discountValue = vm.normalizeNumberFormat(value.cashBox[0].discountValue, vm.symbolCurrency);
              value.cashBox[0].discountValue = discountValue;
            }
            var priceorder = $filter('currency')(vm.subtotal + vm.taxValue, vm.symbolCurrency, vm.penny);
            priceorder = vm.normalizeNumberFormat(priceorder, vm.symbolCurrency);
            item.priceorder = priceorder;

            vm.dataall.allpriceorder = $filter('currency')(vm.dataall.allpriceorder + item.priceorder, vm.symbolCurrency, vm.penny);
            vm.dataall.allpriceorder = vm.normalizeNumberFormat(vm.dataall.allpriceorder, vm.symbolCurrency);

            var copago = $filter('currency')(value.cashBox[0].copay + value.cashBox[0].fee, vm.symbolCurrency, vm.penny);
            copago = vm.normalizeNumberFormat(copago, vm.symbolCurrency);
            item.copago = copago;

            vm.dataall.allcopago = $filter('currency')(vm.dataall.allcopago + item.copago, vm.symbolCurrency, vm.penny);
            vm.dataall.allcopago = vm.normalizeNumberFormat(vm.dataall.allcopago, vm.symbolCurrency);

            item.discountorder = value.cashBox[0].discountValue;
            vm.dataall.alldiscountorder = $filter('currency')(vm.dataall.alldiscountorder + item.discountorder, vm.symbolCurrency, vm.penny);
            vm.dataall.alldiscountorder = vm.normalizeNumberFormat(vm.dataall.alldiscountorder, vm.symbolCurrency);

            item.balanceorder = value.cashBox[0].balance;
            vm.dataall.allbalanceorder = $filter('currency')(vm.dataall.allbalanceorder + item.balanceorder, vm.symbolCurrency, vm.penny);
            vm.dataall.allbalanceorder = vm.normalizeNumberFormat(vm.dataall.allbalanceorder, vm.symbolCurrency);

            var totalPaid = $filter('currency')((((item.priceorder + item.copago) - item.discountorder)) - item.balanceorder, vm.symbolCurrency, vm.penny);
            totalPaid = vm.normalizeNumberFormat(totalPaid, vm.symbolCurrency);
            item.payorder = totalPaid;
            vm.dataall.allpayorder = $filter('currency')(vm.dataall.allpayorder + item.payorder, vm.symbolCurrency, vm.penny);
            vm.dataall.allpayorder = vm.normalizeNumberFormat(vm.dataall.allpayorder, vm.symbolCurrency);
          }
        }

        if(value.results.length > 0) {
          var test = vm.orderresults(value);
          if(test) {
            item.tests = test;
          }
        }
        datareport.push(item);
      });
      vm.dataall.allorder = datareport.length;
      vm.printReport(datareport)
    }

    function windowOpenReport() {
      if (vm.datareport.length > 0) {
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
        vm.report = false;
      } else {
        UIkit.modal("#modalReportError").show();
        vm.pruebareport = false;
      }
    }


    function printReport(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.datareport = data;
      if (data !== '' && data.length > 0) {
        vm.datareport = data;
        var namegroups = [];
        for (var i = 0; i < vm.listgroup.length; i++) {
          if (vm.listgroup[i].filter1 !== null && vm.listgroup[i].filter2 !== null &&
            $filter('filter')(vm.listgroup[i].list, { check: true }).length > 0) {
            namegroups.push(' ' + vm.listgroup[i].filter1name)
          }
        }
        vm.variables = {
          'group1name': vm.listgroup[0].filter1name,
          'group2name': vm.listgroup[1] === undefined || vm.listgroup[1].filter1name === null ? -1 : vm.listgroup[1].filter1name,
          'group3name': vm.listgroup[2] === undefined || vm.listgroup[2].filter1name === null ? -1 : vm.listgroup[2].filter1name,
          'group4name': vm.listgroup[3] === undefined || vm.listgroup[3].filter1name === null ? -1 : vm.listgroup[3].filter1name,
          'entity': vm.nameCustomer,
          'abbreviation': vm.abbrCustomer,
          'rangeInit': moment(vm.rangeInit).format(vm.formatDate),
          'rangeEnd': moment(vm.rangeEnd).format(vm.formatDate),
          'rangeType': 0,
          'typeFilter': namegroups.toString(),
          'username': auth.userName,
          'date': moment().format(vm.formatDate + ', HH:mm:ss'),
          'type': vm.searchby,
          "alltest": vm.dataall.alltest,
          "allorder": vm.dataall.allorder,
          "typereport": vm.typereport !== 1,
          "allhitory": vm.dataall.cantallhitory,
          "allpriceService": vm.dataall.allpriceService,
          "allpricePatient": vm.dataall.allpricePatient,
          "allpriceAccount": vm.dataall.allpriceAccount,
          "allpriceorder": vm.dataall.allpriceorder,
          "allcopago": vm.dataall.allcopago,
          "alldiscountorder": vm.dataall.alldiscountorder,
          "allbalanceorder": vm.dataall.allbalanceorder,
          "allpayorder": vm.dataall.allpayorder,
          'allvalue': vm.dataall.allvalue,
          'alldiscount': vm.dataall.alldiscount,
          'alltax': vm.dataall.alltax,
          'alltotal': vm.dataall.alltotal
        }

        if (vm.typereport !== 3) {
          vm.pathreport = '/Report/stadistics/priceStadistics/priceStatistics.mrt';
        }
        if (vm.typereport === 4) {
          vm.pathreport = '/Report/stadistics/priceStadistics/pricebox1.mrt';
        }
        if (vm.searchby === 0 && vm.typereport === 3) {
          vm.pathreport = '/Report/stadistics/priceStadistics/graphPatientStatistics.mrt';
        }
        if (vm.searchby === 1 && vm.typereport === 3) {
          vm.pathreport = '/Report/stadistics/priceStadistics/graphAccountStatistics.mrt';
        }
        if (vm.searchby === 2 && vm.typereport === 3) {
          vm.pathreport = '/Report/stadistics/priceStadistics/graphServiceStatistics.mrt';
        }
        if (vm.typereport === 5) {
          vm.pathreport = '/Report/stadistics/priceStadistics/priceStatisticsDetail.mrt';
        }

        vm.loadingdata = false;
        vm.report = false;
        vm.openreport = false;
        vm.windowOpenReport();
      } else {
        vm.loadingdata = false;
        UIkit.modal('#modalReportError').show();
      }

    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      }
      else {
        vm.init();
      }
    }

    function init() {
      vm.getOrderType();
      vm.getlists();
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */
