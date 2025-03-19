(function () {
  'use strict';
  angular
    .module('app.question')
    .controller('questionController', questionController)
  questionController.$inject = ['questionDS', 'answerDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope'
  ];

  function questionController(questionDS, answerDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'question';
    vm.question = ['question', 'openname', 'state'];
    vm.openname = ['openname', 'question', 'state'];
    vm.state = ['-state', '+question', '+openname'];
    vm.sortReverse = false;
    vm.sortType = vm.question;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getAnswer = getAnswer;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.changeTypeQuestion = changeTypeQuestion;
    vm.insertAnswer = insertAnswer;
    vm.updateAnswer = updateAnswer;
    vm.modalError = modalError;
    vm.modalErrorAnswer = modalErrorAnswer;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    var auth;
    vm.Repeatname = false;
    vm.Repeatquestion = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.selectAnswer = selectAnswer;
    vm.OrderListAnswer = OrderListAnswer;
    vm.newAnswer = newAnswer;
    vm.validAnswer = validAnswer;
    vm.answeredit = {
      value: -1
    };
    vm.Detail.open = true;
    vm.Detail.control = -1;
    vm.loadingdata = true;
    vm.one = $filter('translate')('0429');
    vm.two = $filter('translate')('0430');
    vm.tres = $filter('translate')('0178');
    vm.four = $filter('translate')('0072');
    vm.five = $filter('translate')('0623');
    vm.six = $filter('translate')('0624');

    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return questionDS.getQuestion(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.Repeatname = false;
      vm.Repeatquestion = false;
      vm.RepeatnameAnswer = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.selectCant = 0;
      vm.answeredit.value = -1;
      Form.$setUntouched();
      vm.loadingdata = true;
      return questionDS.getQuestionId(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.search1 = '';
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.Detail.answers.sort(vm.OrderListAnswer);
          console.log(vm.Detail.control)
          vm.Detail.answers.forEach(function (value, key) {
            if (vm.Detail.answers[key].selected) {
              vm.selectCant = vm.selectCant + 1;
            }

          });
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que  Obtiene las repuestas si se selecciona de tipo lista**//
    function getAnswer() {
      vm.loadingdata = true;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return answerDS.getAnswer(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        if (data.data.length > 0) {
          vm.Detail.answers = data.data;
          vm.Detail.answers.sort(vm.OrderListAnswer);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.answeredit.value = -1;

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail = {
        "id": null,
        "name": "",
        "question": "",
        "open": true,
        "control": 1,
        "state": true,
        "answers": [],
        "lastTransaction": null,
        "user": {
          "id": auth.id
        }
      }
      vm.selectCant = 0;
      vm.stateButton('add');
    }
    //** Método para crear una nueva respuesta**//
    function newAnswer(q) {
      if (vm.RepeatnameAnswer === true) {
        var repeat = $filter('filter')(vm.Detail.answers, function (e) {
          return e.name === vm.Detail.answers[vm.answeredit.value].name
        });
        if (repeat.length === 2) {
          vm.RepeatnameAnswer = true;
          return;
        } else {
          vm.RepeatnameAnswer = false;
        }
      }
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.answeredit.value = vm.answeredit.value === undefined ? -1 : vm.answeredit.value;
      if (vm.answeredit.value === -1) {
        var object = {
          "id": null,
          "name": "",
          "state": true,
          "selected": false,
          "quantity": 0,
          "lastTransaction": null,
          "user": {
            "id": auth.id
          }
        };
        vm.Detail.answers.push(object);
        vm.answeredit.value = vm.Detail.answers.length - 1;
      } else {
        if (vm.Detail.answers[vm.answeredit.value].name === '') {
          vm.erroranswer = true;
        } else {
          var object = {
            "id": null,
            "name": "",
            "state": true,
            "selected": false,
            "quantity": 0,
            "lastTransaction": null,
            "user": {
              "id": auth.id
            }
          };
          vm.Detail.answers.push(object);
          vm.answeredit.value = vm.Detail.answers.length - 1;
        }
      }
      setTimeout(function () {
        var p = document.getElementById('contenanswer')
        p.scrollTop = p.scrollHeight - p.clientHeight;
        angular.element('#answernull').focus();
      }, 100);
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.answeredit.value = -1;
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.loadingdata = true;
      vm.answeredit.value = -1;
      if (vm.RepeatnameAnswer === true) {
        vm.RepeatnameAnswer = false;
        vm.Detail.answers.splice(vm.answeredit.length - 1, 1);
      }
      if (vm.Detail.control === 5 || vm.Detail.control === 6) {
        vm.Detail.open = false;
      } else {
        vm.Detail.answer = [];
      }

      //vm.Detail.answer = vm.Detail.open ? [] : vm.Detail.answer;
      Form.$setUntouched();
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return questionDS.newQuestion(auth.authToken, vm.Detail).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice e inserta**//
    function insertAnswer(index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return answerDS.newAnswer(auth.authToken, vm.Detail.answers[vm.answeredit.value]).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.Detail.answers[vm.Detail.answers.length - 1].id = vm.answeredit.value + 1;
          vm.answeredit.value = -1;
        }
      }, function (error) {
        vm.modalErrorAnswer(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return questionDS.updateQuestion(auth.authToken, vm.Detail).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice e inserta**//
    function updateAnswer(index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return answerDS.updateAnswer(auth.authToken, vm.Detail.answers[vm.answeredit.value]).then(function (data) {
        if (data.status === 200) {
          vm.answeredit.value = index;
        }
      }, function (error) {
        vm.modalErrorAnswer(error, index);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeatname = false;
      vm.Repeatquestion = false;
      Form.$setUntouched();

      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
        vm.Detail.open = true;
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Método que valida si la respuesta a sido creada**//
    function validAnswer(index) {
      vm.RepeatnameAnswer = false;
      var repeat = $filter('filter')(vm.Detail.answers, function (e) {
        return e.name === vm.Detail.answers[vm.answeredit.value].name
      });
      if (repeat.length === 2) {
        vm.RepeatnameAnswer = true;
        return;
      } else {
        vm.RepeatnameAnswer = false;
      }

      vm.answeredit.value = vm.answeredit.value === undefined ? -1 : vm.answeredit.value;
      if (vm.answeredit.value !== -1) {

        if (vm.Detail.answers[vm.Detail.answers.length - 1].id === null && vm.answeredit.value === vm.Detail.answers.length - 1 && vm.Detail.answers[vm.answeredit.value].name === '') {
          vm.Detail.answers.splice(vm.answeredit.value, 1);

          vm.answeredit.value = -1;
          vm.erroranswer = false;
        } else if (vm.Detail.answers[vm.answeredit.value].id !== null && vm.Detail.answers[vm.answeredit.value].name === '') {
          if (vm.valueant !== '') {
            vm.Detail.answers[vm.answeredit.value].name = vm.valueant;

          }
        } else if (vm.Detail.answers[vm.answeredit.value].name !== '') {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.Detail.answers[vm.answeredit.value].user.id = auth.id;



          if (vm.Detail.answers[vm.answeredit.value].id === null) {
            if (vm.valueant !== vm.Detail.answers[vm.answeredit.value].name) {
              vm.insertAnswer(index);
            } else {
              vm.answeredit.value = index;
            }
          } else {

            setTimeout(function () {
              angular.element('#answer' + vm.Detail.answers[index].id).focus();
            }, 100);

            if (vm.valueant !== vm.Detail.answers[vm.answeredit.value].name) {
              vm.updateAnswer(index);
            } else {
              vm.answeredit.value = index;
            }
          }
        } else {
          vm.erroranswer = false;
          vm.answeredit.value = index;
        }
      } else {
        vm.erroranswer = false;
        vm.answeredit.value = index
      }
    }
    //** Método que valida cuando cambia el tipo de pregunta**//
    function changeTypeQuestion(control) {
      vm.get();
      vm.listControl = [];
      vm.answeredit.value = -1;
      vm.Detail.control = control;
      if (vm.Detail.control === 6 || vm.Detail.control === 5) {
        vm.getAnswer();
      }

    }
    //** Método para ordenar las  repuestas**//
    function OrderListAnswer(a, b) {
      if (a.selected > b.selected) {
        return -1;
      } else if (a.selected < b.selected) {
        return 1;
      } else {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    //** Método que valida cuando selecciona las respuestas**//
    function selectAnswer(value) {
      vm.answeredit = {
        value: -1
      };
      if (value) {
        vm.selectCant = vm.selectCant + 1;
      } else if (!value) {
        vm.selectCant = vm.selectCant - 1;
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.openname = value.open === true ? $filter('translate')('0597') : $filter('translate')('0598');
        value.searchall = value.question + value.openname;
        data.data[key].username = auth.userName;

      });
      return data.data;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.changeTypeQuestion();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('name').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('name').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeatname = true;
            }
            if (item[0] === '1' && item[1] === 'question') {
              vm.Repeatquestion = true;
            }
          });
        }
      }
      if (!vm.Repeatname && !vm.Repeatquestion) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método para sacar el popup de error**//
    function modalErrorAnswer(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.RepeatnameAnswer = true;
            }
          });
        }
      }
      if (vm.RepeatnameAnswer === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }

    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
