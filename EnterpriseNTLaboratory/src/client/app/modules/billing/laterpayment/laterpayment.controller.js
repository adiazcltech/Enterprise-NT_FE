/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.laterpayment')
        .filter('trust', ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            }
        }])
        .controller('laterpaymentController', laterpaymentController);
        laterpaymentController.$inject = ['common', 'demographicDS','demographicsItemDS','cashboxDS','localStorageService','logger',
        '$filter', '$state', 'moment', '$rootScope'];

       function laterpaymentController(common,demographicDS,demographicsItemDS,cashboxDS,localStorageService,logger, 
        $filter, $state, moment, $rootScope) {
        var vm = this;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.title = 'laterpayment';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('1523');
        $rootScope.helpReference = '04.reportsandconsultations/laterpayment.htm';
        vm.changefilter = changefilter;
        vm.keyselectpatientid = keyselectpatientid;
        vm.getdemograficchange = getdemograficchange;
        vm.removeDatademografic = removeDatademografic;
        vm.getDemographicsItems = getDemographicsItems;
        vm.modalError = modalError;
        vm.getseach = getseach;
        vm.disable = disable;
        vm.keyselect = keyselect;      
        vm.datehoytoday = moment().format('YYYYMMDD');
        vm.rangeInit = vm.datehoytoday;
        vm.rangeEnd = vm.datehoytoday;
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
        vm.orderdigit = localStorageService.get('DigitosOrden');
        vm.cantdigit = parseInt(vm.orderdigit) + 4;
        vm.loading = false;
        $rootScope.pageview = 3;
        vm.typeresport = [
            { id: 3, name: $filter('translate')('3032') }, // Fecha
            { id: 4, name: $filter('translate')('0061') }, // Orden
            { id: 2, name: $filter('translate')('0134') }, // Apellido
            { id: 5, name: $filter('translate')('0083') }  // demografico
        ];
        vm.typeresport.id = 4;
       
        //** Metodo para obtener todos los demograficos**//
        function getdemograficchange() {
            vm.demograficdesencored = '';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
                vm.lisdemografic = data.data.length === 0 ? data.data : removeDatademografic(data);
                vm.getDemographicsItems();
            }, function (error) {
                vm.modalError(error);
            });
        }
         //** Metodo que construlle el arreglo para el combo demograficos**//
        function removeDatademografic(data) {
            vm.demografic = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            data.data.forEach(function (value, key) {
                switch (value.id) {
                    case -1:
                        value.name = $filter('translate')('0085');
                        break;
                    case -2:
                        value.name = $filter('translate')('0086');
                        break;
                    case -3:
                        value.name = $filter('translate')('0087');
                        break;
                    case -4:
                        value.name = $filter('translate')('0088');
                        break;
                    case -6:
                        value.name = $filter('translate')('0090');
                        break;
                    case -7:
                        value.name = $filter('translate')('0091');
                        break;
                    default:
                        value.name = value.name;
                }
                if (!(value.id === -5 || value.id === -111 || value.id === -10)) {
                    var object = {
                        id: value.id,
                        name: value.name,
                        encoded: value.encoded
                    };
                    vm.demografic.push(object);
                }
            });
            vm.demografic.id = -1;
            vm.demografic.encoded = true;
            return vm.demografic;
        }
        //** Metodo para obtener todos los demograficos item**//
        function getDemographicsItems() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.demografic.id).then(function (data) {                
                vm.lisdemograficitems = data.data.length === 0 ? data.data : removeDemographicsItems(data);
                vm.loading = false;
                vm.disable();                
            }, function (error) {
                vm.modalError(error);
            });
        }
        function removeDemographicsItems(data) {
            var DemographicsItems = [];
            data.data.forEach(function (value, key) {
                var object = {
                    id: value.demographicItem.id,
                    name: value.demographicItem.name
                };
                DemographicsItems.push(object);

            });
            return DemographicsItems;
        }
        function disable() {
            if (vm.typeresport.id === 2) {
                if ((vm.firstName === '' || vm.firstName === undefined) &&
                    (vm.secondName === '' || vm.secondName === undefined) &&
                    (vm.firstSurname === '' || vm.firstSurname === undefined) &&
                    (vm.secondSurname === '' || vm.secondSurname === undefined) ) {
                    return true;
                } else {
                  vm.getseach();
                }
            }
            if (vm.typeresport.id === 3) {
                if (vm.isOpenReport) {
                    return true;
                } else {
                   vm.getseach();

                }
            }
            if (vm.typeresport.id === 4) {
                if (vm.codeordernumberorden === '') {
                    return true;
                } else {
                    setTimeout(function () {
                        angular.element('#numberordersearch').select();
                    }, 100);
                     vm.getseach();
                }
            }

            if (vm.typeresport.id === 5) {
                if (vm.demografic.encoded && vm.lisdemograficitems.id === undefined || !vm.demografic.encoded && vm.demograficdesencored === '') {
                    return true;
                } else {
                    vm.getseach();

                }
            }
        }
        function getseach() {           
            vm.loading = true;
             var searchconsult = {
                "initialDate": vm.typeresport.id === 3?vm.rangeInit:0,
                "endDate": vm.typeresport.id === 3 ? vm.rangeEnd:0,
                "firstName":  vm.typeresport.id === 2? vm.firstName:"",
                "secondName":  vm.typeresport.id === 2? vm.secondName:"",
                "firstSurname":  vm.typeresport.id === 2? vm.firstSurname:"",
                "secondSurname":  vm.typeresport.id === 2? vm.secondSurname:"",
                "demographic": {
                    "demographic": vm.typeresport.id === 5 ? vm.demografic.id:0,
                    "demographicItems":  vm.typeresport.id === 5 &&  vm.demografic.encoded ? [vm.lisdemograficitems.id]:[],
                    "value": vm.typeresport.id === 5 && !vm.demografic.encoded ? vm.demograficdesencored:""
                },
                "outstandingBalance": vm.outstandingBalance
            } 
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return cashboxDS.subsequentPayments(auth.authToken, searchconsult).then(function (data) {
                if (data.status === 200) {
                  vm.dataorder=data.data;
                } else {
                    logger.success($filter('translate')('0392'));
                }
                vm.loading = false;
            },
                function (error) {
                    vm.modalError(error);
                });        
           
        }
        function changefilter() {
            vm.firstName='';
            vm.secondName='';
            vm.firstSurname='';
            vm.secondSurname='';
            vm.codeordernumberorden='';
            vm.lisdemograficitems.id=-1;
            vm.demografic={};      
        }
        function keyselectpatientid($event) {
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            if (keyCode === 13) {
                vm.disable();
            }
        }
        //** Método para completar el número de la orden**//
        function keyselect($event) {
            var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
            if (keyCode === 13 || keyCode === undefined) {
                if (vm.codeordernumberorden.length < vm.cantdigit) {
                    vm.codeordernumberorden = vm.codeordernumberorden === '' ? 0 : vm.codeordernumberorden;
                    if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 1) {
                        vm.numberordensearch = vm.listYear.id + moment().format('MM') + '0' + vm.codeordernumberorden;

                    } else if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 2) {
                        vm.numberordensearch = vm.listYear.id + moment().format('MM') + vm.codeordernumberorden;
                    } else if (vm.codeordernumberorden.length === parseInt(vm.orderdigit) + 3) {
                        vm.numberordensearch = vm.listYear.id + '0' + vm.codeordernumberorden;
                    } else {
                        vm.numberordensearch = vm.listYear.id + (common.getOrderComplete(vm.codeordernumberorden, vm.orderdigit)).substring(4);
                    }
                    vm.codeordernumberorden = vm.numberordensearch.substring(4);
                   // vm.getseach();
                }
                else if (vm.codeordernumberorden.length === vm.cantdigit) {
                    vm.numberordensearch = vm.listYear.id + vm.numberorden;
                  //  vm.getseach();
                }
            }
            else {
                if (!(keyCode >= 48 && keyCode <= 57)) {
                    $event.preventDefault();
                }
            }
        }
        function modalError(error) {
            vm.loading = false;
            vm.Error = error;
            vm.ShowPopupError = true;
        }          
        function isAuthenticate() {
            //var auth = null
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }
        function init() {
            vm.loading = true;
            var dateMin = moment().year() - 4;
            var dateMax = moment().year();
            vm.listYear = [];
            for (var i = dateMax; i >= dateMin; i--) {
                vm.listYear.push({ 'id': i, 'name': i });
            }
            vm.listYear.id = moment().year();
            vm.getdemograficchange();
            vm.sizeorder = 4 + parseInt(vm.digitsorder);
        }
        vm.isAuthenticate();

    }

})();
/* jshint ignore:end */