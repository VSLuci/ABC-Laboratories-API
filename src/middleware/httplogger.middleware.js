import logger from '../logger'

const httpLogger = (req, res, next) => {
	const message = `${req.method} --> ${req.originalUrl}`

	logger.info(message)

	next()
}

export default httpLogger
