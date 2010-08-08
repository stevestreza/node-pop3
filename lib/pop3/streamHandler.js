var sys = require('sys');

var StreamHandler = exports.StreamHandler = function(){
	this.buffer = [""];
	
	return this;
}

sys.inherits(StreamHandler, process.EventEmitter);

StreamHandler.prototype.receiveData = function(data){
	var lines = data.split("\r\n");

	var line = lines.shift();
	var oldLine = "";
	if(this.buffer.length > 0){
		this.buffer[this.buffer.length-1];
	}
	oldLine = oldLine + line;
	this.buffer[this.buffer.length-1] = oldLine;

	for(var index in lines){
		var newline = lines[index];
		this.buffer.push(newline);
	}
	
	while(this.buffer.length > 1){
		var line = this.buffer.shift();
		this.emit("line", line);
	}
}