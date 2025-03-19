/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('listaudit', listaudit);

    listaudit.$inject = ['addobjectuser', 'addopportunity', 'addrate','addrateone',
    'addtest', 'addtestone', 'addtestwo', 'addconfig', 'addconfigone'];

   
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function listaudit(addobjectuser, addopportunity, addrate,addrateone,
        addtest, addtestone, addtestwo, addconfig, addconfigone) {
        var service = {
            add: add
        };
        return service;
        function add(datamaster) {
            var auditmasterlist = [];
            for (var i = 0; i < datamaster.length; i++) {
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.user.User') {//usuario
                    var datamodule = addobjectuser.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.user.Role') {//Role
                    var datamodule = addobjectuser.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Standardization') {//Homologación de pruebas
                    var datamodule = addobjectuser.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.StandardizationDemographic') {//Homologación de demograficos
                    var datamodule = addobjectuser.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.user.StandardizationUser') {//HOMOLOGACIÓN USUARIO
                    var datamodule = addobjectuser.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.CentralSystem') {//SISTEMA CENTRAL
                    var datamodule = addobjectuser.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.integrationMiddleware') {//integración de middleware por laboratorio 
                    var datamodule = addobjectuser.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.TestByService') {//Oportunidad de la prueba 
                    var datamodule = addopportunity.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.tracking.DestinationRoute') {//oportunidad de la muestra 
                    var datamodule = addopportunity.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.SampleByService') { //Muestra por servicio
                    var datamodule = addopportunity.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.opportunity.Bind') { //HISTOGRAMA
                    var datamodule = addopportunity.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/samples/subsamples/') {//SUBMUETRA
                    var datamodule = addopportunity.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.MediaCultureTest') {//Medio de cultivo por prueba 
                    var datamodule = addopportunity.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.MediaCulture') { //MEDIOS DE CULTIVO
                    var datamodule = addopportunity.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/procedures/testprocedure') { //Procedimiento por prueba
                    var datamodule = addopportunity.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.Procedure') { //PROCEDIMIENTO
                    var datamodule = addopportunity.add(8, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.CollectionMethod') { //METODO DE RECOLECION
                    var datamodule = addopportunity.add(9, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.Task') {//TAREA 
                    var datamodule = addopportunity.add(10, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.AnatomicalSite') { //SITIO ANATOMICO
                    var datamodule = addopportunity.add(11, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.MicrobiologyDestination') { //DESTINO DE MICROOBIOLOGIA
                    var datamodule = addopportunity.add(12, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.MicroorganismAntibiotic') { //VALORES DE REFERENCIA DE ANTIBIOTICO
                    var datamodule = addopportunity.add(13, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.Sensitivity') {//ANTIBIOGRAMA 
                    var datamodule = addopportunity.add(14, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.AntibioticBySensitivity') { //ANTIBIOGRAMA antibiotico
                    var datamodule = addopportunity.add(15, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.Antibiotic') {//antibiotico
                    var datamodule = addopportunity.add(16, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.microbiology.Microorganism') {//MICROORGANISMO
                    var datamodule = addopportunity.add(17, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.PriceAssigment') {//Asignación de precios por tarifa
                    var datamodule = addrate.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.FeeSchedule') {//vigencia
                    var datamodule = addrate.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.taxesProof') {//Impuesto por prueba
                    var datamodule = addrate.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Receiver') {//Receptor edi
                    var datamodule = addrate.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.AlarmDays') {//dias de alarma pendientes de pago
                    var datamodule = addrate.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.RatesOfAccount') {//Tarifa por cliente
                    var datamodule = addrate.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Resolution') {//RESOLUCIÓN
                    var datamodule = addrate.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Rate') {//Tarifa
                    var datamodule = addrate.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                /* listauditone.add(datamaster[i], auditmasterlist) */ 

                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Account') {//CLIENTE
                    var datamodule = addrateone.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Provider') {//ENTIDAD
                    var datamodule = addrateone.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Card') {//TARJETA DE CREDITO
                    var datamodule = addrateone.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.Bank') {//BANCO
                    var datamodule = addrateone.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.PaymentType') {//TIPO DE PAGO
                    var datamodule = addrateone.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.tracking.AssignmentDestination') {//Asignación de destino
                    var datamodule = addrateone.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.tracking.Destination') {//destino
                    var datamodule = addrateone.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.common.Motive') {//motivo
                    var datamodule = addrateone.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.tracking.Refrigerator') {//nevera
                    var datamodule = addrateone.add(8, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.billing.DiscountRate') {//Tipos de impuesto
                    var datamodule = addrateone.add(9, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
               /*  if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.configuration.RIPS') {//RIPS
                    var datamodule = addrateone.add(10, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                } */
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.ReferenceValue') {//valores de referencia
                    var datamodule = addtest.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/tests/deltacheck') {//maestro de deltacheck
                    var datamodule = addtest.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.LiteralByTest') {//resultado literal por prueba
                    var datamodule = addtest.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.LiteralResult') {//resultado literal
                    var datamodule = addtest.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.AutomaticTest') {//prueba automatica
                    var datamodule = addtest.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/resultrelationships') {//relación resultados
                    var datamodule = addtest.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
              /*   if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.OptionTemplate') {//Plantilla de resultados
                    var datamodule = addtest.add(6, datamaster);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }  */
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.CellularCounter') {//contador hematologico
                    var datamodule = addtest.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Worksheet') {//hojas de trabajo    
                    var datamodule = addtest.add(8, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.ExcludeTest') {//Excluir pruebas por demografico
                    var datamodule = addtest.add(9, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/users/exclude/') {//excluir prueba por usuario
                    var datamodule = addtest.add(10, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.PypDemographic') {//pruebas por demograficos pyp
                    var datamodule = addtestone.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.TestByLaboratory') {//Pruebas por laboratorio
                    var datamodule = addtestone.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Laboratory') {//laboratorio
                    var datamodule = addtestone.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.TestByDiagnostic') {//Diagnostico por prueba
                    var datamodule = addtestone.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Diagnostic') {//Diagnostico
                    var datamodule = addtestone.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/groups') {//Grupo de prueba
                    var datamodule = addtestone.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/tests/printorder') {//Orden de impresion
                    var datamodule = addtestone.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/tests/processingdays') {//Dias de procesamiento
                    var datamodule = addtestone.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/samples') {//Muestra
                    var datamodule = addtestone.add(8, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Container') {//Recipiente
                    var datamodule = addtestone.add(9, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.CommentCoded') {//Comentario
                    var datamodule = addtestone.add(10, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Test') {//examen
                    var datamodule = addtestwo.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule); 
                }
                if (datamaster[i].url === '/Enterprise_NT_PRU/api/alarms') {//alarma
                    var datamodule = addtestwo.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.AgeGroup') {//Grupo etario
                    var datamodule = addtestwo.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Requirement') {//maestro requisito
                    var datamodule = addtestwo.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Technique') {//maestro tecnica
                    var datamodule = addtestwo.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Unit') {//unidad
                    var datamodule = addtestwo.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.test.Area') {//Area
                    var datamodule = addtestwo.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.interview.Interview') {//Entrevista
                    var datamodule = addconfig.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.interview.Question') {//Preguntas
                    var datamodule = addconfig.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.interview.Answer') {//Respuestas
                    var datamodule = addconfig.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.DemographicItem') {//itemdemografico
                    var datamodule = addconfig.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Demographic') {//demograficos
                    var datamodule = addconfig.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Physician') {//médico
                    var datamodule = addconfig.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Specialist') {//especialidad
                    var datamodule = addconfig.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.OrderType') {//tipo de orden
                    var datamodule = addconfig.add(7, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.ServiceLaboratory') {//servicio
                    var datamodule = addconfigone.add(0, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Branch') {//sede
                    var datamodule = addconfigone.add(1, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.DocumentType') {//tipo de documento
                    var datamodule = addconfigone.add(2, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.demographic.Race') {//raza
                    var datamodule = addconfigone.add(3, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.configuration.Configuration') {//configuracion
                    var datamodule = addconfigone.add(4, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.configuration.OrderGrouping') {//Agrupación de órdenes
                    var datamodule = addconfigone.add(5, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
                if (datamaster[i].module === 'net.cltech.enterprisent.domain.masters.common.Holiday') {//festivos
                    var datamodule = addconfigone.add(6, datamaster[i]);
                    auditmasterlist = _.concat(auditmasterlist, datamodule);
                }
            }
            return auditmasterlist;
        }
    }
})();
/* jshint ignore:end */