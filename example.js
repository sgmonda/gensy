'use strict';

var gensy = require('./main.js');

function foo(callback) {
	setTimeout(function () {
		callback(null, 'hello');
	}, 1000);
}

function* gen1(next, end) {
	try {
		console.log('1a');
		var x = yield foo(next);
		console.log('1b', x);
		x = yield foo(next);
		console.log('1c', x);
		return end();
	} catch (err) {
		console.warn('error occurred:', err);
	}
}

function* gen2(next, end) {
	try {
		console.log('2a');
		var x = yield foo(next);
		console.log('2b', x);
		return end();
	} catch (err) {
		console.warn('error occurred:', err);
	}
}

gensy(gen1, function () {
	console.log('single run finished');

	gensy.series([gen1, gen2], function () {
		console.log('series run end');
	});
});
