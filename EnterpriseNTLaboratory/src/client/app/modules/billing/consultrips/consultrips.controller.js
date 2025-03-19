/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.consultrips')
    .controller('consultripsController', consultripsController);
  consultripsController.$inject = ['localStorageService', '$filter', '$state', 'moment', '$rootScope', 'ripsDS', 'common', 'logger'];

  function consultripsController(localStorageService, $filter, $state, moment, $rootScope, ripsDS, common, logger) {
    var vm = this;
    vm.title = 'consultrips';
    $rootScope.menu = true;
    $rootScope.NamePage = 'RIPS';
    $rootScope.helpReference = '08.billingconsultrips.htm';
    vm.filterRange = "1";
    vm.rangeInit = "";
    vm.rangeend = "";
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.modalError = modalError;
    vm.report = false;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.getRips = getRips;
    vm.loadFiles = loadFiles;
    vm.getConfiguration = getConfiguration;
    vm.loadConfigurationValue = loadConfigurationValue;
    vm.loadFixedValue = loadFixedValue;
    vm.numFilterAreaTest = 0;
    vm.listAreas = [];
    vm.listTests = [];
    vm.unbilledOrders = false;
    vm.nameCustomer = localStorageService.get('Entidad');
    vm.auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.filterprices = '0';
    $rootScope.pageview = 3;

    function loadConfigurationValue(value, property) {
      var configurationValue = _.find(value, function (o) { return o.ripsProperty === property; });
      if (configurationValue !== undefined) {
        if (configurationValue.value) {
          if (property === 'Departamento' || property === 'Municipio') {
            if (configurationValue.type === 1) {
              return configurationValue.codedemographic;
            } else if (configurationValue.type === 0 && configurationValue.fixedValue != '' && configurationValue.fixedValue != undefined) {
              return configurationValue.fixedValue;
            } else {
              return configurationValue.value;
            }
          } else {
            return configurationValue.value
          }
        } else {
          return '';
        }
      } else {
        configurationValue = _.find(vm.configurationRips, function (o) { return o.key === property; });
        if (configurationValue !== undefined) {
          if (configurationValue.value) {
            if (property === 'Departamento' || property === 'Municipio') {
              if (configurationValue.type === 1) {
                return configurationValue.codedemographic;
              } else if (configurationValue.type === 0 && configurationValue.fixedValue != '' && configurationValue.fixedValue != undefined) {
                return configurationValue.fixedValue;
              } else {
                return configurationValue.value;
              }
            } else {
              return configurationValue.value
            }
          } else {
            return '';
          }
        }
        else {
          return ''
        }
      }
    }

    function loadFixedValue(property) {
      var configurationValue = _.find(vm.configurationRips, function (o) { return o.key === property; });
      if (configurationValue !== undefined) {
        if (configurationValue.fixedValue) {
          return configurationValue.fixedValue;
        } else {
          return '';
        }
      }
      else {
        return ''
      }
    }

    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function getRips() {

      if (vm.unbilledOrders && !vm.invoice) {
        logger.error($filter('translate')('1863'));
        vm.report = false;
        return false;
      }

      var data = {
        "rangeType": vm.filterRange,
        "init": vm.rangeInit,
        "end": vm.rangeEnd,
        "demographics": vm.demographics,
        'testFilterType': vm.numFilterAreaTest,
        'tests': vm.numFilterAreaTest === 1 ? vm.listAreas : vm.listTests,
        'billing': vm.unbilledOrders ? 0 : 1
      };

      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      vm.ad = '';
      vm.af = '';
      vm.ap = '';
      vm.us = '';
      vm.ct = '';

      return ripsDS.getrips(auth.authToken, data).then(function (data) {

        if (data.status === 200) {

          //Archivo de descripción agrupada de los servicios de salud prestados
          var ad = {};
          var af = {};

          ad[vm.invoice] = [];
          af[vm.invoice] = [];

          data.data.forEach(function (value) {
            var codeEntity = vm.loadConfigurationValue(value.demographicRips, 'CodigoEntidad');
            var entity = vm.loadFixedValue('Entidad');
            var entityIdentificationType = vm.loadConfigurationValue(value.demographicRips, 'TipoIdentificacionPrestador');
            var identification = vm.loadFixedValue('TipoIdentificacionPrestador');
            var identificationType = vm.loadConfigurationValue(value.demographicRips, 'TipoIdentificacion');
            var ambit = vm.loadConfigurationValue(value.demographicRips, 'Ambito');
            var purpose = vm.loadConfigurationValue(value.demographicRips, 'Proposito');
            var diagnosis = vm.loadConfigurationValue(value.demographicRips, 'Diagnostico');
            var membership = vm.loadConfigurationValue(value.demographicRips, 'Afiliacion');
            var department = vm.loadConfigurationValue(value.demographicRips, 'Departamento');
            var township = vm.loadConfigurationValue(value.demographicRips, 'Municipio');
            var residence = vm.loadConfigurationValue(value.demographicRips, 'Residencia');
            var authorization = vm.loadConfigurationValue(value.demographicRips, 'Autorizacion');


            value.tests.forEach(function (val) {

              var invoice = '';

              if (val.hasOwnProperty('invoiceC')) {

                invoice = val.invoiceC;

                var testinfo = {
                  'entity': codeEntity,
                  'test': val,
                  'copay': value.copay === null || value.copay === undefined ? 0 : value.copay,
                  'order': value.orderNumber
                };

                if(ad[val.invoiceC] === undefined) {
                  ad[val.invoiceC] = []
                }

                ad[val.invoiceC].push(testinfo);

                var datainfo = {
                  'data': {
                    'codeEntity': codeEntity,
                    'entity': entity,
                    'entityIdentificationType': entityIdentificationType,
                    'identification': identification,
                    'clientCode': value.clientCode,
                    'clientName': value.clientName,
                  },
                  'test': val,
                  'copay': value.copay === null || value.copay === undefined ? 0 : value.copay,
                  'order': value.orderNumber
                }

                if(af[val.invoiceC] === undefined) {
                  af[val.invoiceC] = []
                }

                af[val.invoiceC].push(datainfo);

              } else {

                invoice = vm.invoice;

                ad[vm.invoice].push({
                  'entity': codeEntity,
                  'test': val,
                  'copay': value.copay === null || value.copay === undefined ? 0 : value.copay,
                  'order': value.orderNumber
                });

                af[vm.invoice].push({
                  'data': {
                    'codeEntity': codeEntity,
                    'entity': entity,
                    'entityIdentificationType': entityIdentificationType,
                    'identification': identification,
                    'clientCode': value.clientCode,
                    'clientName': value.clientName
                  },
                  'test': val,
                  'copay': value.copay,
                  'order': value.orderNumber
                });
              }

              var cups = val.hasOwnProperty('cups') ? val.cups : val.code;

              var priceParticular = 0;
              var priceAccount = 0;
              var price = 0;

              if (val.hasOwnProperty('priceParticular')) {
                priceParticular = val.priceParticular;
              }

              if (val.hasOwnProperty('priceAccount')) {
                priceAccount = val.priceAccount;
              }

              switch (vm.filterprices) {
                case '0':
                  price = priceParticular + priceAccount;
                  break;
                case '1':
                  price = priceAccount;
                  break;
                case '2':
                  price = priceParticular;
                  break;
                default:
                  price = 0;
                  break;
              }

              //Archivo de procedimientos
              vm.ap += invoice + "," + codeEntity + "," + identificationType + ',' + value.patientId + "," + moment(value.createdDate).format('DD/MM/YYYY') + ","
              + authorization + "," + cups + "," + ambit + "," + purpose + "," + diagnosis + ",,,,," + price + "\r\n";

            });

            //Archivo de usuarios de los servicios de salud
            if (vm.rangeType === 1) {
              vm.rangeInit = vm.rangeInit.substring(0, 8);
              vm.rangeEnd = vm.rangeEnd.substring(0, 8);
            }

            var names = value.name1.trim().split(" ");
            var names2 = value.name1.trim().split(" ").length > 1 ? value.name1.trim().substring(value.name1.trim().indexOf(' ') + 1) : "";

            var lastnames = value.lastName.trim().split(" ");
            var lastnames2 = value.lastName.trim().split(" ").length > 1 ? value.lastName.trim().substring(value.lastName.trim().indexOf(' ') + 1) : "";

            var name1 = names[0];
            var name2 =  names2 + (value.name2 !== undefined && value.name2 !== null ? value.name2 + "," : ",");
            var lastname = lastnames[0];
            var surname = lastnames2 + (value.surName !== undefined && value.surName !== null ? value.surName + "," : ",");

            var birthday = common.getAgeAsString(moment(value.birthday).format(vm.formatDateAge), vm.formatDateAge);
            birthday = birthday.split(" ");
            if (birthday[1] === $filter('translate')('0428') || birthday[1] === $filter('translate')('0103')) {
              var type = 1;
            }
            if (birthday[1] === $filter('translate')('0567') || birthday[1] === $filter('translate')('0569')) {
              var type = 2;
            }
            if (birthday[1] === $filter('translate')('0568') || birthday[1] === $filter('translate')('0476')) {
              var type = 3;
            }
            if (($filter('translate')('0000')) === 'esCo') {
              var sexname = value.sex.esCo.charAt(0);
            }
            else {
              var sexname = value.sex.enUsa.charAt(0);
            }

            vm.us += identificationType + ',' + value.patientId + "," + value.clientCode + "," + membership + "," + lastname + ","
              + surname + name1 + ","
              + name2 + birthday[0] + "," + type + "," + sexname + ","
              + department + "," + township + "," + residence + "\r\n";
          });

          Object.keys(ad).forEach(function (val) {
            var entities = _.groupBy(ad[val], 'entity');
            for (var clave in entities) {

              var totalParticular = _.sumBy(entities[clave], function (o) { return o.test.priceParticular; });
              var totalAccount = _.sumBy(entities[clave], function (o) { return o.test.priceAccount; });
              var total = 0;

              var copayment = _.groupBy(entities[clave], 'order');
              var totalCopayment = 0;
              for(var cop in copayment){
                totalCopayment += copayment[cop][0].copay
              }
              totalCopayment = isNaN(totalCopayment) ? 0 : totalCopayment;

              switch (vm.filterprices) {
                case '0':
                  total = totalParticular + totalAccount;
                  break;
                case '1':
                  total = totalAccount;
                  break;
                case '2':
                  total = totalParticular
                  break;
                default:
                  total = 0;
                  break;
              }

              vm.ad += val + "," + clave + "," + vm.conceptCode.id + "," + entities[clave].length + ",0," + (total - totalCopayment) + "\r\n";
            }
          });

          Object.keys(af).forEach(function (value) {
            var entities = _.groupBy(af[value], 'data.codeEntity');
            for (var clave in entities) {
              var copayment = _.groupBy(entities[clave], 'order');
              var totalCopayment = 0;
              for(var cop in copayment){
                totalCopayment += copayment[cop][0].copay
              }
              totalCopayment = isNaN(totalCopayment) ? 0 : totalCopayment;

              var totalParticular = _.sumBy(entities[clave], function (o) { return o.test.priceParticular; });
              var totalAccount = _.sumBy(entities[clave], function (o) { return o.test.priceAccount; });
              var total = 0;

              switch (vm.filterprices) {
                case '0':
                  total = totalParticular + totalAccount;
                  break;
                case '1':
                  total = totalAccount;
                  break;
                case '2':
                  total = totalParticular
                  break;
                default:
                  total = 0;
                  break;
              }

              vm.af += clave + "," + entities[clave][0].data.entity + "," + entities[clave][0].data.entityIdentificationType + "," + entities[clave][0].data.identification
                + "," + value + "," + moment(vm.billDate).format('DD/MM/YYYY') + "," + moment(vm.rangeInit).format('DD/MM/YYYY') + "," + moment(vm.rangeEnd).format('DD/MM/YYYY')
                + "," + entities[clave][0].data.clientCode + "," + entities[clave][0].data.clientName
                + ",,,," + totalCopayment + ",0,0," + (total - totalCopayment) + "\r\n";
            }
          });
          vm.loadFiles();
        } else {
          vm.report = false;
          logger.success($filter('translate')('0392'));
        }
        vm.loading = false;
        vm.report = false;
      },
        function (error) {
          vm.report = false;
          vm.modalError(error);
        });
    }
    function loadFiles() {
      var zip = new JSZip();
      var files = [vm.ap, vm.ad, vm.af, vm.us];
      files.forEach(function (value, key) {
        var filename = key === 0 ? "AP" : key === 1 ? "AD" : key === 2 ? "AF" : key === 3 ? "US" : '';
        filename += vm.remission;
        //Archivo de control
        if (value) {
          vm.ct += vm.codeEntity.value + "," + moment().format('DD/MM/YYYY').toString() + "," + filename + "," + (value.split("\n").length - 1) + "\r\n";
        }
      });
      files.push(vm.ct);
      files.forEach(function (value, key) {
        var filename = key === 0 ? "AP" : key === 1 ? "AD" : key === 2 ? "AF" : key === 3 ? "US" : key === 4 ? "CT" : '';
        filename += vm.remission + '.txt';
        zip.file(filename, value);
      });

      var content = zip.generate({ type: "blob" });
      var e = document.createEvent('MouseEvents');
      var a = document.createElement('a');
      a.download = "RIPS.zip";
      a.href = window.URL.createObjectURL(content);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      vm.report = false;

    }

    function getConfiguration() {
      return ripsDS.getconfiguration(vm.auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.codeEntity = _.filter(data.data, function (o) { return o.key === 'CodigoEntidad' })[0];
          vm.configurationRips = _.filter(data.data, function (o) { return o.type === 0; });
        } else {
          logger.success($filter('translate')('0392'));
        }
        vm.loading = false;
      },
        function (error) {
          vm.modalError(error);
        });
    }

    function init() {
      vm.concept = [
        {
          'id': '01',
          'name': 'Consultas'
        },
        {
          'id': '02',
          'name': 'Procedimientos de diagnósticos'
        },
        {
          'id': '03',
          'name': 'Procedimientos terapéuticos no quirúrgicos'
        },
        {
          'id': '04',
          'name': 'Procedimientos terapéuticos quirúrgicos'
        },
        {
          'id': '05',
          'name': 'Procedimientos de promoción y prevención'
        },
        {
          'id': '06',
          'name': 'Estancias'
        },
        {
          'id': '07',
          'name': 'Honorarios'
        },
        {
          'id': '08',
          'name': 'Derechos de sala'
        },
        {
          'id': '09',
          'name': 'Materiales e insumos'
        },
        {
          'id': '10',
          'name': 'Banco de sangre'
        },
        {
          'id': '11',
          'name': 'Prótesis y órtesis'
        },
        {
          'id': '12',
          'name': 'Medicamentos POS'
        },
        {
          'id': '13',
          'name': 'Medicamentos no POS'
        },
        {
          'id': '14',
          'name': 'Traslado de pacientes'
        }
      ]
      vm.getConfiguration();
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    vm.isAuthenticate();
  }

})();
/* jshint ignore:end */
