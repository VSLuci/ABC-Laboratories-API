require('./config')
require('./model')
import express from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './util/api'
import logger from './logger'
import cors from 'cors'
import httpLogger from './middleware/httplogger.middleware'
import auth from './router/auth.route'
import home from './router/home.route'
import { jwt } from './middleware/jwtverify.middleware'

const api = express()

// ==================================================== middleware =====================================================
api.use(cors())
api.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	next()
})
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(httpLogger)
// ====================================================== routes =======================================================

// root endpoint
api.all('/', (req, res) => res.send(new ApiResponse({}, 'API has started and working!')))

const base_url = endpoint => `/${endpoint}`

api.use(base_url('auth'), auth)
api.use(base_url('home'), jwt, home)

// ====================================================== LISTEN =======================================================
api.listen(process.env.PORT, error => {
	if (error) logger.error(error.message)

	logger.info(`API Started with port ${process.env.PORT}`)
})
