/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('listreportsfile', listreportsfile);

  listreportsfile.$inject = ['localStorageService', '$filter'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function listreportsfile(localStorageService, $filter) {
    var service = {
      getListReportsFile: getListReportsFile,
      getListReportsFiletransplants: getListReportsFiletransplants
    };

    /**
       * Lenin Bueno Escolar
     */
    function getListReportsFile(isAdmin, reportsDemographics) {
      var iconfile = 'images/stimulsoft.png'; //►
      var by = $filter('translate')('0000') === 'esCo' ? ' por ' : ' by ';
      var in_ = $filter('translate')('0000') === 'esCo' ? ' en ' : ' in ';
      var isPenny = localStorageService.get('ManejoCentavos') === 'True';

      if (isPenny) {
        var quote = 'quotepennies.mrt'
      } else {
        var quote = 'quoteinpennies.mrt'
      }

      var filesReports = [{}];
      var dataReportsFile = [
        {
          directory: 'post-analitic',
          displayname: $filter('translate')('0225'),
          subdirectories: [{
            subdirectory: 'Pendingverification',
            displayname: $filter('translate')('0210') + in_ + $filter('translate')('0026'),
            files: [{
              filename: 'Pendingverification.mrt',
              accessreport: true,
              filejson: 'Pendingverification.json',
              displayname: $filter('translate')('0210'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'tasks',
            displayname: $filter('translate')('0592') + in_ + $filter('translate')('0026'),
            files: [{
              filename: 'tasks.mrt',
              accessreport: true,
              filejson: 'tasks.json',
              displayname: $filter('translate')('0592'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'tasksperpatient',
            displayname: $filter('translate')('0583') + in_ + $filter('translate')('0026'),
            files: [{
              filename: 'tasksperpatient.mrt',
              accessreport: true,
              filejson: 'tasksperpatient.json',
              displayname: $filter('translate')('0583'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'trackingmicrobiologytask',
            displayname: $filter('translate')('0582') + in_ + $filter('translate')('0026'),
            files: [{
              filename: 'trackingmicrobiologytask.mrt',
              accessreport: true,
              filejson: 'trackingmicrobiologytask.json',
              displayname: $filter('translate')('0582'),
              subfiles: []
            }]
          }]
        },
        {
          directory: 'post-analitic',
          displayname: $filter('translate')('0027'),
          subdirectories: [{
            subdirectory: 'reviewofresult',
            displayname: $filter('translate')('0023'),
            files: [{
              filename: 'ManagementResult.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0374'),
              subfiles: []
            },
            {
              filename: 'ManagementResultComment.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0374') + ' ' + $filter('translate')('0315').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'ManagementResultComment1.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0374') + ' ' + $filter('translate')('0315').toLowerCase() + ' 1.',
              subfiles: []
            },
            {
              filename: 'ManagementResultComment2.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0374') + ' ' + $filter('translate')('0315').toLowerCase() + ' 2.',
              subfiles: []
            },
            {
              filename: 'PendingResult.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0216'),
              subfiles: []
            },
            {
              filename: 'PendingResult1.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0216') + ' 1.',
              subfiles: []
            },
            {
              filename: 'PendingResultComment.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0216') + ' ' + $filter('translate')('0315').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'PendingResultComment1.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0216') + ' ' + $filter('translate')('0315').toLowerCase() + ' 1.',
              subfiles: []
            },
            {
              filename: 'ResumeManagement.mrt',
              accessreport: true,
              filejson: 'reviewofresult.json',
              displayname: $filter('translate')('0361'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'worklist',
            displayname: $filter('translate')('0018'),
            files: [{
              filename: 'worklisted.mrt',
              accessreport: true,
              filejson: 'worklist.json',
              displayname: $filter('translate')('0018') + ' - ' + $filter('translate')('0495'),
              subfiles: []
            },
            {
              filename: 'worklisthorizontal.mrt',
              accessreport: true,
              filejson: 'worklist.json',
              displayname: $filter('translate')('0018') + ' - ' + $filter('translate')('0223'),
              subfiles: []
            },
            {
              filename: 'worklistvertical.mrt',
              accessreport: true,
              filejson: 'worklist.json',
              displayname: $filter('translate')('0018') + ' - ' + $filter('translate')('0222'),
              subfiles: []

            }]
          }]

        },
        {
          directory: 'pre-analitic',
          displayname: $filter('translate')('0010'),
          subdirectories: [{
            subdirectory: 'activateorder',
            displayname: $filter('translate')('0045'),
            files: [{
              filename: 'activateorder.mrt',
              accessreport: true,
              filejson: 'activateorder.json',
              displayname: $filter('translate')('0260'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'cashreceipt',
            displayname: $filter('translate')('0883') + in_ + $filter('translate')('0011'),
            files: [{
              filename: 'cashreceipt.mrt',
              accessreport: true,
              filejson: 'cashreceipt.json',
              displayname: $filter('translate')('0883'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'quote',
            displayname: $filter('translate')('0777') + in_ + $filter('translate')('0011'),
            files: [{
              filename: quote,
              accessreport: true,
              filejson: 'quote.json',
              displayname: $filter('translate')('0777'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'requirement',
            displayname: $filter('translate')('0858') + in_ + $filter('translate')('0011'),
            files: [{
              filename: 'requirement.mrt',
              accessreport: true,
              filejson: 'requirement.json',
              displayname: $filter('translate')('0858'),
              subfiles: []
            },
            {
              filename: 'requirementtest.mrt',
              accessreport: true,
              filejson: 'requirementtest.json',
              displayname: $filter('translate')('0858'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'ticket',
            displayname: $filter('translate')('0875') + in_ + $filter('translate')('0011'),
            files: [{
              filename: 'ticket.mrt',
              accessreport: true,
              filejson: 'ticket.json',
              displayname: $filter('translate')('0875'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'listed',
            displayname: $filter('translate')('0015'),
            files: [{
              filename: 'listedlaboratory',
              accessreport: true,
              filejson: 'listed.json',
              displayname: $filter('translate')('0099'),
              subfiles: [{
                filename: 'listedlabtest.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0095')
              },
              {
                filename: 'listedlabsample.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0185')
              },
              {
                filename: 'listedlabcontainer.mrt',
                accessreport: true,
                filejson: 'listed.json',
                displayname: $filter('translate')('0186')
              }]

            },
            {
              filename: 'listedorder',
              accessreport: true,
              filejson: 'listed.json',
              displayname: $filter('translate')('0097'),
              subfiles: [{
                filename: 'listednormal.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0093')
              },
              {
                filename: 'listedarea.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0094')
              },
              {
                filename: 'listedtest.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0095')
              },
              {
                filename: 'listednotgroup.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0096')
              }]

            },
            {
              filename: 'listedsample',
              accessreport: true,
              filejson: 'listed.json',
              displayname: $filter('translate')('0070'),
              subfiles: [{
                filename: 'listedrejectsample.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0185')
              }]
            }]

          },
          {
            subdirectory: 'deletespecial',
            displayname: $filter('translate')('0050'),
            files: [{
              filename: 'deletespecial.mrt',
              accessreport: true,
              filejson: 'deletespecial.json',
              displayname: $filter('translate')('0305'),
              subfiles: []
            }]
          }]

        },
        {
          directory: 'reportsandconsultations',
          displayname: $filter('translate')('0028'),
          subdirectories: [{
            subdirectory: 'consultgraphics',
            displayname: $filter('translate')('0028'),
            files: [{
              filename: 'consultgraphics.mrt',
              accessreport: true,
              filejson: 'consultgraphics.json',
              displayname: $filter('translate')('0400') + ' - ' + $filter('translate')('0415'),
              subfiles: []
            },
            {
              filename: 'consultgraphics1.mrt',
              accessreport: true,
              filejson: 'consultgraphics.json',
              displayname: $filter('translate')('0400') + ' - ' + $filter('translate')('0415') + ' 1.',
              subfiles: []
            },
            {
              filename: 'consultgraphics2.mrt',
              accessreport: true,
              filejson: 'consultgraphics.json',
              displayname: $filter('translate')('0400') + ' - ' + $filter('translate')('0415') + ' 2.',
              subfiles: []
            },
            {
              filename: 'consultgraphics3.mrt',
              accessreport: true,
              filejson: 'consultgraphics.json',
              displayname: $filter('translate')('0400') + ' - ' + $filter('translate')('0415') + ' 3.',
              subfiles: []
            }]
          },
          {
            subdirectory: 'consultnormal',
            displayname: $filter('translate')('0406'),
            files: [{
              filename: 'consultnormal.mrt',
              accessreport: true,
              filejson: 'consultnormal.json',
              displayname: $filter('translate')('0406'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'consultpatienfortest',
            displayname: $filter('translate')('0322'),
            files: [{
              filename: 'consultpatienfortest.mrt',
              accessreport: true,
              filejson: 'consultpatienfortest.json',
              displayname: $filter('translate')('0322') + by + $filter('translate')('0459').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'consultpatienfortest1.mrt',
              accessreport: true,
              filejson: 'consultpatienfortest.json',
              displayname: $filter('translate')('0322') + by + $filter('translate')('0459').toLowerCase() + ' 1.',
              subfiles: []
            },
            {
              filename: 'consultpatienfortest2.mrt',
              accessreport: true,
              filejson: 'consultpatienfortest.json',
              displayname: $filter('translate')('0322') + by + $filter('translate')('0459').toLowerCase() + ' 2.',
              subfiles: []
            },
            {
              filename: 'consultpatienfortest3.mrt',
              accessreport: true,
              filejson: 'consultpatienfortest.json',
              displayname: $filter('translate')('0322') + by + $filter('translate')('0459').toLowerCase() + ' 3.',
              subfiles: []
            }]
          },
          {
            subdirectory: 'controldeliveryreports',
            displayname: $filter('translate')('0032'),
            files: [{
              filename: 'controldeliveryreports.mrt',
              accessreport: true,
              filejson: 'controldeliveryreports.json',
              displayname: $filter('translate')('0032'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'deliveryresults',
            displayname: $filter('translate')('0752'),
            files: [{
              filename: 'deliveryresults.mrt',
              accessreport: true,
              filejson: 'deliveryresults.json',
              displayname: $filter('translate')('0752'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'deliveryresultspending',
            displayname: $filter('translate')('0368'),
            files: [{
              filename: 'deliveryresultspending.mrt',
              accessreport: true,
              filejson: 'deliveryresultspending.json',
              displayname: $filter('translate')('0368'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'patientconsultation',
            displayname: $filter('translate')('0322'),
            files: [{
              filename: 'patientconsultation.mrt',
              accessreport: true,
              filejson: 'patientconsultation.json',
              displayname: $filter('translate')('0322'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'reports',
            displayname: $filter('translate')('0031'),
            files: reportsDemographics
          }]
        },
        {
          directory: 'stadistics',
          displayname: $filter('translate')('0029'),
          subdirectories: [{
            subdirectory: 'destinationSample',
            displayname: $filter('translate')('0041'),
            files: [{
              filename: 'destinationSample.mrt',
              accessreport: true,
              filejson: 'destinationSample.json',
              displayname: $filter('translate')('0041'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'earlywarning',
            displayname: $filter('translate')('0036'),
            files: [{
              filename: 'earlywarningcodense.mrt',
              accessreport: true,
              filejson: 'earlywarning.json',
              displayname: $filter('translate')('0548') + ' - ' + $filter('translate')('0432'),
              subfiles: []
            },
            {
              filename: 'earlywarningdetailed.mrt',
              accessreport: true,
              filejson: 'earlywarning.json',
              displayname: $filter('translate')('0548') + ' - ' + $filter('translate')('0433'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'generalStadistics',
            displayname: $filter('translate')('0029'),
            files: [{
              filename: 'graphStatistics.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0939'),
              subfiles: []
            },
            {
              filename: 'graphStatisticsNA.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0939') + ' N/A',
              subfiles: []
            },
            {
              filename: 'groupedStatistics.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0940'),
              subfiles: []
            },
            {
              filename: 'groupedStatisticsNA.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0940') + ' N/A',
              subfiles: []
            },
            {
              filename: 'ungroupedStatistics.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0941'),
              subfiles: []
            },
            {
              filename: 'yearStadistics.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0942'),
              subfiles: []
            },
            {
              filename: 'yearStadisticsfijo.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0943'),
              subfiles: []
            },
            {
              filename: 'yearStadisticsNA.mrt',
              accessreport: true,
              filejson: 'generalStadistics.json',
              displayname: $filter('translate')('0942') + ' N/A',
              subfiles: []
            }]
          },
          {
            subdirectory: 'histogram',
            displayname: $filter('translate')('0038'),
            files: [{
              filename: 'histogram.mrt',
              accessreport: true,
              filejson: 'histogram.json',
              displayname: $filter('translate')('0038'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'indicators',
            displayname: $filter('translate')('0037'),
            files: [{
              filename: 'indicators.mrt',
              accessreport: true,
              filejson: 'indicators.json',
              displayname: $filter('translate')('0037'),
              subfiles: []
            },
            {
              filename: 'opportunitytime.mrt',
              accessreport: true,
              filejson: 'indicators.json',
              displayname: $filter('translate')('0491'),
              subfiles: []
            },
            {
              filename: 'tracking.mrt',
              accessreport: true,
              filejson: 'indicators.json',
              displayname: $filter('translate')('0483'),
              subfiles: []
            },
            {
              filename: 'averagetime',
              accessreport: true,
              filejson: 'averagetime.json',
              displayname: $filter('translate')('0490'),
              subfiles: [{
                filename: 'averagetimeall.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0215').toLowerCase()
              },
              {
                filename: 'averagetimearea.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0408').toLowerCase()
              },
              {
                filename: 'averagetimeorder.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0110').toLowerCase()
              },
              {
                filename: 'averagetimeservice.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0090').toLowerCase()
              },
              {
                filename: 'averagetimetest.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0459').toLowerCase()
              },
              {
                filename: 'averagetimevaliduser.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0529').toLowerCase()
              },
              {
                filename: 'averagetimevaliduserarea.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0529').toLowerCase() + by +
                  $filter('translate')('0408').toLowerCase()
              },
              {
                filename: 'averagetimevaliduserorder.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0529').toLowerCase() + by +
                  $filter('translate')('0110').toLowerCase()
              },
              {
                filename: 'averagetimevalidusertest.mrt',
                accessreport: true,
                filejson: '',
                displayname: $filter('translate')('0490') + by + $filter('translate')('0529').toLowerCase() + by +
                  $filter('translate')('0459').toLowerCase()
              }]
            }]

          },
          {
            subdirectory: 'priceStadistics',
            displayname: $filter('translate')('0035'),
            files: [{
              filename: 'graphAccountStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0441') + ' ' + $filter('translate')('0085').toLowerCase() + ' - ' +
                $filter('translate')('0415'),
              subfiles: []
            },
            {
              filename: 'graphPatientStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0441') + ' ' + $filter('translate')('0398').toLowerCase() + ' - ' +
                $filter('translate')('0415'),
              subfiles: []
            },
            {
              filename: 'graphServiceStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0441') + ' ' + $filter('translate')('0090').toLowerCase() + ' - ' +
                $filter('translate')('0415'),
              subfiles: []
            },
            {
              filename: 'priceAccountcheckStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0085').toLowerCase() + ' - Check',
              subfiles: []
            },
            {
              filename: 'priceAccountStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0085').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'pricePatientcheckStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0398').toLowerCase() + ' - Check',
              subfiles: []
            },
            {
              filename: 'pricePatientStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0398').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'priceServicecheckStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0090').toLowerCase() + ' - Check',
              subfiles: []
            },
            {
              filename: 'priceServiceStatistics.mrt',
              accessreport: true,
              filejson: 'priceStadistics.json',
              displayname: $filter('translate')('0035') + by + $filter('translate')('0090').toLowerCase(),
              subfiles: []
            },
            {
              filename: 'pricebox1.mrt',
              accessreport: true,
              filejson: 'pricebox1.json',
              displayname: $filter('translate')('1710'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'specialStatistics',
            displayname: $filter('translate')('0034'),
            files: [{
              filename: 'specialStatistics.mrt',
              accessreport: true,
              filejson: 'specialStatistics.json',
              displayname: $filter('translate')('0034'),
              subfiles: []
            },
            {
              filename: 'specialStatistics1.mrt',
              accessreport: true,
              filejson: 'specialStatistics.json',
              displayname: $filter('translate')('0034') + ' 1.',
              subfiles: []
            },
            {
              filename: 'specialStatisticsGraph.mrt',
              accessreport: true,
              filejson: 'specialStatisticsGraph.json',
              displayname: $filter('translate')('0034') + ' - ' + $filter('translate')('0415'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'Stadisticsmicroobiology',
            displayname: $filter('translate')('0607'),
            files: [{
              filename: 'Stadisticsmicroobiology.mrt',
              accessreport: true,
              filejson: 'Stadisticsmicroobiology.json',
              displayname: $filter('translate')('0607'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'Stadisticsmotivereject',
            displayname: $filter('translate')('0123'),
            files: [{
              filename: 'Stadisticsmotivereject.mrt',
              accessreport: true,
              filejson: 'Stadisticsmotivereject.json',
              displayname: $filter('translate')('0123'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'Stadisticsmotiverepeated',
            displayname: $filter('translate')('0468'),
            files: [{
              filename: 'Stadisticsmotiverepeated.mrt',
              accessreport: true,
              filejson: 'Stadisticsmotiverepeated.json',
              displayname: $filter('translate')('0468'),
              subfiles: []
            }]
          }]
        },
        {
          directory: 'tools',
          displayname: $filter('translate')('0030'),
          subdirectories: [{
            subdirectory: 'disponsalcertificate',
            displayname: $filter('translate')('0790'),
            files: [{
              filename: 'disponsalcertificate.mrt',
              accessreport: true,
              filejson: 'disponsalcertificate.json',
              displayname: $filter('translate')('0790'),
              subfiles: []
            },
            {
              filename: 'disponsalcertificate2.mrt',
              accessreport: true,
              filejson: 'disponsalcertificate.json',
              displayname: $filter('translate')('0790') + ' 2.',
              subfiles: []
            }]
          },
          {
            subdirectory: 'exception',
            displayname: $filter('translate')('0677'),
            files: [{
              filename: 'Exception.mrt',
              accessreport: true,
              filejson: 'exception.json',
              displayname: $filter('translate')('0677'),
              subfiles: []
            }]
          },
          {
            subdirectory: 'traceability',
            displayname: $filter('translate')('0046'),
            files: [{
              filename: 'traceabilityorder',
              accessreport: true,
              filejson: 'traceabilityorder',
              displayname: $filter('translate')('0749'),
              subfiles: [{
                filename: 'traceabilityorder.mrt',
                accessreport: true,
                filejson: 'traceabilityorder.json',
                displayname: $filter('translate')('0723')
              }]
            },
            {
              filename: 'traceabilitysample',
              accessreport: true,
              filejson: 'traceabilitysample',
              displayname: $filter('translate')('0627'),
              subfiles: [{
                filename: 'traceabilitysample.mrt',
                accessreport: true,
                filejson: 'traceability.json',
                displayname: $filter('translate')('0722')
              }]
            }]
          }]
        }
      ];

      var dataReportsFilePath = [];
      dataReportsFile.forEach(function (directoryValue) {
        var json_sub = [];
        directoryValue.subdirectories.forEach(function (subdirectoryValue) {
          var json_file = [];
          subdirectoryValue.files.forEach(function (fileValue) {
            fileValue.path = '/Report/' + directoryValue.directory + '/' +
              subdirectoryValue.subdirectory + '/' + fileValue.filename;
            fileValue.pathjson = '/Report/' + directoryValue.directory + '/' +
              subdirectoryValue.subdirectory + '/' + fileValue.filejson;
            var json_subfile = [];
            var icon = iconfile;
            if (fileValue.subfiles.length > 0) {
              fileValue.subfiles.forEach(function (subfileValue) {
                subfileValue.path = fileValue.path + '/' + subfileValue.filename;
                subfileValue.pathjson = fileValue.pathjson;
                if (subfileValue.filejson !== '') subfileValue.pathjson = fileValue.pathjson + '/' +
                  subfileValue.filejson;
                json_subfile.push({ 'filename': subfileValue.filename, 'image': iconfile, 'path': subfileValue.path, 'accessreport': subfileValue.accessreport, 'pathjson': subfileValue.pathjson, 'filejson': subfileValue.filejson, 'displayname': subfileValue.displayname });
              });
              icon = 'images/empty.png';
            }
            json_file.push({ 'filename': fileValue.filename, 'image': icon, 'path': fileValue.path, 'accessreport': fileValue.accessreport, 'pathjson': fileValue.pathjson, 'filejson': fileValue.filejson, 'displayname': fileValue.displayname, 'subfiles': json_subfile });
          });
          json_file = $filter('filter')(json_file, { accessreport: true }, true);
          if (json_file.length > 0) {
            json_sub.push({ 'subdirname': subdirectoryValue.subdirectory, 'image': 'images/empty.png', 'children': json_file, 'displayname': subdirectoryValue.displayname });
          }
        });
        if (json_sub.length > 0) {
          dataReportsFilePath.push({ 'dirname': directoryValue.directory, 'image': 'images/empty.png', 'children': json_sub, 'displayname': directoryValue.displayname });
        }
      });
      //dataReportsFilePath = $filter('filter')(dataReportsFilePath, {children: {children: accessreport: true}}, true);
      return dataReportsFilePath;
    }

    function getListReportsFiletransplants() {
      var iconfile = 'images/stimulsoft.png'; //►
      var dataReportsFile = [
        {
          directory: 'receivers',
          name: ($filter('translate')('3316')).toUpperCase(),
          children: [{
            image: iconfile,
            filename: 'transplants.mrt',
            filejson: 'transplants.json',
            name: $filter('translate')('3615'),
            path: '/Reportransplants/receivers/transplants/transplants.mrt',
            pathjson: '/Reportransplants/receivers/transplants/transplants.json'
          },
          {
            filename: 'immunological_studies_with_haplotypes.mrt',
            filejson: 'immunological_studies_with_haplotypes.json',
            image: iconfile,
            name: $filter('translate')('3616'),
            path: '/Reportransplants/receivers/immunological_studies_with_haplotypes/immunological_studies_with_haplotypes.mrt',
            pathjson: '/Reportransplants/receivers/immunological_studies_with_haplotypes/immunological_studies_with_haplotypes.json'
          },
          {
            filename: 'immunological_studies_without_haplotypes.mrt',
            filejson: 'immunological_studies_without_haplotypes.json',
            image: iconfile,
            name: $filter('translate')('3617'),
            path: '/Reportransplants/receivers/immunological_studies_without_haplotypes/immunological_studies_without_haplotypes.mrt',
            pathjson: '/Reportransplants/receivers/immunological_studies_without_haplotypes/immunological_studies_without_haplotypes.json'
          },
          {
            image: iconfile,
            filename: 'multiple_results.mrt',
            filejson: 'multiple_results.json',
            name: $filter('translate')('3618'),
            path: '/Reportransplants/receivers/multiple_results/multiple_results.mrt',
            pathjson: '/Reportransplants/receivers/multiple_results/multiple_results.json'
          },
          {
            image: iconfile,
            filename: 'qualitative_pra.mrt',
            filejson: 'qualitative_pra.json',
            name: $filter('translate')('3619'),
            path: '/Reportransplants/receivers/qualitative_pra/qualitative_pra.mrt',
            pathjson: '/Reportransplants/receivers/qualitative_pra/qualitative_pra.json'
          },
          {
            image: iconfile,
            filename: 'quantum_pra_class_I_II.mrt',
            filejson: 'quantum_pra_class_I_II.json',
            name: $filter('translate')('3620'),
            path: '/Reportransplants/receivers/quantum_pra_class_I_II/quantum_pra_class_I_II.mrt',
            pathjson: '/Reportransplants/receivers/quantum_pra_class_I_II/quantum_pra_class_I_II.json'
          },
          {
            image: iconfile,
            filename: 'single_class_I_II_antigen.mrt',
            filejson: 'single_class_I_II_antigen.json',
            name: $filter('translate')('3621'),
            path: '/Reportransplants/receivers/single_class_I_II_antigen/single_class_I_II_antigen.mrt',
            pathjson: '/Reportransplants/receivers/single_class_I_II_antigen/single_class_I_II_antigen.json'
          },
          {
            filename: 'flow_cytometry.mrt',
            filejson: 'flow_cytometry.json',
            image: iconfile,
            name: $filter('translate')('3622'),
            path: '/Reportransplants/receivers/flow_cytometry/flow_cytometry.mrt',
            pathjson: '/Reportransplants/receivers/flow_cytometry/flow_cytometry.json'
          },
          {
            filename: 'antibody_history.mrt',
            filejson: 'antibody_history.json',
            image: iconfile,
            name: $filter('translate')('3625'),
            path: '/Reportransplants/receivers/antibody_history/antibody_history.mrt',
            pathjson: '/Reportransplants/receivers/antibody_history/antibody_history.json'
          }
          ]
        },
        {
          directory: 'participants',
          name: ($filter('translate')('3074')).toUpperCase(),
          children: [{
            image: iconfile,
            filename: 'list_of_Contestants.mrt',
            filejson: 'list_of_Contestants.json',
            name: $filter('translate')('3624'),
            path: '/Reportransplants/participants/list_of_Contestants/list_of_Contestants.mrt',
            pathjson: '/Reportransplants/participants/list_of_Contestants/list_of_Contestants.json'
          },
          {
            filename: 'cytotoxicantibodies.mrt',
            filejson: 'cytotoxicantibodies.json',
            image: iconfile,
            name: $filter('translate')('3623'),
            path: '/Reportransplants/participants/cytotoxicantibodies/cytotoxicantibodies.mrt',
            pathjson: '/Reportransplants/participants/cytotoxicantibodies/cytotoxicantibodies.json'
          }]
        },
        {
          directory: 'donor',
          name: ($filter('translate')('3318')).toUpperCase(),
          children: [{
            image: iconfile,
            filename: 'allograft_recipients_deceased_donor.mrt',
            filejson: 'allograft_recipients_deceased_donor.json',
            name: $filter('translate')('3626'),
            path: '/Reportransplants/donor/allograft_recipients_deceased_donor/allograft_recipients_deceased_donor.mrt',
            pathjson: '/Reportransplants/donor/allograft_recipients_deceased_donor/allograft_recipients_deceased_donor.json'
          },
          {
            image: iconfile,
            filename: 'livingdonorallograftrecipientshaplotipos.mrt',
            filejson: 'livingdonorallograftrecipientshaplotipos.json',
            name: $filter('translate')('3627'),
            path: '/Reportransplants/donor/livingdonorallograftrecipientshaplotipos/livingdonorallograftrecipientshaplotipos.mrt',
            pathjson: '/Reportransplants/donor/livingdonorallograftrecipientshaplotipos/livingdonorallograftrecipientshaplotipos.json'
          },
          {
            image: iconfile,
            filename: 'livingdonorallograftrecipientsinhaplotipos.mrt',
            filejson: 'livingdonorallograftrecipientsinhaplotipos.json',
            name: $filter('translate')('3628'),
            path: '/Reportransplants/donor/livingdonorallograftrecipientsinhaplotipos/livingdonorallograftrecipientsinhaplotipos.mrt',
            pathjson: '/Reportransplants/donor/livingdonorallograftrecipientsinhaplotipos/livingdonorallograftrecipientsinhaplotipos.json'
          }]
        }
      ]
      return dataReportsFile;
    }
    return service;
  }
})();
/* jshint ignore:end */


