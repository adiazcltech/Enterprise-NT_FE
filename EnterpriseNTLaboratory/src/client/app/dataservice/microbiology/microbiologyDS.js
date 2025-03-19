(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('microbiologyDS', microbiologyDS);

  microbiologyDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function microbiologyDS($http, $q, exception, logger, settings) {
    var service = {
      getIdsensitivity:getIdsensitivity,
      getantibiogram:getantibiogram,
      insertantibiogram:insertantibiogram,
      insertmicrobialdetectione:insertmicrobialdetectione,
      getmicrobialdetectione:getmicrobialdetectione,
      savemicrobiologyantiobiotics:savemicrobiologyantiobiotics,
      getidmicrobialdetection:getidmicrobialdetection,
      getgrowthordersample: getgrowthordersample,
      getgrowthortrackingsample:getgrowthortrackingsample,
      getcollectionmethod:getcollectionmethod,
      getanatomicalsites:getanatomicalsites,
      gettestmediaculturesid:gettestmediaculturesid, //* mediacuture
      getsubsamplesid:getsubsamplesid,
      gettestprocedureid:gettestprocedureid, //*procedure
      insertmicrobiology:insertmicrobiology,
      Newanatomicalsites:Newanatomicalsites,
      getmicrobiologyresultorder:getmicrobiologyresultorder,
      getmicrobiologyresult: getmicrobiologyresult,
      microbiologygrowth:microbiologygrowth,    
      getasks:getasks,
      getdetinationsmicrobiology:getdetinationsmicrobiology,
      Newtasksmediaculture:Newtasksmediaculture,
      Newtasksprocedure:Newtasksprocedure,
      getreferenciemicroorganisms:getreferenciemicroorganisms,
      getasksorder:getasksorder,
      updatetaskmicrobiology:updatetaskmicrobiology,
      getaskstrackingmicrobiology:getaskstrackingmicrobiology,
      getlisttrackingmicrobiologytasks: getlisttrackingmicrobiologytasks,
      getlisttasksperpatient: getlisttasksperpatient,
      restarttask: restarttask,
      getpendingverification:getpendingverification,
      getIndicatorOrderCount:getIndicatorOrderCount

    };

    return service;

       function getIdsensitivity(token, microorganism,test) {
            var promise = $http({
              hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/sensitivity/microorganism/' + microorganism+ '/test/' + test
            }).then(function (response) {
             return response;
         }); 
        }
      //Obtiene la información de una orden y un examen para el antibiograma.
      function getantibiogram(token, order,test) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl + '/microbiology/antibiogram/order/'+ order+ '/test/' + test
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
      // Realiza la inserción de datos correspondientes con el antibiograma asociado a una orden y examen.
     function insertantibiogram(token, antibiogram) {
       return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/antibiogram',
                  data: antibiogram
      }).then(function (response) {
        return response;
      });    
    }
     // Realiza la detección microbiana.
     function insertmicrobialdetectione(token, microbialdetection) {
       return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/microbialdetection',
                  data: microbialdetection
      }).then(function (response) {
        return response;
      });    
    }
    //Asocia los antibioticois a la detección microbiana.
     function savemicrobiologyantiobiotics(token, microbialdetection, order) {
       return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/microbiology/antiobiotics/order/' + order,
        data: microbialdetection
      }).then(function (response) {
        return response;
      });    
    }
    //Obtiene la información de una orden por muestra para realizar la detección microbiana.
     function getmicrobialdetectione(token, order,test) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/microbiology/microbialdetection/order/'+order+'/test/'+test
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
    //Obtiene los resultados asociados a microbiologia con filtros especificos.
     function getidmicrobialdetection(token,id, order) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/microbiology/antiobiotics/microbialdetection/'+id+'/order/'+order
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    //Obtiene la información de una orden por muestra para la verificación y siembra en microbiologia.
    function getgrowthordersample(token, order,sample) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/microbiology/growth/order/'+order+'/sample/'+sample
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
    //  Obtiene la trazabilidad de una orden por muestra para la verificación y siembra en microbiologia.
      function getgrowthortrackingsample(token, order,sample) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/microbiology/tracking/order/'+order+'/sample/'+sample
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
        //lista metodos de recolección
    function getcollectionmethod(token) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/collectionmethod/filter/state/true'
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    //lista sitios anatomicos
     function getanatomicalsites(token) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/anatomicalsites/filter/state/true'
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
  
     function getsubsamplesid(token,sampleid) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/samples/subsamples/'+sampleid
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    function gettestprocedureid(token,idtest) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/procedures/testprocedure/filter/idtest/'+idtest
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
     // Obtiene los valores de referencia Microorganismos
    function getreferenciemicroorganisms(token,microorganism) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/microorganisms/antibiotics/microorganism/'+ microorganism
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }


    function gettestmediaculturesid(token,idtest) {
       return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/mediacultures/filter/test/'+idtest
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }


     function insertmicrobiology(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/growth',
                  data: json
      }).then(function (response) {
        return response;
      });
    }
    
     function microbiologygrowth(token, growth) {
      return $http({
        hideOverlay: true,
                  method: 'PUT',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/growth',
                  data: growth
      }).then(function (response) {
        return response;
      });
    }


     function Newanatomicalsites(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/anatomicalsites',
                  data: json
      }).then(function (response) {
        return response;
      });
    }

    function getmicrobiologyresultorder(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/result/order',
                  data: json
      }).then(function (response) {
        return response;
      });
    }

    function getmicrobiologyresult(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/result',
                  data: json
      }).then(function (response) {
        return response;
      });
    }
  //Lista las tareas registradas por estado
     function getasks(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/tasks/filter/state/true'
      }).then(function (response) {
        return response;
      });
    }

    //Lista destinos de microbilogia activos
     function getdetinationsmicrobiology(token) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiologydestinations/filter/state/true'
      }).then(function (response) {
        return response;
      });
    }

    // crea tareas para medio de cultivo
     function Newtasksmediaculture(token, mediaculture) {
      return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/mediaculture/tasks',
                  data: mediaculture
      }).then(function (response) {
        return response;
      });
    }
       // crea tareas para procedimiento
     function Newtasksprocedure(token, procedure) {
      return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/procedure/tasks',
                  data: procedure
      }).then(function (response) {
        return response;
      });
    }

    //Lista las tareas de una orden
     function getasksorder(token, order,sample) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/tasks/order/'+order+'/sample/'+sample
      }).then(function (response) {
        return response;
      });
    }
    
    //Actualizar tareas de microbiologia.
      function updatetaskmicrobiology(token, tasks) {
      return $http({
        hideOverlay: true,
                  method: 'PUT',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/tasks',
                  data: tasks
      }).then(function (response) {
        return response;
      });
    }

    //Obtiene la trazabilidad de los comentarios de las tareas de microbiologia.
     function getaskstrackingmicrobiology(token,id, order,test) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/tracking/tasks/comment/id/'+id+'/order/'+order+'/test/'+test
      }).then(function (response) {
        return response;
      });
    }
 
    //Obtiene la trazabilidad de las tareas de microbiología. 
    function getlisttrackingmicrobiologytasks(token, order, test){
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/tracking/tasks/order/'+ order + '/test/' + test
      }).then(function (response) {
        return response;
      });
    }

    //Obtiene la lista de tareas de una orden por paciente
    function getlisttasksperpatient(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/report/tasks',
                  data: json
      }).then(function (response) {
        return response;
      });
    }

    //realiza el reinicio de tareas de un rango especifico de ordenes
    function restarttask(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/restart/tasks',
                  data: json
      }).then(function (response) {
        return response;
      });
    }
   //Obtiene un listado pendientes de vericacion de microobiologia.
    function getpendingverification(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/verification/pending',
                  data: json
      }).then(function (response) {
        return response;
      });
    }

    //Obtiene el conteo de las ordenes que estan pendientes de resultado, validacion y pre-validacion.
    function getIndicatorOrderCount(token, json) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/microbiology/count/pendingstate',
                  data: json
      }).then(function (response) {
        return response;
      });
    }
  
  }
})();
