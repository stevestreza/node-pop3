var sys = require('sys');
var crypto = require('crypto');

exports.auth = {
	plaintext: require("./auth/plaintext").plaintext,
	apop: require("./auth/apop").apop,
	cramMD5: require("./auth/cram-md5").cramMD5
}