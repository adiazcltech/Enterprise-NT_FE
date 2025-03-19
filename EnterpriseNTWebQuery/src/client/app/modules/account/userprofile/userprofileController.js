(function () {
  'use strict';

  angular
    .module('app.userprofile')
    .controller('userprofileController', userprofileController);

  userprofileController.$inject = ['$state', '$filter', '$rootScope', 'localStorageService', 'userDS', 'logger'];
  /* @ngInject */
  function userprofileController($state, $filter, $rootScope, localStorageService, userDS, logger) {
    var vm = this;
    $rootScope.menu = true;
    vm.keySecurityPolitics = localStorageService.get('SecurityPolitics') === "True" ? true : false;
    vm.init = init;
    vm.title = 'userprofile';
    vm.isAuthenticate = isAuthenticate;
    vm.loading = true;
    vm.CheckStrngth1 = CheckStrngth1;
    vm.changepassword = changepassword;
    vm.viewvalited = false;
    vm.errorpasword = false;
    vm.strength = '';
    $rootScope.$watch('ipUser', function () {
      vm.ipuser = $rootScope.ipUser;
    });
    function init() {
      setTimeout(function () { document.getElementById('afterpassword').focus() }, 100);
      vm.userchangepassword = { 'afterpassword': '', 'password1': '', 'password2': '' }
      vm.user = localStorageService.get('Enterprise_NT.authorizationData')
      vm.lettersize = vm.user.administrator === true ? 12 : 9;
      vm.administrator = vm.user.administrator === true;
      vm.strengthlabel = $filter('translate')('0148');
      vm.data = '';
      vm.color = "#999";
      vm.strength = "**";
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.colorbutton = localStorageService.get('Color');
      vm.loading = false;
    }
    function CheckStrngth1() {
      if (vm.keySecurityPolitics) {
        vm.viewvalited = false;
        vm.strength0 = false;
        vm.strength1 = false;
        vm.strength2 = false;
        vm.strength3 = false;
        vm.strength4 = false;
        vm.strength = "";
        vm.strengthlabel = $filter('translate')('0148');
        if (vm.userchangepassword.password1 === undefined) {
          vm.strengthlabel = $filter('translate')('0148');
          vm.data = '';
          vm.color = "#999";
          vm.strength = "**";
          vm.strength0 = true;
          vm.strength1 = true;
          vm.strength2 = true;
          vm.strength3 = true;
          vm.strength4 = true;
        }

        if (vm.userchangepassword.password1 !== undefined) {
          vm.data = '';
          vm.strengthlabel = $filter('translate')('0148');
          if (vm.userchangepassword.password1.length < vm.lettersize) {
            vm.strength0 = true;
            vm.strength = "**";
          }
          if (!new RegExp("[A-Z]").test(vm.userchangepassword.password1)) {
            vm.strength1 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[a-z]").test(vm.userchangepassword.password1)) {
            vm.strength2 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[0-9]").test(vm.userchangepassword.password1)) {
            vm.strength3 = true;
            vm.strength = "**";

          }
          if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.userchangepassword.password1)) {
            vm.strength4 = true;
            if (vm.administrator) {
              vm.strength = "**";
            }
          }

          var regex = new Array();
          regex.push("[A-Z]"); //Uppercase Alphabet.  
          regex.push("[a-z]"); //Lowercase Alphabet.  
          regex.push("[0-9]"); //Digit.  
          regex.push("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])"); //Special Character.  
          var passed = 0;
          //Validate for each Regular Expression.  
          for (var i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test(vm.userchangepassword.password1)) {
              passed++;
            }
          }
          //Validate for length of Password.  
          if (passed > 2 && vm.userchangepassword.password1.length >= vm.lettersize) {
            passed++;
          }
          //Display status.  
          if (passed == 1) {
            vm.strengthlabel = $filter('translate')('0148');
            vm.color = "red";
            vm.data = '0';
          } else if (passed == 2) {
            vm.color = "orangered";
            vm.strengthlabel = $filter('translate')('0149');
            vm.data = '1';
          } else if (passed == 3) {
            vm.color = "orange";
            vm.strengthlabel = $filter('translate')('0150');
            vm.data = '2';
          } else if (passed == 4) {
            vm.color = "yellowgreen";
            vm.strengthlabel = $filter('translate')('0151');
            vm.data = '3';
          } else if (passed == 5) {
            vm.color = "green";
            vm.strengthlabel = $filter('translate')('0152');
            vm.data = '4';
          }
        }
      } else {
        vm.strength = "";
      }

    }
    function changepassword() {
      vm.loading = true;
      vm.viewvalited = false;
      vm.errorpasword = false;
      if (vm.strength === '' && vm.userchangepassword.password1 === vm.userchangepassword.password2) {
        var user = {
          "idUser": vm.user.id,
          "userName": vm.user.userName,
          "passwordOld": vm.userchangepassword.afterpassword,
          "passwordNew": vm.userchangepassword.password1,
          "type": vm.user.type
        }
        return userDS.changepasswordexpirit(user).then(function (data) {
          if (data.status === 200) {
            vm.loading = false;
            logger.success($filter('translate')('0098'));
          }
        }, function (error) {
          vm.loading = false;
          vm.viewvalited = false
          vm.errorpasword = false;
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1') {
              vm.viewvalited = true
            }
            if (item[0] === '2') {
              vm.errorpasword = true
            }
          });
        })

      }
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
    vm.isAuthenticate();
  }
})();
