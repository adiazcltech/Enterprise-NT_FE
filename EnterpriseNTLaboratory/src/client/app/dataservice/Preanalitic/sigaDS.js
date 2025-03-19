(function () {
  "use strict";

  angular.module("app.core").factory("sigaDS", sigaDS);

  sigaDS.$inject = ["$http", "settings", "localStorageService"];
  /* @ngInject */

  function sigaDS($http, settings, localStorageService) {
    var service = {
      getUserHistory: getUserHistory,
      getPoint: getPoint,
      getPointall: getPointall,
      getorderforturn: getorderforturn,
      withoutturn: withoutturn,
      searchpatient: searchpatient,
      getturnsActive: getturnsActive,
      getturncall: getturncall,
      startWork: startWork,
      gettransferservicies: gettransferservicies,
      stopWork: stopWork,
      pauseWork: pauseWork,
      transfers: transfers,
      getReasonBreak: getReasonBreak,
      getReasonPostponement: getReasonPostponement,
      getReasonCancel: getReasonCancel,
      turnmanual: turnmanual,
      attendturn: attendturn,
      cancelturn: cancelturn,
      postponeturn: postponeturn,
      reserverturn: reserverturn,
      shiftorders: shiftorders,
      turnAutomatic: turnAutomatic,
      turnorder: turnorder,
    };

    return service;

    function getUserHistory(token, userName, url) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getUserHistory1(token, userName, url)
      } else {
        return getUserHistory2(token, userName, url)
      }
    }
    function getUserHistory1(token, userName, url) {
      var params = {
        url: url + "/api/log/validateTurnInPoint?username=" + userName,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getUserHistory2(token, userName, url) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/getUserHistory/userName/" +
          userName,
      }).then(function (response) {
        return response;
      });
    }
    function getPoint(token, branch, service) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getPoint1(token, branch, service)
      } else {
        return getPoint2(token, branch, service)
      }
    }
    function getPoint1(token, branch, service) {
      var params = {
        url:
          localStorageService.get("UrlSIGA") +
          "/api/pointOfCare/getByBranchService/" +
          branch +
          "/" +
          service,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getPoint2(token, branch, service) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/pointOfCares/" +
          branch +
          "/" +
          service,
      }).then(function (response) {
        return response;
      });
    }
    function getPointall(token) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getPointall1(token)
      } else {
        return getPointall2(token)
      }
    }
    function getPointall1(token) {
      var params = {
        url: localStorageService.get("UrlSIGA") + "/pointsOfCare/",
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getPointall2(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/getAllPointsOfCare",
      }).then(function (response) {
        return response;
      });

    }
    function getorderforturn(token, turn) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/orders/ordersbyturn/" + turn,
      }).then(function (response) {
        return response;
      });
    }
    function withoutturn(token, history, type) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl + "/orders/withoutturn/" + history + "/" + type,
      }).then(function (response) {
        return response;
      });
    }
    function searchpatient(token, history) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/orders/withoutturnbyhistory/" + history,
      }).then(function (response) {
        return response;
      });
    }
    function getturnsActive(token, branch, service, point) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getturnsActive1(token, branch, service, point)
      } else {
        return getturnsActive2(token, branch, service, point)
      }
    }
    function getturnsActive1(token, branch, service, point) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var params = {
        url:
          localStorageService.get("UrlSIGA") +
          "/api/turns/daily/" +
          branch +
          "/" +
          service +
          "/" +
          auth.lastName +
          "/" +
          auth.name +
          "/" +
          auth.userName +
          "/" +
          point,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getturnsActive2(token, branch, service, point) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/turnsActive/" +
          branch +
          "/" +
          service +
          "/" +
          point,
      }).then(function (response) {
        return response;
      });
    }
    function getturncall(token, turn, service) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getturncall1(token, turn, service)
      } else {
        return getturncall2(token, turn, service)
      }
    }
    function getturncall1(token, turn, service) {
      var params = {
        url:
          localStorageService.get("UrlSIGA") +
          "/api/turns/call/" +
          turn +
          "/" +
          service,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getturncall2(token, turn, service) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/turncall/" +
          turn +
          "/" +
          service,
      }).then(function (response) {
        return response;
      });
    }
    function gettransferservicies(token, branch, service, turn) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return gettransferservicies1(token, branch, service, turn)
      } else {
        return gettransferservicies2(token, branch, service, turn)
      }
    }
    function gettransferservicies1(token, branch, service, turn) {
      var params = {
        url:
          localStorageService.get("UrlSIGA") +
          "/api/transfers/services/" +
          branch +
          "/" +
          service +
          "/" +
          turn,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function gettransferservicies2(token, branch, service, turn) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/transferservicies/" +
          branch +
          "/" +
          service +
          "/" +
          turn,
      }).then(function (response) {
        return response;
      });
    }
    function getReasonBreak(token) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
         return getReasonBreak1(token)
      } else {
         return getReasonBreak2(token)
      }
    }
    function getReasonBreak1(token) {
      var params = {
        url: localStorageService.get("UrlSIGA") + "/api/reasons/break",
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getReasonBreak2(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/reasons/break",
      }).then(function (response) {
        return response;
      });
    }
    function getReasonPostponement(token) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getReasonPostponement1(token)
      } else {
        return getReasonPostponement2(token)
      }
    }
    function getReasonPostponement1(token) {
      var params = {
        url: localStorageService.get("UrlSIGA") + "/api/reasons/postponement",
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getReasonPostponement2(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/reasons/postponement",
      }).then(function (response) {
        return response;
      });

    }
    function getReasonCancel(token) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return getReasonCancel1(token)
      } else {
        return getReasonCancel2(token)
      }
    }
    function getReasonCancel1(token) {
      var params = {
        url: localStorageService.get("UrlSIGA") + "/api/reasons/cancel",
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function getReasonCancel2(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/reasons/cancel",
      }).then(function (response) {
        return response;
      });
    }
    function turnAutomatic(token, branch, service, point) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return turnAutomatic1(token, branch, service, point)
      } else {
        return turnAutomatic2(token, branch, service, point)
      }
    }
    function turnAutomatic1(token, branch, service, point) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var params = {
        url:
          localStorageService.get("UrlSIGA") +
          "/api/turns/automatic/" +
          branch +
          "/" +
          service +
          "/" +
          point +
          "/" +
          auth.lastName +
          "/" +
          auth.name +
          "/" +
          auth.userName,
      };
      return $http.post("/api/getdatasiga", params).then(success);
      function success(response) {
        return response;
      }
    }
    function turnAutomatic2(token, branch, service, point) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/integration/siga/turnAutomatic/" +
          branch +
          "/" +
          service +
          "/" +
          point,
      }).then(function (response) {
        return response;
      });
    }
    function startWork(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return startWork1(token, data)
      } else {
        return startWork2(token, data)
      }
    }
    function startWork1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/log",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function startWork2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/startWork",
        data: data,
      }).then(function (response) {
        return response;
      });

    }
    function stopWork(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return stopWork1(token, data)
      } else {
        return stopWork2(token, data)
      }
    }
    function stopWork1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/log",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function stopWork2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/stopWork",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function pauseWork(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return pauseWork1(token, data)
      } else {
        return pauseWork2(token, data)
      }
    }
    function pauseWork1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/log",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function pauseWork2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/pauseWork",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function transfers(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return transfers1(token, data)
      } else {
        return transfers2(token, data)
      }
    }
    function transfers1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/transfers",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function transfers2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/transfers",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function cancelturn(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return cancelturn1(token, data)
      } else {
        return cancelturn2(token, data)
      }
    }
    function cancelturn1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/turns/insertMovement",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function cancelturn2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/endturn",
        data: data,
      }).then(function (response) {
        return response;
      });

    }
    function turnmanual(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return turnmanual1(token, data)
      } else {
        return turnmanual2(token, data)
      }
    }
    function turnmanual1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/turns/call",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function turnmanual2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/turnmanual",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function attendturn(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return attendturn1(token, data)
      } else {
        return attendturn2(token, data)
      }
    }
    function attendturn1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/turns/insertMovement",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function attendturn2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/attendturn",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function postponeturn(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return postponeturn1(token, data)
      } else {
        return postponeturn2(token, data)
      }
    }
    function postponeturn1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/turns/insertMovement",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function postponeturn2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/postponeturn",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function reserverturn(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return reserverturn1(token, data)
      } else {
        return reserverturn2(token, data)
      }
    }
    function reserverturn1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/turns/insertMovement",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function reserverturn2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/reserverturn",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function shiftorders(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/orders/shiftorders",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
    function turnorder(token, data) {
      if (localStorageService.get("manejodesigaporsede") === "True") {
        return turnorder1(token, data);
      } else {
        return turnorder2(token, data);
      }
    }
    function turnorder1(token, data) {
      var parameters = {
        url: localStorageService.get("UrlSIGA") + "/api/orders",
        data: data,
      };
      return $http.post("/api/getdatasigapost", parameters).then(success);
      function success(response) {
        return response;
      }
    }
    function turnorder2(token, data) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/integration/siga/turnorder",
        data: data,
      }).then(function (response) {
        return response;
      });
    }
  }
})();