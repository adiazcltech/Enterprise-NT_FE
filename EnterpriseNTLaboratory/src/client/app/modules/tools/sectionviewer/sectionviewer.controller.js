(function () {
    'use strict';
    angular
        .module('app.sectionviewer')
        .controller('SectionviewerController', SectionviewerController);
    SectionviewerController.$inject = ['localStorageService', 'authenticationsessionDS',
        'logger', '$filter', '$state', '$rootScope', 'branchDS', 'socket'];
    function SectionviewerController(localStorageService, authenticationsessionDS,
        logger, $filter, $state, $rootScope, branchDS, socket) {
        var vm = this;
        vm.title = 'sectionviewer';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        $rootScope.menu = true;
        $rootScope.helpReference = '06.Tools/sectionviewer.htm';
        $rootScope.NamePage = $filter('translate')('0933');
        vm.save = save;
        vm.data = [];
        vm.all = all;
        vm.loadingdata = true;
        vm.modalError = modalError;
        $rootScope.pageview = 3;
        /*SOCKET I.O*/

        vm.loadUsersOnline = loadUsersOnline;
        vm.getUsers = getUsers;
        vm.usersOnline = [];
        vm.userAuth = localStorageService.get("Enterprise_NT.authorizationData");

        try {
            socket.on('init', function(data) {
                vm.loadUsersOnline(data);
            });

            socket.on('user:join', function(data) {
                var userActive = _.filter(vm.usersOnline, function(o) { return o.id === data.id; });
                if (userActive.length === 0) {
                    vm.usersOnline.push(data);
                }
            });

        } catch (error) {
            vm.noConnected = true;
        }

        function getUsers() {
            setTimeout(function () {
                socket.emit('user:connect', null);
            }, 1000);
        }

        function loadUsersOnline(data) {
            vm.usersOnline = [];
            _.forEach(data, function(value, key) {
                var userActive = _.filter(vm.usersOnline, function(o) { return o.id === value['id']; });
                if (userActive.length === 0) {
                    vm.usersOnline.push(value);
                }
            });
            vm.loadingdata = false;
        }

        function save() {
            vm.loadingdata = true;
            vm.datadelete = $filter('filter')(vm.usersOnline, { selected: true });
            for (var i = 0; i < vm.datadelete.length; i++) {
                socket.emit('user:closesession', {
                    user: vm.datadelete[i].id,
                    userName: vm.userAuth.userName
                });
            }
            setTimeout(function () {
                vm.loadingdata = false;
                logger.success($filter("translate")("1531"));
            }, 5000);
        }

        function all() {
            vm.loadingdata = true;
            vm.datadelete = _.filter(vm.usersOnline, function(o) { return o.id !== vm.userAuth.id });
            for (var i = 0; i < vm.datadelete.length; i++) {
                socket.emit('user:closesession', {
                    user: vm.datadelete[i].id,
                    userName: vm.userAuth.userName
                });
            }
            setTimeout(function () {
                vm.loadingdata = false;
                logger.success($filter("translate")("1531"));
            }, 5000);
        }

        /*FIN SOCKET I.O*/


        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loadingdata = false;
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
            vm.getUsers();
        }

        vm.isAuthenticate();
    }
})();
