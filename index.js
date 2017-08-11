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
Calculator.prototype.string2Array = function() {
	this.isValid();
	var arr = new Array();
	arr.push(LEFT_BRACKET);
	for(var i = 0; i < this.expression.length; i++){
		if(this.isOperator(this.expression[i]) || this.isBracket(this.expression[i])){
			if(this.expression[i] == OPERATOR_SUB && arr[arr.length - 1] == LEFT_BRACKET){
				arr.push("0");
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
	arr.push(RIGHT_BRACKET);
	return arr;
};
