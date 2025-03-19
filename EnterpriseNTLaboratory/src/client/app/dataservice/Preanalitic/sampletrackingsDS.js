(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('sampletrackingsDS', sampletrackingsDS);

  sampletrackingsDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function sampletrackingsDS($http, settings) {
    var service = {
      sampletrackings: sampletrackings,
      sampledelayed: sampledelayed,
      interviewdestination: interviewdestination,
      alarminterview: alarminterview,
      saveinterviewdes: saveinterviewdes,
      sampleorder: sampleorder,
      samplerejection: samplerejection,
      updateResultForExam: updateResultForExam,
      sampleretake: sampleretake,
      sampletrackingstake: sampletrackingstake,
      samplepostponement: samplepostponement,
      sampletrackintemperature: sampletrackintemperature,
      SampleOrderRoute: SampleOrderRoute,
      trackingstakeinterview: trackingstakeinterview,
      sampleVerifyDestination: sampleVerifyDestination,
      sampletrackingsorder: sampletrackingsorder,
      sampleCheckRetakeTracking: sampleCheckRetakeTracking,
      sampletaketest: sampletaketest, 
      sampleaudit: sampleaudit
    };

    return service;


    function sampletaketest(token, tests) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          data: tests,
          url: settings.serviceUrl + '/sampletrackings/sampletaketest',
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function sampletrackings(token, order, sample) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/verify/order/' + order + '/sample/' + sample,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function sampledelayed(token, destination) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/delayed/destination/' + destination,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function interviewdestination(token, destination) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/interview/answer/destination/' + destination,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function saveinterviewdes(token, order, sample, destination, branch, interview) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/interview/order/' + order + '/sample' + sample + '/destination/' + destination + '/branch/' + branch,
          data: interview,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function alarminterview(token, order) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/alarminterview/' + order,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function sampleorder(token, order) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/samples/order/' + order,
          hideOverlay: false
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function samplerejection(token, order, sample, reject) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/reject/order/' + order + /sample/ + sample,
          data: reject,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //Rechaza la muestra ingresada.
    function updateResultForExam(token, changesample) {
      return $http({
          method: 'PUT',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/results/updateResultForExam',
          data: changesample,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }
    //Retoma la muestra ingresada.
    function sampleretake(token, order, sample, retake) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/retake/order/' + order + /sample/ + sample,
          data: retake,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //** Método que  Verifica la muestra ingresada para la toma de muestra.*/
    function sampletrackingstake(token, order, sample) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/take/order/' + order + '/sample/' + sample,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //** Método que  Verifica la muestra ingresada para la toma de muestra.*/
    function sampletrackintemperature(token, order, sample, temperature) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/verify/order/' + order + '/sample/' + sample + '/temperature/' + temperature,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }
    //** Método que  Verifica la muestra ingresada para la toma de muestra.*/
    function trackingstakeinterview(token, order, sample, destination, branch) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/interview/order/' + order + '/sample' + sample + '/destination/' + destination + '/branch/' + branch,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }
    //Aplaza la muestra ingresada.
    function samplepostponement(token, order, sample, postponement) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/postponement/order/' + order + /sample/ + sample,
          data: postponement,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //Consulta la ruta asociada a una muestra y una orden
    function SampleOrderRoute(token, order, sample) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/verify/destination/order/' + order + /sample/ + sample,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //Verifica la muestra en un destino especifico
    function sampleVerifyDestination(token, detail) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/verify/destination',
          data: detail,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //Obtiene la informacion de una orden.
    function sampletrackingsorder(token, order) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/order/' + order,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }
    //Obtiene la informacion de una orden.
    function sampleCheckRetakeTracking(token, order, sample) {
      return $http({
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/updateCheckRetake/order/' + order + '/sample/' + sample,
          hideOverlay: true
        })

        .then(success);

      function success(response) {
        return response;
      }
    }

    function sampleaudit(token, order, sample) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/sampletrackings/information/order/' + order + '/sample/' + sample,
          hideOverlay: true
        })
        .then(success);

      function success(response) {
        return response;
      }
    }
  }
})();
