(function () {
  'use strict';

  angular
    .module('app.sample')
    .controller('SampleController', SampleController)
    .controller('sampledependenceController', sampledependenceController);

  SampleController.$inject = ['sampleDS', 'containerDS', 'listDS',
    'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', 'ModalService', '$rootScope', 'LZString', '$translate'
  ];

  function SampleController(sampleDS, containerDS, listDS,
    configurationDS, localStorageService, logger,
    $filter, $state, moment, ModalService, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.temperature = localStorageService.get('ManejoTemperatura') === 'True';
    vm.init = init;
    vm.title = 'Sample';
    vm.codesample = ['codesample', 'name', 'state'];
    vm.name = ['name', 'codesample', 'state'];
    vm.state = ['-state', '+codesample', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.codesample;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
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
    vm.removeData = removeData;
    vm.getListcontainer = getListcontainer;
    vm.getListLaboratory = getListLaboratory;
    var auth;
    vm.modalError = modalError;
    vm.stateButton = stateButton;
    vm.idcontainer = 0;
    vm.getConfiguration = getConfiguration;
    vm.nameRepeat = false;
    vm.codesampleRepeat = false;
    vm.errorservice = 0;
    vm.generateFile = generateFile;
    vm.validunittime = validunittime;
    vm.maxtime = "59";
    vm.unittimeid = 1;
    vm.changecheck = changecheck;
    vm.changebarcode = changebarcode;
    vm.changeprintCodeSticker = changeprintCodeSticker;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.keyPressTextarea = keyPressTextarea;
    vm.customMenu = [
      ['bold', 'italic', 'underline', 'subscript', 'superscript'],
      // ['code', 'quote', 'paragraph'],
      ['ordered-list', 'unordered-list'],
      // ['link', 'image'],
      ['font-color', 'hilite-color'],
      ['font'],
      ['font-size']
    ];
    if (($filter('translate')('0000')) === 'esCo') {
      vm.laboratorytype = [{
          id: 5,
          name: 'Citología'
        },
        {
          id: 3,
          name: 'Microbiología'
        }, {
          id: 4,
          name: 'Patología'
        },
        {
          id: 2,
          name: 'Quimica Clinica'
        }
      ];
    } else {
      vm.laboratorytype = [{
          id: 2,
          name: 'Clinical Chemistry'
        },
        {
          id: 5,
          name: 'Cytology'
        },
        {
          id: 3,
          name: 'Microbiology'
        },
        {
          id: 4,
          name: 'Pathology'
        }
      ];
    }
    vm.unittime = [{
        'id': 3,
        'name': ($filter('translate')('0857')),
      },
      {
        'id': 2,
        'name': ($filter('translate')('0856')),
      }, {

        'id': 1,
        'name': ($filter('translate')('0855')),
      }
    ];
    //** Método que valida la unidad de tiempo seleccionada**//
    function validunittime() {
      if (vm.unittimeid === 1) {
        vm.maxtime = "59"
      } else if (vm.unittimeid === 2) {
        vm.maxtime = "24"
      } else if (vm.unittimeid === 3) {
        vm.maxtime = "365"
      }
    }
    //** Método que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que devuelve los valores de algunas llaves de configuración**//
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfiguration(auth.authToken).then(function (data) {
        vm.get();
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
          vm.CheckKey = $filter('filter')(data.data, {
            key: 'Trazabilidad'
          }, true)[0].value === '1';
        }
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
          vm.errorservice = vm.errorservice + 1;
        }
      });
    }
    // función que valida el estado de los botones
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
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
          document.getElementById('name').focus()
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
          document.getElementById('name').focus()
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
    //función que obtiene la lista de laboratorio
    function getListLaboratory() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 1).then(function (data) {
        vm.getListcontainer();
        var laboratorio = [];
        if (($filter('translate')('0000')) === 'esCo') {
          data.data.forEach(function (value, key) {
            var object = {
              id: value.id,
              name: value.esCo
            };
            laboratorio.push(object);
          });
        } else {
          data.data.forEach(function (value, key) {
            var object = {
              id: value.id,
              name: value.enUsa
            };
            laboratorio.push(object);
          });
        }
        vm.laboratorytype = laboratorio;
      }, function (error) {
        vm.modalError(error);
      });
    }
    // función que consulta el listado de recipientes
    function getListcontainer() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return containerDS.getState(auth.authToken, true).then(function (data) {
        if (data.status === 200) {
          vm.idcontainer = data.data[0].id;
          vm.Listcontainer = $filter('orderBy')(data.data, 'name');
          vm.getConfiguration();
        } else {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'sampledependenceController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'No') {
                $state.go('container');
              }
            });
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    // función que remueve los campos que no necesitan en la grilla
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.printable;
        delete value.canstiker;
        delete value.check;
        delete value.managementsample;
        delete value.daysstored;
        delete value.idcontainer;
        delete value.laboratorytype;
        delete value.typebarcode;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método iniciliza los controles de muestra**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.qualityTime = null;
      vm.unittimeid = null;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'codesample': 0,
        'name': '',
        'canstiker': 1,
        'container': {
          'id': vm.idcontainer,
        },
        'typebarcode': false,
        'printCodeSticker':false,
        'daysstored': 0,
        'printable': false,
        'check': vm.CheckKey,
        'state': true,
        'minimumTemperature': 0,
        'maximumTemperature': 0,
        'managementsample': '',
        'laboratorytype': 2
      };
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.nameRepeat = false;
      vm.codesampleRepeat = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');

    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es una nueva muestra o se va actualizar**//
    function save(Form) {
      Form.$setUntouched();
      if (vm.texareaHtml !== undefined) {
        vm.Detail.managementsample = vm.texareaHtml.replace(/span/g, "font").replace(/<br><br>/g, '<br>');

      } else {
        vm.Detail.managementsample = vm.Detail.managementsample.replace(/span/g, "font");
      }
      if (vm.Detail.check) {
        if (vm.unittimeid === 2) {
          vm.Detail.qualityTime = vm.qualityTime * 60
        } else if (vm.unittimeid === 3) {
          vm.Detail.qualityTime = vm.qualityTime * 1440
        } else {
          vm.Detail.qualityTime = vm.qualityTime
        }
      } else {
        vm.Detail.qualityTime = null;
        vm.Detail.qualityPercentage = null;
      }
      vm.Detail.printable = vm.Detail.canstiker === 0 ? false : true;
      vm.codesampleRepeat = false;
      vm.Detail.typebarcode = 1;
      vm.Detail.minimumTemperature = parseFloat(vm.Detail.minimumTemperature);
      vm.Detail.maximumTemperature = parseFloat(vm.Detail.maximumTemperature);
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
      vm.texareaHtml = undefined;
    }
    //** Método que inserta una nueva muestra**//
    function insert() {
      if (vm.Detail.canstiker === 0) {
        vm.Detail.printable = false;
        vm.Detail.typebarcode = false;
      }
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza una muestra**//
    function update() {
      if (vm.Detail.canstiker === 0) {
        vm.Detail.printable = false;
        vm.Detail.typebarcode = false;
      }
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return sampleDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }

    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que válida el cambio de estado del barcode**//
    function changebarcode() {
      if (!vm.Detail.printable) {
        vm.Detail.typebarcode = false;
      }
    }

    function changeprintCodeSticker(){
      if (!vm.Detail.printCodeSticker) {
        vm.Detail.printCodeSticker = false;
      }
    } 
    //** Método que válida el cambio de check del barcode**//
    function changecheck() {
      vm.check = true;
      if (!vm.Detail.check) {
        vm.qualityTime = null;
        vm.unittimeid = null;
        vm.Detail.qualityPercentage = null;
      }
    }
    //** Método que obtiene una lista de muestras**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.get(auth.authToken).then(function (data) {
        if (data.data.length === 0) {
          vm.data = data.data;
        } else {
          vm.data = vm.removeData(data);
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una muestra por id*//
    function getId(id, index, Form) {
      vm.nameRepeat = false;
      vm.codesampleRepeat = false;
      vm.qualityTime = null;
      vm.unittimeid = null;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.nameRepeat = false;
      vm.codesampleRepeat = false;
      Form.$setUntouched();
      vm.loadingdata = true;
      return sampleDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          data.data.minimumTemperature = data.data.minimumTemperature === undefined ? 0 : data.data.minimumTemperature;
          data.data.maximumTemperature = data.data.maximumTemperature === undefined ? 0 : data.data.maximumTemperature
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.loadingdata = false;
          if (vm.Detail.check && !vm.CheckKey) {
            vm.unittimeid = 1;
            if (vm.Detail.qualityTime > 59 && vm.Detail.qualityTime < 1444) {
              vm.qualityTime = Math.round(vm.Detail.qualityTime / 60)
              vm.unittimeid = 2;
            } else if (vm.Detail.qualityTime > 1439) {
              vm.qualityTime = Math.round(vm.Detail.qualityTime / 1444)
              vm.unittimeid = 3;
            } else {
              vm.qualityTime = vm.Detail.qualityTime;
            }
          } else if (vm.Detail.check && vm.CheckKey) {
            vm.qualityTime = null;
            vm.unittimeid = null;
            vm.Detail.check = false;
            vm.Detail.qualityPercentage = null;
          }
          vm.stateButton('update');
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
            if (item[0] === '1' && item[1] === 'Name') {
              vm.nameRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '1' && item[1] === 'Code') {
              vm.codesampleRepeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.codesampleRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.listreport = [];
      vm.filtered.forEach(function (value) {
        vm.listreport.push({
          'codesample': value.codesample,
          'name': value.name,
          'container': value.container.name,
          'state': value.state,
          'username': value.username
        });
      })
      if (vm.listreport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.listreport;
        vm.pathreport = '/report/configuration/test/sample/sample.mrt';
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
    // función que valida el maximo de caracteres escritos en textarea
    function keyPressTextarea($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      var c = '';
      if (keyCode === 13) {
        var target = '<' + $event.target.lastChild.localName + '>';
        var n = document.getElementById('managementsample').innerHTML.split(target).length;
        var arr = document.getElementById('managementsample').innerHTML.split(target);
        c = arr[0];
        for (var i = 1; i <= n - 1; i++) {
          c = c + '<br>' + arr[i];
        }
        vm.texareaHtml = c;

      } else if (keyCode > 31 && keyCode < 255 && keyCode !== 127 && $event.key !== 'Delete') {
        if (vm.texareaHtml !== undefined)
          vm.texareaHtml = vm.texareaHtml + $event.key;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getListLaboratory();
    }
    vm.isAuthenticate();
  }
  //** Controller de la ventana modal de requerido*//
  function sampledependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
