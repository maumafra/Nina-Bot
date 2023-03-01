const dotenv = require('dotenv');

dotenv.config();

const { TIME_ZONE } = process.env;

function getTimeUntilMidnight() {
	const midnight = new Date()
	midnight.setHours(24)
	midnight.setMinutes(0)
	midnight.setSeconds(0)
	midnight.setMilliseconds(0);
	return midnight.getTime() - new Date(new Date().toLocaleString("en-US", {timeZone: TIME_ZONE})).getTime();
}

function getTime(){
	return new Date(new Date().toLocaleString("en-US", {timeZone: TIME_ZONE}));
}

function getHour(){
	return getTime().toLocaleTimeString();
}

function getDate() {
	return getTime().toLocaleDateString();
}

module.exports = {
    getTimeUntilMidnight: getTimeUntilMidnight,
	getTime: getTime,
	getHour: getHour,
	getDate: getDate,
}