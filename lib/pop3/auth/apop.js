var sys = require('sys');
var crypto = require('crypto');

exports.apop = function(username, password){
	return function(client){
		var timestampStart = client.welcomeMessage.search("<");
		var timestampEnd   = client.welcomeMessage.substr(timestampStart, client.welcomeMessage.length - timestampStart).search(">") + 1;
		var timestamp      = client.welcomeMessage.substr(timestampStart, timestampEnd);
		
		if(!timestamp){
			var newAuth = exports.auth.plaintext(username, password);
			newAuth(client);
		}else{
   	 		var md5 = crypto.createHash("md5");
   	 		md5.update(timestamp + password);
   	 		client.sendAndWait(["APOP", username, md5.digest("hex")], function(line){
   	 			if(client.lineIsValid(line)){
   	 				client.emit("authenticate");
   	 			}
   	 		});
   	 	}
	}
}