/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.simpleverification")
    .controller("SimpleverificationController", SimpleverificationController);

  SimpleverificationController.$inject = [
    "sampletrackingsDS",
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "widgetsDS",
    "sigaDS",
    "orderentryDS",
  ];

  function SimpleverificationController(
    sampletrackingsDS,
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    widgetsDS,
    sigaDS,
    orderentryDS
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "Simpleverification";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0014");
    $rootScope.helpReference = "01. LaboratoryOrders/simpleverification.htm";
    vm.formatDate = localStorageService.get("FormatoFecha").toUpperCase();
    vm.takesample = localStorageService.get("TomaMuestra").toUpperCase();
    vm.intervalwidget = localStorageService.get("WidgetMuestraTiempo") * 100000;
    vm.order = "";
    vm.insert = insert;
    vm.Save = Save;
    vm.menssageinformative = "";
    vm.loading = false;
    vm.message = false;
    vm.cardsampletake = false;
    vm.cardsampletracking = false;
    vm.cardpostponement = false;
    vm.cardsampleReject = false;
    vm.cardsampleRetake = false;
    $rootScope.pageview = 3;
    vm.openmodal = false;
    vm.dateorder = dateorder;
    vm.cardorder = false;
    vm.getwidgets = getwidgets;
    vm.optionssamplestatewidgets = {};
    vm.samplestatewidgets = [];
    vm.getSampleOrder = getSampleOrder;
    vm.verificationturno = verificationturno;
    vm.endturn = endturn;
    vm.cleanverification = cleanverification;
    vm.ButonReject = false;
    vm.parseInt = parseInt;
    vm.serviceEntrySiga = parseInt(localStorageService.get("stateTurnSiga"));
    vm.turnfilter =
      localStorageService.get("OrdenesSIGA") === "?" ? false : true;
    vm.activesigaorder = parseInt(localStorageService.get("moduleSiga"));
    vm.dataturn = parseInt(localStorageService.get("turn"));
    vm.modalError = modalError;
    vm.viewturn = viewturn;
    vm.gotuberack = gotuberack;
    vm.dataviewsiga = localStorageService.get("dataviewsiga");
    vm.statecomment = 1;
    vm.statediagnostic = 1;
    vm.validPendingCollection = validPendingCollection;

    $rootScope.$watch("stateTurnSiga", function () {
      vm.dataviewsiga = localStorageService.get("dataviewsiga");
      vm.activesigaorder =
        localStorageService.get("moduleSiga") === null
          ? ""
          : parseInt(localStorageService.get("moduleSiga"));
      if ($rootScope.stateTurnSiga === undefined) {
        vm.serviceEntrySiga =
          localStorageService.get("stateTurnSiga") === null
            ? ""
            : parseInt(localStorageService.get("stateTurnSiga"));
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

    function verificationturno(order) {
      vm.order = order;
      vm.ButonReject = false;
      vm.cardsampletracking = false;
      vm.cardorder = false;
      vm.showsample = false;
      vm.showdestination = false;
      angular.element("#verification").select();
      vm.numberOrder = order;
      vm.sample = -1;
      vm.Butondemographics = false;
      vm.Butonbarcode = false;
      vm.getSampleOrder();
    }
    function gotuberack() {
      vm.loading = true;
      $rootScope.Ordertuberack = vm.order;
      $rootScope.SampleOrdertuberack = vm.sample;
      $state.go("tuberack");
    }
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    function endturn() {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var dataend = {
        id: 0,
        turn: { id: parseInt(localStorageService.get("turn").id) },
        service: { id: parseInt(localStorageService.get("VerificacionSIGA")) },
        pointOfCare: { id: parseInt(localStorageService.get("pointSiga").id) },
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
            vm.editturn2 = "";
            vm.cardsampletracking = false;
            vm.Detail = [];
            vm.menssageinformative = "";
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
    function cleanverification() {
      vm.listSample = [];
      vm.order = "";
      vm.sample = -1;
      vm.numberOrder = null;
      vm.ButonReject = false;
      vm.showsample = false;
      vm.showdestination = false;
      vm.editturn2 = "";
      vm.Detail = [];
      vm.Butondemographics = false;
      vm.menssageinformative = "";
      vm.cardsampletracking = false;
      vm.Butonbarcode = false;
    }
    function getSampleOrder() {
      vm.loading = true;
      vm.ButonReject = false;
      vm.numberOrder = null;
      vm.ordercomment = null;
      vm.listSample = [];
      vm.menssageinformative = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (vm.order !== "") {
        vm.viewturn();
        return sampletrackingsDS.sampleorder(auth.authToken, vm.order).then(
          function (data) {
            if (data.status === 200) {
              vm.numberOrder = vm.order;
              vm.ordercomment = vm.order;
              vm.statecomment = 2;
              // vm.dateorder();
              if (data.data.length > 0) {
                data.data.forEach(function (value, key) {
                  var minutes;
                  var timeline;
                  var sampleverific = $filter("filter")(value.sampleTrackings, {
                    state: 4,
                  });
                  if (value.qualityFlag === 3 && sampleverific.length > 0) {
                    minutes = moment().diff(sampleverific[0].date, "seconds");
                    timeline = moment().subtract(
                      minutes - value.qualityTime * 59,
                      "seconds"
                    );
                    value.time = parseInt(moment(timeline).format("x"));
                  } else if (
                    value.qualityFlag === 2 &&
                    sampleverific.length > 0
                  ) {
                    minutes = moment().diff(sampleverific[0].date, "seconds");
                    timeline = moment().add(
                      value.qualityTime * 59 - minutes,
                      "seconds"
                    );
                    value.time = parseInt(moment(timeline).format("x"));
                  }
                });
                vm.listSample = _.orderBy(data.data, ["codesample"], ["asc"]);
                vm.routeSample = [];
                vm.Butoninterview = true;
                vm.Butonbarcode = true;
                vm.Butondemographics = true;
                if (vm.sample !== "" && vm.sample !== -1) {
                  vm.dateorder();
                } else {
                  vm.showsample = true;
                  vm.showdestination = false;
                  vm.sample = -1;
                }
              }
              vm.ordernull = true;
              //vm.patientcoment=vm.patientview.id;
            } else {
              vm.menssageinformative = $filter("translate")("0179");
            }
            vm.loading = false;
          },
          function (error) {
            if (
              vm.order !== "" &&
              vm.order !== null &&
              vm.order !== undefined
            ) {
              if (
                error.data.detail !== undefined &&
                error.data.detail !== null &&
                error.data.detail !== ""
              ) {
                if (error.data.detail.search(vm.order.slice(0, 4)) === -1) {
                  vm.getSampleOrder();
                } else {
                  vm.ordercomment = null;
                  vm.numberOrder = null;
                  vm.loading = false;
                  vm.menssageinformative = $filter("translate")("0179");
                }
              } else {
                vm.getSampleOrder();
              }
            } else {
              vm.ordercomment = null;
              vm.numberOrder = null;
              vm.loading = false;
              vm.menssageinformative = $filter("translate")("0179");
            }
          }
        );
      }
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
          function (error) {}
        );
    }
    function dateorder() {
      vm.loading = true;
      vm.Detail = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampletrackingsDS
        .sampletrackingsorder(auth.authToken, vm.order)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loading = false;
              vm.Detail = data.data;
              vm.formathour =
                vm.formatDate.substring(0, vm.formatDate.length) + ", HH:mm:ss";
              vm.sampleverication = _.filter(vm.Detail.samples, function (o) {
                return o.codesample === vm.sample;
              });
              if (vm.sampleverication.length === 0) {
                vm.menssageinformative = $filter("translate")("0180");
                vm.message = true;
              } else {
                if (vm.sampleverication[0].sampleState.state === 4) {
                  if (vm.takesample === "TRUE") {
                    vm.vericationtake = $filter("filter")(
                      vm.sampleverication[0].sampleTrackings,
                      { state: 3 }
                    );
                    vm.Detail.branchTake = vm.vericationtake[0].branch.name;
                    vm.Detail.dateTake = moment(
                      vm.vericationtake[0].date
                    ).format(vm.formathour);
                    vm.Detail.lastNameTake =
                      vm.vericationtake[0].user.lastName === undefined
                        ? ""
                        : vm.vericationtake[0].user.lastName;
                    vm.Detail.nameTake =
                      vm.vericationtake[0].user.name === undefined
                        ? ""
                        : vm.vericationtake[0].user.name;
                    vm.Detail.userTake =
                      vm.Detail.lastNameTake + " " + vm.Detail.nameTake;
                    vm.cardsampletake = true;
                  }
                  vm.verication = $filter("filter")(
                    vm.sampleverication[0].sampleTrackings,
                    { state: 4 }
                  );
                  vm.Detail.branchVerify = vm.verication[0].branch.name;
                  vm.Detail.dateVerify = moment(vm.verication[0].date).format(
                    vm.formathour
                  );
                  vm.Detail.lastNameVerify =
                    vm.verication[0].user.lastName === undefined
                      ? ""
                      : vm.verication[0].user.lastName;
                  vm.Detail.nameVerify =
                    vm.verication[0].user.name === undefined
                      ? ""
                      : vm.verication[0].user.name;
                  vm.Detail.userVerify =
                    vm.Detail.lastNameVerify + " " + vm.Detail.nameVerify;
                  /*  vm.cardsampletracking = true; */
                }
                if (vm.sampleverication[0].sampleState.state === 0) {
                  // la muestra se encuentra rechazada
                  vm.verication = $filter("filter")(
                    vm.sampleverication[0].sampleTrackings,
                    { state: 4 }
                  );
                  vm.Detail.branchVerify = vm.verication[0].branch.name;
                  vm.Detail.dateVerify = moment(vm.verication[0].date).format(
                    vm.formathour
                  );
                  vm.Detail.lastNameVerify =
                    vm.verication[0].user.lastName === undefined
                      ? ""
                      : vm.verication[0].user.lastName;
                  vm.Detail.nameVerify =
                    vm.verication[0].user.name === undefined
                      ? ""
                      : vm.verication[0].user.name;
                  vm.Detail.userVerify =
                    vm.Detail.lastNameVerify + " " + vm.Detail.nameVerify;
                  vm.Rejectsample = $filter("filter")(
                    vm.sampleverication[0].sampleTrackings,
                    { state: 0 }
                  );
                  vm.Detail.branchReject = vm.Rejectsample[0].branch.name;
                  vm.Detail.dateReject = moment(vm.Rejectsample[0].date).format(
                    vm.formathour
                  );
                  vm.Detail.lastNameReject =
                    vm.Rejectsample[0].user.lastName === undefined
                      ? ""
                      : vm.Rejectsample[0].user.lastName;
                  vm.Detail.nameReject =
                    vm.Rejectsample[0].user.name === undefined
                      ? ""
                      : vm.Rejectsample[0].user.name;
                  vm.Detail.userReject =
                    vm.Detail.lastNameReject + " " + vm.Detail.nameReject;
                  vm.Detail.comment = vm.Rejectsample[0].comment;
                  vm.Detail.motive = vm.Rejectsample[0].motive.name;
                }
              }
            } else {
              vm.loading = false;
              vm.cardorder = false;
              angular.element("#verification").select();
              vm.menssageinformative = $filter("translate")("0179");
              vm.message = true;
            }
          },
          function (error) {
            vm.loading = false;
            angular.element("#verification").select();
            vm.menssageinformative = $filter("translate")("0179");
            vm.message = true;
          }
        );
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      // vm.ButonReject = true;
      vm.cardsampletake = false;
      vm.cardsampletracking = false;
      vm.cardpostponement = false;
      vm.cardsampleReject = false;
      vm.cardsampleRetake = false;
      vm.menssageinformative = "";
      vm.cardorder = false;
      if (vm.sample === "") {
        vm.getSampleOrder();
        vm.cardorder = true;
      } else {
        vm.loading = true;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS
          .sampletrackings(auth.authToken, vm.order, vm.sample)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.loading = false;
                logger.success($filter("translate")("0183"));
                return sampletrackingsDS
                  .sampletrackingsorder(auth.authToken, vm.order)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.getSampleOrder();
                        vm.Detail = data.data;
                        // Datos del paciente
                        vm.Detail.name =
                          vm.Detail.patient.lastName +
                          " " +
                          vm.Detail.patient.name1 +
                          " " +
                          vm.Detail.patient.name2;
                        if ($filter("translate")("0000") === "esCo") {
                          vm.Detail.sex = vm.Detail.patient.sex.esCo;
                        } else {
                          vm.Detail.sex = vm.Detail.patient.sex.enUsa;
                        }
                        vm.Detail.birthday = moment(
                          vm.Detail.patient.birthday
                        ).format(vm.formatDate);
                        vm.Detail.history = vm.Detail.patient.patientId;
                        vm.Detail.username = vm.Detail.patient.surName;
                        vm.formathour =
                          vm.formatDate.substring(0, vm.formatDate.length) +
                          ", HH:mm:ss";

                        vm.sampleverication = _.filter(
                          vm.Detail.samples,
                          function (o) {
                            return o.codesample === vm.sample;
                          }
                        );

                        if (vm.sampleverication[0].sampleState.state === 4) {
                          // la muestra se encuentra verificada
                          // estado de toma

                          if (vm.takesample === "TRUE") {
                            vm.vericationtake = $filter("filter")(
                              vm.sampleverication[0].sampleTrackings,
                              { state: 3 }
                            );
                            vm.Detail.branchTake =
                              vm.vericationtake[0].branch.name;
                            vm.Detail.dateTake = moment(
                              vm.vericationtake[0].date
                            ).format(vm.formathour);
                            vm.Detail.lastNameTake =
                              vm.vericationtake[0].user.lastName === undefined
                                ? ""
                                : vm.vericationtake[0].user.lastName;
                            vm.Detail.nameTake =
                              vm.vericationtake[0].user.name === undefined
                                ? ""
                                : vm.vericationtake[0].user.name;
                            vm.Detail.userTake =
                              vm.Detail.lastNameTake + " " + vm.Detail.nameTake;
                            vm.cardsampletake = true;
                          }
                          vm.verication = $filter("filter")(
                            vm.sampleverication[0].sampleTrackings,
                            { state: 4 }
                          );
                          vm.Detail.branchVerify = vm.verication[0].branch.name;
                          vm.Detail.dateVerify = moment(
                            vm.verication[0].date
                          ).format(vm.formathour);
                          vm.Detail.lastNameVerify =
                            vm.verication[0].user.lastName === undefined
                              ? ""
                              : vm.verication[0].user.lastName;
                          vm.Detail.nameVerify =
                            vm.verication[0].user.name === undefined
                              ? ""
                              : vm.verication[0].user.name;
                          vm.Detail.userVerify =
                            vm.Detail.lastNameVerify +
                            " " +
                            vm.Detail.nameVerify;
                          vm.validPendingCollection();
                          vm.cardsampletracking = true;
                          vm.ButonReject = true;
                        }
                      }
                    },
                    function (error) {}
                  );
              }
            },
            function (error) {
              vm.loading = false;
              if (error.status === 500) {
                if (error.data.code === 0) {
                  angular.element("#verification").select();
                  //vm.menssageinformative = $filter('translate')('0180');
                  vm.menssageinformative = $filter("translate")("0179");
                  vm.message = true;
                }
                if (error.data.code === 2) {
                  if (error.data.errorFields[0] === "1") {
                    angular.element("#verification").select();
                    //vm.menssageinformative = $filter('translate')('0180');
                    vm.menssageinformative = $filter("translate")("0179");

                    vm.message = true;
                  }
                  if (error.data.errorFields[0] === "2") {
                    angular.element("#verification").select();
                    // vm.menssageinformative = $filter('translate')('0180');
                    vm.menssageinformative = $filter("translate")("0193");
                    vm.message = true;
                    vm.cardsampletracking = true;
                    vm.ButonReject = true;
                  }
                  if (error.data.errorFields[0] === "3") {
                    angular.element("#verification").select();
                    // vm.menssageinformative = $filter('translate')('0180');
                    vm.menssageinformative = $filter("translate")("0177");
                    vm.message = true;
                    vm.cardsampleReject = true;
                    vm.cardsampletracking = true;
                  }
                  if (error.data.errorFields[0] === "4") {
                    angular.element("#verification").select();
                    // vm.menssageinformative = $filter('translate')('0180');
                    vm.menssageinformative =
                      " No se ha creado el registro del estado actual de la muestra";
                    vm.message = true;
                  }
                }
              }
            }
          );
      }
    }

    function validPendingCollection() {
      var sample = _.filter(vm.sampleverication, function (e) {
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
            state: 4,
          };
          testSampleTakeTracking.push(test);
        });
        var tests = {
          order: vm.order,
          sample: vm.sample,
          testSampleTakeTracking: testSampleTakeTracking,
        };
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sampletrackingsDS.sampletaketest(auth.authToken, tests).then(
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

    //** Método para sacar el popup de error**//
    function Save() {
      vm.menssageinformative = "";
      vm.message = false;
      vm.ButonReject = true;
      vm.cardsampletracking = false;
      vm.cardsampleReject = false;
      vm.cardsampleRetake = false;
      vm.Detail = vm.data;
      vm.dateorder();
      angular.element("#verification").select();
      logger.success($filter("translate")("0184"));
      vm.cardsampletracking = true;
      vm.cardsampleReject = true;
      vm.ButonReject = false;
    }
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
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      orderentryDS.getDemographics(auth.authToken, "H").then(
        function (response) {
          vm.demopatient = $filter("orderBy")(response.data, "orderingDemo");
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }
    function init() {
      vm.cleanverification();
      vm.loadDemographicControls();
      vm.viewTake = localStorageService.get("verTrazabilidadtoma") === "True";
      vm.order = "";
      vm.optionssamplestatewidgets = {
        color: ["#e5323e", "#FF8000", "#0080FF", "#CC2EFA"],
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
            $filter("translate")("0070"),
            $filter("translate")("0403"),
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
          axisTick: { show: false },
          data: [$filter("translate")("0451")],
        },
        yAxis: {
          type: "value",
        },
      };

      vm.getwidgets();
      setInterval(function () {
        vm.getwidgets();
      }, vm.intervalwidget);
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
