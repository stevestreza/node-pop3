var sys = require('sys');
var net = require('net');

var StreamHandler = require('./streamHandler').StreamHandler;
require("./eventEmitter");

var POPClient = exports.POPClient = function(port, host, username, password){
	this.host = host;
	this.port = port;
	this.username = username;
	this.password = password;
	
	this.socket = null;
	this.streamHandler = new StreamHandler();
	this.streamHandler.addListener("line", function(line){
//		sys.puts("  parsing line " + line);
	})
}

sys.inherits(POPClient, process.EventEmitter);

// connection management

POPClient.prototype.connect = function(){
	this.socket = net.createConnection(this.port, this.host);
	this.socket.setEncoding("ascii");
	
	sys.puts("Connecting to " + this.host + ":" + this.port);
	
	var self = this;
	
	this.socket.addListener("connect", function(){
		sys.puts("Connected to " + self.host + ":" + self.port);
		self.streamHandler.addOnce("line", function(line){
			if(line.substr(0,3) == "+OK"){
				self.authenticate();
			}
		})
	})
	this.socket.addListener("data", function(data){
//		sys.puts(" Received data " + data);
		self.streamHandler.receiveData(data);
	})
}

POPClient.prototype.disconnect = function(){
	if(this.socket != null){
		try{
			this.socket.close();
		}catch(e){
			
		}
		this.socket = null;
	}
}

// sending data

POPClient.prototype.send = function(){
	var client = this;
	
//	this.waiting = true;
//	this.packetHandler.addListener("packet", function(){    
//		client.packetHandler.removeListener("packet", arguments.callee);
//		client.waiting = false;
//	});
	
	var data = Array.prototype.join.call(arguments, " ");
	
//	sys.puts("Writing data " + data);
	
	this.socket.write(data+"\r\n");
	this.emit("packetSent", data);
}

POPClient.prototype.authenticate = function(){
	var self = this;
	self.streamHandler.addOnce("line", function(line){
//		sys.puts("Received line for user: " + line)
		if(line.substr(0,3) == "+OK"){
			self.streamHandler.addOnce("line", function(line){
//				sys.puts("Received line for pass: " + line)
				if(line.substr(0,3) == "+OK"){
					// auth'd
					self.emit("authenticate");
				}
			});
			self.send("PASS", self.password);
		}
	});
	self.send("USER", self.username);
}