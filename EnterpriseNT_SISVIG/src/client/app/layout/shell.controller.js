(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config, logger) {



    var vm = this;
    vm.busyMessage = '';
    vm.isBusy = true;
    $rootScope.showSplash = true;
    vm.menu = $rootScope.menu;

    vm.navline = {
      title: config.appTitle,
      text: 'Created by John Papa',
      link: 'http://twitter.com/john_papa'
    };

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      setTimeout(function () { vm.viewcontent = true; }, 100);
      hideSplash();
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function () {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();
