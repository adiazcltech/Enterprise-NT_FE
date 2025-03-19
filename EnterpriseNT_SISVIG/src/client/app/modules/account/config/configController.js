/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.config")
    .controller("configController", configController);

  configController.$inject = [
    "demographicDS",
    "configurationDS",
    "$rootScope",
    "localStorageService",
    "$filter",
    "$state"
  ];
  /* @ngInject */
  function configController(
    demographicDS,
    configurationDS,
    $rootScope,
    localStorageService,
    $filter,
    $state
  ) {
    var vm = this;
    vm.init = init;
    vm.isAuthenticate = isAuthenticate;
    $rootScope.menu = true;
    $rootScope.NamePage = "Configuración general";
    vm.modalError = modalError;
    vm.getDemographicpatient = getDemographicpatient;
    vm.getDemographicorder = getDemographicorder;
    vm.loadingdata = true;
    vm.save = save;
    vm.getConfiguration = getConfiguration;

    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para consultar todos los demograficos y llenar los campos segun la necesidad**//
    function getConfiguration() {
      vm.detaildemographic = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS.getConfiguration(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            var config = $filter('filter')(data.data, function (e) {
              if (e.key === 'UrlCargaOrdenesERR') {
                vm.dataconfigurl = e.value;
              }
              if (e.key === 'DemograficosCargaOrdenesERR') {
                if (e.value === '') {
                  vm.detaildemographic = e.value;
                } else {
                  vm.detaildemographic = JSON.parse(e.value);
                }
              }
              return e.key === 'UrlCargaOrdenesERR'
            });
            vm.getDemographicpatient();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }


    //** Método para consultar todos los demograficos y llenar los campos segun la necesidad**//
    function getDemographicpatient() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var Demographic = [];
      return demographicDS.getDemographics(auth.authToken, "H").then(function (data) {
          if (data.status === 200) {
            data.data.forEach(function (value, key) {
              if (value.id !== -110) {
                if (value.id === -10) {
                  value.name = $filter("translate")('0233').toLowerCase();
                }else if (value.id === -100) {
                  value.name = $filter("translate")('0117').toLowerCase();
                }else if (value.id === -101) {
                  value.name = $filter("translate")('0234').toLowerCase();
                }else if (value.id === -102) {
                  value.name = $filter("translate")('0235').toLowerCase();
                }else if (value.id === -103) {
                  value.name = $filter("translate")('0236').toLowerCase();
                }else if (value.id === -104) {
                  value.name = $filter("translate")('0124').toLowerCase();
                }else if (value.id === -105) {
                  value.name = $filter("translate")('0120').toLowerCase();
                }else if (value.id === -106) {
                  value.name = $filter("translate")('0135').toLowerCase();
                }else if (value.id === -109) {
                  value.name = $filter("translate")('0237').toLowerCase();
                }else if (value.id === -110) {
                  value.name = $filter("translate")('0102').toLowerCase();
                }else if (value.id === -111) {
                  value.name = $filter("translate")('0188').toLowerCase();
                }else if (value.id === -112) {
                  value.name = $filter("translate")('0187').toLowerCase();
                }else if (value.id === -997) {
                  value.name = 'PATIENT_COMMENT';
                }else{
                  value.name = $filter("translate")(value.name).toLowerCase();
                }
               
                var valuedemographip = '';
                var valuedefault = false;
                var configDemographi = [];
                if (vm.detaildemographic.length !== 0) {
                  configDemographi = $filter('filter')(vm.detaildemographic.patien, function (e) {
                    return e.id === value.id
                  });
                  var valuedemographip = configDemographi.length === 0 ? '' : configDemographi[0].value;
                  var valuedefault = configDemographi.length === 0 ? '' : configDemographi[0].valuedefault;
                }
                var data = {
                  'id': value.id,
                  'key': key,
                  'name': value.name,
                  'requerid': value.obligatory !== 0,
                  'value': valuedemographip,
                  'valuedefault': valuedefault
                }
                Demographic.push(data);
              }
            });
            vm.listdemographicpatient = Demographic;
            vm.getDemographicorder();
          }
        },
        function (error) {
           vm.modalError(error);
        }
      );
    }
    //** Método para consultar todos los demograficos y llenar los campos segun la necesidad**//
    function getDemographicorder() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getDemographics(auth.authToken, "O").then(
        function (data) {
          var Demographic = [];
          if (data.status === 200) {
            data.data.forEach(function (value, key) {
              if (value.id !== -107 && value.id !== -108 && value.id !== -5) {
                value.name = $filter("translate")(value.name).toLowerCase();
                var valuedemographip = '';
                var valuedefault = false;
                if (vm.detaildemographic.length !== 0) {
                  var configDemographi = $filter('filter')(vm.detaildemographic.order, function (e) {
                    return e.id === value.id
                  });
                  var valuedemographip = configDemographi.length === 0 ? '' : configDemographi[0].value;
                  var valuedefault = configDemographi.length === 0 ? '' : configDemographi[0].valuedefault;
                }
                var data = {
                  'id': value.id,
                  'key': key,
                  'name': value.name,
                  'requerid': value.obligatory !== 0,
                  'value': valuedemographip,
                  'valuedefault': valuedefault
                }
                Demographic.push(data);
              }
            });
            vm.listdemographicorder = Demographic;
            vm.loadingdata = false;
          }
        },
        function (error) {
           vm.modalError(error);
        }
      );
    }

    //** Método para consultar todos los demograficos y llenar los campos segun la necesidad**//
    function save(Formurl,Formpatient,Formorder) {
      vm.loadingdata = true;
      if (Formurl.$valid && Formpatient.$valid && Formorder.$valid) {
        var lisdemographi = {
          'patien': vm.listdemographicpatient,
          'order': vm.listdemographicorder
        }
        var datalist = [{
            "key": "UrlCargaOrdenesERR",
            "value": vm.dataconfigurl
          },
          {
            "key": "DemograficosCargaOrdenesERR",
            "value": JSON.stringify(lisdemographi)
          }
        ]
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return configurationDS.updateconfiguration(auth.authToken, datalist).then(
          function (data) {
            data.data.forEach(function (value, key) {
              return localStorageService.set(value.key, value.value);
            });
            vm.getConfiguration();
            vm.loadingdata = false;
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }else{
        vm.loadingdata = false;
        Formurl.url.$touched = true;
        _.forEach(vm.listdemographicpatient, function(value, key) {
          if (value.requerid) {
            Formpatient['demopatient' + value.key].$touched = true;             
          }          
        });
        _.forEach(vm.listdemographicorder, function(value, key) {
          if (value.requerid) {
            Formorder['demo' + value.key].$touched = true;             
          }          
        });
      }     
    }

    function init() {
      vm.getConfiguration();

    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else if (!auth.administrator) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
