/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalexceptions', modalexceptions);

  modalexceptions.$inject = ['$filter'];
  /* @ngInject */
  function modalexceptions($filter) {
    var directive = {
      templateUrl: 'app/widgets/modal-exceptions.html',
      restrict: 'EA',
      scope: {
        openmodal: '=?openmodal',
        detailerror: '=?detailerror',
        idcontrol: '=?idcontrol'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.validated = validated
        vm.modaldetail = modaldetail;
        vm.closemodaldatail = closemodaldatail;
        vm.idcontrol = '1';

        $scope.$watch('idcontrol', function () {
          if ($scope.idcontrol !== undefined) {
            vm.idcontrol = $scope.idcontrol;
          }
        });

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.validated();
          }
          $scope.openmodal = false;
        });

        function modaldetail() {
          UIkit.modal("#modal_full" + vm.idcontrol).show();
        }

        function closemodaldatail() {
          UIkit.modal("#errormodal" + vm.idcontrol).show();
        }

        function validated() {
          var data = {};
          if ($scope.detailerror.status === 401) {
            vm.detail = {
              'code': $scope.detailerror.status,
              'message': $scope.detailerror.statusText,
              'url': $scope.detailerror.config.url,
            };

            UIkit.modal("#errormodal" + vm.idcontrol).show();
          }
          else if ($scope.detailerror.code !== undefined) {
            vm.detail = {
              'code': $scope.detailerror.code,
              'message': $scope.detailerror.message,
              'url': $scope.detailerror.url,
              'detail': $scope.detailerror.detail
            };
            UIkit.modal("#errormodal" + vm.idcontrol).show();
          }
          else if ($scope.detailerror.data === undefined || $scope.detailerror.data === null || $scope.detailerror.status === -1) {
            vm.detail = {
              'code': '404',
              'message': $filter('translate')('0023'),
              'url': $scope.detailerror.config.url,
            };
            UIkit.modal("#errormodal" + vm.idcontrol).show();
            // UIkit.modal("#seccioncaducado").show(); 
          }

          else {


            if ($scope.detailerror.data.code === 0) {
              data = $scope.detailerror.data;
            }

            if ($scope.detailerror.data.code === 1) {
              data = $scope.detailerror.data;
            }

            if ($scope.detailerror.data.code === 2) {

              $scope.detailerror.data.errorFields.forEach(function (value) {
                var item = value.split('|');
                if (item[0] === '0') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0094') + ': ' + item[1] + ' ';
                }
                if (item[0] === '2') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0095') + ': ' + item[1] + ' ';
                }
                if (item[0] === '3') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0096') + ': ' + item[1] + ' ';
                }
                if (item[0] === '4') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0097') + ': ' + item[1] + ' ';
                }
                if (item[0] === '5') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0098') + ': ' + item[1] + ' ';
                }
                if (item[0] === '6') {
                  $scope.detailerror.data.message =
                    $scope.detailerror.data.message +
                    $filter('translate')('0099') + ': ' + item[1] + ' ';
                }

              });
            }
            //UIkit.modal("#errormodal").show();
          }


          if ($scope.detailerror.status === 401) {
            UIkit.modal("#seccioncaducado").show();
          }


          if ($scope.detailerror.data !== null) {
            vm.detail = {
              'code': $scope.detailerror.data.code,
              'message': $scope.detailerror.data.message,
              'url': $scope.detailerror.data.host + ' ' + $scope.detailerror.data.url,
              'detail': $scope.detailerror.data.detail

            }
            UIkit.modal("#errormodal" + vm.idcontrol).show();

          }

        }

      }],
      controllerAs: 'modalexceptions'
    };
    return directive;

  }

})();
/* jshint ignore:end */
