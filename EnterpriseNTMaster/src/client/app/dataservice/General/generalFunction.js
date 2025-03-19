(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('generalFunction', generalFunction);

  generalFunction.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function generalFunction($http, $q, exception, logger,settings) {
    var service = {
      getselectlist: getselectlist
    };

    return service;
    var listprueba = [];

    //** Método que consulta los modulos de configuracion a los que tiene permiso un  usuario*/
    function getselectlist(limit,list) {
        listprueba = list;
        var listfilter = listprueba.splice.apply(this, [0, limit].concat(listprueba));
        return listfilter
    }

   




  }
})();
