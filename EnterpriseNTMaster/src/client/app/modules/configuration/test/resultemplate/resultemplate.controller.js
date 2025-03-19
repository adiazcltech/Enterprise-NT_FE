(function () {
  'use strict';

  angular
    .module('app.resultemplate')
    .controller('ResultTemplateController', ResultTemplateController)
    .controller('RequeridtestController', RequeridtestController)
    .controller('deletetemplateController', deletetemplateController)
    .controller('accordionController', accordionController)
    .controller('deleteresultController', deleteresultController)
    .controller('validationresulttemplateController', validationresulttemplateController);

  ResultTemplateController.$inject = ['areaDS', 'testDS', 'resultemplateDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state',
    'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function ResultTemplateController(areaDS, testDS, resultemplateDS, configurationDS,
    localStorageService, logger, $filter, $state,
    moment, $rootScope, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'ResultTemplate';
    vm.code = ['code', 'abbr', 'name'];
    vm.abbr = ['abbr', 'code', 'name'];
    vm.nametest = ['name', 'code', 'abbr'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledState = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getArea = getArea;
    vm.changearea = changearea;
    vm.removearea = removearea;
    vm.getTest = getTest;
    vm.getTestchange = getTestchange;
    vm.New = New;
    vm.destroy = destroy;
    vm.OrdenarPorId = OrdenarPorId;
    vm.Newresult = Newresult;
    vm.listTest = [];
    vm.deleteaccordion = [];
    vm.removeDataid = removeDataid;
    vm.erroroption = false;
    vm.erroresult = true;
    vm.validTest = validTest;
    vm.OrderPortrue = OrderPortrue;
    vm.hidecolum = hidecolum;
    vm.hidecontrols = hidecontrols;
    vm.resultreport = '';
    vm.updateacoordion = updateacoordion;
    vm.openaccordionff = openaccordionff;
    vm.getIdupdate = getIdupdate;
    vm.deleteresult = deleteresult;
    vm.changeresult = changeresult;
    vm.result = 0;
    vm.updateacoordionNew = updateacoordionNew;
    vm.getclone = getclone;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.validorder=validorder;
    vm.validsave=validsave;
    vm.orderlits=orderlits;
    vm.vieworder=false;   
    
    vm.sortableOptions = {
      items: ".selectable",
      cancel: ".not-sortable"         
    }

    function validorder() {
      var validexam=vm.listTest.length===0 ? false:vm.listTest[vm.listTest.length-1].option===''?true:false;
      if(vm.selected===-1 || vm.listTest.length===0 || validexam || vm.vieworder){
        return true;
      }else{
        return false;
      }
    }

    function validsave() {
      if(vm.vieworder){
        return false;
      }else{
        if(vm.isDisabledSave && vm.comment ===''){
          return true
        }else{
          return false;
        }        
      }
    }

    function orderlits() {
      vm.vieworder=true;
    }

    //* Metodo para validar la vista del control de eliminación**//
    function hidecontrols(id, idoption) {
      for (var i = 0; i < vm.listTest[id].results.length; i++) {
        vm.listTest[id].results[i].hideacontrols = false;
      }
      vm.listTest[id].results[idoption].hideacontrols = true;

      if (vm.listTest[id].results.length !== 1) {
        for (var j = 0; j < vm.listTest[id].results.length; j++) {
          if ((vm.listTest[id].results[j].result === '' || vm.listTest[id].results[j].result === undefined) && vm.listTest[id].results[j] !== idoption && vm.listTest[id].results[j].hideacontrols === false) {

            vm.listTest[id].results.splice(j, 1);
          }
        }
      }
    }
    //* Metodo para validar el cambio de resultado**//
    function changeresult(outerIndex, $index) {
      if (vm.listTest[outerIndex].results.length > 1) {
        if (vm.listTest[outerIndex].results[$index].result === '' || vm.listTest[outerIndex].results[$index].result === undefined) {
          ModalService.showModal({
            templateUrl: 'deleteresult.html',
            controller: 'deleteresultController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'Yes') {
                vm.listTest[outerIndex].results.splice($index, 1);
              }
              if (result === 'No') {
                vm.getIdupdate(vm.cancelarautomatic, vm.selected);
              }
            });
          });
        }
      }
    }
    //* Metodo para validar el tipo de examen**//
    function validTest(id, idoption) {
      if (vm.listTest[idoption].results[id].reference === true) {
        for (var i = 0; i < vm.listTest[idoption].results.length; i++) {
          vm.listTest[idoption].results[i].reference = false;
        }
        vm.listTest[idoption].results[id].reference = true;
      }
    }
    //* Metodo para la confirmación de la eliminación**//
    function destroy(uno) {
      vm.erroroption = false;
      vm.erroresult = false;
      if (vm.listTest[vm.updateaccordion].results.length > 0 && vm.listTest[vm.updateaccordion].option != '' && vm.listTest[vm.updateaccordion].option != undefined && vm.listTest[vm.updateaccordion].results[0].result !== undefined && vm.listTest[vm.updateaccordion].results[0].result !== '') {
        vm.updateaccordion = uno;
        vm.openaccordionff();
        ModalService.showModal({
          templateUrl: 'delete.html',
          controller: 'deletetemplateController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              if (vm.listTest.length < 0 && uno !== 0) {
                vm.updateaccordion = uno - 1;
                vm.openaccordionff();
                vm.listTest.splice(uno, 1);
              } else {
                vm.updateaccordion = 0;
                vm.openaccordionff();
                vm.listTest.splice(uno, 1);
              }
              vm.update();
            }
            if (result === 'No') {
              vm.openaccordionff();
            }
          });
        });
      } else {
        vm.erroroption = true;
        vm.erroresult = true;

      }
    }
    //* Metodo que válida la eliminación de resultado**//
    function deleteresult(outerIndex, $index) {
      if (vm.listTest[outerIndex].results.length === 1) {
        ModalService.showModal({
          templateUrl: 'validationresult.html',
          controller: 'validationresulttemplateController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {});
        });

      } else {

        ModalService.showModal({
          templateUrl: 'deleteresult.html',
          controller: 'deleteresultController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'Yes') {
              vm.listTest[outerIndex].results.splice($index, 1);
            }
            if (result === 'No') {
              vm.getIdupdate(vm.cancelarautomatic, vm.selected);
            }
          });
        });
      }
    }
    //* Metodo que válida el cambio de area**//
    function changearea() {
      vm.loadingdata = true;
      vm.listest = [];
      vm.selected = -1;
      vm.Detail = [];
      vm.listTest = [];
      vm.isDisabled = true;
      vm.isDisabledAdd = true;
      vm.isDisabledEdit = true;
      vm.isDisabledSave = true;
      vm.isDisabledCancel = true;
      vm.isDisabledPrint = true;
      vm.getTestchange();
    }
    //* Metodo para calidar un nuevo resultado**//
    function Newresult(id) {
      vm.erroresult = false;
      var result = vm.listTest[id].results.length - 1;
      if (vm.listTest[id].results[result].result === '' || vm.listTest[id].results[result].result === undefined) {
        vm.erroresult = true;
      }
      if (vm.erroresult === false) {
        for (var i = 0; i < vm.listTest[id].results.length; i++) {
          vm.listTest[id].results[i].hideacontrols = false;
        }
        var object = {
          'result': '',
          'reference': '',
          'hideacontrols': true
        };
        var record = angular.copy(object);
        vm.listTest[id].results.push(record);
      }

    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(template) {
      vm.erroroption = false;
      vm.erroresult = false;
      if (vm.listTest.length === 0) {
        var object = {
          'id': '',
          'hideacordion': false,
          'idTest': vm.test1,
          'pruebaname': vm.name,
          'option': '',
          'comment': '',
          'results': [{
            'result': '',
            'reference': '',
            'hideacontrols': true
          }]
        };
        var record = angular.copy(object);
        vm.updateaccordion = vm.listTest.length;
        vm.openaccordionff();
        if (vm.listTest.length === 0) {
          record.id = vm.listTest.length;
        } else {
          vm.listTest.sort(vm.OrdenarPorId);
          var a = vm.listTest.length - 1;
          record.id = vm.listTest[a].id + 1;
        }
        vm.listTest.push(record);
        vm.isDisabledCancel = false;
      } else {
        if (vm.listTest[template].option === '' || vm.listTest[template].option === undefined) {
          vm.erroroption = true;
        }
        if (vm.listTest[template].results[0].result === '' || vm.listTest[template].results[0].result === undefined) {
          vm.erroresult = true;
        }
        if (vm.erroroption === false && vm.erroresult === false) {
          var comparate = angular.equals(vm.listTest[vm.updateaccordion], vm.clone[vm.updateaccordion]);
          if (comparate) {
            var object = {
              'id': '',
              'hideacordion': false,
              'idTest': vm.test1,
              'pruebaname': vm.name,
              'option': '',
              'comment': '',
              'results': [{
                'result': '',
                'reference': '',
                'hideacontrols': true
              }]
            };
            var record = angular.copy(object);
            vm.updateaccordion = vm.listTest.length;
            vm.openaccordionff();
            if (vm.listTest.length === 0) {
              record.id = vm.listTest.length;
            } else {
              vm.listTest.sort(vm.OrdenarPorId);
              var a = vm.listTest.length - 1;
              record.id = vm.listTest[a].id + 1;

            }
            vm.listTest.push(record);

          } else {
            if (vm.listTest[vm.updateaccordion].results.length > 1) {

              for (var i = 0; i < vm.listTest.length; i++) {
                if (vm.listTest[i].results.length !== 1) {
                  for (var j = 0; j < vm.listTest[i].results.length; j++) {
                    if (vm.listTest[i].results[j].result === '' || vm.listTest[i].results[j].result === undefined) {
                      vm.listTest[i].results.splice(j, 1)
                    }
                  }
                }
              }
            }
            ModalService.showModal({
              templateUrl: 'saveacordion.html',
              controller: 'accordionController',
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === 'Yes') {
                  var auth = localStorageService.get('Enterprise_NT.authorizationData');   
                  var resulttemplatesave={
                    "comment": vm.comment,
                    "optionTemplates":vm.listTest,
                  }               
                  return resultemplateDS.Newresultemplate(auth.authToken, resulttemplatesave).then(function (data) {
                    var object = {
                      'id': '',
                      'hideacordion': false,
                      'idTest': vm.test1,
                      'pruebaname': vm.name,
                      'option': '',
                      'comment': '',
                      'results': [{
                        'result': '',
                        'reference': '',
                        'hideacontrols': true
                      }]
                    };
                    var record = angular.copy(object);
                    vm.updateaccordion = vm.listTest.length;
                    vm.openaccordionff();
                    if (vm.listTest.length === 0) {
                      record.id = vm.listTest.length;
                    } else {
                      vm.listTest.sort(vm.OrdenarPorId);
                      var a = vm.listTest.length - 1;
                      record.id = vm.listTest[a].id + 1;

                    }
                    vm.listTest.push(record);
                    logger.success($filter('translate')('0042'));



                  }, function (error) {
                    vm.modalError(error);

                  });
                }
                if (result === 'No') {
                  var auth = localStorageService.get('Enterprise_NT.authorizationData');
                  return resultemplateDS.getresultemplateId(auth.authToken, vm.test1).then(function (data) {
                    vm.usuario = $filter('translate')('0017') + ' ';
                    vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
                    vm.usuario = vm.usuario + vm.name;
                    vm.listTest = data.data.length === 0 ? [] : removeDataid(data);


                    var object = {
                      'id': '',
                      'hideacordion': false,
                      'idTest': vm.test1,
                      'pruebaname': vm.name,
                      'option': '',
                      'comment': '',
                      'results': [{
                        'result': '',
                        'reference': '',
                        'hideacontrols': true
                      }]
                    };

                    var record = angular.copy(object);
                    vm.updateaccordion = vm.listTest.length;
                    vm.openaccordionff();
                    if (vm.listTest.length === 0) {
                      record.id = vm.listTest.length;
                    } else {
                      vm.listTest.sort(vm.OrdenarPorId);

                    }
                    vm.listTest.push(record);
                    vm.openaccordionff();
                    vm.stateButton('update');
                    return vm.listTest;

                  }, function (error) {
                    vm.modalError(error);
                  });

                }
              });
            });
          }

        }

      }
    }
    //* Metodo para ordenar por id**//
    function OrdenarPorId(x, y) {
      return x.id - y.id;
    }
    //** Metodo para obtener la lista de examen segun el area**//
    function getTestchange() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, vm.lisArea.id).then(function (data) {
        if (data.status === 200) {
          vm.listest = data.data.length === 0 ? data.data : removeData(data);
          vm.isDisabledPrint = true;
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      vm.vieworder=false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data[0] = {
            "id": 0,
            "name": $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
           if(vm.lisArea.length!==0){
             vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
           }
        
          vm.lisArea.id = 0;
          vm.getTestchange();

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }

      });
      return area;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.area;
        delete value.state;
        delete value.testType;
        delete value.printOrder;
        delete value.processingBy;
        delete value.resultType;
        delete value.conversionFactor;
        data.data[key].username = auth.userName;
      });
      return data.data;
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
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getTest();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.vieworder=false;
      vm.erroroption = false;
      vm.erroresult = false;
      vm.getId(vm.cancelarautomatic, vm.selected);
      vm.stateButton('update');
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(automatic, index) {
      vm.vieworder=false;
      vm.name = automatic.name;
      vm.selected = automatic.id;
      vm.test1 = automatic.id;
      vm.deleteaccordion = [];
      vm.cancelarautomatic = automatic;
      vm.listTest = [];
      vm.erroroption = false;
      vm.erroresult = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return resultemplateDS.getresultemplateId(auth.authToken, vm.test1).then(function (data) {
        vm.usuario = $filter('translate')('0017') + ' ';
        vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
        vm.usuario = vm.usuario + automatic.username;
        vm.comment=data.data.comment;
        vm.listTest = data.data.optionTemplates.length === 0 ? [] : removeDataid(data);
        if(vm.listTest.length!==0){
            vm.listTest =$filter('orderBy')(vm.listTest, 'sort');
        }       
        vm.updateaccordion = vm.listTest.length - 1;
        vm.getclone();
        vm.openaccordionff();
        vm.stateButton('update');
        vm.loadingdata = false;
        return vm.listTest;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id **//
    function getclone() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return resultemplateDS.getresultemplateId(auth.authToken, vm.test1).then(function (data) {
        vm.clone = data.data.length === 0 ? [] : removeDataid(data);
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice guarda**//
    function getIdupdate(automatic, index) {
      vm.vieworder=false;
      vm.name = automatic.name;
      vm.selected = index;
      vm.test1 = automatic.id;
      vm.deleteaccordion = [];
      vm.cancelarautomatic = automatic;
      vm.listTest = [];
      vm.erroroption = false;
      vm.erroresult = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return resultemplateDS.getresultemplateId(auth.authToken, vm.test1).then(function (data) {
        vm.usuario = $filter('translate')('0017') + ' ';
        vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
        vm.usuario = vm.usuario + automatic.username;
        vm.listTest = data.data.length === 0 ? [] : removeDataid(data);
        vm.getclone();
        vm.openaccordionff();
        vm.stateButton('update');
        vm.loadingdata = false;
        return vm.listTest;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para validar el abrir los acordiones**//
    function openaccordionff() {
      vm.status = {};
      vm.status['isOpen'] = {};
      for (var i = 0; i <= vm.listTest.length; i++) {
        var num = i.toString();

        if (i === vm.updateaccordion) {
          vm.status['isOpen'][num] = true;

        } else {
          vm.status['isOpen'][num] = false;
        }
      }
    }
    //** Método para ordenar por true**//
    function OrderPortrue(x, y) {
      return y.reference - x.reference;
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataid(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.optionTemplates.forEach(function (value, key) {
        value.hideacordion = false;
        value.disabledaccordion = true;
        value.username = auth.userName;
        value.results.sort(vm.OrderPortrue);
        vm.hidecolum(data.data.optionTemplates[key].results);
        value.resultreport = vm.resultreport;
      });
      return data.data.optionTemplates;
    }
    //** Metodo que válida la ación de un resultado**//
    function hidecolum(data) {
      vm.resultreport = '';
      data.forEach(function (value, key) {
        data[key].hideacontrols = false;
        if (key === 0) {
          vm.resultreport = String(data[key].result);
        } else {
          vm.resultreport = vm.resultreport + "<br>" + String(data[key].result);
        }
      });
      return vm.resultreport;
    }
    //** Método que válida el guardado en un accordión**//
    function updateacoordion(id) {
      if (vm.listTest[vm.updateaccordion].results.length > 0 && vm.listTest[vm.updateaccordion].option != '' && vm.listTest[vm.updateaccordion].option != undefined && vm.listTest[vm.updateaccordion].results[0].result !== undefined && vm.listTest[vm.updateaccordion].results[0].result !== '') {
        vm.isDisabledSave = false;
        if (id !== vm.updateaccordion) {
          var comparate = angular.equals(vm.listTest[vm.updateaccordion], vm.clone[vm.updateaccordion]);
          if (comparate) {
            vm.updateaccordion = id;
            vm.openaccordionff();

          } else {
            vm.updateaccordion = id;
            ModalService.showModal({
              templateUrl: 'saveacordion.html',
              controller: 'accordionController',
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === 'Yes') {
                  vm.update(id);
                }
                if (result === 'No') {
                  vm.getIdupdate(vm.cancelarautomatic, vm.selected);
                }
              });
            });
          }

        }

      } else {
        vm.openaccordionff();
      }
    }
    //** Método que válida el guardado en un nuevo accordión**//
    function updateacoordionNew(id) {
      if (vm.listTest[vm.updateaccordion].results.length > 0 && vm.listTest[vm.updateaccordion].option != '' && vm.listTest[vm.updateaccordion].option != undefined && vm.listTest[vm.updateaccordion].results[0].result !== undefined && vm.listTest[vm.updateaccordion].results[0].result !== '') {
        vm.isDisabledSave = false;
        if (id !== vm.updateaccordion) {
          var comparate = angular.equals(vm.listTest[vm.updateaccordion], vm.clone[vm.updateaccordion]);
          if (comparate) {
            vm.updateaccordion = id;
            vm.openaccordionff();
          } else {
            vm.updateaccordion = id;
            ModalService.showModal({
              templateUrl: 'saveacordion.html',
              controller: 'accordionController',
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === 'Yes') {
                  vm.update();
                }
                if (result === 'No') {
                  var auth = localStorageService.get('Enterprise_NT.authorizationData');
                  return resultemplateDS.getresultemplateId(auth.authToken, vm.test1).then(function (data) {
                    vm.usuario = $filter('translate')('0017') + ' ';
                    vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
                    vm.usuario = vm.usuario + vm.name;
                    vm.listTest = data.data.length === 0 ? [] : removeDataid(data);
                    var object = {
                      'id': '',
                      'hideacordion': false,
                      'idTest': vm.test1,
                      'pruebaname': vm.name,
                      'option': '',
                      'comment': '',
                      'results': [{
                        'result': '',
                        'reference': '',
                        'hideacontrols': true
                      }]
                    };
                    var record = angular.copy(object);
                    vm.updateaccordion = vm.listTest.length;
                    vm.openaccordionff();
                    if (vm.listTest.length === 0) {
                      record.id = vm.listTest.length;
                    } else {
                      vm.listTest.sort(vm.OrdenarPorId);

                    }
                    vm.listTest.push(record);
                    vm.openaccordionff();
                    vm.stateButton('update');
                    return vm.listTest;
                  }, function (error) {
                    vm.modalError(error);
                  });

                }
              });
            });
          }
        }

      } else {
        vm.openaccordionff();
      }
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.vieworder=false;
      vm.erroroption = false;
      vm.erroresult = false;
      vm.saveerror = false;
      if (vm.listTest.length === 0) {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');                     
        return resultemplateDS.deleteresultemplate(auth.authToken, vm.test1).then(function (data) {
          if (data.status === 200) {
            vm.getTestchange();
            vm.getIdupdate(vm.cancelarautomatic, vm.selected);
            logger.success($filter('translate')('0042'));
            vm.stateButton('update');
            return data;
          }
        }, function (error) {
          vm.modalError(error);

        });
      } else {
        var variable = vm.updateaccordion - 1;
        if (vm.listTest[vm.updateaccordion].option === '' || vm.listTest[vm.updateaccordion].option === undefined) {
          vm.erroroption = true;
        }

        if (vm.listTest[vm.updateaccordion].results[0].result === '' || vm.listTest[vm.updateaccordion].results[0].result === undefined) {
          vm.erroresult = true;
        }


        if (vm.erroroption === false && vm.erroresult === false) {
          if (vm.listTest[vm.updateaccordion].results.length > 1) {

            for (var i = 0; i < vm.listTest.length; i++) {
              if (vm.listTest[i].results.length !== 1) {
                for (var j = 0; j < vm.listTest[i].results.length; j++) {
                  if (vm.listTest[i].results[j].result === '' || vm.listTest[i].results[j].result === undefined) {
                    vm.listTest[i].results.splice(j, 1)
                  }
                }
              }
            }
          }
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
         // vm.listTest =$filter('orderBy')(vm.listTest, 'sort');
          var resulttemplatesave={
            "comment": vm.comment,
            "optionTemplates":vm.listTest,
          }
          return resultemplateDS.Newresultemplate(auth.authToken,resulttemplatesave).then(function (data) {
            if (data.status === 200) {
              vm.getTestchange();
              vm.getIdupdate(vm.cancelarautomatic, vm.selected);
              logger.success($filter('translate')('0042'));
              vm.stateButton('update');
              return data;
            }
          }, function (error) {
            vm.modalError(error);

          });
        }
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método preparar el JSON para ver reporte**//
    function generateFile() {
      if (vm.listTest.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'name': vm.name
        };
        vm.datareport = vm.listTest;
        vm.pathreport = '/report/configuration/test/resultemplate/resultemplate.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //* Metodo para el popup de requerido**//
    function getTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestTypeResult(auth.authToken, 2, 1, 0, 0).then(function (data) {
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'RequeridtestController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'test') {
                $state.go(result);
              }
            });
          });

        } else {
          vm.getArea();
        }
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
          vm.errorservice = vm.errorservice + 1;
        }
      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();

  }
  //** Controller de la ventana modal de requerido*//
  function RequeridtestController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la ventana modal para la confirmación de la eliminación de la plantilla *//
  function deletetemplateController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la ventana modal para crear una nueva plantilla *//
  function accordionController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la ventana modal para la confirmación de la eliminación del resultado *//
  function deleteresultController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
  //** Controller de la ventana modal para la confirmación de la eliminación de la plantilla *//
  function validationresulttemplateController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
