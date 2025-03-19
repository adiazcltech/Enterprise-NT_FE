
(function () {
    'use strict';

    angular
        .module('app.mailconfigurate')
        .controller('mailconfigurateController', mailconfigurateController);


    mailconfigurateController.$inject = ['configurationDS', 'localStorageService', 'logger',
        '$filter', '$state', '$rootScope'];

    function mailconfigurateController(configurationDS, localStorageService,
        logger, $filter, $state, $rootScope) {

        var vm = this;
        vm.init = init;
        vm.title = 'Mailconfigurate';

        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0014');
        $rootScope.helpReference = '01.Configurate/mailconfigurate.htm';
        vm.isAuthenticate = isAuthenticate;

        vm.options = {
            height: 300,
            focus: true,
            lang: $filter('translate')('0000') === 'es' ? 'es-ES' : 'es-EU',
            toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['codeview']],
                ['help', ['help']]
            ]
        };

        vm.dataconfig = [];
        vm.get = get;
        vm.modalError = modalError;
        vm.save = save;
        vm.adduser = adduser;
        vm.addpassword = addpassword;
        vm.adddate = adddate;
        vm.addlab = addlab;
        vm.disableduser = false;

        // método par llamar el modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // método que consultas los datos del formulario
        function get() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfiguration(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.dataconfig = [{
                        "key": "CuerpoEmail",
                        "value": $filter('filter')(data.data, { key: 'CuerpoEmail' }, true)[0].value
                    },
                    {
                        "key": "Color",
                        "value": $filter('filter')(data.data, { key: 'Color' }, true)[0].value
                    },
                    {
                        "key": "SmtpAuthUser",
                        "value": $filter('filter')(data.data, { key: 'SmtpAuthUser' }, true)[0].value
                    },
                    {
                        "key": "SmtpHostName",
                        "value": $filter('filter')(data.data, { key: 'SmtpHostName' }, true)[0].value
                    },
                    {
                        "key": "SmtpPasswordUser",
                        "value": $filter('filter')(data.data, { key: 'SmtpPasswordUser' }, true)[0].value
                    },
                    {
                        "key": "SmtpPort",
                        "value": $filter('filter')(data.data, { key: 'SmtpPort' }, true)[0].value
                    },
                    {
                        "key": "SmtpSSL",
                        "value": $filter('filter')(data.data, { key: 'SmtpSSL' }, true)[0].value
                    },
                    {
                        "key": "ServidorCorreo",
                        "value": $filter('filter')(data.data, { key: 'ServidorCorreo' }, true)[0].value
                    }]
                }

            }, function (error) {
                vm.modalError(error);
            });
        }
        // método para guardar los datos del formulario
        function save() {
            vm.disableduser = false;
            var user = vm.dataconfig[0].value.split('||USER||');
            var password = vm.dataconfig[0].value.split('||LINK||');
            if (user.length === 1 || password.length === 1) {
                if (user.length === 1 && password.length === 1) {
                    vm.erroradd = $filter('translate')('0089');
                } else if (password.length === 1) {
                    vm.erroradd = $filter('translate')('0090');
                } else {
                    vm.erroradd = $filter('translate')('0091');
                }
                vm.disableduser = true;
            } else {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return configurationDS.updateConfiguration(auth.authToken, vm.dataconfig).then(function (data) {
                    if (data.status === 200) {
                        vm.get();
                        logger.success($filter('translate')('0022'));
                    }
                }, function (error) {
                    vm.modalError(error);
                });
            }

        }
        // método que añade el usuario
        function adduser() {
            vm.disableduser = false;
            var search = vm.dataconfig[0].value.split('||USER||');
            if (search.length > 1) {
                vm.erroradd = $filter('translate')('0092');
                vm.disableduser = true;
            } else {
                document.execCommand('insertHtml', null, '||USER||');
            }
        }
        // método que añade el contraseña
        function addpassword() {
            vm.disableduser = false;
            var search = vm.dataconfig[0].value.split('||LINK||');
            if (search.length > 1) {
                vm.erroradd = $filter('translate')('0093');
                vm.disableduser = true;
            } else {
                document.execCommand('insertHtml', null, '||LINK||');
            }
        }
        // método que añade el date
        function adddate() {
            vm.disableduser = false;
            document.execCommand('insertHtml', null, '||DATE||');
        }
        // método que añade el laboartorio
        function addlab() {
            vm.disableduser = false;
            document.execCommand('insertHtml', null, '||LAB||');
        }
        function init() {
            vm.dataconfig = [];
            vm.get();
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
        vm.isAuthenticate();
    }
})();
