/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   type
                disabled            @descripción
                values              @descripción
                data                @descripción
                selectedpatientid   @descripción
                selectedpatientname @descripción
                atientphoto         @descripción
                listenerdate        @descripción
                title               @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyassignment/historyassignment.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderswithouthistory/orderswithouthistory.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";

  angular.module("app.widgets").directive("orderfield", orderfield);

  orderfield.$inject = [
    "localStorageService",
    "patientDS",
    "orderDS",
    "$filter",
    "common",
    "documenttypesDS",
    "$rootScope",
    "demographicDS",
    "demographicsItemDS",
    "customerDS",
    "logger",
    "$state"
  ];

  function orderfield(
    localStorageService,
    patientDS,
    orderDS,
    $filter,
    common,
    documenttypesDS,
    $rootScope,
    demographicDS,
    demographicsItemDS,
    customerDS,
    logger,
    $state
  ) {
    var directive = {
      templateUrl: "app/widgets/userControl/orderfield.html",
      restrict: "EA",
      scope: {
        type: "=?type",
        values: "=values",
        data: "=data",
        selectedpatientid: "=selectedpatientid",
        selectedpatientname: "=selectedpatientname",
        patientphoto: "=?patientphoto",
        listenerdate: "=listenerdate",
        listener: "=listener",
        listenerorder: "=listenerorder",
        title: "=?title",
        statecontrol: "=?statecontrol",
        saveedit: "=?saveedit",
        loadpatientsearch: "&",
        viewsearch: "=?viewsearch",
        viewphoto: "=?viewphoto",
        opensearch: "=?opensearch",
        listorder: "=?listorder",
        demographictest: "=?demographictest",
        listenerdemographic: "=?listenerdemographic",
        depen: "=?depen",
        functionexecute: "=functionexecute",
        eventnew: "=eventnew",
      },

      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.monthSelectorOptions = {
            messages: {
              year: $filter("translate")("0428"),
              month: $filter("translate")("0567"),
              day: $filter("translate")("0568"),
              weekday: $filter("translate")("1508"),
              hour: $filter("translate")("0970"),
              minute: $filter("translate")("1509"),
              second: $filter("translate")("1510"),
              dayperiod: "AM/PM",
            },
          };
          vm.addtesservice =
            localStorageService.get("AgregarExamenesServicios") === "True";
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          vm.democode =
            localStorageService.get("CodigoDemograficoIngreso") === "True" ||
              localStorageService.get("CodigoDemograficoIngreso") === "true"
              ? true
              : false;
          vm.isAuxPhysicians =
            localStorageService.get("MedicosAuxiliares") === "True";
          if ($state.$current.controller === 'medicalappointmentController' && $scope.type === "O") {
            vm.title = $filter("translate")("0281")
          } else {
            vm.title =
              $scope.type === "H" ?
                $filter("translate")("0398") :
                $filter("translate")("0110");
            vm.title = $scope.title === undefined ? vm.title : $scope.title;
          }
          vm.type = $scope.type;
          vm.listener = $scope.listenerdate;
          vm.demographics = [];
          vm.demographicsStatic = [];
          vm.demographicsScroll = [];
          vm.values = {};
          vm.disabled = {};
          vm.maxend = moment().format();
          //vm.patientPhoto = 'images/user.png';
          vm.selectNotCodified = selectNotCodified;
          vm.selectCodified = selectCodified;
          vm.selectDate = selectDate;
          vm.formatDate = localStorageService.get("FormatoFecha");
          vm.selectedDate = new Date();
          vm.maskEvent = maskEvent;
          vm.focusOutListDemographics = focusOutListDemographics;
          vm.focusInListDemographics = focusInListDemographics;
          vm.managehistoryauto =
            localStorageService.get("HistoriaAutomatica").toLowerCase() ===
            "true";
          vm.demoadduser = localStorageService.get(
            "Enterprise_NT.authorizationData"
          ).creatingItems;
          vm.manageservice =
            localStorageService.get("ManejoServicio").toLowerCase() === "true";
          vm.isOrderAutomatic =
            localStorageService.get("NumeroOrdenAutomatico") === "True";
          vm.showDocumentType =
            localStorageService.get("ManejoTipoDocumento") === "True";
          vm.twoNames =
            localStorageService.get("DosNombresPaciente") === "True";
          vm.twosurnames =
            localStorageService.get("DosApellidosPaciente") === "True";

          vm.orderTypeDefault = localStorageService.get(
            "ValorInicialTipoOrden"
          );
          vm.RegExp = false;
          vm.addcustomerinentry =
            localStorageService.get("AdicionClientesIngreso") === "True";
          vm.manageAccount =
            localStorageService.get("ManejoCliente") === "True";
          vm.manageRate = localStorageService.get("ManejoTarifa") === "True";
          vm.customerdefault = localStorageService.get("clientePorDefecto");
          vm.integrationMINSA =
            localStorageService.get("IntegracionTribunal") === "True";
          vm.keyselectOrder = keyselectOrder;
          vm.digitsorder = localStorageService.get("DigitosOrden");
          vm.maxLength = localStorageService.get("DigitosOrden");
          vm.dataturn = localStorageService.get("turn");
          vm.moduleSiga = localStorageService.get("moduleSiga");
          vm.editturn = localStorageService.get("editturn");
          vm.modalRepeat = UIkit.modal("#modalRepeat", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
          });
          vm.validateDelete = validateDelete;
          vm.selectHistory = selectHistory;
          vm.searchByPatient = searchByPatient;
          vm.newhistory = vm.managehistoryauto ? "-1" : "";
          vm.getDocumentType = getDocumentType;
          vm.validNewPatient = validNewPatient;
          vm.validhistorysearch = true;
          vm.viewsearch = $scope.viewsearch;
          vm.serviceEntrySiga = parseInt(
            localStorageService.get("stateTurnSiga")
          );
          vm.turnfilter =
            localStorageService.get("OrdenesSIGA") === "?" ? false : true;
          vm.activesigaorder = parseInt(localStorageService.get("moduleSiga"));

          var fechasintomas = localStorageService.get("FechaSintomas");
          vm.fechasintomas =
            fechasintomas === undefined ||
              fechasintomas === "" ||
              fechasintomas === "0" ||
              fechasintomas === null
              ? 0
              : parseInt(fechasintomas);

          var fechatoma = localStorageService.get("FechaToma");
          vm.fechatoma =
            fechatoma === undefined ||
              fechatoma === "" ||
              fechatoma === "0" ||
              fechatoma === null
              ? 0
              : parseInt(fechatoma);

          var fecharesultado = localStorageService.get("FechaResultado");
          vm.fecharesultado =
            fecharesultado === undefined ||
              fecharesultado === "" ||
              fecharesultado === "0" ||
              fecharesultado === null
              ? 0
              : parseInt(fecharesultado);

          vm.maxend = moment().format();
          vm.tomorrow = new Date();
          vm.tomorrow.setDate(vm.tomorrow.getDate() - 365);
          vm.tomorrowchange = new Date();
          vm.tomorrowchange.setDate(vm.tomorrowchange.getDate() - 365);
          vm.tomorrowchangeresul = new Date();
          vm.tomorrowchangeresul.setDate(
            vm.tomorrowchangeresul.getDate() - 365
          );
          vm.startChange = startChange;

          vm.maskphone =
            localStorageService.get("FormatoTelefono") === null
              ? ""
              : localStorageService.get("FormatoTelefono");
          vm.loadtakephotopatient = loadtakephotopatient;
          vm.takephotopatient = takephotopatient;
          vm.loadphotopatient = loadphotopatient;
          vm.savephoto = savephoto;
          vm.photopatient = "";
          vm.closemodalrepeat = closemodalrepeat;
          vm.viewnewturn = viewnewturn;
          vm.validateddate = validateddate;
          vm.focusInListDemographicscode = focusInListDemographicscode;
          vm.keyselectpatientid = keyselectpatientid;
          vm.maxDate = new Date();
          vm.ordersday = [];
          vm.demographictest = [];
          vm.validatedemographictest = validatedemographictest;
          vm.validatedmask = validatedmask;
          vm.restoreItemsPhysician = restoreItemsPhysician;
          vm.indexesAuxPhysician = [-201, -202, -203, -204, -205];

          var demographics = localStorageService.get("ExamenesDemograficos");
          vm.demographic1 = null;
          vm.demographic2 = null;
          vm.demographic3 = null;

          if (demographics !== null) {
            demographics = demographics.split(",");
            if (demographics[0]) {
              vm.demographic1 = parseInt(demographics[0]);
            }
            if (demographics[1]) {
              vm.demographic2 = parseInt(demographics[1]);
            }
            if (demographics[2]) {
              vm.demographic3 = parseInt(demographics[2]);
            }
          }

          vm.demographicstestrelations = [];
          vm.ItemsPhysicians = [];

          vm.cfdi = [
            { id: "G01", name: $filter("translate")("1643") },
            { id: "G02", name: $filter("translate")("1644") },
            { id: "G03", name: $filter("translate")("1645") },
            { id: "I01", name: $filter("translate")("1646") },
            { id: "I02", name: $filter("translate")("1647") },
            { id: "I03", name: $filter("translate")("1648") },
            { id: "I04", name: $filter("translate")("1649") },
            { id: "I05", name: $filter("translate")("1650") },
            { id: "I06", name: $filter("translate")("1651") },
            { id: "I07", name: $filter("translate")("1652") },
            { id: "I08", name: $filter("translate")("1653") },
            { id: "D01", name: $filter("translate")("1654") },
            { id: "D02", name: $filter("translate")("1655") },
            { id: "D03", name: $filter("translate")("1656") },
            { id: "D04", name: $filter("translate")("1657") },
            { id: "D05", name: $filter("translate")("1658") },
            { id: "D06", name: $filter("translate")("1659") },
            { id: "D07", name: $filter("translate")("1700") },
            { id: "D08", name: $filter("translate")("1701") },
            { id: "D09", name: $filter("translate")("1702") },
            { id: "D10", name: $filter("translate")("1703") },
            { id: "P01", name: $filter("translate")("1704") },
          ];
          //RegimenFiscal
          vm.regimenFiscal = [
            { id: "601", name: $filter("translate")("3243") },
            { id: "603", name: $filter("translate")("3244") },
            { id: "605", name: $filter("translate")("3245") },
            { id: "606", name: $filter("translate")("3246") },
            { id: "607", name: $filter("translate")("3247") },
            { id: "608", name: $filter("translate")("3248") },
            { id: "610", name: $filter("translate")("3249") },
            { id: "611", name: $filter("translate")("3250") },
            { id: "612", name: $filter("translate")("3251") },
            { id: "614", name: $filter("translate")("3252") },
            { id: "615", name: $filter("translate")("3253") },
            { id: "616", name: $filter("translate")("3254") },
            { id: "620", name: $filter("translate")("3255") },
            { id: "621", name: $filter("translate")("3256") },
            { id: "622", name: $filter("translate")("3257") },
            { id: "623", name: $filter("translate")("3258") },
            { id: "624", name: $filter("translate")("3259") },
            { id: "625", name: $filter("translate")("3260") },
            { id: "626", name: $filter("translate")("3261") },
          ];

          vm.historyFormat = localStorageService.get("FormatoHistoria");
          vm.validatedFormat = false;

          if (
            vm.historyFormat !== null &&
            vm.historyFormat !== "" &&
            vm.historyFormat !== undefined
          ) {
            if (vm.historyFormat.indexOf("[") !== -1) {
              vm.validatedFormat = true;
              vm.validatedmask();
            }
          }

          vm.filterListdemographics = function (search, listdemographics) {
            var listtestfilter = [];
            if (listdemographics[0].idDemo === -4) {
              listdemographics = _.filter(listdemographics, function (e) {
                return e.id !== 4 && e.code !== "C";
              });
            }
            if (search.length === 1 && search.substring(0, 1) === "?") {
              listtestfilter = $filter("orderBy")(listdemographics, "code");
            } else {
              listtestfilter = _.filter(listdemographics, function (color) {
                return (
                  color.code.toUpperCase().indexOf(search.toUpperCase()) !==
                  -1 ||
                  color.name.toUpperCase().indexOf(search.toUpperCase()) !==
                  -1 ||
                  (color.code + ". " + color.name)
                    .toUpperCase()
                    .indexOf(search.toUpperCase()) !== -1
                );
              });
            }
            var canCreateItemInOrder = $filter("filter")(
              vm.demographics,
              function (e) {
                return e.id === listdemographics[0].demographic;
              }
            );
            if (canCreateItemInOrder.length !== 0) {
              if (
                listtestfilter.length === 0 &&
                search.trim() !== "" &&
                listdemographics[0].demographic > 0 &&
                vm.demoadduser &&
                canCreateItemInOrder[0].canCreateItemInOrder
              ) {
                vm.demosave = [];
                listtestfilter = [
                  {
                    code: "",
                    defaultItem: listdemographics[0].defaultItem,
                    demographic: listdemographics[0].demographic,
                    demographicName: listdemographics[0].demographicName,
                    description: "",
                    id: -1,
                    idDemo: listdemographics[0].idDemo,
                    lastTransaction: listdemographics[0].lastTransaction,
                    name: search,
                    showValue: $filter("translate")("1539"),
                    state: listdemographics[0].state,
                    user: listdemographics[0].user,
                  },
                ];
                vm.demosave = listtestfilter;
              }
            }
            if (listdemographics[0].idDemo === -1) {
              if (
                listtestfilter.length === 0 &&
                search.trim() !== "" &&
                vm.demoadduser &&
                vm.addcustomerinentry
              ) {
                vm.demosave = [];
                listtestfilter = [
                  {
                    code: "",
                    id: -1,
                    idDemo: listdemographics[0].idDemo,
                    name: search,
                    showValue: $filter("translate")("1539"),
                    state: listdemographics[0].state,
                    user: listdemographics[0].user,
                  },
                ];
                vm.demosave = listtestfilter;
              }
            }
            vm.listtestfilter = listtestfilter;
            return listtestfilter;
          };

          vm.filterListdemographicscode = function (search, listdemographics) {
            var listtestfilter = [];
            if (listdemographics[0].idDemo === -4) {
              listdemographics = _.filter(listdemographics, function (e) {
                return e.id !== 4 && e.code !== "C";
              });
            }
            if (search.length === 1 && search.substring(0, 1) === "?") {
              listtestfilter = $filter("orderBy")(listdemographics, "code");
            } else {
              listtestfilter = _.filter(listdemographics, function (color) {
                return (
                  color.name.toUpperCase().indexOf(search.toUpperCase()) !==
                  -1 ||
                  color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1
                );
              });
            }

            var canCreateItemInOrder = $filter("filter")(
              vm.demographics,
              function (e) {
                return e.id === listdemographics[0].demographic;
              }
            );
            if (canCreateItemInOrder.length !== 0) {
              if (
                listtestfilter.length === 0 &&
                search.trim() !== "" &&
                listdemographics[0].demographic > 0 &&
                vm.demoadduser &&
                canCreateItemInOrder[0].canCreateItemInOrder
              ) {
                listtestfilter = [
                  {
                    code: "",
                    defaultItem: listdemographics[0].defaultItem,
                    demographic: listdemographics[0].demographic,
                    demographicName: listdemographics[0].demographicName,
                    description: "",
                    id: -1,
                    idDemo: listdemographics[0].idDemo,
                    lastTransaction: listdemographics[0].lastTransaction,
                    name: search,
                    showValue: $filter("translate")("1539"),
                    state: listdemographics[0].state,
                    user: listdemographics[0].user,
                  },
                ];
              }
            }
            if (listdemographics[0].idDemo === -1) {
              if (
                listtestfilter.length === 0 &&
                search.trim() !== "" &&
                vm.demoadduser &&
                vm.addcustomerinentry
              ) {
                vm.demosave = [];
                listtestfilter = [
                  {
                    code: "",
                    id: -1,
                    idDemo: listdemographics[0].idDemo,
                    name: search,
                    showValue: $filter("translate")("1539"),
                    state: listdemographics[0].state,
                    user: listdemographics[0].user,
                  },
                ];
                vm.demosave = listtestfilter;
              }
            }
            vm.listtestfilter = listtestfilter;
            return listtestfilter;
          };

          $scope.$watch("statecontrol", function () {
            vm.statecontrol = $scope.statecontrol;
          });

          $scope.$watch("listorder", function () {
            vm.ordersday = [];
            if ($scope.listorder !== undefined) {
              vm.ordersday = $scope.listorder;
              if (vm.ordersday.length === 0) {
                vm.previus = "";
                vm.current = 0;
                vm.next = "";
              } else if (vm.ordersday.length === 1) {
                vm.previus = "";
                vm.current = 0;
                vm.next = vm.ordersday[0];
              } else if (vm.ordersday.length === 2) {
                vm.current = 1;
                vm.next = vm.ordersday[0];
                vm.previus = vm.ordersday[1];
              } else {
                vm.next = vm.ordersday[0];
                vm.previus = vm.ordersday[vm.ordersday.length - 1];
              }
            }
          });

          $scope.$watch("opensearch", function () {
            if (
              vm.managehistoryauto &&
              $scope.opensearch &&
              $scope.type === "H"
            ) {
              UIkit.modal("#modalsearchpatient", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
              }).show();
              angular.element("#lastName").focus();
              vm.lastNameToSearch = " ";
              vm.surNameToSearch = " ";
              vm.name1ToSearch = " ";
              vm.name2ToSearch = " ";
              vm.selectedDateSerch = null;
              vm.listpatients = [
                {
                  id: 0,
                },
              ];
            }
            $scope.opensearch = false;
          });

          $scope.$watch("viewphoto", function () {
            vm.viewphoto = $scope.viewphoto;
          });

          $scope.$watch("demographictest", function () {
            vm.demographictest = $scope.demographictest;
          });

          $scope.$watch("values", function () {
            vm.values = $scope.values;
            vm.editturn2 = vm.values.turn === undefined ? "" : vm.values.turn;
            vm.photopatient = "";
            vm.dateorderentry = "";
            vm.createdUser = "";
            vm.viewphoto = $scope.viewphoto;

            if (vm.isAuxPhysicians) {
              vm.restoreItemsPhysician();
            }

            //Establece el valor de los codificados
            for (var property in vm.values) {
              if (vm.values.hasOwnProperty(property)) {
                if (typeof vm.values[property] === "object") {
                  if (
                    vm.values[property].id !== 0 &&
                    vm.values[property].id !== undefined
                  ) {
                    var auth = localStorageService.get(
                      "Enterprise_NT.authorizationData"
                    );
                    var select = {
                      description: {
                        idDemo: property,
                        id: vm.values[property].id,
                      },
                    };
                    vm.demodepenload(auth, select);
                  }
                  if (vm.democode) {
                    var object = {
                      showValue: vm.values[property].showValue,
                    };
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_" + property,
                      object
                    );
                  } else {
                    var object = {
                      name: vm.values[property].name,
                    };
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_" + property,
                      object
                    );
                  }
                } else {
                  $scope.$broadcast(
                    "angucomplete-alt:clearInput",
                    "demo_" + property
                  );
                }
              }
            }
            if (vm.values[-99] !== "" && vm.values[-99] !== undefined) {
              vm.loadphotopatient(vm.values[-99]);
            }
            if (vm.values[-107] !== "" && vm.values[-107] !== undefined) {
              var order = vm.values[-107];
              vm.values[-107] = vm.values[-107].toString().substr(4);
              if (
                $scope.listorder !== undefined &&
                vm.ordersday.length !== 0 &&
                vm.ordersday.length !== 1
              ) {
                vm.current = vm.ordersday.indexOf(order);
                vm.currentorder = vm.ordersday[vm.current];
                var currentnext =
                  vm.ordersday.length === vm.current + 1 ? 0 : vm.current + 1;
                var currentprevius =
                  0 === vm.current ? vm.ordersday.length - 1 : vm.current - 1;
                vm.next = vm.ordersday[currentnext];
                vm.previus = vm.ordersday[currentprevius];
              }
            }
            if (vm.values[-108] !== "" && vm.values[-108] !== undefined) {
              vm.dateorderentry = vm.values[-108];
            }
            if ($scope.values[-1] !== undefined && vm.values[-1] !== "") {
              if (vm.manageRate && vm.manageAccount) {
                vm.selectcustomer($scope.values[-1].id);
              }
            }
            if (vm.values[-113] !== "" && vm.values[-113] !== undefined) {
              vm.createdUser = vm.values[-113];
            }
          });

          $scope.$watch("data", function () {
            if ($scope.data.length === undefined) return;
            vm.demographics = $filter("orderBy")($scope.data, "orderingDemo");
            var codDemographic = vm.type === "H" ? -10 : -4;
            var pixelsH = "250px";
            var pixelsO = "165px";
            vm.heightTbody =
              vm.type === "H"
                ? "calc(100% - " + pixelsH + ")"
                : "calc(100% - " + pixelsO + ")";

            if (vm.type === "H") {
              if (vm.demographics.length <= 9) {
                vm.demographicsStatic = vm.demographics.slice(
                  0,
                  vm.demographics.length
                );
              } else {
                vm.demographicsStatic = vm.demographics.slice(0, 9);
                vm.demographicsScroll = vm.demographics.slice(
                  9,
                  vm.demographics.length
                );
              }
            } else {
              if (vm.demographics.length <= 5) {
                vm.demographicsStatic = vm.demographics.slice(
                  0,
                  vm.demographics.length
                );
              } else {
                vm.demographicsStatic = vm.demographics.slice(0, 5);
                vm.demographicsScroll = vm.demographics.slice(
                  5,
                  vm.demographics.length
                );
              }
            }
            var indexPhysician = _.findIndex(vm.demographics, function (o) {
              return o.id === -2;
            });
            var physician =
              indexPhysician > -1 ? vm.demographics[indexPhysician] : null;
            vm.ItemsPhysicians =
              physician !== null && physician !== undefined
                ? JSON.parse(JSON.stringify(physician.items))
                : [];
          });

          $rootScope.$watch("dataturn", function () {
            vm.dataturn = $rootScope.dataturn;
          });

          function validatedmask() {
            var validated = vm.historyFormat.split("||");
            vm.types = isJSON(validated[0]);
            vm.separatorletter =  validated[1] === undefined ? "-" : validated[1];
            keysreplace(vm.types);
            if (validated[2] === "L") {
              vm.expregnumber = new RegExp("^[a-zA-Z0-9]+$");
            } else {
              vm.expregnumber = new RegExp("^[0-9]+$");
            }
            vm.viewson=validated[4] === '-' || validated[4] === undefined ? true: false ;
            vm.sizeidentification =
              validated[3] === undefined ||
                validated[3] === null ||
                validated[3] === ""
                ? 597
                : parseInt(validated[3]);
          }

          function keysreplace(texto) {
            vm.keyscomparated = [];
            texto.forEach(function (value) {
              var letter = value[0];
              switch (letter) {
                case "A":
                  vm.keyscomparated[65] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[97] = {
                    replace: value + vm.separatorletter,
                  };
                  break;

                case "B":
                  vm.keyscomparated[66] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[98] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "C":
                  vm.keyscomparated[67] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[99] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "D":
                  vm.keyscomparated[68] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[100] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "E":
                  vm.keyscomparated[69] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[101] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "F":
                  vm.keyscomparated[70] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[102] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "G":
                  vm.keyscomparated[71] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[103] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "H":
                  vm.keyscomparated[72] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[104] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "I":
                  vm.keyscomparated[73] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[105] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "J":
                  vm.keyscomparated[74] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[106] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "K":
                  vm.keyscomparated[75] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[107] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "L":
                  vm.keyscomparated[76] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[108] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "M":
                  vm.keyscomparated[77] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[109] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "N":
                  vm.keyscomparated[78] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[110] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "O":
                  vm.keyscomparated[79] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[111] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "P":
                  vm.keyscomparated[80] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[112] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "Q":
                  vm.keyscomparated[81] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[113] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "R":
                  vm.keyscomparated[82] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[114] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "S":
                  vm.keyscomparated[83] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[115] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "T":
                  vm.keyscomparated[84] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[116] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "U":
                  vm.keyscomparated[85] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[117] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "V":
                  vm.keyscomparated[86] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[118] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "W":
                  vm.keyscomparated[87] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[119] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "X":
                  vm.keyscomparated[88] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[120] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "Y":
                  vm.keyscomparated[89] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[121] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
                case "Z":
                  vm.keyscomparated[90] = {
                    replace: value + vm.separatorletter,
                  };
                  vm.keyscomparated[122] = {
                    replace: value + vm.separatorletter,
                  };
                  break;
              }
            });
          }

          function isJSON(texto) {
            try {
              return JSON.parse(texto);
            } catch (error) {
              return ["VE", "PA", "EX"]; // Si hay un error, no es JSON válido
            }
          }

          function validatedemographictest(select) {
            if (select.originalObject.hasOwnProperty("idDemo")) {
              vm.demographicstestrelations = [];
              var idDemo = select.originalObject.idDemo;
              if (
                idDemo === vm.demographic1 ||
                idDemo === vm.demographic2 ||
                idDemo === vm.demographic3
              ) {
                var demographics = _.filter(vm.demographictest, function (o) {
                  return (
                    o.idDemographic1 === idDemo ||
                    o.idDemographic2 === idDemo ||
                    o.idDemographic3 === idDemo
                  );
                });
                if (demographics.length > 0) {
                  demographics.forEach(function (value, key) {
                    var demo1 = vm.values[value.idDemographic1];
                    var demo2 = null;
                    var demo3 = null;
                    if (value.idDemographic2 !== 0) {
                      demo2 = vm.values[value.idDemographic2];
                    }
                    if (value.idDemographic3 !== 0) {
                      demo3 = vm.values[value.idDemographic3];
                    }
                    if (
                      value.idDemographic1 !== 0 &&
                      value.idDemographic2 !== 0 &&
                      value.idDemographic3 !== 0
                    ) {
                      if (demo1 && demo2 && demo3) {
                        if (
                          demo1.id === value.valueDemographic1 &&
                          demo2.id === value.valueDemographic2 &&
                          demo3.id === value.valueDemographic3
                        ) {
                          vm.demographicstestrelations.push({
                            id: value.id,
                            tests: value.tests,
                          });
                        }
                      }
                    } else if (
                      value.idDemographic1 !== 0 &&
                      value.idDemographic2 !== 0
                    ) {
                      if (demo1 && demo2) {
                        if (
                          demo1.id === value.valueDemographic1 &&
                          demo2.id === value.valueDemographic2
                        ) {
                          vm.demographicstestrelations.push({
                            id: value.id,
                            tests: value.tests,
                          });
                        }
                      }
                    } else if (value.idDemographic1) {
                      if (demo1) {
                        if (demo1.id === value.valueDemographic1) {
                          vm.demographicstestrelations.push({
                            id: value.id,
                            tests: value.tests,
                          });
                        }
                      }
                    }
                  });
                }
              }
              if (vm.demographicstestrelations.length > 0) {
                $scope.listenerdemographic(vm.demographicstestrelations);
              }
            }
          }

          function restoreItemsPhysician() {
            var indexes = [-2, -201, -202, -203, -204, -205];
            var listPhysicians = _.chain(vm.demographics)
              .keyBy("id")
              .at(indexes)
              .value();
            listPhysicians.forEach(function (value) {
              if (value !== undefined) {
                value.items = JSON.parse(JSON.stringify(vm.ItemsPhysicians));
                value.items.forEach(function (val) {
                  val.idDemo = value.id;
                });
              }
            });
          }

          function viewnewturn(type, number, editturn2) {
            if (type === "O" && number !== undefined && number !== editturn2) {
              $rootScope.viewturnnew = true;
              return true;
            } else {
              $rootScope.viewturnnew = false;
              return false;
            }
          }
          function startChange(date) {
            if (date[vm.fechatoma] && date[vm.fechasintomas]) {
              if (date[vm.fechasintomas] > date[vm.fechatoma]) {
                date[vm.fechatoma] = null;
                date[vm.fecharesultado] = null;
                logger.error($filter("translate")("3268"));
              }
            }
            if (date[vm.fecharesultado] && date[vm.fechatoma]) {
              if (date[vm.fechatoma] > date[vm.fecharesultado]) {
                date[vm.fecharesultado] = null;
                logger.error($filter("translate")("3269"));
              }
            }

            if (
              !date[vm.fechatoma] &&
              date[vm.fechasintomas] &&
              date[vm.fecharesultado]
            ) {
              if (date[vm.fechasintomas] > date[vm.fechatoma]) {
                date[vm.fecharesultado] = null;
                logger.error($filter("translate")("3295"));
              }
            }
          }

          vm.selectcustomer = selectcustomer;
          function selectcustomer(id) {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            demographicDS.getsoonaccount(auth.authToken, id).then(
              function (data) {
                var rateitems = $filter("filter")(
                  vm.demographics,
                  function (e) {
                    return e.id === -3;
                  }
                );
                rateitems[0].items = [{}];
                if (data.status === 200) {
                  if (
                    vm.values[-3].showValue === "" ||
                    vm.values[-3].showValue === undefined
                  ) {
                    data.data.forEach(function (value, key) {
                      value.showValue =
                        value.code + ". " + value.name.toUpperCase();
                      value.idDemo = -3;
                    });
                    rateitems[0].items = data.data;
                  } else {
                    data.data.forEach(function (value, key) {
                      value.showValue =
                        value.code + ". " + value.name.toUpperCase();
                      value.idDemo = -3;
                    });
                    rateitems[0].items = data.data;
                  }
                } else {
                  rateitems[0].items = [{ showValue: "" }];
                  $scope.$broadcast("angucomplete-alt:clearInput", "demo_-3");
                  var demoexcluir = localStorageService.get(
                    "DemograficoExcluirPrueba"
                  );
                  if (
                    demoexcluir !== "" &&
                    demoexcluir !== "0" &&
                    demoexcluir !== "?"
                  ) {
                    if (-3 === parseInt(demoexcluir)) {
                      $rootScope.changueTest = 0;
                    }
                  }
                }
              },
              function (error) { }
            );
          }

          vm.selectOrdernext = selectOrdernext;
          function selectOrdernext() {
            if (
              vm.ordersday.length === 0 ||
              (vm.ordersday.length === 1 && vm.values[-107] !== "")
            ) {
            } else {
              vm.loading = true;
              if (vm.ordersday.length === 1) {
                vm.currentorder = vm.ordersday[vm.current];
                vm.next = "";
                vm.previus = "";
              } else {
                vm.current =
                  vm.ordersday.length - 1 === vm.current ||
                    vm.current === undefined
                    ? 0
                    : vm.current + 1;
                vm.currentorder = vm.ordersday[vm.current];
                var currentnext =
                  vm.ordersday.length === vm.current + 1 ? 0 : vm.current + 1;
                var currentprevius =
                  0 === vm.current ? vm.ordersday.length - 1 : vm.current - 1;
                vm.next = vm.ordersday[currentnext];
                vm.previus = vm.ordersday[currentprevius];
              }
              setTimeout(function () {
                vm.loading = false;
                $scope.listener(vm.currentorder);
              }, 100);
            }
          }

          vm.selectOrderprevius = selectOrderprevius;
          function selectOrderprevius() {
            if (vm.ordersday.length === 0 || vm.ordersday.length === 1) {
            } else {
              vm.loading = true;
              if (vm.ordersday.length === 1) {
                vm.currentorder = vm.ordersday[vm.current];
                vm.next = "";
                vm.previus = "";
              } else {
                vm.current =
                  vm.current === 0 || vm.current === undefined
                    ? vm.ordersday.length - 1
                    : vm.current - 1;
                vm.current = vm.current < 0 ? 0 : vm.current;
                vm.currentorder = vm.ordersday[vm.current];
                var currentnext =
                  vm.ordersday.length === vm.current + 1 ? 0 : vm.current + 1;
                var currentprevius =
                  0 === vm.current ? vm.ordersday.length - 1 : vm.current - 1;
                vm.next = vm.ordersday[currentnext];
                vm.previus = vm.ordersday[currentprevius];
              }
              setTimeout(function () {
                vm.loading = false;
                $scope.listener(vm.currentorder);
              }, 100);
            }
          }

          function keyselectOrder($event) {
            var dateNow = moment().format("YYYYMMDD");
            var year = moment().format("YYYY");
            var dateOrder = dateNow;
            var order = document.getElementById("demo_-107").value;
            var keyCode = $event === null ? 13 : $event.which || $event.keyCode;
            if (keyCode === 13 && order !== "") {
              vm.loading = true;
              vm.orderValue = order;
              if (vm.orderValue.length === parseInt(vm.digitsorder)) {
                order = dateOrder + vm.orderValue;
              } else if (
                vm.orderValue.length ===
                parseInt(vm.digitsorder) + 4
              ) {
                order = year + vm.orderValue;
              } else if (vm.orderValue.length < vm.digitsorder) {
                var repeat = parseInt(vm.digitsorder) - vm.orderValue.length;
                var ceros = "";
                for (var i = 0; i < repeat; i++) {
                  ceros = ceros + "0";
                }
                vm.orderValue = dateOrder + ceros + vm.orderValue.toString();

                if (repeat > 0) {
                  vm.orderValue =
                    ceros === "0000"
                      ? parseInt(vm.orderValue) + 1
                      : vm.orderValue;
                  order = vm.orderValue;
                }
              }
              vm.orderValue = order;
              orderDS.getOrder(auth.authToken, order).then(
                function (data) {
                  if (data.status === 200) {
                    vm.modalRepeat.show();
                    vm.values[-107] = "";
                    document.getElementById("demo_-107").value = "";
                    vm.loading = false;
                  } else {
                    document.getElementById("demo_-107").value = order
                      .toString()
                      .substr(4);
                    vm.values[-107] = order.toString().substr(4);
                    vm.loading = false;
                    setTimeout(function () {
                      vm.loading = false;
                      $scope.listenerorder(order);
                    }, 100);
                  }
                  //vm.loading = false;
                },
                function (error) {
                  if (error.data === null) {
                    vm.errorservice = vm.errorservice + 1;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                    vm.loading = false;
                  }
                }
              );
            } else {
              // vm.maxLength = parseInt(vm.digitsorder);
              var expreg = new RegExp(/^[0-9]+$/);
              if (!expreg.test(String.fromCharCode(keyCode))) {
                //detener toda accion en la caja de texto   $event === undefined &&
                event.preventDefault();
              }
            }
          }
          function keyselectpatientid($event) {
            var keyCode =
              $event !== undefined ? $event.which || $event.keyCode : 13;
            if (keyCode === 13) {
              vm.searchByPatient();
            }
          }
          vm.changue = changue;
          function changue() {
            if (vm.detailitem.agreement === true) {
              vm.detailitem.invoice = false;
            }
          }

          function selectCodified(select) {
            if (select !== undefined) {
              if (select.originalObject.hasOwnProperty("idDemo")) {
                if (select.title === $filter("translate")("1539")) {
                  if (vm.demosave[0].idDemo === -1) {
                    var auth = localStorageService.get(
                      "Enterprise_NT.authorizationData"
                    );
                    vm.rates = [];
                    vm.loading = true;
                    vm.codeRepeat = false;
                    vm.nameRepeat = false;
                    vm.idcontrol = vm.demosave[0].idDemo;
                    vm.detailitem = {
                      id: null,
                      nit: vm.demosave[0].code,
                      name: vm.demosave[0].name,
                      email: "",
                      postalCode: "",
                      state: true,
                      agreement: false,
                      invoice: false,
                      user: vm.demosave[0].user,
                    };
                    $scope.$broadcast(
                      "angucomplete-alt:clearInput",
                      "demo_" + select.originalObject.idDemo
                    );
                    $scope.$apply();
                    return customerDS
                      .getrateState(auth.authToken)
                      .then(function (data) {
                        if (data.status === 200) {
                          data.data.forEach(function (value) {
                            value.apply = false;
                          });
                          vm.newrates = data.data;
                        }
                        UIkit.modal("#modaladdcustomer" + vm.idcontrol, {
                          modal: false,
                          keyboard: false,
                          bgclose: false,
                          center: true,
                        }).show();
                        vm.loading = false;
                      });
                  } else {
                    vm.loading = true;
                    vm.codeRepeat = false;
                    vm.nameRepeat = false;
                    vm.idcontrol = vm.demosave[0].demographic;
                    vm.detailitem = {
                      id: null,
                      name: vm.demosave[0].name,
                      code: "",
                      defaultItem: false,
                      description: "",
                      state: true,
                      demographic: vm.demosave[0].demographic,
                      demographicName: vm.demosave[0].demographicName,
                      user: vm.demosave[0].user,
                    };
                    $scope.$broadcast(
                      "angucomplete-alt:clearInput",
                      "demo_" + select.originalObject.idDemo
                    );
                    $scope.$apply();
                    UIkit.modal("#modaladddemo" + vm.idcontrol, {
                      modal: false,
                      keyboard: false,
                      bgclose: false,
                      center: true,
                    }).show();
                    vm.loading = false;
                  }
                } else if (
                  vm.select === "" ||
                  vm.select.originalObject.id !== select.originalObject.id
                ) {
                  var lastValue = vm.values[select.originalObject.idDemo];
                  if (
                    lastValue !== null &&
                    lastValue !== undefined &&
                    lastValue !== "" &&
                    lastValue.id !== select.originalObject.id
                  ) {
                    lastValue = _.clone(
                      vm.values[select.originalObject.idDemo]
                    );
                  } else {
                    lastValue = null;
                  }
                  vm.values[select.originalObject.idDemo] =
                    select.originalObject;
                  if (
                    select.originalObject.idDemo === -6 &&
                    vm.addtesservice &&
                    $scope.functionexecute !== undefined &&
                    $scope.saveedit
                  ) {
                    localStorageService.set(
                      "serviceidvalidated",
                      select.description.id
                    );
                    $scope.functionexecute();
                  }
                  vm.select = select;
                  var demoexcluir = localStorageService.get(
                    "DemograficoExcluirPrueba"
                  );
                  if (
                    demoexcluir !== "" &&
                    demoexcluir !== "0" &&
                    demoexcluir !== "?"
                  ) {
                    if (
                      vm.select.originalObject.idDemo === parseInt(demoexcluir)
                    ) {
                      $rootScope.changueTest = vm.select.originalObject.id;
                    }
                  }
                  var auth = localStorageService.get(
                    "Enterprise_NT.authorizationData"
                  );
                  if (select.description.idDemo === -1) {
                    vm.values[-3] = "";
                    $scope.$broadcast("angucomplete-alt:clearInput", "demo_-3");
                    var rateitems = $filter("filter")(
                      vm.demographics,
                      function (e) {
                        return e.id === -3;
                      }
                    );
                    rateitems[0].items = [{}];
                    demographicDS
                      .getsoonaccount(auth.authToken, select.description.id)
                      .then(
                        function (data) {
                          vm.demodepen(auth, select);
                          if (data.status === 200) {
                            data.data.forEach(function (value, key) {
                              value.showValue =
                                value.code + ". " + value.name.toUpperCase();
                              value.idDemo = -3;
                            });
                            rateitems[0].items = data.data;
                          } else {
                            rateitems[0].items = [{ showValue: "" }];
                            $scope.$broadcast(
                              "angucomplete-alt:clearInput",
                              "demo_-3"
                            );
                          }
                        },
                        function (error) { }
                      );
                  } else if (
                    select.description.idDemo === -3 &&
                    !vm.manageAccount
                  ) {
                    vm.demodepen(auth, select);
                    vm.loading = false;
                  } else {
                    vm.demodepen(auth, select);

                    if (vm.isAuxPhysicians) {
                      vm.validateAuxPhysicians(select, lastValue);
                    }
                  }
                }
              }
              if (
                localStorageService.get("ExamenesPorDemografico") === "True"
              ) {
                vm.validatedemographictest(select);
              }
            }
          }

          vm.validateAuxPhysicians = validateAuxPhysicians;
          function validateAuxPhysicians(select, lastValue) {
            var indexes = [-2, -201, -202, -203, -204, -205];
            var idDemo = select.description.idDemo;
            var findIndexSelected = _.findIndex(indexes, function (o) {
              return o === parseInt(idDemo);
            });

            if (findIndexSelected > -1) {
              indexes.splice(findIndexSelected, 1);
              var demo =
                $scope.depen === undefined ? vm.demographics : $scope.depen;
              var listPhysicians = _.chain(demo)
                .keyBy("id")
                .at(indexes)
                .value();

              var lastItem = null;
              if (
                lastValue !== null &&
                lastValue !== undefined &&
                lastValue !== ""
              ) {
                var indexLastValue = _.findIndex(
                  vm.ItemsPhysicians,
                  function (o) {
                    return o.id === lastValue.id;
                  }
                );
                if (indexLastValue > -1) {
                  lastItem = vm.ItemsPhysicians[indexLastValue];
                }
              }

              listPhysicians.forEach(function (value) {
                if (value !== undefined) {
                  var indexSelected = _.findIndex(value.items, function (o) {
                    return o.id === select.description.id;
                  });
                  if (indexSelected > -1) value.items.splice(indexSelected, 1);
                  if (lastItem !== null) {
                    if (
                      !_.find(value.items, function (o) {
                        return o.id === lastItem.id;
                      })
                    ) {
                      lastItem.idDemo = value.id;
                      value.items.splice(
                        indexLastValue + 1,
                        0,
                        JSON.parse(JSON.stringify(lastItem))
                      );
                    }
                  }
                  if (value.items.length === 0) {
                    value.items = [{}];
                  }
                }
              });
            }
          }

          vm.removeAuxPhysicians = removeAuxPhysicians;
          function removeAuxPhysicians() {
            var indexes = [-2, -201, -202, -203, -204, -205];
            indexes.forEach(function (index) {
              var indexesAux = [-2, -201, -202, -203, -204, -205];
              var findIndex = _.findIndex(indexesAux, function (o) {
                return o === index;
              });
              if (findIndex > -1) {
                indexesAux.splice(findIndex, 1);
                var demo =
                  $scope.depen === undefined ? vm.demographics : $scope.depen;
                var listPhysicians = _.chain(demo)
                  .keyBy("id")
                  .at(indexesAux)
                  .value();
                if (listPhysicians) {
                  listPhysicians.forEach(function (value) {
                    if (value !== undefined) {
                      var indexSelected = _.findIndex(
                        value.items,
                        function (o) {
                          return o.id === vm.values[index].id;
                        }
                      );
                      if (indexSelected > -1)
                        value.items.splice(indexSelected, 1);
                      if (value.items.length === 0) {
                        value.items = [{}];
                      }
                    }
                  });
                }
              }
            });
          }

          vm.demodepen = demodepen;
          function demodepen(auth, select) {
            demographicDS
              .getDemographicdepency(
                auth.authToken,
                select.description.idDemo,
                select.description.id
              )
              .then(
                function (data) {
                  vm.loading = false;
                  if (data.status === 200) {
                    if (data.data.demographicSonItems.length !== 0) {
                      var demo =
                        $scope.depen === undefined
                          ? vm.demographics
                          : $scope.depen;
                      var filter = $filter("filter")(demo, function (e) {
                        return e.id === data.data.idDemographicSon;
                      });
                      if (filter[0].listitemsdepen === undefined) {
                        var dataitems = filter[0].items;
                        var laboratorio = [];
                        data.data.demographicSonItems.forEach(function (
                          value,
                          key
                        ) {
                          var object = $filter("filter")(
                            filter[0].items,
                            function (e) {
                              return e.id === value;
                            }
                          )[0];
                          if (object !== undefined) {
                            laboratorio.push(object);
                          }
                        });
                        filter[0].items = laboratorio;
                        filter[0].listitemsdepen = dataitems;
                      } else {
                        var laboratorio = [];
                        data.data.demographicSonItems.forEach(function (
                          value,
                          key
                        ) {
                          var object = $filter("filter")(
                            filter[0].listitemsdepen,
                            function (e) {
                              return e.id === value;
                            }
                          )[0];
                          if (object !== undefined) {
                            laboratorio.push(object);
                          }
                        });
                        if (laboratorio.length === 0) {
                          $scope.$broadcast(
                            "angucomplete-alt:clearInput",
                            "demo_" + value
                          );
                        } else {
                          filter[0].items = _.clone(laboratorio);
                        }
                        //Medicos Auxiliares
                        if (filter[0].id === -2 && vm.isAuxPhysicians) {
                          var listPhysicians = _.chain(demo)
                            .keyBy("id")
                            .at(vm.indexesAuxPhysician)
                            .value();
                          listPhysicians.forEach(function (value) {
                            if (value !== undefined) {
                              var itemsDemo = _.clone(laboratorio);
                              itemsDemo.forEach(function (val) {
                                val.idDemo = value.id;
                              });
                              value.items = itemsDemo;
                            }
                          });
                          vm.ItemsPhysicians = _.clone(laboratorio);
                        }

                        //Medicos Auxiliares
                        if (data.data.idDemographicSon === -2) {
                          vm.indexesAuxPhysician.forEach(function (value) {
                            if (vm.values[value]) {
                              $scope.$broadcast(
                                "angucomplete-alt:clearInput",
                                "demo_" + value
                              );
                              vm.values[value] = undefined;
                            }
                          });
                        }

                        if (
                          vm.values[data.data.idDemographicSon].id !== undefined
                        ) {
                          var changedemographi = $filter("filter")(
                            laboratorio,
                            function (e) {
                              return (
                                e.id ===
                                vm.values[data.data.idDemographicSon].id
                              );
                            }
                          );
                          if (changedemographi.length === 0) {
                            $scope.$broadcast(
                              "angucomplete-alt:clearInput",
                              "demo_" + data.data.idDemographicSon
                            );
                            var demoexcluir = localStorageService.get(
                              "DemograficoExcluirPrueba"
                            );
                            if (
                              demoexcluir !== "" &&
                              demoexcluir !== "0" &&
                              demoexcluir !== "?"
                            ) {
                              if (
                                data.data.idDemographicSon ===
                                parseInt(demoexcluir)
                              ) {
                                $rootScope.changueTest = 0;
                              }
                            }
                            var auth = localStorageService.get(
                              "Enterprise_NT.authorizationData"
                            );
                            return demographicDS
                              .getDemographicsoon(
                                auth.authToken,
                                data.data.idDemographicSon
                              )
                              .then(
                                function (data) {
                                  if (data.data !== 0) {
                                    $scope.$broadcast(
                                      "angucomplete-alt:clearInput",
                                      "demo_" + data.data
                                    );
                                    var demoexcluir = localStorageService.get(
                                      "DemograficoExcluirPrueba"
                                    );
                                    if (
                                      demoexcluir !== "" &&
                                      demoexcluir !== "0" &&
                                      demoexcluir !== "?"
                                    ) {
                                      if (data.data === parseInt(demoexcluir)) {
                                        $rootScope.changueTest = 0;
                                      }
                                    }
                                  }
                                },
                                function (error) { }
                              );
                          }
                        }
                      }
                    } else {
                      if (data.data.idDemographicSon !== 0) {
                        var demo =
                          $scope.depen === undefined
                            ? vm.demographics
                            : $scope.depen;
                        var filter = $filter("filter")(demo, function (e) {
                          return e.id === data.data.idDemographicSon;
                        });
                        if (filter[0].listitemsdepen === undefined) {
                          var dataitems = filter[0].items;
                          filter[0].items = [{}];
                          filter[0].listitemsdepen = dataitems;
                        } else {
                          filter[0].items = [{}];

                          //Medicos Auxiliares
                          if (filter[0].id === -2 && vm.isAuxPhysicians) {
                            var listPhysicians = _.chain(demo)
                              .keyBy("id")
                              .at(vm.indexesAuxPhysician)
                              .value();
                            listPhysicians.forEach(function (value) {
                              if (value !== undefined) {
                                value.items = [{}];
                              }
                            });
                            vm.ItemsPhysicians = [{}];
                          }
                        }
                        $scope.$broadcast(
                          "angucomplete-alt:clearInput",
                          "demo_" + data.data.idDemographicSon
                        );
                        var demoexcluir = localStorageService.get(
                          "DemograficoExcluirPrueba"
                        );
                        if (
                          demoexcluir !== "" &&
                          demoexcluir !== "0" &&
                          demoexcluir !== "?"
                        ) {
                          if (
                            data.data.idDemographicSon === parseInt(demoexcluir)
                          ) {
                            $rootScope.changueTest = 0;
                          }
                        }
                      }
                    }
                  }
                },
                function (error) { }
              );
          }

          vm.demodepenload = demodepenload;
          function demodepenload(auth, select) {
            demographicDS
              .getDemographicdepency(
                auth.authToken,
                select.description.idDemo,
                select.description.id
              )
              .then(
                function (data) {
                  vm.loading = false;
                  if (data.status === 200) {
                    if (data.data.demographicSonItems.length !== 0) {
                      var demo =
                        $scope.depen === undefined
                          ? vm.demographics
                          : $scope.depen;
                      var filter = $filter("filter")(demo, function (e) {
                        return e.id === data.data.idDemographicSon;
                      });
                      if (filter[0].listitemsdepen === undefined) {
                        var dataitems = filter[0].items;
                        var laboratorio = [];
                        data.data.demographicSonItems.forEach(function (
                          value,
                          key
                        ) {
                          var object = $filter("filter")(
                            filter[0].items,
                            function (e) {
                              return e.id === value;
                            }
                          )[0];
                          if (object !== undefined) {
                            laboratorio.push(object);
                          }
                        });
                        filter[0].items = laboratorio;
                        filter[0].listitemsdepen = dataitems;
                      } else {
                        var laboratorio = [];
                        data.data.demographicSonItems.forEach(function (
                          value,
                          key
                        ) {
                          var object = $filter("filter")(
                            filter[0].listitemsdepen,
                            function (e) {
                              return e.id === value;
                            }
                          )[0];
                          if (object !== undefined) {
                            laboratorio.push(object);
                          }
                        });

                        filter[0].items = _.clone(laboratorio);

                        //Medicos Auxiliares
                        if (filter[0].id === -2 && vm.isAuxPhysicians) {
                          var listPhysicians = _.chain(demo)
                            .keyBy("id")
                            .at(vm.indexesAuxPhysician)
                            .value();
                          listPhysicians.forEach(function (value) {
                            if (value !== undefined) {
                              var itemsDemo = _.clone(laboratorio);
                              itemsDemo.forEach(function (val) {
                                val.idDemo = value.id;
                              });
                              value.items = itemsDemo;
                            }
                          });

                          vm.ItemsPhysicians = _.clone(laboratorio);
                          vm.removeAuxPhysicians();
                        }

                        //Medicos Auxiliares
                        if (data.data.idDemographicSon === -2) {
                          vm.indexesAuxPhysician.forEach(function (value) {
                            if (vm.values[value]) {
                              var changedemographi = $filter("filter")(
                                laboratorio,
                                function (e) {
                                  return e.id === vm.values[value].id;
                                }
                              );
                              if (changedemographi.length === 0) {
                                $scope.$broadcast(
                                  "angucomplete-alt:clearInput",
                                  "demo_" + value
                                );
                              }
                            }
                          });
                        }
                      }
                    } else {
                      if (data.data.idDemographicSon !== 0) {
                        var demo =
                          $scope.depen === undefined
                            ? vm.demographics
                            : $scope.depen;
                        var filter = $filter("filter")(demo, function (e) {
                          return e.id === data.data.idDemographicSon;
                        });
                        if (filter[0].listitemsdepen === undefined) {
                          var dataitems = filter[0].items;
                          filter[0].items = [{}];
                          filter[0].listitemsdepen = dataitems;
                        } else {
                          filter[0].items = [{}];

                          //Medicos Auxiliares
                          if (filter[0].id === -2 && vm.isAuxPhysicians) {
                            var listPhysicians = _.chain(demo)
                              .keyBy("id")
                              .at(vm.indexesAuxPhysician)
                              .value();
                            listPhysicians.forEach(function (value) {
                              if (value !== undefined) {
                                value.items = [{}];
                              }
                            });
                            vm.ItemsPhysicians = [{}];
                          }
                        }
                      }
                    }
                  }
                },
                function (error) { }
              );
          }

          vm.validatesstyle = validatesstyle;
          function validatesstyle() {
            var viewstyle = $filter("filter")(vm.newrates, function (e) {
              return e.apply === true;
            });
            if (viewstyle.length === 0) {
              return true;
            } else {
              return false;
            }
          }
          vm.adddemo = adddemo;
          function adddemo(DemographicsItemsForm) {
            vm.loading = true;
            vm.codeRepeat = false;
            vm.nameRepeat = false;
            DemographicsItemsForm.code.$touched = true;
            DemographicsItemsForm.name.$touched = true;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            if (DemographicsItemsForm.$valid) {
              DemographicsItemsForm.$setUntouched();
              return demographicsItemDS
                .NewDemographicsItems(auth.authToken, vm.detailitem)
                .then(
                  function (data) {
                    if (data.status === 200) {
                      var dataadddemo = data.data;
                      dataadddemo.idDemo = dataadddemo.demographic;
                      dataadddemo.name = dataadddemo.name;
                      dataadddemo.showValue =
                        dataadddemo.code + ". " + dataadddemo.name;

                      var additem = $filter("filter")(
                        vm.demographics,
                        function (e) {
                          return e.id === dataadddemo.demographic;
                        }
                      )[0];

                      additem.items.push(dataadddemo);
                      var object = {
                        showValue: dataadddemo.showValue,
                        name: dataadddemo.name,
                        id: dataadddemo.id,
                        code: dataadddemo.code,
                      };

                      $scope.$broadcast(
                        "angucomplete-alt:changeInput",
                        "demo_" + dataadddemo.demographic,
                        object
                      );
                      vm.values[dataadddemo.demographic] = object;
                      UIkit.modal("#modaladddemo" + vm.idcontrol).hide();
                      vm.loading = false;
                    }
                    vm.loading = false;
                  },
                  function (error) {
                    vm.loading = false;
                    if (error.data !== null) {
                      if (error.data.code === 2) {
                        error.data.errorFields.forEach(function (value) {
                          var item = value.split("|");
                          if (item[0] === "1" && item[1] === "Code") {
                            vm.codeRepeat = true;
                          }
                          if (item[0] === "1" && item[1] === "Name") {
                            vm.nameRepeat = true;
                          }
                        });
                      }
                    }
                    if (vm.codeRepeat === false && vm.nameRepeat === false) {
                      vm.Error = error;
                      vm.ShowPopupError = true;
                    }
                  }
                );
            } else {
              vm.loading = false;
            }
          }
          vm.adddemocutomer = adddemocutomer;
          function adddemocutomer(DemographicsItemsForm) {
            vm.loading = true;
            vm.codeRepeat = false;
            vm.nameRepeat = false;
            vm.emailInvalid = false;
            DemographicsItemsForm.code.$touched = true;
            DemographicsItemsForm.name.$touched = true;
            DemographicsItemsForm.namePrint.$touched = true;
            DemographicsItemsForm.email.$touched = true;
            DemographicsItemsForm.postalCode.$touched = true;
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            if (DemographicsItemsForm.$valid) {
              DemographicsItemsForm.$setUntouched();
              vm.detailitem.user = { id: auth.id };
              return customerDS.newCustomer(auth.authToken, vm.detailitem).then(
                function (data) {
                  if (data.status === 200) {
                    var dataadddemo = data.data;
                    dataadddemo.idDemo = -1;
                    dataadddemo.name = dataadddemo.name;
                    dataadddemo.showValue = (
                      dataadddemo.nit +
                      ". " +
                      dataadddemo.name
                    ).toUpperCase();
                    var additem = $filter("filter")(
                      vm.demographics,
                      function (e) {
                        return e.id === -1;
                      }
                    )[0];
                    additem.items.push(dataadddemo);
                    var object = {
                      showValue: dataadddemo.showValue.toUpperCase(),
                      name: dataadddemo.name,
                      id: dataadddemo.id,
                      code: dataadddemo.nit,
                    };

                    var additem1 = $filter("filter")(
                      vm.demographics,
                      function (e) {
                        return e.id === -3;
                      }
                    )[0];

                    var rate = [];
                    var rateitems = [];
                    var auth = localStorageService.get(
                      "Enterprise_NT.authorizationData"
                    );
                    vm.newrates.forEach(function (value, key) {
                      if (value.apply === true) {
                        var object = {
                          user: {
                            id: auth.id,
                          },
                          account: {
                            id: data.data.id,
                            name: data.data.name,
                          },
                          rate: {
                            id: value.id,
                            name: value.name,
                          },
                          apply: value.apply,
                        };
                        rate.push(object);
                        var object1 = {
                          showValue:
                            value.code + ". " + value.name.toUpperCase(),
                          name: value.name,
                          id: value.id,
                          code: value.code,
                        };
                        rateitems.push(object1);
                      }
                    });
                    additem1.items = rateitems;
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_" + dataadddemo.idDemo,
                      object
                    );
                    vm.values[-1] = object;
                    UIkit.modal("#modaladdcustomer" + vm.idcontrol).hide();
                    vm.saveratecustomer(rate);
                    vm.loading = false;
                  }
                  vm.loading = false;
                },
                function (error) {
                  vm.loading = false;
                  if (error.data !== null) {
                    if (error.data.code === 2) {
                      error.data.errorFields.forEach(function (value) {
                        var item = value.split("|");
                        if (item[0] === "1" && item[1] === "name") {
                          vm.nameRepeat = true;
                        }
                        if (item[0] === "1" && item[1] === "nit") {
                          vm.codeRepeat = true;
                        }
                        if (item[0] === "1" && item[1] === "email") {
                          vm.emailInvalid = true;
                        }
                      });
                    }
                  }
                  if (
                    vm.codeRepeat === false &&
                    vm.nameRepeat === false &&
                    vm.emailInvalid === false
                  ) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  }
                }
              );
            } else {
              vm.loading = false;
            }
          }
          vm.saveratecustomer = saveratecustomer;
          function saveratecustomer(rate) {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return customerDS.newCustomerate(auth.authToken, rate).then(
              function (data) {
                var data = data.data;
              },
              function (error) {
                var error = error;
              }
            );
          }
          vm.inputChangedDemographics = function (text, id) {
            vm.select = "";
          };

          function focusOutListDemographics(id, idOrigin) {
            if (vm.listtestfilter.length === 0) {
              $scope.$broadcast("angucomplete-alt:clearInput", "demo_" + id);
            }
            vm.validateDelete(id, idOrigin);
          }

          function focusInListDemographics(id, listdemographics) {
            var listtestfilter = [];
            var text = document.getElementById("demo_" + id + "_value").value;

            listtestfilter = _.filter(listdemographics, function (color) {
              return (
                (color.code + ". " + color.name)
                  .toUpperCase()
                  .indexOf(text.toUpperCase()) !== -1
              );
            });

            listtestfilter = listtestfilter.splice(0, 150);
            vm.listtestfilter = listtestfilter;
          }

          function focusInListDemographicscode(id, listdemographics) {
            var listtestfilter = [];
            var text = document.getElementById("demo_" + id + "_value").value;

            listtestfilter = _.filter(listdemographics, function (color) {
              return (
                color.name.toUpperCase().indexOf(text.toUpperCase()) !== -1
              );
            });

            listtestfilter = listtestfilter.splice(0, 150);
            vm.listtestfilter = listtestfilter;
          }

          function validateddate(demographic) {
            if (demographic.id === -105) {
              if (vm.values[-105] === null) {
                vm.values[-110] = null;
              } else {
                vm.values[-110] = common.getAge(
                  moment(vm.values[-105]).format(vm.formatDate.toUpperCase()),
                  vm.formatDate.toUpperCase()
                );
              }
            }
          }

          vm.keyselect = keyselect;
          function keyselect($event, demo) {
            if (
              demo.id == -100 &&
              vm.historyFormat !== null &&
              vm.historyFormat !== "" &&
              vm.historyFormat !== undefined &&
              vm.validatedFormat
            ) {
              var posicionCursor = $event.target.selectionStart;
              var keyCode = $event.which || $event.keyCode;
              if (
                vm.values[-100] === "" ||
                vm.values[-100] === null ||
                vm.values[-100] === undefined
              ) {
                if (vm.keyscomparated[keyCode] === undefined) {
                  $event.preventDefault();
                } else {
                  vm.values[-100] = vm.keyscomparated[keyCode].replace;
                  $event.preventDefault();
                }
              } else {
                if (vm.values[-100].length === 1) {
                  var searchletter = _.filter(vm.types, function (o) {
                    return o.startsWith(vm.values[-100]);
                  });
                  vm.values[-100] = searchletter[0] + vm.separatorletter;
                } else if (vm.values[-100].length === 2) {
                  var searchletter = _.filter(vm.types, function (o) {
                    return o.startsWith(vm.values[-100][0]);
                  });
                  vm.values[-100] = searchletter[0] + vm.separatorletter;
                }
                if(vm.separatorletter === ''){
                  var sizekeys = vm.values[-100].slice(3,vm.values[-100].length) + String.fromCharCode(keyCode);
                 if (
                    sizekeys.length <= parseInt(vm.sizeidentification)
                  ) {
                    if (!vm.expregnumber.test(sizekeys)) {
                      //detener toda accion en la caja de texto
                      $event.preventDefault();
                    }
                  } else {
                    $event.preventDefault();
                  }
                }else{
                  var comparated = vm.values[-100].split(vm.separatorletter);
                  if (keyCode === 45 && comparated.length === 3 && posicionCursor >= 4 && vm.viewson)
                    $event.preventDefault();
                  if (keyCode === 45 && comparated.length === 2 && posicionCursor >= 4 && vm.viewson) {
                  } else if (comparated.length === 2 && posicionCursor < 3) {
                    if (vm.keyscomparated[keyCode] === undefined) {
                      $event.preventDefault();
                    } else {
                      vm.values[-100] =
                        vm.keyscomparated[keyCode].replace + comparated[1];
                      $event.preventDefault();
                    }
                  } else if (comparated.length === 2 && posicionCursor >= 3 ) {
                    var sizekeys = comparated[1] + String.fromCharCode(keyCode);
                    if (
                      comparated[1] === "" ||
                      comparated[1] === null ||
                      comparated[1] === undefined
                    ) {
                      if (!vm.expregnumber.test(String.fromCharCode(keyCode))) {
                        //detener toda accion en la caja de texto
                        $event.preventDefault();
                      }
                    } else if (
                      sizekeys.length <= parseInt(vm.sizeidentification)
                    ) {
                      if (!vm.expregnumber.test(sizekeys)) {
                        //detener toda accion en la caja de texto
                        $event.preventDefault();
                      }
                    } else {
                      $event.preventDefault();
                    }
                  } else {
                    if (vm.values[-100].indexOf(vm.separatorletter) === -1) {
                      var searchletter = _.filter(vm.types, function (o) {
                        return o.startsWith(vm.values[-100][0]);
                      });
                      if (searchletter.length === 0) {
                        vm.values[-100] =
                          vm.types[0] + vm.separatorletter + vm.values[-100];
                      } else {
                        if (searchletter[0] === vm.values[-100].slice(0, 2)) {
                          vm.values[-100] =
                            searchletter[0] +
                            vm.separatorletter +
                            vm.values[-100].slice(2, vm.values[-100].length);
                        } else if (
                          searchletter[0].slice(0, 1) ===
                          vm.values[-100].slice(0, 1)
                        ) {
                          vm.values[-100] =
                            searchletter[0] +
                            vm.separatorletter +
                            vm.values[-100].slice(1, vm.values[-100].length);
                        }
                      }
                    } else {
                      if (posicionCursor <= 3) {
                        if (vm.keyscomparated[keyCode] === undefined) {
                          $event.preventDefault();
                        } else {
                          vm.values[-100] = vm.keyscomparated[keyCode].replace;
                          $event.preventDefault();
                        }
                      }
                    }
                  }
                }                
              }
            }
          }

          function selectNotCodified(event, demographic, value) {
            if (event.keyCode === 13 || event.keyCode === 9) {
              if (demographic === -100) {
                if (vm.values[-100] !== "") {
                  if (vm.integrationMINSA && vm.showDocumentType) {
                    if (
                      vm.values[-10].id === 2 ||
                      vm.values[-10].id === 6 ||
                      vm.values[-10].id === 9
                    ) {
                      var expreg = new RegExp(
                        /^(PE|E|N|[23456789](?:AV|PI)?|1[0123]?(?:AV|PI)?)-(\d{1,4})-(\d{1,6})$/i
                      );
                      if (expreg.test(vm.values[-100])) {
                        vm.RegExp = false;
                        $scope.selectedpatientid();
                      } else {
                        vm.RegExp = true;
                      }
                    } else {
                      $scope.selectedpatientid();
                    }
                  } else {
                    $scope.selectedpatientid();
                  }
                }
              } else if (demographic === -110) {
                // getDOB
                if (vm.values[-110] !== null) {
                  vm.values[-105] = common.getDOB(
                    vm.values[-110],
                    vm.formatDate.toUpperCase()
                  );
                }
              }
            }
          }

          function closemodalrepeat() {
            vm.modalRepeat.hide();
            document.getElementById("demo_-107").focus();
          }

          function selectDate() {
            $scope.listenerdate(vm.selectedDate);
          }

          function maskEvent(id, inputName, mask, evt) {
            if (mask !== undefined && mask !== "") {
              try {
                var text = document.getElementById(inputName);
                var value = text.value;

                // If user pressed DEL or BACK SPACE, clean the value
                try {
                  var e = evt.which ? evt.which : event.keyCode;
                  if (e == 46 || e == 8) {
                    text.value = "";
                    vm.values[id] = "";
                    return;
                  }
                } catch (e1) { }

                var literalPattern = /[0\*]/;
                var numberPattern = /[0-9]/;
                var newValue = "";

                for (var vId = 0, mId = 0; mId < mask.length;) {
                  if (mId >= value.length) break;

                  // Number expected but got a different value, store only the valid portion
                  if (
                    mask[mId] == "0" &&
                    value[vId].match(numberPattern) == null
                  ) {
                    break;
                  }

                  // Found a literal
                  while (mask[mId].match(literalPattern) == null) {
                    if (value[vId] == mask[mId]) break;

                    newValue += mask[mId++];
                  }

                  newValue += value[vId++];
                  mId++;
                }

                text.value = newValue;
              } catch (e) { }
            }
          }

          function validateDelete(id, idOrigin) {
            if (
              document.getElementById("demo_" + id + "_value").value ===
              $filter("translate")("1539")
            ) {
              vm.loading = true;
              vm.codeRepeat = false;
              vm.nameRepeat = false;
              $scope.$broadcast("angucomplete-alt:clearInput", "demo_" + id);
              vm.idcontrol = vm.demosave[0].demographic;
              vm.detailitem = {
                id: null,
                name: vm.demosave[0].name,
                code: "",
                defaultItem: false,
                description: "",
                state: true,
                demographic: vm.demosave[0].demographic,
                demographicName: vm.demosave[0].demographicName,
                user: vm.demosave[0].user,
              };
              $scope.$apply();
              UIkit.modal("#modaladddemo" + vm.idcontrol, {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
              }).show();
              vm.loading = false;
            } else {
              var filterDemo = $filter("filter")(vm.demographics, function (e) {
                return e.idOrigin === idOrigin;
              })[0];

              var foundItems = $filter("filter")(filterDemo.items, {
                showValue: document.getElementById("demo_" + id + "_value")
                  .value,
              });

              if (
                document.getElementById("demo_" + id + "_value").value === "" ||
                foundItems.length === 0
              ) {
                var object = {
                  showValue: "",
                  id: undefined,
                  name: "",
                  code: undefined,
                };
                var lastValue = _.clone(vm.values[id]);
                vm.values[id] = object;
                $scope.$broadcast(
                  "angucomplete-alt:changeInput",
                  "demo_" + id,
                  object
                );

                var demoexcluir = localStorageService.get(
                  "DemograficoExcluirPrueba"
                );
                if (
                  demoexcluir !== "" &&
                  demoexcluir !== "0" &&
                  demoexcluir !== "?"
                ) {
                  if (id === parseInt(demoexcluir)) {
                    $rootScope.changueTest = 0;
                  }
                }

                if (
                  id === -6 &&
                  vm.addtesservice &&
                  $scope.functionexecute !== undefined &&
                  $scope.saveedit
                ) {
                  localStorageService.set("serviceidvalidated", "");
                  $scope.functionexecute();
                }
                if (
                  vm.isAuxPhysicians &&
                  (id === -2 ||
                    id === -201 ||
                    id === -202 ||
                    id === -203 ||
                    id === -204 ||
                    id === -205)
                ) {
                  var select = {
                    description: {
                      id: 0,
                      idDemo: id,
                    },
                  };
                  vm.validateAuxPhysicians(select, lastValue);
                }
              } else {
                var foundDemo = foundItems[0];
                var demoexcluir = localStorageService.get(
                  "DemograficoExcluirPrueba"
                );
                if (
                  demoexcluir !== "" &&
                  demoexcluir !== "0" &&
                  demoexcluir !== "?"
                ) {
                  if (foundDemo.idDemo === parseInt(demoexcluir)) {
                    $rootScope.changueTest = foundDemo.id;
                  }
                }
                var object = {
                  showValue: foundDemo.showValue,
                  name: foundDemo.name,
                  id: foundDemo.id,
                  code: foundDemo.code,
                };
                $scope.$broadcast(
                  "angucomplete-alt:changeInput",
                  "demo_" + id,
                  object
                );
                vm.values[id] = object;
                var auth = localStorageService.get(
                  "Enterprise_NT.authorizationData"
                );
                if (
                  id === -6 &&
                  vm.addtesservice &&
                  $scope.functionexecute !== undefined &&
                  $scope.saveedit
                ) {
                  localStorageService.set("serviceidvalidated", object.id);
                  $scope.functionexecute();
                }
                if (id === -1) {
                  vm.values[-3] = "";
                  $scope.$broadcast("angucomplete-alt:clearInput", "demo_-3");
                  var rateitems = $filter("filter")(
                    vm.demographics,
                    function (e) {
                      return e.id === -3;
                    }
                  );
                  // rateitems[0].items = [{}];
                  demographicDS
                    .getsoonaccount(auth.authToken, foundDemo.id)
                    .then(
                      function (data) {
                        if (data.status === 200) {
                          data.data.forEach(function (value, key) {
                            value.showValue =
                              value.code + ". " + value.name.toUpperCase();
                            value.idDemo = -3;
                          });
                          rateitems[0].items = data.data;
                        } else {
                          rateitems[0].items = [{ showValue: "" }];
                          $scope.$broadcast(
                            "angucomplete-alt:clearInput",
                            "demo_-3"
                          );
                          var demoexcluir = localStorageService.get(
                            "DemograficoExcluirPrueba"
                          );
                          if (
                            demoexcluir !== "" &&
                            demoexcluir !== "0" &&
                            demoexcluir !== "?"
                          ) {
                            if (-3 === parseInt(demoexcluir)) {
                              $rootScope.changueTest = 0;
                            }
                          }
                        }
                        var select = {
                          title: foundDemo.showValue,
                          description: {
                            id: foundDemo.id,
                            code: foundDemo.code,
                            name: foundDemo.name,
                            state: false,
                            idDemo: id,
                            showValue: foundDemo.showValue,
                          },
                          originalObject: {
                            id: foundDemo.id,
                            code: foundDemo.code,
                            name: foundDemo.name,
                            state: false,
                            idDemo: id,
                            showValue: foundDemo.showValue,
                          },
                        };
                        vm.demodepen(auth, select);
                      },
                      function (error) { }
                    );
                } else if (id === -3 && !vm.manageAccount) {
                  var select = {
                    title: foundDemo.showValue,
                    description: {
                      id: foundDemo.id,
                      code: foundDemo.code,
                      name: foundDemo.name,
                      state: false,
                      idDemo: id,
                      showValue: foundDemo.showValue,
                    },
                    originalObject: {
                      id: foundDemo.id,
                      code: foundDemo.code,
                      name: foundDemo.name,
                      state: false,
                      idDemo: id,
                      showValue: foundDemo.showValue,
                    },
                  };
                  vm.demodepen(auth, select);
                  vm.loading = false;
                } else {
                  var select = {
                    title: foundDemo.showValue,
                    description: {
                      id: foundDemo.id,
                      code: foundDemo.code,
                      name: foundDemo.name,
                      state: false,
                      idDemo: id,
                      showValue: foundDemo.showValue,
                    },
                    originalObject: {
                      id: foundDemo.id,
                      code: foundDemo.code,
                      name: foundDemo.name,
                      state: false,
                      idDemo: id,
                      showValue: foundDemo.showValue,
                    },
                  };
                  vm.demodepen(auth, select);
                }
              }
            }
          }

          function getDocumentType() {
            if (vm.showDocumentType) {
              documenttypesDS.getstatetrue(auth.authToken).then(
                function (data) {
                  if (data.status === 200) {
                    vm.listDocumentType = data.data;
                    vm.lastNameToSearch = null;
                    vm.surNameToSearch = null;
                    vm.name1ToSearch = null;
                    vm.name2ToSearch = null;
                    vm.selectedDateSerch = null;
                    vm.listpatients = [];
                    $scope.eventnew();
                    UIkit.modal("#modalsearchpatient", {
                      modal: false,
                      keyboard: false,
                      bgclose: false,
                      center: true,
                    }).show();
                  }
                },
                function (error) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                }
              );
            } else {
              vm.lastNameToSearch = null;
              vm.surNameToSearch = null;
              vm.name1ToSearch = null;
              vm.name2ToSearch = null;
              vm.selectedDateSerch = null;
              vm.listpatients = [];
              $scope.eventnew();
              UIkit.modal("#modalsearchpatient", {
                modal: false,
                keyboard: false,
                bgclose: false,
                center: true,
              }).show();
            }
          }

          function searchByPatient() {
            vm.loadingsearchpatient = true;
            vm.listpatients = [
              {
                id: 0,
              },
            ];

            vm.selectedDateSerch = moment(
              vm.selectedDateSerch,
              vm.formatDate,
              true
            ).isValid()
              ? vm.selectedDateSerch
              : " ";
            var birthday = moment(
              vm.selectedDateSerch,
              vm.formatDate,
              true
            ).isValid()
              ? new Date(moment(vm.selectedDateSerch).format()).getTime()
              : 0;

            vm.lastNameToSearch =
              vm.lastNameToSearch === undefined ||
                vm.lastNameToSearch === "" ||
                vm.lastNameToSearch === null
                ? " "
                : vm.lastNameToSearch;
            vm.surNameToSearch =
              vm.surNameToSearch === undefined ||
                vm.surNameToSearch === "" ||
                vm.surNameToSearch === null
                ? " "
                : vm.surNameToSearch;
            vm.name1ToSearch =
              vm.name1ToSearch === undefined ||
                vm.name1ToSearch === "" ||
                vm.name1ToSearch === null
                ? " "
                : vm.name1ToSearch;
            vm.name2ToSearch =
              vm.name2ToSearch === undefined ||
                vm.name2ToSearch === "" ||
                vm.name2ToSearch === null
                ? " "
                : vm.name2ToSearch;

            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );

            if (
              vm.lastNameToSearch !== " " ||
              vm.surNameToSearch !== " " ||
              vm.name1ToSearch !== " " ||
              vm.name2ToSearch !== " " ||
              birthday !== 0
            ) {
              //Invoca el metodo del servicio
              patientDS
                .getPatientBYDatapatient(
                  auth.authToken,
                  vm.lastNameToSearch.toUpperCase(),
                  vm.surNameToSearch.toUpperCase(),
                  vm.name1ToSearch.toUpperCase(),
                  vm.name2ToSearch.toUpperCase(),
                  birthday
                )
                .then(
                  function (data) {
                    if (data.status === 200) {
                      if (data.data.length > 0) {
                        data.data.forEach(function (element, index) {
                          element.sexdata =
                            element.sex.code === "1"
                              ? $filter("translate")("0363")
                              : element.sex.code === "2"
                                ? $filter("translate")("0362")
                                : $filter("translate")("0401");
                          element.birthdaydata = moment(
                            element.birthday
                          ).format(vm.formatDate.toUpperCase());
                        });
                        vm.listpatients = data.data;
                        vm.loadingsearchpatient = false;
                      } else {
                        vm.validhistorysearch = true;
                        vm.newhistory = vm.managehistoryauto ? "-1" : "";
                        vm.selectDocumentType = undefined;
                        setTimeout(function () {
                          vm.loadingsearchpatient = false;
                          UIkit.modal("#modalpatientnotfound", {
                            modal: false,
                            keyboard: false,
                            bgclose: false,
                            center: true,
                          }).show();
                        }, 500);
                      }
                    }
                  },
                  function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  }
                );
            }
          }

          function selectHistory(patient) {
            /* $scope.loadpatientsearch({
              patient: patient,
            }); */
            if (vm.showDocumentType) {
              vm.values[-10] = patient.documentType;
            }
            vm.values[-100] = patient.patientId;
            $scope.selectedpatientid();
            vm.loadphotopatient(patient.id);
            //setTimeout(function(){  vm.viewphoto = true; }, 1000);
            UIkit.modal("#modalpatientnotfound").hide();
            UIkit.modal("#modalsearchpatient").hide();
          }

          vm.selectSearchpatient = selectSearchpatient;
          function selectSearchpatient(patient) {
            vm.values[-100] = patient.patientId;
            if (vm.showDocumentType) {
              vm.values[-10] = patient.documentType;
            }
            $scope.selectedpatientid();
            setTimeout(function () {
              vm.loadphotopatient(patient.id);
            }, 100);
            UIkit.modal("#modalsearchpatient").hide();
            UIkit.modal("#modalsearchpatient").hide();
          }

          function validNewPatient() {
            vm.loadingsearchpatient = true;
            if (vm.showDocumentType) {
              patientDS
                .getPatientIdDocumentType(
                  auth.authToken,
                  vm.newhistory,
                  vm.selectDocumentType.id
                )
                .then(
                  function (response) {
                    vm.loadingsearchpatient = false;
                    if (response.data.length === 0) {
                      UIkit.modal("#modalpatientnotfound").hide();
                      UIkit.modal("#modalsearchpatient").hide();
                      var patient = {
                        documentType: vm.selectDocumentType,
                        patientId: vm.newhistory,
                        name1: vm.name1ToSearch,
                        name2: vm.name2ToSearch,
                        surName: vm.surNameToSearch,
                        lastName: vm.lastNameToSearch,
                        birthday:
                          vm.selectedDateSerch === " "
                            ? null
                            : moment(vm.selectedDateSerch).format(
                              vm.formatDate.toUpperCase()
                            ),
                        age:
                          vm.selectedDateSerch === " "
                            ? null
                            : common.getAge(
                              moment(vm.selectedDateSerch).format(
                                vm.formatDate.toUpperCase()
                              ),
                              vm.formatDate.toUpperCase()
                            ),
                      };
                      $scope.loadpatientsearch({
                        patient: patient,
                      });
                    } else {
                      vm.patientfound = response.data;
                      vm.validhistorysearch = false;
                    }
                  },
                  function (error) {
                    vm.loadingsearchpatient = false;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  }
                );
            } else {
              patientDS
                .getPatientNumDocument(auth.authToken, vm.newhistory)
                .then(
                  function (response) {
                    vm.loadingsearchpatient = false;
                    if (response.data.length === 0) {
                      UIkit.modal("#modalpatientnotfound").hide();
                      UIkit.modal("#modalsearchpatient").hide();
                      var patient = {
                        patientId: vm.newhistory,
                        name1: vm.name1ToSearch,
                        name2: vm.name2ToSearch,
                        surName: vm.surNameToSearch,
                        lastName: vm.lastNameToSearch,
                        birthday:
                          vm.selectedDateSerch === " "
                            ? null
                            : moment(vm.selectedDateSerch).format(
                              vm.formatDate.toUpperCase()
                            ),
                        age:
                          vm.selectedDateSerch === " "
                            ? null
                            : common.getAge(
                              moment(vm.selectedDateSerch).format(
                                vm.formatDate.toUpperCase()
                              ),
                              vm.formatDate.toUpperCase()
                            ),
                      };
                      $scope.loadpatientsearch({
                        patient: patient,
                      });
                    } else {
                      vm.patientfound = response.data;
                      vm.validhistorysearch = false;
                    }
                  },
                  function (error) {
                    vm.loadingsearchpatient = false;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  }
                );
            }
          }

          function loadtakephotopatient() {
            vm.viewtakephototest = true;
            vm.validcamera = true;

            if (
              navigator.mediaDevices.getUserMedia ===
              navigator.mediaDevices.getUserMedia ||
              navigator.mediaDevices.webkitGetUserMedia ||
              navigator.mediaDevices.mozGetUserMedia ||
              navigator.mediaDevices.msGetUserMedia
            ) {
              navigator.mediaDevices
                .getUserMedia({
                  video: true,
                  audio: false,
                })
                .then(function (mediaStream) {
                  var video = document.getElementById("cameraphotopatient");
                  //var url = window.URL || window.webkitURL;
                  video.srcObject = mediaStream;
                  //video.src = url ? url.createObjectURL(mediaStream) : mediaStream;
                  video.play();

                  UIkit.modal("#modalphoto").show();
                })
                .catch(function (error) {
                  vm.validcamera = false;
                });
            } else {
              vm.validcamera = false;
            }
          }

          function takephotopatient() {
            var video = document.getElementById("cameraphotopatient");
            var canvas = document.getElementById("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            vm.photodata = canvas.toDataURL("image/png");
            document
              .getElementById("idphotopatient")
              .setAttribute("src", vm.photodata);
          }

          function savephoto() {
            $scope.patientphoto = vm.photodata;
            vm.photopatient = vm.photodata;
          }

          function loadphotopatient(idpatient) {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            patientDS.getPhotoPatient(auth.authToken, idpatient).then(
              function (response) {
                response.data;
                vm.viewphoto = $scope.viewphoto === undefined ? false : true;
                $scope.photopatient =
                  response.data.photoInBase64 === undefined
                    ? ""
                    : response.data.photoInBase64;
                vm.photopatient =
                  response.data.photoInBase64 === undefined
                    ? ""
                    : response.data.photoInBase64;
              },
              function (error) {
                if (error.data === null) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                }
              }
            );
          }
        },
      ],
      controllerAs: "orderfield",
    };
    return directive;
  }
})();
