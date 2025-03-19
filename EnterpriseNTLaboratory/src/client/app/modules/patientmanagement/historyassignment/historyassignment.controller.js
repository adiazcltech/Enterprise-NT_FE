/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.historyassignment')
    .controller('historyassignmentController', historyassignmentController);


  historyassignmentController.$inject = ['orderinterviewDS', 'common', 'orderentryDS', 'patientDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope'
  ];

  function historyassignmentController(orderinterviewDS, common, orderentryDS, patientDS, localStorageService,
    logger, $filter, $state, moment, $rootScope) {

    var vm = this;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    var auth = localStorageService.get('Enterprise_NT.authorizationData');
    vm.title = 'HistoryAssignment';
    $rootScope.menu = true;
    $rootScope.NamePage = $filter('translate')('0016');
    $rootScope.helpReference = '01. LaboratoryOrders/historyassignment.htm';
    vm.maskphone = localStorageService.get('FormatoTelefono') === null ? '' : localStorageService.get('FormatoTelefono');
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
      'orderDB': -998,
      'order': -107,
      'orderDate': -108,
      'orderType': -4,
      'phone': -111,
      'address': -112
    };
    $rootScope.pageview = 3;
    vm.getorder = getorder;
    vm.getDetail = getDetail;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.formatDateSave = localStorageService.get('FormatoFecha').toUpperCase();
    vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
    vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';
    vm.dateseach = moment().format();
    vm.max = moment().format();
    vm.selected = -1;
    vm.save = save;
    vm.saveOrderpatient = saveOrderpatient;
    vm.insertpatient = insertpatient;
    vm.changestate = changestate;
    vm.statepatient = 2;
    vm.logpatient = 1;
    vm.order = '';
    vm.cleanform = 2;
    vm.loading = true;
    vm.savephotopatient = savephotopatient;
    vm.manageweight = localStorageService.get('ManejoPeso') === 'True';
    vm.managesize = localStorageService.get('ManejoTalla') === 'True';
    vm.managerace = localStorageService.get('ManejoRaza') === 'True';
    vm.managedocumenttype = localStorageService.get('ManejoTipoDocumento').toLowerCase() === 'true';
    vm.managehistoryauto = localStorageService.get('HistoriaAutomatica').toLowerCase() === 'true';
    vm.cleanAllDemos = cleanAllDemos;
    vm.disabledAllDemo = disabledAllDemo;
    vm.disabledDemo = disabledDemo;
    vm.patientPhoto = 'images/user.png';
    vm.patient = {};
    vm.patientDemosValues = {};
    vm.patientDemosDisabled = {};
    vm.loadDemographicControls = loadDemographicControls;
    vm.selectedPatientId = selectedPatientId;
    vm.selectedPatientName = selectedPatientName;
    vm.modalError = modalError;
    vm.validateForm = validateForm;
    vm.disabledSave = true;
    vm.eventCancel = eventCancel;
    vm.verifyPatient = verifyPatient;
    vm.errorValidOrVerify = errorValidOrVerify;
    vm.permissionuser = localStorageService.get('user');
    vm.loadPatient = loadPatient;
    vm.updatepatient = updatepatient;

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    function loadPatient(patient) {
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);

      var patientDemosValues = {};
      //Carga los datos del paciente
      patientDemosValues[vm.staticDemoIds['patientDB']] = patient.id
      if (vm.managedocumenttype) {
        patientDemosValues[vm.staticDemoIds['documentType']] = {
          'id': patient.documentType.id,
          'code': patient.documentType.abbr.toUpperCase(),
          'name': patient.documentType.name.toUpperCase(),
          'showValue': patient.documentType.abbr.toUpperCase() + '. ' + patient.documentType.name.toUpperCase()
        };
      }
      patientDemosValues[vm.staticDemoIds['patientId']] = patient.patientId;
      patientDemosValues[vm.staticDemoIds['lastName']] = patient.lastName;
      patientDemosValues[vm.staticDemoIds['surName']] = patient.surName;
      patientDemosValues[vm.staticDemoIds['name1']] = patient.name1;
      patientDemosValues[vm.staticDemoIds['name2']] = patient.name2;
      patientDemosValues[vm.staticDemoIds['birthday']] = patient.birthday;
      patientDemosValues[vm.staticDemoIds['age']] = patient.age;

      if (patient.id !== undefined) {
        patientDemosValues[vm.staticDemoIds['sex']] = {
          'id': patient.sex.id,
          'code': patient.sex.code.toUpperCase(),
          'name': patient.sex.esCo.toUpperCase(),
          'showValue': patient.sex.code.toUpperCase() + '. ' + patient.sex.esCo.toUpperCase()
        };
        patientDemosValues[vm.staticDemoIds['birthday']] = moment(patient.birthday).format(vm.formatDate.toUpperCase());
        patientDemosValues[vm.staticDemoIds['age']] = common.getAge(moment(patient.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
        patientDemosValues[vm.staticDemoIds['email']] = patient.email;
        if (vm.manageweight) {
          patientDemosValues[vm.staticDemoIds['weight']] = patient.weight;
        }
        if (vm.managesize) {
          patientDemosValues[vm.staticDemoIds['size']] = patient.size;
        }
        if (vm.managerace) {
          if (patient.race !== undefined && patient.race.id !== undefined) {
            patientDemosValues[vm.staticDemoIds['race']] = {
              'id': patient.race.id,
              'name': patient.race.name.toUpperCase(),
              'showValue': patient.race.name.toUpperCase()
            };
          }
        }
      }
      vm.patientDemosValues = patientDemosValues;
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
      vm.patientDemosDisabled.photo = false;
      vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
      vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['lastName'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['surName'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['name1'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['name2'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['sex'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['birthday'], patient.id !== undefined ? true : false);
      vm.disabledAllDemo(vm.patientDemosDisabled, vm.staticDemoIds['age'], patient.id !== undefined ? true : false);
      setTimeout(function () {
        document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
      }, 100);
    }
    function getorder() {
      vm.ListOrder = [];
      vm.disabledSave = true;
      vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);

      if (Object.prototype.toString.call(new Date(vm.dateseach)) !== '[object Date]' || vm.dateseach === null) {
        vm.dateseach = moment().format(vm.formatDate);
        vm.loading = false;
        return;
      }

      var ordersrange = {
        'rangeType': 0,
        'init': moment(vm.dateseach).format('YYYYMMDD'),
        'end': moment(vm.dateseach).format('YYYYMMDD'),
        'basic': false
      };
      vm.loading = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return orderinterviewDS.listordersnopatient(auth.authToken, ordersrange).then(function (data) {
        vm.loading = false;
        if (data.status === 200) {
          vm.ListOrder = data.data;
        } else {
          logger.info($filter('translate')('0668'));
        }
      }, function (error) {
        if (error.data === null) {
          vm.modalError(error);
        }
      });
    }
    function getDetail(order) {
      vm.selected = order;
      vm.order = order;
      vm.statepatient = 1;
      vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosDisabled = vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], false);
      vm.patientDemosDisabled = vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], false);
      vm.disabledSave = false;
      vm.patientDemosDisabled[-100] = vm.managehistoryauto;
      if (vm.managehistoryauto) {
        vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
        vm.patientDemosDisabled[-100] = vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], false);
      }
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
          vm.openSearch = true;
          setTimeout(function () {
            document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
          }, 100);
        }

      }
    }
    function changestate() {
      setTimeout(function () {
        if (vm.logpatient === 1) {
          UIkit.modal('#confirmationmodal').show();
          vm.cleanform = 2;
        }
      }, 500);
    }
    /**
     * Carga en los controles de paciente y ordenes los demograficos configurados
     */
    function loadDemographicControls() {
      //Carga la historia
      var patientDemosValues = {};
      var patientDemosDisabled = {};
      var index = 1;
      orderentryDS.getDemographics(auth.authToken, 'H').then(
        function (response) {
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
                value.items.forEach(function (item, indexItem) {
                  item.idDemo = value.id;
                  item.showValue = (item.code + '. ' + item.name).toUpperCase();
                });
              }
              demopatient.add(value);
            }

            index++;
          });

          //Actualiza la vista
          vm.patient = demopatient;
          vm.patientDemosValues = patientDemosValues;
          vm.patientDemosDisabled = patientDemosDisabled;
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
    }
    function selectedPatientId() {
      vm.loading = true;
      var searchById_DB = vm.managehistoryauto ? 'patientDB' : 'patientId';
      vm.patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
      var patientDemosValues = {};
      var patID = vm.patientId === undefined ? '' : vm.patientId.toString().trim();
      if (patID !== '') {
        vm.documentType = vm.patientDemosValues[vm.staticDemoIds["documentType"]];
        var idDocumentType = 0;
        if (!vm.managehistoryauto) {
          if (vm.managedocumenttype === true) {
            if (vm.documentType.hasOwnProperty("originalObject")) {
              idDocumentType = vm.documentType.originalObject.id;
            } else {
              idDocumentType = vm.documentType.id === undefined || !vm.managedocumenttype ? 1 : vm.documentType.id;
            }
          } else {
            idDocumentType = 1
          }
        } else {
          idDocumentType = 0;
        }

        patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {
          vm.viewphoto = true;
          vm.patientDemosDisabled.photo = true;
          vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, false);

          vm.editDisabled = response.data.length === 0;
          if (response.data.length > 0) {
            response.data.forEach(function (demographic, index) {
              if (demographic.idDemographic === -99) {
                vm.idpatient = demographic.value;
              }
              if (demographic.encoded) {
                patientDemosValues[demographic.idDemographic] = {
                  "id": demographic.codifiedId,
                  'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                  'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                  'showValue': demographic.value !== undefined ? demographic.value : ''
                };
              } else {
                patientDemosValues[demographic.idDemographic] = demographic.value;
                if (demographic.idDemographic == vm.staticDemoIds["birthday"]) {
                  //Si el demografico es la fecha de nacimiento calcula la edad
                  patientDemosValues[vm.staticDemoIds["age"]] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                }
              }
              if (vm.permissionuser.editPatients) {
                var findpropertydemografic = _.filter(vm.patient, function (e) {
                  return e.id === demographic.idDemographic
                });
                if (findpropertydemografic.length > 0) {
                  if (findpropertydemografic[0].modify === false) {
                    vm.disabledAllDemo(vm.patientDemosDisabled, demographic.idDemographic, true);
                  }
                }
              } else {
                vm.patientDemos.forEach(function (e) {
                  vm.disabledAllDemo(vm.patientDemosDisabled, e.id, true);
                })
              }
            });
            vm.patientDemosValues = patientDemosValues;
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['lastName'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['surName'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name1'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name2'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['sex'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['birthday'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['age'], true);
            vm.patientDemosDisabled.photo = true;
            setTimeout(function () {
              document.getElementById('demo_' + vm.staticDemoIds['email']).focus();
            }, 100);
          } else {
            vm.patientDemosDisabled.photo = true;
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            setTimeout(function () {
              document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
            }, 100);
          }
          //Logica de Botones

          vm.newDisabled = true;
          vm.cancelDisabled = true;
          vm.saveDisabled = true;
          vm.undoDisabled = true;
          vm.loading = false;
          //Habilita el combo de examenes
          vm.disabledTests = false;
        }, function (error) {
          vm.messageOrder = $filter('translate')('1454');
          UIkit.modal('#orderinvalid').show();
          vm.disabledSave = true;
        });
      }
    }
    /**
     * Evento que busca un paciente por nombre
     */
    function selectedPatientName() {
      vm.patientDemosDisabled[-100] = true;
      if (vm.patientDemosValues[-101].trim() === '' && vm.patientDemosValues[-102].trim() === '' && vm.patientDemosValues[-103].trim() === '' && vm.patientDemosValues[-109].trim() === '' && vm.patientDemosValues[-105].trim() === '') {
        return;
      } else {
        var lastNameToSearch = vm.patientDemosValues[-101] === '' ? ' ' : vm.patientDemosValues[-101];
        var surNameToSearch = vm.patientDemosValues[-102] === '' ? ' ' : vm.patientDemosValues[-102];
        var name1ToSearch = vm.patientDemosValues[-103] === '' ? ' ' : vm.patientDemosValues[-103];
        var name2ToSearch = vm.patientDemosValues[-109] === '' ? ' ' : vm.patientDemosValues[-109];

        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var selectBirthday = moment(vm.patientDemosValues[-105], vm.formatDate, false).isValid() ? vm.patientDemosValues[-105] : 0;
        var birthday = selectBirthday !== 0 ? new Date(moment(selectBirthday, vm.formatDate.toUpperCase())) : 0;
        birthday = birthday !== 0 ? new Date(moment(birthday)).getTime() : 0;

        patientDS.getPatientBYDatapatient(auth.authToken, lastNameToSearch.toUpperCase(), surNameToSearch.toUpperCase(), name1ToSearch.toUpperCase(), name2ToSearch.toUpperCase(), birthday).then(function (data) {
          if (data.status === 200 && data.data.length > 0) {
            vm.patientDemosValues[vm.staticDemoIds['patientId']] = data.data[0].patientId;
            vm.selectedPatientId();
          } else {
            vm.selectedPatientId();
            vm.patientDemosValues[vm.staticDemoIds['patientId']] = '-1';
            vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, false);

            vm.disabledSave = false;
          }
        }, function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        });
      }
    }
    function errorValidOrVerify(error) {
      vm.listtest = [];
      var errortype = true;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            errortype = item[0] === '3' && item[1] === 'test';
            if (item[0] === '3' && item[1] === 'test') {
              var test = {
                'code': item[3],
                'name': item[4],
                'reason': item[5] === '2' ? $filter('translate')('0674') : $filter('translate')('0675')
              }
              vm.listtest.push(test);
            }
          });
          vm.widthGrid = vm.listtest.length > 1 ? 'width: 100%' : 'width: 185%';
          if (errortype) {
            UIkit.modal('#testinvalid').show();
          } else {
            vm.messageOrder = $filter('translate')('0676').replace('@@@@', vm.order);
            UIkit.modal('#orderinvalid').show();
          }
        } else {
          vm.modalError(error);
        }
      } else {
        vm.modalError(error);
      }
      vm.loading = false;
    }
    function verifyPatient(id) {
      //var patientid = id === undefined ? vm.patientDemosValues[-99] : id
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      var datapatient = {
        'orderNumber': vm.order,
        'patient': {
          'id': id
        }
      }
      patientDS.verifyPatientOrder(auth.authToken, datapatient).then(function (response) {
        vm.disabledSave = false;
      }, function (error) {
        vm.disabledSave = true;
        vm.errorValidOrVerify(error);
      });
    }
    /**
     * Valida que el ingreso esta correcto para guardar la orden
     */
    function validateForm() {
      var fieldsComplete = true;
      vm.patient.forEach(function (demo, index) {
        demo.showRequired = false;
        demo.obligatory = demo.name === 'historia' && vm.managehistoryauto ? 0 : demo.obligatory;
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
              if (demo.date === true && vm.patientDemosValues[demo.id] !== null && demo.date === true && vm.patientDemosValues[demo.id] !== '' && demo.date === true && vm.patientDemosValues[demo.id] !== 'Invalid date') {

              } else if (demo.date === true && vm.patientDemosValues[demo.id] === null || demo.date === true && vm.patientDemosValues[demo.id] === '' || demo.date === true && vm.patientDemosValues[demo.id] === 'Invalid date') {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (
                (demo.date === true &&
                  vm.patientDemosValues[demo.id] === null) ||
                (demo.id === -110 && vm.patientDemosValues[demo.id] === null) ||
                (demo.date === true && vm.patientDemosValues[demo.id] === "") ||
                (demo.date === true &&
                  vm.patientDemosValues[demo.id] === "Invalid date")
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (
                vm.patientDemosValues[demo.id] === undefined ||
                vm.patientDemosValues[demo.id].trim() === ""
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              }
            }
          }
        } else if (demo.id === -111 && vm.maskphone !== '' && vm.patientDemosValues[demo.id] !== undefined) {
          if (vm.patientDemosValues[demo.id].length < vm.maskphone.length) {
            demo.showInvalidmask = true;
          } else {
            demo.showInvalidmask = false;
          }
        }
      });
      return fieldsComplete;
    }
    function save() {
      vm.loading = true;
      if (!validateForm()) {
        logger.warning($filter('translate')('0663'));
        vm.loading = false;
        return
      }
      if (vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== null && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== undefined && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== '') {
        vm.updatepatient();
      } else {
        vm.insertpatient();
      }
    }
    function saveOrderpatient(id) {
      var patientid = id === undefined ? vm.patientDemosValues[-99] : id
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datapatient = {
        'orderNumber': vm.order,
        'patient': {
          'id': patientid
        }
      };
      patientDS.changePatientOrder(auth.authToken, datapatient).then(function (response) {
        vm.ListOrder = $filter('filter')(vm.ListOrder, {
          orderNumber: '!' + vm.order
        })
        vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
        vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
        vm.disabledSave = true;
        vm.loading = false;
        logger.success($filter('translate')('0149'));
      },
        function (error) {
          vm.errorValidOrVerify(error);
        });
    }
    function insertpatient() {
      vm.listDemographic = [];
      var birthday = moment(vm.patientDemosValues[-105], vm.formatDateSave).valueOf();
      if (isNaN(birthday)) {
        var datebirthday = moment(vm.patientDemosValues[-105]).format(vm.formatDateSave);
        var birthday = moment(datebirthday, vm.formatDateSave).valueOf()
      }
      var size = vm.managesize ? vm.patientDemosValues[-9] : null;
      var weight = vm.manageweight ? vm.patientDemosValues[-8] : null;
      var race = vm.managerace ? vm.patientDemosValues[-7] : null;
      var documenttype = vm.managedocumenttype ? vm.patientDemosValues[-10] : null;
      vm.patient.forEach(function (value) {
        if (value.id > 0) {
          var demographic = {
            'idDemographic': value.id,
            'notCodifiedValue': value.encoded ? '' : (vm.patientDemosValues[value.id] !== undefined ? vm.patientDemosValues[value.id] : ''),
            'codifiedId': value.encoded ? vm.patientDemosValues[value.id].id : '',
            'encoded': value.encoded
          }
          vm.listDemographic.push(demographic);

        }
      });

      var doc = documenttype === undefined ? null : (!vm.managedocumenttype ? 1 : documenttype.id);
      var patient = {
        'id': null,
        'patientId': vm.patientDemosValues[-100],
        'name1': vm.patientDemosValues[-103],
        'name2': vm.twoNames ? vm.patientDemosValues[-109] : '',
        'lastName': vm.patientDemosValues[-101],
        'surName': vm.twosurnames ? vm.patientDemosValues[-102] : '',
        'sex': {
          'id': vm.patientDemosValues[-104].id,
        },
        'documentType': {
          'id': doc,
        },
        'birthday': birthday,
        'email': vm.patientDemosValues[-106],
        'size': size,
        'weight': weight,
        'phone': vm.patientDemosValues[-111],
        'address': vm.patientDemosValues[-112],
        'lastUpdateUser': {
          'id': 1
        },
        'lastTransaction': null,
        'user': {
          'id': 1
        },
        'race': {
          'id': race === null ? null : race.id
        },
        'demographics': vm.listDemographic

      }

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return patientDS.insertPatient(auth.authToken, patient).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0670'));
          vm.patientDemosValues[vm.staticDemoIds['patientDB']] = data.data.id;
          vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
          vm.savephotopatient(data.data.id);
          vm.saveOrderpatient(data.data.id)
        }

      }, function (error) {
        if (error.data !== null) {
          if (error.data.code === 2) {
            error.data.errorFields.forEach(function (value) {
              var item = value.split('|');
              if (item[0] === '0' && item[1] === 'Patient already exists') {
                UIkit.modal('#validmodal').show();
                vm.cleanform = 1;
                vm.statepatient = 1;
              }
            });
          }
        }


      });
    }

    function updatepatient() {
      vm.listDemographic = [];
      var birthday = moment(vm.patientDemosValues[-105], vm.formatDateSave).valueOf();
      if (isNaN(birthday)) {
        var datebirthday = moment(vm.patientDemosValues[-105]).format(vm.formatDateSave);
        var birthday = moment(datebirthday, vm.formatDateSave).valueOf()
      }
      var size = vm.managesize ? vm.patientDemosValues[-9] : null;
      var weight = vm.manageweight ? vm.patientDemosValues[-8] : null;
      var race = vm.managerace ? vm.patientDemosValues[-7] : null;
      var documenttype = vm.managedocumenttype ? vm.patientDemosValues[-10] : null;
      vm.patient.forEach(function (value) {
        if (value.id > 0) {
          var demographic = {
            'idDemographic': value.id,
            'notCodifiedValue': value.encoded ? '' : (vm.patientDemosValues[value.id] !== undefined ? vm.patientDemosValues[value.id] : ''),
            'codifiedId': value.encoded ? vm.patientDemosValues[value.id].id : '',
            'encoded': value.encoded
          }
          vm.listDemographic.push(demographic);

        }
      });

      var doc = documenttype === undefined ? null : (!vm.managedocumenttype ? 1 : documenttype.id);
      var patient = {
        'id': vm.idpatient,
        'patientId': vm.patientDemosValues[-100],
        'name1': vm.patientDemosValues[-103],
        'name2': vm.twoNames ? vm.patientDemosValues[-109] : '',
        'lastName': vm.patientDemosValues[-101],
        'surName': vm.twosurnames ? vm.patientDemosValues[-102] : '',
        'sex': {
          'id': vm.patientDemosValues[-104].id,
        },
        'documentType': {
          'id': doc,
        },
        'birthday': birthday,
        'email': vm.patientDemosValues[-106],
        'size': size,
        'weight': weight,
        'phone': vm.patientDemosValues[-111],
        'address': vm.patientDemosValues[-112],
        'lastUpdateUser': {
          'id': 1
        },
        'lastTransaction': null,
        'user': {
          'id': 1
        },
        'race': {
          'id': race === null ? null : race.id
        },
        'demographics': vm.listDemographic

      }

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return patientDS.updatePatient(auth.authToken, patient).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0670'));
          vm.patientDemosValues[vm.staticDemoIds['patientDB']] = data.data.id;
          vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
          vm.savephotopatient(data.data.id);
          vm.saveOrderpatient(data.data.id);
        }

      }, function (error) {
        if (error.data !== null) {
          if (error.data.code === 2) {
            error.data.errorFields.forEach(function (value) {
              var item = value.split('|');
              if (item[0] === '0' && item[1] === 'Patient already exists') {
                UIkit.modal('#validmodal').show();
                vm.cleanform = 1;
                vm.statepatient = 1;
              }
            });
          }
        }
      });
    }

    function savephotopatient(id) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datapatient = {
        'id': id,
        'photoInBase64': vm.photopatient
      }
      patientDS.insertphotopatient(auth.authToken, datapatient).then(
        function (response) {
        })
    }
    /**
     * Limpia el valor de todos los demograficos
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
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
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
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
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
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
    function eventCancel() {
      vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
      vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosDisabled = vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], false);
      vm.patientDemosDisabled = vm.disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], false);
      vm.disabledSave = false;
      vm.patientDemosDisabled[-100] = vm.managehistoryauto;
      if (vm.managehistoryauto) {
        vm.patientDemosDisabled[-101] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-102] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-103] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-109] = !vm.managehistoryauto;
        vm.patientDemosDisabled[-105] = !vm.managehistoryauto;
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
    function init() {
      vm.getorder();
      vm.loadDemographicControls();
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
