// simple express server
var express = require("express");
var app = express();
var router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");
var moment = require("moment");
var _ = require("lodash");

var fs = require("fs");

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/testServerPrint", function (req, res) {
  res.json("OK");
});

app.post("/printReportOrders", (req, res, next) => {
  var Stimulsoft = require("stimulsoft-reports-js");
  Stimulsoft.Base.StiLicense.key =
    "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHm5tRte7jqQJlaA/swPF0QFuSyDi9yg9zLXn/C9JyDTVREvL/" +
    "WNzi+DNpTn5ILodo1C9ETYBZQ6mEjX1aeQSbCqwgUDXaWEgiqR9fNr0+Sasf39CLMzJVIhElX3r/KXz6HPX32wbD4m" +
    "/Cuo9+jzcyUOTO337rBhvz3loKVMsQx63yrt7twWSgis4U7CzKylrEk1/7zsVeEdUlLZlKk6fbOnMKtFponKInspdv" +
    "o79xbtjhEGJZdHR5VjRqMWkF2VFhHuA1UddPR+kWKUHZtcXrQV0zuxP8/3A/nSIOitrorlRSUtnJ8aE4MCn/NVckK3" +
    "FkNdFKdY3xpFrDucTRyq0+fGADhMgSXc3d3KC01NhTUnPJHK8Nxd5O9DXuS22owK6JFNDjNHWSc0QkYgJpicY7MAKb" +
    "YCVD8shYmL8Iwkz7PUoB5qiGg2jwWIAhfWKKAW+bMjLswSABfXG9lWp5l5Hvcvd/5QwIs1Ib6ihQ2E25WSX+NzQmI3" +
    "miq+jfPXQ68C7EPccmgjAvM9OQ9IlnBKiqQDOra72tI1IJPTO46eSSOhHg==";
  Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");

  var reportingroute=  "../EnterpriseNTLaboratory/src/client/Report/reportsandconsultations/reports/";


  var send = false;
  var message = {};

  var dataOrder = JSON.parse(req.body.order);
  var dataVariables = JSON.parse(req.body.variables);

  var url = req.body.urlApi;
  var listUser = [];
  var options = {
    url: url + "/api/orders/getUserValidate/idOrder/" + dataOrder.orderNumber,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    },
  };

  request(options, function (error, response, data) {
    var listuser = JSON.parse(data);
    var confidencialcodificado = dataVariables.confidencialcodificado;
    var areacodificado = dataVariables.areacodificado;
    dataOrder.createdDate = moment(dataOrder.createdDate).format(
      dataVariables.formatDate + " hh:mm:ss a."
    );
    dataOrder.patient.birthdayinformat = dataOrder.patient.birthday;
    dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(
      dataVariables.formatDate
    );
    dataOrder.patient.age = getAgeAsString(
      dataOrder.patient.birthday,
      dataVariables.formatDate
    );
    dataOrder.demographics.forEach(function (value2) {
      dataOrder["demo_" + value2.idDemographic + "_name"] = value2.demographic;
      dataOrder["demo_" + value2.idDemographic + "_value"] =
        value2.encoded === false
          ? value2.notCodifiedValue
          : value2.codifiedName;
    });

    dataOrder.listfirm = [];
    for (var i = 0; i < dataOrder.resultTest.length; i++) {
      dataOrder.resultTest[i].resultDate = moment(
        dataOrder.resultTest[i].resultDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      dataOrder.resultTest[i].validationDate = moment(
        dataOrder.resultTest[i].validationDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      dataOrder.resultTest[i].entryDate = moment(
        dataOrder.resultTest[i].entryDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      dataOrder.resultTest[i].takenDate = moment(
        dataOrder.resultTest[i].takenDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      dataOrder.resultTest[i].verificationDate = moment(
        dataOrder.resultTest[i].verificationDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      dataOrder.resultTest[i].printDate = moment(
        dataOrder.resultTest[i].printDate
      ).format(dataVariables.formatDate + " hh:mm:ss a.");
      if (dataOrder.resultTest[i].fixedComment !== undefined) {
        dataOrder.resultTest[i].fixedComment = dataOrder.resultTest[
          i
        ].fixedComment.replace("<br />", "</p><p></p><p>");
      }
      if (dataOrder.resultTest[i].technique !== undefined) {
        dataOrder.resultTest[i].technique = dataOrder.resultTest[
          i
        ].technique.replace("<br>", "<p></p>");
      }
      if (dataOrder.resultTest[i].hasAntibiogram) {
        dataOrder.resultTest[i].antibiogram =
          dataOrder.resultTest[i].microbialDetection.microorganisms;
      }
      if (dataOrder.resultTest[i].validationUserId !== undefined) {
        var user = listuser.find(
          (user) => user.id === dataOrder.resultTest[i].validationUserId
        );
        var findfirm = dataOrder.listfirm.find(
          (order) =>
            order.areaId === dataOrder.resultTest[i].areaId &&
            order.validationUserId === dataOrder.resultTest[i].validationUserId
        );
        if (findfirm === undefined) {
          var firm = {
            areaId: dataOrder.resultTest[i].areaId,
            areaName: dataOrder.resultTest[i].areaName,
            validationUserId: dataOrder.resultTest[i].validationUserId,
            validationUserIdentification:
              dataOrder.resultTest[i].validationUserIdentification,
            validationUserName: dataOrder.resultTest[i].validationUserName,
            validationUserLastName:
              dataOrder.resultTest[i].validationUserLastName,
            firm: user.photo, // dataOrder.resultTest[i].validationUserSignature
          };
          dataOrder.listfirm.push(firm);
        }
      }
    }

    if (confidencialcodificado) {
      var filterareainconfidencial = _.filter(
        _.clone(dataOrder.resultTest),
        function (o) {
          return o.areaId !== parseInt(areacodificado);
        }
      );
      if (filterareainconfidencial.length > 0) {
        var parameterReport = {
          order: JSON.parse(JSON.stringify(dataOrder)),
          Labels: [JSON.parse(req.body.labelsreport)],
          Variables: [dataVariables],
        };
        parameterReport.order.resultTest = filterareainconfidencial;
      }
      var filterarea = _.filter(_.clone(dataOrder.resultTest), function (o) {
        return o.areaId === parseInt(areacodificado);
      });
      if (filterarea.length > 0) {
        var dataconfidencial = JSON.parse(JSON.stringify(dataOrder));
        var namecodificade =
          dataconfidencial.patient.name1.slice(0, 1) +
          dataconfidencial.patient.lastName.slice(0, 1) +
          dataconfidencial.patient.surName.slice(0, 1) +
          moment(dataconfidencial.patient.birthdayinformat).format("DDMMYY");
        dataconfidencial.resultTest = filterarea;
        dataconfidencial.patient.name1 = namecodificade;
        dataconfidencial.patient.name2 = "";
        dataconfidencial.patient.lastName = "";
        dataconfidencial.patient.surName = "";

        var parameterReport1 = {
          order: dataconfidencial,
          Labels: [JSON.parse(req.body.labelsreport)],
          Variables: [dataVariables],
        };
      }
    } else {
      var parameterReport = {
        order: dataOrder,
        Labels: [JSON.parse(req.body.labelsreport)],
        Variables: [dataVariables],
      };
    }


    if (parameterReport === undefined || parameterReport1 === undefined) {
      var template =
        dataOrder.templateorder === undefined
          ? "reports.mrt"
          : dataOrder.templateorder;

      var report1 = new Stimulsoft.Report.StiReport();

      var reportTemplate = fs.readFileSync(reportingroute + template, "utf8");
      report1.load(reportTemplate);
      var dataSet = new Stimulsoft.System.Data.DataSet();
	  if(parameterReport !== undefined){
		dataSet.readJson(parameterReport);
	  }else{
		dataSet.readJson(parameterReport1);
	  }
      
      report1.dictionary.databases.clear();
      report1.regData("Demo", "Demo", dataSet);

      report1.renderAsync(() => {
        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
        var service = new Stimulsoft.Report.Export.StiPdfExportService();
        var stream = new Stimulsoft.System.IO.MemoryStream();
        service.exportTo(report1, stream, settings);
        var data = stream.toArray();
        var buffer = new Buffer(data, "utf-8");
        res.json(buffer);
      });

    }

    if (parameterReport !== undefined && parameterReport1 !== undefined) {
      var template =
        dataOrder.templateorder === undefined
          ? "reports.mrt"
          : dataOrder.templateorder;

      var report1 = new Stimulsoft.Report.StiReport();
      var report2 = new Stimulsoft.Report.StiReport();

      var reportTemplate = fs.readFileSync(reportingroute + template,"utf8");

      report1.load(reportTemplate);
      report2.load(reportTemplate);

      var dataSet = new Stimulsoft.System.Data.DataSet();
      dataSet.readJson(parameterReport);
      report1.dictionary.databases.clear();
      report1.regData("Demo", "Demo", dataSet);

      var dataSet1 = new Stimulsoft.System.Data.DataSet();
      dataSet1.readJson(parameterReport1);
      report2.dictionary.databases.clear();
      report2.regData("Demo", "Demo", dataSet1);

      report1.renderAsync(() => {
        if (!report1.renderedPages) {
          console.error("El reporte 1 no tiene páginas renderizadas.");
          return;
        }
        report2.renderAsync(() => {
          // Combinar las páginas renderizadas
          if (!report2.renderedPages) {
            console.error("El reporte 2 no tiene páginas renderizadas.");
            return;
          }
          report1.renderedPages.addRange(report2.renderedPages);
          var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
          var service = new Stimulsoft.Report.Export.StiPdfExportService();
          var stream = new Stimulsoft.System.IO.MemoryStream();
          service.exportTo(report1, stream, settings);
          var data = stream.toArray();
          var buffer = new Buffer(data, "utf-8");
          res.json(buffer);
        });
      });
    }
  });
});

function confidencialprint(dataOrder, parameterReport) {
  var template =
    dataOrder.templateorder === undefined
      ? "reports.mrt"
      : dataOrder.templateorder;

  var report = new Stimulsoft.Report.StiReport();
  var reportTemplate = fs.readFileSync(
    "../EnterpriseNTLaboratory/src/client/Report/reportsandconsultations/reports/" +
      template,
    "utf8"
  );

  report.load(reportTemplate);

  var dataSet = new Stimulsoft.System.Data.DataSet();
  dataSet.readJson(parameterReport);

  // Remove all connections from the report template
  report.dictionary.databases.clear();
  // Register DataSet object
  report.regData("Demo", "Demo", dataSet);
  // Render report with registered data
  //report.render();

  report.renderAsync(function () {
    // export to memory stream
    var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    var service = new Stimulsoft.Report.Export.StiPdfExportService();

    var stream = new Stimulsoft.System.IO.MemoryStream();

    service.exportTo(report, stream, settings);

    var data = stream.toArray();

    var buffer = new Buffer(data, "utf-8");

    res.json(buffer);
    //callback(/* error */null, "DONE");
  });
}

// recibe fecha actual y fecha de nacimiento
function calculaEdad(fecha, fecha_nac) {
  var a = moment(fecha);
  var b = moment(fecha_nac);

  var years = a.diff(b, "year");
  b.add(years, "years");

  var months = a.diff(b, "months");
  b.add(months, "months");

  var days = a.diff(b, "days");

  if (years == 0) {
    if (months <= 1) {
      if (days <= 1) {
        return months + " mes " + days + " dia";
      } else {
        return months + " mes " + days + " dias";
      }
    } else {
      if (days <= 1) {
        return months + " meses " + days + " dia";
      } else {
        return months + " meses " + days + " dias";
      }
    }
  } else {
    if (years == 1) {
      return years + " año";
    } else {
      return years + " años";
    }
  }
}

/**
 * Calcula la edad del paciente
 * @param {*} date Fecha en string
 * @param {*} format Formato en que viene la fecha
 */
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
    if (
      (anioActual % 4 === 0 && anioActual % 100 !== 0) ||
      anioActual % 400 === 0
    ) {
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
  if (
    anioInicio > anioActual ||
    (anioInicio === anioActual && mesInicio > mesActual) ||
    (anioInicio === anioActual &&
      mesInicio === mesActual &&
      diaInicio > diaActual)
  ) {
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
  return (
    (anios < 10 ? "0" + anios : anios) +
    "." +
    (meses < 10 ? "0" + meses : meses) +
    "." +
    (dies < 10 ? "0" + dies : dies)
  );
}

function getAgeAsString(date, format) {
  var age = getAge(date, format);
  if (age !== "") {
    var ageFields = age.split(".");
    if (Number(ageFields[0]) !== 0) {
      if (Number(ageFields[0]) === 1) {
        //Año
        return ageFields[0] + " " + "Año";
      } else {
        //Años
        return ageFields[0] + " " + "Años";
      }
    } else if (Number(ageFields[1]) !== 0) {
      if (Number(ageFields[1]) === 1) {
        //Mes
        return ageFields[1] + " " + "Mes";
      } else {
        //Meses
        return ageFields[1] + " " + "Meses";
      }
    } else {
      if (Number(ageFields[2]) === 1) {
        //Dia
        return ageFields[2] + " " + "Dia";
      } else {
        //Dias
        return ageFields[2] + " " + "Días";
      }
    }
  } else {
    return "";
  }
}

app.listen(5001);
