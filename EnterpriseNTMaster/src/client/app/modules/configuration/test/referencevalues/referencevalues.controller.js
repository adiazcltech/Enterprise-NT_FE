(function () {
  'use strict';
  angular
    .module('app.referencevalues')
    .filter("trust", ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('referenceValuedependenceController', referenceValuedependenceController)
    .controller('editdataController', editdataController)
    .controller('ReferencevaluesController', ReferencevaluesController);
  ReferencevaluesController.$inject = ['areaDS', 'destinationmicrobiologyDS', 'referencevaluesDS', 'listDS', 'raceDS', 'testDS', 'configurationDS', 'literalresultDS', 'localStorageService', 'logger',
    '$filter', '$state', '$rootScope', 'ModalService', 'LZString', '$translate', 'keyStimulsoft'
  ];

  function ReferencevaluesController(areaDS, destinationmicrobiologyDS, referencevaluesDS, listDS, raceDS, testDS, configurationDS, literalresultDS, localStorageService, logger,
    $filter, $state, $rootScope, ModalService, LZString, $translate, keyStimulsoft) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'referencevalues';
    vm.code = ['code', 'resultType'];
    vm.resultType = ['resultType', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;

    vm.racename = ['race.name', 'gender.esCo'];
    vm.genderesCo = ['gender.esCo', 'race.name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.racename;


    vm.selected = null;
    vm.selectedreference = -1;
    vm.isDisabledPrint = false;
    vm.isAuthenticate = isAuthenticate;
    vm.save = save;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getReferencevalues = getReferencevalues;
    vm.getLisGende = getLisGende;
    vm.New = New;
    vm.modalrequired = modalrequired;
    vm.getTest = getTest;
    vm.getAreaActive = getAreaActive;
    vm.newuseranlalizer = newuseranlalizer;
    vm.getConfigurationRace = getConfigurationRace;
    vm.getRaceActive = getRaceActive;
    vm.getLiteralResultTest = getLiteralResultTest;
    vm.errorservice = 0;
    vm.laboratoryassign = '';
    vm.listTest = [];
    vm.listTestHide = [];
    vm.ListGender = [];
    vm.ListRace = [];
    vm.resultType = 0;
    vm.Idtest = -1;
    vm.racevalid = true;
    vm.decimalCant = 0;
    vm.windowOpenReport = windowOpenReport
    vm.loadingdata = true;
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
    //** Metodo que válida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.exportReferenceValues = exportReferenceValues;
    //** Metodo para obtener una lista de examenes**//
    function exportReferenceValues() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return referencevaluesDS.getreferencevaluesTest(auth.authToken, 0).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            value.normalMin = value.normalMin === undefined ? 0 : value.normalMin;
            value.normalMax = value.normalMax === undefined ? 0 : value.normalMax;
            value.panicMin = value.panicMin === undefined ? 0 : value.panicMin;
            value.panicMax = value.panicMax === undefined ? 0 : value.panicMax;
            value.unitAgeName = value.unitAge === 1 ? $filter('translate')('0111') : $filter('translate')('0115');
            value.panic.name = value.panic.id === 0 ? "" : value.panic.name;
            value.normal.name = value.normal.id === 0 ? "" : value.normal.name;
            value.test.resultTypeName = value.test.resultType === 2 ? $filter('translate')('0429') : $filter('translate')('0430');
          });
          vm.dataexport = data.data;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var parameterReport = {};
          parameterReport.variables = {
            "entity": localStorageService.get('Entidad'),
            "abbreviation": localStorageService.get('Abreviatura'),
            'date': moment().format(vm.formatDate.toUpperCase() + ' hh:mm:ss a.'),
            'username': auth.userName
          }
          parameterReport.pathreport = 'Report/Configuration/test/referencevalues/referencevaluesexport.mrt';
          parameterReport.labelsreport = $translate.getTranslationTable();
          setTimeout(function () {
            vm.loadingdata = false;
          }, 11);
          vm.setReportExcel(parameterReport, vm.dataexport);
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    vm.setReportExcel = setReportExcel;
    function setReportExcel(parameterReport, datareport) {
      setTimeout(function () {
        Stimulsoft.Base.StiLicense.key = keyStimulsoft;
        var report = new Stimulsoft.Report.StiReport();
        report.loadFile(parameterReport.pathreport);
        var jsonData = {
          'data': datareport,
          'Labels': [parameterReport.labelsreport],
          'variables': [parameterReport.variables]
        };
        var dataSet = new Stimulsoft.System.Data.DataSet();
        dataSet.readJson(jsonData);
        report.dictionary.databases.clear();
        report.regData('Demo', 'Demo', dataSet);
        report.renderAsync(function () {
          var data = report.exportDocument(Stimulsoft.Report.StiExportFormat.Excel2007);
          Object.saveAs(data, "Report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        })
      }, 10);
    }
    //** Metodo para obtener una lista de examenes**//
    function getTest() {
      vm.Idtest = -1;
      vm.listReferencevalues = [];
      vm.selected = null;
      vm.resultype = -1;
      vm.ListAreas.id = vm.ListAreas.id === null || vm.ListAreas.id === undefined ? 0 : vm.ListAreas.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, vm.ListAreas.id).then(function (data) {
        vm.listTest = data.data.length === 0 ? data.data : removeDataList(data);
        vm.getLisGende();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para adicionar o eliminar elementos de JSON**//
    function removeDataList(data) {
      data.data.forEach(function (value, key) {
        data.data[key].searh = value.code + value.name
      });
      return data.data;
    }
    //** Metodo para consultar la llave manejo de raza**//
    function getConfigurationRace() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'ManejoRaza').then(function (data) {
        vm.newuseranlalizer();
        if (data.status === 200) {
          vm.racevalid = data.data.value === 'False' ? false : true;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de usuarios analizadores**//
    function newuseranlalizer() {
      vm.listanalizeruser = [{
        'id': 0,
        'name': 'Manual'
      }];
      vm.analizeruser = {
        'id': 0
      };
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.getAreaActive();
      return destinationmicrobiologyDS.getuseranalizer(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listanalizeruser.push({
              'id': value.userId,
              'name': value.userName
            });
          });

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de areas activas**//
    function getAreaActive() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (dataArea) {
        dataArea.data[0] = {
          'id': 0,
          'name': $filter('translate')('0209')
        }
        vm.ListAreas = dataArea.data;
        vm.ListAreas.id = 0;
        vm.getTest();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Metodo para obtener una el detalle de valor de referencia del examen**//
    function getReferencevalues(id, resultType, decimal, index, testobject) {
      vm.test = id;
      vm.loadingdata = true;
      if (testobject !== undefined) {
        vm.selected = testobject;
        vm.area = vm.selected.area.id;
        vm.codeTest = vm.selected.code;
        vm.processingBy = vm.selected.processingBy;
      }
      vm.resultype = resultType;
      vm.decimalCant = decimal;
      vm.Idtest = id;
      vm.getLiteralResultTest();
      vm.ListUnitAge = [{
        'id': 1,
        'name': $filter('translate')('0111')
      },
      {
        'id': 2,
        'name': $filter('translate')('0115')
      }
      ];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return referencevaluesDS.getreferencevaluesTest(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (data.data.length > 0) {
            data.data.forEach(function (value, key) {
              data.data[key].race.name = data.data[key].race.id === null || data.data[key].race.id === 0 || data.data[key].race.id === undefined ? $filter('translate')('0209') : data.data[key].race.name;
              data.data[key].unitAgeText = data.data[key].unitAge === 1 ? $filter('translate')('0111') : $filter('translate')('0115');
              data.data[key].username = auth.userName;
            });
          }
          vm.listReferencevalues = data.data;
          return vm.listReferencevalues;
        } else {
          vm.listReferencevalues = [];
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de generos activas**//
    function getLisGende() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 6).then(function (data) {
        var ListGende = [];
        if (($filter('translate')('0000')) === 'esCo') {
          data.data.forEach(function (value, key) {
            if (value.id !== 9) {
              var object = {
                id: value.id,
                name: value.esCo,
                esCo: value.esCo,
                enUsa: value.enUsa
              };
              ListGende.push(object);
            }
          });
        } else {
          data.data.forEach(function (value, key) {
            if (value.id !== 9) {
              var object = {
                id: value.id,
                name: value.enUsa,
                esCo: value.esCo,
                enUsa: value.enUsa
              };
              ListGende.push(object);
            }
          });
        }
        vm.ListGender = ListGende;
        vm.getRaceActive();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de razas activas**//
    function getRaceActive() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return raceDS.getRaceActive(auth.authToken).then(function (data) {
        if (data.data.length !== 0) {
          vm.ListRace = data.data;
          var raceAll = {
            'id': 0,
            'name': $filter('translate')('0209')
          }
          vm.ListRace.push(raceAll);
          vm.ListRace.reverse();

        }
        vm.getLiteralResultTest();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener una lista de resultados literales activos**//
    function getLiteralResultTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return literalresultDS.getIdTest(auth.authToken, vm.Idtest).then(function (data) {
        vm.ListLiteralResult = data.data;
        vm.loadingdata = false;
        // vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener la llave de configuración de formato de fecha**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getConfigurationRace();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.user.id = auth.id;
      if (data.race !== undefined && data.race !== null) {
        data.race = data.race.id === null ? null : data.race;
      } else {
        data.race = null;
      }

      data.ageMin = isNaN(data.ageMin) ? null : data.ageMin;
      vm.loadingdata = true;
      if (vm.race === null) {
        delete data.race;
      }
      if (vm.resultype !== 1) {
        data.panic = data.panic.id === null || data.panic.id === 0 ? null : _.filter(vm.ListLiteralResult, function (o) { return (o.literalResult.id === data.panic.id) })[0].literalResult;
        data.normal = data.normal.id === null || data.normal.id === 0 ? null : _.filter(vm.ListLiteralResult, function (o) { return (o.literalResult.id === data.normal.id) })[0].literalResult;
      }
      if (vm.resultype === 1) {
        delete data.panic;
        delete data.normal;
      }
      data.comment = data.comment === undefined ? '' : data.comment.replace(/span/g, "font");
      data.comment = data.comment === undefined ? '' : data.comment.replace(new RegExp("<p>", 'g'), "<div>");
      data.comment = data.comment === undefined ? '' : data.comment.replace(new RegExp("</p>", 'g'), "</div>");
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (data.id === null) {
        return referencevaluesDS.insertreferencevaluesTest(auth.authToken, data).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.getReferencevalues(vm.Idtest, vm.resultype, vm.decimalCant);
            logger.success($filter('translate')('0042'));
          }
        }, function (error) {
          vm.modalError(error);
        });
      } else {
        return referencevaluesDS.updatereferencevaluesTest(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            vm.getReferencevalues(vm.Idtest, vm.resultype, vm.decimalCant);
            logger.success($filter('translate')('0042'));
          }
        }, function (error) {
          vm.modalError(error);
        });
      }
    }

    vm.destroy = destroy;
    function destroy(referenceDetail) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return referencevaluesDS.deletereferencevaluesTest(auth.authToken, referenceDetail.id).then(function (data) {
        if (data.status === 200) {
          vm.getReferencevalues(vm.Idtest, vm.resultype, vm.decimalCant);
          logger.success($filter('translate')('0042'));
        }
      }, function (error) {
        vm.modalError(error);
      });
    }


    //** Método para crear un nuevo valor de referencia**//
    function New(referenceDetail, index) {
      if (referenceDetail === undefined) {
        referenceDetail = {
          'id': null,
          'test': vm.test,
          'unitAge': 1,
          'ageMin': 0,
          'ageMax': 200,
          'normalMin': '',
          'normalMax': '',
          'panicMin': '',
          'panicMax': '',
          'analizerUserId': vm.analizeruser.id === 0 ? null : vm.analizeruser.id,
          'reportableMin': '',
          'reportableMax': '',
          'comment': '',
          'race': vm.ListRace.length === 0 ? null : vm.ListRace[0],
          'gender': vm.ListGender.length === 0 ? '' : vm.ListGender[0],
          'criticalCh': false,
          'lastTransaction': null,
          'user': {
            'id': 1
          }
        }

        if (vm.selected.resultype !== 1) {
          referenceDetail.panic = {
            'id': null
          };
          referenceDetail.normal = {
            'id': null
          };
        }
      }
      vm.selectedreference = referenceDetail.id;
      ModalService.showModal({
        templateUrl: 'editdata.html',
        controller: 'editdataController',
        inputs: {
          testname: vm.selected.code + " " + vm.selected.name,
          code: vm.selected.code,
          area: vm.selected.area.id,
          listunitage: vm.ListUnitAge,
          listrace: vm.ListRace,
          listgender: vm.ListGender,
          datareference: referenceDetail,
          racevalid: vm.racevalid,
          typeresult: vm.resultype,
          listliteralresult: vm.ListLiteralResult,
          decimalcant: vm.decimalCant
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {

          if (result.action === 'insert') {
            vm.save(result.datareference);
          } else if (result.action === 'cancel') {
            vm.getReferencevalues(vm.Idtest, vm.resultype, vm.decimalCant, vm.selected);
          }
        });
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
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.listreport = [];
      if (vm.listReferencevalues.length === 0) {
        vm.open = true;
      } else if (vm.resultype === 2) {
        vm.listReferencevalues.forEach(function (value, key) {
          var element = {
            'gender': ($filter('translate')('0000')) === 'esCo' ? vm.listReferencevalues[key].gender.esCo : vm.listReferencevalues[key].gender.enUsa,
            'normal': vm.listReferencevalues[key].normal.name,
            'panic': vm.listReferencevalues[key].panic.name,
            'comment': vm.listReferencevalues[key].comment,
            'username': vm.listReferencevalues[key].username
          }
          vm.listreport.push(element);
        });
        vm.variables = {
          'test': vm.listReferencevalues[0].test.name
        };
        vm.datareport = vm.listreport;
        vm.pathreport = '/report/configuration/test/referencevalues/referencevaluestext.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      } else {
        vm.listReferencevalues.forEach(function (value, key) {
          var element = {
            'gender': ($filter('translate')('0000')) === 'esCo' ? vm.listReferencevalues[key].gender.esCo : vm.listReferencevalues[key].gender.enUsa,
            'ageMin': vm.listReferencevalues[key].ageMin,
            'ageMax': vm.listReferencevalues[key].ageMax,
            'unitAgeText': vm.listReferencevalues[key].unitAgeText,
            'normalMin': vm.listReferencevalues[key].normalMin,
            'normalMax': vm.listReferencevalues[key].normalMax,
            'username': vm.listReferencevalues[key].username
          }
          vm.listreport.push(element);
        });

        vm.variables = {
          'test': vm.listReferencevalues[0].test.name
        };
        vm.datareport = vm.listreport;
        vm.pathreport = '/report/configuration/test/referencevalues/referencevaluesnumber.mrt';
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
    //** modal de los requeridos**//
    function modalrequired() {
      if ((vm.ListRace.length === 0 && vm.racevalid) || vm.ListLiteralResult.length === 0 || vm.listTest.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'referenceValuedependenceController',
          inputs: {
            configurationrace: vm.racevalid,
            hiderace: vm.ListRace.length,
            hideliteralresult: vm.ListLiteralResult.length,
            hidetest: vm.listTest.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Modal para la dependencias de la página*//
  function referenceValuedependenceController($scope, configurationrace, hiderace, hideliteralresult, hidetest, close) {
    $scope.configurationrace = configurationrace;
    $scope.hiderace = hiderace;
    $scope.hideliteralresult = hideliteralresult;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //** Modal para editar el valor de referencia*//
  function editdataController($scope, listunitage, listrace, listgender, datareference, racevalid,
    typeresult, listliteralresult, decimalcant, $filter, close, testname, code, area) {

    $scope.datareference = datareference;
    $scope.datareference.reportableMax = $scope.datareference.reportableMax === null ? '' : $scope.datareference.reportableMax;
    $scope.datareference.reportableMin = $scope.datareference.reportableMin === null ? '' : $scope.datareference.reportableMin;
    $scope.datareference.panicMax = $scope.datareference.panicMax === null ? '' : $scope.datareference.panicMax;
    $scope.datareference.panicMin = $scope.datareference.panicMin === null ? '' : $scope.datareference.panicMin;
    $scope.datareference.normalMax = $scope.datareference.normalMax === null ? '' : $scope.datareference.normalMax;
    $scope.datareference.normalMin = $scope.datareference.normalMin === null ? '' : $scope.datareference.normalMin;
    $scope.ListGender = listgender;
    $scope.ListRace = listrace;
    $scope.ListUnitAge = listunitage;
    $scope.ListLiteralResult = listliteralresult;
    $scope.racevalid = racevalid;
    $scope.typeresult = typeresult;
    $scope.changeRange = changeRange;
    $scope.valueMaxAge = datareference.unitAge === 1 ? 200 : 900;
    $scope.decimalCant = decimalcant;
    $scope.changeNorma = changeNorma;
    $scope.changeAge = changeAge;
    $scope.changePanic = changePanic;
    $scope.changeReportable = changeReportable;
    $scope.keyOnlyNumber = keyOnlyNumber;
    $scope.testname = testname;
    $scope.validatedtextunit = validatedtextunit;
    $scope.code = code;
    $scope.area = area;
    $scope.InvalidAge = false;
    $scope.InvalidNorma = false;
    $scope.InvalidPanic = false;
    $scope.InvalidReportable = false;
    $scope.disabledecimal = $scope.decimalCant === 0;

    // $scope.resultType = typeresult === 1;
    if ($scope.decimalCant > 0) {
      $scope.stepdecimal = '0.'
      for (var i = 0; i < $scope.decimalCant - 1; i++) {
        $scope.stepdecimal = $scope.stepdecimal + '0';
      }
      $scope.stepdecimal = $scope.stepdecimal + '1';
    } else {
      $scope.stepdecimal = '0'
    }
    $scope.stepdecimal = Number($scope.stepdecimal);

    // function keypressNum(e, inputCtrl){
    //     var reg = /[^0-9.]/g;
    //     var num = inputCtrl.$modelValue.replace(reg, '');
    //     if ((num.substr(-2, 1) === '.' || num.substr(-3, 1) === '.' ||
    //                  num.substr(-4, 1) === '.') && e.keyCode === 110) {
    //                 num = num.replace('.', '');
    //     }

    // }
    $scope.tinymceOptions = {
      resize: false,
      menubar: false,
      br_newline_selector: true,
      force_br_newlines: true,
      force_p_newlines: false,
      forced_root_block: false,
      convert_newlines_to_brs: true,
      language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      plugins: [
        '  anchor textcolor charmap lists wordcount code'
      ],
      toolbar: [
        'undo redo | formatselect | bold italic backcolor forecolor charmap | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent code'
      ]
    };


    function validatedtextunit() {
      $scope.validcontrol = false;
      if (datareference.comment !== undefined) {
        if (datareference.comment.length > 521) {
          $scope.validcontrol = true;
        }
      }
    }


    function keyOnlyNumber(e) {
      var expreg = new RegExp(/^[0-9]*\.?[0-9]*$/);
      var keyCode = e !== undefined ? (e.which || e.keyCode) : undefined;
      if (!expreg.test(String.fromCharCode(keyCode)) || (e.target.value.indexOf('.') !== -1 && String.fromCharCode(e.keyCode) === '.')) {
        //Detiene toda accion en la caja de texto
        event.preventDefault();
        return;
      }
    }

    function changeRange() {
      $scope.valueMaxAge = datareference.unitAge === 1 ? 200 : 900;
      datareference.ageMax = datareference.unitAge === 1 ? 200 : 365;
    }

    function changeAge() {
      if (datareference.ageMin !== '' && datareference.ageMax !== '' &&
        Number(datareference.ageMin) > Number(datareference.ageMax)) {
        $scope.messageAge = $filter('translate')('0541');
        $scope.InvalidAge = true;
      } else {
        $scope.messageAge = '';
        $scope.InvalidAge = false;
      }
    }

    function changeNorma() {
      if (datareference.normalMin === '' || datareference.normalMax === '') {
        datareference.reportableMin = '';
        datareference.reportableMax = '';
      }

      if ((datareference.normalMin !== '') && (datareference.normalMax !== '') &&
        (Number(datareference.normalMin) >= Number(datareference.normalMax))) {
        $scope.messageNorma = $filter('translate')('0542');
        $scope.InvalidNorma = true;
      } else if ((datareference.normalMin === '') && (datareference.normalMax === '')) {
        $scope.messageNorma = $filter('translate')('0543');
        $scope.InvalidNorma = true;
      } else {
        $scope.messageNorma = '';
        $scope.InvalidNorma = false;
      }

      changePanic();
    }

    function changePanic() {
      if ((datareference.normalMin === '') && (datareference.normalMax !== '') &&
        (datareference.panicMin !== '') && (datareference.panicMax !== '') &&
        (Number(datareference.panicMin) <= Number(datareference.normalMax))) {

        $scope.messagePanic = $filter('translate')('0544');
        $scope.InvalidPanic = true;
      } else if ((datareference.normalMin !== '') && (datareference.normalMax === '') &&
        (datareference.panicMin !== '') && (datareference.panicMax !== '') &&
        (Number(datareference.panicMax) >= Number(datareference.normalMin))) {
        $scope.messagePanic = $filter('translate')('0545');
        $scope.InvalidPanic = true;
      } else if ((datareference.panicMin !== '') && (datareference.panicMax !== '') &&
        (Number(datareference.panicMin) >= Number(datareference.panicMax))) {
        $scope.messagePanic = $filter('translate')('0546');
        $scope.InvalidPanic = true;
      } else if ((datareference.normalMin !== '') && (datareference.panicMin !== '') &&
        (Number(datareference.normalMin) <= Number(datareference.panicMin))) {
        $scope.messagePanic = $filter('translate')('0547');
        $scope.InvalidPanic = true;
      } else if ((datareference.normalMax !== '') && (datareference.panicMax !== '') &&
        (Number(datareference.normalMax) >= Number(datareference.panicMax))) {
        $scope.messagePanic = $filter('translate')('0548');
        $scope.InvalidPanic = true;
      } else if (((datareference.panicMin === '') && (datareference.panicMax !== '')) ||
        ((datareference.panicMin !== '') && (datareference.panicMax === ''))) {
        $scope.messagePanic = $filter('translate')('0549');
        $scope.InvalidPanic = true;
      } else {
        $scope.messagePanic = '';
        $scope.InvalidPanic = false;
      }
      changeReportable();
    }

    function changeReportable() {
      if (datareference.panicMin !== '' && (datareference.normalMin !== '') && datareference.reportableMin !== '' &&
        (Number(datareference.reportableMin) >= Number(datareference.panicMin))) {
        $scope.messageReportable = $filter('translate')('0550');
        $scope.InvalidReportable = true;
      } else if (datareference.panicMin === '' && (datareference.normalMin !== '') && datareference.reportableMin !== '' &&
        (Number(datareference.reportableMin) >= Number(datareference.normalMin))) {
        $scope.messageReportable = $filter('translate')('0551');
        $scope.InvalidReportable = true;
      } else if (datareference.panicMax !== '' && (datareference.normalMax !== '') && datareference.reportableMax !== '' &&
        (Number(datareference.reportableMax) <= Number(datareference.panicMax))) {
        $scope.messageReportable = $filter('translate')('0552');
        $scope.InvalidReportable = true;
      } else if (datareference.panicMax === '' && (datareference.normalMax !== '') && datareference.reportableMax !== '' &&
        (Number(datareference.reportableMax) <= Number(datareference.normalMax))) {
        $scope.messageReportable = $filter('translate')('0553');
        $scope.InvalidReportable = true;
      } else if ((datareference.reportableMin !== '') && (datareference.reportableMax !== '') &&
        (Number(datareference.reportableMin) >= Number(datareference.reportableMax))) {
        $scope.messageReportable = $filter('translate')('0554');
        $scope.InvalidReportable = true;
      } else if (((datareference.reportableMin === '') && (datareference.reportableMax !== '')) ||
        ((datareference.reportableMin !== '') && (datareference.reportableMax === ''))) {
        $scope.messageReportable = $filter('translate')('0555');
        $scope.InvalidReportable = true;
      } else {
        $scope.messageReportable = '';
        $scope.InvalidReportable = false;
      }
    }

    $scope.close = function (action) {
      close({
        action: action,
        datareference: $scope.datareference
      }, 700); // close, but give 500ms for bootstrap to animate
    };
  }
})();
