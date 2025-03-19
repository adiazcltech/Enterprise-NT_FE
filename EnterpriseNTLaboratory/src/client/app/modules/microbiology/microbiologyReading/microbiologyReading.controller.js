/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.microbiologyReading")
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          htmlCode = htmlCode.replace(/p/g, "span");
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ])
    .controller("microbiologyReadingController", microbiologyReadingController);

  microbiologyReadingController.$inject = [
    "documenttypesDS",
    "ordertypeDS",
    "resultsentryDS",
    "localStorageService",
    "logger",
    "userDS",
    "serviceDS",
    "branchDS",
    "orderentryDS",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "$scope",
    "common",
    "patientDS",
    "commentsDS",
    "commentDS",
    "$hotkey",
    "testDS",
    "microbiologyDS",
    "sampletrackingsDS",
    "mediaculturesDS",
    "proceduresDS",
    "$translate",
    "LZString",
  ];

  function microbiologyReadingController(
    documenttypesDS,
    ordertypeDS,
    resultsentryDS,
    localStorageService,
    logger,
    userDS,
    serviceDS,
    branchDS,
    orderentryDS,
    $filter,
    $state,
    moment,
    $rootScope,
    $scope,
    common,
    patientDS,
    commentsDS,
    commentDS,
    $hotkey,
    testDS,
    microbiologyDS,
    sampletrackingsDS,
    mediaculturesDS,
    proceduresDS,
    $translate,
    LZString
  ) {
    var vm = this;
    vm.init = init;
    vm.title = "microbiologyReading";
    vm.state = true;
    $rootScope.pageview = 3;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0026");
    $rootScope.helpReference = "03.Microbiology/microbiologyReading.htm";
    vm.showlistordertable = true;
    vm.hotkeysvalidate = hotkeysvalidate;
    vm.hotkeysvalidatepass = hotkeysvalidatepass;
    vm.repeattest = repeattest;
    vm.getkeysnumber = getkeysnumber;
    vm.testdelete = testdelete;
    vm.editResult = editResult;
    vm.canceleditresult = canceleditresult;
    vm.automaticalcul = automaticalcul;
    vm.separator = "-";
    vm.typefilterorder = 0;
    vm.idDemoAutoEmail = localStorageService.get(
      "DemograficoEnvioCorreoAutomatico"
    );
    vm.idDemoAutoEmail =
      vm.idDemoAutoEmail === null || vm.idDemoAutoEmail === 0
        ? 0
        : parseInt(vm.idDemoAutoEmail);
    vm.idDemoItemAutoEmail = localStorageService.get(
      "ItemDemograficoEnvioCorreoAutomatico"
    );
    vm.idDemoItemAutoEmail =
      vm.idDemoItemAutoEmail === null || vm.idDemoItemAutoEmail === 0
        ? 0
        : parseInt(vm.idDemoItemAutoEmail);
    vm.datatest = datatest;
    vm.changuestateprint = changuestateprint;
    vm.saveconfirmation = saveconfirmation;
    vm.updatereference = updatereference;
    vm.printselect = printselect;
    vm.testdevalidated = testdevalidated;
    vm.deletedResult = deletedResult;
    vm.resultblurEventonumber = resultblurEventonumber;
    vm.resultKeyEventonumber = resultKeyEventonumber;
    vm.updateTestformula = updateTestformula;
    vm.selectresult = selectresult;
    vm.selectTestlist = selectTestlist;
    vm.getkeys = getkeys;
    vm.resultKeyEventlist = resultKeyEventlist;
    vm.keyselect = keyselect;
    vm.getTestMicrobiology = getTestMicrobiology;
    vm.getSampleOrder = getSampleOrder;
    vm.tasksperpatient = tasksperpatient;
    vm.generateDataReport = generateDataReport;
    vm.automaticresulteliminated =
      localStorageService.get("AutomaticoEliminarFormula") === "True";
    vm.Literalrequired =
      localStorageService.get("Literalesobligatorio") === "True";
    vm.automaticresultfomule =
      localStorageService.get("AutomaticoModificaFormula") === "True";
    vm.preliminarview =
      localStorageService.get("PermisoPorUsuarioReportPreliminar") === "True";
    vm.viewObservations =
      localStorageService.get("VerObservaciones") === "True";
    vm.viewnotes = localStorageService.get("AddNotes") === "True";
    vm.vieweditingResultsProcessing =
      localStorageService.get("Agregaredicionresultadosusuario") === "True";
    vm.branchnameresult = localStorageService.get("Branchname");
    vm.tasksreport = tasksreport;

    vm.colspanviewnotes = vm.viewnotes ? 12 : 11;
    vm.colspanviewnotesperfil = vm.viewnotes ? 20 : 19;
    vm.samplefilter = null;
    vm.loaddata = false;

    vm.getprocedure = getprocedure;
    vm.getmediacultures = getmediacultures;
    /*   */

    // //Asigna eventos a los hotkeys
    $hotkey.bind("F2", function (event) {
      if (
        vm.commentButton &&
        $state.$current.controller === "microbiologyReadingController"
      ) {
        vm.openresultcomment = true;
      }
    });

    $hotkey.bind("F3", function (event) {
      if (
        vm.microbiologyButton &&
        $state.$current.controller === "microbiologyReadingController"
      ) {
        vm.openresultmicrobiology = true;
      }
    });
    $hotkey.bind("F4", function (event) {
      if (
        vm.commentButton &&
        $state.$current.controller === "microbiologyReadingController"
      ) {
        vm.openmodalresultstemplate = true;
      }
    });

    $hotkey.bind("F7", function (event) {
      if (vm.permissionuser.secondValidation) {
        if (
          vm.validateButton &&
          $state.$current.controller === "microbiologyReadingController"
        ) {
          vm.hotkeysvalidate();
        }
      }
    });

    $hotkey.bind("F8", function (event) {
      UIkit.modal("#modaldate", { modal: false }).show();
      setTimeout(function () {
        document.getElementById("microbiology").focus();
      }, 2000);
    });

    $hotkey.bind("F9", function (event) {
      if (
        vm.permissionuser.preValidationRequired ||
        vm.permissionuser.secondValidation
      ) {
        if (
          vm.validateButton &&
          $state.$current.controller === "microbiologyReadingController"
        ) {
          vm.hotkeysvalidatepass();
        }
      }
    });

    //Variables generales
    vm.isAuthenticate = isAuthenticate;
    vm.modalError = modalError;
    vm.setFilter = setFilter;
    vm.toggleStyleSwitcher = toggleStyleSwitcher;
    vm.styleSwitcherActive = false;

    vm.widgetResultados = localStorageService.get("WidgetResultados") * 60;
    vm.resultKeyEvent = resultKeyEvent;
    vm.formatDateAge = localStorageService.get("FormatoFecha").toUpperCase();
    vm.typedocumentkey = localStorageService.get("ManejoTipoDocumento");
    vm.ordergroup = localStorageService.get("AgrupacionOrdenes");
    vm.orderbyorder = localStorageService.get("OrdenamientoRegistroResultados");
    vm.permissionuser = localStorageService.get("user");
    vm.femaleValueFormula = localStorageService.get("FemaleValue");
    vm.maleValueFormula = localStorageService.get("MaleValue");
    vm.undefinedValueFormula = localStorageService.get("UndefinedValue");
    vm.reasonResultEdit =
      localStorageService.get("MotivoModificacionResultado") === "True";
    vm.user = localStorageService.get("Enterprise_NT.authorizationData");
    var orderdigit = localStorageService.get("DigitosOrden");
    vm.maxcantdigit = parseInt(orderdigit) + 8;
    vm.loading = false;
    vm.pruebalist = true;
    //Variables para la gestión de las órdenes
    vm.filter = {};
    vm.orderTypes = [];
    vm.dataStatistic = [];
    vm.dataOrders = [];
    vm.dataOrdersOrigin = [];
    vm.selectedOrder = [];
    vm.selectedOrderIndex = 0;
    vm.getOrderTypeColor = getOrderTypeColor;
    vm.getResultStatistic = getResultStatistic;
    vm.getOrderTypes = getOrderTypes;
    vm.loadphotopatient = loadphotopatient;
    vm.trackingmicrobiologytask = trackingmicrobiologytask;
    vm.sortType = "none";
    vm.sortReverse = false;
    vm.photopatient = "";
    vm.getComment = getComment;
    vm.searchhistory = "";

    //Variables para la gestion de filtros
    vm.filterRange = "1";
    //vm.rangeInit = moment().format('YYYYMMDD');
    //vm.rangeEnd = moment().format('YYYYMMDD');
    vm.listAreasActive = [];
    vm.areaselected = {};
    vm.ordertypeselected = {};
    vm.demographicsfilter = [];
    vm.resultfilter1 = "";
    vm.resultfilter2 = "";
    vm.filterinternal = {};
    vm.countwidget = {};
    vm.stateFilters = 3;
    vm.timefilter = null;
    vm.countwidget.result = null;
    vm.countwidget.valid = null;
    vm.countwidget.inprevalid = null;
    vm.countwidget.report = null;
    vm.countwidget.attachment = null;
    vm.countwidget.urgency = null;
    vm.countwidget.panic = null;
    vm.countwidget.critical = null;
    vm.countwidget.oportunity = null;
    vm.listorderresultfilter = [];
    vm.filterResult = [];
    vm.searchorder = "";
    vm.reportedDoctor = "";
    vm.getcountwidget = getcountwidget;
    vm.validresultfilter = validresultfilter;
    vm.changeresultfiltersign = changeresultfiltersign;
    vm.changeresultfiltertest = changeresultfiltertest;
    vm.loadpreviousfilter = loadpreviousfilter;
    vm.gettypedocument = gettypedocument;
    vm.removedatatestfilter = removedatatestfilter;
    vm.openmodalfilterresult = openmodalfilterresult;
    vm.addfilterresult = addfilterresult;
    vm.applyfilterresult = applyfilterresult;
    vm.removefilterresult = removefilterresult;
    vm.searchorderbyhistory = searchorderbyhistory;
    vm.orderListTest = orderListTest;
    vm.autocomplenumberorder = autocomplenumberorder;

    //Variables para la gestión de los exámenes
    vm.orderTests = [];
    vm.orderDetail = [];
    vm.selectedTest = [];
    vm.currentTest = null;
    vm.repetitionMotives = [];
    vm.removeData = removeData;
    vm.getOrdersByFilter = getOrdersByFilter;
    vm.selectOrder = selectOrder;
    vm.selectNextOrder = selectNextOrder;
    vm.selectPreviewtOrder = selectPreviewtOrder;
    vm.getTestByOrderId = getTestByOrderId;
    vm.assingformulaordertest = assingformulaordertest;
    vm.updateTest = updateTest;
    vm.validateTestsBase = validateTestsBase;
    vm.validateTestsWarnings = validateTestsWarnings;
    vm.validateTests = validateTests;
    vm.validateAndNext = false;
    vm.validateTestsPreview = validateTestsPreview;
    vm.desvalidateTests = desvalidateTests;
    vm.getPathologyIcon = getPathologyIcon;
    vm.getCriticIcon = getCriticIcon;
    vm.getOportunityIcon = getOportunityIcon;
    vm.getResultTypeIcon = getResultTypeIcon;
    vm.selectTest = selectTest;
    vm.savecommenttest = savecommenttest;
    vm.calcFormula = calcFormula;
    vm.selectobjectall = selectobjectall;
    vm.selectprofiltall = selectprofiltall;
    vm.saverepeattest = saverepeattest;
    vm.refreshsetFilter = refreshsetFilter;
    vm.tendencyGraph = tendencyGraph;
    vm.blockTest = blockTest;
    vm.saveblocktest = saveblocktest;
    vm.saveunblocktest = saveunblocktest;
    vm.testInformation = testInformation;
    vm.updateinformationtest = updateinformationtest;
    vm.setRecalltest = setRecalltest;
    vm.moveNextTest = moveNextTest;
    vm.gettime = gettime;
    vm.stopTimer = stopTimer;
    //Variables para el registro de resultados literales
    vm.getLiteralResult = getLiteralResult;
    vm.literalResult = [];
    //Variables para el uso de comentarios codificados
    vm.getCodeComment = getCodeComment;
    vm.codeCommentList = [];
    //Variables para la entrevista de pánico
    vm.panicSurvey = [];
    vm.getPanicSurvey = getPanicSurvey;
    vm.getTypeInterview = getTypeInterview;
    vm.panicSurveyTests = [];
    //Variables para el control de los botones
    vm.detailButton = false;
    vm.inconsistencyButton = false;
    vm.commentButton = false;
    vm.attachmentButton = false;
    vm.repetitionButton = false;
    vm.microbiologyButton = false;
    vm.addButton = false;
    vm.historyButton = false;
    vm.samplingButton = false;
    vm.prevalidateButton = false;
    vm.validateButton = false;
    vm.desvalidateButton = false;
    vm.repetitionlistButton = false;
    vm.previewButton = false;
    vm.printButton = false;
    vm.selectCheckAll = selectCheckAll;
    vm.literalOut = literalOut;
    vm.getLiteralData = getLiteralData;
    vm.selectpostpoment = selectpostpoment;
    vm.windowOpenReport = windowOpenReport;
    vm.generateDataReport = generateDataReport;
    vm.adddate = adddate;
    vm.literalData = [];
    vm.totalgrouporder = 0;
    vm.countresult = 0;

    vm.LineChart = {
      options: {
        width: 100,
      },
    };

    vm.optionsgeneralurgency = {
      animation: false,
      color: ["#FFEE21", "#eaeaea"],
    };
    vm.optionsgeneralpanic = {
      animation: false,
      color: ["#FFA421", "#eaeaea"],
    };
    vm.optionsgeneralcritical = {
      animation: false,
      color: ["#FF2121", "#eaeaea"],
    };

    vm.optionsgeneralattachment = {
      animation: false,
      color: ["#FFABD5", "#eaeaea"],
    };

    vm.optionsgeneraloportunity = {
      tooltip: {
        trigger: "axis",
        position: [-50, 10],
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          return (
            params[0].seriesName +
            " : " +
            params[0].value +
            "<br/>" +
            params[1].seriesName +
            " : " +
            (params[1].value + params[0].value)
          );
        },
      },
      grid: [
        {
          x: 15,
          y: 20,
          x2: 50,
          y2: 15,
          width: "50%",
        },
      ],
      dataZoom: {
        show: false,
        start: 0,
        end: 1,
      },
      xAxis: [
        {
          type: "category",
          data: ["Por vencer", "Vencidas"],
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
      ],
    };

    vm.testState = {
      ORDERED: 0,
      RERUN: 1,
      REPORTED: 2,
      PREVIEW: 3,
      VALIDATED: 4,
      PRINTED: 5,
    };

    $rootScope.$watch("orderalarm", function () {
      if ($rootScope.orderalarm !== undefined) {
        vm.searchorder = $rootScope.orderalarm;
        vm.setFilter();
      }
    });

    /**
     Funcion
     @author  adiaz
   */
    function stopTimer() {
      $scope.$broadcast("timer-stop");
      $scope.timerRunning = false;
    }
    /**
     Funcion
     @author  adiaz
   */
    function gettime() {
      $scope.$broadcast("timer-stop");
      if (vm.timefilter !== null) {
        vm.loading = true;
        $scope.$broadcast("timer-start");
        vm.setFilter();
      }
    }
    /**
      Funcion
      @author  adiaz
    */
    function getLiteralData(p_testId) {
      //TODO: Filtrar la lista de literales por el id del examen
      var literalFilter = $filter("filter")(vm.literalResult, function (e) {
        return e.testId === p_testId;
      });
      return literalFilter;
    }
    /**
      Funcion
      @author  adiaz
    */
    function literalOut(obj) {
      //window.alert('You have selected ' + obj.result);
      if (obj.literalSelected != undefined) {
        obj.result = obj.literalSelected.originalObject.name;
        obj.literalSelected = undefined;
      }
    }
    /**
      Funcion
      @author  adiaz
    */
    function hotkeysvalidate() {
      vm.validateTestsWarnings(false);
    }
    /**
      Funcion
      @author  adiaz
    */
    function hotkeysvalidatepass() {
      vm.validateTestsWarnings(true);
    }
    /**
      Funcion
      @author  adiaz
    */
    function removeData(data) {
      var dataTemp = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        data.data[key].userId = auth.id;
        dataTemp.push(data.data[key]);
      });

      return dataTemp;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    /**
      Funcion  Método para sacar el popup de error
          @author  adiaz
    */
    function gettypedocument() {
      vm.valueinittypedocument = {
        id: 0,
        abbr: "SF",
        name: $filter("translate")("0919"),
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listdocumentType = [];
      return documenttypesDS.getstatetrue(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            var documentTypes = data.data;
            documentTypes.push({
              id: 0,
              abbr: "SF",
              name: $filter("translate")("0919"),
            });
            documentTypes = documentTypes.sort(function (a, b) {
              if (a.id > b.id) {
                return 1;
              } else if (a.id < b.id) {
                return -1;
              } else {
                return 0;
              }
            });
            vm.listdocumentType = documentTypes;
          }
          vm.valueinittypedocument = {
            id: 0,
            abbr: "SF",
            name: $filter("translate")("0919"),
          };
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Obtiene la lista de tipos de orden
      @author  jblanco
      @return  Lista de tipos de orden
      @version 0.0.1
    */
    function getOrderTypes() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      return ordertypeDS.getlistOrderType(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.orderTypes = [
              {
                id: 0,
                name: $filter("translate")("0353"),
                code: "",
              },
            ];
            vm.ordertypeselected = {
              id: 0,
              name: $filter("translate")("0353"),
              code: "",
            };
            vm.orderTypes = vm.orderTypes.concat(removeData(data));
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
        Funcion  Obtiene el color del tipo de orden
        @author  jblanco
        @param   orderType: identificador del tipo de orden
        @param   bg:        indicador para obtener el color de fondo (true) o el color del texto (false)
        @return  string:    clase que representa el color.
        @version 0.0.1
      */
    function getOrderTypeColor(orderType) {
      var color = $filter("filter")(vm.orderTypes, {
        code: orderType,
      })[0];
      if (color != null && color.color != null) {
        return color.color;
      } else {
        switch (orderType) {
          case "R":
            return "#a5d6a7";
          case "S":
            return "#ef5350";
          case "P":
            return "#ce93d8";
          case "A":
            return "#90caf9";
          case "C":
            return "#fff176";
          default:
            return "#90caf9";
        }
      }
    }
    /**
      Funcion  Obtiene el nombre de la imagen para representar la patología del resultado
      @author  jblanco
      @param   pathology: código de la patología del resultado
      @return  string:   clase que represeta el ícono
      @version 0.0.1
    */
    function getPathologyIcon(pathology, smallSize) {
      var size = smallSize ? " uk-icon-small" : "";
      switch (pathology) {
        case 0:
          return "";
        case 1:
          return "uk-icon-exclamation uk-text-warning" + size;
        case 2:
          return "uk-icon-chevron-down uk-text-warning";
        case 3:
          return "uk-icon-chevron-up uk-text-warning";
        case 4:
        case 7:
          return "uk-icon-exclamation-triangle uk-text-danger";
        case 5:
        case 8:
          return "uk-icon-angle-double-down uk-text-danger uk-icon-small";
        case 6:
        case 9:
          return "uk-icon-angle-double-up uk-text-danger uk-icon-small";
        default:
          return "";
      }
    }
    /**
      Funcion  Obtiene el nombre de la imagen para representar la patología del resultado
      @author  jblanco
      @param   pathology: código de la patología del resultado
      @return  string:   clase que represeta el ícono
      @version 0.0.1
    */
    function getCriticIcon(pathology) {
      switch (pathology) {
        case 7:
        case 8:
        case 9:
          return "uk-icon-heartbeat uk-text-danger";
        default:
          return "";
      }
    }
    /**
      Funcion  Obtiene el nombre de la imagen para representar la oportunidad del paciente
      @author  jblanco
      @param   state: código de la oportunidad
      @return  string:clase que representa el ícono
      @version 0.0.1
    */
    function getOportunityIcon(state) {
      switch (state) {
        // case 0:
        //     return 'uk-icon-clock-o uk-icon-small uk-text-success';
        //case 1:
        //return 'uk-icon-clock-o uk-icon-small uk-text-warning';
        case 1:
          return "uk-icon-clock-o uk-icon-small uk-text-danger";
        default:
          //return 'uk-icon-clock-o uk-icon-small uk-text-primary';
          return "";
      }
    }
    /**
      Funcion  Obtiene el nombre de la imagen para representar tipo de resultado
      @author  jblanco
      @param   resultType: código del tipo de resultado
      @return  string:     clase que representa el ícono
      @version 0.0.1
    */
    function getResultTypeIcon(resultType, literalResult, formula) {
      switch (resultType) {
        case 1:
          if (formula !== "") {
            return "uk-icon-superscript";
          } else {
            return "uk-icon-hashtag";
          }

        case 2:
          if (literalResult === 0) {
            return "uk-icon-text-width";
          } else {
            return "uk-icon-list";
          }

        default:
          return "uk-icon-superscript";
      }
    }
    /**
      Funcion  Obtiene la lista de los resultados literales
      @author  jblanco
      @version 0.0.1
    */
    function getLiteralResult() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.getLiterals(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.literalResult = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectobjectall(all, data) {
      vm.microbiologyGrowth = "N/A";
      for (var j = 0; j < data.length; j++) {
        if (data[j].viewprofil === false) {
          if (
            data[j].block.blocked ||
            !data[j].grantAccess ||
            data[j].sampleState === 1 ||
            data[j].blockdays === true
          ) {
          } else {
            data[j].isSelected = all;
          }
        } else {
          data[j].selecprofil = all;
        }
      }
      vm.selectedTest = !vm.selectall ? [] : data;
      updateButtonBarByTest();
    }

    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectprofiltall(all, data, profil) {
      for (var j = 0; j < data.length; j++) {
        if (data[j].viewprofil === false) {
          if (
            data[j].block.blocked ||
            !data[j].grantAccess ||
            data[j].sampleState === 1 ||
            data[j].blockdays === true
          ) {
          } else {
            if (data[j].profileId === profil) {
              data[j].isSelected = all;
            }
          }
        }
      }
      vm.selectedTest = data;
      updateButtonBarByTest();
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectpostpoment() {
      vm.selectedTestpostpoment = [];
      var completedata = [];
      angular.forEach(vm.orderTests, function (item) {
        angular.forEach(item, function (dataitem) {
          completedata.push(dataitem);
        });
      });
      vm.selectedTestpostpoment =
        completedata.length === 0 ? vm.selectedTest : completedata;
      vm.openmodalpostponement = true;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function toggleStyleSwitcher($event) {
      $event.preventDefault();
      vm.styleSwitcherActive = !vm.styleSwitcherActive;
      if (vm.styleSwitcherActive && vm.searchorder === "") {
        vm.setFilter();
      }
    }

    vm.selectrepition = selectrepition;
    function selectrepition() {
      vm.selectedTestrepition = vm.orderTests;
      vm.ordercomplete = vm.selectedTest.length === 0 ? true : false;
      vm.openmodalrepetition = true;
    }
    /**
 Funcion  Método para consultar los servicios
     @author  adiaz
 */
    vm.getService = getService;
    function getService() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listServices = [];
      return serviceDS.getService(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listServices = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**  Funcion  Método para consultar las sede
      @author  adiaz
  */
    vm.getbranch = getbranch;
    function getbranch() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.listbranch = [];
      return branchDS.getBranch(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listbranch = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    /**
      Funcion metodo para cargar un filtro que se consfigura con anterioridad
      @author  adiaz
    */
    function loadpreviousfilter() {
      /*  var timeline = moment().add(vm.widgetResultados, 'seconds');
       vm.timefilter = parseInt(moment(timeline).format('x')); */
      if (vm.filter.filterRange !== undefined) {
        vm.rangeinittemp =
          vm.filter.filterRange === "0"
            ? vm.filter.firstDate + 1
            : vm.filter.firstOrder + 1;
        vm.rangeendtemp =
          vm.filter.filterRange === "0"
            ? vm.filter.lastDate - 1
            : vm.filter.lastOrder - 1;
        vm.filterRange = vm.filter.filterRange;
      }
      vm.stateFilters = 2;
    }
    /**
      Funcion  Configura el filtro principal para la consulta de las órdenes y los exámenes
      @author  jblanco
    */
    function setFilter(orderFilter) {
      vm.selectedOrder = undefined;
      vm.orderTests = [];
      vm.patientdata = {};
      vm.patient = undefined;
      vm.loaddata = false;
      vm.dataOrders = [];
      vm.loading = true;
      vm.dataOrdersOrigin = [];
      vm.stateFilters = 1;
      vm.searchhistory = "";
      vm.countwidget.result = null;
      vm.countwidget.valid = null;
      vm.countwidget.inprevalid = null;
      vm.countwidget.report = null;
      vm.countwidget.attachment = null;
      vm.countwidget.urgency = null;
      vm.countwidget.panic = null;
      vm.countwidget.critical = null;
      vm.countwidget.oportunity = null;

      vm.filter.rangeType = vm.filterRange;
      vm.filter.firstOrder =
        vm.filterRange === "0"
          ? 0 - 1
          : parseInt(
              vm.rangeInit === "" || vm.rangeInit === undefined
                ? vm.orderfilter
                : vm.rangeInit
            ) - 1; //No incluye la primera orden
      vm.filter.lastOrder =
        vm.filterRange === "0"
          ? 0 + 1
          : parseInt(
              vm.rangeEnd === "" || vm.rangeEnd === undefined
                ? vm.orderfilter
                : vm.rangeEnd
            ) + 1; //No incluye la última  orden

      vm.filter.init =
        vm.filterRange !== "0" ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera fecha
      vm.filter.end =
        vm.filterRange !== "0" ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  fecha
      vm.filterinfo.textinit =
        vm.filterRange === "0"
          ? $filter("translate")("0075")
          : $filter("translate")("0073");
      vm.filterinfo.valueinit =
        vm.filterRange === "0"
          ? moment(vm.rangeInit).format(vm.formatDateAge)
          : vm.rangeInit === "" || vm.rangeInit === undefined
          ? vm.orderfilter.substring(3)
          : vm.rangeInit.substring(3);
      vm.filterinfo.textend =
        vm.filterRange === "0"
          ? $filter("translate")("0076")
          : $filter("translate")("0074");
      vm.filterinfo.valueend =
        vm.filterRange === "0"
          ? moment(vm.rangeEnd).format(vm.formatDateAge)
          : vm.rangeEnd === "" || vm.rangeEnd === undefined
          ? vm.orderfilter.substring(3)
          : vm.rangeEnd.substring(3);

      if (vm.sample !== null && vm.sample !== "") {
        vm.filter.codeSample = vm.sample;
      }

      vm.filter.test = vm.testselected.id;
      vm.filter.report = vm.report.id;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.filter.userId = auth.id;
      if (vm.rangeInit === "" || vm.rangeInit === undefined) {
        vm.messagerestartTask = $filter("translate")("0590")
          .replace("@@@@", vm.orderfilter)
          .replace("@@@@", vm.orderfilter);
      } else {
        vm.messagerestartTask = $filter("translate")("0590")
          .replace("@@@@", vm.rangeInit)
          .replace("@@@@", vm.rangeEnd);
      }
      return microbiologyDS
        .getmicrobiologyresultorder(auth.authToken, vm.filter)
        .then(
          function (data) {
            if (data.status === 200) {
              data.data = $filter("filter")(data.data, function (e) {
                return e.sampleState !== 1;
              });
              data.data.forEach(function (value) {
                if (value.sex.id == 7) {
                  value.sex = {
                    id: 7,
                    code: "1",
                    esCo: "Masculino",
                    enUsa: "Male",
                  };
                }
                if (value.sex.id == 8) {
                  value.sex = {
                    id: 8,
                    code: "2",
                    esCo: "Femenino",
                    enUsa: "Female",
                  };
                }
                if (value.sex.id == 9) {
                  value.sex = {
                    id: 9,
                    code: "3",
                    esCo: "Indefinido",
                    enUsa: "Undefined",
                  };
                }
                if (value.sex.id == 42) {
                  value.sex = {
                    id: 42,
                    code: "4",
                    esCo: "Ambos",
                    enUsa: "Both",
                  };
                }

                var typeorder = _.filter(_.clone(vm.orderTypes), function (x) {
                  return value.idOrderType === x.id;
                });
                if (typeorder.length > 0) {
                  value.orderTypeName = typeorder[0].name;
                  value.orderType = typeorder[0].code;
                }

                if (vm.listbranch.length === 1) {
                  value.branch = vm.branchnameresult;
                } else {
                  var Branchlist = _.filter(
                    _.clone(vm.listbranch),
                    function (x) {
                      return parseInt(value.branch) === x.id;
                    }
                  );
                  if (Branchlist.length > 0) {
                    value.branch = Branchlist[0].name;
                  }
                }

                if (value.idService !== 0) {
                  var service = _.filter(
                    _.clone(vm.listServices),
                    function (x) {
                      return x.id == value.idService;
                    }
                  );
                  if (service.length > 0) {
                    value.service = service[0].name;
                    value.codeService = service[0].code;
                  }
                } else {
                  value.service = "";
                }
                var idtype = _.filter(
                  _.clone(vm.listdocumentType),
                  function (x) {
                    return x.id === parseInt(value.idtype);
                  }
                );
                if (idtype.length > 0) {
                  value.idtype = idtype[0].abbr;
                }
                value.size = 0;
                value.weight = 0;
              });
              vm.filterinternal.report = false;
              vm.filterinternal.valid = false;
              vm.filterinternal.inprevalid = false;
              vm.filterinternal.result = false;
              vm.dataOrdersOrigin = _.clone(data.data);
              vm.dataOrders = _.uniqBy(data.data, "order");

              if (orderFilter === undefined) {
                vm.selectOrder(1, data.data[0], 0);
              } else {
                var filterOrder = _.filter(data.data, function (o) {
                  return o.order === orderFilter;
                });

                if (filterOrder.length === 0) {
                  vm.selectOrder(1, data.data[0], 0);
                } else {
                  vm.selectOrder(1, filterOrder[0], 0);
                }
              }
              vm.getcountwidget(data.data);
              UIkit.modal("#modaldate").hide();
              vm.loading = false;
              vm.pruebalist = false;
            } else {
              vm.filterinternal.report = false;
              vm.filterinternal.valid = false;
              vm.filterinternal.inprevalid = false;
              vm.filterinternal.result = false;
              vm.loading = false;
              vm.selectedOrder = undefined;
              vm.orderTests = [];
              UIkit.modal("#nofoundfilter").show();
              vm.dataOrders = [];
            }
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
            vm.stateFilters = 3;
          }
        );
    }

    vm.selectorderdelayed = selectorderdelayed;
    function selectorderdelayed() {
      vm.dataresultsdelayed;
      vm.selectOrder(1, vm.dataresultsdelayed, 0);
    }
    /**
      Funcion  función cargar la lista de examenes que aplican para el filtro por resultados.
      @author  adiaz
    */
    function removedatatestfilter() {
      var listtest = [];
      var listtestuniq = _.uniqBy(vm.dataOrdersOrigin, "test");

      listtestuniq.forEach(function (value, key) {
        var test = {
          id: value.test,
          code: value.testCode,
          name: value.testName,
          typeresult: value.testResultType,
        };
        listtest.push(test);
      });

      vm.listtestfilter = listtest.sort(vm.orderListTest);
    }
    /**
      Funcion  función para ordenar la lista de examenes que aplican para el filtro por resultados.
      @author  adiaz
    */
    function orderListTest(a, b) {
      if (a.code !== undefined) {
        return (
          a.code.toString().length - b.code.toString().length ||
          a.code.toString().localeCompare(b.code.toString())
        );
      } else {
        return a.name.toString().localeCompare(b.name.toString());
      }
    }
    /**
      Funcion  Realiza el filtro por los diferentes estados de los witgets
      @author  jblanco
      @param   internalFilter: identificador del filtro aplicado
      @return  data Objeto de tipo ResultOrder
    */
    function getOrdersByFilter(internalFilter) {
      vm.orderTests = [];
      if (vm.dataOrdersOrigin.length > 0) {
        vm.loading = true;

        var datafilter =
          vm.filterResult.length > 0
            ? vm.listorderresultfilter
            : vm.dataOrdersOrigin;
        switch (internalFilter) {
          case 1:
            vm.filterinternal.result = !vm.filterinternal.result;
            vm.filterinternal.valid = false;
            vm.filterinternal.inprevalid = false;
            vm.filterinternal.report = false;
            break;
          case 2:
            vm.filterinternal.result = false;
            vm.filterinternal.valid = !vm.filterinternal.valid;
            vm.filterinternal.inprevalid = false;
            vm.filterinternal.report = false;
            vm.filterinternal.preliminaryTestValidation = false;
            break;
          case 3:
            vm.filterinternal.result = false;
            vm.filterinternal.valid = false;
            vm.filterinternal.inprevalid = false;
            vm.filterinternal.report = !vm.filterinternal.report;
            break;
          case 4:
            vm.filterinternal.attachment = !vm.filterinternal.attachment;
            break;
          case 5:
            vm.filterinternal.urgency = !vm.filterinternal.urgency;
            break;
          case 6:
            vm.filterinternal.result = false;
            vm.filterinternal.panic = !vm.filterinternal.panic;
            break;
          case 7:
            vm.filterinternal.result = false;
            vm.filterinternal.critical = !vm.filterinternal.critical;
            break;
          case 8:
            vm.filterinternal.oportunity = !vm.filterinternal.oportunity;
            break;
          case 9:
            if (vm.filterResult.length > 0) {
              datafilter = vm.listorderresultfilter;
            }
            break;
          case 10:
            vm.filterinternal.result = false;
            vm.filterinternal.inprevalid = !vm.filterinternal.inprevalid;
            vm.filterinternal.valid = false;
            vm.filterinternal.report = false;
            vm.filterinternal.preliminaryTestValidation = true;
            break;
        }

        if (vm.filterinternal.result) {
          datafilter = $filter("filter")(datafilter, function (e) {
            return parseInt(e.testState) < 2;
          });
        } else if (
          vm.filterinternal.valid &&
          !vm.filterinternal.preliminaryTestValidation
        ) {
          datafilter = $filter("filter")(_.clone(datafilter), function (e) {
            return e.testState === 2 && !e.preliminaryTestValidation;
          });
        } else if (
          vm.filterinternal.inprevalid &&
          vm.filterinternal.preliminaryTestValidation
        ) {
          datafilter = _.filter(_.clone(datafilter), function (e) {
            return e.testState === 2 && e.preliminaryTestValidation;
          });
        } else if (vm.filterinternal.report) {
          datafilter = $filter("filter")(_.clone(datafilter), function (e) {
            return e.testState === 4 && e.print;
          });
        }

        var verifidedCount = datafilter.filter(function (x) {
          return parseInt(x.testState) < 2;
        }).length;
        var processedCount = datafilter.filter(function (x) {
          return parseInt(x.testState) === 2 && !x.preliminaryTestValidation;
        }).length;
        var validatedCount = datafilter.filter(function (x) {
          return parseInt(x.testState) === 4 && x.print;
        }).length;

        var preliminaryCount = datafilter.filter(function (x) {
          return parseInt(x.testState) === 2 && x.preliminaryTestValidation;
        }).length;

        vm.countwidget.verifidedCount = verifidedCount;
        vm.countwidget.processedCount = processedCount;
        vm.countwidget.preliminarycount = preliminaryCount;
        vm.countwidget.validatedCount = validatedCount;

        vm.countwidget.verifided = (
          (verifidedCount / vm.dataOrdersOrigin.length) *
          100
        ).toFixed(2);
        vm.countwidget.processed = (
          (processedCount / vm.dataOrdersOrigin.length) *
          100
        ).toFixed(2);
        vm.countwidget.validated = (
          (validatedCount / vm.dataOrdersOrigin.length) *
          100
        ).toFixed(2);
        vm.countwidget.preliminaryTestValidation = (
          (preliminaryCount / vm.dataOrdersOrigin.length) *
          100
        ).toFixed(2);

        vm.dataOrders = _.uniqBy(datafilter, "order");
        if (vm.dataOrders.length !== 0) {
          vm.selectOrder(1, vm.dataOrders[0], 0);
        }
        vm.loading = false;
      }
    }
    /**
      Funcion  Realiza el conteo de los estados de las ordenes.
      @author  adiaz
    */
    function getcountwidget(listorders) {
      vm.countwidget.result = $filter("filter")(
        vm.dataOrdersOrigin,
        function (e) {
          return parseInt(e.testState) < 2;
        }
      );
      vm.countwidget.result =
        vm.countwidget.result.length === 0
          ? 0
          : parseFloat(
              (_.uniqBy(vm.countwidget.result, "order").length * 100) /
                vm.dataOrdersOrigin.length
            ).toFixed(2);

      vm.countwidget.valid = $filter("filter")(
        _.clone(vm.dataOrdersOrigin),
        function (e) {
          return e.testState === 2 && !e.preliminaryTestValidation;
        }
      );

      vm.countwidget.valid =
        vm.countwidget.valid.length === 0
          ? 0
          : parseFloat(
              (_.uniqBy(vm.countwidget.valid, "order").length * 100) /
                vm.dataOrdersOrigin.length
            ).toFixed(2);

      vm.countwidget.inprevalid = $filter("filter")(
        _.clone(vm.dataOrdersOrigin),
        function (e) {
          return e.testState === 2 && e.preliminaryTestValidation;
        }
      );

      vm.countwidget.inprevalid =
        vm.countwidget.inprevalid.length === 0
          ? 0
          : parseFloat(
              (_.uniqBy(vm.countwidget.inprevalid, "order").length * 100) /
                vm.dataOrdersOrigin.length
            ).toFixed(2);

      vm.countwidget.report = $filter("filter")(vm.dataOrdersOrigin, {
        testState: "4",
      });
      vm.countwidget.report =
        vm.countwidget.report.length === 0
          ? 0
          : parseFloat(
              (_.uniqBy(vm.countwidget.report, "order").length * 100) /
                vm.dataOrdersOrigin.length
            ).toFixed(2);

      var verifidedCount = vm.dataOrdersOrigin.filter(function (x) {
        return parseInt(x.testState) < 2;
      }).length;

      var processedCount = vm.dataOrdersOrigin.filter(function (x) {
        return parseInt(x.testState) === 2 && !x.preliminaryTestValidation;
      }).length;
      var validatedCount = vm.dataOrdersOrigin.filter(function (x) {
        return parseInt(x.testState) === 4 && x.print;
      }).length;

      var preliminaryCount = vm.dataOrdersOrigin.filter(function (x) {
        return parseInt(x.testState) === 2 && x.preliminaryTestValidation;
      }).length;

      vm.countwidget.verifidedCount = verifidedCount;
      vm.countwidget.processedCount = processedCount;
      vm.countwidget.validatedCount = validatedCount;
      vm.countwidget.preliminaryCount = preliminaryCount;

      vm.countwidget.verifided = (
        (verifidedCount / vm.dataOrdersOrigin.length) *
        100
      ).toFixed(2);
      vm.countwidget.processed = (
        (processedCount / vm.dataOrdersOrigin.length) *
        100
      ).toFixed(2);
      vm.countwidget.validated = (
        (validatedCount / vm.dataOrdersOrigin.length) *
        100
      ).toFixed(2);
      vm.countwidget.preliminaryTestValidation = (
        (preliminaryCount / vm.dataOrdersOrigin.length) *
        100
      ).toFixed(2);

      vm.countwidget.attachment = vm.dataOrdersOrigin.filter(function (x) {
        return x.attachmentOrder >= 1 || x.attachmentTest >= 1;
      });
      vm.countwidget.attachment = _.uniqBy(
        vm.countwidget.attachment,
        "order"
      ).length;

      vm.countwidget.urgency = $filter("filter")(vm.dataOrdersOrigin, {
        orderType: "S",
      });
      vm.countwidget.urgency = _.uniqBy(vm.countwidget.urgency, "order").length;

      vm.countwidget.panic = vm.dataOrdersOrigin.filter(function (x) {
        return x.pathology >= 4;
      });
      vm.countwidget.panic = _.uniqBy(vm.countwidget.panic, "order").length;

      vm.countwidget.critical = vm.dataOrdersOrigin.filter(function (x) {
        return x.pathology >= 7;
      });
      vm.countwidget.critical = _.uniqBy(
        vm.countwidget.critical,
        "order"
      ).length;

      vm.countwidget.oportunityAlert = $filter("filter")(vm.dataOrdersOrigin, {
        stateOportunity: 2,
      });
      vm.countwidget.oportunityAlert = _.uniqBy(
        vm.countwidget.oportunityAlert,
        "order"
      ).length;

      vm.countwidget.oportunityOut = $filter("filter")(vm.dataOrdersOrigin, {
        stateOportunity: 1,
      });
      vm.countwidget.oportunityOut = _.uniqBy(
        vm.countwidget.oportunityOut,
        "order"
      ).length;

      vm.countwidget.oportunity =
        vm.countwidget.oportunityAlert + vm.countwidget.oportunityOut;

      vm.datageneraloportunity = [
        {
          name: $filter("translate")("1753"),
          type: "bar",
          itemStyle: {
            normal: {
              color: "#FFC577",
            },
          },
          data: [vm.countwidget.oportunityAlert],
        },
        {
          name: $filter("translate")("1754"),
          type: "bar",
          itemStyle: {
            normal: {
              color: "#FF8177",
            },
          },
          data: [vm.countwidget.oportunityOut],
        },
      ];

      vm.datageneralurgency = [
        {
          data: [
            {
              value: vm.countwidget.urgency,
              name: $filter("translate")("0636"),
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              value: vm.dataOrders.length,
              name: "",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
          type: "pie",
          radius: "55%",
        },
      ];

      vm.datageneralpanic = [
        {
          data: [
            {
              value: vm.countwidget.panic,
              name: $filter("translate")("0637"),
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              value: vm.dataOrdersOrigin.length,
              name: "",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
          type: "pie",
          radius: "55%",
        },
      ];

      vm.datageneralcritical = [
        {
          data: [
            {
              value: vm.countwidget.critical,
              name: $filter("translate")("0637"),
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              value: vm.dataOrdersOrigin.length,
              name: "",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
          type: "pie",
          radius: "55%",
        },
      ];

      vm.datageneralattachment = [
        {
          data: [
            {
              value: vm.countwidget.attachment,
              name: $filter("translate")("0637"),
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              value: vm.dataOrdersOrigin.length,
              name: "",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
          ],
          type: "pie",
          radius: "55%",
        },
      ];

      vm.loading = false;
    }
    /**
      Funcion  función realizar la busqueda por paciente y/o tipo de documento del ºlistado de ordenes
      @author  adiaz
    */
    function searchorderbyhistory($event) {
      if ($event === undefined) {
        if (
          vm.documentTypeselected !== vm.previoudocumenttype ||
          vm.previousearchhistory !== vm.searchhistory
        ) {
          vm.getOrdersByFilter();
        }
      } else if ($event !== undefined) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          vm.getOrdersByFilter();
        }
      }

      vm.previousearchhistory = vm.searchhistory;
      vm.previoudocumenttype =
        vm.documentTypeselected === undefined
          ? undefined
          : vm.documentTypeselected;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function autocomplenumberorder($event) {
      var keyCode =
        $event !== undefined ? $event.which || $event.keyCode : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        var orderdigit = localStorageService.get("DigitosOrden");
        var cantdigit = parseInt(orderdigit) + 4;

        if (vm.searchorder.length < cantdigit) {
          if (vm.searchorder.length === cantdigit - 1) {
            vm.searchorder = "0" + vm.searchorder;
            vm.searchorder = moment().year() + vm.searchorder;
          } else if (parseInt(orderdigit) === vm.searchorder.length - 1) {
            vm.searchorder = "0" + vm.searchorder;
            vm.searchorder =
              moment().year() +
              common.getOrderComplete(vm.searchorder, orderdigit).substring(4);
          } else {
            vm.searchorder = vm.searchorder === "" ? 0 : vm.searchorder;
            vm.searchorder =
              moment().year() +
              common.getOrderComplete(vm.searchorder, orderdigit).substring(4);
          }
        } else if (vm.searchorder.length > cantdigit) {
          if (vm.searchorder.length === cantdigit + 1) {
            vm.searchorder =
              moment().format("YYYY").substring(0, 3) + vm.searchorder;
          } else if (vm.searchorder.length === cantdigit + 2) {
            vm.searchorder =
              moment().format("YYYY").substring(0, 2) + vm.searchorder;
          } else if (vm.searchorder.length === cantdigit + 3) {
            vm.searchorder =
              moment().format("YYYY").substring(0, 1) + vm.searchorder;
          } else {
            vm.searchorder = vm.searchorder;
          }
        } else if (vm.searchorder.length === cantdigit) {
          vm.searchorder = moment().year() + vm.searchorder;
        }
        vm.valuechangetypedocument = {
          id: 0,
          abbr: "SF",
          name: $filter("translate")("0919"),
        };
        $scope.$broadcast(
          "angucomplete-alt:changeInput",
          "documentType",
          vm.valuechangetypedocument
        );
        vm.setFilter();
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    /**
      Funcion  función para abrir ventana modal de el fltro de resultados especificos
      @author  adiaz
    */
    function openmodalfilterresult() {
      //vm.temfilterresult = JSON.parse(JSON.stringify(vm.filterResult));
      vm.temfilterresult = _.clone(vm.filterResult);
      if (vm.dataOrdersOrigin.length > 0) {
        UIkit.modal("#modalfilter-general-result").show();
      }
    }
    /**
      Funcion  función que evalua la coherencia entre resultados para el filtro
      @author  adiaz
    */
    function validresultfilter(item) {
      if (item.sign !== undefined) {
        if (item.test.typeresult === 1) {
          item.result1 =
            item.result1 === ""
              ? ""
              : !isNaN(item.result1)
              ? parseInt(item.result1)
              : 0;
          item.result2 =
            item.result2 === ""
              ? ""
              : !isNaN(item.result2)
              ? parseInt(item.result2)
              : 0;
        }
        if (item.result1 >= item.result2) {
          item.result2 = parseInt(item.result1) + 1;
        }
      }
    }
    /**
      Funcion  función que evalua el cambio de signo en filtro de resultados
      @author  adiaz
    */
    function changeresultfiltersign(item) {
      if (item === undefined) {
        item.result1 = "";
        item.result2 = "";
      }
    }
    /**
      Funcion  función que evalua el cambio de examen en filtro de resultados
      @author  adiaz
    */
    function changeresultfiltertest(item) {
      if (item.test.typeresult === 1) {
        item.listsign = vm.listtypesignnumber;
      } else {
        item.listsign = vm.listtypesigntext;
      }
    }
    /**
      Funcion  función que adiciona un registro en los filtros de resultados especificos
      @author  adiaz
    */
    function addfilterresult() {
      if (vm.filterResult.length > 0) {
        vm.filterResult[vm.filterResult.length - 1].disabled = true;
        vm.listtestfilter = $filter("filter")(vm.listtestfilter, {
          id: "!" + vm.filterResult[vm.filterResult.length - 1].test.id,
        });
        vm.listtestfilter = vm.listtestfilter.sort(vm.orderListTest);
      }
      vm.filterResult.push({
        listtest: vm.listtestfilter,
        result1: "",
        result2: "",
        disabled: false,
      });
    }
    /**
      Funcion  función que elimina un registro en los filtros de resultados especificos
      @author  adiaz
    */
    function removefilterresult(index) {
      vm.listtestfilter.push(vm.filterResult[index].test);
      vm.listtestfilter = vm.listtestfilter.sort(vm.orderListTest);
      vm.filterResult.splice(index, 1);
    }
    /**
      Funcion  función para aplicar el filtro de resultados al listado de ordenes
      @author  adiaz
    */
    function applyfilterresult() {
      vm.listorderresultfilter = [];

      if (
        vm.filterResult.length > 0 &&
        vm.filterResult[vm.filterResult.length - 1].test !== undefined
      ) {
        vm.filterResult[vm.filterResult.length - 1].disabled = true;
        vm.listtestfilter = $filter("filter")(vm.listtestfilter, {
          id: "!" + vm.filterResult[vm.filterResult.length - 1].test.id,
        });
        vm.filterinfo.valuefilterresult = vm.filterResult.length;
        vm.listorderresultfilter = [];

        vm.filterResult.forEach(function (item) {
          var previousfilterresult = $filter("filter")(vm.dataOrdersOrigin, {
            testResult: "!!",
          });

          previousfilterresult = previousfilterresult.filter(function (x) {
            switch (item.sign.id) {
              case 50:
                return (
                  x.test === item.test.id &&
                  toString(x.testResult) === toString(item.result1)
                );
              case 51:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) >= parseInt(item.result1)
                );
              case 52:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) <= parseInt(item.result1)
                );
              case 53:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) < parseInt(item.result1)
                );
              case 54:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) > parseInt(item.result1)
                );
              case 55:
                return (
                  x.test === item.test.id &&
                  toString(x.testResult) !== toString(item.result1)
                );
              case 56:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) >= parseInt(item.result1) &&
                  x.testResult <= parseInt(item.result2)
                );
              case 57:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) < parseInt(item.result1) &&
                  parseInt(x.testResult) > parseInt(item.result2)
                );
            }
          });

          vm.listorderresultfilter =
            vm.listorderresultfilter.concat(previousfilterresult);
        });

        vm.filterinternal.resultspecific = true;
        vm.getOrdersByFilter(9);
      } else {
        vm.filterinternal.resultspecific = false;
        vm.getOrdersByFilter(1);
      }
    }
    /**
      Funcion  Selecciona la orden activa e invoca la función para obtener sus examenes
      @author  jblanco
      @param   filter:  identificador del filtro aplicado
      @param   currentOrder: objeto de tipo ResultOrder
    */
    function selectOrder(filter, currentOrder, currentIndex) {
      vm.loadPatient(currentOrder.order);
      //   vm.stopTimer();
      vm.microbiologyGrowth = "";
      vm.timefilter = null;
      //if (currentOrder === undefined) currentOrder = vm.selectedOrder;
      vm.patient = {
        //'branch': currentOrder.branch,
        branch: {
          id: 1,
        },
        service: currentOrder.service,
        id: currentOrder.patientId,
        name:
          currentOrder.patientName1 +
          " " +
          currentOrder.patientName2 +
          " " +
          currentOrder.patientLastName1,
        patientId: currentOrder.patientCode,
        document:
          (vm.typedocumentkey === "True" ? currentOrder.idtype : "HC ") +
          " " +
          currentOrder.patientCode,
        birthday: currentOrder.birthday,
        age: common.getAgeAsString(
          moment(currentOrder.birthday).format(vm.formatDateAge),
          vm.formatDateAge,
          currentOrder.createDate
        ),
        gender:
          $filter("translate")("0000") === "enUsa"
            ? currentOrder.sex.enUsa
            : currentOrder.sex.esCo,
        genderCode: currentOrder.sex.code,
        typeordercolor: vm.getOrderTypeColor(currentOrder.orderType),
        typeordercode: currentOrder.orderType,
        race: currentOrder.race,
      };

      vm.patientDateValues = {};
      vm.patientDateValues[-99] = currentOrder.patientId;
      vm.patientDateValues[-105] = currentOrder.birthday;
      vm.patientDateValues[-104] = {
        code: currentOrder.sex.code,
      };

      vm.selectedOrderIndex = _.findIndex(vm.dataOrders, function (o) {
        return o.order == currentOrder.order;
      }); // currentIndex;
      vm.selectedTest = [];
      vm.selectedOrder = currentOrder;
      vm.detailButton = vm.selectedOrder.order > 0;
      vm.inconsistencyButton = vm.selectedOrder.inconsistency;
      vm.attachmentButton = vm.detailButton;
      vm.addButton = vm.detailButton; // Si está facturada ? Si tiene permiso de agregar?
      vm.samplingButton = vm.detailButton;

      vm.prevalidateButton = false; // Si el sistema tiene validación preliminar? Si tiene paciente asignado?
      vm.validateButton = false; // Si tiene paciente asignado...?

      vm.desvalidateButton = false;
      vm.repetitionlistButton = false;
      vm.previewButton = vm.detailButton; // De la grilla o todo
      vm.printButton = vm.detailButton; //Si tiene permiso de impresión

      vm.repetitionButton = false;
      vm.commentButton = false;
      vm.microbiologyButton = false;
      vm.historyButton = false;

      //vm.searchFilter = '';
      //searchOrder('', filter);
      vm.getTestByOrderId();
      vm.loadphotopatient(vm.patient.id);
      vm.getComment(vm.patient.id, currentOrder.order);

      setTimeout(function () {
        var element = document.getElementById("order_" + currentOrder.order);
        if (element !== null && element !== undefined) {
          element.scrollIntoView();
          element.scrollIntoView(false);
          element.scrollIntoView({
            block: "center",
          });
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 500);
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectNextOrder() {
      if (vm.selectedOrderIndex + 1 < vm.dataOrders.length) {
        vm.selectOrder(
          1,
          vm.dataOrders[vm.selectedOrderIndex + 1],
          vm.selectedOrderIndex + 1
        );
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectPreviewtOrder() {
      if (vm.selectedOrderIndex - 1 < vm.dataOrders.length) {
        vm.selectOrder(
          1,
          vm.dataOrders[vm.selectedOrderIndex - 1],
          vm.selectedOrderIndex - 1
        );
      }
    }
    vm.getobservations = getobservations;
    function getobservations(order) {
      vm.observations = "";
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.getobservations(auth.authToken, order).then(
        function (data) {
          if (data.status === 200) {
            vm.observationsprincipal = data.data.comment;
            vm.observations = data.data.comment;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    vm.closedobservacion = closedobservacion;
    function closedobservacion() {
      UIkit.modal("#confirmationob").hide();
      vm.getobservations(vm.selectobservations);
    }

    vm.confirmationobservations = confirmationobservations;
    function confirmationobservations() {
      if (vm.observationsprincipal !== vm.observations) {
        UIkit.modal("#confirmationob").show();
      }
    }

    vm.udateobservations = udateobservations;
    function udateobservations() {
      UIkit.modal("#confirmationob").hide();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var observations = {
        order: vm.selectobservations,
        comment: vm.observations,
      };
      return resultsentryDS.saveobservations(auth.authToken, observations).then(
        function (data) {
          if (data.status === 200) {
            vm.observations = data.data.comment;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
       Funcion  Obtiene los exámenes de la orden activa segun los filtros aplicados
       @author  jblanco
       @param   filter: identificador del filtro aplicado
       @return  data Objeto de tipo ResultTest
     */
    function getTestByOrderId(sendemail) {
      vm.microbiologyButton = false;
      vm.loading = true;
      var listtest = $filter("filter")(vm.dataOrdersOrigin, {
        order: vm.selectedOrder.order,
      });
      var listtestresult = [];
      vm.selectedTest = [];

      if (vm.filterResult.length > 0) {
        vm.filterResult.forEach(function (item) {
          var previousfilterresult = $filter("filter")(listtest, {
            testResult: "!!",
          });
          previousfilterresult = previousfilterresult.filter(function (x) {
            switch (item.sign.id) {
              case 50:
                return (
                  x.test === item.test.id &&
                  toString(x.testResult) === toString(item.result1)
                );
              case 51:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) >= parseInt(item.result1)
                );
              case 52:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) <= parseInt(item.result1)
                );
              case 53:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) < parseInt(item.result1)
                );
              case 54:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) > parseInt(item.result1)
                );
              case 55:
                return (
                  x.test === item.test.id &&
                  toString(x.testResult) !== toString(item.result1)
                );
              case 56:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) >= parseInt(item.result1) &&
                  x.testResult <= parseInt(item.result2)
                );
              case 57:
                return (
                  x.test === item.test.id &&
                  parseInt(x.testResult) < parseInt(item.result1) &&
                  parseInt(x.testResult) > parseInt(item.result2)
                );
            }
          });

          listtestresult = listtestresult.concat(previousfilterresult);
        });

        listtest = listtestresult;
      }

      if (vm.filterinternal.result) {
        listtest = $filter("filter")(listtest, function (e) {
          return parseInt(e.testState) < 2;
        });
      } else if (
        vm.filterinternal.valid &&
        !vm.filterinternal.preliminaryTestValidation
      ) {
        listtest = $filter("filter")(_.clone(listtest), function (e) {
          return e.testState === 2 && !e.preliminaryTestValidation;
        });
      } else if (
        vm.filterinternal.inprevalid &&
        vm.filterinternal.preliminaryTestValidation
      ) {
        listtest = $filter("filter")(_.clone(listtest), function (e) {
          return e.testState === 2 && e.preliminaryTestValidation;
        });
      } else if (vm.filterinternal.report) {
        listtest = $filter("filter")(_.clone(listtest), function (e) {
          return e.testState === 4 && e.print;
        });
      }

      if (vm.filterinternal.attachment) {
        listtest = listtest.filter(function (x) {
          return x.attachmentOrder >= 1 || x.attachmentTest >= 1;
        });
      }

      if (vm.filterinternal.urgency) {
        listtest = $filter("filter")(
          listtest,
          {
            orderType: "S",
          },
          true
        );
      }

      if (vm.filterinternal.panic) {
        listtest = listtest.filter(function (x) {
          return x.pathology >= 4;
        });
      } else if (!vm.filterinternal.panic && vm.filterinternal.critical) {
        listtest = listtest.filter(function (x) {
          return x.pathology >= 7;
        });
      }
      if (vm.filterinternal.oportunity) {
        listtest = $filter("filter")(listtest, {
          stateOportunity: 1,
        });
      }
      /*  vm.orderTests = []; */
      if (listtest.length > 0 && vm.selectedOrder.order > 0) {
        var tests = [];
        listtest.forEach(function (item) {
          tests.push(item.test);
        });
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        vm.selectobservations = vm.selectedOrder.order;
        vm.getobservations(vm.selectobservations);
        var order = {
          filterId: 1,
          firstOrder: vm.selectedOrder.order,
          lastOrder: vm.selectedOrder.order,
          testList: tests,
          userId: auth.id,
          applyGrowth: true,
        };
        vm.orderTests = [];
        return resultsentryDS.getTestByOrderId(auth.authToken, order).then(
          function (data) {
            if (data.status === 200) {
              var testvalidated = $filter("filter")(
                _.clone(data.data),
                function (e) {
                  return e.sampleState !== 1;
                }
              );
              vm.assingformulaordertest(testvalidated);
              vm.loading = false;
            } else {
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        vm.loading = false;
      }
    }

    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function assingformulaordertest(tests) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var validated = false;
      angular.forEach(tests, function (item) {
        item.formula = item.formula === undefined ? "" : item.formula;
        if (item.formula !== "") {
          validated = true;
          item.newState = vm.testState.REPORTED;
        }
      });
      if (validated) {
        var data = {
          orderId: vm.selectedOrder.order,
          sex: vm.selectedOrder.sex,
          race: vm.selectedOrder.race,
          size: vm.selectedOrder.size,
          weight: vm.selectedOrder.weight,
          tests: tests,
        };
        return resultsentryDS.assignformulavalue(auth.authToken, data).then(
          function (data) {
            vm.datatest(data.data.tests);
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        vm.datatest(tests);
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function datatest(obj) {
      //Determinar el orden de los exámenes para el desplazamiento con las flechas.
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.comparedtes = -1;
      vm.areaslist = [];
      vm.testformula = [];
      vm.listformule = [];
      vm.listestformule = [];
      var itemiLast = {};
      var index = 0;
      vm.orderTestsNotgroup = [];
      vm.orderTests = _.groupBy(obj, "areaName");
      for (var propiedad in vm.orderTests) {
        if (vm.orderTests.hasOwnProperty(propiedad)) {
          if (vm.orderTests[propiedad].length !== 0) {
            var orderprofil = _.groupBy(
              _.clone(vm.orderTests[propiedad]),
              "profileId"
            );
            var area = {
              id: vm.orderTests[propiedad][0].areaId,
              name: vm.orderTests[propiedad][0].areaName,
            };
            vm.areaslist.push(area);
            var completedata = [];
            angular.forEach(orderprofil, function (itemprofil) {
              itemprofil = _.orderBy(itemprofil, "profileId");
              angular.forEach(itemprofil, function (itemi) {
                itemi.lastResultDateView =
                  itemi.lastResultDate !== null &&
                  itemi.lastResultDate !== undefined
                    ? moment(itemi.lastResultDate).format(vm.formatDate)
                    : "";
                if (itemi.resultType === 2) {
                  itemi.literalResult = vm.getLiteralData(itemi.testId);
                  itemi.result =
                    itemi.result === " " || itemi.result === ""
                      ? itemi.result.trim()
                      : itemi.result;
                } else {
                  itemi.formula =
                    itemi.formula === undefined ? "" : itemi.formula;
                  itemi.formulareplace = itemi.formula;
                  itemi.result =
                    itemi.result === " " || itemi.result === ""
                      ? null
                      : itemi.result;
                  if (itemi.formula !== "") {
                    if (itemi.state <= vm.testState.REPORTED) {
                      vm.listestformule.push(itemi);
                    }
                    var formuletest = itemi.formula.split("||");
                    itemi.formuletest = [];
                    angular.forEach(formuletest, function (item) {
                      if (
                        item.indexOf("(") === -1 &&
                        item.indexOf(")") === -1 &&
                        item.indexOf("+") === -1 &&
                        item.indexOf("-") === -1 &&
                        item.indexOf("/") === -1 &&
                        item.indexOf("Sqrt") === -1 &&
                        item.indexOf("Log") === -1 &&
                        item.indexOf("^") === -1 &&
                        item.indexOf("*") === -1
                      ) {
                        if (item !== "") {
                          if (angular.equals("GENDER", item)) {
                            if (vm.selectedOrder.sex.id === 8) {
                              if (
                                vm.femaleValueFormula !== null &&
                                vm.femaleValueFormula !== "" &&
                                vm.femaleValueFormula !== undefined
                              ) {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    parseInt(vm.femaleValueFormula)
                                  );
                              } else {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    0
                                  );
                              }
                            } else if (vm.selectedOrder.sex.id === 7) {
                              if (
                                vm.maleValueFormula !== null &&
                                vm.maleValueFormula !== "" &&
                                vm.maleValueFormula !== undefined
                              ) {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    parseInt(vm.maleValueFormula)
                                  );
                              } else {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    0
                                  );
                              }
                            } else if (vm.selectedOrder.sex.id === 9) {
                              if (
                                vm.undefinedValueFormula !== null &&
                                vm.undefinedValueFormula !== "" &&
                                vm.undefinedValueFormula !== undefined
                              ) {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    parseInt(vm.undefinedValueFormula)
                                  );
                              } else {
                                itemi.formulareplace =
                                  itemi.formulareplace.replaceAll(
                                    "||GENDER||",
                                    0
                                  );
                              }
                            }
                          } else if (angular.equals("RACE", item)) {
                            if (
                              vm.selectedOrder.race !== null &&
                              vm.selectedOrder.race !== "" &&
                              vm.selectedOrder.race !== undefined
                            ) {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll(
                                  "||RACE||",
                                  parseInt(vm.selectedOrder.race.value)
                                );
                            } else {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll("||RACE||", 0);
                            }
                          } else if (angular.equals("WEIGHT", item)) {
                            if (
                              vm.selectedOrder.weight !== null &&
                              vm.selectedOrder.weight !== "" &&
                              vm.selectedOrder.weight !== undefined
                            ) {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll(
                                  "||WEIGHT||",
                                  parseFloat(vm.selectedOrder.weight)
                                );
                            } else {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll(
                                  "||WEIGHT||",
                                  0
                                );
                            }
                          } else if (angular.equals("SIZE", item)) {
                            if (
                              vm.selectedOrder.size !== null &&
                              vm.selectedOrder.size !== "" &&
                              vm.selectedOrder.size !== undefined
                            ) {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll(
                                  "||SIZE||",
                                  vm.selectedOrder.size
                                );
                            } else {
                              itemi.formulareplace =
                                itemi.formulareplace.replaceAll("||SIZE||", 0);
                            }
                          } else {
                            var testlabelreplace = "<%=" + item + "%>";
                            itemi.formulareplace =
                              itemi.formulareplace.replaceAll(
                                "||" + item + "||",
                                testlabelreplace
                              );
                            itemi.formuletest.push(item);
                          }
                        }
                      }
                    });
                    itemi.formuletestString = itemi.formuletest.toString();
                    vm.listformule["'" + itemi.testId + "'"] = itemi;
                  }
                  if (itemi.state >= vm.testState.REPORTED) {
                    vm.testformula["'" + itemi.testId + "'"] = itemi;
                  }
                }
                itemi.viewprofil = false;
                itemi.blockdays = false;
                if (!auth.administrator) {
                  if (itemi.state === vm.testState.VALIDATED) {
                    if (itemi.validationUserId !== vm.permissionuser.id) {
                      itemi.blockdaysMessage = $filter("translate")("3235");
                      itemi.blockdays = true;
                    } else {
                      var datevalid = moment(itemi.validationDate).add(
                        itemi.maxDays,
                        "days"
                      );
                      var diffdate = moment(datevalid).diff(moment(), "days");
                      if (diffdate === 0) {
                        itemi.blockdaysMessage = $filter("translate")("1409");
                        itemi.blockdays = true;
                      }
                    }
                  } else if (itemi.state === vm.testState.PRINTED) {
                    var datevalid = moment(itemi.printDate).add(
                      itemi.maxPrintDays,
                      "days"
                    );
                    var diffdate = moment(datevalid).diff(moment(), "days");
                    if (diffdate === 0) {
                      itemi.blockdaysMessage = $filter("translate")("1410");
                      itemi.blockdays = true;
                    }
                  }
                }
                if (vm.vieweditingResultsProcessing) {
                  if (
                    itemi.processingBy === 2 &&
                    !vm.permissionuser.editingResultsProcessing
                  ) {
                    itemi.blockdaysMessage = $filter("translate")("3267");
                    itemi.blockdays = true;
                  }
                }
                completedata.push(itemi);
                vm.orderTestsNotgroup.push(itemi);
              });

              if (itemprofil[0].profileId !== 0) {
                var perfil = {
                  profileId: itemprofil[0].profileId,
                  profileName: itemprofil[0].profileName,
                  grantAccess: itemprofil[0].grantAccess,
                  grantValidate: itemprofil[0].grantValidate,
                  printSort: -1,
                  printSortProfile: itemprofil[0].printSortProfile,
                  viewprofil: true,
                  selecprofil: false,
                };
                completedata.unshift(perfil);
              }
            });
          }
          vm.orderTests[propiedad] = _.orderBy(
            completedata,
            ["printSortProfile", "profileId", "printSort", "testCode"],
            ["asc", "asc", "asc", "asc"]
          );
          vm.orderTests[propiedad] = _.sortBy(vm.orderTests[propiedad], [
            function (o) {
              if (!o.viewprofil) {
                if (!o.block.blocked) {
                  o.idindex = index;
                  index++;
                  if (itemiLast !== undefined) {
                    itemiLast.next = o.testId;
                    o.last = itemiLast.testId;
                  }
                  itemiLast = o;
                }
              }
              return o.printSort;
            },
          ]);
        }
      }
      var authuser = localStorageService.get("Enterprise_NT.authorizationData");
      var administrator = authuser.administrator;
      var user = authuser.id;
      vm.desvalidateButton =
        vm.orderTestsNotgroup.length !== 0
          ? _.filter(vm.orderTestsNotgroup, function (o) {
              return (
                (o.state === vm.testState.VALIDATED &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  administrator) ||
                (o.state === vm.testState.PRINTED &&
                  !o.block.blockdays &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  administrator) ||
                (o.state === vm.testState.PRINTED &&
                  !o.block.blockdays &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  user === o.validationUserId) ||
                (o.state === vm.testState.VALIDATED &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  user === o.validationUserId) ||
                (o.state === vm.testState.PRINTED &&
                  !o.block.blockdays &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  o.validationUserType === 12) ||
                (o.state === vm.testState.VALIDATED &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  o.validationUserType === 12) ||
                (o.state === vm.testState.PRINTED &&
                  !o.block.blockdays &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  o.validationUserType === 13) ||
                (o.state === vm.testState.VALIDATED &&
                  !o.block.blocked &&
                  o.grantAccess &&
                  !administrator &&
                  o.validationUserType === 13)
              );
            }).length > 0
          : false;

      if (vm.permissionuser.preValidationRequired) {
        vm.prevalidateButton =
          vm.orderTestsNotgroup.length !== 0
            ? _.filter(vm.orderTestsNotgroup, function (o) {
                return (
                  !o.block.blocked &&
                  o.grantAccess &&
                  o.grantValidate &&
                  o.sampleState !== 1 &&
                  o.state === vm.testState.REPORTED &&
                  o.preliminaryValidation
                );
              }).length > 0
            : false;
      } else {
        vm.prevalidateButton = false;
      }
      if (vm.permissionuser.secondValidation) {
        vm.validateButton =
          vm.orderTestsNotgroup.length !== 0
            ? _.filter(vm.orderTestsNotgroup, function (o) {
                return (
                  (!o.block.blocked &&
                    o.grantAccess &&
                    o.grantValidate &&
                    o.sampleState !== 1 &&
                    o.state === vm.testState.REPORTED &&
                    o.preliminaryValidation === false) ||
                  (!o.block.blocked &&
                    o.grantAccess &&
                    o.grantValidate &&
                    o.sampleState !== 1 &&
                    o.state === vm.testState.PREVIEW)
                );
              }).length > 0
            : false;
      } else {
        vm.validateButton = false;
      }
      if (administrator) {
        vm.referenceButton =
          $filter("filter")(vm.orderTestsNotgroup, function (e) {
            return (
              e.state <= 2 && !e.block.blocked && e.grantAccess && !e.blockdays
            );
          }).length > 0;
      }
      vm.loading = false;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    vm.interviewPanic = interviewPanic;
    function interviewPanic(obj) {
      if (obj.state > 3 && obj.pathology > 3) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return resultsentryDS
          .getInterviewPanic(auth.authToken, obj.order, obj.testId)
          .then(
            function (data) {
              if (data.data.length !== 0) {
                var listinterviewPanic = [];
                var date = _.groupBy(data.data, "date");
                for (var propiedad in date) {
                  var object = {
                    date: date[propiedad][0].date,
                    interviewPanic: date[propiedad],
                  };
                  listinterviewPanic.push(object);
                }
                vm.listinterviewPanic = listinterviewPanic;
                vm.loading = false;
                UIkit.modal("#modalInterviewPanic").show();
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
      }

      //UIkit.modal('#modalInterviewPanic').show();

      /*   var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return resultsentryDS.changuestateprint(auth.authToken, obj.order,obj.testId).then(function (data) {
          if (data.status === 200) {
            vm.loading = false;
            UIkit.modal('#confirmationprint').hide();
          }
        }, function (error) {
          vm.loading = false;
          vm.modalError(error);
        }); */
    }

    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function changuestateprint(obj) {
      if (obj.print !== 3) {
        vm.objprint = obj;
        UIkit.modal("#confirmationprint").show();
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function saveconfirmation() {
      vm.loading = true;
      var print;
      if (vm.objprint.print === 1) {
        var print = false;
        vm.objprint.print = 2;
      } else if (vm.objprint.print === 2) {
        var print = true;
        vm.objprint.print = 1;
      }
      var data = {
        order: vm.objprint.order,
        testId: vm.objprint.testId,
        print: print,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.changuestateprint(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            vm.loading = false;
            UIkit.modal("#confirmationprint").hide();
          }
        },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Función que carga los comentarios de la orden y el diagnóstico permanente
      @author  lbueno
    */
    function getComment(patient, order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (order !== null && order !== undefined) {
        commentsDS
          .getCommentsOrder(auth.authToken, order)
          .then(function (dataOrder) {
            if (dataOrder.status === 200) {
              vm.commentOrder = dataOrder.data;
            } else {
              vm.commentOrder = [];
            }
          });
      }
    }
    /**
      Funcion  Metodo para cargar la foto del paciente.
      @author  adiaz
    */
    function loadphotopatient(idpatient) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      patientDS.getPhotoPatient(auth.authToken, idpatient).then(
        function (response) {
          if (response.status === 200) {
            vm.photopatient = response.data.photoInBase64;
          }
        },
        function (error) {
          if (error.data === null) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
        }
      );
    }
    /**
      Funcion  Selecciona el examen activo
      @author  jblanco
    */
    function selectTest(currentTest, check, control) {
      vm.loading = true;
      if (control === "checkbox") {
        var listtestselected = [];
        var listtestselected = $filter("filter")(
          vm.orderTestsNotgroup,
          function (e) {
            return e.isSelectedUnique === true;
          }
        );
        if (listtestselected.length > 0) {
          angular.forEach(listtestselected, function (item) {
            item.isSelectedUnique = false;
            vm.microbiologyGrowth = "N/A";
          });
        }
        vm.selectedTest = $filter("filter")(
          vm.orderTestsNotgroup,
          function (e) {
            if (e.isSelected) {
              e.isSelectedUnique = true;
              if (e.entryTestType === 1) {
                vm.microbiologyGrowth =
                  moment(e.microbiologyGrowth.dateGrowth).format(
                    vm.formatDateHours
                  ) +
                  " - " +
                  e.microbiologyGrowth.userGrowth.userName;
              } else {
                vm.microbiologyGrowth = "N/A";
              }
            }
            return e.isSelected === true;
          }
        );
      } else {
        if (currentTest.block.blocked === false && currentTest.grantAccess) {
          var listtestselected = [];
          var listtestselected = $filter("filter")(
            vm.orderTestsNotgroup,
            function (e) {
              return e.isSelected === true || e.isSelectedUnique === true;
            }
          );
          if (listtestselected.length > 0) {
            angular.forEach(listtestselected, function (item) {
              item.isSelectedUnique = false;
              vm.microbiologyGrowth = "N/A";
            });
          }
          vm.selectedTest = [];
          currentTest.isSelectedUnique = !currentTest.isSelectedUnique;
          if (currentTest.isSelectedUnique === true) {
            if (currentTest.entryTestType === 1) {
              vm.microbiologyGrowth =
                moment(currentTest.microbiologyGrowth.dateGrowth).format(
                  vm.formatDateHours
                ) +
                " - " +
                currentTest.microbiologyGrowth.userGrowth.userName;
            } else {
              vm.microbiologyGrowth = "N/A";
            }
            vm.selectedTest.push(currentTest);
          }
        }
      }

      if (currentTest.literalResult !== undefined) {
        vm.listfilterliteralResult = _.clone(currentTest.literalResult);
      }
      updateButtonBarByTest();
    }
    /**
      Funcion  Actualiza el estado de la barra de botones.
      @author  jblanco
    */
    function updateButtonBarByTest() {
      vm.repetitionlistButton = false;
      vm.commentButton = false;
      vm.repetitionButton = false;
      vm.microbiologytaskButton = false;
      vm.microbiologyButton = false;
      vm.referenceButton = false;
      var cantdata = vm.selectedTest.length;
      if (cantdata == 1) {
        vm.repetitionlistButton = !vm.selectedTest[0].block.blocked;
        vm.commentButton =
          !vm.selectedTest[0].block.blocked &&
          vm.selectedTest[0].state <= vm.testState.PREVIEW;
        vm.repetitionButton = vm.selectedTest[0].state === vm.testState.REPORTED || vm.selectedTest[0].state === vm.testState.PREVIEW;;
        vm.microbiologyButton =
          vm.selectedTest[0].laboratoryType.indexOf("3") !== -1 &&
          !vm.selectedTest[0].block.blocked &&
          vm.selectedTest[0].state <= vm.testState.PREVIEW;
        vm.microbiologytaskButton =
          !vm.selectedTest[0].block.blocked &&
          vm.selectedTest[0].entryTestType !== 2;
      }
      if (vm.user.administrator) {
        vm.referenceButton =
          $filter("filter")(vm.orderTestsNotgroup, function (e) {
            return (
              e.state <= 2 && !e.block.blocked && e.grantAccess && !e.blockdays
            );
          }).length > 0;
      }
      if (vm.permissionuser.preValidationRequired) {
        vm.prevalidateButton =
          vm.orderTestsNotgroup.length !== 0
            ? _.filter(vm.orderTestsNotgroup, function (o) {
                return (
                  !o.block.blocked &&
                  o.grantAccess &&
                  o.grantValidate &&
                  o.sampleState !== 1 &&
                  o.state === vm.testState.REPORTED &&
                  o.preliminaryValidation
                );
              }).length > 0
            : false;
      } else {
        vm.prevalidateButton = false;
      }

      if (vm.permissionuser.secondValidation) {
        vm.validateButton =
          vm.orderTestsNotgroup.length !== 0
            ? _.filter(vm.orderTestsNotgroup, function (o) {
                return (
                  (!o.block.blocked &&
                    o.grantAccess &&
                    o.grantValidate &&
                    o.sampleState !== 1 &&
                    o.state === vm.testState.REPORTED &&
                    o.preliminaryValidation === false) ||
                  (!o.block.blocked &&
                    o.grantAccess &&
                    o.grantValidate &&
                    o.sampleState !== 1 &&
                    o.state === vm.testState.PREVIEW)
                );
              }).length > 0
            : false;
      } else {
        vm.validateButton = false;
      }
      vm.historyButton = vm.selectedTest.length > 0;
      vm.loading = false;
    }
    /**
      Funcion  Valida los resultados de las pruebas
      @author  jblanco
      @return  data Objeto de tipo ResultTest
      @version 0.0.1
    */
    function validateTestsWarnings(next) {
      vm.validateAndNext = next;
      vm.validateTestsBase(true);
    }
    /**
      Funcion  Valida los resultados de las pruebas
      @author  jblanco
      @return  data Objeto de tipo ResultTest
      @version 0.0.1
    */
    function validateTests() {
      vm.validateTestsBase(false);
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function updatereference(order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.updatereference(auth.authToken, order).then(
        function (data) {
          if (data.status === 200) {
            vm.getTestByOrderId();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function printselect() {
      var listTestUniqueprint = [];
      vm.dataprint = [];
      angular.forEach(vm.orderTests, function (item) {
        angular.forEach(item, function (dataitem) {
          if (dataitem.isSelected) {
            listTestUniqueprint.push(dataitem);
          }
        });
      });
      vm.dataprint = listTestUniqueprint;
      vm.orderend = vm.selectedOrder.order;
      vm.openreportfinalprint = true;
    }
    /**
      Funcion  desvalida los resultados de las pruebas
      @author  jblanco
      @return  data Objeto de tipo ResultTest
      @version 0.0.1
    */
    function desvalidateTests() {
      vm.loading = true;
      var datavalidate = [];
      var listTestUnique = [];
      vm.orderTestsNotgroup = [];
      angular.forEach(vm.orderTests, function (item) {
        angular.forEach(item, function (dataitem) {
          if (dataitem.isSelected) {
            listTestUnique.push(dataitem);
          }
          if (!dataitem.viewprofil) {
            vm.orderTestsNotgroup.push(dataitem);
          }
        });
      });
      /*  datavalidate = listTestUnique.length > 0 ? listTestUnique : vm.selectedTest.length == 0 ? vm.orderTestsNotgroup : JSON.parse(JSON.stringify(vm.selectedTest));
       */
      datavalidate =
        listTestUnique.length > 0
          ? listTestUnique
          : vm.selectedTest.length == 0
          ? vm.orderTestsNotgroup
          : _.clone(vm.selectedTest);
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var administrator = auth.administrator;
      var user = auth.id;
      var validated = _.filter(datavalidate, function (o) {
        return (
          (o.state === vm.testState.VALIDATED &&
            !o.block.blocked &&
            o.grantAccess &&
            administrator) ||
          (o.state === vm.testState.PRINTED &&
            !o.block.blockdays &&
            !o.block.blocked &&
            o.grantAccess &&
            administrator) ||
          (o.state === vm.testState.PRINTED &&
            !o.block.blockdays &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            user === o.validationUserId) ||
          (o.state === vm.testState.VALIDATED &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            user === o.validationUserId) ||
          (o.state === vm.testState.PRINTED &&
            !o.block.blockdays &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            o.validationUserType === 12) ||
          (o.state === vm.testState.VALIDATED &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            o.validationUserType === 12) ||
          (o.state === vm.testState.PRINTED &&
            !o.block.blockdays &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            o.validationUserType === 13) ||
          (o.state === vm.testState.VALIDATED &&
            !o.block.blocked &&
            o.grantAccess &&
            !administrator &&
            o.validationUserType === 13)
        );
      });
      if (validated.length !== 0) {
        vm.tempresult = true;
        vm.validatedbutton = true;
        vm.size = validated.length;
        vm.count = 0;
        vm.datadevalidated = validated;
        vm.testdevalidated();
      } else {
        vm.loading = false;
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function testdevalidated() {
      vm.tempresult = true;
      vm.validatedbutton = true;
      vm.tempresult = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.datadevalidated[vm.count].newState = vm.testState.REPORTED;
      vm.datadevalidated[vm.count].resultChanged = true;
      vm.datadevalidated[vm.count].entryType = 0;
      vm.datadevalidated[vm.count].orderPathology =
        vm.dataOrders[vm.selectedOrderIndex].pathology;
      vm.datadevalidated[vm.count].resultComment.pathology = vm.datadevalidated[
        vm.count
      ].resultComment.pathology2
        ? 1
        : 0;
      if (
        vm.datadevalidated[vm.count].result !== null &&
        vm.datadevalidated[vm.count].result !== undefined
      ) {
        if (
          vm.datadevalidated[vm.count].resultType === 1 &&
          vm.datadevalidated[vm.count].result.indexOf(",") !== -1
        ) {
          vm.datadevalidated[vm.count].result = vm.datadevalidated[
            vm.count
          ].result.replace(",", ".");
        }
      }
      if (
        vm.datadevalidated[vm.count].resultChanged &&
        vm.datadevalidated[vm.count].resultType == 2
      ) {
        vm.tempresult = vm.datadevalidated[vm.count].result !== "MEMO";
        var codeComment = $filter("filter")(vm.codeCommentList, function (e) {
          return e.code === vm.datadevalidated[vm.count].result;
        });
        if (
          codeComment != undefined &&
          codeComment != null &&
          codeComment.length > 0
        ) {
          if (codeComment[0].message.length > 16) {
            if (vm.datadevalidated[vm.count].resultComment.hasComment) {
              vm.datadevalidated[vm.count].resultComment.comment =
                vm.datadevalidated[vm.count].resultComment.comment +
                " " +
                codeComment[0].message;
            } else {
              vm.datadevalidated[vm.count].resultComment.comment =
                codeComment[0].message;
            }
            vm.datadevalidated[vm.count].result = "MEMO";
            validated[vm.count].resultComment.commentChanged = true;
          } else {
            vm.datadevalidated[vm.count].result = codeComment[0].message;
          }
        }
      }
      if (vm.datadevalidated[vm.count].resultComment.comment == "") {
        vm.datadevalidated[vm.count].resultComment.comment = null;
      }
      vm.datadevalidated[vm.count].idUser = auth.id;
      if (vm.tempresult || vm.validatedbutton) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        vm.datadevalidated[vm.count].resultRepetition =
          vm.datadevalidated[vm.count].resultRepetition !== undefined &&
          vm.datadevalidated[vm.count].resultRepetition !== null
            ? Object.keys(vm.datadevalidated[vm.count].resultRepetition)
                .length === 0
              ? undefined
              : vm.datadevalidated[vm.count].resultRepetition
            : undefined;
        return resultsentryDS
          .updateTest(auth.authToken, vm.datadevalidated[vm.count])
          .then(
            function (data) {
              if (data.status === 200) {
                vm.datadevalidated[vm.count].resultRepetition = {};
                vm.datadevalidated[vm.count].result = data.data.result;
                vm.datadevalidated[vm.count].previousResult =
                  data.data.previousResult;
                vm.datadevalidated[vm.count].state = data.data.state;
                vm.datadevalidated[vm.count].pathology = data.data.pathology;
                vm.datadevalidated[vm.count].repeatedResultValue =
                  data.data.repeatedResultValue;
                vm.datadevalidated[vm.count].orderPathology =
                  data.data.orderPathology;
                vm.dataOrders[vm.selectedOrderIndex].pathology =
                  vm.datadevalidated[vm.count].orderPathology;
                vm.datadevalidated[vm.count].resultChanged =
                  data.data.resultChanged;
                vm.datadevalidated[vm.count].resultComment.commentChanged =
                  data.data.resultComment.commentChanged;
                vm.datadevalidated[vm.count].resultComment.hasComment =
                  data.data.hasComment;
                vm.datadevalidated[vm.count].resultDate = data.data.resultDate;
                vm.datadevalidated[vm.count].hasComment = data.data.hasComment;
                vm.datadevalidated[vm.count].resultedit = null;
                vm.testedit = null;
                if (vm.size - 1 === vm.count) {
                  vm.desvalidateButton = false;
                  vm.selectedTest = [];
                  vm.setFilter(vm.selectedOrder.order);
                  vm.loading = false;
                } else {
                  vm.count++;
                  vm.testdevalidated();
                }
              }
            },
            function (error) {}
          );
      }
    }
    vm.addtest = addtest;
    function addtest() {
      vm.openmodaladdremovetest = true;
    }
    /**
      Funcion  Valida los resultados de las pruebas
      @author  jblanco
      @return  data Objeto de tipo ResultTest
      @version 0.0.1
    */
    function validateTestsBase(isAlarms) {
      vm.loading = true;
      var newState = vm.testState.VALIDATED;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var obj = {};
      var tests = [];
      angular.forEach(vm.orderTests, function (item) {
        angular.forEach(item, function (dataitem) {
          if (document.getElementsByClassName("searchselect").length === 0) {
            if (!dataitem.viewprofil) {
              if (
                (!dataitem.block.blocked &&
                  dataitem.grantAccess &&
                  dataitem.grantValidate &&
                  dataitem.sampleState !== 1 &&
                  dataitem.result !== null &&
                  dataitem.result !== undefined &&
                  dataitem.result !== "" &&
                  dataitem.state === vm.testState.REPORTED &&
                  dataitem.preliminaryValidation === false) ||
                dataitem.state === vm.testState.PREVIEW
              ) {
                dataitem.newState = newState;
                tests.push(dataitem);
              }
            }
          } else {
            if (dataitem.isSelected) {
              if (
                (!dataitem.block.blocked &&
                  dataitem.grantAccess &&
                  dataitem.grantValidate &&
                  dataitem.sampleState !== 1 &&
                  dataitem.result !== null &&
                  dataitem.result !== undefined &&
                  dataitem.result !== "" &&
                  dataitem.state === vm.testState.REPORTED &&
                  dataitem.preliminaryValidation === false) ||
                dataitem.state === vm.testState.PREVIEW
              ) {
                dataitem.newState = newState;
                tests.push(dataitem);
              }
            }
          }
        });
      });
      if (tests.length > 0) {
        obj.finalValidate = true;
        obj.orderId = vm.selectedOrder.order;
        obj.sex = vm.selectedOrder.sex;
        obj.race = vm.selectedOrder.race;
        obj.size = vm.selectedOrder.size;
        obj.weight = vm.selectedOrder.weight;
        obj.tests = tests;
        obj.questions = [];
        obj.alarms = [];
        obj.serial = $rootScope.serialprint;
        obj.reportedDoctor = vm.reportedDoctor;
        var panicSurveyTests = _.filter(obj.tests, function (o) {
          return _.find(vm.panicSurveyTests, function (e) {
            return e.id === o.testId;
          });
        });
        if (isAlarms && panicSurveyTests.length > 0) {
          obj.tests = panicSurveyTests;
          return resultsentryDS.validateTestsAlarms(auth.authToken, obj).then(
            function (data) {
              if (data.status === 200) {
                var panicTest = $filter("filter")(
                  data.data.tests,
                  function (o) {
                    return o.newState == 4 && o.pathology > 3;
                  }
                );
                if (
                  data.data.alarms.length > 0 ||
                  (vm.panicSurvey.length > 0 && panicTest.length > 0)
                ) {
                  vm.alarms = data.data.alarms;
                  vm.panicTest = panicTest;
                  vm.panicQuestions = angular.copy(vm.panicSurvey);
                  vm.openalarmvalidate = true;
                  vm.loading = false;
                } else {
                  vm.validateTestsBase(false);
                }
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
        } else {
          var criticalTests = _.filter(obj.tests, function (o) {
            return o.pathology >= 4;
          });
          obj.questions = criticalTests.length > 0 ? vm.panicQuestions : [];
          obj.tests.forEach(function (value) {
            value.applyInterview =
              _.find(panicSurveyTests, function (o) {
                return o.testId === value.testId;
              }) && value.pathology >= 4
                ? 1
                : 0;
          });
          return resultsentryDS.validateTests(auth.authToken, obj).then(
            function (data) {
              vm.loading = false;
              if (data.status === 200) {
                if (vm.validateAndNext) {
                  vm.selectNextOrder();
                } else {
                  vm.setFilter(vm.selectedOrder.order);
                }
                vm.selectedTest = [];
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
        }
      } else {
        logger.warning($filter("translate")("1411"));
        vm.loading = false;
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function validateTestsPreview() {
      var newState = vm.testState.PREVIEW;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var obj = {};
      var tests = [];
      vm.loading = true;
      vm.orderTestsNotgroup = [];
      var listTestUnique = [];
      angular.forEach(vm.orderTests, function (item) {
        angular.forEach(item, function (dataitem) {
          if (dataitem.isSelected) {
            listTestUnique.push(dataitem);
          }
          if (!dataitem.viewprofil) {
            vm.orderTestsNotgroup.push(dataitem);
          }
        });
      });

      tests =
        listTestUnique.length > 0 ? listTestUnique : vm.orderTestsNotgroup;

      var tests = _.filter(tests, function (itemi) {
        itemi.newState = newState;
        return (
          !itemi.block.blocked &&
          itemi.grantAccess &&
          itemi.grantValidate &&
          itemi.state === vm.testState.REPORTED &&
          itemi.preliminaryValidation === true
        );
      });

      obj.finalValidate = false;
      obj.orderId = vm.selectedOrder.order;
      obj.sex = vm.selectedOrder.sex;
      obj.race = vm.selectedOrder.race;
      obj.size = vm.selectedOrder.size;
      obj.weight = vm.selectedOrder.weight;
      obj.tests = tests;
      obj.questions = [];
      obj.alarms = [];

      if (tests.length > 0) {
        var criticalTests = _.filter(obj.tests, function (o) {
          return o.pathology >= 7;
        });
        obj.questions = criticalTests.length > 0 ? vm.panicQuestions : [];
        return resultsentryDS.validateTests(auth.authToken, obj).then(
          function (data) {
            if (data.status === 200) {
              vm.setFilter(vm.selectedOrder.order);
              updateButtonBarByTest();
              vm.loading = false;
            }
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          }
        );
      } else {
        logger.warning($filter("translate")("1752"));
        vm.loading = false;
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectCheckAll() {
      vm.selectedAll = !vm.selectedAll;
      angular.forEach(vm.orderTests, function (item) {
        item.Selected = vm.selectedAll;
      });
    }
    /**
      Funcion  Consulta de las estadìsticas de los resultados
      @author  adiaz
    */
    function getResultStatistic(filter) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.getResultStatistic(auth.authToken, filter).then(
        function (data) {
          if (data.status === 200) {
            vm.dataStatistic = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Actualiza el comentario del resultado del examen seleccionado
      @author  adiaz
      @version 0.0.1
    */
    function savecommenttest() {
      vm.validatedbutton = true;
      vm.selectedTest[0].resultChanged = false;
      vm.selectedTest[0].resultComment.commentChanged = true;
      if (vm.selectedTest[0].result === undefined) {
        vm.selectedTest[0].result = "MEMO";
        vm.selectedTest[0].resultChanged = true;
      }

      vm.selectedTest[0].entryType = 0;
      vm.selectedTest[0].resultComment.pathology = vm.selectedTest[0]
        .resultComment.pathology2
        ? 1
        : 0;
      vm.selectedTest[0].resultRepetition = null;
      vm.updateTest(vm.selectedTest[0], vm.testState.REPORTED);
    }
    /**
      Funcion  Realiza la repeticion del resultado de los examenes seleccionados
      @author  adiaz
      @version 0.0.1
    */
    function saverepeattest() {
      vm.loading = true;
      if (vm.automaticresulteliminated && vm.selectedTest[0].resultType === 1) {
        if (Object.keys(vm.testformula).length === 0) {
          vm.repeattest();
        } else {
          var resultdelete = [];
          vm.reasonComment = null;
          vm.tempresult = true;
          vm.validatedbutton = true;
          vm.selectedTest[0].resultRepetition = {};
          vm.selectedTest[0].repeatedResultValue = vm.selectedTest[0].result;
          vm.selectedTest[0].resultRepetition.order = vm.selectedTest[0].order;
          vm.selectedTest[0].resultRepetition.testId =
            vm.selectedTest[0].testId;
          vm.selectedTest[0].resultRepetition.type = "R";
          vm.selectedTest[0].resultRepetition.reasonId = vm.motiveRepeat.id;
          vm.selectedTest[0].resultRepetition.reasonComment = vm.reasonComment;
          vm.selectedTest[0].resultRepetition.repetitionDate = null;
          resultdelete.push(vm.selectedTest[0]);
          for (var propiedad in vm.testformula) {
            if (
              vm.testformula[propiedad].formula !== "" &&
              vm.testformula[propiedad].state <= vm.testState.REPORTED
            ) {
              if (
                vm.testformula[propiedad].formuletestString.indexOf(
                  vm.selectedTest[0].testId
                ) !== -1
              ) {
                vm.testformula[propiedad].result = "";
                resultdelete.push(vm.testformula[propiedad]);
              }
            }
          }
          if (resultdelete.length === 1) {
            vm.repeattest();
          } else {
            vm.sizedelete = resultdelete.length;
            vm.countdelete = 0;
            vm.testdelete(resultdelete, vm.testState.RERUN);
          }
        }
      } else {
        vm.repeattest();
      }
    }
    /**
      Funcion  Realiza la repeticion del resultado de los examenes seleccionados
      @author  adiaz
      @version 0.0.1
    */
    function repeattest() {
      vm.reasonComment = null;
      vm.tempresult = true;
      vm.validatedbutton = true;
      if (vm.selectedTest[0].state >= vm.testState.REPORTED) {
        vm.selectedTest[0].resultRepetition = {};
        vm.selectedTest[0].repeatedResultValue = vm.selectedTest[0].result;
        vm.selectedTest[0].resultRepetition.order = vm.selectedTest[0].order;
        vm.selectedTest[0].resultRepetition.testId = vm.selectedTest[0].testId;
        vm.selectedTest[0].resultRepetition.type = "R";
        vm.selectedTest[0].resultRepetition.reasonId = vm.motiveRepeat.id;
        vm.selectedTest[0].resultRepetition.reasonComment = vm.reasonComment;
        vm.selectedTest[0].resultRepetition.repetitionDate = null;
        $scope.$broadcast(
          "angucomplete-alt:clearInput",
          "input_result-" + vm.selectedTest[0].testId
        );
        vm.updateTest(vm.selectedTest[0], vm.testState.RERUN);
        vm.selectedTest[0].isSelected = false;
      }
    }
    /**
      Funcion  Realiza el guardado de la edicion de una resultado
      @author  adiaz
      @version 0.0.1
    */
    vm.attamentdelet = attamentdelet;
    function attamentdelet() {
      if (
        vm.selectedTest[0].result === "VER RESULTADO ANEXO" &&
        vm.selectedTest[0].state === vm.testState.REPORTED
      ) {
        vm.testedit = vm.selectedTest[0];
        vm.testedit.result = "";
        vm.deletedResult();
      }
    }
    /**
      Funcion  Realiza el guardado de la edicion de una resultado
      @author  adiaz
      @version 0.0.1
    */
    function deletedResult() {
      vm.loading = true;
      if (vm.automaticresulteliminated && vm.testedit.resultType === 1) {
        if (Object.keys(vm.testformula).length === 0) {
          vm.moveNextTest(40, vm.testedit);
          vm.updateTestformula(vm.testedit, vm.testState.ORDERED);
        } else {
          var resultdelete = [];
          resultdelete.push(vm.testedit);
          for (var propiedad in vm.testformula) {
            if (
              vm.testformula[propiedad].formula !== "" &&
              vm.testformula[propiedad].state <= vm.testState.REPORTED
            ) {
              if (
                vm.testformula[propiedad].formuletestString.indexOf(
                  vm.testedit.testId
                ) !== -1
              ) {
                vm.testformula[propiedad].result = "";
                resultdelete.push(vm.testformula[propiedad]);
              }
            }
          }
          if (resultdelete.length === 1) {
            vm.moveNextTest(40, vm.testedit);
            vm.updateTestformula(vm.testedit, vm.testState.ORDERED);
          } else {
            vm.sizedelete = resultdelete.length;
            vm.countdelete = 0;
            vm.testdelete(resultdelete, vm.testState.ORDERED);
          }
        }
      } else {
        vm.moveNextTest(40, vm.testedit);
        vm.updateTest(vm.testedit, vm.testState.ORDERED);
      }
    }
    /**
    Funcion  Actualiza el estado de un examen
    @author  jblanco
    @param   Test: examen a ser actualizado
    @return  data Objeto de tipo ResultTest
    @version 0.0.1
    */
    function testdelete(Test, newState) {
      vm.tempresult = true;
      vm.referenceButton = false;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (newState === vm.testState.REPORTED) {
        Test[vm.countdelete].newState = newState;
        Test[vm.countdelete].resultDate = new Date(moment().format()).getTime();
      } else {
        Test[vm.countdelete].newState =
          newState === vm.testState.RERUN && vm.countdelete === 0
            ? vm.testState.RERUN
            : vm.testState.ORDERED;
      }
      Test[vm.countdelete].resultChanged = true;
      Test[vm.countdelete].entryType = 0;
      Test[vm.countdelete].orderPathology =
        vm.dataOrders[vm.selectedOrderIndex].pathology;
      Test[vm.countdelete].resultComment.pathology = Test[vm.countdelete]
        .resultComment.pathology2
        ? 1
        : 0;
      if (
        Test[vm.countdelete].resultType === 1 &&
        Test[vm.countdelete].result.indexOf(",") !== -1
      ) {
        Test[vm.countdelete].result = Test[vm.countdelete].result.replace(
          ",",
          "."
        );
      }
      Test[vm.countdelete].idUser = auth.id;
      Test[vm.countdelete].resultRepetition =
        Test[vm.countdelete].resultRepetition !== undefined &&
        Test[vm.countdelete].resultRepetition !== null
          ? Object.keys(Test[vm.countdelete].resultRepetition).length === 0
            ? undefined
            : Test[vm.countdelete].resultRepetition
          : undefined;
      return resultsentryDS
        .updateTest(auth.authToken, Test[vm.countdelete])
        .then(
          function (data) {
            if (data.status === 200) {
              Test[vm.countdelete].state = data.data.state;
              Test[vm.countdelete].resultRepetition = {};
              Test[vm.countdelete].result = data.data.result;
              Test[vm.countdelete].pathology = data.data.pathology;
              Test[vm.countdelete].repeatedResultValue =
                data.data.repeatedResultValue;
              Test[vm.countdelete].orderPathology = data.data.orderPathology;
              vm.dataOrders[vm.selectedOrderIndex].pathology =
                Test[vm.countdelete].orderPathology;
              Test[vm.countdelete].resultChanged = data.data.resultChanged;
              Test[vm.countdelete].resultComment.commentChanged =
                data.data.resultComment.commentChanged;
              Test[vm.countdelete].resultComment.hasComment =
                data.data.hasComment;
              Test[vm.countdelete].resultDate = data.data.resultDate;
              Test[vm.countdelete].hasComment = data.data.hasComment;
              Test[vm.countdelete].resultedit = null;
              Test[vm.countdelete].print = data.data.print;
              vm.testedit = null;
              if (Test[vm.countdelete].formula !== "") {
                vm.listestformule = $filter("filter")(
                  vm.listestformule,
                  function (e) {
                    return e.testId !== Test[vm.countdelete].testId;
                  }
                );
                vm.listestformule.push(Test[vm.countdelete]);
              }
              if (
                Test[vm.countdelete].state === vm.testState.RERUN ||
                Test[vm.countdelete].state === vm.testState.ORDERED
              ) {
                delete vm.testformula["'" + Test[vm.countdelete].testId + "'"];
              } else {
                vm.testformula["'" + Test[vm.countdelete].testId + "'"] =
                  Test[vm.countdelete];
              }
              if (vm.sizedelete - 1 === vm.countdelete) {
                if (vm.testState.REPORTED === newState) {
                  vm.moveNextTest(vm.keycodeautomatic, Test[0]);
                } else {
                  angular.element("#input_result-" + Test[0].testId).focus();
                  angular.element("#input_result-" + Test[0].testId).select();
                }
                vm.loading = false;
              } else {
                vm.countdelete++;
                if (vm.testState.REPORTED === newState) {
                  vm.testdelete(Test, vm.testState.REPORTED);
                } else {
                  vm.testdelete(Test, vm.testState.ORDERED);
                }
              }
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    /**
      Funcion  Realiza el guardado de la edicion de una resultado
      @author  adiaz
      @version 0.0.1
    */
    function canceleditresult() {
      vm.testedit.result = vm.testedit.resultedit;
      if (vm.testedit.literalResult === undefined) {
        vm.testedit.literalResult = [];
      }
      if (vm.testedit.literalResult.length !== 0) {
        $scope.$broadcast(
          "angucomplete-alt:changeInput",
          "input_result-" + vm.testedit.testId,
          vm.testedit.result
        );
      }
      vm.moveNextTest(40, vm.testedit);
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function updateinformationtest(test) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS
        .getinformationtestorder(
          auth.authToken,
          vm.selectedTest[0].order,
          vm.selectedTest[0].testId
        )
        .then(
          function (data) {
            if (data.status === 200) {
              vm.selectedTest[0].result = data.data.result;
              vm.selectedTest[0].state = data.data.state;
            }
            vm.getTestByOrderId();
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    /*
      Funcion  Ejecuta nuevamente las funciones para cargar las órdenes y los exámenes de una orden previamente seleccionada.
      @author  lbueno
      @version 0.0.1
    */
    function refreshsetFilter() {
      var filterAddRemove = {};

      //Rango de órdenes
      filterAddRemove.filterRange = vm.filterRange;
      filterAddRemove.firstOrder =
        vm.filterRange === "0" ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera orden
      filterAddRemove.lastOrder =
        vm.filterRange === "0" ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  orden
      //Rango de fecha de verificación
      filterAddRemove.firstDate =
        vm.filterRange !== "0" ? 0 - 1 : parseInt(vm.rangeInit) - 1; //No incluye la primera fecha
      filterAddRemove.lastDate =
        vm.filterRange !== "0" ? 0 + 1 : parseInt(vm.rangeEnd) + 1; //No incluye la última  fecha

      //Lista de areas
      filterAddRemove.areaList = [];

      //Lista de examenes
      filterAddRemove.testList = [];
      filterAddRemove.numFilterAreaTest = 0;

      filterAddRemove.filterByDemo = [];

      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      return resultsentryDS
        .getOrdersByFilter(auth.authToken, filterAddRemove)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.dataOrdersOrigin = _.clone(data.data);
              if (
                vm.previousfilter !== undefined &&
                vm.previousfilter !== JSON.stringify(filterAddRemove)
              ) {
                vm.filterinternal = {};
                vm.filterinternal.resultspecific = false;
                vm.filterResult = [];
                vm.dataOrders = _.uniqBy(data.data, "order");
                vm.removedatatestfilter();
              } else if (
                vm.filterinternal.result ||
                vm.filterinternal.valid ||
                vm.filterinternal.inprevalid ||
                vm.filterinternal.report ||
                vm.filterinternal.attachment ||
                vm.filterinternal.urgency ||
                vm.filterinternal.panic ||
                vm.filterinternal.critical ||
                vm.filterResult.length > 0
              ) {
                vm.applyfilterresult();
              } else {
                vm.dataOrders = _.uniqBy(data.data, "order");
                vm.removedatatestfilter();
              }
              vm.previousfilter = JSON.stringify(filterAddRemove);
              if (vm.styleSwitcherActive) {
                vm.getcountwidget(data.data);
              } else {
                vm.loading = false;
              }
              vm.selectOrder(1, vm.selectedOrder, 0);
            } else {
              vm.loading = false;
            }
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
            vm.stateFilters = 3;
          }
        );
    }
    /**
      Funcion  Función que carga la lista de comentarios codificados
      @author  lbueno
    */
    function getCodeComment(patient, order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.codeCommentList = [];
      return commentDS.getComment(auth.authToken).then(
        function (data) {
          vm.codeCommentList = $filter("filter")(data.data, function (o) {
            return (o.apply == 1 || o.apply == 3) && o.state;
          });
        },
        function (error) {
          vm.modalError();
        }
      );
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function calcFormula(datatest) {
      vm.loading = true;
      if (datatest.state === vm.testState.REPORTED) {
        datatest.resultedit = datatest.result;
      } else if (
        datatest.resultType === 1 &&
        datatest.formula !== "" &&
        datatest.state < vm.testState.REPORTED
      ) {
        var validated = true;
        var output = datatest.formulareplace;
        angular.forEach(datatest.formuletest, function (item) {
          if (vm.testformula["'" + item + "'"] === undefined) {
            validated = false;
          } else {
            var dataString = isNaN(vm.testformula["'" + item + "'"].result);
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
          if (output !== "") {
            output = $filter("lowercase")(output);
            datatest.result = math.evaluate(output);
            datatest.result = parseFloat(datatest.result).toFixed(
              datatest.digits
            );
          }
        }
      }
      datatest.result =
        datatest.result === null || datatest.result === undefined
          ? ""
          : datatest.result;
      if (datatest.result.trim() === "") {
        document.getElementById("input_result-" + datatest.testId).value = "";
      }
      vm.loading = false;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function resultblurEventonumber(currentTest) {
      var resultdelete = false;
      if (currentTest.result === " " || currentTest.result === "  ") {
        currentTest.result = currentTest.result.trim();
      }
      if (
        (currentTest.result === "" &&
          currentTest.resultedit !== "" &&
          currentTest.state == vm.testState.REPORTED) ||
        (currentTest.result === "" &&
          currentTest.resultedit !== null &&
          currentTest.state == vm.testState.REPORTED)
      ) {
        vm.testedit = currentTest;
        resultdelete = true;
        vm.keycodeautomatic = 40;
        UIkit.modal("#modaldeleteresult", {
          bgclose: false,
          escclose: false,
          modal: false,
        }).show();
      } else if (
        currentTest.result === "" ||
        (currentTest.result === null &&
          currentTest.state == vm.testState.REPORTED)
      ) {
        logger.warning($filter("translate")("1755"));
        currentTest.result = currentTest.resultedit;
      }
      if (!resultdelete) {
        var validar = currentTest.result === null ? "" : currentTest.result;
        if (
          currentTest.result !== undefined &&
          validar.length > 0 &&
          currentTest.state <= vm.testState.REPORTED
        ) {
          if (currentTest.result !== "" || currentTest.result !== null) {
            if (currentTest.result[currentTest.result.length - 1] === ".") {
              currentTest.result = currentTest.result.replace(".", "");
            }
          }
          if (
            isNaN(parseFloat(currentTest.result)) &&
            currentTest.result !== vm.separator + vm.separator
          ) {
            currentTest.result = currentTest.resultedit;
            logger.error($filter("translate")("1756"));
          } else if (currentTest.reportedMax === currentTest.reportedMin) {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              if (vm.comparedtes !== currentTest.testId) {
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(40, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(40, currentTest);
                }
              }
            }
          } else if (
            currentTest.reportedMin < parseFloat(currentTest.result) &&
            parseFloat(currentTest.result) < currentTest.reportedMax
          ) {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              if (vm.comparedtes !== currentTest.testId) {
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(40, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(40, currentTest);
                }
              }
            }
          } else {
            currentTest.result = currentTest.resultedit;
            logger.warning($filter("translate")("1444"));
          }
        } else {
          vm.loading = false;
        }
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    vm.resultblurText = resultblurText;
    function resultblurText(currentTest) {
      var resultdelete = false;
      if (currentTest.result === " " || currentTest.result === "  ") {
        currentTest.result = currentTest.result.trim();
      }
      if (
        (currentTest.result === "" &&
          currentTest.resultedit !== "" &&
          currentTest.state == vm.testState.REPORTED) ||
        (currentTest.result === "" &&
          currentTest.resultedit !== null &&
          currentTest.state == vm.testState.REPORTED)
      ) {
        vm.testedit = currentTest;
        resultdelete = true;
        vm.keycodeautomatic = 40;
        UIkit.modal("#modaldeleteresult", {
          bgclose: false,
          escclose: false,
          modal: false,
        }).show();
      } else if (
        currentTest.result === "" ||
        (currentTest.result === null &&
          currentTest.state == vm.testState.REPORTED)
      ) {
        logger.warning($filter("translate")("1755"));
        currentTest.result = currentTest.resultedit;
      }
      if (!resultdelete) {
        var validar = currentTest.result === null ? "" : currentTest.result;
        if (
          currentTest.result !== undefined &&
          validar.length > 0 &&
          currentTest.state <= vm.testState.REPORTED
        ) {
          if (currentTest.result !== "" || currentTest.result !== null) {
            if (currentTest.result[currentTest.result.length - 1] === ".") {
              currentTest.result = currentTest.result.replace(".", "");
            }
          }
          if (
            isNaN(parseFloat(currentTest.result)) &&
            currentTest.result !== vm.separator + vm.separator
          ) {
            currentTest.result = currentTest.resultedit;
          } else if (currentTest.reportedMax === currentTest.reportedMin) {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              if (vm.comparedtes !== currentTest.testId) {
                vm.updateTest(currentTest, vm.testState.REPORTED);
                vm.moveNextTest(40, currentTest);
              }
            }
          } else if (
            currentTest.reportedMin < parseFloat(currentTest.result) &&
            parseFloat(currentTest.result) < currentTest.reportedMax
          ) {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              if (vm.comparedtes !== currentTest.testId) {
                vm.updateTest(currentTest, vm.testState.REPORTED);
                vm.moveNextTest(40, currentTest);
              }
            }
          } else {
            currentTest.result = currentTest.resultedit;
            logger.warning($filter("translate")("1444"));
          }
        }
      }
    }
    vm.sendemail = sendemail;
    function sendemail() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var body =
        "<p><strong>" +
        $filter("translate")("2070") +
        "</strong></p>" +
        "<p>" +
        $filter("translate")("2071") +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        "Número de la orden:" +
        "</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.testedit.order +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        "Documento de identificación" +
        "</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.patient.document +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        $filter("translate")("0398") +
        ":</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.patient.name +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        $filter("translate")("0964") +
        ":</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.testedit.testCode +
        "-" +
        vm.testedit.testName +
        "</p>" +
        "<p style='text-align: left;'>" +
        vm.testedit.result +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        $filter("translate")("0405") +
        ":</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.testedit.resultedit +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        "Modificado por" +
        "</strong></p>" +
        "<p style='text-align: left;'>" +
        auth.name +
        " " +
        auth.lastName +
        "</p>" +
        "<p style='text-align: left;'><strong>" +
        "Justificación modificación" +
        "</strong></p>" +
        "<p style='text-align: left;'>" +
        vm.reasonCommentEditResult +
        "</p>";
      var email = {
        recipients:
          localStorageService.get("correoModificacionResultados") === ""
            ? ""
            : JSON.parse(
                localStorageService.get("correoModificacionResultados")
              ),
        subject: $filter("translate")("0965"),
        body: body,
        attachment: [],
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return userDS.getsendemail(auth.authToken, email).then(
        function (data) {
          if (data.status === 200) {
          }
        },
        function (error) {}
      );
    }
    /**
      Funcion  Realiza el guardado de la edicion de una resultado
      @author  adiaz
      @version 0.0.1
    */
    function editResult() {
      vm.testedit.resultRepetition = {};
      vm.testedit.resultRepetition.result = vm.testedit.resultedit;
      vm.testedit.resultRepetition.order = vm.testedit.order;
      vm.testedit.resultRepetition.testId = vm.testedit.testId;
      vm.testedit.resultRepetition.type = "M";
      vm.testedit.resultRepetition.reasonId =
        vm.reasonResultEdit === true ? vm.motiveEditResult.id : null;
      vm.testedit.resultRepetition.reasonComment =
        vm.reasonResultEdit === true ? vm.reasonCommentEditResult : null;
      vm.testedit.resultRepetition.repetitionDate = null;
      if (
        (vm.testedit.result === "" &&
          vm.testedit.resultedit !== "" &&
          vm.testedit.state == vm.testState.REPORTED) ||
        (vm.testedit.result === "" &&
          vm.testedit.resultedit !== null &&
          vm.testedit.state == vm.testState.REPORTED)
      ) {
        vm.deletedResult();
      } else {
        if (vm.automaticresultfomule) {
          vm.automaticalcul(40, vm.testedit);
          if (vm.integrationMINSA) {
            if (
              localStorageService.get("correoModificacionResultados") !== ""
            ) {
              vm.sendemail();
            }
          }
        } else {
          vm.moveNextTest(40, vm.testedit);
          vm.updateTest(vm.testedit, vm.testState.REPORTED);
          if (vm.integrationMINSA) {
            if (
              localStorageService.get("correoModificacionResultados") !== ""
            ) {
              vm.sendemail();
            }
          }
        }
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function getkeysnumber(event, currentTest) {
      if (currentTest.state > vm.testState.REPORTED) {
        if (
          event.keyCode !== 8 ||
          event.keyCode !== 9 ||
          event.keyCode !== 40 ||
          event.keyCode !== 38 ||
          event.keyCode !== 13
        ) {
          event.preventDefault();
        }
      }
      if (event.keyCode == 9) {
        var resultdelete = false;
        vm.prueba = true;
        currentTest.resultRepetition = null;
        if (currentTest.literalResult === undefined) {
          currentTest.literalResult = [];
        }
        if (currentTest.literalResult.length !== 0) {
          if (!vm.mouselist) {
            currentTest.result = document.getElementById(
              "input_result-" + currentTest.testId + "_value"
            ).value;
          }
        }
        var keyCode = event !== undefined ? event.keyCode : undefined;
        if (
          (currentTest.result === "" &&
            currentTest.resultedit !== "" &&
            currentTest.state == vm.testState.REPORTED) ||
          (currentTest.result === "" &&
            currentTest.resultedit !== null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          vm.keycodeautomatic = keyCode;
          vm.testedit = currentTest;
          resultdelete = true;
          UIkit.modal("#modaldeleteresult", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).show();
        } else if (
          currentTest.result === "" ||
          (currentTest.result === null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          logger.warning("El resultado no puede estar vacio");
          currentTest.result = currentTest.resultedit;
          $scope.$broadcast(
            "angucomplete-alt:changeInput",
            "input_result-" + currentTest.testId,
            currentTest.resultedit
          );
        }
        if (!resultdelete) {
          var validar = currentTest.result === null ? "" : currentTest.result;
          if (
            currentTest.result !== undefined &&
            validar.length > 0 &&
            currentTest.state <= vm.testState.REPORTED
          ) {
            if (
              isNaN(parseFloat(currentTest.result)) &&
              currentTest.result !== vm.separator + vm.separator
            ) {
              currentTest.result = currentTest.resultedit;
              logger.error("Este resultado debe ser númerico");
            } else if (currentTest.reportedMax === currentTest.reportedMin) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(keyCode, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else if (
              currentTest.reportedMin < parseFloat(currentTest.result) &&
              parseFloat(currentTest.result) < currentTest.reportedMax
            ) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(keyCode, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else {
              currentTest.result = currentTest.resultedit;
              logger.warning($filter("translate")("1444"));
            }
          } else {
            var addview =
              (currentTest.result === "" &&
                currentTest.resultedit !== "" &&
                currentTest.state == vm.testState.REPORTED) ||
              (currentTest.result === "" &&
                currentTest.resultedit !== null &&
                currentTest.state == vm.testState.REPORTED);
            if (!addview) {
              vm.moveNextTest(keyCode, currentTest);
            }
          }
        }
        event.preventDefault();
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function resultKeyEventonumber(currentTest, event) {
      if (currentTest.state > vm.testState.REPORTED) {
        if (
          event.keyCode !== 8 ||
          event.keyCode !== 9 ||
          event.keyCode !== 40 ||
          event.keyCode !== 38 ||
          event.keyCode !== 13
        ) {
          event.preventDefault();
        }
      }
      currentTest.resultRepetition = null;
      if (currentTest.literalResult === undefined) {
        currentTest.literalResult = [];
      }
      if (currentTest.literalResult.length !== 0) {
        currentTest.result = document.getElementById(
          "input_result-" + currentTest.testId + "_value"
        ).value;
      }
      var keyCode = event !== undefined ? event.keyCode : undefined;
      if (keyCode == 40 || keyCode == 38 || keyCode == 13 || keyCode == 9) {
        var resultdelete = false;
        if (currentTest.result === " " || currentTest.result === "  ") {
          currentTest.result = currentTest.result.trim();
        }
        if (
          (currentTest.result === "" &&
            currentTest.resultedit !== "" &&
            currentTest.state == vm.testState.REPORTED) ||
          (currentTest.result === "" &&
            currentTest.resultedit !== null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          vm.testedit = currentTest;
          vm.keycodeautomatic = keyCode;
          resultdelete = true;
          UIkit.modal("#modaldeleteresult", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).show();
        } else if (
          currentTest.result === "" ||
          (currentTest.result === null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          logger.warning($filter("translate")("1755"));
          currentTest.result = currentTest.resultedit;
        }
        if (!resultdelete) {
          var validar = currentTest.result === null ? "" : currentTest.result;
          if (
            currentTest.result !== undefined &&
            validar.length > 0 &&
            currentTest.state <= vm.testState.REPORTED
          ) {
            if (currentTest.result !== "" || currentTest.result !== null) {
              if (currentTest.result[currentTest.result.length - 1] === ".") {
                currentTest.result = currentTest.result.replace(".", "");
              }
            }
            if (
              isNaN(parseFloat(currentTest.result)) &&
              currentTest.result !== vm.separator + vm.separator
            ) {
              currentTest.result = currentTest.resultedit;
              logger.error($filter("translate")("1756"));
            } else if (currentTest.reportedMax === currentTest.reportedMin) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                vm.comparedtes = currentTest.testId;
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(keyCode, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else if (
              currentTest.reportedMin < parseFloat(currentTest.result) &&
              parseFloat(currentTest.result) < currentTest.reportedMax
            ) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                vm.comparedtes = currentTest.testId;
                if (vm.automaticresultfomule) {
                  vm.automaticalcul(keyCode, currentTest);
                } else {
                  vm.updateTestformula(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else {
              currentTest.result = currentTest.resultedit;
              logger.warning($filter("translate")("1444"));
            }
          } else {
            var addview =
              (currentTest.result === "" &&
                currentTest.resultedit !== "" &&
                currentTest.state == vm.testState.REPORTED) ||
              (currentTest.result === "" &&
                currentTest.resultedit !== null &&
                currentTest.state == vm.testState.REPORTED);
            if (!addview) {
              vm.moveNextTest(keyCode, currentTest);
            }
          }
        }
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function automaticalcul(keyCode, currentTest) {
      vm.loading = true;
      vm.keycodeautomatic = keyCode;
      vm.testformula["'" + currentTest.testId + "'"] = currentTest;
      if (Object.keys(vm.testformula).length === 0) {
        vm.updateTestformula(currentTest, vm.testState.REPORTED);
        vm.moveNextTest(keyCode, currentTest);
      } else {
        var resultcalcul = [];
        vm.listestformule.forEach(function (value) {
          if (
            value.formuletestString.indexOf(currentTest.testId.toString()) !==
            -1
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
                      if (vm.testformula["'" + itemi + "'"] === undefined) {
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
                var dataString = isNaN(vm.testformula["'" + item + "'"].result);
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
              value.result = parseFloat(value.result).toFixed(value.digits);
              resultcalcul.push(value);
            }
          }
        });
        if (resultcalcul.length === 0) {
          vm.updateTestformula(currentTest, vm.testState.REPORTED);
          vm.moveNextTest(keyCode, currentTest);
        } else {
          resultcalcul.unshift(currentTest);
          vm.sizedelete = resultcalcul.length;
          vm.countdelete = 0;
          vm.testdelete(resultcalcul, vm.testState.REPORTED);
        }
      }
    }
    /**
      Funcion  Actualiza el estado de un examen
      @author  jblanco
      @param   Test: examen a ser actualizado
      @return  data Objeto de tipo ResultTest
      @version 0.0.1
      */
    function updateTestformula(Test, newState) {
      vm.loading = true;
      vm.tempresult = true;
      vm.referenceButton = false;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      Test.newState = newState;
      Test.resultChanged = true;
      Test.entryType = 0;
      Test.orderPathology = vm.dataOrders[vm.selectedOrderIndex].pathology;
      Test.resultComment.pathology = Test.resultComment.pathology2 ? 1 : 0;
      if (Test.resultType === 1 && Test.result.indexOf(",") !== -1) {
        Test.result = Test.result.replace(",", ".");
      }
      Test.idUser = auth.id;
      Test.resultRepetition =
        Test.resultRepetition !== undefined && Test.resultRepetition !== null
          ? Object.keys(Test.resultRepetition).length === 0
            ? undefined
            : Test.resultRepetition
          : undefined;
      return resultsentryDS.updateTest(auth.authToken, Test).then(
        function (data) {
          if (data.status === 200) {
            Test.state = data.data.state;
            Test.resultRepetition = {};
            Test.result = data.data.result;
            Test.pathology = data.data.pathology;
            Test.repeatedResultValue = data.data.repeatedResultValue;
            Test.orderPathology = data.data.orderPathology;
            vm.dataOrders[vm.selectedOrderIndex].pathology =
              Test.orderPathology;
            Test.resultChanged = data.data.resultChanged;
            Test.resultComment.commentChanged =
              data.data.resultComment.commentChanged;
            Test.resultComment.hasComment = data.data.hasComment;
            Test.resultDate = data.data.resultDate;
            Test.hasComment = data.data.hasComment;
            Test.resultedit = null;
            Test.print = data.data.print;
            Test.previousResult = data.data.previousResult;
            vm.testformula["'" + Test.testId + "'"] = Test;
            if (Test.state <= vm.testState.REPORTED && Test.formula !== "") {
              vm.listestformule = $filter("filter")(
                vm.listestformule,
                function (e) {
                  return e.testId !== Test.testId;
                }
              );
              vm.listestformule.push(Test);
            }
            vm.testedit = null;
            updateButtonBarByTest();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Selecciona la prueba actual y permite visualizar la gráfica de tendencia
      @author  jblanco
    */
    function tendencyGraph(currentTest) {
      vm.currentTest = currentTest;
      vm.opentendency = true;
    }
    /**
      Funcion  Selecciona la prueba actual y permite visualizar la información
      @author  jblanco
    */
    function testInformation(currentTest) {
      vm.currentTest = currentTest;
      vm.openinformation = true;
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function setRecalltest() {
      vm.refreshsetFilter();
    }
    /**
      Funcion  Selecciona la prueba actual y permite visualizar la ventana de bloqueo
      @author  jblanco
    */
    function blockTest(currentTest, blocked) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.currentTest = currentTest;
      vm.opentestblock = blocked;
      vm.enabledunblockedtest = false;
      if (!blocked) {
        vm.enabledunblockedtest =
          auth.id == vm.currentTest.block.user.id || auth.administrator;
        vm.currentTest.block.dateFormatted = moment(
          vm.currentTest.block.date
        ).format(vm.formatDate);
      }
    }
    /**
      Funcion  Registrel bloqueo o desbloqueo de una prueba
      @author  jblanco
      @version 0.0.1
    */
    function setBlockedTest(blocked) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      var blockedData = {};

      blockedData.order = vm.currentTest.order;
      blockedData.testId = vm.currentTest.testId;
      blockedData.blocked = blocked;

      if (blocked) {
        if (vm.motiveBlockComment == "") vm.motiveBlockComment = null;

        blockedData.reasonId = vm.motiveBlock.id;
        blockedData.reasonComment = vm.motiveBlockComment;

        blockedData.user = {};
        blockedData.user.id = auth.id;
        blockedData.user.userName = auth.userName;
        blockedData.user.lastName = auth.lastName;
        blockedData.user.name = auth.name;
      }

      return resultsentryDS.blockTest(auth.authToken, blockedData).then(
        function (data) {
          if (data.status === 200) {
            vm.currentTest.block = data.data;

            var itemiLast = {};

            angular.forEach(vm.orderTests, function (item) {
              angular.forEach(item, function (itemi) {
                if (!itemi.block.blocked) {
                  if (itemiLast !== undefined) {
                    itemiLast.next = itemi.testId;
                    itemi.last = itemiLast.testId;
                  }
                  itemiLast = itemi;
                }
              });
            });
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion  Bloquea la prueba seleccionada
      @author  jblanco
      @version 0.0.1
    */
    function saveblocktest() {
      setBlockedTest(true);
    }
    /**
      Funcion  Desbloquea la prueba seleccionada
      @author  jblanco
      @version 0.0.1
    */
    function saveunblocktest() {
      setBlockedTest(false);
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    vm.filterListresultliteral = function (search, listdemographics) {
      var listtestfilter = [];
      if (vm.savelistcurrentTest.state > vm.testState.REPORTED) {
      } else if (search.length === 1 && search.substring(0, 1) === "") {
        listtestfilter = $filter("orderBy")(listdemographics, "name");
      } else {
        listtestfilter = _.filter(listdemographics, function (color) {
          return (
            color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1 ||
            color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1
          );
        });
      }
      vm.listfilterliteralResult = _.clone(listtestfilter);
      return listtestfilter;
    };
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectresult(select) {
      if (select !== undefined) {
        vm.mouselist = true;
        vm.savelistcurrentTest.result = select.title;
        vm.resultKeyEventlist(vm.savelistcurrentTest);
      }
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function selectTestlist(currentTest, check) {
      vm.mouselist = false;
      vm.savelistcurrentTest = currentTest;
      if (currentTest.literalResult === undefined) {
        currentTest.literalResult = [];
      }

      vm.listfilterliteralResult = _.clone(currentTest.literalResult);
      if (vm.Literalrequired && currentTest.literalResult.length !== 0) {
        var resultliteral = document.getElementById(
          "input_result-" + currentTest.testId + "_value"
        ).value;
        if (resultliteral !== "" || resultliteral !== " ") {
          var literalresult2 = _.filter(
            currentTest.literalResult,
            function (o) {
              return o.name == resultliteral;
            }
          );
          if (literalresult2.length === 0) {
            currentTest.result = "";
            $scope.$broadcast(
              "angucomplete-alt:clearInput",
              "input_result-" + currentTest.testId
            );
          }
        }
        currentTest.resultedit = currentTest.result;
      } else {
        currentTest.resultedit = document.getElementById(
          "input_result-" + currentTest.testId + "_value"
        ).value;
      }
      vm.selectTest(currentTest, check, "input");
    }
    /**
      Funcion  Método para sacar el popup de error
      @author  adiaz
    */
    function getkeys(event, currentTest) {
      if (currentTest.state > vm.testState.REPORTED) {
        if (
          event.keyCode !== 8 ||
          event.keyCode !== 9 ||
          event.keyCode !== 40 ||
          event.keyCode !== 38 ||
          event.keyCode !== 13
        ) {
          event.preventDefault();
        }
      }
      if (currentTest.literalResult === undefined) {
        currentTest.literalResult = [];
      }
      if (event.keyCode == 9) {
        vm.prueba = true;
        currentTest.resultRepetition = null;
        if (currentTest.literalResult.length !== 0) {
          if (!vm.mouselist) {
            currentTest.result = document.getElementById(
              "input_result-" + currentTest.testId + "_value"
            ).value;
            if (
              vm.Literalrequired &&
              currentTest.literalResult.length !== 0 &&
              !vm.mouselist
            ) {
              var resultliteral = document.getElementById(
                "input_result-" + currentTest.testId + "_value"
              ).value;
              if (resultliteral !== "" || resultliteral !== " ") {
                var literalresult2 = _.filter(
                  currentTest.literalResult,
                  function (o) {
                    return o.name == resultliteral;
                  }
                );
                if (literalresult2.length === 0) {
                  currentTest.result = "";
                  $scope.$broadcast(
                    "angucomplete-alt:clearInput",
                    "input_result-" + currentTest.testId
                  );
                }
              }
            }
          }
        }
        var keyCode = event !== undefined ? event.keyCode : 100000;
        if (
          (currentTest.result === "" &&
            currentTest.resultedit !== "" &&
            currentTest.state == vm.testState.REPORTED) ||
          (currentTest.result === "" &&
            currentTest.resultedit !== null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          vm.testedit = currentTest;
          UIkit.modal("#modaldeleteresult", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).show();
        } else if (
          currentTest.result === "" ||
          (currentTest.result === null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          logger.warning("El resultado no puede estar vacio");
          currentTest.result = currentTest.resultedit;
          $scope.$broadcast(
            "angucomplete-alt:changeInput",
            "input_result-" + currentTest.testId,
            currentTest.resultedit
          );
        }

        var validar = currentTest.result === null ? "" : currentTest.result;
        if (
          currentTest.result !== undefined &&
          validar.length > 0 &&
          currentTest.state <= vm.testState.REPORTED
        ) {
          if (currentTest.resultType === 1) {
            if (
              isNaN(parseFloat(currentTest.result)) &&
              currentTest.result !== vm.separator + vm.separator
            ) {
              currentTest.result = currentTest.resultedit;
              logger.error("Este resultado debe ser númerico");
            } else if (currentTest.reportedMax === currentTest.reportedMin) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                vm.updateTest(currentTest, vm.testState.REPORTED);
                if (keyCode !== 100000) {
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else if (
              currentTest.reportedMin < parseFloat(currentTest.result) &&
              parseFloat(currentTest.result) < currentTest.reportedMax
            ) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                vm.updateTest(currentTest, vm.testState.REPORTED);
                if (keyCode !== 100000) {
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else {
              currentTest.result = currentTest.resultedit;
              logger.warning($filter("translate")("1444"));
            }
          } else {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              vm.updateTest(currentTest, vm.testState.REPORTED);
              if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else if (keyCode !== 100000) {
              vm.moveNextTest(keyCode, currentTest);
            }
          }
        } else {
          var addview =
            (currentTest.result === "" &&
              currentTest.resultedit !== "" &&
              currentTest.state == vm.testState.REPORTED) ||
            (currentTest.result === "" &&
              currentTest.resultedit !== null &&
              currentTest.state == vm.testState.REPORTED);

          if (keyCode !== 100000 && !addview) {
            vm.moveNextTest(keyCode, currentTest);
          }
        }
        event.preventDefault();
      } else {
        if (
          vm.Literalrequired &&
          currentTest.literalResult.length !== 0 &&
          !vm.mouselist
        ) {
          var resultliteral = document.getElementById(
            "input_result-" + currentTest.testId + "_value"
          ).value;
          if (resultliteral !== "" || resultliteral !== " ") {
            var literalresult2 = _.filter(
              currentTest.literalResult,
              function (o) {
                return o.name == resultliteral;
              }
            );
            if (literalresult2.length === 0) {
              currentTest.result = "";
              $scope.$broadcast(
                "angucomplete-alt:clearInput",
                "input_result-" + currentTest.testId
              );
            }
          }
        }
      }
    }

    /**
     Funcion  Desbloquea la prueba seleccionada
     @author  jblanco
     @version 0.0.1
   */
    function resultKeyEventlist(currentTest, event) {
      if (currentTest.literalResult === undefined) {
        currentTest.literalResult = [];
      }
      if (!vm.prueba) {
        if (currentTest.state > vm.testState.REPORTED) {
          if (
            event.keyCode !== 8 ||
            event.keyCode !== 9 ||
            event.keyCode !== 40 ||
            event.keyCode !== 38 ||
            event.keyCode !== 13
          ) {
            event.preventDefault();
          }
        }
        currentTest.resultRepetition = null;
        var keyCode = event !== undefined ? event.keyCode : 100000;
        if (
          (keyCode == 40 &&
            vm.listfilterliteralResult.length <= 0 &&
            currentTest.result !== "") ||
          (keyCode == 38 &&
            vm.listfilterliteralResult.length <= 1 &&
            currentTest.result !== "") ||
          keyCode == 13 ||
          keyCode == 100000
        ) {
          if (currentTest.literalResult.length !== 0) {
            if (!vm.mouselist) {
              currentTest.result = document.getElementById(
                "input_result-" + currentTest.testId + "_value"
              ).value;
              if (
                vm.Literalrequired &&
                currentTest.literalResult.length !== 0 &&
                !vm.mouselist
              ) {
                var resultliteral = document.getElementById(
                  "input_result-" + currentTest.testId + "_value"
                ).value;
                if (resultliteral !== "" || resultliteral !== " ") {
                  var literalresult2 = _.filter(
                    currentTest.literalResult,
                    function (o) {
                      return o.name == resultliteral;
                    }
                  );
                  if (literalresult2.length === 0) {
                    currentTest.result = "";
                    $scope.$broadcast(
                      "angucomplete-alt:clearInput",
                      "input_result-" + currentTest.testId
                    );
                  }
                }
              }
            }
          }
          if (currentTest.result === " " || currentTest.result === "  ") {
            currentTest.result = currentTest.result.trim();
          }

          if (
            (currentTest.result === "" &&
              currentTest.resultedit !== "" &&
              currentTest.state == vm.testState.REPORTED) ||
            (currentTest.result === "" &&
              currentTest.resultedit !== null &&
              currentTest.state == vm.testState.REPORTED)
          ) {
            vm.testedit = currentTest;
            vm.keycodeautomatic = keyCode;
            UIkit.modal("#modaldeleteresult", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          } else if (
            currentTest.result === "" ||
            (currentTest.result === null &&
              currentTest.state == vm.testState.REPORTED)
          ) {
            logger.warning($filter("translate")("1755"));
            $scope.$broadcast(
              "angucomplete-alt:changeInput",
              "input_result-" + currentTest.testId,
              currentTest.resultedit
            );
            currentTest.result = currentTest.resultedit;
          }

          var validar = currentTest.result === null ? "" : currentTest.result;

          if (
            currentTest.result !== undefined &&
            validar.length > 0 &&
            currentTest.state <= vm.testState.REPORTED
          ) {
            if (currentTest.resultType === 1) {
              if (
                isNaN(parseFloat(currentTest.result)) &&
                currentTest.result !== vm.separator + vm.separator
              ) {
                currentTest.result = currentTest.resultedit;
                logger.error($filter("translate")("1756"));
              } else if (currentTest.reportedMax === currentTest.reportedMin) {
                if (
                  currentTest.resultedit !== null &&
                  currentTest.resultedit !== currentTest.result &&
                  currentTest.state === vm.testState.REPORTED
                ) {
                  vm.testedit = currentTest;
                  UIkit.modal("#modaleditresult", {
                    bgclose: false,
                    escclose: false,
                    modal: false,
                  }).show();
                } else if (currentTest.state < vm.testState.REPORTED) {
                  if (vm.comparedtes !== currentTest.testId) {
                    vm.comparedtes = currentTest.testId;
                    vm.updateTest(currentTest, vm.testState.REPORTED);
                  }
                  vm.moveNextTest(keyCode, currentTest);
                } else if (keyCode !== 100000) {
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else if (
                currentTest.reportedMin < parseFloat(currentTest.result) &&
                parseFloat(currentTest.result) < currentTest.reportedMax
              ) {
                if (
                  currentTest.resultedit !== null &&
                  currentTest.resultedit !== currentTest.result &&
                  currentTest.state === vm.testState.REPORTED
                ) {
                  vm.testedit = currentTest;
                  UIkit.modal("#modaleditresult", {
                    bgclose: false,
                    escclose: false,
                    modal: false,
                  }).show();
                } else if (currentTest.state < vm.testState.REPORTED) {
                  if (vm.comparedtes !== currentTest.testId) {
                    vm.comparedtes = currentTest.testId;
                    vm.updateTest(currentTest, vm.testState.REPORTED);
                  }
                  vm.moveNextTest(keyCode, currentTest);
                } else if (keyCode !== 100000) {
                  vm.moveNextTest(keyCode, currentTest);
                }
              } else {
                currentTest.result = currentTest.resultedit;
                logger.warning($filter("translate")("1444"));
              }
            } else {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                if (vm.comparedtes !== currentTest.testId) {
                  vm.comparedtes = currentTest.testId;
                  vm.updateTest(currentTest, vm.testState.REPORTED);
                }
                vm.moveNextTest(keyCode, currentTest);
              } else if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            }
          } else {
            var addview =
              (currentTest.result === "" &&
                currentTest.resultedit !== "" &&
                currentTest.state == vm.testState.REPORTED) ||
              (currentTest.result === "" &&
                currentTest.resultedit !== null &&
                currentTest.state == vm.testState.REPORTED);
            if (keyCode !== 100000 && !addview) {
              vm.moveNextTest(keyCode, currentTest);
            }
          }
        }
      } else {
        vm.prueba = false;
        if (
          vm.Literalrequired &&
          currentTest.literalResult.length !== 0 &&
          !vm.mouselist
        ) {
          var resultliteral = document.getElementById(
            "input_result-" + currentTest.testId + "_value"
          ).value;
          if (resultliteral !== "" || resultliteral !== " ") {
            var literalresult2 = _.filter(
              currentTest.literalResult,
              function (o) {
                return o.name == resultliteral;
              }
            );
            if (literalresult2.length === 0) {
              currentTest.result = "";
              $scope.$broadcast(
                "angucomplete-alt:clearInput",
                "input_result-" + currentTest.testId
              );
            }
          }
        }
      }
    }
    /**
      Funcion  Desbloquea la prueba seleccionada
      @author  jblanco
      @version 0.0.1
    */
    function resultKeyEvent(currentTest, event) {
      if (currentTest.state > vm.testState.REPORTED) {
        if (
          event.keyCode !== 8 ||
          event.keyCode !== 9 ||
          event.keyCode !== 40 ||
          event.keyCode !== 38 ||
          event.keyCode !== 13
        ) {
          event.preventDefault();
        }
      }
      currentTest.resultRepetition = null;
      if (currentTest.literalResult === undefined) {
        currentTest.literalResult = [];
      }
      if (currentTest.literalResult.length !== 0) {
        currentTest.result = document.getElementById(
          "input_result-" + currentTest.testId + "_value"
        ).value;
      }
      var keyCode = event !== undefined ? event.keyCode : 100000;
      if (
        keyCode == 40 ||
        keyCode == 38 ||
        keyCode == 13 ||
        keyCode == 100000
      ) {
        if (currentTest.result === " " || currentTest.result === "  ") {
          currentTest.result = currentTest.result.trim();
        }
        if (
          (currentTest.result === "" &&
            currentTest.resultedit !== "" &&
            currentTest.state == vm.testState.REPORTED) ||
          (currentTest.result === "" &&
            currentTest.resultedit !== null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          vm.testedit = currentTest;
          UIkit.modal("#modaldeleteresult", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).show();
        } else if (
          currentTest.result === "" ||
          (currentTest.result === null &&
            currentTest.state == vm.testState.REPORTED)
        ) {
          logger.warning($filter("translate")("1755"));
          currentTest.result = currentTest.resultedit;
        }
        var validar = currentTest.result === null ? "" : currentTest.result;
        if (
          currentTest.result !== undefined &&
          validar.length > 0 &&
          currentTest.state <= vm.testState.REPORTED
        ) {
          if (currentTest.resultType === 1) {
            if (currentTest.result !== "" || currentTest.result !== null) {
              if (currentTest.result[currentTest.result.length - 1] === ".") {
                currentTest.result = currentTest.result.replace(".", "");
              }
            }
            if (
              isNaN(parseFloat(currentTest.result)) &&
              currentTest.result !== vm.separator + vm.separator
            ) {
              currentTest.result = currentTest.resultedit;
              logger.error($filter("translate")("1756"));
            } else if (currentTest.reportedMax === currentTest.reportedMin) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                if (keyCode !== 100000) {
                  vm.comparedtes = currentTest.testId;
                  vm.updateTest(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                } else {
                  if (vm.comparedtes !== currentTest.testId) {
                    vm.updateTest(currentTest, vm.testState.REPORTED);
                  }
                }
              } else if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else if (
              currentTest.reportedMin < parseFloat(currentTest.result) &&
              parseFloat(currentTest.result) < currentTest.reportedMax
            ) {
              if (
                currentTest.resultedit !== null &&
                currentTest.resultedit !== currentTest.result &&
                currentTest.state === vm.testState.REPORTED
              ) {
                vm.testedit = currentTest;
                UIkit.modal("#modaleditresult", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else if (currentTest.state < vm.testState.REPORTED) {
                if (keyCode !== 100000) {
                  vm.comparedtes = currentTest.testId;
                  vm.updateTest(currentTest, vm.testState.REPORTED);
                  vm.moveNextTest(keyCode, currentTest);
                } else {
                  if (vm.comparedtes !== currentTest.testId) {
                    vm.updateTest(currentTest, vm.testState.REPORTED);
                  }
                }
              } else if (keyCode !== 100000) {
                vm.moveNextTest(keyCode, currentTest);
              }
            } else {
              currentTest.result = currentTest.resultedit;
              logger.warning($filter("translate")("1444"));
            }
          } else {
            if (
              currentTest.resultedit !== null &&
              currentTest.resultedit !== currentTest.result &&
              currentTest.state === vm.testState.REPORTED
            ) {
              vm.testedit = currentTest;
              UIkit.modal("#modaleditresult", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
            } else if (currentTest.state < vm.testState.REPORTED) {
              if (keyCode !== 100000) {
                vm.comparedtes = currentTest.testId;
                vm.updateTest(currentTest, vm.testState.REPORTED);
                vm.moveNextTest(keyCode, currentTest);
              } else {
                if (vm.comparedtes !== currentTest.testId) {
                  vm.updateTest(currentTest, vm.testState.REPORTED);
                }
              }
            } else if (keyCode !== 100000) {
              vm.moveNextTest(keyCode, currentTest);
            }
          }
        } else {
          var addview =
            (currentTest.result === "" &&
              currentTest.resultedit !== "" &&
              currentTest.state == vm.testState.REPORTED) ||
            (currentTest.result === "" &&
              currentTest.resultedit !== null &&
              currentTest.state == vm.testState.REPORTED);

          if (keyCode !== 100000 && !addview) {
            vm.moveNextTest(keyCode, currentTest);
          }
        }
      }
    }
    /**
      Funcion
      @author  jblanco
      @version 0.0.1
    */
    function keyselect(currentTest, $event) {
      if (currentTest.resultType === 1) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode == 40 || keyCode == 38 || keyCode == 13) {
          if (currentTest.result !== "" || currentTest.result !== null) {
            if (currentTest.result[currentTest.result.length - 1] === ".") {
              currentTest.result = currentTest.result.replace(".", "");
            }
          }
        } else {
          if (keyCode === 45) {
            if (currentTest.result !== "" || currentTest.result !== null) {
              if (currentTest.result[currentTest.result.length - 1] === "-") {
              } else {
                currentTest.result = "";
              }
            }
            var expreg = new RegExp("^[" + vm.separator + "]{0,2}$");
            if (
              !expreg.test(currentTest.result + String.fromCharCode(keyCode))
            ) {
              //detener toda accion en la caja de texto
              $event.preventDefault();
            }
          } else {
            if (
              keyCode === 48 ||
              keyCode === 49 ||
              keyCode === 50 ||
              keyCode === 51 ||
              keyCode === 52 ||
              keyCode === 53 ||
              keyCode === 54 ||
              keyCode === 55 ||
              keyCode === 56 ||
              keyCode === 57
            ) {
              if (currentTest.result !== "" || currentTest.result !== null) {
                if (
                  currentTest.result[currentTest.result.length - 1].search(
                    "-"
                  ) === -1
                ) {
                } else {
                  currentTest.result = "";
                }
              }
            }
            var expreg = new RegExp("^\\d+[.]?\\d*$");
            if (
              !expreg.test(currentTest.result + String.fromCharCode(keyCode))
            ) {
              //detener toda accion en la caja de texto
              $event.preventDefault();
            }
          }
        }
      }
    }
    /**
      Funcion
      @author  jblanco
      @version 0.0.1
    */
    function moveNextTest(keyCode, currentTest) {
      var direction = undefined;
      var obj = {};
      var done = false;
      var last = null;
      var next = null;
      var tempnext = null;
      for (var propiedad in vm.orderTests) {
        if (tempnext === null) {
          tempnext = _.filter(vm.orderTests[propiedad], function (e) {
            return e.idindex === 0;
          })[0];
        }

        if (currentTest.idindex !== 0) {
          last = _.filter(vm.orderTests[propiedad], function (e) {
            return e.idindex === currentTest.idindex - 1;
          })[0];
        }

        next = _.filter(vm.orderTests[propiedad], function (e) {
          return e.idindex === currentTest.idindex + 1;
        })[0];
        if (next !== undefined) {
          break;
        }
      }

      direction =
        keyCode == 38
          ? last.testId
          : next === undefined
          ? tempnext.testId
          : next.testId === undefined
          ? last.testId
          : next.testId;

      if (direction != undefined && event !== undefined) {
        angular.forEach(vm.orderTests, function (item) {
          if (done) {
            return;
          }
          angular.forEach(item, function (itemi) {
            if (itemi.testId == direction) {
              obj = itemi;
              done = true;
              return;
            }
          });
        });
        if (obj.literalResult === undefined) {
          obj.literalResult = [];
        }
        vm.listfilterliteralResult = _.clone(obj.literalResult);
        setTimeout(function () {
          if (obj.literalResult.length !== 0) {
            angular.element("#input_result-" + direction + "_value").focus();
            angular.element("#input_result-" + direction + "_value").select();
          } else {
            angular.element("#input_result-" + direction).focus();
            angular.element("#input_result-" + direction).select();
          }
          vm.selectTest(obj, false, "input");
        }, 100);
      }
    }
    /**
      Funcion
      @author  jblanco
      @version 0.0.1
    */
    function updateTest(Test, newState) {
      if (vm.countresult === 0) {
        vm.loading = true;
        vm.countresult = 1;
        setTimeout(function () {
          vm.countresult = 0;
        }, 500);
        vm.tempresult = true;
        vm.referenceButton = false;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        Test.newState = newState;
        Test.resultChanged = true;
        Test.entryType = 0;
        //Test.resultDate = null;
        Test.orderPathology = vm.dataOrders[vm.selectedOrderIndex].pathology;
        Test.resultComment.pathology = Test.resultComment.pathology2 ? 1 : 0;

        if (Test.result !== undefined && Test.result !== null) {
          if (Test.resultType === 1 && Test.result.indexOf(",") !== -1) {
            Test.result = Test.result.replace(",", ".");
          }
        }
        if (Test.resultChanged && Test.resultType == 2) {
          vm.tempresult = Test.result !== "MEMO";
          //Validar resultado por comentario codificado.
          var codeComment = $filter("filter")(vm.codeCommentList, function (e) {
            return e.code === Test.result;
          });
          if (
            codeComment != undefined &&
            codeComment != null &&
            codeComment.length > 0
          ) {
            if (codeComment[0].message.length > 16) {
              if (Test.resultComment.hasComment) {
                Test.resultComment.hasComment =
                  Test.resultComment.comment === " "
                    ? false
                    : Test.resultComment.hasComment;
                var TestresultComment =
                  Test.resultComment.comment === undefined ||
                  Test.resultComment.comment === ""
                    ? ""
                    : Test.resultComment.comment.replace(/span/g, "font");
                TestresultComment =
                  TestresultComment === undefined || TestresultComment === ""
                    ? ""
                    : TestresultComment.replace(new RegExp("<p", "g"), "<div");
                TestresultComment =
                  TestresultComment === undefined || TestresultComment === ""
                    ? ""
                    : TestresultComment.replace(
                        new RegExp("</p>", "g"),
                        "</div>"
                      );

                Test.resultComment.comment =
                  TestresultComment + " " + codeComment[0].message;
              } else {
                Test.resultComment.comment = codeComment[0].message;
              }
              Test.result = "MEMO";
              Test.resultComment.commentChanged = true;
            } else {
              Test.result = codeComment[0].message;
            }
          } else {
            Test.resultComment.hasComment = false;
            /*  Test.resultComment.comment=null; */
          }
        }

        if (
          Test.resultComment.comment === "" ||
          Test.resultComment.comment === null ||
          Test.resultComment.comment === " "
        ) {
          Test.resultComment.hasComment = false;
          Test.resultComment.comment = null;
          /*   if (Test.result === 'MEMO' && Test.state === vm.testState.REPORTED) {
              Test.newState = vm.testState.ORDERED;
              Test.result = '';
            } */
        } else {
          var TestresultComment =
            Test.resultComment.comment === undefined ||
            Test.resultComment.comment === ""
              ? ""
              : Test.resultComment.comment.replace(/span/g, "font");
          TestresultComment =
            TestresultComment === undefined || TestresultComment === ""
              ? ""
              : TestresultComment.replace(new RegExp("<p", "g"), "<div");
          TestresultComment =
            TestresultComment === undefined || TestresultComment === ""
              ? ""
              : TestresultComment.replace(new RegExp("</p>", "g"), "</div>");
          Test.resultComment.comment = TestresultComment;
        }
        Test.idUser = auth.id;
        Test.resultRepetition =
          Test.resultRepetition !== undefined && Test.resultRepetition !== null
            ? Object.keys(Test.resultRepetition).length === 0
              ? undefined
              : Test.resultRepetition
            : undefined;
        return resultsentryDS.updateTest(auth.authToken, Test).then(
          function (data) {
            if (data.status === 200) {
              Test.state = data.data.state;
              Test.resultRepetition = {};
              Test.pathology = data.data.pathology;
              Test.repeatedResultValue = data.data.repeatedResultValue;
              Test.orderPathology = data.data.orderPathology;
              vm.dataOrders[vm.selectedOrderIndex].pathology =
                Test.orderPathology;
              Test.resultChanged = data.data.resultChanged;
              Test.resultComment.commentChanged =
                data.data.resultComment.commentChanged;
              Test.resultComment.hasComment = data.data.hasComment;
              Test.resultDate = data.data.resultDate;
              Test.hasComment = data.data.hasComment;
              Test.resultedit = null;
              Test.print = data.data.print;
              Test.result = data.data.result;
              Test.previousResult = data.data.previousResult;
              vm.testedit = null;
              vm.loading = false;
              vm.setFilter(vm.selectedOrder.order);
              //updateButtonBarByTest();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        vm.countresult = 0;
      }
    }

    vm.savenotes = savenotes;
    function savenotes() {
      vm.loading = true;
      var notes = {
        order: vm.selectedTest[0].order,
        testId: vm.selectedTest[0].testId,
        comment: vm.notescomment,
      };
      if (vm.notescomment === "" || vm.notescomment === undefined) {
        vm.selectedTest[0].hasCommentInternal = false;
      } else {
        vm.selectedTest[0].hasCommentInternal = true;
      }
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.saveinternalcomment(auth.authToken, notes).then(
        function (data) {
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    /**
      Funcion
      @author  jblanco
      @version 0.0.1
    */
    function isAuthenticate() {
      //var auth = null
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    /**
      Funcion  Obtiene la entrevista de pánico
      @author  jblanco
    */
    function getPanicSurvey() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.getPanicSurvey(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.panicSurvey = data.data;
            vm.getTypeInterview();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    /**
      Funcion  Obtiene los examenes de la entrevista de pánico
    */
    function getTypeInterview() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return resultsentryDS.getTypeInterview(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.panicSurveyTests = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    //Metodo que consulta los examenes que pertenecen a muestras de microbiologia para el filtro de pruebas.
    function getTestMicrobiology() {
      vm.testselected = {
        id: null,
        name: $filter("translate")("0215"),
      };

      vm.listTestMicrobiology = [
        {
          id: null,
          name: $filter("translate")("0215"),
        },
      ];

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestmicrobiology(auth.authToken).then(
        function (data) {
          vm.listTestMicrobiology = vm.listTestMicrobiology.concat(
            data.data.sort(vm.orderlistTest)
          );
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    vm.getSampleOrder = getSampleOrder;
    //Metodo que realiza la consulta de las ordenes segun los filtros escogidos
    function getSampleOrder() {
      vm.loaddata = false;
      vm.dataOrders = [];
      vm.loading = true;
      vm.patient = undefined;
      vm.patientdata = {};
      vm.dataOrdersOrigin = [];
      vm.stateFilters = 1;
      vm.searchhistory = "";
      vm.countwidget.result = null;
      vm.countwidget.valid = null;
      vm.countwidget.inprevalid = null;
      vm.countwidget.report = null;
      vm.countwidget.attachment = null;
      vm.countwidget.urgency = null;
      vm.countwidget.panic = null;
      vm.countwidget.critical = null;
      vm.countwidget.oportunity = null;

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var filter = {
        firstOrder: parseInt(vm.orderfilter) - 1,
        lastOrder: parseInt(vm.orderfilter) + 1,
        end: 1,
        init: -1,
        rangeType: "1",
        report: vm.report.id,
        test: null,
        userId: auth.id,
      };
      if (vm.sample !== null && vm.sample !== "") {
        filter.codeSample = vm.sample;
      }
      vm.messagerestartTask = $filter("translate")("0590")
        .replace("@@@@", vm.orderfilter)
        .replace("@@@@", vm.orderfilter);
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return microbiologyDS
        .getmicrobiologyresultorder(auth.authToken, filter)
        .then(
          function (data) {
            if (data.status === 200) {
              data.data = $filter("filter")(data.data, function (e) {
                return e.sampleState !== 1;
              });
              data.data.forEach(function (value) {
                if (value.sex.id == 7) {
                  value.sex = {
                    id: 7,
                    code: "1",
                    esCo: "Masculino",
                    enUsa: "Male",
                  };
                }
                if (value.sex.id == 8) {
                  value.sex = {
                    id: 8,
                    code: "2",
                    esCo: "Femenino",
                    enUsa: "Female",
                  };
                }
                if (value.sex.id == 9) {
                  value.sex = {
                    id: 9,
                    code: "3",
                    esCo: "Indefinido",
                    enUsa: "Undefined",
                  };
                }
                if (value.sex.id == 42) {
                  value.sex = {
                    id: 42,
                    code: "4",
                    esCo: "Ambos",
                    enUsa: "Both",
                  };
                }

                var typeorder = _.filter(_.clone(vm.orderTypes), function (x) {
                  return value.idOrderType === x.id;
                });
                if (typeorder.length > 0) {
                  value.orderTypeName = typeorder[0].name;
                  value.orderType = typeorder[0].code;
                }

                if (vm.listbranch.length === 1) {
                  value.branch = vm.branchnameresult;
                } else {
                  var Branchlist = _.filter(
                    _.clone(vm.listbranch),
                    function (x) {
                      return parseInt(value.branch) === x.id;
                    }
                  );
                  if (Branchlist.length > 0) {
                    value.branch = Branchlist[0].name;
                  }
                }

                if (value.idService !== 0) {
                  var service = _.filter(
                    _.clone(vm.listServices),
                    function (x) {
                      return x.id == value.idService;
                    }
                  );
                  if (service.length > 0) {
                    value.service = service[0].name;
                    value.codeService = service[0].code;
                  }
                } else {
                  value.service = "";
                }
                var idtype = _.filter(
                  _.clone(vm.listdocumentType),
                  function (x) {
                    return x.id === parseInt(value.idtype);
                  }
                );
                if (idtype.length > 0) {
                  value.idtype = idtype[0].abbr;
                }
                value.size = 0;
                value.weight = 0;
              });

              vm.filterinternal.report = false;
              vm.filterinternal.valid = false;
              vm.filterinternal.inprevalid = false;
              vm.filterinternal.result = false;
              vm.dataOrdersOrigin = _.clone(data.data);
              vm.dataOrders = _.uniqBy(data.data, "order");
              vm.getcountwidget(data.data);
              vm.selectOrder(1, data.data[0], 0);
              UIkit.modal("#modaldate").hide();
              vm.loading = false;
            } else {
              vm.filterinternal.report = false;
              vm.filterinternal.valid = false;
              vm.filterinternal.inprevalid = false;
              vm.filterinternal.result = false;
              vm.orderTests = [];
              vm.dataOrders = [];
              vm.loading = false;
              vm.menssageinformative =
                "No se encontraron datos relacionados al filtro Seleccionado";
              //UIkit.modal('#nofoundfilter').show();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    ///////////////  Metodos de los indicadores y filtros de las ordenes ////

    //Metodo trazabilidad de la muestra
    function trackingmicrobiologytask() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var customer = vm.abbrCustomer + " (" + vm.nameCustomer + ")";
      vm.variables = {
        customer: customer,
        username: auth.userName,
        now: moment().format(vm.formatDateHours),
      };
      return microbiologyDS
        .getlisttrackingmicrobiologytasks(
          auth.authToken,
          vm.selectedOrder.order,
          vm.selectedTest[0].testId
        )
        .then(function (data) {
          vm.pathreport =
            "/Report/post-analitic/trackingmicrobiologytask/trackingmicrobiologytask.mrt";
          vm.orientation = "vertical";
          vm.datareport = vm.generateDataReport(data.data);
          vm.progressPrint = false;
          vm.openreport = false;
          vm.windowOpenReport();
        });
    }

    //Funcion para abrir ventana de reportes
    function windowOpenReport() {
      if (vm.datareport.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify(
          $translate.getTranslationTable()
        );
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
      } else {
        UIkit.modal("#modalReportError").show();
      }
    }

    function generateDataReport(data) {
      var dataReport = [];
      if (data.length > 0) {
        data.forEach(function (value) {
          var nameRecord = value.type === 1 ? vm.mediacultures : vm.procedure;
          for (var i = 0; i < value.tasks.length; i++) {
            dataReport.push({
              lastTransaction: moment(value.lastTransaction).format(
                vm.formatDateHours
              ),
              userId: value.user.id,
              userName: value.user.userName,
              lastName: value.user.lastName,
              firshName: value.user.name,
              id: value.id,
              order: value.order,
              test: value.idTest,
              testName: value.nameTest,
              testAbbr: value.abbrTest,
              idPatient: value.patient !== undefined ? value.patient.id : null,
              patientId:
                value.patient !== undefined ? value.patient.patientId : null,
              name1: value.patient !== undefined ? value.patient.name1 : null,
              name2: value.patient !== undefined ? value.patient.name2 : null,
              lastNameP:
                value.patient !== undefined ? value.patient.lastName : null,
              surName:
                value.patient !== undefined ? value.patient.surName : null,
              idRecord: value.idRecord,
              nameRecord: $filter("filter")(
                nameRecord,
                {
                  id: value.idRecord,
                },
                true
              )[0].name,
              comment: value.comment,
              type: value.type,
              nameType: $filter("translate")(
                "0" + (485 + value.type).toString()
              ),
              tasksId: value.tasks[i].id,
              tasksDescription: value.tasks[i].description,
              tasksState: value.tasks[i].state,
              reported: value.reported,
              userRegisterId: value.userRegister.id,
              userRegisterName: value.userRegister.userName,
              lastNameR: value.userRegister.lastName,
              firshNameR: value.userRegister.name,
              dateRegister: moment(value.dateRegister).format(
                vm.formatDateHours
              ),
            });
          }
        });
      }
      return dataReport;
    }

    // función para  lista de medios de cultivo
    function getmediacultures() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return mediaculturesDS.getmediaculturesAll(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.mediacultures = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    // función para  lista de procedimientos
    function getprocedure() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return proceduresDS.getproceduresAll(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.procedure = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    ///////////////  Metodos de la botonera para acciones con las ordenes ////

    //Función que imprime el reporte de tareas
    function tasksreport() {
      if (vm.rangeInit === "" || vm.rangeInit === undefined) {
        var json = {
          rangeType: 1,
          init: vm.orderfilter,
          end: vm.orderfilter,
        };
      } else {
        var json = {
          rangeType: vm.filterRange,
          init: vm.rangeInit,
          end: vm.rangeEnd,
        };
      }

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.variables = {
        username: auth.userName,
        now: moment().format(vm.formatDateHours),
      };

      return microbiologyDS
        .getlisttasksperpatient(auth.authToken, json)
        .then(function (data) {
          vm.pathreport = "/Report/post-analitic/tasks/tasks.mrt";
          vm.orientation = "vertical";
          vm.datareport =
            data.data.length === 0 ? data.data : vm.adddate(data.data);
          vm.progressPrint = false;
          vm.openreport = false;
          vm.windowOpenReport();
        });
    }

    function adddate(data) {
      data.forEach(function (value, key) {
        value.dateRegister = moment(value.dateRegister).format(
          vm.formatDateHours
        );
      });
      return data;
    }

    //funcion para imprimir el reporte de tareas por paciente
    function tasksperpatient() {
      vm.getmediacultures();
      vm.getprocedure();
      if (vm.rangeInit === "" || vm.rangeInit === undefined) {
        var json = {
          rangeType: 1,
          init: vm.orderfilter,
          end: vm.orderfilter,
        };
      } else {
        var json = {
          rangeType: vm.filterRange,
          init: vm.rangeInit,
          end: vm.rangeEnd,
        };
      }
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var customer = vm.abbrCustomer + " (" + vm.nameCustomer + ")";
      vm.variables = {
        customer: customer,
        username: auth.userName,
        now: moment().format(vm.formatDateHours),
      };
      return microbiologyDS
        .getlisttasksperpatient(auth.authToken, json)
        .then(function (data) {
          vm.pathreport =
            "/Report/post-analitic/tasksperpatient/tasksperpatient.mrt";
          vm.orientation = "vertical";
          vm.datareport = vm.generateDataReport(data.data);
          vm.progressPrint = false;
          vm.openreport = false;
          vm.windowOpenReport();
        });
    }

    function generateDataReport(data) {
      var dataReport = [];
      if (data.length > 0) {
        data.forEach(function (value) {
          var nameRecord = value.type === 1 ? vm.mediacultures : vm.procedure;
          for (var i = 0; i < value.tasks.length; i++) {
            dataReport.push({
              lastTransaction: moment(value.lastTransaction).format(
                vm.formatDateHours
              ),
              userId: value.user.id,
              userName: value.user.userName,
              lastName: value.user.lastName,
              firshName: value.user.name,
              id: value.id,
              order: value.order,
              test: value.idTest,
              testName: value.nameTest,
              testAbbr: value.abbrTest,
              idPatient: value.patient !== undefined ? value.patient.id : null,
              patientId:
                value.patient !== undefined ? value.patient.patientId : null,
              name1: value.patient !== undefined ? value.patient.name1 : null,
              name2: value.patient !== undefined ? value.patient.name2 : null,
              lastNameP:
                value.patient !== undefined ? value.patient.lastName : null,
              surName:
                value.patient !== undefined ? value.patient.surName : null,
              idRecord: value.idRecord,
              nameRecord: $filter("filter")(
                nameRecord,
                {
                  id: value.idRecord,
                },
                true
              )[0].name,
              comment: value.comment,
              type: value.type,
              nameType: $filter("translate")(
                "0" + (485 + value.type).toString()
              ),
              tasksId: value.tasks[i].id,
              tasksDescription: value.tasks[i].description,
              tasksState: value.tasks[i].state,
              reported: value.reported,
              userRegisterId: value.userRegister.id,
              userRegisterName: value.userRegister.userName,
              lastNameR: value.userRegister.lastName,
              firshNameR: value.userRegister.name,
              dateRegister: moment(value.dateRegister).format(
                vm.formatDateHours
              ),
            });
          }
        });
      }
      return dataReport;
    }

    vm.getpendingverificationreport = getpendingverificationreport;
    //Función que imprime el reporte de pendientes de verificación
    function getpendingverificationreport() {
      if (vm.rangeInit === "" || vm.rangeInit === undefined) {
        var json = {
          rangeType: 1,
          init: vm.orderfilter,
          end: vm.orderfilter,
        };
      } else {
        var json = {
          rangeType: vm.filterRange,
          init: vm.rangeInit,
          end: vm.rangeEnd,
        };
      }
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.variables = {
        username: auth.userName,
        now: moment().format(vm.formatDateHours),
      };

      return microbiologyDS
        .getpendingverification(auth.authToken, json)
        .then(function (data) {
          vm.pathreport =
            "/Report/post-analitic/Pendingverification/Pendingverification.mrt";
          vm.orientation = "vertical";
          vm.datareport =
            data.data.length === 0 ? data.data : vm.adddate(data.data);
          vm.progressPrint = false;
          vm.openreport = false;
          vm.windowOpenReport();
        });
    }

    vm.restartTask = restartTask;
    //funcion para reiniciar las tareas de un rango especifico de ordenes
    function restartTask() {
      if (vm.rangeInit === "" || vm.rangeInit === undefined) {
        var detail = {
          rangeType: 1,
          init: vm.orderfilter,
          end: vm.orderfilter,
        };
      } else {
        var detail = {
          rangeType: vm.filterRange,
          init: vm.rangeInit,
          end: vm.rangeEnd,
        };
      }
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return microbiologyDS.restarttask(auth.authToken, detail).then(
        function (data) {
          if (data.status === 200) {
            logger.success($filter("translate")("0149"));
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    vm.loadDemographicControls = loadDemographicControls;
    function loadDemographicControls() {
      vm.demopatient = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      orderentryDS.getDemographics(auth.authToken, "H").then(
        function (response) {
          vm.demopatient = $filter("orderBy")(response.data, "orderingDemo");
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }
    vm.printGraph = printGraph;
    function printGraph() {
      //vm.selectedTest = test;
      vm.loadingdatamodal = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var patient = {
        id: vm.patient.id,
        testId: [vm.selectedTest[0].testId],
      };
      return resultsentryDS.getResultsHistory(auth.authToken, patient).then(
        function (data) {
          if (data.status === 200) {
            var listorder =
              data.data.length === 0 ? data.data : changetime(data);
            vm.consultpatient = listorder;
            if (vm.selectedTest[0].resultType === 2) {
              vm.printhistory();
            } else {
              vm.consulGraph();
            }
          } else {
            logger.info("No existen datos para generar este reporte");
          }
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function changetime(data) {
      var list = [];
      data.data[0].history.forEach(function (value) {
        value.validationDateFormat = value.validateDate;
        value.validationDate =
          value.validateDate === undefined
            ? null
            : moment(value.validateDate).format(vm.formatDate);
        value.entryDate =
          value.entryDate === undefined
            ? null
            : moment(value.entryDate).format(vm.formatDate);
        value.result = value.result === undefined ? "Pendiente" : value.result;
        if (vm.selectedTest.resultType === 1) {
          if (!isNaN(value.result)) {
            list.push(value);
          }
        } else {
          list.push(value);
        }
      });
      return list;
    }

    vm.loadPatient = loadPatient;
    /** Carga la informacion de un paciente tomando la variable vm.patientIdDB*/
    function loadPatient(order) {
      vm.patientdata = {};
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      patientDS.getPatientObjectByOrder(auth.authToken, order).then(
        function (response) {
          if (response.status === 200) {
            vm.patientdata = response.data;
          }
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }

    vm.printhistory = printhistory;
    //** Método  para imprimir el reporte historico**//
    function printhistory() {
      vm.consultpatientprint = $filter("filter")(vm.consultpatient, {
        validationDate: "!!",
      });
      vm.consultpatientprint = $filter("orderBy")(
        vm.consultpatientprint,
        "validationDateFormat",
        "desc"
      );
      vm.consultpatientprint =
        vm.consultpatientprint.length > 20
          ? vm.consultpatientprint.slice(0, 20)
          : vm.consultpatientprint;

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.datareport = vm.consultpatientprint;
      var datapatient = {
        typedocument: "",
        patientId: vm.patientdata.patientId,
        patientname: vm.patient.name,
        gender: vm.patientdata.sex.esCo,
        birthday: moment(vm.patient.birthday).format("DD/MM/YYYY"),
        age: vm.patient.age,
        email: "",
      };
      var parameterReport = {};
      parameterReport.variables = {
        test: vm.selectedTest[0].testName,
        patient: datapatient,
        username: auth.userName,
        date: moment().format(vm.formatDate),
        abbreviation: localStorageService.get("Abreviatura"),
        entity: localStorageService.get("Entidad"),
      };

      parameterReport.pathreport =
        "/Report/post-analitic/historical/consultpatienfortest.mrt";
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      if (vm.datareport.length > 0) {
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
      } else {
        logger.info("No existen datos para generar este reporte");
      }
    }
    vm.consulGraph = consulGraph;
    //** Método  para imprimir el reporte grafica**//
    function consulGraph() {
      vm.grafiphprint = $filter("filter")(vm.consultpatient, {
        validationDate: "!!",
      });
      vm.grafiphprint = $filter("orderBy")(
        vm.grafiphprint,
        "validationDateFormat",
        "desc"
      );
      vm.grafiphprint =
        vm.grafiphprint.length > 20
          ? vm.grafiphprint.slice(0, 20)
          : vm.grafiphprint;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.datareport = vm.grafiphprint;
      var datapatient = {
        typedocument: "",
        patientId: vm.patientdata.patientId,
        patientname: vm.patient.name,
        gender: vm.patientdata.sex.esCo,
        birthday: moment(vm.patient.birthday).format("DD/MM/YYYY"),
        age: vm.patient.age,
        email: "",
      };
      var parameterReport = {};
      parameterReport.variables = {
        test: vm.selectedTest[0].testName,
        patient: datapatient,
        username: auth.userName,
        date: moment().format(vm.formatDate),
        abbreviation: localStorageService.get("Abreviatura"),
        entity: localStorageService.get("Entidad"),
      };
      parameterReport.pathreport =
        "/Report/post-analitic/historical/consultgraphics.mrt";
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      if (vm.datareport.length > 0) {
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
      } else {
        logger.info("No existen datos para generar este reporte");
      }
    }

    /**
      Funcion
      @author  jblanco
      @version 0.0.1
    */
    function init() {
      UIkit.modal("#modaldate", {
        bgclose: false,
        escclose: false,
        modal: false,
      }).show();
      vm.typefilterorder = 1;
      vm.filterRange = "1";
      vm.dataOrders = [];
      vm.messagerestartTask = "";
      vm.filterinfo = {
        textinit: $filter("translate")("0075"),
        textend: $filter("translate")("0076"),
        valueinit: "N/A",
        valueend: "N/A",
        valuefilterareatest: "N/A",
        valuefilterdemographics: "N/A",
      };
      vm.filterinternal.resultspecific = false;
      vm.reportHitory = localStorageService.get("ReporteHistorico") === "True";
      vm.numerOrder =
        localStorageService.get("OrdencompletaRegistroResultados") === "True"
          ? 0
          : 3;
      vm.Btninconsistencias =
        localStorageService.get("Btninconsistencias") === "True";
      vm.Btnadjuntos = localStorageService.get("Btnadjuntos") === "True";
      vm.Btnrepeticiones =
        localStorageService.get("Btnrepeticiones") === "True";
      vm.Btnconsultarepeticiones =
        localStorageService.get("Btnconsultarepeticiones") === "True";
      vm.Btnresultadosretrasados =
        localStorageService.get("Btnresultadosretrasados") === "True";
      vm.Btnantibiograma =
        localStorageService.get("Btnantibiograma") === "True";
      vm.Btncodigodebarras =
        localStorageService.get("Btncodigodebarras") === "True";
      vm.formatDate =
        localStorageService.get("FormatoFecha").toUpperCase() + " HH:mm:ss";
      vm.formatDateHours =
        localStorageService.get("FormatoFecha").toUpperCase() + ", HH:mm:ss";
      vm.formatDateFilter = localStorageService
        .get("FormatoFecha")
        .toUpperCase();
      vm.abbrCustomer = localStorageService.get("Abreviatura").toUpperCase();
      vm.nameCustomer = localStorageService.get("Entidad").toUpperCase();

      vm.orderfilter = "";
      vm.menssageinformative = "";
      vm.sample = null;

      vm.reportfilter = [
        {
          id: "0",
          name:
            $filter("translate")("0602") + " / " + $filter("translate")("0603"),
        },
        {
          id: "1",
          name: $filter("translate")("0602"),
        },
        {
          id: "2",
          name: $filter("translate")("0603"),
        },
      ];

      vm.report = {
        id: "1",
        name: $filter("translate")("0602"),
      };
      vm.getService();
      vm.getbranch();
      vm.getOrderTypes();
      vm.getLiteralResult();

      vm.getPanicSurvey();
      vm.getTestMicrobiology();
      vm.getmediacultures();
      vm.getprocedure();
      vm.loadDemographicControls();

      if (vm.typedocumentkey) {
        vm.gettypedocument();
      }

      vm.getCodeComment();

      setTimeout(function () {
        document.getElementById("microbiology").focus();
      }, 2000);
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
