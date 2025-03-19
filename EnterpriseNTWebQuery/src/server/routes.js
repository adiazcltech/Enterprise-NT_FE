var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var nodemailer = require('nodemailer');
var inlineBase64 = require('nodemailer-plugin-inline-base64');
var fs = require('fs');
var copydir = require('copy-dir');

var FroalaEditor = require('../../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');

router.post('/uploatimage', uploatimage);
router.post('/sendEmail', sendEmail);
router.get('/*', four0four.notFoundMiddleware);
router.post('/getlistReportFile', getlistReportFile);
router.post('/getlistidiome', getlistidiome);


module.exports = router;

function getlistReportFile(req, res) {
  console.log(req.body);
  var data = req.body;
  console.log('aaa-'+data.pathReport);
  var listReports = [];
  fs.readdir(data.pathReport + '/', function (err, files) {
    files.forEach(function (element) {
      var valid = element.split(".");
      if (valid[1] === "mrt") {
        var report = {
          "name": element
        }
        listReports.push(report)
      }
    })
  })
  copydir.sync(data.pathReport, './src/client/reports', {
    utimes: true, // keep add time and modify time
    mode: true, // keep file mode
    cover: true // cover file when exists, default is true
  });


  setTimeout(function () {
    res.send(listReports);
  }, 3000)
}


function getlistidiome(req, res) {
  var data = req.body;
  fs.readFile(data.pathReport, 'utf-8', (err, data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      res.send(data);
    }
  });
}

function uploatimage(req, res, next) {
  // Store image.
  FroalaEditor.Image.upload(req, '../../uploads/', function (err, data) {
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }
    data.link = data.link.replace('../..', '');
    data.link = 'http://localhost:3000' + data.link;
    res.send(data);
  });
}




///////////////////SEND EMAIL///////////////////
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "adiaz@cltech.net",
    pass: "angelica_1992"
  }
});



function sendEmail(req, res, next) {

  console.log(req.body.attachment)

  var mailOptions = {
    to: req.body.emailDestination,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html,
    attachments: req.body.attachment

  }

  smtpTransport.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("send");
    }
  });
}

