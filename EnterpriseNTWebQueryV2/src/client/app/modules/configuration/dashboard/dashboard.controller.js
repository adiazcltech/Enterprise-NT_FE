(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .filter('trust', ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };
    }])
    .controller('changepasswordCtrl', function ($uibModalInstance, userDS, localStorageService, $filter, logger) {
      var vm = this;
      vm.userchangepassword = { 'afterpassword': '', 'password1': '', 'password2': '' }
      vm.user = localStorageService.get('Enterprise_NT.authorizationData')
      vm.lettersize = vm.user.administrator === true ? 12 : 9;
      vm.administrator = vm.user.administrator === true;
      vm.strengthlabel = $filter('translate')('0148');
      vm.data = '';
      vm.color = "#999";
      vm.strength = "";
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.openreportzip = false;

      vm.colorbutton = localStorageService.get('Color');
      vm.keySecurityPolitics = localStorageService.get('SecurityPolitics') === "True" ? true : false;
      setTimeout(function () {
        document.getElementById("password1changepassword").focus();
      }, 500);

      vm.CheckStrngth = function (string) {
        if (vm.keySecurityPolitics) {
          vm.viewvalited = false;
          vm.strength0 = false;
          vm.strength1 = false;
          vm.strength2 = false;
          vm.strength3 = false;
          vm.strength4 = false;
          vm.strength = "";
          vm.save = false;
          vm.strengthlabel = $filter('translate')('0148');
          if (vm.userchangepassword.password1 === undefined) {
            vm.strengthlabel = $filter('translate')('0148');
            vm.data = '';
            vm.color = "#999";
            vm.strength = "**";
            vm.strength0 = true;
            vm.strength1 = true;
            vm.strength2 = true;
            vm.strength3 = true;
            vm.strength4 = true;
          }

          if (vm.userchangepassword.password1 !== undefined) {
            vm.data = '';
            vm.strengthlabel = $filter('translate')('0148');
            if (vm.userchangepassword.password1.length < vm.lettersize) {
              vm.strength0 = true;
              vm.strength = "**";
            }
            if (!new RegExp("[A-Z]").test(vm.userchangepassword.password1)) {
              vm.strength1 = true;
              vm.strength = "**";

            }
            if (!new RegExp("[a-z]").test(vm.userchangepassword.password1)) {
              vm.strength2 = true;
              vm.strength = "**";

            }
            if (!new RegExp("[0-9]").test(vm.userchangepassword.password1)) {
              vm.strength3 = true;
              vm.strength = "**";

            }
            if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.userchangepassword.password1)) {
              vm.strength4 = true;
              if (vm.administrator) {
                vm.strength = "**";
              }
            }

            var regex = new Array();
            regex.push("[A-Z]"); //Uppercase Alphabet.
            regex.push("[a-z]"); //Lowercase Alphabet.
            regex.push("[0-9]"); //Digit.
            regex.push("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])"); //Special Character.
            var passed = 0;
            //Validate for each Regular Expression.
            for (var i = 0; i < regex.length; i++) {
              if (new RegExp(regex[i]).test(vm.userchangepassword.password1)) {
                passed++;
              }
            }
            //Validate for length of Password.
            if (passed > 2 && vm.userchangepassword.password1.length >= vm.lettersize) {
              passed++;
            }
            //Display status.
            if (passed == 1) {
              vm.strengthlabel = $filter('translate')('0148');
              vm.color = "red";
              vm.data = '0';
            } else if (passed == 2) {
              vm.color = "orangered";
              vm.strengthlabel = $filter('translate')('0149');
              vm.data = '1';
            } else if (passed == 3) {
              vm.color = "orange";
              vm.strengthlabel = $filter('translate')('0150');
              vm.data = '2';
            } else if (passed == 4) {
              vm.color = "yellowgreen";
              vm.strengthlabel = $filter('translate')('0151');
              vm.data = '3';
            } else if (passed == 5) {
              vm.color = "green";
              vm.strengthlabel = $filter('translate')('0152');
              vm.data = '4';
            }
          }
        } else {
          vm.strength = "";
        }
      }
      vm.changepassword = function (form) {
        vm.loading = true;
        vm.viewvalited = false;
        vm.errorpasword = false;
        if (vm.strength === '' && vm.userchangepassword.password1 === vm.userchangepassword.password2) {
          var user = {
            "idUser": vm.user.id,
            "userName": vm.user.userName,
            "passwordOld": vm.userchangepassword.afterpassword,
            "passwordNew": vm.userchangepassword.password1,
            "type": vm.user.type
          }
          return userDS.changepasswordexpirit(user).then(function (data) {
            if (data.status === 200) {
              vm.loading = false;
              logger.success($filter('translate')('0098'));
              $uibModalInstance.dismiss('cancel');
            }
          }, function (error) {
            vm.loading = false;
            vm.viewvalited = false
            vm.errorpasword = false;
            error.data.errorFields.forEach(function (value) {
              var item = value.split('|');
              if (item[0] === '1') {
                vm.viewvalited = true
              }
              if (item[0] === '2') {
                vm.errorpasword = true
              }
            });
          })

        }
      };
      vm.cancel = function () {
        vm.save = false;
        $uibModalInstance.dismiss('cancel');
      };
    })
    .controller('dashboardController', dashboardController);
  dashboardController.$inject = ['localStorageService', '$rootScope', '$state', 'configurationDS', '$uibModal',
    '$filter', 'logger', 'orderDS', 'LZString', '$translate', 'common', '$scope', 'usertypesDS', '$sce', 'Idle', 'productVersion'];

  function dashboardController(localStorageService, $rootScope, $state, configurationDS, $uibModal,
    $filter, logger, orderDS, LZString, $translate, common, $scope, usertypesDS, $sce, Idle, productVersion) {

    var vm = this;
    vm.init = init;
    vm.title = 'Dashboard';
    $rootScope.NamePage = 'Dashboard';
    $rootScope.menu = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.arrayslist = arrayslist;
    vm.saveconfigurate = saveconfigurate;
    vm.record = "";
    vm.selectedOrder = '';
    vm.getseachdate = getseachdate;
    vm.getseach = getseach;
    vm.getselectorder = getselectorder;
    vm.viewcoment = viewcoment;
    vm.viewantibiogramt = viewantibiogramt;
    vm.dataorder = [];
    vm.getResultsHistory = getResultsHistory;
    vm.GraphicHistory = GraphicHistory;
    vm.Demographicskey = Demographicskey;
    vm.GraphicHistorydata = GraphicHistorydata;
    vm.getlistReportFile = getlistReportFile;
    vm.getlistidiome = getlistidiome;
    vm.getDemographicsALL = getDemographicsALL;
    vm.preliminary = preliminary;
    vm.end = end;
    vm.GraphicHistorycodense = GraphicHistorycodense;
    vm.windowOpenReport = windowOpenReport;
    vm.keyselectpatientid = keyselectpatientid;
    vm.gettypedocument = gettypedocument;
    vm.getListYear = getListYear;
    vm.keyselectname = keyselectname;
    vm.getOrderComplete = getOrderComplete;
    vm.searchOrderComplete = searchOrderComplete;
    vm.closed = closed;
    vm.getDemoConsultaWeb = getDemoConsultaWeb;
    vm.getuser = getuser;
    vm.refreshpatient = refreshpatient;
    vm.viewphoto = viewphoto;
    vm.dataorder = [];
    vm.selectall = selectall;
    vm.getprofiluser = getprofiluser;
    vm.searchsmall = searchsmall;
    vm.getselectordermini = getselectordermini;
    vm.selectallarea = selectallarea;
    vm.keyselect = keyselect;
    vm.lisIdiome = [];
    vm.listreports = [];
    vm.order = [];
    vm.numberorden = '';
    vm.disabledopenreportzip = true;
    vm.getArea = getArea;
    vm.validDateinit = validDateinit;
    vm.validDateend = validDateend;
    vm.getseachdateblur = getseachdateblur;

    vm.dataconfig = [
      {
        "key": "URL",//0
        "value": ""
      },
      {
        "key": "Color",//1
        "value": ""
      },
      {
        "key": "Titulo",//2
        "value": ""
      },
      {
        "key": "Logo",//3
        "value": ""
      },
      {
        "key": "Banner",//4
        "value": ""
      },
      {
        "key": "Informacion",//5
        "value": ""
      },
      {
        "key": "Informacion2",//6
        "value": ""
      },
      {
        "key": 'Historico',//7
        "value": false
      },
      {
        "key": "HistoricoGrafica",//8
        "value": false
      },
      {
        "key": "HistoricoCombinado",//9
        "value": false
      },
      {
        "key": "Captcha",//10
        "value": false
      },
      {
        "key": "CambioContraseña",//11
        "value": false
      },
      {
        "key": "ValidaSaldoPendiente",//12
        "value": false
      },
      {
        "key": "BusquedaOrden",//13
        "value": false
      },
      {
        "key": "MostrarConfidenciales",//14
        "value": false
      },
      {
        "key": "BloqueaPanicos",//15
        "value": ""
      },
      {
        "key": "MostrarResultado",//16
        "value": ""
      },
      {
        "key": "LlaveCaptcha",//17
        "value": ""
      },
      {
        "key": "ServiciosLISUrl",//18
        "value": ""
      },
      {
        "key": "PathFE",//19
        "value": ""
      },
      {
        "key": "ServidorCorreo",//20
        "value": ""
      },
      {
        "key": "TerminosCondiciones",//21
        "value": ""
      },
      {
        "key": "CuerpoEmail",//22
        "value": ""
      },
      {
        "key": "SmtpAuthUser",//23
        "value": ""
      },
      {
        "key": "SmtpHostName",//24
        "value": ""
      },
      {
        "key": "SmtpPasswordUser",//25
        "value": ""
      },
      {
        "key": "SmtpPort",//26
        "value": ""
      },
      {
        "key": "SmtpSSL",//27
        "value": ""
      },
      {
        "key": "SmtpProtocol",//28
        "value": ""
      },
      {
        "key": "directReportPrint",//29
        "value": false
      },
      {
        "key": "UrlSecurity",//30
        "value": ""
      },
      {
        "key": "FiltroRangoFecha",//31
        "value": false
      },
      {
        "key": "EmpaquetarOrdenesCliente",//32
        "value": false
      },
      {
        "key": "VerReporteResultados",//33
        "value": false
      },
      {
        "key": "VerNombreExamen",//34
        "value": false
      },
      {
        "key": "VerPreliminar",//35
        "value": true
      },
      {
        "key": "clientIdEmail",//36
        "value": ''
      },
      {
        "key": "authorityEmail",//37
        "value": ''
      },
      {
        "key": "clientSecretEmail",//38
        "value": ''
      }
    ]

    function loadtermsandConditions(string) {
      return $sce.trustAsHtml(string);
    }
    function closed() {
      Idle.unwatch();
      localStorageService.clearAll();
      $state.go('login');
    }
    function getListYear() {
      var yearquery = localStorageService.get('AniosConsultas');
      var dateMin = moment().year() - yearquery;
      var dateMax = moment().year();
      vm.listYear = [];
      vm.listYearorder = [];
      vm.listYearname = [];
      vm.listYearhistory = [];
      for (var i = dateMax; i >= dateMin; i--) {
        vm.listYear.push({ 'id': i, 'name': i });
      }
      vm.listYear.id = moment().year();
      vm.listYearorder.id = moment().year();
      vm.listYearname.id = moment().year();
      vm.listYearhistory.id = moment().year();
      if (vm.typedocument) {
        vm.gettypedocument();
      } else {
        vm.documentType = [{
          'id': 0,
          'name': 'Sin filtro'
        }]
        vm.documentType.id = 0;
      }
      vm.getArea();
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getAreasActive(auth.authToken, vm.urlLIS).then(function (data) {
        vm.getlistidiome();
        if (data.status === 200) {
          data.data[0] = {
            'id': 0,
            'name': $filter('translate')('0079')
          };
          vm.lisArea = data.data;
          vm.lisArea.id = 0;

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function keyselect($event, value) {
      var keyCode = $event.which || $event.keyCode;
      var expreg1 = new RegExp('^[*]$|^[0-9]*$');
      if (!expreg1.test(value + String.fromCharCode(keyCode))) {
        $event.preventDefault();
      }
    }
    function keyselectpatientid($event) {
      
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        if (vm.record !== '' && vm.record !== undefined) {
          vm.loading = true;
          vm.search = {
            'documentType': vm.documentType.id,
            'patientId': vm.record,
            'year': vm.listYearhistory.id,
            'area': vm.lisArea.id
          }
          vm.getseach();
        } else {
          vm.loading = false;
          logger.info("Digite una identificación");
        }
      }
    }
    function getselectordermini(order) {
      vm.selectedOrder = order.order;
    }
    function searchsmall() {
      if (vm.viewsmall === 1) {
        vm.getseachdate();
      } else if (vm.viewsmall === 2) {
        vm.keyselectpatientid();
      } else if (vm.viewsmall === 3) {
        vm.keyselectname();
      } else if (vm.viewsmall === 4) {
        vm.getOrderComplete();
      }
    }
    function keyselectname($event) {     
      if ($event === 1) {
        var keyCode = 13;
      } else {
        var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      }
      if (keyCode === 13) {
        vm.loading = false;
        vm.name1 = vm.name1 === undefined ? '' : vm.name1.toUpperCase();
        vm.name2 = vm.name2 === undefined ? '' : vm.name2.toUpperCase();
        vm.lastname = vm.lastname === undefined ? '' : vm.lastname.toUpperCase();
        vm.surName = vm.surName === undefined ? '' : vm.surName.toUpperCase();
        if (vm.name1 === '' && vm.name2 === '' && vm.lastname === '' && vm.surName === '') {
          logger.success($filter('translate')('0197'));
        } else {
          vm.search = {
            'name1': vm.name1,
            'name2': vm.name2,
            'lastName': vm.lastname,
            'surName': vm.surName,
            'year': vm.listYearname.id,
            'area': 0
          }
          vm.getseach();
        }
      }
    }
    function getOrderComplete($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.numberorden.length < vm.cantdigit) {
          vm.numberorden = vm.numberorden === '' ? 0 : vm.numberorden;
          vm.numberordensearch = vm.listYearorder.id + (common.getOrderComplete(vm.numberorden, vm.orderdigit)).substring(4);
          vm.numberorden = vm.numberordensearch.substring(4);
          vm.searchOrderComplete();

        } else if (vm.numberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYearorder.id + vm.numberorden;
          vm.searchOrderComplete();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }

    }
    function searchOrderComplete() {
      vm.search = {
        'order': vm.numberordensearch,
        'area': vm.lisArea.id
      }
      vm.getseach();
    }
    function gettypedocument() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getDocumentype(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.documentType = removedocumentType(data);
          vm.documentType.id = 0;
        } else {
          vm.documentType = [{
            'id': 0,
            'name': 'Sin filtro'
          }]
          vm.documentType.id = 0;
        }
      },
        function (error) {
          logger.error(error);
          $state.go('login');
        });

    }
    function removedocumentType(data) {
      var documentType = [{
        "id": 0,
        "name": 'Sin filtro'
      }]
      data.data.forEach(function (value) {
        var object = {
          id: value.id,
          name: value.name
        };
        documentType.push(object);
      });
      return documentType;
    }
    function Demographicskey() {
      if (vm.urlLIS !== '' && vm.urlLIS !== null) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return configurationDS.getDemographicskey(auth.authToken, vm.urlLIS, 'DemograficoTituloInforme').then(function (data) {
          if (data.status === 200) {
            vm.demographicTitle = data.data.value;
            vm.getDemographicsALL();
          }
        }, function (error) {
          $state.go('login');
          logger.error(error);
        });
      } else {
        logger.info('debe configurar la URL del LIS');
      }
    }
    function viewcoment(ob) {
      vm.test = ob.abbreviation;
      $('#modal-result-comment').modal('show');
    }
    function viewcoment(ob) {
      vm.test = ob.abbreviation;
      vm.comment = ob.resultComment.comment;
      $('#modal-result-comment').modal('show');
    }
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.viewsmall = 1;
        vm.administrator = localStorageService.get('Enterprise_NT.authorizationData').administrator;
        vm.loadtermsandConditions = loadtermsandConditions;
        vm.TermsConditions = localStorageService.get('TerminosCondiciones');
        vm.Information = localStorageService.get('Informacion');
        vm.Information2 = localStorageService.get('Informacion2');
        vm.logoview = localStorageService.get('Logo');
        vm.Bannerview = localStorageService.get('Banner');
        vm.color = localStorageService.get('Color') === '' ? 'rgb(112, 150, 222)' : localStorageService.get('Color');
        vm.branch = localStorageService.get('Entidad');
        vm.Title = localStorageService.get('Titulo');
        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.formatDategraphip = vm.formatDate === '' ? 'DD/MM/YYYY , h:mm:ss a' : vm.formatDate.toUpperCase() + ', h:mm:ss a';
        vm.BusquedaOrden = localStorageService.get('BusquedaOrden');
        vm.BusquedaOrden = vm.BusquedaOrden === 'True' || vm.BusquedaOrden === 'true' ? true : false;
        vm.viewpatient = localStorageService.get('Enterprise_NT.authorizationData')
        vm.typeuser = localStorageService.get('Enterprise_NT.authorizationData').type;
        var viewpreliminar=localStorageService.get('VerPreliminar')
        vm.viewpreliminar = vm.viewpatient.type === 4 && viewpreliminar === 'True' || vm.viewpatient.type === 4 &&  viewpreliminar === 'true'|| vm.viewpatient.type === 4 &&  viewpreliminar === ''|| vm.viewpatient.type === 4 &&  viewpreliminar === null ? true : false;
        vm.viewpatient = vm.viewpatient.type === 2 ? false : true;

        vm.Historico = localStorageService.get('Historico');
        vm.Historico = vm.Historico === 'True' || vm.Historico === 'true' ? true : false;
        vm.HistoricoGrafica = localStorageService.get('HistoricoGrafica');
        vm.HistoricoGrafica = vm.HistoricoGrafica === 'True' || vm.HistoricoGrafica === 'true' ? true : false;
        vm.HistoricoCombinado = localStorageService.get('HistoricoCombinado');
        vm.HistoricoCombinado = vm.HistoricoCombinado === 'True' || vm.HistoricoCombinado === 'true' ? true : false;
        vm.orderdigit = localStorageService.get('DigitosOrden');
        vm.cantdigit = parseInt(vm.orderdigit) + 4;
        vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
        vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;
        vm.typedocument = localStorageService.get('ManejoTipoDocumento');
        vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
        vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True' || localStorageService.get('DosNombresPaciente') === '';
        vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True' || localStorageService.get('DosApellidosPaciente') === '';
        vm.panicblock = localStorageService.get('BloqueaPanicos');
        vm.getpathReport = localStorageService.get('PathFE');
        vm.urlLIS = localStorageService.get('ServiciosLISUrl');
        vm.ImpresionDirectaReportes = localStorageService.get('directReportPrint') != 'false' ? true : false;
        vm.FiltroRangoFecha = localStorageService.get('FiltroRangoFecha') == 'true' ? true : false;
        vm.EmpaquetarOrdenesCliente = localStorageService.get('EmpaquetarOrdenesCliente') == 'true' && vm.typeuser === 3 ? true : false;
        vm.VerReporteResultados = localStorageService.get('VerReporteResultados') == 'true' ? true : false;
        vm.Viewnames = localStorageService.get('VerNombreExamen') == 'true' || localStorageService.get('VerNombreExamen') === 'True' ? true : false;
        
        vm.exts = ['.jpg', '.jpeg', '.png', '.pdf'];
        vm.extsToPrint = vm.exts.toString().replace(new RegExp('\\.', 'g'), ' -');
        vm.URL = localStorageService.get('URL');
        $scope.onChangeimage = function (e, fileList) {
          vm.validFile = true;
          if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileList[0].name)) {
            vm.validFile = false;
            logger.warning('Formato de archivo incorrecto');
          }
        };
        $scope.$watch('vm.Temporal', function () {
          if (vm.Temporal !== undefined && vm.validFile) {
            vm.dataconfig[3].value = 'data:' + vm.Temporal[0].filetype + ';base64,' + vm.Temporal[0].base64;
            vm.logo = vm.Temporal[0].filename;
          }
        });
        $scope.onChangeimage1 = function (e, fileList) {
          vm.validFile = true;
          if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileList[0].name)) {
            vm.validFile = false;
            logger.warning('Formato de archivo incorrecto');
          }
        };
        $scope.$watch('vm.Temporal1', function () {
          if (vm.Temporal1 !== undefined && vm.validFile) {
            vm.dataconfig[4].value = 'data:' + vm.Temporal1[0].filetype + ';base64,' + vm.Temporal1[0].base64;
            vm.Banner = vm.Temporal1[0].filename;
          }
        });
        vm.options = {
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          legend: {
            data: [$filter('translate')('0115'), $filter('translate')('0129'), $filter('translate')('0130')]
          },
          xAxis: {
            name: $filter('translate')('0131'),
            nameLocation: 'middle',
            nameGap: '30',
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            name: $filter('translate')('0115'),
            type: 'value',
            nameGap: '10',
          }
        }
        vm.optionsgraphgroup = {
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          legend: {
            data: [],
            orient: 'vertical',
            x: 'left',
            y: 'bottom',
            z: 10,
            zlevel: 10,
            itemHeight: 10,
            itemMarginTop: 2,
            itemMarginBottom: 2
          },
          grid: {
            y: 45,
            x: 45,
            y2: 100
          },
          xAxis: {
            name: $filter('translate')('0131'),
            nameLocation: 'middle',
            nameGap: '30',
            type: 'value',
            boundaryGap: false,
            inverse: true,
            axisLine: { onZero: false }


          },
          yAxis: {
            name: $filter('translate')('0115'),
            type: 'value',
            axisLine: { onZero: false }

          }
        }
        tinymce.PluginManager.add("user", function (editor) {
          // Add a button that opens a window
          editor.addButton("user", {
            tooltip: 'Añadir usuario',
            icon: "user",
            onclick: function () {
              editor.insertContent("||USER||");
            },
          });
          // Adds a menu item to the tools menu
          editor.addMenuItem("user", {
            text: 'Añadir usuario',
            context: "tools",
            onclick: function () {
              editor.insertContent("||USER||");
            },
          });
        });
        tinymce.PluginManager.add("linkuser", function (editor) {
          // Add a button that opens a window
          editor.addButton("linkuser", {
            tooltip: "Añadir link",
            icon: "orientation",
            onclick: function () {
              editor.insertContent("<a href='||LINK||'>Link para Cambiar contraseña</a>");
            },
          });
          // Adds a menu item to the tools menu
          editor.addMenuItem("linkuser", {
            text: "Añadir link",
            context: "tools",
            onclick: function () {
              editor.insertContent("<a href='||LINK||'>Link para Cambiar contraseña</a>");
            },
          });
        });


        tinymce.PluginManager.add("date", function (editor) {
          // Add a button that opens a window
          editor.addButton("date", {
            tooltip: "Añadir fecha",
            icon: "paste",
            onclick: function () {
              editor.insertContent("||DATE||");
            },
          });
          // Adds a menu item to the tools menu
          editor.addMenuItem("date", {
            text: "Añadir fecha",
            context: "tools",
            onclick: function () {
              editor.insertContent("||DATE||");
            },
          });
        });
        tinymce.PluginManager.add("Laboratoty", function (editor) {
          // Add a button that opens a window
          editor.addButton("Laboratoty", {
            tooltip: "Añadir laboratorio",
            icon: "drag",
            onclick: function () {
              editor.insertContent("||LAB||");
            },
          });
          // Adds a menu item to the tools menu
          editor.addMenuItem("Laboratoty", {
            text: "Añadir laboratorio",
            context: "tools",
            onclick: function () {
              editor.insertContent("||LAB||");
            },
          });
        });
        vm.tinymceOptions = {
          skin_url: 'assets/skins/tinymce/material_design',
          height: 200,
          language: $filter('translate')('0000'),
          plugins: [
            ' user linkuser date Laboratoty advlist image lists charmap print preview hr anchor textcolor',
            'searchreplace wordcount visualblocks visualchars  fullscreen insertdatetime nonbreaking',
            'save table contextmenu directionality help paste'
          ],
          toolbar: [
            ' user linkuser date Laboratoty | bold italic underline | fontselect fontsizeselect | preview image | forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent | styleselect '
          ],
          image_title: true,
          paste_data_images: true,
          file_picker_types: 'image',
          automatic_uploads: true,
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
              var file = this.files[0];
              var reader = new FileReader();
              reader.onload = function () {
                var base64 = reader.result;
                if (meta.filetype == 'image') {
                  cb(base64, { title: file.name });
                }
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }
        };
        vm.customMenu = {
          menubar: false,
          language: 'es',
          plugins: [
            'link',
            'lists',
            'autolink',
            'anchor',
            'textcolor',
            'charmap'

          ],
          toolbar: [
            'undo redo | bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
          ],
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean'
        };
        vm.init();
      }
    }  
    function validDateinit() {
      if (vm.dateseachinit === undefined || vm.dateseachinit === null) {
        vm.dateseachinit = vm.dateseachend;
        vm.dateOptionsend = {
          formatYear: vm.formatDate,
          minDate: vm.dateseachinit,
          maxDate: new Date()
        };
      } else {
        if (vm.dateseachend === undefined || vm.dateseachend === null) {
          vm.dateseachend = vm.dateseachinit;
          vm.dateOptionsinit = {
            formatYear: vm.formatDate,
            maxDate: vm.dateseachend
          };
        }
        vm.dateOptionsend = {
          formatYear: vm.formatDate,
          minDate: vm.dateseachinit,
          maxDate: new Date()
        };
      }
      vm.getseachdateblur();
    }    
    function validDateend() {
      if (vm.dateseachend === undefined || vm.dateseachend === null) {
        vm.dateseachend = vm.dateseachinit;
        vm.dateOptionsinit = {
          formatYear: vm.formatDate,
          maxDate: vm.dateseachend
        };
      } else {
        if (vm.dateseachinit === undefined || vm.dateseachinit === null) {
          vm.dateseachinit = vm.dateseachend;
          vm.dateOptionsend = {
            formatYear: vm.formatDate,
            minDate: vm.dateseachinit,
            maxDate: new Date()
          };
        }
        vm.dateOptionsinit = {
          formatYear: vm.formatDate,
          maxDate: vm.dateseachend
        };
      }
      vm.getseachdateblur();
    }   
    function getseachdateblur() {

      if (vm.FiltroRangoFecha) {
        if (vm.dateseachinit !== null && vm.dateseachinit !== undefined && vm.dateseachend !== null && vm.dateseachend !== undefined) {
          vm.search = {
            'dateNumberInit': moment(vm.dateseachinit).format('YYYYMMDD'),
            'dateNumberEnd': moment(vm.dateseachend).format('YYYYMMDD'),
            'statetest': vm.statetest,
            'area': vm.lisArea === undefined ? 0 : vm.lisArea.id
          }
          vm.getseach();
        }
      }
      else {
        if (vm.dateseach !== null && vm.dateseach !== undefined) {
          vm.search = {
            'dateNumber': moment(vm.dateseach).format('YYYYMMDD'),
            'area': vm.lisArea === undefined ? 0 : vm.lisArea.id
          }
          vm.getseach();
        }
      }
    }
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfiguration(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.arrayslist(data.data);
        }
      }, function (error) {
        logger.error(error);
        $state.go('login');
      });
    }
    function getseachdate() {

      if (vm.FiltroRangoFecha) {
        if (vm.dateseachinit !== null && vm.dateseachinit !== undefined) {
          vm.search = {
            'dateNumberInit': moment(vm.dateseachinit).format('YYYYMMDD'),
            'dateNumberEnd': moment(vm.dateseachend).format('YYYYMMDD'),
            'statetest': vm.statetest,
            'area': vm.lisArea.id
          }
          vm.getseach();
        } else {
          logger.info($filter('translate')('0208'));
        }
      }
      else {
        if (vm.dateseach !== null && vm.dateseach !== undefined) {
          vm.search = {
            'dateNumber': moment(vm.dateseach).format('YYYYMMDD'),
            'area': vm.lisArea.id
          }
          vm.getseach();
        } else {
          logger.info($filter('translate')('0208'));
        }
      }
    }
    function getprofiluser() {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modalchangepassword.html',
        controller: 'changepasswordCtrl',
        controllerAs: 'vm',
        resolve: {}
      });
    }
    function getseach() {
      vm.order = [];
      vm.orderTests = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.search.onlyValidated = vm.onlyValidated;
      return orderDS.getfilterorders(auth.authToken, vm.search).then(function (data) {
        vm.loading = false;
        if (data.status === 200) {
          var fechaInicio = new Date(moment(vm.dateseachinit).format('YYYY-MM-DD')).getTime();
          var fechaFin = new Date(moment(vm.dateseachend).format('YYYY-MM-DD')).getTime();
          var diff = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
          vm.disabledopenreportzip = diff > 31;
          vm.order = _.orderBy(data.data, ['order'], ['desc']);
        } else {
          logger.info($filter('translate')('0212'));
          vm.order = [];
        }
      }, function (error) {
        vm.loading = false;
        logger.error(error);
        $state.go('login');
      });
    }
    function getselectorder(order, download) {
      vm.loading = true;
      vm.selectedOrder = order.order;
      if (vm.VerReporteResultados) {
        var a = document.getElementById("previreport");
        a.type = 'application/pdf';
        a.src = '';
        vm.download = '';
        vm.end()
      } else {
        vm.download = "";
        vm.dataorder = [];
        vm.download = download;
        vm.patient = order.patientIdDB;
        vm.patientname = order.name1 + ' ' + order.name2 + ' ' + order.lastName + ' ' + order.surName;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.orderTests = [];
        return orderDS.getordersresult(auth.authToken, order.order, vm.lisArea.id).then(function (data) {
          if (data.status === 200) {
            if (vm.onlyValidated) {
              data.data = _.filter(data.data, function (o) { return o.state >= 4 })
            }
            vm.dataorder = data.data;
            if (vm.panicblock === '2') {
              vm.validorder = $filter('filter')(data.data, { pathology: '!0' }).length
              if (vm.validorder === 0) {
                vm.orderTests = _.groupBy(data.data, 'areaName');
                for (var propiedad in vm.orderTests) {
                  if (vm.orderTests.hasOwnProperty(propiedad)) {
                    if (vm.orderTests[propiedad].length !== 0) {
                      var orderprofil = _.groupBy(_.clone(vm.orderTests[propiedad]), 'profileId');
                      var completedata = [];
                      angular.forEach(orderprofil, function (itemprofil) {
                        itemprofil = _.orderBy(itemprofil, 'profileId');
                        angular.forEach(itemprofil, function (itemi) {
                          itemi.viewprofil = false;
                          completedata.push(itemi);
                        });

                        if (itemprofil[0].profileId !== 0) {
                          var perfil = {
                            profileId: itemprofil[0].profileId,
                            profileName: itemprofil[0].profileName,
                            grantAccess: itemprofil[0].grantAccess,
                            grantValidate: itemprofil[0].grantValidate,
                            printSort: -1,
                            viewprofil: true,
                            selecprofil: false
                          };
                          completedata.unshift(perfil);
                        }
                      });

                    }
                    vm.orderTests[propiedad] = _.orderBy(completedata, ['profileId', 'printSort'], ['asc', 'asc']);
                    if (vm.ImpresionDirectaReportes) {
                      vm.end();
                    }

                  }
                }
              }
            }
            else {
              vm.orderTests = _.groupBy(data.data, 'areaName');
              for (var propiedad in vm.orderTests) {
                if (vm.orderTests.hasOwnProperty(propiedad)) {
                  if (vm.orderTests[propiedad].length !== 0) {
                    var orderprofil = _.groupBy(_.clone(vm.orderTests[propiedad]), 'profileId');
                    var completedata = [];
                    angular.forEach(orderprofil, function (itemprofil) {
                      itemprofil = _.orderBy(itemprofil, 'profileId');
                      angular.forEach(itemprofil, function (itemi) {
                        itemi.viewprofil = false;
                        completedata.push(itemi);
                      });
                      if (itemprofil[0].profileId !== 0) {
                        var perfil = {
                          profileId: itemprofil[0].profileId,
                          profileName: itemprofil[0].profileName,
                          printSort: -1,
                          viewprofil: true,
                          selecprofil: false
                        };
                        completedata.unshift(perfil);
                      }
                    });

                  }
                  vm.orderTests[propiedad] = _.orderBy(completedata, ['profileId', 'printSort'], ['asc', 'asc']);
                  if (vm.ImpresionDirectaReportes) {
                    vm.end();
                  }
                }
              }
            }
            vm.loading = false;
          }
        }, function (error) {
          vm.loading = false;
          logger.error(error);
          $state.go('login');
        });
      }
    }
    function selectall(obj, data, test, type) {
      if (type === 1) {
        test.forEach(function (value) {
          if (value.profileId === obj.profileId && !value.viewprofil) {
            if (value.resultType === 1) {
              value.printg = data;
            }
          }
        });
      } else if (type === 2) {
        test.forEach(function (value) {
          if (value.profileId === obj.profileId && !value.viewprofil) {
            value.printd = data;
          }
        });
      } else {
        test.forEach(function (value) {
          if (value.profileId === obj.profileId && !value.viewprofil) {
            if (value.resultType === 1) {
              value.printc = data;
            }
          }
        });
      }
    }
    function selectallarea(obj, data, test, type) {
      if (type === 1) {
        test.forEach(function (value) {
          if (value.viewprofil) {
            value.printgall = data;
          } else {
            if (value.resultType === 1) {
              value.printg = data;
            }
          }
        });
      } else if (type === 2) {
        test.forEach(function (value) {
          if (value.viewprofil) {
            value.printdall = data;
          } else {
            value.printd = data;
          }
        });
      } else {
        test.forEach(function (value) {
          if (value.viewprofil) {
            value.printcall = data;
          } else {
            if (value.resultType === 1) {
              value.printc = data;
            }
          }
        });
      }
    }
    function getDemoConsultaWeb() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getwebquery(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.demoname = data.data;
        }
      }, function (error) {
        logger.error(error);
        $state.go('login');
      });
    }
    function getuser() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return usertypesDS.getusertype(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            if (value.quantityOrder === 0) {
              value.quantityOrder = "*";
            }
          });
          vm.datauser = data.data;
          vm.onlyValidated = _.filter(vm.datauser, function (o) { return o.type === vm.typeuser })[0].onlyValidated;

          console.log(vm.onlyValidated)

        }
      }, function (error) {
        logger.error(error);
        $state.go('login');
      });
    }
    function arrayslist(data) {
      vm.Doctor = $filter('translate')('0075');
      vm.Patient = $filter('translate')('0076');
      vm.Customer = $filter('translate')('0077');
      vm.Laboratory = $filter('translate')('0078');
      vm.Rate = $filter('translate')('0200');
      vm.All = $filter('translate')('0079');
      if (localStorageService.get('ManejoDemograficoConsultaWeb') === 'True') {
        vm.viewdemogra = true;
        vm.getDemoConsultaWeb();
      }
      vm.getuser();
      vm.logo = "";
      vm.Banner = "";
      var config = JSON.parse(atob(unescape(encodeURIComponent(data[0].value))));

      config.forEach(function (value, key) {
        value.key = atob(unescape(encodeURIComponent(value.key)));
        value.value = atob(unescape(encodeURIComponent(value.value)));
        if (value.key === 'URL' && value.origin === 1) {
          vm.dataconfig[0].value = value.value;
        }
        if (value.key === 'Color' && value.origin === 1) {
          vm.dataconfig[1].value = value.value;
        }
        if (value.key === 'Titulo' && value.origin === 1) {
          vm.dataconfig[2].value = value.value;
        }
        if (value.key === 'logo' && value.origin === 1) {
          vm.dataconfig[3].value = value.value;
          if (value.value !== '') {
            vm.Banner = 'corporateBanner.png';
          }
        }
        if (value.key === 'Banner' && value.origin === 1) {
          vm.dataconfig[4].value = value.value;
          if (value.value !== '') {
            vm.logo = 'corporateLogo.png';
          }
        }
        if (value.key === 'Informacion' && value.origin === 1) {
          vm.dataconfig[5].value = value.value;
        }
        if (value.key === 'Informacion2' && value.origin === 1) {
          vm.dataconfig[6].value = value.value;
        }
        if (value.key === 'Historico' && value.origin === 1) {
          vm.dataconfig[7].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'HistoricoGrafica' && value.origin === 1) {
          vm.dataconfig[8].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'HistoricoCombinado' && value.origin === 1) {
          vm.dataconfig[9].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'Captcha' && value.origin === 1) {
          vm.dataconfig[10].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'CambioContraseña' && value.origin === 1) {
          vm.dataconfig[11].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'ValidaSaldoPendiente' && value.origin === 1) {
          vm.dataconfig[12].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'BusquedaOrden' && value.origin === 1) {
          vm.dataconfig[13].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'MostrarConfidenciales' && value.origin === 1) {
          vm.dataconfig[14].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'BloqueaPanicos' && value.origin === 1) {
          vm.dataconfig[15].value = value.value;
        }
        if (value.key === 'MostrarResultado' && value.origin === 1) {
          vm.dataconfig[16].value = value.value;
        }
        if (value.key === 'LlaveCaptcha' && value.origin === 1) {
          vm.dataconfig[17].value = value.value;
        }
        if (value.key === 'ServiciosLISUrl' && value.origin === 1) {
          vm.dataconfig[18].value = value.value;
        }
        if (value.key === 'PathFE' && value.origin === 1) {
          vm.dataconfig[19].value = value.value;
        }
        if (value.key === 'ServidorCorreo' && value.origin === 1) {
          vm.dataconfig[20].value = value.value;
        }
        if (value.key === 'TerminosCondiciones' && value.origin === 1) {
          vm.dataconfig[21].value = value.value;
        }
        if (value.key === 'CuerpoEmail' && value.origin === 1) {
          vm.dataconfig[22].value = value.value;
        }
        if (value.key === 'SmtpAuthUser' && value.origin === 1) {
          vm.dataconfig[23].value = value.value;
        }
        if (value.key === 'SmtpHostName' && value.origin === 1) {
          vm.dataconfig[24].value = value.value;
        }
        if (value.key === 'SmtpPasswordUser' && value.origin === 1) {
          vm.dataconfig[25].value = value.value;
        }
        if (value.key === 'SmtpPort' && value.origin === 1) {
          vm.dataconfig[26].value = value.value;
        }
        if (value.key === 'SmtpSSL' && value.origin === 1) {
          vm.dataconfig[27].value = value.value;
        }
        if (value.key === 'SmtpProtocol' && value.origin === 1) {
          vm.dataconfig[28].value = value.value;
        }
        if (value.key === 'directReportPrint' && value.origin === 1) {
          vm.dataconfig[29].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        if (value.key === 'UrlSecurity' && value.origin === 1) {
          vm.dataconfig[30].value = value.value;
        }
        if (value.key === 'FiltroRangoFecha' && value.origin === 1) {
          vm.dataconfig[31].value = value.value;
        }
        if (value.key === 'EmpaquetarOrdenesCliente' && value.origin === 1) {
          vm.dataconfig[32].value = value.value;
        }
        if (value.key === 'VerReporteResultados' && value.origin === 1) {
          vm.dataconfig[33].value = value.value.toLowerCase() === 'false' ? false : true;
        }

        if (value.key === 'VerNombreExamen' && value.origin === 1) {
          vm.dataconfig[34].value = value.value.toLowerCase() === 'false' ? false : true;
        }
        
        if (value.key === 'VerPreliminar' && value.origin === 1) {
          vm.dataconfig[35].value = value.value.toLowerCase() === 'false' ? false : true;
        }

        if (value.key === 'clientIdEmail' && value.origin === 1) {
          vm.dataconfig[36].value =  value.value;
        }

        if (value.key === 'authorityEmail' && value.origin === 1) {
          vm.dataconfig[37].value =  value.value;
        }
        if (value.key === 'clientSecretEmail' && value.origin === 1) {
          vm.dataconfig[38].value =  value.value;
        }
      });
      $('#controlConfigurationModal').modal('show');
      vm.loading = false;
    }
    function saveconfigurate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (vm.dataconfig[1].value !== '') {
        if (vm.dataconfig[1].value.search('#') === -1) {
          vm.dataconfig[1].value = '#' + vm.dataconfig[1].value;
        }
      }
      return configurationDS.updateConfiguration(auth.authToken, vm.dataconfig).then(function (data) {
        if (data.status === 200) {
          vm.datauser.forEach(function (value, key) {
            if (value.image !== '') {
              if (value.image[0].base64 !== undefined) {
                value.image = value.image[0].base64
              }
            }
            if (value.quantityOrder === "*") {
              value.quantityOrder = 0;
            }
          });
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return usertypesDS.updateusertype(auth.authToken, vm.datauser).then(function (data) {
            if (data.status === 200) {
              return configurationDS.getConfiguration(auth.authToken).then(function (data) {
                if (data.status === 200) {
                  vm.arrayslist(data.data);
                  logger.success($filter('translate')('0022'));
                  $('#controlConfigurationModal').modal('hide');

                  var config = JSON.parse(atob(unescape(encodeURIComponent(data.data[0].value))));
                  config.forEach(function (value, key) {
                    /*  localStorageService.set(value.key, value.value); */
                    value.key = atob(unescape(encodeURIComponent(value.key)));
                    value.value = atob(unescape(encodeURIComponent(value.value)));
                  });

                  vm.TermsConditions = $filter('filter')(config, { key: 'TerminosCondiciones' }, true)[0].value;
                  vm.Information = $filter("filter")(config, function (e) { return e.key === 'Informacion' })[0].value;
                  vm.Information2 = $filter("filter")(config, function (e) { return e.key === 'Informacion2' })[0].value;
                  vm.logoview = $filter('filter')(config, { key: 'Logo' }, true)[0].value;;
                  vm.Bannerview = $filter('filter')(config, { key: 'Banner' }, true)[0].value;
                  vm.color = $filter("filter")(config, function (e) { return e.key === 'Color' })[0].value;
                  vm.color = vm.color === '' ? 'rgb(112, 150, 222)' : vm.color;
                  vm.branch = $filter("filter")(config, function (e) { return e.key === 'Entidad' })[0].value;
                  vm.Historico = $filter("filter")(config, function (e) { return e.key === 'Historico' })[0].value;
                  vm.Historico = vm.Historico === 'True' || vm.Historico === 'true' ? true : false;
                  vm.HistoricoGrafica = $filter("filter")(config, function (e) { return e.key === 'HistoricoGrafica' })[0].value;
                  vm.HistoricoGrafica = vm.HistoricoGrafica === 'True' || vm.HistoricoGrafica === 'true' ? true : false;
                  vm.HistoricoCombinado = $filter("filter")(config, function (e) { return e.key === 'HistoricoCombinado' })[0].value;
                  vm.HistoricoCombinado = vm.HistoricoCombinado === 'True' || vm.HistoricoCombinado === 'true' ? true : false;
                  vm.urlLIS = $filter("filter")(config, function (e) { return e.key === 'ServiciosLISUrl' })[0].value;
                  vm.getpathReport = $filter("filter")(config, function (e) { return e.key === 'PathFE' })[0].value;
                  vm.panicblock = $filter("filter")(config, function (e) { return e.key === 'BloqueaPanicos' })[0].value;
                  vm.BusquedaOrden = $filter("filter")(config, function (e) { return e.key === 'BusquedaOrden' })[0].value;
                  vm.ImpresionDirectaReportes = $filter("filter")(config, function (e) { return e.key === 'directReportPrint' })[0].value == 'true' ? true : false;
                  vm.FiltroRangoFecha = $filter("filter")(config, function (e) { return e.key === 'FiltroRangoFecha' })[0].value == 'true' ? true : false;
                  vm.EmpaquetarOrdenesCliente = $filter("filter")(config, function (e) { return e.key === 'EmpaquetarOrdenesCliente' })[0].value == 'true' ? true : false;
                  vm.VerReporteResultados = $filter("filter")(config, function (e) { return e.key === 'VerReporteResultados' })[0].value == 'true' ? true : false;
                  vm.Viewnames = $filter("filter")(config, function (e) { return e.key === 'VerNombreExamen' })[0].value == 'true' ? true : false;
                  vm.viewpreliminar = $filter("filter")(config, function (e) { return e.key === 'VerPreliminar' })[0].value == 'true' ? true : false;
                  vm.BusquedaOrden = vm.BusquedaOrden === 'True' || vm.BusquedaOrden === 'true' ? true : false;
                }
              }, function (error) {
                logger.error(error);
                $state.go('login');
              });
            }
          }, function (error) {
            logger.error(error);
            $state.go('login');
          });
        }
      }, function (error) {
        logger.error(error);
        $state.go('login');
      });
    }
    function viewphoto(data) {
      if (data.image === '') {
        logger.info('No hay imagen asociada a este perfil');
      } else {
        if (data.image[0].base64 !== undefined) {
          vm.imageprofil = data.image[0].base64
        } else {
          vm.imageprofil = data.image
        }
        $('#profileimage').modal('show');
      }

    }
    function init() {
      vm.getListYear();
      vm.getuser();
      vm.Demographicskey();
      vm.version = productVersion.webconsultation;
      vm.dateseach = new Date();
      vm.viewtabpatient = '0';
      vm.dateseachinit = new Date();
      vm.dateseachinit.setDate(vm.dateseachinit.getDate() - 30);
      vm.dateseachend = new Date();
      vm.dateOptionsinit = {
        formatYear: vm.formatDate,
        maxDate: vm.dateseachend
      };
      vm.dateOptionsend = {
        formatYear: vm.formatDate,
        minDate: vm.dateseachinit,
        maxDate: new Date()
      };
      if (!vm.viewpatient) {
        vm.search = {
          'dateNumber': null,
          'area': 0
        }
        vm.getseach();
      }
    }
    function refreshpatient() {
      vm.search = {
        'dateNumber': null,
        'area': vm.lisArea.id
      }
      vm.getseach();
    }
    function getlistReportFile1() {
      vm.listreports = [{ "name": "reportprintedorders.mrt" }, { "name": "reportprintedorders1.mrt" }, { "name": "reports - copia (2).mrt" }, { "name": "reports - copia.mrt" }, { "name": "reports.mrt" }, { "name": "reports1.mrt" }, { "name": "reports11.mrt" }, { "name": "reports15.mrt" }, { "name": "reports2.mrt" }, { "name": "reports55.mrt" }, { "name": "reports9.mrt" }, { "name": "reportsACT.mrt" }, { "name": "reportsOLD.mrt" }, { "name": "reportsP.mrt" }, { "name": "reportspru.mrt" }, { "name": "reports_.mrt" }, { "name": "reports_backup.mrt" }, { "name": "reports_old.mrt" }, { "name": "reports_OLD2.mrt" }, { "name": "reports_Sede_01.mrt" }, { "name": "reports_Sede_02.mrt" }, { "name": "reports_Sede_03.mrt" }, { "name": "reports_Sede_06.mrt" }, { "name": "reports_Sede_12.mrt" }, { "name": "reports__.mrt" }]
    }
    function getlistReportFile() {
      //  vm.getpathReport='D:/Repositorios/FE Udea/02_EnterpriseNT_FE\EnterpriseNTLaboratory'
      if (location.href.search('http://localhost:3000') !== -1) {
        //Local
        var parameters = {
          pathReport: vm.getpathReport + '/src/client/Report/reportsandconsultations/reports',
          report: './src/client/reports'
        };
      } else {
        //publicación
        var parameters = {
          pathReport: vm.getpathReport + '/public/Report/reportsandconsultations/reports',
          report: './public/reports'
        };
      }
      configurationDS.getlistReportFile(parameters).then(function (response) {
        if (response.status === 200) {
          if (response.data == '2') {
            vm.listreports = [];
            logger.info("EL path para los reportes esta mal configurado consulte con el administrador");
          } else {
            vm.listreports = response.data;
          }
        } else {
          vm.listreports = [];
        }
      }, function (error) {
        return false;
      });
    }
    function getlistidiome() {
      //   vm.getpathReport='D:/Repositorios/FE Udea/02_EnterpriseNT_FE\EnterpriseNTLaboratory'
      if (vm.getpathReport !== '' && vm.getpathReport !== null) {
        var pathReport;
        if ($filter('translate')('0000') === 'es') {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-es.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-es.json';
          }
        } else {
          if (location.href.search('http://localhost:3000') !== -1) {
            //Local
            pathReport = vm.getpathReport + '/src/client/languages/locale-en.json';
          } else {
            //publicación
            pathReport = vm.getpathReport + '/public/languages/locale-en.json';
          }
        }
        var parameters = {
          pathReport: pathReport,
        };
        vm.getlistReportFile();
        configurationDS.getlistidiome(parameters).then(function (response) {
          if (response.status === 200) {
            if (response.data == '2') {
              vm.lisIdiome = [];
              logger.info("EL path para los reportes esta mal configurado consulte con el administrador");
            } else {
              vm.lisIdiome = response.data;
            }
          } else {
            vm.lisIdiome = [];
          }
        }, function (error) {
          return false;
        });
      } else {
        logger.info($filter('translate')('0195'));
      }
    }
    function getDemographicsALL() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (parseInt(vm.demographicTitle) !== 0) {
        return configurationDS.getDemographicsALL(auth.authToken, vm.urlLIS).then(function (data) {

          vm.demographicTemplate = _.filter(data.data, function (v) {
            return v.id === parseInt(vm.demographicTitle);
          })[0];
          vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          vm.referenceDemographic = vm.demographicTemplate.name;

          if (parseInt(vm.demographicTitle) < 0) {
            switch (parseInt(vm.demographicTitle)) {
              case -1:
                vm.demographicTemplate.name = $filter('translate')('0198');
                vm.referenceDemographic = 'account';
                break; //Cliente
              case -2:
                vm.demographicTemplate.name = $filter('translate')('0199');
                vm.referenceDemographic = 'physician';
                break; //Médico
              case -3:
                vm.demographicTemplate.name = $filter('translate')('0200');
                vm.referenceDemographic = 'rate';
                break; //Tarifa
              case -4:
                vm.demographicTemplate.name = $filter('translate')('0201');
                vm.referenceDemographic = 'type';
                break; //Tipo de orden
              case -5:
                vm.demographicTemplate.name = $filter('translate')('0003');
                vm.referenceDemographic = 'branch';
                break; //Sede
              case -6:
                vm.demographicTemplate.name = $filter('translate')('0202');
                vm.referenceDemographic = 'service';
                break; //Servicio
              case -7:
                vm.demographicTemplate.name = $filter('translate')('0203');
                vm.referenceDemographic = 'race';
                break; //Raza
            }
            vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          }

        }, function (error) {
          logger.error(error);
          $state.go('login');
        });
      } else {
        vm.demographicTemplate = null;
        vm.nameDemographic = 'reports';
      }
    }
    function GraphicHistory() {
      if (vm.dataorder.length !== 0) {
        vm.testgraphig = [];
        for (var propiedad in vm.orderTests) {
          var valores = $filter("filter")(vm.orderTests[propiedad], function (e) {
            return e.printg === true;
          })
          if (valores.length !== 0) {
            vm.testgraphig = _.concat(vm.testgraphig, valores);
          }
        }
        if (vm.testgraphig.length === 0) {
          logger.info("Seleccione los examenes que desea ver el historico");
        } else {
          vm.getResultsHistory(1);
        }
      }
    }
    function GraphicHistorydata() {
      if (vm.dataorder.length !== 0) {
        vm.testgraphigdata = [];
        for (var propiedad in vm.orderTests) {
          var valores = $filter("filter")(vm.orderTests[propiedad], function (e) {
            return e.printd === true;
          })
          if (valores.length !== 0) {
            vm.testgraphigdata = _.concat(vm.testgraphigdata, valores);
          }
        }
        if (vm.testgraphigdata.length === 0) {
          logger.info("Seleccione los examanes que desea ver el historico data");
        } else {
          vm.getResultsHistory(2);
        }
      } else {
        logger.info($filter('translate')('0212'));
      }
    }
    function GraphicHistorycodense() {
      if (vm.dataorder.length !== 0) {
        vm.testgraphigdatadcodence = [];
        for (var propiedad in vm.orderTests) {
          var valores = $filter("filter")(vm.orderTests[propiedad], function (e) {
            return e.printc === true;
          })
          if (valores.length !== 0) {
            vm.testgraphigdatadcodence = _.concat(vm.testgraphigdatadcodence, valores);
          }
        }
        if (vm.testgraphigdatadcodence.length === 0) {
          logger.info("Seleccione los examanes que desea ver el historico data");
        } else {
          vm.getResultsHistory(3);
        }
      } else {
        logger.info($filter('translate')('0212'));
      }
    }
    function preliminary() {
      vm.download = "";
      if (vm.listreports.length === 0) {
        logger.info("EL path para consultar los reportes no existe consulte con el administrador");
        vm.loading = false;
      } else if (vm.lisIdiome.length === 0) {
        logger.info("EL path para consultar los idiomas no existe consulte con el administrador");
        vm.loading = false;
      } else if (vm.getpathReport !== '' && vm.getpathReport !== null) {
        vm.type = 1;
        vm.openreportpreliminary = true;
        vm.loading = false;
      } else if (vm.dataorder.length === 0) {
        logger.info($filter('translate')('0212'));
        vm.loading = false;
      } else {
        logger.info($filter('translate')('0195'));
        vm.loading = false;
      }
    }
    function end() {
      if (vm.listreports.length === 0) {
        logger.info("EL path para consultar los reportes no existe consulte con el administrador");
        vm.loading = false;
      } else if (vm.lisIdiome.length === 0) {
        logger.info("EL path para consultar los idiomas no existe consulte con el administrador");
        vm.loading = false;
      } else if (vm.getpathReport !== '' && vm.getpathReport !== null) {
        vm.type = 2;
        vm.openreportpreliminary = true;
        vm.loading = false;
      } else if (vm.dataorder.length === 0) {
        logger.info($filter('translate')('0212'));
        vm.loading = false;
      } else {
        logger.info($filter('translate')('0195'));
        vm.loading = false;
      }
    }
    function viewantibiogramt(ob) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getsensitive(auth.authToken, ob.order, ob.testId).then(function (data) {
        if (data.status === 200) {
          vm.sensitive = _.filter(data.data.microorganisms, ['selected', true]);
          $('#myModal_antibiogram').modal('show');
        }
      }, function (error) {
        logger.error(error);
        $state.go('login');
      });
    }
    function getResultsHistory(type) {
      var listtest = [];
      vm.listgraphics = [];
      vm.graphnumbergroup = [];
      if (type === 1) {
        listtest = _.map(vm.testgraphig, 'testId');
      } else if (type === 2) {
        listtest = _.map(vm.testgraphigdata, 'testId');
      } else {
        listtest = _.map(vm.testgraphigdatadcodence, 'testId');
      }
      var patient = {
        "id": vm.patient,
        "testId": listtest
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loading = true;
      return orderDS.getResultsHistory(auth.authToken, patient).then(function (data) {
        if (data.status === 200) {

          var validlist = $filter('filter')(data.data, { testCode: '!!' });

          if (validlist.length > 0) {
            data.data.forEach(function (item) {

              if (item.history.length > 0) {
                item.history = $filter('orderBy')(item.history, 'validateDate', true);

                var test = {};
                test.name = item.testCode + ' ' + item.testName;
                test.type = item.resultType;
                test.testdetail = [];

                if (item.resultType === 1) {
                  test.options = _.clone(vm.options);
                  test.datagraphics = [
                    {
                      name: $filter('translate')('0115'),
                      type: 'line',
                      data: []
                    },
                    {
                      name: $filter('translate')('0129'),
                      type: 'line',
                      data: []
                    },
                    {
                      name: $filter('translate')('0130'),
                      type: 'line',
                      data: []
                    }];

                  var testgroup = {
                    name: item.testCode + ' ' + item.testName,
                    type: 'line',
                    data: []
                  }
                  vm.optionsgraphgroup.legend.data.push(item.testCode + ' ' + item.testName)

                  var index = item.history.length + 1;
                  item.history.forEach(function (itemhistory, key) {
                    index = index - 1;
                    test.datagraphics[0].data.push(itemhistory.resultNumber === null ? '' : itemhistory.resultNumber);
                    test.datagraphics[1].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMin);
                    test.datagraphics[2].data.push(itemhistory.resultNumber === null ? '' : itemhistory.refMax);
                    test.options.xAxis.data.push(moment(itemhistory.validateDate).format(vm.formatDategraphip));


                    testgroup.data.push(itemhistory.resultNumber === null ? '' : [index, itemhistory.resultNumber]);

                    var detail = {
                      datevalid: moment(itemhistory.validateDate).format(vm.formatDategraphip),
                      order: itemhistory.order,
                      result: itemhistory.result,
                      referencevalues: itemhistory.refMin !== null ? (itemhistory.refMin + ' - ' + itemhistory.refMax) : '',
                      patology: itemhistory.pathology === 0 ? $filter('translate')('0132') : '*',
                      min: itemhistory.refMin,
                      max: itemhistory.refMax,
                      comment: itemhistory.resultComment.comment
                    }
                    test.testdetail.push(detail);
                  });

                  vm.graphnumbergroup.push(testgroup)
                }

                else {
                  if (type === 2) {
                    item.history.forEach(function (itemhistory, key) {
                      var detail = {
                        datevalid: moment(itemhistory.validateDate).format(vm.formatDategraphip),
                        order: itemhistory.order,
                        result: itemhistory.result,
                        referencevalues: itemhistory.refLiteral !== null ? itemhistory.refLiteral : '',
                        patology: itemhistory.pathology === 0 ? $filter('translate')('0132') : '*',
                        comment: itemhistory.resultComment.comment
                      }
                      test.testdetail.push(detail);
                    })
                  }
                }
                test.testdetail = test.testdetail.reverse();
                vm.listgraphics.push(test);

              }
            });

            vm.listgraphicsALL = vm.listgraphics;
            if (type === 1) {
              if (vm.listgraphicsALL.length === 0) {
                logger.info("No hay datos para generar informe");
              } else {
                $('#test-modal-charts').modal('show');
              }

            } else if (type === 2) {
              if (vm.listgraphicsALL.length === 0) {
                logger.info("No hay datos para generar informe");
              } else {
                $('#test-modal-chartsdata').modal('show');
              }

            } else {
              if (vm.listgraphicsALL.length === 0) {
                logger.info("No hay datos para generar informe");
              } else {
                vm.variables = {
                  "entity": vm.branch,
                  "abbreviation": "",
                  "paciente": vm.patientname,
                  "username": auth.userName,
                  "date": moment().format(vm.formatDate)
                }
                vm.pathreport = '/Report/Historycondense/specialStatisticsGraph.mrt';
                vm.openreport = false;
                vm.windowOpenReport();
              }
            }
            /*  UIkit.modal("#rs-modal-testhistory").show(); */
          }
          else {
            logger.info("No hay datos para generar informe");
          }
        }
        else {
          logger.info("No hay datos para generar informe");
        }

        vm.loading = false;
      }, function (error) {
        vm.loading = false;
        logger.error(error);
        $state.go('login');
      });
    }
    function windowOpenReport() {
      if (vm.listgraphicsALL.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
        var datareport = LZString.compressToUTF16(JSON.stringify(vm.listgraphicsALL));
        localStorageService.set('parameterReport', parameterReport);
        localStorageService.set('dataReport', datareport);
        window.open('/viewreport/viewreport.html');
      } else {
        logger.info("No hay datos para generar informe");
      }
    }
    vm.isAuthenticate();
  }
})();
