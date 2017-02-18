'use strict';

const spawn = require('child_process').spawn;

const watching = [
  {service: "babel-watch"},
  {service: "webpack-watch"},
  {service: "server-watch"}
];

console.log('Watch on babel, webpack, server');
watching.forEach(({service}) => spawn('npm', ['run', service]));
