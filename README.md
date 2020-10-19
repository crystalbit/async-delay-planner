[![Build Status](https://travis-ci.org/crystalbit/async-delay-planner.svg?branch=master)](https://travis-ci.org/crystalbit/async-delay-planner) [![Coverage Status](https://coveralls.io/repos/github/crystalbit/async-delay-planner/badge.svg?branch=master)](https://coveralls.io/github/crystalbit/async-delay-planner?branch=master)

# async-delay-planner
A module for planning delays for a series of function runs

Version 2 now has breaking changes:
- no speedup as was in version 1;
- default threshold is Infinity, 0 isn't interpreted as "no threshold";
- if possible delay is over threshold, function hold promise rejects.

# aim
Imagine we have a function which is limited to have minimum intervals between each next run (e.g. API endpoint which can be touched max. 15 times a second, so the min. interval is 1/15 s).

We have an asynchronous function to fetch the API:
```js
async function f() {
  // some API fetching
}
```

The hypothetical project is complicated and the function has to be run from different places at unpredictable moments.

So:

# usage
The aim of the package is to let you add a delay before the function body so it will be executed after a computed timeout.

It is guaranteed that you will not go beyond the time limits between two runs of the function.

# installation
run `npm i async-delay-planner`

require:
```
const Planner = require('async-delay-planner');
```

# example
## 1) simple

Let's init the planner:
```js
const planner = new Planner(1000);
```

We told the planner we have no threshold and the interval is 1000 ms.

And modify the function:

```js
async function f() {
  await planner.hold();
  // some API fetching
}
```

If we run the function twice like `f(); f();`, the body of the first function runs immediately and the body of the second runs at least 1000 ms later.

If we have a third run – 2000 ms later and so on.

If the second run doesn't follow the first immediately, but for example after 200 ms, the second body will start after the least of the interval – 800 ms.

`hold()` just returns a Promise that resolves when time comes, so also feel free to use it without async/await.

## 2) with threshold
You define a threshold in ms. If the function has to be planned to run later than the threshold, the hold() function fails (the returned promise is rejected).

For example:
```js
const planner = new Planner(1000, 5000);
```

In this case if we run 10 functions one after another, they will execute:
* immediately,
* 1000 ms after the first,
* 2000 ms after the first,
* 3000 ms after the first,
* 4000 ms after the first,
* immediately fail,
* immediately fail,
* immediately fail,
* immediately fail,
* immediately fail.

# tests
Yes, there are tests for all the cases, you can take a look if you want examples.

Run:
```
npm test
```
