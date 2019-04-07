'use strict';
var Client = require('../model/clientModel.js');
var crypt = require('../helper/crypt.js');
const bcrypt = require('bcrypt');
var Em = require('../model/responseModel.js');
var response;
// var key;

exports.profile = function(req, res) {
  var hash = req.body.session_key;
  Client.getProfile(hash, function(err, result) {
    if(err){
      response = Em.errorResponse(403, err, err);
      res.status(403).json(response);
      return;
    }
    response = Em.dataResponse(200, "Client profile","Client profile fetched successfully",{"client_profile":result});
    res.status(200).json(response);
  });
};

// exports.changePasskey = function(req, res){
  
// };

exports.register = function(req, res) {
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  var new_client = new Client(req.body);
  if(!new_client.first_name || !new_client.last_name || !new_client.contact || !new_client.height || !new_client.weight || !new_client.dob || !new_client.gender){
   	response = Em.errorResponse(204, "No content","Please input the required field");
    res.status(204).json(response);
    return;
  } else{
	  Client.createClient(new_client, function(err, client) {
  	  if (err){
  	    res.send(err);
  	  }
      response = Em.errorResponse(406, "Please verify your email","The verification code has been send to your email");
      res.status(403).json(response);
	  });
	}
};

exports.passwordVCode = function(req, res){
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  var hash = req.body.session_key;
  Client.sendVCode(hash, function(err, check){
    if(err) {
      console.log(err);
      response = Em.errorResponse(403, err, err);
      res.status(403).json(response);
      return;
    }
    response = Em.dataResponse(200, "Verification Code sent", "The verification code has been send to your email", {});
    res.status(200).json(response);
  });
};

exports.passkeyUpdate = function(req, res){
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  var client = {"vcode": req.body.vcode, "passkey": req.body.new_passkey};
  Client.updatePassword(req.body.session_key, client, function(err, client){
    if(err){
      response = Em.errorResponse(403, err, err);
      res.status(403).json(response);
      return;
    }
    response = Em.dataResponse(200, "Your password has been changed", "Your password has been changed");
    res.status(200).json(response);
  });
};

exports.login = function(req, res) {
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  var new_client = new Client(req.body);
  Client.checkLogin(new_client, function(err, client, isverified) {
    if (err){
      response = Em.errorResponse(401, err, err);
      res.status(401).json(response);
      return;
    }
    if (isverified === 1){
      response = Em.errorResponse(406, "Please verify you email","The verification code has been send to your email");
      res.status(403).json(response);
      return;
    } else {
      response = Em.dataResponse(200, "Logged successfully","Logged successfully");
      res.status(200).json(response);
    }
  });
};

exports.verify = function(req, res) {
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }

  var data = [req.body.email,req.body.verification_token];
  Client.verifyClient(data, function(err, result) {
    if (err){
      response = Em.errorResponse(406, err, "Please check your mail and enter correct token");
      res.status(406).json(response);
      return;
    }
    var hash = bcrypt.hashSync(req.body.email, 10);
    // var session = {"email": req.body.email, "hash_data":hash, "created_at":new Date()};
    var session = [[req.body.email, hash, new Date()]];
    Client.storeSession(session, function(err, result){
      if(err){
        console.log(err);
      }
      response = Em.dataResponse(200, "Verified successfully","Verified successfully",{"session_key":hash});
      res.status(200).json(response);
    });
  });
};

exports.profile_update = function(req, res){
  var key = JSON.parse(JSON.stringify(req.headers));
  if (key.apikey == undefined){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    response = Em.errorResponse(403, "Not allowed","Not allowed");
    res.status(403).json(response);
    return;
  }
  var client = {"first_name": req.body.first_name, "middle_name": req.body.middle_name,
    "last_name": req.body.last_name, 
    "contact": req.body.contact,
    "height": req.body.height, 
    "weight": req.body.weight,
    "dob": req.body.dob, 
    "gender": req.body.gender,
    "email": req.body.email
    };
  if(!client.first_name || client.last_name){
    console.log("er");
  }

  Client.updateClient(req.body.session_key, client, function(err, client){
    if(err){
      response = errorResponse(400, "Something went wrong", "Please check your input data");
    }
    response = Em.dataResponse(200, "Updated successfully", "Your profile has been updated successfully");
    res.status(200).json(response);
  });
};
