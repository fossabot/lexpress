(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports) {

module.exports = require("@inspired-beings/log");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("memory-cache");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const keyifyObject_1 = __webpack_require__(13);
function default_1(req) {
    let keyQuery = req.originalUrl
        .toLocaleLowerCase()
        .replace(/\//g, '$');
    if (keyQuery.length > 1)
        keyQuery = keyQuery.replace(/\$$/, '');
    let keyParams;
    switch (req.method) {
        case 'GET':
            keyParams = keyifyObject_1.default(req.query);
            break;
        case 'POST':
        case 'PUT':
        case 'DELETE':
            keyParams = keyifyObject_1.default(req.body);
            break;
        default:
    }
    return keyParams.length === 0 ? keyQuery : `${keyQuery}-${keyParams}`;
}
exports.default = default_1;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(0);
const CACHE_EXPIRATION_IN_SECONDS = 60;
const HTTP_STATUS_CODE_BAD_REQUEST = 400;
const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
function answerError({ err, isJson, res, statusCode, scope }) {
    if (statusCode !== undefined && statusCode < HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR) {
        log_1.default.warn(`${scope}: ${err}`);
    }
    else {
        log_1.default.err(`${scope}: ${err}`);
    }
    if (isJson) {
        if (process.env.NODE_ENV === 'development') {
            res.status(statusCode).json({
                error: {
                    code: statusCode,
                    message: err
                }
            });
            return;
        }
        res.status(HTTP_STATUS_CODE_BAD_REQUEST).cache(CACHE_EXPIRATION_IN_SECONDS).json({
            error: {
                code: HTTP_STATUS_CODE_BAD_REQUEST,
                message: 'Bad Request'
            }
        });
        return;
    }
    if (process.env.NODE_ENV === 'development') {
        res.render(String(statusCode));
        return;
    }
    res.cache(CACHE_EXPIRATION_IN_SECONDS).render(String(statusCode));
}
exports.default = answerError;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Lexpress_1 = __webpack_require__(6);
exports.Lexpress = Lexpress_1.default;
const BaseController_1 = __webpack_require__(19);
exports.BaseController = BaseController_1.default;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(0);
const bodyParser = __webpack_require__(7);
// import * as connectRedis from 'connect-redis'
const dotenv = __webpack_require__(1);
const express = __webpack_require__(8);
const expressSession = __webpack_require__(9);
const https = __webpack_require__(10);
const memoryCache = __webpack_require__(2);
// import * as R from 'ramda'
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const mustacheExpress = __webpack_require__(11);
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const pug = __webpack_require__(12);
const keyifyRequest_1 = __webpack_require__(3);
const answerError_1 = __webpack_require__(4);
const fileExists_1 = __webpack_require__(14);
const logo_1 = __webpack_require__(16);
const cache_1 = __webpack_require__(18);
const LEXPRESS_OPTIONS_DEFAULT = {
    headers: {},
    https: false,
    middlewares: [],
    routes: [],
    viewsEngine: 'mustache',
    viewsPath: 'src',
};
const PORT_DEFAULT = 3000;
const SESSION_SECRET_LENGTH_MIN = 32;
const rootPath = process.cwd();
// Check and load the local .env file (development mode)
if (fileExists_1.default(`${rootPath}/.env`))
    dotenv.config({ path: `${rootPath}/.env` });
class Lexpress {
    constructor(options) {
        const optionsFull = Object.assign({}, LEXPRESS_OPTIONS_DEFAULT, options);
        this.headers = optionsFull.headers;
        this.https = optionsFull.https;
        this.middlewares = optionsFull.middlewares;
        this.notFoundmiddleware = optionsFull.notFoundmiddleware;
        this.routes = optionsFull.routes;
        this.staticPath = optionsFull.staticPath;
        this.viewsEngine = optionsFull.viewsEngine;
        this.viewsPath = optionsFull.viewsPath;
        this.init();
    }
    init() {
        this.port = process.env.PORT !== undefined ? Number(process.env.PORT) : PORT_DEFAULT;
        // Initialize the Express app
        this.app = express();
        // Attach the middlewares
        this.setMiddlewares();
        this.setCustomMiddlewares();
        // Attach the routes
        this.setRoutes();
        // Define the template renderer
        switch (this.viewsEngine) {
            case 'pug':
                this.app.engine('pug', pug.__express);
                this.app.set('view engine', 'pug');
                break;
            default:
                this.app.engine('mst', mustacheExpress());
                this.app.set('view engine', 'mst');
        }
        // Set the views workspace relative path
        this.app.set('views', `${rootPath}/${this.viewsPath}`);
        // Set the static files workspace relative path
        this.app.use(express.static(`${rootPath}/${this.staticPath}`));
        // Set the response headers
        this.app.all('*', (req, res, next) => {
            let key;
            for (key in this.headers) {
                if (this.headers.hasOwnProperty(key))
                    res.header(key, this.headers[key]);
            }
            next();
        });
        // Define 'public' directory as the static files directory
        this.app.use(express.static(`${rootPath}/public`));
        // Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers
        // to determine the connection and the IP address of the client.
        // NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
        // https://expressjs.com/en/4x/api.html#app.settings.table
        if (process.env.NODE_ENV === 'production')
            this.app.enable('trust proxy');
        // Attach the 404 error middleware
        if (this.notFoundmiddleware !== undefined)
            this.app.use(this.notFoundmiddleware);
    }
    answer(req, res, routeIndex, routeSettings = {}) {
        // tslint:disable-next-line:variable-name
        const { controller: Controller, method } = this.routes[routeIndex];
        if (routeSettings.isCached === undefined || routeSettings.isCached) {
            // Check if a cached content exists for this query,
            const cachedContent = this.cache(req, res);
            // and send it if there is one.
            if (cachedContent !== undefined) {
                cachedContent.isJson ? res.json(cachedContent.body) : res.send(cachedContent.body);
                return;
            }
        }
        let key;
        for (key in this.headers) {
            if (this.headers.hasOwnProperty(key))
                res.header(key, this.headers[key]);
        }
        log_1.default(`${method.toUpperCase()} on ${req.path} > ${Controller.name}.${method}()`);
        try {
            const controller = new Controller(req, res);
            controller[method]();
        }
        catch (err) {
            answerError_1.default({
                err,
                isJson: true,
                res,
                scope: `${Controller.name}.${method}()`,
            });
        }
    }
    cache(req, res) {
        // We generate the cache key
        const key = keyifyRequest_1.default(req);
        // We try to get the cache, in case it exists
        const cacheContent = memoryCache.get(key);
        // If the cache exists, we return its content
        return cacheContent !== null ? cacheContent : undefined;
    }
    setCustomMiddlewares() {
        this.middlewares.forEach((middleware) => this.app.use(middleware));
    }
    setMiddlewares() {
        if (typeof process.env.SESSION_SECRET !== 'string'
            || process.env.SESSION_SECRET.length < SESSION_SECRET_LENGTH_MIN) {
            log_1.default.err(`Lexpress#setMiddlewares(): Your %s must contain at least 32 characters.`, 'process.env.SESSION_SECRET');
        }
        // if (typeof process.env.REDIS_URL !== 'string' || process.env.REDIS_URL.length === 0) {
        //   log.err(`Lexpress#init(): You must set your %s.`, 'process.env.REDIS_URL')
        // }
        // tslint:disable-next-line:variable-name
        // const RedisStore: connectRedis.RedisStore = connectRedis(expressSession)
        // Parse application/json request body
        this.app.use(bodyParser.json());
        // Parse application/x-www-form-urlencoded request body
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(expressSession({
            cookie: {
                secure: process.env.NODE_ENV === 'production'
            },
            proxy: process.env.NODE_ENV === 'production',
            resave: true,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
        }));
        this.app.use(cache_1.default);
    }
    setRoutes() {
        this.routes.forEach((route, routeIndex) => route.middleware !== undefined
            ? route.call !== undefined
                ? this.app[route.method](route.path, route.middleware, route.call)
                : this.app[route.method](route.path, route.middleware, (req, res) => {
                    this.answer(req, res, routeIndex, route.settings);
                })
            : route.call !== undefined
                ? this.app[route.method](route.path, route.call)
                : this.app[route.method](route.path, (req, res) => {
                    this.answer(req, res, routeIndex, route.settings);
                }));
    }
    start() {
        // tslint:disable-next-line:no-console
        console.log(logo_1.default);
        if (this.https === false) {
            this.startHttp();
            return;
        }
        this.startHttps();
    }
    startHttp() {
        const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';
        log_1.default.warn(`Lexpress Server will start in a ${nodeEnv} mode (non-secure).`);
        this.app.listen(this.port, () => log_1.default.info(`Lexpress Server is listening on port ${this.port}.`));
    }
    startHttps() {
        const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';
        log_1.default.warn(`Lexpress Server will start in a ${nodeEnv} mode (secure).`);
        https
            .createServer(this.https, this.app)
            .listen(this.port, () => log_1.default.info(`Lexpress Server is listening on port ${this.port}.`));
    }
}
exports.default = Lexpress;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("mustache-express");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("pug");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(value) {
    return JSON.stringify(value)
        .replace(/\W+/g, '-')
        .replace(/^-|-$/g, '')
        .toLocaleLowerCase();
}
exports.default = default_1;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(15);
function fileExists(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.default = fileExists;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __webpack_require__(17);
// Is replaced with postversion script
const VERSION = `0.34.3`;
exports.default = chalk_1.default.gray(`
,
"\\",
"=\\=",
 "=\\=",
  "=\\=",
   "-\\-"
      \\
       \\  ${chalk_1.default.magenta('Lexpress')} ${chalk_1.default.blue(VERSION)}

`);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(0);
const dotenv = __webpack_require__(1);
const memoryCache = __webpack_require__(2);
const keyifyRequest_1 = __webpack_require__(3);
dotenv.config();
const SECONDS_IN_MILLISECONDS = 1000;
function cache(req, res, next) {
    res.cache = (forInSeconds) => {
        const expirationInMs = forInSeconds * SECONDS_IN_MILLISECONDS;
        // We generate the cache key
        const key = keyifyRequest_1.default(req);
        // We augment the Express json() method
        const jsonAugmented = (body) => {
            if (process.env.NODE_ENV === 'development') {
                log_1.default.info(`Caching %s key for %sms`, key, expirationInMs);
            }
            memoryCache.put(key, body, expirationInMs);
            return res.json({ isJson: true, body });
        };
        // We augment the Express render() method
        const renderAugmented = (view, options, callback) => {
            if (options !== undefined && typeof options === 'object') {
                res.render(view, options, (err, html) => {
                    if (err === null) {
                        if (process.env.NODE_ENV === 'development') {
                            log_1.default.info(`Caching %s key for %sms`, key, expirationInMs);
                        }
                        memoryCache.put(key, { isJson: false, body: html }, expirationInMs);
                    }
                    if (callback !== undefined) {
                        callback(err, html);
                        return;
                    }
                    res.send(html);
                });
                return;
            }
            res.render(view, (err, html) => {
                if (err === null) {
                    if (process.env.NODE_ENV === 'development') {
                        log_1.default.info(`Caching %s key for %sms`, key, expirationInMs);
                    }
                    memoryCache.put(key, { isJson: false, body: html }, expirationInMs);
                }
                if (callback !== undefined) {
                    callback(err, html);
                    return;
                }
                res.send(html);
            });
            return;
        };
        return {
            json: jsonAugmented,
            render: renderAugmented,
        };
    };
    next();
}
exports.default = cache;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(0);
const answerError_1 = __webpack_require__(4);
const jsonSchemaValidate_1 = __webpack_require__(20);
const HTTP_STATUS_CODE_NOT_FOUND = 404;
class BaseController {
    constructor(req, res) {
        this.controllerName = this.constructor.name;
        this.isJson = true;
        this.req = req;
        this.res = res;
    }
    get() {
        this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND);
    }
    post() {
        this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND);
    }
    put() {
        this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND);
    }
    delete() {
        this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND);
    }
    log(message) {
        log_1.default(`${this.controllerName}: ${message}`);
    }
    logError(message) {
        log_1.default.err(`${this.controllerName}: ${message}`);
    }
    // protected logWrite(controllerName: string, data: {}): void {
    //   log.write(controllerName, data)
    // }
    answerError(err, statusCode = 400) {
        answerError_1.default({
            err,
            isJson: this.isJson,
            res: this.res,
            scope: this.controllerName,
            statusCode,
        });
    }
    validateJsonSchema(schema, cb) {
        this.log(`Validating JSON Schema`);
        jsonSchemaValidate_1.default(schema, this.req.query, (err) => {
            if (err !== null) {
                this.answerError(err);
                return;
            }
            cb();
        });
    }
}
exports.default = BaseController;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = __webpack_require__(21);
const ajv = new Ajv();
function default_1(schema, data, cb) {
    cb(ajv.validate(schema, data) ? null : ajv.errorsText());
}
exports.default = default_1;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("ajv");

/***/ })
/******/ ])));