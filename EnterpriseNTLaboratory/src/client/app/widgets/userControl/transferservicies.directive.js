/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal: variable para abrir la ventana modal  
                listener: variable para consultar una función de ingreso de ordenes y limpiar el formulario    
  AUTOR:        Jernnifer DIaz
  FECHA:        2018-06-07
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html

  MODIFICACIONES:

********************************************************************************/

(function () {
  "use strict";
  angular
    .module("app.widgets")
    .directive("transferservicies", transferservicies);
  transferservicies.$inject = [
    "sigaDS",
    "localStorageService",
    "$filter",
    "logger",
    "$rootScope",
  ];
  /* @ngInject */
  function transferservicies(
    sigaDS,
    localStorageService,
    $filter,
    logger,
    $rootScope
  ) {
    var directive = {
      templateUrl: "app/widgets/userControl/transferservicies.html",
      restrict: "EA",
      scope: {
        openmodal: "=?openmodal",
        listener: "=?listener",
        cleanverification: "=?cleanverification",
      },
      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.save = save;
          vm.searchByDate = searchByDate;
          vm.loading = true;
          vm.branchSiga = localStorageService.get("SedeSIGA");
          vm.serviceEntrySiga =
            parseInt(localStorageService.get("moduleSiga")) === 1
              ? localStorageService.get("OrdenesSIGA")
              : localStorageService.get("VerificacionSIGA");
          vm.showCountTicket = false;
          vm.lenguaje = $filter("translate")("0000");
          vm.closed = closed;
          vm.changependingServices = changependingServices;
          vm.modalError = modalError;
          vm.changepermit = changepermit;

          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              vm.turn = parseInt(localStorageService.get("turn").id);
              vm.serviceEntrySiga =
                parseInt(localStorageService.get("moduleSiga")) === 1
                  ? localStorageService.get("OrdenesSIGA")
                  : localStorageService.get("VerificacionSIGA");
              vm.searchByDate();
            }
            $scope.openmodal = false;
          });
          /**
           * Evento consulta los servicios para la tranferencia
           */
          function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
          /**
           * Evento consulta los servicios para la tranferencia
           */
          function searchByDate() {
            vm.loading = true;
            vm.listshift = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return sigaDS
              .gettransferservicies(
                auth.authToken,
                vm.branchSiga,
                vm.serviceEntrySiga,
                vm.turn
              )
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.listshift =
                      data.data.length === 0 ? data.data : rDeservice(data);
                  }
                  UIkit.modal("#transferservicies").show();
                  vm.loading = false;
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          /**
           *
           * Evento que evalua que complementa el json consultado
           */
          function rDeservice(data) {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            data.data.forEach(function (value, key) {
              value.id = value.serviceDes.id;
              value.turnsMovement = true;
            });
            return data.data;
          }
          /**
           * Evento que evalua que solo seleccione un solo transferir a
           */
          function changependingServices(item) {
            if (vm.listshift.length > 0) {
              if (item.turnsMovement === false) {
                item.turnsMovement = true;
              }
              vm.listshift.forEach(function (value, key) {
                if (value.id === item.id) {
                  vm.listshift[key].pendingServices = true;
                } else {
                  vm.listshift[key].pendingServices = false;
                }
              });
            }
          }
          /**
           * Evento que evalua que solo seleccione un solo transferir a
           */
          function changepermit(item) {
            if (vm.listshift.length > 0) {
              if (item.turnsMovement === false) {
                item.pendingServices = false;
              }
            }
          }
          /**
           * Evento para guardar la trasferencia
           */
          function save() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            var turnsMovement = $filter("filter")(vm.listshift, {
              turnsMovement: true,
            });
            var pendingServices = $filter("filter")(vm.listshift, {
              pendingServices: true,
            });
            var data = {
              idTurn: vm.turn,
              turnsMovement: [
                {
                  turn: {
                    id: vm.turn,
                  },
                  user: {
                    id: auth.id,
                  },
                  service: {
                    id: parseInt(vm.serviceEntrySiga),
                  },
                  pointOfCare: {
                    id: parseInt(localStorageService.get("pointSiga").id),
                  },
                  branch: {
                    id: parseInt(vm.branchSiga),
                  },
                  state: 6,
                  active: 1,
                  transfer: true,
                },
                {
                  turn: {
                    id: vm.turn,
                  },
                  service: {
                    id: pendingServices[0].id,
                  },
                  user: null,
                  pointOfCare: null,
                  branch: {
                    id: 2,
                  },
                  state: 1,
                  active: 1,
                  transfer: false,
                },
              ],
              pendingServices: turnsMovement,
              user: {
                id: auth.id,
                user: auth.userName,
                lastName: auth.lastName,
                name: auth.name,
              },
            };
            return sigaDS.transfers(auth.authToken, data).then(
              function (data) {
                if (data.status === 200) {
                  vm.idattend = data.data;
                  $rootScope.dataturn = null;
                  localStorageService.remove("turn");
                  logger.success($filter("translate")("0915"));
                  if (parseInt(localStorageService.get("moduleSiga")) === 1) {
                    setTimeout(function () {
                      $scope.listener();
                      UIkit.modal("#transferservicies").hide();
                    }, 100);
                  } else {
                    setTimeout(function () {
                      $scope.cleanverification();
                      UIkit.modal("#transferservicies").hide();
                    }, 400);
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          /**
           * Evento para cerrar la ventana modal
           */
          function closed() {
            UIkit.modal("#transferservicies").hide();
          }
        },
      ],
      controllerAs: "transferservicies",
    };
    return directive;
  }
})();
