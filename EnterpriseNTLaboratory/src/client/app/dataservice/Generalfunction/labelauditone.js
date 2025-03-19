/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('labelauditone', labelauditone);

    labelauditone.$inject = ['$filter'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function labelauditone($filter) {
        var service = {
            changelabels: changelabels
        };

        return service;
        function changelabels(name) {
            if (name === 'PyP Demographic' || name === 'Pruebas por demográfico. PyP' ||
                name === 'Pruebas por demografico PyP') { return $filter('translate')('1279'); }
            if (name === 'Excluir pruebas por') { return $filter('translate')('1414'); }
            if (name === 'Delta Check' || name === 'Delta check') { return $filter('translate')('0357'); }
            if (name === 'Reference Values' || name === 'Valores de Referencia') {
                return $filter('translate')('0394');
            }
            if (name === 'Print Order' || name === 'Orden de impresión' || name === 'Orden de impresión' ||
                name === 'Orden de impresion') {
                return $filter('translate')('1035');
            }
            if (name === 'Results' || name === 'Resultado literal') { return $filter('translate')('1000'); }
            if (name === 'Prueba automática' || name === 'Prueba automatica') { return $filter('translate')('1039'); }
            if (name === 'Exclude Tests' || name === 'Resultado literal por prueba') {
                return $filter('translate')('1040');
            }
            if (name === 'Traceability' || name === 'Trazabilidad') { return $filter('translate')('0046'); }
            if (name === 'Fridge' || name === 'Nevera') { return $filter('translate')('0710'); }
            if (name === 'Reason' || name === 'Motivo') { return $filter('translate')('0113'); }
            if (name === 'Destinations' || name === 'Destino') { return $filter('translate')('0157'); }
            if (name === 'Destination Allocation' || name === 'Asignación de destino' ||
                name === 'Asignacion de destino') {
                return $filter('translate')('1041');
            }
            if (name === 'Microbiology') { return $filter('translate')('0225'); }
            if (name === 'Verificacion de microbiología') { return $filter('translate')('0024'); }
            if (name === 'Antibiograma') { return $filter('translate')('0414'); }
            if (name === 'Estadísticas') { return $filter('translate')('0029'); }
            if (name === 'Almacén de muestras' || name === 'Almacen de muestras') {
                return $filter('translate')('0043');
            }
            if (name === 'Reference Values - Antibiotics' || name === 'Valores de referencia de antibiótico' ||
                name === 'Valores de referencia de antibiotico') { return $filter('translate')('1002'); }
            if (name === 'Microbiology Destinations' || name === 'Destino de microbiología' ||
                name === 'Destino de microbiologia') { return $filter('translate')('1003'); }
            if (name === 'Anatomical site' || name === 'Sitio anatómico' || name === 'Sitio anatomico') {
                return $filter('translate')('0462');
            }
            if (name === 'Task' || name === 'Tarea') { return $filter('translate')('0578'); }
            if (name === 'Collect Method' || name === 'Método de recolección' || name === 'Metodo de recoleccion') {
                return $filter('translate')('0461');
            }
            if (name === 'Process' || name === 'Procedimiento') { return $filter('translate')('0487'); }
            if (name === 'Assignment of Proof - Procedure' || name === 'Procedimiento por prueba') {
                return $filter('translate')('1044');
            }
            if (name === 'Testing Assignment - Culture Medium' || name === 'Medio de cultivo por prueba') {
                return $filter('translate')('1045');
            }
            if (name === 'Sub-Sample' || name === 'Submuestra') { return $filter('translate')('0460'); }
            if (name === 'Opportunity' || name === 'Oportunidad') { return $filter('translate')('0639'); }
            if (name === 'Histogram' || name === 'Histograma') { return $filter('translate')('0038'); }
            if (name === 'Sample By Service' || name === 'Muestra por servicio') {
                return $filter('translate')('1046');
            }
            if (name === 'Sample opportunity' || name === 'Oportunidad de la muestra') {
                return $filter('translate')('1047');
            }
            if (name === 'Test Opportunity' || name === 'Oportunidad de la prueba') {
                return $filter('translate')('1048');
            }
            if (name === 'Integration' || name === 'Integración' || name === 'Integracion') {
                return $filter('translate')('1280');
            }
            if (name === 'Middleware Laboratory Settings' || name === 'Integración de Middleware por laboratorio.' ||
                name === 'Integracion de Middleware por laboratorio.') { return $filter('translate')('1281'); }
            if (name === 'Central System' || name === 'Sistema central') { return $filter('translate')('1004'); }
            if (name === 'User Homologation' || name === 'Homologación de usuarios' ||
                name === 'Homologacion de usuarios') {
                return $filter('translate')('1005');
            }
            if (name === 'Demographic Homologation' || name === 'Homologación de demograficos' ||
                name === 'Homologacion de demograficos') {
                return $filter('translate')('1049');
            }
            if (name === 'Test Homologation' || name === 'Homologación de pruebas' ||
                name === 'Homologacion de pruebas') {
                return $filter('translate')('1050');
            }
            if (name === 'Middleware Forwarding Information') { return $filter('translate')('1282'); }
            if (name === 'Billing' || name === 'billing' || name === 'Facturacion' || name === 'Facturación') {
                return $filter('translate')('1283');
            }
            if (name === 'Payment Types' || name === 'Tipos de pago') { return $filter('translate')('1284'); }
            if (name === 'Client' || name === 'Cliente') { return $filter('translate')('0085'); }
            if (name === 'Resolution' || name === 'Resoluciónes' || name === 'Resoluciones') {
                return $filter('translate')('1009');
            }
            if (name === 'Customer Rates' || name === 'Tarifa por cliente') { return $filter('translate')('1060'); }
            if (name === 'Days Alarm' || name === 'Días alarma pendientes de pago' ||
                name === 'Dias alarma pendientes de pago') {
                return $filter('translate')('1061');
            }
            if (name === 'EDI' || name === 'Protocolo EDI') { return $filter('translate')('1008'); }
            if (name === 'Tax by Test' || name === 'Impuesto por prueba') { return $filter('translate')('1062'); }
            if (name === 'Valid' || name === 'Vigencia') { return $filter('translate')('1010'); }
            if (name === 'Price Assigment' || name === 'Asignación de precios por tarifa' ||
                name === 'Asignacion de precios por tarifa') {
                return $filter('translate')('1063');
            }
            if (name === 'Role' || name === 'Rol') { return $filter('translate')('1013'); }
            if (name === 'Trazabilidad muestras') { return $filter('translate')('0627'); }
            if (name === 'Entrada de muestras') { return $filter('translate')('0014'); }
            if (name === 'Almacen de muestras') { return $filter('translate')('1285'); }
            if (name === 'Ingreso de ordenes' || name === 'entry' || name === 'Ordenes de laboratorio') {
                return $filter('translate')('0011');
            }
            if (name === 'Listados') { return $filter('translate')('0015'); }
            if (name === 'Historias clínicas' || name === 'Historias clinicas') { return $filter('translate')('0017'); }
            if (name === 'Creación de órdenes sin historia' || name === 'Ordenes sin historia') {
                return $filter('translate')('0252');
            }
            if (name === 'Asignación de historias' || name === 'Asignacion de historias') {
                return $filter('translate')('0016');
            }
            if (name === 'Borrados especiales') { return $filter('translate')('0050'); }
            if (name === 'Reasignacion de historias') { return $filter('translate')('0044'); }
            if (name === 'Activacion de órdenes' || name === 'Activacion de ordenes') {
                return $filter('translate')('0045');
            }
            if (name === 'Inconsistencias') { return $filter('translate')('0051'); }
            if (name === 'Desbloqueo de historia/orden') { return $filter('translate')('0055'); }
            if (name === 'Citas') { return $filter('translate')('0012'); }
            if (name === 'Reenvío al middleware' || name === 'Reenvio a middleware') {
                return $filter('translate')('1415');
            }
            if (name === 'Toma Muestra') { return $filter('translate')('0165'); }
            if (name === 'Resultados') { return $filter('translate')('0027'); }
            if (name === 'Registro de resultados' || name === 'RegistroResultados') {
                return $filter('translate')('0019');
            }
            if (name === 'Revisión de resultados' || name === 'Revision de resultados') {
                return $filter('translate')('0023');
            }
            if (name === 'Hojas de trabajo') { return $filter('translate')('0018'); }
            if (name === 'Registro de resultados por demanda' || name === 'Registro de resultados por lote' ||
                name === 'Rango de resultados') {
                return $filter('translate')('0020');
            }
            if (name === 'Validacion de resultados') { return $filter('translate')('0022'); }
            if (name === 'Verificacion de microbiología' || name === 'Verificacion de microbiologia') {
                return $filter('translate')('0024');
            }
            if (name === 'Siembra de microbiología' || name === 'SiembraMicrobiologia' ||
                name === 'Siembra de microbiologia') {
                return $filter('translate')('0025');
            }
            if (name === 'Lectura de microbiología' || name === 'Lectura de microbiologia') {
                return $filter('translate')('0026');
            }
            if (name === 'Informes y consultas') { return $filter('translate')('0028'); }
            if (name === 'Informes') { return $filter('translate')('0031'); }
            if (name === 'Control entrega de informes') { return $filter('translate')('0032'); }
            if (name === 'Consultas') { return $filter('translate')('0033'); }
            if (name === 'Estadísticas especiales' || name === 'Estadisticas especiales') {
                return $filter('translate')('0034');
            }
            if (name === 'Estadísticas con precios' || name === 'Estadisticas con precios') {
                return $filter('translate')('0035');
            }
            if (name === 'Alerta temprana') { return $filter('translate')('0036'); }
            if (name === 'Indicadores') { return $filter('translate')('0037'); }
            if (name === 'Plano whonet') { return $filter('translate')('0039'); }
            if (name === 'Muestras en destinos') { return $filter('translate')('0041'); }
            if (name === 'Microbiologia') { return $filter('translate')('0225'); }
            if (name === 'Reporte estadistica y facturación') { return $filter('translate')('0042'); }
            if (name === 'Auditoría' || name === 'Auditoria') { return $filter('translate')('0925'); }
            if (name === 'Trazabilidad') { return $filter('translate')('0046'); }
            if (name === 'Auditoría de órdenes' || name === 'Auditoria de ordenes') {
                return $filter('translate')('0926');
            }
            if (name === 'Auditoría de maestros' || name === 'Auditoria de maestros') {
                return $filter('translate')('0927');
            }
            if (name === 'Auditoría de usuarios' || name === 'Auditoria de usuarios') {
                return $filter('translate')('0928');
            }
            if (name === 'Control de acceso usuarios') { return $filter('translate')('0929'); }
            if (name === 'Utilidades') { return $filter('translate')('0030'); }
            if (name === 'Visor de sesiones') { return $filter('translate')('0933'); }
            if (name === 'Visor de sucesos') { return $filter('translate')('0047'); }
            if (name === 'Contador de ordenes' || name === 'Reiniciar contador') {
                return $filter('translate')('0951');
            }
            if (name === 'Edicion de Reportes') { return $filter('translate')('0782'); }
            if (name === 'Kardex') { return $filter('translate')('0048'); }
            if (name === 'Rips') { return $filter('translate')('0049'); }
            if (name === 'Examen en analizador') { return $filter('translate')('0052'); }
            if (name === 'Consulta web') { return $filter('translate')('0053'); }
            if (name === 'Notas') { return $filter('translate')('0054'); }
            if (name === 'Prueba de impresión') { return $filter('translate')('0057'); }
            if (name === 'log Ingreso') { return $filter('translate')('0058'); }
            if (name === 'identification') { return $filter('translate')('0132'); }
            if (name === 'password') { return $filter('translate')('0002'); }
            if (name === 'confirmPassword') { return $filter('translate')('1287'); }
            if (name === 'activation') { return $filter('translate')('1288'); }
            if (name === 'expiration') { return $filter('translate')('1289'); }
            if (name === 'Resultado') { return $filter('translate')('0289'); }
            if (name === 'passwordExpiration') { return $filter('translate')('1290'); }
            if (name === 'signatureCode') { return $filter('translate')('1291'); }
            if (name === 'maxDiscount' || name === 'discount') {
                return $filter('translate')('1292');
            }
            if (name === 'typeUser') { return $filter('translate')('1293'); }
            if (name === 'addExams') { return $filter('translate')('0143'); }
            if (name === 'editPatients') { return $filter('translate')('0145'); }
            if (name === 'printInReports') { return $filter('translate')('0142'); }
            if (name === 'creatingItems') { return $filter('translate')('0146'); }
            if (name === 'secondValidation') { return $filter('translate')('0144'); }
            if (name === 'printResults') { return $filter('translate')('0147'); }
            if (name === 'quitValidation') { return $filter('translate')('0148'); }
            if (name === 'typeOrder') { return $filter('translate')('1294'); }
            if (name === 'roles') { return $filter('translate')('1295'); }
            if (name === 'DigitosOrden') { return $filter('translate')('1296'); }
            if (name === 'NumeroOrdenAutomatico') { return $filter('translate')('1297'); }
            if (name === 'TipoNumeroOrden') { return $filter('translate')('1298'); }
            if (name === 'DiasMaximoModificarOrden') { return $filter('translate')('1299'); }
            if (name === 'AnularOrdenValidada') { return $filter('translate')('1300'); }
            if (name === 'AgregarExamenesMuestras') { return $filter('translate')('1301'); }
            if (name === 'AlarmaUltimaOrden') { return $filter('translate')('1302'); }
            if (name === 'Nombres') { return $filter('translate')('1303'); }
            if (name === 'Apellidos') { return $filter('translate')('1304'); }
            if (name === 'FormatoHistoria') { return $filter('translate')('1305'); }
            if (name === 'ManejoTalla') { return $filter('translate')('1306'); }
            if (name === 'ManejoPeso') { return $filter('translate')('1307'); }
            if (name === 'ContrasenaPaciente') { return $filter('translate')('1308'); }
            if (name === 'VisualizarFotoPaciente') { return $filter('translate')('1309'); }
            if (name === 'SeparadorMuestra') { return $filter('translate')('1310'); }
            if (name === 'ImprimirEtiquetaAdicional') { return $filter('translate')('0159'); }
            if (name === 'ImprimirEtiquetaAutomaticamente') { return $filter('translate')('1311'); }
            if (name === 'VerPreliminarTalon') { return $filter('translate')('1312'); }
            if (name === 'DigitoAño') { return $filter('translate')('1313'); }
            if (name === 'ComentarioRegistroRestringido') { return $filter('translate')('1314'); }
            if (name === 'ComentarioResultadoPendiente') { return $filter('translate')('1315'); }
            if (name === 'WidgetResultados' || name === 'WidgetMuestraTiempo') { return $filter('translate')('1316'); }
            if (name === 'MotivoModificacionResultado') { return $filter('translate')('1317'); }
            if (name === 'UrlNodeJs') { return $filter('translate')('1318'); }
            if (name === 'VerPreliminarRegistro') { return $filter('translate')('1319'); }
            if (name === 'EntregaInformesSede') { return $filter('translate')('1320'); }
            if (name === 'GeneraNombrePDFHistoria') { return $filter('translate')('1321'); }
            if (name === 'IdentificarCopiasInformes') { return $filter('translate')('1322'); }
            if (name === 'ImprimirAdjuntos') { return $filter('translate')('1323'); }
            if (name === 'ImprimirAdjuntosPreliminar') { return $filter('translate')('1324'); }
            if (name === 'TipoImpresion') { return $filter('translate')('1325'); }
            if (name === 'ResolverImpresora') { return $filter('translate')('1326'); }
            if (name === 'ImprimirInformeFinal') { return $filter('translate')('1327'); }
            if (name === 'SmtpHostName') { return $filter('translate')('1328'); }
            if (name === 'SmtpPort') { return $filter('translate')('1329'); }
            if (name === 'SmtpSSL') { return $filter('translate')('1330'); }
            if (name === 'SmtpAuthUser') { return $filter('translate')('1331'); }
            if (name === 'SmtpPasswordUser') { return $filter('translate')('1332'); }
            if (name === 'EnviarCorreo') { return $filter('translate')('1333'); }
            if (name === 'EmailSubjectPhysician') { return $filter('translate')('1334'); }
            if (name === 'EmailBody') { return $filter('translate')('1335'); }
            if (name === 'MostrarReLlamadoColumna') { return $filter('translate')('1336'); }
            if (name === 'OrdenamientoRegistroResultados') { return $filter('translate')('1337'); }
            if (name === 'EntrevistaPanicoObligatoria') { return $filter('translate')('1338'); }
            if (name === 'ManejoTarifa' || name === 'Rate' || name === 'Tarifa') {
                return $filter('translate')('0087');
            }
            if (name === 'ManejoCliente') { return $filter('translate')('0085'); }
            if (name === 'Caja') { return $filter('translate')('0779'); }
            if (name === 'RestarImpuesto') { return $filter('translate')('1339'); }
            if (name === 'ManejoCentavos') { return $filter('translate')('1340'); }
            if (name === 'Impuesto') { return $filter('translate')('1341'); }
            if (name === 'Moneda') { return $filter('translate')('1342'); }
            if (name === 'SimboloMonetario') { return $filter('translate')('1343'); }
            if (name === 'Trazabilidades') { return $filter('translate')('1344'); }
            if (name === 'DestinoVerificaCentralMuestras') { return $filter('translate')('1345'); }
            if (name === 'DestinoVerificaDesecho') { return $filter('translate')('1346'); }
            if (name === 'GradillaGeneral') { return $filter('translate')('1347'); }
            if (name === 'GradillaPendienteColor') { return $filter('translate')('1348'); }
            if (name === 'GradillaCondifencialesColor') { return $filter('translate')('1349'); }
            if (name === 'GradillaPendiente') { return $filter('translate')('1350'); }
            if (name === 'GradillaConfidenciales') { return $filter('translate')('1351'); }
            if (name === 'Fila') { return $filter('translate')('0807'); }
            if (name === 'Columna') { return $filter('translate')('0808'); }
            if (name === 'HorarioAtencionDesde') { return $filter('translate')('1352'); }
            if (name === 'HorarioAtencionHasta') { return $filter('translate')('1353'); }
            if (name === 'IntervalosCitas') { return $filter('translate')('1354'); }
            if (name === 'CantidadCitasIntervalo') { return $filter('translate')('1355'); }
            if (name === 'ServidorLDAP') { return $filter('translate')('1356'); }
            if (name === 'UsuarioLDAP') { return $filter('translate')('1357'); }
            if (name === 'ClaveLDAP') { return $filter('translate')('1358'); }
            if (name === 'GrupoLIS') { return $filter('translate')('1359'); }
            if (name === 'IngresoEntrevista') { return $filter('translate')('1360'); }
            if (name === 'RangoInicial') { return $filter('translate')('1361'); }
            if (name === 'RangoFinal') { return $filter('translate')('1362'); }
            if (name === 'SeparadorLista') { return $filter('translate')('1363'); }
            if (name === 'DiasClave') { return $filter('translate')('1364'); }
            if (name === 'DestinoVerificaMicrobiologia') { return $filter('translate')('1365'); }
            if (name === 'RegistroCMIM') { return $filter('translate')('1366'); }
            if (name === 'WhonetTHM') { return $filter('translate')('1367'); }
            if (name === 'WhonetAPB') { return $filter('translate')('1368'); }
            if (name === 'WhonetEDTA') { return $filter('translate')('1369'); }
            if (name === 'WhonetTipo') { return $filter('translate')('1370'); }
            if (name === 'IntegracionDashBoard') { return $filter('translate')('1371'); }
            if (name === 'UrlDashBoard') { return $filter('translate')('1372'); }
            if (name === 'IntegracionSIGA') { return $filter('translate')('1373'); }
            if (name === 'UrlSIGA') { return 'URL SIGA'; }
            if (name === 'SedeSIGA') { return $filter('translate')('1374'); }
            if (name === 'OrdenesSIGA') { return $filter('translate')('1375'); }
            if (name === 'VerificacionSIGA') { return $filter('translate')('1376'); }
            if (name === 'manejoEventos') { return $filter('translate')('1377'); }
            if (name === 'UrlEventos') { return $filter('translate')('1378'); }
            if (name === 'crearOrden') { return $filter('translate')('1379'); }
            if (name === 'modificarOrden') { return $filter('translate')('1380'); }
            if (name === 'anularOrden') { return $filter('translate')('1381'); }
            if (name === 'validaOrden') { return $filter('translate')('1382'); }
            if (name === 'tomarMuestra') { return $filter('translate')('1383'); }
            if (name === 'verificarMuestra') { return $filter('translate')('1384'); }
            if (name === 'ingresarResultado') { return $filter('translate')('1385'); }
            if (name === 'modificarResultado') { return $filter('translate')('1386'); }
            if (name === 'repetirResultado') { return $filter('translate')('1387'); }
            if (name === 'validaPorExamen') { return $filter('translate')('1388'); }
            if (name === 'desvalidaExamen') { return $filter('translate')('1389'); }
            if (name === 'imprimirExamen') { return $filter('translate')('1390'); }
            if (name === 'Abreviatura') { return $filter('translate')('1391'); }
            if (name === 'FormatoTelefono') { return $filter('translate')('1392'); }
            if (name === 'FormatoFecha') { return $filter('translate')('1393'); }
            if (name === 'ManejoServicio') { return $filter('translate')('1394'); }
            if (name === 'ManejoMedico') { return $filter('translate')('1395'); }
            if (name === 'ManejoRaza') { return $filter('translate')('1396'); }
            if (name === 'ManejoTipoDocumento') { return $filter('translate')('1397'); }
            if (name === 'HistoriaAutomatica') { return $filter('translate')('1398'); }
            if (name === 'panicA') { return $filter('translate')('0356'); }
            if (name === 'typeInterview') { return $filter('translate')('1399'); }
            if (name === 'control') { return $filter('translate')('1406'); }
            if (name === 'answers' || name === 'Respuestas') { return $filter('translate')('1099'); }
            if (name === 'url'|| name === 'urlConnection') { return 'URL'; }
            if (name === 'nameDiagnostic') { return $filter('translate')('0258'); }
            if (name === 'checkI' || name === 'Verificación de muestra' || name === 'Ruta de la muestra') {
                return $filter('translate')('0116');
            }
            if (name === 'Gestión de órdenes' || name === 'Gestion de ordenes') { return $filter('translate')('1109'); }
            if (name === 'Gestión de historias' || name === 'Gestion de pacientes') {
                return $filter('translate')('1110');
            }
            if (name === 'Edición de Reportes' || name === 'Editor de informes') {
                return $filter('translate')('1416');
            }
            if (name === 'Edición de código de barras' || name === 'Editor de codigos de barras') {
                return $filter('translate')('1417');
            }
            if (name === 'usuarioE') { return $filter('translate')('0997'); }
            if (name === 'DemográficosE') { return $filter('translate')('1064'); }
            if (name === 'DiasClave') { return $filter('translate')('1429'); }
            if (name === 'SessionExpirationTime') { return $filter('translate')('1430'); }
            if (name === 'TokenExpirationTime') { return $filter('translate')('1431'); }
            if (name === 'DemograficoExcluirPrueba') { return $filter('translate')('1432'); }
            if (name === 'DemograficoPyP') { return $filter('translate')('1433'); }
            if (name === 'DemograficoTituloInforme') { return $filter('translate')('1434'); }
            if (name === 'ValorInicialTipoOrden') { return $filter('translate')('1294'); }
            if (name === 'DemograficoInconsistensias') { return $filter('translate')('1435'); }
            if (name === 'DemograficoHistograma') {
                return $filter('translate')('1436');            }
            if (name === 'DemograficoItemHistograma') { return $filter('translate')('1437'); } 

            if (name === 'SecurityPolitics') {  return $filter('translate')('1767'); }
            if (name === 'ManejoMultiSedes') { return $filter('translate')('1768'); }
            if (name === 'DemographicsByBranch') { return $filter('translate')('1769'); }
            if (name === 'UrlDischarge') { return $filter('translate')('1770'); }
            if (name === 'UrlSecurity') { return $filter('translate')('1771'); }
            if (name === 'UrlLIS')  { return $filter('translate')('1772'); }
            if (name === 'Diagnostics')  { return $filter('translate')('1773'); }
            if (name === 'CodigoDemograficoIngreso')  { return $filter('translate')('1774'); }
            if (name === 'MotivoModificacionOrden')  { return $filter('translate')('1775'); }
            if (name === 'EmailSubjectPatient') { return $filter('translate')('1776'); }
            if (name === 'ServidorCorreo')  { return $filter('translate')('1777'); }
            if (name === 'SmtpProtocol')  { return $filter('translate')('1778'); }
            if (name === 'verAnalitosDelPerfil')  { return $filter('translate')('1779'); }
            if (name === 'MaleValue')  { return $filter('translate')('1780'); }
            if (name === 'FemaleValue')  { return $filter('translate')('1781'); }
            if (name === 'UndefinedValue')  { return $filter('translate')('1782'); }
            if (name === 'facturacionCentral')  { return $filter('translate')('1783'); }
            if (name === 'facturacionAutomatica')  { return $filter('translate')('1784'); }
            if (name === 'facturaPorCorreo')  { return $filter('translate')('1785'); }
            if (name === 'reporteCajaPorHora')  { return $filter('translate')('1786'); }        
            if (name === 'UrlApiFacturacion')  { return $filter('translate')('1787'); }
            if (name === 'AdicionClientesIngreso')  { return $filter('translate')('1788'); }
            if (name === 'ManejoDescuentoGeneral')  { return $filter('translate')('1789'); }
            if (name === 'DescuentoPorPrueba')  { return $filter('translate')('1790'); }
            if (name === 'ManejoTemperatura')  { return $filter('translate')('1791'); }
            if (name === 'LoginActiveDirectory')  { return $filter('translate')('1792'); }
            if (name === 'DomainLDAP')  { return $filter('translate')('1793'); }           
            if (name === 'VerificacionMuestra')  { return $filter('translate')('1794'); }
            if (name === 'RangoInicialCitas')  { return $filter('translate')('1795'); }
            if (name === 'RangoFinalCitas')  { return $filter('translate')('1796'); }
            if (name === 'IntegracionDatabank')  { return $filter('translate')('1797'); }
            if (name === 'UrlDatabank') { return $filter('translate')('1798'); }
            if (name === 'TomaMuestraHospitalaria')  { return $filter('translate')('1799'); }
            if (name === 'Homebound') { return "Activar homebound"; }
            if (name === 'IntegracionHomebound') { return "Activar toma de muestra domiciliaria"; }
            if (name === 'UrlHomebound') { return "URL homebound"; }
            if (name === 'SeccionEnvioDatabank') { return "Área Integración databank"; }
            if (name === 'CodigoPruebaCruzada') { return "Código de pruebas cruzadas databank"; }
            if (name === 'SedeVerificacionDatabank') { return "Sede de verificación databank"; }
            if (name === 'IntegracionQM') { return "Activar QM"; }
            if (name === 'UrlQM') { return "URL QM"; }
            if (name === 'TableroTomaDeMuestra') { return "Activar tablero toma de muestra"; }
            if (name === 'TableroProductividadPorSeccion') { return "Activar tablero Productividad por sección"; }
            if (name === 'TableroTiempoDeOportunidad') { return "Activar tablero Tiempo de oportunidad"; }
            if (name === 'TableroValidacion') { return "Activar tablero Tablero validación"; }
            if (name === 'TableroCalificacionDelServicio') { return "Activar tablero Calificación de servicioa"; }
            if (name === 'TableroSeguimientoDePruebas') { return "Activar tablero Seguimiento de prueba"; }
            if (name === 'IntegracionSiigo') { return "Activar SIIGO"; }
            if (name === 'UrlSiigo') { return "URL SIIGO"; }
            if (name === 'SiigoCentralSystem') { return "Sistema central SIIGO"; }
            if (name === 'SiigoAccessKey') { return "LLave de suscripción SIIGO"; }
            if (name === 'SiigoUserName') { return "Usuario SIIGO"; }
            if (name === 'SiigoIdPagoContado') { return "Id pago contado SIIGO"; }
            if (name === 'SiigoIdPagoCredito') { return "Id pago crédito SIIGO"; }
            if (name === 'SiigoCodigoComprobante') { return "Código Comprobante SIIGO"; }
            if (name === 'SiigoCodigoComprobanteNC') { return "Código comprobante nota crédito SIIGO"; }
            if (name === 'IntegracionFacturacionExterna') { return "Integración facturación externa SIIGO"; }
            if (name === 'UrlFacturacionExterna') { return "URL facturación externa SIIGO"; }
            if (name === 'ApiFacturacionIdUsuario') { return "Usuario para trazabilidad SIIGO"; } 
            if (name === 'PruebasNotificacionObligatoria') { return "Pruebas Notificacion Obligatoria uno"; } 
            if (name === 'PruebasNotificacionObligatoriaUno') { return "Pruebas Notificacion Obligatoria dos"; } 
            if (name === 'PruebasNotificacionObligatoriaDos') { return "Pruebas Notificacion Obligatoria tres"; }           
            if (name === 'CorreosNotificacionObligatoria') { return "Correos Notificacion Obligatoria uno"; } 
            if (name === 'CorreosNotificacionObligatoriaUno') { return "Correos Notificacion Obligatoria dos"; } 
            if (name === 'CorreosNotificacionObligatoriaDos') { return "Correos Notificacion Obligatoria tres"; } 
            if (name === 'AsuntoNotificacionObligatoria') { return "Asunto Notificacion Obligatoria uno"; } 
            if (name === 'PlantillaNotificacionObligatoria') { return "Asunto Notificacion Obligatoria dos"; } 
            if (name === 'AsuntoNotificacionObligatoriaUno') { return "Asunto Notificacion Obligatoria tres"; } 
            if (name === 'PlantillaNotificacionObligatoriaUno') { return "Plantilla Notificacion Obligatoria uno"; }
            if (name === 'AsuntoNotificacionObligatoriaDos') { return "Plantilla Notificacion Obligatoria dos"; } 
            if (name === 'PlantillaNotificacionObligatoriaDos') { return "Plantilla Notificacion Obligatoria tres"; } 
            if (name === 'ReiniciarContador') { return "Reiniciar Contador"; } 
            if (name === 'notificacionUsuarios') { return "Notificacion usuarios"; }
            if (name === 'ContraseñaDemograficoConsultaWeb') { return "Contraseña genérica para consulta web"; } 
            if (name === 'ManejoDemograficoConsultaWeb') { return "Indica si se usa demográfico adicional para consulta web "; } 
            if (name === 'DemograficoConsultaWeb') { return "Demográfico consulta web"; } 
            if (name === 'DemograficoEncriptacionCorreo') { return "Demográfico para Encriptacion Correo"; } 
            if (name === 'UbicacionHospitalaria') { return "Ubicacion Hospitalaria"; } 
            if (name === 'DemograficoEnvioCorreoAutomatico') { return "Demográfico para envio de correo automático"; } 
            if (name === 'ItemDemograficoEnvioCorreoAutomatico') { return "Item para envio de correo automático"; } 
            if (name === 'ItemDemograficoFacturacionEstado') { return "Demográfico estado o departamento"; } 
            if (name === 'ItemDemograficoFacturacionMunicipio') { return "Demográfico municipio o ciudad"; } 
            if (name === 'idItemDemoGestacion') { return "Reporte 4505 demográfico de gestación"; } 
            if (name === 'idItemDemoEpsArs') { return "Reporte 4505 demográfico de EPS"; } 
            if (name === 'SedeCentral') { return "Sede central"; } 
            if (name ==='hospitalSampling'){ return "Aplica para toma de muestra hospitalaria"; } 
            if (name ==='priorityAlarm'){ return "Generar alarma por prioridad"; } 
            if (name === 'informedConsent') { return "Consentimiento informado"; } 
            if (name === 'qualityPercentage') { return "Alarma de calidad"; } 
            if (name === 'minimumTemperature') { return "Temperatura mínima"; }
            if (name === 'maximumTemperature') { return "Temperatura maxima"; }
            if (name === 'qualityTime') { return "Tiempo de calidad"; }
            if (name === 'coveredSample') { return "Muestra con tapa"; }
            if (name === 'nameUnit') { return "Unidad"; }
            if (name === 'nameLaboratory') { return "Nombre laboratorio"; }
            if (name === 'mandatoryNotation') { return "Notificación"; }
            if (name === 'invoice') { return "Facturación directa"; }
            if (name === 'agreement') { return "Convenio"; }
            if (name === 'currentNumber') { return "Número Actual"; } 
            if (name === 'municipality') { return "Municipio o ciudad"; } 
            if (name === 'applyParticular') { return "Aplica a particulares"; } 
            if (name === 'dashboard') { return "Permiso para ingresar a tableros"; } 
            if (name === 'preValidationRequired') { return "Validación preliminar"; } 
            if (name === 'Patología') { return "Patología"; } 
            if (name === 'Encriptar reporte') { return "Encriptar reporte"; } 
            if (name === 'valores por demográfico') { return "valores por demográfico"; } 
            if (name === 'Ítems demográfico por sede') { return "Ítems demográfico por sede"; } 
            if (name === 'Demográfico por sede') { return "Demográfico por sede"; } 
            if (name === 'Dependencia demográficos') { return "Dependencia demográficos"; } 
            if (name === 'Configuración demográficos') { return "Configuración demográficos"; } 
            if (name === 'Sede') { return "Sede"; } 
            if (name === 'laboratory') { return "laboratorio"; } 
            if (name === 'Configuración RIPS') { return "Configuración RIPS"; } 
            if (name === 'Tipos de Impuesto') { return "Tipos de Impuesto"; } 
            if (name === 'Impresoras fiscales') { return "Impresoras fiscales"; } 
            if (name === 'Contrato') { return "Contrato"; } 
            if (name === 'Integración - Analizador') { return "Integración - Analizador"; } 
            if (name === 'Patología') { return "Patología"; } 
            if (name === 'Contenedores') { return "Contenedores"; } 
            if (name === 'Espécimen') { return "Espécimen"; } 
            if (name === 'Organo') { return "Organo"; } 
            if (name === 'Tipo de Estudio') { return "Tipo de Estudio"; } 
            if (name === 'Casetes') { return "Casetes"; } 
            if (name === 'Fijadores') { return "Fijadores"; } 
            if (name === 'Coloraciones') { return "Coloraciones"; } 
            if (name === 'Patólogos') { return "Patólogos"; } 
            if (name === 'Protocolo') { return "Protocolo"; } 
            if (name === 'Programación de Agenda') { return "Programación de Agenda"; } 
            if (name === 'Eventos') { return "Eventos"; } 
            if (name === 'Campos') { return "Campos"; } 
            if (name === 'Plantillas Macroscópicas') { return "Plantillas Macroscópicas"; } 
            if (name === 'Horarios de procesamiento') { return "Horarios de procesamiento"; } 
            if (name === 'Gestión de muestras') { return "Gestión de muestras"; } 
            if (name === 'Consentimiento informado') { return "Consentimiento informado"; } 
            if (name === 'Estadistica') { return "Estadistica"; } 
            if (name === 'Reportes adicionales') { return "Reportes adicionales"; } 
            if (name === 'percentage') { return "Porcentaje"; } 
        }
    }
})();
/* jshint ignore:end */
