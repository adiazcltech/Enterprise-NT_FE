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
    /*      serviceUrlSocket: 'ws://192.168.1.6:8080/Enterprise_NT_PRU',
        serviceUrl: 'http://192.168.1.6:8080/Enterprise_NT_PRU/api'   */


        serviceUrlSocket: "ws://192.168.1.211:8080/HIS_API_ERR",
        serviceUrl: "http://192.168.1.211:8080/HIS_API_ERR/api", 

        //panama
        /*  serviceUrlSocket: "ws://192.168.1.147:8080/Enterprise_NT_SMC",
         serviceUrl: "http://192.168.1.147:8080/Enterprise_NT_SMC/api", */

        /*serviceUrlSocket: "ws://192.168.1.147:8080/Enterprise_NT-1.0.0",
          serviceUrl: "http://192.168.1.147:8080/Enterprise_NT-1.0.0/api", */

        //ximena posgress
        /*     serviceUrl: 'http://201.184.70.155:8080/Enterprise_NT_PRU_postgresql/api',
            serviceUrlSocket: 'ws://201.184.70.155:8080/Enterprise_NT_PRU_postgresql' */
        //ximena sql
        /*  serviceUrl: 'http://181.48.43.68:7575/Enterprise_NT_PRU_sqlserver/api',
         serviceUrlSocket: 'ws://181.48.43.68:7575/Enterprise_NT_PRU_sqlserver' */
      };
    });
})();
