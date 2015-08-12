'use strict';

var gensy = require('./main.js');
var count = 0;

setInterval(function () {
	console.log('alive');
}, 1000);

function foo(callback) {
	setTimeout(function () {
		if (++count == 2) {
			return callback('second must crash');
		}
		callback(null, 'hello');
	}, 1000);
}

function* gen1(next, end) {
	console.log('1a');
	var x = yield foo(next);
	console.log('1b', x);
	return end(null, 1);
}

function* gen2(next, end) {
	try {
		console.log('2a');
		var x = yield foo(next);
		console.log('2b', x);
		return end(null, 2);
	} catch (error) {
		console.log('handled error:', error);
	}
}

function* gen3(next, end) {
	console.log('3a');
	var x = yield foo(next);
	console.log('3b', x);
	return end(null, 3);
}

gensy(gen1, function () {
	console.log('single run finished');
	count = 0;
	gensy.series([gen1, gen2, gen3], function (error, result) {
		console.log('series run end', error, result);
	});
});
