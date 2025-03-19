/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   typefilter      @descripción
                rangeend        @descripción
                isopenreport    @descripción
                typeview        @descripción forma en la que se mostrara el control: 1.solo orden 2. solo fecha
                rangeinittemp   @descripción
                rangeendtemp    @descripción
                beforechange    @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/activationorder/activationorder.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/deletespecial/deletespecial.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/earlywarning/earlywarning.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/planoWhonet/planoWhonet.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';

  angular
    .module('app.widgets')
    .config(function ($mdDateLocaleProvider) {
      var format;
      if (localStorage.getItem('ls.FormatoFecha') !== null) {
        var formatDate = ((localStorage.getItem('ls.FormatoFecha')).toUpperCase()).slice(1, 11);
        if (formatDate === 'DD/MM/YYYY') {
          format = 'DD/MM/YYYY';
        } else if (formatDate === 'DD-MM-YYYY') {
          format = 'DD-MM-YYYY';
        } else if (formatDate === 'DD.MM.YYYY') {
          format = 'DD.MM.YYYY';
        } else if (formatDate === 'MM/DD/YYYY') {
          format = 'MM/DD/YYYY';
        } else if (formatDate === 'MM-DD-YYYY') {
          format = 'MM-DD-YYYY';
        } else if (formatDate === 'MM.DD.YYYY') {
          format = 'MM.DD.YYYY';
        } else if (formatDate === 'YYYY/MM/DD') {
          format = 'YYYY/MM/DD';
        } else if (formatDate === 'YYYY-MM-DD') {
          format = 'YYYY-MM-DD';
        } else if (formatDate === 'YYYY.MM.DD') {
          format = 'YYYY.MM.DD';
        }
      } else {
        format = 'DD/MM/YYYY';
      }

      $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format(format) : '';
      };
      $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };


    })
    .directive('orderfilter', orderfilter);
  orderfilter.$inject = ['$filter', 'localStorageService', 'common'];

  /* @ngInject */
  function orderfilter($filter, localStorageService, common) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/order-filter.html',
      scope: {
        typefilter: '=?typefilter',
        rangeinit: '=?rangeinit',
        rangeend: '=?rangeend',
        isopenreport: '=?isopenreport',
        typeview: '=?typeview',
        rangeinittemp: '=?rangeinittemp',
        rangeendtemp: '=?rangeendtemp',
        beforechange: '=?beforechange',
        rangedays: '=?rangedays',
        typelabel: '=?typelabel'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.orderdigit = localStorageService.get('DigitosOrden');
        vm.getListYear = getListYear;
        vm.getOrderComplete = getOrderComplete;
        vm.changeDatePicker = changeDatePicker;
        vm.changetypefilter = changetypefilter;
        vm.changeage = changeage;
        vm.entryInit = '';
        vm.entryEnd = '';
        vm.rangedays = $scope.rangedays === undefined ? false : true;
        vm.minDateinit = new Date(2000, 0, 1);
        vm.cantdigit = parseInt(vm.orderdigit) + 4;
        vm.typefilter = null;
        vm.labelMaxDays = $scope.rangedays === undefined || $scope.rangedays === 0 ? '' : '(' + $filter('translate')('0526') + ' ' + $scope.rangedays.toString() + ' ' + $filter('translate')('0476').toLowerCase() + ')';
        $scope.rangeinittemp = null;
        $scope.rangeendtemp = null;
        vm.validateddate = validateddate;
        vm.typelabel = $scope.typelabel === undefined ? 1 : 2;
        vm.focusdateInit = focusdateInit;
        vm.focusdateend = focusdateend;
        vm.getListYear();
        $scope.$watch('typeview', function () {
          vm.typeview = $scope.typeview;
          if (vm.typeview === 2) {
            vm.rangedays = $scope.rangedays === undefined ? false : true;
            vm.days = $scope.rangedays;
            vm.maxDate = new Date();
            $scope.rangeinit = moment().format('YYYYMMDD');
            $scope.rangeend = moment().format('YYYYMMDD');
          }
        });
        $scope.$watch('rangeinittemp', function () {
          if ($scope.rangeinittemp !== null) {
            $scope.rangeinit = $scope.rangeinittemp.toString();
            vm.entryInit = $scope.typefilter === '0' ? '' : $scope.rangeinittemp.toString().substring(4);
            vm.dateInit = moment($scope.rangeinittemp.toString()).format();
            vm.maxDate = new Date();
            vm.rangedays = $scope.rangedays === undefined ? false : true;
            if (vm.rangedays === true) {
              vm.days = $scope.rangedays;
            }
            $scope.rangeinittemp = null;
          }
        });
        $scope.$watch('rangeendtemp', function () {
          if ($scope.rangeendtemp !== null) {
            $scope.rangeend = $scope.rangeendtemp.toString();
            vm.entryEnd = $scope.typefilter === '0' ? '' : $scope.rangeendtemp.toString().substring(4);
            vm.dateEnd = moment($scope.rangeendtemp.toString()).format();
            vm.maxDate = new Date();
            vm.rangedays = $scope.rangedays === undefined ? false : true;
            if (vm.rangedays === true) {
              vm.days = $scope.rangedays;
            }
            $scope.rangeendtemp = null;
          }
        });
        $scope.$watch('typefilter', function () {
          if ($scope.rangeinit !== '' && $scope.rangeend !== '') {
            vm.typefilter = $scope.typefilter;
            var validtype = vm.typefilter === undefined ? $scope.typeview === 2 ? '0' : '1' : $scope.typefilter;
            vm.entryInit = validtype === '0' ? $scope.rangeinit : $scope.rangeinit.toString().substring(4);
            vm.maxDate = new Date();
            vm.entryEnd = validtype === '0' ? $scope.rangeend : $scope.rangeend.toString().substring(4);
            vm.dateEnd = moment(vm.entryEnd).format();
            vm.dateInit = moment(vm.entryInit).format();
            $scope.isopenreport = true;
          } else {
            vm.typefilter = $scope.typefilter;
          }
        });

        function validateddate(init) {
          if (init) {
            $scope.isopenreport = true;
          } else {
            $scope.isopenreport = false;
          }
        }

        function changeage() {
          if ($scope.rangeinit) {
            $scope.rangeinit = vm.listYear.id + $scope.rangeinit.substring(4);
          }
          if ($scope.rangeend) {
            $scope.rangeend = vm.listYear.id + $scope.rangeend.substring(4);
          }
        }

        function getListYear() {
          vm.listYear = common.getListYear();
          vm.listYear.id = moment().year();
        }

        function getOrderComplete($event, control) {
          var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
          if (keyCode === 13 || keyCode === undefined) {
            if (control === 1) {
              if (vm.entryInit.length < vm.cantdigit) {

                if (vm.entryInit.length === vm.cantdigit - 1) {
                  vm.entryInit = '0' + vm.entryInit;
                  vm.entryInit = vm.listYear.id + vm.entryInit;
                } else if (parseInt(vm.orderdigit) === vm.entryInit.length - 1) {
                  vm.entryInit = '0' + vm.entryInit;
                  vm.entryInit = vm.listYear.id + (common.getOrderComplete(vm.entryInit, vm.orderdigit)).substring(4);
                } else {
                  vm.entryInit = vm.entryInit === '' ? 0 : vm.entryInit;
                  if (vm.entryInit.length === parseInt(vm.orderdigit) + 1) {
                    vm.entryInit = vm.listYear.id + moment().format('MM') + '0' + vm.entryInit;

                  } else if (vm.entryInit.length === parseInt(vm.orderdigit) + 2) {
                    vm.entryInit = vm.listYear.id + moment().format('MM') + vm.entryInit;
                  } else if (vm.entryInit.length === parseInt(vm.orderdigit) + 3) {
                    vm.entryInit = vm.listYear.id + '0' + vm.entryInit;
                  } else {
                    vm.entryInit = vm.listYear.id + (common.getOrderComplete(vm.entryInit, vm.orderdigit)).substring(4);
                  }

                }


                $scope.rangeinit = vm.entryInit;
                vm.entryInit = vm.entryInit.substring(4);
                angular.element('#orderend').focus();
              } else if (vm.entryInit.length === vm.cantdigit) {

                var valid = moment(vm.listYear.id + vm.entryInit.substring(0, 4)).isValid();
                if (valid) {
                  $scope.rangeinit = vm.listYear.id + vm.entryInit;
                  angular.element('#orderend').focus();
                } else {
                  $scope.rangeinit = '';
                  vm.entryInit = '';

                }
              }

              if (vm.entryEnd !== '' && vm.entryInit > vm.entryEnd) {
                vm.entryEnd = vm.entryInit;
                $scope.rangeend = vm.listYear.id + vm.entryInit;
                angular.element('#orderend').focus();
              }
            } else {
              if (vm.entryEnd.length < vm.cantdigit) {
                if (vm.entryEnd.length === vm.cantdigit - 1) {
                  vm.entryEnd = '0' + vm.entryEnd;
                  vm.entryEnd = vm.listYear.id + vm.entryEnd;
                } else if (parseInt(vm.orderdigit) === vm.entryEnd.length - 1) {
                  vm.entryEnd = '0' + vm.entryEnd;
                  vm.entryEnd = vm.listYear.id + (common.getOrderComplete(vm.entryEnd, vm.orderdigit)).substring(4);
                } else {
                  vm.entryEnd = vm.entryEnd === '' ? 0 : vm.entryEnd;
                  if (vm.entryEnd.length === parseInt(vm.orderdigit) + 1) {
                    vm.entryEnd = vm.listYear.id + moment().format('MM') + '0' + vm.entryEnd;

                  } else if (vm.entryEnd.length === parseInt(vm.orderdigit) + 2) {
                    vm.entryEnd = vm.listYear.id + moment().format('MM') + vm.entryEnd;
                  } else if (vm.entryEnd.length === parseInt(vm.orderdigit) + 3) {
                    vm.entryEnd = vm.listYear.id + '0' + vm.entryEnd;
                  } else {
                    vm.entryEnd = vm.listYear.id + (common.getOrderComplete(vm.entryEnd, vm.orderdigit)).substring(4);
                  }
                }
                $scope.rangeend = vm.entryEnd;

                vm.entryEnd = vm.entryEnd.substring(4);
              } else if (vm.entryEnd.length === vm.cantdigit) {
                var valid = moment(vm.listYear.id + vm.entryEnd.substring(0, 4)).isValid();
                if (valid) {
                  $scope.rangeend = vm.listYear.id + vm.entryEnd;
                } else {
                  $scope.rangeend = '';
                  vm.entryEnd = '';
                }

              }
              if (vm.entryInit !== '' && vm.entryInit > vm.entryEnd) {
                vm.entryInit = vm.entryEnd;
                $scope.rangeinit = vm.listYear.id + vm.entryEnd;
              }
            }

            if (vm.entryInit === '' || vm.entryEnd === '') {
              $scope.isopenreport = false;
            } else if (vm.entryInit !== '' && vm.entryEnd !== '' && $scope.rangedays !== undefined) {
              $scope.isopenreport = true;


              var orderinit = moment(moment().format('YYYY') + vm.entryInit.toString().substring(0, 4));
              var orderend = moment(moment().format('YYYY') + vm.entryEnd.toString().substring(0, 4));
              var prueba = orderend.diff(orderinit, 'days');

              if (prueba > $scope.rangedays) {
                if (control === 1) {
                  orderend = (orderinit.add($scope.rangedays, 'days').format('YYYYMMDD') + vm.entryEnd.toString().substring(4)).substring(4);
                  vm.entryEnd = orderend;
                  $scope.rangeend = moment().format('YYYY') + vm.entryEnd;
                } else {
                  orderinit = (orderend.subtract($scope.rangedays, 'days').format('YYYYMMDD') + vm.entryInit.toString().substring(4)).substring(4);
                  vm.entryInit = orderinit;
                  $scope.rangeinit = moment().format('YYYY') + vm.entryInit;
                }
              }


            } else {
              $scope.isopenreport = true;
            }
          } else {
            if (!(keyCode >= 48 && keyCode <= 57)) {
              $event.preventDefault();
            }
          }
        }

        function focusdateInit() {
          if (vm.dateInit !== null) {
            vm.dateInit = new Date(vm.dateInit);
          } else {
            vm.dateInit = null;
          }
        }

        function focusdateend() {
          if (vm.dateEnd !== null) {
            vm.dateEnd = new Date(vm.dateEnd);
          } else {
            vm.dateEnd = null;
          }
        }

        function changeDatePicker(obj) {
          if (vm.rangedays) {
            var maxDateEnd = new Date(vm.dateInit);
            maxDateEnd.setDate(maxDateEnd.getDate() + vm.days);

            if (obj === 1) {
              vm.isOpen1 = false;
              if (moment(vm.dateInit).format('YYYY-MM-DD') > moment(vm.dateEnd).format('YYYY-MM-DD') && moment(maxDateEnd).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
                vm.dateEnd = moment(vm.dateInit).format();
              } else if (moment(vm.dateInit).format('YYYY-MM-DD') > moment(vm.dateEnd).format('YYYY-MM-DD')) {
                vm.dateEnd = moment(vm.dateInit).format();
                vm.dateEnd = moment(vm.dateEnd).add('days', vm.days).format();
              } else if (moment(maxDateEnd).format('YYYY-MM-DD') < moment(vm.dateEnd).format('YYYY-MM-DD')) {
                vm.dateEnd = moment(vm.dateInit).format();
                vm.dateEnd = moment(vm.dateEnd).add('days', vm.days).format();
              } else if (vm.dateInit === undefined) {
                vm.dateInit = null;
              }

            } else {
              vm.isOpen2 = false;
              if (moment(vm.dateInit).format('YYYY-MM-DD') > moment(vm.dateEnd).format('YYYY-MM-DD')) {
                vm.dateInit = moment(vm.dateEnd).format();
                vm.dateInit = moment(vm.dateInit).subtract('days', vm.days).format();
              } else if (vm.dateEnd === undefined) {
                vm.dateEnd = null;
              } else if(moment(vm.dateEnd).format('YYYY-MM-DD') > moment(maxDateEnd).format('YYYY-MM-DD')) {
                vm.dateEnd = moment(maxDateEnd).format('YYYY-MM-DD');
              }
            }
          } else {
            if (obj === 1) {
              vm.isOpen1 = false;
              if (moment(vm.dateInit).format('YYYY-MM-DD') > moment(vm.dateEnd).format('YYYY-MM-DD')) {
                vm.dateEnd = moment(vm.dateInit).format();
              } else if (vm.dateInit === undefined) {
                vm.dateInit = null;
              }

            } else {
              vm.isOpen2 = false;
              if (moment(vm.dateInit).format('YYYY-MM-DD') > moment(vm.dateEnd).format('YYYY-MM-DD')) {
                vm.dateInit = moment(vm.dateEnd).format();
              } else if (vm.dateEnd === undefined) {
                vm.dateEnd = null;
              }
            }

          }
          $scope.rangeinit = moment(vm.dateInit).format('YYYYMMDD');
          $scope.rangeend = moment(vm.dateEnd).format('YYYYMMDD');
        }

        function changetypefilter(id) {
          $scope.rangeinit = '';
          $scope.rangeend = '';
          $scope.isopenreport = false;
          vm.entryInit = '';
          vm.entryEnd = '';
          vm.rangedays = $scope.rangedays === undefined ? false : true;
          if (vm.rangedays === true) {
            vm.days = $scope.rangedays;
          }
          if (id === 0) {
            $scope.rangeinit = moment().format('YYYYMMDD');
            $scope.rangeend = moment().format('YYYYMMDD');
          }
          $scope.typefilter = vm.typefilter;
          if ($scope.beforechange !== undefined) {
            $scope.beforechange();
          }
        }
      }],
      controllerAs: 'orderfilter'
    };
    return directive;
  }
})();
/* jshint ignore:end */
