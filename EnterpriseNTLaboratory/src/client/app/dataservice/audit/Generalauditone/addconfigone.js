/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('addconfigone', addconfigone);

    addconfigone.$inject = ['labelaudit', '$filter', 'moment'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function addconfigone(labelaudit, $filter, moment) {
        var service = {
            add: add
        };
        return service;
        function add(name, data) {
            var datauser = [];
            if (name === 0) {//maestro de servicio 
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state' || data.fields[j].field === 'external') {
                        var object = {
                            'mastert': ($filter('translate')('0090')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0090')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 1) {//maestro de sede 
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0003')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0003')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 2) {//maestro de tipo de documento
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0833')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0833')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 3) {//maestro de raza
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0091')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0091')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 4) {//configuracion
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'NumeroOrdenAutomatico' || data.fields[j].field === 'VerPreliminarTalon' ||
                        data.fields[j].field === 'AnularOrdenValidada' || data.fields[j].field === 'AgregarExamenesMuestras' ||
                        data.fields[j].field === 'AlarmaUltimaOrden' || data.fields[j].field === 'Diagnostics' ||
                        data.fields[j].field === 'ManejoTalla' || data.fields[j].field === 'ManejoPeso' ||
                        data.fields[j].field === 'VisualizarFotoPaciente' || data.fields[j].field === 'ImprimirEtiquetaAutomaticamente' ||
                        data.fields[j].field === 'ImprimirEtiquetaAdicional' || data.fields[j].field === 'MotivoModificacionResultado' ||
                        data.fields[j].field === 'VerPreliminarRegistro' || data.fields[j].field === 'EntregaInformesSede' ||
                        data.fields[j].field === 'GeneraNombrePDFHistoria' || data.fields[j].field === 'IdentificarCopiasInformes' ||
                        data.fields[j].field === 'ImprimirAdjuntos' || data.fields[j].field === 'ImprimirAdjuntosPreliminar' ||
                        data.fields[j].field === 'MostrarReLlamadoColumna' || data.fields[j].field === 'EntrevistaPanicoObligatoria' ||
                        data.fields[j].field === 'ManejoTarifa' || data.fields[j].field === 'ManejoCliente' ||
                        data.fields[j].field === 'IntegracionDashBoard' || data.fields[j].field === 'IntegracionSIGA' ||
                        data.fields[j].field === 'Caja' || data.fields[j].field === 'ManejoCentavos' ||
                        data.fields[j].field === 'SiembraMicrobiologia' || data.fields[j].field === 'RegistroCMIM' ||
                        data.fields[j].field === 'RestarImpuesto' || data.fields[j].field === 'GradillaPendiente' ||
                        data.fields[j].field === 'GradillaConfidenciales' || data.fields[j].field === 'manejoEventos' ||
                        data.fields[j].field === 'crearOrden' || data.fields[j].field === 'modificarOrden' ||
                        data.fields[j].field === 'anularOrden' || data.fields[j].field === 'validaOrden' ||
                        data.fields[j].field === 'tomarMuestra' || data.fields[j].field === 'verificarMuestra' ||
                        data.fields[j].field === 'ingresarResultado' || data.fields[j].field === 'modificarResultado' ||
                        data.fields[j].field === 'repetirResultado' || data.fields[j].field === 'validaPorExamen' ||
                        data.fields[j].field === 'desvalidaExamen' || data.fields[j].field === 'imprimirExamen' ||
                        data.fields[j].field === 'facturacionCentral' || data.fields[j].field === 'facturacionAutomatica' ||
                        data.fields[j].field === 'facturaPorCorreo' || data.fields[j].field === 'reporteCajaPorHora' ||
                        data.fields[j].field === 'AdicionClientesIngreso' || data.fields[j].field === 'ManejoDescuentoGeneral' ||
                        data.fields[j].field === 'DescuentoPorPrueba' || data.fields[j].field === 'ManejoTemperatura' ||
                        data.fields[j].field === 'LoginActiveDirectory' || data.fields[j].field === 'IntegracionDatabank' ||
                        data.fields[j].field === 'TomaMuestraHospitalaria' || data.fields[j].field === 'Homebound' ||
                        data.fields[j].field === 'IntegracionHomebound' || data.fields[j].field === 'IntegracionQM' ||
                        data.fields[j].field === 'TableroTomaDeMuestra' || data.fields[j].field === 'TableroProductividadPorSeccion' ||
                        data.fields[j].field === 'TableroTiempoDeOportunidad' || data.fields[j].field === 'TableroValidacion' ||
                        data.fields[j].field === 'TableroCalificacionDelServicio' || data.fields[j].field === 'TableroSeguimientoDePruebas' ||
                        data.fields[j].field === 'IntegracionSiigo' || data.fields[j].field === 'IntegracionFacturacionExterna' ||
                        data.fields[j].field === 'ManejoDemograficoConsultaWeb'
                    ) {
                        var object = {
                            'mastert': ($filter('translate')('0665')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue.substring(1, data.fields[j].oldValue.length - 1) === 'True' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue.substring(1, data.fields[j].newValue.length - 1) === 'True' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'GradillaPendienteColor' || data.fields[j].field === 'GradillaGeneral' || data.fields[j].field === 'GradillaCondifencialesColor') {
                        var object = {
                            'mastert': ($filter('translate')('0665')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : '<span style="color:' + data.fields[j].oldValue + ' !important;font-size: 15px">■</span>',
                            'after': data.fields[j].newValue === null ? '' : '<span style="color:' + data.fields[j].newValue + ' !important;font-size: 15px">■</span>',
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'ManejoServicio' ||
                        data.fields[j].field === 'ManejoMedico' ||
                        data.fields[j].field === 'ManejoRaza' ||
                        data.fields[j].field === 'ManejoTipoDocumento' ||
                        data.fields[j].field === 'HistoriaAutomatica' ||
                        data.fields[j].field === 'SecurityPolitics' ||
                        data.fields[j].field === 'ManejoMultiSedes' ||
                        data.fields[j].field === 'DemographicsByBranch') {
                        var object = {
                            'mastert': ($filter('translate')('0992')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'Entidad' || data.fields[j].field === 'Abreviatura' ||
                        data.fields[j].field === 'FormatoTelefono' || data.fields[j].field === 'FormatoFecha' ||
                        data.fields[j].field === 'SeparadorLista' || data.fields[j].field === 'DiasClave' ||
                        data.fields[j].field === 'SessionExpirationTime' ||
                        data.fields[j].field === 'TokenExpirationTime' ||
                        data.fields[j].field === 'UrlDischarge' ||
                        data.fields[j].field === 'UrlSecurity' ||
                        data.fields[j].field === 'UrlDischarge' ||
                        data.fields[j].field === 'ValorInicialTipoOrden' ||
                        data.fields[j].field === 'UrlLIS') {
                        var object = {
                            'mastert': ($filter('translate')('0992')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'DemograficoExcluirPrueba' || data.fields[j].field === 'DemograficoPyP' ||
                        data.fields[j].field === 'DemograficoTituloInforme' ||
                        data.fields[j].field === 'DemograficoInconsistensias' || data.fields[j].field === 'DemograficoHistograma' ||
                        data.fields[j].field === 'DemograficoItemHistograma' ||
                        data.fields[j].field === 'ContraseñaDemograficoConsultaWeb' ||
                        data.fields[j].field === 'ManejoDemograficoConsultaWeb' ||
                        data.fields[j].field === 'DemograficoConsultaWeb' ||
                        data.fields[j].field === 'DemograficoEncriptacionCorreo' ||
                        data.fields[j].field === 'UbicacionHospitalaria' ||
                        data.fields[j].field === 'DemograficoEnvioCorreoAutomatico' ||
                        data.fields[j].field === 'ItemDemograficoEnvioCorreoAutomatico' ||
                        data.fields[j].field === 'ItemDemograficoFacturacionEstado' ||
                        data.fields[j].field === 'ItemDemograficoFacturacionMunicipio' ||
                        data.fields[j].field === 'idItemDemoGestacion' ||
                        data.fields[j].field === 'idItemDemoEpsArs' ||
                        data.fields[j].field === 'DemograficSedeCentraloEncriptacionCorreo') {
                        var object = {
                            'mastert': ($filter('translate')('0780')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else {
                        var object = {
                            'mastert': ($filter('translate')('0665')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
            if (name === 5) { //Agrupación de órdenes
                for (var j = 0; j < data.fields.length; j++) {
                    var oldValue = JSON.parse(data.fields[j].oldValue);
                    var newValue = JSON.parse(data.fields[j].newValue);
                    var listold = '';
                    var listnew = '';
                    if (oldValue.length !== 0) {
                        oldValue = _.groupBy(oldValue, 'columnName');
                        for (var propiedad in oldValue) {
                            if (oldValue.hasOwnProperty(propiedad)) {
                                listold = listold + '<b>' + $filter('translate')('1402') + ':</b><br>' +
                                    propiedad +
                                    '<br>' +
                                    '<b> ' + $filter('translate')('0088') + ':</b><br>';
                                oldValue[propiedad].forEach(function (value, key) {
                                    listold = listold + value.orderType.name + '<br>';
                                });
                            }
                            listold = listold + '<br>';
                        }
                    }
                    if (newValue.length !== 0) {
                        newValue = _.groupBy(newValue, 'columnName');
                        for (var propiedad in newValue) {
                            if (newValue.hasOwnProperty(propiedad)) {
                                listnew = listnew + '<b>' + $filter('translate')('1402') + ':</b><br>' +
                                    propiedad +
                                    '<br>' +
                                    '<b> ' + $filter('translate')('0088') + ':</b><br>';
                                newValue[propiedad].forEach(function (value, key) {
                                    listnew = listnew + value.orderType.name + '<br>';
                                });
                            }
                            listnew = listnew + '<br>';
                        }
                    }
                    var object = {
                        'mastert': ($filter('translate')('1403')).toUpperCase(),
                        'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                        'name': $filter('translate')('1404'),
                        'before': listold,
                        'after': listnew,
                        'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                        'user': data.userName
                    };
                    datauser.push(object);
                }
                return datauser;
            }
            if (name === 6) { //festivos
                for (var j = 0; j < data.fields.length; j++) {
                    if (data.fields[j].field === 'state') {
                        var object = {
                            'mastert': ($filter('translate')('0993')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : data.fields[j].oldValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'after': data.fields[j].newValue === null ? '' : data.fields[j].newValue === 'true' ? $filter('translate')('1091') : $filter('translate')('1092'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field === 'date') {
                        var object = {
                            'mastert': ($filter('translate')('0993')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue === null ? '' : moment(parseInt(data.fields[j].oldValue)).format('DD/MM/YYYY'),
                            'after': data.fields[j].newValue === null ? '' : moment(parseInt(data.fields[j].newValue)).format('DD/MM/YYYY'),
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    } else if (data.fields[j].field !== 'id' && data.fields[j].field !== 'user' && data.fields[j].field !== 'lastTransaction') {
                        var object = {
                            'mastert': ($filter('translate')('0993')).toUpperCase(),
                            'state': data.state === 'U' ? ($filter('translate')('0354')).toUpperCase() : ($filter('translate')('1014')).toUpperCase(),
                            'name': labelaudit.changelabels(data.fields[j].field),
                            'before': data.fields[j].oldValue,
                            'after': data.fields[j].newValue,
                            'date': moment(data.date).format('DD/MM/YYYY, HH:mm:ss'),
                            'user': data.userName
                        };
                        datauser.push(object);
                    }
                }
                return datauser;
            }
        }
    }
})();
/* jshint ignore:end */



