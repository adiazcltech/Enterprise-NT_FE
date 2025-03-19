/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal   @descripción
                destination @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('modalsampledelayed', modalsampledelayed);

    modalsampledelayed.$inject = ['sampletrackingsDS', 'localStorageService'];
    /* @ngInject */
    function modalsampledelayed(sampletrackingsDS, localStorageService) {
        var directive = {
            templateUrl: 'app/widgets/userControl/modal-sampledelayed.html',
            restrict: 'EA',
            scope: {
                openmodal: '=openmodal',
                destination: '=destination'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.getsample = getsample;


                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.getsample();
                        UIkit.modal("#samplerejectmodal").show();
                    }
                    $scope.openmodal = false;
                });


                function getsample() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return sampletrackingsDS.sampledelayed(auth.authToken, $scope.destination.id).then(function (data) {
                        if (data.status === 200) {
                            vm.Detail = data.data;
                        }
                    }, function (error) {
                        vm.Error = error;
                        vm.ShowPopupError = true;
                    });
                }
                function init() {
                }

                vm.init();

            }],
            controllerAs: 'modalsampledelayed'
        };
        return directive;

    }

})();
