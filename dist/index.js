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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk = __webpack_require__(10);
const fs = __webpack_require__(2);
// TODO https://stackoverflow.com/questions/41773168/define-prototype-function-with-typescript
const log = console.log;
log.error = (message) => console.log(chalk.red(message));
log.info = (message) => console.log(chalk.blue(message));
log.warn = (message) => console.log(chalk.yellow(message));
log.write = (fileName, object) => fs.writeFileSync(fileName, JSON.stringify(object, null, 2));
exports.default = log;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __webpack_require__(0);
function answerError({ res, filePath, err, statusCode = 400 }) {
    if (statusCode && statusCode < 500)
        log_1.default.warn(`${filePath}: ${err}`);
    else
        log_1.default.error(`${filePath}: ${err}`);
    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            error: {
                code: statusCode,
                message: err
            }
        });
    }
    return res.status(400).json({
        error: {
            code: 400,
            message: 'Bad Request'
        }
    });
}
exports.default = answerError;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Lexpress_1 = __webpack_require__(4);
exports.default = Lexpress_1.default;
const BaseController_1 = __webpack_require__(12);
exports.BaseController = BaseController_1.default;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__filename) {
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __webpack_require__(5);
const express = __webpack_require__(6);
const http = __webpack_require__(7);
const path = __webpack_require__(8);
const mustacheExpress = __webpack_require__(9);
const answerError_1 = __webpack_require__(1);
const fileExists_1 = __webpack_require__(11);
const log_1 = __webpack_require__(0);
const rootPath = process.cwd();
const filePath = path.basename(__filename);
class Lexpress {
    constructor(options) {
        this.routes = options.routes;
        this.init();
    }
    init() {
        // Check and load the local .env file (development mode)
        if (fileExists_1.default(`${rootPath}/.env`))
            dotenv.config({ path: `${rootPath}/.env` });
        this.port = Number(process.env.PORT) || 3000;
        // Initialize the Express app
        this.app = express();
        // Attaches the routes
        this.setRoutes();
        // Define mustache as the template renderer
        this.app.engine('mst', mustacheExpress());
        this.app.set('view engine', 'mst');
        this.app.set('views', `${rootPath}/server/views`);
        // Define 'public' directory as the static files directory
        this.app.use(express.static(`${rootPath}/public`));
    }
    answer(req, res, routeIndex) {
        const { controller, method } = this.routes[routeIndex];
        console.log(`${filePath} > ${method.toUpperCase()} on ${req.path}`);
        try {
            return (new controller(req, res))[method]();
        }
        catch (err) {
            return answerError_1.default({ res, filePath, err });
        }
    }
    setRoutes() {
        this.routes.forEach((route, routeIndex) => this.app[route.method](route.path, (req, res) => this.answer(req, res, routeIndex)));
    }
    start() {
        if (process.env.NODE_ENV === 'development') {
            log_1.default.warn(`Lexpress Server will start in a development mode.`);
            http
                .createServer(this.app)
                .listen(this.port, () => log_1.default.info(`Coinboard Server is listening on port ${this.port}.`));
            return;
        }
        log_1.default.warn(`Lexpress Server will start in a production mode.`);
        this.app.listen(this.port, () => log_1.default.info(`Coinboard Server is listening on port ${this.port}.`));
    }
}
exports.default = Lexpress;

/* WEBPACK VAR INJECTION */}.call(exports, "/index.js"))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("mustache-express");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(2);
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const answerError_1 = __webpack_require__(1);
const log_1 = __webpack_require__(0);
const validate_1 = __webpack_require__(13);
class BaseController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.filePath = this.constructor.name;
    }
    get() { return this.answerError('Not Found', 404); }
    post() { return this.answerError('Not Found', 404); }
    put() { return this.answerError('Not Found', 404); }
    delete() { return this.answerError('Not Found', 404); }
    log(message) {
        log_1.default(`${this.filePath}: ${message}`);
    }
    logError(message) {
        log_1.default.error(`${this.filePath}: ${message}`);
    }
    logWrite(filePath, data) {
        log_1.default.write(filePath, data);
    }
    answerError(err, statusCode) {
        return answerError_1.default({
            res: this.res,
            filePath: this.filePath,
            err,
            statusCode: statusCode || 0,
        });
    }
    validateJsonSchema(schema, cb) {
        this.log(`Validating JSON Schema`);
        return validate_1.default.jsonSchema(schema, this.req.query, (err) => {
            if (err)
                return this.answerError(err);
            return cb();
        });
    }
}
exports.default = BaseController;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = __webpack_require__(14);
const ajv = new Ajv();
const Validate = {
    jsonSchema: (schema, data, cb) => {
        return cb(ajv.validate(schema, data) ? null : ajv.errorsText());
    }
};
exports.default = Validate;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("ajv");

/***/ })
/******/ ]);