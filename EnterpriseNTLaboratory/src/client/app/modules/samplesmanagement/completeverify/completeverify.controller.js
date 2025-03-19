/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.completeverify")
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ])
    .filter("propsFilter", function () {
      return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
          var keys = Object.keys(props);
          items.forEach(function (item) {
            var itemMatches = false;
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }
            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    })
    .controller("completeverifyController", completeverifyController);

  completeverifyController.$inject = [
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$scope",
    "$rootScope",
    "destinationDS",
    "sampletrackingsDS",
    "widgetsDS",
    "userDS",
    "sigaDS",
    "orderDS",
    "testDS",
    "$interval",
    "orderentryDS"
  ];

  function completeverifyController(
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $scope,
    $rootScope,
    destinationDS,
    sampletrackingsDS,
    widgetsDS,
    userDS,
    sigaDS,
    orderDS,
    testDS,
    $interval,
    orderentryDS
  ) {
    var vm = this;
    vm.title = "completeverify";
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0247");
    $rootScope.helpReference = "01. LaboratoryOrders/completeverify.htm";
    localStorageService.remove("orderviewverification");
    vm.editturn2 = "";
    vm.showSimpleToast = showSimpleToast;
    vm.timer = null;
    $rootScope.pageview = 3;
    //llaves de configuracion.
    vm.keytakesample = localStorageService.get("TomaMuestra");
    vm.intervalwidget = localStorageService.get("WidgetMuestraTiempo") * 100000;
    vm.formatDate =
      localStorageService.get("FormatoFecha").toUpperCase() + ",  HH:mm:ss";
    vm.formatDatedetiny = localStorageService.get("FormatoFecha");

    //llaves de configuracion siga.
    vm.serviceEntrySiga = parseInt(localStorageService.get("stateTurnSiga"));
    vm.viewtemperature =
      localStorageService.get("ManejoTemperatura") === "True";
    vm.viewchaguetest =
      localStorageService.get("ModificarExamenesEntrada") === "True";  
    vm.turnfilter =
      localStorageService.get("OrdenesSIGA") === "" ? false : true;
    vm.activesigaorder = parseInt(localStorageService.get("moduleSiga"));
    vm.dataturn = parseInt(localStorageService.get("turn"));
    vm.viewalarm =
      localStorageService.get("VerAlarmaCalidadMuestra") === "True";

  
    vm.destination = {};
    vm.destination.type = {};

    vm.openinterview = false;
    vm.order = "";
    vm.menssageinformative = "";
    vm.Listdestination = [];
    vm.beforesavereject = false;
    vm.showsample = false;
    vm.showdestination = false;
    vm.numberOrder = null;
    vm.volumentotal = 0;
    vm.loading = false;
    //vm.parseInt = parseInt;

    vm.getdestinations = getdestinations;
    vm.getUserList = getUserList;
    vm.getauditsample = getauditsample;

    vm.verification = verification;
    vm.getSampleOrder = getSampleOrder;
    vm.getDetailSample = getDetailSample;
    vm.OrderListDestination = OrderListDestination;
    vm.OrderRouteSample = OrderRouteSample;
    vm.gotuberack = gotuberack;
    vm.changetestselect = changetestselect;

    vm.takesample = takesample;
    vm.validPendingCollection = validPendingCollection;
    vm.verifyInitial = verifyInitial;
    vm.verifyDestination = verifyDestination;

    vm.getwidgets = getwidgets;
    vm.samplestatewidgets = [];
    vm.optionssamplestatewidgets = {};
    vm.changeAlarm = changeAlarm;

    vm.savedemografic = savedemografic;
    vm.postponement = postponement;
    vm.reject = reject;
    vm.retake = retake;
    vm.endturn = endturn;
    vm.automaticshift = false;

    vm.openmodaltestDestination = openmodaltestDestination;
    vm.closemodaltest = closemodaltest;
    vm.closemodaldemographics = closemodaldemographics;
    vm.verificationturno = verificationturno;
    vm.cleanverification = cleanverification;
    vm.viewturn = viewturn;
    vm.getDetailOrder = getDetailOrder;
    vm.sampleCheckRetakeTracking = sampleCheckRetakeTracking;

    vm.modalError = modalError;
    vm.gettest = gettest;
    vm.changetest = changetest;
    vm.changestatesample = changestatesample;
    vm.change = change;
    vm.datequestion = datequestion;
    vm.changeSelect = changeSelect;
    vm.changelist = changelist;
    vm.clearSearchTerm = clearSearchTerm;
    vm.searchTerm;
    vm.keydownsearch = keydownsearch;
    vm.Saveinterview = Saveinterview;
    vm.savetemperature = savetemperature;
    vm.dataviewsiga = localStorageService.get("dataviewsiga");

    /*
     state sample
     PENDING(-1),
     REJECTED(0),
     NEW_SAMPLE(1),
     ORDERED(2),
     COLLECTED(3),
     CHECKED(4);  */

    $rootScope.$watch('stateTurnSiga', function () {
      vm.dataviewsiga = localStorageService.get("dataviewsiga");
      vm.activesigaorder = localStorageService.get('moduleSiga') === null ? '' : parseInt(localStorageService.get('moduleSiga'));
      if ($rootScope.stateTurnSiga === undefined) {
        vm.serviceEntrySiga = localStorageService.get('stateTurnSiga') === null ? '' : parseInt(localStorageService.get('stateTurnSiga'));
      } else {
        vm.serviceEntrySiga = $rootScope.stateTurnSiga;
      }
    });

    $rootScope.$watch("dataturn", function () {
      vm.dataturn = localStorageService.get("turn");
      if (localStorageService.get("orderviewverification") !== null) {
        vm.verificationturno(localStorageService.get("orderviewverification"));
      }
    });

    vm.keydownsearch = keydownsearch;

    function keydownsearch(ev) {
      ev.stopPropagation();
    }



    /**
        Funcion:  Metodo para finalizar un turno
        @author  adiaz
    */
    function endturn() {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var dataend = {
        id: 0,
        turn: {
          id: parseInt(localStorageService.get("turn").id),
        },
        service: {
          id: parseInt(localStorageService.get("VerificacionSIGA")),
        },
        pointOfCare: {
          id: parseInt(localStorageService.get("pointSiga").id),
        },
        user: {
          id: auth.id,
          user:auth.userName,
          lastName:auth.lastName,
          name:auth.name
        }
      };     
      return sigaDS.cancelturn(auth.authToken, dataend).then(
        function (data) {
          if (data.status === 200) {
            vm.listSample = [];
            vm.editturn2 = "";
            vm.order = "";
            vm.sample = -1;
            vm.numberOrder = null;
            vm.ButonReject = false;
            vm.Butoninterview = false;
            vm.Butonbarcode = false;
            vm.Butonpostponement = false;
            vm.Butonretake = false;
            vm.Butondelayedsamples = false;
            vm.Butondemographics = false;
            vm.showsample = false;
            vm.showdestination = false;
            $rootScope.dataturn = null;
            localStorageService.remove("turn");
            localStorageService.remove("orderviewverification");
            UIkit.modal("#endturnconfirmation").hide();
            logger.success($filter("translate")("0906"));
          }
          vm.loading = false;
        },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        }
      );
    }

    function gotuberack() {
      vm.loading = true;
      $rootScope.Ordertuberack = vm.order;
      $rootScope.SampleOrdertuberack = vm.sample;
      $state.go("tuberack");
    }

    function cleanverification() {
      vm.listSample = [];
      vm.order = "";
      vm.sample = -1;
      vm.numberOrder = null;
      vm.ButonReject = false;
      vm.Butoninterview = false;
      vm.Butonbarcode = false;
      vm.Butonpostponement = false;
      vm.Butonretake = false;
      vm.Butondelayedsamples = false;
      vm.Butondemographics = false;
      vm.showsample = false;
      vm.showdestination = false;
      vm.editturn2 = "";
    }
    /**
         Funcion:  Metodo que obtiene una lista de los destinos creados y activos en el sistema
         @author  adiaz
     */
    function getdestinations() {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.getUserList();
      return destinationDS.getDestinationActive(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.Listdestination = data.data;
            vm.Listdestination.sort(vm.OrderListDestination);
            vm.destination.id = vm.Listdestination[0].id;
            vm.destination.name = vm.Listdestination[0].name;
            vm.destination.code = vm.Listdestination[0].code;
            vm.destination.type.id = vm.Listdestination[0].type.id;
          }
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
        Funcion:  Metodo para organizar los destinos por tipo y nombre.
        @author  adiaz
    */
    function OrderListDestination(a, b) {
      if (a.type.id < b.type.id) {
        return -1;
      } else if (a.type.id > b.type.id) {
        return 1;
      } else {
        if (a.code < b.code) {
          return -1;
        } else if (a.code > b.code) {
          return 1;
        } else {
          return 0;
        }
      }
    }

    /**
        Funcion:  Metodo que obtiene una lista de los usuarios creados  en el sistema
        @author  adiaz
    */
    function getUserList() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.gettest();
      return userDS.getUsers(auth.authToken).then(
        function (data) {
          vm.listUser = data.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function gettest() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(
        function (data) {
          if (data.status === 200) {
            data.data.forEach(function (value, key) {
              data.data[key].search = value.code + value.name;
            });
            vm.datatest = data.data;
          } else {
            vm.datatest = [];
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function changetest(item, test) {
      vm.testchange1 = item;
      vm.testchange2 = test;
      UIkit.modal("#verificationchangetest").show();
    }

    function changetestselect() {
      var datachangeorder = {
        numberOrder: vm.numberOrder,
        oldExamIdentifier: vm.testchange2.id,
        newExamIdentifier: vm.testchange1.id,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .updateResultForExam(auth.authToken, datachangeorder)
        .then(
          function (data) {
            if (data.status === 200) {
              UIkit.modal("#verificationchangetest").hide();
              vm.verification();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    /**
        Funcion:  Metodo que  establece el estado inicial de los botones y ejecuta metodo para cargar las muestras de la orden.
        @author  adiaz
    */
    function verification() {
      vm.ButonReject = false;
      vm.Butoninterview = false;
      vm.Butonbarcode = false;
      vm.Butonpostponement = false;
      vm.Butonretake = false;
      vm.Butondelayedsamples = false;
      vm.Butondemographics = false;
      vm.showsample = false;
      vm.showdestination = false;
      angular.element("#verification").select();
      /*  vm.numberOrder = vm.order; */
      vm.viewinterview = false;
      vm.getSampleOrder();
    }

    function verificationturno(order) {
      vm.order = order.toString();
      vm.ButonReject = false;
      vm.Butoninterview = false;
      vm.Butonbarcode = false;
      vm.Butonpostponement = false;
      vm.Butonretake = false;
      vm.Butondelayedsamples = false;
      vm.Butondemographics = false;
      vm.showsample = false;
      vm.showdestination = false;
      angular.element("#verification").select();
      vm.sample = "";
      vm.getSampleOrder();
    }

    /**
        Funcion:  Metodo que para cargar las muestras de la orden.
        @author  adiaz
    */
    function getSampleOrder() {
      vm.viewinterview = false;
      vm.loading = true;
      vm.listSample = [];
      vm.menssageinformative = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (vm.order !== "") {
        var validatedmonth = false;
        var validatedday = false;
        var year = vm.order.substring(0, 4);
        var month = vm.order.substring(6, 4);
        if (parseInt(month) > 12 || parseInt(month) === 0) {
          validatedmonth = true;
        } else {
          var day = vm.order.substring(8, 6);
          var daymonth = new Date(parseInt(year), parseInt(month), 0).getDate();
          if (parseInt(day) > daymonth || parseInt(month) === 0) {
            validatedday = true;
          }
        }
        if (!validatedmonth && !validatedday && parseInt(year) !== 0) {
          vm.viewturn();
          vm.getDetailOrder();
          if (vm.order !== undefined) {
            return sampletrackingsDS.sampleorder(auth.authToken, vm.order).then(
              function (data) {
                vm.ordercomment = vm.order;
                vm.numberOrder = vm.order;
                if (data.status === 200) {
                  vm.showSimpleToast(vm.order);
                  if (data.data.length > 0) {
                    data.data.forEach(function (value, key) {
                      var sampleverific = $filter("filter")(
                        value.sampleTrackings,
                        {
                          state: 4,
                        }
                      );
                      value.tests = $filter("filter")(value.tests, function (e) {
                        return e.testType === 0;
                      })
                      if (value.qualityFlag === 3 && sampleverific.length > 0) {
                        var minutes = moment().diff(
                          sampleverific[0].date,
                          "seconds"
                        );
                        var timeline = moment().subtract(
                          minutes - value.qualityTime * 59,
                          "seconds"
                        );
                        value.time = parseInt(moment(timeline).format("x"));
                      } else if (
                        value.qualityFlag === 2 &&
                        sampleverific.length > 0
                      ) {
                        var minutes = moment().diff(
                          sampleverific[0].date,
                          "seconds"
                        );
                        var timeline = moment().add(
                          value.qualityTime * 59 - minutes,
                          "seconds"
                        );
                        value.time = parseInt(moment(timeline).format("x"));
                      }
                    });

                    vm.listSample = _.orderBy(
                      data.data,
                      ["codesample"],
                      ["asc"]
                    );
                    vm.routeSample = [];
                    vm.Butoninterview = true;
                    vm.Butonbarcode = true;
                    vm.Butondemographics = true;

                    if (vm.sample !== "" && vm.sample !== -1) {
                      vm.getDetailSample();
                    } else {
                      vm.showsample = true;
                      vm.showdestination = false;
                      vm.sample = "";
                    }
                  }
                } else {
                  vm.menssageinformative = $filter("translate")("0179");
                  vm.ordercomment = null;
                  vm.numberOrder = null;
                }
                vm.loading = false;
              },
              function (error) {
                if (vm.order !== '' && vm.order !== null && vm.order !== undefined) {
                  if (error.data.detail !== undefined && error.data.detail !== null && error.data.detail !== '') {
                    if (error.data.detail.search(vm.order.slice(0, 4)) === -1) {
                      vm.getSampleOrder();
                    } else {
                      vm.ordercomment = null;
                      vm.numberOrder = null;
                      vm.loading = false;
                      vm.menssageinformative = $filter('translate')('0179');
                    }
                  } else {
                    vm.getSampleOrder();
                  }
                } else {
                  vm.ordercomment = null;
                  vm.numberOrder = null;
                  vm.loading = false;
                  vm.menssageinformative = $filter('translate')('0179');
                }
              }
            );
          }
        } else {
          vm.ordercomment = null;
          vm.numberOrder = null;
          vm.menssageinformative = $filter("translate")("1477");
          vm.loading = false;
        }
      }
    }

    function getDetailOrder() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      orderDS
        .getOrderbyOrder(auth.authToken, vm.order)
        .then(function (response) {
          if (response.status === 200) {
            var ordertype = _.filter(response.data, {
              idDemographic: -4,
            });
            vm.ordertyperecall = ordertype[0].codifiedId === 4;
          }
        });
    }

    function viewturn() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .sampletrackingsorder(auth.authToken, vm.order)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.editturn2 = data.data.turn;
            }
          },
          function (error) { }
        );
    }

    function getauditsample() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var sample = _.filter(vm.listSample, function (e) {
        return e.codesample === vm.sample;
      })[0];
      return sampletrackingsDS
        .sampleaudit(auth.authToken, vm.order, sample.id)
        .then(
          function (data) {
            if (data.status === 200) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].dateformat = moment(data.data[i].date).format(vm.formatDate);
              }
              vm.listauditsample = data.data;
            } else if (data.status === 204) {
              vm.showsample = true;
              vm.messageinformativegeneral = $filter("translate")("0482");
              UIkit.modal("#modalinformative").show();
            }
            vm.loading = false;
          },
          function (error) {
            vm.loading = false;
            if (error.data === null) {
              vm.modalError(error);
            } else {
              if (error.data.errorFields[0] === "0|sample") {
                vm.menssageinformative = $filter("translate")("1493");
              }
            }
          }
        );
    }

    /**
        Funcion:  Metodo para consultar la ruta de una muestra con su respectiva trazabilidad.
        @author  adiaz
    */
    function getDetailSample() {
      vm.loading = true;
      vm.enddestinationverify = {};
      vm.enddestinationverify.order = -1;
      vm.nextdestinationverify = null;
      var cantdestinationverify = 0;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .SampleOrderRoute(auth.authToken, vm.order, vm.sample)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.showsample = false;
              vm.minimumTemperature = data.data.sample.minimumTemperature;
              vm.maximumTemperature = data.data.sample.maximumTemperature;
              vm.showdestination = true;
              var sampledetail = $filter("filter")(
                vm.listSample,
                {
                  codesample: vm.sample,
                },
                true
              );
              vm.idsample = sampledetail.id;
              var sampleretake = $filter('filter')(sampledetail[0].tests, function (e) {
                return e.result.sampleState === 1
              });
              vm.samplestate = sampledetail[0].sampleState.state;
              vm.routeSample = data.data.destinationRoutes;
              vm.routeSample.sort(vm.OrderRouteSample);
              for (var i = vm.routeSample.length - 1; i >= 0; i--) {
                vm.routeSample[i].dateVerify =
                  vm.routeSample[i].dateVerify === null
                    ? $filter("translate")("0413")
                    : moment(vm.routeSample[i].dateVerify).format(
                      vm.formatDate
                    );
                if (vm.routeSample[i].verify) {
                  vm.routeSample[i].userVerify.photo = $filter("filter")(
                    vm.listUser,
                    {
                      id: vm.routeSample[i].userVerify.id,
                    },
                    true
                  )[0].photo;
                }
                if (
                  vm.routeSample[i].verify &&
                  (i === vm.routeSample.length - 1 ||
                    !vm.routeSample[i + 1].verify)
                ) {
                  vm.enddestinationverify = vm.routeSample[i];
                  cantdestinationverify = cantdestinationverify + 1;
                }

                if (!vm.routeSample[i].verify) {
                  vm.nextdestinationverify = vm.routeSample[i];
                }

                vm.routeSample[i].listtest = [];
                vm.routeSample[i].tests.forEach(function (value, key) {
                  if (value.result !== undefined) {
                    value.result.dateOrdered =
                      value.result.dateOrdered === undefined
                        ? ""
                        : moment(value.result.dateOrdered).format(
                          vm.formatDate
                        );
                    value.result.dateSample =
                      value.result.dateSample === undefined
                        ? ""
                        : moment(value.result.dateSample).format(vm.formatDate);
                    value.result.dateResult =
                      value.result.dateResult === undefined
                        ? ""
                        : moment(value.result.dateResult).format(vm.formatDate);
                    value.result.dateValidation =
                      value.result.dateValidation === undefined
                        ? ""
                        : moment(value.result.dateValidation).format(
                          vm.formatDate
                        );
                    value.result.datePrinted =
                      value.result.datePrinted === undefined
                        ? ""
                        : moment(value.result.datePrinted).format(
                          vm.formatDate
                        );
                    vm.routeSample[i].listtest.push(value);
                  }
                });
              }
              var validRetake = _.filter(sampledetail[0].tests, function (o) {
                return o.result.sampleState === 1;
              });
              if (validRetake.length > 0 && data.data.service.hospitalSampling === true
              ) {
                if (vm.viewtemperature) {
                  vm.temperature = null;
                  UIkit.modal('#modalviewtemperaturehospital', { modal: false }).show()
                } else {
                  UIkit.modal("#modalretakehospitalary").show();
                }
              } else {
                if (sampleretake.length === sampledetail[0].tests.length) {
                  vm.messageinformativegeneral = $filter("translate")("1522");
                  UIkit.modal("#modalinformative").show();
                } else {
                  if (sampledetail[0].sampleState.state === 0) {
                    vm.ButonReject = false;
                    vm.Butonpostponement = false;
                    vm.Butonretake = false;

                    vm.detailrejection =
                      sampledetail[0].sampleTrackings[
                      sampledetail[0].sampleTrackings.length - 1
                      ];

                    vm.detailrejection.date = moment(
                      vm.detailrejection.date
                    ).format(vm.formatDate);

                    vm.detailrejection.user.photo = $filter("filter")(
                      vm.listUser,
                      {
                        id: vm.detailrejection.user.id,
                      },
                      true
                    )[0].photo;
                    vm.menssageinformative = $filter("translate")("0177");
                  } else {
                    vm.menssageinformative = "";

                    vm.showsample = false;
                    vm.Butoninterview = true;
                    vm.Butonbarcode = true;
                    vm.Butondemographics = true;
                    vm.ButonReject =
                      sampledetail[0].sampleState.state === 2 ? false : true;

                    vm.Butonpostponement = vm.ordertyperecall
                      ? false
                      : sampledetail[0].sampleState.state === 2
                        ? false
                        : true;

                    vm.Butonretake =
                      sampledetail[0].sampleState.state === 2 ? false : true;

                    var destinationselected = $filter("filter")(
                      vm.routeSample,
                      {
                        destination: {
                          id: vm.destination.id,
                        },
                      },
                      true
                    );

                    if (destinationselected.length === 0) {
                      vm.messageinformativegeneral = $filter("translate")("0202");
                      UIkit.modal("#modalinformative").show();
                    } else if (
                      vm.nextdestinationverify === null &&
                      sampledetail[0].sampleState.state > 3
                    ) {
                      vm.validPendingCollection();
                      vm.messageinformativegeneral = $filter("translate")("0203");
                      UIkit.modal("#modalinformative").show();
                    } else if (
                      vm.nextdestinationverify === null &&
                      sampledetail[0].sampleState.state === 3
                    ) {
                      vm.verifyInitial();
                    } else if (
                      vm.nextdestinationverify.destination.id !==
                      destinationselected[0].destination.id
                    ) {
                      vm.validPendingCollection();
                      vm.messageinformativegeneral =
                        $filter("translate")("0204") +
                        ' "' +
                        vm.nextdestinationverify.destination.name +
                        '"';
                      UIkit.modal("#modalinformative").show();
                    } else if (destinationselected[0].verify) {
                      vm.validPendingCollection();
                      vm.messageinformativegeneral =
                        $filter("translate")("0204") +
                        ' "' +
                        vm.nextdestinationverify.destination.name +
                        '"';
                      UIkit.modal("#modalinformative").show();
                    } else if (!destinationselected[0].verify) {
                      vm.enddestinationverify = destinationselected[0];
                      vm.samplestateinterview = vm.samplestate;
                      vm.keytakesampleinterview = vm.keytakesample;
                      vm.destinationselectedinterview = destinationselected[0].id;
                      vm.interviewdestinationid = destinationselected[0].destination;
                      var auth = localStorageService.get(
                        "Enterprise_NT.authorizationData"
                      );
                      return sampletrackingsDS
                        .interviewdestination(
                          auth.authToken,
                          vm.interviewdestinationid.id
                        )
                        .then(function (data) {
                          if (data.status === 200) {
                            vm.ListInterview = data.data;
                            if (vm.ListInterview.length > 0) {
                              vm.ListInterview.forEach(function (value) {
                                if (value.control === 2) {
                                  value.interviewAnswer =
                                    value.interviewAnswer === undefined
                                      ? 0
                                      : parseInt(value.interviewAnswer);
                                } else if (value.control === 5) {
                                  value.answerSelected = $filter("filter")(
                                    value.answers,
                                    {
                                      selected: true,
                                    },
                                    true
                                  )[0];
                                  value.answerSelected = value.answerSelected;
                                } else if (value.control === 6) {
                                  value.answerSelected = $filter("filter")(
                                    value.answers,
                                    {
                                      selected: true,
                                    },
                                    true
                                  );
                                } else if (value.control === 4) {
                                  value.interviewAnswer = moment(
                                    value.interviewAnswer
                                  ).format();
                                }
                              });
                              UIkit.modal("#modalinterviewdestiny").show();
                            } else {
                              if (
                                vm.viewtemperature &&
                                vm.samplestateinterview === 2
                              ) {
                                vm.temperature = "";
                                UIkit.modal("#modalviewtemperature", {
                                  bgclose: false,
                                  escclose: false,
                                  modal: false,
                                }).show();
                              } else {
                                vm.changestatesample(
                                  vm.samplestateinterview,
                                  vm.keytakesampleinterview,
                                  vm.destinationselectedinterview
                                );
                              }
                            }
                          } else {
                            if (
                              vm.viewtemperature &&
                              vm.samplestateinterview === 2
                            ) {
                              vm.temperature = "";
                              UIkit.modal("#modalviewtemperature", {
                                bgclose: false,
                                escclose: false,
                                modal: false,
                              }).show();
                            } else {
                              vm.changestatesample(
                                vm.samplestateinterview,
                                vm.keytakesampleinterview,
                                vm.destinationselectedinterview
                              );
                            }
                          }
                        });
                    }
                  }
                }
              }
            } else if (data.status === 204) {
              vm.showsample = true;
              vm.messageinformativegeneral = $filter("translate")("0482");
              UIkit.modal("#modalinformative").show();
            }
            vm.loading = false;
          },
          function (error) {
            vm.loading = false;
            if (error.data === null) {
              vm.modalError(error);
            } else {
              if (error.data.errorFields[0] === "0|sample") {
                vm.menssageinformative = $filter("translate")("1493");
              }
            }
          }
        );
    }

    function validPendingCollection() {
      var sample = _.filter(vm.listSample, function (e) {
        return e.codesample === vm.sample;
      })[0];
      var testcollect = _.filter(sample.tests, function (e) {
        return e.result.sampleState === 2 || e.result.sampleState === 3;
      });
      if (testcollect.length > 0) {
        var testSampleTakeTracking = [];
        testcollect.forEach(function (value) {
          var test = {
            idTest: value.id,
            state: 4
          }
          testSampleTakeTracking.push(test);
        })
        var tests = {
          order: vm.order,
          sample: vm.sample,
          testSampleTakeTracking: testSampleTakeTracking
        }
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS
          .sampletaketest(
            auth.authToken, tests
          )
          .then(
            function (data) {
              if (data.status === 200) {
                vm.loading = false;
              }
            },
            function (error) {
              {
                vm.loading = false;
              }
            }
          );
      }
    }



    function changestatesample(
      samplestate,
      keytakesample,
      destinationselected
    ) {
      switch (samplestate) {
        case 2:
          //if (keytakesample === "True") {
          //vm.takesample(destinationselected);
          //} else {
          vm.verifyInitial(destinationselected);
          //}
          break;
        case 3:
          vm.verifyInitial(destinationselected);
          break;
        case 4:
          var sample = _.filter(vm.listSample, function (e) {
            return e.codesample === vm.sample;
          })[0];
          var testcollect = _.filter(sample.tests, function (e) {
            return e.result.sampleState === 2 || e.result.sampleState === 3 || e.result.sampleState === -1;
          });
          if (testcollect.length > 0) {
            vm.verifyInitial(destinationselected);
          } else {
            vm.verifyDestination(destinationselected);
          }
          break;
      }
    }

    function change(data) {
      if (data.required === true && data.interviewAnswer === null) {
        data.interviewAnswer = 0;
      }
    }

    function savetemperature() {
      vm.minimumTemperature = parseFloat(vm.minimumTemperature);
      vm.maximumTemperature = parseFloat(vm.maximumTemperature);
      if (
        vm.minimumTemperature <= vm.temperature &&
        vm.maximumTemperature >= vm.temperature
      ) {
        vm.loading = true;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS
          .sampletrackintemperature(
            auth.authToken,
            vm.order,
            vm.sample,
            vm.temperature
          )
          .then(
            function (data) {
              if (data.status === 200) {
                UIkit.modal("#modalviewtemperature").hide();
                vm.changestatesample(vm.samplestateinterview, vm.keytakesampleinterview, vm.destinationselectedinterview);
              }
              vm.loading = false;
            },
            function (error) {
              {
                if (error.data.code === 2) {
                  if (
                    error.data.errorFields[0] ===
                    "2|The order was not created at this headquarters"
                  ) {
                    vm.menssageinformative = $filter("translate")("1456");
                  }
                } else {
                  vm.modalError(error);
                }
                vm.loading = false;
              }
            }
          );
      } else {
        UIkit.modal("#modalviewtemperature").hide();
        vm.openmodalpostponement = true;
      }
    }
    vm.savetemperaturehospital = savetemperaturehospital;
    function savetemperaturehospital() {
      vm.minimumTemperature = parseFloat(vm.minimumTemperature);
      vm.maximumTemperature = parseFloat(vm.maximumTemperature);
      if (vm.minimumTemperature <= vm.temperature && vm.maximumTemperature >= vm.temperature) {
        vm.loading = true;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS
          .sampletrackintemperature(
            auth.authToken,
            vm.order,
            vm.sample,
            vm.temperature
          )
          .then(
            function (data) {
              if (data.status === 200) {
                if (vm.samplestate === 1) {
                  vm.verifyInitial();
                }
                var auth = localStorageService.get("Enterprise_NT.authorizationData");
                return sampletrackingsDS
                  .sampleCheckRetakeTracking(auth.authToken, vm.order, vm.sample)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        UIkit.modal("#modalviewtemperaturehospital").hide();
                        logger.success("Muestra ingresada");
                      }
                      vm.loading = false;
                    },
                    function (error) {
                      vm.modalError(error);
                      vm.loading = false;
                    }
                  );
              }
              vm.loading = false;
            },
            function (error) {
              {
                if (error.data.code === 2) {
                  if (
                    error.data.errorFields[0] ===
                    "2|The order was not created at this headquarters"
                  ) {
                    vm.menssageinformative = $filter("translate")("1456");
                  }
                } else {
                  vm.modalError(error);
                }
                vm.loading = false;
              }
            }
          );
      } else {
        vm.openmodalpostponement = true;
      }
    }

    function datequestion(startDate) {
      if (startDate.interviewAnswer === null && startDate.required) {
        startDate.interviewAnswer = moment().format();
      } else if (startDate.interviewAnswer === null && !startDate.required) {
        startDate.interviewAnswer = null;
      }
    }

    function changeSelect(object, listgeneral) {
      listgeneral.forEach(function (value, key) {
        value.selected = value.id === object.id ? true : false;
      });
    }

    function changelist(one, dos) {
      dos.forEach(function (value, key) {
        var answerlist = $filter("filter")(
          one,
          {
            id: value.id,
          },
          true
        );
        if (answerlist.length === 0) {
          value.selected = false;
        } else {
          value.selected = true;
        }
      });
    }

    function clearSearchTerm() {
      vm.searchTerm = "";
    }

    function keydownsearch(ev) {
      ev.stopPropagation();
    }

    function Saveinterview(Forminterview) {
      if (Forminterview.$valid) {
        var answerdate = $filter("filter")(
          vm.ListInterview,
          {
            control: 4,
          },
          true
        );
        answerdate.forEach(function (value, key) {
          if (value.interviewAnswer !== undefined) {
            value.interviewAnswer = moment(value.interviewAnswer).format();
          }
        });
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS
          .saveinterviewdes(
            auth.authToken,
            vm.order,
            vm.sample,
            vm.destination.id,
            auth.branch,
            vm.ListInterview
          )
          .then(
            function (data) {
              if (vm.viewtemperature && vm.samplestateinterview === 2) {
                logger.success($filter("translate")("0149"));
                vm.viewinterview = true;
                UIkit.modal("#modalinterviewdestiny").hide();
                vm.temperature = "";
                UIkit.modal("#modalviewtemperature", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else {
                vm.changestatesample(
                  vm.samplestateinterview,
                  vm.keytakesampleinterview,
                  vm.destinationselectedinterview
                );
                logger.success($filter("translate")("0149"));
                vm.viewinterview = true;
                UIkit.modal("#modalinterviewdestiny").hide();
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
      } else {
        vm.ListInterview.forEach(function (value, key) {
          if (value.control !== 4 && value.control !== 2) {
            Forminterview["question" + value.id].$touched = true;
          }
        });
      }
    }

    /**
        Funcion:  Metodo para ordenar la ruta de la muestra segun orden de configuracion.
        @author  adiaz
    */
    function OrderRouteSample(a, b) {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      }
    }

    /**
        Funcion:  Metodo para la toma de la muestra.
        @author  adiaz
    */
    function takesample(iddestination) {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .sampletrackingstake(auth.authToken, vm.order, vm.sample)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.verifyInitial(iddestination);
            }
            vm.loading = false;
          },
          function (error) {
            vm.modalError(error);
            vm.loading = false;
          }
        );
    }

    /**
        Funcion:  Metodo para la verificacion inicial de la muestra.
        @author  adiaz
    */
    function verifyInitial(iddestination) {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .sampletrackings(auth.authToken, vm.order, vm.sample)
        .then(
          function (data) {
            if (data.status === 200) {
              if (iddestination !== undefined) {
                vm.verifyDestination(iddestination);
              }
            }
            vm.loading = false;
          },
          function (error) {
            if (error.data.code === 2) {
              if (
                error.data.errorFields[0] ===
                "2|The order was not created at this headquarters"
              ) {
                vm.menssageinformative = $filter("translate")("1456");
              } else {
                vm.verifyDestination(iddestination);
              }
            } else {
              vm.modalError(error);
            }
            vm.loading = false;
          }
        );
    }

    function sampleCheckRetakeTracking() {
      vm.loading = true;
      if (vm.samplestate === 1) {
        vm.verifyInitial();
      }
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .sampleCheckRetakeTracking(auth.authToken, vm.order, vm.sample)
        .then(
          function (data) {
            if (data.status === 200) {
              logger.success("Muestra ingresada");
            }
            vm.loading = false;
          },
          function (error) {
            vm.modalError(error);
            vm.loading = false;
          }
        );
    }
    /**
        Funcion:  Metodo para verificar la muestra en el destino seleccionado.
        @author  adiaz
    */
    function verifyDestination(iddestination) {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var detail = {
        order: vm.order,
        sample: vm.sample,
        destination: iddestination,
        approved: true,
        assigmentDestination: 0,
        branch: auth.branch,
      };

      return sampletrackingsDS
        .sampleVerifyDestination(auth.authToken, detail)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.enddestinationverify.dateVerify = moment().format(
                vm.formatDate
              );

              vm.enddestinationverify.userVerify.name = auth.name;
              vm.enddestinationverify.userVerify.lastName = auth.lastName;
              vm.enddestinationverify.verify = true;
              vm.enddestinationverify.userVerify.photo = $filter("filter")(
                vm.listUser,
                {
                  id: auth.id,
                },
                true
              )[0].photo;
              vm.ButonReject = true;
              vm.Butonpostponement = true;
              logger.success($filter("translate")("0183"));
            }
            angular.element("#verification").select();
            vm.loading = false;
          },
          function (error) {
            if (error.data === null) {
              vm.modalError(error);
            } else {
              if (
                error.data.errorFields[0] ===
                "2|The order was not created at this headquarters"
              ) {
                vm.menssageinformative =
                  "La orden fue ingresada en una sede diferente";
              }
            }
            vm.loading = false;
          }
        );
    }

    /**
        Funcion:  Metodo para abrir ventana modal que muestra los examenes configurados en el destino seleccionado.
        @author  adiaz
    */
    function openmodaltestDestination(test, color) {
      vm.listtestDestination = test;
      UIkit.modal("#testdestination").show();
    }

    /**
        Funcion:  Metodo para cerrar la ventana modal que muestra los examenes configurados en el destino seleccionado.
        @author  adiaz
    */
    function closemodaltest() {
      UIkit.modal("#testdestination").hide();
    }

    /**
        Funcion:  Metodo para cerrar la ventana modal que muestra los demograficos de la orden.
        @author  adiaz
    */
    function closemodaldemographics() {
      UIkit.modal("#demographicsmodal").hide();
    }

    /**
        Funcion:  Método para validar cuando se rechaza una muestra.
        @author  adiaz
    */
    function reject() {
      setTimeout(function () {
        vm.ButonReject = false;
        vm.Butonretake = false;
        vm.Butonpostponement = false;
      });

      vm.showsample = true;
      vm.showdestination = false;
      angular.element("#verification").select();
      logger.success($filter("translate")("0184"));
    }

    /**
        Funcion: Método para validar cuando se aplaza una muestra.
        @author  adiaz
    */
    function retake() {
      setTimeout(function () {
        vm.ButonReject = false;
        vm.Butonretake = false;
        vm.Butonpostponement = false;
      });

      vm.showsample = true;
      vm.showdestination = false;
      angular.element("#verification").select();
      logger.success($filter("translate")("0181"));
    }

    /**
        Funcion: Método para validar cuando se retoma una muestra.
        @author  adiaz
    */
    function postponement() {
      vm.Butonpostponement;
      setTimeout(function () {
        vm.ButonReject = false;
        vm.Butonretake = false;
        vm.Butonpostponement = false;
      });
      /*  vm.showsample = true;
       vm.showdestination = false;    */
      angular.element("#verification").select();
      logger.success("La muestra a sido retomada");
    }

    function savedemografic() { }

    /**
        Funcion:  Metodo para cargar la informacion de los widget cada cierto tiempo.
        @author  adiaz
    */
    function getwidgets() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return widgetsDS.getsample(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.quantitysampleOrdered = data.data.sampleOrdered;
            vm.quantitysampleVerified = data.data.sampleVerified;
            vm.samplestatewidgets = [
              {
                name: $filter("translate")("0201"),
                type: "bar",
                barGap: 0,
                label: {
                  normal: {
                    show: true,
                    align: "middle",
                    verticalAlign: "middle",
                    rotate: 0,
                    fontSize: 16,
                    position: "top",
                    distance: 15,
                  },
                },
                data: [data.data.sampleDelayed],
              },

              {
                name: $filter("translate")("0403"),
                type: "bar",
                label: {
                  normal: {
                    show: true,
                    align: "middle",
                    verticalAlign: "middle",
                    rotate: 0,
                    fontSize: 16,
                    position: "top",
                    distance: 15,
                  },
                },
                data: [data.data.sampleExpired],
              },
              {
                name: $filter("translate")("0070"),
                type: "bar",
                label: {
                  normal: {
                    show: true,
                    align: "middle",
                    baseline: "middle",
                    rotate: 0,
                    fontSize: 16,
                    position: "top",
                    distance: 15,
                  },
                },
                data: [data.data.sampleRejected],
              },
              {
                name: $filter("translate")("0404"),
                type: "bar",
                label: {
                  normal: {
                    show: true,
                    align: "middle",
                    verticalAlign: "middle",
                    rotate: 0,
                    fontSize: 16,
                    position: "top",
                    distance: 15,
                  },
                },
                data: [data.data.sampleRetake],
              },
            ];
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    /**
        Funcion  Metodo que valida los tiempos de calidad de las muestras de una orden
        @author  adiaz
    */
    function changeAlarm(sample) {
      sample.qualityFlag = 3;
      var sampleverific = $filter("filter")(sample.sampleTrackings, {
        state: 4,
      });
      var minutes = moment().diff(sampleverific[0].date, "seconds");
      var timeline = moment().subtract(
        minutes - sample.qualityTime * 59,
        "seconds"
      );
      sample.time = parseInt(moment(timeline).format("x"));
    }

    /**
        Funcion  Metodo que valida error e la respuesta de los servicios
        @author  adiaz
    */
    function modalError(error) {
      vm.loading = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }

    vm.loadDemographicControls = loadDemographicControls;
    function loadDemographicControls() {
      vm.demopatient = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      orderentryDS.getDemographics(auth.authToken, 'H').then(
        function (response) {
          vm.demopatient = $filter('orderBy')(response.data, 'orderingDemo');
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
    }

    function init() {
      vm.getdestinations();
      vm.loadDemographicControls()
      vm.optionssamplestatewidgets = {
        color: ["#e5323e", "#0080FF", "#FF8000", "#CC2EFA"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        calculable: true,
        legend: {
          data: [
            $filter("translate")("0201"),
            $filter("translate")("0403"),
            $filter("translate")("0070"),
            $filter("translate")("0404"),
          ],
          orient: "vertical",
          x: "left",
          y: "bottom",
          z: 10,
          zlevel: 3,
          itemHeight: 10,
          itemMarginTop: 2,
          itemMarginBottom: 2,
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
        },
        grid: {
          y: 25,
          x: -15,
          y2: 150,
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          data: [$filter("translate")("0451")],
        },
        yAxis: {
          type: "value",
        },
      };

      vm.getwidgets();

      vm.timer = $interval(function () {
        vm.getwidgets();
        console.log(vm.showsample)
        if (
          vm.order !== undefined &&
          vm.order !== null &&
          vm.order !== "" &&
          vm.showsample === true
        ) {
          vm.getSampleOrder();
        }
      }, vm.intervalwidget);
    }

    $scope.$on("$destroy", function () {
      $interval.cancel(vm.timer);
    });
    vm.isAuthenticate();

    function showSimpleToast(order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS.alarminterview(auth.authToken, order).then(
        function (data) {
          if (data.status === 200) {
            if (
              data.data.externalQuery === true &&
              data.data.interview === false
            ) {
              tata.warn(order, $filter("translate")("1485"), {
                position: "br",
                duration: 5000,
                closeBtn: true,
                progress: true,
              });
            }
          }
          vm.loading = false;
        },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        }
      );
    }
  }
})();
/* jshint ignore:end */
