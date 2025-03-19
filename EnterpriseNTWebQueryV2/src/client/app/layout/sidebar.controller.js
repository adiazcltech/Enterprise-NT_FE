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

  SidebarController.$inject = ['$state', 'routerHelper', 'Idle', '$scope', 'localStorageService'];
  /* @ngInject */
  function SidebarController($state, routerHelper, Idle, $scope, localStorageService) {
    var vm = this;
    var states = routerHelper.getStates();
    vm.isCurrent = isCurrent;

    Idle.unwatch();

    activate();

    $scope.$on('IdleStart', function () { });

    $scope.$on('IdleEnd', function () { });

    $scope.$on('IdleTimeout', function () {
      document.title = "WebQuery"
      localStorageService.set('sessionExpired', true);
      $state.go('login');
    });

    $scope.$on('$locationChangeStart', function ($event, next, current) {
      Idle.unwatch();
      if ($event.targetScope.title !== "Consulta web:  Login") {
        var time = parseInt(localStorageService.get('SessionExpirationTime')) * 60;
        Idle.setIdle(time);
        Idle.setTimeout(20);
        Idle.watch();
      }
    });

    function activate() { getNavRoutes(); }

    function getNavRoutes() {
      vm.navRoutes = states.filter(function (r) {
        return r.settings && r.settings.nav;
      }).sort(function (r1, r2) {
        return r1.settings.nav - r2.settings.nav;
      });
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }
      var menuName = route.title;
      return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
    }
  }
})();
