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
          // serviceUrl:'http://131.100.143.238:8080/Enterprise_NT_Outreach/api'
          serviceUrl:'http://localhost:8080/Enterprise_NT_Outreach/api' , 
        //pruebas

        //serviceUrl:"http://localhost:8080/Enterprise_NT_Outreach/api",

        // serviceUrlSocketIO: "http://localhost:5001"
        // serviceUrl:"http://localhost:8080/Enterprise_NT_Outreach/api",
        // serviceUrlSocketIO:"http://192.168.10.114:10003",
        //serviceUrl:"http://localhost:8084/Enterprise_NT_Outreach/api",
        serviceUrlSocketIO: "http://localhost:5001",
        serviceUrlApi: "http://localhost:5200/api",
      };
    });
})();
