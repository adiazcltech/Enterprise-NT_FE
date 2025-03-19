(function () {
  'use strict';
  angular
    .module('app.comment')
    .controller('commentController', commentController);
  commentController.$inject = ['commentDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function commentController(commentDS, configurationDS, localStorageService,
    logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Comentario';
    vm.code = ['code', 'state'];
    vm.state = ['-state', '+code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.codeRepeat = false;
    vm.selected = -1;
    vm.detail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getById = getById;
    vm.edit = edit;
    vm.add = add;
    vm.update = update;
    vm.insert = insert;
    vm.removeData = removeData;
    vm.cancel = cancel;
    vm.save = save;
    vm.changeState = changeState;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.keyPressTextarea = keyPressTextarea;
    vm.customMenu = [
      ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
      ['code', 'quote', 'paragraph'],
      ['ordered-list', 'unordered-list', 'outdent', 'indent'],
      ['left-justify', 'center-justify', 'right-justify'],
      ['remove-format'],
      ['link', 'image'],
      ['font-color', 'hilite-color'],
      ['font'],
      ['font-size']
    ];
    vm.apply = [{
        id: 1,
        name: $filter('translate')('0206')
      },
      {
        id: 2,
        name: $filter('translate')('0205')
      },
      {
        id: 3,
        name: $filter('translate')('0207')
      }
    ];
    vm.diagnostic = [{
        id: 2,
        name: $filter('translate')('0240')
      },
      {
        id: 3,
        name: $filter('translate')('0241')
      },
      {
        id: 1,
        name: $filter('translate')('0239')
      }
    ];
    // función para adicionar o eliminar elementos del JSON
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //metodo para consultar la llave de configuración del formato de fecha
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
        }
      });
    }
    //metodo para consultar una lista de cometarios
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return commentDS.getComment(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data;
        if (data.data.length > 0) {
          vm.data = vm.removeData(data);
        }
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //método para obtener el detalle del comentario seleccionado
    function getById(id, index, form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.detail = [];
      vm.nameRepeat = false;
      vm.abbreviationRepeat = false;
      vm.loadingdata = true;
      form.$setUntouched();
      return commentDS.getById(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          data.data.apply = data.data.apply.toString();
          vm.detail = data.data;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //método para validar si es un nuevo elemento o un cambio de un elemento existente
    function save(form) {
      form.$setUntouched();
      if (vm.texareaHtml !== undefined) {
        vm.detail.message = vm.texareaHtml.replace(/span/g, "font").replace(/<br><br>/g, '<br>');
      } else {
        vm.detail.message = vm.detail.message.replace(/span/g, "font");
        vm.detail.message = vm.detail.message.replace(new RegExp("<p>", 'g'), "<div>");
        vm.detail.message = vm.detail.message.replace(new RegExp("</p>", 'g'), "</div>");
      }
      vm.detail.apply = Number(vm.detail.apply);
      vm.detail.message = vm.detail.message.replace(/span/g, "font");
      vm.detail.message = vm.detail.message.replace(new RegExp("<p>", 'g'), "<div>");
      vm.detail.message = vm.detail.message.replace(new RegExp("</p>", 'g'), "</div>");
      if (vm.detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
      vm.texareaHtml = undefined;
    }
    //método para guardar cambios de un comentario existente
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.detail.user.id = auth.id;
      vm.loadingdata = true;
      return commentDS.update(auth.authToken, vm.detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //método para guardar un nuevo  comentario
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return commentDS.insert(auth.authToken, vm.detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.detail = data.data;
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    // Metodo para permitir editar el detalle del comentario
    function edit() {
      vm.stateButton('edit');
    }
    // Metodo para crear un nuevo comentario
    function add(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.detail = {
        'id': null,
        'code': '',
        'message': '',
        'state': true,
        'apply': 1,
        'lastTransaction': '',
        'user': {
          'id': auth.id
        },
      };
      vm.stateButton('add');
    }
    // Metodo para cancelar un comentario no guardado
    function cancel(form) {
      form.$setUntouched();
      vm.nameRepeat = false;
      if (vm.detail.id === null || vm.detail.id === undefined) {
        vm.detail = [];
      } else {
        vm.getById(vm.detail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    // Metodo para mostrar la modal de confirmación del cambio de estado
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/test/comment/comment.mrt';
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
    // Metódo que valida si el usuario se encuentra logueado
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    // Metódo que valida el estado de los botones
    function stateButton(state) {
      vm.showInvalidRange = false;
      vm.showInvalidRangemin = false;
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.detail.id === null || vm.detail.id === undefined ? true : false;
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
        vm.isDisabledState = true;
        setTimeout(function () {
          document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledState = false;
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

      }
    }
    // Metódo que muestra una ventana modal cuando hay un error en el servicio
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'Code') {
              vm.codeRepeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.codeRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    // Metódo que valida la cantidad maxima de cararteres escritos em textarea
    function keyPressTextarea($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      var c = '';
      if (keyCode === 13) {
        var target = '<' + $event.target.lastChild.localName + '>';
        var n = document.getElementById('message').innerHTML.split(target).length;
        var arr = document.getElementById('message').innerHTML.split(target);
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
    // Metódo que inicializa la pagina
    function init() {
      vm.stateButton("init")
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
