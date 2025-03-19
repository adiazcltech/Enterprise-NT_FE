/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.description')
    .controller('descriptionController', descriptionController);

  descriptionController.$inject = [
    'localStorageService',
    'logger',
    'caseDS',
    'macroscopyDS',
    'audioDS',
    '$filter',
    '$state',
    'moment',
    '$scope',
    '$q',
    '$rootScope'
  ];

  function descriptionController(
    localStorageService,
    logger,
    caseDS,
    macroscopyDS,
    audioDS,
    $filter,
    $state,
    moment,
    $scope,
    $q,
    $rootScope
  ) {

    //Variables generales
    var vm = this;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('3182');
    $rootScope.helpReference = '08.Pathology/macroscopy.htm';
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.modalError = modalError;
    $scope.collapsed = false;
    vm.filterRange = '0';
    vm.rangeInit = moment().format('YYYYMMDD');
    vm.rangeEnd = moment().format('YYYYMMDD');
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
    vm.stateFilters = 3;
    vm.dataCases = [];
    vm.case = null;
    vm.filter = {};
    vm.setFilter = setFilter;
    vm.selectCase = selectCase;
    vm.loadpreviousfilter = loadpreviousfilter;
    vm.stateButton = stateButton;
    vm.templates = [];
    vm.removeData = removeData;
    vm.transcription = null;
    vm.save = save;
    vm.saveMacroscopy = saveMacroscopy;
    vm.updateMacroscopy = updateMacroscopy;
    /*Grabadora*/
    vm.microphonePermission = false;
    vm.recordingPathologist = false;
    vm.recording = recording;
    vm.initAudio = initAudio;
    vm.pausedRecording = false;
    vm.pauseRecord = pauseRecord;
    vm.resumeRecord = resumeRecord;
    vm.stopRecord = stopRecord;
    vm.blobAudio = null;
    vm.saveFile = saveFile;
    vm.converBlobToBase64 = converBlobToBase64;
    vm.confirmSaved = confirmSaved;
    vm.confirmTranscription = confirmTranscription;
    vm.confirmAuthorization = confirmAuthorization;
    vm.validateConfirmation = validateConfirmation;
    vm.authorizationNotRequired = authorizationNotRequired;
    vm.undo = undo;
    vm.modalfilter = modalfilter;
    vm.form = null;
    vm.showtimer = true;
    vm.base64 = "";
    vm.limit = 60000;


    function modalfilter() {
      vm.showModalFilter = true;
      setTimeout(function () {
        UIkit.modal("#modalfilter-date", {
          keyboard: false,
          bgclose: false,
          center: true,
        }).show();
      }, 30);
    }

    function validateConfirmation(Form) {
      if (vm.srcAudio) {
        vm.form = Form;
        UIkit.modal("#modalConfirmTranscription").show();
      } else {
        logger.error($filter('translate')('3179'));
      }
    }

    function authorizationNotRequired() {
      UIkit.modal("#modalConfirmAuthorization").hide();
      vm.macroscopy.authorization = 0;
      vm.macroscopy.authorizer = null;
      vm.save();
    }

    function confirmAuthorization() {
      UIkit.modal("#modalConfirmAuthorization").hide();
      vm.macroscopy.authorization = 1;
      vm.macroscopy.authorizer = auth;
      vm.save();
    }

    function confirmTranscription() {
      vm.transcription = 1;
      UIkit.modal("#modalConfirmTranscription").hide();
      UIkit.modal("#modalConfirmAuthorization").show();
    }

    function undo() {
      vm.form = null;
      vm.macroscopy = null;
      vm.blobAudio = null;
      vm.base64 = "";
      vm.srcAudio = null;
      vm.case = null;
      vm.setFilter();
    }

    function confirmSaved(Form, type) {
      if (type === 0 && !Form.$valid) {
        logger.error($filter('translate')('3206'));
        return false;
      }
      vm.macroscopy.draft = type;
      vm.form = Form;
      UIkit.modal("#modalConfirmSave").show();
    }

    function saveMacroscopy() {
      vm.loading = true;
      macroscopyDS.post(auth.authToken, vm.macroscopy).then(function (data) {
        if (data.data.templates.length > 0) {
          vm.macroscopy = vm.removeData(data.data);
        } else {
          vm.macroscopy.templates = vm.templates;
        }
        vm.undo();
        vm.loading = false;
        vm.stateButton('edit');
        logger.success($filter('translate')('0149'));
      }, function (error) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loading = false;
      });
    }

    function updateMacroscopy() {
      vm.loading = true;
      macroscopyDS.put(auth.authToken, vm.macroscopy).then(function (data) {
        if (data.data.templates.length > 0) {
          vm.macroscopy = vm.removeData(data.data);
        } else {
          vm.macroscopy.templates = vm.templates;
        }
        vm.undo();
        vm.loading = false;
        vm.stateButton('edit');
        logger.success($filter('translate')('0149'));
      }, function (error) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loading = false;
      });
    }

    function save() {
      if (!vm.form.$valid) {
        vm.macroscopy.templates = [];
      }
      vm.loading = true;
      vm.macroscopy.pathologist = auth;
      vm.macroscopy.casePat = vm.case.id;
      vm.macroscopy.transcription = vm.transcription == null ? 0 : vm.transcription;
      vm.macroscopy.authorization = vm.macroscopy.authorization === null || vm.macroscopy.authorization === undefined ? 0 : vm.macroscopy.authorization;

      if (vm.microphonePermission && vm.audio.getBlob()) {
        vm.saveFile().then(function (resp) {
          if (resp) {
            if (resp.status === 200) {
              vm.macroscopy.audio = resp.data;
              if (vm.macroscopy.id) {
                vm.updateMacroscopy();
              } else {
                vm.saveMacroscopy();
              }
            }
          }
          vm.loading = false;
        }, function (err) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }).catch(function (resp) {
          vm.loading = false;
        });
      } else {
        vm.macroscopy.audio = vm.macroscopy.audio;
        if (vm.macroscopy.id) {
          vm.updateMacroscopy();
        } else {
          vm.saveMacroscopy();
        }
      }

    }

    function saveFile() {
      var deferred = $q.defer();
      try {
        var name = JSON.parse(JSON.stringify(moment().format('X')));
        var extension = ".mp3";
        var path = "/pathology/macroscopy/" + name + extension;
        vm.converBlobToBase64(vm.audio.getBlob()).then(function (response) {
          if (response) {
            var parameters = { 'path': path, 'file': vm.base64 };
            audioDS.uploadAudio(parameters).then(function (response) {
              if (response.status === 200) {
                var file = {
                  id: vm.macroscopy.audio ? vm.macroscopy.audio.id : '',
                  name: name,
                  extension: extension,
                  url: path,
                  userCreated: auth
                };
                if (file.id === '' || file.id === 0 || file.id === undefined) {
                  audioDS.post(auth.authToken, file).then(function (resp) {
                    deferred.resolve(resp);
                  }, function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  });
                } else {
                  file.userUpdated = auth;
                  audioDS.put(auth.authToken, file).then(function (resp) {
                    deferred.resolve(resp);
                  }, function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                    vm.loading = false;
                  });
                }
              }
            },
              function (error) {
                logger.error($filter('translate')('3047'));
              });
          }
        });
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }

    function converBlobToBase64(blob) {
      var deferred = $q.defer();
      try {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var dataUrl = reader.result;
          vm.base64 = dataUrl.split(',')[1];
          deferred.resolve(vm.base64);
        }
      } catch (e) {
        deferred.reject(e);
        throw e;
      }
      return deferred.promise;
    }

    function initAudio(stream) {
      vm.audio = RecordRTC(stream, {
        type: 'audio',
        timeSlice: vm.limit,
        recorderType: StereoAudioRecorder
      });
    }

    function stopRecord() {
      vm.audio.stopRecording(function () {
        vm.blobAudio = vm.audio.getBlob();
        if (vm.blobAudio) {
          vm.srcAudio = URL.createObjectURL(vm.blobAudio);
        }
      });
      $scope.$broadcast('timer-stop');
      vm.recordingPathologist = false;
      vm.pausedRecording = false;
    }

    function resumeRecord() {
      vm.audio.resumeRecording();
      vm.pausedRecording = false;
      $scope.$broadcast('timer-resume');
    }

    function pauseRecord() {
      vm.audio.pauseRecording();
      vm.pausedRecording = true;
      $scope.$broadcast('timer-stop');
    }

    function recording() {
      vm.srcAudio = null;
      vm.blobAudio = null;
      vm.audio.reset();
      vm.audio.startRecording();
      $scope.$broadcast('timer-start');
      vm.recordingPathologist = true;
      setTimeout(function() {
        vm.stopRecord();
      }, vm.limit);
    }

    function selectCase(casePat) {
      vm.loading = true;
      vm.case = casePat;
      vm.templates = [];
      vm.edit = false;
      vm.transcription = null;
      $scope.$broadcast('timer-reset');
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return macroscopyDS.getByCase(auth.authToken, vm.case.id).then(function (data) {
        if (data.status === 200) {
          vm.macroscopy = data.data.templates.length > 0 ? vm.removeData(data.data) : '';
          vm.templates = vm.macroscopy.templates;
          vm.transcription = vm.macroscopy.transcription;
          if (!vm.macroscopy) {
            logger.error($filter('translate')('3181'));
            vm.case = null;
          } else {
            vm.srcAudio = vm.macroscopy.audio.url;
            if (vm.macroscopy.id) {
              vm.stateButton('edit');
            } else {
              vm.stateButton('new');
            }
          }
        }
        vm.loading = false;
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }

    function removeData(macroscopy) {
      var validateFields = _.filter(macroscopy.templates, function (o) { return o.fields.length === 0; });
      if (validateFields.length > 0) {
        return false;
      }
      macroscopy.templates.forEach(function (value) {
        value.fields = _.orderBy(value.fields, ['order'], ['asc']);
        value.fields.forEach(function (val) {
          if (val.type === 2) {
            val.value = parseInt(val.value);
          }
        });
      });
      return macroscopy;
    }

    function loadpreviousfilter() {
      if (vm.filter.filterRange !== undefined) {
        vm.rangeinittemp = vm.filter.filterRange === '0' ? vm.filter.init + 1 : vm.filter.firstCase + 1;
        vm.rangeendtemp = vm.filter.filterRange === '0' ? vm.filter.end - 1 : vm.filter.lastCase - 1;
        vm.filterRange = vm.filter.filterRange;
      }
      vm.stateFilters = 2;
    }

    /** Funcion configura el filtro principal para la consulta de los casos */
    function setFilter() {
      UIkit.modal('#modalfilter-date').hide();
      vm.showModalFilter = false;
      vm.loading = true;
      vm.stateFilters = 1;
      //Rango de órdenes
      vm.filter.filterRange = vm.filterRange;
      vm.filter.firstCase = vm.filterRange === '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye el primer caso
      vm.filter.lastCase = vm.filterRange === '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye el ultimo caso
      //Rango de fecha de ingreso
      vm.filter.init = vm.filterRange !== '0' ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera fecha
      vm.filter.end = vm.filterRange !== '0' ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  fecha
      vm.filterinfo.textinit = vm.filterRange === '0' ? $filter('translate')('0075') : $filter('translate')('0073'),
        vm.filterinfo.valueinit = vm.filterRange === '0' ? moment(vm.rangeInit).format(vm.formatDateAge) : vm.rangeInit.substring(3),
        vm.filterinfo.textend = vm.filterRange === '0' ? $filter('translate')('0076') : $filter('translate')('0074'),
        vm.filterinfo.valueend = vm.filterRange === '0' ? moment(vm.rangeEnd).format(vm.formatDateAge) : vm.rangeEnd.substring(3),
        vm.filterinfo.valuefilterstudies = vm.numfilter === undefined || vm.numfilter === 0 ? 'N/A' : vm.filterinfo.valuefilterstudies,
        //Lista de areas
        vm.filter.studyTypeList = [];
      vm.filter.numfilter = vm.numfilter;
      switch (vm.numfilter) {
        case 1:
          vm.filterinfo.valuefilterstudies = vm.liststudies.length;
          vm.filter.studyTypeList = vm.liststudies;
          break;
        default:
          vm.filterinfo.valuefilterstudies = 'N/A'
      }
      vm.filter.areas = [2];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return caseDS.getFilterCases(auth.authToken, vm.filter).then(function (data) {
        if (data.status === 200) {
          vm.dataCases = data.data;
          vm.previousfilter = JSON.stringify(vm.filter);
          vm.loading = false;
        } else {
          vm.loading = false;
          UIkit.modal('#nofoundfilter').show();
          vm.dataCases = [];
        }
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
        vm.stateFilters = 3;
      });
    }

    //** Metodo que evalua los estados de los botones**//
    function stateButton(state) {
      if (state === 'new') {
        vm.disabled = false;
        vm.disabledSave = false;
        vm.disabledEdit = true;
        vm.disabledCancel = true;
      }
      if (state === 'edit') {
        vm.disabled = true;
        vm.disabledSave = true;
        vm.disabledEdit = false;
        vm.disabledCancel = true;
      }
      if (state === 'update') {
        vm.disabled = false;
        vm.disabledSave = false;
        vm.disabledEdit = true;
        vm.disabledCancel = false;
      }
    }

    vm.startvoice = startvoice;
    function startvoice() {
      var Jarvis = new Artyom();
      Jarvis.fatality();
      vm.voice = [];
      vm.commentvoice = '';
      Jarvis.initialize({
        lang: $filter('translate')('0000') === "esCo" ? "es-ES" : "en-US",
        debug: false, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal" // This parameter is not required as it will be normal by default
      });

      vm.userDictation = Jarvis.newDictation({
        continuous: true, // Enable continuous if HTTPS connection
        onResult: function (text) {
          // Do something with the text
          if (text === "") {
            vm.commentvoice = vm.commentvoice + " " + vm.voice[vm.voice.length - 1];
            vm.probando = text;
           // vm.voice.add(text)
            // vm.commentOutHtmldiagnostic[vm.id] = vm.commentvoice
          } else {
            // vm.commentOutHtmldiagnostic[vm.id] = text;
            vm.probando = text;
            vm.voice.add(text)
          }
          $scope.$apply();
        },
        onStart: function () {
          console.log("Dictation started by the user");
        },
        onEnd: function () {
          console.log("Dictation stopped by the user");
        }
      });
      vm.showvoice = true;
      vm.userDictation.start();
    }
    vm.stopvoice = stopvoice;
    function stopvoice() {
      vm.showvoice = false;
      vm.userDictation.stop();
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    $scope.$on('onLastRepeat', function (scope, element, attrs) {
      altair_uikit.reinitialize_grid_margin();
    });

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    vm.transcription=transcription;
    function transcription(commentvoice) {
      vm.macroscopy.templates;

    }

    function init() {
      tinymce.init({
        setup: function (ed) {
          ed.addIcon('custom-icon', '<img src="images/pathology/macroscopy/studies.png" style="width: 16px; height: 16px;">')
        }
      });

      tinymce.PluginManager.add("dictation", function (editor) {
        // Add a button that opens a window
        editor.addButton("dictation", {
          icon: 'custom-icon',
          tooltip: 'Activar comando de voz',
          onclick: function () {
            vm.startvoice();
            UIkit.modal("#modalsintesis", {
              keyboard: false,
              bgclose: false,
              center: true,
            }).show();

          },
        });
      });


       vm.editor = {
        menubar: false,
        language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
        plugins: [
          'link',
          'lists',
          'autolink',
          'anchor',
          'textcolor',
          'charmap',
          'dictation'
        ],
        toolbar: [
          'undo redo | dictation bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
        ],
        resize: false,
        height: 'calc(100vh - 338px)',
        readonly: false,
        mode: "design"
      }; 

      // vm.editor = {
      //   menubar: false,
      //   language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      //   plugins: [
      //     'link',
      //     'lists',
      //     'autolink',
      //     'anchor',
      //     'textcolor',
      //     'charmap'
      //   ],
      //   toolbar: [
      //     'undo redo |  bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
      //   ],
      //   resize: false,
      //   height: 'calc(100vh - 338px)',
      //   readonly: false,
      //   mode: "design"
      // };



      vm.filterinfo = {
        'textinit': $filter('translate')('0075'),
        'textend': $filter('translate')('0076'),
        'valueinit': 'N/A',
        'valueend': 'N/A',
        'valuefilterstudies': 'N/A'
      }

      if (location.href.search('http://localhost:3000') === -1 && location.protocol !== "https:") {
        logger.error($filter('translate')('3044'));
      } else {
        if (navigator.mediaDevices.getUserMedia === navigator.mediaDevices.getUserMedia ||
          navigator.mediaDevices.webkitGetUserMedia ||
          navigator.mediaDevices.mozGetUserMedia ||
          navigator.mediaDevices.msGetUserMedia) {
          navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          })
            .then(function (mediaStream) {
              vm.microphonePermission = true;
              vm.initAudio(mediaStream);
            })
            .catch(function (error) {
              logger.warning($filter('translate')('3044'));
            });
        }
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
