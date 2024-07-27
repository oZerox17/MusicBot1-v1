const winston = require("winston");
const colors = require("colors");
const { getCurrentTimeString } = require("../util/dates");

const map = {
	log: { level: "debug", message: "info: ", color: "green" },
	warn: { level: "warn", message: "warn: ", color: "yellow" },
	info: { level: "info", message: "info: ", color: "blue" },
	error: { level: "error", message: "error: ", color: "red" },
	silly: { level: "silly", message: "success: ", color: "rainbow" },
	debug: { level: "info", message: "debug: " },
};


class Logger {
	// Creates a class constructor for winston logging module
	// https://www.npmjs.com/package/winston
	constructor(file) {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.File({ filename: file })
			],
		});
	}

	/**
	 * @param {Formatting} formatting
	 * @param  {...any} args
	 */
	printLog(formatting, ...args) {
		const time = getCurrentTimeString();

		this.logger.log({
			time: `${time}`,
			level: (formatting.level || "debug"),
			message: (formatting.message || "lost: ") + args.join(" "),
		});

		if (formatting.color) {
			console.log(
				colors.gray(time) + 
				colors[formatting.color || "green"](` [${formatting.level.toUpperCase().padEnd(5, ' ')}] | `) + args.join(" ")
			);
		}
	}

	/**
	 * logs a debug level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
	log(...data) {
		this.printLog({
			level: "debug", message: "info: ", color: "green"
		}, ...data);
	}

	/**
	 * logs a warn level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
	warn(...data) {
		this.printLog({
			level: "warn", message: "warn: ", color: "yellow"
		}, ...data);
	}

	/**
	 * logs an info level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
	info(...data) {
		this.printLog({
			level: "info", message: "info: ", color: "blue"
		}, ...data);
	}

	/**
	 * logs an error level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
	error(...data) {
		this.printLog({
			level: "error", message: "error: ", color: "red"
		}, ...data);
	}

	/**
	 * logs a silly level string to the console in appropriate formatting and date
	 * @param {string} text 
	 */
	silly(...data) {
		this.printLog({
			level: "silly", message: "success: ", color: "rainbow"
		}, ...data);
	}

	/**
	 * logs information from the API WS to the log file
	 * @param  {...any} data 
	 */
	debug(...data) {
		this.printLog({
			level: "info", message: "debug: "
		}, ...data);
	}
}

module.exports = Logger;
