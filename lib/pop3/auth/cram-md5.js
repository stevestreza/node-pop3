var sys = require('sys');
var crypto = require('crypto');
var base64 = require('../base64');

exports.cramMD5 = function(username, password){
	return function(client){
		client.sendAndWait(["AUTH", "CRAM-MD5"], function(line){
			if(line.substr(0,1)=="+"){
				var secret = base64.decode(line.substr(2, line.length-2));
				
				var hmac = crypto.createHmac("md5", password);
				hmac.update(secret);
				
				var digest = hmac.digest("hex");
				
				client.sendAndWait([base64.encode(username + " " + digest)], function(line){
					if(client.lineIsValid(line)){
						client.emit("authenticate");
					}
				})
			}
		})
	}
}