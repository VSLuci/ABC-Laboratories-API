import logger from '../logger'
import { ApiError } from './api'
import { isEmpty } from 'lodash'

export const globalErrorHandler = (err, req, res) => {
	if (!err instanceof Exception) req.send(new ApiError('Unable to find the requested path'));
	logger.error(err.message)
	res.send(new ApiError(err.message))
}

export class Exception extends Error {
	constructor(message, statusCode, status, data = {}) {
		super()
		this.message = message
		this.statusCode = statusCode
		this.status = status
		this.data = data
	}
}

export class ValidationError extends Exception {
	constructor(message, data = {}) {
		super(message, 210, 'BusinessLogicFail', data)
	}
}

export class BadRequestException extends Exception {
	constructor(message, data) {
		super(message, 400, 'BadRequest', data)
	}
}

export class UnauthorizedException extends Exception {
	constructor(message, data) {
		super(message, 401, 'Unauthorized', data)
	}
}

export class ForbiddenException extends Exception {
	constructor(message, data) {
		super(message, 403, 'Forbidden', data)
	}
}

export class NotFoundException extends Exception {
	constructor(message, data) {
		super(message, 404, 'NotFound', data)
	}
}

export class InternalServerErrorException extends Exception {
	constructor(message, data) {
		super(message, 500, 'InternalServerError', data)
	}
}
