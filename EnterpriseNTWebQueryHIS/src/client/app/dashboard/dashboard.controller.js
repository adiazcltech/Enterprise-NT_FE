/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.dashboard")
    .controller("DashboardController", DashboardController);

  DashboardController.$inject = [
    "authService",
    "$rootScope",
    "dataservice",
    "$filter",
    "localStorageService",
    "$location",
  ];
  /* @ngInject */
  function DashboardController(
    authService,
    $rootScope,
    dataservice,
    $filter,
    localStorageService,
    $location
  ) {
    var vm = this;
    vm.init = init;
    vm.sizetable = '300vw';
    vm.messageCount = 0;
    vm.getId = getId;
    vm.title = "Dashboard";
    vm.view = false;
    vm.view1 = false;
    vm.tableMode = "OverflowResizer";
    vm.table = undefined;
    vm.profile = "one";
    vm.selected = -1;
    vm.viewstadistic = false;
    vm.select1 = -1;
    vm.datatestelect = datatestelect;
    vm.loadData = loadData;
    vm.printreport = printreport;
    window.addEventListener("storage", function () {
      if (localStorage.getItem("validpageopen") === "1") {
        window.close();
        localStorage.setItem("validpageopen", 0);
      }
    }, false)
    vm.init();
    function init() {
      vm.view = false;
      vm.menssageInvalid = "";
      getlistReportFile();
      return dataservice.getuser().then(function (data) {
        if (data.status === 200) {
          vm.user = data.data;
          vm.loadData();
        }
      });
    }
    function printreport(item) {
      $("#pdf").contents().find("body").html('');
      vm.orderTests = item.tests;
      vm.selectedOrder = item.orderNumber;
      vm.openreportpreliminary = true;
      vm.type = 1
    }
    function getkeyconfigure() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return dataservice.getConfiguration(auth.authToken).then(
        function (data) {
          data.data.forEach(function (value, key) {
            localStorageService.set(value.key, value.value);
          });
          getorder();
        },
        function (error) {
        }
      );
    }
    function loadData() {
      vm.menssageInvalid = "";
      return authService.login(vm.user).then(
        function (data) {
          if (data.status === 200) {
            getkeyconfigure();
          }
        },
        function (error) {
          console.log("error" + error);
          vm.menssageInvalid = "";
          vm.view = false;
          if (error.data !== null) {
            if (error.data.message === "timeout") {
              vm.view1 = true;
              vm.menssageInvalid = $filter("translate")("1449");
            } else if (
              error.data.errorFields === null &&
              error.data.message !== "timeout"
            ) {
              vm.Error = error;
              vm.PopupError = true;
            } else {
              if (
                error.data.errorFields[0] ===
                "La licencia registrada ha expirado."
              ) {
                vm.view1 = true;
                vm.menssageInvalid = $filter("translate")("1457");
              } else {
                error.data.errorFields.forEach(function (value) {
                  var item = value.split("|");
                  if (item[0] === "4") {
                    if (item[1] === "inactive user") {
                      vm.view1 = true;
                      vm.menssageInvalid = $filter("translate")("1474");
                    } else {
                      vm.view1 = true;
                      vm.menssageInvalid = $filter("translate")("0067");
                    }
                  }
                  if (item[0] === "5") {
                    vm.menssageInvalid = $filter("translate")("0068");
                    vm.view1 = true;
                  }
                  if (item[0] === "3") {
                    vm.menssageInvalid = "";
                    vm.menssageInvalid = $filter("translate")("1473");
                    vm.view1 = true;
                  }
                  if (item[0] === "6") {
                    vm.view1 = true;
                    if (item[1] === "password expiration date") {
                      vm.menssageInvalid = $filter("translate")("0069");
                    } else {
                      vm.menssageInvalid = $filter("translate")("1124");
                    }
                  }
                  if (item[0] === "7") {
                    vm.view1 = true;
                    if (item[1] === "change password") {
                      vm.menssageInvalid = $filter("translate")("0069");
                    }
                  }
                });
              }
            }
          }
        }
      );
    }
    function getlistReportFile() {
      dataservice.getlistReportFile().then(function (response) {
        if (response.status === 200) {
          vm.listreports = response.data;
        } else {
          vm.listreports = [];
        }
      }, function (error) {
        return false;
      });
    }
    function getorder() {
      vm.orderHis = $location.$$search.OH
      if (vm.orderHis !== undefined) {
        try {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          vm.orderHis = atob(unescape(encodeURIComponent(vm.orderHis)));
          vm.menssageInvalid = "";
          return dataservice.getorder(auth.authToken, vm.orderHis).then(
            function (data) {
              if (data.status === 200) {
                vm.dataorder = data.data;
                vm.printreport(vm.dataorder[0]);
              /*   setTimeout(function () {  }, 400); */
                gettest();
              } else {
                vm.view = false;
                vm.view1 = true;
                vm.menssageInvalid = $filter("translate")("1488");
                $("#pdf").contents().find("body").html('');
              }
            },
            function (error) { }
          );
        } catch (error) {
          vm.view = false;
          vm.view1 = true;
          vm.menssageInvalid = $filter("translate")("1488");
          $("#pdf").contents().find("body").html('');
        }
      } else {
        vm.view = false;
        vm.view1 = true;
        vm.menssageInvalid = $filter("translate")("1488");
        $("#pdf").contents().find("body").html('');
      }
    }
    function gettest() {
      vm.datatest = [];
      vm.selectedtest = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.menssageInvalid = "";
      return dataservice.getconsulpatient(auth.authToken, vm.orderHis).then(
        function (data) {
          if (data.status === 200) {
            vm.view = true;
            $rootScope.name =
              $filter("translate")("0011") +
              data.data.name1 +
              " " +
              data.data.name2 +
              " " +
              data.data.lastName +
              " " +
              data.data.surName;
            $rootScope.patientid =
              data.data.documentType.abbr === undefined ?
                "" :
                data.data.documentType.abbr + " " + data.data.patientId;
            vm.datatest = data.data;
            vm.selectedtest =
              data.data.length === 0 ?
                data.data :
                removeData(vm.datatest.listAllTestsOfPatient);
          } else {
            vm.view = false;
            vm.view1 = true;
            vm.menssageInvalid = $filter("translate")("1488");
          }
        },
        function (error) { }
      );
    }
    function removeData(data) {
      var datasend = [];
      data.forEach(function (value, key) {
        value.search = value.name + value.abbr;
        if (value.testType !== 0) {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return dataservice
            .getresultexample(auth.authToken, vm.datatest.id, value.id)
            .then(
              function (data) {
                if (data.status === 200) {
                  datasend.push(value);
                }
              },
              function (error) { }
            );
        } else {
          datasend.push(value);
        }
      });
      return datasend;
    }
    function getId(patientId, idTest) {
      vm.resulttest = [];
      vm.resuldetail = [];
      vm.selected = idTest;
      vm.viewstadistic = false;
      vm.datageneral = [{
        name: $filter("translate")("0012"),
        type: "line",
        data: [],
      },
      {
        name: $filter("translate")("0013"),
        type: "line",
        data: [],
      },
      {
        name: $filter("translate")("0014"),
        type: "line",
        data: [],
      },
      {
        name: $filter("translate")("0009"),
        type: "line",
        data: [],
      },
      ];

      vm.select1 = -1;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return dataservice
        .getresultexample(auth.authToken, patientId, idTest)
        .then(
          function (data) {
            if (data.status === 200) {
              /*  vm.sizetable=data.data.length > 5 ? '300vw':'65vw'; */
              vm.sizetable = (data.data.length * 13) + 26 + 'vw';
              vm.resulttest = data.data;
              vm.resuldetail =
                data.data.length === 0 ? data.data : changeData(vm.resulttest);
            }
          },
          function (error) { }
        );
    }
    function datatestelect(idtest, resultType) {
      if (resultType === 1 && vm.resulttest.length !== 1) {
        vm.resulstadistic = [];
        vm.viewstadistic = false;
        vm.datageneral = [{
          name: $filter("translate")("0012"),
          type: "line",
          data: [],
        },
        {
          name: $filter("translate")("0013"),
          type: "line",
          data: [],
        },
        {
          name: $filter("translate")("0014"),
          type: "line",
          data: [],
        },
        {
          name: $filter("translate")("0009"),
          type: "line",
          data: [],
        },
        ];
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return dataservice
          .getresultexample(auth.authToken, vm.datatest.id, vm.selected)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.resulstadistic = data.data;
                var stadisticorde = [];
                vm.select1 = idtest;
                var searchorder = $filter("filter")(
                  vm.resulstadistic,
                  function (e) {
                    return e.testId === idtest;
                  }
                );
                for (var j = 0; j < searchorder[0].history.length; j++) {
                  if (vm.datageneral[0].data.length < 10) {
                    if (!isNaN(parseInt(searchorder[0].history[j].result))) {
                      vm.viewstadistic = true;
                      stadisticorde.unshift(searchorder[0].history[j].order);
                      vm.datageneral[0].data.unshift(
                        parseInt(searchorder[0].history[j].result)
                      );
                      vm.datageneral[1].data.unshift(
                        searchorder[0].history[j].refMin
                      );
                      vm.datageneral[2].data.unshift(
                        searchorder[0].history[j].refMax
                      );
                      vm.datageneral[3].data.unshift(
                        moment(searchorder[0].history[j].validateDate).format("DD/MM/YYYY")
                      );
                    }
                  }
                }

                vm.optionsgeneral = {
                  title: {
                    text: searchorder[0].abbr,
                  },
                  color: ["#19CBA0", "#FA3F22", "#1A0C89"],
                  tooltip: {
                    trigger: "axis",
                    formatter: function (params, ticket, callback) {
                      var res = $filter("translate")("0008") + ': ' + params[0].name;
                      for (var i = 0, l = params.length; i < l; i++) {
                        res += '<br/>' + params[i].seriesName + ': ' + params[i].value;
                      }
                      setTimeout(function () {
                        callback(ticket, res);
                      }, 100)
                      return 'loading';
                    }
                  },
                  legend: {
                    data: [
                      $filter("translate")("0012"),
                      $filter("translate")("0013"),
                      $filter("translate")("0014"),
                    ],
                  },
                  toolbox: {
                    show: true,
                    orient: "horizontal",
                    x: "right",
                    y: "top",
                    backgroundColor: "rgba(0,0,0,0)",
                    borderWidth: 0,
                    padding: 5,
                    showTitle: true,
                    feature: {
                      magicType: {
                        show: true,
                        iconStyle: {
                          borderColor: "#F5750B",
                        },
                        type: ["line", "bar", "stack", "tiled"],
                        title: {
                          line: $filter("translate")("0015"),
                          bar: $filter("translate")("0016"),
                          stack: $filter("translate")("0017"),
                          tiled: $filter("translate")("0018"),
                        },
                      },
                      restore: {
                        iconStyle: {
                          borderColor: "#11D85C",
                        },
                        title: $filter("translate")("0019"),
                        show: true,
                      },
                      saveAsImage: {
                        iconStyle: {
                          borderColor: "#000000",
                        },
                        title: $filter("translate")("0020"),
                        show: true,
                      },
                    },
                  },
                  xAxis: [{
                    nameLocation: "middle",
                    nameGap: "30",
                    type: "category",
                    boundaryGap: false,
                    data: stadisticorde,
                  },],
                  yAxis: [{
                    type: "value",
                    nameGap: "10",
                  },],
                };
              }
            },
            function (error) { }
          );
      }
    }
    function changeData(data) {
      var datasend = [];
      var stadisticorde = [];
      vm.datapackage = [];
      for (var i = 0; i < data.length; i++) {
        data[i].history = $filter("orderBy")(
          data[i].history,
          "order",
          "reverse"
        );
        for (var j = 0; j < data[i].history.length; j++) {
          if (
            data.length === 1 &&
            data[0].resultType === 1 &&
            vm.datageneral[0].data.length < 10
          ) {
            if (!isNaN(parseInt(data[i].history[j].result))) {
              vm.viewstadistic = true;
              stadisticorde.unshift(data[i].history[j].order);
              vm.datageneral[0].data.unshift(
                parseInt(data[i].history[j].result)
              );
              vm.datageneral[1].data.unshift(data[i].history[j].refMin);
              vm.datageneral[2].data.unshift(data[i].history[j].refMax);
              vm.datageneral[3].data.unshift(moment(data[i].history[j].validateDate).format("DD/MM/YYYY"));

            }
          }
          if (i === 0) {
            var datachange = {
              order: data[i].history[j].order,
              date: data[i].history[j].entryDate,
              result: [{
                testId: data[i].history[j].testId,
                result: data[i].history[j].result,
                pathology: data[i].history[j].pathology,
              },],
            };
            datasend.push(datachange);
          } else {
            var searchorder = $filter("filter")(datasend, function (e) {
              return e.order === data[i].history[j].order;
            });
            if (searchorder.length === 0) {
              for (var p = 0; p < datasend.length; p++) {
                var orderprevius = {
                  testId: data[i].history[j].testId,
                  result: "",
                  resultType: data[i].history[j].resultType,
                  pathology: 0,
                };
                var testadd = $filter("filter")(datasend[p].result, function (
                  e
                ) {
                  return e.testId === data[i].history[j].testId;
                });
                if (testadd.length === 0) {
                  datasend[p].result.push(orderprevius);
                }
              }
              for (var t = 0; t < i; t++) {
                var resultadd = [];
                var dataresul = {
                  testId: data[t].history[0].testId,
                  result: "",
                  resultType: data[t].history[0].resultType,
                  pathology: 0,
                };
                resultadd.push(dataresul);
              }

              var now = {
                testId: data[i].history[j].testId,
                result: data[i].history[j].result,
                resultType: data[i].history[j].resultType,
                pathology: data[i].history[j].pathology,
              };
              resultadd.push(now);

              var datachange = {
                order: data[i].history[j].order,
                date: data[i].history[j].entryDate,
                result: resultadd,
              };
              datasend.push(datachange);
            } else {
              var datachange = {
                testId: data[i].history[j].testId,
                result: data[i].history[j].result,
                resultType: data[i].history[j].resultType,
                pathology: data[i].history[j].pathology,
              };
              searchorder[0].result.push(datachange);
            }
          }
        }
      }
      vm.optionsgeneral = {
        title: {
          text: data[0].abbr,
        },
        color: ["#19CBA0", "#FA3F22", "#1A0C89"],
        tooltip: {
          trigger: "axis",
          formatter: function (params, ticket, callback) {
            var res = $filter("translate")("0008") + ': ' + params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              res += '<br/>' + params[i].seriesName + ': ' + params[i].value;
            }
            setTimeout(function () {
              callback(ticket, res);
            }, 100)
            return 'loading';
          }
        },
        legend: {
          data: [
            $filter("translate")("0012"),
            $filter("translate")("0013"),
            $filter("translate")("0014"),
          ],
        },
        toolbox: {
          show: true,
          orient: "horizontal",
          x: "right",
          y: "top",
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          padding: 5,
          showTitle: true,
          feature: {
            magicType: {
              show: true,
              iconStyle: {
                borderColor: "#F5750B",
              },
              type: ["line", "bar", "stack", "tiled"],
              title: {
                line: $filter("translate")("0015"),
                bar: $filter("translate")("0016"),
                stack: $filter("translate")("0017"),
                tiled: $filter("translate")("0018"),
              },
            },
            restore: {
              iconStyle: {
                borderColor: "#11D85C",
              },
              title: $filter("translate")("0019"),
              show: true,
            },
            saveAsImage: {
              iconStyle: {
                borderColor: "#000000",
              },
              title: $filter("translate")("0020"),
              show: true,
            },
          },
        },
        xAxis: [{
          nameLocation: "middle",
          nameGap: "30",
          type: "category",
          boundaryGap: false,
          data: stadisticorde,
        },],
        yAxis: [{
          type: "value",
          nameGap: "10",
        },],
      };
      return datasend;
    }
  }
})();
/* jshint ignore:end */
