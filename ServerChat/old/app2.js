/*jshint node:true*/
'use strict';
const express = require("express");
require('dotenv').config();
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var app = express();
const merge = require('easy-pdf-merge');
var fs = require('fs');
const pdf2base64 = require('pdf-to-base64');
var _ = require('lodash');

dispatcher.setStatic('.');
dispatcher.setStaticDirname('.');

var pdf = require("pdf-creator-node");
const json2csv = require('json2csv').parse;
const handlebars = require('handlebars');


// PUERTO
const PORT = process.env.PORT || 5001;

//STORAGE ADJUNTOS
const dirStorage = process.env.DIR_STORAGE || "C:\\images";

handlebars.registerHelper('if', function (conditional, options) {
	if (conditional) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

handlebars.registerHelper('gt', function (a, b) {
	return a > b;
});

handlebars.registerHelper('arrayLength', function (array) {
	return array.length;
});

function handleRequest(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}
	try {
		dispatcher.dispatch(req, res)
	} catch (e) {
	}
}

var server = require('http').createServer(handleRequest);

var io = require('socket.io')(server);

var socket = require('./old/socket.js');
io.sockets.on('connection', socket);

dispatcher.onPost("/api/renderReport", function (req, res) {

	try {

		var parameterReport = JSON.parse(req.body);

		var Stimulsoft = require('stimulsoft-reports-js');

		var path = process.env.PATH_LIS;

		Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHm5tRte7jqQJlaA/swPF0QFuSyDi9yg9zLXn/C9JyDTVREvL/" +
			"WNzi+DNpTn5ILodo1C9ETYBZQ6mEjX1aeQSbCqwgUDXaWEgiqR9fNr0+Sasf39CLMzJVIhElX3r/KXz6HPX32wbD4m" +
			"/Cuo9+jzcyUOTO337rBhvz3loKVMsQx63yrt7twWSgis4U7CzKylrEk1/7zsVeEdUlLZlKk6fbOnMKtFponKInspdv" +
			"o79xbtjhEGJZdHR5VjRqMWkF2VFhHuA1UddPR+kWKUHZtcXrQV0zuxP8/3A/nSIOitrorlRSUtnJ8aE4MCn/NVckK3" +
			"FkNdFKdY3xpFrDucTRyq0+fGADhMgSXc3d3KC01NhTUnPJHK8Nxd5O9DXuS22owK6JFNDjNHWSc0QkYgJpicY7MAKb" +
			"YCVD8shYmL8Iwkz7PUoB5qiGg2jwWIAhfWKKAW+bMjLswSABfXG9lWp5l5Hvcvd/5QwIs1Ib6ihQ2E25WSX+NzQmI3" +
			"miq+jfPXQ68C7EPccmgjAvM9OQ9IlnBKiqQDOra72tI1IJPTO46eSSOhHg==";

		Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(path.concat(parameterReport.letter));

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
	} catch (error) {
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end("");
	}
});

dispatcher.onPost("/api/mergepdf", function (req, res) {

	try {
		var attachments = JSON.parse(req.body);

		if (attachments.length > 0) {

			var names = [];
			var current = new Date().getTime();

			var pathinit = "./attachments/" + current.toString();

			fs.mkdirSync(pathinit);

			attachments.map((attach, index) => {

				//ADJUNTOS EN STORAGE
				if (attach.file === '') {
					let path = `${dirStorage}/storage_NT/storage_reports/orders/${attach.idOrder}`;
					if (attach.idTest) {
						path += `/${attach.idTest}`;
					}
					path += `/${attach.name}`;
					attach.file = fs.readFileSync(path , 'base64');
				}

				var buffer = Buffer.from(attach.file, 'base64');
				const name = pathinit + "/" + attach.idOrder + index + ".pdf";
				names.push(name);
				fs.writeFileSync(name, buffer, { encoding: 'base64' });
			});

			if (attachments.length == 1) {
				names.push("./attachments/empty.pdf");
			}

			var final = pathinit + "/" + attachments[0].idOrder + "final.pdf";
			if (names.length > 0) {
				merge(names, final, function (err) {
					if (err) {
						console.log("err", err);
						res.writeHead(500, { 'Content-Type': 'application/json' });
						res.end("");
					}
					pdf2base64(final)
						.then((response) => {
							names.map(name => {
								if (name !== './attachments/empty.pdf') {
									fs.unlinkSync(name);
								}
							});
							fs.unlinkSync(final);

							if (fs.existsSync(pathinit)) {
								fs.rmdirSync(pathinit, { recursive: true })
							}
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.end(JSON.stringify(response));
						})
						.catch((error) => {
							console.log("error", error);
							res.writeHead(500, { 'Content-Type': 'application/json' });
							res.end("");
						})
				});
			}
		} else {
			res.writeHead(204, { 'Content-Type': 'application/json' });
			res.end("");
		}
	} catch (error) {
		res.writeHead(500, { 'Content-Type': 'application/json' });
		res.end("");
	}
});


dispatcher.onPost("/api/generarpdf", function (req, res1) {

	try {

		var data = JSON.parse(req.body);
		var current = new Date().getTime();

		var pathinit = "./list/" + current.toString();

		fs.mkdirSync(pathinit);

		if (data.template == "reviewofresult/billing") {
			var state0 = {}

			var ingresados = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 0)
				}))
				.filter(item => item.tests.length > 0)
				.value();
			var repeticion = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 1)
				}))
				.filter(item => item.tests.length > 0)
				.value();
			var resultado = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 2)
				}))
				.filter(item => item.tests.length > 0)
				.value();
			var preValidados = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 3)
				}))
				.filter(item => item.tests.length > 0)
				.value();
			var validados = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 4)
				}))
				.filter(item => item.tests.length > 0)
				.value()
			var impresos = _.chain(data.data)
				.map(item => ({
					...item,
					tests: _.filter(item.tests, test => test.result.state === 5)
				}))
				.filter(item => item.tests.length > 0)
				.value()

			if (ingresados.length > 0) {
				state0.Ingresados = ingresados;
			}
			if (repeticion.length > 0) {
				state0.Repetición = repeticion;
			}
			if (resultado.length > 0) {
				state0.Resultado = resultado;
			}
			if (preValidados.length > 0) {
				state0["Pre Validados"] = preValidados;
			}
			if (validados.length > 0) {
				state0.Validados = validados;
			}
			if (impresos.length > 0) {
				state0.Impresos = impresos;
			}


			data.data = state0

		}

		if (data.type == "pdf") {
			var final = pathinit + "/final.pdf";

			if (data.template == "reviewofresult/billing") {
				var options = {
					height: "17.0in", // allowed units: mm, cm, in, px
					width: "22.0in", // allowed units: mm, cm, in, px
					border: "10mm",
					timeout: '1000000',
					timeoutSeconds: 700,  // in seconds
					memory: '2GB',
					footer: {
						height: "10mm",
						contents: {
							default: '<span style="font-style:normal;font-weight:bold;font-size:7pt;font-family:Arial;text-align:center; color: #444;">Pagina {{page}} de {{pages}}</span>'
						}
					}
				};
			}
			else {
				var options = {
					format: data.format,
					orientation: data.orientation,
					border: "10mm",
					timeout: '1000000',
					timeoutSeconds: 700,  // in seconds
					memory: '2GB',
					footer: {
						height: "10mm",
						contents: {
							default: '<span style="font-style:normal;font-weight:bold;font-size:7pt;font-family:Arial;text-align:center; color: #444;">Pagina {{page}} de {{pages}}</span>'
						}
					}
				};
			}

			var document = {
				html: fs.readFileSync("templateReports/" + data.template + ".html", "utf8"),
				data: {
					variables: data.variables,
					orders: data.data
				},
				path: final,
				type: "",
			};

			pdf
				.create(document, options)
				.then((res) => {
					pdf2base64(final)
						.then((response) => {
							console.log("termina generacion pdf")
							fs.unlinkSync(final);
							fs.rmdirSync(pathinit, { recursive: true })
							res1.end(JSON.stringify(response));

						})
						.catch((error) => {
							res1.writeHead(500, { 'Content-Type': 'application/json' });
							res1.end("");
							console.log("pdfbase64eror" + error);
						})
				})
				.catch((error) => {
					console.error(error);
				});
		}
		else {
			var final = pathinit + "/final.csv";
			const orders = data.data

			const fields = [];

			const csv = json2csv(orders, { fields });
			const templateSource = fs.readFileSync("templateReports/" + data.template + ".hbs", 'utf8')
			const template = handlebars.compile(templateSource);
			const output = template({ orders });

			fs.writeFile(final, output, function (err) {
				if (err) throw err;

				fs.readFile(final, function (err, data) {
					if (err) throw err;
					fs.unlinkSync(final);
					fs.rmdirSync(pathinit, { recursive: true })

					// Crear un objeto Buffer a partir del contenido del archivo
					const buffer = Buffer.from(data, 'utf8');

					// Convertir el objeto Buffer a una cadena base64
					const base64 = buffer.toString('base64');

					res1.end(JSON.stringify(base64));
				});

			});



		}
	} catch (error) {
		res1.writeHead(500, { 'Content-Type': 'application/json' });
		res1.end("");
	}
});



server.listen(PORT, function () {
	console.log('\n')
	console.log(`>> Socket listo y escuchando por el puerto: ` + PORT);
});

