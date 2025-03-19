(function () {
    'use strict';
    angular
        .module('app.termsandConditions')
        .controller('termsandConditionsController', termsandConditionsController);
    termsandConditionsController.$inject = ['configurationDS', 'localStorageService', 'logger',
        '$filter', '$state', '$rootScope'];
    function termsandConditionsController(configurationDS, localStorageService,
        logger, $filter, $state, $rootScope) {
        var vm = this;
        vm.init = init;
        vm.title = 'TermsandConditions';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0013');
        $rootScope.helpReference = '01.Configurate/termsandConditions.htm';
        vm.isAuthenticate = isAuthenticate;
        vm.options = {
            height: 358,
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
        vm.get = get;
        vm.modalError = modalError;
        vm.save = save;

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
                        "key": "TerminosCondiciones",
                        "value": $filter('filter')(data.data, { key: 'TerminosCondiciones' }, true)[0].value
                    },
                    {
                        "key": "Color",
                        "value": $filter('filter')(data.data, { key: 'Color' }, true)[0].value
                    }]
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // método para guardar los datos del formulario
        function save() {
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
            vm.get();
        }
        vm.isAuthenticate();

    }

})();
