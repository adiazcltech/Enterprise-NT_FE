(function () {
  'use strict';
  angular
    .module('app.demographicapproval')
    .controller('demographicapprovalController', demographicapprovalController)
    .controller('demographicapprovaldependenceController', demographicapprovaldependenceController)
    .controller('demographicapprovalcodeController', demographicapprovalcodeController);
  demographicapprovalController.$inject = ['centralsystemDS', 'demographicapprovalDS', 'demographicDS', 'demographicsItemDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];
  //Función principal
  function demographicapprovalController(centralsystemDS, demographicapprovalDS, demographicDS, demographicsItemDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'demographicapproval';
    vm.sortTypeTest = 'code';
    vm.sortReverseTest = false;
    vm.selected = -1;
    vm.sortReverse = false;
    vm.sortType = 'name';
    vm.isDisabled = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCentralSystem = getCentralSystem;
    vm.getDemographicsALL = getDemographicsALL;
    vm.getDemographicsItemsId = getDemographicsItemsId;
    vm.validAddTag = validAddTag;
    vm.importdata = importdata;
    vm.save = save;
    vm.cancel = cancel;
    vm.changesystem = changesystem;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getConfigurationSeparadorLista = getConfigurationSeparadorLista;
    vm.errorservice = 0;
    vm.dataTestCodes = [];
    vm.updateStandarization = [];
    vm.modalRequired = false;
    vm.generateFile = generateFile;
    vm.validtag = true;
    vm.requeridSystem = false;
    vm.listimport = [];
    vm.modalrequired = modalrequired;
    var auth;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;



    //** Metodo para agregar y eliminar elementos de la lista**//
    function removeData(data) {
      var listdata = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.state;
        data.data[key].username = auth.userName;
        listdata.push(data.data[key]);
      });
      return listdata;
    }
    //** Metodo que evalua el cambio de sistema central**//
    function changesystem(name) {
      vm.centralsystemname = name;
      vm.requeridSystem = false;
      if (vm.demographicid !== undefined) {
        vm.getDemographicsItemsId(vm.demographicid, vm.demographicname)
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getConfigurationSeparadorLista();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para consultar el separdor de la muestra**//
    function getConfigurationSeparadorLista() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'SeparadorLista').then(function (data) {
        vm.getCentralSystem();
        if (data.status === 200) {
          vm.SeparadorLista = data.data.value;
          vm.headercsv = ['demographic/id' + vm.SeparadorLista + 'demographicItem/id' + vm.SeparadorLista + 'centralSystemid' + vm.SeparadorLista + 'centralCode' + vm.SeparadorLista + 'CodeDemo' + vm.SeparadorLista + 'Name'];
        } else {
          vm.headercsv = ['demographic/id;demographicItem/id;centralSystemid;centralCode;CodeDemo;Name'];
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para consultar los sitemas centrales activos**//
    function getCentralSystem() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        vm.dataCentralSystem = data.data.length === 0 ? data.data : removeData(data);
        vm.dataCentralSystem = $filter('orderBy')(vm.dataCentralSystem, 'name');
        vm.modalrequired()
        vm.getDemographicsALL();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para obtener todos los demograficos**//
    function getDemographicsALL() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {

        if (data.status === 200) {
          // if (1 === 1) {
          data.data.forEach(function (value, key) {
            switch (value.id) {
              case -1:
                data.data[key].name = $filter('translate')('0248');
                break;
              case -2:
                data.data[key].name = $filter('translate')('0225');
                break;
              case -3:
                data.data[key].name = $filter('translate')('0307');
                break;
              case -4:
                data.data[key].name = $filter('translate')('0133');
                break;
              case -5:
                data.data[key].name = $filter('translate')('0075');
                break;
              case -6:
                data.data[key].name = $filter('translate')('0175');
                break;
              case -7:
                data.data[key].name = $filter('translate')('0174');
                break;
              default:
                data.data[key].name = data.data[key].name;
            }
          });
          vm.loadingdata = false;
          vm.listdemographic = data.data;
        } else {
          vm.listdemographic = [];
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para obtener todos los demograficos por id**//
    function getDemographicsItemsId(id, name) {
      if (vm.dataCentralSystem.id === undefined) {
        vm.requeridSystem = true;
      } else {
        vm.selected = id;
        vm.demographicid = id;
        vm.demographicname = name;
        auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.loadingdata = true;
        vm.listreport = [];
        return demographicsItemDS.getDemographicsItemsAll(auth.authToken, vm.dataCentralSystem.id, id).then(function (data) {
          if (data.status === 200 && data.config.method === 'GET') {
          
            vm.dataItemDemographics = data.data;
            // comprobar si es un array o es undefined
            if (vm.dataItemDemographics === undefined
              || vm.dataItemDemographics === null
              || !Array.isArray(vm.dataItemDemographics)) {
              vm.dataItemDemographics = [];
              vm.loadingdata = false;
              // vm.stateButton('init');
              return;
            }


            vm.dataItemDemographics.forEach(function (value, key) {
              var code = '';
              for (var i = 0; i < vm.dataItemDemographics[key].centralCode.length; i++) {
                code = code + vm.dataItemDemographics[key].centralCode[i] + ' ';
              }
              vm.listreport.push({
                'reg': vm.demographicid + vm.SeparadorLista +
                  vm.dataItemDemographics[key].demographicItem.id + vm.SeparadorLista +
                  vm.dataCentralSystem.id + vm.SeparadorLista +
                  code + vm.SeparadorLista + vm.dataItemDemographics[key].demographicItem.code + vm.SeparadorLista + vm.dataItemDemographics[key].demographicItem.name
              });
              vm.loadingdata = false;
            });
          } else {
            vm.dataItemDemographics = [];
            vm.loadingdata = false;
          }
        }, function (error) {
          vm.modalError();
        });
      }
    }
    //** Metodo para validar los tag**//
    function validAddTag(tag, iddemographic, demographicItem, value) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.tag = tag.text;
      return demographicapprovalDS.getStandarizationDemographicExists(auth.authToken, vm.dataCentralSystem.id, iddemographic, demographicItem, tag.text).then(function (data) {
        if (data.data) {
          value.pop();
          ModalService.showModal({
            templateUrl: "Informat.html",
            controller: "demographicapprovalcodeController"
          }).then(function (modal) {
            modal.element.modal();
          });
        }
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para importar la data**//
    function importdata() {
      if (vm.listimport.length > 0) {
        var array = JSON.parse(vm.listimport);
        var arrayImport = [];
        array.forEach(function (value, key) {
          if (array[key].centralCode !== undefined) {
            var codearray = array[key].centralCode.split(' ');

            for (var i = 0; i < codearray.length; i++) {
              if (codearray[i] !== '') {
                var object = {
                  "id": array[key].centralSystemid,
                  "demographic": array[key].demographic,
                  "demographicItem": array[key].demographicItem,
                  "centralCode": []
                }
                object.centralCode.push(codearray[i]);
                arrayImport.push(object);
              }
            }
          }
        });

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return demographicapprovalDS.importStandarizationDemographic(auth.authToken, JSON.stringify(arrayImport)).then(function (data) {
          if (data.status === 200) {
            vm.getDemographicsItemsId(vm.demographicid, vm.demographicname);
            logger.success($filter('translate')('0042'));
          }
        }, function (error) {
          vm.dataerror = error.data.errorFields;
          vm.active = false;
        });
      }
    }
    //** Metodo para salvar la homologación de demográficos**//
    function save(iddemographic, demographicItem, codes) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.updateStandarization = {};
      var arrayCodes = [];
      codes.forEach(function (value) {
        arrayCodes.push(value.text);
      });
      vm.updateStandarization = {
        'id': vm.dataCentralSystem.id,
        'demographicItem': {
          'id': demographicItem
        },
        'demographic': {
          'id': iddemographic
        },
        'centralCode': arrayCodes,
        'user': {
          'id': auth.id
        }
      };
      return demographicapprovalDS.updateStandarizationDemographic(auth.authToken, vm.updateStandarization).then(function (data) {
        vm.loadingdata = false;
        vm.getDemographicsItemsId(vm.demographicid, vm.demographicname);
        if (data.status === 200 && !vm.invalid) {
          return data;
        }
      }, function (error) {
        vm.loadingdata = false;
        // vm.modalError(error);
      });
    }
    //** Metodo para cancelar la homologación de demográficos**//
    function cancel(StandarizationForm) {
      StandarizationForm.$setUntouched();
      if (vm.idCentralSystem === null) {
        vm.dataTestCodes = [];
      } else {
        vm.getStandarizationId(vm.idCentralSystem, vm.selected, StandarizationForm);
      }
      vm.stateButton('init');
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var dataReport = [];
      var nameSystem = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      for (var i = 0; i < vm.dataCentralSystem.length; i++) {
        if (vm.dataCentralSystem.id === vm.dataCentralSystem[i].id) {
          nameSystem = vm.dataCentralSystem[i].name;
          break;
        }
      }
      vm.filteredItems.forEach(function (value, keycentral) {
        if (value.centralCode.length > 0) {
          var codes = [];

          value.centralCode.forEach(function (value1, key) {
           
            if(value1.text != undefined){
              codes.push(value1.text);
            }
            else {
              codes.push(value1);
            }            
           
          });
         
      
          var object = {
            "demographic": vm.demographicname,
            "demographicItem": vm.filteredItems[keycentral].demographicItem.code + " - "+ vm.filteredItems[keycentral].demographicItem.name,
            "centralSystem": nameSystem,
            "centralCode": codes.toString(),
            "username": auth.userName
          }
          dataReport.push(object);
        }
      });
      if (dataReport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = dataReport;
        vm.pathreport = '/Report/configuration/integration/demographicapproval/demographicapprovalreport.mrt';
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
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo para evaluar el estado de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledPrint = true;
        vm.isDisabledCancel = true;
      }
      if (state === 'update') {
        vm.isDisabledPrint = false;
        vm.isDisabledCancel = false;
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.dataCentralSystem.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "demographicapprovaldependenceController",
          inputs: {
            hidesystem: vm.dataCentralSystem.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método para inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método ventana modal**//
  function demographicapprovaldependenceController($scope, hidesystem, close) {
    $scope.hidesystem = hidesystem;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Método ventana modal**//
  function demographicapprovalcodeController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
