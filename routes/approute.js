'use strict';
module.exports = function(app) {
  var service = require('../controller/serviceController');
  var profession = require('../controller/professionController');
  var client = require('../controller/clientController');
  var merchant = require('../controller/merchantController');
  // services
  app.route('/api/v1/service/list')
  	.get(service.list_all_service);
    
  // profession
 	app.route('/api/v1/profession/list')
 		.get(profession.list_all_profession);

  // client api
  app.route('/api/v1/client/register')
    .post(client.register);
  app.route('/api/v1/client/login')
    .post(client.login);
  app.route('/api/v1/client/verify')
    .post(client.verify);
  app.route('/api/v1/client/profile')
    .post(client.profile);
  app.route('/api/v1/client/update')
    .post(client.profile_update);
  app.route('/api/v1/client/pvcode')
    .post(client.passwordVCode);
  app.route('/api/v1/client/pchange')
    .post(client.passkeyUpdate);  
  
    // merchant api
  app.route('/api/v1/merchant/register')
    .post(merchant.register);
  app.route('/api/v1/merchant/login')
    .post(merchant.login);
  app.route('/api/v1/merchant/verify')
    .post(merchant.verify);
  app.route('/api/v1/merchant/profile')
    .post(merchant.profile);
  app.route('/api/v1/merchant/pvcode')
    .post(merchant.passwordVCode);
  app.route('/api/v1/merchant/pchange')
    .post(merchant.passkeyUpdate); 
};
