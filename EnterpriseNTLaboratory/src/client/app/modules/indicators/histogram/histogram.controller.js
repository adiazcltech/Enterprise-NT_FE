/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.histogram')
    .controller('histogramController', histogramController);
  histogramController.$inject = ['LZString', '$translate', 'localStorageService',
    '$filter', '$state', 'moment', '$rootScope', 'serviceDS', 'indicatorsDS', 'userDS'
  ];

  function histogramController(LZString, $translate, localStorageService,
    $filter, $state, moment, $rootScope, serviceDS, indicatorsDS, userDS) {
    var vm = this;
    vm.title = 'histogram';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0038');
    $rootScope.helpReference = '05.Stadistics/histogram.htm';
    vm.listuser = [];
    vm.listvalues = [];
    vm.listselect = [];
    vm.allcheckservice = true;
    vm.report = false;
    vm.typefilter = '2';
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.modalError = modalError;
    vm.getservice = getservice;
    vm.getuser = getuser;
    vm.selectallservice = selectallservice;
    vm.additemslist = additemslist;
    vm.getindicatorshistogram = getindicatorshistogram;
    vm.convertminutes = convertminutes;
    vm.gethistogram = gethistogram;
    vm.requerid = requerid;
    $rootScope.pageview = 3;

    //** Método para enviar a la página cuando es requerida**//
    function requerid(page) {
      $state.go(page);
    }

    function gethistogram() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return indicatorsDS.getHistogram(auth.authToken).then(function (data) {
          if (data.status === 200) {
            var data = data.data === '' ? [] : data.data;
            var hitogram = $filter('filter')(data, function (e) {
              return e.state === true
            });
            if (hitogram.length > 0) {
              vm.getservice();
            } else {
              UIkit.modal("#Requerid", {
                bgclose: false
              }).show();
            }
          } else {
            UIkit.modal("#Requerid", {
              bgclose: false
            }).show();
          }
        },
        function (error) {
          vm.modalError(error);
        });
    }

    function getservice() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getServiceActive(auth.authToken).then(function (data) {
          if (data.status === 200) {
            vm.listservice = data.data;
            vm.listvalues = vm.listselect;
            vm.getuser();
          }
        },
        function (error) {
          vm.modalError(error);
        });
    }

    function getuser() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getuserActive(auth.authToken).then(function (data) {
          if (data.status === 200) {
            vm.listuser = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        });
    }

    function selectallservice(id) {
      vm.allcheckservice = !vm.allcheckservice;

      if (vm.listselect.length === vm.listservice.length && vm.allcheckservice) {
        var element = vm.listselect[vm.listselect.length - 1];
        var elementlist = ($filter('filter')(vm.listservice, {
          id: element.id
        }));
        elementlist[0].code = elementlist[0].code.substring(1, elementlist[0].code.length);
        vm.listselect = vm.listselect.splice(0, vm.listselect.length - 1);
      }

      if (vm.allcheckservice) {
        vm.listvalues = vm.listservice;
        if (vm.listselect.length > 0) {
          vm.listselect.forEach(function (value, key) {
            vm.listvalues = ($filter('filter')(vm.listvalues, {
              id: '!' + value.id
            }));
          });
        }
      } else {
        vm.listvalues = vm.listselect;
      }
    }

    function additemslist(item) {
      var list = ($filter('filter')(vm.listselect, {
        id: item.id
      }));

      if (list.length === 0) {
        if (vm.listselect.length + 1 === vm.listservice.length && vm.allcheckservice) {
          UIkit.modal("#modalinformative").show();
        } else {
          var element = {
            'id': item.id,
            'name': item.name,
            'code': item.code
          };
          vm.listselect.push(element);
          item.code = '-' + item.code;

          vm.listvalues = vm.listservice;
        }
      } else {
        item.code = item.code.substring(1, item.code.length);
        vm.listselect = ($filter('filter')(vm.listselect, {
          id: '!' + item.id
        }));
      }

      //asignar el valor de los items de la lista
      if (vm.allcheckservice) {
        vm.listvalues = vm.listservice;
        if (vm.listselect.length > 0) {
          vm.listselect.forEach(function (value, key) {
            vm.listvalues = ($filter('filter')(vm.listvalues, {
              id: '!' + value.id
            }));
          });
        }
      } else {
        vm.listvalues = vm.listselect;
      }

      vm.item.selected = "";
    }

    function convertminutes(a) {
      var hours = Math.trunc(a / 60);
      var minutes = a % 60;
      return (hours + ":" + minutes);
    }

    function getindicatorshistogram() {

      var services = [];
      var demographics = [];
      var areas = [];
      var tests = [];

      if (vm.listvalues.length > 0) {
        var item = {
          "demographic": -5,
          "demographicItems": [],
        };

        vm.listvalues.forEach(function (value, key) {
          services.push(value.name);
          item.demographicItems.push(value.id);
        });

        demographics.push(item)
      }


      var data = {
        "rangeType": "2",
        "init": vm.rangeInit,
        "end": vm.rangeEnd,
        "startDate": vm.typefilter,
        "demographics": demographics,
        "areas": vm.listAreas,
        "tests": vm.numFilterAreaTest >= 2 ? vm.listTests : []
      };

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return indicatorsDS.getIndicatorsHistogram(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            var total = 0;
            data.data.standardDeviation = data.data.standardDeviation !== 0 ? vm.convertminutes(data.data.standardDeviation) : 0;
            data.data.mean = vm.convertminutes(data.data.mean);
            data.data.median = vm.convertminutes(data.data.median);
            data.data.percentile25 = vm.convertminutes(data.data.percentile25);
            data.data.percentile75 = vm.convertminutes(data.data.percentile75);

            data.data.detail.forEach(function (value, key) {
              value.verifyDate = moment(value.verifyDate).format('HH:mm:ss');
              value.validDate = moment(value.validDate).format('HH:mm:ss');
              total = total + value.totalTime;
              value.totalTime = vm.convertminutes(value.totalTime);
              value.verifyUser = ($filter('filter')(vm.listuser, {
                id: value.verifyUser
              }))[0].userName;
              value.validUser = ($filter('filter')(vm.listuser, {
                id: value.validUser
              }))[0].userName;
            });

            data.data.binds.forEach(function (value, key) {
              value.frecuency = value.frecuency === undefined ? 0 : value.frecuency;
            });

            data.data.average = vm.convertminutes(total);

            var parameterReport = {};

            parameterReport.variables = {
              "rangeInit": vm.rangeInit,
              "rangeEnd": vm.rangeEnd,
              "rangeType": 0,
              "typeFilter": services.length === 0 ? $filter('translate')('0353') : services.toString(),
              "username": auth.userName,
              "date": moment().format(vm.formatDate + ', HH:mm:ss'),
              "startDate": vm.typefilter
            };

            parameterReport.pathreport = '/Report/stadistics/histogram/histogram.mrt';
            parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
            var datareport = LZString.compressToUTF16(JSON.stringify(data.data));
            localStorageService.set('parameterReport', parameterReport);
            localStorageService.set('dataReport', datareport);
            window.open("/viewreport/viewreport.html");
          } else {

            UIkit.modal("#modalReportError").show();
          }
          vm.report = false;
        },
        function (error) {
          vm.modalError(error);
        });
    }

    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function init() {
      vm.gethistogram();
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */
