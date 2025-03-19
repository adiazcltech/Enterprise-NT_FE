/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal       @descripción
                order           @descripción
                sample          @descripción
                dataordesample  @descripción
                functionexecute @descripción
                listtestsample  @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/takesample/takesample.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";

  angular
    .module("app.widgets")
    .directive("resultsmodalrepitition", resultsmodalrepitition);

  resultsmodalrepitition.$inject = [
    "motiveDS",
    "localStorageService",
    "$filter",
  ];
  /* @ngInject */
  function resultsmodalrepitition(motiveDS, localStorageService, $filter) {
    var directive = {
      templateUrl: "app/widgets/userControl/results-modalrepitition.html",
      restrict: "EA",
      scope: {
        openmodal: "=openmodal",
        order: "=order",
        patientinformation: "=patientinformation",
        photopatient: "=photopatient",
        listtests: "=listtests",
        functionexecute: "=functionexecute",
        ordercomplete: "=ordercomplete",
        motive: "=?motive",
        listtestsrepitition: "=?listtestsrepitition",
        comment: "=?comment",
      },

      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.getmotive = getmotive;
          vm.saverepition = saverepition;
          vm.getestinit = getestinit;
          vm.selectprofiltall = selectprofiltall;
          vm.selecttest = selecttest;

          $scope.$watch("openmodal", function () {
            vm.active = false;
            if ($scope.openmodal) {
              vm.Comment = "";
              vm.modalError = modalError;
              vm.patient = $scope.patientinformation;
              vm.photopatient = $scope.photopatient;
              vm.order = $scope.order;
              vm.selectAllcheck = false;
              vm.listTest = $scope.listtests;
              vm.photopatient = $scope.photopatient;
              vm.loading = true;
              vm.getmotive();
            }
            $scope.openmodal = false;
          });

          function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
          function getmotive() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return motiveDS.getMotiveByState(auth.authToken, true).then(
              function (data) {
                if (data.status === 200) {
                  vm.Listmotive = $filter("filter")(data.data, {
                    type: {
                      id: "18",
                    },
                  });
                  vm.motive = {
                    id: -1,
                  };
                  vm.Comment = "";
                  if (vm.Listmotive.length === 0) {
                    UIkit.modal("#rp-modalrepitition-advertencia").show();
                    vm.loading = false;
                  } else {
                    vm.getestinit($scope.sample, true);
                  }
                } else {
                  UIkit.modal("#rp-modalrepitition-advertencia").show();
                  vm.loading = false;
                }
              },
              function (error) {
                vm.modalError(error);
              }
            );
          }
          function getestinit() {
            vm.Detail = [];
            vm.listTest.forEach(function (value, key) {
              if (value.viewprofil) {
                value.testType = 1;
                value.testId = value.profileId;
                value.name = value.profileName;
                var validated = true;
                var selectcheck = $filter("filter")(
                  JSON.parse(JSON.stringify(vm.listTest)),
                  function (e) {
                    if (
                      !e.isSelected &&
                      e.profileId === value.profileId &&
                      !e.viewprofil
                    ) {
                      validated = false;
                    }
                    return e.profileId === value.profileId && !e.viewprofil;
                  }
                );
                var validatedstate = $filter("filter")(
                  JSON.parse(JSON.stringify(selectcheck)),
                  function (e) {
                    return e.state == 2 && e.sampleState !== 1;
                  }
                );
                value.viewselectall =
                  validatedstate.length === selectcheck.length ? true : false;
                value.selecprofil = validated;
                value.select = validated;
              } else {
                if (value.state === 2 && value.sampleState !== 1) {
                  value.select =
                    value.isSelected === undefined ? false : value.isSelected;
                } else {
                  value.select = false;
                }
                value.testType = 0;
                value.profileId = value.profileId;
                value.profileName = value.profileName;
                value.code = value.testCode;
                value.abbr = value.abbreviation;
                value.name = value.testName;
                value.unit = null;
                value.testState = value.state;
                value.viewrow = true;
              }
            });
            vm.Detail.tests = _.orderBy(vm.listTest, "ordersort", "asc");
            vm.loadingdata = false;
            vm.loading = false;
            UIkit.modal("#resultrepititionmodal").show();
            vm.loading = false;
          }
          function selectprofiltall(data, selecprofil) {
            data.select = selecprofil;
            angular.forEach(vm.Detail.tests, function (value) {
              if (value.profileId === data.profileId && value.testType === 0) {
                if (
                  (value.sampleState !== 1 &&
                    value.testState > 2 &&
                    !(
                      value.block.blocked ||
                      !value.grantAccess ||
                      value.sampleState === 1 ||
                      value.blockdays === true
                    )) ||
                  (value.sampleState !== 1 &&
                    value.testState > 2 &&
                    !(
                      value.block.blocked ||
                      !value.grantAccess ||
                      value.sampleState === 1 ||
                      value.blockdays === true
                    ))
                ) {
                  value.select = false;
                } else if (value.sampleState !== 1 && value.testState === 2) {
                  value.select = selecprofil;
                }
              }
            });
          }
          function selecttest(data) {
            if (vm.listTest.length === 0) {
              if (data.profile !== 0) {
                var validated = true;
                angular.forEach(vm.Detail.tests, function (value) {
                  if (
                    !value.select &&
                    value.profile === data.profile &&
                    value.testType === 0
                  ) {
                    validated = false;
                  }
                });
                angular.forEach(vm.Detail.tests, function (value) {
                  if (value.id === data.profile && value.testType !== 0) {
                    value.selecprofil = validated;
                    value.select = validated;
                  }
                });
              }
            } else {
              if (data.profileId !== 0) {
                var validated = true;
                angular.forEach(vm.listTest, function (value) {
                  if (
                    !value.select &&
                    value.profileId === data.profileId &&
                    !value.viewprofil
                  ) {
                    validated = false;
                  }
                });
                angular.forEach(vm.listTest, function (value) {
                  if (value.profileId === data.profileId && value.viewprofil) {
                    value.selecprofil = validated;
                    value.select = validated;
                  }
                });
              }
            }
          }
          function saverepition() {
            vm.loadingdata = true;
            $scope.listtestsrepitition = _.filter(
              vm.Detail.tests,
              function (o) {
                return o.testType === 0 && o.select;
              }
            );
            $scope.motive = vm.motive;
            $scope.comment = vm.Comment;
            UIkit.modal("#resultrepititionmodal").hide();
            setTimeout(function () {              
              vm.loadingdata = false;
              $scope.functionexecute();
            }, 100);
          }
        },
      ],
      controllerAs: "resultsmodalrepitition",
    };
    return directive;
  }
})();
