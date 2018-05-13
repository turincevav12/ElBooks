/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(2);
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj instanceof Error ||
        (obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string");
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

function domainBind(self, cb) {
    return self.bind(cb);
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    domainBind: domainBind
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(2);
var Objectfreeze = es5.freeze;
var util = __webpack_require__(0);
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(NEXT_FILTER) {
var util = __webpack_require__(0);
var getKeys = __webpack_require__(2).keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var maybeWrapAsError = util.maybeWrapAsError;
var errors = __webpack_require__(1);
var OperationalError = errors.OperationalError;
var es5 = __webpack_require__(2);

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(6),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    globalShortcut = _require.globalShortcut,
    ipcMain = _require.ipcMain;

var _require2 = __webpack_require__(7),
    promisify = _require2.promisify;

var _require3 = __webpack_require__(38),
    readdir = _require3.readdir;

var _require4 = __webpack_require__(39),
    resolve = _require4.resolve;

var readdirAsync = promisify(readdir);

var win = void 0;

app.on('ready', function () {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        fullscreen: false,
        title: "ElBook",
        show: false,
        resizable: true,
        movable: true
    });

    globalShortcut.register('Control + Q', function () {
        app.quit();
    });

    ipcMain.on('front-ready', function (event) {
        readdirAsync(resolve(__dirname, '../books')).then(function (files) {
            return event.sender.send('book-list', files);
        }).catch(function (err) {
            return console.error(err);
        });
    });

    ipcMain.on('thisBook', function (event, data) {
        var book = __webpack_require__(40)("./" + data + '.json');
        ipcMain.on('books', function (event) {
            event.sender.send('data', book);
        });
    });

    win.loadURL('file://' + __dirname + '/index.html');
    win.once('ready-to-show', function () {
        win.show();
    });
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = __webpack_require__(8)();
bluebird.noConflict = noConflict;
module.exports = bluebird;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = __webpack_require__(0);

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = __webpack_require__(2);
var Async = __webpack_require__(9);
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = __webpack_require__(1);
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = __webpack_require__(12)(Promise, INTERNAL);
var PromiseArray =
    __webpack_require__(13)(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = __webpack_require__(14)(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = __webpack_require__(15)(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    __webpack_require__(16)(Promise, tryConvertToPromise, NEXT_FILTER);
var catchFilter = __webpack_require__(3)(NEXT_FILTER);
var nodebackForPromise = __webpack_require__(4);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (self == null || self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }

}

function Promise(executor) {
    if (executor !== INTERNAL) {
        check(this, executor);
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._resolveFromExecutor(executor);
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("Catch statement predicate: " +
                    "expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" &&
                    util.domainBind(domain, handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    if (executor === INTERNAL) return;
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

__webpack_require__(17)(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
__webpack_require__(18)(Promise, INTERNAL, tryConvertToPromise, debug);
__webpack_require__(19)(Promise, PromiseArray, apiRejection, debug);
__webpack_require__(20)(Promise);
__webpack_require__(21)(Promise);
__webpack_require__(22)(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
Promise.Promise = Promise;
Promise.version = "3.5.1";
__webpack_require__(23)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(24)(Promise);
__webpack_require__(25)(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
__webpack_require__(26)(Promise, INTERNAL, debug);
__webpack_require__(27)(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
__webpack_require__(28)(Promise);
__webpack_require__(29)(Promise, INTERNAL);
__webpack_require__(30)(Promise, PromiseArray, tryConvertToPromise, apiRejection);
__webpack_require__(31)(Promise, INTERNAL, tryConvertToPromise, apiRejection);
__webpack_require__(32)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(33)(Promise, PromiseArray, debug);
__webpack_require__(34)(Promise, PromiseArray, apiRejection);
__webpack_require__(35)(Promise, INTERNAL);
__webpack_require__(36)(Promise, INTERNAL);
__webpack_require__(37)(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = __webpack_require__(10);
var Queue = __webpack_require__(11);
var util = __webpack_require__(0);

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
        };

        return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = __webpack_require__(0);
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    case -6: return new Map();
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise._isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = __webpack_require__(1).Warning;
var util = __webpack_require__(0);
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (false ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    var self = this;
    setTimeout(function() {
        self._notifyUnhandledRejection();
    }, 1);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new CustomEvent(name.toLowerCase(), {
                    detail: event,
                    cancelable: true
                });
                return !util.global.dispatchEvent(domEvent);
            };
        } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new Event(name.toLowerCase(), {
                    cancelable: true
                });
                domEvent.detail = event;
                return !util.global.dispatchEvent(domEvent);
            };
        } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(name.toLowerCase(), false, true,
                    event);
                return !util.global.dispatchEvent(domEvent);
            };
        }
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
    return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this._isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                    var lineMatches = line.match(parseLinePattern);
                    if (lineMatches) {
                        handlerLine  = "at " + lineMatches[1] +
                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                    }
                    break;
                }
            }

            if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {

                    if (traceLines[i] === firstUserLine) {
                        if (i > 0) {
                            creatorLine = "\n" + traceLines[i - 1];
                        }
                        break;
                    }
                }

            }
        }
        var msg = "a promise was created in a " + name +
            "handler " + handlerLine + "but was not returned from it, " +
            "see http://goo.gl/rRqMUw" +
            creatorLine;
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
var util = __webpack_require__(0);
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;
var catchFilter = __webpack_require__(3)(NEXT_FILTER);

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret === NEXT_FILTER) {
            return ret;
        } else if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise._isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};


Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

Promise.prototype.tapCatch = function (handlerOrPredicate) {
    var len = arguments.length;
    if(len === 1) {
        return this._passThrough(handlerOrPredicate,
                                 1,
                                 undefined,
                                 finallyHandler);
    } else {
         var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return Promise.reject(new TypeError(
                    "tapCatch statement predicate: "
                    + "expecting an object but got " + util.classString(item)
                ));
            }
        }
        catchInstances.length = j;
        var handler = arguments[i];
        return this._passThrough(catchFilter(catchInstances, handler, this),
                                 1,
                                 undefined,
                                 finallyHandler);
    }

};

return PassThroughHandlerContext;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise._isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this._isCancellable()) return;
    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype._isCancellable = function() {
    return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled = function() {
    return (this._bitField & 8454144) !== 0;
};

Promise.prototype.__isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype._isCancelled = function() {
    return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
    return (this._target()._bitField & 8454144) !== 0;
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
         getDomain) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (true) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", "async", code)
                           (tryCatch, errorObj, Promise, async);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (true) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var domain = getDomain();
                        if (domain !== null) {
                            holder.fn = util.domainBind(domain, holder.fn);
                        }
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];};
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : util.domainBind(domain, fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = [];
    async.invoke(this._asyncInit, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
    this._init$(undefined, -2);
};

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
    if (true) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = __webpack_require__(0);
    var TypeError = __webpack_require__(1).TypeError;
    var inherits = __webpack_require__(0).inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, debug) {
var util = __webpack_require__(0);
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = __webpack_require__(1);
var TypeError = errors.TypeError;
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            Promise._async.invoke(
                this._promiseFulfilled, this, maybePromise._value()
            );
        } else if (((bitField & 16777216) !== 0)) {
            Promise._async.invoke(
                this._promiseRejected, this, maybePromise._reason()
            );
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var util = __webpack_require__(0);
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = __webpack_require__(0);
var nodebackForPromise = __webpack_require__(4);
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = __webpack_require__(1).TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (true) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};



/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);
var isObject = util.isObject;
var es5 = __webpack_require__(2);
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, isMap ? -6 : -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : util.domainBind(domain, fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    if(_each === INTERNAL) {
        this._eachValues = Array(this._length);
    } else if (_each === 0) {
        this._eachValues = null;
    } else {
        this._eachValues = undefined;
    }
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && 
        this._eachValues !== null && 
        accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    if (this._eachValues !== null) {
        this._eachValues.push(value);
    }
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = __webpack_require__(0);

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = __webpack_require__(0);
var RangeError = __webpack_require__(1).RangeError;
var AggregateError = __webpack_require__(1).AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};



/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Cистемное программирование на персональном компьютере.json": 41,
	"./Прикладное программирование.json": 42
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 40;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = {"name":"Cистемное программирование на персональном компьютере","textBook":[{"abzac":"Лекция 1. Основные понятия и определения","textAbzac":""},{"abzac":"Программы и программное обеспечение","textAbzac":"Программа — это данные, предназначенные для управления кон кретными компонентами системы обработки информации (СОИ) в це лях реализации определенного алгоритма.\n\nОбратить внимание: программа — это данные.\n\nОдин из основных принципов машины фон Неймана — то, что и программы, и данные хранятся в одной и той же памяти. Сохраняемая в памяти программа представляет собой некоторые коды, которые могут рассматриваться как данные. Возможно, с точки зрения программиста программа — активный компонент, она выполняет некоторые действия. Но с точки зрения процессора команды программы — это данные, кото рые процессор читает и интерпретирует. С другой стороны программа — это данные с точки зрения обслуживающих программ, например, с точ ки зрения компилятора, который на входе получает одни данные — про грамму на языке высокого уровня (ЯВУ), а на выходе выдает другие дан ные — программу в машинных кодах.\n\nПрограммное обеспечение (ПО) — совокупность программ СОИ и программных документов, необходимых для их эксплуатации\n\nСущественно, что ПО — это программы, предназначенные для многократного использования и применения разными пользователями. В связи с этим следует обратить внимание на ряд необходимых свойств ПО.\n\nНеобходимость документирования\n\nПо определению программы становятся ПО только при наличии документации. Конечный пользователь не может работать, не имея доку ментации. Документация делает возможным тиражирование ПО и про дажу его без его разработчика. По Бруксу ошибкой в ПО является ситуа ция, когда программное изделие функционирует не в соответствии со своим описанием, следовательно, ошибка в документации также являет ся ошибкой в программном изделии.\n\nЭффективность\n\nПО, рассчитанное на многократное использование (например, ОС, текстовый редактор) пишется и отлаживается один раз, а выполня ется многократно. Таким образом, выгодно переносить затраты на этап производства ПО и освобождать от затрат этап выполнения, чтобы избе жать тиражирования затрат.\n\nНадежность\n\nВ том числе:\n\nТестирование программы при всех допустимых спецификациях входных данных\n\nЗащита от неправильных действий пользователя\n\nЗащита от взлома — пользователи должны иметь возможность взаимодействия с ПО только через легальные интерфейсы.\n\nПоявление ошибок любого уровня не должно приводить к краху системы. Ошибки должны вылавливаться диагностироваться и (если их невозможно исправить) превращаться в корректные отказы.\n\nСистемные структуры данных должны сохраняться безусловно.\n\nСохранение целостности пользовательских данных желательно.\n\nВозможность сопровождения\n\nВозможные цели сопровождения — адаптация ПО к конкретным условиям применения, устранение ошибок, модификация.\n\nВо всех случаях требуется тщательное структурирование ПО и но сителем информации о структуре ПО должна быть программная доку ментация.\n\nАдаптация во многих случаях может быть передоверена пользова телю — при тщательной отработке и описании сценариев инсталляции и настройки.\n\nИсправление ошибок требует развитой сервисной службы, со бирающей информацию об ошибках и формирующей исправляющие пакеты.\n\nМодификация предполагает изменение спецификаций на ПО. При этом, как правило, должны поддерживаться и старые специфика ции. Эволюционное развитие ПО экономит вложения пользователей."},{"abzac":"Системное программирование","textAbzac":"Системная программа — программа, предназначенная для поддер жания работоспособности СОИ или повышения эффективности ее ис пользования.\n\nПрикладная программа — программа, предназначенная для реше ния задачи или класса задач в определенной области применения СОИ.\n\nВ соответствии с терминологией, системное программирование — это процесс разработки системных программ (в том числе, управляющих\n\nиобслуживающих).\n\nСдругой стороны, система — единое целое, состоящее из множе ства компонентов и множества связей между ними. Тогда системное программирование — это разработка программ сложной структуры.\n\nЭти два определения не противоречат друг другу, так как разра ботка программ сложной структуры ведется именно для обеспечения ра ботоспособности или повышения эффективности СОИ.\n\nПодразделение ПО на системное и прикладное является до неко торой степени устаревшим. Сегодняшнее деление предусматривает по меньшей мере три градации ПО:\n\nСистемное\n\nПромежуточное\n\nПрикладное\n\nПромежуточное ПО (middleware) мы определяем как совокуп ность программ, осуществляющих управление вторичными (конструи руемыми самим ПО) ресурсами, ориентированными на решение опреде ленного (широкого) класса задач. К такому ПО относятся менеджеры транзакций, серверы БД, серверы коммуникаций и другие программные серверы. С точки зрения инструментальных средств разработки проме жуточное ПО ближе к прикладному, так как не работает на прямую с первичными ресурсами, а использует для этого сервисы, предоставляе мые системным ПО.\n\nС точки зрения алгоритмов и технологий разработки промежуточ ное ПО ближе к системному, так как всегда является сложным про граммным изделием многократного и многоцелевого использования и в нем применяются те же или сходные алгоритмы, что и в системном ПО.\n\nСовременные тенденции развития ПО состоит в снижении объе ма как системного, так и прикладного программирования. Основная часть работы программистов выполняется в промежуточном ПО. Сни жение объема системного программирования определено современны ми концепциями ОС, объектно ориентированной архитектурой и архи тектурой микроядра, в соответствии с которыми большая часть функций системы выносится в утилиты, которые можно отнести и к промежуточ ному ПО. Снижение объема прикладного программирования обусловле но тем, что современные продукты промежуточного ПО предлагают все больший набор инструментальных средств и шаблонов для решения за дач своего класса.\n\nЗначительная часть системного и практически все прикладное ПО пишется на языках высокого уровня, что обеспечивает сокращение рас ходов на их разработку/модификацию и переносимость.\n\nСистемное ПО подразделяется на системные управляющие про граммы и системные обслуживающие программы.\n\nУправляющая программа — системная программа, реализующая набор функций управления, который включает в себя управление ресур сами и взаимодействие с внешней средой СОИ, восстановление работы системы после проявления неисправностей в технических средствах.\n\nПрограмма обслуживания (утилита) — программа, предназначен ная для оказания услуг общего характера пользователям и обслуживаю щему персоналу СОИ.\n\nУправляющая программа совместно с набором необходимых для эксплуатации системы утилит составляют операционную систему (ОС).\n\nКроме входящих в состав ОС утилит могут существовать и другие утилиты (того же или стороннего производителя), выполняющие допол нительное (опционное) обслуживание. Как правило, это утилиты, обес печивающие разработку программного обеспечения для операционной системы.\n\nСистема программирования — система, образуемая языком про граммирования, компилятором или интерпретатором программ, пред ставленных на этом языке, соответствующей документацией, а также вспомогательными средствами для подготовки программ к форме, при годной для выполнения."},{"abzac":"Этапы подготовки программы","textAbzac":"При разработке программ, а тем более — сложных, используется принцип модульности, разбиения сложной программы на составные ча сти, каждая из которых может подготавливаться отдельно. Модульность является основным инструментом структурирования программного из делия, облегчающим его разработку, отладку и сопровождение.\n\nПрограммный модуль — программа или функционально завершен ный фрагмент программы, предназначенный для хранения, трансляции, объединения с другими программными модулями и загрузки в оператив ную память.\n\nПри выборе модульной структуры должны учитываться следую щие основные соображения:\n\nФункциональность — модуль должен выполнять законченную функцию\n\nНесвязность — модуль должен иметь минимум связей с другими модулями, связь через глобальные переменные и области памяти нежелательна\n\nСпецифицируемость — входные и выходные параметры модуля должны четко формулироваться\n\nПрограмма пишется в виде исходного модуля.\n\nИсходный модуль — программный модуль на исходном языке, об рабатываемый транслятором и представляемый для него как целое, до статочное для проведения трансляции.\n\nПервым (не для всех языков программирования обязательным) этапом подготовки программы является обработка ее Макропроцессо ром (или Препроцессором). Макропроцессор обрабатывает текст программы и на выходе его получается новая редакция текста. В боль шинстве систем программирования Макропроцессор совмещен с транс лятором, и для программиста его работа и промежуточный ИМ «не вид ны».\n\nСледует иметь в виду, что Макропроцессор выполняет обработку текста, это означает, с одной стороны, что он «не понимает» операторов языка программирования и «не знает» переменных программы, с другой, что все операторы и переменные Макроязыка (тех выражений в про грамме, которые адресованы Макропроцессору) в промежуточном ИМ уже отсутствуют и для дальнейших этапов обработки «не видны».\n\nТак, если Макропроцессор заменил в программе некоторый текст A на текст B, то транслятор уже видит только текст B, и не знает, был этот текст написан программистом «своей рукой» или подставлен Макропро цессором.\n\nСледующим этапом является трансляция.\n\nТрансляция — преобразование программы, представленной на од ном языке программирования, в программу на другом языке программи рования, в определенном смысле равносильную первой.\n\nКак правило, выходным языком транслятора является машинный язык целевой вычислительной системы. (Целевая ВС — та ВС, на кото рой программа будет выполняться.)\n\nМашинный язык — язык программирования, предназначенный для представления программы в форме, позволяющей выполнять ее не посредственно техническими средствами обработки информации.\n\nТрансляторы — общее название для программ, осуществляющих трансляцию. Они подразделяются на Ассемблеры и Компиляторы — в зависимости от исходного языка программы, которую они обрабатыва ют. Ассемблеры работают с Автокодами или языками Ассемблера, Ком пиляторы — с языками высокого уровня.\n\nАвтокод — символьный язык программирования, предложения которого по своей структуре в основном подобны командам и обрабаты ваемым данным конкретного машинного языка.\n\nЯзык Ассемблера — язык программирования, который представ ляет собой символьную форму машинного языка с рядом возможностей, характерных для языка высокого уровня (обычно включает в себя макро средства).\n\nЯзык высокого уровня — язык программирования, понятия и структура которого удобны для восприятия человеком.\n\nОбъектный модуль — программный модуль, получаемый в резуль тате трансляции исходного модуля.\n\nПоскольку результатом трансляции является модуль на языке, близком к машинному, в нем уже не остается признаков того, на каком исходном языке был написан программный модуль. Это создает принци пиальную возможность создавать программы из модулей, написанных на разных языках. Специфика исходного языка, однако, может сказываться на физическом представлении базовых типов данных, способах обраще ния к процедурам/функциям и т.п. Для совместимости разноязыковых модулей должны выдерживаться общие соглашения. Большая часть объ ектного модуля — команды и данные машинного языка именно в той форме, в какой они будут существовать во время выполнения програм мы. Однако, программа в общем случае состоит из многих модулей. По скольку транслятор обрабатывает только один конкретный модуль, он не может должным образом обработать те части этого модуля, в которых за программированы обращения к данным или процедурам, определенным в другом модуле. Такие обращения называются внешними ссылками. Те места в объектном модуле, где содержатся внешние ссылки, транслиру ются в некоторую промежуточную форму, подлежащую дальнейшей об работке. Говорят, что объектный модуль представляет собой программу на машинном языке с неразрешенными внешними ссылками. Разреше ние внешних ссылок выполняется на следующем этапе подготовки, ко торый обеспечивается Редактором Связей (Компоновщиком). Редактор Связей соединяет вместе все объектные модули, входящие в программу. Поскольку Редактор Связей «видит» уже все компоненты программы, он имеет возможность обработать те места в объектных модулях, которые содержат внешние ссылки. Результатом работы Редактора Связей явля ется загрузочный модуль.\n\nЗагрузочный модуль — программный модуль, представленный в форме, пригодной для загрузки в оперативную память для выполнения.\n\nЗагрузочный модуль сохраняется в виде файла на внешней памя ти. Для выполнения программа должна быть перенесена (загружена) в оперативную память. Иногда при этом требуется некоторая дополни тельная обработка (например, настройка адресов в программе на ту об ласть оперативной памяти, в которую программа загрузилась). Эта функция выполняется Загрузчиком, который обычно входит в состав опера ционной системы. Возможен также вариант, в котором редактирование связей выполняется при каждом запуске программы на выполнение и совмещается с загрузкой. Это делает Связывающий Загрузчик. Вариант связывания при запуске более расходный, т.к. затраты на связывание ти ражируются при каждом запуске. Но он обеспечивает:\n\nбольшую гибкость в сопровождении, так как позволяет менять отдельные объектные модули программы, не меняя остальных модулей;\n\nэкономию внешней памяти, т.к. объектные модули, используемые во многих программах не копируются в каждый загрузочный модуль, а хранятся в одном экземпляре.\n\nВариант интерпретации подразумевает прямое исполнение исход ного модуля.\n\nИнтерпретация — реализация смысла некоторого синтаксически законченного текста, представленного на конкретном языке.\n\nИнтерпретатор читает из исходного модуля очередное предложе ние программы, переводит его в машинный язык и выполняет. Все затра ты на подготовку тиражируются при каждом выполнении, следователь но, интерпретируемая программа принципиально менее эффективна, чем транслируемая. Однако, интерпретация обеспечивает удобство раз работки, гибкость в сопровождении и переносимость.\n\nНе обязательно подготовка программы должна вестись на той же вычислительной системе и в той же операционной среде, в которых про грамма будет выполняться. Системы, обеспечивающие подготовку про грамм в среде, отличной от целевой называются кросс системами. В кросс системе может выполняться вся подготовка или ее отдельные этапы:\n\nМакрообработка и трансляция\n\nРедактирование связей\n\nОтладка\n\nТиповое применение кросс систем — для тех случаев, когда целе вая вычислительная среда просто не имеет ресурсов, необходимых для подготовки программ, например, встроенные системы. Программные средства, обеспечивающие отладку программы на целевой системе мож но также рассматривать как частный случай кросс системы."},{"abzac":"Лекция 2. Ассемблеры","textAbzac":""},{"abzac":"Программирование на языке Ассемблера","textAbzac":"Язык Ассемблера — система записи программы с детализацией до отдельной машинной команды, позволяющая использовать мнемониче ское обозначение команд и символическое задание адресов.\n\nПоскольку в разных аппаратных архитектурах разные программ но доступные компоненты (система команд, регистры, способы адреса ции), язык Ассемблера аппаратно зависимый. Программы, написанные на языке Ассемблера могут быть перенесены только на вычислительную систему той же архитектуры.\n\nПрограммирование на языке Ассемблера позволяет в максималь ной степени использовать особенности архитектуры вычислительной системы. До недавнего времени воспринималась как аксиома, что ассем блерная программа всегда является более эффективной и в смысле быс тродействия, и в смысле требований к памяти. Для Intel архитектуры это и сейчас так.\n\nНо это уже не так для RISK архитектур. Для того, чтобы програм ма могла эффективно выполняться в вычислительной среде с распарал леливанием на уровне команд, она должна быть определенным образом оптимизирована, то есть, команды должны быть расположены в опреде ленном порядке, допускающим их параллельное выполнение. Програм мист просто не сможет покомандно оптимизировать всю свою програм му. С задачей такой оптимизации более эффективно справляются компиляторы.\n\nДоля программ, которые пишутся на языках Ассемблеров в мире, неуклонно уменьшается, прикладное программирование на языках Ас семблеров применяется только по недомыслию. Язык Ассемблера «в чи стом виде» применяется только для написания отдельных небольших частей системного ПО: микроядра ОС, самых нижних уровней драйверов\n\n— тех частей, которые непосредственно взаимодействуют с реальными аппаратными компонентами.\n\nЭтим занимается узкий круг программистов, работающих в фир мах, производящих аппаратуру и ОС. Зачем же нам тогда изучать постро ение Ассемблера?\n\nХотя разработка программ, взаимодействующих с реальными ап паратными компонентами, — редкая задача, в современном программи ровании при разработке прикладного, а еще более — промежуточного ПО довольно часто применяется технологии виртуальных машин. Для выполнения того или иного класса задач программно моделируется не которое виртуальное вычислительное устройство, функции которого со ответствуют нуждам этого класса задач.\n\nДля управления таким устройством для него может быть создан соответствующий язык команд. (Широко известные примеры: MI AS/400, JVM.) Говоря шире, любую программу можно представить себе как виртуальное «железо», решающее конкретную задачу. (Конечный пользователь обычно не видит разницы между программой и аппарату рой и часто говорит не «мне программа выдала то то», а «мне компьютер выдал то то»). В некоторых случаях интерфейс программы удобно представить в виде системы команд, а следовательно, нужен соответству ющий Ассемблер. (Это, конечно, относится не к программам «для чай ников», а к инструментальным средствам программистов, системам мо делирования).\n\n"},{"abzac":"Предложения языка Ассемблера","textAbzac":"Предложения языка Ассемблера описывают команды или псевдо команды (директивы). Предложения команды задают машинные ко манды вычислительной системы; обработка Ассемблером команды при водит к генерации машинного кода. Обработка псевдокоманды не приводит к непосредственной генерации кода, псевдокоманда управляет работой самого Ассемблера. Для одной и той же аппаратной архитектуры могут быть построены разные Ассемблеры, в которых команды будут обязательно одинаковые, но псевдокоманды могут быть разные.\n\nВо всех языках Ассемблеров каждое новое предложение языка на чинается с новой строки. Каждое предложение, как правило, занимает одну строку, хотя обычно допускается продолжение на следующей стро ке/строках. Формат записи предложений языка м.б. жесткий или свобод ный. При записи в жестком формате составляющие предложения долж ны располагаться в фиксированных позициях строки. (Например: метка должна располагаться в позициях 1 8, позиция 9 — пустая, позиции 10 12 — мнемоника команды, позиция 13 — пустая, начиная с позиции 14 — операнды, позиция 72 — признак продолжения). Обычно для записи программ при жестком формате создаются бланки. Жесткий формат удо бен для обработки Ассемблером (удобен и для чтения).\n\nСвободный формат допускает любое количество пробелов между составляющими предложения.\n\nВ общих случаях предложения языка Ассемблера состоят из следу ющих компонент:\n\nметка или имя;\n\nмнемоника;\n\nоперанды;\n\nкомментарии.\n\nМетка или имя является необязательным компонентом. Не во всех языках Ассемблеров эти понятия различаются. Если они различают ся (например, MASM), то метка — точка программы, на которую переда ется управление, следовательно, метка стоит в предложении, содержа щем команду; имя — имя переменной программы, ячейки памяти, следовательно, имя стоит в предложении, содержащем псевдокоманду резервирования памяти или определения константы. В некоторых случа ях метка и имя могут отличаться даже синтаксически, так, в MASM/ TASM после метки ставится двоеточие, а после имени — нет.\n\nОднако, физический смысл и метки, и имени — одинаков, это — адрес памяти. Во всех случаях, когда Ассемблер встречает в программе имя или метку, он заменяет ее на адрес той ячейки памяти, к которую имя/метка именует.\n\nПравила формирования имен/меток совпадают с таковыми для языков программирования. В некоторых Ассемблерах (HLAM S/390) не делается различия между меткой и именем.\n\nВ языке должны предусматриваться некоторые специальные пра вила, позволяющие Ассемблеру распознать и выделить метку/имя, на пример:\n\nметка/имя должна начинаться в 1 й позиции строки\n\nесли метки/имени нет, то в 1 й позиции должен быть пробел, или за меткой/именем должно следовать двоеточие, и т.п.\n\nМнемоника — символическое обозначение команды/псевдоко манды.\n\nОперанды — один или несколько операндов, обычно разделяемые запятыми. Операндами команд являются имена регистров, непосред ственные операнды, адреса памяти (задаваемые в виде констант, литера лов, символических имен или сложных выражений, включающих специальный синтаксис). Операнды псевдокоманд могут быть сложнее и разнообразнее.\n\nКомментарии — любой текст, который игнорируется Ассемблером. Комментарии располагаются в конце предложения и отделяются от тек ста предложения, обрабатываемого Ассемблером, каким либо специаль ным символом (в некоторых языках — пробелом). Всегда предусматри вается возможность строк, содержащих только комментарий, обычно такие строки содержат специальный символ в 1 й позиции.\n\nКонстанты — могут представлять непосредственные операнды или абсолютные адреса памяти. Применяются 10 е, 8 е, 16 е, 2 е, символь ные константы.\n\nНепосредственные операнды — записываются в сам код команды.\n\nИмена — адреса ячеек памяти.\n\nПри трансляции Ассемблер преобразует имена в адреса. Способ преобразования имени в значение зависит от принятых способов адреса ции. Как правило, в основным способом адресации в машинных языках является адресация относительная: адрес в команде задается в виде сме щения относительно какого то базового адреса, значение которого со держится в некотором базовом регистре. В качестве базового могут при меняться либо специальные регистры (DS, CS в Intel) или регистры общего назначения (S/390).\n\nЛитералы — записанные в особой форме константы. Концепту ально литералы — те же имена. При появлении в программе литерала Ас семблер выделяет ячейку памяти и записывает в нее заданную в литерале константу. Далее все появления этого литерала Ассемблер заменяет на обращения по адресу этой ячейки. Таким образом, литеральные кон станты, хранятся в памяти в одном экземпляре, независимо от числа об ращений к ним.\n\nСпециальный синтаксис — явное описание способа адресации (на пример, указание базового регистра и смещения)."},{"abzac":"Регистры","textAbzac":"Программа в машинном коде состоит из различных сегментов для определения данных, для машинных команд и для сегмента, названного стеком, для хранения адресов. Для выполнения арифметических дейст вий, пересылки данных и адресации компьютер имеет ряд регистров.\n\nДля выполнения программ компьютер временно записывает про грамму и данные в основную память. Компьютер имеет также ряд pегис тров, которые он использует для временных вычислений."},{"abzac":"Биты и байты","textAbzac":"Минимальной единицей информации в компьютере является бит. Бит может быть выключен, так что его значение есть нуль, или включен, тогда его значение равно единице. Единственный бит не может предста вить много информации в отличие от группы битов.\n\nГруппа из девяти битов представляет собой байт; восемь битов ко торого содержат данные и один бит — контроль на четность. Восемь би тов обеспечивают основу для двоичной арифметики и для представления символов, таких как буква A или символ *. Восемь битов дают 256 раз личных комбинаций включенных и выключенных состояний: от «все вы ключены» (00000000) до «все включены» (11111111). Например, сочета ние включенных и выключенных битов для представления буквы A выглядит как 01000001, а для cимвола * — 00101010 (это можно не запо минать). Каждый байт в памяти компьютера имеет уникальный адрес, начиная с нуля."},{"abzac":"ASCII","textAbzac":"Для целей стандартизации в микрокомпьютерах используется aмериканский национальный стандартный код для обмена информаци ей ASCII (American National Standard Code for Information Interchange). Читается как «аски» код. Именно по этой причине комбинация бит 01000001 обозначает букву A.\n\nНаличие стандартного кода облегчает обмен данными между раз личными устройствами компьютера. 8 битовый расширенный ASCII код, используемый в PC обеспечивает представление 256 символов, включая символы для национальных алфавитов."},{"abzac":"Двоичные числа","textAbzac":"Так как компьютер может различить только нулевое и единичное состояние бита, то он работает системе исчисления с базой 2 или в дво ичной системе. Фактически бит унаследовал cвое название от англий ского «Binary digit» (двоичная цифра).\n\nСочетанием двоичных цифр (битов) можно представить любое значение. Значение двоичного числа определяется относительной пози цией каждого бита и наличием единичных битов.\n\nСамый правый бит имеет весовое значение 1, следующая цифра влево — 2, следующая — 4 и так далее. Общая сумма для восьми единич ных битов в данном случае составит 1+2+4+...+128, или 255 (2 в восьмой степени — 1).\n\nДля двоичного числа 01000001 единичные биты представляют зна чения 1 и 64, то есть, 65. Но 01000001 представляет также букву A! Дейст вительно, здесь момент, который необходимо четко уяснить. Биты 01000001 могут представлять как число 65, так и букву A:\n\nесли программа определяет элемент данных для арифметических целей, то 01000001 представляет двоичное число эквивалентное десятичному числу 65;\n\nесли программа определяет элемент данных (один или более смежных байт), имея в виду описательный характер, как, например, заголовок, тогда 01000001 представляет собой букву или «строку».\n\nПри программировании это различие становится понятным, так как назначение каждого элемента данных определено.\n\nДвоичное число не ограничено только восемью битами. Процес сор может использовать 16 битовую архитектуру, в этом случае он авто матически оперирует с 16 битовыми числами. 2 в степени 16 минус 1 дает значение 65535, а немного творческого программирования позволит обрабатывать числа до 32 бит (2 в степени 32 минус 1 равно 4294967295) и даже больше.\n\nДвоичная арифметика\n\nКомпьютер выполняет арифметические действия только в двоич ном формате. Поэтому программист на языке Ассемблера должен быть знаком с двоичным форматом и двоичным сложением:0+ 0= 0\n 1+ 0= 1\n1+1=10\n\n \n\n1+1+1= 11\n\nОтрицательные числа\n\nВсе представленные выше двоичные числа имеют положительные значения, что обозначается нулевым значением самого левого (старше го) разряда. Отрицательные двоичные числа содержат единичный бит в старшем разряде и выражаются двоичным дополнением. То есть, для представления отрицательного двоичного числа необходимо инвертиро вать все биты и прибавить 1.\n\nРассмотрим пример:\n\nЧисло 65: 01000001\n\nИнверсия: 10111110\n\nПлюс 1: 10111111 (равно 65).\n\nВ случае, если прибавить единичные значения к числу 10111111, 65 не получится.\n\nФактически двоичное число считается отрицательным, если его старший бит равен 1. Для определения абсолютного значения отрица тельного двоичного числа, необходимо повторить предыдущие опера ции: инвертировать все биты и прибавить 1:\n\nДвоичное значение: 10111111\n\nИнверсия: 01000000\n\nПлюс 1: 01000001 (равно +65).\n\nСумма +65 и 65 должна составить ноль:\n\n01000001 (+65) + 10111111 ( 65) = (1) 00000000\n\nВсе восемь бит имеют нулевое значение. Перенос единичного би та влево потерян. Однако, если был перенос в знаковый pазряд и из раз рядной сетки, то результат является корректным.\n\nДвоичное вычитание выполняется просто: инвертируется знак вычитаемого и складываются два числа. Вычтем, например, 42 из 65. Двоичное представление для 42 есть 00101010, и его двоичное дополне ние: — 11010110:\n\n65 01000001 +( 42) 11010110 = 23 (1) 00010111\n\nРезультат 23 является корректным. В рассмотренном примере произошел перенос в знаковый разряд и из разрядной сетки.\n\nВ случае, если справедливость двоичного дополнения не сразу по нятна, рассмотрим следующие задачи: Какое значение необходимо при бавить к двоичному числу 00000001, чтобы получить число 00000000? В терминах десятичного исчисления ответом будет 1. Для двоичного рас смотрим 11111111:\n\n00000001 11111111 Результат: (1) 00000000\n\nИгнорируя перенос (1), можно видеть, что двоичное число 11111111 эквивалентно десятичному 1 и соответственно:\n\n0 00000000 (+1) 00000001 1 11111111\n\nМожно видеть также каким образом двоичными числами предcтавлены уменьшающиеся числа:\n\n+3 00000011\n\n+2 00000010\n\n+1 00000001\n\n0 00000000\n\n1 11111111\n\n2 11111110\n\n3 11111101\n\nФактически нулевые биты в отрицательном двоичном числе опре деляют его величину: рассмотрите позиционные значения нулевых битов как если это были единичные биты, сложите эти значения и прибавьте единицу.\n\n"},{"abzac":"Шестнадцатеричное представление","textAbzac":"Представим, что необходимо просмотреть содержимое некотоpых байт в памяти. Требуется oпределить содержимое четырех последова тельных байт (двух слов), которые имеют двоичные значения. Так как че тыре байта включают в себя 32 бита, то специалисты разработали «стено графический» метод представления двоичных данных. По этому методу каждый байт делится пополам и каждые полбайта выражаются соответ ствующим значением. Рассмотрим следующие четыре байта:\n\nДвоичное:\n\n0101 1001 0011 0101 1011 1001 1100 1110\n\nДесятичное:\n\n5\n\n9\n\n3\n\n5\n\n11\n\n9\n\n12\n\n14\n\nТак как здесь для некоторых чисел требуется две цифры, расши рим систему счисления так, чтобы 10=A, 11=B, 12=C, 13=D, 14=E, 15=F. Таким образом получим более сокращенную форму, которая представ ляет содержимое вышеуказанных байт:\n\n59 35 B9 CE\n\nТакая система счисления включает «цифры» от 0 до F, и так как таких цифр 16, она называется шестнадцатеричным представлениeм.\n\nШестнадцатеричный формат нашел большое применение в языке Ассемблера. В листингах ассемблирования программ в шестнадцатерич ном формате показаны все адреса, машинные коды команд и содержи мое констант. Также для отладки при использовании программы DOS DEBUG адреса и содержимое байтов выдается в шестнадцатеричном формате.\n\nВ случае, если немного поработать с шестнадцатеричным форма том, то можно быстро привыкнуть к нему. Рассмотрим несколько простых примеров шестнадцатеричной арифметики. Следует помнить, что после шестнадцатеричного числа F следует шестнадцатеричное 10, что равно десятичному числу 16.\n\nЗаметьте также, что шестнадцатеричное 20 эквивалентно десятич ному 32, шестнадцатеричное 100 — десятичному 256 и шестнадцатерич ное 100 — десятичному 4096.\n\nШестнадцатеричные числа записываются, например, как шест. 4B, двоичные числа какдв.01001011, а десятичные числа, как75 (отсутствие какого либо описания предполагает десятичное число). Для инди кации шестнадцатеричные числа в ассемблерной программе непосредст венно после числа ставится символ H, например,25H (десятичное значе ние 37). Шестнадцатеричное число всегда начинается с деcятичной цифры от 0 до 9, таким образом,B8H записывается как0B8H."},{"abzac":"Сегменты","textAbzac":"Сегментом называется область, которая начинается на границе параграфа, то есть, по любому адресу, который делится на 16 без остатка. Хотя сегмент может располагаться в любом месте памяти и иметь размер до 64 Кбайт, он требует столько памяти, cколько необходимо для выпол нения программы.\n\nСегмент кодов\n\nСегмент кодов содержит машинные команды, которые будут вы полняться. Обычно первая выполняемая команда находится в начале этого сегмента и операционная система передает управление по адресу данного сегмента для выполнения программы.\n\nРегистр сегмента кодов (CS) адресует данный сегмент.\n\nСегмент данных\n\nСегмент данных содержит определенные данные, константы и ра бочие области, необходимые программе. Регистр сегмента данных (DS) адресует данный сегмент.\n\nСегмент стека\n\nСтек содержит адреса возврата как для программы для возврата в операционную систему, так и для вызовов подпрограмм для возврата в главную программу. Регистр сегмента стека (SS) адресует данный сег мент.\n\nЕще один сегментный регистр, регистр дополнительного сегмента (ES), предназначен для специального использования. Последователь ность регистров и сегментов на практике может быть иной.\n\nТри сегментных регистра содержат начальные адреса соответству ющих сегментов и каждый сегмент начинается на границе параграфа.\n\nВнутри программы все адреса памяти относительны к началу cег мента. Такие адреса называются смещением от начала сегмента. Двух байтовое смещение (16 бит) может быть в пределах от шест.0000 до шест.FFFF или от 0 до 65535. Для обращения к любому адресу в програм ме, компьютер складывает адрес в регистре сегмента и смещение. На пример, первый байт в сегменте кодов имеет смещение 0, второй байт — 01 и так далее до смещения 65535.\n\nВ качестве примера адресации, допустим, что регистр сегмента данных содержит шест.045F и некоторая команда обращается к ячейке памяти внутри сегмента данных со смещением 0032. Несмотpя на то, что регистр сегмента данных содержит 045F, он указывает на адрес 045F0, то есть, на границе параграфа. Действительный адрес памяти поэтому будет следующий:\n\nАдрес в DS: 045F0\n\nСмещение: 0032\n\nРеальный адрес: 04622\n\nКаким образом процессоры адресуют память в один миллион байт?\n\nВ регистре содержится 16 бит. Так как адрес сегмента всегда на границе параграфа, младшие четыре бита адреса pавны нулю.\n\nШест.FFF0 позволяет адресовать до 65520 (плюс смещение) байт. Но специалисты решили, что нет смысла иметь место для битов, которые всегда равны нулю.\n\nПоэтому адрес хранится в cегментном регистре как шест. nnnn, а компьютер полагает, что имеются еще четыре нулевых младших бита (одна шест. цифра), то есть, шест.nnnn0. Таким образом, шест.FFFF0 позволяет адресовать до 1048560 байт.\n\nВ случае, если вы сомневаeтесь, то декодируйте каждое шест.F как двоичное 1111, учтите нулевые биты и сложите значения для единичных бит.\n"},{"abzac":"Расширение набора команд","textAbzac":"Команды делятся на следующие группы:\n\nарифметические;\n\nлогические;\n\nпередачи данных;\n\nперехода;\n\nпропуска;\n\nвызова подпрограммы;\n\nвозврата из подпрограммы;\n\nсмешанные.\n\nТипы операндов для каждого типа команд обсуждаются в соответ ствующем порядке:\n\nбайт;\n\nслово;\n\nдесятичный операнд;\n\nразряд;\n\nчисло;\n\nсоставной операнд.\n\nПри обсуждении способов адресации используется следующий порядок:\n\nпрямая;\n\nкосвенная;\n\nнепосредственная;\n\nиндексная;\n\nрегистровая;\n\nавтоиндексирование с предварительным увеличением адреса;\n\nавтоиндексирование с предварительным уменьшением адреса;\n\nавтоиндексирование с последующем уменьшением адреса;\n\nкосвенная с предварительным индексированием;\n\nкосвенная с последующем индексированием.\n\nАрифметические команды\n\nВ эту группу включены следующие команды:\n\nсложение;\n\nсложение с флагом переноса;\n\nвычитание;\n\nвычитание при перестановке операндов;\n\nвычитание с флагом переноса (заем);\n\nувеличение на 1;\n\nуменьшение на 1;\n\nумножение;\n\nделение;\n\nсравнение;\n\nполучение дополнения до двух (отрицательного числа);\n\nрасширение.\n\nДля удобства те команды, принадлежность которых к конкретной категории неясна, повторяются во всех категориях, к которым они мог ли бы быть отнесены.\n\nЛогические команды\n\nЭта группа включает следующие команды:\n\nлогическое И\n\nлогическое ИЛИ\n\nлогическое исключающее ИЛИ\n\nлогическое НЕ (дополнение)\n\nсдвиг\n\nциклический сдвигпроверку.\n\nОна включает также те арифметические команды (такие, как сло жение с аккумулятора с самим собой), которые выполняют логические функции.\n\nКоманды передачи данных\n\nЭта группа включает команды:\n\nзагрузки;\n\nзапоминания;\n\nпересылки;\n\nобмена;\n\nввода;\n\nвывода;\n\nочистки;\n\nустановки.\n\nКроме того, она включает арифметические команды (такие как вычитание аккумулятора из самого себя), которые заносят определенное значение или содержимое какого либо регистра в аккумулятора или дру гой регистр назначения, не изменяя при этом данных.\n\nКоманды перехода\n\nЭта группа включает следующие виды переходов:\n\nКоманды безусловного перехода\n\nПерейти косвенно;\n\nПерейти по индексу, предполагая, что базовый адрес таблицы адресов находится в регистрах Н иL, а индекс в аккумуляторе;\n\nПерейти и связать, то есть, передать управление по адресу DEST, сохранив текущее состояние счетчика команд в регистрахН иL.\n\nКоманды условного перехода\n\nПерейти при равенстве нулю;\n\nПерейти при неравенстве нулю;\n\nПерейти, если значения равны;\nПерейти, если значения не равны;\n\nПерейти, если значение положительное;\n\nПерейти, если значение отрицательное;\n\nПереходы с учетом знака;\n\nПерейти, если больше (без учета знака), то есть, если операнды не равны и при сравнении не требуется заема;\n\nПерейти, если значение не больше (без учета знака), то есть, если сравниваемые операнды равны или при их сравнении требуется заем;\n\nПерейти, если значение меньше (без учета знака), то есть, если сравнение без знака требует заема;\n\nПерейти, если значение не меньше (без учета знака), то есть, если сравнение без знака не требует заема.\n\nКоманды пропуска\n\nКоманда пропуска может быть выполнена с помощью команды перехода с соответствующем адресом назначения.\n\nЭтот адрес назначения должен указывать на команду, следующую после той, которая стоит непосредственно за командой перехода.\n\nДействительное число пропускаемых байтов будет меняться, так как команды могут иметь длину 1 3 байта.\n\nКоманды вызова подпрограмм и возврата из подпрограмм\n\nКоманда безусловного вызова\n\nКосвенный вызов может быть выполнен с помощью обращения к промежуточной подпрограмме, которая переходит косвенно на вызыва емую подпрограмму.\n\nКоманда условного вызова\n\nУсловный вызов подпрограммы может быть выполнен с помощью последовательностей команд для условного перехода.\n\nЕдинственное отличие состоит в том, что команды перехода к дей ствительным адресам назначения должны быть заменены на команды вызова подпрограмм.\n\nКоманды возврата из подпрограмм разделяются на:\n\nКоманды безусловного возврата\n\nКоманды условного возврата\n\nКоманды возврата с пропуском\n\nКоманды возврата после прерывания\n\nСмешанные команды\n\nВэту категорию входят следующие команды:\n\nнет операции\n\nзапись в стек\n\nполучение из стека\n\nостанов\n\nожидание\n\nзахват (программное прерывание)\n\nдругие, не попавшие в описание ранее категории команд."}]}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {"name":"Прикладное программирование","textBook":[{"abzac":"Аннотация","textAbzac":"Дисциплина «Прикладное программирование» является составной\nчастью профессионального модуля «Разработка программных модулей\nпрограммного обеспечения для компьютерных систем» и имеет своей\nцелью формирование профессиональных компетенций в области\nосуществления разработки кода программного продукта на основе\nготовой спецификации на уровне модуля.\nДля освоения курса «Прикладное программирование» студент\nдолжен изучить дисциплины: «Основы программирования», «Основы\nтестирования программного обеспечения», «Системное\nпрограммирование» и «Технология разработки программного\nобеспечения».\nОсвоение данной дисциплины необходимо обучающемуся для\nуспешного прохождения производственной практики и выполнения\nвыпускной квалификационной работы.\nУчебное пособие предназначено для студентов 4 курса (на базе 9\nклассов), обучающихся в бизнес-колледже на отделении\n«Программирование в компьютерных системах».\nЛекционная часть – 48 часа;\nЛабораторные занятия – 48 часов;\nСамостоятельная работа – 36 часов.\nВ результате освоения дисциплины обучающийся должен знать:\n− основные этапы разработки программного обеспечения;\n− основные принципы технологии структурного и объектно-\nориентированного программирования;\n− основные принципы отладки и тестирования программных\nпродуктов;\n− методы и средства разработки технической документации.\nВ результате освоения дисциплины обучающийся должен уметь:\n− осуществлять разработку кода программного модуля на\nсовременных языках программирования;\n− создавать программу по разработанному алгоритму как\nотдельный модуль;\n− выполнять отладку и тестирование программы на уровне\nмодуля;\n−\nВ результате освоения дисциплины обучающийся должен иметь\nнавыки:\n− разработки алгоритма поставленной задачи и реализаций его\nсредствами автоматизированного проектирования;\n− разработки кода программного продукта на основе готовой\n7\nспецификации на уровне модуля;\n− использования инструментальных средств на этапе отладки\nпрограммного продукта;\n− проведения тестирования программного модуля по\nопределенному сценарию.\nУчебное пособие разработано старшим преподавателем кафедры «\nПрикладная математика и Информационные технологии» ДГУНХ\nАмиргамзаевым Г.Г. "},{"abzac":"Лекционный материал по дисциплине. ","textAbzac":""},{"abzac":"Тема 1. Введение. ","textAbzac":"1. Цели использования компьютеров при решении прикладных задач.\n2. Основные этапы разработки программ.\n3. Задачи и особенности прикладного программирования. Основные\nинструменты прикладного программиста.\n4. Выбор языка программирования. "},{"abzac":"","textAbzac":"Прикладное программное обеспечение\nПрикладное программное обеспечение — программа, предназначенная\nдля выполнения определенных пользовательских задач и рассчитанная на\nнепосредственное взаимодействие с пользователем.\nПрограммное обеспечение, предназначенное для использования в\nходе проектирования, разработки и сопровождения программ, в отличие\nот прикладного и системного программного обеспечения. Строго говоря,\nопределение последнего включает в себя определение инструментального,\nпоэтому инструментальное можно считать обособленным подклассом\nприкладного ПО.\nСистемное программное обеспечение\nКомплекс программ, которые обеспечивают управление\nкомпонентами компьютерной системы, такими как процессор,оперативная\nпамять, устройства ввода-вывода, сетевое оборудование, выступая как\n«межслойный интерфейс», с одной стороны которого аппаратура, а с другой —\nприложения пользователя. В отличие\nот прикладногопрограммногообеспечения, системное не решает конкретные\nпрактические задачи, а лишь обеспечивает работу других программ,\nпредоставляя им сервисные функции, абстрагирующие детали аппаратной\nи микропрограммной реализации вычислительной системы, управляет\nаппаратными ресурсами вычислительной системы. Отнесение того или иного\nпрограммного обеспечения к системному условно, и зависит от соглашений,\nиспользуемых в конкретном контексте. Как правило, к системному\n\nпрограммному обеспечению относятся операционные системы\n[⇨]\n, утилиты\n[⇨]\n,\nсистемы программирования\n[⇨]\n, системы управления базами данных\n[⇨]\n, широкий\nкласс связующего программного обеспечения.\nКачество программного обеспечения\nХарактеристика программного обеспечения (ПО) как степени его\nсоответствия требованиям. При этом требования могут трактоваться довольно\nшироко, что порождает целый ряд независимых определений понятия. Чаще\nвсего используется определение ISO 9001, согласно которому качество есть\n«степень соответствия присущих характеристик требованиям».\nТестирование программного обеспечения\nПроцесс исследования программного обеспечения (ПО) с целью\nполучения информации о качестве продукта. С точки зренияISO 9126, качество\nпрограммного обеспечения можно определить как совокупную характеристику\nисследуемого ПО с учётом следующих составляющих:\n• Надёжность\n• Сопровождаемость\n• Практичность\n• Эффективность\n• Мобильность\n• Функциональность\nПрикладное программирование представляет собой использование\nразличных программных средств для создания прикладных программ или\nприложений.\nПрикладная программа или приложение — это программа,\nпредназначенная для выполнения определенных пользовательских задач\nи рассчитанная на непосредственное взаимодействие с пользователем.\nВ большинстве операционных систем \n\nобращаться к ресурсам компьютера напрямую, а взаимодействуют\nс оборудованием и проч. посредством операционной системы.\n1. Цели использования компьютеров при решении прикладных задач.\nРешение задач с использованием компьютера характеризуется\nнесколькими этапами, часть из которых выполняются непосредственно\nчеловеком, остальные - человеком и машиной:\nПостановка задачи. Описание исходных данных, формулирование цели\nзадачи. Построение информационной модели. Описание реального объекта\nисследования в допустимых для реализации задачи терминах, чтобы свести\nисследования реального объекта к решению задачи на модели.\nВыбор программного обеспечения. Определение необходимого прикладного\nпрограммного обеспечения (если оно есть) или разработка нового\nпрограммного обеспечения (разработка алгоритма, выбор системы\nпрограммирования, написание и тестирование программы).\n2. Основные этапы разработки программ.\nРешение любой задачи на ЭВМ представляет собой процесс обработки\nданных с помощью программы. Создание такой программы предполагает\nвыполнение ряда последовательных этапов:\n1. Постановка задачи. На этом этапе подробно описывается исходная\nинформация и формируются требования к результату, а также\nописывается поведение программы в особых случаях.\n2. Мат. или инф, моделирование. Этот этап создает мат. модель\nрешаемой задачи, которая может быть реализована на компьютере.\n3. Разработка или выбор алгоритма.\n4. Программирование. Программой называется последовательность\nдействий, направленных на выполнение их некоторым исполнителем.\n5. Ввод программы и исходных данных в ЭВМ.\n6. Тестирование и отладка программы.\n7. Исполнение программы и анализ результатов\n\nПервый этап представляет собой постановку задачи. На этом этапе\nформулируется цель задачи, определяется взаимосвязь с другими задачами,\nраскрывается состав и форма представления входной, промежуточной и\nрезультативной информации, характеризуются формы и методы контроля\nдостоверности информации на ключевых этапах решения задачи, определяются\nформы взаимодействия пользователя с ЭВМ в ходе решения задачи и т.п.\nНа втором этапе разработки программы выполняется формализованное\nописание программы, т.е. устанавливаются и формулируются средства языка\nматематики логико-математические зависимости между исходными и\nрезультатными данными. Для задач, допускающих возможность\nматематического описания, необходимо выбрать численный метод решения, а\nдля нечисловых задач – принципиальную схему решения в виде однозначно\nпонимаемой последовательности выполнения элементарных математических и\nлогических операций.\nТретий этап подготовки решения задачи на ВМ представляет собой\nалгоритмизацию ее решения, т.е. разработку оригинального или адаптацию\nизвестного алгоритма. Алгоритмизация – это сложный процесс, носящий в\nзначительной степени творческий характер. Постановка задачи и ее\nалгоритмизация составляют до 20-30% общего времени на разработку\nпрограммы. Сложность и ответственность реализации данного этапа\nобъясняется тем, что для решения одной и той же задачи, как правило,\nсуществует множество различных алгоритмов.\nАлгоритм – это точное предписание, определяющее вычислительный\nпроцесс, ведущий от варьируемых начальных данных к искомому результату.\nЭто конечный набор правил, однозначно раскрывающих содержание и\nпоследовательность выполнения операций для систематического решения\nопределенного класса задач за конечное число шагов.\nЧетвертый этап – составление программы. На этом этапе производится\nперевод описания алгоритма на один из доступных для ЭВМ языков описания. \n\nИсторически термин «алгоритм» произошел от фамилии узбекского\nматематика IX века Мухаммада ибн Муса ал-Хорезми, который впервые\nсформулировал правила четырех основных арифметических действий.\nПоначалу именно эти правила назывались алгоритмами, но затем термин\nполучил дальнейшее развитие в первую очередь в математике – алгоритмом\nстал называться любой способ вычислений, единый для некоторого класса\nисходных данных. Например, нахождение производной функции. Одна из\nважнейших задач обучения математике состоит именно в освоении общих\nвычислительных алгоритмов. Другими словами, если школьника учат\nперемножать столбиком два числа, то при этом предполагается, что он\nосваивает не умножение конкретных выбранных чисел, а универсальный\nспособ (алгоритм), который в дальнейшем может быть применен для\nнахождения произведения любой пары конечных чисел.\nАлгоритм – это точно определенная (однозначная) последовательность\nпростых (элементарных) действий, обеспечивающих решение любой задачи из\nнекоторого класса. Однако данное утверждение нельзя принять в качестве\nстрогого определения алгоритма, поскольку в нем использованы другие\nнеопределенные понятия – однозначность, элементарность и пр.\n3. Выбор языка программирования.\nПри выборе языка программирования нужно учитывать множество\nфакторов. Например, если при разработке динамической Web-страницы вы в\nкачестве наилучшего варианта выберите JavaServer Pages (JSP)/сервлеты,\nдругие могут предпочесть PHP или аналогичный язык сценариев. Не\nсуществует какого-то одного языка, который является наилучшим выбором.\nМожно отдать предпочтение определенным факторам, таким как\nпроизводительность и безопасность корпоративных приложений, по сравнению\nс другими факторами, такими как количество строк кода. Любое решение\nсопряжено с какими-то компромиссами. \n\nПосле получения проекта или задания нужно выполнить\nподготовительную работу до решения поставленной задачи. Зачастую выбор\nязыка не рассматривается как часть этой подготовительной работы.\nПри выборе языка для персонального проекта можно положиться на свои\nличные предпочтения. Здесь может оказаться важным количество строк кода;\nочевидным выбором будет язык, позволяющий выполнить задачу при помощи\n10 строк кода вместо 20. Сначала хочется получить решение, а потом\nпозаботиться об удобочитаемости или производительности.\nВ проектах для крупных организаций применяется другой сценарий. Для\nрешения конкретной проблемы группы разработчиков создают компоненты,\nвзаимодействующие и взаимосвязанные между собой. На выбор языка могут\nповлиять такие факторы, как переносимость программы на другую платформу\nили доступность ресурсов.\nПравильный выбор языка программирования поможет создать\nкомпактное, простое в отладке, расширении, документировании и исправлении\nошибок решение. При выборе языка программирования учитываются\nследующие факторы:\n• Целевая платформа.\n• Гибкость языка.\n• Время исполнения проекта.\n• Производительность.\n• Поддержка и сообщество.\nЦелевая платформа\nСамым важным фактором является платформа, на которой программа\nбудет работать. Рассмотрим для примера Java™ и C. Если программа написана\nна C и должна работать на машинах с Windows® и Linux®, потребуются\nкомпиляторы для платформ и два разных исполняемых файла. В случае с Java\nсгенерированного байт-кода будет достаточно для выполнения программы на\nлюбом компьютере, на котором установлена виртуальная Java-машина. \n\nАналогичный аргумент применим и для Web-сайтов. Они должны\nвыглядеть и работать одинаково во всех браузерах. Использование тегов CSS3\nи HTML5 без проверки совместимости с браузерами приведет к разному\nотображению и поведению сайта в разных браузерах.\nГибкость\nГибкость языка определяется тем, насколько легко можно добавлять к\nсуществующей программе новые функциональные возможности. Это может\nбыть добавление нового набора функций или использование существующей\nбиблиотеки для добавления новой функциональности.\nВремя исполнения проекта\nВремя исполнения – это время, необходимое для создания рабочей версии\nпрограммы, т.е. версии, готовой для работы в производственных условиях и\nвыполняющей предусмотренные функции. При расчете этого времени\nнеобходимо учитывать не только логику управления, но и логику\nпредставления.\nВремя исполнения проекта очень зависит от размера кода. Теоретически,\nчем легче изучить язык и чем меньше объем кода, тем меньше это время.\nНапример, сайт управления контентом на PHP-сценариях можно\nразработать за несколько дней, в то время как создание кода сервлетов может\nзанять несколько месяцев, при условии, что вы начали изучать оба языка с\nнуля.\nПроизводительность\nКаждая программа и платформа имеет определенный предел\nпроизводительности, и на эту производительность влияет используемый при\nразработке язык. Существует множество способов сравнения скорости работы в\nодинаковой среде программ, написанных на разных языках. Можно\nиспользовать различные эталонные тесты, хотя их результаты не являются\nконкретной оценкой производительности какого бы то ни было языка. "},{"abzac":"Тема 2. Технологии разработки прикладного программного обеспечения. ","textAbzac":"1.Технологии прикладного программирования: цели, задачи и основные\nпринципы и инструменты.\n2. Алгоритмическая и объектно-ориентированная декомпозиция.\nТехнологией программирования называют совокупность методов и средств,\nиспользуемых в процессе разработки программного обеспечения. Как любая\nдругая технология, технология программирования представляет собой набор\nтехнологических инструкций, включающих:\n• указание последовательности выполнения технологических операций;\n• перечисление условий, при которых выполняется та или иная операция;\n• описания самих операций, где для каждой операции определены\nисходные данные, результаты, а также инструкции, нормативы,\nстандарты, критерии и методы оценки и т. п.\nКроме набора операций и их последовательности, технология также\nопределяет способ описания проектируемой системы, точнее модели,\nиспользуемой на конкретном этапе разработки.\nРазличают технологии, используемые на конкретных этапах разработки\nили для решения отдельных задач этих этапов, и технологии, охватывающие\nнесколько этапов или весь процесс разработки. В основе первых, как правило,\nлежит ограниченно применимый метод, позволяющий решить конкретную\nзадачу. В основе вторых обычно лежит базовый метод или подход (парадигма),\nопределяющий совокупность методов, используемых на разных этапах\nразработки, или методологию.\nИсторически в развитии программирования можно выделить несколько\nпринципиально отличающихся методологий.\nИзначально понятие технологии как таковой — это 60-е годы прошлого\nстолетия — это период \"стихийного\" программирования. В этот период\nотсутствовало понятие структуры программы, типов данных и т.д. Вследствие\nэтого код получался запутанным, противоречивым. Программирование тех лет\nсчиталось искусством. Конец 60-х — кризис в программирование.\nВыход из этого кризиса — переход к структурной парадигме\nпрограммирования. Структурный подход к программированию представляет\nсобой совокупность рекомендуемых технологических приемов, охватывающих\nвыполнение всех этапов разработки программного обеспечения. В основе\nструктурного подхода лежит декомпозиция (разбиение на части) сложных\nсистем с целью последующей реализации в виде отдельных небольших\nподпрограмм. С появлением других принципов декомпозиции (объектного, \n16\nлогического и т.д.) данный способ получил название процедурной\nдекомпозиции.\nДругим базовым принципом структурного программирования является\nиспользование при составлении программ только базовых алгоритмических\nструктур (см. билет 4), запрет на использование оператора GOTO.\nСтруктурный подход требовал представления задачи в виде иерархии\nподзадач простейшей структуры. Проектирование осуществлялось \"сверху-\nвниз\" и подразумевало реализацию общей идеи, обеспечивая проработку\nинтерфейсов подпрограмм. Одновременно вводились ограничения на\nконструкции алгоритмов, рекомендовались формальные модели их описания, а\nтакже специальный метод проектирования алгоритмов — метод пошаговой\nдетализации.\nПоддержка принципов структурного программирования была заложена в\nоснову так называемых процедурных языков программирования. Как правило,\nони включали основные \"структурные\" операторы передачи управления,\nподдерживали вложение подпрограмм, локализацию и ограничение области\n\"видимости\" данных. Среди наиболее известных языков этой группы стоит\nназвать PL/1, ALGOL-68, Pascal, С.\nДальнейший рост сложности и размеров разрабатываемого программного\nобеспечения потребовал развития структурирования данных. Как следствие\nэтого в языках появляется возможность определения пользовательских типов\nданных. Одновременно усилилось стремление разграничить доступ к\nглобальным данным программы, чтобы уменьшить количество ошибок,\nвозникающих при работе с глобальными данными. В результате появилась и\nстала развиваться технология модульного программирования.\n2. Алгоритмическая и объектно-ориентированная декомпозиция.\nДекомпозиция — научный метод, использующий структуру задачи и\nпозволяющий заменить решение одной большой задачи решением серии\nменьших задач, пусть и взаимосвязанных, но более простых.\nДекомпозиция, как процесс расчленения, позволяет рассматривать любую\nисследуемую систему как сложную, состоящую из отдельных взаимосвязанных\nподсистем, которые, в свою очередь, также могут быть расчленены на части. В\nкачестве систем могут выступать не только материальные объекты, но и\nпроцессы, явления и понятия.\nОбъектно-ориентированный подход использует объектную\nдекомпозицию. При этом статическая структура системы описывается в\n17\nтерминах объектов и связей между ними, а поведение системы описывается в\nтерминах обмена сообщениями между объектами. Каждый объект системы\nобладает своим собственным поведением, моделирующим поведение объекта\nреального мира.\nПонятие объект впервые было использовано около 30 лет назад в\nтехнических средствах при попытках отойти от традиционной архитектуры фон\nНеймана и преодолеть барьер между высоким уровнем программных\nабстракций и низким уровнем абстрагирования на уровне компьютеров. С\nобъектно-ориентированной архитектурой также тесно связаны объектно-\nориентированные операционные системы. Однако наиболее значительный\nвклад в объектный подход был внесен объектными и объектно-\nориентированными языками программирования: Simula, Smalltalk, С++, Object\nPascal. На объектный подход оказали влияние также развивавшиеся достаточно\nнезависимо методы моделирования баз данных, в особенности подход\nсущность – связь.\nКонцептуальной основой объектно-ориентированного подхода является\nобъектная модель. Основными ее элементами являются:\n• абстрагирование;\n• инкапсуляция;\n• модульность;\n• иерархия.\nКроме основных, имеются еще три дополнительных элемента, не являющихся в\nотличие от основных строго обязательными:\n• типизация;\n• параллелизм;\n• устойчивость.\nАбстрагирование – это выделение существенных характеристик\nнекоторого объекта, которые отличают его от всех других видов объектов и,\nтаким образом, четко определяют его концептуальные границы относительно\nдальнейшего рассмотрения и анализа. Абстрагирование концентрирует\n18\nвнимание на внешних особенностях объекта и позволяет отделить самые\nсущественные особенности его поведения от деталей их реализации. Выбор\nправильного набора абстракций для заданной предметной области представляет\nсобой главную задачу объектно-ориентированного проектирования.\nИнкапсуляция – это процесс отделения друг от друга отдельных\nэлементов объекта, определяющих его устройство и поведение. Инкапсуляция\nслужит для того, чтобы изолировать интерфейс объекта, отражающий его\nвнешнее поведение, от внутренней реализации объекта. Объектный подход\nпредполагает, что собственные ресурсы, которыми могут манипулировать\nтолько методы самого класса, скрыты от внешней среды. Абстрагирование и\nинкапсуляция являются взаимодополняющими операциями: абстрагирование\nфокусирует внимание на внешних особенностях объекта, а инкапсуляция (или,\nиначе, ограничение доступа) не позволяет объектам пользователям различать\nвнутреннее устройство объекта"},{"abzac":"Тема 3. Принципы объектно-ориентированного анализа","textAbzac":"1. Принципы ООП. Абстрагирование, инкапсуляция, наследование,\nполиморфизм, модульность, сохраняемость, параллелизм.\n2. Объекты и типы объектов.\n3. Атрибуты и типы атрибутов. Экземпляры и состояния. Жизненный\nцикл и поведение объектов.\n1. Принципы ООП. Абстрагирование, инкапсуляция, наследование,\nполиморфизм, модульность, сохраняемость, параллелизм.\nОбъектно-ориентированная технология основывается на так\nназываемой объектной модели. Основными ее принципами являются:\nабстрагирование, инкапсуляция, модульность, иерархичность, типизация,\nпараллелизм и сохраняемость. Каждый из этих принципов сам по себе не нов,\nно в объектной модели они впервые применены в совокупности.\nОбъектно-ориентированный анализ и проектирование принципиально\nотличаются от традиционных подходов структурного проектирования: здесь\nнужно по-другому представлять себе процесс декомпозиции, а архитектура\nполучающегося программного продукта в значительной степени выходит за\nрамки представлений, традиционных для структурного программирования.\nОтличия обусловлены тем, что структурное проектирование основано на\nструктурном программировании, тогда как в основе объектно-\nориентированного проектирования лежит методология объектно-\nориентированного программирования, К сожалению, для разных людей термин\n\"объектно-ориентированное программирование\" означает разное. В этой главе\nмы выясним, чем является и чем не является объектно-ориентированная\nразработка программ, и в чем отличия этого подхода к проектированию от\nдругих с учетом семи перечисленных выше элементов объектной модели.\nОбъектно-ориентированное программирование. Объектно-\nориентированное программирование - это методология программирования,\nоснованная на представлении программы в виде совокупности объектов,\nкаждый из которых является экземпляром определенного класса, а классы\nобразуют иерархию наследования.\n20\nАбстракция (абстрагирование) — это способ выделить набор значимых\nхарактеристик объекта, исключая из рассмотрения незначимые.\nСоответственно, абстракция — это набор всех таких характеристик.\nИнкапсуляция — это свойство системы, позволяющее объединить\nданные и методы, работающие с ними в классе, и скрыть детали реализации от\nпользователя.\nНаследование — это свойство системы, позволяющее описать новый\nкласс на основе уже существующего с частично или полностью\nзаимствующейся функциональностью. Класс, от которого производится\nнаследование, называется базовым, родительским или суперклассом. Новый\nкласс — потомком, наследником или производным классом.\nПолиморфизм — это свойство системы использовать объекты с\nодинаковым интерфейсом без информации о типе и внутренней структуре\nобъекта.\nПАРАЛЛЕЛИЗМ - это возможность иметь несколько объектов, которые\nвыполняются одновременно.\nМодульность в языках программирования — принцип, согласно\nкоторому программное средство (ПС, программа, библиотека, веб-приложение\nи др.) разделяется на отдельные именованные сущности,\nназываемые модулями. Модульность часто является средством упрощения\nзадачи проектирования ПС и распределения процесса разработки ПС между\nгруппами разработчиков. При разбиении ПС на модули для каждого модуля\nуказывается реализуемая им функциональность, а также связи с другими\nмодулями.\nСохраняемость - способность данных существовать в определенном\nвремени.\n2. Объекты и типы объектов.\nОбъект в программировании — некоторая сущность в виртуальном\nпространстве, обладающая определённым состоянием и поведением, имеющая\n21\nзаданные значения свойств (атрибутов) и операций над ними (методов). Как\nправило, при рассмотрении объектов выделяется то, что объекты принадлежат\nодному или нескольким классам, которые определяют поведение (являются\nмоделью) объекта. Термины «экземпляр класса» и «объект»\nвзаимозаменяемы.\nОбъект, наряду с понятием класс, является важным понятием объектно-\nориентированногоподхода.\nОбъектыобладаютсвойствами наследования, инкапсуляции и полиморфизма.\nТермин объект в программном обеспечении впервые был введен в\nязыке Simula и применялся для моделирования реальности.\nТип объекта – это принадлежность его к определенной группе в\nзависимости от характеристик.\n3. Атрибуты и типы атрибутов. Экземпляры. Жизненный цикл и\nповедение объектов.\n• Атрибут — в некоторых файловых системах одно из свойств файла.\n• Атрибут — иное название для полякласса в объектно-ориентированном\nпрограммировании.\nТипы атрибутов определяют, какие значения могут принимать\nатрибуты.Существуют следующие типы атрибутов:\n1) Целочисленный – Значением атрибута может являться любое целое число\n2) Дробный –Значением атрибута может являться любое дробное число\n3) Дата –Значением атрибута может являться дата в формате ДД. ММ. ГГГГ\n4) Перечисление – значения атрибута задаются в виде последовательности\nстроковых и числовых значений при создании и редактировании атрибута.\nЗначения задаются отдельно для каждого языка. При создании и\nредактировании товара можно выбрать одно из них из выпадающего списка в\nкачестве значения атрибута типа «Перечисление» для данного товара.\n5) Строковый – атрибут данного типа может принимать строку в качестве\nзначения. Значения задаются отдельно для каждого языка при создании и\nредактировании товара.\n6) Файл –Значением атрибута может являться URL файла\n22\n7) Языково-нечувствительная строка – атрибут данного типа может принимать\nстроку в качестве значения. Значение задается одно для всех языков при\nсоздании и редактировании товара.\n8) Булев - Значением атрибута может являться значение «Да» или «Нет»\n9) Языково-нечувствительное перечисление - значения атрибута задаются в\nвиде последовательности строковых и числовых значений при создании и\nредактировании атрибута. Значения задаются одновременно для всех языков.\nПри создании и редактировании товара можно выбрать одно из них из\nвыпадающего списка в качестве значения атрибута типа «Перечисление» для\nданного товара.\n10) Файл-картинка – атрибут данного типа может принимать URL файла с\nизображением, который задается с помощью диалогового окна или вводится\nвручную при добавлении или редактировании товара.\nЭкземпляры\nВ объектно-ориентированной программе с применением классов каждый\nобъект является «экземпляром» некоторого конкретного класса, и других\nобъектов не предусмотрено. То есть «экземпляр класса» в данном случае\nозначает не «пример некоторого класса» или «отдельно взятый класс», а\n«объект, типом которого является какой-то класс». При этом в разных языках\nпрограммирования допускается либо не допускается существование еще каких-\nто типов данных, экземпляры которых не являются объектами (то есть язык\nопределяет, являются ли объектами такие вещи, как числа, массивы и\nуказатели, или не являются, и, соответственно, есть ли такие классы как\n«число», «массив» или «указатель», экземплярами которых были бы каждое\nконкретное число, массив или указатель).\nНапример, абстрактный тип данных «строка текста» может быть\nоформлен в виде класса, и тогда все строки текста в программе будут являться\nобъектами — экземплярами класса «строка текста».\nЖизненный цикл объекта\nС точки зрения программы объектрождается тогда, когда под него\nвыделяетсяпамять и происходит инициализация егосостояния. \n23\nОбъект заканчивает свой жизненный путьтогда, когда высвобождаются\nзанятые имресурсы, и память возвращается в системудля дальнейшего\nиспользования.\nВ разных объектно-ориентированных языкахсуществуют разные\nмеханизмы, управляющиерождением и уничтожением объектов.\nПримером для C++ могут служить конструкторы идеструкторы,\nоператоры new и delete.\nВ Java существуют только конструкторы иоператор new. Нет механизма\nраспределения ивыбора памяти под объекты. За освобождение памятиотвечает\nспециальная программа сборщик мусора\nПоведение\nОбъекты не существуют изолированно, авзаимодействуют друг с другом,\nреализуяповедение.Рассмотрим известную аллегорию просамолет: ’’Самолет\nпредставляет собой совокупностьвещей, каждая из которых по\nотдельностистремится упасть на землю, но вместе, вовзаимодействии, они\nпреодолевают этутенденцию’’.\nПоведение – это то, как объектдействует и реагирует;\nповедениевыражается в терминах состояния объектаи передачи\nсообщений.Поведение объекта – это его наблюдаемая и проверяемая извне\nдеятельность.Взаимодействие объектов описывается втерминах передачи и\nобработкисообщений.Поведение объекта определяетсяпереданными ему\nсообщениями и еготекущим состоянием. Причем, некоторыесообщения могут\nизменить внутреннеесостояние объекта.Состояние объекта\nпредставляетсуммарный результат его поведения. "},{"abzac":"Тема 4. Объектно-ориентированное проектирование. ","textAbzac":"1. Документирование результатов анализа и проектирования.\n2. Основные понятия UML (UnifiedModelingLanguage).Сущности и\nотношения.\n1. Документирование результатов анализа и проектирования.\nОбъектно-ориентированное проектирование(ООП) -\nэточасть объектно-ориентированной методологии, которая предоставляет\nвозможность программистам оперировать понятием «объект», нежели\nпонятием «процедура» при разработке своего кода. Объекты\nсодержат инкапсулированные данные и процедуры, сгруппированные вместе,\nотображая т.о. сущность объекта. «Интерфейс объекта», описывает\nвзаимодействие с объектом, то, как он определен. Программа, полученная при\nреализации объектно-ориентированного исходного кода, описывает\nвзаимодействие этих объектов.\n2. ОсновныепонятияUML (UnifiedModelingLanguage).Сущности и\nотношения.\nУнифицированный язык моделирования (UML, Unified Modeling\nLanguage) является преемником методов объектно-ориентированного анализа и\nпроектирования (OOA&D), которые появились в конце 80-х и начале 90-х\nгодов.\nПервое упоминание об унифицированном методе (Unified Method) версии\n0.8 появилось в 1995 году на конференции OOPSLA ’95. Данный метод был\nпредложен Гради Бучом и Джимом Рамбо. В дальнейшем к ним присоединился\nАйвар Якобсон и в течение 1996 года Г. Буч, Д. Рамбо, А. Якобсон, получившие\nширокую известность как «трое друзей» (amigos) продолжали работа над своим\nметодом, который к тому времени получил название унифицированный язык\nмоделирования (UML). Однако помимо данного метода сообществом\nразработчиком были предложены и другие методы. Для стандартизации этих\nметодов в рамках OMG (Object Management Group) была сформирована\nинициативная группа. \n25\nВ результате работы группы появилась версия языка UML 1.1. Текущей\nверсией языка UML является версия 1.5.Ведется работа над спецификацией\nязыка UML версии 2.0.\nUML – это название языка моделирования, но не метода. Следует\nразличать эти понятия. Большинство методов включают в себя помимо языка\nмоделирования процесс. Язык моделирования – это нотация (главным образом\nграфическая), которая используется разработчиками для описания проекта.\nПроцесс – это рекомендация относительно этапов, которых необходимо\nпридерживаться при выполнении проекта.\nUML — прежде всего язык, и, как всякое языковое средство, он предоставляет\nсловарь и правила комбинирования слов в этом словаре. В данном случае\nсловарь и правила фокусируются на концептуальном и физическом\nпредставлениях системы. Язык диктует, как создать и прочитать модель,\nоднако не содержит никаких рекомендаций о том, какую модель системы\nнеобходимо создать, — это выходит за рамки UML и является прерогативой\nпроцесса разработки программного обеспечения. В связи с этим, видимо, UML\nдовольно часто ассоциируют с RUP — одним из возможных процессов,\nрекомендующих, какие модели, как и когда нужно создавать для успешной\nразработки продукта.\nUML — это язык визуализации. Написание моделей на UML преследует\nодну простую цель — облегчение процесса передачи информации о системе. За\nкаждым символом UML стоит строго определенная семантика, что позволяет\nизбегать ошибок интерпретации (ответы на вопросы типа «а что имел в виду\nразработчик Х, когда он описал иерархию классов Y…» и т.п. будут достаточно\nпрозрачны).\nUML — это язык спецификаций и точных определений. В этом смысле\nмоделирование на UML означает построение моделей, которые точны,\nнедвусмысленны и полны. \n26\nUML — это язык конструирования. UML не является визуальным языком\nпрограммирования, но модели в терминах UML могут быть отображены на\nопределенный набор объектно-ориентированных языков программирования.\nUML предоставляет возможности прямого (существующая модель ®\nновый код) и обратного (существующий код ® новая модель) проектирования.\nДостаточно часто средства UML-моделирования реализуют отображения UML-\nмоделей в коде на языках Java, C++, CORBA, VB, Smalltalk.\nUML — это язык документирования. Процесс разработки программного\nобеспечения предусматривает не только написание кода, но и создание таких\nартефактов, как список требований, описание архитектуры, дизайн, исходный\nкод системы, планирование проекта, тесты, набор прототипов, релизы\nпродукта. В зависимости от культуры разработки продукта в той или иной\nкомпании степень формализации данных документов существенно различается,\nварьируясь от строго определенных шаблонов и формата документов до\nразговоров на произвольную тему по e-mail или лично. Тем не менее все эти\nартефакты критичны для успешного процесса разработки продукта. UML\nпредоставляет средства отображения требований к системе, построения\nдокументации, тестов, моделирования необходимых действий для\nпланирования проекта и для управления поставленными конечному\nпользователю релизами.\nОсновными элементами UML являются сущности (Thing), отношения\n(Relationship), диаграммы (Diagram). Сущности являются ключевыми\nабстракциями языка, отношения связывают сущности вместе, диаграммы\nгруппируют коллекции сущностей, которые представляют интерес.\nСущности\nСтруктурные сущности являются существительными языка. К ним относятся:\n• классы (Class) — это набор объектов, разделяющих одни и те же атрибуты,\nоперации, отношения и семантику. Класс реализует один или несколько\nинтерфейсов и изображается виде прямоугольника, включающего имя класса,\nимена атрибутов, операций, примечание; \n27\n• интерфейсы (Interface) — это набор операций, которые определяют сервис\nкласса или компоненты. Интерфейс графически изображается в виде круга и,\nкак правило, присоединяется к классу или к компоненту, который реализует\nданный интерфейс;\n• кооперации (Collaboration) — определяют взаимодействие и служат для\nобъединения ролей и других элементов, которые взаимодействуют вместе так,\nчто получающееся в результате поведение объекта оказывается большим, чем\nпросто сумма всех элементов. Изображается в виде эллипса с пунктирной\nграницей;\n• прецеденты (Use case) — описание набора последовательностей действий,\nкоторые выполняются системой и имеют значение для конкретного\nдействующего лица (Actor). Прецеденты изображаются в виде эллипса и\nиспользуются для структурирования поведенческих сущностей в модели;\n• активные классы (Active class) — это классы, чьими экземплярами являются\nактивные объекты, которые владеют процессом или потоком управления и\nмогут инициировать управляющее воздействие. Стереотипами конкретного\nкласса являются процесс (Process) и поток (Thread). Графически такой класс\nизображается как класс с жирной границей;\n• компоненты (Component) — это физически заменяемые части системы,\nобеспечивающие реализацию ряда интерфейсов. Компонент — это физическое\nпредставление таких логических элементов, как классы, интерфейсы и\nкооперации. Предметная область компонентов относится к реализации.\nИзображаются компоненты в виде прямоугольника с ярлыками слева и, как\nправило, имеют только имя и примечание;\n• узлы (Node) — физические объекты, которые существуют во время\nисполнения программы и представляют собой коммуникационный ресурс,\nобладающий, по крайней мере, памятью, а зачастую и процессором. На узлах\nмогут находиться выполняемые объекты и компоненты. Изображаются узлы в\nвиде куба, имеют имя и примечание. \n28\nДанные перечисленных семи типов объектов являются базовыми\nструктурными объектами UML. Существуют также вариации данных объектов,\nтакие как действующие лица (Actor), сигналы (Signal), утилиты (Utility — вид\nкласса), процессы и нити (Process и Thread — виды активного класса),\nприложения (Application), документы (document), файлы (File), библиотеки\n(Library), страницы (Page), таблицы (Table).\nПоведенческие сущности — это динамические части моделей UML. К ним\nотносятся:\n• взаимодействия (Interaction) — включают набор сообщений, которыми\nобмениваются указанные объекты с целью достижения указанной цели.\nВзаимодействие описывается в контексте кооперации и изображается\nнаправленной линией, маркируется именем операции сверху;\n• автоматы (State machine) — спецификации поведения, представляющие собой\nпоследовательности состояний, через которые проходит в течение своей жизни\nобъект, или взаимодействие в ответ на происходящие события (а также\nответные действия объекта на эти события). Автомат прикреплен к исходному\nэлементу (классу, кооперации или методу) и служит для определения\nповедения его экземпляров. Изображается автомат как прямоугольник с\nзакругленными углами.\nГруппирующие сущности — это организационные составляющие\nмоделей UML. К ним относятся пакеты (Package) — обобщенный механизм для\nорганизации элементов в группы. Структурные, поведенческие, группирующие\nсущности могут быть помещены в пакет. Пакеты являются чисто\nконцептуальными сущностями — в отличие от компонентов, существующих во\nвремя исполнения программы. Изображается пакет как папка с ярлыком сверху\nи, как правило, имеет только имя.\nАннотационные сущности — это пояснительные составляющие\nмоделей UML, к которым относятся примечания (Note) — пояснительные\nэлементы языка. Они содержат текст комментария, изображаются в виде\nпрямоугольника с загнутым уголком страницы. \n29\nОтношения.\nК базовым отношениям между объектами, которые позволяют строить блоки\nUML, можно отнести следующие:\n• зависимость (Dependency) — это семантическое отношение между двумя\nсущностями, при котором изменение одной из них (независимой сущности)\nможет отразиться на семантике другой (зависимой). Виды зависимостей,\nкоторые соответствуют нескольким видам отношений между объектами,\nперечислены ниже:\n- абстракция (Abstraction) — представляет собой изменение уровня\nабстрактности для некоторого понятия. Как правило, один из элементов, более\nабстрактный, а второй — более конкретный, хотя возможны ситуации, когда\nоба элемента являются двумя возможными вариантами понятия,\nсуществующими на одном уровне абстракции. К зависимости абстракции\nотносятся следующие стереотипы (в порядке возрастания специфичности\nотношений): трассировать (Trace), уточнять (Refine), реализовать (есть\nсобственная нотация) и выводить (Derive),\n- связывание (Binding) — связывает элемент с шаблоном. Аргументы,\nнеобходимые для параметров шаблона, прикреплены к зависимости связывания\nв виде списка,\n- комбинирование (Combination) — соотносит две части описания\nклассификатора (любой элемент модели, описывающий определенные черты\nструктуры и поведения системы), чтобы получить полное описание элемента,\n- разрешение (Permission) — зависимость (всегда изображается в виде особого\nстереотипа), связывающая тот или иной пакет (или класс) с другим пакетом\n(или классом), которому он предоставляет разрешение использовать свое\nсодержимое. Стереотипами зависимости разрешения являются: быть\nдоступным (Access), быть дружественным (Friend) и импортировать (Import),\n- использование (Usage) — описывает ситуацию, когда одному элементу для\nправильной реализации или функционирования требуется присутствие другого\nэлемента. К стереотипам этого вида зависимости относятся: вызывать (Call), \n30\nсоздать экземпляр (Instantiate), параметр (Parameter) и отправить(Send);\n• ассоциация (Association) — структурное отношение, описывающее множество\nсвязей между объектами классификаторов, где связь (Link) — это соединение\nмежду объектами, которое описывает связи между их экземплярами.\nАссоциации являются как бы клеем, который связывает систему воедино. Без\nассоциаций мы имели бы просто некоторое количество классов, не способных\nвзаимодействовать друг с другом. У ассоциации может быть имя, однако\nосновную информацию об ассоциации следует искать у ее полюсов, где\nописывается, каким образом каждый объект участвует в ассоциации: у\nассоциации есть список, состоящий из двух или более полюсов ассоциации:\nкаждый из них определяет роль, которую играет данный классификатор в этой\nассоциации. Один и тот же классификатор может играть несколько ролей,\nкоторые не являются взаимозаменяемыми. Каждый полюс ассоциации\nописывает свойства, применимые к конкретному объекту этой ассоциации,\nнапример сколько раз один объект может появляться в связях\n(множественность). Некоторые свойства (такие как допустимость навигации)\nприменимы только к бинарным ассоциациям, хотя большинство свойств\nотносится и к бинарным, и к n-арным ассоциациям;\n• обобщение (Generalization) — это отношение специализации/обобщения, при\nкотором объекты специализированного элемента (потомка — Child) можно\nподставить вместо объектов обобщенного элемента (родителя, предка —\nParent). В случае обобщения классов прямой предок может именоваться\nсуперклассом, а прямой потомок — подклассом;\n• реализация (Realization) — отношение между спецификацией и ее\nпрограммной реализацией; указание на то, что поведение наследуется без\nструктуры. \n"},{"abzac":"Тема 5. Основы прикладного программирования с использованием языка С++. ","textAbzac":"1. Структура программы на языке C++.\n2. Понятие проекта.\n3. Компиляция программы и сборка исполняемого модуля.\n1. Структура программы на языке C++.\nПоскольку С++ является надмножеством С, то большинство программ на\nязыке С являются также программами и на языке С++. (Имеется несколько\nнебольших различий между С и С++, благодаря которым некоторые типы\nпрограмм на языке С не будут компилироваться компилятором языка С++.\nМожно писать программы на С++, которые выглядят в точности как программы\nна языке С, но в таком случае не будут использоваться преимущества,\nпредоставляемые С++-программистам. Кроме того, большинство\nпрограммистов, пишущих на языке С++, используют стиль и некоторые\nособенности написания программ, которые присущи только С++. Поскольку\nважно использовать весь потенциал С++, то в этом разделе мы обсудим\nнекоторые из таких особенностей, прежде чем перейти к собственно С++.\nНачнем с примера. Рассмотрим программу на языке С++:\n#include <iostream.h>\n#include <stdio.h>\nint main()\n{\nint i ;\nchar str [80] ;\ncout << \"I like Borland C++.\\n\"; // однострочный комментарий\n/* также можно использовать С-комментарии */\nprintf (\"You can use printf(), but, most С++ programs don' t. \\n\");\n// ввод числа с помощью >>\ncout << \"Enter a number: \";\ncin >> i;\n// выводчисласпомощью<<\ncout << \"Your number is \" << i << \"\\n\"; \n32\n// чтениестроки\ncout << \"Enter a string: \";\ncin >>str;\n// вывод\ncout << str;\nreturn 0;\n}\nКак можно видеть, эта программа выглядит совершенно отлично от обычной\nпрограммы на языке С. Заголовочный файл iostream.h определен С++ и\nпредназначен для поддержки операций ввода/вывода. Включение\nзаголовочного файла stdio.h обусловлено использованием функции printf().\nЕсли используются операции ввода/вывода собственно языка С++, то\nнеобходимости в этом файле нет.\nОдной из особенностей, на которую стоит обратить внимание, служит\nобъявление функции main()\nint main()\nвместо\nint main(void)\nкоторое используют программы на языке С. Причина этого заключается в том,\nчто в языке С++ пустой список параметров эквивалентен спецификатору void.\nЭто означает, что оба типа объявления функции равноправны в рамках языка\nС++. В С++ использование зарезервированного слова void для обозначения\nпустого списка параметров является допустимым, но рассматривается как\nизлишество. Поскольку оно не является необходимым, далее в наших\nпрограммах мы не будем использовать слово void для обозначения пустого\nсписка параметров.\nСледующая строка кода содержит несколько особенностей языка С++:\ncout<< \"I like Borland C++.\\n\"; // однострочный комментарий\nОператор\ncout << \"I like Borland C++.\\n\";\nвыводит на экран «I like Borland С++.», после чего следует переход на\nследующую строку и возврат каретки. В С++ роль оператора << значительно\nрасширена. Он продолжает выполнять роль оператора побитового сдвига влево,\nно используется также как оператор вывода данных в случае, если записан в\nуказанной в примере форме. Слово cout представляет собой идентификатор,\nсоответствующий экрану. Так же как и С, язык С++ поддерживает\nперенаправление ввода/ вывода, но, чтобы избежать дискуссий на эту тему, мы\nможем принять, что cout ссылается на экран. Можно использовать cout и\n33\nоператор << для вывода данных любого встроенного типа, а также для вывода\nстрок символов.\nВажно отметить, что можно продолжать пользоваться функцией printf() (что\nпроиллюстрировано в записанной выше программе) или любой другой\nфункцией ввода/вывода языка С, но большинство программистов находят, что\nиспользование cout<< более соответствуют духу С++. В общем случае\nпрограммы на языке С++ могут использовать любые функции,\nподдерживаемые Borland С++, включая и те, что определены языком С. Однако,\nв тех случаях, когда С++ предлагает альтернативный подход, ему следует\nотдавать предпочтение перед использованием функций языка С, хотя и нет\nправил, предписывающих это.\nВ предыдущей строке кода комментарии С++ следовали за выражением для\nвывода данных. В С++ комментарии определяются двумя способами.\nКомментарии языка С сохраняют свое значе\nние и в С++. Однако в С++ можно также определить комментарии размером в\nодну строку, используя //. Когда комментарии начинаются с //, все, что следует\nза этими знаками, игнорируется компилятором до конца строки. Обычно при\nвключении многострочных комментариев используют нотацию С, а\nоднострочных — С++.\nДалее программа выводит запрос-подсказку пользователю, чтобы он ввел\nчисло. Число читается с клавиатуры, используя следующую инструкцию:\ncin>> i;\nВ С++ оператор >> сохраняет свое значение сдвига вправо, но если он\nиспользуется как показано выше, то служит оператором ввода числа с\nклавиатуры и записи его в переменную i. Идентификатор cin ссылается на\nклавиатуру. В общем случае можно использовать cin >> для загрузки\nпеременных любого базового типа или строки.\nХотя в программе это и не проиллюстрировано, можно свободно\nиспользовать любую функцию С для ввода данных, например, функцию scanf(),\nвместо cin >>. Однако, как и в случае с cout, подавляющее большинство\nпрограммистов находят использование cin >> в большей мере со-\nответствующим духу С++.\nРассмотрим другую интересную строку программы:\ncout<< \"Your number is \" << i << \"\\n\";\nЭтот код выводит на экран следующую фразу (предполагается, что значением i\nслужит 100):\nYour number is 100\nпосле которой идет перевод каретки и переход на новую строку. В общем\nслучае можно выполнять столько операций вывода <<, сколько надо. \n34\nОстальная часть программы демонстрирует, как можно прочитать и вывести\nстроку, используя cin >> и cout <<. При вводе строки cin >> прекращает чтение,\nкак только встречает специальный символ. Это аналогично тому, что делает\nстандартная функция scanf() при вводе строки.\n2. Понятие проекта.\nПроект программы это набор компонентов и установленные отношения\nмежду ними. Структура проекта может включать как интерфейсные, так и\nспециальные компоненты. При этом иметься возможность импорта набора\nкомпонентов оформленных ранее как часть проекта.\nСледует помнить, что основное отличие интерфейсных и специальных\nкомпонентов заключается в назначении, для организации взаимодействия\nпрограммы с человеком используются интерфейсные компоненты,\nоформленные в рамках базового объекта – окно. Количество окон в проекте не\nограничено. Специальные компоненты позволяют организовать работу по\nобработке данных, расчетам и т.п., при этом некоторые специальные\nкомпоненты могут предоставлять собственные диалоговые окна\nвзаимодействия с человеком или работать как расширение интерфейсных\nобъектов.\n3. Компиляция программы и сборка исполняемого модуля.\nКомпилятор – это главный инструмент разработчика C++. Наиболее\nизвестные представители:Visual C++ для платформы Windows и GNU C++\nCompiler для всех остальных платформ. Но существуют и другие, также\nзаслуживающие внимания. При написании программ предпочтительно\nкомпилировать их разными компиляторами. Таким образом обеспечивается\nлучшая проверка и обеспечивается независимость от конкретного компилятора.\nЗадача компилятора – трансляция исходного кода программы в бинарное\nпредставление. Бинарным представлением может быть промежуточный байт-\nкод или машинный код. Компиляция состоит из трех этапов: \n35\n• Работа препроцессора. Это обработка\nдиректив #include, #define, #ifdef и т.д. Препроцессор создает\nфайл с исходным кодом, который включает все файлы, подключаемые\nдирективами #include, вырезая текст, исключенный\nдирективами#ifdef/#ifndef.\n• Синтаксический разбор и трансляция текстового представление в\nбинарное. Обычно на данном этапе получают упрощенный бинарный код,\nпонятный только используемому компилятору.\n• Оптимизация бинарного представление и получение результата в виде\nбинарного файла.\nНа последнем этапе компилирования не обязательно выполняется\nоптимизация, это зависит от флагов компилятора. Оптимизация не\nиспользуется при сборке версии приложения, предназначенного для\nотладки.Следующий этап выполняет не компилятор, а линковщик. Это сборка\nобъектных файлов для получения исполняемого модуля или библиотеки.\nОнлайн компиляторы\nИногда возникает необходимость проверить какую-либо конструкцию на\nдругом компиляторе. Ставить сторонний компилятор только ради этого, вряд-\nли имеет смысл. Можно воспользоваться online компилятором.\n• http://codepad.org/\n• http://ideone.com/\n• http://liveworkspace.org/\n"},{"abzac":"Тема 6. Составные типы данных. ","textAbzac":"1. Массивы, описание доступ к элементам.\nВ языке C/C++, кроме базовых типов, разрешено вводить и использовать\nпроизводные типы, полученные на основе базовых. Стандарт языка\nопределяет три способа получения производных типов:\n1. массив элементов заданного типа;\n2. указатель на объект заданного типа;\n3. функция, возвращающая значение заданного типа.\nМассив – это упорядоченная последовательность переменных одного\nтипа. Каждому элементу массива отводится одна ячейка памяти. Элементы\nодного массива занимают последовательно расположенные ячейки памяти. Все\nэлементы имеют одно имя – имя массива и отличаются индексами –\nпорядковыми номерами в массиве. Количество элементов в массиве называется\nего размером. Чтобы отвести в памяти нужное количество ячеек для\nразмещения массива, надо заранее знать его размер. Резервирование памяти для\nмассива выполняется на этапе компиляции программы.\nОпределение массива в C/C++\nint a[100];//массив из 100 элементов целого типа\nОперация sizeof(a) даст результат 400, т.е.100 элементов по 4 байта.\nЭлементы массива всегда нумеруются с 0:\n0 1 2 ….. 99\n1. Чтобы обратиться к элементу массива, надо указать имя массива и номер элемента в\nмассиве (индекс):\na[0] – индекс задается как константа,\na[55] – индекс задается как константа,\na[I] – индекс задается как переменная,\na[2*I] – индекс задается как выражение.\nЭлементы массива можно задавать при его определении: \n37\nint a[12]={1,2,3,4,5,6,7,8,9,10} ;\nОперация sizeof(a) даст результат 40, т.е.10 элементов по 4 байта.\nint a[12]={1,2,3,4,5};\nОперация sizeof(a) даст результат 40, т.е. 10 элементов по 4 байта. Если\nколичество начальных значений меньше, чем объявленная длина массива,\nто начальные элементы массива получат только первые элементы:\nint a[]={1,2,3,4,5};\nОперация sizeof(a) даст результат 20, т.е. 5 элементов по 4 байта. Длин\nмассива вычисляется компилятором по количеству значений,\nперечисленных при инициализации.\n2. Одномерные и многомерные массивы\nПри работе с массивами очень часто требуется одинаково обработать все\nэлементы или часть элементов массива. Для этого организуется перебор\nмассива.\n^ Перебор элементов массива характеризуется:\n1) направлением перебора;\n2) количеством одновременно обрабатываемых элементов;\n3) характером изменения индексов.\n^ По направлению перебора массивы обрабатывают:\n1) слева направо (от начала массива к его концу);\n2) справа налево (от конца массива к началу);\n3) от обоих концов к середине.\nИндексы могут меняться:\n1) линейно (с постоянным шагом);\n2) нелинейно (с переменным шагом).\n3. Структуры\nСтруктуры в C++ представляют из себя нечто одно целое, что содержит в\nсебе целый набор разнообразных, определенных пользователем данных. \n38\nСтруктуры – это составной тип данных, построенный с использованием\nразнообразных типов. Можно как угодно пытаться дать определение, но вряд\nли любое из определений четко покажет и поможет разобраться начинающему.\n—> Структуры очень похожи на массивы.\n—>Если массивы по определению могут содержать внутри себя множество\nоднотипных элементов, то внутри структур можно описать разное количество\nразнотипных элементов. А сами по себе структуры являются пользовательским\nтипом данных.\nPHP\nint A[10]; // Десять элементов\nstruct MyStruct\n{\nint A;\nchar C[10];\n//При этом каждый из этих десяти элементов состоит\nиз двух элементов определенных внутри структуры\nВнутри описанной структуры определено две\nпеременные разных типов (int и char). Переменных\nвнутри структуры может быть разное количество и\nкаждому элементу может соответствовать нужный тип.\nВажно - В структуре весь интерес не в названии\nструктуры, а в названии объекта, т.е. после описания\nструктуры обязательно создается минимум одна\nпеременная тип которой есть имя структуры.\nВ приведенном примере такая переменная – obj1.\nТакие переменные называются объектами. Вот и\nвыходит, что obj1есть переменная типа MyStruct. При\nэтом в приведенном коде переменная obj1 объявлена\nкак массив переменных из десяти элементов. Каждый\nиз этих десяти элементов имеет тип MyStruct и значит\nкаждый элемент массива состоит из тех элементов,\nкоторые описаны внутри структуры.\nВозможно кому-то это поможет, а кто-то сочтет за\nзапутанное и многословное пустословие.\n//Массив из десяти структур. Или просто массив\nструктур.Так как внутри структуры описано две переменные, то будет\nиспользовано по два значения для каждого из элементов массива структур\n(сейчас увидите)\n Рассматривая приведены й код и вникая в смысл структур нужно понять, что\nтеперь при изменении элементов или для вытаскивания элементов из структуры\nдля каждого отдельного элемента массива нужно обращаться к каждому из\nэлементов самой структуры.\nMyStruct obj1[10]; \n39\nPHP\n#include <string.h>\n#include <iostream.h>\nstruct MyStruct\n{\nMyStruct obj1[10]; //Десятьэлементовтипа MyStruct\n//При этом каждый из этих десяти элементов состоит из\nдвух элементов определенных внутри структуры void\nmain()\n{obj1[0].A=100; //Первый элемент массива переменная\nint A\nstrcpy(ob1[0].C,\"12345\"); //Первый элемент массива\nпеременная char C[10]\n}\n В этом коде в переменные массива присваиваются значения. Обращение к\nэлементам структуры можно прописывать через точку. Чтобы работать с\nэлементами массива, который является массивом структур, нужно транзитом\nчерез массив структур обращаться к тем переменным, которые описаны внутри\nструктуры. Использовано два способа присваивания значений. Первый способ\nобычное присваивание через знак равно. Второй способ – это копирование\nстроки в переменную. Нетрудно заметить, что сначала написано имя объекта,\nпотом индекс массива и через точку идет обращение к переменной описанной\nвнутри структуры.\n Иногда известно сколько элементов должен содержать массив и в задачах по\nпрограммированию можно увидеть такие слова: “Создать массив из N\nструктур” и т.п. В простых задачах ничего сложного нет. Часто студенты\nпредлагают ввести N с клавиатуры и при вводе этого N создают массив\nструктур из N элементов.\nPHP\nMyStruct *obj1; //obj1 есть указатель на MyStruct;\nint N; //N есть число элементов массива\ncin>>N; //Присваивание в N значения\nobj1=new MyStruct[N]; //Динамическое выделение памяти под массив\nструктур из N элементов\n //Некоторый код\ndelete []obj1; //Освобождение памяти\n Когда массив структур состоит из некоторого множества элементов, то для\nработы как и с обычным массивом используют циклы. Думаю имеет смысл\nразбивать ввод данных и вывод данных в отдельные функции. В приведенном\nниже примере будет создана простая структура, которая представляет собой\nтип данных Продуктовый магазин. \n40\n Продуктовый магазин представляет из себя одно целое. В магазине могут\nпродавать разные продукты. У каждого продукта есть название, есть цена. В\nмагазине есть разные продавцы, которые продают товар. К каждому продавцу\nподходит покупатель, который покупает товар. Можно долго и много\nрасписывать что происходит на самом деле., но я остановлюсь на том что\nнаписал.\nЧтобы объяснить компилятору что нам нужно, стоит навести некоторый\nпорядок в вышеизложенном.Я разобью на поэтапное изложение кода, чтобы\nбольшинство трудных читателей попробовали понять суть.\nПродуктовый магазин\nPHP\n1\n2\n3 struct Shop\n{\n Определились с обобщенным названием нашей структуры.\nВсё что есть в магазине можно объединить под названием нужные данные.\nPHP\nstruct Shop\n{\nchar name[20]; //Название про\nfloat cena; //Цена продукта\nДата продажи описана как массив из трех целочисленных чисел. Остальным\nпеременным соответствуют различные типы, удобные для обработки\nпеременных. После того как определились и описали нужную структуру\nобязательно создается переменная, тип которой есть имя структуры. Вводятся\nданные в элементы структуры. Нижеприведенный код это всё то что написано\nчуть выше.\nPHP\n#include <iostream>\n/*ОПИСЫВАЕМАЯСТРУКТУРА*/\n struct Shop\n {\n char name[20];\n int cena;\n char prodav[30];\n char pokup[30];\n int date[3];\n };\n/*ГЛАВНАЯФУНКЦИЯ*/\nint main() \n{\n int N;\n cout<<\"Введи N: \";\n cin>>N;\n Shop *M1=new Shop[10]; //Выделение памяти под массив структур из 10 элементов\n delete []M1; //Освобождение памяти\n cin.get(); //Ожидание нажатия клавиши\n return 0;\n}\nСам по себе такой код большого смысла не имеет, это всего лишь\nподготовительная часть для работы с массивом структур.Дальше необходимо\nобеспечить ввод данных в элементы массива структур. Ввод и вывод данных\nудобно обеспечивать через отдельные функции, т.к. нередко создаются\nпользовательские меню с возможностью выбора обработки структур.\nСтруктура очень похожа на массив и передается вовнутрь функции таким же\nобразом. Можно использовать указатель и нужно сделать так, чтоб функция\nзнала размер массива структур. Размер массива структур функции нужно знать\nдля того, чтобы циклы обработки массива структур знали конечную точку\nсвоего выполнения.\nvoid GetData(Shop *M,int N)\n{\n}\n//Первый параметр – указатель на тип Shop. "}]}

/***/ })
/******/ ]);