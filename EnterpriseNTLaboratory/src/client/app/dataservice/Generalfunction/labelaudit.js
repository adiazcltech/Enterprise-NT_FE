/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('labelaudit', labelaudit);

    labelaudit.$inject = ['$filter', 'labelauditone'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function labelaudit($filter, labelauditone) {
        var service = {
            changelabels: changelabels 
        };
        return service;
        function changelabels(name) {
            if (name === 'name' || name === 'text') { return $filter('translate')('0118'); }
            if (name === 'state' || name === 'active') { return $filter('translate')('0364'); }
            if (name === 'value') { return $filter('translate')('1090'); }
            if (name === 'code' || name === 'codesample' || name === 'orderingA' || name === 'codeR' || name === 'coded') {
                return $filter('translate')('0098');
            }
            if (name === 'abbr' || name === 'abbreviation') { return $filter('translate')('0198'); }
            if (name === 'responsable') { return $filter('translate')('1094'); }
            if (name === 'address') { return $filter('translate')('0187'); }
            if (name === 'phone') { return $filter('translate')('0188'); }
            if (name === 'email') { return $filter('translate')('0135'); }
            if (name === 'min') { return $filter('translate')('1096'); }
            if (name === 'max') { return $filter('translate')('1097'); }
            if (name === 'external') { return $filter('translate')('1095'); }
            if (name === 'color') { return $filter('translate')('1098'); }
            if (name === 'additionalReport') { return $filter('translate')('1093'); }
            if (name === 'address1' || name === 'addressT') { return $filter('translate')('0187') + ' 1'; }
            if (name === 'address2' || name === 'additionalAddress' || name === 'addAddressT') {
                return $filter('translate')('0187') + ' 2';
            }
            if (name === 'city') { return $filter('translate')('1152'); }
            if (name === 'fax') { return $filter('translate')('1153'); }
            if (name === 'identification') { return $filter('translate')('0132'); }
            if (name === 'lastName') { return $filter('translate')('0686'); }
            if (name === 'license') { return $filter('translate')('1154'); }
            if (name === 'npi') { return $filter('translate')('1155'); }
            if (name === 'providerId') { return $filter('translate')('1156'); }
            if (name === 'zipCode' || name === 'postalCode') { return $filter('translate')('1157'); }
            if (name === 'Contador Hematológico' || name === 'Contador Hematologico' ) {
                return $filter('translate')('0998');
            }
            if (name === 'specialty' || name === 'Specialty' || name === 'Especialidad') {
                return $filter('translate')('0991');
            }
            if (name === 'stateP') { return $filter('translate')('1158'); }
            if (name === 'encoded') { return $filter('translate')('1159'); }
            if (name === 'format') { return $filter('translate')('1160'); }
            if (name === 'modify') { return $filter('translate')('0354'); }
            if (name === 'obligatory') { return $filter('translate')('1161'); }
            if (name === 'canCreateItemInOrder') { return $filter('translate')('1162'); }
            if (name === 'statistics' || name === 'Estadisticas') { return $filter('translate')('1163'); }
            if (name === 'lastOrder') { return $filter('translate')('1164'); }
            if (name === 'ordering') { return $filter('translate')('0110'); }
            if (name === 'defaultItem') { return $filter('translate')('1165'); }
            if (name === 'demographicName' || name === 'demographic') { return $filter('translate')('0295'); }
            if (name === 'Plantilla de resultado') { return $filter('translate')('0599'); }
            if (name === 'description') { return $filter('translate')('0597'); }
            if (name === 'date') { return $filter('translate')('0325'); }
            if (name === 'Consulta de pacientes') { return $filter('translate')('0322'); }
            if (name === 'type' || name === 'open' || name === 'laboratorytype' || name === 'origin') {
                return $filter('translate')('0680');
            }
            if (name === 'partialValidation') { return $filter('translate')('1166'); }
            if (name === 'conversionFactor') { return $filter('translate')('1167'); }
            if (name === 'international') { return $filter('translate')('1168'); }
            if (name === 'nameT' || name === 'requirementR' || name === 'descriptionA' ||
                name === 'requisito' || name === 'Requisito') {
                return $filter('translate')('0332');
            }
            if (name === 'unitAge') { return $filter('translate')('1169'); }
            if (name === 'ageMax') { return $filter('translate')('1170'); }
            if (name === 'ageMin') { return $filter('translate')('1171'); }
            if (name === 'gender' || name === 'nameGender') { return $filter('translate')('0124'); }
            if (name === 'Coded Comments' || name === 'comment' || name === 'message' || name === 'Comentario') {
                return $filter('translate')('0114');
            }
            if (name === 'diagnostic' || name === 'diagnostics' || name === 'Diagnosis' || name === 'Diagnóstico' ||
                name === 'Diagnosticos' || name === 'Diagnostico') {
                return $filter('translate')('0258');
            }
            if (name === 'apply') { return $filter('translate')('1172'); }
            if (name === 'priority') { return $filter('translate')('0888'); }
            if (name === 'unit' || name === 'Units' || name === 'unit' || name === 'Unidad') {
                return $filter('translate')('0125');
            }
            if (name === 'container' || name === 'Containers' || name === 'Recipiente') {
                return $filter('translate')('0867');
            }
            if (name === 'specialStorage' || name === 'specialStorage') { return $filter('translate')('1173'); }
            if (name === 'canstiker') { return $filter('translate')('1407'); }
            if (name === 'Agrupación de órdenes' || name === 'Agrupacion de ordenes') {
                return $filter('translate')('1403');
            }
            if (name === 'daysstored') { return $filter('translate')('1174'); }
            if (name === 'printable') { return $filter('translate')('0211'); }
            if (name === 'typebarcode') { return $filter('translate')('1175'); }
            if (name === 'check') { return $filter('translate')('0208'); }
            if (name === 'qualityTime') { return $filter('translate')('1176'); }
            if (name === 'qualityPercentage') { return $filter('translate')('1177'); }
            if (name === 'managementsample') { return $filter('translate')('1178'); }
            if (name === 'sample' || name === 'Sample' || name === 'Muestra' || name === 'Muestras') {
                return $filter('translate')('0111');
            }
            if (name === 'level') { return $filter('translate')('0442'); }
            if (name === 'interview' || name === 'Interview' || name === 'Interviews' ||
                name === 'Entrevista' || name === 'Entervista') {
                return $filter('translate')('0191');
            }
            if (name === 'unitAgeT') { return $filter('translate')('0102'); }
            if (name === 'minAge') { return $filter('translate')('1179'); }
            if (name === 'maxAge') { return $filter('translate')('1180'); }
            if (name === 'statisticalTitle') { return $filter('translate')('1181'); }
            if (name === 'printOnReport') { return $filter('translate')('1182'); }
            if (name === 'groupTitle') { return $filter('translate')('1183'); }
            if (name === 'processingBy') { return $filter('translate')('1184'); }
            if (name === 'confidential') { return $filter('translate')('0720'); }
            if (name === 'multiplyBy') { return $filter('translate')('1185'); }
            if (name === 'deleteProfile') { return $filter('translate')('1186'); }
            if (name === 'printGraph') { return $filter('translate')('1187'); }
            if (name === 'statistics') { return $filter('translate')('0844'); }
            if (name === 'statisticsA') { return $filter('translate')('0844'); }
            if (name === 'statisticsProcessed') { return $filter('translate')('0845'); }
            if (name === 'billing') { return $filter('translate')('0843'); }
            if (name === 'showInQuery') { return $filter('translate')('0846'); }
            if (name === 'showEntry') { return $filter('translate')('0847'); }
            if (name === 'basic') { return $filter('translate')('1188'); }
            if (name === 'maxDays') { return $filter('translate')('1189'); }
            if (name === 'deliveryDays') { return $filter('translate')('1190'); }
            if (name === 'maxPrintDays') { return $filter('translate')('1191'); }
            if (name === 'validResult') { return $filter('translate')('1192'); }
            if (name === 'selfValidation') { return $filter('translate')('0849'); }
            if (name === 'processingDays' || name === 'Días de procesamiento' || name === 'Dias de procesamiento') {
                return $filter('translate')('0851');
            }
            if (name === 'preliminaryValidation') { return $filter('translate')('0852'); }
            if (name === 'trendAlert') { return $filter('translate')('0853'); }
            if (name === 'resultType') { return $filter('translate')('0854'); }
            if (name === 'decimal') { return $filter('translate')('0855'); }
            if (name === 'formula') { return $filter('translate')('1193'); }
            if (name === 'concurrences') { return $filter('translate')('1194'); }
            if (name === 'technique' || name === 'Technique' || name === 'Técnica' || name === 'Tecnica') {
                return $filter('translate')('0740');
            }
            if (name === 'automaticResult') { return $filter('translate')('0856'); }
            if (name === 'conversionFactor') { return $filter('translate')('1195'); }
            if (name === 'volume') { return $filter('translate')('1408'); }
            if (name === 'resultRequest') { return $filter('translate')('1196'); }
            if (name === 'fixedComment') { return $filter('translate')('0859'); }
            if (name === 'printComment') { return $filter('translate')('1197'); }
            if (name === 'generalInformation') { return $filter('translate')('1198'); }
            if (name === 'requirements' || name === 'Requirements' || name === 'Requisito') {
                return $filter('translate')('0858');
            }
            if (name === 'testType') { return $filter('translate')('1199'); }
            if (name === 'tests' || name === 'test' || name === 'nameTest' || name === 'Examenes') {
                return $filter('translate')('0013');
            }
            if (name === 'contact') { return $filter('translate')('1200'); }
            if (name === 'path') { return $filter('translate')('1201'); }
            if (name === 'nameBranch' || name === 'branch' ||
                name === 'branches' || name === 'Branch' || name === 'Sede') {
                return $filter('translate')('0003');
            }
            if (name === 'nameLaboratory' && name === 'Reference Laboratories' ||
                name === 'Laboratorio' || name === 'Laboratorios') {
                return $filter('translate')('0429');
            }
            if (name === 'routine') { return $filter('translate')('1202'); }
            if (name === 'urgency') { return $filter('translate')('1203'); }
            if (name === 'demographicItemName' || name === 'demographicItem') { return $filter('translate')('1204'); }
            if (name === 'microbiology' || name === 'Microbiología') { return $filter('translate')('0225'); }
            if (name === 'orientation') { return $filter('translate')('0224'); }
            if (name === 'exclusive') { return $filter('translate')('1205'); }
            if (name === 'key') { return $filter('translate')('1206'); }
            if (name === 'sum' || name === 'adjustment') { return $filter('translate')('1207'); }
            if (name === 'deltacheckDays') { return $filter('translate')('1208'); }
            if (name === 'deltacheckMax') { return $filter('translate')('1209'); }
            if (name === 'deltacheckMin') { return $filter('translate')('1210'); }
            if (name === 'Prueba') { return $filter('translate')('0459'); }
            if (name === 'nameD' || name === 'Test' || name === 'Tests' || name === 'testName') {
                return $filter('translate')('0459');
            }
            if (name === 'destinationRoutes') { return $filter('translate')('1211'); }
            if (name === 'orderType' || name === 'Type Order' || name === 'Tipo de orden') {
                return $filter('translate')('0088');
            }
            if (name === 'race' || name === 'Race' || name === 'Raza') { return $filter('translate')('0091'); }
            if (name === 'criticalCh') { return $filter('translate')('1212'); }
            if (name === 'ageMinV') { return $filter('translate')('0497'); }
            if (name === 'ageMaxV') { return $filter('translate')('0498'); }
            if (name === 'normalMin') { return $filter('translate')('0420'); }
            if (name === 'normalMax') { return $filter('translate')('0421'); }
            if (name === 'panicMin') { return $filter('translate')('1213'); }
            if (name === 'panicMax') { return $filter('translate')('1214'); }
            if (name === 'reportableMin') { return $filter('translate')('1215'); }
            if (name === 'reportableMax') { return $filter('translate')('1216'); }
            if (name === 'normalMax') { return $filter('translate')('0623'); }
            if (name === 'panic') { return $filter('translate')('1217'); }
            if (name === 'suppressionRule') { return $filter('translate')('1218'); }
            if (name === 'method') { return $filter('translate')('1219'); }
            if (name === 'microorganism' || name === 'Microorganisms' || name === 'Microorganismo') {
                return $filter('translate')('0608');
            }
            if (name === 'antibiotic' || name === 'Antibiotics' || name === 'Antibiótico' || name === 'Antibiotico') {
                return $filter('translate')('0557');
            }
            if (name === 'interpretation') { return $filter('translate')('0560'); }
            if (name === 'operation') { return $filter('translate')('1220'); }
            if (name === 'valueMin') { return $filter('translate')('1221'); }
            if (name === 'valueMax') { return $filter('translate')('1222'); }
            if (name === 'reportTask') { return $filter('translate')('1223'); }
            if (name === 'mediaCultures' || name === 'Means of cultivation' || name === 'Medio de cultivo') {
                return $filter('translate')('1224');
            }
            if (name === 'minimum') { return $filter('translate')('1096'); }
            if (name === 'maximum') { return $filter('translate')('1097'); }
            if (name === 'service' || name === 'Service' || name === 'Servicio' || name === 'Servicios') {
                return $filter('translate')('0090');
            }
            if (name === 'expectedTime') { return $filter('translate')('0199'); }
            if (name === 'maximumTime') { return $filter('translate')('0514'); }
            if (name === 'ehr') { return 'CUPS'; }
            if (name === 'repeatCode') { return $filter('translate')('1225'); }
            if (name === 'centralCode') { return $filter('translate')('1226'); }
            if (name === 'user' || name === 'userName' || name === 'Users' || name === 'Usuario') {
                return $filter('translate')('0001');
            }
            if (name === 'card' || name === 'Cards' || name === 'Tarjeta de crédito' || name === 'Tarjeta de credito') {
                return $filter('translate')('0822');
            }
            if (name === 'bank' || name === 'Banks' || name === 'Banco') { return $filter('translate')('0821'); }
            if (name === 'number') { return $filter('translate')('0824'); }
            if (name === 'nit') { return 'NIT'; }
            if (name === 'selfPay') { return $filter('translate')('1227'); }
            if (name === 'connectivityEMR') { return $filter('translate')('1228'); }
            if (name === 'faxSend') { return $filter('translate')('1229'); }
            if (name === 'automaticEmail') { return $filter('translate')('1230'); }
            if (name === 'print') { return $filter('translate')('1231'); }
            if (name === 'epsCode') { return $filter('translate')('1232'); }
            if (name === 'namePrint') { return $filter('translate')('1233'); }
            if (name === 'observation') { return $filter('translate')('0597'); }
            if (name === 'department') { return $filter('translate')('1234'); }
            if (name === 'colony') { return $filter('translate')('1235'); }
            if (name === 'maxAmount') { return $filter('translate')('1236'); }
            if (name === 'currentAmount') { return $filter('translate')('1237'); }
            if (name === 'alertAmount') { return $filter('translate')('1238'); }
            if (name === 'checkPaid') { return $filter('translate')('1239'); }
            if (name === 'showPriceInEntry') { return $filter('translate')('1240'); }
            if (name === 'webPage') { return $filter('translate')('1241'); }
            if (name === 'typePayer') { return $filter('translate')('1242'); }
            if (name === 'checkCPTRelation') { return $filter('translate')('1243'); }
            if (name === 'assingAllAccounts') { return $filter('translate')('1244'); }
            if (name === 'applyDiagnostics') { return $filter('translate')('1245'); }
            if (name === 'homebound') { return $filter('translate')('1246'); }
            if (name === 'venipunture') { return $filter('translate')('1247'); }
            if (name === 'emailT') { return $filter('translate')('1248'); }
            if (name === 'claimCode') { return $filter('translate')('1249'); }
            if (name === 'interchangeSender') { return $filter('translate')('1250'); }
            if (name === 'claimType') { return $filter('translate')('1251'); }
            if (name === 'applicationSendCode') { return $filter('translate')('1252'); }
            if (name === 'formatMemberId') { return $filter('translate')('1253'); }
            if (name === 'interchangeQualifier') { return $filter('translate')('1254'); }
            if (name === 'transactionType') { return $filter('translate')('1255'); }
            if (name === 'labSubmitter') { return $filter('translate')('1256'); }
            if (name === 'identificationPayer') { return $filter('translate')('1257'); }
            if (name === 'outputFileName') { return $filter('translate')('1258'); }
            if (name === 'nameReceiver' || name === 'Receiver' || name === 'Receptor EDI') {
                return $filter('translate')('1011');
            }
            if (name === 'consecutive') { return $filter('translate')('1259'); }
            if (name === 'eligibility') { return $filter('translate')('1260'); }
            if (name === 'applyTypePayer') { return $filter('translate')('1261'); }
            if (name === 'assingBenefits') { return $filter('translate')('1262'); }
            if (name === 'supplierSignature') { return $filter('translate')('1263'); }
            if (name === 'electronicClaim') { return $filter('translate')('1264'); }
            if (name === 'resolutionDIAN') { return $filter('translate')('1265'); }
            if (name === 'fromNumber') { return $filter('translate')('1266'); }
            if (name === 'toNumber') { return $filter('translate')('1267'); }
            if (name === 'Dependencia de demográficos' || name === 'Dependencia de demograficos') {
                return $filter('translate')('0780');
            }
            if (name === 'provider' || name === 'Entity' || name === 'Entidad') {
                return $filter('translate')('1007');
            }
            if (name === 'prefix') { return $filter('translate')('1268'); }
            if (name === 'initialNumber') { return $filter('translate')('1269'); }
            if (name === 'applicationReceiverCode') { return $filter('translate')('1270'); }
            if (name === 'receiverID') { return $filter('translate')('1271'); }
            if (name === 'interchangeReceiver') { return $filter('translate')('1272'); }
            if (name === 'initialDate') { return $filter('translate')('0075'); }
            if (name === 'endDate') { return $filter('translate')('0076'); }
            if (name === 'automatically') { return $filter('translate')('1273'); }
            if (name === 'stateA') { return $filter('translate')('1274'); }
            if (name === 'Relación de resultados' || name === 'Relacion de resultados') {
                return $filter('translate')('0999');
            }
            if (name === 'administrator') { return $filter('translate')('1275'); }
            if (name === 'HoliDays' || name === 'Festivos') { return $filter('translate')('0993'); }
            if (name === 'Instalación' || name === 'Configuración' ||
                name === 'Configuracion' || name === 'Instalacion') {
                return $filter('translate')('0665');
            }
            if (name === 'General') { return $filter('translate')('0992'); }
            if (name === 'Impresión por servicio' || name === 'Impresion por servicio') {
                return $filter('translate')('1412');
            }
            if (name === 'Demographic' || name === 'Demográficos' || name === 'Demograficos') {
                return $filter('translate')('0083');
            }
            if (name === 'Ítems demográficos' || name === 'Items demograficos') { return $filter('translate')('1276'); }
            if (name === 'Document Type' || name === 'Tipo de documento') { return $filter('translate')('0833'); }
            if (name === 'Physician' || name === 'Médico' || name === 'Medico') { return $filter('translate')('0086'); }
            if (name === 'Question' || name === 'questions' || name === 'question' ||
                name === 'Pregunta' || name === 'Preguntas') {
                return $filter('translate')('0994');
            }
            if (name === 'Areas' || name === 'areas' || name === 'Área' || name === 'Area') {
                return $filter('translate')('0408');
            }
            if (name === 'Population Groups' || name === 'Grupos etarios') {
                return $filter('translate')('0513');
            }
            if (name === 'Alarms' || name === 'Alarma' || name === 'Alarma para resultados') {
                return $filter('translate')('1015');
            }
            if (name === 'Profiles' || name === 'Perfil') { return $filter('translate')('0746'); }
            if (name === 'Processing Days') { return $filter('translate')('0851'); }
            if (name === 'Group' || name === 'Grupo' || name === 'Grupo de pruebas') {
                return $filter('translate')('0558');
            }
            if (name === 'Change Tests Code') { return $filter('translate')('1277'); }
            if (name === 'Edición de pruebas en lista' || name === 'Edicion de pruebas en lista') {
                return $filter('translate')('1413');
            }
            if (name === 'Diagnosis by Test' || name === 'Diagnóstico por prueba' ||
                name === 'Diagnostico por prueba') { return $filter('translate')('0995'); }
            if (name === 'Tests by Laboratory' || name === 'Prueba por laboratorio') {
                return $filter('translate')('1278');
            }


            return labelauditone.changelabels(name);
        }
    }
})();
/* jshint ignore:end */
