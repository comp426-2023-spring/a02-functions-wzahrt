#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// process args
var args = minimist(process.argv.slice(2));

// logging info for help call
if (args.h) {
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit`);
	process.exit(0);
}

// Extracts the timezone
const timezone = moment.tz.guess();
// setting lat and long
const latitude = args.n || args.s * -1;
const longitude = args.e || args.w * -1;

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&timezone='+timezone+'&daily=precipitation_hours&current_weather=true');

// Grabs data from request
const data = await response.json();


if (args.j) {
  console.log(data);
  process.exit(0);
}

const days = args.d ?? 1;

let message = "";
if (data.daily.precipitation_hours[days] > 0) {message += "It might be a bit rainy ";} 
else {message += "It will be sunny ";}

if (days == 0) {
	message += "today";
} else if (days == 1) {
	message += "tomorrow.";
} else {
	message += "in " + days + " days.";
}

// Logging the final weather message to console
console.log(message);
