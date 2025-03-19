/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS: comment @Descripción
    
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/recordresultbyrank/recordresultbyrank.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('codedcomment', codedcomment);

  codedcomment.$inject = ['$filter', 'localStorageService', 'commentDS','logger'];

  /* @ngInject */
  function codedcomment($filter, localStorageService, commentDS,logger) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/coded-comment.html',
      scope: {
        comment: '=?comment'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.getCodedComment = getCodedComment;
        vm.message = '';
        $scope.comment = vm.message;
        vm.getCodedComment();

        $scope.$watch('order', function () {
          vm.order = $scope.order;
        });
        $scope.onSelect = function (ev) {
          var item = ev.item;
          var widget = ev.sender;
          var model = widget.dataItem(item);

          if (vm.insertcomment) {
            $scope.comment = ev.dataItem.message + ' ' + $scope.comment;
          }
          else {
            $scope.comment = $scope.comment + ' ' + ev.dataItem.message;
          }
          codedcomment.comment = '';
        };

        vm.customMenu = {
          menubar: false,
          language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
          br_newline_selector : true,
          force_br_newlines : true,
          force_p_newlines : false,
          forced_root_block : false,
          convert_newlines_to_brs : true,
          plugins: [
            'link',
            'lists',
            'autolink',
            'anchor',
            'textcolor',
            'charmap'

          ],
          toolbar: [
            'bold italic underline superscript | fontselect fontsizeselect forecolor backcolor charmap | alignleft aligncenter alignright alignfull | numlist bullist outdent indent code '
          ]
        };
        function getCodedComment() {
          auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.ListComment = [];
          return commentDS.getComment(auth.authToken).then(function (data) {
            if (data.status === 200) {
            vm.ListComment = data.data;
            }else{
              logger.warning('Debes crear comentarios codificados para poder agregarlos');
            }
          },
            function (error) {
              vm.modalError();
            });
        }

        vm.changeComment = function (selected) {
          $scope.comment = $scope.comment === undefined || $scope.comment === null ? '' : $scope.comment;
          if (selected !== undefined) {
            if (!vm.insertcomment) {
              $scope.comment = $scope.comment + ' ' + selected.description.message;
            }
            else {
              $scope.comment = selected.description.message + ' ' + $scope.comment;
            }
            $scope.$broadcast('angucomplete-alt:clearInput', 'ex1');
          }

        };

      }],
      controllerAs: 'codedcomment'
    };
    return directive;
  }
})();
/* jshint ignore:end */


