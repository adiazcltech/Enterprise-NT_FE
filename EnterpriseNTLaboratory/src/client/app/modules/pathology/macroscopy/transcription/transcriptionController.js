/* jshint ignore:start */
(function() {
  'use strict';

  angular
      .module('app.transcription')
      .controller('transcriptionController', transcriptionController);

  transcriptionController.$inject = ['localStorageService', 'logger', 'macroscopyDS', '$filter', '$state', '$rootScope'];

  function transcriptionController(localStorageService, logger, macroscopyDS, $filter, $state, $rootScope)
  {

  //Variables generales
  var vm = this;
  $rootScope.menu = true;
  $rootScope.NamePage = $filter('translate')('3183');
  $rootScope.helpReference = '08.Pathology/transcription.htm';
  var auth = localStorageService.get('Enterprise_NT.authorizationData');
  vm.formatDate = localStorageService.get('FormatoFecha');
  vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
  vm.isAuthenticate = isAuthenticate;
  vm.init = init;
  vm.modalError = modalError;
  vm.loading = true;
  vm.getListCases = getListCases;
  vm.getDetail = getDetail;
  vm.removeData = removeData;
  vm.stateButton = stateButton;
  vm.saveTranscription = saveTranscription;
  vm.getAuthorizations = getAuthorizations;
  vm.transcriptionMode = 1;
  vm.authorizationMode = 0;
  vm.selectTranscription = selectTranscription;
  vm.selectAuthorization = selectAuthorization;
  vm.undo = undo;
  vm.confirmSaved = confirmSaved;
  vm.saveAuthorization = saveAuthorization;
  vm.save = save;
  vm.editor = {
    menubar: false,
    language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
    plugins: [
      'link',
      'lists',
      'autolink',
      'anchor',
      'textcolor',
      'charmap'
    ],
    toolbar: [
      'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
    ],
    resize: false,
    height: 'calc(100vh - 338px)',
    readonly: false,
    mode: "design"
  };

  function confirmSaved(Form, type) {
    vm.macroscopy.draft = type;
    vm.form = Form;
    UIkit.modal("#modalConfirmSave").show();
  }

  function undo() {
    vm.selected = null;
    vm.casePat = null;
    vm.macroscopy = null;
    vm.srcAudio = null;
  }

  function selectAuthorization() {
    if(vm.transcriptionMode === 1 && vm.authorizationMode === 0) {
      vm.transcriptionMode = 0;
      vm.authorizationMode = 1;
      vm.undo();
      vm.getAuthorizations();
    }
  }

  function selectTranscription() {
    if(vm.transcriptionMode === 0 && vm.authorizationMode === 1) {
      vm.authorizationMode = 0;
      vm.transcriptionMode = 1;
      vm.undo();
      vm.getListCases();
    }
  }

  function save() {
    if(vm.transcriptionMode === 1) {
      vm.saveTranscription();
    } else {
      if(vm.authorizationMode === 1) {
        vm.saveAuthorization();
      }
    }
  }

  function saveAuthorization() {
    if(vm.form.$valid) {
      vm.loading = true;
      vm.macroscopy.transcriber = auth;
      macroscopyDS.authorization(auth.authToken, vm.macroscopy).then(function(data) {
        vm.loading = false;
        logger.success($filter('translate')('0149'));
        vm.getListCases();
        vm.getAuthorizations();
        vm.undo();
      }, function(error) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loading = false;
      });
    }
  }

  function saveTranscription() {
    if(vm.form.$valid) {
      vm.loading = true;
      vm.macroscopy.transcriber = auth;
      macroscopyDS.transcription(auth.authToken, vm.macroscopy).then(function(data) {
        vm.loading = false;
        logger.success($filter('translate')('0149'));
        vm.getListCases();
        vm.getAuthorizations();
        vm.undo();
      }, function(error) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loading = false;
      });
    }
  }

  function removeData(macroscopy) {
    var validateFields = _.filter(macroscopy.templates, function(o) { return o.fields.length === 0; });
    if(validateFields.length > 0) {
      return false;
    }
    macroscopy.templates.forEach(function (value) {
      value.fields = _.orderBy(value.fields, ['order'], ['asc']);
      value.fields.forEach( function (val) {
        if(val.type === 2) {
          val.value = parseInt(val.value);
        }
      });
    });
    return macroscopy;
  }

  function getDetail(casePat) {
    casePat.orderNumber = casePat.numberOrder;
    vm.casePat = casePat;
    vm.casePat.id = casePat.casePat;
    vm.selected = vm.casePat.casePat;
    return macroscopyDS.getByCase(auth.authToken, vm.casePat.casePat).then(function (data) {
      if (data.status === 200) {
        vm.macroscopy = data.data.templates.length > 0 ? vm.removeData(data.data): '';
        vm.templates = vm.macroscopy.templates;
        if(!vm.macroscopy) {
          logger.error($filter('translate')('3181'));
          vm.casePat = null;
        } else {
          vm.srcAudio = vm.macroscopy.audio.url;
          if(vm.macroscopy.id) {
            vm.stateButton('edit');
          }
        }
      }
      vm.loading = false;
    }, function (error) {
      vm.loading = false;
      vm.modalError(error);
    });
  }

  function getAuthorizations() {
    vm.loading = true;
    vm.listAuthorizations = [];
    return macroscopyDS.getAuthorizations(auth.authToken, auth.id).then(function (data) {
      vm.loading = false;
      if (data.status === 200) {
        vm.listAuthorizations = _.orderBy(data.data, 'transcribedAt', 'desc');
      } else {
        logger.info($filter('translate')('3197'));
      }
    }, function (error) {
      if (error.data === null) {
        vm.modalError(error);
      }
    });
  }

  function getListCases() {
    vm.loading = true;
    vm.listCases = [];
    return macroscopyDS.getTranscription(auth.authToken).then(function (data) {
      vm.loading = false;
      if (data.status === 200) {
        vm.listCases = _.orderBy(data.data, 'createdAt', 'desc');
      } else {
        logger.info($filter('translate')('3185'));
      }
    }, function (error) {
      if (error.data === null) {
        vm.modalError(error);
      }
    });
  }

  //** Metodo que evalua los estados de los botones**//
  function stateButton(state) {
    if (state === 'edit') {
      vm.disabled = true;
      vm.disabledSave = true;
      vm.disabledEdit = false;
    }
    if (state === 'update') {
      vm.disabled = false;
      vm.disabledSave = false;
      vm.disabledEdit = true;
    }
  }

  //** Método para sacar el popup de error**//
  function modalError(error) {
    vm.Error = error;
    vm.ShowPopupError = true;
  }

  function isAuthenticate() {
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    if (auth === null || auth.token) {
      $state.go('login');
    } else {
      vm.init();
    }
  }

  function init() {
    vm.getListCases();
    vm.getAuthorizations();
  }

  vm.isAuthenticate();
}
})();
/* jshint ignore:end */
