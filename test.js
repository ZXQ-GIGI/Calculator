'use strict'
var readline = require('readline');
var Calculator = require('./index.js');
var num = '';

var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

rl.on("line",function(line){
	switch(line.trim()){
		case 'e':rl.close();
		default: 
			var result = new Calculator(line.trim().replace("ans",num));
			console.log(result.calculate());
			num = result.result;
	}
});

rl.on("close",function(){
	process.exit(0);
});