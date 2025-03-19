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

             //   serviceUrl: 'http://192.168.1.192:8080/Enterprise_NT_Transplante/api',
               // serviceUrl: 'http://localhost:8080/Enterprise_NT/api',
              // serviceUrl: "http://192.168.1.6:5050/Enterprise_NT/api",

               // serviceUrl: 'http://192.168.1.90:8080/Enterprise_NT_Transplante/api',
                //serviceUrl: 'http://localhost:8080/Enterprise_NT/api',
              serviceUrl: "http://192.168.1.6:8080/Enterprise_NT_PAT_PG/api",

                // serviceUrl: 'http://192.168.1.6:8080/Enterprise_NT_PAT_PG/api',
               // serviceUrl: 'http://localhost:8080/Enterprise_NT/api',
                //serviceUrl: 'http://localhost:8080/Enterprise_NT/api',
                serviceUrlSocketIO: "http://192.168.2.7:5001"
            };
        });
})();
