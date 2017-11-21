function Calculator() {
}

Calculator.prototype.plus = function(one, two){
	return one + two;
}

Calculator.prototype.minus = function(one, two){
	return one - two;
}

Calculator.prototype.multi = function(one, two){
	return one * two;
}

module.exports = Calculator;