(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["portfolio-portfolio-module"],{

/***/ "./node_modules/q/q.js":
/*!*****************************!*\
  !*** ./node_modules/q/q.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (true) {
        module.exports = definition();

    // RequireJS
    } else { var previousQ, global; }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});


/***/ }),

/***/ "./src/app/portfolio/add-portfolio/add-portfolio.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/portfolio/add-portfolio/add-portfolio.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".card {\r\n    background-color: rgba(0, 0, 0, 0.507);\r\n  }\r\n\r\n  h6 {\r\n    line-height: 1.7;\r\n  }\r\n\r\n  .custom-file{\r\n    text-align: left;\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9ydGZvbGlvL2FkZC1wb3J0Zm9saW8vYWRkLXBvcnRmb2xpby5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksc0NBQXNDO0VBQ3hDOztFQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCIiwiZmlsZSI6InNyYy9hcHAvcG9ydGZvbGlvL2FkZC1wb3J0Zm9saW8vYWRkLXBvcnRmb2xpby5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNhcmQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUwNyk7XHJcbiAgfVxyXG5cclxuICBoNiB7XHJcbiAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gIH1cclxuXHJcbiAgLmN1c3RvbS1maWxle1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICB9Il19 */"

/***/ }),

/***/ "./src/app/portfolio/add-portfolio/add-portfolio.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/portfolio/add-portfolio/add-portfolio.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row mt-5\">\n  <div class=\"col-md-6 col-xl-5 mb-4 mx-auto\">\n    <!--Form-->\n    <div class=\"card\">\n      <div class=\"card-body\">\n        <!--Header-->\n        <div class=\"text-center\">\n          <h3 class=\"white-text\">\n            Add portfolio:\n          </h3>\n          <hr class=\"hr-light\" />\n        </div>\n        <!--form starts here!!-->\n\n        <div class=\"alert alert-danger mr-sm-2\" *ngIf=\"errorMsg\">\n          {{ errorMsg }}\n        </div>\n\n        <form [formGroup]=\"portfolio\" (ngSubmit)=\"onSubmit()\">\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">\n                <mat-icon>person</mat-icon>\n              </span>\n            </div>\n            <input\n              type=\"text\"\n              class=\"form-control mr-sm-2\"\n              placeholder=\"Name\"\n              aria-label=\"Name\"\n              aria-describedby=\"basic-addon1\"\n              formControlName=\"pName\"\n              [ngClass]=\"fieldClass('pName')\"\n            />\n            <div class=\"invalid-feedback\" *ngIf=\"isValid('pName')\">\n              name {{ getErrorMessage(portfolio.get(\"pName\").errors) }}\n            </div>\n          </div>\n          <br />\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">\n                <mat-icon>description</mat-icon>\n              </span>\n            </div>\n            <textarea\n              class=\"form-control mr-sm-2\"\n              rows=\"5\"\n              id=\"comment\"\n              placeholder=\"About Me\"\n              aria-label=\"About Me\"\n              aria-describedby=\"basic-addon1\"\n              formControlName=\"description\"\n              [ngClass]=\"fieldClass('description')\"\n            ></textarea>\n            <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n              description\n              {{ getErrorMessage(portfolio.get(\"description\").errors) }}\n            </div>\n          </div>\n\n          <br />\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">\n                <mat-icon>attach_file</mat-icon>\n              </span>\n            </div>\n            <div class=\"custom-file\">\n              <input\n                type=\"file\"\n                class=\"form-control-file custom-file-input mr-sm-2\"\n                id=\"inputGroupFile01\"\n                aria-describedby=\"inputGroupFileAddon01\"\n                #fileInput\n                (change)=\"preUpload($event)\"\n                placeholder=\"image\"\n                aria-label=\"image\"\n                formControlName=\"picturePath\"\n                [ngClass]=\"fieldClass('picturePath')\"\n              />\n              <label\n                class=\"custom-file-label\"\n                for=\"inputGroupFile01\"\n                *ngIf=\"!isFileChosen\"\n                >Choose Image</label\n              >\n              <label\n                class=\"custom-file-label\"\n                for=\"inputGroupFile01\"\n                *ngIf=\"isFileChosen\"\n                >{{ fileName }}</label\n              >\n            </div>\n            <div class=\"invalid-feedback\" *ngIf=\"isValid('picturePath')\">\n              {{ getErrorMessage(portfolio.get(\"picturePath\").errors) }}\n            </div>\n          </div>\n          <br />\n\n          <div class=\"input-group\">\n            <div class=\"input-group-prepend\">\n              <span class=\"input-group-text\" id=\"basic-addon1\">\n                <mat-icon>attach_file</mat-icon>\n              </span>\n            </div>\n            <div class=\"custom-file\">\n              <input\n                type=\"file\"\n                class=\"form-control-file custom-file-input mr-sm-2\"\n                id=\"inputGroupFile02\"\n                aria-describedby=\"inputGroupFileAddon02\"\n                placeholder=\"resume\"\n                aria-label=\"resume\"\n                formControlName=\"resumePath\"\n                [ngClass]=\"fieldClass('resumePath')\"\n                #fileInput\n                (change)=\"preUpload2($event)\"\n              />\n              <label\n                class=\"custom-file-label\"\n                for=\"inputGroupFile02\"\n                *ngIf=\"!isFileChosen2\"\n                >Choose PDF</label\n              >\n              <label\n                class=\"custom-file-label\"\n                for=\"inputGroupFile02\"\n                *ngIf=\"isFileChosen2\"\n                >{{ fileName2 }}</label\n              >\n            </div>\n\n            <div class=\"invalid-feedback\" *ngIf=\"isValid('resumePath')\">\n              {{ getErrorMessage(portfolio.get(\"resumePath\").errors) }}\n            </div>\n\n          </div>\n\n          <div class=\"text-center mt-4\">\n            <button\n              type=\"submit\"\n              class=\"btn btn-outline-light \"\n              [disabled]=\"portfolio.invalid\"\n            >\n              Save\n            </button>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/portfolio/add-portfolio/add-portfolio.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/portfolio/add-portfolio/add-portfolio.component.ts ***!
  \********************************************************************/
/*! exports provided: AddPortfolioComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddPortfolioComponent", function() { return AddPortfolioComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../user/authentication.service */ "./src/app/user/authentication.service.ts");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! q */ "./node_modules/q/q.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(q__WEBPACK_IMPORTED_MODULE_6__);







var AddPortfolioComponent = /** @class */ (function () {
    function AddPortfolioComponent(router, fb, _portfolioDataService, _authenticationService) {
        this.router = router;
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
        this._authenticationService = _authenticationService;
        this.loggedInUser$ = this._authenticationService.user$;
    }
    AddPortfolioComponent.prototype.ngOnInit = function () {
        var reg = '[^.]+\.(jpg|jpeg|gif|tiff|bmp|png)';
        var regP = '[^.]+\.(pdf)';
        this.portfolio = this.fb.group({
            pName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            picturePath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            resumePath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(regP)]]
        });
    };
    AddPortfolioComponent.prototype.onSubmit = function () {
        var _this = this;
        this._portfolioDataService
            .addNewPortfolio(this.loggedInUser$.value, {
            name: this.portfolio.value.pName,
            description: this.portfolio.value.description
        })
            .subscribe(function (err) {
            console.log(err);
            if (err.error instanceof Error) {
                _this.errorMsg = "Error while trying to add portfolio " + _this.portfolio.value.pName + ": " + err.error.message;
            }
            else {
                _this.errorMsg = "Error " + err.status + " while trying to add portfolio " + _this.portfolio.value.pName + ": " + err.error;
            }
        });
        Object(q__WEBPACK_IMPORTED_MODULE_6__["delay"])(500);
        var uploadImage = new FormData();
        uploadImage.append('file', this.Image, this.Image.name);
        var uploadResume = new FormData();
        uploadResume.append('file', this.Resume, this.Resume.name);
        this._portfolioDataService.postImage(uploadImage)
            .subscribe(function (err) {
            console.log(err);
            if (err.error instanceof Error) {
                _this.errorMsg = "Error while trying to add Image: " + err.error.message;
            }
            else {
                _this.errorMsg = "Error " + err.status + " while trying to add Image: " + err.error;
            }
        });
        this._portfolioDataService.postResume(uploadResume)
            .subscribe(function (val) {
            if (val) {
                if (_this._portfolioDataService.redirectUrl) {
                    _this.router.navigateByUrl(_this._portfolioDataService.redirectUrl);
                    _this._portfolioDataService.redirectUrl = undefined;
                }
                else {
                    _this.router
                        .navigateByUrl('/RefreshComponent', {
                        skipLocationChange: true
                    })
                        .then(function () {
                        return _this.router.navigate(['/portfolio/main-portfolio']);
                    });
                }
            }
            else {
                _this.errorMsg = "Could not add Resume";
            }
        }, function (err) {
            console.log(err);
            if (err.error instanceof Error) {
                _this.errorMsg = "Error while trying to add Resume: " + err.error.message;
            }
            else {
                _this.errorMsg = "Error " + err.status + " while trying to add Resume: " + err.error;
            }
        });
    };
    AddPortfolioComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide a valid file";
        }
    };
    AddPortfolioComponent.prototype.isValid = function (field) {
        var input = this.portfolio.get(field);
        return input.dirty && input.invalid;
    };
    AddPortfolioComponent.prototype.fieldClass = function (field) {
        return { 'is-invalid': this.isValid(field) };
    };
    AddPortfolioComponent.prototype.preUpload = function (event) {
        this.Image = event.target.files[0];
        if (event.target.files.length > 0) {
            this.isFileChosen = true;
        }
        this.fileName = this.Image.name;
    };
    AddPortfolioComponent.prototype.preUpload2 = function (event) {
        this.Resume = event.target.files[0];
        if (event.target.files.length > 0) {
            this.isFileChosen2 = true;
        }
        this.fileName2 = this.Resume.name;
    };
    AddPortfolioComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-add-portfolio',
            template: __webpack_require__(/*! ./add-portfolio.component.html */ "./src/app/portfolio/add-portfolio/add-portfolio.component.html"),
            styles: [__webpack_require__(/*! ./add-portfolio.component.css */ "./src/app/portfolio/add-portfolio/add-portfolio.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _portfolio_data_service__WEBPACK_IMPORTED_MODULE_5__["PortfolioDataService"],
            _user_authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]])
    ], AddPortfolioComponent);
    return AddPortfolioComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/main-portfolio/main-portfolio.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/portfolio/main-portfolio/main-portfolio.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".error-template {padding: 40px 15px;text-align: center;}\r\n.error-actions {margin-top:15px;margin-bottom:15px;}\r\n.error-actions .btn { margin-right:10px; }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9ydGZvbGlvL21haW4tcG9ydGZvbGlvL21haW4tcG9ydGZvbGlvLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUJBQWlCLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDO0FBQ3ZELGdCQUFnQixlQUFlLENBQUMsa0JBQWtCLENBQUM7QUFDbkQsc0JBQXNCLGlCQUFpQixFQUFFIiwiZmlsZSI6InNyYy9hcHAvcG9ydGZvbGlvL21haW4tcG9ydGZvbGlvL21haW4tcG9ydGZvbGlvLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZXJyb3ItdGVtcGxhdGUge3BhZGRpbmc6IDQwcHggMTVweDt0ZXh0LWFsaWduOiBjZW50ZXI7fVxyXG4uZXJyb3ItYWN0aW9ucyB7bWFyZ2luLXRvcDoxNXB4O21hcmdpbi1ib3R0b206MTVweDt9XHJcbi5lcnJvci1hY3Rpb25zIC5idG4geyBtYXJnaW4tcmlnaHQ6MTBweDsgfSJdfQ== */"

/***/ }),

/***/ "./src/app/portfolio/main-portfolio/main-portfolio.component.html":
/*!************************************************************************!*\
  !*** ./src/app/portfolio/main-portfolio/main-portfolio.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"portfolio$ | async as portfolio; else firstTime\">\n  <app-view-by-user [id]=\"portfolio.id\" [portfolio$]=\"portfolio$\"></app-view-by-user>\n</div>\n\n<ng-template #firstTime>\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"error-template\">\n          <h1>\n            Welcome!\n          </h1>\n          <h2>\n            Here you can make your first Portfolio!\n          </h2>\n          <div class=\"error-details\">\n            <!--Sorry, it looks like you do not have a portfolio yet, would you like to make one?-->\n            Would you like to create one now?\n          </div>\n          <div class=\"error-actions\">\n            <a\n              href=\"#\"\n              class=\"btn btn-outline-dark mr-sm-2\"\n              data-toggle=\"collapse\"\n              data-target=\"#collapseExample\"\n            >\n              Make my Portfolio!\n            </a>\n          </div>\n          <div class=\"collapse\" id=\"collapseExample\">\n            <app-add-portfolio></app-add-portfolio>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/portfolio/main-portfolio/main-portfolio.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/portfolio/main-portfolio/main-portfolio.component.ts ***!
  \**********************************************************************/
/*! exports provided: MainPortfolioComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPortfolioComponent", function() { return MainPortfolioComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");



var MainPortfolioComponent = /** @class */ (function () {
    function MainPortfolioComponent(_portfolioDataService) {
        this._portfolioDataService = _portfolioDataService;
    }
    MainPortfolioComponent.prototype.ngOnInit = function () {
        this.portfolio$ = this._portfolioDataService.getPortfolioByUser$();
    };
    MainPortfolioComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main-portfolio',
            template: __webpack_require__(/*! ./main-portfolio.component.html */ "./src/app/portfolio/main-portfolio/main-portfolio.component.html"),
            styles: [__webpack_require__(/*! ./main-portfolio.component.css */ "./src/app/portfolio/main-portfolio/main-portfolio.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_portfolio_data_service__WEBPACK_IMPORTED_MODULE_2__["PortfolioDataService"]])
    ], MainPortfolioComponent);
    return MainPortfolioComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/portfolio-data.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/portfolio/portfolio-data.service.ts ***!
  \*****************************************************/
/*! exports provided: PortfolioDataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortfolioDataService", function() { return PortfolioDataService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/environments/environment */ "./src/environments/environment.ts");






var PortfolioDataService = /** @class */ (function () {
    function PortfolioDataService(http) {
        this.http = http;
        this.loadingError$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this._tokenKey = 'currentUser';
        this.token = localStorage.getItem(this._tokenKey);
    }
    Object.defineProperty(PortfolioDataService.prototype, "portfolios$", {
        get: function () {
            var _this = this;
            return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
                _this.loadingError$.next(error.statusText);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
            }));
        },
        enumerable: true,
        configurable: true
    });
    // gebruik dit voor contact?
    PortfolioDataService.prototype.putPortfolio = function (id, portfolio) {
        return this.http
            .put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + id + "/", portfolio);
    };
    PortfolioDataService.prototype.deletePortfolio = function (id) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + id).subscribe();
    };
    PortfolioDataService.prototype.addNewPortfolio = function (email, portfolio) {
        return this.http
            .post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/", portfolio);
    };
    PortfolioDataService.prototype.getPortfolio$ = function (id) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getPortfolioByUser$ = function () {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/byUser")
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    // Image & Resume stuff
    PortfolioDataService.prototype.postImage = function (uploadData) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/image", uploadData);
    };
    PortfolioDataService.prototype.postResume = function (uploadData) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/resume", uploadData, {
            reportProgress: true,
            observe: 'events'
        });
    };
    PortfolioDataService.prototype.getImage = function (id) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/image/" + id, { responseType: 'blob' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getResume = function (id) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/resume/" + id, { responseType: 'blob' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.deleteImage = function () {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/image");
    };
    PortfolioDataService.prototype.deleteResume = function () {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/resume");
    };
    // POST PORTFOLIO DETAILS
    PortfolioDataService.prototype.postContact = function (pid, contact) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/contact", contact);
    };
    PortfolioDataService.prototype.postExperience = function (pid, experience) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/experiences", experience);
    };
    PortfolioDataService.prototype.postEducation = function (pid, education) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/educations", education);
    };
    PortfolioDataService.prototype.postWork = function (pid, work) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/works", work);
    };
    PortfolioDataService.prototype.postSkill = function (pid, skill) {
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/skills", skill);
    };
    // DELETE PORTFOLIO DETAILS
    PortfolioDataService.prototype.deleteContact = function (pid, cid) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/contact/" + cid).subscribe();
    };
    PortfolioDataService.prototype.deleteExperience = function (pid, eid) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/experiences/" + eid).subscribe();
    };
    PortfolioDataService.prototype.deleteEducation = function (pid, eid) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/educations/" + eid).subscribe();
    };
    PortfolioDataService.prototype.deleteWork = function (pid, wid) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/works/" + wid).subscribe();
    };
    PortfolioDataService.prototype.deleteSkill = function (pid, sid) {
        return this.http.delete(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/skills/" + sid).subscribe();
    };
    // PUT PORTFOLIO DETAILS
    PortfolioDataService.prototype.putContact = function (pid, contact, cid) {
        return this.http.put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/contact/" + cid, contact);
    };
    PortfolioDataService.prototype.putExperience = function (pid, experience, cid) {
        return this.http.put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/experiences/" + cid, experience);
    };
    PortfolioDataService.prototype.putEducation = function (pid, education, cid) {
        return this.http.put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/educations/" + cid, education);
    };
    PortfolioDataService.prototype.putWork = function (pid, work, cid) {
        return this.http.put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/works/" + cid, work);
    };
    PortfolioDataService.prototype.putSkill = function (pid, skill, cid) {
        return this.http.put(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/skills/" + cid, skill);
    };
    // GET PORTFOLIO DETAILS
    PortfolioDataService.prototype.getContact = function (pid) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/contact/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getExperience = function (pid) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/experiences/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getEducation = function (pid) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/educations/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getWork = function (pid) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/works/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService.prototype.getSkill = function (pid) {
        var _this = this;
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Portfolios/" + pid + "/skills/").pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            _this.loadingError$.next(error.statusText);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
        }));
    };
    PortfolioDataService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], PortfolioDataService);
    return PortfolioDataService;
}());



/***/ }),

/***/ "./src/app/portfolio/portfolio-resolver.ts":
/*!*************************************************!*\
  !*** ./src/app/portfolio/portfolio-resolver.ts ***!
  \*************************************************/
/*! exports provided: PortfolioResolver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortfolioResolver", function() { return PortfolioResolver; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");



var PortfolioResolver = /** @class */ (function () {
    function PortfolioResolver(portfolioService) {
        this.portfolioService = portfolioService;
    }
    PortfolioResolver.prototype.resolve = function (route, state) {
        return this.portfolioService.getPortfolio$(route.params['id']);
    };
    PortfolioResolver = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_portfolio_data_service__WEBPACK_IMPORTED_MODULE_2__["PortfolioDataService"]])
    ], PortfolioResolver);
    return PortfolioResolver;
}());



/***/ }),

/***/ "./src/app/portfolio/portfolio.module.ts":
/*!***********************************************!*\
  !*** ./src/app/portfolio/portfolio.module.ts ***!
  \***********************************************/
/*! exports provided: PortfolioModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortfolioModule", function() { return PortfolioModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _main_portfolio_main_portfolio_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main-portfolio/main-portfolio.component */ "./src/app/portfolio/main-portfolio/main-portfolio.component.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _add_portfolio_add_portfolio_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./add-portfolio/add-portfolio.component */ "./src/app/portfolio/add-portfolio/add-portfolio.component.ts");
/* harmony import */ var _view_portfolio_view_portfolio_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./view-portfolio/view-portfolio.component */ "./src/app/portfolio/view-portfolio/view-portfolio.component.ts");
/* harmony import */ var _portfolio_resolver__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./portfolio-resolver */ "./src/app/portfolio/portfolio-resolver.ts");
/* harmony import */ var _view_by_user_view_by_user_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./view-by-user/view-by-user.component */ "./src/app/portfolio/view-by-user/view-by-user.component.ts");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/portfolio/settings/settings.component.ts");
/* harmony import */ var _view_by_user_skill_skill_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./view-by-user/skill/skill.component */ "./src/app/portfolio/view-by-user/skill/skill.component.ts");
/* harmony import */ var _view_by_user_experience_experience_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./view-by-user/experience/experience.component */ "./src/app/portfolio/view-by-user/experience/experience.component.ts");
/* harmony import */ var _view_by_user_education_education_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./view-by-user/education/education.component */ "./src/app/portfolio/view-by-user/education/education.component.ts");
/* harmony import */ var _view_by_user_work_work_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./view-by-user/work/work.component */ "./src/app/portfolio/view-by-user/work/work.component.ts");
/* harmony import */ var _view_portfolio_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./view-portfolio/not-found/not-found.component */ "./src/app/portfolio/view-portfolio/not-found/not-found.component.ts");
/* harmony import */ var _view_by_user_edit_portfolio_edit_portfolio_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./view-by-user/edit-portfolio/edit-portfolio.component */ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.ts");



















var routes = [
    { path: 'main-portfolio', component: _main_portfolio_main_portfolio_component__WEBPACK_IMPORTED_MODULE_6__["MainPortfolioComponent"] },
    { path: 'add-portfolio', component: _add_portfolio_add_portfolio_component__WEBPACK_IMPORTED_MODULE_8__["AddPortfolioComponent"] },
    { path: 'view', component: _view_by_user_view_by_user_component__WEBPACK_IMPORTED_MODULE_11__["ViewByUserComponent"] },
    { path: '', redirectTo: 'main-portfolio', pathMatch: 'full' },
    {
        path: 'viewPortfolio/:id',
        component: _view_portfolio_view_portfolio_component__WEBPACK_IMPORTED_MODULE_9__["ViewPortfolioComponent"],
        resolve: { portfolio: _portfolio_resolver__WEBPACK_IMPORTED_MODULE_10__["PortfolioResolver"] }
    }
];
var PortfolioModule = /** @class */ (function () {
    function PortfolioModule() {
    }
    PortfolioModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_main_portfolio_main_portfolio_component__WEBPACK_IMPORTED_MODULE_6__["MainPortfolioComponent"], _add_portfolio_add_portfolio_component__WEBPACK_IMPORTED_MODULE_8__["AddPortfolioComponent"], _view_portfolio_view_portfolio_component__WEBPACK_IMPORTED_MODULE_9__["ViewPortfolioComponent"], _view_by_user_view_by_user_component__WEBPACK_IMPORTED_MODULE_11__["ViewByUserComponent"], _settings_settings_component__WEBPACK_IMPORTED_MODULE_12__["SettingsComponent"], _view_by_user_skill_skill_component__WEBPACK_IMPORTED_MODULE_13__["SkillComponent"], _view_by_user_experience_experience_component__WEBPACK_IMPORTED_MODULE_14__["ExperienceComponent"], _view_by_user_education_education_component__WEBPACK_IMPORTED_MODULE_15__["EducationComponent"], _view_by_user_work_work_component__WEBPACK_IMPORTED_MODULE_16__["WorkComponent"], _view_portfolio_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_17__["NotFoundComponent"], _view_by_user_edit_portfolio_edit_portfolio_component__WEBPACK_IMPORTED_MODULE_18__["EditPortfolioComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_7__["MaterialModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ]
        })
    ], PortfolioModule);
    return PortfolioModule;
}());



/***/ }),

/***/ "./src/app/portfolio/settings/settings.component.css":
/*!***********************************************************!*\
  !*** ./src/app/portfolio/settings/settings.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/portfolio/settings/settings.component.html":
/*!************************************************************!*\
  !*** ./src/app/portfolio/settings/settings.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  settings works!\n</p>\n"

/***/ }),

/***/ "./src/app/portfolio/settings/settings.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/portfolio/settings/settings.component.ts ***!
  \**********************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SettingsComponent = /** @class */ (function () {
    function SettingsComponent() {
    }
    SettingsComponent.prototype.ngOnInit = function () {
    };
    SettingsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-settings',
            template: __webpack_require__(/*! ./settings.component.html */ "./src/app/portfolio/settings/settings.component.html"),
            styles: [__webpack_require__(/*! ./settings.component.css */ "./src/app/portfolio/settings/settings.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.css":
/*!************************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.css ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby92aWV3LWJ5LXVzZXIvZWRpdC1wb3J0Zm9saW8vZWRpdC1wb3J0Zm9saW8uY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--form starts here!!-->\n<!--Add Edit Port Component here, or do it in page, whichever works-->\n<div *ngIf=\"showMsg\">  \n      <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n          <strong>Succesfully Edited Portfolio! You'll see the changes once you reload the page!</strong>\n      \n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>\n  </div>\n<div class=\"text-center\">\n    <h3 class=\"white-text text-white\">\n      Edit Portfolio:\n    </h3>\n    <hr class=\"hr-light\" />\n  </div>\n<div *ngIf=\"portfolio$ | async as item\">\n<form [formGroup]=\"saveP\" (ngSubmit)=\"onSubmit(item.id)\">\n  <div class=\"row mt-2\">\n    <div class=\"col-lg-6 mx-auto\">\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>person</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          class=\"form-control mr-sm-2\"\n          [value]=\"item.name\"\n          placeholder=\"Name\"\n          aria-label=\"Name\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"pName\"\n          [ngClass]=\"fieldClass('pName')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('pName')\">\n            name {{ getErrorMessage(saveP.get(\"pName\").errors) }}\n          </div>\n      </div>\n\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>description</mat-icon>\n          </span>\n        </div>\n        <textarea\n          class=\"form-control mr-sm-2\"\n          rows=\"5\"\n          id=\"comment\"\n          [value]=\"item.description\"\n          placeholder=\"About Me\"\n          aria-label=\"About Me\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"description\"\n          [ngClass]=\"fieldClass('description')\"\n        ></textarea>\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n            description {{ getErrorMessage(saveP.get(\"description\").errors) }}\n          </div>\n      </div>\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>add_a_photo</mat-icon>\n          </span>\n        </div>\n        <div class=\"custom-file\">\n          <input\n            type=\"file\"\n            class=\"form-control-file custom-file-input mr-sm-2\"\n            id=\"inputGroupFile01\"\n            aria-describedby=\"inputGroupFileAddon01\"\n            #fileInput\n            (change)=\"preUpload($event)\"\n            placeholder=\"image\"\n            aria-label=\"image\"\n            formControlName=\"picturePath\"\n            [ngClass]=\"fieldClass('picturePath')\"\n          />\n          <label\n            class=\"custom-file-label\"\n            for=\"inputGroupFile01\"\n            *ngIf=\"!isFileChosen\"\n            >Choose Image</label\n          >\n          <label\n            class=\"custom-file-label\"\n            for=\"inputGroupFile01\"\n            *ngIf=\"isFileChosen\"\n            >{{ fileName }}</label\n          >\n        </div>\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('picturePath')\">\n            image {{ getErrorMessage(saveP.get(\"picturePath\").errors) }}\n          </div>\n      </div>\n\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\" input-group-text\" id=\"basic-addon2\">\n            <mat-icon>attach_file</mat-icon>\n          </span>\n        </div>\n        <div class=\"custom-file\">\n          <input\n            type=\"file\"\n            class=\"form-control-file custom-file-input mr-sm-2\"\n            id=\"inputGroupFile02\"\n            aria-describedby=\"inputGroupFileAddon02\"\n            placeholder=\"resume\"\n            aria-label=\"resume\"\n            formControlName=\"resumePath\"\n            [ngClass]=\"fieldClass('resumePath')\"\n            #fileInput\n            (change)=\"preUpload2($event)\"\n          />\n          <label\n            class=\"custom-file-label\"\n            for=\"inputGroupFile02\"\n            *ngIf=\"!isFileChosen2\"\n            >Choose PDF</label\n          >\n          <label\n            class=\"custom-file-label\"\n            for=\"inputGroupFile02\"\n            *ngIf=\"isFileChosen2\"\n            >{{ fileName2 }}</label\n          >\n        </div>\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('resumePath')\">\n            resume {{ getErrorMessage(saveP.get(\"resumePath\").errors) }}\n          </div>\n      </div>\n\n    </div>\n  </div>\n\n  <div class=\"btn-group flex-wrap mt-auto\" data-toggle=\"buttons\" role=\"group\">\n    <button\n      type=\"submit\"\n      (click)=\"onSubmit(item.id)\"\n      class=\"btn btn-sm btn-outline-light \"\n      [disabled]=\"saveP.invalid\"\n      *ngIf=\"!uploading\"\n    >\n      Save Changes\n    </button>\n\n    <button class=\"btn btn-primary\" type=\"button\" disabled *ngIf=\"uploading\">\n      <span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n      Loading...\n    </button>\n  </div>\n</form>\n</div>"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.ts ***!
  \***********************************************************************************/
/*! exports provided: EditPortfolioComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditPortfolioComponent", function() { return EditPortfolioComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! q */ "./node_modules/q/q.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(q__WEBPACK_IMPORTED_MODULE_5__);






var EditPortfolioComponent = /** @class */ (function () {
    function EditPortfolioComponent(fb, _portfolioDataService) {
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
        this.isFileChosen = false;
        this.isFileChosen2 = false;
    }
    EditPortfolioComponent.prototype.ngOnInit = function () {
        var reg = '[^.]+\.(jpg|jpeg|gif|tiff|bmp|png)';
        var regP = '[^.]+\.(pdf)';
        this.portfolio$ = this.port;
        this.saveP = this.fb.group({
            pName: ['', []],
            description: ['', []],
            picturePath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            resumePath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(regP)]]
        });
    };
    EditPortfolioComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.saveP.value.pName || this.saveP.value.description) {
            this._portfolioDataService.putPortfolio(this.id, {
                name: this.saveP.value.pName,
                description: this.saveP.value.description
            }).subscribe(function (val) { return _this.showMsg = true; });
        }
        if (this.isFileChosen) {
            this._portfolioDataService.deleteImage().subscribe(function (val) { return _this.uploading = true; });
            Object(q__WEBPACK_IMPORTED_MODULE_5__["delay"])(1500);
            var uploadImage = new FormData();
            uploadImage.append('file', this.Image, this.Image.name);
            this._portfolioDataService.postImage(uploadImage)
                .subscribe(function (val) { return _this.showMsg = true, _this.uploading = false; }, function (err) {
                console.log(err);
                if (err.error instanceof Error) {
                    _this.errorMsg = "Error while trying to add Image: " + err.error.message;
                }
                else {
                    _this.errorMsg = "Error " + err.status + " while trying to add Image: " + err.error;
                }
            });
        }
        if (this.isFileChosen2) {
            this._portfolioDataService.deleteResume().subscribe(function (val) { return _this.uploading = true; });
            Object(q__WEBPACK_IMPORTED_MODULE_5__["delay"])(1500);
            var uploadResume = new FormData();
            uploadResume.append('file', this.Resume, this.Resume.name);
            this._portfolioDataService.postResume(uploadResume)
                .subscribe(function (val) { return _this.showMsg = true, _this.uploading = false; }, function (error) {
                console.log(error);
            });
        }
    };
    EditPortfolioComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
    };
    EditPortfolioComponent.prototype.isValid = function (field) {
        var input = this.saveP.get(field);
        return input.dirty && input.invalid;
    };
    EditPortfolioComponent.prototype.fieldClass = function (field) {
        return { 'is-invalid': this.isValid(field) };
    };
    EditPortfolioComponent.prototype.preUpload = function (event) {
        this.Image = event.target.files[0];
        if (event.target.files.length > 0) {
            this.isFileChosen = true;
        }
        this.fileName = this.Image.name;
    };
    EditPortfolioComponent.prototype.preUpload2 = function (event) {
        this.Resume = event.target.files[0];
        if (event.target.files.length > 0) {
            this.isFileChosen2 = true;
        }
        this.fileName2 = this.Resume.name;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], EditPortfolioComponent.prototype, "id", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"])
    ], EditPortfolioComponent.prototype, "port", void 0);
    EditPortfolioComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-portfolio',
            template: __webpack_require__(/*! ./edit-portfolio.component.html */ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.html"),
            styles: [__webpack_require__(/*! ./edit-portfolio.component.css */ "./src/app/portfolio/view-by-user/edit-portfolio/edit-portfolio.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__["PortfolioDataService"]])
    ], EditPortfolioComponent);
    return EditPortfolioComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/education/education.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/education/education.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby92aWV3LWJ5LXVzZXIvZWR1Y2F0aW9uL2VkdWNhdGlvbi5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/education/education.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/education/education.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"showMsg\">  \n    <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n        <strong>Succesfully Added an Education!</strong>\n    \n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n  </div>\n</div>\n<div *ngIf=\"education$ | async as ed\">\n    <div class=\"text-center\" *ngIf=\"ed.length != 0\">\n        <h3 class=\"white-text text-white\">\n          Educations:\n        </h3>\n        <hr class=\"hr-light\" />\n      </div>\n      <div class=\"container\">\n          <div class=\"row work\">\n            <div class=\"nine columns main-col\">\n              <div *ngFor=\"let edu of education$ | async\">\n                <div class=\"card h-100 mb-4 shadow-sm\">\n                  <div class=\"card-body\">\n                \n                  <div class=\"card-title\">\n                    <h3>{{ edu.institute }}</h3>\n                  </div>\n                  <div class=\"card-text\">\n                      <p class=\"info\">\n                          {{ edu.course }} <span>&bull;</span>\n                      <em class=\"date\">\n                        {{ getYear(edu.startYear) }} -\n                        {{ getYear(edu.endYear) }}</em\n                      >\n                    </p>\n                    <p>{{ edu.description }}</p>\n                    <a href=\"{{ edu.link }}\" target=\"_blank\">{{ edu.link }}</a>\n                  </div>\n                \n                </div>\n                <div class=\"d-flex ml-2 mb-2 justify-content-between align-items-center\">\n                    <div class=\"btn-group mt-auto\">\n                      \n                      <a\n                      (click)=\"delete(edu.id)\"\n                      class=\" btn btn-sm btn-outline-warning\"\n                      >delete</a\n                    >\n                    </div>\n                    \n                  </div>\n                </div>\n                <!-- item end -->\n              </div>\n            </div>\n            <!-- main-col end -->\n          </div>\n          <!-- End Work -->\n        </div>\n\n\n<div class=\"text-center\">\n    <h3 class=\"white-text text-white\">\n      Add Education:\n    </h3>\n    <hr class=\"hr-light\" />\n  </div>\n<form [formGroup]=\"education\" (ngSubmit)=\"onSubmit()\">\n  <div class=\"row mt-2\">\n    <div class=\"col-lg-6 mx-auto\">\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>school</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"School\"\n          aria-label=\"Institute\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"institute\"\n          [ngClass]=\"fieldClass('institute')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('institute')\">\n            institute {{ getErrorMessage(education.get(\"institute\").errors) }}\n          </div>\n      </div>\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>description</mat-icon>\n          </span>\n        </div>\n        <textarea\n          class=\"form-control mr-sm-2\"\n          rows=\"4\"\n          id=\"comment\"\n          placeholder=\"Give your viewer an explanation of your course, why did you choose this course...\"\n          aria-label=\"About Me\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"description\"\n          [ngClass]=\"fieldClass('description')\"\n        ></textarea>\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n            description {{ getErrorMessage(education.get(\"description\").errors) }}\n          </div>\n      </div>\n\n    </div>\n    <div class=\"col-lg-6 mx-auto\">\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>link</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"url\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Link\"\n          aria-label=\"Link\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"link\"\n          [ngClass]=\"fieldClass('link')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('link')\">\n            link {{ getErrorMessage(education.get(\"link\").errors) }}\n          </div>\n      </div>\n\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\" input-group-text\" id=\"basic-addon2\">\n            <mat-icon>school</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Course\"\n          aria-label=\"Course\"\n          aria-describedby=\"basic-addon2\"\n          formControlName=\"course\"\n          [ngClass]=\"fieldClass('course')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('course')\">\n            course {{ getErrorMessage(education.get(\"course\").errors) }}\n          </div>\n      </div>\n\n      <div class=\"form-row\">\n      <div class=\"col-sm-6 input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\" input-group-text\" id=\"basic-addon2\">\n            <mat-icon>date_range</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          onfocus=\"(this.type='date')\"\n          onblur=\"(this.type='text')\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Starting Year\"\n          aria-label=\"Starting Year\"\n          aria-describedby=\"basic-addon2\"\n          formControlName=\"startYear\"\n          [ngClass]=\"fieldClass('startYear')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('startYear')\">\n            Starting Year {{ getErrorMessage(education.get(\"startYear\").errors) }}\n          </div>\n        </div>\n        <div class=\"col-sm-6 input-group mb-3\">\n        <input\n          type=\"text\"\n          onfocus=\"(this.type='date')\"\n          onblur=\"(this.type='text')\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Ending Year\"\n          aria-label=\"Ending Year\"\n          aria-describedby=\"basic-addon2\"\n          formControlName=\"endYear\"\n          [ngClass]=\"fieldClass('startYear')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('startYear')\">\n            Ending Year {{ getErrorMessage(education.get(\"startYear\").errors) }}\n          </div>\n      </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"mt-auto\">\n    <button type=\"submit\" class=\"btn btn-outline-light \" [disabled]=\"education.invalid\">Add Education</button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/education/education.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/education/education.component.ts ***!
  \*************************************************************************/
/*! exports provided: EducationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EducationComponent", function() { return EducationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");




var EducationComponent = /** @class */ (function () {
    function EducationComponent(fb, _portfolioDataService) {
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
    }
    EducationComponent.prototype.ngOnInit = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.education = this.fb.group({
            institute: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            link: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            course: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            startYear: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            endYear: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]]
        });
        this.education$ = this._portfolioDataService.getEducation(this.id);
    };
    EducationComponent.prototype.onSubmit = function () {
        var _this = this;
        this._portfolioDataService.postEducation(this.id, {
            institute: this.education.value.institute,
            description: this.education.value.description,
            link: this.education.value.link,
            course: this.education.value.course,
            startYear: this.education.value.startYear,
            endYear: this.education.value.endYear
        }).subscribe(function (val) { return _this.showMsg = true; });
        this.education$ = this._portfolioDataService.getEducation(this.id);
    };
    EducationComponent.prototype.getYear = function (date) {
        var d = new Date(date);
        var today = new Date();
        if (d > today) {
            return 'ongoing';
        }
        else {
            return d.getFullYear();
        }
    };
    EducationComponent.prototype.delete = function (id) {
        if (confirm("Are you sure you want to delete this education?")) {
            this._portfolioDataService.deleteEducation(this.id, id);
            this._portfolioDataService.getEducation(this.id);
        }
    };
    EducationComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
    };
    EducationComponent.prototype.isValid = function (field) {
        var input = this.education.get(field);
        return input.dirty && input.invalid;
    };
    EducationComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], EducationComponent.prototype, "id", void 0);
    EducationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-education',
            template: __webpack_require__(/*! ./education.component.html */ "./src/app/portfolio/view-by-user/education/education.component.html"),
            styles: [__webpack_require__(/*! ./education.component.css */ "./src/app/portfolio/view-by-user/education/education.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__["PortfolioDataService"]])
    ], EducationComponent);
    return EducationComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/experience/experience.component.css":
/*!****************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/experience/experience.component.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby92aWV3LWJ5LXVzZXIvZXhwZXJpZW5jZS9leHBlcmllbmNlLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/experience/experience.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/experience/experience.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"showMsg\">  \n    <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n        <strong>Succesfully Added Work Experience!</strong>\n    \n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n  </div>\n</div>\n<div *ngIf=\"experience$ | async as ex\">\n    <div class=\"text-center\" *ngIf=\"ex.length !=0\">\n        <h3 class=\"white-text text-white\">\n          Work Experiences:\n        </h3>\n        <hr class=\"hr-light\" />\n      </div>\n\n\n      <div class=\"container\">\n        <div class=\"row work\">\n          <div class=\"nine columns main-col\">\n            <div *ngFor=\"let exp of experience$ | async\">\n              <div class=\"card h-100 mb-4 shadow-sm\">\n                <div class=\"card-body\">\n              \n                <div class=\"card-title\">\n                  <h3>{{ exp.company }}</h3>\n                </div>\n                <div class=\"card-text\">\n                  <p class=\"info\">\n                    {{ exp.jobPos }} <span>&bull;</span>\n                    <em class=\"date\">\n                      {{ getYear(exp.startYear) }} -\n                      {{ getYear(exp.endYear) }}</em\n                    >\n                  </p>\n                  <p>{{ exp.description }}</p>\n                  <a href=\"{{ exp.link }}\" target=\"_blank\">{{ exp.link }}</a>\n                </div>\n              \n              </div>\n              <div class=\"d-flex ml-2 mb-2 justify-content-between align-items-center\">\n                  <div class=\"btn-group mt-auto\">\n                    \n                    <a\n                    (click)=\"delete(exp.id)\"\n                    class=\" btn btn-sm btn-outline-warning\"\n                    >delete</a\n                  >\n                  </div>\n                  \n                </div>\n              </div>\n              <!-- item end -->\n            </div>\n          </div>\n          <!-- main-col end -->\n        </div>\n        <!-- End Work -->\n      </div>\n    </div>\n\n\n\n\n\n<div class=\"text-center\">\n    <h3 class=\"white-text text-white\">\n      Add Work Experience:\n    </h3>\n    <hr class=\"hr-light\" />\n  </div>\n<form [formGroup]=\"experience\" (ngSubmit)=\"onSubmit()\">\n  <div class=\"row mt-2\">\n    <div class=\"col-lg-6 mx-auto\">\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>business</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Company\"\n          aria-label=\"Company\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"company\"\n          [ngClass]=\"fieldClass('company')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('company')\">\n            company {{ getErrorMessage(experience.get(\"company\").errors) }}\n          </div>\n      </div>\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>person</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"url\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Position\"\n          aria-label=\"Position\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"jobPos\"\n          [ngClass]=\"fieldClass('jobPos')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('jobPos')\">\n            Position {{ getErrorMessage(experience.get(\"jobPos\").errors) }}\n          </div>\n      </div>\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>link</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"url\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Link\"\n          aria-label=\"Link\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"link\"\n          [ngClass]=\"fieldClass('link')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('link')\">\n            link {{ getErrorMessage(experience.get(\"link\").errors) }}\n          </div>\n      </div>\n    </div>\n    <div class=\"col-lg-6 mx-auto\">\n      <div class=\"input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\"input-group-text\" id=\"basic-addon1\">\n            <mat-icon>description</mat-icon>\n          </span>\n        </div>\n        <textarea\n          class=\"form-control mr-sm-2\"\n          rows=\"4\"\n          id=\"comment\"\n          placeholder=\"Why was this experience useful to you, what did this job position include...\"\n          aria-label=\"About Me\"\n          aria-describedby=\"basic-addon1\"\n          formControlName=\"description\"\n          [ngClass]=\"fieldClass('description')\"\n        ></textarea>\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n            description {{ getErrorMessage(experience.get(\"description\").errors) }}\n          </div>\n      </div>\n\n      <div class=\"form-row\">\n      <div class=\"col-sm-6 input-group mb-3\">\n        <div class=\"input-group-prepend\">\n          <span class=\" input-group-text\" id=\"basic-addon2\">\n            <mat-icon>date_range</mat-icon>\n          </span>\n        </div>\n        <input\n          type=\"text\"\n          onfocus=\"(this.type='date')\"\n          onblur=\"(this.type='text')\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Starting Date\"\n          aria-label=\"Starting Date\"\n          aria-describedby=\"basic-addon2\"\n          formControlName=\"startYear\"\n          [ngClass]=\"fieldClass('startYear')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('startYear')\">\n            Starting Date {{ getErrorMessage(experience.get(\"startYear\").errors) }}\n          </div>\n      </div>\n      <div class=\"col-sm-6 input-group mb-3\">\n        <input\n          type=\"text\"\n          onfocus=\"(this.type='date')\"\n          onblur=\"(this.type='text')\"\n          class=\"form-control mr-sm-2\"\n          placeholder=\"Ending Date\"\n          aria-label=\"Ending Date\"\n          aria-describedby=\"basic-addon2\"\n          formControlName=\"endYear\"\n          [ngClass]=\"fieldClass('endYear')\"\n        />\n        <div class=\"invalid-feedback\" *ngIf=\"isValid('endYear')\">\n            Ending Date {{ getErrorMessage(experience.get(\"endYear\").errors) }}\n          </div>\n      </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"mt-auto\">\n    <button type=\"submit\" class=\"btn btn-outline-light \" [disabled]=\"experience.invalid\">Add Experience</button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/experience/experience.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/experience/experience.component.ts ***!
  \***************************************************************************/
/*! exports provided: ExperienceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExperienceComponent", function() { return ExperienceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");




var ExperienceComponent = /** @class */ (function () {
    function ExperienceComponent(fb, _portfolioDataService) {
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
    }
    ExperienceComponent.prototype.ngOnInit = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.experience = this.fb.group({
            company: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            jobPos: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            link: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            startYear: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            endYear: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]]
        });
        this.experience$ = this._portfolioDataService.getExperience(this.id);
    };
    ExperienceComponent.prototype.onSubmit = function () {
        var _this = this;
        this._portfolioDataService.postExperience(this.id, {
            company: this.experience.value.company,
            jobPos: this.experience.value.jobPos,
            link: this.experience.value.link,
            description: this.experience.value.description,
            startYear: this.experience.value.startYear,
            endYear: this.experience.value.endYear
        }).subscribe(function (val) { return _this.showMsg = true; });
        this.experience$ = this._portfolioDataService.getExperience(this.id);
    };
    ExperienceComponent.prototype.getYear = function (date) {
        var d = new Date(date);
        var today = new Date();
        if (d > today) {
            return 'ongoing';
        }
        else {
            return d.getFullYear();
        }
    };
    ExperienceComponent.prototype.delete = function (id) {
        if (confirm("Are you sure you want to delete this work experience?")) {
            this._portfolioDataService.deleteExperience(this.id, id);
            this.experience$ = this._portfolioDataService.getExperience(this.id);
        }
    };
    ExperienceComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
    };
    ExperienceComponent.prototype.isValid = function (field) {
        var input = this.experience.get(field);
        return input.dirty && input.invalid;
    };
    ExperienceComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], ExperienceComponent.prototype, "id", void 0);
    ExperienceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-experience',
            template: __webpack_require__(/*! ./experience.component.html */ "./src/app/portfolio/view-by-user/experience/experience.component.html"),
            styles: [__webpack_require__(/*! ./experience.component.css */ "./src/app/portfolio/view-by-user/experience/experience.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__["PortfolioDataService"]])
    ], ExperienceComponent);
    return ExperienceComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/skill/skill.component.css":
/*!******************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/skill/skill.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby92aWV3LWJ5LXVzZXIvc2tpbGwvc2tpbGwuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/skill/skill.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/skill/skill.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"showMsg\">  \n    <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n        <strong>Succesfully Added a skill!</strong>\n    \n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n  </div>\n</div>\n<div *ngIf=\"skill$ | async as skill\">\n<div class=\"text-center\" *ngIf=\"skill.length != 0\">\n    <h3 class=\"white-text text-white\">\n      Skills:\n    </h3>\n    <hr class=\"hr-light\" />\n          <div class=\"container\">\n            <div class=\"row\">\n              <div class=\"col-md-3 mb-4\" *ngFor=\"let sk of skill$ | async\">\n                <div class=\"card h-100 shadow-sm\">\n                  <img\n                    class=\"card-img\"\n                    src=\"{{ sk.iconPath }}\"\n                    height=\"200\"\n                    alt=\"{{ sk.type }}\"\n                  />\n                  <div class=\"card-body\">\n                    <h5 class=\"card-title\">{{ sk.type }}</h5>\n                    <p class=\"card-text\">{{ sk.description }}</p>    \n                  </div>\n                  <div class=\"d-flex ml-2 mb-2 justify-content-between align-items-center\">\n                      <div class=\"btn-group mt-auto\">\n                        \n                        <a\n                        (click)=\"delete(sk.id)\"\n                        class=\" btn btn-sm btn-outline-warning\"\n                        >delete</a\n                      >\n                      </div>\n                      \n                    </div>\n\n                </div>\n              </div>\n            </div>\n          </div>\n      </div>\n</div>\n\n<div class=\"text-center\">\n    <h3 class=\"white-text text-white\">\n      Add Skill:\n    </h3>\n    <hr class=\"hr-light\" />\n</div>\n<form class=\"col-md-6 mx-auto\" [formGroup]=\"skill\" (ngSubmit)=\"onSubmit()\">\n  <div class=\"input-group mb-3\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>build</mat-icon>\n      </span>\n    </div>\n    <input\n      type=\"text\"\n      class=\"form-control mr-sm-2\"\n      placeholder=\"Skill\"\n      aria-label=\"Type\"\n      aria-describedby=\"basic-addon1\"\n      formControlName=\"type\"\n      [ngClass]=\"fieldClass('type')\"\n    />\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('type')\">\n        Skill {{ getErrorMessage(skill.get(\"type\").errors) }}\n      </div>\n  </div>\n\n  <div class=\"input-group mb-3\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>description</mat-icon>\n      </span>\n    </div>\n    <textarea\n      class=\"form-control mr-sm-2\"\n      rows=\"5\"\n      id=\"comment\"\n      placeholder=\"What is this skill about, How well do you know this skill...\"\n      aria-label=\"description\"\n      aria-describedby=\"basic-addon1\"\n      formControlName=\"description\"\n      [ngClass]=\"fieldClass('description')\"\n    ></textarea>\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n        description {{ getErrorMessage(skill.get(\"description\").errors) }}\n      </div>\n  </div>\n\n  <div class=\"input-group mb-3\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>add_a_photo</mat-icon>\n      </span>\n    </div>\n    <input\n      type=\"url\"\n      class=\"form-control mr-sm-2\"\n      placeholder=\"image\"\n      aria-label=\"image\"\n      aria-describedby=\"basic-addon1\"\n      formControlName=\"iconPath\"\n      [ngClass]=\"fieldClass('iconPath')\"\n    />\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('iconPath')\">\n        image {{ getErrorMessage(skill.get(\"iconPath\").errors) }}\n      </div>\n  </div>\n\n\n  <div class=\"mt-auto\">\n    <button type=\"submit\" class=\"btn btn-outline-light \" [disabled]=\"skill.invalid\">Add Skill</button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/skill/skill.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/skill/skill.component.ts ***!
  \*****************************************************************/
/*! exports provided: SkillComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillComponent", function() { return SkillComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");




var SkillComponent = /** @class */ (function () {
    function SkillComponent(fb, _portfolioDataService) {
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
    }
    SkillComponent.prototype.ngOnInit = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.skill = this.fb.group({
            type: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            iconPath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]]
        });
        this.skill$ = this._portfolioDataService.getSkill(this.id);
    };
    SkillComponent.prototype.onSubmit = function () {
        var _this = this;
        this._portfolioDataService.postSkill(this.id, {
            type: this.skill.value.type,
            description: this.skill.value.description,
            iconPath: this.skill.value.iconPath
        }).subscribe(function (val) { return _this.showMsg = true; });
        this.skill$ = this._portfolioDataService.getSkill(this.id);
    };
    SkillComponent.prototype.delete = function (id) {
        if (confirm("Are you sure you want to delete this skill?")) {
            this._portfolioDataService.deleteSkill(this.id, id);
            this.skill$ = this._portfolioDataService.getSkill(this.id);
        }
    };
    SkillComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
    };
    SkillComponent.prototype.isValid = function (field) {
        var input = this.skill.get(field);
        return input.dirty && input.invalid;
    };
    SkillComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SkillComponent.prototype, "id", void 0);
    SkillComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-skill',
            template: __webpack_require__(/*! ./skill.component.html */ "./src/app/portfolio/view-by-user/skill/skill.component.html"),
            styles: [__webpack_require__(/*! ./skill.component.css */ "./src/app/portfolio/view-by-user/skill/skill.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__["PortfolioDataService"]])
    ], SkillComponent);
    return SkillComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/view-by-user.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/view-by-user.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "body, html {\r\n  height: 100%;\r\n}\r\n.app-loading {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  height: 100%;\r\n}\r\n.app-loading .spinner {\r\n  height: 200px;\r\n  width: 200px;\r\n  -webkit-animation: rotate 2s linear infinite;\r\n          animation: rotate 2s linear infinite;\r\n  -webkit-transform-origin: center center;\r\n          transform-origin: center center;\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  margin: auto;\r\n}\r\n.app-loading .spinner .path {\r\n  stroke-dasharray: 1, 200;\r\n  stroke-dashoffset: 0;\r\n  -webkit-animation: dash 1.5s ease-in-out infinite;\r\n          animation: dash 1.5s ease-in-out infinite;\r\n  stroke-linecap: round;\r\n  stroke: #ddd;\r\n}\r\n@-webkit-keyframes rotate {\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n@keyframes rotate {\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n@-webkit-keyframes dash {\r\n  0% {\r\n    stroke-dasharray: 1, 200;\r\n    stroke-dashoffset: 0;\r\n  }\r\n  50% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -35px;\r\n  }\r\n  100% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -124px;\r\n  }\r\n}\r\n@keyframes dash {\r\n  0% {\r\n    stroke-dasharray: 1, 200;\r\n    stroke-dashoffset: 0;\r\n  }\r\n  50% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -35px;\r\n  }\r\n  100% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -124px;\r\n  }\r\n}\r\n.card {\r\n    background-color: rgba(0, 0, 0, 0.507);\r\n  }\r\nh6 {\r\n    line-height: 1.7;\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9ydGZvbGlvL3ZpZXctYnktdXNlci92aWV3LWJ5LXVzZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFlBQVk7QUFDZDtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixZQUFZO0FBQ2Q7QUFDQTtFQUNFLGFBQWE7RUFDYixZQUFZO0VBQ1osNENBQW9DO1VBQXBDLG9DQUFvQztFQUNwQyx1Q0FBK0I7VUFBL0IsK0JBQStCO0VBQy9CLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sU0FBUztFQUNULE9BQU87RUFDUCxRQUFRO0VBQ1IsWUFBWTtBQUNkO0FBQ0E7RUFDRSx3QkFBd0I7RUFDeEIsb0JBQW9CO0VBQ3BCLGlEQUF5QztVQUF6Qyx5Q0FBeUM7RUFDekMscUJBQXFCO0VBQ3JCLFlBQVk7QUFDZDtBQUNBO0VBQ0U7SUFDRSxpQ0FBeUI7WUFBekIseUJBQXlCO0VBQzNCO0FBQ0Y7QUFKQTtFQUNFO0lBQ0UsaUNBQXlCO1lBQXpCLHlCQUF5QjtFQUMzQjtBQUNGO0FBQ0E7RUFDRTtJQUNFLHdCQUF3QjtJQUN4QixvQkFBb0I7RUFDdEI7RUFDQTtJQUNFLHlCQUF5QjtJQUN6Qix3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLHlCQUF5QjtJQUN6Qix5QkFBeUI7RUFDM0I7QUFDRjtBQWJBO0VBQ0U7SUFDRSx3QkFBd0I7SUFDeEIsb0JBQW9CO0VBQ3RCO0VBQ0E7SUFDRSx5QkFBeUI7SUFDekIsd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSx5QkFBeUI7SUFDekIseUJBQXlCO0VBQzNCO0FBQ0Y7QUFDQTtJQUNJLHNDQUFzQztFQUN4QztBQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCIiwiZmlsZSI6InNyYy9hcHAvcG9ydGZvbGlvL3ZpZXctYnktdXNlci92aWV3LWJ5LXVzZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbImJvZHksIGh0bWwge1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG4uYXBwLWxvYWRpbmcge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuLmFwcC1sb2FkaW5nIC5zcGlubmVyIHtcclxuICBoZWlnaHQ6IDIwMHB4O1xyXG4gIHdpZHRoOiAyMDBweDtcclxuICBhbmltYXRpb246IHJvdGF0ZSAycyBsaW5lYXIgaW5maW5pdGU7XHJcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyIGNlbnRlcjtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIG1hcmdpbjogYXV0bztcclxufVxyXG4uYXBwLWxvYWRpbmcgLnNwaW5uZXIgLnBhdGgge1xyXG4gIHN0cm9rZS1kYXNoYXJyYXk6IDEsIDIwMDtcclxuICBzdHJva2UtZGFzaG9mZnNldDogMDtcclxuICBhbmltYXRpb246IGRhc2ggMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcclxuICBzdHJva2UtbGluZWNhcDogcm91bmQ7XHJcbiAgc3Ryb2tlOiAjZGRkO1xyXG59XHJcbkBrZXlmcmFtZXMgcm90YXRlIHtcclxuICAxMDAlIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XHJcbiAgfVxyXG59XHJcbkBrZXlmcmFtZXMgZGFzaCB7XHJcbiAgMCUge1xyXG4gICAgc3Ryb2tlLWRhc2hhcnJheTogMSwgMjAwO1xyXG4gICAgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7XHJcbiAgfVxyXG4gIDUwJSB7XHJcbiAgICBzdHJva2UtZGFzaGFycmF5OiA4OSwgMjAwO1xyXG4gICAgc3Ryb2tlLWRhc2hvZmZzZXQ6IC0zNXB4O1xyXG4gIH1cclxuICAxMDAlIHtcclxuICAgIHN0cm9rZS1kYXNoYXJyYXk6IDg5LCAyMDA7XHJcbiAgICBzdHJva2UtZGFzaG9mZnNldDogLTEyNHB4O1xyXG4gIH1cclxufVxyXG4uY2FyZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNTA3KTtcclxuICB9XHJcblxyXG4gIGg2IHtcclxuICAgIGxpbmUtaGVpZ2h0OiAxLjc7XHJcbiAgfSJdfQ== */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/view-by-user.component.html":
/*!********************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/view-by-user.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--contact form-->\n<ng-container *ngIf=\"portfolio$ | async as item\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-sm-12 mx-auto\">\n        <div class=\"container \">\n          <div class=\"row\">\n            <div class=\"card col-sm-3 ml-sm-3 mr-sm-3 mr-xl-5 mt-3\">\n              <img\n                class=\"card-img mt-3\"\n                [src]=\"image\"\n                alt=\"Image\"\n                \n              />\n              <div class=\"card-body d-flex flex-column\">\n                <h5 class=\"card-title text-white\">{{ item.name }}</h5>\n                <div class=\"btn-group flex-wrap mt-auto\" role=\"group\">\n                  <!-- CHANGE THIS PLZ -->\n                  <a\n                    href=\"\"\n                    class=\"btn btn-sm btn-outline-light\"\n                    data-toggle=\"modal\"\n                    data-target=\"#myModal\"\n                    class=\"btn btn-sm btn-outline-light\"\n                    >Resume</a\n                  >\n\n                  <div\n                    class=\"modal fade\"\n                    id=\"myModal\"\n                    tabindex=\"-1\"\n                    role=\"dialog\"\n                    aria-labelledby=\"myModalLabel\"\n                    aria-hidden=\"true\"\n                  >\n                    <div class=\"modal-dialog modal-lg\">\n                      <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                          <h4 class=\"modal-title\" id=\"myModalLabel\">Resume</h4>\n                          <button\n                            type=\"button\"\n                            class=\"close\"\n                            data-dismiss=\"modal\"\n                            aria-hidden=\"true\"\n                          >\n                            &times;\n                          </button>\n                        </div>\n                        <div class=\"modal-body \">\n                          <embed\n                          [src]=\"pdf\"\n                          frameborder=\"0\"\n                          width=\"100%\"\n                          height=\"500px\"   \n                          type='application/pdf'                       \n                        />\n                        </div>\n                        <div class=\"modal-footer\">\n                          <button\n                            type=\"button\"\n                            class=\"btn btn-default\"\n                            data-dismiss=\"modal\"\n                          >\n                            Close\n                          </button>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n                  <a\n                    href=\"/portfolio/viewPortfolio/{{ item.id }}\"\n                    class=\"btn btn-sm  btn-outline-light\"\n                    target=\"_blank\"\n                    >Portfolio</a\n                  >\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapsePort\"\n                    (click)=\"scroll(targetPort)\"\n                  >\n                    Edit\n                  </button>\n                  <button\n                    class=\"btn btn-sm  btn-outline-warning\"\n                    (click)=\"delete(item.id)\"\n                  >\n                    Delete\n                  </button>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"card col-sm-8 ml-sm-3 mt-3\">\n              <div class=\"card-body d-flex flex-column\">\n                <h5 class=\"card-title text-white\">Portfolio Details</h5>\n                <p class=\"card-text text-white\">{{ item.description }}</p>\n\n                <div *ngIf=\"contact$ | async as c\">\n                  <h5 class=\"card-title text-white\">Contact Details</h5>\n                  <div class=\"card-text\">\n                    <ul class=\"list-unstyled text-light\">\n                      <li>Name: {{ c.name }} {{ c.surname }}</li>\n                      <li>Email: {{ c.email }}</li>\n                      <li>Birthdate: {{ formatDate(c.birthDate) }}</li>\n                      <li>Address: {{ c.street }}</li>\n                      <li>\n                        City: {{ c.postalCode }}\n                        {{ c.city }}\n                      </li>\n                      <li>Country: {{ c.country }}</li>\n                    </ul>\n                  </div>\n                  <p class=\"card-text\"></p>\n                  <p class=\"card-text\"></p>\n                  <p class=\"card-text\"></p>\n                  <p class=\"card-text\"></p>\n                </div>\n                <div class=\"btn-group flex-wrap mt-auto\" role=\"group\">\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapseSk\"\n                    (click)=\"scroll(targetSkills)\"\n                  >\n                    Skills\n                  </button>\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapseEdu\"\n                    (click)=\"scroll(targetEdu)\"\n                  >\n                    Educations\n                  </button>\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapseExp\"\n                    (click)=\"scroll(targetExp)\"\n                  >\n                    Work Experiences\n                  </button>\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapseWork\"\n                    (click)=\"scroll(targetWorks)\"\n                  >\n                    Works\n                  </button>\n                  <button\n                    class=\"btn btn-sm  btn-outline-light\"\n                    data-toggle=\"collapse\"\n                    data-target=\"#collapseContact\"\n                    (click)=\"scroll(targetContact)\"\n                  >\n                    Contact Details\n                  </button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"container\">\n    <div class=\"row mt-3\">\n      <div class=\"col-sm-12 mx-auto\">\n        <div class=\"container \">\n          <div\n            #targetPort\n            class=\"card col-md-12 collapse mb-3 \"\n            id=\"collapsePort\"\n          >\n            <div class=\"card-body\">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapsePort\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"row mt-5\">\n                <div class=\" col-lg-12 mx-auto\">\n                  <app-edit-portfolio [id]=\"item.id\" [port]=\"portfolio$\"></app-edit-portfolio>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"container\">\n    <div class=\"row mt-3\">\n      <div class=\"col-sm-12 mx-auto\">\n        <div class=\"container \">\n          <!--Form-->\n\n          <!--Header-->\n          <div\n            #targetContact\n            class=\"card col-md-12 mb-3 collapse\"\n            id=\"collapseContact\"\n          >\n            <div class=\"card-body \">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapseContact\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"text-center\">\n                <h3 class=\"white-text mt-5 text-white\">\n                  Your Contact Information:\n                </h3>\n                <hr class=\"hr-white\" />\n              </div>\n              <!--form starts here!!-->\n\n              <form [formGroup]=\"contact\" (ngSubmit)=\"onSubmit(item.id)\">\n                <div class=\"row mt-2\">\n                  <div class=\"col-lg-6 mx-auto\">\n                      <div class=\"form-row\">\n                          <div class=\"col-sm-6 input-group mb-3\">\n                      <div class=\"input-group-prepend \">\n                        <span class=\"input-group-text\" id=\"basic-addon1\">\n                          <mat-icon>person</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"text\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Name\"\n                        aria-label=\"Name\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"name\"\n                        [ngClass]=\"fieldClass('name')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('name')\">\n                          Name {{ getErrorMessage(contact.get(\"name\").errors) }}\n                        </div>\n                    </div>\n                    <div class=\"col-sm-6 input-group mb-3\">\n                      <input\n                        type=\"text\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Surname\"\n                        aria-label=\"Surname\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"surname\"\n                        [ngClass]=\"fieldClass('surname')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('surname')\">\n                          Surname {{ getErrorMessage(contact.get(\"surname\").errors) }}\n                        </div>\n                    </div>\n                    </div>\n                    \n\n                    <div class=\"input-group mb-3\">\n                      <div class=\"input-group-prepend \">\n                        <span class=\"input-group-text\" id=\"basic-addon1\">\n                          <mat-icon>contact_mail</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"email\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Email\"\n                        aria-label=\"email\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"email\"\n                        [ngClass]=\"fieldClass('email')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('email')\">\n                          Email {{ getErrorMessage(contact.get(\"email\").errors) }}\n                        </div>\n                    </div>\n                    \n\n                    <div class=\"input-group mb-3\">\n                      <div class=\"input-group-prepend \">\n                        <span class=\" input-group-text\" id=\"basic-addon2\">\n                          <mat-icon>cake</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"text\"\n                        onfocus=\"(this.type='date')\"\n                        onblur=\"(this.type='text')\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Birth Date\"\n                        aria-label=\"Birth Date\"\n                        aria-describedby=\"basic-addon2\"\n                        formControlName=\"birthDate\"\n                        [ngClass]=\"fieldClass('birthDate')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('birthDate')\">\n                          Birth Date {{ getErrorMessage(contact.get(\"birthDate\").errors) }}\n                        </div>\n                    </div>\n                    \n                  </div>\n\n                  <div class=\"col-lg-6 mx-auto\">\n                    <div class=\"input-group mb-3\">\n                      <div class=\"input-group-prepend\">\n                        <span class=\"input-group-text\" id=\"basic-addon1\">\n                          <mat-icon>home</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"text\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Street & House Number\"\n                        aria-label=\"Street\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"street\"\n                        [ngClass]=\"fieldClass('street')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('street')\">\n                          Street {{ getErrorMessage(contact.get(\"street\").errors) }}\n                        </div>\n                    </div>\n                    \n                    <div class=\"form-row\">\n                    <div class=\"col-sm-6 input-group mb-3\">\n                      <div class=\"input-group-prepend\">\n                        <span class=\"input-group-text\" id=\"basic-addon1\">\n                          <mat-icon>location_city</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"text\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"City\"\n                        aria-label=\"City\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"city\"\n                        [ngClass]=\"fieldClass('city')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('city')\">\n                          City {{ getErrorMessage(contact.get(\"city\").errors) }}\n                        </div>\n                    </div>\n                      <div class=\"col-sm-6 input-group mb-3\">\n                      <input\n                        type=\"number\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"PostalCode\"\n                        aria-label=\"PostalCode\"\n                        aria-describedby=\"basic-addon2\"\n                        formControlName=\"postalCode\"\n                        [ngClass]=\"fieldClass('postalCode')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('postalCode')\">\n                          PostalCode {{ getErrorMessage(contact.get(\"postalCode\").errors) }}\n                        </div>\n                    </div>\n                  </div>\n                    \n                    <div class=\"input-group mb-3\">\n                      <div class=\"input-group-prepend\">\n                        <span class=\"input-group-text\" id=\"basic-addon1\">\n                          <mat-icon>public</mat-icon>\n                        </span>\n                      </div>\n                      <input\n                        type=\"url\"\n                        class=\"form-control mr-sm-2\"\n                        placeholder=\"Country\"\n                        aria-label=\"Country\"\n                        aria-describedby=\"basic-addon1\"\n                        formControlName=\"country\"\n                        [ngClass]=\"fieldClass('country')\"\n                      />\n                      <div class=\"invalid-feedback\" *ngIf=\"isValid('country')\">\n                          Country {{ getErrorMessage(contact.get(\"country\").errors) }}\n                        </div>\n                    </div>\n                  </div>\n                </div>\n\n                <div\n                  class=\"btn-group flex-wrap mt-auto\"\n                  data-toggle=\"buttons\"\n                  role=\"group\"\n                >\n                  <button\n                    type=\"submit\"\n                    (click)=\"onSubmit(item.id)\"\n                    class=\"btn btn-sm btn-outline-light \"\n                    [disabled]=\"contact.invalid\"\n                  >\n                    Add Contact\n                  </button>\n\n                  <button *ngIf=\"contact$ | async as c\"\n                    class=\"btn btn-sm btn-outline-warning\"\n                    type=\"button\"\n                    (click)=\"deleteC(item.id, c.id)\"\n                  >\n                    Delete Contact Details\n                  </button>\n                </div>\n              </form>\n            </div>\n          </div>\n\n          <div #targetSkills class=\"card collapse mb-3 \" id=\"collapseSk\">\n            <div class=\"card-body\">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapseSk\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"row mt-5\">\n                <div class=\" col-lg-12 mx-auto\">\n                  <!--form starts here!!-->\n                  <app-skill [id]=\"item.id\"></app-skill>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div #targetEdu class=\"card collapse mb-3 \" id=\"collapseEdu\">\n            <div class=\"card-body\">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapseEdu\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"row mt-5 \">\n                <div class=\" col-lg-12 mx-auto\">\n                  <!--form starts here!!-->\n                  <app-education [id]=\"item.id\"></app-education>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div #targetExp class=\"card collapse mb-3 \" id=\"collapseExp\">\n            <div class=\"card-body\">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapseExp\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"row mt-5 \">\n                <div class=\" col-lg-12 mx-auto\">\n                  <!--form starts here!!-->\n                  <app-experience [id]=\"item.id\"></app-experience>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div #targetWorks class=\"card collapse mb-3 \" id=\"collapseWork\">\n            <div class=\"card-body\">\n              <button\n                type=\"button\"\n                class=\"close\"\n                data-toggle=\"collapse\"\n                data-target=\"#collapseWork\"\n                aria-label=\"Close\"\n              >\n                <mat-icon [ngStyle]=\"{ color: 'white' }\">close</mat-icon>\n              </button>\n              <div class=\"row mt-5 \">\n                <div class=\" col-lg-12 mx-auto\">\n                  <!--form starts here!!-->\n                  <app-work [id]=\"item.id\"></app-work>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-container>\n\n<div class=\"app-loading\" *ngIf=\"loadingRouteConfig\">\n  <div class=\"logo\"></div>\n  <svg class=\"spinner\" viewBox=\"25 25 50 50\">\n    <circle\n      class=\"path\"\n      cx=\"50\"\n      cy=\"50\"\n      r=\"20\"\n      fill=\"none\"\n      stroke-width=\"2\"\n      stroke-miterlimit=\"10\"\n    />\n  </svg>\n</div>\n"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/view-by-user.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/view-by-user.component.ts ***!
  \******************************************************************/
/*! exports provided: ViewByUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewByUserComponent", function() { return ViewByUserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");







var ViewByUserComponent = /** @class */ (function () {
    function ViewByUserComponent(router, fb, _portfolioDataService, sanitizer) {
        this.router = router;
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
        this.sanitizer = sanitizer;
        this.isImageLoading = true;
        this.isPDFLoading = true;
    }
    ViewByUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouteConfigLoadStart"]) {
                _this.loadingRouteConfig = true;
            }
            else if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouteConfigLoadEnd"]) {
                _this.loadingRouteConfig = false;
            }
        });
        this._portfolioDataService.getImage(this.id).subscribe(function (data) {
            _this.createImageFromBlob(data);
            _this.isImageLoading = false;
        }, function (error) {
            _this.isImageLoading = true;
            console.log(error);
        });
        this._portfolioDataService.getResume(this.id).subscribe(function (data) {
            var file = new Blob([data], { type: 'application/pdf' });
            var something = URL.createObjectURL(file);
            _this.pdfToShow = _this.sanitizer.bypassSecurityTrustResourceUrl(something);
            _this.isPDFLoading = false;
        }, function (error) {
            _this.isPDFLoading = true;
            console.log(error);
        });
        this.contact = this.fb.group({
            name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            surname: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email]],
            birthDate: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            street: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            city: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            country: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            postalCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(4)]]
        });
        var test;
        this.portfolio$.subscribe(function (val) { return test = val.contact; });
        if (test) {
            this.contact$ = this._portfolioDataService.getContact(this.id);
        }
    };
    ViewByUserComponent.prototype.scroll = function (el) {
        el.scrollIntoView();
    };
    ViewByUserComponent.prototype.onSubmit = function (id) {
        this.contact$ = this._portfolioDataService.postContact(id, {
            name: this.contact.value.name,
            surname: this.contact.value.surname,
            email: this.contact.value.email,
            birthDate: this.contact.value.birthDate,
            street: this.contact.value.street,
            city: this.contact.value.city,
            country: this.contact.value.country,
            postalcode: this.contact.value.postalCode
        }).pipe();
    };
    ViewByUserComponent.prototype.formatDate = function (date) {
        var d = new Date(date);
        return d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    };
    ViewByUserComponent.prototype.delete = function (id) {
        var _this = this;
        if (confirm('Are you sure you want to delete your portfolio?')) {
            this._portfolioDataService.deletePortfolio(id);
            this.portfolio$ = null;
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(function () { return _this.router.navigate(['/portfolio/main-portfolio']); });
        }
    };
    ViewByUserComponent.prototype.deleteC = function (id, cid) {
        if (confirm('Are you sure you want to delete your contact details?')) {
            this._portfolioDataService.deleteContact(id, cid);
            this.contact$ = null;
        }
    };
    ViewByUserComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
        else if (errors.email) {
            return "Not valid";
        }
    };
    ViewByUserComponent.prototype.isValid = function (field) {
        var input = this.contact.get(field);
        return input.dirty && input.invalid;
    };
    ViewByUserComponent.prototype.fieldClass = function (field) {
        return { 'is-invalid': this.isValid(field) };
    };
    Object.defineProperty(ViewByUserComponent.prototype, "image", {
        get: function () {
            if (this.portfolio$ != null) {
                if (this.imageToShow == null) {
                    return '../../../assets/images/default-profile-pic.png';
                }
                else {
                    return this.imageToShow;
                }
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    ViewByUserComponent.prototype.createImageFromBlob = function (image) {
        var _this = this;
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            _this.imageToShow = reader.result;
        }, false);
        if (image) {
            reader.readAsDataURL(image);
        }
    };
    Object.defineProperty(ViewByUserComponent.prototype, "pdf", {
        get: function () {
            if (this.pdfToShow == null) {
                return '../../../assets/files/default-pdf.pdf';
            }
            else {
                return this.pdfToShow;
            }
        },
        enumerable: true,
        configurable: true
    });
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], ViewByUserComponent.prototype, "id", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"])
    ], ViewByUserComponent.prototype, "portfolio$", void 0);
    ViewByUserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-view-by-user',
            template: __webpack_require__(/*! ./view-by-user.component.html */ "./src/app/portfolio/view-by-user/view-by-user.component.html"),
            styles: [__webpack_require__(/*! ./view-by-user.component.css */ "./src/app/portfolio/view-by-user/view-by-user.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_5__["PortfolioDataService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["DomSanitizer"]])
    ], ViewByUserComponent);
    return ViewByUserComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-by-user/work/work.component.css":
/*!****************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/work/work.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BvcnRmb2xpby92aWV3LWJ5LXVzZXIvd29yay93b3JrLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/work/work.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/work/work.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"showMsg\">  \n    <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n        <strong>Succesfully Added a work!</strong>\n    \n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n  </div>\n</div>\n<div *ngIf=\"work$ | async as wrk\">\n  <div class=\"text-center\" *ngIf=\"wrk.length != 0\">\n    <h3 class=\"white-text text-white\">\n      Works\n    </h3>\n    <hr class=\"hr-light\" />\n  </div>\n\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-md-4 mb-4\" *ngFor=\"let work of work$ | async\">\n          <div class=\"card h-100 mb-4 shadow-sm\">\n            <img\n              class=\"card-img\"\n              src=\"{{ work.imagePath }}\"\n              height=\"225\"\n              alt=\"{{ work.workName }}\"\n            />\n            <div class=\"card-body\">\n              <h5 class=\"card-title\">{{ work.workName }}</h5>\n              <p class=\"card-text\">{{ work.description }}</p>\n              \n            </div>\n            <div class=\"d-flex justify-content-between align-items-center\">\n                <div class=\"btn-group ml-2 mb-2\">\n                  <a\n                    href=\"{{ work.link }}\"\n                    target=\"_blank\"\n                    class=\"btn btn-sm btn-outline-secondary\"\n                    >View</a\n                  >\n                  <a\n                  (click)=\"delete(work.id)\"\n                  class=\"btn btn-sm btn-outline-warning\"\n                  >delete</a\n                >\n                </div>\n                <small class=\"text-muted mr-2 mb-2\">{{ formatDate(work.timePublished) }}</small>\n              </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n\n  <div class=\"text-center\">\n    <h3 class=\"white-text text-white\">\n      Add Work:\n    </h3>\n    <hr class=\"hr-light\" />\n  </div>\n  <form [formGroup]=\"work\" (ngSubmit)=\"onSubmit()\">\n    <div class=\"row mt-2\">\n      <div class=\"col-lg-6 mx-auto\">\n        <div class=\"input-group mb-3\">\n          <div class=\"input-group-prepend\">\n            <span class=\"input-group-text\" id=\"basic-addon1\">\n              <mat-icon>assignment</mat-icon>\n            </span>\n          </div>\n          <input\n            type=\"text\"\n            class=\"form-control mr-sm-2\"\n            placeholder=\"Name\"\n            aria-label=\"Name\"\n            aria-describedby=\"basic-addon1\"\n            formControlName=\"name\"\n            [ngClass]=\"fieldClass('name')\"\n          />\n          <div class=\"invalid-feedback\" *ngIf=\"isValid('name')\">\n              name {{ getErrorMessage(work.get(\"name\").errors) }}\n            </div>\n        </div>\n        \n        <div class=\"input-group mb-3\">\n          <div class=\"input-group-prepend\">\n            <span class=\"input-group-text\" id=\"basic-addon1\">\n              <mat-icon>description</mat-icon>\n            </span>\n          </div>\n          <textarea\n            class=\"form-control mr-sm-2\"\n            rows=\"4\"\n            id=\"comment\"\n            placeholder=\"What is this work about, Why did you make it, what technologies did you use...\"\n            aria-label=\"About Me\"\n            aria-describedby=\"basic-addon1\"\n            formControlName=\"description\"\n            [ngClass]=\"fieldClass('description')\"\n          ></textarea>\n          <div class=\"invalid-feedback\" *ngIf=\"isValid('description')\">\n              description {{ getErrorMessage(work.get(\"description\").errors) }}\n            </div>\n        </div>\n        \n      </div>\n      <div class=\"col-lg-6 mx-auto\">\n        <div class=\"input-group mb-3\">\n          <div class=\"input-group-prepend\">\n            <span class=\"input-group-text\" id=\"basic-addon1\">\n              <mat-icon>add_a_photo</mat-icon>\n            </span>\n          </div>\n          <input\n            type=\"url\"\n            class=\"form-control mr-sm-2\"\n            placeholder=\"image\"\n            aria-label=\"image\"\n            aria-describedby=\"basic-addon1\"\n            formControlName=\"imagePath\"\n            [ngClass]=\"fieldClass('imagePath')\"\n          />\n          <div class=\"invalid-feedback\" *ngIf=\"isValid('imagePath')\">\n              image {{ getErrorMessage(work.get(\"imagePath\").errors) }}\n            </div>\n        </div>\n        \n\n        <div class=\"input-group mb-3\">\n          <div class=\"input-group-prepend\">\n            <span class=\" input-group-text\" id=\"basic-addon2\">\n              <mat-icon>link</mat-icon>\n            </span>\n          </div>\n          <input\n            type=\"url\"\n            class=\"form-control mr-sm-2\"\n            placeholder=\"Link\"\n            aria-label=\"Link\"\n            aria-describedby=\"basic-addon2\"\n            formControlName=\"link\"\n            [ngClass]=\"fieldClass('link')\"\n          />\n          <div class=\"invalid-feedback\" *ngIf=\"isValid('link')\">\n              link {{ getErrorMessage(work.get(\"link\").errors) }}\n            </div>\n        </div>\n\n        \n\n        <div class=\"input-group mb-3\">\n          <div class=\"input-group-prepend\">\n            <span class=\" input-group-text\" id=\"basic-addon2\">\n              <mat-icon>timeline</mat-icon>\n            </span>\n          </div>\n          <input\n           [matDatepicker]=\"myDatepicker\"\n            type=\"text\"\n            onfocus=\"(this.type='date')\"\n            onblur=\"(this.type='text')\"\n            class=\"form-control mr-sm-2\"\n            placeholder=\"Published\"\n            aria-label=\"Published\"\n            aria-describedby=\"basic-addon2\"\n            formControlName=\"timePublished\"\n            [ngClass]=\"fieldClass('timePublished')\"\n          />\n          <div class=\"invalid-feedback\" *ngIf=\"isValid('timePublished')\">\n              Published {{ getErrorMessage(work.get(\"timePublished\").errors) }}\n            </div>\n          <mat-datepicker #myDatepicker></mat-datepicker>\n        </div>\n      </div>\n    </div>\n    <div class=\"mt-auto\">\n      <button type=\"submit\" class=\"btn btn-outline-light \" [disabled]=\"work.invalid\">Add Work</button>\n    </div>\n  </form>\n</div>\n"

/***/ }),

/***/ "./src/app/portfolio/view-by-user/work/work.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/portfolio/view-by-user/work/work.component.ts ***!
  \***************************************************************/
/*! exports provided: WorkComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkComponent", function() { return WorkComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");




var WorkComponent = /** @class */ (function () {
    function WorkComponent(fb, _portfolioDataService) {
        this.fb = fb;
        this._portfolioDataService = _portfolioDataService;
    }
    WorkComponent.prototype.ngOnInit = function () {
        var reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.work = this.fb.group({
            name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            description: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            imagePath: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            link: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(reg)]],
            timePublished: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]]
        });
        this.work$ = this._portfolioDataService.getWork(this.id);
    };
    WorkComponent.prototype.formatDate = function (date) {
        var d = new Date(date);
        return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    };
    WorkComponent.prototype.onSubmit = function () {
        var _this = this;
        this._portfolioDataService.postWork(this.id, {
            workName: this.work.value.name,
            description: this.work.value.description,
            imagePath: this.work.value.imagePath,
            link: this.work.value.link,
            timePublished: this.work.value.timePublished
        }).subscribe(function (val) { return _this.showMsg = true; });
        this.work$ = this._portfolioDataService.getWork(this.id);
    };
    WorkComponent.prototype.delete = function (id) {
        if (confirm("Are you sure you want to delete this work?")) {
            this._portfolioDataService.deleteWork(this.id, id);
            this.work$ = this._portfolioDataService.getWork(this.id);
        }
    };
    WorkComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.pattern) {
            return "You must provide an URL";
        }
    };
    WorkComponent.prototype.isValid = function (field) {
        var input = this.work.get(field);
        return input.dirty && input.invalid;
    };
    WorkComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], WorkComponent.prototype, "id", void 0);
    WorkComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-work',
            template: __webpack_require__(/*! ./work.component.html */ "./src/app/portfolio/view-by-user/work/work.component.html"),
            styles: [__webpack_require__(/*! ./work.component.css */ "./src/app/portfolio/view-by-user/work/work.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _portfolio_data_service__WEBPACK_IMPORTED_MODULE_3__["PortfolioDataService"]])
    ], WorkComponent);
    return WorkComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-portfolio/not-found/not-found.component.css":
/*!****************************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/not-found/not-found.component.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".error-template {padding: 40px 15px;text-align: center;}\r\n.error-actions {margin-top:15px;margin-bottom:15px;}\r\n.error-actions .btn { margin-right:10px; }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9ydGZvbGlvL3ZpZXctcG9ydGZvbGlvL25vdC1mb3VuZC9ub3QtZm91bmQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUIsa0JBQWtCLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsZ0JBQWdCLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztBQUNuRCxzQkFBc0IsaUJBQWlCLEVBQUUiLCJmaWxlIjoic3JjL2FwcC9wb3J0Zm9saW8vdmlldy1wb3J0Zm9saW8vbm90LWZvdW5kL25vdC1mb3VuZC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmVycm9yLXRlbXBsYXRlIHtwYWRkaW5nOiA0MHB4IDE1cHg7dGV4dC1hbGlnbjogY2VudGVyO31cclxuLmVycm9yLWFjdGlvbnMge21hcmdpbi10b3A6MTVweDttYXJnaW4tYm90dG9tOjE1cHg7fVxyXG4uZXJyb3ItYWN0aW9ucyAuYnRuIHsgbWFyZ2luLXJpZ2h0OjEwcHg7IH0iXX0= */"

/***/ }),

/***/ "./src/app/portfolio/view-portfolio/not-found/not-found.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/not-found/not-found.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"error-template\">\n        <h1>\n          Oops!\n        </h1>\n        <h2>\n          404 Portfolio Not Found\n        </h2>\n        <div class=\"error-details\">\n          Sorry, it looks like this portfolio does not exist, are you sure you\n          have the correct link?\n        </div>\n        <div class=\"error-actions\">\n          <a href=\"\" class=\"btn btn-outline-dark mr-sm-2\"\n            ><span class=\"glyphicon glyphicon-home\"></span> Take Me Home </a\n          ><a\n            href=\"\"\n            class=\"btn btn-outline-dark mr-sm-2\"\n            data-toggle=\"collapse\"\n            data-target=\"#collapseExample\"\n            ><span class=\"glyphicon glyphicon-envelope\"></span> Contact Support\n          </a>\n        </div>\n        <iframe\n          class=\"collapse\"\n          id=\"collapseExample\"\n          width=\"560\"\n          height=\"315\"\n          src=\"https://www.youtube.com/embed/1vrEljMfXYo\"\n          frameborder=\"0\"\n          allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\"\n          allowfullscreen\n        ></iframe>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/portfolio/view-portfolio/not-found/not-found.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/not-found/not-found.component.ts ***!
  \***************************************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var NotFoundComponent = /** @class */ (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent.prototype.ngOnInit = function () {
    };
    NotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-not-found',
            template: __webpack_require__(/*! ./not-found.component.html */ "./src/app/portfolio/view-portfolio/not-found/not-found.component.html"),
            styles: [__webpack_require__(/*! ./not-found.component.css */ "./src/app/portfolio/view-portfolio/not-found/not-found.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NotFoundComponent);
    return NotFoundComponent;
}());



/***/ }),

/***/ "./src/app/portfolio/view-portfolio/view-portfolio.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/view-portfolio.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "body, html {\r\n  height: 100%;\r\n}\r\n.app-loading {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  height: 100%;\r\n}\r\n.app-loading .spinner {\r\n  height: 200px;\r\n  width: 200px;\r\n  -webkit-animation: rotate 2s linear infinite;\r\n          animation: rotate 2s linear infinite;\r\n  -webkit-transform-origin: center center;\r\n          transform-origin: center center;\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  margin: auto;\r\n}\r\n.app-loading .spinner .path {\r\n  stroke-dasharray: 1, 200;\r\n  stroke-dashoffset: 0;\r\n  -webkit-animation: dash 1.5s ease-in-out infinite;\r\n          animation: dash 1.5s ease-in-out infinite;\r\n  stroke-linecap: round;\r\n  stroke: #ddd;\r\n}\r\n@-webkit-keyframes rotate {\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n@keyframes rotate {\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n@-webkit-keyframes dash {\r\n  0% {\r\n    stroke-dasharray: 1, 200;\r\n    stroke-dashoffset: 0;\r\n  }\r\n  50% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -35px;\r\n  }\r\n  100% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -124px;\r\n  }\r\n}\r\n@keyframes dash {\r\n  0% {\r\n    stroke-dasharray: 1, 200;\r\n    stroke-dashoffset: 0;\r\n  }\r\n  50% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -35px;\r\n  }\r\n  100% {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: -124px;\r\n  }\r\n}\r\n.modal.in .modal-dialog {\r\n  -webkit-transform: none;\r\n          transform: none; /*translate(0px, 0px);*/\r\n}\r\n.modal-xlg {\r\n  width: 80%; \r\n}\r\n.card {\r\n  background-color: rgba(199, 199, 199, 0.2);\r\n}\r\n/* default\r\n --------------------------------------------------------------- */\r\n.row {\r\n  width: 96%;\r\n  max-width: 1020px;\r\n  margin: 0 auto;\r\n}\r\n/* fixed width for IE8 */\r\n.ie .row { width: 1000px ; }\r\n.narrow .row { max-width: 980px; }\r\n.row .row { width: auto; max-width: none; margin: 0 -20px; }\r\n/* row clearing */\r\n.row:before,\r\n.row:after {\r\n   content: \" \";\r\n   display: table;\r\n}\r\n.row:after {\r\n   clear: both;\r\n}\r\n.column, .columns {\r\n    position: relative;\r\n    padding: 0 20px;\r\n    min-height: 1px;\r\n    float: left;\r\n }\r\n.column.centered, .columns.centered  {\r\n     float: none;\r\n     margin: 0 auto;\r\n }\r\n/* removed gutters */\r\n.row.collapsed > .column,\r\n .row.collapsed > .columns,\r\n .column.collapsed, .columns.collapsed  { padding: 0; }\r\n[class*=\"column\"] + [class*=\"column\"]:last-child { float: right; }\r\n[class*=\"column\"] + [class*=\"column\"].end { float: right; }\r\n/* column widths */\r\n.row .one         { width: 8.33333%; }\r\n.row .two         { width: 16.66667%; }\r\n.row .three       { width: 25%; }\r\n.row .four        { width: 33.33333%; }\r\n.row .five        { width: 41.66667%; }\r\n.row .six         { width: 50%; }\r\n.row .seven       { width: 58.33333%; }\r\n.row .eight       { width: 66.66667%; }\r\n.row .nine        { width: 75%; }\r\n.row .ten         { width: 83.33333%; }\r\n.row .eleven      { width: 91.66667%; }\r\n.row .twelve      { width: 100%; }\r\n/* Offsets */\r\n.row .offset-1    { margin-left: 8.33333%; }\r\n.row .offset-2    { margin-left: 16.66667%; }\r\n.row .offset-3    { margin-left: 25%; }\r\n.row .offset-4    { margin-left: 33.33333%; }\r\n.row .offset-5    { margin-left: 41.66667%; }\r\n.row .offset-6    { margin-left: 50%; }\r\n.row .offset-7    { margin-left: 58.33333%; }\r\n.row .offset-8    { margin-left: 66.66667%; }\r\n.row .offset-9    { margin-left: 75%; }\r\n.row .offset-10   { margin-left: 83.33333%; }\r\n.row .offset-11   { margin-left: 91.66667%; }\r\n/* Push/Pull */\r\n.row .push-1      { left: 8.33333%; }\r\n.row .pull-1      { right: 8.33333%; }\r\n.row .push-2      { left: 16.66667%; \t}\r\n.row .pull-2      { right: 16.66667%; }\r\n.row .push-3      { left: 25%; }\r\n.row .pull-3      { right: 25%;\t}\r\n.row .push-4      { left: 33.33333%; }\r\n.row .pull-4      { right: 33.33333%; }\r\n.row .push-5      { left: 41.66667%; }\r\n.row .pull-5      { right: 41.66667%; }\r\n.row .push-6      { left: 50%; }\r\n.row .pull-6      { right: 50%; }\r\n.row .push-7      { left: 58.33333%; }\r\n.row .pull-7      { right: 58.33333%; }\r\n.row .push-8      { left: 66.66667%; \t}\r\n.row .pull-8      { right: 66.66667%; }\r\n.row .push-9      { left: 75%; }\r\n.row .pull-9      { right: 75%; }\r\n.row .push-10     { left: 83.33333%; }\r\n.row .pull-10     { right: 83.33333%; }\r\n.row .push-11     { left: 91.66667%; }\r\n.row .pull-11     { right: 91.66667%; }\r\n/* mobile wide/smaller tablets\r\n --------------------------------------------------------------- */\r\n@media only screen and (max-width: 767px) {\r\n \r\n    .row {\r\n      width: 460px;\r\n      margin: 0 auto;\r\n       padding: 0;\r\n   }\r\n    .column, .columns {\r\n      width: auto !important;\r\n      float: none;\r\n      margin-left: 0;\r\n      margin-right: 0;\r\n       padding: 0 30px;\r\n    }\r\n    .row .row { width: auto; max-width: none; margin: 0 -30px; }\r\n \r\n    [class*=\"column\"] + [class*=\"column\"]:last-child { float: none; }\r\n    [class*=\"bgrid\"] [class*=\"column\"] + [class*=\"column\"]:last-child { float: none; }\r\n \r\n    /* Offsets */\r\n    .row .offset-1    { margin-left: 0%; }\r\n    .row .offset-2    { margin-left: 0%; }\r\n    .row .offset-3    { margin-left: 0%; }\r\n    .row .offset-4    { margin-left: 0%; }\r\n    .row .offset-5    { margin-left: 0%; }\r\n    .row .offset-6    { margin-left: 0%; }\r\n    .row .offset-7    { margin-left: 0%; }\r\n    .row .offset-8    { margin-left: 0%; }\r\n    .row .offset-9    { margin-left: 0%; }\r\n    .row .offset-10   { margin-left: 0%; }\r\n    .row .offset-11   { margin-left: 0%; }\r\n }\r\n/* mobile narrow\r\n --------------------------------------------------------------- */\r\n@media only screen and (max-width: 460px) {\r\n \r\n    .row { width: auto; }\r\n \r\n }\r\n/* larger screens\r\n --------------------------------------------------------------- */\r\n@media screen and (min-width: 1200px) {\r\n \r\n    .wide .row { max-width: 1180px; }\r\n \r\n }\r\n.bd-placeholder-img {\r\n        font-size: 1.125rem;\r\n        text-anchor: middle;\r\n        -webkit-user-select: none;\r\n        -moz-user-select: none;\r\n        -ms-user-select: none;\r\n        user-select: none;\r\n      }\r\n.jumbotron {\r\n    padding-top: 3rem;\r\n    padding-bottom: 3rem;\r\n    margin-bottom: 0;\r\n    background-color: #fff;\r\n  }\r\n@media (min-width: 768px) {\r\n    .jumbotron {\r\n      padding-top: 6rem;\r\n      padding-bottom: 6rem;\r\n    }\r\n    .bd-placeholder-img-lg {\r\n        font-size: 3.5rem;\r\n      }\r\n  }\r\n.jumbotron p:last-child {\r\n    margin-bottom: 0;\r\n  }\r\n.jumbotron-heading {\r\n    font-weight: 300;\r\n  }\r\n.jumbotron .container {\r\n    max-width: 40rem;\r\n  }\r\nfooter {\r\n    padding-top: 3rem;\r\n    padding-bottom: 3rem;\r\n    background-color: white;\r\n  }\r\nfooter p {\r\n    margin-bottom: .25rem;\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9ydGZvbGlvL3ZpZXctcG9ydGZvbGlvL3ZpZXctcG9ydGZvbGlvLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFZO0FBQ2Q7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsWUFBWTtBQUNkO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsWUFBWTtFQUNaLDRDQUFvQztVQUFwQyxvQ0FBb0M7RUFDcEMsdUNBQStCO1VBQS9CLCtCQUErQjtFQUMvQixrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFNBQVM7RUFDVCxPQUFPO0VBQ1AsUUFBUTtFQUNSLFlBQVk7QUFDZDtBQUNBO0VBQ0Usd0JBQXdCO0VBQ3hCLG9CQUFvQjtFQUNwQixpREFBeUM7VUFBekMseUNBQXlDO0VBQ3pDLHFCQUFxQjtFQUNyQixZQUFZO0FBQ2Q7QUFDQTtFQUNFO0lBQ0UsaUNBQXlCO1lBQXpCLHlCQUF5QjtFQUMzQjtBQUNGO0FBSkE7RUFDRTtJQUNFLGlDQUF5QjtZQUF6Qix5QkFBeUI7RUFDM0I7QUFDRjtBQUNBO0VBQ0U7SUFDRSx3QkFBd0I7SUFDeEIsb0JBQW9CO0VBQ3RCO0VBQ0E7SUFDRSx5QkFBeUI7SUFDekIsd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSx5QkFBeUI7SUFDekIseUJBQXlCO0VBQzNCO0FBQ0Y7QUFiQTtFQUNFO0lBQ0Usd0JBQXdCO0lBQ3hCLG9CQUFvQjtFQUN0QjtFQUNBO0lBQ0UseUJBQXlCO0lBQ3pCLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UseUJBQXlCO0lBQ3pCLHlCQUF5QjtFQUMzQjtBQUNGO0FBRUE7RUFDRSx1QkFBZTtVQUFmLGVBQWUsRUFBRSx1QkFBdUI7QUFDMUM7QUFFQTtFQUNFLFVBQVU7QUFDWjtBQUNBO0VBQ0UsMENBQTBDO0FBQzVDO0FBQ0M7a0VBQ2lFO0FBQ2pFO0VBQ0MsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixjQUFjO0FBQ2hCO0FBQ0Esd0JBQXdCO0FBQ3hCLFdBQVcsY0FBYyxFQUFFO0FBRTNCLGVBQWUsZ0JBQWdCLEVBQUU7QUFFakMsWUFBWSxXQUFXLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRTtBQUUzRCxpQkFBaUI7QUFDakI7O0dBRUcsWUFBWTtHQUNaLGNBQWM7QUFDakI7QUFDQTtHQUNHLFdBQVc7QUFDZDtBQUVDO0lBQ0csa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixlQUFlO0lBQ2YsV0FBVztDQUNkO0FBQ0E7S0FDSSxXQUFXO0tBQ1gsY0FBYztDQUNsQjtBQUVBLG9CQUFvQjtBQUNwQjs7MENBRXlDLFVBQVUsRUFBRTtBQUVyRCxtREFBbUQsWUFBWSxFQUFFO0FBQ2pFLDRDQUE0QyxZQUFZLEVBQUU7QUFFMUQsa0JBQWtCO0FBQ2xCLG9CQUFvQixlQUFlLEVBQUU7QUFDckMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixVQUFVLEVBQUU7QUFDaEMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixnQkFBZ0IsRUFBRTtBQUN0QyxvQkFBb0IsVUFBVSxFQUFFO0FBQ2hDLG9CQUFvQixnQkFBZ0IsRUFBRTtBQUN0QyxvQkFBb0IsZ0JBQWdCLEVBQUU7QUFDdEMsb0JBQW9CLFVBQVUsRUFBRTtBQUNoQyxvQkFBb0IsZ0JBQWdCLEVBQUU7QUFDdEMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixXQUFXLEVBQUU7QUFFakMsWUFBWTtBQUNaLG9CQUFvQixxQkFBcUIsRUFBRTtBQUMzQyxvQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixzQkFBc0IsRUFBRTtBQUM1QyxvQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixzQkFBc0IsRUFBRTtBQUM1QyxvQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixzQkFBc0IsRUFBRTtBQUM1QyxvQkFBb0Isc0JBQXNCLEVBQUU7QUFFNUMsY0FBYztBQUNkLG9CQUFvQixjQUFjLEVBQUU7QUFDcEMsb0JBQW9CLGVBQWUsRUFBRTtBQUNyQyxvQkFBb0IsZUFBZSxHQUFHO0FBQ3RDLG9CQUFvQixnQkFBZ0IsRUFBRTtBQUN0QyxvQkFBb0IsU0FBUyxFQUFFO0FBQy9CLG9CQUFvQixVQUFVLEVBQUU7QUFDaEMsb0JBQW9CLGVBQWUsRUFBRTtBQUNyQyxvQkFBb0IsZ0JBQWdCLEVBQUU7QUFDdEMsb0JBQW9CLGVBQWUsRUFBRTtBQUNyQyxvQkFBb0IsZ0JBQWdCLEVBQUU7QUFDdEMsb0JBQW9CLFNBQVMsRUFBRTtBQUMvQixvQkFBb0IsVUFBVSxFQUFFO0FBQ2hDLG9CQUFvQixlQUFlLEVBQUU7QUFDckMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixlQUFlLEdBQUc7QUFDdEMsb0JBQW9CLGdCQUFnQixFQUFFO0FBQ3RDLG9CQUFvQixTQUFTLEVBQUU7QUFDL0Isb0JBQW9CLFVBQVUsRUFBRTtBQUNoQyxvQkFBb0IsZUFBZSxFQUFFO0FBQ3JDLG9CQUFvQixnQkFBZ0IsRUFBRTtBQUN0QyxvQkFBb0IsZUFBZSxFQUFFO0FBQ3JDLG9CQUFvQixnQkFBZ0IsRUFBRTtBQUl0QztrRUFDaUU7QUFDakU7O0lBRUc7TUFDRSxZQUFZO01BQ1osY0FBYztPQUNiLFVBQVU7R0FDZDtJQUNDO01BQ0Usc0JBQXNCO01BQ3RCLFdBQVc7TUFDWCxjQUFjO01BQ2QsZUFBZTtPQUNkLGVBQWU7SUFDbEI7SUFDQSxZQUFZLFdBQVcsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFOztJQUUzRCxtREFBbUQsV0FBVyxFQUFFO0lBQ2hFLG9FQUFvRSxXQUFXLEVBQUU7O0lBRWpGLFlBQVk7SUFDWixvQkFBb0IsZUFBZSxFQUFFO0lBQ3JDLG9CQUFvQixlQUFlLEVBQUU7SUFDckMsb0JBQW9CLGVBQWUsRUFBRTtJQUNyQyxvQkFBb0IsZUFBZSxFQUFFO0lBQ3JDLG9CQUFvQixlQUFlLEVBQUU7SUFDckMsb0JBQW9CLGVBQWUsRUFBRTtJQUNyQyxvQkFBb0IsZUFBZSxFQUFFO0lBQ3JDLG9CQUFvQixlQUFlLEVBQUU7SUFDckMsb0JBQW9CLGVBQWUsRUFBRTtJQUNyQyxvQkFBb0IsZUFBZSxFQUFFO0lBQ3JDLG9CQUFvQixlQUFlLEVBQUU7Q0FDeEM7QUFFQTtrRUFDaUU7QUFDakU7O0lBRUcsT0FBTyxXQUFXLEVBQUU7O0NBRXZCO0FBRUE7a0VBQ2lFO0FBQ2pFOztJQUVHLGFBQWEsaUJBQWlCLEVBQUU7O0NBRW5DO0FBT0Q7UUFDUSxtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLHlCQUF5QjtRQUN6QixzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLGlCQUFpQjtNQUNuQjtBQUlOO0lBQ0ksaUJBQWlCO0lBQ2pCLG9CQUFvQjtJQUNwQixnQkFBZ0I7SUFDaEIsc0JBQXNCO0VBQ3hCO0FBQ0E7SUFDRTtNQUNFLGlCQUFpQjtNQUNqQixvQkFBb0I7SUFDdEI7SUFDQTtRQUNJLGlCQUFpQjtNQUNuQjtFQUNKO0FBRUE7SUFDRSxnQkFBZ0I7RUFDbEI7QUFFQTtJQUNFLGdCQUFnQjtFQUNsQjtBQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCO0FBRUE7SUFDRSxpQkFBaUI7SUFDakIsb0JBQW9CO0lBQ3BCLHVCQUF1QjtFQUN6QjtBQUVBO0lBQ0UscUJBQXFCO0VBQ3ZCIiwiZmlsZSI6InNyYy9hcHAvcG9ydGZvbGlvL3ZpZXctcG9ydGZvbGlvL3ZpZXctcG9ydGZvbGlvLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5LCBodG1sIHtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuLmFwcC1sb2FkaW5nIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcbi5hcHAtbG9hZGluZyAuc3Bpbm5lciB7XHJcbiAgaGVpZ2h0OiAyMDBweDtcclxuICB3aWR0aDogMjAwcHg7XHJcbiAgYW5pbWF0aW9uOiByb3RhdGUgMnMgbGluZWFyIGluZmluaXRlO1xyXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBib3R0b206IDA7XHJcbiAgbGVmdDogMDtcclxuICByaWdodDogMDtcclxuICBtYXJnaW46IGF1dG87XHJcbn1cclxuLmFwcC1sb2FkaW5nIC5zcGlubmVyIC5wYXRoIHtcclxuICBzdHJva2UtZGFzaGFycmF5OiAxLCAyMDA7XHJcbiAgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7XHJcbiAgYW5pbWF0aW9uOiBkYXNoIDEuNXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XHJcbiAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xyXG4gIHN0cm9rZTogI2RkZDtcclxufVxyXG5Aa2V5ZnJhbWVzIHJvdGF0ZSB7XHJcbiAgMTAwJSB7XHJcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xyXG4gIH1cclxufVxyXG5Aa2V5ZnJhbWVzIGRhc2gge1xyXG4gIDAlIHtcclxuICAgIHN0cm9rZS1kYXNoYXJyYXk6IDEsIDIwMDtcclxuICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAwO1xyXG4gIH1cclxuICA1MCUge1xyXG4gICAgc3Ryb2tlLWRhc2hhcnJheTogODksIDIwMDtcclxuICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtMzVweDtcclxuICB9XHJcbiAgMTAwJSB7XHJcbiAgICBzdHJva2UtZGFzaGFycmF5OiA4OSwgMjAwO1xyXG4gICAgc3Ryb2tlLWRhc2hvZmZzZXQ6IC0xMjRweDtcclxuICB9XHJcbn1cclxuXHJcbi5tb2RhbC5pbiAubW9kYWwtZGlhbG9nIHtcclxuICB0cmFuc2Zvcm06IG5vbmU7IC8qdHJhbnNsYXRlKDBweCwgMHB4KTsqL1xyXG59XHJcblxyXG4ubW9kYWwteGxnIHtcclxuICB3aWR0aDogODAlOyBcclxufVxyXG4uY2FyZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxOTksIDE5OSwgMTk5LCAwLjIpO1xyXG59XHJcbiAvKiBkZWZhdWx0XHJcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuIC5yb3cge1xyXG4gIHdpZHRoOiA5NiU7XHJcbiAgbWF4LXdpZHRoOiAxMDIwcHg7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbn1cclxuLyogZml4ZWQgd2lkdGggZm9yIElFOCAqL1xyXG4uaWUgLnJvdyB7IHdpZHRoOiAxMDAwcHggOyB9XHJcblxyXG4ubmFycm93IC5yb3cgeyBtYXgtd2lkdGg6IDk4MHB4OyB9XHJcblxyXG4ucm93IC5yb3cgeyB3aWR0aDogYXV0bzsgbWF4LXdpZHRoOiBub25lOyBtYXJnaW46IDAgLTIwcHg7IH1cclxuXHJcbi8qIHJvdyBjbGVhcmluZyAqL1xyXG4ucm93OmJlZm9yZSxcclxuLnJvdzphZnRlciB7XHJcbiAgIGNvbnRlbnQ6IFwiIFwiO1xyXG4gICBkaXNwbGF5OiB0YWJsZTtcclxufVxyXG4ucm93OmFmdGVyIHtcclxuICAgY2xlYXI6IGJvdGg7XHJcbn1cclxuIFxyXG4gLmNvbHVtbiwgLmNvbHVtbnMge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgcGFkZGluZzogMCAyMHB4O1xyXG4gICAgbWluLWhlaWdodDogMXB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiB9XHJcbiAuY29sdW1uLmNlbnRlcmVkLCAuY29sdW1ucy5jZW50ZXJlZCAge1xyXG4gICAgIGZsb2F0OiBub25lO1xyXG4gICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gfVxyXG4gXHJcbiAvKiByZW1vdmVkIGd1dHRlcnMgKi9cclxuIC5yb3cuY29sbGFwc2VkID4gLmNvbHVtbixcclxuIC5yb3cuY29sbGFwc2VkID4gLmNvbHVtbnMsXHJcbiAuY29sdW1uLmNvbGxhcHNlZCwgLmNvbHVtbnMuY29sbGFwc2VkICB7IHBhZGRpbmc6IDA7IH1cclxuIFxyXG4gW2NsYXNzKj1cImNvbHVtblwiXSArIFtjbGFzcyo9XCJjb2x1bW5cIl06bGFzdC1jaGlsZCB7IGZsb2F0OiByaWdodDsgfVxyXG4gW2NsYXNzKj1cImNvbHVtblwiXSArIFtjbGFzcyo9XCJjb2x1bW5cIl0uZW5kIHsgZmxvYXQ6IHJpZ2h0OyB9XHJcbiBcclxuIC8qIGNvbHVtbiB3aWR0aHMgKi9cclxuIC5yb3cgLm9uZSAgICAgICAgIHsgd2lkdGg6IDguMzMzMzMlOyB9XHJcbiAucm93IC50d28gICAgICAgICB7IHdpZHRoOiAxNi42NjY2NyU7IH1cclxuIC5yb3cgLnRocmVlICAgICAgIHsgd2lkdGg6IDI1JTsgfVxyXG4gLnJvdyAuZm91ciAgICAgICAgeyB3aWR0aDogMzMuMzMzMzMlOyB9XHJcbiAucm93IC5maXZlICAgICAgICB7IHdpZHRoOiA0MS42NjY2NyU7IH1cclxuIC5yb3cgLnNpeCAgICAgICAgIHsgd2lkdGg6IDUwJTsgfVxyXG4gLnJvdyAuc2V2ZW4gICAgICAgeyB3aWR0aDogNTguMzMzMzMlOyB9XHJcbiAucm93IC5laWdodCAgICAgICB7IHdpZHRoOiA2Ni42NjY2NyU7IH1cclxuIC5yb3cgLm5pbmUgICAgICAgIHsgd2lkdGg6IDc1JTsgfVxyXG4gLnJvdyAudGVuICAgICAgICAgeyB3aWR0aDogODMuMzMzMzMlOyB9XHJcbiAucm93IC5lbGV2ZW4gICAgICB7IHdpZHRoOiA5MS42NjY2NyU7IH1cclxuIC5yb3cgLnR3ZWx2ZSAgICAgIHsgd2lkdGg6IDEwMCU7IH1cclxuIFxyXG4gLyogT2Zmc2V0cyAqL1xyXG4gLnJvdyAub2Zmc2V0LTEgICAgeyBtYXJnaW4tbGVmdDogOC4zMzMzMyU7IH1cclxuIC5yb3cgLm9mZnNldC0yICAgIHsgbWFyZ2luLWxlZnQ6IDE2LjY2NjY3JTsgfVxyXG4gLnJvdyAub2Zmc2V0LTMgICAgeyBtYXJnaW4tbGVmdDogMjUlOyB9XHJcbiAucm93IC5vZmZzZXQtNCAgICB7IG1hcmdpbi1sZWZ0OiAzMy4zMzMzMyU7IH1cclxuIC5yb3cgLm9mZnNldC01ICAgIHsgbWFyZ2luLWxlZnQ6IDQxLjY2NjY3JTsgfVxyXG4gLnJvdyAub2Zmc2V0LTYgICAgeyBtYXJnaW4tbGVmdDogNTAlOyB9XHJcbiAucm93IC5vZmZzZXQtNyAgICB7IG1hcmdpbi1sZWZ0OiA1OC4zMzMzMyU7IH1cclxuIC5yb3cgLm9mZnNldC04ICAgIHsgbWFyZ2luLWxlZnQ6IDY2LjY2NjY3JTsgfVxyXG4gLnJvdyAub2Zmc2V0LTkgICAgeyBtYXJnaW4tbGVmdDogNzUlOyB9XHJcbiAucm93IC5vZmZzZXQtMTAgICB7IG1hcmdpbi1sZWZ0OiA4My4zMzMzMyU7IH1cclxuIC5yb3cgLm9mZnNldC0xMSAgIHsgbWFyZ2luLWxlZnQ6IDkxLjY2NjY3JTsgfVxyXG4gXHJcbiAvKiBQdXNoL1B1bGwgKi9cclxuIC5yb3cgLnB1c2gtMSAgICAgIHsgbGVmdDogOC4zMzMzMyU7IH1cclxuIC5yb3cgLnB1bGwtMSAgICAgIHsgcmlnaHQ6IDguMzMzMzMlOyB9XHJcbiAucm93IC5wdXNoLTIgICAgICB7IGxlZnQ6IDE2LjY2NjY3JTsgXHR9XHJcbiAucm93IC5wdWxsLTIgICAgICB7IHJpZ2h0OiAxNi42NjY2NyU7IH1cclxuIC5yb3cgLnB1c2gtMyAgICAgIHsgbGVmdDogMjUlOyB9XHJcbiAucm93IC5wdWxsLTMgICAgICB7IHJpZ2h0OiAyNSU7XHR9XHJcbiAucm93IC5wdXNoLTQgICAgICB7IGxlZnQ6IDMzLjMzMzMzJTsgfVxyXG4gLnJvdyAucHVsbC00ICAgICAgeyByaWdodDogMzMuMzMzMzMlOyB9XHJcbiAucm93IC5wdXNoLTUgICAgICB7IGxlZnQ6IDQxLjY2NjY3JTsgfVxyXG4gLnJvdyAucHVsbC01ICAgICAgeyByaWdodDogNDEuNjY2NjclOyB9XHJcbiAucm93IC5wdXNoLTYgICAgICB7IGxlZnQ6IDUwJTsgfVxyXG4gLnJvdyAucHVsbC02ICAgICAgeyByaWdodDogNTAlOyB9XHJcbiAucm93IC5wdXNoLTcgICAgICB7IGxlZnQ6IDU4LjMzMzMzJTsgfVxyXG4gLnJvdyAucHVsbC03ICAgICAgeyByaWdodDogNTguMzMzMzMlOyB9XHJcbiAucm93IC5wdXNoLTggICAgICB7IGxlZnQ6IDY2LjY2NjY3JTsgXHR9XHJcbiAucm93IC5wdWxsLTggICAgICB7IHJpZ2h0OiA2Ni42NjY2NyU7IH1cclxuIC5yb3cgLnB1c2gtOSAgICAgIHsgbGVmdDogNzUlOyB9XHJcbiAucm93IC5wdWxsLTkgICAgICB7IHJpZ2h0OiA3NSU7IH1cclxuIC5yb3cgLnB1c2gtMTAgICAgIHsgbGVmdDogODMuMzMzMzMlOyB9XHJcbiAucm93IC5wdWxsLTEwICAgICB7IHJpZ2h0OiA4My4zMzMzMyU7IH1cclxuIC5yb3cgLnB1c2gtMTEgICAgIHsgbGVmdDogOTEuNjY2NjclOyB9XHJcbiAucm93IC5wdWxsLTExICAgICB7IHJpZ2h0OiA5MS42NjY2NyU7IH1cclxuIFxyXG4gXHJcbiBcclxuIC8qIG1vYmlsZSB3aWRlL3NtYWxsZXIgdGFibGV0c1xyXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcbiBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2N3B4KSB7XHJcbiBcclxuICAgIC5yb3cge1xyXG4gICAgICB3aWR0aDogNDYwcHg7XHJcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgcGFkZGluZzogMDtcclxuICAgfVxyXG4gICAgLmNvbHVtbiwgLmNvbHVtbnMge1xyXG4gICAgICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xyXG4gICAgICBmbG9hdDogbm9uZTtcclxuICAgICAgbWFyZ2luLWxlZnQ6IDA7XHJcbiAgICAgIG1hcmdpbi1yaWdodDogMDtcclxuICAgICAgIHBhZGRpbmc6IDAgMzBweDtcclxuICAgIH1cclxuICAgIC5yb3cgLnJvdyB7IHdpZHRoOiBhdXRvOyBtYXgtd2lkdGg6IG5vbmU7IG1hcmdpbjogMCAtMzBweDsgfVxyXG4gXHJcbiAgICBbY2xhc3MqPVwiY29sdW1uXCJdICsgW2NsYXNzKj1cImNvbHVtblwiXTpsYXN0LWNoaWxkIHsgZmxvYXQ6IG5vbmU7IH1cclxuICAgIFtjbGFzcyo9XCJiZ3JpZFwiXSBbY2xhc3MqPVwiY29sdW1uXCJdICsgW2NsYXNzKj1cImNvbHVtblwiXTpsYXN0LWNoaWxkIHsgZmxvYXQ6IG5vbmU7IH1cclxuIFxyXG4gICAgLyogT2Zmc2V0cyAqL1xyXG4gICAgLnJvdyAub2Zmc2V0LTEgICAgeyBtYXJnaW4tbGVmdDogMCU7IH1cclxuICAgIC5yb3cgLm9mZnNldC0yICAgIHsgbWFyZ2luLWxlZnQ6IDAlOyB9XHJcbiAgICAucm93IC5vZmZzZXQtMyAgICB7IG1hcmdpbi1sZWZ0OiAwJTsgfVxyXG4gICAgLnJvdyAub2Zmc2V0LTQgICAgeyBtYXJnaW4tbGVmdDogMCU7IH1cclxuICAgIC5yb3cgLm9mZnNldC01ICAgIHsgbWFyZ2luLWxlZnQ6IDAlOyB9XHJcbiAgICAucm93IC5vZmZzZXQtNiAgICB7IG1hcmdpbi1sZWZ0OiAwJTsgfVxyXG4gICAgLnJvdyAub2Zmc2V0LTcgICAgeyBtYXJnaW4tbGVmdDogMCU7IH1cclxuICAgIC5yb3cgLm9mZnNldC04ICAgIHsgbWFyZ2luLWxlZnQ6IDAlOyB9XHJcbiAgICAucm93IC5vZmZzZXQtOSAgICB7IG1hcmdpbi1sZWZ0OiAwJTsgfVxyXG4gICAgLnJvdyAub2Zmc2V0LTEwICAgeyBtYXJnaW4tbGVmdDogMCU7IH1cclxuICAgIC5yb3cgLm9mZnNldC0xMSAgIHsgbWFyZ2luLWxlZnQ6IDAlOyB9XHJcbiB9XHJcbiBcclxuIC8qIG1vYmlsZSBuYXJyb3dcclxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG4gQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NjBweCkge1xyXG4gXHJcbiAgICAucm93IHsgd2lkdGg6IGF1dG87IH1cclxuIFxyXG4gfVxyXG4gXHJcbiAvKiBsYXJnZXIgc2NyZWVuc1xyXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcbiBAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjAwcHgpIHtcclxuIFxyXG4gICAgLndpZGUgLnJvdyB7IG1heC13aWR0aDogMTE4MHB4OyB9XHJcbiBcclxuIH1cclxuIFxyXG4gXHJcbiBcclxuIFxyXG4gXHJcbiBcclxuLmJkLXBsYWNlaG9sZGVyLWltZyB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxLjEyNXJlbTtcclxuICAgICAgICB0ZXh0LWFuY2hvcjogbWlkZGxlO1xyXG4gICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAgICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuLmp1bWJvdHJvbiB7XHJcbiAgICBwYWRkaW5nLXRvcDogM3JlbTtcclxuICAgIHBhZGRpbmctYm90dG9tOiAzcmVtO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgfVxyXG4gIEBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkge1xyXG4gICAgLmp1bWJvdHJvbiB7XHJcbiAgICAgIHBhZGRpbmctdG9wOiA2cmVtO1xyXG4gICAgICBwYWRkaW5nLWJvdHRvbTogNnJlbTtcclxuICAgIH1cclxuICAgIC5iZC1wbGFjZWhvbGRlci1pbWctbGcge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMy41cmVtO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC5qdW1ib3Ryb24gcDpsYXN0LWNoaWxkIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgfVxyXG4gIFxyXG4gIC5qdW1ib3Ryb24taGVhZGluZyB7XHJcbiAgICBmb250LXdlaWdodDogMzAwO1xyXG4gIH1cclxuICBcclxuICAuanVtYm90cm9uIC5jb250YWluZXIge1xyXG4gICAgbWF4LXdpZHRoOiA0MHJlbTtcclxuICB9XHJcbiAgXHJcbiAgZm9vdGVyIHtcclxuICAgIHBhZGRpbmctdG9wOiAzcmVtO1xyXG4gICAgcGFkZGluZy1ib3R0b206IDNyZW07XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICB9XHJcbiAgXHJcbiAgZm9vdGVyIHAge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogLjI1cmVtO1xyXG4gIH0iXX0= */"

/***/ }),

/***/ "./src/app/portfolio/view-portfolio/view-portfolio.component.html":
/*!************************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/view-portfolio.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-loading\" *ngIf=\"loadingRouteConfig\">\r\n    <div class=\"logo\"></div>\r\n    <svg class=\"spinner\" viewBox=\"25 25 50 50\">\r\n      <circle\r\n        class=\"path\"\r\n        cx=\"50\"\r\n        cy=\"50\"\r\n        r=\"20\"\r\n        fill=\"none\"\r\n        stroke-width=\"2\"\r\n        stroke-miterlimit=\"10\"\r\n      />\r\n    </svg>\r\n  </div>\r\n\r\n<div *ngIf=\"!portfolio; else weergave\"><app-not-found></app-not-found></div>\r\n<ng-template #weergave>\r\n  <body>\r\n    <header>\r\n      <div class=\"collapse bg-dark\" id=\"navbarHeader\">\r\n        <div class=\"container\">\r\n          <div class=\"row\">\r\n            <div class=\"card my-2\" style=\"width: 13rem\">\r\n              <img\r\n                class=\"card-img\"\r\n                [src]=\"image\"\r\n                alt=\"Card image cap\"\r\n              />\r\n              <div class=\"card-body\">\r\n                <h5 class=\"card-title text-white\">{{ portfolio.name }}</h5>\r\n                <button\r\n                  class=\"btn btn-outline-dark\"\r\n                  data-toggle=\"modal\"\r\n                  data-target=\"#myModal\"\r\n                >\r\n                  Resume\r\n                </button>\r\n\r\n                <div\r\n                  class=\"modal fade\"\r\n                  id=\"myModal\"\r\n                  tabindex=\"-1\"\r\n                  role=\"dialog\"\r\n                  aria-labelledby=\"myModalLabel\"\r\n                  aria-hidden=\"true\"\r\n                >\r\n                  <div class=\"modal-dialog modal-lg\">\r\n                    <div class=\"modal-content\">\r\n                      <div class=\"modal-header\">\r\n                        <h4 class=\"modal-title\" id=\"myModalLabel\">Resume</h4>\r\n                        <button\r\n                          type=\"button\"\r\n                          class=\"close\"\r\n                          data-dismiss=\"modal\"\r\n                          aria-hidden=\"true\"\r\n                        >\r\n                          &times;\r\n                        </button>\r\n                      </div>\r\n                      <div class=\"modal-body \">\r\n                        <embed\r\n                          [src]=\"pdf\"\r\n                          frameborder=\"0\"\r\n                          width=\"100%\"\r\n                          height=\"500px\"\r\n                        />\r\n                      </div>\r\n                      <div class=\"modal-footer\">\r\n                        <button\r\n                          type=\"button\"\r\n                          class=\"btn btn-default\"\r\n                          data-dismiss=\"modal\"\r\n                        >\r\n                          Close\r\n                        </button>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"col-sm-8 col-md-7 py-4\">\r\n              <h4 class=\"text-white\">About Me</h4>\r\n              <p class=\"text-white\">{{ portfolio.description }}</p>\r\n              <div *ngIf=\"portfolio.contact\">\r\n                <h4 class=\"text-white\">Contact Details</h4>\r\n                <ul class=\"list-unstyled text-white\">\r\n                  <li>\r\n                    {{ portfolio.contact.name }} {{ portfolio.contact.surname }}\r\n                  </li>\r\n                  <li>{{ portfolio.contact.birthdate }}</li>\r\n                  <li>{{ portfolio.contact.street }}</li>\r\n                  <li>\r\n                    {{ portfolio.contact.postalcode }}\r\n                    {{ portfolio.contact.city }}\r\n                  </li>\r\n                  <li>{{ portfolio.contact.country }}</li>\r\n                  <li>{{ portfolio.contact.email }}</li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"navbar navbar-dark bg-dark shadow-sm\">\r\n        <div class=\"container d-flex justify-content-between\">\r\n          <a href=\"#\" class=\"navbar-brand d-flex align-items-center\">\r\n            <svg\r\n              xmlns=\"http://www.w3.org/2000/svg\"\r\n              width=\"20\"\r\n              height=\"20\"\r\n              fill=\"none\"\r\n              stroke=\"currentColor\"\r\n              stroke-linecap=\"round\"\r\n              stroke-linejoin=\"round\"\r\n              stroke-width=\"2\"\r\n              aria-hidden=\"true\"\r\n              class=\"mr-2\"\r\n              viewBox=\"0 0 24 24\"\r\n              focusable=\"false\"\r\n            >\r\n              <path\r\n                d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"\r\n              ></path>\r\n              <circle cx=\"12\" cy=\"13\" r=\"4\"></circle>\r\n            </svg>\r\n            <strong>Portfolio</strong>\r\n          </a>\r\n          <button\r\n            class=\"navbar-toggler\"\r\n            type=\"button\"\r\n            data-toggle=\"collapse\"\r\n            data-target=\"#navbarHeader\"\r\n            aria-controls=\"navbarHeader\"\r\n            aria-expanded=\"false\"\r\n            aria-label=\"Toggle navigation\"\r\n          >\r\n            <span class=\"navbar-toggler-icon\"></span>\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </header>\r\n\r\n    <main role=\"main \">\r\n      <div *ngIf=\"portfolio.educations.length != 0\">\r\n        <section class=\"jumbotron text-center\">\r\n          <div class=\"container\">\r\n            <h1 class=\"jumbotron-heading\">Education</h1>\r\n            <p class=\"lead text-muted\">Here you can see all my educations...</p>\r\n          </div>\r\n        </section>\r\n\r\n        <div class=\"album py-5 bg-light\">\r\n          <div class=\"container\">\r\n            <div class=\"row education\">\r\n              <div class=\"nine columns main-col\">\r\n                <div *ngFor=\"let edu of portfolio.educations\">\r\n                  <div class=\"row item mt-2\">\r\n                    <div class=\"twelve columns\">\r\n                      <h3>{{ edu.institute }}</h3>\r\n                      <p class=\"info\">\r\n                        {{ edu.course }} <span>&bull;</span>\r\n                        <em class=\"date\">\r\n                          {{ getYear(edu.startYear) }} -\r\n                          {{ getYear(edu.endYear) }}</em\r\n                        >\r\n                      </p>\r\n\r\n                      <p>{{ edu.description }}</p>\r\n                      <a href=\"{{ edu.link }}\" target=\"_blank\"> {{ edu.link }} </a>\r\n                    </div>\r\n                  </div>\r\n                  <!-- item end -->\r\n                </div>\r\n              </div>\r\n              <!-- main-col end -->\r\n            </div>\r\n            <!-- End Education -->\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Work\r\n     ----------------------------------------------- -->\r\n      <div *ngIf=\"portfolio.experiences.length != 0\">\r\n        <section class=\"jumbotron text-center\">\r\n          <div class=\"container\">\r\n            <h1 class=\"jumbotron-heading\">Work Experience</h1>\r\n            <p class=\"lead text-muted\">\r\n              Here you can see all my work experience...\r\n            </p>\r\n          </div>\r\n        </section>\r\n\r\n        <div class=\"album py-5 bg-light\">\r\n          <div class=\"container\">\r\n            <div class=\"row work\">\r\n              <div class=\"nine columns main-col\">\r\n                <div *ngFor=\"let exp of portfolio.experiences\">\r\n                  <div class=\"row item mt-2\">\r\n                    <div class=\"twelve columns\">\r\n                      <h3>{{ exp.company }}</h3>\r\n                      <p class=\"info\">\r\n                        {{ exp.jobPos }} <span>&bull;</span>\r\n                        <em class=\"date\">\r\n                          {{ getYear(exp.startYear) }} -\r\n                          {{ getYear(exp.endYear) }}</em\r\n                        >\r\n                      </p>\r\n                      <p>{{ exp.description }}</p>\r\n                      <a href=\"{{ exp.link }}\" target=\"_blank\">{{ exp.link }}</a>\r\n                    </div>\r\n                  </div>\r\n                  <!-- item end -->\r\n                </div>\r\n              </div>\r\n              <!-- main-col end -->\r\n            </div>\r\n            <!-- End Work -->\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!--SKILLS-->\r\n      <div *ngIf=\"portfolio.skills.length != 0\">\r\n        <section class=\"jumbotron text-center\">\r\n          <div class=\"container\">\r\n            <h1 class=\"jumbotron-heading\">Skills</h1>\r\n            <p class=\"lead text-muted\">Here you can see all my skills...</p>\r\n          </div>\r\n        </section>\r\n\r\n        <div class=\"album py-5 bg-light\">\r\n          <div class=\"container\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-3 mb-4\" *ngFor=\"let sk of portfolio.skills\">\r\n                <div class=\"card h-100 mb-4 shadow-sm\">\r\n                  <img\r\n                    class=\"card-img\"\r\n                    src=\"{{ sk.iconPath }}\"\r\n                    height=\"200\"\r\n                    alt=\"{{ sk.type }}\"\r\n                  />\r\n\r\n                  <div class=\"card-body\">\r\n                    <h5 class=\"card-title\">{{ sk.type }}</h5>\r\n                    <p class=\"card-text\">{{ sk.description }}</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!--WORKS-->\r\n      <div *ngIf=\"portfolio.works.length != 0\">\r\n        <section class=\"jumbotron text-center\">\r\n          <div class=\"container\">\r\n            <h1 class=\"jumbotron-heading\">Works</h1>\r\n            <p class=\"lead text-muted\">Here you can see all my works...</p>\r\n          </div>\r\n        </section>\r\n\r\n        <div class=\"album py-5 bg-light\">\r\n          <div class=\"container\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-4 mb-4\" *ngFor=\"let work of portfolio.works\">\r\n                <div class=\"card h-100 mb-4 shadow-sm\">\r\n                  <img\r\n                    class=\"card-img\"\r\n                    src=\"{{ work.imagePath }}\"\r\n                    height=\"225\"\r\n                    alt=\"{{ work.workName }}\"\r\n                  />\r\n                  <div class=\"card-body\">\r\n                    <h5 class=\"card-title\">{{ work.workName }}</h5>\r\n                    <p class=\"card-text\">{{ work.description }}</p>\r\n                   \r\n                  </div>\r\n                  <div\r\n                  class=\"d-flex justify-content-between align-items-center\"\r\n                >\r\n                  <div class=\"btn-group ml-2 mb-2\">\r\n                    <a\r\n                      href=\"{{work.link}}\"\r\n                      target=\"_blank\"\r\n                      class=\"btn btn-sm btn-outline-secondary\"\r\n                      >View</a\r\n                    >\r\n                  </div>\r\n                  <small class=\"text-muted mr-2 mb-2\">{{ formatDate(work.timePublished) }}</small>\r\n                </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </main>\r\n\r\n    <footer class=\"text-muted\">\r\n      <div class=\"container\">\r\n        <p class=\"float-right\">\r\n          <a (click)=\"click()\" class=\"btn btn-outline-dark\">Back to top</a>\r\n        </p>\r\n        <p *ngIf=\"portfolio.contact\">\r\n          Copyright © Wannes De Craene - Portfolio of\r\n          {{ portfolio.contact.name }} {{ portfolio.contact.surname }}\r\n        </p>\r\n        <p>\r\n          Would you like to create your own portfolio? Do not hesitate to create\r\n          your own account <a href=\"#\">here</a>!\r\n        </p>\r\n      </div>\r\n    </footer>\r\n  </body>\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/portfolio/view-portfolio/view-portfolio.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/portfolio/view-portfolio/view-portfolio.component.ts ***!
  \**********************************************************************/
/*! exports provided: ViewPortfolioComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPortfolioComponent", function() { return ViewPortfolioComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var src_app_navbar_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/navbar.service */ "./src/app/navbar.service.ts");
/* harmony import */ var _portfolio_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../portfolio-data.service */ "./src/app/portfolio/portfolio-data.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");






var ViewPortfolioComponent = /** @class */ (function () {
    function ViewPortfolioComponent(router, route, nav, _portfolioDataService, sanitizer) {
        this.router = router;
        this.route = route;
        this.nav = nav;
        this._portfolioDataService = _portfolioDataService;
        this.sanitizer = sanitizer;
        this.isImageLoading = true;
        this.isPDFLoading = true;
    }
    ViewPortfolioComponent.prototype.getYear = function (date) {
        var d = new Date(date);
        var today = new Date();
        if (d > today) {
            return 'ongoing';
        }
        else {
            return d.getFullYear();
        }
    };
    ViewPortfolioComponent.prototype.formatDate = function (date) {
        var d = new Date(date);
        return d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    };
    ViewPortfolioComponent.prototype.click = function () {
        window.scroll(0, 0);
    };
    ViewPortfolioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouteConfigLoadStart"]) {
                _this.loadingRouteConfig = true;
            }
            else if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouteConfigLoadEnd"]) {
                _this.loadingRouteConfig = false;
            }
        });
        this.nav.hide();
        this.route.data.subscribe(function (item) { return (_this.portfolio = item.portfolio); });
        this.route.paramMap.subscribe(function (params) {
            _this.pid = Number(params.get('id'));
        });
        this._portfolioDataService.getImage(this.pid).subscribe(function (data) {
            _this.createImageFromBlob(data);
            _this.isImageLoading = false;
        }, function (error) {
            _this.isImageLoading = true;
            console.log(error);
        });
        this._portfolioDataService.getResume(this.pid).subscribe(function (data) {
            var file = new Blob([data], { type: 'application/pdf' });
            var something = URL.createObjectURL(file);
            _this.pdfToShow = _this.sanitizer.bypassSecurityTrustResourceUrl(something);
            _this.isPDFLoading = false;
        }, function (error) {
            _this.isPDFLoading = true;
            console.log(error);
        });
    };
    Object.defineProperty(ViewPortfolioComponent.prototype, "image", {
        get: function () {
            if (this.portfolio != null) {
                if (this.imageToShow == null) {
                    return '../../../assets/images/default-profile-pic.png';
                }
                else {
                    return this.imageToShow;
                }
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    ViewPortfolioComponent.prototype.createImageFromBlob = function (image) {
        var _this = this;
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            _this.imageToShow = reader.result;
        }, false);
        if (image) {
            reader.readAsDataURL(image);
        }
    };
    Object.defineProperty(ViewPortfolioComponent.prototype, "pdf", {
        get: function () {
            if (this.pdfToShow == null) {
                return '../../../assets/files/default-pdf.pdf';
            }
            else {
                return this.pdfToShow;
            }
        },
        enumerable: true,
        configurable: true
    });
    ViewPortfolioComponent.prototype.ngOnDestroy = function () {
        this.nav.show();
    };
    ViewPortfolioComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-view-portfolio',
            template: __webpack_require__(/*! ./view-portfolio.component.html */ "./src/app/portfolio/view-portfolio/view-portfolio.component.html"),
            styles: [__webpack_require__(/*! ./view-portfolio.component.css */ "./src/app/portfolio/view-portfolio/view-portfolio.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            src_app_navbar_service__WEBPACK_IMPORTED_MODULE_3__["NavbarService"],
            _portfolio_data_service__WEBPACK_IMPORTED_MODULE_4__["PortfolioDataService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["DomSanitizer"]])
    ], ViewPortfolioComponent);
    return ViewPortfolioComponent;
}());



/***/ })

}]);
//# sourceMappingURL=portfolio-portfolio-module.js.map