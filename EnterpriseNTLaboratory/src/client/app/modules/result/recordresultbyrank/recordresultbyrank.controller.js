/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.recordresultbyrank')
    .controller('recordresultbyrankController', recordresultbyrankController);


  recordresultbyrankController.$inject = ['testDS', 'literalresultDS', 'rangeresultDS', 'localStorageService',
    '$filter', '$state', '$rootScope', 'resultsentryDS', 'logger'
  ];

  function recordresultbyrankController(testDS, literalresultDS, rangeresultDS, localStorageService,
    $filter, $state, $rootScope, resultsentryDS, logger) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.getTest = getTest;
    vm.gettype = gettype;
    vm.saveresult = saveresult;
    vm.title = 'recordresultbyrank';
    $rootScope.pageview = 3;
    vm.prepotition =
      $filter("translate")("0000") === "esCo" ? "de" : "of";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0021');
    $rootScope.helpReference = '03.Result/recordresultbyrank.htm';
    vm.typeresult = 0;
    vm.validblock = validblock;
    vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
    vm.isOpenReport = false;
    vm.valid = [];
    vm.permissionuser = localStorageService.get('user');
    vm.tabresul=1;
    vm.dataTest = {
      id: '-1'
    };
    vm.order = '';
    vm.filterRange = "1";
    vm.filterRange1 = "1";
    vm.dataliteralresult = '';
    vm.decimaltest = 0;
    vm.format = 'n0';
    vm.modalError = modalError;
    vm.dataTest = [];

    function gettype() {
      vm.dataliteralresult = '';

      if (vm.dataTestid.id !== '-1') {
        var test = ($filter('filter')(vm.dataTest, {
          id: parseInt(vm.dataTestid.id)
        }, true))[0];
        vm.typeresult = test.resultType;
        if (vm.typeresult === 2) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return literalresultDS.getIdTest(auth.authToken, vm.dataTestid.id).then(function (data) {
            if (data.data.length > 0) {
              vm.dataliteralresult = ($filter('filter')(data.data, {
                assign: true
              }, true));
              if (vm.dataliteralresult.length > 0) {
                vm.typeresult = 3;
              } else {
                vm.dataliteralresult = '';
              }

            }
            vm.messageconfirm = $filter('translate')('0291');
            vm.messageconfirm = vm.messageconfirm.replace('@@@', test.name);

          });
        } else {
          vm.decimaltest = test.decimal;
          vm.format = 'n' + test.decimal;
        }
        vm.messageconfirm = $filter('translate')('0291');
        vm.messageconfirm = vm.messageconfirm.replace('@@@', test.name);
      }

    }

    vm.gettypevalid = gettypevalid;
    function gettypevalid() {
      vm.dataliteralresult = '';

      if (vm.datatestvalidated.id !== '-1') {
        var test = ($filter('filter')(vm.dataTest, {
          id: parseInt(vm.datatestvalidated.id)
        }, true))[0];
        vm.typeresult = test.resultType;
        if (vm.typeresult === 2) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return literalresultDS.getIdTest(auth.authToken, vm.datatestvalidated.id).then(function (data) {
            if (data.data.length > 0) {
              vm.dataliteralresult = ($filter('filter')(data.data, {
                assign: true
              }, true));
              if (vm.dataliteralresult.length > 0) {
                vm.typeresult = 3;
              } else {
                vm.dataliteralresult = '';
              }

            }
            vm.messageconfirm = $filter('translate')('0291');
            vm.messageconfirm = vm.messageconfirm.replace('@@@', test.name);

          });
        } else {
          vm.decimaltest = test.decimal;
          vm.format = 'n' + test.decimal;
        }
        vm.messageconfirm = $filter('translate')('0291');
        vm.messageconfirm = vm.messageconfirm.replace('@@@', test.name);
      }

    }

    function getTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        vm.dataTest = [];
        vm.getPanicSurvey();
        if (data.data.length > 0) {
          data.data.forEach(function (value) {
            vm.dataTest.push({
              'id': value.id,
              'abbr': value.abbr,
              'name': value.name,
              'code': value.code,
              'codename': value.code + ' | ' + value.name,
              'resultType': value.resultType,
              'decimal': value.decimal
            });
          });

        }
        vm.acOptions = {
          dataTextField: 'name'
        };

      });
    }


    function validblock() {
      vm.valid = [];
      var firstOrder = vm.filterRange1 === '0' ? 0 : vm.rangeInit1; //No incluye la primera orden
      var lastOrder = vm.filterRange1 === '0' ? 0 : vm.rangeEnd1; //No incluye la última  orden
      //Rango de fecha de verificación
      var firstDate = vm.filterRange1 !== '0' ? 0 : vm.rangeInit1; //No incluye la primera fecha
      var lastDate = vm.filterRange1 !== '0' ? 0 : vm.rangeEnd1;

      var auth = localStorageService.get('Enterprise_NT.authorizationData')
      var data = {
        "filterId": vm.filterRange1,
        "firstOrder": firstOrder,
        "lastOrder": lastOrder,
        "firstDate": firstDate,
        "lastDate": lastDate,
        "testList": [vm.datatestvalidated.id],
        "filterByDemo": [],
        "testStates": [2,3],
        "userId": auth.id
      }
      return resultsentryDS.getTestByOrderId(auth.authToken, data).then(function (data) {
        vm.selectAllcheck = false;
        if (data.data.length !== 0) {
          vm.valid = data.data;
        } else {
          logger.warning($filter('translate')('1830'));
        }
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });

    }

    vm.selectall = selectall;
    function selectall() {
      vm.valid.forEach(function (value) {
        value.check = vm.selectAllcheck;
      });
    }

    vm.validated = validated;
    function validated() {
      UIkit.modal('#confirmationmodalvalid').hide();
      if (vm.permissionuser.preValidationRequired) {
        vm.loading = true;
        vm.testvalidated = $filter("filter")(vm.valid, function (e) {
          return e.check
        })
        vm.porcent = 0;
        vm.index = 0;
        UIkit.modal("#modalprogressprintexport", {
          bgclose: false,
          escclose: false,
          modal: false,
        }).show();

        if (vm.testvalidated[0].grantValidate && vm.testvalidated[0].grantAccess) {
          if (vm.testvalidated[0].preliminaryValidation) {
            if (vm.permissionuser.secondValidation) {
              vm.testdevalidated();
            } else {
              logger.warning($filter('translate')('1831'));
            }
          } else {
            vm.validatedtest(true);
          }
        } else {
          logger.warning($filter('translate')('1832'));
        }
      } else {
        logger.warning($filter('translate')('1833'));
      }
    }

    vm.testdevalidated = testdevalidated;
    function testdevalidated() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var objprew = {};
      objprew.finalValidate = false;
      objprew.orderId = vm.testvalidated[vm.index].order;
      vm.testvalidated[vm.index].newState = 3;
      objprew.tests = [vm.testvalidated[vm.index]];
      objprew.questions = [];
      objprew.alarms = [];
      objprew.serial = $rootScope.serialprint;
      objprew.sex = vm.testvalidated[vm.index].patient.sex;
      objprew.race = vm.testvalidated[vm.index].patient.race;
      objprew.size = vm.testvalidated[vm.index].patient.size === undefined ? 0 : vm.testvalidated[vm.index].patient.size;
      objprew.weight = vm.testvalidated[vm.index].patient.weight === undefined ? 0 : vm.testvalidated[vm.index].patient.weight;
      objprew.questions = vm.panicQuestions;
      return resultsentryDS.validateTests(auth.authToken, objprew).then(function (data) {
        if (data.status === 200) {
          vm.prevalidatedtest(true);
        }
      }, function (error) {
        vm.loading = false;
        vm.modalError(error);
      });
    }

    vm.prevalidatedtest = prevalidatedtest;
    function prevalidatedtest(isAlarms) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var obj = {};
      obj.finalValidate = true;
      obj.orderId = vm.testvalidated[vm.index].order;
      vm.testvalidated[vm.index].newState = 4;
      obj.tests = [vm.testvalidated[vm.index]];
      obj.questions = [];
      obj.alarms = [];
      obj.serial = $rootScope.serialprint;
      obj.sex = vm.testvalidated[vm.index].patient.sex;
      obj.race = vm.testvalidated[vm.index].patient.race;
      obj.size = vm.testvalidated[vm.index].patient.size === undefined ? 0 : vm.testvalidated[vm.index].patient.size;
      obj.weight = vm.testvalidated[vm.index].patient.weight === undefined ? 0 : vm.testvalidated[vm.index].patient.weight;

      if (isAlarms) {
        return resultsentryDS.validateTestsAlarms(auth.authToken, obj).then(function (data) {
          if (data.status === 200) {
            var panicTest = $filter('filter')(data.data.tests, function (o) {
              return (o.newState == 4 && o.pathology > 3);
            });
            if (data.data.alarms.length > 0 || (vm.panicSurvey.length > 0 && panicTest.length > 0)) {
              vm.alarms = data.data.alarms;
              vm.panicTest = panicTest;
              vm.panicQuestions = angular.copy(vm.panicSurvey);
              vm.order = vm.testvalidated[vm.index].order;
              vm.openalarmvalidate = true;
            } else {
              vm.prevalidatedtest(false);
            }
          }
        }, function (error) {
          vm.loading = false;
          vm.modalError(error);
        });
      } else {
        obj.questions = vm.panicQuestions;
        return resultsentryDS.validateTests(auth.authToken, obj).then(function (data) {
          if (data.status === 200) {
            if (vm.index + 1 === vm.testvalidated.length) {
              vm.loading = false;
              UIkit.modal('#modalprogressprintexport').hide();
              vm.validblock();
            } else {
              vm.index++;
              vm.porcent = Math.round((vm.index * 100) / vm.testvalidated.length);
              vm.testdevalidated(true);
            }
          }
        }, function (error) {
          vm.loading = false;
          vm.modalError(error);
        });
      }
    }

    vm.validateTestsquestion = validateTestsquestion;
    function validateTestsquestion() {
      vm.validatedtest(false);
    }

    vm.validatedtest = validatedtest;
    function validatedtest(isAlarms) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var obj = {};
      obj.finalValidate = true;
      obj.orderId = vm.testvalidated[vm.index].order;
      vm.testvalidated[vm.index].newState = 4;
      obj.tests = [vm.testvalidated[vm.index]];
      obj.questions = [];
      obj.alarms = [];
      obj.serial = $rootScope.serialprint;
      obj.sex = vm.testvalidated[vm.index].patient.sex;
      obj.race = vm.testvalidated[vm.index].patient.race;
      obj.size = vm.testvalidated[vm.index].patient.size === undefined ? 0 : vm.testvalidated[vm.index].patient.size;
      obj.weight = vm.testvalidated[vm.index].patient.weight === undefined ? 0 : vm.testvalidated[vm.index].patient.weight;

      if (isAlarms) {
        return resultsentryDS.validateTestsAlarms(auth.authToken, obj).then(function (data) {
          if (data.status === 200) {
            var panicTest = $filter('filter')(data.data.tests, function (o) {
              return (o.newState == 4 && o.pathology > 3);
            });
            //var panicTest = data.data.tests;
            if (data.data.alarms.length > 0 || (vm.panicSurvey.length > 0 && panicTest.length > 0)) {
              vm.alarms = data.data.alarms;
              vm.panicTest = panicTest;
              vm.panicQuestions = angular.copy(vm.panicSurvey);
              vm.order = vm.testvalidated[vm.index].order;
              vm.openalarmvalidate = true;
            } else {
              vm.validatedtest(false);
            }
          }
        }, function (error) {
          vm.loading = false;
          vm.modalError(error);
        });
      } else {
        obj.questions = vm.panicQuestions;
        return resultsentryDS.validateTests(auth.authToken, obj).then(function (data) {
          if (data.status === 200) {
            if (vm.index + 1 === vm.testvalidated.length) {
              vm.loading = false;
              UIkit.modal('#modalprogressprintexport').hide();
              vm.validblock();
            } else {
              vm.index++;
              vm.porcent = Math.round((vm.index * 100) / vm.testvalidated.length);
              vm.validatedtest(true);
            }
          }
        }, function (error) {
          vm.loading = false;
          vm.modalError(error);
        });
      }
    }

    vm.getPanicSurvey = getPanicSurvey;
    function getPanicSurvey() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return resultsentryDS.getPanicSurvey(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.panicSurvey = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }




    function saveresult() {
      vm.loading = true;
      var result = vm.typeresult === 3 ? vm.literalresult.literalResult.name : vm.dataliteralresult;
      vm.comment = vm.comment === undefined || vm.comment === '' ? '' : vm.comment.replace(/span/g, 'font');
      vm.comment = vm.comment === undefined || vm.comment === '' ? '' : vm.comment.replace(new RegExp("<p>", 'g'), "<div>");
      vm.comment = vm.comment === undefined || vm.comment === '' ? '' : vm.comment.replace(new RegExp("</p>", 'g'), "</div>");

      var result = {
        'result': result,
        'comment': vm.comment,
        'rangeType': 1,
        'init': parseInt(vm.rangeInit) - 1,
        'test': vm.dataTestid.id,
        'end': parseInt(vm.rangeEnd) + 1
      };
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rangeresultDS.insertrangeresult(auth.authToken, result).then(function (data) {
        vm.loading = false;
        vm.messageinfo = data.data + '  ' + $filter('translate')('0292');
        UIkit.modal('#infomodal').show();
      }, function (error) {
        vm.modalError(error);
        vm.loading = false;
      });
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function init() {
      vm.getTest();
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */