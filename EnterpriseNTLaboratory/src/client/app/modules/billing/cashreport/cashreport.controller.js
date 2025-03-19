/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.cashreport')
    .controller('cashreportController', cashreportController);
  cashreportController.$inject = ['LZString', '$translate', 'localStorageService',
    '$filter', '$state', 'moment', '$rootScope', 'branchDS', 'cashboxDS', 'userDS', 'reportadicional'];
  function cashreportController(LZString, $translate, localStorageService,
    $filter, $state, moment, $rootScope, branchDS, cashboxDS, userDS, reportadicional) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'cashreport';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1599');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    $rootScope.helpReference = '08.billing/cashreport.htm';
    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");
    vm.modalError = modalError;
    vm.getbranch = getbranch;
    vm.dateToSearch = moment().format();
    vm.maxDate = new Date();
    vm.print = print;
    vm.generateFileinvoice = generateFileinvoice;
    vm.windowOpenReport = windowOpenReport;
    vm.orderDetailed = orderDetailed;
    vm.type = 1;
    vm.filterTpye = 1;
    vm.clickFilterType = clickFilterType;
    vm.listuser = listuser;
    vm.dowload = dowload;
    $rootScope.pageview = 3;

    function dowload() {
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
      } else {
        UIkit.modal("#modalReportError").show();
      }
    }

    function clickFilterType(filter) {
      vm.filterTpye = filter;
    }

    function listuser() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getUsers(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.user = removeData(data);
          var all = {
            'id': -1,
            'namecompleted': $filter('translate')('0353')
          };
          vm.user.unshift(all);
          vm.user= $filter('orderBy')(data.data, 'namecompleted');
          vm.list = all;
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function removeData(data) {
      data.data.forEach(function (value, key) {
        data.data[key].namecompleted = data.data[key].userName;
      });
      return data.data;
    }

    function getbranch() {
      vm.branch = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchstate(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var all = {
            "id": -1,
            "name": $filter('translate')('0215')
          }
          data.data.push(all);
          vm.branch = $filter('orderBy')(data.data, 'name');
          vm.databranch = -1;
          vm.listuser();
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }
    function print(type) {
      vm.type = type;
      var invoice = {
        "branchId": vm.databranch,
        "startDate": moment(vm.rangeInit).format("YYYYMMDD"),
        "endDate": moment(vm.rangeEnd).format("YYYYMMDD"),
        "userId": vm.list === null || vm.list === undefined ? null : vm.list.id
      }
      vm.datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      switch (vm.filterTpye) {
        case 1:
          return cashboxDS.generalCashReport(auth.authToken, invoice).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              if (data.data.cashReportDetails.length === 0) {
                UIkit.modal('#nofoundfilter').show();
              } else {
                vm.data = data.data;
                data.data.cashReportDetails.forEach(function (value) {
                  value.datePayment = moment(value.datePayment).format(vm.formatDate);
                  value.date = moment(value.datePayment).format("YYYYMMDD");
                });
                vm.datareport = data.data.cashReportDetails;
                vm.generateFileinvoice();
              }
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
            function (error) {
              vm.modalError(error);
            });
          break;
        case 2:
        case 5:
          return cashboxDS.detailedCashReport(auth.authToken, invoice).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              if (data.data.detailedCashReport.length === 0) {
                UIkit.modal('#nofoundfilter').show();
              } else {
                vm.data = data.data;
                vm.orderDetailed();
              }
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.modalError(error);
          });
          break;
        case 3:
          return cashboxDS.getCashBalances(auth.authToken, invoice).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              if (data.data.detailedCashReport.length === 0) {
                UIkit.modal('#nofoundfilter').show();
              } else {
                vm.data = data.data;
                vm.datareport = data.data.detailedCashReport;
                vm.generateFileinvoice();
              }
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.modalError(error);
          });
          break;
        case 4:
          return cashboxDS.getUnbilled(auth.authToken, invoice).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              if (data.data.detailedCashReport.length === 0) {
                UIkit.modal('#nofoundfilter').show();
              } else {
                vm.data = data.data;
                vm.datareport = data.data.detailedCashReport;
                vm.generateFileinvoice();
              }
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.modalError(error);
          });
          break;
        case 6:
          return cashboxDS.consolidatedAccount(auth.authToken, invoice).then(function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              if (data.data.detailedCashReport.length === 0) {
                UIkit.modal('#nofoundfilter').show();
              } else {
                vm.data = data.data;
                vm.datareport = data.data.detailedCashReport;
                vm.generateFileinvoice();
              }
            } else {
              UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.modalError(error);
          });
          break;
      }
    }

    function orderDetailed() {
      vm.cash = [];
      vm.notecredit = [];
      vm.data.detailedCashReport.forEach(function (value, key) {
        if (value.detailPaymentType === undefined) {
          value.detailPaymentType = [
            {
              "name": "",
              "value": 0
            }
          ]
        }
        if (value.discountPorcent !== 0) {
          value.discount = ((value.subTotal + value.tax) * value.discountPorcent) / 100;
        }
        if (value.typeOfDetail === '2') {
          value.typetittle = 3;
          value.datereport = moment(value.dateCreditNote).format(vm.formatDate);
          vm.notecredit.push(value);
        } else {
          if (value.discountPorcent !== 0) {
            value.total = value.total - value.discount;
          }
          value.typetittle = 1;
          value.datereport = moment(value.date).format(vm.formatDate);
          vm.cash.push(JSON.parse(JSON.stringify(value)));;
        }
      });
      vm.datareport = _.concat(vm.cash, vm.notecredit);
      vm.generateFileinvoice();
    }

    function generateFileinvoice() {
      vm.variables = {
        "dateOfPrinting": moment(vm.data.dateOfPrinting).format('DD/MM/YYYY, HH:mm:ss'),
        "userName": vm.data.userName,
        "branchName": vm.data.hasOwnProperty('branchName') ? vm.data.branchName : $filter('translate')('0215'),
        "dateinicial": moment(vm.rangeInit).format(vm.formatDate),
        "dateend": moment(vm.rangeEnd).format(vm.formatDate),
        'user': vm.list === null || vm.list === undefined ? null : vm.list.namecompleted
      };

      switch (vm.filterTpye) {
        case 1:
          vm.pathreport = '/Report/billing/cash/consolidated/consolidated.mrt';
          break;
        case 2:
          vm.pathreport = '/Report/billing/cash/detailed/detailed.mrt';
          break;
        case 3:
          vm.pathreport = '/Report/billing/cash/cashbalance/cashbalance.mrt';
          break;
        case 4:
          vm.pathreport = '/Report/billing/cash/unbilled/unbilled.mrt';
          break;
        case 5:
          vm.pathreport = '/Report/billing/cash/detailedcash/detailedcash.mrt';
          break;
        case 6:
          vm.pathreport = '/Report/billing/cash/account/account.mrt';
          break;
      }

      vm.openreport = false;
      vm.report = false;
      vm.dowload();

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
    function init() {
      vm.getbranch();
    }
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */

