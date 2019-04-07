'user strict';
var result;
var ResponseModel = function(){};
ResponseModel.errorResponse = function errorResponse(code, message, sec_msg) {
		var title, detail;
   		switch (code) {
            case 100:
                title = 'Continue. ' + message;
                detail = sec_msg;
                break;
            case 101: 
            	title = 'Switching Protocols. ' + message;
            	detail = sec_msg;
                break;
            case 200: 
            	title = 'OK. ' + message;
            	detail = sec_msg;
                break;
            case 201: 
            	title = 'Created. ' + message;
                detail = sec_msg;
                break;
            case 202: 
            	title = 'Accepted. ' + message;
                detail = sec_msg;
                break;
            case 203: 
            	title = 'Non-Authoritative Information. ' + message;
                detail = sec_msg;
                break;
            case 204: 
            	title = 'No Content. ' + message;
                detail = sec_msg;
                break;
            case 205: 
            	title = 'Reset Content. ' + message;
                detail = sec_msg;
                break;
            case 206: 
            	title = 'Partial Content. ' + message;
                detail = sec_msg;
                break;
            case 300: 
            	title = 'Multiple Choices. ' + message;
                detail = sec_msg;
                break;
            case 301: 
            	title = 'Moved Permanently. ' + message;
                detail = sec_msg;
                break;
            case 302: 
            	title = 'Moved Temporarily. ' + message;
                detail = sec_msg;
                break;
            case 303: 
            	title = 'See Other. ' + message;
                detail = sec_msg;
                break;
            case 304: 
            	title = 'Not Modified. ' + message;
                detail = sec_msg;
                break;
            case 305: 
            	title = 'Use Proxy. ' + message;
                detail = sec_msg;
                break;
            case 400: 
            	title = 'Bad Request. ' + message;
                detail = sec_msg;
                break;
            case 401: 
            	title = 'Unauthorized Access. ' + message;
                detail = sec_msg;
                break;
            case 402: 
            	title = 'Payment Required. ' + message;
                detail = sec_msg;
                break;
            case 403: 
            	title = 'Access Forbidden. ' + message;
                detail = sec_msg;
                break;
            case 404: 
            	title = 'Content Not Found. ' + message;
                detail = sec_msg;
                break;
            case 405: 
            	title = 'Method Not Allowed. ' + message;
                detail = sec_msg;
                break;
            case 406: 
            	title = 'Not Acceptable. ' + message;
                detail = sec_msg;
                break;
            case 407: 
            	title = 'Proxy Authentication Required. ' + message;
                detail = sec_msg;
                break;
            case 408: 
            	title = 'Request Time-out. ' + message;
                detail = sec_msg;
                break;
            case 409: 
            	title = 'Conflict. ' + message;
                detail = sec_msg;
                break;
            case 410: 
            	title = 'Gone. ' + message;
                detail = sec_msg;
                break;
            case 411: 
            	title = 'Length Required. ' + message;
                detail = sec_msg;
                break;
            case 412: 
            	title = 'Precondition Failed. ' + message;
                detail = sec_msg;
                break;
            case 413: 
            	title = 'Request Entity Too Large. ' + message;
                detail = sec_msg;
                break;
            case 414: 
            	title = 'Request-URI Too Large. ' + message;
                detail = sec_msg;
                break;
            case 415: 
            	title = 'Unsupported Media Type. ' + message;
                detail = sec_msg;
                break;
            case 422: 
            	title = 'Unprocessable Entity. ' + message;
                detail = sec_msg;
                break;
            case 500: 
            	title = 'Internal Server Error. ' + message;
                detail = sec_msg;
                break;
            case 501: 
            	title = 'Not Implemented. ' + message;
                detail = sec_msg;
                break;
            case 502: 
            	title = 'Bad Gateway. ' + message;
                detail = sec_msg;
                break;
            case 503: 
            	title = 'Service Unavailable. ' + message;
                detail = sec_msg;
                break;
            case 504: 
            	title = 'Gateway Time-out. ' + message;
                detail = sec_msg;
                break;
            case 505: 
            	title = 'HTTP Version not supported. ' + message;
                detail = sec_msg;
                break;
            default : 
            	title = 'Undefined. ' + message;
            	detail = sec_msg;
        }
        return result = 
        	{
        		"response":
        		{
                   	"error":
                   	[{
                        "title": title,
                        "detail": detail,
                        "code": code,
                        "source": {}
                    }],
                    "code": code,
                    "data": {}
                }
        };
};

ResponseModel.dataResponse = function dataResponse(code, msg, sec_msg, data){
	return result = 
	{
        "response": {
            "error": [],
            "code": code,
            "message": msg,
            "secondary_message": sec_msg,
            "data": data
        }
    };
};
module.exports= ResponseModel;