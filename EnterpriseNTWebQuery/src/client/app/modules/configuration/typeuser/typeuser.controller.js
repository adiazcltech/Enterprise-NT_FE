
(function () {
    'use strict';
    angular
        .module('app.typeuser')
        .controller('typeuserController', typeuserController)
        .config(function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
        });
    typeuserController.$inject = ['usertypesDS', 'configurationDS', 'localStorageService', 'logger',
        '$filter', '$rootScope', '$state'];

    function typeuserController(usertypesDS, configurationDS, localStorageService,
        logger, $filter, $rootScope, $state) {

        var vm = this;
        vm.init = init;
        vm.title = 'Typeuser';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0012');
        vm.get = get;
        vm.modalError = modalError;
        vm.save = save;
        vm.changecheck = changecheck;
        $rootScope.helpReference = '01.Configurate/typeuser.htm';
        vm.getDemoConsultaWeb = getDemoConsultaWeb;
        vm.isAuthenticate = isAuthenticate;

        // Método que muestra el modal error        
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Método que consulta los datos del formulario   
        function get() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return usertypesDS.getusertype(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.datauser = data.data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // Método que desabilita los controles cuando el estado es falso   
        function changecheck(check) {
            if (check.visible === false) {
                check.message = "";
                check.quantityOrder = 0;
            } else {
                check.quantityOrder = 0;
            }
        }
        // Método que guarda los datos del formulario 
        function save() {
            for (var i = 0; i < vm.datauser.length; i++) {
                if (angular.element('#fileinput' + vm.datauser[i].type).children().length > 0) {
                    var photo = (angular.element('#fileinput' + vm.datauser[i].type).children()[0].src).split(',');
                    vm.datauser[i].image = photo[1];
                }
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return usertypesDS.updateusertype(auth.authToken, vm.datauser).then(function (data) {
                if (data.status === 200) {
                    vm.get();
                    logger.success($filter('translate')('0022'));
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        function getDemoConsultaWeb() {
            return configurationDS.getwebquery().then(function (data) {
                if (data.status === 200) {
                    vm.demoname = data.data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // Método que inicializa el formulario
        function init() {
            if (localStorageService.get('ManejoDemograficoConsultaWeb') === 'True') {
                vm.viewdemogra = true;
                vm.getDemoConsultaWeb();
            }
            vm.Doctor = $filter('translate')('0075');
            vm.Patient = $filter('translate')('0076');
            vm.Customer = $filter('translate')('0077');
            vm.Laboratory = $filter('translate')('0078');
            vm.All = $filter('translate')('0079');
            vm.colorentity = localStorageService.get('Color');
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
