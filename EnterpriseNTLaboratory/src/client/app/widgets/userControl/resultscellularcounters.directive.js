(function () {
  "use strict";

  angular
    .module("app.widgets")
    .directive("resultscellularcounters", resultscellularcounters);

  resultscellularcounters.$inject = [
    "$filter",
    "commentsDS",
    "localStorageService",
    "motiveDS",
  ];

  /* @ngInject */
  function resultscellularcounters(
    $filter,
    commentsDS,
    localStorageService,
    motiveDS
  ) {
    var directive = {
      restrict: "EA",
      templateUrl: "app/widgets/userControl/resultscellularcounters.html",
      scope: {
        openmodal: "=openmodal",
        order: "=order",
        testoingroup: "=testoingroup",
        patientinformation: "=patientinformation",
        photopatient: "=photopatient",
        testcounter: "=testcounter",
        motive: "=motive",
        comment: "=comment",
        functionexecute: "=functionexecute",
      },

      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.ReasonsResult =
            localStorageService.get("MotivoModificacionResultado") === "True";
          vm.viewcomment = false;
          $scope.$watch("openmodal", function () {
            if ($scope.openmodal) {
              if (vm.ReasonsResult) {
                vm.getEditMotives();
              }
              vm.keys = "";
              vm.loadingdata = true;
              vm.selectedMotive = null;
              vm.reasonComment = "";
              vm.numbermax = 0;
              vm.total = 0;
              vm.viewcomment = true;
              vm.order = $scope.order;
              vm.test = _.filter(
                JSON.parse(JSON.stringify($scope.testoingroup)),
                function (o) {
                  return o.state <= 2;
                }
              );
              vm.patient = $scope.patientinformation;
              vm.photopatient = $scope.photopatient;
              vm.audio = document.getElementById("myAudio");
              vm.getcellularcounters();
              $scope.openmodal = false;
            }
          });
          vm.getformule = getformule;
          function getformule() {
            var resultcalcul = [];
            if (vm.listestformule.length !== 0) {
              vm.listestformule.forEach(function (value) {
                if (
                  value.formuletestString.indexOf(
                    currentTest.testId.toString()
                  ) !== -1
                ) {
                  var validated = true;
                  var output = value.formulareplace;
                  angular.forEach(value.formuletest, function (item) {
                    if (vm.testformula["'" + item + "'"] === undefined) {
                      if (vm.listformule["'" + item + "'"] === undefined) {
                        validated = false;
                      } else {
                        validated = true;
                        output = output.replaceAll(
                          "<%=" + item + "%>",
                          vm.listformule["'" + item + "'"].formulareplace
                        );
                        angular.forEach(
                          vm.listformule["'" + item + "'"].formuletest,
                          function (itemi) {
                            if (
                              vm.testformula["'" + itemi + "'"] === undefined
                            ) {
                              validated = false;
                            } else {
                              output = output.replaceAll(
                                "<%=" + itemi + "%>",
                                vm.testformula["'" + itemi + "'"].result
                              );
                            }
                          }
                        );
                        if (validated) {
                          validated = false;
                          output = $filter("lowercase")(output);
                          value.result = math.evaluate(output);
                          value.result = parseFloat(value.result).toFixed(
                            value.digits
                          );
                          resultcalcul.push(value);
                        }
                      }
                    } else {
                      var dataString = isNaN(
                        vm.testformula["'" + item + "'"].result
                      );
                      if (dataString) {
                        validated = false;
                      } else {
                        output = output.replaceAll(
                          "<%=" + item + "%>",
                          vm.testformula["'" + item + "'"].result
                        );
                      }
                    }
                  });
                  if (validated) {
                    output = $filter("lowercase")(output);
                    value.result = math.evaluate(output);
                    value.result = parseFloat(value.result).toFixed(
                      value.digits
                    );
                    resultcalcul.push(value);
                  }
                }
              });
            }
          }
          vm.getcellularcounters = getcellularcounters;
          function getcellularcounters() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return commentsDS.getResultscellularcounters(auth.authToken).then(
              function (data) {
                if (data.status === 200) {
                  var resultscellularcounters = data.data;
                  if (resultscellularcounters.length === 0) {
                    UIkit.modal("#advertencia").show();
                    vm.loadingdata = false;
                  } else {
                    vm.cont = 0;
                    vm.Listcelular = {};
                    resultscellularcounters.forEach(function (value, key) {
                      var filterTesr = _.filter(_.clone(vm.test), function (o) {
                        return o.testId === value.test.id;
                      });
                      if (filterTesr.length !== 0) {
                        filterTesr[0].result = 0;
                        filterTesr[0].key = value.key;
                        filterTesr[0].sum = value.sum;
                        vm.Listcelular[value.key] = filterTesr[0];
                        vm.cont = vm.cont + 1;
                      }
                    });

                    if (vm.cont === 0) {
                      UIkit.modal("#advertencia").show();
                      vm.loadingdata = false;
                    } else {
                      vm.entryKeys = 0;
                      setTimeout(function () {
                        document.getElementById("labelmax").focus();
                        angular.element("#labelmax").select();
                      }, 1000);
                      vm.loadingdata = false;
                      UIkit.modal("#rs-modal-cellularcounters").show();
                    }
                  }
                } else {
                  UIkit.modal("#advertencia").show();
                  vm.loadingdata = false;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          vm.keyselect = keyselect;
          function keyselect($event) {
            vm.menssageinformative = "";
            var keyCode = $event.which || $event.keyCode;
            var datavalor = vm.valueKey(keyCode);
            vm.keys = "";
            if (vm.Listcelular[datavalor] !== undefined) {
              if (vm.total < vm.numbermax) {
                if (vm.Listcelular[datavalor].sum) {
                  vm.total = vm.total + 1;
                }
                vm.entryKeys = vm.entryKeys + 1;
                vm.Listcelular[datavalor].result =
                  vm.Listcelular[datavalor].result + 1;
              } else {
                vm.audio.play();
              }
            } else {
              vm.audio.play();
            }
          }
          vm.getEditMotives = getEditMotives;
          function getEditMotives() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return motiveDS.getMotiveByState(auth.authToken, true).then(
              function (data) {
                if (data.status === 200) {
                  vm.editMotives = $filter("filter")(data.data, {
                    type: { id: "17" },
                  });
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          vm.valueKey = valueKey;
          function valueKey(keyCode) {
            if (keyCode === 48 || keyCode === 96) {
              return "0";
            }
            if (keyCode === 49 || keyCode === 97) {
              return "1";
            }
            if (keyCode === 50 || keyCode === 98) {
              return "2";
            }
            if (keyCode === 51 || keyCode === 99) {
              return "3";
            }
            if (keyCode === 52 || keyCode === 100) {
              return "4";
            }
            if (keyCode === 53 || keyCode === 101) {
              return "5";
            }
            if (keyCode === 54 || keyCode === 102) {
              return "6";
            }
            if (keyCode === 55 || keyCode === 103) {
              return "7";
            }
            if (keyCode === 56 || keyCode === 104) {
              return "8";
            }
            if (keyCode === 57 || keyCode === 105) {
              return "9";
            }
            if (keyCode === 106) {
              return "*";
            }
            if (keyCode === 107) {
              return "+";
            }
            if (keyCode === 109) {
              return "-";
            }
            if (keyCode === 110) {
              return ".";
            }
            if (keyCode === 111) {
              return "/";
            }
            if (keyCode === 65) {
              return "a";
            }
            if (keyCode === 66) {
              return "b";
            }
            if (keyCode === 67) {
              return "c";
            }
            if (keyCode === 68) {
              return "d";
            }
            if (keyCode === 69) {
              return "e";
            }
            if (keyCode === 70) {
              return "f";
            }
            if (keyCode === 71) {
              return "g";
            }
            if (keyCode === 72) {
              return "h";
            }
            if (keyCode === 73) {
              return "i";
            }
            if (keyCode === 74) {
              return "j";
            }
            if (keyCode === 75) {
              return "k";
            }
            if (keyCode === 76) {
              return "l";
            }
            if (keyCode === 77) {
              return "m";
            }
            if (keyCode === 78) {
              return "n";
            }
            if (keyCode === 79) {
              return "o";
            }
            if (keyCode === 80) {
              return "p";
            }
            if (keyCode === 81) {
              return "q";
            }
            if (keyCode === 82) {
              return "r";
            }
            if (keyCode === 83) {
              return "s";
            }
            if (keyCode === 84) {
              return "t";
            }
            if (keyCode === 85) {
              return "u";
            }
            if (keyCode === 86) {
              return "v";
            }
            if (keyCode === 87) {
              return "w";
            }
            if (keyCode === 88) {
              return "x";
            }
            if (keyCode === 89) {
              return "y";
            }
            if (keyCode === 90) {
              return "z";
            }
            if (keyCode === 13) {
              return "Enter";
            }
            if (keyCode === 16) {
              return "Shift";
            }
            if (keyCode === 17) {
              return "Ctrl";
            }
            if (keyCode === 18) {
              return "Alt";
            }
            if (keyCode === 27) {
              return "Esc";
            }
            if (keyCode === 32) {
              return "Space";
            }
            if (keyCode === 38) {
              return "ArrowUp";
            }
            if (keyCode === 40) {
              return "ArrowDown";
            }
            if (keyCode === 37) {
              return "ArrowLeft";
            }
            if (keyCode === 39) {
              return "ArrowRight";
            }
            if (keyCode === 8) {
              return "Backspace";
            }
            if (keyCode === 9) {
              return "Tab";
            }
            if (keyCode === 20) {
              return "Caps Lock";
            }
            if (keyCode === 46) {
              return "Delete";
            }
          }
          vm.save = save;
          function save() {
            if (vm.entryKeys !== 0) {
              if (vm.ReasonsResult) {
                if (vm.editMotives.length === 0) {
                  UIkit.modal("#advertencia-resulteditcomment", {
                    bgclose: false,
                    escclose: false,
                    modal: false,
                  }).show();
                  vm.loadingdata = false;
                } else {
                  vm.loadingdata = false;
                  var viewmodalcomment = _.filter(
                    JSON.parse(JSON.stringify($scope.testoingroup)),
                    function (o) {
                      return o.state == 2 && o.automaticResult !== o.resultedit && _.has(o, 'resultedit');
                    }
                  );
                  if (viewmodalcomment.length > 0) {
                    UIkit.modal("#modal-comment", {
                      bgclose: false,
                      escclose: false,
                      modal: false,
                    }).show();
                  } else {
                    vm.loadingdata = true;
                    $scope.testcounter = vm.Listcelular;
                    $scope.motive = "";
                    $scope.comment = "";
                    setTimeout(function () {
                      vm.loadingdata = false;
                      UIkit.modal("#rs-modal-cellularcounters").hide();
                      $scope.functionexecute();
                    }, 300);
                  }
                }
              } else {
                vm.loadingdata = true;
                $scope.testcounter = vm.Listcelular;
                $scope.motive = "";
                $scope.comment = "";
                setTimeout(function () {
                  vm.loadingdata = false;
                  UIkit.modal("#rs-modal-cellularcounters").hide();
                  $scope.functionexecute();
                }, 300);
              }
            } else {
              UIkit.modal("#rs-modal-cellularcounters").hide();
            }
          }
          vm.closemodaltestEdit = closemodaltestEdit;
          function closemodaltestEdit() {
            UIkit.modal("#modal-comment").hide();
          }
          vm.savemotive = savemotive;
          function savemotive() {
            vm.loadingdata = true;
            $scope.testcounter = vm.Listcelular;
            $scope.motive = vm.selectedMotive;
            $scope.comment = vm.reasonComment;
            setTimeout(function () {
              UIkit.modal("#modal-comment").hide();
              UIkit.modal("#rs-modal-cellularcounters").hide();
              vm.loadingdata = false;
              $scope.functionexecute();
            }, 300);
          }
          vm.closemodal = closemodal;
          function closemodal() {
            UIkit.modal("#rs-modal-cellularcounters").hide();
          }
        },
      ],
      controllerAs: "resultscellularcounters",
    };
    return directive;
  }
})();
/* jshint ignore:end */
