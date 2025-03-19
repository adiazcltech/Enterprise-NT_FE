(function () {
    "use strict";
    angular
        .module("app.Demographicdependency")
        .controller(
            "DemographicdependencyController",
            DemographicdependencyController
        )
        .controller("branchdemographiRequerid", branchdemographiRequerid);
    DemographicdependencyController.$inject = [
        "demographicDS",
        "demographicsItemDS",
        "configurationDS",
        "localStorageService",
        "logger",
        "ModalService",
        "$filter",
        "$state",
        "$rootScope",
        "demographicsoonDS",
        "socket"
    ];

    function DemographicdependencyController(
        demographicDS,
        demographicsItemDS,
        configurationDS,
        localStorageService,
        logger,
        ModalService,
        $filter,
        $state,
        $rootScope,
        demographicsoonDS,
        socket
    ) {
        var vm = this;
        $rootScope.menu = true;
        vm.init = init;
        vm.title = "Demographicdependency";
        vm.name = ["name"];
        vm.sortReverse = false;
        vm.sortType = vm.name;
        vm.Itemname = ["name", "selected"];
        vm.Itemselected = ["-selected", "name"];
        vm.sortReverse1 = false;
        vm.sortType1 = vm.Itemselected;
        vm.getidchange = getidchange;
        vm.selected = -50;
        vm.dataItemDemographics1 = [];
        vm.isDisabled = false;
        vm.isAuthenticate = isAuthenticate;
        vm.getid = getid;
        vm.nameDemographic = false;
        vm.save = save;
        vm.modalError = modalError;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.modalrequired = modalrequired;
        vm.getdemograficchange = getdemograficchange;
        vm.removeDatademografic = removeDatademografic;
        vm.loadingdata = true;
        vm.dataItemDemographics = [];
        vm.change = change;
        vm.demograficsoon = demograficsoon;
        vm.changeitems = changeitems;
        vm.demografifather = demografifather;
        vm.changeConfiguration = changeConfiguration;
        vm.noConnected = false;

        //** Metodo configuración formato**//
        function getConfigurationFormatDate() {
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return configurationDS
                .getConfigurationKey(auth.authToken, "FormatoFecha")
                .then(
                    function (data) {
                        vm.getdemograficchange();
                        if (data.status === 200) {
                            vm.formatDate = data.data.value.toUpperCase();
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //** Metodo para obtener todos los demograficos**//
        function getdemograficchange() {
            vm.loadingdata = true;
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return demographicDS.getDemographicsALL(auth.authToken).then(
                function (data) {
                    vm.lisdemografic =
                        data.data.length === 0 ? data.data : removeDatademografic(data);
                    vm.modalrequired();
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        //** Metodo que arma el arreglo para el combo demograficos**//
        function removeDatademografic(data) {
            vm.demografic = [];
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            data.data.forEach(function (value, key) {
                if (value.id < 0 && value.encoded) {
                    switch (value.id) {
                        case -1:
                            value.name = $filter('translate')('0248');
                            break;
                        case -2:
                            value.name = $filter('translate')('0225');
                            break;
                        case -3:
                            value.name = $filter('translate')('0307');
                            break;
                        case -4:
                            value.name = $filter('translate')('0133');
                            break;
                        case -5:
                            value.name = $filter('translate')('0075');
                            break;
                        case -6:
                            value.name = $filter('translate')('0175');
                            break;
                        case -7:
                            value.name = $filter('translate')('0174');
                            break;
                        case -10:
                            value.name = $filter('translate')('0645');
                            break;
                        default:
                            value.name = value.name;
                    }
                    var object = {
                        id: value.id,
                        name: value.name,
                    };
                    vm.demografic.push(object);

                } else {
                    if (value.encoded && value.state) {
                        var object = {
                            id: value.id,
                            name: value.name,
                        };
                        vm.demografic.push(object);
                    }
                    data.data[key].username = auth.userName;
                }
            });
            return vm.demografic;
        }
        // funcion para sacar la ventana modal de requeridos
        function modalrequired() {
            vm.loadingdata = false;
            if (vm.lisdemografic.length === 0) {
                ModalService.showModal({
                    templateUrl: "requerid.html",
                    controller: "alamadaysrequidController",
                    inputs: {
                        hidedemographics: vm.lisdemografic.length,
                        hidetest: 8,
                    },
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $state.go(result.page);
                    });
                });
            }
        }
        //** Método para cuando se selecciona todos**//
        function change() {
            if (vm.filtered1.length !== 0) {
                vm.filtered1.forEach(function (value) {
                    value.selected = vm.nameDemographic;
                });
            }
        }
        //metodo que se consulta los items demograficos a cambiarlo en el combo
        function getidchange() {
            vm.dataItemDemographics = [];
            vm.search2 = '';
            vm.demographisoon = '';
            vm.dataItemDemographics1 = [];
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return demographicsItemDS
                .getDemographicsItemsAll(auth.authToken, 0, vm.lisdemograficfather.id)
                .then(
                    function (data) {
                        if (data.status === 200) {
                            vm.dataItemDemographics = data.data;
                            vm.selected = vm.dataItemDemographics[0].demographicItem.id
                            vm.sortReverse1 = false;
                            vm.sortType1 = vm.Itemselected;
                            vm.demograficsoon();

                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //metodo que se consulta los items hijos del demografico hijo
        function changeitems() {
            vm.dataItemDemographics1 = [];
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return demographicsoonDS
                .getdemographicsitemssons(auth.authToken, vm.lisdemograficfather.id, vm.selected, vm.demographisoon)
                .then(
                    function (data) {
                        if (data.status === 200) {
                            vm.dataItemDemographics1 = data.data;
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //metodo que se si el demográfico hijo tiene una relación con el padre demografico
        function demografifather() {
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            return demographicsoonDS
                .demographicssons(auth.authToken, vm.demographisoon)
                .then(
                    function (data) {
                        if (data.data !== 0) {
                            vm.demographisoon = '';
                            logger.error($filter("translate")("1164"));
                        } else {
                            vm.changeitems();
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //metodo que se consulta los items demograficos a seleccionar el demografico
        function demograficsoon() {
            vm.demographisoon = '';
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            vm.lisdemograficsoon = $filter("filter")(vm.lisdemografic, function (e) {
                return e.id !== vm.lisdemograficfather.id;
            });

            return demographicsoonDS
                .demographicssons(auth.authToken, vm.lisdemograficfather.id)
                .then(
                    function (data) {
                        if (data.data !== 0) {
                            vm.demographisoon = data.data;
                            vm.changeitems();
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //metodo que se consulta los items demograficos a seleccionar el demografico
        function getid(data) {
            vm.selected = data.demographicItem.id;
            if (vm.demographisoon !== '') {
                vm.dataItemDemographics1 = [];
                var auth = localStorageService.get("Enterprise_NT.authorizationData");
                return demographicsoonDS
                    .getdemographicsitemssons(auth.authToken, vm.lisdemograficfather.id, vm.selected, vm.demographisoon)
                    .then(
                        function (data) {
                            if (data.status === 200) {
                                vm.dataItemDemographics1 = data.data;
                            }
                        },
                        function (error) {
                            vm.modalError(error);
                        }
                    );
            }
        }

        /*Cambio de dependencia */
        function changeConfiguration() {
            try {
                socket.emit('change:configuration', {
                    configuration: 'demographicdependency'
                });
            } catch (error) {
                vm.noConnected = true;
            }
        }

        //** Método que guarda**//
        function save() {
            vm.loadingdata = true;
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            var datasave = $filter("filter")(vm.dataItemDemographics1, function (e) {
                return e.selected === true;
            });
            var data = {
                'idDemographicFather': vm.lisdemograficfather.id,
                'idDemographicFatherItem': vm.selected,
                'idDemographicSon': vm.demographisoon,
                'demographicSonItems': datasave
            }
            return demographicsoonDS
                .updatedemographicsitemssons(auth.authToken, data)
                .then(
                    function (data) {
                        if (data.status === 200) {
                            vm.changeitems();
                            vm.changeConfiguration();
                            logger.success($filter("translate")("0042"));
                            vm.loadingdata = false;
                            return data;
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
        }
        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            if (auth === null || auth.token) {
                $state.go("login");
            } else {
                vm.init();
            }
        }
        //** Método para sacar el popup de error**//
        function modalError(error) {
            vm.loadingdata = false;
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        //** Método para inicializar la pagina**//
        function init() {
            vm.getConfigurationFormatDate();
        }
        vm.isAuthenticate();
    }
    //** Controller de la vetana modal de datos requeridos*//
    function branchdemographiRequerid($scope, hidedemographics, hidetest, close) {
        $scope.hidedemographics = hidedemographics;
        $scope.hidetest = hidetest;
        $scope.close = function (page) {
            close({
                page: page,
            },
                500
            ); // close, but give 500ms for bootstrap to animate
        };
    }
})();