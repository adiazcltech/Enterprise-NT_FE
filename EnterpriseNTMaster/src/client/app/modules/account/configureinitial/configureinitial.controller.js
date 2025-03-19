
(function () {
    'use strict';

    angular
        .module('app.configureinitial')
        .controller('configureinitialController', configureinitialController);

    configureinitialController.$inject = ['branchDS', '$hotkey', '$translate', '$filter', 'authService', 'logger', '$state', 'configurationDS', 'localStorageService', 'moment'];

    /* @ngInject */
    function configureinitialController(branchDS, $hotkey, $translate, $filter, authService, logger, $state, configurationDS, localStorageService, moment) {

        var vm = this;
        vm.Title = 'configureinitial';
        vm.user = {};
        vm.modalError = modalError;
        vm.arrayslist = arrayslist;
        vm.save = save;
        vm.init = init;
        vm.changeLanguage = changeLanguage;
        vm.view = false;
        vm.finishbutton = false;
        vm.loadpage = true;
        vm.idnext = idnext;
        vm.tomorrow = new Date();
        vm.saveupdatesecurity = saveupdatesecurity;
        vm.errorsegurity = false;
        vm.tomorrow.setDate(vm.tomorrow.getDate() + 365);
        vm.listFormatDate = [{ 'id': 'dd/MM/yyyy', 'name': $filter('translate')('0754') },
        { 'id': 'dd-MM-yyyy', 'name': $filter('translate')('0755') },
        { 'id': 'dd.MM.yyyy', 'name': $filter('translate')('0756') },
        { 'id': 'MM/dd/yyyy', 'name': $filter('translate')('0757') },
        { 'id': 'MM-dd-yyyy', 'name': $filter('translate')('0758') },
        { 'id': 'MM.dd.yyyy', 'name': $filter('translate')('0759') },
        { 'id': 'yyyy/MM/dd', 'name': $filter('translate')('0760') },
        { 'id': 'yyyy-MM-dd', 'name': $filter('translate')('0761') },
        { 'id': 'yyyy.MM.dd', 'name': $filter('translate')('0762') }];
        $(document).ready(function () {
            var required = $filter('translate')('0900');
            var minlength = ($filter('translate')('0898')).replace('@@@', '3');
            var minlengthc = ($filter('translate')('0898')).replace('@@@', '5');
            var equal = $filter('translate')('0899');
            /*  Activate the tooltips      */
            $('[rel="tooltip"]').tooltip();
            // Code for the Validator
            var $validator = $('.wizard-card form').validate({
                rules: {
                    entity: {
                        required: true,
                        minlength: 3
                    },
                    Abbreviation: {
                        required: true,
                        minlength: 3
                    },
                    name: {
                        required: true,
                        minlength: 3
                    },
                    password: {
                        required: true,
                        minlength: 5
                    },
                    date: {
                        required: true
                    },
                    UrlDischarge: {
                        required: true
                    },
                    UrlSecurity: {
                        required: true
                    },
                    password2: {
                        required: true,
                        minlength: 5,
                        equalTo: '[name="password"]'
                    }
                },
                messages: {
                    entity: {
                        required: required,
                        minlength: minlength
                    },
                    Abbreviation: {
                        required: required,
                        minlength: minlength
                    },
                    name: {
                        required: required,
                        minlength: minlength
                    },
                    date: {
                        required: required
                    },
                    UrlDischarge: {
                        required: required
                    },
                    UrlSecurity: {
                        required: required
                    },
                    password: {
                        required: required,
                        minlength: minlengthc
                    },
                    password2: {
                        required: required,
                        minlength: minlengthc,
                        equalTo: equal
                    }
                }
            });
            // Wizard Initialization
            $('.wizard-card').bootstrapWizard({
                'tabClass': 'nav nav-pills',
                'nextSelector': '.btn-next',
                'previousSelector': '.btn-previous',
                onNext: function (tab, navigation, index) {
                    vm.errorsegurity = false;
                    var $valid = $('.wizard-card form').valid();
                    if (!$valid) {
                        $validator.focusInvalid();
                        return false;
                    } else if (index === 4) {
                        vm.saveupdatesecurity();
                    }
                },
                onInit: function (tab, navigation, index) {
                    //check number of tabs and fill the entire row
                    var $total = navigation.find('li').length;
                    var $width = 100 / $total;
                    navigation.find('li').css('width', $width + '%');
                },
                onTabClick: function (tab, navigation, index) {
                    return false;
                    var $valid = $('.wizard-card form').valid();
                },
                onTabShow: function (tab, navigation, index) {
                    var $total = navigation.find('li').length;
                    var $current = index + 1;
                    var $wizard = navigation.closest('.wizard-card');
                    // If it's the last tab then hide the last button and show the finish instead
                    if ($current >= $total) {
                        $($wizard).find('.btn-next').hide();
                        $($wizard).find('.btn-finish').show();
                    } else {
                        $($wizard).find('.btn-next').show();
                        $($wizard).find('.btn-finish').hide();
                    }
                    //update progress
                    var move_distance = 100 / $total;
                    move_distance = move_distance * (index) + move_distance / 2;
                    $wizard.find($('.progress-bar')).css({ width: move_distance + '%' });
                    //e.relatedTarget // previous tab
                    $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');
                }
            });
            $('[data-toggle="wizard-radio"]').click(function () {
                wizard = $(this).closest('.wizard-card');
                wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
                $(this).addClass('active');
                $(wizard).find('[type="radio"]').removeAttr('checked');
                $(this).find('[type="radio"]').attr('checked', 'true');
            });
            $('[data-toggle="wizard-checkbox"]').click(function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).find('[type="checkbox"]').removeAttr('checked');
                } else {
                    $(this).addClass('active');
                    $(this).find('[type="checkbox"]').attr('checked', 'true');
                }
            });
            $('.set-full-height').css('height', 'auto');
            vm.view = true;
        });
        function idnext() {
            setTimeout(function () {
                angular.element('#entity').focus();
                angular.element('#name').focus();
                angular.element('#password').focus();
            }, 100);
        }

        // método para guardar los datos del formulario
        function saveupdatesecurity() {
            vm.errorsegurity = false;
            var dataconfig = [{
                "key": "UrlDischarge",
                "value": vm.dataconfig.config[9].value
            },
            {
                "key": "UrlSecurity",
                "value": vm.dataconfig.config[10].value
            }
            ]
            return configurationDS.updatesecurity(dataconfig).then(function (data) {
                vm.user.username = 'lismanager';
                vm.user.password = 'cltechmanager';
                return authService.login(vm.user, 'init').then(function (data) {
                    if (data.status === 200) {
                        vm.token = data.data.token;
                    }
                },
                    function (error) {
                        vm.errorsegurity = true;
                    })
            }, function (error) {
                vm.modalError(error);
            });
        }
        // metodo para ordernar los datos en un array
        function arrayslist() {
            vm.dataconfig = {
                config: [
                    {
                        "key": 'Entidad',
                        "value": ''
                    },
                    {
                        "key": "Abreviatura",
                        "value": ''
                    },
                    {
                        "key": "FormatoTelefono",
                        "value": ''
                    },
                    {
                        "key": "FormatoFecha",
                        "value": 'dd/MM/yyyy'
                    },
                    {
                        "key": "HistoriaAutomatica",
                        "value": false
                    },
                    {
                        "key": "ManejoTipoDocumento",
                        "value": false
                    },
                    {
                        "key": "ManejoServicio",
                        "value": false
                    },
                    {
                        "key": "ManejoMedico",
                        "value": false
                    },
                    {
                        "key": "ManejoRaza",
                        "value": false
                    },
                    {
                        "key": "UrlDischarge",
                        "value": ''
                    },
                    {
                        "key": "UrlSecurity",
                        "value": ''
                    }
                ],
                user: {
                    "lastTransaction": 1526911009970,
                    "user": {
                        "id": 0,
                        "confidential": false,
                        "administrator": false
                    },
                    "id": 3,
                    "name": "Administrator",
                    "lastName": "User",
                    "userName": "admin",
                    "password": "",
                    "state": true,
                    "activation": 1526911009970,
                    "expiration": vm.tomorrow,
                    "passwordExpiration": 1526911009970,
                    "identification": "Cltech1",
                    "signature": "",
                    "maxDiscount": 0,
                    "type": {
                        "id": 11,
                        "idParent": 10,
                        "esCo": "Laboratorio",
                        "enUsa": "Laboratory"
                    },
                    "photo": "",
                    "confidential": false,
                    "printInReports": false,
                    "addExams": false,
                    "secondValidation": false,
                    "editPatients": false,
                    "quitValidation": false,
                    "creatingItems": false,
                    "printResults": false,
                    "areas": [],
                    "branches": [],
                    "roles": [
                        {
                            "access": false,
                            "user": {
                                "id": 0,
                                "confidential": false,
                                "administrator": false
                            },
                            "role": {
                                "user": {
                                    "confidential": false,
                                    "administrator": false
                                },
                                "id": 1,
                                "name": "CLTechAdministrator",
                                "administrator": true,
                                "state": false,
                                "modules": []
                            }
                        },
                        {
                            "access": false,
                            "user": {
                                "id": 0,
                                "confidential": false,
                                "administrator": false
                            },
                            "role": {
                                "user": {
                                    "confidential": false,
                                    "administrator": false
                                },
                                "id": 2,
                                "name": "ConfigurationAdmin",
                                "administrator": true,
                                "state": false,
                                "modules": []
                            }
                        }
                    ],
                    "orderType": {
                        "user": {
                            "confidential": false,
                            "administrator": false
                        },
                        "id": 3,
                        "state": false
                    }
                },
                branch: {
                    code: '01',
                    abbreviation: '',
                    responsable: '',
                    name: '',
                    phone: '',
                    address: ''
                }
            }
            vm.loadpage = false;
        }
        // método para guardar los datos del formulario
        function save() {
            vm.loadpage = true;
            vm.dataconfig.user.expiration = new Date(moment(vm.dataconfig.user.expiration).format()).getTime();
            vm.dataconfig.config[4].value = vm.dataconfig.config[4].value === false ? 'False' : 'True';
            vm.dataconfig.config[5].value = vm.dataconfig.config[5].value === false ? 'False' : 'True';
            vm.dataconfig.config[6].value = vm.dataconfig.config[6].value === false ? 'False' : 'True';
            vm.dataconfig.config[7].value = vm.dataconfig.config[7].value === false ? 'False' : 'True';
            vm.dataconfig.config[8].value = vm.dataconfig.config[8].value === false ? 'False' : 'True';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.configurationinitial(vm.token, vm.dataconfig).then(function (data) {
                vm.loadpage = false;
                if (data.status === 200) {
                    localStorage.clear();
                    $state.go('login');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        function changeLanguage(langKey) {
            $translate.use(langKey);
        }
        // método que inicializa la página
        function init() {
            return branchDS.getBranchAutenticate().then(function (data) {
                if (data.status === 200) {
                    $state.go('login');
                } else {
                    vm.arrayslist();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        // método par llamar el modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.init();
    }
})();
