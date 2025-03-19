(function () {
  'use strict';

  angular
    .module('app.testlab')
    .controller('TestController', TestController)
    .controller('DependenceTestController', DependenceTestController)
    .controller('ListUnitsController', ListUnitsController)
    .controller('techniquesController', techniquesController);
  TestController.$inject = ['testDS', 'alarmDS', 'configurationDS', '$stateParams', 'localStorageService', 'logger', 'areaDS', 'requirementDS',
    'sampleDS', 'techniqueDS', 'unitDS', 'ModalService', 'listDS', 'interviewDS', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function TestController(testDS, alarmDS, configurationDS, $stateParams, localStorageService, logger, areaDS, requirementDS,
    sampleDS, techniqueDS, unitDS, ModalService, listDS, interviewDS, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.area = $stateParams.area;
    vm.codeTest = $stateParams.codetest;
    vm.init = init;
    vm.title = 'Test';
    vm.nametest = ['nametest', 'state'];
    vm.state = ['-state', '+nametest'];
    vm.sortReverse = false;
    vm.sortType = vm.nametest;
    vm.code = ['code', 'selected'];
    vm.selectedRequirements = ['-selected', '+code'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.code;
    vm.selected = -1;
    vm.testDetail = [];
    vm.concurrenceFormula = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.NewTest = NewTest;
    vm.EditTest = EditTest;
    vm.changeState = changeState;
    vm.changeArea = changeArea;
    vm.changeRange = changeRange;
    vm.changeCheckRequirements = changeCheckRequirements;
    vm.changeMultiplyBy = changeMultiplyBy;
    vm.clickResultType = clickResultType;
    vm.keyUpAbbr = keyUpAbbr;
    vm.cancelTest = cancelTest;
    vm.insertTest = insertTest;
    vm.updateTest = updateTest;
    vm.saveTest = saveTest;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    vm.stateButton = stateButton;
    vm.accept = accept;
    vm.clickConcurrence = clickConcurrence;
    vm.getTestArea = getTestArea;
    vm.getTestId = getTestId;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getListLevels = getListLevels;
    vm.getListGender = getListGender;
    vm.getLisInterview = getLisInterview;
    vm.getListSelfValidation = getListSelfValidation;
    vm.getListprintOnReport = getListprintOnReport;
    vm.getTemperatureTest = getTemperatureTest;
    vm.getListunitAge = getListunitAge;
    vm.getListSamples = getListSamples;
    vm.getListTechniques = getListTechniques;
    vm.getListValidityResult = getListValidityResult;
    vm.getListUnits = getListUnits;
    vm.getListprocessingBy = getListprocessingBy;
    vm.getAreaActive = getAreaActive;
    vm.getRequirementActive = getRequirementActive;
    vm.getTestAll = getTestAll;
    vm.getListConcurrences = getListConcurrences;
    vm.getTestFormula = getTestFormula;
    vm.modalrequired = modalrequired;
    vm.keyselect = keyselect;
    vm.keyscroll = keyscroll;
    vm.codeRepeat = false;
    vm.nameRepeat = false;
    vm.abbrRepeat = false;
    vm.requirementsRequired = false;
    vm.errorservice = 0;
    vm.modalRequired = false;
    vm.windowOpenReport = windowOpenReport;
    vm.keyPressTextarea = keyPressTextarea;
    vm.loadingdata = true;
    vm.texareaHtml = new Array(3);
    vm.changeRange();
    vm.stateButton('init');
    vm.popuplistechnique = popuplistechnique;
    vm.getalarmActive = getalarmActive;
    vm.showcurrent = false;
    vm.dataConcurrence = [];

    vm.listProcessingDays = [{
      id: 1,
      name: $filter('translate')('0146')
    },
    {
      id: 2,
      name: $filter('translate')('0147')
    },
    {
      id: 3,
      name: $filter('translate')('0148')
    },
    {
      id: 4,
      name: $filter('translate')('0149')
    },
    {
      id: 5,
      name: $filter('translate')('0150')
    },
    {
      id: 6,
      name: $filter('translate')('0151')
    },
    {
      id: 7,
      name: $filter('translate')('0145')
    }
    ];
    vm.tinymceOptions = {
      resize: false,
      min_height: 150,
      menubar: false,
      language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      br_newline_selector: true,
      force_br_newlines: true,
      force_p_newlines: false,
      forced_root_block: false,
      convert_newlines_to_brs: true,
      plugins: [
        'textcolor charmap advlist autolink lists link image print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code wordcount'
      ],
      toolbar: 'undo redo | fontselect formatselect  fontsizeselect forecolor backcolor casechange permanentpen|' +
        ' bold italic subscript  superscript | alignleft aligncenter ' +
        ' alignright alignjustify |  bullist numlist outdent indent |' +
        ' removeformat | code',
    };
    vm.inFormula = false;
    vm.textformula = '';
    var auth;
    //** Metodo que válida cuando se pasa de un control a otro**//
    function keyselect($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 9) {
        setTimeout(function () {
          angular.element('#statisticalTitle').focus();
        }, 100);
      }
    }
    //** Metodo que válida el scroll**//
    function keyscroll($event, sum) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 9) {
        setTimeout(function () {
          var p = document.getElementById('container')
          p.scrollTop += sum;
        }, 100);
      }
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
        vm.getAreaActive();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //Método que devuelve la lista de áreas activas
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.ListAreas = [];
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.ListAreas = data.data.length === 0 ? data.data : removearea(data);
        vm.ListAreas = $filter('orderBy')(vm.ListAreas, 'id');
        vm.ListAreas.unshift({
          "id": 0,
          "name": $filter('translate')('0209')
        });
        vm.getListSamples();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
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
    /**Funcion consultar el listado de las muestras activas en el sistema */
    function getListSamples() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.ListSamples = [];
      return sampleDS.getSampleActive(auth.authToken).then(function (dataSample) {
        vm.ListSamples = $filter('orderBy')(dataSample.data, 'id');
        if (vm.ListAreas.length === 0 || vm.ListSamples.length === 0) {
          vm.modalrequired();
        } else {
          vm.getRequirementActive();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que comprueba la existencia de áreas y muestras por el **//
    function modalrequired() {
      vm.loadingdata = false;
      if (vm.ListAreas.length === 0 || vm.ListSamples.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'DependenceTestController',
          inputs: {
            hideArea: vm.ListAreas.length,
            hideSample: vm.ListSamples.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //Método que devuelve la lista de áreas activas
    function getRequirementActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return requirementDS.getRequirementActive(auth.authToken).then(function (dataRequirement) {
        vm.getalarmActive();
        vm.dataRequirements = dataRequirement.data;
      }, function (error) {
        vm.modalError();
      });
    }
    //Método que devuelve la lista de alarmas activas
    function getalarmActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return alarmDS.getActive(auth.authToken).then(function (data) {
        vm.getListLevels();
        vm.dataalarms = $filter('orderBy')(data.data, 'name');
      }, function (error) {
        vm.modalError();
      });
    }
    /**Funcion que llena un combobox donde está la lista de niveles de complejidad*/
    function getListLevels() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 32).then(function (data) {
        vm.getListGender();
        if (data.status === 200) {
          vm.ListLevels = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /*Funcion que llena un combobox donde está la lista de géneros del examen o prueba.*/
    function getListGender() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 6).then(function (data) {
        vm.getLisInterview();
        if (data.status === 200) {
          vm.ListGender = $filter('orderBy')(data.data, 'esCo');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //Es un json miestras se crea el maestro de entrevistas.
    function getLisInterview() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return interviewDS.get(auth.authToken).then(function (data) {
        vm.getListSelfValidation();
        if (data.status === 200) {
          vm.ListInterview = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /*Funcion que llena un combobox donde está la lista de Autovalidación para registro de resultados*/
    function getListSelfValidation() {
      vm.getListprintOnReport();
      var data = [{
        'value': 1,
        'text': $filter('translate')('0407')
      },
      {
        'value': 2,
        'text': $filter('translate')('0408')
      },
      {
        'value': 3,
        'text': $filter('translate')('0409')
      },
      {
        'value': 4,
        'text': $filter('translate')('0410')
      },
      {
        'value': 5,
        'text': $filter('translate')('0411')
      }
      ];
      vm.ListSelfValidation = $filter('orderBy')(data, 'text');
      return data;
    }
    //Función que llena un combobox de Imprimir prueba en informe
    function getListprintOnReport() {
      vm.getListunitAge();
      var data = [{
        'value': 1,
        'text': $filter('translate')('0413')
      },
      {
        'value': 2,
        'text': $filter('translate')('0414')
      },
      {
        'value': 3,
        'text': $filter('translate')('0415')
      }
      ];
      vm.ListPrintOnReport = $filter('orderBy')(data, 'text');
      return data;
    }
    //Función que llena un combobox de edad
    function getListunitAge() {
      vm.getListTechniques();
      var data = [{
        'value': 1,
        'text': $filter('translate')('0111')
      },
      {
        'value': 2,
        'text': $filter('translate')('0115')
      }
      ];
      vm.ListUnitAge = $filter('orderBy')(data, 'text');
      return data;
    }
    //Función para traer una lista de tecnicas
    function getListTechniques() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return techniqueDS.getTechnique(auth.authToken).then(function (data) {
        vm.getListUnits();
        if (data.status === 200) {
          vm.ListTechniques = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //Función para traer una lista de unidades
    function getListUnits() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return unitDS.getUnitActive(auth.authToken).then(function (data) {
        vm.getListprocessingBy();
        vm.getTemperatureTest();
        if (data.status === 200) {
          var noApply = {
            id: null,
            name: '-- ' + $filter('translate')('0504') + ' --',
          }
          data.data.add(noApply);
          vm.ListUnits = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);

      });
    }
    //Función que llena un combobox para seleccionar un tipo de procesameiento de la prueba.
    function getListprocessingBy() {
      vm.getListValidityResult();
      var data = [{
        'value': 1,
        'text': $filter('translate')('0416')
      },
      {
        'value': 2,
        'text': $filter('translate')('0205')
      },
      {
        'value': 3,
        'text': $filter('translate')('0216')
      }
      ];
      vm.ListProcessingBy = $filter('orderBy')(data, 'text');
      return data;
    }
    //Funcion que llena un combobox de los días de vigencia de un resultado.
    function getListValidityResult() {
      var data = [{
        'value': 0,
        'text': 'N/A'
      },
      {
        'value': 30,
        'text': '30' + ' ' + $filter('translate')('0115')
      },
      {
        'value': 60,
        'text': '60' + ' ' + $filter('translate')('0115')
      },
      {
        'value': 90,
        'text': '90' + ' ' + $filter('translate')('0115')
      }
      ];
      vm.ListValidityResult = $filter('orderBy')(data, 'text');;
      vm.ListValidityResult.value = 0;
      vm.getTestAll();
      vm.loadingdata = false;
    }
    //Función que llena un combobox para las opciones de temperatura
    function getTemperatureTest() {
      var data = [{
        'value': 1,
        'text': $filter('translate')('3132')
      },
      {
        'value': 2,
        'text': $filter('translate')('3133')
      },
      {
        'value': 3,
        'text': $filter('translate')('3134')
      }
      ];
      vm.ListTemperatureTest = $filter('orderBy')(data, 'text');
      return data;
    }

    /* Método del evento changed del checkbox de Todos para selecionar todos los requisitos*/
    function changeCheckRequirements() {
      vm.dataRequirements.forEach(function (value) {
        value.selected = vm.requirementsAll;
      });
    }
    // Método que elimina los datos que no se necesitan en la grilla
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].username = auth.userName,
        data.data[key].nametest = value.code + '-' + value.name
      });
      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo requisito**//
    function NewTest(TestForm) {
      vm.listConcurrences = '';
      vm.showcurrent = false;
      vm.dataConcurrence = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      TestForm.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.testDetail = {
        'id': null,
        'area': {
          'id': vm.ListAreas.id
        },
        'code': '',
        'name': '',
        'nameEnglish': '',
        'abbr': '',
        'level': {
          'id': null
        },
        'sample': {
          'id': null
        },
        'interview': null,
        'gender': {
          'id': 42
        },
        'minAge': 0,
        'maxAge': 0,
        'unitAge': 1,
        'formula': '',
        'resultType': 2,
        'decimal': 0,
        'validResult': 0,
        'technique': {
          'name': ''
        },
        'unit': {
          'id': null,
          'name': '-- ' + $filter('translate')('0504') + ' --',
        },
        'volume': '',
        'automaticResult': '',
        'maxDays': 0,
        'maxPrintDays': 0,
        'deliveryDays': 0,
        'selfValidation': 1,
        'statistics': false,
        'billing': false,
        'statisticalTitle': '',
        'multiplyBy': 0,
        'deleteProfile': true,
        'showEntry': true,
        'printOnReport': 1,
        'showInQuery': true,
        'confidential': false,
        'resultRequest': false,
        'printGraph': false,
        'specialStorage': true,
        'processingBy': 1,
        'temperatureTest': 1,
        'groupTitle': '',
        'fixedComment': '',
        'fixedCommentEn': '',
        'printComment': '',
        'printCommentEn': '',
        'generalInformation': '',
        'generalInformationEn': '',
        'processingDays': '1,2,3,4,5,6,7',
        'preliminaryValidation': false,
        'requirements': [{
          'id': 1
        }],
        'concurrences': [],
        'testType': 0,
        'conversionFactor': 0,
        'state': true,
        'user': {
          'id': auth.id
        }
      };
      vm.technique = {
        'name': ''
      }
      vm.unit = {
        'name': ''
      }
      vm.sortReverse1 = false;
      vm.sortType1 = vm.code;
      vm.stateButton('add');
      //vm.getListLevels();
      vm.modalRequired = false;
      vm.gender = 42;
      vm.level = null;
      vm.changeRange();
      vm.processingDays = '1,2,3,4,5,6,7';
      vm.sample = null;
      vm.changeMultiplyBy();
      vm.resultType = false;
      vm.inFormula = false;
    }
    //** Método que valida el cambio de area**//
    function changeArea() {
      vm.getTestArea();
    }
    //Función que solo permite la digitación de lestras y/o números en una caja de texto. (Evento KeyUp).
    function keyUpAbbr() {
      if (vm.testDetail.abbr !== undefined) {
        vm.testDetail.abbr = vm.testDetail.abbr.replace('|', '')
      }
    }
    //** Método que cambia el rango cuando se selecciomna una undiad de tiempo.**//
    function changeRange() {
      vm.minAge = 0; // 2 - vm.testDetail.unitAge;
      vm.valueMaxInit = vm.testDetail.unitAge === 1 ? 70 : 300;
      //vm.valueMinInit = 0; // vm.testDetail.unitAge === 1 ? 1 : 0;
      //vm.valueStartInit = 0; // vm.testDetail.unitAge === 1 ? 1 : 0;

      vm.maxAge = vm.testDetail.unitAge === 1 ? 200 : 365;
      /* vm.valueMaxEnd = vm.testDetail.unitAge === 1 ? 200 : 900;
      vm.valueMinEnd = vm.testDetail.unitAge === 1 ? 2 : 1;
      vm.valueStartEnd = vm.testDetail.unitAge === 1 ? 2 : 1; */
    }
    //** Método que válida el tipo de resultado**//
    function clickResultType(value) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.testDetail.formula = value === 'T' ? '' : vm.testDetail.formula;
      vm.testDetail.decimal = value === 'T' ? 0 : vm.testDetail.decimal;
      vm.conversionFactor = value === 'T' ? 0 : vm.conversionFactor;
      if (value === 'T') {
        vm.testDetail.printGraph = false;
        vm.testDetail.conversionFactor = 0;
        vm.testDetail.decimal = 0;
        vm.testDetail.trendAlert = -1;
      }
    }
    //** Método que válida el multiplicar por**//
    function changeMultiplyBy() {
      vm.testDetail.multiplyBy = vm.testDetail.billing || vm.testDetail.statistics ? 1 : 0;
      vm.valueMax = vm.testDetail.billing && vm.testDetail.statistics ? 10 : 0;
      vm.valueMin = vm.testDetail.billing && vm.testDetail.statistics ? 1 : 0;
      vm.valueStart = vm.testDetail.billing && vm.testDetail.statistics ? 1 : 0;
      vm.testDetail.statisticalTitle = !vm.testDetail.statistics ? '' : vm.testDetail.statisticalTitle;
    }
    //** Método que deshabilitar los controles y botones para cancelar un requisito**//
    function cancelTest(TestForm) {
      vm.minAge = 0;
      vm.maxAge = 0;
      vm.codeRepeat = false;
      vm.abbrRepeat = false;
      vm.nameRepeat = false;
      vm.requirementsRequired = false;
      vm.listConcurrences = '';
      vm.processingDays = '1,2,3,4,5,6,7';
      vm.resultType = false;
      TestForm.$setUntouched();
      if (vm.testDetail.id === null) {
        vm.testDetail = [];
        vm.level = null;
        vm.gender = null;
        vm.unit = null;
        vm.sample = null;
        vm.technique = null;
      } else {
        vm.getTestId(vm.testDetail.id, vm.selected, TestForm);
      }
      vm.stateButton('init');
      vm.inFormula = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo requisito**//
    function EditTest() {
      vm.getTestFormula(vm.testDetail.id);
      var dataDetail = [];
      var idioma = $filter('translate')('0000');
      dataDetail = JSON.parse(JSON.stringify(vm.concurrDetail));
      dataDetail.forEach(function (value, i) {
        if (vm.selected !== dataDetail[i].concurrence.id) {
          var formula = $filter("filter")(vm.concurrenceFormula, function (e) {
            return dataDetail[i].concurrence.id === e.concurrence.id;
          })
          var g = dataDetail[i].gender === 42 ? 2 : dataDetail[i].gender - 7;
          var age = dataDetail[i].minAge.toString() + ' - ' +
            dataDetail[i].maxAge.toString() + ' ' +
            vm.ListUnitAge[dataDetail[i].unitAge - 1].text.substr(0, 1);
          var validGender = vm.gender === 42 || vm.gender === dataDetail[i].gender || dataDetail[i].gender === 42;
          var validAge = true;
          var select = $filter("filter")(vm.testDetail.concurrences, function (e) {
            return dataDetail[i].concurrence.id === e.concurrence.id;
          })
          vm.dataConcurrence.push({
            'id': dataDetail[i].concurrence.id,
            'codnamesex': dataDetail[i].concurrence.code + dataDetail[i].concurrence.name + (idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA),
            'code': dataDetail[i].concurrence.code,
            'abbr': dataDetail[i].concurrence.abbr,
            'name': dataDetail[i].concurrence.name,
            'gender': idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA,
            'ageRange': age,
            'quantity': '(' + dataDetail[i].quantity.toString() + ')',
            'formula': formula.length === 0 ? false : true,
            'selected': select.length === 0 ? false : true,
            'isGender': validGender,
            'isAge': validAge
          });
        }
      });
      vm.dataConcurrence = $filter('orderBy')(vm.dataConcurrence, '-selected');
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo requisito o se va actualizar**//
    function saveTest(TestForm) {
      vm.loadingdata = true;
      if (vm.minAge <= vm.maxAge) {
        TestForm.$setUntouched();
        if (vm.texareaHtml[0] !== null) {
          if (vm.texareaHtml[0] !== undefined) {
            vm.testDetail.fixedComment = vm.texareaHtml[0].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
            vm.testDetail.fixedCommentEn = vm.texareaHtml[0].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
          } else {
            vm.testDetail.fixedComment = vm.testDetail.fixedComment.replace(/span/g, "font");
            vm.testDetail.fixedComment = vm.testDetail.fixedComment.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.fixedComment = vm.testDetail.fixedComment.replace(new RegExp("</p>", 'g'), "</div>");
            vm.testDetail.fixedCommentEn = vm.testDetail.fixedCommentEn.replace(/span/g, "font");
            vm.testDetail.fixedCommentEn = vm.testDetail.fixedCommentEn.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.fixedCommentEn = vm.testDetail.fixedCommentEn.replace(new RegExp("</p>", 'g'), "</div>");
          }
        } else {
          vm.testDetail.fixedComment = "";
          vm.testDetail.fixedCommentEn = "";
        }

        if (vm.texareaHtml[1] !== null) {
          if (vm.texareaHtml[1] !== undefined) {
            vm.testDetail.printComment = vm.texareaHtml[1].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
            vm.testDetail.printCommentEn = vm.texareaHtml[1].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
          } else {
            vm.testDetail.printComment = vm.testDetail.printComment.replace(/span/g, "font");
            vm.testDetail.printComment = vm.testDetail.printComment.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.printComment = vm.testDetail.printComment.replace(new RegExp("</p>", 'g'), "</div>");
            vm.testDetail.printCommentEn = vm.testDetail.printCommentEn.replace(/span/g, "font");
            vm.testDetail.printCommentEn = vm.testDetail.printCommentEn.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.printCommentEn = vm.testDetail.printCommentEn.replace(new RegExp("</p>", 'g'), "</div>");
          }
        } else {
          vm.testDetail.printComment = "";
          vm.testDetail.printCommentEn = "";
        }

        if (vm.texareaHtml[2] !== null) {
          if (vm.texareaHtml[2] !== undefined) {
            vm.testDetail.generalInformation = vm.texareaHtml[2].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
            vm.testDetail.generalInformationEn = vm.texareaHtml[2].replace(/span/g, "font").replace(/<br><br>/g, '<br>');
          } else {
            vm.testDetail.generalInformation = vm.testDetail.generalInformation.replace(/span/g, "font");
            vm.testDetail.generalInformation = vm.testDetail.generalInformation.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.generalInformation = vm.testDetail.generalInformation.replace(new RegExp("</p>", 'g'), "</div>");
            vm.testDetail.generalInformationEn = vm.testDetail.generalInformationEn.replace(/span/g, "font");
            vm.testDetail.generalInformationEn = vm.testDetail.generalInformationEn.replace(new RegExp("<p>", 'g'), "<div>");
            vm.testDetail.generalInformationEn = vm.testDetail.generalInformationEn.replace(new RegExp("</p>", 'g'), "</div>");
          }
        } else {
          vm.testDetail.generalInformation = "";
          vm.testDetail.generalInformationEn = "";
        }

        vm.testDetail.concurrence = [];
        vm.testDetail.level.id = vm.level === undefined || vm.level === 0 ? null : vm.level;
        vm.testDetail.sample.id = vm.sample === undefined ? null : vm.sample;
        vm.testDetail.gender.id = vm.gender === undefined ? null : vm.gender;
        vm.testDetail.technique.id = vm.technique.id === undefined ? null : vm.technique.id;
        vm.testDetail.unit.id = vm.unit.id === undefined || vm.unit.id === null ? null : vm.unit.id;
        vm.testDetail.minAge = vm.minAge;
        vm.testDetail.maxAge = vm.maxAge;
        vm.processinDaysArr = vm.processingDays.split(',');
        vm.testDetail.processingDays = '';
        for (var i = 0; i < vm.processingDays.split(',').length; i++) {
          vm.testDetail.processingDays = vm.testDetail.processingDays + vm.processingDays.split(',')[i];
        };
        vm.testDetail.resultType = vm.resultType ? 1 : 2;
        // Se arama el json para la lista de requisitos
        var requirements = [];
        vm.dataRequirements.forEach(function (value) {
          if (value.selected) {
            requirements.push({
              'id': value.id,
              'code': value.code,
              'selected': true
            });
          }
        });
        vm.testDetail.requirements = requirements;
        vm.testDetail.concurrences = [];
        if (vm.dataConcurrence.length !== 0) {
          var arrayconcurrenceFormula = vm.concurrenceFormula;
          vm.dataConcurrence.forEach(function (value) {
            var found = false;
            for (var i = 0; i < arrayconcurrenceFormula.length - 1; i++) {
              found = arrayconcurrenceFormula[i].concurrence.id === value.id;
              if (found) break;
            }
            if (value.selected && !value.formula && found === false) {
              vm.concurrenceFormula.push({
                'idTest': null,
                'concurrence': {
                  'id': value.id
                },
                'formula': false,
                'selected': true
              });
            }
          });
          vm.testDetail.concurrences = vm.concurrenceFormula;
        }
        vm.requirementsRequired = false;

        vm.testDetail.temperatureTest = vm.testDetail.temperatureTest;
        if (vm.testDetail.id === null) {
          vm.insertTest();
        } else {
          vm.updateTest();
        }
        vm.texareaHtml = new Array(3);
      }
    }
    //** Método que inserta un nuevo examen**//
    function insertTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.insertTest(auth.authToken, vm.testDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTestArea();
          vm.selected = data.data.id;
          vm.stateButton('insert');
          vm.getTestId(data.data.id);
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un examen**//
    function updateTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.updateTest(auth.authToken, vm.testDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTestArea();
          vm.stateButton('update');
          vm.getTestId(data.data.id);
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.concurrenceFormula = [];
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '1' && item[1] === 'abbreviation') {
              vm.abbrRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
              vm.loadingdata = false;
            }
            if (item[0] === '0' && item[1] === 'requirements') {
              vm.requirementsRequired = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (!vm.codeRepeat && !vm.abbrRepeat && !vm.nameRepeat && !vm.requirementsRequired) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return testDS.getTestArea(auth.authToken, 0, 0, vm.ListAreas.id).then(function (data) {
        vm.loadingdata = false;
        vm.dataTest = data.data.length === 0 ? data.data : removeData(data);
        return vm.dataTest;
      }, function (error) {
        vm.modalError(error);
      });
    }
    // Función del evento Clikc del botón de Concurrencias
    function clickConcurrence() {
      vm.getListConcurrences();
    }
    // Función que llena la lista de exámenes de concurrencias
    function getListConcurrences() {
      vm.loadingdata = true;
      vm.listConcurrences = '';
      var dataDetail = [];
      vm.searchTest = '';
      var idioma = $filter('translate')('0000');
      dataDetail = JSON.parse(JSON.stringify(vm.concurrDetail));
      if (vm.dataConcurrence.length === 0) {
        dataDetail.forEach(function (value, i) {
          if (vm.selected !== dataDetail[i].concurrence.id) {
            var formula = $filter("filter")(vm.concurrenceFormula, function (e) {
              return dataDetail[i].concurrence.id === e.concurrence.id;
            })
            if (dataDetail[i].selected || formula.length !== 0) {
              vm.listConcurrences = vm.listConcurrences + dataDetail[i].concurrence.abbr + ',';
            }
            var g = dataDetail[i].gender === 42 ? 2 : dataDetail[i].gender - 7;
            var age = dataDetail[i].minAge.toString() + ' - ' +
              dataDetail[i].maxAge.toString() + ' ' +
              vm.ListUnitAge[dataDetail[i].unitAge - 1].text.substr(0, 1);
            var validGender = vm.gender === 42 || vm.gender === dataDetail[i].gender || dataDetail[i].gender === 42;
            var validAge = true;
            var select = $filter("filter")(vm.testDetail.concurrences, function (e) {
              return dataDetail[i].concurrence.id === e.concurrence.id;
            })
            vm.dataConcurrence.push({
              'id': dataDetail[i].concurrence.id,
              'codnamesex': dataDetail[i].concurrence.code + dataDetail[i].concurrence.name + (idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA),
              'code': dataDetail[i].concurrence.code,
              'abbr': dataDetail[i].concurrence.abbr,
              'name': dataDetail[i].concurrence.name,
              'gender': idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA,
              'ageRange': age,
              'quantity': '(' + dataDetail[i].quantity.toString() + ')',
              'formula': formula.length === 0 ? false : true,
              'selected': select.length === 0 ? false : true,
              'isGender': validGender,
              'isAge': validAge
            });
          }
        });
      }
      vm.dataConcurrence = $filter('orderBy')(vm.dataConcurrence, '-selected');
      vm.listConcurrences = vm.listConcurrences.substr(0, vm.listConcurrences.length - 1);
      vm.showcurrent = true;
      vm.loadingdata = false;
    }
    // Función que obtiene los examanes de concurrencias
    function getTestAll(token) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestConcurrences(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.concurrDetail = JSON.parse(JSON.stringify(data.data));
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene el detalle del examanen por id*//
    function getTestId(id, index, TestForm) {
      vm.showcurrent = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.testDetail = [];
      vm.loadingdata = true;
      if (TestForm !== undefined) TestForm.$setUntouched();
      return testDS.getTestById(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedRequirements;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.testDetail = data.data;

          vm.testDetail.fixedComment = vm.testDetail.fixedComment === null || vm.testDetail.fixedComment === undefined ? "" : vm.testDetail.fixedComment;
          vm.testDetail.fixedCommentEn = vm.testDetail.fixedCommentEn === null || vm.testDetail.fixedCommentEn === undefined ? "" : vm.testDetail.fixedCommentEn;
          vm.testDetail.printComment = vm.testDetail.printComment === null || vm.testDetail.printComment === undefined ? "" : vm.testDetail.printComment;
          vm.testDetail.printCommentEn = vm.testDetail.printCommentEn === null || vm.testDetail.printCommentEn === undefined ? "" : vm.testDetail.printCommentEn;
          vm.testDetail.generalInformation = vm.testDetail.generalInformation === null || vm.testDetail.generalInformation === undefined ? "" : vm.testDetail.generalInformation;
          vm.testDetail.generalInformationEn = vm.testDetail.generalInformationEn === null || vm.testDetail.generalInformationEn === undefined ? "" : vm.testDetail.generalInformationEn;

          vm.level = data.data.level.id;
          vm.sample = data.data.sample.id;
          vm.gender = data.data.gender.id;
          try {
            vm.technique = data.data.technique.id === undefined || data.data.technique.id === 0 ? {
              'name': ''
            } : $filter('filter')(vm.ListTechniques, {
              id: data.data.technique.id
            }, true)[0];
          } catch (e) {
            vm.technique = {
              'name': ''
            }
          }
          try {
            vm.unit = data.data.unit.id === undefined || data.data.unit.id === 0 || data.data.unit.id === null ? {
              'id': null,
              'name': '-- ' + $filter('translate')('0504') + ' --',
            } : $filter('filter')(vm.ListUnits, {
              id: data.data.unit.id
            }, true)[0];
          } catch (e) {
            vm.unit = {
              'id': null,
              'name': '-- ' + $filter('translate')('0504') + ' --',
            }
          }
          if (vm.testDetail.formula === undefined) {
            vm.textformula = '';
            vm.concurrenceFormula = [];
          }
          //vm.changeRange();
          vm.minAge = vm.testDetail.minAge;
          vm.maxAge = vm.testDetail.maxAge;
          vm.dataConcurrence = [];
          vm.resultType = vm.testDetail.resultType == 1;
          vm.listConcurrences = '';
          vm.concatConcurrence = $filter('filter')(vm.testDetail.concurrences, {
            selected: true
          }, true);
          vm.concatConcurrence.forEach(function (value) {
            vm.listConcurrences = vm.listConcurrences +
              value.concurrence.abbr + ',';
          });
          vm.listConcurrences = vm.listConcurrences.substr(0, vm.listConcurrences.length - 1);
          vm.processingDays = vm.testDetail.processingDays.substr(0, 1) + ',' +
            vm.testDetail.processingDays.substr(1, 1) + ',' +
            vm.testDetail.processingDays.substr(2, 1) + ',' +
            vm.testDetail.processingDays.substr(3, 1) + ',' +
            vm.testDetail.processingDays.substr(4, 1) + ',' +
            vm.testDetail.processingDays.substr(5, 1) + ',' +
            vm.testDetail.processingDays.substr(6, 1) + ',';
          vm.dataRequirements = [];
          data.data.requirements.forEach(function (field) {
            var id = field.id;
            var code = field.code;
            var selected = field.selected;
            vm.dataRequirements.push({
              'id': id,
              'code': code,
              'selected': selected
            });
          });



        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que consulta la fromula del examen*//
    function getTestFormula(id) {
      vm.inFormula = false;

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestFormula(auth.authToken, id).then(function (data) {
        //vm.inFormula = data.data.length > 0;
        vm.inFormula = false
      });
    }
    //** Método para los requeridos del examen*//
    function popuplistechnique() {
      ModalService.showModal({
        templateUrl: 'ListTechniques.html',
        controller: 'techniquesController',
        inputs: {
          Listechniques: vm.ListTechniques,
          techniqueselect: vm.technique
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          if (result.result === 'save') {
            vm.technique = result.list;
          }

        });
      });

    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          "area": ' - ' + $filter('filter')(vm.ListAreas, {
            'id': vm.ListAreas.id
          })[0].name
        };
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/test/test/test.mrt';
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
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.testDetail.id === null || vm.testDetail.id === undefined ?
          true : false;
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
          document.getElementById('code').focus()
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
          document.getElementById('code').focus()
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
    //** Método para mostrar la modal de concurrencias
    function accept(e) {
      vm.loadingdata = true;
      vm.listConcurrences = '';
      vm.testDetail.concurrences = $filter('filter')(vm.testDetail.concurrences, {
        selected: true
      }, true);
      vm.dataConcurrence.forEach(function (value) {
        if (value.selected || value.formula) {
          vm.listConcurrences = vm.listConcurrences + value.abbr + ',';
        }
      });
      vm.listConcurrences = vm.listConcurrences.substr(0, vm.listConcurrences.length - 1);
      angular.element('#modalConcurrence').modal('hide');
      vm.loadingdata = false;
    }


    vm.cancel = cancel;
    function cancel() {
      vm.loadingdata = true;
      vm.dataConcurrence = [];
      var dataDetail = [];
      var idioma = $filter('translate')('0000');
      dataDetail = JSON.parse(JSON.stringify(vm.concurrDetail));
      dataDetail.forEach(function (value, i) {
        if (vm.selected !== dataDetail[i].concurrence.id) {
          var formula = $filter("filter")(vm.concurrenceFormula, function (e) {
            return dataDetail[i].concurrence.id === e.concurrence.id;
          })
          if (dataDetail[i].selected || formula.length !== 0) {
            vm.listConcurrences = vm.listConcurrences + dataDetail[i].concurrence.abbr + ',';
          }
          var g = dataDetail[i].gender === 42 ? 2 : dataDetail[i].gender - 7;
          var age = dataDetail[i].minAge.toString() + ' - ' + dataDetail[i].maxAge.toString() + ' ' + vm.ListUnitAge[dataDetail[i].unitAge - 1].text.substr(0, 1);
          var validGender = vm.gender === 42 || vm.gender === dataDetail[i].gender || dataDetail[i].gender === 42;
          var validAge = true;
          vm.dataConcurrence.push({
            'id': dataDetail[i].concurrence.id,
            'codnamesex': dataDetail[i].concurrence.code + dataDetail[i].concurrence.name + (idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA),
            'code': dataDetail[i].concurrence.code,
            'abbr': dataDetail[i].concurrence.abbr,
            'name': dataDetail[i].concurrence.name,
            'gender': idioma === 'esCo' ? vm.ListGender[g].esCo : vm.ListGender[g].enUSA,
            'ageRange': age,
            'quantity': '(' + dataDetail[i].quantity.toString() + ')',
            'formula': formula.length === 0 ? false : true,
            'selected': formula.length === 0 ? false : true,
            'isGender': validGender,
            'isAge': validAge
          });
        }
      });
      vm.listConcurrences = vm.listConcurrences.substr(0, vm.listConcurrences.length - 1);
      vm.loadingdata = false;
      angular.element('#modalConcurrence').modal('hide');
    }
    //** Método que controla los text area
    function keyPressTextarea($event, index) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      //vm.texareaHtml[index - 1] = document.getElementById('comment' + index.toString()).innerHTML;
      var c = '';
      if (keyCode === 13) {
        var target = '<' + $event.target.lastChild.localName + '>';
        var n = document.getElementById('comment' + index.toString()).innerHTML.split(target).length;
        var arr = document.getElementById('comment' + index.toString()).innerHTML.split(target);
        c = arr[0];
        for (var i = 1; i <= n - 1; i++) {
          c = c + '<br>' + arr[i];
        }
        vm.texareaHtml[index - 1] = c;

      } else if (keyCode > 31 && keyCode < 255 && keyCode !== 127 && $event.key !== 'Delete') {
        if (vm.texareaHtml[index - 1] !== undefined)
          vm.texareaHtml[index - 1] = vm.texareaHtml[index - 1] + $event.key;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceTestController($scope, hideArea, hideSample, close) {
    $scope.hideArea = hideArea;
    $scope.hideSample = hideSample;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
  //** Controller de la vetana modal lista de unidades//
  function ListUnitsController($scope, close, listunits, $filter, unitselect) {
    var vm = this;
    vm.Orderdemo = Orderdemo;


    $scope.selectedchange = function (unit) {
      if (unit.selected === true || unit.selected === undefined) {
        listunits.forEach(function (value, key) {
          if (unit.id === value.id) {
            value.selected = true;
          } else {
            value.selected = false;
          }

        });
      }
    };


    $scope.listunits = listunits;
    $scope.selectedchange(unitselect);
    $scope.listunits = listunits.sort(vm.Orderdemo);



    $scope.close = function (result) {
      var list = $filter('filter')(listunits, {
        selected: true
      });
      var list = list.length === 0 ? {
        'name': ''
      } : list[0];
      var data = {
        'result': result,
        'list': list
      }
      close(data, 500); // close, but give 500ms for bootstrap to animate
    };

    function Orderdemo(a, b) {
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
  }
  //** Controller de la vetana modal tecnicas//
  function techniquesController($scope, close, Listechniques, $filter, techniqueselect) {
    var vm = this;
    vm.Orderdemo = Orderdemo;
    $scope.selectedchange = function (Techniques) {
      if (Techniques.selected === true || Techniques.selected === undefined) {

        Listechniques.forEach(function (value, key) {

          if (Techniques.id === value.id) {
            value.selected = true;
          } else {
            value.selected = false;
          }
        });
      }
    };
    $scope.Listechniques = Listechniques;
    $scope.selectedchange(techniqueselect);
    Listechniques = Listechniques.sort(vm.Orderdemo);

    $scope.close = function (result) {
      var list = $filter('filter')(Listechniques, {
        selected: true
      });
      var list = list.length === 0 ? {
        'name': ''
      } : list[0];
      var data = {
        'result': result,
        'list': list
      }
      close(data, 500); // close, but give 500ms for bootstrap to animate
    };

    function Orderdemo(a, b) {
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
  }
})();
