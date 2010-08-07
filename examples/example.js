var sys = require('sys');
var pop3 = require('../lib/pop3');

var client = new pop3.POPClient(110, "localhost.com", "steve", "test");
client.addListener("authenticate", function(){
	sys.puts("we have authenticated!");
})
client.connect();

setTimeout(1000, function(){
	client.disconnect();
})