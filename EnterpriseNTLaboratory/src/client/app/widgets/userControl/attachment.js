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
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";

  angular
    .module("app.widgets")
    .directive("attachment", attachment)
    .config(function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
    });

  attachment.$inject = [
    "$filter",
    "localStorageService",
    "logger",
    "resultsentryDS",
    "base64DownloadFactory",
    "patientDS",
  ];

  /* @ngInject */
  function attachment(
    $filter,
    localStorageService,
    logger,
    resultsentryDS,
    base64DownloadFactory,
    patientDS
  ) {
    var directive = {
      restrict: "EA",
      templateUrl: "app/widgets/userControl/attachment.html",
      scope: {
        openmodal: "=openmodal",
        order: "=order",
        idtest: "=idtest",
        testcode: "=testcode",
        testname: "=testname",
        patientinformation: "=patientinformation",
        photopatient: "=photopatient",
        commetorder: "=?commetorder",
        teststate: "=?teststate",
        functionexecute: "=?functionexecute",
        orderdemo: "=?orderdemo",
        functionexecutedelete: "=functionexecutedelete",
      },

      controller: [
        "$scope",
        "$timeout",
        function ($scope, $timeout) {
          var vm = this;
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          vm.formatDate = localStorageService.get("FormatoFecha");

          vm.load = load;
          vm.close = close;
          vm.save = save;

          vm.validFile = false;

          vm.getOrderDocuments = getOrderDocuments;
          vm.orderDeleteDocument = orderDeleteDocument;
          vm.orderDocuments = [];
          vm.orderTemporalInput = [];
          vm.orderChange = false;

          vm.getTestDocuments = getTestDocuments;
          vm.testDeleteDocument = testDeleteDocument;
          vm.testDocuments = [];
          vm.testChange = false;
          vm.testTemporalInput = [];
          vm.typeordercode = {};
          vm.orderDetail = {};
          vm.testId = 0;
          vm.repeatname = false;
          vm.repeatnametest = false;

          vm.change = change;
          vm.changetest = changetest;

          vm.saveDocuments = saveDocuments;
          vm.modalError = modalError;

          //Obtener foto
          vm.getPhoto = getPhoto;
          vm.loadModal = loadModal;

          //Manejo de foto de la orden.
          vm.loadtakephotoorder = loadtakephotoorder;
          vm.takephotoorder = takephotoorder;
          vm.addphotoattachmentorder = addphotoattachmentorder;
          vm.photoattachmentorder = "";
          vm.namephotoattachmentorder = "";
          vm.messageimagetest = false;
          vm.validnamephotoorder = validnamephotoorder;
          vm.viewtakephotoorder = false;

          //Manejo de foto del examen.
          vm.loadtakephototest = loadtakephototest;
          vm.takephototest = takephototest;
          vm.addphotoattachmenttest = addphotoattachmenttest;
          vm.photoattachmenttest = "";
          vm.namephotoattachmenttest = "";
          vm.messageimagetest = false;
          vm.validnamephototest = validnamephototest;
          vm.viewtakephototest = false;

          vm.validcamera = true;

          vm.loading = false;
          vm.downloadDocument = downloadDocument;

          vm.exts = [".jpg", ".jpeg", ".png", ".pdf"];
          vm.extsToPrint = vm.exts
            .toString()
            .replace(new RegExp("\\.", "g"), " -");

          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              vm.orderdemo = $scope.orderdemo;
              if ($scope.photopatient) {
                vm.loadModal($scope.photopatient);
              } else {
                vm.getPhoto();
              }
            }
          });

          $scope.$watch("vmd.orderTemporalInput", function () {
            if (vm.orderTemporalInput !== undefined && vm.validFile) {
              angular.forEach(vm.orderTemporalInput, function (item) {
                var attach = {};
                vm.indexorderTemporalfile = $filter("filter")(
                  vm.orderDocuments,
                  {
                    file: item.base64,
                  },
                  true
                );
                vm.indexorderTemporalname = $filter("filter")(
                  vm.orderDocuments,
                  {
                    name: item.filename,
                  },
                  true
                );

                if (
                  vm.indexorderTemporalfile.length !== 0 ||
                  vm.indexorderTemporalname.length !== 0
                ) {
                  vm.indexorderTemporal =
                    vm.indexorderTemporalfile.length === 0
                      ? vm.indexorderTemporalname
                      : vm.indexorderTemporalfile;
                  vm.repeatname = true;
                  vm.changeattach = {};
                  vm.changeattach.file = item.base64;
                  vm.changeattach.name = item.filename;
                  vm.changeattach.fileType = item.filetype;
                  vm.changeattach.extension = item.filetype.split("/")[1];
                  vm.changeattach.user = {};
                  vm.changeattach.user.userName = auth.userName;
                  vm.changeattach.date = new Date(moment().format()).getTime();
                  vm.changeattach.delete = false;
                  vm.changeattach.viewresul = item.viewresul;
                } else {
                  attach.new = true;
                  attach.file = item.base64;
                  attach.name = item.filename;
                  attach.fileType = item.filetype;
                  attach.extension = item.filetype.split("/")[1];
                  attach.user = {};
                  attach.user.id = auth.userId;
                  attach.viewresul = true;
                  attach.user.userName = auth.userName;
                  attach.idOrder = vm.order;
                  attach.idTest = 0;
                  attach.date = new Date(moment().format()).getTime();
                  vm.repeatname = false;
                  attach.delete = false;
                  if (
                    $filter("filter")(vm.orderDocuments, {
                      delete: false,
                    }).length < 6
                  ) {
                    vm.orderDocuments.push(attach);
                    //  break;
                  }
                }
                vm.orderChange = true;
              });
            }
          });
          $scope.$watch("vmd.testTemporalInput", function () {
            if (vm.testTemporalInput !== undefined && vm.validFile) {
              angular.forEach(vm.testTemporalInput, function (item) {
                var attach = {};
                vm.indextestTemporalfile = $filter("filter")(
                  vm.testDocuments,
                  {
                    file: item.base64,
                  },
                  true
                );
                vm.indextestTemporalname = $filter("filter")(
                  vm.testDocuments,
                  {
                    name: item.filename,
                  },
                  true
                );

                if (
                  vm.indextestTemporalfile.length !== 0 ||
                  vm.indextestTemporalname.length !== 0
                ) {
                  vm.indextestTemporal =
                    vm.indextestTemporalfile.length === 0
                      ? vm.indextestTemporalname
                      : vm.indextestTemporalfile;
                  vm.repeatnametest = true;
                  vm.changetestattach = {};
                  vm.changetestattach.file = item.base64;
                  vm.changetestattach.name = item.filename;
                  vm.changetestattach.fileType = item.filetype;
                  vm.changetestattach.extension = item.filetype.split("/")[1];
                  vm.changetestattach.delete = false;
                  vm.changetestattach.viewresul = item.viewresul;
                  vm.changetestattach.user = {};
                  vm.changetestattach.user.userName = auth.userName;
                  vm.changetestattach.date = new Date(
                    moment().format()
                  ).getTime();
                } else {
                  vm.repeatnametest = false;
                  attach.new = true;
                  attach.file = item.base64;
                  attach.name = item.filename;
                  attach.fileType = item.filetype;
                  attach.extension = item.filetype.split("/")[1];
                  attach.user = {};
                  attach.user.id = auth.userId;
                  attach.user.userName = auth.userName;
                  attach.idOrder = vm.order;
                  attach.idTest = vm.testId;
                  attach.viewresul = true;
                  attach.delete = false;
                  attach.date = new Date(moment().format()).getTime();
                  if (
                    $filter("filter")(vm.testDocuments, {
                      delete: false,
                    }).length < 6
                  ) {
                    vm.testDocuments.push(attach);
                  }
                }
                vm.testChange = true;
              });
            }
          });

          vm.viewPDF = viewPDF;
          function viewPDF(attach) {
            UIkit.modal("#modalviewviewPDF", {
              escclose: false,
              modal: false,
            }).show();
            var elemento = document.getElementById("viewPDF");
            elemento.src = "data:application/pdf;base64," + attach.file;
          }
          function change() {
            if (vm.indexorderTemporal[0].id === undefined) {
              vm.orderDocuments[vm.orderDocuments.length - 1].replace = true;
              vm.orderDocuments[vm.orderDocuments.length - 1].file =
                vm.changeattach.file;
              vm.orderDocuments[vm.orderDocuments.length - 1].user = {};
              vm.orderDocuments[vm.orderDocuments.length - 1].user.id =
                auth.userId;
              vm.orderDocuments[vm.orderDocuments.length - 1].user.userName =
                auth.userName;
              vm.orderDocuments[vm.orderDocuments.length - 1].date = new Date(
                moment().format()
              ).getTime();
              vm.repeatname = false;
            } else {
              vm.orderDocuments[vm.indexorderTemporal[0].id].replace = true;
              vm.orderDocuments[vm.indexorderTemporal[0].id].file =
                vm.changeattach.file;
              vm.orderDocuments[vm.indexorderTemporal[0].id].user = {};
              vm.orderDocuments[vm.indexorderTemporal[0].id].user.id =
                auth.userId;
              vm.orderDocuments[vm.indexorderTemporal[0].id].user.userName =
                auth.userName;
              vm.orderDocuments[vm.indexorderTemporal[0].id].date = new Date(
                moment().format()
              ).getTime();
              vm.repeatname = false;
            }
          }

          function changetest() {
            if (vm.indextestTemporal[0].id === undefined) {
              vm.testDocuments[vm.testDocuments.length - 1].replace = true;
              vm.testDocuments[vm.testDocuments.length - 1].file =
                vm.changetestattach.file;
              vm.testDocuments[vm.testDocuments.length - 1].user = {};
              vm.testDocuments[vm.testDocuments.length - 1].user.id =
                auth.userId;
              vm.testDocuments[vm.testDocuments.length - 1].user.userName =
                auth.userName;
              vm.testDocuments[vm.testDocuments.length - 1].date = new Date(
                moment().format()
              ).getTime();
              vm.repeatnametest = false;
            } else {
              vm.testDocuments[vm.indextestTemporal[0].id].replace = true;
              vm.testDocuments[vm.indextestTemporal[0].id].file =
                vm.changetestattach.file;
              vm.testDocuments[vm.indextestTemporal[0].id].user = {};
              vm.testDocuments[vm.indextestTemporal[0].id].user.id =
                auth.userId;
              vm.testDocuments[vm.indextestTemporal[0].id].user.userName =
                auth.userName;
              vm.testDocuments[vm.indextestTemporal[0].id].date = new Date(
                moment().format()
              ).getTime();
              vm.repeatnametest = false;
            }
          }

          function load() {
            vm.orderTemporalInput = undefined;
            vm.testTemporalInput = undefined;
            vm.orderDocuments = [];
            vm.testDocuments = [];
            vm.orderChange = false;
            vm.testChange = false;
            vm.testId =
              vm.testId === undefined || vm.testId === null ? 0 : vm.testId;
            vm.getOrderDocuments();
            UIkit.modal("#modal-orderattachment", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          }

          function close() {
            vm.orderDocuments = [];
            vm.testDocuments = [];
            UIkit.modal("#modal-orderattachment").hide();
          }

          function loadModal(photo) {
            vm.repeatname = false;
            vm.repeatnametest = false;
            vm.viewtakephototest = false;
            vm.order = $scope.order;
            vm.patient = $scope.patientinformation;
            vm.testId = $scope.idtest;
            vm.testcode = $scope.testcode;
            vm.testname = $scope.testname;
            vm.teststate = $scope.teststate;
            vm.commetorder = $scope.commetorder;
            vm.photopatient = photo;
            $scope.openmodal = false;
            vm.load();
          }

          function save() {
            vm.delettest = false;
            if (vm.testDocuments === undefined) {
              vm.saveDocuments();
            } else if (vm.testDocuments.length === 0) {
              vm.saveDocuments();
            } else {
              var data = $filter("filter")(
                _.clone(vm.testDocuments),
                function (e) {
                  return !e.delete;
                }
              );
              if (data.length === 0) {
                vm.delettest = true;
                UIkit.modal("#modalconfirmation", { modal: false }).show();
              } else {
                vm.saveDocuments();
              }
            }
          }

          function getPhoto() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            vm.loading = true;
            return patientDS
              .getPhotoPatient(auth.authToken, $scope.patientinformation.id)
              .then(
                function (response) {
                  var photo = "";
                  if (response.status === 200) {
                    photo = response.data.photoInBase64;
                  }
                  vm.loadModal(photo);
                },
                function (error) {
                  vm.loading = false;
                  vm.modalError(error);
                }
              );
          }

          function getOrderDocuments() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            vm.loading = true;
            return resultsentryDS
              .getDocuments(auth.authToken, vm.order, 0)
              .then(
                function (data) {
                  if (vm.testId > 0) {
                    vm.getTestDocuments();
                  } else {
                    vm.loading = false;
                  }
                  if (data.status === 200) {
                    vm.orderDocuments = data.data;
                    vm.ordercomparted = JSON.parse(JSON.stringify(data.data));
                  }
                },
                function (error) {
                  vm.loading = false;
                  vm.modalError(error);
                }
              );
          }

          function getTestDocuments() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return resultsentryDS
              .getDocuments(auth.authToken, vm.order, vm.testId)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.testDocuments = data.data;
                    vm.testcomparted = JSON.parse(JSON.stringify(data.data));
                  }
                  vm.loading = false;
                },
                function (error) {
                  vm.loading = false;
                  vm.modalError(error);
                }
              );
          }

          function saveDocuments() {
            var saved = false;
            if (vm.delettest) {
              if ($scope.functionexecute !== undefined) {
                $scope.functionexecutedelete();
              }
            }
            if (vm.orderDocuments !== undefined) {
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              vm.loading = true;
              angular.forEach(vm.orderDocuments, function (item) {
                delete item.$$hashKey;
                delete item.id;
              });
              if (
                JSON.stringify(vm.orderDocuments) !==
                JSON.stringify(vm.ordercomparted)
              ) {
                angular.forEach(vm.orderDocuments, function (item) {
                  if (item.delete) {
                    return resultsentryDS
                      .deleteDocument(auth.authToken, item)
                      .then(
                        function (data) {
                          if (data.status === 200) {
                            saved = true;
                          }
                        },
                        function (error) {
                          vm.modalError(error);
                        }
                      );
                  } else {
                    if (item.new || item.replace) {
                      return resultsentryDS
                        .saveDocument(auth.authToken, item)
                        .then(
                          function (data) {
                            if (data.status === 200) {
                              saved = true;
                            }
                          },
                          function (error) {
                            vm.modalError(error);
                          }
                        );
                    }
                  }
                });
              }
            }
            if (vm.testDocuments !== undefined) {
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              vm.loading = true;
              if (vm.testDocuments.length === 0) {
                vm.loading = false;
                if (saved) logger.success($filter("translate")("0149"));
                UIkit.modal("#modal-orderattachment").hide();
              } else {
                angular.forEach(vm.testDocuments, function (item) {
                  delete item.$$hashKey;
                  delete item.id;
                });
                if (
                  JSON.stringify(vm.testcomparted) !==
                  JSON.stringify(vm.testDocuments)
                ) {
                  angular.forEach(vm.testDocuments, function (item, key) {
                    if (item.delete) {
                      return resultsentryDS
                        .deleteDocument(auth.authToken, item)
                        .then(
                          function (data) {
                            if (data.status === 200) {
                              saved = true;
                              if (key === vm.testDocuments.length - 1) {
                                vm.loading = false;
                                if (saved)
                                  logger.success($filter("translate")("0149"));
                                UIkit.modal("#modal-orderattachment").hide();
                                if ($scope.functionexecute !== undefined) {
                                  $scope.functionexecute();
                                }
                              }
                            }
                          },
                          function (error) {
                            vm.modalError(error);
                          }
                        );
                    } else {
                      if (item.new || item.replace) {
                        return resultsentryDS
                          .saveDocument(auth.authToken, item)
                          .then(
                            function (data) {
                              if (data.status === 200) {
                                saved = true;
                                if (key === vm.testDocuments.length - 1) {
                                  vm.loading = false;
                                  if (saved)
                                    logger.success(
                                      $filter("translate")("0149")
                                    );
                                  UIkit.modal("#modal-orderattachment").hide();
                                  if ($scope.functionexecute !== undefined) {
                                    $scope.functionexecute();
                                  }
                                }
                              }
                            },
                            function (error) {
                              vm.modalError(error);
                            }
                          );
                      }
                    }
                  });
                }else{
                  vm.loading = false;
                  logger.success($filter("translate")("0149"));
                  UIkit.modal("#modal-orderattachment").hide();
                }
              }
            } else {
              vm.loading = false;
              if (saved) logger.success($filter("translate")("0149"));
              UIkit.modal("#modal-orderattachment").hide();
            }
          }

          $scope.onChange = function (e, fileList) {
            vm.validFile = true;
            angular.forEach(fileList, function (item) {
              if (
                !new RegExp(
                  "(" + vm.exts.join("|").replace(/\./g, "\\.") + ")$"
                ).test(item.name)
              ) {
                vm.validFile = false;
                logger.warning($filter("translate")("0587"));
              }
            });

            var file = document.querySelector(".file");
            file.value = "";
          };

          $scope.$on("onLastRepeat", function (scope, element, attrs) {
            var $grid = $("#galleryGrid");
            var grid = UIkit.grid($grid, {
              gutter: 16,
            });
          });

          $scope.$on("onLastRepeat", function (scope, element, attrs) {
            var $grid = $("#galleryGrid1");
            var grid = UIkit.grid($grid, {
              gutter: 16,
            });
          });

          $scope.onLoad = function (
            e,
            reader,
            file,
            fileList,
            fileOjects,
            fileObj
          ) {
            alert("this is handler for file reader onload event!");
          };
          var uploadedCount = 0;

          function testDeleteDocument(obj) {
            vm.Comment = "";
            if (obj.new === true) {
              vm.testDocuments.splice(obj.id, 1);
            } else {
              UIkit.modal("#deletedModalTest", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            }
          }

          vm.motiveeditsavetest = motiveeditsavetest;
          function motiveeditsavetest(obj) {
            UIkit.modal("#deletedModalTest").hide();
            obj.comment = vm.Comment;
            obj.delete = true;
            obj.replace = false;
            vm.testChange = true;
            obj.hidden = true;
            vm.save();
          }

          function orderDeleteDocument(obj) {
            vm.Comment = "";
            if (obj.new === true) {
              vm.orderDocuments.splice(obj.id, 1);
            } else {
              UIkit.modal("#deletedModal", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            }
          }

          vm.motiveeditsave = motiveeditsave;
          function motiveeditsave(obj) {
            UIkit.modal("#deletedModal").hide();
            obj.comment = vm.Comment;
            obj.delete = true;
            obj.replace = false;
            vm.orderChange = true;
            obj.hidden = true;
            vm.save();
          }

          function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }

          function downloadDocument(obj) {
            if (!obj.new) {
              var index = obj.name.lastIndexOf("." + obj.extension);
              base64DownloadFactory.download(
                "data:" + obj.filteType + ";base64," + obj.file,
                obj.name.substring(0, index),
                obj.extension
              );
            }
          }

          function loadtakephototest() {
            if (location.protocol !== "https:") {
              logger.error($filter("translate")("1507"));
            } else {
              vm.viewtakephototest = true;
              vm.validcamera = true;
              if (
                navigator.mediaDevices.getUserMedia ===
                  navigator.mediaDevices.getUserMedia ||
                navigator.mediaDevices.webkitGetUserMedia ||
                navigator.mediaDevices.mozGetUserMedia ||
                navigator.mediaDevices.msGetUserMedia
              ) {
                navigator.mediaDevices
                  .getUserMedia({
                    video: true,
                    audio: false,
                  })
                  .then(function (mediaStream) {
                    setTimeout(function () {
                      var video = document.getElementById("cameratest");
                      //var url = window.URL || window.webkitURL;
                      video.srcObject = mediaStream;
                      //video.src = url ? url.createObjectURL(mediaStream) : mediaStream;
                      video.play();
                    }, 100);
                  })
                  .catch(function (error) {
                    console.log(error);
                    vm.validcamera = false;
                  });
              } else {
                vm.validcamera = false;
              }
            }
          }

          function takephototest() {
            var video = document.getElementById("cameratest");
            var canvas = document.getElementById("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            var data = canvas.toDataURL("image/png");
            vm.photoattachmenttest = data;
            document.getElementById("phototest").setAttribute("src", data);
          }

          function addphotoattachmenttest() {
            var imagedata = vm.photoattachmenttest.split(",");
            var attach = {
              extension: "png",
              file: imagedata[1],
              fileType: "image/png",
              id: null,
              idOrder: vm.order,
              idTest: vm.testId,
              name: vm.namephotoattachmenttest + ".png",
              date: new Date(moment().format()).getTime(),
              replace: true,
              new: true,
              delete: false,
              user: {
                id: auth.userId,
                userName: auth.userName,
              },
            };
            vm.testDocuments.push(attach);
            vm.viewtakephototest = false;
            vm.photoattachmenttest = "";
            vm.namephotoattachmenttest = "";
            vm.testChange = true;
          }

          function validnamephototest() {
            var validnameattachment = $filter("filter")(
              vm.testDocuments,
              {
                name: vm.namephotoattachmenttest + ".png",
              },
              true
            );
            vm.messageimagetest = validnameattachment.length > 0 ? true : false;
          }

          function loadtakephotoorder() {
            if (location.protocol !== "https:") {
              logger.error($filter("translate")("1507"));
            } else {
              vm.viewtakephotoorder = true;
              if (
                navigator.mediaDevices.getUserMedia ===
                  navigator.mediaDevices.getUserMedia ||
                navigator.mediaDevices.webkitGetUserMedia ||
                navigator.mediaDevices.mozGetUserMedia ||
                navigator.mediaDevices.msGetUserMedia
              ) {
                navigator.mediaDevices
                  .getUserMedia({
                    video: true,
                    audio: false,
                  })
                  .then(function (mediaStream) {
                    var video = document.getElementById("cameraorder");
                    //var url = window.URL || window.webkitURL;
                    video.srcObject = mediaStream;
                    //video.src = url ? url.createObjectURL(mediaStream) : mediaStream;
                    video.play();
                  })
                  .catch(function (error) {
                    vm.validcamera = false;
                  });
              } else {
                vm.validcamera = false;
              }
            }
          }

          function takephotoorder() {
            var video = document.getElementById("cameraorder");
            var canvas = document.getElementById("canvasorder");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            var data = canvas.toDataURL("image/png");
            vm.photoattachmentorder = data;
            document.getElementById("photoorder").setAttribute("src", data);
          }

          function addphotoattachmentorder() {
            var imagedata = vm.photoattachmentorder.split(",");
            var attach = {
              extension: "png",
              file: imagedata[1],
              fileType: "image/png",
              id: null,
              idOrder: vm.order,
              idTest: null,
              name: vm.namephotoattachmentorder + ".png",
              date: new Date(moment().format()).getTime(),
              replace: true,
              new: true,
              delete: false,
              user: {
                id: auth.userId,
                userName: auth.userName,
              },
            };
            vm.orderDocuments.push(attach);
            vm.viewtakephotoorder = false;
            vm.photoattachmentorder = "";
            vm.namephotoattachmentorder = "";
            vm.orderChange = true;
          }

          function validnamephotoorder() {
            var validnameattachment = $filter("filter")(
              vm.orderDocuments,
              {
                name: vm.namephotoattachmentorder + ".png",
              },
              true
            );
            vm.messageimageorder =
              validnameattachment.length > 0 ? true : false;
          }
        },
      ],
      controllerAs: "vmd",
    };
    return directive;
  }
})();
