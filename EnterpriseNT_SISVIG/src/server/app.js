/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');

var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV;
var Stimulsoft = require('stimulsoft-reports-js');

var fs = require("fs");

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));


app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.use('/api', require('./routes'));

app.post("/printReportOrders", (req, res, next) => {
  var send = false;
  var message = {};
  var parameterReport = req.body;

  var report = new Stimulsoft.Report.StiReport();
  var reportTemplate = fs.readFileSync(__dirname + "/reports.mrt", "utf8")
  //var  reportTemplate = fs.readFileSync("./public/" + parameterReport.pathreport, "utf8")
  report.load(reportTemplate);

  var jsonData = {
    'data': parameterReport.data,
    'Labels': parameterReport.labelsreport,
    'Variables': parameterReport.variables
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
});

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    // Invalid calls to assets should return the custom error object to mitigate
    // against XSS reflected attacks
    app.use('/js/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    app.use('/images/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    app.use('/styles/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./build/index.html'));
    break;
  default:
    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function (req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));
    break;
}

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});
