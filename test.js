'use strict'
var readline = require('readline');
var Calculator = require('./index.js');
var num = '';

//var expression = "-3+5*(12^4-4)-(-6)/2";

//var result = new Calculator(expression);
//console.log(result.calculate());
var rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

//rl.question("...",function(answer){
	
//	rl.close();
//});
rl.on("line",function(line){
	var result = new Calculator(line.trim());
	switch(line.trim()){
		case 'e':rl.close();
		default: 
			result.expression = line.trim().replace("ans",num);
			console.log(result.calculate());
			num = result.result;
	}
});

rl.on("close",function(){
	process.exit(0);
});