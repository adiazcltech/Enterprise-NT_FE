(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('shortcutsDS', shortcutsDS);

  shortcutsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function shortcutsDS($http, $q, exception, logger,settings) {
    var service = {
      getShortcutsList: getShortcutsList,
      NewShortcutsList: NewShortcutsList,
      DeleteShortcutsList: DeleteShortcutsList
    };

    return service;

    //** Método que consulta los accesos directos de un usuario*/
    function getShortcutsList(token,iduser) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/shortcuts/filter/user/'+ iduser +'/module/0' 
           })

        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed')(e);
      }
    }

   //** Método que crea un acceso directo*/
    function NewShortcutsList(token,Shortcut) {
         return $http({
          hideOverlay: true,
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/shortcuts',
              data: Shortcut
         })
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed')(e);
      }
   }

   function DeleteShortcutsList(token,Shortcut) {
       return $http({
        hideOverlay: true,
              method: 'PATCH',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/shortcuts',
              data: Shortcut
         })
         .then(success)
         .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed')(e);
      }

   }
  }
})();
