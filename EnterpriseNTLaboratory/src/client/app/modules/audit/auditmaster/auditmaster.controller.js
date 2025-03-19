(function () {
    'use strict';

    angular
        .module('app.auditmaster')
        .controller('auditmasterController', auditmasterController);


    auditmasterController.$inject = ['LZString', '$translate', 'localStorageService',
        '$filter', '$state', 'moment', '$rootScope', 'userDS', 'auditsmasterDS', 'listaudit'];

    function auditmasterController(LZString, $translate, localStorageService,
        $filter, $state, moment, $rootScope, userDS, auditsmasterDS, listaudit) {

        var vm = this;
        vm.title = 'auditmaster';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0927');
        $rootScope.helpReference = '07.Audit/auditmaster.htm';
        vm.report = false;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.search = search;
        vm.windowOpenReport = windowOpenReport;
        vm.generateFileorder = generateFileorder;
        vm.rangeInit = moment().format('YYYYMMDD');
        vm.rangeEnd = moment().format('YYYYMMDD');
        vm.listuser = listuser;
        vm.listmodule = listmodule;
        vm.listdata = listdata;
        $rootScope.pageview = 3;

        //** Método  para imprimir el reporte**//  
        function generateFileorder() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'date': moment().format('DD/MM/YYYY, HH:mm:ss'),
                'username': auth.userName
            };
            vm.pathreport = '/Report/audit/auditmaster/auditmaster.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport();
        }

        function windowOpenReport() {
            if (vm.auditmasterlist.length > 0) {
                var parameterReport = {};
                parameterReport.variables = vm.variables;
                parameterReport.pathreport = vm.pathreport;
                parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
                var auditmasterlist = LZString.compressToUTF16(JSON.stringify(vm.auditmasterlist));
                localStorageService.set('parameterReport', parameterReport);
                localStorageService.set('dataReport', auditmasterlist);
                window.open('/viewreport/viewreport.html');
            } else {
                UIkit.modal('#modalReportError').show();
            }
        }
        function search(type) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.loadingdata = true;
            vm.auditmasterlist = [];

            vm.type = type;

            if (vm.type === 1 || vm.type === 3) {
                var rangeInit = moment(vm.rangeInit).format('YYYYMMDD');
                var rangeEnd = moment(vm.rangeEnd).format('YYYYMMDD');
                return auditsmasterDS.getauditsmaster(auth.authToken, rangeInit, rangeEnd).then(function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.data = data.data;
                        vm.listdata();

                    } else {
                        UIkit.modal('#nofoundfilter').show();
                    }
                },
                    function (error) {
                        vm.modalError(error);
                    });
            }
            if (vm.type === 2) {
                return auditsmasterDS.getaudituser(auth.authToken, moment(vm.rangeInit1).format('YYYYMMDD'), moment(vm.rangeEnd1).format('YYYYMMDD'), vm.list.id).then(function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.data = data.data;
                        vm.listdata();

                    } else {
                        UIkit.modal('#nofoundfilter').show();
                    }
                },
                    function (error) {
                        vm.modalError(error);
                    });
            }
        }
        function listdata() {
            vm.auditmasterlist = listaudit.add(vm.data);
            if (vm.type === 3) {
                vm.auditmasterlist = $filter('filter')(vm.auditmasterlist, { mastert: vm.modul.name }, true);
                if (vm.auditmasterlist.length === 0) {
                    UIkit.modal('#nofoundfilter').show();
                }
                else {
                    vm.generateFileorder();
                }

            } else {
                vm.generateFileorder();
            }

        }
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }

        //** Método  para imprimir el reporte**//  
        function listuser() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return userDS.getUsers(auth.authToken).then(function (data) {
                vm.listmodule();
                if (data.statusText === 'OK') {
                    vm.user = data.data;
                    vm.list = data.data[0];
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }

        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loadingdata = false;
        }

        //** Método  para imprimir el reporte**//  
        function listmodule() {
            vm.module = [
                //usuario
                {
                    'id': 'net.cltech.enterprisent.domain.masters.user.User',
                    'name': ($filter('translate')('0001')).toUpperCase()
                },
                //rol
                {
                    'id': 'net.cltech.enterprisent.domain.masters.user.Role',
                    'name': ($filter('translate')('1013')).toUpperCase()
                },
                //Asignación de precios por tarifa
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.PriceAssigment',
                    'name': ($filter('translate')('1063')).toUpperCase()
                },
                //vigencia
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.FeeSchedule',
                    'name': ($filter('translate')('1010')).toUpperCase()
                },
                //Impuesto por prueba
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.taxesProof',
                    'name': ($filter('translate')('1062')).toUpperCase()
                },
                //Receptor edi
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Receiver',
                    'name': ($filter('translate')('1011')).toUpperCase()
                },
                // dias de alarma pendientes de pago
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.AlarmDays',
                    'name': ($filter('translate')('1061')).toUpperCase()
                },
                //Tarifa por cliente
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.RatesOfAccount',
                    'name': ($filter('translate')('1060')).toUpperCase()
                },
                //RESOLUCIÓN
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Resolution',
                    'name': ($filter('translate')('1009')).toUpperCase()
                },
                //TARIFA
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Rate',
                    'name': ($filter('translate')('0087')).toUpperCase()
                },
                //protocolo eddi
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Rate',
                    'name': ($filter('translate')('1008')).toUpperCase()
                },
                //CLIENTE
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Account',
                    'name': ($filter('translate')('0085')).toUpperCase()
                },
                //Entidad
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Provider',
                    'name': ($filter('translate')('1007')).toUpperCase()
                },
                //TARJETA DE CREDITO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Card',
                    'name': ($filter('translate')('0822')).toUpperCase()
                },
                //BANCO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.Bank',
                    'name': ($filter('translate')('0821')).toUpperCase()
                },
                //TIPO DE PAGO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.billing.PaymentType',
                    'name': ($filter('translate')('1006')).toUpperCase()
                },
                //Homologación de pruebas 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Standardization',
                    'name': ($filter('translate')('1050')).toUpperCase()
                },
                //Homologación de demograficos
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.StandardizationDemographic',
                    'name': ($filter('translate')('1049')).toUpperCase()
                },
                //HOMOLOGACIÓN USUARIO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.user.StandardizationUse',
                    'name': ($filter('translate')('1005')).toUpperCase()
                },
                //SISTEMA CENTRAL 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.CentralSystem',
                    'name': ($filter('translate')('1004')).toUpperCase()
                },
                //integración de middleware por laboratorio  
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.integrationMiddleware',
                    'name': ($filter('translate')('1281')).toUpperCase()
                },
                //Oportunidad de la prueba
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.TestByService',
                    'name': ($filter('translate')('1048')).toUpperCase()
                },
                //oportunidad de la muestra
                {
                    'id': 'net.cltech.enterprisent.domain.masters.tracking.DestinationRoute',
                    'name': ($filter('translate')('1047')).toUpperCase()
                },
                //Muestra por servicio 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.SampleByService',
                    'name': ($filter('translate')('1046')).toUpperCase()
                },
                //HISTOGRAMA
                {
                    'id': 'net.cltech.enterprisent.domain.masters.opportunity.Bind',
                    'name': ($filter('translate')('0038')).toUpperCase()
                },
                //SUBMUETRA
                {
                    'id': '/Enterprise_NT_PRU/api/samples/subsamples/',
                    'name': ($filter('translate')('0460')).toUpperCase()
                },
                //Medio de cultivo por prueba *** 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.MediaCultureTest',
                    'name': ($filter('translate')('1045')).toUpperCase()
                },
                //MEDIOS DE CULTIVO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.MediaCulture',
                    'name': ($filter('translate')('0486')).toUpperCase()
                },
                //Procedimiento por prueba ***
                {
                    'id': '/Enterprise_NT_PRU/api/procedures/testprocedure',
                    'name': ($filter('translate')('1044')).toUpperCase()
                },
                //PROCEDIMIENTO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.Procedure',
                    'name': ($filter('translate')('0487')).toUpperCase()
                },
                //METODO DE RECOLECION
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.CollectionMethod',
                    'name': ($filter('translate')('0461')).toUpperCase()
                },
                //TAREA 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.Task',
                    'name': ($filter('translate')('0578')).toUpperCase()
                },
                //SITIO ANATOMICO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.AnatomicalSite',
                    'name': ($filter('translate')('0462')).toUpperCase()
                },
                //DESTINO DE MICROOBIOLOGIA
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.MicrobiologyDestination',
                    'name': ($filter('translate')('1003')).toUpperCase()
                },
                //VALORES DE REFERENCIA DE ANTIBIOTICO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.MicroorganismAntibiotic',
                    'name': ($filter('translate')('1002')).toUpperCase()
                },
                //ANTIBIOGRAMA
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.Sensitivity',
                    'name': ($filter('translate')('0414')).toUpperCase()
                },
                // antibiotico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.Antibiotic',
                    'name': ($filter('translate')('0557')).toUpperCase()
                },
                //MICROORGANISMO
                {
                    'id': 'net.cltech.enterprisent.domain.masters.microbiology.Microorganism',
                    'name': ($filter('translate')('0608')).toUpperCase()
                },
                //Asignación de destino
                {
                    'id': 'net.cltech.enterprisent.domain.masters.tracking.AssignmentDestination',
                    'name': ($filter('translate')('1041')).toUpperCase()
                },
                //destino
                {
                    'id': 'net.cltech.enterprisent.domain.masters.tracking.Destination',
                    'name': ($filter('translate')('0157')).toUpperCase()
                },
                //motivo
                {
                    'id': 'net.cltech.enterprisent.domain.masters.common.Motive',
                    'name': ($filter('translate')('0113')).toUpperCase()
                },
                //nevera
                {
                    'id': 'net.cltech.enterprisent.domain.masters.tracking.Refrigerator',
                    'name': ($filter('translate')('0710')).toUpperCase()
                },
                //valores de referencia
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.ReferenceValue',
                    'name': ($filter('translate')('1001')).toUpperCase()
                },
                //deltacheck
                {
                    'id': 'net.cltech.enterprisent.domain.masters.deltacheck',
                    'name': ($filter('translate')('0357')).toUpperCase()
                },
                //resultado literal por prueba
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.LiteralByTest',
                    'name': ($filter('translate')('1040')).toUpperCase()
                },
                //resultado literal
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.LiteralResult',
                    'name': ($filter('translate')('1000')).toUpperCase()
                },
                //prueba automatica
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.AutomaticTest',
                    'name': ($filter('translate')('1039')).toUpperCase()
                },
                //relación resultados
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.resultrelationships',
                    'name': ($filter('translate')('0999')).toUpperCase()
                },
                //Plantilla de resultados
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.OptionTemplate',
                    'name': ($filter('translate')('0599')).toUpperCase()
                },
                //contador hematologico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.CellularCounter',
                    'name': ($filter('translate')('0998')).toUpperCase()
                },
                //hojas de trabajo   
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Worksheet',
                    'name': ($filter('translate')('0018')).toUpperCase()
                },
                //Excluir pruebas por demografico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.ExcludeTest',
                    'name': ($filter('translate')('1064')).toUpperCase()
                },
                //excluir prueba por usuario   
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.exclude',
                    'name': ($filter('translate')('0997')).toUpperCase()
                },
                //pruebas por demograficos pyp
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.PypDemographic',
                    'name': ($filter('translate')('0996')).toUpperCase()
                },
                //Pruebas por laboratorio
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.TestByLaboratory',
                    'name': ($filter('translate')('1012')).toUpperCase()
                },
                //laboratorio
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Laboratory',
                    'name': ($filter('translate')('0429')).toUpperCase()
                },
                //diagnostico por prueba
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.TestByDiagnostic',
                    'name': ($filter('translate')('0995')).toUpperCase()
                },
                //diagnostico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Diagnostic',
                    'name': ($filter('translate')('0258')).toUpperCase()
                },
                // grupos de prueba 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.groups',
                    'name': ($filter('translate')('0558')).toUpperCase()
                },
                //Orden de impresión         
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.TestBasic',
                    'name': ($filter('translate')('1035')).toUpperCase()
                },
                //Dias de procesamiento 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.TestBasic',
                    'name': ($filter('translate')('0851')).toUpperCase()
                },
                //perfil
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Test',
                    'name': ($filter('translate')('0746')).toUpperCase()
                },
                //examen  
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Test',
                    'name': ($filter('translate')('0013')).toUpperCase()
                },
                //Muestra  
                {
                    'id': 'Enterprise_NT_PRU.api.samples',
                    'name': ($filter('translate')('0111')).toUpperCase()
                },
                //Recipiente
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Container',
                    'name': ($filter('translate')('0867')).toUpperCase()
                },
                //Comentario
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.CommentCoded',
                    'name': ($filter('translate')('0114')).toUpperCase()
                },
                //alarma
                {
                    'id': 'Enterprise_NT_PRU.api.alarms',
                    'name': ($filter('translate')('1015')).toUpperCase()
                },
                //Grupo etario
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.AgeGroup',
                    'name': ($filter('translate')('0513')).toUpperCase()
                },
                //maestro requisito 
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Requirement',
                    'name': ($filter('translate')('0858')).toUpperCase()
                },
                //maestro tecnica
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Technique',
                    'name': ($filter('translate')('0740')).toUpperCase()
                },
                //unidad
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Unit',
                    'name': ($filter('translate')('0125')).toUpperCase()
                },
                //Area
                {
                    'id': 'net.cltech.enterprisent.domain.masters.test.Area',
                    'name': ($filter('translate')('0408')).toUpperCase()
                },
                //Entrevista
                {
                    'id': 'net.cltech.enterprisent.domain.masters.interview.Interview',
                    'name': ($filter('translate')('0191')).toUpperCase()
                },
                //Preguntas
                {
                    'id': 'net.cltech.enterprisent.domain.masters.interview.Question',
                    'name': ($filter('translate')('0994')).toUpperCase()
                },
                //Respuestas
                {
                    'id': 'net.cltech.enterprisent.domain.masters.interview.Answer',
                    'name': ($filter('translate')('1099')).toUpperCase()
                },
                //maestro  itemdemografico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.DemographicItem',
                    'name': ($filter('translate')('0412')).toUpperCase()
                },
                //maestro  demograficos
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Demographic',
                    'name': ($filter('translate')('0083')).toUpperCase()
                },
                //maestro  médico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Physician',
                    'name': ($filter('translate')('0086')).toUpperCase()
                },
                //maestro  especialidad
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Specialist',
                    'name': ($filter('translate')('0991')).toUpperCase()
                },
                //maestro de tipo de orden
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.OrderType',
                    'name': ($filter('translate')('0088')).toUpperCase()
                },
                //maestro de servicio
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.ServiceLaboratory',
                    'name': ($filter('translate')('0090')).toUpperCase()
                },
                //maestro de sede
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Branch',
                    'name': ($filter('translate')('0003')).toUpperCase()
                },
                //maestro de tipo de documento
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.DocumentType',
                    'name': ($filter('translate')('0833')).toUpperCase()
                },
                //maestro de raza
                {
                    'id': 'net.cltech.enterprisent.domain.masters.demographic.Race',
                    'name': ($filter('translate')('0091')).toUpperCase()
                },
                //configuracion
                {
                    'id': 'net.cltech.enterprisent.domain.masters.configuration.Configuration',
                    'name': ($filter('translate')('0665')).toUpperCase()
                },
                //Configuración general
                {
                    'id': 'net.cltech.enterprisent.domain.masters.configuration.Configuration',
                    'name': ($filter('translate')('0992')).toUpperCase()
                },
                //dependencia demografico
                {
                    'id': 'net.cltech.enterprisent.domain.masters.configuration.Configuration',
                    'name': ($filter('translate')('0780')).toUpperCase()
                },
                //Agrupación de órdenes
                {
                    'id': 'net.cltech.enterprisent.domain.masters.configuration.OrderGrouping',
                    'name': ($filter('translate')('1403')).toUpperCase()
                },
                //maestro  festivos
                {
                    'id': 'net.cltech.enterprisent.domain.masters.common.Holiday',
                    'name': ($filter('translate')('0993')).toUpperCase()
                }
            ];
            vm.modul = {
                'id': 'net.cltech.enterprisent.domain.masters.user.User',
                'name': ($filter('translate')('0001')).toUpperCase()
            };
        }

        function init() {
            vm.listuser();
        }
        vm.isAuthenticate();
    }
})();