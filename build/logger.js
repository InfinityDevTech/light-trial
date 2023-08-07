"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require('pino');
/**
 * @class Logger
 */
class Logger {
    constructor(options) {
        return new pino(Object.assign({ transport: { target: 'pino-pretty', options: { translateTime: true, ignore: 'pid,hostname' } } }, options));
    }
}
exports.default = Logger;
