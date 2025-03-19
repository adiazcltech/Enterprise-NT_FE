/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal     abrir ventana modal para el desechoo de la muestra


  AUTOR:        Angelica Maria diaz garcia
  FECHA:        2018-08-08
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('rackdisposalcertificates', rackdisposalcertificates);

  rackdisposalcertificates.$inject = ['$filter', 'localStorageService', 'logger', 'disponsalcertificatesDS', 'rackDS',
    'LZString', '$translate'];

  /* @ngInject */
  function rackdisposalcertificates($filter, localStorageService, logger, disponsalcertificatesDS, rackDS,
    LZString, $translate) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/userControl/rack-disposalcertificates.html',
      scope: {
        openmodal: '=openmodal',
        functionexecute: '=functionexecute',
      },

      controller: ['$scope', function ($scope) {
        var vm = this;

        vm.typefilter = '1';
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ' h:mm a';
        vm.listracktodiscard = [];

        vm.closemodalwarnings = closemodalwarnings;
        vm.getdisponsalcertificates = getdisponsalcertificates;
        vm.adddisponsalcertificates = adddisponsalcertificates;
        vm.insertdisponsalcertificates = insertdisponsalcertificates;
        vm.getdetaildisposalcertificate = getdetaildisposalcertificate;
        vm.getracktodiscard = getracktodiscard;
        vm.changetypefilter = changetypefilter;
        vm.modalError = modalError;
        vm.validOrderSample = validOrderSample;
        vm.insertsampledisposalcertificates = insertsampledisposalcertificates;
        vm.insertrackdisposalcertificates = insertrackdisposalcertificates;
        vm.closedisposalcertificates = closedisposalcertificates;
        vm.printReport = printReport;
        vm.removeRacks = removeRacks;


        vm.listdisposalcertificates = [{ 'id': 0 }];
        vm.view = 1;
        vm.selected = null;
        vm.order = '';
        vm.sample = '';
        vm.tabactive = 1;
        vm.statedisposalcertificate = false;
        vm.repeatname = false;

        vm.alphabelist = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
        vm.numberslist = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.getdisponsalcertificates();
            UIkit.modal("#modaldiscardsample", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
            $scope.openmodal = false;
          }
        });

        function closemodalwarnings() {
          setTimeout(function () {
            $scope.functionexecute();
          }, 1000);
          UIkit.modal('#modaldiscardsample').hide();
        }

        function changetypefilter(type) {
          vm.selected = null;
          if (type === 1) {
            vm.listdisposalcertificates = vm.listdisposalcertificatesfilter;
          }
          else if (type === 2) {
            vm.listdisposalcertificates = $filter('filter')(vm.listdisposalcertificatesfilter, { closed: false });
          }
          else if (type === 3) {
            vm.listdisposalcertificates = $filter('filter')(vm.listdisposalcertificatesfilter, { closed: true });
          }
        }

        function getdisponsalcertificates(rack) {
          vm.loading = true;
          vm.tabactive = 1;
          vm.view = 1;
          vm.selected = rack === undefined ? null : rack;
          vm.order = '';
          vm.sample = '';
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return disponsalcertificatesDS.getdisposalcertificates(auth.authToken).then(function (data) {
            if (data.status === 200) {
              vm.listdisposalcertificatesfilter = data.data;
              vm.listdisposalcertificates = data.data;
              vm.typefilter = '1';
            }
            vm.loading = false;
          });
        }

        function adddisponsalcertificates() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.detaildisponsal = {
            'id': 0,
            'description': '',
            'name': '',
            'closed': false,
            'creationUser': {
              'id': auth.id
            },
            'type': 1
          };
        }

        function insertdisponsalcertificates() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return disponsalcertificatesDS.insertdisposalcertificates(auth.authToken, vm.detaildisponsal).then(function (data) {
            if (data.status === 200) {
              vm.repeatname = false;
              logger.success($filter('translate')('0149'));
              vm.getdisponsalcertificates();
              UIkit.modal('#modaladddisponsalcertificates').hide();
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        function modalError(error) {
          if (error.data === undefined) {
            vm.Error = error;
            vm.ShowPopupError = true;
          }
          else if (error.data !== null) {
            if (error.data.code === 2) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split('|');
                if (item[0] === '1' && item[1] === 'name') {
                  vm.repeatname = true;
                }
              });
            }
          }


        }

        function getdetaildisposalcertificate(id, state) {
          vm.selected = id;
          vm.view = 1;
          vm.order = '';
          vm.sample = '';
          vm.statedisposalcertificate = state;
          vm.tabactive = 1;
          vm.listdetaildisposalcertificates = [{ 'id': 0 }];

          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return disponsalcertificatesDS.getdetaildisposalcertificates(auth.authToken, id).then(function (data) {
            if (data.status === 200) {
              if (data.data.positions === undefined) {
                vm.listdetaildisposalcertificates = [];
              }
              else {
                data.data.positions.forEach(function (element) {
                  if(element.position !== "") {
                    element.updateDate = moment(element.updateDate).format(vm.formatDate);
                    element.updateUser = element.updateUser.userName;
                    element.positioncalculate = element.position;
                  }
                });

                vm.datareport = data.data;
                vm.datareport.disposalUser = vm.datareport.disposalUser === undefined ? null : vm.datareport.disposalUser;
                vm.datareport.disposalDate = vm.datareport.disposalDate === undefined ? null : moment(vm.datareport.disposaldate).format(vm.formatDate);
                vm.listdetaildisposalcertificates = data.data.positions === undefined ? [] : data.data.positions;
              }
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        function getracktodiscard() {
          vm.view = 2;
          vm.order = '';
          vm.sample = '';
          vm.listracktodiscard = [];
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return rackDS.getracktodiscard(auth.authToken).then(function (data) {
            if (data.status === 200) {
              vm.listracktodiscard = data.data;
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        function validOrderSample() {
          if (vm.sample !== '') {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return rackDS.getracksbyordersample(auth.authToken, vm.order, vm.sample).then(function (data) {
              if (data.status === 200) {
                vm.listracksample = $filter('filter')(data.data, { insert: true });

                vm.listracksample = vm.listracksample.filter(function (x) {
                  return x.certificate === undefined;
                });

                if (vm.listracksample.length > 1) {

                  vm.listracksample.forEach(function (element) {

                    element.positioncalculate =  element.position;
                    element.name = element.rack.id + ' ' + element.rack.name;
                    element.rack.typename = element.rack.type === 1 ? $filter('translate')('0078') : element.rack.type === 2 ? $filter('translate')('0413') : $filter('translate')('0783');
                    element.registDate = moment(element.registDate).format(vm.formatDate);
                    element.rack.isOpenText = element.rack.state === 1 ? $filter('translate')('0699') : $filter('translate')('0698');
                  });

                  UIkit.modal('#modallistsamplerack', { modal: false }).show();
                }
                else if (vm.listracksample.length === 1) {
                  // vm.getdetailrack(vm.listracksample[0])
                  vm.insertsampledisposalcertificates(vm.listracksample[0]);
                }
                else {
                  vm.textcenter = false;
                  vm.messageinformativegeneral = $filter('translate')('0078') + ': <br/><br/> 1.' + $filter('translate')('0810') + '<br/> 2.' + $filter('translate')('0811') + '<br/> 3.' + $filter('translate')('0812');
                  UIkit.modal('#modalinformativedisponsalcertificates', { modal: false }).show();
                }
              }
              else {
                vm.textcenter = true;
                vm.messageinformativegeneral = $filter('translate')('0813');
                UIkit.modal('#modalinformativedisponsalcertificates', { modal: false }).show();
              }
            }, function (error) {
              vm.modalError(error);
            });
          }
        }



        function insertsampledisposalcertificates(rack) {
          var disponsalcertificate = {
            'id': vm.selected,
            'position': {
              'position': rack.position,
              'rack': {
                'id': rack.rack.id
              }
            }
          };

          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return disponsalcertificatesDS.insertsampledisposalcertificates(auth.authToken, disponsalcertificate).then(function (data) {
            if (data.status === 200) {
              vm.order = '';
              vm.sample = '';
              vm.textcenter = true;
              vm.messageinformativegeneral = data.data + '  ' + $filter('translate')('0814');
              UIkit.modal('#modallistsamplerack', { modal: false }).hide();
              UIkit.modal('#modalinformativedisponsalcertificates', { modal: false }).show();
            }
          }, function (error) {
            vm.modalError(error);
          });
        }

        function removeRacks(racks) {
          racks.forEach(function (value) {
            var index = _.findIndex(vm.listracktodiscard, function(o) { return o.id === value.id; });
            if(index >= 0) {
              vm.listracktodiscard.splice(index, 1);
            }
          });
        }

        function insertrackdisposalcertificates(rack) {
          vm.loading = true;
          var racks = $filter('filter')(vm.listracktodiscard, { check: true });

          var listracks = [];
          racks.forEach(function (element) {
            listracks.push(element.id);
          });
          var disponsalcertificate = {
            'id': vm.selected,
            'racks': listracks
          };

          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return disponsalcertificatesDS.insertrackdisposalcertificates(auth.authToken, disponsalcertificate).then(function (data) {
            if (data.status === 200) {
              vm.order = '';
              vm.sample = '';
              vm.textcenter = true;
              vm.messageinformativegeneral = data.data + '  ' + $filter('translate')('0814');
              vm.removeRacks(racks);
              UIkit.modal('#modalinformativedisponsalcertificates', { modal: false }).show();
            }
            vm.loading = false;
          }, function (error) {
            vm.loading = false;
            vm.modalError(error);
          });
        }


        function closedisposalcertificates() {
          vm.loading = true;
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var disponsalcertificate = {
            'id': vm.selected,
            'disposalUser': {
              'id': auth.id
            }
          };

          return disponsalcertificatesDS.closedisposalcertificates(auth.authToken, disponsalcertificate).then(function (data) {
            if (data.status === 200) {
              vm.statedisposalcertificate = true;
              vm.getdisponsalcertificates(vm.selected);
              logger.success($filter('translate')('0149'));
            }
            vm.loading = false;
          }, function (error) {
            vm.modalError(error);
            vm.loading = false;
          });
        }

        function printReport() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.variables = {
            'entity': localStorageService.get('Entidad'),
            'abbreviation': localStorageService.get('Abreviatura'),
            'username': auth.userName,
            'date': moment().format(vm.formatDate),
            'separatorsample': localStorageService.get('SeparadorMuestra')
          };

          vm.pathreport = '/Report/tools/disponsalcertificate/disponsalcertificate.mrt';

          var parameterReport = {};
          parameterReport.variables = vm.variables;
          parameterReport.pathreport = vm.pathreport;
          parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
          var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
          localStorageService.set('parameterReport', parameterReport);
          localStorageService.set('dataReport', datareport);
          window.open('/viewreport/viewreport.html');
        }


      }],
      controllerAs: 'rackdisposalcertificates'
    };

    return directive;
  }
})();
/* jshint ignore:end */

