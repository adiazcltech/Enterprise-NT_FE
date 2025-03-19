/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.traceability")
    .controller("traceabilityController", traceabilityController);
  traceabilityController.$inject = [
    "common",
    "sampletrackingsDS",
    "listDS",
    "documenttypesDS",
    "localStorageService",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "orderDS",
    "auditsorderDS",
  ];

  function traceabilityController(
    common,
    sampletrackingsDS,
    listDS,
    documenttypesDS,
    localStorageService,
    $filter,
    $state,
    moment,
    $rootScope,
    orderDS,
    auditsorderDS
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "traceability";
    $rootScope.helpReference = "01. LaboratoryOrders/traceability.htm";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0046");
    vm.rangeInit = "";
    vm.rangeEnd = "";
    vm.twoNames = localStorageService.get("DosNombresPaciente") === "True";
    vm.twosurnames = localStorageService.get("DosApellidosPaciente") === "True";
    vm.formatDateHours =
      localStorageService.get("FormatoFecha").toUpperCase() + ", HH:mm:ss";
    vm.formatDate = localStorageService.get("FormatoFecha");
    vm.orderdigit = localStorageService.get("DigitosOrden");
    vm.cantdigit = parseInt(vm.orderdigit) + 4;
    vm.typedocument = localStorageService.get("ManejoTipoDocumento");
    vm.typedocument =
      vm.typedocument === "True" || vm.typedocument === true ? true : false;
    vm.historyautomatic = localStorageService.get("HistoriaAutomatica");
    vm.historyautomatic =
      vm.historyautomatic === "True" || vm.historyautomatic === true
        ? true
        : false;
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.dateseach = moment().format();
    vm.max = moment().format();
    vm.listYear = [];
    vm.typeresport = [];
    vm.ListOrder = [];
    vm.documentType = [];
    vm.listtest = [];
    vm.receiveresults = "";
    vm.record = "";
    vm.lastname = "";
    vm.modalError = modalError;
    vm.getListYear = getListYear;
    vm.keyselect = keyselect;
    vm.getlist = getlist;
    vm.gettypedocument = gettypedocument;
    vm.getseach = getseach;
    vm.changefilter = changefilter;
    vm.searchtype = searchtype;
    vm.keyselectpatientid = keyselectpatientid;
    vm.loadingdata = true;
    vm.getId = getId;
    vm.selected = -1;
    vm.filterRange = "1";
    vm.detailsample = [];
    vm.listinformationtest = [];
    vm.listinformation = [];
    vm.orders = [];
    vm.selectedsample = -1;
    vm.selectedtest = -1;
    vm.labelstate1 = $filter("translate")("0413");
    vm.labelstate2 = $filter("translate")("0128");
    vm.labelstate3 = $filter("translate")("3126");
    vm.labelstate4 = $filter("translate")("0435");
    vm.labelstate5 = $filter("translate")("1540");
    vm.labelstate6 = $filter("translate")("0572");
    vm.labelstate7 = $filter("translate")("0954");
    $rootScope.pageview = 3;
    /*
      PENDING(-1),
      REJECTED(0),
      NEW_SAMPLE(1),
      ORDERED(2),
      COLLECTED(3),
      CHECKED(4);  */

    if ($filter("translate")("0000") === "es") {
      kendo.culture("es-ES");
    } else {
      kendo.culture("en-US");
    }
    vm.typeresport = [
      {
        id: 1,
        name: $filter("translate")("0117"),
      }, //historia
      {
        id: 2,
        name: $filter("translate")("0134"),
      }, //Apellido
      {
        id: 3,
        name: $filter("translate")("0325"),
      }, // Fecha
      {
        id: 4,
        name: $filter("translate")("0061"),
      }, // Orden
    ];

    vm.typeresport.id = 1;
    //** Método para cuando cambia tipo de busqueda**//
    function changefilter() {
      vm.codeordernumberorden = "";
      vm.documentType = [];
      vm.record = "";
      vm.lastNameToSearch = "";
      vm.surNameToSearch = "";
      vm.name1ToSearch = "";
      vm.name2ToSearch = "";
      vm.selected = -1;
      vm.orders = [];
      vm.search = "";
      vm.detailsample = [];
      vm.listinformationtest = [];
      vm.listinformation = [];
      vm.selectedsample = -1;
      vm.selectedtest = -1;
      vm.dateseach = moment().format();
      if (vm.typeresport.id === 3) {
        vm.searchtype();
      }
      if (vm.typeresport.id === 1) {
        vm.documentType.id = 0;
      }
    }
    // Estados de la muestra
    // -1 -> Pendiente,
    // 0 -> Rechazada,
    // 1 -> Nueva muestra,
    // 2 -> Ordenada,
    // 3 -> tomada,
    // 4 -> verificada,
    vm.traceabilitysample = traceabilitysample;
    function traceabilitysample(item) {
      vm.listinformation = [];
      vm.listinformationtest = [];
      vm.selectedsample = item.id;
      vm.selectedtest = -1;
      vm.namesample = item.name;
      if (vm.auditorder.length !== 0) {
        var dataauditsample = $filter("filter")(
          _.clone(vm.auditorder),
          function (e) {
            return (
              (e.fieldType === "S" && e.id === vm.selectedsample) ||
              (e.fieldType === "SS" && e.id === vm.selectedsample)
            );
          }
        );
        if (dataauditsample.length === 0) {
          var dataauditsample = $filter("filter")(
            _.clone(vm.auditorder),
            function (e) {
              return e.fieldType === "ST";
            }
          );
        }

        if (dataauditsample.length !== 0) {
          dataauditsample = $filter("orderBy")(dataauditsample, "date");
          var listinformation = [];
          dataauditsample.forEach(function (value, key) {
            var name = "";
            if (value.action === "D") {
              var name = $filter("translate")("0954");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                username: value.username,
                name1: value.name1,
                lastName: value.lastName,
                state: "D",
                name: name,
              };
            } else if (value.fieldType === "SS") {
              var posicion = JSON.parse(value.information);
              var name = $filter("translate")("0801");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                username: value.username,
                name1: value.name1,
                lastName: value.lastName,
                state: "A",
                name: name,
                position: posicion.position,
                rack: posicion.rack.name,
              };
            } else {
              switch (value.information) {
                case "-1":
                  var name = $filter("translate")("0413");
                  break;
                case "0":
                  var name = $filter("translate")("0128");
                  break;
                case "1":
                  var name = $filter("translate")("3126");
                  break;
                case "2":
                  var name = $filter("translate")("1014");
                  break;
                case "3":
                  var name = $filter("translate")("1540");
                  break;
                case "4":
                  var name =
                    value.destination === null
                      ? $filter("translate")("0572")
                      : value.destination;
                  break;
                default:
                  var name = "";
                  break;
              }
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                username: value.username,
                name1: value.name1,
                lastName: value.lastName,
                state: value.information,
                name: name,
                destination:
                  value.destination === null ? "" : value.destination,
              };
            }
            listinformation.push(sample);
          });
          vm.listinformation = _.uniqWith(listinformation, _.isEqual);
          if (vm.viewTake) {
            vm.listinformation = vm.listinformation;
          } else {
            vm.listinformation = _.filter(
              _.clone(vm.listinformation),
              function (o) {
                return o.state !== "3";
              }
            );
          }
        }
        vm.loading = false;
      }
    }
    // Estados del examen
    /*  ORDERED(0),
         RERUN(1),
        REPORTED(2),
        PREVIEW(3),
        VALIDATED(4),
        DELIVERED(5),
        FINALDELIVERED(6);
  */
    vm.traceabilitytest = traceabilitytest;
    function traceabilitytest(item) {
      vm.listinformationtest = [];
      vm.listinformation = [];
      vm.selectedtest = item.id;
      vm.selectedsample = -1;
      vm.namesample = item.fieldDescription;
      if (vm.auditorder.length !== 0) {
        var dataauditsample = $filter("filter")(
          _.clone(vm.auditorder),
          function (e) {
            return (
              (e.fieldType === "ST" && e.id === vm.selectedtest) ||
              (e.fieldType === "T" && e.id === vm.selectedtest) ||
              (e.fieldType === "BK" && e.id === vm.selectedtest) ||
              (e.fieldType === "DO" && e.id === vm.selectedtest)
            );
          }
        );
        if (dataauditsample.length !== 0) {
          dataauditsample = $filter("orderBy")(dataauditsample, "date");
          var listinformationtest = [];
          dataauditsample.forEach(function (value, key) {
            var name = "";

            if (value.fieldType === "DO" && value.action === "I") {
              var name = $filter("translate")("3659");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                name1: value.name1,
                lastName: value.lastName,
                username: value.username,
                state: "DOI",
                name: name,
                information: value.information
               
              };
            } else if (value.fieldType === "DO" && value.action === "D") {
              var name = $filter("translate")("3660");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                name1: value.name1,
                lastName: value.lastName,
                username: value.username,
                state: "DOD",
                name: name,
                information: value.information,
                comment: value.comment
              };
            } else if (value.action === "D") {
              var name = $filter("translate")("0954");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                name1: value.name1,
                lastName: value.lastName,
                username: value.username,
                state: "D",
                name: name,
              };
            } else if (value.fieldType === "BK") {
              var name = $filter("translate")("1541");
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                name1: value.name1,
                lastName: value.lastName,
                username: value.username,
                state: value.information,
                name: name,
              };
            } else  if (value.fieldType === "ST") {
              switch (value.information) {
                case "-1":
                  var name = $filter("translate")("0413");
                  break;
                case "0":
                  var name = $filter("translate")("0128");
                  break;
                case "1":
                  var name = $filter("translate")("3126");
                  break;
                case "2":
                  var name = $filter("translate")("1014");
                  break;
                case "3":
                  var name = $filter("translate")("1540");
                  break;
                case "5":
                  var name = "Impresion de muestra";
                  break;
                case "6":
                  var name = $filter("translate")("3236");
                  break;
                case "4":
                  var name =
                    value.destination === null
                      ? $filter("translate")("0572")
                      : value.destination;
                  break;
                default:
                  var name = "";
                  break;
              }
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                username: value.username,
                name1: value.name1,
                lastName: value.lastName,
                state: value.information,
                name: name,
                fieldType: value.fieldType,
              };
            } else {
              switch (value.information) {
                case "0":
                  var name = $filter("translate")("1014");
                  break;
                case "1":
                  var name = $filter("translate")("0355");
                  break;
                case "2":
                  var name = $filter("translate")("0019");
                  break;
                case "3":
                  var name = $filter("translate")("0055");
                  break;
                case "4":
                  var name = $filter("translate")("0751");
                  break;
                case "5":
                  var name = $filter("translate")("1231");
                  break;
                case "6":
                  var name = "Entrega final";
                  break;
                default:
                  var name = "";
                  break;
              }
              var sample = {
                date: moment(value.date).format(vm.formatDateHours),
                username: value.username,
                name1: value.name1,
                lastName: value.lastName,
                state: value.information,
                name: name,
                receivesPerson: value.receivesPerson,
                delivery:
                  $filter("translate")("0000") === "esCo"
                    ? value.deliveryEsCo
                    : value.deliveryEnUSA,
                typeDelivery:
                  value.delivery !== null
                    ? value.delivery === 60
                      ? value.comment === "0"
                        ? $filter("translate")("1890")
                        : $filter("translate")("1891")
                      : null
                    : null,
                idTypeDelivery: value.comment,
              };
            }
            if (value.information === "2" && value.fieldType === "ST") {
            } else {
              listinformationtest.push(sample);
            }
          });
          vm.listinformationtest = _.uniqWith(listinformationtest, _.isEqual);
          if (vm.viewTake) {
            vm.listinformationtest = vm.listinformationtest;
          } else {
            vm.listinformationtest = _.filter(
              _.clone(vm.listinformationtest),
              function (o) {
                return o.state !== "3";
              }
            );
          }
        }
        vm.loading = false;
      }
    }
    function getId(order) {
      vm.loadingdata = true;
      vm.selected = order.order;
      vm.selectedsample = -1;
      vm.selectedtest = -1;
      vm.listinformation = [];
      vm.auditorder = [];
      vm.listinformationtest = [];
      vm.detailsample = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return auditsorderDS.getorder(auth.authToken, vm.selected).then(
        function (data) {
          if (data.status === 200) {
            vm.auditorder = data.data;
            return sampletrackingsDS
              .sampleorder(auth.authToken, vm.selected)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.detailsample = data.data;
                    vm.detailsample.forEach(function (value) {
                      value.sampleState.state = _.min(
                        value.tests,
                        function (o) {
                          return e.result.sampleState;
                        }
                      ).result.sampleState;
                    });
                  } else {
                    vm.menssageinformative = $filter("translate")("0179");
                  }
                  vm.loadingdata = false;
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método para validar si los campos requeridos se encuentran llenos para hacer la busqueda**//
    function searchtype() {
      vm.selected = -1;
      vm.selectedsample = -1;
      vm.selectedtest = -1;
      vm.listinformation = [];
      vm.auditorder = [];
      vm.listinformationtest = [];
      vm.detailsample = [];
      if (vm.typeresport.id === 1) {
        if (vm.record === "" || vm.record === undefined) {
          setTimeout(function () {
            document.getElementById("txt_patient_id").focus();
          }, 400);
          return true;
        } else {
          vm.getseach();
        }
      }
      if (vm.typeresport.id === 2) {
        if (
          (vm.lastNameToSearch === "" || vm.lastNameToSearch === undefined) &&
          (vm.surNameToSearch === "" || vm.surNameToSearch === undefined) &&
          (vm.name1ToSearch === "" || vm.name1ToSearch === undefined) &&
          (vm.name2ToSearch === "" || vm.name2ToSearch === undefined)
        ) {
          setTimeout(function () {
            document.getElementById("txt_lastName").focus();
          }, 400);
          return true;
        } else {
          vm.getseach();
        }
      }
      if (vm.typeresport.id === 3) {
        if (vm.dateseach === null) {
          return true;
        } else {
          vm.getseach();
        }
      }
      if (vm.typeresport.id === 4) {
        if (vm.codeordernumberorden === "") {
          document.getElementById("txt_ordersearch_order").select();
          return true;
        } else {
          vm.getseach();
        }
      }
    }
    //** Método que evalua cuando se digita el enter en la historia**//
    function keyselectpatientid($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.searchtype();
      }
    }
    //** Método conmsulta servicio para la busqueda**//
    function getseach() {
      vm.loadingdata = true;
      if (vm.typeresport.id === 1) {
        if (vm.typedocument && vm.documentType.id !== "0") {
          vm.loadingdata = true;
          vm.orders = [];
          vm.viewnofound = false;
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          orderDS
            .getByPatientIdWithDoc(
              auth.authToken,
              vm.record,
              vm.documentType.id,
              -1
            )
            .then(
              function (data) {
                if (data.status === 200) {
                  var order = _.uniqBy(data.data, "order");
                  vm.orders = _.orderBy(order, "order", "desc");
                  vm.viewnofound = false;
                } else {
                  vm.orders = [];
                  vm.viewnofound = true;
                }
                vm.loadingdata = false;
              },
              function (error) {
                vm.loadingdata = false;
                vm.Error = error;
                vm.ShowPopupError = true;
              }
            );
        } else {
          orderDS.getByPatientIdWithDoc(auth.authToken, vm.record, 1, -1).then(
            function (data) {
              if (data.status === 200) {
                vm.orders = _.orderBy(data.data, "order", "desc");
                vm.viewnofound = false;
              } else {
                vm.orders = [];
                vm.viewnofound = true;
              }
              vm.loadingdata = false;
            },
            function (error) {
              vm.loadingdata = false;
              vm.Error = error;
              vm.ShowPopupError = true;
            }
          );
        }
      }

      if (vm.typeresport.id === 2) {
        vm.orders = [];
        vm.loadingdata = true;
        var lastNameToSearch =
          vm.lastNameToSearch === "" || vm.lastNameToSearch === undefined
            ? "undefined"
            : vm.lastNameToSearch.toUpperCase();
        var surNameToSearch =
          vm.surNameToSearch === "" || vm.surNameToSearch === undefined
            ? "undefined"
            : vm.surNameToSearch.toUpperCase();
        var name1ToSearch =
          vm.name1ToSearch === "" || vm.name1ToSearch === undefined
            ? "undefined"
            : vm.name1ToSearch.toUpperCase();
        var name2ToSearch =
          vm.name2ToSearch === "" || vm.name2ToSearch === undefined
            ? "undefined"
            : vm.name2ToSearch.toUpperCase();
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        //Invoca el metodo del servicio
        orderDS
          .getByPatientInfo(
            auth.authToken,
            lastNameToSearch,
            surNameToSearch,
            name1ToSearch,
            name2ToSearch,
            -1
          )
          .then(
            function (data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                vm.orders = _.orderBy(data.data, "order", "desc");
                vm.viewnofound = false;
              } else {
                vm.orders = [];
                vm.viewnofound = true;
              }
              document.getElementById("txt_lastName").select();
            },
            function (error) {
              vm.loadingdata = false;
              vm.Error = error;
              vm.ShowPopupError = true;
            }
          );
      }

      if (vm.typeresport.id === 3) {
        vm.loadingdata = true;
        var date = moment(vm.dateseach).format("YYYYMMDD");
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        //Invoca el metodo del servicio
        orderDS.getByEntryDate(auth.authToken, date, -1).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.viewnofound = false;
              vm.orders = _.orderBy(data.data, "order", "desc");
            } else {
              vm.orders = [];
              vm.viewnofound = true;
            }
            document.getElementById("kUI_datepicker_a").select();
          },
          function (error) {
            vm.loadingdata = false;
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        );
      }
      if (vm.typeresport.id === 4) {
        var order = vm.listYear.id + vm.codeordernumberorden;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        orderDS.getByOrder(auth.authToken, order, -1).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.orders = [data.data];
              vm.viewnofound = false;
            } else {
              vm.orders = [];
              vm.viewnofound = true;
            }
            document.getElementById("txt_ordersearch_order").select();
          },
          function (error) {
            vm.loadingdata = false;
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        );
      }
    }
    //** Método para completar el número de la orden**//
    function keyselect($event) {
      var keyCode =
        $event !== undefined ? $event.which || $event.keyCode : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.codeordernumberorden.length < vm.cantdigit) {
          vm.codeordernumberorden =
            vm.codeordernumberorden === "" ? 0 : vm.codeordernumberorden;
          if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 1) {
            vm.numberordensearch =
              vm.listYear.id +
              moment().format("MM") +
              "0" +
              vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 2
          ) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 3
          ) {
            vm.numberordensearch =
              vm.listYear.id + "0" + vm.codeordernumberorden;
          } else {
            vm.numberordensearch =
              vm.listYear.id +
              common
                .getOrderComplete(vm.codeordernumberorden, vm.orderdigit)
                .substring(4);
          }
          vm.codeordernumberorden = vm.numberordensearch.substring(4);
          vm.searchtype();
        } else if (vm.codeordernumberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.searchtype();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    //** Método para obtener lista de años**//
    function getListYear() {
      vm.gettypedocument();
      vm.listYear = common.getListYear();
      vm.listYear.id = moment().year();
      setTimeout(function () {
        document.getElementById("txt_patient_id").focus();
      }, 400);
      return vm.listYear;
    }
    //** Método para obtener lista tipo de documento**//
    function gettypedocument() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return documenttypesDS.getstatetrue(auth.authToken).then(
        function (data) {
          vm.getlist();
          vm.loadingdata = false;
          if (data.status === 200) {
            var documentTypes = data.data;
            documentTypes.push({
              id: 0,
              abbr: "NI",
              name: "SIN FILTRO",
            });
            vm.documentTypelist = documentTypes;
            vm.documentType.id = 0;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    //** Método para obtener lista tipo de documento**//
    function getlist() {
      vm.datalist = [
        {
          id: 0,
          enUsa: "All",
          esCo: "Todos",
        },
      ];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return listDS.getList(auth.authToken, 58).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            data.data.forEach(function (value) {
              vm.datalist.push(value);
            });
          }
          vm.selectdatalis = 0;
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    function modalError(error) {
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
    function init() {
      vm.viewTake = localStorageService.get("verTrazabilidadtoma") === "True";
      vm.getListYear();
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
