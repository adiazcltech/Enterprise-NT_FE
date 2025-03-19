/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.otherreports')
    .filter('trust', ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };
    }])
    .controller('otherreportsController', otherreportsController);


  otherreportsController.$inject = ['localStorageService', 'indicatorsDS',
    '$filter', '$state', 'moment', '$rootScope', '$scope', 'logger', 'demographicDS', 'common', '$sce'];

  function otherreportsController(localStorageService, indicatorsDS,
    $filter, $state, moment, $rootScope, $scope, logger, demographicDS, common, $sce) {

    var vm = this;
    vm.title = 'otherreports';
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.get = get;
    $rootScope.menu = true;
    $rootScope.helpReference = '04.reportsandconsultations/otherreports.htm';
    $rootScope.NamePage = $filter('translate')('1724');
    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
    vm.separator = localStorageService.get('SeparadorLista');
    vm.urlExportView = localStorageService.get('UrlExportarInformacionExcel');
    vm.Url4505 = localStorageService.get('Url4505');
    vm.URLCube = localStorageService.get('URLCuboEstadistico');
    vm.URLReporteTamizaje = localStorageService.get('URLReporteTamizaje');
    vm.separator = vm.separator === "" || vm.separator === null ? ";" : vm.separator;
    vm.rangeInit = moment().format('YYYYMMDD');
    vm.rangeEnd = moment().format('YYYYMMDD');
    vm.modalError = modalError;
    vm.getDemographics = getDemographics;
    vm.htmlEntities = htmlEntities;
    vm.demosmask = "-110";
    $rootScope.pageview = 3;
    vm.basicTree = [
      {
        "id": 1,
        "image": "images/csv.png",
        "name": $filter('translate')('1726')
      }
    ];
    vm.options5 == {
      expandOnClick: true,
      filter: {}
    };
    $scope.$on('selection-changed', function (e, node) {
      if (node.id === 1 && (vm.Url4505 === undefined || vm.Url4505 === null || vm.Url4505 === '' || vm.Url4505.length < 1)) {
        logger.warning($filter('translate')('2090'));
        return false;
      }
      if (node.id === 2 && (vm.urlExportView === undefined || vm.urlExportView === null || vm.urlExportView === '' || vm.urlExportView.length < 1)) {
        logger.warning($filter('translate')('1897'));
        return false;
      }
      if (node.id === 3 && (vm.URLCube === undefined || vm.URLCube === null || vm.URLCube === '' || vm.URLCube.length < 1)) {
        logger.warning($filter('translate')('2088'));
        return false;
      }
      if (node.id === 4 && (vm.URLReporteTamizaje === undefined || vm.URLReporteTamizaje === null || vm.URLReporteTamizaje === '' || vm.URLReporteTamizaje.length < 1)) {
        logger.warning($filter('translate')('3667'));
        return false;
      }

      vm.select = node.id;
    });

    $scope.getIframeSrc = function () {
      if (vm.urlExportView !== undefined && vm.urlExportView !== null && vm.urlExportView.length > 1) {
        return $sce.trustAsResourceUrl(vm.urlExportView);
      }
    };

    $scope.getIframeSrc4505 = function () {

      if (vm.Url4505 !== undefined && vm.Url4505 !== null && vm.Url4505.length > 1) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var user = localStorageService.get('user');
        var jsonAuth = {
          "authToken": auth.authToken,
          "demographicQuery": user.demographicQuery,
          "demographicItemQuery": user.demographicItemQuery,
        };
        var jsonString = JSON.stringify(jsonAuth);
        return $sce.trustAsResourceUrl(vm.Url4505 + '/' + btoa(jsonString));
      }
    };

    $scope.getIframeSrcCube = function () {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var jsonAuth = {
        "authToken": auth.authToken,
      };
      var jsonString = JSON.stringify(jsonAuth);
      return $sce.trustAsResourceUrl(vm.URLCube + '/' + btoa(jsonString));
    };

    $scope.getIframeSrcTamizaje = function () {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var jsonAuth = {
        "authToken": auth.authToken,
      };
      var jsonString = JSON.stringify(jsonAuth);
      return $sce.trustAsResourceUrl(vm.URLReporteTamizaje);
    };
    vm.groupProfiles = true;
    vm.allDemographicsOrder = [];
    vm.allDemographicsHistory = [];

    vm.listColumns = [
      { id: -99, name: $filter('translate')('0110') },
      { id: -121, name: $filter('translate')('0833') },
      { id: -100, name: $filter('translate')('0117') },
      { id: -103, name: $filter('translate')('0236') },
      { id: -109, name: $filter('translate')('0237') },
      { id: -101, name: $filter('translate')('0234') },
      { id: -102, name: $filter('translate')('0235') },
      { id: -108, name: $filter('translate')('0098') + " " + $filter('translate')('0426') },
      { id: -104, name: $filter('translate')('0426') },
      { id: -110, name: $filter('translate')('0102') },
      { id: -107, name: $filter('translate')('0125') + " " + $filter('translate')('0102') },
      { id: -112, name: $filter('translate')('0187') },
      { id: -106, name: $filter('translate')('0135') },
      { id: -105, name: $filter('translate')('0976') },
      { id: -111, name: $filter('translate')('0188') },
      { id: -80, name: $filter('translate')('0364') + " " + $filter('translate')('0110') },
      { id: -70, name: $filter('translate')('0098') + " " + $filter('translate')('0866') },
      { id: -71, name: $filter('translate')('0866') },
      { id: -60, name: $filter('translate')('0098') + " " + $filter('translate')('0087') },
      { id: -61, name: $filter('translate')('0087') },
      { id: -62, name: $filter('translate')('0456') },
      { id: -20, name: $filter('translate')('0098') + " " + $filter('translate')('0459') },
      { id: -21, name: $filter('translate')('1894') },
      { id: -22, name: $filter('translate')('1895') },
      { id: -23, name: $filter('translate')('0459') },
      { id: -2, name: $filter('translate')('0086') },
      { id: -24, name: $filter('translate')('0431') },
      { id: -25, name: $filter('translate')('0289') },
      { id: -26, name: $filter('translate')('0114') },
      { id: -27, name: $filter('translate')('1226') },
      { id: -28, name: $filter('translate')('0325') + " " + $filter('translate')('0312') },
      { id: -29, name: $filter('translate')('0970') + " " + $filter('translate')('0312') },
      { id: -30, name: $filter('translate')('0325') + " " + $filter('translate')('0289') },
      { id: -31, name: $filter('translate')('0970') + " " + $filter('translate')('0289') },
      { id: -50, name: $filter('translate')('0062') },
      { id: -40, name: $filter('translate')('0529') }
    ];

    vm.selectDemo = selectDemo;
    vm.sortData = sortData;

    function selectDemo(demographic) {
      var index = _.findIndex(vm.listColumns, function (o) { return o.id === demographic.id; });
      if (index >= 0 && !demographic.checked) {
        vm.listColumns.splice(index, 1);
      } else {
        vm.listColumns.push({
          id: demographic.id,
          name: demographic.name
        })
      }
    }

    function getDemographics() {
      vm.loading = true;
      vm.allDemographicsOrder = [];
      vm.allDemographicsHistory = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicstrue(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.allDemographicsOrder = _.filter(data.data, function (o) { return o.origin === 'O'; });
          vm.allDemographicsHistory = _.filter(data.data, function (o) { return o.origin === 'H'; });
        }
        vm.loading = false;
      },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        })
    }


    // Función para sacar la vantana del modal error
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function htmlEntities(str) {

      var valorhtml = String(str).replace(/&ntilde;/g, 'ñ')
        .replace(/\n/g, "  ")
        .replace(/['"]+/g, '')
        .replace(/<[^>]*>?/g, '')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&amp;/g, '&')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&Agrave;/g, 'À')
        .replace(/&Aacute;/g, 'Á')
        .replace(/&Acirc;/g, 'Â')
        .replace(/&Atilde;/g, 'Ã')
        .replace(/&Auml;/g, 'Ä')
        .replace(/&Aring;/g, 'Å')
        .replace(/&AElig;/g, 'Æ')
        .replace(/&Ccedil;/g, 'Ç')
        .replace(/&Egrave;/g, 'È')
        .replace(/&Eacute;/g, 'É')
        .replace(/&Ecirc;/g, 'Ê')
        .replace(/&Euml;/g, 'Ë')
        .replace(/&Igrave;/g, 'Ì')
        .replace(/&Iacute;/g, 'Í')
        .replace(/&Icirc;/g, 'Î')
        .replace(/&Iuml;/g, 'Ï')
        .replace(/&ETH;/g, 'Ð')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&Ograve;/g, 'Ò')
        .replace(/&Oacute;/g, 'Ó')
        .replace(/&Ocirc;/g, 'Ô')
        .replace(/&Otilde;/g, 'Õ')
        .replace(/&Ouml;/g, 'Ö')
        .replace(/&Oslash;/g, 'Ø')
        .replace(/&Ugrave;/g, 'Ù')
        .replace(/&Uacute;/g, 'Ú')
        .replace(/&Ucirc;/g, 'Û')
        .replace(/&Uuml;/g, 'Ü')
        .replace(/&Yacute;/g, 'Ý')
        .replace(/&THORN;/g, 'Þ')
        .replace(/&szlig;/g, 'ß')
        .replace(/&agrave;/g, 'à')
        .replace(/&aacute;/g, 'á')
        .replace(/&acirc;/g, 'â')
        .replace(/&atilde;/g, 'ã')
        .replace(/&auml;/g, 'ä')
        .replace(/&aring;/g, 'å')
        .replace(/&aelig;/g, 'æ')
        .replace(/&ccedil;/g, 'ç')
        .replace(/&egrave;/g, 'è')
        .replace(/&eacute;/g, 'é')
        .replace(/&ecirc;/g, 'ê')
        .replace(/&euml;/g, 'ë')
        .replace(/&igrave;/g, 'ì')
        .replace(/&iacute;/g, 'í')
        .replace(/&icirc;/g, 'î')
        .replace(/&iuml;/g, 'ï')
        .replace(/&eth;/g, 'ð')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&ograve;/g, 'ò')
        .replace(/&oacute;/g, 'ó')
        .replace(/&ocirc;/g, 'ô')
        .replace(/&otilde;/g, 'õ')
        .replace(/&ouml;/g, 'ö')
        .replace(/&oslash;/g, 'ø')
        .replace(/&ugrave;/g, 'ù')
        .replace(/&uacute;/g, 'ú')
        .replace(/&ucirc;/g, 'û')
        .replace(/&uuml;/g, 'ü')
        .replace(/&yacute;/g, 'ý')
        .replace(/&thorn;/g, 'þ')
        .replace(/&yuml;/g, 'ÿ')
        .replace(/<[^>]+>/gm, '')


      return vm.replaceAll(valorhtml, vm.separator, '');
    }

    vm.replaceAll = replaceAll;
    function replaceAll(str, find, replace) {
      var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      return str.replace(new RegExp(escapedFind, 'g'), replace);


    }

    function sortData() {
      var orderColumns = [];
      $('#sortable').find('li').each(function () {
        orderColumns.push($(this).attr("id"))
      });

      var Head = [];

      orderColumns.forEach(function (value) {
        var column = _.find(vm.listColumns, function (o) { return o.id === parseInt(value); });
        if (column) {
          Head.push(column.name);
        }
      });

      Head = [Head];
      var examadd = [];
      vm.data.forEach(function (value) {
        value.tests.forEach(function (val) {
          var years = common.getAgeByOrderDateAsString(moment(value.birthday).format(vm.formatDate), vm.formatDate, moment(value.orderDate).format(vm.formatDate));
          var unityYears = years.split(" ");

          var datebirthday = '';
          var birthday = moment(value.birthday, vm.formatDate.toUpperCase()).valueOf();
          if (isNaN(birthday)) {
            datebirthday = moment(value.birthday).format(vm.formatDate.toUpperCase());
          }

          var entryDate = val.entryDate === null ? '' : moment(val.entryDate).format(vm.formatDate.toUpperCase());
          var entryTime = val.entryDate === null ? '' : moment(val.entryDate).format('HH:mm:ss');

          var validationDate = val.validationDate === null ? '' : moment(val.validationDate).format(vm.formatDate.toUpperCase());
          var validationTime = val.validationDate === null ? '' : moment(val.validationDate).format('HH:mm:ss');

          var resultDate = val.resultDate === null ? '' : moment(val.resultDate).format(vm.formatDate.toUpperCase());
          var resultTime = val.resultDate === null ? '' : moment(val.resultDate).format('HH:mm:ss');

          var verificationDate = val.verificationDate === null || val.verificationDate === 0 ? '' : moment(val.verificationDate.toString()).format(vm.formatDate.toUpperCase());

          orderColumns.forEach(function (o) {
            var valueColumn = '';
            if (parseInt(o) < 0) {
              switch (o) {
                case '-99':
                  valueColumn = value.orderNumber;
                  break;
                case '-120':
                  valueColumn = value.documentType.id;
                  break;
                case '-121':
                  valueColumn = value.documentType.abbr;
                  break;
                case '-100':
                  valueColumn = value.patientId;
                  break;
                case '-103':
                  valueColumn = value.name1;
                  break;
                case '-109':
                  valueColumn = value.name2;
                  break;
                case '-101':
                  valueColumn = value.lastName;
                  break;
                case '-102':
                  valueColumn = value.surName;
                  break;
                case '-108':
                  valueColumn = value.sex.code;
                  break;
                case '-104':
                  valueColumn = ($filter('translate')('0000') === 'enUsa' ? value.sex.enUsa : value.sex.esCo);
                  break;
                case '-110':
                  valueColumn = unityYears[0];
                  break;
                case '-107':
                  valueColumn = unityYears[1];
                  break;
                case '-112':
                  valueColumn = value.address === null ? '' : value.address;
                  break;
                case '-106':
                  valueColumn = value.email === null ? '' : value.email;
                  break;
                case '-105':
                  valueColumn = datebirthday;
                  break;
                case '-111':
                  valueColumn = value.phone === null ? '' : value.phone;
                  break;
                case '-80':
                  valueColumn = value.orderStatus == 0 ? '2' : '1';
                  break;
                case '-70':
                  valueColumn = val.idArea;
                  break;
                case '-71':
                  valueColumn = val.nameArea;
                  break;
                case '-60':
                  valueColumn = value.codeRate === null ? '' : value.codeRate;
                  break;
                case '-61':
                  valueColumn = value.nameRate === null ? '' : value.nameRate;
                  break;
                case '-62':
                  valueColumn = val.insurancePrice === null ? '0' : val.insurancePrice;
                  break;
                case '-20':
                  valueColumn = val.codeTest;
                  break;
                case '-21':
                  valueColumn = entryDate;
                  break;
                case '-22':
                  valueColumn = entryTime;
                  break;
                case '-23':
                  valueColumn = val.nameTest;
                  break;
                case '-2':
                  valueColumn = value.physician;
                  break;
                case '-24':
                  // valueColumn = value.orderStatus == 0 ? '2' : val.testStatus;
                  valueColumn = val.testStatus;
                  break;
                case '-25':
                  valueColumn = val.result;
                  break;
                case '-26':
                  console.log(val.testComment)
                  valueColumn = val.testComment === null ? '' : vm.htmlEntities(val.testComment.replaceAll("<br />", " "));
                  valueColumn = valueColumn.replace(/(\r\n|\n|\r)/gm, "")
                  console.log(valueColumn)
                  break;
                case '-27':
                  valueColumn = val.cups === null ? '' : val.cups;
                  break;
                case '-28':
                  valueColumn = validationDate;
                  break;
                case '-29':
                  valueColumn = validationTime;
                  break;
                case '-30':
                  valueColumn = resultDate;
                  break;
                case '-31':
                  valueColumn = resultTime;
                  break;
                case '-50':
                  valueColumn = verificationDate;
                  break;
                case '-40':
                  valueColumn = val.userValidation;
                  break;
              }
            } else {
              var valueDemo = _.find(value.allDemographics, function (d) { return d.idDemographic === parseInt(o); });
              if (valueDemo) {
                if (valueDemo.encoded) {
                  valueColumn = valueDemo.codifiedName;
                } else {
                  valueColumn = valueDemo.notCodifiedValue;
                }
              }
            }
            examadd.push(valueColumn);
          });
          Head.add(examadd);
          examadd = [];

        });
      });

      var csvRows = [];
      for (var cell = 0; cell < Head.length; ++cell) {
        csvRows.add(Head[cell].join(vm.separator));
      }

      var csvString = csvRows.join("\n");
      var csvFile = new Blob(["\uFEFF" + csvString], { type: 'text/csv; charset=utf-18' });
      saveAs(csvFile, 'Resolucion_4505.csv');

    }

    //Función consultar la data y arma los datos para imprimir txt
    function get() {
      vm.loading = true;
      var democomplete = $filter("filter")(vm.demographics, function (e) {
        return e.demographicItems.length === 0;
      })

      if (democomplete.length === 0) {
        var data = {
          'startDate': vm.rangeInit,
          'endDate': vm.rangeEnd,
          'idTests': vm.listTests,
          'demographics': vm.demographics,
          'groupProfiles': vm.groupProfiles
        };

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return indicatorsDS.getResolution(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            vm.data = $filter('orderBy')(data.data, 'orderNumber');
            vm.sortData();
          } else {
            UIkit.modal('#modalReportError').show();
          }
          vm.loading = false;
        },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          })
      } else {
        logger.warning($filter('translate')('1732'));
      }
    }
    function isAuthenticate() {
      //var auth = nullp
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      }
      else {
        vm.init();
      }
    }
    // Función para inicializar la pagina
    function init() {
      vm.getDemographics();
      if (vm.urlExportView !== undefined && vm.urlExportView !== null && vm.urlExportView !== '') {
        vm.basicTree.push({
          "id": 2,
          "image": "images/csv.png",
          "name": $filter('translate')('1896')
        });
      }

      if (vm.URLCube !== undefined && vm.URLCube !== null && vm.URLCube !== '') {
        vm.basicTree.push({
          "id": 3,
          "image": "images/csv.png",
          "name": $filter('translate')('2089')
        });
      }

      if (vm.URLReporteTamizaje !== undefined && vm.URLReporteTamizaje !== null && vm.URLReporteTamizaje !== '') {
        vm.basicTree.push({
          "id": 4,
          "image": "images/csv.png",
          "name": $filter('translate')('3668')
        });
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
