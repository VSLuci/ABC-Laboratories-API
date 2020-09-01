import path from 'path'
import dotenv from 'dotenv'
import logger from '../logger'

const envFilePath = path.resolve(__dirname, '.env')
const config = dotenv.config({ path: envFilePath })

if (config.error) {
	logger.warn('Could not find configurations from local file. Please make sure to pass them as env variables')
} else {
	logger.info(`loaded configs from .env file`)
}

const ENVS = ['PORT', 'MONGO_URL', 'JWT_SECRET', 'LOGGED_IN_TOKEN_EXPIRATION']

for (let env of ENVS) {
	if (!process.env[env]) {
		throw new Error(`${env} is required in configs`)
	}
}
