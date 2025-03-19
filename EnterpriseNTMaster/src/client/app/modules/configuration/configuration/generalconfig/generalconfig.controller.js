(function () {
    'use strict';
    angular.module('app.generalconfig')
        .controller('generalconfigController', generalconfigController)
        .controller('ConfirmController', ConfirmController);
    generalconfigController.$inject = ['configurationDS', 'ordertypeDS', 'authenticationsessionDS', 'ModalService',
        'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'socket'
    ];

    function generalconfigController(configurationDS, ordertypeDS, authenticationsessionDS, ModalService,
        localStorageService, logger, $filter, $state, moment, $rootScope, socket) {
        var vm = this;
        $rootScope.menu = true;
        $rootScope.blockView = true;
        vm.login = login;
        vm.visibleBranch = false;
        vm.invalidUser = false;
        vm.invalidDate = false;
        vm.user = {};
        vm.user.location = 1;
        vm.init = init;
        vm.title = 'generalconfig';
        vm.isAuthenticate = isAuthenticate;
        vm.getId = getId;
        vm.saveCancel = saveCancel;
        vm.cancel = cancel;
        vm.updateConfiguration = updateConfiguration;
        vm.modalError = modalError;
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
        vm.sectionId = 0;
        vm.loadingdata = true;
        vm.getdocumentType = getdocumentType;
        vm.configinicial = configinicial;
        vm.save = save;
        vm.version = localStorageService.get('Version');
        vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.getOrderType = getOrderType;
        vm.changeConfiguration = changeConfiguration;
        vm.noConnected = false;
        /*performs login operation */
        function login(page) {
            vm.invalidUser = false;
            vm.invalidDate = false;
            vm.loadingdata = true;
            vm.menssageInvalid = '';
            if (vm.user.user && vm.user.password && vm.user.user === vm.auth.userName) {
                vm.user.branch = -1;
                return authenticationsessionDS.loginlaboratory(vm.auth.authToken, vm.user).then(function (data) {
                    if (data.data.success) {
                        vm.loadingdata = false;
                        $state.go(page);
                        vm.getId();
                    }
                }, function (error) {
                    vm.loadingdata = false;
                    if (error.data !== null) {
                        if (error.data.message === 'timeout') {
                            vm.menssageInvalid = $filter('translate')('1070');
                        } else if (error.data.errorFields === null && error.data.message !== 'timeout') {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        } else {
                            if (error.data.errorFields[0] === 'La licencia registrada ha expirado.') {
                                vm.menssageInvalid = $filter('translate')('1077');
                            } else {
                                error.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '4') {
                                        if (item[1] === 'inactive user') {
                                            vm.menssageInvalid = $filter('translate')('1096');
                                        } else {
                                            vm.menssageInvalid = $filter('translate')('0097');
                                        }
                                    }
                                    if (item[0] === '5') {
                                        vm.menssageInvalid = $filter('translate')('0098');
                                    }
                                    if (item[0] === '3') {
                                        vm.menssageInvalid = '';
                                        vm.menssageInvalid = $filter('translate')('1095');
                                    }
                                    if (item[0] === '6') {
                                        vm.Repeat = true;
                                        if (item[1] === 'password expiration date') {
                                            vm.menssageInvalid = "la contraseña expiro debe cambiarla"
                                            vm.administrator = item[3];
                                        } else {
                                            vm.menssageInvalid = $filter('translate')('1038');
                                        }

                                    }
                                    if (item[0] === '7') {
                                        if (item[1] === 'change password') {
                                            vm.menssageInvalid = "la contraseña expiro debe cambiarla"
                                            vm.administrator = item[3];
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                logger.info($filter('translate')('0097'));
                vm.menssageInvalid = $filter('translate')('0097');
                vm.loadingdata = false;
            }
        }
        //** Metodo para validar aplicar el tipo de cocumentos**//
        function getdocumentType(value) {
            vm.dataconfig[14].value = !value ? false : vm.dataconfig[14].value;
        }
        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.init();
            }
        }
        //** Metodo para consutar uns lista de los tipos de ordenes**//
        function getOrderType() {
            return ordertypeDS.get(vm.auth.authToken).then(function (data) {
                vm.listOrderType = [];
                data.data.forEach(function (value) {
                    vm.listOrderType.push({
                        'id': value.id,
                        'name': value.name
                    });
                })
                vm.listOrderType = $filter('orderBy')(vm.listOrderType, 'name');
                if (data.data.length == 0) {
                    vm.listOrderType = undefined;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Método que se comunica con el dataservice y trae los datos por el id**//
        function getId() {
            vm.loadingdata = true;
            return configurationDS.getConfiguration(vm.auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.sectionId = 1;
                    vm.usuario = $filter('translate')('0017') + ' ';
                    vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
                    vm.usuario = vm.usuario + vm.auth.userName;
                    vm.usuario = $filter('translate')('0017') + ' ';
                    vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
                    vm.usuario = vm.usuario + vm.auth.userName;
                    vm.configinicial(data);
                    vm.loadingdata = false;
                }

            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Metodo para la configuración inicial**//
        function configinicial(data) {
            vm.dataconfig = [{
                "key": "Entidad", //0
                "value": $filter('filter')(data.data, {
                    key: 'Entidad'
                }, true)[0].value
            },
            {
                "key": "Abreviatura", //1
                "value": $filter('filter')(data.data, {
                    key: 'Abreviatura'
                }, true)[0].value
            },
            {
                "key": "FormatoFecha", //2
                "value": $filter('filter')(data.data, {
                    key: 'FormatoFecha'
                }, true)[0].value
            },
            {
                "key": "FormatoTelefono", //3
                "value": $filter('filter')(data.data, {
                    key: 'FormatoTelefono'
                }, true)[0].value
            },
            {
                "key": "SeparadorLista", //4
                "value": $filter('filter')(data.data, {
                    key: 'SeparadorLista'
                }, true)[0].value
            },
            {
                "key": "UrlDischarge", //5
                "value": $filter('filter')(data.data, {
                    key: 'UrlDischarge'
                }, true)[0].value
            },
            {
                "key": "UrlSecurity", //6
                "value": $filter('filter')(data.data, {
                    key: 'UrlSecurity'
                }, true)[0].value
            },
            {
                "key": "DiasClave", //7
                "value": $filter('filter')(data.data, {
                    key: 'DiasClave'
                }, true)[0].value === '' ? '' : parseFloat($filter('filter')(data.data, {
                    key: 'DiasClave'
                }, true)[0].value)
            },
            {
                "key": "SessionExpirationTime", //8
                "value": $filter('filter')(data.data, {
                    key: 'SessionExpirationTime'
                }, true)[0].value === '' ? '' : parseFloat($filter('filter')(data.data, {
                    key: 'SessionExpirationTime'
                }, true)[0].value)
            },
            {
                "key": "TokenExpirationTime", //9
                "value": $filter('filter')(data.data, {
                    key: 'TokenExpirationTime'
                }, true)[0].value === '' ? '' : parseFloat($filter('filter')(data.data, {
                    key: 'TokenExpirationTime'
                }, true)[0].value)
            },
            {
                "key": "SecurityPolitics", //10
                "value": $filter('filter')(data.data, {
                    key: 'SecurityPolitics'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "ManejoServicio", //11
                "value": $filter('filter')(data.data, {
                    key: 'ManejoServicio'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "ManejoMedico", //12
                "value": $filter('filter')(data.data, {
                    key: 'ManejoMedico'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "ManejoRaza", //13
                "value": $filter('filter')(data.data, {
                    key: 'ManejoRaza'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "ManejoTipoDocumento", //14
                "value": $filter('filter')(data.data, {
                    key: 'ManejoTipoDocumento'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "HistoriaAutomatica", //15
                "value": $filter('filter')(data.data, {
                    key: 'HistoriaAutomatica'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "ValorInicialTipoOrden", //16
                "value": $filter('filter')(data.data, {
                    key: 'ValorInicialTipoOrden'
                }, true)[0].value === '' ? '' : parseInt($filter('filter')(data.data, {
                    key: 'ValorInicialTipoOrden'
                }, true)[0].value)
            },
            {
                "key": "ManejoMultiSedes", //17
                "value": $filter('filter')(data.data, {
                    key: 'ManejoMultiSedes'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "UrlLIS", //18
                "value": $filter('filter')(data.data, {
                    key: 'UrlLIS'
                }, true)[0].value
            },
            {
                "key": "DemographicsByBranch", //19
                "value": $filter('filter')(data.data, {
                    key: 'DemographicsByBranch'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "validarSesiones", //20
                "value": $filter('filter')(data.data, {
                    key: 'validarSesiones'
                }, true)[0].value === "False" ? false : true
            },
            {
                "key": "RecuperarContraseña", //21
                "value": $filter('filter')(data.data, {
                    key: 'RecuperarContraseña'
                }, true)[0].value === "False" ? false : true
            },            
            ]
            vm.loadingdata = false;
        }

        /*Cambio de configuracion */
        function changeConfiguration() {
            try {
                socket.emit('change:configuration', {
                    configuration: 'general'
                });
            } catch (error) {
                vm.noConnected = true;
            }
        }

        //** Método que guarda o cancela la modificación de una llave de configuración**//
        function saveCancel() {
            if (vm.sectionId !== 0) {
                ModalService.showModal({
                    templateUrl: 'Confirmation.html',
                    controller: 'ConfirmController'
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        if (result.execute === 'yes') {
                            vm.updateConfiguration();
                        } else {
                            vm.getId();
                        }
                    });
                });
            }
        }
        //** Metodo que preparar el JSON para guardar la configuración inicial**//
        function updateConfiguration() {
            vm.dataconfig[10].value = vm.dataconfig[10].value === false ? "False" : "True";
            vm.dataconfig[11].value = vm.dataconfig[11].value === false ? "False" : "True";
            vm.dataconfig[12].value = vm.dataconfig[12].value === false ? "False" : "True";
            vm.dataconfig[13].value = vm.dataconfig[13].value === false ? "False" : "True";
            vm.dataconfig[14].value = vm.dataconfig[14].value === false ? "False" : "True";
            vm.dataconfig[15].value = vm.dataconfig[15].value === false ? "False" : "True";
            vm.dataconfig[17].value = vm.dataconfig[17].value === false ? "False" : "True";
            vm.dataconfig[19].value = vm.dataconfig[19].value === false ? "False" : "True";
            vm.dataconfig[20].value = vm.dataconfig[20].value === false ? "False" : "True";
            vm.dataconfig[21].value = vm.dataconfig[20].value === false ? "False" : "True";
            vm.save();
        }
        //** Metodo para guardar la configuración inicial**//
        function save() {
            return configurationDS.updateConfiguration(vm.auth.authToken, vm.dataconfig).then(function (data) {
                vm.configinicial(data);
                vm.changeConfiguration();
                logger.success($filter('translate')('0042'));
            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Metodo para cancelar la configuración inicial**//
        function cancel() {
            vm.getId();
        }
        //** Método para sacar el popup de error**//
        function modalError(error) {
            vm.loadingdata = false;
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        //** Método que carga los metodos que inicializa la pagina*//
        function init() {
            vm.getOrderType();
            vm.listFormatDate = [{
                'id': 'dd/MM/yyyy',
                'name': $filter('translate')('0754')
            }, {
                'id': 'dd-MM-yyyy',
                'name': $filter('translate')('0755')
            }, {
                'id': 'dd.MM.yyyy',
                'name': $filter('translate')('0756')
            }, {
                'id': 'MM/dd/yyyy',
                'name': $filter('translate')('0757')
            }, {
                'id': 'MM-dd-yyyy',
                'name': $filter('translate')('0758')
            }, {
                'id': 'MM.dd.yyyy',
                'name': $filter('translate')('0759')
            }, {
                'id': 'yyyy/MM/dd',
                'name': $filter('translate')('0760')
            }, {
                'id': 'yyyy-MM-dd',
                'name': $filter('translate')('0761')
            }, {
                'id': 'yyyy.MM.dd',
                'name': $filter('translate')('0762')
            }];
            vm.listFormatDate = $filter('orderBy')(vm.listFormatDate, 'name');
            vm.loadingdata = false;
        }
        vm.isAuthenticate();
    }

    function ConfirmController($scope, close) {
        $scope.close = function (execute) {
            close({
                execute: execute
            }, 500); // close, but give 500ms for bootstrap to animate
        };
    }
})();