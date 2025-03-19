/* jshint ignore:start */
// simple express server
var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var moment = require('moment');

var fs = require('fs');

// Stimulsoft Reports module
var Stimulsoft = require('stimulsoft-reports-js');
// Loading fonts
Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlGSHqq09KidzkMbeapDJ2X9n4lt4x3mFefYI9Ap5WVzsJz8Q" +
"pPJ1iw3gG/RMnEVANY5GruVr9xxmmJz9JFD66SDfLoTYbeEqpOrfve8HAtcX9v4nwNDKFcOx2F2Sq5gMdJouw2AEGf" +
"93sxV7/TCHjXUZN4dNyqEkNZBspV+BAEULEKewMHFj0tT2xv+KFhZrEzGp2FnyWRt0w8iRxTFTUWqdskPj6blNN19p" +
"NvFHxyYgruMHwE+hYDKWp4LnKAG4Jcc+hn1RgvuFrBvyurIlDNrxCylk1cf2MENZXZa/sJb3mn3qvRqY2emUjmX5Tg" +
"9mEXh7nRNzTAhLjtDm17SXMcviNphKPp/9CfoETYQ2gV3EAkQMC0vXupxAtW1Q2JoCv9U29V/TyXKstgzfL8R0ZdHH" +
"FXufibe/VDtEuB7VtM7mq1ZFU06gZ+JEmB+PykBxHTfRJuCn3+dRcSbfvOB3RkzFKF5wD2hI7y9KgzaxTOsGVhcYWH" +
"iXFx3VcQ4zazwHsVZUj3JeTfF1CCCkXvl6NfF2OF0/sBwVvyXc+3ajTQ5pJ5FUr6Lg7OsmPTYbBZdEygmL/Yo/paP/" +
"0bgF+2osMZMC/PqT1AxyDkupogFkN8tBgefzVdPMg2Wwg8CXhyx2Pu2zb+9M+1pqXVjdNdDEgh";



app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/testServerPrint', function (req, res) {
	res.json('OK')
});

app.post("/printReportOrders", (req, res, next) => {
	var send = false;
	var message = {};

	console.log(req.body);


	var dataOrder = JSON.parse(req.body.order);
	var dataVariables = JSON.parse(req.body.variables)

	console.log(dataOrder)


	dataOrder.createdDate = moment(dataOrder.createdDate).format(dataVariables.formatDate + ' HH:mm:ss')


	dataOrder.listfirm = [];
	for (var i = 0; i < dataOrder.resultTest.length; i++) {
		dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(dataVariables.formatDate + ' HH:mm:ss');
		dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(dataVariables.formatDate + ' HH:mm:ss');
		dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(dataVariables.formatDate + ' HH:mm:ss');
		dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(dataVariables.formatDate + ' HH:mm:ss');
		dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(dataVariables.formatDate + ' HH:mm:ss');
		dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(dataVariables.formatDate + ' HH:mm:ss');

		if (dataOrder.resultTest[i].hasAntibiogram) {
			dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
		}

		if (dataOrder.resultTest[i].validationUserId !== undefined) {
			var findfirm = dataOrder.listfirm.find(order => (order.areaId === dataOrder.resultTest[i].areaId && order.validationUserId === dataOrder.resultTest[i].validationUserId));
			if (findfirm === undefined) {
				var firm = {
					"areaId": dataOrder.resultTest[i].areaId,
					"areaName": dataOrder.resultTest[i].areaName,
					"validationUserId": dataOrder.resultTest[i].validationUserId,
					"validationUserIdentification": dataOrder.resultTest[i].validationUserIdentification,
					"validationUserName": dataOrder.resultTest[i].validationUserName,
					"validationUserLastName": dataOrder.resultTest[i].validationUserLastName,
					"firm": dataOrder.resultTest[i].validationUserSignature
				}
				dataOrder.listfirm.push(firm)
			}
		}

	}

	var parameterReport = {
		"order": dataOrder,
		"Labels": [JSON.parse(req.body.labelsreport)],
		"Variables": [dataVariables]
	};


	var template = dataOrder.templateorder === undefined ? 'reports.mrt' : dataOrder.templateorder;

	var report = new Stimulsoft.Report.StiReport();
	var reportTemplate = fs.readFileSync("../Report/reportsandconsultations/reports/" + template, "utf8")

	report.load(reportTemplate);

	var dataSet = new Stimulsoft.System.Data.DataSet();
	dataSet.readJson(parameterReport);

	// Remove all connections from the report template
	report.dictionary.databases.clear();
	// Register DataSet object
	report.regData('Demo', 'Demo', dataSet);
	// Render report with registered data
	report.render();

	report.renderAsync(function () {
		// export to memory stream
		var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
		var service = new Stimulsoft.Report.Export.StiPdfExportService();

		var stream = new Stimulsoft.System.IO.MemoryStream();

		service.exportTo(report, stream, settings);

		var data = stream.toArray();

		var buffer = new Buffer(data, "utf-8");

		res.json(buffer);

	});



});

app.listen(6060);
/* jshint ignore:end */



