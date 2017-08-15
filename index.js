'use strict'
module.exports = Calculator;

const LEFT_BRACKET = "(";
const RIGHT_BRACKET = ")";
const OPERATOR_ADD = "+";
const OPERATOR_SUB = "-";
const OPERATOR_MUL = "*";
const OPERATOR_DIV = "/";
const OPERATOR_POW = "^";
const OPERATOR_SIN = "sin";
const OPERATOR_COS = "cos";
const OPERATOR_TAN = "tan";
const OPERATOR_LN = "ln";
const OPERATOR_LG = "lg";
//const OPERATOR_LOG = "log";


function Calculator(arithm_expression){
	this.expression = arithm_expression || null;
	this.result = '';
	this.error = false;
}
Calculator.prototype.isOperator = function(data) {
	switch(data){
		case OPERATOR_ADD:
		case OPERATOR_SUB:
		case OPERATOR_MUL:
		case OPERATOR_DIV:
		case OPERATOR_POW:
			return true;
	}
	return false;
};
Calculator.prototype.isUnaryOperator = function(data) {
	switch(data){
		case OPERATOR_SIN:
		case OPERATOR_COS:
		case OPERATOR_TAN:
		case OPERATOR_LN:
		case OPERATOR_LG:
			return true;
	}
	return false;
};
Calculator.prototype.isBracket = function(data) {
	switch(data){
		case LEFT_BRACKET:
		case RIGHT_BRACKET:
			return true;
	}
	return false;
};

Calculator.prototype.getPriority = function(data) {
	var ret = -1;
	switch(data){
		case OPERATOR_ADD:
		case OPERATOR_SUB:
			ret = 1;
			break;
		case OPERATOR_MUL:
		case OPERATOR_DIV:
		case OPERATOR_SIN:
		case OPERATOR_COS:
		case OPERATOR_TAN:
		case OPERATOR_LN:
		case OPERATOR_LG:
			ret = 2;
			break;
		case OPERATOR_POW:
			ret = 3;
			break;	
	}
	return ret;
};

Calculator.prototype.isGreat = function(op1, op2) {
	//if(this.getPriority(op1) < 0 || this.getPriority(op2) < 0){
	//	throw new Error("222");
	//}
	//if(this.getPriority(op1) > this.getPriority(op2)){
	return this.getPriority(op1) - this.getPriority(op2);
	//}
};
Calculator.prototype.isValid = function() {
	var num = 0;
	for(var i = 0; i < this.expression.length; i++){
		if(i > 0 && i < this.expression.length - 1){
			if(this.isOperator(this.expression[i]) &&
				 (this.isOperator(this.expression[i-1]) 
				|| this.isUnaryOperator(this.expression[i-1]))){
				markError(this.expression, i);
				console.log("Error: '" + this.expression[i]  + "' is invalid.");
				this.error = true;
			}
		}
		if(i == this.expression.length - 1 && 
			(this.isOperator(this.expression[i]) 
			|| this.isUnaryOperator(this.expression[i]))){
			markError(this.expression, i);
			console.log("Error: '" + this.expression[i]  + "' is invalid.");
			this.error = true;
		}
		if(this.expression[i] == LEFT_BRACKET){
			num++;
		}
		if(this.expression[i] == RIGHT_BRACKET){
			num--;
		}
		if(num < 0){
			markError(this.expression, i);
			console.log("Error: missing '('!");
			this.error = true;
		}
	}
	if(num > 0){
		markError(this.expression, this.expression.length - 1);
		console.log("Error: missing ')'!");
		this.error = true;
	}
};
Calculator.prototype.getExpression = function() {
	this.isValid();
	var arr = new Array();
	arr.push(LEFT_BRACKET);
	for(var i = 0; i < this.expression.length; i++){
		if(this.isOperator(this.expression[i]) || this.isBracket(this.expression[i])){
			if(this.expression[i] == OPERATOR_SUB && arr[arr.length - 1] == LEFT_BRACKET){
				arr.push(0);
			}
			arr.push(this.expression[i]);
		}
		else if(/^[a-z]+$/.test(this.expression[i])){
			if(/^[a-z]+$/.test(arr[arr.length - 1])){
				arr[arr.length - 1] += this.expression[i];
			}else{
				arr.push(this.expression[i]);
			}
		}
		else{
			if(this.isOperator(arr[arr.length - 1]) 
				|| this.isBracket(arr[arr.length - 1])
				|| this.isUnaryOperator(arr[arr.length - 1])){
				arr.push(this.expression[i]);
			}else{
				arr[arr.length - 1] += this.expression[i];
			}
		}
	}
	for(var i = 0; i < arr.length; i++){
		if(!this.isOperator(arr[i]) 
			&& !this.isBracket(arr[i]) 
			&& !this.isUnaryOperator(arr[i])){
			arr[i] = parseFloat(arr[i]);
		}
	}
	arr.push(RIGHT_BRACKET);
	return arr;
};
Calculator.prototype.getReversePolish = function() {
	var expression = this.getExpression();
	var opStack = new Array();
	var rpnQueuelist = new Array();
	for(var i = 0; i < expression.length; i++){
		//console.log(i+"-----"  + expression[i]);
		if(typeof(expression[i]) == "number"){
			rpnQueuelist.push(expression[i]);
		}
		else{
			if(opStack.length == 0 || expression[i] == LEFT_BRACKET){
				opStack.push(expression[i]);
			}
			else if(expression[i] == RIGHT_BRACKET){
				while(opStack[opStack.length - 1] != LEFT_BRACKET){
					rpnQueuelist.push(opStack.pop());
				}
				opStack.pop();
			}
			else if(this.isOperator(expression[i]) || this.isUnaryOperator(expression[i])){
				while(opStack.length != 0){	
					if(opStack[opStack.length - 1] == LEFT_BRACKET 
						|| this.isGreat(expression[i],opStack[opStack.length - 1]) > 0){
						opStack.push(expression[i]);
						break;
					}
					else if(this.isGreat(expression[i],opStack[opStack.length - 1]) == 0 
						&& this.isUnaryOperator(expression[i])){
						opStack.push(expression[i]);
						break;
					}
					else{
						rpnQueuelist.push(opStack.pop());
					}
				}
			}
		}
	}
	console.log(rpnQueuelist);
	return rpnQueuelist;
};

Calculator.prototype.calculate = function() {
	var rpnQueuelist = this.getReversePolish();
	var tempStack = new Array();
	for(var i = 0; i < rpnQueuelist.length; i++){
		if(typeof(rpnQueuelist[i]) == "number"){
			tempStack.push(rpnQueuelist[i]);
		}
		else if(this.isOperator(rpnQueuelist[i])){
			var num1 = tempStack.pop();
			var num2 = tempStack.pop();
			tempStack.push(BinocularCount(num2,num1,rpnQueuelist[i]));
		}
		else{
			var num = tempStack.pop();
			tempStack.push(UnaryCount(num,rpnQueuelist[i]));
		}
	}
	this.result = tempStack[0];
	return tempStack[0];
};

function BinocularCount(num1, num2, operator){
	switch(operator){
		case OPERATOR_ADD:
			return (num1 + num2);
		case OPERATOR_SUB:
			return (num1 - num2);
		case OPERATOR_MUL:
			return (num1 * num2);
		case OPERATOR_DIV:
			return (num1 / num2);
		case OPERATOR_POW:
			return Math.pow(num1,num2);
	}
	return false;
}

function UnaryCount(num, operator){
	switch(operator){
		case OPERATOR_SIN:
			return Math.sin(num/180*Math.PI);
		case OPERATOR_COS:
			return Math.cos(num/180*Math.PI);
		case OPERATOR_TAN:
			return Math.tan(num/180*Math.PI);
		case OPERATOR_LN:
			return Math.log(num);
		case OPERATOR_LG:
			return Math.log(num)/Math.log(10);
	}
}

function markError(expression, errorPos){
	console.log(expression);
	var arr = new Array();
	for(var i = 0; i < expression.length; i++){
		if(i == errorPos){
			arr[i] = "^";
			break;
		}
		arr[i] = " ";	
	}
	console.log(arr.join(""));
}


