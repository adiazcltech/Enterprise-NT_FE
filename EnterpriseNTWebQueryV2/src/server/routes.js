var router = require('express').Router();
var fs = require('fs');
var copydir = require('copy-dir');
router.post('/getlistReportFile', getlistReportFile);
router.post('/getlistidiome', getlistidiome);
router.post('/user', getUser);
module.exports = router;
function getlistReportFile(req, res) {
  var data = req.body;
  var listReports = [];
  if (fs.existsSync(data.pathReport + "/reports.mrt")) {
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
    copydir.sync(data.pathReport, data.report, {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true // cover file when exists, default is true
    });

    setTimeout(function () {
      res.send(listReports);
    }, 3000)
  } else {
    res.send("2")// El archico no existe;
  }
}
function getlistidiome(req, res) {
  var data = req.body;
  if (fs.existsSync(data.pathReport)) {
    fs.readFile(data.pathReport, 'utf-8', (err, data) => {
      if (err) {
        console.log('error: ', err);
      } else {
        res.send(data);
      }
    });
  } else {
    res.send("2")// El archico no existe;
  }
}
/*http://131.100.143.238:10003/orqrm:MjAyMjExMjAwMDA1
/* var userLogin = { "location": 1, "type": 4, "username": "admin", "password": "cltech123" } */
function getUser(req, res, next) {
  var userLogin = "eyAibG9jYXRpb24iOiAxLCAidHlwZSI6IDQsICJ1c2VybmFtZSI6ICJkY29ydGVzIiwgInBhc3N3b3JkIjogIjEyMzQ1NiIgfQ=="
  res.status(200).send(userLogin);
}






