'user strict';
var sql = require('../db/db.js');
var nodemailer = require('nodemailer');

var json;
//Client object constructor
var Client = function(client){
    // this.client_id = client.client_id;
    this.first_name = client.first_name;
    this.middle_name = client.middle_name;
    this.last_name = client.last_name;
    this.contact = client.contact;
    this.height = client.height;
    this.weight = client.weight;
    this.dob = client.dob;
    this.gender = client.gender;
    this.email = client.email;
    this.passkey = client.passkey;
    this.is_verified = 1;
    this.verification_token = Math.random().toString(36).substr(2, 4);
    this.removed = 0;
    this.created_at = new Date();
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'c4crypt@gmail.com',
    pass: 'ejogvtxsrnbjpgcz'
  }
});

Client.createClient = function createClient(newClient, result) {    
    sql.query("INSERT INTO medic_client SET ?", newClient, function (err, res) {
        if(err){
            console.log("error: ", err);
            result(err, null);
        } else{
            var mailOptions = {
                from: 'c4crypt@gmail.com',
                to: newClient.email,
                subject: 'Medpal App Email Verification',
                text: 'Welcome to Medpal App. Your email verification code is:' + newClient.verification_token
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

Client.storeSession = function storeSession(data, result){
    sql.query(`INSERT INTO medic_client_session(email, hash_data, created_at) VALUES ?`, [data], function(err, res){
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

Client.checkLogin = function checkLogin(client, result, isverified) {
    sql.query(`SELECT * from medic_client WHERE email = ?`, client.email, function (err, res) {             
        if(Object.keys(res).length === 0) {
            err = "Email or passkey invalid";
            result(err, null);
            return;
        } else {
            json = JSON.parse(JSON.stringify(res));
            if(json[0].passkey !== client.passkey){
                err = "Email or passkey invalid";
                result(err, null);
                return;
            }
            if(json[0].is_verified === 1){
                var mailbody = {
                    from: 'c4crypt@gmail.com',
                    to: client.email,
                    subject: 'Medpal App Email Verification',
                    text: 'Welcome to Medpal App. Your email verification code is:' + json[0].verification_token
                };

                transporter.sendMail(mailbody, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                result(null, res, 1); 
                return;
            }
            result(null, res, 0);   
        }
    });   
};

Client.verifyClient = function(data, result){
    sql.query(`UPDATE medic_client SET is_verified = 0 WHERE email = ?  AND verification_token = ?`, data, function (err, res) {
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

Client.getProfile = function getProfile(hash, result) {
    sql.query("Select email from medic_client_session WHERE hash_data = ? AND status = 0", hash, function (err, res) {
        if(Object.keys(res).length === 0) {
            err = "Please login first";
            result(err, null);
            return;
        }
        json = JSON.parse(JSON.stringify(res));
        sql.query(`SELECT client_id, first_name, middle_name, last_name, contact, height, weight, dob, email, gender FROM medic_client WHERE email = ? AND removed = 0`, json[0].email, function(err, profile){
            if(err){
                console.log(err);
            }
            json = JSON.parse(JSON.stringify(profile));
            var response = {
                "client_id": json[0].client_id,
                "first_name": json[0].first_name,
                "middle_name": json[0].middle_name,
                "last_name": json[0].last_name,
                "contact": json[0].contact,
                "height": json[0].height,
                "weight": json[0].weight,
                "dob": json[0].dob,
                "gender": json[0].gender,
                "email": json[0].email
            }
            result(null, response);
            return;
        });  
    });   
};

Client.updateClient = function updateClient(hash, data, result){
    sql.query("Select email from medic_client_session WHERE hash_data = ? AND status = 0", hash, function (err, res) {
        if(Object.keys(res).length === 0) {
            err = "Please login first";
            result(err, null);
            return;
        }
        json = JSON.parse(JSON.stringify(res));
        console.log(data);
        sql.query(`UPDATE medic_client SET ? WHERE email = ?`, [data, json[0].email], function(err, res){
        if(err){
            result(err, null);
            console.log(err);
        }
        result(null, res);
        }); 
    });   
}

Client.sendVCode = function sendVCode(hash, result){
    sql.query(`SELECT email FROM medic_client_session WHERE hash_data = ? AND status = 0`, hash, function (err, res) {
        if(Object.keys(res).length === 0) {
            err = "Please login first";
            result(err, null);
            return;
        }else{
            json = JSON.parse(JSON.stringify(res));
            var vcode = Math.random().toString(36).substr(2, 4);
            sql.query(`INSERT INTO medic_client_password(email, vcode) VALUES(?,?)`, [json[0].email, vcode.toString()], function(err, res){
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

Client.updatePassword = function updatePassword(hash, data, result){
    sql.query(`SELECT email from medic_client_session WHERE hash_data = ?`, hash , function(err, res){
        if(Object.keys(res).length === 0){
            err = "Please login first";
            result(err, null);
        }else{
            var json = JSON.parse(JSON.stringify(res));
            sql.query(`SELECT vcode FROM medic_client_password WHERE email = ?`,json[0].email, function(err, res){
                var check = JSON.parse(JSON.stringify(res));
                console.log(data);
                if(check[0].vcode !== data.vcode){
                    err = "Please enter the correct code";
                    result(err, null);
                    return;
                }else{
                    console.log(data.passkey);
                    sql.query(`UPDATE medic_client SET passkey = ? WHERE email = ?`,[data.passkey, json[0].email], function(err, res){
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

// Client.remove = function(id, result){
//      sql.query("DELETE FROM Clients WHERE id = ?", [id], function (err, res) {

//                 if(err) {
//                     console.log("error: ", err);
//                     result(err, null);
//                 }
//                 else{
               
//                  result(null, res);
//                 }
//             }); 
// };

module.exports= Client;