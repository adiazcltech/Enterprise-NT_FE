/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal          @descripción
                order              @descripción
                test               @descripción
                patientinformation @descripción
                photopatient       @descripción
                notes              @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
 
********************************************************************************/

(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalresultstemplate', modalresultstemplate);

  modalresultstemplate.$inject = ['testDS', 'resultstemplateDS', 'localStorageService', '$filter', 'logger'];
  /* @ngInject */
  function modalresultstemplate(testDS, resultstemplateDS, localStorageService, $filter, logger) {
    var directive = {
      templateUrl: 'app/widgets/userControl/modal-resultstemplate.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        order: '=order',
        test: '=test',
        patientinformation: '=patientinformation',
        photopatient: '=photopatient',
        notes: '=notes',
        orderdemo: '=?orderdemo',
        functionexecute: '=functionexecute'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getest = getest;
        vm.getresultstemplate = getresultstemplate;
        vm.resetTemplate = resetTemplate;
        vm.changeResult = changeResult;
        vm.saveResultsTemplate = saveResultsTemplate;
        vm.viewcomment = false;

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.loadingdata=true;
            vm.resultstemplate = [];
            vm.comment='';
            vm.resultText = [];
            vm.orderdemo = $scope.orderdemo;
            vm.order = $scope.order;
            vm.testId = $scope.test;
            vm.getest();
            vm.getresultstemplate();
            vm.patient = $scope.patientinformation;
            vm.photopatient = $scope.photopatient;
            vm.notes = $scope.notes === undefined ? [] : $scope.notes;
            vm.viewcomment = true;
            UIkit.modal('#resultstemplate').show();
          }

          $scope.openmodal = false;
        });

        function getresultstemplate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.resultText = [];
          return resultstemplateDS.getresultemplateId(auth.authToken, vm.order, vm.testId).then(function (data) {
            if (data.status === 200) {
              vm.loadingdata=false;
              vm.comment=data.data.comment;        
              vm.resultstemplate = $filter('orderBy')(data.data.optionTemplates, 'sort');
            } else {
              vm.loadingdata=false;
              vm.resultstemplate = [];
              vm.comment='';
            }
          }, function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
          });
        }

        function resetTemplate() {
         vm.resultstemplate.forEach(function (value) {
            value.result = '';
          }); 
        }
  

        function getest() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return testDS.getTestById(auth.authToken, $scope.test).then(function (data) {
            if (data.status === 200) {
              vm.TestSelect = data.data;
            }
          }, function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
          });
        }

        function changeResult(ResultTemplate) {  
          if(ResultTemplate.result===''||ResultTemplate.result===undefined){
            ResultTemplate.result= ''+ vm.updateResult.result;
            vm.updateResult={};
          }else{
            ResultTemplate.result= ResultTemplate.result + '\n' + vm.updateResult.result;
            vm.updateResult={};
          }
        }

        function saveResultsTemplate() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
        /*   vm.resultstemplate.forEach(function (value, key) {
            value.result = vm.resultText[key] === '' || vm.resultText[key] === undefined ? value.result : vm.resultText[key];
          }); */
          return resultstemplateDS.newupdateresultstemplate(auth.authToken, $scope.order, vm.testId, vm.resultstemplate).then(function (data) {
            if (data.status === 200) {
              vm.resultstemplate = [];
              logger.success($filter('translate')('0626'));
              vm.getresultstemplate();
              if ($scope.functionexecute !== undefined) {
                $scope.functionexecute();
              }
            }
          }, function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
          });
        }

      }],
      controllerAs: 'modalresultstemplate'
    };
    return directive;

  }

})();
