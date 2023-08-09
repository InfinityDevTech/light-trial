"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const pino_1 = __importDefault(require("pino"));
/**
 * @class Logger
 */
class Logger {
    constructor(options) {
        //@ts-ignore
        return new pino_1.default(Object.assign({ transport: { target: 'pino-pretty', options: { translateTime: true, ignore: 'pid,hostname' } } }, options));
    }
}
exports.Logger = Logger;
