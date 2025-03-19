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
        'branch': 0
      };
      data.user = user.username;
      data.password = user.password;
      data.branch = user.location;
      return $http({
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(data),
        url: settings.serviceUrl + '/authentication',
        hideOverlay: true
      })
        .then(success);


      function success(response) {
        localStorageService.set('Enterprise_NT.authorizationData', {
          authToken: response.data.token,
          userName: data.user,
          id: response.data.user.id,
          photo: response.data.user.photo,
          confidential: response.data.user.confidential,
          branch: data.branch,
          name: response.data.user.name,
          lastName: response.data.user.lastName,
          administrator: response.data.user.administrator,
          maxDiscount: response.data.user.maxDiscount,
          orderType: response.data.user.orderType,
          creatingItems:response.data.user.creatingItems
        });

        service.isAuthenticated = true;
        service.userName = data.user;
        return response;
      }


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
