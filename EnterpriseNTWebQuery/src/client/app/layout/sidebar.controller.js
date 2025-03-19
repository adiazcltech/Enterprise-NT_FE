(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController)
        .config(function (IdleProvider, KeepaliveProvider) {
            IdleProvider.idle(5);
            IdleProvider.timeout(5);
            KeepaliveProvider.interval(10);
          });;
      

    SidebarController.$inject = ['$scope', '$state', '$rootScope', 'localStorageService','Idle'];
    /* @ngInject */
    function SidebarController($scope, $state, $rootScope, localStorageService, Idle) {
        var vm = this;

        vm.menu = $rootScope.menu;

        vm.logout = logout;
        vm.isAuthenticate = isAuthenticate;
        vm.modulecant = 0;
        vm.iteracion = 0;
        vm.autoPending = 1;
        vm.scopeVariable = 1;
        vm.getUserIP = getUserIP;



        vm.toggleStyleSwitcher = toggleStyleSwitcher;
        vm.styleSwitcherActive = false;
        vm.changepassword = localStorageService.get('CambioContraseña');
        vm.administrator = false;

        Idle.unwatch();

        vm.isAuthenticate();

        $scope.$on('IdleStart', function () { });

        $scope.$on('IdleEnd', function () { });

        $scope.$on('IdleTimeout', function () {
            document.title = "WebQuery"
            localStorageService.set('sessionExpired', true);
            $state.go('login');
        });

        $scope.$on('$locationChangeStart', function($event, next, current) { 
            Idle.unwatch();
            if($event.targetScope.title !== "Consulta web:  Login"){
                var time = parseInt(localStorageService.get('SessionExpirationTime')) * 60;
                Idle.setIdle(time);
                Idle.setTimeout(20);
                Idle.watch();
                setTimeout(function () {
                   
                }, 3000);
            }
        });
        

        $rootScope.$watch(function () {
            vm.menu = $rootScope.menu;
            vm.NamePage = $rootScope.NamePage;
            vm.idpage = $state.current.idpage;
            if (localStorageService.get('Enterprise_NT.authorizationData')) {
                vm.administrator = localStorageService.get('Enterprise_NT.authorizationData').administrator;
                vm.id = localStorageService.get('Enterprise_NT.authorizationData').id;
              
            }
        });

        $scope.$watch(function () {
            vm.changepassword = localStorageService.get('CambioContraseña');
        });

        function toggleStyleSwitcher($event) {
            $event.preventDefault();
            vm.styleSwitcherActive = !vm.styleSwitcherActive;
        }

        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.getUserIP();
            }
        }


        function logout(module) {
            Idle.unwatch();
            $state.go('login');
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
                // expected output: SyntaxError: unterminated string literal
                // Note - error messages will vary depending on browser
            }
        }

        function iterateIP(ip) {
            if (!vm.localIPs[ip]) vm.lisIP.push(ip);
            vm.localIPs[ip] = true;
        }
    }
})();
