/*jshint node:true*/
'use strict';
const express = require("express");
require('dotenv').config();
var HttpDispatcher = require('httpdispatcher');
var dispatcher     = new HttpDispatcher();
var app = express();
const merge = require('easy-pdf-merge');
var fs = require('fs');
const pdf2base64 = require('pdf-to-base64');

dispatcher.setStatic('.');
dispatcher.setStaticDirname('.');

function handleRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }
    try {
      dispatcher.dispatch(req, res)
    } catch(e) {
    }
  }

var server = require('http').createServer(handleRequest);

var io = require('socket.io')(server);

var socket = require('./socket.js');
io.sockets.on('connection', socket);

dispatcher.onPost("/api/renderReport", function(req, res) {
    
    var parameterReport = JSON.parse(req.body);

    var Stimulsoft = require('stimulsoft-reports-js');

    var path = process.env.PATH_LIS;

    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(path.concat(parameterReport.letter));
	Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmThaUC9O4WIvthEnnI4JdCFJitv7JqpZrafYACHBzqByeQgdRB2Y0f1fPCqWyqMixc9WzW4Sv/5CPkYzFMnjbjoUCnrAeqsNnqHaHuQ1W7rg86AEHor9p68M7+xlwPg89JGg6XsDnSwnP1/JVoHE5OSwb27KjWJDCmZHKRgnBEeyjYZ/kKDDnEK6TK/43/HprWgL2VoEVNdm6HCbWQiFKRfAt2f/UYfbHVGOHi0l+3wpIXT5KbZdKno2CaJggJWezFBpGxntTPs5XMQ5YEyyCHaXWPw8LGdz1rpUGBv4Idek9W3wLAHVTpMkMx53MYm++luIRniPcXmkuaOV9mLLR5jnY/gPVd1TIr8uEKLoJlf6GSq12JoJ/OeKdf+dTya+7O5LNnnt7m+lfDYQsYKZ5RQU+eo+8X3zuS4XswRa20nOIx3QnLNOwbKtvRtnaMH7cEf8B0AiRB0umNqy4WZQAP+FU329w/QC0/0oOwJV9Oo/xFe11Q8nU1wd5Arsb9nFdgK+8yPWgvtVJr4PKI7XD8";

    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(path.concat(parameterReport.pathreport));

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
                var pdfData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Pdf);
                var buffer = new Buffer(pdfData, "utf-8");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(buffer));
            }, Stimulsoft.Report.StiExportFormat.Pdf);
        });

    } else {
        report.renderAsync(() => {
            // Export to Excel
            report.exportDocumentAsync((pdfData) => {
                var pdfData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Excel2007);
                var buffer = new Buffer(pdfData, "utf-8");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(buffer));
            }, Stimulsoft.Report.StiExportFormat.Excel2007);
        });
    }
});

dispatcher.onPost("/api/mergepdf", function(req, res) {

    var attachments = JSON.parse(req.body);

    if(attachments.length > 0) {

        var names = [];
        var current = new Date().getTime();

        var pathinit = "./attachments/" + current.toString();
    
        fs.mkdirSync(pathinit);

        attachments.map( (attach, index) => {
            var buffer = Buffer.from(attach.file, 'base64');
            const name = pathinit + "/" + attach.idOrder + index + ".pdf";
            names.push(name);
            fs.writeFileSync(name, buffer, {encoding: 'base64'});
        });
        
        if(attachments.length == 1) {
            names.push("./attachments/empty.pdf");
        }

        var final = pathinit + "/" + attachments[0].idOrder + "final.pdf";
        if(names.length > 0) {
            merge(names, final, function(err) {
                if(err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end("");
                }
                pdf2base64(final)
                .then((response) => {
                    names.map(name => {
                        if(name !== './attachments/empty.pdf') {
                            fs.unlinkSync(name);
                        }
                    });
                    fs.unlinkSync(final);
                    if (fs.existsSync(pathinit)) {
                        fs.rmdirSync(pathinit, {recursive: true})
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                })
                .catch((error) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end("");
                })
            });
        }
    } else {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end("");
    }
});

// App setup
const PORT = 5001;

server.listen(PORT, function() {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: 5001`)
});






