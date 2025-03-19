
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.webquerymanagement')
    .controller('WebquerymanagementController', WebquerymanagementController);


    WebquerymanagementController.$inject = ['localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'webqueryDS','LZString','$translate'];

  function WebquerymanagementController(localStorageService, logger, $filter, $state, moment, $rootScope, webqueryDS,LZString,$translate) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.loadingdata = false;
    vm.title = 'webquerymanagement';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('3277');
    $rootScope.helpReference = '01. LaboratoryOrders/webQuery.htm';
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.usertype = 0;
    vm.accept = accept;
    vm.data = [];
    vm.windowOpenReport = windowOpenReport;
    vm.generateFileorder = generateFileorder;
    $rootScope.pageview = 3;

    function accept() {
      vm.loadingdata = true;
      vm.data = [];
      var data = {
          "dateinit": moment(vm.rangeInit).format('YYYYMMDD'),
          "dateend": moment(vm.rangeEnd).format('YYYYMMDD'),
          "role": vm.usertype,

      }
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return webqueryDS.updatepassworduser(auth.authToken, data).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
              if(data.data.length == 0){
                logger.warning($filter('translate')('3278'));
              }
              else {
                vm.datareport = data.data;
                vm.generateFileorder()
              }
             
          } else {
              UIkit.modal('#nofoundfilter').show();
          }
      },
      function (error) {
          vm.modalError(error);
      });

    }

    function generateFileorder() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.variables = {
          'abbreviation': 'CLT',
          'date': moment().format('DD/MM/YYYY, HH:mm:ss'),
          'username': auth.userName
      };
      vm.pathreport = '/Report/pre-analitic/passwordwebquery/resetpasswordwebquery.mrt';
      vm.openreport = false;
      vm.report = false;
      vm.windowOpenReport();
    }

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

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      }
      else {
        vm.init();
      }
    }

    function init() {
      vm.loadingdata = true;
        
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return webqueryDS.getusertype(auth.authToken).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
              vm.data = data.data;

              vm.PHYSICIAN_WEBQUERY = false;
              vm.PATIENT_WEBQUERY = false;
              vm.ACCOUNT_WEBQUERY = false;
              vm.DEMOGRAPHIC_WEBQUERY = false;
              vm.RATE_WEBQUERY = false;

              vm.data.forEach( function(element) {
                switch (element.type) {
                  case 1:
                    vm.PHYSICIAN_WEBQUERY = element.visible
                    break;
                  case 2:
                    vm.PATIENT_WEBQUERY = element.visible
                    break;
                  case 3:
                    vm.ACCOUNT_WEBQUERY = element.visible
                    break;
                   case 5:
                    vm.DEMOGRAPHIC_WEBQUERY = element.visible
                    break;
                  case 6:
                    vm.RATE_WEBQUERY = element.visible
                    break;
                 
                }
              });

          } else {
              UIkit.modal('#nofoundfilter').show();
          }
      },
      function (error) {
          vm.modalError(error);
      });
    }

    vm.isAuthenticate();

  }

})();
/* jshint ignore:end */