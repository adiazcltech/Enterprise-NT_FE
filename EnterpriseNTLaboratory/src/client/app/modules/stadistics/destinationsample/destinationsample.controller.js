/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.destinationsample')
    .controller('destinationsampleController', destinationsampleController);


  destinationsampleController.$inject = ['LZString', '$translate', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'sampleDS', 'areaDS', 'destinationDS', 'stadisticsDS'];

  function destinationsampleController(LZString, $translate, localStorageService,
    logger, $filter, $state, moment, $rootScope, sampleDS, areaDS, destinationDS, stadisticsDS) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = 'histogram';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0041');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    $rootScope.helpReference = '05.Stadistics/destinationsample.htm';

    vm.report = false;
    vm.search = false;
    vm.listroute = [];

    vm.listssample = [];
    vm.listvaluessample = [];
    vm.listselectsample = [];
    vm.allchecksample = true;
    $rootScope.pageview = 3;
    vm.listsarea = [];
    vm.listvaluesarea = [];
    vm.listselectarea = [];
    vm.allcheckarea = true;

    vm.rangeInit = moment().format("YYYYMMDD");
    vm.rangeEnd = moment().format("YYYYMMDD");

    vm.modalError = modalError;

    vm.getdestination = getdestination;
    vm.changedestination = changedestination;

    vm.getsample = getsample;
    vm.selectallsample = selectallsample;
    vm.additemslistsample = additemslistsample;

    vm.getarea = getarea;
    vm.selectallarea = selectallarea;
    vm.additemslistarea = additemslistarea;

    vm.orderList = orderList;
    vm.ordersample = ordersample;

    vm.getsampledestination = getsampledestination;
    vm.getorders = getorders;
    vm.closemodal = closemodal;
    vm.typemodal = 0;

    vm.printreport = printreport;

    vm.config = {
      autoHideScrollbar: false,
      theme: 'light',
      advanced: {
        updateOnContentResize: true
      },
      setHeight: 200,
      scrollInertia: 0
    };


    function getdestination() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationDS.getDestinationActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data = data.data.sort(vm.orderList);
          vm.listdestination = data.data;
          vm.listdestination1 = data.data;
          vm.listdestination2 = data.data;
          vm.listdestination3 = data.data;
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function changedestination(item, index) {
      vm.listroute = [];
      if (index === 1 && item !== undefined) {
        vm.destination2 = undefined;
        vm.destination3 = undefined;
        vm.listdestination2 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
        vm.listdestination2 = ($filter('filter')(vm.listdestination2, { id: '!' + item.id }));
        vm.listdestination3 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
        vm.listdestination3 = ($filter('filter')(vm.listdestination3, { id: '!' + item.id }));
      }

      else if (index === 1 && item === undefined) {
        vm.destination2 = undefined;
        vm.destination3 = undefined;
        vm.listdestination2 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
        vm.listdestination3 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
      }

      else if (index === 2 && item !== undefined) {
        vm.destination3 = undefined;
        vm.listdestination3 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
        vm.listdestination3 = ($filter('filter')(vm.listdestination3, { id: '!' + item.id }));
        vm.listdestination3 = ($filter('filter')(vm.listdestination3, { id: '!' + vm.destination1.id }));
      }

      else if (index === 2 && item === undefined) {
        vm.destination3 = undefined;
        vm.listdestination3 = vm.listdestination.splice.apply(vm.listdestination, [0, vm.listdestination.length].concat(vm.listdestination));
        vm.listdestination3 = ($filter('filter')(vm.listdestination3, { id: '!' + vm.destination1.id }));
      }
    }

    function getsample() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.getSampleActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listssample = data.data.sort(vm.ordersample);
          vm.listvaluessample = vm.listselectsample;

        }
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function selectallsample(id) {
      vm.allchecksample = !vm.allchecksample;

      if (vm.listselectsample.length === vm.listssample.length && vm.allchecksample) {
        var element = vm.listselectsample[vm.listselectsample.length - 1];
        var elementlist = ($filter('filter')(vm.listssample, { id: element.id }));
        elementlist[0].codesample = elementlist[0].codesample.substring(1, elementlist[0].codesample.length);
        vm.listselectsample = vm.listselectsample.splice(0, vm.listselectsample.length - 1);
      }

      if (vm.allchecksample) {
        vm.listvaluessample = vm.listssample;
        if (vm.listselectsample.length > 0) {
          vm.listselectsample.forEach(function (value, key) {
            vm.listvaluessample = ($filter('filter')(vm.listvaluessample, { id: '!' + value.id }));
          });
        }
      }
      else {
        vm.listvaluessample = vm.listselectsample;
      }
    }

    function additemslistsample(item) {
      var list = ($filter('filter')(vm.listselectsample, { id: item.id }));

      if (list.length === 0) {
        if (vm.listselectsample.length + 1 === vm.listssample.length && vm.allchecksample) {
          vm.messageinformative = $filter('translate')('0547');
          UIkit.modal("#modalinformative").show();
        }
        else {
          var element = {
            'id': item.id,
            'name': item.name,
            'codesample': item.codesample
          };
          vm.listselectsample.push(element);
          item.codesample = '-' + item.codesample;
          vm.listvaluessample = vm.listssample;
        }
      }
      else {
        item.codesample = item.codesample.substring(1, item.codesample.length)
        vm.listselectsample = ($filter('filter')(vm.listselectsample, { id: '!' + item.id }));
      }

      //asignar el valor de los items de la lista
      if (vm.allchecksample) {
        vm.listvaluessample = vm.listssample;
        if (vm.listselectsample.length > 0) {
          vm.listselectsample.forEach(function (value, key) {
            vm.listvaluessample = ($filter('filter')(vm.listvaluessample, { id: '!' + value.id }));
          });
        }
      }
      else {
        vm.listvaluessample = vm.listselectsample;
      }
      vm.item.selected = "";
    }

    function getarea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            value.code = value.ordering.toString();
          });
          data.data = ($filter('filter')(data.data, { id: '!1' }));
          vm.listsarea = data.data.sort(vm.orderList);
          vm.listvaluesarea = vm.listselectarea;

        }
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function selectallarea(id) {
      vm.allcheckarea = !vm.allcheckarea;
      if (vm.listselectarea.length === vm.listsarea.length && vm.allcheckarea) {
        var element = vm.listselectarea[vm.listselectarea.length - 1];
        var elementlist = ($filter('filter')(vm.listsarea, { id: element.id }));
        elementlist[0].code = elementlist[0].code.substring(1, elementlist[0].code.length);
        vm.listselectarea = vm.listselectarea.splice(0, vm.listselectarea.length - 1);
      }
      if (vm.allcheckarea) {
        vm.listvaluesarea = vm.listsarea;
        if (vm.listselectarea.length > 0) {
          vm.listselectarea.forEach(function (value, key) {
            vm.listvaluesarea = ($filter('filter')(vm.listvaluesarea, { id: '!' + value.id }));
          });
        }
      }
      else {
        vm.listvaluesarea = vm.listselectarea;
      }
    }

    function additemslistarea(item) {
      var list = ($filter('filter')(vm.listselectarea, { id: item.id }));

      if (list.length === 0) {
        if (vm.listselectarea.length + 1 === vm.listsarea.length && vm.allcheckarea) {
          vm.messageinformative = $filter('translate')('0547')
          UIkit.modal("#modalinformative").show();
        }
        else {
          var element = {
            'id': item.id,
            'name': item.name,
            'code': item.code
          };
          vm.listselectarea.push(element);
          item.code = '-' + item.code;
          vm.listvaluesarea = vm.listsarea;
        }
      }
      else {
        item.code = item.code.substring(1, item.code.length)
        vm.listselectarea = ($filter('filter')(vm.listselectarea, { id: '!' + item.id }));
      }

      //asignar el valor de los items de la lista
      if (vm.allcheckarea) {
        vm.listvaluesarea = vm.listsarea;
        if (vm.listselectarea.length > 0) {
          vm.listselectarea.forEach(function (value, key) {
            vm.listvaluesarea = ($filter('filter')(vm.listvaluesarea, { id: '!' + value.id }))
          });
        }
      }
      else {
        vm.listvaluesarea = vm.listselectarea;
      }

      vm.item.selectedarea = "";
    }

    function orderList(a, b) {
      return a.code.toString().length - b.code.toString().length || a.code.toString().localeCompare(b.code.toString());
    }

    function ordersample(a, b) {
      return a.codesample.toString().length - b.codesample.toString().length || a.codesample.toString().localeCompare(b.codesample.toString())
    }

    function getsampledestination() {
      var destination = [];
      vm.listroute = [];
      if (vm.destination1 !== undefined) {
        destination.push(vm.destination1.id)
      }
      if (vm.destination2 !== undefined) {
        destination.push(vm.destination2.id)
      }
      if (vm.destination3 !== undefined) {
        destination.push(vm.destination3.id)
      }

      var samples = [];
      vm.listvaluessample.forEach(function (value, key) {
        samples.push(value.id);
      })

      var areas = [];
      vm.listvaluesarea.forEach(function (value, key) {
        areas.push(value.id);
      })

      var object = {
        "rangeType": "1",
        "init": moment(vm.rangeInit).format("YYYYMMDD"),
        "end": moment(vm.rangeEnd).format("YYYYMMDD"),
        "samplesDestiny": destination,
        "areas": areas,
        "samples": samples
      };

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return stadisticsDS.getsampledestination(auth.authToken, object).then(function (data) {
        if (data.status === 200) {
          vm.listroute = data.data.dataGroup;
          vm.listorders = data.data.dataDetail;
        }
        else {
          vm.messageinformative = $filter('translate')('0574')
          UIkit.modal("#modalinformative").show();
        }
        vm.search = false;
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function getorders(item, destination, state, value) {
      if (value !== 0) {
        vm.typemodal = state === true ? 0 : 1;
        var listorder = vm.listorders.splice.apply(vm.listorders, [0, vm.listorders.length].concat(vm.listorders));
        listorder = ($filter('filter')(vm.listorders, { branch: { id: item.branch }, type: { id: item.orderType } }));

        vm.listfilterorder = [];
        for (var i = 0; i < listorder.length; i++) {
          for (var j = 0; j < listorder[i].samples.length; j++) {
            if (listorder[i].samples[j].id === item.sample) {
              var listdestination = ($filter('filter')(listorder[i].samples[j].destinatios, { id: destination, verified: state }))
              if (listdestination.length > 0) {
                vm.listfilterorder.push(listorder[i]);
                break;
              }
            }
          }
        }
        UIkit.modal("#modal_fullcomment").show();
      }
    }

    function closemodal() {
      UIkit.modal("#modal_fullcomment").hide();
    }

    function printreport() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var parameterReport = {};
      var data = [];

      vm.listroute.forEach(function (value, key) {
        var item = {
          "sampleName": value.sampleName,
          "orderTypeName": value.orderTypeName,
          "branchName": value.branchName,
          "total": value.total,
          "verify": value.verify,
          "checkAmountdestination1": value.destinations[0].checkAmount === undefined ? 'N/A' : value.destinations[0].checkAmount,
          "uncheckAmountdestination1": value.destinations[0].uncheckAmount === undefined ? 'N/A' : value.destinations[0].uncheckAmount,
          "checkAmountdestination2": value.destinations[1] !== undefined ? value.destinations[1].checkAmount === undefined ? 'N/A' : value.destinations[1].checkAmount : "",
          "uncheckAmountdestination2": value.destinations[1] !== undefined ? value.destinations[1].uncheckAmount === undefined ? 'N/A' : value.destinations[1].uncheckAmount : "",
          "checkAmountdestination3": value.destinations[2] !== undefined ? value.destinations[2].checkAmount === undefined ? 'N/A' : value.destinations[2].checkAmount : "",
          "uncheckAmountdestination3": value.destinations[2] !== undefined ? value.destinations[2].uncheckAmount === undefined ? 'N/A' : value.destinations[2].uncheckAmount : ""
        };
        data.push(item);
      });


      parameterReport.variables = {
        "rangeInit": moment(vm.rangeInit).format(vm.formatDate),
        "rangeEnd": moment(vm.rangeEnd).format(vm.formatDate),
        "username": auth.userName,
        "date": moment().format(vm.formatDate + ', HH:mm:ss'),
        "destination1": vm.destination1.name,
        "destination2": vm.destination2 === undefined ? null : vm.destination2.name,
        "destination3": vm.destination3 === undefined ? null : vm.destination3.name
      };

      parameterReport.pathreport = '/Report/stadistics/destinationSample/destinationSample.mrt';
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());

      var datareport = LZString.compressToUTF16(JSON.stringify(data));

      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);

      window.open("/viewreport/viewreport.html");
      vm.report = false;
    }

    function init() {
      vm.getdestination();
      vm.getsample();
      vm.getarea();
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

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */