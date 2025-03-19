/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal:          @descripción
                order:              @descripción
                idtest:             @descripción
                testcode:           @descripción
                testname:           @descripción
                patientinformation: @descripción
                photopatient:       @descripción
                commetorderkey:     @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pathology/samplereception/sampleentry/sampleentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function() {
  'use strict';

  angular
      .module('app.widgets')
      .directive('files', files)
      .config(function($compileProvider) {
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
      });
      files.$inject = ['$filter', 'localStorageService', 'logger', 'base64DownloadFactory', 'patientDS' , '$q', 'common', 'caseDS'
  ];

  /* @ngInject */
  function files($filter, localStorageService, logger, base64DownloadFactory, patientDS, $q, common, caseDS) {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/widgets/pathology/files.html',
          scope: {
              openmodal: '=openmodal',
              case: '=case',
              functionexecute: '=functionexecute'
          },

          controller: ['$scope', '$timeout', function($scope, $timeout) {
              var vm = this;
              var auth = localStorageService.get('Enterprise_NT.authorizationData');
              vm.formatDate = localStorageService.get('FormatoFecha');
              vm.loading = false;
              vm.close = close;
              vm.caseFiles = [];
              vm.case = null;
              vm.exts = ['.jpg', '.jpeg', '.png', '.pdf'];
              vm.extsToPrint = vm.exts.toString().replace(new RegExp('\\.', 'g'), ' -');
              vm.load = load;
              vm.loadModal = loadModal;
              vm.getPhoto = getPhoto;
              vm.getCaseFiles = getCaseFiles;
              vm.loadtakephotocase = loadtakephotocase;
              vm.viewtakephotocase = false;
              vm.validcamera = true;
              vm.photoattachmentcase = '';
              vm.namephotoattachmentcase = '';
              vm.validnamephotocase = validnamephotocase;
              vm.takephotocase = takephotocase;
              vm.addphotoattachmentcase = addphotoattachmentcase;
              vm.repeatname = false;
              vm.caseDeleteDocument = caseDeleteDocument;
              vm.caseTemporalInput = [];
              vm.caseChange = false;
              vm.save = save;
              vm.saveDocuments = saveDocuments;
              vm.change = change;
              vm.validFile = false;
              vm.downloadDocument = downloadDocument;
              vm.modalError = modalError;


              $scope.$watch('openmodal', function() {
                if ($scope.openmodal) {
                  vm.case = $scope.case;
                  vm.getPhoto();
                }
              });

              function close() {
                  vm.caseFiles = [];
                  UIkit.modal('#modal-casefiles').hide();
              }

              function saveDocuments() {
                var saved = false;
                if (vm.caseFiles !== undefined) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.loading = true;
                    angular.forEach(vm.caseFiles, function(item) {
                        if (item.delete) {
                            return caseDS.deleteDocument(auth.authToken, item).then(function(data) {
                                if (data.status === 200) {
                                    saved = true;
                                }
                            }, function(error) {
                                vm.modalError(error);
                            });
                        } else {
                            if (item.new || item.replace) {
                                return caseDS.saveDocument(auth.authToken, item).then(function(data) {
                                    if (data.status === 200) {
                                        saved = true;
                                        if ($scope.functionexecute !== undefined) {
                                          $scope.functionexecute();
                                        }
                                    }
                                }, function(error) {
                                    vm.modalError(error);
                                });
                            }
                        }
                    });
                }
                vm.loading = false;
                if (saved) logger.success($filter('translate')('0149'));
                UIkit.modal('#modal-casefiles').hide();
              }

              function save() {
                  vm.saveDocuments();
              }

              function caseDeleteDocument(obj) {
                if (obj.new === true) {
                    vm.caseFiles.splice(obj.id, 1);
                }
                obj.delete = true;
                obj.replace = false;
                vm.caseChange = true;
                obj.hidden = true;
              }

              function addphotoattachmentcase() {
                  var imagedata = vm.photoattachmentcase.split(',');
                  var attach = {
                      extension: 'png',
                      file: imagedata[1],
                      fileType: 'image/png',
                      id: null,
                      idCase: vm.case.id,
                      name: vm.namephotoattachmentcase + '.png',
                      createdAt: new Date(moment().format()).getTime(),
                      replace: true,
                      new: true,
                      delete: false,
                      userCreated: {
                          id: auth.id,
                          userName: auth.userName
                      }
                  };
                  vm.caseFiles.push(attach);
                  vm.viewtakephotocase = false;
                  vm.photoattachmentcase = '';
                  vm.namephotoattachmentcase = '';
                  vm.caseChange = true;
              }

              function takephotocase() {
                  var video = document.getElementById('cameracase');
                  var canvas = document.getElementById('canvacase');
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  canvas.getContext('2d').drawImage(video, 0, 0);
                  var data = canvas.toDataURL('image/png');
                  vm.photoattachmentcase = data;
                  document.getElementById('photoorder').setAttribute('src', data);
              }


              function validnamephotocase() {
                var validnameattachment = $filter('filter')(vm.caseFiles, {
                    name: vm.namephotoattachmentcase + '.png'
                }, true);
                vm.messageimagecase = validnameattachment.length > 0 ? true : false;
              }

              function loadtakephotocase() {
                if (location.protocol !== "https:") {
                    logger.error($filter('translate')('1507'));
                } else {
                    vm.viewtakephotocase = true;
                    if (navigator.mediaDevices.getUserMedia === navigator.mediaDevices.getUserMedia ||
                        navigator.mediaDevices.webkitGetUserMedia ||
                        navigator.mediaDevices.mozGetUserMedia ||
                        navigator.mediaDevices.msGetUserMedia) {
                        navigator.mediaDevices.getUserMedia({
                                video: true,
                                audio: false
                            })
                            .then(function(mediaStream) {
                                var video = document.getElementById('cameracase');
                                video.srcObject = mediaStream;
                                video.play();
                            })
                            .catch(function(error) {
                                vm.validcamera = false;
                            });
                    } else {
                        vm.validcamera = false;
                    }
                }
              }

              function getCaseFiles() {
                  var auth = localStorageService.get('Enterprise_NT.authorizationData');
                  vm.loading = true;

                  return caseDS.getFiles(auth.authToken, vm.case.id).then(function(data) {
                      if (data.status === 200) {
                          vm.caseFiles = data.data;
                      }
                      vm.loading = false;
                  }, function(error) {
                      vm.loading = false;
                      vm.modalError(error);
                  });
              }

              function load() {
                vm.caseTemporalInput = undefined;
                vm.caseFiles = [];
                vm.caseChange = false;
                vm.getCaseFiles();

                UIkit.modal('#modal-casefiles').show();
              }

              function loadModal(photo) {
                vm.repeatname = false;
                vm.patient = {
                  id: vm.case.order.patientIdDB,
                  name: vm.case.order.name1 + " " + vm.case.order.name2 + " " + vm.case.order.lastName + " " + vm.case.order.surName,
                  document: vm.case.order.patientId,
                  age: common.getAgeAsString(moment(vm.case.order.birthday).format(vm.formatDateAge), vm.formatDateAge),
                  gender: vm.case.order.sex
                }
                vm.photopatient = photo
                $scope.openmodal = false;
                vm.load();
              }

              function getPhoto() {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.loading = true;
                return patientDS.getPhotoPatient(auth.authToken, vm.case.order.patientIdDB).then(function(response) {
                    var photo = '';
                    if (response.status === 200) {
                        photo = response.data.photoInBase64
                    }
                    vm.loadModal(photo);
                    vm.loading = false;
                }, function(error) {
                    vm.loading = false;
                    vm.modalError(error);
                });
              }

              $scope.$watch('file.caseTemporalInput', function() {
                if (vm.caseTemporalInput !== undefined && vm.validFile) {
                    angular.forEach(vm.caseTemporalInput, function(item) {
                        var attach = {};
                        vm.indexcaseTemporalfile = $filter('filter')(vm.caseFiles, {
                            file: item.base64
                        }, true);
                        vm.indexcaseTemporalname = $filter('filter')(vm.caseFiles, {
                            name: item.filename
                        }, true);

                        if (vm.indexcaseTemporalfile.length !== 0 || vm.indexcaseTemporalname.length !== 0) {
                            vm.indexcaseTemporal = vm.indexcaseTemporalfile.length === 0 ? vm.indexcaseTemporalname : vm.indexcaseTemporalfile;
                            vm.repeatname = true;
                            vm.changeattach = {};
                            vm.changeattach.file = item.base64;
                            vm.changeattach.name = item.filename;
                            vm.changeattach.fileType = item.filetype;
                            vm.changeattach.extension = item.filetype.split('/')[1];
                            vm.changeattach.userCreated = {};
                            vm.changeattach.userCreated.userName = auth.userName;
                            vm.changeattach.createdAt = new Date(moment().format()).getTime();
                            vm.changeattach.delete = false;
                        } else {
                            attach.new = true;
                            attach.file = item.base64;
                            attach.name = item.filename;
                            attach.fileType = item.filetype;
                            attach.extension = item.filetype.split('/')[1];
                            attach.userCreated = {};
                            attach.userCreated.id = auth.id;
                            attach.userCreated.userName = auth.userName;
                            attach.idCase = vm.case.id;
                            attach.createdAt = new Date(moment().format()).getTime();
                            vm.repeatname = false;
                            attach.delete = false;
                            if (($filter('filter')(vm.caseFiles, {
                                    delete: false
                                })).length < 6) {
                                vm.caseFiles.push(attach);
                            }

                        }
                        vm.caseChange = true;
                    });
                }
              });

              function modalError(error) {
                vm.Error = error;
                vm.ShowPopupError = true;
              }

              function downloadDocument(obj) {
                  if (!obj.new) {
                      var index = obj.name.lastIndexOf('.' + obj.extension);
                      base64DownloadFactory.download('data:' + obj.filteType + ';base64,' + obj.file, obj.name.substring(0, index), obj.extension);
                  }
              }

              function change() {
                if (vm.indexcaseTemporal[0].id === undefined) {
                    vm.caseFiles[vm.caseFiles.length - 1].replace = true;
                    vm.caseFiles[vm.caseFiles.length - 1].file = vm.changeattach.file;
                    vm.caseFiles[vm.caseFiles.length - 1].userCreated = {};
                    vm.caseFiles[vm.caseFiles.length - 1].userCreated.id = auth.id;
                    vm.caseFiles[vm.caseFiles.length - 1].userCreated.userName = auth.userName;
                    vm.caseFiles[vm.caseFiles.length - 1].createdAt = new Date(moment().format()).getTime();
                    vm.repeatname = false;
                } else {
                    vm.caseFiles[vm.indexcaseTemporal[0].id].replace = true;
                    vm.caseFiles[vm.indexcaseTemporal[0].id].file = vm.changeattach.file;
                    vm.caseFiles[vm.indexcaseTemporal[0].id].userCreated = {};
                    vm.caseFiles[vm.indexcaseTemporal[0].id].userCreated.id = auth.id;
                    vm.caseFiles[vm.indexcaseTemporal[0].id].userCreated.userName = auth.userName;
                    vm.caseFiles[vm.indexcaseTemporal[0].id].createdAt = new Date(moment().format()).getTime();
                    vm.repeatname = false;
                }
              }

              $scope.onChange = function(e, fileList) {
                vm.validFile = true;
                angular.forEach(fileList, function(item) {
                    if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(item.name)) {
                        vm.validFile = false;
                        logger.warning($filter('translate')('0587'));
                    }
                });
                var file = document.querySelector('.file');
                file.value = '';
              };

              $scope.$on('onLastRepeat', function(scope, element, attrs) {
                var $grid = $('#galleryGrid');
                var grid = UIkit.grid($grid, {
                    gutter: 16
                });
              });
          }],
          controllerAs: 'file'
      };
      return directive;
  }
})();
