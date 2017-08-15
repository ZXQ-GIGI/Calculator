'use strict'
var readline = require('readline');
var Calculator = require('./index.js');
var num = '';
console.log("Please input: ");
var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

rl.on("line",function(line){
	switch(line.trim()){
		case 'e':rl.close();
		default: {
			var result = new Calculator(line.trim().replace("ans",num));
			var answer = result.calculate();
			if(!result.error){
				console.log(" = " + answer);
				num = result.result;
			}
			result.error = false;	
			console.log("\nPlease input:");
		}		
	}
});

rl.on("close",function(){
	process.exit(0);
});