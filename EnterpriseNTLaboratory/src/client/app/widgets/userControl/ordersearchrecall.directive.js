/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   openmodal @descripción
                listener  @descripción
                order     @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/tuberack/tuberack.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  'use strict';
  angular
    .module('app.widgets')
    .config(function ($mdDateLocaleProvider) {
      var format;
      if (localStorage.getItem('ls.FormatoFecha') !== null) {
        var formatDate = ((localStorage.getItem('ls.FormatoFecha')).toUpperCase()).slice(1, 11);
        if (formatDate === 'DD/MM/YYYY') {
          format = 'DD/MM/YYYY';
        } else if (formatDate === 'DD-MM-YYYY') {
          format = 'DD-MM-YYYY';
        } else if (formatDate === 'DD.MM.YYYY') {
          format = 'DD.MM.YYYY';
        } else if (formatDate === 'MM/DD/YYYY') {
          format = 'MM/DD/YYYY';
        } else if (formatDate === 'MM-DD-YYYY') {
          format = 'MM-DD-YYYY';
        } else if (formatDate === 'MM.DD.YYYY') {
          format = 'MM.DD.YYYY';
        } else if (formatDate === 'YYYY/MM/DD') {
          format = 'YYYY/MM/DD';
        } else if (formatDate === 'YYYY-MM-DD') {
          format = 'YYYY-MM-DD';
        } else if (formatDate === 'YYYY.MM.DD') {
          format = 'YYYY.MM.DD';
        }
      } else {
        format = 'DD/MM/YYYY';
      }

      $mdDateLocaleProvider.formatDate = function (date) {
        return date ? moment(date).format(format) : '';
      };
      $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };

    })
    .directive('ordersearchrecall', ordersearchrecall);
  ordersearchrecall.$inject = ['common', 'orderDS', 'localStorageService', '$filter', 'ordertypeDS'];
  /* @ngInject */
  function ordersearchrecall(common, orderDS, localStorageService, $filter, ordertypeDS) {
    var directive = {
      templateUrl: 'app/widgets/userControl/ordersearchrecall.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        listener: '=listener',
        order: '=order',
        fatherorder: '=fatherorder'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.init = init;
        vm.dateFormat = localStorageService.get('FormatoFecha');
        vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
        vm.searchByOrder = searchByOrder;
        vm.selectOrder = selectOrder;
        vm.searchByPatientId = searchByPatientId;
        vm.searchByPatient = searchByPatient;
        vm.searchByDate = searchByDate;
        vm.orderToSearch = undefined;
        vm.patientDocToSearch = undefined;
        vm.patientIdToSearch = undefined;
        vm.lastNameToSearch = '';
        vm.surNameToSearch = '';
        vm.name1ToSearch = '';
        vm.name2ToSearch = '';
        vm.dateToSearch = moment().format();
        vm.orders = [];
        vm.documentTypes = [];
        vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True';
        vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
        vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';
        vm.eventSelectOrder = eventSelectOrder;
        vm.eventSelectPatientId = eventSelectPatientId;
        vm.eventSelectPatient = eventSelectPatient;
        vm.eventSelectDate = eventSelectDate;
        vm.getCloset = getCloset;
        vm.getordertype = getordertype;
        vm.maxDate = new Date();

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.loading=true;
            vm.viewtable = false;
            vm.orderToSearch = undefined;
            vm.patientIdToSearch = undefined;
            vm.lastNameToSearch = '';
            vm.surNameToSearch = '';
            vm.name1ToSearch = '';
            vm.name2ToSearch = '';
            vm.orders = [];
            vm.dateToSearch = moment().format();          
            vm.viewtable = true;
            vm.getordertype();
          }
          $scope.openmodal = false;
        });

        /**
         * Evento cuando se busca una orden
         */
        function searchByOrder() {
          if (vm.orderToSearch !== undefined && vm.orderToSearch !== '') {
            vm.orderToSearch = Number(common.getOrderComplete(vm.orderToSearch, vm.orderDigits));
            //Obtiene token de autenticación
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            vm.loadingdata=true;
            orderDS.getRecallByOrder(auth.authToken, vm.orderToSearch, auth.branch)
              .then(
                function (data) {
                  vm.loadingdata=false;
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.patient.sextext = ((data.data.patient.sex.code === '1' ? $filter('translate')('0363') : (data.data.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                    data.data.patient.birthdaytext = moment(data.data.patient.birthday).format(vm.dateFormat.toUpperCase());
                    dataOrders.push(data.data);
                    vm.orders = dataOrders;
                  } else {
                    vm.orders = [];
                  }
                  document.getElementById('txt_ordersearchrecall_order').select();
                },
                function (error) {
                    vm.loadingdata=false;
                    vm.Error = error;
                    vm.ShowPopupError = true;                
                });
          } else {            
            document.getElementById('txt_ordersearchrecall_order').focus();
          }
        }

        /**
         * Evento cuando se busca una historia clinica, evalua si tiene configurado el tipo de documento en la aplicacion
         */
        function searchByPatientId() {
          if (vm.patientIdToSearch !== undefined && vm.patientIdToSearch !== '') {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.showDocumentType && vm.patientDocToSearch !== '0') {
              //Busca con tipo de documento
              vm.loadingdata=true;
              orderDS.getRecallByPatientId(auth.authToken, vm.patientIdToSearch, vm.patientDocToSearch, auth.branch)
                .then(
                  function (data) {
                    vm.loadingdata=false;
                    if (data.status === 200) {
                      var dataOrders = [];
                      data.data.forEach(function (element, index) {
                        element.patient.sextext = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                        element.patient.birthdaytext = moment(element.patient.birthday).format(vm.dateFormat.toUpperCase());
                        dataOrders.push(element);
                      });
                      dataOrders = dataOrders.sort(function (a, b) {
                        if (a.order > b.order) {
                          return -1;
                        } else if (a.order < b.order) {
                          return 1;
                        } else {
                          return 0;
                        }
                      });
                      vm.orders = dataOrders;
                    } else {
                      vm.orders = [];
                    }
                    document.getElementById('txt_ordersearchrecall_patient_id').select();
                  },
                  function (error) {
                      vm.Error = error;
                      vm.ShowPopupError = true;
                      vm.loadingdata=false;                   
                  });
            } else {
              //Busca sin tipo de documento
              orderDS.getRecallByPatientId(auth.authToken, vm.patientIdToSearch, -1, auth.branch)
                .then(
                  function (data) {
                    if (data.status === 200) {
                      var dataOrders = [];
                      data.data.forEach(function (element, index) {
                        element.patient.sextext = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                        element.patient.birthdaytext = moment(element.patient.birthday).format(vm.dateFormat.toUpperCase());

                        dataOrders.push(element);
                      });
                      dataOrders = dataOrders.sort(function (a, b) {
                        if (a.order > b.order) {
                          return -1;
                        } else if (a.order < b.order) {
                          return 1;
                        } else {
                          return 0;
                        }
                      });
                      vm.orders = dataOrders;
                    } else {
                      vm.orders = [];
                    }
                    document.getElementById('txt_ordersearchrecall_patient_id').select();
                  },
                  function (error) {
                    if (error.data === null) {
                      vm.errorservice = vm.errorservice + 1;
                      vm.Error = error;
                      vm.ShowPopupError = true;
                    }
                  });
            }
          } else {
            document.getElementById('txt_ordersearchrecall_patient_id').focus();
          }
        }

        /**
         * Evento cuando se busca un paciente por nombre
         */
        function searchByPatient() {
          if (vm.lastNameToSearch.trim() === '' &&
            vm.surNameToSearch.trim() === '' &&
            vm.name1ToSearch.trim() === '' &&
            vm.name2ToSearch.trim() === '') {} else {
              vm.loadingdata=true;
            var lastNameToSearch = vm.lastNameToSearch === '' ? 'undefined' : vm.lastNameToSearch.toUpperCase();
            var surNameToSearch = vm.surNameToSearch === '' ? 'undefined' : vm.surNameToSearch.toUpperCase();
            var name1ToSearch = vm.name1ToSearch === '' ? 'undefined' : vm.name1ToSearch.toUpperCase();
            var name2ToSearch = vm.name2ToSearch === '' ? 'undefined' : vm.name2ToSearch.toUpperCase();

            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            orderDS.getRecallByPatient(auth.authToken, lastNameToSearch, surNameToSearch, name1ToSearch, name2ToSearch, auth.branch)
              .then(
                function (data) {
                  vm.loadingdata=false;
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.forEach(function (element, index) {
                      element.patient.sextext = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                      element.patient.birthdaytext = moment(element.patient.birthday).format(vm.dateFormat.toUpperCase());
                      dataOrders.push(element);
                    });
                    dataOrders = dataOrders.sort(function (a, b) {
                      if (a.order > b.order) {
                        return -1;
                      } else if (a.order < b.order) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });
                    vm.orders = dataOrders;
                  } else {
                    vm.orders = [];
                  }
                  document.getElementById('txt_ordersearchrecall_patient_id').select();
                },
                function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                    vm.loadingdata=false;                 
                });
          }
        }

        /**
         * Evento cuando se busca ordenes por fecha
         */
        function searchByDate() {
          if (vm.dateToSearch !== undefined && vm.dateToSearch !== '') {
            vm.loadingdata=true;
            var date = moment(vm.dateToSearch).format('YYYYMMDD');
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            orderDS.getRecallByDate(auth.authToken, date, auth.branch) 
              .then(
                function (data) {
                  vm.loadingdata=false;
                  if (data.status === 200) {                   
                    var dataOrders = [];
                    data.data.forEach(function (element, index) {
                      element.patient.sextext = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                      element.patient.birthdaytext = moment(element.patient.birthday).format(vm.dateFormat.toUpperCase());
                      dataOrders.push(element);
                    });
                    dataOrders = dataOrders.sort(function (a, b) {
                      if (a.order > b.order) {
                        return -1;
                      } else if (a.order < b.order) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });
                    vm.orders = dataOrders;
                  } else {
                    vm.orders = [];
                  }             
                },
                function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
               });
          }
        }
        
        vm.searchByDateopen=searchByDateopen;
        function searchByDateopen() {
            var date = moment().format('YYYYMMDD');
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            orderDS.getRecallByDate(auth.authToken, date, auth.branch) 
              .then(
                function (data) {
                  vm.loading=false;
                  if (data.status === 200) {
                    var dataOrders = [];                 
                    data.data.forEach(function (element, index) {
                      element.patient.sextext = ((element.patient.sex.code === '1' ? $filter('translate')('0363') : (element.patient.sex.code === '2' ? $filter('translate')('0362') : $filter('translate')('0401'))));
                      element.patient.birthdaytext = moment(element.patient.birthday).format(vm.dateFormat.toUpperCase());
                      dataOrders.push(element);
                    });
                    dataOrders = dataOrders.sort(function (a, b) {
                      if (a.order > b.order) {
                        return -1;
                      } else if (a.order < b.order) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });
                    vm.orders = dataOrders;
                  } else {
                    vm.orders = [];
                  }               
                  UIkit.modal('#ordersearchrecall').show();
                },
                function (error) {
                    vm.loading=false;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                 });         
          }

      

        function getordertype() {

          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          //Invoca el metodo del servicio
          ordertypeDS.getlistOrderType(auth.authToken)
            .then(
              function (data) {
                vm.searchByDateopen();            
                vm.ordertype = _.filter(data.data, {
                  'code': 'C'
                })[0];
              });
        }


        /**
         * Evento cuando se selecciona una orden
         * @param {*} orderS
         */
        function selectOrder(orderS) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          $scope.fatherorder = orderS.orderNumber;
          orderS.type = vm.ordertype;
          orderS.createdDate = '';
          orderS.createdDateShort = '';
          $scope.order = orderS;
          setTimeout(function () {
            $scope.listener(orderS);
            UIkit.modal('#ordersearchrecall').hide();
          }, 100);
        }

        /**
         * Evento cuando se selecciona el tab de orden
         */
        function eventSelectOrder() {
          vm.orders = [];
          vm.orderToSearch = '';
          setTimeout(function () {
            document.getElementById('txt_ordersearchrecall_order').focus();
          }, 400);
        }

        /**
         * Evento cuando se selecciona el tab de historia
         */
        function eventSelectPatientId() {
          vm.orders = [];
          vm.patientIdToSearch = '';
          setTimeout(function () {
            document.getElementById('txt_ordersearchrecall_patient_id').focus();
          }, 400);
        }

        /**
         * Evento cuando se selecciona el tab de paciente
         */
        function eventSelectPatient() {
          vm.orders = [];
          vm.patientDocToSearch = '0';
          vm.lastNameToSearch = '';
          vm.surNameToSearch = '';
          vm.name1ToSearch = '';
          vm.name2ToSearch = '';
          setTimeout(function () {
            document.getElementById('txt_ordersearchrecall_patient_last_name').focus();
          }, 400);
        }

        /**
         * Evento cuando se selecciona el tab de fecha
         */
        function eventSelectDate() {
          vm.orders = [];
          vm.dateToSearch = moment().format();  
        }

        function getCloset() {
          UIkit.modal('#ordersearchrecall').hide();         
        }

        /**
         * Funcion inicial de la directiva
         */
        function init() {
          if (vm.showDocumentType) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            orderDS.getDocumentTypes(auth.authToken).then(
              function (response) {
                if (response.status === 200) {
                  var documentTypes = response.data;
                  documentTypes.push({
                    'id': 0,
                    'abbr': 'NI',
                    'name': 'SIN FILTRO'
                  });
                  documentTypes = documentTypes.sort(function (a, b) {
                    if (a.id > b.id) {
                      return 1;
                    } else if (a.id < b.id) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                  vm.documentTypes = documentTypes;
                  vm.patientDocToSearch = '0';
                }
              },
              function (error) {
                console.error(error);
              });
          }
        }
        vm.init();
      }],
      controllerAs: 'ordersearchrecall'
    };
    return directive;
  }
})();
