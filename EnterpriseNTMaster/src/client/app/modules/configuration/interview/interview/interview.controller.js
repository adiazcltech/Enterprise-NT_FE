(function () {
  'use strict';

  angular
    .module('app.interview')
    .controller('InterviewController', InterviewController)
    .controller('interviewlabControllerd', interviewlabControllerd);;


  InterviewController.$inject = ['$rootScope', 'interviewDS', 'answerDS', 'configurationDS', 'ordertypeDS', 'testDS', 'areaDS', 'laboratoryDS', 'questionDS', 'localStorageService',
    'logger', 'destinationDS', '$filter', '$state', 'moment', 'ModalService', 'LZString', '$translate'
  ];

  function InterviewController($rootScope, interviewDS, answerDS, configurationDS, ordertypeDS, testDS, areaDS, laboratoryDS, questionDS, localStorageService,
    logger, destinationDS, $filter, $state, moment, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Interview';
    vm.name = ['name', 'nametype', 'state'];
    vm.nametype = ['nametype', 'name', 'state'];
    vm.state = ['-state', '+name', '+nametype'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.codetypeorder = ['code', 'name', 'select'];
    vm.nametypeorder = ['name', 'code', 'select'];
    vm.selecttypeorder = ['-select', '+code', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetypeorder;
    vm.codeservice = ['code', 'name', 'select'];
    vm.nameservice = ['name', 'code', 'select'];
    vm.selecservice = ['-select', '+code', '+name'];
    vm.sortReverse2 = false;
    vm.sortType2 = vm.codeservice;
    vm.codetest = ['code', 'name', 'abbr', 'select'];
    vm.nametest = ['name', 'code', 'abbr', 'select'];
    vm.abbrtest = ['abbr', 'code', 'name', 'select'];
    vm.selecttest = ['-select', '+code', '+name', '+abbr'];
    vm.sortReverse3 = false;
    vm.sortType3 = vm.codetest;
    vm.codelab = ['code', 'name', 'nametype', 'select'];
    vm.namelab = ['name', 'code', 'nametype', 'select'];
    vm.nametypelab = ['nametype', 'code', 'name', 'select'];
    vm.selectlab = ['-select', '+code', '+name', '+nametype'];
    vm.sortReverse4 = false;
    vm.sortType4 = vm.codelab;
    vm.selected = -1;
    vm.Detail = [];
    vm.searchquestion = '';
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.filterarea = filterarea;
    vm.get = get;
    vm.service = [];
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.Repeat = false;
    vm.msjquestion = false;
    vm.msjtypeInterview = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.gettypeorder = gettypeorder;
    vm.removeDatatypoorder = removeDatatypoorder;
    vm.gettest = gettest;
    vm.removeDatatest = removeDatatest;
    vm.removearea = removearea;
    vm.getArea = getArea;
    vm.getLab = getLab;
    vm.removeDatalab = removeDatalab;
    vm.getQuestions = getQuestions;
    vm.removeDataQuestions = removeDataQuestions;
    vm.assignade = [];
    vm.gettypeInterview = gettypeInterview;
    vm.getidinterviewtype = getidinterviewtype;
    vm.changepanic = changepanic;
    vm.isDisabledPrint = true;
    vm.listquestion = [];
    vm.lab = [];
    vm.test = [];
    vm.OrdenarPorselect = OrdenarPorselect;
    vm.loadingdata = true;
    vm.modalrequireds = modalrequireds;
    vm.listquestionmodal = [];
    vm.getservice = getservice;
    vm.getAnswer = getAnswer;
    vm.OrderListAnswer = OrderListAnswer;
    vm.newquestion = newquestion;
    vm.insertquestions = insertquestions;
    vm.windowOpenReport = windowOpenReport;
    vm.newquestionvalid = false;
    vm.newAnswer = newAnswer;
    vm.insertAnswer = insertAnswer;
    vm.validSaveAnswer = validSaveAnswer;
    vm.filterlistquestion = filterlistquestion;
    vm.labeltipeorder = $filter('translate')('0133');
    vm.labellab = $filter('translate')('0768');
    vm.labeltest = $filter('translate')('0475');
    vm.labeldetiny = $filter('translate')('0324');
    vm.one = $filter('translate')('0429');
    vm.two = $filter('translate')('0430');
    vm.tres = $filter('translate')('0178');
    vm.four = $filter('translate')('0072');
    vm.five = $filter('translate')('0623');
    vm.six = $filter('translate')('0624');
    vm.questions = [];
    vm.sortableQuestion = {
      placeholder: 'app',
      connectWith: '.containerDestination',
      items: 'div:not(.not-sortable)',
      stop: function (event, ui) {
        vm.assignadequestion.forEach(function (value, key) {
          value.order = key + 1;
          value.select = true;

          var item = $filter('filter')(vm.listquestion, function (e) {
            return e.id === value.id
          });
          if (item.length > 0) {
            item[0].select = true
          }
        })
        var updatelist = $filter('filter')(vm.listquestiontest, function (e) {
          return e.select === true
        });
        if (updatelist.length > 0) {
          updatelist[0].select = false
        }
      },
      activate: function (event, ui) { }
    };
    vm.listControl = [{
      id: 1,
      control: $filter('translate')('0429'),
      picture: 'images/manual.png'
    },
    {
      id: 2,
      control: $filter('translate')('0430'),
      picture: 'images/manual.png'
    },
    {
      id: 3,
      control: $filter('translate')('0178'),
      picture: 'images/manual.png'
    },
    {
      id: 4,
      control: $filter('translate')('0072'),
      picture: 'images/manual.png'
    },
    {
      id: 5,
      control: $filter('translate')('0623'),
      picture: 'images/manual.png'
    },
    {
      id: 6,
      control: $filter('translate')('0624'),
      picture: 'images/manual.png'
    }
    ]
    vm.sortableOptions = {
      items: "li:not(.not-sortable)"
    };
    //** Método para filtrar la lista de preguntas**//
    function filterlistquestion() {
      vm.listquestiontest = $filter('filter')(vm.listquestion, {
        'question': vm.searchquestion,
        'select': false
      });
      vm.assignadequestion = $filter('filter')(vm.listquestion, {
        'question': vm.searchquestion,
        'select': true
      });
      if (vm.searchquestion === '') {
        vm.assignadequestion.forEach(function (value, key) {
          value.order = key + 1;
          value.select = true;
        })
      }
      vm.assignadequestion = $filter('orderBy')(vm.assignadequestion, 'order');
      vm.listquestiontest = $filter('orderBy')(vm.listquestiontest, 'question');
    }
    //** Método para crear una nueva pregunta**//
    function newquestion() {
      vm.Repeatnamequestion = false;
      vm.Repeatquestion = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.datanewquestion = {
        "newelement": true,
        "id": 0,
        "name": "",
        "question": "",
        "open": true,
        "control": 1,
        "answers": vm.answers,
        "selectanswer": 0,
        "select": true,
        "state": true,
        "required": false,
        "user": {
          "id": auth.id
        }
      }
      setTimeout(function () {
        angular.element('#question0').focus();
      }, 100);
      vm.newquestionvalid = true;
    }
    //** Método para consultar las respuestas**/
    function getAnswer() {
      vm.answers = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.gettest();
      return answerDS.getAnswer(auth.authToken).then(function (data) {
        if (data.data.length > 0) {
          vm.answers = data.data;
          vm.answers.sort(vm.OrderListAnswer);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para ordenar las respuestas**/
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
    //** Método para crear una nueva respuesta**/
    function newAnswer() {
      if (vm.RepeatnameAnswer === true) {
        var repeat = $filter('filter')(vm.answers, function (e) {
          return e.name.toUpperCase() === vm.answers[vm.answers.length - 1].name.toUpperCase()
        });
        if (repeat.length === 2) {
          vm.RepeatnameAnswer = true;
          return;
        } else {
          vm.RepeatnameAnswer = false;
        }
      }
      var object = {
        "id": null,
        "name": "",
        "state": true,
        "selected": true,
        "quantity": 0,
        "lastTransaction": null,
        "newitem": true,
        "user": {
          "id": auth.id
        }
      };
      vm.answers.push(object);

      setTimeout(function () {
        var p = document.getElementById('contenanswer')
        p.scrollTop = p.scrollHeight - p.clientHeight;
        angular.element('#answernull').focus();
      }, 100); // close, but give 500ms for bootstrap to animate
    };
    //** Método para validar si la repuesta existe**/
    function validSaveAnswer(answer) {
      vm.RepeatnameAnswer = false;
      if (answer.name === '') {
        vm.answers.splice(vm.answers.length - 1, 1);
      } else {
        var repeat = $filter('filter')(vm.answers, function (e) {
          return e.name.toUpperCase() === answer.name.toUpperCase()
        });
        if (repeat.length === 2) {
          vm.RepeatnameAnswer = true;
          return;
        } else {
          vm.RepeatnameAnswer = false;
          vm.insertAnswer(answer);
        }
      }
    }
    //** Método para insertar una nueva respuesta**/
    function insertAnswer(answer) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return answerDS.newAnswer(auth.authToken, answer).then(function (data) {
        if (data.status === 200) {
          answer.newitem = false;
          answer.id = data.data.id;
        }
      }, function (error) {
        vm.modalErrorAnswer(error);
      });
    }
    //** Método se comunica con el dataservice e inserta**//
    function insertquestions(formquestion) {
      setTimeout(function () {
        vm.datanewquestion.answers = [];
        if (vm.datanewquestion.name === '' || vm.datanewquestion.question === '' ||
          vm.datanewquestion.name === undefined || vm.datanewquestion.question === undefined ||
          vm.RepeatnameAnswer === true) {
          return;
        }
        if (vm.datanewquestion.control === 5 || vm.datanewquestion.control === 6) {
          vm.datanewquestion.answers = vm.answers;
          vm.datanewquestion.open = false;
          var answerselected = $filter('filter')(vm.answers, {
            selected: true
          });
          if (answerselected.length === 0) {
            logger.warning("¡Debe seleccionar una o varias respuestas!")
            return;
          }
        }

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return questionDS.newQuestion(auth.authToken, vm.datanewquestion).then(function (data) {
          if (data.status === 200) {
            vm.listquestion.push(data.data);
            vm.newquestionvalid = false;
          }
        }, function (error) {
          vm.Repeatnamequestion = false;
          vm.Repeatquestion = false;
          if (error.data !== null) {
            if (error.data.code === 2) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split('|');
                if (item[0] === '1' && item[1] === 'name') {
                  vm.Repeatnamequestion = true;
                }
                if (item[0] === '1' && item[1] === 'question') {
                  vm.Repeatquestion = true;
                }
              });
            }
          }
          if (!vm.Repeatnamequestion && !vm.Repeatquestion) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        });
      }, 100);
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          data.data[0] = {
            'id': 0,
            'name': $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
          vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
          vm.lisArea.id = 0;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de las areas**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }
      });
      return area;
    }
    //** Método para consultar los tipos de orden**/
    function gettypeorder() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        vm.typeorder = data.data.length === 0 ? data.data : removeDatatypoorder(data);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de los tipos de orden**//
    function removeDatatypoorder(data) {
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.color;
        delete value.state;
        delete value.lastTransaction;
      });
      return data.data;
    }
    //** Método para consultar los laboratorios**/
    function getLab() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratoryActive(auth.authToken).then(function (data) {
        vm.lab = data.data.length === 0 ? data.data : removeDatalab(data);
        vm.modalrequireds(2);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para consultar los servicios**/
    function getservice() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationDS.getDestinationActive(auth.authToken).then(function (data) {
        vm.service = data.data.length === 0 ? data.data : removeservice(data);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de los servicios**//
    function removeservice(data) {
      data.data.forEach(function (value, key) {
        data.data[key].search = value.code + value.name
        data.data[key].type = null;
      });
      return data.data;
    }
    //** Metodo que construlle el arreglo de laboratorio**//
    function removeDatalab(data) {
      var type;
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.state;
        delete value.lastTransaction;
        if (value.type === 1) {
          data.data[key].nametype = $filter('translate')('0215');
        }
        if (value.type === 2) {
          data.data[key].nametype = $filter('translate')('0216');
        }
        delete value.address;
        delete value.contact;
        delete value.path;
        delete value.phone;
        delete value.state;
        delete value.type;
      });
      return data.data;
    }
    //** Método para consultar los preguntas**/
    function getQuestions() {
      vm.assignade = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return questionDS.getQuestionActive(auth.authToken).then(function (data) {
        vm.listquestion = $filter('orderBy')(data.data, 'question');
        vm.listquestiontest = $filter('orderBy')(data.data, 'question');
        vm.assignadequestion = [];
        return vm.listquestion;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla preguntas**//
    function removeDataQuestions(data) {
      data.data.forEach(function (value, key) {
        delete value.answers;
        delete value.control;
        delete value.lastTransaction;
        delete value.open;
        delete value.question;
        delete value.state;
      });
      return data.data;
    }
    //** Método para consultar los examenes**/
    function gettest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 3, 1, 0).then(function (data) {
        vm.test = data.data.length === 0 ? data.data : removeDatatest(data);
        vm.modalrequireds(1);
        vm.getArea();
        return vm.test;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para filtrar los examanes por areas**/
    function filterarea() {
      var salida = [];
      if (vm.lisArea.id === 0) {
        salida = vm.testfilter
        vm.test = salida
      } else {
        salida = $filter('filter')(vm.testfilter, function (e) {
          return e.area === vm.lisArea.id
        });
        vm.test = salida
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla de examanes**//
    function removeDatatest(data) {
      var test = [];
      data.data.forEach(function (value, key) {
        var testadd = {
          'id': value.id,
          'code': value.code,
          'abbr': value.abbr,
          'name': value.name,
          'select': value.select,
          'searchtest': value.code + value.abbr + value.name
        }
        test.add(testadd);
      });
      vm.testfilter = test;
      return test;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datasend = [];
      data.data.forEach(function (value, key) {
        if (value.type === 1) {
          data.data[key].nametype = $filter('translate')('0061');
        }
        if (value.type === 3) {
          data.data[key].nametype = $filter('translate')('0402');
        }
        if (value.type === 2) {
          data.data[key].nametype = $filter('translate')('0204');
        }
        if (value.type === 4) {
          data.data[key].nametype = $filter('translate')('0324');
        }
        data.data[key].username = auth.userName;
        data.data[key].questions = '';
        value.searchall = value.name + value.nametype;
        if (value.type === 4 && !vm.Trazability) { } else {
          datasend.add(value);
        }
      });
      return datasend;
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
        if (data.status === 200) {
          vm.get();
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
        vm.isDisabledpanic = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledpanic = false;
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
        vm.isDisabledpanic = true;
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
        vm.isDisabledpanic = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledpanic = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      //form.$setUntouched();
      vm.search2 = '';
      vm.search3 = '';
      vm.search4 = '';
      vm.questions = [];
      vm.Repeatnamequestion = false;
      vm.Repeatquestion = false;
      vm.newquestionvalid = false;
      vm.gettypeorder();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'type': 1,
        'panic': false,
        'state': true,
        'questions': [],
        'typeInterview': []
      };
      vm.getQuestions();
      vm.sortReverse1 = false;
      vm.sortType1 = vm.codetypeorder;
      vm.sortReverse2 = false;
      vm.sortType2 = vm.codeservice;
      vm.sortReverse3 = false;
      vm.sortType3 = vm.codetest;
      vm.sortReverse4 = false;
      vm.sortType4 = vm.codelab;
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.search2 = '';
      vm.search3 = '';
      vm.search4 = '';
      vm.status = false;
      vm.msjquestion = false;
      vm.msjtypeInterview = false;
      vm.Repeat = false;
      vm.Repeatnamequestion = false;
      vm.Repeatquestion = false;
      vm.newquestionvalid = false;
      vm.disablepanic = [];
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = {
          'user': {
            'id': auth.id
          },
          'id': null,
          'name': ' ',
          'type': 1,
          'panic': false,
          'state': true,
          'questions': [],
          'typeInterview': []
        };
        vm.getQuestions();
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);

      }
      vm.stateButton('init');
      vm.isDisabledPrint = true;
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      //Form.$setUntouched();
      vm.disablepanic = [];
      vm.typeInterview = [];
      if (Form.$valid) {
        vm.loadingdata = true;
        if (vm.Detail.type === 1) {
          vm.typeInterview = $filter('filter')(vm.typeorder, {
            select: true
          });
        }
        if (vm.Detail.type === 3) {
          vm.typeInterview = $filter('filter')(vm.test, {
            select: true
          });
        }
        if (vm.Detail.type === 4) {
          vm.typeInterview = $filter('filter')(vm.service, {
            select: true
          });
        }
        if (vm.Detail.type === 2) {
          vm.typeInterview = $filter('filter')(vm.lab, {
            select: true
          });
        }
        vm.Detail.questions = vm.assignadequestion;
        vm.Detail.typeInterview = vm.typeInterview;
        if (vm.Detail.questions.length === 0 || vm.Detail.typeInterview.length === 0) {
          vm.msjquestion = vm.Detail.questions.length === 0 ? true : false;
          vm.msjtypeInterview = vm.Detail.typeInterview.length === 0 ? true : false;
          vm.status = false;
        } else {
          vm.status = false;
          vm.typeInterview.sort(vm.OrdenarPorselect);
          if (vm.Detail.id === null) {
            vm.insert();
          } else {
            vm.update();
          }
        }
      }
    }
    //** Método ordena por el campo select**//
    function OrdenarPorselect(x, y) {
      return y.select - x.select;
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.isDisabledSave = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return interviewDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.search2 = '';
          vm.search3 = '';
          vm.search4 = '';
          vm.Detail = data.data;
          vm.get();
          vm.gettypeInterview(data.data.id);
          vm.getidinterviewtype(data.data.id, vm.Detail.type);
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.loadingdata = false;
          return data;
        }
      }, function (error) {
        vm.loadingdata = false;
        vm.isDisabledSave = false;
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.isDisabledSave = true;
      vm.search2 = '';
      vm.search3 = '';
      vm.search4 = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return interviewDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.loadingdata = false;
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }

      }, function (error) {
        vm.isDisabledSave = false;
        vm.loadingdata = false;
        vm.modalError(error);

      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changepanic(id) {
      if (vm.isDisabled === false) {
        auth = localStorageService.get('Enterprise_NT.authorizationData');
        return interviewDS.get(auth.authToken).then(function (data) {
          vm.disablepanic = $filter('filter')(data.data, {
            panic: true
          });

          if (vm.selected === -1) {
            if (vm.Detail.panic) {
              vm.Detail.panic = vm.disablepanic.length === 0 && !vm.Detail.informedConsent ? true : false;
            }
          } else {
            if (vm.disablepanic.length !== 0) {
              if (vm.disablepanic[0].id === id && !vm.Detail.informedConsent) {
                vm.disablepanic = [];
              } else {
                if (vm.disablepanic[0].id === id) {
                  vm.disablepanic = [];
                }
                if (vm.Detail.panic === true) {
                  vm.Detail.panic = vm.disablepanic.length === 0 && !vm.Detail.informedConsent ? true : false;
                }
              }
            } else {
              if (vm.Detail.panic === true) {
                vm.Detail.panic = vm.disablepanic.length === 0 && !vm.Detail.informedConsent ? true : false;
              }
            }
          }
        }, function (error) {
          vm.modalError(error);
        });

      }

    }
    vm.changeinformedConsent = changeinformedConsent;
    //** Método que evalua el cambio del consentimiento informado**//
    function changeinformedConsent() {
      if (vm.Detail.panic === true && vm.Detail.informedConsent === true) {
        vm.Detail.informedConsent = false;
      }

    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      vm.search2 = '';
      vm.search3 = '';
      vm.search4 = '';
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return interviewDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.getAnswer();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.search2 = '';
      vm.search3 = '';
      vm.search4 = '';
      vm.status = false;
      vm.msjquestion = false;
      vm.msjtypeInterview = false;
      vm.disablepanic = [];
      vm.Repeat = false;
      vm.Repeatnamequestion = false;
      vm.Repeatquestion = false;
      vm.newquestionvalid = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.loadingdata = true;
      vm.search3 = '';
      vm.search2 = '';
      vm.search4 = '';
      return interviewDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.gettypeInterview(id);
          vm.getidinterviewtype(id, vm.Detail.type);
          vm.stateButton('update');

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la preguntas id del la entrevista**//
    function gettypeInterview(id) {
      vm.listquestion1 = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return questionDS.getAllByIdInterview(auth.authToken, id).then(function (data) {
        vm.listquestion1 = data.data;
        vm.listquestion = data.data;
        vm.assignadequestion = $filter('filter')(vm.listquestion1, {
          select: true
        });
        vm.assignadequestion = $filter('orderBy')(vm.assignadequestion, 'order');
        vm.listquestiontest = $filter('filter')(vm.listquestion1, {
          select: false
        });
        vm.listquestiontest = $filter('orderBy')(vm.listquestiontest, 'question');

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Obtiene los tipos de entrevista de una entrevista**//
    function getidinterviewtype(idinterview, type) {
      vm.typeorder = [];
      vm.test = [];
      vm.lab = [];
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return interviewDS.getidinterviewtype(auth.authToken, idinterview, type).then(function (data) {
        vm.loadingdata = false;
        if (type === 1) {
          vm.typeorder = data.data;
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selecttypeorder;
        }
        if (type === 3) {
          vm.test = removeDatatest(data);
          vm.sortReverse3 = false;
          vm.sortType3 = vm.selecttest;
          vm.getArea();
        }
        if (type === 2) {
          vm.lab = data.data.length === 0 ? data.data : removeDatalab(data);
          vm.sortReverse4 = false;
          vm.sortType4 = vm.selectlab;
        }
        if (type === 4) {
          vm.service = data.data.length === 0 ? data.data : removeservice(data);
          vm.sortReverse2 = false;
          vm.sortType2 = vm.selecservice;
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.typeInterview = [];
      vm.report = $filter('filter')(vm.data, {
        id: vm.Detail.id
      });
      vm.report.questions = '';
      var questionvariable;
      if (vm.assignadequestion.length !== 0) {
        vm.assignadequestion.forEach(function (value, key) {
          if (key === 0) {
            questionvariable = '<ul><li>' + value.name + '</li>';
          } else {
            questionvariable = questionvariable + '<li>' + value.name + '</li>';
          }
        });
        questionvariable = questionvariable + '</ul>'
        vm.report[0].questions = questionvariable;
      }
      vm.variables = {};
      vm.datareport = vm.report;
      vm.pathreport = '/report/configuration/interview/interview/interview.mrt';
      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport();

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
    //** Ventana modal de los requeridos**//
    function modalrequireds(view) {
      if (vm.lab.length === 0 && view === 2) {
        ModalService.showModal({
          templateUrl: "Requeridos.html",
          controller: "interviewlabControllerd",
          inputs: {
            Labhide: vm.lab.length,
            testhide: 2,
            destinyhide: 2
          },
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.page === "interview") {
              vm.gettypeorder();
              vm.Detail.type = 1;
              $state.go(result.page);
            } else {
              $state.go(result.page);
            }
          });
        });
      } else if (vm.service.length === 0 && view === 3) {
        ModalService.showModal({
          templateUrl: "Requeridos.html",
          controller: "interviewlabControllerd",
          inputs: {
            Labhide: 2,
            destinyhide: vm.service.length,
            testhide: 2,
          },
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.page === "interview") {
              vm.gettypeorder();
              vm.Detail.type = 1;
              $state.go(result.page);
            } else {
              $state.go(result.page);
            }
          });
        });
      } else if (vm.test.length === 0 && view === 1) {
        ModalService.showModal({
          templateUrl: "Requeridos.html",
          controller: "interviewlabControllerd",
          inputs: {
            Labhide: 2,
            testhide: vm.test.length,
            destinyhide: 2
          },
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.page === "interview") {
              vm.gettypeorder();
              vm.Detail.type = 1;
              $state.go(result.page);
            } else {
              $state.go(result.page);
            }
          });
        });
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.Trazability = parseInt(localStorageService.get('Trazabilidad')) === 3;
      vm.orderinterview = localStorageService.get('OrdenEntrevistaPorPrioridad')==='True';
      vm.getConfigurationFormatDate()
    }
    vm.isAuthenticate();
  }
  //** Método para mostrar la ventana modal de los requeridos*//
  function interviewlabControllerd($scope, Labhide, testhide, destinyhide, close) {
    $scope.Labhide = Labhide;
    $scope.testhide = testhide;
    $scope.destinyhide = destinyhide;
    $scope.close = function (page) {
      close({
        page: page,
      },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
})();
