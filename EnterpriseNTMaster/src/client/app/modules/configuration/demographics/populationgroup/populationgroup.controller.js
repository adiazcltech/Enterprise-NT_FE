(function () {
  'use strict';

  angular
    .module('app.populationgroup')
    .controller('PopulationGroupsController', PopulationGroupsController);

  PopulationGroupsController.$inject = ['agegroupsDS', 'configurationDS', 'listDS', 'localStorageService',
    'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function PopulationGroupsController(agegroupsDS, configurationDS, listDS, localStorageService,
    logger, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'PopulationGroups';

    vm.code = ['code', 'name', 'gender', 'state'];
    vm.name = ['name', 'code', 'gender', 'state'];
    vm.gender = ['gender', 'code', 'name', 'state'];
    vm.state = ['-state', '+code', '+name', '+gender'];
    vm.sortReverse = false;
    vm.sortType = vm.code;

    vm.selected = -1;
    vm.populationgroupsDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getListGender = getListGender;
    vm.getListUnitTime = getListUnitTime;
    vm.getPopulationGroups = getPopulationGroups;
    vm.getPopulationGroupsById = getPopulationGroupsById;
    vm.NewPopulationGroups = NewPopulationGroups;
    vm.EditPopulationGroups = EditPopulationGroups;
    vm.changeState = changeState;
    vm.changeRange = changeRange;
    vm.stateButton = stateButton;
    vm.cancelPopulationGroups = cancelPopulationGroups;
    vm.insertPopulationGroups = insertPopulationGroups;
    vm.updatePopulationGroups = updatePopulationGroups;
    vm.savePopulationGroups = savePopulationGroups;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    var auth;
    vm.nameRepeat = false;
    vm.codeRepeat = false;
    vm.errorservice = 0;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //función que obtiene la lista de Tipos de motivo
    function getListGender() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 6).then(function (data) {
        var Gender = [];
        data.data.forEach(function (value, key) {
          if (value.id !== 9) {
            if (($filter('translate')('0000')) === 'esCo') {
              var object = {
                id: value.id,
                name: value.esCo,
                esCo: value.esCo,
                enUsa: value.enUsa
              };
              Gender.push(object);
            } else {
              var object = {
                id: value.id,
                name: value.enUsa,
                esCo: value.esCo,
                enUsa: value.enUsa
              };
              Gender.push(object);
            }
          }
        });
        vm.ListGender = $filter('orderBy')(Gender, 'name');
        vm.getListUnitTime();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfiguration(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.formatDate = $filter('filter')(data.data, {
            key: 'FormatoFecha'
          }, true)[0].value.toUpperCase(); //data.data.value.toUpperCase();
          vm.company = $filter('filter')(data.data, {
            key: 'Entidad'
          }, true)[0].value.toUpperCase();
          vm.abbrCompany = $filter('filter')(data.data, {
            key: 'Abreviatura'
          }, true)[0].value.toUpperCase();
        }
        vm.getPopulationGroups();
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
          vm.errorservice = vm.errorservice + 1;
        }
      });
    }
    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto*/
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
        if (($filter('translate')('0000')) === 'esCo') {
          data.data[key].gender = value.gender.esCo;
        } else {
          data.data[key].gender = value.gender.enUsa;
        }
      });
      return data.data;
    }
    /** Funcion que llena un combobox donde está la unidad de tiempo: 1- Años, 2-Días.*/
    function getListUnitTime() {
      var data = [{
          'value': 1,
          'text': $filter('translate')('0111')
        },
        {
          'value': 3,
          'text': $filter('translate')('0113')
        },
        {
          'value': 2,
          'text': $filter('translate')('0115')
        }
      ];
      vm.ListUnitTime = data;
      vm.getConfigurationFormatDate();
    }
    //** Método que cambia el rango cuando se selecciona una undiad de tiempo.**//
    function changeRange() {
      vm.valueMaxInit = vm.populationgroupsDetail.unitAge === 1 ? 70 : 300;
      vm.valueMinInit = vm.populationgroupsDetail.unitAge === 1 ? 1 : 0;
      vm.valueStartInit = vm.populationgroupsDetail.unitAge === 1 ? 1 : 0;
      // vm.ageMin = 3 - vm.populationgroupsDetail.unitAge;
      // vm.valueMaxEnd = vm.populationgroupsDetail.unitAge === 1 ? 200 : 2 ? 365 : value;
      vm.valueMinEnd = vm.populationgroupsDetail.unitAge === 1 ? 2 : 1;
      vm.valueStartEnd = vm.populationgroupsDetail.unitAge === 1 ? 2 : 1;
      // vm.ageMax = vm.populationgroupsDetail.unitAge === 1 ? 200 : 2 ? 365 : value;
      if (vm.populationgroupsDetail.unitAge === 1) {
        vm.valueMaxEnd = 200;
        vm.ageMax = 200;
      } else if (vm.populationgroupsDetail.unitAge === 2) {
        vm.valueMaxEnd = 365;
        vm.ageMax = 365;
      }else {
        vm.valueMaxEnd = 48;
        vm.ageMax = 48;
      }
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo grupo poblacional**//
    function NewPopulationGroups(PopulationGroupsForm) {
      PopulationGroupsForm.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.populationgroupsDetail = {
        'id': null,
        'code': '',
        'name': '',
        'gender': {},
        'unitAge': 1,
        'ageMin': 1,
        'ageMax': 200,
        'state': true,
        'user': {
          'id': auth.id
        }
      };
      vm.changeRange();
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar un grupo poblacional**//
    function cancelPopulationGroups(PopulationGroupsForm) {
      vm.ageMin = 0;
      vm.ageMax = 0;
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      PopulationGroupsForm.$setUntouched();
      if (vm.populationgroupsDetail.id === null) {
        vm.populationgroupsDetail = [];
      } else {
        vm.getPopulationGroupsById(vm.populationgroupsDetail.id, vm.selected, PopulationGroupsForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo grupo poblacional**//
    function EditPopulationGroups() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo grupo poblacional o se va actualizar**//
    function savePopulationGroups(PopulationGroupsForm) {
      if (vm.ageMin <= vm.ageMax) {
        PopulationGroupsForm.$setUntouched();
        vm.populationgroupsDetail.ageMin = vm.ageMin;
        vm.populationgroupsDetail.ageMax = vm.ageMax;
        if (vm.populationgroupsDetail.id === null) {
          vm.insertPopulationGroups();
        } else {
          vm.updatePopulationGroups();
        }
      }
    }
    //** Método que inserta un nuevo grupo poblacional**//
    function insertPopulationGroups() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return agegroupsDS.insertagegroups(auth.authToken, vm.populationgroupsDetail)
        .then(function (data) {
          if (data.status === 200) {
            vm.getPopulationGroups();
            vm.populationgroupsDetail = data.data;
            vm.selected = data.data.id;
            vm.stateButton('insert');
            logger.success($filter('translate')('0042'));
            return data;
          }
        }, function (error) {
          vm.modalError(error);
        });
    }
    //** Método que Actualiza un grupo poblacional**//
    function updatePopulationGroups() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return agegroupsDS.updateagegroups(auth.authToken, vm.populationgroupsDetail)
        .then(function (data) {
          if (data.status === 200) {
            vm.getPopulationGroups();
            vm.stateButton('update');
            logger.success($filter('translate')('0042'));
            return data;
          }

        }, function (error) {
          vm.modalError(error);
        });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.codeRepeat === false) {
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
    //** Método que obtiene una lista de grupos poblacionales **//
    function getPopulationGroups() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return agegroupsDS.getagegroups(auth.authToken).then(function (data) {
        vm.dataPopulationGroups = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.dataPopulationGroups;
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Método que obtiene un grupo poblacional por id*//
    function getPopulationGroupsById(id, index, PopulationGroupsForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.populationgroupsDetail = [];
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      PopulationGroupsForm.$setUntouched();
      vm.loadingdata = true;
      return agegroupsDS.getagegroupsId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.populationgroupsDetail = data.data;
          vm.ageMin = vm.populationgroupsDetail.ageMin;
          vm.ageMax = vm.populationgroupsDetail.ageMax;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.populationgroupsDetail.id === null || vm.populationgroupsDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/demographics/populationgroup/populationgroup.mrt';
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
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getListGender();
    }
    vm.isAuthenticate();
  }
})();
