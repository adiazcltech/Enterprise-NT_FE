var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
var fs = require('fs');
var copydir = require('copy-dir');

router.get('/people', getPeople);
router.post('/user', getUser);
router.post('/getlistReportFile', getlistReportFile)
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

var pathReport = 'C:/Jdiaz/FE/02_EnterpriseNT_FE/02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/Report/reportsandconsultations/reports'

//////////////

function getPeople(req, res, next) {
  res.status(200).send(data.people);
}

function getUser(req, res, next) {
  var userLogin = {
    'user': 'dcortes',
    'password': '123456'
  }
  res.status(200).send(userLogin);
}


function getlistReportFile(req, res) {
  var listReports = [];
  fs.readdir(pathReport + '/', function (err, files) {
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

  copydir.sync(pathReport, './src/client/reports', {
    utimes: true, // keep add time and modify time
    mode: true, // keep file mode
    cover: true // cover file when exists, default is true
  });


  setTimeout(function () {
    res.send(listReports);
  }, 3000)
}


function getPerson(req, res, next) {
  var id = +req.params.id;
  var person = data.people.filter(function (p) {
    return p.id === id;
  })[0];

  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  }
}
