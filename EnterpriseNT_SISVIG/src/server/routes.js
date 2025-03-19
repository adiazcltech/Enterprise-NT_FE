var router = require('express').Router();
var four0four = require('./utils/404')();
var nodemailer = require('nodemailer');
var Request = require("request");
var WebSocket  = require('ws');
var fs = require('fs')

router.post("/getsisvi", getsisvi);
router.post('/sendEmail', sendEmail);
router.post('/printBarcode', printBarcode);
router.get('/*', four0four.notFoundMiddleware);
router.post('/printReportOrders', printReportOrders);
router.post('/uploadFile', uploadFile);
router.post('/getlistReportFile', getlistReportFile);



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

function getsisvi(req, res, next) {
  var data = req.body;
  console.log(data)  
  Request.get(
    {
      headers: { "content-type": "application/json" },
      strictSSL: false,
      url: data.urlhis+data.consult+data.identification,
    },
   (error, response, body) => {
              if (error) {                  
                 res.send("");                
              }
   res.send(JSON.parse(body));
  }
  );
}

function getlistReportFile(req, res){
  var listReports = [];
  fs.readdir("./src/client/Report", function(err, files) {
    files.forEach(function(element) {
      fs.readdir("./src/client/Report/" + element, function(err, files1) {
         files1.forEach(function(element1) {
            fs.readdir("./src/client/Report/" + element + "/" + element1, function(err, files2) {
              if (files2 !== undefined) {
                files2.forEach(function(element2) {
                  var valid = element2.split(".");
                  if (valid[1] === "mrt") {
                    var report = {"name" : element2}
                    listReports.push(report)
                  }else if (valid.length === 1){
                    fs.readdir("./src/client/Report/" + element + "/" + element1 + "/" + element2, function(err, files3) {
                        if (files3 !== undefined) {
                          files3.forEach(function(element3) {
                              var valid2 = element3.split(".");
                              if (valid2[1] === "mrt") {
                                var report = {"name" : element3}
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
      })
    });
   
  });
  setTimeout(function(){  
    res.send(listReports); 
  }, 3000)
}
function uploadFile(req, res){

   var path = './src/client' + req.body.path;
  

   fs.writeFile(path, req.body.file, 'utf-8', function(err){
     if (err){ 
        console.log(err); 
        res.send(err);
     }else{
        console.log('The file has been saved!');
        res.send(200);
     }
   });


  
}    
 



 var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "adiaz@cltech.net",
        pass: "angelica_1992"
    }
});   

function sendEmail(req, res, next) {
    var mailOptions = {
        to: req.body.emailDestination,
        subject: req.body.subject,
        text: req.body.body,
        attachments: [{   // encoded string as an attachment
          filename: req.body.nameAttachment,
          content: new Buffer(req.body.data)
          //contentType: 'application/pdf'
        }]
    }
    


    
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
             res.end("send");
        }
    });
}

////////////   PRINT BARCODE  ////////////////////////////

function printBarcode(req, res, next){
    var parameters = req.body;
    var send = false;
    var message = {};

    for (var i = 0; i < connections.length; i++) {
        if (connections[i].ip === '::ffff:' + parameters.ip) {
            connections[i].ws.send(JSON.stringify(parameters.barcodes));
            send = true;
            message = {'code': 1,
                       'message': 'Print'}
            break;
        }
    }

    //si no se encuentra el cliente conectado. 
    if (!send) {
         message = {'code': 2,
                    'message': 'ErrorClient'} 
    }
   

    res.end(JSON.stringify(message));
   
   
}


/////////////////// PRINT REPORT WITH DATA ///////////////////
function printReportOrders(req, res, next){
    var send = false;
    var message = {};
    var parameterReport = req.body;
    //buscar conexion con el cliente.                 
    for (var i = 0; i < connections.length; i++) {
        if (connections[i].ip === '::ffff:' + parameterReport.ip) {
            send = true;
            message = {'code': 1,
                       'message': 'Print'}
            break;
       }
    }

     //Si no se encuentra el cliente conectado. 
    if (!send) {
         message = {'code': 2,
                    'message': 'ErrorClient'} 
    }else{
        // Load reports from JSON object
        parameterReport.datareport.forEach(function(value){

            var report = new Stimulsoft.Report.StiReport();
            var  reportTemplate = fs.readFileSync("./public/" + parameterReport.pathreport, "utf8")
            report.load(reportTemplate);     
            //report.loadFile(parameterReport.pathreport);            

            // var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            // var service = new Stimulsoft.Report.Export.StiPdfExportService();
            
            //var stream = new Stimulsoft.System.IO.MemoryStream();  

            var dataReportByOrder = value.reportDetail; 
             
            var jsonData = { 'data'  :  dataReportByOrder,
                             'Labels' :  parameterReport.labelsreport, 
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

            connections[i].ws.send(buffer);
            // service.exportTo(report, stream, settings);
            // zip.file(value.nameReport, stream.toArray());  
            var test = []; var state = [];
            value.reportDetail.forEach(function(value2){
                test.push({'testId': value2.testId});
                state.push({'state': value2.state});
            });
            var testUniq = []; var stateUniq = [];
            test.filter(function(elem, pos) {
              if (state[pos].state === 4){
                  if (testUniq.length === 0 ){
                      testUniq.push(elem);
                  }else{
                    if (testUniq[testUniq.length-1].testId !== elem.testId){
                      testUniq.push(elem);
                    }                   
                  }                
              }
            });
            var json = {
                         'orderNumber': value.orderNumber,
                         'resultTest': testUniq
                       } 

           console.log(json);
           if (testUniq.length > 0){
                data['updatePrinter'](parameterReport.token, parameterReport.url, json).then(function(obj) {
                    if (obj.error === null) {
                        res.end(JSON.stringify(message));
                    } else {
                        res.end(JSON.stringify(obj.error));
                    }
                });             
           }
                         
        });        
    }

    res.end(JSON.stringify(message));    

}   

