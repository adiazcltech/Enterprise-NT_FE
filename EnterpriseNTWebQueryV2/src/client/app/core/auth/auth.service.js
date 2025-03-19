(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authService', authService);

  authService.$inject = ['$http', 'localStorageService', 'settings'];

  function authService($http, localStorageService, settings) {
    var service = {
      isAuthenticated: false,
      username: '',
      login: login,
      singup: singup,
      loginWithToken: loginWithToken,
      resetPassword: resetPassword,
      forgotPassword: forgotPassword,
      changePassword: changePassword,
      logOff: logOff,
      loadAuthData: loadAuthData
    };

    return service;

    function login(user) {
      var data = {
        'user': '',
        'password': '',
        'type': 0,
        'historyType': -1
      };
      data.user = user.username;
      data.password = user.password;
      data.type = user.type;
      data.historyType = user.historyType;

      var promise = $http({
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(data),
        url: settings.serviceUrl + '/authentication/web'
      });
      return promise.success(function (response, status) {
        localStorageService.set('Enterprise_NT.authorizationData', {
          authToken: response.token,
          userName: data.user,
          id: response.user.id,
          photo: response.user.photo,
          confidential: response.user.confidential,
          type: data.type,
          administrator: response.user.administrator
        });

        service.isAuthenticated = true;
        service.userName = data.user;
        return response;
      });

    }
    function singup() {
      // send register data
      // receive a email with token valid for a day!
    }

    function loginWithToken() {
      // send a token
      // receive a token valid and username
    }

    function resetPassword() {
      // send admin username a reset for default password for default user
      // return message with new username and password
    }

    function forgotPassword() {
      // send email address
      // return email with a provisional url and token
    }

    function changePassword() {
      // send username or id and old password, new password
      // return username and new password
    }

    function logOff() {
      // send a username and token
      // remove token local storage
      // go to login or home
    }

    function loadAuthData() {
      // get local storage data with token and username
    }


  }
})();
