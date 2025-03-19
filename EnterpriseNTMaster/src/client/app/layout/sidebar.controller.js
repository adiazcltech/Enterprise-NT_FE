(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController)
        .config(function (IdleProvider, KeepaliveProvider) {
            IdleProvider.idle(5);
            IdleProvider.timeout(5);
            KeepaliveProvider.interval(10);
        });

    SidebarController.$inject = ['$state', 'routerHelper', '$rootScope', 'localStorageService', 'moduleDS', 'configurationDS', '$filter', 'tmhDynamicLocale', 'Idle', '$scope', '$websocket', 'settings', 'authenticationsessionDS', '$translate'];
    /* @ngInject */
    function SidebarController($state, routerHelper, $rootScope, localStorageService, moduleDS, configurationDS, $filter, tmhDynamicLocale, Idle, $scope, $websocket, settings, authenticationsessionDS, $translate) {
        var vm = this;
        vm.menu = $rootScope.menu;
        vm.listmodule = [];
        vm.getConfigurationSessionExpirationTime = getConfigurationSessionExpirationTime;
        vm.getUserIP = getUserIP;
        vm.logout = logout;
        vm.modulecant = 0;
        vm.iteracion = 0;
        vm.modalError = modalError;
        vm.getMenu = getMenu;


        vm.getUserIP();


        $rootScope.$watch(function () {
            vm.menu = $rootScope.menu;
            vm.listpagepermission = $rootScope.module;
        });

        $rootScope.$watch('menu', function () {
            if (vm.menu === true) {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                if (auth !== undefined) {
                    if (auth !== null) {
                        vm.samplingSites = localStorageService.get('Manejodepuntodetomamuestra') === "True";
                        vm.pathology = localStorageService.get('Patologia') === 'True';
                        vm.transplants = localStorageService.get('ActivarTransplantes') === 'True';
                        vm.servicio = localStorageService.get('ManejoServicio') === "False" ? false : true;
                        vm.Cliente = localStorageService.get('ManejoCliente') === "False" ? false : true;
                        vm.manejoMedico = localStorageService.get('ManejoMedico') === "False" ? false : true;
                        vm.tarifa = localStorageService.get('ManejoTarifa') === "False" ? false : true;
                        vm.facturacion = localStorageService.get('Facturacion') === "0" ? false : true;
                        vm.manejoRaza = localStorageService.get('ManejoRaza') === "False" ? false : true;
                        vm.DemographicsByBranch = localStorageService.get('DemographicsByBranch') === "False" ? false : true;
                        vm.trazabilidad = localStorageService.get('Trazabilidad');
                        vm.viewprint = localStorageService.get('Ordendeimpresionporcodigo') === "False" ? false : true;

                        vm.ManejoDemograficoConsultaWeb = localStorageService.get('ManejoDemograficoConsultaWeb') === 'True' ? true : false;
                        var demographicEncript = localStorageService.get('DemograficoEncriptacionCorreo');
                        vm.demographicEncript = demographicEncript === '' || demographicEncript === null ? '' : parseInt(demographicEncript);
                        vm.demographicEncript = vm.demographicEncript === 0 || vm.demographicEncript === '' || vm.demographicEncript === null ? false : true;
                        vm.getConfigurationSessionExpirationTime();
                        vm.getMenu();
                    }
                }
            } else {
                Idle.unwatch();
            }
        });

        /*  $rootScope.$watch('ws', function() {
             vm.receivermessageChat();
         }); */

        $scope.$on('IdleStart', function () { });

        $scope.$on('IdleEnd', function () { });

        $scope.$on('IdleTimeout', function () {
            console.log("cierre de sesion");
            document.title = "EnterpriseNT";
            localStorageService.set('sessionExpired', true);
            $state.go('login');
        });

        function getConfigurationSessionExpirationTime() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth !== null) {
                return configurationDS.getConfigurationKey(auth.authToken, 'SessionExpirationTime').then(function (data) {
                    Idle.setIdle(parseInt(data.data.value) * 60);
                    Idle.setTimeout(20)
                    Idle.watch();
                }, function (error) {
                    vm.modalError(error);
                });
            }
        }

        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }


        /**
         * Get the user IP throught the webkitRTCPeerConnection
         * @param onNewIP {Function} listener function to expose the IP locally
         * @return undefined
         */
        function getUserIP() { //  onNewIp - your listener function for new IPs
            try {
                //compatibility for firefox and chrome
                var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;
                if (myPeerConnection) {
                    var pc = new myPeerConnection({
                        iceServers: []
                    }),
                        noop = function () { },
                        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                        key;
                    vm.localIPs = {},
                        vm.lisIP = []
                    //create a bogus data channel
                    pc.createDataChannel('');
                    // create offer and set local description
                    pc.createOffer().then(function (sdp) {
                        sdp.sdp.split('\n').forEach(function (line) {
                            if (line.indexOf('candidate') < 0) return;
                            line.match(ipRegex).forEach(iterateIP());
                            $rootScope.ipUser = vm.lisIP[0];
                        });
                        pc.setLocalDescription(sdp, noop, noop);
                    }).catch(function (reason) {
                        // An error occurred, so handle the failure to connect
                    });
                    //listen for candidate events
                    pc.onicecandidate = function (ice) {
                        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
                        $rootScope.ipUser = vm.lisIP[0];
                    };
                } else {
                    console.error('explorador');
                }
            } catch (error) {
                console.error(error);
            }
        }

        function iterateIP(ip) {
            if (!vm.localIPs[ip]) vm.lisIP.push(ip);
            vm.localIPs[ip] = true;
        }


        function logout(module) {
            var session = {
                "idSession": vm.session
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return authenticationsessionDS.deleteonesession(auth.authToken, session).then(function (data) {
                if (data.status === 200) {
                    vm.session = null;
                    $state.go('login');
                }
            },
                function (error) {
                    vm.modalError(error);
                })
        }

        function getMenu() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return moduleDS.getModuleMasterUser(auth.authToken, auth.id).then(function (data) {

                vm.listpagepermission = data.data;
                vm.listMenu = [];
                var idLastMenu = !vm.pathology && !vm.transplants ? 10 : vm.pathology && vm.transplants ? 12 : 11;

                vm.listMenu[0] = {
                    'page': 2,
                    'name': $filter('translate')('0122'),
                    'icon': 'fa fa-user',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 2
                    }).length > 0,
                    'submodule': [{
                        'page': 108, //integrationanalyzer
                        'name': $filter('translate')('1072'),
                        'ref': '/integrationanalyzer',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 108 && o.idFather === 2
                        }).length > 0,
                    },
                    {
                        'page': 13, //user
                        'name': $filter('translate')('0122'),
                        'ref': '/user',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 13 && o.idFather === 2
                        }).length > 0,
                    },
                    {
                        'page': 12, //role
                        'name': $filter('translate')('0049'),
                        'ref': '/role',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 12 && o.idFather === 2
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[1] = {
                    'page': 3,
                    'name': $filter('translate')('0306'),
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 3
                    }).length > 0,
                    'show': vm.tarifa,
                    'icon': 'fa fa-money',
                    'submodule': [{
                        'page': 14, //integrationanalyzer
                        'name': $filter('translate')('0610'),
                        'ref': '/priceassigment',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 14 && o.idFather === 3
                        }).length > 0,
                    },
                    {
                        'page': 15, //user
                        'name': $filter('translate')('0310'),
                        'ref': '/feeschedules',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 15 && o.idFather === 3
                        }).length > 0,
                    },
                    {
                        'page': 16, //role
                        'name': $filter('translate')('0949'),
                        'ref': '/dutybytest',
                        'showLine': true,
                        'show': vm.facturacion,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 16 && o.idFather === 3
                        }).length > 0
                    },
                    // {
                    //     'page': 17, //role
                    //     'name': $filter('translate')('0674'),
                    //     'ref': '/edi',
                    //     'show': vm.facturacion,
                    //     'permission': _.filter(vm.listpagepermission, function(o) {
                    //         return o.id === 17 && o.idFather === 3
                    //     }).length > 0
                    // },
                    // {
                    //     'page': 18, //role
                    //     'name': $filter('translate')('0383'),
                    //     'ref': '/reciver',
                    //     'show': vm.facturacion,
                    //     'permission': _.filter(vm.listpagepermission, function(o) {
                    //         return o.id === 18 && o.idFather === 3
                    //     }).length > 0
                    // },
                    // {
                    //     'page': 19, //role
                    //     'name': $filter('translate')('0282'),
                    //     'ref': '/alarmday',
                    //     'showLine': true,
                    //     'show': vm.facturacion,
                    //     'permission': _.filter(vm.listpagepermission, function(o) {
                    //         return o.id === 19 && o.idFather === 3
                    //     }).length > 0
                    // },
                    {
                        'page': 150, //RIPS
                        'name': "RIPS",
                        'ref': '/rips',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 150 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 20, //role
                        'name': $filter('translate')('0311'),
                        'ref': '/customerate',
                        'show': vm.Cliente,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 20 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 21, //role
                        'name': $filter('translate')('0885'),
                        'ref': '/resolution',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 21 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 22, //role
                        'name': $filter('translate')('0307'),
                        'ref': '/rate',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 22 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 23, //cliente
                        'name': $filter('translate')('0248'),
                        'ref': '/customer',
                        'show': vm.Cliente,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 23 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 153, //Contrato
                        'name': $filter('translate')('1224'),
                        'ref': '/contract',
                        'show': vm.Cliente,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 153 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 24, //role
                        'name': $filter('translate')('0676'),
                        'ref': '/provider',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 24 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 25, //role
                        'name': $filter('translate')('0308'),
                        'ref': '/card',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 25 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 26, //role
                        'name': $filter('translate')('0309'),
                        'ref': '/bank',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 26 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 27, //role
                        'name': $filter('translate')('0357'),
                        'ref': '/paymenttypes',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 27 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 151, //tipo de impuesto
                        'name': $filter('translate')('1195'),
                        'ref': '/discounts',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 151 && o.idFather === 3
                        }).length > 0
                    },
                    {
                        'page': 152, //Impresoras fiscales
                        'name': $filter('translate')('1206'),
                        'ref': '/taxprinter',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 152 && o.idFather === 3
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[2] = {
                    'page': 4,
                    'name': $filter('translate')('0360'),
                    'icon': 'fa fa-server',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 4
                    }).length > 0,
                    'submodule': [{
                        'page': 28, //integrationanalyzer
                        'name': $filter('translate')('0281'),
                        'ref': '/standarization',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 28 && o.idFather === 4
                        }).length > 0,
                    },
                    {
                        'page': 29, //integrationanalyzer
                        'name': $filter('translate')('0566'),
                        'ref': '/demographicapproval',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 29 && o.idFather === 4
                        }).length > 0,
                    },
                    {
                        'page': 30, //integrationanalyzer
                        'name': $filter('translate')('0359'),
                        'ref': '/userstandardization',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 30 && o.idFather === 4
                        }).length > 0,
                    },
                    {
                        'page': 31, //integrationanalyzer
                        'name': $filter('translate')('0280'),
                        'ref': '/centralsystem',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 31 && o.idFather === 4
                        }).length > 0,
                    },
                    {
                        'page': 32, //integrationanalyzer
                        'name': $filter('translate')('0972'),
                        'ref': '/middleware',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 32 && o.idFather === 4
                        }).length > 0,
                    },
                    {
                        'page': 110, //integrationanalyzer
                        'name': $filter('translate')('1104'),
                        'ref': '/demographicwebconsultation',
                        'show': vm.ManejoDemograficoConsultaWeb,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 110 && o.idFather === 4
                        }).length > 0,
                    }
                    ]
                }
                vm.listMenu[3] = {
                    'page': 5,
                    'name': $filter('translate')('0351'),
                    'icon': 'fa  fa-hourglass-start',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 5
                    }).length > 0,
                    'submodule': [{
                        'page': 33, //integrationanalyzer
                        'name': $filter('translate')('0303'),
                        'ref': '/testservice',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 33 && o.idFather === 5
                        }).length > 0,
                    },
                    {
                        'page': 34, //integrationanalyzer
                        'name': $filter('translate')('0326'),
                        'ref': '/oportunityofsample',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 34 && o.idFather === 5
                        }).length > 0,
                    },
                    {
                        'page': 35, //integrationanalyzer
                        'name': $filter('translate')('0582'),
                        'ref': '/samplebyservice',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 35 && o.idFather === 5
                        }).length > 0,
                    },
                    {
                        'page': 36, //integrationanalyzer
                        'name': $filter('translate')('0831'),
                        'ref': '/histogram',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 36 && o.idFather === 5
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[4] = {
                    'page': 6,
                    'name': $filter('translate')('0312'),
                    'icon': 'fa fa-bug',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 6
                    }).length > 0,
                    'submodule': [{
                        'page': 37, //integrationanalyzer
                        'name': $filter('translate')('0636'),
                        'ref': '/subsample',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 37 && o.idFather === 6
                        }).length > 0,
                    },
                    {
                        'page': 38, //integrationanalyzer
                        'name': $filter('translate')('0320'),
                        'ref': '/meansofcultivationfortest',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 38 && o.idFather === 6
                        }).length > 0,
                    },
                    {
                        'page': 39, //integrationanalyzer
                        'name': $filter('translate')('0319'),
                        'ref': '/meansofcultivation',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 39 && o.idFather === 6
                        }).length > 0,
                    },
                    {
                        'page': 40, //integrationanalyzer
                        'name': $filter('translate')('0321'),
                        'ref': '/processfortest',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 40 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 41, //integrationanalyzer
                        'name': $filter('translate')('0318'),
                        'ref': '/process',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 41 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 42, //integrationanalyzer
                        'name': $filter('translate')('0675'),
                        'ref': '/collectionmethod',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 42 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 43, //integrationanalyzer
                        'name': $filter('translate')('0316'),
                        'ref': '/task',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 43 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 44, //integrationanalyzer
                        'name': $filter('translate')('0315'),
                        'ref': '/anatomicalsite',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 44 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 45, //integrationanalyzer
                        'name': $filter('translate')('0862'),
                        'ref': '/destinationmicrobiology',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 45 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 117, //etiologicalagent
                        'name': $filter('translate')('1328'),
                        'ref': '/etiologicalagent',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 117 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 46, //integrationanalyzer
                        'name': $filter('translate')('0869'),
                        'ref': '/antibioticreferencevalues',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 46 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 47, //integrationanalyzer
                        'name': $filter('translate')('0317'),
                        'ref': '/antibiogram',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 47 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 48, //integrationanalyzer
                        'name': $filter('translate')('0313'),
                        'ref': '/antibiotic',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 48 && o.idFather === 6
                        }).length > 0
                    },
                    {
                        'page': 49, //integrationanalyzer
                        'name': $filter('translate')('0314'),
                        'ref': '/microorganism',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 49 && o.idFather === 6
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[5] = {
                    'page': 7,
                    'name': $filter('translate')('0322'),
                    'icon': 'fa fa-exchange',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 7
                    }).length > 0,
                    'submodule': [{
                        'name': 'Trazabilidad completa',
                        'ref': '/testservice',
                        'show': vm.trazabilidad === '3',
                        'permission': true,
                        'submodule': [{
                            'page': 50, //integrationanalyzer
                            'name': $filter('translate')('0325'),
                            'ref': '/destinationassignment',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 50 && o.idFather === 109
                            }).length > 0,
                        },
                        {
                            'page': 51, //integrationanalyzer
                            'name': $filter('translate')('0324'),
                            'ref': '/destination',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 51 && o.idFather === 109
                            }).length > 0,
                        }
                        ]
                    },
                    {
                        'page': 52, //integrationanalyzer
                        'name': $filter('translate')('0274'),
                        'ref': '/motive',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 52 && o.idFather === 7
                        }).length > 0,
                    },
                    {
                        'page': 53, //integrationanalyzer
                        'name': $filter('translate')('0323'),
                        'ref': '/refrigerator',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 53 && o.idFather === 7
                        }).length > 0,
                    }
                    ]
                }

                if (vm.samplingSites) {

                    var module = {
                        'page': 193,
                        'name': $filter('translate')('3231'),
                        'permission': _.filter(vm.listpagepermission, function (o) { return o.id === 193 && o.idFather === 7 }).length > 0,
                        'submodule': [
                            {
                                'page': 194,
                                'name': $filter('translate')('3235'),
                                'ref': '/samplingSites',
                                'permission': _.filter(vm.listpagepermission, function (o) { return o.id === 194 && o.idFather === 193 }).length > 0,
                            }
                        ]
                    }

                    vm.listMenu[5].submodule.push(module);

                }

                

                vm.listMenu[6] = {
                    'page': 8,
                    'name': $filter('translate')('0288'),
                    'icon': 'fa fa-hospital-o',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 8
                    }).length > 0,
                    'submodule': [{
                        'id': 54,
                        'name': $filter('translate')('0295'),
                        'ref': '/referencevalues',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 54 && o.idFather === 8
                        }).length > 0,
                    },
                    {
                        'page': 55, //integrationanalyzer
                        'name': $filter('translate')('0350'),
                        'ref': '/deltacheck',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 55 && o.idFather === 8
                        }).length > 0,
                        'showLine': true
                    },
                    {
                        'name': $filter('translate')('0211'),
                        'permission': true,
                        'submodule': [{
                            'page': 75, //integrationanalyzer
                            'name': $filter('translate')('0292'),
                            'ref': '/literalresultfortest',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 75 && o.idFather === 56
                            }).length > 0,
                        },
                        {
                            'page': 76, //integrationanalyzer
                            'name': $filter('translate')('0210'),
                            'ref': '/literalresult',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 76 && o.idFather === 56
                            }).length > 0,
                            'showLine': true,
                        },
                        {
                            'page': 77, //integrationanalyzer
                            'name': $filter('translate')('0298'),
                            'ref': '/automatictest',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 77 && o.idFather === 56
                            }).length > 0,
                        },
                        {
                            'page': 78, //integrationanalyzer
                            'name': $filter('translate')('0514'),
                            'ref': '/relationresult',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 78 && o.idFather === 56
                            }).length > 0,
                        },
                        {
                            'page': 79, //integrationanalyzer
                            'name': $filter('translate')('0297'),
                            'ref': '/resultemplate',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 79 && o.idFather === 56
                            }).length > 0,
                        },
                        {
                            'page': 80, //integrationanalyzer
                            'name': $filter('translate')('0299'),
                            'ref': '/hematologicalcounter',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 80 && o.idFather === 56
                            }).length > 0,
                        },
                        {
                            'page': 81, //integrationanalyzer
                            'name': $filter('translate')('0300'),
                            'ref': '/worksheets',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 81 && o.idFather === 56
                            }).length > 0,
                        }
                        ]
                    },
                    {
                        'name': $filter('translate')('0931'),
                        'permission': true,
                        'showLine': true,
                        'submodule': [{
                            'page': 82, //integrationanalyzer
                            'name': $filter('translate')('0069'),
                            'ref': '/excludetestsbydemographics',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 82 && o.idFather === 57
                            }).length > 0,
                        },
                        {
                            'page': 83, //integrationanalyzer
                            'name': $filter('translate')('0001'),
                            'ref': '/excludetestbyuser',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 83 && o.idFather === 57
                            }).length > 0,
                        }
                        ]
                    },
                    {
                        'page': 58, //integrationanalyzer
                        'name': $filter('translate')('0591'),
                        'ref': '/testdemographicpyp',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 58 && o.idFather === 8
                        }).length > 0,
                    },
                    {
                        'name': $filter('translate')('1108'),
                        'permission': true,
                        'showLine': true,
                        'submodule': [{
                            'page': 111, //integrationanalyzer
                            'name': $filter('translate')('1107'),
                            'ref': '/branchforlaboratory',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 111 && o.idFather === 59
                            }).length > 0,
                        },
                        {
                            'page': 84, //integrationanalyzer
                            'name': $filter('translate')('0291'),
                            'ref': '/laboratorytest',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 84 && o.idFather === 59
                            }).length > 0,
                        },
                        {
                            'page': 85, //integrationanalyzer
                            'name': $filter('translate')('0204'),
                            'ref': '/laboratory',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 85 && o.idFather === 59
                            }).length > 0,
                        }
                        ]
                    },
                    {
                        'name': $filter('translate')('1109'),
                        'permission': true,
                        'showLine': true,
                        'submodule': [{
                            'page': 86, //integrationanalyzer
                            'name': $filter('translate')('0883'),
                            'ref': '/diagnosticsfortest',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 86 && o.idFather === 60
                            }).length > 0,
                        },
                        {
                            'page': 87, //integrationanalyzer
                            'name': $filter('translate')('0180'),
                            'ref': '/diagnostic',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 87 && o.idFather === 60
                            }).length > 0,
                        }
                        ]
                    },
                    {
                        'id': 61,
                        'name': $filter('translate')('0302'),
                        'ref': '/testedition',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 61 && o.idFather === 8
                        }).length > 0,
                    },
                    {
                        'page': 62, //integrationanalyzer
                        'name': $filter('translate')('0932'),
                        'ref': '/groups',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 62
                        }).length > 0,
                    }
                    ]
                }

                if(!vm.viewprint){
                    var viewprint ={
                                           'id': 63,
                                           'name': $filter('translate')('0294'),
                                           'ref': '/printorder',
                                           'permission': _.filter(vm.listpagepermission, function (o) {
                                               return o.id === 63 && o.idFather === 8
                                           }).length > 0,
                                    }
                 vm.listMenu[6].submodule.push(viewprint);
                }

                var page=[   {
                    'page': 64, //integrationanalyzer
                    'name': $filter('translate')('0301'),
                    'ref': '/processingday',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 64 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'id': 65,
                    'name': $filter('translate')('0290'),
                    'ref': '/profil',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 65 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'page': 66,
                    'name': $filter('translate')('0402'),
                    'ref': '/testlab',
                    'showLine': true,
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 66 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'name': $filter('translate')('1110'),
                    'permission': true,
                    'showLine': true,
                    'submodule': [{
                        'page': 88, //integrationanalyzer
                        'name': $filter('translate')('0052'),
                        'ref': '/sample',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 88 && o.idFather === 67
                        }).length > 0,
                    },
                    {
                        'page': 89, //integrationanalyzer
                        'name': $filter('translate')('0046'),
                        'ref': '/container',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 89 && o.idFather === 67
                        }).length > 0,
                    }
                    ]
                },
                {
                    'id': 154,
                    'name': $filter('translate')('1296'),
                    'ref': '/testalarm',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 154 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'id': 68,
                    'name': $filter('translate')('0178'),
                    'ref': '/comment',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 68 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'page': 69,
                    'name': $filter('translate')('0933'),
                    'ref': '/alarm',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 69 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'id': 70,
                    'name': $filter('translate')('0219'),
                    'ref': '/populationgroup',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 70 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'page': 71,
                    'name': $filter('translate')('0051'),
                    'ref': '/requirement',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 71 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'page': 72,
                    'name': $filter('translate')('0045'),
                    'ref': '/technique',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 72 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'id': 73,
                    'name': $filter('translate')('0010'),
                    'ref': '/unit',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 73 && o.idFather === 8
                    }).length > 0,
                },
                {
                    'page': 74,
                    'name': $filter('translate')('0037'),
                    'ref': '/area',
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 74 && o.idFather === 8
                    }).length > 0,
                }]
                vm.listMenu[6].submodule=_.union(vm.listMenu[6].submodule, page);

                vm.listMenu[7] = {
                    'page': 9,
                    'name': $filter('translate')('0286'),
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 9
                    }).length > 0,
                    'icon': 'fa fa-pencil-square-o',
                    'submodule': [{
                        'page': 90,
                        'name': $filter('translate')('0286'),
                        'ref': '/interview',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 90 && o.idFather === 9
                        }).length > 0,
                    },
                    {
                        'page': 91, //user
                        'name': $filter('translate')('0634'),
                        'ref': '/question',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 91 && o.idFather === 9
                        }).length > 0,
                    },
                    {
                        'page': 92, //role
                        'name': $filter('translate')('0599'),
                        'ref': '/answer',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 92 && o.idFather === 9
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[8] = {
                    'page': 10,
                    'name': $filter('translate')('0069'),
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 10
                    }).length > 0,
                    'icon': 'fa fa-clipboard',
                    'submodule': [{
                        'page': 112,
                        'name': $filter('translate')('1135'),
                        'ref': '/reportencryption',
                        'show': vm.demographicEncript,
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 112 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 115,
                        'name': $filter('translate')('1146'),
                        'ref': '/defaultvalue',
                        'show': vm.DemographicsByBranch,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 115 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 114,
                        'name': $filter('translate')('1141'),
                        'ref': '/branchdemographic',
                        'show': vm.DemographicsByBranch,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 114 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 113,
                        'name': $filter('translate')('1142'),
                        'ref': '/demographicbranch',
                        'show': vm.DemographicsByBranch,
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 113 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'id': 155,
                        'name': $filter('translate')('1298'),
                        'ref': '/demographictest',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 155 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 93,
                        'name': $filter('translate')('1158'),
                        'ref': '/Demographicdependency',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 116 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 93,
                        'name': $filter('translate')('0992'),
                        'ref': '/configdemographics',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 93 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 94,
                        'name': $filter('translate')('0082'),
                        'ref': '/demographicsItem',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 94 && o.idFather === 10
                        }).length > 0,
                    },
                    {
                        'page': 156,
                        'name': $filter('translate')('1358'),
                        'ref': '/orderingdemographic',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 156 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 95,
                        'name': $filter('translate')('0069'),
                        'ref': '/demographic',
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 95 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 96,
                        'name': $filter('translate')('0225'),
                        'ref': '/physician',
                        'show': vm.manejoMedico,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 96 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 97,
                        'name': $filter('translate')('0173'),
                        'ref': '/specialty',
                        'show': vm.manejoMedico,
                        'showLine': true,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 97 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 98,
                        'name': $filter('translate')('0133'),
                        'ref': '/ordertype',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 98 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 107,
                        'name': $filter('translate')('0175'),
                        'ref': '/service',
                        'show': vm.servicio,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 107 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 99,
                        'name': $filter('translate')('0075'),
                        'ref': '/branch',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 99 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 100,
                        'name': $filter('translate')('0645'),
                        'ref': '/documenttypes',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 100 && o.idFather === 10
                        }).length > 0
                    },
                    {
                        'page': 101,
                        'name': $filter('translate')('0174'),
                        'ref': '/race',
                        'show': vm.manejoRaza,
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 101 && o.idFather === 10
                        }).length > 0
                    }
                    ]
                }
                vm.listMenu[idLastMenu] = {
                    'page': 12,
                    'name': $filter('translate')('0285'),
                    'permission': _.filter(vm.listpagepermission, function (o) {
                        return o.id === 11
                    }).length > 0,
                    'icon': 'fa fa-pencil-square-o',
                    'submodule': [{
                        'page': 102,
                        'name': $filter('translate')('0663'),
                        'ref': '/installation',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 102 && o.idFather === 11
                        }).length > 0,
                    },
                    {
                        'page': 103,
                        'name': $filter('translate')('1006'),
                        'ref': '/serviceprinting',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 103 && o.idFather === 11
                        }).length > 0,
                    },
                    {
                        'page': 104,
                        'name': $filter('translate')('0988'),
                        'ref': '/groupingorders',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 104 && o.idFather === 11
                        }).length > 0
                    },
                    {
                        'page': 105,
                        'name': $filter('translate')('0660'),
                        'ref': '/holidays',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 105 && o.idFather === 11
                        }).length > 0
                    },
                    {
                        'page': 106,
                        'name': $filter('translate')('0665'),
                        'ref': '/generalconfig',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 106 && o.idFather === 11
                        }).length > 0
                    }
                    ]
                }

                if (vm.pathology) {
                    vm.listMenu[9] = {
                        'page': 11,
                        'name': $filter('translate')('3000'),
                        'icon': 'fa fa-hospital-o',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 120
                        }).length > 0,
                        'submodule': [{
                            'page': 123, //Submuestras
                            'name': $filter('translate')('3060'),
                            'ref': '/specimen',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 123 && o.idFather === 120
                            }).length > 0
                        },
                        {
                            'page': 124, //Organos
                            'name': $filter('translate')('3018'),
                            'ref': '/organ',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 124 && o.idFather === 120
                            }).length > 0
                        },
                        {
                            'page': 125, //Tipo de Estudio
                            'name': $filter('translate')('3019'),
                            'ref': '/studytype',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 125 && o.idFather === 120
                            }).length > 0
                        },
                        // {
                        //   'page': 121, //Areas
                        //   'name': $filter('translate')('0037'),
                        //   'ref': '/areapathology',
                        //   'permission': _.filter(vm.listpagepermission, function(o) {
                        //       return o.id === 121 && o.idFather === 120
                        //   }).length > 0,
                        // },
                        {
                            'page': 122, //Contenedores
                            'name': $filter('translate')('3016'),
                            'ref': '/containerpathology',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 122 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 126, //Casetes
                            'name': $filter('translate')('3061'),
                            'ref': '/casete',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 126 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 127, //Fijadores
                            'name': $filter('translate')('3062'),
                            'ref': '/fixative',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 127 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 128, //Coloraciones
                            'name': $filter('translate')('3063'),
                            'ref': '/coloration',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 128 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 136, //Coloraciones por examen
                            'name': $filter('translate')('1380'),
                            'ref': '/colorationbytest',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 136 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 129, //Especialidades
                            'name': $filter('translate')('3187'),
                            'ref': '/pathologist',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 129 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 130, //Protocolo
                            'name': $filter('translate')('1009'),
                            'ref': '/protocol',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 130 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 132, //Eventos
                            'name': $filter('translate')('0661'),
                            'ref': '/event',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 132 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 131, //Agenda
                            'name': $filter('translate')('3084'),
                            'ref': '/schedule',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 131 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 133, //Campos
                            'name': $filter('translate')('3107'),
                            'ref': '/field',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 133 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 134, //Plantillas
                            'name': $filter('translate')('3111'),
                            'ref': '/macroscopytemplate',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 134 && o.idFather === 120
                            }).length > 0,
                        },
                        {
                            'page': 135, //Horarios de procesamiento
                            'name': $filter('translate')('3122'),
                            'ref': '/processingtime',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 135 && o.idFather === 120
                            }).length > 0,
                        },
                        ]
                    }
                }

                if (vm.transplants) {
                    vm.listMenu[vm.pathology ? 10 : 9] = {
                        'page': 13,
                        'name': $filter('translate')('3200'),
                        'icon': 'fa fa-hospital-o',
                        'permission': _.filter(vm.listpagepermission, function (o) {
                            return o.id === 160
                        }).length > 0,
                        'submodule': [{
                            'page': 123, //Aseguradora
                            'name': $filter('translate')('3201'),
                            'ref': '/insurance',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 161 && o.idFather === 160
                            }).length > 0
                        },
                        {
                            'page': 124, //Institucion
                            'name': $filter('translate')('3202'),
                            'ref': '/institution',
                            'permission': _.filter(vm.listpagepermission, function (o) {
                                return o.id === 162 && o.idFather === 160
                            }).length > 0
                        }
                        ]
                    }
                }

                vm.listMenu[vm.pathology && vm.transplants  ? 11 : !vm.pathology && !vm.transplants ? 9 : 10] = {
                    'page': 10,
                    'name': $filter('translate')('3228'),
                    'permission': _.filter(vm.listpagepermission, function(o) {
                        return o.id === 190
                    }).length > 0,
                    'icon': 'fa fa-calendar',
                    'submodule': [
                        {
                            'page': 191,
                            'name': $filter('translate')('3229'),
                            'ref': '/shifts',
                            'permission': _.filter(vm.listpagepermission, function(o) {
                                return o.id === 191 && o.idFather === 190
                            }).length > 0,
                        },
                        {
                          'page': 192,
                          'name': $filter('translate')('3230'),
                          'ref': '/shiftsbybranch',
                          'permission': _.filter(vm.listpagepermission, function(o) {
                              return o.id === 192 && o.idFather === 190
                          }).length > 0,
                        },
                    ]
                  }

            }, function (error) {
                if (error.data === null) {
                    logger.error(error);
                }
            });
        }
    }
})();
