/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ... 
  PARAMETROS:   order      @descripción
                openmodal  @descripción
                state      @descripción
 
  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/checkmicrobiology/checkmicrobiology.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/growtmicrobiology/growtmicrobiology.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/completeverify/completeverify.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/orderEntry/orderentry.html
 
  MODIFICACIONES:
 
  1. aaaa-mm-dd. Autor
     Comentario...
 
********************************************************************************/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('editdemo', editdemo);

    editdemo.$inject = ['$filter', 'localStorageService', 'orderDS', 'common', '$rootScope', 'orderentryDS', 'logger', 'motiveDS'];

    /* @ngInject */
    function editdemo($filter, localStorageService, orderDS, common, $rootScope, orderentryDS, logger, motiveDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/editdemo.html',
            scope: {
                order: '=?order',
                openmodal: '=openmodal'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.loaddemo = loaddemo;
                vm.init = init;
                vm.setdataorder = setdataorder;
                vm.formatDate = localStorageService.get('FormatoFecha');
                vm.manageweight = localStorageService.get('ManejoPeso');
                vm.managesize = localStorageService.get('ManejoTalla');
                vm.maskphone = localStorageService.get('FormatoTelefono') === null ? '' : localStorageService.get('FormatoTelefono');
                vm.managerace = localStorageService.get('ManejoRaza') === 'True';
                vm.managedocumenttype = localStorageService.get('ManejoTipoDocumento') === 'True';
                vm.managehistoryauto = localStorageService.get('HistoriaAutomatica').toLowerCase() === 'true';
                vm.manageBranch = localStorageService.get('TrabajoPorSede') === 'True';
                vm.manageService = localStorageService.get('ManejoServicio') === 'True';
                vm.manageAccount = localStorageService.get('ManejoCliente') === 'True';
                vm.motiveeditorder = localStorageService.get("MotivoModificacionOrden") === 'True' || localStorageService.get("MotivoModificacionOrden") === null;
                vm.manageRate = localStorageService.get('ManejoTarifa') === 'True';
                vm.manageCashbox = localStorageService.get('Caja') === 'True';
                vm.managePhysician = localStorageService.get('ManejoMedico') === 'True';
                vm.manageDiagnostics = localStorageService.get('Diagnostics') === 'True';
                vm.maxDaysEditOrder = Number(localStorageService.get('DiasMaximoModificarOrden'));
                vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
                vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';
                vm.loadOrder = loadOrder;
                vm.permissionuser = localStorageService.get('user');
                vm.setdataorder = setdataorder;
                vm.loadDemographicControls = loadDemographicControls;
                vm.staticDemoIds = {
                    'patientDB': -99,
                    'patientComment': -997,
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
                    'race': -7, //demografico
                    'orderDB': -998,
                    'orderComment': -996,
                    'order': -107,
                    'orderDate': -108,
                    'orderType': -4, //demografico
                    'rate': -3, //demografico
                    'branch': -5, //demografico
                    'service': -6, //demografico
                    'account': -1, //demografico
                    'physician': -2, //demografico
                    'phone': -111,
                    'address': -112
                };

                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.loaddemo();
                        $scope.openmodal = false;
                    }
                });
                function loaddemo() {
                    vm.order = $scope.order;
                    vm.loadOrder($scope.order)
                }

                vm.init();
                function init() {
                    if (localStorageService.get('turn') !== undefined) {
                        $rootScope.dataturn = localStorageService.get('turn')
                    }
                    vm.loadDemographicControls();
                }


                function loadDemographicControls() {
                    var patientDemosValues = {};
                    var patientDemosDisabled = {};
                    var index = 1;
                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
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
                                value.canCreateItemInOrder = value.canCreateItemInOrder;
                                value.idOrigin = '|' + value.id + 'H';
                                if (!vm.twoNames && value.id === -109 || !vm.twosurnames && value.id === -102) {
                                } else {
                                    patientDemosValues[value.id] = '';
                                    patientDemosDisabled[value.id] = true;
                                    patientDemosDisabled.photo = false;
                                    if (value.encoded) {
                                        value.items.forEach(function (item, indexItem) {
                                            item.canCreateItemInOrder = value.canCreateItemInOrder;
                                            item.idDemo = value.id;
                                            item.showValue = item.code === undefined ? '' : (item.code + '. ' + item.name).toUpperCase();
                                        });
                                    }
                                    demopatient.add(value);
                                }

                                index++;
                            });
                            //Actualiza la vista de paciente
                            vm.patientDemos = demopatient;
                            vm.patientDemosValues = patientDemosValues;
                            vm.patientDemosDisabled = patientDemosDisabled;
                            vm.patientDemosDisabled.photo = false;

                            //Carga la orden
                            var orderDemosValues = {};
                            var orderDemosDisabled = {};
                            orderentryDS.getDemographics(auth.authToken, 'O').then(
                                function (response) {
                                    var databranch = JSON.parse(JSON.stringify(response.data));
                                    var branchauth = _.filter(databranch, function (o) {
                                        o.itemso = _.filter(o.items, function (p) {
                                            return p.id === auth.branch;
                                        });
                                        return o.itemso.length > 0 && o.id === -5;
                                    });
                                    if (branchauth.length !== 0) {
                                        vm.branch = {
                                            id: auth.branch,
                                            code: branchauth[0].itemso[0].code,
                                            name: branchauth[0].itemso[0].name,
                                            showValue: branchauth[0].itemso[0].code + ". " + branchauth[0].itemso[0].name,
                                        };
                                        vm.namebranch = branchauth[0].itemso[0].name;
                                    }
                                    if (auth.orderType.toString() !== "0") {
                                        vm.orderTypeInit = auth.orderType;
                                    }

                                    var datatype = JSON.parse(JSON.stringify(response.data));
                                    var typeauth = _.filter(datatype, function (o) {
                                        o.itemso = _.filter(o.items, function (p) {
                                            return p.id === parseInt(vm.orderTypeInit);
                                        });
                                        return o.itemso.length > 0 && o.id === -4;
                                    });

                                    if (typeauth.length !== 0) {
                                        vm.orderTypeDefault = {
                                            id: parseInt(vm.orderTypeInit),
                                            code: typeauth[0].itemso[0].code,
                                            name: typeauth[0].itemso[0].name,
                                            showValue: typeauth[0].itemso[0].code + ". " + typeauth[0].itemso[0].name,
                                        };
                                    }

                                    response.data.forEach(function (value, key) {
                                        if (value.id === vm.staticDemoIds['orderDate']) {
                                            index--;
                                        }
                                        value.tabIndex = index;
                                        value.name = ($filter('translate')(value.name)).toLowerCase();
                                        value.format = value.format === undefined || value.format === '' ? '' : value.format;
                                        if (value.format !== undefined && value.format !== '') {
                                            if (value.format.search("DATE") === -1) {
                                                value.date = false;
                                            } else {
                                                value.date = true;
                                                value.format = value.format.slice(5);
                                            }
                                        }
                                        value.showRequired = false;
                                        value.idOrigin = '|' + value.id + 'O';
                                        orderDemosValues[value.id] = '';
                                        orderDemosDisabled[value.id] = true;
                                        if (value.encoded) {
                                            value.items.forEach(function (item, indexItem) {
                                                item.idDemo = value.id;
                                                item.showValue = item.code === undefined ? '' : (item.code + '. ' + item.name).toUpperCase();
                                            });
                                        }

                                        if (value.id === vm.staticDemoIds['rate']) {
                                            vm.rates = value.items;
                                        }
                                        index++;
                                    });
                                    //Actualiza la vista de orden
                                    vm.orderDemos = response.data;
                                    vm.orderDemosValues = orderDemosValues;
                                    vm.orderDemosDisabled = orderDemosDisabled;

                                    //Actualiza las vistas simultaneamente
                                    vm.demosAll = [vm.patientDemos, vm.orderDemos];
                                    vm.demoalldepen = _.concat(vm.patientDemos, vm.orderDemos);
                                },
                                function (error) {
                                    vm.Error = error;
                                    vm.ShowPopupError = true;
                                });
                        },
                        function (error) {
                            vm.Error = error;
                            vm.ShowPopupError = true;
                        });
                }

                function loadOrder(order) {
                    vm.loadingdata = true;
                    vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
                    vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
                    vm.selectedTest = [];
                    vm.samples = [];
                    vm.deleteTests = [];
                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
                    orderDS.getOrder(auth.authToken, order).then(
                        function (response) {
                            if (response.status === 200) {
                                vm.getdataorder = response.data;
                                vm.setdataorder(response.data)
                            }
                        },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        }
                    );
                }

                function cleanAllDemos(demos) {
                    var cleanDemos = {};
                    for (var property in demos) {
                        if (demos.hasOwnProperty(property)) {
                            cleanDemos[property] = '';
                        }
                    }
                    return cleanDemos;
                }

                function setdataorder(order, recalled) {
                    vm.loadingdata = false;
                    var orderB = order;
                    var patientDemosValues = {};
                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
                    if (orderB.turn !== undefined && orderB.turn !== '') {
                        var turn = {
                            'number': orderB.turn
                        }
                        $rootScope.dataturn = turn;
                    } else {
                        $rootScope.dataturn = null;
                    }

                    //Carga los datos del paciente
                    patientDemosValues[vm.staticDemoIds['patientDB']] = orderB.patient.id;
                    if (vm.managedocumenttype) {
                        if (orderB.patient.documentType.id !== undefined) {
                            patientDemosValues[vm.staticDemoIds['documentType']] = {
                                'id': orderB.patient.documentType.id,
                                'code': orderB.patient.documentType.abbr.toUpperCase(),
                                'name': orderB.patient.documentType.name.toUpperCase(),
                                'showValue': orderB.patient.documentType.id === 1 ? '' : orderB.patient.documentType.abbr.toUpperCase() + '. ' + orderB.patient.documentType.name.toUpperCase()
                            };
                        } else {
                            patientDemosValues[vm.staticDemoIds['documentType']] = {
                                'id': 0,
                                'code': '',
                                'name': '',
                                'showValue': ''
                            };
                        }
                    }
                    patientDemosValues[vm.staticDemoIds['patientId']] = orderB.patient.patientId;
                    patientDemosValues[vm.staticDemoIds['lastName']] = orderB.patient.lastName;
                    patientDemosValues[vm.staticDemoIds['surName']] = orderB.patient.surName;
                    patientDemosValues[vm.staticDemoIds['name1']] = orderB.patient.name1;
                    patientDemosValues[vm.staticDemoIds['name2']] = orderB.patient.name2;
                    patientDemosValues[vm.staticDemoIds['phone']] = orderB.patient.phone;
                    patientDemosValues[vm.staticDemoIds['sex']] = {
                        'id': orderB.patient.sex.id,
                        'code': orderB.patient.sex.code.toUpperCase(),
                        'name': orderB.patient.sex.esCo.toUpperCase(),
                        'showValue': orderB.patient.sex.code.toUpperCase() + '. ' + orderB.patient.sex.esCo.toUpperCase()
                    };
                    patientDemosValues[vm.staticDemoIds['birthday']] = moment(orderB.patient.birthday).format(vm.formatDate.toUpperCase());
                    patientDemosValues[vm.staticDemoIds['age']] = common.getAge(moment(orderB.patient.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                    patientDemosValues[vm.staticDemoIds['email']] = orderB.patient.email;
                    patientDemosValues[vm.staticDemoIds['address']] = orderB.patient.address;
                    if (vm.manageweight) {
                        patientDemosValues[vm.staticDemoIds['weight']] = orderB.patient.weight;
                    }
                    if (vm.managesize) {
                        patientDemosValues[vm.staticDemoIds['size']] = orderB.patient.size;
                    }
                    if (vm.managerace) {
                        if (orderB.patient.race !== undefined && orderB.patient.race.id !== undefined) {
                            patientDemosValues[vm.staticDemoIds['race']] = {
                                'id': orderB.patient.race.id,
                                'code': orderB.patient.race.code.toUpperCase(),
                                'name': orderB.patient.race.name.toUpperCase(),
                                'showValue': orderB.patient.race.code.toUpperCase() + '. ' + orderB.patient.race.name.toUpperCase()
                            };
                        }
                    }
                    orderB.patient.demographics.forEach(function (demographic, index) {
                        if (demographic.encoded) {
                            patientDemosValues[demographic.idDemographic] = {
                                'id': demographic.codifiedId,
                                'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                'showValue': demographic.value !== undefined ? demographic.codifiedCode.toUpperCase() + '. ' + demographic.codifiedName.toUpperCase() : ''
                            };
                        } else {
                            patientDemosValues[demographic.idDemographic] = demographic.value;
                        }
                    });
                    //Carga los datos de la orden
                    var orderDemosValues = {};
                    orderDemosValues.turn = orderB.turn;
                    orderDemosValues[vm.staticDemoIds['orderDB']] = recalled === undefined ? orderB.orderNumber : '';
                    orderDemosValues[vm.staticDemoIds['order']] = recalled === undefined ? orderB.orderNumber : ''; //Number(('' + orderB.orderNumber).substring(4));
                    orderDemosValues[vm.staticDemoIds['orderDate']] = recalled === undefined ? moment(orderB.createdDate).format(vm.formatDate.toUpperCase() + ' HH:mm:ss') : '';
                    orderDemosValues[vm.staticDemoIds['orderType']] = {
                        'id': orderB.type.id,
                        'code': orderB.type.code,
                        'name': orderB.type.name,
                        'showValue': orderB.type.code + '. ' + orderB.type.name
                    };

                    orderDemosValues[vm.staticDemoIds['branch']] = {
                        'id': orderB.branch.id,
                        'code': orderB.branch.code,
                        'name': orderB.branch.name,
                        'showValue': orderB.branch.id === undefined ? '' : (orderB.branch.code + '. ' + orderB.branch.name)
                    };


                    if (vm.manageService) {
                        orderDemosValues[vm.staticDemoIds['service']] = {
                            'id': orderB.service.id,
                            'code': orderB.service.code,
                            'name': orderB.service.name,
                            'showValue': orderB.service.id === undefined ? '' : (orderB.service.code + '. ' + orderB.service.name)
                        };
                    }

                    if (vm.manageAccount) {
                        orderDemosValues[vm.staticDemoIds['account']] = {
                            'id': orderB.account.id,
                            'code': orderB.account.nit,
                            'name': orderB.account.name,
                            'showValue': orderB.account.id === undefined ? '' : (orderB.account.nit + '. ' + orderB.account.name)
                        };
                    }

                    if (vm.manageRate) {
                        orderDemosValues[vm.staticDemoIds['rate']] = {
                            'id': orderB.rate.id,
                            'code': orderB.rate.code,
                            'name': orderB.rate.name,
                            'showValue': orderB.rate.id === undefined ? '' : (orderB.rate.code + '. ' + orderB.rate.name)
                        };
                    }

                    if (vm.managePhysician) {
                        orderDemosValues[vm.staticDemoIds['physician']] = {
                            'id': orderB.physician.id,
                            'code': orderB.physician.code,
                            'name': orderB.physician.name,
                            'showValue': orderB.physician.id === undefined ? '' : (orderB.physician.code + '. ' + orderB.physician.name)
                        };

                    }

                    orderB.demographics.forEach(function (demographic, index) {
                        if (demographic.encoded) {
                            orderDemosValues[demographic.idDemographic] = {
                                'id': demographic.codifiedId,
                                'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                'showValue': demographic.value !== undefined ? demographic.codifiedCode.toUpperCase() + '. ' + demographic.codifiedName.toUpperCase() : ''
                            };
                        } else {
                            orderDemosValues[demographic.idDemographic] = demographic.value;
                        }
                    });
                    var selectedTest = [];
                    orderB.resultTest.forEach(function (test, index) {
                        var itemtest = {
                            'id': recalled === undefined ? test.testId : test.id,
                            'code': recalled === undefined ? test.testCode : test.code,
                            'name': recalled === undefined ? test.testName.toUpperCase() : test.name,
                            'rate': vm.manageRate && (test.billing !== undefined || recalled === true) ? {
                                'id': recalled === undefined ? test.billing.rate.id : test.rate.id,
                                'code': recalled === undefined ? test.billing.rate.code : test.rate.code,
                                'name': recalled === undefined ? test.billing.rate.name : test.rate.name,
                                'showValue': recalled === undefined ? test.billing.rate.code + '. ' + test.billing.rate.name : test.rate.code + '. ' + test.rate.name
                            } : '',
                            'price': vm.manageRate && (test.billing !== undefined || recalled === true) ? recalled === true ? test.price : test.billing.servicePrice : 0,
                            'insurancePrice': vm.manageRate && (test.billing !== undefined || recalled === true) ? recalled === true ? test.price : test.billing.insurancePrice : 0,
                            'patientPrice': vm.manageRate && (test.billing !== undefined || recalled === true) ? recalled === true ? test.price : test.billing.patientPrice : 0,
                            'state': test.state,
                            'sample': { id: test.sampleId },
                            'type': test.testType,
                            'testType': test.testType,
                            'resultValidity': null,
                            'billing': test.billing,
                            'validatedChilds': test.validatedChilds
                        }
                        selectedTest.push(itemtest)
                        vm.comparetest = _.clone(selectedTest);
                    });


                    //Carga las variables de la vista
                    vm.patientDemosValues = patientDemosValues;
                    vm.orderDemosValues = orderDemosValues;

                    vm.compareorder = _.clone(vm.orderDemosValues);
                    vm.comparepatient = _.clone(vm.patientDemosValues);

                    //Valida los días máximos configurados para editar una orden.
                    var datePast = moment(vm.orderDemosValues[vm.staticDemoIds['orderDB']].toString().substr(0, 8), 'YYYYMMDD');
                    var dateNow = moment();
                    var diff = dateNow.diff(datePast, 'days');
                    if (vm.maxDaysEditOrder !== -1 && !auth.administrator) {
                        if (diff > vm.maxDaysEditOrder) {
                            vm.messageNotSave = $filter('translate')('0952').replace('@@@@', vm.orderDemosValues[vm.staticDemoIds['orderDB']].toString()).replace('##', diff.toString()).replace('%%', vm.maxDaysEditOrder.toString());
                            vm.numError = '9';
                            UIkit.modal("#logErrorTest", {
                                modal: false,
                                keyboard: false,
                                bgclose: false,
                                center: true,
                            }).show();
                            vm.loading = false;
                            return;
                        }
                    }


                    //Habilita los datos del paciente
                    var patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, false);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['documentType'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['patientId'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['lastName'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['surName'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['name1'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['name2'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['sex'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['birthday'], true);
                    patientDemosDisabled = disabledDemo(patientDemosDisabled, vm.staticDemoIds['age'], true);


                    vm.patientDemosDisabled = patientDemosDisabled;
                    vm.patientDemosDisabled.photo = true;

                    if (vm.permissionuser.editPatients) {
                        var findpropertydemografic = _.filter(vm.patientDemos, function (e) {
                            return e.modify === false
                        });
                        if (findpropertydemografic.length > 0) {
                            findpropertydemografic.forEach(function (e) {
                                disabledDemo(vm.patientDemosDisabled, e.id, true);
                            })
                        }
                    } else {
                        vm.patientDemos.forEach(function (e) {
                            disabledDemo(vm.patientDemosDisabled, e.id, true);
                        })
                    }
                    //Habilita los datos de la orden
                    var orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, false);
                    orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['order'], true);
                    orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['orderDate'], true);
                    orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['rate'], true);
                    orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['account'], true);

                    vm.orderDemosDisabled = orderDemosDisabled;

                    var findpropertydemografic = _.filter(vm.orderDemos, function (e) {
                        return e.modify === false
                    });
                    if (findpropertydemografic.length > 0) {
                        findpropertydemografic.forEach(function (e) {
                            disabledDemo(orderDemosDisabled, e.id, true);
                        })
                    }
                    UIkit.modal('#modal_editdemo').show();
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
                                        patient.surName = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null)
                                    } else if (demo.id === vm.staticDemoIds['name1']) {
                                        patient.name1 = vm.patientDemosValues[demo.id].toUpperCase();
                                    } else if (demo.id === vm.staticDemoIds['name2']) {
                                        patient.name2 = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null)
                                    } else if (demo.id === vm.staticDemoIds['birthday']) {
                                        var birthday = moment(vm.patientDemosValues[demo.id], vm.formatDate.toUpperCase()).valueOf();
                                        if (isNaN(birthday)) {
                                            var datebirthday = moment(vm.patientDemosValues[demo.id]).format(vm.formatDate.toUpperCase());
                                            var birthday = moment(datebirthday, vm.formatDate.toUpperCase()).valueOf()
                                        }
                                        patient.birthday = birthday;
                                    } else if (demo.id === vm.staticDemoIds['email']) {
                                        patient.email = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else if (demo.id === vm.staticDemoIds['weight']) {
                                        patient.weight = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else if (demo.id === vm.staticDemoIds['size']) {
                                        patient.size = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else if (demo.id === vm.staticDemoIds['patientComment']) {
                                        patient.diagnostic = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else if (demo.id === vm.staticDemoIds['phone']) {
                                        patient.phone = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else if (demo.id === vm.staticDemoIds['address']) {
                                        patient.address = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null)
                                    } else {
                                        if (demo.date === true) {
                                            if (vm.patientDemosValues[demo.id] !== '') {
                                                var format = demo.format === '' ? vm.formatDate.toUpperCase() : demo.format.toUpperCase();
                                                var demodate = moment(vm.patientDemosValues[demo.id], format).valueOf();
                                                if (isNaN(demodate)) {
                                                    vm.patientDemosValues[demo.id] = moment(vm.patientDemosValues[demo.id]).format(format);
                                                } else {
                                                    vm.patientDemosValues[demo.id] = moment(demodate).format(format);
                                                }
                                            }
                                        }
                                        if (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== 'Invalid date' && vm.patientDemosValues[demo.id] !== null && vm.patientDemosValues[demo.id] !== '') {
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
                                            } else if (demo.id > 0) {
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
                 * Obtiene los datos de la orden del formulario
                 */
                function getOrderData() {
                    var order = {};
                    var orderDemographics = [];
                    order.createdDateShort = Number(moment().format('YYYYMMDD'));
                    order.fatherOrder = vm.fatherOrderRecall;
                    vm.orderDemos.forEach(function (demo, index) {
                        if (vm.orderDemosValues.hasOwnProperty(demo.id)) {
                            if (demo.encoded) {
                                if (demo.id === vm.staticDemoIds['orderType']) {
                                    order.type = {
                                        'id': vm.orderDemosValues[demo.id].id,
                                        'code': vm.orderDemosValues[demo.id].code
                                    };
                                } else if (demo.id === vm.staticDemoIds['branch']) {
                                    order.branch = {
                                        'id': vm.orderDemosValues[demo.id].id
                                    };
                                } else if (demo.id === vm.staticDemoIds['account']) {
                                    order.account = {
                                        'id': vm.orderDemosValues[demo.id].id
                                    };
                                } else if (demo.id === vm.staticDemoIds['physician']) {
                                    order.physician = {
                                        'id': vm.orderDemosValues[demo.id].id
                                    };
                                } else if (demo.id === vm.staticDemoIds['rate']) {
                                    order.rate = {
                                        'id': vm.orderDemosValues[demo.id].id
                                    };
                                } else if (demo.id === vm.staticDemoIds['service']) {
                                    order.service = {
                                        'id': vm.orderDemosValues[demo.id].id
                                    };
                                } else {
                                    if (typeof vm.orderDemosValues[demo.id] === 'object' && vm.orderDemosValues[demo.id].hasOwnProperty('id')) {
                                        orderDemographics.push({
                                            'idDemographic': demo.id,
                                            'encoded': true,
                                            'notCodifiedValue': '',
                                            'codifiedId': vm.orderDemosValues[demo.id].id
                                        });
                                    }
                                }
                            } else {
                                if (demo.date === true) {
                                    if (vm.orderDemosValues[demo.id] !== '') {
                                        var format = demo.format === '' ? vm.formatDate.toUpperCase() : demo.format.toUpperCase();
                                        var demodate = moment(vm.orderDemosValues[demo.id], format).valueOf();
                                        if (isNaN(demodate)) {
                                            vm.orderDemosValues[demo.id] = moment(vm.orderDemosValues[demo.id]).format(format);
                                        } else {
                                            vm.orderDemosValues[demo.id] = moment(demodate).format(format);
                                        }
                                    }
                                }
                                if (demo.id === vm.staticDemoIds['order']) {
                                    order.orderNumber = (vm.orderDemosValues[demo.id] !== undefined && vm.orderDemosValues[demo.id] !== '' ? vm.orderDemosValues[demo.id] : null);
                                } else if (demo.id === vm.staticDemoIds['orderDate']) {
                                    order.date = '';
                                } else {
                                    if (vm.orderDemosValues[demo.id] !== undefined && vm.orderDemosValues[demo.id] !== 'Invalid date' && vm.orderDemosValues[demo.id] !== null && vm.orderDemosValues[demo.id] !== '') {
                                        orderDemographics.push({
                                            'idDemographic': demo.id,
                                            'encoded': false,
                                            'notCodifiedValue': vm.orderDemosValues[demo.id],
                                            'codifiedId': ''
                                        });
                                    } else {
                                        orderDemographics.push({
                                            'idDemographic': demo.id,
                                            'encoded': false,
                                            'notCodifiedValue': '',
                                            'codifiedId': ''
                                        });
                                    }
                                }
                            }
                        } else {
                            if (demo.id !== -996) {
                                orderDemographics.push({
                                    'idDemographic': demo.id,
                                    'encoded': demo.encoded,
                                    'notCodifiedValue': '',
                                    'codifiedId': ''
                                });
                            } else {
                                order.comment = (vm.orderDemosValues[demo.id] !== undefined && vm.orderDemosValues[demo.id] !== '' ? vm.orderDemosValues[demo.id] : null);
                            }
                        }
                    });

                    order.demographics = orderDemographics;
                    order.orderNumber = order.orderNumber === null ? null : moment().format('YYYY') + order.orderNumber;
                    return order;
                }


                vm.eventSave = eventSave;
                function eventSave() {
                    vm.dimensions = ' width: 512px; height: 185px;';
                    vm.loading = true;
                    if (validateForm()) {
                        //Se obtiene la informacion del paciente
                        var patient = getPatientData();
                        //Se obtiene la informacion de la orden
                        var order = getOrderData();
                        //Se obtienen los examenes de la orden
                        order.listDiagnostic = vm.getdataorder.listDiagnostic;
                        order.patient = patient;
                        order.tests = vm.comparetest;
                        order.deleteTests = [];
                        order.orderNumber = vm.getdataorder.orderNumber;
                        if ((JSON.stringify(vm.orderDemosValues) === JSON.stringify(vm.compareorder)) && (JSON.stringify(vm.patientDemosValues) === JSON.stringify(vm.comparepatient))) {
                            UIkit.modal('#modal_editdemo').hide();
                        } else if (!vm.motiveeditorder) {
                            if (JSON.stringify(vm.patientDemosValues) === JSON.stringify(vm.comparepatient)) {
                                order.patient.updatePatient = false;
                            }
                            else {
                                order.patient.updatePatient = true;
                            }
                            var auth = localStorageService.get("Enterprise_NT.authorizationData");
                            orderDS.updateOrder(auth.authToken, order).then(
                                function (data) {
                                    if (data.status === 200) {
                                        vm.loading = false;
                                        UIkit.modal('#modal_editdemo').hide();
                                        logger.success($filter("translate")("3070"));
                                    }
                                },
                                function (error) {
                                    vm.loading = false;
                                    if (error.data !== null && error.data !== undefined) {
                                        if (error.data.errorFields === undefined) {
                                            vm.messageNotSave = error.data.message;
                                        } else {
                                            if (error.data.errorFields[0] === '1' && error.data.errorFields[1] === 'sample') {
                                                vm.messageNotSave = 'Realice la configuración de la muestra';
                                            } else {
                                                vm.numError = error.data.errorFields[0]
                                                    .split("|")[0]
                                                    .toString();
                                                vm.messageNotSave =
                                                    vm.numError === "1" ?
                                                        $filter("translate")("0800") :
                                                        $filter("translate")("0331");
                                                if (vm.numError === "6") {
                                                    if (error.data.errorFields[0].split("|").length === 3) {
                                                        vm.dimensions = " width: 512px; height: 350px;";
                                                        error.data.errorFields.forEach(function (value) {
                                                            var cod = _.filter(vm.tests, function (v) {
                                                                return v.id === parseInt(value.split("|")[2]);
                                                            })[0].code;
                                                            var name = _.filter(vm.tests, function (v) {
                                                                return v.id === parseInt(value.split("|")[2]);
                                                            })[0].name;
                                                            vm.listError.push({
                                                                test: cod + ". " + name,
                                                            });
                                                        });
                                                    } else {
                                                        vm.numError = "06";
                                                        vm.messageNotTittle = $filter("translate")("0061");
                                                        vm.messageNotSave = $filter("translate")("1443");
                                                    }
                                                } else if (vm.numError === "5") {
                                                    vm.messageNotTittle = $filter("translate")("0061");
                                                    vm.messageNotSave = $filter("translate")("1142");
                                                } else if (vm.numError === "4") {
                                                    vm.messageNotTittle = $filter("translate")("0061");
                                                    vm.messageNotSave = $filter("translate")("1442");
                                                }
                                            }
                                        }
                                        UIkit.modal("#logErrorTest", {
                                            modal: false,
                                            keyboard: false,
                                            bgclose: false,
                                            center: true,
                                        }).show();
                                    }
                                }
                            );
                        } else if (vm.motiveeditorder) {
                            vm.editmotiveorder = order;
                            vm.Comment = '';
                            vm.motive = { id: -1 };
                            var auth = localStorageService.get("Enterprise_NT.authorizationData");
                            return motiveDS.getMotiveByState(auth.authToken).then(
                                function (data) {
                                    if (data.status === 200) {
                                        vm.listMotives = _.filter(data.data, function (m) {
                                            return m.type.id === 15;
                                        });
                                        UIkit.modal("#editmodal", {
                                            modal: false,
                                            keyboard: false,
                                            bgclose: false,
                                            center: true,
                                        }).show();
                                    } else {
                                        logger.error($filter("translate")("1619"));
                                    }
                                    vm.loading = false;
                                },
                                function (error) {
                                    vm.modalError(error);
                                    vm.loading = false;
                                }
                            );
                        }
                    } else {
                        vm.loading = false;
                        logger.warning($filter("translate")("1620"));
                    }
                }

                vm.motiveeditsave = motiveeditsave;

                function motiveeditsave() {
                    vm.loading = true;
                    vm.editmotiveorder.idMotive = vm.motive.id;
                    vm.editmotiveorder.commentary = vm.Comment;
                    UIkit.modal("#editmodal").hide();
                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
                    if (JSON.stringify(vm.patientDemosValues) === JSON.stringify(vm.comparepatient)) {
                        vm.editmotiveorder.patient.updatePatient = false;
                    }
                    else {
                        vm.editmotiveorder.patient.updatePatient = true;
                    }
                    orderDS.updateOrder(auth.authToken, vm.editmotiveorder).then(
                        function (data) {
                            if (data.status === 200) {
                                vm.loading = false;
                                UIkit.modal('#modal_editdemo').hide();
                                logger.success($filter("translate")("3070"));
                            }
                        },
                        function (error) {
                            vm.loading = false;
                            if (error.data !== null && error.data !== undefined) {
                                if (error.data.errorFields === undefined) {
                                    vm.messageNotSave = error.data.message;
                                } else {
                                    vm.numError = error.data.errorFields[0]
                                        .split("|")[0]
                                        .toString();
                                    vm.messageNotSave =
                                        vm.numError === "1" ?
                                            $filter("translate")("0800") :
                                            $filter("translate")("0331");
                                    if (vm.numError === "6") {
                                        if (error.data.errorFields[0].split("|").length === 3) {
                                            vm.dimensions = " width: 512px; height: 350px;";
                                            error.data.errorFields.forEach(function (value) {
                                                var cod = _.filter(vm.tests, function (v) {
                                                    return v.id === parseInt(value.split("|")[2]);
                                                })[0].code;
                                                var name = _.filter(vm.tests, function (v) {
                                                    return v.id === parseInt(value.split("|")[2]);
                                                })[0].name;
                                                vm.listError.push({
                                                    test: cod + ". " + name,
                                                });
                                            });
                                        } else {
                                            vm.numError = "06";
                                            vm.messageNotTittle = $filter("translate")("0061");
                                            vm.messageNotSave = $filter("translate")("1443");
                                        }
                                    } else if (vm.numError === "5") {
                                        vm.messageNotTittle = $filter("translate")("0061");
                                        vm.messageNotSave = $filter("translate")("1142");
                                    } else if (vm.numError === "4") {
                                        vm.messageNotTittle = $filter("translate")("0061");
                                        vm.messageNotSave = $filter("translate")("1442");
                                    }
                                }
                                UIkit.modal("#logErrorTest", {
                                    modal: false,
                                    keyboard: false,
                                    bgclose: false,
                                    center: true,
                                }).show();
                            }
                        }
                    );
                }

                /**
               * Valida que el ingreso esta correcto para guardar la orden
               */
                function validateForm() {
                    var fieldsComplete = true;
                    vm.patientDemos.forEach(function (demo, index) {
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
                                    } else if (vm.patientDemosValues[demo.id] === undefined || vm.patientDemosValues[demo.id] === null) {
                                        demo.showRequired = true;
                                        fieldsComplete = false;
                                    } else if (vm.patientDemosValues[demo.id].trim() === '') {
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

                    vm.orderDemos.forEach(function (demo, index) {
                        demo.showRequired = false;
                        if (demo.obligatory === 1) {
                            if (vm.orderDemosValues.hasOwnProperty(demo.id)) {
                                if (demo.encoded) {
                                    if (typeof vm.orderDemosValues[demo.id] !== 'object') {
                                        demo.showRequired = true;
                                        fieldsComplete = false;
                                    } else {
                                        if (!vm.orderDemosValues[demo.id].hasOwnProperty('id')) {
                                            demo.showRequired = true;
                                            fieldsComplete = false;
                                        } else if (vm.orderDemosValues[demo.id].id === undefined) {
                                            demo.showRequired = true;
                                            fieldsComplete = false;
                                        }
                                    }
                                } else {
                                    if (demo.id === -107) {
                                        if (vm.orderDemosValues[-4].id === 4) { } else if (vm.orderDemosValues[demo.id] === undefined || vm.orderDemosValues[demo.id].toString().trim() === '') {
                                            demo.showRequired = true;
                                            fieldsComplete = false;
                                        }
                                    } else if (demo.date === true && vm.orderDemosValues[demo.id] !== null && demo.date === true && vm.orderDemosValues[demo.id] !== '' && demo.date === true && vm.orderDemosValues[demo.id] !== 'Invalid date') {

                                    } else if (demo.date === true && vm.orderDemosValues[demo.id] === null || demo.date === true && vm.orderDemosValues[demo.id] === '' || demo.date === true && vm.orderDemosValues[demo.id] === 'Invalid date') {
                                        demo.showRequired = true;
                                        fieldsComplete = false;
                                    } else if (vm.orderDemosValues[demo.id] === undefined || vm.orderDemosValues[demo.id].toString().trim() === '') {
                                        demo.showRequired = true;
                                        fieldsComplete = false;
                                    }
                                }
                            }
                        }
                    });
                    return fieldsComplete;
                }


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
                function disabledAllDemo(demos, disabled) {
                    var disabledDemos = {};
                    for (var property in demos) {
                        if (demos.hasOwnProperty(property)) {
                            disabledDemos[property] = disabled;
                        }
                    }
                    return disabledDemos;
                }

            }],
            controllerAs: 'editdemo'
        };
        return directive;
    }
})();
/* jshint ignore:end */
