(function () {
  "use strict";
  angular
    .module("app.role")
    .controller("validSaveController", validSaveController)
    .controller("RoleController", RoleController);
  RoleController.$inject = [
    "roleDS",
    "moduleDS",
    "configurationDS",
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

  function RoleController(
    roleDS,
    moduleDS,
    configurationDS,
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
    vm.title = "Role";
    vm.sortReverse = false;
    vm.sortType = "name";
    vm.selected = -1;
    vm.roleDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getRole = getRole;
    vm.getRoleId = getRoleId;
    vm.getLanguage = getLanguage;
    vm.EditRole = EditRole;
    vm.changeState = changeState;
    vm.cancelRole = cancelRole;
    vm.insertRole = insertRole;
    vm.updaterole = updaterole;
    vm.saveRole = saveRole;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    var auth;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.changesubmodule = changesubmodule;
    vm.changesubmoduleprimary = changesubmoduleprimary;
    vm.changesubmodulesecundary = changesubmodulesecundary;
    vm.changemodule = changemodule;
    vm.OrderModule = OrderModule;
    vm.generateFile = generateFile;
    vm.getModules = getModules;
    vm.loadingdata = true;
    vm.windowOpenReport = windowOpenReport;
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });

      return data.data;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS
        .getConfigurationKey(auth.authToken, "FormatoFecha")
        .then(
          function (data) {
            vm.getRole();
            if (data.status === 200) {
              vm.formatDate = data.data.value.toUpperCase();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === "init") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit =
          vm.roleDetail.id === null || vm.roleDetail.id === undefined
            ? true
            : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === "add") {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
      }
      if (state === "edit") {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
      }
      if (state === "insert") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === "update") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancelRole(RoleForm) {
      vm.Repeat = false;
      vm.search1 = "";
      vm.search2 = "";
      RoleForm.$setUntouched();
      if (vm.roleDetail.id === null || vm.roleDetail.id === undefined) {
        vm.roleDetail = [];
      } else {
        vm.getRoleId(vm.roleDetail.id, vm.selected, RoleForm);
      }
      vm.stateButton("init");
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function EditRole() {
      vm.stateButton("edit");
    }
    //** Método que evalua si se  va crear o actualizar**//
    function saveRole(RoleForm) {
      vm.loadingdata = true;
      RoleForm.$setUntouched();
      vm.isDisabledSave = true;

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var role = {
        administrator: vm.roleDetail.administrator,
        id: vm.roleDetail.id,
        name: vm.roleDetail.name,
        state: vm.roleDetail.state,
        user: {
          id: auth.id,
        },
        modules: [],
      };
      vm.roleDetail.modules.forEach(function (value, key) {
        if (value.access) {
          role.modules.push(value);
          var submodules = $filter("filter")(value.submodules, {
            access: true,
          });
          submodules.forEach(function (valuesubmodules, key) {
            role.modules.push(valuesubmodules);
            var submodule1 = $filter("filter")(valuesubmodules.submodules, {
              access: true,
            });
            submodule1.forEach(function (value1, key1) {
              role.modules.push(value1);
              var submodule2 = $filter("filter")(value1.submodules, {
                access: true,
              });
              submodule2.forEach(function (value2, key) {
                role.modules.push(value2);
                var submodule3 = $filter("filter")(value2.submodules, {
                  access: true,
                });
                submodule3.forEach(function (value3, key) {
                  role.modules.push(value3);
                });
              });
            });
          });
        }
      });
      if (role.modules.length === 0) {
        vm.isDisabledSave = false;
        vm.loadingdata = false;
        ModalService.showModal({
          templateUrl: "validSave.html",
          controller: "validSaveController",
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {});
        });
      } else {
        if (role.id === null) {
          vm.insertRole(role);
        } else {
          vm.updaterole(role);
        }
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insertRole(role) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return roleDS.NewRole(auth.authToken, role).then(
        function (data) {
          if (data.status === 200) {
            vm.getRole();
            vm.roleDetail = data.data;
            vm.stateButton("insert");
            logger.success($filter("translate")("0042"));
            return data;
          }
        },
        function (error) {
          vm.modalError(error);
          vm.isDisabledSave = false;
        }
      );
    }
    //** Método se comunica con el dataservice y actualiza**//
    function updaterole(role) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      role.user.id = auth.id;
      return roleDS.updaterole(auth.authToken, role).then(
        function (data) {
          if (data.status === 200) {
            vm.getRole();
            logger.success($filter("translate")("0042"));
            vm.stateButton("update");
            return data;
          }
        },
        function (error) {
          vm.modalError(error);
          vm.isDisabledSave = false;
        }
      );
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split("|");
            if (item[0] === "1" && item[1] === "name") {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getModules(form) {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return moduleDS.getModules(auth.authToken).then(
        function (data) {
          form.$setUntouched();
          vm.usuario = "";
          vm.selected = -1;
          var auth = localStorageService.get("Enterprise_NT.authorizationData");

          vm.roleDetail = {
            user: {
              id: auth.id,
            },
            id: null,
            name: "",
            administrator: false,
            state: true,
            modules: data.data,
          };

          vm.roleDetail.modules.forEach(function (value, key) {
            value.open = 0;
            value.name = vm.getLanguage(value.id);
            if (value.submodules.length > 0) {
              value.submodules.forEach(function (value1, key1) {
                value1.open = 0;
                value1.name = vm.getLanguage(value1.id).name;
                value1.order = vm.getLanguage(value1.id).order;

                if (value1.submodules.length > 0) {
                  value1.submodules.forEach(function (value2, key2) {
                    value2.open = 0;

                    value2.name = vm.getLanguage(value2.id).name;
                    value2.order = vm.getLanguage(value2.id).order;

                    if (value2.submodules.length > 0) {
                      value2.submodules.forEach(function (value3, key3) {
                        value3.name = vm.getLanguage(value3.id).name;
                        value3.order = vm.getLanguage(value3.id).order;
                      });
                      value2.submodules.sort(vm.OrderModule);
                    }
                  });
                  value1.submodules.sort(vm.OrderModule);
                }
              });
              value.submodules.sort(vm.OrderModule);
            }
          });
          vm.roleDetail.modulebilling = vm.roleDetail.modules[4];
          vm.roleDetail.modulepathology = vm.roleDetail.modules[3];
          vm.roleDetail.moduleMicrobiology = vm.roleDetail.modules[2];
          vm.roleDetail.moduleLaboratory = vm.roleDetail.modules[1];
          vm.roleDetail.moduleConfiguration = vm.roleDetail.modules[0];
          vm.roleDetail.moduletransplants = vm.roleDetail.modules[5];

          vm.stateButton("add");
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function getRole() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return roleDS.getRole(auth.authToken).then(
        function (data) {
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          vm.loadingdata = false;
          return vm.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getRoleId(id, index, RoleForm) {
      vm.loadingdata = true;
      vm.Repeat = false;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.selected = index;
      vm.roleDetail = [];
      RoleForm.$setUntouched();
      return roleDS.getRoleId(auth.authToken, id).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.usuario = $filter("translate")("0017") + " ";
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              " - ";
            vm.usuario = vm.usuario + data.data.user.userName;
            vm.isDisabledAdd = false;
            vm.isDisabledEdit =
              id === 1 || id === 2 || data.data.name === "Patólogo"
                ? true
                : false;
            vm.isDisabledSave = true;
            vm.isDisabledCancel = true;
            vm.isDisabledPrint = false;
            vm.isDisabled = true;
            vm.isDisabledState = true;
            vm.roleDetail = data.data;
            vm.detailModule = data.data;
            vm.allMaster = vm.roleDetail.modules[0].access;
            vm.allLaboratory = vm.roleDetail.modules[1].access;
            vm.roleDetail.modules.forEach(function (value, key) {
              value.open = 0;
              value.name = vm.getLanguage(value.id);
              if (value.submodules.length > 0) {
                value.submodules.forEach(function (value1, key1) {
                  value1.open = 0;
                  value1.name = vm.getLanguage(value1.id).name;
                  value1.order = vm.getLanguage(value1.id).order;

                  if (value1.submodules.length > 0) {
                    value1.submodules.forEach(function (value2, key2) {
                      value2.open = 0;

                      value2.name = vm.getLanguage(value2.id).name;
                      value2.order = vm.getLanguage(value2.id).order;

                      if (value2.submodules.length > 0) {
                        value2.submodules.forEach(function (value3, key3) {
                          value3.name = vm.getLanguage(value3.id).name;
                          value3.order = vm.getLanguage(value3.id).order;
                        });
                        value2.submodules.sort(vm.OrderModule);
                      }
                    });
                    value1.submodules.sort(vm.OrderModule);
                  }
                });
                value.submodules.sort(vm.OrderModule);
              }
            });
            vm.roleDetail.modulebilling = vm.roleDetail.modules[4];
            vm.roleDetail.modulepathology = vm.roleDetail.modules[3];
            vm.roleDetail.moduleMicrobiology = vm.roleDetail.modules[2];
            vm.roleDetail.moduleLaboratory = vm.roleDetail.modules[1];
            vm.roleDetail.moduleConfiguration = vm.roleDetail.modules[0];
            vm.roleDetail.moduletransplants = vm.roleDetail.modules[5];
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método ordena los modulos**//
    function OrderModule(a, b) {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      }
    }
    //** Método para selecciona todos los modulos**//
    function changemodule(valuemodule, data) {
      data.forEach(function (value, key) {
        data[key].access = valuemodule;
        if (data[key].submodules.length > 0) {
          vm.changesubmodule(data[key].access, data[key].submodules, data[key]);
        }
      });
    }
    //** Método para selecciona todos los submodulos**//
    function changesubmodule(valuemodule, data, father1) {
      data.forEach(function (value, key) {
        data[key].access = valuemodule;
        if (data[key].submodules != undefined) {
          vm.changesubmoduleprimary(
            data[key].access,
            data[key].submodules,
            father1,
            data[key]
          );
        }
      });
      if (valuemodule) {
        father1.access = true;
      }
    }
    //** Método para selecciona todos los submodulos primarios**//
    function changesubmoduleprimary(valuemodule, data, father1, father2) {
      data.forEach(function (value, key) {
        data[key].access = valuemodule;
        if (data[key].submodules != undefined) {
          vm.changesubmodulesecundary(
            data[key].access,
            data[key].submodules,
            father1,
            father2,
            data[key]
          );
        }
      });
      if (valuemodule) {
        father1.access = true;
        father2.access = true;
      }
    }
    //** Método para selecciona todos los submodulos sevundarios**//
    function changesubmodulesecundary(
      valuemodule,
      data,
      father1,
      father2,
      father3
    ) {
      data.forEach(function (value, key) {
        data[key].access = valuemodule;
      });
      if (valuemodule) {
        father1.access = true;
        father2.access = true;
        father3.access = true;
      }
    }
    //** Método para generar el JSON para imprimir el reporte**//
    function generateFile() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listreport = [];
      vm.roleDetail.modules.forEach(function (value, key) {
        value.submodules.forEach(function (value1, key1) {
          if (value1.submodules.length > 0) {
            value1.submodules.forEach(function (value2, key) {
              if (value2.submodules.length > 0) {
                value2.submodules.forEach(function (value3, key) {
                  var role = {
                    administrator: vm.roleDetail.administrator,
                    id: vm.roleDetail.id,
                    name: vm.roleDetail.name,
                    state: vm.roleDetail.state,
                    username: auth.username,
                    module: value3.name,
                    access: value3.access,
                    type: value.name,
                  };
                  vm.listreport.push(role);
                });
              } else {
                var role = {
                  administrator: vm.roleDetail.administrator,
                  id: vm.roleDetail.id,
                  name: vm.roleDetail.name,
                  state: vm.roleDetail.state,
                  username: auth.username,
                  module: value2.name,
                  access: value2.access,
                  type: value.name,
                };
                vm.listreport.push(role);
              }
            });
          } else {
            var role = {
              administrator: vm.roleDetail.administrator,
              id: vm.roleDetail.id,
              name: vm.roleDetail.name,
              state: vm.roleDetail.state,
              username: auth.username,
              module: value1.name,
              access: value1.access,
              type: value.name,
            };
            vm.listreport.push(role);
          }
        });
      });
      vm.listreport = $filter("filter")(vm.listreport, {
        access: true,
      });
      if (vm.listreport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.listreport;
        vm.pathreport = "/report/configuration/user/role/role.mrt";
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
    // función para el lenguaje de las paginas
    function getLanguage(id) {
      switch (id) {
        case 11: //configuracion
          return {
            name: $filter("translate")("0285"),
            order: 1,
          };
          break;
        case 10: //demograficos
          return {
            name: $filter("translate")("0069"),
            order: 2,
          };
          break;
        case 9: //entrevista
          return {
            name: $filter("translate")("0286"),
            order: 3,
          };
          break;
        case 8: //pruebas
          return {
            name: $filter("translate")("0288"),
            order: 4,
          };
          break;
        case 7: //trazabilidad
          return {
            name: $filter("translate")("0322"),
            order: 5,
          };
          break;
        case 6: //microbiologia
          return {
            name: $filter("translate")("0312"),
            order: 6,
          };
          break;
        case 5: //oportunidad
          return {
            name: $filter("translate")("0351"),
            order: 7,
          };
          break;
        case 4: //integracion
          return {
            name: $filter("translate")("0360"),
            order: 8,
          };
          break;
        case 3: //facturacion
          return {
            name: $filter("translate")("0306"),
            order: 9,
          };
          break;
        case 2: //usuarios
          return {
            name: $filter("translate")("0122"),
            order: 10,
          };
          break;
        case 120: //Patologia
          return {
            name: $filter("translate")("3000"),
            order: 11,
          };
          break;
        case 160: //transplates
          return {
            name: $filter("translate")("3200"),
            order: 12,
          };
          break;
        case 161: //Aseguradora
          return {
            name: $filter("translate")("3201"),
            order: 1,
          };
          break;

        case 162: //Institución
          return {
            name: $filter("translate")("3202"),
            order: 2,
          };
          break;

        case 106: //general
          return {
            name: $filter("translate")("0665"),
            order: 5,
          };
          break;
        case 105: //festivos
          return {
            name: $filter("translate")("0660"),
            order: 4,
          };
          break;
        case 102: //instalacion
          return {
            name: $filter("translate")("0663"),
            order: 1,
          };
          break;
        case 103: //impresion por servicio
          return {
            name: $filter("translate")("1006"),
            order: 2,
          };
          break;
        case 104: //agrupacion de ordenes
          return {
            name: $filter("translate")("0988"),
            order: 3,
          };
          break;

        case 112: //Encriptación de reportes
          return {
            name: $filter("translate")("1135"),
            order: 1,
          };
          break;
        case 115: //valores por demográfico
          return {
            name: $filter("translate")("1146"),
            order: 2,
          };
          break;
        case 114: //items demografico por sede
          return {
            name: $filter("translate")("1141"),
            order: 3,
          };
          break;
        case 113: //Demografico por sede
          return {
            name: $filter("translate")("1142"),
            order: 4,
          };
          break;
        case 155: //Examenes por demograficos
          return {
            name: $filter("translate")("1298"),
            order: 5,
          };
          break;
        case 116: //dependencia de demograficos
          return {
            name: $filter("translate")("1158"),
            order: 5,
          };
          break;
        case 93: //Comfiguración demograficos
          return {
            name: $filter("translate")("0992"),
            order: 6,
          };
          break;
        case 156: //Ordenamiento demograficos
          return {
            name: $filter("translate")("1358"),
            order: 7,
          };
          break;
        case 94: //demografico item
          return {
            name: $filter("translate")("0082"),
            order: 8,
          };
          break;
        case 95: //demograficos
          return {
            name: $filter("translate")("0069"),
            order: 9,
          };
          break;
        case 96: //medico
          return {
            name: $filter("translate")("0225"),
            order: 10,
          };
          break;
        case 97: //especialidad
          return {
            name: $filter("translate")("0173"),
            order: 11,
          };
          break;
        case 98: //tipo de orden
          return {
            name: $filter("translate")("0133"),
            order: 12,
          };
          break;
        case 107: //servicio
          return {
            name: $filter("translate")("0175"),
            order: 13,
          };
          break;
        case 99: //sede
          return {
            name: $filter("translate")("0003"),
            order: 14,
          };
          break;
        case 100: //tipo de documento
          return {
            name: $filter("translate")("0645"),
            order: 15,
          };
          break;
        case 101: //raza
          return {
            name: $filter("translate")("0174"),
            order: 16,
          };
          break;

        case 90: //entrevista
          return {
            name: $filter("translate")("0286"),
            order: 1,
          };
          break;
        case 91: //pregunta
          return {
            name: $filter("translate")("0595"),
            order: 2,
          };
          break;
        case 92: //respuesta
          return {
            name: $filter("translate")("0599"),
            order: 3,
          };
          break;

        case 74: //areas
          return {
            name: $filter("translate")("0037"),
            order: 1,
          };
          break;
        case 73: //unidad
          return {
            name: $filter("translate")("0010"),
            order: 2,
          };
          break;
        case 72: //tecnica
          return {
            name: $filter("translate")("0045"),
            order: 3,
          };
          break;
        case 71: //requisitos
          return {
            name: $filter("translate")("0051"),
            order: 4,
          };
          break;
        case 70: //grupos etarios
          return {
            name: $filter("translate")("0219"),
            order: 5,
          };
          break;
        case 69: //alarmas
          return {
            name: $filter("translate")("0278"),
            order: 6,
          };
          break;
        case 68: //comentarios
          return {
            name: $filter("translate")("0178"),
            order: 7,
          };
          break;

        case 67: //Muestras padre
          return {
            name: $filter("translate")("0052"),
            order: 8,
          };
          break;
        case 89: //recipiente
          return {
            name: $filter("translate")("0046"),
            order: 2,
          };
          break;
        case 88: //muestras
          return {
            name: $filter("translate")("0052"),
            order: 1,
          };
          break;

        case 66: //prueba
          return {
            name: $filter("translate")("0402"),
            order: 10,
          };
          break;
        case 65: //perfil
          return {
            name: $filter("translate")("0290"),
            order: 11,
          };
          break;
        case 64: //dias de procesamiento
          return {
            name: $filter("translate")("0301"),
            order: 12,
          };
          break;
        case 63: //orden de impresion
          return {
            name: $filter("translate")("0294"),
            order: 13,
          };
          break;
        case 62: //grupo de pruebas
          return {
            name: $filter("translate")("0802"),
            order: 14,
          };
          break;
        case 61: //edicion de pruebas en bloque
          return {
            name: $filter("translate")("0302"),
            order: 15,
          };
          break;

        case 60: //diagnostico padre
          return {
            name: $filter("translate")("0180"),
            order: 16,
          };
          break;
        case 87: //diagnostico
          return {
            name: $filter("translate")("0180"),
            order: 2,
          };
          break;
        case 86: //diagnostico por prueba
          return {
            name: $filter("translate")("0883"),
            order: 1,
          };
          break;

        case 59: //laboratorio
          return {
            name: $filter("translate")("0204"),
            order: 18,
          };
          break;
        case 85: //laboratorio
          return {
            name: $filter("translate")("0204"),
            order: 3,
          };
          break;
        case 111: //Sedes por laboratorio
          return {
            name: $filter("translate")("1107"),
            order: 1,
          };
          break;
        case 84: //prueba por laboratorio
          return {
            name: $filter("translate")("0291"),
            order: 2,
          };
          break;

        case 58: //prueba por demografico
          return {
            name: $filter("translate")("0591"),
            order: 20,
          };
          break;

        case 57: //excluir prueba por
          return {
            name: $filter("translate")("0931"),
            order: 21,
          };
          break;
        case 83: //excluir prueba por usurio
          return {
            name: $filter("translate")("0001"),
            order: 2,
          };
          break;
        case 82: //excluir prueba por demografico
          return {
            name: $filter("translate")("0069"),
            order: 1,
          };
          break;

        case 56: //resultados
          return {
            name: $filter("translate")("0211"),
            order: 22,
          };
          break;
        case 81: //hojas de trabajo
          return {
            name: $filter("translate")("0300"),
            order: 7,
          };
          break;
        case 80: //contador hematologico
          return {
            name: $filter("translate")("0299"),
            order: 6,
          };
          break;
        case 79: //plantilla de resultados
          return {
            name: $filter("translate")("0297"),
            order: 5,
          };
          break;
        case 78: //relacion de resultados
          return {
            name: $filter("translate")("0514"),
            order: 4,
          };
          break;
        case 77: //prueba automatica
          return {
            name: $filter("translate")("0298"),
            order: 3,
          };
          break;
        case 76: //Resultado literal
          return {
            name: $filter("translate")("0210"),
            order: 2,
          };
          break;
        case 75: //resultado literal por prueba
          return {
            name: $filter("translate")("0292"),
            order: 1,
          };
          break;

        case 55: //delta check
          return {
            name: $filter("translate")("0350"),
            order: 23,
          };
          break;
        case 54: //valores de referencia
          return {
            name: $filter("translate")("0295"),
            order: 24,
          };
          break;

        case 154: //Alarma examen desde ingreso
          return {
            name: $filter("translate")("1296"),
            order: 25,
          };
          break;

        case 109: //Trazabilidad completa
          return {
            name: $filter("translate")("1101"),
            order: 1,
          };
          break;
        case 51: //destino
          return {
            name: $filter("translate")("0324"),
            order: 2,
          };
          break;
        case 50: //asignacion de destinos
          return {
            name: $filter("translate")("0325"),
            order: 1,
          };
          break;

        case 53: //nevera
          return {
            name: $filter("translate")("0323"),
            order: 3,
          };
          break;
        case 52: //motivo
          return {
            name: $filter("translate")("0274"),
            order: 2,
          };
          break;

        case 117: //Agente etiologico
          return {
            name: $filter("translate")("1328"),
            order: 14,
          };
          break;

        case 47: //antibiograma
          return {
            name: $filter("translate")("0317"),
            order: 13,
          };
          break;
        case 48: //antibioticos
          return {
            name: $filter("translate")("0313"),
            order: 12,
          };
          break;
        case 49: //microorganismo
          return {
            name: $filter("translate")("0314"),
            order: 11,
          };
          break;
        case 46: //valores de referencia por antibiotico
          return {
            name: $filter("translate")("0869"),
            order: 10,
          };
          break;
        case 45: //destinos de microbiologia
          return {
            name: $filter("translate")("0862"),
            order: 9,
          };
          break;
        case 44: //sitio anatomico
          return {
            name: $filter("translate")("0315"),
            order: 8,
          };
          break;
        case 43: //tarea
          return {
            name: $filter("translate")("0316"),
            order: 7,
          };
          break;
        case 42: //metodo de recoleccion
          return {
            name: $filter("translate")("0675"),
            order: 6,
          };
          break;
        case 41: //procedimiento
          return {
            name: $filter("translate")("0318"),
            order: 5,
          };
          break;
        case 40: //procedimeinto por prueba
          return {
            name: $filter("translate")("0321"),
            order: 4,
          };
          break;
        case 39: //medio de cultivo
          return {
            name: $filter("translate")("0319"),
            order: 3,
          };
          break;
        case 38: //medio de cultivo por prueba
          return {
            name: $filter("translate")("0320"),
            order: 2,
          };
          break;
        case 37: //submuestras
          return {
            name: $filter("translate")("0636"),
            order: 1,
          };
          break;

        case 36: //histograma
          return {
            name: $filter("translate")("0831"),
            order: 4,
          };
          break;
        case 35: //muestras por servicio
          return {
            name: $filter("translate")("0582"),
            order: 3,
          };
          break;
        case 34: //oportunidad de la muestra
          return {
            name: $filter("translate")("0326"),
            order: 2,
          };
          break;
        case 33: //oportunidad de la prueba
          return {
            name: $filter("translate")("0303"),
            order: 1,
          };
          break;

        case 28: //homologacion de pruebas
          return {
            name: $filter("translate")("0281"),
            order: 1,
          };
          break;
        case 29: //homologacion de demograficos
          return {
            name: $filter("translate")("0566"),
            order: 2,
          };
          break;
        case 30: //homologacion de usuarios
          return {
            name: $filter("translate")("0359"),
            order: 3,
          };
          break;
        case 31: //sistema central
          return {
            name: $filter("translate")("0280"),
            order: 4,
          };
          break;
        case 32: //integracion middleware por laboratorio
          return {
            name: $filter("translate")("0972"),
            order: 5,
          };
          break;
        case 110: //Demografico consulta web
          return {
            name: $filter("translate")("1104"),
            order: 6,
          };
          break;

        case 151: //tipos de impuesto
          return {
            name: $filter("translate")("1195"),
            order: 1,
          };

        case 152: //impresoras fiscales
          return {
            name: $filter("translate")("1206"),
            order: 1,
          };

        case 27: //tipos de pago
          return {
            name: $filter("translate")("0357"),
            order: 2,
          };
          break;
        case 26: //banco
          return {
            name: $filter("translate")("0309"),
            order: 3,
          };
          break;
        case 25: //tarjeta de credito
          return {
            name: $filter("translate")("0308"),
            order: 4,
          };
          break;
        case 24: //entidad
          return {
            name: $filter("translate")("0676"),
            order: 5,
          };
          break;
        case 23: //cliente
          return {
            name: $filter("translate")("0248"),
            order: 6,
          };
          break;
        case 153: //contrato
          return {
            name: $filter("translate")("1224"),
            order: 7,
          };
          break;
        case 22: //tarifa
          return {
            name: $filter("translate")("0307"),
            order: 8,
          };
          break;
        case 21: //resoluciones
          return {
            name: $filter("translate")("0885"),
            order: 9,
          };
          break;
        case 20: //tarifa por cliente
          return {
            name: $filter("translate")("0311"),
            order: 11,
          };
          break;
        case 150: //RIPS
          return {
            name: $filter("translate")("0842"),
            order: 10,
          };
          break;
        case 19: //dias de alarma
          return {
            name: $filter("translate")("0282"),
            order: 12,
          };
          break;
        case 17: //protocolo EDI
          return {
            name: $filter("translate")("0674"),
            order: 13,
          };
          break;
        case 18: //receptor EDI
          return {
            name: $filter("translate")("0383"),
            order: 14,
          };
          break;
        case 16: //impuesto por prueba
          return {
            name: $filter("translate")("0949"),
            order: 15,
          };
          break;
        case 15: //vigencias
          return {
            name: $filter("translate")("0310"),
            order: 16,
          };
          break;
        case 14: //asignacion de precios por tarifa
          return {
            name: $filter("translate")("0610"),
            order: 17,
          };
          break;

        case 12: //roles
          return {
            name: $filter("translate")("0049"),
            order: 3,
          };
          break;
        case 108: //Integración analizador
          return {
            name: $filter("translate")("1072"),
            order: 1,
          };
          break;
        case 13: //usuarios
          return {
            name: $filter("translate")("0122"),
            order: 2,
          };
          break;

        //Patologia
        case 121: //Areas
          return {
            name: $filter("translate")("0037"),
            order: 1,
          };
          break;

        case 122: //Contenedores
          return {
            name: $filter("translate")("3016"),
            order: 2,
          };
          break;

        case 123: //Especimen
          return {
            name: $filter("translate")("3017"),
            order: 3,
          };
          break;

        case 124: //Organos
          return {
            name: $filter("translate")("3018"),
            order: 4,
          };
          break;

        case 125: //Tipo de Estudio
          return {
            name: $filter("translate")("3019"),
            order: 5,
          };
          break;

        case 126: //Casetes
          return {
            name: $filter("translate")("3061"),
            order: 6,
          };
          break;

        case 127: //Fijadores
          return {
            name: $filter("translate")("3062"),
            order: 7,
          };
          break;

        case 128: //Coloraciones
          return {
            name: $filter("translate")("3063"),
            order: 8,
          };
          break;

        case 129: //Patologos
          return {
            name: $filter("translate")("3072"),
            order: 9,
          };
          break;

        case 130: //Protocolo
          return {
            name: $filter("translate")("1009"),
            order: 10,
          };
          break;

        case 131: //Agenda
          return {
            name: $filter("translate")("3084"),
            order: 11,
          };
          break;

        case 132: //Eventos
          return {
            name: $filter("translate")("0661"),
            order: 12,
          };
          break;

        case 133: //Campos
          return {
            name: $filter("translate")("3107"),
            order: 13,
          };
          break;

        case 134: //Plantillas
          return {
            name: $filter("translate")("3111"),
            order: 14,
          };
          break;

        case 135: //Horarios de procesamiento
          return {
            name: $filter("translate")("3122"),
            order: 15,
          };
          break;

        case 136: //Coloraciones por examen
          return {
            name: $filter("translate")("1380"),
            order: 16,
          };
          break;

        case 201: //gestion de ordenens
          return {
            name: $filter("translate")("1040"),
            order: 1,
          };
          break;
        case 202: //gestion de historias
          return {
            name: $filter("translate")("1041"),
            order: 2,
          };
          break;
        case 203: //resultados
          return {
            name: $filter("translate")("0820"),
            order: 4,
          };
          break;

        case 204: //--Gestión de muestras
          return {
            name: $filter("translate")("1100"),
            order: 3,
          };
          break;

        case 205: //informes y consultas
          return {
            name: $filter("translate")("0821"),
            order: 5,
          };
          break;
        case 206: // auditoria
          return {
            name: $filter("translate")("1042"),
            order: 6,
          };
          break;
        case 207: //estadisticas
          return {
            name: $filter("translate")("0433"),
            order: 7,
          };
          break;
        case 208: //indicadores
          return {
            name: $filter("translate")("0830"),
            order: 8,
          };
          break;
        case 209: //utilidades
          return {
            name: $filter("translate")("0672"),
            order: 9,
          };
          break;

        case 210: //ingreso de ordenes
          return {
            name: $filter("translate")("0803"),
            order: 1,
          };
          break;
        case 212: //listados
          return {
            name: $filter("translate")("0808"),
            order: 2,
          };
          break;
        case 213: //ordenes campaña
          return {
            name: $filter("translate")("0891"),
            order: 3,
          };
          break;
        case 214: //activar ordenes
          return {
            name: $filter("translate")("0838"),
            order: 4,
          };
          break;
        case 215: //Reiniciar contador
          return {
            name: $filter("translate")("0792"),
            order: 5,
          };
          break;

        case 216: //Historias clinicas
          return {
            name: $filter("translate")("0810"),
            order: 1,
          };
          break;
        case 217: //asignacion de historia
          return {
            name: $filter("translate")("0809"),
            order: 2,
          };
          break;
        case 218: //Reasignacion de historias
          return {
            name: $filter("translate")("0837"),
            order: 3,
          };
          break;
        case 219: //inconsistencias
          return {
            name: $filter("translate")("0844"),
            order: 4,
          };
          break;
        case 220: //desbloqueo de historia orden
          return {
            name: $filter("translate")("0848"),
            order: 5,
          };
          break;
        case 252: //gestion consulta web
          return {
            name: $filter("translate")("3195"),
            order: 6,
          };
          break;

        case 211: //ruta de la muestra
          return {
            name: $filter("translate")("0799"),
            order: 1,
          };
          break;
        case 243: //Almacen de la muestra
          return {
            name: $filter("translate")("0836"),
            order: 2,
          };
          break;

        case 251: //trazabilidad
          return {
            name: $filter("translate")("0322"),
            order: 3,
          };

        case 221: //Registro de resultados
          return {
            name: $filter("translate")("0812"),
            order: 1,
          };
          break;
        case 222: //Rango de resultados
          return {
            name: $filter("translate")("0814"),
            order: 2,
          };
          break;
        case 223: //Revision de resultados
          return {
            name: $filter("translate")("0816"),
            order: 3,
          };
          break;
        case 224: //Hojas de trabajo
          return {
            name: $filter("translate")("0811"),
            order: 4,
          };
          break;
        case 225: //reenvio del middleware
          return {
            name: $filter("translate")("1050"),
            order: 5,
          };
          break;

        case 229: //informes
          return {
            name: $filter("translate")("0824"),
            order: 1,
          };
          break;
        case 230: //control y entrega de informes
          return {
            name: $filter("translate")("0825"),
            order: 2,
          };
          break;
        case 231: //consultas
          return {
            name: $filter("translate")("0826"),
            order: 3,
          };
          break;
        case 232: //consultas de pacientes
          return {
            name: $filter("translate")("1043"),
            order: 4,
          };
          break;
        case 249: //consentimiento informado
          return {
            name: $filter("translate")("1152"),
            order: 5,
          };
          break;

        case 233: //auditoria de ordenes
          return {
            name: $filter("translate")("1044"),
            order: 1,
          };
          break;
        case 234: //auditoria de maestros
          return {
            name: $filter("translate")("1045"),
            order: 2,
          };
          break;
        case 235: //auditoria de usuarios
          return {
            name: $filter("translate")("1046"),
            order: 3,
          };
          break;
        case 507: //auditoria de faturacion
          return {
            name: $filter("translate")("1275"),
            order: 4,
          };
          break;

        case 601: //Receptores
          return {
            name: $filter("translate")("3001"),
            order: 1,
          };
          break;
        case 602: //Participantes
          return {
            name: $filter("translate")("3205"),
            order: 2,
          };
          break;
        case 603: //donantes
          return {
            name: $filter("translate")("3206"),
            order: 3,
          };
          break;
        case 604: //Anticuerpos Citotoxicos
          return {
            name: $filter("translate")("3207"),
            order: 4,
          };
          break;
        case 608: //SELECCION
          return {
            name: $filter("translate")("3214"),
            order: 5,
          };
          break;
        case 605: //Editor de reportes
          return {
            name: $filter("translate")("3208"),
            order: 6,
          };
          break;
        case 606: //Gestion de reportes
          return {
            name: $filter("translate")("3209"),
            order: 7,
          };
          break;
        case 306: //Citas
          return {
            name: "Citas",
            order: 7,
          };
          break;
        case 607: //Historico de reportes
          return {
            name: $filter("translate")("3210"),
            order: 8,
          };
          break;
        case 236: //estadisticas
          return {
            name: $filter("translate")("0822"),
            order: 1,
          };
          break;
        case 237: //estadisticas especiales
          return {
            name: $filter("translate")("0827"),
            order: 2,
          };
          break;
        case 238: //estadisticas con precios
          return {
            name: $filter("translate")("0828"),
            order: 3,
          };
          break;
        case 239: //muestras en destinos
          return {
            name: $filter("translate")("0834"),
            order: 4,
          };
          break;

        case 240: //alerta temprana
          return {
            name: $filter("translate")("0829"),
            order: 1,
          };
          break;
        case 241: //indicadores
          return {
            name: $filter("translate")("0830"),
            order: 2,
          };
          break;
        case 242: //histograma
          return {
            name: $filter("translate")("0831"),
            order: 3,
          };
          break;
        case 305: //Reportes adicionales
          return {
            name: $filter("translate")("1271"),
            order: 4,
          };
          break;

        case 244: //Visor de suceso
          return {
            name: $filter("translate")("0840"),
            order: 1,
          };
          break;
        case 245: //Visor de sesiones
          return {
            name: $filter("translate")("1047"),
            order: 2,
          };
          break;
        case 246: //borrados especiales
          return {
            name: $filter("translate")("0843"),
            order: 3,
          };
          break;
        case 247: //Edicion de Reportes
          return {
            name: $filter("translate")("1048"),
            order: 4,
          };
          break;
        case 248: //Edicion de codigo de barras
          return {
            name: $filter("translate")("1049"),
            order: 5,
          };
          break;
        case 250: //Asignación de cubiculos
          return {
            name: "Asignación de cubiculos",
            order: 6,
          };
          break;

        case 301: //verificacion de microbilogia
          return {
            name: $filter("translate")("0817"),
            order: 1,
          };
          break;
        case 302: //Lectura de microiologia
          return {
            name: $filter("translate")("0819"),
            order: 3,
          };
          break;
        case 303: //plano whonet
          return {
            name: $filter("translate")("0832"),
            order: 4,
          };
          break;
        case 304: //siembra de microbiologia
          return {
            name: $filter("translate")("0818"),
            order: 2,
          };
          break;

        //Patología
        case 401: //Recepcion de muestras
          return {
            name: $filter("translate")("3001"),
            order: 2,
          };
          break;
        case 410: //Gestión de Laminas
          return {
            name: $filter("translate")("3002"),
            order: 2,
          };
          break;
        case 411: //Activación de muestras
          return {
            name: $filter("translate")("3100"),
            order: 3,
          };
          break;

        case 402: //Macroscopia
          return {
            name: $filter("translate")("3086"),
            order: 2,
          };
          break;

        case 420: //Descripciones macroscopicas
          return {
            name: $filter("translate")("3114"),
            order: 3,
          };
          break;

        case 421: //Transcripciones
          return {
            name: $filter("translate")("3115"),
            order: 4,
          };
          break;

        case 403: //Histotecnologia
          return {
            name: $filter("translate")("3117"),
            order: 2,
          };
          break;

        case 430: //Procesador de tejidos
          return {
            name: $filter("translate")("3118"),
            order: 3,
          };
          break;

        case 431: //Central de inclusión
          return {
            name: $filter("translate")("3119"),
            order: 4,
          };
          break;

        case 432: //Corte
          return {
            name: $filter("translate")("3120"),
            order: 5,
          };
          break;

        case 433: //Coloracion
          return {
            name: $filter("translate")("3121"),
            order: 6,
          };
          break;

        case 408: //Utilidades patologia
          return {
            name: $filter("translate")("0672"),
            order: 2,
          };
          break;

        case 470: //Edicion de codigos de barras
          return {
            name: $filter("translate")("1049"),
            order: 3,
          };
          break;

        case 501: //Generar factura
          return {
            name: $filter("translate")("1216"),
            order: 1,
          };
          break;
        case 502: //Nota crédito
          return {
            name: $filter("translate")("1217"),
            order: 2,
          };
          break;
        case 503: //Recalculo
          return {
            name: $filter("translate")("1218"),
            order: 3,
          };
          break;
        case 504: //Reporte de caja
          return {
            name: $filter("translate")("1219"),
            order: 4,
          };
          break;
        case 505: //Reimprimir factura
          return {
            name: $filter("translate")("1220"),
            order: 5,
          };
          break;
        case 506: //Rips
          return {
            name: "RIPS",
            order: 2,
          };
          break;
        case 508: //Recalculo de tarifas
          return {
            name: $filter("translate")("1321"),
            order: 2,
          };
          break;
        case 509: //Cambio de precios
          return {
            name: $filter("translate")("1322"),
            order: 3,
          };
        case 190: // Citas
          return {
            name: $filter("translate")("3228"),
            order: 1,
          };
        case 191: // Jornadas
          return {
            name: $filter("translate")("3229"),
            order: 1,
          };
        case 192: // Jornadas por sede
          return {
            name: $filter("translate")("3230"),
            order: 2,
          };
        case 193: // Toma de muestra
          return {
            name: $filter("translate")("3231"),
            order: 1,
          };
          case 307: // Toma de muestra
          return {
            name: $filter("translate")("3231"),
            order: 1,
          };   
        case 194: // Puntos de Toma de muestra
          return {
            name: $filter("translate")("3235"),
            order: 1,
          };
        default:
          return "S/A";
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
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
    vm.isAuthenticate();
  }
  // Metodo para la modal de requerido
  function validSaveController($scope, close) {
    $scope.close = function () {
      close({}, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
