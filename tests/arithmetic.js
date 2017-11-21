var Calculator = require('./../module/arithmetic');

describe('Testing function plus...', function(){
	it ('Should add two numbers', function(){
		var calc = new Calculator();

		var expRes = 4;
		var result = calc.plus(1, 3);
		if (result != expRes) {
			throw new Error('Expected ' + expRes + ', but got ' + result);
		}
	});
});

describe('Testing function minus...', function(){
	it ('Should substruct from the fisrst number the second', function(){
		var calc = new Calculator();

		var expRes = 3;
		var result = calc.minus(10, 7);
		if (result != expRes) {
			throw new Error('Expected ' + expRes + ', but got ' + result);
		}
	});
});

describe('Testing function multi...', function(){
	it ('Should multiply two numbers', function(){
		var calc = new Calculator();

		var expRes = 6;
		var result = calc.multi(3, 2);
		if (result != expRes) {
			throw new Error('Expected ' + expRes + ', but got ' + result);
		}
	});
});

