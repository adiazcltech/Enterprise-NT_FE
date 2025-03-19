(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authService', authService);

  authService.$inject = ['$http','localStorageService','settings'];

  function authService($http,localStorageService,settings) {
    var service = {
      isAuthenticated: false,
      username: '',
      login: login,
      loadAuthData: loadAuthData
    };

    return service;

   /*  function login(user) {
        var promise = $http({
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify(user),
            url: settings.serviceUrl  + '/authentication/laboratory'
        });
        return promise.success(function (response) {
          localStorageService.set('Enterprise_NT.authorizationData', {
            authToken: response.token,
            userName: response.user.userName,
            id: response.user.id,
            photo: response.user.photo,
            confidential: response.user.confidential
          });

          service.isAuthenticated = true;
          service.userName =  response.user.userName;
          return response;
        });


    } */

   
    function login(user) { 
      return $http({
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(user),
        url: settings.serviceUrl + '/authentication/laboratory'
      })
        .then(success);


      function success(response) {
        localStorageService.set('Enterprise_NT.authorizationData', {          
          authToken: response.data.token,
          userName: response.data.user.userName,
          id: response.data.user.id,
          photo: response.data.user.photo,
          confidential: response.data.user.confidential
        });
        service.isAuthenticated = true;
        service.userName = response.data.user;
        return response;
      }
    }


    function loadAuthData() {
      // get local storage data with token and username
    }
  }
})();
