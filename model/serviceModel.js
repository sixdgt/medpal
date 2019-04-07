'user strict';
var sql = require('../db/db.js');

//Service object constructor
var Service = function(service){
    this.service_id = service.service_id;
    this.service = service.service;
};

Service.getAllService = function getAllService(result) {
    sql.query("Select service_id, service from medic_service", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }  
    });   
};

module.exports= Service;