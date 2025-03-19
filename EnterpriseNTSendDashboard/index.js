var express = require('express');
var app = express();
var router = express.Router();
var services = require("./js/services")
var cron = require('node-cron');



cron.schedule('*/2 * * * *', () => {
    services.login();
});







