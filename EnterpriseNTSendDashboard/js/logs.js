var opts = {
    logDirectory:'logs', // NOTE: folder must exist and be writable...
    fileNamePattern:'log-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};

var log = require('simple-node-logger').createRollingFileLogger( opts );

function info(message){
    log.info(message)
}

function error(message){
    log.error(message)
}

module.exports = {
    "info": info, 
    "error":error
}