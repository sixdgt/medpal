'use strict';
var Service = require('../model/serviceModel.js');
var Em = require('../model/responseModel.js');
var response;

exports.list_all_service = function(req, res) {
	var key = JSON.parse(JSON.stringify(req.headers));
	if (key.apikey == undefined){
		response = Em.errorResponse(503, "Not available","Service not available");
    res.status(503).json(response);
    return;
	}
	if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
		  response = Em.errorResponse(403, "Not available","Service not available");
      res.status(403).json(response);
      return;
	}
  Service.getAllService(function(err, service) {
    if (err){
      res.send(err);
      console.log('res', service);
      return;
    }
    // Math.random().toString(36).substr(2, 5);
    response = Em.dataResponse(200, "Service lists","Service list fetched successfully",{"service_lists": service});
    res.status(200).json(response);
  });
};
