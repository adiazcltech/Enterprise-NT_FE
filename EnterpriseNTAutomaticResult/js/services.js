var http = require('http');
var axios = require('axios');
var lodash = require('lodash');
var moment = require('moment');
var Stimulsoft = require('stimulsoft-reports-js');
var PDFLib = require('pdf-lib');

var btoa = require('btoa');
var fs = require('fs');
var logs = require("./logs");


var urlServices = "http://localhost:8080/Enterprise_NT/api"
var serviceUrlApi = "http://192.168.1.90:5200/api"
var user = "admin"
var password = "123456"
var pathLenguajesEs = "D:/Enterprise_NT/02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/languages/locale-en.json"
var pathLenguajesEn = "D:/Enterprise_NT/02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/languages/locale-es.json"
var pathReport = "D:/Enterprise_NT/02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/Report/reportsandconsultations/reports/"
var filtermicrobiology = true; 
var idmicrobiology = 8;

var dataLenguajes;
var listconfiguration = [];
var datauser = [];
var demographicTemplate = null;
var nameDemographic = 'reports';
var totalorder = 0;
var count = 0;

var attachments;
var formatDate;
var headerServices;

Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmThaUC9O4WIvthEnnI4JdCFJitv7JqpZrafYACHBzqByeQgdRB2Y0f1fPCqWyqMixc9WzW4Sv/5CPkYzFMnjbjoUCnrAeqsNnqHaHuQ1W7rg86AEHor9p68M7+xlwPg89JGg6XsDnSwnP1/JVoHE5OSwb27KjWJDCmZHKRgnBEeyjYZ/kKDDnEK6TK/43/HprWgL2VoEVNdm6HCbWQiFKRfAt2f/UYfbHVGOHi0l+3wpIXT5KbZdKno2CaJggJWezFBpGxntTPs5XMQ5YEyyCHaXWPw8LGdz1rpUGBv4Idek9W3wLAHVTpMkMx53MYm++luIRniPcXmkuaOV9mLLR5jnY/gPVd1TIr8uEKLoJlf6GSq12JoJ/OeKdf+dTya+7O5LNnnt7m+lfDYQsYKZ5RQU+eo+8X3zuS4XswRa20nOIx3QnLNOwbKtvRtnaMH7cEf8B0AiRB0umNqy4WZQAP+FU329w/QC0/0oOwJV9Oo/xFe11Q8nU1wd5Arsb9nFdgK+8yPWgvtVJr4PKI7XD8";
Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
Stimulsoft.System.NodeJs.useWebKit = false;
Stimulsoft.System.NodeJs.initialize();

function login(req, res) {
	count = 0;
	var data = {
		'user': '',
		'password': '',
		'branch': 0
	};
	data.user = user;
	data.password = password;
	data.branch = 1;

	axios.post(urlServices + '/authentication', data)
		.then(function (response) {
			datauser = response.data;
			headerServices = {
				headers: { 'Authorization': datauser.token }
			};
			logs.info("..................................");
			logs.info("Usuario cargado...");
			configuration();
		}).catch(function (error) {
			logs.error("Problemas con el servicio de autenticacion");
		})
}


function configuration() {
	axios.get(urlServices + '/configuration', headerServices)
		.then(function (response) {

			listconfiguration = response.data;
			listconfiguration = lodash.filter(listconfiguration, function (c) {
				return c.key === "EmailBody" ||
					c.key === "EmailSubjectPatient" ||
					c.key === "EmailSubjectPhysician" ||
					c.key === "FormatoFecha" ||
					c.key === "ImprimirAdjuntos" ||
					c.key === "RutaReportes" ||
					c.key === "GeneraNombrePDFHistoria" ||
					c.key === "ImprimirInformeFinal" ||
					c.key === "DemograficoTituloInforme" ||
					c.key === "IdiomaReporteResultados"

			});

			attachments = lodash.filter(listconfiguration, function (c) { return c.key === "ImprimirAdjuntos" })[0].value;
			formatDate = lodash.filter(listconfiguration, function (c) { return c.key === "FormatoFecha" })[0].value.toUpperCase();
			EmailBody = lodash.filter(listconfiguration, function (c) { return c.key === "EmailBody" })[0].value;
			EmailSubjectPatient = lodash.filter(listconfiguration, function (c) { return c.key === "EmailSubjectPatient" })[0].value;
			IdiomaReporteResultados = lodash.filter(listconfiguration, function (c) { return c.key === "IdiomaReporteResultados" })[0].value;
			logs.info("Cargando las llaves de configuracion...");
			getlistidiome();
			getDemographicsALL();
		}).catch(function (error) {
			logs.error("Problemas con el servicio: /configuration"  + error );
		})
}

//Método que devuelve la lista de demofgráficos  
function getDemographicsALL() {

	var demographicTitle = lodash.filter(listconfiguration, function (c) { return c.key === "DemograficoTituloInforme" })[0].value;
	if (parseInt(demographicTitle) !== 0) {
		axios.get(urlServices + '/demographics/all', headerServices)
			.then(function (response) {

				var demographicTemplate = lodash.filter(response.data, function (v) { return v.id === parseInt(demographicTitle) })[0];

				var nameDemographic = 'reports_' + demographicTemplate.name;
				var referenceDemographic = demographicTemplate.name;

				if (parseInt(demographicTitle) < 0) {
					//Pendiente llamado traducciones. 
					switch (parseInt(demographicTitle)) {
						case -1: demographicTemplate.name = 'Cliente'; referenceDemographic = 'account'; break; //Cliente
						case -2: demographicTemplate.name = 'Médico'; referenceDemographic = 'physician'; break; //Médico
						case -3: demographicTemplate.name = 'Tarifa' ; referenceDemographic = 'rate'; break; //Tarifa
						case -4: demographicTemplate.name = 'Tipo de orden'; referenceDemographic = 'type'; break; //Tipo de orden
						case -5: demographicTemplate.name = 'Sede'; referenceDemographic = 'branch'; break; //Sede
						case -6: demographicTemplate.name = 'Servicio'; referenceDemographic = 'service'; break; //Servicio
						case -7: demographicTemplate.name = 'Raza'; referenceDemographic = 'race'; break; //Raza
					}
					nameDemographic = 'reports_' + demographicTemplate.name
				}
				logs.info("Cargando listado de demograficos...");


			}).catch(function (error) {
				logs.error("Problemas con el servicio: /configuration" + error);
			})
	}
	else {
		demographicTemplate = null;
		nameDemographic = 'reports';
		logs.info("Cargando plantilla de demograficos...");
	}

	generateFile();
}

function getTemplateReport(order) {
	var template = '';
	if (demographicTemplate !== null) {
		if (demographicTemplate.encoded && demographicTemplate.id > 0) {
			order.demographicItemTemplate = lodash.filter(order.allDemographics, function (o) {
				return o.idDemographic === demographicTemplate.id;
			})[0];
			template = nameDemographic + '_' + order.demographicItemTemplate.codifiedCode + '.mrt';
		} else if (demographicTemplate.encoded && demographicTemplate.id < 0) {
			order.demographicItemTemplate = order[referenceDemographic];
			template = nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
		} else {
			template = nameDemographic + '.mrt';
		}

		if (lodash.filter(listreports, function (o) {
			return o.name === template;
		}).length > 0) {
			return template;
		} else {
			return 'reports.mrt';
		}
	} else {
		return 'reports.mrt';
	}
}

function generateFile() {
	logs.info("Consultando ordenes para envio...");
	
	axios.get(urlServices + '/results/getOrdersResults/' +  moment().format("YYYYMMDD") ,  headerServices)
		.then(function (response) {

			if (response.data.length > 0) {
				logs.info("Total de ordenes encontradas " + response.data.length);
				listOrderHead = response.data
				variables = {
					'username': datauser.userName,
					'titleReport': dataLenguajes['0399'],
					'date': moment().format(formatDate + ' hh:mm:ss a.'),
					'formatDate': formatDate,
					'templateReport': 'reports.mrt',
					'typePrint': 1
				}
				
				listOrderHead = lodash.filter(listOrderHead, function (o) { return o.patient.email !== "" });
				printOrder(listOrderHead[count]);
				

			} else {
				logs.info("No se encontraron ordenes para enviar...");
			}


		}).catch(function (error) {
			logs.error("Problemas con el servicio para consultar las ordenes a enviar");

		})

}

function getlistidiome() {
	pathLenguajes = IdiomaReporteResultados == "es" ? pathLenguajesEs : pathLenguajesEn;
	if (fs.existsSync(pathLenguajes)) {
		fs.readFile(pathLenguajes, 'utf-8', (err, data) => {
			if (err) {
				logs.error("No fue posible cargar el archivo de idiomas para los reportes");
			} else {
				logs.info("Idiomas cargados correctamente");
				dataLenguajes = JSON.parse(data);
			}
		});
	} else {
		logs.error("No fue posible cargar el archivo de idiomas para los reportes");
	}
}



function printOrder(order) {

	var data = {
		'printOrder': [{
			'physician': null,
			'listOrders': [{
				'order': order
			}]
		}],
		'typeReport': "2",
		'isAttached': attachments
	};

	
	axios.post(urlServices + '/reports/finalReport', data, headerServices)
		.then(function (response) {
	
			if (response.data !== '') {
				console.log(JSON.stringify(response.data.listOrders[0]))
				datareport = response.data.listOrders[0];
				dataOrder = response.data.listOrders[0].order;
				
				if(!filtermicrobiology){
					dataOrder.resultTest =  lodash.filter(dataOrder.resultTest, function (o) {
						return !o.confidential;
					});

					var totaltestvalidfinal = lodash.filter(dataOrder.resultTest, function (o) {
						return o.state >= 4;
					}).length;
				}
				
				if(filtermicrobiology){
					var totaltestvalidfinal = 0; 
					
					var dataOrderResultTest =  lodash.filter(dataOrder.resultTest, function (o) {
						return !o.confidential && o.areaId != idmicrobiology;
					});

					var totaltestvalid = lodash.filter(dataOrderResultTest, function (o) {
						return o.state >= 4 && o.areaId != idmicrobiology;
					});
					
					var dataOrderResultTestMicrobiology =  lodash.filter(dataOrder.resultTest, function (o) {
						return !o.confidential && o.areaId == idmicrobiology;
					});

					var totaltestvalidMicrobiology = lodash.filter(dataOrderResultTestMicrobiology, function (o) {
						return o.state >= 4 && o.areaId == idmicrobiology;
					});
				
				
					if(dataOrderResultTestMicrobiology.length == totaltestvalidMicrobiology.length){
						dataOrder.resultTest = dataOrderResultTest.concat(dataOrderResultTestMicrobiology)
						totaltestvalidfinal = totaltestvalid.concat(totaltestvalidMicrobiology)
					
					}
					else {
						dataOrder.resultTest = lodash.filter(dataOrder.resultTest, function (o) {
							return !o.confidential && o.areaId != idmicrobiology && o.sendAutomaticReport == 0;
						});
					
						totaltestvalidfinal = totaltestvalid
					}


				}
			
			   	if(dataOrder.resultTest.length > 0 && (totaltestvalidfinal.length === dataOrder.resultTest.length) )
			    {
					dataOrder.resultTest = totaltestvalidfinal;
					if (dataOrder.resultTest.length !== 0) {
						dataOrder.resultTest.forEach(function (value) {
							value.refMin = value.refMin === null || value.refMin === '' || value.refMin === undefined ? 0 : value.refMin;
							value.refMax = value.refMax === null || value.refMax === '' || value.refMax === undefined ? 0 : value.refMax;
							value.panicMin = value.panicMin === null || value.panicMin === '' || value.panicMin === undefined ? 0 : value.panicMin;
							value.panicMax = value.panicMax === null || value.panicMax === '' || value.panicMax === undefined ? 0 : value.panicMax;
							value.reportedMin = value.reportedMin === null || value.reportedMin === '' || value.reportedMin === undefined ? 0 : value.reportedMin;
							value.reportedMax = value.reportedMax === null || value.reportedMax === '' || value.reportedMax === undefined ? 0 : value.reportedMax;
							value.digits = value.digits === null || value.digits === '' || value.digits === undefined ? 0 : value.digits;
							value.refMinview = parseFloat(value.refMin).toFixed(value.digits);
							value.refMaxview = parseFloat(value.refMax).toFixed(value.digits);
							value.panicMinview = parseFloat(value.panicMin).toFixed(value.digits);
							value.panicMaxview = parseFloat(value.panicMax).toFixed(value.digits);
							value.reportedMinview = parseFloat(value.reportedMin).toFixed(value.digits);
							value.reportedMaxview = parseFloat(value.reportedMax).toFixed(value.digits);
						});
					}
					if (dataOrder.allDemographics.length > 0) {
						dataOrder.allDemographics.forEach(function (value2) {
							dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
							dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
						});
					}
						dataOrder.createdDate = moment(dataOrder.createdDate).format(formatDate + ' hh:mm:ss a.');
						dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(formatDate);
						dataOrder.patient.age = getAgeAsString(dataOrder.patient.birthday, formatDate);
						dataOrder.attachments = datareport.attachments === undefined ? [] : datareport.attachments;
						axios.get(urlServices + '/orders/getUserValidate/idOrder/' + dataOrder.orderNumber, headerServices).then(function (datafirm) {
							dataOrder.listfirm = [];
							
							if (dataOrder.resultTest.length > 0) {
								for (var i = 0; i < dataOrder.resultTest.length; i++) {
									dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(formatDate + ' hh:mm:ss a.');
									dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(formatDate + ' hh:mm:ss a.');
									dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(formatDate + ' hh:mm:ss a.');
									dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(formatDate + ' hh:mm:ss a.');
									dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(formatDate + ' hh:mm:ss a.');
									dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(formatDate + ' hh:mm:ss a.');

									if (dataOrder.resultTest[i].hasAntibiogram) {
										dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
									}
									if (dataOrder.resultTest[i].validationUserId !== undefined) {
										var findfirm = lodash.filter(dataOrder.listfirm, function (o) { return o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId; })[0]


										var user = lodash.filter(datafirm.data, function (o) { return o.id === dataOrder.resultTest[i].validationUserId });

										if (findfirm === undefined) {
											var firm = {
												'areaId': dataOrder.resultTest[i].areaId,
												'areaName': dataOrder.resultTest[i].areaName,
												'validationUserId': dataOrder.resultTest[i].validationUserId,
												'validationUserIdentification': dataOrder.resultTest[i].validationUserIdentification,
												'validationUserName': dataOrder.resultTest[i].validationUserName,
												'validationUserLastName': dataOrder.resultTest[i].validationUserLastName,
												'firm': user[0].photo
											};
											dataOrder.listfirm.push(firm);
										}
									}
								}
								addreport(dataOrder);
							}
							else {
								logs.info("No se encontro detalle para la orden..." + dataOrder.orderNumber);
								
							
								if (listOrderHead.length-1 === count) {
									logs.info("Fin del envio de las ordenes encontradas...");
									logs.info("..................................");
								} else {
									count = count + 1;
									console.log("seguiente orden" + listOrderHead[count].orderNumber);
									printOrder(listOrderHead[count]);
								}
							}
						})
				}
				else{
					logs.info("La orden no se encuentra completamente validada..." + dataOrder.orderNumber);
					count = count === undefined ? 0 : count;
					
					console.log("Totales " + count +"  "+ listOrderHead.length - 1)
					if (listOrderHead.length - 1 === count) {
						logs.info("Fin del envio de las ordenes encontradas...");
						logs.info("..................................");
					} else {
						count = count + 1;
						
						printOrder(listOrderHead[count]);
					}
				}

			} else {
				logs.info("No se encontro detalle para la orden..." + dataOrder.orderNumber);
				count = count === undefined ? 0 : count;

				console.log("Totales " + count +"  "+listOrderHead.length)
				if (listOrderHead.length - 1 === count) {
					logs.info("Fin del envio de las ordenes encontradas...");
					logs.info("..................................");
				} else {
					count = count + 1;
					console.log("seguiente orden" + listOrderHead[count].orderNumber);
					printOrder(listOrderHead[count]);
				}
			}


		}).catch(function (error) {
			console.log("error " + error);
			logs.error("No se pudo consultar el detalle de la orden " + dataOrder.orderNumber);
		})
}

function addreport(order, orderpatient) {

	var parameterReport = {};

	parameterReport.pathreport = pathReport + getTemplateReport(order);
	parameterReport.labelsreport = JSON.stringify(dataLenguajes);
	parameterReport.variables = variables;
	dataorder = order;
	datapatient = orderpatient;

	setReport(parameterReport, order, orderpatient);
}

function setReport(parameterReport, datareport, datareportpatient) {

	setTimeout(function () {

		var report = new Stimulsoft.Report.StiReport();
		report.loadFile(parameterReport.pathreport);

		var jsonData = {
			'order': datareport,
			'Labels': [parameterReport.labelsreport],
			'variables': [parameterReport.variables]
		};

		var dataSet = new Stimulsoft.System.Data.DataSet();
		dataSet.readJson(jsonData);

		report.dictionary.databases.clear();
		report.regData('Demo', 'Demo', dataSet);
		
		report.renderAsync(function () {
			var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
			var service = new Stimulsoft.Report.Export.StiPdfExportService();
			var stream = new Stimulsoft.System.IO.MemoryStream();
			service.exportToAsync(function () {
				// Export to PDF (#1)
				var data = stream.toArray();
				var buffer = new Uint8Array(data);
				copyPages(buffer, datareport.attachments);
				

			}, report, stream, settings);


		});
		
	}, 50);

}

function copyPages(reportpreview, attachments) {

	var PDFDocument = PDFLib.PDFDocument;
	var pdfDocRes = PDFDocument.create();

	pdfDocRes.then(function (pdfDoc) {
		var firstDonorPdfDoc = PDFDocument.load(reportpreview, {
			ignoreEncryption: true
		});
		firstDonorPdfDoc.then(function (greeting) {
			var firstDonorPageRes = pdfDoc.copyPages(greeting, greeting.getPageIndices());

			firstDonorPageRes.then(function (firstDonorPage) {

				firstDonorPage.forEach(function (page) {
					pdfDoc.addPage(page);
				});
				if (attachments.length > 0) {
					var listbuffer = [];
					var calcula = 0;
					for (var i = 0; i < attachments.length; i++) {
						var reportbasee64 = _base64ToArrayBuffer(attachments[i].file);
						if (attachments[i].extension === 'pdf') {
							listbuffer[i] = PDFDocument.load(reportbasee64, {
								ignoreEncryption: true
							});
							listbuffer[i].then(function (listbufferelement) {
								var copiedPagesRes = pdfDoc.copyPages(listbufferelement, listbufferelement.getPageIndices());
								copiedPagesRes.then(function (copiedPages) {
									copiedPages.forEach(function (page) {
										pdfDoc.addPage(page);
									});
									calcula++;
									if (calcula === attachments.length) {
										pdfDoc.save().then(function (pdf) {
											sendbuffer(pdf);
										});
									}
								});
							});
						} else if (attachments[i].extension === 'jpg' || attachments[i].extension === 'jpeg') {
							var jpgImageRes = pdfDoc.embedJpg(reportbasee64);
							jpgImageRes.then(function (jpgImage) {
								var jpgDims;
								var xwidth = false;
								if (jpgImage.scale(0.5).width <= 576) {
									jpgDims = jpgImage.scale(0.5);
								} else if (jpgImage.scale(0.4).width <= 576) {
									jpgDims = jpgImage.scale(0.4);
								} else if (jpgImage.scale(0.3).width <= 576) {
									jpgDims = jpgImage.scale(0.3);
									xwidth = true;
								} else {
									jpgDims = jpgImage.scale(0.2);
									xwidth = true;
								}
								var page = pdfDoc.addPage();
								page.drawImage(jpgImage, {
									x: xwidth ? 10 : page.getWidth() / 2 - jpgDims.width / 2,
									y: page.getHeight() / 2 - jpgDims.height / 2,
									width: jpgDims.width,
									height: jpgDims.height,
								});
								calcula++;
								if (calcula === attachments.length) {
									pdfDoc.save().then(function (pdf) {
									    sendbuffer(pdf);
									});
								}
							});
						} else {
							var pngImageRes = pdfDoc.embedPng(reportbasee64);
							pngImageRes.then(function (pngImage) {
								var pngDims;
								var xwidth = false;
								if (pngImage.scale(0.5).width <= 576) {
									pngDims = pngImage.scale(0.5);
								} else if (pngImage.scale(0.4).width <= 576) {
									pngDims = pngImage.scale(0.4);
								} else if (pngImage.scale(0.3).width <= 576) {
									pngDims = pngImage.scale(0.3);
									xwidth = true;
								} else {
									pngDims = pngImage.scale(0.2);
									xwidth = true;
								}
								var page = pdfDoc.addPage();
								// Draw the PNG image near the lower right corner of the JPG image
								page.drawImage(pngImage, {
									x: xwidth ? 10 : page.getWidth() / 2 - pngDims.width / 2,
									y: page.getHeight() / 2 - pngDims.height,
									width: pngDims.width,
									height: pngDims.height,
								});
								calcula++;
								if (calcula === attachments.length) {
									pdfDoc.save().then(function (pdf) {
										sendbuffer(pdf);
									});
								}
							});
						}
					}
				} else {
					pdfDoc.save().then(function (pdf) {
						sendbuffer(pdf);
					});
				}

			});
		}, function () {
			logs.error("Problemas al realizar el armado del pdf")
		});
	});
}

function _base64ToArrayBuffer(base64) {
	var binary_string = window.atob(base64);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}


function sendbuffer(buffer) {

	var byteArray = new Uint8Array(buffer);
	var byteString = '';
	for (var i = 0; i < byteArray.byteLength; i++) {
		byteString += String.fromCharCode(byteArray[i]);
	}

	var patientemail = {
		patientid: datareport.patientHistory,
		patientName : datareport.order.patient.name1 + ' ' + datareport.order.patient.name2 + ' ' + datareport.order.patient.lastName + ' ' + datareport.order.patient.surName,
		correo: datareport.patientEmail,
		buffer: byteString,
		nameReport: dataorder.orderNumber + ".pdf",

	}
	sendEmailProcess(patientemail);

}

function changeStatePrint() {

	var personRecive = "";
	personRecive = datareport.patientEmail;

	datareport.order.createdDate = '';
	datareport.order.patient.birthday = '';
	for (var i = 0; i < datareport.order.resultTest.length; i++) {
		datareport.order.resultTest[i].resultDate = '';
		datareport.order.resultTest[i].validationDate = '';
		datareport.order.resultTest[i].entryDate = '';
		datareport.order.resultTest[i].takenDate = '';
		datareport.order.resultTest[i].verificationDate = '';
		datareport.order.resultTest[i].printDate = '';
	}
	var datachange = {
		filterOrderHeader: { printingMedium: '3', typeReport: "1", personReceive: personRecive, sendAutomaticResult: true },
		order: datareport.order,
		user: datauser.id,
		sendAutomaticResult: true
	}
	
	
	axios.post(urlServices + '/reports/changestatetest', datachange, headerServices).then(function (data) {
		
		if (listOrderHead.length -1 === count) {
			logs.info("Fin del envio de las ordenes encontradas...");
			logs.info("..........................");
			
		} else {
			count = count + 1;
			printOrder(listOrderHead[count]);
		}
	}, function (error) {
		logs.error("Se genero un problema al cambiar el estado de la orden")
	});

}

function sendEmailProcess(patientemail) {
	EmailSubjectPatient = EmailSubjectPatient.replace("||PATIENT||", patientemail.patientName);
	EmailBody = EmailBody.replace("||PATIENT||", patientemail.patientName);
	var data = {
		"recipients": [patientemail.correo],
		"subject": EmailSubjectPatient,
		"body": EmailBody,
		"user":3,
		"order":0,
		"attachment": [
			{
				path: btoa(patientemail.buffer),
				type: "1",
				filename: patientemail.nameReport
			}
		]
	}

	axios.post(serviceUrlApi + '/email', data, headerServices).then(function (response) {
		
		if (response.status === 200) {
			logs.info("Se envio reporte de resultados de la orden" + datareport.order);
			changeStatePrint();
		}
	}, function (error) {
		logs.error("Problemas al realizar el envio del correo.... " + error)
	})
}

function getAgeAsString(date, format) {
	var age = getAge(date, format);
	if (age !== '') {
		var ageFields = age.split(".");
		if (Number(ageFields[0]) !== 0) {
			if (Number(ageFields[0]) === 1) {
				//Año
				return ageFields[0] + " " + dataLenguajes['0428'];
			} else {
				//Años
				return ageFields[0] + " " + dataLenguajes['0103'];
			}
		} else if (Number(ageFields[1]) !== 0) {
			if (Number(ageFields[1]) === 1) {
				//Mes
				return ageFields[1] + " " + dataLenguajes['0567'];
			} else {
				//Meses
				return ageFields[1] + " " + dataLenguajes['0569'];
			}
		} else {
			if (Number(ageFields[2]) === 1) {
				//Dia
				return ageFields[2] + " " + dataLenguajes['0568'];
			} else {
				//Dias
				return ageFields[2] + " " + dataLenguajes['0476'];
			}
		}
	} else {
		return dataLenguajes['0570'];
	}
}

function getAge(date, format) {
	if (!moment(date, format, true).isValid()) {
		return "";
	}
	var birthday = moment(date, format).toDate();
	var current = new Date();
	var diaActual = current.getDate();
	var mesActual = current.getMonth() + 1;
	var anioActual = current.getFullYear();
	var diaInicio = birthday.getDate();
	var mesInicio = birthday.getMonth() + 1;
	var anioInicio = birthday.getFullYear();
	var b = 0;
	var mes = mesInicio;
	if (mes === 2) {
		if ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) {
			b = 29;
		} else {
			b = 28;
		}
	} else if (mes <= 7) {
		if (mes === 0) {
			b = 31;
		} else if (mes % 2 === 0) {
			b = 30;
		} else {
			b = 31;
		}
	} else if (mes > 7) {
		if (mes % 2 === 0) {
			b = 31;
		} else {
			b = 30;
		}
	}

	var anios = -1;
	var meses = -1;
	var dies = -1;
	if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual) ||
		(anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
		return "";
	} else if (mesInicio <= mesActual) {
		anios = anioActual - anioInicio;
		if (diaInicio <= diaActual) {
			meses = mesActual - mesInicio;
			dies = diaActual - diaInicio;
		} else {
			if (mesActual === mesInicio) {
				anios = anios - 1;
			}
			meses = (mesActual - mesInicio - 1 + 12) % 12;
			dies = b - (diaInicio - diaActual);
		}
	} else {
		anios = anioActual - anioInicio - 1;
		if (diaInicio > diaActual) {
			meses = mesActual - mesInicio - 1 + 12;
			dies = b - (diaInicio - diaActual);
		} else {
			meses = mesActual - mesInicio + 12;
			dies = diaActual - diaInicio;
		}
	}
	return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
}

module.exports = {
	"login": login
}
