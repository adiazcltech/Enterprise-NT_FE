/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                order               @descripción
                sample              @descripción
                idtest              @descripción
                patientinformation  @descripción
                photopatient        @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";

  angular
    .module("app.widgets")
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ])
    .directive("modalinformation", modalinformation);

  modalinformation.$inject = [
    "moment",
    "localStorageService",
    "$filter",
    "logger",
    "userDS",
    "resultsentryDS",
    "testDS",
  ];
  /* @ngInject */
  function modalinformation(
    moment,
    localStorageService,
    $filter,
    logger,
    userDS,
    resultsentryDS,
    testDS
  ) {
    var directive = {
      templateUrl: "app/widgets/userControl/modalinformation.html",
      restrict: "EA",
      scope: {
        openmodal: "=openmodal",
        order: "=order",
        sample: "=sample",
        idtest: "=idtest",
        patientinformation: "=patientinformation",
        photopatient: "=photopatient",
        testcode: "=testcode",
        testname: "=testname",
        orderdemo: "=?orderdemo",
      },

      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.init = init;
          vm.modalError = modalError;
          vm.closemodal = closemodal;
          vm.formatDateHours =
            localStorageService.get("FormatoFecha").toUpperCase() +
            ", HH:mm:ss";
          vm.viewTake =
            localStorageService.get("verTrazabilidadtoma") === "True";
          vm.listuser = listuser;
          vm.commenttest = commenttest;
          vm.dataprint = dataprint;
          vm.auditTest = [];
          vm.auditSample = [];

          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              vm.loading = true;
              vm.idtest = $scope.idtest;
              vm.sample = $scope.sample;
              vm.order = $scope.order;
              vm.patient = $scope.patientinformation;
              vm.typeordercolor = $scope.typeordercolor;
              vm.typeordercode = $scope.typeordercode;
              vm.photopatient = $scope.photopatient;
              vm.testcode = $scope.testcode;
              vm.testname = $scope.testname;
              vm.orderdemo = $scope.orderdemo;
              vm.commenttest();
            }
            $scope.openmodal = false;
          });
          // función para la ventana de error
          function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
          // función para cerrar la ventana
          function closemodal() {
            UIkit.modal("#informationmodal").hide();
          }
          // función para cerrar la ventana
          function commenttest() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            vm.photo = "";
            return testDS.getTestById(auth.authToken, vm.idtest).then(
              function (data) {
                vm.dataprint();
                if (data.status === 200) {
                  vm.comment = data.data.generalInformation;
                  vm.commentuser = $filter("filter")(
                    vm.user,
                    { id: data.data.user.id },
                    true
                  );
                  if (vm.commentuser.lenght > 0) {
                    vm.usercomment = vm.commentuser[0].user.userName;
                    vm.photo = vm.commentuser[0].photo;
                  }
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          // función para cerrar la ventana
          function dataprint() {
            vm.listinformation = [];
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return resultsentryDS
              .getinformationtestorder(auth.authToken, vm.order, vm.idtest)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.listinformation = data.data;

                    vm.viewprint =
                      vm.listinformation.deliveryTypes.length === 0
                        ? false
                        : true;
                    if (vm.viewprint) {
                      vm.listinformation.deliveryTypes[0].tests.forEach(
                        function (value) {
                          var user = _.filter(vm.user, function (o) {
                            return o.id === value.user.id;
                          })[0];
                          value.updateDate = moment(value.date).format(
                            vm.formatDateHours
                          );
                          value.idprint = value.idMediumDelivery;
                          value.userFullName = value.receivesPerson;
                          value.username =
                            value.receivesPerson != null
                              ? value.receivesPerson
                              : value.user.name + " " + value.user.lastName;
                          switch (value.idprint) {
                            case 59:
                              value.nameprint =
                                $filter("translate")("0000") !== "esCo"
                                  ? "Print"
                                  : "Impreso";
                              break;
                            case 62:
                              value.nameprint =
                                $filter("translate")("0000") !== "esCo"
                                  ? "Pdf"
                                  : "Pdf";
                              break;
                            case 60:
                              value.nameprint =
                                $filter("translate")("0000") !== "esCo"
                                  ? "Email"
                                  : "Correo";
                              break;
                            case 61:
                              value.nameprint =
                                $filter("translate")("0000") !== "esCo"
                                  ? "Web query"
                                  : "Consulta Web";
                              break;
                          }
                          value.photo = "";
                          value.typeDelivery =
                            value.idprint === 60
                              ? value.sendingType === "0"
                                ? $filter("translate")("0945")
                                : $filter("translate")("0765")
                              : null;

                          value.idTypeDelivery = value.sendingType;
                          if (user != undefined) {
                            value.photo = user.photo;
                          }
                        }
                      );

                      vm.listinformation.deliveryTypes = $filter("orderBy")(
                        vm.listinformation.deliveryTypes[0].tests,
                        "updateDate"
                      );
                    }

                    vm.listinformation.auditOperation = _.sortBy(
                      vm.listinformation.auditOperation,
                      function (dateObj) {
                        return dateObj.date;
                      }
                    );

                    vm.listinformation.auditOperation = _.map(
                      vm.listinformation.auditOperation,
                      function (o) {
                        o.dateformat = moment(o.date).format(
                          vm.formatDateHours
                        );
                        return o;
                      }
                    );

                    vm.auditSample = $filter("filter")(
                      vm.listinformation.auditOperation,
                      function (e) {
                        return (
                          (e.fieldType === "S" && e.id === vm.sample) ||
                          (e.fieldType === "SS" && e.id === vm.sample)
                        );
                      }
                    );

                    if (vm.auditSample.length === 0) {
                      vm.auditSample = $filter("filter")(
                        vm.listinformation.auditOperation,
                        function (e) {
                          return e.fieldType === "ST";
                        }
                      );
                    }

                    if (vm.viewTake) {
                      vm.auditSample = vm.auditSample;
                    } else {
                      vm.auditSample = _.filter(
                        _.clone(vm.auditSample),
                        function (o) {
                          return o.information !== "3";
                        }
                      );
                    }

                    vm.auditTest = _.filter(
                      vm.listinformation.auditOperation,
                      function (o) {
                        if(o.fieldType === "DO" && o.action === "I"){
                          o.nameattachment= o.information;                    
                          o.information="DOI";
                        }
                        if(o.fieldType === "DO" && o.action === "D"){
                          o.nameattachment= o.information;                    
                          o.information="DOD";
                        }
                        o.result = o.result === null ? "" : o.result;
                        return o.fieldType === "T" || o.fieldType === "DO";
                      }
                    );

                    UIkit.modal("#informationmodal").show();
                    vm.loading = false;
                  }
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }

          // función para consultar los usuario
          function listuser() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            userDS.getUsers(auth.authToken).then(
              function (response) {
                if (response.status === 200) {
                  vm.user = response.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }

          function init() {
            vm.listuser();
          }
          vm.init();
        },
      ],
      controllerAs: "modalinformation",
    };
    return directive;
  }
})();
