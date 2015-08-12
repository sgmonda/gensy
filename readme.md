# GENSY

Asynchronous utils for Node.js/IO.js focused on generators.

## 1. Installation

Just run the following:

```
npm install gensy
```

Remember to add `gensy` as a dependency in your `package.json` file:

```
"dependencies": {
	...
	"gensy": "*"
	...
}
```

## 2. Usage

### Simple generator

If you just want to run a generator to run some asynchronous code as if it were synchronous (by mean of the `yield` statement), just call `gensy` as follows:

```javascript
var gensy = require('gensy');

gensy(function* (next) {
	try {
		...
		var x = yield foo(next);
		...
	} catch (error) {
		console.warn('Error:', error);
	}
});
```
Where `foo` is supposed to be an asynchronous function that uses `next` as a callback following the error+result arguments convention:

```javascript
function foo(callback) {
	...
	return callback(error, result);
}
```
If an error is returned by `foo`, then generator's `catch` block will be executed.

This usage supports a callback to listen generator end. To use it the generator must call `done()` (a second argument) when finished:

```javascript
var gensy = require('gensy');

function* genA(next, done) {
	try {
		var x = yield foo(next);
		...
		return done();
	} catch (error) {
		console.warn('Error:', error);
	}
}

gensy(genA);
```

### Generator series

To run a list of generators, one by one, use `gensy.series()` as follows:

```javascript
var gensy = require('gensy');

function* genA (next, done) {
	try {
		var x = yield foo(next);
		...
		return done();
	} catch (error) {
		console.warn('Error:', error);
	}
}

function* genB (next, done) {
	try {
		var x = yield foo(next);
		...
		return done();
	} catch (error) {
		console.warn('Error:', error);
	}
}

gensy.series([genA, genB], function () {
	console.log('Series ended');
});
```
