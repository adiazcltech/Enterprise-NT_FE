(function () {
    'use strict';

    angular
        .module('app.options')
        .controller('optionsController', optionsController);


    optionsController.$inject = ['configurationDS', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', '$interval'];

    function optionsController(configurationDS, localStorageService,
        logger, $filter, $state, moment, $rootScope, $interval) {

        var vm = this;
        vm.init = init;
        vm.title = 'Options';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0011');
        $rootScope.helpReference = '01.Configurate/options.htm';
        vm.get = get;
        vm.modalError = modalError;
        vm.arrayslist = arrayslist;
        vm.save = save;
        vm.keyrequerid = false;
        vm.isAuthenticate = isAuthenticate;

        // método par llamar el modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // método que consultas los datos del formulario
        function get() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfiguration().then(function (data) {
                if (data.status === 200) {
                    vm.arrayslist(data.data);
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // metodo para ordernar los datos en un array
        function arrayslist(data) {

            vm.dataconfig = [
                {
                    "key": 'Historico',//0
                    "value": ($filter('filter')(data, { key: 'Historico' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "HistoricoGrafica",//1
                    "value": ($filter('filter')(data, { key: 'HistoricoGrafica' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "HistoricoCombinado",//2
                    "value": ($filter('filter')(data, { key: 'HistoricoCombinado' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "Captcha",//3
                    "value": ($filter('filter')(data, { key: 'Captcha' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "CambioContraseña",//4
                    "value": ($filter('filter')(data, { key: 'CambioContraseña' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "ValidaSaldoPendiente",//5
                    "value": ($filter('filter')(data, { key: 'ValidaSaldoPendiente' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "BusquedaOrden",//6
                    "value": ($filter('filter')(data, { key: 'BusquedaOrden' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "MostrarConfidenciales",//7
                    "value": ($filter('filter')(data, { key: 'MostrarConfidenciales' }, true)[0].value).toLowerCase() === 'false' ? false : true
                },
                {
                    "key": "BloqueaPanicos",//8
                    "value": $filter('filter')(data, { key: 'BloqueaPanicos' }, true)[0].value
                },
                {
                    "key": "MostrarResultado",//9
                    "value": $filter('filter')(data, { key: 'MostrarResultado' }, true)[0].value
                },
                {
                    "key": "LlaveCaptcha",//10
                    "value": $filter('filter')(data, { key: 'LlaveCaptcha' }, true)[0].value
                },
                {
                    "key": "Color",//11
                    "value": $filter('filter')(data, { key: 'Color' }, true)[0].value
                },
                 {
                    "key": "ServiciosLISUrl",//12
                    "value": $filter('filter')(data, { key: 'ServiciosLISUrl' }, true)[0].value
                },
                {
                    "key": "PathFE",//13
                    "value": $filter('filter')(data, { key: 'PathFE' }, true)[0].value
                },
            ]
        }
        // método para guardar los datos del formulario
        function save(Form) {
            Form.code.$touched = true;
            Form.path.$touched = true;
            if(Form.$valid){
            vm.keyrequerid = false;
            if (vm.dataconfig[3].value === true && vm.dataconfig[10].value === '') {
                vm.keyrequerid = true;

            } else {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return configurationDS.updateConfiguration(auth.authToken, vm.dataconfig).then(function (data) {
                    if (data.status === 200) {
                        data.data.forEach(function (value, key) {
                            return localStorageService.set(value.key, value.value);
                        });
                        vm.get();
                        logger.success($filter('translate')('0022'));
                    }
                }, function (error) {
                    vm.modalError(error);
                });
            }
            }
        }
        // método que inicializa la página
        function init() {
            vm.get();
        }
        //** Metodo que valida la autenticación**//
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
