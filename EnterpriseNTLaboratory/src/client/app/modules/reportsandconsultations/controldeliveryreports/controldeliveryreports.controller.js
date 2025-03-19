/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.controldeliveryreports")
    .controller(
      "ControldeliveryreportsController",
      ControldeliveryreportsController
    );
  ControldeliveryreportsController.$inject = [
    "common",
    "deliveryofresultDS",
    "listDS",
    "documenttypesDS",
    "reviewofresultDS",
    "localStorageService",
    "reportsDS",
    "reportadicional",
    "LZString",
    "$translate",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "$scope",
    "resultsentryDS",
  ];

  function ControldeliveryreportsController(
    common,
    deliveryofresultDS,
    listDS,
    documenttypesDS,
    reviewofresultDS,
    localStorageService,
    reportsDS,
    reportadicional,
    LZString,
    $translate,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    $scope,
    resultsentryDS
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "ControlDeliveryreports";
    $rootScope.helpReference =
      "04.reportsandconsultations/controldeliveryreports.htm";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0032");
    vm.testprocces = "3";
    vm.save = save;
    vm.rangeInit = "";
    vm.rangeEnd = "";
    vm.selectedIds = [];
    vm.changetab = changetab;
    vm.PopupError = false;
    vm.modalError = modalError;
    $rootScope.pageview = 3;
    vm.tab = true;

    vm.formatDate = localStorageService.get("FormatoFecha");
    vm.typedocument = localStorageService.get("ManejoTipoDocumento");
    vm.typedocument =
      vm.typedocument === "True" || vm.typedocument === true ? true : false;
    vm.historyautomatic = localStorageService.get("HistoriaAutomatica");
    vm.historyautomatic =
      vm.historyautomatic === "True" || vm.historyautomatic === true
        ? true
        : false;
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.isPrintAttached = localStorageService.get("ImprimirAdjuntos") === "True";
    vm.namePdfHistory = localStorageService.get("GenerarPDFCon");
    vm.twosurnames = localStorageService.get("DosApellidosPaciente") === "True";
    vm.customer =
      localStorageService.get("Abreviatura") +
      " (" +
      localStorageService.get("Entidad") +
      ")";
    vm.dateseach = moment().format();
    vm.max = moment().format();
    vm.getsex = getsex;
    vm.getListYear = getListYear;
    vm.listYear = [];
    vm.typeresport = [];
    vm.days = [];
    vm.keyselect = keyselect;
    vm.codeorder = "";
    vm.codeordernumberorden = "";
    vm.report = false;
    vm.Filedeliveryresults = Filedeliveryresults;
    vm.Fileresultspending = Fileresultspending;
    vm.keyselectrange = keyselectrange;
    vm.orderselect = [];
    vm.gettypedocument = gettypedocument;
    vm.ListOrder = [];
    vm.getseach = getseach;
    vm.documentType = [];
    vm.getDetail = getDetail;
    vm.listtest = [];
    vm.receiveresults = "";
    vm.record = "";
    vm.lastname = "";
    vm.surname = "";
    vm.name = "";
    vm.name1 = "";
    vm.datasex = [];
    vm.receiveresultspopup = "";
    vm.changefilter = changefilter;
    vm.removeDatasave = removeDatasave;
    vm.removetest = removetest;
    vm.windowOpenReport = windowOpenReport;
    vm.treepatient = treepatient;
    vm.basicTree = [];
    vm.viewresult = false;
    vm.searchtype = searchtype;
    vm.keyselectpatientid = keyselectpatientid;
    vm.loadingdata = true;
    vm.addorder = addorder;
    vm.removeorder = removeorder;
    vm.button = false;
    vm.filterRange = "1";
    vm.filterRangePending = "1";
    vm.rangeInit2 = "";
    vm.rangeEnd2 = "";
    vm.attachments = vm.isPrintAttached;
    vm.destination = "1";
    vm.typePrint = "3";
    vm.quantityCopies = "1";
    vm.basicTree = [];
    vm.rangeInit5 = moment().format("YYYYMMDD");
    vm.rangeEnd5 = moment().format("YYYYMMDD");

    vm.groupProfilesPending = true;
    vm.groupProfilesDelivery = true;

    vm.orderdigit = localStorageService.get("DigitosOrden");
    vm.cantdigit = parseInt(vm.orderdigit) + 4;
    vm.openPrint = openPrint;
    //vm.changeDestination = changeDestination;
    vm.generateDataReport = generateDataReport;
    vm.jsonPrint = jsonPrint;
    vm.controlDeliveryReports = controlDeliveryReports;
    vm.converBase64toBlob = converBase64toBlob;
    vm.closemodaldemographics = closemodaldemographics;

    vm.selectOptions = {
      placeholder: "",
      dataTextField: "orderNumber",
      dataValueField: "id",
      valuePrimitive: true,
      autoBind: false,
    };
    vm.listorderselect = [];
    vm.selectedIds = [];
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
    vm.days = [
      {
        id: 1,
        name: $filter("translate")("0326"),
      }, // 30 días
      {
        id: 2,
        name: $filter("translate")("0327"),
      }, // 60 Días
      {
        id: 3,
        name: $filter("translate")("0328"),
      }, // 60 Ó más días
    ];
    vm.typeresport.id = 1;
    vm.days.id = 1;
    $scope.$on("selection-changed", function (e, node) {
      if (node.parentId !== undefined) {
        vm.numberOrder = node.name;
        vm.getDetail();
        vm.receiveresultspopup = "";
      }
    });
    vm.options5 ==
      {
        expandOnClick: true,
        filter: {},
      };

    //** Método para cuando cambia tipo de busqueda**//
    function changefilter() {
      vm.codeordernumberorden = "";
      vm.basicTree = [];
      vm.days.id = 1;
      vm.listtest = [];
      vm.documentType = [];
      vm.record = "";
      vm.lastname = "";
      vm.surname = "";
      vm.name = "";
      vm.name1 = "";
      vm.datasex.id = -1;
      vm.selectedIds = [];
      vm.dateseach = moment().format();
      vm.rangeInit5 = moment().format("YYYYMMDD");
      vm.rangeEnd5 = moment().format("YYYYMMDD");
      vm.receiveresults = "";
      if (vm.typeresport.id === 3) {
        vm.searchtype();
      }
    }

    function closemodaldemographics() {
      UIkit.modal("#demographicsmodal").hide();
    }

    //** Método para enviar los datos al simulsoft**//
    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify(
          $translate.getTranslationTable()
        );
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
      } else {
        UIkit.modal("#modalReportError").show();
      }
    }
    //** Método para validar si los campos requeridos se encuentran llenos para hacer la busqueda**//
    function searchtype() {
      vm.basicTree = [];
      if (vm.typeresport.id === 1) {
        if (vm.record === "") {
          return true;
        } else {
          vm.getseach();
        }
      }
      if (vm.typeresport.id === 2) {
        if (vm.datasex.id === undefined || vm.datasex.id === -1) {
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
          return true;
        } else {
          setTimeout(function () {
            angular.element("#numberordersearch").select();
          }, 100);
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
      vm.basicTree = [];
      vm.loadingdata = true;
      if (vm.typeresport.id === 1) {
        if (vm.typedocument) {
          vm.documentType.id =
            vm.documentType.id === undefined ? -1 : vm.documentType.id;
        } else {
          vm.documentType.id =
            vm.documentType.id === undefined ? 1 : vm.documentType.id;
        }

        if (vm.days.id === 1) {
          var init = moment().subtract("days", 30).format("YYYYMMDD");
          var end = moment().format("YYYYMMDD");
        }
        if (vm.days.id === 2) {
          var init = moment().subtract("days", 60).format("YYYYMMDD");
          var end = moment().format("YYYYMMDD");
        }
        if (vm.days.id === 3) {
          var init = 0;
          var end = 0;
        }
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return deliveryofresultDS
          .searchpatienid(
            auth.authToken,
            vm.record,
            vm.documentType.id,
            init,
            end
          )
          .then(
            function (data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                vm.basicTree =
                  data.data.length === 0 ? [] : vm.treepatient(data);
              } else {
                logger.success($filter("translate")("0392"));
              }
            },
            function (error) {
              vm.loadingdata = false;
              vm.modalError(error);
            }
          );
      }

      if (vm.typeresport.id === 2) {
        if (vm.days.id === 1) {
          var init = moment().subtract("days", 30).format("YYYYMMDD");
          var end = moment().format("YYYYMMDD");
        }
        if (vm.days.id === 2) {
          var init = moment().subtract("days", 60).format("YYYYMMDD");
          var end = moment().format("YYYYMMDD");
        }
        if (vm.days.id === 3) {
          var init = 0;
          var end = 0;
        }

        if (
          vm.name.trim() === "" &&
          vm.name1.trim() === "" &&
          vm.lastname.trim() === "" &&
          vm.surname.trim() === "" &&
          vm.sex
        ) {
          vm.loadingdata = false;
          return false;
        }

        var lastNameToSearch = vm.lastname === "" ? "undefined" : vm.lastname;
        var surNameToSearch = vm.surname === "" ? "undefined" : vm.surname;
        var nameToSearch = vm.name === "" ? "undefined" : vm.name;
        var name1ToSearch = vm.name1 === "" ? "undefined" : vm.name1;

        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return deliveryofresultDS
          .searchlastname(
            auth.authToken,
            lastNameToSearch,
            surNameToSearch,
            vm.datasex.id,
            init,
            end
          )
          .then(
            function (data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                vm.basicTree =
                  data.data.length === 0 ? [] : vm.treepatient(data);
              } else {
                logger.success($filter("translate")("0392"));
              }
            },
            function (error) {
              vm.modalError(error);
              vm.loadingdata = false;
            }
          );
      }

      if (vm.typeresport.id === 3) {
        var init = moment(vm.dateseach).format("YYYYMMDD");
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return deliveryofresultDS.searchdates(auth.authToken, init, init).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.basicTree = data.data.length === 0 ? [] : vm.treepatient(data);
            } else {
              logger.success($filter("translate")("0392"));
            }
          },
          function (error) {
            vm.modalError(error);
            vm.loadingdata = false;
          }
        );
      }
      if (vm.typeresport.id === 4) {
        var order = vm.listYear.id + vm.codeordernumberorden;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return deliveryofresultDS.searchorders(auth.authToken, order).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.basicTree = data.data.length === 0 ? [] : vm.treepatient(data);
            } else {
              logger.success($filter("translate")("0392"));
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }

      if (vm.typeresport.id === 5) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var orders = {
          orders: vm.selectedIds,
          user: {
            id: auth.id,
          },
          receivesPerson: vm.receiveresults,
        };
        return deliveryofresultDS.deliveryresults(auth.authToken, orders).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.receiveresults = "";
              vm.selectedIds = [];
              logger.success(data.data + " " + $filter("translate")("0766"));
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }
    }
    //** Método para tratar el arreglo de busqueda para los hijos del arbol**//
    function treeorderadd(data) {
      var children = [];
      if (data.length === 1) {
        var object = {
          name: data[0].orderNumber,
          image: "images/folder.png",
        };
        children.push(object);
        children = _.orderBy(children, "name", "desc");
        return children;
      } else {
        data.forEach(function (value, key) {
          if (value.fatherOrder === 0) {
            var soon = $filter("filter")(
              data,
              {
                fatherOrder: value.orderNumber,
              },
              true
            );
            if (soon.length === 0) {
              var object = {
                name: value.orderNumber,
                image: "images/folder.png",
              };
              children.push(object);
            } else {
              var childrensoon = [];
              soon.forEach(function (value, key) {
                var object1 = {
                  name: value.orderNumber,
                  image: "images/folder-open.png",
                };
                childrensoon.push(object1);
              });

              var object = {
                name: value.orderNumber,
                image: "images/folder.png",
                children: _.orderBy(childrensoon, "name", "desc"),
              };
              children.push(object);
            }
          }
        });
        children = _.orderBy(children, "name", "desc");
        return children;
      }
    }
    //** Método para tratar el arreglo de busqueda para los padres del arbol**//
    function treepatient(data) {
      var basicTree = [];
      data.data = _.orderBy(data.data, "name1", "asc");
      data.data.forEach(function (value, key) {
        var children = treeorderadd(value.orders);
        var object1 = {
          name:
            value.name1 +
            " " +
            value.name2 +
            " " +
            value.lastName +
            " " +
            value.surName,
          image:
            value.photo === "" || value.photo === undefined
              ? "images/user1.png"
              : value.photo,
          children: children,
        };
        basicTree.push(object1);
      });
      return basicTree;
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
          var order = vm.listYear.id + vm.codeordernumberorden;
          vm.numberOrder = order;
          vm.getDetail();
          vm.searchtype();
        } else if (vm.codeordernumberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.codeordernumberorden;
          var order = vm.numberordensearch;
          vm.numberOrder = order;
          vm.getDetail();
          vm.searchtype();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    //** Método para completar el número de la orden y eliminarla en rango de la orden**//
    function keyselectrange($event) {
      vm.sumar = "";
      var keyCode =
        $event !== undefined ? $event.which || $event.keyCode : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.codeorder[0] === "-" && vm.codeorder.length < vm.cantdigit + 1) {
          vm.codeorder = vm.codeorder.replace("-", "");
          vm.codeorder = vm.codeorder === "" ? 0 : vm.codeorder;
          if (vm.codeorder.length === parseInt(vm.orderdigit) + 1) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + "0" + vm.codeorder;
          } else if (vm.codeorder.length === parseInt(vm.orderdigit) + 2) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + vm.codeorder;
          } else if (vm.codeorder.length === parseInt(vm.orderdigit) + 3) {
            vm.numberordensearch = vm.listYear.id + "0" + vm.codeorder;
          } else {
            vm.numberordensearch =
              vm.listYear.id +
              common.getOrderComplete(vm.codeorder, vm.orderdigit).substring(4);
          }
          vm.codeorder = vm.numberordensearch.substring(4);
          vm.removeorder();
        } else if (
          vm.codeorder[0] === "-" &&
          vm.codeorder.length === vm.cantdigit + 1
        ) {
          vm.codeorder = vm.codeorder.replace("-", "");
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.removeorder();
        } else if (vm.codeorder.length < vm.cantdigit) {
          vm.codeorder = vm.codeorder === "" ? 0 : vm.codeorder;

          if (vm.codeorder.length === parseInt(vm.orderdigit) + 1) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + "0" + vm.codeorder;
          } else if (vm.codeorder.length === parseInt(vm.orderdigit) + 2) {
            vm.numberordensearch =
              vm.listYear.id + moment().format("MM") + vm.codeorder;
          } else if (vm.codeorder.length === parseInt(vm.orderdigit) + 3) {
            vm.numberordensearch = vm.listYear.id + "0" + vm.codeorder;
          } else {
            vm.numberordensearch =
              vm.listYear.id +
              common.getOrderComplete(vm.codeorder, vm.orderdigit).substring(4);
          }
          vm.codeorder = vm.numberordensearch.substring(4);
          vm.addorder();
        } else if (vm.codeorder.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.addorder();
        }
      } else {
        if (
          (!(keyCode >= 48 && keyCode <= 57) && keyCode != 45) ||
          (!(keyCode >= 48 && keyCode <= 57) && vm.codeorder.indexOf("-") >= 0)
        ) {
          $event.preventDefault();
        }
      }
    }
    //** Método para adicionar la orden al arreglo de rango**//
    function addorder() {
      vm.sumar = vm.listYear.id + vm.codeorder;
      var object = {
        id: vm.sumar,
        name: vm.sumar,
      };
      vm.orderselect.push(object);
      vm.listorderselect = new kendo.data.DataSource({
        data: vm.orderselect,
      });
      vm.sumar = parseInt(vm.listYear.id + vm.codeorder);
      vm.selectedIds.push(vm.sumar);
      vm.codeorder = "";
    }
    //** Método para eliminar la orden al arreglo de rango**//
    function removeorder() {
      vm.sumar = parseInt(vm.listYear.id + vm.codeorder);
      vm.findIndex = vm.selectedIds.indexOf(vm.sumar);
      vm.codeorder = "";
      if (vm.findIndex >= 0) {
        vm.selectedIds.splice(vm.findIndex, 1);
      }
    }
    //** Método para obtener lista de años**//
    function getListYear() {
      vm.gettypedocument();
      vm.listYear = common.getListYear();
      vm.listYear.id = moment().year();
    }
    //** Método para obtener lista de género **//
    function getsex() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return listDS.getList(auth.authToken, 6).then(
        function (data) {
          vm.getListYear();
          if (data.status === 200) {
            data.data.forEach(function (value, key) {
              if ($filter("translate")("0000") === "esCo") {
                data.data[key].name = value.esCo;
              } else {
                data.data[key].name = value.enUsa;
              }
            });
            vm.sex = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método para obtener lista tipo de documento**//
    function gettypedocument() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return documenttypesDS.getstatetrue(auth.authToken).then(
        function (data) {
          vm.getlist();
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.documentTypelist = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    vm.getlist = getlist;
    //** Método para obtener lista tipo de documento**//
    function getlist() {
      vm.datalist = [
        {
          id: 0,
          enUsa: "All",
          esCo: "Todos",
        },
        {
          id: 1,
          enUsa: "Print",
          esCo: "Impreso",
        },
        {
          id: 2,
          enUsa: "Pdf",
          esCo: "Pdf",
        },
        {
          id: 3,
          enUsa: "Email",
          esCo: "Correo",
        },
        {
          id: 4,
          enUsa: "Web query",
          esCo: "Consulta Web",
        },
      ];
      vm.selectdatalis = 0;
    }
    //** Método para la consulta de los detalles de las pruebas**//
    function getDetail() {
      vm.loadingdata = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var order = {
        filterId: 1,
        firstOrder: vm.numberOrder,
        lastOrder: vm.numberOrder,
        testList: [],
        userId: auth.id,
      };
      return resultsentryDS.getTestByOrderId(auth.authToken, order).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.listtest = _.groupBy(data.data, "profileId");
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    //** Método para mostrar la ventana modal de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que valida el cambio de tab**//
    function changetab(tab) {
      if (tab !== 1) {
        vm.basicTree = [];
        vm.typeresport.id = 1;
        vm.days.id = 1;
        vm.record = "";
        vm.documentType = [];
      }
      vm.listtest = [];
      vm.report = false;
      vm.tabselect = tab;
      vm.tab = tab === 1 ? true : false;
      vm.flange = tab;
    }
    //** Método para preparar el JSON para guardar**//
    function removeDatasave(data) {
      vm.listtest.forEach(function (value, key) {
        value.id = value.testId;
      });
    }
    //** Método para entregar las pruebas**//
    function save() {
      vm.removeDatasave();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var orders = {
        orders: [vm.numberOrder],
        user: {
          id: auth.id,
        },
        receivesPerson: vm.receiveresultspopup,
        resultTest: vm.listtest,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return deliveryofresultDS.deliveryresults(auth.authToken, orders).then(
        function (data) {
          if (data.status === 200) {
            vm.listtest = [];
            vm.receiveresultspopup = "";
            logger.success(data.data + " " + $filter("translate")("0766"));
            vm.getseach();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método  para  consulta los datos para informes entregados**//
    function Filedeliveryresults() {
      vm.report = true;
      vm.ListOrder = [];
      var consult = {
        rangeType: vm.filterRange,
        init: vm.rangeInit2,
        end: vm.rangeEnd2,
        demographics: vm.demographics,
        groupProfiles: vm.groupProfilesDelivery,
        typeDelivery: vm.selectdatalis,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return deliveryofresultDS
        .getdeliveryresults(auth.authToken, consult)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.ListOrder = data.data.length === 0 ? [] : removeData(data);
            } else {
              vm.report = false;
              vm.datareport = [];
              vm.windowOpenReport();
            }
            //console.log(data);
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function removetest(data) {
      var listtestfinal = [];
      data.forEach(function (value, key) {
        switch (value.idMediumDelivery) {
          case 1:
            value.idMediumDelivery = "IMPRESO";
            break;
          case 2:
            value.idMediumDelivery = "PDF";
            break;
          case 3:
            value.idMediumDelivery = "EMAIL";
            break;
          case 4:
            value.idMediumDelivery = "CONSULTA WEB";
            break;
        }

        vm.formathour =
          vm.formatDateAge.substring(0, vm.formatDateAge.length) + ", HH:mm:ss";
        data[key].date = moment(data[key].date).format(vm.formathour);

        if (vm.groupProfilesDelivery) {
          if (value.idProfile > 0) {
            var test = _.filter(listtestfinal, function (o) {
              return (
                o.idTest === value.idProfile &&
                o.countPrint === value.countPrint
              );
            });
            if (test.length > 0) {
              var index = listtestfinal.findIndex(function (item) {
                return (
                  item.idTest === value.idProfile &&
                  item.countPrint === value.countPrint
                );
              });

              test[0].receivesPerson =
                value.receivesPerson + "," + test[0].receivesPerson;
              var concatreceivesPerson = test[0].receivesPerson.split(",");
              test[0].receivesPerson = _.uniq(concatreceivesPerson).toString();

              test[0].idMediumDelivery =
                value.idMediumDelivery + "," + test[0].idMediumDelivery;
              var concatmedium = test[0].idMediumDelivery.split(",");
              test[0].idMediumDelivery = _.uniq(concatmedium).toString();

              if (moment(value.date).isSameOrBefore(moment(test[0].date))) {
                test[0].date = value.date;
              }

              listtestfinal[index] = test[0];
            } else {
              value.countPrint = value.countPrint;
              value.idTest = value.idProfile;
              value.codeTest = value.codeProfile;
              value.nameTest = value.nameProfile;
              listtestfinal.push(value);
            }
          } else {
            listtestfinal.push(value);
          }
        } else {
          listtestfinal.push(value);
        }
      });
      // console.log(data);
      return listtestfinal;
    }
    //** Método  para  preparar el JSON consulta los datos para informes entregados**//
    function removeData(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        vm.formathour =
          vm.formatDateAge.substring(0, vm.formatDateAge.length) + ", HH:mm:ss";
        value.date = moment(value.date).format(vm.formathour);
        data.data[key].username = auth.userName;

        value.createdDate = moment(value.createdDate).format(
          vm.formatDateAge + ", HH:mm:ss"
        );

        value.comment = "";
        if (
          value.comments !== null &&
          value.comments !== undefined &&
          value.comments.length > 0
        ) {
          for (var i = 0; i < value.comments.length; i++) {
            var firshC = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content.substring(0, 1);
            var pos = firshC == '"' ? 1 : 0;
            var cont = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content;
            value.comments[i].comment = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content.substring(pos, cont.length - pos);
            try {
              value.comment =
                (value.comment === "" ? +"" : +"<br/>") +
                JSON.parse(value.comments[i].comment);
            } catch (e) {
              value.comment =
                (value.comment === "" ? +"" : +"<br/>") +
                "<br/>" +
                value.comments[i].comment;
            }
          }
        }

        data.data[key].tests = vm.removetest(data.data[key].tests);
      });
      console.log(data);
      vm.datareport = data.data;
      vm.variables = {
        rangeInit:
          vm.filterRange == "0"
            ? moment(vm.rangeInit2).format(vm.formatDateAge)
            : vm.rangeInit2,
        rangeEnd:
          vm.filterRange == "0"
            ? moment(vm.rangeEnd2).format(vm.formatDateAge)
            : vm.rangeEnd2,
        rangeType: vm.filterRange,
        username: auth.userName,
        date: moment().format(vm.formatDateAge),
      };
      vm.pathreport =
        "/Report/reportsandconsultations/deliveryresults/deliveryresults.mrt";
      vm.report = false;
      vm.windowOpenReport();
    }
    //** Método  para  consulta los datos para informes pendientes de entrega**//
    function Fileresultspending() {
      vm.ListOrder = [];
      var consult = {
        rangeType: vm.filterRangePending === "0" ? "3" : vm.filterRangePending,
        init: vm.rangeInit,
        end: vm.rangeEnd,
      };

      var filter = {
        rangeType: vm.filterRangePending === "0" ? "3" : vm.filterRangePending,
        init: vm.rangeInit,
        end: vm.rangeEnd,
        orderType: 0,
        filterState: [5],
        demographics: [],
        testFilterType: null,
        tests: [],
        groupProfiles: vm.groupProfilesPending,
        resultState: [0],
        userId: 0,
      };

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reviewofresultDS.getresultspending(auth.authToken, filter).then(
        function (data) {
          if (data.status === 200) {
            vm.ListOrder =
              data.data.length === 0 ? [] : removeDatapending(data);
          } else {
            vm.report = false;
            vm.datareport = [];
            vm.windowOpenReport();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método  para  preparar el JSON consulta los datos para informes pendientes de entrega**//
    function removeDatapending(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      data.data.forEach(function (value, key) {
        value.createdDate = moment(value.createdDate).format(
          vm.formatDateAge + ", HH:mm:ss"
        );

        value.patient.sex =
          $filter("translate")("0000") === "enUsa"
            ? value.patient.sex.enUsa
            : value.patient.sex.esCo;
        value.patient.birthday = common.getAgeAsString(
          moment(value.patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge
        );

        if (value.allDemographics.length > 0) {
          value.allDemographics.forEach(function (value2) {
            value["demo_" + value2.idDemographic + "_name"] =
              value2.demographic;
            value["demo_" + value2.idDemographic + "_value"] =
              value2.encoded === false
                ? value2.notCodifiedValue
                : value2.codifiedName;
          });
        }
        value.comment = "";
        // value.comments = $filter('filter')(value.comments, { print: true });
        if (value.comments.length > 0) {
          for (var i = 0; i < value.comments.length; i++) {
            // value.comments[i].comment = JSON.parse(value.comments[i].comment).content.replace(/span/g, 'font').replace(/'/g, '"');
            var firshC = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content.substring(0, 1);
            var pos = firshC == '"' ? 1 : 0;
            var cont = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content;
            value.comments[i].comment = JSON.parse(
              value.comments[i].comment.replace(/'/g, '"')
            ).content.substring(pos, cont.length - pos);
            try {
              value.comment =
                (value.comment === "" ? +"" : +"<br/>") +
                JSON.parse(value.comments[i].comment);
            } catch (e) {
              value.comment =
                (value.comment === "" ? +"" : +"<br/>") +
                "<br/>" +
                value.comments[i].comment;
            }
          }
        }

        var filterstate = null;
        filterstate = _.filter(value.tests, function (o) {
          return o.result.state === 0;
        });
        value.testconcat0 = _.uniq(_.map(filterstate, "abbr")).toString();

        filterstate = _.filter(value.tests, function (o) {
          return o.result.state === 1;
        });
        value.testconcat1 = _.uniq(_.map(filterstate, "abbr")).toString();

        filterstate = _.filter(value.tests, function (o) {
          return o.result.state === 2;
        });
        value.testconcat2 = _.uniq(_.map(filterstate, "abbr")).toString();

        filterstate = _.filter(value.tests, function (o) {
          return o.result.state === 3;
        });
        value.testconcat3 = _.uniq(_.map(filterstate, "abbr")).toString();

        filterstate = _.filter(value.tests, function (o) {
          return o.result.state === 4;
        });
        value.testconcat4 = _.uniq(_.map(filterstate, "abbr")).toString();

        for (var i = 0; i < value.tests.length; i++) {
          if (value.tests[i].hasTemplate === false) {
            value.tests[i].optionsTemplate = [
              {
                idTest: value.tests[i].testId,
                order: value.orderNumber,
                option: null,
              },
            ];
          }
          value.tests[i].hasObservationResult =
            value.tests[i].hasComment === true
              ? true
              : value.tests[i].hasTemplate === true
              ? true
              : false;
          value.tests[i].tentativeDeliveryDate = moment(
            value.tests[i].tentativeDeliveryDate
          ).format(vm.formatDateAge + ", HH:mm:ss");
        }
      });

      vm.datareport = data.data;

      vm.variables = {
        rangeInit: vm.rangeInit,
        rangeEnd: vm.rangeEnd,
        rangeType: vm.filterRange,
        username: auth.userName,
        date: moment().format(vm.formatDateAge),
      };
      vm.pathreport =
        "/Report/reportsandconsultations/deliveryresultspending/deliveryresultspending.mrt";
      vm.report = false;
      vm.windowOpenReport();
    }

    function openPrint() {
      UIkit.modal("#modalPrint").show();
    }

    $rootScope.$watch("ipUser", function () {
      vm.ipUser = $rootScope.ipUser;
    });

    function generateDataReport(data) {
      var dataReport = [];
      var language = $filter("translate")("0000");
      vm.numTests = 0;
      vm.testPrinted = [];
      if (data.length === 0) {
        return dataReport;
      }
      vm.dataAttachmentsPDF = [];
      for (var copie = 1; copie <= vm.quantityCopies; copie++) {
        vm.dataAttachmentsImage = [];
        data.forEach(function (value, key) {
          switch (vm.namePdfHistory) {
            case "1":
              vm.patient = vm.numberOrder.toString();
              break;
            case "2":
              vm.patient =
                vm.numberOrder.toString() + "_" + value.patient.patientId;
              break;
            case "3":
              vm.patient =
                vm.numberOrder.toString() +
                "_" +
                value.patient.name1 +
                "_" +
                value.patient.name2 +
                "_" +
                value.patient.lastName +
                "_" +
                value.patient.surName;
              break;
            case "4":
              vm.patient =
                value.patient.patientId + "_" + vm.numberOrder.toString();
              break;
            case "5":
              vm.patient =
                value.patient.name1 +
                "_" +
                value.patient.name2 +
                "_" +
                value.patient.lastName +
                "_" +
                value.patient.surName +
                "_" +
                vm.numberOrder.toString();
              break;
            default:
              vm.patient = vm.numberOrder.toString();
              break;
          }
          // Archivos adjuntos
          if (vm.attachments) {
            value.attachments.forEach(function (file, index) {
              // Archivos adjuntos de PDF
              if (file.extension === "pdf") {
                var codeNameTest =
                  file.idTest !== null
                    ? $filter("filter")(
                        value.tests,
                        {
                          id: file.idTest,
                        },
                        true
                      )[0].code + "_"
                    : "";
                var blobPDF = converBase64toBlob(file.file, "application/pdf");
                vm.dataAttachmentsPDF.push({
                  idOrder: file.idOrder,
                  idTest: file.idTest,
                  fileType: file.fileType,
                  name:
                    file.idOrder.toString() + "_" + codeNameTest + file.name,
                  file: blobPDF,
                });
              } else {
                //Archivos adjuntos de imagen
                var codeNameTest =
                  file.idTest !== null
                    ? $filter("filter")(
                        value.tests,
                        {
                          id: file.idTest,
                        },
                        true
                      )[0].code +
                      " | " +
                      $filter("filter")(
                        value.tests,
                        {
                          id: file.idTest,
                        },
                        true
                      )[0].name
                    : "";
                var descriptionOrder =
                  $filter("translate")("0585") + ": " + file.idOrder.toString();
                var descriptionTest =
                  $filter("translate")("0586") + ": " + codeNameTest;
                vm.dataAttachmentsImage.push({
                  idOrder: file.idOrder,
                  idTest: file.idTest,
                  fileType:
                    file.idTest === null ? descriptionOrder : descriptionTest,
                  name: file.name,
                  file: "data:" + file.fileType + ";base64," + file.file,
                });
              }
            });
          }

          //Comentarios de la orden
          vm.commentsOrder = [];
          var content = "";
          if (value.comments.length > 0) {
            value.comments.forEach(function (valueCont) {
              var firshC = JSON.parse(
                valueCont.comment.replace(/'/g, '"')
              ).content.substring(0, 1);
              var pos = firshC == '"' ? 1 : 0;
              var cont = JSON.parse(
                valueCont.comment.replace(/'/g, '"')
              ).content;
              content +=
                JSON.parse(
                  valueCont.comment.replace(/'/g, '"')
                ).content.substring(pos, cont.length - pos) + "<br/><br/>";
              vm.commentsOrder.push({
                content: valueCont.comment,
                order: valueCont.idRecord,
              });
            });
            vm.commentsOrder[0].content = content
              .replace(/span/g, "font")
              .replace(/<div>/g, "<br/>");
          } else {
            vm.commentsOrder.push({
              content: "",
              order: value.orderNumber,
            });
          }
        });
      }
      return dataReport;
    }

    function controlDeliveryReports(prmfilterprint) {
      vm.loadingdata = true;
      var json = vm.jsonPrint(prmfilterprint);
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reportsDS
        .getOrderHeader(auth.authToken, json)
        .then(function (data) {
          vm.datareport = vm.generateDataReport(data.data);
          vm.variables = {
            customer: vm.customer,
            rangeInit: vm.numberOrder,
            rangeEnd: vm.numberOrder,
            username: auth.userName,
            titleReport: $filter("translate")("0375"),
            now: moment().format(vm.formatDate + " HH:mm:ss"),
            countOrders: $filter("translate")("0100") + ": " + vm.numOrders,
            countTests: $filter("translate")("0101") + ": " + vm.numTests,
          };
          vm.pathreport =
            "/Report/reportsandconsultations/controldeliveryreports/controldeliveryreports.mrt";
          vm.openreport = false;
          vm.loadingdata = false;
          if (vm.destination == "1") {
            vm.loadingdata = false;
            vm.windowOpenReport();
          } else {
            vm.loadingdata = false;
            if (vm.datareport.length > 0) {
              var dataReportHead = [];
              dataReportHead.push({
                orderNumber: vm.numberOrder,
                nameReport: vm.patient + ".pdf",
                reportDetail: vm.datareport,
                attachmentsPDF: $filter("filter")(
                  vm.dataAttachmentsPDF,
                  {
                    idOrder: vm.numberOrder,
                  },
                  true
                ),
              });
              var parameterReport = {
                pathreport: vm.pathreport,
                datareport: dataReportHead,
                variables: vm.variables,
                token: auth.authToken,
                labelsreport: $translate.getTranslationTable(),
                ip: vm.ipUser,
              };

              reportadicional.saveReportPdf(
                parameterReport,
                vm.patient + ".pdf"
              );
            } else {
              vm.loadingdata = false;
              UIkit.modal("#modalReportError").show();
            }
          }
        });
    }

    function jsonPrint(prmfilterprint) {
      var listTest = [];
      vm.listtest.forEach(function (value) {
        listTest.push(value.testId);
      });
      vm.attachments = prmfilterprint.attachments;
      vm.typePrint = prmfilterprint.typeprint;
      vm.filterDemo = prmfilterprint.filterdemo;
      vm.historySend = prmfilterprint.historysend;
      vm.ordersSend = prmfilterprint.orderssend;
      vm.quantityCopies = prmfilterprint.quantitycopies;
      vm.orderingPrint = prmfilterprint.orderingprint;

      var json = {
        rangeType: 1,
        init: vm.numberOrder,
        end: vm.numberOrder,
        orderType: 0,
        check: null,
        testFilterType: 2,
        tests: listTest,
        demographics: [],
        packageDescription: false,
        listType: 0,
        laboratories: [],
        apply: true,
        samples: [],
        printerId: vm.ipUser,
        printAddLabel: true,
        basic: true,
        reprintFinalReport: false,
        attached: vm.attachments,
        typeReport: 3,
        numberCopies: vm.quantityCopies,
        serial: prmfilterprint.serial,
        printingType: 1,
      };
      var str_json = JSON.stringify(json);
      return json;
    }

    function converBase64toBlob(content, contentType) {
      contentType = contentType || "";
      var sliceSize = 512;
      var byteArrays = [];
      var byteCharacters = window.atob(content); //method which converts base64 to binary
      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      var blob = new Blob(byteArrays, {
        type: contentType,
      }); //statement which creates the blob
      return blob;
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
      vm.getsex();
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
