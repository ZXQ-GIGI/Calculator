'use strict'
var readline = require('readline');
var Calculator = require('./index.js');

//var expression = "-3+5*(12^4-4)-(-6)/2";

//var result = new Calculator(expression);
//console.log(result.calculate());
var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

rl.question("Please input:",function(answer){
	var result = new Calculator(answer);
	console.log(result.calculate());
	rl.close();
});

rl.on("close",function(){
	process.exit(0);
});