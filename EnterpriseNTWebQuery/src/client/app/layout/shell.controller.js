(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);
    

  ShellController.$inject = ['$state', '$scope', '$rootScope', 'config', 'logger', 'localStorageService'];
  /* @ngInject */
  function ShellController($state, $scope, $rootScope, config, logger, localStorageService) {
    var vm = this;
    vm.closesesion = closesesion;
    vm.openhelp = openhelp;

    $scope.$watch(function () {
      vm.logoentity = localStorageService.get('Logo');
      vm.colorentity = localStorageService.get('Color');
      vm.bannerentity = localStorageService.get('Banner');
      vm.titleentity = localStorageService.get('Titulo');
      vm.user = localStorageService.get('Enterprise_NT.authorizationData')
    });

    $rootScope.$watch(function () {
      vm.menu = $rootScope.menu;
      vm.helpReference = $rootScope.helpReference;
    });

    

    function openhelp() {
      window.open("/enterprise_nt_help/index.htm?page=enterprise_nt/" + vm.helpReference, '', 'width=1100,height=600,left=50,top=50,toolbar=yes');
    }

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      vm.logoentity = localStorageService.get('Logo');
      vm.colorentity = localStorageService.get('Color');
      vm.bannerentity = localStorageService.get('Banner');
      vm.titleentity = localStorageService.get('Titulo'); 
          
    }

    function closesesion() {
      vm.loading = true;
      localStorageService.clearAll();
      $state.go('login');
      vm.loading = false;
    }
  }
})();
