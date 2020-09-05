import { InternalServerErrorException, ValidationError, BadRequestException, Exception } from '../util/error'
import { mobileNumberFormatter } from '../helper/general.helper'
import User from '../model/user'
import logger from '../logger'
import { ApiResponse, ApiError } from '../util/api'
import { isEmpty } from 'lodash'
import * as jwt from 'jsonwebtoken'
require('../config')
const secret = process.env.JWT_SECRET

export const register = async (req, res, next) => {
	try {
		const user = req.body
		user.mobile = mobileNumberFormatter(user.mobile)
		if (await validateUser(user, next)) {
			const newUser = new User({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				mobile: user.mobile,
				password: user.password,
			})

			let createdUser = await newUser.save()
			createdUser = createdUser.toObject()
			delete createdUser._id
			delete createdUser.password
			delete createdUser.__v
			delete createdUser.tokens

			logger.info(`New user registration successfull | ${JSON.stringify(createdUser)}`)
			return res.send(new ApiResponse({ user: createdUser }, 'Registration Success!'))
		}
	} catch (error) {
		if (error instanceof Exception) return res.send(new ApiError(error.message))
		else return res.send(new ApiError(error.message, error))
	}
}

async function validateUser(user) {
	try {
		const isExistuserByEmail = await User.findOne({ email: user.email })
		const isExistUserByMobile = await User.findOne({ mobile: user.mobile })
		if (isExistuserByEmail || isExistUserByMobile) {
			return new ValidationError(`New user registration error | Error: User already exists!`)
		} else {
			return true
		}
	} catch (error) {
		return new InternalServerErrorException(error.message, error)
	}
}

export const login = async (req, res) => {
	try {
		const email = req.body.email
		const password = req.body.password

		const user = await User.findOne({ email })

		if (isEmpty(user)) throw new BadRequestException('Email / Password incorrect')

		if (!(await user.comparePassword(password))) throw new BadRequestException('Email / Password incorrect')
		let userObject = {
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			mobil: user.mobile,
		}

		const token = jwt.sign(userObject, secret, {
			expiresIn: process.env.LOGGED_IN_TOKEN_EXPIRATION,
		})
		user.tokens.push(token)

		await user.save()

		logger.info(`User logged in | user: ${userObject.email}`)
		return res.send(new ApiResponse({ user: userObject, token }, 'Login Success!'))
	} catch (error) {
		logger.error(error.message)
		if (error instanceof Exception) return res.send(new ApiError(error.message))
		else return res.send(new ApiError('InternalServerErrorException | ' + error.message))
	}
}
