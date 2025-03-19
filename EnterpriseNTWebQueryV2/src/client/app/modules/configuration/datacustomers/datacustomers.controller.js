(function () {
    'use strict';

    angular
        .module('app.datacustomers')
        .controller('datacustomersController', datacustomersController);


    datacustomersController.$inject = ['configurationDS', 'localStorageService',
        '$filter', '$state', '$rootScope', 'logger'];

    function datacustomersController(configurationDS, localStorageService,
        $filter, $state, $rootScope, logger) {


        var vm = this;
        vm.init = init;
        vm.title = 'Datacustomers';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0010');
        vm.get = get;
        vm.save = save;
        vm.loading=true;
        vm.modalError = modalError;
        vm.arrayslist = arrayslist;
        $rootScope.helpReference = '01.Configurate/datacustomers.htm';
        vm.isAuthenticate = isAuthenticate;

        // iniciliza el color picket
        vm.customSettings = {
            control: 'brightness',
            theme: 'bootstrap',
            position: 'bottom left'
        };
        // metodo del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // carga los datos de la pagina
        function get() {
            return configurationDS.getConfiguration().then(function (data) {
                if (data.status === 200) {
                    vm.arrayslist(data.data);
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // arreglo para guardar losa datos
        function arrayslist(data) {
            var logo = $filter('filter')(data, { key: 'Logo' }, true)[0].value;
            if (logo !== '') {              
                logo = logo;
                //logo = logo + '/imagen.png';
            }
            var Banner = $filter('filter')(data, { key: 'Banner' }, true)[0].value;
            if (Banner !== '') {
                Banner = Banner;
                //Banner = Banner + '/imagen.png';
            }

            var FondoLogin = $filter('filter')(data, { key: 'FondoLogin' }, true)[0].value;
            if (FondoLogin !== '') {
                FondoLogin = FondoLogin;
            }

            vm.dataconfig = [
                {
                    "key": "URL",//0
                    "value": $filter("filter")(data, function (e) { return e.key === 'URL' })[0].value
                },
                {
                    "key": "Color",//1
                    "value": $filter("filter")(data, function (e) { return e.key === 'Color' })[0].value
                },
                {
                    "key": "Titulo",//2
                    "value": $filter("filter")(data, function (e) { return e.key === 'Titulo' })[0].value
                },
                {
                    "key": "Logo",//3
                    "value": logo
                },
                {
                    "key": "Banner",//4
                    "value": Banner
                },
                {
                    "key": "Informacion",//5
                    "value": $filter("filter")(data, function (e) { return e.key === 'Informacion' })[0].value
                },
                {
                    "key": "Informacion2",//6
                    "value": $filter("filter")(data, function (e) { return e.key === 'Informacion2' })[0].value
                },
                {
                    "key": "FondoLogin",//7
                    "value": FondoLogin
                },
            ]
            if ($filter('translate')('0001') === 'Usuario') {
                $(document).ready(function () {
                    $('.dropify').dropify({
                        messages: {
                            'default': 'Arrastre y suelte un archivo aquí o haga clic en',
                            'replace': 'Arrastre y suelte o haga clic para reemplazar',
                            'remove': 'Eliminar',
                            'error': 'Ooops, algo pasó mal.'
                        },
                        error: {
                            'fileSize': 'El tamaño máximo es ({{ value }}).',
                            'fileExtension': 'Solo archivos ({{ value }}).'
                        }
                    });
                });
            } else {
                $(document).ready(function () {
                    $('.dropify').dropify();
                });
            }
            if (logo !== '') {              
                document.getElementsByClassName('dropify-render')[0].innerHTML='<img src="'+logo+'"style="max-height: 300px;"/>';
            }
            if (Banner !== '') {
                document.getElementsByClassName('dropify-render')[1].innerHTML='<img src="'+Banner+'"style="max-height: 300px;"/>';
            }          
            if (FondoLogin !== '') {
                document.getElementsByClassName('dropify-render')[2].innerHTML='<img src="'+FondoLogin+'"style="max-height: 300px;"/>';
            }
            vm.loading=false;
        }
        // guarda los datos del formulario
        function save() {
            if (vm.dataconfig[3].value = angular.element('#contentlogo .dropify-render').children()[0] === undefined) {
                vm.dataconfig[3].value = '';
            } else {
                vm.dataconfig[3].value = (angular.element('#contentlogo .dropify-render').children()[0].src);
            }
            if (vm.dataconfig[4].value = angular.element('#contentbanner .dropify-render').children()[0] === undefined) {
                vm.dataconfig[4].value = '';
            } else {
                vm.dataconfig[4].value = (angular.element('#contentbanner .dropify-render').children()[0].src);
            }
            if (vm.dataconfig[7].value = angular.element('#contentlogin .dropify-render').children()[0] === undefined) {
                vm.dataconfig[7].value = '';
            } else {
                vm.dataconfig[7].value = (angular.element('#contentlogin .dropify-render').children()[0].src);
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.updateConfiguration(auth.authToken, vm.dataconfig).then(function (data) {
                if (data.status === 200) {
                    vm.dataconfig.forEach(function (value, key) {
                        return localStorageService.set(value.key, value.value);
                    });
                    logger.success($filter('translate')('0022'));
                    vm.get();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // incializa el input file
        function init() {
            setTimeout(function () {
            vm.get();
        }, 100);
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
