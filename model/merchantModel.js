'user strict';
var sql = require('../db/db.js');
var nodemailer = require('nodemailer');
//Merchant object constructor
var Merchant = function(merchant){
    // this.Merchant_id = Merchant.Merchant_id;
    this.first_name = merchant.first_name;
    this.middle_name = merchant.middle_name;
    this.last_name = merchant.last_name;
    this.contact = merchant.contact;
    this.profession_id = merchant.profession_id;
    this.email = merchant.email;
    this.passkey = merchant.passkey;
    this.longitude = merchant.longitude;
    this.address = merchant.address;
    this.latitude = merchant.latitude;
    this.is_verified = 1;
    this.verification_token = Math.random().toString(36).substr(2, 4);
    this.removed = 0;
    this.created_at = new Date();
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'c4crypt@gmail.com',
    pass: 'ejogvtxsrnbjpgcz'
  }
});

Merchant.createMerchant = function createMerchant(newMerchant, result) {    
    sql.query("INSERT INTO medic_merchant SET ?", newMerchant, function (err, res) {
        if(err){
            console.log("error: ", err);
                result(err, null);
        } else{
            var mailOptions = {
                from: 'c4crypt@gmail.com',
                to: newMerchant.email,
                subject: 'Medpal App Email Verification',
                text: 'Welcome to Medpal App. Your email verification code is: ' + newMerchant.verification_token
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            }); 
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

Merchant.storeMerchantService = function storeMerchantService(data, result) {    
    sql.query("INSERT INTO medic_merchant_service(service_id, merchant_id) VALUES?", 
        [data.map(data => [data.service_id, data.merchant_id])]
        , function (err, res) {
        if(err){
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res);
        }
    });           
};

Merchant.checkLogin = function checkLogin(merchant, result) {
    sql.query("Select * from medic_merchant where email = ? ", merchant.email, function (err, res) {             
        if(Object.keys(res).length === 0) {
            err = "Email or passkey invalid";
            result(err, null);
        } else {
            var json = JSON.parse(JSON.stringify(res));
            var id = json[0].merchant_id;
            if(json[0].passkey !== merchant.passkey){
                err = "Please your password has already been changed";
                result(err, null);
                return;
            }
            if(json[0].is_verified == 1){
                var mailbody = {
                    from: 'c4crypt@gmail.com',
                    to: merchant.email,
                    subject: 'Medpal App Email Verification',
                    text: 'Welcome to Medpal App. Your email verification code is: ' + json[0].verification_token
                };

                transporter.sendMail(mailbody, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                result(null, id.toString(), 1); 
                return;
            }
            result(null, id.toString(), 0);   
        }
    });   
};

Merchant.verifyMerchant = function(data, result){
  sql.query(`UPDATE medic_merchant SET is_verified = 0 WHERE email = ?  AND verification_token = ?`, data, function (err, res) {
    if(res.changedRows == 0) {
        err = "Invalid verification token";
        result(err, null);
        return;
    } else {   
        result(null, res);
        return;
    }
    }); 
};

Merchant.storeSession = function storeSession(data, result){
    sql.query(`INSERT INTO medic_merchant_session(email, hash_data, created_at) VALUES ?`, [data], function(err, res){
        if(err){
            console.log(err);
            result(err, null);
            return;
        }
        console.log(res);
        result(null, res);
        return;
    });
};

Merchant.getProfile = function getProfile(hash, result) {
    sql.query("SELECT email FROM medic_merchant_session WHERE hash_data = ? AND status = 0", hash, function (err, res) {
        if(Object.keys(res).length === 0) {
            err = "Please login first";
            result(err, null);
            return;
        }
        
        json = JSON.parse(JSON.stringify(res));
        sql.query(`SELECT m.merchant_id, m.first_name,
            m.middle_name, m.last_name, m.contact, 
            m.address, m.latitude, m.longitude, m.email, 
            p.profession_id, p.profession FROM medic_merchant m 
            INNER JOIN medic_profession p ON p.profession_id = m.profession_id 
            WHERE m.email = ? AND m.removed = 0`, json[0].email, function(err, profile){
            if(err){
                console.log(err);
                return;
            }
            js = JSON.parse(JSON.stringify(profile));
            console.log(js);
            sql.query(`SELECT s.service_id, s.service FROM medic_service s 
                INNER JOIN medic_merchant_service ms 
                ON s.service_id = ms.service_id 
                INNER JOIN medic_merchant m 
                ON m.merchant_id = ms.merchant_id WHERE ms.merchant_id = ?`, js[0].merchant_id, function(err, services){
                    if(err){
                        console.log(err);
                    }
                    var response = {
                    "merchant_id": js[0].merchant_id,
                    "first_name": js[0].first_name,
                    "middle_name": js[0].middle_name,
                    "last_name": js[0].last_name,
                    "contact": js[0].contact,
                    "address": js[0].address,
                    "latitude": js[0].latitude,
                    "longitude": js[0].longitude,
                    "email": js[0].email,
                    "profession_id": js[0].profession_id,
                    "profession": js[0].profession,
                    services
                };
            result(null, response);
            return;
            });
            
        });  
    });   
};

Merchant.sendVCode = function sendVCode(hash, result){
    sql.query(`SELECT email FROM medic_merchant_session WHERE hash_data = ? AND status = 0`, hash, function (err, res) {
        if(Object.keys(res).length === 0) {
            err = "Please login first";
            result(err, null);
            return;
        }else{
            json = JSON.parse(JSON.stringify(res));
            var vcode = Math.random().toString(36).substr(2, 4);
            sql.query(`INSERT INTO medic_merchant_password(email, vcode) VALUES(?,?)`, [json[0].email, vcode.toString()], function(err, res){
                if(Object.keys(res).length === 0){
                    err = "Something is wrong";
                    result(err, null);
                    return;
                }else{
                    var mailbody = {
                        from: 'c4crypt@gmail.com',
                        to: json[0].email,
                        subject: 'Password verification token',
                        text: 'Welcome to Medpal App. Your password verification code is:' + vcode
                    };    
                    transporter.sendMail(mailbody, function(error, info){
                        if (Object.keys(info).length === 0) {
                            error = "failed to send mail";
                            console.log(error);
                            result(error, null); 
                            return;
                        }
                    });
                    console.log(res);
                    result(null, res);
                    return;
                }
            }); 
        }
    });
}

Merchant.updatePassword = function updatePassword(hash, data, result){
    sql.query(`SELECT email from medic_merchant_session WHERE hash_data = ?`, hash , function(err, res){
        if(Object.keys(res).length === 0){
            err = "Please login first";
            result(err, null);
        }else{
            var json = JSON.parse(JSON.stringify(res));
            sql.query(`SELECT vcode FROM medic_merchant_password WHERE email = ?`,json[0].email, function(err, res){
                var check = JSON.parse(JSON.stringify(res));
                console.log(data);
                if(check[0].vcode !== data.vcode){
                    err = "Please enter the correct code";
                    result(err, null);
                    return;
                }else{
                    console.log(data.passkey);
                    sql.query(`UPDATE medic_merchant SET passkey = ? WHERE email = ?`,[data.passkey, json[0].email], function(err, res){
                        if(Object.keys(res).length === 0){
                            err = "Something went wrong";
                            result(err, null);
                            return;
                        }else{
                            result(null, res);
                            return;
                        }
                    });
                }  
            });
        }
    });
}

// Merchant.getAllMerchant = function getAllMerchant(result) {
//         sql.query("Select * from medic_Merchant", function (err, res) {

//                 if(err) {
//                     console.log("error: ", err);
//                     result(null, err);
//                 }
//                 else{
//                   console.log('Merchants : ', res);  
//                   var response = {
//                                     "response": {
//                                     "error": [],
//                                     "code": 200,
//                                     "message": "Merchant list",
//                                     "secondary_message": "Merchant list fetched successfully",
//                                     "data": {
//                                         "Merchant_lists": res
//                                         }
//                                     }
//                                 };
//                  result(null, response);
//                 }
            
//             });   
// };

// Merchant.updateById = function(id, Merchant, result){
//   sql.query("UPDATE medic_Merchant SET medic_Merchant = ? WHERE id = ?", [Merchant.Merchant, id], function (err, res) {
//           if(err) {
//               console.log("error: ", err);
//                 result(null, err);
//              }
//            else{   
//              result(null, res);
//                 }
//             }); 
// };

// Merchant.remove = function(id, result){
//      sql.query("DELETE FROM Merchants WHERE id = ?", [id], function (err, res) {

//                 if(err) {
//                     console.log("error: ", err);
//                     result(null, err);
//                 }
//                 else{
               
//                  result(null, res);
//                 }
//             }); 
// };

module.exports= Merchant;