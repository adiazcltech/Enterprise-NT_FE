/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.tuberack')
    .controller('tuberackController', tuberackController);


  tuberackController.$inject = ['localStorageService', 'rackDS', 'logger', '$filter', '$state', 'documenttypesDS', 'auditsorderDS',
    'moment', '$rootScope', 'branchDS', 'sampletrackingsDS', 'refrigeratorDS', 'printBarcodeDS', 'userDS', 'queriesDS'
  ];

  function tuberackController(localStorageService, rackDS, logger, $filter, $state, documenttypesDS, auditsorderDS,
    moment, $rootScope, branchDS, sampletrackingsDS, refrigeratorDS, printBarcodeDS, userDS, queriesDS) {

    var vm = this;
    vm.title = 'Tuberack';
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0043');
    $rootScope.helpReference = '06.Tools/tuberack.htm';
    vm.gocomplereverify = gocomplereverify;
    vm.order = $rootScope.Ordertuberack;
    vm.sample = $rootScope.SampleOrdertuberack;
    vm.gettypedocument = gettypedocument;
    vm.keyselectpatientid = keyselectpatientid;
    $rootScope.pageview = 3;
    $rootScope.$watch('ipUser', function () {
      vm.ipuser = $rootScope.ipUser;
    });

    //Variables de configuracion.
    vm.keyFilaGeneral = parseInt(localStorageService.get('Fila'));
    vm.keyColumnGeneral = parseInt(localStorageService.get('Columna'));
    vm.keyFilaPending = parseInt(localStorageService.get('Fila'));
    vm.keyColumnPending = parseInt(localStorageService.get('Columna'));
    vm.keyFilaConfidential = parseInt(localStorageService.get('Fila'));
    vm.keyColumnConfidential = parseInt(localStorageService.get('Columna'));

    vm.keycolorgeneral = localStorageService.get('GradillaGeneral');
    vm.keycolorPendiente = localStorageService.get('GradillaPendienteColor');
    vm.keycolorCondifenciales = localStorageService.get('GradillaCondifencialesColor');
    vm.viewGradillaConfidenciales = localStorageService.get('GradillaConfidenciales');
    vm.viewGradillaPendiente = localStorageService.get('GradillaPendiente');

    vm.sampleseparator = localStorageService.get('SeparadorMuestra');
    vm.trazability = localStorageService.get('Trazabilidad');
    vm.destinationverify = localStorageService.get('DestinoVerificaCentralMuestras');
    vm.DestinationDisposal = localStorageService.get('DestinoVerificaDesecho');

    vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ' h:mm a';
    vm.typedocument = localStorageService.get('ManejoTipoDocumento');
    vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
    vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
    vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;

    //Variables para la adicion y edicion de gradillas
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.Repeat = false;
    vm.Repeatcode = false;
    vm.listrack = [{
      'id': 0
    }];
    vm.Detail = [];


    vm.type = [{
      id: 1,
      name: $filter('translate')('0078')
    },
    {
      id: 2,
      name: $filter('translate')('0413')
    },
    {
      id: 3,
      name: $filter('translate')('0783')
    }
    ];

    //Metodos para la adicion y edicion de gradillas
    vm.gettuberack = gettuberack;
    vm.getId = getId;
    vm.open = open;
    vm.stateButton = stateButton;
    vm.getbranch = getbranch;
    vm.getusers = getusers;
    vm.New = New;
    vm.Edit = Edit;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.closemodal = closemodal;
    vm.cancel = cancel;
    vm.modalError = modalError;
    vm.discardSamples = discardSamples;

    //Variables para la gestion de gradillas
    vm.typeG = '0';
    vm.typeP = '0';
    vm.typeC = '0';
    vm.listvaluesgeneral = {};
    vm.listvaluespending = {};
    vm.listvaluesconfidential = {};

    vm.branchOrder = '';
    vm.patientOrder = '';
    vm.sampleOrder = '';

    vm.alphabelist = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    vm.numberslist = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    vm.alphabelistgeneral = vm.alphabelist.slice(0, vm.keyFilaGeneral);
    vm.numberslistgeneral = vm.numberslist.slice(0, vm.keyColumnGeneral);
    vm.alphabelistpending = vm.alphabelist.slice(0, vm.keyFilaPending);
    vm.numberslistpending = vm.numberslist.slice(0, vm.keyColumnPending);
    vm.alphabelistconfidential = vm.alphabelist.slice(0, vm.keyFilaConfidential);
    vm.numberslistconfidential = vm.numberslist.slice(0, vm.keyColumnConfidential);

    vm.sizetuberackgeneral = parseInt(vm.keyColumnGeneral) > parseInt(vm.keyFilaGeneral) ? parseInt(vm.keyColumnGeneral) + 1 : parseInt(vm.keyFilaGeneral) + 1;
    vm.sizetuberackpending = parseInt(vm.keyColumnPending) > parseInt(vm.keyFilaPending) ? parseInt(vm.keyColumnPending) + 1 : parseInt(vm.keyFilaPending) + 1;
    vm.sizetuberackconfidential = parseInt(vm.keyColumnConfidential) > parseInt(vm.keyFilaConfidential) ? parseInt(vm.keyColumnConfidential) + 1 : parseInt(vm.keyFilaConfidential) + 1;

    //Metodos para la gestion de gradillas
    vm.gettuberackbytype = gettuberackbytype;
    vm.changetuberack = changetuberack;
    vm.validOrder = validOrder;
    vm.insertsamplebyrack = insertsamplebyrack;
    vm.reloadracks = reloadracks;
    vm.getdetailorder = getdetailorder;
    vm.validsamplebyrack = validsamplebyrack;
    vm.getrefrigerator = getrefrigerator;
    vm.loadcloserack = loadcloserack;
    vm.closerack = closerack;
    vm.searchsamplebyrach = searchsamplebyrach;
    vm.loadracksearch = loadracksearch;
    vm.loadracksearchform = loadracksearchform;
    vm.verifydestination = verifydestination;
    vm.removesamplerack = removesamplerack;
    vm.printbarcoderack = printbarcoderack;
    vm.getauditsamplestorage = getauditsamplestorage;
    vm.searchpatient = searchpatient;
    vm.typesearch = 1;
    vm.datapatient = [];
    vm.detailsample = [];
    vm.listrackfind1 = [];

    vm.loading = false;
    vm.record = '';
    vm.selectedpatient = -1;

    function discardSamples() {
      vm.gettuberackbytype(1, vm.typeG);
      vm.gettuberackbytype(2, vm.typeP);
      vm.gettuberackbytype(3, vm.typeC)
    }

    function keyselectpatientid($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.searchpatient();
      }
    }

    vm.getIdsample = getIdsample;
    function getIdsample(order) {
      vm.loadingpatient = true;
      vm.listrackfind1 = '';
      vm.selectedpatient = order.orderNumber;
      vm.selectedsample = -1;
      vm.numberslistsearch = [];
      vm.alphabelistsearch = [];
      vm.selectedracksearch = '';
      vm.detailsample = [];
      vm.detailsample = _.uniqBy(order.samples, "name");
      vm.loadingpatient = false;
    }


    vm.traceabilitysample = traceabilitysample;
    function traceabilitysample(sample) {
      vm.loadingpatient = true;
      vm.selectedsample = sample.codesample;
      vm.loading = true;
      vm.listrackfind1 = '';
      vm.numberslistsearch = [];
      vm.alphabelistsearch = [];
      vm.selectedracksearch = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getracksbyordersample(auth.authToken, vm.selectedpatient, vm.selectedsample).then(function (data) {
        if (data.status === 200) {
          vm.listrackfinddetail1 = data.data;
          data.data.forEach(function (element) {
            element.rackid = element.rack.id;
            element.name = element.rack.id + ' ' + element.rack.name
            element.rack.typename = element.rack.type === 1 ? $filter('translate')('0078') : element.rack.type === 2 ? $filter('translate')('0413') : $filter('translate')('0783');
            element.registDate = moment(element.registDate).format(vm.formatDate);
            element.rack.isOpenText = element.rack.state === 0 ? $filter('translate')('0699') : element.rack.state === 2 ? $filter('translate')('0698') : $filter('translate')('0698');
            element.load = element.branch.id === auth.branch ? 1 : 0;
            var alphabelist = vm.alphabelist.slice(0, element.rack.row);
            var numberslist = vm.numberslist.slice(0, element.rack.column);
            element.positioncalculate = element.position;
          });
          vm.listrackfind1 = _.groupBy(data.data, 'rackid');
        }
        vm.loadingpatient = false;
      }, function (error) {
        vm.modalError(error);
        vm.loadingpatient = false;
      });
    }

    function searchpatient() {
      var validatedtypedocument = vm.historyautomatic || vm.typedocument ? false : vm.documentType.id === undefined ? true : false;
      if (vm.record === '' || validatedtypedocument) {
        return true;
      } else {
        vm.loadingpatient = true;
        vm.documentType.id = vm.documentType.id === -1 ? 1 : vm.documentType.id;
        var searchconsult = {
          'rangeType': 0,
          'init': 0,
          'end': 0,
          'demographics': null,
          'sections': null,
          'record': vm.record,
          'documentType': vm.documentType.id
        }
        vm.detailsample = [];
        vm.listrackfind1 = [];
        vm.datapatient = [];
        vm.selectedsample = -1;
        vm.selectedpatient = -1;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return queriesDS.getOrdersbyPatientStorage(auth.authToken, searchconsult).then(function (data) {
          if (data.status === 200) {
            vm.datapatient = data.data;
          } else {
            vm.record = "";
            logger.success($filter('translate')('0392'));
          }
          vm.loadingpatient = false;
        },
          function (error) {
            vm.modalError(error);
            vm.loadingpatient = false;
          });
      }
    }

    function printbarcoderack(rack) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      rack.serial = $rootScope.serialprint;
      
      return rackDS.getbarcoderack(auth.authToken, rack).then(function (data) {
        if (data.status === 200) {
            logger.success($filter('translate')('0788'))
        }
      },
        function (error) {;
          logger.warning($filter('translate')('1074'));
        })
    }

    function gettuberackbytype(type, state) {
      switch (type) {
        case 1:
          vm.listrackgeneral = [];
          vm.rackgeneral = '';
          vm.keyFilaGeneral = parseInt(localStorageService.get('Fila'));
          vm.keyColumnGeneral = parseInt(localStorageService.get('Columna'));
          vm.alphabelistgeneral = vm.alphabelist.slice(0, vm.keyFilaGeneral);
          vm.numberslistgeneral = vm.numberslist.slice(0, vm.keyColumnGeneral);
          vm.sizetuberackgeneral = parseInt(vm.keyColumnGeneral) > parseInt(vm.keyFilaGeneral) ? parseInt(vm.keyColumnGeneral) + 1 : parseInt(vm.keyFilaGeneral) + 1;
          vm.listvaluesgeneral = {};
          break;
        case 2:
          vm.listrackpending = [];
          vm.rackpending = '';
          vm.keyFilaPending = parseInt(localStorageService.get('Fila'));
          vm.keyColumnPending = parseInt(localStorageService.get('Columna'));
          vm.alphabelistpending = vm.alphabelist.slice(0, vm.keyFilaPending);
          vm.numberslistpending = vm.numberslist.slice(0, vm.keyColumnPending);
          vm.sizetuberackpending = parseInt(vm.keyColumnPending) > parseInt(vm.keyFilaPending) ? parseInt(vm.keyColumnPending) + 1 : parseInt(vm.keyFilaPending) + 1;
          vm.listvaluespending = {};
          break;
        case 3:
          vm.listrackconfidential = [];
          vm.rackconfidential = '';
          vm.keyFilaConfidential = parseInt(localStorageService.get('Fila'));
          vm.keyColumnConfidential = parseInt(localStorageService.get('Columna'));
          vm.alphabelistconfidential = vm.alphabelist.slice(0, vm.keyFilaConfidential);
          vm.numberslistconfidential = vm.numberslist.slice(0, vm.keyColumnConfidential);
          vm.sizetuberackconfidential = parseInt(vm.keyColumnConfidential) > parseInt(vm.keyFilaConfidential) ? parseInt(vm.keyColumnConfidential) + 1 : parseInt(vm.keyFilaConfidential) + 1;
          vm.listvaluesconfidential = {};
          break;
      }

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var filter = {
        'type': type,
        'state': state,
        'branch': auth.branch
      }
      return rackDS.getrackbyfilter(auth.authToken, filter).then(function (data) {
        if (data.status === 200) {
          switch (type) {
            case 1:
              vm.listrackgeneral = data.data;
              break;
            case 2:
              vm.listrackpending = data.data;
              break;
            case 3:
              vm.listrackconfidential = data.data;
              break;
          }
        }
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function changetuberack(item, type) {
      var numberslistvalid = 0;
      var alphabelistvalid = 0;
      vm.loading = true;
      if (item !== undefined) {
        numberslistvalid = vm.alphabelist.slice(0, item.row);
        alphabelistvalid = vm.numberslist.slice(0, item.column);
      } else {
        numberslistvalid = vm.alphabelist.slice(0, parseInt(localStorageService.get('Fila')));
        alphabelistvalid = vm.numberslist.slice(0, parseInt(localStorageService.get('Columna')));
      }

      switch (type) {
        case 1:
          vm.listvaluesgeneral = {};
          vm.numberslistgeneraldetail = '';
          vm.numberslistgeneraldetailuser = '';
          vm.numberlistgeneraldiscard = '';
          if (item === undefined) {
            vm.keyFilaGeneral = parseInt(localStorageService.get('Fila'));
            vm.keyColumnGeneral = parseInt(localStorageService.get('Columna'));
            vm.alphabelistgeneral = vm.alphabelist.slice(0, vm.keyFilaGeneral);
            vm.numberslistgeneral = vm.numberslist.slice(0, vm.keyColumnGeneral);
            vm.sizetuberackgeneral = parseInt(vm.keyColumnGeneral) > parseInt(vm.keyFilaGeneral) ? parseInt(vm.keyColumnGeneral) + 1 : parseInt(vm.keyFilaGeneral) + 1;
          }
          break;
        case 2:
          vm.listvaluespending = {};
          vm.numberslistpendingdetail = '';
          vm.numberslistpendingdetailuser = '';
          vm.numberslistpendingdiscard = '';
          if (item === undefined) {
            vm.keyFilaPending = parseInt(localStorageService.get('Fila'));
            vm.keyColumnPending = parseInt(localStorageService.get('Columna'));
            vm.alphabelistpending = vm.alphabelist.slice(0, vm.keyFilaPending);
            vm.numberslistpending = vm.numberslist.slice(0, vm.keyColumnPending);
            vm.sizetuberackpending = parseInt(vm.keyColumnPending) > parseInt(vm.keyFilaPending) ? parseInt(vm.keyColumnPending) + 1 : parseInt(vm.keyFilaPending) + 1;
          }
          break;
        case 3:
          vm.listvaluesconfidential = {};
          vm.numberslistconfidentialdetail = '';
          vm.numberslistconfidentialdetailuser = '';
          vm.numberslistconfidentialdiscard = '';
          if (item === undefined) {
            vm.keyFilaConfidential = parseInt(localStorageService.get('Fila'));
            vm.keyColumnConfidential = parseInt(localStorageService.get('Columna'));
            vm.alphabelistconfidential = vm.alphabelist.slice(0, vm.keyFilaConfidential);
            vm.numberslistconfidential = vm.numberslist.slice(0, vm.keyColumnConfidential);
            vm.sizetuberackconfidential = parseInt(vm.keyColumnConfidential) > parseInt(vm.keyFilaConfidential) ? parseInt(vm.keyColumnConfidential) + 1 : parseInt(vm.keyFilaConfidential) + 1;
          }
          break;
      }
      if (item !== undefined) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var listpositionrack = {};
        var listpositionrackdetail = [];
        var listpositionrackdetailuser = [];
        var listposition = {};
        var listpositiondiscard = {};
        return rackDS.getdetailrack(auth.authToken, item.id).then(function (data) {
          if (data.status === 200) {
            var listvaluegeneral = data.data;
            for (var i = 0; i < listvaluegeneral.length; i++) {
              var userview = ''
              if (listvaluegeneral[i].updateDate !== undefined && listvaluegeneral[i].insert === false) {
                userview = '<br/>' + $filter('translate')('0001') + ': ' + listvaluegeneral[i].updateUser.userName + '<br/>' + $filter('translate')('0325') + ': ' + moment(listvaluegeneral[i].updateDate).format(vm.formatDate)
              }

              // var positionnumber = listvaluegeneral[i].poslistvaluegeneralition % numberslistvalid.length;
              //var positionletter = listvaluegeneral[i].position / alphabelistvalid.length;
              //positionletter = positionletter < Math.round(positionletter) ? Math.round(positionletter) - 1 : Math.round(positionletter);
              listpositionrack[listvaluegeneral[i].position] = listvaluegeneral[i].certificate !== undefined && listvaluegeneral[i].insert === true ? 4 : listvaluegeneral[i].insert === true ? 1 : 3;
              listpositionrackdetail[listvaluegeneral[i].position] = listvaluegeneral[i].order + vm.sampleseparator + listvaluegeneral[i].sample.codesample;
              listpositionrackdetailuser[listvaluegeneral[i].position] = listvaluegeneral[i].order + vm.sampleseparator + listvaluegeneral[i].sample.codesample + userview;
              //listposition[vm.alphabelist[positionletter] + '' + vm.numberslist[positionnumber]] = listvaluegeneral[i].position;
              listposition[listvaluegeneral[i].position] = listvaluegeneral[i].position
              listpositiondiscard[listvaluegeneral[i].position] = listvaluegeneral[i].discard
            }
          }
          switch (type) {
            case 1:
              vm.keyFilaGeneral = item.row;
              vm.keyColumnGeneral = item.column;
              vm.alphabelistgeneral = vm.alphabelist.slice(0, item.row);
              vm.numberslistgeneral = vm.numberslist.slice(0, item.column);
              vm.sizetuberackgeneral = parseInt(item.column) > parseInt(item.row) ? parseInt(item.column) + 1 : parseInt(item.row) + 1;
              vm.listvaluesgeneral = listpositionrack;
              vm.numberslistgeneraldetail = listpositionrackdetail;
              vm.numberslistgeneraldetailuser = listpositionrackdetailuser;
              vm.listpositiongeneral = listposition
              vm.numberlistgeneraldiscard = listpositiondiscard;
              break;
            case 2:
              vm.keyFilaPending = item.row;
              vm.keyColumnPending = item.column;
              vm.alphabelistpending = vm.alphabelist.slice(0, item.row);
              vm.numberslistpending = vm.numberslist.slice(0, item.column);
              vm.sizetuberackpending = parseInt(item.column) > parseInt(item.row) ? parseInt(item.column) + 1 : parseInt(item.row) + 1;
              vm.listvaluespending = listpositionrack;
              vm.numberslistpendingdetail = listpositionrackdetail;
              vm.numberslistpendingdetailuser = listpositionrackdetailuser;
              vm.listpositionpending = listposition;
              vm.numberslistpendingdiscard = listpositiondiscard;
              break;
            case 3:
              vm.keyFilaConfidential = item.row;
              vm.keyColumnConfidential = item.column;
              vm.alphabelistconfidential = vm.alphabelist.slice(0, item.row);
              vm.numberslistconfidential = vm.numberslist.slice(0, item.column);
              vm.sizetuberackconfidential = parseInt(item.column) > parseInt(item.row) ? parseInt(item.column) + 1 : parseInt(item.row) + 1;
              vm.listvaluesconfidential = listpositionrack;
              vm.numberslistconfidentialdetail = listpositionrackdetail;
              vm.numberslistconfidentialdetailuser = listpositionrackdetailuser;
              vm.listpositionconfidential = listposition;
              vm.numberslistconfidentialdiscard = listpositiondiscard;
              break;
          }
          vm.loading = false;
          vm.closed();
        },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          })

      }
      vm.loading = false;
      vm.closed();
    }

    function validOrder() {
      vm.loading = true;
      vm.branchOrder = '';
      vm.patientOrder = '';
      vm.sampleOrder = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampletrackingsDS.sampletrackingsorder(auth.authToken, vm.order).then(function (data) {
        if (data.status === 200) {
          vm.Detail = data.data;
          vm.branchOrder = vm.Detail.branch.name;
          vm.patientOrder = vm.Detail.patient.lastName + (vm.Detail.patient.surName !== undefined && vm.Detail.patient.surName !== null ? ' ' + vm.Detail.patient.surName + ' ' : ' ') + vm.Detail.patient.name1 + (vm.Detail.patient.name2 !== undefined && vm.Detail.patient.name2 !== null ? ' ' + vm.Detail.patient.name2 : '');
          if (vm.sample !== '') {
            vm.sampleverication = _.filter(vm.Detail.samples, { 'codesample': vm.sample });
            if (vm.sampleverication.length === 0) {
              vm.sampleOrder = '';
              logger.error($filter("translate")("0180"));
            } else {
              vm.sampleOrder = vm.sampleverication[0].name;
              if (vm.rackgeneral === '' || vm.rackgeneral === undefined ||
                (vm.viewGradillaPendiente === 'True' && (vm.rackpending === '' || vm.rackpending === undefined)) ||
                (vm.viewGradillaConfidenciales === 'True' && (vm.rackconfidential === '' || vm.rackconfidential === undefined))) {
                logger.error($filter("translate")("0716"));
              } else if (vm.rackgeneral !== '' && vm.rackgeneral !== undefined && vm.typeG === '1' ||
                (vm.viewGradillaPendiente === 'True' && (vm.rackgeneral !== '' && vm.rackgeneral !== undefined && vm.typeP === '1')) ||
                (vm.viewGradillaConfidenciales === 'True' && (vm.rackconfidential !== '' && vm.rackconfidential !== undefined && vm.typeC === '1'))) {
                logger.error($filter("translate")("0717"));
              } else {
                vm.validsamplebyrack();
              }
            }
          }
        } else {
          logger.error($filter("translate")("0179"));
        }
        vm.loading = false;
      }, function (error) {
        vm.loading = false;
        logger.error($filter("translate")("0179"));
      });
    }

    function validsamplebyrack() {
      vm.loading = true;
      vm.storeVerifiedSample = false;
      vm.insertVerifiedSample = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getracksbyordersample(auth.authToken, vm.order, vm.sample).then(function (data) {
        if (data.status === 200) {
          var list = [];

          var listinsert = _.filter(data.data, { 'insert': false });
          data.data = _.uniq(data.data, function (x) {
            return x.rack.id;
          });
          data.data.forEach(function (element) {
            if (element.rack.type !== 2 && (element.insert === false || listinsert.length > 0)) {
              if (element.rack.id === vm.rackgeneral.id || element.rack.id === vm.rackconfidential.id) {
                vm.storeVerifiedSample = true;
                vm.insertVerifiedSample = listinsert.length > 0 || element.insert === false ? false : true;
                vm.positionVerifiedSample = (_.filter(listinsert, { 'id': element.id }))[0].position;

                vm.rackVerifiedSample = element.rack.id
              }

            }
            list.push(' ' + element.rack.id + ' ' + element.rack.name + '<br/>');
          });

          vm.listnameracks = list.toString();
          vm.listnameracks = vm.listnameracks.replace(',', ' ')
          UIkit.modal("#modalconfirmsaveorderrack", {
            modal: false,
            bgclose: false,
            escclose: false
          }).show();
        } else {
          vm.insertsamplebyrack();
        }
        vm.loading = false;
      }, function (error) {
        vm.modalError();
        vm.loading = false;
      });
    }

    vm.closed = closed;
    function closed() {
      angular.element("#verification").select();
    }

    vm.insertsamplebyrackmodal = insertsamplebyrackmodal;
    function insertsamplebyrackmodal() {
      UIkit.modal('#modalconfirmsaveorderrack').hide();
      vm.insertsamplebyrack();
      angular.element("#verification").select();
    }

    function insertsamplebyrack() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      if (vm.storeVerifiedSample === true && vm.insertVerifiedSample === false) {
        var data = {
          'order': vm.order,
          'position': vm.positionVerifiedSample,
          'rackId': vm.rackVerifiedSample,
          'sample': vm.sample
        }
        return rackDS.insertsamplebyrackold(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            var detail = data.data;
            var numberslistvalid = 0;
            var alphabelistvalid = 0;
            switch (detail.rack.id) {
              case vm.rackgeneral.id:
                numberslistvalid = vm.numberslistgeneral
                alphabelistvalid = vm.alphabelistgeneral
                break;
              case vm.rackpending.id:
                numberslistvalid = vm.numberslistpending
                alphabelistvalid = vm.alphabelistpending
                break;
              case vm.rackconfidential.id:
                numberslistvalid = vm.numberslistconfidential
                alphabelistvalid = vm.alphabelistconfidential
                break;
            }
            var rackname = '';
            //var positionnumber = detail.position % numberslistvalid.length;
            //var positionletter = detail.position / alphabelistvalid.length;
            //positionletter = positionletter < Math.round(positionletter) ? Math.round(positionletter) - 1 : Math.round(positionletter);

            vm.reloadracks();
            var rackclose = '';
            switch (detail.rack.id) {
              case vm.rackgeneral.id:
                rackname = vm.rackgeneral.name;
                vm.listvaluesgeneral[detail.position] = 2;
                vm.numberslistgeneraldetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositiongeneral[detail.position] = data.data.position;
                rackclose = vm.rackgeneral;
                break;
              case vm.rackpending.id:
                rackname = vm.rackpending.name;
                vm.listvaluespending[detail.position] = 2;
                vm.numberslistpendingdetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositionpending[detail.position] = data.data.position;
                rackclose = vm.rackpending;
                break;
              case vm.rackconfidential.id:
                rackname = vm.rackconfidential.name
                vm.listvaluesconfidential[detail.position] = 2;
                vm.numberslistconfidentialdetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositionconfidential[detail.position] = data.data.position;
                rackclose = vm.rackpending;
                break;
            }

            vm.racksave = detail.rack.id + ' ' + rackname;
            vm.positionsave = detail.position;

            if (data.data.full) {
              vm.loadcloserack(rackclose)
            } else {
              logger.info($filter("translate")("0704") + $filter("translate")("0705") + ' : ' + vm.racksave + $filter("translate")("0706") + ' : ' + vm.positionsave)
              /*  UIkit.modal('#modalsaveorderrack').show(); */
            }
          }
          vm.storeVerifiedSample = false;
          vm.insertVerifiedSample = false;
          vm.loading = false;
        },
          function (error) {
            if (error.data !== null && error.data.code === 2) {
              for (var i = 0; i < error.data.errorFields.length; i++) {
                if (error.data.errorFields[i] === '2|no verified test') {
                  logger.error($filter("translate")("0718"));
                  break;
                }
                if (error.data.errorFields[i] === '3|sample storage time not set') {
                  logger.error($filter("translate")("0792"));
                  break;
                } else if (error.data.errorFields[i].split('|')[2] === 'rack is full') {
                  logger.error($filter("translate")("0719"));
                  break;
                }
              }
            } else {
              vm.modalError(error);
            }
            vm.loading = false;
            vm.storeVerifiedSample = false;
            vm.insertVerifiedSample = false;
          })
      } else {
        var data = {
          'order': vm.order,
          'sample': vm.sample,
          'racks': [vm.rackgeneral.id, vm.rackpending.id, vm.rackconfidential.id]
        }
        return rackDS.insertsamplebyrack(auth.authToken, data).then(function (data) {
          if (data.status === 200) {
            var detail = data.data;
            var numberslistvalid = 0;
            var alphabelistvalid = 0;
            switch (detail.rack.id) {
              case vm.rackgeneral.id:
                numberslistvalid = vm.numberslistgeneral
                alphabelistvalid = vm.alphabelistgeneral
                break;
              case vm.rackpending.id:
                numberslistvalid = vm.numberslistpending
                alphabelistvalid = vm.alphabelistpending
                break;
              case vm.rackconfidential.id:
                numberslistvalid = vm.numberslistconfidential
                alphabelistvalid = vm.alphabelistconfidential
                break;
            }
            var rackname = '';
            var positionnumber = detail.position % numberslistvalid.length;
            var positionletter = detail.position / alphabelistvalid.length;
            positionletter = positionletter < Math.round(positionletter) ? Math.round(positionletter) - 1 : Math.round(positionletter);

            vm.reloadracks();
            var rackclose = '';



            switch (detail.rack.id) {
              case vm.rackgeneral.id:

                rackname = vm.rackgeneral.name;
                vm.listvaluesgeneral[detail.position] = 2;
                vm.numberslistgeneraldetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.numberslistgeneraldetailuser[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositiongeneral[detail.position] = data.data.position;
                rackclose = vm.rackgeneral;
                break;
              case vm.rackpending.id:
                rackname = vm.rackpending.name;
                vm.listvaluespending[detail.position] = 2;
                vm.numberslistpendingdetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.numberslistpendingdetailuser[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositionpending[detail.position] = data.data.position;
                rackclose = vm.rackpending;
                break;
              case vm.rackconfidential.id:
                rackname = vm.rackconfidential.name
                vm.listvaluesconfidential[detail.position] = 2;
                vm.numberslistconfidentialdetail[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.numberslistconfidentialdetailuser[detail.position] = detail.order + vm.sampleseparator + vm.sample;
                vm.listpositionconfidential[detail.position] = data.data.position;
                rackclose = vm.rackpending;
                break;
            }

            vm.racksave = detail.rack.id + ' ' + rackname;
            vm.positionsave = detail.position
            //vm.verifydestination();
            if (data.data.full) {
              vm.loadcloserack(rackclose)
            } else {
              logger.info($filter("translate")("0704") + " " + $filter("translate")("0705") + ' : ' + vm.racksave + " " + $filter("translate")("0706") + ' : ' + vm.positionsave)
              /* UIkit.modal('#modalsaveorderrack').show(); */
            }
          }
          vm.loading = false;
        },
          function (error) {
            if (error.data !== null && error.data.code === 2) {
              for (var i = 0; i < error.data.errorFields.length; i++) {
                if (error.data.errorFields[i] === '2|no verified test') {
                  logger.error($filter("translate")("0718"));
                  break;
                }
                if (error.data.errorFields[i] === '3|sample storage time not set') {
                  logger.error($filter("translate")("0792"));
                  break;
                } else if (error.data.errorFields[i].split('|')[2] === 'rack is full') {
                  logger.error($filter("translate")("0719"));
                  break;
                }
              }
            } else {
              vm.modalError(error);
            }
            vm.loading = false;
          })
      }
    }

    function verifydestination() {
      if (vm.trazability === '3') {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var detail = {
          'order': vm.order,
          'sample': vm.sample,
          'destination': vm.destinationverify,
          'approved': true,
          'assigmentDestination': 0,
          'branch': auth.branch
        };

        return sampletrackingsDS.sampleVerifyDestination(auth.authToken, detail).then(function (data) {
          if (data.status === 200) {
            logger.success($filter('translate')('0183'));
          }
        }, function (error) {
          if (error.data === null) {

          }

        });
      }
    }

    function reloadracks() {
      var listgeneral = Object.keys(vm.listvaluesgeneral);
      if (listgeneral.length > 0) {
        listgeneral.forEach(function (element) {
          vm.listvaluesgeneral[element] = vm.listvaluesgeneral[element] === 3 ? 3 : 1;
        });
      }

      var listpending = Object.keys(vm.listvaluespending);
      if (listpending.length > 0) {
        listpending.forEach(function (element) {
          vm.listvaluespending[element] = vm.listvaluespending[element] === 3 ? 3 : 1;
        });
      }

      var listconfidential = Object.keys(vm.listvaluesconfidential);
      if (listconfidential.length > 0) {
        listconfidential.forEach(function (element) {
          vm.listvaluesconfidential[element] = vm.listvaluesconfidential[element] === 3 ? 3 : 1;
        });
      }
    }

    function getdetailorder(detail, rack, position, state, discard) {
      vm.loading = true;
      vm.discard = false;

      if (detail !== undefined) {
        if (vm.sampleseparator === "") {
          var numerorder = parseInt(localStorageService.get('DigitosOrden')) + 8;
          vm.orderdetail = detail.slice(0, numerorder);
          vm.sampledetail = detail.slice(numerorder, detail.length);
        } else {
          vm.orderdetail = detail.split(vm.sampleseparator)[0];
          vm.sampledetail = detail.split(vm.sampleseparator)[1];
        }
        vm.rackdetail = rack;
        vm.positiondetail = position;
        vm.statesampledetail = state;
        vm.discard = discard;

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return sampletrackingsDS.sampletrackingsorder(auth.authToken, vm.orderdetail).then(function (data) {
          if (data.status === 200) {
            vm.sampleverication = _.filter(data.data.samples, { 'codesample': vm.sampledetail });
            vm.testdetail = _.uniqBy(vm.sampleverication[0].tests, 'id');
            UIkit.modal('#modaldetailorder').show();
          }
          vm.loading = false;

        }, function (error) {
          vm.modalError();
          vm.loading = false;
        });


      }
      vm.loading = false;
    }

    function removesamplerack() {
      var data = {
        'order': vm.orderdetail,
        'position': vm.positiondetail,
        'rackId': vm.rackdetail.id,
        'sample': vm.sampledetail
      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.removesamplerack(auth.authToken, data).then(function (data) {
        if (data.status === 200) {
          vm.changetuberack(vm.rackdetail, vm.rackdetail.type)
          UIkit.modal('#modaldetailorder').hide();
          logger.success($filter('translate')('0149'));
        }
      }, function (error) {
        vm.modalError(error);
      })
    }

    function getrefrigerator() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return refrigeratorDS.getrefrigerator(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listrefrigerator = $filter('filter')(data.data, {
            branch: {
              id: auth.branch
            }
          });
        }
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function loadcloserack(rack, type) {
      if (rack !== '' && rack !== undefined && type !== '2') {
        vm.rackclosetype = rack.type;
        vm.rackcloseid = rack.id;
        vm.rackclosename = rack.id + ' ' + rack.name;
        vm.rackclosetypename = rack.type === 1 ? $filter('translate')('0078') : rack.type === 2 ? $filter('translate')('0413') : $filter('translate')('0720');
        UIkit.modal('#modalcloserack').show();
      }
    }

    function closerack() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var rack = {
        'id': vm.rackcloseid,
        'branch': {
          'id': auth.branch
        },
        'refrigerator': {
          'id': vm.refrigerator.id
        },
        'floor': vm.floor,
        'user': {
          'id': auth.id
        }
      }

      return rackDS.insertcloserack(auth.authToken, rack).then(function (data) {
        if (data.status === 200) {
          var item = undefined;
          switch (vm.rackclosetype) {
            case 1:
              vm.rackgeneral = undefined;
              vm.gettuberackbytype(1, vm.typeG);
              break;
            case 2:
              vm.rackpending = undefined;
              vm.gettuberackbytype(2, vm.typeP);
              break;
            case 3:
              vm.rackconfidential = undefined;
              vm.gettuberackbytype(3, vm.typeC);
              break;
          }
          UIkit.modal('#modalcloserack').hide();
          logger.success($filter('translate')('0721'));
          vm.loading = false;
        }
      }, function (error) {
        vm.modalError();
        vm.loading = false;
      });
    }
    vm.opensearch = opensearch;
    function opensearch() {
      vm.numberslistsearch = [];
      vm.record = '';
      vm.alphabelistsearch = [];
      vm.listrackfind = '';
      vm.ordersearch = '';
      vm.samplesearch = [];
      vm.selectedracksearch = '';
      vm.datapatient = [];
      vm.detailsample = [];
      vm.listrackfind1 = [];
    }

    function searchsamplebyrach() {
      vm.loadingpatient = true;
      vm.listrackfind = '';
      vm.numberslistsearch = [];
      vm.alphabelistsearch = [];
      vm.selectedracksearch = '';
      if (vm.samplesearch !== '') {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return rackDS.getracksbyordersample(auth.authToken, vm.ordersearch, vm.samplesearch).then(function (data) {
          if (data.status === 200) {
            vm.listrackfinddetail = data.data;
            data.data.forEach(function (element) {
              element.rackid = element.rack.id;
              element.name = element.rack.id + ' ' + element.rack.name
              element.rack.typename = element.rack.type === 1 ? $filter('translate')('0078') : element.rack.type === 2 ? $filter('translate')('0413') : $filter('translate')('0783');
              element.registDate = moment(element.registDate).format(vm.formatDate);
              element.rack.isOpenText = element.rack.state === 0 ? $filter('translate')('0699') : element.rack.state === 2 ? $filter('translate')('0698') : $filter('translate')('0698');
              element.load = element.branch.id === auth.branch ? 1 : 0;

              var alphabelist = vm.alphabelist.slice(0, element.rack.row);
              var numberslist = vm.numberslist.slice(0, element.rack.column);

              //var positionnumber = element.position % numberslist.length;
              //var positionletter = element.position / alphabelist.length;
              //positionletter = positionletter < Math.round(positionletter) ? Math.round(positionletter) - 1 : Math.round(positionletter);

              element.positioncalculate = element.position;
            });
            vm.listrackfind = _.groupBy(data.data, 'rackid');
          } else {
            vm.ordersearch = "";
            vm.samplesearch = "";
            logger.success($filter('translate')('0392'));
          }
          vm.loadingpatient = false;
        }, function (error) {
          vm.modalError(error);
          vm.loadingpatient = false;
        });
      } else {
        vm.loadingpatient = false;
      }
    }

    function loadracksearch(rack, view) {
      vm.loadingpatient = true;
      vm.keycolorsearch = rack.rack.type === 1 ? vm.keycolorgeneral : rack.rack.type === 2 ? vm.keycolorPendiente : vm.keycolorCondifenciales
      vm.selectedracksearch = rack.rack.id;
      vm.selectedpositionsearch = rack.position
      vm.listvaluessearch = {};
      vm.numberslistsearchdetail = {};
      vm.keyColumnSearch = rack.rack.column;
      vm.keyFilaSearch = rack.rack.row;
      vm.alphabelistsearch = vm.alphabelist.slice(0, vm.keyFilaSearch);
      vm.numberslistsearch = vm.numberslist.slice(0, vm.keyColumnSearch);
      vm.sizetuberacksearch = parseInt(vm.keyColumnSearch) > parseInt(vm.keyFilaSearch) ? parseInt(vm.keyColumnSearch) + 1 : parseInt(vm.keyFilaSearch) + 1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getdetailrack(auth.authToken, rack.rack.id).then(function (data) {
        vm.loadingpatient = false;
        if (data.status === 200) {
          for (var i = 0; i < data.data.length; i++) {
            var sample = view === 1 ? vm.samplesearch : vm.selectedsample;
            var order = view === 1 ? vm.ordersearch : vm.selectedpatient;
            if (data.data[i].order === parseInt(order) && data.data[i].sample.codesample === sample && data.data[i].position === rack.position) {
              vm.listvaluessearch[data.data[i].position] = 2;
              if (view === 1) {
                var detail = $filter('filter')(vm.listrackfinddetail, {
                  rack: {
                    id: rack.rack.id
                  },
                  position: data.data[i].position
                });
              } else {
                var detail = $filter('filter')(vm.listrackfinddetail1, {
                  rack: {
                    id: rack.rack.id
                  },
                  position: data.data[i].position
                });
              }
              vm.numberslistsearchdetail[data.data[i].position] = $filter('translate')('0001') + ': ' + detail[0].registUser.userName + '<br/>' + $filter('translate')('0325') + ': ' + detail[0].registDate;
            } else {
              vm.listvaluessearch[data.data[i].position] = 1;
              vm.numberslistsearchdetail[data.data[i].position] = data.data[i].order + vm.sampleseparator + data.data[i].sample.codesample;
            }
          }
        }
      })
    }

    function loadracksearchform(rack) {
      switch (rack.rack.type) {
        case 1:
          vm.gettuberackbytype(1, vm.typeG);
          vm.rackgeneral = rack.rack;
          vm.changetuberack(rack.rack, 1);
          vm.typeG = rack.rack.state === 0 ? '0' : '1';
          break;
        case 2:
          vm.gettuberackbytype(2, vm.typeP);
          vm.rackpending = rack.rack;
          vm.changetuberack(rack.rack, 2);
          vm.typeP = rack.rack.state === 0 ? '1' : '2'
          break;
        case 3:
          vm.gettuberackbytype(3, vm.typeC);
          vm.rackconfidential = rack.rack;
          vm.changetuberack(rack.rack, 3);
          vm.typeC = rack.rack.state === 0 ? '0' : '1';
          break;
      }
      UIkit.modal('#modalsearchorder').hide();
    }

    function getauditsamplestorage() {
      vm.loading = true;

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getauditsamplestorage(auth.authToken, vm.ordersearch, vm.samplesearch).then(function (data) {
        if (data.status === 200) {
          vm.listauditsamplestorage = [];
          var listprueba = data.data
          data.data.forEach(function (value, key) {
            var element = {
              'actionCode': '',
              'action': '',
              'user': '',
              'date': '',
              'rack': {},
              'certificate': {},
              'positioncalculate': ''
            }

            var current = JSON.parse(value.current);
            var diferences = JSON.parse(value.diferences);

            var alphabelist = vm.alphabelist.slice(0, current.rack.row);
            var numberslist = vm.numberslist.slice(0, current.rack.column);

            //var positionnumber = current.position % numberslist.length;
            //var positionletter = current.position / alphabelist.length;
            //positionletter = positionletter < Math.round(positionletter) ? Math.round(positionletter) - 1 : Math.round(positionletter);

            element.positioncalculate = current.position;

            if (value.action === 'I') {
              element.actionCode = 'A';
              element.action = $filter('translate')('0801');
              element.user = $filter('filter')(vm.listusers, {
                id: value.user.id
              })[0];
              element.date = moment(value.date).format(vm.formatDate);
              element.rack = current.rack
              vm.listauditsamplestorage.push(element)
            } else if (value.action === 'U') {
              var changeinsert = $filter('filter')(diferences, {
                path: '/insert'
              });
              var changestate = $filter('filter')(diferences, {
                path: '/certificate'
              });
              if (changeinsert.length > 0) {
                element.actionCode = changeinsert[0].value === false ? 'R' : 'A';
                element.action = changeinsert[0].value === false ? $filter('translate')('0802') : $filter('translate')('0801');
                element.user = $filter('filter')(vm.listusers, {
                  id: value.user.id
                })[0];
                element.date = moment(value.date).format(vm.formatDate);
                element.rack = current.rack
                vm.listauditsamplestorage.push(element)
              } else if (changestate.length > 0) {
                element.actionCode = 'D';
                element.action = $filter('translate')('0803');
                element.user = $filter('filter')(vm.listusers, {
                  id: value.user.id
                })[0];
                element.date = moment(value.date).format(vm.formatDate);
                element.rack = current.rack
                vm.listauditsamplestorage.push(element)
              } else if (vm.listauditsamplestorage[vm.listauditsamplestorage.length - 1].actionCode === 'R' && current.insert === true) {
                element.actionCode = 'A';
                element.action = $filter('translate')('0801');
                element.user = $filter('filter')(vm.listusers, {
                  id: value.user.id
                })[0];
                element.date = moment(value.date).format(vm.formatDate);
                element.rack = current.rack
                vm.listauditsamplestorage.push(element)
              }
            }


          });
          UIkit.modal('#modalauditsamplestorage', {
            modal: false
          }).show();
        }
        vm.loading = false;
      }, function (error) {
        vm.modalError(error);
      })
    }

    function gettuberack() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getrackbybranch(auth.authToken, auth.branch).then(function (data) {
        if (data.status === 200) {
          vm.listrack = $filter('filter')(data.data, {
            branch: {
              id: auth.branch
            }
          });
          vm.getbranch();
          vm.stateButton('init')
        }
        vm.loading = false;
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function getbranch() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchstate(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.branchdetail = $filter('filter')(data.data, {
            id: auth.branch
          })[0];
        }
      },
        function (error) {
          vm.modalError(error);
        })
    }

    function getusers() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getUsers(auth.authToken).then(function (data) {
        if (vm.typedocument) {
          vm.gettypedocument();
        }
        if (data.status === 200) {
          vm.listusers = data.data;
        }
      },
        function (error) {
          vm.modalError(error);
        })
    }

    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabled = true;
        vm.stateconfig = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabled = false;
        vm.stateconfig = false;
      }
      if (state === 'edit') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabled = false;

      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabled = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabled = true;
        vm.stateconfig = true;
      }
    }

    function nextCode(listIDs, current) {
      if (current <= 0) return 1;
      return ((listIDs[current] - listIDs[current - 1]) === 1)
        ? (listIDs[current] + 1)
        : nextCode(listIDs, (current - 1));
    }

    function generateCode(listRack) {
      var lastCode = parseInt(listRack[listRack.length - 1].code);

      return isNaN(lastCode)
        ? nextCode(_.map(listRack, "id"), (listRack.length - 1))
        : (lastCode + 1);
    }

    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      setTimeout(function () {
        angular.element('#code').focus();
      }, 100);
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'branch': {
          'id': auth.branch
        },
        'id': 0,
        'code': generateCode(vm.listrack),
        'name': '',
        'isOpen': true,
        'row': parseInt(localStorageService.get('Fila')),
        'column': parseInt(localStorageService.get('Columna'))
      };
      vm.stateButton('add');
    }

    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
      if (vm.Detail.id === 0) {
        vm.insert();
      } else {
        vm.update();
      }
    }

    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.insertrack(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.gettuberack();
          vm.Detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0149'));
          vm.loading = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
        vm.loading = false;
      });
    }

    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return rackDS.updaterack(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.gettuberack();
          logger.success($filter('translate')('0149'));
          vm.stateButton('update');
          vm.loading = false;
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });
    }

    function cancel(Form) {
      vm.Repeat = false;
      vm.Repeatcode = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }

    function Edit() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return rackDS.getdetailrack(auth.authToken, vm.Detail.id).then(function (data) {
        if (data.status === 204) {
          vm.stateconfig = false;
        } else {
          vm.stateconfig = true;
        }
        vm.stateButton('edit');
      })

    }

    // función para cerrar la ventana
    function closemodal(Form) {
      vm.open(Form);
      vm.gettuberackbytype(1, vm.typeG);
      vm.gettuberackbytype(2, vm.typeP);
      vm.gettuberackbytype(3, vm.typeC);
      UIkit.modal('#newgradilla').hide();
    }

    function open(form) {
      form.$setUntouched();
      vm.Detail = {
        'user': {
          'id': null
        },
        'branch': {
          'id': null
        },
        'id': null,
        'code': '',
        'name': '',
        'type': '',
        'isOpen': true,
        'row': vm.keyFila,
        'column': vm.keyColumn
      };
      vm.isDisabled = true;
      vm.isDisabledAdd = false;
      vm.isDisabledEdit = true;
      vm.isDisabledSave = true;
      vm.isDisabledCancel = true;
    }

    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.loading = true;
      vm.Repeat = false;
      vm.Repeatcode = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      return rackDS.getrackid(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.Detail = data.data;
          vm.stateButton('update');
          vm.loading = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    // Función para sacar la vantana del modal error
    function modalError(error) {
      vm.loading = false;
      if (error.data === undefined) {
        vm.Error = error;
        vm.ShowPopupError = true;
      } else if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeatcode = true;
            }
          });
        }
      }
      if (vm.Repeat === false && vm.Repeatcode === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
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

    function gocomplereverify() {
      vm.loading = true;
      if (vm.trazability === '2') {
        vm.loading = false;
        $state.go('simpleverification');
      }
      if (vm.trazability === '3') {
        vm.loading = false;
        $state.go('completeverify');
      }
    }

    function gettypedocument() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return documenttypesDS.getstatetrue(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.documentType = $filter('orderBy')(data.data, 'name');;
          vm.documentType.id = vm.documentType[0].id;
        }
      },
        function (error) {
          vm.modalError(error);
        });
    }


    // Función para inicializar la pagina
    function init() {
      vm.gettuberackbytype(1, vm.typeG);
      vm.gettuberackbytype(2, vm.typeP);
      vm.gettuberackbytype(3, vm.typeC);
      vm.getrefrigerator();
      vm.getusers();

    }

    vm.isAuthenticate();
  }

})();
/* jshint ignore:end */
