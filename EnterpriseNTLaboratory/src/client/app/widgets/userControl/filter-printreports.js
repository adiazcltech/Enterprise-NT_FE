
/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('filterprintreports', filterprintreports);

  filterprintreports.$inject = ['$filter', '$rootScope', 'localStorageService', 'reportadicional', 'logger'];
  function filterprintreports($filter, $rootScope, localStorageService, reportadicional, logger) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/filter-printreports.html',
      scope: {
        id: '=id',
        visible: '=?visible',
        destination: '=destination',
        defaulttypeprint: '=defaultypeprint',
        viewpreliminary: '=?viewpreliminary',
        viewpreviou: '=?viewpreviou',
        viewordering: '=?viewordering',
        controlordersprint: '=controlordersprint',
        activateexecution: '=?activateexecution',
        isactivemail: '=?isactivemail',
        viewtypeprint: '=?viewtypeprint',
        functionexecute: '=functionexecute', 
        language: '=language',
        showadditionalmail: '=?showadditionalmail',
        receiveresult: '=?receiveresult',
        update: '=?update',
        filteritems: '=?filteritems',
        viewaccount: '=?viewaccount',
        demo: '=demo'
      },



      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.id = $scope.id === undefined ? '' : $scope.id;
        vm.viewPreliminary = $scope.viewpreliminary;
        vm.viewPreviou = $scope.viewpreviou;
        vm.viewordering = $scope.viewordering;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var language = $filter('translate')('0000');
        vm.all = '-- ' + $filter('translate')('0353') + ' --';
        vm.isPrintCopies = localStorageService.get('IdentificarCopiasInformes') === 'True';
        vm.isPrintAttached = localStorageService.get('ImprimirAdjuntos') === 'True';
        vm.sendemailaccount = localStorageService.get('EnvioCorreoCliente') === 'True';
        vm.UrlNodeJs = localStorageService.get('UrlNodeJs');
        vm.isActiveMail = localStorageService.get('EnviarCorreo') !== '';
        // vm.sendEmail = localStorageService.get('EnviarCorreo') === '1,2' ? '3' : localStorageService.get('EnviarCorreo');
        vm.language = localStorageService.get("IdiomaReporteResultados") === 'es' ? '1' : '2';
        vm.isStamp = localStorageService.get('SelloFresco') === 'True';
        $scope.isactivemail = vm.isActiveMail;
        vm.visible = $scope.visible !== undefined && $scope.visible;
        vm.controlOrdersPrint = $scope.controlordersprint;
        vm.reprint = false;
        vm.attachments = true;
        vm.stamp = false;
        $scope.attachments = true;
        vm.destination = '1';
        $scope.destination = '1';
        vm.update = false;
        $scope.update = false;
        vm.typePrint = vm.viewPreviou === false ? '1' : '4';
        vm.quantityCopies = 1;
        vm.changeDestination = changeDestination;
        vm.orderingPrint = '1';
        vm.progressPDF = false;
        vm.progressEmail = false;
        vm.progressDownload = false;
        vm.progressDownloadAll = false;
        vm.dataAttachmentsImage = [];
        vm.dataAttachmentsPDF = [];
        vm.searchSerial = searchSerial;
        vm.viewTypePrint = $scope.viewtypeprint !== undefined && $scope.viewtypeprint;
        vm.modalInstallSerialPrint = UIkit.modal('#modalInstallSerialPrint', { modal: false, keyboard: false, bgclose: false, center: true });
        vm.eventCloseModal = eventCloseModal;
        vm.filterDemo = false;
        vm.changeLanguage = changeLanguage;
        vm.patientPrint = false;
        vm.physicianPrint = false;
        vm.branchPrint = false;
        vm.accountPrint = false;
        vm.additionalMailPrint = false;
        vm.additionalMail = '';
        vm.showadditionalmail = $scope.showadditionalmail;
        vm.validatePrint = validatePrint;
        vm.validatePrint();

        $scope.$watch('activateexecution', function () {
          if ($scope.activateexecution) {
            vm.searchSerial(1);
          }
          $scope.activateexecution = false;
        });


        $scope.$watch('update', function () {
          vm.update = $scope.update;
          vm.namereceiveresult = '';
          vm.addperson = false;
          vm.viewlabel = false;
        });


        $scope.$watch('filteritems', function () {
          vm.filteritems = $scope.filteritems === true ? true : false;
        });

        $scope.$watch('viewaccount', function () {
          vm.viewaccount = $scope.viewaccount === true ? true : false;
        });



        $scope.$watch('destination', function () {
          vm.requerid = false;
          vm.receiveresult = $scope.receiveresult;
          vm.attachments = true;
          vm.progressPDF = false;
          vm.progressEmail = false;
          vm.quantityCopies = 1;
          $scope.controlordersprint = false;

          if (document.getElementById('copies' + vm.id).checked) {
            document.getElementById('endings' + vm.id).checked = true;
            vm.typePrint = '1';
          }
          if (vm.destination.toString() === '3') {
            document.getElementById('ordersPrint' + vm.id).checked = true;
            vm.orderingPrint = '1';
            $scope.controlordersprint = true;
          }
        });

        vm.changue = changue;
        function changue() {
          $scope.demo = vm.demo;
        }

        function validatePrint() {
          if (localStorageService.get('EnviarCorreo') === '1,2') {
            vm.patientPrint = true;
            vm.physicianPrint = true;
            vm.branchPrint = true;
            vm.accountPrint = true;
            vm.additionalMailPrint = true;
          } else if (localStorageService.get('EnviarCorreo') === '1') {
            vm.patientPrint = true;
            vm.branchPrint = false;
            vm.accountPrint = false;
            vm.physicianPrint = false;
            vm.additionalMailPrint = true;
          }
        }

        function changeLanguage() {
          $scope.language = vm.language;
        }

        function changeDestination() {
          $scope.destination = vm.destination;
        }

        function eventCloseModal() {
          vm.modalInstallSerialPrint.hide();
        }

        function searchSerial(transaction) {
          vm.requerid = false;
          vm.loading = false;
          if ($rootScope.serialprint === '' && vm.destination.toString() === '1') {
            vm.messageError = $filter('translate')('1067');
            UIkit.modal('#logNoSerial').show();
          }
          else {
            if (vm.namereceiveresult === '' && vm.receiveresult && vm.addperson ||
              vm.namereceiveresult === null && vm.receiveresult && vm.addperson ||
              vm.namereceiveresult === undefined && vm.receiveresult && vm.addperson) {
              vm.requerid = true;
            } else {
              if (vm.destination === '3' && vm.demo) {
                  vm.sendEmail = '2';
                if (vm.patient && vm.physician) {
                  vm.sendEmail = '3';
                } else if (vm.patient && !vm.physician) {
                  vm.sendEmail = '1';
                } else if ((!vm.patient && vm.physician) || vm.branch || vm.additionalMail || vm.account) {
                  vm.sendEmail = '2';
                }
                var paramFilterPrint = {
                  'attachments': vm.attachments,
                  'orderssend': vm.ordersSend,
                  'historysend': vm.historySend,
                  'typeprint': vm.typePrint,
                  'serial': $rootScope.serialprint,
                  'quantitycopies': vm.quantityCopies,
                  'filterdemo': vm.filterDemo,
                  'orderingprint': vm.orderingPrint,
                  'destination': vm.destination,
                  'sendEmail': 2,
                  'language': vm.language,
                  'branch': vm.branch,
                  'patient': vm.patient,
                  'physician': vm.physician,
                  'additionalMail': vm.additionalMail,
                  'namereceiveresult': vm.namereceiveresult,
                  'addperson': vm.addperson,
                  'stamp': vm.stamp,
                  'account': vm.account
                };
                vm.additionalMail = "";
                $scope.functionexecute(paramFilterPrint);
              } else if (vm.destination === '3' && !vm.patient && !vm.physician && !vm.branch && vm.additionalMail === "" && !vm.account) {
                logger.error($filter('translate')('1888'));
              } else {
                if (vm.patient && vm.physician) {
                  vm.sendEmail = '3';
                } else if (vm.patient && !vm.physician) {
                  vm.sendEmail = '1';
                } else if ((!vm.patient && vm.physician) || vm.branch || vm.additionalMail || vm.account) {
                  vm.sendEmail = '2';
                }
                var paramFilterPrint = {
                  'attachments': vm.attachments,
                  'orderssend': vm.ordersSend,
                  'historysend': vm.historySend,
                  'typeprint': vm.typePrint,
                  'serial': $rootScope.serialprint,
                  'quantitycopies': vm.quantityCopies,
                  'filterdemo': vm.filterDemo,
                  'orderingprint': vm.orderingPrint,
                  'destination': vm.destination,
                  'sendEmail': vm.sendEmail,
                  'language': vm.language,
                  'branch': vm.branch,
                  'patient': vm.patient,
                  'physician': vm.physician,
                  'additionalMail': vm.additionalMail,
                  'namereceiveresult': vm.namereceiveresult,
                  'addperson': vm.addperson,
                  'stamp': vm.stamp,
                  'account': vm.account
                };
                vm.additionalMail = "";
                $scope.functionexecute(paramFilterPrint);
              }
            }
          }
        }
      }],
      controllerAs: 'filterprintreports'
    };
    return directive;
  }
})();
/* jshint ignore:end */
