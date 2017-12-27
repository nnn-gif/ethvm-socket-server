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
const global_1 = __webpack_require__(4);
const validRooms_1 = __webpack_require__(5);
exports.default = {
    global: global_1.default,
    validRooms: validRooms_1.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Redis = __webpack_require__(12);
const configs_1 = __webpack_require__(0);
let redis = new Redis(configs_1.default.global.REDIS.URL);
let tables = {
    transactions: 'transactions',
    blocks: 'blocks'
};
let getArray = (tbName, cb) => {
    let vals = redis.get(tbName, (err, result) => {
        if (!err && result) cb(JSON.parse(result));else cb([]);
    });
};
let addTransaction = tx => {
    getArray(tables.transactions, pTxs => {
        if (Array.isArray(tx)) {
            tx.forEach(tTx => {
                pTxs.unshift(tTx);
            });
        } else {
            pTxs.unshift(tx);
        }
        if (pTxs.length > configs_1.default.global.MAX.socketRows) pTxs = pTxs.slice(0, configs_1.default.global.MAX.socketRows);
        redis.set(tables.transactions, JSON.stringify(pTxs));
    });
};
exports.addTransaction = addTransaction;
let addBlock = block => {
    getArray(tables.blocks, pBlocks => {
        pBlocks.unshift(block);
        if (pBlocks.length > configs_1.default.global.MAX.socketRows) pBlocks = pBlocks.slice(0, configs_1.default.global.MAX.socketRows);
        redis.set(tables.blocks, JSON.stringify(pBlocks));
    });
};
exports.addBlock = addBlock;
let getBlocks = cb => {
    getArray(tables.blocks, cb);
};
exports.getBlocks = getBlocks;
let getTransactions = cb => {
    getArray(tables.transactions, cb);
};
exports.getTransactions = getTransactions;
let thisReturnsANumber = (id, name) => {
    return 0;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const SmallBlock_1 = __webpack_require__(15);
exports.SmallBlock = SmallBlock_1.default;
const common = __webpack_require__(17);
exports.common = common;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
const http = __webpack_require__(6);
const rethinkConn_1 = __webpack_require__(7);
const addEvents_1 = __webpack_require__(13);
const server = http.createServer();
const io = __webpack_require__(18)(server, configs_1.default.global.SOCKET_IO);
server.listen(configs_1.default.global.SOCKET_IO.port, configs_1.default.global.SOCKET_IO.ip, () => {
    console.log("Listening on", configs_1.default.global.SOCKET_IO.port);
});
let rdb = new rethinkConn_1.default(io);
io.on('connection', _socket => {
    addEvents_1.default(_socket, rdb);
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    LOKI: {
        dbName: "loki.json",
        tableNames: ["blocks", "transactions"],
        ttl: {
            interval: 5000,
            age: 5 * 60 * 1000
        }
    },
    REDIS: {
        URL: process.env.REDIS_URL
    },
    SOCKET_IO: {
        port: parseInt(process.env.PORT) || 3000,
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: true,
        ip: "0.0.0.0"
    },
    RETHINK_DB: {
        host: "localhost",
        port: 28015,
        db: "eth_mainnet",
        env_cert: "RETHINKDB_CERT",
        env_cert_raw: "RETHINKDB_CERT_RAW",
        env_url: "RETHINKDB_URL"
    },
    MAX: {
        socketRows: 100
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ["blocks", "minedtxs", "pendingTxs", "txs", "uncles"];

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const r = __webpack_require__(8);
const configs_1 = __webpack_require__(0);
const fs = __webpack_require__(9);
const url_1 = __webpack_require__(10);
const yargs_1 = __webpack_require__(11);
const datastore_redis_1 = __webpack_require__(1);
class RethinkDB {
    constructor(_socketIO) {
        this.socketIO = _socketIO;
        this.start();
    }
    start() {
        let _this = this;
        this.tempTxs = [];
        let conf = configs_1.default.global.RETHINK_DB;
        let tempConfig = {
            host: conf.host,
            port: conf.port,
            db: conf.db
        };
        let connect = _config => {
            r.connect(_config, (err, conn) => {
                if (!err) {
                    _this.dbConn = conn;
                    _this.setAllEvents();
                } else {
                    console.log(err);
                }
            });
        };
        let connectWithCert = _cert => {
            let url = new url_1.URL(process.env[conf.env_url]);
            tempConfig = {
                host: url.hostname,
                port: parseInt(url.port),
                password: url.password,
                ssl: {
                    ca: _cert
                },
                db: conf.db
            };
            connect(tempConfig);
        };
        if (yargs_1.argv.remoteRDB && !yargs_1.argv.rawCert) {
            fs.readFile(process.env[conf.env_cert], (err, caCert) => {
                connectWithCert(caCert);
            });
        } else if (yargs_1.argv.remoteRDB && yargs_1.argv.rawCert) {
            connectWithCert(process.env[conf.env_cert_raw]);
        } else {
            connect(tempConfig);
        }
    }
    setAllEvents() {
        let _this = this;
        r.table('blocks').changes().run(_this.dbConn, (err, cursor) => {
            cursor.each((err, row) => {
                if (!err) {
                    _this.onNewBlock(row.new_val);
                    let hashes = row.new_val.transactionHashes.map(_hash => {
                        return r.binary(_hash);
                    });
                    r.table('transactions').getAll(r.args(hashes)).run(_this.dbConn, (err, cursor) => {
                        cursor.toArray(function (err, results) {
                            if (!err) _this.onNewTx(results);
                        });
                    });
                }
            });
        });
    }
    getBlock(hash, cb) {
        r.table('blocks').get(r.binary(new Buffer(hash))).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
        });
    }
    getTx(hash, cb) {
        r.table("transactions").get(r.binary(new Buffer(hash))).run(this.dbConn, (err, result) => {
            if (err) cb(err);else cb(result);
        });
    }
    onNewBlock(_block) {
        let _this = this;
        this.socketIO.to('blocks').emit('newBlock', _block);
        console.log(_block.hash);
        datastore_redis_1.addBlock(_block);
    }
    onNewTx(_tx) {
        this.socketIO.to('txs').emit('newTx', _tx);
        datastore_redis_1.addTransaction(_tx);
    }
}
exports.default = RethinkDB;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("rethinkdb");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("yargs");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const globalFuncs_1 = __webpack_require__(14);
const datastore_redis_1 = __webpack_require__(1);
const libs_1 = __webpack_require__(2);
let events = [{
    name: "join",
    onEvent: (_socket, _msg) => {
        if (globalFuncs_1.isValidRoom(_msg)) {
            _socket.join(_msg);
            globalFuncs_1.log.info(_socket.id, "joined", _msg);
        } else {
            globalFuncs_1.log.error(_socket.id, 'tried to join invalid room', _msg);
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg) => {
        datastore_redis_1.getBlocks(_blocks => {
            _socket.emit('newBlock', _blocks);
        });
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg) => {
        datastore_redis_1.getTransactions(_txs => {
            _socket.emit('newTx', _txs);
        });
    }
}, {
    name: "pastData",
    onEvent: (_socket, _msg) => {
        datastore_redis_1.getTransactions(_txs => {
            datastore_redis_1.getBlocks(_blocks => {
                let blocks = [];
                _blocks.forEach((_block, idx) => {
                    blocks.unshift(new libs_1.SmallBlock(_block).smallify());
                });
                _socket.emit('newBlock', blocks);
                _socket.emit('newTx', _txs);
            });
        });
    }
}];
let onConnection = (_socket, rdb) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, msg => {
            event.onEvent(_socket, msg);
        });
    });
    _socket.on('getBlock', (msg, cb) => {
        rdb.getBlock(msg, cb);
    });
    _socket.on('getTx', (msg, cb) => {
        rdb.getTx(msg, cb);
    });
};
exports.default = onConnection;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __webpack_require__(0);
let isValidRoom = _rName => {
    return configs_1.default.validRooms.indexOf(_rName) > -1;
};
exports.isValidRoom = isValidRoom;
let log = {
    error: (..._msg) => {
        console.error(_msg.join(' '));
    },
    info: (..._msg) => {
        console.info(_msg.join(' '));
    }
};
exports.log = log;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = __webpack_require__(2);
const bignumber_js_1 = __webpack_require__(16);
class SmallBlock {
    constructor(_block) {
        this.block = _block;
    }
    smallify() {
        let _block = this.block;
        return {
            number: _block.number,
            intNumber: _block.intNumber,
            hash: _block.hash,
            miner: _block.miner,
            timestamp: _block.timestamp,
            transactionHashes: _block.transactionHashes,
            transactionCount: _block.transactionHashes.length,
            uncleHashes: _block.uncleHashes,
            isUncle: _block.isUncle,
            totalBlockReward: Buffer.from(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.blockReward)).plus(new bignumber_js_1.default(libs_1.common.bufferToHex(_block.txFees))).toString(16), 'hex')
        };
    }
}
exports.default = SmallBlock;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let bufferToHex = _buf => {
    let r = '0x' + new Buffer(_buf).toString('hex');
    if (r == '0x') r = "0x0";
    return r;
};
exports.bufferToHex = bufferToHex;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })
/******/ ]);