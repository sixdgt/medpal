const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var path = require('path');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mysql = require('mysql');
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medpal'
});

// connect to database
mc.connect();

app.listen(port);

console.log('API server started on: ' + port);

var routes = require('./routes/approute'); //importing route
routes(app); //register the route