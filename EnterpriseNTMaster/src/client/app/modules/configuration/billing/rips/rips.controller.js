(function () {
  'use strict';
  angular.module('app.rips')
    .controller('ripsController', ripsController);

    ripsController.$inject = ['centralsystemDS', 'demographicDS','ripsDS', 'localStorageService', '$filter', '$state', '$rootScope','logger', 'providerDS'];

  function ripsController(centralsystemDS, demographicDS,ripsDS, localStorageService,  $filter, $state, $rootScope, logger, providerDS) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'rips';
    vm.selected = -1;
    vm.isAuthenticate = isAuthenticate;
    vm.cancel = cancel;
    vm.save = save;
    vm.getDemographicsALL = getDemographicsALL;
    vm.modalError = modalError;
    vm.getsystemcentral=getsystemcentral;
    vm.getlis=getlis;
    vm.onSelect=onSelect;
    vm.getProviders = getProviders;
    vm.providers = [];
    vm.loadingdata=true;
    vm.selectEntity = selectEntity;

    function selectEntity() {
      if(vm.configrips[7].value) {
        var entity = _.find(vm.providers, function(o) { return o.id === vm.configrips[7].value; });
        if(entity) {
          vm.configrips[7].type = 0;
          vm.configrips[7].fixedValue = entity.name;
          vm.configrips[12].fixedValue = entity.nit;
        }
      }
    }


    //** Metodo que consulta la lista de entidades */}

    function getProviders() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return providerDS.get(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function(value) {
            if(value.active) {
              vm.providers.push({
                'id': value.id,
                'name': value.name,
                'nit': value.nit
              });
            }
          })
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y actualiza**//
    function save() {
      vm.loadingdata=true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ripsDS.updaterips(auth.authToken,vm.configrips).then(function (data) {
        vm.loadingdata=true;
        logger.success($filter('translate')('0042'));
        vm.getsystemcentral();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que cancela los cambios antes de guardar**//
    function cancel() {
      vm.loadingdata=true;
      vm.getsystemcentral();
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata=false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para consultar todos los demograficos y llenar los campos segun la necesidad**//
    function getDemographicsALL() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
         //type: 0 como valor fijo y 1 como demografico
        vm.listdemographic = [];
        vm.listdemographicTI = [
          {
            'id': 'CC',
            'name': ($filter('translate')('3046')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'CE',
            'name': ($filter('translate')('3047')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'PA',
            'name': ($filter('translate')('3048')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'RC',
            'name': ($filter('translate')('3049')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'TI',
            'name': ($filter('translate')('3050')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'AS',
            'name': ($filter('translate')('3051')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'MS',
            'name': ($filter('translate')('3052')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'NU',
            'name': ($filter('translate')('3053')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          }
        ]
        vm.listdemographicTIP = [
          {
            'id': 'NI',
            'name': ($filter('translate')('3054')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'CC',
            'name': ($filter('translate')('3046')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'CE',
            'name': ($filter('translate')('3047')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'PA',
            'name': ($filter('translate')('3048')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          }
        ]
        vm.DemographicResidencia = [{
            'id':'U',
            'name': ($filter('translate')('3055')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          },
          {
            'id': 'R',
            'name': ($filter('translate')('3056')).toUpperCase(),
            'type':0,
            'icon': "<span class='label label-info'>F</span>"
          }
        ]
        vm.listdemographicAmbito = [{
          'id': '1',
          'name': ($filter('translate')('3057')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '2',
          'name': ($filter('translate')('3058')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '3',
          'name': ($filter('translate')('3059')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicPurpose = [{
          'id': '1',
          'name': ($filter('translate')('0180')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '2',
          'name': ($filter('translate')('1282')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '3',
          'name': ($filter('translate')('1283')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '4',
          'name': ($filter('translate')('1284')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '5',
          'name': ($filter('translate')('1285')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicTown = [{
          'id': '1',
          'name': ($filter('translate')('1286')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicDepartment = [{
          'id': '1',
          'name': ($filter('translate')('1286')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicMembership = [{
          'id': '1',
          'name': ($filter('translate')('1287')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '2',
          'name': ($filter('translate')('1288')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '3',
          'name': ($filter('translate')('1289')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '4',
          'name': ($filter('translate')('1290')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        },
        {
          'id': '5',
          'name': ($filter('translate')('1291')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicAuth = [{
          'id': '1',
          'name': ($filter('translate')('0734')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        vm.listdemographicDiagnosis = [{
          'id': '1',
          'name': ($filter('translate')('1292')).toUpperCase(),
          'type':0,
          'icon': "<span class='label label-info'>F</span>"
        }];

        var cant=data.data[data.data.length-1];
        data.data.forEach(function (value, key) {
          switch (value.id) {
            case -1:
              data.data[key].name = $filter('translate')('0248');
              break;
            case -2:
              data.data[key].name = $filter('translate')('0225');
              break;
            case -3:
              data.data[key].name = $filter('translate')('0307');
              break;
            case -4:
              data.data[key].name = $filter('translate')('0133');
              break;
            case -5:
              data.data[key].name = $filter('translate')('0075');
              break;
            case -6:
              data.data[key].name = $filter('translate')('0175');
              break;
            case -7:
              data.data[key].name = $filter('translate')('0174');
              break;
            default:
              data.data[key].name = data.data[key].name;
          }
          vm.listdemographicTI.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon': "<span class='label label-primary'>D</span>"
          });
          vm.listdemographicTIP.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon': "<span class='label label-primary'>D</span>"
          });
          vm.DemographicResidencia.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon': "<span class='label label-primary'>D</span>"
          });
          vm.listdemographicAmbito.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicPurpose.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicTown.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicDepartment.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicMembership.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicAuth.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographicDiagnosis.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon':"<span class='label label-primary'>D</span>"
          });
          vm.listdemographic.push({
            'id': (value.id).toString(),
            'name': (value.name).toUpperCase(),
            'type':1,
            'icon': "<span class='label label-primary'>D</span>"
          });
          if(value.id===cant.id){
            vm.getlis()
          }
        });
        vm.listdemographicTI = $filter('orderBy')(vm.listdemographicTI, 'name');
        vm.listdemographicTIP = $filter('orderBy')(vm.listdemographicTIP, 'name');
        vm.DemographicResidencia = $filter('orderBy')(vm.DemographicResidencia, 'name');
        vm.listdemographicAmbito = $filter('orderBy')(vm.listdemographicAmbito, 'name');
        vm.listdemographicPurpose = $filter('orderBy')(vm.listdemographicPurpose, 'name');
        vm.listdemographicTown = $filter('orderBy')(vm.listdemographicTown, 'name');
        vm.listdemographicDepartment = $filter('orderBy')(vm.listdemographicDepartment, 'name');
        vm.listdemographicMembership = $filter('orderBy')(vm.listdemographicMembership, 'name');
        vm.listdemographicAuth = $filter('orderBy')(vm.listdemographicAuth, 'name');
        vm.listdemographicDiagnosis = $filter('orderBy')(vm.listdemographicDiagnosis, 'name');
        vm.listdemographic = $filter('orderBy')(vm.listdemographic, 'name');
        vm.getProviders();
      }, function (error) {
        vm.modalError(error);
      });
    }
     //** Método para consultar todos los sistemas centrales**//
    function getsystemcentral() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var noApply = '-- ' + $filter('translate')('0504') + ' --';
        vm.centralsystem = [{
          'id': '',
          'name': noApply
        }];
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function(value) {
            vm.centralsystem.push({
                'id': value.id,
                'name': value.name
            });
          })
        }
        vm.getDemographicsALL();
      }, function (error) {
        vm.modalError(error);
      });
    }
     //** Método para asignar valores cuando cambia el select**//
    function onSelect(item, model) {
      if(item ==='Entidad'){
        vm.configrips[7].value=model.id;
        vm.configrips[7].type=model.type;
      }
      if(item ==='CodigoEntidad'){
        vm.configrips[3].value=model.id;
        vm.configrips[3].type=model.type;
      }
      if(item ==='TipoIdentificacionPrestador'){
        vm.configrips[12].value=model.id;
        vm.configrips[12].type=model.type;
      }
      if(item ==='TipoIdentificacion'){
        vm.configrips[11].value=model.id;
        vm.configrips[11].type=model.type;
      }
      if(item ==='Ambito'){
        vm.configrips[1].value=model.id;
        vm.configrips[1].type=model.type;
      }
      if(item ==='Proposito'){
        vm.configrips[9].value=model.id;
        vm.configrips[9].type=model.type;
      }
      if(item ==='Residencia'){
        vm.configrips[10].value=model.id;
        vm.configrips[10].type=model.type;
      }
      if(item ==='Municipio'){
        vm.configrips[8].value=model.id;
        vm.configrips[8].type=model.type;
      }
      if(item ==='Departamento'){
        vm.configrips[5].value=model.id;
        vm.configrips[5].type=model.type;
      }
      if(item ==='Afiliacion'){
        vm.configrips[0].value=model.id;
        vm.configrips[0].type=model.type;
      }
      if(item ==='Autorizacion'){
        vm.configrips[2].value=model.id;
        vm.configrips[2].type=model.type;
      }
      if(item ==='Diagnostico'){
        vm.configrips[6].value=model.id;
        vm.configrips[6].type=model.type;
      }
    }
      //** Método para cargar las lista de los valores**//
    function getlis() {
      vm.configrips = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ripsDS.getrips(auth.authToken).then(function (data) {
        if (data.status === 200) {
          var Afiliacion=$filter("filter")(data.data, function (e) { return e.key === "Afiliacion";});
          var Ambito=$filter("filter")(data.data, function (e) { return e.key === "Ambito";});
          var Autorizacion=$filter("filter")(data.data, function (e) { return e.key === "Autorizacion";});
          var CodigoEntidad=$filter("filter")(data.data, function (e) { return e.key === "CodigoEntidad";});
          var CodigosPruebas=$filter("filter")(data.data, function (e) { return e.key === "CodigosPruebas";});
          var Departamento=$filter("filter")(data.data, function (e) { return e.key === "Departamento";});
          var Diagnostico=$filter("filter")(data.data, function (e) { return e.key === "Diagnostico";});
          var Entidad=$filter("filter")(data.data, function (e) { return e.key === "Entidad";});
          var Municipio=$filter("filter")(data.data, function (e) { return e.key === "Municipio";});
          var Proposito=$filter("filter")(data.data, function (e) { return e.key === "Proposito";});
          var Residencia=$filter("filter")(data.data, function (e) { return e.key === "Residencia";});
          var TipoIdentificacion=$filter("filter")(data.data, function (e) { return e.key === "TipoIdentificacion";});
          var TipoIdentificacionPrestador=$filter("filter")(data.data, function (e) { return e.key === "TipoIdentificacionPrestador";});
          vm.configrips = [
              {//0
                "key": "Afiliacion",
                "value": Afiliacion[0].value===''?'':Afiliacion[0].value,
                "select":Afiliacion[0].value===''?'': $filter("filter")(vm.listdemographicMembership, function (e) {return e.id === Afiliacion[0].value})[0],
                "type": Afiliacion[0].type,
                "fixedValue": Afiliacion[0].fixedValue
              },
              {//1
                "key": "Ambito",
                "value": Ambito[0].value===''?'':Ambito[0].value,
                "select":Ambito[0].value===''?'': $filter("filter")(vm.listdemographicAmbito, function (e) {  return e.id === Ambito[0].value && e.type === Ambito[0].type })[0],
                "type": Ambito[0].type,
                "fixedValue": Ambito[0].fixedValue
              },
              {//2
                "key": "Autorizacion",
                "value": Autorizacion[0].value===''?'':Autorizacion[0].value,
                "select":Autorizacion[0].value===''?'': $filter("filter")(vm.listdemographicAuth, function (e) {return e.id === Autorizacion[0].value})[0],
                "type": Autorizacion[0].type,
                "fixedValue": Autorizacion[0].fixedValue
              },
              {//3
                "key": "CodigoEntidad",
                "value": CodigoEntidad[0].value===''?'':CodigoEntidad[0].value,
                "select":CodigoEntidad[0].value===''?'': $filter("filter")(vm.listdemographic, function (e) {return e.id === CodigoEntidad[0].value})[0],
                "type": 0,
                "fixedValue": CodigoEntidad[0].fixedValue
              },
              {//4
                "key": "CodigosPruebas",
                "value": CodigosPruebas[0].value===''? '' :parseInt(CodigosPruebas[0].value),
                "type": 0,
                "fixedValue": ""
              },
              {//5
                "key": "Departamento",
                "value": Departamento[0].value===''?'':Departamento[0].value,
                "select":Departamento[0].value===''?'': $filter("filter")(vm.listdemographicDepartment, function (e) {return e.id === Departamento[0].value})[0],
                "type": Departamento[0].type,
                "fixedValue": Departamento[0].fixedValue
              },
              {//6
                "key": "Diagnostico",
                "value": Diagnostico[0].value===''?'':Diagnostico[0].value,
                "select":Diagnostico[0].value===''?'': $filter("filter")(vm.listdemographicDiagnosis, function (e) {return e.id === Diagnostico[0].value})[0],
                "type": Diagnostico[0].type,
                "fixedValue": Diagnostico[0].fixedValue
              },
              {//7
                "key": "Entidad",
                "value": Entidad[0].value===''? '' :parseInt(Entidad[0].value),
                "type": Entidad[0].type,
                "fixedValue": Entidad[0].fixedValue
              },
              {//8
                "key": "Municipio",
                "value": Municipio[0].value===''?'':Municipio[0].value,
                "select":Municipio[0].value===''?'': $filter("filter")(vm.listdemographicTown, function (e) {return e.id === Municipio[0].value})[0],
                "type": Municipio[0].type,
                "fixedValue": Municipio[0].fixedValue
              },
              {//9
                "key": "Proposito",
                "value": Proposito[0].value===''?'':Proposito[0].value,
                "select":Proposito[0].value===''?'': $filter("filter")(vm.listdemographicPurpose, function (e) {return e.id === Proposito[0].value})[0],
                "type": Proposito[0].type,
                "fixedValue": Proposito[0].fixedValue
              },
              {//10
                "key": "Residencia",
                "value": Residencia[0].value===''?'':Residencia[0].value,
                "select":Residencia[0].value===''?'': $filter("filter")(vm.DemographicResidencia, function (e) {return e.id === Residencia[0].value})[0],
                "type": Residencia[0].type,
                "fixedValue": Residencia[0].fixedValue
              },
              {//11
                "key": "TipoIdentificacion",
                "value": TipoIdentificacion[0].value===''?'':TipoIdentificacion[0].value,
                "select":TipoIdentificacion[0].value===''?'': $filter("filter")(vm.listdemographicTI, function (e) {return e.id === TipoIdentificacion[0].value})[0],
                "type": TipoIdentificacion[0].type,
                "fixedValue": TipoIdentificacion[0].fixedValue
              },
              {//12
                "key": "TipoIdentificacionPrestador",
                "value": TipoIdentificacionPrestador[0].value===''?'':TipoIdentificacionPrestador[0].value,
                "select":TipoIdentificacionPrestador[0].value===''?'': $filter("filter")(vm.listdemographicTIP, function (e) {return e.id === TipoIdentificacionPrestador[0].value})[0],
                "type": TipoIdentificacionPrestador[0].type,
                "fixedValue": TipoIdentificacionPrestador[0].fixedValue
              }
          ]
          vm.loadingdata=false;
        }
        vm.loadingdata=false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getsystemcentral();
    }
     //** Metodo que valida la autenticación**//
     function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }

})();
