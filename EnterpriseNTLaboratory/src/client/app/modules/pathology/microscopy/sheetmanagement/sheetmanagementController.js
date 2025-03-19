/* jshint ignore:start */
(function() {
    'use strict';

    angular
        .module('app.sheetmanagement')
        .controller('sheetmanagementController', sheetmanagementController);

    sheetmanagementController.$inject = [
        'common',
        'localStorageService',
        'logger',
        'caseDS',
        'sheetDS',
        'fileDS',
        'annotationDS',
        'colorationDS',
        'paraffinBlockDS',
        'requestDS',
        'meetingPathologistDS',
        'userDS',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$filter',
        '$state',
        'moment',
        '$timeout',
        "$q",
        "$scope",
        '$rootScope'
    ];

    function sheetmanagementController(
        common,
        localStorageService,
        logger,
        caseDS,
        sheetDS,
        fileDS,
        annotationDS,
        colorationDS,
        paraffinBlockDS,
        requestDS,
        meetingPathologistDS,
        userDS,
        DTOptionsBuilder,
        DTColumnDefBuilder,
        $filter,
        $state,
        moment,
        $timeout,
        $q,
        $scope,
        $rootScope
    ) {

        var vm = this;
        $rootScope.menu = true;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.loadCases = loadCases;
        vm.recordPathologist = recordPathologist;
        vm.stopRecordPathologist = stopRecordPathologist;
        vm.pauseRecordPathologist = pauseRecordPathologist;
        vm.resumeRecordPathologist = resumeRecordPathologist;
        vm.handlerFunction = handlerFunction;
        vm.loadSheets = loadSheets;
        vm.saveAnnotation = saveAnnotation;
        vm.converBlobToBase64 = converBlobToBase64;
        vm.saveFile = saveFile;
        vm.resetRecordPathologist = resetRecordPathologist;
        vm.getMeetingPathologistCase = getMeetingPathologistCase;
        vm.hasMeetingPathologist = false;
        vm.loadAnnotation = loadAnnotation;
        vm.editAnnotation = editAnnotation;
        vm.getColoration = getColoration;
        vm.colorations = [];
        vm.coloration = null;
        vm.getParaffinBlock = getParaffinBlock;
        vm.paraffinBlocks = [];
        vm.paraffinBlock = null;
        vm.quantity = null;
        vm.getRequest = getRequest;
        vm.saveRequest = saveRequest;
        vm.editRequest = editRequest;
        vm.resetRequest = resetRequest;
        vm.requests = [];
        vm.requestSelected = null;
        vm.annotationEditing = null;
        vm.isEditAnnotation = false;
        vm.base64 = "";
        vm.caseSelected = null;
        vm.sheetSelected = null;
        vm.cases = null;
        vm.dateFormat = localStorageService.get('FormatoFecha');
        vm.dateFormatMoment = localStorageService.get('FormatoFecha').toUpperCase();
        vm.pathologistAudiosList = [];
        vm.recordingPathologist = false;
        vm.pausedRecordPathologist = false;
        vm.microphonePermission = false;
        vm.speech = new webkitSpeechRecognition();
        vm.speech.continuous = true;
        vm.speech.interimResults = true;
        vm.speech.lang = 'es-ES';
        vm.annotation = '';
        vm.interim_transcript = '';
        vm.final_transcript = '';
        vm.printAnnotation = null;
        vm.blobAudiopathologist = null;
        vm.editorAnnotation = {
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
            height: 313,
            readonly: false,
            mode: "design"
        };
        vm.language = {
            "sProcessing": $filter('translate')('3078') + '...',
            "sLengthMenu": $filter('translate')('3079') + " _MENU_ " + $filter('translate')('3080'),
            "sZeroRecords": $filter('translate')('3081'),
            "sEmptyTable": $filter('translate')('3082'),
            "sInfo": $filter('translate')('3083') + " _START_ " + $filter('translate')('3084') + " _END_ " + $filter('translate')('3085') + " _TOTAL_ " + $filter('translate')('3080'),
            "sInfoEmpty": $filter('translate')('3086'),
            "sInfoFiltered": "(" + $filter('translate')('3087') + " _MAX_ " + $filter('translate')('3080') + ")",
            "sInfoPostFix": "",
            "sSearch": $filter('translate')('3088') + ":",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": $filter('translate')('3089') + "...",
            "oPaginate": {
                "sFirst": $filter('translate')('3090'),
                "sLast": $filter('translate')('3091'),
                "sNext": $filter('translate')('3092'),
                "sPrevious": $filter('translate')('3093')
            },
            "oAria": {
                "sSortAscending": ": " + $filter('translate')('3094'),
                "sSortDescending": ": " + $filter('translate')('3095')
            }
        }
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withOption('lengthChange', false)
            .withOption('order', [
                [0, 'asc']
            ])
            .withOption('scrollCollapse', true)
            .withOption("scrollY", "300px")
            .withLanguage(vm.language)
            .withOption('rowCallback', rowCallback);
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notVisible(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
        ];
        vm.getMeetingPathologist = getMeetingPathologist;
        vm.getUsers = getUsers;
        vm.saveMeetingPathologist = saveMeetingPathologist;
        vm.resetMeetingPathologist = resetMeetingPathologist;
        vm.meetingPathologist = [];
        vm.meetingEdit = null;
        vm.meetingPathologisModel = {
            name: null,
            date: null,
            participants: []
        };
        vm.users = [];
        vm.newMeetingPathologist = false;
        vm.min = moment().format();
        vm.selectOptions = {
            placeholder: $filter('translate')('3058'),
            dataTextField: "selectName",
            dataValueField: 'id',
            valuePrimitive: true,
            autoBind: false,
        };
        vm.listUsers = [];
        vm.selectMeeting = selectMeeting;
        vm.sendCasePathologistsMeeting = sendCasePathologistsMeeting;


        vm.tinymce_content = '';
        vm.editorDiagnosis = JSON.parse(JSON.stringify(vm.editorAnnotation));
        vm.editorDiagnosis.height = 365;

        vm.boardPathologists = [
            { "id": 1, "user": { "name": "Patologo", "lastname": "1" }, "annotation": "Nota del patólogo 1", "date": "2020-01-12" },
            { "id": 2, "user": { "name": "Patologo", "lastname": "2" }, "annotation": "Nota del patólogo 2", "date": "2020-01-13" },
            { "id": 3, "user": { "name": "Patologo", "lastname": "3" }, "annotation": "Nota del patólogo 3", "date": "2020-01-14" },
            { "id": 4, "user": { "name": "Patologo", "lastname": "4" }, "annotation": "Nota del patólogo 4", "date": "2020-01-15" },
            { "id": 5, "user": { "name": "Patologo", "lastname": "5" }, "annotation": "Nota del patólogo 5", "date": "2020-01-16" },
            { "id": 6, "user": { "name": "Patologo", "lastname": "6" }, "annotation": "Nota del patólogo 6", "date": "2020-01-17" },
            { "id": 7, "user": { "name": "Patologo", "lastname": "7" }, "annotation": "Nota del patólogo 7", "date": "2020-01-18" },
            { "id": 8, "user": { "name": "Patologo", "lastname": "8" }, "annotation": "Nota del patólogo 8", "date": "2020-01-19" }
        ];

        function sendCasePathologistsMeeting() {
            vm.loadingdata = true;
            var meetingByCase = {
                casePat: vm.caseSelected,
                meetingPathologist: vm.meetingEdit,
                userCreated: auth
            }
            meetingPathologistDS.postByCase(auth.authToken, meetingByCase).then(function(response) {
                    $timeout(function() {
                        angular.element(document.getElementById('close_meeting_pathologists_new')).trigger('click');
                    }, 0);
                    vm.hasMeetingPathologist = true;
                    logger.success($filter('translate')('3101'));
                    vm.loadingdata = false;
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        function resetMeetingPathologist() {
            vm.meetingPathologisModel = {
                name: null,
                date: null,
                participants: []
            };
            vm.meetingEdit = null;
        }

        function saveMeetingPathologist(isEdit) {
            if (!vm.meetingPathologisModel.name || !vm.meetingPathologisModel.date || vm.meetingPathologisModel.participants.length === 0) { return; }
            vm.loadingdata = true;
            var participants = [];
            _.forEach(vm.meetingPathologisModel.participants, function(value) {
                var user = _.find(vm.users, function(o) { return o.id === value });
                participants.push({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName
                });
            });
            var meetingPathologist = vm.meetingPathologisModel;
            meetingPathologist.participants = participants;
            meetingPathologist.userCreated = auth;
            if (isEdit) {
                meetingPathologist.id = vm.meetingEdit.id;
                meetingPathologist.userUpdated = auth;
                meetingPathologistDS.put(auth.authToken, meetingPathologist).then(function(response) {
                        var index = _.findIndex(vm.meetingPathologist, function(o) { return o.id === vm.meetingEdit.id });
                        _.pullAt(vm.meetingPathologist, [index]);
                        vm.meetingPathologist.push(response.data);
                        vm.resetMeetingPathologist();
                        vm.newMeetingPathologist = false;
                        vm.loadingdata = false;
                        logger.success($filter('translate')('3096'));
                    },
                    function(error) {
                        vm.Error = error;
                        vm.ShowPopupError = true;
                    });
            } else {
                meetingPathologistDS.post(auth.authToken, meetingPathologist).then(function(response) {
                        vm.meetingPathologist.push(response.data);
                        vm.resetMeetingPathologist();
                        vm.newMeetingPathologist = false;
                        logger.success($filter('translate')('3077'));
                        vm.loadingdata = false;
                    },
                    function(error) {
                        vm.Error = error;
                        vm.ShowPopupError = true;
                    });
            }
        }

        function selectMeeting(meeting) {
            if (meeting) {
                vm.newMeetingPathologist = false;
                vm.meetingEdit = _.find(vm.meetingPathologist, function(o) { return o.id === meeting.id });
                vm.meetingPathologisModel.name = vm.meetingEdit.name;
                vm.meetingPathologisModel.date = moment(vm.meetingEdit.date).format();
                var listUsers = [];
                _.forEach(vm.meetingEdit.participants, function(value) {
                    if (!_.find(listUsers, function(o) { return o.id === value.id }) && value.id != 0) {
                        listUsers.push(value.id);
                    }
                });
                vm.meetingPathologisModel.participants = listUsers;
            }
        }

        function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    vm.requestSelected = _.find(vm.requests, function(o) { return String(o.id) === aData[0] });
                    vm.coloration = vm.requestSelected.coloration;
                    vm.paraffinBlock = vm.requestSelected.paraffinBlock;
                    vm.quantity = vm.requestSelected.quantity;
                });
            });
            return nRow;
        }

        function handlerFunction(stream) {
            vm.pathologistAudio = RecordRTC(stream, {
                type: 'audio',
                recorderType: StereoAudioRecorder,
                mimeType: 'audio/wav'
            });
        }

        function recordPathologist() {
            vm.srcPathologistAudio = null;
            vm.blobAudiopathologist = null;
            vm.pathologistAudio.reset();
            vm.pathologistAudio.startRecording();
            vm.speech.start();
            $scope.$broadcast('timer-start');
            vm.recordingPathologist = true;
            vm.interim_transcript = '';
            vm.annotation = '';
        }

        function pauseRecordPathologist() {
            vm.pathologistAudio.pauseRecording();
            vm.pausedRecordPathologist = true;
            $scope.$broadcast('timer-stop');
        }

        function resumeRecordPathologist() {
            vm.pathologistAudio.resumeRecording();
            vm.pausedRecordPathologist = false;
            $scope.$broadcast('timer-resume');
        }

        function stopRecordPathologist() {
            vm.pathologistAudio.stopRecording(function() {
                vm.blobAudiopathologist = vm.pathologistAudio.getBlob();
                if (vm.blobAudiopathologist) {
                    vm.srcPathologistAudio = URL.createObjectURL(vm.blobAudiopathologist);
                }
            });
            vm.speech.stop();
            $scope.$broadcast('timer-stop');
            vm.recordingPathologist = false;
            vm.pausedRecordPathologist = false;
        }

        vm.speech.onresult = function(event) {
            if (!vm.pausedRecordPathologist) {
                vm.annotation = vm.interim_transcript;
                vm.final_transcript = '';
                for (var i = 0; i < event.results.length; i++) {
                    vm.annotation += event.results[i][0].transcript;
                    vm.final_transcript += event.results[i][0].transcript;
                }
            }
        };

        vm.speech.onerror = function(event) {
            if (event.error === 'no-speech') {
                logger.warning($filter('translate')('3097'));
            } else {
                logger.error($filter('translate')('3046'));
            }
        };

        vm.speech.onend = function(event) {
            if (vm.recordingPathologist) {
                vm.interim_transcript += vm.final_transcript;
                vm.speech.start();
                vm.final_transcript = '';
            }
        }

        /*Guardar la anotación sobre una lamina*/
        function saveAnnotation() {
            if (!vm.printAnnotation && !vm.annotation) { return; }
            vm.loadingdata = true;
            var annotation = {
                annotation: vm.annotation,
                print: vm.printAnnotation === true ? 1 : 0,
                sheet: vm.sheetSelected,
                userCreated: auth
            };
            vm.saveFile().then(function(resp) {
                if (resp) {
                    annotation.file = resp.data;
                }
                annotationDS.post(auth.authToken, annotation).then(function(resp) {
                    vm.sheetSelected.annotations.push(resp.data);
                    vm.resetRecordPathologist();
                    vm.loadingdata = false;
                    logger.success($filter('translate')('3048'));
                }, function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
            }, function(err) {
                annotationDS.post(auth.authToken, annotation).then(function(resp) {
                    vm.sheetSelected.annotations.push(resp.data);
                    vm.resetRecordPathologist();
                    vm.loadingdata = false;
                    logger.success($filter('translate')('3048'));
                }, function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
                vm.loadingdata = true;
            }).catch(function(resp) {
                vm.loadingdata = true;
            });
            vm.loadingdata = true;
        }

        function editAnnotation() {
            if (!vm.printAnnotation && !vm.annotation) { return; }
            vm.loadingdata = true;
            var annotation = JSON.parse(JSON.stringify(vm.annotationEditing));
            annotation.annotation = vm.annotation;
            annotation.print = vm.printAnnotation === true ? 1 : 0;
            annotation.userUpdated = auth;
            annotationDS.put(auth.authToken, annotation).then(function(resp) {
                var index = _.findIndex(vm.sheetSelected.annotations, function(o) { return o.id === vm.annotationEditing.id });
                _.pullAt(vm.sheetSelected.annotations, [index]);
                vm.sheetSelected.annotations.push(resp.data);
                vm.resetRecordPathologist();
                vm.loadingdata = false;
                logger.success($filter('translate')('3052'));
            }, function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
        }

        function saveFile() {
            var deferred = $q.defer();
            try {
                var name = JSON.parse(JSON.stringify(moment().format('X')));
                var extension = ".wav";
                var path = "/pathology/microscopy/" + name + extension;
                vm.converBlobToBase64(vm.pathologistAudio.getBlob()).then(function(response) {
                    if (response) {
                        var parameters = { 'path': path, 'file': vm.base64 };
                        fileDS.uploadAudio(parameters).then(function(response) {
                                if (response.status === 200) {
                                    var file = {
                                        name: name,
                                        extension: extension,
                                        url: path,
                                        userCreated: auth
                                    };
                                    fileDS.post(auth.authToken, file).then(function(resp) {
                                        deferred.resolve(resp);
                                    }, function(error) {
                                        vm.Error = error;
                                        vm.ShowPopupError = true;
                                    });
                                }
                            },
                            function(error) {
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
                reader.onloadend = function() {
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

        function loadAnnotation(annotation) {
            vm.isEditAnnotation = true;
            vm.annotation = annotation.annotation;
            vm.printAnnotation = annotation.print === 0 ? false : true;
            vm.srcPathologistAudio = annotation.file.url;
            vm.annotationEditing = annotation;
        }

        function resetRecordPathologist() {
            vm.loadingdata = false;
            vm.annotation = '';
            vm.interim_transcript = '';
            vm.annotation = '';
            vm.printAnnotation = null;
            vm.srcPathologistAudio = null;
            $scope.$broadcast('timer-reset');
            vm.pathologistAudio.reset();
            vm.blobAudiopathologist = null;
            vm.isEditAnnotation = false;
            vm.annotationEditing = null;
        }

        function resetRequest() {
            vm.coloration = null;
            vm.paraffinBlock = null;
            vm.quantity = null;
            vm.requestSelected = null;
        }

        function saveRequest() {
            if (!vm.coloration || !vm.paraffinBlock || !vm.quantity) { return; }
            vm.loadingdata = true;
            var request = {
                casePat: vm.caseSelected,
                paraffinBlock: vm.paraffinBlock,
                coloration: vm.coloration,
                quantity: vm.quantity,
                userCreated: auth
            }
            requestDS.post(auth.authToken, request).then(function(response) {
                vm.requests.push(response.data);
                vm.resetRequest();
                vm.loadingdata = false;
                logger.success($filter('translate')('3069'));
            }, function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
        }

        function editRequest() {
            if (!vm.coloration || !vm.paraffinBlock || !vm.quantity) { return; }
            vm.loadingdata = true;
            var request = JSON.parse(JSON.stringify(vm.requestSelected));
            request.paraffinBlock = vm.paraffinBlock;
            request.coloration = vm.coloration;
            request.quantity = vm.quantity;
            request.userUpdated = auth;
            requestDS.put(auth.authToken, request).then(function(response) {
                var index = _.findIndex(vm.requests, function(o) { return o.id === vm.requestSelected.id });
                _.pullAt(vm.requests, [index]);
                vm.requests.push(response.data);
                vm.resetRequest();
                vm.loadingdata = false;
                logger.success($filter('translate')('3070'));
            }, function(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
        }

        function getUsers() {
            vm.loadingdata = true;
            userDS.getuserActive(auth.authToken).then(function(response) {
                    vm.users = response.data;
                    var listUsers = [];
                    _.forEach(response.data, function(value) {
                        if (!_.find(listUsers, function(o) { return o.id === value.id }) && value.id != 0) {
                            var user = JSON.parse(JSON.stringify(value));
                            user.selectName = value.name + ' ' + value.lastName;
                            listUsers.push(user);
                        }
                    });
                    vm.listUsers = new kendo.data.DataSource({
                        data: listUsers
                    });
                    vm.loadingdata = false;
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        function getMeetingPathologist() {
            meetingPathologistDS.get(auth.authToken).then(function(response) {
                    vm.meetingPathologist = _.orderBy(response.data, ['id'], ['asc']);
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        /**
         * Carga la junta de patologos del caso
         */
        function getMeetingPathologistCase(idCase) {
            meetingPathologistDS.getByCase(auth.authToken, idCase).then(function(response) {
                    if (response.status === 200) {
                        vm.hasMeetingPathologist = true;
                    }
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        /**
         * Carga la lista de solicitudes de lamina del caso
         */
        function getRequest(idCase) {
            requestDS.getByCase(auth.authToken, idCase).then(function(response) {
                    vm.requests = _.orderBy(response.data, ['id'], ['asc']);
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        /**
         * Carga la lista de coloraciones
         */
        function getColoration() {
            colorationDS.get(auth.authToken).then(function(response) {
                    vm.colorations = _.orderBy(response.data, ['id'], ['asc']);
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        function getParaffinBlock(idCase) {
            paraffinBlockDS.getByCase(auth.authToken, idCase).then(function(response) {
                    vm.paraffinBlocks = _.orderBy(response.data, ['id'], ['asc']);
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        /**
         * Carga la lista de casos del usuario autenticado (Patologo)
         */
        function loadCases() {
            vm.loadingdata = true;
            caseDS.getCase(auth.authToken, auth.id).then(function(response) {
                    if (Object.keys(response.data).length === 0) {
                        UIkit.modal('#modalNotCases').show();
                    }
                    vm.cases = _.orderBy(response.data, ['id'], ['asc']);
                    vm.loadingdata = false;
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        /**
         * Carga las laminas de un caso seleccionado
         */
        function loadSheets(idCase) {
            vm.loadingdata = true;
            var idCase = idCase;
            vm.caseSelected = _.find(vm.cases, function(o) { return o.id === idCase });
            sheetDS.getSheets(auth.authToken, idCase).then(function(response) {
                    vm.sheets = _.orderBy(response.data, ['id'], ['asc']);
                    vm.loadingdata = false;
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
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
            vm.loadCases();
            vm.getColoration();
            vm.getMeetingPathologist();
            vm.getUsers();
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(function(stream) {
                vm.microphonePermission = true;
                vm.handlerFunction(stream);
            }).catch(function(e) {
                logger.warning($filter('translate')('3044'));
            });
        }
        vm.isAuthenticate();

    }
})();
/* jshint ignore:end */