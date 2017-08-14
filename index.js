'use strict'
module.exports = Calculator;
const LEFT_BRACKET = "(";
const RIGHT_BRACKET = ")";
const OPERATOR_ADD = "+";
const OPERATOR_SUB = "-";
const OPERATOR_MUL = "*";
const OPERATOR_DIV = "/";
const OPERATOR_POW = "^";

function Calculator(arithm_expression){
	this.expression = arithm_expression || null;
	this.result = null;
}
Calculator.prototype.isOperator = function(data) {
	switch(data){
		case OPERATOR_ADD:
			return true;
		case OPERATOR_SUB:
			return true;
		case OPERATOR_MUL:
			return true;
		case OPERATOR_DIV:
			return true;
		case OPERATOR_POW:
			return true;
	}
	return false;
};
Calculator.prototype.isBracket = function(data) {
	switch(data){
		case LEFT_BRACKET:
			return true;
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
			ret = 2;
			break;
		case OPERATOR_POW:
			ret = 3;
			break;	
	}
	return ret;
};

Calculator.prototype.isGreat = function(op1, op2) {
	if(this.getPriority(op1) < 0 || this.getPriority(op2) < 0){
		throw new Error("unexpected operator.");
	}
	if(this.getPriority(op1) > this.getPriority(op2)){
		return true;
	}
	else{
		return false;
	}
};
Calculator.prototype.isValid = function() {
	if(this.expression == null){
		throw new Error("Can not find content!");
	}
	var num = 0;
	for(var i = 0; i < this.expression.length; i++){
		if(i > 0 && i < this.expression.length - 1){
			if(this.isOperator(this.expression[i]) && this.isOperator(this.expression[i-1])){
				throw new Error("Expression error: " + this.expression[i]  + " is invalid.");
			}
		}
		if(i == this.expression.length - 1 && this.isOperator(this.expression[i])){
			throw new Error("Expression error: " + this.expression[i]  + " is invalid.");
		}
		if(this.expression[i] == LEFT_BRACKET){
			num++;
		}
		if(this.expression[i] == RIGHT_BRACKET){
			num--;
		}
		if(num < 0){
			throw new Error("Expression error: missing '('.");
		}
	}
	if(num > 0){
		throw new Error("Expression error: missing ')'.");
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
		}else{
			if(this.isOperator(arr[arr.length - 1]) || this.isBracket(arr[arr.length - 1])){
				arr.push(this.expression[i]);
			}else{
				arr[arr.length - 1] += this.expression[i];
			}
		}
	}
	for(var i = 0; i < arr.length; i++){
		if(!this.isOperator(arr[i]) && !this.isBracket(arr[i])){
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
		if(typeof(expression[i]) == "number"){
			rpnQueuelist.push(expression[i]);
		}
		else{
			if(opStack.length == 0 || expression[i] == LEFT_BRACKET){
				opStack.push(expression[i].slice());
			}
			else if(expression[i] == RIGHT_BRACKET){
				while(opStack[opStack.length - 1] != LEFT_BRACKET){
					rpnQueuelist.push(opStack.pop());
				}
				opStack.pop();
			}
			else if(this.isOperator(expression[i])){
				while(opStack.length != 0){	
					if(opStack[opStack.length - 1] == LEFT_BRACKET ||
					    this.isGreat(expression[i],opStack[opStack.length - 1])){
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
	return rpnQueuelist;
};

Calculator.prototype.calculate = function() {
	var rpnQueuelist = this.getReversePolish();
	var tempStack = new Array();
	for(var i = 0; i < rpnQueuelist.length; i++){
		if(typeof(rpnQueuelist[i]) == "number"){
			tempStack.push(rpnQueuelist[i]);
		}
		else{
			var num1 = tempStack.pop();
			var num2 = tempStack.pop();
			tempStack.push(Count(num2,num1,rpnQueuelist[i]));
		}
	}
	return tempStack[0];
};

function Count(num1, num2, operator){
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


