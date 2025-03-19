(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('widgetsDS', widgetsDS);

   widgetsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function widgetsDS($http, $q, exception, logger,settings) {
     var service = {
      getsample: getsample,
      getWidgetMenu: getWidgetMenu
     
    };

    return service;

    
     //** Método que obtene la informacion de los estados de las muestras.*/
    function getsample(token) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/widgets/sample'
           })

        .then(success);

      function success(response) {
        return response;
      }

      
    }

    function getWidgetMenu(token, date) {
          return $http({
           hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  +'/widgets/entry/' + date
          })

      .then(success);

    function success(response) {
      return response;
    }

    
    }
   }
})();

