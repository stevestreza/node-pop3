var sys = require('sys');
var pop3 = require('../lib/pop3');

var auth = pop3.POPClient.authentication.apop("steve", "test");

var client = new pop3.POPClient(110, "localhost.com", auth);
client.addListener("authenticate", function(){
	sys.puts("we have authenticated!");
	client.sendAndWait(["STAT"], function(line){
		sys.puts("stat: " + line);
		client.disconnect();
	})
})
client.connect();