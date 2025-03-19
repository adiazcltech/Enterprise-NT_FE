(function () {
  'use strict';
  angular
    .module('app.laboratorytest')
    .controller('LaboratorytestController', LaboratorytestController)
    .controller('laboratorydependenceController', laboratorydependenceController);
  LaboratorytestController.$inject = ['branchDS', 'areaDS', 'laboratoryDS', 'testDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function LaboratorytestController(branchDS, areaDS, laboratoryDS, testDS, configurationDS, localStorageService, logger,
    $filter, $state, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'laboratorytest';
    vm.code = ['code', 'name', 'type'];
    vm.name = ['name', 'code', 'type'];
    vm.type = ['type', 'code', 'name'];
    vm.listLaboratory = [];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.codetest = ['test.code', 'test.name', 'routine', 'urgency'];
    vm.nametest = ['test.name', 'test.code', 'routine', 'urgency'];
    vm.routinetest = ['-routine', '-urgency', '+test.code', '+test.name'];
    vm.urgencytest = ['-urgency', '-routine', '+test.code', '+test.name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
    vm.selected = -1;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.requeridBranch = false;
    vm.laboratory = -1;
    vm.isAuthenticate = isAuthenticate;
    vm.cancel = cancel;
    vm.save = save;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getBranch = getBranch;
    //vm.getLaboratory = getLaboratory;
    vm.getTestLaboratoryBranch = getTestLaboratoryBranch;
    vm.validrutine = validrutine;
    vm.validurgency = validurgency;
    vm.changebranch = changebranch;
    vm.validlaboratory = validlaboratory;
    vm.modalrequired = modalrequired;
    vm.getTest = getTest;
    vm.errorservice = 0;
    vm.laboratoryassign = '';
    vm.listTest = [];
    vm.listTestHide = [];
    vm.lisbranches = [];
    vm.generatereport = generatereport;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.getArea = getArea;
    vm.changeareas = changeareas;
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que valida el cambio de area**//
    function changeareas() {
      var salida = [];
      if (vm.lisArea.id === 0) {
        salida = vm.listTestfilter;
        vm.listTest = salida;
      } else {
        salida = $filter('filter')(vm.listTestfilter, function (e) {
          return e.test.area.id === vm.lisArea.id
        })
        vm.listTest = salida;
      }
    }
    //** Metodo para obtener las sedes**//
    function getBranch() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.generateFile();
        if (data.status === 200) {
          vm.lisbranches = $filter('orderBy')(data.data, 'name');
        }
        vm.getTest();
        //  vm.getLaboratory();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las laboratorios**//
    function getLaboratory() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratoryActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (data.data.length > 0) {
            data.data.forEach(function (value, key) {
              delete value.user;
              delete value.lastTransaction;
              data.data[key].type = data.data[key].type === 1 ? $filter('translate')('0215') : $filter('translate')('0216');
              data.data[key].username = auth.userName;
            });
          }
          vm.listLaboratory = data.data;
          vm.getTest();
          return vm.listLaboratory;

        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener los examanes por laboratorio**//
    function getTestLaboratoryBranch(laboratory, index) {
      vm.loadingdata = true
      vm.selected = laboratory;
      vm.sortReverseTest = true;
      vm.sortTypeTest = '';
      vm.laboratory = laboratory;
      if (vm.lisbranches.id === undefined) {
        vm.requeridBranch = true;
        vm.loadingdata = false;
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return testDS.getTestLaboratoryBranch(auth.authToken, laboratory, vm.lisbranches.id).then(function (data) {
          if (data.status === 200) {
            vm.sortReverse1 = false;
            vm.sortType1 = vm.routinetest;
            data.data.forEach(function (value, key) {
              data.data[key].routine = data.data[key].routine === 1 ? true : data.data[key].routine === 2 ? false : 0;
              data.data[key].urgency = data.data[key].urgency === 1 ? true : data.data[key].urgency === 2 ? false : 0;
              data.data[key].originalurgency = data.data[key].urgency;
              data.data[key].originalroutine = data.data[key].routine;
              data.data[key].savetest = false;
            });
            vm.lisArea.id = vm.lisArea[0].id;
            vm.isDisabledCancel = false;
            vm.isDisabledSave = false;
            vm.routine = false;
            vm.urgency = false;
            vm.listTestfilter = data.data;
            vm.listTest = $filter('filter')(vm.listTestfilter, function (e) {
              return e.test.area.id === vm.lisArea.id
            })
          }
          vm.loadingdata = false;
        }, function (error) {
          vm.modalError(error);
        });
      }

    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getBranch()
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener la lista de examanes**//
    function getTest() {
      vm.loadingdata = true
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 3, 1, 0).then(function (data) {
        vm.listTestHide = data.data;
        vm.modalrequired();
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo valida el cambio de sedes**//
    function changebranch() {
      vm.requeridBranch = false;
      vm.getLaboratorybranch();
      /* if (vm.laboratory !== -1) {
        vm.getTestLaboratoryBranch(vm.laboratory, vm.selected);
      } */
    }

    vm.getLaboratorybranch = getLaboratorybranch;
    function getLaboratorybranch() {
      vm.loadingdata = true;
      vm.listLaboratory = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getlaboratoriesbybranches(auth.authToken, vm.lisbranches.id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.lisArea.id = vm.lisArea[0].id;
          vm.listLaboratory = _.filter(data.data, function (o) { return o.select; });
          vm.listLaboratory.forEach(function (value, key) {
            vm.listLaboratory[key].id = value.laboratory_id;
            vm.listLaboratory[key].type = vm.listLaboratory[key].type === 1 ? $filter('translate')('0215') : $filter('translate')('0216');
          });
          if (vm.listLaboratory.length === 0) {
            ModalService.showModal({
              templateUrl: "Requerido.html",
              controller: "laboratorydependenceController",
              inputs: {
                hidebranch: vm.lisbranches.length,
                hidelaboratory: vm.listLaboratory.length,
                hidetest: vm.listTestHide.length
              }
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                $state.go(result.page);
              });
            });
          }
        } else {
          ModalService.showModal({
            templateUrl: "Requerido.html",
            controller: "laboratorydependenceController",
            inputs: {
              hidebranch: vm.lisbranches.length,
              hidelaboratory: vm.listLaboratory.length,
              hidetest: vm.listTestHide.length
            }
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              $state.go(result.page);
            });
          });
        }
      }, function (error) {
        vm.modalError(error);
      });

    }

    //** Método para actualizar**//
    function save(Form) {
      vm.loadingdata = true
      var dataTest = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.savetest = $filter('filter')(vm.listTest, function (e) {
        return (e.savetest === true && e.test.area.id === vm.lisArea.id && e.originalroutine !== e.routine) ||
          (e.savetest === true && e.test.area.id === vm.lisArea.id && e.originalurgency !== e.urgency)
      })
      vm.savetest.forEach(function (value, key) {
        var object = {
          "test": {
            "id": vm.savetest[key].test.id,
            "lastTransaction": null,
            "user": {
              "id": auth.id,
            }
          },
          "idBranch": vm.lisbranches.id,
          "idLaboratory": vm.laboratory,
          "groupType": 0,
          "urgency": vm.savetest[key].urgency === true ? 1 : vm.savetest[key].urgency === false ? 2 : null,
          "routine": vm.savetest[key].routine === true ? 1 : vm.savetest[key].routine === false ? 2 : null
        }
        dataTest.push(object);
      });
      if (dataTest.length === 0) {
        vm.getTestLaboratoryBranch(vm.selected);
        logger.success($filter('translate')('0042'));
      } else {
        return testDS.insertTestLaboratory(auth.authToken, dataTest).then(function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.getTestLaboratoryBranch(vm.selected);
            logger.success($filter('translate')('0042'));
          }
        }, function (error) {
          vm.modalError(error);
        });
      }

    }
    //** Método para calidar el campo de rutina**//
    function validrutine() {
      if (vm.listTest.length > 0) {
        vm.listTest.forEach(function (value, key) {
          vm.listTest[key].routine = vm.listTest[key].routine !== 0 ? vm.routine : 0
          vm.listTest[key].savetest = vm.listTest[key].routine !== 0 ? true : false;
        });
      }

    }
    //** Método para calidar el campo de urgencia**//
    function validurgency() {
      if (vm.listTest.length > 0) {
        vm.listTest.forEach(function (value, key) {
          vm.listTest[key].urgency = vm.listTest[key].urgency !== 0 ? vm.urgency : 0
          vm.listTest[key].savetest = vm.listTest[key].urgency !== 0 ? true : false;
        });
      }
    }
    //** Método para calidar el campo de laboratorio**//
    function validlaboratory(id, typegroup) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratorytestBranchType(auth.authToken, id, vm.lisbranches.id, typegroup).then(function (data) {
        if (data.status === 200) {
          vm.laboratoryassign = data.data.name;

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.routine = false;
      vm.urgency = false;
      vm.getTestLaboratoryBranch(vm.laboratory, vm.selected);
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
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
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.data = [];
      vm.getArea();
      return laboratoryDS.getdatareport(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.data = data.data.length === 0 ? data.data : removeData(data);
        }
      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      vm.lisArea = []
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          if (data.data.length === 1) { } else {
            console.log(data);
            data.data.forEach(function (value, key) {
              if (value.id !== 1) {
                
                var object = {
                  id: value.id,
                  name: value.name,
                  code: value.code
                };
                vm.lisArea.push(object);
              }
            });
            vm.lisArea.id = vm.lisArea[0].id;
            vm.lisArea = $filter('orderBy')(vm.lisArea, 'id');
          }
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].username = auth.userName;
        data.data[key].urgency = data.data[key].urgency === 1 ? true : data.data[key].urgency === 2 ? false : true;
        data.data[key].routine = data.data[key].routine === 1 ? true : data.data[key].routine === 2 ? false : true;
        data.data[key].originalurgency = data.data[key].urgency;
        data.data[key].originalroutine = data.data[key].routine;
        data.data[key].savetest = false;

      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generatereport() {
      if (vm.data.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.data;
        vm.pathreport = '/report/configuration/test/laboratorytest/laboratorytest.mrt';
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
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.lisbranches.length === 0 || vm.listTestHide.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "laboratorydependenceController",
          inputs: {
            hidebranch: vm.lisbranches.length,
            hidetest: vm.listTestHide.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método de ventana modal de los requeridos*//
  function laboratorydependenceController($scope, hidebranch, hidelaboratory, hidetest, close) {
    $scope.hidebranch = hidebranch;
    $scope.hidelaboratory = hidelaboratory;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
