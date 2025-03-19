/* jshint ignore:start */
(function () {
    'use strict';
    angular
        .module('app.earlywarning')
        .controller('EarlywarningController', EarlywarningController);

    EarlywarningController.$inject = ['localStorageService', 'branchDS', '$translate',
        '$filter', '$state', 'moment', '$rootScope', 'serviceDS', 'indicatorsDS', 'LZString'];

    function EarlywarningController(localStorageService, branchDS, $translate,
        $filter, $state, moment, $rootScope, serviceDS, indicatorsDS, LZString) {

        var vm = this;
        vm.title = 'Earlywarning';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0036');
        $rootScope.helpReference = '05.Stadistics/earlywarning.htm';
        vm.listvalues = [];
        vm.listselect = [];
        vm.listvaluesbranch = [];
        vm.listselectbranch = [];
        vm.allcheckservice = true;
        vm.allcheckbranch = true;
        vm.report = false;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.getservice = getservice;
        vm.selectallservice = selectallservice;
        vm.additemslist = additemslist;
        vm.getearlywarning = getearlywarning;
        vm.getbranch = getbranch;
        vm.selectallbranch = selectallbranch;
        vm.additemslistbranch = additemslistbranch;
        vm.service = localStorageService.get('ManejoServicio');
        vm.service = vm.service === 'True' || vm.service === true ? true : false;
        vm.format = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
        vm.filterRange = '1';
        vm.typereport = "1";
        vm.rangeInit = '';
        vm.rangeEnd = '';
        vm.loading = false;
        vm.groupProfiles = true;
        $rootScope.pageview = 3;
        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Función que trae la lista de servicios
        function getservice() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return serviceDS.getServiceActive(auth.authToken).then(function (data) {
                //vm.loading = false;
                if (data.status === 200) {
                    vm.listservice = data.data;
                    vm.listvalues = vm.listselect;
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }
        // Función Para seleccionar todos los servicios
        function selectallservice(id) {
            vm.allcheckservice = !vm.allcheckservice;

            if (vm.listselect.length === vm.listservice.length && vm.allcheckservice) {
                var element = vm.listselect[vm.listselect.length - 1];
                var elementlist = ($filter('filter')(vm.listservice, { id: element.id }));
                elementlist[0].code = elementlist[0].code.substring(1, elementlist[0].code.length);
                vm.listselect = vm.listselect.splice(0, vm.listselect.length - 1);
            }

            if (vm.allcheckservice) {
                vm.listvalues = vm.listservice;
                if (vm.listselect.length > 0) {
                    vm.listselect.forEach(function (value, key) {
                        vm.listvalues = ($filter('filter')(vm.listvalues, { id: '!' + value.id }));
                    });
                }
            }
            else {
                vm.listvalues = vm.listselect;
            }
        }
        // Función adicionar los items de la lista de servicio
        function additemslist(item) {
            var list = ($filter('filter')(vm.listselect, { id: item.id }));

            if (list.length === 0) {
                if (vm.listselect.length + 1 === vm.listservice.length && vm.allcheckservice) {
                    UIkit.modal("#modalinformative").show();
                }
                else {
                    var element = {
                        'id': item.id,
                        'name': item.name,
                        'code': item.code
                    };
                    vm.listselect.push(element);
                    item.code = '-' + item.code;
                    vm.listvalues = vm.listservice;
                }
            }
            else {
                item.code = item.code.substring(1, item.code.length);
                vm.listselect = ($filter('filter')(vm.listselect, { id: '!' + item.id }));
            }

            //asignar el valor de los items de la lista
            if (vm.allcheckservice) {
                vm.listvalues = vm.listservice;
                if (vm.listselect.length > 0) {
                    vm.listselect.forEach(function (value, key) {
                        vm.listvalues = ($filter('filter')(vm.listvalues, { id: '!' + value.id }));
                    });
                }
            }
            else {
                vm.listvalues = vm.listselect;
            }

            vm.item.selected = "";
        }
        // Función para traer una lista de sedes
        function getbranch() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return branchDS.getBranchstate(auth.authToken).then(function (data) {
                vm.getservice();
                if (data.status === 200) {
                    vm.listbranch = data.data;
                    vm.listvaluesbranch = vm.listselectbranch;
                }
            },
                function (error) {
                    vm.modalError(error);
                })
        }
        // Función para seleccionar todas las sedes
        function selectallbranch(id) {
            vm.allcheckbranch = !vm.allcheckbranch;
            if (vm.listselectbranch.length === vm.listbranch.length && vm.allcheckbranch) {
                var element = vm.listselectbranch[vm.listselectbranch.length - 1];
                var elementlist = ($filter('filter')(vm.listbranch, { id: element.id }));
                elementlist[0].code = elementlist[0].code.substring(1, elementlist[0].code.length);
                vm.listselectbranch = vm.listselectbranch.splice(0, vm.listselectbranch.length - 1);
            }

            if (vm.allcheckbranch) {
                vm.listvaluesbranch = vm.listbranch;
                if (vm.listselectbranch.length > 0) {
                    vm.listselectbranch.forEach(function (value, key) {
                        vm.listvaluesbranch = ($filter('filter')(vm.listvaluesbranch, { id: '!' + value.id }));
                    });
                }
            }
            else {
                vm.listvaluesbranch = vm.listselectbranch;
            }
        }
        // Función para adicionar las sedes a la lista
        function additemslistbranch(item) {
            var list = ($filter('filter')(vm.listselectbranch, { id: item.id }));

            if (list.length === 0) {
                if (vm.listselectbranch.length + 1 === vm.listbranch.length && vm.allcheckbranch) {
                    UIkit.modal("#modalinformative").show();
                }
                else {
                    var element = {
                        'id': item.id,
                        'name': item.name,
                        'code': item.code
                    };
                    vm.listselectbranch.push(element);
                    item.code = '-' + item.code;
                    vm.listvaluesbranch = vm.listbranch;
                }
            }
            else {
                item.code = item.code.substring(1, item.code.length);
                vm.listselectbranch = ($filter('filter')(vm.listselectbranch, { id: '!' + item.id }));
            }
            //asignar el valor de los items de la lista
            if (vm.allcheckbranch) {
                vm.listvaluesbranch = vm.listbranch;
                if (vm.listselectbranch.length > 0) {
                    vm.listselectbranch.forEach(function (value, key) {
                        vm.listvaluesbranch = ($filter('filter')(vm.listvaluesbranch, { id: '!' + value.id }));
                    });
                }
            }
            else {
                vm.listvaluesbranch = vm.listselectbranch;
            }
            vm.itembranch.selected = "";
        }
        //Función para imprimir el reporte
        function getearlywarning() {
            var demographics = [];

            if (vm.listvalues.length > 0) {
                var item = {
                    "demographic": -6,
                    "demographicItems": [],
                };
                vm.listvalues.forEach(function (value, key) {
                    item.demographicItems.push(value.id);
                });
                demographics.push(item);
            }

            if (vm.listvaluesbranch.length > 0) {
                var itembranch = {
                    "demographic": -5,
                    "demographicItems": [],
                };
                vm.listvaluesbranch.forEach(function (value, key) {
                    itembranch.demographicItems.push(value.id);
                });
                demographics.push(itembranch);
            }
            var data = {
                "rangeType": vm.filterRange === '1' ? '2' : vm.filterRange,
                "init": vm.rangeInit,
                "end": vm.rangeEnd,
                "demographics": demographics,
                "groupProfiles": vm.groupProfiles,
                "testState": 4,
                "typeGrouping": 0
            };

            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return indicatorsDS.getOpportunityTime(auth.authToken, data).then(function (data) {
                if (data.status === 200) {
                    vm.averagetime = data.data;
                    vm.data = [];
                    for (var i = 0; i < vm.averagetime.length; i++) {
                        for (var j = 0; j < vm.averagetime[i].results.length; j++) {
                            vm.averagetime[i].results[j].opportunityTimes.validElapsedTime = vm.averagetime[i].results[j].opportunityTimes.validElapsedTime === undefined ? 0 : vm.averagetime[i].results[j].opportunityTimes.validElapsedTime;
                            var data = {
                                "orderNumber": vm.averagetime[i].results[j].orderNumber,
                                "branch": vm.averagetime[i].branch,
                                "branchCode": vm.averagetime[i].branchCode,
                                "branchName": vm.averagetime[i].branchName,
                                "service": vm.service ? vm.averagetime[i].service : null,
                                "serviceCode": vm.service ? vm.averagetime[i].serviceCode : null,
                                "serviceName": vm.service ? vm.averagetime[i].serviceName : null,
                                "Codetest": vm.averagetime[i].results[j].code,
                                "nametest": vm.averagetime[i].results[j].name,
                                "basic": vm.averagetime[i].results[j].basic,
                                "entryDate": vm.averagetime[i].results[j].opportunityTimes.entryDate === 0 ? "N/A" : moment(vm.averagetime[i].results[j].opportunityTimes.entryDate).format(vm.format),
                                "validationDate": vm.averagetime[i].results[j].opportunityTimes.validationDate === 0 ? "N/A" : moment(vm.averagetime[i].results[j].opportunityTimes.validationDate).format(vm.format),
                                "numerator": vm.averagetime[i].results[j].basic === 1 ? vm.averagetime[i].results[j].opportunityTimes.validElapsedTime / 1440 : 0
                            };
                            vm.data.push(data);
                        }
                    }
                    var parameterReport = {};
                    parameterReport.variables = {
                        "rangeInit": vm.filterRange === '1' ? vm.rangeInit : moment(vm.rangeInit).format(vm.formatDate),
                        "rangeEnd": vm.filterRange === '1' ? vm.rangeEnd : moment(vm.rangeEnd).format(vm.formatDate),
                        "rangeType": vm.filterRange,
                        "username": auth.userName,
                        "date": moment().format(vm.formatDate + ', HH:mm:ss')
                    };
                    parameterReport.pathreport = vm.typereport === '1' ? '/Report/stadistics/earlywarning/earlywarningcodense.mrt' : '/Report/stadistics/earlywarning/earlywarningdetailed.mrt';
                    parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
                    var datareport = LZString.compressToUTF16(JSON.stringify(vm.data));
                    localStorageService.set('parameterReport', parameterReport);
                    localStorageService.set('dataReport', datareport);
                    window.open("/viewreport/viewreport.html");
                } else {
                    UIkit.modal("#modalReportError").show();
                }
                vm.report = false;
            },
                function (error) {
                    vm.modalError(error);
                })
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
        // Función para inicializar la pagina
        function init() {
            vm.loading = true;
            vm.getbranch();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */

