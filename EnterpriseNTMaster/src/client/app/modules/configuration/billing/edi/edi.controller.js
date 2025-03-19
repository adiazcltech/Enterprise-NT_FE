(function () {
    'use strict';

    angular
    .module('app.edi')
    .controller('EdiController', EdiController);

    EdiController.$inject = ['rateDS', 'receiversDS', 'ModalService',
    'configurationDS', '$http', 'localStorageService', 'logger',
    'authService', '$filter', '$state', 'moment', '$rootScope','LZString', '$translate'];

    function EdiController(rateDS, receiversDS, ModalService, configurationDS,
     $http, localStorageService, logger, authService,
      $filter, $state, moment, $rootScope,LZString, $translate) {
        var vm = this;
        $rootScope.menu = true;
        $rootScope.blockView = true;
        vm.init = init;
        vm.title = 'Edi';
        vm.sortReverse = true;
        vm.sortType = 'name';
        vm.selected = -1;
        vm.selected1 = -1;
        vm.Detail = [];
        vm.isDisabled = true;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabledState = true;
        vm.isAuthenticate = isAuthenticate;
        vm.get = get;
        vm.getId = getId;
        vm.New = New;
        vm.Edit = Edit;
        vm.changeState = changeState;
        vm.cancel = cancel;
        vm.insert = insert;
        vm.update = update;
        vm.save = save;
        vm.modalError = modalError;
        vm.removeData = removeData;
        vm.stateButton = stateButton;
        vm.generateFile = generateFile;
        var auth;
        vm.Repeat = false;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.private = [];
        vm.Estado = [];
        vm.getreceiver = getreceiver;
        vm.state = true;
        vm.data = [];
        vm.datareceiver = [];
        vm.modalrequired = modalrequired;
        vm.windowOpenReport=windowOpenReport;
        vm.loadingdata = true;
        vm.claimType = [
             { id: 1, name: $filter('translate')('0399') },
             { id: 2, name: $filter('translate')('0400') },
             { id: 3, name: $filter('translate')('0401') }
        ];
        vm.transactionType = [
            { id: 1, name: $filter('translate')('0402') },
            { id: 2, name: $filter('translate')('0403') }
        ];

        //** Metodo que elimina los elementos sobrantes en la grilla**//
        function removeData(data) {
            var Private = [];
            var Estado = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            data.data.forEach(function (value, key) {
                if (value.typePayer === 1) {
                    var object = {
                        id: value.id,
                        name: value.name
                    };
                    Private.push(object);
                }
                if (value.typePayer === 2) {
                    var object = {
                        id: value.id,
                        name: value.name
                    };
                    Estado.push(object);
                }
                delete value.user;
                delete value.lastTransaction;
                delete value.address;
                delete value.addAddress;
                delete value.city;
                delete value.department;
                delete value.phone;
                delete value.email;
                delete value.postalCode;
                delete value.webPage;
                delete value.showPriceInEntry;
                delete value.checkPaid;
                delete value.assingAllAccounts;
                delete value.applyDiagnostics;
                delete value.checkCPTRelation;
                delete value.homebound;
                delete value.venipunture;
                delete value.applyTypePayer;
                delete value.claimCode;
                delete value.eligibility;
                delete value.interchangeSender;
                delete value.interchangeQualifier;
                delete value.applicationSendCode;
                delete value.labSubmitter;
                delete value.identificationPayer;
                delete value.formatMemberId;
                delete value.receiver;
                delete value.consecutive;
                delete value.outputFileName;
                delete value.claimType;
                delete value.transactionType;
                delete value.supplierSignature;
                delete value.assingBenefits;
                delete value.electronicClaim;
                delete value.defaultItem;
                data.data[key].username = auth.userName;
            });

            vm.private = Private;
            vm.Estado = Estado;
            return data.data;
        }
        //** Metodo configuración formato**//
        function getConfigurationFormatDate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
                vm.getreceiver();
                if (data.status === 200) {
                    vm.formatDate = data.data.value.toUpperCase();
                }
            }, function (error) {
                if (vm.errorservice === 0) {
                    vm.modalError(error);
                    vm.errorservice = vm.errorservice + 1;
                }
            });
        }
        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }
        //** Metodo que habilita y desabilita los botones**//
        function stateButton(state) {
            if (state === 'init') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
            }
            if (state === 'add') {
                vm.isDisabledAdd = true;
                vm.isDisabledEdit = true;
                vm.isDisabledSave = false;
                vm.isDisabledCancel = false;
                vm.isDisabledPrint = true;
                vm.isDisabled = false;
            }
            if (state === 'edit') {
                vm.isDisabledState = false;
                vm.isDisabledAdd = true;
                vm.isDisabledEdit = true;
                vm.isDisabledSave = false;
                vm.isDisabledCancel = false;
                vm.isDisabledPrint = true;
                vm.isDisabled = false;
                setTimeout(function(){ document.getElementById('code').focus() }, 100);
            }
            if (state === 'insert') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
            }
            if (state === 'update') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
            }
        }
        //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
        function New(form) {
            form.$setUntouched();
            vm.usuario = '';
            vm.selected = -1;
            vm.selected1 = -1;
            vm.Detail = {
                'user': {
                    'id': auth.id
                },
                'id': null,
                'name': '',
                'state': true
            };
            vm.stateButton('add');
        }
        //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
        function cancel(Form) {
            vm.Repeat = false;
            Form.$setUntouched();
            if (vm.Detail.id === null || vm.Detail.id === undefined) {
                vm.Detail = [];
            } else {
                if (vm.selected === -1) {

                    vm.getId(vm.Detail.id, vm.selected1, Form);

                } else { vm.getId(vm.Detail.id, vm.selected, Form); }

            }
            vm.stateButton('init');
        }
        //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
        function Edit() {
            vm.stateButton('edit');
        }
        //** Método que evalua si se  va crear o actualizar**//
        function save(Form) {
            Form.$setUntouched();
            if (vm.Detail.id === null) {
                vm.insert();
            }
            else {
                vm.update();
            }
        }
        //** Método se comunica con el dataservice e inserta**//
        function insert() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Detail.receiver=vm.Detail.receiver1.id;
            vm.Detail.nameReceiver=vm.Detail.receiver1.name;
            return rateDS.New(auth.authToken, vm.Detail).then(function (data) {
                if (data.status === 200) {
                    vm.get();
                    vm.Detail = data.data;
                    vm.stateButton('insert');
                    logger.success($filter('translate')('0042'));
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Método se comunica con el dataservice y actualiza**//
        function update() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Detail.user.id = auth.id;
            vm.Detail.receiver=vm.Detail.receiver1.id;
            vm.Detail.nameReceiver=vm.Detail.receiver1.name;
            return rateDS.update(auth.authToken, vm.Detail).then(function (data) {
                if (data.status === 200) {
                    vm.get();
                    logger.success($filter('translate')('0042'));
                    vm.stateButton('update');
                    return data;
                }

            }, function (error) {
                vm.modalError(error);

            });
        }
        //** Método para sacar el popup de error**//
        function modalError(error) {
            vm.loadingdata = false;
            if (error.data !== null) {
                if (error.data.code === 2) {
                    error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        if (item[0] === '1' && item[1] === 'name') {
                            vm.Repeat = true;
                        }
                    });
                }
            }
            if (vm.Repeat === false) {
                vm.Error = error;
                vm.ShowPopupError = true;
            }
        }
        //** Método muestra un popup de confirmación para el cambio de estado**//
        function changeState() {
            if (!vm.isDisabledState) {
                vm.ShowPopupState = true;
            }
        }
        //** Método que obtiene la lista para llenar la grilla**//
        function get() {
            auth = localStorageService.get('Enterprise_NT.authorizationData');
            return rateDS.getpayers(auth.authToken).then(function (data) {
                vm.data = data.data.length === 0 ? data.data : removeData(data);
                vm.loadingdata = false;
                vm.modalrequired();
                return vm.data;
            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Método se comunica con el dataservice y trae los datos por el id**//
        function getId(id, index, Form) {
            vm.Repeat = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.selected = index;
            vm.selected1 = index;
            vm.Detail = [];
            Form.$setUntouched();
            vm.loadingdata = true;
            return rateDS.getId(auth.authToken, id).then(function (data) {
                if (data.status === 200) {
                    vm.usuario = $filter('translate')('0017') + ' ';
                    vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
                    vm.usuario = vm.usuario + data.data.user.userName;
                    vm.Detail = data.data;
                    vm.Detail.receiver1= $filter('filter')(vm.datareceiver, { id: data.data.receiver })[0];
                    vm.loadingdata = false;
                    vm.stateButton('update');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        //función que obtiene la lista de Receptores
        function getreceiver() {
            auth = localStorageService.get('Enterprise_NT.authorizationData');
            return receiversDS.getstate(auth.authToken, true).then(function (data) {
                vm.datareceiver = data.data;
                vm.get();
                return vm.datareceiver;
            }, function (error) {
                vm.errorservice = vm.errorservice + 1;
                vm.modalError(error);
            });
        }
        //** Ventana modal de los requeridos**//
        function modalrequired() {
            if (vm.datareceiver.length === 0 || vm.data.length === 0) {
                ModalService.showModal({
                    templateUrl: 'Requerido.html',
                    controller: 'EdidependenceController',
                    inputs: {
                        reciverhide: vm.datareceiver.length,
                        ratehide: vm.data.length
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $state.go(result.page);
                    });
                });

            }
        }
        //** Método  para imprimir el reporte**//  
        function generateFile() {
             if(vm.data.length===0){
                vm.open=true;
            }else{
            vm.variables = {};
            vm.datareport = vm.data;
            vm.pathreport = '/report/configuration/billing/edi/edi.mrt';
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
        //** Método que carga los metodos que inicializa la pagina*// 
        function init() {            
            vm.getConfigurationFormatDate();
        }
        vm.isAuthenticate();
    }
    //** Controller de la vetana modal de requerido*// 
    angular
       .module('app.edi')
       .controller('EdidependenceController', EdidependenceController);
    EdidependenceController.$inject = ['$scope', '$element', 'reciverhide', 'ratehide', 'close'];
    function EdidependenceController($scope, $element, reciverhide, ratehide, close) {
        $scope.reciverhide = reciverhide;
        $scope.ratehide = ratehide;
        $scope.close = function (page) {
            close({
                page: page

            }, 500); // close, but give 500ms for bootstrap to animate
        };
    }
})();

