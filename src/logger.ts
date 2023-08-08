import pino from 'pino';
/**
 * @class Logger
 */
export class Logger {
	constructor(options: any) {
		//@ts-ignore
		return new pino({transport: {target: 'pino-pretty', options: {translateTime: true, ignore: 'pid,hostname'}}, ...options});
	}
}