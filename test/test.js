'use strict'
const fs = require('fs');
var readline = require('readline');
var Calculator = require('../index.js');
var content = new Content();
//console.log(/^[_0-9a-zA-Z]+$/.test("9"));
//console.log(process.argv);
//console.log("Please input: ");
var rl = readline.createInterface({
	input:(process.argv.length > 2) ? fs.createReadStream(process.argv[2]) : process.stdin,
	output:process.stdout
});

rl.on("line",function(line){
	if(process.argv.length > 2){
		count(line);
	}else{
		switch(line.trim()){
		case 'e':rl.close();
		default: {
				var item = getContent(line);
				if(item != undefined){
					var expression = content.replaceTag(item.value);
					var result = new Calculator(expression);
					var answer = result.calculate();
					if(!result.error){
						console.log(">>>> " + item.key +" = " + answer);
						item.value = answer;
						content.addNewItem(item);
					}
					result.error = false;
				}
			}
			console.log("\nPlease input:");
		}
	}
});

rl.on("close",function(){
	process.exit(0);
});

function count(data){
	var expression = data;
	var result = new Calculator(expression);
	var answer = result.calculate();
	if(!result.error){
		console.log(" = " + answer);
	}
	result.error = false;
}

function getContent(line){
	var content = line.trim();
	var left = content.slice(0,content.indexOf('=')).trim();
	var right = content.slice(content.indexOf('=') + 1).trim();
	if(isValidTag(left)){
		return new Item(left, right);
	}
}

function isValidTag(tag){
	if(/^[0-9]+$/.test(tag[0])){
		console.log("Error: tag begin with '_' or 'a-z' or 'A-Z'!");
		return false;
	}
	if(tag.indexOf(" ") > 0){
		console.log("Error: invalid space!");
		return false;
	}
	if(tag == 'sin' || tag == 'cos' || tag == 'tan' || tag == 'ln' || tag == 'lg'){
		console.log("Error: tag is keyword!");
		return false;
	}
	if(/^[_0-9a-zA-Z]+$/.test(tag)){
		return true;
	}
}


function Item(key, value){
	this.key = key;
	this.value = value;
}

function Content(){
	this.wareHouse = new Array();
}
Content.prototype.addNewItem = function(item) {
	if(this.isExist(item.key)){
		this.setValueByKey(item.key, item.value);
	}
	else{
		this.wareHouse.push(item);
	}
};

Content.prototype.getValueByKey = function(key) {
	if(!this.isExist(key)){
		console.log("Error: "+key + " is not defined!");
	}
	for(var i = 0; i < this.wareHouse.length; i++){
		if(this.wareHouse[i].key == key){
			return this.wareHouse[i].value;
		}
	}
};

Content.prototype.isExist = function(key) {
	for(var i = 0; i < this.wareHouse.length; i++){
		if(this.wareHouse[i].key == key){
			return true;
		}
	}
	return false;
};

Content.prototype.setValueByKey = function(key, value) {
	if(!this.isExist(key)){
		console.log(key + " is not defined!");
	}
	for(var i = 0; i < this.wareHouse.length; i++){
		if(this.wareHouse[i].key == key){
			this.wareHouse[i].value = value;
		}
	}
};

Content.prototype.replaceTag = function(expression) {
	//console.log("1" + expression);
	var newExpression = expression;
	for(var i = 0; i < this.wareHouse.length; i++){
		//console.log(this.wareHouse[i]);
		if(newExpression.indexOf(this.wareHouse[i].key)
			&& this.wareHouse[i].value.length == 0){
			console.log("Error: "+this.wareHouse[i].key +" is undefined");
		}else{
				newExpression = newExpression.replace(this.wareHouse[i].key, this.wareHouse[i].value);
		}
	}
	return newExpression;
};
