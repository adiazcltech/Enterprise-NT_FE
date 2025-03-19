/* global toastr:false, moment:false */
(function () {
  "use strict";

  angular
    .module("blocks.settings")
    .constant("siteSettings", {
      useTestData: true,
      websiteRootUrl: "http://localhost:3000",
      environment: "dev",
      // apiBaseUrl: 'http://localhost:19428',
      apiBaseUrl: "https://stage-a.careerscore.com",
    })
    .factory("settings", function () {
      return {
        serviceUrl:"http://181.48.43.68:7575/Enterprise_NT_Outreach_PRU",
        serviceUrlSocketIO: "http://localhost:5001"
        //serviceUrl:'http://181.48.43.68:7575/Enterprise_NT_Outreach_PRU/api'
        //serviceUrl: 'http://hefesto:8080/Enterprise_NT_Outreach_PRU_sqlserver/api'
      };
    });
})();
