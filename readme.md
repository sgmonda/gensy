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
function foo (callback) {
	...
	return callback(error, result);
}
```
If an error is returned by `foo`, then generator's `catch` block will be executed.

This usage supports a callback to listen generator end. To use it the generator must call `done()` (a second argument) when finished:

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

gensy(genA);
```

### Support both, callbacks and generators

In order to use a simple function from a generator, it has to accept an argument where the `next` generator is passed.
This is a problem if that functions are used elsewhere but receiving a callback instead of a generator, and we want to keep that compatibility.

Gensy can be used then to preprocess the callback, so generators can be passed, too:

```javascript
function passMeCallbacksOrGenerators (thing) {
	callback = gensy.callback(thing);
	// ... Do some async work
	callback(error, result);
}
```

The previous code ensures that received `callback` can be both a function or a generator. The transformation allows us to use it as a simple callback, where the first argument is the error, and the second one is the returning data. It is important to keep this convention. If an error occurs and we call `callback(error)`, then our caller generator will fall in the `catch` statement, receiving it.

So now, this function can be used passing both, generators or traditional callbacks:

```javascript
passMeCallbacksOrGenerators(function (error, result) {
	// I'm a traditional callback
});
gensy(function* (next) {
	try {
		var x = yield passMeCallbacksOrGenerators(next);
		// I'm a generator, with yield statements
	} catch (error) {...}
});
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
