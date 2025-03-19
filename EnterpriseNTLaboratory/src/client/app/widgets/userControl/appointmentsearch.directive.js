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
    .directive('appointmentsearch', appointmentsearch);
  appointmentsearch.$inject = ['common', 'appointmentDS', 'localStorageService', '$filter', 'orderDS'];
  /* @ngInject */
  function appointmentsearch(common, appointmentDS, localStorageService, $filter, orderDS) {
    var directive = {
      templateUrl: 'app/widgets/userControl/appointmentsearch.html',
      restrict: 'EA',
      scope: {
        openmodal: '=openmodal',
        listener: '=listener',
        order: '=order'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.init = init;
        vm.dateFormat = localStorageService.get('FormatoFecha').replace('DD', 'dd').replace('YYYY', 'yyyy');
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
        vm.dateToSearch = moment().format(vm.dateFormat.toUpperCase());
        vm.orders = [];
        vm.documentTypes = [];
        vm.showDocumentType = localStorageService.get('ManejoTipoDocumento') === 'True';
        vm.showbranch = localStorageService.get('SinFiltroSedeBusquedaOrdenes') === 'True' ? true : false;
        vm.eventSelectOrder = eventSelectOrder;
        vm.eventSelectPatientId = eventSelectPatientId;
        vm.eventSelectPatient = eventSelectPatient;
        vm.eventSelectDate = eventSelectDate;
        vm.getCloset = getCloset;
        vm.maxDate = new Date();


        //vm.dateToSearch = new Date();

        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {

            vm.nofound = false;
            vm.viewtable = false;
            vm.loadingdata = true;
            vm.orderToSearch = undefined;
            vm.patientIdToSearch = undefined;
            vm.lastNameToSearch = '';
            vm.surNameToSearch = '';
            vm.name1ToSearch = '';
            vm.name2ToSearch = '';
            vm.orders = [];
            vm.dateToSearch = moment();
            vm.init();
            UIkit.modal('#appointmentsearch').show();
          }
          $scope.openmodal = false;
        });

        /**
         * Evento cuando se busca una orden
         */
        function searchByOrder() {
          if (vm.orderToSearch !== undefined && vm.orderToSearch !== '') {
            vm.loadingdata = true;
            vm.orderToSearch = Number(common.getOrderComplete(vm.orderToSearch, vm.orderDigits));
            //Obtiene token de autenticación
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            if (vm.showbranch) {
              var branch = -1;
            } else {
              var branch = auth.branch;
            }
            appointmentDS.getByOrder(auth.authToken, vm.orderToSearch, branch)
              .then(
                function (data) {
                  vm.loadingdata = false;
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.sex = ((data.data.sex === 1 ? $filter('translate')('0363') : (data.data.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))))
                    data.data.birthday = moment(data.data.birthday).format(vm.dateFormat.toUpperCase());
                    data.data.appointment.shift.init = convertirAFormatoHora(data.data.appointment.shift.init);
                    data.data.appointment.shift.end = convertirAFormatoHora(data.data.appointment.shift.end);
                    dataOrders.push(data.data);
                    vm.viewtable = true;
                    vm.orders = dataOrders;
                  } else {
                    vm.viewtable = false;
                    vm.orders = [];
                    vm.nofound = true;
                  }
                  document.getElementById('txt_appointmentsearch_order').select();
                },
                function (error) {
                  vm.loadingdata = false;
                  vm.Error = error;
                  vm.ShowPopupError = true;
                });
          } else {
            document.getElementById('txt_appointmentsearch_order').focus();
          }
        }

        /**
         * Evento cuando se busca una historia clinica, evalua si tiene configurado el tipo de documento en la aplicacion
         */
        function searchByPatientId() {
          if (vm.patientIdToSearch !== undefined && vm.patientIdToSearch !== '') {
            vm.loadingdata = true;
            vm.patientIdToSearch = vm.patientIdToSearch.toUpperCase();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.showDocumentType && vm.patientDocToSearch !== '0') {
              if (vm.showbranch) {
                var branch = -1;
              } else {
                var branch = auth.branch;
              }
              appointmentDS.getByPatientIdWithDoc(auth.authToken, vm.patientIdToSearch, vm.patientDocToSearch, branch)
                .then(
                  function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                      var dataOrders = [];
                      data.data.forEach(function (element, index) {
                        element.sex = ((element.sex === 1 ? $filter('translate')('0363') : (element.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))))
                        element.birthday = moment(element.birthday).format(vm.dateFormat.toUpperCase());
                        element.appointment.shift.init = convertirAFormatoHora(element.appointment.shift.init);
                        element.appointment.shift.end = convertirAFormatoHora(element.appointment.shift.end);
                        dataOrders.push(element);
                      });
                      vm.viewtable = true;
                      vm.orders = _.orderBy(dataOrders, 'order', 'desc');
                    } else {
                      vm.viewtable = false;
                      vm.orders = [];
                      vm.nofound = true;
                    }
                    document.getElementById('txt_appointmentsearch_patient_id').select();
                  },
                  function (error) {
                    vm.loadingdata = false;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  });
            } else {
              //Busca sin tipo de documento
              vm.loadingdata = true;
              if (vm.showbranch) {
                var branch = -1;
              } else {
                var branch = auth.branch;
              }
              appointmentDS.getByPatientIdWithDoc(auth.authToken, vm.patientIdToSearch, 1, branch)
                .then(
                  function (data) {
                    if (data.status === 200) {

                      var dataOrders = [];
                      data.data.forEach(function (element, index) {
                        element.sex = ((element.sex === 1 ? $filter('translate')('0363') : (element.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))))
                        element.birthday = moment(element.birthday).format(vm.dateFormat.toUpperCase());
                        element.appointment.shift.init = convertirAFormatoHora(element.appointment.shift.init);
                        element.appointment.shift.end = convertirAFormatoHora(element.appointment.shift.end);
                        dataOrders.push(element);
                      });
                      vm.viewtable = true;
                      vm.orders = _.orderBy(dataOrders, 'order', 'desc');
                    } else {
                      vm.viewtable = false;
                      vm.orders = [];
                      vm.nofound = true;
                    }
                    vm.loadingdata = false;
                    document.getElementById('txt_appointmentsearch_patient_id').select();
                  },
                  function (error) {
                    vm.loadingdata = false;
                    vm.Error = error;
                    vm.ShowPopupError = true;
                  });
            }
          } else {
            document.getElementById('txt_appointmentsearch_patient_id').focus();
          }
        }

        /**
         * Evento cuando se busca un paciente por nombre
         */
        function searchByPatient() {
          if (vm.lastNameToSearch.trim() === '' &&
            vm.surNameToSearch.trim() === '' &&
            vm.name1ToSearch.trim() === '' &&
            vm.name2ToSearch.trim() === '') { } else {
            vm.loadingdata = true;
            var lastNameToSearch = vm.lastNameToSearch === '' ? 'undefined' : vm.lastNameToSearch;
            var surNameToSearch = vm.surNameToSearch === '' ? 'undefined' : vm.surNameToSearch;
            var name1ToSearch = vm.name1ToSearch === '' ? 'undefined' : vm.name1ToSearch;
            var name2ToSearch = vm.name2ToSearch === '' ? 'undefined' : vm.name2ToSearch;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            if (vm.showbranch) {
              var branch = -1;
            } else {
              var branch = auth.branch;
            }
            appointmentDS.getByPatientInfo(auth.authToken, lastNameToSearch, surNameToSearch, name1ToSearch, name2ToSearch, branch)
              .then(
                function (data) {
                  vm.loadingdata = false;
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.forEach(function (element, index) {
                      element.sex = ((element.sex === 1 ? $filter('translate')('0363') : (element.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))))
                      element.birthday = moment(element.birthday).format(vm.dateFormat.toUpperCase());
                      element.appointment.shift.init = convertirAFormatoHora(element.appointment.shift.init);
                      element.appointment.shift.end = convertirAFormatoHora(element.appointment.shift.end);
                      dataOrders.push(element);
                    });
                    vm.viewtable = true;
                    vm.orders = _.orderBy(dataOrders, 'order', 'desc');
                  } else {
                    vm.viewtable = false;
                    vm.orders = [];
                    vm.nofound = true;
                  }
                  document.getElementById('txt_appointmentsearch_patient_id').select();
                },
                function (error) {
                  vm.loadingdata = false;
                  vm.Error = error;
                  vm.ShowPopupError = true;
                });
          }
        }

        /**
         * Evento cuando se busca ordenes por fecha
         */
        function searchByDate() {
          if (vm.dateToSearch !== undefined && vm.dateToSearch !== '') {
            vm.loadingdata = true;
            var date = moment(vm.dateToSearch).format('YYYYMMDD');
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            //Invoca el metodo del servicio
            if (vm.showbranch) {
              var branch = -1;
            } else {
              var branch = auth.branch;
            }
            appointmentDS.getByEntryDate(auth.authToken, date, branch)
              .then(
                function (data) {
                  vm.loadingdata = false;
                  if (data.status === 200) {
                    var dataOrders = [];
                    data.data.forEach(function (element, index) {
                      element.sex = ((element.sex === 1 ? $filter('translate')('0363') : (element.sex === 2 ? $filter('translate')('0362') : $filter('translate')('0401'))))
                      element.birthday = moment(element.birthday).format(vm.dateFormat.toUpperCase());
                      element.appointment.shift.init = convertirAFormatoHora(element.appointment.shift.init);
                      element.appointment.shift.end = convertirAFormatoHora(element.appointment.shift.end);
                      dataOrders.push(element);
                    });
                    vm.viewtable = true;
                    vm.orders = _.orderBy(dataOrders, 'order', 'desc');
                  } else {
                    vm.viewtable = true;
                    vm.nofound = true;
                    vm.orders = [];
                  }
                  document.getElementById('kUI_datepicker_a').select();
                },
                function (error) {
                  vm.loadingdata = false;
                  vm.Error = error;
                  vm.ShowPopupError = true;
                });
          } else {
            document.getElementById('kUI_datepicker_a').focus();
          }
        }

        /**
         * Evento cuando se selecciona una orden
         * @param {*} orderS
         */
        function selectOrder(orderS) {
          vm.nofound = false;
          vm.viewtable = false;
          $scope.order = orderS;
          setTimeout(function () {
            $scope.listener(orderS);
            UIkit.modal('#appointmentsearch').hide();
          }, 100);
        }

        /**
         * Evento cuando se selecciona el tab de orden
         */
        function eventSelectOrder() {
          vm.nofound = false;
          vm.viewtable = false;
          vm.orders = [];
          vm.orderToSearch = '';
          setTimeout(function () {
            document.getElementById('txt_appointmentsearch_order').focus();
          }, 400);
        }

        /**
         * Evento cuando se selecciona el tab de historia
         */
        function eventSelectPatientId() {
          vm.nofound = false;
          vm.viewtable = false;
          vm.orders = [];
          vm.patientIdToSearch = '';
          vm.patientDocToSearch = 0;
          setTimeout(function () {
            document.getElementById('txt_appointmentsearch_patient_id').focus();
          }, 400);
        }

        /**
         * Evento cuando se selecciona el tab de paciente
         */
        function eventSelectPatient() {
          vm.nofound = false;
          vm.viewtable = false;
          vm.orders = [];
          vm.lastNameToSearch = '';
          vm.surNameToSearch = '';
          vm.name1ToSearch = '';
          vm.name2ToSearch = '';
          setTimeout(function () {
            document.getElementById('txt_appointmentsearch_patient_last_name').focus();
          }, 400);
        }

        function convertirAFormatoHora(numero) {
          var horas = Math.floor(numero / 100); // Obtiene las horas
          var minutos = numero % 100; // Obtiene los minutos
          return horas + ":" + (minutos < 10 ? "0" : "") + minutos; // Formatea los minutos con cero a la izquierda si es necesario
      }

        /**
         * Evento cuando se selecciona el tab de fecha
         */
        function eventSelectDate() {
          vm.nofound = false;
          vm.viewtable = false;
          vm.orders = [];
          vm.dateToSearch = moment();
          setTimeout(function () {
            document.getElementById('kUI_datepicker_a').select();
            document.getElementById('kUI_datepicker_a').focus();
          }, 400);
        }

        function getCloset() {
          UIkit.modal('#appointmentsearch').hide();
          vm.dateToSearch = moment().format(vm.dateFormat.toUpperCase());
        }

        /**
         * Funcion inicial de la directiva
         */
        function init() {
          if (vm.showDocumentType) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            orderDS.getDocumentTypes(auth.authToken).then(
              function (response) {
                vm.loadingdata = false;
                if (response.status === 200) {
                  var documentTypes = response.data;
                  documentTypes.push({
                    'id': 0,
                    'abbr': 'NI',
                    'name': 'SIN FILTRO'
                  });
                  vm.documentTypes = documentTypes;
                  vm.patientDocToSearch = 0;
                }
              },
              function (error) {
                console.error(error);
              });
          } else {
            vm.loadingdata = false;
          }
        }


      }],
      controllerAs: 'appointmentsearch'
    };
    return directive;
  }
})();
