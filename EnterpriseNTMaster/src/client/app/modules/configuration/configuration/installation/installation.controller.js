(function () {
  "use strict";
  angular
    .module("app.installation")
    .filter("propsFilter", function () {
      return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
          var keys = Object.keys(props);

          items.forEach(function (item) {
            var itemMatches = false;
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop] !== undefined && item[prop] !== null) {
                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                  itemMatches = true;
                  break;
                }
              }
            }
            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    })
    .controller("InstallationController", InstallationController)
    .controller("ConfirmController", ConfirmController)
    .controller("RequeriddetinyController", RequeriddetinyController)
    .controller(
      "RequeridReferenceValuesController",
      RequeridReferenceValuesController
    );

  InstallationController.$inject = [
    "configurationDS",
    "authenticationsessionDS",
    "antibioticDS",
    "destinationDS",
    "ModalService",
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "$rootScope",
    "sigaDS",
    "testDS",
    "areaDS",
    "branchDS",
    "socket",
    "centralsystemDS",
    "userDS",
    "sampleDS",
    "demographicDS",
    "productVersion",
    "ordertypeDS",
    "serviceDS",
  ];

  function InstallationController(
    configurationDS,
    authenticationsessionDS,
    antibioticDS,
    destinationDS,
    ModalService,
    localStorageService,
    logger,
    $filter,
    $state,
    $rootScope,
    sigaDS,
    testDS,
    areaDS,
    branchDS,
    socket,
    centralsystemDS,
    userDS,
    sampleDS,
    demographicDS,
    productVersion,
    ordertypeDS,
    serviceDS
  ) {
    var vm = this;
    vm.disabledsiga = true;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.login = login;
    vm.visibleBranch = false;
    vm.invalidUser = false;
    vm.invalidDate = false;
    vm.user = {};
    vm.init = init;
    vm.availableColors = [];
    vm.title = "Installation";
    vm.selected = -1;
    vm.isAuthenticate = isAuthenticate;
    vm.getListConfiguration = getListConfiguration;
    vm.getId = getId;
    vm.changeState = changeState;
    vm.saveCancel = saveCancel;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.sectionId = 0;
    vm.getDestinationActive = getDestinationActive;
    vm.getantibiotic = getantibiotic;
    vm.getareaactive = getareaactive;
    vm.getIsRate = getIsRate;
    vm.auth = localStorageService.get("Enterprise_NT.authorizationData");
    vm.changesiga = changesiga;
    vm.changeDashBoard = changeDashBoard;
    vm.changehomebound = changehomebound;
    vm.changeqm = changeqm;
    vm.changecube = changecube;
    vm.changemigration = changemigration;
    vm.changeTamizaje = changeTamizaje;
    vm.testconection = testconection;
    vm.cargardata = cargardata;
    vm.branchsiga = branchsiga;
    vm.listservisesiga = [];
    vm.servicesiga = servicesiga;
    vm.brachsigarequerid = false;
    vm.servicesigarequerid = false;
    vm.urlsigarequerid = false;
    vm.urlEventRequired = false;
    vm.disabledsigaservices = true;
    vm.validateurl = validateurl;
    vm.loadingdata = true;
    vm.changeEvents = changeEvents;
    vm.testconectionEvents = testconectionEvents;
    vm.resultreport = resultreport;
    vm.entryorder = entryorder;
    vm.updateentryorder = updateentryorder;
    vm.rate = rate;
    vm.save = save;
    vm.updaterate = updaterate;
    vm.sampletraceability = sampletraceability;
    vm.getActiveDestination = getActiveDestination;
    vm.updatesampletraceability = updatesampletraceability;
    vm.getListdetinaty = getListdetinaty;
    vm.appointments = appointments;
    vm.ldap = ldap;
    vm.utilities = utilities;
    vm.planowhonet = planowhonet;
    vm.updateplanowhonet = updateplanowhonet;
    vm.integrations = integrations;
    vm.updateintegrations = updateintegrations;
    vm.events = events;
    vm.updateevents = updateevents;
    vm.availableColors = [];
    vm.notification = notification;
    vm.notificationRetake = notificationRetake;
    vm.gettest = gettest;
    vm.getSample = getSample;
    vm.removeDataSample = removeDataSample;
    vm.afterSelection = afterSelection;
    vm.changeDatabank = changeDatabank;
    vm.fetch = fetch;
    vm.fetchSample = fetchSample;
    vm.fetchNumeric = fetchNumeric;
    vm.OrderFilterFn = OrderFilterFn;
    vm.OrderFilterFnSample = OrderFilterFnSample;
    vm.getConfigurationDigitosOrden = getConfigurationDigitosOrden;
    vm.entrycases = entrycases;
    vm.changeConfiguration = changeConfiguration;
    vm.noConnected = false;
    vm.lastOrderAlarm = lastOrderAlarm;
    vm.demographicTests = demographicTests;
    vm.listdemographics = [];
    vm.addDemographic = addDemographic;
    vm.validateDemographic = validateDemographic;
    vm.removeDemographic = removeDemographic;
    vm.keyselect = keyselect;
    vm.auxiliaryPhysicians = auxiliaryPhysicians;
    vm.focustotalPhysicians = focustotalPhysicians;
    vm.keyselectPhysicians = keyselectPhysicians;
    vm.selectTestNotification = selectTestNotification;
    vm.gettestreference = gettestreference;
    vm.selectRetakeNotification = selectRetakeNotification;
    vm.resultNotByDemo =
      localStorageService.get("ManejoNotificacionResultados") === "True"
        ? true
        : false;

    vm.version = {
      backend: localStorageService.get("Version"),
      frontend: productVersion.master,
    };

    vm.listEmail = [
      {
        id: "1",
        name: $filter("translate")("0740"),
      },
      {
        id: "2",
        name: $filter("translate")("0225"),
      },
    ];
    vm.tinymceOptionsplanille = {
      resize: false,
      min_height: 50,
      menubar: false,
      language: $filter("translate")("0000") === "esCo" ? "es" : "en",
      plugins: ["  anchor textcolor charmap link"],
      toolbar: [
        "bold italic subscript  superscript | fontselect fontsizeselect | forecolor charmap link",
      ],
    };

    vm.listWorkDays = [
      {
        id: 1,
        name: $filter("translate")("0146"),
      },
      {
        id: 2,
        name: $filter("translate")("0147"),
      },
      {
        id: 3,
        name: $filter("translate")("0148"),
      },
      {
        id: 4,
        name: $filter("translate")("0149"),
      },
      {
        id: 5,
        name: $filter("translate")("0150"),
      },
      {
        id: 6,
        name: $filter("translate")("0151"),
      },
      {
        id: 7,
        name: $filter("translate")("0145"),
      },
    ];

    vm.idiomaReporteResultados = [
      {
        id: "en",
        name: "English",
      },
      {
        id: "es",
        name: "Spanish",
      },
    ];

    function removeDemographic(index) {
      vm.listdemographics.splice(index, 1);
    }

    function keyselectPhysicians($event) {
      var keyCode = $event.which || $event.keyCode;
      var data = vm.dataconfig[33].value + String.fromCharCode(keyCode);
      var number =
        data === undefined || data === null
          ? false
          : data.length !== 1
          ? true
          : false;
      if (!new RegExp("[1-5]").test(data) || number) {
        $event.preventDefault();
      }
    }

    function keyselect($event) {
      var keyCode = $event.which || $event.keyCode;
      var data = vm.dataconfig[0].value + String.fromCharCode(keyCode);
      var number =
        data === undefined || data === null
          ? false
          : data.length !== 1
          ? true
          : false;
      if (!new RegExp("[1-5]").test(data) || number) {
        //detener toda accion en la caja de texto
        $event.preventDefault();
      }
    }

    vm.focusorder = focusorder;
    function focusorder() {
      vm.dataconfig[0].value =
        vm.dataconfig[0].value === "" ||
        vm.dataconfig[0].value === null ||
        vm.dataconfig[0].value === undefined
          ? 1
          : vm.dataconfig[0].value;
    }

    function validateDemographic(id, $index) {
      var demosrepeated = _.filter(vm.listdemographics, function (o) {
        return o.id === id;
      });
      if (demosrepeated.length > 1) {
        vm.listdemographics[$index].id = null;
        logger.error($filter("translate")("1299"));
      }
    }

    function addDemographic() {
      var demosnull = _.filter(vm.listdemographics, function (o) {
        return o.id === null;
      });
      if (demosnull.length === 0 && vm.listdemographics.length <= 2) {
        vm.listdemographics.unshift({
          id: null,
        });
      } else {
        if (demosnull.length > 0) {
          logger.error($filter("translate")("1303"));
        }
      }
    }

    //** Metodo que válida el cambio de estado de la llave de exámenes por demográficos*//
    function demographicTests() {
      if (vm.dataconfig[24].value) {
        vm.listdemographics = [
          {
            id: null,
          },
        ];
      } else {
        vm.listdemographics = [];
      }
    }

    function focustotalPhysicians() {
      vm.dataconfig[33].value =
        vm.dataconfig[33].value === "" ||
        vm.dataconfig[33].value === null ||
        vm.dataconfig[33].value === undefined
          ? 1
          : vm.dataconfig[33].value;
    }

    //** Metodo que válida el cambio de estado de la llave de medicos auxiliares**//
    function auxiliaryPhysicians() {
      if (!vm.dataconfig[34].value) {
        vm.dataconfig[33].value = "";
      } else if (vm.dataconfig[33].value === "") {
        vm.dataconfig[33].value = 1;
      }
    }

    //** Metodo que válida el cambio de estado de la llave de la alarma de la ultima orden del paciente**//
    function lastOrderAlarm() {
      if (!vm.dataconfig[6].value) {
        vm.dataconfig[23].value = "";
      } else if (vm.dataconfig[23].value === "") {
        vm.dataconfig[23].value = 1;
      }
    }

    //** Metodo que válida el usuario y la contraseña**//
    function login(page) {
      vm.invalidUser = false;
      vm.invalidDate = false;
      vm.loadingdata = true;
      vm.menssageInvalid = "";
      if (
        vm.user.user &&
        vm.user.password &&
        vm.user.user === vm.auth.userName
      ) {
        vm.user.branch = -1;
        auth = localStorageService.get("Enterprise_NT.authorizationData");
        return authenticationsessionDS
          .loginlaboratory(vm.auth.authToken, vm.user)
          .then(
            function (data) {
              if (data.data.success) {
                vm.loadingdata = false;
                $state.go(page);
                vm.sectionId = -1;
              }
            },
            function (error) {
              vm.loadingdata = false;
              if (error.data !== null) {
                if (error.data.message === "timeout") {
                  vm.menssageInvalid = $filter("translate")("1070");
                } else if (
                  error.data.errorFields === null &&
                  error.data.message !== "timeout"
                ) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                } else {
                  if (
                    error.data.errorFields[0] ===
                    "La licencia registrada ha expirado."
                  ) {
                    vm.menssageInvalid = $filter("translate")("1077");
                  } else {
                    error.data.errorFields.forEach(function (value) {
                      var item = value.split("|");
                      if (item[0] === "4") {
                        if (item[1] === "inactive user") {
                          vm.menssageInvalid = $filter("translate")("1096");
                        } else {
                          vm.menssageInvalid = $filter("translate")("0097");
                        }
                      }
                      if (item[0] === "5") {
                        vm.menssageInvalid = $filter("translate")("0098");
                      }
                      if (item[0] === "3") {
                        vm.menssageInvalid = "";
                        vm.menssageInvalid = $filter("translate")("1095");
                      }
                      if (item[0] === "6") {
                        vm.Repeat = true;
                        if (item[1] === "password expiration date") {
                          vm.menssageInvalid =
                            "la contraseña expiro debe cambiarla";
                          vm.administrator = item[3];
                        } else {
                          vm.menssageInvalid = $filter("translate")("1038");
                        }
                      }
                      if (item[0] === "7") {
                        if (item[1] === "change password") {
                          vm.menssageInvalid =
                            "la contraseña expiro debe cambiarla";
                          vm.administrator = item[3];
                        }
                      }
                    });
                  }
                }
              }
            }
          );
      } else {
        logger.info($filter("translate")("0097"));
        vm.menssageInvalid = $filter("translate")("0097");
        vm.loadingdata = false;
      }
    }
    //** Metodo que prepara un JSON para lista de llaves a consultar*//
    function getListConfiguration() {
      vm.getConfigurationFormatDate();
      vm.tittle = [
        {
          id: 2,
          name: $filter("translate")("0666").toUpperCase(),
          section: "entryorder",
        },
        {
          id: 3,
          name: $filter("translate")("0667").toUpperCase(),
          section: "resultreport",
        },
        {
          id: 4,
          name: $filter("translate")("0668").toUpperCase(),
          section: "rate",
        },
        {
          id: 5,
          name: $filter("translate")("0669").toUpperCase(),
          section: "sampletraceability",
        },
        /* {
                      id: 6,
                      name: $filter('translate')('0670').toUpperCase(),
                      section: 'appointments',
                    }, */
        {
          id: 7,
          name: $filter("translate")("0671").toUpperCase(),
          section: "ldap",
        },
        {
          id: 8,
          name: $filter("translate")("0672").toUpperCase(),
          section: "utilities",
        },
        {
          id: 9,
          name: $filter("translate")("0055").toUpperCase(),
          section: "planowhonet",
        },
        {
          id: 10,
          name: $filter("translate")("0946").toUpperCase(),
          section: "integrations",
        },
        {
          id: 12,
          name: $filter("translate")("1117").toUpperCase(),
          section: "integrationsliscivigila",
        },
        {
          id: 11,
          name: $filter("translate")("0661").toUpperCase(),
          section: "events",
        },
        {
          id: 13,
          name: $filter("translate")("1056").toUpperCase(),
          section: "pathology",
        },
        {
          id: 14,
          name: $filter("translate")("3141").toUpperCase(),
          section: "emailRetake",
        },
      ];
    }
    //** Metodo que consulta la llave de formato de fecha**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS
        .getConfigurationKey(auth.authToken, "FormatoFecha")
        .then(
          function (data) {
            vm.getsytemcentral();
            vm.loadingdata = false;
            if (data.status === 200) {
              vm.formatDate = data.data.value.toUpperCase();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    vm.getsytemcentral = getsytemcentral;
    //** Metodo que consulta los destinos activos**//
    function getsytemcentral() {
      vm.listcentralsystem = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(
        function (data) {
          vm.getuser();
          vm.listcentralsystem = $filter("orderBy")(data.data, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que consulta los destinos activos**//
    function getDestinationActive(listdata) {
      vm.listDestinationMicro = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return destinationDS.getDestinationActive(auth.authToken).then(
        function (data) {
          vm.getantibiotic(listdata);
          vm.listDestinationMicro = $filter("orderBy")(data.data, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    vm.getuser = getuser;
    function getuser() {
      vm.listuser = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return userDS.getUsers(auth.authToken).then(
        function (data) {
          vm.listuser = $filter("orderBy")(data.data, "userName");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que consulta los antibioticos activos**//
    function getantibiotic(listdata) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.Listantibiotics = [];
      return antibioticDS.getState(auth.authToken, true).then(
        function (data) {
          if (data.status === 200) {
            data.data[0] = {
              id: "",
              name: "-- " + $filter("translate")("0504") + " --",
            };
            vm.Listantibiotics =
              data.data.length === 0 ? data.data : remove(data);
            vm.Listantibiotics = $filter("orderBy")(vm.Listantibiotics, "name");
          } else {
            vm.Listantibiotics = [
              {
                id: "",
                name: "-- " + $filter("translate")("0504") + " --",
              },
            ];
          }
          vm.planowhonet(listdata);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que adiciona o elimina elementos de un JSON**//
    function remove(data) {
      var antibiotics = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name,
        };
        antibiotics.push(object);
      });
      return antibiotics;
    }
    //** Metodo que evalua el cambio de la llave del dasboard**//
    function changeDashBoard() {
      if (vm.dataconfig[0].value === false) {
        vm.dataconfig[1].value = "";
        vm.dataconfig[18].value = false;
        vm.dataconfig[19].value = false;
        vm.dataconfig[20].value = false;
        vm.dataconfig[21].value = false;
        vm.dataconfig[22].value = false;
        vm.dataconfig[23].value = false;
        vm.disabledasbohasd = {
          TableroTomaDeMuestra: false,
          TableroProductividadPorSeccion: false,
          TableroSeguimientoDePruebas: false,
          TableroTiempoDeOportunidad: false,
          TableroCalificacionDelServicio: false,
          TableroValidacion: false,
        };
      } else {
        vm.disabledasbohasd = vm.datadisabledashboard;
      }
    }
    vm.changesigo = changesigo;
    //** Metodo que evalua el cambio de la llave del dasboard**//
    function changesigo() {
      if (vm.dataconfig[24].value === false) {
        vm.dataconfig[25].value = "";
        vm.dataconfig[26].value = undefined;
        vm.dataconfig[27].value = "";
        vm.dataconfig[28].value = "";
        vm.dataconfig[29].value = "";
        vm.dataconfig[30].value = "";
        vm.dataconfig[31].value = "";
        vm.dataconfig[32].value = "";
      }
    }
    vm.changeinvoiceexterna = changeinvoiceexterna;
    //** Metodo que evalua el cambio de la llave del dasboard**//
    function changeinvoiceexterna() {
      if (vm.dataconfig[33].value === false) {
        vm.dataconfig[34].value = "";
        vm.dataconfig[35].value = undefined;
      }
    }
    //** Metodo que evalua el cambio de la llave de homebound**//
    function changehomebound() {
      if (vm.dataconfig[11].value === false) {
        vm.dataconfig[12].value = "";
      }
    }
    //** Metodo que evalua el cambio de la llave del Databank**//
    function changeDatabank() {
      if (vm.dataconfig[7].value === false) {
        vm.dataconfig[8].value = "";
        vm.dataconfig[13].value = undefined;
        vm.dataconfig[15].value = undefined;
      }
    }
    //** Metodo que evalua el cambio de la llaves de la configuraación de siga**//
    function changesiga() {
      if (vm.dataconfig[2].value === false) {
        vm.dataconfig[3].value = "";
        vm.dataconfig[4].value = "";
        vm.dataconfig[5].value = "";
        vm.dataconfig[6].value = "";
        vm.dataconfig[51].value = false;
        vm.listbranchsiga = [];
        vm.listservisesiga = [];
      }
    }
    //** Metodo que evalua el cambio de la llave de QM**//
    function changeqm() {
      if (vm.dataconfig[16].value === false) {
        vm.dataconfig[17].value = "";
      }
    }

    //** Metodo que evalua el cambio de la llave de cubo**//
    function changecube() {
      console.log(vm.dataconfig);
      if (vm.dataconfig[43].value === false) {
        vm.dataconfig[44].value = "";
      }
    }

    //** Metodo que evalua el cambio de la llave de migracion**//
    function changemigration() {
      console.log(vm.dataconfig);
      if (vm.dataconfig[47].value === false) {
        vm.dataconfig[48].value = "";
      }
    }

    //** Metodo que evalua el cambio de la llave de tamizaje**//
    function changeTamizaje() {
      console.log(vm.dataconfig);
      if (vm.dataconfig[49].value === false) {
        vm.dataconfig[50].value = "";
      }
    }

    //** Metodo que evalua la url de eventos**//
    function validateurl(Form) {
      if (vm.sectionId === 10) {
        if (
          Form.UrlSIGA.$error.url !== true &&
          Form.UrlSIGA.$error.required !== true
        ) {
          if (vm.dataconfig[3].value !== vm.urlprevious) {
            vm.dataconfig[4].value = "";
            vm.dataconfig[5].value = "";
            vm.dataconfig[6].value = "";
            vm.listbranchsiga = [];
            vm.listservisesiga = [];
            vm.testconection(Form);
          }
        }
      } else if (vm.sectionId === 11) {
        vm.urlEventRequired = false;
        if (
          Form.UrlEventos.$error.url !== true &&
          Form.UrlEventos.$error.required !== true
        ) {
          return vm.testconectionEvents(Form);
        }
      }
    }
    //** Metodo que evalua el la conexion con el siga**//
    function testconection(Form) {
      if (
        Form.UrlSIGA.$error.url !== true &&
        Form.UrlSIGA.$error.required !== true
      ) {
        var key = {
          url: vm.dataconfig[3].value,
        };
        vm.loadingdata = true;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sigaDS.getsigabranchesurl(auth.authToken, key).then(
          function (data) {
            vm.loadingdata = false;
            logger.success($filter("translate")("0974"));
            vm.listbranchsiga = $filter("orderBy")(data.data, "name");
          },
          function (error) {
            vm.loadingdata = false;
            vm.urlsigarequerid = true;
          }
        );
      }
    }
    //** Metodo que evalua el la conexion con el siga y carga los servicios del siga**//
    function cargardata() {
      if (vm.dataconfig[4].value !== "") {
        vm.requeridbranch = false;
        vm.requeridservice = false;
        var key = {
          url: vm.dataconfig[3].value,
          id: vm.dataconfig[4].value,
        };
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sigaDS.getsigaserviceurl(auth.authToken, key).then(
          function (data) {
            if (data.status === 200) {
              vm.listservisesiga = $filter("orderBy")(data.data, "name");
            }
          },
          function (error) {}
        );
      }
    }

    //** Metodo que evalua el la conexion con el siga y carga los sedes del siga**//
    function branchsiga(listdata) {
      vm.listbranchsiga = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sigaDS.getsigabranches(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.servicesiga(listdata);
            vm.listbranchsiga = $filter("orderBy")(data.data, "name");
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.urlsigarequerid = true;
        }
      );
    }
    //** Metodo que carga las areas**//
    function getareaactive() {
      vm.areaactive = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return areaDS.getAreasActive(auth.authToken).then(
        function (data) {
          vm.getbranchactive();
          if (data.status === 200) {
            vm.areaactive = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    vm.getbranchactive = getbranchactive;
    //** Metodo que carga las areas**//
    function getbranchactive() {
      vm.branchactive = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return branchDS.getBranchActive(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.branchactive = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    //** Metodo que evalua el la conexion con el siga y carga los servicios del siga**//
    function servicesiga(listdata) {
      vm.listservisesiga = [];
      var branch = $filter("filter")(
        listdata.data,
        {
          key: "SedeSIGA",
        },
        true
      )[0].value;
      if (branch !== "" && branch !== undefined) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sigaDS.getsigaservices(auth.authToken, parseInt(branch)).then(
          function (data) {
            if (data.status === 200) {
              vm.listservisesiga = $filter("orderBy")(data.data, "name");
            }
            vm.integrations(listdata);
          },
          function (error) {
            vm.loadingdata = false;
          }
        );
      } else {
        vm.listservisesiga = "";
        vm.integrations(listdata);
      }
    }
    //** Metodo que evalua la conexion de la url de eventos**//
    function testconectionEvents(Form) {
      vm.urlEventRequired = false;
      if (
        Form.UrlEventos.$error.url !== true &&
        Form.UrlEventos.$error.required !== true
      ) {
        var json = {
          url: vm.dataconfig[1].value,
        };
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return configurationDS.getConectionEvents(auth.authToken, json).then(
          function (data) {
            logger.success($filter("translate")("0974"));
          },
          function (error) {
            vm.urlEventRequired = true;
          }
        );
      }
    }
    //** Metodo que evalua el cambio de la url en eventos**//
    function changeEvents() {
      vm.urlEventRequired = false;
      if (vm.dataconfig[0].value === false) {
        ModalService.showModal({
          templateUrl: "Confirmation.html",
          controller: "ConfirmController",
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.execute === "yes") {
              if (vm.dataconfig[0].value === false) {
                vm.dataconfig[1].value = "";
                vm.dataconfig[2].value = false;
                vm.dataconfig[3].value = false;
                vm.dataconfig[4].value = false;
                vm.dataconfig[5].value = false;
                vm.dataconfig[6].value = false;
                vm.dataconfig[7].value = false;
                vm.dataconfig[8].value = false;
                vm.dataconfig[9].value = false;
                vm.dataconfig[10].value = false;
                vm.dataconfig[11].value = false;
                vm.dataconfig[12].value = false;
                vm.dataconfig[13].value = false;
              }
            } else {
              vm.getId(vm.sectionId, vm.selected);
            }
          });
        });
      }
    }
    //** Metodo que carga los elementos por el tipo de configuración**//
    function getId(id, index) {
      vm.dataconfig = [];
      vm.loadingdata = true;
      vm.selected = index;
      vm.sectionId = id;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS.getConfiguration(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.dataorigin = data.data;
            vm.usuario = $filter("translate")("0017") + " ";
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              " - ";
            vm.usuario = vm.usuario + vm.auth.userName;
            if (id === 2) {
              vm.entryorder(data);
            } else if (id === 3) {
              vm.resultreport(data);
            } else if (id === 4) {
              vm.listSymbols = [
                {
                  id: "",
                  name: "",
                },
                {
                  id: "¤",
                  name: "¤",
                },
                {
                  id: "$",
                  name: "$",
                },
                {
                  id: "¢",
                  name: "¢",
                },
                {
                  id: "£",
                  name: "£",
                },
                {
                  id: "₤",
                  name: "₤",
                },
                {
                  id: "¥",
                  name: "¥",
                },
                {
                  id: "€",
                  name: "€",
                },
              ];
              vm.rate(data);
            } else if (id === 5) {
              vm.getActiveDestination(data);
            } else if (id === 6) {
              vm.appointments(data);
            } else if (id === 7) {
              vm.ldap(data);
            } else if (id === 8) {
              vm.getConfigurationDigitosOrden(data);
            } else if (id === 9) {
              vm.typeWhonet = [
                {
                  id: 1,
                  name: $filter("translate")("0315"),
                },
                {
                  id: 2,
                  name: $filter("translate")("0636"),
                },
              ];
              vm.getDestinationActive(data);
            } else if (id === 10) {
              vm.getareaactive();
              vm.getlicenciedashboard();
              vm.requeridbranch = false;
              vm.requeridservice = false;
              vm.urlsigarequerid = false;
              vm.listbranchsiga = [];
              vm.listservisesiga = [];
              vm.urlprevious = $filter("filter")(
                data.data,
                {
                  key: "UrlSIGA",
                },
                true
              )[0].value;
              if (
                vm.urlprevious !== undefined &&
                vm.urlprevious !== undefined &&
                vm.urlprevious !== "" &&
                vm.urlprevious !== "False"
              ) {
                vm.branchsiga(data);
              } else {
                console.log("no hay url");
                console.log(data);
                vm.integrations(data);
              }
            } else if (id === 11) {
              vm.events(data);
            } else if (id === 12) {
              vm.testnotification = [];
              vm.gettest(data);
              vm.gettestreference();
            } else if (id === 13) {
              vm.entrycases(data);
            } else if (id === 14) {
              vm.samplenotification = [];
              vm.getSample(data);
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function gettestreference() {
      vm.listtestreference = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestReference(auth.authToken).then(
        function (data) {
          vm.listtestreference = data.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    //** Metodo que construye el objeto para la consulta de las llaves de notificaciones**//
    function gettest(data) {
      vm.listtest = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.notification(data);
      vm.itemstest = $filter("filter")(
        data.data,
        {
          key: "PruebasNotificacionObligatoria",
        },
        true
      )[0].value;
      vm.itemstest = vm.itemstest === "" ? [] : JSON.parse(vm.itemstest);
      vm.itemstestone = $filter("filter")(
        data.data,
        {
          key: "PruebasNotificacionObligatoriaUno",
        },
        true
      )[0].value;
      vm.itemstestone =
        vm.itemstestone === "" ? [] : JSON.parse(vm.itemstestone);
      vm.itemstestwo = $filter("filter")(
        data.data,
        {
          key: "PruebasNotificacionObligatoriaDos",
        },
        true
      )[0].value;
      vm.itemstestwo = vm.itemstestwo === "" ? [] : JSON.parse(vm.itemstestwo);
      //Pruebas 4
      vm.itemstesfour = $filter("filter")(
        data.data,
        {
          key: "PruebasNotificacionObligatoriaCuatro",
        },
        true
      )[0].value;
      vm.itemstesfour =
        vm.itemstesfour === "" ? [] : JSON.parse(vm.itemstesfour);
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(
        function (data) {
          vm.listtest = data.data.length === 0 ? data.data : removeData(data);
          vm.listtestNumeric =
            data.data.length === 0 ? data.data : removeDataFour(data);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getSample(data) {
      vm.listSample = [];
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.notificationRetake(data);
      vm.itemsSample = $filter("filter")(
        data.data,
        {
          key: "MuestrasNotificacionObligatoriaTres",
        },
        true
      )[0].value;
      vm.itemsSample = vm.itemsSample === "" ? [] : JSON.parse(vm.itemsSample);
      return sampleDS.getSampleActive(auth.authToken).then(
        function (dataSample) {
          vm.listSample =
            dataSample.data.length === 0
              ? dataSample.data
              : removeDataSample(dataSample);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataSample(data) {
      var sample = [];
      var sampleList = [];
      data.data.unshift({
        id: -1,
        name: $filter("translate")("0209"),
        code: "*",
      });
      data.data.forEach(function (value) {
        var object = {
          id: value.id,
          name: value.name,
          code: value.codesample,
        };
        sample.push(object);
        if (value.id === -1) {
          var index = _.findIndex(vm.itemsSample, function (o) {
            return o === -1;
          });
          if (index > -1) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.codesample,
            };
            sampleList.push(object);
            return true;
          }
        } else {
          if (vm.itemsSample.indexOf(value.id) >= 0) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.codesample,
            };
            sampleList.push(object);
          }
        }
      });
      vm.samplenotification = sampleList;
      return sample;
    }
    //** Metodo que carga una lista de examenes**//
    function fetchSample($select, $event) {
      if (vm.listSample !== undefined) {
        if ($event) {
          vm.limit = vm.limit + 50;
          var listcopy = _.clone(vm.listSample);
          vm.listS = listcopy.splice(0, vm.limit);
          $event.stopPropagation();
          $event.preventDefault();
        } else {
          if ($select.search !== "") {
            var listcopy = _.clone(vm.listSample);

            if (vm.listSample[0].codesample === undefined) {
              vm.listS = _.filter(vm.listSample, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                  -1
                );
              });
            } else {
              vm.listS = _.filter(vm.listSample, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                    -1 ||
                  o.codesample
                    .toUpperCase()
                    .indexOf($select.search.toUpperCase()) > -1
                );
              });
            }

            if (vm.listS.length > 50) {
              vm.limit = 50;
              vm.listS = vm.listS.splice(0, vm.limit);
            }
          } else {
            if (vm.listSample.length > 50) {
              vm.listS = [];
              vm.limit = 50;
              var listcopy = _.clone(vm.listSample);
              vm.listS =
                vm.listSample === undefined ? [] : listcopy.splice(0, vm.limit);
            } else {
              vm.listS = vm.listSample;
            }
          }
        }
      }
    }

    function selectRetakeNotification(item) {
      if (item) {
        var index = _.findIndex(vm.samplenotification, function (o) {
          return o.id === -1;
        });
        if (index > -1) {
          var itemall = vm.samplenotification[index];
          vm.samplenotification = [];
          vm.samplenotification.push(itemall);
        }
      }
    }

    //** Metodo Para agrupar los examanes**//
    function OrderFilterFnSample(groups) {
      groups = groups.reverse();
      var hola = _.filter(vm.listS, {
        showbutton: true,
      });
      for (var i = 0; i < hola.length; i++) {
        hola[i].showbutton = false;
      }
      if (groups.length !== 0 && vm.listS.length > 49) {
        groups[groups.length - 1].items[
          groups[groups.length - 1].items.length - 1
        ].showbutton = true;
      }
      return groups;
    }
    //** Metodo que construye el objeto para la consulta de las llaves de notificaciones de resultados**//
    function notificationRetake(data) {
      var one = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoriaTres",
        },
        true
      );
      var MailNotificationRetake = one.length === 0 ? "[]" : one[0].value;
      vm.dataconfig = [
        {
          key: "CorreosNotificacionObligatoriaTres", //0
          value: vm.resultNotByDemo
            ? []
            : MailNotificationRetake === ""
            ? []
            : JSON.parse(MailNotificationRetake),
        },
        {
          key: "AsuntoNotificacionObligatoriaTres", //1
          value: $filter("filter")(
            data.data,
            {
              key: "AsuntoNotificacionObligatoriaTres",
            },
            true
          )[0].value,
        },
        {
          key: "PlantillaNotificacionObligatoriaTres", //2
          value: $filter("filter")(
            data.data,
            {
              key: "PlantillaNotificacionObligatoriaTres",
            },
            true
          )[0].value,
        },
        {
          key: "MuestrasNotificacionObligatoriaTres", //3
          value: "",
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para la consulta de las llaves de notificaciones de resultados**//
    function notification(data) {
      var one = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoria",
        },
        true
      );
      var two = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoriaUno",
        },
        true
      );
      var tree = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoriaDos",
        },
        true
      );
      var forN = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoriaTres",
        },
        true
      );
      var forF = $filter("filter")(
        data.data,
        {
          key: "CorreosNotificacionObligatoriaCuatro",
        },
        true
      );

      var MailNotificationMandatory = one.length === 0 ? "[]" : one[0].value;
      var MailNotificationMandatoryUno = two.length === 0 ? "[]" : two[0].value;
      var MailNotificationMandatoryDos =
        tree.length === 0 ? "[]" : tree[0].value;
      var MailNotificationMandatoryTres =
        forN.length === 0 ? "[]" : forN[0].value;
      var MailNotificationMandatoryCuatro =
        forF.length === 0 ? "[]" : forF[0].value;
      vm.dataconfig = [
        {
          key: "CorreosNotificacionObligatoria", //0
          value: vm.resultNotByDemo
            ? []
            : MailNotificationMandatory === ""
            ? []
            : JSON.parse(MailNotificationMandatory),
        },
        {
          key: "AsuntoNotificacionObligatoria", //1
          value: $filter("filter")(
            data.data,
            {
              key: "AsuntoNotificacionObligatoria",
            },
            true
          )[0].value,
        },
        {
          key: "PlantillaNotificacionObligatoria", //2
          value: $filter("filter")(
            data.data,
            {
              key: "PlantillaNotificacionObligatoria",
            },
            true
          )[0].value,
        },
        {
          key: "PruebasNotificacionObligatoria", //3
          value: "",
        },
        {
          key: "CorreosNotificacionObligatoriaUno", //4
          value: vm.resultNotByDemo
            ? []
            : MailNotificationMandatoryUno === ""
            ? []
            : JSON.parse(MailNotificationMandatoryUno),
        },
        {
          key: "AsuntoNotificacionObligatoriaUno", //5
          value: $filter("filter")(
            data.data,
            {
              key: "AsuntoNotificacionObligatoriaUno",
            },
            true
          )[0].value,
        },
        {
          key: "PlantillaNotificacionObligatoriaUno", //6
          value: $filter("filter")(
            data.data,
            {
              key: "PlantillaNotificacionObligatoriaUno",
            },
            true
          )[0].value,
        },
        {
          key: "PruebasNotificacionObligatoriaUno", //7
          value: "",
        },
        {
          key: "CorreosNotificacionObligatoriaDos", //8
          value: vm.resultNotByDemo
            ? []
            : MailNotificationMandatoryDos === ""
            ? []
            : JSON.parse(MailNotificationMandatoryDos),
        },
        {
          key: "AsuntoNotificacionObligatoriaDos", //9
          value: $filter("filter")(
            data.data,
            {
              key: "AsuntoNotificacionObligatoriaDos",
            },
            true
          )[0].value,
        },
        {
          key: "PlantillaNotificacionObligatoriaDos", //10
          value: $filter("filter")(
            data.data,
            {
              key: "PlantillaNotificacionObligatoriaDos",
            },
            true
          )[0].value,
        },
        {
          key: "PruebasNotificacionObligatoriaDos", //11
          value: "",
        },
        {
          key: "CorreosNotificacionObligatoriaCuatro", //12
          value: vm.resultNotByDemo
            ? []
            : MailNotificationMandatoryCuatro === ""
            ? []
            : JSON.parse(MailNotificationMandatoryCuatro),
        },
        {
          key: "AsuntoNotificacionObligatoriaCuatro", //13
          value: $filter("filter")(
            data.data,
            {
              key: "AsuntoNotificacionObligatoriaCuatro",
            },
            true
          )[0].value,
        },
        {
          key: "PlantillaNotificacionObligatoriaCuatro", //14
          value: $filter("filter")(
            data.data,
            {
              key: "PlantillaNotificacionObligatoriaCuatro",
            },
            true
          )[0].value,
        },
        {
          key: "PruebasNotificacionObligatoriaCuatro", //15
          value: "",
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var test = [];
      var testlist = [];
      var testlistone = [];
      var testlisttwo = [];
      data.data.unshift({
        id: -1,
        name: $filter("translate")("0209"),
        code: "*",
        area: {
          name: "*",
        },
      });
      data.data.forEach(function (value) {
        var object = {
          id: value.id,
          name: value.name,
          code: value.code,
          areaname: value.area.name,
        };
        test.push(object);
        if (value.id === -1) {
          var index = _.findIndex(vm.itemstest, function (o) {
            return o === -1;
          });
          if (index > -1) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlist.push(object);
          }
          var indexOne = _.findIndex(vm.itemstestone, function (o) {
            return o === -1;
          });
          if (indexOne > -1) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlistone.push(object);
          }
          var indexTwo = _.findIndex(vm.itemstestwo, function (o) {
            return o === -1;
          });
          if (indexTwo > -1) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlisttwo.push(object);
          }
        } else {
          if (vm.itemstest.indexOf(value.id) >= 0) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlist.push(object);
          }
          if (vm.itemstestone.indexOf(value.id) >= 0) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlistone.push(object);
          }
          if (vm.itemstestwo.indexOf(value.id) >= 0) {
            var object = {
              id: value.id,
              name: value.name,
              code: value.code,
              areaname: value.area.name,
            };
            testlisttwo.push(object);
          }
        }
      });
      vm.testnotification = testlist;
      vm.testnotificationone = testlistone;
      vm.testnotificationtwo = testlisttwo;
      return test;
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataFour(data) {
      var testlistfour = [];
      var test = [];
      data.data.unshift({
        id: -1,
        name: $filter("translate")("0209"),
        code: "*",
        resultType: 1,
        area: {
          name: "*",
        },
      });
      data.data.forEach(function (value) {
        if (value.resultType === 1) {
          var object = {
            id: value.id,
            name: value.name,
            code: value.code,
            areaname: value.area.name,
          };
          test.push(object);
          if (value.id === -1) {
            var indexFour = _.findIndex(vm.itemstesfour, function (o) {
              return o === -1;
            });
            if (indexFour > -1) {
              var object = {
                id: value.id,
                name: value.name,
                code: value.code,
                areaname: value.area.name,
              };
              testlistfour.push(object);
            }
          } else {
            if (vm.itemstesfour.indexOf(value.id) >= 0) {
              var object = {
                id: value.id,
                name: value.name,
                code: value.code,
                areaname: value.area.name,
              };
              testlistfour.push(object);
            }
          }
        }
      });
      vm.testnotificationfour = testlistfour;
      return test;
    }

    function handleEvent(notificationArray, item) {
      var index = _.findIndex(notificationArray, function (o) {
        return o.id === -1;
      });
      if (index > -1) {
        var itemall = notificationArray[index];
        notificationArray.length = 0;
        notificationArray.push(itemall);
      }
    }
    function selectTestNotification(item, event) {
      if (!item) return;

      switch (event) {
        case 1:
          handleEvent(vm.testnotification, item);
          break;
        case 2:
          handleEvent(vm.testnotificationone, item);
          break;
        case 3:
          handleEvent(vm.testnotificationtwo, item);
          break;
        case 4:
          if (item.id === -1) {
            if (vm.listtestreference.length > 0) {
              vm.testnotificationfour.length = 0;
              ModalService.showModal({
                templateUrl: "referenceValues.html",
                controller: "RequeridReferenceValuesController",
                inputs: {
                  listtests: vm.listtestreference,
                },
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {});
              });
              return false;
            }
          } else {
            var findtest = _.find(vm.listtestreference, function (o) {
              return o.test.id === item.id;
            });

            // Si  se encuentra el test en la lista de referencia (no tiene valores de referencia configurados)
            if (findtest) {
              var indexItem = _.findIndex(
                vm.testnotificationfour,
                function (o) {
                  return o.id === item.id;
                }
              );
              if (indexItem > -1) {
                vm.testnotificationfour.splice(indexItem, 1);
              }
              ModalService.showModal({
                templateUrl: "referenceValues.html",
                controller: "RequeridReferenceValuesController",
                inputs: {
                  listtests: [findtest],
                },
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {});
              });
              return false;
            }
          }
          handleEvent(vm.testnotificationfour, item);
          break;
      }
    }

    //** Metodo que carga una lista de examenes**//
    function fetch($select, $event) {
      if (vm.listtest !== undefined) {
        if ($event) {
          vm.limit = vm.limit + 50;
          var listcopy = _.clone(vm.listtest);
          vm.list = listcopy.splice(0, vm.limit);
          $event.stopPropagation();
          $event.preventDefault();
        } else {
          if ($select.search !== "") {
            var listcopy = _.clone(vm.listtest);
            if (vm.listtest[0].code === undefined) {
              vm.list = _.filter(vm.listtest, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                  -1
                );
              });
            } else {
              vm.list = _.filter(vm.listtest, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                    -1 ||
                  o.code.toUpperCase().indexOf($select.search.toUpperCase()) >
                    -1
                );
              });
            }
            if (vm.list.length > 50) {
              vm.limit = 50;
              vm.list = vm.list.splice(0, vm.limit);
            }
          } else {
            if (vm.listtest.length > 50) {
              vm.list = [];
              vm.limit = 50;
              var listcopy = _.clone(vm.listtest);
              vm.list =
                vm.listtest === undefined ? [] : listcopy.splice(0, vm.limit);
            } else {
              vm.list = vm.listtest;
            }
          }
        }
      }
    }

    //** Metodo que carga una lista de examenes numericos**//
    function fetchNumeric($select, $event) {
      if (vm.listtestNumeric !== undefined) {
        if ($event) {
          vm.limit = vm.limit + 50;
          var listcopy = _.clone(vm.listtestNumeric);
          vm.listNumeric = listcopy.splice(0, vm.limit);
          $event.stopPropagation();
          $event.preventDefault();
        } else {
          if ($select.search !== "") {
            var listcopy = _.clone(vm.listtestNumeric);
            if (vm.listtestNumeric[0].code === undefined) {
              vm.listNumeric = _.filter(vm.listtestNumeric, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                  -1
                );
              });
            } else {
              vm.listNumeric = _.filter(vm.listtestNumeric, function (o) {
                return (
                  o.name.toUpperCase().indexOf($select.search.toUpperCase()) >
                    -1 ||
                  o.code.toUpperCase().indexOf($select.search.toUpperCase()) >
                    -1
                );
              });
            }
            if (vm.list.length > 50) {
              vm.limit = 50;
              vm.listNumeric = vm.list.splice(0, vm.limit);
            }
          } else {
            if (vm.listtestNumeric.length > 50) {
              vm.listNumeric = [];
              vm.limit = 50;
              var listcopy = _.clone(vm.listtestNumeric);
              vm.listNumeric =
                vm.listtestNumeric === undefined
                  ? []
                  : listcopy.splice(0, vm.limit);
            } else {
              vm.listNumeric = vm.listtestNumeric;
            }
          }
        }
      }
    }

    //** Metodo Para agrupar los examanes**//
    function OrderFilterFn(groups) {
      groups = groups.reverse();
      var hola = _.filter(vm.list, {
        showbutton: true,
      });
      for (var i = 0; i < hola.length; i++) {
        hola[i].showbutton = false;
      }
      if (groups.length !== 0 && vm.list.length > 49) {
        groups[groups.length - 1].items[
          groups[groups.length - 1].items.length - 1
        ].showbutton = true;
      }
      return groups;
    }
    //** Metodo que obtiene los destinos activos**//
    function getActiveDestination(listdata) {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listDestinationSample = [];
      return destinationDS.getDestinationActive(auth.authToken).then(
        function (data) {
          vm.sampletraceability(listdata);
          vm.listDestinationSample = $filter("orderBy")(data.data, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que evalua que los destinos son requeridos**//
    function getListdetinaty() {
      if (vm.listDestinationSample.length === 0) {
        ModalService.showModal({
          templateUrl: "detinyrequerid.html",
          controller: "RequeriddetinyController",
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result == "destination") {
              $state.go(result);
            }
          });
        });
      }
    }
    //** Metodo que construye el objeto para la consulta de las llaves de ingreso de ordenes**//
    function entryorder(data) {
      var DiasMaximoModificarOrden = $filter("filter")(
        data.data,
        {
          key: "DiasMaximoModificarOrden",
        },
        true
      )[0].value;
      vm.dataconfig = [
        {
          key: "DigitosOrden", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "DigitosOrden",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DigitosOrden",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "NumeroOrdenAutomatico", //1
          value:
            $filter("filter")(
              data.data,
              {
                key: "NumeroOrdenAutomatico",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TipoNumeroOrden", //2
          value: $filter("filter")(
            data.data,
            {
              key: "TipoNumeroOrden",
            },
            true
          )[0].value,
        },
        {
          key: "DiasMaximoModificarOrden", //3
          value:
            DiasMaximoModificarOrden === "" || DiasMaximoModificarOrden === "-1"
              ? 0
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DiasMaximoModificarOrden",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "AnularOrdenValidada", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "AnularOrdenValidada",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "AgregarExamenesMuestras", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "AgregarExamenesMuestras",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "AlarmaUltimaOrden", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "AlarmaUltimaOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Diagnostics", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "Diagnostics",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Nombres", //8
          value: $filter("filter")(
            data.data,
            {
              key: "Nombres",
            },
            true
          )[0].value,
        },
        {
          key: "Apellidos", //9
          value: $filter("filter")(
            data.data,
            {
              key: "Apellidos",
            },
            true
          )[0].value,
        },
        {
          key: "FormatoHistoria", //10
          value: $filter("filter")(
            data.data,
            {
              key: "FormatoHistoria",
            },
            true
          )[0].value,
        },
        {
          key: "ManejoTalla", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoTalla",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ManejoPeso", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoPeso",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ContrasenaPaciente", //13
          value:
            $filter("filter")(
              data.data,
              {
                key: "ContrasenaPaciente",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "ContrasenaPaciente",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "VisualizarFotoPaciente", //14
          value:
            $filter("filter")(
              data.data,
              {
                key: "VisualizarFotoPaciente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "SeparadorMuestra", //15
          value: $filter("filter")(
            data.data,
            {
              key: "SeparadorMuestra",
            },
            true
          )[0].value,
        },
        {
          key: "ImprimirEtiquetaAdicional", //16
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirEtiquetaAdicional",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ImprimirEtiquetaAutomaticamente", //17
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirEtiquetaAutomaticamente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "VerPreliminarTalon", //18
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerPreliminarTalon",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DigitoAño", //19
          value:
            $filter("filter")(
              data.data,
              {
                key: "DigitoAño",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DigitoAño",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "CodigoDemograficoIngreso", //20
          value:
            $filter("filter")(
              data.data,
              {
                key: "CodigoDemograficoIngreso",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "MotivoModificacionOrden", //21
          value:
            $filter("filter")(
              data.data,
              {
                key: "MotivoModificacionOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "verOrdenHis", //22
          value:
            $filter("filter")(
              data.data,
              {
                key: "verOrdenHis",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DiasAlarmaUltimaOrden", //23
          value:
            $filter("filter")(
              data.data,
              {
                key: "DiasAlarmaUltimaOrden",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DiasAlarmaUltimaOrden",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "ExamenesPorDemografico", //24
          value:
            $filter("filter")(
              data.data,
              {
                key: "ExamenesPorDemografico",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ExamenesDemograficos", //25
          value:
            $filter("filter")(
              data.data,
              {
                key: "ExamenesDemograficos",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "ExamenesDemograficos",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "HojaTrabajoIngresoOrden", //26
          value:
            $filter("filter")(
              data.data,
              {
                key: "HojaTrabajoIngresoOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "PermisosEdicionUsuarioIngreso", //27
          value:
            $filter("filter")(
              data.data,
              {
                key: "PermisosEdicionUsuarioIngreso",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EditarTipoOrden", //28
          value:
            $filter("filter")(
              data.data,
              {
                key: "EditarTipoOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "OrdenEntrevistaPorPrioridad", //29
          value:
            $filter("filter")(
              data.data,
              {
                key: "OrdenEntrevistaPorPrioridad",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "AgregarExamenesServicios", //30
          value:
            $filter("filter")(
              data.data,
              {
                key: "AgregarExamenesServicios",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EditarCantidadEtiquetas", //31
          value:
            $filter("filter")(
              data.data,
              {
                key: "EditarCantidadEtiquetas",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "SinFiltroSedeBusquedaOrdenes", //32
          value:
            $filter("filter")(
              data.data,
              {
                key: "SinFiltroSedeBusquedaOrdenes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TotalMedicosAuxiliares", //33
          value:
            $filter("filter")(
              data.data,
              {
                key: "TotalMedicosAuxiliares",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "TotalMedicosAuxiliares",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "MedicosAuxiliares", //34
          value:
            $filter("filter")(
              data.data,
              {
                key: "MedicosAuxiliares",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Direccionobligatoria", //35
          value:
            $filter("filter")(
              data.data,
              {
                key: "Direccionobligatoria",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Literalesobligatorio", //36
          value:
            $filter("filter")(
              data.data,
              {
                key: "Literalesobligatorio",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Validacioningreso", //37
          value:
            $filter("filter")(
              data.data,
              {
                key: "Validacioningreso",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DosNombresPaciente", //38
          value:
            $filter("filter")(
              data.data,
              {
                key: "DosNombresPaciente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DosApellidosPaciente", //39
          value:
            $filter("filter")(
              data.data,
              {
                key: "DosApellidosPaciente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "FiltroParcialNombres", //40
          value:
            $filter("filter")(
              data.data,
              {
                key: "FiltroParcialNombres",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "verControlHTMLenLinea", //41
          value:
            $filter("filter")(
              data.data,
              {
                key: "verControlHTMLenLinea",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
      ];

      var demographics = $filter("filter")(
        data.data,
        {
          key: "ExamenesDemograficos",
        },
        true
      )[0].value;

      if (vm.dataconfig[25].value) {
        if (demographics === "") {
          vm.listdemographics = [
            {
              id: null,
            },
          ];
        } else {
          demographics = demographics.split(",");
          demographics.forEach(function (value, key) {
            vm.listdemographics.push({
              id: parseInt(value),
            });
          });
        }
      }
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para la guardar de las llaves de ingreso de ordenes**//
    function updateentryorder() {
      vm.dataconfig[1].value =
        vm.dataconfig[1].value === false ? "False" : "True";
      vm.dataconfig[3].value =
        vm.dataconfig[3].value === 0 ? -1 : vm.dataconfig[3].value;
      vm.dataconfig[4].value =
        vm.dataconfig[4].value === false ? "False" : "True";
      vm.dataconfig[5].value =
        vm.dataconfig[5].value === false ? "False" : "True";
      vm.dataconfig[6].value =
        vm.dataconfig[6].value === false ? "False" : "True";
      vm.dataconfig[7].value =
        vm.dataconfig[7].value === false ? "False" : "True";
      vm.dataconfig[11].value =
        vm.dataconfig[11].value === false ? "False" : "True";
      vm.dataconfig[12].value =
        vm.dataconfig[12].value === false ? "False" : "True";
      vm.dataconfig[14].value =
        vm.dataconfig[14].value === false ? "False" : "True";
      vm.dataconfig[16].value =
        vm.dataconfig[16].value === false ? "False" : "True";
      vm.dataconfig[17].value =
        vm.dataconfig[17].value === false ? "False" : "True";
      vm.dataconfig[18].value =
        vm.dataconfig[18].value === false ? "False" : "True";
      vm.dataconfig[20].value =
        vm.dataconfig[20].value === false ? "False" : "True";
      vm.dataconfig[21].value =
        vm.dataconfig[21].value === false ? "False" : "True";
      vm.dataconfig[22].value =
        vm.dataconfig[22].value === false ? "False" : "True";
      vm.dataconfig[24].value =
        vm.dataconfig[24].value === false ? "False" : "True";
      vm.dataconfig[26].value =
        vm.dataconfig[26].value === false ? "False" : "True";
      vm.dataconfig[27].value =
        vm.dataconfig[27].value === false ? "False" : "True";
      vm.dataconfig[28].value =
        vm.dataconfig[28].value === false ? "False" : "True";
      vm.dataconfig[29].value =
        vm.dataconfig[29].value === false ? "False" : "True";
      vm.dataconfig[30].value =
        vm.dataconfig[30].value === false ? "False" : "True";
      vm.dataconfig[31].value =
        vm.dataconfig[31].value === false ? "False" : "True";
      vm.dataconfig[32].value =
        vm.dataconfig[32].value === false ? "False" : "True";
      vm.dataconfig[34].value =
        vm.dataconfig[34].value === false ? "False" : "True";
      vm.dataconfig[35].value =
        vm.dataconfig[35].value === false ? "False" : "True";
      vm.dataconfig[36].value =
        vm.dataconfig[36].value === false ? "False" : "True";
      vm.dataconfig[37].value =
        vm.dataconfig[37].value === false ? "False" : "True";
      vm.dataconfig[38].value =
        vm.dataconfig[38].value === false ? "False" : "True";
      vm.dataconfig[39].value =
        vm.dataconfig[39].value === false ? "False" : "True";
      vm.dataconfig[40].value =
        vm.dataconfig[40].value === false ? "False" : "True";
      vm.dataconfig[41].value =
        vm.dataconfig[41].value === false ? "False" : "True";

      var demos = _.map(vm.listdemographics, "id");
      vm.dataconfig[25].value = demos.join();
      vm.listdemographics = [];
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de resultados e informes**//
    function resultreport(data) {
      vm.dataconfig = [
        {
          key: "ComentarioRegistroRestringido", //0
          value: $filter("filter")(
            data.data,
            {
              key: "ComentarioRegistroRestringido",
            },
            true
          )[0].value,
        },
        {
          key: "ComentarioResultadoPendiente", //1
          value: $filter("filter")(
            data.data,
            {
              key: "ComentarioResultadoPendiente",
            },
            true
          )[0].value,
        },
        {
          key: "WidgetResultados", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "WidgetResultados",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WidgetResultados",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "MotivoModificacionResultado", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "MotivoModificacionResultado",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlNodeJs", //4
          value: $filter("filter")(
            data.data,
            {
              key: "UrlNodeJs",
            },
            true
          )[0].value,
        },
        {
          key: "VerPreliminarRegistro", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerPreliminarRegistro",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EntregaInformesSede", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "EntregaInformesSede",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "GeneraNombrePDFHistoria", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "GeneraNombrePDFHistoria",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "IdentificarCopiasInformes", //8
          value:
            $filter("filter")(
              data.data,
              {
                key: "IdentificarCopiasInformes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ImprimirAdjuntos", //9
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirAdjuntos",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ImprimirAdjuntosPreliminar", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirAdjuntosPreliminar",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TipoImpresion", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "TipoImpresion",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "TipoImpresion",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "ResolverImpresora", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "ResolverImpresora",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "ResolverImpresora",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "ImprimirInformeFinal", //13
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirInformeFinal",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "ImprimirInformeFinal",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "SmtpHostName", //14
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpHostName",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpPort", //15
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpPort",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpSSL", //16
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpSSL",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpAuthUser", //17
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpAuthUser",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpPasswordUser", //18
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpPasswordUser",
            },
            true
          )[0].value,
        },
        {
          key: "EnviarCorreo", //19
          value:
            $filter("filter")(
              data.data,
              {
                key: "EnviarCorreo",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "EnviarCorreo",
                  },
                  true
                )[0].value,
        },
        {
          key: "EmailSubjectPatient", //20
          value: $filter("filter")(
            data.data,
            {
              key: "EmailSubjectPatient",
            },
            true
          )[0].value,
        },
        {
          key: "EmailSubjectPhysician", //21
          value: $filter("filter")(
            data.data,
            {
              key: "EmailSubjectPhysician",
            },
            true
          )[0].value,
        },
        {
          key: "EmailBody", //22
          value: $filter("filter")(
            data.data,
            {
              key: "EmailBody",
            },
            true
          )[0].value,
        },
        {
          key: "FemaleValue", //23
          value:
            $filter("filter")(
              data.data,
              {
                key: "FemaleValue",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "FemaleValue",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "MaleValue", //24
          value:
            $filter("filter")(
              data.data,
              {
                key: "MaleValue",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "MaleValue",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "UndefinedValue", //25
          value:
            $filter("filter")(
              data.data,
              {
                key: "UndefinedValue",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "UndefinedValue",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "MostrarReLlamadoColumna", //26
          value:
            $filter("filter")(
              data.data,
              {
                key: "MostrarReLlamadoColumna",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "OrdenamientoRegistroResultados", //27
          value:
            $filter("filter")(
              data.data,
              {
                key: "OrdenamientoRegistroResultados",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "OrdenamientoRegistroResultados",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "EntrevistaPanicoObligatoria", //28
          value:
            $filter("filter")(
              data.data,
              {
                key: "EntrevistaPanicoObligatoria",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "SmtpProtocol", //29
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpProtocol",
            },
            true
          )[0].value,
        },
        {
          key: "ServidorCorreo", //30
          value: $filter("filter")(
            data.data,
            {
              key: "ServidorCorreo",
            },
            true
          )[0].value,
        },
        {
          key: "verAnalitosDelPerfil", //31
          value:
            $filter("filter")(
              data.data,
              {
                key: "verAnalitosDelPerfil",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "verPaquetePorAreaInforme", //32
          value:
            $filter("filter")(
              data.data,
              {
                key: "verPaquetePorAreaInforme",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EnviarCopiaInformes", //33
          value:
            $filter("filter")(
              data.data,
              {
                key: "EnviarCopiaInformes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "SendAutomaticResultEmail", //34
          value:
            $filter("filter")(
              data.data,
              {
                key: "SendAutomaticResultEmail",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "PermisoPorUsuarioReportPreliminar", //35
          value:
            $filter("filter")(
              data.data,
              {
                key: "PermisoPorUsuarioReportPreliminar",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "AutomaticoEliminarFormula", //36
          value:
            $filter("filter")(
              data.data,
              {
                key: "AutomaticoEliminarFormula",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "AutomaticoModificaFormula", //37
          value:
            $filter("filter")(
              data.data,
              {
                key: "AutomaticoModificaFormula",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TemperaturaReporteRemisiones", //38
          value:
            $filter("filter")(
              data.data,
              {
                key: "TemperaturaReporteRemisiones",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "IdiomaReporteResultados", //39
          value: $filter("filter")(
            data.data,
            {
              key: "IdiomaReporteResultados",
            },
            true
          )[0].value,
        },
        {
          key: "AddNotes", //40
          value:
            $filter("filter")(
              data.data,
              {
                key: "AddNotes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ImprimirIngresoOrdenes", //41
          value:
            $filter("filter")(
              data.data,
              {
                key: "ImprimirIngresoOrdenes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "GenerarPDFCon", //42
          value:
            $filter("filter")(
              data.data,
              {
                key: "GenerarPDFCon",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "GenerarPDFCon",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "SelloFresco", //43
          value:
            $filter("filter")(
              data.data,
              {
                key: "SelloFresco",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "VerObservaciones", //44
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerObservaciones",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Agregaredicionresultadosusuario", //45
          value:
            $filter("filter")(
              data.data,
              {
                key: "Agregaredicionresultadosusuario",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "FechaValidacionAnalitoEnPerfil", //46
          value:
            $filter("filter")(
              data.data,
              {
                key: "FechaValidacionAnalitoEnPerfil",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "OrdencompletaRegistroResultados", //47
          value:
            $filter("filter")(
              data.data,
              {
                key: "OrdencompletaRegistroResultados",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ReporteHistorico", //48
          value:
            $filter("filter")(
              data.data,
              {
                key: "ReporteHistorico",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Noverelresultadovacio", //49
          value:
            $filter("filter")(
              data.data,
              {
                key: "Noverelresultadovacio",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ordendeimpresionporcodigo", //50
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ordendeimpresionporcodigo",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "clientIdEmail", //51
          value:
            $filter("filter")(
              data.data,
              {
                key: "clientIdEmail",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "clientIdEmail",
                  },
                  true
                )[0].value,
        },
        {
          key: "authorityEmail", //52
          value:
            $filter("filter")(
              data.data,
              {
                key: "authorityEmail",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "authorityEmail",
                  },
                  true
                )[0].value,
        },
        {
          key: "clientSecretEmail", //53
          value:
            $filter("filter")(
              data.data,
              {
                key: "clientSecretEmail",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "clientSecretEmail",
                  },
                  true
                )[0].value,
        },
        {
          key: "PrefijoResultadosPDF", //54
          value:
            $filter("filter")(
              data.data,
              {
                key: "PrefijoResultadosPDF",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "PrefijoResultadosPDF",
                  },
                  true
                )[0].value,
        },
        {
          key: "PedirCorreoAdicional", //55
          value:
            $filter("filter")(
              data.data,
              {
                key: "PedirCorreoAdicional",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Activarconfidencialidadprueba", //56
          value:
            $filter("filter")(
              data.data,
              {
                key: "Activarconfidencialidadprueba",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Examenconfidencial", //57
          value:
            $filter("filter")(
              data.data,
              {
                key: "Examenconfidencial",
              },
              true
            )[0].value === "" ||
            $filter("filter")(
              data.data,
              {
                key: "Examenconfidencial",
              },
              true
            )[0].value === undefined
              ? undefined
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "Examenconfidencial",
                    },
                    true
                  )[0].value
                ),
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para la guardar de las llaves de resultados e informes**//
    function update() {
      vm.dataconfig[3].value =
        vm.dataconfig[3].value === false ? "False" : "True";
      vm.dataconfig[5].value =
        vm.dataconfig[5].value === false ? "False" : "True";
      vm.dataconfig[6].value =
        vm.dataconfig[6].value === false ? "False" : "True";
      vm.dataconfig[7].value =
        vm.dataconfig[7].value === false ? "False" : "True";
      vm.dataconfig[8].value =
        vm.dataconfig[8].value === false ? "False" : "True";
      vm.dataconfig[9].value =
        vm.dataconfig[9].value === false ? "False" : "True";
      vm.dataconfig[10].value =
        vm.dataconfig[10].value === false ? "False" : "True";
      vm.dataconfig[26].value =
        vm.dataconfig[26].value === false ? "False" : "True";
      vm.dataconfig[28].value =
        vm.dataconfig[28].value === false ? "False" : "True";
      vm.dataconfig[31].value =
        vm.dataconfig[31].value === false ? "False" : "True";
      vm.dataconfig[33].value =
        vm.dataconfig[33].value === false ? "False" : "True";
      vm.dataconfig[32].value =
        vm.dataconfig[32].value === false ? "False" : "True";
      vm.dataconfig[34].value =
        vm.dataconfig[34].value === false ? "False" : "True";
      vm.dataconfig[35].value =
        vm.dataconfig[35].value === false ? "False" : "True";
      vm.dataconfig[36].value =
        vm.dataconfig[36].value === false ? "False" : "True";
      vm.dataconfig[37].value =
        vm.dataconfig[37].value === false ? "False" : "True";
      vm.dataconfig[38].value =
        vm.dataconfig[38].value === false ? "False" : "True";
      vm.dataconfig[40].value =
        vm.dataconfig[40].value === false ? "False" : "True";
      vm.dataconfig[41].value =
        vm.dataconfig[41].value === false ? "False" : "True";
      vm.dataconfig[43].value =
        vm.dataconfig[43].value === false ? "False" : "True";
      vm.dataconfig[44].value =
        vm.dataconfig[44].value === false ? "False" : "True";
      vm.dataconfig[45].value =
        vm.dataconfig[45].value === false ? "False" : "True";
      vm.dataconfig[46].value =
        vm.dataconfig[46].value === false ? "False" : "True";
      vm.dataconfig[47].value =
        vm.dataconfig[47].value === false ? "False" : "True";
      vm.dataconfig[48].value =
        vm.dataconfig[48].value === false ? "False" : "True";
      vm.dataconfig[49].value =
        vm.dataconfig[49].value === false ? "False" : "True";
      vm.dataconfig[50].value =
        vm.dataconfig[50].value === false ? "False" : "True";
      vm.dataconfig[55].value =
        vm.dataconfig[55].value === false ? "False" : "True";
      vm.dataconfig[56].value =
        vm.dataconfig[56].value === false ? "False" : "True";
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de tarifa y caja**//
    function rate(data) {
      vm.dataconfig = [
        {
          key: "ManejoTarifa", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoTarifa",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Facturacion", //1
          value: $filter("filter")(
            data.data,
            {
              key: "Facturacion",
            },
            true
          )[0].value,
        },
        {
          key: "ManejoCliente", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoCliente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Caja", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "Caja",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "RestarImpuesto", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "RestarImpuesto",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ManejoCentavos", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoCentavos",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Impuesto", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "Impuesto",
              },
              true
            )[0].value === ""
              ? ""
              : parseFloat(
                  $filter("filter")(
                    data.data,
                    {
                      key: "Impuesto",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "Moneda", //7
          value: $filter("filter")(
            data.data,
            {
              key: "Moneda",
            },
            true
          )[0].value,
        },
        {
          key: "SimboloMonetario", //8
          value: $filter("filter")(
            data.data,
            {
              key: "SimboloMonetario",
            },
            true
          )[0].value,
        },
        {
          key: "facturacionCentral", //9
          value:
            $filter("filter")(
              data.data,
              {
                key: "facturacionCentral",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "facturacionAutomatica", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "facturacionAutomatica",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "facturaPorCorreo", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "facturaPorCorreo",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "reporteCajaPorHora", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "reporteCajaPorHora",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlApiFacturacion", //13
          value: $filter("filter")(
            data.data,
            {
              key: "UrlApiFacturacion",
            },
            true
          )[0].value,
        },
        {
          key: "AdicionClientesIngreso", //14
          value:
            $filter("filter")(
              data.data,
              {
                key: "AdicionClientesIngreso",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ManejoDescuentoGeneral", //15
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoDescuentoGeneral",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DescuentoPorPrueba", //16
          value:
            $filter("filter")(
              data.data,
              {
                key: "DescuentoPorPrueba",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "RestarCopago", //17
          value:
            $filter("filter")(
              data.data,
              {
                key: "RestarCopago",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "PreciosServicioTalon", //18
          value:
            $filter("filter")(
              data.data,
              {
                key: "PreciosServicioTalon",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EditarOrdenCaja", //20
          value:
            $filter("filter")(
              data.data,
              {
                key: "EditarOrdenCaja",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "PrecioFactura", //19
          value: $filter("filter")(
            data.data,
            {
              key: "PrecioFactura",
            },
            true
          )[0].value,
        },
        {
          key: "CajaAutomatica", //21
          value:
            $filter("filter")(
              data.data,
              {
                key: "CajaAutomatica",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "EditarEmpresa", //22
          value:
            $filter("filter")(
              data.data,
              {
                key: "EditarEmpresa",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "CopagoPorcentaje", //23
          value:
            $filter("filter")(
              data.data,
              {
                key: "CopagoPorcentaje",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlExportarInformacionExcel", //24
          value: $filter("filter")(
            data.data,
            {
              key: "UrlExportarInformacionExcel",
            },
            true
          )[0].value,
        },
        {
          key: "CargoDomicilio", //25
          value:
            $filter("filter")(
              data.data,
              {
                key: "CargoDomicilio",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "PreciosRevisionResultados", //26
          value:
            $filter("filter")(
              data.data,
              {
                key: "PreciosRevisionResultados",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "VerClienteConDescuento", //27
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerClienteConDescuento",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que evalua si en tarifa se encuentra habilitado**//
    function getIsRate() {
      if (vm.dataconfig[0].value === false) {
        vm.dataconfig[1].value = "0";
        vm.dataconfig[2].value = false;
        vm.dataconfig[3].value = false;
        vm.dataconfig[4].value = false;
        vm.dataconfig[5].value = false;
        vm.dataconfig[14].value = false;
        vm.dataconfig[15].value = false;
        vm.dataconfig[16].value = false;
        vm.dataconfig[27].value = false;
        vm.dataconfig[13].value = "";
      }
    }
    //** Metodo que evalua si en tarifa se encuentra habilitado**//
    vm.validatediscount = validatediscount;
    function validatediscount() {
      if (vm.dataconfig[16].value === false) {
        vm.dataconfig[27].value = false;
      }
    }
    //** Metodo que construye el objeto para la guardar de las llaves de tarifa y caja**//
    function updaterate() {
      vm.dataconfig[0].value =
        vm.dataconfig[0].value === false ? "False" : "True";
      vm.dataconfig[2].value =
        vm.dataconfig[2].value === false ? "False" : "True";
      vm.dataconfig[3].value =
        vm.dataconfig[3].value === false ? "False" : "True";
      vm.dataconfig[4].value =
        vm.dataconfig[4].value === false ? "False" : "True";
      vm.dataconfig[5].value =
        vm.dataconfig[5].value === false ? "False" : "True";
      vm.dataconfig[9].value =
        vm.dataconfig[9].value === false ? "False" : "True";
      vm.dataconfig[10].value =
        vm.dataconfig[10].value === false ? "False" : "True";
      vm.dataconfig[11].value =
        vm.dataconfig[11].value === false ? "False" : "True";
      vm.dataconfig[12].value =
        vm.dataconfig[12].value === false ? "False" : "True";
      vm.dataconfig[14].value =
        vm.dataconfig[14].value === false ? "False" : "True";
      vm.dataconfig[15].value =
        vm.dataconfig[15].value === false ? "False" : "True";
      vm.dataconfig[16].value =
        vm.dataconfig[16].value === false ? "False" : "True";
      vm.dataconfig[17].value =
        vm.dataconfig[17].value === false ? "False" : "True";
      vm.dataconfig[18].value =
        vm.dataconfig[18].value === false ? "False" : "True";
      vm.dataconfig[19].value =
        vm.dataconfig[19].value === false ? "False" : "True";
      vm.dataconfig[21].value =
        vm.dataconfig[21].value === false ? "False" : "True";
      vm.dataconfig[22].value =
        vm.dataconfig[22].value === false ? "False" : "True";
      vm.dataconfig[23].value =
        vm.dataconfig[23].value === false ? "False" : "True";
      vm.dataconfig[25].value =
        vm.dataconfig[25].value === false ? "False" : "True";
      vm.dataconfig[26].value =
        vm.dataconfig[26].value === false ? "False" : "True";
      vm.dataconfig[27].value =
        vm.dataconfig[27].value === false ? "False" : "True";
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de trazabilidad de la muestra**//
    function sampletraceability(data) {
      vm.dataconfig = [
        {
          key: "Trazabilidad", //0
          value: $filter("filter")(
            data.data,
            {
              key: "Trazabilidad",
            },
            true
          )[0].value,
        },
        {
          key: "Trazabilidades", //1
          value: $filter("filter")(
            data.data,
            {
              key: "Trazabilidades",
            },
            true
          )[0].value,
        },
        {
          key: "WidgetMuestraTiempo", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "WidgetMuestraTiempo",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WidgetMuestraTiempo",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "DestinoVerificaCentralMuestras", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "DestinoVerificaCentralMuestras",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DestinoVerificaCentralMuestras",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "DestinoVerificaDesecho", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "DestinoVerificaDesecho",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DestinoVerificaDesecho",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "GradillaGeneral", //5
          value: $filter("filter")(
            data.data,
            {
              key: "GradillaGeneral",
            },
            true
          )[0].value,
        },
        {
          key: "GradillaPendienteColor", //6
          value: $filter("filter")(
            data.data,
            {
              key: "GradillaPendienteColor",
            },
            true
          )[0].value,
        },
        {
          key: "GradillaPendiente", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "GradillaPendiente",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Fila", //8
          value:
            $filter("filter")(
              data.data,
              {
                key: "Fila",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "Fila",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "GradillaCondifencialesColor", //9
          value: $filter("filter")(
            data.data,
            {
              key: "GradillaCondifencialesColor",
            },
            true
          )[0].value,
        },
        {
          key: "GradillaConfidenciales", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "GradillaConfidenciales",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Columna", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "Columna",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "Columna",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "ManejoTemperatura", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "ManejoTemperatura",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "invertirGradilla", //13
          value:
            $filter("filter")(
              data.data,
              {
                key: "invertirGradilla",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ModificarExamenesEntrada", //14
          value:
            $filter("filter")(
              data.data,
              {
                key: "ModificarExamenesEntrada",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "VerAlarmaCalidadMuestra", //15
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerAlarmaCalidadMuestra",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Manejodepuntodetomamuestra", //16
          value:
            $filter("filter")(
              data.data,
              {
                key: "Manejodepuntodetomamuestra",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para guardar las llaves de trazabilidad de la muestra**//
    function updatesampletraceability() {
      vm.dataconfig[7].value =
        vm.dataconfig[7].value === false ? "False" : "True";
      vm.dataconfig[10].value =
        vm.dataconfig[10].value === false ? "False" : "True";
      vm.dataconfig[12].value =
        vm.dataconfig[12].value === false ? "False" : "True";
      vm.dataconfig[13].value =
        vm.dataconfig[13].value === false ? "False" : "True";
      vm.dataconfig[14].value =
        vm.dataconfig[14].value === false ? "False" : "True";
      vm.dataconfig[16].value =
        vm.dataconfig[16].value === false ? "False" : "True";  
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de citas**//
    function appointments(data) {
      vm.dataconfig = [
        {
          key: "HorarioAtencionDesde", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "HorarioAtencionDesde",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "HorarioAtencionDesde",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "HorarioAtencionHasta", //1
          value:
            $filter("filter")(
              data.data,
              {
                key: "HorarioAtencionHasta",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "HorarioAtencionHasta",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "IntervalosCitas", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntervalosCitas",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "IntervalosCitas",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "CantidadCitasIntervalo", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "CantidadCitasIntervalo",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "CantidadCitasIntervalo",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "ReiniciarContador", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "ReiniciarContador",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "ReiniciarContador",
                    },
                    true
                  )[0].value
                ),
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para la consulta de las llaves de ldap**//
    function ldap(data) {
      vm.dataconfig = [
        {
          key: "LoginActiveDirectory", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "LoginActiveDirectory",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "DomainLDAP", //1
          value: $filter("filter")(
            data.data,
            {
              key: "DomainLDAP",
            },
            true
          )[0].value,
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo para evaluar que los escrito sea email**//
    function afterSelection(item) {
      if (
        !new RegExp(
          "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
        ).test(item)
      ) {
        vm.dataconfig[0].value = $filter("filter")(
          vm.dataconfig[0].value,
          "!" + item,
          true
        );
      }
    }
    //** Metodo que construye el objeto para la consulta de las llaves de utilidades**//
    function utilities(data) {
      var CitaTipodeorden = $filter("filter")(
        data.data,
        { key: "CitaTipodeorden" },
        true
      )[0].value;
      var CitaServicio = $filter("filter")(
        data.data,
        { key: "CitaServicio" },
        true
      )[0].value;

      vm.dataconfig = [
        {
          key: "IngresoEntrevista", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "IngresoEntrevista",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "IngresoEntrevista",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "VerificacionMuestra", //1
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerificacionMuestra",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "VerificacionMuestra",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "RegistroResultados", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "RegistroResultados",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "RegistroResultados",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "RangoInicial", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "RangoInicial",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "RangoInicial",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "RangoFinal", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "RangoFinal",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "RangoFinal",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "RangoInicialCitas", //5
          value: $filter("filter")(
              data.data, {
              key: "RangoInicialCitas",
          },
              true
          )[0].value === "" ?
              undefined :
              $filter("filter")(
                  data.data, {
                  key: "RangoInicialCitas",
              },
                  true
              )[0].value
          ,
      },
      {
          key: "RangoFinalCitas", //6
          value: $filter("filter")(
              data.data, {
              key: "RangoFinalCitas",
          },
              true
          )[0].value === "" ?
              undefined :
              $filter("filter")(
                  data.data, {
                  key: "RangoFinalCitas",
              },
                  true
              )[0].value
          ,
      },
        {
          key: "notificacionUsuarios", //7
          value: $filter("filter")(
            data.data,
            {
              key: "notificacionUsuarios",
            },
            true
          )[0].value,
        },
        {
          key: "NotificacionAsuntoRecuperacion", //8
          value: $filter("filter")(
            data.data,
            {
              key: "NotificacionAsuntoRecuperacion",
            },
            true
          )[0].value,
        },
        {
          key: "NotificacionPlantillaRecuperacion", //9
          value: $filter("filter")(
            data.data,
            {
              key: "NotificacionPlantillaRecuperacion",
            },
            true
          )[0].value,
        },
        {
          key: "SinSeleccionSede", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "SinSeleccionSede",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptcodigobarras", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptcodigobarras",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptlaboratoriosexternos", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptlaboratoriosexternos",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptmuestras", //13
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptmuestras",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptexamenespendientes", //14
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptexamenespendientes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptpruebasporsede", //15
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptpruebasporsede",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Ptremisiones", //16
          value:
            $filter("filter")(
              data.data,
              {
                key: "Ptremisiones",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btninconsistencias", //17
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btninconsistencias",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btnadjuntos", //18
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btnadjuntos",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btnrepeticiones", //19
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btnrepeticiones",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btnconsultarepeticiones", //20
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btnconsultarepeticiones",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btnresultadosretrasados", //21
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btnresultadosretrasados",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btnantibiograma", //22
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btnantibiograma",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Btncodigodebarras", //23
          value:
            $filter("filter")(
              data.data,
              {
                key: "Btncodigodebarras",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "verTrazabilidadtoma", //24
          value:
            $filter("filter")(
              data.data,
              {
                key: "verTrazabilidadtoma",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ActivarCitas", //25
          value:
            $filter("filter")(
              data.data,
              {
                key: "ActivarCitas",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "CitaTipodeorden", //26
          value:
            CitaTipodeorden === "" || CitaTipodeorden === undefined
              ? undefined
              : parseInt(CitaTipodeorden),
        },
        {
          key: "CitaServicio", //27
          value:
            CitaServicio === "" || CitaServicio === undefined
              ? undefined
              : parseInt(CitaServicio),
        },
        {
          key: "SmtpHostNameAppointment", //28
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpHostNameAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpPortAppointment", //29
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpPortAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpSSLAppointment", //30
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpSSLAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpAuthUserAppointment", //31
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpAuthUserAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpPasswordUserAppointment", //32
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpPasswordUserAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "SmtpProtocolAppointment", //33
          value: $filter("filter")(
            data.data,
            {
              key: "SmtpProtocolAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "ServidorCorreoAppointment", //34
          value: $filter("filter")(
            data.data,
            {
              key: "ServidorCorreoAppointment",
            },
            true
          )[0].value,
        },
        {
          key: "HorarioInicialCitas", //35
          value: $filter("filter")(
              data.data, {
              key: "HorarioInicialCitas",
          },
              true
          )[0].value === "" ?
              undefined :
              $filter("filter")(
                  data.data, {
                  key: "HorarioInicialCitas",
              },
                  true
              )[0].value
          ,
      },
      {
          key: "HorarioFinalCitas", //36
          value: $filter("filter")(
              data.data, {
              key: "HorarioFinalCitas",
          },
              true
          )[0].value === "" ?
              undefined :
              $filter("filter")(
                  data.data, {
                  key: "HorarioFinalCitas",
              },
                  true
              )[0].value
          ,
      },
      ];
      vm.loadingdata = false;
    }
    vm.validated = validated;
    function validated(init, end) {
      vm.errordate = false;
      var init = parseInt(init);
      var end = parseInt(end);
      if (init >= end) {
        vm.errordate = true;
      }
    }
    vm.changeappoiment = changeappoiment;
    //** Metodo que evalua el cambio de la llave de las citas**//
    function changeappoiment() {
      if (vm.dataconfig[25].value === false) {
        vm.dataconfig[5].value = 0;
        vm.dataconfig[6].value = 0; 
        vm.dataconfig[35].value = "00:00";
        vm.dataconfig[36].value = "23:30"; 
        vm.dataconfig[26].value = undefined;
        vm.dataconfig[27].value = undefined;
      }
    }
    vm.changearea = changearea;
    function changearea() {
      if (vm.dataconfig[56].value === false) {
        vm.dataconfig[57].value = undefined;
      }
    }
    //** Método para consultar la llave de configuración de los digitos de la orden**//
    function getConfigurationDigitosOrden(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.utilities(data);
      return configurationDS
        .getConfigurationKey(auth.authToken, "DigitosOrden")
        .then(
          function (data) {
            var valueint = "9";
            for (var i = 0; i < data.data.value - 1; i++) {
              valueint = valueint + "" + 9;
            }
            vm.digitosOrdenNumber = valueint;
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que construye el objeto para la consulta de las llaves de microbiologia**//
    function planowhonet(data) {
      vm.dataconfig = [
        {
          key: "DestinoVerificaMicrobiologia", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "DestinoVerificaMicrobiologia",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DestinoVerificaMicrobiologia",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "SiembraMicrobiologia", //1
          value:
            $filter("filter")(
              data.data,
              {
                key: "SiembraMicrobiologia",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "RegistroCMIM", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "RegistroCMIM",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "WhonetTHM", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "WhonetTHM",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WhonetTHM",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "WhonetAPB", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "WhonetAPB",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WhonetAPB",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "WhonetEDTA", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "WhonetEDTA",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WhonetEDTA",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "WhonetTipo", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "WhonetTipo",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WhonetTipo",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "DestinoVerificaMicrobiologia2", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "DestinoVerificaMicrobiologia2",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DestinoVerificaMicrobiologia2",
                    },
                    true
                  )[0].value
                ),
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para guardar las llaves de microbiologia**//
    function updateplanowhonet() {
      vm.dataconfig[1].value =
        vm.dataconfig[1].value === false ? "False" : "True";
      vm.dataconfig[2].value =
        vm.dataconfig[2].value === false ? "False" : "True";
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de integraciones**//
    function integrations(data) {
      console.log(data);
      var ApiFacturacionIdUsuario = $filter("filter")(
        data.data,
        { key: "ApiFacturacionIdUsuario" },
        true
      )[0].value;
      vm.dataconfig = [
        {
          key: "IntegracionDashBoard", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionDashBoard",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlDashBoard", //1
          value: $filter("filter")(
            data.data,
            {
              key: "UrlDashBoard",
            },
            true
          )[0].value,
        },
        {
          key: "IntegracionSIGA", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionSIGA",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlSIGA", //3
          value: $filter("filter")(
            data.data,
            {
              key: "UrlSIGA",
            },
            true
          )[0].value,
        },
        {
          key: "SedeSIGA", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "SedeSIGA",
              },
              true
            )[0].value === "" ||
            $filter("filter")(
              data.data,
              {
                key: "SedeSIGA",
              },
              true
            )[0].value === undefined
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "SedeSIGA",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "OrdenesSIGA", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "OrdenesSIGA",
              },
              true
            )[0].value === "" ||
            $filter("filter")(
              data.data,
              {
                key: "OrdenesSIGA",
              },
              true
            )[0].value === undefined
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "OrdenesSIGA",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "VerificacionSIGA", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "VerificacionSIGA",
              },
              true
            )[0].value === "" ||
            $filter("filter")(
              data.data,
              {
                key: "VerificacionSIGA",
              },
              true
            )[0].value === undefined
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "VerificacionSIGA",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "IntegracionDatabank", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionDatabank",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlDatabank", //8
          value: $filter("filter")(
            data.data,
            {
              key: "UrlDatabank",
            },
            true
          )[0].value,
        },
        {
          key: "TomaMuestraHospitalaria", //9
          value:
            $filter("filter")(
              data.data,
              {
                key: "TomaMuestraHospitalaria",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "Homebound", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "Homebound",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "IntegracionHomebound", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionHomebound",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlHomebound", //12.
          value: $filter("filter")(
            data.data,
            {
              key: "UrlHomebound",
            },
            true
          )[0].value,
        },
        {
          key: "SeccionEnvioDatabank", //13.
          value:
            $filter("filter")(
              data.data,
              {
                key: "SeccionEnvioDatabank",
              },
              true
            )[0].value === ""
              ? undefined
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "SeccionEnvioDatabank",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "CodigoPruebaCruzada", //14
          value: $filter("filter")(
            data.data,
            {
              key: "CodigoPruebaCruzada",
            },
            true
          )[0].value,
        },
        {
          key: "SedeVerificacionDatabank", //15.
          value:
            $filter("filter")(
              data.data,
              {
                key: "SedeVerificacionDatabank",
              },
              true
            )[0].value === ""
              ? undefined
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "SedeVerificacionDatabank",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "IntegracionQM", //16
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionQM",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlQM", //17
          value: $filter("filter")(
            data.data,
            {
              key: "UrlQM",
            },
            true
          )[0].value,
        },
        {
          key: "TableroTomaDeMuestra", //18
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroTomaDeMuestra",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TableroProductividadPorSeccion", //19
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroProductividadPorSeccion",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TableroTiempoDeOportunidad", //20
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroTiempoDeOportunidad",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TableroValidacion", //21
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroValidacion",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TableroCalificacionDelServicio", //22
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroCalificacionDelServicio",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "TableroSeguimientoDePruebas", //23
          value:
            $filter("filter")(
              data.data,
              {
                key: "TableroSeguimientoDePruebas",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "IntegracionSiigo", //24
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionSiigo",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlSiigo", //25
          value: $filter("filter")(
            data.data,
            {
              key: "UrlSiigo",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoCentralSystem", //26
          value:
            $filter("filter")(
              data.data,
              {
                key: "SiigoCentralSystem",
              },
              true
            )[0].value === ""
              ? undefined
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "SiigoCentralSystem",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "SiigoAccessKey", //27
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoAccessKey",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoUserName", //28
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoUserName",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoIdPagoContado", //29
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoIdPagoContado",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoIdPagoCredito", //30
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoIdPagoCredito",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoCodigoComprobante", //31
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoCodigoComprobante",
            },
            true
          )[0].value,
        },
        {
          key: "SiigoCodigoComprobanteNC", //32
          value: $filter("filter")(
            data.data,
            {
              key: "SiigoCodigoComprobanteNC",
            },
            true
          )[0].value,
        },
        {
          key: "IntegracionFacturacionExterna", //33
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionFacturacionExterna",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlFacturacionExterna", //34
          value: $filter("filter")(
            data.data,
            {
              key: "UrlFacturacionExterna",
            },
            true
          )[0].value,
        },
        {
          key: "ApiFacturacionIdUsuario", //35.
          value:
            ApiFacturacionIdUsuario === "" ||
            ApiFacturacionIdUsuario === undefined
              ? undefined
              : parseInt(ApiFacturacionIdUsuario),
        },
        {
          key: "IntegracionMINSA", //36
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionMINSA",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "correoModificacionResultados", //37
          value:
            $filter("filter")(
              data.data,
              {
                key: "correoModificacionResultados",
              },
              true
            )[0].value === ""
              ? []
              : JSON.parse(
                  $filter("filter")(
                    data.data,
                    {
                      key: "correoModificacionResultados",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "urlTribunalElectoral", //38
          value:
            $filter("filter")(
              data.data,
              {
                key: "urlTribunalElectoral",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "urlTribunalElectoral",
                  },
                  true
                )[0].value,
        },
        {
          key: "usuarioTribunalElectoral", //39
          value:
            $filter("filter")(
              data.data,
              {
                key: "usuarioTribunalElectoral",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "usuarioTribunalElectoral",
                  },
                  true
                )[0].value,
        },
        {
          key: "contrasenaTribunalElectoral", //40
          value:
            $filter("filter")(
              data.data,
              {
                key: "contrasenaTribunalElectoral",
              },
              true
            )[0].value === ""
              ? ""
              : $filter("filter")(
                  data.data,
                  {
                    key: "contrasenaTribunalElectoral",
                  },
                  true
                )[0].value,
        },
        {
          key: "AreaEpidemiologica", //41
          value:
            $filter("filter")(
              data.data,
              {
                key: "AreaEpidemiologica",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "AreaEpidemiologica",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "IntegracionTribunal", //42
          value:
            $filter("filter")(
              data.data,
              {
                key: "IntegracionTribunal",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "CuboEstadistico", //43
          value:
            $filter("filter")(
              data.data,
              {
                key: "CuboEstadistico",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "URLCuboEstadistico", //44
          value: $filter("filter")(
            data.data,
            {
              key: "URLCuboEstadistico",
            },
            true
          )[0].value,
        },
        {
          key: "ActivarTransplantes", //45
          value:
            $filter("filter")(
              data.data,
              {
                key: "ActivarTransplantes",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "RutaAdjuntosReceptores", //46
          value: $filter("filter")(
            data.data,
            {
              key: "RutaAdjuntosReceptores",
            },
            true
          )[0].value,
        },
        {
          key: "Migration", //47
          value:
            $filter("filter")(
              data.data,
              {
                key: "Migration",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlMigration", //48
          value: $filter("filter")(
            data.data,
            {
              key: "UrlMigration",
            },
            true
          )[0].value,
        },
        {
          key: "ReporteTamizaje", //49
          value:
            $filter("filter")(
              data.data,
              {
                key: "ReporteTamizaje",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "URLReporteTamizaje", //50
          value: $filter("filter")(
            data.data,
            {
              key: "URLReporteTamizaje",
            },
            true
          )[0].value,
        },
        {
          key: "manejodesigaporsede", //51
          value:
            $filter("filter")(
              data.data,
              {
                key: "manejodesigaporsede",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "configuraciondesigaporsede", //52
          value:
            $filter("filter")(
              data.data,
              {
                key: "configuraciondesigaporsede",
              },
              true
            )[0].value === ""
              ? [
                  {
                    id: 0,
                    urlsiga: "",
                    listbranchsiga: [],
                    listservisesiga: [],
                    edit: false,
                  },
                ]
              : JSON.parse(
                  $filter("filter")(
                    data.data,
                    {
                      key: "configuraciondesigaporsede",
                    },
                    true
                  )[0].value
                ),
        },
      ];
      vm.listconfigbranchsiga = _.clone(vm.dataconfig[52].value);
      vm.loadingdata = false;
    }

    vm.validatedconexionforbranch = validatedconexionforbranch;
    function validatedconexionforbranch(siga) {
      vm.loadingdata = true;
      var key = {
        url: siga.urlsiga,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sigaDS.getsigabranchesurl(auth.authToken, key).then(
        function (data) {
          logger.success($filter("translate")("0974"));
          data.data.forEach(function (branchsiga) {
            siga.listbranchsiga.push({
              id: branchsiga.id,
              name: branchsiga.name,
            });
          });
          siga.listbranchsiga = $filter("orderBy")(
            _.clone(siga.listbranchsiga),
            "name"
          );
          vm.loadingdata = false;
        },
        function (error) {
          vm.loadingdata = false;
          logger.error("La ruta no tiene conexion");
        }
      );
    }

    vm.cargardatabranch = cargardatabranch;
    function cargardatabranch(sigabranch) {
      var key = {
        url: sigabranch.urlsiga,
        id: sigabranch.branchsiga.id,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sigaDS.getsigaserviceurl(auth.authToken, key).then(
        function (data) {
          if (data.status === 200) {
            data.data.forEach(function (servisesiga) {
              sigabranch.listservisesiga.push({
                id: servisesiga.id,
                name: servisesiga.name,
              });
            });
            sigabranch.listservisesiga = $filter("orderBy")(
              sigabranch.listservisesiga,
              "name"
            );
          }
        },
        function (error) {}
      );
    }

    vm.deletesiga = deletesiga;
    function deletesiga(siga) {
      vm.listconfigbranchsiga = _.remove(
        vm.listconfigbranchsiga,
        function (delet) {
          return delet.id !== siga;
        }
      );
    }
    vm.addsiga = addsiga;
    function addsiga() {
      vm.listconfigbranchsiga[vm.listconfigbranchsiga.length - 1].edit = true;
      var siga = {
        id: vm.listconfigbranchsiga[vm.listconfigbranchsiga.length - 1].id + 1,
        urlsiga: "",
        listbranchsiga: [],
        listservisesiga: [],
        edit: false,
      };
      vm.listconfigbranchsiga.add(siga);
    }

    vm.changeminsa = changeminsa;
    function changeminsa() {
      if (vm.dataconfig[57].value === false) {
        vm.dataconfig[37].value = [];
        vm.dataconfig[41].value = "";
      }
    }

    vm.changetribunal = changetribunal;
    function changetribunal() {
      if (vm.dataconfig[42].value === false) {
        vm.dataconfig[38].value = "";
        vm.dataconfig[39].value = "";
        vm.dataconfig[40].value = "";
      }
    }
    vm.changesigabranch = changesigabranch;
    function changesigabranch() {
      vm.dataconfig[3].value = "";
      vm.listbranchsiga = [];
      vm.listservisesiga = [];
      vm.listconfigbranchsiga = [
        {
          id: 0,
          urlsiga: "",
          listbranchsiga: [],
          listservisesiga: [],
          edit: false,
        },
      ];
    }
    vm.afterSelectionorder = afterSelectionorder;
    //** Metodo para evaluar que los escrito sea email**//
    function afterSelectionorder(item) {
      if (
        !new RegExp(
          "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
        ).test(item)
      ) {
        vm.dataconfig[37].value = $filter("filter")(
          vm.dataconfig[37].value,
          "!" + item,
          true
        );
      }
    }
    //** Metodo que construye el objeto para guardar las llaves de integraciones**//
    function updateintegrations() {
      vm.dataconfig[0].value =
        vm.dataconfig[0].value === false ? "False" : "True";
      vm.dataconfig[2].value =
        vm.dataconfig[2].value === false ? "False" : "True";
      vm.dataconfig[7].value =
        vm.dataconfig[7].value === false ? "False" : "True";
      vm.dataconfig[9].value =
        vm.dataconfig[9].value === false ? "False" : "True";
      vm.dataconfig[10].value =
        vm.dataconfig[10].value === false ? "False" : "True";
      vm.dataconfig[11].value =
        vm.dataconfig[11].value === false ? "False" : "True";
      vm.dataconfig[16].value =
        vm.dataconfig[16].value === false ? "False" : "True";
      vm.dataconfig[18].value =
        vm.dataconfig[18].value === false ||
        !vm.disabledasbohasd.TableroTomaDeMuestra
          ? "False"
          : "True";
      vm.dataconfig[19].value =
        vm.dataconfig[19].value === false ||
        !vm.disabledasbohasd.TableroProductividadPorSeccion
          ? "False"
          : "True";
      vm.dataconfig[20].value =
        vm.dataconfig[20].value === false ||
        !vm.disabledasbohasd.TableroTiempoDeOportunidad
          ? "False"
          : "True";
      vm.dataconfig[21].value =
        vm.dataconfig[21].value === false ||
        !vm.disabledasbohasd.TableroValidacion
          ? "False"
          : "True";
      vm.dataconfig[22].value =
        vm.dataconfig[22].value === false ||
        !vm.disabledasbohasd.TableroCalificacionDelServicio
          ? "False"
          : "True";
      vm.dataconfig[23].value =
        vm.dataconfig[23].value === false ||
        !vm.disabledasbohasd.TableroSeguimientoDePruebas
          ? "False"
          : "True";
      vm.dataconfig[24].value =
        vm.dataconfig[24].value === false ? "False" : "True";
      vm.dataconfig[33].value =
        vm.dataconfig[33].value === false ? "False" : "True";
      vm.dataconfig[36].value =
        vm.dataconfig[36].value === false ? "False" : "True";
      vm.dataconfig[37].value =
        vm.dataconfig[37].value.length === 0
          ? ""
          : JSON.stringify(vm.dataconfig[37].value);
      vm.dataconfig[42].value =
        vm.dataconfig[42].value === false ? "False" : "True";
      vm.dataconfig[43].value =
        vm.dataconfig[43].value === false ? "False" : "True";
      vm.dataconfig[45].value =
        vm.dataconfig[45].value === false ? "False" : "True";
      vm.dataconfig[47].value =
        vm.dataconfig[47].value === false ? "False" : "True";
      vm.dataconfig[49].value =
        vm.dataconfig[49].value === false ? "False" : "True";
      if (vm.dataconfig[51].value) {
        if (
          vm.listconfigbranchsiga[vm.listconfigbranchsiga.length - 1].entry ===
            undefined &&
          vm.listconfigbranchsiga[vm.listconfigbranchsiga.length - 1].order ===
            undefined
        ) {
          vm.listconfigbranchsiga = _.remove(
            vm.listconfigbranchsiga,
            function (delet) {
              return (
                delet.id !==
                vm.listconfigbranchsiga[vm.listconfigbranchsiga.length - 1].id
              );
            }
          );
        } else {
          vm.listconfigbranchsiga[
            vm.listconfigbranchsiga.length - 1
          ].edit = true;
        }
      }
      vm.dataconfig[51].value =
        vm.dataconfig[51].value === false ? "False" : "True";
      vm.dataconfig[52].value = JSON.stringify(vm.listconfigbranchsiga);
      vm.save();
    }
    //** Metodo que construye el objeto para la consulta de las llaves de eventos**//
    function events(data) {
      vm.dataconfig = [
        {
          key: "manejoEventos", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "manejoEventos",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "UrlEventos", //1
          value: $filter("filter")(
            data.data,
            {
              key: "UrlEventos",
            },
            true
          )[0].value,
        },
        {
          key: "crearOrden", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "crearOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "modificarOrden", //3
          value:
            $filter("filter")(
              data.data,
              {
                key: "modificarOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "anularOrden", //4
          value:
            $filter("filter")(
              data.data,
              {
                key: "anularOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "validaOrden", //5
          value:
            $filter("filter")(
              data.data,
              {
                key: "validaOrden",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "tomarMuestra", //6
          value:
            $filter("filter")(
              data.data,
              {
                key: "tomarMuestra",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "verificarMuestra", //7
          value:
            $filter("filter")(
              data.data,
              {
                key: "verificarMuestra",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "ingresarResultado", //8
          value:
            $filter("filter")(
              data.data,
              {
                key: "ingresarResultado",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "modificarResultado", //9
          value:
            $filter("filter")(
              data.data,
              {
                key: "modificarResultado",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "repetirResultado", //10
          value:
            $filter("filter")(
              data.data,
              {
                key: "repetirResultado",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "validaPorExamen", //11
          value:
            $filter("filter")(
              data.data,
              {
                key: "validaPorExamen",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "desvalidaExamen", //12
          value:
            $filter("filter")(
              data.data,
              {
                key: "desvalidaExamen",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
        {
          key: "imprimirExamen", //13
          value:
            $filter("filter")(
              data.data,
              {
                key: "imprimirExamen",
              },
              true
            )[0].value === "False"
              ? false
              : true,
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo que construye el objeto para guardar las llaves de eventos**//
    function updateevents() {
      vm.dataconfig[0].value =
        vm.dataconfig[0].value === false ? "False" : "True";
      vm.dataconfig[2].value =
        vm.dataconfig[2].value === false ? "False" : "True";
      vm.dataconfig[3].value =
        vm.dataconfig[3].value === false ? "False" : "True";
      vm.dataconfig[4].value =
        vm.dataconfig[4].value === false ? "False" : "True";
      vm.dataconfig[5].value =
        vm.dataconfig[5].value === false ? "False" : "True";
      vm.dataconfig[6].value =
        vm.dataconfig[6].value === false ? "False" : "True";
      vm.dataconfig[7].value =
        vm.dataconfig[7].value === false ? "False" : "True";
      vm.dataconfig[8].value =
        vm.dataconfig[8].value === false ? "False" : "True";
      vm.dataconfig[9].value =
        vm.dataconfig[9].value === false ? "False" : "True";
      vm.dataconfig[10].value =
        vm.dataconfig[10].value === false ? "False" : "True";
      vm.dataconfig[11].value =
        vm.dataconfig[11].value === false ? "False" : "True";
      vm.dataconfig[12].value =
        vm.dataconfig[12].value === false ? "False" : "True";
      vm.dataconfig[13].value =
        vm.dataconfig[13].value === false ? "False" : "True";
      vm.save();
    }
    //** Metodo para guardar la llaves de configuración**//
    function save() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS
        .updateConfiguration(auth.authToken, vm.dataconfig)
        .then(
          function (data) {
            if (vm.sectionId === 2) {
              vm.entryorder(data);
            } else if (vm.sectionId === 3) {
              vm.listEmail = [
                {
                  id: "1",
                  name: $filter("translate")("0740"),
                },
                {
                  id: "2",
                  name: $filter("translate")("0225"),
                },
              ];
              vm.resultreport(data);
            } else if (vm.sectionId === 4) {
              vm.listSymbols = [
                {
                  id: "",
                  name: "",
                },
                {
                  id: "¤",
                  name: "¤",
                },
                {
                  id: "$",
                  name: "$",
                },
                {
                  id: "¢",
                  name: "¢",
                },
                {
                  id: "£",
                  name: "£",
                },
                {
                  id: "₤",
                  name: "₤",
                },
                {
                  id: "¥",
                  name: "¥",
                },
                {
                  id: "€",
                  name: "€",
                },
              ];
              vm.rate(data);
            } else if (vm.sectionId === 5) {
              vm.getActiveDestination(data);
            } else if (vm.sectionId === 6) {
              vm.appointments(data);
            } else if (vm.sectionId === 7) {
              vm.ldap(data);
            } else if (vm.sectionId === 8) {
              vm.datalist = [
                {
                  key: "IngresoEntrevista", //0
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "IngresoEntrevista",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "IngresoEntrevista",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "VerificacionMuestra", //1
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "VerificacionMuestra",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "VerificacionMuestra",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "RegistroResultados", //2
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "RegistroResultados",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "RegistroResultados",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "RangoInicial", //3
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "RangoInicial",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "RangoInicial",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "RangoFinal", //4
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "RangoFinal",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "RangoFinal",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "RangoInicialCitas", //5
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "RangoInicialCitas",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "RangoInicialCitas",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "RangoFinalCitas", //6
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "RangoFinalCitas",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : parseInt(
                          $filter("filter")(
                            vm.dataorigin,
                            {
                              key: "RangoFinalCitas",
                            },
                            true
                          )[0].value
                        ),
                },
                {
                  key: "notificacionUsuarios", //7
                  value:
                    $filter("filter")(
                      vm.dataorigin,
                      {
                        key: "notificacionUsuarios",
                      },
                      true
                    )[0].value === ""
                      ? ""
                      : $filter("filter")(
                          vm.dataorigin,
                          {
                            key: "notificacionUsuarios",
                          },
                          true
                        )[0].value,
                },
              ];
              if (
                vm.datalist[3].value !== vm.dataconfig[3].value ||
                vm.datalist[4].value !== vm.dataconfig[4].value
              ) {
                vm.restartsequencerecalled(data);
              } else if (
                vm.datalist[5].value !== vm.dataconfig[5].value ||
                vm.datalist[6].value !== vm.dataconfig[6].value
              ) {
                vm.restartsequenceappointment(data);
              } else {
                vm.getConfigurationDigitosOrden(data);
              }
            } else if (vm.sectionId === 9) {
              vm.typeWhonet = [
                {
                  id: 1,
                  name: $filter("translate")("0315"),
                },
                {
                  id: 2,
                  name: $filter("translate")("0636"),
                },
              ];
              vm.getDestinationActive(data);
            } else if (vm.sectionId === 10) {
              vm.requeridbranch = false;
              vm.requeridservice = false;
              vm.urlsigarequerid = false;
              vm.listbranchsiga = [];
              vm.listservisesiga = [];
              vm.urlprevious = $filter("filter")(
                data.data,
                {
                  key: "UrlSIGA",
                },
                true
              )[0].value;
              if (vm.urlprevious === true) {
                vm.branchsiga(data);
              } else {
                vm.integrations(data);
              }
            } else if (vm.sectionId === 11) {
              vm.events(data);
            } else if (vm.sectionId === 12) {
              vm.notification(data);
            } else if (vm.sectionId === 13) {
              vm.entrycases(data);
            } else if (vm.sectionId === 14) {
              vm.notificationRetake(data);
            }
            vm.changeConfiguration();
            logger.success($filter("translate")("0042"));
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    vm.getlicenciedashboard = getlicenciedashboard;
    //** Metodo que evalua el la conexion con el siga y carga los sedes del siga**//
    function getlicenciedashboard() {
      vm.disabledasbohasd = {
        TableroTomaDeMuestra: true,
        TableroProductividadPorSeccion: true,
        TableroSeguimientoDePruebas: true,
        TableroTiempoDeOportunidad: true,
        TableroCalificacionDelServicio: true,
        TableroValidacion: true,
      };
      return configurationDS.getlicenciedashboard(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.datadisabledashboard = JSON.parse(JSON.stringify(data.data));
            vm.disabledasbohasd = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    vm.restartsequencerecalled = restartsequencerecalled;
    //** Metodo que evalua el la conexion con el siga y carga los sedes del siga**//
    function restartsequencerecalled(datalist) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS.getrecalled(auth.authToken).then(
        function (data) {
          if (
            vm.datalist[5].value === vm.dataconfig[5].value &&
            vm.datalist[6].value === vm.dataconfig[6].value
          ) {
            vm.getConfigurationDigitosOrden(datalist);
          } else {
            vm.restartsequenceappointment(datalist);
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    vm.restartsequenceappointment = restartsequenceappointment;
    //** Metodo que evalua el la conexion con el siga y carga los sedes del siga**//
    function restartsequenceappointment(datalist) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS.getappointment(auth.authToken).then(
        function (data) {
          vm.getConfigurationDigitosOrden(datalist);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    /*Cambio de configuracion */
    function changeConfiguration() {
      try {
        socket.emit("change:configuration", {
          configuration: "installation",
        });
      } catch (error) {
        vm.noConnected = true;
      }
    }

    //** Metodo para confirmar el guardado**//
    function saveCancel(Form) {
      if (vm.sectionId === 10) {
        if (!vm.dataconfig[51].value) {
          setTimeout(function () {
            vm.urlsigarequerid = false;
            Form.sedesiga.$touched = true;
            Form.OrdenesSIGA.$touched = true;
            Form.VerificacionSIGA.$touched = true;
          }, 500);
        }
        if (vm.dataconfig[51].value) {
          if (vm.listconfigbranchsiga.length === 1) {
            vm.dataconfig[51].value = false;
          }
        }
        if (vm.dataconfig[7].value) {
          Form.areaactive.$touched = true;
          Form.branchactive.$touched = true;
        }
        if (vm.dataconfig[45].value) {
          Form.RutaAdjuntosReceptores.$touched = true;
        }
        if (vm.dataconfig[24].value) {
          Form.Urlsigo.$touched = true;
          Form.centralsystem.$touched = true;
          Form.keysigo.$touched = true;
          Form.usersigo.$touched = true;
          Form.codecomp.$touched = true;
        }
        if (vm.dataconfig[33].value) {
          Form.UrlFacturacionExterna.$touched = true;
          Form.FacturacionIdUsuario.$touched = true;
        }
        Form.UrlDashBoard.$touched = true;
        setTimeout(function () {
          if (Form.$valid && !vm.urlsigarequerid) {
            if (vm.dataconfig[51].value) {
              Form.$setUntouched();
              ModalService.showModal({
                templateUrl: "Confirmation.html",
                controller: "ConfirmController",
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                  if (result.execute === "yes") {
                    vm.loadingdata = true;
                    vm.updateintegrations();
                  } else {
                    vm.getId(vm.sectionId, vm.selected, vm.register);
                  }
                });
              });
            } else if (
              (vm.dataconfig[2].value === true &&
                vm.dataconfig[4].value === "") ||
              (vm.dataconfig[2].value === true &&
                vm.dataconfig[5].value === "" &&
                vm.dataconfig[6].value === "")
            ) {
              if (vm.dataconfig[4].value === "") {
                vm.requeridbranch = true;
              }
              if (
                vm.dataconfig[5].value === "" &&
                vm.dataconfig[6].value === ""
              ) {
                vm.requeridservice = true;
              }
            } else {
              Form.$setUntouched();
              ModalService.showModal({
                templateUrl: "Confirmation.html",
                controller: "ConfirmController",
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                  if (result.execute === "yes") {
                    vm.loadingdata = true;
                    vm.updateintegrations();
                  } else {
                    vm.getId(vm.sectionId, vm.selected, vm.register);
                  }
                });
              });
            }
          }
        }, 600);
      } else if (vm.sectionId === 11) {
        if (Form.$valid && !vm.urlEventRequired) {
          Form.$setUntouched();
          ModalService.showModal({
            templateUrl: "Confirmation.html",
            controller: "ConfirmController",
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.execute === "yes") {
                vm.loadingdata = true;
                vm.updateevents();
              } else {
                vm.getId(vm.sectionId, vm.selected, vm.register);
              }
            });
          });
        }
      } else if (
        vm.sectionId === 7 ||
        vm.sectionId === 4 ||
        vm.sectionId === 3
      ) {
        if (Form.$valid) {
          Form.$setUntouched();
          ModalService.showModal({
            templateUrl: "Confirmation.html",
            controller: "ConfirmController",
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.execute === "yes") {
                vm.loadingdata = true;
                if (vm.sectionId === 4) {
                  vm.updaterate();
                }
                if (vm.sectionId === 3) {
                  vm.update();
                } else {
                  vm.dataconfig[0].value =
                    vm.dataconfig[0].value === false ? "False" : "True";
                  vm.save();
                }
              } else {
                vm.getId(vm.sectionId, vm.selected, vm.register);
              }
            });
          });
        }
      } else if (vm.sectionId === 6 || vm.sectionId === 8) {
        if (vm.sectionId === 8) {
          if (vm.dataconfig[25].value === "True" || vm.dataconfig[25].value) {
            Form.RangoInicialCitas.$touched = true;
            Form.RangoFinalCitas.$touched = true;
            if (vm.service) {
              Form.CitaServicio.$touched = true;
            }
            Form.CitaTipodeorden.$touched = true;
          }

          vm.dataconfig[25].value =
            vm.dataconfig[25].value === false ? "False" : "True";
          vm.dataconfig[10].value =
            vm.dataconfig[10].value === false ? "False" : "True";
          vm.dataconfig[11].value =
            vm.dataconfig[11].value === false ? "False" : "True";
          vm.dataconfig[12].value =
            vm.dataconfig[12].value === false ? "False" : "True";
          vm.dataconfig[13].value =
            vm.dataconfig[13].value === false ? "False" : "True";
          vm.dataconfig[14].value =
            vm.dataconfig[14].value === false ? "False" : "True";
          vm.dataconfig[15].value =
            vm.dataconfig[15].value === false ? "False" : "True";
          vm.dataconfig[16].value =
            vm.dataconfig[16].value === false ? "False" : "True";
          vm.dataconfig[17].value =
            vm.dataconfig[17].value === false ? "False" : "True";
          vm.dataconfig[18].value =
            vm.dataconfig[18].value === false ? "False" : "True";
          vm.dataconfig[19].value =
            vm.dataconfig[19].value === false ? "False" : "True";
          vm.dataconfig[20].value =
            vm.dataconfig[20].value === false ? "False" : "True";
          vm.dataconfig[21].value =
            vm.dataconfig[21].value === false ? "False" : "True";
          vm.dataconfig[22].value =
            vm.dataconfig[22].value === false ? "False" : "True";
          vm.dataconfig[23].value =
            vm.dataconfig[23].value === false ? "False" : "True";
          vm.dataconfig[24].value =
            vm.dataconfig[24].value === false ? "False" : "True";
        }
        if (
          vm.dataconfig[0].value < vm.dataconfig[1].value &&
          vm.sectionId === 6
        ) {
          ModalService.showModal({
            templateUrl: "Confirmation.html",
            controller: "ConfirmController",
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.execute === "yes") {
                vm.loadingdata = true;
                vm.save();
              } else {
                vm.getId(vm.sectionId, vm.selected, vm.register);
              }
            });
          });
        }
        if (
          vm.dataconfig[3].value <= vm.dataconfig[4].value &&
          vm.sectionId === 8 &&
          vm.dataconfig[5].value <= vm.dataconfig[6].value
        ) {
          ModalService.showModal({
            templateUrl: "Confirmation.html",
            controller: "ConfirmController",
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.execute === "yes") {
                vm.loadingdata = true;
                vm.save();
              } else {
                vm.getId(vm.sectionId, vm.selected, vm.register);
              }
            });
          });
        }
      } else if (vm.sectionId === 2) {
        var demosnull = _.filter(vm.listdemographics, function (o) {
          return o.id === null;
        });
        if (demosnull.length > 0) {
          logger.error($filter("translate")("1303"));
          return false;
        }
        // if(vm.dataconfig[24].value) {
        //   if(!demo1 && !demo2 && !demo3 ) {
        //     logger.error($filter("translate")("1300"));
        //     return false;
        //   }

        //   if(demo1 && demo2 && demo3) {
        //     if(demo1 === demo2 || demo1 === demo3 || demo2 === demo3) {
        //       logger.error($filter("translate")("1299"));
        //       return false;
        //     }
        //   }
        // }
        Form.$setUntouched();
        ModalService.showModal({
          templateUrl: "Confirmation.html",
          controller: "ConfirmController",
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.execute === "yes") {
              vm.loadingdata = true;
              vm.updateentryorder();
            } else {
              vm.getId(vm.sectionId, vm.selected, vm.register);
            }
          });
        });
      } else {
        ModalService.showModal({
          templateUrl: "Confirmation.html",
          controller: "ConfirmController",
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.execute === "yes") {
              if (vm.sectionId === 4) {
                vm.loadingdata = true;
                vm.updaterate();
              } else if (vm.sectionId === 5) {
                vm.loadingdata = true;
                vm.updatesampletraceability();
              } else if (vm.sectionId === 12) {
                if (vm.testnotification.length === 0) {
                  vm.dataconfig[3].value = "";
                } else {
                  var testnotification = _.map(vm.testnotification, "id");
                  vm.dataconfig[3].value = JSON.stringify(testnotification);
                }
                vm.dataconfig[0].value =
                  vm.dataconfig[0].value.length === 0
                    ? ""
                    : JSON.stringify(vm.dataconfig[0].value);

                if (vm.testnotificationone.length === 0) {
                  vm.dataconfig[7].value = "";
                } else {
                  var testnotificationone = _.map(vm.testnotificationone, "id");
                  vm.dataconfig[7].value = JSON.stringify(testnotificationone);
                }
                vm.dataconfig[4].value =
                  vm.dataconfig[4].value.length === 0
                    ? ""
                    : JSON.stringify(vm.dataconfig[4].value);

                if (vm.testnotificationtwo.length === 0) {
                  vm.dataconfig[11].value = "";
                } else {
                  var testnotificationtwo = _.map(vm.testnotificationtwo, "id");
                  vm.dataconfig[11].value = JSON.stringify(testnotificationtwo);
                }
                vm.dataconfig[8].value =
                  vm.dataconfig[8].value.length === 0
                    ? ""
                    : JSON.stringify(vm.dataconfig[8].value);

                if (vm.testnotificationfour.length === 0) {
                  vm.dataconfig[15].value = "";
                } else {
                  var testnotificationfour = _.map(
                    vm.testnotificationfour,
                    "id"
                  );
                  vm.dataconfig[15].value =
                    JSON.stringify(testnotificationfour);
                }

                vm.dataconfig[12].value =
                  vm.dataconfig[12].value.length === 0
                    ? ""
                    : JSON.stringify(vm.dataconfig[12].value);

                vm.loadingdata = true;
                vm.save();
              } else if (vm.sectionId === 9) {
                vm.loadingdata = true;
                vm.updateplanowhonet();
              } else if (vm.sectionId === 13) {
                vm.loadingdata = true;
                vm.save();
              } else if (vm.sectionId === 14) {
                if (vm.samplenotification.length === 0) {
                  vm.dataconfig[3].value = "";
                } else {
                  var samplenotification = _.map(vm.samplenotification, "id");
                  vm.dataconfig[3].value = JSON.stringify(samplenotification);
                }
                vm.dataconfig[0].value =
                  vm.dataconfig[0].value.length === 0
                    ? ""
                    : JSON.stringify(vm.dataconfig[0].value);
                vm.loadingdata = true;
                vm.save();
              }
            } else {
              vm.getId(vm.sectionId, vm.selected, vm.register);
            }
          });
        });
      }
    }

    //** Metodo que construye el objeto para la consulta de las llaves de patología**//
    function entrycases(data) {
      vm.dataconfig = [
        {
          key: "DigitosCaso", //0
          value:
            $filter("filter")(
              data.data,
              {
                key: "DigitosCaso",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "DigitosCaso",
                    },
                    true
                  )[0].value
                ),
        },
        {
          key: "TipoNumeroCaso", //2
          value: $filter("filter")(
            data.data,
            {
              key: "TipoNumeroCaso",
            },
            true
          )[0].value,
        },
        {
          key: "DiasLaborales",
          value: $filter("filter")(
            data.data,
            {
              key: "DiasLaborales",
            },
            true
          )[0].value,
        },
        {
          key: "WidgetProcesador", //2
          value:
            $filter("filter")(
              data.data,
              {
                key: "WidgetProcesador",
              },
              true
            )[0].value === ""
              ? ""
              : parseInt(
                  $filter("filter")(
                    data.data,
                    {
                      key: "WidgetProcesador",
                    },
                    true
                  )[0].value
                ),
        },
      ];
      vm.loadingdata = false;
    }
    //** Metodo para cancelar la llaves de configuración**//
    function cancel(Form) {
      Form.$setUntouched();
      vm.listdemographics = [];
      vm.getId(vm.sectionId, vm.selected, vm.register);
    }
    //** Metodo que saca un popup cuando el servicio devuelve un error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Metodo que valida si el usuario se encuentra logueado**//
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    //** Metodo que valida cambio de un control y pide la confirmación del cambio**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    vm.getDemographicsALL = getDemographicsALL;
    function getDemographicsALL() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getDemographicsALL(auth.authToken).then(
        function (data) {
          vm.listdemographicH = "";
          vm.listdemographicO = "";
          var addgener = {
            id: -104,
            origin: "H",
            name: "Género",
          };
          data.data.add(addgener);
          data.data.forEach(function (value, key) {
            value.identificacion = value.id;
            switch (value.id) {
              case -1:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0248");
                break;
              case -2:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0225");
                break;
              case -3:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0307");
                break;
              case -4:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0133");
                break;
              case -5:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0075");
                break;
              case -6:
                value.id = "D_" + value.id;
                value.origin = "O";
                value.name = $filter("translate")("0175");
                break;
              case -7:
                value.id = "D_" + value.id;
                value.origin = "H";
                value.name = $filter("translate")("0174");
                break;
              case -10:
                value.id = "D_" + value.id;
                value.origin = "H";
                value.name = $filter("translate")("0645");
                break;
              case -106:
                value.id = "D_" + value.id;
                value.origin = "H";
                value.name = $filter("translate")("0086");
                break;
              case -104:
                value.id = "D_" + value.id;
                value.origin = "H";
                value.name = $filter("translate")("0221");
                break;
              default:
                value.name = value.name;
            }
            if (value.origin == "O") {
              if (key === 0) {
                vm.listdemographicO = value.id;
              } else {
                vm.listdemographicO = vm.listdemographicO + " " + value.id;
              }
              tinymce.PluginManager.add(value.id, function (editor) {
                // Add a button that opens a window
                editor.addButton(value.id, {
                  text: value.name,
                  onclick: function () {
                    editor.insertContent(
                      "||DEMO_" + value.identificacion + "||"
                    );
                  },
                });
                // Adds a menu item to the tools menu
                editor.addMenuItem(value.id, {
                  text: value.name,
                  onclick: function () {
                    editor.insertContent(
                      "||DEMO_" + value.identificacion + "||"
                    );
                  },
                });
              });
            }

            if (value.origin == "H") {
              if (key === 0) {
                vm.listdemographicH = value.id;
              } else {
                vm.listdemographicH = vm.listdemographicH + " " + value.id;
              }
              tinymce.PluginManager.add(value.id, function (editor) {
                // Add a button that opens a window
                editor.addButton(value.id, {
                  text: value.name,
                  onclick: function () {
                    editor.insertContent(
                      "||DEMO_" + value.identificacion + "||"
                    );
                  },
                });
                // Adds a menu item to the tools menu
                editor.addMenuItem(value.id, {
                  text: value.name,
                  onclick: function () {
                    editor.insertContent(
                      "||DEMO_" + value.identificacion + "||"
                    );
                  },
                });
              });
            }
          });

          vm.demographicOCod = _.filter(data.data, function (o) {
            return o.origin === "O" && o.encoded;
          });

          vm.customMenu = [
            ["bold", "italic", "underline", "subscript"],
            ["ordered-list", "unordered-list"],
            ["font-color", "hilite-color"],
            ["font"],
            ["font-size"],
          ];
          tinymce.PluginManager.add("patient", function (editor) {
            // Add a button that opens a window
            editor.addButton("patient", {
              text: $filter("translate")("1122"),
              onclick: function () {
                editor.insertContent("||PATIENT||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("patient", {
              text: $filter("translate")("1122"),
              onclick: function () {
                editor.insertContent("||PATIENT||");
              },
            });
          });
          tinymce.PluginManager.add("result", function (editor) {
            // Add a button that opens a window
            editor.addButton("result", {
              text: $filter("translate")("1123"),
              onclick: function () {
                editor.insertContent("||RESULT||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("result", {
              text: $filter("translate")("1123"),
              onclick: function () {
                editor.insertContent("||RESULT||");
              },
            });
          });
          tinymce.PluginManager.add("test", function (editor) {
            // Add a button that opens a window
            editor.addButton("test", {
              text: $filter("translate")("0402"),
              onclick: function () {
                editor.insertContent("||TEST||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("test", {
              text: $filter("translate")("0402"),
              context: "tools",
              onclick: function () {
                editor.insertContent("||TEST||");
              },
            });
          });
          tinymce.PluginManager.add("order", function (editor) {
            // Add a button that opens a window
            editor.addButton("order", {
              text: $filter("translate")("0734"),
              onclick: function () {
                editor.insertContent("||ORDER||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("order", {
              text: $filter("translate")("0734"),
              onclick: function () {
                editor.insertContent("||ORDER||");
              },
            });
          });
          tinymce.PluginManager.add("history", function (editor) {
            // Add a button that opens a window
            editor.addButton("history", {
              text: $filter("translate")("0070"),
              onclick: function () {
                editor.insertContent("||HISTORY||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("history", {
              text: $filter("translate")("0070"),
              onclick: function () {
                editor.insertContent("||HISTORY||");
              },
            });
          });
          tinymce.PluginManager.add("date", function (editor) {
            // Add a button that opens a window
            editor.addButton("date", {
              text: $filter("translate")("0072"),
              onclick: function () {
                editor.insertContent("||DATE||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("date", {
              text: $filter("translate")("0072"),
              onclick: function () {
                editor.insertContent("||DATE||");
              },
            });
          });
          tinymce.PluginManager.add("bacteriologistname", function (editor) {
            // Add a button that opens a window
            editor.addButton("bacteriologistname", {
              text: $filter("translate")("3126"),
              onclick: function () {
                editor.insertContent("||BACTERIOLOGISTNAME||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("bacteriologistname", {
              text: $filter("translate")("3126"),
              onclick: function () {
                editor.insertContent("||BACTERIOLOGISTNAME||");
              },
            });
          });
          tinymce.PluginManager.add("bacteriologistcode", function (editor) {
            // Add a button that opens a window
            editor.addButton("bacteriologistcode", {
              text: $filter("translate")("3127"),
              onclick: function () {
                editor.insertContent("||BACTERIOLOGISTCODE||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("bacteriologistcode", {
              text: $filter("translate")("3127"),
              onclick: function () {
                editor.insertContent("||BACTERIOLOGISTCODE||");
              },
            });
          });

          tinymce.PluginManager.add("sample", function (editor) {
            // Add a button that opens a window
            editor.addButton("sample", {
              text: $filter("translate")("0052"),
              onclick: function () {
                editor.insertContent("||SAMPLE||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("sample", {
              text: $filter("translate")("0052"),
              onclick: function () {
                editor.insertContent("||SAMPLE||");
              },
            });
          });

          tinymce.PluginManager.add("motive", function (editor) {
            // Add a button that opens a window
            editor.addButton("motive", {
              text: $filter("translate")("0274"),
              onclick: function () {
                editor.insertContent("||REASON||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("motive", {
              text: $filter("translate")("0274"),
              onclick: function () {
                editor.insertContent("||REASON||");
              },
            });
          });

          tinymce.PluginManager.add("comment", function (editor) {
            // Add a button that opens a window
            editor.addButton("comment", {
              text: $filter("translate")("0178"),
              onclick: function () {
                editor.insertContent("||COMMENT||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("comment", {
              text: $filter("translate")("0178"),
              onclick: function () {
                editor.insertContent("||COMMENT||");
              },
            });
          });

          tinymce.PluginManager.add("usename", function (editor) {
            // Add a button that opens a window
            editor.addButton("usename", {
              text: $filter("translate")("0001"),
              onclick: function () {
                editor.insertContent("||USER||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("usename", {
              text: $filter("translate")("0001"),
              onclick: function () {
                editor.insertContent("||USER||");
              },
            });
          });
          tinymce.PluginManager.add("password", function (editor) {
            // Add a button that opens a window
            editor.addButton("password", {
              text: $filter("translate")("0002"),
              onclick: function () {
                editor.insertContent("||PASSWORD||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("password", {
              text: $filter("translate")("0002"),
              onclick: function () {
                editor.insertContent("||PASSWORD||");
              },
            });
          });

          tinymce.PluginManager.add("repeat", function (editor) {
            // Add a button that opens a window
            editor.addButton("repeat", {
              text: $filter("translate")("1369"),
              onclick: function () {
                editor.insertContent("||REPEAT||<br>||REPEAT||");
              },
            });
            // Adds a menu item to the tools menu
            editor.addMenuItem("repeat", {
              text: $filter("translate")("1369"),
              onclick: function () {
                editor.insertContent("||REPEAT||<br>||REPEAT||");
              },
            });
          });

          vm.tinymceOptionsResult = {
            resize: true,
            menubar: "",
            min_height: 100,
            language: $filter("translate")("0000") === "esCo" ? "es" : "en",
            plugins: "patient",
            toolbar:
              "patient | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code",
          };
          vm.tinymceOptionsRecovery = {
            resize: true,
            menubar: "",
            min_height: 100,
            language: $filter("translate")("0000") === "esCo" ? "es" : "en",
            plugins: "usename password link code",
            toolbar:
              "usename password styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code",
          };
          vm.tinymceOptions = {
            resize: true,
            min_height: 100,
            menubar: "demoH demoO other",
            menu: {
              demoH: {
                title: $filter("translate")("1272"),
                items: vm.listdemographicH,
              },
              demoO: {
                title: $filter("translate")("1273"),
                items: vm.listdemographicO,
              },
              other: {
                title: $filter("translate")("0398"),
                items:
                  "patient result test order history date bacteriologistname bacteriologistcode repeat",
              },
            },
            language: $filter("translate")("0000") === "esCo" ? "es" : "en",
            plugins:
              "patient result test order history date bacteriologistname bacteriologistcode repeat" +
              " " +
              vm.listdemographicO +
              " " +
              vm.listdemographicH,
            toolbar:
              "styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
          };
          vm.tinymceOptionsretake = {
            resize: true,
            min_height: 100,
            menubar: "demoH demoO other",
            menu: {
              demoH: {
                title: $filter("translate")("1272"),
                items: vm.listdemographicH,
              },
              demoO: {
                title: $filter("translate")("1273"),
                items: vm.listdemographicO,
              },
              other: {
                title: $filter("translate")("0398"),
                items:
                  "patient result test order history date bacteriologistname bacteriologistcode sample motive comment",
              },
            },
            language: $filter("translate")("0000") === "esCo" ? "es" : "en",
            plugins:
              "patient result test order history date bacteriologistname bacteriologistcode sample motive comment" +
              " " +
              vm.listdemographicO +
              " " +
              vm.listdemographicH,
            toolbar:
              "styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
          };
        },
        function (error) {
          vm.modalError();
        }
      );
    }
    //** Metodo que inicializa la página**//
    function init() {
      vm.service = localStorageService.get("ManejoServicio") === "True";
      vm.getareaactive();
      vm.getDemographicsALL();
      vm.getListConfiguration();
      // citas
      vm.listhour();
      vm.getListOrderType();
      vm.getListservice();
    }
    vm.getListOrderType = getListOrderType;
    //** Metodo que carga las tipo de orden activos**//
    function getListOrderType() {
      vm.Listordertype = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return ordertypeDS.getlistOrderType(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.Listordertype = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    vm.getListservice = getListservice;
    //** Metodo que cargar servicios activos**//
    function getListservice() {
      vm.Listservice = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return serviceDS.getServiceActive(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.Listservice = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    vm.listhour = listhour;
    function listhour() {
      vm.listhour = [
        {
          id: "00:00",
          name: "00:00",
        },
        {
          id: "00:30",
          name: "00:30",
        },
        {
          id: "01:00",
          name: "01:00",
        },
        {
          id: "01:30",
          name: "01:30",
        },
        {
          id: "02:00",
          name: "02:00",
        },
        {
          id: "02:30",
          name: "02:30",
        },
        {
          id: "03:00",
          name: "03:00",
        },
        {
          id: "03:30",
          name: "03:30",
        },
        {
          id: "04:00",
          name: "04:00",
        },
        {
          id: "04:30",
          name: "04:30",
        },
        {
          id: "05:00",
          name: "05:00",
        },
        {
          id: "05:30",
          name: "05:30",
        },
        {
          id: "06:00",
          name: "06:00",
        },
        {
          id: "06:30",
          name: "06:30",
        },
        {
          id: "07:00",
          name: "07:00",
        },
        {
          id: "07:30",
          name: "07:30",
        },
        {
          id: "08:00",
          name: "08:00",
        },
        {
          id: "08:30",
          name: "08:30",
        },
        {
          id: "09:00",
          name: "09:00",
        },
        {
          id: "09:30",
          name: "09:30",
        },
        {
          id: "10:00",
          name: "10:00",
        },
        {
          id: "10:30",
          name: "10:30",
        },
        {
          id: "11:00",
          name: "11:00",
        },
        {
          id: "11:30",
          name: "11:30",
        },
        {
          id: "12:00",
          name: "12:00",
        },
        {
          id: "12:30",
          name: "12:30",
        },
        {
          id: "13:00",
          name: "13:00",
        },
        {
          id: "13:30",
          name: "13:30",
        },
        {
          id: "14:00",
          name: "14:00",
        },
        {
          id: "14:30",
          name: "14:30",
        },
        {
          id: "15:00",
          name: "15:00",
        },
        {
          id: "15:30",
          name: "15:30",
        },
        {
          id: "16:00",
          name: "16:00",
        },
        {
          id: "16:30",
          name: "16:30",
        },
        {
          id: "17:00",
          name: "17:00",
        },
        {
          id: "17:30",
          name: "17:30",
        },
        {
          id: "18:00",
          name: "18:00",
        },
        {
          id: "18:30",
          name: "18:30",
        },
        {
          id: "19:00",
          name: "19:00",
        },
        {
          id: "19:30",
          name: "19:30",
        },
        {
          id: "20:00",
          name: "20:00",
        },
        {
          id: "20:30",
          name: "20:30",
        },
        {
          id: "21:00",
          name: "21:00",
        },
        {
          id: "21:30",
          name: "21:30",
        },
        {
          id: "22:00",
          name: "22:00",
        },
        {
          id: "22:30",
          name: "22:30",
        },
        {
          id: "23:00",
          name: "23:00",
        },
        {
          id: "23:30",
          name: "23:30",
        },
      ];
    }
    vm.isAuthenticate();
  }
  // Ventana modal para confirmar el guardado
  function ConfirmController($scope, close) {
    $scope.close = function (execute) {
      close(
        {
          execute: execute,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
  // Ventana modal para los requeridos de destino
  function RequeriddetinyController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }

  // Ventana modal para los examenes sin valores de referencia
  function RequeridReferenceValuesController($scope, listtests, close) {
    $scope.listtests = listtests;
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
