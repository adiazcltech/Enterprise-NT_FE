var http = require('http');
var axios = require('axios');
var lodash = require('lodash');
var moment = require('moment');

var Blob = require('node-blob');
var btoa = require('btoa');
var fs = require('fs');
var logs = require("./logs");
require('dotenv').config();


var listconfiguration = [];
var datauser = [];
var totalorder = 0;
var count = 0;

var attachments;
var formatDate;
var headerServices;


function login(req, res) {

	var data = {
		'user': '',
		'password': '',
		'branch': 0
	};
	data.user =  process.env.LIS_USER;
	data.password = process.env.LIS_PASSWORD;
	data.branch = 1;

	axios.post(process.env.LIS_URL + '/authentication', data)
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
	var listordersend = [];
	axios.get(process.env.LIS_URL + '/integration/resultados/getorderspendingsendhis', headerServices)
		.then(function (response) {
			logs.info("..................................");
			
			
			response.data.forEach(function(elementorder){

				var agepatient = getAgeAsString(moment(elementorder.patient.birthday).format("YYYYMMDD"), "YYYYMMDD")
				var city =  lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_City})[0];
				var locationdemo = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_location})[0];
				var region = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_region})[0];
				var symptomDate = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_symptomDate})[0];
				var personContact = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_personContact})[0];
				var phoneContact = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_phoneContact})[0];
				var sampleOrigin = lodash.filter(elementorder.allDemographics, function (o) {return o.idDemographic == process.env.LIS_DEMO_sampleOrigin})[0];
				
				elementorder.tests.forEach(function(elementtest){
					var data =  {
					  "sampleOrigin":sampleOrigin.value,
					  "idTypeSample":elementtest.sample.codesample,
					  "typeSampleName":elementtest.sample.name,
					  "idTest":elementtest.code,
					  "testName":elementtest.name,
					  "resultDate": elementtest.result.dateResult,
					  "entity": elementorder.branch.name,
					  "order":elementorder.orderNumber,
					  "idBranch":elementorder.branch.code,
					  "branchName":elementorder.branch.name,
					  "idRegion":region.codifiedCode,
					  "regionName":region.codifiedName,
					  "patientHistory":elementorder.patient.patientId,
					  "patientName": elementorder.patient.name1 + " " + elementorder.patient.name2 + " " + elementorder.patient.lastName + " " + elementorder.patient.surName,
					  "birthDate":elementorder.patient.birthday,
					  "age": agepatient,
					  "gender":elementorder.patient.sex.code === "2"? "M": "F" ,
					  "state":0,
					  "phone":elementorder.patient.phone,
					  "address": elementorder.patient.address,
					  "symptomDate":symptomDate.value,
					  "orderDate": elementorder.createdDate,
					  "result": elementtest.result.result,
					  "recoveryDate":null,
					  "deathDate":null,
					  "registerDate":null,
					  "idTypeId":elementorder.patient.documentType.abbr,
					  "typeName":elementorder.patient.documentType.name,
					  "idCity":city.codifiedCode,
					  "cityName":city.codifiedName,
					  "idlocation":locationdemo.codifiedCode,
					  "locationName":locationdemo.codifiedName,
					  "receptionDate":"",
					  "idSource":sampleOrigin.codifiedCode,
					  "sourceName":sampleOrigin.codifiedName,
					  "stateSeg":0,
					  "orderSource":elementorder.externalId,
					  "personContact": personContact,
					  "phoneContact":phoneContact,
					  "originIndicator":1,
					  "idRegion2":"8",
					  "idCity2":"0808",
					  "idlocation2":"080805",
					  "stateTE":1,
					  "historicalTE":0,
					  "modifyPatient":"NO",
					  "resultDate38":"1650776400000",
					  "symptomDate38":"1650690000000",
					  "receptionDate38":"1650776400000",
					  "age38":agepatient.split(" ")[0],
					  "unit38":agepatient.split(" ")[1]
				   }
				   
				   listordersend.push(data);
				})
			});
			
		
			logs.info(JSON.stringify(listordersend));
		}).catch(function (error) {
			console.log(error)
			logs.error("Problemas con el servicio: /getorderspendingsendhis");
		})
}

function getAgeAsString(date, format) {
	
	var age = getAge(date, format);
		console.log("aage" + age)
	if (age !== '') {
		var ageFields = age.split(".");
		if (Number(ageFields[0]) !== 0) {
			if (Number(ageFields[0]) === 1) {
				//Año
				return ageFields[0] + " " + "A";
			} else {
				//Años
				return ageFields[0] + " " + "A";
			}
		} else if (Number(ageFields[1]) !== 0) {
			if (Number(ageFields[1]) === 1) {
				//Mes
				return ageFields[1] + " " + "M";
			} else {
				//Meses
				return ageFields[1] + " " + "M";
			}
		} else {
			if (Number(ageFields[2]) === 1) {
				//Dia
				return ageFields[2] + " " + "D";
			} else {
				//Dias
				return ageFields[2] + " " + "D";
			}
		}
	} else {
		return ""
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
