/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('reportadicional', reportadicional);

    reportadicional.$inject = ['$http', '$q', '$filter', 'exception', 'logger',
        'settings', 'moment', 'reportsDS', '$translate'
    ];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function reportadicional($http, $q, $filter, exception, logger,
        settings, moment, reportsDS, $translate) {

        var parameterReport = {};

        var service = {
            printdirectReport: printdirectReport,
            sendEmail: sendEmail,
            printReport: printReport,
            sendEmailexception: sendEmailexception,
            printPDFEmail: printPDFEmail,
            saveReportPdf: saveReportPdf,
            saveReportPdfAll: saveReportPdfAll,
            sendEmailZip: sendEmailZip,
            sendEmailCompress: sendEmailCompress,
            renderBase64: renderBase64,
            exportReportExcel: exportReportExcel,
            exportReportPdf: exportReportPdf,
            updatePrinted: updatePrinted,
            uploadFile: uploadFile,
            validFile: validFile,
            getlistReportFile: getlistReportFile,
            testServerPrint: testServerPrint,
            reportRender: reportRender,
            sendEmailV2: sendEmailV2,
            getReportransplant:getReportransplant,
            sendEmailAppointmentV2: sendEmailAppointmentV2
        };

        return service;

        function testServerPrint(url) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                url: url + 'testServerPrint',
                transformResponse: [
                    function (data) {
                        return data;
                    }
                ]
            }).then(function (response) {
                return response;
            });

        }
        
        function sendEmailAppointmentV2(token, data) {
            return $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrlApi + '/email/appointment',
                hideOverlay: true,
                data: data
            }).then(function (response) {
              return response;
            });
        }

        function getlistReportFile(parameters) {
            return $http.post('/api/getlistReportFile', parameters)
                .then(success);

            function success(response) {
                return response;
            }
        }


        function getReportransplant(parameters) {
            return $http.post('/api/getReporttransplants', parameters)
                .then(success);

            function success(response) {
                return response;
            }
        }

        function validFile(parameters) {
            return $http.post('/api/validFile', parameters)
                .then(success)
                .catch(fail);

            function success(response) {
                return response;
            }

            function fail(e) {
                return e;
            }
        }

        function uploadFile(parameters) {
            return $http.post('/api/uploadFile', parameters)
                .then(success);

            function success(response) {
                return response;
            }
        }

        function printdirectReport(parameters) {
            return $http.post('/api/loadReport', parameters)
                .then(success);

            function success(response) {
                return response;
            }
        }


        function printPDFEmail(api, parameters) {
            return $http.post(api, parameters)
                .then(success);

            function success(response) {
                return response;
            }
        }

        function updatePrinted(value, token, deliveryType) {
            var test = [];
            var state = [];
            value.reportDetail.forEach(function (value2) {
                test.push({ 'testId': value2.testId });
                state.push({ 'state': value2.state });
            });
            var testUniq = [];
            test.filter(function (elem, pos) {
                if (state[pos].state === 4) {
                    if (testUniq.length === 0) {
                        testUniq.push(elem);
                    } else {
                        if (testUniq[testUniq.length - 1].testId !== elem.testId) {
                            testUniq.push(elem);
                        }
                    }
                }
            });

            var json = {
                'orderNumber': value.orderNumber,
                'resultTest': testUniq,
                'deliveryType': { 'id': deliveryType }
            };

            if (testUniq.length > 0) {
                return reportsDS.updateState(token, json).then(function (data) {
                    if (data.status === 200) {
                        logger.success("Prueba actualizada como impresa");
                    }
                })
            }
        }

        function printReport(parameterReport, parameterCopies) {

            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            if (parameterCopies !== undefined) {
                report.pageCopyNumber = parameterCopies;
                //report['CopyNo']  = parseInt(parameterCopies);
            }

            // Load reports from JSON object
            var jsonData = {
                'data': [parameterReport.datareport[0].reportDetail],
                'Labels': [labelsreport],
                'Variables': [parameterReport.variables]
            };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();
            report.print();
            return true;
        }

        //** Método que envia mails con archivo pdf adjunto*/
        function sendEmailexception(parameterReport, parameterEmail) {

            var report = new Stimulsoft.Report.StiReport();

            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            report.loadFile(parameterReport.pathreport);

            var jsonData = { 'data': [parameterReport.datareport], 'Labels': [labelsreport], 'Variables': [parameterReport.variables] };



            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();

            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();

            var stream = new Stimulsoft.System.IO.MemoryStream();

            service.exportTo(report, stream, settings);

            var data = stream.toArray();

            var listdata = {
                data: data,
                nameAttachment: parameterEmail.nameAttachment,
                subject: parameterEmail.subject,
                body: parameterEmail.body,
                emailDestination: parameterEmail.emailDestination
            }

            return $http.post('/api/sendEmail', listdata)
                .then(success)

            function success(response) {
                return response.data;
            }
        }

        //** Método que envia mails con archivo pdf adjunto*/
        function sendEmail(parameterReport, parameterEmail) {

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            // Load reports from JSON object
            var jsonData = {
                'data': [parameterReport.datareport[0].reportDetail],
                'Labels': [parameterReport.labelsreport],
                'Variables': [parameterReport.variables]
            };

            var dataAttachmentsPDF = parameterReport.datareport[0].attachmentsPDF;
            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();

            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();

            var stream = new Stimulsoft.System.IO.MemoryStream();

            service.exportTo(report, stream, settings);
            updatePrinted(parameterReport.datareport[0], parameterReport.token, parameterReport.deliveryType);

            var data = stream.toArray();
            var listdata = {};
            if (dataAttachmentsPDF.length > 0) {
                var zip = new JSZip();
                zip.file(parameterEmail.nameAttachment, stream.toArray());
                dataAttachmentsPDF.forEach(function (valuePDF) {
                    zip.file(valuePDF.name, valuePDF.file);
                });
                zip.generateAsync({ type: "array" })
                    .then(function (content) {
                        // see FileSaver.js
                        var nameZip = $filter('translate')('0110') + '[' + dataAttachmentsPDF.length.toString() + '].zip';
                        listdata = {
                            data: content,
                            nameAttachment: nameZip,
                            subject: parameterEmail.subject,
                            body: parameterEmail.body,
                            emailDestination: parameterEmail.emailDestination
                        }

                    });

            } else {
                listdata = {
                    data: data,
                    nameAttachment: parameterEmail.nameAttachment,
                    subject: parameterEmail.subject,
                    body: parameterEmail.body,
                    emailDestination: parameterEmail.emailDestination
                }

            }

            return $http.post('/api/sendEmail', listdata)
                .then(success)

            function success(response) {
                return response.data;
            }
            // listdata = {
            //     data: data,
            //     nameAttachment: parameterEmail.nameAttachment,
            //     subject: parameterEmail.subject,
            //     body: parameterEmail.body,
            //     emailDestination: parameterEmail.emailDestination
            // }
            // return $http.post('/api/sendEmail', listdata)
            // .then(success)

            // function success(response) {
            //   return response.data;
            // }

        }


        //** Método que envia mails con archivo pdf adjunto*/
        function reportRender(parameterReport) {
            if (location.href.search('http://localhost:3000') !== -1) {
                //Local
                parameterReport.pathreport = "/src/client" + parameterReport.pathreport;
                parameterReport.letter = "/src/client/assets/fonts/Roboto-Black.ttf"
            } else {
                //publicación
                parameterReport.pathreport = "/public" + parameterReport.pathreport;
                parameterReport.letter = "/public/assets/fonts/Roboto-Black.ttf"
            }
            var view = { hideOverlay: true, }
            return $http.post(settings.serviceUrlSocketIO + '/api/renderReport', parameterReport, view)
                .then(success);


            function success(response) {
                var buffer = new Uint8Array(response.data.data);
                if (parameterReport.type === 'pdf') {
                    Object.saveAs(buffer, "Report.pdf", "application/pdf");
                } else {
                    Object.saveAs(buffer, "Report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                }
                return true;
            }

        }

        function sendEmailZip(parameterReport, parameterEmail) {

            var zip = new JSZip();
            // Load reports from JSON object

            parameterReport.datareport.forEach(function (value) {

                var labelsreport = JSON.stringify($translate.getTranslationTable());
                labelsreport = JSON.parse(labelsreport);

                var report = new Stimulsoft.Report.StiReport();

                report.loadFile(parameterReport.pathreport);

                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service = new Stimulsoft.Report.Export.StiPdfExportService();

                var stream = new Stimulsoft.System.IO.MemoryStream();

                var dataReportByOrder = value.reportDetail;

                var dataAttachmentsPDF = value.attachmentsPDF;

                var jsonData = {
                    'data': [dataReportByOrder],
                    'Labels': [labelsreport],
                    'Variables': [parameterReport.variables]
                };
                var dataSet = new Stimulsoft.System.Data.DataSet();
                dataSet.readJson(jsonData);

                // Remove all connections from the report template
                report.dictionary.databases.clear();
                // Register DataSet object
                report.regData('Demo', 'Demo', dataSet);
                // Render report with registered data
                report.render();
                updatePrinted(value, parameterReport.token, parameterReport.deliveryType);

                service.exportTo(report, stream, settings);
                zip.file(value.nameReport, stream.toArray());
                if (dataAttachmentsPDF.length > 0) {
                    var attach = zip.folder($filter('translate')('0376') + '[' + dataAttachmentsPDF.length.toString() + ']' + '_' + value.physicianName);
                    dataAttachmentsPDF.forEach(function (valuePDF) {
                        attach.file(valuePDF.name, valuePDF.file, { base64: false });
                    });
                }

            });
            zip.generateAsync({ type: "array" })
                .then(function (content) {
                    // see FileSaver.js
                    var nameZip = $filter('translate')('0360') + '[' + parameterReport.datareport.length.toString() + '].zip';
                    var listdata = {
                        data: content,
                        nameAttachment: nameZip,
                        subject: parameterEmail.subject,
                        body: parameterEmail.body,
                        emailDestination: parameterEmail.emailDestination
                    }

                    return $http.post('/api/sendEmail', listdata)
                        .then(success)

                    function success(response) {
                        return response.data;
                    }
                });
        }

        //** Método que guarda o exporta un reporte en PDF*/
        function saveReportPdf(parameterReport, parameterNameFile) {

            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            // Load reports from JSON object
            var jsonData = {
                'data': [parameterReport.datareport[0].reportDetail],
                'Labels': [labelsreport],
                'Variables': [parameterReport.variables]
            };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();

            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();

            var stream = new Stimulsoft.System.IO.MemoryStream();

            service.exportTo(report, stream, settings);

            updatePrinted(parameterReport.datareport[0], parameterReport.token, parameterReport.deliveryType);

            var data = stream.toArray();
            //var base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

            // Save data to file
            var dataAttachmentsPDF = parameterReport.datareport[0].attachmentsPDF;
            if (dataAttachmentsPDF.length > 0) {
                var zip = new JSZip();
                zip.file(parameterNameFile, stream.toArray());
                dataAttachmentsPDF.forEach(function (valuePDF) {
                    zip.file(valuePDF.name, valuePDF.file);
                });
                zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        // see FileSaver.js
                        var nameZip = parameterNameFile + '_' + $filter('translate')('0376') + '[' + dataAttachmentsPDF.length.toString() + '].zip';
                        saveAs(content, nameZip);
                    });
            } else {
                Object.saveAs(data, parameterNameFile, 'application/pdf');
            }
            //Object.saveAs(data, parameterNameFile, 'application/pdf');
        }


        //Descarga todos los archivos PDF en un zip
        function saveReportPdfAll(listReport) {
            var zip = new JSZip();
            // Load reports from JSON object
            listReport.forEach(function (value) {
                if (value.nameReport == "Reportxls") {
                    zip.file(value.nameReport + ".xlsx", value.buffer, { binary: true });
                } else {
                    zip.file(value.nameReport + ".pdf", value.buffer, { binary: true });
                }
            });
            var blob = zip.generate({ type: "blob" });
            var nameZip = $filter('translate')('0360') + '[' + listReport.length.toString() + '].zip';
            saveAs(blob, nameZip);
        }
        //Descarga todos los archivos PDF en un zip
        function sendEmailCompress(token, data) {


            return $http({
                method: 'POST',
                headers: { 'Authorization': token },
                accept: 'text/plain',
                url: settings.serviceUrl + '/users/email',
                hideOverlay: true,
                data: data,
                transformResponse: [
                    function (data) {
                        return data;
                    }
                ]
            })

                .then(function (response) {
                    return response;
                });
        }

        function sendEmailV2(token, data) {
          return $http({
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrlApi + '/email',
              hideOverlay: true,
              data: data
          }).then(function (response) {
            return response;
          });
      }




        function renderBase64(parameterReport, parameterCopies) {

            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            if (parameterCopies !== undefined) {
                report.pageCopyNumber = parameterCopies;
                //report['CopyNo']  = parseInt(parameterCopies);
            }

            // Load reports from JSON object
            var jsonData = { 'data': [parameterReport.datareport], 'Labels': [labelsreport], 'Variables': [parameterReport.variables] };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();

            var stream = new Stimulsoft.System.IO.MemoryStream();
            service.exportTo(report, stream, settings);

            var data = stream.toArray();
            var base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

            return base64;
        }


        //** Método que guarda o exporta un reporte en Excel*/
        function exportReportExcel(parameterReport) {
            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            // Load reports from JSON object
            var jsonData = { 'data': [parameterReport.datareport], 'Labels': [labelsreport], 'Variables': [parameterReport.variables] };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);


            report.renderAsync(function () {
                var data = report.exportDocument(Stimulsoft.Report.StiExportFormat.Excel2007);
                Object.saveAs(data, "Report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            })

        }
        //** Método que guarda o exporta un reporte en Excel*/
        function exportReportPdf(parameterReport) {

            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);

            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(parameterReport.pathreport);

            // Load reports from JSON object
            var jsonData = { 'data': [parameterReport.datareport], 'Labels': [labelsreport], 'Variables': [parameterReport.variables] };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);

            report.renderAsync(function () {
                var data = report.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
                Object.saveAs(data, "Report.pdf", "application/pdf");
            })

        }
    }
})();
/* jshint ignore:end */
