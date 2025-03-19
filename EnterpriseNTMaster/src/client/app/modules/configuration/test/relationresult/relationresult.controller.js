(function () {
  'use strict';

  angular
    .module('app.relationresult')
    .controller('RelationresultController', RelationresultController)
    .controller('deleterelationresultController', deleterelationresultController)
    .controller('newrelationresult', newrelationresult)
    .controller('dependencerelationresultController', dependencerelationresultController);

  RelationresultController.$inject = ['alarmDS', 'answerDS', 'relationresultDS', 'questionDS', 'ModalService', 'listDS', 'testDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', '$rootScope', 'literalresultDS', 'LZString', '$translate'
  ];

  function RelationresultController(alarmDS, answerDS, relationresultDS, questionDS, ModalService, listDS, testDS, configurationDS, localStorageService, logger,
    $filter, $state, $rootScope, literalresultDS, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.loadingdata = true;
    vm.title = 'Relationresult';
    vm.name = ['name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.Detail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.isDisabledAdd = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getListType = getListType;
    vm.literalresult = literalresult;
    vm.question = question;
    vm.answerQuestion = answerQuestion;
    vm.getTestid = getTestid;
    vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.getId = getId;
    vm.New = New;
    vm.update = update;
    vm.destroy = destroy;
    vm.modalrequired = modalrequired;
    vm.labeltest = $filter('translate')('0288');
    vm.labelquestion = $filter('translate')('0595');
    vm.labeland = $filter('translate')('0878');
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;

    //** Metodo muestra la ventana modal que elimina la relación**//
    function destroy(uno) {
      ModalService.showModal({
        templateUrl: 'delete.html',
        controller: 'deleterelationresultController',
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result === 'Yes') {
            vm.listTest.splice(uno, 1);
            vm.update();
          }
        });
      });
    }
    //** Metodo para preparar el JSON para imprimir el reporte**//
    function generateFile() {
      if (vm.listTest.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'name': vm.name
        };
        vm.datareport = vm.listTest;
        vm.pathreport = '/report/configuration/test/relationresult/relationresult.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = vm.auth.userName;
      });
      return data.data;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      if (vm.auth === null || vm.auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      return configurationDS.getConfigurationKey(vm.auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getListType();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene la lista de operadores
    function getListType() {
      return listDS.getList(vm.auth.authToken, 49).then(function (data) {
        vm.literalresult();
        var typeoperator = [];
        if (($filter('translate')('0000')) === 'esCo') {
          data.data.forEach(function (value, key) {
            if (value.id !== 57) {
              var object = {
                id: value.id,
                name: value.esCo
              };
              typeoperator.push(object);
            }
          });
        } else {
          data.data.forEach(function (value, key) {
            if (value.id !== 57) {
              var object = {
                id: value.id,
                name: value.enUsa
              };
              typeoperator.push(object);
            }
          });
        }
        vm.operator = typeoperator;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene la lista de resultados literales
    function literalresult() {
      return literalresultDS.get(vm.auth.authToken).then(function (data) {
        vm.question();
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            var object = {
              id: value.id,
              name: value.name
            };
            data.data[key].literalResult = object;
          });
          vm.listestresul = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene la lista de preguntas
    function question() {
      vm.lisquestion = [];
      return questionDS.getQuestionActive(vm.auth.authToken).then(function (data) {
        vm.answerQuestion();
        if (data.status === 200) {
          vm.lisquestion = $filter('filter')(data.data, {
            open: false
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene la lista de respuestas
    function answerQuestion() {
      vm.listanswer = [];
      return answerDS.getAnswer(vm.auth.authToken).then(function (data) {
        vm.getTestid();
        if (data.status === 200) {
          vm.listanswer = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //función que obtiene una lista de pruebas
    function getTestid() {
      vm.listest2 = [];
      return testDS.getTestArea(vm.auth.authToken, 0, 1, 0).then(function (data) {
        vm.get();
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            data.data[key].areaname = data.data[key].area.name;
          });
          vm.listest2 = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      vm.loadingdata = true;
      vm.data = []
      return alarmDS.getActive(vm.auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          vm.modalrequired();
        } else {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que muestra el popup de los requeridos**//
    function modalrequired() {
      if (vm.data.length === 0 || vm.lisquestion.length === 0 || vm.listanswer.length === 0 || vm.listest2.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'dependencerelationresultController',
          inputs: {
            hidealarm: vm.data.length,
            hidequestion: vm.lisquestion.length,
            hideanswer: vm.listanswer.length,
            hidetest: vm.listest2.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, name) {
      vm.name = name;
      vm.selected = id;
      vm.listTest = [];
      vm.alarm = id;
      vm.loadingdata = true;
      return relationresultDS.getId(vm.auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            data.data[key].typename = data.data[key].type === 1 ? vm.labeltest : vm.labelquestion;
            data.data[key].operatorname = $filter('filter')(vm.operator, {
              id: parseInt(value.operator)
            })[0].name;

            if (value.type === 1) {
              data.data[key].name = $filter('filter')(vm.listest2, {
                id: value.test.id
              }, true)[0].name;

              if (data.data[key].test.resultType === 2) {
                data.data[key].value = data.data[key].operatorname + ' ' + value.result;
              } else {
                var result = data.data[key].result2 === '' ? '' : ' ' + vm.labeland + ' ';
                data.data[key].value = data.data[key].operatorname + ' ' + data.data[key].result + result + data.data[key].result2;
              }
            } else {
              data.data[key].name = data.data[key].question.question;
              data.data[key].resultname = $filter('filter')(vm.listanswer, {
                id: parseInt(value.result)
              })[0].name;
              data.data[key].value = data.data[key].operatorname + ' ' + data.data[key].resultname;

            }
          });
          vm.listTest = data.data;
        }
        vm.isDisabledAdd = false;
        vm.isDisabledSave = false;
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New() {
      var objectresult = {
        'result': null,
        'result2': null,
        'listoperator': {
          'id': null,
        },
        'listanswer': {
          'id': null,
        },
        'listestresul': {
          'id': null,
        },
        'type': 1,
        'operator': {
          'id': null,
        },
        'test': {
          'id': null,
        }
      };
      ModalService.showModal({
        templateUrl: 'new.html',
        controller: 'newrelationresult',
        inputs: {
          listoperatororigin: vm.operator,
          listresult: objectresult,
          test1: vm.test1,
          testtype: vm.testtype,
          listest2: vm.listest2,
          stepdecimal: vm.stepdecimal,
          decimal: vm.decimal,
          lisquestion: vm.lisquestion
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {

          if (result.listresult.type === 1) {
            vm.loadingdata = true;
            var resul = result;
            if (result.listresult.test.resultType === 1) {
              var record = {
                'test': result.listresult.test,
                'operator': result.listresult.operator.id + '',
                'type': result.listresult.type,
                'result': result.listresult.result + '',
                'result2': result.listresult.result2 + ''
              }
            } else {
              var record = {
                'test': result.listresult.test,
                'operator': result.listresult.operator.id + '',
                'type': result.listresult.type,
                'result': result.listresult.result.literalResult === undefined ? result.listresult.result : result.listresult.result.literalResult.name,
                'result2': result.listresult.result2 + ''
              }
            }
          } else {
            var record = {
              'question': result.listresult.question,
              'operator': result.listresult.operator.id + '',
              'type': result.listresult.type,
              'result': result.listresult.result.id + '',
              'result2': result.listresult.result2 + ''
            }
          }
          vm.listTest.push(record);
          vm.update();
        });
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var result = {
        'id': vm.alarm,
        'state': true,
        'rules': vm.listTest,
        'user': {
          'id': auth.id
        }
      };
      return relationresultDS.New(auth.authToken, result).then(function (data) {
        if (data.status === 200) {
          vm.getId(vm.alarm, vm.selected)
          logger.success($filter('translate')('0042'));
        }
      }, function (error) {
        vm.modalError(error);

      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  // Método mostrar la ventana modal de eliminar una relación
  function deleterelationresultController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  // Método mostrar la ventana modal de dependencias
  function dependencerelationresultController($scope, hidealarm, hidequestion, hideanswer, hidetest, close) {
    $scope.hidealarm = hidealarm;
    $scope.hidequestion = hidequestion;
    $scope.hideanswer = hideanswer;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  // Método mostrar la ventana modal de agregar la relación de resultados
  function newrelationresult($scope, lisquestion, questionDS, localStorageService, $filter, literalresultDS, close, listoperatororigin, listresult, test1, listest2, testtype) {
    $scope.listresult = listresult;
    $scope.test1 = test1;
    $scope.listest2 = listest2;
    $scope.disablecontrols = disablecontrols;
    $scope.stepdecimal = 0;
    $scope.decimal = 0;
    $scope.listoperatororigin = listoperatororigin;
    $scope.testtype = testtype;
    $scope.changelistoperator = changelistoperator;
    $scope.literalresultfiltertest = literalresultfiltertest;
    $scope.lisquestion = lisquestion;
    $scope.answerQuestion = answerQuestion;
    $scope.cleancontrol = cleancontrol;
    $scope.listoperatorquestion = [{
      'id': 50,
      'name': '='
    }, {
      'id': 55,
      'name': '<>'
    }];

    function changelistoperator() {
      $scope.listoperator = [];
      $scope.listresult.operator.id = null;
      $scope.listresult.result = null;
      $scope.listresult.result2 = null;
      if ($scope.listresult.test.resultType === 1) {
        $scope.listoperator = listoperatororigin;
        $scope.decimal = $scope.listresult.test.decimal;
        if ($scope.decimal > 0) {
          $scope.stepdecimal = '0.'
          for (var i = 0; i < $scope.decimal - 1; i++) {
            $scope.stepdecimal = $scope.stepdecimal + '0';
          }
          $scope.stepdecimal = $scope.stepdecimal + '1';
        } else {
          $scope.stepdecimal = '0'
        }
        $scope.stepdecimal = Number($scope.stepdecimal);
      } else {
        $scope.listoperator = [{
          'id': 50,
          'name': '='
        }, {
          'id': 55,
          'name': '<>'
        }];
        $scope.literalresultfiltertest($scope.listresult.test.id);
      }
    }

    function cleancontrol() {
      $scope.listoperator = [];
      $scope.listresult.test = null;
      $scope.listresult.operator.id = null;
      $scope.listresult.result = null;
      $scope.listresult.result2 = null;
      $scope.listresult.question = null;
    }

    function literalresultfiltertest(id) {
      $scope.listestresul = []
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return literalresultDS.getIdTest(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          $scope.listestresul = $filter('filter')(data.data, {
            assign: true
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function answerQuestion() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return questionDS.getQuestionId(auth.authToken, listresult.question.id).then(function (data) {
        if (data.status === 200) {
          $scope.listanswer = $filter('filter')(data.data.answers, {
            selected: true
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function disablecontrols(validate) {
      if ($scope.listresult.type === null) {
        return true;
      } else {
        if ($scope.listresult.type === "1" || $scope.listresult.type === 1) {
          if ($scope.listresult.test !== null) {
            if ($scope.listresult.type === 2) {

              if ($scope.listresult.operator === null || $scope.listresult.result === null) {
                return true;
              } else {
                return false;
              }
            } else {

              if ($scope.listresult.operator.id === 56) {
                if ($scope.listresult.operator.id === null || $scope.listresult.result === null || $scope.listresult.result === '' || $scope.listresult.result2 === null || $scope.listresult.result2 === '' || $scope.listresult.result >= $scope.listresult.result2) {
                  return true;
                } else {
                  return false;
                }

              } else {
                if ($scope.listresult.operator.id === null || $scope.listresult.result === '' || $scope.listresult.result === null) {
                  return true;
                } else {
                  return false;
                }
              }

            }
          } else {
            return true;
          }
        } else {

          if ($scope.listresult.result === null || $scope.listresult.question === null || $scope.listresult.operator.id === null) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    $scope.close = function () {
      close({
        listresult: $scope.listresult,
        listanswer: $scope.listanswer,
        listoperator: $scope.listoperator,
        listestresul: $scope.listestresul
      }, 500);
    };
  }
})();
