const time = require('./time');

function log(message) {
    console.log(`[${time.getDate()} (${time.getHour()})]: ${message}`);
}

function error(error) {
    log(error)
}

module.exports = {
    log: log,
    error: error
}