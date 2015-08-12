'use strict';

/**
 * GENSY
 * Asynchronous utils focused on generators
 *
 * Copyright (c) 2013- Sergio García <sgmonda@gmail.com>
 * Distributed under MIT License
 **/

/**
 * Runs a generator function as follows: function* (next, end) {...}
 * Where "next" is the callback must be passed to every async function called
 * from the generator to run. "end" is an optional callback to be called once
 * the generator has finished.
 */
var gensy = function (generator, callback) {
	function next(error, result) {
		if (error) return x.throw(error);
		x.next(result);
	}
	function done(error, result) {
		if (callback) callback(error, result);
	}
	var x = generator(next, done);
	x.next();
};

/**
 * Runs a list of generators in order, one by one.
 */
gensy.series = function (generators, callback) {
	function runNext() {
		var g = generators.shift();
		if (!g) {
			return callback();
		}
		gensy(g, runNext);
	}
	runNext();
};

/**
 * Export GENSY
 */
module.exports = gensy;
