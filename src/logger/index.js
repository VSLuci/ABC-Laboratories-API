import { createLogger, transports, format } from 'winston'
require('winston-daily-rotate-file')

function fileOptions(isError = '') {
	let ops = {
		frequency: '1d',
		datePattern: 'DD-MM-YYYY',
		filename: `%DATE%-${isError}.log`,
		dirname: `${__dirname}/logs`,
		zippedArchive: true,
		format: fileFormat,
	}
	if (isError === 'ERROR') {
		ops.level = 'error'
	}

	return ops
}

const fileFormat = format.combine(
	format.timestamp(),
	format.json(),
	format.printf(
		info =>
			`${JSON.stringify({
				level: info.level,
				message: info.message,
				timestamp: info.timestamp,
			})}`
	)
)

const consoleFormat = format.combine(
	format.timestamp(),
	format.prettyPrint(),
	format.printf(info => {
		return `[${info.timestamp}] [${info.level.toUpperCase()}] | ${info.message}`
	})
)

const logger = createLogger({
	format: fileFormat,
	transports: [
		new transports.DailyRotateFile(fileOptions()),
		new transports.DailyRotateFile(fileOptions('ERROR')),
		new transports.Console({ format: consoleFormat }),
	],
})

export default logger
