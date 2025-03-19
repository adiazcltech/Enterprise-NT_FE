(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('cardDS', cardDS);

  cardDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function cardDS($http, $q, exception, logger, settings) {
    var service = {
      getCard: getCard,
      getCardId: getCardId,
      newCard: newCard,
      updateCard: updateCard
    };

    return service;

    function getCard(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/cards'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getCardId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/cards/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un cliente*/
    function newCard(token,Card) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/cards',
              data: Card
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateCard(token,Card) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/cards',
              data: Card
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
