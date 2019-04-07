'use strict';
var Apikey = function(apikey){
	this.apikey = apikey.apikey;
}
Apikey.unDefined = function api_check(apikey){
    if (apikey == undefined){
		return true;
	}
};

Apikey.apiCheck = function api_check(apikey){
    if (key.apikey != '49be994a9a74da4d8e6f6cc70ef2bf77ef1ce0005ea3a78b261ffcd8edb0bf771546612675000'){
    	return true;
	}
};

module.exports= Apikey;