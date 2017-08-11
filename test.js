'use strict'
var Calculator = require('./index.js');

var expression = "-3+5*(1.2-4)-6/2";

var result = new Calculator(expression);
console.log(result.string2Array());
