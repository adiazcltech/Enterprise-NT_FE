/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal: variable para abrir la ventana modal
                listener: variable para consultar una función de ingreso de ordenes y consultar la orden
                cleanorder: variable para consultar una función de ingreso de ordenes y limpiar el formulario
  AUTOR:        Jernnifer DIaz
  FECHA:        2018-06-07
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

********************************************************************************/

(function () {
  "use strict";
  angular.module("app.widgets").directive("automaticshift", automaticshift);
  automaticshift.$inject = [
    "sigaDS",
    "localStorageService",
    "$filter",
    "logger",
    "$interval",
    "$rootScope",
    "documenttypesDS",
  ];
  /* @ngInject */
  function automaticshift(
    sigaDS,
    localStorageService,
    $filter,
    logger,
    $interval,
    $rootScope,
    documenttypesDS
  ) {
    var directive = {
      templateUrl: "app/widgets/userControl/automaticshift.html",
      restrict: "EA",
      scope: {
        openmodal: "=?openmodal",
        listener: "=?listener",
        cleanorder: "=?cleanorder",
        automatic: "=?automatic",
        verificationorder: "=?verificationorder",
        patientload: "=?patientload",
        cleanverification: "=?cleanverification",
      },
      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.attend = attend;
          vm.searchByDate = searchByDate;
          vm.loadingturn = true;
          vm.call = call;
          vm.getturnautomatic = getturnautomatic;
          vm.reserverturn = reserverturn;
          vm.branchSiga = localStorageService.get("SedeSIGA");
          vm.showDocumentType =
            localStorageService.get("ManejoTipoDocumento") === "True";
          vm.managehistoryauto =
            localStorageService.get("HistoriaAutomatica").toLowerCase() ===
            "true";
          vm.getOrdersattend = getOrdersattend;
          vm.showCountTicket = false;
          vm.closed = closed;
          vm.cancel = cancel;
          vm.getMotiveCancel = getMotiveCancel;
          vm.getmotiveponeturn = getmotiveponeturn;
          vm.poneturn = poneturn;
          vm.change = change;
          vm.enterOrderTurn = enterOrderTurn;
          vm.getOrdersTurn = getOrdersTurn;
          vm.searchByPatientId = searchByPatientId;
          vm.orders = [];
          vm.saveorderasing = saveorderasing;
          vm.orderasing = orderasing;
          vm.consultorder = consultorder;
          vm.selectall = selectall;
          vm.modalError = modalError;
          vm.viewverification = viewverification;
          vm.selectOrder = selectOrder;
          vm.lenguaje = $filter("translate")("0000");

          $rootScope.$watch("turngestion", function () {
            if ($rootScope.turngestion === true) {
              $rootScope.orderturn = null;
              vm.getMotiveCancel();
              vm.viewbuttonentry =
                parseInt(localStorageService.get("moduleSiga")) === 1
                  ? true
                  : false;
              vm.serviceEntrySiga =
                parseInt(localStorageService.get("moduleSiga")) === 1
                  ? localStorageService.get("OrdenesSIGA")
                  : localStorageService.get("VerificacionSIGA");

              vm.dataturn = localStorageService.get("turn");
              vm.dataturn.turnType.color = "#1873cc";
              vm.showCountTicket = true;
              UIkit.modal("#modalattendshift", { bgclose: false }).show();
              $rootScope.turngestion = false;
              if (vm.dataturn.state === 3) {
                vm.isDisableattend = true;
                vm.isDisableAplazar = false;
              }
            }
          });

          if (parseInt(localStorageService.get("moduleSiga")) === 1) {
            vm.serviceEntrySiga = localStorageService.get("OrdenesSIGA");
          } else {
            vm.serviceEntrySiga = localStorageService.get("VerificacionSIGA");
          }
          $scope.$watch("openmodal", function () {
            vm.buttonautomatic = $scope.automatic;
            vm.isDisableAplazar = true;
            vm.isDisableattend = false;
            vm.showCountTicket = false;
            if ($scope.openmodal) {
              $rootScope.orderturn = null;
              vm.getMotiveCancel();
              vm.viewbuttonentry =
                parseInt(localStorageService.get("moduleSiga")) === 1
                  ? true
                  : false;
              vm.serviceEntrySiga =
                parseInt(localStorageService.get("moduleSiga")) === 1
                  ? localStorageService.get("OrdenesSIGA")
                  : localStorageService.get("VerificacionSIGA");
              if (vm.buttonautomatic) {
                vm.getturnautomatic();
              } else {
             /*    vm.reloadListShift = $interval(function () {
                  vm.searchByDate();
                }, 50000); */
                vm.searchByDate();
              }
            }
            $scope.openmodal = false;
          });
          /**
           * Evento para cancelar un cita
           */
          function getturnautomatic() {
            vm.loadingturn = true;
            vm.isDisableAplazar = true;
            vm.isDisableattend = false;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS
              .turnAutomatic(
                auth.authToken,
                vm.branchSiga,
                vm.serviceEntrySiga,
                localStorageService.get("pointSiga").id
              )
              .then(
                function (data) {
                  if (data.status === 200) {
                    if(localStorageService.get("manejodesigaporsede") === "True"){
                      if(data.data.length===0){
                        logger.warning($filter("translate")("0917"));
                        vm.loadingturn = false;
                        return false;
                      }                      
                    }
                    vm.turnnautomatic = data.data;
                    if (data.data.state === 0) {
                      logger.warning($filter("translate")("0917"));
                    } else{
                      var auth = localStorageService.get(
                        "Enterprise_NT.authorizationData"
                      );
                      var data = {
                        idTurn: vm.turnnautomatic.id,
                        point: {
                          branch: {
                            id: vm.branchSiga,
                          },
                          service: {
                            id: vm.serviceEntrySiga,
                          },
                          point: {
                            id: localStorageService.get("pointSiga").id,
                          },
                          user: {
                            id: auth.id,
                          },
                        },
                        user: {
                          id: auth.id,
                          user: auth.userName,
                          lastName: auth.lastName,
                          name: auth.name,
                        },
                      };
                      return sigaDS.turnmanual(auth.authToken, data).then(
                        function (data) {
                          if (data.status === 200) {
                            vm.dataturn = vm.turnnautomatic;
                            localStorageService.set("turn", vm.dataturn);
                            vm.showCountTicket = true;
                            UIkit.modal("#modalattendshift", {
                              bgclose: false,
                            }).show();
                          }
                          vm.loadingturn = false;
                        },
                        function (error) {
                          vm.modalError(error);
                        }
                      );
                    }
                  }
                  vm.loadingturn = false;
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          /**
           * Evento cuando se selecciona una orden
           * @param {*} orderS
           */
          function selectOrder() {
            var turnsMovement = $filter("filter")(vm.dataorder, {
              select: true,
            });
            var order = turnsMovement[0].orderNumber;
            localStorageService.set("orderviewverification", order);
            setTimeout(function () {
              localStorageService.set("turn", vm.dataturn);
              $rootScope.dataturn = vm.dataturn;
              $scope.verificationorder(order);
              UIkit.modal("#orderassignverification").hide();
            }, 100);
          }
          /**
           * Evento consulta los servicios para la tranferencia
           */
          function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
          /**
           * Evento para cancelar un cita
           */
          function change(time) {
            if (time === null) {
              vm.time = 1;
            }
          }
          // selecciona todos las pruebas
          function selectall() {
            if (vm.orders.length > 0) {
              vm.orders.forEach(function (value, key) {
                vm.orders[key].select = vm.selectAllcheck;
              });
            }
          }
          /**
           * Evento para cancelar un cita
           */
          function consultorder() {
            if (vm.patientIdToSearch !== "0") {
              vm.searchByPatientId();
            }
          }
          /**
           * Evento para cancelar un cita
           */
          function getMotiveCancel() {
            vm.listMotiveCancel = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS.getReasonCancel(auth.authToken).then(
              function (data) {
                vm.getmotiveponeturn();
                if (data.status === 200) {
                  vm.listMotiveCancel = data.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function orderasing() {
            vm.listMotiveCancel = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS.getReasonCancel(auth.authToken).then(
              function (data) {
                vm.getmotiveponeturn();
                if (data.status === 200) {
                  vm.listMotiveCancel = data.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function searchByPatientId() {
            vm.orders = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            if (vm.patientIdToSearch !== "") {
              if (vm.patientDocToSearch === "0") {
                return sigaDS
                  .searchpatient(auth.authToken, vm.patientIdToSearch)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        if (data.data.length !== 0) {
                          data.data.forEach(function (value, key) {
                            if ($filter("translate")("0000") === "esCo") {
                              data.data[key].patient.sex.sexlanguaje =
                                data.data[key].patient.sex.esCo;
                            } else {
                              data.data[key].patient.sex.sexlanguaje =
                                data.data[key].patient.sex.enUsa;
                            }
                          });
                        }
                        vm.orders = $filter("orderBy")(
                          data.data,
                          "orderNumber",
                          false
                        );
                      }
                    },
                    function (error) {
                      vm.modalError(error);
                    }
                  );
              } else {
                return sigaDS
                  .withoutturn(
                    auth.authToken,
                    vm.patientIdToSearch,
                    vm.patientDocToSearch
                  )
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        if (data.data.length !== 0) {
                          data.data.forEach(function (value, key) {
                            if ($filter("translate")("0000") === "esCo") {
                              data.data[key].patient.sex.sexlanguaje =
                                data.data[key].patient.sex.esCo;
                            } else {
                              data.data[key].patient.sex.sexlanguaje =
                                data.data[key].patient.sex.enUsa;
                            }
                          });
                        }
                        vm.orders = $filter("orderBy")(
                          data.data,
                          "orderNumber",
                          false
                        );
                      }
                    },
                    function (error) {
                      vm.modalError(error);
                    }
                  );
              }
            }
          }
          /**
           * Evento para cancelar un cita
           */
          function getmotiveponeturn() {
            vm.listMotiveponeturn = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS.getReasonCancel(auth.authToken).then(
              function (data) {
                if (data.status === 200) {
                  vm.listMotiveponeturn = data.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento cuando se busca ordenes por fecha
           */
          function searchByDate() {
            vm.loadingturn = true;
            vm.listshift = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS
              .getturnsActive(
                auth.authToken,
                vm.branchSiga,
                vm.serviceEntrySiga,
                localStorageService.get("pointSiga").id
              )
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.listshift = $filter("orderBy")(
                      data.data,
                      "priority",
                      false
                    );
                  }
                  UIkit.modal("#automaticshift").show();
                  vm.loadingturn = false;
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          /**
           * Evento para cancelar un cita
           */
          function call(items) {
            vm.loadingturn = true;
            vm.dataturn = items;
            localStorageService.set("turn", vm.dataturn);
            vm.isDisableAplazar = true;
            vm.isDisableattend = false;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS
              .getturncall(auth.authToken, items.id, items.service.id)
              .then(
                function (data) {
                  if (data.status === 200) {
                    if (data.data === true||data.data === 'true') {
                      var auth = localStorageService.get(
                        "Enterprise_NT.authorizationData"
                      );
                      var data = {
                        idTurn: items.id,
                        point: {
                          branch: {
                            id: vm.branchSiga,
                          },
                          service: {
                            id: items.service.id,
                          },
                          point: {
                            id: localStorageService.get("pointSiga").id,
                          },
                          user: {
                            id: auth.id,
                          },
                        },
                        user: {
                          id: auth.id,
                          user: auth.userName,
                          lastName: auth.lastName,
                          name: auth.name,
                        },
                      };
                      return sigaDS.turnmanual(auth.authToken, data).then(
                        function (data) {
                          if (data.status === 200) {
                            vm.showCountTicket = true;
                          /*   $interval.cancel(vm.reloadListShift);
                            vm.reloadListShift = undefined; */
                            UIkit.modal("#automaticshift").hide();
                            setTimeout(function () {
                              UIkit.modal("#modalattendshift", {
                                bgclose: false,
                              }).show();
                            }, 1000);
                          }
                          vm.loadingturn = false;
                        },
                        function (error) {
                          vm.modalError(error);
                        }
                      );
                    } else {
                      logger.warning($filter("translate")("0918"));
                      vm.searchByDate();
                    }
                  }
                  vm.loadingturn = false;
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          /**
           * Evento para atender un cita
           */
          function attend() {
            var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
            vm.isDisableattend = true;
            vm.isDisableAplazar = false;
            var data = {
              id: 0,
              turn: {
                id: vm.dataturn.id,
              },
              service: {
                id: vm.dataturn.service.id,
              },
              pointOfCare: {
                id: localStorageService.get("pointSiga").id,
              }             
            };
            vm.idattend = "";
            vm.loapatient = vm.dataturn.patient;           
            return sigaDS.attendturn(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  if (localStorageService.get("manejodesigaporsede") === "True") {
                    vm.idattend = data.data.data;
                  }else{
                    vm.idattend = data.data;
                  }                 
                  localStorageService.set("idturn", vm.idattend);
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function cancel() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            var data = {
              id: vm.idattend === undefined ? 0 : vm.idattend,
              turn: {
                id: vm.dataturn.id,
              },
              service: {
                id: vm.dataturn.service.id,
              },
              pointOfCare: {
                id: localStorageService.get("pointSiga").id,
              },
              reason: {
                id: vm.motiveCancel.id,
              },
              user: {
                id: auth.id,
                user: auth.userName,
                lastName: auth.lastName,
                name: auth.name,
              },
            };

            return sigaDS.cancelturn(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  logger.success($filter("translate")("0907"));
                  $rootScope.dataturn = null;
                  localStorageService.remove("turn");
                  vm.showCountTicket = false;
                  UIkit.modal("#motivecancel").hide();
                  vm.getMotiveCancel();
                  vm.serviceEntrySiga =
                    parseInt(localStorageService.get("moduleSiga")) === 1
                      ? localStorageService.get("OrdenesSIGA")
                      : localStorageService.get("VerificacionSIGA");
                  if (!vm.buttonautomatic) {
                  //  vm.reloadListShift = $interval(function () {
                   //   vm.searchByDate();
                 //   }, 50000);
                    vm.searchByDate();
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function saveorderasing() {
            vm.loading=true;
            UIkit.modal("#lisrorderassign").hide();
            var Orders = [];
            vm.orders.forEach(function (value, key) {
              if (value.select === true) {
                Orders.push(value.orderNumber);
              }
            });

            var datavieworder = {
              id: vm.dataturn.id,
              turn: vm.dataturn.number,
              orders: Orders,
              url: localStorageService.get("UrlSIGA")
            };

            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS.shiftorders(auth.authToken, datavieworder).then(
              function (data) {
                if (data.status === 200) {
                  setTimeout(function () {
                    localStorageService.set("turn", vm.dataturn);
                    $rootScope.dataturn = vm.dataturn;
                    $rootScope.orderturn =
                      datavieworder.orders[datavieworder.orders.length - 1];
                    $scope.listener(
                      datavieworder.orders[datavieworder.orders.length - 1]
                    );
                    vm.loading=false;                   
                  }, 400);
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function reserverturn() {
            var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
            var data = {
              id: vm.idattend,
              turn: {
                id: vm.dataturn.id,
              },
              service: {
                id: vm.dataturn.service.id,
              },
              pointOfCare: {
                id: localStorageService.get("pointSiga").id,
              },
              user: {
                id: auth.id,
                user:auth.userName,
                lastName:auth.lastName,
                name:auth.name
              }
            };          
            return sigaDS.reserverturn(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  logger.success($filter("translate")("0908"));
                  $rootScope.dataturn = null;
                  localStorageService.remove("turn");
                  vm.showCountTicket = false;
                  UIkit.modal("#modalreserverturn").hide();
                  vm.getMotiveCancel();
                  vm.serviceEntrySiga =
                    parseInt(localStorageService.get("moduleSiga")) === 1
                      ? localStorageService.get("OrdenesSIGA")
                      : localStorageService.get("VerificacionSIGA");
                  if (!vm.buttonautomatic) {
                 //   vm.reloadListShift = $interval(function () {
                   //   vm.searchByDate();
                  //  }, 50000);
                  vm.searchByDate();
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function poneturn() {
            var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
            var data = {
              id: vm.idattend,
              turn: {
                id: vm.dataturn.id,
              },
              service: {
                id: vm.dataturn.service.id,
              },
              pointOfCare: {
                id: localStorageService.get("pointSiga").id,
              },
              reason: {
                id: vm.motiveponeturn.id,
              },
              minutes: vm.time,
              user: {
                id: auth.id,
                user:auth.userName,
                lastName:auth.lastName,
                name:auth.name
              }
            };           
            return sigaDS.postponeturn(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  $rootScope.dataturn = null;
                  localStorageService.remove("turn");
                  logger.success($filter("translate")("0909"));
                  vm.showCountTicket = false;
                  UIkit.modal("#motivepostponeturn").hide();
                  vm.getMotiveCancel();
                  vm.serviceEntrySiga =
                    parseInt(localStorageService.get("moduleSiga")) === 1
                      ? localStorageService.get("OrdenesSIGA")
                      : localStorageService.get("VerificacionSIGA");
                  if (!vm.buttonautomatic) {
                  /*   vm.reloadListShift = $interval(function () {
                      vm.searchByDate();
                    }, 50000); */
                    vm.searchByDate();
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function closed() {
            vm.showCountTicket = false;

            if (!vm.buttonautomatic) {
             /*  $interval.cancel(vm.reloadListShift);
              vm.reloadListShift = undefined; */
              UIkit.modal("#automaticshift").hide();
            }
          }
          /**
           * Evento para cancelar un cita
           */
          function enterOrderTurn() {
            localStorageService.set("turn", vm.dataturn);
            $rootScope.dataturn = vm.dataturn;
            if (
             $scope.patientload !== undefined &&
              vm.loapatient !== null &&
              !vm.managehistoryauto
            ) {
              $scope.patientload(vm.loapatient);
            } else {
              $scope.cleanorder();
            } 
            UIkit.modal("#modalattendshift").hide();
          }
          /**
           * Evento para cancelar un cita
           */
          function getOrdersTurn() {
            vm.patientIdToSearch = "";
            vm.orders = undefined;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            documenttypesDS.getstatetrue(auth.authToken).then(
              function (response) {
                if (response.status === 200) {
                  var documentTypes = response.data;
                  documentTypes.push({
                    id: 0,
                    name: $filter("translate")("0919"),
                  });
                  documentTypes = documentTypes.sort(function (a, b) {
                    if (a.id > b.id) {
                      return 1;
                    } else if (a.id < b.id) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                  vm.orders = undefined;
                  vm.documentTypes = documentTypes;
                  vm.patientDocToSearch = "0";
                  UIkit.modal("#lisrorderassign", { bgclose: false }).show();
                }
              },
              function (error) {
                console.error(error);
              }
            );
          }
          /**
           * Evento para cancelar un cita
           */
          function getOrdersattend() {
            vm.dataorder = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS
              .getorderforturn(auth.authToken, vm.dataturn.number)
              .then(
                function (data) {
                  if (data.status === 200) {
                    if (data.data.length !== 0) {
                      data.data.forEach(function (value, key) {
                        if ($filter("translate")("0000") === "esCo") {
                          data.data[key].patient.sex.sexlanguaje =
                            data.data[key].patient.sex.esCo;
                        } else {
                          data.data[key].patient.sex.sexlanguaje =
                            data.data[key].patient.sex.enUsa;
                        }
                      });
                    }
                    vm.dataorder = data.data;
                    UIkit.modal("#orderassignverification", {
                      bgclose: false,
                    }).show();
                  }
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          /**
           * Evento para cancelar un cita
           */
          function viewverification(item) {
            if (vm.dataorder.length > 0) {
              vm.dataorder.forEach(function (value, key) {
                if (value.orderNumber === item.orderNumber) {
                  vm.dataorder[key].select = true;
                } else {
                  vm.dataorder[key].select = false;
                }
              });
            }
          }
        },
      ],
      controllerAs: "automaticshift",
    };
    return directive;
  }
})();
