(function () {
  "use strict";

  angular
    .module("app.profil")
    .controller("ProfilController", ProfilController)
    .controller("RequeridoControllerprofil", RequeridoControllerprofil);

  ProfilController.$inject = [
    "testDS",
    "sampleDS",
    "listDS",
    "areaDS",
    "configurationDS",
    "requirementDS",
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "ModalService",
    "LZString",
    "$translate",
  ];

  function ProfilController(
    testDS,
    sampleDS,
    listDS,
    areaDS,
    configurationDS,
    requirementDS,
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    ModalService,
    LZString,
    $translate
  ) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = "Profil";

    vm.Requeriddatasample = false;
    vm.Requeridtestsample = false;
    vm.codename = ["codename", "testType", "state"];
    vm.testType = ["-testType", "+codename", "+state"];
    vm.state = ["-state", "+codename", "+testType"];
    vm.sortReverse = false;
    vm.sortType = vm.codename;
    vm.codetest = ["code", "sample.name", "selected"];
    vm.nametest = ["sample.name", "code", "selected"];
    vm.selectedtest = ["-selected", "+code", "+sample.name"];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
    vm.codequirement = ["code", "selected"];
    vm.selectedrequirement = ["-selected", "+code"];
    vm.sortReverse2 = false;
    vm.sortType2 = vm.codequirement;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledarea = true;
    vm.isDisabledmultiplyBy = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.Repeat = false;
    vm.Repeatabbr = false;
    vm.Repeatname = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getLisGende = getLisGende;
    vm.getLislevel = getLislevel;
    vm.getArea = getArea;
    vm.changePQ = changePQ;
    vm.listest = listest;
    vm.changemultiplyBy = changemultiplyBy;
    vm.listrequirement = listrequirement;
    vm.listrequirementrue = listrequirementrue;
    vm.listesttrue = listesttrue;
    vm.listestid = listestid;
    vm.removeDataList = removeDataList;
    vm.Area = false;
    vm.testassociate = false;
    vm.testassociateone = false;
    vm.Detail.Days = "";
    vm.getdatareport = getdatareport;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.getsample = getsample;
    vm.changedependentExam = changedependentExam;
    vm.changesample = changesample;
    vm.Detail = {
      Days: undefined,
    };
    //lista de dias de proceso
    vm.listProcessingDays = [
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
    vm.listprintOnReport = [
      {
        id: 1,
        name: $filter("translate")("0413"),
      },
      {
        id: 2,
        name: $filter("translate")("0414"),
      },
      {
        id: 3,
        name: $filter("translate")("0415"),
      },
    ];
    vm.listprintOnReport = $filter("orderBy")(vm.listprintOnReport, "name");
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name,
          };
          area.push(object);
        }
      });
      return area;
    }
    function removesample(data) {
      var sample = [];
      data.data.forEach(function (value, key) {
        var object = {
          id: value.id,
          name: value.name,
        };
        sample.push(object);
      });
      return sample;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        (data.data[key].codename = "" + value.code + " - " + value.name),
          (data.data[key].test = $filter("filter")(vm.datareport, {
            profileId: parseInt(value.id),
          })),
          (data.data[key].username = auth.userName);
      });
      return data.data;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataList(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS
        .getConfigurationKey(auth.authToken, "FormatoFecha")
        .then(
          function (data) {
            vm.getLisGende();
            if (data.status === 200) {
              vm.formatDate = data.data.value.toUpperCase();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //función que obtiene la lista de Tipos de motivo
    function getLisGende() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return listDS.getList(auth.authToken, 6).then(
        function (data) {
          vm.getLislevel();
          var ListGende = [];
          if ($filter("translate")("0000") === "esCo") {
            data.data.forEach(function (value, key) {
              if (value.id !== 9) {
                var object = {
                  id: value.id,
                  name: value.esCo,
                };
                ListGende.push(object);
              }
            });
          } else {
            data.data.forEach(function (value, key) {
              if (value.id !== 9) {
                var object = {
                  id: value.id,
                  name: value.enUsa,
                };
                ListGende.push(object);
              }
            });
          }
          vm.ListGender = $filter("orderBy")(ListGende, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //función que obtiene la lista de Tipos de motivo
    function getLislevel() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listrequirement();
      return listDS.getList(auth.authToken, 32).then(
        function (data) {
          var Lislevel = [];
          if ($filter("translate")("0000") === "esCo") {
            data.data.forEach(function (value, key) {
              var object = {
                id: value.id,
                name: value.esCo,
              };
              Lislevel.push(object);
            });
          } else {
            data.data.forEach(function (value, key) {
              var object = {
                id: value.id,
                name: value.enUsa,
              };
              Lislevel.push(object);
            });
          }
          vm.Lislevel = Lislevel;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que obtiene la lista para llenar la grilla requisitos**//
    function listrequirement() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return requirementDS.getRequirementActive(auth.authToken).then(
        function (data) {
          vm.getArea();
          vm.datalistrequirement =
            data.data.length === 0 ? data.data : removeDataList(data);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que obtiene una lista de unidades**//
    function getArea() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return areaDS.getAreasActive(auth.authToken).then(
        function (data) {
          vm.getsample(false);
          vm.dataarea = data.data.length === 0 ? data.data : removearea(data);
          vm.dataarea = $filter("orderBy")(vm.dataarea, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que obtiene una lista de muestras**//
    function getsample() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sampleDS.getSampleActive(auth.authToken).then(
        function (data) {
          vm.get(false);
          vm.datasample =
            data.data.length === 0 ? data.data : removesample(data);
          vm.datasample = $filter("orderBy")(vm.datasample, "name");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método cuando cambia la seleccion de la muestra**//
    function changedependentExam() {
      vm.Detail.sample.id = null;
      //if (vm.Detail.dependentExam === false) {
      vm.changesample();
      //}
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function listest(type, state, area) {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestArea(auth.authToken, type, state, area).then(
        function (data) {
          vm.datatest =
            data.data.length === 0 ? data.data : removeDatatest(data);
          vm.datatestfilter =
            data.data.length === 0 ? data.data : removeDatatest(data);
          if (data.data.length === 0) {
            ModalService.showModal({
              templateUrl: "Requeridoprofil.html",
              controller: "RequeridoControllerprofil",
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === "test") {
                  $state.go(result);
                }
              });
            });
          }
          return vm.datatest;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    //** Método cuando cambia la seleccion de la muestra**//
    function changesample() {
      vm.Requeriddatasample = false;
      vm.Requeridtestsample = false;
      if (vm.Detail.dependentExam && !vm.Detail.Pq) {
        if (vm.Detail.sample.id !== null && vm.Detail.area.id !== null) {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS
            .getTestArea(auth.authToken, 0, 1, vm.Detail.area.id)
            .then(
              function (data) {
                vm.datatest =
                  data.data.length === 0 ? data.data : removeDatachange(data);
                if (data.data.length === 0) {
                  ModalService.showModal({
                    templateUrl: "Requeridoprofil.html",
                    controller: "RequeridoControllerprofil",
                  }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                      if (result === "test") {
                        $state.go(result);
                      }
                    });
                  });
                }
                /*   else {
                  vm.datatest = $filter("filter")(vm.datatest, function (e) {
                    e.selected = false;
                    return e.sample.id === vm.Detail.sample.id;
                  });
                } */
              },
              function (error) {
                vm.modalError(error);
              }
            );
        }
      } else if (!vm.Detail.dependentExam && !vm.Detail.Pq) {
        if (vm.Detail.area.id !== null) {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS
            .getTestArea(auth.authToken, 0, 1, vm.Detail.area.id)
            .then(
              function (data) {
                vm.datatest =
                  data.data.length === 0 ? data.data : removeDatachange(data);
                if (data.data.length === 0) {
                  ModalService.showModal({
                    templateUrl: "Requeridoprofil.html",
                    controller: "RequeridoControllerprofil",
                  }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                      if (result === "test") {
                        $state.go(result);
                      }
                    });
                  });
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
        }
      } else if (vm.Detail.dependentExam && vm.Detail.Pq) {
        if (vm.Detail.sample.id !== null) {
          auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS.getTestArea(auth.authToken, 3, 1, 0).then(
            function (data) {
              vm.datatest =
                data.data.length === 0 ? data.data : removeDatachange(data);
              if (data.data.length === 0) {
                ModalService.showModal({
                  templateUrl: "Requeridoprofil.html",
                  controller: "RequeridoControllerprofil",
                }).then(function (modal) {
                  modal.element.modal();
                  modal.close.then(function (result) {
                    if (result === "test") {
                      $state.go(result);
                    }
                  });
                });
              } /* else {
                vm.datatest = $filter("filter")(vm.datatest, function (e) {
                  e.selected = false;
                  return e.sample.id === vm.Detail.sample.id;
                });
              } */
              return vm.datatest;
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }
      } else if (!vm.Detail.dependentExam && vm.Detail.Pq) {
        auth = localStorageService.get("Enterprise_NT.authorizationData");
        return testDS.getTestArea(auth.authToken, 3, 1, 0).then(
          function (data) {
            vm.datatest =
              data.data.length === 0 ? data.data : removeDatachange(data);
            if (data.data.length === 0) {
              ModalService.showModal({
                templateUrl: "Requeridoprofil.html",
                controller: "RequeridoControllerprofil",
              }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                  if (result === "test") {
                    $state.go(result);
                  }
                });
              });
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDatachange(data) {
      data.data.forEach(function (value, key) {
        var select = $filter("filter")(vm.datatest, function (e) {
          return e.id === value.id;
        });
        data.data[key].selected =
          select.length === 0 ? false : select[0].selected;
        var sample =
          data.data[key].sample.name === undefined
            ? ""
            : data.data[key].sample.name;
        data.data[key].search =
          data.data[key].code + data.data[key].name + sample;
      });
      return data.data;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get(actionafter) {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.getdatareport();
      return testDS.getTestArea(auth.authToken, 4, 0, 0).then(
        function (data) {
          if (vm.Detail.area === undefined && actionafter === false) {
            vm.listest(3, 1, 0);
          } else {
            if (vm.Detail.area.id === null && actionafter === false) {
              vm.listest(3, 1, 0);
            } else if (actionafter === false) {
              vm.listest(0, 1, vm.Detail.area.id);
            }
          }
          vm.data = data.data.length === 0 ? data.data : removeData(data);
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === "init") {
        vm.characteristics = false;
        vm.acoodionTests = false;
        vm.Requirements = false;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit =
          vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledmultiplyBy = true;
        vm.isDisabledarea = true;
        vm.isDisabledState = true;
      }
      if (state === "add") {
        vm.characteristics = false;
        vm.acoodionTests = false;
        vm.Requirements = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledmultiplyBy = true;
        vm.isDisabledarea = false;
        vm.testassociate = false;
        vm.testassociateone = false;
        setTimeout(function () {
          document.getElementById("code").focus();
        }, 100);
      }
      if (state === "edit") {
        vm.characteristics = false;
        vm.acoodionTests = false;
        vm.Requirements = false;
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledmultiplyBy = false;
        setTimeout(function () {
          document.getElementById("code").focus();
        }, 100);
      }
      if (state === "insert") {
        vm.characteristics = false;
        vm.acoodionTests = false;
        vm.Requirements = false;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledmultiplyBy = true;
        vm.isDisabledarea = true;
      }
      if (state === "update") {
        vm.characteristics = false;
        vm.acoodionTests = false;
        vm.Requirements = false;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledmultiplyBy = true;
        vm.isDisabledarea = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      vm.Requeriddatasample = false;
      vm.Requeridtestsample = false;
      form.$setUntouched();
      vm.usuario = "";
      vm.selected = -1;

      vm.Detail = {
        user: {
          id: auth.id,
        },
        id: null,
        code: "",
        abbr: "",
        name: "",
        gender: {
          id: 42,
        },
        level: {
          id: null,
        },
        sample: {
          id: null,
        },
        area: {
          id: null,
        },
        licuota: false,
        Pq: true,
        state: true,
        dependentExam: false,
        excludeAnalytes: false,
        showEntry: true,
        statistics: false,
        billing: false,
        multiplyBy: 1,
        statisticalTitle: "",
        showInQuery: true,
        printOnReport: 1,
        deliveryDays: 1,
        Days: "1,2,3,4,5,6,7",
        requirements: [],
        concurrences: [],
        testType: 2,
        selfValidation: 1,
        processingBy: 1,
        eventNotification: 0
      };
      vm.sortReverse1 = false;
      vm.sortType1 = "code";
      vm.sortReverse2 = false;
      (vm.sortType2 = "code"), "name";
      vm.datatest = [];
      vm.datalistrequirement = [];
      vm.sortReverse1 = false;
      vm.sortType1 = vm.codetest;
      vm.sortReverse2 = false;
      vm.sortType2 = vm.codequirement;
      vm.listrequirement();
      vm.stateButton("add");
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Requeriddatasample = false;
      vm.Requeridtestsample = false;
      vm.datatest = [];
      vm.datalistrequirement = [];
      vm.Repeat = false;
      vm.Repeatabbr = false;
      vm.Repeatname = false;
      vm.Area = false;
      vm.testassociate = false;
      vm.testassociateone = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton("init");
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton("edit");
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.Requeriddatasample = false;
      vm.Requeridtestsample = false;
      vm.acoodionTests = false;
      vm.testassociate = false;
      vm.testassociateone = false;
      vm.Area = false;
      vm.Detail.licuota = false;
      vm.Detail.concurrences = vm.datatest.length === 0 ? [] : vm.listesttrue();
      if (vm.Detail.dependentExam === true) {
        vm.Requeriddatasample =
          vm.Detail.dependentExam === true && vm.Detail.sample.id === null
            ? true
            : false;
        if (vm.Detail.dependentExam === true && vm.Detail.sample.id === null) {
          vm.Requeridtestsample = false;
        } else {
          vm.Requeridtestsample = $filter("filter")(vm.datatest, function (e) {
            return e.sample.id !== vm.Detail.sample.id && e.selected === true;
          });
          vm.Requeridtestsample =
            vm.Requeridtestsample.length === 0 ? false : true;
        }
      }
      if (
        (vm.Detail.area.id === null && vm.Detail.Pq === false) ||
        vm.Detail.concurrences.length === 0
      ) {
        if (vm.Detail.area.id === null && vm.Detail.Pq === false) {
          vm.Area = true;
        }
        if (vm.Detail.concurrences.length === 0) {
          vm.testassociate = true;
        }
      } else {
        if (!vm.Requeriddatasample && !vm.Requeridtestsample) {
          vm.processinDaysArr = vm.Detail.Days.split(",");
          vm.Detail.processingDays = "";
          for (var i = 0; i < vm.Detail.Days.split(",").length; i++) {
            vm.Detail.processingDays =
              vm.Detail.processingDays + vm.Detail.Days.split(",")[i];
          }
          Form.$setUntouched();
          if (vm.Detail.id === null) {
            vm.insert();
          } else {
            vm.update();
          }
        }
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function listrequirementrue() {
      var requirement = [];
      vm.datalistrequirement.forEach(function (value, key) {
        if (value.selected === true) {
          var object = {
            id: value.id,
          };
          requirement.push(object);
        }
      });
      return requirement;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function listesttrue() {
      var Test = [];
      vm.datatest.forEach(function (value, key) {
        if (value.selected === true) {
          var object = {
            idTest: null,
            concurrence: {
              id: value.id,
            },
          };
          Test.push(object);
        }
      });
      return Test;
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.Detail.area.id = vm.Detail.Pq === true ? 0 : vm.Detail.area.id;
      vm.Detail.eventNotification = vm.Detail.Pq === true ? 0 : vm.Detail.eventNotification;
      vm.Detail.concurrences = vm.datatest.length === 0 ? [] : vm.listesttrue();
      vm.Detail.requirements =
        vm.datalistrequirement.length === 0 ? [] : vm.listrequirementrue();
      vm.Detail.testType = vm.Detail.Pq === true ? 2 : 1;
      vm.loadingdata = true;
      return testDS.insertTest(auth.authToken, vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.sortReverse1 = true;
            vm.sortType1 = "";
            vm.sortReverse2 = true;
            vm.sortType2 = "";
            vm.Repeat = false;
            vm.Repeatabbr = false;
            vm.Repeatname = false;
            vm.Area = false;
            vm.testassociate = false;
            vm.testassociateone = false;
            vm.search9 = "";
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            vm.selected = data.data.id;
            vm.Detail = [];
            vm.datatest = [];
            vm.datalistrequirement = [];
            vm.Requeriddatasample = false;
            vm.Requeridtestsample = false;
            return testDS.getTestById(auth.authToken, data.data.id).then(
              function (data) {
                if (data.status === 200) {
                  vm.Detail.Days = "";
                  vm.usuario = $filter("translate")("0017") + " ";
                  vm.usuario =
                    vm.usuario +
                    moment(data.data.lastTransaction).format(vm.formatDate) +
                    " - ";
                  vm.usuario = vm.usuario + data.data.user.userName;
                  vm.datalistrequirement = data.data.requirements;
                  vm.Detail = data.data;
                  vm.Detail.Days =
                    data.data.processingDays.substr(0, 1) +
                    "," +
                    data.data.processingDays.substr(1, 1) +
                    "," +
                    data.data.processingDays.substr(2, 1) +
                    "," +
                    data.data.processingDays.substr(3, 1) +
                    "," +
                    data.data.processingDays.substr(4, 1) +
                    "," +
                    data.data.processingDays.substr(5, 1) +
                    "," +
                    data.data.processingDays.substr(6, 1) +
                    ",";
                  vm.Detail.Pq = data.data.testType === 2 ? true : false;
                  vm.listestid(data);
                  vm.sortReverse1 = false;
                  vm.sortType1 = vm.selectedtest;
                  vm.sortReverse2 = false;
                  vm.sortType2 = vm.selectedrequirement;
                  vm.stateButton("insert");
                  logger.success($filter("translate")("0042"));
                }
                vm.loadingdata = false;
              },
              function (error) {
                vm.modalError(error);
              }
            );
            /*  vm.Detail = data.data;
             vm.Detail.Days =
               data.data.processingDays.substr(0, 1) +
               "," +
               data.data.processingDays.substr(1, 1) +
               "," +
               data.data.processingDays.substr(2, 1) +
               "," +
               data.data.processingDays.substr(3, 1) +
               "," +
               data.data.processingDays.substr(4, 1) +
               "," +
               data.data.processingDays.substr(5, 1) +
               "," +
               data.data.processingDays.substr(6, 1) +
               ",";
             vm.selected = data.data.id;
             vm.get(true);
             setTimeout(function () {
               vm.listestid(data);
             }, 1000);
             vm.stateButton("insert");
             logger.success($filter("translate")("0042"));
             return data; */
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.Detail.user.id = auth.id;
      vm.Detail.area.id = vm.Detail.Pq === true ? 0 : vm.Detail.area.id;
      vm.Detail.eventNotification = vm.Detail.Pq === true ? 0 : vm.Detail.eventNotification;
      vm.Detail.concurrences = vm.datatest.length === 0 ? [] : vm.listesttrue();
      vm.Detail.requirements =
        vm.datalistrequirement.length === 0 ? [] : vm.listrequirementrue();
      vm.Detail.testType = vm.Detail.Pq === true ? 2 : 1;
      vm.loadingdata = true;
      return testDS.updateTest(auth.authToken, vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.get(true);
            logger.success($filter("translate")("0042"));
            vm.stateButton("update");
            return data;
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split("|");
            if (item[0] === "1" && item[1] === "code") {
              vm.Repeat = true;
            }
            if (item[0] === "1" && item[1] === "abbreviation") {
              vm.Repeatabbr = true;
            }
            if (item[0] === "1" && item[1] === "name") {
              vm.Repeatname = true;
            }
          });
        }
        vm.loadingdata = false;
      }
      if (
        vm.Repeat === false &&
        vm.Repeatabbr === false &&
        vm.Repeatname === false
      ) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método paqra cuando cambia de paquetes a perfiles**//
    function changePQ() {
      vm.Area = false;
      vm.testassociate = false;
      vm.testassociateone = false;
      vm.datatest = [];
      vm.Detail.dependentExam = false;
      vm.Detail.sample.id = null;
      vm.Detail.eventNotification = 0;
      if (vm.Detail.Pq === true) {
        vm.isDisabledarea = true;
        vm.Detail.area.id = null;
        vm.listest(3, 1, 0);
        vm.datates === 0 ? (vm.prueba = 0) : (vm.prueba = vm.datates);
      }
      if (vm.Detail.Pq === false) {
        vm.isDisabledarea = false;
        if (vm.Detail.area.id === null) {
          vm.datatest = [];
        } else if (vm.Detail.area.id === 0) {
          vm.datatest = [];
        } else {
          vm.listest(0, 1, vm.Detail.area.id);
          vm.datates === 0 ? (vm.prueba = 0) : (vm.prueba = vm.datates);
        }
      }
    }
    //** Método paqra cuando cambia de paquetes a perfiles**//
    function changemultiplyBy() {
      if (vm.Detail.billing === true || vm.Detail.statistics === true) {
        vm.isDisabledmultiplyBy = false;
      } else {
        vm.isDisabledmultiplyBy = true;
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDatatest(data) {
      data.data.forEach(function (value, key) {
        data.data[key].search = data.data[key].code + data.data[key].name;
      });
      return data.data;
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.sortReverse1 = true;
      vm.sortType1 = "";
      vm.sortReverse2 = true;
      vm.sortType2 = "";
      vm.Repeat = false;
      vm.Repeatabbr = false;
      vm.Repeatname = false;
      vm.Area = false;
      vm.testassociate = false;
      vm.testassociateone = false;
      vm.search9 = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.selected = id;
      vm.Detail = [];
      vm.datatest = [];
      vm.datalistrequirement = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      vm.Requeriddatasample = false;
      vm.Requeridtestsample = false;
      return testDS.getTestById(auth.authToken, id).then(
        function (data) {
          if (data.status === 200) {
            vm.Detail.Days = "";
            vm.usuario = $filter("translate")("0017") + " ";
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              " - ";
            vm.usuario = vm.usuario + data.data.user.userName;
            vm.datalistrequirement = data.data.requirements;
            vm.Detail = data.data;
            vm.Detail.Days =
              data.data.processingDays.substr(0, 1) +
              "," +
              data.data.processingDays.substr(1, 1) +
              "," +
              data.data.processingDays.substr(2, 1) +
              "," +
              data.data.processingDays.substr(3, 1) +
              "," +
              data.data.processingDays.substr(4, 1) +
              "," +
              data.data.processingDays.substr(5, 1) +
              "," +
              data.data.processingDays.substr(6, 1) +
              ",";
            vm.Detail.Pq = data.data.testType === 2 ? true : false;
            vm.listestid(data);
            vm.sortReverse1 = false;
            vm.sortType1 = vm.selectedtest;
            vm.sortReverse2 = false;
            vm.sortType2 = vm.selectedrequirement;
            vm.stateButton("update");
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que obtiene la lista para llenar la lista de pruebas p9or id**//
    function listestid(data) {
      vm.testidprofil = data.data.concurrences;
      if (vm.Detail.dependentExam && !vm.Detail.Pq) {
        if (vm.Detail.sample.id !== null && vm.Detail.area.id !== null) {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS
            .getTestArea(auth.authToken, 0, 1, vm.Detail.area.id)
            .then(
              function (data) {
                if (data.data.length === 0) {
                  vm.datatest = [];
                } else {
                  data.data.forEach(function (value, key) {
                    var select = $filter("filter")(vm.testidprofil, function (e) {
                      return e.concurrence.id === value.id;
                    });
                    data.data[key].selected =
                      select.length === 0 ? false : select[0].selected;
                    var sample =
                      data.data[key].sample.name === undefined
                        ? ""
                        : data.data[key].sample.name;
                    data.data[key].search =
                      data.data[key].code + data.data[key].name + sample;
                  });
                  vm.datatest = data.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
        }
      } else if (!vm.Detail.dependentExam && !vm.Detail.Pq) {
        if (vm.Detail.area.id !== null) {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS
            .getTestArea(auth.authToken, 0, 1, vm.Detail.area.id)
            .then(
              function (data) {
                if (data.data.length === 0) {
                  vm.datatest = [];
                } else {
                  data.data.forEach(function (value, key) {
                    var select = $filter("filter")(vm.testidprofil, function (e) {
                      return e.concurrence.id === value.id;
                    });
                    data.data[key].selected =
                      select.length === 0 ? false : select[0].selected;
                    var sample =
                      data.data[key].sample.name === undefined
                        ? ""
                        : data.data[key].sample.name;
                    data.data[key].search =
                      data.data[key].code + data.data[key].name + sample;
                  });
                  vm.datatest = data.data;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
        }
      } else if (vm.Detail.dependentExam && vm.Detail.Pq) {
        if (vm.Detail.sample.id !== null) {
          auth = localStorageService.get("Enterprise_NT.authorizationData");
          return testDS.getTestArea(auth.authToken, 3, 1, 0).then(
            function (data) {
              if (data.data.length === 0) {
                vm.datatest = [];
              } else {
                data.data.forEach(function (value, key) {
                  var select = $filter("filter")(vm.testidprofil, function (e) {
                    return e.concurrence.id === value.id;
                  });
                  data.data[key].selected =
                    select.length === 0 ? false : select[0].selected;
                  var sample =
                    data.data[key].sample.name === undefined
                      ? ""
                      : data.data[key].sample.name;
                  data.data[key].search =
                    data.data[key].code + data.data[key].name + sample;
                });
                vm.datatest = data.data;
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        }
      } else if (!vm.Detail.dependentExam && vm.Detail.Pq) {
        auth = localStorageService.get("Enterprise_NT.authorizationData");
        return testDS.getTestArea(auth.authToken, 3, 1, 0).then(
          function (data) {
            {
              if (data.data.length === 0) {
                vm.datatest = [];
              } else {
                data.data.forEach(function (value, key) {
                  var select = $filter("filter")(vm.testidprofil, function (e) {
                    return e.concurrence.id === value.id;
                  });
                  data.data[key].selected =
                    select.length === 0 ? false : select[0].selected;
                  var sample =
                    data.data[key].sample.name === undefined
                      ? ""
                      : data.data[key].sample.name;
                  data.data[key].search =
                    data.data[key].code + data.data[key].name + sample;
                });
                vm.datatest = data.data;
              }
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataprofil(data) {
      data.data.forEach(function (value, key) {
        var select = $filter("filter")(vm.testidprofil, function (e) {
          return e.concurrence.id === value.id;
        });
        data.data[key].selected =
          select.length === 0 ? false : select[0].selected;
        var sample =
          data.data[key].sample.name === undefined
            ? ""
            : data.data[key].sample.name;
        data.data[key].search =
          data.data[key].code + data.data[key].name + sample;
      });
      return data.data;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getdatareport() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getprofiles(auth.authToken).then(
        function (data) {
          vm.loadingdata = false;
          vm.datareport = data.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = "/report/configuration/test/profil/profil.mrt";
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set("parameterReport", parameterReport);
      localStorageService.set("dataReport", datareport);
      window.open("/viewreport/viewreport.html");
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de requerido*//
  function RequeridoControllerprofil($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
