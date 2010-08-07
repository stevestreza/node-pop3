var sys = require('sys');

exports.plaintext = function(username, password){
	return function(client){
		client.sendAndWait(["USER", username], function(line){
			if(client.lineIsValid(line)){
				client.sendAndWait(["PASS", password], function(line){
					if(client.lineIsValid(line)){
						// auth'd
						client.emit("authenticate");
					}
				});
			}
		});
	}
};