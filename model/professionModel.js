'user strict';
var sql = require('../db/db.js');

//Profession object constructor
var Profession = function(profession){
    this.profession_id = profession.profession_id;
    this.profession = profession.profession;
};

Profession.getAllProfession = function getAllProfession(result) {
    sql.query("Select profession_id, profession from medic_profession", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });   
};

module.exports= Profession;