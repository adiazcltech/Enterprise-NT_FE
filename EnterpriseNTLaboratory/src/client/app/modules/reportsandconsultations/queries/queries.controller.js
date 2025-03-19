/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.queries")
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ])
    .controller("QueriesController", QueriesController);

  QueriesController.$inject = [
    "common",
    "areaDS",
    "branchDS",
    "$scope",
    "listDS",
    "testDS",
    "documenttypesDS",
    "demographicDS",
    "LZString",
    "$translate",
    "demographicsItemDS",   
    "queriesDS",
    "reportsDS",
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "resultsentryDS",
  ];

  function QueriesController(
    common,
    areaDS,
    branchDS,
    $scope,
    listDS,
    testDS,
    documenttypesDS,
    demographicDS,
    LZString,
    $translate,
    demographicsItemDS,  
    queriesDS,
    reportsDS,
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    resultsentryDS
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "Queries";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0033");
    $rootScope.helpReference = "04.reportsandconsultations/queries.htm";
    vm.filterRange = 2;
    vm.isOpenReport = true;
    vm.testprocces = "3";
    vm.rangeInit = "";
    vm.rangeEnd = "";
    vm.selectedIds = [];
    vm.changetab = changetab;
    vm.PopupError = false;
    vm.modalError = modalError;
    $rootScope.pageview = 3;
    vm.tab = true;
    vm.formatDate =
      localStorageService.get("FormatoFecha").toUpperCase() + ", HH:mm:ss";
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.typedocument = localStorageService.get("ManejoTipoDocumento");
    vm.typedocument =
      vm.typedocument === "True" || vm.typedocument === true ? true : false;
    vm.historyautomatic = localStorageService.get("HistoriaAutomatica");
    vm.yearquery = localStorageService.get("AniosConsultas");
    vm.historyautomatic =
      vm.historyautomatic === "True" || vm.historyautomatic === true
        ? true
        : false;
    vm.dateseach = moment().format();
    vm.max = moment().format();
    vm.getsex = getsex;
    vm.getListYear = getListYear;
    vm.listYear = [];
    vm.typeresport = [];
    vm.destination = "1";
    vm.days = [];
    vm.orderdigit = localStorageService.get("DigitosOrden");
    vm.cantdigit = parseInt(vm.orderdigit) + 4;
    vm.keyselect = keyselect;
    vm.codeorder = "";
    vm.codeordernumberorden = "";
    vm.progressReport = false;
    vm.isOpenReport = true;
    vm.isOpenReport1 = true;
    vm.printhistory = printhistory;
    vm.Graph = Graph;
    vm.orderselect = [];
    vm.gettypedocument = gettypedocument;
    vm.ListOrder = [];
    vm.getseach = getseach;
    vm.documentType = [];
    vm.consultpatient = [];
    vm.getDetail = getDetail;
    vm.listtest = [];
    vm.destailorden = [];
    vm.receiveresults = "";
    vm.disable = disable;
    vm.record = "";
    vm.lastname = "";
    vm.datasex = [];
    vm.receiveresultspopup = "";
    vm.changefilter = changefilter;
    vm.removetest = removetest;
    vm.getArea = getArea;
    vm.getBranch = getBranch;
    vm.keyselectpatientid = keyselectpatientid;
    vm.getdemograficchange = getdemograficchange;
    vm.removeDatademografic = removeDatademografic;
    vm.getDemographicsItems = getDemographicsItems;
    vm.demograficdesencored = "";
    vm.loading = false;
    vm.gettest = gettest;
    vm.idpatientfortest = idpatientfortest;
    vm.selectedTest = null;
    vm.record1 = "";
    vm.keyspatientidenter = keyspatientidenter;
    vm.getseachpatientidtest = getseachpatientidtest;
    vm.numberOrder = 0;
    vm.labelresult = $filter("translate")("0413");
    vm.Fileresultspending = Fileresultspending;
    vm.jsonPrint = jsonPrint;
    vm.generateDataReport = generateDataReport;
    vm.windowOpenReport = windowOpenReport;
    vm.jsonPrint = jsonPrint;
    vm.controlDeliveryReports = controlDeliveryReports;
    vm.getseachlastnamemonth = getseachlastnamemonth;
    vm.accumulationOrder = accumulationOrder;
    vm.seachlastname = seachlastname;
    vm.basicTree = [];

    vm.documentType1 = { id: 0 };

    $rootScope.$watch("ipUser", function () {
      vm.ipUser = $rootScope.ipUser;
    });

    vm.typeresport = [
      { id: 1, name: $filter("translate")("0117") }, // historia
      { id: 2, name: $filter("translate")("0134") }, // Apellido
      { id: 3, name: $filter("translate")("0410") }, // Fecha
      { id: 4, name: $filter("translate")("0061") }, // Orden
      { id: 5, name: $filter("translate")("0083") }, // demografico
    ];
  
    vm.predicate = "";
    vm.reverse = false;

    vm.typeresport.id = 4;

    vm.showSelected = showSelected;
    function showSelected(node) {
      if (node.children === undefined) {
        vm.numberOrder = node.name;
        vm.getDetail();
        vm.isOpenReport = false;
      }
    }
    function changefilter() {
      vm.documentType.id = -1;
      vm.record = "";
      vm.lastname = "";
      vm.basicTree = [];
      vm.listtest = [];
      vm.listtestgroup = [];
      vm.lisArea.id = -1;
      vm.listranch.id = -1;
      vm.numberOrder = 0;
      vm.demografic.id = -1;
      vm.demografic.encoded = true;
      vm.getDemographicsItems();
      vm.codeordernumberorden = "";
      vm.isOpenReport = true;
    }
    //** Metodo para obtener todos los demograficos**//
    function getdemograficchange() {
      vm.demograficdesencored = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getDemographicsALL(auth.authToken).then(
        function (data) {
          vm.lisdemografic =
            data.data.length === 0 ? data.data : removeDatademografic(data);
          vm.getDemographicsItems();
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo para obtener todos las pruebas**//
    function gettest() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(
        function (data) {
          if (vm.typedocument) {
            vm.gettypedocument();
          } else {
            vm.getArea();
          }

          vm.listselecttest =
            data.data.length === 0 ? data.data : removetest(data);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo para remover los datos que sobran de la prueba**//
    function removetest(data) {
      var testItems = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.code + " - " + value.name,
          resultType: value.resultType,
        };
        testItems.push(object);
      });
      return testItems;
    }
    //** Metodo que construlle el arreglo para el combo demograficos**//
    function removeDatademografic(data) {
      vm.demografic = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        switch (value.id) {
          case -1:
            value.name = $filter("translate")("0085");
            break;
          case -2:
            value.name = $filter("translate")("0086");
            break;
          case -3:
            value.name = $filter("translate")("0087");
            break;
          case -4:
            value.name = $filter("translate")("0088");
            break;
          case -6:
            value.name = $filter("translate")("0090");
            break;
          case -7:
            value.name = $filter("translate")("0091");
            break;
          default:
            value.name = value.name;
        }
        if (!(value.id === -166 || value.id === -111 || value.id === -10)) {
          var object = {
            id: value.id,
            name: value.name,
            encoded: value.encoded,
          };
          vm.demografic.push(object);
        }
      });
      vm.demografic.id = -1;
      vm.demografic.encoded = true;
      return vm.demografic;
    }
    //** Metodo para obtener todos los demograficos item**//
    function getDemographicsItems() {
      if (vm.typeresport.id === 3) {
        vm.loading = true;
      }      
      vm.demograficdesencored = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicsItemDS
        .getDemographicsItemsAll(auth.authToken, 0, vm.demografic.id)
        .then(
          function (data) {
            vm.getsex();
            vm.lisdemograficitems =
              data.data.length === 0
                ? data.data
                : removeDemographicsItems(data);
            vm.disable();
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    function removeDemographicsItems(data) {
      var DemographicsItems = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.demographicItem.id,
          name: value.demographicItem.name,
        };
        DemographicsItems.push(object);
      });
      return DemographicsItems;
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
                nameReport: vm.numberOrder.toString() + vm.patient + ".pdf",
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
                vm.numberOrder.toString() + vm.patient + ".pdf"
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
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return areaDS.getAreasActive(auth.authToken).then(
        function (data) {
          vm.getBranch();
          if (data.status === 200) {
            data.data[0] = {
              id: -1,
              name: $filter("translate")("0353"),
            };
            vm.lisArea = data.data;
            vm.lisArea.id = -1;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que construlle el arreglo de las sedes activas**//
    function removeBranch(data) {
      var Branch = [];
      data.data.forEach(function (value, key) {
        var object = { id: value.id, name: value.name };
        Branch.push(object);
      });
      var object = { id: -1, name: $filter("translate")("0353") };
      Branch.push(object);

      return Branch;
    }
    //** Metodo para obtener las sedes activas**//
    function getBranch() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return branchDS.getBranchActive(auth.authToken).then(
        function (data) {
          vm.getdemograficchange();
          if (data.status === 200) {
            vm.listranch =
              data.data.length === 0 ? data.data : removeBranch(data);
            vm.listranch.id = -1;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function removeconsultpatient(data) {
      var basicTree = [];
      for (var propiedad in data) {
        if (data.hasOwnProperty(propiedad)) {
          var children = [];
          if (data[propiedad].length === 1) {
            var object = {
              name: data[propiedad][0].orderNumber,
              image: "images/folder.png",
            };
            children.push(object);
            var name1 =
              data[propiedad][0].patient.name1 === undefined
                ? ""
                : data[propiedad][0].patient.name1;
            var name2 =
              data[propiedad][0].patient.name2 === undefined
                ? ""
                : data[propiedad][0].patient.name2;
            var lastName =
              data[propiedad][0].patient.lastName === undefined
                ? ""
                : data[propiedad][0].patient.lastName;

            var object1 = {
              name: name1 + " " + name2 + " " + lastName,
              image:
                data[propiedad][0].patient.photo === "" ||
                data[propiedad][0].patient.photo === undefined
                  ? "images/user1.png"
                  : data[propiedad][0].patient.photo,
              children: _.orderBy(children, ["name"], ["desc"]),
            };

            basicTree.push(object1);
          } else {
            data[propiedad].forEach(function (value, key) {
              if (value.fatherOrder === 0) {
                var soon = $filter("filter")(
                  data[propiedad],
                  { fatherOrder: value.orderNumber },
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
                    children: $filter("orderBy")(childrensoon, "name"),
                  };
                  children.push(object);
                }
              }
              if (value.fatherOrder === undefined) {
                var object = {
                  name: value.orderNumber,
                  image: "images/folder.png",
                };
                children.push(object);
              }
            });
            var name1 =
              data[propiedad][0].patient.name1 === undefined
                ? ""
                : data[propiedad][0].patient.name1;
            var name2 =
              data[propiedad][0].patient.name2 === undefined
                ? ""
                : data[propiedad][0].patient.name2;
            var lastName =
              data[propiedad][0].patient.lastName === undefined
                ? ""
                : data[propiedad][0].patient.lastName;
            var object1 = {
              name: name1 + " " + name2 + " " + lastName,
              image:
                data[propiedad][0].patient.photo === "" ||
                data[propiedad][0].patient.photo === undefined
                  ? "images/user1.png"
                  : data[propiedad][0].patient.photo,
              children: _.orderBy(children, ["name"], ["desc"]),
            };

            basicTree.push(object1);
          }
        }
      }
      return basicTree;
    }
    function idpatientfortest(itemtest) {
      if (
        vm.record1 === "" ||
        vm.documentType1 === undefined ||
        vm.selectedTest === null
      ) {
        return true;
      } else {
        vm.numberOrder = 0;
        vm.consultpatient = [];
        vm.getseachpatientidtest();
      }
    }
    function keyspatientidenter($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.idpatientfortest();
      }
    }
    function getseachpatientidtest() {
      vm.loading = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (vm.selectedTest !== undefined) {
        return queriesDS
          .getsearchtestidparient(
            auth.authToken,
            vm.record1,
            vm.documentType1.id,
            vm.selectedTest.id
          )
          .then(
            function (data) {
              if (data.status === 200) {
                vm.numberOrder =
                  data.data.length === 0 ? null : data.data[0].order;
                var listorder =
                  data.data.length === 0 ? data.data : changetime(data);
                vm.consultpatientgroup = _.groupBy(listorder, "areaName");
                vm.consultpatient = listorder;
              } else {
                logger.success($filter("translate")("0392"));
              }
              vm.loading = false;
            },
            function (error) {
              vm.modalError(error);
            }
          );
      } else {
        vm.loading = false;
      }
    }
    function changetime(data) {
      data.data.forEach(function (value, key) {
        value.validationDateFormat = value.validateDate;
        value.validationDate =
          value.validateDate === undefined
            ? null
            : moment(value.validateDate).format(vm.formatDate);
        value.entryDate =
          value.entryDate === undefined
            ? null
            : moment(value.entryDate).format(vm.formatDate);
        value.result =
          value.result === undefined
            ? $filter("translate")("0413")
            : value.result;
      });
      return data.data;
    }
    function disable() {
      vm.basicTree = [];
      vm.listtest = [];
      vm.numberOrder = null;
      //vm.demograficdesencored = '';
      if (vm.typeresport.id === 1) {
        var validatedtypedocument =
          vm.historyautomatic || vm.typedocument
            ? false
            : vm.documentType.id === undefined
            ? true
            : false;
        if (vm.record === "" || validatedtypedocument) {
          return true;
        } else {
          vm.getseachlastnamemonth();
        }
      }
      if (vm.typeresport.id === 2) {
        if (vm.lastname === "" || vm.datasex.id === undefined) {
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

      if (vm.typeresport.id === 5) {
        if (
          (vm.demografic.encoded && vm.lisdemograficitems.id === undefined) ||
          (!vm.demografic.encoded && vm.demograficdesencored === "")
        ) {
          return true;
        } else {
          vm.getseachlastnamemonth();
        }
      }
    }    
    function getseachlastnamemonth() {
      vm.basicTree = [];
      vm.loading = true;

      if (vm.typeresport.id === 1) {
        vm.documentType.id = vm.documentType.id === -1 ? 1 : vm.documentType.id;

        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }

        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }

        var searchconsult = {
          rangeType: 0,
          init: 0,
          end: 0,
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
          record: vm.record,
          documentType: vm.documentType.id,
          year: vm.listYear.id,
        };
      }
      if (vm.typeresport.id === 2) {
        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }

        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }
        var searchconsult = {
          rangeType: 0,
          init: 0,
          end: 0,
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
          lastName: vm.lastname,
          gender: vm.datasex.id,
          year: vm.listYear.id,
        };
      }
      if (vm.typeresport.id === 5) {
        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }

        if (vm.listranch.id === -1) {
          if (vm.demografic.encoded) {
            var searchconsult = {
              rangeType: null,
              init: null,
              end: null,
              demographics: [
                {
                  demographic: vm.demografic.id,
                  demographicItems: [vm.lisdemograficitems.id],
                },
              ],
              sections: vm.demographicarea,
            };
          } else {
            var searchconsult = {
              rangeType: null,
              init: null,
              end: null,
              demographics: [
                {
                  demographic: vm.demografic.id,
                  value: vm.demograficdesencored,
                },
              ],
              sections: vm.demographicarea,
              year: vm.listYear.id,
            };
          }
        } else {
          var searchconsult = {
            rangeType: null,
            init: null,
            end: null,
            demographics: [
              {
                demographic: -166,
                demographicItems: [vm.listranch.id],
              },
              {
                demographic: vm.demografic.id,
                demographicItems: [vm.lisdemograficitems.id],
              },
            ],
            sections: vm.demographicarea,
            year: vm.listYear.id,
          };
        }
      }

      if (moment().year() === vm.listYear.id && moment().month() === 0) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return queriesDS.getOrdersbyPatient(auth.authToken, searchconsult).then(
          function (data) {
            if (data.status === 200) {
              var data =
                data.data.length === 0
                  ? []
                  : _.groupBy(data.data, function (o) {
                      return o.patient.id;
                    });
              vm.basicTree = removeconsultpatient(data);
            } else {
              logger.success($filter("translate")("0392"));
            }
            vm.loading = false;
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        if (moment().year() === vm.listYear.id) {
          vm.listordenesunion = [];
          vm.firtDate = vm.listYear.id + "0101";
          vm.endDate = vm.listYear.id + moment().format("MMDD");
        } else {
          vm.listordenesunion = [];
          vm.firtDate = vm.listYear.id + "0101";
          vm.endDate = vm.listYear.id + "1231";
        }
        vm.accumulation = _.clone(searchconsult);
        // if (vm.accumulation.year !== undefined) {
        //   delete vm.accumulation.year;
        // }
        vm.accumulation.rangeType = 0;
        vm.accumulation.init = vm.firtDate;
        vm.accumulation.end = moment(vm.firtDate)
          .add(1, "months")
          .format("YYYYMMDD");
        vm.accumulationOrder();
      }
    }   
    function accumulationOrder() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return queriesDS.getOrdersbyPatient(auth.authToken, vm.accumulation).then(
        function (data) {
          vm.listordenesunion = _.union(
            vm.listordenesunion,
            data.data == "" ? [] : data.data
          );
          var firstDate = moment(vm.accumulation.end)
            .add(1, "days")
            .format("YYYYMMDD");
          var lastDate = moment(vm.accumulation.end)
            .add(1, "months")
            .format("YYYYMMDD");

          if (firstDate === vm.endDate) {
            vm.accumulation.init = firstDate;
            vm.accumulation.end = firstDate;
            vm.seachlastname(); // consulta
          } else if (lastDate > vm.endDate) {
            vm.accumulation.init = firstDate;
            vm.accumulation.end = vm.endDate;
            vm.seachlastname();
          } else {
            vm.accumulation.init = firstDate;
            vm.accumulation.end = lastDate;
            vm.accumulationOrder();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }   
    function seachlastname() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return queriesDS.getOrdersbyPatient(auth.authToken, vm.accumulation).then(
        function (data) {
          vm.listordenesunion = _.union(
            vm.listordenesunion,
            data.data == "" ? [] : data.data
          );
          if (vm.listordenesunion.length === 0) {
            logger.success($filter("translate")("0392"));
          } else {
            var data = _.groupBy(vm.listordenesunion, function (o) { return o.patient.id; });
            vm.basicTree = removeconsultpatient(data);
          }
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getseach() {
      vm.basicTree = [];
      vm.loading = true;
      if (vm.typeresport.id === 1) {
        vm.documentType.id = vm.documentType.id === -1 ? 1 : vm.documentType.id;
        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }
        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }

        var searchconsult = {
          rangeType: 0,
          init: 0,
          end: 0,
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
          record: vm.record,
          documentType: vm.documentType.id,
          year: vm.listYear.id,
        };
      }

      if (vm.typeresport.id === 2) {
        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }

        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }
        var searchconsult = {
          rangeType: 0,
          init: 0,
          end: 0,
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
          lastName: vm.lastname,
          gender: vm.datasex.id,
          year: vm.listYear.id,
        };
      }

      if (vm.typeresport.id === 3) {
        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }

        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }

        var searchconsult = {
          rangeType: 0,
          init: moment().format("YYYYMMDD"),
          end: moment().format("YYYYMMDD"),
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
        };
      }

      if (vm.typeresport.id === 4) {
        var order = vm.listYear.id + vm.codeordernumberorden;

        if (vm.listranch.id === -1) {
          vm.demographicorder = null;
        } else {
          vm.demographicorder = [
            {
              demographic: -166,
              demographicItems: [vm.listranch.id],
            },
          ];
        }

        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }
        var searchconsult = {
          rangeType: 1,
          init: order,
          end: order,
          demographics: vm.demographicorder,
          sections: vm.demographicarea,
          year: vm.listYear.id,
        };
      }

      if (vm.typeresport.id === 5) {
        if (vm.lisArea.id === -1) {
          vm.demographicarea = null;
        } else {
          vm.demographicarea = [vm.lisArea.id];
        }

        if (vm.listranch.id === -1) {
          if (vm.demografic.encoded) {
            var searchconsult = {
              rangeType: null,
              init: null,
              end: null,
              demographics: [
                {
                  demographic: vm.demografic.id,
                  demographicItems: [vm.lisdemograficitems.id],
                },
              ],
              sections: vm.demographicarea,
            };
          } else {
            var searchconsult = {
              rangeType: null,
              init: null,
              end: null,
              demographics: [
                {
                  demographic: vm.demografic.id,
                  value: vm.demograficdesencored,
                },
              ],
              sections: vm.demographicarea,
              year: vm.listYear.id,
            };
          }
        } else {
          var searchconsult = {
            rangeType: null,
            init: null,
            end: null,
            demographics: [
              {
                demographic: -166,
                demographicItems: [vm.listranch.id],
              },
              {
                demographic: vm.demografic.id,
                demographicItems: [vm.lisdemograficitems.id],
              },
            ],
            sections: vm.demographicarea,
            year: vm.listYear.id,
          };
        }
      }

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return queriesDS.getOrdersbyPatient(auth.authToken, searchconsult).then(
        function (data) {
          if (data.status === 200) {
            var data =
              data.data.length === 0
                ? []
                : _.groupBy(data.data, function (o) {
                    return o.patient.id;
                  });
            vm.basicTree = removeconsultpatient(data);
            if (vm.typeresport.id === 4) {
              vm.numberOrder = vm.listYear.id + vm.codeordernumberorden;
              vm.getDetail();
            }
          } else {
            logger.success($filter("translate")("0392"));
          }
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function keyselectpatientid($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.disable();
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
          vm.getseach();
        } else if (vm.codeordernumberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.getseach();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    function getListYear() {
      vm.loading = false;
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
            vm.datasex.id = 9;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método para obtener lista de tipo de documento **//
    function gettypedocument() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return documenttypesDS.getstatetrue(auth.authToken).then(
        function (data) {
          vm.getArea();
          if (data.status === 200) {
            vm.documentType = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getDetail() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var order = {
        filterId: 1,
        firstOrder: vm.numberOrder,
        lastOrder: vm.numberOrder,
        testList: [],
        userId: auth.id,
      };
      vm.listtestgroup = [];

      return resultsentryDS.getTesConsult(auth.authToken, order).then(
        function (data) {
          if (data.status === 200) {
            if (data.data.length > 0) {
              vm.listtestgroup =
                data.data.length === 0 ? [] : _.groupBy(data.data, "areaName");
              vm.listtest = data.data.length === 0 ? [] : data.data;

              if (vm.lisArea.id !== -1) {
                var namearea = $filter("filter")(vm.lisArea, {
                  id: vm.lisArea.id,
                })[0].name;
                var listfilterbyarea = {};
                listfilterbyarea[namearea] = vm.listtestgroup[namearea];
                vm.listtestgroup = listfilterbyarea;
              }
            } else {
              logger.warning("No existen muestras verificadas para esa orden");
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function Datapatient(data) {
      if ($filter("translate")("0000") === "esCo") {
        data.data[0].patient.sex.name = data.data[0].patient.sex.esCo;
      } else {
        data.data[0].patient.sex.name = data.data[0].patient.sex.enUsa;
      }
      data.data[0].patient.birthday = common.getAgeAsString(
        moment(data.data[0].patient.birthday).format(vm.formatDateAge),
        vm.formatDateAge
      );
      return data.data;
    }
    function modalError(error) {
      vm.loading = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    function changetab(tab) {
      vm.destailorden = [];
      vm.isOpenReport = true;
      vm.isOpenReport1 = true;
      vm.tab = tab === 1 ? true : false;
      vm.consultpatient = [];
      vm.flange = tab;
      vm.selectedTest = null;
      vm.record1 = "";
      vm.documentType.id = 1;
      vm.record = "";
      vm.lastname = "";
      vm.basicTree = [];
      vm.listtest = [];
      vm.numberOrder = null;
      vm.lisArea.id = -1;
      vm.listranch.id = -1;
      vm.typeresport.id = 4;
      vm.codeordernumberorden = "";
    }
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
    function generateDataReport(data) {
      var dataReport = [];
      var language = $filter("translate")("0000");
      vm.numTests = 0;
      vm.testPrinted = [];
      if (data.length === 0) {
        return dataReport;
      }
      data.forEach(function (value, key) {
        //Comentarios de la orden
        vm.commentsOrder = [];
        var content = "";
        if (value.comments.length > 0) {
          value.comments.forEach(function (valueCont) {
            var firshC = JSON.parse(
              valueCont.comment.replace(/'/g, '"')
            ).content.substring(0, 1);
            var pos = firshC == '"' ? 1 : 0;
            var cont = JSON.parse(valueCont.comment.replace(/'/g, '"')).content;
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

        for (var i = 0; i < value.resultTest.length; i++) {
          vm.testPrinted.push({ testId: value.resultTest[i].testId });
          var indentation = value.resultTest[i].profileId === 0 ? "" : "    ";
          vm.resultTemplate = [];
          if (value.resultTest[i].hasTemplate) {
            if (value.resultTest[i].optionsTemplate.length > 0) {
              var rT = "";
              value.resultTest[i].optionsTemplate.forEach(function (valueTemp) {
                vm.resultTemplate.push({
                  result: valueTemp.result,
                  idTest: valueTemp.idTest,
                  order: valueTemp.order,
                });
                rT +=
                  indentation +
                  valueTemp.option +
                  ": " +
                  valueTemp.result.replace("<br/>", ", ") +
                  " | Normal: " +
                  (valueTemp.normalResult === undefined
                    ? "N/A"
                    : valueTemp.normalResult) +
                  "<br/>";
                vm.resultTemplate[0].result = rT;
              });
            } else {
              vm.resultTemplate.push({
                result: "",
                idTest: value.resultTest[i].testId,
                order: value.orderNumber,
              });
            }
          } else {
            vm.resultTemplate.push({
              result: "",
              idTest: value.resultTest[i].testId,
              order: value.orderNumber,
            });
          }

          if (value.resultTest[i].hasAntibiogram) {
            value.resultTest[i].microbialDetection.microorganisms.forEach(
              function (micro, key1) {
                if (micro.selected) {
                  micro.resultsMicrobiology.forEach(function (mr, key2) {
                    if (mr.selected) {
                      var dataJson = {
                        orderNumber: value.orderNumber,
                        createdDateShort: moment(value.createdDateShort).format(
                          vm.formatDate
                        ),
                        codeType: value.type.code,
                        nameType: value.type.name,
                        createdDate: moment(value.createdDate).format(
                          vm.formatDate
                        ),
                        idhistory: value.patient.id,
                        patientId: value.patient.patientId,
                        name1: value.patient.name1,
                        name2: value.patient.name2,
                        lastName: value.patient.lastName,
                        surName: value.patient.surName,
                        sex:
                          language === "esCo"
                            ? value.patient.sex.esCo
                            : value.patient.sex.enUsa,
                        birthday: moment(value.patient.birthday).format(
                          vm.formatDate
                        ),
                        years: common.getAgeAsString(
                          moment(value.patient.birthday).format(
                            vm.formatDateAge
                          ),
                          vm.formatDateAge
                        ),
                        email: value.patient.email,
                        address: value.patient.address,
                        phone: value.patient.phone,
                        size:
                          value.patient.size === undefined
                            ? null
                            : value.patient.size,
                        weight:
                          value.patient.weight === undefined
                            ? null
                            : value.patient.weight,
                        abbrDoc:
                          value.patient.documentType.abbr === undefined
                            ? null
                            : value.patient.documentType.abbr,
                        nameDoc:
                          value.patient.documentType.name === undefined
                            ? null
                            : value.patient.documentType.name,
                        raceId: value.patient.race.id,
                        raceName:
                          value.patient.race.name === undefined
                            ? null
                            : value.patient.race.name,
                        homebound: value.homebound,
                        miles: value.miles,
                        active: value.active,
                        branchId: value.branch.id,
                        branchCode:
                          value.branch.code === undefined
                            ? null
                            : value.branch.code,
                        branchName:
                          value.branch.name === undefined
                            ? null
                            : value.branch.name,
                        serviceId: value.service.id,
                        serviceCode:
                          value.service.code === undefined
                            ? null
                            : value.service.code,
                        serviceName:
                          value.service.name === undefined
                            ? null
                            : value.service.name,
                        physicianId: value.physician.id,
                        physicianName:
                          value.physician.name === undefined
                            ? null
                            : value.physician.name +
                              " " +
                              value.physician.lastName,
                        physicianEmail:
                          value.physician.email === undefined
                            ? null
                            : value.physician.email,
                        rateId: value.rate.id,
                        rateCode:
                          value.rate.code === undefined
                            ? null
                            : value.rate.code,
                        rateName:
                          value.rate.name === undefined
                            ? null
                            : value.rate.name,
                        accountId: value.account.id,
                        accountNit:
                          value.account.nit === undefined
                            ? null
                            : value.account.nit,
                        accountName:
                          value.account.name === undefined
                            ? null
                            : value.account.name,
                        previousState: value.previousState,
                        areaId: value.resultTest[i].areaId,
                        areaName: value.resultTest[i].areaName,
                        testId: value.resultTest[i].testId,
                        testCode: indentation + value.resultTest[i].testCode,
                        testName: indentation + value.resultTest[i].testName,
                        result: "",
                        state: value.resultTest[i].state,
                        newState: value.resultTest[i].newState,
                        resultType: value.resultTest[i].resultType,
                        pathology: value.resultTest[i].pathology,
                        unit:
                          value.resultTest[i].unit === undefined
                            ? null
                            : value.resultTest[i].unit,
                        refMin: value.resultTest[i].refMin,
                        refMax: value.resultTest[i].refMax,
                        refInterval:
                          value.resultTest[i].refInterval === undefined
                            ? null
                            : value.resultTest[i].refInterval,
                        panicMin: value.resultTest[i].panicMin,
                        panicMax: value.resultTest[i].panicMax,
                        panicInterval:
                          value.resultTest[i].panicInterval === undefined
                            ? null
                            : value.resultTest[i].panicInterval,
                        reportedMin: value.resultTest[i].reportedMin,
                        reportedMax: value.resultTest[i].reportedMax,
                        critic: value.resultTest[i].critic,
                        abbreviation: value.resultTest[i].abbreviation,
                        digits: value.resultTest[i].digits,
                        comment:
                          value.resultTest[i].resultComment.comment !== null
                            ? $filter("translate")("0631") +
                              ": " +
                              value.resultTest[i].resultComment.comment
                            : "",
                        commentDate:
                          value.resultTest[i].resultComment.commentDate !== null
                            ? moment(
                                value.resultTest[i].resultComment.commentDate
                              ).format(vm.formatDate)
                            : null,
                        commentChanged:
                          value.resultTest[i].resultComment.commentChanged,
                        hasComment: value.resultTest[i].hasComment,
                        resultChanged: value.resultTest[i].resultChanged,
                        sampleState: value.resultTest[i].sampleState,
                        confidential: value.resultTest[i].confidential,
                        repeatAmmount: value.resultTest[i].repeatAmmount,
                        modificationAmmount:
                          value.resultTest[i].modificationAmmount,
                        orderPathology: value.resultTest[i].orderPathology,
                        deltaMin: value.resultTest[i].deltaMin,
                        deltaMax: value.resultTest[i].deltaMax,
                        deltaInterval: value.resultTest[i].deltaInterval,
                        currentState: value.resultTest[i].currentState,
                        entryDate: moment(value.resultTest[i].entryDate).format(
                          vm.formatDate
                        ),
                        attachments: $filter("filter")(
                          vm.dataAttachmentsImage,
                          { idOrder: value.orderNumber },
                          true
                        ), //, idTest: value.resultTest[i].testId
                        idmicro: micro.id,
                        microorganisms: indentation + micro.name,
                        nameAntibiotic: indentation + mr.nameAntibiotic,
                        cmi: mr.cmi,
                        interpretationCMI: mr.interpretationCMI,
                        validationUserName:
                          value.resultTest[i].validationUserName +
                          " " +
                          value.resultTest[i].validationUserLastName,
                        validationUserSignature:
                          value.resultTest[i].validationUserSignature,
                        resultTemplate:
                          $filter("filter")(
                            vm.resultTemplate,
                            {
                              order: value.orderNumber,
                              idTest: value.resultTest[i].testId,
                            },
                            true
                          )[0].result === ""
                            ? ""
                            : "<b>" +
                              indentation +
                              $filter("translate")("0739") +
                              "</b><br/>" +
                              $filter("filter")(
                                vm.resultTemplate,
                                {
                                  order: value.orderNumber,
                                  idTest: value.resultTest[i].testId,
                                },
                                true
                              )[0].result,
                        comments:
                          $filter("filter")(
                            vm.commentsOrder,
                            { order: value.orderNumber },
                            true
                          )[0].content === ""
                            ? ""
                            : indentation +
                              $filter("filter")(
                                vm.commentsOrder,
                                { order: value.orderNumber },
                                true
                              )[0].content,
                        hasTemplate: value.resultTest[i].hasTemplate,
                        technique:
                          value.resultTest[i].technique === undefined ||
                          value.resultTest[i].technique === ""
                            ? ""
                            : "<b>" +
                              indentation +
                              $filter("translate")("0740") +
                              ": </b>" +
                              value.resultTest[i].technique,
                        refLiteral:
                          value.resultTest[i].refLiteral === undefined
                            ? ""
                            : "<b>" +
                              indentation +
                              $filter("translate")("0394") +
                              ": </b>" +
                              value.resultTest[i].refLiteral,
                        profileId: value.resultTest[i].profileId,
                        profileName:
                          value.resultTest[i].profileId === 0
                            ? ""
                            : value.resultTest[i].profileName,
                        groupTitle:
                          value.resultTest[i].groupTitle === undefined
                            ? ""
                            : indentation + value.resultTest[i].groupTitle,
                      };
                      dataReport.push(dataJson);
                    }
                  });
                }
              }
            );
          } else {
            var dataJson = {
              orderNumber: value.orderNumber,
              createdDateShort: moment(value.createdDateShort).format(
                vm.formatDate
              ),
              codeType: value.type.code,
              nameType: value.type.name,
              createdDate: moment(value.createdDate).format(vm.formatDate),
              idhistory: value.patient.id,
              patientId: value.patient.patientId,
              name1: value.patient.name1,
              name2: value.patient.name2,
              lastName: value.patient.lastName,
              surName: value.patient.surName,
              sex:
                language === "esCo"
                  ? value.patient.sex.esCo
                  : value.patient.sex.enUsa,
              birthday: moment(value.patient.birthday).format(vm.formatDate),
              years: common.getAgeAsString(
                moment(value.patient.birthday).format(vm.formatDateAge),
                vm.formatDateAge
              ),
              email: value.patient.email,
              address: value.patient.address,
              phone: value.patient.phone,
              size:
                value.patient.size === undefined ? null : value.patient.size,
              weight:
                value.patient.weight === undefined
                  ? null
                  : value.patient.weight,
              abbrDoc:
                value.patient.documentType.abbr === undefined
                  ? null
                  : value.patient.documentType.abbr,
              nameDoc:
                value.patient.documentType.name === undefined
                  ? null
                  : value.patient.documentType.name,
              raceId: value.patient.race.id,
              raceName:
                value.patient.race.name === undefined
                  ? null
                  : value.patient.race.name,
              homebound: value.homebound,
              miles: value.miles,
              active: value.active,
              branchId: value.branch.id,
              branchCode:
                value.branch.code === undefined ? null : value.branch.code,
              branchName:
                value.branch.name === undefined ? null : value.branch.name,
              serviceId: value.service.id,
              serviceCode:
                value.service.code === undefined ? null : value.service.code,
              serviceName:
                value.service.name === undefined ? null : value.service.name,
              physicianId: value.physician.id,
              physicianName:
                value.physician.name === undefined
                  ? null
                  : value.physician.name + " " + value.physician.lastName,
              physicianEmail:
                value.physician.email === undefined
                  ? null
                  : value.physician.email,
              rateId: value.rate.id,
              rateCode: value.rate.code === undefined ? null : value.rate.code,
              rateName: value.rate.name === undefined ? null : value.rate.name,
              accountId: value.account.id,
              accountNit:
                value.account.nit === undefined ? null : value.account.nit,
              accountName:
                value.account.name === undefined ? null : value.account.name,
              previousState: value.previousState,
              areaId: value.resultTest[i].areaId,
              areaName: value.resultTest[i].areaName,
              testId: value.resultTest[i].testId,
              testCode: indentation + value.resultTest[i].testCode,
              testName: indentation + value.resultTest[i].testName,
              result: value.resultTest[i].result,
              state: value.resultTest[i].state,
              newState: value.resultTest[i].newState,
              resultType: value.resultTest[i].resultType,
              pathology: value.resultTest[i].pathology,
              unit:
                value.resultTest[i].unit === undefined
                  ? null
                  : value.resultTest[i].unit,
              refMin: value.resultTest[i].refMin,
              refMax: value.resultTest[i].refMax,
              refInterval:
                value.resultTest[i].refInterval === undefined
                  ? null
                  : value.resultTest[i].refInterval,
              panicMin: value.resultTest[i].panicMin,
              panicMax: value.resultTest[i].panicMax,
              panicInterval:
                value.resultTest[i].panicInterval === undefined
                  ? null
                  : value.resultTest[i].panicInterval,
              reportedMin: value.resultTest[i].reportedMin,
              reportedMax: value.resultTest[i].reportedMax,
              critic: value.resultTest[i].critic,
              abbreviation: value.resultTest[i].abbreviation,
              digits: value.resultTest[i].digits,
              comment:
                value.resultTest[i].resultComment.comment !== null
                  ? $filter("translate")("0631") +
                    ": " +
                    value.resultTest[i].resultComment.comment
                  : "",
              commentDate:
                value.resultTest[i].resultComment.commentDate !== null
                  ? moment(
                      value.resultTest[i].resultComment.commentDate
                    ).format(vm.formatDate)
                  : null,
              commentChanged: value.resultTest[i].resultComment.commentChanged,
              hasComment: value.resultTest[i].hasComment,
              resultChanged: value.resultTest[i].resultChanged,
              sampleState: value.resultTest[i].sampleState,
              confidential: value.resultTest[i].confidential,
              repeatAmmount: value.resultTest[i].repeatAmmount,
              modificationAmmount: value.resultTest[i].modificationAmmount,
              orderPathology: value.resultTest[i].orderPathology,
              deltaMin: value.resultTest[i].deltaMin,
              deltaMax: value.resultTest[i].deltaMax,
              deltaInterval: value.resultTest[i].deltaInterval,
              currentState: value.resultTest[i].currentState,
              entryDate: moment(value.resultTest[i].entryDate).format(
                vm.formatDate
              ),
              attachments: $filter("filter")(
                vm.dataAttachmentsImage,
                { idOrder: value.orderNumber },
                true
              ), //, idTest: value.resultTest[i].testId
              idmicro: null,
              microorganisms: null,
              nameAntibiotic: null,
              cmi: null,
              interpretationCMI: null,
              validationUserName:
                value.resultTest[i].validationUserName +
                " " +
                value.resultTest[i].validationUserLastName,
              validationUserSignature:
                value.resultTest[i].validationUserSignature,
              resultTemplate:
                $filter("filter")(
                  vm.resultTemplate,
                  {
                    order: value.orderNumber,
                    idTest: value.resultTest[i].testId,
                  },
                  true
                )[0].result === ""
                  ? ""
                  : "<b>" +
                    indentation +
                    $filter("translate")("0739") +
                    "</b><br/>" +
                    $filter("filter")(
                      vm.resultTemplate,
                      {
                        order: value.orderNumber,
                        idTest: value.resultTest[i].testId,
                      },
                      true
                    )[0].result,
              comments:
                $filter("filter")(
                  vm.commentsOrder,
                  { order: value.orderNumber },
                  true
                )[0].content === ""
                  ? ""
                  : indentation +
                    $filter("filter")(
                      vm.commentsOrder,
                      { order: value.orderNumber },
                      true
                    )[0].content,
              hasTemplate: value.resultTest[i].hasTemplate,
              technique:
                value.resultTest[i].technique === undefined ||
                value.resultTest[i].technique === ""
                  ? ""
                  : "<b>" +
                    indentation +
                    $filter("translate")("0740") +
                    ": </b>" +
                    value.resultTest[i].technique,
              refLiteral:
                value.resultTest[i].refLiteral === undefined
                  ? ""
                  : "<b>" +
                    indentation +
                    $filter("translate")("0394") +
                    ": </b>" +
                    value.resultTest[i].refLiteral,
              profileId: value.resultTest[i].profileId,
              profileName:
                value.resultTest[i].profileId === 0
                  ? ""
                  : value.resultTest[i].profileName,
              groupTitle:
                value.resultTest[i].groupTitle === undefined
                  ? ""
                  : indentation + value.resultTest[i].groupTitle,
            };
            dataReport.push(dataJson);
          }
        }

        vm.numTests = vm.numTests + data[key].resultTest.length;
      });
      vm.numTests = vm.numTests.toString();

      return dataReport;
    }
    function Fileresultspending() {
      if (vm.isOpenReport) {
        return;
      }
      var json = vm.jsonPrint();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reportsDS.getReports(auth.authToken, json).then(function (data) {
        vm.datareport = vm.generateDataReport(data.data);
        vm.variables = {
          username: auth.userName,
          titleReport: $filter("translate")("0399"),
          now: moment().format(vm.formatDate),
          countTests: $filter("translate")("0101") + ": " + vm.numTests,
        };
        vm.pathreport =
          "/Report/reportsandconsultations/consultnormal/consultnormal.mrt";
        vm.openreport = false;
        vm.progressReport = false;
        vm.windowOpenReport();
        /*    if (vm.datareport.length > 0) {
                    var jsonPrinted = {
                        'orderNumber': vm.datareport[0].orderNumber,
                        'resultTest': vm.testPrinted
                    }
                    reportsDS.updateState(auth.authToken, jsonPrinted).then(function (data) {
                        if (data.status === 200) {
                            vm.numberOrder = vm.datareport[0].orderNumber;
                            vm.getDetail();
                            logger.success('Pruebas actualizadas como impresas!');
                        }
                    })

                } */
      });
    }
    function jsonPrint() {
      var listTest = [];
      vm.listtest.forEach(function (value) {
        listTest.push(value.testId);
      });

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
        typeReport: 1,
        printedOrders: false,
      };
      var str_json = JSON.stringify(json);
      return json;
    }
    //** Método  para imprimir el reporte historico**//
    function printhistory() {
      vm.consultpatientprint = $filter("filter")(vm.consultpatient, {
        validationDate: "!!",
      });
      vm.consultpatientprint = $filter("orderBy")(
        vm.consultpatientprint,
        "validationDateFormat",
        "desc"
      );
      vm.consultpatientprint =
        vm.consultpatientprint.length > 20
          ? vm.consultpatientprint.slice(0, 20)
          : vm.consultpatientprint;

      vm.consultpatientprint.forEach(function (value, key) {
        value.hasObservationResult =
          value.hasComment === true
            ? true
            : value.hasTemplate === true
            ? true
            : false;
      });

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.datareport = vm.consultpatientprint;
      var datapatient = {
        typedocument: vm.datapatient.documentType,
        patientId: vm.datapatient.patientId,
        patientname: vm.datapatient.completeName,
        gender: vm.datapatient.sex,
        birthday: vm.datapatient.age,
        email: vm.datapatient.email,
      };

      vm.variables = {
        test: vm.selectedTest.name,
        patient: datapatient,
        username: auth.userName,
        date: moment().format(vm.formatDate),
      };

      vm.pathreport =
        "/Report/reportsandconsultations/consultpatienfortest/consultpatienfortest.mrt";
      vm.openreport = false;
      vm.windowOpenReport();
    }
    //** Método  para imprimir el reporte grafica**//
    function Graph() {
      vm.grafiphprint = $filter("filter")(vm.consultpatient, {
        validationDate: "!!",
      });
      vm.grafiphprint = $filter("orderBy")(
        vm.grafiphprint,
        "validationDateFormat",
        "desc"
      );
      vm.grafiphprint =
        vm.grafiphprint.length > 20
          ? vm.grafiphprint.slice(0, 20)
          : vm.grafiphprint;

      vm.grafiphprint.forEach(function (value, key) {
        value.hasObservationResult =
          value.hasComment === true
            ? true
            : value.hasTemplate === true
            ? true
            : false;
        value.resultinvalid = isNaN(value.result);
      });
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      vm.datareport = vm.grafiphprint;
      var datapatient = {
        typedocument: vm.datapatient.documentType,
        patientId: vm.datapatient.patientId,
        patientname: vm.datapatient.completeName,
        gender: vm.datapatient.sex,
        birthday: vm.datapatient.age,
        email: vm.datapatient.email,
      };

      vm.variables = {
        test: vm.selectedTest.name,
        patient: datapatient,
        username: auth.userName,
        date: moment().format(vm.formatDate),
      };

      vm.pathreport =
        "/Report/reportsandconsultations/consultgraphics/consultgraphics.mrt";
      vm.openreport = false;
      vm.progressReport = false;
      vm.windowOpenReport();
    }
    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    function init() {
      vm.loading = true;
      vm.gettest();
      vm.sizeorder = 4 + parseInt(vm.digitsorder);
      vm.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
          ul: "a1",
          li: "a2",
          liSelected: "a7",
          iExpanded: "a3",
          iCollapsed: "a4",
          iLeaf: "a5",
          label: "a6",
          labelSelected: "a8",
        },
      };
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
