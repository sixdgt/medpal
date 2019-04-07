'use strict';
var Profession = require('../model/professionModel.js');
var Em = require('../model/responseModel.js');
var response;

exports.list_all_profession = function(req, res) {
  var key = JSON.parse(JSON.stringify(req.headers));
  if(key.apikey == undefined){
    response = Em.errorResponse(503, "Not available","Service not available");
    res.status(503).json(response);
    return;
  }
	if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
  	response = Em.errorResponse(403, "Not Allowed","Not Allowed");
  	res.status(403).json(response);
	}

  Profession.getAllProfession(function(err, profession) {
    if(err){
        res.send(err);
      	console.log('res', profession);
      }
    response = Em.dataResponse(200, "Profession lists","Profession list fetched successfully",{"profession_lists": profession});
    res.status(200).json(response);
  });
};

