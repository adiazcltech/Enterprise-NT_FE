/* global toastr:false, moment:false */
(function () {
  'use strict';

  angular
    .module('blocks.settings')
    .constant('siteSettings', {
      useTestData: true,
      websiteRootUrl: 'http://localhost:3000',
      environment: 'dev',
      apiBaseUrl: 'https://stage-a.careerscore.com'
    })
    .factory('settings', function () {
      return {
        serviceUrl: 'http://192.168.1.6:8080/Enterprise_NT_PRU/api'
      };


    });
})();
