'use strict';
var Merchant = require('../model/merchantModel.js');
var crypt = require('../helper/crypt.js');
const bcrypt = require('bcrypt');
var Em = require('../model/responseModel.js');
var response;
// exports.list_all_Merchant = function(req, res) {
//   Merchant.getAllMerchant(function(err, merchant) {

//     console.log('controller')
//     if (err){
// 	    res.send(err);
// 	    console.log('res', merchant);
//   	}
//     res.send(merchant);
//   });
// };

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
  Merchant.sendVCode(hash, function(err, check){
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
  var merchant = {"vcode": req.body.vcode, "passkey": req.body.new_passkey};
  Merchant.updatePassword(req.body.session_key, merchant, function(err, merchant){
    if(err){
      response = Em.errorResponse(403, err, err);
      res.status(403).json(response);
      return;
    }
    response = Em.dataResponse(200, "Your password has been changed", "Your password has been changed");
    res.status(200).json(response);
  });
};

exports.profile = function(req, res) {
  var hash = req.body.session_key;
  Merchant.getProfile(hash, function(err, result) {
    if(err){
      response = Em.errorResponse(403, err, err);
      res.status(403).json(response);
      return;
    }
    response = Em.dataResponse(200, "Merchant profile","Merchant profile fetched successfully",{"merchant_profile":result});
    res.status(200).json(response);
  });
};

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
  var new_Merchant = new Merchant(req.body);
  if(!new_Merchant.first_name || !new_Merchant.last_name || !new_Merchant.contact 
      || !new_Merchant.profession_id || !new_Merchant.email || !new_Merchant.passkey){
    res.status(400).send({ error:true, message: 'Please provide all required credentials' });
  } else{
    var service = [];   
    Merchant.createMerchant(new_Merchant, function(err, merchant) {
    	if (err){
    	  res.send(err);
    	}
      
      for(var i = 0; i < req.body.services.length; ++i) {
        for(key in req.body.services[i]) {
          service.push({'service_id':req.body.services[i][key], 'merchant_id':merchant});
        }
      }
          
      Merchant.storeMerchantService(service, function(err, result){
        if(err){
          res.send(err);
        }
        response = Em.errorResponse(406, "Please verify you email","The verification code has been send to your email");
        res.status(403).json(response);
      });
    });
	}
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
  var new_Merchant = new Merchant(req.body);
  Merchant.checkLogin(new_Merchant, function(err, merchant, isverified) {
    if (err){
      response = Em.errorResponse(406, err, err);
      res.status(403).json(response);
      return;
    }
    if(isverified === 1){
      response = Em.errorResponse(406, "Please verify you email","The verification code has been send to your email");
      res.status(403).json(response);
      return;
    }else{
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
  // var vcode = req.body.verification_token;
  var data = [req.body.email,req.body.verification_token];
  Merchant.verifyMerchant(data, function(err, result) {
    if (err){
      response = Em.errorResponse(403, "Invalid token","Please enter correct code");
      res.status(403).json(response);
      return;
    }
    var hash = bcrypt.hashSync(req.body.email, 10);
    // var session = {"email": req.body.email, "hash_data":hash, "created_at":new Date()};
    var session = [[req.body.email, hash, new Date()]];
    Merchant.storeSession(session, function(err, result){
      if(err){
        response = Em.errorResponse(400, "Something went worng","Something went worng");
        res.status(400).json(response);
        return;
      }
      response = Em.dataResponse(200, "Verified successfully","Verified successfully",{"session_key":hash});
      res.status(200).json(response);
    });
  });
};


// exports.update_a_Merchant = function(req, res) {
//   Merchant.updateById(req.params.MerchantId, new Merchant(req.body), function(err, Merchant) {
//     if (err)
//       res.send(err);
//     res.json(Merchant);
//   });
// };


// exports.delete_a_Merchant = function(req, res) {


//   Merchant.remove( req.params.MerchantId, function(err, Merchant) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Merchant successfully deleted' });
//   });
// };