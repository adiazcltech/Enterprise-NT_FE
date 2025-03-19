/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.historypatient')
    .controller('HistoryPatientController', HistoryPatientController);


  HistoryPatientController.$inject = ['localStorageService', 'logger', 'patientDS', 'orderentryDS',
    '$filter', '$state', 'moment', '$rootScope', 'common'
  ];

  function HistoryPatientController(localStorageService, logger, patientDS, orderentryDS,
    $filter, $state, moment, $rootScope, common) {

    var vm = this;
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    $rootScope.helpReference = '01. LaboratoryOrders/historypatient.htm';
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.staticDemoIds = {
      'patientDB': -99,
      'documentType': -10,
      'patientId': -100,
      'lastName': -101,
      'surName': -102,
      'name1': -103,
      'name2': -109,
      'sex': -104,
      'birthday': -105,
      'age': -110,
      'email': -106,
      'weight': -8,
      'size': -9,
      'race': -7,
      'order': -107,
      'phone': -111,
      'address': -112,
      'orderType': -4
    };
    $rootScope.pageview = 3;
    vm.title = 'HistoryPatient';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0017');
    vm.stateControl = 8;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.digitsorder = localStorageService.get('DigitosOrden');
    vm.maxLenght = localStorageService.get('DigitosOrden') + 8;
    vm.manageweight = localStorageService.get('ManejoPeso') === 'True';
    vm.managesize = localStorageService.get('ManejoTalla') === 'True';
    vm.managerace = localStorageService.get('ManejoRaza') === 'True';
    vm.managedocumenttype = localStorageService.get('ManejoTipoDocumento').toLowerCase() === 'true';
    vm.managehistoryauto = localStorageService.get('HistoriaAutomatica').toLowerCase() === 'true';
    vm.maskphone = localStorageService.get('FormatoTelefono') === null ? '' : localStorageService.get('FormatoTelefono');
    vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
    vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';
    vm.ipuser = null;

    //Variables con directivas
    vm.selectedDate = new Date();
    vm.eventSelectDate = eventSelectDate;

    //Variables de control
    vm.savephotopatient = savephotopatient;
    vm.modalError = modalError;
    vm.historySearchEvent = historySearchEvent;

    vm.selectedOrder = 0;
    vm.history = undefined;
    vm.patientPhoto = 'images/user.png';
    vm.patientDemos = {};
    vm.patientDemosValues = {};
    vm.patientDemosDisabled = {};
    vm.loadDemographicControls = loadDemographicControls;
    vm.selectedPatientId = selectedPatientId;
    vm.selectedPatientName = selectedPatientName;
    vm.statediagnostic = 1;

    //Eventos de botones
    vm.eventNew = eventNew;
    vm.eventEdit = eventEdit;
    vm.eventUndo = eventUndo;
    vm.eventSave = eventSave;
    vm.eventCancel = eventCancel;
    vm.cleanAllDemos = cleanAllDemos;
    vm.disabledAllDemo = disabledAllDemo;
    vm.disabledDemo = disabledDemo;
    vm.namesPatient = {};

    //Botones
    vm.newDisabled = false;
    vm.editDisabled = true;
    vm.cancelDisabled = true;
    vm.saveDisabled = true;
    vm.undoDisabled = true;

    //Funciones de utilidad
    vm.validateForm = validateForm;
    //Objecto de valides del resultado
    vm.resultValidity = {};

    $rootScope.$watch('ipUser', function () {
      vm.ipuser = $rootScope.ipUser;
    });

    /**
     * Carga en los controles de paciente y ordenes los demograficos configurados
     */
    function loadDemographicControls() {
      //Carga la historia
      var patientDemosValues = {};
      var patientDemosDisabled = {};
      var index = 1;
      orderentryDS.getDemographics(auth.authToken, 'H').then(function (response) {
        var demopatient = [];
        response.data.forEach(function (value, key) {
          value.tabIndex = index;
          if (!vm.twoNames && value.id === -103) {
            value.name = "3656"
          }
          if (!vm.twosurnames && value.id === -101) {
            value.name = "3657"
          }
          value.name = ($filter('translate')(value.name)).toLowerCase();
          value.format = value.format === undefined || value.format === '' ? '' : value.format;
          if (value.id === -8 || value.id === -9) {
            value.placeholder = '';
            value.format = '';
          }
          if (value.id === -105) {
            value.date = true;
            value.format = value.placeholder;
          } else if (value.format !== undefined && value.format !== '') {
            if (value.format.search("DATE") === -1) {
              value.date = false;
            } else {
              value.date = true;
              value.format = value.format.slice(5);
            }
          }
          value.showRequired = false;
          value.idOrigin = '|' + value.id + 'H';
          if (!vm.twoNames && value.id === -109 || !vm.twosurnames && value.id === -102) {
          } else {
            patientDemosValues[value.id] = '';
            patientDemosDisabled[value.id] = true;
            if (value.encoded) {
              var itemsdefault = '';
              var viewdefault = false;
              value.items.forEach(function (item, indexItem) {
                item.idDemo = value.id;
                item.showValue = (item.code + '. ' + item.name).toUpperCase();
                if (item.defaultItem) {
                  itemsdefault = item;
                  viewdefault = true;
                }
              });
              value.itemsdefault = itemsdefault;
              value.viewdefault = viewdefault;
            }
            demopatient.add(value);
          }
          index++;
        });

        //Actualiza la vista
        vm.patientDemos = demopatient;
        vm.patientDemosValues = patientDemosValues;
        vm.patientDemosDisabled = patientDemosDisabled;
        vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
      },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
    }

    /**
     * Evento que se realiza al seleccionar la historia de un paciente
     */
    function selectedPatientId() {
      var searchById_DB = vm.managehistoryauto ? 'patientDB' : 'patientId';
      vm.patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
      if (vm.patientId.toString().trim() !== '') {
        vm.documentType = vm.patientDemosValues[vm.staticDemoIds['documentType']];
        var idDocumentType = 0;

        var patientDemosValues = {};
        if (!vm.managehistoryauto) {

          if (vm.managedocumenttype === true) {
            if (vm.documentType.hasOwnProperty('originalObject')) {
              idDocumentType = vm.documentType.originalObject.id;
            } else {
              idDocumentType = vm.documentType.id;
            }
          } else {
            idDocumentType = 1
          }
        }
        patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {

          vm.viewphoto = true;
          vm.patientDemosDisabled.photo = true;
          vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.data.length > 0);
          vm.editDisabled = response.data.length === 0;
          if (response.data.length > 0) {
            vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
            response.data.forEach(function (demographic, index) {
              if (demographic.encoded) {
                patientDemosValues[demographic.idDemographic] = {
                  'id': demographic.codifiedId,
                  'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                  'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                  'showValue': demographic.value !== undefined ? demographic.value : ''
                };
              } else {
                patientDemosValues[demographic.idDemographic] = demographic.value;
                if (demographic.idDemographic == vm.staticDemoIds['birthday']) {
                  //Si el demografico es la fecha de nacimiento calcula la edad
                  patientDemosValues[vm.staticDemoIds['age']] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                }
              }
            });
            vm.patientDemosValues = patientDemosValues;
          } else {
            vm.statediagnostic = 2;
            vm.cleanAllDemos();
            setTimeout(function () {
              document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
            }, 100);
          }
          //Logica de Botones
          vm.newDisabled = true;
          //vm.editDisabled = true;
          vm.cancelDisabled = true;
          vm.saveDisabled = false;
          vm.undoDisabled = true;

          //Habilita el combo de examenes
          vm.disabledTests = false;
        }, function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
      }

    }

    /**
     * Evento que busca un paciente por nombre
     */
    function selectedPatientName() {
      if (vm.patientDemosValues[-101].trim() === '' && vm.patientDemosValues[-102].trim() === '' &&
        vm.patientDemosValues[-103].trim() === '' && vm.patientDemosValues[-109].trim() === '') {
        return;
      }
      vm.namesPatient = {
        'lastNameToSearch': vm.patientDemosValues[-101].toUpperCase(),
        'surNameToSearch': vm.patientDemosValues[-102].toUpperCase(),
        'name1ToSearch': vm.patientDemosValues[-103].toUpperCase(),
        'name2ToSearch': vm.patientDemosValues[-109].toUpperCase()
      }

    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }


    /**
     * Limpia el valor de todos los demograficos
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.historyDemosValues)
     */
    function cleanAllDemos(demos) {
      var cleanDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          cleanDemos[property] = '';
        }
      }
      return cleanDemos;
    }

    /**
     * Habilita o deshabilita todos los demograficos de un control
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.historyDemosValues)
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledAllDemo(demos, disabled) {
      var disabledDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          disabledDemos[property] = disabled;
        }
      }
      return disabledDemos;
    }

    /**
     * Habilita o deshabilita un demografico
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue)
     * @param {*} id Id demografico para deshabilitar
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledDemo(demos, id, disabled) {
      for (var property in demos) {
        if (property == id) {
          if (demos.hasOwnProperty(property)) {
            demos[property] = disabled;
          }
        }
      }
      return demos;
    }

    /**
     * Evento de presionar el boton Guardar
     */
    function eventSave() {
      if (validateForm()) {
        //Se obtiene la informacion del paciente
        var patient = getPatientData();

        if (vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== null && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== undefined && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== '') {

          //Invoca el servicio que actualiza el paciente
          patient.id = vm.patientDemosValues[vm.staticDemoIds['patientDB']];
          patientDS.updatePatient(auth.authToken, patient).then(function (data) {
            if (data.status === 200) {
              logger.success($filter('translate')('0671'));
              vm.savephotopatient(vm.patientDemosValues[vm.staticDemoIds['patientDB']]);
              afterSavePatient(data.data);
            } else {
              logger.warning($filter('translate')('0673'));
            }
          }, function (error) {
            if (error.data !== null) {
              if (error.data.code === 2) {
                error.data.errorFields.forEach(function (value) {
                  var item = value.split('|');
                  if (item[0] === '0' && item[1] === 'Patient exists') {
                    logger.warning($filter('translate')('0672'));
                    //vm.cleanform = 1;
                    vm.statepatient = 5;
                  }
                });
              }
            } else {
              vm.modalError(error);
            }
          });
        } else {

          //Invoca el servicio que crea el paciente
          patientDS.insertPatient(auth.authToken, patient).then(function (data) {
            if (data.status === 200) {
              logger.success($filter('translate')('0670'));
              vm.savephotopatient(data.data.id);
              afterSavePatient(data.data);
            }
          }, function (error) {
            if (error.data !== null) {
              if (error.data.code === 2) {
                error.data.errorFields.forEach(function (value) {
                  var item = value.split('|');
                  if (item[0] === '0' && item[1] === 'Patient already exists') {
                    logger.warning('El paciente ya existe!');
                    //vm.cleanform = 1;
                    vm.statepatient = 5;
                  }
                });
              }
            } else {
              vm.modalError(error);
            }
          });
        }

      } else {
        logger.warning($filter('translate')('0663'));
      }
    }

    function savephotopatient(id) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      var datapatient = {
        'id': id,
        'photoInBase64': vm.patientPhoto
      };
      patientDS.insertphotopatient(auth.authToken, datapatient).then(
        function (response) { });
    }


    /**
     * Evento de presionar nuevo
     */
    function eventNew() {
      vm.documentType = {
        'id': 0
      };
      vm.patientId = '';
      vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
      vm.patientDemosDisabled[-100] = vm.managehistoryauto;
      vm.patientDemos.forEach(function (demo, index) {
        if (demo.encoded && demo.viewdefault) {
          vm.patientDemosValues[demo.id] = demo.itemsdefault;
        }
      });
      if (vm.managedocumenttype) {
        vm.patientDemosDisabled[-10] = false;
        setTimeout(function () {
          document.getElementById('demo_' + vm.staticDemoIds['documentType'] + '_value').focus();
        }, 100);
      } else {
        if (!vm.managehistoryauto) {
          setTimeout(function () {
            document.getElementById('demo_' + vm.staticDemoIds['patientId']).focus();
          }, 100);
        } else {
          setTimeout(function () {
            document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
          }, 100);
        }

      }
      //Logica de Botones
      vm.newDisabled = true;
      vm.editDisabled = true;
      vm.cancelDisabled = !vm.managehistoryauto;
      vm.saveDisabled = !vm.managehistoryauto;
      vm.undoDisabled = false;

      //Limpia el formulario de los indicadores de obligatorios
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
    }

    function eventEdit() {
      vm.statediagnostic = 2;
      //Habilita los datos del paciente
      var patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, false);
      vm.patientDemosDisabled = patientDemosDisabled;
      vm.patientDemosDisabled[-100] = vm.managehistoryauto;
      if (vm.managehistoryauto) {
        vm.patientDemosDisabled[-101] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-102] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-103] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-109] = !vm.managehistoryauto;
      }

      //Logica de Botones
      vm.newDisabled = true;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = false;
      vm.undoDisabled = false;
    }

    /**
     * Evento de Deshacer
     */
    function eventUndo() {
      vm.statediagnostic = 1;
      if (vm.patientDemosValues[-100] === '' || vm.patientId === '') {
        vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
        vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
        //Logica de Botones
        vm.newDisabled = false;
        vm.editDisabled = true;
        vm.cancelDisabled = true;
        vm.saveDisabled = true;
        vm.undoDisabled = true;

        //Limpia el formulario de los indicadores de obligatorios
        vm.patientDemos.forEach(function (demo, index) {
          demo.showRequired = false;
        });
        vm.patientDemosValues[vm.staticDemoIds['patientDB']] == null;
      } else {
        vm.patientDemosValues[vm.staticDemoIds['patientId']] = vm.patientId;
        vm.patientDemosValues[vm.staticDemoIds['documentType']] = vm.documentType;
        vm.selectedPatientId();
      }
    }

    function eventCancel() {
      vm.statediagnostic = 1;
      vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
      vm.documentType = {
        'id': 0
      };
      vm.patientId = '';
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      //Logica de Botones
      vm.newDisabled = false;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
    }

    function eventSelectDate(date) {
      vm.selectedDate = date;
    }


    function historySearchEvent(history) {
      //vm.history = history;
      vm.statediagnostic = 1;
      vm.patientDemosValues[vm.staticDemoIds['patientId']] = history.id;
      vm.patientDemosValues[vm.staticDemoIds['documentType']] = history.documentType;
      vm.patientDemosValues[vm.staticDemoIds['patientDB']] = history.IdDB;
      vm.selectedPatientId();
    }


    function eventValidityResult(test) {
      vm.resultValidity = {
        'photo': 'data:image/png;base64,' + test.resultValidity.userLastResult.photo,
        'lastName': test.resultValidity.userLastResult.lastName,
        'name': test.resultValidity.userLastResult.name,
        'dateLastResult': moment(test.resultValidity.dateLastResult).format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
        'daysFromLastResult': test.resultValidity.daysFromLastResult + ' ' + $filter('translate')('0476')
      }
    }


    /**
     * Valida que el ingreso esta correcto para guardar la orden
     */
    function validateForm() {
      var fieldsComplete = true;
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
        if (demo.obligatory === 1) {
          if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
            if (demo.encoded) {
              if (typeof vm.patientDemosValues[demo.id] !== 'object') {
                demo.showRequired = true;
                fieldsComplete = false;
              } else {
                if (!vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                } else if (vm.patientDemosValues[demo.id].id === undefined) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              }
            } else {
              if (demo.date === true && vm.patientDemosValues[demo.id] !== null && demo.date === true && vm.patientDemosValues[demo.id] !== '') {

              } else if (demo.date === true && vm.patientDemosValues[demo.id] === null || demo.date === true && vm.patientDemosValues[demo.id] === '' || demo.date === true && vm.patientDemosValues[demo.id] === 'Invalid date') {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (vm.patientDemosValues[demo.id] === undefined || vm.patientDemosValues[demo.id].trim() === '') {
                demo.showRequired = true;
                fieldsComplete = false;
              }
            }
          } else if (demo.id === -111 && vm.maskphone !== '' && vm.patientDemosValues[demo.id] !== undefined) {
            if (vm.patientDemosValues[demo.id].length < vm.maskphone.length) {
              demo.showInvalidmask = true;
            } else {
              demo.showInvalidmask = false;
            }
          }
        }
      });
      return fieldsComplete;
    }
    /**
     * Obtiene los datos del formulario asociados al paciente
     */
    function getPatientData() {
      var patient = {};
      var patientDemographics = [];
      vm.patientDemos.forEach(function (demo, index) {
        if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
          if (demo.encoded) {
            if (demo.id === vm.staticDemoIds['documentType']) {
              patient.documentType = {
                'id': vm.patientDemosValues[demo.id].id
              };
            } else if (demo.id === vm.staticDemoIds['sex']) {
              patient.sex = {
                'id': vm.patientDemosValues[demo.id].id
              };
            } else if (demo.id === vm.staticDemoIds['race']) {
              if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                patient.race = {
                  'id': vm.patientDemosValues[demo.id].id
                };
              } else {
                patient.race = null;
              }
            } else {
              if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                patientDemographics.push({
                  'idDemographic': demo.id,
                  'encoded': true,
                  'notCodifiedValue': '',
                  'codifiedId': vm.patientDemosValues[demo.id].id
                });
              }
            }
          } else {
            if (demo.id !== vm.staticDemoIds['age']) {
              if (demo.id === vm.staticDemoIds['patientDB']) {
                patient.id = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds['patientId']) {
                patient.patientId = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds['lastName']) {
                patient.lastName = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds['surName']) {
                patient.surName = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
              } else if (demo.id === vm.staticDemoIds['name1']) {
                patient.name1 = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds['name2']) {
                patient.name2 = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
              } else if (demo.id === vm.staticDemoIds['birthday']) {
                var birthday = moment.utc(vm.patientDemosValues[demo.id], vm.formatDate.toUpperCase());
                if (isNaN(birthday)) {
                  var datebirthday = moment.utc(vm.patientDemosValues[demo.id]).format(vm.formatDate.toUpperCase());
                  var birthday = moment.utc(datebirthday, vm.formatDate.toUpperCase())
                }
                patient.birthday = birthday
              } else if (demo.id === vm.staticDemoIds['email']) {
                patient.email = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
              } else if (demo.id === vm.staticDemoIds['weight']) {
                patient.weight = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
              } else if (demo.id === vm.staticDemoIds['size']) {
                patient.size = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
              } else if (demo.id === vm.staticDemoIds['phone']) {
                patient.phone = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
              } else if (demo.id === vm.staticDemoIds['address']) {
                patient.address = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
              } else {
                if (demo.date === true) {
                  if (vm.patientDemosValues[demo.id] !== '') {
                    var format = demo.format === '' ? vm.formatDate.toUpperCase() : demo.format.toUpperCase();
                    vm.patientDemosValues[demo.id] = moment(vm.patientDemosValues[demo.id]).format(format);
                  }
                }
                if (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' && vm.patientDemosValues[demo.id] !== null) {
                  patientDemographics.push({
                    'idDemographic': demo.id,
                    'encoded': false,
                    'notCodifiedValue': vm.patientDemosValues[demo.id],
                    'codifiedId': ''
                  });
                } else {
                  if (demo.id === vm.staticDemoIds['surName']) {
                    patient.surName = '';
                  } else if (demo.id === vm.staticDemoIds['name1']) {
                    patient.name1 = '';
                  } else if (demo.id === vm.staticDemoIds['email']) {
                    patient.email = '';
                  } else {
                    patientDemographics.push({
                      'idDemographic': demo.id,
                      'encoded': false,
                      'notCodifiedValue': '',
                      'codifiedId': ''
                    });
                  }
                }
              }
            }
          }
        } else {
          if (demo.id === -997) {
            patient.diagnostic = (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' ? vm.patientDemosValues[demo.id] : []);
          } else if (demo.id === vm.staticDemoIds['surName']) {
            patient.surName = '';
          } else if (demo.id === vm.staticDemoIds['name1']) {
            patient.name1 = '';
          } else if (demo.id === vm.staticDemoIds['email']) {
            patient.email = '';
          } else if (demo.id === vm.staticDemoIds['phone']) {
            patient.phone = '';
          } else if (demo.id === vm.staticDemoIds['address']) {
            patient.address = '';
          } else if (demo.id > 0) {
            patientDemographics.push({
              'idDemographic': demo.id,
              'encoded': demo.encoded,
              'notCodifiedValue': '',
              'codifiedId': ''
            });
          }
        }
      });
      if (patient.documentType === undefined) {
        patient.documentType = {
          'id': 1
        };
      }
      if (!vm.twoNames) {
        patient.name2 = '';
      }
      if (!vm.twosurnames) {
        patient.surName = '';
      }
      patient.demographics = patientDemographics;
      return patient;
    }

    /**
     * Se ejecuta despues de guardada o modificada la orden
     * @param {*} response Objeto de respuesta enviado desde el servidor
     */
    function afterSavePatient(response) {
      //Setea el numero de historia generado en los valores de ids ocultos
      vm.patientDemosValues[vm.staticDemoIds['patientDB']] = response.id;
      if (vm.managehistoryauto) {
        vm.patientDemosValues[vm.staticDemoIds['patientId']] = response.id;
      }
      //Deshabilita los controles de ingreso de datos
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosValues[-99] = response.id;
      vm.statediagnostic = 4;
      //Logica de Botones
      vm.newDisabled = false;
      vm.editDisabled = false;
      vm.cancelDisabled = false;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
    }



    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }

    function init() {
      vm.loadDemographicControls();
    }

    vm.isAuthenticate();

  }
})();
/* jshint ignore:end */
