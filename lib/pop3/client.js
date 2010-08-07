var sys = require('sys');
var net = require('net');

var StreamHandler = require('./streamHandler').StreamHandler;
require("./eventEmitter");

var POPClient = exports.POPClient = function(port, host, auth){
	this.host = host;
	this.port = port;
	this._auth = auth;
	
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
				self.welcomeMessage = line.substr(4, line.length-4);
				self.emit("connect", line);
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
	var self = this;
	self.sendAndWait(["QUIT"], function(){
		if(self.socket != null){
			try{
				self.socket.end();
			}catch(e){

			}
			self.socket = null;
		}
	})
}

// sending data

POPClient.prototype.send = function(){
	var client = this;
	var data = Array.prototype.join.call(arguments, " ");
	
	sys.puts(" writing " + data);
	
	this.socket.write(data+"\r\n");
	this.emit("packetSent", data);
}

POPClient.prototype.sendAndWaitFor = function(args, eventName, cb){
	var self = this;
	self.streamHandler.addOnce(eventName, cb);
	self.send.apply(self, args);
}

POPClient.prototype.sendAndWait = function(args, cb){
	return this.sendAndWaitFor(args, "line", cb);
}

POPClient.prototype.authenticate = function(){
	this._auth(this);
}

// testing responses

POPClient.prototype.lineIsValid = function(line){
	if(line.substr(0,3) == "+OK"){
		return true;
	}else if(line.substr(0,4) == "-ERR"){
		return false;
	}else{
		return undefined;
	}
}

POPClient.authentication = require("./auth").auth;