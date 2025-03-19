/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.informedconsent')
    .controller('informedconsentController', informedconsentController);
  informedconsentController.$inject = [
    'localStorageService',
    '$filter',
    '$state',
    '$rootScope',
    'documenttypesDS',
    'integrationconsentDS',
    '$scope',
    'logger',
    'common'
  ];

  function informedconsentController(
    localStorageService,
    $filter,
    $state,
    $rootScope,
    documenttypesDS,
    integrationconsentDS,
    $scope,
    logger,
    common
  ) {
    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    $rootScope.pageview = 3;
    vm.title = 'Informedconsent';
    $rootScope.helpReference = '04.reportsandconsultations/informedconsent.htm';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('1503');
    vm.getListYear = getListYear;
    vm.gettypedocument = gettypedocument;
    vm.changefilter = changefilter;
    vm.typedocument = localStorageService.get('ManejoTipoDocumento');
    vm.keyselectpatientid = keyselectpatientid;
    vm.searchtype = searchtype;
    vm.getseach = getseach;
    vm.treeorderadd = treeorderadd;
    vm.modalError = modalError;
    vm.treepatient = treepatient;
    vm.keyselect = keyselect;
    vm.orderdigit = localStorageService.get('DigitosOrden');
    vm.cantdigit = parseInt(vm.orderdigit) + 4;
    vm.codeorder = '';
    vm.codeordernumberorden = '';
    vm.sendFormData = sendFormData;
    vm.typedocument =
      vm.typedocument === 'True' || vm.typedocument === true ? true : false;
    vm.typeresport = [{
        id: 1,
        name: $filter('translate')('0117'),
      }, //historia
      {
        id: 2,
        name: $filter('translate')('0061'),
      }, // Orden
    ];
    vm.typeresport.id = 1;
    $scope.$on('selection-changed', function (e, node) {
      if (node.parentId !== undefined) {
        vm.numberOrder = node.name;
        vm.listtest = node.testConsentBase64;
      }
    });
    vm.options5 == {
      expandOnClick: true,
      filter: {},
    };
    //** Método para un base 64 en una nueva pestaña en PDF**//
    function sendFormData(base64Image) {
      var objbuilder = '';
      objbuilder +=
        '<object width="100%" height="100%" data="data:application/pdf;base64,';
      objbuilder += base64Image.document;
      objbuilder += '" type="application/pdf" class="internal">';
      objbuilder += '<embed src="data:application/pdf;base64,';
      objbuilder += base64Image.document;
      objbuilder += '" type="application/pdf"  />';
      objbuilder += "</object>";

      var win = window.open('#', '_blank');
      var title = base64Image.code;
      win.document.write(
        '<html><title>' +
        title +
        '</title><body style="margin-top:0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">'
      );
      win.document.write(objbuilder);
      win.document.write('</body></html>');
      layer = jQuery(win.document);
    }
    //** Método para mostrar la ventana modal de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para obtener lista de años**//
    function getListYear() {
      vm.gettypedocument();
      vm.listYear = common.getListYear();
      vm.listYear.id = moment().year();
    }
    //** Método para obtener lista tipo de documento**//
    function gettypedocument() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return documenttypesDS.getstatetrue(auth.authToken).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.documentTypelist = data.data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    //** Método para cuando cambia tipo de busqueda**//
    function changefilter() {
      vm.codeordernumberorden = '';
      vm.basicTree = [];
      vm.listtest = [];
      vm.documentType = [];
      vm.record = '';
    }
    //** Método para validar si los campos requeridos se encuentran llenos para hacer la busqueda**//
    function searchtype() {
      vm.basicTree = [];
      if (vm.typeresport.id === 1) {
        if (vm.record === '') {
          return true;
        } else {
          vm.getseach();
        }
      }
      if (vm.typeresport.id === 2) {
        if (vm.codeordernumberorden === '') {
          return true;
        } else {
          setTimeout(function () {
            angular.element('#numberordersearch').select();
          }, 100);
          vm.getseach();
        }
      }
    }
    //** Método que evalua cuando se digita el enter en la historia**//
    function keyselectpatientid($event) {
      var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
      if (keyCode === 13) {
        vm.searchtype();
      }
    }
    //** Método conmsulta servicio para la busqueda**//
    function getseach() {
      vm.basicTree = [];
      vm.loadingdata = true;
      if (vm.typeresport.id === 1) {
        if (vm.typedocument) {
          vm.documentType.id =
            vm.documentType.id === undefined ? -1 : vm.documentType.id;
        } else {
          vm.documentType.id =
            vm.documentType.id === undefined ? 1 : vm.documentType.id;
        }
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return integrationconsentDS
          .getdocumenttype(auth.authToken, vm.record, vm.documentType.id)
          .then(
            function (data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                var groupdata = _.groupBy(data.data, 'idPatient');
                vm.basicTree =
                  data.data.length === 0 ? [] : vm.treepatient(groupdata);
              } else {
                logger.success($filter('translate')('0392'));
              }
            },
            function (error) {
              vm.loadingdata = false;
              vm.modalError(error);
            }
          );
      }
      if (vm.typeresport.id === 2) {
        var order = vm.listYear.id + vm.codeordernumberorden;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return integrationconsentDS.getorder(auth.authToken, order).then(
          function (data) {
            vm.loadingdata = false;
            if (
              data.status === 200 &&
              data.data.testConsentBase64.length !== 0
            ) {
              vm.basicTree = [{
                name: data.data.names + '' + data.data.subnames,
                image: 'images/user1.png',
                children: [{
                  name: data.data.oder,
                  image: 'images/folder.png',
                  testConsentBase64: data.data.testConsentBase64,
                }, ],
              }, ];
              vm.numberOrder = data.data.oder;
              vm.listtest = data.data.testConsentBase64;
            } else {
              logger.success($filter('translate')('0392'));
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }
    }
    //** Método para tratar el arreglo de busqueda para los hijos del arbol**//
    function treeorderadd(data) {
      var children = [];
      if (data.length === 1) {
        var object = {
          name: data[0].orderNumber,
          image: 'images/folder.png',
        };
        children.push(object);

        return children;
      } else {
        data.forEach(function (value, key) {
          if (value.fatherOrder === 0) {
            var soon = $filter('filter')(
              data, {
                fatherOrder: value.orderNumber,
              },
              true
            );
            if (soon.length === 0) {
              var object = {
                name: value.orderNumber,
                image: 'images/folder.png',
              };
              children.push(object);
            } else {
              var childrensoon = [];
              soon.forEach(function (value, key) {
                var object1 = {
                  name: value.orderNumber,
                  image: 'images/folder-open.png',
                };
                childrensoon.push(object1);
              });

              var object = {
                name: value.orderNumber,
                image: 'images/folder.png',
                children: $filter('orderBy')(childrensoon, 'name'),
              };
              children.push(object);
            }
          }
        });
        return children;
      }
    }
    //** Método para acomodar el arreglo para pintarlo en el arbol**//
    function treepatient(data) {
      var basicTree = [];
      for (var propiedad in data) {
        if (data.hasOwnProperty(propiedad)) {
          var children = [];
          if (data[propiedad].length === 1) {
            var object = {
              name: data[propiedad][0].oder,
              image: 'images/folder.png',
              testConsentBase64: data[propiedad][0].testConsentBase64,
            };
            children.push(object);
            var object1 = {
              name: data[propiedad][0].names + ' ' + data[propiedad][0].subnames,
              image: 'images/user1.png',
              children: children,
            };

            basicTree.push(object1);
          } else {
            data[propiedad].forEach(function (value, key) {
              var object = {
                name: value.oder,
                image: 'images/folder.png',
                testConsentBase64: value.testConsentBase64,
              };
              children.push(object);
            });
            var object1 = {
              name: data[propiedad][0].names + ' ' + data[propiedad][0].subnames,
              image: 'images/user1.png',
              children: $filter('orderBy')(children, 'name'),
            };
            basicTree.push(object1);
          }
        }
      }
      return basicTree;
    }
    //** Método para completar el número de la orden**//
    function keyselect($event) {
      var keyCode =
        $event !== undefined ? $event.which || $event.keyCode : undefined;
      if (keyCode === 13 || keyCode === undefined) {
        if (vm.codeordernumberorden.length < vm.cantdigit) {
          vm.codeordernumberorden =
            vm.codeordernumberorden === '' ? 0 : vm.codeordernumberorden;
          if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 1) {
            vm.numberordensearch =
              vm.listYear.id +
              moment().format('MM') +
              '0' +
              vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 2
          ) {
            vm.numberordensearch =
              vm.listYear.id + moment().format('MM') + vm.codeordernumberorden;
          } else if (
            vm.codeordernumberorden.length ===
            parseInt(vm.orderdigit) + 3
          ) {
            vm.numberordensearch =
              vm.listYear.id + '0' + vm.codeordernumberorden;
          } else {
            vm.numberordensearch =
              vm.listYear.id +
              common
              .getOrderComplete(vm.codeordernumberorden, vm.orderdigit)
              .substring(4);
          }
          vm.codeordernumberorden = vm.numberordensearch.substring(4);
          vm.searchtype();
        } else if (vm.codeordernumberorden.length === vm.cantdigit) {
          vm.numberordensearch = vm.listYear.id + vm.numberorden;
          vm.searchtype();
        }
      } else {
        if (!(keyCode >= 48 && keyCode <= 57)) {
          $event.preventDefault();
        }
      }
    }
    //** Método para validar que el usuario se encuentre autenticado cuando se inicializa la página**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método para inicializar la pagina**/
    function init() {
      vm.codeordernumberorden = '';
      vm.basicTree = [];
      vm.listtest = [];
      vm.documentType = [];
      vm.record = '';
      vm.getListYear();
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
