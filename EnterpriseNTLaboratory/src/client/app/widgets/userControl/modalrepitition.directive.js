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
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalrepitition', modalrepitition);

  modalrepitition.$inject = ['motiveDS', 'sampletrackingsDS', 'localStorageService', '$filter', '$rootScope', 'logger'];
  /* @ngInject */
  function modalrepitition(motiveDS, sampletrackingsDS, localStorageService, $filter, $rootScope, logger) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modal-repitition.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        order: '=order',
        patientinformation: '=patientinformation',
        photopatient: '=photopatient',
        listtests: '=listtests',
        functionexecute: '=functionexecute',
        ordercomplete: '=ordercomplete'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getmotivepostponement = getmotivepostponement;
        vm.Savepostponementall = Savepostponementall;
        vm.modalError = modalError;

        $scope.$watch('openmodal', function () {
          vm.active = false;
          if ($scope.openmodal) {
            vm.Comment = '';
            vm.listTest = $scope.listtests === undefined ? [] : JSON.parse(JSON.stringify($scope.listtests));
            if ($scope.ordercomplete) {
              angular.forEach(vm.listTest, function (item) {
                angular.forEach(item, function (dataitem) {
                  if (!dataitem.viewprofil) {
                    if (dataitem.block.blocked || !dataitem.grantAccess || dataitem.sampleState === 1 || dataitem.blockdays === true || dataitem.state !== 2) {
                      dataitem.isSelected = false;
                    } else {
                      dataitem.isSelected = true;
                    }
                  }
                });
              });
            } else {
              angular.forEach(vm.listTest, function (item) {
                angular.forEach(item, function (dataitem) {
                  if (!dataitem.viewprofil) {
                    if (dataitem.state !== 2) {
                      dataitem.isSelected = false;
                    }
                  }
                });
              });
            }
            vm.patient = $scope.patientinformation;
            vm.photopatient = $scope.photopatient;
            vm.order = $scope.order;
            vm.photopatient = $scope.photopatient;
            vm.loading = true;
            vm.getmotivepostponement();
          }
          $scope.openmodal = false;
        });

        function getmotivepostponement() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return motiveDS.getMotiveByState(auth.authToken, true).then(function (data) {
            if (data.status === 200) {
              vm.Listmotive = $filter('filter')(data.data, {
                type: {
                  id: '18'
                }
              });
              vm.motive = {
                'id': -1
              };
              vm.Comment = '';
              if (vm.Listmotive.length === 0) {
                UIkit.modal('#rp-modal-advertencia').show();
                vm.loading = false;
              } else {
                UIkit.modal('#repititionmodal').show();
                vm.loading = false;
              }
            } else {
              UIkit.modal('#rp-modal-advertencia').show();
              vm.loading = false;
            }
          }, function (error) {
            vm.modalError(error);
          });
        }
        function modalError(error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
        function Savepostponementall() {
          if (vm.countData < vm.RowsData.length) {
            vm.assignadetest = $filter("filter")(JSON.parse(JSON.stringify(vm.listTest)), function (e) {
              return e.select === true && e.sampleCode === vm.RowsData[vm.countData].sampleCode;
            });
            vm.savetests = [];
            vm.assignadetest.forEach(function (value, key) {
              vm.savetests.push({
                'id': value.testId,
                'order': value.order,
                'sampleId': value.sampleCode,
                'testType': value.testType,
                'code': value.testType != 0 ? "" : value.testCode,
                'name': value.testType != 0 ? value.profileName : value.testName,
                'profileId': value.testType != 0 ? 0 : value.profileId,
                'profile': value.testType != 0 ? 0 : value.profileId,
                'result': {
                  'result': value.result
                }
              });
            });
            var postponement = {
              'comment': vm.Comment,
              'tests': vm.savetests,
              'motive': {
                'id': vm.motive.id,
                'name': vm.motive.name
              }
            };
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return sampletrackingsDS.sampleretake(auth.authToken, vm.savetests[0].order, vm.savetests[0].sampleId, postponement).then(function (data) {
              if (data.status === 200) {
                $scope.dataordesample = data.data;
                $scope.listtestchange = vm.savetests;
                var auth = localStorageService.get("Enterprise_NT.authorizationData");
                return sampletrackingsDS
                  .sampletrackings(auth.authToken, vm.order, vm.RowsData[vm.countData].sampleCode)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.countData++;
                        vm.Savepostponementall();
                      }
                    },
                    function (error) {
                      vm.loading = false;
                    }
                  );
              }
            }, function (error) {
              if (error.data.errorFields[0] === '4') {
                UIkit.modal('#postponementmodal').hide();
                vm.loading = false;
                logger.warning("La muestra no a sido verificada en esta sede");
                setTimeout(function () {
                  $rootScope.cantretakeview = true;
                  $scope.functionexecute();
                }, 100);

              } else {
                vm.loadingdata = false;
                vm.modalError(error);
              }
            });
          } else if (vm.countData === vm.RowsData.length) {
            UIkit.modal('#postponementmodal').hide();
            vm.loading = false;
            setTimeout(function () {
              $rootScope.cantretakeview = true;
              $scope.functionexecute();
            }, 100);
          }
        }

      }],
      controllerAs: 'modalrepitition'
    };
    return directive;
  }
})();
