(function () {
  'use strict';

  angular
    .module('app.task')
    .controller('TaskController', TaskController);

  TaskController.$inject = ['taskDS', 'localStorageService', 'logger',
    'configurationDS', '$rootScope', '$filter', '$state', 'moment', 'LZString', '$translate'
  ];

  function TaskController(taskDS, localStorageService, logger,
    configurationDS, $rootScope, $filter, $state, moment, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Task';
    vm.name = ['description', 'state'];
    vm.state = ['-state', '+description'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.taskDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getTask = getTask;
    vm.getTaskId = getTaskId;
    vm.generateFile = generateFile;
    vm.NewTask = NewTask;
    vm.EditTask = EditTask;
    vm.changeState = changeState;
    vm.cancelTask = cancelTask;
    vm.insertTask = insertTask;
    vm.updateTask = updateTask;
    vm.saveTask = saveTask;
    vm.stateButton = stateButton;
    vm.removeData = removeData;
    vm.modalError = modalError;
    var auth;
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
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getTask();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para adicionar o eliminar elementos del JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear una nueva tarea**//
    function NewTask(Taskform) {
      Taskform.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.taskDetail = {
        'user': {
          'id': 1
        },
        'id': null,
        'description': '',
        'state': false
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar una tarea**//
    function cancelTask(TaskForm) {
      TaskForm.$setUntouched();
      if (vm.taskDetail.id === null || vm.taskDetail.id === undefined) {
        vm.taskDetail = [];
      } else {
        vm.getTaskId(vm.taskDetail.id, vm.selected, TaskForm);
      }
      vm.stateButton('init');
      vm.descriptionReapeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar una nueva tarea**//
    function EditTask() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo tarea o se va actualizar **//
    function saveTask(TaskForm) {
      TaskForm.$setUntouched();
      if (vm.taskDetail.id === null) {
        vm.insertTask();
      } else {
        vm.updateTask();
      }
    }
    //** Método que inserta un nuevo tarea**//
    function insertTask() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return taskDS.newTask(auth.authToken, vm.taskDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTask();
          vm.taskDetail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'description') {
              vm.descriptionReapeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }

      });
    }
    //** Método que Actualiza una tarea**//
    function updateTask() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return taskDS.updateTask(auth.authToken, vm.taskDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTask();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'description') {
              vm.descriptionReapeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }

      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'description') {
              vm.descriptionReapeat = true;
            }
          });
        }
      }
      if (!vm.descriptionReapeat) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene una lista de tareas**//
    function getTask() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = false;
      return taskDS.getTask(auth.authToken).then(function (data) {
        vm.dataTask = data.data.length === 0 ? data.data : removeData(data);
        $rootScope.blockView = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una tarea por id*//
    function getTaskId(id, index, TaskForm) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.taskDetail = [];
      vm.descriptionReapeat = false;
      TaskForm.$setUntouched();
      return taskDS.getTaskId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.taskDetail = data.data;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError();
      });
    }
    /**Método  para imprimir el reporte **/
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/task/task.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver el reporte en otra pestaña del navegador.
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
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.taskDetail.id === null || vm.taskDetail.id === undefined ? true : false;
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
          document.getElementById('description').focus()
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
          document.getElementById('description').focus()
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
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.stateButton('init');
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

})();
