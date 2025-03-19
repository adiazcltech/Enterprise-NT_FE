/* jshint ignore:start */
(function() {
    'use strict';

    angular
        .module('app.meetingpathologists')
        .controller('meetingpathologistsController', meetingpathologistsController);

    meetingpathologistsController.$inject = ['common', 'localStorageService', 'logger', 'caseDS', 'meetingPathologistDS', 'userDS', '$filter', '$compile', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'moment', "$q", "$scope", '$rootScope'];

    function meetingpathologistsController(common, localStorageService, logger, caseDS, meetingPathologistDS, userDS, $filter, $compile, $state, DTOptionsBuilder, DTColumnDefBuilder, moment, $q, $scope, $rootScope) {

        var vm = this;
        $rootScope.menu = true;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.cases = [];
        vm.getCases = getCases;
        vm.loadCase = loadCase;
        vm.caseSelected = null;
        vm.numberOrder = null;

        function loadCase(casePat) {
            console.log('casePat', casePat);
            vm.caseSelected = casePat;
            vm.numberOrder = casePat.order.orderNumber;
        }

        function getCases() {
            vm.loadingdata = true;
            caseDS.getByParticipant(auth.authToken, auth.id).then(function(response) {
                    if (Object.keys(response.data).length === 0) {
                        UIkit.modal('#modalNotCases').show();
                    }
                    vm.cases = _.orderBy(response.data, ['id'], ['asc']);
                    console.log('vm.cases', vm.cases);
                    vm.loadingdata = false;
                },
                function(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }

        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.init();
            }
        }

        function init() {
            vm.getCases();
        }

        vm.isAuthenticate();

    }
})();
/* jshint ignore:end */