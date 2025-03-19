var router = require('express').Router();
var four0four = require('./utils/404')();
var nodemailer = require('nodemailer');
var WebSocket = require('ws');
var fs = require('fs');
var moment = require('moment');
var common = require('./common')();
var Request = require('request');
//var axios = require('axios');


router.get('/language', (req, res) => {
    res.send(fs.readFileSync("./src/client/languages/locale-es.json", "utf8"));
});

router.post('/uploadFile', uploadFile);
router.post('/uploadAudio', uploadAudio);
router.post('/getlistReportFile', getlistReportFile);
router.post('/getReporttransplants', getReporttransplants);
router.post('/printReportOrders', printReportOrders);
router.post('/renderReport', renderReport);
router.post("/datatribunal", datatribunal);
router.post("/patienttribunal", patienttribunal);
router.post("/getdatasiga", getdatasiga);
router.post("/getdatasigapost", getdatasigapost);
/* router.get("/getdatasiga", getdatasiga);
router.post("/getdatasigapost", getdatasigapost);
 */

module.exports = router;

//////////////  WEB SOCKET  ////////////////////////

var wss = new WebSocket.Server({ port: 5051 });
var connections = [];

wss.on('connection', function connection(ws, req) {

    var ip = req.connection.remoteAddress;
    var client = {
        ip: ip,
        ws: ws
    }

    connections.push(client);

    ws.on('close', function close() {
        connections.forEach(function each(value, key) {
            if (ws === value.ws) {
                delete connections[key];
            }
        })
    });
});

function printReportOrders(req, res) {
    var send = false;
    var message = {};
    var parameterReport = req.body;
    var path = "./src/client/Report/reportsandconsultations/reports/";
    var variables = JSON.parse(parameterReport.variables);
    var nameTemplate = "reports.mrt";
    var dataOrder = JSON.parse(parameterReport.order);
    var userlist = JSON.parse(parameterReport.userlist);
    var attachments = JSON.parse(parameterReport.attachments);

    if (fs.existsSync(path + variables.templateorder)) {
        nameTemplate = variables.templateorder;
    }

    if (dataOrder.allDemographics.length > 0) {
        dataOrder.allDemographics.forEach(function (value2) {
            dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
            dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
        });
    }

    dataOrder.createdDate = moment(dataOrder.createdDate).format(variables.formatDate + ' HH:mm:ss');
    dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(variables.formatDate);
    dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, variables.formatDate);
    dataOrder.attachments = attachments === undefined ? [] : attachments;

    dataOrder.listfirm = [];
    for (var i = 0; i < dataOrder.resultTest.length; i++) {
        dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(variables.formatDate + ' HH:mm:ss');
        dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(variables.formatDate + 'HH:mm:ss');
        dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(variables.formatDate + ' HH:mm:ss');
        dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(variables.formatDate + ' HH:mm:ss');
        dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(variables.formatDate + ' HH:mm:ss');
        dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(variables.formatDate + ' HH:mm:ss');

        if (dataOrder.resultTest[i].hasAntibiogram) {
            dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
        }

        if (dataOrder.resultTest[i].validationUserId !== undefined) {
            var findfirm = dataOrder.listfirm.find(order => (order.areaId === dataOrder.resultTest[i].areaId && order.validationUserId === dataOrder.resultTest[i].validationUserId));
            var user = userlist.find(user => user.id === dataOrder.resultTest[i].validationUserId);
            if (findfirm === undefined) {
                var firm = {
                    "areaId": dataOrder.resultTest[i].areaId,
                    "areaName": dataOrder.resultTest[i].areaName,
                    "validationUserId": dataOrder.resultTest[i].validationUserId,
                    "validationUserIdentification": dataOrder.resultTest[i].validationUserIdentification,
                    "validationUserName": dataOrder.resultTest[i].validationUserName,
                    "validationUserLastName": dataOrder.resultTest[i].validationUserLastName,
                    "firm": user.photo
                }
                dataOrder.listfirm.push(firm)
            }
        }
    }

    var report = new Stimulsoft.Report.StiReport();
    var reportTemplate = fs.readFileSync(path + nameTemplate, "utf8")
    report.load(reportTemplate);

    var jsonData = {
        "order": dataOrder,
        "Labels": [JSON.parse(parameterReport.labelsreport)],
        "Variables": [parameterReport.variables]
    };

    var dataSet = new Stimulsoft.System.Data.DataSet();
    dataSet.readJson(jsonData);

    // Remove all connections from the report template
    report.dictionary.databases.clear();
    // Register DataSet object
    report.regData('Demo', 'Demo', dataSet);
    // Render report with registered data
    report.render();
    var pdfData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
    var buffer = new Buffer(pdfData, "utf-8");

    res.json(buffer);
}

function getlistReportFile(req, res) {
    var listReports = [];
    fs.readdir("./src/client/Report", function (err, files) {
        files.forEach(function (element) {
            fs.readdir("./src/client/Report/" + element, function (err, files1) {
                if (files1 !== undefined) {
                    files1.forEach(function (element1) {
                        fs.readdir("./src/client/Report/" + element + "/" + element1, function (err, files2) {
                            if (files2 !== undefined) {
                                files2.forEach(function (element2) {
                                    var valid = element2.split(".");
                                    if (valid[1] === "mrt") {
                                        var report = { "name": element2 }
                                        listReports.push(report)
                                    } else if (valid.length === 1) {
                                        fs.readdir("./src/client/Report/" + element + "/" + element1 + "/" + element2, function (err, files3) {
                                            if (files3 !== undefined) {
                                                files3.forEach(function (element3) {
                                                    var valid2 = element3.split(".");
                                                    if (valid2[1] === "mrt") {
                                                        var report = { "name": element3 }
                                                        listReports.push(report)
                                                    }
                                                })
                                            }
                                        })
                                    }

                                })
                            }
                        })
                    })
                }
            })
        });

    });
    setTimeout(function () {
        res.send(listReports);
    }, 3000)
}
function getReporttransplants(req, res) {
    var listReports = [];
    fs.readdir("./src/client/Reportransplants", function (err, files) {
        files.forEach(function (element) {
            fs.readdir("./src/client/Reportransplants/" + element, function (err, files1) {
                if (files1 !== undefined) {
                    files1.forEach(function (element1) {
                        fs.readdir("./src/client/Reportransplants/" + element + "/" + element1, function (err, files2) {
                            if (files2 !== undefined) {
                                files2.forEach(function (element2) {
                                    var valid = element2.split(".");
                                    if (valid[1] === "mrt") {
                                        var report = { "name": element2 }
                                        listReports.push(report)
                                    } else if (valid.length === 1) {
                                        fs.readdir("./src/client/Reportransplants/" + element + "/" + element1 + "/" + element2, function (err, files3) {
                                            if (files3 !== undefined) {
                                                files3.forEach(function (element3) {
                                                    var valid2 = element3.split(".");
                                                    if (valid2[1] === "mrt") {
                                                        var report = { "name": element3 }
                                                        listReports.push(report)
                                                    }
                                                })
                                            }
                                        })
                                    }

                                })
                            }
                        })
                    })
                }
            })
        });

    });
    setTimeout(function () {
        res.send(listReports);
    }, 3000)
}
function uploadFile(req, res) {

    var path = './src/client' + req.body.path;
    fs.writeFile(path, req.body.file, 'utf-8', function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('The file has been saved!');
            res.send(200);
        }
    });



}

function renderReport(req, res) {
    var parameterReport = req.body;

    var Stimulsoft = require('stimulsoft-reports-js');
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(parameterReport.letter);

    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(parameterReport.pathreport);

    // Load reports from JSON object
    var jsonData = { 'data': [parameterReport.datareport], 'Labels': [parameterReport.labelsreport], 'Variables': [parameterReport.variables] };

    var dataSet = new Stimulsoft.System.Data.DataSet();
    dataSet.readJson(jsonData);

    // Remove all connections from the report template
    report.dictionary.databases.clear();
    // Register DataSet object
    report.regData('Demo', 'Demo', dataSet);
    report.render();

    if (parameterReport.type === 'pdf') {
        report.renderAsync(() => {
            // Export to PDF
            report.exportDocumentAsync((pdfData) => {
                // Converting Array into buffer


                var pdfData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
                var buffer = new Buffer(pdfData, "utf-8");
                /* var buffer = new Buffer(pdfData, "utf-8"); */
                res.json(buffer);
                // File System module
                /*  var fs = require('fs');
     
                 // Saving string with rendered report in PDF into a file
                 fs.writeFileSync('report/SimpleList.pdf', buffer);
                 console.log("Rendered report saved into PDF-file."); */
            }, Stimulsoft.Report.StiExportFormat.Pdf);
        });

    } else {
        report.renderAsync(() => {
            // Export to PDF
            report.exportDocumentAsync((pdfData) => {
                // Converting Array into buffer


                var pdfData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Excel2007);
                var buffer = new Buffer(pdfData, "utf-8");
                /* var buffer = new Buffer(pdfData, "utf-8"); */
                res.json(buffer);
                // File System module
                /*  var fs = require('fs');
     
                 // Saving string with rendered report in PDF into a file
                 fs.writeFileSync('report/SimpleList.pdf', buffer);
                 console.log("Rendered report saved into PDF-file."); */
            }, Stimulsoft.Report.StiExportFormat.Excel2007);
        });
    }
}
////////////   PRINT BARCODE  ////////////////////////////
function uploadAudio(req, res) {
    var path = './src/client' + req.body.path;
    var buf = new Buffer(req.body.file, 'base64'); // decode
    fs.writeFile(path, buf, function (err) {
        if (err) {
            console.log("err", err);
            res.send(err);
        } else {
            res.send(200);
        }
    });
}
function datatribunal(req, res, next) {
    var data = req.body;
    Request.post(
        {
            headers: {
                "content-type": "application/json",
                Authorization: 'Basic ' + Buffer.from(data.username + ':' + data.password).toString('base64'),
            },
            url: data.url,
            hideOverlay: true,
            body: JSON.stringify({
                personalId: data.personalId,
                fullNameApproximation: data.fullNameApproximation,
            }),
        },
        (error, response, body) => {
            if (error) {
                console.log(error);
                res.send("");
            } else {
                console.log(body);
                if (body.search('<html>') !== -1) {
                    res.send("");
                } else {
                    res.send(JSON.parse(body));
                }
            }
        }
    );
}
function patienttribunal(req, res, next) {
    var data = req.body;
    Request.post(
        {
            headers: {
                "content-type": "application/json",
                Authorization: 'Basic ' + Buffer.from(data.username + ':' + data.password).toString('base64'),
            },
            url: data.url,
            hideOverlay: true,
            body: JSON.stringify({
                personalId: data.personalId,
                fullNameApproximation: data.fullNameApproximation,
            }),
        },
        (error, response, body) => {
            if (error) {
                console.log(error);
                res.send("");
            } else {
                console.log(body);
                if (body.search('<html>') !== -1) {
                    res.send("");
                } else {
                    res.send(JSON.parse(body));
                }
            }
        }
    );
}

function datatribunal(req, res, next) {
    var data = req.body;
    Request.post(
        {
            headers: {
                "content-type": "application/json",
                Authorization: 'Basic ' + Buffer.from(data.username + ':' + data.password).toString('base64'),
            },
            url: data.url,
            hideOverlay: true,
            body: JSON.stringify({
                personalId: data.personalId,
                fullNameApproximation: data.fullNameApproximation,
            }),
        },
        (error, response, body) => {
            if (error) {
                console.log(error);
                res.send("");
            } else {
                console.log(body);
                if (body.search('<html>') !== -1) {
                    res.send("");
                } else {
                    res.send(JSON.parse(body));
                }
            }
        }
    );
}
/* function getdatasiga(req, res) {    
    Request.get( req.query.url, (error, response, body) => {
            if (error) {
                console.error('Error:', error.message);
                res.send('Error:', error.message);
              }
              if (response.statusCode === 200) {
                 res.send(body);
              } else {
                res.send(body);
              }
    });
}

function getdatasigapost(req, res) {    
    var data = req.body;
    var options = {
        url: data.url,
        method: 'POST',
        hideOverlay: true,
        json: true, // Indica que estás enviando y esperando JSON
        body: data.data
      };

      Request(options, (error, response, body) => {
        if (error) {
            console.error('Error al enviar datos:', error);
            return res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
        }
        res.status(200).json({data: body });
      });   
}

 */

function getdatasiga(req, res) { 

    console.log("URL SIGA " + req.body.url)
       var instance = axios.create();
    
        // Hacer una solicitud GET a otro servicio
        instance.get(req.body.url)
            .then(response => {
                // Aquí puedes procesar la respuesta como desees
                const responseData = response.data;
                console.log("RES SIGA " + JSON.stringify(responseData))
                // Responder al cliente con los datos obtenidos del servicio GET
                res.json(responseData);
            })
            .catch(error => {
                // Manejar errores
                console.error('Error al hacer la solicitud GET:', error);
                res.status(500).send('Error interno del servidor');
            });
    }
    
    function getdatasigapost(req, res) {    
        const data = req.body; // El body contiene la URL y los datos a enviar
        
        const options = {
            url: data.url,          // La URL que viene en el cuerpo de la solicitud
            method: 'POST',         // El método POST
            headers: {
                'Content-Type': 'application/json', // Asegúrate de enviar JSON
            },
            data: data.data,        // Los datos que se deben enviar en el cuerpo de la solicitud
        };
    
        axios(options)
            .then(response => {
                // Si la solicitud es exitosa, enviamos la respuesta al cliente
                res.status(200).json({ data: response.data });
            })
            .catch(error => {
                // Si ocurre un error, respondemos con un mensaje de error
                console.error('Error al enviar datos:', error);
                res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
            });  
    }




