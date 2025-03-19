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
        .directive('resultstestcomment', resultstestcomment);

    resultstestcomment.$inject = ['localStorageService'];

    /* @ngInject */
    function resultstestcomment(localStorageService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-testcomment.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                commentresult: '=commentresult',
                commentpatology: '=commentpatology',
                notes: '=notes',
                orderdemo: '=?orderdemo',
                functionexecute: '=functionexecute'                
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.htmlEntities = htmlEntities;
                vm.savecomment = savecomment;
                vm.closemodalcommenttest = closemodalcommenttest;
                vm.viewcomment = false;
                vm.saveDocuments = saveDocuments;
                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.order = $scope.order;
                        vm.testcode = $scope.testcode;
                        vm.testname = $scope.testname;
                        vm.orderdemo = $scope.orderdemo;
                        vm.commentresult = $scope.commentresult;
                        vm.commentpatology = $scope.commentpatology;
                        vm.notes = $scope.notes === undefined ? [] : $scope.notes;
                        vm.viewcomment = true;
                        UIkit.modal('#modalcommenttest').show();
                        $scope.openmodal = false;
                    }
                });
                function savecomment() {
                    var id = '#' + tinyMCE.activeEditor.id + "_ifr";
                    var comment = $(id).contents().find("body").html() === '<br data-mce-bogus="1">' || ($(id).contents().find("body").html()).trim() === '' ? " " : $(id).contents().find("body").html();
                    if (comment === " " || comment === "" || comment === undefined || comment === null) {
                        UIkit.modal('#confirmationcomment', { modal: false }).show()
                    } else {
                        var htmlEntities = vm.htmlEntities(comment);
                        if (htmlEntities === '' || htmlEntities.trim() === '') {
                            UIkit.modal('#confirmationcomment', { modal: false }).show()
                        } else {
                            $scope.commentpatology = vm.commentpatology;
                            $scope.commentresult = comment;
                            vm.commentresult = $scope.commentresult;
                            UIkit.modal('#modalcommenttest').hide();
                            setTimeout(function () { $scope.functionexecute(); }, 100);
                        }
                    }
                }
                function htmlEntities(str) {
                    var valorhtml = String(str).replace(/&ntilde;/g, 'ñ')
                        .replace(/\n/g, "  ")
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
                        .replace(/&nbsp;/g, '')
                        .replace(/<[^>]+>/gm, '')
                    return valorhtml;
                }
                function closemodalcommenttest() {
                    UIkit.modal('#modalcommenttest').hide();
                }
                function saveDocuments() {
                    $scope.commentpatology = vm.commentpatology;
                    $scope.commentresult = " ";
                    vm.commentresult = " ";
                    UIkit.modal('#modalcommenttest').hide();
                    setTimeout(function () { $scope.functionexecute(); }, 100);
                }
            }],
            controllerAs: 'resultstestcomment'
        };
        return directive;
    }
})();
/* jshint ignore:end */