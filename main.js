'use strict';

/**
 * GENSY
 * Asynchronous utils focused on generators
 *
 * Copyright (c) 2013- Sergio García <sgmonda@gmail.com>
 * Distributed under MIT License
 **/

// Utils

function isGenerator(fn) {
	return fn.constructor.name === 'GeneratorFunction' || typeof fn.next == 'function';
}

/**
 * Runs a generator function as follows: function* (next, end) {...}
 * Where "next" is the callback must be passed to every async function called
 * from the generator to run. "end" is an optional callback to be called once
 * the generator has finished.
 */
var gensy = function (generator, callback) {
	function next(error, result) {
		setImmediate(function () {
			if (error) {
				x.throw(error);
				if (callback) {
					callback(error);
				}
				return;
			}
			x.next(result);
		});
	}
	function done(error, result) {
		if (callback) {
			setImmediate(function () {
				callback(error, result);
			});
		}
	}
	var x = generator(next, done);
	x.next();
};

/**
 * Runs a list of generators in order, one by one.
 */
gensy.series = function (generators, callback) {
	var results = [];
	function runNext() {
		var g = generators.shift();
		if (!g) {
			return callback(null, results);
		}
		gensy(g, function (error, result) {
			if (error) {
				return callback(error);
			}
			results.push(result);
			return runNext();
		});
	}
	runNext();
};

/**
* Preprocess callback functions passed as arguments, to support generators.
* If a generator is passed instead of a callback, then a wrapper callback is
* created.
*/
gensy.callback = function (callback) {
	if (!isGenerator(callback)) {
		return callback;
	}
	var generator = callback;
	return function (error, data) {
		if (error) {
			return setImmediate(function () {
				generator.throw(error);
			});
		}
		setImmediate(function () {
			return generator.next(data);
		});
	};
};

/**
 * Export GENSY
 */
module.exports = gensy;
