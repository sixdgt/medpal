'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'medpal'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection; 

// q^}oP)gVfi#c

//  mail@medpal.net
// V9!&E~+DJtq=

 // host: 'mail.medpal.net',
 //  port: 465,
 //  secure: true,
 //  auth: {
 //    user: 'mail@medpal.net',
 //    pass: 'V9!&E~+DJtq='
 //  }