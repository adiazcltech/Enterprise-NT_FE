/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    Visualizar tableros de Ingreso de ordenes
  PARAMETROS:   openmodal @descripción
                listener  @descripción
                order     @descripción
                date      @descripción
    
  AUTOR:        @autor
  FECHA:        2019-08-02
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";
  angular
    .module("app.widgets")
    .directive("orderentrydashboard", orderentrydashboard);
  orderentrydashboard.$inject = [
    "localStorageService",
    "$filter",
    "Webworker",
    "$rootScope",
    "$state",
    "settings",
  ];

  function orderentrydashboard(
    localStorageService,
    $filter,
    Webworker,
    $rootScope,
    $state,
    settings
  ) {
    var directive = {
      templateUrl:
        "app/widgets/userControl/orderentry-dashboard.directive.html",
      restrict: "EA",
      scope: {
        refreshdashboard: "=?refreshdashboard",
        namebranch: "=?namebranch",
      },
      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.init = init;
          vm.refreshData = refreshData;
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          vm.integrationSiga =
            localStorageService.get("IntegracionSIGA") === "True";

          vm.totalorderbranch = 0;
          vm.totalorderuser = 0;
          $scope.refreshdashboard = false;

          $rootScope.$watch("NamePage", function () {
            if ($state.current.idpage !== 210) {
              $rootScope.myWorker.stop();
            }
          });

          $scope.$watch("refreshdashboard", function () {
            if ($scope.refreshdashboard) {
              $rootScope.myWorker.stop();
              var datasiga = {
                date: moment().format("YYYYMMDD"),
                branch: auth.branch,
                userId: auth.userId,
                serviceOrder: localStorageService.get("OrdenesSIGA"),
                url: localStorageService.get("UrlSIGA"),
              };
              $rootScope.myWorker = Webworker.create(async, { async: true });
              $rootScope.myWorker
                .run(settings.serviceUrl, auth.authToken, datasiga)
                .then(
                  function (result) {},
                  null,
                  function (response) {
                    vm.refreshData(response);
                  }
                );
            }
            $scope.refreshdashboard = false;
          });

          function async(serviceUrl, token, data) {
            fetch(serviceUrl + "/widgets/entrysiga", {
              method: "POST", // Cambiar a POST
              headers: {
                Authorization: token,
                "Content-Type": "application/json", // Asegurar que el contenido sea JSON
              },
              body: JSON.stringify(data), // Enviar datos en el cuerpo
            })
              .then(function (res) {
                if (!res.ok) {
                  console.error("Error en la solicitud:");
                }
                return res.json(); // Procesar respuesta como JSON
              })
              .then(function (response) {
                notify(response); // Usar la respuesta procesada
              })
              .catch(function (error) {
                console.error("Error en la solicitud:", error); // Manejo de errores
              });

            setInterval(function () {
              fetch(serviceUrl + "/widgets/entrysiga", {
                method: "POST", // Cambiar a POST
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json", // Asegurar que el contenido sea JSON
                },
                body: JSON.stringify(data), // Enviar datos en el cuerpo
              })
                .then(function (res) {
                  if (!res.ok) {
                    console.error("Error en la solicitud:");
                  }
                  return res.json(); // Procesar respuesta como JSON
                })
                .then(function (response) {
                  notify(response); // Usar la respuesta procesada
                })
                .catch(function (error) {
                  console.error("Error en la solicitud:", error); // Manejo de errores
                });
            }, 60000);
          }

          function refreshData(response) {
            vm.totalorderbranch = response.numberOrdersByBranch;
            vm.totalorderuser = response.numberOrders;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            vm.namebranch = $scope.namebranch;
            vm.datageneral = [
              {
                data: [
                  {
                    value:
                      response.numberOrders === 0 ? "" : response.numberOrders,
                    name: $filter("translate")("0001") + " " + auth.userName,
                    tooltip: {
                      position: [80, 5],
                    },
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                        },
                        labelLine: {
                          show: false,
                        },
                      },
                    },
                  },
                  {
                    value:
                      parseInt(response.numberOrdersByBranch) -
                      parseInt(response.numberOrders),
                    name: $filter("translate")("0003") + " " + vm.namebranch,
                    tooltip: {
                      position: [-50, 30],
                      formatter: function (params) {
                        return (
                          params.name + " " + response.numberOrdersByBranch
                        );
                      },
                    },
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                        },
                        labelLine: {
                          show: false,
                        },
                      },
                    },
                  },
                ],
                type: "pie",
                radius: "55%",
              },
            ];

            if (vm.integrationSiga) {
              vm.totalturns = response.turns;
              vm.totalturnsuser = response.shiftsWorked;
              vm.totalturnswaiting = response.waitingTurns;

              vm.dataturngeneral = [
                {
                  data: [
                    {
                      value:
                        response.shiftsWorked === 0
                          ? ""
                          : response.shiftsWorked,
                      name: $filter("translate")("0001"),
                      tooltip: {
                        position: [80, 5],
                      },
                      itemStyle: {
                        normal: {
                          label: {
                            show: false,
                          },
                          labelLine: {
                            show: false,
                          },
                        },
                      },
                    },
                    {
                      value: parseInt(response.turns) - response.shiftsWorked,
                      name: $filter("translate")("0003"),
                      tooltip: {
                        position: [-50, 30],
                        formatter: function (params) {
                          return params.name + " " + response.turns;
                        },
                      },
                      itemStyle: {
                        normal: {
                          label: {
                            show: false,
                          },
                          labelLine: {
                            show: false,
                          },
                        },
                      },
                    },
                  ],
                  type: "pie",
                  radius: "55%",
                },
              ];

              vm.dataturnwaiting = [
                {
                  data: [
                    {
                      value: response.turns,
                      name: $filter("translate")("0003"),
                      tooltip: {
                        position: [80, 25],
                      },
                      itemStyle: {
                        normal: {
                          label: {
                            show: false,
                          },
                          labelLine: {
                            show: false,
                          },
                        },
                      },
                    },
                    {
                      value:
                        response.waitingTurns === 0
                          ? ""
                          : response.waitingTurns,
                      name: $filter("translate")("0001"),
                      tooltip: {
                        position: [-50, 5],
                      },
                      itemStyle: {
                        normal: {
                          label: {
                            show: false,
                          },
                          labelLine: {
                            show: false,
                          },
                        },
                      },
                    },
                  ],
                  type: "pie",
                  radius: "55%",
                },
              ];

              var top1 =
                response.qualifications.length === 0
                  ? 0
                  : response.qualifications[1].ratingCount;
              var top2 =
                response.qualifications.length === 0
                  ? 0
                  : response.qualifications[2].ratingCount;
              var top3 =
                response.qualifications.length === 0
                  ? 0
                  : response.qualifications[3].ratingCount;
              var top4 =
                response.qualifications.length === 0
                  ? 0
                  : response.qualifications[4].ratingCount;

              vm.dataquantity = [
                {
                  name: $filter("translate")("1117"),
                  type: "bar",
                  itemStyle: {
                    normal: {
                      color: "#929D2A",
                    },
                  },
                  data: [top1],
                },
                {
                  name: $filter("translate")("1118"),
                  type: "bar",
                  itemStyle: {
                    normal: {
                      color: "#CADA3C",
                    },
                  },
                  data: [top2],
                },
                {
                  name: $filter("translate")("1119"),
                  type: "bar",
                  itemStyle: {
                    normal: {
                      color: "#EBEE13",
                    },
                  },
                  data: [top3],
                },
                {
                  name: $filter("translate")("1120"),
                  type: "bar",
                  itemStyle: {
                    normal: {
                      color: "#F68A33",
                    },
                  },
                  data: [top4],
                },
              ];
            }
          }

          function init() {
            vm.datageneral = [];

            vm.optionsgeneral = {
              animation: false,
              tooltip: {
                trigger: "item",
                position: [120, 10],
              },
              color: ["#438DEC", "#DCDDDB"],
            };
            if (vm.integrationSiga) {
              vm.dataturngeneral = [];
              vm.dataturnwaiting = [];
              vm.dataquantity = [];

              vm.optionsturn = {
                animation: false,
                tooltip: {
                  trigger: "item",
                  position: [120, 10],
                },
                color: ["#94DA4E", "#DCDDDB"],
              };

              vm.optionsturnwaiting = {
                animation: false,
                tooltip: {
                  trigger: "item",
                  position: [120, 10],
                },
                color: ["#DCDDDB", "#E55449"],
              };

              vm.optionsquantity = {
                tooltip: {
                  trigger: "item",
                  position: [120, 10],
                  formatter: "{a}: {c}",
                },
                grid: [
                  {
                    x: 170,
                    y: 8,
                    x2: 5,
                    y2: 2,
                    width: 310,
                  },
                ],
                legend: {
                  orient: "vertical",
                  x: "left",
                  y: "bottom",
                  padding: 1,
                  itemGap: 4,
                  itemWidth: 14,
                  itemHeight: 10,
                  data: [
                    $filter("translate")("1117"),
                    $filter("translate")("1118"),
                    $filter("translate")("1119"),
                    $filter("translate")("1120"),
                  ],
                  textStyle: {
                    fontSize: 9,
                  },
                },
                xAxis: [
                  {
                    type: "category",
                    data: [
                      $filter("translate")("1117"),
                      $filter("translate")("1118"),
                      $filter("translate")("1119"),
                      $filter("translate")("1120"),
                    ],
                    axisTick: {
                      show: false,
                    },
                    axisLabel: {
                      show: false,
                    },
                  },
                ],
                yAxis: [
                  {
                    type: "value",
                    axisTick: {
                      show: false,
                    },
                    axisLabel: {
                      show: false,
                    },
                  },
                ],
              };
            }

            $rootScope.myWorker = Webworker.create(async, { async: true });
            var datasiga = {
              "date": moment().format("YYYYMMDD"),
              "branch": auth.branch,
              "userId": auth.userId,
              "serviceOrder":localStorageService.get("OrdenesSIGA"),
              "url": localStorageService.get("UrlSIGA")                
            };  
            $rootScope.myWorker
              .run(
                settings.serviceUrl,
                auth.authToken,
                datasiga
              )
              .then(
                function (result) {},
                null,
                function (response) {
                  vm.refreshData(response);
                }
              );
          }

          vm.init();
        },
      ],
      controllerAs: "orderentrydashboard",
    };
    return directive;
  }
})();
