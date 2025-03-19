(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('commentsDS', commentsDS);

  commentsDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function commentsDS($http, settings) {
    var service = {
      newCommentsOrder: newCommentsOrder,
      newCommentsMicrobiology: newCommentsMicrobiology,
      getCommentsOrder: getCommentsOrder,
      getCommentsPatient: getCommentsPatient,
      getCommentsMicrobiologyTest: getCommentsMicrobiologyTest,
      getCommentsMicrobiologySample: getCommentsMicrobiologySample,
      getCommentsTracking: getCommentsTracking,
      getCommentsTrackingmicrobiology: getCommentsTrackingmicrobiology,
      getResultscellularcounters: getResultscellularcounters

    };

    return service;

    function newCommentsOrder(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/order',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function newCommentsMicrobiology(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/microbiology',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsOrder(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/order/' + order
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsPatient(token, idPatient) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/patient/' + idPatient
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsMicrobiologyTest(token, order, idTest) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/microbiology/order/' + order + '/test/' + idTest
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsMicrobiologySample(token, order, idSample) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/microbiology/order/' + order + '/sample/' + idSample
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsTracking(token, orderhistory, type) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/order/tracking/record/' + orderhistory + '/type/' + type
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getCommentsTrackingmicrobiology(token, orderhistory, idTest) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments/microbiology/tracking/order/' + orderhistory + '/test/' + idTest
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getResultscellularcounters(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cellularcounters'
      })
        .then(success);
      function success(response) {
        return response;
      }
    }

  }
})();
