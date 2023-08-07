const pino = require('pino')
/**
 * @class Logger
 */
module.exports = class Logger {
	constructor(options) {
		return new pino({transport: {target: 'pino-pretty', options: {translateTime: true, ignore: 'pid,hostname'}}, ...options});
	}
}