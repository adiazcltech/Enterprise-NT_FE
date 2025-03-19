/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal           @descripción
                patientinformation  @descripción
                photopatient        @descripción
                order               @descripción
                testcode            @descripción
                testname            @descripción
                commentresult       @descripción
                commentpatology     @descripción
                notes               @descripción
                unctionexecute      @descripción
    
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/microbiologyReading/microbiologyReading.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultstestnotes', resultstestnotes);

    resultstestnotes.$inject = ['$filter', 'localStorageService', 'resultsentryDS'];

    /* @ngInject */
    function resultstestnotes($filter, localStorageService, resultsentryDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testnote.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                testid: '=testid',
                commentresult: '=commentresult',
                consultnotes: '=consultnotes',
                functionexecute: '=functionexecute',
                orderdemo: '=?orderdemo',
                state: '=state'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.savecomment = savecomment;
                vm.closemodalcommenttest = closemodalcommenttest;

                vm.notesOptions = {
                    menubar: false,
                    language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
                    br_newline_selector: true,
                    force_br_newlines: true,
                    force_p_newlines: false,
                    forced_root_block: false,
                    convert_newlines_to_brs: true,
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

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        $scope.openmodal = false;
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.order = $scope.order;
                        vm.testid = $scope.testid;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.orderdemo = $scope.orderdemo;
                        vm.disable = $scope.state > 3 ? true : false;

                        if ($scope.consultnotes) {
                            vm.commentnotes = "";
                            var auth = localStorageService.get('Enterprise_NT.authorizationData');
                            return resultsentryDS.getinternalcomment(auth.authToken, vm.order, vm.testid).then(function (data) {
                                if (data.status === 200) {
                                    vm.commentnotes = data.data.comment;
                                    UIkit.modal('#modalnotestest').show();
                                }
                            },
                                function (error) {
                                });
                        } else {
                            vm.commentnotes = "";
                            UIkit.modal('#modalnotestest').show();
                        }
                    }
                });

                function savecomment() {
                    var id = '#' + tinyMCE.activeEditor.id + "_ifr";
                    $scope.commentresult = $(id).contents().find("body").html() === '<br data-mce-bogus="1">' ? "" : $(id).contents().find("body").html();
                    UIkit.modal('#modalnotestest').hide();
                    if (!$scope.consultnotes && $scope.commentresult !== "" || $scope.consultnotes) {
                        setTimeout(function () { $scope.functionexecute(); }, 100);
                    }
                }

                function closemodalcommenttest() {
                    UIkit.modal('#modalnotestest').hide();
                }

            }],
            controllerAs: 'resultstestnotes'
        };
        return directive;
    }
})();
/* jshint ignore:end */


