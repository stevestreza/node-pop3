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

	while(lines.length && (line = lines.shift())){
		this.buffer.push(line);
	}
	
	if(data[data.length-1] == "\n"){
		this.buffer.push("");
	}
	
//	sys.puts("••• Buffer: " + sys.inspect(this.buffer));
	
	while(this.buffer.length > 1){
		var line = this.buffer.shift();
//		sys.puts("Emitting line: " + line)
		this.emit("line", line);
	}
}