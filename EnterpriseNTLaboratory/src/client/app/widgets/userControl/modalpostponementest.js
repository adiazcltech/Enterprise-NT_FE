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
    .directive('modalpostponementest', modalpostponementest);

  modalpostponementest.$inject = ['motiveDS', 'sampletrackingsDS', 'localStorageService', '$filter', 'patientDS', 'common', '$rootScope'];
  /* @ngInject */
  function modalpostponementest(motiveDS, sampletrackingsDS, localStorageService, $filter, patientDS, common, $rootScope) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modalpostponementest.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        patientinformation: '=patientinformation',
        photopatient: '=photopatient',
        order: '=order',
        testcode: '=testcode',
        testname: '=testname',
        sample: '=sample',
        dataordesample: '=dataordesample',
        functionexecute: '=functionexecute',
        listtestsample: '=listtestsample',
        listtestchange: '=listtestchange',
        aplication: '=aplication'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getmotivepostponement = getmotivepostponement;

        vm.getest = getest;
        vm.Savepostponement = Savepostponement;
        vm.listTest = $scope.listtestsample === undefined ? [] : $scope.listtestsample;
        vm.selectSample = selectSample;
        vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True';
        vm.datapatient = datapatient;
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();

        $scope.$watch('openmodal', function () {
          vm.active = false;
          if ($scope.openmodal) {
            vm.Comment = '';
            vm.modalError = modalError;
            vm.patient = $scope.patientinformation;
            vm.photopatient = $scope.photopatient;
            vm.order = $scope.order;
            vm.testId = $scope.idtest;
            vm.testcode = $scope.testcode;
            vm.testname = $scope.testname;
            vm.selectAllcheck = false;
            vm.listTest = $scope.listtestsample === undefined ? [] : $scope.listtestsample;
            vm.photopatient = $scope.photopatient;
            vm.loading = true;
            vm.listSamples = [];
            if (vm.patient === undefined) {
              vm.datapatient();
            } else {
              vm.getmotivepostponement();
            }
          }
          $scope.openmodal = false;
        });

        function selectSample() {
          vm.getest(vm.sample, false);
        }

        function modalError(error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }

        function datapatient() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.patient = [];
          patientDS.getPatientObjectByOrder(auth.authToken, vm.order).then(
            function (response) {
              vm.getmotivepostponement();
              if (response.status === 200) {
                var data = response.data;
                vm.patient.typeordercolor = '#ffffff'
                vm.patient.name = data.lastName + (data.surName !== undefined && data.surName !== null ? ' ' + data.surName + ' ' : ' ') + data.name1 + (data.name2 !== undefined && data.name2 !== null ? ' ' + data.name2 : '');
                vm.patient.document = data.patientId;
                vm.patient.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate), vm.formatDate);
                vm.patient.gender = data.sex.esCo;
                vm.photopatient = data.photo !== undefined && data.photo !== null && data.photo !== '' ? data.photo : '';
                vm.patient.id = data.id;
              }
            },
            function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
            }
          );
        }

        function getmotivepostponement() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return motiveDS.getMotiveByState(auth.authToken, true).then(function (data) {
            if (data.status === 200) {
              vm.Listmotive = $filter('filter')(data.data, {
                type: {
                  id: '20'
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
                vm.getestinit($scope.sample, true);
              }
            } else {
              UIkit.modal('#rp-modal-advertencia').show();
              vm.loading = false;
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        vm.getestinit = getestinit;
        function getestinit(idSample, active) {
          vm.Detail = [];
          vm.samples = [];
    /*       vm.active = active;
          if (active) {
            vm.listTest.forEach(function (value, key) {
              if (value.viewprofil) {
                value.testType = 1;
                value.testId = value.profileId;
                value.name = value.profileName;
                var validated = true;
                var selectcheck = $filter("filter")(JSON.parse(JSON.stringify(vm.listTest)), function (e) {
                  if (!e.isSelected && e.profileId === value.profileId && !e.viewprofil) {
                    validated = false;
                  }
                  return e.profileId === value.profileId && !e.viewprofil
                })
                var validatedstate = $filter("filter")(JSON.parse(JSON.stringify(selectcheck)), function (e) {
                  return e.sampleState === 1 || e.sampleState !== 1 && e.testState >= 4
                })
                value.viewselectall = validatedstate.length === 0 ? true : false;
                value.selecprofil = validated;
                value.select = validated;
                value.sampleCode = selectcheck[0].sampleCode;
                value.order = selectcheck[0].order;
                value.sampleId = selectcheck[0].sampleId;
              } else {
                if (value.sampleState !== 1 && value.testState >= 4) {
                  value.select = false;
                } else if (value.sampleState !== 1 && value.testState < 4 || value.sampleState !== 1 && value.testState === undefined) {
                  value.select = value.isSelected;
                }
                value.testType = 0;
                value.profileId = value.profileId;
                value.profileName = value.profileName;
                value.code = value.testCode;
                value.abbr = value.abbreviation;
                value.name = value.testName;
                value.unit = null;
                value.sampleState = value.sampleState;
                value.testState = value.state;
                value.viewrow = true;
                vm.samples.push({
                  'id': value.sampleId,
                  'name': value.sampleCode + ' - ' + value.sampleName
                });
              }
            });

            var sample = {};
            vm.listSamples = vm.samples.filter(function (e) {
              return sample[e.name] ? false : (sample[e.name] = true);
            });
          }
          vm.multipleSample = true;
          if (vm.listSamples.length === 1) {
            vm.multipleSample = false;
            vm.sampleName = vm.listSamples[0].name;
            vm.sample = vm.listSamples[0].id;
            vm.Detail.push({
              'tests': vm.listTest
            });
            vm.Detail = vm.Detail[0];
          } else {
            var locate = $filter("filter")(JSON.parse(JSON.stringify(vm.listTest)), function (e) {
              return e.select;
            })
            if (locate.length === 0) {
              vm.sample = idSample === undefined ? vm.samples[0].id : idSample;

            } else {
              vm.sample = locate[0].sampleId;
              vm.changuemodel = true;
            }
            var filterTests = ($filter('filter')(vm.listTest, {
              sampleId: parseInt(vm.sample)
            }, true));

            vm.Detail.push({
              'tests': filterTests
            });
            vm.Detail = vm.Detail[0];
          } */
          vm.loadingdata = false;
          UIkit.modal('#modalpostponementestmodal').show();

        }
        function getest(idSample, active) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.Detail = [];
          if (vm.listTest.length === 0) {
            if ($scope.order !== undefined) {
              vm.loadingdata = true;
              return sampletrackingsDS.sampleorder(auth.authToken, $scope.order).then(function (data) {
                // vm.loading=false;
                if (data.status === 200) {
                  vm.active = active;

                  if (idSample !== undefined) {
                    if ($scope.aplication === 1) {
                      vm.Detail = ($filter('filter')(data.data, {
                        codesample: idSample
                      }, true))[0];
                      vm.SampleSelect = ($filter('filter')(data.data, {
                        codesample: idSample
                      }, true))[0];
                    } else {
                      vm.Detail = ($filter('filter')(data.data, {
                        id: parseInt(idSample)
                      }, true))[0];
                      vm.SampleSelect = ($filter('filter')(data.data, {
                        id: parseInt(idSample)
                      }, true))[0];
                    }
                    vm.sampleName = vm.SampleSelect.codesample + ' - ' + vm.SampleSelect.name;
                    vm.multipleSample = false;
                  } else {
                    vm.SampleSelect = data.data[0];
                    vm.Detail = data.data[0];
                    vm.listSamples = data.data;
                    vm.multipleSample = true;
                    vm.sample = data.data[0].id;
                  }
                  vm.Detail.tests = _.orderBy(vm.Detail.tests, ['profile', 'testType'], ['asc', 'asc']);
                  vm.Detail.tests.forEach(function (value, key) {
                    if (value.testType !== 0) {
                      value.testId = value.id;
                      value.profileName = value.name;
                      value.viewprofil = true;
                      var validatedstate = $filter("filter")(JSON.parse(JSON.stringify(vm.Detail.tests)), function (e) {
                        return e.sampleState === 1 || e.sampleState !== 1 && e.testState >= 4 && e.profileId === value.profileId && e.testType === 0
                      })
                      value.viewselectall = validatedstate.length === 0 ? true : false;
                      vm.Detail.tests[key].sampleState = value.result.sampleState;
                      vm.Detail.tests[key].testState = value.result.state;
                      vm.Detail.tests[key].unit = null;
                      vm.Detail.tests[key].viewrow = true;
                      value.selecprofil = false;
                      value.select = false;
                    } else {
                      if (value.sampleState !== 1 && value.testState >= 4) {
                        vm.Detail.tests[key].select = false
                      } else if (value.sampleState === 1) {
                        vm.Detail.tests[key].select = true
                      }
                      vm.Detail.tests[key].select = false;
                      vm.Detail.tests[key].viewprofil = false;
                      vm.Detail.tests[key].sampleState = value.result.sampleState;
                      vm.Detail.tests[key].testState = value.result.state;
                      vm.Detail.tests[key].unit = null;
                      vm.Detail.tests[key].viewrow = true;
                    }
                  });
                  vm.loadingdata = false;
                }
              }, function (error) {
                vm.modalError(error);
              });
            }
          } else {
            vm.samples = [];
            vm.active = active;
            if (active) {
              vm.listTest.forEach(function (value, key) {
                if (value.viewprofil) {
                  value.testType = 1;
                  value.testId = value.profileId;
                  value.name = value.profileName;
                  var validated = true;
                  var selectcheck = $filter("filter")(JSON.parse(JSON.stringify(vm.listTest)), function (e) {
                    if (!e.isSelected && e.profileId === value.profileId && !e.viewprofil) {
                      validated = false;
                    }
                    return e.profileId === value.profileId && !e.viewprofil
                  })
                  var validatedstate = $filter("filter")(JSON.parse(JSON.stringify(selectcheck)), function (e) {
                    return e.sampleState === 1 || e.sampleState !== 1 && e.testState >= 4
                  })
                  value.viewselectall = validatedstate.length === 0 ? true : false;
                  value.selecprofil = validated;
                  value.select = validated;
                  value.sampleCode = selectcheck[0].sampleCode;
                  value.order = selectcheck[0].order;
                  value.sampleId = selectcheck[0].sampleId;
                } else {
                  if (value.sampleState !== 1 && value.testState >= 4) {
                    value.select = false;
                  } else if (value.sampleState !== 1 && value.testState < 4 || value.sampleState !== 1 && value.testState === undefined) {
                    value.select = value.isSelected;
                  }
                  value.testType = 0;
                  value.profileId = value.profileId;
                  value.profileName = value.profileName;
                  value.code = value.testCode;
                  value.abbr = value.abbreviation;
                  value.name = value.testName;
                  value.unit = null;
                  value.sampleState = value.sampleState;
                  value.testState = value.state;
                  value.viewrow = true;
                  vm.samples.push({
                    'id': value.sampleId,
                    'name': value.sampleCode + ' - ' + value.sampleName
                  });
                }
              });

              var sample = {};
              vm.listSamples = vm.samples.filter(function (e) {
                return sample[e.name] ? false : (sample[e.name] = true);
              });
            }
            vm.multipleSample = true;
            if (vm.listSamples.length === 1) {
              vm.multipleSample = false;
              vm.sampleName = vm.listSamples[0].name;
              vm.sample = vm.listSamples[0].id;
              vm.Detail.push({
                'tests': vm.listTest
              });
              vm.Detail = vm.Detail[0];
            } else {
              vm.sample = idSample === undefined ? vm.samples[0].id : idSample;
              var filterTests = ($filter('filter')(vm.listTest, {
                sampleId: parseInt(vm.sample)
              }, true));
              vm.Detail.push({
                'tests': filterTests
              });
              vm.Detail = vm.Detail[0];
            }
            vm.loadingdata = false;
          }
        }

        vm.selectprofiltall = selectprofiltall;

        function selectprofiltall(data, selecprofil) {
          data.select = selecprofil;
          if (vm.listTest.length === 0) {
            angular.forEach(vm.Detail.tests, function (value) {
              if (value.profile === data.id && value.testType === 0) {
                if (value.sampleState !== 1 && value.testState >= 4) {
                  value.select = false;
                } else if (value.sampleState !== 1 && value.testState < 4 || value.sampleState !== 1 && value.testState === undefined) {
                  value.select = selecprofil;
                }
              }
            });
          } else {
            angular.forEach(vm.listTest, function (value) {
              if (value.profileId === data.profileId && !value.viewprofil) {
                if (value.sampleState !== 1 && value.testState >= 4) {
                  value.select = false;
                } else if (value.sampleState !== 1 && value.testState < 4 || value.sampleState !== 1 && value.testState === undefined) {
                  value.select = selecprofil;
                }
              }
            });
          }
        }


        vm.selecttest = selecttest;

        function selecttest(data) {
          if (vm.listTest.length === 0) {
            if (data.profile !== 0) {
              var validated = true;
              angular.forEach(vm.Detail.tests, function (value) {
                if (!value.select && value.profile === data.profile && value.testType === 0) {
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
                if (!value.select && value.profileId === data.profileId && !value.viewprofil) {
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


        function Savepostponement() {
          vm.loadingdata = true;
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          var samples = [];
          if (vm.listTest.length !== 0) {
            var assignadetest = $filter('filter')(JSON.parse(JSON.stringify(vm.listTest)), {
              select: true
            })
            samples = _.uniqBy(JSON.parse(JSON.stringify(assignadetest)), 'sampleId');
            vm.RowsData = samples;
          }
          if (vm.listTest.length === 0 || samples.length === 1) {
            var codesample = vm.listTest.length === 0 ? vm.Detail.codesample : vm.listTest[0].sampleCode;
            return sampletrackingsDS
              .sampletrackings(auth.authToken, vm.order, codesample)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.assignadetest = $filter('filter')(vm.Detail.tests, {
                      select: true
                    })
                    vm.savetests = [];
                    if (vm.listTest.length > 0) {
                      vm.assignadetest.forEach(function (value, key) {
                        vm.savetests.push({
                          'id': value.testId,
                          'order': value.order,
                          'sampleId': value.sampleCode,
                          'testType': value.testType
                        });
                      });
                    } else {
                      /*  vm.savetests = vm.assignadetest; */
                      vm.savetests = $filter('filter')(vm.Detail.tests, {
                        select: true
                      });
                    }
                    var postponement = {
                      'comment': vm.Comment,
                      'tests': vm.savetests,
                      'motive': {
                        'id': vm.motive.id,
                        'name': vm.motive.name
                      }
                    };
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    if (vm.listTest.length > 0) {
                      return sampletrackingsDS.sampleretake(auth.authToken, vm.savetests[0].order, vm.savetests[0].sampleId, postponement).then(function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                          $scope.dataordesample = data.data;
                          $scope.listtestchange = vm.savetests;
                          UIkit.modal('#modalpostponementestmodal').hide();
                          setTimeout(function () {
                            $rootScope.cantretakeview = true;
                            $scope.functionexecute();
                          }, 100);
                        }
                      }, function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                      });
                    } else {
                      vm.sample = $scope.sample === undefined ? vm.sample : $scope.sample;
                      return sampletrackingsDS.sampleretake(auth.authToken, $scope.order, vm.sample, postponement).then(function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                          $scope.dataordesample = data.data;
                          $scope.listtestchange = vm.savetests;
                          UIkit.modal('#modalpostponementestmodal').hide();
                          setTimeout(function () {
                            $rootScope.cantretakeview = true;
                            $scope.functionexecute();
                          }, 100);
                        }
                      }, function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                      });
                    }
                  }
                  vm.loading = false;
                },
                function (error) {
                  vm.loading = false;
                }
              );
          } else {
            vm.countData = 0;
            vm.Savepostponementall();
          }
        }

        vm.Savepostponementall = Savepostponementall;
        function Savepostponementall() {
          if (vm.countData < vm.RowsData.length) {
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return sampletrackingsDS
              .sampletrackings(auth.authToken, vm.order, vm.RowsData[vm.countData].sampleCode)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.assignadetest = $filter("filter")(JSON.parse(JSON.stringify(vm.listTest)), function (e) {
                      return e.select === true && e.sampleCode === vm.RowsData[vm.countData].sampleCode;
                    });
                    vm.savetests = [];
                    vm.assignadetest.forEach(function (value, key) {
                      vm.savetests.push({
                        'id': value.testId,
                        'order': value.order,
                        'sampleId': value.sampleCode
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
                        vm.countData++;
                        vm.Savepostponementall();
                      }
                    }, function (error) {
                    });
                  }
                },
                function (error) {
                  vm.loading = false;
                }
              );
          }
          else if (vm.countData === vm.RowsData.length) {
            vm.loadingdata = false;
            UIkit.modal('#modalpostponementestmodal').hide();
            setTimeout(function () {
              $rootScope.cantretakeview = true;
              $scope.functionexecute();
            }, 100);
          }
        }


      }],
      controllerAs: 'modalpostponementest'
    };
    return directive;
  }
})();
