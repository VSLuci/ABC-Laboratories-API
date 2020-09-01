import { isEmpty } from 'lodash'

class Response {
	constructor(success, message, data, pagination) {
		this.success = success
		this.message = message
		if (!isEmpty(data)) {
			this.data = data
		}
		if (!isEmpty(pagination)) {
			this.pagination = pagination
		}
	}
}

export class ApiResponse extends Response {
	constructor(data = {}, message = 'Success', pagination = {}) {
		super(true, message, data, pagination)
	}
}

export class ApiError extends Response {
	constructor(message = 'Something went wrong') {
		super(false, message, {}, {})
	}
}
